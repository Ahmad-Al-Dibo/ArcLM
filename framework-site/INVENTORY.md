# Content inventory — framework presentation site

**Date:** 2026-10-16 · **ArcLM:** 2.0.0

## Section coverage

| Required topic | Page(s) | Depth |
|---|---|---|
| A. Introduction | `index.html` | Full |
| B. Motivation & philosophy | `philosophy.html` | Full (decisions + costs) |
| C. Core concepts | `concepts.html` | Full (record → extra) |
| D. Architecture | `architecture.html` | Full + SVG diagram |
| E. Features | `features-data/training/inference/agents/platform.html` | Grouped, multi-feature |
| F. How it works | `workflows.html` | 7 workflows |
| G. Practical examples | `examples.html` + workflows | B1–B3, D1–D5, A1–A3 |
| H. Getting started | `getting-started.html` | Full |
| I. Dev/researcher workflows | `audiences.html` | Full |
| J. Comparison & positioning | `positioning.html` | Qualitative matrix |
| K. Limitations & status | `status.html` | Full |
| L. Future roadmap | `roadmap.html` | Near/mid/long + labels |

## Framework areas touched

- Install / extras / Python 3.9–3.14
- configs, datasets, tokenizers, security, agents, tracking, search, logics
- models, training, inference, finetuning, checkpoints, evaluation, peft, inspection
- CLI, Web Studio (backend + frontend mention), Blocks, examples, lab
- Optional torch boundary, error model, security fail-closed

## Cross-links

- To `framework-site/` API pages
- To `CODEBASE_GUIDE.md`, `README.md`, `CHANGELOG.md`, examples catalogue

## Not covered (by design)

- Full API signatures (see `reference/`)
- Next.js frontend internals
- Step-by-step PyPI release (see `docs/releasing.md`)
