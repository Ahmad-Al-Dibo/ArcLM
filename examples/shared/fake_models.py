"""Deterministic fake models for Agent examples."""

from __future__ import annotations

from arclm.agents import ModelResponse, ToolCall


class OneToolThenDoneModel:
    """Fake Agent model that calls one named tool, then returns a final answer."""

    def __init__(self, tool_name: str, arguments: dict):
        self.tool_name = tool_name
        self.arguments = dict(arguments)
        self.calls = 0

    def generate_response(self, *, messages, tools, instructions, session):
        self.calls += 1
        if self.calls == 1:
            return ModelResponse(tool_calls=[ToolCall(id="call_1", name=self.tool_name, arguments=self.arguments)])
        return ModelResponse(content="Done. The tool result was processed safely.")

