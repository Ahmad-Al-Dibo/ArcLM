"""
ArcLM Real Project: Translator from Zero

What you'll learn
-----------------
- Build an English→Dutch translator from a tiny parallel corpus
- Use only public arclm APIs: datasets, tokenizers, training, inference
- Structure a multi-file project (config / data_prep / train / translate / evaluate)
- Be honest: a tiny causal LM is educational, not production NMT

When to use this
----------------
- Understanding the full local training → inference loop
- A template for your own domain-specific tiny translator

Requirements
------------
    pip install "arclm[train]"

Run
---
    python examples/14_translator_from_scratch/main.py

Expected output
---------------
    JSON with training stats and a few translation samples (quality will be low)

Runtime
-------
    Under 30 seconds on CPU.
"""

from __future__ import annotations

import json
from pathlib import Path

import config as project
from data_prep import load_pairs
from evaluate import evaluate_translator
from train import train_translator
from translate import translate


def main() -> None:
    workdir = project.ensure_workdir()
    pairs = load_pairs(project.DATA_PATH)
    print(f"[data] {len(pairs)} parallel pairs loaded")

    print("[train] training tiny translator...")
    train_info = train_translator(pairs, workdir)
    print(json.dumps(train_info, indent=2))

    print("[translate] sample translations")
    demos = []
    for word in ("hello", "thank you", "the cat"):
        out = translate(str(project.CHECKPOINT_PATH), word, max_new_tokens=16)
        demos.append({"src": word, "raw_output": out})
        print(f"  {word!r} -> {out!r}")

    print("[evaluate] held-out style check")
    eval_info = evaluate_translator(
        str(project.CHECKPOINT_PATH), pairs, max_examples=4
    )

    print(
        json.dumps(
            {
                "project": "translator_from_scratch",
                "train": train_info,
                "demos": demos,
                "evaluate": eval_info,
                "limitations": (
                    "Educational tiny causal model. Not competitive with "
                    "dedicated NMT systems. Use translator_open_source for "
                    "real pretrained translation quality."
                ),
            },
            indent=2,
            ensure_ascii=False,
        )
    )


if __name__ == "__main__":
    main()
