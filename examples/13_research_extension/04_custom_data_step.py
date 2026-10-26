"""
ArcLM Research Example: Custom Data Pipeline Step

What you'll learn
-----------------
- Subclass BaseDataStep and plug into DataPipeline
- Research-specific cleaning without forking datasets package
- Stay on the light install (no torch)

When to use this
----------------
- Custom corpus filters for a paper experiment
- Teaching pipeline composition

Requirements
------------
    pip install arclm

Run
---
    python examples/13_research_extension/04_custom_data_step.py

Expected output
---------------
    JSON with counts before/after custom filters

Runtime
-------
    Under 5 seconds on CPU.
"""

from __future__ import annotations

import json
import re

from arclm.datasets import DataPipeline, load_dataset, validate_records
from arclm.datasets.base import BaseDataStep


class DropShortDocuments(BaseDataStep):
    """Research step: drop records shorter than min_chars."""

    def __init__(self, min_chars: int = 20):
        self.min_chars = min_chars
        self.dropped = 0

    def process(self, example: dict) -> dict | None:
        text = str(example.get("text", ""))
        if len(text.strip()) < self.min_chars:
            self.dropped += 1
            return None
        return example


class KeepOnlyAlphabetHeadlines(BaseDataStep):
    """Research step: keep records whose text starts with a capital letter."""

    def __init__(self):
        self.kept = 0

    def process(self, example: dict) -> dict | None:
        text = str(example.get("text", "")).strip()
        if text[:1].isupper():
            self.kept += 1
            return example
        return None


def main() -> None:
    records = [
        {"text": "ArcLM research pipelines compose data steps without torch."},
        {"text": "tiny"},
        {"text": "lowercase start should be dropped by headline filter"},
        {"text": "Custom filters keep experiments reproducible and explicit."},
    ]

    loaded = load_dataset([dict(r) for r in records])
    vr = validate_records(loaded, required_fields=["text"])
    short = DropShortDocuments(min_chars=20)
    headlines = KeepOnlyAlphabetHeadlines()
    pipeline = DataPipeline([short, headlines])
    processed = pipeline.run(loaded)

    # pipeline.run may return list or (list, report) depending on version
    if isinstance(processed, tuple):
        out = processed[0]
    else:
        out = processed

    print(
        json.dumps(
            {
                "input": len(records),
                "valid": vr.valid_count,
                "dropped_short": short.dropped,
                "output": len(out),
                "sample": out[0]["text"][:60] if out else None,
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
