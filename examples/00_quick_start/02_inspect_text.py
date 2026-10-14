"""
ArcLM Example: Inspect Text

What you'll learn
-----------------
- Run the `inspect_text` pipeline trace for one native generation step
- Read tokens, token ids, input/logits shapes, and attention availability

When to use this
----------------
- Debugging or explaining what happens inside a model when text goes in;
  the trace is the canonical per-step inspection record

Requirements
------------
    pip install "arclm[train]"

Run
---
    python examples/00_quick_start/02_inspect_text.py

Expected output
---------------
    {
      "attention_available": false,
      "input_shape": [1, 2],
      "logits_shape": [1, 2, 17],
      "token_ids": [1, 2],
      "tokens": ["ArcLM", "trains"]
    }

Runtime
-------
    Under 5 seconds on CPU.
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
    # --- 1. Build tokenizer and tiny model ---
    tokenizer = Tokenizer(max_vocab=48)
    tokenizer.build(CORPUS)
    model = ArcLM(vocab_size=tokenizer.get_vocab_size(), embed_dim=16, block_size=8, num_blocks=1)

    # --- 2. Trace one generation step ---
    trace = inspect_text(model=model, tokenizer=tokenizer, text="ArcLM trains", include_values=False)

    # --- 3. Print the trace summary ---
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
