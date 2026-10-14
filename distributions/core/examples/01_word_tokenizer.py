"""
ArcLM Example: Word Tokenizer

What you'll learn
-----------------
- Build the native word tokenizer, encode text, and measure unknown-word rate
- Save a tokenizer to JSON and reload it losslessly

When to use this
----------------
- Baseline tokenization for small corpora where whole words should map
  to ids and unknown words should be visible in coverage stats

Requirements
------------
    pip install arclm

Run
---
    python examples/02_tokenizers/01_word_tokenizer.py

Expected output
---------------
    {
      "decoded": "ArcLM local <UNK>",
      "ids": [2, 9, 0],
      "unknown_rate": 0.33,
      "vocab_size": 18
    }

Runtime
-------
    Under 5 seconds on CPU.
"""

from __future__ import annotations

import json
import tempfile

from arclm.tokenizers import Tokenizer


CORPUS = (
    "ArcLM trains tiny native language models on local data. "
    "Local examples stay small bounded and inspectable."
)


def print_json(value) -> None:
    print(json.dumps(value, indent=2, sort_keys=True, default=str))


def main() -> None:
    # --- 1. Build tokenizer and encode text containing an unknown word ---
    tokenizer = Tokenizer(max_vocab=32, user_defined_symbols=["<task>"])
    tokenizer.build(CORPUS)
    ids = tokenizer.encode_text("ArcLM local unknown-token")

    # --- 2. Save, reload, and compare results ---
    with tempfile.TemporaryDirectory(prefix="arclm-tokenizer-") as tmpdir:
        from pathlib import Path

        tmp = Path(tmpdir)
        path = tmp / "tokenizer.json"
        tokenizer.save(path)
        reloaded = Tokenizer.from_json(json.loads(path.read_text(encoding="utf-8")))
        print_json(
            {
                "vocab_size": tokenizer.get_vocab_size(),
                "ids": ids,
                "decoded": reloaded.decode_string(ids),
                "unknown_rate": tokenizer.analyze_coverage("ArcLM local unknown-token".split())["unknown_rate"],
            }
        )


if __name__ == "__main__":
    main()
