"""Argon2id and HKDF key derivation."""

from __future__ import annotations

import os
from dataclasses import dataclass

from arclm.security.configuration import PasswordKDFConfig
from arclm.security.errors import SecurityDependencyError, require_cryptography


@dataclass(frozen=True)
class DerivedKey:
    """Derived key plus non-secret derivation metadata."""

    key: bytes
    salt: bytes
    config: PasswordKDFConfig

    def metadata(self) -> dict[str, object]:
        return {
            **self.config.to_dict(),
            "salt": _b64(self.salt),
        }


def derive_key_argon2id(
    password: str | bytes,
    *,
    salt: bytes | None = None,
    config: PasswordKDFConfig | None = None,
) -> DerivedKey:
    """Derive a key-encryption key from a password using Argon2id."""

    require_cryptography()
    config = config or PasswordKDFConfig()
    salt = salt or os.urandom(config.salt_length)
    try:
        from cryptography.hazmat.primitives.kdf.argon2 import Argon2id
    except ImportError as exc:
        raise SecurityDependencyError("installed cryptography does not provide Argon2id") from exc
    password_bytes = password.encode("utf-8") if isinstance(password, str) else bytes(password)
    kdf = Argon2id(
        salt=salt,
        length=config.output_length,
        iterations=config.iterations,
        lanes=config.lanes,
        memory_cost=config.memory_cost_kib,
    )
    return DerivedKey(key=kdf.derive(password_bytes), salt=salt, config=config)


def derive_subkey_hkdf(master_key: bytes, *, purpose: str, context: bytes = b"", length: int = 32) -> bytes:
    """Derive a purpose-bound subkey from high-entropy key material."""

    require_cryptography()
    if len(master_key) < 32:
        raise ValueError("HKDF source key material must be at least 32 bytes")
    if not purpose:
        raise ValueError("HKDF purpose must be non-empty")
    from cryptography.hazmat.primitives import hashes
    from cryptography.hazmat.primitives.kdf.hkdf import HKDF

    hkdf = HKDF(
        algorithm=hashes.SHA256(),
        length=length,
        salt=None,
        info=b"arclm-security:" + purpose.encode("utf-8") + b":" + context,
    )
    return hkdf.derive(master_key)


def _b64(value: bytes) -> str:
    import base64

    return base64.urlsafe_b64encode(value).decode("ascii")
