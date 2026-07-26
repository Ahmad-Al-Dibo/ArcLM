"""Verify hashes for a tiny synthetic model artifact."""

import tempfile
from pathlib import Path

from arclm.security.artifacts import create_artifact_manifest, verify_manifest_files


with tempfile.TemporaryDirectory() as tmp:
    root = Path(tmp)
    (root / "model").mkdir()
    (root / "model" / "weights.safetensors").write_bytes(b"tiny weights")
    manifest = create_artifact_manifest(root, artifact_type="model_artifact")
    print("file integrity:", verify_manifest_files(root, manifest))
