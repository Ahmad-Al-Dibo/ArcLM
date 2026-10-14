"""Lightweight local tracing for agent runs."""

from __future__ import annotations

import time
import uuid
from dataclasses import asdict, dataclass, field
from typing import Any


@dataclass
class AgentTraceEvent:
    """One safe trace event."""

    event_type: str
    timestamp: float
    run_id: str
    step: int = 0
    tool_name: str | None = None
    duration_seconds: float | None = None
    metadata: dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> dict[str, Any]:
        """Return a JSON-safe dictionary."""

        return asdict(self)


@dataclass
class AgentTrace:
    """Trace for one agent run."""

    run_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    events: list[AgentTraceEvent] = field(default_factory=list)

    def record(
        self,
        event_type: str,
        *,
        step: int = 0,
        tool_name: str | None = None,
        duration_seconds: float | None = None,
        metadata: dict[str, Any] | None = None,
    ) -> AgentTraceEvent:
        """Append a safe trace event."""

        event = AgentTraceEvent(
            event_type=event_type,
            timestamp=time.time(),
            run_id=self.run_id,
            step=step,
            tool_name=tool_name,
            duration_seconds=duration_seconds,
            metadata=dict(metadata or {}),
        )
        self.events.append(event)
        return event

    def to_dict(self) -> dict[str, Any]:
        """Return a JSON-safe dictionary."""

        return {"run_id": self.run_id, "events": [event.to_dict() for event in self.events]}
