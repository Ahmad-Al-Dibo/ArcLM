"""Versioned encryption envelope formats."""

from __future__ import annotations

import base64
import json
from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
from typing import Any

from arclm.security.errors import DecryptionError


ENVELOPE_FORMAT = "arclm-encrypted-artifact"
ENVELOPE_VERSION = 1
ALLOWED_ALGORITHMS = {"AES-256-GCM", "ChaCha20-Poly1305"}


@dataclass(frozen=True)
class EncryptedEnvelope:
    """JSON-safe authenticated encryption envelope."""

    format: str
    version: int
    algorithm: str
    key_id: str
    nonce: str
    associated_data: dict[str, Any]
    ciphertext: str
    created_at: str
    metadata: dict[str, Any] = field(default_factory=dict)
    encrypted_data_key: str | None = None
    key_encryption_key_id: str | None = None
    password_kdf: dict[str, Any] | None = None

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)

    def to_json(self, **kwargs: Any) -> str:
        return json.dumps(self.to_dict(), sort_keys=True, **kwargs)

    @classmethod
    def create(
        cls,
        *,
        algorithm: str,
        key_id: str,
        nonce: bytes,
        associated_data: dict[str, Any],
        ciphertext: bytes,
        metadata: dict[str, Any] | None = None,
        encrypted_data_key: bytes | None = None,
        key_encryption_key_id: str | None = None,
        password_kdf: dict[str, Any] | None = None,
    ) -> "EncryptedEnvelope":
        if algorithm not in ALLOWED_ALGORITHMS:
            raise DecryptionError("encryption algorithm is not supported")
        return cls(
            format=ENVELOPE_FORMAT,
            version=ENVELOPE_VERSION,
            algorithm=algorithm,
            key_id=key_id,
            nonce=_b64(nonce),
            associated_data=dict(associated_data),
            ciphertext=_b64(ciphertext),
            created_at=datetime.now(timezone.utc).isoformat(),
            metadata=dict(metadata or {}),
            encrypted_data_key=_b64(encrypted_data_key) if encrypted_data_key is not None else None,
            key_encryption_key_id=key_encryption_key_id,
            password_kdf=dict(password_kdf) if password_kdf is not None else None,
        )

    @classmethod
    def from_dict(cls, values: dict[str, Any]) -> "EncryptedEnvelope":
        allowed = {
            "format",
            "version",
            "algorithm",
            "key_id",
            "nonce",
            "associated_data",
            "ciphertext",
            "created_at",
            "metadata",
            "encrypted_data_key",
            "key_encryption_key_id",
            "password_kdf",
        }
        unknown = set(values) - allowed
        if unknown:
            raise DecryptionError("encrypted envelope contains unsupported fields")
        envelope = cls(**values)
        envelope.validate()
        return envelope

    @classmethod
    def from_json(cls, payload: str) -> "EncryptedEnvelope":
        try:
            values = json.loads(payload)
        except json.JSONDecodeError as exc:
            raise DecryptionError("encrypted envelope is not valid JSON") from exc
        if not isinstance(values, dict):
            raise DecryptionError("encrypted envelope must be a JSON object")
        return cls.from_dict(values)

    def validate(self) -> None:
        if self.format != ENVELOPE_FORMAT:
            raise DecryptionError("encrypted envelope format is unsupported")
        if self.version != ENVELOPE_VERSION:
            raise DecryptionError("encrypted envelope version is unsupported")
        if self.algorithm not in ALLOWED_ALGORITHMS:
            raise DecryptionError("encryption algorithm is not supported")
        if not isinstance(self.key_id, str) or not self.key_id:
            raise DecryptionError("encrypted envelope key_id is invalid")
        if not isinstance(self.associated_data, dict):
            raise DecryptionError("associated_data must be an object")
        if not isinstance(self.metadata, dict):
            raise DecryptionError("metadata must be an object")
        self.nonce_bytes()
        self.ciphertext_bytes()

    def nonce_bytes(self) -> bytes:
        nonce = _unb64(self.nonce, "nonce")
        if len(nonce) != 12:
            raise DecryptionError("nonce length is invalid")
        return nonce

    def ciphertext_bytes(self) -> bytes:
        ciphertext = _unb64(self.ciphertext, "ciphertext")
        if len(ciphertext) < 16:
            raise DecryptionError("ciphertext is missing an authentication tag")
        return ciphertext

    def encrypted_data_key_bytes(self) -> bytes | None:
        if self.encrypted_data_key is None:
            return None
        return _unb64(self.encrypted_data_key, "encrypted_data_key")


def canonical_associated_data(values: dict[str, Any]) -> bytes:
    """Return deterministic associated-data bytes."""

    return json.dumps(values, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode("utf-8")


def _b64(value: bytes) -> str:
    return base64.urlsafe_b64encode(value).decode("ascii")


def _unb64(value: str, field: str) -> bytes:
    if not isinstance(value, str):
        raise DecryptionError(f"{field} must be base64 text")
    try:
        return base64.urlsafe_b64decode(value.encode("ascii"))
    except Exception as exc:
        raise DecryptionError(f"{field} is not valid base64") from exc
