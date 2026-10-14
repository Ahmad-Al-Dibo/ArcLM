"""
ArcLM Example: Save and Load Model State

What you'll learn
-----------------
- Save a native ArcLM state dict to disk with `torch.save`
- Reload weights into a freshly constructed model with the same config

When to use this
----------------
- Persisting a trained model between sessions; the destination model must
  match the source architecture exactly

Requirements
------------
    pip install "arclm[train]"

Run
---
    python examples/03_models/02_save_and_load_state.py

Expected output
---------------
    {
      "parameters": 1120,
      "saved_name": "weights.pt",
      "training_mode": false
    }

Runtime
-------
    Under 5 seconds on CPU.
"""

from __future__ import annotations

import json
import tempfile
from pathlib import Path

import torch

from arclm.models import ArcLM


def print_json(value) -> None:
    print(json.dumps(value, indent=2, sort_keys=True, default=str))


def main() -> None:
    # --- 1. Save model weights to a temporary file ---
    model = ArcLM(vocab_size=16, embed_dim=8, block_size=4, num_blocks=1)
    with tempfile.TemporaryDirectory(prefix="arclm-model-state-") as tmpdir:
        tmp = Path(tmpdir)
        path = tmp / "weights.pt"
        torch.save(model.state_dict(), path)

        # --- 2. Reload into a fresh model and switch to eval mode ---
        reloaded = ArcLM(vocab_size=16, embed_dim=8, block_size=4, num_blocks=1)
        reloaded.load_state_dict(torch.load(path, map_location="cpu", weights_only=True))
        reloaded.eval()
        print_json({"saved_name": path.name, "training_mode": reloaded.training, "parameters": sum(p.numel() for p in reloaded.parameters())})


if __name__ == "__main__":
    main()
