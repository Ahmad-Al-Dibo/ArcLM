import torch

from arclm.models import ArcLM
from arclm.finetuning import FullFineTuner, ModelAdapter, SFTConfig, SFTTrainer

from ._helpers import TinyCausalLM, TinyExternalModel, TinyTokenizer, instruction_dataset


def _config(tmp_path, **kwargs):
    values = {
        "epochs": 1,
        "batch_size": 2,
        "learning_rate": 1e-2,
        "max_length": 24,
        "log_every_steps": 0,
        "save_every_steps": 0,
        "output_dir": str(tmp_path),
        "instruction_field": "instruction",
        "input_field": "input",
        "response_field": "output",
        "assistant_only_loss": True,
    }
    values.update(kwargs)
    return SFTConfig(**values)


def test_sft_trainer_changes_model_parameters(tmp_path):
    model = TinyCausalLM()
    before = [parameter.detach().clone() for parameter in model.parameters()]
    trainer = SFTTrainer(
        model=model,
        tokenizer=TinyTokenizer(),
        train_dataset=instruction_dataset(),
        config=_config(tmp_path),
    )

    state = trainer.train()

    assert state.global_step > 0
    assert any(
        not torch.allclose(old, new.detach().cpu())
        for old, new in zip(before, model.parameters())
    )


def test_sft_trainer_supports_native_arclm_model(tmp_path):
    model = ArcLM(vocab_size=64, embed_dim=8, block_size=24, num_blocks=1)
    trainer = SFTTrainer(
        model=model,
        tokenizer=TinyTokenizer(),
        train_dataset=instruction_dataset(),
        config=_config(tmp_path),
    )

    state = trainer.train()

    assert state.optimizer_step > 0


def test_full_finetuner_evaluate_uses_basic_evaluation(tmp_path):
    trainer = FullFineTuner(
        model=TinyCausalLM(),
        tokenizer=TinyTokenizer(),
        train_dataset=instruction_dataset(),
        validation_dataset=instruction_dataset(),
        config=_config(tmp_path),
    )
    trainer.train()

    metrics = trainer.evaluate()

    assert metrics["loss"] is not None
    assert metrics["perplexity"] is not None
    assert "token_accuracy" in metrics


def test_checkpoint_resume_with_new_trainer_and_model(tmp_path):
    tokenizer = TinyTokenizer()
    first = SFTTrainer(
        model=TinyCausalLM(),
        tokenizer=tokenizer,
        train_dataset=instruction_dataset(),
        config=_config(tmp_path / "first", epochs=1),
    )
    first.train()
    checkpoint = first.save_checkpoint(tmp_path / "checkpoint")
    saved_step = first.trainer.global_step

    second = SFTTrainer(
        model=TinyCausalLM(),
        tokenizer=tokenizer,
        train_dataset=instruction_dataset(),
        config=_config(tmp_path / "second", epochs=2),
    )
    second.load_checkpoint(checkpoint)

    assert second.trainer.global_step == saved_step
    second.train()
    assert second.trainer.global_step >= saved_step


def test_custom_external_model_adapter_trains(tmp_path):
    model = TinyExternalModel()
    adapter = ModelAdapter(
        model,
        input_map={
            "input_ids": "tokens",
            "attention_mask": "mask",
            "labels": "targets",
        },
        output_map={"loss": "training_loss", "logits": "scores"},
    )
    trainer = SFTTrainer(
        model=model,
        model_adapter=adapter,
        tokenizer=TinyTokenizer(),
        train_dataset=instruction_dataset(),
        config=_config(tmp_path),
    )

    state = trainer.train()

    assert state.optimizer_step > 0
