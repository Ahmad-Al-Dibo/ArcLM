"""Serialization policy helpers."""

from __future__ import annotations

from dataclasses import replace
from pathlib import Path
from typing import Any

from .artifacts.secure_loader import SecureArtifactLoader
from .configuration import SecurityPolicy


def validate_before_torch_load(
    path: str | Path,
    *,
    signed: bool = False,
    policy: SecurityPolicy | None = None,
    trusted_legacy: bool = False,
) -> None:
    """Validate policy before a PyTorch/Pickle-based load."""

    active = policy or SecurityPolicy()
    if trusted_legacy:
        active = replace(active, allow_untrusted_pickle=True)
    SecureArtifactLoader(active).validate_before_load(
        path,
        artifact_type="checkpoint",
        signed=signed,
        uses_pickle=True,
    )
