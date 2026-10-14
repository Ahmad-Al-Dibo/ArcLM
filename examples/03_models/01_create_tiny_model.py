"""
ArcLM Example: Create a Tiny Model

What you'll learn
-----------------
- Instantiate a native ArcLM model with explicit hyperparameters
- Run a shape-checked forward pass and count parameters

When to use this
----------------
- Understanding ArcLM's model constructor and verifying tensor shapes
  before wiring the model into a training loop

Requirements
------------
    pip install "arclm[train]"

Run
---
    python examples/03_models/01_create_tiny_model.py

Expected output
---------------
    {
      "logits_shape": [2, 8, 24],
      "model_class": "ArcLM",
      "parameters": 3960,
      "support_rows": 3
    }

Runtime
-------
    Under 5 seconds on CPU.
"""

from __future__ import annotations

import json
import torch

from arclm.models import ArcLM, model_support_matrix


def print_json(value) -> None:
    print(json.dumps(value, indent=2, sort_keys=True, default=str))


def main() -> None:
    # --- 1. Create a tiny model and run a shape-checked forward pass ---
    model = ArcLM(vocab_size=24, embed_dim=16, block_size=8, num_blocks=1)
    logits = model(torch.randint(0, 24, (2, 8)))

    # --- 2. Count parameters and report support-matrix size ---
    parameters = sum(param.numel() for param in model.parameters())
    print_json({"model_class": type(model).__name__, "parameters": parameters, "logits_shape": list(logits.shape), "support_rows": len(model_support_matrix())})


if __name__ == "__main__":
    main()
