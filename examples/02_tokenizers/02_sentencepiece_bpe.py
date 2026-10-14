"""
ArcLM Example: SentencePiece BPE Tokenizer

What you'll learn
-----------------
- Train a tiny SentencePiece BPE tokenizer entirely on local text
- Encode and decode a sample sentence with the trained model

When to use this
----------------
- Subword tokenization for datasets with morphology or rare words that a
  word tokenizer would map to unknown tokens

Requirements
------------
    pip install arclm

Run
---
    python examples/02_tokenizers/02_sentencepiece_bpe.py

Expected output
---------------
    {
      "decoded": "ArcLM local to \\u2047 eni \\u2047 ation",
      "ids": [8, 28, 25, ...],
      "vocab_size": 32
    }
    (SentencePiece trainer logs are printed to stderr.)

Runtime
-------
    Under 5 seconds on CPU.
"""

from __future__ import annotations

import json

from arclm.tokenizers import SentencePieceTokenizer


CORPUS = (
    "ArcLM trains tiny native language models on local data. "
    "Local examples stay small bounded and inspectable."
)


def print_json(value) -> None:
    print(json.dumps(value, indent=2, sort_keys=True, default=str))


def main() -> None:
    # --- 1. Train a tiny BPE tokenizer on local text ---
    tokenizer = SentencePieceTokenizer(max_vocab=32, model_type="bpe")
    tokenizer.build(CORPUS)

    # --- 2. Encode and decode a sample sentence ---
    ids = tokenizer.encode_text("ArcLM local tokenization")
    print_json({"vocab_size": tokenizer.get_vocab_size(), "ids": ids, "decoded": tokenizer.decode_string(ids)})


if __name__ == "__main__":
    main()
