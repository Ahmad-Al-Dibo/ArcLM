"""Resource boundary prepared for future MCP-style context providers."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Protocol


@dataclass(frozen=True)
class AgentResource:
    """Read-only content that can be provided as agent context."""

    uri: str
    name: str
    content: str
    mime_type: str = "text/plain"
    metadata: dict[str, str] = field(default_factory=dict)

    def to_dict(self) -> dict[str, object]:
        return {
            "uri": self.uri,
            "name": self.name,
            "content": self.content,
            "mime_type": self.mime_type,
            "metadata": dict(self.metadata),
        }

    def to_mcp_resource(self) -> dict[str, object]:
        """Return a schema-ready MCP-like resource."""

        return {"uri": self.uri, "name": self.name, "mimeType": self.mime_type}


class ResourceProvider(Protocol):
    """Protocol for read-only resource providers."""

    def list_resources(self) -> list[AgentResource]:
        """List resources."""

    def read_resource(self, uri: str) -> AgentResource:
        """Read one resource."""


class InMemoryResourceProvider:
    """Minimal in-memory resource provider."""

    def __init__(self, resources: list[AgentResource] | None = None) -> None:
        self._resources = {resource.uri: resource for resource in resources or []}

    def list_resources(self) -> list[AgentResource]:
        return [self._resources[uri] for uri in sorted(self._resources)]

    def read_resource(self, uri: str) -> AgentResource:
        return self._resources[uri]

    def add_resource(self, resource: AgentResource) -> None:
        self._resources[resource.uri] = resource
