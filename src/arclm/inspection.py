"""Transparent native ArcLM pipeline inspection.

``inspect_text`` traces one lightweight native generation step:

input text -> tokenizer -> token ids -> input tensor -> embeddings ->
ArcLM forward pass -> logits -> token selection -> decoding.

It is intentionally small and metadata-first. By default the trace records
shapes, names, and selected tokens, not full tensors.
"""

from __future__ import annotations

import json
from dataclasses import asdict, dataclass, field
from typing import Any

import torch

from .inference.generation import Generator

__all__ = ["PipelineTrace", "inspect_text"]


@dataclass
class PipelineTrace:
    """JSON-safe summary of one inspected native ArcLM generation step."""

    input_text: str
    tokens: list[str]
    token_ids: list[int]
    sequence_length: int
    input_shape: list[int]
    embedding_shape: list[int]
    logits_shape: list[int]
    selected_token_id: int
    selected_token: str
    generated_text: str
    device: str
    dtype: str
    model_class: str
    tokenizer_class: str
    inspected_steps: int = 1
    generation_steps: int = 1
    attention_available: bool = False
    attention_note: str = "Attention tensor capture is planned for a later inspection version."
    warnings: list[str] = field(default_factory=list)
    values: dict[str, list[float | int]] | None = None

    def to_dict(self) -> dict[str, Any]:
        """Return a JSON-safe dictionary representation."""

        return asdict(self)

    def to_json(self, **kwargs: Any) -> str:
        """Return the trace as JSON using only the standard library."""

        return json.dumps(self.to_dict(), **kwargs)

    def summary(self) -> str:
        """Return a compact human-readable trace."""

        lines = [
            "ArcLM Pipeline Trace",
            f"Input text: {self.input_text}",
            f"Tokens: {self.sequence_length}",
            f"Token IDs: {self.token_ids}",
            f"Input shape: {self.input_shape}",
            f"Embedding shape: {self.embedding_shape}",
            f"Logits shape: {self.logits_shape}",
            f"Selected token: {self.selected_token} ({self.selected_token_id})",
            f"Generated text: {self.generated_text}",
            f"Device: {self.device}",
        ]
        if self.warnings:
            lines.append("Warnings: " + " | ".join(self.warnings))
        return "\n".join(lines)


def inspect_text(
    *,
    model: Any,
    tokenizer: Any,
    text: str,
    max_new_tokens: int = 1,
    temperature: float = 1.0,
    repetition_penalty: float = 1.0,
    top_k: int | None = None,
    top_p: float | None = None,
    include_values: bool = False,
    max_values: int = 20,
) -> PipelineTrace:
    """Inspect one native ArcLM text-generation step.

    Args:
        model: Native ArcLM-style model that returns logits from token IDs.
        tokenizer: Native ArcLM tokenizer with ``encode_text`` and
            ``decode_string``.
        text: Input prompt to inspect.
        max_new_tokens: Currently only ``1`` is inspected; larger values are
            accepted for future compatibility but reported as one inspected step.
        include_values: Include small tensor value samples in ``trace.values``.
        max_values: Maximum values to keep per sampled tensor.

    Returns:
        A ``PipelineTrace`` with JSON-safe metadata and optional value samples.
    """

    input_text = str(text)
    if not input_text.strip():
        raise ValueError("inspect_text requires non-empty input text.")
    if not hasattr(tokenizer, "encode_text") or not hasattr(tokenizer, "decode_string"):
        raise TypeError("inspect_text requires a native tokenizer with encode_text() and decode_string().")
    if not callable(getattr(model, "forward", None)):
        raise TypeError("inspect_text requires a native torch model with a forward pass.")
    if not hasattr(model, "get_input_embeddings") and not hasattr(model, "token_embedding"):
        raise TypeError("inspect_text requires a native ArcLM model with input embeddings.")
    if temperature <= 0:
        raise ValueError("temperature must be greater than zero.")
    if max_values <= 0:
        raise ValueError("max_values must be greater than zero.")

    token_ids = [int(item) for item in tokenizer.encode_text(input_text)]
    if not token_ids:
        raise ValueError("inspect_text could not tokenize the input text into token IDs.")

    tokens = _tokens_for_text(tokenizer, input_text, token_ids)
    device = _model_device(model)
    was_training = bool(getattr(model, "training", False))
    values: dict[str, list[float | int]] | None = {} if include_values else None
    warnings: list[str] = []
    if max_new_tokens != 1:
        warnings.append("Only one generation step is inspected in this version.")

    try:
        model.eval()
        with torch.no_grad():
            input_tensor = torch.tensor([token_ids], dtype=torch.long, device=device)
            input_tensor = _trim_to_block_size(input_tensor, model)
            embedding_layer = model.get_input_embeddings() if hasattr(model, "get_input_embeddings") else model.token_embedding
            embeddings = embedding_layer(input_tensor)
            logits = model(input_tensor)
            if not torch.is_tensor(logits):
                raise TypeError("inspect_text expected the model forward pass to return a logits tensor.")
            if logits.ndim != 3:
                raise TypeError("inspect_text expected logits shaped [batch, sequence, vocab].")

            generator = _native_generator(model, tokenizer, input_tensor.shape[-1], device)
            generated_tokens = generator.generate(
                input_text,
                max_new_tokens=1,
                temperature=temperature,
                repetition_penalty=repetition_penalty,
                top_k=top_k,
                top_p=top_p,
            )
            if len(generated_tokens) <= len(token_ids):
                raise RuntimeError("Native generation did not return a selected token.")
            selected_token = str(generated_tokens[-1])
            selected_token_id = int(generator.stoi[selected_token])
            generated_text = tokenizer.decode_string(
                [int(generator.stoi[token]) for token in generated_tokens if token in generator.stoi]
            )

            if include_values:
                values = {
                    "input_ids": _sample_values(input_tensor, max_values),
                    "embedding_values": _sample_values(embeddings, max_values),
                    "logit_values": _sample_values(logits, max_values),
                }

            return PipelineTrace(
                input_text=input_text,
                tokens=tokens,
                token_ids=input_tensor[0].detach().cpu().tolist(),
                sequence_length=int(input_tensor.shape[-1]),
                input_shape=list(input_tensor.shape),
                embedding_shape=list(embeddings.shape),
                logits_shape=list(logits.shape),
                selected_token_id=selected_token_id,
                selected_token=selected_token,
                generated_text=str(generated_text),
                device=str(device),
                dtype=str(logits.dtype).replace("torch.", ""),
                model_class=type(model).__name__,
                tokenizer_class=type(tokenizer).__name__,
                warnings=warnings,
                values=values,
            )
    finally:
        if was_training:
            model.train()


def _tokens_for_text(tokenizer: Any, text: str, token_ids: list[int]) -> list[str]:
    """Return readable tokens without mutating tokenizer state."""

    if hasattr(tokenizer, "processor"):
        try:
            pieces = tokenizer.encode_text(text, out_type=str)
            return [str(piece) for piece in pieces]
        except TypeError:
            pass
    if hasattr(tokenizer, "decode"):
        decoded = tokenizer.decode(token_ids)
        return [str(token) for token in decoded]
    return text.split()


def _model_device(model: Any) -> torch.device:
    """Infer the model device from parameters, defaulting to CPU."""

    try:
        return next(model.parameters()).device
    except StopIteration:
        return torch.device("cpu")


def _trim_to_block_size(input_tensor: torch.Tensor, model: Any) -> torch.Tensor:
    """Match native generation behavior by keeping the latest context window."""

    block_size = getattr(model, "block_size", None)
    if block_size is None:
        return input_tensor
    return input_tensor[:, -int(block_size):]


def _native_generator(model: Any, tokenizer: Any, block_size: int, device: torch.device) -> Generator:
    """Build a Generator only to reuse its canonical sampling helpers."""

    stoi = getattr(tokenizer, "stoi", None)
    itos = getattr(tokenizer, "itos", None)
    if not isinstance(stoi, dict) or not isinstance(itos, dict):
        raise TypeError("inspect_text requires tokenizer.stoi and tokenizer.itos mappings for sampling inspection.")
    return Generator(model, stoi, itos, block_size=block_size, device=device, tokenizer=tokenizer)


def _decode_token(tokenizer: Any, token_id: int) -> str:
    """Decode a single selected token ID."""

    if hasattr(tokenizer, "decode"):
        decoded = tokenizer.decode([token_id])
        if decoded:
            return str(decoded[0])
    return str(token_id)


def _sample_values(tensor: torch.Tensor, max_values: int) -> list[float | int]:
    """Return a small detached CPU sample from a tensor."""

    sample = tensor.detach().flatten()[:max_values].cpu().tolist()
    return [int(value) if isinstance(value, int) else float(value) for value in sample]
