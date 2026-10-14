"""
ArcLM Example: Tiny Pre-Training Step

What you'll learn
-----------------
- Prepare next-token pairs from tokenized local text
- Run one AdamW optimizer step and compare loss before and after

When to use this
----------------
- Minimal reference for the core pre-training loop: forward pass,
  cross-entropy loss, backward pass, and optimizer update

Requirements
------------
    pip install "arclm[train]"

Run
---
    python examples/04_training/01_tiny_pretraining_step.py

Expected output
---------------
    {
      "after_one_step_loss": 2.6791,
      "initial_loss": 3.0686,
      "tokens": 25
    }

Runtime
-------
    Under 5 seconds on CPU.
"""

from __future__ import annotations

import json
import torch

from arclm.models import ArcLM
from arclm.tokenizers import Tokenizer


CORPUS = (
    "ArcLM trains tiny native language models on local data. "
    "Local examples stay small bounded and inspectable. "
    "Tiny models help developers understand tokenization training evaluation generation."
)


def print_json(value) -> None:
    print(json.dumps(value, indent=2, sort_keys=True, default=str))


def main() -> None:
    # --- 1. Seed RNG and prepare next-token pairs ---
    torch.manual_seed(7)
    tokenizer = Tokenizer(max_vocab=48)
    tokenizer.build(CORPUS)
    ids = tokenizer.encode_text(CORPUS)
    block_size = 8
    x = torch.tensor([ids[:block_size]], dtype=torch.long)
    y = torch.tensor([ids[1 : block_size + 1]], dtype=torch.long)

    # --- 2. Build model and take one AdamW step ---
    model = ArcLM(vocab_size=tokenizer.get_vocab_size(), embed_dim=16, block_size=block_size, num_blocks=1)
    optimizer = torch.optim.AdamW(model.parameters(), lr=1e-2)
    logits = model(x)
    first_loss = torch.nn.functional.cross_entropy(logits.reshape(-1, logits.size(-1)), y.reshape(-1))
    first_loss.backward()
    optimizer.step()
    optimizer.zero_grad()

    # --- 3. Re-evaluate loss and print summary ---
    second_logits = model(x)
    second_loss = torch.nn.functional.cross_entropy(second_logits.reshape(-1, second_logits.size(-1)), y.reshape(-1))
    print_json({"initial_loss": round(float(first_loss.detach()), 4), "after_one_step_loss": round(float(second_loss.detach()), 4), "tokens": len(ids)})


if __name__ == "__main__":
    main()
