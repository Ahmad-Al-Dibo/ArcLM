# ArcLM Fine-Tuning

SFT record preparation, formatting, collators, full fine-tuning and checkpoint metadata.

This directory is generated from canonical ArcLM source. Do not edit generated source files directly.

## Contains

- sft
- finetuning
- formatting
- response_labels
- checkpoint_metadata

## Excludes

- arclm.simple_interface
- arclm.web
- arclm.agents

## Quick Start

```bash
python -c "from arclm.finetuning import SFTConfig; print(SFTConfig)"
```

## Relationship To Full ArcLM

This edition preserves the `arclm` namespace for independent installation. Do not install multiple partial ArcLM editions together unless composition is explicitly supported.
