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

The local GPT-style Simple Interface is also available through the legacy
launch command:

```bash
python -m arclm --run simple-interface
```

It starts a Flask app on `127.0.0.1:5000` by default. The interface keeps the
existing model workflow: inspect a model source, select device and dtype, load
registered or local model paths, save compatible loaded models, and generate
with the same ArcLM inference backend. It now adds local conversation history,
new/open/rename/delete/duplicate chat controls, backend-side context building,
context inspection, per-chat system instructions, persistent request
instructions, model profiles, generation defaults, and editable chat templates.
Model operation state is backend-authoritative and survives page refreshes. The
ModelPill reflects `no_model`, `queued`, `loading`, `ready`, `generating`,
`unloading`, `error`, and `cancelled`, disables incompatible controls while a
model is busy, and exposes an Open Terminal action for live progress. When a
model is loaded the pill also reports backend-inspected runtime details such as
the actual primary device, resolved devices, dtype, quantization and PyTorch
memory when those values are available from model parameters or buffers.

During a chat request the visible thinking row shows observable application
stages only, such as preparing context, running an approved tool, generating,
saving and completion. It is not hidden chain-of-thought and does not ask the
model to reveal private reasoning. Response run records store real timestamps
for request receipt, preparation, tool execution, generation, frontend reveal
and saving when those stages occur, plus non-negative durations derived from
those timestamps. Token metrics use the active tokenizer when possible and are
labelled `estimated` when the fallback regex counter is used. Tokens per second
is calculated only as output tokens divided by backend generation duration.

The composer has explicit `Chat` and `Agent` modes. Chat mode sends the
backend-prepared context directly to the model. Agent mode uses the existing
`arclm.agents` runtime with strict JSON tool-call parsing, allowlisted tools,
permission metadata, bounded steps, bounded result sizes and trace events. The
initial Simple Interface catalog exposes only safe pure/read-only helpers such
as arithmetic operations, current date/time, JSON formatting, Markdown/HTML to
text, and ArcLM inspection tools for the active model, tokenizer and context.
It does not expose shell execution, arbitrary Python, `eval`, unrestricted file
access or command execution.

The bottom terminal drawer is a read-only operation viewer. It uses structured
Server-Sent Events with bounded polling fallback for model validation,
configuration loading, tokenizer loading, model weight loading, device and
precision selection, movement to device, validation, inspection, unloading,
generation startup, cancellation and recoverable errors. Events are redacted
before they reach the browser and do not execute shell commands or arbitrary
Python. Exact progress is shown only when the backend has exact counts; otherwise
the UI shows indeterminate progress text such as "Loading model weights...".

The Simple Interface now supports true backend streaming for model adapters that
emit decoded deltas while inference is still running. Native ArcLM models expose
`native_token_streaming`; custom loaded models can expose `stream_generate`,
`generate_stream` or `stream` for text chunks. Other adapters are reported as
`non_streaming` and keep the complete-response path, optionally with the
frontend token reveal animation as a visual fallback. ArcLM does not simulate
streaming by splitting a completed answer.

Prompts are accepted into a persistent sequential queue so the composer remains
usable during active generation. The initial scheduler is FIFO across the
single loaded model runtime, claims queued rows atomically from SQLite, and
builds conversation context only when each request starts. That means a queued
follow-up normally sees earlier completed assistant responses. Failed attempts
and cancelled partials are marked as non-context messages by default.

Conversations are saved locally as versioned JSON under
`workspace/simple-interface/chat-store.json` unless `ARCLM_SIMPLE_INTERFACE_STORE`
points elsewhere. A unified SQLite sidecar at `chat-store.sqlite3` records
queryable conversations, messages, generation runs, chat templates, tool calls,
tool results, generation queue requests, training-candidate decisions and
settings. Browser storage is used only for harmless appearance preferences such
as the theme. The store does not contain model weights, large tensors,
passwords, or encryption keys, and it is not described as encrypted unless you
add a separate encrypted storage layer.

Chat templates use a validated JSON schema with normalized ArcLM roles mapped
to model-specific roles. Built-in templates include basic role/content messages,
plain completion, ChatML-style text, instruction/response, prompt/completion,
and tokenizer-native mode where the loaded tokenizer supports it. Formatted
templates use restricted placeholders such as `{{system}}`, `{{history}}`,
`{{tool_calls}}`, `{{tool_results}}`, `{{user_input}}`, and
`{{assistant_prefix}}`; arbitrary code execution is not part of the template
system.

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

ArcLM 1.0.0 does not claim universal Hugging Face support, production serving,
OpenAI-compatible APIs, attention-map capture, streaming generation, guaranteed
multi-GPU training, real QLoRA runtime validation, native BERT/T5/diffusion,
vision, audio, multimodal models, RLHF, DPO, or GRPO.

The compact source of truth for supported, beta, experimental, deprecated, and
unsupported areas is [`docs/special-version.md`](docs/special-version.md).
