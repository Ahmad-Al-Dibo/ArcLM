"""
ArcLM Example: Data Pipeline

What you'll learn
-----------------
- Validate raw records against required fields
- Deduplicate records by text field and count removals
- Tokenize the cleaned data and produce a dataset report summary

When to use this
----------------
- As a minimal template for the canonical load -> validate -> dedupe ->
  tokenize -> report path before training or evaluation.

Requirements
------------
    pip install "arclm[train]"

Run
---
    python examples/09_pipelines_inspection/01_data_pipeline.py

Expected output
---------------
    {
      "deduped_records": 3,
      "duplicates_removed": 1,
      "input_records": 4,
      "tokens": 20
    }

Runtime
-------
    Under 5 seconds on CPU.
"""

from __future__ import annotations

import json

from arclm.datasets import build_dataset_report, deduplicate, validate_records
from arclm.tokenizers import Tokenizer


DATA_RECORDS = [
    {"id": "doc-1", "text": "ArcLM loads local records for tiny experiments."},
    {"id": "doc-2", "text": "Tokenizers convert text into repeatable token ids."},
    {"id": "doc-3", "text": "Evaluation reports summarize local model behavior."},
]


def print_json(value) -> None:
    print(json.dumps(value, indent=2, sort_keys=True, default=str))


def main() -> None:
    # --- 1. Validate records (including one intentional duplicate) ---
    rows = DATA_RECORDS + [dict(DATA_RECORDS[0])]
    validation = validate_records(rows, required_fields=("id", "text"), strict=False)

    # --- 2. Deduplicate by text field ---
    dedupe_result = deduplicate(validation.valid_records, field="text", return_result=True)
    deduped = dedupe_result.dataset

    # --- 3. Tokenize and build the dataset report ---
    tokenizer = Tokenizer(max_vocab=64)
    tokenizer.build(" ".join(row["text"] for row in deduped))
    report = build_dataset_report(deduped, tokenizer=tokenizer, text_fields=("text",), validation_result=validation, duplicates_removed=len(rows) - len(deduped))

    # --- 4. Print the pipeline summary ---
    print_json(
        {
            "input_records": len(rows),
            "deduped_records": len(deduped),
            "duplicates_removed": dedupe_result.removed,
            "tokens": report.token_count,
        }
    )


if __name__ == "__main__":
    main()
