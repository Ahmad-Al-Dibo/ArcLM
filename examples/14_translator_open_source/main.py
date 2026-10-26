"""
ArcLM Real Project: Translator with an Open-Source Model

What you'll learn
-----------------
- Load a small multilingual instruct model with ArcLM load_any_model
- Translate via .chat() (chat template) with a .predict() fallback
- Structure config / loader / prompts / translate / evaluate as separate modules

When to use this
----------------
- Real translation quality using a pretrained open-source model
- A template for any chat/instruct model workflow in ArcLM

Requirements
------------
    pip install "arclm[hf]"
    # First run downloads model weights (~hundreds of MB depending on model)

Run
---
    python examples/14_translator_open_source/main.py

Optional
--------
    set TRANSLATOR_MODEL=Qwen/Qwen2.5-0.5B-Instruct

Expected output
---------------
    JSON with one translation per sample (model-dependent quality)

Runtime
-------
    First run: download + load (minutes on slow links).
    Later runs: seconds on CPU for a ~135M model.
"""

from __future__ import annotations

import json

from evaluate import evaluate_samples
from loader import load_translator_model


def main() -> None:
    print("[load] loading open-source instruct model via ArcLM...")
    model = load_translator_model()
    print("[load] ok")

    print("[evaluate] translating samples")
    report = evaluate_samples(model)

    print(
        json.dumps(
            {
                "project": "translator_open_source",
                **report,
            },
            indent=2,
            ensure_ascii=False,
        )
    )


if __name__ == "__main__":
    main()
