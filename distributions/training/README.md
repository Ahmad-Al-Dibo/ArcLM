# ArcLM Training Block

Native training loop, ArcLM models, checkpoints, evaluation metrics and experiment tracking. Requires PyTorch.

This directory is generated from canonical ArcLM source. Do not edit generated source files directly.

## Contains

- training
- models
- checkpoints
- tracking
- distributed_contracts

## Excludes

- arclm.finetuning
- arclm.web
- arclm.inference
- arclm.evaluation

## Install

From a built wheel in this directory:

```bash
pip install .
```

Or directly from the canonical repository (once published):

```bash
pip install "git+https://github.com/ahmad-al-dibo/arclm.git#subdirectory=distributions/training"
```

## Quick Start

```bash
python -c "from arclm.models import ArcLM; print(ArcLM)"
python -c "from arclm.training import Trainer, TrainingConfig; print(Trainer)"
```

## Relationship To Full ArcLM

This block is a trimmed, self-contained edition of ArcLM. Install it **instead of** the full package, not alongside it.
