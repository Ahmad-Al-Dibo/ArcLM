"""
ArcLM Example: Voice Note Agent with Fake Backend

This example uses the fake speech-to-text backend so no audio model or download
is required.
"""

from __future__ import annotations

import json
from tempfile import TemporaryDirectory
from pathlib import Path

from arclm.agents import FakeSpeechToTextBackend, TranscriptionRequest


def print_json(value) -> None:
    print(json.dumps(value, indent=2, sort_keys=True, default=str))


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
