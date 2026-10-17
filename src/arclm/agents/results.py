"""Structured results returned by tools and agent runs."""

from __future__ import annotations

import json
import sys
from dataclasses import asdict, dataclass, field
from typing import Any, Dict, List, Union

if sys.version_info >= (3, 10):
    JSONValue = str | int | float | bool | None | list["JSONValue"] | dict[str, "JSONValue"]
else:  # Python 3.9: runtime | unions are not allowed
    JSONValue = Union[str, int, float, bool, None, List["JSONValue"], Dict[str, "JSONValue"]]


def ensure_json_safe(value: Any) -> JSONValue:
    """Return *value* if it can be safely represented as JSON."""

    try:
        json.dumps(value)
    except (TypeError, ValueError) as exc:
        raise TypeError("value must be JSON-safe") from exc
    return value


@dataclass
class ToolResult:
    """Structured tool invocation result."""

    success: bool
    value: JSONValue = None
    content: str | None = None
    error_code: str | None = None
    error_message: str | None = None
    metadata: dict[str, JSONValue] = field(default_factory=dict)

    def __post_init__(self) -> None:
        ensure_json_safe(self.value)
        ensure_json_safe(self.metadata)

    @classmethod
    def ok(
        cls,
        value: Any = None,
        *,
        content: str | None = None,
        metadata: dict[str, Any] | None = None,
    ) -> "ToolResult":
        """Create a successful tool result."""

        return cls(
            success=True,
            value=ensure_json_safe(value),
            content=content if content is not None else _content_for(value),
            metadata=ensure_json_safe(metadata or {}),
        )

    @classmethod
    def fail(
        cls,
        code: str,
        message: str,
        *,
        metadata: dict[str, Any] | None = None,
    ) -> "ToolResult":
        """Create a failed tool result without exposing raw exceptions."""

        return cls(
            success=False,
            error_code=code,
            error_message=message,
            metadata=ensure_json_safe(metadata or {}),
        )

    def to_dict(self) -> dict[str, Any]:
        """Return a JSON-safe dictionary."""

        return asdict(self)

    def to_json(self, **kwargs: Any) -> str:
        """Return a JSON representation."""

        return json.dumps(self.to_dict(), **kwargs)


@dataclass
class AgentRunResult:
    """Final outcome of a bounded agent run."""

    success: bool
    output: str | None
    session: Any
    trace: Any
    error_code: str | None = None
    error_message: str | None = None
    metadata: dict[str, JSONValue] = field(default_factory=dict)

    def to_dict(self) -> dict[str, Any]:
        """Return a JSON-safe dictionary."""

        return {
            "success": self.success,
            "output": self.output,
            "session": self.session.to_dict() if hasattr(self.session, "to_dict") else self.session,
            "trace": self.trace.to_dict() if hasattr(self.trace, "to_dict") else self.trace,
            "error_code": self.error_code,
            "error_message": self.error_message,
            "metadata": dict(self.metadata),
        }


def _content_for(value: Any) -> str | None:
    if value is None:
        return None
    if isinstance(value, str):
        return value
    return json.dumps(value, sort_keys=True)
