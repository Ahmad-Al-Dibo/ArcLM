# ArcLM Agent Runtime Examples

Run from the project root:

```bash
python examples/agents/01_custom_tool.py
```

All examples are offline by default and use deterministic fake adapters unless
they explicitly say otherwise.

- `01_custom_tool.py`: create a typed tool and see schema, direct invocation, and invalid-argument handling.
- `02_tool_registry.py`: register and filter tools with deterministic ordering.
- `03_basic_agent.py`: run one fake-model tool loop without API keys.
- `04_markdown_agent.py`: convert Markdown to structured content through a tool.
- `05_webpage_reader_agent.py`: read mocked HTML safely. Real network use is not enabled by default.
- `06_voice_note_agent.py`: use the fake speech-to-text backend. Real Whisper requires `arclm[agents-audio]`.
- `07_structured_output_agent.py`: validate final JSON only when the model marks it structured.
- `08_arc_model_adapter.py`: wrap an ArcLM-style generation callable with the strict JSON protocol.

These examples do not demonstrate autonomous agents, browser automation,
long-term memory, or universal native-model tool calling.
