# ArcLM Security Examples

Run from the project root:

```bash
python examples/security/01_encrypt_json.py
```

All examples use synthetic data, temporary directories, and local keys. They do
not use real secrets, downloads, or network access.

- `01_encrypt_json.py`: encrypt/decrypt JSON and reject tampering.
- `02_password_protected_data.py`: derive a key with Argon2id and decrypt with the same password.
- `03_encrypted_artifact_store.py`: write/read encrypted JSON through the artifact store.
- `04_sign_and_verify_manifest.py`: sign a synthetic artifact manifest and verify it.
- `05_verify_model_artifact.py`: verify manifest file hashes for a tiny synthetic model artifact.
- `06_secure_checkpoint_loading.py`: show untrusted Pickle blocked by default.
- `07_secret_redaction.py`: redact synthetic canary secrets.
- `08_agent_security_tools.py`: use defensive security tools from the Agent Runtime.
- `09_security_status.py`: print the safe security status report.
