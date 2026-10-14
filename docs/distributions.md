# ArcLM Blocks — Architecture

How trimmed editions ("blocks") are defined, generated, and kept in sync with
the canonical `src/arclm` source.

For the user-facing pitch, install commands, and the block matrix, see
[`distributions/README.md`](../distributions/README.md).

## Design goals

1. **Single source of truth** — blocks are never hand-edited; they are
   generated from `src/arclm` + JSON manifests.
2. **Hard boundaries** — the builder refuses to emit a block whose required
   imports cross an excluded module prefix.
3. **Drift detection** — every generated file is inventoried with SHA-256;
   `check-drift` compares inventories to canonical source.
4. **Light where possible** — blocks that do not need torch must not pull it.

## Manifest schema (v1)

```json
{
  "schema_version": 1,
  "id": "core",
  "name": "ArcLM Core Block",
  "description": "...",
  "source_package": "src/arclm",
  "capabilities": ["..."],
  "include_modules": ["arclm._version", "arclm.configs", "..."],
  "include_module_prefixes": [],
  "include_assets": ["arclm/py.typed"],
  "required_distributions": [],
  "excluded_module_prefixes": ["arclm.web", "arclm.training", "..."],
  "python_dependencies": ["numpy>=1.24,<3"],
  "optional_dependencies": {},
  "public_api": ["arclm.configs", "..."],
  "excluded_apis": ["arclm.training", "..."],
  "commands": ["python -c \"...\""],
  "tests": ["tests/unit/..."],
  "examples": ["examples/01_data/01_load_validate_report.py"],
  "documentation": ["README.md", "docs/distributions.md"],
  "license": "Apache-2.0"
}
```

| Field | Meaning |
|---|---|
| `include_modules` | Root modules to expand (packages expand recursively) |
| `excluded_module_prefixes` | Hard boundary — required imports into these fail the build |
| `python_dependencies` | Written into the generated `pyproject.toml` |
| `optional_dependencies` | Extra maps for the generated package |
| `examples` | Paths copied into the block's `examples/` folder |

## Import analysis

`analyze(manifest)` in `tools/build_arclm_distributions.py`:

1. Expand `include_modules` / `include_module_prefixes` into a seed set.
2. For each module, parse the AST and record import edges.
3. Function/class-scoped imports are **optional** (lazy) edges.
4. Module-level imports into an excluded prefix → **blocking** excluded hit.
5. Unresolved `arclm.*` targets (no file on disk) → build failure.

This catches accidental coupling early: e.g. a light agents block must not
module-level import `arclm.security` (which pulls crypto); import the precise
submodule instead (`arclm.security.configuration`).

## Generated layout per block

```text
distributions/<id>/
├── README.md                    # purpose, install, quick start
├── INSTALLATION.md              # git + local install commands
├── USAGE.md
├── API.md
├── LIMITATIONS.md
├── LICENSE
├── NOTICE.md
├── MANIFEST.in
├── pyproject.toml               # package name: arclm-<id>
├── distribution-manifest.json   # copy of the manifest
├── source-inventory.json        # SHA-256 inventory + source_version
├── examples/                    # copied example scripts
└── src/arclm/
    ├── __init__.py              # generated lazy public API
    ├── __main__.py
    ├── cli.py                   # trimmed CLI
    ├── _distribution.py         # embedded DISTRIBUTION_INFO
    ├── _version.py              # copied from canonical
    └── …                        # only reachable modules
```

## Keeping blocks honest

| Check | Command |
|---|---|
| Hash drift vs canonical | `python tools/build_arclm_distributions.py check-drift` |
| Compile + inventory | `python tools/build_arclm_distributions.py test-all` |
| Unit tests in repo | `pytest tests/distributions` |

Regenerate after any public import change in `src/arclm`:

```bash
python tools/build_arclm_distributions.py build-all
python tools/build_arclm_distributions.py check-drift
python tools/build_arclm_distributions.py test-all
```

## Relationship to extras

| Mechanism | Purpose | Example |
|---|---|---|
| **Extras** (full package) | Optional heavy deps on one install | `pip install "arclm[train]"` |
| **Blocks** (this feature) | Trimmed source editions | `pip install arclm-core` |

Use extras when you want the full API surface with optional backends.
Use blocks when you want only a subset of modules and a smaller footprint.

## Known limitations

- Blocks all provide the `arclm` namespace — install one block **or** full
  ArcLM, not both.
- Manifest curation is manual; the builder enforces consistency but cannot
  invent the right include set.
- Wheel size budgets are not enforced yet.
- PyPI publishing / namespace-package composition is out of scope for now;
  install via git (`#subdirectory=distributions/<id>`) or local builds.
