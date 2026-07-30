# ArcLM Multilingual Pre-training Project

This workspace project is now organized around a compact Arabic–Dutch decoder-only model targeting roughly 50 million trainable parameters. It is meant to serve as a practical reference implementation for a multilingual language-model pretraining workflow rather than a toy demo-only setup.

## 50M-parameter target

The default architecture uses:

- vocabulary size: 24,576
- context length: 512
- embedding dimension: 512
- feed-forward hidden size: 2,048
- transformer layers: 8
- attention heads: 8
- activation: GELU
- normalization: LayerNorm
- dropout: 0.10

These choices keep the model in a realistic small-scale pretraining range while still giving it enough capacity for useful multilingual behavior.

## Token-budget guidance

For a 50M-parameter model, a serious run typically needs on the order of 10B–20B training tokens, while a smaller experimental baseline can begin from around 5B tokens. The bundled sample corpus is only a smoke-test dataset and should not be treated as a full-scale pretraining corpus.

## Data strategy

The project is designed around a balanced Arabic–Dutch corpus with a strong quality filter. A practical language split is about 55% Arabic and 45% Dutch, with additional attention to general-domain, educational, scientific, and documentation-style text.

## Project structure

- data/: sample corpora and input files
- outputs/: tokenizer artifacts, reports, checkpoints, and metrics
- arclm_multilingual_pretraining/: modular Python package
- docs/: architecture, dataset research, tokenizer notes

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

A well-trained 50M-parameter Arabic–Dutch model should be able to handle basic language understanding, coherent next-token generation, summarization, and limited translation-like behavior. It will not match the quality of much larger frontier models, but it is realistic for a compact local or modest-GPU pretraining experiment.
