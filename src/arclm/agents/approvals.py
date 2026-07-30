"""Human approval interfaces for agent tool execution."""

from __future__ import annotations

from dataclasses import dataclass
from enum import Enum
from typing import Any, Protocol


class ApprovalDecision(str, Enum):
    """Decision returned by an approval handler."""

    APPROVE_ONCE = "approve_once"
    APPROVE_SESSION = "approve_session"
    DENY = "deny"


@dataclass(frozen=True)
class ToolApprovalRequest:
    """Safe approval request metadata."""

    tool_name: str
    permission: str
    arguments: dict[str, Any]
    session_id: str
    reason: str | None = None


class ToolApprovalHandler(Protocol):
    """Protocol for human or application approval handlers."""
    # This is a typing Protocol: no implementation is provided here on purpose.
    # Concrete handlers should implement this coroutine.
    async def request_approval(self, request: ToolApprovalRequest) -> ApprovalDecision:
        """Return an approval decision for a tool request.

        Implementations should provide the actual approval logic. The body
        is intentionally left as an ellipsis to indicate an abstract contract.
        """

        


class DenyApprovalHandler:
    """Default handler that denies requests requiring approval."""

    async def request_approval(self, request: ToolApprovalRequest) -> ApprovalDecision:
        return ApprovalDecision.DENY


class AutoApprovalHandler:
    """Simple handler for tests and trusted local demos."""

    async def request_approval(self, request: ToolApprovalRequest) -> ApprovalDecision:
        return ApprovalDecision.APPROVE_ONCE
