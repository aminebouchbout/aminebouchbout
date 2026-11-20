"""Calls Claude to produce the next DM reply, as structured output."""

import logging
import os

import anthropic
from pydantic import BaseModel, Field

from prompt import build_system_prompt

log = logging.getLogger("ixeam.agent")

MODEL = os.getenv("AGENT_MODEL", "claude-opus-5-5")
# Chat replies don't need deep reasoning; "low" keeps answers fast and cheap.
EFFORT = os.getenv("AGENT_EFFORT", "low")


class Lead(BaseModel):
    name: str = Field(description="Nom du client, ou chaîne vide")
    phone: str = Field(description="Numéro WhatsApp/téléphone, ou chaîne vide")
    business: str = Field(description="Marque / boutique / activité, ou chaîne vide")
    product: str = Field(description="Produit à promouvoir, ou chaîne vide")
    target_customer: str = Field(description="Client cible, ou chaîne vide")
    services: list[str] = Field(description="Services IXEAM qui intéressent le client")
    budget: str = Field(description="Budget indiqué, ou chaîne vide")
    city: str = Field(description="Ville / pays, ou chaîne vide")


class AgentReply(BaseModel):
    reply: str = Field(description="Le message exact à envoyer au client")
    handoff: bool = Field(description="True si un humain doit prendre le relais")
    handoff_reason: str = Field(description="Pourquoi passer la main, ou chaîne vide")
    lead: Lead
    photo_notes: str = Field(description="Description des photos du dernier message, ou chaîne vide")


# Sent when Claude can't answer (API down, refusal...). Darija + French so it fits most clients.
SAFE_REPLY = (
    "شكراً على الميساج ديالك 🙏 واحد من الفريق ديال IXEAM غادي يجاوبك قريب.\n"
    "Merci pour votre message, un membre de l'équipe vous répond très vite."
)

_client = anthropic.AsyncAnthropic()


async def generate_reply(history: list[dict], new_content: list[dict]) -> AgentReply:
    """history: earlier turns (plain text). new_content: content blocks of the new user turn."""
    messages = history + [{"role": "user", "content": new_content}]
    try:
        response = await _client.beta.messages.parse(
            model=MODEL,
            max_tokens=16000,
            system=build_system_prompt(),
            messages=messages,
            output_format=AgentReply,
            output_config={"effort": EFFORT},
            cache_control={"type": "ephemeral"},
            # If a safety classifier declines, the API retries on Anthropic's recommended model.
            betas=["server-side-fallback-2026-07-01"],
            fallbacks="default",
        )
    except anthropic.APIStatusError as e:
        log.error("Claude API error %s: %s (request id %s)", e.status_code, e.message, e.request_id)
        return _safe("Erreur API Claude")
    except anthropic.APIConnectionError:
        log.exception("Cannot reach the Claude API")
        return _safe("Claude injoignable")

    if response.stop_reason == "refusal" or response.parsed_output is None:
        log.warning("No usable reply (stop_reason=%s)", response.stop_reason)
        return _safe(f"Pas de réponse IA (stop_reason={response.stop_reason})")

    u = response.usage
    log.info(
        "Claude ok: in=%s cache_read=%s out=%s",
        u.input_tokens, u.cache_read_input_tokens, u.output_tokens,
    )
    return response.parsed_output


def _safe(reason: str) -> AgentReply:
    return AgentReply(
        reply=SAFE_REPLY,
        handoff=True,
        handoff_reason=reason,
        lead=Lead(name="", phone="", business="", product="", target_customer="",
                  services=[], budget="", city=""),
        photo_notes="",
    )
