import builtins

import pytest
from fastapi.testclient import TestClient

torch = pytest.importorskip("torch")

from arclm.models import ArcLM
from arclm.tokenizers import Tokenizer
from arclm.web import WebConfig, create_app


def _tiny_model_and_tokenizer():
    tokenizer = Tokenizer(max_vocab=16)
    tokenizer.build("hello arclm trace generated token")
    model = ArcLM(
        vocab_size=tokenizer.get_vocab_size(),
        embed_dim=8,
        block_size=4,
        num_blocks=1,
        dropout=0.0,
    )
    return model, tokenizer


def _client(model=None, tokenizer=None):
    if model is None and tokenizer is None:
        model, tokenizer = _tiny_model_and_tokenizer()
    return TestClient(create_app(WebConfig(), model=model, tokenizer=tokenizer))


def test_inspection_status_reports_configured_native_objects():
    model, tokenizer = _tiny_model_and_tokenizer()
    response = _client(model, tokenizer).get("/api/inspection/status")

    assert response.status_code == 200
    data = response.json()
    assert data["available"] is True
    assert data["initialized"] is True
    assert data["mode"] == "configured"
    assert data["model_class"] == "ArcLM"
    assert data["tokenizer_class"] == "Tokenizer"
    assert data["supports_attention"] is False
    assert data["supports_value_capture"] is True
    assert data["supports_streaming"] is False
    assert data["supports_external_models"] is False


def test_inspection_request_returns_pipeline_trace_without_values_by_default():
    torch.manual_seed(1)
    response = _client().post("/api/inspection/text", json={"text": "hello arclm"})

    assert response.status_code == 200
    data = response.json()
    assert data["input_text"] == "hello arclm"
    assert data["tokens"] == ["hello", "arclm"]
    assert data["token_ids"] == [1, 2]
    assert data["input_shape"] == [1, 2]
    assert data["embedding_shape"] == [1, 2, 8]
    assert data["logits_shape"][0:2] == [1, 2]
    assert data["model_class"] == "ArcLM"
    assert data["tokenizer_class"] == "Tokenizer"
    assert data["attention_available"] is False
    assert data["values"] is None


def test_inspection_request_can_return_limited_values():
    response = _client().post(
        "/api/inspection/text",
        json={"text": "hello", "include_values": True, "max_values": 3},
    )

    assert response.status_code == 200
    values = response.json()["values"]
    assert set(values) == {"input_ids", "embedding_values", "logit_values"}
    assert all(len(items) <= 3 for items in values.values())


def test_inspection_rejects_empty_excessive_and_unsupported_options():
    client = _client()

    empty = client.post("/api/inspection/text", json={"text": "   "})
    too_long = client.post("/api/inspection/text", json={"text": "x" * 2001})
    too_many_values = client.post("/api/inspection/text", json={"text": "hello", "max_values": 51})
    multi_step = client.post("/api/inspection/text", json={"text": "hello", "max_new_tokens": 2})

    assert empty.status_code == 400
    assert empty.json()["error"]["code"] == "inspection_text_empty"
    assert too_long.status_code == 413
    assert too_long.json()["error"]["code"] == "inspection_text_too_long"
    assert too_many_values.status_code == 400
    assert too_many_values.json()["error"]["code"] == "inspection_values_limit_invalid"
    assert multi_step.status_code == 422


def test_inspection_missing_model_returns_actionable_conflict():
    client = TestClient(create_app(WebConfig()))

    status = client.get("/api/inspection/status")
    response = client.post("/api/inspection/text", json={"text": "hello"})

    assert status.status_code == 200
    assert status.json()["available"] is True
    assert status.json()["initialized"] is False
    assert status.json()["reason"] == "inspection_source_not_selected"
    assert status.json()["supported_modes"] == ["demo", "project_model", "checkpoint"]
    assert response.status_code == 409
    assert response.json() == {
        "error": {
            "code": "native_model_not_configured",
            "message": "The local ArcLM inspection model and tokenizer are not configured.",
        }
    }


def test_inspection_demo_mode_works_without_configured_model():
    client = TestClient(create_app(WebConfig()))

    response = client.post(
        "/api/inspection/text",
        json={"source_mode": "demo", "text": "hello arclm", "include_values": True, "max_values": 2},
    )

    assert response.status_code == 200, response.text
    data = response.json()
    assert data["source_mode"] == "demo"
    assert data["source_label"] == "Educational tiny demo"
    assert data["model_state"] == "untrained_demo"
    assert data["model_class"] == "ArcLM"
    assert data["tokenizer_class"] == "Tokenizer"
    assert data["values"] is not None


def test_inspection_converts_known_trace_errors(monkeypatch):
    import arclm.web.app as app_module

    def fail_inspection(**_kwargs):
        raise ValueError("inspect_text requires non-empty input text.")

    monkeypatch.setattr(app_module.arclm, "inspect_text", fail_inspection)

    response = _client().post("/api/inspection/text", json={"text": "hello"})

    assert response.status_code == 400
    assert response.json()["error"] == {
        "code": "inspection_failed",
        "message": "inspect_text requires non-empty input text.",
    }


def test_inspection_endpoint_calls_canonical_inspect_text(monkeypatch):
    import arclm.web.app as app_module

    calls = []

    class FakeTrace:
        def to_dict(self):
            return {
                "input_text": "hello arclm",
                "tokens": ["hello", "arclm"],
                "token_ids": [1, 2],
                "sequence_length": 2,
                "input_shape": [1, 2],
                "embedding_shape": [1, 2, 8],
                "logits_shape": [1, 2, 16],
                "selected_token_id": 3,
                "selected_token": "trace",
                "generated_text": "hello arclm trace",
                "device": "cpu",
                "dtype": "float32",
                "model_class": "ArcLM",
                "tokenizer_class": "Tokenizer",
                "inspected_steps": 1,
                "generation_steps": 1,
                "attention_available": False,
                "attention_note": "Attention tensor capture is planned for a later inspection version.",
                "warnings": [],
                "values": None,
            }

    def fake_inspect_text(**kwargs):
        calls.append(kwargs)
        return FakeTrace()

    monkeypatch.setattr(app_module.arclm, "inspect_text", fake_inspect_text)

    response = _client().post("/api/inspection/text", json={"text": "hello arclm"})

    assert response.status_code == 200
    assert len(calls) == 1
    assert calls[0]["text"] == "hello arclm"
    assert response.json()["generated_text"] == "hello arclm trace"


def test_inspection_endpoint_restores_model_state():
    model, tokenizer = _tiny_model_and_tokenizer()
    model.train()

    response = _client(model, tokenizer).post("/api/inspection/text", json={"text": "hello"})

    assert response.status_code == 200
    assert model.training is True
    assert all(parameter.grad is None for parameter in model.parameters())


def test_inspection_endpoint_does_not_require_huggingface_dependencies(monkeypatch):
    blocked = {"transformers", "datasets", "peft", "accelerate", "bitsandbytes"}
    real_import = builtins.__import__

    def blocked_import(name, *args, **kwargs):
        if name.split(".")[0] in blocked:
            raise AssertionError(f"unexpected optional import: {name}")
        return real_import(name, *args, **kwargs)

    monkeypatch.setattr(builtins, "__import__", blocked_import)

    response = _client().post("/api/inspection/text", json={"text": "hello"})

    assert response.status_code == 200
