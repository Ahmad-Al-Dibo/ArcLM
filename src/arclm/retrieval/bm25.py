"""BM25 (Okapi) ranking over an inverted index (torch-free)."""

from __future__ import annotations

import math
from typing import Callable

import numpy as np

from .analyzer import analyze
from .inverted import InvertedIndex, SearchHit
from .metrics import top_k_indices


class BM25Index(InvertedIndex):
    """Okapi BM25 with standard parameters k1 and b.

    Args in :meth:`search` allow per-query overrides; defaults k1=1.5, b=0.75.
    """

    def __init__(self, *, k1: float = 1.5, b: float = 0.75) -> None:
        super().__init__()
        if k1 <= 0:
            raise ValueError("k1 must be > 0")
        if not 0.0 <= b <= 1.0:
            raise ValueError("b must be in [0, 1]")
        self.k1 = float(k1)
        self.b = float(b)

    def search(
        self,
        query: str,
        *,
        k: int = 5,
        analyzer: Callable[[str], list[str]] | None = None,
        k1: float | None = None,
        b: float | None = None,
    ) -> list[SearchHit]:
        """Rank documents for *query*; returns up to *k* hits (score desc)."""
        if not self.docs:
            return []
        q_tokens = (analyzer or analyze)(query)
        if not q_tokens:
            return []
        k1 = self.k1 if k1 is None else float(k1)
        b = self.b if b is None else float(b)
        avgdl = self.avgdl or 1.0
        n = len(self.docs)
        scores = np.zeros(n, dtype=np.float64)
        for term in dict.fromkeys(q_tokens):
            if term not in self.df:
                continue
            idf = self.idf(term)
            for doc_idx, tf_map in enumerate(self.tf):
                tf = tf_map.get(term, 0)
                if not tf:
                    continue
                dl = self.doc_len[doc_idx] or 1
                denom = tf + k1 * (1.0 - b + b * dl / avgdl)
                scores[doc_idx] += idf * (tf * (k1 + 1.0)) / denom
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
