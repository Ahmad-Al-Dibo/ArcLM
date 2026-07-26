# ArcLM Agent Runtime Examples

Run from the project root:

```bash
python examples/agents/01_custom_tool.py
```

All examples are offline by default and use deterministic fake adapters unless
they explicitly say otherwise.

- `01_custom_tool.py`: purpose: create a typed tool; requirements: base ArcLM; expected behavior: schema, direct invocation, and invalid-argument result.
- `02_tool_registry.py`: purpose: register and filter tools; requirements: base ArcLM; expected behavior: deterministic registry listing.
- `03_basic_agent.py`: purpose: run one tool loop with a fake model; requirements: base ArcLM; expected behavior: model requests a tool, receives a result, then returns final text.
- `04_markdown_agent.py`: purpose: convert Markdown to structured content; requirements: base ArcLM; expected behavior: fake model asks for `markdown_to_document`.
- `05_webpage_reader_agent.py`: purpose: safe webpage reading; requirements: base ArcLM; expected behavior: mocked HTML is converted to text. Real network use requires explicit code changes.
- `06_voice_note_agent.py`: purpose: speech-to-text boundary; requirements: base ArcLM; expected behavior: fake transcription backend returns a transcript. Real Whisper requires `arclm[agents-audio]` and an explicit local model/download decision.
- `07_structured_output_agent.py`: purpose: final structured output validation; requirements: base ArcLM; expected behavior: model-marked JSON output is validated.
- `08_arc_model_adapter.py`: purpose: wrap an ArcLM-style generation callable; requirements: base ArcLM; expected behavior: strict JSON protocol accepts valid tool calls and rejects malformed output.

Limitations: these are teaching examples, not evidence of autonomous-agent,
browser automation, long-term memory, or universal native model tool-calling
support.
