"""Simpele tokenstatistieken voor whitespace tokenization."""

from __future__ import annotations

from collections import Counter
from typing import Iterable, Dict, Any


def whitespace_token_stats(texts: Iterable[str], top_k: int = 50) -> Dict[str, Any]:
    """Telt whitespace tokens en geeft de meest voorkomende tokens terug."""
    vocab = Counter()
    total_tokens = 0
    for text in texts:
        tokens = text.split()
        total_tokens += len(tokens)
        vocab.update(tokens)
    return {
        "total_tokens": total_tokens,
        "vocab_size": len(vocab),
        "top_tokens": vocab.most_common(top_k),
    }
