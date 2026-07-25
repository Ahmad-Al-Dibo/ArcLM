import os
import subprocess
import sys

import pytest

from arclm.agents import FakeSpeechToTextBackend, TranscriptionRequest
from arclm.agents.integrations.whisper import WhisperSpeechToTextBackend


def test_fake_speech_backend_returns_structured_result(tmp_path):
    audio = tmp_path / "note.wav"
    audio.write_bytes(b"RIFF")
    result = FakeSpeechToTextBackend("hello").transcribe(TranscriptionRequest(audio_path=audio))

    assert result.text == "hello"
    assert result.to_dict()["language"] == "en"


def test_whisper_backend_is_lazy_and_clear_without_loaded_model(tmp_path):
    audio = tmp_path / "note.wav"
    audio.write_bytes(b"RIFF")
    backend = WhisperSpeechToTextBackend()

    with pytest.raises(Exception, match="allow_model_download"):
        backend.transcribe(TranscriptionRequest(audio_path=audio))


def test_agent_import_boundary_does_not_import_optional_dependencies():
    code = """
import sys
import arclm
import arclm.agents
for name in ["transformers", "datasets", "peft", "accelerate", "bitsandbytes", "whisper", "fastapi", "flask", "uvicorn", "langchain", "openai", "anthropic"]:
    assert name not in sys.modules, name
"""
    env = dict(os.environ)
    env["PYTHONPATH"] = "src"
    result = subprocess.run([sys.executable, "-c", code], env=env, text=True, capture_output=True, check=False)

    assert result.returncode == 0, result.stderr
