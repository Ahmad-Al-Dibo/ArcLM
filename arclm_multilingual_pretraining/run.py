from __future__ import annotations

import argparse
from pathlib import Path

from .config import ProjectConfig
from .evaluate import evaluate_model
from .train import train_project


def main() -> None:
    parser = argparse.ArgumentParser(description="Run ArcLM multilingual pre-training")
    parser.add_argument("--mode", choices=["train", "evaluate", "infer"], default="train")
    parser.add_argument("--input", type=Path, default=None)
    parser.add_argument("--model", type=Path, default=None)
    args = parser.parse_args()

    config = ProjectConfig()
    if args.mode == "train":
        train_project(config, [args.input] if args.input else None)
    elif args.mode == "evaluate":
        evaluate_model(config, args.model)
    else:
        print("Inference mode is available through the evaluation helper in this reference build.")


if __name__ == "__main__":
    main()
