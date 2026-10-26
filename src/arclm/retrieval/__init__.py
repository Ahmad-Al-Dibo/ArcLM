"""Local retrieval and RAG building blocks (no PyTorch required).

Lexical search (BM25, TF-IDF), chunking, hybrid fusion, in-memory vector
store with a pluggable :class:`Embedder`, and a minimal RAG pipeline.

Note:
    ``arclm.search`` is hyperparameter search — different subsystem.
"""

from __future__ import annotations

from importlib import import_module
from typing import Any

_EXPORTS = {
    "Chunk": "arclm.retrieval.chunking",
    "chunk_text": "arclm.retrieval.chunking",
    "chunk_records": "arclm.retrieval.chunking",
    "analyze": "arclm.retrieval.analyzer",
    "analyze_batch": "arclm.retrieval.analyzer",
    "cosine": "arclm.retrieval.metrics",
    "dot": "arclm.retrieval.metrics",
    "euclidean": "arclm.retrieval.metrics",
    "jaccard": "arclm.retrieval.metrics",
    "SearchHit": "arclm.retrieval.inverted",
    "InvertedIndex": "arclm.retrieval.inverted",
    "TfIdfIndex": "arclm.retrieval.inverted",
    "BM25Index": "arclm.retrieval.bm25",
    "Embedder": "arclm.retrieval.embedders",
    "HashingEmbedder": "arclm.retrieval.embedders",
    "CallableEmbedder": "arclm.retrieval.embedders",
    "VectorStore": "arclm.retrieval.vector_store",
    "rrf_fuse": "arclm.retrieval.hybrid",
    "weighted_fuse": "arclm.retrieval.hybrid",
    "hybrid_search": "arclm.retrieval.hybrid",
    "RAGPipeline": "arclm.retrieval.rag",
    "RetrievalResult": "arclm.retrieval.rag",
    "DEFAULT_PROMPT_TEMPLATE": "arclm.retrieval.rag",
    "load_index": "arclm.retrieval.rag",
}

__all__ = sorted(_EXPORTS)


def __getattr__(name: str) -> Any:
    """Load a retrieval attribute only when requested."""
    if name in _EXPORTS:
        module = import_module(_EXPORTS[name])
        value = getattr(module, name)
        globals()[name] = value
        return value
    raise AttributeError(f"module 'arclm.retrieval' has no attribute {name!r}")
