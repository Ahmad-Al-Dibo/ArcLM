# ArcLM Core Block

Light ArcLM building block: configuration, datasets, tokenizers, exceptions, registry and utilities. No PyTorch required.

This directory is generated from canonical ArcLM source. Do not edit generated source files directly.

## Contains

- version_metadata
- configuration
- datasets
- tokenizers
- exceptions
- registry
- formatting

## Excludes

- arclm.training
- arclm.finetuning
- arclm.web
- arclm.agents
- arclm.inference

## Install

From a built wheel in this directory:

```bash
pip install .
```

Or directly from the canonical repository (once published):

```bash
pip install "git+https://github.com/ahmad-al-dibo/arclm.git#subdirectory=distributions/core"
```

## Quick Start

```bash
python -c "from arclm.configs import Config; print(Config().embed_dim)"
python -c "from arclm.tokenizers import Tokenizer; print(Tokenizer)"
```

## Relationship To Full ArcLM

This block is a trimmed, self-contained edition of ArcLM. Install it **instead of** the full package, not alongside it.
