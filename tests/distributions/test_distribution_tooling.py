import importlib.util
import json
import os
import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
TOOL_PATH = ROOT / "tools" / "build_arclm_distributions.py"

EXPECTED_IDS = {
    "core",
    "training",
    "finetuning",
    "loading-inference",
    "evaluation-benchmarks",
    "agents-tools",
    "security",
}


def load_tool():
    spec = importlib.util.spec_from_file_location("build_arclm_distributions", TOOL_PATH)
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module


def test_distribution_manifests_are_listed_and_schema_valid():
    tool = load_tool()
    manifests = tool.all_manifests()
    ids = {item["id"] for item in manifests}

    assert EXPECTED_IDS <= ids
    assert all(item["schema_version"] == 1 for item in manifests)
    assert all(item["source_package"] == "src/arclm" for item in manifests)


def test_light_blocks_have_no_torch_and_strict_boundaries():
    tool = load_tool()
    for edition in ("core", "agents-tools"):
        report = tool.inspect(edition)
        assert report["module_count"] > 0
        assert not [edge for edge in report["excluded_hits"] if not edge["optional"]]
        assert "arclm.training" not in report["modules"]
        assert "arclm.models" not in report["modules"]
        assert "arclm.inference" not in report["modules"]


def test_core_block_contains_datasets_and_tokenizers():
    tool = load_tool()
    report = tool.inspect("core")

    assert "arclm.datasets" in report["modules"] or any(
        m.startswith("arclm.datasets") for m in report["modules"]
    )
    assert "arclm.tokenizers" in report["modules"] or any(
        m.startswith("arclm.tokenizers") for m in report["modules"]
    )
    assert not [edge for edge in report["excluded_hits"] if not edge["optional"]]


def test_loading_inference_keeps_training_imports_lazy():
    tool = load_tool()
    report = tool.inspect("loading-inference")

    assert "arclm.inference.engine" in report["modules"]
    assert "arclm.training.trainer" not in report["modules"]
    assert not [edge for edge in report["excluded_hits"] if not edge["optional"]]


def test_training_block_excludes_finetuning_and_agents():
    tool = load_tool()
    report = tool.inspect("training")

    assert "arclm.training" in report["modules"] or any(
        m.startswith("arclm.training") for m in report["modules"]
    )
    assert not any(m.startswith("arclm.finetuning") for m in report["modules"])
    assert not any(m.startswith("arclm.agents") for m in report["modules"])
    assert not [edge for edge in report["excluded_hits"] if not edge["optional"]]


def test_generated_core_block_imports_and_reports_edition():
    tool = load_tool()
    output = tool.build("core")
    verify = tool.verify("core")

    assert verify["ok"] is True
    assert not (output / "src" / "arclm" / "training").exists()
    assert not (output / "src" / "arclm" / "models").exists()
    inventory = json.loads((output / "source-inventory.json").read_text(encoding="utf-8"))
    assert inventory["source_version"]

    env = dict(os.environ)
    env["PYTHONPATH"] = str(output / "src")
    result = subprocess.run(
        [
            sys.executable,
            "-c",
            "import arclm, json; info=arclm.get_distribution_info(); print(info['edition']); print(arclm.__file__)",
        ],
        cwd=output,
        env=env,
        text=True,
        capture_output=True,
        check=False,
    )
    assert result.returncode == 0, result.stderr
    lines = result.stdout.strip().splitlines()
    assert lines[0] == "core"
    assert str(output / "src") in lines[1]


def test_check_drift_reports_built_editions_clean_after_rebuild():
    tool = load_tool()
    tool.build("core")
    result = tool.check_drift()

    assert result["core"]["built"] is True
    assert result["core"]["ok"] is True
