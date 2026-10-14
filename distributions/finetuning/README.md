# ArcLM Fine-tuning Block

Supervised fine-tuning (SFT) workflows, full fine-tuners, adapters and native training support. Requires PyTorch.

This directory is generated from canonical ArcLM source. Do not edit generated source files directly.

## Contains

- finetuning
- sft
- adapters
- training
- models
- checkpoints

## Excludes

- arclm.web
- arclm.evaluation
- arclm.inference

## Install

From a built wheel in this directory:

```bash
pip install .
```

Or directly from the canonical repository (once published):

```bash
pip install "git+https://github.com/ahmad-al-dibo/arclm.git#subdirectory=distributions/finetuning"
```

## Quick Start

```bash
python -c "from arclm.finetuning import FineTuningConfig, train_sft; print(FineTuningConfig)"
```

## Relationship To Full ArcLM

This block is a trimmed, self-contained edition of ArcLM. Install it **instead of** the full package, not alongside it.
