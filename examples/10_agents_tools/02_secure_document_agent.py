"""
ArcLM Example: Secure Document Agent

What you'll learn
-----------------
- Constrain file access with resolve_under_root path checks
- Redact secrets from tool output before it reaches the trace
- Cap agent runs with AgentRunner max_steps

When to use this
----------------
- Giving agents read access to local files when inputs must be sandboxed

Requirements
------------
    pip install arclm

Run
---
    python examples/10_agents_tools/02_secure_document_agent.py

Expected output
---------------
    "output": "Done. The tool result was processed safely."
    "redacted": true, "tool_calls": 1

Runtime
-------
    Under 5 seconds on CPU.
"""

from __future__ import annotations

import json
from pathlib import Path

from arclm.agents import Agent, AgentRunner, ModelResponse, ToolCall, tool
from arclm.security.paths import resolve_under_root
from arclm.security.redaction import redact_sensitive_text


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


# --- 2. Asset helpers ---
def asset_path(*parts: str) -> Path:
    return Path(__file__).resolve().parents[1] / "assets" / Path(*parts)


def print_json(value) -> None:
    print(json.dumps(value, indent=2, sort_keys=True, default=str))


# --- 3. Sandboxed note-reading tool ---
@tool
def read_safe_note(relative_path: str) -> str:
    """Read one allowed local note and redact likely secrets."""
    root = asset_path("documents")
    path = resolve_under_root(root, relative_path)
    text = path.read_text(encoding="utf-8")[:1000]
    return redact_sensitive_text(text)


# --- 4. Run the agent and inspect the trace ---
def main() -> None:
    agent = Agent(name="document_agent", instructions="Read only approved documents.", model=OneToolThenDoneModel("read_safe_note", {"relative_path": "local_note.md"}), tools=[read_safe_note])
    result = AgentRunner(max_steps=2).run(agent, "Summarize the note.")
    trace = result.session.to_json()
    print_json({"output": result.output, "redacted": "demo-secret" not in trace, "tool_calls": len(result.session.tool_calls)})


if __name__ == "__main__":
    main()
