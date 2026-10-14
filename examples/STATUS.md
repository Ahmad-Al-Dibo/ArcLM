# ArcLM Examples Status

Last verified: 2026-10-14 on CPU (Python 3.12, ArcLM 2.0.0).

| Status | Count | Meaning |
| --- | ---: | --- |
| `verified` | 27 | Runnable locally by `examples/run_examples.py run-verified`. |
| `verified_with_fake_backend` | 1 | Runnable locally with a deterministic fake backend. |
| `manual_optional` | 3 | Documented boundary requiring a local model, GPU, or optional dependency. |

## Verified coverage

The verified set covers:

- data loading, validation, manifests, reports
- word and SentencePiece tokenizers
- native model creation and state-dict save/load
- one-step pretraining and SFT preparation
- checkpoint save / inspect / safe-load
- evaluation metrics (perplexity, accuracy, loss)
- local generation and sampling
- data pipelines and generation-step inspection
- agent tools, document agents, fake voice backend
- Security Core (encrypt, hash, sign, redact, status)
- six complete end-to-end projects

## Optional boundaries

Manual optional entries avoid automatic downloads and remote calls:

| ID | Needs |
|----|-------|
| `05-03` | PEFT/QLoRA with local model assets and suitable hardware |
| `08-03` | Real external Hugging Face model loading |
| `10-04` | Real Whisper speech-to-text backend |

Use [`manifest.json`](manifest.json) for machine-readable status and requirements.

## Historical folders

Unnumbered model-specific scripts were removed in ArcLM 2.0. The numbered
suite plus `12_complete_projects` is the source of truth.
