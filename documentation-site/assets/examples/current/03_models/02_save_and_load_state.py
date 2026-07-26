"""
ArcLM Example: Save and Load Local Model State

This example saves a native ArcLM state dict to a temporary directory and
reloads it into a model with the same configuration.
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
    model = ArcLM(vocab_size=16, embed_dim=8, block_size=4, num_blocks=1)
    with tempfile.TemporaryDirectory(prefix="arclm-model-state-") as tmpdir:
        tmp = Path(tmpdir)
        path = tmp / "weights.pt"
        torch.save(model.state_dict(), path)
        reloaded = ArcLM(vocab_size=16, embed_dim=8, block_size=4, num_blocks=1)
        reloaded.load_state_dict(torch.load(path, map_location="cpu", weights_only=True))
        reloaded.eval()
        print_json({"saved_name": path.name, "training_mode": reloaded.training, "parameters": sum(p.numel() for p in reloaded.parameters())})


if __name__ == "__main__":
    main()

