"""
ArcLM Example: Generation Sampling

What you'll learn
-----------------
- Run bounded local generation with the native ArcLM Generator
- Compare greedy decoding (top_k=1) against sampled decoding (temperature, top_k, top_p)
- Keep generation short and deterministic enough to inspect

When to use this
----------------
- When choosing sampling settings for a native model, or as a template for a
  minimal local generation script.

Requirements
------------
    pip install "arclm[train]"

Run
---
    python examples/08_inference_local_models/01_generation_sampling.py

Expected output
---------------
    {
      "greedy": "<UNK> data. tiny on",
      "sampled": "<UNK> <UNK> tiny trains",
      "max_new_tokens": 3
    }

Runtime
-------
    Under 10 seconds on CPU.
"""

from __future__ import annotations

import json
import torch

from arclm.inference import Generator
from arclm.models import ArcLM
from arclm.tokenizers import Tokenizer


CORPUS = "ArcLM trains tiny native language models on local data."


def print_json(value) -> None:
    print(json.dumps(value, indent=2, sort_keys=True, default=str))


def main() -> None:
    # --- 1. Build tokenizer and a tiny untrained model ---
    torch.manual_seed(3)
    tokenizer = Tokenizer(max_vocab=48)
    tokenizer.build(CORPUS)
    model = ArcLM(vocab_size=tokenizer.get_vocab_size(), embed_dim=16, block_size=8, num_blocks=1)

    # --- 2. Generate with greedy and sampled settings ---
    generator = Generator(model, tokenizer.stoi, tokenizer.itos, block_size=8, device="cpu", tokenizer=tokenizer)
    greedy = generator.generate_string("ArcLM", max_new_tokens=3, temperature=1.0, top_k=1)
    sampled = generator.generate_string("ArcLM", max_new_tokens=3, temperature=0.8, top_k=5, top_p=0.9)

    # --- 3. Report both generations ---
    print_json({"greedy": greedy, "sampled": sampled, "max_new_tokens": 3})


if __name__ == "__main__":
    main()
