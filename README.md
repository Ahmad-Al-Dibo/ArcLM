# ArcLM

ArcLM 0.4.2

ArcLM is a compact Python/PyTorch library for training, fine-tuning, loading, and using small causal language models. It includes a readable GPT-style model, tokenizer utilities, checkpoint handling, continued training, supervised fine-tuning helpers, Hugging Face model loading, optional LoRA/PEFT SFT, inference, diagnostics, and dataset preprocessing.

ArcLM is designed for local experiments, education, custom small models, and practical fine-tuning workflows. It is not a distributed large-scale training framework.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Main Features](#main-features)
- [Basic Usage](#basic-usage)
- [Low-Level Interface](#low-level-interface)
- [Core Classes](#core-classes)
- [Tokenizers](#tokenizers)
- [Data Processing](#data-processing)
- [Training From Scratch](#training-from-scratch)
- [Continue Training](#continue-training)
- [Fine-Tuning](#fine-tuning)
- [SFT / Instruction Tuning](#sft--instruction-tuning)
- [ArcLM-Native Instruction Tuning](#arclm-native-instruction-tuning)
- [Fine-Tuning Qwen3-0.6B With ArcLM](#fine-tuning-qwen3-06b-with-arclm)
- [Dataset Formats](#dataset-formats)
- [Assistant-Only Loss](#assistant-only-loss)
- [Chat Templates](#chat-templates)
- [LoRA / PEFT](#lora--peft)
- [Hugging Face Model Loading](#hugging-face-model-loading)
- [ArcLM-Native Checkpoints](#arclm-native-checkpoints)
- [Loading And Inference](#loading-and-inference)
- [API Overview](#api-overview)
- [Extension Points And Base Classes](#extension-points-and-base-classes)
- [Diagnostics And Evaluation](#diagnostics-and-evaluation)
- [Regularization Helpers](#regularization-helpers)
- [Saved Files](#saved-files)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)
- [Current Limitations](#current-limitations)
- [Roadmap](#roadmap)
- [License](#license)

## Installation

Install ArcLM from PyPI:

```bash
pip install arclm
```

Optional extras are available for features that use additional packages:

```bash
pip install "arclm[peft]"
pip install "arclm[preprocess]"
pip install "arclm[web]"
```

Use `arclm[peft]` when running `train_sft(..., use_lora=True)`.

## Quick Start

Train a tiny ArcLM model from plain text:

```python
from arclm import train_model

result = train_model(
    mode="pretrain",
    data="data/train.txt",
    output="models/arclm.pth",
    tokenizer_type="word",
    max_vocab=1000,
    embed_dim=64,
    num_blocks=2,
    block_size=64,
    batch_size=8,
    num_epochs=1,
)

print(result.model_path)
```

Load the saved checkpoint and generate text:

```python
from arclm import load_model

model = load_model("models/arclm.pth", device="cpu")
text = model.predict("ArcLM is", max_new_tokens=30, temperature=0.8, top_p=0.9)
print(text)
```

## Main Features

- Pre-training compact causal language models from text.
- Continued training from ArcLM checkpoints.
- Next-token fine-tuning from ArcLM or compatible external checkpoints.
- Hugging Face causal-LM supervised fine-tuning through `train_sft`.
- Assistant-only loss masking for SFT.
- Optional LoRA/PEFT adapters for Hugging Face SFT.
- Word and SentencePiece tokenizer support.
- Checkpoint saving, loading, tokenizer restoration, and inference.
- External checkpoint inspection and loading helpers.
- JSON, JSONL, CSV, and TXT dataset utilities.
- Dataset preprocessing helpers for cleaning, filtering, deduplication, and reports.
- Diagnostics for metrics, top-k predictions, tokenizer coverage, and simple benchmarks.

## Basic Usage

Common imports:

```python
from arclm import (
    ArcLM,
    Config,
    Tokenizer,
    SentencePieceTokenizer,
    train_model,
    train_sft,
    load_model,
    load_external_model,
    SmartLoader,
)
```

Check the installed version:

```python
import arclm

print(arclm.get_version())
```

## Low-Level Interface

The high-level APIs are `train_model` and `train_sft`. Use the low-level interface when you want to control each step yourself: tokenizer building, encoding, dataloader creation, model construction, optimizer/trainer setup, training, and saving.

Main low-level building blocks:

| API | Purpose |
| --- | --- |
| `Config` / `create_config` | Create training settings. |
| `Tokenizer` / `SentencePieceTokenizer` | Build and use a tokenizer. |
| `TextDataset` | Sliding-window next-token dataset. |
| `create_dataloader` | Create a PyTorch DataLoader from encoded token IDs. |
| `build_model` | Build an `ArcLM` model from config. |
| `build_trainer` | Create optimizer, loss, and `Trainer`. |
| `Trainer.train` | Run the training loop. |
| `Trainer.save` / `Trainer.load` | Save or resume native ArcLM checkpoints. |

Complete low-level pretraining example:

```python
from arclm import (
    Tokenizer,
    create_config,
    create_dataloader,
    build_model,
    build_trainer,
)

text = open("data/train.txt", encoding="utf-8").read()

tokenizer = Tokenizer(max_vocab=2000)
tokenizer.build(text)
encoded = tokenizer.encode_text(text)

config = create_config(
    vocab_size=tokenizer.get_vocab_size(),
    block_size=64,
    batch_size=8,
    embed_dim=128,
    num_blocks=2,
    learning_rate=3e-4,
    num_epochs=2,
    model_path="models/low_level_arclm.pth",
    device="cpu",
)

train_loader = create_dataloader(
    encoded_data=encoded,
    block_size=config.block_size,
    batch_size=config.batch_size,
    shuffle=True,
)

model = build_model(config)
trainer = build_trainer(model, config)
trainer.train(train_loader, config.num_epochs)
trainer.save(
    config,
    vocab=tokenizer.vocab,
    stoi=tokenizer.stoi,
    itos=tokenizer.itos,
    tokenizer_metadata=tokenizer.to_checkpoint(),
)
```

Low-level training with validation and early stopping:

```python
from arclm import create_dataloader

split = int(len(encoded) * 0.9)
train_ids = encoded[:split]
val_ids = encoded[split:]

train_loader = create_dataloader(train_ids, config.block_size, config.batch_size)
val_loader = create_dataloader(val_ids, config.block_size, config.batch_size, shuffle=False)

trainer.train(
    train_loader,
    config.num_epochs,
    val_loader=val_loader,
    early_stopping_patience=3,
    min_delta=1e-4,
)
```

Freeze and unfreeze layers during low-level fine-tuning:

```python
trainer.freeze_layers("blocks")
trainer.freeze_layers("token_embedding")

print(trainer.get_frozen_layers_info())

trainer.unfreeze_layers("blocks")
```

Use the low-level interface when you need custom batching, extra losses, manual checkpoint timing, custom logging, or integration with another training system.

## Core Classes

These are the main classes most users will touch:

| Class or function | What it does |
| --- | --- |
| `ArcLM` | The built-in compact causal language model. |
| `Config` | Stores model, tokenizer, data, training, checkpoint, and fine-tuning settings. |
| `Tokenizer` | Simple word-level tokenizer for small controlled datasets. |
| `SentencePieceTokenizer` | Subword tokenizer for larger or noisier text. |
| `TokenizerFactory` | Creates tokenizer instances by name. |
| `TextDataset` | Sliding-window next-token dataset for plain token IDs. |
| `InstructionDataset` | Instruction/response dataset with assistant-only loss masks for native ArcLM training. |
| `Trainer` | Lower-level training loop for ArcLM models. |
| `TrainingResult` | Return object from `train_model`. |
| `SFTTrainingResult` | Return object from `train_sft`. |
| `LoadedModel` | Inference wrapper returned by `load_model`. |
| `LoadedCheckpoint` | Normalized loaded checkpoint returned by external loaders. |
| `SmartLoader` | Inspects model sources before loading. |

Create a model manually:

```python
from arclm import ArcLM, Config

config = Config(
    vocab_size=1000,
    embed_dim=128,
    block_size=64,
    num_blocks=2,
    dropout=0.1,
    device="cpu",
)

model = ArcLM(
    vocab_size=config.vocab_size,
    embed_dim=config.embed_dim,
    block_size=config.block_size,
    num_blocks=config.num_blocks,
    dropout=config.dropout,
)
```

For most workflows, prefer `train_model` or `train_sft`. Use manual classes when you need a custom loop or custom data pipeline.

## Tokenizers

Use the word tokenizer for tiny examples and controlled text:

```python
from arclm import Tokenizer

tokenizer = Tokenizer(max_vocab=1000, user_defined_symbols=["<|instruction|>", "<|response|>"])
tokenizer.build("ArcLM trains compact language models")

ids = tokenizer.encode_text("ArcLM trains models")
text = tokenizer.decode_string(ids)
print(ids, text)
```

Use SentencePiece for larger datasets:

```python
from arclm import SentencePieceTokenizer

tokenizer = SentencePieceTokenizer(max_vocab=8000, model_type="bpe")
tokenizer.build(open("data/train.txt", encoding="utf-8").read())

ids = tokenizer.encode_text("ArcLM supports subword tokenization.")
print(tokenizer.decode_string(ids))
```

Use the factory when tokenizer type is a setting:

```python
from arclm import create_tokenizer

tokenizer = create_tokenizer("word", max_vocab=5000)
```

## Data Processing

`DataProcessor` loads common file formats into a small in-memory `ProcessedDataset`.

```python
from arclm import DataProcessor

dataset = (
    DataProcessor.load("data/instructions.jsonl")
    .clean()
    .transform(
        format="instruction",
        template="<|instruction|>\n{instruction}\n<|response|>\n{output}",
    )
)

splits = dataset.split(train=0.8, validation=0.1, test=0.1, seed=42)
print(len(splits["train"]), len(splits["validation"]), len(splits["test"]))
```

Filter and tokenize records:

```python
from arclm import DataProcessor, Tokenizer

records = DataProcessor.load("data/text.jsonl").clean()
records = records.filter(lambda row: len(row.get("text", "")) > 20)

tokenizer = Tokenizer(max_vocab=2000)
tokenizer.build(" ".join(row["text"] for row in records.samples))

tokenized = records.tokenize(tokenizer)
print(tokenized.samples[0]["tokens"])
```

## Training From Scratch

`train_model(mode="pretrain")` trains a new ArcLM model from random initialization using next-token prediction.

```python
from arclm import train_model

result = train_model(
    mode="pretrain",
    data="data/train.txt",
    output="models/pretrained_arclm.pth",
    tokenizer_type="sentencepiece",
    sentencepiece_model_type="bpe",
    max_vocab=8000,
    embed_dim=256,
    num_blocks=4,
    block_size=256,
    batch_size=16,
    learning_rate=3e-4,
    num_epochs=3,
    validation_split=0.1,
)
```

Input data for pre-training is plain text:

```text
ArcLM trains compact language models.
Each line can be part of the training corpus.
```

Small CPU smoke test:

```python
from arclm import train_model

train_model(
    mode="pretrain",
    data="data/tiny.txt",
    output="models/tiny_arclm.pth",
    tokenizer_type="word",
    max_vocab=500,
    embed_dim=32,
    num_blocks=1,
    block_size=32,
    batch_size=4,
    num_epochs=1,
    validation_split=0.0,
    training_log_interval=0,
    device="cpu",
)
```

## Continue Training

Use continued training when you want to keep training an ArcLM checkpoint with compatible tokenizer and model settings.

```python
from arclm import train_model

result = train_model(
    mode="continue_training",
    checkpoint="models/pretrained_arclm.pth",
    data="data/more_text.txt",
    output="models/continued_arclm.pth",
    num_epochs=1,
    learning_rate=1e-4,
)
```

Continued training requires a checkpoint with restorable ArcLM tokenizer metadata, or an explicit tokenizer that matches the checkpoint.

Continue with an explicitly restored tokenizer:

```python
from arclm import tokenizer_from_checkpoint, train_model

tokenizer = tokenizer_from_checkpoint("models/pretrained_arclm.pth")

train_model(
    mode="continue_training",
    checkpoint="models/pretrained_arclm.pth",
    tokenizer=tokenizer,
    data="data/domain_text.txt",
    output="models/domain_continued_arclm.pth",
    num_epochs=2,
    learning_rate=1e-4,
)
```

## Fine-Tuning

`train_model(mode="finetune")` fine-tunes an ArcLM-compatible checkpoint with the normal next-token objective over formatted text.

```python
from arclm import train_model

result = train_model(
    mode="finetune",
    checkpoint="models/pretrained_arclm.pth",
    data="data/fine_tune_text.txt",
    output="models/finetuned_arclm.pth",
    freeze_backbone=True,
    learning_rate=5e-5,
    num_epochs=2,
)
```

For instruction tuning with assistant-only loss, use `train_sft` for Hugging Face models or `InstructionDataset` with `Trainer` for ArcLM-native workflows.

Fine-tune with a smaller learning rate and frozen backbone:

```python
from arclm import train_model

train_model(
    mode="finetune",
    checkpoint="models/pretrained_arclm.pth",
    data="data/task_text.txt",
    output="models/task_finetuned_arclm.pth",
    freeze_backbone=True,
    freeze_embedding=True,
    learning_rate=2e-5,
    weight_decay=0.01,
    num_epochs=3,
)
```

## SFT / Instruction Tuning

ArcLM 0.4.2 includes a public SFT API:

```python
from arclm import train_sft

result = train_sft(
    model="Qwen/Qwen3-0.6B",
    dataset="examples/qwen3_0_6b_sft/data/sample_sft.jsonl",
    output_dir="examples/qwen3_0_6b_sft/output/qwen3_0_6b_sft_lora",
    backend="huggingface",
    assistant_only_loss=True,
    use_lora=True,
    batch_size=1,
    gradient_accumulation_steps=8,
    learning_rate=2e-4,
    num_epochs=1,
    max_length=1024,
    dtype="auto",
    device_map="auto",
)
```

Implemented behavior:

- `backend="huggingface"` loads a Hugging Face causal language model.
- `assistant_only_loss=True` masks prompt/system/user tokens out of the loss.
- `use_lora=True` trains and saves a PEFT LoRA adapter.
- `use_lora=False` saves a full Hugging Face model to `output_dir`.
- Qwen-style chat templates are supported through the tokenizer when available.

`train_sft` currently implements the Hugging Face backend only. ArcLM-native SFT is available through `InstructionDataset`, `create_instruction_dataloader`, and `Trainer`, but ArcLM-native LoRA is not implemented yet.

## ArcLM-Native Instruction Tuning

For native ArcLM checkpoints, use `InstructionDataset` or `create_instruction_dataloader` with `Trainer`. This path computes loss only on response tokens.

```python
import torch
from arclm import (
    Config,
    InstructionDataset,
    Tokenizer,
    build_model,
    build_trainer,
)

instructions = [
    "Explain supervised fine-tuning in one sentence.",
    "What is assistant-only loss masking?",
]
responses = [
    "Supervised fine-tuning trains a pretrained model on instruction-response examples.",
    "Assistant-only loss masking calculates loss only on assistant response tokens.",
]

tokenizer = Tokenizer(
    max_vocab=1000,
    user_defined_symbols=["<|instruction|>", "<|response|>"],
)
tokenizer.build(" ".join(instructions + responses))

config = Config(
    vocab_size=tokenizer.get_vocab_size(),
    embed_dim=64,
    block_size=64,
    num_blocks=2,
    batch_size=2,
    num_epochs=1,
    device="cpu",
    model_path="models/native_sft_arclm.pth",
)

dataset = InstructionDataset(
    instructions=instructions,
    responses=responses,
    tokenizer=tokenizer,
    block_size=config.block_size,
)

loader = torch.utils.data.DataLoader(dataset, batch_size=config.batch_size, shuffle=True)
model = build_model(config)
trainer = build_trainer(model, config)
trainer.train(loader, config.num_epochs)
trainer.save(config, vocab=tokenizer.vocab, stoi=tokenizer.stoi, itos=tokenizer.itos)
```

Use this path when you want to stay inside the ArcLM model/trainer stack. Use `train_sft` when you want Hugging Face model loading, chat templates, and LoRA adapters.

## Fine-Tuning Qwen3-0.6B With ArcLM

The repository includes a complete Qwen example:

[examples/qwen3_0_6b_sft/README.md](examples/qwen3_0_6b_sft/README.md)

Minimal API call:

```python
from arclm import train_sft

train_sft(
    model="Qwen/Qwen3-0.6B",
    dataset="examples/qwen3_0_6b_sft/data/sample_sft.jsonl",
    output_dir="examples/qwen3_0_6b_sft/output/qwen3_0_6b_sft_lora",
    backend="huggingface",
    assistant_only_loss=True,
    use_lora=True,
)
```

The example demonstrates:

- base model loading and generation
- a tiny SFT JSONL dataset
- ArcLM `train_sft` with assistant-only loss
- optional LoRA adapter saving
- fine-tuned adapter loading
- a small functional benchmark comparing base and fine-tuned outputs

## Dataset Formats

Plain text is used for pre-training, continued training, and next-token fine-tuning:

```text
The model learns to predict the next token.
More text gives the model more examples.
```

SFT supports JSONL records with OpenAI-style `messages`:

```json
{"messages":[{"role":"system","content":"You are helpful."},{"role":"user","content":"What is SFT?"},{"role":"assistant","content":"SFT trains a model on instruction-response examples."}]}
```

SFT also supports instruction-style records:

```json
{"instruction":"Explain LoRA in one sentence.","output":"LoRA fine-tunes small adapter weights while keeping most base model weights frozen."}
```

And ShareGPT-style conversations:

```json
{"conversations":[{"from":"human","value":"What is ArcLM?"},{"from":"gpt","value":"ArcLM is a compact language-model training library."}]}
```

For assistant-only masking, each sample must contain at least one assistant response.

## Assistant-Only Loss

Assistant-only loss means the model sees the full conversation, but cross-entropy loss is calculated only on assistant answer tokens. System prompts and user messages remain in the input context, but their labels are set to `-100` so PyTorch ignores them during loss calculation.

Use it for instruction tuning:

```python
train_sft(
    model="Qwen/Qwen3-0.6B",
    dataset="data/sft.jsonl",
    output_dir="models/qwen_lora",
    backend="huggingface",
    assistant_only_loss=True,
    use_lora=True,
)
```

## Chat Templates

For Hugging Face SFT, ArcLM uses the tokenizer chat template when one is available. If the tokenizer accepts `enable_thinking`, ArcLM passes it through; this is useful for Qwen3-style models.

If no tokenizer chat template is available, ArcLM falls back to a simple role-prefixed format:

```text
system: You are helpful.
user: Explain SFT.
assistant: SFT trains a model on instruction-response examples.
```

## LoRA / PEFT

LoRA is parameter-efficient fine-tuning. Instead of updating every model parameter, PEFT adds small trainable adapter matrices to selected layers and keeps the base model mostly frozen.

Use LoRA when you want lower memory usage:

```python
from arclm import train_sft

result = train_sft(
    model="Qwen/Qwen3-0.6B",
    dataset="data/sft.jsonl",
    output_dir="models/qwen_lora_adapter",
    backend="huggingface",
    use_lora=True,
    assistant_only_loss=True,
)

print(result.adapter_path)
```

Install PEFT before using LoRA:

```bash
pip install "arclm[peft]"
```

For full fine-tuning of a Hugging Face model, set `use_lora=False`. Full fine-tuning uses more GPU memory and saves the full model to `output_dir`.

## Hugging Face Model Loading

ArcLM can inspect and load external model sources:

```python
from arclm import SmartLoader, load_external_model

plan = SmartLoader.inspect("Qwen/Qwen3-0.6B")
print(plan.format_report())

checkpoint = load_external_model("Qwen/Qwen3-0.6B")
```

For Hugging Face SFT, use `train_sft`. For ArcLM checkpoint adaptation and next-token fine-tuning, use `train_model(mode="finetune", checkpoint=...)`.

## ArcLM-Native Checkpoints

ArcLM checkpoints saved by `train_model` include model weights, config values, vocabulary mappings, tokenizer metadata, and training history.

Restore a tokenizer from a checkpoint:

```python
from arclm import tokenizer_from_checkpoint

tokenizer = tokenizer_from_checkpoint("models/arclm.pth")
```

Load for inference:

```python
from arclm import load_model

loaded = load_model("models/arclm.pth")
print(loaded.predict("machine learning", max_new_tokens=20))
```

## Loading And Inference

Use `load_model` for ArcLM checkpoints:

```python
from arclm import load_model

model = load_model("models/arclm.pth", device="cpu")
print(model.predict("ArcLM is", max_new_tokens=40))
```

Use `Generator` when you already have a model, tokenizer mappings, and config:

```python
from arclm import Generator

generator = Generator(model, stoi, itos, block_size=128, device="cpu", tokenizer=tokenizer)
print(generator.generate_string("ArcLM", max_new_tokens=20))
```

## API Overview

| API | Status | Purpose |
| --- | --- | --- |
| `train_model` | Implemented | High-level ArcLM training for `pretrain`, `finetune`, and `continue_training`. |
| `train_sft` | Implemented | Hugging Face causal-LM SFT with optional assistant-only loss and optional PEFT LoRA. |
| `load_model` | Implemented | Load an ArcLM checkpoint for inference. |
| `predict` | Implemented | Cached convenience prediction with an ArcLM checkpoint. |
| `load_external_model` | Implemented | Load ArcLM, raw PyTorch, safetensors, or Hugging Face sources into a normalized checkpoint object when supported. |
| `SmartLoader.inspect` | Implemented | Inspect a model source and report the detected loading plan. |
| `tokenizer_from_checkpoint` | Implemented | Restore a tokenizer saved inside an ArcLM checkpoint. |
| `DataProcessor` | Implemented | Load, clean, filter, transform, tokenize, and split records. |
| `InstructionDataset` | Implemented | ArcLM-native instruction dataset with response-label masking. |
| `Trainer` | Implemented | Lower-level training loop with validation, early stopping, checkpoint callbacks, frozen layers, and masked losses. |
| `build_model` | Implemented | Build an `ArcLM` instance from a config. |
| `build_trainer` | Implemented | Build a `Trainer` with optimizer and loss. |
| `create_tokenizer` | Implemented | Create a tokenizer from a tokenizer type string. |
| `calculate_metrics` | Implemented | Calculate validation loss, perplexity, and token accuracy. |
| `predict_top_k` | Implemented | Inspect the highest-probability next tokens for a prompt. |

## Extension Points And Base Classes

ArcLM exposes base classes for users who want to customize loading, adaptation, or training orchestration.

| Base class | Required methods | Use it for |
| --- | --- | --- |
| `BaseModelLoader` | `load()` | Loading a model source into a model plus metadata. |
| `BaseModelAdapter` | `adapt_weights(verbose=True)` | Mapping weights from one model implementation into another. |
| `BaseTrainingPipeline` | `build(...)`, `train(...)`, `save_checkpoint(...)`, `get_model()` | Creating a custom training pipeline. |

Implemented pipeline helpers:

| Class | Purpose |
| --- | --- |
| `StoppingCriteria` | Stores `max_steps`, early stopping patience, and minimum delta settings. |
| `PreTrainedModelLoader` | Loads a Hugging Face or checkpoint source and adapts it into ArcLM when possible. |
| `ModelAdapter` | Best-effort adaptation of external model weights into the ArcLM architecture. |
| `UnifiedPipeline` | Class-based training orchestration for pre-training, fine-tuning, and instruction-tuning modes. |

Example custom loader:

```python
from arclm import BaseModelLoader

class MyModelLoader(BaseModelLoader):
    def __init__(self, source):
        self.source = source

    def load(self):
        # Replace this with your own model loading logic.
        model = load_my_model(self.source)
        metadata = {"source": self.source}
        return model, metadata
```

Example `UnifiedPipeline` setup:

```python
from arclm import Config, StoppingCriteria, UnifiedPipeline

config = Config(
    vocab_size=1000,
    embed_dim=64,
    block_size=64,
    num_blocks=2,
    device="cpu",
    model_path="models/pipeline_arclm.pth",
)

pipeline = UnifiedPipeline(
    config=config,
    mode="pre_training",
    stopping_criteria=StoppingCriteria(early_stopping_patience=2),
)

pipeline.build(vocab_size=1000)
```

`UnifiedPipeline` is useful when you want class-based orchestration. For the simplest public workflow, use `train_model`.

## Diagnostics And Evaluation

Calculate validation metrics:

```python
from arclm import calculate_metrics

metrics = calculate_metrics(model, val_loader, config, device=config.device)
print(metrics.to_dict())
```

Inspect top-k next-token predictions:

```python
from arclm import format_top_k_predictions, predict_top_k

predictions = predict_top_k(
    model,
    tokenizer.stoi,
    tokenizer.itos,
    block_size=64,
    device="cpu",
    prompt="ArcLM is",
    k=5,
    tokenizer=tokenizer,
)

print(format_top_k_predictions("ArcLM is", predictions))
```

Check tokenizer coverage:

```python
from arclm import format_tokenizer_coverage_report

coverage = tokenizer.analyze_coverage(["ArcLM", "fine-tuning", "example"])
print(format_tokenizer_coverage_report(coverage))
```

Export metrics:

```python
from arclm import export_metrics_to_json, export_metrics_to_markdown

export_metrics_to_json(metrics, "reports/metrics.json")
export_metrics_to_markdown(metrics, "reports/metrics.md")
```

## Regularization Helpers

ArcLM includes lightweight utilities that can be used in custom loops.

```python
from arclm import (
    EarlyStopping,
    GeneralizationMonitor,
    L1Regularization,
    L2Regularization,
    LearningRateScheduler,
)

l1 = L1Regularization(lambda_l1=1e-5)
l2 = L2Regularization(lambda_l2=1e-4)

regularization_loss = l1.compute_loss(model) + l2.compute_loss(model)

stopper = EarlyStopping(patience=3, min_delta=1e-4)
should_stop = stopper.check(val_loss=1.25)

monitor = GeneralizationMonitor()
monitor.update(train_loss=1.0, val_loss=1.2)
print(monitor.get_report())
```

Trainer-level freezing helpers:

```python
trainer.freeze_layers("blocks")
trainer.unfreeze_layers()
print(trainer.get_frozen_layers_info())
```

## Saved Files

`train_model(...)` saves an ArcLM checkpoint to the `output` path you provide, for example:

```text
models/arclm.pth
```

The checkpoint includes the model state, config, vocabulary, tokenizer metadata, optimizer state when available, and training history.

`train_sft(..., use_lora=True)` saves a Hugging Face PEFT adapter to `output_dir`, plus:

```text
adapter_config.json
adapter_model.safetensors
arclm_sft_metadata.json
tokenizer files
```

`train_sft(..., use_lora=False)` saves a full Hugging Face model to `output_dir`, plus `arclm_sft_metadata.json` and tokenizer files.

## Examples

Runnable examples are available in [examples/](examples/).

Useful starting points:

- [examples/train_pretrain.py](examples/train_pretrain.py): train a small ArcLM model from scratch.
- [examples/train_finetune.py](examples/train_finetune.py): next-token fine-tuning from a checkpoint.
- [examples/train_sft_local.py](examples/train_sft_local.py): ArcLM-native assistant-masked SFT workflow.
- [examples/train_sft_hf.py](examples/train_sft_hf.py): adapt a Hugging Face source into ArcLM and run local SFT.
- [examples/qwen3_0_6b_sft/README.md](examples/qwen3_0_6b_sft/README.md): full Qwen/Qwen3-0.6B SFT and benchmark workflow.
- [examples/preprocess_dataset.py](examples/preprocess_dataset.py): run dataset preprocessing.
- [examples/library_workflow.py](examples/library_workflow.py): small end-to-end library workflow.

## Troubleshooting

### Missing `transformers`

`train_sft(backend="huggingface")` requires Transformers. Install ArcLM normally, or install Transformers explicitly if your environment is missing it:

```bash
pip install transformers
```

### Missing PEFT

LoRA requires PEFT:

```bash
pip install "arclm[peft]"
```

Or disable LoRA:

```python
train_sft(..., use_lora=False)
```

### CUDA out of memory

Try smaller settings:

- reduce `batch_size`
- increase `gradient_accumulation_steps`
- reduce `max_length`
- use `use_lora=True`
- use a smaller model
- run on CPU only for tiny smoke tests

### Hugging Face download warnings

The first Hugging Face run may download model and tokenizer files. Make sure you have network access and enough disk space in the Hugging Face cache.

### Qwen chat template issues

Use a recent Transformers version. ArcLM 0.4.2 declares `transformers>=4.51,<6`. If `enable_thinking=False` is not accepted by a tokenizer, ArcLM retries without that argument.

### Assistant-only loss has no active labels

Check that the dataset has assistant messages or response fields, and that `max_length` is large enough to include the assistant answer.

### Checkpoint tokenizer mismatch

Continued training requires tokenizer compatibility. Use checkpoints saved by ArcLM, or pass a tokenizer that matches the checkpoint vocabulary.

## Current Limitations

- `train_sft` currently supports `backend="huggingface"` only.
- ArcLM-native LoRA for the built-in `ArcLM` model is not implemented yet.
- Preference training such as DPO, RLHF, PPO, and reward-model training is not implemented yet.
- Native `ArcLM.forward(...)` accepts token IDs only; Hugging Face-style `attention_mask` is used by `train_sft`, not by the native ArcLM model.
- The built-in model is compact and local-first; it is not intended for distributed large-scale training.
- Some preprocessing filters are heuristic, including toxicity and simple perplexity checks.

## Roadmap

Planned work:

- Broader `train_sft` backend coverage.
- Native ArcLM LoRA modules.
- Cleaner command-line training flows.
- More Hugging Face architecture adaptation coverage.
- More evaluation helpers for instruction-tuned models.
- Preference training APIs after the SFT path is stable.

## License

ArcLM is licensed under the Apache License 2.0. See [LICENSE](LICENSE).
