"""MCP (Model Context Protocol) stdio server for ArcLM tools.

Exposes :class:`arclm.agents.tool.Tool` instances as an MCP server over
JSON-RPC 2.0 on stdio, so external hosts (Claude Desktop, MCP clients) can
discover and call ArcLM tools.

Protocol subset implemented:
    - ``initialize`` → protocol version + server info
    - ``tools/list`` → tool schemas from ArcLM Tool definitions
    - ``tools/call`` → Tool.invoke with permission-aware execution
    - ``ping`` → empty result

No third-party MCP dependency is required. This is a minimal, local adapter.

Note:
    JSON-RPC messages are newline-delimited JSON on stdio (line-based
    framing). It follows the MCP shape closely enough for simple clients;
    it is not a full spec-certified SDK.
"""

from __future__ import annotations

import json
import sys
from typing import Any, Iterable, Sequence, TextIO

from ..errors import ToolError
from ..tool import Tool

MCP_PROTOCOL_VERSION = "2025-06-18"
SERVER_NAME = "arclm"


def _tool_to_mcp(tool: Tool) -> dict[str, Any]:
    """Convert an ArcLM Tool to an MCP tools/list entry."""
    schema = getattr(tool, "input_schema", None)
    if schema is None and hasattr(tool, "to_schema"):
        schema = tool.to_schema()
    if not isinstance(schema, dict):
        schema = {"type": "object", "properties": {}}
    description = getattr(tool, "description", "") or ""
    return {
        "name": getattr(tool, "name", "tool"),
        "description": description,
        "inputSchema": schema if schema.get("type") == "object" else {"type": "object", "properties": {}},
    }


def create_tool_map(tools: Iterable[Tool]) -> dict[str, Tool]:
    mapping: dict[str, Tool] = {}
    for t in tools:
        name = getattr(t, "name", None)
        if not name:
            raise ValueError("tool without a name cannot be exposed over MCP")
        mapping[name] = t
    return mapping


class MCPServer:
    """Line-oriented JSON-RPC server over an ArcLM tool collection."""

    def __init__(self, tools: Sequence[Tool], *, name: str = SERVER_NAME) -> None:
        self.name = name
        self.tools = create_tool_map(tools)

    def handle(self, message: dict[str, Any]) -> dict[str, Any]:
        """Handle one JSON-RPC request; return the response dict."""
        msg_id = message.get("id")
        method = message.get("method", "")
        try:
            if method == "initialize":
                result: dict[str, Any] = {
                    "protocolVersion": MCP_PROTOCOL_VERSION,
                    "capabilities": {"tools": {}},
                    "serverInfo": {"name": self.name, "version": "2.0.0"},
                }
            elif method == "ping":
                result = {}
            elif method == "tools/list":
                result = {"tools": [_tool_to_mcp(t) for t in self.tools.values()]}
            elif method == "tools/call":
                params = message.get("params") or {}
                tool_name = params.get("name")
                args = params.get("arguments") or {}
                if tool_name not in self.tools:
                    raise ToolError("mcp_unknown_tool", f"unknown tool: {tool_name!r}")
                tool = self.tools[tool_name]
                tool_result = tool.invoke(args, None)
                failed = getattr(tool_result, "success", True) is False
                if failed:
                    message_text = str(
                        getattr(tool_result, "error_message", None)
                        or getattr(tool_result, "error_code", None)
                        or "tool failed"
                    )
                else:
                    content = getattr(tool_result, "content", None)
                    value = getattr(tool_result, "value", None)
                    if content is not None:
                        message_text = str(content)
                    elif isinstance(value, str):
                        message_text = value
                    else:
                        message_text = json.dumps(value, default=str)
                result = {
                    "content": [{"type": "text", "text": message_text}],
                    "isError": failed,
                }
            else:
                return {
                    "jsonrpc": "2.0",
                    "id": msg_id,
                    "error": {"code": -32601, "message": f"method not found: {method}"},
                }
        except ToolError as exc:
            return {
                "jsonrpc": "2.0",
                "id": msg_id,
                "error": {"code": -32000, "message": str(exc)},
            }
        except Exception as exc:  # noqa: BLE001 — surface as JSON-RPC error
            return {
                "jsonrpc": "2.0",
                "id": msg_id,
                "error": {"code": -32603, "message": f"{type(exc).__name__}: {exc}"},
            }
        return {"jsonrpc": "2.0", "id": msg_id, "result": result}

    def serve(self, stdin: TextIO | None = None, stdout: TextIO | None = None) -> None:
        """Blocking stdio loop: read JSON lines, write JSON lines."""
        stdin = stdin or sys.stdin
        stdout = stdout or sys.stdout
        for line in stdin:
            line = line.strip()
            if not line:
                continue
            try:
                message = json.loads(line)
            except json.JSONDecodeError:
                resp = {
                    "jsonrpc": "2.0",
                    "id": None,
                    "error": {"code": -32700, "message": "parse error"},
                }
                stdout.write(json.dumps(resp) + "\n")
                stdout.flush()
                continue
            resp = self.handle(message)
            stdout.write(json.dumps(resp, default=str) + "\n")
            stdout.flush()


def create_mcp_server(tools: Sequence[Tool], *, name: str = SERVER_NAME) -> MCPServer:
    """Build an MCP server exposing *tools* over stdio JSON-RPC."""
    return MCPServer(tools, name=name)
