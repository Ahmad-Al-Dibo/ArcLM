from __future__ import annotations

import compileall
import json
from pathlib import Path

from lab.common.assertions import assert_challenge_contract
from lab.common.metadata import REPO_ROOT, challenge_path, load_manifest, validate_manifest


LAB_ROOT = REPO_ROOT / "lab"


def test_manifest_is_valid() -> None:
    errors = validate_manifest()
    assert errors == []


def test_all_manifest_paths_and_metadata_match() -> None:
    manifest = load_manifest()
    for entry in manifest["challenges"]:
        assert_challenge_contract(challenge_path(entry), entry)


def test_challenge_ids_are_unique_and_prerequisites_are_known() -> None:
    manifest = load_manifest()
    ids = [entry["id"] for entry in manifest["challenges"]]
    assert len(ids) == len(set(ids))
    known = set(ids)
    for entry in manifest["challenges"]:
        assert set(entry["prerequisites"]).issubset(known)


def test_every_challenge_has_public_tests_and_non_empty_readme() -> None:
    manifest = load_manifest()
    for entry in manifest["challenges"]:
        path = challenge_path(entry)
        assert (path / "test_challenge.py").exists()
        assert len((path / "README.md").read_text(encoding="utf-8").strip()) > 200


def test_every_capstone_declares_reused_prerequisites() -> None:
    manifest = load_manifest()
    capstones = [entry for entry in manifest["challenges"] if "capstone" in entry["id"]]
    assert {entry["level"] for entry in capstones} == {"beginner", "intermediate", "advanced", "expert"}
    for entry in capstones:
        assert len(entry["prerequisites"]) >= 3


def test_lab_python_files_compile() -> None:
    assert compileall.compile_dir(str(LAB_ROOT), quiet=1)


def test_lab_requires_no_network_or_cuda() -> None:
    manifest = load_manifest()
    for entry in manifest["challenges"]:
        assert entry["requires_network"] is False
        assert entry["requires_gpu"] is False


def test_lab_does_not_advertise_production_modification() -> None:
    manifest = load_manifest()
    for entry in manifest["challenges"]:
        source = (challenge_path(entry) / "challenge.py").read_text(encoding="utf-8")
        assert '"production_code_modified": False' in source
    assert (REPO_ROOT / "src" / "arclm" / "_version.py").read_text(encoding="utf-8").count("0.10.0") == 1


def test_manifest_paths_are_relative_and_inside_lab() -> None:
    manifest = load_manifest()
    for entry in manifest["challenges"]:
        path = Path(entry["path"])
        assert not path.is_absolute()
        assert path.parts[0] == "lab"
        assert (REPO_ROOT / path).resolve().is_relative_to(LAB_ROOT.resolve())


def test_lab_sources_avoid_unsafe_patterns() -> None:
    forbidden = ("eval(", "exec(", "subprocess.run(input", "os.system(", "requests.", "urllib.request")
    for path in LAB_ROOT.rglob("*.py"):
        if "__pycache__" in path.parts:
            continue
        text = path.read_text(encoding="utf-8")
        for pattern in forbidden:
            assert pattern not in text, f"{path} contains {pattern}"


def test_manifest_is_json_serializable() -> None:
    manifest = load_manifest()
    json.dumps(manifest)


def test_packaging_policy_keeps_lab_out_of_wheel_packages() -> None:
    pyproject = (REPO_ROOT / "pyproject.toml").read_text(encoding="utf-8")
    assert 'where = ["src"]' in pyproject
    assert 'include = ["arclm*"]' in pyproject
