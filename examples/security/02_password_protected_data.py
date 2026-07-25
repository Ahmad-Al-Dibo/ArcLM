"""Use Argon2id password-derived encryption for synthetic data."""

from arclm.security.configuration import PasswordKDFConfig
from arclm.security.crypto.key_derivation import derive_key_argon2id
from arclm.security import decrypt_bytes, encrypt_bytes


config = PasswordKDFConfig(memory_cost_kib=19 * 1024, iterations=2, lanes=1)
derived = derive_key_argon2id("demo password only", config=config)
envelope = encrypt_bytes(b"synthetic data", derived.key, key_id="password_demo")

same = derive_key_argon2id("demo password only", salt=derived.salt, config=config)
print(decrypt_bytes(envelope, same.key).decode("utf-8"))
print("KDF metadata has salt but no password:", sorted(derived.metadata()))
