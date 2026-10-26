"""Hybrid ranking fusion (RRF + weighted scores), torch-free."""

from __future__ import annotations

from typing import Mapping, Sequence

from .inverted import SearchHit


def rrf_fuse(
    ranked_lists: Sequence[Sequence[SearchHit]],
    *,
    k: int = 60,
) -> list[SearchHit]:
    """Reciprocal Rank Fusion of multiple ranked lists.

    score(d) = sum over lists of 1 / (k + rank(d))  with rank starting at 1.

    Args:
        ranked_lists: One or more lists of hits (best first).
        k: RRF constant (60 is the common default).

    Returns:
        Fused hits sorted by fused score descending. Identity of a document
        is ``doc_id`` if set, else ``text``.
    """
    if k <= 0:
        raise ValueError("k must be > 0")
    fused: dict[str, dict] = {}
    for lst in ranked_lists:
        for rank, hit in enumerate(lst, start=1):
            key = hit.doc_id if hit.doc_id else hit.text
            entry = fused.get(key)
            if entry is None:
                fused[key] = {"hit": hit, "score": 1.0 / (k + rank)}
            else:
                entry["score"] += 1.0 / (k + rank)
    ordered = sorted(fused.values(), key=lambda e: e["score"], reverse=True)
    out: list[SearchHit] = []
    for entry in ordered:
        base: SearchHit = entry["hit"]
        out.append(
            SearchHit(
                text=base.text,
                score=float(entry["score"]),
                doc_id=base.doc_id,
                chunk_id=base.chunk_id,
                metadata=dict(base.metadata),
            )
        )
    return out


def weighted_fuse(
    ranked_lists: Sequence[Sequence[SearchHit]],
    weights: Sequence[float],
) -> list[SearchHit]:
    """Min-max normalize each list's scores and sum weighted scores."""
    if len(ranked_lists) != len(weights):
        raise ValueError("ranked_lists and weights must have the same length")
    if any(w < 0 for w in weights):
        raise ValueError("weights must be >= 0")
    fused: dict[str, dict] = {}
    for lst, w in zip(ranked_lists, weights):
        if not lst:
            continue
        scores = [h.score for h in lst]
        lo, hi = min(scores), max(scores)
        span = (hi - lo) or 1.0
        for hit in lst:
            key = hit.doc_id if hit.doc_id else hit.text
            norm = (hit.score - lo) / span
            entry = fused.get(key)
            if entry is None:
                fused[key] = {"hit": hit, "score": w * norm}
            else:
                entry["score"] += w * norm
    ordered = sorted(fused.values(), key=lambda e: e["score"], reverse=True)
    return [
        SearchHit(
            text=e["hit"].text,
            score=float(e["score"]),
            doc_id=e["hit"].doc_id,
            chunk_id=e["hit"].chunk_id,
            metadata=dict(e["hit"].metadata),
        )
        for e in ordered
    ]


def hybrid_search(
    query: str,
    *,
    bm25=None,
    tfidf=None,
    vector_store=None,
    k: int = 5,
    weights: Mapping[str, float] | None = None,
    use_rrf: bool = True,
) -> list[SearchHit]:
    """Combine up to three indexes for one query.

    Args:
        query: Raw query text.
        bm25: Optional BM25Index.
        tfidf: Optional TfIdfIndex.
        vector_store: Optional VectorStore.
        k: Results per source list and final cut.
        weights: Per-source weights, keys ``bm25``/``tfidf``/``vector``;
            only used when ``use_rrf=False``.
        use_rrf: Reciprocal Rank Fusion (default) vs weighted score fusion.

    Returns:
        Fused, top-*k* hits. Sources with no results are skipped.
    """
    lists: list[Sequence[SearchHit]] = []
    names: list[str] = []
    if bm25 is not None:
        lists.append(bm25.search(query, k=k))
        names.append("bm25")
    if tfidf is not None:
        lists.append(tfidf.search(query, k=k))
        names.append("tfidf")
    if vector_store is not None:
        lists.append(vector_store.search(query, k=k))
        names.append("vector")
    if not lists:
        raise ValueError("provide at least one index: bm25, tfidf, or vector_store")

    if use_rrf:
        fused = rrf_fuse(lists, k=60)
    else:
        w = dict(weights or {})
        wlist = [float(w.get(name, 1.0)) for name in names]
        fused = weighted_fuse(lists, wlist)
    return fused[:k]
