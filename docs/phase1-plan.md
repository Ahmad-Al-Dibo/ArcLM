# ArcLM Phase 1 — Beslissingsdocument & implementatieplan

**Datum:** 2026-10-16 · **Status:** In uitvoering  
**Onderzoek:** markt-behoefte 2026 (evaluatie, RAG, MCP, memory) → fit met ArcLM

---

## 1. Marktbevindingen (bronnen: O'Reilly Agents Stack 2026, arXiv RAGe/ARES/FRAMES, MCP-spec, MLflow/DeepEval-vergelijkingen)

1. **LLM/agent-evaluatie** is hotste behoefte — pytest-stijl, LLM-as-judge, traces.
2. **RAG-evaluatie** groot onderzoeksveld; ook **lokaal op consumer hardware** (RAGe).
3. **MCP** is dé standaard voor agent-tool-integratie (JSON-RPC, stdio).
4. **Agentmemory** als first-class primitive.
5. Lokaal, licht, offline AI-niche groeit.

## 2. Beslissingen

| # | Beslissing | Rationale |
|---|---|---|
| D1 | **`arclm.retrieval` bouwen** (BM25/TF-IDF/chunk/RAG) | Grootste gap; `arclm.search` = HPO; numpy-only past op light-core |
| D2 | **Geen** DeepEval/Ragas-klon | Export/interoperatie i.p.v. concurreren met volwassen tools |
| D3 | **MCP-adapter** voor bestaande `@tool`-registry | Interop met Claude/ChatGPT/Cursor; weinig code |
| D4 | **`arclm.evalharness`** — kleine EvalSet + runner | Pytest-stijl lokale evals; JSON-export |
| D5 | Retrieval blijft **torch-vrij** voor lexicaal pad | Embeddings via `Embedder`-protocol; torch alleen optioneel |
| D6 | Vectorstore = **in-memory numpy** (npz-save) | Geen hosted DB; local-first |
| D7 | Fase 2/3 (memory, OTel, MCP-client) **niet nu** | Gefocust landen van Fase 1 |

## 3. Scope Fase 1

### 3a. `arclm.retrieval` (nieuw pakket, core-install)

```text
src/arclm/retrieval/
├── __init__.py      # lazy _EXPORTS
├── chunking.py      # chunk_text, chunk_records
├── analyzer.py      # analyze() — lowercase, punctuation, stopwords optie
├── metrics.py       # cosine, dot, jaccard (numpy)
├── inverted.py      # TfIdfIndex (inverted index + cosine)
├── bm25.py          # BM25Index (Okapi)
├── vector_store.py  # VectorStore + npz save/load
├── embedders.py     # Embedder protocol, HashingEmbedder, CallableEmbedder
├── hybrid.py        # rrf_fuse, hybrid_search
└── rag.py           # RAGPipeline: chunk → index → retrieve → prompt
```

**API-kern:**

```python
from arclm.retrieval import (
    chunk_text, chunk_records, analyze,
    BM25Index, TfIdfIndex, VectorStore,
    HashingEmbedder, hybrid_search, RAGPipeline,
)

index = BM25Index()
index.build(chunks)
hits = index.search("query", k=5)   # -> list[SearchHit(text, score, doc_id, metadata)]

rag = RAGPipeline.from_documents(records, index=index, chunker={"size": 512, "overlap": 64})
prompt = rag.build_prompt("vraag", k=5)
```

**Zonder torch.** Embedders: `HashingEmbedder` (numpy, deterministisch), `CallableEmbedder(fn)`.

### 3b. `arclm.agents.mcp` (nieuw subpakket)

- `create_mcp_server(registry|tools, name=…)` → JSON-RPC stdio server-loop
- Tools → MCP `tools/list` + `tools/call` met behoud van schema/permissions
- Voorbeeld in `examples/10_agents_tools/` of nieuw `15_mcp/`

### 3c. `arclm.evalharness` (nieuw pakket, torch-vrij)

```python
from arclm.evalharness import EvalSet, Case, run_evalset
# JSONL: {"input": ..., "expected": ..., "id": ...}
report = run_evalset(cases, fn=my_model_fn)  # exact / contains / custom
report.save("eval_report.json")
```

### 3d. Dokumentatie & tests

- `tests/unit/retrieval/`, `tests/unit/evalharness/`, `tests/agents/` MCP-test
- `examples/15_retrieval_rag/` (3 voorbeelden, verified)
- `examples/16_mcp/` (1 voorbeeld)
- docs: guide-hoofdstuk, framework-site features-pagina, README-tour
- Root `_EXPORTS` + `.pyi` + light-import-tests uitbreiden

## 4. Planning

| Stap | Volgorde |
|---|---|
| 1 | Dit document |
| 2 | retrieval: chunking + analyzer + metrics |
| 3 | retrieval: BM25 + TF-IDF |
| 4 | retrieval: vectorstore + embedders + hybrid |
| 5 | retrieval: RAGPipeline + exports |
| 6 | Tests retrieval |
| 7 | MCP adapter + voorbeeld |
| 8 | EvalHarness + tests |
| 9 | Docs/examples/manifest |
| 10 | Full test-suite + commit |

## 5. Non-goals (Fase 1)

- Hosted vector DBs, cloud embeddings
- LLM-as-judge / DeepEval-kloon
- MCP-client (Fase 2)
- Persistente agent-memory (Fase 2)

---

## Fase 2 � status (2026-10-16)

| Stap | Status |
|---|---|
| D8: rclm.agents.memory.SessionStore � persistente sessies + recall | In uitvoering |
| D9: RAG-heuristiek in rclm.retrieval.rag_metrics | In uitvoering |
| D10: Chat-template verificatietest | In uitvoering |
| D11: OTel-lite span hooks (optioneel, geen SDK-dep) | In uitvoering |
| Fase 2 non-goals | Volledige MCP-client, cloud memory, LLM-as-judge |
