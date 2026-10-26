"""MCP adapter for ArcLM agents — expose tools over JSON-RPC stdio."""

from .server import (
    MCP_PROTOCOL_VERSION,
    MCPServer,
    create_mcp_server,
    create_tool_map,
)

__all__ = [
    "MCP_PROTOCOL_VERSION",
    "MCPServer",
    "create_mcp_server",
    "create_tool_map",
]
