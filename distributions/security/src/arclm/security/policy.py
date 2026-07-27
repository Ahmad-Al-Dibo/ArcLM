"""Security policy evaluation helpers."""

from __future__ import annotations

from .configuration import SecurityMode, SecurityPolicy
from .errors import SecurityPolicyError


def ensure_encryption_allowed(artifact_type: str, *, encrypted: bool, policy: SecurityPolicy) -> None:
    """Fail closed when encryption is required."""

    if policy.requires_encryption(artifact_type) and not encrypted:
        raise SecurityPolicyError("plaintext storage is denied by security policy")


def ensure_remote_transport_allowed(*, remote: bool, https: bool, policy: SecurityPolicy) -> None:
    """Validate transport policy for remote access."""

    if remote and policy.mode is SecurityMode.REMOTE_SECURE and policy.tls_required_for_remote and not https:
        raise SecurityPolicyError("remote secure mode requires TLS")
