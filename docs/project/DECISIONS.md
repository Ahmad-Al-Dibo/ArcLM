# ArcLM Decision Records

## DEC-001: Community and Pro separation

Status: Proposed

Context:
ArcLM needs a strong local open core and a path for advanced operational features.

Decision:
Keep datasets, training, evaluation, fine-tuning, checkpoints, adapters, and basic inference in Community. Place distributed orchestration, production serving, dashboards, cloud deployment, advanced PEFT automation, large benchmarks, and enterprise controls in Pro or Shared Core as appropriate.

Reasons:
This keeps the library useful without forcing enterprise dependencies into local workflows.

Alternatives:
Put everything in one package; split too early into many packages.

Consequences:
Optional dependency boundaries and compatibility tests become important.

## DEC-002: Model-agnostic support

Status: Proposed

Context:
ArcLM should not only support ArcLM-native models.

Decision:
Support native models directly, standard PyTorch models through documented contracts, Hugging Face models through optional integrations, and custom models through adapters.

Reasons:
This matches current code and avoids claiming universal support.

Alternatives:
Only support native ArcLM models; claim all models work automatically.

Consequences:
Adapters and runtime tests are required for each major model family claim.

## DEC-003: Adapter design

Status: Proposed

Context:
SFT already has useful model and tokenizer adapters.

Decision:
Keep adapters small: input mapping, output mapping, loss/logit extraction, save/load expectations, and capability documentation.

Reasons:
This is enough for current workflows without a heavy framework.

Alternatives:
Build a generic adapter registry now.

Consequences:
General external-model support should grow from tested needs.

## DEC-004: Optional dependencies

Status: Proposed

Context:
ArcLM has optional HF, PEFT, serving, tracking, and export ambitions.

Decision:
Optional dependencies must not be imported on `import arclm`; missing packages must give clear errors or skips.

Reasons:
CPU/local users should not pay for integrations they do not use.

Alternatives:
Install everything by default.

Consequences:
Optional CI jobs are needed before stable integration claims.

## DEC-005: Public API stability

Status: Proposed

Context:
Compatibility shims exist and old users may rely on them.

Decision:
Keep old imports until deprecation warnings, migration docs, and compatibility tests support removal.

Reasons:
This avoids surprise breakage during architecture growth.

Alternatives:
Clean up old APIs immediately.

Consequences:
Some duplicated names remain temporarily.

## DEC-006: Dutch comments and docstrings

Status: Proposed

Context:
Recent code style requires Dutch comments/docstrings and English code names/errors.

Decision:
Future implementation code should keep English identifiers and errors, with simple Dutch comments/docstrings.

Reasons:
This matches project style and user preference.

Alternatives:
Use all English or mixed ad hoc style.

Consequences:
Reviewers need to check language consistency.

## DEC-007: Training and evaluation reuse

Status: Proposed

Context:
Training and evaluation cores are stable and tested.

Decision:
New fine-tuning, PEFT, benchmark, and task workflows should reuse `Trainer`, `Evaluator`, callbacks, configs, and checkpoint behavior where practical.

Reasons:
This avoids duplicated training/evaluation loops.

Alternatives:
Create separate trainers for every feature.

Consequences:
Extension points may need small additions only when tests prove a need.

## DEC-008: Logging strategy

Status: Proposed

Context:
Basic logs exist, tracking code is experimental.

Decision:
Use standard Python logging plus callback events and local structured metrics first. External trackers remain optional.

Reasons:
Simple logs are enough for Community and easy to test.

Alternatives:
Build a dashboard/event platform now.

Consequences:
Dashboards wait until monitoring data contracts are stable.

## DEC-009: Plugin safety

Status: Proposed

Context:
Plugin protocol exists but discovery and permissions do not.

Decision:
Do not make plugin loading stable until discovery, permissions, sandboxing, and audit events are designed and tested.

Reasons:
Plugins can execute untrusted code.

Alternatives:
Load arbitrary plugins from paths.

Consequences:
Plugin system remains interface-only for now.

## DEC-010: Agent sandboxing

Status: Proposed

Context:
Agent features are not implemented.

Decision:
Agents must be split into tool registry, planner, memory, executor, policy, and runtime only when real implementations exist. Code/browser/tool execution requires sandboxing and permissions.

Reasons:
This avoids one giant unsafe `Agent` class.

Alternatives:
Ship a broad agent API first.

Consequences:
Agent milestones depend on security foundations.

## DEC-011: Hidden chain-of-thought handling

Status: Proposed

Context:
Reasoning features are requested.

Decision:
Do not expose or store private hidden chain-of-thought. Support user-visible summaries and structured outputs only.

Reasons:
This keeps reasoning features safe and provider-compatible.

Alternatives:
Store raw reasoning traces.

Consequences:
Reasoning APIs must be explicit about what is user-visible.

## DEC-012: Web Experience priority

Status: Accepted by owner for the current implementation sequence

Context:
After CLI/public API stabilization and local GPU validation, the owner chose to prioritize a modern ArcLM Web Experience before the previously recommended LoRA/PEFT milestone.

Decision:
Implement Web Milestone 1 first: optional frontend foundation, design system, app shell, local ArcLM Web API connection, health/environment/capability/project status, simple/advanced mode, themes, accessibility foundation, tests, and docs. Keep Web Milestones 2-5 and later ML milestones unapproved until Web Milestone 1 is complete and reviewed.

Reasons:
ArcLM needs a local developer experience that helps beginners start quickly while still preserving advanced controls for experienced users. A thin Web API over existing Python APIs avoids duplicate training, evaluation, inference, and dataset logic.

Alternatives:
Continue directly to LoRA/PEFT; expand the legacy Flask page; build a production serving platform first.

Consequences:
Web dependencies must remain optional, `import arclm` must stay lightweight, the legacy Flask simple interface remains a compatibility path, and future dashboard/data/plugin work must show planned states until separately approved.

## DEC-013: Modern Web API backend boundary

Status: Accepted for Web Milestone 1 / Feature 4

Context:
The modern Next.js frontend needs safe local runtime information, while the
legacy Flask simple interface must remain compatible.

Decision:
Add a separate optional FastAPI backend under `arclm.web` with an explicit
`create_app()` factory, localhost defaults, read-only endpoints, strict CORS,
and a small CLI launch command. Keep the legacy Flask interface unchanged.

Reasons:
FastAPI provides typed schemas and OpenAPI for the modern UI without replacing
the compatibility Flask path. A read-only API prevents the first backend feature
from accidentally becoming model serving or dashboard control logic.

Alternatives:
Extend the Flask app, call shell commands from the browser, or expose training
and inference actions immediately.

Consequences:
FastAPI and Uvicorn remain optional web dependencies, Python 3.10+ is required
for the modern web extra, and dashboard presentation starts only after a later
approved feature.
## DEC-014: Data Pipeline Studio Starts With Read-Only Inspection

Status: proposed.

Decision: Web Milestone 2 should start with a read-only Dataset Inspector
Backend before upload, pipeline execution, visual graph editing, or training
handoff.

Reason:

- ArcLM already has useful dataset loaders and pipeline steps.
- These APIs are not yet safe web contracts by themselves.
- Preview, provenance, limits, and safe dataset references are prerequisites
  for browser workflows.

Consequence:

- Feature 2 should inspect approved sources only.
- Upload and execution remain separate future features.
- The UI must not show working-looking controls for planned data actions until
  real backend behavior exists.

Implementation note:

- Web Milestone 2 / Feature 2 implemented the read-only backend as
  `GET /api/datasets` and `GET /api/datasets/{dataset_id}/inspection`.
  The Feature 1 draft `POST /api/data/inspect` was superseded by this safer
  list-then-inspect flow.

## DEC-015: Dataset Source Manager Uses Local Administrative Writes

Status: Accepted for Web Milestone 2 / Feature 4.

Decision:
Allow loopback-only dataset source configuration endpoints for adding,
validating, enabling, disabling, and removing local dataset roots. Store
persisted roots in a local JSON config file outside the installed package.

Reason:

- The browser cannot safely browse unrestricted server folders.
- Users still need to configure multiple local dataset folders without
  restarting the backend for every source change.
- Source configuration is different from dataset upload or dataset mutation.

Consequence:

- Source-management mutation is disabled for non-loopback server binding.
- CLI roots remain session-only unless separately saved through the dashboard.
- Removing a source never deletes folders or dataset files.
- Normal dataset catalogue and inspection responses must not expose root paths.
- Pipeline step registry, upload, preview, and execution stay separate future
  features.

## DEC-016: Pause Web Track and Re-baseline Core

Status: Accepted by owner for the current work sequence.

Context:
After Web Milestone 2 / Feature 4, the owner paused Web Experience work and
made the Python Core framework the active priority.

Decision:
Do not continue the Dataset Source Manager, Pipeline Step Registry Web UI, Data
Pipeline Studio, dashboards, model registry UI, plugin UI, or marketplace until
the owner explicitly reactivates the Web track. Complete a Core re-baseline and
API audit first.

Reasons:
The Python framework needs a fresh evidence-based baseline before advanced Core
features continue. Web code should remain stable, but it must not pull focus
from model lifecycle, configuration, checkpoint, training, evaluation,
fine-tuning, data, inference, and dependency contracts.

Consequences:
The recommended next action changes from the Web Pipeline Step Registry to Core
Milestone 1 / Feature 1: Model Lifecycle and Configuration Contract. That
recommendation still requires explicit owner approval.

## DEC-017: Model Lifecycle Contract Before Advanced Core Work

Status: Accepted for Core Milestone 1 / Feature 1.

Context:
ArcLM has working training, evaluation, checkpoints, SFT, loaders, and inference
pieces, but source metadata and lifecycle behavior are split across domains.

Decision:
Before LoRA, QLoRA, distributed training, export, serving, or new architecture
families, define a backward-compatible model lifecycle and configuration
contract.

Reasons:
Advanced features depend on a stable answer to what a model source is, what an
ArcLM training checkpoint contains, how an inference artifact differs from a
checkpoint, how tokenizers and metadata are saved, and how external models are
adapted.

Consequences:
Current public imports and compatibility modules stay. `arclm.lifecycle` is the
first shared contract. Later milestones should use it instead of creating new
metadata shapes.

## DEC-018: Web Dataset Tests Must Inject Isolated Config Paths

Status: Accepted for the Core stability gate after Core Milestone 1 / Feature 1.

Context:
Dataset Inspector tests created local Web API apps without setting
`dataset_config_path`. The app correctly loaded the default persisted user
configuration from the local ArcLM config directory, so the tests saw real
user-local dataset roots and the default full suite failed.

Decision:
Web dataset tests that construct an app must pass an explicit temporary
`dataset_config_path`, preferably outside the temporary dataset root. Tests may
simulate user-local config with `ARCLM_CONFIG_DIR`, but they must not read or
write the developer's real persisted dataset-root configuration.

Reasons:
Production behavior should continue loading persisted roots by default, while
tests must be deterministic, order-independent, and safe for user data.

Consequences:
Future Dataset Inspector and Dataset Source Manager tests need isolated config
paths whenever they create a Web app. The full Python suite now passes without
touching user-local dataset source configuration.

## DEC-019: Versioned Trusted Training Checkpoints

Status: Accepted for Core Milestone 1 / Feature 2.

Context:
ArcLM checkpoints already saved model, optimizer, scheduler, scaler, training
state, and lifecycle metadata, but the payload was not explicitly versioned and
did not preserve supported RNG state.

Decision:
Training checkpoints now use
`checkpoint_format="arclm-training-checkpoint"` and `checkpoint_version=1`.
ArcLM stores structured checkpoint metadata, a safe config snapshot, small
dataset provenance, and supported RNG state. Public inspection uses
`CheckpointInfo`, `inspect_checkpoint()`, and `validate_checkpoint()`.

Reasons:
Training resume needs full PyTorch state, including optimizer and scheduler
state, so checkpoint loading remains a trusted-file operation. Versioning and
validation make this explicit without pretending that arbitrary `.pt` files are
safe.

Consequences:
Existing unversioned checkpoints remain legacy-compatible. Future versions must
be rejected unless ArcLM knows how to load them. Mid-epoch dataloader position,
callback state, checksums, signatures, and final model artifact save/load remain
separate future work.

## DEC-020: Final Model Artifacts Are Separate From Training Checkpoints

Status: Accepted for Core Milestone 1 / Feature 3.

Context:
Training checkpoints now restore full training state, but final trained models
need a different contract for evaluation, inference, export, sharing, and future
fine-tuning. Treating checkpoints as final artifacts would leak optimizer,
scheduler, scaler, RNG, and training-run state into user-facing model packages.

Decision:
ArcLM final model artifacts now use a directory format with
`manifest.json`, `artifact_format="arclm-model-artifact"`, and
`artifact_version=1`. Artifacts store model config, portable CPU state
dictionaries, optional tokenizer files, safe summaries, safe provenance, a file
inventory, and SHA-256 hashes. They do not store optimizer, scheduler, scaler,
RNG, or active trainer state.

Reasons:
Final artifacts should be inspectable and validatable before model
construction. Native ArcLM models can be reconstructed from built-in config and
architecture maps. Arbitrary PyTorch modules cannot be reconstructed safely from
a state dictionary alone, so they require a caller-supplied factory or model at
load time. Hugging Face artifacts remain optional, local-files-only, and
`trust_remote_code=False` by default.

Consequences:
`save_model_artifact()`, `inspect_model_artifact()`,
`validate_model_artifact()`, and `load_model_artifact()` are the canonical
final-artifact APIs. `Trainer.save_model_artifact()` is a small convenience
wrapper. Checkpoints are not accepted as final artifacts, and final artifacts
are not accepted as training checkpoints. Digital signatures, PEFT adapter
artifacts, export artifacts, GPU artifact runtime, and Hugging Face runtime
validation remain future work.

## DEC-018: Stable Fine-Tuning Workflow Reuses Core Trainer

Status: Accepted for Core Milestone 2 / Feature 1.

Context:
ArcLM already had `FullFineTuner`, `SFTTrainer`, a collator, adapters, and a
legacy Hugging Face `train_sft` helper. The missing piece was a stable
Python-first workflow that validates examples, creates labels, trains, resumes,
evaluates, and saves a final model artifact without creating a parallel
training engine.

Decision:
ArcLM fine-tuning now uses `FineTuningConfig`, `FineTuningMode`,
`PreparedFineTuningDataset`, `FineTuningDatasetReport`, `FineTuningResult`,
`prepare_fine_tuning_dataset()`, and `fine_tune()`. The workflow prepares
tokenized `input_ids`, `attention_mask`, and `labels`, then delegates training
to `FullFineTuner` and `Trainer`.

Consequences:
Full-parameter native CPU SFT is verified through checkpoint/resume, final
artifact save, artifact reload, evaluation, and inference. Core Milestone 2 /
Feature 2 adds LoRA through the same workflow. QLoRA, DDP, FSDP, Web features,
and model serving remain outside Feature 1. Stable packing is disabled in
`FineTuningConfig` until a future attention-mask/packing design is approved.

## DEC-021: Built-In LoRA Before External PEFT Automation

Status: Accepted for Core Milestone 2 / Feature 2.

Context:
ArcLM had a legacy optional `train_sft(use_lora=True)` path for Hugging Face
models through the external `peft` package, but no stable ArcLM-owned PEFT
contract. The approved Core step needed adapter fine-tuning without making base
imports or native CPU workflows depend on PEFT, Transformers, or internet
access.

Decision:
ArcLM now provides `arclm.peft` with `PeftMethod`, `PeftConfig`,
`LoRAConfig`, built-in `LoRALinear`, target inspection, LoRA injection,
adapter-only artifacts, adapter validation/loading, and merge/unmerge helpers.
`fine_tune(..., peft_config=LoRAConfig(...))` is the stable built-in LoRA entry
point. Adapter artifacts use `artifact_format="arclm-peft-adapter"` and remain
separate from both training checkpoints and final model artifacts.

Consequences:
Built-in LoRA is verified on CPU with the native ArcLM model through
checkpoint/resume, adapter reload, evaluation, inference, and merged final model
artifact reload. QLoRA, other PEFT methods, Hugging Face PEFT runtime, GPU PEFT
runtime, and external PEFT automation remain future work. The legacy optional
Hugging Face/PEFT path remains compatibility code.

## DEC-022: QLoRA Boundary Before Runtime Claims

Status: Accepted for Core Milestone 2 / Feature 3.

Context:
QLoRA needs bitsandbytes, Transformers, CUDA hardware, and a local Hugging Face
model folder for real 4-bit training. The default Core validation environment
is CPU-only, so ArcLM must not claim real QLoRA runtime support from config
tests or fixtures.

Decision:
ArcLM adds `PeftMethod.QLORA`, `QuantizationConfig`, `QLoRAConfig`,
`inspect_quantization_capabilities()`, and a bitsandbytes 4-bit backend
boundary under `arclm.peft`. The backend imports optional dependencies lazily
and only when quantized runtime loading is requested. QLoRA adapter artifacts
reuse the existing PEFT adapter artifact format and record quantization
metadata. Direct merge from a quantized runtime model is rejected; users must
load the adapter onto a compatible full-precision base model before saving a
merged final artifact.

Consequences:
Configuration, optional-dependency errors, capability reporting,
quantized-base validation, fixture preparation, adapter metadata, and
full-precision adapter reload are verified. Real bitsandbytes 4-bit loading,
real GPU QLoRA training, real checkpoint/resume, and real adapter artifact
reload on Hugging Face models remain pending a separate runtime validation
matrix.

## DEC-023: Runtime Matrix Before Production QLoRA Claims

Status: Accepted for Core Milestone 2 / Feature 4.

Context:
Core Milestone 2 / Feature 3 created the QLoRA API and backend boundary, but
the repository still needed runtime evidence for local Hugging Face workflows,
CUDA LoRA, and optional bitsandbytes behavior. The local GPU environment has a
GTX 1050 Ti and no bitsandbytes install, so it can validate CUDA and LoRA paths
but cannot prove real 4-bit QLoRA training.

Decision:
ArcLM adds provider-independent runtime validation tests and bounded runtime
environment reporting. The matrix verifies tiny local Hugging Face artifact,
fine-tuning, evaluation, and built-in LoRA flows on CPU; verifies CUDA
Hugging Face forward and CUDA built-in LoRA on the GTX 1050 Ti; and records
bitsandbytes QLoRA runtime as pending when the optional dependency is absent.

Consequences:
ArcLM may claim Hugging Face tiny-local runtime validation and GTX 1050 Ti CUDA
LoRA validation. ArcLM must not claim production QLoRA runtime support until the
bitsandbytes gate, real 4-bit train step, checkpoint/resume, adapter artifact
reload, and inference/evaluation checks pass in a suitable CUDA environment.
The next recommended Core feature is Experiment Tracking and Reproducible Run
Manifests, while QLoRA production runtime remains a separate optional gate.

## DEC-024: Local Run Manifest Before External Tracking Services

Status: Accepted for Core Milestone 2 / Feature 5.

ArcLM needs reproducible run metadata before hyperparameter search,
distributed training, dashboard training controls, or external service
integrations. The stable first layer must be local, inspectable, and
dependency-free.

Decision:

ArcLM adds `arclm.tracking` with `RunConfig`, `RunManifest`, `RunInfo`,
`RunStatus`, `RunTracker`, `create_run`, `inspect_run`, `validate_run`,
`list_runs`, and `compare_runs`. Local runs write `manifest.json`,
`events.jsonl`, `metrics.jsonl`, bounded summaries, and safe output references.
Legacy `ExperimentTracker` remains available and delegates local tracking to
the same manifest backend. MLflow and Weights & Biases stay lazy
compatibility-only paths.

Consequences:

Run manifests are stable Community functionality. External tracking services,
hyperparameter search, distributed aggregation, and remote storage are deferred
until separately approved.

## DEC-025: Local Sequential Search Before Distributed Tuning

Status: Accepted for Core Milestone 2 / Feature 6.

ArcLM needs a reproducible trial contract before distributed training,
dashboard-controlled tuning, or external sweep providers. The first search
layer must reuse existing training, fine-tuning, evaluation, checkpoint,
artifact, and run-manifest contracts instead of introducing a second training
engine.

Decision:

ArcLM adds `arclm.search` with local search manifests,
`SearchStrategy`, `SearchStatus`, `TrialStatus`, typed parameter definitions,
`SearchSpace`, `ObjectiveConfig`, `HyperparameterSearchConfig`,
`create_search`, `load_search`, `inspect_search`, `validate_search`,
`list_searches`, and `compare_trials`. Search supports deterministic grid and
random generation, one tracked run per started trial, bounded failed-trial
retry, resume, best-trial selection, and best-config export.

Consequences:

Search is Community local functionality. Bayesian optimization, pruning,
parallel trials, distributed search, cloud workers, Web UI controls, and
external sweep providers remain deferred. Real bitsandbytes QLoRA runtime
validation remains a separate pending optional gate.
