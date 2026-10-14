"""Password-derived key provider."""

from __future__ import annotations

from arclm.security.configuration import PasswordKDFConfig
from arclm.security.crypto.key_derivation import derive_key_argon2id

from .provider import KeyLifecycleState, KeyReference, SecretKeyMaterial


class PasswordKeyProvider:
    """Single-key provider backed by an explicit user password."""

    def __init__(
        self,
        password: str | bytes,
        *,
        key_id: str = "password_key",
        salt: bytes | None = None,
        config: PasswordKDFConfig | None = None,
    ) -> None:
        derived = derive_key_argon2id(password, salt=salt, config=config)
        self._key_id = key_id
        self._key = derived.key
        self.kdf_metadata = derived.metadata()

    def create_key(self, *, key_id: str | None = None, activate: bool = True) -> KeyReference:
        return self.active_key()

    def get_key(self, key_id: str) -> SecretKeyMaterial:
        if key_id != self._key_id:
            from arclm.security.errors import KeyManagementError

            raise KeyManagementError("password-derived key is missing")
        return SecretKeyMaterial(key_id=self._key_id, key=self._key)

    def active_key(self) -> KeyReference:
        return KeyReference(key_id=self._key_id, state=KeyLifecycleState.ACTIVE)

    def wrap_key(self, key: bytes, *, key_id: str | None = None):
        from .memory import InMemoryKeyProvider

        provider = InMemoryKeyProvider()
        provider._keys[self._key_id] = self._key
        provider._states[self._key_id] = KeyLifecycleState.ACTIVE
        provider._active_key_id = self._key_id
        return provider.wrap_key(key, key_id=self._key_id)

    def unwrap_key(self, wrapped: bytes, key_id: str) -> bytes:
        from .memory import InMemoryKeyProvider

        provider = InMemoryKeyProvider()
        provider._keys[self._key_id] = self._key
        provider._states[self._key_id] = KeyLifecycleState.ACTIVE
        provider._active_key_id = self._key_id
        return provider.unwrap_key(wrapped, key_id)

    def rotate_key(self) -> KeyReference:
        return self.active_key()

    def disable_key(self, key_id: str) -> None:
        from arclm.security.errors import KeyManagementError

        raise KeyManagementError("password-derived provider does not support disabling in this phase")
