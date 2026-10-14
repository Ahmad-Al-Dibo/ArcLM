"""
ArcLM Example: Tiny SFT Step

What you'll learn
-----------------
- Prepare instruction/response records into tokenized SFT features with response-only labels
- Build a tiny native ArcLM model and run one supervised fine-tuning step
- Read the dataset report (valid records and trainable token count) alongside the loss

When to use this
----------------
- As a minimal, inspectable template for wiring ArcLM SFT data into a real training loop.

Requirements
------------
    pip install "arclm[train]"

Run
---
    python examples/05_finetuning/02_tiny_sft_step.py

Expected output
---------------
    {
      "loss": 3.3995,
      "records_valid": 2,
      "trainable_tokens": 14
    }

Runtime
-------
    Under 10 seconds on CPU.
"""

from __future__ import annotations

import json
import torch

from arclm.finetuning import FineTuningConfig, prepare_fine_tuning_dataset
from arclm.models import ArcLM
from arclm.tokenizers import Tokenizer


CORPUS = "ArcLM is a compact local toolkit. Tiny examples are fast and safe."
SFT_RECORDS = [
    {"instruction": "What is ArcLM?", "response": "ArcLM is a compact local language-model toolkit."},
    {"instruction": "Why use tiny examples?", "response": "Tiny examples are fast, inspectable, and safe."},
]


def print_json(value) -> None:
    print(json.dumps(value, indent=2, sort_keys=True, default=str))


def main() -> None:
    # --- 1. Build tokenizer and prepare the SFT dataset ---
    torch.manual_seed(11)
    tokenizer = Tokenizer(max_vocab=64)
    tokenizer.build(CORPUS + " " + " ".join(row["instruction"] + " " + row["response"] for row in SFT_RECORDS))
    config = FineTuningConfig(max_sequence_length=32, train_on_prompt=False)
    dataset = prepare_fine_tuning_dataset(SFT_RECORDS, tokenizer, config)

    # --- 2. Build model and tensors from the first feature ---
    feature = dataset[0]
    x = torch.tensor([feature["input_ids"]], dtype=torch.long)
    labels = torch.tensor([feature["labels"]], dtype=torch.long)
    model = ArcLM(vocab_size=tokenizer.get_vocab_size(), embed_dim=16, block_size=max(len(feature["input_ids"]), 4), num_blocks=1)

    # --- 3. Run one supervised fine-tuning step ---
    optimizer = torch.optim.AdamW(model.parameters(), lr=1e-2)
    logits = model(x)
    loss = torch.nn.functional.cross_entropy(logits.reshape(-1, logits.size(-1)), labels.reshape(-1), ignore_index=config.ignore_index)
    loss.backward()
    optimizer.step()

    # --- 4. Report dataset stats and loss ---
    print_json({"records_valid": dataset.report.records_valid, "trainable_tokens": dataset.report.trainable_tokens, "loss": round(float(loss.detach()), 4)})


if __name__ == "__main__":
    main()
