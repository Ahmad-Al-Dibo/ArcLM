# ArcLM Feature Audit

Audit date: 2026-07-15  
Scope: inspection and reporting only. No executable code was changed.

## Environment

- Python: `3.12.10`
- PyTorch: `2.13.0+cpu`
- CUDA available: `False`
- Transformers: `5.13.1`
- PEFT: not installed
- datasets: not installed
- Flask: `3.1.3`
- SentencePiece: `0.2.2`
- safetensors: `0.8.0`
- PyYAML: `6.0.3`
- NumPy: `2.5.1`

## Repository Summary

- Files enumerated with `rg --files`: 274
- Source files under `src/arclm`: 125
- Test files under `tests`: 49
- Documentation files under `docs`: 60
- Current tree is already in a large `src/` migration state. Many `src/` files are untracked and old top-level `arclm/` files are deleted in git status. This audit did not change or revert that state.

## Baseline Validation

Commands run:

```bash
.\.venv-training-core\Scripts\python.exe --version
.\.venv-training-core\Scripts\python.exe -c "import torch; print(torch.__version__); print(torch.cuda.is_available())"
.\.venv-training-core\Scripts\python.exe -m pytest
.\.venv-training-core\Scripts\python.exe -m compileall src/arclm
```

Results:

- `pytest`: `187 passed, 2 skipped, 38 warnings`
- `compileall src/arclm`: passed
- Skips: CUDA-specific mixed precision tests in a CPU-only environment
- Main warnings: existing deprecation warnings and `torch.cuda.amp.GradScaler` future warning

Public import checks passed:

```bash
from arclm.training import Trainer, TrainingConfig
from arclm.evaluation import Evaluator, EvaluationConfig
from arclm.datasets import DataPipeline, load_dataset, StreamingDataset
from arclm.finetuning import SFTTrainer, SFTConfig, ModelAdapter, TokenizerAdapter
from arclm.inference import load_model, predict, TextGenerator
from arclm.checkpoints import SmartLoader, load_external_model
```

## Audit Method

The audit inspected:

- complete repository file list
- `src/arclm`
- tests
- docs and README
- examples
- CLI files
- packaging config
- public `__init__.py` exports
- compatibility shims
- registries and plugin interfaces
- model loaders and checkpoint loaders
- tokenizer code
- dataset code
- training, evaluation and fine-tuning code
- inference and simple web interface code
- preprocessing, logging and tracking code

Status labels follow the requested definitions exactly.

## Major Findings

- Stable core exists for datasets, single-device training, basic evaluation, and basic full fine-tuning/SFT.
- Native model architecture support is limited to a compact GPT-like causal language model named `ArcLM`/`MiniGPT`.
- External model support is real but limited by feature area:
  - SFT supports PyTorch/HF-style/custom models through adapters.
  - Inference supports native checkpoints and optional Hugging Face causal LM loading.
  - General training is not a universal external model system.
- LoRA code exists in the legacy Hugging Face SFT helper and external inference loader, but PEFT is not installed and LoRA is not runtime-verified in this environment. It is `Experimental`, not stable.
- There is no implemented distributed training, RLHF/DPO/GRPO, QLoRA, model serving platform, deployment automation, benchmark suite, or enterprise layer.
- CLI help works, but train/eval/generate subcommands appear partly tied to older APIs and are not covered by runtime tests. CLI is `Partially Implemented`.
- A Flask simple interface exists with prediction, generation, load, save and health endpoints, but it is not production serving and was not runtime health-checked in this audit. It is `Experimental`.

## Risks

- Some docs and examples mention LoRA, dashboards, advanced SFT, model-source tooling and future workflows. Several are roadmap or example-only, not stable library features.
- Milestone 0 update: the stale README warning about an incomplete Torch installation was corrected after this audit. Current validated environment has working Torch CPU.
- `src/arclm/tracking.py` has local/mlflow/wandb experiment tracking code but no tests in the current suite.
- `src/arclm/cli.py` contains visible encoding artifacts in output strings and likely stale dataset calls.
- `Config.load_config_from_model()` is a placeholder.
- `pyproject.toml` declares `py.typed`, but many modules still use broad `Any`, dynamic exports and incomplete annotations.

## Confusing Or Duplicated APIs

- `TrainingConfig` exists in two concepts:
  - `from arclm.training import TrainingConfig`: new training-core dataclass
  - `from arclm.configs import TrainingConfig`: compatibility alias to broad `Config`
- `ModelAdapter` exists in two places:
  - `arclm.training.ModelAdapter`: older unified training adapter
  - `arclm.finetuning.ModelAdapter`: SFT/fine-tuning adapter
- `SFTDataCollator` exists as a new fine-tuning collator and as a legacy alias in `finetuning.sft`.
- `arclm.sft` is a deprecated compatibility shim but still required for old imports.
- `arclm.loaders` and `arclm.checkpoints.loaders` overlap as compatibility paths.

## Features Claimed In Docs But Not Implemented As Stable

- Dashboards: mentioned as future/special-version work, no stable dashboard implementation.
- Advanced SFT workflows: now basic SFT is implemented, but advanced workflows remain future.
- LoRA examples exist, but stable LoRA/PEFT foundation is not complete or tested.
- Model serving: simple Flask UI exists, but production serving features are not implemented.
- Dataset versioning, token analysis, synthetic data and WebDataset are roadmap items or partial utilities, not stable end-to-end features.

## Features Implemented But Under-Documented

- `ExperimentTracker` local/mlflow/wandb tracking code exists but lacks current docs and tests.
- External inference save/export API has substantial code, but stable artifact guarantees are not broadly tested.
- Preprocess pipeline has its own older docs/tests but is separate from the newer dataset pipeline.

## Code With Limited Or No Tests

- `src/arclm/tracking.py`
- Most CLI subcommand runtime paths
- Flask simple interface endpoint behavior
- Optional Hugging Face real model loading
- PEFT/LoRA paths
- Quantized external loading flags
- Model save/export modes for external models

## Tests Without Full Hardware Runtime Validation

- FP16 and CUDA BF16 behavior are skipped without CUDA hardware.
- GPU inference, GPU training and CUDA memory behavior are not runtime-verified in this CPU-only audit.
