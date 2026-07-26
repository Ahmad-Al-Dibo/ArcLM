"""
ArcLM Example: First ArcLM Workflow

This example demonstrates loading records, building a tokenizer, creating a
tiny native ArcLM model, and running one forward pass.

Requirements:
    pip install -e .

Run:
    python examples/00_quick_start/01_first_arclm_workflow.py

Expected runtime:
    Under 10 seconds on CPU.
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
    records = load_dataset(DATA_RECORDS)
    text = " ".join(row["text"] for row in records)
    tokenizer = Tokenizer(max_vocab=48)
    tokenizer.build(text)
    model = ArcLM(vocab_size=tokenizer.get_vocab_size(), embed_dim=16, block_size=8, num_blocks=1)
    token_ids = tokenizer.encode_text(records[0]["text"])[:8]
    logits = model(torch.tensor([token_ids], dtype=torch.long))
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

