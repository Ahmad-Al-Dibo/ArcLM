import math

import pytest
import torch

from arclm.evaluation import EvaluationConfig, Evaluator, LossMetric
from arclm.finetuning import FineTuningConfig, ModelAdapter, fine_tune
from arclm.lifecycle import (
    ModelSource,
    inspect_model_artifact,
    load_model_artifact,
    save_model_artifact,
    validate_model_artifact,
)
from arclm.peft import (
    LoRAConfig,
    get_lora_state_dict,
    inspect_adapter_artifact,
    is_lora_model,
    load_adapter_artifact,
    merged_lora_model,
)
from arclm.training import TrainingConfig

pytestmark = [pytest.mark.huggingface, pytest.mark.hf_optional, pytest.mark.cpu_integration]


transformers = pytest.importorskip("transformers", reason="Transformers optional integration is unavailable")
pytest.importorskip("tokenizers", reason="Tokenizer fixture requires the tokenizers package")

from tokenizers import Tokenizer as RawTokenizer  # noqa: E402
from tokenizers.models import WordLevel  # noqa: E402
from tokenizers.pre_tokenizers import Whitespace  # noqa: E402
from transformers import AutoModelForCausalLM, AutoTokenizer, GPT2Config, GPT2LMHeadModel, PreTrainedTokenizerFast  # noqa: E402


def _tiny_tokenizer():
    vocab = {
        "<pad>": 0,
        "<bos>": 1,
        "<eos>": 2,
        "<unk>": 3,
        "hello": 4,
        "world": 5,
        "arclm": 6,
        "training": 7,
        "response": 8,
        "data": 9,
    }
    raw = RawTokenizer(WordLevel(vocab, unk_token="<unk>"))
    raw.pre_tokenizer = Whitespace()
    return PreTrainedTokenizerFast(
        tokenizer_object=raw,
        unk_token="<unk>",
        pad_token="<pad>",
        bos_token="<bos>",
        eos_token="<eos>",
    )


def _tiny_model(tokenizer):
    torch.manual_seed(2468)
    config = GPT2Config(
        vocab_size=len(tokenizer),
        n_positions=16,
        n_ctx=16,
        n_embd=16,
        n_layer=1,
        n_head=2,
        bos_token_id=tokenizer.bos_token_id,
        eos_token_id=tokenizer.eos_token_id,
        pad_token_id=tokenizer.pad_token_id,
    )
    model = GPT2LMHeadModel(config)
    model.eval()
    return model


def _write_local_hf_fixture(path):
    tokenizer = _tiny_tokenizer()
    model = _tiny_model(tokenizer)
    path.mkdir(parents=True, exist_ok=True)
    model.save_pretrained(path)
    tokenizer.save_pretrained(path)
    return path


def _load_fixture(path):
    model = AutoModelForCausalLM.from_pretrained(
        path,
        local_files_only=True,
        trust_remote_code=False,
    )
    tokenizer = AutoTokenizer.from_pretrained(
        path,
        local_files_only=True,
        trust_remote_code=False,
    )
    return model, tokenizer


def _records():
    return [
        {"prompt": "hello world", "completion": "arclm response"},
        {"prompt": "arclm training", "completion": "hello response"},
        {"prompt": "hello arclm", "completion": "world response"},
    ]


def _fine_tuning_config():
    return FineTuningConfig(
        mode="supervised_fine_tuning",
        formatter="prompt_completion",
        max_sequence_length=8,
        train_on_prompt=False,
        append_eos_token=True,
    )


def _training_config(tmp_path, *, max_steps=1, epochs=1):
    return TrainingConfig(
        epochs=epochs,
        batch_size=2,
        learning_rate=1e-3,
        max_steps=max_steps,
        output_dir=str(tmp_path),
        save_every_steps=0,
        keep_last_checkpoints=None,
        device="cpu",
        shuffle=False,
    )


def _forward_loss(model, tokenizer):
    encoded = tokenizer("hello world", return_tensors="pt")
    labels = encoded["input_ids"].clone()
    with torch.no_grad():
        output = model(**encoded, labels=labels)
    return float(output.loss.detach().cpu().item())


def test_huggingface_lifecycle_artifact_cpu_runtime(tmp_path):
    source = _write_local_hf_fixture(tmp_path / "hf-model")
    metadata = ModelSource.from_source(source)
    model, tokenizer = _load_fixture(source)
    base_loss = _forward_loss(model, tokenizer)

    artifact = tmp_path / "hf-artifact"
    manifest = save_model_artifact(
        model,
        artifact,
        tokenizer=tokenizer,
        training_summary={"final_loss": base_loss, "global_step": 0},
        evaluation_summary={"metrics": {"loss": base_loss}},
    )
    info = inspect_model_artifact(artifact, verify_integrity=True)
    validate_model_artifact(artifact)
    loaded = load_model_artifact(artifact, device="cpu")
    reloaded_loss = _forward_loss(loaded.model, loaded.tokenizer)
    generated = loaded.model.generate(
        loaded.tokenizer("hello", return_tensors="pt")["input_ids"],
        max_new_tokens=1,
        pad_token_id=loaded.tokenizer.pad_token_id,
    )

    assert metadata.source_type == "huggingface_folder"
    assert manifest.model["source_type"] == "huggingface_folder"
    assert info.source_type == "huggingface_folder"
    assert loaded.source_type == "huggingface_folder"
    assert math.isfinite(reloaded_loss)
    assert generated.shape[-1] >= 2


def test_huggingface_full_fine_tuning_checkpoint_resume_and_artifact(tmp_path):
    source = _write_local_hf_fixture(tmp_path / "hf-model")
    model, tokenizer = _load_fixture(source)
    before = {name: value.detach().clone() for name, value in model.named_parameters()}

    result = fine_tune(
        model=model,
        tokenizer=tokenizer,
        train_dataset=_records(),
        eval_dataset=_records()[:2],
        training_config=_training_config(tmp_path / "full", max_steps=1),
        fine_tuning_config=_fine_tuning_config(),
        save_checkpoint=True,
    )
    changed = any(
        not torch.equal(value.detach().cpu(), before[name].cpu())
        for name, value in result.model.named_parameters()
    )
    resumed_model, resumed_tokenizer = _load_fixture(source)
    resumed = fine_tune(
        model=resumed_model,
        tokenizer=resumed_tokenizer,
        train_dataset=_records(),
        eval_dataset=_records()[:2],
        training_config=_training_config(tmp_path / "resume", max_steps=2, epochs=2),
        fine_tuning_config=_fine_tuning_config(),
        resume_from_checkpoint=result.checkpoint_path,
    )
    artifact = tmp_path / "full-artifact"
    resumed.save_model_artifact(artifact)
    loaded = load_model_artifact(artifact, device="cpu")

    assert changed
    assert result.checkpoint_path is not None
    assert result.evaluation_result is not None
    assert math.isfinite(float(result.training_state.last_loss))
    assert resumed.training_state is not None
    assert resumed.training_state.global_step >= result.training_state.global_step
    assert math.isfinite(_forward_loss(loaded.model, loaded.tokenizer))


def test_huggingface_lora_runtime_adapter_reload_merge_and_artifact(tmp_path):
    source = _write_local_hf_fixture(tmp_path / "hf-model")
    model, tokenizer = _load_fixture(source)
    base_embedding = model.transformer.wte.weight.detach().clone()
    config = LoRAConfig(rank=2, alpha=4, target_modules=("lm_head",), target_match="leaf")

    result = fine_tune(
        model=model,
        tokenizer=tokenizer,
        train_dataset=_records(),
        eval_dataset=_records()[:2],
        training_config=_training_config(tmp_path / "lora", max_steps=1),
        fine_tuning_config=_fine_tuning_config(),
        peft_config=config,
        save_checkpoint=True,
    )
    adapter_state = get_lora_state_dict(result.model)
    adapter_path = tmp_path / "lora-adapter"
    result.save_adapter_artifact(adapter_path)
    adapter_info = inspect_adapter_artifact(adapter_path, verify_integrity=True)
    clean, clean_tokenizer = _load_fixture(source)
    load_adapter_artifact(clean, adapter_path)
    merged = merged_lora_model(clean)
    final_artifact = tmp_path / "merged-artifact"
    save_model_artifact(
        merged,
        final_artifact,
        tokenizer=clean_tokenizer,
        training_summary={"peft_method": "lora"},
    )
    loaded = load_model_artifact(final_artifact, device="cpu")

    assert result.checkpoint_path is not None
    assert result.evaluation_result is not None
    assert is_lora_model(result.model)
    assert torch.equal(result.model.transformer.wte.weight.detach().cpu(), base_embedding.cpu())
    assert any(torch.count_nonzero(value).item() for value in adapter_state.values())
    assert adapter_info.method == "lora"
    assert math.isfinite(_forward_loss(clean, clean_tokenizer))
    assert not is_lora_model(merged)
    assert math.isfinite(_forward_loss(loaded.model, loaded.tokenizer))


def test_huggingface_evaluator_with_model_adapter(tmp_path):
    source = _write_local_hf_fixture(tmp_path / "hf-model")
    model, tokenizer = _load_fixture(source)
    prepared = [
        {
            "input_ids": torch.tensor([4, 5, 2], dtype=torch.long),
            "attention_mask": torch.tensor([1, 1, 1], dtype=torch.long),
            "labels": torch.tensor([4, 5, 2], dtype=torch.long),
        }
    ]
    evaluator = Evaluator(
        ModelAdapter(model),
        dataset=prepared,
        metrics=[LossMetric()],
        config=EvaluationConfig(batch_size=1, device="cpu"),
    )

    result = evaluator.evaluate()

    assert math.isfinite(result.metrics["loss"])
