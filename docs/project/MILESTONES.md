# ArcLM Milestones

Milestones are dependency-based, not calendar estimates. Each milestone must preserve existing behavior unless a failing test proves a change is needed.

## Current Track State

```text
Web Track:
Paused after Web Milestone 2 / Feature 4 - Dataset Source Manager

Next previously planned Web feature:
Approved Pipeline Step Registry

Web approval:
Not granted

Core Track:
Active

Last completed Core action:
Core Milestone 2 / Feature 4:
Hugging Face and QLoRA Runtime Validation Matrix

Next recommended Core action:
Core Milestone 2 / Feature 5:
Experiment Tracking and Reproducible Run Manifests

Approval:
Not granted
```

Core Milestone 1 Features 1, 2, and 3 are implemented. Core Milestone 2 /
Features 1 through 4 are implemented. The next recommended
implementation feature is not approved automatically:

```text
Core Milestone 2 / Feature 5:
Experiment Tracking and Reproducible Run Manifests
```

## Core Milestone 1: Model Lifecycle and Configuration Foundation

- Status: Complete; Features 1, 2, and 3 implemented and verified.
- Goal: define one backward-compatible contract for model sources, model
  configuration, tokenizer metadata, training checkpoints, inference artifacts,
  and external model adapters.
- User value: developers can reliably save, inspect, load, resume, evaluate, and
  infer with native ArcLM models, standard PyTorch models, and optional external
  sources.
- Product: Community with Shared Core optional adapters.
- Dependencies: Core Re-baseline and API Audit.
- Included: stable model source types, model/tokenizer metadata, artifact
  manifest, checkpoint kind distinction, optional dependency errors,
  compatibility tests, and CPU runtime validation.
- Excluded: LoRA, PEFT, QLoRA, DDP, FSDP, serving, export, new native
  architectures, and Web features.
- Acceptance criteria: public imports stay compatible; native save/inspect/load,
  checkpoint resume, evaluation, and inference pass CPU runtime tests; optional
  HF paths fail clearly when dependencies are absent; docs explain the contract.
- Complexity: Large.

Feature progress:

| Feature | Status | Evidence |
| ------- | ------ | -------- |
| Feature 1: Model Lifecycle and Configuration Contract | Complete | `arclm.lifecycle`, checkpoint `lifecycle_metadata`, config loading from model sources, lifecycle tests |
| Feature 2: Checkpoint Hardening and Reproducibility Metadata | Complete | `CheckpointInfo`, `inspect_checkpoint`, `validate_checkpoint`, format/version metadata, RNG state, atomic writes, legacy compatibility, deterministic resume tests |
| Feature 3: Final Model Artifact Save and Load | Complete | `save_model_artifact`, `load_model_artifact`, `validate_model_artifact`, `manifest.json`, SHA-256 inventory, native CPU round trip, evaluation/inference compatibility |

## Milestone 0: Repository Stabilization and Documentation Accuracy

- Goal: make the current repository state trustworthy before new features.
- User value: users and future agents know what is stable.
- Product: Community.
- Dependencies: none.
- Included: normalize `src/` migration state, update stale README/status claims, keep full pytest green, verify package build.
- Excluded: new features.
- Public APIs: unchanged.
- Package changes: none unless packaging tests expose breakage.
- Optional dependencies: none.
- Compatibility impact: compatibility shims stay.
- Security: no new surface.
- Tests: full pytest, compileall, import checks, build check.
- Runtime validation: CPU core suite.
- Documentation: status docs and project map.
- Migration: document old/new APIs.
- Risks: dirty tree may hide packaging issues.
- Rollback: revert only documentation edits from the milestone if needed.
- Acceptance criteria: full suite passes, build passes, README no longer overclaims, project map updated.
- Complexity: Medium.

Execution note:

- Milestone 0 baseline passed with `187 passed, 2 skipped, 38 warnings`.
- `compileall src/arclm` passed.
- Public import checks passed for the stable domain APIs.
- `pip wheel . --no-deps` passed.
- `python -m build` was not available because the active venv lacks the optional `build` package.
- README was updated to reflect the current validated Torch CPU environment and planned status of advanced features.
- Milestone 0 is complete with two documented blockers that require owner/environment action: git normalization and direct `python -m build` availability.

## Milestone 1: CLI and Public API Stabilization

- Status: Complete in the current workspace; waiting for approval before Milestone 2.
- Post-milestone validation: local single-GPU CUDA validation completed on GTX 1050 Ti; this did not start a new product milestone.
- Goal: make CLI and public imports match the stable Python APIs.
- User value: command-line workflows work for basic local use.
- Product: Community.
- Dependencies: Milestone 0.
- Included: CLI train/eval/generate smoke tests, public import table, duplicated API docs.
- Excluded: dashboards, serving, new training features.
- Public APIs: no removals.
- Package changes: none expected.
- Optional dependencies: none for default CLI.
- Compatibility impact: old paths tested.
- Security: CLI validates paths and arguments.
- Tests: CLI help plus tiny train/eval/generate smoke tests.
- Runtime validation: CPU-only.
- Documentation: CLI and migration docs.
- Migration: clarify `TrainingConfig` and `ModelAdapter`.
- Risks: old CLI paths may be stale.
- Rollback: keep Python APIs and disable only broken CLI entry path if required.
- Acceptance criteria: CLI smoke tests pass and public imports are documented.
- Complexity: Medium.

## Web Milestone 1: Interface Foundation and Dashboards

- Status: Complete and locally verified. Web Milestone 2 is the next recommended direction but is not approved automatically.
- Goal: create the optional modern local Web UI foundation without changing stable Python APIs.
- User value: developers get a clear local dashboard with simple mode, advanced mode, environment status, and project overview.
- Product: Shared Core. The local shell and basic status view belong in Community; future operational dashboards may become Pro.
- Dependencies: Milestones 0-1, existing CLI/public API stability, existing ArcLM Python APIs.
- Included: frontend foundation, design system, application shell, navigation, simple/advanced switch, local ArcLM backend connection, health/environment/capability/project status, project overview, quick actions, responsive behavior, light/dark themes, accessibility foundation, frontend and backend tests.
- Excluded: Data Pipeline Studio, visual training dashboard, model registry, plugin management, marketplace, production serving, auth, cloud deployment, and new ML training features.
- Public APIs: optional web entry points only after tests prove them; existing `run_simple_interface` stays as compatibility/experimental.
- Package changes: optional frontend workspace and optional web backend dependencies only after the exact dependency decision is documented.
- Optional dependencies: frontend Node toolchain, FastAPI/Uvicorn for the local API, existing Flask compatibility path.
- Compatibility impact: `import arclm`, CLI train/eval/generate, and `arclm --run simple-interface` must keep working.
- Security: no secrets in API responses, no shell-command UI flow, no raw prompts/logs by default, local-only safe defaults, explicit CORS/host policy.
- Tests: frontend lint/type/build/unit checks, backend endpoint unit tests, public import checks, compatibility checks, and smoke tests for the app shell.
- Runtime validation: local CPU web development server and local API health/environment endpoints.
- Documentation: web architecture, local development, recommended/legacy interface paths, limitations, and future milestones.
- Migration: document old Flask simple interface as legacy/simple compatibility until a replacement is approved.
- Risks: frontend dependency sprawl, duplicate business logic, accessibility regressions, optional dependency import failures.
- Rollback: keep the web workspace optional and do not alter existing Python core behavior.
- Acceptance criteria: each Web Milestone 1 feature passes its focused checks, docs are current, project map is updated after each feature, and no later web milestone is implemented.
- Complexity: Large.

Feature progress:

| Feature | Status | Evidence |
| ------- | ------ | -------- |
| Feature 1: Frontend Foundation | Complete | `web/` workspace, root route, theme tokens, lint/typecheck/test/build passed |
| Feature 2: Design System | Complete | Source-owned UI components, `/design-system`, component tests, lint/typecheck/test/build passed |
| Feature 3: Application Shell | Complete | Shared shell, sidebar, mobile navigation, top bar, breadcrumbs, modes, route pages, tests, and production route smoke passed |
| Feature 4: ArcLM Local Web Backend | Complete | `arclm.web.create_app`, read-only endpoints, CORS, CLI launch, frontend API client, tests, and localhost smoke passed |
| Feature 5: Simple Dashboard | Complete | Root dashboard uses real Web API data, safe project-status fields, partial-failure states, quick actions, tests, and frontend-to-backend smoke |
| Feature 6: Advanced Dashboard | Complete | Advanced runtime details, hardware details, grouped capabilities, validation status, optional integrations, limitations, diagnostics, safe response inspector, tests, and frontend-to-backend smoke |

## Web Milestone 2: Data Pipeline Studio

- Status: Features 1-4 complete; track paused. Feature 5 was previously
  recommended but is not approved while Core is active.
- Goal: create a visual data pipeline workflow after the Web foundation is stable.
- Included later: visual pipeline graph, dataset preview, transformation steps, before/after comparison, cleaning/dedup/token stats, dry run, config editor, save/load, execution status.
- Excluded now: upload, preview UI, pipeline execution, training handoff, and any browser-triggered dataset mutation until separately approved.
- Dependencies: Web Milestone 1 and stable data pipeline APIs.
- Acceptance criteria: defined one feature at a time.
- Complexity: Large.

Feature progress:

| Feature | Status | Evidence |
| ------- | ------ | -------- |
| Feature 1: Data Pipeline Studio planning and API audit | Complete | `docs/web/data-pipeline-studio.md`, `docs/web/data-pipeline-api.md`, `docs/web/dataset-upload-security.md`, `docs/web/dataset-storage.md`, `docs/web/pipeline-events.md` |
| Feature 2: Dataset Inspector Backend | Complete | `DatasetRoot`, safe IDs, `GET /api/datasets`, `GET /api/datasets/{dataset_id}/inspection`, tests, and runtime smoke |
| Feature 3: Dataset Inspector UI | Complete | `/data` read-only inspector, typed dataset API client, safe URL selection, simple/advanced views, tests, and runtime smoke |
| Feature 4: Dataset Source Manager | Complete | Multiple dataset roots, persistent JSON config, validation, enable/disable, removal without deletion, refresh, loopback-only writes, tests, and runtime smoke |
| Feature 5: Approved Pipeline Step Registry | Planned | Depends on inspector and step contract |
| Feature 6: Pipeline Preview and Step Result Contract | Planned | Depends on registry |
| Feature 7: Pipeline Save/Load Manifest | Planned | Depends on provenance/storage decisions |
| Feature 8: Dry Run Execution | Planned | Depends on step result and cancellation design |
| Feature 9: Upload Security and Local Dataset Store | Planned | Depends on upload security controls |
| Feature 10: Token and SFT Mapping Preview | Planned | Depends on inspector and tokenizer contracts |
| Feature 11: Training Handoff Planning | Planned | Depends on saved manifest and mapping preview |

## Core Milestone 2: Fine-Tuning and PEFT Foundation

- Status: Features 1 through 6 complete; Core Milestone 3 / Feature 1 recommended but not approved.
- Goal: stabilize full-parameter SFT first, then add optional PEFT only through
  a tested dependency boundary.
- Excluded now: production QLoRA claims without bitsandbytes runtime evidence,
  DPO, RLHF, GRPO, distributed training, serving, new architectures, and Web
  features.

Feature progress:

| Feature | Status | Evidence |
| ------- | ------ | -------- |
| Feature 1: Full Fine-Tuning and SFT Stabilization | Complete | `FineTuningConfig`, `prepare_fine_tuning_dataset`, `fine_tune`, CPU native runtime, checkpoint/resume, artifact reload, evaluation, inference, focused tests |
| Feature 2: LoRA and General PEFT Foundation | Complete | `arclm.peft`, `LoRAConfig`, built-in `LoRALinear`, `fine_tune(..., peft_config=...)`, adapter artifacts, checkpoint/resume, merge/final artifact, CPU runtime tests |
| Feature 3: QLoRA and Quantized Fine-Tuning Foundation | Complete | `QLoRAConfig`, `QuantizationConfig`, bitsandbytes 4-bit boundary, capability inspection, adapter metadata, fixture-level validation |
| Feature 4: Hugging Face and QLoRA Runtime Validation Matrix | Complete | Tiny local HF CPU runtime, GTX 1050 Ti HF/LoRA CUDA runtime, bounded environment reports, optional bitsandbytes gate |
| Feature 5: Experiment Tracking and Reproducible Run Manifests | Complete | `arclm.tracking` local run manifests, metrics/events, references, trainer callback, fine-tuning/QLoRA metadata, inspect/validate/list/compare, legacy compatibility |
| Feature 6: Hyperparameter Search Foundation | Complete | `arclm.search` local search manifests, typed search spaces, deterministic grid/random trials, one tracked run per trial, failure policy, bounded failed-trial retry, resume, inspect/validate/list/compare, best-config export |

## Core Milestone 3: Distributed Runtime Foundation

- Status: Planned, not approved.
- Goal: prepare process/runtime contracts for future DDP without implementing
  FSDP or multi-node behavior in one patch.

Feature progress:

| Feature | Status | Evidence |
| ------- | ------ | -------- |
| Feature 1: Distributed Runtime and Process Abstraction | Recommended | Needed before DDP, multi-GPU PEFT, and distributed checkpoint validation |

## Web Milestone 3: Training and Evaluation Dashboard

- Status: Planned, not approved.
- Goal: visualize training and evaluation only after foundation and event contracts exist.
- Included later: training jobs, live loss, validation loss, perplexity, accuracy, learning rate, steps/epochs, throughput, GPU/VRAM, checkpoints, resume controls, logs, evaluation results, simple/advanced config.
- Excluded now: fake charts, fake training controls, and dashboard event backend.
- Dependencies: Web Milestone 1, monitoring/event contract milestone.
- Acceptance criteria: to be defined when approved.
- Complexity: Large.

## Web Milestone 4: Models and Projects

- Status: Planned, not approved.
- Goal: manage local projects, models, checkpoints, metrics, and reproducible configs.
- Included later: model registry, versions, checkpoints, metadata, project templates, project wizard, import existing ArcLM project, export reproducible config.
- Excluded now: registry backend and project mutation workflows.
- Dependencies: Web Milestone 1 and project metadata design.
- Acceptance criteria: to be defined when approved.
- Complexity: Medium/Large.

## Web Milestone 5: Plugins and Extensions

- Status: Planned, not approved.
- Goal: expose plugin information safely after the plugin security model is approved.
- Included later: installed plugin list, enable/disable, configuration, compatibility, local install, permission info, read-only extension catalogue, future marketplace plan.
- Excluded now: marketplace, arbitrary plugin execution, plugin installation without security policy.
- Dependencies: Web Milestone 1, plugin package format, plugin permission model.
- Acceptance criteria: to be defined when approved.
- Complexity: Large.

## Superseded: Later ML Milestone: LoRA and Basic PEFT Foundation

This earlier planning block is superseded by Core Milestone 2 / Features 2 and
3, which implemented built-in ArcLM LoRA, adapter artifacts, and the QLoRA
configuration/backend boundary. Real QLoRA runtime validation and external PEFT
automation remain future work.

- Goal: stabilize LoRA without starting QLoRA or RLHF.
- User value: adapter fine-tuning becomes reliable.
- Product: Pro with Shared Core adapters.
- Dependencies: Milestones 0-1, PEFT optional test environment.
- Included: LoRA config, tiny PEFT tests, adapter-only training, save/load/resume.
- Excluded: QLoRA, DPO, RLHF, GRPO.
- Public APIs: `LoRAConfig` or similarly small API only if proven needed.
- Package changes: optional dependency only after approval.
- Optional dependencies: PEFT, Transformers.
- Compatibility impact: keep old `train_sft(use_lora=True)` wrapper if retained.
- Security: no remote model downloads in default tests.
- Tests: optional PEFT installed job and clean skip when absent.
- Runtime validation: CPU tiny model where PEFT supports it; CUDA later.
- Documentation: LoRA limitations and migration.
- Migration: route legacy LoRA to stable API.
- Risks: PEFT version compatibility.
- Rollback: disable stable LoRA export and keep experimental wrapper.
- Acceptance criteria: LoRA trains only adapter params, saves/loads, resumes with new trainer, base imports work without PEFT.
- Complexity: Large.

## Milestone 3: Hugging Face Runtime Validation

- Goal: prove optional HF support with local tiny models/tokenizers.
- User value: external models become predictable.
- Product: Shared Core.
- Dependencies: Milestones 0-2 as needed.
- Included: local HF causal LM tests, tokenizer/chat template tests, local save/reload.
- Excluded: remote downloads, large model matrix.
- Public APIs: existing loaders/adapters.
- Package changes: none unless version constraints are approved.
- Optional dependencies: Transformers, safetensors.
- Compatibility impact: none expected.
- Security: no hidden network access.
- Tests: optional HF runtime tests with local configs.
- Runtime validation: CPU.
- Documentation: supported contracts and unsupported families.
- Migration: update external model docs.
- Risks: Transformers 5 compatibility.
- Rollback: mark HF support experimental.
- Acceptance criteria: local HF model/tokenizer train/eval/infer path passes.
- Complexity: Medium.

## Milestone 4: NLP Task Expansion

- Goal: add real end-to-end task workflows one at a time.
- User value: users can train/evaluate common NLP tasks.
- Product: Community for core tasks, Pro for large benchmark automation.
- Dependencies: evaluation and data core, Milestone 3 for HF-backed tasks.
- Included: text classification first, then token classification/NER, embeddings/reranking, seq2seq only after architecture support.
- Excluded: all NLP tasks at once.
- Public APIs: small task-specific configs/trainers only when necessary.
- Package changes: optional HF/datasets only with tests.
- Optional dependencies: task-dependent.
- Compatibility impact: none.
- Security: dataset validation.
- Tests: architecture, collator, loss, metrics, inference per task.
- Runtime validation: CPU smoke per task.
- Documentation: task guide and limitations.
- Migration: none.
- Risks: task sprawl.
- Rollback: keep task APIs experimental until full flow passes.
- Acceptance criteria: each task has dataset, training objective, evaluation metric, inference, docs, tests.
- Complexity: Large.

## Milestone 5: Inference Improvements

- Goal: make local generation behavior explicit and tested.
- User value: predictable generation APIs.
- Product: Community for local inference, Pro for production scheduling.
- Dependencies: Milestones 0-3.
- Included: greedy tests, sampling tests, streaming token generation, true batch inference.
- Excluded: production serving, vLLM, continuous batching.
- Public APIs: `generate`, streaming iterator if needed.
- Package changes: none.
- Optional dependencies: none for native; Transformers optional.
- Compatibility impact: preserve `predict` and `TextGenerator`.
- Security: validate prompt/output sizes.
- Tests: deterministic tiny-model tests.
- Runtime validation: CPU; CUDA optional.
- Documentation: generation options.
- Migration: mark old helpers if superseded.
- Risks: generation APIs can become too broad.
- Rollback: keep current inference engine.
- Acceptance criteria: generation options have direct tests and docs.
- Complexity: Medium.

## Milestone 6: Retrieval and RAG Foundations

- Goal: add local retrieval contracts before provider integrations.
- User value: simple RAG workflows.
- Product: Community for local interfaces, Pro for managed/vector providers.
- Dependencies: embeddings or external embedding model support.
- Included: chunking, local retriever interface, simple semantic search fixtures.
- Excluded: provider lock-in.
- Public APIs: `Retriever`, `Reranker`, `Document`, `RAGPipeline` only if implemented.
- Package changes: optional vector clients later.
- Optional dependencies: none for local fixtures.
- Compatibility impact: none.
- Security: untrusted document handling.
- Tests: local no-network retrieval tests.
- Runtime validation: CPU.
- Documentation: provider adapter boundary.
- Migration: none.
- Risks: vector DB sprawl.
- Rollback: keep as experimental.
- Acceptance criteria: local retrieval and evaluation fixtures pass.
- Complexity: Large.

## Milestone 7: Monitoring and Experiment Logs

- Goal: stabilize local monitoring before dashboards.
- User value: users can inspect training/eval runs.
- Product: Community for local logs, Pro for service dashboards.
- Dependencies: stable training/evaluation state.
- Included: structured metrics, local tracker tests, optional tracking clean skips.
- Excluded: visual dashboards.
- Public APIs: small tracker/log result objects.
- Package changes: optional tracking deps only after approval.
- Optional dependencies: MLflow, W&B, TensorBoard later.
- Compatibility impact: none.
- Security: redact secrets and avoid raw PII/prompts by default.
- Tests: local file logs and optional imports.
- Runtime validation: CPU.
- Documentation: metrics schema.
- Migration: deprecate stale tracking APIs only with aliases.
- Risks: logging sensitive data.
- Rollback: disable external tracking adapters.
- Acceptance criteria: local tracking is tested and documented.
- Complexity: Medium.

## Milestone 8: Distributed Training

- Goal: add DDP without disrupting single-device `Trainer`.
- User value: scale training when hardware exists.
- Product: Pro.
- Dependencies: core trainer stability.
- Included: DDP wrapper/launcher, CPU gloo test, CUDA CI plan.
- Excluded: FSDP, DeepSpeed at first.
- Public APIs: separate distributed entry point.
- Package changes: none beyond Torch.
- Optional dependencies: none initially.
- Compatibility impact: single-device unchanged.
- Security: process launch validation.
- Tests: two-process CPU plus GPU when available.
- Runtime validation: CPU distributed and CUDA optional.
- Documentation: launch guide.
- Migration: none.
- Risks: platform differences on Windows/Linux.
- Rollback: keep DDP isolated.
- Acceptance criteria: DDP saves/resumes and preserves Trainer API.
- Complexity: Large.

## Milestone 9: Model Serving

- Goal: make local serving real before production scale.
- User value: users can call models over HTTP safely.
- Product: Pro.
- Dependencies: inference improvements and security rules.
- Included: local server, `/health`, `/generate`, validation, shutdown tests.
- Excluded: continuous batching, cloud deployment, auth unless server boundary needs it.
- Public APIs: server app factory and CLI.
- Package changes: optional FastAPI/Uvicorn or continue Flask only after design.
- Optional dependencies: web stack.
- Compatibility impact: simple interface migration docs.
- Security: input limits, no hidden downloads, optional auth plan.
- Tests: endpoint and concurrency smoke.
- Runtime validation: local CPU server.
- Documentation: serving limitations.
- Migration: clarify simple Flask UI status.
- Risks: server lifecycle flakiness.
- Rollback: keep simple interface experimental.
- Acceptance criteria: local server health/generate tests pass.
- Complexity: Large.

## Milestone 10: Optimization and Export

- Goal: validate artifacts before claiming export/optimization.
- User value: exported models can be trusted.
- Product: Pro, with model-size reporting in Community.
- Dependencies: inference and checkpoint stability.
- Included: model-size report, ONNX export only with reload/validation, quantization only with installed deps.
- Excluded: TensorRT/GGUF until ONNX path is proven.
- Public APIs: `Exporter` only after two exporters need it.
- Package changes: optional export deps.
- Optional dependencies: onnx, onnxruntime, TensorRT/GGUF tools later.
- Compatibility impact: none.
- Security: artifact metadata and checksums.
- Tests: exported artifact validation.
- Runtime validation: CPU for ONNX where possible.
- Documentation: artifact guarantees.
- Migration: none.
- Risks: backend-specific failures.
- Rollback: mark exporter experimental.
- Acceptance criteria: exported artifact is loadable/validated.
- Complexity: Large.

## Milestone 11: Deployment Providers

- Goal: automate deployment only after serving exists.
- User value: users can package and deploy repeatably.
- Product: Pro.
- Dependencies: Milestone 9.
- Included: Docker first, then provider-specific plans.
- Excluded: Kubernetes/Helm until Docker is stable.
- Public APIs: deployment providers if implemented.
- Package changes: optional cloud SDKs later.
- Optional dependencies: Docker/cloud tooling.
- Compatibility impact: none.
- Security: secrets must not be written into generated files.
- Tests: template lint and local smoke where possible.
- Runtime validation: local container/server.
- Documentation: provider setup.
- Migration: none.
- Risks: provider drift.
- Rollback: keep generated templates separate.
- Acceptance criteria: generated deployment starts and health-checks.
- Complexity: Large.

## Milestone 12: Multimodal

- Goal: add one multimodal vertical only after text core is stable.
- User value: expand beyond text without weakening text APIs.
- Product: Pro first, possible Community foundations later.
- Dependencies: architecture/data/eval expansion.
- Included: choose text-image or document understanding first.
- Excluded: all modalities at once.
- Public APIs: processors, collators, models, evaluators per modality.
- Package changes: optional vision/audio deps.
- Optional dependencies: torchvision/audio/etc.
- Compatibility impact: none.
- Security: file validation and content limits.
- Tests: tiny local fixtures.
- Runtime validation: CPU first.
- Documentation: supported formats.
- Migration: none.
- Risks: dependency and data complexity.
- Rollback: keep experimental package isolated.
- Acceptance criteria: one full multimodal flow passes.
- Complexity: Research.

## Milestone 13: Agents and MCP

- Goal: design safe tool execution after security boundaries exist.
- User value: controlled agent workflows.
- Product: Pro with possible Community interfaces.
- Dependencies: security model, plugin permissions.
- Included: tool registry, permission model, executor, audit events.
- Excluded: unrestricted code/browser execution.
- Public APIs: small tool/runtime contracts.
- Package changes: optional MCP SDK only after approval.
- Optional dependencies: MCP/tool providers.
- Compatibility impact: none.
- Security: sandbox, resource limits, cancellation, audit logs.
- Tests: permission and sandbox tests.
- Runtime validation: local fake tools.
- Documentation: safety model.
- Migration: none.
- Risks: unsafe execution.
- Rollback: keep interface-only.
- Acceptance criteria: tools cannot run without explicit permission.
- Complexity: Research.

## Milestone 14: Advanced Evaluation

- Goal: build benchmark support on top of `Evaluator`.
- User value: compare models with repeatable reports.
- Product: Pro, with local custom benchmarks possibly Community.
- Dependencies: evaluation core and dataset cache policy.
- Included: custom benchmark framework, local fixtures, reports.
- Excluded: MMLU/GSM8K downloads until cache/download policy is approved.
- Public APIs: benchmark runner.
- Package changes: optional datasets.
- Optional dependencies: datasets/network.
- Compatibility impact: no change to `Evaluator`.
- Security: dataset provenance and no hidden downloads.
- Tests: local fixtures.
- Runtime validation: CPU.
- Documentation: benchmark limitations.
- Migration: none.
- Risks: benchmark claims without rigor.
- Rollback: keep diagnostics separate.
- Acceptance criteria: benchmark can run offline fixture and export report.
- Complexity: Medium.

## Milestone 15: Security Foundations

- Goal: make security features honest and testable.
- User value: safer local/server workflows.
- Product: Shared Core plus Pro controls.
- Dependencies: serving/agents if included.
- Included: redaction tests, artifact verification plan, dependency scan policy, validation rules.
- Excluded: claims of complete safety.
- Public APIs: security helpers only when tested.
- Package changes: optional scan tools after approval.
- Optional dependencies: security scanners/classifiers as needed.
- Compatibility impact: none.
- Security: this is the security milestone.
- Tests: unit/security/integration.
- Runtime validation: local.
- Documentation: threat model.
- Migration: none.
- Risks: overclaiming.
- Rollback: mark helpers experimental.
- Acceptance criteria: scoped controls pass tests and docs state limits.
- Complexity: Large.

## Milestone 16: Enterprise

- Goal: add team/server governance only if ArcLM becomes a hosted product.
- User value: organizational use.
- Product: Pro.
- Dependencies: serving, security, deployment.
- Included: auth, workspaces, RBAC, audit logs, API keys, usage tracking.
- Excluded: billing/license until product decision.
- Public APIs: server-only APIs.
- Package changes: separate Pro/server boundary.
- Optional dependencies: auth/database/payment stacks.
- Compatibility impact: Community unchanged.
- Security: tenant isolation and auditability.
- Tests: server/security/integration.
- Runtime validation: local server and staging.
- Documentation: admin/security docs.
- Migration: none.
- Risks: large product scope.
- Rollback: keep enterprise package separate.
- Acceptance criteria: auth/RBAC/audit tests pass in isolated server.
- Complexity: Research.

## Milestone 17: Research and Marketplace

- Goal: support controlled experimentation after core contracts are stable.
- User value: extensibility without destabilizing core.
- Product: Shared/Core interfaces, Pro marketplace.
- Dependencies: plugins, security, registry decisions.
- Included: experiment comparison, reproducibility metadata, extension discovery.
- Excluded: arbitrary unsafe marketplace installs.
- Public APIs: registries/plugins only after permissions.
- Package changes: optional marketplace dependencies later.
- Optional dependencies: TBD.
- Compatibility impact: none.
- Security: signed/verified extensions if marketplace exists.
- Tests: registry/plugin/repro tests.
- Runtime validation: local.
- Documentation: extension policy.
- Migration: none.
- Risks: ecosystem safety.
- Rollback: keep local plugin interface only.
- Acceptance criteria: reproducible experiment metadata and safe extension loading pass tests.
- Complexity: Research.
