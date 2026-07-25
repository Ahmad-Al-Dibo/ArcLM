"""Encrypted artifact store with atomic writes."""

from __future__ import annotations

import json
import os
import tempfile
import uuid
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from arclm.security.audit import InMemorySecurityAuditLog
from arclm.security.configuration import SecurityPolicy
from arclm.security.crypto.aead import decrypt_bytes, decrypt_json, encrypt_bytes, encrypt_json
from arclm.security.crypto.formats import EncryptedEnvelope
from arclm.security.errors import EncryptionError
from arclm.security.keys.provider import KeyProvider
from arclm.security.paths import resolve_under_root


@dataclass(frozen=True)
class EncryptedArtifactRecord:
    """Metadata for an encrypted artifact."""

    artifact_id: str
    path: str
    artifact_type: str
    key_id: str

    def to_dict(self) -> dict[str, str]:
        return {
            "artifact_id": self.artifact_id,
            "path": self.path,
            "artifact_type": self.artifact_type,
            "key_id": self.key_id,
        }


class EncryptedArtifactStore:
    """Root-scoped encrypted artifact store."""

    def __init__(
        self,
        *,
        root: str | Path,
        key_provider: KeyProvider,
        policy: SecurityPolicy | None = None,
        audit_log: InMemorySecurityAuditLog | None = None,
    ) -> None:
        self.root = Path(root).resolve()
        self.root.mkdir(parents=True, exist_ok=True)
        self.key_provider = key_provider
        self.policy = policy or SecurityPolicy()
        self.audit_log = audit_log or InMemorySecurityAuditLog()

    def write_bytes(
        self,
        *,
        relative_path: str,
        data: bytes,
        artifact_type: str,
        associated_data: dict[str, Any] | None = None,
    ) -> EncryptedArtifactRecord:
        """Encrypt and atomically write bytes."""

        target = resolve_under_root(self.root, relative_path)
        target.parent.mkdir(parents=True, exist_ok=True)
        active = self.key_provider.active_key()
        envelope = encrypt_bytes(
            data,
            self.key_provider.get_key(active.key_id).key,
            key_id=active.key_id,
            algorithm=self.policy.default_encryption_algorithm,
            associated_data={"artifact_type": artifact_type, **dict(associated_data or {})},
            policy=self.policy,
        )
        payload = envelope.to_json(indent=2).encode("utf-8")
        _atomic_write(target, payload)
        try:
            os.chmod(target, 0o600)
        except OSError:
            pass
        record = EncryptedArtifactRecord(
            artifact_id="enc_" + uuid.uuid4().hex,
            path=target.relative_to(self.root).as_posix(),
            artifact_type=artifact_type,
            key_id=active.key_id,
        )
        self.audit_log.record("encrypted_artifact_written", artifact_type=artifact_type, metadata=record.to_dict())
        return record

    def read_bytes(self, relative_path: str) -> bytes:
        """Read and decrypt bytes from the store."""

        target = resolve_under_root(self.root, relative_path)
        envelope = EncryptedEnvelope.from_json(target.read_text(encoding="utf-8"))
        material = self.key_provider.get_key(envelope.key_id)
        return decrypt_bytes(envelope, material.key)

    def write_json(self, *, relative_path: str, value: Any, artifact_type: str) -> EncryptedArtifactRecord:
        """Encrypt and atomically write JSON-safe data."""

        target = resolve_under_root(self.root, relative_path)
        target.parent.mkdir(parents=True, exist_ok=True)
        active = self.key_provider.active_key()
        envelope = encrypt_json(
            value,
            self.key_provider.get_key(active.key_id).key,
            key_id=active.key_id,
            algorithm=self.policy.default_encryption_algorithm,
            associated_data={"artifact_type": artifact_type},
            policy=self.policy,
        )
        _atomic_write(target, envelope.to_json(indent=2).encode("utf-8"))
        try:
            os.chmod(target, 0o600)
        except OSError:
            pass
        record = EncryptedArtifactRecord(
            artifact_id="enc_" + uuid.uuid4().hex,
            path=target.relative_to(self.root).as_posix(),
            artifact_type=artifact_type,
            key_id=active.key_id,
        )
        self.audit_log.record("encrypted_json_written", artifact_type=artifact_type, metadata=record.to_dict())
        return record

    def read_json(self, relative_path: str) -> Any:
        """Read and decrypt JSON-safe data."""

        target = resolve_under_root(self.root, relative_path)
        envelope = EncryptedEnvelope.from_json(target.read_text(encoding="utf-8"))
        material = self.key_provider.get_key(envelope.key_id)
        return decrypt_json(envelope, material.key)


def _atomic_write(path: Path, data: bytes) -> None:
    temp_path: Path | None = None
    try:
        with tempfile.NamedTemporaryFile(
            dir=path.parent,
            prefix=f".{path.name}.",
            suffix=".tmp",
            delete=False,
        ) as handle:
            temp_path = Path(handle.name)
            handle.write(data)
            handle.flush()
            os.fsync(handle.fileno())
        os.replace(temp_path, path)
    except Exception as exc:
        raise EncryptionError("atomic encrypted write failed") from exc
    finally:
        if temp_path is not None and temp_path.exists():
            try:
                temp_path.unlink()
            except OSError:
                pass
