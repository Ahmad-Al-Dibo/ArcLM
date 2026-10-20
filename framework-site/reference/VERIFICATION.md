# Documentation verification report

**Date:** 2026-10-16  
**ArcLM:** 2.0.0 · Python 3.12 · local repo venv

## What was verified against source / tests

| Claim | How verified |
|---|---|
| Core install deps (numpy, sentencepiece) | `pyproject.toml` + PyPI upload smoke install |
| `Tokenizer` encode/decode output on sample corpus | Executed (`[2, 3, 4]`, vocab 11) |
| `Config` / `create_config` fields and device default cpu | Source + executed |
| YAML config round-trip | Executed (T15) |
| `validate_records(..., required_fields=...)` | Source signature + executed |
| `deduplicate(..., return_result=True)` | Executed (kept 2 / removed 1) |
| `redact_sensitive_text` | Executed (api_key / token → [REDACTED]) |
| `security_status`, encrypt/sign example | Repo example `11_security` executed (T07–T08) |
| Agent `@tool` + runner output | Repo example `10_agents_tools` executed (T06) |
| `set_reproducible_seed` without torch | Executed (torch flags False) |
| `create_run` / list / compare | Unit tests `tests/tracking` (8 passed after path-redaction fix) |
| `ArcLM` forward shape / param count | Executed (1,3,11) / 3531 |
| CLI command list | `arclm --help` + `cli.py` (T16) |
| `arclm doctor` without torch | Executed; light-import tests |
| `load_any_model` + `predict` + `chat` on tiny-gpt2 | Executed (T17, T19) |
| `train_model` / tiny pretrain smoke | `examples/04_training` loss 3.07→2.68 (T10) |
| Python 3.9–3.14 light smoke | Six local venvs PASS |
| Root lazy exports / optional torch errors | `tests/unit/test_light_imports.py` |

## Not fully verified in this documentation pass

| Item | Status |
|---|---|
| Every HTML page rendered in a browser | Structure checked; open via `http.server` recommended |
| Full-text search on all pages | Implemented via fetch; depends on local server |
| `train_sft` end-to-end with real HF model | Not run in docs session (network/model size) |
| QLoRA / bitsandbytes paths | Not run |
| Web Studio HTTP API | Not run in docs session |
| Blocks `build-all` after last src edits | Was green earlier same day; re-run after further changes |

## Rules used while writing docs

- No invented function names, defaults, or return types.
- Examples marked “Verified” were executed or match repository verified examples.
- Fixtures that produce nonsense text (tiny-gpt2) are labeled as fixtures.
- Experimental features (multi-GPU) labeled experimental.

## How to re-verify quickly

```bash
pytest tests/unit/test_light_imports.py tests/unit/datasets -q
python examples/run_examples.py run-verified
arclm doctor
```
