"""
ArcLM Example: Local Website Dataset

What you'll learn
-----------------
- Extract readable text from a local HTML file with a stdlib HTML parser
- Turn the extracted chunks into validated dataset records and a report

When to use this
----------------
- Building text corpora from saved web pages offline; no network access
  or `[web]` extra is required

Requirements
------------
    pip install arclm

Run
---
    python examples/01_data/02_local_website_dataset.py

Expected output
---------------
    output path: .../examples/assets/websites/product_page.html
    {
      "records": 4,
      "texts": ["ArcLM Local Studio", "..."],
      "tokens": 27
    }

Runtime
-------
    Under 5 seconds on CPU.
"""

from __future__ import annotations

import json
from html.parser import HTMLParser
from pathlib import Path

from arclm.datasets import build_dataset_report, validate_records
from arclm.tokenizers import Tokenizer


def asset_path(*parts: str) -> Path:
    return Path(__file__).resolve().parents[1] / "assets" / Path(*parts)


def print_json(value) -> None:
    print(json.dumps(value, indent=2, sort_keys=True, default=str))


class TextExtractor(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.skip = False
        self.parts: list[str] = []

    def handle_starttag(self, tag, attrs):
        self.skip = tag in {"nav", "footer", "script", "style"}

    def handle_endtag(self, tag):
        if tag in {"nav", "footer", "script", "style"}:
            self.skip = False

    def handle_data(self, data):
        text = " ".join(data.split())
        if text and not self.skip:
            self.parts.append(text)


def main() -> None:
    # --- 1. Parse local HTML into text chunks ---
    html = asset_path("websites", "product_page.html").read_text(encoding="utf-8")
    print(f"output path: {asset_path('websites', 'product_page.html')}")
    parser = TextExtractor()
    parser.feed(html)
    records = [{"id": f"web-{index}", "text": text} for index, text in enumerate(parser.parts, start=1)]

    # --- 2. Validate records and build tokenizer ---
    validation = validate_records(records, required_fields=("id", "text"), strict=False)
    tokenizer = Tokenizer(max_vocab=64)
    tokenizer.build(" ".join(row["text"] for row in validation.valid_records))

    # --- 3. Print the dataset report ---
    report = build_dataset_report(validation.valid_records, tokenizer=tokenizer, text_fields=("text",), validation_result=validation)
    print_json({"records": validation.valid_count, "tokens": report.token_count, "texts": [row["text"] for row in validation.valid_records]})


if __name__ == "__main__":
    main()
