from __future__ import annotations

from pathlib import Path


TINY_TEXT_RECORDS = [
    {"text": "Hello ArcLM"},
    {"text": "Data pipelines matter"},
    {"text": "Tokens become ids"},
]

TINY_SFT_RECORDS = [
    {"instruction": "Define tokenization", "response": "Tokenization converts text into tokens."},
    {"instruction": "Why validate data?", "response": "Validation prevents bad records from reaching training."},
]


def fixture_dir(challenge_file: str | Path) -> Path:
    """Return the fixture directory next to a challenge file."""

    return Path(challenge_file).resolve().parent / "fixtures"


def write_tiny_jsonl(path: str | Path) -> Path:
    """Write a tiny JSONL fixture to a caller-provided temporary path."""

    import json

    target = Path(path)
    with target.open("w", encoding="utf-8") as handle:
        for record in TINY_TEXT_RECORDS:
            handle.write(json.dumps(record) + "\n")
    return target

