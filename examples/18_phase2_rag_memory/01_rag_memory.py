"""
ArcLM Example: RAG Quality Metrics + Agent Session Memory

What you'll learn
-----------------
- Score RAG outputs with heuristic metrics (coverage, grounding, utilization)
- Persist agent sessions to disk and recall them by keyword
- Export agent traces as OTel-style spans (no SDK required)

When to use this
----------------
- Local quality gates for RAG before using heavier eval tools
- Cross-session recall for an agent without embeddings

Requirements
------------
    pip install arclm

Run
---
    python examples/18_phase2_rag_memory/01_rag_memory.py

Expected output
---------------
    JSON with metric scores, recall hits, and span count

Runtime
-------
    Under 5 seconds on CPU.
"""

from __future__ import annotations

import json
import tempfile
from pathlib import Path

from arclm.agents import AgentMessage, AgentSession, SessionStore, to_otel_spans
from arclm.agents.tracing import AgentTrace
from arclm.retrieval import score_rag


def main() -> None:
    # 1. Heuristic RAG scoring
    query = "tokenizers convert words"
    context = "Tokenizers convert words into ids for models."
    answer = "Tokenizers convert words into ids."
    rag = score_rag(query, context, answer)
    assert rag.context_coverage > 0.5
    assert rag.citation_grounding > 0.5

    hallucinated = score_rag(query, context, "The capital of France is Paris")
    assert hallucinated.citation_grounding < rag.citation_grounding

    # 2. Persistent session memory + recall
    with tempfile.TemporaryDirectory(prefix="arclm-mem-") as d:
        store = SessionStore(Path(d) / "sessions")
        sess = AgentSession(session_id="demo-1")
        sess.add_message(
            AgentMessage(role="user", content="how do I train a tokenizer")
        )
        sess.add_message(
            AgentMessage(role="assistant", content="Call Tokenizer.build on your corpus")
        )
        store.save(sess)

        hits = store.recall("train tokenizer", limit=3)
        assert hits and hits[0].session_id == "demo-1"
        ctx_block = store.recall_as_context("train tokenizer", limit=2)
        assert "tokenizer" in ctx_block.lower()

        # 3. OTel-style spans from a trace
        trace = AgentTrace()
        trace.record("run_start", step=0)
        trace.record("tool_call", step=1, tool_name="add_numbers", duration_seconds=0.01)
        spans = to_otel_spans(trace)
        assert len(spans) == 2
        json.dumps(spans)

        print(
            json.dumps(
                {
                    "rag_metrics": rag.to_dict(),
                    "hallucinated_grounding": round(hallucinated.citation_grounding, 4),
                    "recall_hits": len(hits),
                    "otel_spans": len(spans),
                    "span_names": [s["name"] for s in spans],
                },
                indent=2,
            )
        )


if __name__ == "__main__":
    main()
