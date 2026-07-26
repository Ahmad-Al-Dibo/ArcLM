"""ArcLM Security Core.

Security-by-default primitives and policy helpers for ArcLM.
"""

from __future__ import annotations

from .audit import (
    InMemorySecurityAuditLog,
    SecurityAuditEvent,
    SecurityInventoryItem,
    ThreatModelItem,
    security_inventory,
    threat_model,
)
from .capabilities import SecurityCapabilities, SecurityCapabilityStatus, get_security_capabilities
from .configuration import LegacyArtifactPolicy, PasswordKDFConfig, SecurityMode, SecurityPolicy
from .crypto import EncryptedEnvelope, decrypt_bytes, decrypt_json, derive_key_argon2id, derive_subkey_hkdf, encrypt_bytes, encrypt_json
from .errors import (
    DecryptionError,
    EncryptionError,
    KeyManagementError,
    ManifestError,
    SecureLoadError,
    SecurityDependencyError,
    SecurityError,
    SecurityPolicyError,
    SignatureError,
)
from .hashing import hash_bytes, hash_file, verify_file_hash
from .redaction import redact_mapping, redact_sensitive_text
from .signatures import generate_signing_keypair, sign_manifest, verify_manifest, verify_manifest_signature
from .status import security_status

__all__ = [
    "DecryptionError",
    "EncryptedEnvelope",
    "EncryptionError",
    "InMemorySecurityAuditLog",
    "KeyManagementError",
    "LegacyArtifactPolicy",
    "ManifestError",
    "PasswordKDFConfig",
    "SecureLoadError",
    "SecurityAuditEvent",
    "SecurityCapabilities",
    "SecurityCapabilityStatus",
    "SecurityDependencyError",
    "SecurityError",
    "SecurityInventoryItem",
    "SecurityMode",
    "SecurityPolicy",
    "SecurityPolicyError",
    "SignatureError",
    "ThreatModelItem",
    "decrypt_bytes",
    "decrypt_json",
    "derive_key_argon2id",
    "derive_subkey_hkdf",
    "encrypt_bytes",
    "encrypt_json",
    "generate_signing_keypair",
    "get_security_capabilities",
    "hash_bytes",
    "hash_file",
    "redact_mapping",
    "redact_sensitive_text",
    "security_inventory",
    "security_status",
    "sign_manifest",
    "threat_model",
    "verify_file_hash",
    "verify_manifest",
    "verify_manifest_signature",
]
