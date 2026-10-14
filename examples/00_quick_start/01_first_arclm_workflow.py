"""
ArcLM Example: First ArcLM Workflow

What you'll learn
-----------------
- Load local text records, build a word tokenizer, and create a tiny ArcLM model
- Run one forward pass and inspect the output logits shape

When to use this
----------------
- First time using ArcLM; an end-to-end sanity check that data loading,
  tokenization, and model wiring all work together

Requirements
------------
    pip install "arclm[train]"

Run
---
    python examples/00_quick_start/01_first_arclm_workflow.py

Expected output
---------------
    {
      "input_tokens": 7,
      "logits_shape": [1, 7, 20],
      "records": 3,
      "vocab_size": 20
    }

Runtime
-------
    Under 5 seconds on CPU.
"""

from __future__ import annotations

import torch

from arclm.datasets import load_dataset
from arclm.models import ArcLM
from arclm.tokenizers import Tokenizer

import json


DATA_RECORDS = [
    {"id": "doc-1", "text": "ArcLM loads local records for tiny experiments."},
    {"id": "doc-2", "text": "Tokenizers convert text into repeatable token ids."},
    {"id": "doc-3", "text": "Evaluation reports summarize local model behavior."},
]


def print_json(value) -> None:
    print(json.dumps(value, indent=2, sort_keys=True, default=str))


def main() -> None:
    # --- 1. Load records and build tokenizer ---
    records = load_dataset(DATA_RECORDS)
    text = " ".join(row["text"] for row in records)
    tokenizer = Tokenizer(max_vocab=48)
    tokenizer.build(text)

    # --- 2. Create a tiny model and run one forward pass ---
    model = ArcLM(vocab_size=tokenizer.get_vocab_size(), embed_dim=16, block_size=8, num_blocks=1)
    token_ids = tokenizer.encode_text(records[0]["text"])[:8]
    logits = model(torch.tensor([token_ids], dtype=torch.long))

    # --- 3. Print a JSON summary ---
    print_json(
        {
            "records": len(records),
            "vocab_size": tokenizer.get_vocab_size(),
            "input_tokens": len(token_ids),
            "logits_shape": list(logits.shape),
        }
    )


if __name__ == "__main__":
    main()
