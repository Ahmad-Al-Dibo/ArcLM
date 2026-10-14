"""Stable errors and error codes for ArcLM Agent Runtime."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from arclm.exceptions import ArcLMError


class AgentRuntimeError(ArcLMError):
    """Base error for the ArcLM Agent Runtime."""

    code = "agent_runtime_error"


class ToolError(AgentRuntimeError):
    """Raised when a tool cannot be built, validated, or executed."""

    code = "tool_execution_failed"


class ToolSchemaError(ToolError):
    """Raised when a callable cannot be represented as a safe tool schema."""

    code = "tool_schema_invalid"


class ToolValidationError(ToolError):
    """Raised when model-provided tool arguments fail validation."""

    code = "tool_invalid_arguments"


class ApprovalError(AgentRuntimeError):
    """Raised when approval is required or denied."""

    code = "tool_approval_denied"


class ModelResponseError(AgentRuntimeError):
    """Raised when a model adapter returns an invalid response."""

    code = "agent_invalid_model_response"


class OptionalAgentDependencyError(AgentRuntimeError):
    """Raised when an optional agent integration dependency is unavailable."""

    code = "tool_dependency_missing"


ERROR_CODES = {
    "agent_max_steps_reached",
    "agent_cancelled",
    "agent_model_failed",
    "agent_invalid_model_response",
    "agent_session_invalid",
    "tool_not_found",
    "tool_disabled",
    "tool_not_allowed",
    "tool_approval_required",
    "tool_approval_denied",
    "tool_invalid_arguments",
    "tool_timeout",
    "tool_cancelled",
    "tool_execution_failed",
    "tool_result_too_large",
    "tool_dependency_missing",
    "web_url_invalid",
    "web_scheme_unsupported",
    "web_private_address_blocked",
    "web_response_too_large",
    "web_content_type_unsupported",
    "web_request_failed",
    "document_format_unsupported",
    "document_input_too_large",
    "document_parse_failed",
    "audio_backend_unavailable",
    "audio_format_unsupported",
    "audio_input_too_large",
    "audio_transcription_failed",
}


@dataclass(frozen=True)
class AgentErrorInfo:
    """JSON-safe error payload returned by runtime operations."""

    code: str
    message: str
    metadata: dict[str, Any] | None = None

    def to_dict(self) -> dict[str, Any]:
        """Return a JSON-safe dictionary."""

        return {
            "code": self.code,
            "message": self.message,
            "metadata": dict(self.metadata or {}),
        }
