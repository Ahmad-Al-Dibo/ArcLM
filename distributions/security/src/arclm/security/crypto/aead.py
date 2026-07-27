"""AEAD encryption helpers using reviewed cryptography primitives."""

from __future__ import annotations

import json
import os
from typing import Any

from arclm.security.configuration import SecurityPolicy
from arclm.security.errors import DecryptionError, EncryptionError, require_cryptography
from arclm.security.secrets import SecretValue

from .formats import EncryptedEnvelope, canonical_associated_data


def encrypt_bytes(
    data: bytes,
    key: bytes | SecretValue,
    *,
    key_id: str = "direct",
    algorithm: str = "AES-256-GCM",
    associated_data: dict[str, Any] | None = None,
    metadata: dict[str, Any] | None = None,
    policy: SecurityPolicy | None = None,
) -> EncryptedEnvelope:
    """Encrypt bytes with AEAD and return a versioned envelope."""

    require_cryptography()
    policy = policy or SecurityPolicy()
    if algorithm not in policy.allowed_encryption_algorithms:
        raise EncryptionError("encryption algorithm is not allowed")
    if len(data) > policy.max_encryption_bytes:
        raise EncryptionError("input is too large for the small AEAD backend")
    key_bytes = _key_bytes(key)
    nonce = os.urandom(12)
    aad = dict(associated_data or {})
    aad.setdefault("algorithm", algorithm)
    aad.setdefault("key_id", key_id)
    cipher = _cipher(algorithm, key_bytes)
    ciphertext = cipher.encrypt(nonce, data, canonical_associated_data(aad))
    return EncryptedEnvelope.create(
        algorithm=algorithm,
        key_id=key_id,
        nonce=nonce,
        associated_data=aad,
        ciphertext=ciphertext,
        metadata=metadata,
    )


def decrypt_bytes(envelope: EncryptedEnvelope | dict[str, Any] | str, key: bytes | SecretValue) -> bytes:
    """Decrypt an AEAD envelope or raise without returning partial plaintext."""

    require_cryptography()
    parsed = _parse_envelope(envelope)
    key_bytes = _key_bytes(key)
    cipher = _cipher(parsed.algorithm, key_bytes)
    try:
        return cipher.decrypt(
            parsed.nonce_bytes(),
            parsed.ciphertext_bytes(),
            canonical_associated_data(parsed.associated_data),
        )
    except Exception as exc:
        raise DecryptionError("decryption failed or authentication tag is invalid") from exc


def encrypt_json(value: Any, key: bytes | SecretValue, **kwargs: Any) -> EncryptedEnvelope:
    """Encrypt JSON-safe data."""

    data = json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode("utf-8")
    return encrypt_bytes(data, key, **kwargs)


def decrypt_json(envelope: EncryptedEnvelope | dict[str, Any] | str, key: bytes | SecretValue) -> Any:
    """Decrypt JSON-safe data."""

    data = decrypt_bytes(envelope, key)
    try:
        return json.loads(data.decode("utf-8"))
    except Exception as exc:
        raise DecryptionError("decrypted payload is not valid JSON") from exc


def _cipher(algorithm: str, key: bytes):
    if len(key) != 32:
        raise EncryptionError("AEAD keys must be 32 bytes")
    if algorithm == "AES-256-GCM":
        from cryptography.hazmat.primitives.ciphers.aead import AESGCM

        return AESGCM(key)
    if algorithm == "ChaCha20-Poly1305":
        from cryptography.hazmat.primitives.ciphers.aead import ChaCha20Poly1305

        return ChaCha20Poly1305(key)
    raise EncryptionError("encryption algorithm is not supported")


def _key_bytes(key: bytes | SecretValue) -> bytes:
    return key.reveal() if isinstance(key, SecretValue) else bytes(key)


def _parse_envelope(envelope: EncryptedEnvelope | dict[str, Any] | str) -> EncryptedEnvelope:
    if isinstance(envelope, EncryptedEnvelope):
        envelope.validate()
        return envelope
    if isinstance(envelope, str):
        return EncryptedEnvelope.from_json(envelope)
    if isinstance(envelope, dict):
        return EncryptedEnvelope.from_dict(envelope)
    raise DecryptionError("encrypted envelope type is unsupported")
