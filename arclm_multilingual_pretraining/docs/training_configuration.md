# Training Configuration Research

## Recommended values

- Vocabulary size: 4096
- Sequence length: 256
- Embed dimension: 384
- Hidden size: 1536
- Layers: 6
- Attention heads: 6
- Dropout: 0.10
- Optimizer: AdamW
- Learning rate: 3e-4
- Weight decay: 0.01
- Batch size: 8
- Gradient accumulation: 4
- Warmup: 100 steps

These values are selected as a balanced starting point for a compact bilingual pre-training experiment that remains feasible on a CPU or small GPU.
