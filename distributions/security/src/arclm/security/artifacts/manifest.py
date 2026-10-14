"""Signed artifact manifest data types."""

from __future__ import annotations

import json
import time
import uuid
from dataclasses import asdict, dataclass, field
from pathlib import Path
from typing import Any

from arclm.security.errors import ManifestError
from arclm.security.hashing import hash_file
from arclm.security.paths import safe_relative_path


@dataclass(frozen=True)
class ManifestFile:
    """One file listed in a security manifest."""

    name: str
    size: int
    sha256: str
    role: str | None = None

    def __post_init__(self) -> None:
        safe_relative_path(self.name)
        if self.size < 0:
            raise ManifestError("manifest file size must be non-negative")
        if not self.sha256.startswith("sha256:"):
            raise ManifestError("manifest file hash must be sha256-prefixed")

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


@dataclass(frozen=True)
class ArtifactManifest:
    """Canonical signed artifact manifest payload."""

    manifest_version: int
    artifact_id: str
    artifact_type: str
    files: list[ManifestFile]
    created_at: float
    model_config_fingerprint: str | None = None
    tokenizer_fingerprint: str | None = None
    metadata: dict[str, Any] = field(default_factory=dict)

    def __post_init__(self) -> None:
        if self.manifest_version != 1:
            raise ManifestError("manifest version is unsupported")
        names = [item.name for item in self.files]
        if len(names) != len(set(names)):
            raise ManifestError("manifest contains duplicate file paths")

    def to_dict(self) -> dict[str, Any]:
        return {
            "manifest_version": self.manifest_version,
            "artifact_id": self.artifact_id,
            "artifact_type": self.artifact_type,
            "files": [item.to_dict() for item in self.files],
            "created_at": self.created_at,
            "model_config_fingerprint": self.model_config_fingerprint,
            "tokenizer_fingerprint": self.tokenizer_fingerprint,
            "metadata": dict(self.metadata),
        }

    def to_json(self, **kwargs: Any) -> str:
        return json.dumps(self.to_dict(), sort_keys=True, **kwargs)


def create_artifact_manifest(root: str | Path, *, artifact_type: str, artifact_id: str | None = None) -> ArtifactManifest:
    """Create a manifest from files under a root directory."""

    root_path = Path(root).resolve()
    if not root_path.is_dir():
        raise ManifestError("artifact root must be a directory")
    files: list[ManifestFile] = []
    for path in sorted(item for item in root_path.rglob("*") if item.is_file()):
        if path.name == "security-manifest.json":
            continue
        relative = path.relative_to(root_path).as_posix()
        files.append(ManifestFile(name=relative, size=path.stat().st_size, sha256=hash_file(path, algorithm="sha256")))
    return ArtifactManifest(
        manifest_version=1,
        artifact_id=artifact_id or "artifact_" + uuid.uuid4().hex,
        artifact_type=artifact_type,
        files=files,
        created_at=time.time(),
    )
