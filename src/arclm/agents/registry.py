"""Tool registry and reusable tool collections."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Iterable

from arclm.registry import Registry

from .capabilities import AgentCapabilityReport, get_agent_capabilities
from .permissions import ToolPermission
from .tool import Tool


class ToolRegistry:
    """Deterministic registry for agent tools."""

    def __init__(self) -> None:
        self._registry = Registry("agent tool")

    def register_tool(self, item: Tool, *, replace: bool = False) -> Tool:
        """Register a tool by canonical name."""

        if replace and self.has_tool(item.name):
            self.unregister_tool(item.name)
        self._registry.register(item.name, item)
        return item

    def unregister_tool(self, name: str) -> None:
        """Remove a registered tool."""

        key = name.lower().strip()
        items = dict(self._registry.items())
        if key not in items:
            raise KeyError(f"Unknown agent tool {name!r}.")
        self._registry = Registry("agent tool")
        for item_name, item in items.items():
            if item_name != key:
                self._registry.register(item_name, item)

    def get_tool(self, name: str) -> Tool:
        """Return a tool by name."""

        return self._registry.get(name)

    def has_tool(self, name: str) -> bool:
        """Return whether a tool is registered."""

        return name.lower().strip() in self._registry.items()

    def list_tools(
        self,
        *,
        category: str | None = None,
        tags: Iterable[str] | None = None,
        enabled: bool | None = None,
    ) -> list[Tool]:
        """List tools in deterministic name order with optional filters."""

        tag_set = set(tags or [])
        tools = [item for _, item in sorted(self._registry.items().items())]
        if category is not None:
            tools = [item for item in tools if item.spec.category == category]
        if tag_set:
            tools = [item for item in tools if tag_set.issubset(set(item.spec.tags))]
        if enabled is not None:
            tools = [item for item in tools if item.enabled is enabled]
        return tools

    def create_tool_set(self, names: Iterable[str]) -> list[Tool]:
        """Return a deterministic list of tools by name."""

        return [self.get_tool(name) for name in sorted(names)]


@dataclass
class ToolCollection:
    """Reusable named group of tools."""

    name: str
    tools: list[Tool]
    description: str = ""
    categories: tuple[str, ...] = ()
    default_permissions: tuple[ToolPermission, ...] = (ToolPermission.PURE,)
    optional_dependencies: tuple[str, ...] = ()
    metadata: dict[str, str] = field(default_factory=dict)

    def capability_report(self) -> AgentCapabilityReport:
        """Return collection capability status."""

        return get_agent_capabilities()

    def to_registry(self) -> ToolRegistry:
        """Create a registry containing this collection's tools."""

        registry = ToolRegistry()
        for item in self.tools:
            registry.register_tool(item)
        return registry

    def to_dict(self) -> dict[str, object]:
        """Return a JSON-safe description."""

        return {
            "name": self.name,
            "description": self.description,
            "tools": [tool.name for tool in self.tools],
            "categories": list(self.categories),
            "default_permissions": [permission.value for permission in self.default_permissions],
            "optional_dependencies": list(self.optional_dependencies),
            "metadata": dict(self.metadata),
        }
