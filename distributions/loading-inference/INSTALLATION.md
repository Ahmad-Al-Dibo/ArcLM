# Installation

## From this directory (after build)

```bash
pip install .
```

## From the canonical repository (git)

```bash
pip install "git+https://github.com/ahmad-al-dibo/arclm.git#subdirectory=distributions/loading-inference"
```

## Rebuild from canonical source

```bash
python tools/build_arclm_distributions.py build loading-inference
```

Do not install multiple ArcLM blocks together unless composition is explicitly supported.
