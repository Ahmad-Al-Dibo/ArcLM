# ArcLM Training

Native model construction, training configuration, training loop, callbacks, metrics and checkpoints.

This directory is generated from canonical ArcLM source. Do not edit generated source files directly.

## Contains

- training
- models
- datasets
- tokenizers
- checkpoints
- evaluation_hooks

## Excludes

- arclm.simple_interface
- arclm.web
- arclm.agents

## Quick Start

```bash
python -c "from arclm.training import TrainingConfig; print(TrainingConfig)"
```

## Relationship To Full ArcLM

This edition preserves the `arclm` namespace for independent installation. Do not install multiple partial ArcLM editions together unless composition is explicitly supported.
