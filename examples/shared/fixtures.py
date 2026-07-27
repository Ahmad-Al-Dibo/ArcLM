"""Small synthetic fixtures for examples."""

from __future__ import annotations

import json
from pathlib import Path


CORPUS = (
    "ArcLM trains tiny native language models on local data. "
    "Local examples stay small, bounded, and inspectable. "
    "Tiny models help developers understand tokenization training evaluation generation."
)

DATA_RECORDS = [
    {"id": "doc-1", "text": "ArcLM loads local records for tiny experiments."},
    {"id": "doc-2", "text": "Tokenizers convert text into repeatable token ids."},
    {"id": "doc-3", "text": "Evaluation reports summarize local model behavior."},
]

SFT_RECORDS = [
    {"instruction": "What is ArcLM?", "response": "ArcLM is a compact local language-model toolkit."},
    {"instruction": "Why use tiny examples?", "response": "Tiny examples are fast, inspectable, and safe."},
]


def write_jsonl(path: Path, records: list[dict[str, str]]) -> Path:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("\n".join(json.dumps(row) for row in records) + "\n", encoding="utf-8")
    return path

