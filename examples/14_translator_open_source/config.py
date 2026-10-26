"""Configuration for the open-source translator project."""

from __future__ import annotations

from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent
WORK_DIR = PROJECT_ROOT / "artifacts"

# Small multilingual instruct causal LM (download on first run).
# Override with TRANSLATOR_MODEL env var if needed.
MODEL_ID = "HuggingFaceTB/SmolLM2-135M-Instruct"
DEVICE = "cpu"
TRUST_REMOTE_CODE = False
MAX_NEW_TOKENS = 64
TEMPERATURE = 0.2

SOURCE_LANG = "English"
TARGET_LANG = "Dutch"

SAMPLES = [
    "Hello",
    "Thank you very much",
    "The weather is nice today",
    "Where is the train station?",
]


def ensure_workdir() -> Path:
    WORK_DIR.mkdir(parents=True, exist_ok=True)
    return WORK_DIR
