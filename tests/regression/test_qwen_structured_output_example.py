"""Regression checks for removed Qwen structured-output example assumptions."""

from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
MANIFEST = ROOT / "examples" / "manifest.json"


def test_qwen_sft_directory_is_not_current_canonical_example() -> None:
    entries = json.loads(MANIFEST.read_text(encoding="utf-8"))["entries"]
    assert not (ROOT / "examples" / "qwen3_0_6b_sft").exists()
    assert all("qwen" not in entry["id"].lower() for entry in entries)


def test_qwen_status_is_experimental_and_not_runtime_verified() -> None:
    from arclm.models import get_model_capability

    report = get_model_capability("Qwen/Qwen3-0.6B")
    assert report.status == "Experimental"
    assert report.supports_structured_output is True
    assert report.operations["Forward"] == "Not tested"
    assert "real_weight_load" in report.unvalidated_operations
