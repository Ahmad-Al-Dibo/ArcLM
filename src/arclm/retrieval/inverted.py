"""Inverted index + TF-IDF search (torch-free)."""

from __future__ import annotations

import json
import math
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Callable, Iterable, Sequence

import numpy as np

from .analyzer import analyze
from .chunking import Chunk
from .metrics import top_k_indices


@dataclass
class SearchHit:
    """One ranked retrieval result."""

    text: str
    score: float
    doc_id: str = ""
    chunk_id: int = -1
    metadata: dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> dict[str, Any]:
        return {
            "text": self.text,
            "score": float(self.score),
            "doc_id": self.doc_id,
            "chunk_id": self.chunk_id,
            "metadata": dict(self.metadata),
        }


class InvertedIndex:
    """Term → postings (doc indices) with term frequencies.

    Shared building block for BM25 and TF-IDF. Documents are stored as
    pre-analyzed token lists.
    """

    def __init__(self) -> None:
        self.docs: list[list[str]] = []
        self.doc_len: list[int] = []
        self.df: dict[str, int] = {}
        self.tf: list[dict[str, int]] = []
        self._meta: list[dict[str, Any]] = []
        self._texts: list[str] = []

    def __len__(self) -> int:
        return len(self.docs)

    @property
    def avgdl(self) -> float:
        if not self.doc_len:
            return 0.0
        return sum(self.doc_len) / len(self.doc_len)

    def add(self, text: str, tokens: Sequence[str], metadata: dict[str, Any] | None = None) -> int:
        """Append one document; returns its internal id."""
        counts: dict[str, int] = {}
        for t in tokens:
            counts[t] = counts.get(t, 0) + 1
        doc_id = len(self.docs)
        self.docs.append(list(tokens))
        self.doc_len.append(len(tokens))
        self.tf.append(counts)
        self._texts.append(text)
        self._meta.append(dict(metadata or {}))
        for t in counts:
            self.df[t] = self.df.get(t, 0) + 1
        return doc_id

    def idf(self, term: str) -> float:
        n = len(self.docs)
        df = self.df.get(term, 0)
        # BM25+ style smooth idf (always positive)
        return math.log(1.0 + (n - df + 0.5) / (df + 0.5))

    def build(
        self,
        items: Iterable[str | Chunk],
        *,
        analyzer: Callable[[str], list[str]] | None = None,
    ) -> None:
        for item in items:
            if isinstance(item, Chunk):
                tokens = (analyzer or analyze)(item.text)
                self.add(item.text, tokens, metadata=item.to_dict())
            else:
                text = str(item)
                tokens = (analyzer or analyze)(text)
                self.add(text, tokens, metadata={})


class TfIdfIndex(InvertedIndex):
    """TF-IDF vectors with cosine ranking over an inverted index."""

    def search(
        self,
        query: str,
        *,
        k: int = 5,
        analyzer: Callable[[str], list[str]] | None = None,
    ) -> list[SearchHit]:
        if not self.docs:
            return []
        q_tokens = (analyzer or analyze)(query)
        if not q_tokens:
            return []
        n = len(self.docs)
        # unique query terms
        q_terms = list(dict.fromkeys(q_tokens))
        scores = np.zeros(n, dtype=np.float64)
        for term in q_terms:
            if term not in self.df:
                continue
            idf = math.log(1.0 + n / self.df[term])
            for doc_idx, tf_map in enumerate(self.tf):
                tf = tf_map.get(term, 0)
                if tf:
                    scores[doc_idx] += (1.0 + math.log(tf)) * idf
        # cosine normalize by doc length of nonzero vectors
        for i in range(n):
            if scores[i] and self.doc_len[i]:
                scores[i] /= math.sqrt(self.doc_len[i])
        top = top_k_indices(scores, k)
        hits: list[SearchHit] = []
        for i in top:
            if scores[i] <= 0:
                continue
            meta = self._meta[i]
            hits.append(
                SearchHit(
                    text=self._texts[i],
                    score=float(scores[i]),
                    doc_id=str(meta.get("doc_id", "")),
                    chunk_id=int(meta.get("chunk_id", -1)),
                    metadata=meta,
                )
            )
        return hits
