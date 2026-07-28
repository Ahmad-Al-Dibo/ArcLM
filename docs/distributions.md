# ArcLM Standalone Distributions

Status: distribution tooling beta, canonical source unchanged.

ArcLM is maintained as one canonical package under `src/arclm`. Smaller
standalone editions are generated from explicit manifests in
`distributions/manifests/` by `tools/build_arclm_distributions.py`. Do not edit
generated edition files by hand; change canonical source or a manifest, rebuild,
and verify drift.

## Editions

| Edition | Purpose |
| --- | --- |
| `core` | Native datasets, tokenizers, models, checkpoints, evaluation, inference and inspection without web UI or agents. |
| `simple-interface` | Local Flask GPT-style chat interface, model loading, inference, inspection, prompt queue, terminal events and optional safe agents. |
| `loading-inference` | Model loading, checkpoint loading, generation, inspection and lifecycle helpers without training loops or web UI. |
| `data-tokenizers` | Dataset validation/reporting, preprocessing and tokenizer utilities. |
| `training` | Native model training, checkpoints and evaluation. |
| `finetuning` | SFT, adapter and PEFT/LoRA-oriented fine-tuning helpers. |
| `evaluation-benchmarks` | Evaluation, benchmarking, benchmark suites and inspection helpers. |
| `agents-tools` | Agent runtime, typed tools, safe built-ins and required security boundaries. |
| `security` | Security Core policy, redaction, hashing, signing, encryption and safe path/network helpers. |

## Commands

```bash
python tools/build_arclm_distributions.py list
python tools/build_arclm_distributions.py inspect simple-interface
python tools/build_arclm_distributions.py graph simple-interface
python tools/build_arclm_distributions.py build simple-interface
python tools/build_arclm_distributions.py build-all
python tools/build_arclm_distributions.py verify simple-interface
python tools/build_arclm_distributions.py test-all
python tools/build_arclm_distributions.py check-drift
```

Each generated edition includes its own `pyproject.toml`, `MANIFEST.in`,
license, notice, README, installation notes, usage notes, API summary,
limitations, manifest and source inventory. The inventory records source file
hashes so `check-drift` can detect when canonical files changed after an
edition was generated.

## Boundaries

The builder follows Python imports from manifest roots. Imports inside functions
or `TYPE_CHECKING` blocks are treated as optional/lazy edges and reported
separately from required module-load edges. A build fails when a required edge
crosses into an excluded module. This prevents, for example, the
`simple-interface` and `loading-inference` editions from requiring the native
training loop at import time.

Generated editions keep the `arclm` import namespace and are intended to be
installed independently. Do not install two editions side by side in the same
environment.

## Verification

For every edition, run:

```bash
python tools/build_arclm_distributions.py build <edition>
python tools/build_arclm_distributions.py verify <edition>
python -m build --wheel distributions/<edition>
```

For the whole repository, run:

```bash
python -m compileall -q src tests examples lab
python -m pytest tests/distributions -q
python -m pytest -q
python -m build
```

Clean-environment launch tests are still required before publishing an edition.
Use a fresh virtual environment per wheel when validating optional dependency
sets.

## Limitations

- Distribution manifests are curated manually and should be reviewed whenever
  public imports change.
- The builder reports optional lazy edges but does not prove every optional code
  path is runtime-compatible without its extra dependencies.
- Wheel size and installed-size budgets are not yet enforced automatically.
- Generated editions are local release artifacts; this workflow does not commit,
  tag, push or publish packages.
