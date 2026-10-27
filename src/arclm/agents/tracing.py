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


def to_otel_spans(trace: "AgentTrace") -> list[dict[str, Any]]:
    """Convert an AgentTrace to OTel-style span dicts (no SDK required).

    Each event becomes a span with GenAI-inspired attribute names so callers
    can hand the list to an OpenTelemetry exporter without ArcLM depending on
    the opentelemetry packages::

        from opentelemetry.sdk.trace import TracerProvider  # user side
        # or simply ship trace.to_otel_spans(...) to your collector

    Returns:
        List of dicts: ``{name, start_time_unix_nano, attributes}``.
    """
    spans: list[dict[str, Any]] = []
    events = list(trace.events)
    for i, ev in enumerate(events):
        start_ns = int(ev.timestamp * 1e9)
        duration_ns = (
            int(ev.duration_seconds * 1e9) if ev.duration_seconds else None
        )
        attrs: dict[str, Any] = {
            "genai.operation.name": ev.event_type,
            "arclm.run_id": ev.run_id,
            "arclm.step": ev.step,
        }
        if ev.tool_name:
            attrs["genai.tool.name"] = ev.tool_name
        if duration_ns is not None:
            attrs["duration_ns"] = duration_ns
        attrs.update({f"arclm.{k}": v for k, v in (ev.metadata or {}).items()})
        spans.append(
            {
                "name": f"arclm.agent.{ev.event_type}",
                "start_time_unix_nano": start_ns,
                "attributes": attrs,
                "event_index": i,
            }
        )
    return spans


def trace_to_jsonl_lines(trace: "AgentTrace") -> list[str]:
    """One JSON object per line — convenient for OTLP file exporters."""
    import json

    return [json.dumps(span, default=str) for span in to_otel_spans(trace)]
