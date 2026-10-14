"""
ArcLM Example: Pipeline Inspection

What you'll learn
-----------------
- Trace a text prompt through the full native pipeline: tokenization, model
  forward pass, token selection, and decoding
- Read intermediate shapes (input, embedding, logits) and optional tensor values
- Use the inspection trace to debug where a pipeline stage goes wrong

When to use this
----------------
- When a native model produces surprising output, or to document exactly what
  flows through your model/tokenizer pairing.

Requirements
------------
    pip install "arclm[train]"

Run
---
    python examples/09_pipelines_inspection/02_pipeline_inspection.py

Expected output
---------------
    {
      "device": "cpu",
      "embedding_shape": [1, 2, 16],
      "generated_text": "local <UNK> tiny",
      "input_text": "local examples",
      "logits_shape": [1, 2, 10],
      "selected_token": "tiny",
      "token_ids": [8, 0],
      ...
    }

Runtime
-------
    Under 10 seconds on CPU.
"""

from __future__ import annotations

import json

from arclm.inspection import inspect_text
from arclm.models import ArcLM
from arclm.tokenizers import Tokenizer


CORPUS = "ArcLM trains tiny native language models on local data."


def print_json(value) -> None:
    print(json.dumps(value, indent=2, sort_keys=True, default=str))


def main() -> None:
    # --- 1. Build tokenizer and a tiny model ---
    tokenizer = Tokenizer(max_vocab=48)
    tokenizer.build(CORPUS)
    model = ArcLM(vocab_size=tokenizer.get_vocab_size(), embed_dim=16, block_size=8, num_blocks=1)

    # --- 2. Run the inspection trace ---
    trace = inspect_text(model=model, tokenizer=tokenizer, text="local examples", include_values=True, max_values=4)

    # --- 3. Print the full trace ---
    print_json(trace.to_dict())


if __name__ == "__main__":
    main()
