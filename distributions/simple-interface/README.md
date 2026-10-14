# ArcLM Simple Interface

A standalone local Flask chat interface with model loading, inspection, streaming events, prompt queue and optional safe Agent integration.

This directory is generated from canonical ArcLM source. Do not edit generated source files directly.

## Contains

- simple_interface
- model_loading
- inference
- inspection
- chat_templates
- prompt_queue
- terminal_events
- agents_optional

## Excludes

- arclm.web
- arclm.training
- arclm.finetuning
- arclm.peft

## Quick Start

```bash
python -m arclm --run simple-interface
```

## Relationship To Full ArcLM

This edition preserves the `arclm` namespace for independent installation. Do not install multiple partial ArcLM editions together unless composition is explicitly supported.
