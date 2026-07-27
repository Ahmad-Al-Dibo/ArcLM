"""Runtime smoke-tests voor bestaande CLI flows."""

import json
import os
import subprocess
import sys
from pathlib import Path


def run_cli(*args):
    """Voert de CLI uit in een subprocess."""
    env = dict(os.environ)
    env["PYTHONPATH"] = str(Path("src").resolve())
    return subprocess.run(
        [sys.executable, "-m", "arclm", *args],
        capture_output=True,
        text=True,
        env=env,
        check=False,
    )


def combined_output(result):
    """Voegt stdout en stderr samen."""
    return f"{result.stdout}\n{result.stderr}"


def test_cli_train_eval_generate_runtime_flow(tmp_path):
    data_path = tmp_path / "data.txt"
    config_path = tmp_path / "config.json"
    model_path = tmp_path / "model.pth"
    metrics_path = tmp_path / "metrics.json"

    data_path.write_text(
        "alpha beta gamma delta alpha beta gamma delta alpha beta gamma delta",
        encoding="utf-8",
    )
    config_path.write_text(
        json.dumps(
            {
                "embed_dim": 8,
                "block_size": 4,
                "batch_size": 2,
                "num_blocks": 1,
                "learning_rate": 0.01,
                "max_vocab": 32,
                "device": "cpu",
                "tokenizer_type": "word",
            }
        ),
        encoding="utf-8",
    )

    train = run_cli(
        "train",
        "--config",
        str(config_path),
        "--data",
        str(data_path),
        "--output",
        str(model_path),
        "--epochs",
        "1",
    )
    train_output = combined_output(train)
    assert train.returncode == 0, train_output
    assert model_path.exists()
    assert "Training complete" in train_output
    assert "Traceback" not in train_output

    evaluate = run_cli(
        "eval",
        "--model",
        str(model_path),
        "--data",
        str(data_path),
        "--batch-size",
        "2",
        "--output",
        str(metrics_path),
    )
    eval_output = combined_output(evaluate)
    assert evaluate.returncode == 0, eval_output
    assert metrics_path.exists()
    assert "Evaluation complete" in eval_output
    assert "Traceback" not in eval_output

    generate = run_cli(
        "generate",
        "--model",
        str(model_path),
        "--prompt",
        "alpha beta",
        "--length",
        "2",
    )
    generate_output = combined_output(generate)
    assert generate.returncode == 0, generate_output
    assert "ArcLM Text Generation" in generate_output
    assert "Traceback" not in generate_output
