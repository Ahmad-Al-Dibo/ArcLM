"""Regression checks for removed Gemma example assumptions."""

from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
MANIFEST = ROOT / "examples" / "manifest.json"


def test_gemma_example_is_not_a_current_verified_example() -> None:
    """Gemma-specific examples were removed from the maintained suite.

    Current coverage for external models lives in model capability reports and
    local-model loading policy examples, not in an unverified Gemma folder.
    """

    entries = json.loads(MANIFEST.read_text(encoding="utf-8"))["entries"]
    assert not (ROOT / "examples" / "gemma").exists()
    assert all("gemma" not in entry["id"].lower() for entry in entries)


def test_external_model_boundary_is_covered_without_gemma_adapter() -> None:
    from arclm.models import model_support_matrix

    matrix = model_support_matrix()
    families = {str(row["model_family"]).lower() for row in matrix}
    assert "gpt-2" in families
    assert "qwen" in families
