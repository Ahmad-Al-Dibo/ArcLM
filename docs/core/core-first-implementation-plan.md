# Core-First Implementation Plan

This plan turns the long-term ArcLM capability map into an implementation order.
It keeps the Web track paused until the Python framework has enough stable
Core APIs, runtime contracts, and validation evidence to support a serious Web
product.

`docs/project/PROJECT_MAP.md` remains the source of truth. This document is the
recommended execution plan for the Core track.

## Current State

Implemented and verified:

- model lifecycle and configuration contract
- hardened training checkpoints and reproducibility metadata
- final model artifacts
- full fine-tuning and SFT stabilization
- built-in LoRA and adapter artifacts
- QLoRA configuration and quantization boundary
- Hugging Face and QLoRA runtime validation matrix
- local run manifests
- local sequential hyperparameter search

Paused:

- Web Track after Web Milestone 2 / Feature 4: Dataset Source Manager
- next previous Web feature: Approved Pipeline Step Registry
- Web approval: not granted

Still pending:

- real bitsandbytes QLoRA runtime validation
- distributed runtime
- DDP/FSDP
- robust inference generation
- architecture registry and more native architecture families
- Core data manifests/versioning/token analysis
- serving, export, deployment, retrieval, agents, multimodal, enterprise

## Planning Rules

Each feature must still be implemented one at a time:

```text
inspect existing code
-> define measurable success criteria
-> run baseline tests
-> implement the smallest complete capability
-> add focused tests
-> run regression tests
-> perform runtime validation
-> update docs and PROJECT_MAP.md
-> stop for owner approval
```

Do not resume Web product features until the Web Reactivation Gate in this plan
is satisfied and the owner explicitly approves Web work again.

## Core Priority Order

### Phase 1: Distributed Runtime Foundation

Goal: prepare safe process and hardware contracts before DDP/FSDP.

1. Core Milestone 3 / Feature 1: Distributed Runtime and Process Abstraction - Complete
2. Core Milestone 3 / Feature 2: Distributed Config Validation
3. Core Milestone 3 / Feature 3: CPU Process-Group Runtime Tests
4. Core Milestone 3 / Feature 4: Single-GPU Distributed Smoke Boundary
5. Core Milestone 3 / Feature 5: External Multi-GPU Validation Matrix

Acceptance:

- no multi-GPU claims from one GPU
- process-group lifecycle tested after Feature 3
- rank/world-size handling tested first through Feature 1 config/env parsing
- unsupported hardware errors are clear
- cloud validation commands documented

### Phase 2: DDP and Multi-GPU Training

Goal: make real multi-GPU training a tested Core capability.

1. DDP trainer integration
2. distributed sampler integration
3. gradient synchronization validation
4. distributed checkpoint save/resume
5. multi-GPU mixed precision validation
6. failure and cleanup behavior

Acceptance:

- at least two real CUDA GPUs validate DDP
- CPU simulation is documented as simulation only
- checkpoint/resume works with new model and optimizer objects
- search/tracking can record distributed run metadata

### Phase 3: FSDP Foundation

Goal: add sharded training only after DDP contracts are stable.

1. FSDP config and capability checks
2. FSDP model wrapping boundary
3. sharded checkpoint policy
4. optimizer-state handling
5. resume and artifact handoff
6. external hardware validation

Acceptance:

- FSDP is never claimed from CPU-only or single-GPU evidence
- sharded checkpoint limitations are documented
- unsupported models fail clearly

### Phase 4: Inference and Generation Core

Goal: make local inference strong enough for CLI, future Web, and later serving.

1. generation config contract
2. decoding strategies: greedy, temperature, top-k, top-p
3. batch inference
4. streaming generation API
5. adapter-aware loading for final artifacts and PEFT adapters
6. no-grad/device/precision guarantees
7. inference CLI stabilization

Acceptance:

- CPU inference runtime verified
- CUDA inference runtime verified where available
- no hidden downloads
- streaming yields incremental tokens
- public API and CLI behavior match docs

### Phase 5: Architecture Registry and Model Families

Goal: stop overloading generic loaders and make architecture support explicit.

1. architecture registry contract
2. native GPT-family metadata hardening
3. custom PyTorch architecture registration
4. Hugging Face architecture adapter matrix
5. encoder-only baseline
6. encoder-decoder baseline
7. LLaMA/Mistral support decision
8. architecture report and compatibility docs

Acceptance:

- every architecture has an evidence status
- native versus external support is clear
- training, artifact, evaluation, and inference support are tested per family

### Phase 6: Core Data Platform

Goal: implement Python data features before more visual data tooling.

1. dataset manifests
2. dataset versioning
3. dataset fingerprinting and provenance
4. dataset splitting
5. schema validation
6. token-length analysis
7. vocabulary analysis
8. truncation analysis
9. duplicate analysis reports
10. processed dataset storage
11. training handoff contract

Acceptance:

- usable from Python and CLI without Web
- no raw private records in run/search/artifact metadata
- deterministic fingerprints and manifests
- future Web Data Pipeline Studio can call these APIs directly

### Phase 7: Evaluation and Benchmarking Core

Goal: make model comparison real before dashboards.

1. evaluation dataset contract
2. generation-quality evaluation
3. benchmark result manifests
4. model comparison reports
5. MMLU/GSM8K optional benchmark gates
6. task-specific metric adapters
7. evaluation CLI stabilization

Acceptance:

- benchmarks are optional and offline-safe by default
- missing datasets do not trigger downloads
- comparison reports are reproducible and bounded

### Phase 8: Optimization and Export

Goal: make export and optimization evidence-based.

1. adapter merge/export hardening
2. Hugging Face export
3. ONNX export
4. GGUF export planning and validation
5. INT8/INT4 inference quantization boundary
6. `torch.compile` capability gate
7. Flash Attention/xFormers capability gates

Acceptance:

- each export creates a loadable artifact or is marked pending
- acceleration features require real hardware/backend validation
- no unsupported optimization is reported as passed

### Phase 9: Local Serving Foundation

Goal: create serving APIs only after inference and artifacts are stable.

1. local model-server config
2. health/readiness endpoints
3. request validation
4. text-generation endpoint
5. streaming response endpoint
6. OpenAI-compatible API planning
7. model lifecycle management
8. serving security baseline

Acceptance:

- no Web dashboard controls are required
- server loads local artifacts only by explicit configuration
- request/response schemas are stable
- no production/cloud claims yet

### Phase 10: Observability and Diagnostics

Goal: collect useful local runtime evidence without leaking private data.

1. hardware capability reports
2. training speed metrics
3. tokens/sec and samples/sec
4. memory profiling hooks
5. data-loading profiling
6. bounded diagnostic reports
7. cost-estimation planning

Acceptance:

- no raw prompts, responses, datasets, secrets, or environment dumps
- monitoring data is available to Python/CLI first
- future dashboards consume the same Core contracts

### Phase 11: Security and Safety Core

Goal: strengthen local safety before cloud, agents, or enterprise.

1. secret detection
2. PII detection expansion
3. sensitive-data filtering
4. prompt-injection evaluation utilities
5. artifact trust policy expansion
6. plugin permission model
7. local audit-event contract

Acceptance:

- every security claim has tests
- no hidden chain-of-thought exposure
- plugin/tool execution remains blocked until permissions exist

### Phase 12: Retrieval, Agents, and Multimodal Planning

Goal: plan advanced product domains after training/inference/data are stable.

1. embeddings and retriever interface audit
2. local vector index prototype
3. RAG pipeline contract
4. tool schema contract
5. agent runtime security plan
6. multimodal dependency and architecture audit

Acceptance:

- no agent execution without sandbox and permissions
- no vector database dependency becomes required core
- multimodal features stay optional and evidence-based

## Web Reactivation Gate

Resume Web implementation only after these Core contracts are implemented and
verified:

- stable training/fine-tuning/search/run manifest APIs
- stable data manifests and processed dataset storage
- stable inference/generation API
- stable evaluation report API
- stable artifact/model loading API
- local serving or local Web API schema for read/write actions
- security model for browser-triggered filesystem and training actions
- clear Community/Pro split for dashboards, serving, and team features

The next Web track should then resume with:

```text
Web Milestone 2 / Feature 5:
Approved Pipeline Step Registry
```

but only if it uses the Core data-pipeline contracts from Phase 6.

## Product Split

Community should keep:

- local model/data/training/evaluation/inference workflows
- checkpoints, artifacts, run manifests, search manifests
- local CLI and Python APIs
- basic optional local Web status and inspection UI

Pro or future Shared Core should handle:

- distributed training operations
- production QLoRA automation
- high-performance serving
- external tracking providers
- cloud deployment
- advanced dashboards
- team workspaces, auth, RBAC, audit, billing, license controls

ArcLM Community must never import ArcLM Pro.

## Immediate Next Recommendation

The next implementation feature remains:

```text
Core Milestone 3 / Feature 1:
Distributed Runtime and Process Abstraction
```

This is not approved automatically. It should be approved and implemented as a
single feature before DDP or FSDP work begins.

Status: implemented and verified. `arclm.distributed` now provides
`DistributedConfig`, safe environment parsing, runtime inspection, backend
availability checks, device resolution, and launcher environment creation
without starting a process group.

The next recommended action is Core Milestone 3 / Feature 2: Distributed Config
Validation. It is not approved automatically.
