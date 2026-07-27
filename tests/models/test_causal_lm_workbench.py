import json

import pytest
import torch

from arclm.checkpoints import inspect_checkpoint
from arclm.datasets import create_dataloader, load_dataset
from arclm.evaluation import EvaluationConfig, Evaluator, LossMetric
from arclm.inference import Generator, inspect_model_source
from arclm.inspection import inspect_text
from arclm.models import ArcLM, get_model_capability, model_support_matrix
from arclm.tokenizers import Tokenizer
from arclm.training import Trainer, TrainingConfig


def _tiny_native_components(tmp_path):
    records = load_dataset(
        [
            {"text": "arc lm validates tiny models"},
            {"text": "tiny causal models reload checkpoints"},
        ],
        required_fields=["text"],
    )
    text = " ".join(row["text"] for row in records)
    tokenizer = Tokenizer(max_vocab=24)
    tokenizer.build(text)
    token_ids = tokenizer.encode_text(text)
    dataloader = create_dataloader(
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
    trainer = Trainer(
        model=model,
        config=TrainingConfig(
            epochs=1,
            batch_size=2,
            learning_rate=1e-2,
            output_dir=str(tmp_path / "run"),
            save_every_steps=0,
            log_every_steps=0,
            device="cpu",
        ),
    )
    return model, tokenizer, dataloader, trainer


def test_model_capability_contract_and_support_matrix_are_json_safe():
    native = get_model_capability("native")
    gpt2 = get_model_capability("hf-internal-testing/tiny-random-gpt2")
    qwen = get_model_capability("Qwen/Qwen3-0.6B")
    matrix = model_support_matrix()

    assert native.status == "Validated"
    assert native.can_forward is True
    assert native.operations["Save/Reload"] == "Passed"
    assert gpt2.status == "Compatible"
    assert "real_weight_forward" in gpt2.unvalidated_operations
    assert qwen.status == "Experimental"
    assert qwen.operations["Forward"] == "Not tested"
    assert len(matrix) == 3
    json.dumps(matrix)

    with pytest.raises(ValueError, match="Unknown model capability target"):
        get_model_capability("unknown/model")


def test_native_arclm_validates_configuration_and_forward_inputs():
    with pytest.raises(ValueError, match="vocab_size"):
        ArcLM(vocab_size=0)
    with pytest.raises(ValueError, match="embed_dim"):
        ArcLM(vocab_size=8, embed_dim=0)
    with pytest.raises(ValueError, match="block_size"):
        ArcLM(vocab_size=8, block_size=0)
    with pytest.raises(ValueError, match="dropout"):
        ArcLM(vocab_size=8, dropout=1.0)

    model = ArcLM(vocab_size=8, embed_dim=4, block_size=3, num_blocks=1)
    with pytest.raises(ValueError, match="shape"):
        model(torch.tensor([1, 2, 3]))
    with pytest.raises(ValueError, match="non-empty"):
        model(torch.empty((1, 0), dtype=torch.long))
    with pytest.raises(ValueError, match="exceeds block_size"):
        model(torch.tensor([[1, 2, 3, 4]], dtype=torch.long))
    with pytest.raises(ValueError, match="Token IDs"):
        model(torch.tensor([[1, 9]], dtype=torch.long))


def test_native_save_reload_generation_evaluation_and_inspection(tmp_path):
    torch.manual_seed(11)
    model, tokenizer, dataloader, trainer = _tiny_native_components(tmp_path)
    state = trainer.train(dataloader, epochs=1)
    checkpoint_path = trainer.save_checkpoint(tmp_path / "checkpoint")

    checkpoint_info = inspect_checkpoint(checkpoint_path)
    metadata = checkpoint_info.metadata
    assert metadata["model_source"] == "native_arclm"
    assert metadata["model_task"] == "causal_language_modeling"
    assert metadata["architecture"] == "ArcLM"
    assert metadata["model_configuration"]["vocab_size"] == tokenizer.get_vocab_size()
    assert metadata["training_configuration"]["batch_size"] == 2

    reloaded = ArcLM(
        vocab_size=tokenizer.get_vocab_size(),
        embed_dim=8,
        block_size=4,
        num_blocks=1,
        dropout=0.0,
    )
    resumed = Trainer(
        model=reloaded,
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
        model=reloaded,
        dataloader=dataloader,
        metrics=[LossMetric()],
        config=EvaluationConfig(batch_size=2, device="cpu"),
        loss_fn=lambda logits, targets: torch.nn.functional.cross_entropy(
            logits.reshape(-1, logits.size(-1)),
            targets.reshape(-1),
        ),
    ).evaluate()
    generated = Generator(
        reloaded,
        tokenizer.stoi,
        tokenizer.itos,
        block_size=4,
        device=torch.device("cpu"),
        tokenizer=tokenizer,
    ).generate_string("arc lm", max_new_tokens=2, top_k=3)
    trace = inspect_text(model=reloaded, tokenizer=tokenizer, text="arc lm", top_k=1)

    assert state.global_step > 0
    assert resumed.global_step == state.global_step
    assert result.metrics["loss"] >= 0
    assert generated.strip()
    assert trace.logits_shape[-1] == tokenizer.get_vocab_size()


def test_generator_restores_model_state_and_validates_sampling_args():
    tokenizer = Tokenizer(max_vocab=12)
    tokenizer.build("arc lm generation state")
    model = ArcLM(
        vocab_size=tokenizer.get_vocab_size(),
        embed_dim=6,
        block_size=4,
        num_blocks=1,
    )
    generator = Generator(
        model,
        tokenizer.stoi,
        tokenizer.itos,
        block_size=4,
        device=torch.device("cpu"),
        tokenizer=tokenizer,
    )

    model.train()
    tokens = generator.generate("arc lm", max_new_tokens=1, top_k=1)
    assert tokens
    assert model.training is True
    assert generator.generate("", max_new_tokens=1) == []
    with pytest.raises(ValueError, match="max_new_tokens"):
        generator.generate("arc", max_new_tokens=-1)
    with pytest.raises(ValueError, match="temperature"):
        generator.generate("arc", temperature=0)
    with pytest.raises(ValueError, match="top_k"):
        generator.generate("arc", top_k=tokenizer.get_vocab_size() + 1)
    with pytest.raises(ValueError, match="top_p"):
        generator.generate("arc", top_p=1.5)


def test_gpt2_and_qwen_boundaries_are_honest_without_downloads(tmp_path):
    gpt2_dir = tmp_path / "gpt2"
    gpt2_dir.mkdir()
    (gpt2_dir / "config.json").write_text('{"model_type": "gpt2"}', encoding="utf-8")
    (gpt2_dir / "tokenizer.json").write_text("{}", encoding="utf-8")
    (gpt2_dir / "model.safetensors").write_text("", encoding="utf-8")

    gpt2_info = inspect_model_source(gpt2_dir)
    qwen_info = inspect_model_source("hf://Qwen/Qwen3-0.6B")

    assert gpt2_info.source_type == "hf_full_model"
    assert gpt2_info.model_type == "gpt2"
    assert qwen_info.source_type == "hf_full_model"
    assert qwen_info.resolved_source == "Qwen/Qwen3-0.6B"
    assert qwen_info.model_type == "qwen"
    assert get_model_capability("gpt2").status == "Compatible"
    assert get_model_capability("Qwen/Qwen3-0.6B").status == "Experimental"
