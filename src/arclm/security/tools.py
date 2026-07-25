"""Defensive Agent Runtime security tools."""

from __future__ import annotations

from .hashing import hash_bytes
from .redaction import redact_sensitive_text


def create_security_tool_collection():
    """Create read-only/pure defensive security tools for agents."""

    from arclm.agents import ToolCollection, tool

    @tool(name="redact_sensitive_text", category="security")
    def redact_tool(text: str) -> str:
        """Redact likely secrets from text."""

        return redact_sensitive_text(text)

    @tool(name="hash_text", category="security")
    def hash_text_tool(text: str, algorithm: str = "sha256") -> str:
        """Hash text with an allowlisted digest."""

        return hash_bytes(text.encode("utf-8"), algorithm=algorithm)

    return ToolCollection(
        name="security",
        description="Defensive pure security helpers.",
        tools=[redact_tool, hash_text_tool],
        categories=("security",),
    )
