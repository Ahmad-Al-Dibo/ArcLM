# Speciale ArcLM Versie

Framework version: `2.12.3`.

API compatibility version: `0.10.0`.

Deze repository is een private/speciale ArcLM-editie. De baseline is native-first: eigen ArcLM/PyTorch code vormt de kern; Hugging Face, PEFT, Web en preprocessing zijn optionele integraties.

Gebruik nieuwe code bij voorkeur via deze publieke domeinen:

```text
arclm.datasets
arclm.models
arclm.tokenizers
arclm.training
arclm.finetuning
arclm.inference
arclm.checkpoints
arclm.evaluation
arclm.peft
arclm.search
arclm.web
arclm.agents
arclm.security
```

Legacy modules blijven compatibility-only zolang tests en gebruikers ze nodig hebben. `MiniGPT` blijft voorlopig een deprecated alias naar `ArcLM`; er is geen tweede implementatie. `arclm.pipeline_v2` is geen tweede pipeline meer, maar alleen een deprecated re-export pad.

## ArcLM 1.0 Readiness Pass 1

Status: stabilisatie richting publieke release, geen versie bump. Web Studio
1-3 heeft de native visuele workflow compleet gemaakt:

```text
Project -> Dataset -> Validation/report -> Tokenizer -> Token inspection
-> Native model -> Training run -> Checkpoint -> Evaluation
-> Generation -> Pipeline inspection
```

Readiness beleid:

| Area | Status | Basis | Remaining limitation |
| --- | --- | --- | --- |
| Native public APIs | Stable candidate | Public API, smoke and full-suite tests pass for datasets, tokenizers, model, training, checkpoints, evaluation, generation and inspection. | Root exports blijven breed; post-release root API trim blijft technical debt. |
| Web Studio workflow | Beta | Local FastAPI and Next.js tests cover project, data, tokenizer, model, run, checkpoint, evaluation, generation and inspection paths. | Single-process local app; no auth, database, streaming or production serving. |
| GPT-style Simple Interface | Beta | `python -m arclm --run simple-interface` still launches the Flask app; focused tests cover backend model-operation state, terminal events, true streaming for streaming-capable adapters, sequential SQLite prompt queues, response lifecycle/timing records, token metrics, Agent-mode safe tool execution, load success/failure/cancellation, local chat persistence, deterministic follow-up context, template validation/preview, context trimming, memory-disabled behavior and chat search/rename/delete. | Local single-user JSON plus SQLite sidecar storage; only adapters that expose real incremental output are marked streaming; no cloud sync, vector memory, production auth or encrypted chat store by default. |
| Standalone distributions | Beta | Explicit manifests and `tools/build_arclm_distributions.py` generate `core`, `simple-interface`, `loading-inference`, `data-tokenizers`, `training`, `finetuning`, `evaluation-benchmarks`, `agents-tools` and `security` editions with per-edition packaging metadata, docs, examples, source inventories, compile verification and drift checks. | Manifests are curated; optional lazy import edges are reported but not full runtime proof; wheel size budgets and clean-environment validation are manual before publishing. |
| Diagnostics | Beta | `/api/system/status` and `arclm doctor` share safe runtime diagnostics. | Hardware-specific CUDA/multi-GPU paths blijven afhankelijk van lokale hardware. |
| Optional integrations | Beta/Experimental | Availability is detected without importing heavy optional packages. | Hugging Face/PEFT/QLoRA runtime claims blijven model- and hardware-specific. |
| Deprecated compatibility paths | Deprecated but retained | Compatibility tests cover old imports. | Retain through 1.x; removal should only be considered for 2.0 with migration notes. |
| Workspace/privacy safety | Stable candidate | Workspace IDs are backend-generated, path traversal is rejected, browser responses hide internal paths, and `workspace/` is ignored by Git. | Local generated prompts/generation records are intentionally stored under the configured workspace with bounded retention. |

`arclm doctor` is native-only and reports ArcLM version, import path, Python
executable/version, PyTorch/CUDA/GPU status, optional integration availability
and warnings. The browser-facing system endpoint does not expose user paths,
environment variables, secrets, command-line arguments, dataset contents,
checkpoint binaries, tokenizer binaries, embeddings or logits.

Public API stability inventory:

| Classification | APIs |
| --- | --- |
| Stable candidate | `ArcLM`, `TrainingConfig`, `Trainer`, `load_dataset`, `validate_records`, `create_dataset_manifest`, `build_dataset_report`, `Tokenizer`, `SentencePieceTokenizer`, `Generator`, `Evaluator`, `build_evaluation_report`, `SmartLoader`, native checkpoint helpers |
| Beta | `inspect_text`, `PipelineTrace`, `ModelCapabilityReport`, `model_support_matrix`, `RunTracker`, local FastAPI `create_app`, Web Studio endpoints, `arclm.simple_interface` GPT-style local chat endpoints |
| Experimental | External HF causal-LM loading boundaries, QLoRA/quantization runtime helpers, distributed runtime helpers, advanced preprocessing/search surfaces |
| Deprecated | `arclm.data`, `arclm.dataset`, `arclm.model`, `arclm.tokenizer`, `arclm.trainer`, `arclm.pipeline`, `arclm.pipeline_v2`, `arclm.diagnostics`, `arclm.generator`, `arclm.external_inference`, `arclm.loaders`, `MiniGPT` |
| Unsupported | Native BERT/T5/LLaMA/Mistral/Qwen implementations, diffusion, multimodal, RLHF/DPO/GRPO, OpenAI-compatible APIs, production serving, attention-map capture, WebSockets/streaming generation |

## Verified Examples Suite

Status: maintained numbered suite, CPU/local verification, no version bump.

Audit evidence for the repository-wide verification pass is recorded in
[`docs/repository-audit.md`](repository-audit.md).

The current examples live under `examples/00_quick_start` through
`examples/12_complete_projects`. `examples/manifest.json` is the compact source
of truth for category, status, requirements, optional dependencies, generated
artifacts, and runner eligibility.

Runner commands:

```bash
python examples/run_examples.py list
python examples/run_examples.py run 00-01
python examples/run_examples.py run-category data
python examples/run_examples.py run-verified
```

Verified examples do not require network access, automatic downloads, GPU,
remote services, or real external model assets. Boundaries that need local
models or optional providers are marked `manual_optional`, including PEFT/QLoRA
adapter training, real Hugging Face local-model loading, and real Whisper
speech-to-text.

The suite covers datasets, validation, manifests, tokenizers, native models,
training, SFT preparation, checkpoints, evaluation, local inference, pipeline
inspection, agents/tools, Security Core, and six complete projects. Older
unnumbered examples are preserved for history; the numbered suite is the
maintained release candidate examples surface.

## Standalone Distributions

Status: beta generation workflow, no version bump.

The full repository remains the canonical source. Smaller editions are generated
from `src/arclm` with explicit manifests in `distributions/manifests/`:

```bash
python tools/build_arclm_distributions.py list
python tools/build_arclm_distributions.py build-all
python tools/build_arclm_distributions.py test-all
python tools/build_arclm_distributions.py check-drift
```

The builder follows import dependencies, separates required module-load imports
from optional/lazy imports, fails when a required dependency crosses an excluded
boundary, and writes a source inventory for each generated edition. The
`simple-interface` and `loading-inference` manifests do not require the native
training loop at import time; any training/fine-tuning references that remain in
loading helpers are lazy optional edges.

Each generated edition has its own `pyproject.toml`, `MANIFEST.in`, license,
notice, README, installation guide, usage guide, API summary, limitations file,
examples, manifest and source inventory. Editions keep the `arclm` namespace and
are intended to be installed independently, not side by side.

Known limitations are documented in [`docs/distributions.md`](distributions.md):
manifest curation remains manual, optional runtime paths still need
environment-specific validation, and wheel size budgets are not enforced by the
tool yet.

## GPT-Style Simple Interface

Status: beta local chat surface, no version bump.

Launch remains:

```bash
python -m arclm --run simple-interface
```

The command still routes through `arclm.cli.run_command` to
`arclm.simple_interface.run_simple_interface`, starts the Flask app, and keeps
the existing model cache. Model inspection, model loading, local path/model ID
entry, device/dtype/quantization options, model saving, generation settings,
`/model/inspect`, `/model/load`, `/model/save`, `/predict`, `/generate` and
`/health` remain available.

The first screen is now a GPT-style local chat application:

- left sidebar with new chat, local search, previous chats, current model and
  settings;
- main area with conversation title, model status, message history, suggestions,
  context inspection and a multiline composer;
- settings dialog for general, appearance, model, chat template, context and
  memory, generation, system instructions, storage/privacy and advanced views.

Conversation records use backend-generated IDs, not display titles. Each chat
stores title, created/updated timestamps, selected model/source, template ID,
system instructions, persistent request instructions, context settings,
generation settings, full messages, optional summary and metadata. Messages
store ID, conversation ID, normalized role, content, timestamp, status, model
metadata, token count, generation metadata and error details where applicable.

Storage is a backend-owned versioned JSON file at
`workspace/simple-interface/chat-store.json` by default, or
`ARCLM_SIMPLE_INTERFACE_STORE` when configured. Writes are atomic on Windows and
Unix through a temporary file plus replace. Browser storage is limited to
harmless appearance preferences. The chat store does not contain model weights,
large tensors, passwords or encryption keys. It is local plaintext unless a
separate Security Core encrypted storage integration is configured in a future
phase.

A unified SQLite sidecar is created next to the JSON store as
`chat-store.sqlite3`. It records queryable `conversations`, `messages`,
`models`, `model_loads`, `generation_runs`, `chat_templates`, `tool_calls`,
`tool_results`, `training_candidates` and `settings`. Model weights are not
stored in SQLite. Training collection is separate from saved history and remains
off unless `allow_training_collection` is enabled and a response is explicitly
approved for training.

Generation uses one backend pipeline:

```text
receive user message -> validate chat/model -> save user message
-> resolve settings and instructions -> load optional memory and summary
-> select active history -> calculate token budget -> apply chat template
-> generate with the loaded model -> save assistant response
-> update conversation metadata
```

Each response also has a canonical lifecycle record:

```text
queued -> preparing -> waiting_for_tool -> running_tool -> generating
-> revealing -> saving -> completed
```

Failure states are `failed`, `tool_failed` and `cancelled`. The Flask backend is
the source of truth for these records. The visible thinking indicator displays
real operational stages such as preparing context, checking tools, running a
tool, generating, saving and completed. It is not private model reasoning,
chain-of-thought or a hidden rationale summary.

Recorded timestamps include `request_received_at`, preparation start/end, tool
execution start/end, generation start/end, frontend reveal start/end and
`response_saved_at` only when those stages occur. Durations are derived from
recorded timestamps. `first_chunk_received_at` and time-to-first-token are not
populated because the current Flask path returns the complete response before
the frontend token reveal animation starts.

Token metrics use the active tokenizer when available and are labelled
`estimated` when the fallback regex counter is used. The stored breakdown covers
system, memory, summary, history, current user, template overhead, total input,
generated output and total tokens. Tokens per second is calculated only from
output tokens divided by backend generation duration, excluding context
preparation, tool time and frontend reveal.

Agent mode is explicit in the composer. Chat mode does not run tools. Agent mode
uses `arclm.agents.Agent`, `AgentRunner`, `Tool`, `ToolPolicy`, tool schemas,
structured `ToolResult` values and Agent trace events. The Simple Interface
allowlist includes safe pure/read-only helpers already supported by ArcLM:
arithmetic operations, `current_datetime`, text statistics, JSON parse/format,
Markdown/HTML to text and local ArcLM inspection tools for model, tokenizer and
context. Shell execution, arbitrary command execution, arbitrary Python,
`eval`, `exec`, unrestricted filesystem access and terminal command execution
are not exposed. Tool cards in the message timeline show requested/completed,
failed or denied states, permission category, side effect and bounded structured
results.

Model operations use one backend-owned state machine exposed through
`/api/operations/status` and mirrored in `/api/models/active`. The canonical
states are:

```text
no_model -> queued -> loading -> ready -> generating -> unloading -> error/cancelled
```

The frontend does not infer model readiness from terminal text. After a refresh,
the ModelPill and composer restore from the Flask backend status. The ModelPill
shows the known model source, displays loading/indeterminate state while a model
load is active, disables chat input and incompatible model controls during busy
states, changes to Ready only after the backend verifies the loaded model, shows
Error on failed loads, and allows retry from Error or Cancelled. When available,
it also displays actual device and dtype from model parameters/buffers plus
requested device, resolved devices, sharding, GPU name, quantization and PyTorch
memory metadata from the backend.

The bottom terminal drawer is a read-only progress viewer backed by structured
operation events. It cannot execute shell commands or arbitrary Python. Events
use this shape:

```json
{
  "event_id": "event_...",
  "operation_id": "model_load_...",
  "timestamp": "2026-07-26T20:00:00+00:00",
  "category": "model",
  "level": "info",
  "stage": "loading_weights",
  "message": "Loading model weight files.",
  "progress": null,
  "details": {}
}
```

Supported levels are `debug`, `info`, `success`, `warning` and `error`; debug
events are hidden by default. The current transport is Server-Sent Events at
`/api/operations/stream` with a bounded polling fallback at
`/api/operations/events`. Events are ordered by insertion, carry operation IDs,
use bounded history, support reconnect by `after` event ID, prune completed
operation metadata, and are safe for multiple browser tabs.

Terminal stages cover model-source validation, configuration loading, tokenizer
loading, model-weight loading, device selection, precision selection, moving the
model to its device, model validation, model inspection, unloading, generation
startup, cancellation and recoverable errors. Progress is never fabricated:
exact counts are shown only when the backend has exact progress data; otherwise
the UI displays indeterminate text such as `Loading model weights...`.

Terminal event text is sanitized before it is sent to the browser. ArcLM
Security Core redaction is used when available; otherwise a focused fallback
redacts secret-looking keys and avoids exposing complete private local paths.
Normal terminal events do not include user prompts or internal stack traces.

Model loading can be cancelled by operation ID where the active stage can safely
observe cancellation. Cancellation updates the backend status to `cancelled`,
emits a terminal event, restores controls, and preserves the previous working
model when the replacement load had not been committed. It does not terminate
the Flask server. Response cancellation can stop pre-generation work when the
backend observes the cancellation request and can always stop the frontend token
reveal animation. Non-interruptible model calls are marked accurately rather
than force-terminating the Flask process.

Assistant responses use true streaming only when the active adapter emits
decoded deltas while model inference is running. Streaming events are delivered
over generation-scoped Server-Sent Events and include monotonically increasing
sequence numbers, generation IDs, conversation IDs, assistant message IDs and
timestamps. The final stored assistant message is the concatenation of all
accepted deltas. Non-streaming adapters keep the complete-response path and may
use the frontend token reveal animation as an accurately labelled visual
fallback. ArcLM does not simulate streaming by splitting completed answers.

Generation timing records `request_received_at`, `preparation_started_at`,
`generation_started_at`, `first_token_emitted_at` when streaming produces a
delta, and `generation_completed_at`. Time to first token is measured from
request receipt; model first-token latency is measured from generation start.
Tokens per second is calculated from the finalized output-token count divided
by backend generation duration.

Prompt submission uses a persistent sequential queue. Requests are stored in
the unified SQLite database with conversation ID, user/assistant message IDs,
model source, model-load ID, chat-template ID/version, settings snapshot,
status, FIFO queue sequence and timestamps. The worker claims the next queued
row atomically, executes one request at a time against the shared model runtime,
streams live deltas when supported, finalizes one assistant message, then starts
the next queued request. The composer remains usable while a request is active.
Queued context is built at execution time, so queued follow-ups normally include
previous completed user/assistant turns. Failed responses and cancelled partials
are marked non-context by default.

The active context window is distinct from saved history. Context settings cover
maximum context tokens, reserved response tokens, maximum history messages and
strategy (`all_messages`, `recent_messages`, `token_budget`,
`summary_plus_recent`, `manual`). Token estimates prefer a tokenizer when the
loaded model exposes one and otherwise use a conservative local estimate.
Current user messages are retained; older messages can be excluded when the
budget is exceeded. Context inspection reports the model context limit when
known, estimated input tokens, reserved output tokens, included/excluded message
IDs, summary/memory inclusion, template used and the final model input preview.

Summaries are stored separately from messages but remain disabled by default in
this phase. Cross-chat memory is also disabled by default. When enabled,
memories remain local, inspectable, editable and deletable, and are injected as
structured context visible in context inspection. The interface does not
automatically memorize sensitive information and does not use a vector database.

System instruction precedence is:

```text
conversation instructions -> model profile instructions -> global default instructions
```

Persistent request instructions are visible in settings and context inspection.
Generation settings follow the same global -> profile -> conversation ->
request override direction, with the current implementation covering the
simple-interface global and per-chat layers plus per-request composer payload.

Chat templates are validated JSON and never execute arbitrary code. Built-ins
include basic role/content messages, plain completion, ChatML-style text,
instruction/response, prompt/completion and tokenizer-native mode. Custom
templates can map ArcLM roles to model-specific roles, choose an output mode,
set the user input field and preview the exact model input before saving.

Complete role/content example:

```json
{
  "schema_version": 1,
  "id": "basic-chat",
  "name": "Basic Chat",
  "description": "A standard role/content chat template.",
  "message_format": {
    "role_field": "role",
    "content_field": "content"
  },
  "roles": {
    "system": "system",
    "user": "user",
    "assistant": "assistant",
    "tool": "tool"
  },
  "input_mapping": {
    "user_role": "user",
    "user_input_field": "content"
  },
  "system_message": {
    "enabled": true,
    "role": "system"
  },
  "output": {
    "type": "messages"
  }
}
```

Field meanings:

- `schema_version`: version of the ArcLM template schema.
- `id`: stable template ID; display names are not identifiers.
- `message_format`: field names used for structured message output.
- `roles`: normalized ArcLM role to model role mapping.
- `input_mapping.user_input_field`: property that receives the typed prompt.
- `system_message`: whether and how system instructions are represented.
- `output.type`: one of `messages`, `formatted_text`,
  `tokenizer_chat_template` or `prompt_completion`.

Formatted causal-model example:

```json
{
  "schema_version": 1,
  "id": "causal-human-assistant",
  "name": "Causal Human Assistant",
  "description": "Formats a chat as one causal-LM prompt.",
  "roles": {
    "system": "system",
    "user": "human",
    "assistant": "assistant"
  },
  "input_mapping": {
    "user_role": "user",
    "user_input_field": "content"
  },
  "output": {
    "type": "formatted_text"
  },
  "template": "System: {{system}}\n{{history}}\nHuman: {{user_input}}\nAssistant:",
  "assistant_prefix": "Assistant:"
}
```

Allowed formatted placeholders are `{{system}}`, `{{memory}}`, `{{summary}}`,
`{{history}}`, `{{user_input}}` and `{{assistant_prefix}}`. Unknown
placeholders fail validation, and invalid templates cannot become active.

Deferred features: streaming for Hugging Face adapters without an explicit
streamer, hard interruption of non-interruptible model kernels, visual
branch-tree rendering, automatic high-quality summarization, encrypted
conversation storage, vector retrieval, cross-device sync, multi-user accounts,
remote authentication, universal tokenizer-template compatibility and automatic
model downloads.

## ArcLM Agent Runtime

Status: beta foundational subsystem, no version bump.

`arclm.agents` adds the ArcLM Agent Runtime: a native-first, model-provider
independent tool and agent loop. The public surface is intentionally small:

```python
from arclm.agents import Agent, AgentRunner, Tool, ToolResult, ToolCall, ModelResponse, tool
```

Architecture:

- Core runtime depends on ArcLM and the Python standard library, not OpenAI,
  Anthropic, Google, Hugging Face, LangChain, or another agent framework.
- Tool registration follows the existing lightweight `arclm.registry.Registry`
  style through a focused `ToolRegistry`; no second general plugin, event, or
  dependency-injection platform was added.
- Root import policy is preserved. `import arclm` does not import the Agent
  Runtime or optional speech/web/model dependencies eagerly.
- The runtime integrates through stable boundaries: model adapters,
  serializable messages, structured tool results, sessions, traces, and
  capability reports.

Tool abstraction:

- `Tool` wraps a typed callable and exposes `ToolSpec`.
- `@tool` supports simple and configured decorator forms.
- `Tool.from_callable(...)` supports explicit construction.
- Generated input schemas use a strict JSON-schema subset.
- Supported inputs include `str`, `int`, `float`, `bool`, `None`, `list[T]`,
  `dict[str, T]`, `Literal`, `Enum`, optional/union values, simple dataclasses,
  and already-loaded Pydantic models.
- Unsupported annotations are rejected instead of represented as arbitrary
  objects.
- Tool invocation returns `ToolResult(success=..., value=..., content=...)`.

Tool registry and collections:

- `ToolRegistry` supports `register_tool`, `unregister_tool`, `get_tool`,
  `list_tools`, `has_tool`, and `create_tool_set`.
- Ordering is deterministic and duplicate names are rejected.
- Filtering by category, tags, and enabled state is supported.
- `ToolCollection` groups tools with description, categories, default
  permissions, optional dependencies, and a capability report.

Model adapter protocol:

- Adapters return `ModelResponse(content=...)` for final answers or
  `ModelResponse(tool_calls=[ToolCall(...)])` for tool requests.
- Sync and async adapters are supported.
- `CallableModelAdapter` wraps developer callables.
- `JSONToolCallingAdapter` and `ArcLMJSONToolAdapter` implement a strict,
  bounded JSON protocol for generation callables.
- ArcLM native causal models are not described as reliable universal tool
  callers. Malformed constrained-JSON output is rejected.

Agent runner:

- `Agent` describes name, instructions, model, tools, policies, optional
  output schema, and metadata.
- `AgentRunner` owns the bounded loop and defaults to eight steps.
- Stop conditions include final response, maximum steps, model failure, invalid
  model response, unknown or disabled tool, invalid arguments, approval denied,
  tool failure, cancellation, and timeout.
- `run(...)` is synchronous. `run_async(...)` is asynchronous. Sync tools can be
  run from async execution through an executor, with cooperative rather than
  forced cancellation.

Sessions, permissions, approvals, tracing:

- `AgentSession` stores bounded JSON-safe messages, tool calls, metadata,
  created time, updated time, serialization, and restoration.
- Tool permissions are `pure`, `read_local`, `read_network`, `write_local`,
  `external_action`, and `sensitive`.
- Side effects are `none`, `read_only`, `reversible`, and `irreversible`.
- The default approval handler denies tools whose permission requires approval.
- `ToolApprovalHandler` supports approve once, approve session, and deny.
- `AgentTrace` records safe local events such as `run_started`,
  `model_responded`, `tool_requested`, `approval_denied`, `tool_completed`,
  `tool_failed`, `step_completed`, and `run_completed`.

Built-in tools:

- Utility: bounded `add`, `subtract`, `multiply`, `divide`, `power`,
  `current_datetime`, and `text_statistics`.
- JSON: `parse_json`, `format_json`, and `validate_json_shape`.
- Documents: `markdown_to_text`, `markdown_to_document`, `markdown_to_json`,
  `html_to_text`, `html_to_document`, and `html_to_json`.
- Filesystem: `create_read_text_file_tool(workspace_root)` creates a read-only,
  root-scoped text-file reader that rejects absolute paths, traversal, symlink
  escape, unsupported extensions, oversized files, and invalid encodings.
- Web: `SafeWebReader` and `create_read_webpage_tool` enforce HTTP(S), block
  private/loopback/link-local destinations and redirects, bound response size,
  require supported content types, avoid cookies/auth persistence, and never
  execute JavaScript. Tests use mocked fetchers.

Speech-to-text:

- `SpeechToTextBackend`, `TranscriptionRequest`, and `TranscriptionResult`
  define the provider-independent abstraction.
- `FakeSpeechToTextBackend` supports deterministic examples/tests.
- `arclm.agents.integrations.whisper.WhisperSpeechToTextBackend` imports
  Whisper lazily, reports a clear optional dependency error, and refuses
  automatic model downloads unless explicitly allowed or a local model is
  supplied.

Resources and MCP boundary:

- `AgentResource`, `ResourceProvider`, and `InMemoryResourceProvider` prepare a
  read-only resource boundary.
- Tool/resource schema conversion is schema-ready for future MCP mapping.
- ArcLM does not claim full MCP client/server behavior or network transport.

Structured output and capability reporting:

- `Agent.output_schema` can hold a JSON-schema-like dictionary.
- Final JSON is validated only when the model adapter explicitly marks the
  response as structured output. Natural-language text is not silently trusted.
- `get_agent_capabilities()` distinguishes `available`, `optional`,
  `experimental`, `unsupported`, and dependency-related states.

Optional extras:

- `arclm[agents]`: base runtime.
- `arclm[agents-web]`: web boundary, currently standard-library only.
- `arclm[agents-audio]`: optional Whisper integration.
- `arclm[agents-all]`: all agent integrations.

Examples and tests:

- Examples live in `examples/agents/` and use fake model or speech backends by
  default.
- Focused tests cover tools, schema validation, runner behavior, documents, web
  safety, filesystem safety, audio abstraction, and import boundaries.

Security limits:

- Not included: shell execution, arbitrary Python execution, `eval`, `exec`,
  unrestricted file tools, unrestricted HTTP requests, browser automation,
  JavaScript execution, file deletion, file writing tools, authentication,
  databases, vector databases, long-term memory, multi-agent orchestration,
  autonomous background jobs, full MCP network transport, or automatic model
  downloads.

Dedicated documentation: [`docs/agent-runtime.md`](agent-runtime.md).

## ArcLM Security Core

Status: foundational security subsystem, explicit crypto extra, no version bump.

`arclm.security` introduces ArcLM Security Core. Its design rule is:

```text
Secure by default
Explicit when sensitive
Fail closed
No silent downgrade
```

Security inventory and threat model:

- The implementation includes safe `security_inventory()` and `threat_model()`
  objects covering datasets, tokenizer files, model configs, model weights,
  checkpoints, optimizer/scheduler/RNG state, run events, evaluation reports,
  generation history, Agent sessions, tool calls/results, prompts,
  instructions, external credentials, Web Studio config, keys and plugins.
- Primary threats recorded include path traversal, checkpoint replacement,
  untrusted Pickle loading, secret leakage, SSRF, weak keys, nonce reuse,
  remote Web exposure and prompt injection through documents/webpages.

Security modes and policy:

- `SecurityMode`: `development`, `local_secure`, `remote_secure`.
- `LegacyArtifactPolicy`: `legacy_read`, `secure_write`, `strict_secure`.
- `SecurityPolicy` controls encryption-required artifact types,
  signature-required artifact types, allowed algorithms, untrusted Pickle,
  remote model code, TLS-for-remote behavior, CORS credential rules and limits.
- `security_status()` returns a safe report with no keys, passwords, tokens,
  certificates or private paths.

Cryptographic dependency decision:

- Security crypto is an explicit extra: `arclm[security]`.
- The selected library is `cryptography>=42,<47`.
- Base imports remain light. Encryption/signing operations fail closed when
  `cryptography` is unavailable and never downgrade to plaintext.

Encryption algorithms and envelopes:

- Supported AEAD algorithms: `AES-256-GCM` and `ChaCha20-Poly1305`.
- Unsupported: ECB, unauthenticated CBC, DES/3DES/RC4, XOR, ZIP passwords and
  tutorial ciphers.
- Every encryption operation generates a fresh 96-bit random nonce with
  `os.urandom`.
- `EncryptedEnvelope` is versioned JSON with format, version, algorithm, key id,
  nonce, associated data, ciphertext, creation time and metadata.
- Associated data is canonicalized and authenticated. Changing it causes
  decryption to fail.
- Large artifact behavior is conservative: the small AEAD backend refuses
  payloads above policy limits. Streaming AEAD is not implemented yet and no
  plaintext fallback is allowed.

Key derivation and key providers:

- Password-derived keys use Argon2id with random salt and bounded parameters.
- HKDF derives purpose-bound subkeys from high-entropy master keys.
- `KeyProvider`, `KeyReference`, and `SecretKeyMaterial` define the provider
  boundary.
- Implemented providers: `InMemoryKeyProvider` for tests/local ephemeral use
  and `PasswordKeyProvider` for explicit password-derived workflows.
- Key lifecycle states are represented: `active`, `decrypt_only`, `rotating`,
  `disabled`, `destroyed`.
- Python memory zeroization is not claimed.

Encrypted artifacts and atomic writes:

- `EncryptedArtifactStore` is root-scoped and validates relative paths before
  writing or reading.
- Stored artifacts use envelope encryption: a fresh per-artifact data key
  encrypts the payload, and the active key provider wraps that data key. Only
  the wrapped data key and non-secret key identifiers are stored in the
  envelope.
- Encrypted writes use a temporary file in the destination directory, flush,
  `os.replace`, and cleanup on failure.
- File permissions are tightened with `chmod(0o600)` where the platform
  supports it. Encryption remains the main confidentiality boundary.

Hashing and signed manifests:

- Hash helpers support SHA-256 and SHA-512.
- Unsigned hashes are documented as integrity checks, not authenticity proofs.
- `ArtifactManifest` and `ManifestFile` provide canonical file inventory.
- Manifests are signed and verified with Ed25519 using deterministic canonical
  serialization.
- Verification rejects modified manifests, changed files, duplicate paths,
  traversal paths, unsupported algorithms and missing signatures.

Secure checkpoint/model loading:

- `SecureArtifactLoader` validates policy before deserialization.
- Untrusted Pickle loading is rejected by default.
- Remote model code is rejected by default.
- Strict secure mode requires signed manifests for checkpoints/model artifacts.
- Existing legacy checkpoint APIs remain readable through explicit trusted
  paths; automatic migration or deletion is not performed.
- Safetensors is treated as a safer model-weight format candidate and verified
  through manifests when present, but no new safetensors dependency is added in
  this phase.

Web Studio security:

- Web Studio remains bound to `127.0.0.1` by default.
- The current Web API CLI rejects non-loopback binding until a remote-secure
  TLS/authentication deployment surface is implemented.
- Security helpers validate remote-secure TLS policy, CORS origins, wildcard
  credential denial, CSRF tokens and conservative security headers.
- Authentication and authorization are represented by an explicit boundary
  object. A production auth system is not implemented.

Agent Runtime security:

- `Agent` can carry `SecurityPolicy`.
- Tool-result messages are redacted before session storage when
  `security_policy.redact_traces` is enabled.
- Defensive Agent tools are available through
  `create_security_tool_collection()` for redaction and hashing.
- Sensitive tool permission and approval behavior remains enforced by Agent
  Runtime policies.

Migration:

- `inspect_workspace_for_security_migration()` classifies existing plaintext
  files and creates a migration plan without modifying files.
- Migration defaults preserve plaintext until encrypted copies are verified and
  cleanup is explicitly chosen.

Security CLI:

```bash
python -m arclm security status --json
python -m arclm security audit --json
```

The CLI prints safe status, inventory and threat-model information without
secrets or absolute workspace paths.

Known limitations:

- No cloud KMS, OS keyring provider, streaming AEAD backend, full auth system,
  full MCP security profile, independent audit, certification, or production
  browser deployment is claimed.
- Existing PyTorch trusted loading remains a legacy explicit boundary.
- Full test suite still has unrelated environment-sensitive failures in
  distributed/checkpoint/web/regression areas in this workspace.

Examples live in [`examples/security/`](../examples/security/).

Release status after the repository and documentation verification pass:
`2.12.3` is the real framework version reported by `arclm.__version__`, package
metadata, built artifacts, Web Studio diagnostics and generated documentation.
`0.10.0` remains the separate API compatibility version reported by
`arclm.__api_version__`.

## ArcLM 2.12.3 Framework Version

ArcLM `2.12.3` is the current framework version for the completed native Studio
workflow and verified documentation pass. The release gate uses a clean
installed wheel, `arclm[web]`, a temporary workspace and real Uvicorn HTTP
requests for:

```text
Project -> Dataset -> Validation/report -> Word tokenizer -> Record inspection
-> Native model config -> CPU training -> Checkpoint -> Evaluation
-> Generation -> Checkpoint pipeline inspection
```

Project progress is derived from real artifacts only. There is no editable
progress percentage. The release smoke verifies the stages become Ready as
their dataset, tokenizer, model, completed run, compatible checkpoint,
completed evaluation, generation record and inspection trace appear.

Privacy and workspace behavior:

- `workspace/` is ignored by Git and must not be packaged.
- Studio responses and diagnostics do not expose internal workspace paths,
  environment variables, secrets, checkpoint tensor binaries, tokenizer
  binaries, embeddings or logits.
- Studio does not download external models or upload data to remote services.
- Checkpoint metadata and evaluation reports are exportable as safe JSON
  payloads through existing read endpoints.

Release recommendation: treat this repository state as framework version
`2.12.3` after owner review. Keep `0.10.0` only as the Web/API compatibility
marker until an intentional API-version bump is made.

## Transparent Pipeline Inspection

ArcLM heeft een native inspectiepad voor studenten en ontwikkelaars die een
enkele generatie-stap willen begrijpen zonder de interne code te lezen:

```python
from arclm import inspect_text

trace = inspect_text(model=model, tokenizer=tokenizer, text="Hello ArcLM")
print(trace.summary())
print(trace.to_dict())
```

De trace toont: inputtekst, tokens, token ids, input tensor shape,
embedding shape, logits shape, gekozen token, gedecodeerde tekst, device,
dtype en model/tokenizer classes. Standaard bewaart de trace geen embeddings
of logits. Gebruik `include_values=True, max_values=20` alleen voor kleine,
begrensde samples. De eerste versie inspecteert één native ArcLM
generatie-stap; attention maps, web streaming en externe Hugging Face traces
zijn nog niet geimplementeerd.

## Local Web Pipeline Inspection

De lokale weblaag kan dezelfde native trace read-only tonen:

```text
Next.js /learn/pipeline -> POST /api/inspection/text -> arclm.inspect_text -> PipelineTrace.to_dict()
```

Endpoint: `POST /api/inspection/text`.

Requestvelden:

```json
{
  "text": "Hello ArcLM",
  "source_mode": "demo",
  "include_values": false,
  "max_values": 20,
  "device": "cpu",
  "precision": "fp32"
}
```

Ondersteunde bronnen zijn `demo`, `project_model`, `checkpoint` en het oudere
`configured` app-state pad. `demo` maakt lui een tiny CPU ArcLM model en
tokenizer voor onderwijsgebruik. `project_model` gebruikt een projectmodel-
configuratie en toont die als `Untrained`. `checkpoint` gebruikt alleen
backend-generated project- en checkpoint IDs; de backend reconstrueert de
native checkpoint en tokenizer en roept daarna `arclm.inspect_text` aan.

De request accepteert geen bestandspaden, Hugging Face model IDs, Python
classes of willekeurige dtypes. Als er geen bron gekozen is, retourneert
`GET /api/inspection/status` een bruikbare uninitialized state met herstelopties
zoals demo starten, projectmodel kiezen of checkpoint manager openen. De
Next.js leerpagina staat op `/learn/pipeline` en visualiseert input, tokens,
token IDs, input tensor, embedding shape, position note, transformer summary,
logits shape, geselecteerde token en een generatie van een token. Attention
maps, hidden-state history, multi-step inspectie, streaming en externe-model
tracing zijn niet geimplementeerd.

## ArcLM Studio Web 1

ArcLM Studio is de optionele lokale webapp voor project-, data- en tokenizer
voorbereiding. De frontend blijft een client van de FastAPI laag, en de
backend gebruikt ArcLM publieke APIs voor datasets, validatie, reports en
tokenizers.

Actieve routes:

```text
/
/projects
/projects/new
/projects/[projectId]
/projects/[projectId]/data
/projects/[projectId]/tokenizer
/system
/learn/pipeline
```

Actieve API endpoints:

```text
GET    /api/system/status
GET    /api/projects
POST   /api/projects
GET    /api/projects/{project_id}
PATCH  /api/projects/{project_id}
DELETE /api/projects/{project_id}
GET    /api/projects/{project_id}/datasets
POST   /api/projects/{project_id}/datasets/upload
POST   /api/projects/{project_id}/datasets/paste
GET    /api/projects/{project_id}/datasets/{dataset_id}
GET    /api/projects/{project_id}/datasets/{dataset_id}/preview
DELETE /api/projects/{project_id}/datasets/{dataset_id}
POST   /api/projects/{project_id}/datasets/{dataset_id}/validate
POST   /api/projects/{project_id}/datasets/{dataset_id}/report
GET    /api/projects/{project_id}/datasets/{dataset_id}/manifest
GET    /api/projects/{project_id}/datasets/{dataset_id}/report
GET    /api/projects/{project_id}/tokenizers
POST   /api/projects/{project_id}/tokenizers/native
GET    /api/projects/{project_id}/tokenizers/{tokenizer_id}
POST   /api/projects/{project_id}/tokenizers/{tokenizer_id}/inspect
DELETE /api/projects/{project_id}/tokenizers/{tokenizer_id}
```

Workspace storage is confined to the configured `WebConfig.workspace_root`.
Project, dataset and tokenizer IDs are generated server-side and validated
before filesystem access. Browser requests never provide absolute paths,
checkpoint paths or model IDs. Path traversal, encoded traversal and symlink
escapes are rejected where practical. Uploaded filenames are sanitized and
stored only as metadata/display names. JSON writes use atomic replacement.

Data Studio supports bounded JSON, JSONL, CSV and TXT upload/paste flows.
Preview responses are limited, large cells are truncated, validation uses
`validate_records` and `validate_sft_records`, and report generation uses
`create_dataset_manifest` and `build_dataset_report`. Token statistics come
from the canonical tokenizer path used by the report.

Tokenizer Lab supports creating a native ArcLM tokenizer from a project
dataset and inspecting text through that tokenizer. It reports tokens, token
IDs, token count, unknown-token count, decoded text and round-trip status.
The UI exposes Word tokenizer and SentencePiece tokenizer creation, including
BPE, Unigram, Character and Word SentencePiece modes when the optional backend
support is installed.

Web Studio 1 blijft de basis voor projecten, data en tokenizers.

## ArcLM Web Studio 2

Web Studio 2 voegt een lokale native model- en training flow toe bovenop de
bestaande ArcLM core:

```text
Project -> Dataset -> Tokenizer -> Native model config -> Training config -> Run -> Checkpoints
```

Publieke web API:

| Area | Endpoints | Behavior | Limitations |
| --- | --- | --- | --- |
| Native Model Builder | `GET/POST/PATCH/DELETE /api/projects/{project_id}/models...`, `POST /models/native/validate`, `POST /models/native/estimate` | Slaat native ArcLM configuratie en metadata op, valideert via echte `ArcLM` constructie, vereist een ready project-tokenizer, telt parameters via tijdelijke modelinstantie en labelt memory estimates als approximate. | Geen externe model families, geen downloads, geen willekeurige Python classes, geen modelgewichten opslaan bij configuratie. |
| Explicit dataset tokenization | `POST /api/projects/{project_id}/datasets/{dataset_id}/report`, `POST /api/projects/{project_id}/datasets/{dataset_id}/inspect` | Browser kiest expliciet een project-tokenizer; backend valideert eigenaarschap/status, report identity bevat dataset/tokenizer/max sequence length, record inspectie is begrensd en gebruikt canonical tokenizer encode/decode. | Geen remote tokenizers, geen volledige dataset dumps, geen embeddings/logits, schema-validatie blijft mogelijk zonder tokenizer. |
| Training jobs | `GET/POST /api/projects/{project_id}/runs`, `GET /runs/{run_id}`, metrics/events/cancel/checkpoints endpoints | In-process background thread start canonical native `Trainer`; run metadata, configuration, `metrics.jsonl`, `events.jsonl` en checkpoint metadata blijven onder de project workspace. | Maximaal 1 actieve job per app-instantie; geen queue, automatische resume, subprocess-isolatie, Evaluation Studio of Generation Playground. |
| Run lifecycle | `queued`, `starting`, `running`, `cancelling`, `cancelled`, `completed`, `failed`, `interrupted` | Stale active runs worden bij app start `interrupted`; cancellation is cooperatief en stopt op een veilige Trainer callback boundary. | Cancellation is niet instant; browser krijgt geen raw tracebacks en geen checkpoint binaries. |

Frontend routes:

```text
/projects/[projectId]/model
/projects/[projectId]/train
/projects/[projectId]/train/pretraining
/projects/[projectId]/train/finetuning
/projects/[projectId]/runs
/projects/[projectId]/runs/[runId]
```

Web Studio 4 splitst de oude Training Studio in een Training Center met twee
zichtbare workflows:

| Workflow | Starts from | Dataset contract | Supported methods | Backend behavior | Limitations |
| --- | --- | --- | --- | --- | --- |
| Pre-Training | Newly initialized native ArcLM project model | Plain/text-like causal-LM records from project datasets | Native causal-LM pre-training | Stores `training_mode=pretraining` and starts the existing local `Trainer`. | No checkpoint source; continued pre-training is deferred. |
| Fine-Tuning | Project model configuration or compatible project checkpoint | `instruction_response`, `prompt_completion`, or `plain_text` | `full`, `sft` | Validates base source, tokenizer/model vocabulary, dataset fields, tags and device; preview returns formatted text, tokens, token IDs and label mask; execution stores `training_mode=fine_tuning`, `fine_tuning_method`, `base_checkpoint_id` and `fine_tuning_format`. | Studio exposes no LoRA/QLoRA because reload/generation integration is not complete. Custom formatting tags are previewed and stored; canonical training uses ArcLM fine-tuning formatter/labels. |

Fine-tuning tags are formatting text, not tokenizer special tokens. Enabling
special-token registration is blocked if it would require a model vocabulary
resize; Studio never silently registers tokens or resizes embeddings. End
behavior can be custom end tag, tokenizer EOS when available, or no explicit
end marker. Existing runs without `training_mode` remain readable as
`legacy_native_training`.

New validation endpoints:

```text
POST /api/projects/{project_id}/training/pretraining/validate
POST /api/projects/{project_id}/training/finetuning/validate
POST /api/projects/{project_id}/training/finetuning/preview
```

Deferred: WebSockets/streaming logs, attention maps, authentication, database,
cloud storage, shell execution, external downloads, arbitrary filesystem
browsing, QLoRA runtime and arbitrary Python formatting code.

## ArcLM Web Studio 3

Web Studio 3 sluit de native projectloop af met read-only checkpoint,
evaluation en generation tools bovenop bestaande ArcLM APIs:

```text
Project -> Runs -> Checkpoints -> Validate/Inspect/Evaluate/Generate
```

Geverifieerde web API:

| Area | Endpoints | Behavior | Limitations |
| --- | --- | --- | --- |
| Checkpoint Manager | `GET /api/projects/{project_id}/checkpoints`, `GET/DELETE /checkpoints/{checkpoint_id}`, `POST /checkpoints/{checkpoint_id}/validate`, `POST /checkpoints/{checkpoint_id}/inspect` | Toont project-brede native checkpoints uit run outputs, valideert via canonical checkpoint reload, verwijdert alleen met expliciete bevestiging en inspecteert via `arclm.inspect_text`. | Geen willekeurige checkpointpaden, downloads, tensor dumps of externe model tracing. |
| Evaluation Studio | `GET/POST /api/projects/{project_id}/evaluations`, report/events/cancel/compare endpoints | Start bounded native evaluation jobs in-process, bewaart metadata/events/reports onder de project workspace en gebruikt canonical `Evaluator` plus `EvaluationReport.to_dict()`. | Geen queue, distributed evaluation, fake metrics of custom metric upload vanuit de browser. |
| Generation Playground | `GET/POST /api/projects/{project_id}/generations`, `GET/DELETE /generations/{generation_id}` | Genereert tekst uit compatible native checkpoints met begrensde prompt en token limits, bewaart bounded local history en gebruikt canonical native `Generator`. | Geen streaming, attention maps, externe modellen, modelbeheer of browser-side model loading. |

Frontend routes:

```text
/projects/[projectId]/checkpoints
/projects/[projectId]/checkpoints/[checkpointId]
/projects/[projectId]/checkpoints/[checkpointId]/inspect
/projects/[projectId]/evaluate
/projects/[projectId]/evaluations
/projects/[projectId]/evaluations/[evaluationId]
/projects/[projectId]/generate
```

Native model/tokenizer/checkpoint ownership blijft server-side in de lokale
workspace. Browser requests sturen alleen project IDs, backend-generated
checkpoint/evaluation/generation IDs en bounded form fields. De Studio 3 UI
voegt geen training features, externe model downloads, WebSockets, streaming,
attention capture, auth of databases toe.

## ArcLM 0.8 Causal LM Workbench

De officiele modelroute is native ArcLM causal language modeling:

```text
Config/build_model or ArcLM(...) -> Tokenizer -> Trainer -> checkpoint -> load_model/Generator -> Evaluator -> inspect_text
```

Native checkpoints gebruiken het bestaande `arclm.checkpoints` formaat en
moeten metadata bevatten voor ArcLM-versie, checkpoint-format versie,
`model_source`, `model_task`, architectuur, modelconfiguratie,
tokenizerinformatie en trainingconfiguratie. Externe causal-LM modellen lopen
via `arclm.inference.inspect_model_source` en `load_any_model`; ze zijn Hugging
Face/PEFT integraties en geen native ArcLM checkpoints.

| Model | Exact version | Source | Task | Load | Forward | Generate | Train | SFT | LoRA | Save/Reload | CPU | CUDA | Status | Limitations |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ArcLM Native Tiny | ArcLM native tiny causal LM | Native ArcLM | causal LM | Passed | Passed | Passed | Passed | Passed | Passed | Passed | Passed | Not tested | Validated | Compact single ArcLM architecture; native LoRA is validated on ArcLM Linear layers; no KV cache, streaming, attention capture or quantization. |
| GPT-2 reference | `hf-internal-testing/tiny-random-gpt2` | External Hugging Face | causal LM | Passed | Not tested | Passed | Not supported | Not tested | Not tested | Passed | Passed | Not tested | Compatible | Boundary/mocked tiny path only; no large weight download or real runtime claim. |
| Selected Qwen | `Qwen/Qwen3-0.6B` | External Hugging Face | causal LM | Not tested | Not tested | Not tested | Not supported | Not tested | Not tested | Not tested | Not tested | Not tested | Experimental | Exact model path is recognized; real load/forward/generation/SFT/LoRA/CUDA are unvalidated unless locally available. |

ArcLM bevat drie CPU-vriendelijke beginner workflows voor data/tokenization,
tiny native training en checkpoint reload/generation/inspection. Ze gebruiken
geen externe downloads en tonen alleen het native happy path. Advanced
Qwen/GPT-2 workflows blijven optionele integraties en zijn geen bewijs voor
universele modelondersteuning.

## ArcLM 0.9 Data, SFT and Evaluation

De 0.9 happy path is:

```text
dataset -> validation -> cleaning -> tokenization statistics -> SFT formatting -> native fine-tuning -> checkpoint -> evaluation report -> generation -> reproducibility report
```

Nieuwe compacte APIs:

| Area | Public API | Verified behavior | Limitations |
| --- | --- | --- | --- |
| Dataset schema validation | `arclm.datasets.validate_records`, `DatasetValidationResult`, `DatasetValidationIssue` | Missing fields, type errors, empty strings, valid/invalid counts, indexes and optional record IDs; strict mode raises, non-strict returns valid records plus issues. | Small field-schema validation only; no external schema dependency or nested validation framework. |
| Dataset manifest | `create_dataset_manifest`, `DatasetManifest` | Records source type/files, before/after counts, invalid records, duplicates removed, text fields, transformations, split sizes, timestamp and ArcLM version without storing data contents. | Local JSON-safe provenance only; no remote registry or dataset catalog. |
| Dataset/token report | `build_dataset_report`, `DatasetReport` | Reports record counts, valid/invalid counts, split sizes, text length stats, token length stats, token count, unknown-token rate and truncation count when configured. | Uses the provided tokenizer once for report statistics; does not persist full tokenized dataset. |
| SFT data contract | `get_sft_record_contract`, `validate_sft_records`, `prepare_fine_tuning_record`, `prepare_fine_tuning_dataset` | Supports plain text, prompt/completion and instruction/response through one canonical record preparation path. The Fine-Tuning Preview displays the exact formatted text, token IDs and label behavior consumed by the training run. | Packing remains disabled in stable `FineTuningConfig`; external HF SFT still needs optional dependencies. Legacy Python calls may keep historic response aliases unless strict field mapping is selected. |
| Fine-tuning entry points | `fine_tune`, `train_sft`, `FullFineTuner`, `SFTTrainer` | Native full fine-tuning and native SFT share validation, formatting, tokenization, labels, prompt masking, collation and checkpoint metadata concepts. The fine-tuning method controls trainable-parameter behavior; dataset format, formatting tags, end behavior and label strategy control prepared examples. | Native Trainer is unchanged; external/HF helpers remain optional integration paths. |
| Native LoRA validation | `LoRAConfig`, `apply_lora`, `fine_tune(..., peft_config=LoRAConfig(...))`, adapter artifact APIs | Tiny native ArcLM model passes adapter creation, trainable parameter selection, one training run, checkpoint resume, adapter save/reload, forward after reload, merge/unmerge and generation after merged artifact reload. | Validated on native ArcLM Linear layers only; QLoRA runtime remains unvalidated without CUDA/bitsandbytes. |
| Evaluation report | `build_evaluation_report`, `EvaluationReport` | Wraps canonical `EvaluationResult` metrics with examples, batches, token count, model/checkpoint/dataset identity, timestamp, device, dtype and warnings; supports `to_dict()`, `to_json()`, `summary()`. | Does not recalculate metrics; diagnostics should interpret the report rather than duplicate metrics. |
| Reproducibility metadata | `arclm.tracking.set_reproducible_seed`, `build_reproducibility_metadata` | Records seed coverage for Python, NumPy, Torch CPU and CUDA when available, plus dataset/tokenizer/model fingerprints and checkpoint/run format versions. | Deterministic equality is not guaranteed across hardware, PyTorch builds, CUDA kernels or optional backends. |

The official 0.9 workflow runs on CPU without external downloads and produces a
local reproducibility report when executed. Generated output directories are
runtime data and are not part of the package.

## Canonical Feature Status

| Feature | Canonical module | Public API | Status | Dependencies | Known limitations |
| --- | --- | --- | --- | --- | --- |
| Dataset loading | `arclm.datasets` | `load_dataset`, `DatasetLoader`, `StreamingDataset` | Stable | Required core deps | Local files/lists only; no HF Dataset/WebDataset integration. |
| Dataset validation, manifests and reports | `arclm.datasets` | `validate_records`, `create_dataset_manifest`, `build_dataset_report` | Stable | Required core deps | Lightweight local metadata only; no remote dataset registry and no full record contents in manifests. |
| Dataset processing | `arclm.datasets` | `DataProcessor`, `ProcessedDataset`, `DataPipeline` | Stable | Required core deps | `DataProcessor.load` delegates loading to `DatasetLoader`; processing stays in-memory and local. |
| Dataset cleaning and dedup | `arclm.datasets.cleaning`, `arclm.datasets.deduplication` | `NormalizeWhitespace`, `ExactDeduplicator` | Stable | Required core deps | Exact/local rules only; no dataset version store. |
| Native model | `arclm.models` | `ArcLM`, `AutoModel` | Stable | `torch` | Native support is GPT-style causal LM only. |
| Transparent pipeline inspection | `arclm.inspection` | `inspect_text`, `PipelineTrace` | Beta | `torch` | One native generation step only; no attention maps, web streaming or external HF tracing. |
| `MiniGPT` alias | `arclm.models` | `MiniGPT` | Deprecated | `torch` | Alias to `ArcLM` for compatibility; do not use in new projects. |
| Tokenizers | `arclm.tokenizers` | `Tokenizer`, `SentencePieceTokenizer`, `AutoTokenizer` | Beta | `sentencepiece` | HF tokenizer behavior is optional/external-path dependent. |
| Training | `arclm.training` | `Trainer`, `TrainingConfig`, `train_model` | Stable | `torch` | Single-device core; real multi-GPU training is not stable. |
| Checkpoints and artifacts | `arclm.checkpoints`, `arclm.lifecycle` | `SmartLoader`, `inspect_checkpoint`, `save_model_artifact` | Stable | `torch`, optional `safetensors` | Trusted local checkpoint boundary; external matrix incomplete. |
| Fine-tuning and SFT | `arclm.finetuning` | `FullFineTuner`, `SFTTrainer`, `train_sft`, `fine_tune`, `validate_sft_records` | Stable | `torch`, optional HF stack | Native CPU verified; external/HF runtime remains optional and model-specific. |
| External inference | `arclm.inference.external` | `inspect_model_source`, `load_any_model`, `predict_external`, `save_loaded_model` | Beta | `torch`, optional `transformers`/`peft` | Supports native ArcLM and HF causal LM/LoRA paths, not universal model loading. |
| Native inference | `arclm.inference` | `load_model`, `predict`, `Generator` | Stable | `torch` | Native checkpoint generation only. |
| Evaluation and diagnostics | `arclm.evaluation` | `Evaluator`, `EvaluationReport`, `build_evaluation_report`, `Accuracy`, `Perplexity`, diagnostic helpers | Stable | `torch` | Reports wrap canonical metrics; diagnostics interpret reports and should not recalculate metrics independently. |
| LoRA | `arclm.peft` | `LoRAConfig`, `apply_lora`, `save_adapter_artifact` | Stable | `torch`, optional `peft` for external adapters | Native ArcLM Linear-layer LoRA runtime verified; external PEFT and QLoRA remain model/hardware-specific. |
| QLoRA and quantization | `arclm.peft` | `QLoRAConfig`, `QuantizationConfig`, `load_quantized_model` | Experimental | Optional `transformers`, `bitsandbytes` | Boundary behavior exists; real bitsandbytes GPU runtime pending. |
| Distributed runtime | `arclm.distributed` | `DistributedConfig`, DDP/FSDP capability helpers | Experimental | `torch.distributed` | CPU/Gloo boundary exists; real CUDA DDP/FSDP is not complete. |
| Tracking | `arclm.tracking` | `RunTracker`, `create_run`, `inspect_run` | Beta | Required core deps | Local manifests only; external services are compatibility-only. |
| Hyperparameter search | `arclm.search` | `create_search`, `SearchSpace`, `compare_trials` | Beta | Required core deps | Sequential local trials; no parallel/Bayesian/pruning engine. |
| Preprocess pipeline | `arclm.preprocess` | preprocess config/pipeline helpers | Experimental | Optional preprocess deps | Older JSONL pipeline; not the main dataset API. |
| FastAPI Web API | `arclm.web` | `create_app`, `WebConfig`, `/api/system/status`, `/api/projects`, project dataset/tokenizer/model/run endpoints, `POST /api/inspection/text` | Beta | Optional `fastapi`, `uvicorn` | Local Studio API only; native training jobs are single-process/threaded and not production serving. |
| Next.js frontend | Optional Studio frontend | Project, data, tokenizer, model, train, runs, checkpoints, evaluation, generation, system and pipeline-learning pages | Experimental | Node/npm stack | Optional Studio UI; streaming logs, attention maps, auth, database, external downloads and production serving are deferred. |
| GPT-style Simple Interface | `arclm.simple_interface`, `arclm.simple_chat` | `run_simple_interface`, `/api/chats`, `/api/templates`, `/api/settings`, `/api/models`, `/api/operations`, `/api/generation-runs`, `/api/queue`, `/api/model-profiles`, `/api/memories` | Beta | Optional `flask`, required inference deps | Local single-user JSON chat store plus SQLite sidecar; operation events and generation deltas use SSE with bounded polling/replay. Only streaming-capable adapters emit live deltas. No auth, vector memory or encrypted storage by default. |
| Legacy import shims | `arclm.data`, `arclm.dataset`, `arclm.model`, `arclm.tokenizer`, `arclm.trainer`, `arclm.pipeline`, `arclm.pipeline_v2`, `arclm.diagnostics`, `arclm.generator`, `arclm.external_inference`, `arclm.loaders` | Old import paths | Deprecated | Same deps as canonical modules | Keep small re-export shims; `pipeline_v2` is compatibility-only, not a second pipeline. |
| Native BERT/T5/LLaMA/Mistral/MoE/vision/multimodal | None | None | Unsupported | N/A | Use external HF causal LM paths where compatible; no native implementation. |
| RLHF/DPO/GRPO/production serving/OpenAI-compatible API/GGUF/ONNX/TensorRT | None | None | Unsupported | N/A | Out of current baseline scope. |
