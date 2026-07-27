"""
ArcLM Example: Pipeline Inspection

This example reports the canonical ArcLM inspection trace for text, token IDs,
input shape, embedding shape, logits shape, selected token, and decoded output.
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
    tokenizer = Tokenizer(max_vocab=48)
    tokenizer.build(CORPUS)
    model = ArcLM(vocab_size=tokenizer.get_vocab_size(), embed_dim=16, block_size=8, num_blocks=1)
    trace = inspect_text(model=model, tokenizer=tokenizer, text="local examples", include_values=True, max_values=4)
    print_json(trace.to_dict())


if __name__ == "__main__":
    main()

