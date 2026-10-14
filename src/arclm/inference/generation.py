"""Native text generation for ArcLM checkpoints.

The ``Generator`` owns prompt tokenization, repeated model forward passes,
temperature/top-k/top-p sampling, repetition penalties, and decoding generated
tokens. It expects a trained causal model plus ``stoi``/``itos`` vocabulary
maps; external Hugging Face generation lives in ``arclm.inference.external``.
"""

from __future__ import annotations

from ..utils.imports import require_torch

require_torch("ArcLM inference")
import torch


class Generator:
    """Generate tokens from a trained native causal language model.

    Inputs are raw prompt text and sampling settings. Outputs are either token
    strings via ``generate`` or decoded text via ``generate_string``. Sampling
    behavior can be adjusted here without touching training or checkpoint
    loading.
    """

    def __init__(self, model, stoi, itos, block_size, device, tokenizer=None):
        """Maakt dit object klaar voor gebruik."""

        self.model = model
        self.stoi = stoi
        self.itos = itos
        self.block_size = block_size
        self.device = device
        self.tokenizer = tokenizer

    def generate(
        self,
        start_text,
        max_new_tokens=20,
        temperature=1.0,
        repetition_penalty=1.0,
        top_k=None,
        top_p=None,
    ):
        """Generate tokens from ``start_text`` with the native ArcLM model."""

        self._validate_generation_args(
            max_new_tokens=max_new_tokens,
            temperature=temperature,
            repetition_penalty=repetition_penalty,
            top_k=top_k,
            top_p=top_p,
        )
        was_training = self.model.training
        self.model.eval()

        try:
            if self.tokenizer is not None and hasattr(self.tokenizer, "encode_text"):
                idx = self.tokenizer.encode_text(start_text.lower())
            else:
                words = start_text.lower().split()
                idx = [self.stoi[w] for w in words if w in self.stoi]

            if not idx:
                return []

            idx = torch.tensor([idx], device=self.device)

            with torch.no_grad():
                for _ in range(max_new_tokens):
                    idx_cond = idx[:, -self.block_size:]
                    logits = self.model(idx_cond)
                    logits = logits[:, -1, :] / temperature

                    if repetition_penalty != 1.0:
                        logits = self._apply_repetition_penalty(
                            logits,
                            idx[0],
                            repetition_penalty,
                        )

                    if top_k is not None:
                        logits = self._apply_top_k(logits, top_k)

                    if top_p is not None:
                        logits = self._apply_top_p(logits, top_p)

                    probs = torch.softmax(logits, dim=-1)
                    next_token = torch.multinomial(probs, 1)
                    idx = torch.cat([idx, next_token], dim=1)

            return [self.itos[i.item()] for i in idx[0]]
        finally:
            if was_training:
                self.model.train()

    def _validate_generation_args(
        self,
        *,
        max_new_tokens,
        temperature,
        repetition_penalty,
        top_k,
        top_p,
    ):
        """Validate native sampling arguments before the first model call."""

        if not isinstance(max_new_tokens, int) or max_new_tokens < 0:
            raise ValueError("max_new_tokens must be a non-negative integer")
        if temperature <= 0:
            raise ValueError("temperature must be greater than zero")
        if repetition_penalty <= 0:
            raise ValueError("repetition_penalty must be greater than zero")
        if top_k is not None and (not isinstance(top_k, int) or top_k <= 0):
            raise ValueError("top_k must be a positive integer when provided")
        if top_k is not None and top_k > len(self.itos):
            raise ValueError("top_k must not exceed the vocabulary size")
        if top_p is not None and not 0 < top_p <= 1:
            raise ValueError("top_p must be in the range (0, 1]")

    def _apply_repetition_penalty(self, logits, tokens, penalty):
        """Apply a repetition penalty to logits for tokens already present."""

        unique_tokens = set(tokens.tolist())
        for token in unique_tokens:
            if logits[0, token] < 0:
                logits[0, token] *= penalty
            else:
                logits[0, token] /= penalty
        return logits

    def _apply_top_k(self, logits, top_k):
        """Keep only the top-k highest-logit tokens."""

        top_k_vals, top_k_indices = torch.topk(logits, top_k)
        mask = torch.full_like(logits, float("-inf"))
        mask[0, top_k_indices[0]] = top_k_vals[0]
        return mask

    def _apply_top_p(self, logits, top_p):
        """Keep the smallest high-probability nucleus of tokens."""

        sorted_logits, sorted_indices = torch.sort(logits, descending=True)
        sorted_probs = torch.softmax(sorted_logits, dim=-1)
        cumsum_probs = torch.cumsum(sorted_probs, dim=-1)

        sorted_indices_to_remove = cumsum_probs > top_p
        sorted_indices_to_remove[0, 0] = False
        sorted_logits[0, sorted_indices_to_remove[0]] = float("-inf")

        logits = torch.zeros_like(logits)
        logits[0, sorted_indices[0]] = sorted_logits[0]
        return logits

    def generate_string(
        self,
        start_text,
        max_new_tokens=20,
        temperature=1.0,
        repetition_penalty=1.0,
        top_k=None,
        top_p=None,
    ):
        """Generate text and return it as a string."""

        tokens = self.generate(
            start_text,
            max_new_tokens,
            temperature,
            repetition_penalty,
            top_k,
            top_p,
        )
        if self.tokenizer is not None and hasattr(self.tokenizer, "decode_string"):
            token_ids = [self.stoi[token] for token in tokens if token in self.stoi]
            return self.tokenizer.decode_string(token_ids)
        return " ".join(tokens)
