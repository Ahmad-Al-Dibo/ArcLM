"""
ArcLM Example: Checkpoint Lifecycle

What you'll learn
-----------------
- Build a versioned ArcLM training checkpoint payload and save it atomically
- Reload a checkpoint safely with explicit map location
- Inspect checkpoint metadata (format, version, model state) without leaking absolute paths

When to use this
----------------
- When adding or debugging checkpoint save/load logic, or verifying a training
  artifact before wiring it into a longer training run.

Requirements
------------
    pip install "arclm[train]"

Run
---
    python examples/06_checkpoints/01_checkpoint_lifecycle.py

Expected output
---------------
    {
      "file": "training.pt",
      "format": "arclm-training-checkpoint",
      "has_model_state": true,
      "version": 1
    }

Runtime
-------
    Under 10 seconds on CPU.
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
    # --- 1. Build a minimal model and checkpoint payload ---
    model = ArcLM(vocab_size=16, embed_dim=8, block_size=4, num_blocks=1)
    payload = {
        "checkpoint_format": CHECKPOINT_FORMAT,
        "checkpoint_version": CHECKPOINT_VERSION,
        "model_state_dict": model.state_dict(),
        "optimizer_state_dict": {},
        "training_state": {"epoch": 0, "global_step": 0, "optimizer_step": 0},
        "config": {"vocab_size": 16, "embed_dim": 8, "block_size": 4, "num_blocks": 1},
    }

    # --- 2. Save atomically, then safely reload ---
    with tempfile.TemporaryDirectory(prefix="arclm-checkpoint-") as tmpdir:
        tmp = Path(tmpdir)
        path = atomic_save_checkpoint(payload, tmp / "checkpoint")
        loaded = safe_load_training_checkpoint(path, map_location=torch.device("cpu"))

        # --- 3. Inspect metadata and report ---
        info = inspect_checkpoint(path)
        print_json({"file": path.name, "format": loaded["checkpoint_format"], "version": loaded["checkpoint_version"], "has_model_state": info.has_model_state})


if __name__ == "__main__":
    main()
