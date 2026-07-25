"""Transport policy helpers for Web Studio."""

from __future__ import annotations

from dataclasses import dataclass

from arclm.security.configuration import SecurityMode
from arclm.security.errors import SecurityPolicyError


@dataclass(frozen=True)
class WebTransportPolicy:
    """Web transport security mode."""

    mode: SecurityMode = SecurityMode.LOCAL_SECURE
    host: str = "127.0.0.1"
    tls_enabled: bool = False

    @property
    def is_remote(self) -> bool:
        return self.host not in {"127.0.0.1", "localhost", "::1"}


def validate_transport_policy(policy: WebTransportPolicy) -> None:
    """Validate local/remote transport behavior."""

    if policy.is_remote and policy.mode is SecurityMode.REMOTE_SECURE and not policy.tls_enabled:
        raise SecurityPolicyError("remote secure Web Studio mode requires TLS")
    if policy.is_remote and policy.mode is SecurityMode.DEVELOPMENT:
        raise SecurityPolicyError("development mode may not bind Web Studio remotely")
