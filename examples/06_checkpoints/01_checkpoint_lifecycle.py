"""
ArcLM Example: Checkpoint Lifecycle

This example creates a minimal trusted training checkpoint, validates it, and
inspects metadata without exposing absolute paths.
"""

from __future__ import annotations

import json
import tempfile
from pathlib import Path

import torch

from arclm.checkpoints.training import CHECKPOINT_FORMAT, CHECKPOINT_VERSION, atomic_save_checkpoint, inspect_checkpoint, safe_load_training_checkpoint
from arclm.models import ArcLM


def print_json(value) -> None:
    print(json.dumps(value, indent=2, sort_keys=True, default=str))


def main() -> None:
    model = ArcLM(vocab_size=16, embed_dim=8, block_size=4, num_blocks=1)
    payload = {
        "checkpoint_format": CHECKPOINT_FORMAT,
        "checkpoint_version": CHECKPOINT_VERSION,
        "model_state_dict": model.state_dict(),
        "optimizer_state_dict": {},
        "training_state": {"epoch": 0, "global_step": 0, "optimizer_step": 0},
        "config": {"vocab_size": 16, "embed_dim": 8, "block_size": 4, "num_blocks": 1},
    }
    with tempfile.TemporaryDirectory(prefix="arclm-checkpoint-") as tmpdir:
        tmp = Path(tmpdir)
        path = atomic_save_checkpoint(payload, tmp / "checkpoint")
        loaded = safe_load_training_checkpoint(path, map_location=torch.device("cpu"))
        info = inspect_checkpoint(path)
        print_json({"file": path.name, "format": loaded["checkpoint_format"], "version": loaded["checkpoint_version"], "has_model_state": info.has_model_state})


if __name__ == "__main__":
    main()
