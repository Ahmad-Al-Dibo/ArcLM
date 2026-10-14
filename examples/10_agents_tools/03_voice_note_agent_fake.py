"""
ArcLM Example: Voice Note Agent with Fake Backend

What you'll learn
-----------------
- Exercise speech-to-text code offline with FakeSpeechToTextBackend
- Build a TranscriptionRequest around a temporary audio file
- Parse a transcript into simple follow-up tasks

When to use this
----------------
- CI or local tests where audio downloads or speech models are unavailable

Requirements
------------
    pip install arclm

Run
---
    python examples/10_agents_tools/03_voice_note_agent_fake.py

Expected output
---------------
    "backend": "FakeSpeechToTextBackend"
    "transcript": "Review ArcLM examples and write two follow-up tasks."

Runtime
-------
    Under 5 seconds on CPU.
"""

from __future__ import annotations

import json
from tempfile import TemporaryDirectory
from pathlib import Path

from arclm.agents import FakeSpeechToTextBackend, TranscriptionRequest


# --- 1. Pretty-print helper ---
def print_json(value) -> None:
    print(json.dumps(value, indent=2, sort_keys=True, default=str))


# --- 2. Transcribe a synthetic audio file ---
def main() -> None:
    backend = FakeSpeechToTextBackend(text="Review ArcLM examples and write two follow-up tasks.")
    with TemporaryDirectory() as temp_dir:
        audio_path = Path(temp_dir) / "note.wav"
        audio_path.write_bytes(b"synthetic-audio")
        result = backend.transcribe(TranscriptionRequest(audio_path=audio_path))
    tasks = [item.strip() for item in result.text.replace("and", ",").split(",") if item.strip()]
    print_json({"backend": type(backend).__name__, "transcript": result.text, "tasks": tasks})


if __name__ == "__main__":
    main()
