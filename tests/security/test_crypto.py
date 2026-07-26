import os

import pytest

from arclm.security import (
    DecryptionError,
    EncryptedEnvelope,
    SecurityPolicy,
    decrypt_bytes,
    decrypt_json,
    encrypt_bytes,
    encrypt_json,
)


def test_aes_gcm_round_trip_and_json_round_trip():
    key = os.urandom(32)
    envelope = encrypt_bytes(b"secret data", key, associated_data={"artifact_type": "dataset"})

    assert envelope.algorithm == "AES-256-GCM"
    assert decrypt_bytes(envelope, key) == b"secret data"
    assert decrypt_json(encrypt_json({"name": "ArcLM"}, key), key) == {"name": "ArcLM"}


def test_chacha20_poly1305_round_trip():
    key = os.urandom(32)
    envelope = encrypt_bytes(b"secret data", key, algorithm="ChaCha20-Poly1305")

    assert decrypt_bytes(envelope, key) == b"secret data"


def test_tamper_wrong_key_and_modified_associated_data_are_rejected():
    key = os.urandom(32)
    envelope = encrypt_bytes(b"secret data", key, associated_data={"artifact_type": "checkpoint"})

    values = envelope.to_dict()
    values["ciphertext"] = values["ciphertext"][:-2] + "AA"
    with pytest.raises(DecryptionError):
        decrypt_bytes(values, key)

    with pytest.raises(DecryptionError):
        decrypt_bytes(envelope, os.urandom(32))

    values = envelope.to_dict()
    values["associated_data"] = {"artifact_type": "dataset"}
    with pytest.raises(DecryptionError):
        decrypt_bytes(values, key)


def test_repeated_encryption_uses_unique_nonce_and_ciphertext():
    key = os.urandom(32)
    first = encrypt_bytes(b"same", key)
    second = encrypt_bytes(b"same", key)

    assert first.nonce != second.nonce
    assert first.ciphertext != second.ciphertext


def test_malformed_envelope_unsupported_algorithm_version_and_size_limit():
    key = os.urandom(32)
    envelope = encrypt_bytes(b"x", key)
    values = envelope.to_dict()
    values["version"] = 999
    with pytest.raises(DecryptionError):
        EncryptedEnvelope.from_dict(values)

    values = envelope.to_dict()
    values["algorithm"] = "AES-ECB"
    with pytest.raises(DecryptionError):
        EncryptedEnvelope.from_dict(values)

    values = envelope.to_dict()
    values["nonce"] = "!!!!"
    with pytest.raises(DecryptionError):
        EncryptedEnvelope.from_dict(values)

    values = envelope.to_dict()
    del values["ciphertext"]
    with pytest.raises(DecryptionError):
        EncryptedEnvelope.from_dict(values)

    policy = SecurityPolicy(max_encryption_bytes=4)
    with pytest.raises(Exception, match="too large"):
        encrypt_bytes(b"12345", key, policy=policy)
