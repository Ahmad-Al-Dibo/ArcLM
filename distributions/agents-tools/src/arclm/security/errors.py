"""Stable errors for ArcLM Security Core."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from arclm.exceptions import ArcLMError


class SecurityError(ArcLMError):
    """Base error for ArcLM Security Core."""

    code = "security_error"


class SecurityDependencyError(SecurityError):
    """Raised when a required security dependency is unavailable."""

    code = "security_dependency_missing"


class EncryptionError(SecurityError):
    """Raised when encryption cannot complete safely."""

    code = "security_encryption_failed"


class DecryptionError(SecurityError):
    """Raised when decryption or authentication fails."""

    code = "security_decryption_failed"


class KeyManagementError(SecurityError):
    """Raised by key providers and key lifecycle checks."""

    code = "security_key_error"


class SignatureError(SecurityError):
    """Raised when manifest signing or verification fails."""

    code = "security_signature_failed"


class ManifestError(SecurityError):
    """Raised for invalid or unsafe security manifests."""

    code = "security_manifest_invalid"


class SecureLoadError(SecurityError):
    """Raised when secure loading policy blocks an artifact."""

    code = "security_load_blocked"


class SecurityPolicyError(SecurityError):
    """Raised when security policy denies an operation."""

    code = "security_policy_denied"


@dataclass(frozen=True)
class SecurityErrorInfo:
    """JSON-safe security error information."""

    code: str
    message: str
    metadata: dict[str, Any] | None = None

    def to_dict(self) -> dict[str, Any]:
        return {
            "code": self.code,
            "message": self.message,
            "metadata": dict(self.metadata or {}),
        }


def require_cryptography() -> Any:
    """Import cryptography lazily or fail closed."""

    try:
        import cryptography
    except ModuleNotFoundError as exc:
        raise SecurityDependencyError(
            'ArcLM Security Core encryption/signing requires "cryptography". '
            'Install it with: pip install "arclm[security]".'
        ) from exc
    return cryptography
