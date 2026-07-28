# ArcLM Repository Audit - 2026-07-26

This document records the evidence-based repository audit performed for the
current special ArcLM tree. It is an audit snapshot, not a release note and not
a security certification. The package version was not changed.

## Baseline

| Item | Result |
| --- | --- |
| Branch | `sp-version` |
| Package version | `2.12.3` from installed package metadata |
| Python environment | Project virtual environment on Windows |
| PyTorch | `2.5.1+cu121`; CUDA reported available in the local environment |
| Optional deps observed | `cryptography`, `transformers`, `accelerate`, `datasets`, `peft`, `safetensors`, `fastapi`, `uvicorn`, `flask`, `sentencepiece`, `build`, `twine` |
| Package extras observed | `agents`, `agents-all`, `agents-audio`, `agents-web`, `all`, `all-cpu`, `all-cuda`, `all-cuda121`, `cpu`, `cuda`, `cuda121`, `dev`, `examples`, `hf`, `peft`, `preprocess`, `qlora`, `security`, `security-all`, `security-keyring`, `web` |

Initial baseline commands were run before fixing defects. Compile, public API,
examples, lab, package build/twine, frontend test, and frontend lint passed.
The first full Python test run exposed CUDA-aware expectation mismatches, a
Windows distributed-runtime issue, outdated regression assumptions for
historical examples, a Web Studio fake-CUDA reporting inconsistency, a PEFT
test device mismatch, and a TypeScript deprecation setting that blocked the
frontend typecheck/build.

## Architecture Inventory

| Subsystem | Canonical package | Public entry points | Status | Evidence and limits |
| --- | --- | --- | --- | --- |
| Datasets and preprocessing | `arclm.datasets` | `load_dataset`, `validate_records`, `DatasetManifest`, `DatasetReport`, `DataPipeline` | Stable candidate | Covered by unit tests, examples, docs, and wheel smoke. Local data only by default. |
| Tokenizers | `arclm.tokenizers` | `Tokenizer`, `SentencePieceTokenizer`, `AutoTokenizer` | Stable candidate | Word and tiny SentencePiece examples run locally. SentencePiece remains optional. |
| Native models | `arclm.models` | `ArcLM`, `MiniGPT`, `AutoModel`, capability helpers | Stable candidate | Tiny native model creation, forward pass, save/reload, generation, and inspection verified. `MiniGPT` remains deprecated compatibility. |
| Model loading and artifacts | `arclm.inference`, `arclm.checkpoints` | `load_any_model`, `SmartLoader`, `inspect_model_source`, artifact helpers | Beta | Native/local workflows verified. External Hugging Face loading is integration-compatible and requires real local weights. |
| Training | `arclm.training` | `Trainer`, `TrainingConfig`, `train_model`, checkpoint callbacks | Stable candidate | CPU training path and checkpoint metadata verified. Distributed helpers are experimental. |
| Fine-tuning and SFT | `arclm.finetuning` | `FineTuningConfig`, `prepare_fine_tuning_record`, `prepare_fine_tuning_dataset`, `fine_tune`, `train_sft` | Beta | Preview/validation/prepared-record paths verified; PEFT/LoRA remains optional and hardware/model dependent. |
| Checkpoints | `arclm.checkpoints`, `arclm.checkpoints.training` | `atomic_save_checkpoint`, `safe_load_training_checkpoint`, `inspect_checkpoint`, `validate_checkpoint` | Stable candidate | Metadata, RNG state, safe load, and compatibility tests pass. Legacy loading remains compatibility-only. |
| Evaluation and benchmarks | `arclm.evaluation` | `Accuracy`, `Perplexity`, `calculate_perplexity`, `predict_top_k`, report helpers | Stable candidate | Metrics, top-k, report serialization, and concept/long-context helpers covered. Benchmark comparisons are scoped, not model-quality claims. |
| Inference and generation | `arclm.inference` | `Generator`, `GenerationConfig`, `predict`, external/native helpers | Stable candidate for native; beta for external | Bounded local generation verified. Streaming and production serving are unsupported. |
| Inspection and pipelines | `arclm.inspection`, `arclm.training` | `inspect_text`, `PipelineTrace`, `UnifiedPipeline` | Beta | Tensor shape/value inspection verified. Attention tensor capture remains planned/unsupported. |
| Agents | `arclm.agents` | `Agent`, `AgentRunner`, `tool`, `ToolRegistry`, messages, permissions, tracing | Beta | Deterministic fake-model tool loop verified. Production autonomy/provider execution is not claimed. |
| Security | `arclm.security` | `SecurityPolicy`, encryption, hashing, signatures, redaction, audit/status helpers | Beta | Encryption round trip, tamper rejection, signatures, redaction, safe web transport and artifact boundaries tested. No security certification is claimed. |
| CLI and diagnostics | `arclm.cli`, `arclm doctor` | Console and module commands | Beta | Import/doctor/web CLI behavior tested. CLI avoids exposing local secrets in browser-facing diagnostics. |
| Web Studio | `arclm.web`, `web/` | FastAPI backend and Next.js frontend | Beta | Backend tests, frontend tests, typecheck, lint, and production build pass. Local single-process app; no production auth/database/streaming. |
| Lab | `lab` | `python -m lab.runner list`, `python -m lab.runner test-all` | Educational | 4 learning levels, 32 challenges, and 64 lab checks pass. Learner stubs are intentional and isolated from production. |
| Examples | `examples` | `examples/run_examples.py` and manifest | Validated | 31 manifest entries; 28 locally runnable verified entries pass; 3 manual optional entries documented. |
| Documentation system | `README.md`, `docs/`, `documentation-site/` | Markdown docs and static site | Validated | Docs tests, standalone copy check, and examples catalog verified. |

## Public API Inventory

The root package lazily exposes 171 names through `arclm.__all__`. Domain
packages expose the following public surfaces: datasets 38 names, tokenizers 5,
models 8, training 31, fine-tuning 33, checkpoints 18, evaluation 30, inference
21, agents 50, and security 39. Current examples prefer domain imports.

| Import family | Purpose | Status | Example coverage | Test coverage |
| --- | --- | --- | --- | --- |
| `arclm.datasets.*` | Local records, validation, reports, data pipeline | Stable candidate | Yes | Yes |
| `arclm.tokenizers.*` | Word and SentencePiece tokenization | Stable candidate | Yes | Yes |
| `arclm.models.ArcLM` | Tiny native causal LM | Stable candidate | Yes | Yes |
| `arclm.training.*` | Native trainer and compatibility helpers | Stable candidate/beta | Yes | Yes |
| `arclm.finetuning.*` | SFT formatting, preview, training, PEFT adapters | Beta | Yes | Yes |
| `arclm.checkpoints.*` | Loading, inspection, compatibility | Stable candidate | Yes | Yes |
| `arclm.evaluation.*` | Metrics, reports, diagnostics, benchmarks | Stable candidate | Yes | Yes |
| `arclm.inference.*` | Generation, native/external inference helpers | Stable candidate/beta | Yes | Yes |
| `arclm.agents.*` | Tool runtime, sessions, tracing, permissions | Beta | Yes | Yes |
| `arclm.security.*` | Encryption, signatures, redaction, safe artifact policy | Beta | Yes | Yes |
| Deprecated root and legacy aliases | Compatibility for older users | Deprecated | Avoided by new examples | Yes |

## Test Actions

No tests were removed. Failing tests were investigated and either matched a real
defect or an obsolete assumption.

| Action | Files |
| --- | --- |
| Updated | `tests/checkpoints/test_training_checkpoint.py`, `tests/models/test_model_artifacts.py`, `tests/peft/test_lora_finetuning_runtime.py`, `tests/regression/test_gemma_example.py`, `tests/regression/test_qwen_structured_output_example.py`, `tests/regression/test_qwen_thinking_example.py` |
| Replaced obsolete assumptions | Gemma/Qwen regression tests now assert that historical unverified examples are noncanonical and that current capability reporting is honest. |
| Split/merged/removed | None |
| New tests already present from examples rebuild | `tests/examples/` manifest and runner coverage |

The full test inventory observed 104 `test_*.py` files. The audit kept the
existing organization because broad test movement would not improve behavior.

## Production Fixes

| Area | Fix |
| --- | --- |
| Checkpoint tests | CUDA RNG expectations now distinguish real CUDA availability from CPU-only runs. |
| Distributed runtime | Windows `tcp://` init methods append `use_libuv=0` when needed, including explicit init methods and master-address construction. |
| Model artifact tests | Device and precision assertions now match real CUDA availability and invalid CUDA-index behavior. |
| PEFT runtime tests | Tiny LoRA runtime test pins its training config to CPU for deterministic local verification. |
| Web Studio backend | Environment reporting now derives CUDA status, runtime, device count, GPU list, and BF16 support from the injected torch object consistently. |
| Web Studio workspace | JSON reads retry briefly after `PermissionError` to tolerate Windows atomic-replace races. |
| Frontend config | TypeScript deprecation setting now matches the installed compiler line. |

Deferred issues are documented as limits rather than hidden claims: external
model workflows require real local assets, PEFT/QLoRA depends on optional
packages and hardware, distributed execution is experimental, attention-map
capture is not implemented, and Web Studio is local/beta rather than production
serving.

## Examples and Lab

The current examples suite has 31 manifest entries: 27 `verified`, 1
`verified_with_fake_backend`, and 3 `manual_optional`. `run-verified` executes
28 examples covering quick start, data, tokenizers, native models, training,
SFT preview and tiny SFT, checkpoints, evaluation, generation, inspection,
agents, security, and six complete projects. `old-examples/` remains historical
and noncanonical.

The Lab has beginner, intermediate, advanced, and expert tracks. The runner
lists 32 learner challenges and `test-all` verifies 64 checks. Stubs remain
intentional learner exercises and are not classified as production defects.

## Documentation and Site

`README.md`, `docs/special-version.md`, `examples/README.md`,
`examples/STATUS.md`, and `documentation-site/data/examples-catalog.js` now
reflect the verified examples suite and current feature status. The static site
contains guides, API pages, examples pages, reference pages, static data
catalogs, local assets, navigation, and search data. A standalone copy of
`documentation-site/` was verified outside the repository with required static
files present and no private absolute paths.

Documentation tests cover public documentation structure, navigation targets,
links, examples, status labels, and path hygiene. Code snippets and examples are
kept aligned through the example runner and docs tests; manual optional examples
are not presented as automatically verified.

## Verification Results

| Command | Result |
| --- | --- |
| `python -m compileall -q src tests examples lab` | Passed |
| `python -m pytest tests/public_api -q` | 26 passed |
| `python -m pytest tests/public_api tests/examples tests/lab tests/docs tests/web -q` | 132 passed |
| `python -m pytest -q` | 571 passed, 7 skipped |
| `python examples/run_examples.py list` | 31 entries listed; 28 runnable by verified policy |
| `python examples/run_examples.py run-verified` | 28 passed, 0 failed |
| `python -m lab.runner list` | 32 challenges listed |
| `python -m lab.runner test-all` | 64 passed |
| `python -m build` | Passed |
| `python -m twine check dist/*` | Passed for 0.9.0, 0.10.0, and 2.12.3 artifacts |
| `npm test` in `web/` | 108 tests passed |
| `npm run typecheck` in `web/` | Passed |
| `npm run lint` in `web/` | Passed |
| `npm run build` in `web/` | Passed |
| Installed-wheel smoke | Passed from a temp wheel install path; covered imports, dataset validation/reporting, tokenizer, native model forward/training, checkpoint save/load, evaluation, generation, inspection, SFT prep, Agent tool loop, and Security Core encryption/tamper rejection |
| Standalone documentation-site copy | Passed |

## Packaging Review

`MANIFEST.in` includes the maintained example Python, Markdown, JSON, JSONL,
text, and HTML assets needed by the examples suite. The built wheel imports from
the installed temp environment rather than the repository source tree during
the smoke test. Generated workspace data and local project artifacts were not
added to the package policy.

## Changed, Deleted, Moved

No tracked files were deleted or moved. New maintained examples, example tests,
and this audit document were added. Existing production/test/frontend/doc files
were updated in place. Test-created Python cache artifacts are disposable and
not part of the audit output.

## Remaining Risks and Manual Checks

Manual checks still required from the project owner:

```bash
python examples/run_examples.py run 05-03
python examples/run_examples.py run 08-03
python examples/run_examples.py run 10-04
```

Those require local external model assets, optional provider backends, suitable
hardware, or user-selected dependencies. They intentionally avoid automatic
downloads and network calls.

Recommended owner review before release:

```bash
python -m pytest -q
cd web
npm test
npm run typecheck
npm run lint
npm run build
cd ..
python -m build
python -m twine check dist/*
python examples/run_examples.py run-verified
python -m lab.runner test-all
```

## Confirmations

- Tests were not deleted merely because they failed.
- Unsupported behavior was not invented in code, examples, or documentation.
- `old-examples/` and local workspace/user data were preserved.
- The package version and release state were unchanged.
- Nothing was published, committed, tagged, or pushed.
