"""Native happy path: train, evaluate, generate, and inspect one ArcLM step."""

from pathlib import Path
import sys
import tempfile

import torch

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from arclm import ArcLM, Tokenizer, inspect_text
from arclm.datasets import create_dataloader, load_dataset
from arclm.evaluation import EvaluationConfig, Evaluator, LossMetric
from arclm.inference import Generator
from arclm.training import Trainer, TrainingConfig


def main():
    torch.manual_seed(7)
    with tempfile.TemporaryDirectory() as tmp:
        output_dir = Path(tmp)

        # 1. Load a tiny in-memory dataset.
        records = load_dataset(
            [
                {"text": "arc lm explains every native stage"},
                {"text": "arc lm trains on small transparent data"},
                {"text": "transparent traces help students learn"},
            ],
            required_fields=["text"],
        )
        text = " ".join(record["text"] for record in records)

        # 2. Build a simple native tokenizer and DataLoader.
        tokenizer = Tokenizer(max_vocab=48)
        tokenizer.build(text)
        token_ids = tokenizer.encode_text(text)
        train_loader = create_dataloader(
            token_ids * 4,
            block_size=5,
            batch_size=2,
            shuffle=False,
        )

        # 3. Train a tiny native ArcLM model on CPU.
        model = ArcLM(
            vocab_size=tokenizer.get_vocab_size(),
            embed_dim=12,
            block_size=5,
            num_blocks=1,
            dropout=0.0,
        )
        trainer = Trainer(
            model=model,
            config=TrainingConfig(
                epochs=1,
                batch_size=2,
                learning_rate=1e-2,
                output_dir=str(output_dir / "run"),
                save_every_steps=0,
                log_every_steps=0,
                device="cpu",
            ),
        )
        state = trainer.train(train_loader, epochs=1)
        checkpoint_path = trainer.save_checkpoint(output_dir / "checkpoint")

        # 4. Evaluate and generate with the canonical native components.
        evaluation = Evaluator(
            model=model,
            dataloader=train_loader,
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
            block_size=5,
            device=torch.device("cpu"),
            tokenizer=tokenizer,
        ).generate_string("arc lm", max_new_tokens=3, top_k=3)

        # 5. Inspect one transparent generation step.
        trace = inspect_text(
            model=model,
            tokenizer=tokenizer,
            text="arc lm",
            top_k=1, # top_k is het bedoeld om de inspectie te beperken tot de meest waarschijnlijke token. zoals in de generate_string functie, maar hier gebruiken we het om de inspectie te beperken tot de meest waarschijnlijke token.
            # als tok k is 1, dan wordt alleen de meest waarschijnlijke token getoond in de inspectie. als tok k groter is dan 1, dan worden de top k tokens getoond in de inspectie.
        )

        print(f"Training steps: {state.global_step}")
        print(f"Checkpoint: {checkpoint_path}")
        print(f"Evaluation loss: {evaluation.metrics['loss']:.4f}")
        print(f"Generated: {generated}")
        print()
        print(trace.summary())


if __name__ == "__main__":
    main()
