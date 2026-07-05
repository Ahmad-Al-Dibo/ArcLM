# ArcLM Full Feature Guide

This guide explains the current ArcLM framework surface. It is longer than
`USAGE.md` and is meant to help contributors and users understand how the pieces
fit together.

## What ArcLM Is

ArcLM is a compact PyTorch language-model framework for:

- training small native ArcLM causal language models;
- fine-tuning or continuing compatible ArcLM checkpoints;
- supervised fine-tuning Hugging Face causal LMs through `train_sft()`;
- optional PEFT LoRA adapters for Hugging Face SFT;
- assistant-only loss masking for instruction tuning;
- dataset loading, formatting, preprocessing, diagnostics, and tracking;
- external checkpoint inspection and adaptation.

ArcLM is not a distributed training framework. It does not implement DPO, RLHF,
PPO, reward modeling, native ArcLM LoRA layers, or multi-node training.

## Install

```bash
pip install -e .
pip install -e .[dev]
pip install -e .[preprocess]
pip install -e .[peft]
```

Runtime dependencies are `torch`, `numpy`, `sentencepiece`, and
`transformers>=4.51`. The `peft` extra is only needed for
`train_sft(..., use_lora=True)`.

## Architecture Overview

Main packages:

- `arclm.config`: `Config`, `create_config`, and tuning presets.
- `arclm.tokenizer` / `arclm.tokenizers`: word and SentencePiece tokenizers.
- `arclm.data`: token loading, splitting, and `prepare_data`.
- `arclm.dataset`: sliding-window `TextDataset` and DataLoader helper.
- `arclm.model`: native `ArcLM` / `MiniGPT` model.
- `arclm.trainer`: native training loop with tuple and masked dict batches.
- `arclm.pipeline`: `train_model`, checkpoint helpers, model/trainer builders.
- `arclm.sft`: Hugging Face SFT backend and `train_sft`.
- `arclm.loaders`: external source loaders and SmartLoader.
- `arclm.inference` / `arclm.generator`: checkpoint loading and generation.
- `arclm.preprocess`: JSONL cleaning, redaction, deduplication, reports.
- `arclm.diagnostics`: metrics, top-k predictions, coverage, benchmarks.
- `arclm.tracking`: local experiment logging.
- `arclm.training`: extension base classes and `UnifiedPipeline`.

## Training Modes

| Mode | API | Data | Checkpoint |
| --- | --- | --- | --- |
| Pretraining | `train_model(mode="pretrain")` | plain text | native ArcLM |
| Next-token fine-tuning | `train_model(mode="finetune")` | formatted text | native ArcLM/adapted source |
| Continued training | `train_model(mode="continue_training")` | plain text | compatible native ArcLM |
| Hugging Face SFT | `train_sft(backend="huggingface")` | structured SFT JSON/JSONL/CSV | HF model or LoRA adapter |
| Native ArcLM instruction tuning | `InstructionDataset` + `Trainer` | instruction/response lists | native ArcLM |

Preference training is not implemented.

## Native Pretraining

```python
from arclm import train_model

result = train_model(
    mode="pretrain",
    data="data/data.txt",
    output="models/arclm_pretrained.pth",
    tokenizer_type="sentencepiece",
    max_vocab=8000,
    embed_dim=128,
    num_blocks=4,
    block_size=128,
    batch_size=16,
    num_epochs=5,
    learning_rate=3e-4,
    validation_split=0.1,
)
```

The result contains `mode`, `model_path`, `config`, `history`, `vocab_size`,
`tokenizer`, and optional `checkpoint_source`.

## Native Fine-tuning

```python
from arclm import train_model

result = train_model(
    mode="finetune",
    checkpoint="models/arclm_pretrained.pth",
    data="data/finetune.txt",
    output="models/arclm_finetuned.pth",
    num_epochs=2,
    learning_rate=2e-5,
    freeze_backbone=True,
    use_discriminative_lr=True,
)
```

This uses next-token loss over all labels. It is useful when your file already
contains the exact prompt/answer text you want the native model to learn.

## Continued Training

```python
continued = train_model(
    mode="continue_training",
    checkpoint="models/arclm_pretrained.pth",
    data="data/more_pretraining.txt",
    output="models/arclm_continued.pth",
    num_epochs=5,
)
```

Continued training requires a compatible tokenizer and model shape.

## Hugging Face SFT And LoRA

`train_sft()` is the public ArcLM SFT API for Hugging Face causal LMs.

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

Important behavior:

- `backend="huggingface"` is the only implemented `train_sft` backend.
- `assistant_only_loss=True` ignores system/user labels and trains only on assistant answer tokens.
- `use_lora=True` requires PEFT and saves a LoRA adapter.
- `use_lora=False` saves a full Hugging Face model.
- Qwen3 chat templates are supported; the example tries `enable_thinking=False`.

Complete workflow:

```text
examples/qwen3_0_6b_sft/README.md
```

## Native Assistant-only SFT

For native ArcLM checkpoints:

```python
from torch.utils.data import DataLoader
from arclm import InstructionDataset, build_trainer

dataset = InstructionDataset(
    instructions=["What is ArcLM?"],
    responses=["ArcLM is a compact PyTorch language-model framework."],
    tokenizer=tokenizer,
    block_size=128,
)

trainer = build_trainer(model, config)
trainer.train(DataLoader(dataset, batch_size=1), epochs=1)
```

`InstructionDataset` returns:

- `x`: input IDs
- `y`: next-token labels
- `mask`: label positions that contribute to loss

The mask is shifted to label positions so assistant response labels are active.

## Masks

ArcLM has three mask concepts:

- Causal mask: internal to native `SelfAttention`, prevents future-token attention.
- Loss mask: `InstructionDataset`/`Trainer` and `train_sft` label construction.
- Attention mask: used by Hugging Face `train_sft`; not an input to native `ArcLM.forward()` yet.

## Data Formats

Plain text for next-token training:

```text
ArcLM trains causal language models.
```

OpenAI-style SFT:

```json
{"messages":[{"role":"system","content":"Be helpful."},{"role":"user","content":"What is SFT?"},{"role":"assistant","content":"SFT trains on instruction-response examples."}]}
```

Instruction/output SFT:

```json
{"instruction":"Summarize ArcLM.","output":"ArcLM is a compact local language-model framework."}
```

ShareGPT-style:

```json
{"conversations":[{"from":"human","value":"What is ArcLM?"},{"from":"gpt","value":"A compact LM framework."}]}
```

## Tokenizers

Native ArcLM supports:

- `Tokenizer`: simple word-level tokenizer.
- `SentencePieceTokenizer`: subword tokenizer with BPE or unigram model types.
- `TokenizerFactory`: register and create tokenizers by name.

Use `encode_text()` for raw strings and `encode()` only for pre-tokenized token
lists. Save tokenizer metadata with native checkpoints.

## Checkpoints

Native `Trainer.save()` writes:

- `model_state_dict`
- `optimizer_state_dict`
- config
- vocab/stoi/itos
- tokenizer metadata
- block size and vocab size
- current epoch, batch, global step
- train history and best validation state

Restore a tokenizer:

```python
from arclm import tokenizer_from_checkpoint

tokenizer = tokenizer_from_checkpoint("models/arclm_pretrained.pth")
```

## Inference

```python
from arclm import load_model

loaded = load_model("models/arclm_finetuned.pth")
print(loaded.predict("ArcLM is", max_new_tokens=50, top_p=0.9))
```

`LoadedModel` provides `model`, `generator`, `config`, `device`, and
`predict(...)`.

## External Loading

`load_external_model()` normalizes sources into `LoadedCheckpoint`.

Supported:

- native ArcLM checkpoints;
- raw PyTorch state dicts;
- `.safetensors` with optional package installed;
- Hugging Face folders/model IDs with `transformers`.

Use `SmartLoader.inspect()` before loading large or unknown sources.

```python
from arclm import SmartLoader

plan = SmartLoader.inspect("models/arclm_pretrained.pth")
print(plan.to_dict())
```

## Preprocessing

`arclm.preprocess` can:

- strip HTML;
- normalize text;
- redact emails, phones, IPs;
- filter low-quality rows;
- exact and near deduplicate;
- write JSON and HTML reports.

```python
from arclm.preprocess import PreprocessConfig, PreprocessPipeline

report = PreprocessPipeline(PreprocessConfig()).run(
    "data/raw.jsonl",
    "data/cleaned.jsonl",
    "reports/preprocess",
)
```

## Diagnostics

Useful helpers:

- `predict_top_k`
- `format_top_k_predictions`
- `calculate_metrics`
- `calculate_perplexity`
- `export_metrics_to_json`
- `format_tokenizer_coverage_report`
- `run_long_context_evaluation`

```python
from arclm import predict_top_k, format_top_k_predictions

predictions = predict_top_k(
    loaded.model,
    loaded.generator.stoi,
    loaded.generator.itos,
    loaded.config.block_size,
    loaded.device,
    "machine learning",
    k=5,
    tokenizer=loaded.generator.tokenizer,
)
print(format_top_k_predictions("machine learning", predictions))
```

## Tracking

Local experiment tracking:

```python
from arclm.tracking import create_experiment

tracker = create_experiment("baseline", experiment_dir="experiments")
tracker.log_config(config)
tracker.log_metrics({"loss": 2.5}, step=1)
tracker.end()
```

Optional MLflow and Weights & Biases backends are used only if installed.

## Flask API

`app.py` exposes:

- `GET /health`
- `POST /predict`
- `POST /generate`

Run:

```bash
set MODEL_PATH=models/arclm_finetuned.pth
python app.py
```

## Example Scripts

- `examples/train_pretrain.py`: native pretraining.
- `examples/train_finetune.py`: next-token native checkpoint fine-tuning.
- `examples/train_sft_local.py`: native ArcLM assistant-masked SFT.
- `examples/train_sft_hf.py`: older Hugging Face-to-ArcLM adaptation SFT.
- `examples/qwen3_0_6b_sft/`: complete Qwen3 base/SFT/load/benchmark workflow.
- `examples/full_feature_guide.py`: broad local demo.
- `examples/preprocess_dataset.py`: preprocessing report demo.
- `examples/library_workflow.py`: small native workflow.

## Troubleshooting

`Special tokens become <UNK>`

Use the same `user_defined_symbols` when training and fine-tuning. Use
`encode_text()` for raw strings.

`Tokenizer is incompatible`

Reuse the checkpoint tokenizer or train a new compatible model head.

`Missing PEFT`

Install `pip install -e .[peft]`, or call `train_sft(..., use_lora=False)`.

`Qwen training is slow on CPU`

Qwen3-0.6B can load on CPU but training is slow. Use a CUDA GPU for the full
example, or test the API with a smaller Hugging Face model.

`CLI train fails`

The package CLI train/eval code is stale. Use `train_model()`, `train_sft()`,
or the maintained example scripts.
