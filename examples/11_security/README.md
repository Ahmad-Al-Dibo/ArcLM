# 11 Security

Purpose: demonstrate ArcLM Security Core with synthetic data only.

Prerequisites: `pip install -e ".[security]"` for crypto examples.

Concepts: capability status, AEAD JSON encryption, tamper rejection, hashing,
signed manifests, secure loading policy, redaction, and Agent security tools.

Examples in order:
- `01_security_status.py`
- `02_encrypt_hash_sign_redact.py`

Installation requirements: `arclm[security]` for encryption/signing.

Commands:

```powershell
python examples/11_security/01_security_status.py
python examples/11_security/02_encrypt_hash_sign_redact.py
```

Expected outputs: safe reports without keys, passwords, or absolute workspace
paths.

Verification status: automated in the security-enabled test environment.

Current limitations: no KMS, OS keyring, or streaming AEAD backend is included.

Related ArcLM APIs: `security_status`, `encrypt_json`, `hash_file`,
`sign_manifest`, `SecureArtifactLoader`.

Next category: `12_complete_projects`.

