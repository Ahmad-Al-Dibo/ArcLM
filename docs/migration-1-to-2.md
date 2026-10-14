# Migrating from ArcLM 1.x to 2.0

ArcLM 2.0 is a clean break: deprecated shims are removed, and PyTorch is no
longer a required dependency.

## Install changes

| 1.x | 2.0 |
|---|---|
| `pip install arclm` pulled torch (~500 MB+) | `pip install arclm` is light (numpy + sentencepiece) |
| torch always required | `pip install "arclm[train]"` adds torch for models/training |
| `arclm[preprocess]`, `arclm[cpu]`, `arclm[cuda]`, `arclm[all-cpu]`… | removed; use `arclm[train]`, `arclm[web]`, `arclm[hf]`, `arclm[all]` |
| Python `>=3.9,<3.13` | Python `>=3.9` |

## Removed import paths

Import everything from its canonical subpackage:

| Removed (1.x) | Use (2.0) |
|---|---|
| `arclm.trainer` | `arclm.training` |
| `arclm.tokenizer` | `arclm.tokenizers` |
| `arclm.sft` | `arclm.finetuning` |
| `arclm.model` | `arclm.models` |
| `arclm.config` / `arclm.config_loader` | `arclm.configs` |
| `arclm.data` / `arclm.dataset` / `arclm.data_processor` / `arclm.instruction_dataset` | `arclm.datasets` |
| `arclm.diagnostics` | `arclm.evaluation` |
| `arclm.generator` / `arclm.external_inference` | `arclm.inference` |
| `arclm.logging` | `arclm.training` (`AsyncTrainingLogger`) |
| `arclm.pipeline` / `arclm.pipeline_v2` | `arclm.training` (`train_model`, `UnifiedPipeline`) |
| `arclm.regularization` | `arclm.training` |
| `arclm.loaders` | `arclm.checkpoints` |
| `arclm.api` | `import arclm` (root package) |
| `arclm.preprocess` | `arclm.datasets` (cleaning, deduplication) |
| `arclm.plugins` | removed (stub never shipped a loader) |
| `arclm.simple_interface` | `arclm.web` (`python -m arclm web-api`) |
| `MiniGPT` | `ArcLM` |

## Renames

| 1.x | 2.0 |
|---|---|
| `checkpoint_is_compatible_for_tuining` (typo) | `checkpoint_is_compatible_for_tuning` |

## Removed exports

- `TrainingConfig = ModelConfig = TokenizerConfig = DatasetConfig = InferenceConfig = Config` aliases
  in `arclm.configs` — use `Config` from `arclm.configs` or the real
  `TrainingConfig` from `arclm.training` / `DatasetConfig` from `arclm.datasets`.
- `create_simple_interface_app`, `run_simple_interface` from the root package.
- Flask simple interface and `templates/index.html`.

## Behaviour changes

- `create_config()` no longer calls `torch.manual_seed` as a side effect.
  Seed explicitly via `arclm.tracking.set_reproducible_seed` or the trainer.
- `create_config()` defaults `device` to `"cpu"` (was auto-detected CUDA).
- Importing `arclm.models`, `arclm.training`, `arclm.inference`,
  `arclm.evaluation`, `arclm.peft.lora`, etc. without torch raises
  `OptionalDependencyError` with an `arclm[train]` install hint.
- `arclm.search`, `arclm.tracking`, `arclm.configs`, `arclm.datasets`,
  `arclm.tokenizers`, `arclm.security`, `arclm.agents`, `arclm.logics`, and
  `arclm.cli` (`doctor`, `security`, `web-api`) all work without torch.
