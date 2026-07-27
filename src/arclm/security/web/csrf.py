"""CSRF token helpers."""

from __future__ import annotations

import hmac
import secrets

from arclm.security.errors import SecurityPolicyError


class CsrfTokenManager:
    """In-memory CSRF token manager."""

    def __init__(self) -> None:
        self._tokens: set[str] = set()

    def create_token(self) -> str:
        token = secrets.token_urlsafe(32)
        self._tokens.add(token)
        return token

    def validate_token(self, token: str) -> None:
        if not any(hmac.compare_digest(token, known) for known in self._tokens):
            raise SecurityPolicyError("CSRF token is invalid")
