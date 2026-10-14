"""
ArcLM Example: Preview SFT Data

What you'll learn
-----------------
- Build a character-level tokenizer and validate instruction/response SFT records
- See the canonical formatted text a fine-tuning run will consume
- Understand response-only label masks (prompt tokens are ignored during training)

When to use this
----------------
- Before starting any fine-tuning run, to verify record formatting, truncation,
  and which tokens will actually be trained.

Requirements
------------
    pip install "arclm[train]"

Run
---
    python examples/05_finetuning/01_preview_sft_data.py

Expected output
---------------
    {
      "formatted_text": "Instruction: What is ArcLM?\\nResponse: ArcLM is a compact local language-model toolkit.",
      "label_mask": ["ignore", "ignore", ..., "train", "train"],
      "sequence_length": 12,
      "valid_records": 2
    }

Runtime
-------
    Under 5 seconds on CPU.
"""

from __future__ import annotations

import json

from arclm.finetuning import FineTuningConfig, prepare_fine_tuning_record, validate_sft_records
from arclm.tokenizers import Tokenizer


CORPUS = "ArcLM is a compact local toolkit. Tiny examples are fast and safe."
SFT_RECORDS = [
    {"instruction": "What is ArcLM?", "response": "ArcLM is a compact local language-model toolkit."},
    {"instruction": "Why use tiny examples?", "response": "Tiny examples are fast, inspectable, and safe."},
]


def print_json(value) -> None:
    print(json.dumps(value, indent=2, sort_keys=True, default=str))


def main() -> None:
    # --- 1. Build tokenizer and fine-tuning config ---
    tokenizer = Tokenizer(max_vocab=64)
    tokenizer.build(CORPUS + " " + " ".join(row["instruction"] + " " + row["response"] for row in SFT_RECORDS))
    config = FineTuningConfig(max_sequence_length=32, train_on_prompt=False)

    # --- 2. Validate records and prepare the first example ---
    validation = validate_sft_records(SFT_RECORDS, config, strict=False)
    prepared = prepare_fine_tuning_record(SFT_RECORDS[0], tokenizer, config)

    # --- 3. Print the preview ---
    print_json({"valid_records": validation.valid_count, "formatted_text": prepared.formatted_text, "label_mask": prepared.label_mask, "sequence_length": prepared.sequence_length})


if __name__ == "__main__":
    main()
