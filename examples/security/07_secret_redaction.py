"""Redact synthetic canary secrets."""

from arclm.security import redact_mapping, redact_sensitive_text


print(redact_sensitive_text("Authorization: Bearer abc.def.ghi"))
print(redact_mapping({"api_key": "demo-secret", "nested": {"password": "demo"}}))
