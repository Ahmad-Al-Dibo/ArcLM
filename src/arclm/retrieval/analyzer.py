"""Text analysis for lexical retrieval (torch-free)."""

from __future__ import annotations

import re
from typing import Iterable, Sequence

_PUNCT = re.compile(r"[^\w\s]", re.UNICODE)
_WS = re.compile(r"\s+")

# Small English stopword list — optional, off by default so users control it.
DEFAULT_STOPWORDS = frozenset(
    {
        "a", "an", "and", "are", "as", "at", "be", "but", "by", "for",
        "if", "in", "into", "is", "it", "no", "not", "of", "on", "or",
        "such", "that", "the", "their", "then", "there", "these", "they",
        "this", "to", "was", "will", "with",
    }
)


def analyze(
    text: str,
    *,
    lowercase: bool = True,
    strip_punct: bool = True,
    remove_stopwords: bool = False,
    stopwords: Iterable[str] | None = None,
) -> list[str]:
    """Tokenize *text* for lexical retrieval.

    Args:
        text: Input text.
        lowercase: Lowercase before splitting (default True — unlike
            ``arclm.tokenizers.Tokenizer`` which does not lowercase).
        strip_punct: Remove punctuation characters.
        remove_stopwords: Drop common stopwords.
        stopwords: Custom stopword set; defaults to a small English list.

    Returns:
        List of tokens (possibly empty).
    """
    if not text:
        return []
    s = text
    if lowercase:
        s = s.lower()
    if strip_punct:
        s = _PUNCT.sub(" ", s)
    s = _WS.sub(" ", s).strip()
    if not s:
        return []
    tokens = s.split(" ")
    if remove_stopwords:
        sw = set(stopwords) if stopwords is not None else set(DEFAULT_STOPWORDS)
        tokens = [t for t in tokens if t not in sw]
    return tokens


def analyze_batch(texts: Sequence[str], **kwargs) -> list[list[str]]:
    """Analyze a sequence of texts with the same options."""
    return [analyze(t, **kwargs) for t in texts]
