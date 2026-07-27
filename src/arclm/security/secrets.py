"""Secret containers and development secret providers."""

from __future__ import annotations

import os
from dataclasses import dataclass

from .errors import KeyManagementError


@dataclass(frozen=True)
class SecretValue:
    """Secret bytes that never reveal their value in repr."""

    value: bytes

    def __post_init__(self) -> None:
        if not isinstance(self.value, bytes) or not self.value:
            raise ValueError("secret value must be non-empty bytes")

    def reveal(self) -> bytes:
        return bytes(self.value)

    def __repr__(self) -> str:
        return "SecretValue([REDACTED])"


class EnvironmentSecretProvider:
    """Development-only environment secret provider."""

    def get_secret(self, name: str) -> SecretValue:
        if not name.startswith("ARCLM_DEV_"):
            raise KeyManagementError("environment secret provider only reads ARCLM_DEV_* names")
        value = os.getenv(name)
        if value is None:
            raise KeyManagementError("requested environment secret is missing")
        return SecretValue(value.encode("utf-8"))
