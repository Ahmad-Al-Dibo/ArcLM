"""
ArcLM Example: Load, Validate, and Report Data

What you'll learn
-----------------
- Load JSONL records and validate them against required fields
- Attach a dataset manifest and build a tokenizer-aware quality report

When to use this
----------------
- Before training: audit a local dataset for invalid records, duplicates,
  token coverage, and basic statistics

Requirements
------------
    pip install arclm

Run
---
    python examples/01_data/01_load_validate_report.py

Expected output
---------------
    {
      "validation": {"total_records": 3, "valid_count": 3, "invalid_count": 0, ...},
      "report": {"record_count": 3, "token_count": 20, "unknown_token_rate": 0.0, ...}
    }

Runtime
-------
    Under 5 seconds on CPU.
"""

from __future__ import annotations

import json
from pathlib import Path

from arclm.datasets import build_dataset_report, create_dataset_manifest, validate_records
from arclm.tokenizers import Tokenizer


def asset_path(*parts: str) -> Path:
    return Path(__file__).resolve().parents[1] / "assets" / Path(*parts)


def print_json(value) -> None:
    print(json.dumps(value, indent=2, sort_keys=True, default=str))


def main() -> None:
    # --- 1. Load JSONL records ---
    rows = [
        json.loads(line)
        for line in asset_path("datasets", "tiny_records.jsonl").read_text(encoding="utf-8").splitlines()
        if line.strip()
    ]

    # --- 2. Validate against required fields ---
    validation = validate_records(rows, required_fields=("id", "text"), strict=False)

    # --- 3. Build a tokenizer and dataset manifest ---
    tokenizer = Tokenizer(max_vocab=64)
    tokenizer.build(" ".join(row["text"] for row in validation.valid_records))
    manifest = create_dataset_manifest(
        dataset_name="tiny_records",
        source_type="jsonl",
        records_before=len(rows),
        records_after=validation.valid_count,
        validation_result=validation,
        text_fields=("text",),
    )

    # --- 4. Build and print the dataset report ---
    report = build_dataset_report(validation.valid_records, tokenizer=tokenizer, text_fields=("text",), validation_result=validation, manifest=manifest)
    print_json({"validation": validation.to_dict(), "report": report.to_dict()})


if __name__ == "__main__":
    main()
