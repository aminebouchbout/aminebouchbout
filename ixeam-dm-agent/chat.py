"""Test the agent in your terminal, without Instagram/Facebook.

    python chat.py
    python chat.py --photo chemin/vers/produit.jpg   (envoie une photo au 1er message)
"""

from dotenv import load_dotenv

load_dotenv()

import argparse  # noqa: E402
import asyncio  # noqa: E402
import base64  # noqa: E402
import mimetypes  # noqa: E402

from agent import generate_reply  # noqa: E402


def image_block(path: str) -> dict:
    media_type = mimetypes.guess_type(path)[0] or "image/jpeg"
    with open(path, "rb") as f:
        data = base64.standard_b64encode(f.read()).decode()
    return {"type": "image", "source": {"type": "base64", "media_type": media_type, "data": data}}


async def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--photo", help="photo de produit à joindre au premier message")
    args = parser.parse_args()

    history: list[dict] = []
    photo = args.photo
    print("Client (Ctrl+C pour quitter) — écrivez comme un client sur Instagram.\n")
    while True:
        try:
            text = input("Client > ").strip()
        except (EOFError, KeyboardInterrupt):
            print()
            return
        if not text and not photo:
            continue
        content = ([image_block(photo)] if photo else []) + [
            {"type": "text", "text": f"[Canal : instagram]\n{text or '[photo sans texte]'}"}
        ]
        result = await generate_reply(history, content)
        print(f"\nIXEAM > {result.reply}\n")
        known = {k: v for k, v in result.lead.model_dump().items() if v}
        if known:
            print(f"   (infos client : {known})")
        if result.photo_notes:
            print(f"   (photo : {result.photo_notes})")
        if result.handoff:
            print(f"   (→ PASSAGE À UN HUMAIN : {result.handoff_reason})")
        print()

        stored = text + (f"\n[photo envoyée : {result.photo_notes}]" if photo else "")
        history += [{"role": "user", "content": stored},
                    {"role": "assistant", "content": result.reply}]
        photo = None


if __name__ == "__main__":
    asyncio.run(main())
