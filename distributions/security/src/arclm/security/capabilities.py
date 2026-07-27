"""Security capability reporting."""

from __future__ import annotations

import ssl
from dataclasses import dataclass, field
from enum import Enum


class SecurityCapabilityStatus(str, Enum):
    """Security capability status."""

    AVAILABLE = "available"
    OPTIONAL = "optional"
    DEPENDENCY_MISSING = "dependency_missing"
    UNSUPPORTED = "unsupported"
    EXPERIMENTAL = "experimental"


@dataclass(frozen=True)
class SecurityCapabilities:
    """Safe security capability report."""

    encryption: SecurityCapabilityStatus
    signatures: SecurityCapabilityStatus
    password_kdf: SecurityCapabilityStatus
    hkdf: SecurityCapabilityStatus
    keyring: SecurityCapabilityStatus = SecurityCapabilityStatus.OPTIONAL
    streaming_encryption: SecurityCapabilityStatus = SecurityCapabilityStatus.UNSUPPORTED
    filesystem_permissions_supported: bool = True
    tls13_supported: bool = field(default_factory=lambda: getattr(ssl, "HAS_TLSv1_3", False))

    def to_dict(self) -> dict[str, object]:
        return {
            "encryption": self.encryption.value,
            "signatures": self.signatures.value,
            "password_kdf": self.password_kdf.value,
            "hkdf": self.hkdf.value,
            "keyring": self.keyring.value,
            "streaming_encryption": self.streaming_encryption.value,
            "filesystem_permissions_supported": self.filesystem_permissions_supported,
            "tls13_supported": self.tls13_supported,
        }


def get_security_capabilities() -> SecurityCapabilities:
    """Return Security Core capability status without leaking local paths."""

    try:
        import cryptography  # noqa: F401
        from cryptography.hazmat.primitives.kdf.argon2 import Argon2id  # noqa: F401
        status = SecurityCapabilityStatus.AVAILABLE
    except ModuleNotFoundError:
        status = SecurityCapabilityStatus.DEPENDENCY_MISSING
    except ImportError:
        status = SecurityCapabilityStatus.DEPENDENCY_MISSING
    return SecurityCapabilities(
        encryption=status,
        signatures=status,
        password_kdf=status,
        hkdf=status,
    )
