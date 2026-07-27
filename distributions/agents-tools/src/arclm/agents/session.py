"""Serializable in-memory agent sessions."""

from __future__ import annotations

import json
import time
import uuid
from dataclasses import dataclass, field
from typing import Any

from .messages import AgentMessage, ToolCall


@dataclass
class AgentSession:
    """Bounded in-memory session state."""

    session_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    messages: list[AgentMessage] = field(default_factory=list)
    tool_calls: list[ToolCall] = field(default_factory=list)
    metadata: dict[str, Any] = field(default_factory=dict)
    created_at: float = field(default_factory=time.time)
    updated_at: float = field(default_factory=time.time)
    max_messages: int = 100

    def add_message(self, message: AgentMessage) -> None:
        """Append a message and enforce bounded history."""

        self.messages.append(message)
        if len(self.messages) > self.max_messages:
            self.messages = self.messages[-self.max_messages :]
        self.updated_at = time.time()

    def add_tool_call(self, call: ToolCall) -> None:
        """Record a tool call."""

        self.tool_calls.append(call)
        self.updated_at = time.time()

    def to_dict(self) -> dict[str, Any]:
        """Return a JSON-safe session dictionary."""

        return {
            "session_id": self.session_id,
            "messages": [message.to_dict() for message in self.messages],
            "tool_calls": [call.to_dict() for call in self.tool_calls],
            "metadata": dict(self.metadata),
            "created_at": self.created_at,
            "updated_at": self.updated_at,
            "max_messages": self.max_messages,
        }

    def to_json(self, **kwargs: Any) -> str:
        """Serialize session state to JSON."""

        return json.dumps(self.to_dict(), **kwargs)

    @classmethod
    def from_dict(cls, values: dict[str, Any]) -> "AgentSession":
        """Restore a session from JSON-safe data."""

        session = cls(
            session_id=str(values["session_id"]),
            metadata=dict(values.get("metadata", {})),
            created_at=float(values.get("created_at", time.time())),
            updated_at=float(values.get("updated_at", time.time())),
            max_messages=int(values.get("max_messages", 100)),
        )
        session.messages = [AgentMessage(**item) for item in values.get("messages", [])]
        session.tool_calls = [ToolCall(**item) for item in values.get("tool_calls", [])]
        return session

    @classmethod
    def from_json(cls, payload: str) -> "AgentSession":
        """Restore a session from JSON."""

        values = json.loads(payload)
        if not isinstance(values, dict):
            raise ValueError("agent session JSON must contain an object")
        return cls.from_dict(values)
