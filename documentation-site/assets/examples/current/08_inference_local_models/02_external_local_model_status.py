"""
ArcLM Example: External Local Model Status

This example inspects a synthetic local model directory. It does not load or
download external model weights.
"""

from __future__ import annotations

import json
import tempfile
from pathlib import Path

from arclm.inference import inspect_model_source


def print_json(value) -> None:
    print(json.dumps(value, indent=2, sort_keys=True, default=str))


def main() -> None:
    with tempfile.TemporaryDirectory(prefix="arclm-external-model-") as tmpdir:
        tmp = Path(tmpdir)
        model_dir = tmp / "local-hf-like"
        model_dir.mkdir()
        (model_dir / "config.json").write_text('{"model_type":"gpt2"}', encoding="utf-8")
        (model_dir / "model.safetensors").write_text("", encoding="utf-8")
        info = inspect_model_source(model_dir)
        print_json({"source_type": info.source_type, "weight_format": info.weight_format, "requires_real_weights_for_loading": True})


if __name__ == "__main__":
    main()

