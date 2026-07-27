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
```

The installed console entry point is also `arclm`.

## ArcLM Agent Runtime

ArcLM includes a foundational provider-independent agent subsystem:

```python
from arclm.agents import Agent, AgentRunner, ModelResponse, ToolCall, tool


@tool
def calculate_total(price: float, quantity: int) -> float:
    """Calculate a total price."""
    return price * quantity


class FakeModel:
    def __init__(self):
        self.calls = 0

    def generate_response(self, *, messages, tools, instructions, session):
        self.calls += 1
        if self.calls == 1:
            return ModelResponse(
                tool_calls=[
                    ToolCall(
                        id="call_1",
                        name="calculate_total",
                        arguments={"price": 12.5, "quantity": 3},
                    )
                ]
            )
        return ModelResponse(content="The total is 37.5.")


agent = Agent(
    name="shopping_assistant",
    instructions="Help calculate product totals.",
    model=FakeModel(),
    tools=[calculate_total],
)

result = AgentRunner(max_steps=5).run(agent, "What is 3 * 12.50?")
print(result.output)
```

Tools are typed Python callables with generated schemas, validated arguments,
permissions, structured results, and trace events. Model adapters return
provider-independent `ModelResponse` objects, so the core runtime does not
depend on OpenAI, Anthropic, Hugging Face, LangChain, or another agent
framework.

Built-in groups cover bounded calculators, current date/time, text statistics,
JSON helpers, Markdown/HTML conversion, safe workspace text-file reads, safe
mockable webpage reading, and a speech-to-text abstraction. Whisper is optional
and lazy. The runtime does not include shell tools, arbitrary Python execution,
browser automation, unrestricted filesystem access, long-term vector memory, or
multi-agent orchestration.

See [`docs/agent-runtime.md`](docs/agent-runtime.md) and
[`examples/agents/`](examples/agents/) for details.

## Examples

The maintained examples suite lives in [`examples/`](examples/). It is organized
as numbered categories from quick start through complete projects, with a
machine-readable manifest and runner:

```bash
python examples/run_examples.py list
python examples/run_examples.py run 00-01
python examples/run_examples.py run-verified
```

The verified runner set is CPU-first and local by default: no network access,
automatic downloads, GPU, remote service, or real external model is required.
Optional PEFT/QLoRA, real Hugging Face local-model loading, and real Whisper
speech-to-text boundaries are documented as manual optional entries in
[`examples/manifest.json`](examples/manifest.json). Historical unnumbered
examples are preserved, but the numbered suite is the current source of truth.

## Documentation Website

The static documentation website lives in [`documentation-site/`](documentation-site/).
Open [`documentation-site/index.html`](documentation-site/index.html) directly
for the offline site, including guides, API reference, examples, module index,
configuration, errors, limitations, Lab, and release notes.

The site is generated from repository data plus curated guide text:

```bash
python tools/build_documentation_site.py
python -m pytest tests/docs -q
```

The generated API catalog is built from current public exports and signatures,
so it should be regenerated whenever public APIs or examples change.

## Security

ArcLM includes `arclm.security`, the ArcLM Security Core. It provides
security-policy objects, safe status reports, secret redaction, hashing,
signed manifests, AEAD encryption envelopes, key providers, and encrypted
artifact storage. Artifact-store writes use per-artifact data keys wrapped by
the active key provider. Install the crypto dependency explicitly with:

```bash
pip install "arclm[security]"
```

Encryption uses reviewed primitives from `cryptography` and fails closed when
the dependency or key is missing. It never silently stores plaintext as a
fallback. Signed manifests use Ed25519, hashes use SHA-256/SHA-512 allowlists,
password-derived keys use Argon2id, and high-entropy subkeys use HKDF.

Web Studio remains local-only by default. Non-loopback Web API binding fails
closed until a remote-secure deployment supplies TLS, explicit origins, and an
authentication/authorization layer. Agent Runtime
tools use permissions and approvals, and Security Core adds defensive redaction
and hashing tools.

```bash
python -m arclm security status --json
```

See [`SECURITY.md`](SECURITY.md) and
[`examples/security/`](examples/security/) for secure usage notes and examples.

## Current Limits

ArcLM 0.10.0 does not claim universal Hugging Face support, production serving,
OpenAI-compatible APIs, attention-map capture, streaming generation, guaranteed
multi-GPU training, real QLoRA runtime validation, native BERT/T5/diffusion,
vision, audio, multimodal models, RLHF, DPO, or GRPO.

The compact source of truth for supported, beta, experimental, deprecated, and
unsupported areas is [`docs/special-version.md`](docs/special-version.md).
