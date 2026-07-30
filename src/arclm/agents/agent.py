"""Agent configuration object."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

from .messages import ModelResponse, ToolCall

from .configuration import AgentConfig
from .permissions import ToolPolicy
from .tool import Tool
from arclm.security import SecurityPolicy


@dataclass
class Agent:
    """Behavior description for a bounded tool-using agent."""

    name: str
    instructions: str
    model: Any
    tools: list[Tool] = field(default_factory=list)
    description: str = ""
    max_steps: int = 8
    tool_policy: ToolPolicy = field(default_factory=ToolPolicy)
    approval_policy: dict[str, Any] = field(default_factory=dict)
    session_policy: dict[str, Any] = field(default_factory=dict)
    output_schema: dict[str, Any] | type | None = None
    security_policy: SecurityPolicy = field(default_factory=SecurityPolicy)
    metadata: dict[str, Any] = field(default_factory=dict)

    def config(self) -> AgentConfig:
        """Return serializable agent configuration without callables."""

        return AgentConfig(
            name=self.name,
            description=self.description,
            instructions=self.instructions,
            max_steps=self.max_steps,
            metadata=dict(self.metadata),
        )


class AgentBase(Agent):
    def __init__(self, tool_name: str, arguments: dict):
        self.tool_name = tool_name
        self.arguments = dict(arguments)
        self.calls = 0

    def generate_response(self, *, messages, tools, instructions, session):
        """Return a provider-independent model response."""
        self.calls += 1
        if self.calls == 1:
            return ModelResponse(tool_calls=[ToolCall(id="call_1", name=self.tool_name, arguments=self.arguments)])
        return ModelResponse(content="Done. The tool result was processed safely.")
