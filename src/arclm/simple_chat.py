"""Local chat persistence and request building for the Flask simple interface."""

from __future__ import annotations

import copy
import json
import os
import re
import sqlite3
import tempfile
import time
import uuid
from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from threading import RLock
from typing import Any, Mapping, Sequence


SCHEMA_VERSION = 1
MAX_MESSAGE_CHARS = 80_000
MAX_SYSTEM_CHARS = 20_000
MAX_TEMPLATE_JSON_CHARS = 60_000
MAX_MEMORY_VALUE_CHARS = 4_000
SUPPORTED_ROLES = {"system", "user", "assistant", "tool"}
OUTPUT_MODES = {"messages", "formatted_text", "tokenizer_chat_template", "prompt_completion"}
CONTEXT_STRATEGIES = {"all_messages", "recent_messages", "token_budget", "summary_plus_recent", "manual"}
PLACEHOLDERS = {"system", "memory", "summary", "history", "tool_calls", "tool_results", "user_input", "assistant_prefix"}
RESPONSE_STATES = {"queued", "preparing", "waiting_for_tool", "running_tool", "generating", "streaming", "revealing", "saving", "completed", "failed", "tool_failed", "cancelled", "removed", "interrupted"}
QUEUE_STATES = {"queued", "preparing", "waiting_for_tool", "running_tool", "generating", "streaming", "saving", "completed", "failed", "cancelled", "removed", "interrupted"}


def utc_now() -> str:
    """Return an ISO UTC timestamp."""

    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def new_id(prefix: str) -> str:
    """Create a stable random ID with a readable prefix."""

    return f"{prefix}_{uuid.uuid4().hex}"


def default_chat_store_path() -> Path:
    """Return the backend-owned local storage path for simple-interface chats."""

    configured = os.getenv("ARCLM_SIMPLE_INTERFACE_STORE")
    if configured:
        return Path(configured).expanduser()
    return Path(os.getenv("ARCLM_WORKSPACE", "workspace")) / "simple-interface" / "chat-store.json"


def estimate_tokens(value: Any, tokenizer: Any = None) -> int:
    """Estimate token usage, preferring an attached tokenizer when available."""

    return token_count_details(value, tokenizer)["count"]


def token_count_details(value: Any, tokenizer: Any = None) -> dict[str, Any]:
    """Count tokens exactly with the active tokenizer, otherwise return a labelled estimate."""

    text = json.dumps(value, ensure_ascii=False, sort_keys=True) if not isinstance(value, str) else value
    if tokenizer is not None:
        for method_name in ("encode_text", "encode"):
            method = getattr(tokenizer, method_name, None)
            if callable(method):
                try:
                    encoded = method(text)
                    return {"count": max(1, len(encoded)), "type": "exact", "method": method_name}
                except Exception:
                    pass
    pieces = re.findall(r"\w+|[^\w\s]", text, flags=re.UNICODE)
    return {"count": max(1, len(pieces)), "type": "estimated", "method": "regex_word_punctuation"}


@dataclass
class ChatTemplate:
    """Versioned ArcLM chat-template schema used by the simple interface."""

    schema_version: int
    id: str
    name: str
    description: str = ""
    message_format: dict[str, str] = field(default_factory=lambda: {"role_field": "role", "content_field": "content"})
    roles: dict[str, str] = field(default_factory=lambda: {"system": "system", "user": "user", "assistant": "assistant", "tool": "tool"})
    input_mapping: dict[str, str] = field(default_factory=lambda: {"user_role": "user", "user_input_field": "content"})
    system_message: dict[str, Any] = field(default_factory=lambda: {"enabled": True, "role": "system"})
    output: dict[str, Any] = field(default_factory=lambda: {"type": "messages"})
    template: str = ""
    assistant_prefix: str = "Assistant:"
    stop_sequences: list[str] = field(default_factory=list)
    builtin: bool = False

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


BUILTIN_TEMPLATES: dict[str, ChatTemplate] = {
    "basic-chat": ChatTemplate(
        schema_version=1,
        id="basic-chat",
        name="System/User/Assistant",
        description="A standard role/content chat template.",
        builtin=True,
    ),
    "plain-completion": ChatTemplate(
        schema_version=1,
        id="plain-completion",
        name="Plain completion",
        description="Sends the current user text as a plain prompt.",
        output={"type": "formatted_text"},
        template="{{system}}\n{{memory}}\n{{summary}}\n{{history}}\n{{user_input}}",
        assistant_prefix="",
        builtin=True,
    ),
    "chatml-style": ChatTemplate(
        schema_version=1,
        id="chatml-style",
        name="ChatML-style",
        description="Formats messages with generic ChatML-style tags.",
        output={"type": "formatted_text"},
        template="{{system}}\n{{memory}}\n{{summary}}\n{{history}}\n<|user|>\n{{user_input}}\n<|assistant|>",
        assistant_prefix="<|assistant|>",
        builtin=True,
    ),
    "instruction-response": ChatTemplate(
        schema_version=1,
        id="instruction-response",
        name="Instruction/Response",
        description="Formats the chat as instruction and response text.",
        output={"type": "formatted_text"},
        template="Instruction:\n{{system}}\n{{memory}}\n{{summary}}\n{{history}}\nUser:\n{{user_input}}\n\nResponse:",
        assistant_prefix="Response:",
        builtin=True,
    ),
    "prompt-completion": ChatTemplate(
        schema_version=1,
        id="prompt-completion",
        name="Prompt/Completion",
        description="Formats the conversation for a causal completion model.",
        output={"type": "prompt_completion"},
        template="System: {{system}}\n{{history}}\nPrompt: {{user_input}}\nCompletion:",
        assistant_prefix="Completion:",
        builtin=True,
    ),
    "tokenizer-native": ChatTemplate(
        schema_version=1,
        id="tokenizer-native",
        name="Tokenizer-native template",
        description="Uses the loaded tokenizer chat template when the adapter supports it.",
        output={"type": "tokenizer_chat_template"},
        builtin=True,
    ),
}


DEFAULT_SETTINGS: dict[str, Any] = {
    "appearance": {
        "theme": "system",
        "spacing": "comfortable",
        "show_model_metadata": True,
        "show_token_counts": True,
        "show_timestamps": False,
    },
    "context": {
        "max_context_tokens": 2048,
        "reserved_response_tokens": 256,
        "max_history_messages": 30,
        "strategy": "token_budget",
        "include_summary": True,
    },
    "generation": {
        "max_new_tokens": 100,
        "temperature": 0.8,
        "top_p": 0.9,
        "repetition_penalty": 1.1,
    },
    "system_instructions": "",
    "persistent_instructions": "",
    "privacy": {
        "save_conversations": True,
        "save_model_responses": True,
        "save_generation_metadata": True,
        "save_exact_rendered_input": False,
        "save_tool_call_history": True,
        "allow_training_collection": False,
        "redact_sensitive_information": True,
        "enable_agent_by_default": False,
        "require_tool_approvals": False,
        "save_queued_prompts": True,
        "recover_queue_after_restart": True,
        "save_streamed_partial_responses": True,
        "save_generation_metrics": True,
        "save_approved_conversations_for_training": False,
        "enable_summaries": False,
        "enable_memory": False,
    },
    "queue": {
        "max_global_queued_prompts": 100,
        "max_queued_prompts_per_conversation": 20,
        "max_message_length": MAX_MESSAGE_CHARS,
        "max_queue_age_seconds": 86400,
        "max_agent_execution_time_seconds": 120,
        "fairness": "fifo",
        "context_policy": "execution_time",
        "include_cancelled_partial_in_followup_context": False,
    },
    "agent": {
        "mode": "chat",
        "max_steps": 8,
        "max_tool_calls": 6,
        "max_repeated_calls": 2,
        "tool_timeout_seconds": 8,
        "max_tool_output_bytes": 65536,
        "enabled_tools": ["add", "subtract", "multiply", "divide", "current_datetime", "text_statistics", "parse_json", "format_json", "markdown_to_text", "html_to_text", "inspect_model", "inspect_tokenizer", "inspect_context"],
    },
    "active_template_id": "basic-chat",
    "active_profile_id": None,
}


class ChatApiError(Exception):
    """Stable, frontend-safe chat API error."""

    def __init__(self, code: str, message: str, status_code: int = 400, details: Mapping[str, Any] | None = None):
        super().__init__(message)
        self.code = code
        self.message = message
        self.status_code = status_code
        self.details = dict(details or {})


class SimpleChatDatabase:
    """Unified SQLite sidecar for Simple Interface runtime records."""

    def __init__(self, path: str | Path):
        self.path = Path(path).expanduser()
        self._lock = RLock()
        self._initialized = False

    def initialize(self) -> None:
        with self._lock:
            if self._initialized:
                return
            self.path.parent.mkdir(parents=True, exist_ok=True)
            with self._connect() as db:
                db.executescript(
                    """
                    CREATE TABLE IF NOT EXISTS conversations (
                        id TEXT PRIMARY KEY,
                        title TEXT,
                        created_at TEXT,
                        updated_at TEXT,
                        payload_json TEXT NOT NULL
                    );
                    CREATE TABLE IF NOT EXISTS messages (
                        id TEXT PRIMARY KEY,
                        conversation_id TEXT NOT NULL,
                        role TEXT NOT NULL,
                        status TEXT,
                        created_at TEXT,
                        token_count INTEGER,
                        payload_json TEXT NOT NULL
                    );
                    CREATE TABLE IF NOT EXISTS models (
                        id TEXT PRIMARY KEY,
                        source TEXT,
                        payload_json TEXT NOT NULL,
                        updated_at TEXT
                    );
                    CREATE TABLE IF NOT EXISTS model_loads (
                        id TEXT PRIMARY KEY,
                        model_id TEXT,
                        source TEXT,
                        status TEXT,
                        created_at TEXT,
                        completed_at TEXT,
                        payload_json TEXT NOT NULL
                    );
                    CREATE TABLE IF NOT EXISTS generation_runs (
                        id TEXT PRIMARY KEY,
                        conversation_id TEXT NOT NULL,
                        user_message_id TEXT,
                        assistant_message_id TEXT,
                        status TEXT NOT NULL,
                        created_at TEXT NOT NULL,
                        updated_at TEXT NOT NULL,
                        payload_json TEXT NOT NULL
                    );
                    CREATE TABLE IF NOT EXISTS generation_requests (
                        id TEXT PRIMARY KEY,
                        conversation_id TEXT NOT NULL,
                        user_message_id TEXT NOT NULL,
                        assistant_message_id TEXT,
                        generation_run_id TEXT,
                        operation_id TEXT,
                        model_id TEXT,
                        model_load_id TEXT,
                        chat_template_id TEXT,
                        chat_template_version INTEGER,
                        status TEXT NOT NULL,
                        queue_sequence INTEGER NOT NULL,
                        priority INTEGER NOT NULL DEFAULT 0,
                        created_at TEXT NOT NULL,
                        started_at TEXT,
                        completed_at TEXT,
                        cancelled_at TEXT,
                        safe_error_code TEXT,
                        payload_json TEXT NOT NULL
                    );
                    CREATE TABLE IF NOT EXISTS chat_templates (
                        id TEXT PRIMARY KEY,
                        version INTEGER,
                        name TEXT,
                        payload_json TEXT NOT NULL,
                        updated_at TEXT
                    );
                    CREATE TABLE IF NOT EXISTS tool_calls (
                        id TEXT PRIMARY KEY,
                        generation_run_id TEXT NOT NULL,
                        tool_name TEXT NOT NULL,
                        status TEXT NOT NULL,
                        permission_category TEXT,
                        approval_status TEXT,
                        started_at TEXT,
                        completed_at TEXT,
                        duration_ms REAL,
                        safe_error_code TEXT,
                        payload_json TEXT NOT NULL
                    );
                    CREATE TABLE IF NOT EXISTS tool_results (
                        id TEXT PRIMARY KEY,
                        tool_call_id TEXT NOT NULL,
                        generation_run_id TEXT NOT NULL,
                        status TEXT NOT NULL,
                        result_size INTEGER,
                        redaction_status TEXT,
                        payload_json TEXT NOT NULL
                    );
                    CREATE TABLE IF NOT EXISTS training_candidates (
                        id TEXT PRIMARY KEY,
                        generation_run_id TEXT NOT NULL,
                        conversation_id TEXT NOT NULL,
                        status TEXT NOT NULL,
                        created_at TEXT NOT NULL,
                        updated_at TEXT NOT NULL,
                        payload_json TEXT NOT NULL
                    );
                    CREATE TABLE IF NOT EXISTS settings (
                        key TEXT PRIMARY KEY,
                        payload_json TEXT NOT NULL,
                        updated_at TEXT NOT NULL
                    );
                    CREATE INDEX IF NOT EXISTS idx_generation_requests_status_sequence
                        ON generation_requests(status, priority DESC, queue_sequence ASC);
                    CREATE INDEX IF NOT EXISTS idx_generation_requests_conversation
                        ON generation_requests(conversation_id, status, queue_sequence ASC);
                    """
                )
            self._initialized = True

    def upsert_conversation(self, conversation: Mapping[str, Any]) -> None:
        self.initialize()
        with self._lock, self._connect() as db:
            db.execute(
                "INSERT OR REPLACE INTO conversations (id, title, created_at, updated_at, payload_json) VALUES (?, ?, ?, ?, ?)",
                (
                    str(conversation.get("id")),
                    str(conversation.get("title") or ""),
                    str(conversation.get("created_at") or ""),
                    str(conversation.get("updated_at") or ""),
                    json.dumps(conversation, ensure_ascii=False, sort_keys=True, default=str),
                ),
            )

    def upsert_message(self, message: Mapping[str, Any]) -> None:
        self.initialize()
        with self._lock, self._connect() as db:
            db.execute(
                "INSERT OR REPLACE INTO messages (id, conversation_id, role, status, created_at, token_count, payload_json) VALUES (?, ?, ?, ?, ?, ?, ?)",
                (
                    str(message.get("id")),
                    str(message.get("conversation_id")),
                    str(message.get("role")),
                    str(message.get("status") or ""),
                    str(message.get("created_at") or ""),
                    message.get("token_count"),
                    json.dumps(message, ensure_ascii=False, sort_keys=True, default=str),
                ),
            )

    def upsert_template(self, template: Mapping[str, Any]) -> None:
        self.initialize()
        with self._lock, self._connect() as db:
            db.execute(
                "INSERT OR REPLACE INTO chat_templates (id, version, name, payload_json, updated_at) VALUES (?, ?, ?, ?, ?)",
                (
                    str(template.get("id")),
                    int(template.get("schema_version") or 1),
                    str(template.get("name") or ""),
                    json.dumps(template, ensure_ascii=False, sort_keys=True, default=str),
                    utc_now(),
                ),
            )

    def upsert_settings(self, settings: Mapping[str, Any]) -> None:
        self.initialize()
        with self._lock, self._connect() as db:
            db.execute(
                "INSERT OR REPLACE INTO settings (key, payload_json, updated_at) VALUES (?, ?, ?)",
                ("global", json.dumps(settings, ensure_ascii=False, sort_keys=True, default=str), utc_now()),
            )

    def upsert_generation_run(self, run: Mapping[str, Any]) -> None:
        self.initialize()
        with self._lock, self._connect() as db:
            db.execute(
                "INSERT OR REPLACE INTO generation_runs (id, conversation_id, user_message_id, assistant_message_id, status, created_at, updated_at, payload_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                (
                    str(run.get("id")),
                    str(run.get("conversation_id")),
                    run.get("user_message_id"),
                    run.get("assistant_message_id"),
                    str(run.get("status") or "queued"),
                    str(run.get("created_at") or utc_now()),
                    str(run.get("updated_at") or utc_now()),
                    json.dumps(run, ensure_ascii=False, sort_keys=True, default=str),
                ),
            )

    def next_queue_sequence(self) -> int:
        self.initialize()
        with self._lock, self._connect() as db:
            row = db.execute("SELECT COALESCE(MAX(queue_sequence), 0) + 1 FROM generation_requests").fetchone()
        return int(row[0] or 1)

    def upsert_generation_request(self, item: Mapping[str, Any]) -> None:
        self.initialize()
        with self._lock, self._connect() as db:
            db.execute(
                """
                INSERT OR REPLACE INTO generation_requests (
                    id, conversation_id, user_message_id, assistant_message_id,
                    generation_run_id, operation_id, model_id, model_load_id,
                    chat_template_id, chat_template_version, status, queue_sequence,
                    priority, created_at, started_at, completed_at, cancelled_at,
                    safe_error_code, payload_json
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    str(item.get("id")),
                    str(item.get("conversation_id")),
                    str(item.get("user_message_id")),
                    item.get("assistant_message_id"),
                    item.get("generation_run_id"),
                    item.get("operation_id"),
                    item.get("model_id"),
                    item.get("model_load_id"),
                    item.get("chat_template_id"),
                    item.get("chat_template_version"),
                    str(item.get("status") or "queued"),
                    int(item.get("queue_sequence") or 0),
                    int(item.get("priority") or 0),
                    str(item.get("created_at") or utc_now()),
                    item.get("started_at"),
                    item.get("completed_at"),
                    item.get("cancelled_at"),
                    item.get("safe_error_code"),
                    json.dumps(item, ensure_ascii=False, sort_keys=True, default=str),
                ),
            )

    def get_generation_request(self, request_id: str) -> dict[str, Any]:
        self.initialize()
        with self._lock, self._connect() as db:
            row = db.execute("SELECT payload_json FROM generation_requests WHERE id = ?", (request_id,)).fetchone()
        if row is None:
            raise ChatApiError("generation_request_not_found", "Queued request was not found.", status_code=404)
        return json.loads(row[0])

    def list_generation_requests(self, conversation_id: str | None = None, statuses: Sequence[str] | None = None, limit: int = 200) -> list[dict[str, Any]]:
        self.initialize()
        where = []
        args: list[Any] = []
        if conversation_id:
            where.append("conversation_id = ?")
            args.append(conversation_id)
        if statuses:
            placeholders = ", ".join("?" for _ in statuses)
            where.append(f"status IN ({placeholders})")
            args.extend(list(statuses))
        sql = "SELECT payload_json FROM generation_requests"
        if where:
            sql += " WHERE " + " AND ".join(where)
        sql += " ORDER BY priority DESC, queue_sequence ASC LIMIT ?"
        args.append(max(1, min(int(limit or 200), 1000)))
        with self._lock, self._connect() as db:
            rows = db.execute(sql, tuple(args)).fetchall()
        return [json.loads(row[0]) for row in rows]

    def count_generation_requests(self, conversation_id: str | None = None, statuses: Sequence[str] | None = None) -> int:
        self.initialize()
        where = []
        args: list[Any] = []
        if conversation_id:
            where.append("conversation_id = ?")
            args.append(conversation_id)
        if statuses:
            placeholders = ", ".join("?" for _ in statuses)
            where.append(f"status IN ({placeholders})")
            args.extend(list(statuses))
        sql = "SELECT COUNT(*) FROM generation_requests"
        if where:
            sql += " WHERE " + " AND ".join(where)
        with self._lock, self._connect() as db:
            row = db.execute(sql, tuple(args)).fetchone()
        return int(row[0] or 0)

    def claim_next_generation_request(self) -> dict[str, Any] | None:
        self.initialize()
        now = utc_now()
        with self._lock, self._connect() as db:
            db.execute("BEGIN IMMEDIATE")
            row = db.execute(
                """
                SELECT id, payload_json FROM generation_requests
                WHERE status = 'queued'
                ORDER BY priority DESC, queue_sequence ASC
                LIMIT 1
                """
            ).fetchone()
            if row is None:
                db.commit()
                return None
            item = json.loads(row[1])
            item["status"] = "preparing"
            item["started_at"] = now
            item["updated_at"] = now
            cursor = db.execute(
                """
                UPDATE generation_requests
                SET status = ?, started_at = ?, payload_json = ?
                WHERE id = ? AND status = 'queued'
                """,
                ("preparing", now, json.dumps(item, ensure_ascii=False, sort_keys=True, default=str), row[0]),
            )
            if cursor.rowcount != 1:
                db.rollback()
                return None
            db.commit()
        return item

    def mark_active_requests_interrupted(self) -> int:
        self.initialize()
        active = {"preparing", "waiting_for_tool", "running_tool", "generating", "streaming", "saving"}
        updated = 0
        with self._lock:
            rows = self.list_generation_requests(statuses=sorted(active), limit=1000)
            for item in rows:
                item["status"] = "interrupted"
                item["completed_at"] = utc_now()
                item["safe_error_code"] = "application_restarted"
                self.upsert_generation_request(item)
                updated += 1
        return updated

    def upsert_tool_call(self, call: Mapping[str, Any]) -> None:
        self.initialize()
        with self._lock, self._connect() as db:
            db.execute(
                "INSERT OR REPLACE INTO tool_calls (id, generation_run_id, tool_name, status, permission_category, approval_status, started_at, completed_at, duration_ms, safe_error_code, payload_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                (
                    str(call.get("id")),
                    str(call.get("generation_run_id")),
                    str(call.get("tool_name") or call.get("name") or ""),
                    str(call.get("status") or ""),
                    call.get("permission_category"),
                    call.get("approval_status"),
                    call.get("started_at"),
                    call.get("completed_at"),
                    call.get("duration_ms"),
                    call.get("safe_error_code"),
                    json.dumps(call, ensure_ascii=False, sort_keys=True, default=str),
                ),
            )

    def upsert_tool_result(self, result: Mapping[str, Any]) -> None:
        self.initialize()
        with self._lock, self._connect() as db:
            db.execute(
                "INSERT OR REPLACE INTO tool_results (id, tool_call_id, generation_run_id, status, result_size, redaction_status, payload_json) VALUES (?, ?, ?, ?, ?, ?, ?)",
                (
                    str(result.get("id")),
                    str(result.get("tool_call_id")),
                    str(result.get("generation_run_id")),
                    str(result.get("status") or ""),
                    result.get("result_size"),
                    result.get("redaction_status"),
                    json.dumps(result, ensure_ascii=False, sort_keys=True, default=str),
                ),
            )

    def get_generation_run(self, run_id: str) -> dict[str, Any]:
        self.initialize()
        with self._lock, self._connect() as db:
            row = db.execute("SELECT payload_json FROM generation_runs WHERE id = ?", (run_id,)).fetchone()
        if row is None:
            raise ChatApiError("generation_run_not_found", "Generation run was not found.", status_code=404)
        return json.loads(row[0])

    def list_rows(self, table: str, where: str = "", args: Sequence[Any] = ()) -> list[dict[str, Any]]:
        if table not in {"generation_runs", "generation_requests", "tool_calls", "tool_results", "training_candidates"}:
            raise ChatApiError("database_table_invalid", "Database table is not available.", status_code=400)
        self.initialize()
        sql = f"SELECT payload_json FROM {table} {where}"
        with self._lock, self._connect() as db:
            rows = db.execute(sql, tuple(args)).fetchall()
        return [json.loads(row[0]) for row in rows]

    def _connect(self) -> sqlite3.Connection:
        connection = sqlite3.connect(str(self.path))
        connection.execute("PRAGMA journal_mode=WAL")
        return connection


class SimpleChatStore:
    """Small atomic JSON store for local conversations, templates and settings."""

    def __init__(self, path: str | Path | None = None):
        self.path = Path(path or default_chat_store_path()).expanduser()
        self.database = SimpleChatDatabase(self.path.with_suffix(".sqlite3"))
        self._lock = RLock()
        self._data: dict[str, Any] | None = None

    def load(self) -> dict[str, Any]:
        with self._lock:
            if self._data is None:
                self._data = self._read_or_initialize()
            return self._data

    def save(self) -> None:
        with self._lock:
            data = self.load()
            persisted = self._data_for_persistence(data)
            self.path.parent.mkdir(parents=True, exist_ok=True)
            fd, name = tempfile.mkstemp(prefix=self.path.name, suffix=".tmp", dir=str(self.path.parent))
            try:
                with os.fdopen(fd, "w", encoding="utf-8") as handle:
                    json.dump(persisted, handle, indent=2, sort_keys=True, ensure_ascii=False)
                    handle.write("\n")
                os.replace(name, self.path)
            except Exception as exc:
                try:
                    os.unlink(name)
                except OSError:
                    pass
                raise ChatApiError("conversation_storage_failed", "Could not persist chat storage.", status_code=500) from exc

    def _data_for_persistence(self, data: Mapping[str, Any]) -> dict[str, Any]:
        """Apply storage/privacy settings to the on-disk JSON snapshot."""

        persisted = copy.deepcopy(dict(data))
        privacy = ((persisted.get("settings") or {}).get("privacy") or {})
        if not privacy.get("save_conversations", True):
            persisted["conversations"] = {}
            return persisted
        save_responses = privacy.get("save_model_responses", True)
        save_metadata = privacy.get("save_generation_metadata", True)
        for conversation in persisted.get("conversations", {}).values():
            for message in conversation.get("messages", []):
                if message.get("role") == "assistant" and not save_responses:
                    message["content"] = ""
                if not save_metadata:
                    message["generation_metadata"] = {}
        return persisted

    def reset_cache(self) -> None:
        with self._lock:
            self._data = None

    def list_chats(self, query: str = "", limit: int = 100) -> list[dict[str, Any]]:
        data = self.load()
        conversations = list(data["conversations"].values())
        if query.strip():
            lowered = query.strip().lower()
            conversations = [item for item in conversations if self._chat_matches(item, lowered)]
        conversations.sort(key=lambda item: item.get("updated_at", ""), reverse=True)
        return [conversation_summary(item) for item in conversations[: max(1, min(int(limit or 100), 500))]]

    def create_chat(self, payload: Mapping[str, Any] | None = None) -> dict[str, Any]:
        data = self.load()
        payload = payload or {}
        now = utc_now()
        chat_id = new_id("chat")
        settings = _deep_merge(data.get("settings") or DEFAULT_SETTINGS, payload.get("settings") or {})
        conversation = {
            "id": chat_id,
            "title": _clean_title(payload.get("title") or "New chat"),
            "created_at": now,
            "updated_at": now,
            "selected_model": payload.get("selected_model") or payload.get("model_source"),
            "model_source": payload.get("model_source"),
            "chat_template_id": payload.get("chat_template_id") or settings.get("active_template_id") or "basic-chat",
            "system_instructions": _bounded_text(payload.get("system_instructions", ""), MAX_SYSTEM_CHARS),
            "persistent_instructions": _bounded_text(payload.get("persistent_instructions", ""), MAX_SYSTEM_CHARS),
            "context_settings": _deep_merge(DEFAULT_SETTINGS["context"], payload.get("context_settings") or {}),
            "generation_settings": _deep_merge(DEFAULT_SETTINGS["generation"], payload.get("generation_settings") or {}),
            "messages": [],
            "summary": payload.get("summary") or "",
            "metadata": dict(payload.get("metadata") or {}),
            "settings": settings,
        }
        data["conversations"][chat_id] = conversation
        self.save()
        self.database.upsert_conversation(conversation)
        return copy.deepcopy(conversation)

    def get_chat(self, chat_id: str) -> dict[str, Any]:
        conversations = self.load()["conversations"]
        if chat_id not in conversations:
            raise ChatApiError("chat_not_found", "Conversation was not found.", status_code=404)
        return conversations[chat_id]

    def update_chat(self, chat_id: str, payload: Mapping[str, Any]) -> dict[str, Any]:
        conversation = self.get_chat(chat_id)
        if "title" in payload:
            conversation["title"] = _clean_title(payload["title"])
            conversation["metadata"]["manual_title"] = True
        for key in ("selected_model", "model_source", "chat_template_id", "summary"):
            if key in payload:
                conversation[key] = payload[key]
        for key, limit in (("system_instructions", MAX_SYSTEM_CHARS), ("persistent_instructions", MAX_SYSTEM_CHARS)):
            if key in payload:
                conversation[key] = _bounded_text(payload[key], limit)
        if "context_settings" in payload:
            conversation["context_settings"] = _deep_merge(conversation.get("context_settings") or {}, payload["context_settings"] or {})
        if "generation_settings" in payload:
            conversation["generation_settings"] = _deep_merge(conversation.get("generation_settings") or {}, payload["generation_settings"] or {})
        if "settings" in payload:
            conversation["settings"] = _deep_merge(conversation.get("settings") or {}, payload["settings"] or {})
        conversation["updated_at"] = utc_now()
        self.save()
        self.database.upsert_conversation(conversation)
        return copy.deepcopy(conversation)

    def delete_chat(self, chat_id: str) -> dict[str, Any]:
        conversations = self.load()["conversations"]
        if chat_id not in conversations:
            raise ChatApiError("chat_not_found", "Conversation was not found.", status_code=404)
        deleted = conversations.pop(chat_id)
        self.save()
        return copy.deepcopy(deleted)

    def duplicate_chat(self, chat_id: str) -> dict[str, Any]:
        source = copy.deepcopy(self.get_chat(chat_id))
        new_chat_id = new_id("chat")
        now = utc_now()
        source["id"] = new_chat_id
        source["title"] = _clean_title(source.get("title", "Chat") + " copy")
        source["created_at"] = now
        source["updated_at"] = now
        for message in source.get("messages", []):
            message["id"] = new_id("msg")
            message["conversation_id"] = new_chat_id
        self.load()["conversations"][new_chat_id] = source
        self.save()
        return source

    def append_message(self, chat_id: str, role: str, content: str, **metadata: Any) -> dict[str, Any]:
        conversation = self.get_chat(chat_id)
        if role not in SUPPORTED_ROLES:
            raise ChatApiError("template_role_invalid", "Message role is not supported.", details={"role": role})
        content = _bounded_text(content, MAX_MESSAGE_CHARS)
        now = utc_now()
        message = {
            "id": new_id("msg"),
            "conversation_id": chat_id,
            "role": role,
            "content": content,
            "created_at": now,
            "status": metadata.pop("status", "complete"),
            "model": metadata.pop("model", None),
            "token_count": metadata.pop("token_count", None),
            "generation_metadata": metadata.pop("generation_metadata", {}),
            "error": metadata.pop("error", None),
            "metadata": metadata.pop("metadata", {}),
        }
        conversation.setdefault("messages", []).append(message)
        if role == "user" and len([item for item in conversation["messages"] if item.get("role") == "user"]) == 1 and not conversation.get("metadata", {}).get("manual_title"):
            conversation["title"] = title_from_message(content)
        conversation["updated_at"] = now
        self.save()
        self.database.upsert_conversation(conversation)
        self.database.upsert_message(message)
        return copy.deepcopy(message)

    def update_message(self, chat_id: str, message_id: str, **updates: Any) -> dict[str, Any]:
        conversation = self.get_chat(chat_id)
        for message in conversation.setdefault("messages", []):
            if message.get("id") != message_id:
                continue
            if "content" in updates:
                message["content"] = _bounded_text(updates["content"], MAX_MESSAGE_CHARS)
            for key in ("status", "token_count", "model", "generation_metadata", "error", "metadata"):
                if key in updates:
                    if key == "metadata":
                        message[key] = _deep_merge(message.get(key) or {}, updates[key] or {})
                    else:
                        message[key] = copy.deepcopy(updates[key])
            conversation["updated_at"] = utc_now()
            self.save()
            self.database.upsert_conversation(conversation)
            self.database.upsert_message(message)
            return copy.deepcopy(message)
        raise ChatApiError("message_not_found", "Message was not found.", status_code=404)

    def get_message(self, chat_id: str, message_id: str) -> dict[str, Any]:
        conversation = self.get_chat(chat_id)
        for message in conversation.get("messages", []):
            if message.get("id") == message_id:
                return copy.deepcopy(message)
        raise ChatApiError("message_not_found", "Message was not found.", status_code=404)

    def list_templates(self) -> list[dict[str, Any]]:
        data = self.load()
        templates = [item.to_dict() for item in BUILTIN_TEMPLATES.values()]
        templates.extend(copy.deepcopy(list(data.get("templates", {}).values())))
        return templates

    def get_template(self, template_id: str) -> dict[str, Any]:
        if template_id in BUILTIN_TEMPLATES:
            return BUILTIN_TEMPLATES[template_id].to_dict()
        templates = self.load().get("templates", {})
        if template_id not in templates:
            raise ChatApiError("template_invalid", "Chat template was not found.", status_code=404)
        return copy.deepcopy(templates[template_id])

    def save_template(self, payload: Mapping[str, Any]) -> dict[str, Any]:
        validation = validate_template(payload)
        if not validation["valid"]:
            raise ChatApiError("template_invalid", "Invalid templates cannot become active.", details={"errors": validation["errors"]})
        template = validation["template"]
        if template["id"] in BUILTIN_TEMPLATES:
            raise ChatApiError("template_invalid", "Built-in templates are immutable.", status_code=409)
        template["builtin"] = False
        self.load()["templates"][template["id"]] = template
        self.save()
        self.database.upsert_template(template)
        return copy.deepcopy(template)

    def delete_template(self, template_id: str) -> dict[str, Any]:
        if template_id in BUILTIN_TEMPLATES:
            raise ChatApiError("template_invalid", "Built-in templates cannot be deleted.", status_code=409)
        templates = self.load().get("templates", {})
        if template_id not in templates:
            raise ChatApiError("template_invalid", "Chat template was not found.", status_code=404)
        deleted = templates.pop(template_id)
        self.save()
        return copy.deepcopy(deleted)

    def get_settings(self) -> dict[str, Any]:
        return copy.deepcopy(self.load()["settings"])

    def update_settings(self, payload: Mapping[str, Any]) -> dict[str, Any]:
        self.load()["settings"] = _deep_merge(self.load()["settings"], payload)
        self.save()
        settings = self.get_settings()
        self.database.upsert_settings(settings)
        return settings

    def list_model_profiles(self) -> list[dict[str, Any]]:
        return copy.deepcopy(list(self.load().get("model_profiles", {}).values()))

    def save_model_profile(self, payload: Mapping[str, Any]) -> dict[str, Any]:
        profile_id = str(payload.get("id") or new_id("profile"))
        profile = {
            "id": profile_id,
            "name": _clean_title(payload.get("name") or "Model profile"),
            "model_source": payload.get("model_source"),
            "source_type": payload.get("source_type"),
            "tokenizer_source": payload.get("tokenizer_source"),
            "device": payload.get("device"),
            "precision": payload.get("precision") or payload.get("dtype"),
            "chat_template_id": payload.get("chat_template_id") or "basic-chat",
            "context_limit_override": payload.get("context_limit_override"),
            "generation_defaults": dict(payload.get("generation_defaults") or {}),
            "system_instructions": _bounded_text(payload.get("system_instructions", ""), MAX_SYSTEM_CHARS),
            "metadata": dict(payload.get("metadata") or {}),
            "updated_at": utc_now(),
        }
        self.load()["model_profiles"][profile_id] = profile
        self.save()
        return copy.deepcopy(profile)

    def delete_model_profile(self, profile_id: str) -> dict[str, Any]:
        profiles = self.load().get("model_profiles", {})
        if profile_id not in profiles:
            raise ChatApiError("profile_not_found", "Model profile was not found.", status_code=404)
        deleted = profiles.pop(profile_id)
        self.save()
        return copy.deepcopy(deleted)

    def list_memories(self) -> list[dict[str, Any]]:
        return copy.deepcopy(self.load().get("memories", []))

    def save_memory(self, payload: Mapping[str, Any]) -> dict[str, Any]:
        if not self.get_settings().get("privacy", {}).get("enable_memory"):
            raise ChatApiError("memory_disabled", "Cross-chat memory is disabled.", status_code=403)
        memory = {
            "id": str(payload.get("id") or new_id("mem")),
            "category": str(payload.get("category") or "User preference")[:80],
            "key": str(payload.get("key") or "memory")[:80],
            "value": _bounded_text(payload.get("value", ""), MAX_MEMORY_VALUE_CHARS),
            "created_at": payload.get("created_at") or utc_now(),
            "updated_at": utc_now(),
        }
        memories = self.load()["memories"]
        for index, item in enumerate(memories):
            if item.get("id") == memory["id"]:
                memories[index] = memory
                break
        else:
            memories.append(memory)
        self.save()
        return copy.deepcopy(memory)

    def delete_memory(self, memory_id: str | None = None) -> dict[str, Any]:
        data = self.load()
        if memory_id is None:
            count = len(data["memories"])
            data["memories"] = []
            self.save()
            return {"deleted": count}
        before = len(data["memories"])
        data["memories"] = [item for item in data["memories"] if item.get("id") != memory_id]
        if len(data["memories"]) == before:
            raise ChatApiError("memory_not_found", "Memory was not found.", status_code=404)
        self.save()
        return {"deleted": 1}

    def export_data(self, chat_id: str | None = None) -> dict[str, Any]:
        data = self.load()
        if chat_id:
            return {
                "format": "arclm-conversation-export",
                "version": 1,
                "conversation": copy.deepcopy(self.get_chat(chat_id)),
            }
        return {
            "format": "arclm-simple-interface-export",
            "version": 1,
            "conversations": copy.deepcopy(data["conversations"]),
            "templates": copy.deepcopy(data["templates"]),
            "model_profiles": copy.deepcopy(data["model_profiles"]),
            "settings": copy.deepcopy(data["settings"]),
        }

    def import_data(self, payload: Mapping[str, Any]) -> dict[str, Any]:
        fmt = payload.get("format")
        imported = 0
        if fmt == "arclm-conversation-export":
            conversation = _validate_imported_conversation(payload.get("conversation") or {})
            self.load()["conversations"][conversation["id"]] = conversation
            imported = 1
        elif fmt == "arclm-simple-interface-export":
            for conversation in (payload.get("conversations") or {}).values():
                validated = _validate_imported_conversation(conversation)
                self.load()["conversations"][validated["id"]] = validated
                imported += 1
            for template in (payload.get("templates") or {}).values():
                self.save_template(template)
        else:
            raise ChatApiError("import_invalid", "Unsupported import format.", status_code=400)
        self.save()
        return {"imported": imported}

    def _read_or_initialize(self) -> dict[str, Any]:
        if not self.path.exists():
            return _initial_data()
        try:
            data = json.loads(self.path.read_text(encoding="utf-8"))
        except Exception as exc:
            raise ChatApiError("conversation_storage_failed", "Chat storage could not be read.", status_code=500) from exc
        if not isinstance(data, dict):
            raise ChatApiError("conversation_storage_failed", "Chat storage has an invalid root object.", status_code=500)
        result = _initial_data()
        result.update({key: data.get(key, default) for key, default in result.items()})
        result["settings"] = _deep_merge(DEFAULT_SETTINGS, result.get("settings") or {})
        result["schema_version"] = SCHEMA_VERSION
        return result

    @staticmethod
    def _chat_matches(conversation: Mapping[str, Any], lowered: str) -> bool:
        haystack = [
            conversation.get("title", ""),
            conversation.get("selected_model", ""),
            conversation.get("model_source", ""),
        ]
        for message in conversation.get("messages", []):
            haystack.append(message.get("content", ""))
        return lowered in "\n".join(str(item).lower() for item in haystack)


class SimpleChatModelAdapter:
    """Adapter boundary over currently loaded simple-interface model objects."""

    def __init__(self, model: Any):
        self.model = model
        self.tokenizer = getattr(model, "tokenizer", None)
        if self.tokenizer is None:
            self.tokenizer = getattr(getattr(model, "config", None), "tokenizer", None)

    def get_capabilities(self) -> dict[str, Any]:
        source_info = getattr(self.model, "source_info", None)
        context_limit = _model_context_limit(self.model)
        streaming_mode = self.streaming_mode()
        has_chat_template = bool(
            self.tokenizer is not None
            and hasattr(self.tokenizer, "apply_chat_template")
            and getattr(self.tokenizer, "chat_template", None)
        )
        return {
            "structured_messages": True,
            "text_prompts": True,
            "tokenizer_chat_template": has_chat_template,
            "system_role": True,
            "tool_role": True,
            "context_limit": context_limit,
            "streaming": streaming_mode != "non_streaming",
            "supports_streaming": streaming_mode != "non_streaming",
            "streaming_mode": streaming_mode,
            "native_tool_calling": False,
            "structured_json_tool_calling": False,
            "prompt_based_tool_calling": True,
            "tool_result_messages": True,
            "parallel_tool_calls": False,
            "generation_settings": ["max_new_tokens", "temperature", "top_k", "top_p", "repetition_penalty", "do_sample", "stop"],
            "source_type": getattr(source_info, "source_type", None),
        }

    def streaming_mode(self) -> str:
        source_info = getattr(self.model, "source_info", None)
        source_type = getattr(source_info, "source_type", None)
        for method_name in ("stream_generate", "generate_stream", "stream"):
            if callable(getattr(self.model, method_name, None)):
                if method_name == "stream_generate" and hasattr(self.model, "_native_loaded") and source_type != "native_arclm" and getattr(self.model, "_native_loaded", None) is None:
                    continue
                return "native_token_streaming" if method_name == "stream_generate" else "text_chunk_streaming"
        native = getattr(self.model, "_native_loaded", None)
        generator = getattr(native, "generator", None)
        if callable(getattr(generator, "generate_stream", None)):
            return "native_token_streaming"
        return "non_streaming"

    def count_tokens(self, prepared_input: Any) -> int:
        return estimate_tokens(prepared_input, self.tokenizer)

    def generate(self, prepared_input: Any, generation_settings: Mapping[str, Any]) -> str:
        if hasattr(self.model, "chat") and isinstance(prepared_input, list):
            return str(self.model.chat(prepared_input, **dict(generation_settings)))
        if hasattr(self.model, "generate"):
            return str(self.model.generate(prepared_input, **dict(generation_settings)))
        if hasattr(self.model, "predict"):
            return str(self.model.predict(prepared_input, **dict(generation_settings)))
        raise ChatApiError("generation_failed", "The loaded model does not expose generate or predict.", status_code=500)

    def stream_generate(self, prepared_input: Any, generation_settings: Mapping[str, Any], cancel_check: Any | None = None):
        """Yield decoded text deltas from model generation when the backend supports it."""

        def cancelled() -> bool:
            return bool(cancel_check and cancel_check())

        for method_name in ("stream_generate", "generate_stream", "stream"):
            method = getattr(self.model, method_name, None)
            if not callable(method):
                continue
            kwargs = dict(generation_settings)
            try:
                stream = method(prepared_input, cancel_check=cancelled, **kwargs)
            except TypeError:
                stream = method(prepared_input, **kwargs)
            for item in stream:
                if cancelled():
                    break
                if isinstance(item, Mapping):
                    text = item.get("text") or item.get("delta") or item.get("content") or ""
                    token_id = item.get("token_id")
                else:
                    text = str(item)
                    token_id = None
                if text:
                    yield {"text": str(text), "token_id": token_id}
            return
        native = getattr(self.model, "_native_loaded", None)
        generator = getattr(native, "generator", None)
        if callable(getattr(generator, "generate_stream", None)):
            prompt = prepared_input if isinstance(prepared_input, str) else render_history_text(prepared_input)
            allowed = {"max_new_tokens", "temperature", "repetition_penalty", "top_k", "top_p"}
            kwargs = {key: value for key, value in dict(generation_settings).items() if key in allowed}
            for item in generator.generate_stream(prompt, cancel_check=cancelled, **kwargs):
                if cancelled():
                    break
                yield item if isinstance(item, Mapping) else {"text": str(item), "token_id": None}
            return
        raise ChatApiError("streaming_unavailable", "The active model does not support true streaming.", status_code=409)


class ConversationContextManager:
    """Select history, enforce budgets and render the selected chat template."""

    def build_context(
        self,
        conversation: Mapping[str, Any],
        model_capabilities: Mapping[str, Any],
        template: Mapping[str, Any],
        settings: Mapping[str, Any],
        current_user_message: Mapping[str, Any] | None = None,
        memories: Sequence[Mapping[str, Any]] | None = None,
        tokenizer: Any = None,
    ) -> dict[str, Any]:
        context_settings = _deep_merge(DEFAULT_SETTINGS["context"], settings.get("context") or {})
        context_settings = _deep_merge(context_settings, conversation.get("context_settings") or {})
        self._validate_context_settings(context_settings, model_capabilities)

        system = resolve_system_instructions(settings, conversation)
        persistent = str(settings.get("persistent_instructions") or "")
        if conversation.get("persistent_instructions"):
            persistent = str(conversation.get("persistent_instructions"))
        summary = str(conversation.get("summary") or "")
        memory_text = render_memories(memories or []) if settings.get("privacy", {}).get("enable_memory") else ""

        messages = [copy.deepcopy(item) for item in conversation.get("messages", [])]
        if current_user_message and current_user_message not in messages:
            messages.append(copy.deepcopy(current_user_message))

        fixed_tokens = estimate_tokens(system, tokenizer) + estimate_tokens(persistent, tokenizer) + estimate_tokens(summary, tokenizer) + estimate_tokens(memory_text, tokenizer)
        max_context_tokens = int(context_settings["max_context_tokens"])
        reserved = int(context_settings["reserved_response_tokens"])
        budget = max_context_tokens - reserved - fixed_tokens
        if budget < 1:
            raise ChatApiError(
                "context_limit_exceeded",
                "System, summary and reserved response tokens exceed the configured context budget.",
                details={"max_context_tokens": max_context_tokens, "reserved_response_tokens": reserved, "fixed_tokens": fixed_tokens},
            )

        selected, excluded = select_messages(messages, context_settings, budget, tokenizer)
        prompt_messages = build_prompt_messages(selected, system, persistent, summary, memory_text, template)
        prepared = apply_chat_template(prompt_messages, template, current_user_message=current_user_message)
        estimated = estimate_tokens(prepared, tokenizer)
        if estimated + reserved > max_context_tokens:
            selected, excluded = select_messages(selected, {**context_settings, "max_history_messages": max(1, len(selected) - 1)}, max(1, budget - (estimated + reserved - max_context_tokens)), tokenizer)
            prompt_messages = build_prompt_messages(selected, system, persistent, summary, memory_text, template)
            prepared = apply_chat_template(prompt_messages, template, current_user_message=current_user_message)
            estimated = estimate_tokens(prepared, tokenizer)
        token_metrics = build_input_token_metrics(
            prompt_messages=prompt_messages,
            selected=selected,
            prepared_input=prepared,
            system=system,
            persistent=persistent,
            summary=summary,
            memory_text=memory_text,
            current_user_message=current_user_message,
            tokenizer=tokenizer,
        )

        return {
            "prepared_input": prepared,
            "prompt_messages": prompt_messages,
            "report": {
                "model_context_limit": model_capabilities.get("context_limit"),
                "estimated_input_tokens": estimated,
                "token_metrics": token_metrics,
                "reserved_output_tokens": reserved,
                "max_context_tokens": max_context_tokens,
                "messages_included": [item["id"] for item in selected if item.get("id")],
                "messages_excluded": [item["id"] for item in excluded if item.get("id")],
                "summary_included": bool(summary and context_settings.get("include_summary")),
                "memory_included": bool(memory_text),
                "chat_template_used": template.get("id"),
                "output_mode": (template.get("output") or {}).get("type", "messages"),
                "final_formatted_input_preview": prepared,
                "system_instructions": system,
                "persistent_instructions": persistent,
            },
        }

    @staticmethod
    def _validate_context_settings(settings: Mapping[str, Any], model_capabilities: Mapping[str, Any]) -> None:
        max_context = int(settings.get("max_context_tokens") or 0)
        reserved = int(settings.get("reserved_response_tokens") or 0)
        if max_context < 16:
            raise ChatApiError("context_limit_exceeded", "Maximum context tokens must be at least 16.")
        if reserved < 1 or reserved >= max_context:
            raise ChatApiError("context_limit_exceeded", "Reserved response tokens must be lower than maximum context tokens.")
        if settings.get("strategy") not in CONTEXT_STRATEGIES:
            raise ChatApiError("context_strategy_invalid", "Context strategy is not supported.")
        model_limit = model_capabilities.get("context_limit")
        if model_limit and max_context > int(model_limit):
            raise ChatApiError("context_limit_exceeded", "Configured context tokens exceed the model context limit.")


class SimpleChatRequestBuilder:
    """Canonical receive-save-build-generate-save pipeline for chat messages."""

    def __init__(self, store: SimpleChatStore):
        self.store = store
        self.context_manager = ConversationContextManager()

    def send_message(
        self,
        chat_id: str,
        content: str,
        model: Any,
        model_info: Mapping[str, Any],
        generation_overrides: Mapping[str, Any] | None = None,
        *,
        mode: str = "chat",
        operation_id: str | None = None,
        event_callback: Any | None = None,
        cancel_check: Any | None = None,
        agent_tools: Sequence[Any] | None = None,
        agent_trace_handler: Any | None = None,
    ) -> dict[str, Any]:
        run = create_generation_run(chat_id, mode=mode, operation_id=operation_id, model_info=model_info)
        self.store.database.upsert_generation_run(run)

        def stage(state: str, timestamp_field: str | None = None, message: str | None = None, **details: Any) -> None:
            update_generation_run_state(run, state, timestamp_field=timestamp_field, **details)
            self.store.database.upsert_generation_run(run)
            if event_callback is not None:
                event_callback(state, message or state.replace("_", " ").title(), details)

        def cancelled() -> bool:
            return bool(cancel_check and cancel_check())

        conversation = self.store.get_chat(chat_id)
        stage("preparing", "preparation_started_at", "Preparing request.")
        if cancelled():
            stage("cancelled", message="Response generation was cancelled before preparation completed.")
            raise ChatApiError("generation_cancelled", "Generation was cancelled.", status_code=499)
        user_message = self.store.append_message(chat_id, "user", content, token_count=estimate_tokens(content))
        run["user_message_id"] = user_message["id"]
        self.store.database.upsert_generation_run(run)
        conversation = self.store.get_chat(chat_id)
        adapter = SimpleChatModelAdapter(model)
        template = self.store.get_template(conversation.get("chat_template_id") or self.store.get_settings().get("active_template_id") or "basic-chat")
        settings = self._resolved_settings(conversation)
        generation_settings = _deep_merge(settings.get("generation") or {}, conversation.get("generation_settings") or {})
        generation_settings = _deep_merge(generation_settings, generation_overrides or {})
        stage("preparing", message="Loading conversation context.")
        context = self.context_manager.build_context(
            conversation,
            adapter.get_capabilities(),
            template,
            settings,
            memories=self.store.list_memories(),
            tokenizer=adapter.tokenizer,
        )
        update_generation_run_state(
            run,
            "preparing",
            timestamp_field="preparation_completed_at",
            chat_template_id=template.get("id"),
            chat_template_version=template.get("schema_version"),
            canonical_input_messages=context.get("prompt_messages"),
            rendered_model_input=context["prepared_input"] if settings.get("privacy", {}).get("save_exact_rendered_input") else None,
            generation_settings=dict(generation_settings),
            requested_device=(model_info.get("load_options") or {}).get("device"),
            actual_device=model_info.get("primary_device") or model_info.get("device"),
            dtype=model_info.get("dtype"),
            token_metrics=context["report"].get("token_metrics"),
            context_report=context["report"],
        )
        self.store.database.upsert_generation_run(run)
        if cancelled():
            stage("cancelled", message="Response generation was cancelled after context preparation.")
            raise ChatApiError("generation_cancelled", "Generation was cancelled.", status_code=499)
        try:
            stage("generating", "generation_started_at", "Starting model generation.")
            if str(mode or "chat").lower() == "agent":
                output, agent_metadata = self._run_agent(
                    adapter=adapter,
                    context=context,
                    content=content,
                    settings=settings,
                    generation_settings=generation_settings,
                    tools=list(agent_tools or []),
                    trace_handler=agent_trace_handler,
                    run=run,
                )
            else:
                output = adapter.generate(context["prepared_input"], generation_settings)
                agent_metadata = {}
            update_generation_run_state(run, "generating", timestamp_field="generation_completed_at")
            assistant_text = assistant_output_text(output, context["prepared_input"])
            output_token = token_count_details(assistant_text, adapter.tokenizer)
            token_metrics = copy.deepcopy(context["report"].get("token_metrics") or {})
            token_metrics.update(
                {
                    "generated_output_tokens": output_token["count"],
                    "output_token_count_type": output_token["type"],
                    "total_tokens": int(token_metrics.get("total_input_tokens") or 0) + output_token["count"],
                }
            )
            run["token_metrics"] = token_metrics
            run["performance_metrics"] = performance_metrics(run)
            run["tool_calls"] = agent_metadata.get("tool_calls", [])
            run["tool_results"] = agent_metadata.get("tool_results", [])
            stage("saving", "response_saved_at", "Saving conversation.")
            assistant_message = self.store.append_message(
                chat_id,
                "assistant",
                assistant_text,
                model=dict(model_info),
                token_count=output_token["count"],
                generation_metadata={
                    "generation_run_id": run["id"],
                    "response_lifecycle": copy.deepcopy(run),
                    "response_metrics": copy.deepcopy(run.get("performance_metrics") or {}),
                    "token_metrics": copy.deepcopy(token_metrics),
                    "agent": agent_metadata,
                    "settings": dict(generation_settings),
                    "context_report": context["report"],
                },
            )
            run["assistant_message_id"] = assistant_message["id"]
            stage("completed", None, "Response completed.")
        except Exception as exc:
            status = "tool_failed" if "tool_" in str(getattr(exc, "code", "")) or "tool" in str(exc).lower() else "failed"
            update_generation_run_state(run, status)
            self.store.database.upsert_generation_run(run)
            assistant_message = self.store.append_message(
                chat_id,
                "assistant",
                "",
                status="error",
                model=dict(model_info),
                error={"code": "generation_failed", "message": str(exc)[:500]},
                generation_metadata={"generation_run_id": run["id"], "response_lifecycle": copy.deepcopy(run), "context_report": context["report"]},
            )
            run["assistant_message_id"] = assistant_message["id"]
            self.store.database.upsert_generation_run(run)
            if isinstance(exc, ChatApiError):
                raise
            raise ChatApiError("generation_failed", "Generation failed.", status_code=500) from exc
        return {
            "conversation": copy.deepcopy(self.store.get_chat(chat_id)),
            "user_message": user_message,
            "assistant_message": assistant_message,
            "context_report": context["report"],
            "generation_run": copy.deepcopy(run),
        }

    def _run_agent(
        self,
        *,
        adapter: SimpleChatModelAdapter,
        context: Mapping[str, Any],
        content: str,
        settings: Mapping[str, Any],
        generation_settings: Mapping[str, Any],
        tools: list[Any],
        trace_handler: Any | None,
        run: dict[str, Any],
    ) -> tuple[str, dict[str, Any]]:
        from arclm.agents import Agent, AgentMessage, AgentRunner, AgentSession, ArcLMJSONToolAdapter, AutoApprovalHandler, DenyApprovalHandler, ToolPermission, ToolPolicy

        def generate_agent_text(prompt: str) -> str:
            return adapter.generate(prompt, generation_settings)

        agent_settings = _deep_merge(DEFAULT_SETTINGS["agent"], settings.get("agent") or {})
        enabled_tools = set(agent_settings.get("enabled_tools") or [])
        active_tools = [item for item in tools if getattr(item, "name", "") in enabled_tools]
        if not active_tools:
            raise ChatApiError("agent_tools_unavailable", "Agent mode has no enabled safe tools.", status_code=400)
        permissions = set()
        require_human_approval = bool(settings.get("privacy", {}).get("require_tool_approvals"))
        if require_human_approval:
            permissions = {permission for permission in ToolPermission}
        else:
            permissions = {ToolPermission.READ_NETWORK, ToolPermission.WRITE_LOCAL, ToolPermission.EXTERNAL_ACTION, ToolPermission.SENSITIVE}
        policy = ToolPolicy(allowed_tools={tool.name for tool in active_tools}, require_approval_for=permissions, max_result_bytes=int(agent_settings.get("max_tool_output_bytes") or 65536))
        prompt_messages = context.get("prompt_messages") or []
        session = AgentSession(max_messages=100)
        for message in prompt_messages:
            if message.get("role") == "user" and message.get("content") == content:
                continue
            role = message.get("role") if message.get("role") in SUPPORTED_ROLES else "user"
            session.add_message(AgentMessage(role=role, content=str(message.get("content", "")), metadata=dict(message.get("metadata") or {})))
        agent = Agent(
            name="ArcLM Simple Interface Agent",
            instructions="Use only the provided ArcLM tools when they are needed. Return strict JSON following the requested protocol. Do not reveal hidden reasoning.",
            model=ArcLMJSONToolAdapter(generate_agent_text),
            tools=active_tools,
            max_steps=max(1, min(int(agent_settings.get("max_steps") or 8), 16)),
            tool_policy=policy,
            session_policy={"max_messages": 100},
        )
        approval_handler = DenyApprovalHandler() if require_human_approval else AutoApprovalHandler()
        runner = AgentRunner(max_steps=agent.max_steps, approval_handler=approval_handler, timeout_seconds=None, trace_handler=trace_handler)
        result = runner.run(agent, content, session=session)
        metadata = result.to_dict()
        tool_calls = _tool_calls_from_agent_result(metadata, run["id"], active_tools)
        tool_results = _tool_results_from_agent_result(metadata, run["id"])
        run["tool_calls"] = tool_calls
        run["tool_results"] = tool_results
        for call in tool_calls:
            self.store.database.upsert_tool_call(call)
        for tool_result in tool_results:
            self.store.database.upsert_tool_result(tool_result)
        if not result.success:
            raise ChatApiError(result.error_code or "agent_failed", result.error_message or "Agent run failed.", status_code=500)
        return result.output or "", {"trace": metadata.get("trace"), "session": metadata.get("session"), "tool_calls": tool_calls, "tool_results": tool_results}

    def inspect_context(self, chat_id: str, model: Any | None = None) -> dict[str, Any]:
        conversation = self.store.get_chat(chat_id)
        adapter = SimpleChatModelAdapter(model) if model is not None else None
        capabilities = adapter.get_capabilities() if adapter else {"context_limit": None}
        template = self.store.get_template(conversation.get("chat_template_id") or self.store.get_settings().get("active_template_id") or "basic-chat")
        settings = self._resolved_settings(conversation)
        context = self.context_manager.build_context(
            conversation,
            capabilities,
            template,
            settings,
            memories=self.store.list_memories(),
            tokenizer=adapter.tokenizer if adapter else None,
        )
        return context["report"]

    def _resolved_settings(self, conversation: Mapping[str, Any]) -> dict[str, Any]:
        return _deep_merge(self.store.get_settings(), conversation.get("settings") or {})


def validate_template(payload: Mapping[str, Any]) -> dict[str, Any]:
    """Validate and normalize a chat template without executing code."""

    if len(json.dumps(payload, ensure_ascii=False, default=str)) > MAX_TEMPLATE_JSON_CHARS:
        raise ChatApiError("template_invalid", "Template JSON is too large.", status_code=413)
    errors: list[dict[str, Any]] = []
    template = copy.deepcopy(dict(payload))
    template.setdefault("schema_version", 1)
    template.setdefault("id", new_id("template"))
    template.setdefault("name", "Custom template")
    template.setdefault("description", "")
    template.setdefault("message_format", {"role_field": "role", "content_field": "content"})
    template.setdefault("roles", {"system": "system", "user": "user", "assistant": "assistant", "tool": "tool"})
    template.setdefault("input_mapping", {"user_role": "user", "user_input_field": "content"})
    template.setdefault("system_message", {"enabled": True, "role": "system"})
    template.setdefault("output", {"type": "messages"})
    template.setdefault("template", "")
    template.setdefault("assistant_prefix", "Assistant:")
    template.setdefault("stop_sequences", [])

    if template["schema_version"] != 1:
        errors.append({"code": "template_invalid", "message": "schema_version must be 1."})
    if not _safe_identifier(str(template["id"])):
        errors.append({"code": "template_invalid", "message": "id must be a safe identifier."})
    if not str(template["name"]).strip():
        errors.append({"code": "template_invalid", "message": "name is required."})
    role_map = template.get("roles") or {}
    for role in ("user", "assistant"):
        if role not in role_map or not str(role_map[role]).strip():
            errors.append({"code": "template_role_invalid", "message": f"roles.{role} is required."})
    unknown_internal_roles = set(role_map) - SUPPORTED_ROLES
    if unknown_internal_roles:
        errors.append({"code": "template_role_invalid", "message": "Unsupported internal role mapping: " + ", ".join(sorted(unknown_internal_roles))})
    output_type = (template.get("output") or {}).get("type")
    if output_type not in OUTPUT_MODES:
        errors.append({"code": "template_output_unsupported", "message": "Unsupported output mode."})
    input_field = (template.get("input_mapping") or {}).get("user_input_field")
    if not input_field or not re.match(r"^[A-Za-z_][A-Za-z0-9_]*$", str(input_field)):
        errors.append({"code": "template_invalid", "message": "input_mapping.user_input_field must be a field name."})
    if output_type in {"formatted_text", "prompt_completion"}:
        placeholders = set(re.findall(r"{{\s*([A-Za-z_][A-Za-z0-9_]*)\s*}}", str(template.get("template") or "")))
        unknown = placeholders - PLACEHOLDERS
        if unknown:
            errors.append({"code": "template_placeholder_unknown", "message": "Unknown placeholder(s): " + ", ".join(sorted(unknown))})
        if "user_input" not in placeholders:
            errors.append({"code": "template_invalid", "message": "Formatted templates must include {{user_input}}."})
    if errors:
        return {"valid": False, "errors": errors, "template": template}
    return {"valid": True, "errors": [], "template": template}


def preview_template(payload: Mapping[str, Any]) -> dict[str, Any]:
    """Render the sample conversation through a candidate template."""

    validation = validate_template(payload)
    if not validation["valid"]:
        return {**validation, "preview": None}
    template = validation["template"]
    sample = [
        {"id": "sample_system", "role": "system", "content": "You are a helpful assistant."},
        {"id": "sample_user_1", "role": "user", "content": "Hello."},
        {"id": "sample_assistant_1", "role": "assistant", "content": "Hello! How can I help?"},
        {"id": "sample_user_2", "role": "user", "content": "Explain tokenization."},
    ]
    prepared = apply_chat_template(sample, template, current_user_message=sample[-1])
    return {**validation, "preview": prepared, "token_count": estimate_tokens(prepared)}


def apply_chat_template(messages: Sequence[Mapping[str, Any]], template: Mapping[str, Any], current_user_message: Mapping[str, Any] | None = None) -> Any:
    """Apply a validated template to normalized ArcLM messages."""

    validation = validate_template(template)
    if not validation["valid"]:
        raise ChatApiError("template_invalid", "Template is invalid.", details={"errors": validation["errors"]})
    template = validation["template"]
    output_type = template["output"]["type"]
    if output_type in {"messages", "tokenizer_chat_template"}:
        return [_mapped_message(message, template) for message in messages]
    variables = {
        "system": "\n".join(message["content"] for message in messages if message.get("role") == "system").strip(),
        "memory": "\n".join(message["content"] for message in messages if message.get("role") == "tool" and message.get("metadata", {}).get("kind") == "memory").strip(),
        "summary": "\n".join(message["content"] for message in messages if message.get("role") == "system" and message.get("metadata", {}).get("kind") == "summary").strip(),
        "history": render_history_text([message for message in messages if message.get("role") in {"user", "assistant", "tool"} and message is not current_user_message]),
        "user_input": str((current_user_message or messages[-1]).get("content", "")) if messages else "",
        "assistant_prefix": str(template.get("assistant_prefix") or ""),
    }
    return render_placeholders(str(template.get("template") or "{{history}}\n{{user_input}}"), variables)


def render_placeholders(template: str, variables: Mapping[str, str]) -> str:
    """Render a restricted placeholder template."""

    unknown = set(re.findall(r"{{\s*([A-Za-z_][A-Za-z0-9_]*)\s*}}", template)) - PLACEHOLDERS
    if unknown:
        raise ChatApiError("template_placeholder_unknown", "Unknown placeholder(s): " + ", ".join(sorted(unknown)))

    def replace(match: re.Match[str]) -> str:
        return str(variables.get(match.group(1), ""))

    return re.sub(r"{{\s*([A-Za-z_][A-Za-z0-9_]*)\s*}}", replace, template).strip()


def build_prompt_messages(
    selected: Sequence[Mapping[str, Any]],
    system: str,
    persistent: str,
    summary: str,
    memory_text: str,
    template: Mapping[str, Any],
) -> list[dict[str, Any]]:
    messages: list[dict[str, Any]] = []
    if system and (template.get("system_message") or {}).get("enabled", True):
        messages.append({"id": "resolved_system", "role": "system", "content": system, "metadata": {"kind": "system"}})
    if persistent:
        messages.append({"id": "persistent_instructions", "role": "system", "content": persistent, "metadata": {"kind": "persistent"}})
    if summary:
        messages.append({"id": "conversation_summary", "role": "system", "content": "Conversation summary:\n" + summary, "metadata": {"kind": "summary"}})
    if memory_text:
        messages.append({"id": "local_memory", "role": "tool", "content": memory_text, "metadata": {"kind": "memory"}})
    messages.extend(copy.deepcopy(list(selected)))
    return messages


def select_messages(messages: Sequence[Mapping[str, Any]], settings: Mapping[str, Any], budget: int, tokenizer: Any = None) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    """Select recent messages within count and token budgets."""

    max_history = int(settings.get("max_history_messages") or 30)
    strategy = settings.get("strategy") or "token_budget"
    contextable = [
        item
        for item in messages
        if item.get("metadata", {}).get("include_in_context", True)
        and item.get("status", "complete") in {"complete", "completed"}
    ]
    if strategy == "all_messages":
        candidates = list(contextable)
    elif strategy == "manual":
        candidates = list(contextable)
    else:
        candidates = list(contextable)[-max_history:]

    if strategy == "recent_messages":
        selected = copy.deepcopy(candidates)
    else:
        selected_reversed = []
        total = 0
        for message in reversed(candidates):
            cost = estimate_tokens({"role": message.get("role"), "content": message.get("content")}, tokenizer) + 4
            if selected_reversed and total + cost > budget:
                break
            selected_reversed.append(message)
            total += cost
        selected = list(reversed(selected_reversed))
    selected_ids = {id(item) for item in selected}
    selected_message_ids = {item.get("id") for item in selected}
    excluded = [item for item in messages if id(item) not in selected_ids and item.get("id") not in selected_message_ids]
    return copy.deepcopy(selected), copy.deepcopy(excluded)


def conversation_summary(conversation: Mapping[str, Any]) -> dict[str, Any]:
    messages = conversation.get("messages", [])
    return {
        "id": conversation.get("id"),
        "title": conversation.get("title"),
        "created_at": conversation.get("created_at"),
        "updated_at": conversation.get("updated_at"),
        "selected_model": conversation.get("selected_model"),
        "model_source": conversation.get("model_source"),
        "chat_template_id": conversation.get("chat_template_id"),
        "message_count": len(messages),
        "last_message": next((item.get("content", "")[:160] for item in reversed(messages) if item.get("content")), ""),
        "summary": conversation.get("summary", ""),
        "metadata": conversation.get("metadata", {}),
    }


def title_from_message(content: str) -> str:
    words = re.findall(r"[A-Za-z0-9][A-Za-z0-9'-]*", content)
    stop = {"a", "an", "the", "is", "are", "can", "could", "would", "should", "how", "what", "why", "please"}
    selected = [word for word in words if word.lower() not in stop][:6] or words[:6]
    if not selected:
        return "New chat"
    return " ".join(word[:1].upper() + word[1:] for word in selected)[:80]


def resolve_system_instructions(settings: Mapping[str, Any], conversation: Mapping[str, Any], profile: Mapping[str, Any] | None = None) -> str:
    if conversation.get("system_instructions"):
        return str(conversation["system_instructions"])
    if profile and profile.get("system_instructions"):
        return str(profile["system_instructions"])
    return str(settings.get("system_instructions") or "")


def render_memories(memories: Sequence[Mapping[str, Any]]) -> str:
    items = []
    for memory in memories:
        value = str(memory.get("value") or "")
        if value:
            items.append({"key": memory.get("key"), "value": value, "category": memory.get("category")})
    if not items:
        return ""
    return json.dumps({"type": "user_memory", "items": items}, ensure_ascii=False)


def render_history_text(messages: Sequence[Mapping[str, Any]]) -> str:
    return "\n".join(f"{str(message.get('role', 'user')).title()}: {message.get('content', '')}" for message in messages).strip()


def build_input_token_metrics(
    *,
    prompt_messages: Sequence[Mapping[str, Any]],
    selected: Sequence[Mapping[str, Any]],
    prepared_input: Any,
    system: str,
    persistent: str,
    summary: str,
    memory_text: str,
    current_user_message: Mapping[str, Any] | None,
    tokenizer: Any = None,
) -> dict[str, Any]:
    total = token_count_details(prepared_input, tokenizer)
    system_count = token_count_details(system + ("\n" + persistent if persistent else ""), tokenizer)
    memory_count = token_count_details(memory_text, tokenizer)
    summary_count = token_count_details(summary, tokenizer)
    history_messages = [item for item in selected if item.get("role") in {"user", "assistant", "tool"}]
    latest_user = current_user_message or next((item for item in reversed(history_messages) if item.get("role") == "user"), {})
    latest_user_id = latest_user.get("id")
    history_without_current = [item for item in history_messages if item.get("id") != latest_user_id]
    history_count = token_count_details(render_history_text(history_without_current), tokenizer)
    current_count = token_count_details(str(latest_user.get("content", "")), tokenizer)
    component_total = system_count["count"] + memory_count["count"] + summary_count["count"] + history_count["count"] + current_count["count"]
    return {
        "system_tokens": system_count["count"],
        "memory_tokens": memory_count["count"],
        "summary_tokens": summary_count["count"],
        "history_tokens": history_count["count"],
        "current_user_tokens": current_count["count"],
        "template_overhead_tokens": max(0, total["count"] - component_total),
        "total_input_tokens": total["count"],
        "input_token_count_type": total["type"],
        "tokenizer_method": total["method"],
        "prepared_message_count": len(prompt_messages),
    }


def create_generation_run(chat_id: str, *, mode: str, operation_id: str | None, model_info: Mapping[str, Any]) -> dict[str, Any]:
    now = utc_now()
    return {
        "id": new_id("gen"),
        "operation_id": operation_id,
        "conversation_id": chat_id,
        "user_message_id": None,
        "assistant_message_id": None,
        "status": "queued",
        "mode": "agent" if str(mode).lower() == "agent" else "chat",
        "created_at": now,
        "updated_at": now,
        "timestamps": {"request_received_at": now},
        "durations_ms": {},
        "model": copy.deepcopy(dict(model_info or {})),
        "requested_device": (model_info.get("load_options") or {}).get("device") if isinstance(model_info, Mapping) else None,
        "actual_device": model_info.get("primary_device") or model_info.get("device") if isinstance(model_info, Mapping) else None,
        "dtype": model_info.get("dtype") if isinstance(model_info, Mapping) else None,
        "token_metrics": {},
        "performance_metrics": {},
        "tool_calls": [],
        "tool_results": [],
    }


def update_generation_run_state(run: dict[str, Any], state: str, *, timestamp_field: str | None = None, **values: Any) -> None:
    if state not in RESPONSE_STATES:
        raise ChatApiError("response_state_invalid", "Response lifecycle state is not supported.", status_code=500)
    run["status"] = state
    run["updated_at"] = utc_now()
    if timestamp_field:
        run.setdefault("timestamps", {})[timestamp_field] = run["updated_at"]
    for key, value in values.items():
        if value is not None:
            run[key] = copy.deepcopy(value)
    run["durations_ms"] = response_durations(run.get("timestamps") or {})


def response_durations(timestamps: Mapping[str, Any]) -> dict[str, float]:
    pairs = {
        "queue_duration_ms": ("request_received_at", "preparation_started_at"),
        "preparation_duration_ms": ("preparation_started_at", "preparation_completed_at"),
        "time_to_first_token_ms": ("request_received_at", "first_token_emitted_at"),
        "model_first_token_latency_ms": ("generation_started_at", "first_token_emitted_at"),
        "tool_duration_ms": ("tool_execution_started_at", "tool_execution_completed_at"),
        "generation_duration_ms": ("generation_started_at", "generation_completed_at"),
        "reveal_duration_ms": ("reveal_started_at", "reveal_completed_at"),
        "total_duration_ms": ("request_received_at", "response_saved_at"),
    }
    durations: dict[str, float] = {}
    for name, (start_key, end_key) in pairs.items():
        start = _parse_iso(timestamps.get(start_key))
        end = _parse_iso(timestamps.get(end_key))
        if start is not None and end is not None and end >= start:
            durations[name] = round((end - start) * 1000, 3)
    return durations


def performance_metrics(run: Mapping[str, Any]) -> dict[str, Any]:
    durations = dict(run.get("durations_ms") or {})
    tokens = dict(run.get("token_metrics") or {})
    output_tokens = tokens.get("generated_output_tokens")
    generation_ms = durations.get("generation_duration_ms")
    metrics = {
        "durations_ms": durations,
        "backend_generation_time_ms": generation_ms,
        "progressive_reveal_time_ms": durations.get("reveal_duration_ms"),
        "true_streaming": bool(run.get("streaming_mode") and run.get("streaming_mode") != "non_streaming"),
        "streaming_mode": run.get("streaming_mode") or "non_streaming",
        "time_to_first_token_ms": durations.get("time_to_first_token_ms"),
        "model_first_token_latency_ms": durations.get("model_first_token_latency_ms"),
    }
    if output_tokens is not None and generation_ms and generation_ms > 0:
        metrics["tokens_per_second"] = round(float(output_tokens) / (generation_ms / 1000.0), 3)
    return metrics


def _tool_calls_from_agent_result(metadata: Mapping[str, Any], generation_run_id: str, tools: Sequence[Any]) -> list[dict[str, Any]]:
    specs = {tool.name: tool.spec.to_dict() for tool in tools if hasattr(tool, "spec")}
    trace_events = ((metadata.get("trace") or {}).get("events") or [])
    calls = []
    for call in ((metadata.get("session") or {}).get("tool_calls") or []):
        call_id = str(call.get("id"))
        tool_name = str(call.get("name") or "")
        spec = specs.get(tool_name, {})
        related = [event for event in trace_events if (event.get("metadata") or {}).get("tool_call_id") == call_id or event.get("tool_name") == tool_name]
        completed = next((event for event in related if event.get("event_type") in {"tool_completed", "tool_failed"}), None)
        started = next((event for event in related if event.get("event_type") == "tool_started"), None)
        denied = next((event for event in related if event.get("event_type") == "approval_denied"), None)
        status = "denied" if denied else "completed" if completed and completed.get("event_type") == "tool_completed" else "failed" if completed else "requested"
        calls.append(
            {
                "id": call_id,
                "generation_run_id": generation_run_id,
                "tool_name": tool_name,
                "arguments_json": call.get("arguments") or {},
                "permission_category": spec.get("permission"),
                "side_effect": spec.get("side_effect"),
                "filesystem_access": spec.get("permission") == "read_local",
                "network_access": spec.get("permission") == "read_network",
                "secret_access": spec.get("permission") == "sensitive",
                "approval_required": status == "denied",
                "approval_status": "approved" if status != "denied" else "denied",
                "started_at": _timestamp_from_trace(started),
                "completed_at": _timestamp_from_trace(completed or denied),
                "duration_ms": round(float(completed.get("duration_seconds", 0)) * 1000, 3) if completed and completed.get("duration_seconds") is not None else None,
                "status": status,
                "safe_error_code": (completed.get("metadata") or {}).get("error_code") if completed else None,
            }
        )
    return calls


def _tool_results_from_agent_result(metadata: Mapping[str, Any], generation_run_id: str) -> list[dict[str, Any]]:
    results = []
    for message in ((metadata.get("session") or {}).get("messages") or []):
        if message.get("role") != "tool":
            continue
        content = str(message.get("content") or "")
        results.append(
            {
                "id": new_id("tool_result"),
                "tool_call_id": message.get("tool_call_id"),
                "generation_run_id": generation_run_id,
                "tool_name": message.get("name"),
                "status": "completed",
                "structured_safe_result": _safe_json_loads(content),
                "result_size": len(content.encode("utf-8")),
                "redaction_status": "security_core",
            }
        )
    return results


def assistant_output_text(output: str, prepared_input: Any) -> str:
    text = str(output or "")
    if isinstance(prepared_input, str) and text.startswith(prepared_input):
        return text[len(prepared_input) :].strip()
    return text.strip()


def _mapped_message(message: Mapping[str, Any], template: Mapping[str, Any]) -> dict[str, str]:
    message_format = template.get("message_format") or {}
    role_field = message_format.get("role_field") or "role"
    content_field = message_format.get("content_field") or "content"
    role = str(message.get("role", "user"))
    mapped_role = (template.get("roles") or {}).get(role, role)
    return {role_field: mapped_role, content_field: str(message.get("content", ""))}


def _initial_data() -> dict[str, Any]:
    return {
        "schema_version": SCHEMA_VERSION,
        "settings": copy.deepcopy(DEFAULT_SETTINGS),
        "conversations": {},
        "templates": {},
        "model_profiles": {},
        "memories": [],
        "migrations": [{"id": "initial-simple-chat-store", "applied_at": utc_now()}],
    }


def _deep_merge(base: Mapping[str, Any], override: Mapping[str, Any] | None) -> dict[str, Any]:
    result = copy.deepcopy(dict(base or {}))
    for key, value in dict(override or {}).items():
        if isinstance(value, Mapping) and isinstance(result.get(key), Mapping):
            result[key] = _deep_merge(result[key], value)
        else:
            result[key] = copy.deepcopy(value)
    return result


def _clean_title(value: Any) -> str:
    text = re.sub(r"\s+", " ", str(value or "").strip())
    return text[:80] or "New chat"


def _bounded_text(value: Any, limit: int) -> str:
    text = str(value or "")
    if len(text) > limit:
        raise ChatApiError("content_too_large", f"Text must be at most {limit} characters.", status_code=413)
    return text


def _safe_identifier(value: str) -> bool:
    return bool(re.match(r"^[A-Za-z0-9][A-Za-z0-9_.-]{0,120}$", value))


def _parse_iso(value: Any) -> float | None:
    if not value:
        return None
    try:
        return datetime.fromisoformat(str(value)).timestamp()
    except ValueError:
        return None


def _timestamp_from_trace(event: Mapping[str, Any] | None) -> str | None:
    if not event or event.get("timestamp") is None:
        return None
    return datetime.fromtimestamp(float(event["timestamp"]), timezone.utc).replace(microsecond=0).isoformat()


def _safe_json_loads(value: str) -> Any:
    try:
        return json.loads(value)
    except Exception:
        return {"content": value[:4000]}


def _model_context_limit(model: Any) -> int | None:
    for owner in (getattr(model, "config", None), getattr(model, "model", None), model):
        for name in ("max_position_embeddings", "n_positions", "block_size", "max_sequence_length"):
            value = getattr(owner, name, None)
            if isinstance(value, int) and value > 0:
                return value
            if isinstance(owner, Mapping) and isinstance(owner.get(name), int):
                return int(owner[name])
    native = getattr(model, "_native_loaded", None)
    config = getattr(native, "config", None)
    value = getattr(config, "block_size", None)
    return int(value) if isinstance(value, int) and value > 0 else None


def _validate_imported_conversation(payload: Mapping[str, Any]) -> dict[str, Any]:
    if not isinstance(payload, Mapping):
        raise ChatApiError("import_invalid", "Conversation must be an object.")
    conversation = copy.deepcopy(dict(payload))
    conversation.setdefault("id", new_id("chat"))
    if not _safe_identifier(str(conversation["id"])):
        conversation["id"] = new_id("chat")
    conversation.setdefault("title", "Imported chat")
    conversation.setdefault("created_at", utc_now())
    conversation.setdefault("updated_at", utc_now())
    conversation.setdefault("messages", [])
    messages = []
    for message in conversation["messages"][:2000]:
        role = str(message.get("role", "user"))
        if role not in SUPPORTED_ROLES:
            raise ChatApiError("import_invalid", "Imported message role is unsupported.")
        messages.append({
            "id": str(message.get("id") or new_id("msg")),
            "conversation_id": conversation["id"],
            "role": role,
            "content": _bounded_text(message.get("content", ""), MAX_MESSAGE_CHARS),
            "created_at": message.get("created_at") or utc_now(),
            "status": message.get("status") or "complete",
            "model": message.get("model"),
            "token_count": message.get("token_count"),
            "generation_metadata": dict(message.get("generation_metadata") or {}),
            "error": message.get("error"),
            "metadata": dict(message.get("metadata") or {}),
        })
    conversation["messages"] = messages
    conversation.setdefault("context_settings", copy.deepcopy(DEFAULT_SETTINGS["context"]))
    conversation.setdefault("generation_settings", copy.deepcopy(DEFAULT_SETTINGS["generation"]))
    conversation.setdefault("metadata", {})
    return conversation
