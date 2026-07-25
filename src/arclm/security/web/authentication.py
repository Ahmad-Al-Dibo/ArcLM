"""Authentication and authorization boundary placeholders."""

from __future__ import annotations

from dataclasses import dataclass

from arclm.security.errors import SecurityPolicyError


@dataclass(frozen=True)
class AuthenticationBoundary:
    """Minimal authentication boundary for future Web Studio auth."""

    required: bool = False

    def authorize(self, *, authenticated: bool, action: str) -> None:
        if self.required and not authenticated:
            raise SecurityPolicyError(f"authorization denied for {action}")
