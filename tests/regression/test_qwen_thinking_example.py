"""Regression checks for removed Qwen thinking example assumptions."""

from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
MANIFEST = ROOT / "examples" / "manifest.json"


def test_qwen_thinking_directory_is_not_current_canonical_example() -> None:
    entries = json.loads(MANIFEST.read_text(encoding="utf-8"))["entries"]
    assert not (ROOT / "examples" / "qwen_thinking").exists()
    assert all("thinking" not in entry["id"].lower() for entry in entries)


def test_qwen_thinking_is_not_documented_as_verified_runtime_behavior() -> None:
    text = (ROOT / "docs" / "project-status.md").read_text(encoding="utf-8").lower()
    assert "qwen thinking" not in text

    from arclm.models import get_model_capability

    report = get_model_capability("Qwen/Qwen3-0.6B")
    assert any("runtime validation is not claimed" in item.lower() for item in report.limitations)
