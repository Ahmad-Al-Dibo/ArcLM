# Project 06: Secure Local AI Workspace

Goal: combine encrypted metadata, signed manifests, safe loading policy, and
redacted Agent traces.

Command:

```powershell
python examples/12_complete_projects/06_secure_local_ai_workspace/main.py
```

Expected behavior: prints a security report when `arclm[security]` is
installed.

Generated files: temporary encrypted metadata and manifest files.

Tests: optional/manual unless security dependencies are installed.

Limitations: no KMS, OS keyring, or streaming AEAD backend.

Cleanup: temporary files are removed automatically.

Replace tiny components with an external key provider and signed real local
artifacts when those integrations are implemented.

