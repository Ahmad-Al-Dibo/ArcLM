"""
ArcLM Example: Preview SFT Data

This example uses the canonical fine-tuning preparation path to preview tokens
and response-only labels.
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
    tokenizer = Tokenizer(max_vocab=64)
    tokenizer.build(CORPUS + " " + " ".join(row["instruction"] + " " + row["response"] for row in SFT_RECORDS))
    config = FineTuningConfig(max_sequence_length=32, train_on_prompt=False)
    validation = validate_sft_records(SFT_RECORDS, config, strict=False)
    prepared = prepare_fine_tuning_record(SFT_RECORDS[0], tokenizer, config)
    print_json({"valid_records": validation.valid_count, "formatted_text": prepared.formatted_text, "label_mask": prepared.label_mask, "sequence_length": prepared.sequence_length})


if __name__ == "__main__":
    main()

