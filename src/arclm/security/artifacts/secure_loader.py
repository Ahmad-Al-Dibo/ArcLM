"""Secure artifact and model-loading policy boundary."""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Any

from arclm.security.configuration import LegacyArtifactPolicy, SecurityPolicy
from arclm.security.errors import SecureLoadError


@dataclass(frozen=True)
class SecureLoadPolicy:
    """Policy for model/checkpoint deserialization."""

    allow_pickle: bool = False
    require_signature: bool = True
    allow_remote_code: bool = False
    allow_legacy_unsigned: bool = False


class SecureArtifactLoader:
    """Policy gate that blocks unsafe loads before deserialization."""

    def __init__(self, policy: SecurityPolicy | None = None) -> None:
        self.policy = policy or SecurityPolicy()

    def validate_before_load(
        self,
        path: str | Path,
        *,
        artifact_type: str,
        signed: bool = False,
        uses_pickle: bool = False,
        trust_remote_code: bool = False,
    ) -> None:
        """Validate security policy before any sensitive loading occurs."""

        if uses_pickle and not self.policy.allow_untrusted_pickle:
            raise SecureLoadError("untrusted Pickle loading is rejected by default")
        if trust_remote_code and not self.policy.allow_remote_model_code:
            raise SecureLoadError("remote model code is rejected by default")
        if self.policy.requires_signature(artifact_type) and not signed:
            if self.policy.legacy_artifacts is not LegacyArtifactPolicy.LEGACY_READ:
                raise SecureLoadError("signed manifest is required before trusted loading")
        if not Path(path).exists():
            raise SecureLoadError("artifact path is missing")


def inspect_model_loading_policy(policy: SecurityPolicy | None = None) -> dict[str, object]:
    """Return safe model-loading security status."""

    policy = policy or SecurityPolicy()
    return {
        "untrusted_pickle_allowed": policy.allow_untrusted_pickle,
        "remote_code_allowed": policy.allow_remote_model_code,
        "legacy_artifacts": policy.legacy_artifacts.value,
        "signature_required_for": list(policy.signature_required_for),
    }
