"""
ArcLM Example: Encrypt, Hash, Sign, and Redact

This example uses synthetic data to demonstrate AEAD encryption, tamper
rejection, file hashing, Ed25519 manifest signatures, and secret redaction.
"""

from __future__ import annotations

import json
import os
import tempfile
from pathlib import Path

from arclm.security import DecryptionError, decrypt_json, encrypt_json, generate_signing_keypair, hash_file, redact_sensitive_text, sign_manifest, verify_manifest
from arclm.security.artifacts import create_artifact_manifest


def print_json(value) -> None:
    print(json.dumps(value, indent=2, sort_keys=True, default=str))


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
        print_json({"decrypted": decrypt_json(envelope, key), "tamper_rejected": tamper_rejected, "hash": hash_file(data_file), "manifest_verified": verified, "redacted": redact_sensitive_text("api_key=synthetic-secret")})


if __name__ == "__main__":
    main()
