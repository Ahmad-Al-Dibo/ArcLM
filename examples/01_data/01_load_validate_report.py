"""
ArcLM Example: Load, Validate, and Report Data

This example demonstrates local records, schema validation, a dataset manifest,
and a tokenizer-aware report.
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
    rows = [
        json.loads(line)
        for line in asset_path("datasets", "tiny_records.jsonl").read_text(encoding="utf-8").splitlines()
        if line.strip()
    ]
    validation = validate_records(rows, required_fields=("id", "text"), strict=False)
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
    report = build_dataset_report(validation.valid_records, tokenizer=tokenizer, text_fields=("text",), validation_result=validation, manifest=manifest)
    print_json({"validation": validation.to_dict(), "report": report.to_dict()})


if __name__ == "__main__":
    main()
