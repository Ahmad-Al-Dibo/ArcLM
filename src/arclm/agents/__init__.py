"""ArcLM Agent Runtime.

Foundational provider-independent tool and agent infrastructure for ArcLM.
"""

from __future__ import annotations

from .agent import Agent
from .approvals import ApprovalDecision, AutoApprovalHandler, DenyApprovalHandler, ToolApprovalHandler, ToolApprovalRequest
from .capabilities import AgentCapabilityReport, CapabilityStatus, get_agent_capabilities
from .configuration import AgentConfig, AgentRunnerConfig, DocumentToolConfig, SessionConfig, TraceConfig, WebToolConfig
from .context import ToolContext
from .errors import AgentRuntimeError, OptionalAgentDependencyError, ToolError, ToolSchemaError, ToolValidationError
from .messages import AgentMessage, FinalResponse, ModelResponse, ToolCall
from .model import AgentModel, ArcLMJSONToolAdapter, CallableModelAdapter, JSONToolCallingAdapter
from .permissions import SideEffectLevel, ToolPermission, ToolPolicy
from .registry import ToolCollection, ToolRegistry
from .resources import AgentResource, InMemoryResourceProvider, ResourceProvider
from .results import AgentRunResult, ToolResult
from .runner import AgentRunner
from .session import AgentSession
from .stt import FakeSpeechToTextBackend, SpeechToTextBackend, TranscriptionRequest, TranscriptionResult
from .tool import Tool, ToolSpec, tool
from .tracing import AgentTrace, AgentTraceEvent
from .mcp import MCPServer, create_mcp_server

__all__ = [
    "Agent",
    "AgentRunner",
    "AgentRunResult",
    "AgentSession",
    "AgentMessage",
    "AgentModel",
    "AgentResource",
    "AgentRuntimeError",
    "AgentTrace",
    "AgentTraceEvent",
    "AgentCapabilityReport",
    "ApprovalDecision",
    "ArcLMJSONToolAdapter",
    "AutoApprovalHandler",
    "CallableModelAdapter",
    "CapabilityStatus",
    "DenyApprovalHandler",
    "DocumentToolConfig",
    "FakeSpeechToTextBackend",
    "FinalResponse",
    "InMemoryResourceProvider",
    "JSONToolCallingAdapter",
    "MCPServer",
    "ModelResponse",
    "OptionalAgentDependencyError",
    "ResourceProvider",
    "SideEffectLevel",
    "SpeechToTextBackend",
    "Tool",
    "ToolCall",
    "ToolCollection",
    "ToolContext",
    "ToolError",
    "ToolPermission",
    "ToolPolicy",
    "ToolRegistry",
    "ToolResult",
    "ToolSpec",
    "ToolApprovalHandler",
    "ToolApprovalRequest",
    "ToolSchemaError",
    "ToolValidationError",
    "TranscriptionRequest",
    "TranscriptionResult",
    "TraceConfig",
    "WebToolConfig",
    "AgentConfig",
    "AgentRunnerConfig",
    "SessionConfig",
    "create_mcp_server",
    "get_agent_capabilities",
    "tool",
]
