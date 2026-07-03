# ArcLM

Compact PyTorch language-model training, fine-tuning, loading, preprocessing, and inference utilities.

[![Python](https://img.shields.io/badge/python-3.9%2B-blue.svg)](https://www.python.org/)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.1%2B-ee4c2c.svg)](https://pytorch.org/)
[![License](https://img.shields.io/badge/license-Apache--2.0-green.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-alpha-orange.svg)](pyproject.toml)

Latest ArcLM version: `0.3.1`

Last updated: July 3, 2026

Python support: `>=3.9`

License: Apache License 2.0

ArcLM is a small, local-first framework for building causal language models with PyTorch. It includes a compact GPT-style model, word and SentencePiece tokenizers, training loops, checkpoint handling, model-source inspection, external checkpoint adaptation, dataset preprocessing, evaluation utilities, experiment tracking, and inference helpers.

This README documents the current implementation in this repository. It intentionally avoids documenting features that are not present in the code.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Architecture Overview](#architecture-overview)
- [Installation](#installation)
- [Requirements](#requirements)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Package Overview](#package-overview)
- [Public API Overview](#public-api-overview)
- [Configuration System](#configuration-system)
- [Models](#models)
- [Base Models](#base-models)
- [Training](#training)
- [Pretraining](#pretraining)
- [Fine-tuning](#fine-tuning)
- [Inference](#inference)
- [Generation](#generation)
- [Model Loading](#model-loading)
- [Tokenizers](#tokenizers)
- [Data Preparation](#data-preparation)
- [Pipelines](#pipelines)
- [Building Your Own Components](#building-your-own-components)
- [Extension Guide](#extension-guide)
- [API Examples](#api-examples)
- [Advanced Usage](#advanced-usage)
- [Best Practices](#best-practices)
- [Performance Tips](#performance-tips)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)
- [Contributing](#contributing)
- [Development Guide](#development-guide)
- [Testing](#testing)
- [Security](#security)
- [License](#license)
- [Citation](#citation)

## Introduction

ArcLM is designed for experiments where you want to understand and control the full language-model workflow:

- prepare text data
- build a tokenizer
- train a compact causal language model
- save resumable checkpoints
- continue training or fine-tune from existing checkpoints
- inspect model sources before loading
- adapt compatible external weights into ArcLM
- run generation and diagnostics
- track local experiments

The core model, `ArcLM`, is intentionally compact. It is a causal transformer-like model with token embeddings, positional embeddings, a stack of GPT blocks, layer normalization, and a language-model head.

ArcLM is not a replacement for large-scale training frameworks. It is a practical, readable framework for local language-model workflows, education, experiments, and small custom models.

## Features

- Compact GPT-style causal language model in `arclm.model.ArcLM`.
- Backward-compatible alias `MiniGPT = ArcLM`.
- Word-level tokenizer with custom reserved symbols.
- SentencePiece tokenizer with BPE or unigram model types.
- Tokenizer factory with custom tokenizer registration.
- Sliding-window next-token dataset and DataLoader helpers.
- High-level `train_model()` workflow for `pretrain`, `finetune`, and `continue_training`.
- Lower-level model and trainer builders.
- Trainer with validation, early stopping, best-model restore, gradient clipping, logging, and checkpoint intervals.
- Native ArcLM checkpoint saving and loading.
- External loader registry for ArcLM checkpoints, raw PyTorch state dictionaries, `.safetensors`, and Hugging Face sources.
- Smart model-source inspection through `SmartLoader`.
- Unified training pipeline classes and abstract base classes for extension.
- Inference wrapper with cached `predict()`.
- Text generation with temperature, repetition penalty, top-k, and top-p sampling.
- JSON, JSONL, CSV, and TXT dataset loading through `DataProcessor`.
- JSONL preprocessing pipeline with cleaning, quality filters, language filtering, PII redaction, exact deduplication, near deduplication, heuristic toxicity, heuristic perplexity, and reports.
- Diagnostics for top-k predictions, concept benchmarks, tokenizer coverage, long-context comparisons, and evaluation metrics.
- Experiment tracking with local files, optional MLflow, and optional Weights & Biases.
- Lightweight regularization utilities.
- Propositional logic helpers in `arclm.logics`.
- Flask prediction app in `app.py`.
- Root training scripts and example workflows.

## Architecture Overview

ArcLM is organized around a small set of cooperating layers:

1. Configuration
   - `Config` holds model, data, tokenizer, training, diagnostics, checkpoint, and fine-tuning options.
   - `create_config()` validates keyword names and selects CUDA when available.
   - `config_loader.py` loads and saves YAML or JSON config files.

2. Tokenization
   - `Tokenizer` implements whitespace word tokenization.
   - `SentencePieceTokenizer` wraps `sentencepiece`.
   - `TokenizerFactory` selects tokenizer implementations and supports registration.

3. Data
   - `read_tokens()` reads lowercase whitespace tokens from text and preserves newline markers.
   - `load_tokens()` can mix domain data before main data.
   - `split_train_val()` builds train/validation token splits.
   - `prepare_data()` returns a `DataBundle` with tokens, tokenizer, encoded IDs, and loaders.

4. Model
   - `SelfAttention` implements causal self-attention.
   - `GPTBlock` combines attention, feed-forward layers, residual connections, dropout, and layer normalization.
   - `ArcLM` maps token IDs to logits.

5. Training
   - `build_model()` constructs `ArcLM`.
   - `build_trainer()` creates AdamW, loss, and `Trainer`.
   - `Trainer.train()` performs the training loop.
   - `train_model()` owns the full high-level training workflow.
   - `UnifiedPipeline` provides a class-based pipeline for pre-training, fine-tuning, and instruction tuning.

6. Checkpoints and loading
   - Native checkpoints are saved by `Trainer.save()`.
   - `load_model()` restores a checkpoint for inference.
   - Loader classes normalize external model sources into `LoadedCheckpoint`.
   - `adapt_for_training()` creates an ArcLM model from normalized checkpoint weights.

7. Inference and diagnostics
   - `Generator` samples continuations from a trained model.
   - `LoadedModel.predict()` and module-level `predict()` expose simple inference.
   - `diagnostics.py` provides metrics and reporting helpers.

8. Preprocessing and dataset utilities
   - `DataProcessor` loads and transforms general data records.
   - `PreprocessPipeline` cleans JSONL datasets and writes JSON/HTML reports.

## Installation

Install from the repository:

```bash
pip install -e .
```

Install development dependencies:

```bash
pip install -e .[dev]
```

Install preprocessing extras:

```bash
pip install -e .[preprocess]
```

Install web serving extras:

```bash
pip install -e .[web]
```

Install all common extras:

```bash
pip install -e .[dev,preprocess,web]
```

## Requirements

Runtime dependencies declared in `pyproject.toml`:

- `torch>=2.1,<3`
- `numpy>=1.24,<3`
- `sentencepiece>=0.2,<0.3`
- `transformers>=4.38,<6`

Optional dependency groups:

- `dev`: `pytest`, `build`, `twine`
- `web`: `flask`
- `preprocess`: `beautifulsoup4`, `PyYAML`, `tqdm`

Additional optional integrations used only when installed:

- `safetensors` for `.safetensors` loading.
- `langdetect` for stronger language detection in preprocessing.
- `mlflow` for MLflow experiment tracking.
- `wandb` for Weights & Biases experiment tracking.

## Quick Start

Create a small text file:

```text
arc language models learn from compact local text.
arc language models predict the next token.
```

Train a tiny model:

```python
from arclm import train_model

result = train_model(
    mode="pretrain",
    data="data/data.txt",
    output="models/arclm.pth",
    tokenizer_type="word",
    max_vocab=1000,
    embed_dim=32,
    num_blocks=1,
    block_size=16,
    batch_size=4,
    num_epochs=1,
    validation_split=0.0,
    training_log_interval=0,
    device="cpu",
)

print(result.model_path)
```

Load and generate:

```python
from arclm import load_model

loaded = load_model("models/arclm.pth", device="cpu")
print(loaded.predict("arc language", max_new_tokens=20, temperature=0.9, top_p=0.9))
```

## Project Structure

```text
.
├── arclm/
│   ├── __init__.py
│   ├── _version.py
│   ├── api.py
│   ├── cli.py
│   ├── config.py
│   ├── config_loader.py
│   ├── data.py
│   ├── data_processor.py
│   ├── dataset.py
│   ├── diagnostics.py
│   ├── generator.py
│   ├── inference.py
│   ├── instruction_dataset.py
│   ├── logging.py
│   ├── model.py
│   ├── pipeline.py
│   ├── pipeline_v2.py
│   ├── regularization.py
│   ├── tokenizer.py
│   ├── tokenizers/
│   ├── trainer.py
│   ├── tracking.py
│   ├── training/
│   ├── loaders/
│   ├── logics/
│   └── preprocess/
├── examples/
├── tests/
├── docs/
├── app.py
├── train.py
├── arclm.py
├── pyproject.toml
├── setup.py
└── LICENSE
```

## Package Overview

`arclm.__init__` exports the main framework surface.

`arclm.api` provides a lazy-loading API facade for a curated subset of the package.

`arclm.config` contains `Config`, `create_config()`, `get_finetuning_config()`, and `get_instruction_tuning_config()`.

`arclm.tokenizer` contains the tokenizer implementations and factory.

`arclm.tokenizers` re-exports tokenizer classes and factory helpers.

`arclm.data` contains token loading, splitting, tokenizer restoration, and `prepare_data()`.

`arclm.dataset` contains `TextDataset` and `create_dataloader()`.

`arclm.data_processor` contains flexible record loading and prompt formatting helpers.

`arclm.model` contains the neural network implementation.

`arclm.trainer` contains the training loop.

`arclm.pipeline` contains high-level training helpers.

`arclm.training` contains base classes and the unified class-based pipeline.

`arclm.loaders` contains checkpoint loaders, the loader registry, SmartLoader, and adaptation helpers.

`arclm.inference` contains checkpoint inference loading and cached prediction.

`arclm.generator` contains sampling utilities.

`arclm.diagnostics` contains evaluation, reporting, and benchmarking helpers.

`arclm.preprocess` contains JSONL preprocessing.

`arclm.tracking` contains experiment tracking.

`arclm.regularization` contains standalone regularization and monitoring helpers.

`arclm.logging` contains asynchronous JSONL event logging.

`arclm.logics` contains propositional logic classes and model checking.

`arclm.cli` contains a command-line parser. See [Command Line Interface](#command-line-interface) for current caveats.

## Public API Overview

### Top-level `arclm` exports

Core:

- `ArcLM`
- `MiniGPT`
- `Config`
- `create_config`
- `get_version`
- `list_available_models`
- `load_training_checkpoint`

Tokenizers:

- `Tokenizer`
- `SentencePieceTokenizer`
- `TokenizerFactory`
- `create_tokenizer`
- `get_tokenizer_from_config`

Data:

- `TextDataset`
- `create_dataloader`
- `DataBundle`
- `DataProcessor`
- `ProcessedDataset`
- `load_tokens`
- `prepare_data`
- `read_tokens`
- `split_train_val`
- `InstructionDataset`
- `create_instruction_dataloader`

Training:

- `Trainer`
- `build_model`
- `build_trainer`
- `train_model`
- `TrainingResult`
- `checkpoint_is_compatible_for_continue_training`
- `checkpoint_is_compatible_for_tuining`
- `create_checkpoint_callback`
- `create_epoch_checkpoint_callback`
- `load_compatible_checkpoint`
- `save_training_checkpoint`
- `UnifiedPipeline`
- `PreTrainedModelLoader`
- `ModelAdapter`
- `StoppingCriteria`
- `BaseTrainingPipeline`
- `BaseModelLoader`
- `BaseModelAdapter`

Loading:

- `LoadedCheckpoint`
- `LoadPlan`
- `AdaptedModelBundle`
- `ModelInspector`
- `SmartLoader`
- `inspect_model_source`
- `register_model_inspector`
- `load_external_model`
- `adapt_for_training`
- `validate_tokenizer_compatibility`

Inference and generation:

- `Generator`
- `DEFAULT_MODEL_PATH`
- `LoadedModel`
- `load_model`
- `predict`

Diagnostics:

- `TopKPrediction`
- `ConceptBenchmarkCase`
- `ConceptBenchmarkResult`
- `LongContextResult`
- `MetricsReport`
- `DEFAULT_CONCEPT_BENCHMARKS`
- `predict_top_k`
- `format_top_k_predictions`
- `score_concept_relationships`
- `format_concept_benchmark_report`
- `format_tokenizer_coverage_report`
- `build_training_diagnostics_report`
- `format_long_context_results`
- `run_long_context_evaluation`
- `calculate_perplexity`
- `calculate_metrics`
- `export_metrics_to_json`
- `export_metrics_to_markdown`

Regularization:

- `L1Regularization`
- `L2Regularization`
- `EarlyStopping`
- `LearningRateScheduler`
- `GeneralizationMonitor`
- `MixupAugmentation`
- `LabelSmoothing`

Logic:

- `Sentence`
- `Symbol`
- `Not`
- `And`
- `Or`
- `Implication`
- `Biconditional`
- `model_check`

Utility:

- `format_duration`

### Public module-level APIs not exported at top level

The repository also defines public names that are not imported by `arclm.__init__`:

- `arclm.config.get_finetuning_config`
- `arclm.config.get_instruction_tuning_config`
- `arclm.config_loader.load_config_yaml`
- `arclm.config_loader.load_config_json`
- `arclm.config_loader.load_config`
- `arclm.config_loader.save_config_yaml`
- `arclm.config_loader.save_config_json`
- `arclm.config_loader.save_config`
- `arclm.config_loader.create_example_configs`
- `arclm.inference.CheckpointTokenizer`
- `arclm.loaders.config_from_checkpoint`
- `arclm.loaders.CheckpointLoader`
- `arclm.loaders.DefaultModelInspector`
- `arclm.loaders.LoaderRegistry`
- `arclm.loaders.create_default_registry`
- `arclm.loaders.arclm_checkpoint.ArcLMCheckpointLoader`
- `arclm.loaders.state_dict_loader.StateDictLoader`
- `arclm.loaders.safetensors_loader.SafetensorsLoader`
- `arclm.loaders.hf_loader.HuggingFaceLoader`
- `arclm.logging.AsyncTrainingLogger`
- `arclm.regularization.Dropout`
- `arclm.tracking.ExperimentMetadata`
- `arclm.tracking.ExperimentTracker`
- `arclm.tracking.create_experiment`
- `arclm.tracking.list_experiments`
- `arclm.utils.PreModelBenchmark`
- `arclm.utils.BenchmarkMetrics`
- `arclm.preprocess.PreprocessConfig`
- `arclm.preprocess.PreprocessPipeline`
- `arclm.preprocess.cleaner.strip_html`
- `arclm.preprocess.cleaner.normalize_text`
- `arclm.preprocess.cleaner.redact_patterns`
- `arclm.preprocess.duplicate.exact_hash`
- `arclm.preprocess.duplicate.simhash`
- `arclm.preprocess.duplicate.hamming`
- `arclm.preprocess.duplicate.DuplicateIndex`
- `arclm.preprocess.filters.word_count`
- `arclm.preprocess.filters.char_entropy`
- `arclm.preprocess.filters.has_long_repeated_chars`
- `arclm.preprocess.filters.repeated_word_ratio`
- `arclm.preprocess.filters.basic_quality_reasons`
- `arclm.preprocess.io.read_jsonl`
- `arclm.preprocess.io.write_jsonl`
- `arclm.preprocess.language.detect_language`
- `arclm.preprocess.language.language_reasons`
- `arclm.preprocess.perplexity.simple_perplexity`
- `arclm.preprocess.perplexity.perplexity_reasons`
- `arclm.preprocess.pii.redact_pii`
- `arclm.preprocess.pii.pii_reasons`
- `arclm.preprocess.report.write_json_report`
- `arclm.preprocess.report.write_html_report`
- `arclm.preprocess.statistics.DatasetStats`
- `arclm.preprocess.tokenizer_stats.whitespace_token_stats`
- `arclm.preprocess.toxicity.toxicity_score`
- `arclm.preprocess.toxicity.toxicity_reasons`

## Configuration System

`Config` is the central configuration object. It is a plain Python class, not a dataclass. Unknown keyword arguments are accepted by `Config(...)` only in the sense that they are ignored unless explicitly read in `__init__`; prefer `create_config()` when you want validation.

### `Config` options

| Option | Default | Meaning |
| --- | --- | --- |
| `embed_dim` | `64` | Embedding dimension used by `ArcLM`. |
| `block_size` | `8` | Context length and sliding-window length. |
| `batch_size` | `64` | Training batch size. |
| `num_epochs` | `100` | Target epoch count. |
| `vocab_size` | `None` | Set after tokenizer preparation or checkpoint loading. |
| `learning_rate` | `1e-3` | AdamW learning rate. |
| `weight_decay` | `0.0` | AdamW weight decay. |
| `dropout` | `0.0` | Dropout rate in model blocks. |
| `grad_clip` | `None` | Optional gradient norm clip value. |
| `num_blocks` | `2` | Number of GPT blocks. |
| `model_path` | `"output/model.pth"` | Checkpoint save/load path. |
| `tokenizer_path` | `"output/tokenizer.model"` | Tokenizer save path used by scripts. |
| `user_defined_symbols` | QA/reserved symbols | Tokens reserved by word and SentencePiece tokenizers. |
| `data_path` | `"data/data.txt"` | Main training text path. |
| `domain_data_path` | `None` | Optional domain text mixed before main data. |
| `domain_data_repeats` | `1` | Number of times to repeat domain tokens. |
| `tokenizer_type` | `"word"` | `"word"` or `"sentencepiece"`. |
| `sentencepiece_model_type` | `"bpe"` | SentencePiece model type. |
| `sentencepiece_character_coverage` | `1.0` | SentencePiece character coverage. |
| `tokenizer_max_line_length` | `4000` | Present in config; current SentencePiece build uses its own default. |
| `max_vocab` | `50000` | Maximum tokenizer vocabulary. |
| `max_data_size` | `1000000` | Maximum token count loaded from data. |
| `device` | `"cpu"` | Device string. `create_config()` defaults to CUDA if available. |
| `validation_split` | `0.0` | Validation token split ratio. |
| `early_stopping_patience` | `None` | Patience in epochs when validation exists. |
| `early_stopping_min_delta` | `0.0` | Minimum validation improvement. |
| `restore_best_model` | `True` | Restore best validation weights after training. |
| `seed` | `42` | Manual PyTorch seed in `create_config()` and scripts. |
| `diagnostic_top_k` | `5` | Top-k predictions in diagnostics. |
| `concept_benchmark_top_k` | `10` | Top-k for concept scoring. |
| `diagnostic_prompts` | `["machine learning", "donald trump"]` | Prompts used by diagnostics. |
| `diagnostic_sample_tokens` | `60` | Generated sample length for long-context diagnostics. |
| `tokenizer_rare_threshold` | `2` | Rare-token threshold for coverage reports. |
| `training_log_interval` | `50` | Batch logging interval. Use `0` to suppress interval logs. |
| `metrics_log_path` | `None` | JSONL event log path. `train_model()` fills one if missing. |
| `run_long_context_evaluation` | `False` | Present for diagnostics workflow selection. |
| `use_checkpoint_tokenizer` | `False` | Present for checkpoint-tokenizer workflow selection. |
| `long_context_block_sizes` | `[32, 64, 128]` | Block sizes for long-context evaluation. |
| `freeze_backbone` | `False` | Freeze parameters whose name contains `"blocks"` in fine-tuning. |
| `freeze_embedding` | `False` | Freeze parameters whose name contains `"token_embedding"`. |
| `use_discriminative_lr` | `False` | Use parameter groups with layer-specific LR multipliers. |
| `lr_multiplier` | `None` | Dict like `{"embeddings": 0.1, "blocks": 0.1, "head": 1.0}`. |
| `use_lr_scheduler` | `False` | Present in config; scheduler is not wired into `Trainer.train()`. |
| `lr_scheduler_strategy` | `"cosine"` | Strategy for standalone `LearningRateScheduler`. |
| `warmup_epochs` | `1` | Present in config for fine-tuning workflows. |
| `checkpoint_interval` | `0` | Save every N completed epochs when configured. |
| `checkpoint_batch_interval` | `0` | Save every N global batches when configured. |
| `checkpoint_callback` | `None` | Optional callback called by trainer checkpoint logic. |

### Creating configs

```python
from arclm import Config, create_config

cfg = Config(embed_dim=128, block_size=64, device="cpu")

validated = create_config(
    embed_dim=128,
    block_size=64,
    tokenizer_type="sentencepiece",
    max_vocab=8000,
)
```

`create_config()` raises `ValueError` for unknown configuration parameter names.

```python
from arclm import create_config

cfg = create_config(num_epochs=3, learning_rate=3e-4)
print(cfg.get_device())
print(cfg.to_dict())
```

### Safe updates

```python
from arclm import Config

cfg = Config(max_vocab=1000)
cfg.set_safe(vocab_size=2000, unknown_field=True)
print(cfg.vocab_size)  # 1000
```

`set_safe()` ignores unknown attributes and clamps `vocab_size` to `max_vocab`.

### Fine-tuning presets

```python
from arclm.config import get_finetuning_config, get_instruction_tuning_config

finetune_cfg = get_finetuning_config(
    num_epochs=3,
    batch_size=16,
    learning_rate=2e-5,
)

instruction_cfg = get_instruction_tuning_config(
    num_epochs=5,
    batch_size=8,
)
```

`get_finetuning_config()` enables early stopping defaults and, when requested, discriminative LR multipliers.

`get_instruction_tuning_config()` builds on the fine-tuning preset with instruction-oriented defaults.

### Config files

```python
from arclm import create_config
from arclm.config_loader import save_config_json, load_config_json

cfg = create_config(embed_dim=96, block_size=32)
save_config_json(cfg, "configs/small.json")
loaded = load_config_json("configs/small.json")
```

```python
from arclm.config_loader import save_config_yaml, load_config_yaml, load_config

save_config_yaml(loaded, "configs/small.yaml")
cfg_from_yaml = load_config_yaml("configs/small.yaml")
cfg_auto = load_config("configs/small.yaml")
```

`load_config_yaml()` and `load_config_json()` flatten nested dictionaries before constructing `Config`.

`save_config()` auto-detects `.yaml`, `.yml`, or `.json`.

`create_example_configs()` writes example configs under `configs/`, but the current implementation passes `num_heads` into `Config`; `Config` does not preserve that field in `to_dict()`.

## Models

### `ArcLM`

`ArcLM` is the built-in causal language model.

Constructor:

```python
ArcLM(
    vocab_size,
    embed_dim=64,
    block_size=8,
    num_blocks=2,
    dropout=0.0,
)
```

Forward input:

- Tensor of token IDs shaped `[batch, sequence]`.

Forward output:

- Logits shaped `[batch, sequence, vocab_size]`.

Example:

```python
import torch
from arclm import ArcLM

model = ArcLM(vocab_size=100, embed_dim=32, block_size=16, num_blocks=2)
idx = torch.randint(0, 100, (4, 16))
logits = model(idx)
print(logits.shape)
print(model.get_num_parameters())
```

### `MiniGPT`

`MiniGPT` is a backward-compatible alias:

```python
from arclm import MiniGPT

model = MiniGPT(vocab_size=100)
```

### `SelfAttention`

`SelfAttention` is a causal self-attention module used inside `GPTBlock`.

```python
import torch
from arclm.model import SelfAttention

attn = SelfAttention(embed_dim=32, dropout=0.1)
x = torch.randn(2, 8, 32)
y = attn(x)
```

### `GPTBlock`

`GPTBlock` combines `SelfAttention`, feed-forward layers, residual connections, layer normalization, and dropout.

```python
import torch
from arclm.model import GPTBlock

block = GPTBlock(embed_dim=32, dropout=0.1)
x = torch.randn(2, 8, 32)
y = block(x)
```

## Base Models

ArcLM includes abstract base classes for extension in `arclm.training.base`.

### `BaseModelLoader`

Subclass `BaseModelLoader` when you need a custom source loader that returns a model and metadata.

```python
from arclm.training import BaseModelLoader

class MyLoader(BaseModelLoader):
    def load(self):
        return model, {"source": "custom"}
```

### `BaseModelAdapter`

Subclass `BaseModelAdapter` to adapt one model implementation into another.

```python
from arclm.training import BaseModelAdapter

class MyAdapter(BaseModelAdapter):
    def adapt_weights(self, verbose: bool = True):
        return {"adapted": 0, "skipped": 0}
```

### `BaseTrainingPipeline`

Subclass `BaseTrainingPipeline` for custom training orchestration.

```python
from arclm.training import BaseTrainingPipeline

class MyPipeline(BaseTrainingPipeline):
    def build(self, vocab_size: int):
        return self

    def train(self, train_loader, val_loader=None, num_epochs=None):
        return {"status": "done"}

    def save_checkpoint(self, path=None):
        return path

    def get_model(self):
        return self.model
```

## Training

ArcLM supports three current training styles:

1. High-level `train_model()`.
2. Lower-level `prepare_data()` plus `build_model()` plus `build_trainer()`.
3. Class-based `UnifiedPipeline`.

### High-level training with `train_model()`

```python
from arclm import train_model

result = train_model(
    mode="pretrain",
    data="data/data.txt",
    output="models/arclm.pth",
    tokenizer_type="word",
    max_vocab=2000,
    embed_dim=64,
    num_blocks=2,
    block_size=32,
    batch_size=8,
    num_epochs=3,
    validation_split=0.1,
    learning_rate=3e-4,
    grad_clip=1.0,
    device="cpu",
)
```

Supported `mode` values and aliases:

- `pretrain`
- `pre_training`
- `finetune`
- `fine_tuning`
- `fine_tune`
- `continue`
- `continued`
- `continue_training`

`train_model()` returns `TrainingResult`:

```python
from arclm import TrainingResult

print(result.mode)
print(result.model_path)
print(result.history)
print(result.vocab_size)
print(result.tokenizer)
print(result.checkpoint_source)
```

### Lower-level training

```python
import torch
from arclm import Config, prepare_data, build_model, build_trainer

cfg = Config(
    data_path="data/data.txt",
    model_path="models/manual.pth",
    tokenizer_type="word",
    max_vocab=1000,
    embed_dim=32,
    num_blocks=1,
    block_size=16,
    batch_size=4,
    num_epochs=1,
    validation_split=0.0,
    training_log_interval=0,
    device="cuda" if torch.cuda.is_available() else "cpu",
)

data = prepare_data(cfg)
cfg.vocab_size = data.vocab_size
model = build_model(cfg, data.vocab_size)
trainer = build_trainer(model, cfg)
trainer.train(data.train_loader, cfg.num_epochs)
trainer.save(
    cfg,
    vocab=data.tokenizer.vocab,
    stoi=data.tokenizer.stoi,
    itos=data.tokenizer.itos,
    tokenizer_metadata=data.tokenizer.to_checkpoint(),
)
```

### `Trainer`

`Trainer` is initialized with:

```python
Trainer(model, optimizer, criterion, config, event_logger=None)
```

Common methods:

- `train(loader, epochs, val_loader=None, early_stopping_patience=None, min_delta=None, checkpoint_callback=None, checkpoint_epoch_interval=None, checkpoint_batch_interval=None)`
- `restore_best_model()`
- `get_generalization_gap()`
- `freeze_layers(pattern="blocks", verbose=True)`
- `unfreeze_layers(pattern=None, verbose=True)`
- `get_frozen_layers_info()`
- `get_train_history()`
- `save(config, vocab=None, stoi=None, itos=None, tokenizer_metadata=None)`
- `load(model_path)`
- `exists(model_path)`

Example with validation and checkpointing:

```python
from arclm import create_checkpoint_callback

callback = create_checkpoint_callback(cfg, data.tokenizer, data.vocab_size)

trainer.train(
    data.train_loader,
    cfg.num_epochs,
    val_loader=data.val_loader,
    early_stopping_patience=cfg.early_stopping_patience,
    min_delta=cfg.early_stopping_min_delta,
    checkpoint_callback=callback,
    checkpoint_batch_interval=100,
)
```

### Discriminative learning rates

```python
from arclm.pipeline import build_optimizer_with_discriminative_lr

optimizer = build_optimizer_with_discriminative_lr(
    model,
    learning_rate=2e-5,
    weight_decay=0.01,
    lr_multiplier={"embeddings": 0.1, "blocks": 0.1, "head": 1.0},
)
```

`build_trainer()` uses this automatically when `config.use_discriminative_lr` is true.

## Pretraining

Pretraining from scratch uses a local text file and a newly built tokenizer.

```python
from arclm import train_model

pretrained = train_model(
    mode="pretrain",
    data="data/pretrain.txt",
    output="models/arclm_pretrained.pth",
    tokenizer_type="sentencepiece",
    sentencepiece_model_type="bpe",
    max_vocab=8000,
    embed_dim=128,
    num_blocks=4,
    block_size=128,
    batch_size=16,
    num_epochs=3,
    validation_split=0.1,
    learning_rate=3e-4,
    weight_decay=0.01,
    grad_clip=1.0,
    device="cpu",
)
```

Pretraining saves:

- `model_state_dict`
- `optimizer_state_dict`
- `config`
- `vocab`
- `stoi`
- `itos`
- `tokenizer_metadata`
- `block_size`
- `vocab_size`
- current epoch, batch, and global step
- patience and best validation loss
- best model state dict
- train history

## Fine-tuning

Fine-tuning requires a checkpoint or external model source.

```python
from arclm import train_model

finetuned = train_model(
    mode="finetune",
    checkpoint="models/arclm_pretrained.pth",
    data="data/finetune.txt",
    output="models/arclm_finetuned.pth",
    batch_size=8,
    num_epochs=2,
    learning_rate=2e-5,
    freeze_backbone=True,
    use_discriminative_lr=True,
    validation_split=0.1,
    device="cpu",
)
```

When `freeze_backbone=True`, parameters whose names contain `"blocks"` are frozen.

When `freeze_embedding=True`, parameters whose names contain `"token_embedding"` are frozen.

### Continue training

`continue_training` is stricter than fine-tuning. It requires a compatible tokenizer from the checkpoint or an explicit tokenizer.

```python
continued = train_model(
    mode="continue_training",
    checkpoint="models/arclm_pretrained.pth",
    data="data/more_pretraining.txt",
    output="models/arclm_continued.pth",
    num_epochs=5,
    batch_size=8,
    device="cpu",
)
```

## Inference

### `load_model()`

```python
from arclm import load_model

loaded = load_model("models/arclm.pth", device="cpu", prefer_best=True)
print(loaded.predict("machine learning", max_new_tokens=40))
```

`load_model()` returns `LoadedModel`:

- `model`
- `generator`
- `config`
- `model_path`
- `device`
- `predict(...)`

`LoadedModel` also forwards unknown attributes and calls to the underlying model.

### Cached `predict()`

```python
from arclm import predict

text = predict(
    "machine learning",
    model_path="models/arclm.pth",
    device="cpu",
    reload=False,
    max_new_tokens=30,
)
```

The module-level `predict()` caches one loaded model by resolved path and device.

## Generation

`Generator` samples token continuations.

Constructor:

```python
Generator(model, stoi, itos, block_size, device, tokenizer=None)
```

Generation parameters:

- `start_text`: input prompt.
- `max_new_tokens`: number of new tokens to sample.
- `temperature`: divides logits before softmax.
- `repetition_penalty`: penalizes previously sampled tokens.
- `top_k`: keep only top-k logits.
- `top_p`: nucleus sampling threshold.

Example:

```python
import torch
from arclm import Generator

generator = Generator(
    model=model,
    stoi=data.tokenizer.stoi,
    itos=data.tokenizer.itos,
    block_size=cfg.block_size,
    device=torch.device(cfg.device),
    tokenizer=data.tokenizer,
)

tokens = generator.generate("arc language", max_new_tokens=10, top_k=5)
text = generator.generate_string("arc language", max_new_tokens=20, top_p=0.9)
```

## Model Loading

ArcLM has two loading paths:

1. Inference loading through `load_model()`.
2. External model normalization through `load_external_model()` and `SmartLoader`.

### Local ArcLM checkpoints

```python
from arclm import load_model

loaded = load_model("models/arclm.pth", device="cpu")
```

### Native checkpoint compatibility

```python
import torch
from arclm import Config, checkpoint_is_compatible_for_continue_training

checkpoint = torch.load("models/arclm.pth", map_location="cpu")
cfg = Config(device="cpu")

is_ok = checkpoint_is_compatible_for_continue_training(
    checkpoint,
    cfg,
    vocab_size=checkpoint["vocab_size"],
)
```

There is also a public function named `checkpoint_is_compatible_for_tuining`. The name is misspelled in the current implementation and kept as-is for compatibility.

### External loaders

`load_external_model(source, map_location="cpu")` uses an ordered `LoaderRegistry`:

1. `ArcLMCheckpointLoader`
2. `SafetensorsLoader`
3. `StateDictLoader`
4. `HuggingFaceLoader`

Supported sources:

- Native ArcLM `.pth`, `.pt`, `.ckpt`
- Raw PyTorch state dict `.pth`, `.pt`, `.bin`, `.ckpt`
- `.safetensors` files if `safetensors` is installed
- Hugging Face model folders or model IDs if `transformers` can load them

```python
from arclm import load_external_model

loaded = load_external_model("models/arclm.pth", map_location="cpu")
print(loaded.source_type)
print(loaded.vocab_size)
```

### `LoadedCheckpoint`

Normalized loader output:

- `source`
- `source_type`
- `state_dict`
- `config`
- `vocab_size`
- `tokenizer_metadata`
- `vocab`
- `stoi`
- `itos`
- `optimizer_state_dict`
- `train_history`
- `metadata`
- `is_arclm_checkpoint`
- `require_state_dict()`

Example:

```python
state = loaded.require_state_dict()
print(loaded.is_arclm_checkpoint)
```

### Adapt checkpoints for ArcLM training

```python
from arclm import Config, adapt_for_training, load_external_model

loaded = load_external_model("models/raw_state.pth")
cfg = Config(vocab_size=loaded.vocab_size, device="cpu")

bundle = adapt_for_training(
    loaded,
    target_config=cfg,
    strict=False,
)

model = bundle.model
print(bundle.missing_keys)
print(bundle.unexpected_keys)
```

### Tokenizer compatibility

```python
from arclm import validate_tokenizer_compatibility

validate_tokenizer_compatibility(
    loaded,
    tokenizer=data.tokenizer,
    config=cfg,
)
```

This raises `ValueError` when vocabulary size or token-to-id mappings are incompatible.

### Hugging Face loading

The loader can normalize Hugging Face IDs or folders:

```python
from arclm import load_external_model

checkpoint = load_external_model("gpt2", map_location="cpu")
print(checkpoint.source_type)  # "huggingface"
```

The class-based `PreTrainedModelLoader` can also load from Hugging Face or a local checkpoint and return `(model, metadata)`.

```python
from arclm import Config, PreTrainedModelLoader

cfg = Config(embed_dim=64, block_size=32, num_blocks=2, dropout=0.0, device="cpu")
loader = PreTrainedModelLoader(
    source="gpt2",
    target_vocab_size=50257,
    target_config=cfg,
    device="cpu",
    strict_loading=False,
)
model, metadata = loader.load()
```

### SmartLoader

`SmartLoader` inspects sources before loading and attaches a load report.

```python
from arclm import SmartLoader

plan = SmartLoader.inspect(
    "models/arclm.pth",
    auto_detect=True,
    precision="fp32",
)

print(plan.report)
loaded = SmartLoader.load("models/arclm.pth", map_location="cpu", load_optimizer=False)
print(loaded.metadata["load_report"])
```

`LoadPlan` fields:

- `source`
- `source_type`
- `files`
- `metadata`
- `model_type`
- `architecture`
- `tokenizer`
- `weight_format`
- `precision`
- `load_as`
- `has_optimizer`
- `has_scheduler`
- `has_training_state`
- `can_resume_training`
- `resume_epoch`
- `resume_step`
- `load_optimizer`
- `load_scheduler`
- `resume_training`

## Tokenizers

### Word tokenizer: `Tokenizer`

`Tokenizer` uses whitespace splitting.

Constructor:

```python
Tokenizer(max_vocab=50000, default_token="<UNK>", user_defined_symbols=None)
```

Example:

```python
from arclm import Tokenizer

tokenizer = Tokenizer(
    max_vocab=10,
    user_defined_symbols=["<|qa_start|>", "<|res_start|>", "<|end|>"],
)
tokenizer.build("arc lm arc model")

ids = tokenizer.encode(["arc", "missing", "model"])
text_ids = tokenizer.encode_text("arc model")
tokens = tokenizer.decode(ids)
text = tokenizer.decode_string(text_ids)

print(tokenizer.get_vocab_size())
print(tokenizer.get_unknown_index())
```

Reserved symbols are inserted after `<UNK>` and before common tokens.

Save and load vocabulary:

```python
tokenizer.save_vocab("models/vocab.txt")

restored = Tokenizer(max_vocab=10)
restored.load_vocab("models/vocab.txt")
```

Save and load JSON:

```python
metadata = tokenizer.to_json()
tokenizer.save("models/tokenizer.json")
restored = Tokenizer.from_json(metadata)
```

Checkpoint metadata:

```python
checkpoint_data = tokenizer.to_checkpoint()
```

Coverage:

```python
coverage = tokenizer.analyze_coverage(
    ["arc", "unknown", "model"],
    rare_threshold=2,
    top_unknown=20,
)
```

### SentencePiece tokenizer: `SentencePieceTokenizer`

Constructor:

```python
SentencePieceTokenizer(
    max_vocab=50000,
    model_type="bpe",
    character_coverage=1.0,
    default_token="<UNK>",
    model_name=None,
    user_defined_symbols=None,
)
```

Train:

```python
from arclm import SentencePieceTokenizer

sp = SentencePieceTokenizer(
    max_vocab=8000,
    model_type="bpe",
    character_coverage=1.0,
    user_defined_symbols=["<|qa_start|>", "<|res_start|>", "<|end|>", "<|pad|>"],
)
sp.build("ArcLM trains compact language models. " * 100)
```

Tokenize and decode:

```python
ids = sp.encode_text("ArcLM trains models")
pieces = sp.decode(ids)
text = sp.decode_string(ids)
```

Save and load:

```python
sp.save("models/sp_tokenizer.json")
restored = SentencePieceTokenizer.load("models/sp_tokenizer.json")
```

From JSON:

```python
metadata = sp.to_json()
restored = SentencePieceTokenizer.from_json(metadata)
```

From checkpoint metadata:

```python
checkpoint_metadata = sp.to_checkpoint()
restored = SentencePieceTokenizer.from_checkpoint(checkpoint_metadata)
```

Metadata:

```python
print(sp.get_meta_data())
print(sp.get_vocab_size())
print(sp.get_unknown_index())
```

### Tokenizer factory

```python
from arclm import TokenizerFactory, create_tokenizer, get_tokenizer_from_config, Config

word = create_tokenizer("word", max_vocab=1000)
sp = create_tokenizer("sentencepiece", max_vocab=8000, model_type="bpe")

cfg = Config(tokenizer_type="word", max_vocab=1000)
tok = get_tokenizer_from_config(cfg)
```

Register a custom tokenizer:

```python
from arclm import Tokenizer, TokenizerFactory

class CharacterTokenizer(Tokenizer):
    def build(self, text):
        chars = sorted(set(text))
        self.vocab = [self.default_token] + chars[: self.max_vocab - 1]
        self.stoi = {token: idx for idx, token in enumerate(self.vocab)}
        self.itos = {idx: token for token, idx in self.stoi.items()}
        self.vocab_size = len(self.vocab)

    def encode_text(self, text):
        return [self.stoi.get(ch, self.get_unknown_index()) for ch in text]

TokenizerFactory.register("char", CharacterTokenizer)
tokenizer = TokenizerFactory.create("char", max_vocab=128)
```

## Data Preparation

### Token loading

```python
from arclm import Config, read_tokens, load_tokens, split_train_val

tokens = read_tokens("data/data.txt", limit=1000)

cfg = Config(data_path="data/data.txt", max_data_size=1000)
loaded = load_tokens(cfg)

train_tokens, val_tokens = split_train_val(
    loaded,
    validation_split=0.1,
    block_size=16,
    seed=42,
)
```

`read_tokens()` lowercases text, splits by whitespace, and appends `"\n"` when an input line ended with a newline.

`load_tokens()` optionally prepends repeated domain data from `domain_data_path`.

### `DataBundle`

`prepare_data()` returns:

- `tokens`
- `train_tokens`
- `val_tokens`
- `tokenizer`
- `train_loader`
- `val_loader`
- `train_encoded`
- `val_encoded`
- `vocab_size` property
- `count()`
- `save_tokenizer(path)`

```python
from arclm import Config, prepare_data

cfg = Config(data_path="data/data.txt", tokenizer_type="word", max_vocab=1000)
bundle = prepare_data(cfg)
print(bundle.vocab_size)
print(bundle.count().most_common(10))
bundle.save_tokenizer("models/tokenizer.json")
```

### `TextDataset`

```python
from arclm import TextDataset

dataset = TextDataset(list(range(20)), block_size=4)
x, y = dataset[0]
```

`TextDataset` creates next-token pairs:

- `x`: `data[idx : idx + block_size]`
- `y`: `data[idx + 1 : idx + block_size + 1]`

### `create_dataloader()`

```python
from arclm import create_dataloader

loader = create_dataloader(
    encoded_data=list(range(100)),
    block_size=8,
    batch_size=4,
    shuffle=True,
)
```

### `DataProcessor`

`DataProcessor.load(path, format=None, loader=None)` supports:

- `.json`
- `.jsonl`
- `.csv`
- `.txt`
- custom loader callable

```python
from arclm import DataProcessor

dataset = DataProcessor.load("data/qa.jsonl")
```

`ProcessedDataset` methods:

- `transform(format="pretraining", mapping=None, template=None, text_fields=None, tokenizer=None)`
- `tokenize(tokenizer, text_key="text")`
- `split(train=0.8, validation=0.1, test=0.1, seed=42)`
- `filter(predicate)`
- `clean(text_keys=None)`
- `map_batches(function, batch_size=32)`

Instruction formatting:

```python
processed = (
    DataProcessor.load("data/qa.jsonl")
    .clean()
    .filter(lambda row: bool(row.get("question")))
    .transform(
        format="instruction",
        mapping={"instruction": "question", "input": "context", "output": "answer"},
        template="<|qa_start|> {instruction}\n{input}\n<|res_start|> {output} <|end|>",
    )
)
```

Chat formatting:

```python
chat = DataProcessor.load("data/chat.jsonl").transform(format="chat")
```

Tokenization:

```python
from arclm import Tokenizer

tok = Tokenizer(max_vocab=1000)
tok.build(" ".join(sample["text"] for sample in processed.samples))
tokenized = processed.tokenize(tok)
```

Splitting:

```python
splits = processed.split(train=0.8, validation=0.1, test=0.1, seed=42)
```

### Instruction dataset

`InstructionDataset` returns dictionaries with `x`, `y`, and `mask`. The mask is `1.0` for response tokens and `0.0` for instruction/padding tokens.

```python
from arclm import InstructionDataset, create_instruction_dataloader

dataset = InstructionDataset(
    instructions=["Explain ArcLM"],
    responses=["ArcLM is a compact PyTorch language-model library."],
    tokenizer=tok,
    block_size=64,
)

loader = create_instruction_dataloader(
    instructions=["Explain ArcLM"],
    responses=["ArcLM is compact."],
    tokenizer=tok,
    block_size=64,
    batch_size=1,
    shuffle=True,
)
```

The built-in `Trainer.train()` expects `(x, y)` tuples, so dictionary batches from `InstructionDataset` need a custom training loop or adapter.

## Data Preprocessing

`arclm.preprocess` exposes:

- `PreprocessConfig`
- `PreprocessPipeline`

It processes JSONL input and writes cleaned JSONL output plus optional JSON/HTML reports.

### `PreprocessConfig`

| Option | Default | Meaning |
| --- | --- | --- |
| `text_field` | `"text"` | Input text field. |
| `output_field` | `"text"` | Output text field. |
| `min_chars` | `20` | Drop rows shorter than this. |
| `max_chars` | `100000` | Drop rows longer than this. |
| `min_words` | `3` | Drop rows with too few words. |
| `max_repeated_char_run` | `8` | Drop long repeated character runs. |
| `max_repeated_word_ratio` | `0.35` | Drop high adjacent repeated-word ratio. |
| `min_entropy` | `2.0` | Drop low character entropy. |
| `max_entropy` | `6.5` | Drop high character entropy. |
| `allowed_languages` | `["en", "ar"]` | Allowed language codes. |
| `min_language_confidence` | `0.55` | Minimum language confidence. |
| `remove_html` | `True` | Strip HTML. |
| `normalize_unicode` | `True` | Apply Unicode NFKC. |
| `lowercase` | `False` | Lowercase cleaned text. |
| `drop_urls` | `False` | Replace URLs with `[URL]`. |
| `drop_emails` | `True` | Replace emails with `[EMAIL]`. |
| `drop_phone_numbers` | `False` | Replace phone numbers with `[PHONE]`. |
| `redact_pii` | `True` | Redact email, phone, and IP patterns. |
| `exact_dedup` | `True` | Enable exact hash deduplication. |
| `near_dedup` | `True` | Enable simhash near deduplication. |
| `simhash_threshold` | `3` | Hamming threshold for near duplicates. |
| `toxicity_enabled` | `False` | Enable heuristic toxicity filter. |
| `max_toxicity_score` | `0.85` | Toxicity drop threshold. |
| `perplexity_enabled` | `False` | Enable heuristic perplexity filter. |
| `max_perplexity` | `800.0` | Perplexity drop threshold. |
| `workers` | `1` | Present in config; current pipeline runs in-process. |
| `batch_size` | `1000` | Present in config; current pipeline streams row by row. |
| `report_html` | `True` | Write HTML report when `report_dir` is set. |
| `report_json` | `True` | Write JSON report when `report_dir` is set. |

Example:

```python
from arclm.preprocess import PreprocessConfig, PreprocessPipeline

cfg = PreprocessConfig(
    min_chars=20,
    min_words=4,
    allowed_languages=["en"],
    min_language_confidence=0.1,
    drop_emails=True,
    redact_pii=True,
    near_dedup=False,
)

report = PreprocessPipeline(cfg).run(
    "data/raw.jsonl",
    "data/cleaned.jsonl",
    "reports/preprocess",
)
```

### Cleaning utilities

```python
from arclm.preprocess.cleaner import strip_html, normalize_text, redact_patterns

plain = strip_html("<p>Hello</p>")
normalized = normalize_text("Hello&nbsp;world", remove_html=True, lowercase=True)
redacted = redact_patterns("Email demo@example.com", emails=True)
```

### Quality filters

```python
from arclm.preprocess.filters import (
    word_count,
    char_entropy,
    has_long_repeated_chars,
    repeated_word_ratio,
    basic_quality_reasons,
)

count = word_count("ArcLM trains models")
entropy = char_entropy("ArcLM trains models")
long_run = has_long_repeated_chars("soooooooo", max_run=4)
ratio = repeated_word_ratio("test test data")
reasons = basic_quality_reasons("short", cfg)
```

### Duplicate removal

```python
from arclm.preprocess.duplicate import exact_hash, simhash, hamming, DuplicateIndex

h1 = exact_hash("ArcLM trains models")
h2 = simhash("ArcLM trains compact models")
distance = hamming(h2, simhash("ArcLM trains small models"))

index = DuplicateIndex()
print(index.check_and_add("ArcLM trains models"))
print(index.check_and_add("ArcLM trains models"))  # ["exact_duplicate"]
```

### Language detection

```python
from arclm.preprocess.language import detect_language, language_reasons

lang, confidence = detect_language("ArcLM trains models")
reasons = language_reasons("ArcLM trains models", cfg)
```

If `langdetect` is installed, it is used. Otherwise ArcLM falls back to a simple Arabic/Latin character heuristic.

### PII

```python
from arclm.preprocess.pii import redact_pii, pii_reasons

clean = redact_pii("Email demo@example.com from 127.0.0.1")
reasons = pii_reasons("demo@example.com")
```

### Perplexity filter

```python
from arclm.preprocess.perplexity import simple_perplexity, perplexity_reasons

ppl = simple_perplexity("arc lm arc lm")
reasons = perplexity_reasons("arc lm arc lm", cfg)
```

This is a dependency-free unigram approximation for filtering noisy text, not a neural perplexity model.

### Toxicity filter

```python
from arclm.preprocess.toxicity import toxicity_score, toxicity_reasons

score = toxicity_score("I hate this")
reasons = toxicity_reasons("I hate this", cfg)
```

The current toxicity implementation is a lightweight keyword heuristic.

### JSONL IO and reports

```python
from arclm.preprocess.io import read_jsonl, write_jsonl
from arclm.preprocess.report import write_json_report, write_html_report

rows = list(read_jsonl("data/raw.jsonl"))
written = write_jsonl("data/out.jsonl", rows)
write_json_report("reports/report.json", {"written": written})
write_html_report("reports/report.html", {"total": 1, "kept": 1, "dropped": 0, "drop_rate": 0.0, "reasons": {}})
```

### Dataset statistics

```python
from arclm.preprocess.statistics import DatasetStats

stats = DatasetStats()
stats.add("ArcLM trains models", kept=True, reasons=[])
print(stats.to_dict())
```

### Tokenizer statistics

```python
from arclm.preprocess.tokenizer_stats import whitespace_token_stats

stats = whitespace_token_stats(["arc lm arc", "models train"], top_k=10)
```

## Pipelines

### Functional pipeline

The main functional pipeline is `train_model()` in `arclm.pipeline`. It is the most complete high-level workflow in the current codebase.

```python
from arclm import train_model

result = train_model(
    mode="pretrain",
    data="data/data.txt",
    output="models/model.pth",
    num_epochs=1,
    device="cpu",
)
```

### Builder helpers

```python
from arclm import build_model, build_trainer

model = build_model(cfg, vocab_size=data.vocab_size)
trainer = build_trainer(model, cfg)
```

### `UnifiedPipeline`

`UnifiedPipeline` supports modes:

- `"pre_training"`
- `"fine_tuning"`
- `"instruction_tuning"`

Example from scratch:

```python
from arclm import Config, UnifiedPipeline

cfg = Config(device="cpu", num_epochs=1)
pipeline = UnifiedPipeline(cfg, mode="pre_training")
pipeline.build(vocab_size=1000)
results = pipeline.train(train_loader, val_loader=None, num_epochs=1)
path = pipeline.save_checkpoint("models/unified.pth")
model = pipeline.get_model()
```

Example with a pretrained source:

```python
from arclm import UnifiedPipeline, StoppingCriteria

pipeline = UnifiedPipeline(
    cfg,
    mode="fine_tuning",
    pretrained_source="models/arclm.pth",
    stopping_criteria=StoppingCriteria(early_stopping_patience=2),
)
pipeline.build(vocab_size=cfg.vocab_size)
```

Current note: `StoppingCriteria.max_steps` exists, but `UnifiedPipeline.train()` currently delegates to `Trainer.train()` and does not enforce step-based stopping.

### `pipeline_v2`

`arclm.pipeline_v2` is a compatibility re-export module. It exports:

- `ModelAdapter`
- `PreTrainedModelLoader`
- `StoppingCriteria`
- `UnifiedPipeline`
- `build_model`
- `build_optimizer_with_discriminative_lr`
- `build_trainer`

## Building Your Own Components

### Custom Models

Custom models should accept token IDs shaped `[B, T]` and return logits shaped `[B, T, V]` if you want to use the built-in `Trainer`.

```python
import torch.nn as nn

class TinyLM(nn.Module):
    def __init__(self, vocab_size, embed_dim):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, embed_dim)
        self.head = nn.Linear(embed_dim, vocab_size)

    def forward(self, idx):
        return self.head(self.embedding(idx))
```

```python
import torch
from arclm import Config, Trainer

cfg = Config(vocab_size=100, device="cpu")
model = TinyLM(100, 32)
optimizer = torch.optim.AdamW(model.parameters(), lr=cfg.learning_rate)
criterion = nn.CrossEntropyLoss()
trainer = Trainer(model, optimizer, criterion, cfg)
```

### Custom Trainers

Subclass or wrap `Trainer` when your batches are not `(x, y)`, such as `InstructionDataset` dictionaries.

```python
class InstructionTrainer:
    def __init__(self, model, optimizer, criterion, device):
        self.model = model
        self.optimizer = optimizer
        self.criterion = criterion
        self.device = device

    def train_one_batch(self, batch):
        x = batch["x"].to(self.device)
        y = batch["y"].to(self.device)
        mask = batch["mask"].to(self.device)
        logits = self.model(x)
        loss_per_token = self.criterion(
            logits.view(-1, logits.size(-1)),
            y.view(-1),
        ).view_as(mask)
        loss = (loss_per_token * mask).sum() / mask.sum().clamp_min(1.0)
        return loss
```

### Custom Tokenizers

Register custom tokenizer implementations with `TokenizerFactory.register()`.

```python
from arclm import TokenizerFactory

TokenizerFactory.register("my_tokenizer", MyTokenizer)
tokenizer = TokenizerFactory.create("my_tokenizer")
```

### Custom Pipelines

```python
from arclm.training import BaseTrainingPipeline

class ResearchPipeline(BaseTrainingPipeline):
    def build(self, vocab_size: int):
        self.vocab_size = vocab_size
        return self

    def train(self, train_loader, val_loader=None, num_epochs=None):
        return {"epochs": num_epochs}

    def save_checkpoint(self, path=None):
        return path

    def get_model(self):
        return getattr(self, "model", None)
```

### Custom Data Loaders

```python
from arclm import DataProcessor

def load_pairs(path):
    for line in path.read_text(encoding="utf-8").splitlines():
        left, right = line.split("\t", 1)
        yield {"input": left, "output": right}

dataset = DataProcessor.load("data/pairs.tsv", loader=load_pairs)
```

### Custom Datasets

Any PyTorch dataset that yields `(x, y)` can be used with `Trainer.train()`.

```python
import torch
from torch.utils.data import Dataset

class PairDataset(Dataset):
    def __len__(self):
        return 100

    def __getitem__(self, idx):
        x = torch.randint(0, 100, (16,))
        y = torch.randint(0, 100, (16,))
        return x, y
```

### Custom Preprocessors

Use `ProcessedDataset.map_batches()` for record-level transformations.

```python
def add_lengths(batch):
    for row in batch:
        item = dict(row)
        item["length"] = len(item.get("text", ""))
        yield item

processed = DataProcessor.load("data/data.jsonl").map_batches(add_lengths, batch_size=32)
```

### Custom Model Inspectors

```python
from arclm import ModelInspector, LoadPlan, register_model_inspector

class CustomInspector(ModelInspector):
    def can_inspect(self, source):
        return str(source).endswith(".custom")

    def inspect(self, source):
        return LoadPlan(
            source=str(source),
            source_type="file",
            model_type="custom",
            weight_format="custom",
        )

register_model_inspector(CustomInspector())
```

## Extension Guide

Use these extension points:

- Tokenizer registration: `TokenizerFactory.register(tokenizer_type, tokenizer_class)`.
- Model-source inspection: subclass `ModelInspector` and call `register_model_inspector()`.
- Checkpoint loading: subclass `CheckpointLoader` and register it in a `LoaderRegistry`.
- Model adaptation: use `adapt_for_training()` or implement `BaseModelAdapter`.
- Training orchestration: implement `BaseTrainingPipeline`.
- Experiment logging: use `ExperimentTracker` or pass an `AsyncTrainingLogger` to `build_trainer()`.
- Data preparation: pass a custom loader to `DataProcessor.load()`.
- Batch transformation: use `ProcessedDataset.map_batches()`.
- Checkpoint saves: pass `checkpoint_callback` to `Trainer.train()`.

Example custom loader registry:

```python
from arclm.loaders import LoaderRegistry, CheckpointLoader, LoadedCheckpoint

class EmptyLoader(CheckpointLoader):
    source_type = "empty"

    def can_load(self, source):
        return source == "empty"

    def load(self, source, map_location="cpu"):
        return LoadedCheckpoint(source="empty", source_type="empty", state_dict={})

registry = LoaderRegistry()
registry.register(EmptyLoader())
```

## API Examples

### Version and available models

```python
import arclm

print(arclm.get_version())
print(arclm.list_available_models())
```

### Trusted training checkpoint loading

```python
from arclm import load_training_checkpoint

checkpoint = load_training_checkpoint("models/arclm.pth", "cpu")
```

Only use this for trusted checkpoint files because it calls `torch.load(..., weights_only=False)`.

### Build a model from config

```python
from arclm import Config, build_model

cfg = Config(vocab_size=100, embed_dim=32, block_size=16, num_blocks=1, device="cpu")
model = build_model(cfg)
```

### Save a resumable checkpoint

```python
from arclm import save_training_checkpoint

save_training_checkpoint(trainer, cfg, data.tokenizer, data.vocab_size)
```

### Load a compatible checkpoint into a trainer

```python
from arclm import load_compatible_checkpoint

loaded_existing = load_compatible_checkpoint(
    trainer,
    cfg,
    data.vocab_size,
    tokenizer=data.tokenizer,
)
```

### Create epoch checkpoint callback

```python
from arclm import create_epoch_checkpoint_callback

callback = create_epoch_checkpoint_callback(cfg, data.tokenizer, data.vocab_size)
```

This is a backward-compatible alias for `create_checkpoint_callback()`.

### Top-k predictions

```python
from arclm import predict_top_k, format_top_k_predictions

predictions = predict_top_k(
    model,
    data.tokenizer.stoi,
    data.tokenizer.itos,
    cfg.block_size,
    cfg.device,
    "machine learning",
    k=5,
    tokenizer=data.tokenizer,
)
print(format_top_k_predictions("machine learning", predictions))
```

### Concept benchmark

```python
from arclm import (
    ConceptBenchmarkCase,
    score_concept_relationships,
    format_concept_benchmark_report,
)

cases = [ConceptBenchmarkCase("python", ["programming", "language"])]
report = score_concept_relationships(
    model,
    data.tokenizer.stoi,
    data.tokenizer.itos,
    cfg.block_size,
    cfg.device,
    benchmark_cases=cases,
    tokenizer=data.tokenizer,
)
print(format_concept_benchmark_report(report))
```

### Tokenizer coverage report

```python
from arclm import format_tokenizer_coverage_report

coverage = data.tokenizer.analyze_coverage(data.val_tokens or data.tokens)
print(format_tokenizer_coverage_report(coverage))
```

### Training diagnostics report

```python
from arclm import build_training_diagnostics_report

print(build_training_diagnostics_report(model, data, cfg))
```

### Long-context evaluation

```python
from arclm import run_long_context_evaluation, format_long_context_results

results = run_long_context_evaluation(
    cfg,
    block_sizes=(16, 32),
    sample_prompt="ArcLM is",
)
print(format_long_context_results(results))
```

This function trains one model per block size, so use tiny settings for quick experiments.

### Evaluation metrics

```python
from arclm import calculate_metrics, export_metrics_to_json, export_metrics_to_markdown

metrics = calculate_metrics(model, data.val_loader, cfg, device=cfg.device)
print(metrics.to_dict())
export_metrics_to_json(metrics, "reports/metrics.json")
export_metrics_to_markdown(metrics, "reports/metrics.md")
```

### Perplexity

```python
from arclm import calculate_perplexity

print(calculate_perplexity(2.5))
```

### Experiment tracking

```python
from arclm.tracking import ExperimentTracker, create_experiment, list_experiments

tracker = create_experiment("baseline", experiment_dir="experiments")
tracker.log_config(cfg)
tracker.log_metrics({"loss": 2.5}, step=1)
tracker.log_text("notes", "notes.txt")
tracker.end()

print(list_experiments("experiments"))
```

Local tracking writes:

- `config.json`
- `metrics.jsonl`
- `artifacts/`
- `metadata.json`

MLflow:

```python
tracker = ExperimentTracker("mlflow_run", backend="mlflow", tracking_uri="file:./mlruns")
```

Weights & Biases:

```python
tracker = ExperimentTracker("wandb_run", backend="wandb", project="arclm")
```

### Async training logger

```python
from arclm.logging import AsyncTrainingLogger

with AsyncTrainingLogger("runs/events.jsonl", console=False) as logger:
    logger.info("started")
    logger.metric("loss", value=1.23, step=1)
```

### Regularization utilities

```python
from arclm import (
    L1Regularization,
    L2Regularization,
    EarlyStopping,
    LearningRateScheduler,
    GeneralizationMonitor,
    MixupAugmentation,
    LabelSmoothing,
)
from arclm.regularization import Dropout

l1_loss = L1Regularization(lambda_l1=1e-4).compute_loss(model)
l2_loss = L2Regularization(lambda_l2=1e-4).compute_loss(model)

stopper = EarlyStopping(patience=3, min_delta=1e-4)
should_stop = stopper.check(val_loss=2.0)
stopper.reset()

scheduler = LearningRateScheduler(optimizer, strategy="cosine", total_epochs=10)
scheduler.step(epoch=1)

monitor = GeneralizationMonitor()
monitor.update(train_loss=1.0, val_loss=1.2)
print(monitor.get_report())

dropout = Dropout(dropout_rate=0.2)
```

Label smoothing:

```python
import torch
from arclm import LabelSmoothing

criterion = LabelSmoothing(num_classes=10, smoothing=0.1)
loss = criterion(torch.randn(4, 10), torch.tensor([1, 2, 3, 4]))
```

Mixup:

```python
import torch
from arclm import MixupAugmentation

mixup = MixupAugmentation(alpha=1.0)
x = torch.randn(4, 16)
y = torch.randn(4, 16)
mixed_x, mixed_y = mixup(x, y)
```

### Benchmark utilities

```python
from arclm.utils import PreModelBenchmark, BenchmarkMetrics

benchmark = PreModelBenchmark(
    model=loaded,
    model_name="arclm",
    prompts={"basic": ["ArcLM is"]},
    temperatures=[0.5, 1.0],
    max_new_tokens=20,
)
results = benchmark.run(log=False)
benchmark.save_json(results, "reports/benchmark.json")
benchmark.save_txt(results, "reports/benchmark.txt")

metrics = BenchmarkMetrics()
summary = metrics.compute(
    prompt="ArcLM is",
    output="ArcLM is a compact model library.",
    generation_time=0.25,
)
```

### Logic utilities

```python
from arclm import Symbol, And, Or, Not, Implication, Biconditional, model_check

rain = Symbol("rain")
wet = Symbol("wet")
knowledge = And(Implication(rain, wet), rain)
query = wet

print(knowledge.formula())
print(knowledge.symbols())
print(model_check(knowledge, query))

either = Or(rain, Not(wet))
same = Biconditional(rain, wet)
```

### Flask prediction app

`app.py` exposes:

- `GET /`
- `POST /predict`
- `POST /generate`
- `GET /health`

Run:

```bash
MODEL_PATH=models/arclm.pth python app.py
```

Request:

```bash
curl -X POST http://localhost:5000/generate ^
  -H "Content-Type: application/json" ^
  -d "{\"prompt\":\"ArcLM is\",\"max_tokens\":20,\"temperature\":0.8}"
```

On Windows PowerShell, use:

```powershell
$body = @{ prompt = "ArcLM is"; max_tokens = 20; temperature = 0.8 } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri http://localhost:5000/generate -ContentType "application/json" -Body $body
```

## Advanced Usage

### Domain data mixing

```python
from arclm import Config, prepare_data

cfg = Config(
    data_path="data/general.txt",
    domain_data_path="data/domain.txt",
    domain_data_repeats=3,
    max_data_size=100000,
)
data = prepare_data(cfg)
```

Domain data is loaded first and repeated up to `domain_data_repeats`, then main data fills the remaining token budget.

### Restore tokenizer from a checkpoint

```python
import torch
from arclm.data import load_tokenizer_from_checkpoint

checkpoint = torch.load("models/arclm.pth", map_location="cpu", weights_only=False)
tokenizer = load_tokenizer_from_checkpoint(checkpoint)
```

### Inference fallback tokenizer

`load_model()` restores SentencePiece from `tokenizer_metadata.model_proto` when available. If a SentencePiece checkpoint has no serialized model proto, it falls back to `stoi`/`itos` lookup with a warning.

### Manual `LoadedCheckpoint` adaptation

```python
from arclm.loaders import config_from_checkpoint

cfg = config_from_checkpoint(loaded, device="cpu", learning_rate=1e-4)
```

### Inspect a Hugging Face-like folder without loading weights

```python
from arclm import SmartLoader

plan = SmartLoader.inspect("path/to/model-folder")
print(plan.to_dict())
print(plan.format_report())
```

### Manual SmartLoader mode

```python
plan = SmartLoader.inspect(
    "path/to/source",
    auto_detect=False,
    model_type="mistral",
    tokenizer="auto",
    weight_format="bin",
    precision="fp16",
    load_as="full_model",
)
```

### Command Line Interface

The package contains `arclm.cli` with parsers for:

- `train`
- `eval`
- `generate`

Run:

```bash
python -m arclm.cli --help
python -m arclm.cli generate --model models/arclm.pth --prompt "ArcLM is"
```

Current implementation note: `generate` uses the current `load_model()` path. The `train` and `eval` command implementations contain calls that match older dataset signatures (`TextDataset(text, tokenizer, seq_len=...)` and `create_dataloader(dataset, batch_size=...)`). The maintained current training path is the programmatic `train_model()` API and the example scripts under `examples/`.

### Root scripts

`train.py` is a full training script that:

- creates a `Config`
- prepares data
- trains with `Trainer`
- saves a checkpoint
- generates a sample

`arclm.py` is a Colab-derived training script with similar logic and hard-coded Colab paths.

## Best Practices

- Use `create_config()` when accepting user-provided config keys because it validates unknown names.
- Set `training_log_interval=0` for tests and tiny examples.
- Always save tokenizer metadata with checkpoints.
- Use `SentencePieceTokenizer` for open-vocabulary text and `Tokenizer` for tiny controlled experiments.
- For `continue_training`, reuse the checkpoint tokenizer.
- For `finetune`, enable `freeze_backbone=True` and a low learning rate for small datasets.
- Use `validation_split > 0` with `early_stopping_patience` when you care about generalization.
- Use `grad_clip` when training becomes unstable.
- Prefer `train_model()` for end-to-end training unless you need custom loops.
- Use `SmartLoader.inspect()` before loading unknown model folders.
- Treat `torch.load(..., weights_only=False)` checkpoints as trusted input only.

## Performance Tips

- Increase `batch_size` until memory becomes the limiting factor.
- Keep `block_size` small for quick experiments.
- Increase `embed_dim` and `num_blocks` gradually.
- Use CUDA by setting `device="cuda"` when available.
- Use `max_data_size` to cap exploratory runs.
- Use `max_vocab` to keep token embeddings manageable.
- Use `training_log_interval` to reduce console overhead on fast runs.
- Use SentencePiece for larger or noisier datasets.
- Disable validation with `validation_split=0.0` for fastest smoke tests.
- Use `checkpoint_batch_interval` carefully; frequent checkpoint writes can slow training.

## Troubleshooting

### `ValueError: Tokenizer not built. Call build() first.`

Call `tokenizer.build(text)` before encoding with `Tokenizer`.

### `FileNotFoundError: Model checkpoint not found`

Pass the correct `model_path` to `load_model()` or train a model first.

### `Checkpoint is missing required field: stoi`

Inference loading requires checkpoint vocabulary mappings. Save checkpoints through `Trainer.save()` or `train_model()`.

### `Tokenizer vocabulary size is incompatible with checkpoint`

Use the tokenizer saved in the checkpoint, or train a new model/head with a matching vocabulary size.

### `Loading .safetensors files requires the safetensors package`

Install:

```bash
pip install safetensors
```

### `PyYAML not installed`

Install:

```bash
pip install PyYAML
```

or:

```bash
pip install -e .[preprocess]
```

### SentencePiece training fails or creates a smaller vocab

`SentencePieceTokenizer` passes `hard_vocab_limit=False`, so small datasets can produce fewer pieces than `max_vocab`. This is expected.

### Instruction dataset does not train with `Trainer`

`InstructionDataset` yields dict batches. The current `Trainer` expects `(x, y)` tuple batches. Use a custom trainer loop for response-mask loss.

### `arclm.cli train` fails with dataset argument errors

Use `train_model()` or the scripts in `examples/`. The CLI training command is present but stale relative to the current dataset API.

## FAQ

### Is ArcLM a large-scale distributed training framework?

No. The current implementation is compact and local-first. It does not implement distributed training, mixed precision training loops, or multi-node orchestration.

### Does ArcLM implement multi-head attention?

The current `SelfAttention` implementation uses full embedding projections and a causal mask. There is no public `num_heads` model parameter in `ArcLM`.

### Does `Config` support `num_heads`?

`Config` does not store `num_heads` in the current implementation. Some older docs/scripts mention it, but `ArcLM` does not use it.

### Does ArcLM support Hugging Face models?

Yes, through `HuggingFaceLoader`, `PreTrainedModelLoader`, and `SmartLoader` inspection. Adaptation is best-effort and depends on compatible state dictionary names and tensor shapes.

### Does ArcLM support LoRA or PEFT training?

No built-in LoRA training is implemented. `SmartLoader` can detect adapter-like files in a folder and mark `load_as="adapter"`, but no PEFT training path is implemented.

### Does preprocessing use a trained toxicity classifier?

No. Current toxicity filtering is a lightweight keyword heuristic.

### Does preprocessing use a neural language model for perplexity?

No. Current preprocessing perplexity is a simple unigram approximation.

### What license does ArcLM use?

Apache License 2.0.

## Contributing

Contributions should preserve the current public API or document breaking changes clearly.

Recommended workflow:

1. Create or update tests under `tests/`.
2. Run `pytest`.
3. Keep public examples aligned with actual signatures.
4. Update this README when public APIs change.
5. Keep checkpoints and generated reports out of commits unless intentionally needed.

Good contribution areas:

- Fixing stale CLI training/evaluation commands.
- Adding tests for `UnifiedPipeline`.
- Adding masked-loss instruction training.
- Improving Hugging Face adaptation coverage.
- Adding optional trained classifiers for preprocessing.
- Expanding tokenizer support.
- Improving docs consistency across `docs/`.

## Development Guide

Install in editable mode:

```bash
pip install -e .[dev,preprocess,web]
```

Run tests:

```bash
pytest
```

Build package:

```bash
python -m build
```

Check distributions:

```bash
python -m twine check dist/*
```

Release helper:

```bash
python setup.py release --version 0.3.2
```

The release command can run tests, build distributions, check them with Twine, optionally tag, optionally push, and optionally upload.

Version source of truth:

```text
arclm/_version.py
```

Current version in this repository:

```python
__version__ = "0.3.1"
```

## Testing

The test suite currently covers:

- tokenizer round trips
- reserved tokenizer symbols
- model forward shape
- `prepare_data()` and checkpoint saving
- checkpoint batch interval saves
- dataloader shapes
- DataProcessor JSONL/TXT loading, transforms, tokenization, filtering, and splitting
- external raw state-dict loading and adaptation
- native ArcLM checkpoint loading and tokenizer compatibility
- high-level `train_model()` pretraining checkpoint and metrics output
- tokenizer factory registration
- training base-class inheritance
- `pipeline_v2` compatibility exports
- preprocessing filtering, redaction, duplicate removal, and report writing
- SmartLoader folder inspection, manual overrides, and custom inspectors

Run:

```bash
pytest
```

Run one file:

```bash
pytest tests/test_smart_loader.py
```

## Security

Model checkpoints can execute unsafe deserialization paths when loaded with `torch.load(..., weights_only=False)`. ArcLM uses this for trusted ArcLM training checkpoints and compatibility with older PyTorch versions.

Security recommendations:

- Load checkpoints only from trusted sources.
- Prefer `.safetensors` for untrusted tensor-only weights when possible.
- Do not expose `load_training_checkpoint()` to arbitrary user uploads.
- Validate file paths in web or service deployments.
- Review generated text before using it in downstream systems.
- Treat preprocessing redaction as heuristic, not a formal privacy guarantee.

## License

ArcLM is licensed under the Apache License 2.0.

See [LICENSE](LICENSE).

## Citation

If you use ArcLM in research, education, or a project, cite the repository:

```bibtex
@software{arclm,
  title = {ArcLM: A compact PyTorch language-model training and fine-tuning library},
  author = {Ahmad Al Dibo},
  year = {2026},
  license = {Apache-2.0},
  url = {https://github.com/ahmad-al-dibo/arclm}
}
```
