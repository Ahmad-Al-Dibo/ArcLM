"""Provider-independent speech-to-text abstraction."""

from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path
from typing import Protocol

from .errors import OptionalAgentDependencyError


SUPPORTED_AUDIO_EXTENSIONS = {".wav", ".mp3", ".m4a", ".flac", ".ogg"}


@dataclass(frozen=True)
class TranscriptionRequest:
    """Speech-to-text request."""

    audio_path: Path
    language: str | None = None
    translate: bool = False
    max_bytes: int = 50_000_000


@dataclass(frozen=True)
class TranscriptionResult:
    """Structured speech-to-text result."""

    text: str
    language: str | None = None
    duration_seconds: float | None = None
    segments: list[dict[str, object]] = field(default_factory=list)
    metadata: dict[str, object] = field(default_factory=dict)

    def to_dict(self) -> dict[str, object]:
        return {
            "text": self.text,
            "language": self.language,
            "duration_seconds": self.duration_seconds,
            "segments": list(self.segments),
            "metadata": dict(self.metadata),
        }


class SpeechToTextBackend(Protocol):
    """Protocol for speech-to-text backends."""

    def transcribe(self, request: TranscriptionRequest) -> TranscriptionResult:
        """Transcribe a bounded local audio file."""


class FakeSpeechToTextBackend:
    """Deterministic backend for tests and examples."""

    def __init__(self, text: str = "Hello ArcLM", language: str = "en") -> None:
        self.text = text
        self.language = language

    def transcribe(self, request: TranscriptionRequest) -> TranscriptionResult:
        validate_audio_request(request)
        return TranscriptionResult(text=self.text, language=request.language or self.language)


def validate_audio_request(request: TranscriptionRequest) -> None:
    """Validate audio boundaries before backend execution."""

    path = Path(request.audio_path)
    if path.suffix.lower() not in SUPPORTED_AUDIO_EXTENSIONS:
        raise ValueError("unsupported audio format")
    if path.exists() and path.stat().st_size > request.max_bytes:
        raise ValueError("audio input is too large")


def missing_speech_backend() -> None:
    """Raise the standard optional dependency error for unavailable STT backends."""

    raise OptionalAgentDependencyError("speech-to-text backend is unavailable")
