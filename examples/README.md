# ArcLM Examples

Runnable examples for every part of the ArcLM workflow — from a first forward
pass to complete local AI projects. The numbered folders are the **maintained
suite**: CPU-first, no GPU, no automatic downloads, verified by
`run_examples.py`.

## Quick start

```bash
pip install -e ".[dev,train,security]"

# Run one example
python examples/00_quick_start/01_first_arclm_workflow.py

# Or use the suite runner
python examples/run_examples.py list
python examples/run_examples.py run 00-01
python examples/run_examples.py run-category data
python examples/run_examples.py run-verified
python examples/run_examples.py status
```

## Learning path

Follow the folders in order — each builds on the previous:

| # | Folder | What you learn | Install |
|---|--------|----------------|---------|
| 00 | [`00_quick_start`](00_quick_start/) | First dataset → tokenizer → model → forward pass; pipeline inspection | `[train]` |
| 01 | [`01_data`](01_data/) | Load JSONL/HTML, validate, build manifests and reports | core |
| 02 | [`02_tokenizers`](02_tokenizers/) | Word-level and SentencePiece BPE tokenizers | core |
| 03 | [`03_models`](03_models/) | Build a tiny ArcLM GPT; save and reload state dicts | `[train]` |
| 04 | [`04_training`](04_training/) | One CPU-friendly pretraining step with the Trainer | `[train]` |
| 05 | [`05_finetuning`](05_finetuning/) | Preview SFT data contracts; run a tiny supervised step | `[train]` |
| 06 | [`06_checkpoints`](06_checkpoints/) | Full checkpoint lifecycle: save, inspect, safe-load | `[train]` |
| 07 | [`07_evaluation_benchmarks`](07_evaluation_benchmarks/) | Perplexity, accuracy, loss metrics and reports | `[train]` |
| 08 | [`08_inference_local_models`](08_inference_local_models/) | Local generation, sampling controls, HF loading policy | `[train]` / `[hf]` |
| 09 | [`09_pipelines_inspection`](09_pipelines_inspection/) | Compose data pipelines; inspect one native generation step | `[train]` |
| 10 | [`10_agents_tools`](10_agents_tools/) | Custom tools, document agents, fake voice backend | core |
| 11 | [`11_security`](11_security/) | Security status, encrypt/hash/sign/redact | `[security]` |
| 12 | [`12_complete_projects`](12_complete_projects/) | Six end-to-end local projects (arclm APIs, no raw torch in app code) | mixed |
| 13 | [`13_research_extension`](13_research_extension/) | Subclass Trainer / Pipeline / Callback / DataStep / Tokenizer for research | `[train]` / core |
| 14 | [`14_translator_from_scratch`](14_translator_from_scratch/) + [`14_translator_open_source`](14_translator_open_source/) | Real projects: EN→NL translator from zero vs open-source instruct model | `[train]` / `[hf]` |
| 15 | [`15_retrieval_rag`](15_retrieval_rag/) | BM25 keyword search + local RAG prompt pipeline | core |
| 16 | [`16_mcp_tools`](16_mcp_tools/) | Expose ArcLM tools as an MCP JSON-RPC server | core |
| 17 | [`17_evalharness`](17_evalharness/) | EvalSet scoring harness (JSONL cases → report) | core |
| 18 | [`18_phase2_rag_memory`](18_phase2_rag_memory/) | RAG heuristic metrics, session memory recall, OTel span export | core |

Each example file starts with a standard header:

```text
What you'll learn   — learning objectives
When to use this    — practical situation
Requirements        — pip install line
Run                 — exact command
Expected output     — what you should see
Runtime             — seconds on CPU
```

## Complete projects (`12_complete_projects`)

| Project | Description |
|---------|-------------|
| `01_local_language_model` | Train a tiny native LM end-to-end on local text |
| `02_domain_sft_assistant` | Supervised fine-tuning on a domain JSONL dataset |
| `03_website_knowledge_pipeline` | HTML → records → tokenizer → model |
| `04_local_document_agent` | Agent with local document tools |
| `05_model_benchmark_lab` | Benchmark generation quality on CPU |
| `06_secure_local_ai_workspace` | Encrypted artifacts + signed manifests + agent |

Run any project:

```bash
python examples/12_complete_projects/01_local_language_model/main.py
```

## Status rules

| Status | Meaning |
|--------|---------|
| `verified` | Runs locally via `run-verified` — no network, no GPU |
| `verified_with_fake_backend` | Runs with a deterministic fake provider |
| `manual_optional` | Needs a local model, GPU, or optional dependency — not in default run |

Machine-readable status lives in [`manifest.json`](manifest.json).
Current counts are in [`STATUS.md`](STATUS.md).

## Conventions

- Examples keep generated artifacts in temporary directories.
- Verified examples never download models or call remote services.
- Optional boundaries (real HF models, Whisper, QLoRA) are marked
  `manual_optional` and documented in their headers.
