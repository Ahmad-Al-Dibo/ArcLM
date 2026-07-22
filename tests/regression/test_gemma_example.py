"""Regression tests for the Gemma example adapter fallback."""

from __future__ import annotations

import importlib.util
from pathlib import Path

import pytest

torch = pytest.importorskip("torch")
nn = pytest.importorskip("torch.nn")
F = pytest.importorskip("torch.nn.functional")


EXAMPLE_DIR = Path(__file__).resolve().parents[2] / "examples" / "gemma"


def load_adapter_module():
    spec = importlib.util.spec_from_file_location("gemma_example_adapter", EXAMPLE_DIR / "adapter.py")
    assert spec is not None
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(module)
    return module


class TinyCausalLM(nn.Module):
    def __init__(self):
        super().__init__()
        self.proj = nn.Linear(4, 7)

    def forward(self, input_ids, attention_mask=None):
        del attention_mask
        one_hot = F.one_hot(input_ids % 4, num_classes=4).float()
        return {"logits": self.proj(one_hot)}


def test_gemma_fallback_model_adapter_returns_loss_and_logits(monkeypatch):
    adapter = load_adapter_module()
    monkeypatch.setattr(adapter, "ArcLMModelAdapter", None)

    model_adapter = adapter.build_model_adapter(TinyCausalLM())
    input_ids = torch.tensor([[1, 2, 3, 4]])
    labels = torch.tensor([[1, 2, 3, 4]])
    outputs = model_adapter(input_ids=input_ids, labels=labels)

    assert type(model_adapter).__name__ == "GemmaCausalLMAdapter"
    assert set(outputs) == {"loss", "logits"}
    assert outputs["logits"].shape == (1, 4, 7)
    assert outputs["loss"].ndim == 0


def test_gemma_builder_uses_arclm_adapter_when_available():
    adapter = load_adapter_module()

    class FakeArcLMAdapter:
        def __init__(self, model):
            self.model = model

    adapter.ArcLMModelAdapter = FakeArcLMAdapter
    model = TinyCausalLM()

    assert isinstance(adapter.build_model_adapter(model), FakeArcLMAdapter)
