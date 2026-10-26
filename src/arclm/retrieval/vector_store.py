"""In-memory vector store with numpy persistence (torch-free)."""

from __future__ import annotations

from pathlib import Path
from typing import Any, Sequence

import numpy as np

from .embedders import Embedder, HashingEmbedder
from .inverted import SearchHit
from .metrics import cosine, top_k_indices


class VectorStore:
    """Cosine-similarity vector store over an :class:`Embedder`.

    Args:
        embedder: Embedder used for query encoding; default HashingEmbedder(256).
    """

    def __init__(self, embedder: Embedder | None = None) -> None:
        self.embedder: Embedder = embedder or HashingEmbedder(256)
        self._vectors: np.ndarray | None = None
        self._texts: list[str] = []
        self._meta: list[dict[str, Any]] = []

    def __len__(self) -> int:
        return len(self._texts)

    @property
    def dim(self) -> int:
        return self.embedder.dim

    def add(self, items: Sequence[Any]) -> None:
        """Add chunks (str or objects with .text/.to_dict()) or plain strings."""
        texts: list[str] = []
        metas: list[dict[str, Any]] = []
        for it in items:
            if isinstance(it, str):
                texts.append(it)
                metas.append({})
            else:
                text = getattr(it, "text", None)
                if text is None:
                    raise TypeError(f"cannot extract text from {type(it).__name__}")
                texts.append(str(text))
                if hasattr(it, "to_dict"):
                    metas.append(it.to_dict())
                else:
                    metas.append(
                        {
                            k: getattr(it, k)
                            for k in ("doc_id", "chunk_id", "metadata")
                            if hasattr(it, k)
                        }
                    )
        if not texts:
            return
        vecs = self.embedder.encode(texts)
        if self._vectors is None:
            self._vectors = vecs
        else:
            self._vectors = np.vstack([self._vectors, vecs])
        self._texts.extend(texts)
        self._meta.extend(metas)

    def search(self, query: str, *, k: int = 5) -> list[SearchHit]:
        if self._vectors is None or len(self._texts) == 0:
            return []
        q = self.embedder.encode([query])[0]
        scores = np.array(
            [cosine(q, self._vectors[i]) for i in range(len(self._texts))],
            dtype=np.float64,
        )
        top = top_k_indices(scores, k)
        hits: list[SearchHit] = []
        for i in top:
            if scores[i] <= 0:
                continue
            meta = self._meta[i] if i < len(self._meta) else {}
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

    def save(self, path: str | Path) -> Path:
        """Persist vectors + texts to a ``.npz`` file (meta as JSON string)."""
        import json

        if self._vectors is None:
            raise ValueError("nothing to save — add documents first")
        p = Path(path)
        p.parent.mkdir(parents=True, exist_ok=True)
        np.savez_compressed(
            p if p.suffix == ".npz" else p.with_suffix(".npz"),
            vectors=self._vectors,
            texts=np.array(self._texts, dtype=object),
            meta=np.array([json.dumps(m, default=str) for m in self._meta], dtype=object),
            dim=np.array([self.dim]),
        )
        return p if p.suffix == ".npz" else p.with_suffix(".npz")

    @classmethod
    def load(cls, path: str | Path, embedder: Embedder | None = None) -> "VectorStore":
        """Load a store saved by :meth:`save`. Query encoding uses *embedder*."""
        import json

        data = np.load(Path(path), allow_pickle=True)
        store = cls(embedder=embedder)
        store._vectors = data["vectors"]
        store._texts = [str(t) for t in data["texts"].tolist()]
        store._meta = [json.loads(str(m)) for m in data["meta"].tolist()]
        return store
