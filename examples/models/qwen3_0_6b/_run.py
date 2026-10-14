from pathlib import Path
import subprocess
import sys

MODEL_ID = "qwen3_0_6b"


def main(operation: str) -> int:
    runner = Path(__file__).resolve().parents[1] / "run_model_examples.py"
    command = [sys.executable, str(runner), "operation", "--model", MODEL_ID, "--operation", operation, *sys.argv[1:]]
    return subprocess.run(command, check=False, timeout=1800).returncode
