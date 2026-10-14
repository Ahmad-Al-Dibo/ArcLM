"""
ArcLM Complete Project: Model Benchmark Lab

What you'll learn
-----------------
- Evaluate two tiny models on the same batch with loss, perplexity, and
  accuracy
- Use the Accuracy metric's update/compute API
- Compare variants in a single structured report

When to use this
----------------
- Baseline-comparing model variants before longer training runs

Requirements
------------
    pip install "arclm[train]"

Run
---
    python examples/12_complete_projects/05_model_benchmark_lab/main.py

Expected output
---------------
    "comparison_valid": true, "shared_vocab_size": 12
    model_a: "loss": 2.5923, "perplexity": 13.3608
    model_b: "loss": 3.0915, "perplexity": 22.0095

Runtime
-------
    Under 10 seconds on CPU.
"""

from __future__ import annotations

import json

import torch

from arclm.evaluation import Accuracy, calculate_perplexity
from arclm.models import ArcLM


def print_json(value) -> None:
    print(json.dumps(value, indent=2, sort_keys=True, default=str))


# --- 1. Seed and build two tiny models ---
def main() -> None:
    torch.manual_seed(5)
    model_a = ArcLM(vocab_size=12, embed_dim=8, block_size=4, num_blocks=1)
    model_b = ArcLM(vocab_size=12, embed_dim=8, block_size=4, num_blocks=1)
    x = torch.tensor([[1, 2, 3, 4]], dtype=torch.long)
    labels = torch.tensor([[2, 3, 4, 5]], dtype=torch.long)
    # --- 2. Evaluate both models on one batch ---
    rows = []
    for name, model in [("model_a", model_a), ("model_b", model_b)]:
        logits = model(x)
        loss = torch.nn.functional.cross_entropy(logits.reshape(-1, logits.size(-1)), labels.reshape(-1))
        metric = Accuracy()
        metric.update(predictions=logits, targets=labels)
        rows.append(
            {
                "name": name,
                "loss": round(float(loss.detach()), 4),
                "perplexity": round(calculate_perplexity(float(loss.detach())), 4),
                "accuracy": round(float(metric.compute()), 4),
            }
        )
    # --- 3. Print the comparison report ---
    print_json({"comparison_valid": True, "shared_vocab_size": 12, "results": rows})


if __name__ == "__main__":
    main()
