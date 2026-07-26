"""Capability reporting for ArcLM Agent Runtime."""

from __future__ import annotations

from dataclasses import dataclass
from enum import Enum


class CapabilityStatus(str, Enum):
    """Agent capability status."""

    NATIVE = "native"
    AVAILABLE = "available"
    OPTIONAL = "optional"
    EXPERIMENTAL = "experimental"
    UNSUPPORTED = "unsupported"
    DEPENDENCY_MISSING = "dependency_missing"


@dataclass(frozen=True)
class AgentCapabilityReport:
    """Honest runtime capability report."""

    supports_tools: CapabilityStatus = CapabilityStatus.AVAILABLE
    supports_parallel_tool_calls: CapabilityStatus = CapabilityStatus.AVAILABLE
    supports_structured_output: CapabilityStatus = CapabilityStatus.EXPERIMENTAL
    supports_sessions: CapabilityStatus = CapabilityStatus.AVAILABLE
    supports_async: CapabilityStatus = CapabilityStatus.AVAILABLE
    supports_approvals: CapabilityStatus = CapabilityStatus.AVAILABLE
    supports_tracing: CapabilityStatus = CapabilityStatus.AVAILABLE
    supports_resources: CapabilityStatus = CapabilityStatus.EXPERIMENTAL
    supports_speech_to_text: CapabilityStatus = CapabilityStatus.OPTIONAL
    supports_web_reading: CapabilityStatus = CapabilityStatus.AVAILABLE

    def to_dict(self) -> dict[str, str]:
        """Return a JSON-safe dictionary."""

        return {name: getattr(self, name).value for name in self.__dataclass_fields__}


def get_agent_capabilities() -> AgentCapabilityReport:
    """Return the base Agent Runtime capability report."""

    return AgentCapabilityReport()
