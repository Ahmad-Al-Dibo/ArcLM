# 02 Tokenizers

Purpose: compare native word and SentencePiece tokenization on local text.

Prerequisites: base ArcLM installation. SentencePiece is a base dependency in
this repository.

Concepts: vocabulary size, encoding, decoding, special symbols, coverage, and
save/reload.

Examples in order:
- `01_word_tokenizer.py`
- `02_sentencepiece_bpe.py`

Installation requirements: base dependencies only.

Commands:

```powershell
python examples/02_tokenizers/01_word_tokenizer.py
python examples/02_tokenizers/02_sentencepiece_bpe.py
```

Expected outputs: JSON summaries of token IDs and decoded text.

Verification status: automated.

Current limitations: examples use tiny corpora and are not tokenizer-quality
benchmarks.

Related ArcLM APIs: `Tokenizer`, `SentencePieceTokenizer`.

Next category: `03_models`.

