"""Safe security status reports."""

from __future__ import annotations

from .artifacts.secure_loader import inspect_model_loading_policy
from .capabilities import get_security_capabilities
from .configuration import SecurityPolicy


def security_status(policy: SecurityPolicy | None = None) -> dict[str, object]:
    """Return a safe security status report without paths or secrets."""

    policy = policy or SecurityPolicy()
    capabilities = get_security_capabilities()
    warnings: list[str] = []
    if capabilities.encryption.value == "dependency_missing":
        warnings.append("security extra is not installed; encryption operations fail closed")
    if policy.mode.value == "development":
        warnings.append("development mode is not intended for sensitive workspaces")
    return {
        "mode": policy.mode.value,
        "encryption": {
            "available": capabilities.encryption.value == "available",
            "required_for": list(policy.encryption_required_for),
        },
        "signing": {
            "available": capabilities.signatures.value == "available",
        },
        "model_loading": inspect_model_loading_policy(policy),
        "web": {
            "remote_access": policy.mode.value == "remote_secure",
            "tls_required_for_remote": policy.tls_required_for_remote,
        },
        "warnings": warnings,
    }
