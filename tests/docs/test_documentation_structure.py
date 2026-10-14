"""Checks for the maintained Markdown documentation structure."""

import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
README = ROOT / "README.md"
LINK_PATTERN = re.compile(r"\[[^\]]+\]\(([^)]+)\)")


def test_readme_local_links_resolve() -> None:
    text = README.read_text(encoding="utf-8")
    for match in LINK_PATTERN.finditer(text):
        target = match.group(1).split("#", 1)[0]
        if not target or "://" in target or target.startswith("mailto:"):
            continue
        assert (ROOT / target).exists(), f"Broken README link: {target}"


def test_readme_indexes_current_documentation() -> None:
    text = README.read_text(encoding="utf-8")
    for target in (
        "docs/project-status.md",
        "docs/agent-runtime.md",
        "examples/README.md",
        "lab/README.md",
    ):
        assert target in text

    for retired_path in ("documentation-site/", "docs/special-version.md", "SECURITY.md"):
        assert retired_path not in text


def test_project_status_marks_old_release_notes_as_historical() -> None:
    text = (ROOT / "docs" / "project-status.md").read_text(encoding="utf-8")
    assert "Current package version: `1.0.0`" in text
    assert "Release Candidate (Historical)" in text
    assert "numbered examples are the maintained examples surface" in text
