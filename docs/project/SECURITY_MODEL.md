# ArcLM Security Model

This is a scope model, not a guarantee that ArcLM is secure.

## Boundaries

- Local library code runs with the user's Python process permissions.
- Remote execution, production servers, agents, browser automation, and tool use are not stable features yet.
- The modern Web UI is a local developer interface. Web Milestone 1 Features
  4-6 use a thin read-only ArcLM Web API around existing Python APIs, not shell
  command execution. Web Milestone 2 Feature 4 adds loopback-only dataset
  source configuration writes.
- Community core should avoid hidden network access and hidden external tool calls.
- Pro/server features need explicit authentication, authorization, logging, rate limits, and isolation.

## Current Security-Relevant Code

- PII helper: `src/arclm/preprocess/pii.py`.
- Lightweight toxicity helper: `src/arclm/preprocess/toxicity.py`.
- Dataset/config validation exists in parts of the library.
- Checkpoint loaders inspect training checkpoints, and final model artifacts now
  include SHA-256 file inventory validation. There is no digital signature or
  authorship verification yet.

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
| Model artifacts | Implemented for local final artifacts | Digital signatures, PEFT artifacts, cloud provenance, and export-format trust policies |
| Untrusted datasets | Partially implemented | Schema validation and scanning docs |
| Plugins/tools | Interface only/Not implemented | Permissions, sandbox, audit log |
| Code execution | Not implemented | Explicit sandbox and resource limits |
| Browser automation | Not implemented | Permission and isolation model |
| Local Web UI | Partially implemented | Local-only defaults, read-only endpoints, Simple/Advanced dashboards, and loopback-only Dataset Source Manager exist; workflow execution and production hardening remain later |
| MCP tools | Not implemented | Tool registry, permissions, audit |
| Rate limiting | Not implemented | Server middleware |
| Audit logs | Not implemented | Server/enterprise event model |
| Enterprise isolation | Not implemented | Tenant/workspace boundary |

## Security Acceptance Rules

- Security claims need tests.
- Security features must state what they do not protect against.
- Enterprise controls belong in the server/Pro boundary, not in local training loops.

## Core Artifact Trust Boundary

Training checkpoints use trusted PyTorch loading for full-state resume. That is
needed for optimizer, scheduler, scaler, RNG, and training-state restoration.
Core Milestone 1 / Feature 2 adds versioned checkpoint metadata and validation,
but it does not make arbitrary `.pt` files safe.

The implemented policy is:

- ArcLM training checkpoints use
  `checkpoint_format="arclm-training-checkpoint"` and `checkpoint_version=1`.
- `inspect_checkpoint()` and `validate_checkpoint()` are metadata tools for
  trusted ArcLM/PyTorch checkpoint files.
- Legacy ArcLM checkpoints are accepted only through the known compatibility
  shape.
- Unsupported future checkpoint versions are rejected before restoration.
- No checksum, digital signature, or key management is implemented yet.

Do not switch every checkpoint load to restricted weights-only loading without a
compatibility plan for resume state.

## Final Model Artifact Trust Boundary

Core Milestone 1 / Feature 3 adds final model artifacts for evaluation,
inference, sharing, export, and future fine-tuning. They are separate from
training checkpoints.

Implemented policy:

- Final artifacts use `artifact_format="arclm-model-artifact"` and
  `artifact_version=1`.
- The manifest is `manifest.json` and contains only JSON-safe metadata.
- Payload paths must be relative, must not traverse outside the artifact, and
  must not be symlinks.
- Payload files are recorded with size and SHA-256 hash.
- Validation checks required files, safe paths, sizes, and hashes before model
  reconstruction.
- Artifact weights are state dictionaries and are loaded with restricted
  `weights_only=True` where the installed PyTorch supports it.
- ArcLM does not pickle arbitrary `torch.nn.Module` objects.
- ArcLM does not store Python import paths, `eval`, `exec`, environment
  variables, credentials, optimizer state, scheduler state, scaler state, RNG
  state, or dataset contents in final artifacts.
- Hugging Face loading is optional, local-files-only, and `trust_remote_code` is
  false by default.

SHA-256 hashes detect file changes. They do not prove who created the artifact.

## Hyperparameter Search Metadata Boundary

Core Milestone 2 / Feature 6 adds local search manifests. They are metadata,
not executable code.

Implemented policy:

- Search definitions use typed parameter definitions and an allowlist of
  approved config paths.
- Search does not serialize model factories, tokenizer factories, callables,
  Python import paths, `eval`, or `exec`.
- Search rejects non-finite parameter values, unknown paths, unsafe search
  roots, path traversal in run references, duplicate trial IDs, duplicate trial
  fingerprints, and malformed JSON records.
- Search stores run references and bounded objective summaries. It does not
  copy model weights, checkpoint payloads, adapter artifacts, final model
  artifacts, raw datasets, prompts, responses, external tracking credentials,
  or environment variables.
- Inspection and validation do not load models, checkpoints, artifacts,
  datasets, optional model dependencies, CUDA, or user factories.

Best-config export writes the effective validated configuration selected by
the user. It may include user-provided output paths because those are part of
the runnable training configuration.
## Data Pipeline Studio Security Boundary

Status: Dataset Inspector Backend, read-only Dataset Inspector UI, and
loopback-only Dataset Source Manager are implemented. Dataset upload and
browser-triggered pipeline execution are not implemented.

Datasets are untrusted input. Features 2-4 use approved dataset roots, safe
dataset IDs, bounded previews, file/row/field limits, and plain-text rendering
before any future mutation or training handoff is allowed. The `/data` UI may
show configured source paths only inside the local Dataset Source Manager. It
must not accept arbitrary endpoint paths or request full datasets.

Rules:

- Accept absolute local folder paths only through the Dataset Source Manager.
- Do not deserialize Python objects such as pickle files.
- Do not extract archives until path traversal and size controls are designed.
- Do not download remote datasets by default.
- Do not log raw dataset rows by default.
- Do not expose usernames, home directories, environment variables, or `.env`
  values in API responses.
- Keep upload, storage, execution, and training handoff as separate approved
  features.
- Disable source-management mutation when the backend is bound to a
  non-loopback host.
- Removing a dataset source must never delete the folder or files.

See [../web/dataset-upload-security.md](../web/dataset-upload-security.md).

## Fine-Tuning Data Boundary

Core Milestone 2 / Feature 1 treats fine-tuning datasets as untrusted input.

Rules:

- Do not use `eval` or `exec` for formatters.
- Do not serialize Python callables in `FineTuningConfig`.
- Do not store raw prompts, responses, or chat messages in dataset reports.
- Bound validation errors with `max_report_errors`.
- Reject malformed chat roles and empty trainable responses.
- Keep Hugging Face and PEFT behavior optional and explicit.
- Save final fine-tuned models as model artifacts, not training checkpoints.
- Do not copy optimizer, scheduler, scaler, RNG, or raw dataset records into
  final artifacts.

## PEFT Adapter Artifact Boundary

Core Milestone 2 / Feature 2 adds local LoRA adapter artifacts.

Rules:

- Adapter artifacts use `artifact_format="arclm-peft-adapter"` and
  `artifact_version=1`.
- Adapter payload files must use safe relative paths and must not be symlinks.
- Validation checks manifest format, version, file size, and SHA-256 hashes.
- Adapter manifests do not contain Python import paths, callables, optimizer
  state, scheduler state, scaler state, RNG state, dataset contents, prompts,
  secrets, or environment variables.
- Adapter loading requires a caller-supplied compatible base model.
- Wrong base-model structure is rejected before adapter weights are loaded into
  the runtime model.
- Built-in LoRA does not import the external `peft` package or contact the
  network.

## Quantization Runtime Boundary

Core Milestone 2 / Feature 4 keeps QLoRA validation local and explicit.

Rules:

- Tiny Hugging Face fixtures are created locally; no model download is used.
- Quantized loading requires a local folder.
- Missing bitsandbytes is reported as a pending optional runtime gate, not as a
  successful QLoRA runtime pass.
- ArcLM does not enable `trust_remote_code` by default.
- ArcLM does not use `eval`, `exec`, arbitrary import strings, shell commands,
  or hidden network access for QLoRA validation.

## Run Manifest Security

Core Milestone 2 / Feature 5 treats run metadata as local but still sensitive.

The local tracker:

- redacts path-like config fields
- stores references by safe file name and fingerprint instead of absolute path
- avoids usernames, hostnames, environment variables, raw prompts, raw
  completions, raw datasets, and credentials
- writes `manifest.json` atomically
- uses append-only JSONL for metrics and events
- rejects non-finite metrics and callable metadata
- uses a local lock file to avoid two writers for one run
- imports MLflow/W&B only when an explicit legacy backend requests them

Run manifests are not a secure audit log or signed evidence system. They are
local reproducibility metadata.
- Runtime environment reports exclude environment variables, usernames,
  hostnames, absolute project paths, access tokens, and dataset contents.
