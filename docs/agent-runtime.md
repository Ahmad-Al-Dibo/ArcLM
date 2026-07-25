# ArcLM Agent Runtime

`arclm.agents` is the foundational Agent Runtime for ArcLM. It lets developers
connect a provider-independent model adapter to typed Python tools, run a
bounded tool loop, preserve session history, and inspect a lightweight trace.

The runtime is deliberately small. It is not a full autonomous-agent platform,
browser automation stack, long-term memory system, or MCP client/server.

## Public API

```python
from arclm.agents import Agent, AgentRunner, Tool, ToolResult, tool
```

Core exports include `Agent`, `AgentRunner`, `AgentSession`, `AgentMessage`,
`AgentModel`, `ModelResponse`, `ToolCall`, `Tool`, `ToolResult`,
`ToolCollection`, `ToolContext`, `ToolPolicy`, and `tool`.

## Tools

Tools are regular typed Python callables wrapped in a `Tool` object. A tool
declares its name, description, input schema, optional output description,
category, tags, permission level, timeout, side-effect level, enabled state, and
metadata.

```python
from arclm.agents import tool


@tool
def calculate_total(price: float, quantity: int) -> float:
    """Calculate a total price."""
    return price * quantity
```

`Tool.from_callable(...)` supports explicit construction for plugin or dynamic
applications. The schema generator supports basic JSON-safe types, `Optional`,
`Literal`, `Enum`, lists, dictionaries, simple dataclasses, and already-loaded
Pydantic models. Unsupported or ambiguous annotations are rejected.

Model-generated tool arguments are validated before invocation. Unknown fields
are rejected unless a schema explicitly allows them. Raw model dictionaries are
never passed straight into a callable.

## Registry And Collections

`ToolRegistry` provides deterministic registration, duplicate detection,
lookup, unregistering, category/tag/enabled filters, and named tool sets.
`ToolCollection` groups related tools and reports runtime capabilities.

The implementation reuses the existing lightweight `arclm.registry.Registry`
pattern rather than introducing a second general registry platform.

## Model Adapters

The runtime depends on a small provider-independent model protocol:

```python
ModelResponse(
    tool_calls=[ToolCall(id="call_1", name="calculate_total", arguments={...})]
)
```

or:

```python
ModelResponse(content="The total is 37.5.")
```

Adapters may be synchronous or asynchronous. `CallableModelAdapter` wraps a
developer-supplied function. `JSONToolCallingAdapter` and
`ArcLMJSONToolAdapter` provide a strict bounded JSON protocol for generation
callables:

```json
{"type": "tool_call", "tool": "calculate_total", "arguments": {"price": 12.5, "quantity": 3}}
```

Malformed JSON is rejected. ArcLM native causal models are not advertised as
reliable native tool callers unless the developer provides a suitable adapter
and prompt/protocol.

## Runner

`AgentRunner` executes a bounded loop:

```text
user message -> model -> tool calls -> validated tools -> tool results -> model -> final answer
```

Stop conditions include final response, maximum steps, model failure, invalid
model response, invalid tool call, approval denied, timeout, and tool failure.
The default maximum is eight steps.

`run(...)` is sync. `run_async(...)` is async. Sync tools are executed through an
executor in async runs; they cannot be forcibly interrupted once running.

## Sessions, Permissions, Approvals, Tracing

`AgentSession` stores bounded serializable messages, tool calls, metadata, and
timestamps. It does not implement vector memory, databases, or long-term
semantic memory.

Tools declare `pure`, `read_local`, `read_network`, `write_local`,
`external_action`, or `sensitive` permissions and a side-effect level. The
default policy requires approval for network reads, local writes, external
actions, and sensitive tools. The bundled tools are pure or read-only.

`ToolApprovalHandler` lets applications approve once, approve for a session, or
deny. The default handler denies tools that require approval.

`AgentTrace` records safe events such as `run_started`, `model_responded`,
`tool_requested`, `tool_completed`, `tool_failed`, and `run_completed`.

## Built-In Tools

Built-ins are optional and live under `arclm.agents.builtins`.

Utility tools:

- `add`, `subtract`, `multiply`, `divide`, `power`
- `current_datetime`
- `text_statistics`
- `parse_json`, `format_json`, `validate_json_shape`

Document tools:

- `markdown_to_text`, `markdown_to_document`, `markdown_to_json`
- `html_to_text`, `html_to_document`, `html_to_json`
- `create_read_text_file_tool`

Web tools:

- `SafeWebReader`
- `create_read_webpage_tool`

The website reader is bounded, blocks non-HTTP(S) schemes and private addresses,
does not run JavaScript, enforces content types and response sizes, and supports
mocked fetchers for deterministic tests.

## Speech-To-Text

`SpeechToTextBackend`, `TranscriptionRequest`, and `TranscriptionResult` define
a provider-independent speech-to-text boundary. `FakeSpeechToTextBackend` is
available for deterministic tests and examples.

`arclm.agents.integrations.whisper.WhisperSpeechToTextBackend` imports Whisper
lazily and refuses automatic model downloads unless the caller explicitly
allows that behavior or passes an already loaded model.

## Resources And MCP Boundary

`AgentResource`, `ResourceProvider`, and `InMemoryResourceProvider` distinguish
read-only context resources from callable tools. Tool and resource definitions
include schema-ready conversion helpers, but ArcLM does not claim full MCP
client/server support or network transport in this phase.

## Structured Output

`Agent.output_schema` may contain a JSON-schema-like dictionary. The runner
validates final JSON only when the model response explicitly sets
`metadata={"structured_output": True}`. Natural-language text is not silently
parsed as trusted JSON.

## Capability Status

`get_agent_capabilities()` reports tools, sessions, async, approvals, tracing,
web reading, speech-to-text, resources, and structured output with explicit
statuses such as `available`, `optional`, `experimental`, and `unsupported`.

## Optional Dependencies

- `arclm[agents]`: base runtime, no additional dependency.
- `arclm[agents-web]`: currently standard-library only.
- `arclm[agents-audio]`: optional Whisper integration.
- `arclm[agents-all]`: all agent integrations.

## Security And Limits

The runtime does not include shell execution, arbitrary Python execution,
`eval`, `exec`, unrestricted filesystem access, browser automation, file
deletion, file writing tools, credential access, databases, vector memory,
multi-agent orchestration, or autonomous background jobs.

Examples are in `examples/agents/` and run offline by default.
