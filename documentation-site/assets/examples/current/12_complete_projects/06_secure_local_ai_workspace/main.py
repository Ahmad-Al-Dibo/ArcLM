"""ArcLM Complete Project: Secure Local AI Workspace."""

from __future__ import annotations

import json
import os
import tempfile
from pathlib import Path

from arclm.security import decrypt_json, encrypt_json, generate_signing_keypair, redact_sensitive_text, sign_manifest, verify_manifest
from arclm.security.artifacts import create_artifact_manifest
from arclm.security.keys import InMemoryKeyProvider
from arclm.security.artifacts import EncryptedArtifactStore


def print_json(value) -> None:
    print(json.dumps(value, indent=2, sort_keys=True, default=str))


def main() -> None:
    key = os.urandom(32)
    with tempfile.TemporaryDirectory(prefix="arclm-secure-workspace-") as tmpdir:
        root = Path(tmpdir)
        envelope = encrypt_json({"run": "synthetic"}, key, associated_data={"artifact_type": "run_metadata"})
        provider = InMemoryKeyProvider()
        provider.create_key(key_id="key_1")
        store = EncryptedArtifactStore(root=root / "store", key_provider=provider)
        record = store.write_json(relative_path="metadata.json.enc", value={"prompt": "api_key=synthetic-secret"}, artifact_type="run_metadata")
        artifact = root / "artifact"
        artifact.mkdir()
        (artifact / "weights.safetensors").write_bytes(b"synthetic")
        manifest = create_artifact_manifest(artifact, artifact_type="checkpoint")
        pair = generate_signing_keypair(key_id="signing_key_workspace")
        signed = sign_manifest(manifest.to_dict(), pair.private_key, key_id=pair.key_id)
        print_json({"decrypted": decrypt_json(envelope, key), "store_record": record.path, "manifest_verified": verify_manifest(signed, pair.public_key, expected_key_id=pair.key_id), "trace": redact_sensitive_text("api_key=synthetic-secret")})


if __name__ == "__main__":
    main()

