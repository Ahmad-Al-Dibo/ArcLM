# ArcLM

ArcLM is a compact native-first Python library for educational and research
language-model workflows. Its core path is intentionally small: load local data,
tokenize text, train a tiny PyTorch causal language model, save or reload a
checkpoint, evaluate, generate, and inspect the pipeline.

ArcLM is aimed at students, early researchers, and developers who want to learn
how an LLM library fits together without depending on a production serving stack.

## Install

```bash
pip install arclm
```

For local development in this repository:

```bash
pip install -e ".[dev]"
```

Optional integrations are installed only when requested:

```bash
pip install "arclm[web]"
pip install "arclm[hf]"
pip install "arclm[peft]"
pip install "arclm[preprocess]"
```

## Quick Start

```python
from arclm.datasets import load_dataset
from arclm.models import ArcLM
from arclm.tokenizers import Tokenizer

records = load_dataset([{"text": "ArcLM trains small native models."}])
tokenizer = Tokenizer(max_vocab=32)
tokenizer.build(records[0]["text"])

model = ArcLM(
    vocab_size=tokenizer.get_vocab_size(),
    embed_dim=16,
    block_size=8,
    num_blocks=1,
)
```

The supported core workflow is:

```text
dataset -> validation/cleaning -> tokenizer -> native ArcLM model -> training
-> checkpoint -> evaluation -> generation -> pipeline inspection
```

## CLI

```bash
python -m arclm --help
python -m arclm train --help
python -m arclm eval --help
python -m arclm generate --help
```

The installed console entry point is also `arclm`.

## Current Limits

ArcLM 0.9.0 does not claim universal Hugging Face support, production serving,
OpenAI-compatible APIs, attention-map capture, streaming generation, guaranteed
multi-GPU training, real QLoRA runtime validation, native BERT/T5/diffusion,
vision, audio, multimodal models, RLHF, DPO, or GRPO.

The compact source of truth for supported, beta, experimental, deprecated, and
unsupported areas is [`docs/special-version.md`](docs/special-version.md).
