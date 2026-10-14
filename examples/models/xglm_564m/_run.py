from pathlib import Path
import subprocess
import sys
MODEL_ID = "xglm_564m"
def main(operation: str) -> int:
    runner = Path(__file__).resolve().parents[1] / "run_model_examples.py"
    return subprocess.run([sys.executable, str(runner), "operation", "--model", MODEL_ID, "--operation", operation, *sys.argv[1:]], check=False, timeout=1800).returncode
