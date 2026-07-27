"""Basis classes voor fine-tuning."""

from __future__ import annotations

from abc import ABC, abstractmethod


class BaseFineTuner(ABC):
    """Basis class voor developers die een eigen fine-tuner willen maken."""

    @abstractmethod
    def train(self, *args, **kwargs):
        """Start de fine-tuning."""
        raise NotImplementedError

    def evaluate(self, dataset=None):
        """Evalueert het model op een dataset."""
        raise NotImplementedError


class BaseModelAdapter(ABC):
    """Basis class om een extern model met ArcLM te verbinden."""

    @abstractmethod
    def forward(self, **batch):
        """Voert het model uit en geeft loss en logits terug."""
        raise NotImplementedError


class BaseTokenizerAdapter(ABC):
    """Basis class om een tokenizer met ArcLM te verbinden."""

    @abstractmethod
    def encode(self, text: str, max_length: int | None = None, truncation: bool = True):
        """Zet tekst om naar token ids."""
        raise NotImplementedError
