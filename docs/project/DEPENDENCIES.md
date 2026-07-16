# ArcLM Dependency Plan

No dependency changes were made during this planning task. Metadata was checked from current `pyproject.toml`, local imports, PyPI JSON responses, and official project/PyPI pages for key packages.

Core Milestone 1 / Feature 2 added no dependencies. Checkpoint hardening uses
the existing standard library, PyTorch, and already-required NumPy.

Core Milestone 1 / Feature 3 added no dependencies. Final model artifacts use
the standard library for JSON, hashing, UUIDs, and staged directories; PyTorch
for state dictionaries and device/precision placement; and existing ArcLM
tokenizer classes. Transformers remains optional and is imported only for
Hugging Face artifact save/load paths, not for inspection or validation.

Core Milestone 2 / Feature 2 added no dependencies. Built-in ArcLM LoRA uses
PyTorch modules directly and does not require the external `peft` package.

Core Milestone 2 / Feature 3 added one optional extra, `arclm[qlora]`, for real
QLoRA runtime validation. The base package still does not require bitsandbytes,
Transformers, or external PEFT.

Core Milestone 2 / Feature 4 added no dependencies. Runtime validation used the
already-installed Transformers package and detected that bitsandbytes and the
external `peft` package are not installed in either validation environment.

## Current Local Environment

| Dependency | Local Version | Installed | Notes |
| ---------- | ------------- | --------- | ----- |
| Python | 3.12.10 | Yes | Supported by current package metadata |
| torch | 2.13.0+cpu | Yes | CPU build, CUDA unavailable |
| transformers | 5.13.1 | Yes | Optional HF bridge |
| datasets | n/a | No | Optional future dataset bridge |
| tokenizers | installed | Yes | Used through Transformers/SentencePiece ecosystem |
| accelerate | n/a | No | Future distributed/HF helper |
| peft | n/a | No | Optional for future external/HF PEFT automation |
| bitsandbytes | n/a | No | Optional for real QLoRA 4-bit loading/training through `arclm[qlora]` |
| safetensors | 0.8.0 | Yes | External checkpoint support |
| webdataset | n/a | No | Future WebDataset support |
| flask | 3.1.3 | Yes | Simple interface only |
| fastapi | Installed in Web-capable environment | Yes | Optional local Web API only |
| uvicorn | Installed in Web-capable environment | Yes | Optional local Web API runtime |
| onnx / onnxruntime | n/a | No | Future export validation |
| mlflow / wandb / tensorboard | n/a | No | Future tracking integrations |
| build | n/a | No | Optional dev/release build helper; `pip wheel . --no-deps` passed as the Milestone 0 packaging fallback |

## Recommended Dependency Table

| Dependency | Version | Purpose | Required/Optional | Community/Pro | Reason |
| ---------- | ------- | ------- | ----------------- | ------------- | ------ |
| Python | Keep current `>=3.9,<3.13` until reviewed | Runtime | Required | Community | Existing metadata and tests use it; PyPI ecosystem now trends 3.10+ |
| PyTorch | `>=2.1,<3` for now | Training/eval/inference | Required | Community | Current core depends on Torch |
| NumPy | Existing range | Numeric helpers | Required | Community | Already required |
| SentencePiece | Existing range | Native tokenizer training/loading | Required | Community | Existing tokenizer API uses it |
| Transformers | `>=4.51,<6` or reviewed compatible range | HF models/tokenizers | Optional | Shared Core | External model bridge; keep optional |
| Datasets | Current PyPI-compatible optional range after review | HF datasets | Optional | Shared Core | Add only with tests |
| Tokenizers | Transitive/optional | Fast tokenizers | Optional | Shared Core | Usually via Transformers |
| Accelerate | Current PyPI-compatible optional range after review | HF/distributed helpers | Optional | Pro | Useful after HF runtime and distributed plans |
| PEFT | Current PyPI-compatible optional range after review | External PEFT automation | Optional | Pro | Not required for built-in ArcLM LoRA; needed before external PEFT package claims |
| bitsandbytes | `>=0.49,<1` on Python 3.10+ | QLoRA 4-bit backend | Optional | Shared Core | Used only by `arclm[qlora]`; official docs require modern PyTorch/CUDA support |
| safetensors | Existing optional range | Safe model files | Optional | Shared Core | External artifact support |
| WebDataset | Current PyPI-compatible optional range after review | Tar streaming datasets | Optional | Pro | Add only with loader and lazy tests |
| FastAPI/Uvicorn | Latest compatible range after server design | Production API | Optional | Pro | Do not add before serving milestone |
| ONNX/ONNX Runtime | Latest compatible range after exporter design | Export validation | Optional | Pro | Artifact validation required |
| vLLM | Latest compatible range after serving design | High-throughput inference | Optional | Pro | Hardware-sensitive serving backend |
| MLflow/W&B/Comet/TensorBoard | Latest compatible ranges after tracking tests | Experiment tracking | Optional | Pro | External service integrations |

## Dependency Decisions Needed

- Decide whether ArcLM still supports Python 3.9. PyPI metadata for many 2026 ML packages now requires Python 3.10+.
- Install `arclm[dev]` or `build` in release validation environments when direct `python -m build` is required.
- Keep the Core model lifecycle contract independent from optional HF, PEFT, and Web dependencies; optional adapters should fail only when used.
- Built-in ArcLM LoRA remains independent of the external PEFT package.
- QLoRA runtime dependencies remain optional. The `qlora` extra may upgrade
  PyTorch to `>=2.4,<3` because current bitsandbytes documentation lists
  PyTorch 2.4+ as the supported baseline.
- Do not add serving/export/cloud dependencies until their milestone begins.
- Keep fallback behavior for missing optional dependencies.

## Sources

- Local `pyproject.toml`.
- Local import checks in `.venv-training-core`.
- PyPI JSON metadata for torch, transformers, datasets, tokenizers, accelerate, peft, safetensors, webdataset, fastapi, uvicorn, onnx, onnxruntime, vllm, mlflow, wandb, tensorboard, flask, numpy, sentencepiece.
- PyTorch official install page and PyPI project page.
- Hugging Face Datasets and PEFT official install pages / PyPI pages.

## Core Milestone 2 / Feature 1 Dependency Result

Full fine-tuning and SFT stabilization added no new required dependency.

- Native SFT uses existing PyTorch, ArcLM tokenizers, Training Core,
  Evaluation Core, Checkpoints, and Lifecycle artifacts.
- `import arclm` remains lightweight.
- Transformers remains optional for Hugging Face paths.
- PEFT remains uninstalled and deferred to Core Milestone 2 / Feature 2.

## Core Milestone 2 / Feature 3 Dependency Result

QLoRA foundation added:

```toml
qlora = [
  "torch>=2.4,<3",
  "transformers>=4.51,<6",
  "bitsandbytes>=0.49,<1; python_version >= '3.10'",
]
```

This is optional. CPU configuration tests and ordinary LoRA tests run without
installing this extra. Real QLoRA runtime validation requires the extra plus a
supported CUDA environment.

## Core Milestone 2 / Feature 4 Dependency Result

No dependency versions changed.

Observed environments:

- `.venv-training-core`: Python 3.12.10, PyTorch 2.13.0+cpu, Transformers
  5.13.1, bitsandbytes not installed, external `peft` not installed.
- `.venv-gpu-validation`: Python 3.12.10, PyTorch 2.5.1+cu121, CUDA 12.1,
  GTX 1050 Ti, Transformers 5.13.1, bitsandbytes not installed, external
  `peft` not installed.

Result:

- Tiny local Hugging Face runtime validation can run with the existing optional
  Transformers install.
- Built-in ArcLM LoRA does not require the external `peft` package.
- Real QLoRA runtime remains pending until bitsandbytes is installed in a
  suitable CUDA environment.

## Core Milestone 2 / Feature 5 Dependency Result

Experiment Tracking and Reproducible Run Manifests added no dependencies.

- Local run manifests use the Python standard library plus PyTorch metadata that
  ArcLM already requires.
- MLflow and Weights & Biases remain optional compatibility backends and are
  imported lazily only when requested.
- `import arclm` remains lightweight.

## Core Milestone 2 / Feature 6 Dependency Result

Hyperparameter Search Foundation added no dependencies.

- Search uses the Python standard library plus existing ArcLM training,
  fine-tuning, PEFT, and run-tracking contracts.
- Optuna, Ray Tune, Hyperopt, MLflow optimization, W&B sweeps, external
  databases, and cloud workers are not dependencies of this feature.
- `import arclm` remains lightweight because `arclm.search` is a domain import,
  not a root import side effect.

## Core Milestone 3 / Feature 1 Dependency Result

Distributed Runtime and Process Abstraction added no dependencies.

- It uses the existing required PyTorch dependency.
- `torch.distributed` is imported only when `arclm.distributed` runtime helpers
  are used.
- No Accelerate, DeepSpeed, MPI, Ray, launch framework, or cloud dependency was
  added.
- `import arclm` remains lightweight.
