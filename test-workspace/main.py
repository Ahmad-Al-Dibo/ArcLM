"""Starter entry point for an ArcLM project."""

from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from preparing_data.basic import prepare_sample_dataset
from pretraining.basic import run_pretraining_example
from finetuning.basic import run_finetuning_example
from agents.basic import run_agent_example
from security.basic import run_security_example
from logic.basic import run_logic_example


def main() -> None:
    print(f"Welcome to {ROOT.name}!")
    print("Preparing starter datasets...")
    prepare_sample_dataset()
    print("Running starter examples...")
    run_pretraining_example()
    run_finetuning_example()
    run_agent_example()
    run_security_example()
    run_logic_example()


if __name__ == "__main__":
    main()
