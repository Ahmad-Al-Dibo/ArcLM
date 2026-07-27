"""
ArcLM Example: SentencePiece BPE

This example trains a tiny local SentencePiece BPE tokenizer without downloads.
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
    tokenizer = SentencePieceTokenizer(max_vocab=32, model_type="bpe")
    tokenizer.build(CORPUS)
    ids = tokenizer.encode_text("ArcLM local tokenization")
    print_json({"vocab_size": tokenizer.get_vocab_size(), "ids": ids, "decoded": tokenizer.decode_string(ids)})


if __name__ == "__main__":
    main()

