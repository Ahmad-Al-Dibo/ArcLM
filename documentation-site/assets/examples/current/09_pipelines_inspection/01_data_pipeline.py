"""
ArcLM Example: Data Pipeline

This example composes loading, validation, deduplication, tokenization, and a
dataset report with real ArcLM utilities.
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
    rows = DATA_RECORDS + [dict(DATA_RECORDS[0])]
    validation = validate_records(rows, required_fields=("id", "text"), strict=False)
    dedupe_result = deduplicate(validation.valid_records, field="text", return_result=True)
    deduped = dedupe_result.dataset
    tokenizer = Tokenizer(max_vocab=64)
    tokenizer.build(" ".join(row["text"] for row in deduped))
    report = build_dataset_report(deduped, tokenizer=tokenizer, text_fields=("text",), validation_result=validation, duplicates_removed=len(rows) - len(deduped))
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

