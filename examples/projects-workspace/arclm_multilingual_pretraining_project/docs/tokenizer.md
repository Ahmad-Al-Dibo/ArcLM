# Tokenizer Documentation

For a 50M-parameter multilingual model, a subword tokenizer is the most practical choice. A byte-level or BPE-style tokenizer provides better coverage for Arabic morphology, Dutch compounds, and mixed-script text than a purely word-based tokenizer.

## Recommended tokenizer

- Vocabulary size: 24,576
- Normalization: Unicode normalization plus whitespace cleanup
- Model: BPE-style subword tokenizer
- Special tokens: BOS, EOS, PAD, UNK, MASK
- Training corpus: a balanced sample of Arabic and Dutch text

## Why this choice

Arabic and Dutch both benefit from subword segmentation because they contain rich morphology and frequent word compounding. A subword tokenizer reduces unknown-token rate and improves compression efficiency compared with a basic word-level approach.

## Expected behavior

- Good coverage for common Arabic words and affixes
- Reasonable handling of Dutch compounds and inflections
- Better token efficiency than character-only tokenization
- Lower unknown-token rate on multilingual text

## Preprocessing notes

The tokenizer should be trained on normalized text after:

- Unicode normalization
- whitespace cleanup
- HTML and boilerplate removal
- duplicate filtering
- punctuation normalization
