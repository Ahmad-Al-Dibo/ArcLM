"""Provider-independent agent messages and model responses."""

from __future__ import annotations

import json
from dataclasses import asdict, dataclass, field
from typing import Any, Literal

from .results import ensure_json_safe


AgentRole = Literal["system", "user", "assistant", "tool"]


@dataclass(frozen=True)
class AgentMessage:
    """Serializable provider-independent message."""

    role: AgentRole
    content: str | None
    name: str | None = None
    tool_call_id: str | None = None
    metadata: dict[str, Any] = field(default_factory=dict)

    def __post_init__(self) -> None:
        ensure_json_safe(self.metadata)

    def to_dict(self) -> dict[str, Any]:
        """Return a JSON-safe dictionary."""

        return asdict(self)


@dataclass(frozen=True)
class ToolCall:
    """Provider-independent request to invoke a tool."""

    id: str
    name: str
    arguments: dict[str, Any]

    def __post_init__(self) -> None:
        ensure_json_safe(self.arguments)

    def to_dict(self) -> dict[str, Any]:
        """Return a JSON-safe dictionary."""

        return asdict(self)


@dataclass(frozen=True)
class ModelResponse:
    """Response returned by an agent model adapter."""

    content: str | None = None
    tool_calls: list[ToolCall] = field(default_factory=list)
    error_code: str | None = None
    error_message: str | None = None
    metadata: dict[str, Any] = field(default_factory=dict)

    def __post_init__(self) -> None:
        object.__setattr__(self, "tool_calls", [call if isinstance(call, ToolCall) else ToolCall(**call) for call in self.tool_calls])
        ensure_json_safe(self.metadata)

    @property
    def is_final(self) -> bool:
        """Return whether this is a final assistant response."""

        return self.content is not None and not self.tool_calls and not self.error_code

    def to_dict(self) -> dict[str, Any]:
        """Return a JSON-safe dictionary."""

        return {
            "content": self.content,
            "tool_calls": [call.to_dict() for call in self.tool_calls],
            "error_code": self.error_code,
            "error_message": self.error_message,
            "metadata": dict(self.metadata),
        }


FinalResponse = ModelResponse


def tool_result_message(tool_call_id: str, tool_name: str, result: Any) -> AgentMessage:
    """Create a provider-independent tool result message."""

    payload = result.to_dict() if hasattr(result, "to_dict") else result
    return AgentMessage(
        role="tool",
        content=json.dumps(payload, sort_keys=True),
        name=tool_name,
        tool_call_id=tool_call_id,
    )
