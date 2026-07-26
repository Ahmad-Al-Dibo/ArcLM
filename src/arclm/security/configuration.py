"""Security policy and typed configuration."""

from __future__ import annotations

from dataclasses import asdict, dataclass, field
from enum import Enum


class SecurityMode(str, Enum):
    """ArcLM security operating mode."""

    DEVELOPMENT = "development"
    LOCAL_SECURE = "local_secure"
    REMOTE_SECURE = "remote_secure"


class LegacyArtifactPolicy(str, Enum):
    """Compatibility policy for existing plaintext artifacts."""

    LEGACY_READ = "legacy_read"
    SECURE_WRITE = "secure_write"
    STRICT_SECURE = "strict_secure"


@dataclass(frozen=True)
class PasswordKDFConfig:
    """Bounded Argon2id configuration."""

    algorithm: str = "argon2id"
    memory_cost_kib: int = 64 * 1024
    iterations: int = 3
    lanes: int = 4
    salt_length: int = 16
    output_length: int = 32

    def __post_init__(self) -> None:
        if self.algorithm != "argon2id":
            raise ValueError("password KDF algorithm must be argon2id")
        if not 19 * 1024 <= self.memory_cost_kib <= 1024 * 1024:
            raise ValueError("memory_cost_kib must be between 19 MiB and 1 GiB")
        if not 2 <= self.iterations <= 10:
            raise ValueError("iterations must be between 2 and 10")
        if not 1 <= self.lanes <= 16:
            raise ValueError("lanes must be between 1 and 16")
        if not 16 <= self.salt_length <= 64:
            raise ValueError("salt_length must be between 16 and 64 bytes")
        if self.output_length != 32:
            raise ValueError("output_length must be 32 bytes")

    def to_dict(self) -> dict[str, int | str]:
        return asdict(self)


@dataclass(frozen=True)
class SecurityPolicy:
    """Framework-wide security policy."""

    mode: SecurityMode = SecurityMode.LOCAL_SECURE
    legacy_artifacts: LegacyArtifactPolicy = LegacyArtifactPolicy.LEGACY_READ
    encryption_required_for: tuple[str, ...] = ("agent_session", "tool_trace", "run_metadata")
    signature_required_for: tuple[str, ...] = ("model_artifact", "checkpoint")
    allowed_encryption_algorithms: tuple[str, ...] = ("AES-256-GCM", "ChaCha20-Poly1305")
    default_encryption_algorithm: str = "AES-256-GCM"
    allowed_hash_algorithms: tuple[str, ...] = ("sha256", "sha512")
    default_hash_algorithm: str = "sha256"
    allow_untrusted_pickle: bool = False
    allow_remote_model_code: bool = False
    tls_required_for_remote: bool = True
    allow_wildcard_cors_with_credentials: bool = False
    redact_traces: bool = True
    max_encryption_bytes: int = 16 * 1024 * 1024
    max_manifest_files: int = 10_000
    metadata: dict[str, str] = field(default_factory=dict)

    def __post_init__(self) -> None:
        if self.default_encryption_algorithm not in self.allowed_encryption_algorithms:
            raise ValueError("default encryption algorithm must be allowed")
        if self.default_hash_algorithm not in self.allowed_hash_algorithms:
            raise ValueError("default hash algorithm must be allowed")
        if self.max_encryption_bytes <= 0:
            raise ValueError("max_encryption_bytes must be greater than zero")
        if self.max_manifest_files <= 0:
            raise ValueError("max_manifest_files must be greater than zero")

    def requires_encryption(self, artifact_type: str) -> bool:
        return artifact_type in self.encryption_required_for or self.legacy_artifacts is LegacyArtifactPolicy.STRICT_SECURE

    def requires_signature(self, artifact_type: str) -> bool:
        return artifact_type in self.signature_required_for

    def to_dict(self) -> dict[str, object]:
        data = asdict(self)
        data["mode"] = self.mode.value
        data["legacy_artifacts"] = self.legacy_artifacts.value
        return data
