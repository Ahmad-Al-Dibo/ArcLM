# ArcLM Usage Guide

This guide shows the current, working ArcLM workflows. It intentionally avoids
planned features unless they are clearly marked as not implemented.

## Install

From the repository root:

```bash
pip install -e .
```

For tests and packaging:

```bash
pip install -e .[dev]
```

For preprocessing extras:

```bash
pip install -e .[preprocess]
```

For Hugging Face SFT with LoRA:

```bash
pip install -e .[peft]
```

## Public Training APIs

Use these entry points:

- `train_model(mode="pretrain", ...)` for native ArcLM pretraining.
- `train_model(mode="finetune", ...)` for next-token fine-tuning on formatted text.
- `train_model(mode="continue_training", ...)` for compatible continued pretraining.
- `train_sft(backend="huggingface", ...)` for Hugging Face supervised fine-tuning, assistant-only labels, and optional LoRA.
- `InstructionDataset` and `Trainer.train(...)` for lower-level native ArcLM masked instruction tuning.

## Train From Scratch

```python
from arclm import train_model

result = train_model(
    mode="pretrain",
    data="data/data.txt",
    output="models/arclm_pretrained.pth",
    tokenizer_type="word",
    max_vocab=2000,
    embed_dim=64,
    num_blocks=2,
    block_size=32,
    batch_size=8,
    num_epochs=3,
    learning_rate=3e-4,
    validation_split=0.1,
    checkpoint_batch_interval=100,
    device="cpu",
)

print(result.model_path)
```

`train_model()` handles data loading, tokenizer creation, model creation,
training, metrics logging, and final checkpoint saving.

## Native ArcLM Fine-tuning

Use `mode="finetune"` for next-token fine-tuning on a formatted text file.
This is not assistant-only SFT; it trains on every next-token label in the text.

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

For ArcLM checkpoints, tokenizer compatibility is checked so token IDs are not
silently corrupted.

## Continue Training

Use `continue_training` when you want to resume or extend pretraining with a
compatible ArcLM checkpoint and tokenizer.

```python
from arclm import train_model

result = train_model(
    mode="continue_training",
    checkpoint="models/arclm_pretrained.pth",
    data="data/more_text.txt",
    output="models/arclm_continued.pth",
    num_epochs=5,
)
```

This path is stricter than ordinary fine-tuning. If tokenizer metadata is
missing or incompatible, provide the correct tokenizer explicitly or use a
checkpoint saved by ArcLM.

## Hugging Face SFT With LoRA

Use `train_sft()` for Hugging Face causal language models. This is the public
ArcLM SFT API.

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

When `use_lora=True`, PEFT is required and ArcLM saves a LoRA adapter to
`output_dir`. When `use_lora=False`, ArcLM saves a full Hugging Face model.

The complete Qwen example is documented in:

```text
examples/qwen3_0_6b_sft/README.md
```

## ArcLM-native Assistant-only SFT

For native ArcLM checkpoints, use `InstructionDataset` with `Trainer`. The
dataset returns dictionaries containing `x`, `y`, and `mask`. `Trainer.train()`
uses the mask to average loss only over active label positions.

```python
from torch.utils.data import DataLoader
from arclm import (
    Config,
    InstructionDataset,
    adapt_for_training,
    build_trainer,
    load_external_model,
    tokenizer_from_checkpoint,
)

loaded = load_external_model("models/arclm_pretrained.pth", map_location="cpu")
tokenizer = tokenizer_from_checkpoint(loaded)

config = Config(
    model_path="models/arclm_sft.pth",
    vocab_size=tokenizer.get_vocab_size(),
    embed_dim=loaded.config.get("embed_dim", 64),
    num_blocks=loaded.config.get("num_blocks", 2),
    block_size=loaded.config.get("block_size", 128),
    batch_size=2,
    num_epochs=1,
    learning_rate=5e-5,
    device="cpu",
)

bundle = adapt_for_training(
    loaded,
    target_config=config,
    tokenizer=tokenizer,
    require_tokenizer_match=True,
)

dataset = InstructionDataset(
    instructions=["Explain ArcLM"],
    responses=["ArcLM is a compact PyTorch language-model framework."],
    tokenizer=tokenizer,
    block_size=bundle.config.block_size,
)

trainer = build_trainer(bundle.model, bundle.config)
trainer.train(DataLoader(dataset, batch_size=2), bundle.config.num_epochs)
trainer.save(
    bundle.config,
    vocab=tokenizer.vocab,
    stoi=tokenizer.stoi,
    itos=tokenizer.itos,
    tokenizer_metadata=tokenizer.to_checkpoint(),
)
```

## Dataset Formats

`DataProcessor.load()` supports `.txt`, `.json`, `.jsonl`, `.csv`, and custom
loader callables.

Plain text is used for next-token training:

```text
ArcLM trains compact causal language models.
Each line becomes part of the training corpus.
```

Structured SFT records can use OpenAI-style messages:

```json
{"messages":[{"role":"user","content":"What is SFT?"},{"role":"assistant","content":"SFT trains a model on instruction-response examples."}]}
```

or instruction/output fields:

```json
{"instruction":"Explain SFT.","output":"SFT teaches a pretrained model to follow instructions."}
```

The example helper `examples/sft_utils.py` also handles ShareGPT-style
`conversations` with `human` and `gpt` roles.

## DataProcessor

Use `DataProcessor` when you need to load records, clean strings, map fields,
and format text.

```python
from arclm import DataProcessor

processed = (
    DataProcessor.load("data/qa.jsonl")
    .clean()
    .filter(lambda row: bool(row.get("question")))
    .transform(
        format="instruction",
        mapping={"instruction": "question", "input": "context", "output": "answer"},
        template="<|instruction|>\n{instruction}\n{input}\n<|response|>\n{output}",
    )
)
```

Write the formatted text for `train_model(mode="finetune")`:

```python
from pathlib import Path

Path("data/finetune.txt").write_text(
    "\n".join(sample["text"] for sample in processed.samples),
    encoding="utf-8",
)
```

## Preprocessing Pipeline

`arclm.preprocess` is JSONL-first and can normalize text, redact PII, filter
low-quality rows, detect duplicates, and write JSON/HTML reports.

```python
from arclm.preprocess import PreprocessConfig, PreprocessPipeline

config = PreprocessConfig(
    text_field="text",
    output_field="text",
    min_chars=20,
    min_words=4,
    drop_emails=True,
    redact_pii=True,
    near_dedup=False,
)

report = PreprocessPipeline(config).run(
    "data/raw.jsonl",
    "data/cleaned.jsonl",
    "reports/preprocess",
)
```

## Load And Generate

Load native ArcLM checkpoints with `load_model()`:

```python
from arclm import load_model

loaded = load_model("models/arclm_finetuned.pth", device="cpu")
print(loaded.predict("ArcLM is", max_new_tokens=40, top_p=0.9))
```

`load_model()` returns:

- `loaded.model`
- `loaded.generator`
- `loaded.config`
- `loaded.device`
- `loaded.predict(...)`

## External Source Loading

Use `load_external_model()` and `adapt_for_training()` when you want to inspect
or adapt a supported checkpoint source into native ArcLM.

```python
from arclm import adapt_for_training, load_external_model

loaded = load_external_model("external/model.pth")
bundle = adapt_for_training(loaded)
```

Supported external sources:

- ArcLM checkpoints
- raw PyTorch state dicts: `.pth`, `.pt`, `.bin`, `.ckpt`
- `.safetensors` when `safetensors` is installed
- Hugging Face folders or model IDs when `transformers` is installed

For Hugging Face SFT, prefer `train_sft()` over adaptation into native ArcLM.

## Example Commands

Cross-platform:

```bash
python examples/train_pretrain.py --data data/data.txt
python examples/train_finetune.py --checkpoint models/arclm_pretrained.pth --data data/finetune.txt
python examples/train_sft_local.py --checkpoint models/arclm_pretrained.pth --data data/sft.jsonl
python examples/train_sft_hf.py --model sshleifer/tiny-gpt2 --data data/sft.jsonl
python examples/qwen3_0_6b_sft/test_base_model.py
python examples/qwen3_0_6b_sft/train_qwen3_0_6b_sft.py
python examples/qwen3_0_6b_sft/test_finetuned_model.py
python examples/qwen3_0_6b_sft/benchmark_base_vs_finetuned.py
```

Windows PowerShell with the local venv:

```powershell
.\.venv\Scripts\python.exe examples\qwen3_0_6b_sft\test_base_model.py
.\.venv\Scripts\python.exe examples\qwen3_0_6b_sft\train_qwen3_0_6b_sft.py
.\.venv\Scripts\python.exe examples\qwen3_0_6b_sft\test_finetuned_model.py
.\.venv\Scripts\python.exe examples\qwen3_0_6b_sft\benchmark_base_vs_finetuned.py
```

## Current Limitations

- Native `ArcLM.forward()` accepts token IDs only; Hugging Face `train_sft()` uses `attention_mask`.
- Native LoRA layers for ArcLM are not implemented.
- Preference training such as DPO, RLHF, PPO, and reward modeling is not implemented.
- The package CLI `train` and `eval` commands are stale; use Python APIs and examples.

## Troubleshooting

`Tokenizer vocabulary size is incompatible with checkpoint`

Reuse the checkpoint tokenizer, or train a new model/head with a matching vocabulary.

`Masked SFT loss is always zero`

Make sure every response is non-empty and `block_size` or `max_length` is large
enough to include assistant tokens.

`Missing PEFT`

Install `pip install -e .[peft]` or set `use_lora=False`.

`CUDA out of memory`

Use LoRA, reduce `batch_size`, reduce `max_length`, use gradient accumulation,
or choose a smaller model.

`Qwen chat template issues`

Upgrade to `transformers>=4.51`. The Qwen example tries
`enable_thinking=False` and falls back if the tokenizer does not accept it.
