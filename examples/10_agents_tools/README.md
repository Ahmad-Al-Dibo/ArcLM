# 10 Agents and Tools

Purpose: demonstrate the current ArcLM Agent Runtime with deterministic fake
models and safe local resources.

Prerequisites: base ArcLM installation.

Concepts: typed tools, fake model adapters, bounded document reading, fake
speech-to-text, redaction, and trace safety.

Examples in order:
- `01_custom_tool_agent.py`
- `02_secure_document_agent.py`
- `03_voice_note_agent_fake.py`

Installation requirements: none for verified examples. Real speech-to-text is
optional/manual.

Commands:

```powershell
python examples/10_agents_tools/01_custom_tool_agent.py
python examples/10_agents_tools/02_secure_document_agent.py
python examples/10_agents_tools/03_voice_note_agent_fake.py
```

Expected outputs: final Agent response and safe trace summaries.

Verification status: automated with fake backend.

Current limitations: no API keys, network tools, or real model tool-calling are
required or claimed.

Related ArcLM APIs: `Agent`, `AgentRunner`, `tool`, `FakeSpeechToTextBackend`,
Security redaction helpers.

Next category: `11_security`.

