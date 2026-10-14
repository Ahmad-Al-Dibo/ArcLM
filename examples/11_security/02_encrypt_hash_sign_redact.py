"""
ArcLM Example: Encrypt, Hash, Sign, and Redact

What you'll learn
-----------------
- Encrypt JSON with AEAD and associated data, then reject tampered ciphertext
- Hash files and sign artifact manifests with Ed25519 keypairs
- Redact secrets from text before it is logged

When to use this
----------------
- Protecting run metadata and model artifacts on a local machine

Requirements
------------
    pip install "arclm[security]"

Run
---
    python examples/11_security/02_encrypt_hash_sign_redact.py

Expected output
---------------
    "decrypted": {"prompt": "synthetic"}, "tamper_rejected": true
    "hash": "sha256:...", "manifest_verified": true
    "redacted": "api_key=[REDACTED]"

Runtime
-------
    Under 5 seconds on CPU.
"""

from __future__ import annotations

import json
import os
import tempfile
from pathlib import Path

from arclm.security import DecryptionError, decrypt_json, encrypt_json, generate_signing_keypair, hash_file, redact_sensitive_text, sign_manifest, verify_manifest
from arclm.security.artifacts import create_artifact_manifest


# --- 1. Pretty-print helper ---
def print_json(value) -> None:
    print(json.dumps(value, indent=2, sort_keys=True, default=str))


# --- 2. Encrypt JSON and prove tampered ciphertext is rejected ---
def main() -> None:
    key = os.urandom(32)
    envelope = encrypt_json({"prompt": "synthetic"}, key, associated_data={"artifact_type": "run_metadata"})
    tampered = envelope.to_dict()
    tampered["ciphertext"] = tampered["ciphertext"][:-2] + "AA"
    tamper_rejected = False
    try:
        decrypt_json(tampered, key)
    except DecryptionError:
        tamper_rejected = True
    # --- 3. Hash, sign, and verify an artifact manifest ---
    with tempfile.TemporaryDirectory(prefix="arclm-security-") as tmpdir:
        tmp = Path(tmpdir)
        artifact = tmp / "artifact"
        artifact.mkdir()
        data_file = artifact / "weights.safetensors"
        data_file.write_bytes(b"synthetic weights")
        manifest = create_artifact_manifest(artifact, artifact_type="model_artifact")
        pair = generate_signing_keypair(key_id="signing_key_example")
        signed = sign_manifest(manifest.to_dict(), pair.private_key, key_id=pair.key_id)
        verified = verify_manifest(signed, pair.public_key, expected_key_id=pair.key_id)
        # --- 4. Redact secrets and print the combined report ---
        print_json({"decrypted": decrypt_json(envelope, key), "tamper_rejected": tamper_rejected, "hash": hash_file(data_file), "manifest_verified": verified, "redacted": redact_sensitive_text("api_key=synthetic-secret")})


if __name__ == "__main__":
    main()
