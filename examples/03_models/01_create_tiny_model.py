"""
ArcLM Example: Create a Tiny Native Model

This example creates a native ArcLM model and runs a shape-checked forward pass.
"""

from __future__ import annotations

import json
import torch

from arclm.models import ArcLM, model_support_matrix


def print_json(value) -> None:
    print(json.dumps(value, indent=2, sort_keys=True, default=str))


def main() -> None:
    model = ArcLM(vocab_size=24, embed_dim=16, block_size=8, num_blocks=1)
    logits = model(torch.randint(0, 24, (2, 8)))
    parameters = sum(param.numel() for param in model.parameters())
    print_json({"model_class": type(model).__name__, "parameters": parameters, "logits_shape": list(logits.shape), "support_rows": len(model_support_matrix())})


if __name__ == "__main__":
    main()
