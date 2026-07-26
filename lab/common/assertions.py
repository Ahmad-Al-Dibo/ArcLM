from __future__ import annotations

from pathlib import Path
from typing import Any

from lab.common.metadata import load_challenge_module


REQUIRED_README_SECTIONS = [
    "Level",
    "Category",
    "Challenge type",
    "Estimated time",
    "Difficulty",
    "Prerequisites",
    "ArcLM areas covered",
    "Learning objectives",
    "Concept foundations",
    "Background",
    "Task",
    "Functions/classes to implement",
    "Input contract",
    "Output contract",
    "Examples",
    "Edge cases",
    "Restrictions",
    "How to run",
    "Acceptance criteria",
    "Hints",
    "Further concepts",
]


def assert_challenge_contract(path: Path, manifest_entry: dict[str, Any]) -> None:
    """Assert that a challenge folder follows the public Lab contract."""

    readme = path / "README.md"
    challenge = path / "challenge.py"
    tests = path / "test_challenge.py"
    assert readme.exists(), f"{readme} is missing"
    assert challenge.exists(), f"{challenge} is missing"
    assert tests.exists(), f"{tests} is missing"
    readme_text = readme.read_text(encoding="utf-8")
    assert len(readme_text.strip()) > 200
    for section in REQUIRED_README_SECTIONS:
        assert f"## {section}" in readme_text

    module = load_challenge_module(challenge)
    metadata = getattr(module, "LAB_METADATA", None)
    assert isinstance(metadata, dict), "LAB_METADATA must be a dict"
    for key in (
        "id",
        "title",
        "level",
        "category",
        "type",
        "estimated_minutes",
        "points",
        "requires_network",
        "requires_gpu",
        "production_code_modified",
    ):
        assert key in metadata, f"LAB_METADATA missing {key}"
    for key in ("id", "title", "level", "category", "type", "estimated_minutes", "points"):
        assert metadata[key] == manifest_entry[key]
    assert metadata["requires_network"] is False
    assert metadata["requires_gpu"] is False
    assert metadata["production_code_modified"] is False


def assert_json_safe(value: Any) -> None:
    """Assert that a Lab result can be represented as ordinary JSON data."""

    import json

    json.dumps(value)

