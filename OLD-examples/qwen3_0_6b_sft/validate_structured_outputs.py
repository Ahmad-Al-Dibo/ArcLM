"""Validate generated structured JSON outputs for the Qwen3 SFT example."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

EXAMPLE_DIR = Path(__file__).resolve().parent
DEFAULT_OUTPUT = EXAMPLE_DIR / "output" / "finetuned_outputs.jsonl"
REQUIRED_KEYS = ("task", "answer", "confidence", "tags")


def main():
    parser = argparse.ArgumentParser(description="Validate Qwen structured JSON outputs.")
    parser.add_argument("--outputs", default=str(DEFAULT_OUTPUT))
    args = parser.parse_args()

    rows = list(read_jsonl_required(Path(args.outputs)))
    results = [validate_row(row) for row in rows]
    failed = [result for result in results if not result["valid"]]

    for result in results:
        status = "ok" if result["valid"] else "failed"
        print(f"{result['id']}: {status}")
        for error in result["errors"]:
            print(f"  - {error}")

    if failed:
        raise SystemExit(f"{len(failed)} structured outputs failed validation.")
    print(f"All {len(results)} structured outputs passed validation.")


def validate_row(row: dict[str, object]) -> dict[str, object]:
    output_id = str(row.get("id", "unknown"))
    text = str(row.get("generated_text", ""))
    errors: list[str] = []

    try:
        parsed = json.loads(text)
    except json.JSONDecodeError:
        return {"id": output_id, "valid": False, "errors": ["generated_text is not valid JSON"]}

    if not isinstance(parsed, dict):
        return {"id": output_id, "valid": False, "errors": ["generated JSON is not an object"]}

    for key in REQUIRED_KEYS:
        if key not in parsed:
            errors.append(f"missing key: {key}")

    if not isinstance(parsed.get("answer"), str) or not parsed.get("answer", "").strip():
        errors.append("answer must be a non-empty string")
    if parsed.get("confidence") not in {"low", "medium", "high"}:
        errors.append("confidence must be low, medium, or high")
    if not isinstance(parsed.get("tags"), list) or not all(isinstance(tag, str) for tag in parsed.get("tags", [])):
        errors.append("tags must be a list of strings")

    return {"id": output_id, "valid": not errors, "errors": errors}


def read_jsonl_required(path: Path):
    if not path.exists():
        raise SystemExit(
            f"Missing output file: {path}\n"
            "Run test_finetuned_model.py first."
        )
    with path.open("r", encoding="utf-8") as handle:
        for line in handle:
            if line.strip():
                yield json.loads(line)


if __name__ == "__main__":
    main()
