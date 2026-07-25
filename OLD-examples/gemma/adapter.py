"""Gemma adapter fallback for ArcLM examples.

This file intentionally lives in ``examples/`` so the ArcLM library itself does
not need to know about a Gemma-specific adapter. If ArcLM's generic adapters are
available, the builders use them. If not, they create local adapters from the
public base classes.
"""

from __future__ import annotations

import inspect
from typing import Any

import torch
import torch.nn.functional as F

from arclm.finetuning import BaseModelAdapter, BaseTokenizerAdapter

try:
    from arclm.finetuning import ModelAdapter as ArcLMModelAdapter
except ImportError:  # pragma: no cover - compatibility fallback
    ArcLMModelAdapter = None

try:
    from arclm.finetuning import TokenizerAdapter as ArcLMTokenizerAdapter
except ImportError:  # pragma: no cover - compatibility fallback
    ArcLMTokenizerAdapter = None


class GemmaCausalLMAdapter(torch.nn.Module, BaseModelAdapter):
    """Small causal-LM adapter built from ArcLM base classes."""

    def __init__(self, model: torch.nn.Module, ignore_index: int = -100):
        super().__init__()
        self.model = model
        self.ignore_index = ignore_index

    def forward(self, **batch):
        labels = batch.get("labels")
        outputs = self._call_model(batch)
        logits = self._read_output(outputs, "logits")
        loss = self._read_output(outputs, "loss")
        if loss is None and logits is not None and labels is not None:
            loss = self._compute_causal_lm_loss(logits, labels)
        result: dict[str, Any] = {}
        if loss is not None:
            result["loss"] = loss
        if logits is not None:
            result["logits"] = logits
        if not result:
            raise RuntimeError("Gemma adapter expected model outputs with loss or logits.")
        return result

    def _call_model(self, batch: dict[str, Any]):
        try:
            signature = inspect.signature(self.model.forward)
        except (TypeError, ValueError, AttributeError):
            return self.model(**batch)

        accepts_kwargs = any(
            parameter.kind == inspect.Parameter.VAR_KEYWORD
            for parameter in signature.parameters.values()
        )
        if accepts_kwargs:
            return self.model(**batch)

        accepted = {
            key: value
            for key, value in batch.items()
            if key in signature.parameters
        }
        return self.model(**accepted)

    @staticmethod
    def _read_output(outputs, name: str):
        if isinstance(outputs, dict):
            return outputs.get(name)
        if hasattr(outputs, name):
            return getattr(outputs, name)
        if isinstance(outputs, (tuple, list)):
            if name == "loss" and len(outputs) > 1:
                return outputs[0]
            if name == "logits":
                return outputs[1] if len(outputs) > 1 else outputs[0]
        if name == "logits" and torch.is_tensor(outputs):
            return outputs
        return None

    def _compute_causal_lm_loss(self, logits: torch.Tensor, labels: torch.Tensor):
        shift_logits = logits[..., :-1, :].contiguous()
        shift_labels = labels[..., 1:].contiguous()
        vocab_size = shift_logits.shape[-1]
        return F.cross_entropy(
            shift_logits.view(-1, vocab_size),
            shift_labels.view(-1),
            ignore_index=self.ignore_index,
        )


class GemmaTokenizerAdapter(BaseTokenizerAdapter):
    """Tokenizer adapter fallback built from ArcLM base classes."""

    def __init__(self, tokenizer: Any):
        self.tokenizer = tokenizer
        self.pad_token_id = getattr(tokenizer, "pad_token_id", None)
        self.eos_token_id = getattr(tokenizer, "eos_token_id", None)

    def encode(self, text: str, max_length: int | None = None, truncation: bool = True):
        if hasattr(self.tokenizer, "encode"):
            return list(
                self.tokenizer.encode(
                    text,
                    add_special_tokens=False,
                    max_length=max_length,
                    truncation=truncation,
                )
            )
        encoded = self.tokenizer(
            text,
            add_special_tokens=False,
            max_length=max_length,
            truncation=truncation,
        )
        return list(encoded["input_ids"])

    def decode(self, ids):
        if not hasattr(self.tokenizer, "decode"):
            raise RuntimeError("Tokenizer does not support decode().")
        return self.tokenizer.decode(ids, skip_special_tokens=True)

    def apply_chat_template(self, messages, **kwargs):
        if hasattr(self.tokenizer, "apply_chat_template") and getattr(self.tokenizer, "chat_template", None):
            return self.tokenizer.apply_chat_template(messages, **kwargs)
        return render_manual_chat(messages, add_generation_prompt=kwargs.get("add_generation_prompt", False))


def build_model_adapter(model: torch.nn.Module):
    """Use ArcLM's generic adapter when present, else create the local fallback."""

    if ArcLMModelAdapter is not None:
        return ArcLMModelAdapter(model)
    return GemmaCausalLMAdapter(model)


def build_tokenizer_adapter(tokenizer: Any):
    """Use ArcLM's generic tokenizer adapter when present, else create the local fallback."""

    if ArcLMTokenizerAdapter is not None:
        return ArcLMTokenizerAdapter(tokenizer)
    return GemmaTokenizerAdapter(tokenizer)


def render_manual_chat(messages, add_generation_prompt: bool = False) -> str:
    parts = []
    for message in messages:
        role = message.get("role", "user")
        content = message.get("content", "")
        parts.append(f"{role}: {content}")
    if add_generation_prompt:
        parts.append("assistant:")
    return "\n".join(parts)
