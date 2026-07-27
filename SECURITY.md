# ArcLM Security

ArcLM Security Core is the framework's security-by-default foundation. It is
designed around:

```text
Secure by default
Explicit when sensitive
Fail closed
No silent downgrade
```

## Supported Versions

This private/special ArcLM tree documents the current development line only.
Use the repository owner's release policy for public support windows.

## Reporting Vulnerabilities

Do not publish secrets, exploit details, private datasets, model weights, API
tokens, or private workspace paths in a public issue. Use the project owner's
configured private reporting channel. If no channel is configured yet, use:

```text
SECURITY-CONTACT-NOT-CONFIGURED
```

Include:

- affected ArcLM version or commit;
- operating system and Python version;
- concise reproduction steps;
- whether data, credentials, model weights, or checkpoints may be exposed;
- logs with secrets redacted.

Response times are not guaranteed in this private development repository.

## Architecture Overview

`arclm.security` provides:

- typed security policies and capability reporting;
- AEAD encryption envelopes using `cryptography`;
- Argon2id password-derived keys and HKDF subkeys;
- in-memory and password-derived key providers;
- hash helpers with SHA-256/SHA-512 allowlists;
- Ed25519 signed artifact manifests;
- envelope-encrypted artifact storage with per-artifact data keys and atomic writes;
- secure model/checkpoint loading policy gates;
- redaction helpers;
- safe audit inventory and threat-model objects;
- Web Studio transport/CORS/CSRF/security-header policy helpers;
- defensive Agent Runtime security tools.

Security crypto is an explicit optional dependency: install
`arclm[security]`. If encryption/signing is requested without the dependency,
the operation fails closed and does not write plaintext as a fallback.

## Threat Model Scope

The first Security Core phase addresses local workspace theft, dataset
disclosure, checkpoint tampering, untrusted pickle loading, path traversal,
SSRF boundaries, secret leakage through traces/logs, weak key handling, nonce
reuse, and remote Web Studio exposure.

It does not claim complete production authentication, external KMS support,
cloud deployment hardening, malware sandboxing, browser automation security, or
independent security certification.

## Secure Deployment Guidance

- Keep Web Studio bound to `127.0.0.1`; non-loopback Web API binding is blocked
  until a later deployment layer provides TLS, authentication, authorization,
  and explicit origin policy.
- Treat PyTorch/Pickle checkpoints as trusted legacy artifacts only.
- Require signed manifests before trusted model or checkpoint loading in strict
  secure workflows.
- Keep key-encryption keys outside the workspace.
- Do not store API keys or passwords in `workspace/`, run metadata, README
  files, logs, traces, or Git.
- Use synthetic test secrets to verify redaction before handling real secrets.

## Key Management

ArcLM can create ephemeral in-memory keys for tests and local examples. Password
keys use Argon2id and store only non-secret KDF metadata. Python cannot
guarantee complete memory zeroization of all secret copies.

## Model-Loading Policy

Untrusted Pickle and remote model code are rejected by default. Legacy trusted
loading remains available only through explicit policy choices in the existing
checkpoint APIs.

## Known Limitations

- Large artifact encryption currently fails safely unless the artifact fits the
  small AEAD backend limit.
- Streaming AEAD and OS keyring/KMS integrations are planned boundaries, not
  implemented production features.
- Web authentication and authorization are represented as policy boundaries,
  not a complete auth system.
