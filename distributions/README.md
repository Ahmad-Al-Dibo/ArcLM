# ArcLM Distributions

This directory defines smaller, reproducible ArcLM editions generated from the
canonical source in `src/arclm`.

The full ArcLM framework remains the source of truth. Generated editions are
materialized by `tools/build_arclm_distributions.py` from explicit manifests in
`distributions/manifests/`; do not maintain hand-copied forks.

Chosen layout:

```text
src/arclm/                 canonical ArcLM package
distributions/manifests/   edition manifests
distributions/<edition>/   generated standalone edition output
tools/                     distribution builder and dependency tooling
```

Complete standalone projects are kept at the repository root rather than under
`src/` so package discovery for the canonical `arclm` package remains clear.

Useful commands:

```bash
python tools/build_arclm_distributions.py list
python tools/build_arclm_distributions.py inspect simple-interface
python tools/build_arclm_distributions.py graph simple-interface
python tools/build_arclm_distributions.py build simple-interface
python tools/build_arclm_distributions.py build-all
python tools/build_arclm_distributions.py verify simple-interface
python tools/build_arclm_distributions.py check-drift
```

Generated editions preserve license text and include a notice explaining that
the source was extracted from canonical ArcLM. Multiple editions use the same
`arclm` import namespace and are intended to be installed independently, not
side by side in one environment.
