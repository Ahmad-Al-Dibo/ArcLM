"""Sensitive-value redaction helpers."""

from __future__ import annotations

import re
from typing import Any


REDACTION = "[REDACTED]"
SENSITIVE_KEYS = {
    "api_key",
    "apikey",
    "authorization",
    "bearer",
    "cookie",
    "encryption_key",
    "key",
    "password",
    "private_key",
    "secret",
    "session_cookie",
    "token",
}

_PATTERNS = [
    re.compile(r"(?i)authorization\s*:\s*bearer\s+[A-Za-z0-9._~+/=-]+"),
    re.compile(r"(?i)(api[_-]?key|token|password|secret)\s*[:=]\s*([^\s,;]+)"),
    re.compile(r"(?i)bearer\s+[A-Za-z0-9._~+/=-]+"),
    re.compile(r"-----BEGIN (?:[A-Z ]*PRIVATE KEY)-----.*?-----END (?:[A-Z ]*PRIVATE KEY)-----", re.DOTALL),
]


def redact_sensitive_text(text: str) -> str:
    """Redact common secret patterns from text."""

    value = str(text)
    for pattern in _PATTERNS:
        if pattern.pattern.lower().startswith("(?i)authorization"):
            value = pattern.sub("Authorization: Bearer " + REDACTION, value)
        elif pattern.pattern.lower().startswith("(?i)bearer"):
            value = pattern.sub("Bearer " + REDACTION, value)
        elif "PRIVATE KEY" in pattern.pattern:
            value = pattern.sub(REDACTION, value)
        else:
            value = pattern.sub(lambda match: f"{match.group(1)}={REDACTION}", value)
    return value


def redact_mapping(value: Any) -> Any:
    """Recursively redact sensitive mapping values."""

    if isinstance(value, dict):
        result: dict[str, Any] = {}
        for key, item in value.items():
            key_text = str(key)
            if key_text.lower().replace("-", "_") in SENSITIVE_KEYS or any(word in key_text.lower() for word in SENSITIVE_KEYS):
                result[key_text] = REDACTION
            else:
                result[key_text] = redact_mapping(item)
        return result
    if isinstance(value, list):
        return [redact_mapping(item) for item in value]
    if isinstance(value, tuple):
        return tuple(redact_mapping(item) for item in value)
    if isinstance(value, str):
        return redact_sensitive_text(value)
    return value
