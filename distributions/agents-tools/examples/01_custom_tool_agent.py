"""
ArcLM Example: Custom Tool Agent

What you'll learn
-----------------
- Define a typed tool with the @tool decorator
- Drive a deterministic agent loop with a fake model backend
- Inspect the session tool-call trace after a run

When to use this
----------------
- Prototyping agent tool logic without calling a real LLM API

Requirements
------------
    pip install arclm

Run
---
    python examples/10_agents_tools/01_custom_tool_agent.py

Expected output
---------------
    "output": "Done. The tool result was processed safely."
    "tool_calls": ["add_numbers"]

Runtime
-------
    Under 5 seconds on CPU.
"""

from __future__ import annotations

import json

from arclm.agents import Agent, AgentRunner, ModelResponse, ToolCall, tool


# --- 1. Fake model: one tool call, then a final response ---
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


# --- 2. Pretty-print helper ---
def print_json(value) -> None:
    print(json.dumps(value, indent=2, sort_keys=True, default=str))


# --- 3. Custom tool ---
@tool
def add_numbers(a: int, b: int) -> int:
    """Add two integers."""
    return a + b


# --- 4. Build the agent and run the loop ---
def main() -> None:
    agent = Agent(name="calculator", instructions="Use tools when useful.", model=OneToolThenDoneModel("add_numbers", {"a": 2, "b": 5}), tools=[add_numbers])
    result = AgentRunner(max_steps=2).run(agent, "Add 2 and 5.")
    print_json({"output": result.output, "tool_calls": [call.name for call in result.session.tool_calls]})


if __name__ == "__main__":
    main()
