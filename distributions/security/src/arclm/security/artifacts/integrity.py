"""Artifact integrity verification."""

from __future__ import annotations

from pathlib import Path

from arclm.security.errors import ManifestError
from arclm.security.hashing import verify_file_hash
from arclm.security.paths import resolve_under_root

from .manifest import ArtifactManifest


def verify_manifest_files(root: str | Path, manifest: ArtifactManifest | dict) -> bool:
    """Verify file presence, size, hashes, and absence of unexpected files."""

    root_path = Path(root).resolve()
    manifest_obj = manifest if isinstance(manifest, ArtifactManifest) else _manifest_from_dict(manifest)
    expected = {item.name: item for item in manifest_obj.files}
    actual = {
        path.relative_to(root_path).as_posix()
        for path in root_path.rglob("*")
        if path.is_file() and path.name != "security-manifest.json"
    }
    if actual != set(expected):
        raise ManifestError("artifact files do not match the manifest")
    for name, item in expected.items():
        path = resolve_under_root(root_path, name)
        if path.stat().st_size != item.size:
            raise ManifestError("artifact file size does not match manifest")
        if not verify_file_hash(path, item.sha256):
            raise ManifestError("artifact file hash does not match manifest")
    return True


def _manifest_from_dict(values: dict) -> ArtifactManifest:
    from .manifest import ManifestFile

    return ArtifactManifest(
        manifest_version=int(values["manifest_version"]),
        artifact_id=str(values["artifact_id"]),
        artifact_type=str(values["artifact_type"]),
        files=[ManifestFile(**item) for item in values["files"]],
        created_at=float(values["created_at"]),
        model_config_fingerprint=values.get("model_config_fingerprint"),
        tokenizer_fingerprint=values.get("tokenizer_fingerprint"),
        metadata=dict(values.get("metadata") or {}),
    )
