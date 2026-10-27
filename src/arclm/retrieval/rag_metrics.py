"""Heuristic RAG quality metrics (torch-free, no LLM judge).

These are transparent scoring functions you can run locally in CI. They do
not claim human-level judgment — they measure groundedness proxies:

- context coverage: fraction of query tokens present in retrieved context
- citation grounding: fraction of answer spans traceable to context
- context utilization: how much of the context the answer touches

For LLM-as-judge or human eval, export your RAG prompts/answers and use a
dedicated tool (DeepEval, Ragas, …). These helpers stay dependency-free.
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field
from typing import Any, Sequence

from .analyzer import analyze


def _normalize(text: str) -> str:
    return re.sub(r"\s+", " ", (text or "").strip().lower())


def context_coverage(query: str, context: str) -> float:
    """Fraction of query tokens that appear in *context* (0..1).

    1.0 = every query token is in the retrieved context.
    """
    q = [t for t in analyze(query) if len(t) > 1]
    if not q:
        return 0.0
    ctx = set(analyze(context))
    hit = sum(1 for t in q if t in ctx)
    return hit / len(q)


def citation_grounding(answer: str, context: str, *, ngram: int = 2) -> float:
    """Fraction of answer n-grams that appear in *context* (0..1).

    Proxy for "does the answer stick to the provided context".
    Unigram mode (ngram=1) is more lenient; bigrams are stricter.
    """
    if ngram < 1:
        raise ValueError("ngram must be >= 1")
    a_tokens = analyze(answer)
    if len(a_tokens) < ngram:
        # fall back to unigram containment for very short answers
        c_tokens = analyze(context)
        if not a_tokens or not c_tokens:
            return 0.0
        cset = set(c_tokens)
        return sum(1 for t in a_tokens if t in cset) / len(a_tokens)
    c_norm = _normalize(context)
    grams = [
        " ".join(a_tokens[i : i + ngram]) for i in range(len(a_tokens) - ngram + 1)
    ]
    if not grams:
        return 0.0
    # normalize context similarly for substring checks
    c_tokens = analyze(context)
    c_grams = set(
        " ".join(c_tokens[i : i + ngram]) for i in range(max(0, len(c_tokens) - ngram + 1))
    )
    hit = sum(1 for g in grams if g in c_grams or g in c_norm)
    return hit / len(grams)


def context_utilization(answer: str, context: str, *, ngram: int = 2) -> float:
    """Fraction of context n-grams that appear in *answer* (0..1).

    High utilization = the answer used a large part of the provided context.
    """
    if ngram < 1:
        raise ValueError("ngram must be >= 1")
    a_tokens = analyze(answer)
    c_tokens = analyze(context)
    if len(c_tokens) < ngram or not a_tokens:
        return 0.0
    a_norm = _normalize(answer)
    c_grams = [
        " ".join(c_tokens[i : i + ngram]) for i in range(len(c_tokens) - ngram + 1)
    ]
    if not c_grams:
        return 0.0
    a_grams = set(
        " ".join(a_tokens[i : i + ngram]) for i in range(max(0, len(a_tokens) - ngram + 1))
    )
    hit = sum(1 for g in c_grams if g in a_grams or g in a_norm)
    return hit / len(c_grams)


@dataclass
class RAGQualityReport:
    """Bundle of heuristic scores for one (query, context, answer) triple."""

    query: str
    context_coverage: float
    citation_grounding: float
    context_utilization: float
    metadata: dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> dict[str, Any]:
        return {
            "query": self.query,
            "context_coverage": round(self.context_coverage, 4),
            "citation_grounding": round(self.citation_grounding, 4),
            "context_utilization": round(self.context_utilization, 4),
            "metadata": dict(self.metadata),
        }


def score_rag(
    query: str,
    context: str,
    answer: str,
    *,
    ngram: int = 2,
    metadata: dict[str, Any] | None = None,
) -> RAGQualityReport:
    """Compute all heuristic RAG metrics for one example."""
    return RAGQualityReport(
        query=query,
        context_coverage=context_coverage(query, context),
        citation_grounding=citation_grounding(answer, context, ngram=ngram),
        context_utilization=context_utilization(answer, context, ngram=ngram),
        metadata=dict(metadata or {}),
    )


def score_rag_batch(
    items: Sequence[tuple[str, str, str]],
    *,
    ngram: int = 2,
) -> list[RAGQualityReport]:
    """Score many ``(query, context, answer)`` triples; averages in metadata."""
    reports = [
        score_rag(q, c, a, ngram=ngram, metadata={"index": i})
        for i, (q, c, a) in enumerate(items)
    ]
    if reports:
        avg = {
            "mean_coverage": round(
                sum(r.context_coverage for r in reports) / len(reports), 4
            ),
            "mean_grounding": round(
                sum(r.citation_grounding for r in reports) / len(reports), 4
            ),
            "mean_utilization": round(
                sum(r.context_utilization for r in reports) / len(reports), 4
            ),
        }
        for r in reports:
            r.metadata.update(avg)
    return reports
