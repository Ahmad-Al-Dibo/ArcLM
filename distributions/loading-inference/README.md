# ArcLM Loading & Inference Block

Load native or external models, generate text, and inspect one generation step. Requires PyTorch.

This directory is generated from canonical ArcLM source. Do not edit generated source files directly.

## Contains

- inference
- generation
- models
- checkpoints
- inspection

## Excludes

- arclm.training
- arclm.finetuning
- arclm.web
- arclm.evaluation

## Install

From a built wheel in this directory:

```bash
pip install .
```

Or directly from the canonical repository (once published):

```bash
pip install "git+https://github.com/ahmad-al-dibo/arclm.git#subdirectory=distributions/loading-inference"
```

## Quick Start

```bash
python -c "from arclm.inference import load_model, Generator; print(Generator)"
```

## Relationship To Full ArcLM

This block is a trimmed, self-contained edition of ArcLM. Install it **instead of** the full package, not alongside it.
