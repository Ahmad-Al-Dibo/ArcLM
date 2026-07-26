from __future__ import annotations

import json
import py_compile
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
EXAMPLES = ROOT / "examples"
MANIFEST = EXAMPLES / "manifest.json"


def load_manifest() -> dict:
    return json.loads(MANIFEST.read_text(encoding="utf-8"))


def test_manifest_schema_and_unique_ids() -> None:
    manifest = load_manifest()
    entries = manifest["entries"]
    ids = [entry["id"] for entry in entries]
    assert manifest["schema_version"] == 1
    assert len(ids) == len(set(ids))
    assert len(entries) >= 30


def test_manifest_paths_are_local_existing_files() -> None:
    for entry in load_manifest()["entries"]:
        relative = entry["path"]
        if relative is None:
            assert entry["status"] == "manual_optional"
            continue
        path = EXAMPLES / relative
        assert path.exists(), relative
        assert path.is_file(), relative
        assert path.suffix == ".py"
        assert "OLD-examples" not in path.parts
        py_compile.compile(str(path), doraise=True)


def test_verified_examples_are_offline_cpu_safe() -> None:
    runnable_statuses = set(load_manifest()["verification_policy"]["runner_verified_statuses"])
    for entry in load_manifest()["entries"]:
        if entry["status"] in runnable_statuses:
            assert entry["path"]
            assert entry["requires_network"] is False
            assert entry["requires_download"] is False
            assert entry["requires_gpu"] is False
            assert entry["requires_local_model"] is False


def test_numbered_category_readmes_exist() -> None:
    expected = {
        "00_quick_start",
        "01_data",
        "02_tokenizers",
        "03_models",
        "04_training",
        "05_finetuning",
        "06_checkpoints",
        "07_evaluation_benchmarks",
        "08_inference_local_models",
        "09_pipelines_inspection",
        "10_agents_tools",
        "11_security",
        "12_complete_projects",
    }
    for folder in expected:
        assert (EXAMPLES / folder / "README.md").exists(), folder
