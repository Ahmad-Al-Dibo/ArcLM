"""
ArcLM Complete Project: Local Document Agent

What you'll learn
-----------------
- Build a document-reading agent with a sandboxed file tool
- Resolve paths safely under an assets root and redact secrets
- Verify the stored agent trace contains no raw secrets

When to use this
----------------
- A complete local agent project with security built into the tool layer

Requirements
------------
    pip install arclm

Run
---
    python examples/12_complete_projects/04_local_document_agent/main.py

Expected output
---------------
    "output": "Done. The tool result was processed safely."
    "tool_calls": 1, "trace_redacted": true

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


# --- 2. Sandboxed document-reading tool ---
@tool
def read_safe_note(relative_path: str) -> str:
    """Read one approved local note and redact likely secrets."""
    root = Path(__file__).resolve().parents[2] / "assets" / "documents"
    path = resolve_under_root(root, relative_path)
    return redact_sensitive_text(path.read_text(encoding="utf-8")[:1000])


def print_json(value) -> None:
    print(json.dumps(value, indent=2, sort_keys=True, default=str))


# --- 3. Run the agent and check the trace ---
def main() -> None:
    agent = Agent(name="local_document_agent", instructions="Read approved documents.", model=OneToolThenDoneModel("read_safe_note", {"relative_path": "local_note.md"}), tools=[read_safe_note])
    result = AgentRunner(max_steps=2).run(agent, "Summarize the local note.")
    print_json({"output": result.output, "tool_calls": len(result.session.tool_calls), "trace_redacted": "demo-secret" not in result.session.to_json()})


if __name__ == "__main__":
    main()
