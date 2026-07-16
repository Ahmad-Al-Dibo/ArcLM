import math

import torch
import pytest

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
from arclm.peft import (
    LoRAConfig,
    get_lora_state_dict,
    inspect_adapter_artifact,
    is_lora_model,
    load_adapter_artifact,
    merge_lora,
    save_adapter_artifact,
    unmerge_lora,
    validate_adapter_artifact,
)
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


def _training_config(path, *, epochs=1):
    return TrainingConfig(
        epochs=epochs,
        batch_size=2,
        learning_rate=5e-2,
        output_dir=str(path),
        save_every_steps=0,
        log_every_steps=0,
        shuffle=False,
    )


def test_lora_fine_tuning_checkpoint_adapter_reload_merge_and_artifact(tmp_path):
    tokenizer = _tokenizer()
    ft_config = FineTuningConfig(
        formatter="instruction_response",
        max_sequence_length=24,
        train_on_prompt=False,
    )
    lora_config = LoRAConfig(rank=2, alpha=4, dropout=0.0)
    model = _model(tokenizer)
    base_before = {
        key: value.detach().clone()
        for key, value in model.state_dict().items()
    }
    prepared = prepare_fine_tuning_dataset(_records(), tokenizer, ft_config)

    result = fine_tune(
        model=model,
        tokenizer=tokenizer,
        train_dataset=_records(),
        eval_dataset=_records(),
        training_config=_training_config(tmp_path / "first"),
        fine_tuning_config=ft_config,
        peft_config=lora_config,
        save_checkpoint=True,
    )

    assert result.peft_result is not None
    assert result.training_state.optimizer_step > 0
    assert math.isfinite(result.training_state.last_loss)
    assert is_lora_model(model)
    assert result.peft_result.parameter_report.trainable_parameters < (
        result.peft_result.parameter_report.total_parameters
    )
    assert torch.equal(
        base_before["blocks.0.attn.query.weight"],
        model.blocks[0].attn.query.base.weight.detach().cpu(),
    )
    assert any(not torch.equal(value, torch.zeros_like(value)) for value in get_lora_state_dict(model).values())

    checkpoint_path = result.checkpoint_path
    assert checkpoint_path is not None
    resumed_model = _model(tokenizer)
    resumed = fine_tune(
        model=resumed_model,
        tokenizer=tokenizer,
        train_dataset=_records(),
        training_config=_training_config(tmp_path / "second", epochs=2),
        fine_tuning_config=ft_config,
        peft_config=lora_config,
        resume_from_checkpoint=checkpoint_path,
    )
    assert resumed.training_state.global_step >= result.training_state.global_step

    adapter_path = tmp_path / "adapter"
    resumed.save_adapter_artifact(adapter_path)
    validate_adapter_artifact(adapter_path)
    info = inspect_adapter_artifact(adapter_path, verify_integrity=True)
    assert info.method == "lora"

    clean = _model(tokenizer)
    load_adapter_artifact(clean, adapter_path)
    inputs = torch.tensor([prepared[0]["input_ids"]], dtype=torch.long)
    clean.eval()
    resumed_model.eval()
    assert torch.allclose(resumed_model(inputs), clean(inputs), atol=1e-5)

    before_merge = resumed_model(inputs)
    merge_lora(resumed_model)
    after_merge = resumed_model(inputs)
    unmerge_lora(resumed_model)
    assert torch.allclose(before_merge, after_merge, atol=1e-5)

    with pytest.raises(Exception, match="merge_adapter"):
        resumed.save_model_artifact(tmp_path / "bad-artifact", config=_model_config(tokenizer))

    artifact = tmp_path / "merged-artifact"
    resumed.save_model_artifact(
        artifact,
        config=_model_config(tokenizer),
        merge_adapter=True,
    )
    validate_model_artifact(artifact)
    loaded = load_model_artifact(artifact, device="cpu")
    assert not is_lora_model(loaded.model)

    evaluator = Evaluator(
        ModelAdapter(loaded.model),
        dataset=prepared,
        metrics=[LossMetric()],
        config=EvaluationConfig(batch_size=1, device="cpu"),
        collate_fn=SFTDataCollator(
            tokenizer=loaded.tokenizer,
            config=ft_config.to_sft_config(),
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


def test_legacy_standalone_save_adapter_requires_lora_model(tmp_path):
    tokenizer = _tokenizer()
    with pytest.raises(Exception, match="does not contain LoRA"):
        save_adapter_artifact(_model(tokenizer), tmp_path / "adapter", config=LoRAConfig())
