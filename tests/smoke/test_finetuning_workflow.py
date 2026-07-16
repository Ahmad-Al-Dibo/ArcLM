import math

import torch

from arclm.configs import Config
from arclm.evaluation import EvaluationConfig, Evaluator, LossMetric
from arclm.finetuning import (
    FineTuningConfig,
    ModelAdapter,
    SFTDataCollator,
    fine_tune,
    prepare_fine_tuning_dataset,
)
from arclm.inference import Generator
from arclm.lifecycle import load_model_artifact, validate_model_artifact
from arclm.models import ArcLM
from arclm.tokenizers import Tokenizer
from arclm.training import TrainingConfig


def _records():
    return [
        {"instruction": "Say greeting", "input": "friendly", "output": "hello"},
        {"instruction": "Say farewell", "input": "short", "output": "bye"},
        {"instruction": "Name library", "input": "", "output": "ArcLM"},
    ]


def _tokenizer():
    tokenizer = Tokenizer(max_vocab=64)
    tokenizer.build(
        "Instruction: Say greeting friendly farewell short Name library "
        "Input: Response: hello bye ArcLM"
    )
    return tokenizer


def _model(tokenizer):
    torch.manual_seed(123)
    return ArcLM(
        vocab_size=tokenizer.vocab_size,
        embed_dim=8,
        block_size=24,
        num_blocks=1,
        dropout=0.0,
    )


def _model_config(tokenizer):
    return Config(
        vocab_size=tokenizer.vocab_size,
        embed_dim=8,
        block_size=24,
        num_blocks=1,
        dropout=0.0,
        device="cpu",
    )


def test_native_fine_tuning_workflow_checkpoint_artifact_reload_and_inference(tmp_path):
    tokenizer = _tokenizer()
    config = FineTuningConfig(
        formatter="instruction_response",
        max_sequence_length=24,
        train_on_prompt=False,
    )
    prepared = prepare_fine_tuning_dataset(_records(), tokenizer, config)
    model = _model(tokenizer)
    before = {
        key: value.detach().clone()
        for key, value in model.state_dict().items()
    }

    result = fine_tune(
        model=model,
        tokenizer=tokenizer,
        train_dataset=_records(),
        eval_dataset=_records(),
        training_config=TrainingConfig(
            epochs=1,
            batch_size=2,
            learning_rate=1e-2,
            output_dir=str(tmp_path / "first"),
            save_every_steps=0,
            log_every_steps=0,
            shuffle=False,
        ),
        fine_tuning_config=config,
        save_checkpoint=True,
    )

    checkpoint_path = result.checkpoint_path
    assert checkpoint_path is not None
    assert result.dataset_report.dataset_fingerprint == prepared.report.dataset_fingerprint
    assert result.training_state.optimizer_step > 0
    assert math.isfinite(result.training_state.last_loss)
    assert any(
        not torch.equal(before[key], value.detach().cpu())
        for key, value in model.state_dict().items()
    )

    resumed_model = _model(tokenizer)
    resumed = fine_tune(
        model=resumed_model,
        tokenizer=tokenizer,
        train_dataset=_records(),
        training_config=TrainingConfig(
            epochs=2,
            batch_size=2,
            learning_rate=1e-2,
            output_dir=str(tmp_path / "second"),
            save_every_steps=0,
            log_every_steps=0,
            shuffle=False,
        ),
        fine_tuning_config=config,
        resume_from_checkpoint=checkpoint_path,
    )
    assert resumed.training_state.global_step >= result.training_state.global_step

    artifact = tmp_path / "final-artifact"
    resumed.save_model_artifact(artifact, config=_model_config(tokenizer))
    validate_model_artifact(artifact)
    loaded = load_model_artifact(artifact, device="cpu")

    weights = torch.load(artifact / "model" / "weights.pt", map_location="cpu")
    assert "optimizer_state_dict" not in weights
    assert "scheduler_state_dict" not in weights
    for key, value in loaded.model.state_dict().items():
        assert torch.equal(value, resumed_model.state_dict()[key].cpu())

    evaluator = Evaluator(
        ModelAdapter(loaded.model),
        dataset=prepared,
        metrics=[LossMetric()],
        config=EvaluationConfig(batch_size=1, device="cpu"),
        collate_fn=SFTDataCollator(
            tokenizer=loaded.tokenizer,
            config=config.to_sft_config(),
        ),
    )
    evaluation = evaluator.evaluate()
    assert math.isfinite(evaluation.metrics["loss"])

    generated = Generator(
        loaded.model,
        loaded.tokenizer.stoi,
        loaded.tokenizer.itos,
        block_size=24,
        device=torch.device("cpu"),
        tokenizer=loaded.tokenizer,
    ).generate("Instruction:", max_new_tokens=1)
    assert generated
