"""Optional Whisper speech-to-text integration."""

from __future__ import annotations

from pathlib import Path
from typing import Any

from arclm.agents.errors import OptionalAgentDependencyError
from arclm.agents.stt import TranscriptionRequest, TranscriptionResult, validate_audio_request


class WhisperSpeechToTextBackend:
    """Lazy Whisper backend.

    The backend never downloads models automatically. Pass an already loaded
    model object or set ``allow_model_download=True`` explicitly.
    """

    def __init__(
        self,
        *,
        model: Any | None = None,
        model_name: str = "base",
        allow_model_download: bool = False,
    ) -> None:
        self.model = model
        self.model_name = model_name
        self.allow_model_download = allow_model_download

    def transcribe(self, request: TranscriptionRequest) -> TranscriptionResult:
        validate_audio_request(request)
        model = self.model or self._load_model()
        task = "translate" if request.translate else "transcribe"
        result = model.transcribe(str(Path(request.audio_path)), language=request.language, task=task)
        segments = result.get("segments") or []
        return TranscriptionResult(
            text=str(result.get("text", "")).strip(),
            language=result.get("language", request.language),
            segments=[dict(segment) for segment in segments],
            metadata={"backend": "whisper"},
        )

    def _load_model(self) -> Any:
        if not self.allow_model_download:
            raise OptionalAgentDependencyError("Whisper model loading may download files; pass a loaded model or allow_model_download=True")
        try:
            import whisper  # type: ignore
        except ImportError as exc:
            raise OptionalAgentDependencyError("Install arclm[agents-audio] to use Whisper speech-to-text") from exc
        return whisper.load_model(self.model_name)
