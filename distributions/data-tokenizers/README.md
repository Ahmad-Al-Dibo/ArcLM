# ArcLM Data and Tokenizers

Dataset loading, validation, cleaning, deduplication, statistics and tokenizer utilities.

This directory is generated from canonical ArcLM source. Do not edit generated source files directly.

## Contains

- datasets
- validation
- cleaning
- deduplication
- tokenizers
- preprocessing

## Excludes

- arclm.training
- arclm.finetuning
- arclm.web
- arclm.agents

## Quick Start

```bash
python -c "from arclm.tokenizers import Tokenizer; print(Tokenizer)"
```

## Relationship To Full ArcLM

This edition preserves the `arclm` namespace for independent installation. Do not install multiple partial ArcLM editions together unless composition is explicitly supported.
