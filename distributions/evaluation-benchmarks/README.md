# ArcLM Evaluation and Benchmarks

Evaluation metrics, reports, checkpoint comparison and local benchmark helpers.

This directory is generated from canonical ArcLM source. Do not edit generated source files directly.

## Contains

- evaluation
- metrics
- perplexity
- reports
- benchmarks

## Excludes

- arclm.simple_interface
- arclm.web
- arclm.agents

## Quick Start

```bash
python -c "from arclm.evaluation import EvaluationResult; print(EvaluationResult)"
```

## Relationship To Full ArcLM

This edition preserves the `arclm` namespace for independent installation. Do not install multiple partial ArcLM editions together unless composition is explicitly supported.
