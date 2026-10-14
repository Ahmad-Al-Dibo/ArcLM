"""
ArcLM Complete Project: Secure Local AI Workspace

What you'll learn
-----------------
- Encrypt run metadata and store it in an EncryptedArtifactStore
- Sign an artifact manifest with an Ed25519 keypair and verify it
- Redact secrets from traces before display

When to use this
----------------
- A local workspace where every artifact is encrypted, signed, and auditable

Requirements
------------
    pip install "arclm[security]"

Run
---
    python examples/12_complete_projects/06_secure_local_ai_workspace/main.py

Expected output
---------------
    "decrypted": {"run": "synthetic"}
    "manifest_verified": true, "store_record": "metadata.json.enc"
    "trace": "api_key=[REDACTED]"

Runtime
-------
    Under 5 seconds on CPU.
"""

from __future__ import annotations

import json
import os
import tempfile
from pathlib import Path

from arclm.security import decrypt_json, encrypt_json, generate_signing_keypair, redact_sensitive_text, sign_manifest, verify_manifest
from arclm.security.artifacts import EncryptedArtifactStore, create_artifact_manifest
from arclm.security.keys import InMemoryKeyProvider


def print_json(value) -> None:
    print(json.dumps(value, indent=2, sort_keys=True, default=str))


# --- 1. Encrypt a run-metadata envelope ---
def main() -> None:
    key = os.urandom(32)
    with tempfile.TemporaryDirectory(prefix="arclm-secure-workspace-") as tmpdir:
        root = Path(tmpdir)
        envelope = encrypt_json({"run": "synthetic"}, key, associated_data={"artifact_type": "run_metadata"})
        # --- 2. Write an encrypted artifact record ---
        provider = InMemoryKeyProvider()
        provider.create_key(key_id="key_1")
        store = EncryptedArtifactStore(root=root / "store", key_provider=provider)
        record = store.write_json(relative_path="metadata.json.enc", value={"prompt": "api_key=synthetic-secret"}, artifact_type="run_metadata")
        # --- 3. Sign and verify the artifact manifest ---
        artifact = root / "artifact"
        artifact.mkdir()
        (artifact / "weights.safetensors").write_bytes(b"synthetic")
        manifest = create_artifact_manifest(artifact, artifact_type="checkpoint")
        pair = generate_signing_keypair(key_id="signing_key_workspace")
        signed = sign_manifest(manifest.to_dict(), pair.private_key, key_id=pair.key_id)
        # --- 4. Redact secrets from the trace ---
        print_json({"decrypted": decrypt_json(envelope, key), "store_record": record.path, "manifest_verified": verify_manifest(signed, pair.public_key, expected_key_id=pair.key_id), "trace": redact_sensitive_text("api_key=synthetic-secret")})


if __name__ == "__main__":
    main()
