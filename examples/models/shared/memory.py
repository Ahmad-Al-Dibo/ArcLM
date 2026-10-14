"""Getypeerde gespreksmemory voor het lokale Agent-voorbeeld."""

from __future__ import annotations

import json
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Dict, List, Optional


@dataclass
class MemoryConfig:
    enabled: bool = True
    mode: str = "in_memory"
    max_messages: int = 20
    max_context_tokens: int = 2048
    summary_threshold: int = 14
    persist: bool = False
    storage_path: Optional[str] = None
    encrypt_persistent_memory: bool = True

    def __post_init__(self) -> None:
        if self.mode not in {"disabled", "in_memory", "json_persistent"}:
            raise ValueError("mode moet disabled, in_memory of json_persistent zijn.")
        if self.max_messages < 1:
            raise ValueError("max_messages moet minimaal 1 zijn.")
        if self.max_context_tokens < 64:
            raise ValueError("max_context_tokens moet minimaal 64 zijn.")


class ConversationMemory:
    """Slaat alleen zichtbare berichten en toegestane toolresultaten op."""

    def __init__(self, config: MemoryConfig, session_id: str = "default"):
        self.config = config
        self.session_id = session_id
        self.messages: List[Dict[str, str]] = []
        self.compactions = 0
        if self.config.persist and self.config.storage_path:
            self.restore()

    def add(self, role: str, content: str) -> None:
        if not self.config.enabled or self.config.mode == "disabled":
            return
        self.messages.append({"role": role, "content": content})
        self._trim()
        if self.config.persist and self.config.storage_path:
            self.save()

    def recall(self, query: str) -> List[Dict[str, str]]:
        terms = {part.lower() for part in query.split() if len(part) > 2}
        if not terms:
            return list(self.messages[-4:])
        return [
            message
            for message in self.messages
            if any(term in message["content"].lower() for term in terms)
        ][-6:]

    def clear(self) -> None:
        self.messages.clear()
        if self.config.persist and self.config.storage_path:
            path = self._path()
            if path.exists():
                path.unlink()

    def save(self) -> None:
        path = self._path()
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(
            json.dumps(
                {
                    "config": asdict(self.config),
                    "session_id": self.session_id,
                    "messages": self.messages,
                    "compactions": self.compactions,
                },
                indent=2,
                ensure_ascii=False,
            ),
            encoding="utf-8",
        )

    def restore(self) -> None:
        path = self._path()
        if not path.exists():
            return
        data = json.loads(path.read_text(encoding="utf-8"))
        if data.get("session_id") == self.session_id:
            self.messages = list(data.get("messages", []))
            self.compactions = int(data.get("compactions", 0))

    def context(self, reserve_tokens: int = 128) -> List[Dict[str, str]]:
        budget = max(0, self.config.max_context_tokens - reserve_tokens)
        selected: List[Dict[str, str]] = []
        used = 0
        for message in reversed(self.messages):
            estimate = max(1, len(message["content"].split()))
            if used + estimate > budget:
                self.compactions += 1
                break
            selected.append(message)
            used += estimate
        return list(reversed(selected))

    def _trim(self) -> None:
        if len(self.messages) > self.config.max_messages:
            self.messages = self.messages[-self.config.max_messages :]
            self.compactions += 1

    def _path(self) -> Path:
        if not self.config.storage_path:
            raise ValueError("storage_path is nodig voor persistente memory.")
        safe_name = "".join(ch for ch in self.session_id if ch.isalnum() or ch in "-_")
        return Path(self.config.storage_path) / f"{safe_name}.json"

