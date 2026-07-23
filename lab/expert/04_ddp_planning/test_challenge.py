from __future__ import annotations

from pathlib import Path

from lab.common.assertions import assert_challenge_contract
from lab.common.metadata import load_manifest, manifest_entry_by_id

CHALLENGE_ID = "expert-04-ddp-planning"


def test_metadata_matches_manifest() -> None:
    manifest = load_manifest()
    entry = manifest_entry_by_id(manifest, CHALLENGE_ID)
    assert_challenge_contract(Path(entry["path"]), entry)


def test_public_behavior_contract_is_documented() -> None:
    manifest = load_manifest()
    entry = manifest_entry_by_id(manifest, CHALLENGE_ID)
    text = (Path(entry["path"]) / "README.md").read_text(encoding="utf-8")
    assert "Normal input:" in text
    assert "Edge input:" in text
    assert "Invalid input:" in text
    assert "No network" in text
