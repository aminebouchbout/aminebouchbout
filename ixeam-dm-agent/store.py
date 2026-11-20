"""Small SQLite store: conversation history, leads, pauses, de-duplication."""

import json
import os
import sqlite3
import threading
import time

DB_PATH = os.getenv("DB_PATH", "ixeam_agent.db")
HISTORY_LIMIT = int(os.getenv("HISTORY_LIMIT", "30"))

_lock = threading.Lock()
_db = sqlite3.connect(DB_PATH, check_same_thread=False)
_db.executescript(
    """
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_key TEXT NOT NULL,
        role TEXT NOT NULL,          -- 'user' | 'assistant' | 'human' (admin reply)
        content TEXT NOT NULL,
        ts REAL NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_messages_user ON messages(user_key, id);
    CREATE TABLE IF NOT EXISTS conversations (
        user_key TEXT PRIMARY KEY,
        platform TEXT NOT NULL,
        paused_until REAL NOT NULL DEFAULT 0,
        lead TEXT NOT NULL DEFAULT '{}',
        handoff_reason TEXT NOT NULL DEFAULT '',
        updated REAL NOT NULL
    );
    CREATE TABLE IF NOT EXISTS seen_mids (mid TEXT PRIMARY KEY, kind TEXT NOT NULL, ts REAL NOT NULL);
    """
)
_db.commit()


def _exec(sql: str, args: tuple = ()) -> list[tuple]:
    with _lock:
        rows = _db.execute(sql, args).fetchall()
        _db.commit()
        return rows


def ensure_conversation(user_key: str, platform: str) -> None:
    _exec(
        "INSERT OR IGNORE INTO conversations(user_key, platform, updated) VALUES (?,?,?)",
        (user_key, platform, time.time()),
    )


# --- de-duplication: Meta re-delivers webhooks, and echoes our own messages back ---

def mark_mid(mid: str, kind: str) -> bool:
    """Record a message id. Returns False if it was already recorded."""
    with _lock:
        cur = _db.execute(
            "INSERT OR IGNORE INTO seen_mids(mid, kind, ts) VALUES (?,?,?)", (mid, kind, time.time())
        )
        _db.commit()
        return cur.rowcount == 1


def is_bot_mid(mid: str) -> bool:
    return bool(_exec("SELECT 1 FROM seen_mids WHERE mid=? AND kind='sent'", (mid,)))


# --- history ---

def add_message(user_key: str, role: str, content: str) -> None:
    _exec(
        "INSERT INTO messages(user_key, role, content, ts) VALUES (?,?,?,?)",
        (user_key, role, content, time.time()),
    )
    _exec("UPDATE conversations SET updated=? WHERE user_key=?", (time.time(), user_key))


def history_for_claude(user_key: str) -> list[dict]:
    rows = _exec(
        "SELECT role, content FROM messages WHERE user_key=? ORDER BY id DESC LIMIT ?",
        (user_key, HISTORY_LIMIT),
    )[::-1]
    out: list[dict] = []
    for role, content in rows:
        if role == "human":  # a team member answered manually from the inbox
            role, content = "assistant", f"[Réponse d'un membre de l'équipe] {content}"
        if not out and role != "user":
            continue  # Claude conversations must start with a user turn
        if out and out[-1]["role"] == role:
            out[-1]["content"] += "\n" + content
        else:
            out.append({"role": role, "content": content})
    return out


# --- pause (human takeover) ---

def pause(user_key: str, hours: float) -> None:
    _exec("UPDATE conversations SET paused_until=? WHERE user_key=?",
          (time.time() + hours * 3600, user_key))


def is_paused(user_key: str) -> bool:
    rows = _exec("SELECT paused_until FROM conversations WHERE user_key=?", (user_key,))
    return bool(rows) and rows[0][0] > time.time()


def resume(user_key: str) -> None:
    _exec("UPDATE conversations SET paused_until=0 WHERE user_key=?", (user_key,))


# --- leads ---

def save_lead(user_key: str, lead: dict, handoff_reason: str = "") -> None:
    if handoff_reason:
        _exec("UPDATE conversations SET lead=?, handoff_reason=? WHERE user_key=?",
              (json.dumps(lead, ensure_ascii=False), handoff_reason, user_key))
    else:
        _exec("UPDATE conversations SET lead=? WHERE user_key=?",
              (json.dumps(lead, ensure_ascii=False), user_key))


def list_leads() -> list[dict]:
    rows = _exec(
        "SELECT user_key, platform, lead, handoff_reason, paused_until, updated "
        "FROM conversations ORDER BY updated DESC"
    )
    return [
        {
            "user": r[0], "platform": r[1], "lead": json.loads(r[2]),
            "handoff_reason": r[3], "bot_paused": r[4] > time.time(),
            "last_activity": time.strftime("%Y-%m-%d %H:%M", time.localtime(r[5])),
        }
        for r in rows
    ]
