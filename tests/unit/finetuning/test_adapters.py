import torch

from arclm.finetuning import ModelAdapter, TokenizerAdapter

from ._helpers import TinyCausalLM, TinyExternalModel, TinyHFStyleModel, TinyTokenizer


def test_tokenizer_adapter_supports_simple_tokenizers():
    adapter = TokenizerAdapter(TinyTokenizer())

    ids = adapter.encode("hello world")

    assert len(ids) == 2
    assert adapter.pad_token_id == 0


def test_model_adapter_computes_loss_for_logits_only_model():
    adapter = ModelAdapter(TinyCausalLM(), ignore_index=-100)
    input_ids = torch.tensor([[3, 4, 5, 1]])

    outputs = adapter(input_ids=input_ids, labels=input_ids.clone())

    assert torch.isfinite(outputs["loss"])
    assert outputs["logits"].shape[:2] == input_ids.shape


def test_model_adapter_reads_huggingface_style_outputs():
    adapter = ModelAdapter(TinyHFStyleModel(), ignore_index=-100)
    input_ids = torch.tensor([[3, 4, 5, 1]])

    outputs = adapter(input_ids=input_ids, labels=input_ids.clone())

    assert torch.isfinite(outputs["loss"])
    assert outputs["logits"].shape[:2] == input_ids.shape


def test_model_adapter_supports_custom_input_and_output_names():
    adapter = ModelAdapter(
        TinyExternalModel(),
        input_map={
            "input_ids": "tokens",
            "attention_mask": "mask",
            "labels": "targets",
        },
        output_map={
            "loss": "training_loss",
            "logits": "scores",
        },
    )
    input_ids = torch.tensor([[3, 4, 5, 1]])

    outputs = adapter(input_ids=input_ids, attention_mask=torch.ones_like(input_ids), labels=input_ids)

    assert torch.isfinite(outputs["loss"])
    assert outputs["logits"].shape[:2] == input_ids.shape
