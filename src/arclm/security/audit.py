"""Security inventory, threat model, and audit events."""

from __future__ import annotations

import time
import uuid
from dataclasses import asdict, dataclass, field
from typing import Any

from .redaction import redact_mapping


@dataclass(frozen=True)
class SecurityInventoryItem:
    asset: str
    location: str
    sensitivity: str
    current_protection: str
    threats: tuple[str, ...]
    required_protection: str
    owner_subsystem: str
    migration_requirement: str

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


@dataclass(frozen=True)
class ThreatModelItem:
    threat: str
    affected_assets: tuple[str, ...]
    entry_point: str
    likelihood: str
    impact: str
    mitigation: str
    remaining_risk: str
    required_tests: tuple[str, ...]

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


@dataclass
class SecurityAuditEvent:
    event_type: str
    timestamp: float
    event_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    actor: str | None = None
    artifact_type: str | None = None
    result: str = "ok"
    metadata: dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> dict[str, Any]:
        data = asdict(self)
        data["metadata"] = redact_mapping(data["metadata"])
        return data


class InMemorySecurityAuditLog:
    """Small local audit sink for tests and local applications."""

    def __init__(self) -> None:
        self.events: list[SecurityAuditEvent] = []

    def record(self, event_type: str, **kwargs: Any) -> SecurityAuditEvent:
        event = SecurityAuditEvent(event_type=event_type, timestamp=time.time(), **kwargs)
        self.events.append(event)
        return event

    def to_dict(self) -> dict[str, Any]:
        return {"events": [event.to_dict() for event in self.events]}


SECURITY_INVENTORY = [
    SecurityInventoryItem("raw datasets", "workspace/project data", "high", "local path validation and size limits", ("dataset disclosure", "path traversal"), "encrypt sensitive datasets; signed metadata", "datasets", "legacy_read then explicit migration"),
    SecurityInventoryItem("processed datasets", "workspace reports/cache", "medium", "bounded local files", ("workspace theft", "metadata leakage"), "encrypt sensitive reports", "datasets", "secure_write"),
    SecurityInventoryItem("tokenizer files", "project tokenizer directory", "medium", "project ownership checks", ("tampering", "disclosure"), "hash/sign manifests", "tokenizers", "verify before trusted reuse"),
    SecurityInventoryItem("model weights", "model artifacts/checkpoints", "high", "hash inventory", ("theft", "tampering", "malicious serialization"), "signature verification and safe loading policy", "models", "signed manifest migration"),
    SecurityInventoryItem("checkpoints", "runs/checkpoints", "high", "trusted torch.load path", ("pickle execution", "replacement"), "signature before loading; legacy opt-in", "checkpoints", "strict mode rejects unsigned"),
    SecurityInventoryItem("run metadata", "workspace run.json/events", "medium", "local workspace", ("metadata disclosure", "tampering"), "encrypted writes for sensitive fields", "web/training", "secure_write"),
    SecurityInventoryItem("evaluation reports", "workspace evaluations", "medium", "local workspace", ("report disclosure", "tampering"), "hash/sign optional encryption", "evaluation", "secure_write"),
    SecurityInventoryItem("generation histories", "workspace generations", "high", "bounded local history", ("prompt leakage", "session theft"), "encrypt by policy", "web/generation", "secure_write"),
    SecurityInventoryItem("Agent sessions", "in-memory/serialized sessions", "high", "bounded JSON", ("prompt leakage", "tool leakage"), "redaction and encryption at rest", "agents", "secure_write"),
    SecurityInventoryItem("tool calls/results", "agent trace/session", "high", "schema validation", ("secret leakage", "privilege escalation"), "permission policy, approval, redaction", "agents", "secure_write"),
    SecurityInventoryItem("external credentials", "environment/user config", "critical", "not managed centrally", ("secret leakage", "credential theft"), "secret providers and redaction", "integrations", "never store in workspace"),
    SecurityInventoryItem("plugin packages", "plugin locations", "high", "protocol only", ("dependency compromise", "arbitrary registration"), "future plugin signing and policy", "plugins", "planned"),
]

THREAT_MODEL = [
    ThreatModelItem("Path traversal", ("datasets", "artifacts"), "file/path inputs", "medium", "high", "resolve-under-root validation", "symlink races remain platform-specific", ("path traversal tests",)),
    ThreatModelItem("Checkpoint replacement", ("checkpoints", "model weights"), "workspace files", "medium", "high", "signed manifests and verified hashes", "legacy unsigned artifacts require explicit policy", ("signature tamper tests",)),
    ThreatModelItem("Untrusted pickle loading", ("checkpoints", "model artifacts"), "torch.load", "medium", "critical", "safe loading policy rejects untrusted pickle by default", "trusted legacy mode still dangerous", ("secure load policy tests",)),
    ThreatModelItem("Secret leakage", ("credentials", "agent traces", "logs"), "errors/traces/reports", "medium", "high", "redaction helpers and safe error payloads", "new subsystems must opt in", ("canary redaction tests",)),
    ThreatModelItem("SSRF", ("network", "metadata"), "web/agent URL inputs", "medium", "high", "HTTP(S) allowlist and private-address blocking", "DNS rebinding needs runtime care", ("URL safety tests",)),
    ThreatModelItem("Weak keys", ("encrypted artifacts",), "key providers", "low", "critical", "validated key length and Argon2id/HKDF", "Python cannot guarantee zeroization", ("key validation tests",)),
    ThreatModelItem("Nonce reuse", ("encrypted artifacts",), "encryption", "low", "critical", "CSPRNG nonces per operation", "collision probability is nonzero but negligible", ("nonce uniqueness tests",)),
    ThreatModelItem("Remote Web exposure", ("workspace", "sessions"), "Web API host/CORS", "medium", "high", "local default; remote_secure requires TLS policy", "authentication is a boundary not full production auth", ("web security policy tests",)),
    ThreatModelItem("Prompt injection through content", ("agent sessions", "tool results"), "documents/webpages", "high", "medium", "tool permissions, result bounds, redaction", "models may still follow malicious content", ("agent security tests",)),
]


def security_inventory() -> list[SecurityInventoryItem]:
    return list(SECURITY_INVENTORY)


def threat_model() -> list[ThreatModelItem]:
    return list(THREAT_MODEL)
