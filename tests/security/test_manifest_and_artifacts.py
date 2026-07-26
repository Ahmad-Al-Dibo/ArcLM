import json

import pytest

from arclm.security.artifacts import (
    EncryptedArtifactStore,
    SecureArtifactLoader,
    create_artifact_manifest,
    verify_manifest_files,
)
from arclm.security.keys import InMemoryKeyProvider
from arclm.security.signatures import generate_signing_keypair, sign_manifest, verify_manifest


def test_signed_manifest_and_file_integrity(tmp_path):
    root = tmp_path / "artifact"
    root.mkdir()
    (root / "weights.safetensors").write_bytes(b"weights")
    manifest = create_artifact_manifest(root, artifact_type="model_artifact")
    keypair = generate_signing_keypair(key_id="signing_key_1")

    signed = sign_manifest(manifest.to_dict(), keypair.private_key, key_id=keypair.key_id)
    assert verify_manifest(signed, keypair.public_key, expected_key_id=keypair.key_id)
    assert verify_manifest_files(root, manifest)

    tampered = dict(signed)
    tampered["artifact_type"] = "checkpoint"
    with pytest.raises(Exception):
        verify_manifest(tampered, keypair.public_key)

    (root / "weights.safetensors").write_bytes(b"changed")
    with pytest.raises(Exception):
        verify_manifest_files(root, manifest)


def test_manifest_rejects_duplicate_and_traversal_paths(tmp_path):
    root = tmp_path / "artifact"
    root.mkdir()
    (root / "a.txt").write_text("x", encoding="utf-8")
    manifest = create_artifact_manifest(root, artifact_type="dataset")
    values = manifest.to_dict()
    values["files"].append(dict(values["files"][0]))
    with pytest.raises(Exception):
        from arclm.security.artifacts.integrity import _manifest_from_dict

        _manifest_from_dict(values)

    values = manifest.to_dict()
    values["files"][0]["name"] = "../escape.txt"
    with pytest.raises(Exception):
        from arclm.security.artifacts.integrity import _manifest_from_dict

        _manifest_from_dict(values)


def test_encrypted_artifact_store_json_round_trip_and_tamper_rejection(tmp_path):
    provider = InMemoryKeyProvider()
    provider.create_key(key_id="key_1")
    store = EncryptedArtifactStore(root=tmp_path, key_provider=provider)

    record = store.write_json(
        relative_path="projects/project_a/run.json.enc",
        value={"prompt": "hello"},
        artifact_type="run_metadata",
    )
    assert record.key_id == "key_1"
    assert store.read_json(record.path) == {"prompt": "hello"}

    path = tmp_path / record.path
    data = json.loads(path.read_text(encoding="utf-8"))
    assert data["key_id"] == "wrapped_data_key"
    assert data["key_encryption_key_id"] == "key_1"
    assert isinstance(data["encrypted_data_key"], str)
    data["ciphertext"] = data["ciphertext"][:-2] + "AA"
    path.write_text(json.dumps(data), encoding="utf-8")
    with pytest.raises(Exception):
        store.read_json(record.path)


def test_encrypted_artifact_store_uses_wrapped_data_keys_across_rotation(tmp_path):
    provider = InMemoryKeyProvider()
    provider.create_key(key_id="key_1")
    store = EncryptedArtifactStore(root=tmp_path, key_provider=provider)

    first = store.write_json(relative_path="first.json.enc", value={"value": 1}, artifact_type="run_metadata")
    provider.rotate_key()
    second = store.write_json(relative_path="second.json.enc", value={"value": 2}, artifact_type="run_metadata")

    first_envelope = json.loads((tmp_path / first.path).read_text(encoding="utf-8"))
    second_envelope = json.loads((tmp_path / second.path).read_text(encoding="utf-8"))
    assert first_envelope["key_encryption_key_id"] == "key_1"
    assert second_envelope["key_encryption_key_id"] != "key_1"
    assert store.read_json(first.path) == {"value": 1}
    assert store.read_json(second.path) == {"value": 2}


def test_secure_loader_rejects_pickle_and_unsigned_strict_artifact(tmp_path):
    artifact = tmp_path / "training.pt"
    artifact.write_bytes(b"pickle-ish")
    loader = SecureArtifactLoader()

    with pytest.raises(Exception, match="Pickle"):
        loader.validate_before_load(artifact, artifact_type="checkpoint", uses_pickle=True)

    from arclm.security import SecurityPolicy
    from arclm.security.configuration import LegacyArtifactPolicy

    strict = SecureArtifactLoader(SecurityPolicy(legacy_artifacts=LegacyArtifactPolicy.STRICT_SECURE))
    with pytest.raises(Exception, match="signed manifest"):
        strict.validate_before_load(artifact, artifact_type="checkpoint", signed=False, uses_pickle=False)
