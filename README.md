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

PyTorch is the largest required dependency because ArcLM's models and training
runtime use it. For CPU-only installations, install the CPU wheel first to
avoid downloading a CUDA-enabled build:

```bash
python -m pip install torch --index-url https://download.pytorch.org/whl/cpu
python -m pip install arclm
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

The local Studio backend is optional:

```bash
python -m arclm web-api
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
python -m arclm chat --help
```

The installed console entry point is also `arclm`.

Start an interactive console conversation with a local model or Hugging Face
model ID:

```bash
arclm chat --model path/to/model --device auto
```

For Hugging Face model inference, install the optional integration with
`pip install "arclm[hf-inference]"`. The Python equivalent is shown in
[`examples/08_inference_local_models/03_console_chat.py`](examples/08_inference_local_models/03_console_chat.py).

## ArcLM Agent Runtime

ArcLM provides a bounded, provider-independent agent runtime with typed tools,
permissions, and inspectable traces. See the [Agent Runtime guide](docs/agent-runtime.md)
and [`examples/agents/`](examples/agents/) for its API and examples.

## Examples

The maintained examples live in [`examples/`](examples/) and are organized by
workflow. The manifest defines their requirements and verification status:

```bash
python examples/run_examples.py list
python examples/run_examples.py run 00-01
python examples/run_examples.py run-verified
```

Verified examples run locally without model downloads or a GPU. Examples that
need optional integrations or real model assets are marked `manual_optional` in
[`examples/manifest.json`](examples/manifest.json).

## Documentation

- [Project status and supported feature areas](docs/project-status.md)
- [Agent Runtime guide](docs/agent-runtime.md)
- [Examples guide](examples/README.md)
- [ArcLM Lab](lab/README.md)
- [Historical repository audit (July 2026)](docs/repository-audit.md)

## Security

ArcLM includes `arclm.security` for policy enforcement, cryptographic helpers,
redaction, and encrypted artifact storage. Install the optional dependency:

```bash
pip install "arclm[security]"
```

Security operations fail closed when required dependencies or keys are
unavailable. See the [Security Core status and limits](docs/project-status.md#arclm-security-core)
and [`examples/security/`](examples/security/).

```bash
python -m arclm security status --json
```

## Support Boundaries

See [Project status](docs/project-status.md) for the supported, beta,
experimental, deprecated, and unsupported feature areas.
