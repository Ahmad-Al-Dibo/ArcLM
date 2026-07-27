# ArcLM Loading and Inference

Standalone model construction, checkpoint loading, inspection and generation utilities.

This directory is generated from canonical ArcLM source. Do not edit generated source files directly.

## Contains

- model_loading
- checkpoint_loading
- inference
- generation
- inspection

## Excludes

- arclm.web
- arclm.simple_interface
- arclm.training
- arclm.finetuning
- arclm.agents

## Quick Start

```bash
python -c "from arclm.inference import GenerationConfig; print(GenerationConfig())"
```

## Relationship To Full ArcLM

This edition preserves the `arclm` namespace for independent installation. Do not install multiple partial ArcLM editions together unless composition is explicitly supported.
