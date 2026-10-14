# ArcLM Blocks

**Trimmed, self-contained editions of the ArcLM framework.**

Install one *block* instead of the full library when you only need a subset —
smaller footprint, clearer architecture boundaries, easier to study and embed.

Blocks are generated from the canonical `src/arclm` source by an AST-based
builder that copies only the modules each block needs and fails if a required
import crosses an excluded boundary.

> Blocks are **alternatives** to full ArcLM, not add-ons.  
> For optional heavy dependencies on the full package, use extras
> (`pip install "arclm[train]"`).

## Why blocks?

| You are… | Use |
|---|---|
| A researcher embedding a data pipeline into another project | `arclm-core` |
| A student studying only the training loop | `arclm-training` |
| Shipping an agent without pulling torch | `arclm-agents-tools` |
| Building a security layer for an existing app | `arclm-security` |
| A production team that wants the full stack | full `arclm` + extras |

This follows established packaging patterns: trimmed monorepo "packs"
(auto-split editions), the opposite of monolithic single-package libraries.
Full ArcLM remains the canonical, best-supported install.

## Block matrix

| Block | Install name | PyTorch | What you get |
|---|---|---|---|
| **Core** | `arclm-core` | no | Config, datasets, tokenizers, exceptions, registry, utils |
| **Training** | `arclm-training` | yes | Native Trainer, ArcLM models, checkpoints, tracking |
| **Fine-tuning** | `arclm-finetuning` | yes | SFT workflows, full fine-tuners, adapters |
| **Loading & Inference** | `arclm-loading-inference` | yes | Model load, generation, pipeline inspection |
| **Evaluation** | `arclm-evaluation-benchmarks` | yes | Metrics, reports, training diagnostics |
| **Agents & Tools** | `arclm-agents-tools` | no | Agent runtime, typed tools, permissions, tracing |
| **Security** | `arclm-security` | no | Crypto, signing, redaction, safe paths/URLs |

## Install

### From the canonical repository (git)

Once the repository is public:

```bash
pip install "git+https://github.com/ahmad-al-dibo/arclm.git#subdirectory=distributions/core"
pip install "git+https://github.com/ahmad-al-dibo/arclm.git#subdirectory=distributions/training"
pip install "git+https://github.com/ahmad-al-dibo/arclm.git#subdirectory=distributions/security"
# ... same pattern for every block folder
```

### From a local build

```bash
# Build every block from canonical source
python tools/build_arclm_distributions.py build-all

# Install one block
pip install distributions/core
pip install distributions/training
```

### Verify a build

```bash
python tools/build_arclm_distributions.py check-drift   # hashes match canonical src/
python tools/build_arclm_distributions.py test-all      # compile + inventory checks
```

## Builder

`tools/build_arclm_distributions.py` is the single source of truth.

| Command | Purpose |
|---|---|
| `list` | Show all blocks |
| `graph <id>` | Import graph for one block |
| `inspect <id>` | Modules, sizes, dependency edges |
| `build <id>` / `build-all` | Generate `distributions/<id>/` |
| `verify <id>` | Hash + compileall + extra-file check |
| `test-all` | Verify every built block |
| `check-drift` | Compare inventories against canonical `src/` |

Manifests live in [`manifests/`](manifests/). Each generated block carries its
own `distribution-manifest.json` and `source-inventory.json` (SHA-256 per file).

### How the builder works

1. Reads a manifest (`include_modules`, excludes, deps).
2. Walks the AST import graph from the included roots.
3. **Fails** if a required import reaches an excluded module (boundary guard).
4. Treats function/class-scoped imports as *optional* edges (lazy).
5. Copies only reachable modules + assets; embeds `DISTRIBUTION_INFO` in
   `src/arclm/_distribution.py`.
6. Writes per-block `pyproject.toml`, README, INSTALLATION, USAGE, API,
   LIMITATIONS, LICENSE, NOTICE.

## Adding a new block

1. Create `manifests/<id>.json` (copy an existing one; set `include_modules`
   and `excluded_module_prefixes`).
2. Run `python tools/build_arclm_distributions.py build <id>`.
3. Fix any excluded-dependency or unresolved-import errors the builder reports.
4. Run `check-drift` and `test-all`.
5. Add the block row to the matrix above.

Rules of thumb:

- Light blocks (no torch): list only pure-Python modules; never include
  `arclm.models`, `arclm.training`, `arclm.inference`.
- Torch blocks: include the model/training surface plus its dataset/tokenizer
  dependencies; keep agents/security/peft excluded unless truly needed.
- Prefer precise imports in canonical source (e.g.
  `from arclm.security.configuration import SecurityPolicy`) so light blocks
  do not accidentally pull heavy packages.

## Layout

```text
distributions/
├── README.md                 # this file
├── manifests/                # source of truth (JSON per block)
│   ├── core.json
│   ├── training.json
│   ├── finetuning.json
│   ├── loading-inference.json
│   ├── evaluation-benchmarks.json
│   ├── agents-tools.json
│   └── security.json
├── core/                     # generated (do not hand-edit)
├── training/
├── finetuning/
├── loading-inference/
├── evaluation-benchmarks/
├── agents-tools/
└── security/
```

Generated folders are rebuildable artifacts. Edit manifests or canonical
`src/arclm`, then re-run `build-all`.

## Limitations

- Blocks are **source editions**, not smaller model weights.
- Do not install multiple blocks together unless composition is explicitly
  supported — they all provide the `arclm` package name.
- Manifests are curated manually; re-run `check-drift` whenever public imports
  change in `src/arclm`.
- PyPI publishing is not set up yet; install from git or local builds.

## Related

- Full documentation: [`docs/guide.md`](../docs/guide.md)
- Builder internals: [`docs/distributions.md`](../docs/distributions.md)
- Full package install: [`../README.md`](../README.md)
