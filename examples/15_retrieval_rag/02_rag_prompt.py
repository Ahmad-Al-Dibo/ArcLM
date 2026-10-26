"""
ArcLM Example: Local RAG Prompt (chunk → retrieve → prompt)

What you'll learn
-----------------
- Build a RAGPipeline over records (no torch)
- Retrieve top-k context and render a grounded prompt
- Feed the prompt to any callable (model adapter or stub)

When to use this
----------------
- Preparing prompts for a local or hosted LLM with local retrieval

Requirements
------------
    pip install arclm

Run
---
    python examples/15_retrieval_rag/02_rag_prompt.py

Expected output
---------------
    JSON with hits and a prompt containing Context/Question sections

Runtime
-------
    Under 5 seconds on CPU.
"""

from __future__ import annotations

import json

from arclm.retrieval import RAGPipeline

RECORDS = [
    {"text": "ArcLM is a light Python toolkit for language model workflows."},
    {"text": "BM25 ranks text chunks locally without a GPU."},
    {"text": "The security module redacts API keys from logs."},
    {"text": "Agents run typed tools with bounded steps."},
]


def main() -> None:
    rag = RAGPipeline.from_documents(
        RECORDS,
        chunker={"size": 64, "overlap": 8, "method": "fixed"},
    )
    hits = rag.retrieve("redact api keys", k=2)
    assert hits, "expected retrieval hits"

    result = rag.answer_prep("How does ArcLM protect logs?", k=2)
    assert "Context:" in result.prompt
    assert "How does ArcLM protect logs?" in result.prompt

    # Pluggable generator: any callable(prompt) -> str (stub here)
    def stub_model(prompt: str) -> str:
        assert "security module" in prompt.lower() or "redact" in prompt.lower() or "[1]" in prompt
        return "ArcLM redacts secrets with the security module."

    res = rag.generate("How does ArcLM protect logs?", fn=stub_model, k=2)
    answer = res.metadata.get("answer")

    print(
        json.dumps(
            {
                "hits": [h.to_dict()["score"] for h in res.hits],
                "index_kind": res.index_kind,
                "prompt_chars": len(res.prompt),
                "answer": answer,
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
