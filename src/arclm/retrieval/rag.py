"""RAG pipeline: chunk → index → retrieve → prompt (generation optional)."""

from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Callable, Mapping, Sequence

from .bm25 import BM25Index
from .chunking import Chunk, chunk_records, chunk_text
from .embedders import Embedder, HashingEmbedder
from .hybrid import hybrid_search
from .inverted import SearchHit, TfIdfIndex
from .vector_store import VectorStore

DEFAULT_PROMPT_TEMPLATE = (
    "Use the context below to answer the question.\n"
    "If the answer is not in the context, say you do not know.\n\n"
    "Context:\n{context}\n\n"
    "Question: {question}\n"
    "Answer:"
)


@dataclass
class RetrievalResult:
    """Retrieve-and-prompt result for one question."""

    question: str
    hits: list[SearchHit]
    context: str
    prompt: str
    index_kind: str = "bm25"
    metadata: dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> dict[str, Any]:
        return {
            "question": self.question,
            "context": self.context,
            "prompt": self.prompt,
            "index_kind": self.index_kind,
            "hits": [h.to_dict() for h in self.hits],
            "metadata": dict(self.metadata),
        }


class RAGPipeline:
    """Minimal local RAG orchestration over ArcLM retrieval indexes.

    Generations is intentionally out of this class — pass a callable to
    :meth:`generate` or use ``arclm.inference`` yourself. That keeps the
    pipeline torch-free.
    """

    def __init__(
        self,
        *,
        index: Any = None,
        chunker: Mapping[str, Any] | None = None,
        text_field: str = "text",
        prompt_template: str = DEFAULT_PROMPT_TEMPLATE,
        chunk_kwargs: Mapping[str, Any] | None = None,
    ) -> None:
        """Args:
            index: A search index with ``.build(items)`` and
                ``.search(query, k=...)``. Defaults to a fresh BM25Index.
            chunker: Options for :meth:`from_documents` when records are used
                (``size``/``overlap``/``method``/``text_field``).
            text_field: Record field to chunk.
            prompt_template: Python format template with ``{context}`` and
                ``{question}``.
        """
        self.index = index if index is not None else BM25Index()
        self.chunker = dict(chunker or {})
        self.text_field = text_field
        self.prompt_template = prompt_template
        self.chunks: list[Chunk] = []
        self._built = False

    @classmethod
    def from_documents(
        cls,
        records: Sequence[Mapping[str, Any]],
        *,
        index: Any = None,
        chunker: Mapping[str, Any] | None = None,
        text_field: str = "text",
        **kwargs: Any,
    ) -> "RAGPipeline":
        """Chunk *records* and build the index in one step."""
        pipe = cls(
            index=index,
            chunker=chunker,
            text_field=text_field,
            **kwargs,
        )
        pipe.add_records(records)
        return pipe

    @classmethod
    def from_text(
        cls,
        text: str,
        *,
        index: Any = None,
        size: int = 512,
        overlap: int = 64,
        method: str = "fixed",
        doc_id: str = "doc-0",
        **kwargs: Any,
    ) -> "RAGPipeline":
        """Chunk a single raw text and build the index."""
        pipe = cls(index=index, **kwargs)
        chunks = chunk_text(text, size=size, overlap=overlap, method=method, doc_id=doc_id)
        pipe.add_chunks(chunks)
        return pipe

    def add_chunks(self, chunks: Sequence[Chunk]) -> None:
        chunks = list(chunks)
        if not chunks:
            return
        if hasattr(self.index, "add") and not self._built:
            # Inverted indexes: batch build once when still empty
            if len(self.index) == 0:
                self.index.build(chunks)
                self._built = True
            else:
                for ch in chunks:
                    self.index.add(ch.text, _default_analyze(ch.text), metadata=ch.to_dict())
        else:
            # VectorStore / already built
            self.index.add(chunks)
            self._built = True
        self.chunks.extend(chunks)

    def add_records(self, records: Sequence[Mapping[str, Any]]) -> None:
        opts = {
            "size": int(self.chunker.get("size", 512)),
            "overlap": int(self.chunker.get("overlap", 64)),
            "method": str(self.chunker.get("method", "fixed")),
            "text_field": self.text_field,
            "id_field": self.chunker.get("id_field"),
        }
        self.add_chunks(chunk_records(records, **opts))

    def retrieve(self, question: str, *, k: int = 5) -> list[SearchHit]:
        """Top-k chunks for *question* using the configured index."""
        if not self._built and not self.chunks:
            return []
        return self.index.search(question, k=k)

    def build_prompt(self, question: str, *, k: int = 5) -> str:
        """Retrieve context and render the prompt template."""
        hits = self.retrieve(question, k=k)
        context = "\n\n".join(
            f"[{i + 1}] {h.text}" for i, h in enumerate(hits)
        )
        return self.prompt_template.format(context=context, question=question)

    def answer_prep(self, question: str, *, k: int = 5) -> RetrievalResult:
        """Retrieve + build prompt + return a structured result."""
        hits = self.retrieve(question, k=k)
        context = "\n\n".join(f"[{i + 1}] {h.text}" for i, h in enumerate(hits))
        prompt = self.prompt_template.format(context=context, question=question)
        kind = type(self.index).__name__
        return RetrievalResult(
            question=question,
            hits=hits,
            context=context,
            prompt=prompt,
            index_kind=kind,
        )

    def generate(
        self,
        question: str,
        *,
        fn: Callable[[str], str],
        k: int = 5,
    ) -> RetrievalResult:
        """Retrieve a prompt and pass it to *fn* (e.g. model.predict).

        *fn* is any callable taking the rendered prompt and returning text —
        this keeps RAGPipeline independent of torch/HF.
        """
        result = self.answer_prep(question, k=k)
        answer = fn(result.prompt)
        result.metadata["answer"] = answer
        return result


def _default_analyze(text: str) -> list[str]:
    from .analyzer import analyze

    return analyze(text)


def load_index(path: str | Path, kind: str = "bm25") -> Any:
    """Load a saved VectorStore npz (kind='vector') — convenience helper."""
    if kind == "vector":
        return VectorStore.load(path)
    raise ValueError(f"load_index supports kind='vector' only, got {kind!r}")
