# ArcLM Core

Minimal shared ArcLM configuration, version, exceptions, registry and utility primitives.

This directory is generated from canonical ArcLM source. Do not edit generated source files directly.

## Contains

- version_metadata
- configuration
- exceptions
- registry
- formatting

## Excludes

- arclm.simple_interface
- arclm.web
- arclm.training
- arclm.finetuning
- arclm.agents

## Quick Start

```bash
python -c "import arclm; print(arclm.get_distribution_info())"
```

## Relationship To Full ArcLM

This edition preserves the `arclm` namespace for independent installation. Do not install multiple partial ArcLM editions together unless composition is explicitly supported.
