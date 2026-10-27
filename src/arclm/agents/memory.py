"""Persistent agent session storage and recall (torch-free).

Sessions are JSON files under a root directory. Recall performs a simple
keyword-scoring search over stored messages — local, deterministic, no
embeddings required.
"""

from __future__ import annotations

import json
import re
import time
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Iterable, Sequence

from .session import AgentSession

_WORD = re.compile(r"[a-z0-9]+", re.IGNORECASE)


def _tokenize(text: str) -> list[str]:
    return [w.lower() for w in _WORD.findall(text or "")]


@dataclass
class MemoryHit:
    """One recalled session fragment."""

    session_id: str
    score: float
    role: str
    content: str
    message_index: int
    updated_at: float
    metadata: dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> dict[str, Any]:
        return {
            "session_id": self.session_id,
            "score": round(float(self.score), 4),
            "role": self.role,
            "content": self.content,
            "message_index": self.message_index,
            "updated_at": self.updated_at,
            "metadata": dict(self.metadata),
        }


class SessionStore:
    """Filesystem-backed store for :class:`AgentSession` objects.

    Layout::

        root/
          <session_id>.json

    Args:
        root: Directory for session files (created if missing).
    """

    def __init__(self, root: str | Path) -> None:
        self.root = Path(root)
        self.root.mkdir(parents=True, exist_ok=True)

    def _path(self, session_id: str) -> Path:
        safe = re.sub(r"[^A-Za-z0-9._-]", "_", session_id)
        if not safe:
            raise ValueError("session_id must contain alphanumeric characters")
        return self.root / f"{safe}.json"

    def save(self, session: AgentSession) -> Path:
        """Persist *session* (atomic-ish: write tmp then replace)."""
        path = self._path(session.session_id)
        tmp = path.with_suffix(".json.tmp")
        tmp.write_text(session.to_json(indent=2), encoding="utf-8")
        tmp.replace(path)
        return path

    def load(self, session_id: str) -> AgentSession:
        path = self._path(session_id)
        if not path.exists():
            raise FileNotFoundError(f"session not found: {session_id}")
        return AgentSession.from_json(path.read_text(encoding="utf-8"))

    def exists(self, session_id: str) -> bool:
        return self._path(session_id).exists()

    def delete(self, session_id: str) -> bool:
        path = self._path(session_id)
        if path.exists():
            path.unlink()
            return True
        return False

    def list_ids(self) -> list[str]:
        """Sorted session ids (by filename)."""
        return sorted(p.stem for p in self.root.glob("*.json"))

    def list_sessions(self, *, limit: int = 100) -> list[AgentSession]:
        """Load up to *limit* sessions, most recently updated first."""
        sessions: list[AgentSession] = []
        for sid in self.list_ids():
            try:
                sessions.append(self.load(sid))
            except (OSError, ValueError, KeyError, json.JSONDecodeError):
                continue
        sessions.sort(key=lambda s: s.updated_at, reverse=True)
        return sessions[: max(0, limit)]

    def recall(
        self,
        query: str,
        *,
        limit: int = 10,
        min_score: float = 1.0,
        roles: Sequence[str] | None = None,
        max_content: int = 500,
    ) -> list[MemoryHit]:
        """Keyword recall across all stored messages.

        Score = overlap(query_tokens, message_tokens) with a small boost for
        role matches. Deterministic; no embeddings.

        Args:
            query: Free-text query.
            limit: Maximum hits.
            min_score: Minimum token-overlap score to keep.
            roles: Optional filter, e.g. ``["user", "assistant"]``.
            max_content: Truncate stored content in hits to this length.
        """
        q_tokens = set(_tokenize(query))
        if not q_tokens:
            return []
        role_filter = set(roles) if roles else None
        hits: list[MemoryHit] = []
        for session in self.list_sessions(limit=1000):
            for i, msg in enumerate(session.messages):
                content = msg.content or ""
                role = getattr(msg, "role", "user")
                role_str = role.value if hasattr(role, "value") else str(role)
                if role_filter and role_str not in role_filter:
                    continue
                m_tokens = set(_tokenize(content))
                if not m_tokens:
                    continue
                overlap = len(q_tokens & m_tokens)
                if overlap <= 0:
                    continue
                score = float(overlap)  # Jaccard-ish count; simple + explainable
                if role_str in {"user", "assistant"}:
                    score += 0.1
                if score < min_score:
                    continue
                hits.append(
                    MemoryHit(
                        session_id=session.session_id,
                        score=score,
                        role=role_str,
                        content=content[:max_content],
                        message_index=i,
                        updated_at=session.updated_at,
                        metadata=dict(session.metadata),
                    )
                )
        hits.sort(key=lambda h: (h.score, h.updated_at), reverse=True)
        return hits[: max(0, limit)]

    def recall_as_context(
        self,
        query: str,
        *,
        limit: int = 5,
        max_content: int = 500,
    ) -> str:
        """Format recall hits as a plain-text block for prompt injection."""
        hits = self.recall(query, limit=limit, max_content=max_content)
        if not hits:
            return ""
        lines = []
        for h in hits:
            lines.append(f"[{h.role}] {h.content}")
        return "\n".join(lines)
