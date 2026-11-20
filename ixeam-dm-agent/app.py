"""IXEAM DM agent — webhook server for Instagram + Facebook Messenger.

Run:  uvicorn app:app --host 0.0.0.0 --port 8000
"""

from dotenv import load_dotenv

load_dotenv()  # must run before the modules below read their settings

import asyncio  # noqa: E402
import json  # noqa: E402
import logging  # noqa: E402
import os  # noqa: E402
from collections import defaultdict  # noqa: E402

from fastapi import FastAPI, HTTPException, Request  # noqa: E402
from fastapi.responses import PlainTextResponse  # noqa: E402

import meta  # noqa: E402
import store  # noqa: E402
from agent import generate_reply  # noqa: E402

logging.basicConfig(level=os.getenv("LOG_LEVEL", "INFO"),
                    format="%(asctime)s %(levelname)s %(name)s: %(message)s")
log = logging.getLogger("ixeam.app")

VERIFY_TOKEN = os.getenv("META_VERIFY_TOKEN", "")
ADMIN_TOKEN = os.getenv("ADMIN_TOKEN", "")
DEBOUNCE_SECONDS = float(os.getenv("DEBOUNCE_SECONDS", "4"))
HANDOFF_PAUSE_HOURS = float(os.getenv("HANDOFF_PAUSE_HOURS", "12"))
HUMAN_REPLY_PAUSE_HOURS = float(os.getenv("HUMAN_REPLY_PAUSE_HOURS", "12"))

app = FastAPI(title="IXEAM DM Agent")

# People often send several messages in a row ("salam" / "bghit nsowel" / photo).
# We wait DEBOUNCE_SECONDS after the last one, then answer everything in one reply.
_pending: dict[str, list[dict]] = defaultdict(list)
_timers: dict[str, asyncio.Task] = {}
_locks: dict[str, asyncio.Lock] = defaultdict(asyncio.Lock)
_background: set[asyncio.Task] = set()


def _spawn(coro) -> asyncio.Task:
    task = asyncio.create_task(coro)
    _background.add(task)
    task.add_done_callback(_background.discard)
    return task


@app.get("/")
async def health():
    return {"status": "ok", "service": "IXEAM DM Agent"}


@app.get("/webhook")
async def verify(request: Request):
    """Meta calls this once when you register the webhook URL."""
    q = request.query_params
    if q.get("hub.mode") == "subscribe" and VERIFY_TOKEN and q.get("hub.verify_token") == VERIFY_TOKEN:
        return PlainTextResponse(q.get("hub.challenge", ""))
    raise HTTPException(status_code=403, detail="Verification failed")


@app.post("/webhook")
async def receive(request: Request):
    body = await request.body()
    if not meta.verify_signature(body, request.headers.get("x-hub-signature-256")):
        raise HTTPException(status_code=403, detail="Bad signature")
    data = json.loads(body)
    platform = "instagram" if data.get("object") == "instagram" else "messenger"

    for entry in data.get("entry", []):
        for event in entry.get("messaging", []):
            _handle_event(event, platform)
    # Answer Meta immediately; the reply is produced in the background.
    return PlainTextResponse("EVENT_RECEIVED")


def _handle_event(event: dict, platform: str) -> None:
    msg = event.get("message")
    postback = event.get("postback")  # "Get started" button, ice breakers, menu
    sender = event.get("sender", {}).get("id")
    recipient = event.get("recipient", {}).get("id")

    if msg and msg.get("is_echo"):
        # A message sent FROM the page: either our bot, or a team member typing in the inbox.
        if msg.get("mid") and recipient:
            _spawn(_check_human_echo(f"{platform}:{recipient}", platform, msg))
        return

    if not sender or not (msg or postback):
        return  # deliveries, reads, reactions...
    if msg and (msg.get("is_deleted") or msg.get("is_unsupported")):
        return
    mid = (msg or {}).get("mid") or (postback or {}).get("mid") or ""
    if mid and not store.mark_mid(mid, "received"):
        return  # Meta re-delivered an event we already handled

    user_key = f"{platform}:{sender}"
    store.ensure_conversation(user_key, platform)
    item = {"text": (msg or {}).get("text") or (postback or {}).get("title") or "",
            "attachments": (msg or {}).get("attachments", [])}
    _pending[user_key].append(item)

    if (old := _timers.get(user_key)) and not old.done():
        old.cancel()
    _timers[user_key] = _spawn(_debounced(user_key, sender, platform))


async def _check_human_echo(user_key: str, platform: str, msg: dict) -> None:
    await asyncio.sleep(5)  # let our own send call record its message id first
    if store.is_bot_mid(msg["mid"]) or not store.mark_mid(msg["mid"], "echo"):
        return
    # A human from the team answered manually: the bot steps back for this customer.
    store.ensure_conversation(user_key, platform)
    store.add_message(user_key, "human", msg.get("text") or "[pièce jointe]")
    store.pause(user_key, HUMAN_REPLY_PAUSE_HOURS)
    log.info("Team member replied to %s manually: bot paused %sh", user_key, HUMAN_REPLY_PAUSE_HOURS)


async def _debounced(user_key: str, sender: str, platform: str) -> None:
    try:
        await asyncio.sleep(DEBOUNCE_SECONDS)
    except asyncio.CancelledError:
        return
    async with _locks[user_key]:
        items, _pending[user_key] = _pending[user_key], []
        if items:
            await _process(user_key, sender, platform, items)


async def _process(user_key: str, sender: str, platform: str, items: list[dict]) -> None:
    texts, notes, images = [], [], []
    for item in items:
        if item["text"]:
            texts.append(item["text"])
        for att in item["attachments"]:
            kind, url = att.get("type"), (att.get("payload") or {}).get("url")
            if kind == "image" and url:
                if block := await meta.download_image(url):
                    images.append(block)
                else:
                    notes.append("[Le client a envoyé une image qui n'a pas pu être chargée]")
            elif kind in ("video", "audio", "file"):
                notes.append(f"[Le client a envoyé un fichier {kind} que tu ne peux pas voir/écouter : "
                             "remercie-le et demande-lui de décrire ou d'envoyer des photos]")
            elif kind in ("share", "ig_reel", "reel", "story_mention", "ig_post"):
                notes.append(f"[Le client a partagé un contenu Instagram ({kind})]")
            else:
                notes.append(f"[Pièce jointe de type {kind}]")

    text_part = "\n".join(texts + notes) or "[message sans texte]"

    if store.is_paused(user_key):
        # A human is handling this customer: keep the history, don't answer.
        store.add_message(user_key, "user", text_part + (" [photo envoyée]" if images else ""))
        log.info("%s is paused (human takeover): message stored, no bot reply", user_key)
        return

    await meta.send_typing(sender)
    history = store.history_for_claude(user_key)
    content = images + [{"type": "text", "text": f"[Canal : {platform}]\n{text_part}"}]
    result = await generate_reply(history, content)

    # History keeps a text note instead of the photo bytes (cheaper on later turns).
    stored = text_part
    if images:
        stored += f"\n[{len(images)} photo(s) envoyée(s) : {result.photo_notes or 'produit'}]"
    store.add_message(user_key, "user", stored)

    for mid in await meta.send_text(sender, result.reply, platform):
        store.mark_mid(mid, "sent")
    store.add_message(user_key, "assistant", result.reply)

    lead = result.lead.model_dump()
    store.save_lead(user_key, lead, result.handoff_reason if result.handoff else "")

    if result.handoff:
        store.pause(user_key, HANDOFF_PAUSE_HOURS)
        known = {k: v for k, v in lead.items() if v}
        await meta.notify_owner(
            f"🔔 IXEAM — client à reprendre ({platform})\n"
            f"Raison : {result.handoff_reason}\n"
            f"Infos : {json.dumps(known, ensure_ascii=False)}\n"
            f"Dernier message : {text_part[:300]}"
        )
        log.info("Handoff for %s: %s", user_key, result.handoff_reason)


# --- small admin API (protect it with ADMIN_TOKEN) ---

def _check_admin(request: Request) -> None:
    if not ADMIN_TOKEN or request.headers.get("authorization") != f"Bearer {ADMIN_TOKEN}":
        raise HTTPException(status_code=401, detail="Unauthorized")


@app.get("/admin/leads")
async def leads(request: Request):
    _check_admin(request)
    return store.list_leads()


@app.post("/admin/resume/{user_key}")
async def resume(user_key: str, request: Request):
    """Turn the bot back on for a customer before the pause ends."""
    _check_admin(request)
    store.resume(user_key)
    return {"resumed": user_key}
