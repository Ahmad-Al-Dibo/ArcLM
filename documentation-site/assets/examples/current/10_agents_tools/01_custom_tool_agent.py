"""
ArcLM Example: Custom Tool Agent

This example verifies a deterministic tool loop with a fake Agent model.
"""

from __future__ import annotations

import json

from arclm.agents import Agent, AgentRunner, ModelResponse, ToolCall, tool


class OneToolThenDoneModel:
    def __init__(self, tool_name: str, arguments: dict):
        self.tool_name = tool_name
        self.arguments = dict(arguments)
        self.calls = 0

    def generate_response(self, *, messages, tools, instructions, session):
        self.calls += 1
        if self.calls == 1:
            return ModelResponse(tool_calls=[ToolCall(id="call_1", name=self.tool_name, arguments=self.arguments)])
        return ModelResponse(content="Done. The tool result was processed safely.")


def print_json(value) -> None:
    print(json.dumps(value, indent=2, sort_keys=True, default=str))


@tool
def add_numbers(a: int, b: int) -> int:
    """Add two integers."""
    return a + b


def main() -> None:
    agent = Agent(name="calculator", instructions="Use tools when useful.", model=OneToolThenDoneModel("add_numbers", {"a": 2, "b": 5}), tools=[add_numbers])
    result = AgentRunner(max_steps=2).run(agent, "Add 2 and 5.")
    print_json({"output": result.output, "tool_calls": [call.name for call in result.session.tool_calls]})


if __name__ == "__main__":
    main()

