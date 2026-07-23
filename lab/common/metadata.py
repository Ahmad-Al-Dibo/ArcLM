from __future__ import annotations

import importlib.util
import json
from collections import defaultdict, deque
from pathlib import Path
from types import ModuleType
from typing import Any


LAB_ROOT = Path(__file__).resolve().parents[1]
REPO_ROOT = LAB_ROOT.parent
MANIFEST_PATH = LAB_ROOT / "manifest.json"

VALID_LEVELS = {"beginner", "intermediate", "advanced", "expert"}
VALID_STATUSES = {"stub", "in_progress", "completed", "verified", "deprecated"}
VALID_TYPES = {"from_scratch", "arclm_integration"}


def load_manifest(path: str | Path = MANIFEST_PATH) -> dict[str, Any]:
    """Load the Lab manifest from a JSON file."""

    manifest_path = Path(path)
    with manifest_path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def manifest_entry_by_id(manifest: dict[str, Any], challenge_id: str) -> dict[str, Any]:
    """Return one manifest entry by challenge ID."""

    for entry in manifest.get("challenges", []):
        if entry.get("id") == challenge_id:
            return entry
    raise KeyError(f"Unknown Lab challenge ID: {challenge_id}")


def challenge_path(entry: dict[str, Any]) -> Path:
    """Return the repository-relative challenge path as an absolute path."""

    return REPO_ROOT / str(entry["path"])


def load_challenge_module(path: str | Path) -> ModuleType:
    """Import a challenge module from its file path without package assumptions."""

    module_path = Path(path)
    spec = importlib.util.spec_from_file_location(module_path.stem, module_path)
    if spec is None or spec.loader is None:
        raise ImportError(f"Could not import challenge module: {module_path}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def validate_manifest(manifest: dict[str, Any] | None = None) -> list[str]:
    """Validate manifest structure, IDs, paths, categories, and prerequisites."""

    data = manifest or load_manifest()
    errors: list[str] = []
    entries = data.get("challenges", [])
    ids = [entry.get("id") for entry in entries]
    id_set = set(ids)

    if len(ids) != len(id_set):
        errors.append("challenge IDs must be unique")

    categories = set(data.get("categories", []))
    for entry in entries:
        challenge_id = entry.get("id", "<missing>")
        if entry.get("level") not in VALID_LEVELS:
            errors.append(f"{challenge_id}: invalid level")
        if entry.get("status") not in VALID_STATUSES:
            errors.append(f"{challenge_id}: invalid status")
        if entry.get("type") not in VALID_TYPES:
            errors.append(f"{challenge_id}: invalid challenge type")
        if entry.get("category") not in categories:
            errors.append(f"{challenge_id}: unknown category")
        if not isinstance(entry.get("points"), int) or entry.get("points", 0) <= 0:
            errors.append(f"{challenge_id}: points must be positive")
        path = challenge_path(entry)
        if not path.exists():
            errors.append(f"{challenge_id}: challenge path does not exist")
        if not (path / "README.md").exists():
            errors.append(f"{challenge_id}: README.md is missing")
        if not (path / "challenge.py").exists():
            errors.append(f"{challenge_id}: challenge.py is missing")
        if not (path / "test_challenge.py").exists():
            errors.append(f"{challenge_id}: test_challenge.py is missing")
        for prerequisite in entry.get("prerequisites", []):
            if prerequisite not in id_set:
                errors.append(f"{challenge_id}: unknown prerequisite {prerequisite}")

    errors.extend(_detect_prerequisite_cycles(entries))
    return errors


def _detect_prerequisite_cycles(entries: list[dict[str, Any]]) -> list[str]:
    graph = {entry["id"]: set(entry.get("prerequisites", [])) for entry in entries}
    indegree: dict[str, int] = {challenge_id: 0 for challenge_id in graph}
    dependents: dict[str, list[str]] = defaultdict(list)
    for challenge_id, prerequisites in graph.items():
        for prerequisite in prerequisites:
            if prerequisite in indegree:
                indegree[challenge_id] += 1
                dependents[prerequisite].append(challenge_id)

    queue = deque([challenge_id for challenge_id, count in indegree.items() if count == 0])
    seen = 0
    while queue:
        challenge_id = queue.popleft()
        seen += 1
        for dependent in dependents[challenge_id]:
            indegree[dependent] -= 1
            if indegree[dependent] == 0:
                queue.append(dependent)

    if seen == len(indegree):
        return []
    return ["prerequisite graph must not contain cycles"]


def level_entries(manifest: dict[str, Any], level: str) -> list[dict[str, Any]]:
    """Return manifest entries for a level in manifest order."""

    return [entry for entry in manifest.get("challenges", []) if entry.get("level") == level]

