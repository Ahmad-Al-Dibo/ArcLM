"""Signed artifact manifest helpers."""

from __future__ import annotations

import base64
import json
from dataclasses import dataclass
from typing import Any

from .errors import SignatureError, require_cryptography


SIGNATURE_ALGORITHM = "Ed25519"


@dataclass(frozen=True)
class SigningKeyPair:
    """Ed25519 signing key pair encoded as raw bytes."""

    key_id: str
    private_key: bytes
    public_key: bytes

    def __repr__(self) -> str:
        return f"SigningKeyPair(key_id={self.key_id!r}, private_key=[REDACTED], public_key={self.public_key!r})"


def generate_signing_keypair(*, key_id: str = "signing_key_local") -> SigningKeyPair:
    """Generate a local Ed25519 signing key pair."""

    require_cryptography()
    from cryptography.hazmat.primitives import serialization
    from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey

    private = Ed25519PrivateKey.generate()
    public = private.public_key()
    return SigningKeyPair(
        key_id=key_id,
        private_key=private.private_bytes(
            encoding=serialization.Encoding.Raw,
            format=serialization.PrivateFormat.Raw,
            encryption_algorithm=serialization.NoEncryption(),
        ),
        public_key=public.public_bytes(
            encoding=serialization.Encoding.Raw,
            format=serialization.PublicFormat.Raw,
        ),
    )


def canonical_manifest_bytes(manifest: dict[str, Any]) -> bytes:
    """Return canonical manifest bytes excluding signature fields."""

    unsigned = {
        key: value
        for key, value in manifest.items()
        if key not in {"signature", "signature_algorithm", "signing_key_id"}
    }
    return json.dumps(unsigned, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode("utf-8")


def sign_manifest(manifest: dict[str, Any], private_key: bytes, *, key_id: str) -> dict[str, Any]:
    """Return a signed manifest copy."""

    require_cryptography()
    from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey

    try:
        signer = Ed25519PrivateKey.from_private_bytes(private_key)
        signature = signer.sign(canonical_manifest_bytes(manifest))
    except Exception as exc:
        raise SignatureError("manifest signing failed") from exc
    signed = dict(manifest)
    signed["signature_algorithm"] = SIGNATURE_ALGORITHM
    signed["signing_key_id"] = key_id
    signed["signature"] = base64.urlsafe_b64encode(signature).decode("ascii")
    return signed


def verify_manifest(manifest: dict[str, Any], public_key: bytes, *, expected_key_id: str | None = None) -> bool:
    """Verify a signed manifest."""

    require_cryptography()
    from cryptography.exceptions import InvalidSignature
    from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PublicKey

    if manifest.get("signature_algorithm") != SIGNATURE_ALGORITHM:
        raise SignatureError("manifest signature algorithm is unsupported")
    if expected_key_id is not None and manifest.get("signing_key_id") != expected_key_id:
        raise SignatureError("manifest signing key id does not match")
    signature_text = manifest.get("signature")
    if not isinstance(signature_text, str):
        raise SignatureError("manifest signature is missing")
    try:
        signature = base64.urlsafe_b64decode(signature_text.encode("ascii"))
        verifier = Ed25519PublicKey.from_public_bytes(public_key)
        verifier.verify(signature, canonical_manifest_bytes(manifest))
    except InvalidSignature as exc:
        raise SignatureError("manifest signature verification failed") from exc
    except Exception as exc:
        raise SignatureError("manifest signature is malformed") from exc
    return True


verify_manifest_signature = verify_manifest
