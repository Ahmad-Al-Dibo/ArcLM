"""
ArcLM Example: External Local Model Status

What you'll learn
-----------------
- Inspect a local model directory and classify its source type (e.g. HF-style layout)
- Detect the weight format (safetensors, pytorch bins) from metadata files alone
- See why real weights are still required before any external model can be loaded

When to use this
----------------
- Before pointing ArcLM at an external model directory, to confirm the layout is
  recognized and what loading will require. This example never downloads or loads
  real weights.

Requirements
------------
    pip install "arclm[train]"

    Inspecting directories is core metadata work; loading actual Hugging Face
    weights later additionally needs: pip install "arclm[hf]"

Run
---
    python examples/08_inference_local_models/02_external_local_model_status.py

Expected output
---------------
    {
      "requires_real_weights_for_loading": true,
      "source_type": "hf_full_model",
      "weight_format": "safetensors"
    }

Runtime
-------
    Under 5 seconds on CPU.
"""

from __future__ import annotations

import json
import tempfile
from pathlib import Path

from arclm.inference import inspect_model_source


def print_json(value) -> None:
    print(json.dumps(value, indent=2, sort_keys=True, default=str))


def main() -> None:
    # --- 1. Create a synthetic HF-like model directory ---
    with tempfile.TemporaryDirectory(prefix="arclm-external-model-") as tmpdir:
        tmp = Path(tmpdir)
        model_dir = tmp / "local-hf-like"
        model_dir.mkdir()
        (model_dir / "config.json").write_text('{"model_type":"gpt2"}', encoding="utf-8")
        (model_dir / "model.safetensors").write_text("", encoding="utf-8")

        # --- 2. Inspect the source metadata and report ---
        info = inspect_model_source(model_dir)
        print_json({"source_type": info.source_type, "weight_format": info.weight_format, "requires_real_weights_for_loading": True})


if __name__ == "__main__":
    main()
