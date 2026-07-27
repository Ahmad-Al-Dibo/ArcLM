import math

import pytest
import torch

from arclm.finetuning import FineTuningConfig, fine_tune
from arclm.peft import LoRAConfig, get_lora_state_dict
from arclm.training import TrainingConfig

pytestmark = [pytest.mark.huggingface, pytest.mark.cuda, pytest.mark.cuda_optional]


def _require_cuda_and_transformers():
    pytest.importorskip("transformers", reason="Transformers optional integration is unavailable")
    pytest.importorskip("tokenizers", reason="Tokenizer fixture requires the tokenizers package")
    if not torch.cuda.is_available():
        pytest.skip("CUDA-enabled PyTorch is unavailable")


def _tiny_model_and_tokenizer():
    from tokenizers import Tokenizer as RawTokenizer
    from tokenizers.models import WordLevel
    from tokenizers.pre_tokenizers import Whitespace
    from transformers import GPT2Config, GPT2LMHeadModel, PreTrainedTokenizerFast

    vocab = {
        "<pad>": 0,
        "<bos>": 1,
        "<eos>": 2,
        "<unk>": 3,
        "hello": 4,
        "world": 5,
        "arclm": 6,
        "response": 7,
    }
    raw = RawTokenizer(WordLevel(vocab, unk_token="<unk>"))
    raw.pre_tokenizer = Whitespace()
    tokenizer = PreTrainedTokenizerFast(
        tokenizer_object=raw,
        unk_token="<unk>",
        pad_token="<pad>",
        bos_token="<bos>",
        eos_token="<eos>",
    )
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
    return GPT2LMHeadModel(config), tokenizer


def _records():
    return [
        {"prompt": "hello world", "completion": "arclm response"},
        {"prompt": "arclm", "completion": "hello response"},
    ]


def _fine_tuning_config():
    return FineTuningConfig(
        mode="supervised_fine_tuning",
        formatter="prompt_completion",
        max_sequence_length=8,
        train_on_prompt=False,
        append_eos_token=True,
    )


def test_huggingface_cuda_forward_uses_cuda_device():
    _require_cuda_and_transformers()
    model, tokenizer = _tiny_model_and_tokenizer()
    model.to("cuda:0")
    encoded = tokenizer("hello world", return_tensors="pt")
    encoded = {key: value.to("cuda:0") for key, value in encoded.items()}

    with torch.no_grad():
        output = model(**encoded, labels=encoded["input_ids"])

    assert output.logits.device.type == "cuda"
    assert torch.isfinite(output.loss)


def test_huggingface_lora_cuda_training_step(tmp_path):
    _require_cuda_and_transformers()
    model, tokenizer = _tiny_model_and_tokenizer()
    model.to("cuda:0")
    base_weight = model.transformer.wte.weight.detach().cpu().clone()

    result = fine_tune(
        model=model,
        tokenizer=tokenizer,
        train_dataset=_records(),
        eval_dataset=_records(),
        training_config=TrainingConfig(
            epochs=1,
            batch_size=1,
            learning_rate=1e-3,
            max_steps=1,
            output_dir=str(tmp_path),
            save_every_steps=0,
            keep_last_checkpoints=None,
            device="cuda",
            shuffle=False,
        ),
        fine_tuning_config=_fine_tuning_config(),
        peft_config=LoRAConfig(rank=2, alpha=4, target_modules=("lm_head",), target_match="leaf"),
    )
    adapter_state = get_lora_state_dict(result.model)

    assert math.isfinite(float(result.training_state.last_loss))
    assert torch.equal(result.model.transformer.wte.weight.detach().cpu(), base_weight)
    assert any(torch.count_nonzero(value).item() for value in adapter_state.values())
