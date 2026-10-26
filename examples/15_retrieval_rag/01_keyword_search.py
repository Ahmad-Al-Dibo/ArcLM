"""
ArcLM Example: Keyword Search with BM25 (no torch)

What you'll learn
-----------------
- Chunk local text and build a BM25 index
- Run ranked keyword search with scores
- Difference vs arclm.search (that is hyperparameter search)

When to use this
----------------
- Local document lookup without embeddings or GPUs

Requirements
------------
    pip install arclm

Run
---
    python examples/15_retrieval_rag/01_keyword_search.py

Expected output
---------------
    JSON with top hit text, score > 0, and chunk count

Runtime
-------
    Under 5 seconds on CPU.
"""

from __future__ import annotations

import json

from arclm.retrieval import BM25Index, TfIdfIndex, chunk_text

DOC = (
    "ArcLM retrieval ranks local text chunks with BM25 without PyTorch. "
    "Tokenizers convert words to ids for model workflows. "
    "Keyword search is useful before adding embeddings. "
    "Hyperparameter search lives in arclm.search, not here."
)


def main() -> None:
    chunks = chunk_text(DOC, size=80, overlap=16, method="fixed")
    assert chunks, "expected chunks"

    bm25 = BM25Index()
    bm25.build(chunks)
    hits = bm25.search("BM25 keyword search", k=3)
    assert hits and hits[0].score > 0

    tfidf = TfIdfIndex()
    tfidf.build(chunks)
    tf_hits = tfidf.search("tokenizers words", k=2)

    print(
        json.dumps(
            {
                "chunks": len(chunks),
                "bm25_top": hits[0].text[:60],
                "bm25_score": round(hits[0].score, 4),
                "bm25_hits": len(hits),
                "tfidf_hits": len(tf_hits),
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
