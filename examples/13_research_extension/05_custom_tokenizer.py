"""
ArcLM Research Example: Custom Tokenizer Subclass

What you'll learn
-----------------
- Subclass Tokenizer for research-specific normalization
- Register the subclass with TokenizerFactory
- Stay on the light install (no torch)

When to use this
----------------
- Domain tokenizers (legal, code, biomedical prefixes)
- Ablation studies on text normalization

Requirements
------------
    pip install arclm

Run
---
    python examples/13_research_extension/05_custom_tokenizer.py

Expected output
---------------
    JSON with vocab size and encode/decode round-trip

Runtime
-------
    Under 5 seconds on CPU.
"""

from __future__ import annotations

import json

from arclm.tokenizers import Tokenizer, TokenizerFactory, create_tokenizer


class LowercaseWordTokenizer(Tokenizer):
    """Research tokenizer: lowercase before counting (unlike default Tokenizer)."""

    def build(self, text: str) -> None:  # type: ignore[override]
        normalized = " ".join(text.lower().split())
        super().build(normalized)

    def encode_text(self, text: str):  # type: ignore[override]
        return super().encode_text(" ".join(text.lower().split()))


def main() -> None:
    TokenizerFactory.register("research_lower", LowercaseWordTokenizer)

    tok = create_tokenizer("research_lower", max_vocab=32)
    corpus = "ArcLM Research Pipelines compose ArcLM Research Pipelines"
    tok.build(corpus)

    ids_upper = tok.encode_text("ArcLM Research")
    ids_lower = tok.encode_text("arclm research")
    assert ids_upper == ids_lower  # lowercase policy applied

    print(
        json.dumps(
            {
                "tokenizer": type(tok).__name__,
                "vocab_size": tok.get_vocab_size(),
                "ids_match_case_insensitive": ids_upper == ids_lower,
                "decode": tok.decode(ids_upper),
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
