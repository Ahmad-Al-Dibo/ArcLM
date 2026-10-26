"""Text chunking for retrieval pipelines (torch-free)."""

from __future__ import annotations

import re
from dataclasses import dataclass, field
from typing import Any, Mapping, Sequence


@dataclass
class Chunk:
    """A retrievable text window with provenance metadata."""

    text: str
    doc_id: str = ""
    chunk_id: int = 0
    start: int = 0
    end: int = 0
    metadata: dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> dict[str, Any]:
        return {
            "text": self.text,
            "doc_id": self.doc_id,
            "chunk_id": self.chunk_id,
            "start": self.start,
            "end": self.end,
            "metadata": dict(self.metadata),
        }


_SENTENCE_SPLIT = re.compile(r"(?<=[.!?])\s+")


def chunk_text(
    text: str,
    *,
    size: int = 512,
    overlap: int = 64,
    method: str = "fixed",
    doc_id: str = "",
) -> list[Chunk]:
    """Split *text* into overlapping chunks.

    Args:
        text: Source document text.
        size: Target chunk length in characters (fixed/sentence) or tokens
            approximated by words for sentence packing.
        overlap: Overlap between consecutive fixed chunks (characters).
        method: ``"fixed"`` (character windows), ``"sentence"`` (pack
            sentences up to size), or ``"words"`` (word windows).
        doc_id: Provenance id stored on every chunk.

    Returns:
        List of :class:`Chunk`. Empty list for empty input.

    Raises:
        ValueError: If size <= 0, overlap < 0, overlap >= size, or unknown method.
    """
    if size <= 0:
        raise ValueError("size must be > 0")
    if overlap < 0 or (method in {"fixed", "words"} and overlap >= size):
        raise ValueError("overlap must be >= 0 and < size")
    if not text or not text.strip():
        return []
    if method not in {"fixed", "sentence", "words"}:
        raise ValueError(f"unknown method: {method!r} (use fixed|sentence|words)")

    if method == "fixed":
        step = size - overlap
        chunks: list[Chunk] = []
        start = 0
        idx = 0
        while start < len(text):
            end = min(start + size, len(text))
            piece = text[start:end].strip()
            if piece:
                chunks.append(Chunk(text=piece, doc_id=doc_id, chunk_id=idx, start=start, end=end))
                idx += 1
            if end >= len(text):
                break
            start += step
        return chunks

    if method == "words":
        words = text.split()
        step = size - overlap
        out: list[Chunk] = []
        pos = 0
        idx = 0
        # size/overlap interpreted as word counts when method=words
        while pos < len(words):
            window = words[pos : pos + size]
            if not window:
                break
            out.append(
                Chunk(
                    text=" ".join(window),
                    doc_id=doc_id,
                    chunk_id=idx,
                    start=pos,
                    end=pos + len(window),
                )
            )
            idx += 1
            pos += max(1, step)
        return out

    # sentence: pack sentences up to size characters
    sentences = _SENTENCE_SPLIT.split(text.strip())
    out2: list[Chunk] = []
    buf: list[str] = []
    length = 0
    idx2 = 0

    def flush() -> None:
        nonlocal buf, length, idx2
        if buf:
            joined = " ".join(buf).strip()
            if joined:
                out2.append(Chunk(text=joined, doc_id=doc_id, chunk_id=idx2))
                idx2 += 1
            buf = []
            length = 0

    for sent in sentences:
        sent = sent.strip()
        if not sent:
            continue
        if length + len(sent) + 1 > size:
            flush()
        buf.append(sent)
        length += len(sent) + 1
    flush()
    return out2


def chunk_records(
    records: Sequence[Mapping[str, Any]],
    *,
    size: int = 512,
    overlap: int = 64,
    method: str = "fixed",
    text_field: str = "text",
    id_field: str | None = None,
) -> list[Chunk]:
    """Chunk every record's text field; metadata copied from the record.

    Each output chunk gets ``doc_id`` from ``id_field`` (or the record index)
    and ``metadata`` with the original record fields (minus the long text).
    """
    out: list[Chunk] = []
    for i, rec in enumerate(records):
        text = str(rec.get(text_field, ""))
        doc_id = str(rec.get(id_field, i)) if id_field else str(i)
        meta = {k: v for k, v in rec.items() if k != text_field}
        for ch in chunk_text(
            text, size=size, overlap=overlap, method=method, doc_id=doc_id
        ):
            ch.metadata.update(meta)
            out.append(ch)
    return out
