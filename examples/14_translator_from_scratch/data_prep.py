"""Load parallel pairs and build causal-LM training examples.

Format: "translate EN to NL: <source> > <target>"
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from arclm.datasets import load_dataset, validate_records


def load_pairs(path: Path) -> list[dict[str, str]]:
    records = load_dataset(str(path))
    result = validate_records(records, required_fields=["src", "tgt"])
    if result.valid_count != len(records):
        raise ValueError(
            f"invalid pairs: {len(records) - result.valid_count} of {len(records)}"
        )
    return [{"src": str(r["src"]), "tgt": str(r["tgt"])} for r in records]


def format_prompt(src: str, source_lang: str, target_lang: str) -> str:
    return f"translate {source_lang} to {target_lang}: {src} >"


def format_example(pair: dict[str, str], source_lang: str, target_lang: str) -> str:
    return (
        f"translate {source_lang} to {target_lang}: "
        f"{pair['src']} > {pair['tgt']}"
    )


def build_training_text(pairs: list[dict[str, str]], source_lang: str, target_lang: str) -> str:
    lines = [
        format_example(p, source_lang, target_lang) for p in pairs
    ]
    return "\n".join(lines)


def write_training_file(
    pairs: list[dict[str, str]],
    path: Path,
    source_lang: str,
    target_lang: str,
) -> Path:
    text = build_training_text(pairs, source_lang, target_lang)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text + "\n", encoding="utf-8")
    return path


def save_pairs(pairs: list[dict[str, str]], path: Path) -> None:
    with path.open("w", encoding="utf-8") as f:
        for p in pairs:
            f.write(json.dumps(p, ensure_ascii=False) + "\n")
