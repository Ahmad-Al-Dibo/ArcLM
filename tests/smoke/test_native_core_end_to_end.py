import math

import pytest

torch = pytest.importorskip("torch")

from arclm.datasets import create_dataloader, load_dataset
from arclm.evaluation import EvaluationConfig, Evaluator, LossMetric
from arclm.inference import Generator
from arclm.models import ArcLM
from arclm.tokenizers import Tokenizer
from arclm.training import Trainer, TrainingConfig


def test_native_core_end_to_end_cpu(tmp_path):
    torch.manual_seed(0)
    records = load_dataset(
        [
            {"text": "arc lm learns tokens"},
            {"text": "arc lm predicts tokens"},
            {"text": "tokens train arc lm"},
        ],
        required_fields=["text"],
    )
    text = " ".join(record["text"] for record in records)

    tokenizer = Tokenizer(max_vocab=32)
    tokenizer.build(text)
    token_ids = tokenizer.encode_text(text)
    train_loader = create_dataloader(
        token_ids * 3,
        block_size=4,
        batch_size=2,
        shuffle=False,
    )

    model = ArcLM(
        vocab_size=tokenizer.get_vocab_size(),
        embed_dim=8,
        block_size=4,
        num_blocks=1,
        dropout=0.0,
    )
    config = TrainingConfig(
        epochs=1,
        batch_size=2,
        learning_rate=1e-2,
        output_dir=str(tmp_path / "run"),
        save_every_steps=0,
        log_every_steps=0,
        device="cpu",
    )
    trainer = Trainer(model=model, config=config)

    state = trainer.train(train_loader, epochs=1)
    checkpoint_path = trainer.save_checkpoint(tmp_path / "checkpoint")

    resumed_model = ArcLM(
        vocab_size=tokenizer.get_vocab_size(),
        embed_dim=8,
        block_size=4,
        num_blocks=1,
        dropout=0.0,
    )
    resumed = Trainer(
        model=resumed_model,
        config=TrainingConfig(
            epochs=1,
            batch_size=2,
            learning_rate=1e-2,
            output_dir=str(tmp_path / "resume"),
            save_every_steps=0,
            log_every_steps=0,
            device="cpu",
        ),
    )
    resumed.load_checkpoint(checkpoint_path)

    result = Evaluator(
        model=resumed_model,
        dataloader=train_loader,
        metrics=[LossMetric()],
        config=EvaluationConfig(batch_size=2, device="cpu"),
        loss_fn=lambda logits, targets: torch.nn.functional.cross_entropy(
            logits.reshape(-1, logits.size(-1)),
            targets.reshape(-1),
        ),
    ).evaluate()
    generated = Generator(
        resumed_model,
        tokenizer.stoi,
        tokenizer.itos,
        block_size=4,
        device=torch.device("cpu"),
        tokenizer=tokenizer,
    ).generate_string("arc lm", max_new_tokens=2, top_k=3)

    assert state.global_step > 0
    assert checkpoint_path.exists()
    assert resumed.global_step == state.global_step
    assert math.isfinite(result.metrics["loss"])
    assert isinstance(generated, str)
    assert generated.strip()
