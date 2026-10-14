"""Serializable Agent Runtime configuration objects."""

from __future__ import annotations

from dataclasses import asdict, dataclass, field
from typing import Any


@dataclass(frozen=True)
class AgentConfig:
    """Serializable agent configuration without callables or secrets."""

    name: str
    description: str = ""
    instructions: str = ""
    max_steps: int = 8
    metadata: dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


@dataclass(frozen=True)
class AgentRunnerConfig:
    """Serializable runner configuration."""

    max_steps: int = 8
    timeout_seconds: float | None = None

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


@dataclass(frozen=True)
class SessionConfig:
    """Serializable session configuration."""

    max_messages: int = 100


@dataclass(frozen=True)
class TraceConfig:
    """Serializable trace configuration."""

    enabled: bool = True
    include_tool_content: bool = False


@dataclass(frozen=True)
class WebToolConfig:
    """Serializable web-tool limits."""

    max_response_bytes: int = 1_000_000
    timeout_seconds: float = 10.0
    max_redirects: int = 5


@dataclass(frozen=True)
class DocumentToolConfig:
    """Serializable document-tool limits."""

    max_input_bytes: int = 1_000_000
