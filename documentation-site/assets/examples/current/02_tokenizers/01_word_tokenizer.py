"""
ArcLM Example: Word Tokenizer

This example builds, saves, reloads, and measures coverage for the native word
tokenizer.
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
    tokenizer = Tokenizer(max_vocab=32, user_defined_symbols=["<task>"])
    tokenizer.build(CORPUS)
    ids = tokenizer.encode_text("ArcLM local unknown-token")
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

