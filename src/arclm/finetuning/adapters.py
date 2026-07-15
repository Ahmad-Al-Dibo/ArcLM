"""Adapters voor modellen en tokenizers."""

from __future__ import annotations

import inspect
from pathlib import Path
from typing import Any

import torch
import torch.nn.functional as F

from ..exceptions import ModelAdapterError, TokenizerAdapterError
from .base import BaseModelAdapter, BaseTokenizerAdapter


class ModelAdapter(torch.nn.Module, BaseModelAdapter):
    """Zet een model om naar het formaat dat ArcLM verwacht.

    De adapter kan standaard PyTorch-modellen, Hugging Face-achtige outputs en
    custom input/output namen gebruiken.
    """

    def __init__(
        self,
        model,
        input_map: dict[str, str] | None = None,
        output_map: dict[str, str] | None = None,
        ignore_index: int = -100,
        label_shift: bool = True,
    ):
        """Maakt een modeladapter.

        Args:
            model: Het echte model.
            input_map: Mapping van ArcLM batch keys naar model argumenten.
            output_map: Mapping van ArcLM output keys naar model output keys.
        """
        super().__init__()
        self.model = model
        self.input_map = input_map or {}
        self.output_map = output_map or {}
        self.ignore_index = ignore_index
        self.label_shift = label_shift

    def forward(self, **batch):
        """Voert het model uit en geeft een dict met `loss` en `logits` terug."""
        labels = batch.get("labels")
        model_inputs = self.prepare_inputs(batch)
        outputs = self.call_model(model_inputs)
        logits = self.read_output(outputs, "logits")
        loss = self.read_output(outputs, "loss")
        if loss is None and logits is not None and labels is not None:
            loss = self.compute_loss(logits, labels)
        if logits is None and loss is None:
            raise ModelAdapterError("The model output does not contain loss or logits")
        result = {}
        if loss is not None:
            result["loss"] = loss
        if logits is not None:
            result["logits"] = logits
        return result

    def prepare_inputs(self, batch: dict[str, Any]) -> dict[str, Any]:
        """Zet batch keys om naar model argumenten."""
        prepared = {}
        for key, value in batch.items():
            target = self.input_map.get(key, key)
            prepared[target] = value
        return prepared

    def call_model(self, model_inputs: dict[str, Any]):
        """Roept het model aan met passende argumenten."""
        try:
            signature = inspect.signature(self.model.forward)
        except (TypeError, ValueError, AttributeError):
            signature = None

        if signature is None:
            return self.model(**model_inputs)

        parameters = signature.parameters
        accepts_kwargs = any(
            parameter.kind == inspect.Parameter.VAR_KEYWORD
            for parameter in parameters.values()
        )
        if accepts_kwargs:
            return self.model(**model_inputs)

        accepted = {
            name: value
            for name, value in model_inputs.items()
            if name in parameters
        }
        if accepted:
            return self.model(**accepted)
        if "input_ids" in model_inputs:
            return self.model(model_inputs["input_ids"])
        raise ModelAdapterError("The model does not accept the prepared SFT inputs")

    def read_output(self, outputs, name: str):
        """Leest `loss` of `logits` uit verschillende outputvormen."""
        mapped = self.output_map.get(name, name)
        if isinstance(outputs, dict):
            return outputs.get(mapped)
        if hasattr(outputs, mapped):
            return getattr(outputs, mapped)
        if isinstance(outputs, (tuple, list)):
            if name == "loss" and len(outputs) > 1:
                return outputs[0]
            if name == "logits":
                return outputs[1] if len(outputs) > 1 else outputs[0]
        if name == "logits" and torch.is_tensor(outputs):
            return outputs
        return None

    def compute_loss(self, logits, labels):
        """Berekent causal-lm loss als het model zelf geen loss geeft."""
        if logits.ndim != labels.ndim + 1:
            raise ModelAdapterError("logits must have one more dimension than labels")
        if self.label_shift and logits.ndim >= 3:
            logits = logits[..., :-1, :].contiguous()
            labels = labels[..., 1:].contiguous()
        vocab_size = logits.shape[-1]
        return F.cross_entropy(
            logits.reshape(-1, vocab_size),
            labels.reshape(-1),
            ignore_index=self.ignore_index,
        )

    def save(self, path: str | Path) -> None:
        """Slaat het model op via `save_pretrained` of `state_dict`."""
        path = Path(path)
        path.mkdir(parents=True, exist_ok=True)
        if hasattr(self.model, "save_pretrained"):
            self.model.save_pretrained(path)
            return
        torch.save(self.model.state_dict(), path / "model.pt")

    def load(self, path: str | Path) -> None:
        """Laadt weights uit een adapter-pad als dat kan."""
        path = Path(path)
        state_path = path / "model.pt"
        if not state_path.exists():
            raise ModelAdapterError(f"Model state not found: {state_path}")
        self.model.load_state_dict(torch.load(state_path, map_location="cpu"))

    def capabilities(self) -> dict[str, bool]:
        """Geeft eenvoudige modelmogelijkheden terug."""
        return {
            "supports_save_pretrained": hasattr(self.model, "save_pretrained"),
            "supports_state_dict": hasattr(self.model, "state_dict"),
            "returns_loss": bool(self.output_map.get("loss")),
            "returns_logits": True,
        }


class TokenizerAdapter(BaseTokenizerAdapter):
    """Zet verschillende tokenizers om naar één eenvoudige interface."""

    def __init__(
        self,
        tokenizer,
        pad_token_id: int | None = None,
        eos_token_id: int | None = None,
    ):
        """Maakt een tokenizeradapter."""
        self.tokenizer = tokenizer
        self.pad_token_id = self._read_token_id("pad_token_id", pad_token_id)
        self.eos_token_id = self._read_token_id("eos_token_id", eos_token_id)

    def encode(self, text: str, max_length: int | None = None, truncation: bool = True):
        """Zet tekst om naar token ids."""
        if hasattr(self.tokenizer, "encode_text"):
            ids = list(self.tokenizer.encode_text(text))
        elif hasattr(self.tokenizer, "encode"):
            ids = list(self.tokenizer.encode(text, add_special_tokens=False))
        elif callable(self.tokenizer):
            encoded = self.tokenizer(
                text,
                add_special_tokens=False,
                truncation=truncation,
                max_length=max_length,
            )
            ids = list(encoded["input_ids"])
        else:
            raise TokenizerAdapterError("Tokenizer must support encode_text, encode, or __call__")
        if max_length is not None and truncation:
            ids = ids[:max_length]
        return ids

    def decode(self, ids):
        """Zet token ids terug naar tekst als de tokenizer dat kan."""
        if hasattr(self.tokenizer, "decode_string"):
            return self.tokenizer.decode_string(ids)
        if hasattr(self.tokenizer, "decode"):
            return self.tokenizer.decode(ids)
        raise TokenizerAdapterError("Tokenizer does not support decoding")

    def apply_chat_template(self, messages, **kwargs):
        """Gebruikt een tokenizer-native chat template als die bestaat."""
        if not hasattr(self.tokenizer, "apply_chat_template"):
            raise TokenizerAdapterError("Tokenizer does not support chat templates")
        return self.tokenizer.apply_chat_template(messages, **kwargs)

    def has_chat_template(self) -> bool:
        """Controleert of de tokenizer een chat template heeft."""
        return hasattr(self.tokenizer, "apply_chat_template") and bool(
            getattr(self.tokenizer, "chat_template", True)
        )

    def _read_token_id(self, name: str, explicit: int | None):
        """Leest een speciale token-id met een veilige fallback."""
        if explicit is not None:
            return explicit
        value = getattr(self.tokenizer, name, None)
        if value is not None:
            return value
        if name == "pad_token_id":
            eos_id = getattr(self.tokenizer, "eos_token_id", None)
            if eos_id is not None:
                return eos_id
            unk_id = getattr(self.tokenizer, "unk_token_id", None)
            if unk_id is not None:
                return unk_id
            return 0
        return None
