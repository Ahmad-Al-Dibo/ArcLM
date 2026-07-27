"""Sign and verify a synthetic artifact manifest."""

import tempfile
from pathlib import Path

from arclm.security.artifacts import create_artifact_manifest
from arclm.security.signatures import generate_signing_keypair, sign_manifest, verify_manifest


with tempfile.TemporaryDirectory() as tmp:
    root = Path(tmp)
    (root / "weights.safetensors").write_bytes(b"tiny weights")
    manifest = create_artifact_manifest(root, artifact_type="model_artifact")
    keys = generate_signing_keypair(key_id="signing_demo")
    signed = sign_manifest(manifest.to_dict(), keys.private_key, key_id=keys.key_id)
    print("verified:", verify_manifest(signed, keys.public_key, expected_key_id=keys.key_id))
