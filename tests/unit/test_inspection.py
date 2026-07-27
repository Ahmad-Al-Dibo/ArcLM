import json

import pytest

torch = pytest.importorskip("torch")

from arclm import PipelineTrace, inspect_text
from arclm.inspection import inspect_text as domain_inspect_text
from arclm.models import ArcLM
from arclm.tokenizers import Tokenizer


def _tiny_model_and_tokenizer():
    tokenizer = Tokenizer(max_vocab=16)
    tokenizer.build("hello arclm trace token generated")
    model = ArcLM(
        vocab_size=tokenizer.get_vocab_size(),
        embed_dim=8,
        block_size=4,
        num_blocks=1,
        dropout=0.0,
    )
    return model, tokenizer


def test_inspect_text_returns_native_trace_shapes_and_json():
    torch.manual_seed(1)
    model, tokenizer = _tiny_model_and_tokenizer()

    trace = inspect_text(
        model=model,
        tokenizer=tokenizer,
        text="hello arclm",
        top_k=1,
    )

    assert isinstance(trace, PipelineTrace)
    assert trace.input_text == "hello arclm"
    assert trace.tokens == ["hello", "arclm"]
    assert trace.token_ids == tokenizer.encode_text("hello arclm")
    assert trace.sequence_length == 2
    assert trace.input_shape == [1, 2]
    assert trace.embedding_shape == [1, 2, 8]
    assert trace.logits_shape == [1, 2, tokenizer.get_vocab_size()]
    assert isinstance(trace.selected_token_id, int)
    assert isinstance(trace.generated_text, str)
    assert trace.attention_available is False
    assert trace.values is None
    assert json.loads(trace.to_json())["input_text"] == "hello arclm"
    assert "ArcLM Pipeline Trace" in trace.summary()


def test_inspect_text_restores_training_state_and_does_not_keep_grads():
    model, tokenizer = _tiny_model_and_tokenizer()
    model.train()

    trace = inspect_text(model=model, tokenizer=tokenizer, text="hello", top_k=1)

    assert model.training is True
    assert trace.values is None
    assert all(parameter.grad is None for parameter in model.parameters())


def test_inspect_text_empty_input_and_unsupported_objects_fail_clearly():
    model, tokenizer = _tiny_model_and_tokenizer()

    with pytest.raises(ValueError, match="non-empty"):
        inspect_text(model=model, tokenizer=tokenizer, text=" ")
    with pytest.raises(TypeError, match="native tokenizer"):
        inspect_text(model=model, tokenizer=object(), text="hello")
    with pytest.raises(TypeError, match="native torch model"):
        inspect_text(model=object(), tokenizer=tokenizer, text="hello")


def test_inspect_text_limited_value_capture_is_json_safe():
    model, tokenizer = _tiny_model_and_tokenizer()

    trace = inspect_text(
        model=model,
        tokenizer=tokenizer,
        text="hello arclm",
        top_k=1,
        include_values=True,
        max_values=3,
    )

    assert trace.values is not None
    assert set(trace.values) == {
        "input_ids",
        "embedding_values",
        "logit_values",
    }
    assert all(len(values) <= 3 for values in trace.values.values())
    json.dumps(trace.to_dict())


def test_inspect_text_public_root_and_domain_imports_match():
    assert inspect_text is domain_inspect_text
