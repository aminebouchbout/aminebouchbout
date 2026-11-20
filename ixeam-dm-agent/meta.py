"""Meta Graph API helpers: send messages (Instagram + Messenger), download photos, verify webhooks."""

import base64
import hashlib
import hmac
import logging
import os

import httpx

log = logging.getLogger("ixeam.meta")

GRAPH_VERSION = os.getenv("GRAPH_API_VERSION", "v24.0")
PAGE_ACCESS_TOKEN = os.getenv("PAGE_ACCESS_TOKEN", "")
APP_SECRET = os.getenv("META_APP_SECRET", "")

# Instagram DMs are limited to 1000 characters, Messenger to 2000.
MAX_LEN = {"instagram": 1000, "messenger": 2000}
IMAGE_TYPES = {"image/jpeg", "image/png", "image/gif", "image/webp"}
MAX_IMAGE_BYTES = 5 * 1024 * 1024

_http = httpx.AsyncClient(timeout=30)


def verify_signature(body: bytes, header: str | None) -> bool:
    """Check X-Hub-Signature-256 so only Meta can call the webhook."""
    if not APP_SECRET:
        log.warning("META_APP_SECRET is not set: webhook signatures are NOT checked")
        return True
    if not header or not header.startswith("sha256="):
        return False
    expected = hmac.new(APP_SECRET.encode(), body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, header.removeprefix("sha256="))


def _split(text: str, limit: int) -> list[str]:
    chunks, current = [], ""
    for para in text.split("\n"):
        candidate = f"{current}\n{para}" if current else para
        if len(candidate) <= limit:
            current = candidate
            continue
        if current:
            chunks.append(current)
        while len(para) > limit:
            chunks.append(para[:limit])
            para = para[limit:]
        current = para
    if current:
        chunks.append(current)
    return chunks


async def _post(payload: dict) -> dict | None:
    url = f"https://graph.facebook.com/{GRAPH_VERSION}/me/messages"
    r = await _http.post(url, params={"access_token": PAGE_ACCESS_TOKEN}, json=payload)
    if r.status_code != 200:
        log.error("Send API error %s: %s", r.status_code, r.text[:500])
        return None
    return r.json()


async def send_typing(recipient_id: str) -> None:
    try:
        await _post({"recipient": {"id": recipient_id}, "sender_action": "typing_on"})
    except httpx.HTTPError:
        pass  # cosmetic only


async def send_text(recipient_id: str, text: str, platform: str) -> list[str]:
    """Send a reply; returns the message ids Meta assigned (used to recognise echoes)."""
    mids = []
    for chunk in _split(text.strip(), MAX_LEN.get(platform, 1000)):
        data = await _post({
            "recipient": {"id": recipient_id},
            "messaging_type": "RESPONSE",
            "message": {"text": chunk},
        })
        if data and data.get("message_id"):
            mids.append(data["message_id"])
    return mids


async def download_image(url: str) -> dict | None:
    """Fetch a photo the customer sent and return a Claude image block (base64)."""
    try:
        r = await _http.get(url, follow_redirects=True)
        r.raise_for_status()
    except httpx.HTTPError as e:
        log.error("Could not download attachment: %s", e)
        return None
    media_type = r.headers.get("content-type", "").split(";")[0].strip().lower()
    if media_type not in IMAGE_TYPES or len(r.content) > MAX_IMAGE_BYTES:
        log.warning("Skipping attachment (%s, %d bytes)", media_type, len(r.content))
        return None
    return {
        "type": "image",
        "source": {
            "type": "base64",
            "media_type": media_type,
            "data": base64.standard_b64encode(r.content).decode(),
        },
    }


async def notify_owner(text: str) -> None:
    """Optional: ping the team on Telegram when a lead needs a human."""
    token, chat_id = os.getenv("TELEGRAM_BOT_TOKEN"), os.getenv("TELEGRAM_CHAT_ID")
    if not (token and chat_id):
        return
    try:
        await _http.post(f"https://api.telegram.org/bot{token}/sendMessage",
                         json={"chat_id": chat_id, "text": text})
    except httpx.HTTPError as e:
        log.error("Telegram notification failed: %s", e)
