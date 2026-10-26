"""
ArcLM Example: Expose Tools via an MCP Server

What you'll learn
-----------------
- Wrap functions with @tool
- Start a JSON-RPC MCP server (stdio) for external hosts
- Handle initialize / tools/list / tools/call

When to use this
----------------
- Connecting ArcLM tools to MCP-compatible clients (Claude Desktop, etc.)

Requirements
------------
    pip install arclm

Run
---
    python examples/16_mcp_tools/01_mcp_server.py

Expected output
---------------
    JSON summary: initialize OK, tools/list shows add_numbers, call returns 5.0

Runtime
-------
    Under 5 seconds on CPU.
"""

from __future__ import annotations

import json

from arclm.agents import create_mcp_server, tool


@tool(category="utilities")
def add_numbers(left: float, right: float) -> float:
    """Add two numbers and return the sum."""
    return left + right


def main() -> None:
    server = create_mcp_server([add_numbers], name="arclm-example")

    init = server.handle({"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {}})
    listed = server.handle({"jsonrpc": "2.0", "id": 2, "method": "tools/list"})
    call = server.handle(
        {
            "jsonrpc": "2.0",
            "id": 3,
            "method": "tools/call",
            "params": {"name": "add_numbers", "arguments": {"left": 2, "right": 3}},
        }
    )
    unknown = server.handle(
        {"jsonrpc": "2.0", "id": 4, "method": "tools/call", "params": {"name": "nope"}}
    )

    tool_names = [t["name"] for t in listed["result"]["tools"]]
    answer = float(call["result"]["content"][0]["text"])
    assert answer == 5.0
    assert "error" in unknown

    print(
        json.dumps(
            {
                "server": init["result"]["serverInfo"],
                "tools": tool_names,
                "call_answer": answer,
                "unknown_tool_rejected": True,
                "note": "For a real client, run this as a long-lived stdio process: server.serve()",
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
