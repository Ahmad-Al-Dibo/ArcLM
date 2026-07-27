"""Provider-independent key management contracts."""

from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum
from typing import Protocol


class KeyLifecycleState(str, Enum):
    """Key lifecycle states."""

    ACTIVE = "active"
    DECRYPT_ONLY = "decrypt_only"
    ROTATING = "rotating"
    DISABLED = "disabled"
    DESTROYED = "destroyed"


@dataclass(frozen=True)
class KeyReference:
    """Non-secret key metadata."""

    key_id: str
    state: KeyLifecycleState
    algorithm: str = "AES-256-GCM"
    metadata: dict[str, str] = field(default_factory=dict)

    def to_dict(self) -> dict[str, object]:
        return {
            "key_id": self.key_id,
            "state": self.state.value,
            "algorithm": self.algorithm,
            "metadata": dict(self.metadata),
        }


@dataclass(frozen=True)
class SecretKeyMaterial:
    """Secret key bytes with redacted repr."""

    key_id: str
    key: bytes

    def __post_init__(self) -> None:
        if len(self.key) != 32:
            raise ValueError("secret key material must be 32 bytes")

    def __repr__(self) -> str:
        return f"SecretKeyMaterial(key_id={self.key_id!r}, key=[REDACTED])"


class KeyProvider(Protocol):
    """Key provider protocol."""

    def create_key(self, *, key_id: str | None = None, activate: bool = True) -> KeyReference:
        """Create a key."""

    def get_key(self, key_id: str) -> SecretKeyMaterial:
        """Return secret key material for permitted use."""

    def active_key(self) -> KeyReference:
        """Return the current encryption key."""

    def wrap_key(self, key: bytes, *, key_id: str | None = None) -> tuple[KeyReference, bytes]:
        """Wrap a data encryption key."""

    def unwrap_key(self, wrapped: bytes, key_id: str) -> bytes:
        """Unwrap a data encryption key."""

    def rotate_key(self) -> KeyReference:
        """Rotate active key."""

    def disable_key(self, key_id: str) -> None:
        """Disable a key."""
