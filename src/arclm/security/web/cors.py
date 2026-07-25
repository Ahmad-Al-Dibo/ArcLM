"""CORS security helpers."""

from __future__ import annotations

from arclm.security.errors import SecurityPolicyError


def validate_cors_policy(*, allowed_origins: tuple[str, ...], allow_credentials: bool) -> None:
    """Validate CORS settings."""

    if not allowed_origins:
        raise SecurityPolicyError("allowed origins must not be empty")
    if "*" in allowed_origins and allow_credentials:
        raise SecurityPolicyError("wildcard CORS is not allowed with credentials")
    for origin in allowed_origins:
        if origin != "*" and not origin.startswith(("http://", "https://")):
            raise SecurityPolicyError("allowed origins must be absolute HTTP origins")
