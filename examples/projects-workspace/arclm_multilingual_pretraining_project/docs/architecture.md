# Architecture Notes

## Overview

The reference model is a decoder-only causal Transformer designed for a compact but realistic multilingual pretraining run. The goal is to stay near 50 million trainable parameters while retaining enough depth and width for Arabic and Dutch next-token prediction.

## Recommended configuration

- Vocabulary size: 24,576
- Context length: 512
- Embedding dimension: 512
- Feed-forward hidden size: 2,048
- Transformer layers: 8
- Attention heads: 8
- Positional embedding: learned absolute
- Activation: GELU
- Normalization: LayerNorm
- Dropout: 0.10

## Why these choices

A 50M-parameter model works best when the architecture is moderately wide and reasonably deep. The chosen settings give enough capacity to learn multilingual structure without pushing the run into a compute-heavy regime. A context length of 512 is a practical default for a compact local pretraining job and is large enough to capture useful local context for both languages.

## Parameter estimate

The current configuration is designed to stay in the 48M–50M parameter range for the model body and output head combined. This is large enough to be meaningful for a small bilingual pretraining experiment, while still keeping training and evaluation feasible on modest hardware.

## Training implications

- Larger vocabularies improve multilingual coverage but increase embedding and output-head cost.
- A context length of 512 is a good balance between quality and efficiency.
- Eight layers with a 512-dimensional hidden state gives the model enough depth to learn non-trivial patterns without exploding compute.
