"""Project settings for the from-scratch translator demo."""

from __future__ import annotations

from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent
DATA_PATH = PROJECT_ROOT / "data" / "en_nl_pairs.jsonl"
WORK_DIR = PROJECT_ROOT / "artifacts"

# Source → target language labels used in prompts
SOURCE_LANG = "english"
TARGET_LANG = "dutch"

# Tiny model (educational, CPU, seconds)
EMBED_DIM = 32
BLOCK_SIZE = 48
NUM_BLOCKS = 2
MAX_VOCAB = 512
NUM_EPOCHS = 8
BATCH_SIZE = 4
LEARNING_RATE = 5e-3
DEVICE = "cpu"
SEED = 42

CHECKPOINT_PATH = WORK_DIR / "translator_tiny.pt"
CONFIG_PATH = WORK_DIR / "translator_config.json"


def ensure_workdir() -> Path:
    WORK_DIR.mkdir(parents=True, exist_ok=True)
    return WORK_DIR
