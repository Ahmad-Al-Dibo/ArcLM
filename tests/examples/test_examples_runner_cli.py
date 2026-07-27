from __future__ import annotations

import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
RUNNER = ROOT / "examples" / "run_examples.py"


def run_runner(*args: str) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        [sys.executable, str(RUNNER), *args],
        cwd=str(ROOT),
        capture_output=True,
        text=True,
        timeout=120,
    )


def test_runner_lists_manifest_entries() -> None:
    result = run_runner("list")
    assert result.returncode == 0, result.stderr
    assert "00-01" in result.stdout
    assert "12-06" in result.stdout
    assert "manual_optional" in result.stdout


def test_runner_runs_one_quick_start_example() -> None:
    result = run_runner("run", "00-01")
    assert result.returncode == 0, result.stderr
    assert '"status": "passed"' in result.stdout
    assert "logits_shape" in result.stdout


def test_runner_runs_data_category() -> None:
    result = run_runner("run-category", "data")
    assert result.returncode == 0, result.stderr
    assert "2 passed, 0 failed" in result.stdout
