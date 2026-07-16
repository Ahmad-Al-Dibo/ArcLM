# ArcLM Core Current Capabilities

This is the canonical Core capability matrix from the July 15, 2026 re-baseline.
Repository code and tests are the evidence source. Documentation claims alone do
not mark a feature as implemented.

## Validation Baseline

| Check | Result |
| ----- | ------ |
| Python | `3.12.10` in `.venv-training-core` |
| ArcLM | `0.6.1` |
| PyTorch | `2.13.0+cpu` |
| CUDA in baseline env | `False` |
| `import arclm` | Passed |
| `compileall src/arclm` | Passed |
| Full pytest | Passed: pending final Feature 2 run |
| Wheel build | Passed: `arclm-0.6.1-py3-none-any.whl` |
| Public API tests | Passed: `22 passed` |
| Compatibility tests | Passed: `15 passed, 1 warning` |
| Core focused tests | Passed: lifecycle/artifact/checkpoint/training/evaluation/inference/public/compatibility suites |
| CLI/package/loader tests | Passed: `18 passed, 2 warnings` |
| GPU tests in CPU env | Skipped: `8 skipped` |
| Web paused regression | Passed: lint, typecheck, `82` tests, production build |

The previous full-suite failures in
`tests/web/datasets/test_dataset_inspector.py` are resolved. Those tests now use
an explicit temporary `dataset_config_path` and include regression coverage that
simulated user-local dataset roots are ignored and left unchanged.

## Capability Summary

| Core domain | Status | Tests | Runtime evidence | Main limitation |
| ----------- | ------ | ----- | ---------------- | --------------- |
| Public API | Implemented and verified | Public API and compatibility suites pass | Import inventory passed | Root export surface is broad and includes legacy aliases |
| Configuration | Implemented for first lifecycle contract, broader configs partial | Config validation and lifecycle tests pass | JSON/YAML helpers import; `Config.load_config_from_model()` now loads real metadata | Config versioning remains absent |
| Model lifecycle | Implemented and verified for final artifacts | Lifecycle, artifact, loader, checkpoint tests pass | Native ArcLM final artifact save/inspect/validate/load/evaluate/infer verified on CPU | HF runtime and GPU artifact runtime not executed in baseline |
| Training | Implemented and verified for single-device core | Training unit/smoke tests pass | CPU runtime verified; CUDA verified previously in GPU env | No distributed trainer; task-specific contracts remain narrow |
| Checkpoints | Implemented and verified for Feature 2 scope | Checkpoint, trainer, lifecycle, public API, compatibility, and full-suite tests pass | Atomic save, inspection, legacy validation, RNG restore, and epoch-boundary deterministic resume verified on CPU | Mid-epoch dataloader position, callback state protocol, checksum/signature, and cloud GPU rerun remain future work |
| Evaluation | Implemented and verified | Evaluation unit/smoke tests pass | CPU validation loss, perplexity, accuracy verified | No distributed/benchmark evaluation |
| Fine-tuning/SFT | Implemented and verified for native CPU workflows | Fine-tuning, PEFT, and smoke tests pass | CPU full fine-tuning, SFT, and LoRA smoke pass | External model/tokenizer/GPU runtime matrices are incomplete |
| Data pipeline | Implemented and verified for local files | Dataset unit tests pass | JSON/JSONL/CSV/TXT/list, cleaning, dedup, pipeline tests pass | Provenance/versioning/manifest layer missing |
| Inference | Partially implemented | CLI/package/loader tests plus artifact forward-pass runtime pass | Native checkpoint inference and final artifact model forward pass verified | Generation options and external inference lack focused runtime coverage |
| Architectures | Partially implemented | Native causal LM covered indirectly | GPT-style ArcLM/MiniGPT tested | LLaMA/Mistral/BERT/T5/MoE/vision/multimodal are not native |
| Hardware validation | Partially verified | GPU tests exist and skip correctly in CPU env | GTX 1050 Ti validation recorded separately | Multi-GPU, DDP, FSDP, native BF16 acceleration need cloud validation |
| Packaging | Implemented and verified | Wheel build and import tests pass | `pip wheel . --no-deps` passed | `python -m build` needs dev dependency in release env |

## Public API Inventory

| Import | Status | Tested | Stable | Compatibility requirement |
| ------ | ------ | ------ | ------ | ------------------------- |
| `import arclm` | Implemented and verified | Yes | Stable | Must stay lightweight |
| `from arclm.training import Trainer, TrainingConfig` | Implemented and verified | Yes | Stable | Recommended training import |
| `from arclm.evaluation import Evaluator, EvaluationConfig` | Implemented and verified | Yes | Stable | Recommended evaluation import |
| `from arclm.datasets import load_dataset, DataPipeline` | Implemented and verified | Yes | Stable | Recommended data import |
| `from arclm.finetuning import SFTTrainer, SFTConfig` | Implemented and verified | Yes | Stable for current SFT core | Preserve current SFT contracts |
| `from arclm.inference import load_model, predict` | Partially implemented | Import tested | Stable for native checkpoint inference | Keep old behavior while hardening |
| `from arclm.checkpoints import SmartLoader` | Partially implemented | Import and loader tests | Experimental-to-stable boundary | Now coexists with lifecycle metadata contract |
| `from arclm.checkpoints import CheckpointInfo, inspect_checkpoint, validate_checkpoint` | Implemented and verified | Checkpoint and public API tests | Stable for training-checkpoint inspection | Trusted PyTorch checkpoint boundary applies |
| `from arclm.lifecycle import ModelArtifactInfo` | Implemented and verified | Lifecycle and public API tests | Stable for Core Milestone 1 | Preserve JSON-compatible fields |
| `from arclm.lifecycle import save_model_artifact, load_model_artifact, validate_model_artifact` | Implemented and verified | Artifact, public API, and full-suite tests | Stable for Core Milestone 1 | HF/GPU runtime matrices remain pending |
| `from arclm.peft import LoRAConfig, apply_lora, save_adapter_artifact` | Implemented and verified | PEFT and public API tests | Stable for Core Milestone 2 / Feature 2 | QLoRA, other PEFT methods, HF PEFT runtime, and GPU PEFT runtime remain pending |
| `from arclm.models import ArcLM, AutoModel` | Partially implemented | Import tested | `ArcLM` stable, `AutoModel` partial | Avoid overclaiming architecture support |
| `from arclm.tokenizers import Tokenizer, AutoTokenizer` | Partially implemented | Import tested | Native tokenizer stable, auto partial | `__all__` duplication should be cleaned later |
| `from arclm.web import create_app` | Implemented for paused Web API | Public API tests | Optional | Must not affect Core imports |
| `from arclm.trainer import Trainer` | Compatibility-only | Compatibility tests | Deprecated | Keep until migration window |
| `from arclm.sft import train_sft` | Compatibility-only | Compatibility tests | Deprecated | Keep with warning |
| `from arclm.loaders import SmartLoader` | Compatibility-only | Compatibility tests | Deprecated | Keep with warning |
| `from arclm.pipeline import train_model` | Compatibility-only | Compatibility tests | Deprecated | Keep with warning |

## Configuration Matrix

| Config | Exists | Validation | Serialization | Versioned | Stable API |
| ------ | ------ | ---------- | ------------- | --------- | ---------- |
| `arclm.configs.Config` | Yes | Partial | JSON/YAML helpers | No | Legacy/compatibility |
| `TrainingConfig` | Yes | Strong field validation | `to_dict`/`from_dict` | No | Stable for Training Core |
| `TrainingState` | Yes | Field filtering plus counter validation on load | `to_dict`/`from_dict` | Checkpoint state version stored beside payload | Stable |
| `EvaluationConfig` | Yes | Field validation | Dataclass-style result use | No | Stable for Basic Evaluation |
| `EvaluationResult` | Yes | N/A | `to_dict` | No | Stable |
| `SFTConfig` | Yes | Extends training validation | Dataclass/asdict metadata | No | Stable for current SFT core |
| `LoRAConfig` | Yes | Strong field validation | `to_dict`/`from_dict` | Config version stored | Stable for built-in LoRA |
| `PreprocessConfig` | Yes | Partial | Local preprocess use | No | Partial |
| `WebConfig` | Yes | Local web validation | Runtime config only | No | Optional Web |
| Model lifecycle metadata | Yes | Source/artifact validation | `to_dict`, JSON manifest | No | Stable first contract |

## Training Feature Matrix

| Training feature | Implemented | CPU tested | CUDA tested | API stable | Limitation |
| ---------------- | ----------- | ---------- | ----------- | ---------- | ---------- |
| Single-device FP32 | Yes | Yes | Previously verified on GTX 1050 Ti | Yes | No distributed wrapper |
| FP16 | Yes | CPU unsupported by design | Previously verified on GTX 1050 Ti | Yes | Requires CUDA |
| BF16 | Yes | Precision helper supports CPU/CUDA | Native CUDA BF16 skipped if hardware lacks support | Yes | Native acceleration needs modern GPU validation |
| Gradient accumulation | Yes | Yes | Previously verified | Yes | Accumulates under current Trainer loop only |
| Gradient clipping | Yes | Yes | Previously verified | Yes | Global norm only |
| Checkpoints | Yes | Yes | Previously verified | Yes | Checksum/signature and callback-state protocol absent |
| Resume | Yes | Yes | Previously verified | Yes | Epoch-boundary deterministic resume verified; mid-epoch dataloader position not restored |
| Callbacks | Yes | Yes | Not separately GPU-specific | Yes | Small hook set |
| Schedulers | Yes | Yes | Not separately GPU-specific | Yes | Constant/linear/cosine only |

## Lifecycle Gap Matrix

| Lifecycle operation | Native ArcLM | PyTorch | Hugging Face | Tested | Main limitation |
| ------------------- | ------------ | ------- | ------------ | ------ | --------------- |
| Model definition | Yes | User-defined | External only | Partial | Native families limited to GPT-style causal LM |
| Configuration | Legacy + training configs | User-provided | Inspected from HF config | Partial | No unified source contract |
| Initialization | Yes | Direct model object | Loader path exists | Partial | No stable family matrix |
| Training | Yes | Contract-based | Via adapters/optional paths | Yes for tiny local | HF runtime not fully verified |
| Checkpoint | Yes | State dict | Loader/adapter partial | Yes for native | No canonical artifact manifest |
| Restore | Yes | State dict | Partial | Yes for native | Security/trusted load policy needs hardening |
| Evaluation | Yes | Contract-based | If outputs match | Yes | Shape/task support limited |
| Inference | Yes | Native checkpoint path | Optional external path | Partial | No dedicated inference suite |
| Export | No | No | Save helpers partial | No | Exporters not validated |

## Evaluation Matrix

| Evaluation feature | Implemented | Tested | Task-agnostic | Limitation |
| ------------------ | ----------- | ------ | ------------- | ---------- |
| `BaseMetric` | Yes | Yes | Yes | Small contract only |
| `BaseEvaluator` | Yes | Yes | Yes | Minimal by design |
| `Evaluator` | Yes | Yes | Mostly | Assumes common batch/output keys |
| Validation loss | Yes | Yes | If model returns loss or `loss_fn` provided | Batch-average loss |
| Perplexity | Yes | Yes | Loss-based | No LM benchmark suite |
| Classification accuracy | Yes | Yes | Common logits shapes | Unsupported shapes raise |
| Token accuracy | Yes | Yes | Supports ignore index | No sequence labeling workflow |
| Custom metrics | Yes | Yes | Yes | No distributed aggregation |
| Callbacks | Yes | Yes | Yes | Small hook set |

## Fine-Tuning Evidence

| Fine-tuning feature | Implementation | Tests | Runtime verified | Production-ready |
| ------------------- | -------------- | ----- | ---------------- | ---------------- |
| Full parameter fine-tuning | `FullFineTuner` | Yes | CPU smoke | Mostly for tiny/local models |
| SFT trainer | `SFTTrainer` | Yes | CPU smoke | Basic stable |
| Text/instruction/prompt/chat formatting | Formatting helpers | Yes | Unit runtime | Basic stable |
| Label creation/masking | `labels.py`, collator | Yes | Unit runtime | Basic stable |
| Assistant-only loss | SFT config/formatting | Yes | Unit runtime | Needs wider tokenizer matrix |
| Packing/truncation | `packing.py`, collator | Yes | Unit runtime | Basic only |
| External models | `ModelAdapter`, HF legacy path | Partial | Adapter tests | Needs local HF runtime |
| LoRA | Built-in `arclm.peft` plus legacy optional path | PEFT tests | CPU native runtime verified | Stable for built-in Linear adapters; HF/GPU runtime pending |

## Architecture Matrix

| Architecture | Native implementation | External support | Training tested | Inference tested | Status |
| ------------ | --------------------- | ---------------- | --------------- | ---------------- | ------ |
| GPT-style causal LM | `ArcLM`, `MiniGPT` | N/A | Yes | Partial | Implemented and tested |
| LLaMA | No | Generic HF path only | No | No | External model only |
| Mistral | No | Generic HF path only | No | No | External model only |
| Encoder-only/BERT | No | Generic HF path only | No | No | Not found natively |
| Encoder-decoder/T5 | No | Generic HF path only | No | No | Not found natively |
| MoE | No | No proven path | No | No | Not implemented |
| Vision Transformer | No | No proven path | No | No | Not implemented |
| Multimodal | No | No proven path | No | No | Not implemented |
| Custom PyTorch model | User-provided | Direct contract/adapters | Yes | Partial | Partially implemented |

## Core Gap Matrix

| Domain | Current status | Main gap | Risk | Recommended action | Order |
| ------ | -------------- | -------- | ---- | ------------------ | ----- |
| Public API | Implemented and verified | Broad root exports and duplicates | Confusing imports | Harden | 2 |
| Configuration | Implemented first lifecycle slice | No versioning | Future migrations need care | Harden | 2 |
| Model lifecycle | Implemented first lifecycle slice | External runtime matrix incomplete | External model workflows can still drift | Harden | 1 |
| Training | Implemented and verified | Distributed/task-specific gaps | Overclaiming | Keep as-is | 5 |
| Checkpoints | Implemented and verified for current scope | Mid-epoch data position and signed integrity absent | Future reproducibility overclaiming | Harden later | 3 |
| Evaluation | Implemented and verified | Benchmarks/distributed absent | Overclaiming | Keep as-is | 6 |
| SFT | Implemented and verified for native CPU | Optional HF/GPU runtime matrix | Adapter drift | Harden later | 4 |
| Data pipeline | Implemented and verified | Versioning/provenance | Reproducibility gaps | Harden | 7 |
| Inference | Partially implemented | Dedicated generation tests | User-facing regressions | Refactor backward-compatibly | 8 |
| Architectures | Partially implemented | Registry/native families | Overclaiming | Defer | 9 |
| Hardware | Partially verified | Cloud validation | False GPU claims | Requires cloud validation | 10 |
| Dependencies | Partially stable | Python floor and optional matrix | Install/import drift | Harden | 2 |

## Current Next Feature Recommendation

Core Milestone 1 / Features 1, 2, and 3 are implemented and verified. Core
Milestone 2 / Features 1 and 2 are implemented and verified for the native CPU
fine-tuning workflow. The next recommended Core feature is:

```text
Core Milestone 2 / Feature 3:
QLoRA and Quantized Fine-Tuning Foundation
```

This is not approved automatically.
