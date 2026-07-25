"""Beginner 3: reload, evaluate, generate, and inspect a tiny native model."""

from pathlib import Path
import json

import torch

from arclm import inspect_text
from arclm.datasets import create_dataloader
from arclm.evaluation import EvaluationConfig, Evaluator, LossMetric
from arclm.inference import Generator
from arclm.models import ArcLM
from arclm.tokenizers import Tokenizer
from arclm.training import Trainer, TrainingConfig


OUTPUT_DIR = Path(__file__).resolve().parent / "_outputs" / "causal_lm_workbench"


def main():
    checkpoint_dir = OUTPUT_DIR / "checkpoint"
    tokenizer_path = OUTPUT_DIR / "tokenizer.json"
    model_config_path = OUTPUT_DIR / "model_config.json"
    if not checkpoint_dir.exists() or not tokenizer_path.exists() or not model_config_path.exists():
        raise SystemExit(
            "Run examples/23_beginner_train_tiny_native_model.py first to create the tiny checkpoint."
        )

    tokenizer = Tokenizer.from_json(
        json.loads(tokenizer_path.read_text(encoding="utf-8"))
    )
    model_config = json.loads(model_config_path.read_text(encoding="utf-8"))
    model = ArcLM(**model_config)
    trainer = Trainer(
        model=model,
        config=TrainingConfig(
            epochs=1,
            batch_size=2,
            learning_rate=1e-2,
            output_dir=str(OUTPUT_DIR / "reload"),
            save_every_steps=0,
            log_every_steps=0,
            device="cpu",
        ),
    )
    trainer.load_checkpoint(checkpoint_dir)

    text = "arc lm trains tiny causal models tiny checkpoints make reloads easy"
    token_ids = tokenizer.encode_text(text)
    dataloader = create_dataloader(
        token_ids * 2,
        block_size=model_config["block_size"],
        batch_size=2,
        shuffle=False,
    )
    evaluation = Evaluator(
        model=model,
        dataloader=dataloader,
        metrics=[LossMetric()],
        config=EvaluationConfig(batch_size=2, device="cpu"),
        loss_fn=lambda logits, targets: torch.nn.functional.cross_entropy(
            logits.reshape(-1, logits.size(-1)),
            targets.reshape(-1),
        ),
    ).evaluate()
    generated = Generator(
        model,
        tokenizer.stoi,
        tokenizer.itos,
        block_size=model_config["block_size"],
        device=torch.device("cpu"),
        tokenizer=tokenizer,
    ).generate_string("arc lm", max_new_tokens=3, top_k=3)
    trace = inspect_text(model=model, tokenizer=tokenizer, text="arc lm", top_k=1)

    print("ArcLM Beginner 3: reload and use the model")
    print(f"Evaluation loss: {evaluation.metrics['loss']:.4f}")
    print(f"Generated: {generated}")
    print()
    print(trace.summary())


if __name__ == "__main__":
    main()
