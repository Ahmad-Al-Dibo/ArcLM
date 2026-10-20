# ArcLM Framework Presentation Website

Static HTML/CSS/vanilla-JS site that presents ArcLM as a complete technical
project **and** hosts the API reference. Traditional documentation style
(light background, sidebar, TOC, search).

```text
framework-site/
├── index.html … roadmap.html   # Framework presentation
├── reference/                  # API reference (was docs-site/)
│   ├── index.html, install, quickstart, packages, cli, …
│   └── modules/                # Per-package API pages
├── css/site.css
├── js/site.js                  # Presentation nav + search
├── js/ref-nav.js               # Reference nav + search
├── INVENTORY.md
└── VERIFICATION.md
```

For contributor routing see [`CODEBASE_GUIDE.md`](../CODEBASE_GUIDE.md).

## Run locally

Search fetches page content, so use a local HTTP server:

```bash
cd framework-site
python -m http.server 8000
# http://127.0.0.1:8000/
```

`index.html` can be opened directly for reading; search may be limited on `file://`.

## Pages

| Page | Content |
|---|---|
| `index.html` | Introduction, audience, principles, what it is not |
| `philosophy.html` | Motivation and design decisions |
| `getting-started.html` | Requirements, install, first examples, troubleshooting |
| `concepts.html` | Record, Config, tokenizer, optional torch, Block, tool, run, … |
| `architecture.html` | SVG layer diagram, modules, boundaries |
| `workflows.html` | End-to-end workflows A–G |
| `features-data.html` | Datasets, cleaning, tokenizers |
| `features-training.html` | Model, Trainer, SFT, PEFT, GPU |
| `features-inference.html` | Native + HF generation, evaluation |
| `features-agents.html` | Agents, security |
| `features-platform.html` | CLI, tracking, Blocks, Studio, examples/lab |
| `examples.html` | Beginner / developer / advanced examples |
| `audiences.html` | App dev, researcher, contributor workflows |
| `positioning.html` | Qualitative comparisons |
| `status.html` | What works, experimental, unsupported |
| `roadmap.html` | Near/mid/long-term with Implemented/Planned/Proposed labels |
| `reference/**` | Full API reference (modules, CLI, errors, troubleshooting) |

## Maintain

1. Update content when framework APIs or status change.
2. Add new pages to `NAV` and `__ARCLM_NAV_INDEX` in `js/site.js`.
3. Keep claims aligned with source and tests (`framework-site/VERIFICATION.md`).
4. Distinguish **Proposed** roadmap items from implemented work.

## Design rules

- No frameworks, no animations, no marketing landing layout.
- Copy buttons on code blocks; search over page text.
- Prefer verified examples (tiny-gpt2, redaction, tokenizer IDs, etc.).
