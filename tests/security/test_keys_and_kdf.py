import os

import pytest

from arclm.security.configuration import PasswordKDFConfig
from arclm.security.crypto.key_derivation import derive_key_argon2id, derive_subkey_hkdf
from arclm.security.keys import InMemoryKeyProvider, KeyLifecycleState, PasswordKeyProvider


def _fast_config():
    return PasswordKDFConfig(memory_cost_kib=19 * 1024, iterations=2, lanes=1)


def test_argon2id_random_salts_and_repeatability():
    first = derive_key_argon2id("correct horse", config=_fast_config())
    second = derive_key_argon2id("correct horse", config=_fast_config())
    repeated = derive_key_argon2id("correct horse", salt=first.salt, config=_fast_config())

    assert first.salt != second.salt
    assert first.key != second.key
    assert first.key == repeated.key
    assert "correct horse" not in str(first.metadata())


def test_invalid_kdf_parameters_are_rejected():
    with pytest.raises(ValueError):
        PasswordKDFConfig(memory_cost_kib=1024)
    with pytest.raises(ValueError):
        PasswordKDFConfig(iterations=1)


def test_hkdf_uses_purpose_bound_context():
    master = os.urandom(32)
    dataset_key = derive_subkey_hkdf(master, purpose="dataset", context=b"a")
    checkpoint_key = derive_subkey_hkdf(master, purpose="checkpoint", context=b"a")

    assert dataset_key != checkpoint_key


def test_in_memory_key_provider_creation_rotation_wrapping_and_disable():
    provider = InMemoryKeyProvider()
    first = provider.create_key(key_id="key_1")
    wrapped_ref, wrapped = provider.wrap_key(b"x" * 32)
    assert wrapped_ref.key_id == "key_1"
    assert provider.unwrap_key(wrapped, "key_1") == b"x" * 32

    second = provider.rotate_key()
    assert second.key_id != first.key_id
    assert provider.active_key().key_id == second.key_id
    assert provider._states[first.key_id] == KeyLifecycleState.DECRYPT_ONLY
    provider.disable_key(second.key_id)
    with pytest.raises(Exception):
        provider.get_key(second.key_id)


def test_password_key_provider_repr_does_not_leak_secret():
    provider = PasswordKeyProvider("secret-password", config=_fast_config())

    assert "secret-password" not in repr(provider.get_key("password_key"))
    assert provider.active_key().key_id == "password_key"
