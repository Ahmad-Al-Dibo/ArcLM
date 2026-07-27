"""
ArcLM Example: Inspect Text Flow

This example demonstrates the canonical `inspect_text` pipeline trace for one
native generation step.
"""

from __future__ import annotations

from arclm.inspection import inspect_text
from arclm.models import ArcLM
from arclm.tokenizers import Tokenizer

import json


CORPUS = (
    "ArcLM trains tiny native language models on local data. "
    "Local examples stay small bounded and inspectable."
)


def print_json(value) -> None:
    print(json.dumps(value, indent=2, sort_keys=True, default=str))


def main() -> None:
    tokenizer = Tokenizer(max_vocab=48)
    tokenizer.build(CORPUS)
    model = ArcLM(vocab_size=tokenizer.get_vocab_size(), embed_dim=16, block_size=8, num_blocks=1)
    trace = inspect_text(model=model, tokenizer=tokenizer, text="ArcLM trains", include_values=False)
    print_json(
        {
            "tokens": trace.tokens,
            "token_ids": trace.token_ids,
            "input_shape": trace.input_shape,
            "logits_shape": trace.logits_shape,
            "attention_available": trace.attention_available,
        }
    )


if __name__ == "__main__":
    main()
