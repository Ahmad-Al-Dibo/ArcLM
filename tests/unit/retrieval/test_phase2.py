"""Tests for Phase 2: SessionStore, RAG metrics, OTel span export."""

import json
import time

from arclm.agents import AgentMessage, AgentSession, SessionStore, to_otel_spans
from arclm.agents.tracing import AgentTrace
from arclm.retrieval import (
    citation_grounding,
    context_coverage,
    context_utilization,
    score_rag,
    score_rag_batch,
)


# --- SessionStore ---

def test_session_store_roundtrip(tmp_path):
    store = SessionStore(tmp_path / "mem")
    s = AgentSession(session_id="abc-123")
    s.add_message(AgentMessage(role="user", content="hello world about tokenizers"))
    s.add_message(AgentMessage(role="assistant", content="Tokenizers split text."))
    path = store.save(s)
    assert path.exists()
    assert store.exists("abc-123")
    assert store.list_ids() == ["abc-123"]

    loaded = store.load("abc-123")
    assert len(loaded.messages) == 2
    assert loaded.messages[0].content.startswith("hello")

    assert store.delete("abc-123") is True
    assert store.exists("abc-123") is False


def test_session_store_recall(tmp_path):
    store = SessionStore(tmp_path / "mem")
    s1 = AgentSession(session_id="s1")
    s1.add_message(AgentMessage(role="user", content="how do I train a tokenizer"))
    s1.add_message(AgentMessage(role="assistant", content="Use Tokenizer.build on your corpus"))
    s1.updated_at = time.time() - 10
    store.save(s1)

    s2 = AgentSession(session_id="s2")
    s2.add_message(AgentMessage(role="user", content="unrelated weather chat"))
    s2.updated_at = time.time()
    store.save(s2)

    hits = store.recall("train tokenizer", limit=5)
    assert hits
    assert hits[0].session_id == "s1"
    assert "tokenizer" in hits[0].content.lower()

    ctx = store.recall_as_context("train tokenizer", limit=2)
    assert "tokenizer" in ctx.lower()

    # no match
    assert store.recall("xylophone quantum zebra") == []
    # role filter
    hits2 = store.recall("tokenizer", roles=["assistant"])
    assert all(h.role == "assistant" for h in hits2)


# --- RAG metrics ---

def test_context_coverage():
    assert context_coverage("train tokenizer", "Use Tokenizer.build to train") == 1.0
    assert context_coverage("totally unrelated", "nothing here") == 0.0
    assert context_coverage("", "ctx") == 0.0


def test_citation_grounding():
    ctx = "ArcLM redacts secrets from logs using the security module"
    grounded = "ArcLM redacts secrets from logs"
    hallucinated = "The capital of France is Paris"
    g1 = citation_grounding(grounded, ctx)
    g2 = citation_grounding(hallucinated, ctx)
    assert g1 > g2
    assert g1 > 0.5
    assert g2 < 0.5


def test_context_utilization():
    ctx = "alpha beta gamma delta"
    answer = "alpha beta gamma"
    util = context_utilization(answer, ctx)
    assert util > 0.5
    assert context_utilization("nothing", ctx) == 0.0


def test_score_rag_and_batch():
    q = "tokenizers convert words"
    c = "Tokenizers convert words into ids for models."
    a = "Tokenizers convert words into ids."
    rep = score_rag(q, c, a)
    assert rep.context_coverage > 0.5
    assert rep.citation_grounding > 0.5
    d = rep.to_dict()
    assert set(d) == {"query", "context_coverage", "citation_grounding", "context_utilization", "metadata"}

    batch = score_rag_batch([(q, c, a), ("x", "y", "z")])
    assert len(batch) == 2
    assert "mean_coverage" in batch[0].metadata


# --- OTel span export ---

def test_to_otel_spans():
    trace = AgentTrace()
    trace.record("run_start", step=0)
    trace.record("tool_call", step=1, tool_name="add", duration_seconds=0.05, metadata={"ok": True})
    spans = to_otel_spans(trace)
    assert len(spans) == 2
    assert spans[0]["name"] == "arclm.agent.run_start"
    assert spans[1]["attributes"]["genai.tool.name"] == "add"
    assert spans[1]["attributes"]["arclm.step"] == 1
    assert spans[1]["start_time_unix_nano"] > 0
    json.dumps(spans)  # serializable
