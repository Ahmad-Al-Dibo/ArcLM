"""Permission and side-effect declarations for tools."""

from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum


class ToolPermission(str, Enum):
    """Permission categories a tool may request."""

    PURE = "pure"
    READ_LOCAL = "read_local"
    READ_NETWORK = "read_network"
    WRITE_LOCAL = "write_local"
    EXTERNAL_ACTION = "external_action"
    SENSITIVE = "sensitive"


class SideEffectLevel(str, Enum):
    """Declared side-effect level for a tool."""

    NONE = "none"
    READ_ONLY = "read_only"
    REVERSIBLE = "reversible"
    IRREVERSIBLE = "irreversible"


@dataclass(frozen=True)
class ToolPolicy:
    """Runtime policy controlling which tools may run."""

    allowed_tools: set[str] | None = None
    disabled_tools: set[str] = field(default_factory=set)
    require_approval_for: set[ToolPermission] = field(
        default_factory=lambda: {
            ToolPermission.READ_NETWORK,
            ToolPermission.WRITE_LOCAL,
            ToolPermission.EXTERNAL_ACTION,
            ToolPermission.SENSITIVE,
        }
    )
    stop_on_tool_failure: bool = True
    max_result_bytes: int = 65536
    max_argument_bytes: int = 32768
    max_json_depth: int = 20
    max_collection_length: int = 1000

    def allows(self, tool_name: str) -> bool:
        """Return whether a canonical tool name may be invoked."""

        name = tool_name.lower().strip()
        if name in {item.lower().strip() for item in self.disabled_tools}:
            return False
        if self.allowed_tools is None:
            return True
        return name in {item.lower().strip() for item in self.allowed_tools}

    def requires_approval(self, permission: ToolPermission | str) -> bool:
        """Return whether a permission needs human approval."""

        permission_value = ToolPermission(permission)
        return permission_value in self.require_approval_for
