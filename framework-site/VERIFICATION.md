# Verification report — framework presentation site

**Date:** 2026-10-16

## Content accuracy basis

| Claim area | Evidence |
|---|---|
| Light install / no torch | `pyproject.toml`, `test_light_imports.py`, local six-version smoke |
| Tokenizer output `[2,3,4]`, vocab 11 | Executed T02 |
| Config YAML round-trip | Executed T15 |
| Dedupe kept 2 / removed 1 | Executed T20 |
| Redaction `[REDACTED]` | Executed T21 + examples |
| Agent tool JSON | Executed T06 |
| ArcLM forward `(1,3,11)` / 3531 params | Executed T04 |
| Training smoke loss 3.07→2.68 | Executed T10 / examples/04 |
| tiny-gpt2 load+predict+chat | Executed T17, T19 |
| CLI command list | `arclm --help` T16 |
| Python 3.9–3.14 | Local venvs + CI light matrix |
| Blocks builder | Earlier session build-all + test-all green |
| Roadmap labels | Implemented = verified above; Planned = article/launch materials; Proposed = analysis |

## Website checks

| Check | Result |
|---|---|
| Pages present | 16 HTML + CSS + JS + 3 MD reports |
| Local link checker | To be run post-build (see session log) |
| Sidebar NAV vs files | NAV entries match page set |
| Search index list | `__ARCLM_NAV_INDEX` in site.js matches pages |
| Console JS | Vanilla; no external CDNs |
| Design | Light docs style, copy buttons, SVG diagram |

## Not executed in this pass

- Full browser screenshot QA on every viewport
- Offline `file://` search (documented limitation)

## Uncertainties

- Some feature pages summarize APIs; authoritative signatures live in `reference/`.
- Roadmap Proposed items are not GitHub issues yet.

## How to re-verify content examples

```bash
pip install -e ".[dev,train,hf,security]"
pytest tests/unit/test_light_imports.py tests/unit/datasets -q
python examples/run_examples.py run-verified
```
