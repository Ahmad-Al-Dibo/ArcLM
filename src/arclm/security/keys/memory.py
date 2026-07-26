"""In-memory key provider for tests and local applications."""

from __future__ import annotations

import os
import uuid

from arclm.security.crypto.aead import decrypt_bytes, encrypt_bytes
from arclm.security.errors import KeyManagementError

from .provider import KeyLifecycleState, KeyReference, SecretKeyMaterial


class InMemoryKeyProvider:
    """In-memory key provider.

    This provider is useful for tests and local ephemeral workflows. It does not
    persist keys and should not be used as the only protection for real
    long-lived workspaces.
    """

    def __init__(self) -> None:
        self._keys: dict[str, bytes] = {}
        self._states: dict[str, KeyLifecycleState] = {}
        self._active_key_id: str | None = None

    def create_key(self, *, key_id: str | None = None, activate: bool = True) -> KeyReference:
        key_id = key_id or "key_" + uuid.uuid4().hex
        if key_id in self._keys:
            raise KeyManagementError("key already exists")
        self._keys[key_id] = os.urandom(32)
        self._states[key_id] = KeyLifecycleState.ACTIVE if activate else KeyLifecycleState.DECRYPT_ONLY
        if activate:
            if self._active_key_id and self._active_key_id in self._states:
                self._states[self._active_key_id] = KeyLifecycleState.DECRYPT_ONLY
            self._active_key_id = key_id
        return self._reference(key_id)

    def get_key(self, key_id: str) -> SecretKeyMaterial:
        state = self._states.get(key_id)
        if state is None:
            raise KeyManagementError("key is missing")
        if state in {KeyLifecycleState.DISABLED, KeyLifecycleState.DESTROYED}:
            raise KeyManagementError("key is not available")
        return SecretKeyMaterial(key_id=key_id, key=self._keys[key_id])

    def active_key(self) -> KeyReference:
        if self._active_key_id is None:
            return self.create_key()
        return self._reference(self._active_key_id)

    def wrap_key(self, key: bytes, *, key_id: str | None = None) -> tuple[KeyReference, bytes]:
        reference = self._reference(key_id) if key_id else self.active_key()
        material = self.get_key(reference.key_id)
        envelope = encrypt_bytes(
            key,
            material.key,
            key_id=reference.key_id,
            associated_data={"artifact_type": "wrapped_data_key", "key_id": reference.key_id},
        )
        return reference, envelope.to_json().encode("utf-8")

    def unwrap_key(self, wrapped: bytes, key_id: str) -> bytes:
        material = self.get_key(key_id)
        return decrypt_bytes(wrapped.decode("utf-8"), material.key)

    def rotate_key(self) -> KeyReference:
        if self._active_key_id is not None:
            self._states[self._active_key_id] = KeyLifecycleState.DECRYPT_ONLY
        return self.create_key(activate=True)

    def disable_key(self, key_id: str) -> None:
        if key_id not in self._keys:
            raise KeyManagementError("key is missing")
        if self._active_key_id == key_id:
            self._active_key_id = None
        self._states[key_id] = KeyLifecycleState.DISABLED

    def destroy_key(self, key_id: str) -> None:
        if key_id not in self._keys:
            raise KeyManagementError("key is missing")
        self._keys[key_id] = b"\x00" * 32
        self._states[key_id] = KeyLifecycleState.DESTROYED
        if self._active_key_id == key_id:
            self._active_key_id = None

    def _reference(self, key_id: str | None) -> KeyReference:
        if key_id is None or key_id not in self._states:
            raise KeyManagementError("key is missing")
        return KeyReference(key_id=key_id, state=self._states[key_id])
