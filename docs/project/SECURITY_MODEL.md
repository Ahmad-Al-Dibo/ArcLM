# ArcLM Security Model

This is a scope model, not a guarantee that ArcLM is secure.

## Boundaries

- Local library code runs with the user's Python process permissions.
- Remote execution, production servers, agents, browser automation, and tool use are not stable features yet.
- The modern Web UI is a local developer interface. Features 4-6 use a thin read-only ArcLM Web API around existing Python APIs, not shell command execution.
- Community core should avoid hidden network access and hidden external tool calls.
- Pro/server features need explicit authentication, authorization, logging, rate limits, and isolation.

## Current Security-Relevant Code

- PII helper: `src/arclm/preprocess/pii.py`.
- Lightweight toxicity helper: `src/arclm/preprocess/toxicity.py`.
- Dataset/config validation exists in parts of the library.
- Checkpoint loaders inspect some artifacts, but there is no cryptographic artifact verification.

## Planned Rules

- No API keys in logs.
- No raw PII in logs by default.
- No raw prompts or full model responses in high-frequency logs by default.
- No automatic code execution.
- No automatic browser access.
- No automatic external tool access.
- No secrets, API keys, raw `.env` values, or full local environment dumps in Web API responses.
- No training, evaluation, inference, or dataset actions from the browser without explicit user action.
- Advanced Dashboard inspectors may show only already-loaded approved API responses and must not accept arbitrary URLs or file paths.
- Web API defaults bind locally unless a later serving/security milestone approves broader network exposure.
- Optional cloud/provider integrations must require explicit user configuration.
- Untrusted datasets should be treated as data, not code.
- Untrusted plugins require permissions, sandboxing, audit events, and clear schemas before stable release.
- Private hidden chain-of-thought must not be exposed or stored. Support only user-visible summaries or structured outputs intended for the application.

## Threat Areas

| Area | Current Status | Required Before Stable |
| ---- | -------------- | ---------------------- |
| Prompt injection | Not implemented | Detection/evaluation policy, tests |
| PII | Partially implemented | Wider detectors, tests, docs |
| Secrets | Not implemented | Redaction and secret source policy |
| Model artifacts | Partially implemented | Checksums/signatures and safe loading policy |
| Untrusted datasets | Partially implemented | Schema validation and scanning docs |
| Plugins/tools | Interface only/Not implemented | Permissions, sandbox, audit log |
| Code execution | Not implemented | Explicit sandbox and resource limits |
| Browser automation | Not implemented | Permission and isolation model |
| Local Web UI | Partially implemented | Local-only defaults, read-only endpoints, Simple Dashboard, and Advanced Dashboard exist; workflow pages and production hardening remain later |
| MCP tools | Not implemented | Tool registry, permissions, audit |
| Rate limiting | Not implemented | Server middleware |
| Audit logs | Not implemented | Server/enterprise event model |
| Enterprise isolation | Not implemented | Tenant/workspace boundary |

## Security Acceptance Rules

- Security claims need tests.
- Security features must state what they do not protect against.
- Enterprise controls belong in the server/Pro boundary, not in local training loops.
## Data Pipeline Studio Security Boundary

Status: Dataset Inspector Backend implemented. Dataset upload and
browser-triggered pipeline execution are not implemented.

Datasets are untrusted input. Feature 2 uses server-configured dataset roots,
safe dataset IDs, bounded previews, and file/row/field limits before any future
mutation or training handoff is allowed.

Rules:

- Do not accept arbitrary absolute paths from the browser.
- Do not deserialize Python objects such as pickle files.
- Do not extract archives until path traversal and size controls are designed.
- Do not download remote datasets by default.
- Do not log raw dataset rows by default.
- Do not expose usernames, home directories, environment variables, or `.env`
  values in API responses.
- Keep upload, storage, execution, and training handoff as separate approved
  features.

See [../web/dataset-upload-security.md](../web/dataset-upload-security.md).
