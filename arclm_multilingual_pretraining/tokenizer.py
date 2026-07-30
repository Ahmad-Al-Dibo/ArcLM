from __future__ import annotations

from pathlib import Path
from typing import Any

from arclm.tokenizers import Tokenizer


class ArcLMTokenizer:
    """Thin wrapper around ArcLM's word tokenizer for multilingual text."""

    def __init__(self, max_vocab: int = 4096) -> None:
        self.max_vocab = max_vocab
        self._tokenizer = Tokenizer(max_vocab=max_vocab)

    def build(self, texts: list[str]) -> None:
        corpus = "\n".join(texts)
        self._tokenizer.build(corpus)

    def encode_text(self, text: str) -> list[int]:
        return self._tokenizer.encode_text(text)

    def decode(self, ids: list[int]) -> list[str]:
        return self._tokenizer.decode(ids)

    def decode_string(self, ids: list[int]) -> str:
        return self._tokenizer.decode_string(ids)

    def get_vocab_size(self) -> int:
        return self._tokenizer.get_vocab_size()

    def get_unknown_index(self) -> int:
        return self._tokenizer.get_unknown_index()

    def save(self, path: Path) -> None:
        path.parent.mkdir(parents=True, exist_ok=True)
        self._tokenizer.save_vocab(str(path))

    def load(self, path: Path) -> None:
        self._tokenizer.load_vocab(str(path))

    def to_json(self) -> dict[str, Any]:
        return self._tokenizer.to_json()
