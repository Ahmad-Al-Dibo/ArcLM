# ArcLM Evaluation Block

Metrics (accuracy, perplexity, loss), evaluation reports and training diagnostics. Requires PyTorch.

This directory is generated from canonical ArcLM source. Do not edit generated source files directly.

## Contains

- evaluation
- metrics
- diagnostics
- reports

## Excludes

- arclm.finetuning
- arclm.web
- arclm.agents

## Install

From a built wheel in this directory:

```bash
pip install .
```

Or directly from the canonical repository (once published):

```bash
pip install "git+https://github.com/ahmad-al-dibo/arclm.git#subdirectory=distributions/evaluation-benchmarks"
```

## Quick Start

```bash
python -c "from arclm.evaluation import Evaluator, Accuracy, Perplexity; print(Evaluator)"
```

## Relationship To Full ArcLM

This block is a trimmed, self-contained edition of ArcLM. Install it **instead of** the full package, not alongside it.
