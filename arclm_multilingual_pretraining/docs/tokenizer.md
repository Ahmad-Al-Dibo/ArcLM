# Tokenizer Documentation

The project uses ArcLM's built-in word tokenizer as a practical baseline tokenizer for a small multilingual pre-training prototype.

## Why this tokenizer

- It is simple and reliable
- It works directly with ArcLM's model training flow
- It keeps the project understandable and efficient

## Normalization

The preprocessing pipeline normalizes whitespace, removes markup and URLs, and preserves Unicode characters for Arabic and Dutch text.
