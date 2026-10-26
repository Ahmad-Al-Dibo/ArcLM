"""Evaluate open-source translator on sample sentences (human-readable)."""

from __future__ import annotations

from typing import Any

import config as project
from translate import translate_text


def evaluate_samples(model: Any) -> dict:
    results = []
    for src in project.SAMPLES:
        out = translate_text(model, src)
        results.append({"src": src, "translation": out})
    return {
        "model_id": project.MODEL_ID,
        "device": project.DEVICE,
        "samples": results,
        "note": (
            "Quality depends on the base model and chat template. "
            "This example verifies the ArcLM load+chat path, not MT benchmarks."
        ),
    }
