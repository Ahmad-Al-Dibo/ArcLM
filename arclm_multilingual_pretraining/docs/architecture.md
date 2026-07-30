# Architecture Notes

The model is a decoder-only causal transformer built with ArcLM's native layer stack.

## Components

- Embedding layer: maps token IDs to dense vectors
- Positional embeddings: provide sequence order information
- Transformer blocks: stack self-attention and feed-forward layers
- Multi-head attention: captures contextual dependencies
- Feed-forward network: expands and contracts hidden states
- Residual connections: preserve information flow
- Output layer: predicts the next token
