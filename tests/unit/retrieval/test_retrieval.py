"""Unit tests for arclm.retrieval (torch-free)."""

import json
from pathlib import Path

import pytest

from arclm.retrieval import (
    BM25Index,
    Chunk,
    HashingEmbedder,
    RAGPipeline,
    TfIdfIndex,
    VectorStore,
    analyze,
    chunk_records,
    chunk_text,
    cosine,
    hybrid_search,
    jaccard,
    rrf_fuse,
)


# --- chunking ---

def test_chunk_fixed_windows_overlap():
    text = "a" * 100
    chunks = chunk_text(text, size=40, overlap=10, method="fixed")
    assert len(chunks) >= 3
    assert all(c.text for c in chunks)
    assert chunks[0].start == 0
    # step = 30 → second chunk starts at 30
    assert chunks[1].start == 30


def test_chunk_sentence_packs_sentences():
    text = "One sentence here. Two sentence here. Three sentence here."
    chunks = chunk_text(text, size=25, method="sentence")
    assert len(chunks) >= 2
    assert "sentence" in chunks[0].text


def test_chunk_words():
    text = "w1 w2 w3 w4 w5 w6 w7 w8"
    chunks = chunk_text(text, size=4, overlap=1, method="words")
    assert chunks[0].text.startswith("w1")
    assert chunks[0].end - chunks[0].start == 4


def test_chunk_empty_and_invalid():
    assert chunk_text("") == []
    assert chunk_text("   ") == []
    with pytest.raises(ValueError):
        chunk_text("x", size=0)
    with pytest.raises(ValueError):
        chunk_text("x", size=10, overlap=10, method="fixed")
    with pytest.raises(ValueError):
        chunk_text("x", method="bogus")


def test_chunk_records_metadata():
    recs = [
        {"text": "hello world foo", "lang": "en"},
        {"text": "another document about testing code", "lang": "en"},
    ]
    chunks = chunk_records(recs, size=20, overlap=5, method="fixed")
    assert chunks
    assert chunks[0].doc_id == "0"
    assert chunks[0].metadata.get("lang") == "en"
    assert "text" not in chunks[0].metadata or chunks[0].text != recs[0]["text"]


# --- analyzer ---

def test_analyze_lowercase_and_punct():
    assert analyze("Hello, World!") == ["hello", "world"]
    assert analyze("Hello", lowercase=False) == ["Hello"]
    assert analyze("") == []


def test_analyze_stopwords():
    tokens = analyze("the cat and the dog", remove_stopwords=True)
    assert "the" not in tokens
    assert "cat" in tokens


# --- metrics ---

def test_cosine_and_jaccard():
    import numpy as np

    a, b = np.array([1.0, 0.0]), np.array([1.0, 0.0])
    assert cosine(a, b) == pytest.approx(1.0)
    assert cosine(a, np.array([0.0, 0.0])) == 0.0
    assert jaccard(["a", "b"], ["b", "c"]) == pytest.approx(1 / 3)
    assert jaccard([], []) == 0.0


# --- BM25 / TF-IDF ---

DOCS = [
    Chunk(text="hello world of testing", doc_id="d1", chunk_id=0),
    Chunk(text="goodbye testing world", doc_id="d2", chunk_id=0),
    Chunk(text="unrelated content about databases", doc_id="d3", chunk_id=0),
]


def test_bm25_ranks_matching_doc_first():
    idx = BM25Index()
    idx.build(DOCS)
    hits = idx.search("hello testing", k=2)
    assert hits
    assert hits[0].doc_id == "d1"
    assert hits[0].score > 0
    assert hits[0].text == "hello world of testing"


def test_bm25_params_validated():
    with pytest.raises(ValueError):
        BM25Index(k1=0)
    with pytest.raises(ValueError):
        BM25Index(b=2.0)


def test_bm25_empty_index_and_query():
    idx = BM25Index()
    assert idx.search("x") == []
    idx.build(DOCS)
    assert idx.search("") == []
    assert idx.search("zzzznotfound") == []


def test_tfidf_search():
    idx = TfIdfIndex()
    idx.build(DOCS)
    hits = idx.search("hello", k=3)
    assert hits and hits[0].doc_id == "d1"


# --- embedders + vector store ---

def test_hashing_embedder_deterministic():
    emb = HashingEmbedder(dim=64)
    v1 = emb.encode(["hello world"])
    v2 = emb.encode(["hello world"])
    assert v1.shape == (1, 64)
    assert (v1 == v2).all()


def test_vector_store_search_and_roundtrip(tmp_path):
    store = VectorStore(HashingEmbedder(dim=64))
    store.add(["hello world document", "goodbye moon document", "totally different"])
    hits = store.search("hello", k=2)
    assert hits
    assert hits[0].text == "hello world document"

    path = store.save(tmp_path / "store.npz")
    loaded = VectorStore.load(path, embedder=HashingEmbedder(dim=64))
    assert len(loaded) == 3
    hits2 = loaded.search("hello", k=1)
    assert hits2[0].text == hits[0].text


def test_vector_store_empty():
    store = VectorStore()
    assert store.search("q") == []
    with pytest.raises(ValueError):
        store.save("should_fail.npz")


# --- hybrid ---

def test_hybrid_rrf_and_weighted():
    bm = BM25Index()
    bm.build(DOCS)
    tf = TfIdfIndex()
    tf.build(DOCS)

    fused = hybrid_search("hello testing", bm25=bm, tfidf=tf, k=2, use_rrf=True)
    assert len(fused) <= 2
    assert fused[0].doc_id == "d1"

    fused2 = hybrid_search(
        "hello testing",
        bm25=bm,
        tfidf=tf,
        k=2,
        use_rrf=False,
        weights={"bm25": 2.0, "tfidf": 1.0},
    )
    assert fused2 and fused2[0].doc_id == "d1"

    with pytest.raises(ValueError):
        hybrid_search("q")  # no indexes


def test_rrf_fuse_empty_lists():
    assert rrf_fuse([]) == []


# --- RAG pipeline ---

def test_rag_from_text_prompt_and_retrieve():
    rag = RAGPipeline.from_text(
        "ArcLM retrieval keeps prompts local. BM25 ranks chunks without a GPU.",
        size=60,
        overlap=10,
    )
    hits = rag.retrieve("local retrieval", k=2)
    assert hits
    prompt = rag.build_prompt("What ranks chunks?", k=2)
    assert "What ranks chunks?" in prompt
    assert "Context:" in prompt
    result = rag.answer_prep("What ranks chunks?", k=2)
    assert result.index_kind == "BM25Index"
    assert result.hits


def test_rag_from_documents_and_generate_fn():
    recs = [
        {"text": "first document about tokenizers and ids"},
        {"text": "second document about training loops"},
    ]
    rag = RAGPipeline.from_documents(recs, chunker={"size": 40, "overlap": 5})
    assert len(rag.chunks) >= 2

    def fake_llm(prompt: str) -> str:
        assert "Question:" in prompt
        return "GENERATED"

    res = rag.generate("tokenizers?", fn=fake_llm, k=2)
    assert res.metadata["answer"] == "GENERATED"
    d = res.to_dict()
    assert d["question"] == "tokenizers?"
    json.dumps(d)  # JSON-serializable


def test_rag_prompt_template_custom():
    rag = RAGPipeline(prompt_template="CTX={context}\nQ={question}")
    rag.add_records([{"text": "alpha beta"}])
    out = rag.build_prompt("alpha?")
    assert out.startswith("CTX=")
    assert "Q=alpha?" in out
