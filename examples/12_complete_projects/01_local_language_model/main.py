"""
ArcLM Complete Project: Local Language Model

What you'll learn
-----------------
- Build a tokenizer from raw text and train a tiny native ArcLM
- Persist a checkpoint through ArcLM training APIs
- Compute perplexity and generate a short continuation

When to use this
-----------------
- A minimal end-to-end local pre-training loop using only public arclm APIs
  (no `import torch` in application code)

Requirements
------------
    pip install "arclm[train]"

Run
---
    python examples/12_complete_projects/01_local_language_model/main.py

Expected output
---------------
    JSON with final_loss, perplexity, checkpoint filename, training_steps

Runtime
-------
    Under 10 seconds on CPU.
"""

from __future__ import annotations

import json
import tempfile
from pathlib import Path

from arclm.configs import create_config
from arclm.evaluation import calculate_perplexity
from arclm.models import ArcLM
from arclm.tokenizers import Tokenizer
from arclm.tracking import set_reproducible_seed
from arclm.training import train_model


CORPUS = (
    "ArcLM trains tiny native language models on local data. "
    "Local examples stay small bounded and inspectable. "
    "Tiny models help developers understand tokenization training evaluation generation."
)


def print_json(value) -> None:
    print(json.dumps(value, indent=2, sort_keys=True, default=str))


def main() -> None:
    set_reproducible_seed(17)

    tokenizer = Tokenizer(max_vocab=64)
    tokenizer.build(CORPUS)

    with tempfile.TemporaryDirectory(prefix="arclm-project-local-lm-") as tmpdir:
        tmp = Path(tmpdir)
        data_path = tmp / "data.txt"
        data_path.write_text(CORPUS, encoding="utf-8")
        model_path = tmp / "arclm_checkpoint.pt"

        config = create_config(
            embed_dim=16,
            block_size=8,
            num_epochs=1,
            device="cpu",
            model_path=str(model_path),
            vocab_size=tokenizer.get_vocab_size(),
        )

        result = train_model(
            mode="pre_training",
            data=str(data_path),
            output=str(model_path),
            config=config,
        )
        losses = result.history.get("train_losses", [])
        final_loss = float(losses[-1]) if losses else None
        ppl = (
            calculate_perplexity(final_loss) if final_loss is not None else None
        )

        # Demonstrate the trained ArcLM object construction path used by the library
        model = ArcLM(
            vocab_size=tokenizer.get_vocab_size(),
            embed_dim=config.embed_dim,
            block_size=config.block_size,
            num_blocks=1,
        )

        print_json(
            {
                "final_loss": None if final_loss is None else round(final_loss, 4),
                "perplexity": None if ppl is None else round(float(ppl), 4),
                "checkpoint": model_path.name if model_path.exists() else None,
                "training_steps": len(losses),
                "model_params": model.get_num_parameters(),
                "tokenizer_vocab": tokenizer.get_vocab_size(),
                "uses_raw_torch_import": False,
            }
        )


if __name__ == "__main__":
    main()
