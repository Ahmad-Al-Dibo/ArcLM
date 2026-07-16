# ArcLM Test Strategy

## Baseline Gate

Default Community validation must pass on CPU:

```bash
python -m pytest
python -m compileall src/arclm
python -m pip wheel . --no-deps
```

Current Core audit CPU result on July 15, 2026: `.venv-training-core` imports
ArcLM, compiles `src/arclm`, and builds a wheel successfully. Focused Core
runtime suites passed with `113 passed, 2 skipped`; public API passed with
`22 passed`; compatibility passed with `15 passed`.

Current full pytest result after Core Milestone 2 / Feature 5 is green:
`335 passed, 13 skipped, 4 warnings`. OP-020 is resolved by making
`tests/web/datasets/test_dataset_inspector.py` pass an explicit temporary
`dataset_config_path` for every test app, so user-local persisted dataset roots
cannot enter the catalogue. Direct `python -m build` requires the optional
`build` package in the active environment.

Current local GPU result: `.venv-gpu-validation` uses PyTorch `2.5.1+cu121` on
an NVIDIA GeForce GTX 1050 Ti. The current Feature 4 CUDA gate passed with
`10 passed` using `PYTHONPATH=src`.

## Test Types

| Test Type | Purpose | Default Environment | Required Before Stable |
| --------- | ------- | ------------------- | ---------------------- |
| Unit tests | Validate small functions/classes | CPU | Yes |
| Integration tests | Validate package flow across domains | CPU | Yes for stable workflows |
| Compatibility tests | Protect old imports/APIs | CPU | Yes |
| Public API tests | Verify documented imports | CPU | Yes |
| CPU smoke tests | Prove runtime behavior locally | CPU | Yes |
| CUDA tests | Prove GPU/mixed precision paths | Optional CUDA CI | Required for CUDA claims |
| Multi-GPU tests | Prove DDP/FSDP/multi-device | Optional GPU CI | Required for Pro distributed |
| Optional dependency tests | Prove HF/PEFT/export/tracking paths | Matrix jobs | Required before stable integration |
| Security tests | Validate validation, redaction, auth rules | CPU/server | Required for security claims |
| Export artifact tests | Load exported artifact back | CPU/GPU as needed | Required for exporters |
| Deployment smoke tests | Start server/container and health-check | Optional CI | Required for deployment claims |
| Performance benchmarks | Track speed/regressions | Dedicated env | Not default gate |
| Regression tests | Lock fixed bugs | Same as bug environment | Required after fixes |

## Milestone Gates

- Milestone 0: full pytest, compileall, import checks, packaging check, README/status accuracy pass.
- Milestone 1: CLI help and train/eval/generate smoke tests.
- Web Milestone 1: frontend lint/type/build/unit checks, backend health/environment/capability/project endpoint tests, accessibility smoke checks, no optional dependency import regressions, and legacy simple interface compatibility checks.
- Later ML Milestone: PEFT installed optional job, LoRA save/load/resume tiny-model tests.
- Milestone 3: local tiny Hugging Face model/tokenizer runtime tests.
- Milestone 4: NLP task workflow tests per task.
- Milestone 5: generation behavior tests for greedy, sampling, streaming, batch.
- Milestone 6: local retrieval fixtures and no-network vector adapter tests.
- Milestone 7: local tracker tests and optional MLflow/W&B skipped cleanly.
- Milestone 8: DDP CPU/gloo test and CUDA distributed tests where available.
- Milestone 9: local server starts, `/health` passes, request validation tests.
- Milestone 10: export artifact can be loaded or verified.
- Milestone 11: generated deployment files lint and local container/server smoke where practical.
- Milestone 12: multimodal tiny fixture tests.
- Milestone 13: tool permission, sandbox, and audit-event tests.
- Milestone 14: benchmark fixtures, cache, reporting, and no-network default tests.
- Milestone 15: security redaction, validation, dependency-scan policy tests.
- Milestone 16: enterprise server/auth/RBAC/audit tests in Pro boundary only.

## Web Test Rules

- Web dependencies are optional and must not be required for `import arclm`.
- Frontend tests should use local fixtures and must not download models or datasets.
- Backend tests should call existing ArcLM Python APIs or small service helpers, not shell commands.
- The Web API may expose environment and capability summaries, but tests must verify that secrets and raw `.env` values are not returned.
- Pages for unapproved future milestones may show an honest `Planned` state, but tests must not treat those pages as functional.
- Feature 4 backend smoke must start Uvicorn on `127.0.0.1` and verify `/api/health`, `/api/environment`, `/api/capabilities`, `/api/project/status`, `/docs`, and `/openapi.json`.
- Feature 5 dashboard smoke must start the local backend and production frontend, open `/`, verify connected dashboard data, stop the backend, verify disconnected state, restart the backend, and verify reconnect.
- Feature 6 dashboard smoke must switch to Advanced mode, verify runtime details,
  hardware details, grouped capabilities, validation status, optional
  integrations, limitations, diagnostics, and the safe response-inspector
  trigger, then switch back to Simple mode and verify technical sections are
  hidden.
- Current extra warning: FastAPI `TestClient` emits a dependency-owned `StarletteDeprecationWarning` about future `httpx2` usage.

## Hardware Rules

- CPU is always enough for default Community tests.
- CUDA tests must skip cleanly when hardware is unavailable.
- A skipped CUDA test does not prove CUDA runtime support.
- Local CUDA correctness is validated on the GTX 1050 Ti with tiny fixtures only.
- BF16 correctness passed locally through PyTorch's reported capability, but native BF16 acceleration is not claimed.
- Multi-GPU, DDP world-size-two, FSDP, and distributed checkpoint claims require external multi-GPU validation.

## Local GPU Commands

```powershell
.\.venv-gpu-validation\Scripts\python.exe -m pytest tests/gpu -v -m "cuda and not multi_gpu"
.\.venv-gpu-validation\Scripts\python.exe -m pytest tests/gpu -v -m "cuda and fp16"
.\.venv-gpu-validation\Scripts\python.exe -m pytest tests/gpu -v -m "cuda and bf16"
```

See:

- [GPU Capability Matrix](../testing/gpu-capability-matrix.md)
- [Local GTX 1050 Ti Validation](../testing/local-gtx-1050-ti.md)
- [External GPU Validation](../testing/external-gpu-validation.md)

## Optional Dependency Rules

- Missing optional dependencies must produce helpful errors or clean skips.
- Optional imports must not break `import arclm`.
- Each optional integration needs at least one installed-dependency CI job before stable status.
## Web Milestone 2 Data Pipeline Studio Tests

Web Milestone 2 / Feature 1 is docs-only. Web Milestone 2 / Feature 2 adds the
read-only Dataset Inspector Backend. Feature 3 adds the read-only Dataset
Inspector UI on `/data`. Feature 4 adds the local Dataset Source Manager.

Feature 2 tests cover:

- Dataset Inspector Backend: source allowlist, format detection, bounded rows,
  no absolute path leaks, invalid JSON/CSV/TXT handling, and safe errors.

Feature 3 tests cover:

- Dataset Inspector UI: loading, disconnected and empty states, catalogue
  selection, safe URL state, bounded preview, schema/statistics/warning
  rendering, simple/advanced differences, refresh behavior, keyboard-accessible
  controls, and no path exposure.
- Runtime smoke: real backend with a temporary dataset root, HTTP dataset list
  and inspection, production `/data` route, no root path in inspection JSON, and
  unchanged source-file hashes.

Feature 4 tests cover:

- Dataset Source Manager backend: zero roots, persisted roots, many roots,
  max root count, duplicate names, duplicate canonical paths, enable/disable,
  removal without deletion, persistent save/reload, corrupt config, invalid
  paths, symlink rejection, nested-root warnings, recursive/non-recursive scans,
  CLI root merge, loopback-only writes, non-loopback rejection, catalogue
  refresh, and no path leakage through dataset endpoints.
- Dataset Source Manager frontend: root list, empty state, add path, invalid
  path, duplicate handling, multiple roots, enable/disable, remove confirmation,
  refresh catalogue, session-only source, Simple/Advanced mode, long paths,
  disconnected backend, root-management unavailable, and dataset selection after
  catalogue refresh.
- Runtime smoke: multiple temporary folders, persisted restart, CLI session-only
  root visibility, recursive opt-in, disable/re-enable, remove without file
  deletion, no path leakage from normal dataset endpoints, and responsive
  `/data` checks.

Dataset Inspector test-isolation regression tests cover:

- Ignoring a simulated user-local `dataset-roots.json` when a test supplies an
  explicit temporary config path.
- Leaving the simulated user config unchanged.
- Deterministic repeated `create_app()` calls with the same isolated test root.
- Independent app instances seeing only their own configured roots.
- Keeping the test config file outside the dataset root so it is never
  catalogued as fixture data.

Future implementation features must add focused tests before they are marked
complete:
- Step Registry: only real ArcLM steps listed as available; planned steps stay
  planned.
- Pipeline Preview: before/after rows, changed/removed counts, step warnings,
  and no mutation outside the bounded preview.
- Storage/Manifest: safe IDs, config hash, no private path exposure, load/save
  compatibility.

## Core Lifecycle Tests

Core Milestone 1 / Feature 1 added `tests/unit/lifecycle/test_metadata.py`.
These tests cover:

- PyTorch module source detection
- JSON manifest round trip
- training checkpoint lifecycle metadata
- inspection of new and legacy checkpoints
- config loading through `load_model_config`
- `Config.load_config_from_model()`
- Hugging Face folder and ID metadata inspection without importing
  Transformers or touching the network

Focused validation command:

```bash
python -m pytest tests/unit/lifecycle tests/unit/training tests/unit/test_smart_loader.py tests/unit/test_external_engine.py tests/public_api tests/compatibility
```

Feature 1 validation result:

- Focused lifecycle/public API/compatibility suite: `79 passed, 2 skipped`.
- Broader Core regression with lifecycle, training, evaluation, fine-tuning,
  data, smoke, public API, compatibility, and CLI: `166 passed, 2 skipped`.
- Full pytest after OP-020 isolation fix: `259 passed, 10 skipped, 4 warnings`.

## Core Checkpoint Tests

Core Milestone 1 / Feature 2 added
`tests/checkpoints/test_training_checkpoint.py`.

These tests cover:

- checkpoint format identifier and version
- structured metadata and training-config snapshot
- lifecycle metadata presence
- Python, NumPy, and PyTorch CPU RNG state capture/restore
- CUDA RNG absence in CPU baseline
- inspection without RNG mutation
- legacy unversioned checkpoint inspection
- unsupported future-version rejection
- malformed payload errors
- `TrainingState` counter validation
- atomic write failure preserving the previous checkpoint
- temporary-file cleanup
- RNG restore on resume
- CPU epoch-boundary deterministic resume
- public checkpoint imports

Feature 2 validation result:

- Focused checkpoint suite: `10 passed`.
- Training suite: `28 passed, 2 skipped`.
- Lifecycle suite: `8 passed`.
- Evaluation suite: `26 passed`.
- Inference-related suite: `7 passed, 1 skipped`.
- Public API: `22 passed`.
- Compatibility: `15 passed, 1 warning`.
- Full pytest: `269 passed, 10 skipped, 4 warnings`.

## Core Model Artifact Tests

Core Milestone 1 / Feature 3 added `tests/models/test_model_artifacts.py`.

These tests cover:

- artifact format identifier and version
- manifest serialization round trip
- native ArcLM artifact save/load
- tokenizer present and absent behavior
- training and evaluation summaries
- no optimizer, scheduler, scaler, or RNG state in final artifacts
- file inventory and SHA-256 hashes
- missing files, hash mismatch, unsafe manifest paths, and unsupported precision
- existing destination rejection and explicit overwrite
- staged save failure preserving an existing artifact
- inspection without model construction or RNG mutation
- native CPU evaluation after load
- native CPU inference forward pass after load
- PyTorch `model_factory` boundary
- incorrect PyTorch reconstruction failure
- optional Hugging Face dependency boundary
- checkpoint is not accepted as final artifact
- final artifact is not accepted as a training checkpoint

Feature 3 validation result:

- Lifecycle + model artifact suites: `24 passed`.
- Model artifact suite: `16 passed`.
- Checkpoint regression: `10 passed`.
- Training regression: `28 passed, 2 skipped`.
- Evaluation regression: `26 passed`.
- Inference-related regression: `7 passed, 1 skipped, 1 warning`.
- Public API: `22 passed`.
- Compatibility: `15 passed, 1 warning`.
- Full pytest: `285 passed, 10 skipped, 4 warnings`.
- Compileall: passed.
- Wheel build: passed.

## Core Milestone 2 / Feature 1 Validation

Fine-tuning stabilization adds:

- focused config/schema/masking/report tests in `tests/unit/finetuning`
- native CPU runtime in `tests/smoke/test_finetuning_workflow.py`
- public API coverage for `FineTuningConfig`, `FineTuningMode`,
  `FineTuningResult`, `fine_tune`, and `prepare_fine_tuning_dataset`
- regression coverage for Training, Checkpoints, Lifecycle, Model Artifacts,
  Evaluation, Inference, Public API, and Compatibility

Required final gate remains full pytest, compileall, wheel build, and paused
frontend regression.

Feature 1 final Python suite result: `296 passed, 10 skipped, 4 warnings`.

## Core Milestone 2 / Feature 2 Validation

LoRA and PEFT foundation adds `tests/peft`.

These tests cover:

- PEFT and LoRA config validation
- LoRA layer behavior and initial no-op output
- target inspection by suffix, leaf, and full path
- target-miss and double-apply errors
- base-parameter freezing and trainable parameter reports
- adapter state extraction and strict load
- adapter artifact save, inspect, validate, load, overwrite, and integrity
  failures
- wrong-base-model rejection
- fine-tuning with `peft_config`
- checkpoint/resume with new model and trainer objects
- adapter reload inference equivalence
- merge/unmerge output equivalence
- merged final model artifact reload, evaluation, and inference
- public `arclm.peft` imports

Required final gate remains full pytest, compileall, wheel build, and paused
frontend regression. GPU LoRA and Hugging Face PEFT runtime are separate
optional validation gates.

Feature 2 final Python suite result: `309 passed, 10 skipped, 4 warnings`.
Paused frontend regression passed after rerunning Vitest alone: lint passed,
typecheck passed, `82` tests passed, production build passed, and npm audit
reported `0` vulnerabilities.

## Core Milestone 2 / Feature 3 Validation

QLoRA and Quantized Fine-Tuning Foundation extends `tests/peft`.

These tests cover:

- `QLoRAConfig` and `QuantizationConfig` validation and round trip
- `PeftMethod.QLORA`
- `QuantizationBackend.BITSANDBYTES_4BIT`
- optional dependency capability reporting
- CUDA capability reporting through controlled monkeypatches
- rejection of unquantized base models
- fixture-level quantized-module preparation and base freezing
- QLoRA adapter artifact metadata
- QLoRA adapter reload onto a full-precision base model
- full-precision merge path for QLoRA adapter metadata
- rejection of direct final-artifact merge from a quantized runtime model
- public `arclm.peft` QLoRA imports

Evidence vocabulary:

| QLoRA evidence level | Feature 3 status |
| -------------------- | ---------------- |
| Configuration verified | Passed |
| Backend boundary verified | Passed |
| Fixture verified | Passed |
| Real GPU load verified | Not executed |
| Real GPU training verified | Not executed |
| Checkpoint/resume verified | Pending real runtime |
| Artifact/reload verified | Adapter metadata and full-precision reload path verified |

Real bitsandbytes 4-bit loading and real GPU QLoRA training must be validated in
a separate optional runtime matrix before ArcLM claims production QLoRA runtime
support.

Feature 3 final validation:

- `tests/peft -v`: `22 passed`
- `tests/public_api -v`: `23 passed`
- `tests/compatibility -v`: `15 passed, 1 warning`
- full `python -m pytest`: `319 passed, 10 skipped, 4 warnings`
- `python -m compileall src/arclm`: passed
- `python -m pip wheel . --no-deps`: passed
- paused Web regression: lint passed, typecheck passed, `82` tests passed,
  production build passed, and npm audit reported `0` vulnerabilities

## Core Milestone 3 / Feature 1 Validation

Distributed Runtime and Process Abstraction is validated without starting a
process group.

Commands:

```bash
python -m pytest tests/distributed -v
python -m pytest tests/public_api -v
python -m pytest
python -m compileall src/arclm
python -m pip wheel . --no-deps
```

Focused result:

| Gate | Result |
| ---- | ------ |
| `tests/distributed -v` | `19 passed` |
| `tests/public_api -v` | `26 passed` |
| Full Python suite | `366 passed, 13 skipped, 4 warnings` |
| Compileall | Passed |
| Wheel build | Passed |
| Paused frontend regression | Lint/typecheck/test/build passed; npm audit 0 vulnerabilities |

The distributed tests verify rank/world-size validation, environment parsing,
Gloo/NCCL capability reporting, no silent CPU fallback for explicit CUDA
requests, launcher environment creation, and that process-group initialization
does not happen during inspection.

## Core Milestone 2 / Feature 4 Validation

Hugging Face and QLoRA Runtime Validation Matrix adds focused runtime tests
without making optional packages required.

These tests cover:

- bounded CPU/CUDA runtime environment reports
- tiny local Hugging Face model artifact save/load
- tiny local Hugging Face full fine-tuning checkpoint/resume
- tiny local Hugging Face built-in LoRA adapter reload/merge/final artifact
- Hugging Face evaluation through `ModelAdapter`
- CUDA Hugging Face forward on GTX 1050 Ti
- CUDA built-in LoRA training step on GTX 1050 Ti
- bitsandbytes absence as a strict skip/pending runtime gate
- CUDA RNG restore normalization for PyTorch 2.5.1 checkpoint resume

Evidence vocabulary:

| Runtime area | Feature 4 status |
| ------------ | ---------------- |
| Hugging Face CPU runtime | Passed with tiny local fixture |
| Hugging Face CUDA forward | Passed on GTX 1050 Ti |
| CUDA built-in LoRA | Passed on GTX 1050 Ti |
| QLoRA API boundary | Passed |
| bitsandbytes import/runtime | Pending; dependency absent |
| real QLoRA 4-bit train step | Pending; dependency absent |
| multi-GPU PEFT | Not implemented |

Required commands:

```bash
python -m pytest tests/integration/test_huggingface_runtime_validation.py -v
python -m pytest tests/quantization -v
python -m pytest tests/checkpoints -v
python -m pytest
python -m compileall src/arclm
python -m pip wheel . --no-deps
```

Local CUDA command:

```powershell
$env:PYTHONPATH = (Join-Path (Get-Location) "src")
.\.venv-gpu-validation\Scripts\python.exe -m pytest tests\gpu -v -m "cuda and not multi_gpu"
```

Provider-independent QLoRA runtime gate:

```bash
python -m pytest tests/quantization -v -m "bitsandbytes and qlora"
```

## Core Milestone 2 / Feature 5 Validation

Experiment Tracking and Reproducible Run Manifests adds `tests/tracking`.

Validated:

- run manifest creation, status transitions, interruption, failure, completion
- metric and event JSONL recording
- config path redaction
- dataset fingerprints and bounded metadata
- checkpoint, adapter, and model-artifact references
- trainer callback runtime integration
- fine-tuning, LoRA, and QLoRA metadata recording
- run inspection, validation, listing, and comparison
- legacy `ExperimentTracker` local compatibility
- lazy optional MLflow/W&B boundary

Commands:

```bash
python -m pytest tests/tracking -v
python -m pytest tests/public_api -v
python -m pytest
python -m compileall src/arclm
python -m pip wheel . --no-deps
```

Feature 5 result:

| Gate | Result |
| ---- | ------ |
| `tests/tracking -v` | `8 passed` |
| `tests/public_api -v` | `24 passed` |
| Full Python suite | `335 passed, 13 skipped, 4 warnings` |
| Compileall | Passed |
| Wheel build | Passed |
| Paused frontend regression | Lint/type/test/build passed; npm audit 0 vulnerabilities |

## Core Milestone 2 / Feature 6 Validation

Hyperparameter Search Foundation adds `tests/search`.

Validated:

- search strategy, search status, and trial status values
- choice, integer, and float parameter definitions
- approved parameter-path validation
- deterministic grid ordering
- deterministic random search with dedicated RNG
- search-size bounds
- effective config materialization through existing config classes
- one run manifest per started trial
- real CPU tiny training search with four sequential trials
- best-trial selection and best-config export
- interrupted search resume without rerunning completed trials
- continue and stop failure policies
- one bounded failed-trial retry
- LoRA config override materialization
- search inspection, validation, listing, and trial comparison
- missing run-reference validation error
- public API imports

Commands:

```bash
python -m pytest tests/search -v
python -m pytest tests/search tests/tracking tests/peft tests/unit/training tests/public_api tests/compatibility -v
python -m pytest
python -m compileall src/arclm
python -m pip wheel . --no-deps
```

Feature 6 focused result:

| Gate | Result |
| ---- | ------ |
| `tests/search -v` | `10 passed` |
| Search/tracking/PEFT/training/public API/compatibility | `109 passed, 2 skipped, 1 warning` |
| Full Python suite | `346 passed, 13 skipped, 4 warnings` |
| Compileall | Passed |
| Wheel build | Passed |
| Paused frontend regression | Lint/typecheck/test/build passed; npm audit 0 vulnerabilities |

Feature 4 final validation:

- `tests/integration/test_huggingface_runtime_validation.py -v`: `4 passed`
- `tests/quantization -v`: `2 passed, 1 skipped`
- `tests/checkpoints -v`: `11 passed`
- `.venv-gpu-validation` CUDA suite with `PYTHONPATH=src`: `10 passed`
- full `python -m pytest`: `326 passed, 13 skipped, 4 warnings`
- `python -m compileall src/arclm`: passed
- `python -m pip wheel . --no-deps`: passed
- paused Web regression: lint passed, typecheck passed, `82` tests passed,
  production build passed, and npm audit reported `0` vulnerabilities
