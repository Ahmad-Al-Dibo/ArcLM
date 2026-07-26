"""Safe execution context passed to tools."""

from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path
from typing import Any


@dataclass
class ToolContext:
    """Bounded context for one tool invocation."""

    session_id: str
    agent_name: str
    tool_call_id: str
    approved_permissions: set[str] = field(default_factory=set)
    workspace_root: Path | None = None
    metadata: dict[str, Any] = field(default_factory=dict)
    cancelled: bool = False

    def check_cancelled(self) -> None:
        """Raise a cooperative cancellation error if requested."""

        if self.cancelled:
            raise RuntimeError("tool execution was cancelled")

    def safe_metadata(self) -> dict[str, Any]:
        """Return JSON-safe metadata only."""

        return dict(self.metadata)
