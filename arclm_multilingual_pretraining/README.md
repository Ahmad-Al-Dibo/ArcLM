# ArcLM Multilingual Pre-training Project

This project is now redesigned around a compact multilingual decoder-only model targeting roughly 50 million trainable parameters. The configuration is intentionally aligned with current best practices for a small but meaningful Arabic–Dutch pretraining run rather than a toy demo setup.

## 50M-parameter target

The default architecture uses:

- vocabulary size: 24,576
- context length: 512
- embedding dimension: 512
- hidden dimension: 2,048 in the feed-forward blocks
- transformer layers: 10
- attention heads: 8
- dropout: 0.10
- normalization: LayerNorm
- activation: GELU

This configuration is chosen to keep the model near 50M parameters while still providing enough capacity for multilingual next-token prediction and basic transferability.

## Why this design

A 50M-parameter model is large enough to learn useful multilingual structure from a curated corpus, but small enough to train locally or on modest GPU hardware. The design uses a reasonably large embedding dimension and a deeper stack of transformer layers so the model is not bottlenecked by a tiny hidden size.

## Recommended token budget

For a 50M-parameter model, the practical training target is roughly 10B to 20B tokens for a serious run, with 5B tokens as a minimum viable baseline for experimentation. In this workspace project, the bundled sample corpus is only a smoke-test dataset, so the training entry point should be treated as a lightweight verification workflow rather than a production-quality pretraining run.

## Data strategy

The project is set up to support Arabic and Dutch data in a balanced way. A practical balance is roughly 55% Arabic and 45% Dutch for the first phase, with the remainder reserved for multilingual general-domain content and documentation. The preprocessing pipeline is designed to filter low-quality data and keep only clean, well-formed text.

## Quick start

```bash
python -m arclm_multilingual_pretraining.run --mode train
```

## Training

```bash
python -m arclm_multilingual_pretraining.run --mode train --input data/sample_corpus.txt
```

## Evaluation

```bash
python -m arclm_multilingual_pretraining.run --mode evaluate
```

## Expected capabilities

A well-trained 50M-parameter Arabic–Dutch model should be able to do basic language understanding, next-token generation, simple summarization, question answering, and limited translation-like behavior. It will not match the quality of much larger models, but it can still be useful for small-scale retrieval, assistive writing, and multilingual demos.
