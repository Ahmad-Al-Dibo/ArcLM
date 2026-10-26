"""Tests for the ArcLM MCP stdio server adapter."""

import json

from arclm.agents import create_mcp_server, tool


@tool(category="utilities")
def multiply(left: float, right: float) -> float:
    """Multiply two numbers."""
    return left * right


def _req(id_, method, params=None):
    return {"jsonrpc": "2.0", "id": id_, "method": method, "params": params or {}}


def test_mcp_initialize_and_list():
    srv = create_mcp_server([multiply])
    init = srv.handle(_req(1, "initialize"))
    assert init["result"]["serverInfo"]["name"] == "arclm"
    assert "protocolVersion" in init["result"]

    listed = srv.handle(_req(2, "tools/list"))
    tools = listed["result"]["tools"]
    assert [t["name"] for t in tools] == ["multiply"]
    assert tools[0]["inputSchema"]["type"] == "object"
    assert "Multiply" in tools[0]["description"] or "multiply" in tools[0]["description"]


def test_mcp_tools_call():
    srv = create_mcp_server([multiply])
    resp = srv.handle(
        _req(3, "tools/call", {"name": "multiply", "arguments": {"left": 3, "right": 4}})
    )
    assert resp["result"]["isError"] is False
    assert resp["result"]["content"][0]["type"] == "text"
    assert float(resp["result"]["content"][0]["text"]) == 12.0


def test_mcp_unknown_tool_and_method():
    srv = create_mcp_server([multiply])
    unknown = srv.handle(_req(1, "tools/call", {"name": "nope"}))
    assert "error" in unknown
    bad_method = srv.handle(_req(2, "resources/list"))
    assert bad_method["error"]["code"] == -32601


def test_mcp_stdio_roundtrip():
    import io

    srv = create_mcp_server([multiply])
    lines = [
        json.dumps(_req(1, "initialize")),
        json.dumps(_req(2, "tools/call", {"name": "multiply", "arguments": {"left": 2, "right": 5}})),
    ]
    stdin = io.StringIO("\n".join(lines) + "\n")
    stdout = io.StringIO()
    srv.serve(stdin=stdin, stdout=stdout)
    out_lines = [json.loads(x) for x in stdout.getvalue().splitlines() if x.strip()]
    assert len(out_lines) == 2
    assert out_lines[1]["result"]["content"][0]["text"] == "10.0"
