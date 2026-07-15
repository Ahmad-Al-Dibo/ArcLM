# ArcLM Project Map

This file is the planning source of truth for ArcLM after the July 15, 2026 repository audit.

[PROJECT_STATUS]

- Planning state: Web Experience track approved by the owner; Web Milestone 1 is complete and locally verified. Web Milestone 2 / Feature 1 planning and API audit is complete. Web Milestone 2 / Feature 2 Dataset Inspector Backend is implemented and locally verified.
- Implementation gate: closed until Web Milestone 2 / Feature 3 or another implementation feature is explicitly approved. Later ML/product milestones remain closed until separately approved.
- Roadmap priority note: LoRA/PEFT, additional SFT expansion, and other ML feature milestones remain planned, but they are postponed behind the current Web Experience track.
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
- Current stable center: datasets, single-device training, basic evaluation, full fine-tuning/SFT, basic inference, checkpoint loading.
- Current weak areas: Web workflow pages beyond the dashboard, real Hugging Face runtime validation, LoRA/PEFT stability, serving, deployment, monitoring, security, retrieval, agents, enterprise.

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
- Missing relevant optional packages in this environment: datasets, accelerate, peft, webdataset, ONNX, ONNX Runtime, vLLM, MLflow, Weights & Biases, TensorBoard.
- Web experience: a legacy/simple Flask HTML interface exists; the modern frontend foundation, Simple Dashboard, and Advanced Dashboard now exist under `web/`.
- Public APIs are lazy-loaded from `src/arclm/__init__.py` and domain packages.
- Evidence audit documents already exist under `docs/status/` and remain useful historical evidence.
- New planning documents live under `docs/project/`.

[FEATURE_STATUS]

The primary planning matrix is in [FEATURE_MATRIX.md](FEATURE_MATRIX.md). Summary:

| Category | Implemented | Partial | Experimental | Interface Only | Not Implemented |
| -------- | ----------: | ------: | -----------: | -------------: | --------------: |
| Training | 12 | 2 | 2 | 0 | 13 |
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
- Monitoring: basic training/evaluation metrics and experimental tracking.
- Optional integrations: Transformers, PEFT, datasets, safetensors, Flask, PyYAML, BeautifulSoup, tqdm, future serving/export/tracking packages.

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

The owner has chosen the Web Experience track as the next active direction. Web Milestone 1 is complete and reviewed in this project state. Web Milestone 2 / Feature 1 planning and Web Milestone 2 / Feature 2 Dataset Inspector Backend are complete. Web Milestone 2 UI/execution features and earlier ML milestones such as LoRA/PEFT remain planned but unapproved until separately approved.

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
Dataset Inspector UI: Recommended next action, not approved automatically
Dataset Upload: Not implemented
Pipeline Step Registry: Not implemented
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
- Keep local logs structured and small.
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
| OP-008 | Tracking code has little current test coverage. | Monitoring | Open | `src/arclm/tracking.py` exists; full suite has no focused tracking tests. | Optional deps and design | Stabilize local tracker first | 5 |
| OP-009 | Simple Flask UI exists but serving is not production. | Serving/Web | Partially resolved | Modern read-only Web API has endpoint tests and localhost smoke; legacy Flask remains experimental compatibility. | Production serving milestone | Keep Flask as compatibility path; do not claim model serving from Feature 4 | Serving later |
| OP-010 | PII/toxicity helpers are light preprocessing, not complete security. | Security | Open | `preprocess/pii.py` and `preprocess/toxicity.py` are small helpers, not a full security system. | Security scope decision | Document limitations and avoid safety guarantees | 15 |
| OP-011 | Retrieval, agents, multimodal, and enterprise are absent. | Roadmap | Open | Feature matrix marks these categories mostly or entirely not implemented. | Core stabilization | Keep planned until prerequisite milestones pass | Later |
| OP-012 | No implementation for private hidden chain-of-thought handling exists yet. | Security | Open | Decision record DEC-011 sets policy; no reasoning/agent implementation exists. | Product policy | Keep "do not expose or store" policy before agent work | 13 |
| OP-013 | Active venv cannot run `python -m build` because the `build` package is missing, although `pip wheel . --no-deps` succeeds. | Packaging | Blocked | `python -m build` returned `No module named build`; `pip wheel . --no-deps` built `arclm-0.6.1-py3-none-any.whl`. | Dev environment dependency | Install `arclm[dev]` or `build` in release validation environments; keep package metadata unchanged in Milestone 0 | 0 |
| OP-014 | Multi-GPU runtime validation is not available on the local laptop. | GPU Validation | Open | Local GTX 1050 Ti has one CUDA device; no DDP world-size-two, FSDP, or multi-GPU checkpoint runtime was run. | At least two CUDA GPUs | Run `python -m pytest tests/gpu -v -m "multi_gpu"` on a suitable runner after implementation exists | 8 |
| OP-015 | Modern BF16 cloud validation is still needed before broad BF16 hardware claims. | GPU Validation | Open | BF16 correctness passed locally on PyTorch `2.5.1+cu121`; native BF16 acceleration was not proven. | Modern BF16-capable CUDA runner | Run BF16 training/eval/checkpoint tests on a modern BF16 GPU and record capability details | GPU/Release |
| OP-016 | Modern Web UI workspace needs the rest of Web Milestone 1. | Web Experience | Resolved in Web Milestone 1 | `web/` now contains the verified frontend foundation, source-owned design system, application shell, frontend API client, Simple Dashboard, and Advanced Dashboard. `src/arclm/web` contains the verified local read-only API. | None | Keep Web Milestone 2 workflows planned until separately approved | Web 1 |
| OP-017 | Data Pipeline Studio, training dashboards, model/project management, and plugin management are planned but unapproved. | Web Experience | Partially resolved | Web Milestone 2 / Feature 1 completed the Data Pipeline Studio planning and API audit; Feature 2 completed the read-only Dataset Inspector Backend. Upload, preview UI, execution, training handoff, and later workflow pages remain unapproved. | Owner approval for each implementation feature | Keep planned pages honest with `Planned` states only; implement Dataset Inspector UI only after explicit approval | Web 2-5 |
| OP-018 | Data Pipeline Studio needs safe dataset inspection before upload or execution. | Web Experience / Data | Resolved in Web 2 Feature 2 | `GET /api/datasets` and `GET /api/datasets/{dataset_id}/inspection` are implemented with safe IDs, bounded preview, security tests, and runtime smoke. | None | Build the Dataset Inspector UI as a separate feature | Web 2 Feature 2 |
| OP-019 | Data Pipeline Studio UI, upload, step registry, pipeline preview, manifests, dry run, and training handoff remain missing. | Web Experience / Data | Open | Feature 2 intentionally added only the read-only backend. `docs/web/data-pipeline-studio.md` lists the remaining slices. | Owner approval for Web 2 Feature 3+ | Implement one slice at a time, starting with Dataset Inspector UI | Web 2 |

[NEXT_APPROVED_ACTION]

Recommended next action: Web Milestone 2 / Feature 3: Dataset Inspector UI. This is not approved automatically. Do not implement Feature 3, upload, pipeline execution, training handoff, or any later ML/product milestone until the owner explicitly approves it.
