"""Use the provider-independent speech-to-text abstraction."""

from pathlib import Path

from arclm.agents import FakeSpeechToTextBackend, TranscriptionRequest


if __name__ == "__main__":
    backend = FakeSpeechToTextBackend(text="Remember to test ArcLM agents.")
    request = TranscriptionRequest(audio_path=Path("voice-note.wav"), language="en")
    result = backend.transcribe(request)
    print(result.to_dict())
    print("Optional Whisper requires arclm[agents-audio] and an explicit local model/download decision.")
