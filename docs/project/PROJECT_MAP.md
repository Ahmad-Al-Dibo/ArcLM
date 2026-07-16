# ArcLM Project Map

This file is the planning source of truth for ArcLM after the July 15, 2026 repository audit.

[PROJECT_STATUS]

- Web Track: paused after Web Milestone 2 / Feature 4 - Dataset Source Manager. The next previously planned Web feature is Approved Pipeline Step Registry, but approval is not granted and Web development must not continue until the owner reactivates it.
- Core Track: active priority. Core Milestone 4 / Feature 5 - Resume and Artifact Handoff is implemented as a policy and planning contract; actual FSDP shard writing and real multi-GPU FSDP runtime remain pending later features and external hardware.
- Core Re-baseline result: complete. The canonical Core capability matrix is [../core/current-capabilities.md](../core/current-capabilities.md).
- Core Milestone 1 / Feature 1 validation: Model Lifecycle and Configuration Contract implemented through `arclm.lifecycle`; native checkpoints include lifecycle metadata; legacy checkpoints can be inspected; `Config.load_config_from_model()` now loads real model config; focused lifecycle/public API/compatibility tests passed with `79 passed, 2 skipped`; broader Core regression passed with `166 passed, 2 skipped`; the isolation gate restored the full Python suite to `259 passed, 10 skipped, 4 warnings`; compileall and wheel build passed.
- Core Milestone 1 / Feature 2 validation: Checkpoint Hardening and Reproducibility Metadata implemented through `arclm.checkpoints`; training checkpoints now have `checkpoint_format="arclm-training-checkpoint"` and `checkpoint_version=1`; inspection, validation, RNG restore, atomic writes, legacy compatibility, and CPU epoch-boundary deterministic resume are tested. Full Python suite: `269 passed, 10 skipped, 4 warnings`; compileall, wheel build, and paused frontend regression passed.
- Core Milestone 1 / Feature 3 validation: Final Model Artifact Save and Load implemented through `arclm.lifecycle`; final artifacts use `artifact_format="arclm-model-artifact"` and `artifact_version=1`; manifest, file inventory, SHA-256 validation, native reconstruction, PyTorch factory boundary, tokenizer persistence, CPU evaluation/inference runtime, and checkpoint/artifact separation are tested. Full Python suite: `285 passed, 10 skipped, 4 warnings`; compileall and wheel build passed.
- Core Milestone 2 / Feature 1 validation: Full Fine-Tuning and SFT Stabilization implemented through `arclm.finetuning`; stable `FineTuningMode`, `FineTuningConfig`, `FineTuningResult`, dataset preparation/report/fingerprint, prompt/chat masking, `fine_tune()`, checkpoint/resume, final artifact handoff, artifact reload, evaluation, and inference after reload are tested. Focused fine-tuning suite: `37 passed`; full Python suite: `296 passed, 10 skipped, 4 warnings`; compileall passed.
- Core Milestone 2 / Feature 2 validation: LoRA and General PEFT Foundation implemented through `arclm.peft`; built-in `LoRAConfig`, `LoRALinear`, target planning, adapter injection, base freezing, adapter artifacts, adapter reload, checkpoint/resume, merge/unmerge, merged final artifact reload, evaluation, inference, and public imports are tested. Focused PEFT suite: `13 passed`; full Python suite: `309 passed, 10 skipped, 4 warnings`; compileall, wheel build, and paused frontend regression passed.
- Core Milestone 2 / Feature 3 validation: QLoRA and Quantized Fine-Tuning Foundation implemented through `arclm.peft`; `QLoRAConfig`, `QuantizationConfig`, bitsandbytes 4-bit backend boundary, capability inspection, quantized-base validation, QLoRA adapter metadata, full-precision adapter reload/merge path, and quantized-runtime merge rejection are tested. Focused PEFT suite: `22 passed`; public API suite: `23 passed`; full Python suite: `319 passed, 10 skipped, 4 warnings`; compileall, wheel build, and paused frontend regression passed. Real bitsandbytes GPU loading/training is pending runtime validation.
- Core Milestone 2 / Feature 4 validation: Hugging Face and QLoRA Runtime Validation Matrix implemented through local tiny Hugging Face runtime tests, CUDA Hugging Face/LoRA tests, bounded runtime environment reports, and an optional bitsandbytes QLoRA runtime gate. Focused HF runtime suite: `4 passed`; quantization suite: `2 passed, 1 skipped`; `.venv-gpu-validation` CUDA suite with `PYTHONPATH=src`: `10 passed`; full Python suite: `326 passed, 13 skipped, 4 warnings`; compileall, wheel build, and paused frontend regression passed. Real bitsandbytes 4-bit QLoRA loading/training remains pending because bitsandbytes is not installed in the current validation environments.
- Core Milestone 2 / Feature 5 validation: Experiment Tracking and Reproducible Run Manifests implemented through `arclm.tracking`; `RunConfig`, `RunManifest`, `RunInfo`, `RunStatus`, `RunTracker`, `create_run`, `inspect_run`, `validate_run`, `list_runs`, `compare_runs`, `RunTrackingCallback`, and legacy `ExperimentTracker` compatibility are tested. Focused tracking suite: `8 passed`; public API suite: `24 passed`; full Python suite: `335 passed, 13 skipped, 4 warnings`; compileall, wheel build, and paused frontend regression passed.
- Core Milestone 2 / Feature 6 validation: Hyperparameter Search Foundation implemented through `arclm.search`; `SearchStrategy`, `SearchStatus`, `TrialStatus`, typed parameter definitions, `SearchSpace`, `ObjectiveConfig`, `HyperparameterSearchConfig`, local search manifests, deterministic grid/random generation, one tracked run per trial, failure policy, bounded failed-trial retry, resume, inspection, validation, listing, comparison, and best-config export are tested. Focused search suite: `10 passed`; combined search/tracking/PEFT/training/public API/compatibility suite: `109 passed, 2 skipped, 1 warning`; full Python suite: `346 passed, 13 skipped, 4 warnings`; compileall, wheel build, and paused frontend regression passed.
- Core Milestone 3 / Feature 1 validation: Distributed Runtime and Process Abstraction implemented through `arclm.distributed`; `DistributedConfig`, environment rank parsing, runtime inspection, backend availability checks, device resolution, launcher environment creation, no-silent-CUDA-fallback behavior, and lightweight public imports are tested. Focused distributed suite: `19 passed`; public API suite: `26 passed`; full Python suite: `366 passed, 13 skipped, 4 warnings`; compileall, wheel build, and paused frontend regression passed. This feature does not initialize process groups and does not implement DDP, FSDP, distributed samplers, launchers, or multi-GPU training.
- Core Milestone 3 / Feature 2 validation: Distributed Config Validation implemented through `validate_distributed_setup`, `DistributedValidationIssue`, and `DistributedValidationResult`; structured errors/warnings cover missing rendezvous settings, local-rank mismatch, CUDA conflicts, unavailable CUDA, unavailable NCCL, unused single-process rendezvous settings, and no-silent-device-fallback behavior. Focused distributed suite: `29 passed`; public API suite: `26 passed`; full Python suite: `376 passed, 13 skipped, 4 warnings`; compileall, wheel build, and paused frontend regression passed. This feature does not initialize process groups, spawn workers, add a launcher, or implement DDP/FSDP.
- Core Milestone 3 / Feature 3 validation: CPU Process-Group Runtime Tests implemented through `init_process_group`, `destroy_process_group`, `process_group_context`, and `DistributedProcessGroupInfo`; single-process Gloo lifecycle, context cleanup, already-initialized rejection, missing rendezvous rejection, and two CPU subprocesses joining one Gloo group with `all_reduce` are tested. Focused distributed suite: `35 passed`; public API suite: `26 passed`; compatibility suite: `15 passed, 1 warning`; full Python suite: `382 passed, 13 skipped, 4 warnings`; compileall, wheel build, and paused frontend regression passed. This feature does not add a multiprocessing launcher API and does not implement DDP/FSDP or trainer integration.
- Core Milestone 3 / Feature 4 validation: Multiprocessing Launcher implemented through `launch_processes`, `DistributedLaunchResult`, and `DistributedWorkerResult`; bounded local worker count, spawn-based workers, structured success/failure/timeout results, optional per-worker process-group initialization, public imports, and `examples/17_multiprocessing_launcher.py` are tested. Focused distributed suite: `40 passed`; public API suite: `26 passed`; compatibility suite: `15 passed, 1 warning`; example runtime passed; full Python suite: `387 passed, 13 skipped, 4 warnings`; compileall, wheel build, and paused frontend regression passed. This feature does not implement DDP/FSDP, distributed samplers, distributed checkpoints, or trainer integration.
- Core Milestone 3 / Feature 5 validation: Single-GPU Distributed Smoke Boundary implemented through `SingleGpuBoundaryInfo`, `inspect_single_gpu_boundary`, `validate_single_gpu_boundary`, CUDA-marked single-worker distributed smoke tests, Windows TCPStore compatibility for ArcLM-generated rendezvous, and `examples/18_single_gpu_distributed_smoke.py`. Focused distributed suite: `43 passed`; CPU CUDA/distributed marker gate: `2 skipped, 10 deselected`; GTX 1050 Ti GPU validation suite: `2 passed`; public API suite: `26 passed`; example runtime passed in CPU and GPU environments; full Python suite: `390 passed, 15 skipped, 4 warnings`; compileall, wheel build, and paused frontend regression passed. This feature does not claim multi-GPU, DDP, FSDP, distributed samplers, distributed checkpoints, or trainer integration.
- Core Milestone 3 / Feature 6 validation: External Multi-GPU Validation Matrix implemented through `ExternalValidationTarget`, `get_external_multi_gpu_validation_matrix`, registered external markers, skipped provider-independent external gates, and `examples/19_external_multi_gpu_validation_matrix.py`. Focused distributed suite: `46 passed`; public API suite: `26 passed`; external marker gate: `6 skipped, 13 deselected`; full Python suite: `393 passed, 22 skipped, 4 warnings`; compileall, wheel build, and paused frontend regression passed. This feature prepares release gates for CUDA BF16 on modern GPUs, two-GPU DDP, multi-GPU FP16/BF16, distributed checkpoint/resume, FSDP, and newer-GPU optimizations. It does not implement or locally verify DDP, FSDP, multi-GPU training, distributed checkpoints, or Flash Attention.
- Core Milestone 3 / Feature 7 validation: DDP Trainer Integration implemented through explicit `Trainer(..., distributed_config=...)`, PyTorch `DistributedDataParallel` wrapping, `DistributedSampler` dataloader splitting, sampler epoch setting, raw-model checkpoint/artifact state handling, and rank-zero-only checkpoint writes. Focused distributed suite: `47 passed`; training suite: `28 passed, 2 skipped`; public API suite: `26 passed`; external two-GPU DDP gate: `1 skipped, 18 deselected`; `examples/20_ddp_cpu_trainer.py` passed; full Python suite: `394 passed, 22 skipped, 4 warnings`; compileall, wheel build, and paused frontend regression passed. This feature verifies DDP on two CPU/Gloo processes only; real two-GPU CUDA DDP remains pending external validation.
- Core Milestone 3 / Feature 8 validation: Distributed Checkpoint and Resume Hardening implemented through `Trainer.save_checkpoint(..., synchronize=True)`, distributed checkpoint metadata, rank-zero-only checkpoint writes, synchronized distributed checkpoint loads, and a two CPU/Gloo process resume test with new model/trainer objects. Focused distributed suite: `48 passed`; checkpoint suite: `11 passed`; training suite: `28 passed, 2 skipped`; public API suite: `26 passed`; compatibility suite: `15 passed, 1 known warning`. This feature verifies distributed resume on CPU/Gloo only; real two-GPU CUDA DDP checkpoint/resume remains pending external validation.
- Core Milestone 3 / Feature 9 validation: External Two-GPU CUDA DDP Validation Gate implemented through `tests/gpu/test_two_gpu_ddp_runtime.py`; the gate requires at least two CUDA GPUs and NCCL, runs DDP training on CUDA ranks, saves a rank-zero checkpoint, loads it on new trainer objects, resumes, and verifies no CPU fallback. Local CPU environment result: `python -m pytest tests/gpu -q -rs -m "multi_gpu and distributed"` selected the gate and skipped with `Two-GPU CUDA DDP validation requires CUDA.` Distributed regression still passes with `48 passed`. This is not a real two-GPU runtime pass.
- Core Milestone 4 / Feature 1 validation: FSDP Config and Capability Checks implemented through `FSDPCapabilityInfo`, `inspect_fsdp_capability()`, and `validate_fsdp_capability()` in `arclm.distributed`; checks require PyTorch FSDP, CUDA multi-GPU hardware, and NCCL before reporting local availability, without wrapping models or initializing process groups. Focused distributed suite: `52 passed`; public API suite: `26 passed`; FSDP external marker gate: `1 skipped, 17 deselected`; full Python suite: `399 passed, 21 skipped, 4 warnings`.
- Core Milestone 4 / Feature 2 validation: FSDP Model Wrapping Boundary implemented through `FSDPWrapConfig`, `FSDPWrapInfo`, `FSDPWrappedModel`, and `wrap_fsdp_model()` in `arclm.distributed`; wrapping is explicit, requires capability validation, an initialized process group, rank/world-size agreement, CUDA device resolution, and lazy PyTorch FSDP import. Focused distributed suite: `57 passed`; public API suite: `26 passed`; FSDP external marker gate: `1 skipped, 17 deselected`; full Python suite: `404 passed, 21 skipped, 4 warnings`.
- Core Milestone 4 / Feature 3 validation: Sharded Checkpoint Policy implemented through `FSDPCheckpointPolicy`, `FSDPCheckpointPlan`, `plan_fsdp_sharded_checkpoint()`, and `validate_fsdp_checkpoint_policy()` in `arclm.distributed`; the policy requires sharded state dictionaries, a rank-zero manifest, per-rank model shards, safe relative paths, no optimizer-state support, and no resume support. Focused distributed suite: `69 passed`; public API suite: `26 passed`; checkpoint suite: `11 passed`; FSDP external marker gate: `1 skipped, 17 deselected`.
- Core Milestone 4 / Feature 4 validation: Optimizer-State Handling implemented as FSDP optimizer-state checkpoint policy planning; `FSDPCheckpointPolicy` now defaults to sharded optimizer-state planning, `optimizer_shard_directory` is validated as a safe relative path, `FSDPCheckpointPlan` reports per-rank optimizer shard paths, and `optimizer_state_policy="not_supported"` remains available for compatibility. Focused distributed suite: `71 passed`; public API suite: `26 passed`; checkpoint suite: `11 passed`.
- Core Milestone 4 / Feature 5 validation: Resume and Artifact Handoff implemented as FSDP policy planning; `FSDPCheckpointPolicy` now defaults to `resume_policy="rank_synchronized"` and `artifact_handoff_policy="rank_zero_metadata"`, validates `artifact_handoff_directory`, and `FSDPCheckpointPlan` reports all-rank resume requirements plus rank-zero artifact handoff metadata intent. Focused distributed suite: `74 passed`; public API suite: `26 passed`; checkpoint suite: `11 passed`.
- Recommended next Core action: Core Milestone 4 / Feature 6 - External Hardware Validation. This is not approved automatically.
- Implementation gate: closed until the owner explicitly approves the next Core implementation feature or reactivates Web.
- Roadmap priority note: Data Platform Web work, real bitsandbytes QLoRA runtime validation, distributed training, serving, and other product milestones remain planned but inactive.
- Current repository state: large `src/` package migration is present in the working tree; this plan does not revert or normalize it.
- Baseline validation: Milestone 0 recorded `187 passed, 2 skipped, 38 warnings`; after Milestone 1 warning cleanup, full pytest is `200 passed, 2 skipped, 3 warnings`.
- Milestone 1 public API check: `tests/public_api -v` passed with `20 passed`; `tests/compatibility -v` passed with `14 passed`.
- Milestone 1 CLI check: `tests/cli -v` passed with `8 passed`; combined `tests/public_api tests/compatibility tests/cli -v` passed with `42 passed, 2 warnings`.
- Milestone 1 warning inventory: [WARNING_INVENTORY.md](WARNING_INVENTORY.md); the PyTorch GradScaler FutureWarning was fixed, and the remaining 3 warnings are intentional compatibility deprecations.
- Milestone 1 final checks: `compileall src/arclm` passed; public import command passed; `pip wheel . --no-deps` passed.
- Build note: `python -m build` could not run because the active venv does not have the `build` package installed. The package still built successfully through `pip wheel` without changing dependencies.
- Documentation accuracy: README now reflects the validated Torch CPU environment and marks LoRA/PEFT, distributed training, deployment, dashboards, and enterprise workflows as planned rather than stable. Public API and CLI docs now describe recommended and legacy usage.
- Web Feature 1 validation: frontend foundation added under `web/`; `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`, and a local dev-server root-page smoke check passed.
- Web Feature 2 validation: source-owned design system added; `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`, `npm audit --json`, production `npm run start` smoke for `/` and `/design-system`, and Python regressions passed.
- Web Feature 3 validation: application shell added; `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`, `npm audit --json`, production `npm run start` smoke for all shell routes, and Python regressions passed.
- Web Feature 4 validation: local read-only Web API added; `tests/web -v`, public API tests, compatibility tests, full pytest, compileall, wheel build, frontend lint/type/test/build, npm audit, and localhost Uvicorn smoke passed.
- Web Feature 5 validation: Simple Dashboard added on `/`; frontend lint/type/test/build, backend web tests, public API/compatibility tests, npm audit, package wheel, Python regressions, and real frontend-to-backend smoke passed.
- Web Feature 6 validation: Advanced Dashboard added on `/` behind Advanced mode; frontend lint/type/test/build, backend web tests, public API/compatibility tests, npm audit, package wheel, Python regressions, and real frontend-to-backend smoke passed.
- Web Milestone 2 Feature 1 validation: Data Pipeline Studio planning and API audit completed in documentation only; no executable code, endpoints, UI routes, upload support, or pipeline execution were added.
- Web Milestone 2 Feature 2 validation: Dataset Inspector Backend added; `GET /api/datasets`, `GET /api/datasets/{dataset_id}/inspection`, focused backend tests, CLI dataset-root configuration, frontend regressions, full pytest, compileall, wheel build, and runtime smoke passed.
- Web Milestone 2 Feature 3 validation: Dataset Inspector UI added on `/data`; frontend typed dataset client, URL selection by safe dataset ID, simple/advanced read-only inspection views, focused UI tests, frontend lint/type/test/build, backend regressions, full pytest, compileall, wheel build, npm audit, and production route/API smoke passed.
- Web Milestone 2 Feature 4 validation: Dataset Source Manager added on `/data`; multiple roots, persistent JSON config, CLI-root merge, validation, enable/disable, recursive opt-in, removal without deletion, catalogue refresh, loopback-only mutation, focused frontend/backend tests, full regressions, and runtime smoke passed. Web track is now paused by owner direction.
- Core audit baseline on July 15, 2026: `import arclm` passed, `compileall src/arclm` passed, `pip wheel . --no-deps` passed, public API tests passed with `22 passed`, compatibility tests passed with `15 passed`, focused Core runtime suites passed with `113 passed, 2 skipped`, CLI/package/loader tests passed with `18 passed`, GPU tests skipped correctly in the CPU environment with `8 skipped`, and paused Web regression passed with frontend lint/type/test/build.
- Core audit full-suite result on July 15, 2026: `3 failed, 245 passed, 10 skipped, 4 warnings`. The failures are isolated to paused Web Dataset Inspector tests reading persisted user-local dataset-root configuration instead of isolated test roots.
- Core Feature 1 full-suite result on July 15, 2026 after the Dataset Inspector isolation gate: `259 passed, 10 skipped, 4 warnings`. The three paused-Web Dataset Inspector isolation failures are resolved; no Core lifecycle tests failed.
- Current stable center: datasets, single-device training, basic evaluation, full fine-tuning/SFT, built-in LoRA on native and tiny Hugging Face models, basic inference, checkpoint loading, final model artifacts, PEFT adapter artifacts.
- Current weak areas: Web workflow pages beyond the dashboard, real bitsandbytes QLoRA runtime validation, distributed runtime, multi-GPU PEFT, serving, deployment, monitoring integrations, security, retrieval, agents, enterprise.

[ASSUMPTIONS]

- Current users are developers and students who need local, inspectable AI workflows before production scale.
- Community remains useful by itself: model building, tokenizers, datasets, training, checkpoints, evaluation, fine-tuning, inference, base classes, and adapters.
- Pro should extend Community with operational complexity: distributed training, advanced PEFT automation, serving, dashboards, cloud deployment, large benchmarks, team controls, and enterprise governance.
- Supported Python in `pyproject.toml` is currently `>=3.9,<3.13`, but many current ML dependencies on PyPI require Python 3.10+. This needs a compatibility decision before dependency changes.
- The default test suite must keep working on CPU-only machines.
- CUDA, multi-GPU, quantization, and serving tests should be optional and isolated.
- External model support must be explicit and contract-based. ArcLM should not claim universal model support.
- Optional cloud and hosted integrations must never be imported or contacted implicitly.
- Backward compatibility shims should stay until there is a documented migration window; their warnings are inventoried in [WARNING_INVENTORY.md](WARNING_INVENTORY.md).
- Licensing and Pro packaging are product decisions, not source-code facts.
- Security must be scoped honestly. ArcLM currently has light preprocessing helpers, not a complete security product.

[CURRENT_REPOSITORY_STATE]

- Environment: Windows 11, Python `3.12.10`, PyTorch `2.13.0+cpu`, CUDA unavailable.
- Local GPU validation environment: `.venv-gpu-validation`, Python `3.12.10`, PyTorch `2.5.1+cu121`, CUDA runtime `12.1`, NVIDIA GeForce GTX 1050 Ti, compute capability `6.1`, `sm_61` present.
- Installed relevant optional packages: transformers, tokenizers, safetensors, Flask, NumPy, SentencePiece, PyYAML, BeautifulSoup, tqdm.
- Missing relevant optional packages in this environment: datasets, accelerate, peft, webdataset, ONNX, ONNX Runtime, vLLM, MLflow, Weights & Biases, TensorBoard. The external `peft` package is not required for built-in ArcLM LoRA.
- Web experience: a legacy/simple Flask HTML interface exists; the modern frontend foundation, Simple Dashboard, and Advanced Dashboard now exist under `web/`.
- Web track handover: [WEB_PAUSE_AND_CORE_HANDOVER.md](WEB_PAUSE_AND_CORE_HANDOVER.md).
- Core audit docs: [../core/overview.md](../core/overview.md) and [../core/current-capabilities.md](../core/current-capabilities.md).
- Core-first implementation plan: [../core/core-first-implementation-plan.md](../core/core-first-implementation-plan.md).
- Public APIs are lazy-loaded from `src/arclm/__init__.py` and domain packages.
- Evidence audit documents already exist under `docs/status/` and remain useful historical evidence.
- New planning documents live under `docs/project/`.

[FEATURE_STATUS]

The primary planning matrix is in [FEATURE_MATRIX.md](FEATURE_MATRIX.md). Summary:

| Category | Implemented | Partial | Experimental | Interface Only | Not Implemented |
| -------- | ----------: | ------: | -----------: | -------------: | --------------: |
| Training | 13 | 2 | 1 | 0 | 13 |
| Architectures | 2 | 2 | 1 | 0 | 12 |
| Tokenizers | 7 | 6 | 1 | 0 | 0 |
| Data | 14 | 5 | 1 | 2 | 3 |
| NLP Tasks | 2 | 4 | 0 | 0 | 13 |
| Multimodal | 0 | 0 | 0 | 0 | 6 |
| Inference | 7 | 3 | 2 | 0 | 7 |
| Retrieval | 0 | 0 | 0 | 0 | 12 |
| Agents | 0 | 0 | 0 | 0 | 12 |
| Reasoning | 0 | 0 | 0 | 0 | 8 |
| Optimization | 0 | 1 | 2 | 0 | 11 |
| Deployment | 0 | 1 | 2 | 0 | 14 |
| Evaluation | 8 | 2 | 0 | 0 | 12 |
| Monitoring | 3 | 5 | 1 | 0 | 8 |
| Developer Experience | 8 | 9 | 1 | 1 | 7 |
| Security | 0 | 5 | 0 | 0 | 10 |
| Integrations | 0 | 1 | 2 | 0 | 9 |
| Research | 0 | 4 | 0 | 0 | 7 |
| Utilities | 6 | 4 | 0 | 0 | 3 |
| Enterprise | 0 | 0 | 0 | 0 | 14 |

[TECH_STACK]

- Language: Python.
- Runtime: Python `>=3.9,<3.13` in packaging; tested here on Python `3.12.10`.
- ML framework: PyTorch.
- Packaging: setuptools with `src/` layout.
- Testing: pytest.
- Type marker: `src/arclm/py.typed`; type coverage remains partial.
- Documentation: Markdown in `docs/`, README, versioned docs.
- Serving: simple Flask interface exists; production serving is not implemented.
- Web frontend/backend: Feature 1 implemented an optional Next.js workspace under `web/`; Feature 2 implemented the first design system; Feature 3 implemented the shared application shell; Feature 4 implemented the local read-only Web API and frontend API client; Feature 5 implemented the Simple Dashboard; Feature 6 implemented the Advanced Dashboard.
- Storage: local files for checkpoints, datasets, configs, logs, and artifacts.
- Deployment: no stable deployment automation.
- Monitoring: basic training/evaluation metrics and local run manifests; external tracking services remain compatibility-only.
- Optional integrations: Transformers, external PEFT, datasets, safetensors, Flask, PyYAML, BeautifulSoup, tqdm, future serving/export/tracking packages.

[DEPENDENCY_VERSIONS]

Dependency recommendations and PyPI metadata are in [DEPENDENCIES.md](DEPENDENCIES.md). No dependency changes were made.

[SYSTEM_FLOW]

Data processing:

```text
File/list input -> DatasetLoader -> DataPipeline steps -> Dataset/DataBundle -> DataLoader
```

Tokenization:

```text
Text or chat record -> Tokenizer/TokenizerAdapter -> ids/masks -> SFTDataCollator
```

Training:

```text
Dataset/DataLoader -> Trainer.prepare_batch -> model forward -> loss -> accumulation -> optimizer/scheduler -> state -> callbacks -> checkpoint
```

Fine-tuning:

```text
Records -> formatter -> tokenizer adapter -> collator -> FullFineTuner/SFTTrainer -> Trainer -> checkpoint
```

PEFT fine-tuning:

```text
Records -> formatter -> tokenizer adapter -> LoRA injection -> FullFineTuner/SFTTrainer -> Trainer -> checkpoint -> adapter artifact or merged final artifact
```

Evaluation:

```text
Dataset -> Evaluator -> no-grad forward -> loss/logits/labels -> metrics -> EvaluationResult
```

Inference:

```text
Checkpoint or external model -> loader -> generator/predict -> text output
```

Serving:

```text
Client -> Flask simple interface -> local model loader/generator -> response
```

Web Experience:

```text
Browser -> ArcLM Web API -> existing ArcLM Python APIs -> environment/project results -> ArcLM Web API -> Browser
```

Retrieval, agents, deployment, monitoring, and enterprise requests are planned flows only until implemented and tested.

[ARCHITECTURE]

- Domain packages should stay explicit: `datasets`, `training`, `finetuning`, `evaluation`, `inference`, `checkpoints`, `tokenizers`, `models`, `monitoring`, `serving`, `optimization`, `deployment`, `security`, `retrieval`, `agents`.
- Shared code should be created only when at least two real domains reuse it.
- Community code should not import Pro-only dependencies.
- Model adapter boundary: standard PyTorch models must satisfy a documented forward contract or use adapters.
- Tokenizer adapter boundary: custom tokenizers need `encode`, `decode`, or callable behavior plus optional chat template support.
- Optional dependency boundary: imports must fail with clear errors and never block `import arclm`.
- Plugin boundary: keep current plugin protocol lightweight until discovery and permissions are real.
- Server boundary: serving must stay separate from local inference and training.
- Web UI boundary: the browser must call a thin local ArcLM Web API, not shell commands or parsed terminal output.
- Web dependency boundary: frontend tooling and API server packages must stay optional and must not break `import arclm`.
- Enterprise boundary: auth, RBAC, audit logs, billing, and license checks belong outside the Community core.

[PUBLIC_API_RULES]

- Prefer `from arclm.training import Trainer`, `from arclm.evaluation import Evaluator`, `from arclm.finetuning import SFTTrainer`, `from arclm.datasets import load_dataset`.
- Keep existing compatibility paths until migration docs and tests prove safe removal.
- New public names should be simple English nouns and verbs.
- Public imports must be tested before they are documented as stable.
- Optional dependencies must not be imported at package import time.
- Avoid duplicate concepts. Existing confusing names are tracked in `[ORPHANS & PENDING]`.

[MODEL_SUPPORT]

See [API_DESIGN.md](API_DESIGN.md) for contracts.

- Native ArcLM causal model support is implemented.
- Standard PyTorch support is strongest for training/fine-tuning contracts.
- Hugging Face support is partial and optional; real local HF runtime tests are still needed.
- Custom external models are supported for SFT/fine-tuning through adapters.
- Non-PyTorch runtimes are not implemented.

[COMMUNITY_PRO_SPLIT]

The recommended split is in [COMMUNITY_PRO.md](COMMUNITY_PRO.md). Short version:

- Community: local-first core library, basic model/data/training/eval/SFT/inference workflows.
- Shared Core: optional external model bridges and dependency-heavy adapters that many local users need.
- Pro: operational systems, advanced PEFT automation, distributed training, serving, cloud, dashboards, enterprise, large benchmarks.

[MILESTONES]

Detailed milestones are in [MILESTONES.md](MILESTONES.md). Recommended first milestone:

```text
Web Milestone 1: Interface Foundation and Dashboards
```

The owner has paused the Web Experience track and made the Core Track the active priority. Web Milestone 1 is complete. Web Milestone 2 / Feature 1 planning, Feature 2 Dataset Inspector Backend, Feature 3 Dataset Inspector UI, and Feature 4 Dataset Source Manager are complete. Web Milestone 2 execution/upload features and ML/product milestones remain planned but unapproved until separately approved.

Current Core Milestone 2 feature state:

```text
Full Fine-Tuning and SFT Stabilization: Implemented and verified
LoRA and General PEFT Foundation: Implemented and verified
QLoRA and Quantized Fine-Tuning Foundation: Implemented foundation and locally verified at CPU-safe boundary
Hugging Face and QLoRA Runtime Validation Matrix: Implemented and verified; bitsandbytes runtime pending
Experiment Tracking and Reproducible Run Manifests: Implemented and verified
Hyperparameter Search Foundation: Implemented and verified
Other PEFT methods: Not implemented
Hugging Face PEFT runtime: Verified for ArcLM-owned LoRA tiny local fixtures
GPU PEFT runtime: Verified for ArcLM-owned LoRA tiny local fixture on GTX 1050 Ti
```

Current Web Milestone 1 feature state:

```text
Frontend Foundation: Implemented and verified
Design System: Implemented and verified
Application Shell: Implemented and verified
ArcLM Local Web Backend: Implemented and verified
Frontend API Client Foundation: Implemented and verified
Simple Dashboard: Implemented and verified
Advanced Dashboard: Implemented and verified
Data Pipeline Studio: In progress; backend inspection only
Data Pipeline Studio planning/API audit: Complete
Dataset Inspector Backend: Implemented and verified
Dataset Inspector UI: Implemented and verified
Dataset Source Manager: Implemented and verified
Multiple Dataset Roots: Implemented and verified
Dashboard Root Configuration: Implemented and verified
Dataset Upload: Not implemented
Approved Pipeline Step Registry: Not implemented
Pipeline Preview: Not implemented
```

[TEST_STRATEGY]

The full strategy is in [TEST_STRATEGY.md](TEST_STRATEGY.md). Rules:

- CPU pytest remains the default gate.
- CUDA, PEFT, HF real-model, distributed, serving, export, and cloud tests are optional environment gates.
- Web Milestone 1 Features 1-6 passed frontend lint/type/build/unit checks, production/backend smoke, npm audit, Python endpoint tests, public API/compatibility tests, full pytest, wheel build, and import/compile regressions.
- Local single-GPU CUDA correctness is verified on the GTX 1050 Ti for FP32, FP16, BF16, checkpoint/resume, inference, and safe OOM propagation. Multi-GPU remains unverified locally.
- A feature cannot be marked implemented until tests and runtime validation exist.

[SECURITY_RULES]

The security plan is in [SECURITY_MODEL.md](SECURITY_MODEL.md). Core rules:

- No hidden network activity.
- No automatic code or browser execution.
- No raw PII, prompts, secrets, or full model responses in logs by default.
- Tool and agent systems require explicit permissions and sandboxing before stability claims.
- Private hidden chain-of-thought must not be exposed or stored.

[LOGGING_STRATEGY]

- Use standard Python logging compatibility.
- Keep training/evaluation callbacks as the basic monitoring extension point.
- Keep local logs and run manifests structured and small.
- Redact secrets and avoid raw PII by default.
- External tracking integrations remain optional and Pro-oriented until tested.

[COMPATIBILITY]

- Keep `arclm.sft`, `arclm.trainer`, `arclm.loaders`, and old config paths while tests cover them.
- Document duplicate names:
  - `arclm.training.TrainingConfig` versus `arclm.configs.TrainingConfig`.
  - `arclm.training.ModelAdapter` versus `arclm.finetuning.ModelAdapter`.
- Do not rename public APIs without aliases, warnings, and migration tests.

[RISKS]

- Dirty/untracked migration state can hide packaging problems; `pip wheel . --no-deps` passed in Milestone 0, but the tree still needs owner-level git normalization.
- Python version support is inconsistent with newer ML dependency metadata.
- CLI runtime smoke paths for train/eval/generate are now covered with tiny CPU fixtures; broader real-world CLI scenarios remain future work.
- Advanced docs/examples may look like stable feature claims.
- Compatibility tests intentionally emit 3 deprecation warnings to prove old imports still guide users to new APIs.
- Optional integration code may rot without optional CI.
- Web UI can drift into a second product if it duplicates CLI/training/evaluation logic instead of reusing Python APIs.
- The legacy Flask simple interface may confuse users once the modern Web UI exists; keep it documented as compatibility/experimental until a migration is approved.
- Feature 1 uses an optional Node workspace; future contributors must avoid adding Node dependencies to Python package installation.
- Security-related preprocessing helpers could be mistaken for complete safety systems.

[DECISIONS]

Initial decision records are in [DECISIONS.md](DECISIONS.md). All are proposed unless explicitly accepted by the project owner.

[ORPHANS & PENDING]

| ID | Description | Category | Status | Evidence | Blocked by | Recommended action | Target milestone |
| -- | ----------- | -------- | ------ | -------- | ---------- | ------------------ | ---------------- |
| OP-001 | Normalize `src/` migration and deleted top-level package files in git status. | Packaging | Blocked | `git status --short` shows deleted top-level `arclm/` files and untracked `src/`. `pip wheel . --no-deps` passes. | Owner decision on commit/staging state | Commit or otherwise stabilize tree before new features | 0 |
| OP-002 | Decide Python floor: keep 3.9 support or move to 3.10+ to match dependency ecosystem. | Dependencies | Open | `pyproject.toml` declares `>=3.9,<3.13`; current PyPI metadata for several ML packages trends `>=3.10`. | Product compatibility decision | Test Python 3.9/3.10/3.11/3.12 matrix before changing metadata | 0 |
| OP-003 | CLI runtime subcommands appear less validated than Python APIs. | Developer Experience | Resolved in Milestone 1 | CLI help/discovery and tiny CPU train/eval/generate runtime smoke tests pass. | None | Keep broader CLI scenarios as future enhancement, not a blocker | 1 |
| OP-004 | Duplicate `TrainingConfig` names can confuse users. | Compatibility | Resolved in Milestone 1 | Public API tests lock the behavior; docs explain recommended and legacy paths. | None | Keep documented until a future migration is approved | 1 |
| OP-005 | Duplicate `ModelAdapter` names have different responsibilities. | Compatibility | Resolved in Milestone 1 | Public API tests lock the behavior; docs explain domain-specific imports. | None | Keep documented until a future migration is approved | 1 |
| OP-006 | LoRA exists only as experimental optional paths. | Fine-tuning | Open | Feature matrix marks LoRA experimental; PEFT is not installed in the validated environment. | PEFT dependency and runtime tests | Build PEFT foundation after Web Milestone 1 review if approved | Later ML milestone |
| OP-007 | Hugging Face support lacks real local model runtime matrix. | External Models | Open | Feature matrix marks HF model/tokenizer support experimental or partial; tests use fake/local contracts. | Optional test fixtures | Add tiny local HF config/model tests | 3 |
| OP-008 | Local experiment tracking coverage and contract stabilized. | Monitoring | Resolved in Core 2 Feature 5 | `tests/tracking` covers run lifecycle, metrics/events, references, trainer callback, fine-tuning/QLoRA metadata, legacy compatibility, validation, listing, and comparison. | None | Keep external tracking services optional and separately validated | Core 2 Feature 5 |
| OP-009 | Simple Flask UI exists but serving is not production. | Serving/Web | Partially resolved | Modern read-only Web API has endpoint tests and localhost smoke; legacy Flask remains experimental compatibility. | Production serving milestone | Keep Flask as compatibility path; do not claim model serving from Feature 4 | Serving later |
| OP-010 | PII/toxicity helpers are light preprocessing, not complete security. | Security | Open | `preprocess/pii.py` and `preprocess/toxicity.py` are small helpers, not a full security system. | Security scope decision | Document limitations and avoid safety guarantees | 15 |
| OP-011 | Retrieval, agents, multimodal, and enterprise are absent. | Roadmap | Open | Feature matrix marks these categories mostly or entirely not implemented. | Core stabilization | Keep planned until prerequisite milestones pass | Later |
| OP-012 | No implementation for private hidden chain-of-thought handling exists yet. | Security | Open | Decision record DEC-011 sets policy; no reasoning/agent implementation exists. | Product policy | Keep "do not expose or store" policy before agent work | 13 |
| OP-013 | Active venv cannot run `python -m build` because the `build` package is missing, although `pip wheel . --no-deps` succeeds. | Packaging | Blocked | `python -m build` returned `No module named build`; `pip wheel . --no-deps` built `arclm-0.6.1-py3-none-any.whl`. | Dev environment dependency | Install `arclm[dev]` or `build` in release validation environments; keep package metadata unchanged in Milestone 0 | 0 |
| OP-014 | Multi-GPU runtime validation is not available on the local laptop. | GPU Validation | Open | Local GTX 1050 Ti has one CUDA device; Core 3 Feature 6 prepared provider-independent external gates; Core 4 Features 1-5 added FSDP capability checks, wrapping boundary, sharded checkpoint policy, optimizer-state policy, and resume/artifact handoff policy, but no FSDP runtime pass, DDP world-size-two pass, or multi-GPU checkpoint runtime was run. | At least two CUDA GPUs | Run the matrix commands from `get_external_multi_gpu_validation_matrix()` on a suitable runner after implementations exist | External validation |
| OP-015 | Modern BF16 cloud validation is still needed before broad BF16 hardware claims. | GPU Validation | Open | BF16 correctness passed locally on PyTorch `2.5.1+cu121`; native BF16 acceleration was not proven. | Modern BF16-capable CUDA runner | Run BF16 training/eval/checkpoint tests on a modern BF16 GPU and record capability details | GPU/Release |
| OP-016 | Modern Web UI workspace needs the rest of Web Milestone 1. | Web Experience | Resolved in Web Milestone 1 | `web/` now contains the verified frontend foundation, source-owned design system, application shell, frontend API client, Simple Dashboard, and Advanced Dashboard. `src/arclm/web` contains the verified local read-only API. | None | Keep Web Milestone 2 workflows planned until separately approved | Web 1 |
| OP-017 | Data Pipeline Studio, training dashboards, model/project management, and plugin management are planned but unapproved. | Web Experience | Partially resolved | Web Milestone 2 / Features 1-4 completed planning, read-only dataset backend inspection, Dataset Inspector UI, and Dataset Source Manager. Upload, execution, training handoff, and later workflow pages remain unapproved. | Owner approval for each implementation feature | Keep planned pages honest with `Planned` states only; implement one Web 2 slice at a time | Web 2-5 |
| OP-018 | Data Pipeline Studio needs safe dataset inspection before upload or execution. | Web Experience / Data | Resolved in Web 2 Feature 3 | `GET /api/datasets`, `GET /api/datasets/{dataset_id}/inspection`, and `/data` read-only UI are implemented with safe IDs, bounded preview, security tests, and runtime smoke. | None | Keep upload and pipeline execution closed until separately approved | Web 2 Feature 3 |
| OP-019 | Dataset upload, step registry, pipeline preview, manifests, dry run, and training handoff remain missing. | Web Experience / Data | Paused | Feature 4 intentionally added source management only. `docs/web/data-pipeline-studio.md` lists the remaining slices. | Owner reactivation of Web track | Do not implement until Web is explicitly reactivated | Web 2 |
| OP-020 | Default full pytest was contaminated by persisted local dataset-root configuration. | Test Reliability / Web | Resolved | `tests/web/datasets/test_dataset_inspector.py` now injects an explicit temporary dataset config path outside the dataset root; full pytest is `259 passed, 10 skipped, 4 warnings`. | None | Keep future Web dataset tests isolated from user-local config and persisted roots | Core stability gate |
| OP-021 | ArcLM lacked a unified model lifecycle and configuration contract. | Core / Model Lifecycle | Resolved in Core 1 Feature 1 | `arclm.lifecycle` defines source/artifact/tokenizer metadata; checkpoints include `lifecycle_metadata`; `Config.load_config_from_model()` is implemented. | None | Keep hardening lifecycle metadata in later checkpoint and inference milestones | Core 1 Feature 1 |
| OP-022 | Checkpoints need stronger reproducibility and trusted-loading policy. | Core / Checkpoints | Resolved in Core 1 Feature 2 | `CheckpointInfo`, `inspect_checkpoint`, `validate_checkpoint`, format/version metadata, RNG state, atomic write validation, and deterministic resume tests are implemented. | None | Keep checksum/signature, mid-epoch dataloader position, and callback-state protocol as future hardening | Core 1 Feature 2 |
| OP-023 | Final model artifacts need a distinct save/load contract separate from training checkpoints. | Core / Model Lifecycle | Resolved in Core 1 Feature 3 | `save_model_artifact`, `load_model_artifact`, `validate_model_artifact`, `manifest.json`, file inventory, SHA-256 hashes, native CPU round trip, PyTorch factory boundary, tokenizer persistence, and checkpoint/artifact separation tests are implemented. | None | Keep HF runtime, GPU portability, signatures, PEFT adapters, and export formats as future work | Core 1 Feature 3 |
| OP-024 | Full fine-tuning and SFT need stabilization against the new lifecycle and final artifact contract. | Core / Fine-Tuning | Resolved in Core 2 Feature 1 | `FineTuningConfig`, `prepare_fine_tuning_dataset`, `fine_tune`, dataset reports/fingerprints, CPU native SFT runtime, checkpoint/resume, final artifact reload, evaluation, inference, public API, and compatibility tests pass. | None | Keep optional HF/GPU matrices as separate validation work | Core 2 Feature 1 |
| OP-025 | LoRA and general PEFT need a stable optional foundation. | Core / PEFT | Resolved in Core 2 Feature 2 | `arclm.peft`, built-in `LoRAConfig`, `LoRALinear`, adapter artifacts, `fine_tune(..., peft_config=...)`, checkpoint/resume, adapter reload, merge/final artifact, evaluation, inference, and public API tests are implemented. | None | Keep real HF PEFT runtime, GPU PEFT runtime, and other PEFT methods as future work | Core 2 Feature 2 |
| OP-026 | QLoRA needs real bitsandbytes runtime validation after the foundation. | Core / PEFT / Quantization | Partially resolved | Core 2 Feature 4 verifies local Hugging Face CPU runtime, CUDA Hugging Face forward, CUDA LoRA, bounded environment reports, and missing bitsandbytes detection. Real 4-bit model loading/training was not executed because bitsandbytes is not installed in `.venv-training-core` or `.venv-gpu-validation`. | Optional `arclm[qlora]` environment with bitsandbytes and supported CUDA hardware | Run `python -m pytest tests/quantization -v -m "bitsandbytes and qlora"` before claiming production QLoRA runtime support | Optional QLoRA validation gate |
| OP-027 | External experiment tracking services are compatibility-only and not stable. | Monitoring / Integrations | Open | Local `ExperimentTracker` compatibility writes through run manifests; MLflow and W&B are imported lazily but not installed or runtime-verified in the baseline. | Optional service dependencies and product boundary | Keep external service integrations Pro-oriented until focused tests and docs are approved | Later monitoring milestone |
| OP-028 | Hyperparameter search foundation was missing. | Core / Search | Resolved in Core 2 Feature 6 | `arclm.search`, search manifests, typed parameter definitions, deterministic grid/random generation, one run per trial, resume, failure policy, bounded retry, inspection, validation, listing, comparison, best-config export, and CPU runtime search tests pass. | None | Keep parallel/distributed/adaptive search deferred until separately approved | Core 2 Feature 6 |
| OP-029 | Distributed runtime process contracts were missing. | Core / Distributed | Resolved in Core 3 Feature 1 | `arclm.distributed` provides config/env parsing, runtime inspection, backend checks, device resolution, and no process-group side effects; `tests/distributed` passes. | None | Continue with deeper config validation before process-group lifecycle tests | Core 3 Feature 1 |
| OP-030 | DDP trainer integration is not implemented. | Core / Distributed | Resolved in Core 3 Feature 7 | `Trainer(..., distributed_config=...)` wraps with DDP, uses `DistributedSampler`, trains across two CPU/Gloo processes, and writes checkpoints only on rank 0. | None | Keep real two-GPU CUDA runtime as external validation | Core 3 Feature 7 |
| OP-031 | Real two-GPU CUDA DDP runtime validation remains pending. | GPU Validation | Open | Core 3 Feature 9 added a real external gate in `tests/gpu/test_two_gpu_ddp_runtime.py`; local `.venv-training-core` selected it and skipped because CUDA is unavailable. No real two-GPU CUDA DDP runtime has passed yet. | At least two CUDA GPUs with NCCL | Run `python -m pytest tests/gpu -v -m "multi_gpu and distributed"` after suitable hardware is available | External validation |
| OP-032 | Distributed checkpoint/resume hardening is not implemented. | Core / Distributed | Resolved in Core 3 Feature 8 | `Trainer.save_checkpoint(..., synchronize=True)` provides all-rank save synchronization around rank-zero writes; distributed `load_checkpoint()` synchronizes ranks before and after loading; CPU/Gloo DDP resume with new model/trainer objects is tested. | None | Keep real two-GPU CUDA checkpoint/resume as external validation | Core 3 Feature 8 |

[NEXT_APPROVED_ACTION]

Recommended next action: Core Milestone 4 / Feature 6: External Hardware Validation. This is not approved automatically. Do not implement this feature, Web Pipeline Step Registry, upload, pipeline execution, training handoff, DPO, RLHF, serving, or any later milestone until the owner explicitly approves it.
