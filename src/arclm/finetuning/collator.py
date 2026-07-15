"""SFT data collator."""

from __future__ import annotations

from typing import Any

import torch

from ..exceptions import DataCollatorError
from .adapters import TokenizerAdapter
from .config import SFTConfig
from .formatting import format_example
from .labels import assistant_mask_from_spans, create_labels, mask_labels
from .packing import pack_sequences


class SFTDataCollator:
    """Zet SFT voorbeelden om naar tensors voor de trainer."""

    def __init__(self, tokenizer=None, config: SFTConfig | None = None, tokenizer_adapter=None):
        """Maakt een collator met tokenizer en config."""
        self.config = config or SFTConfig()
        self.tokenizer_adapter = tokenizer_adapter or TokenizerAdapter(tokenizer)

    def __call__(self, examples: list[dict[str, Any]]):
        """Maakt een batch met `input_ids`, `attention_mask` en `labels`."""
        features = [self.prepare_feature(example) for example in examples]
        if self.config.packing:
            features = pack_sequences(
                features,
                max_length=self.config.max_length,
                eos_token_id=self.tokenizer_adapter.eos_token_id,
            )
        return self.pad_features(features)

    def prepare_feature(self, example: dict[str, Any]) -> dict[str, list[int]]:
        """Tokenizet één voorbeeld en maakt labels."""
        if "input_ids" in example:
            return self.prepare_tokenized_feature(example)

        formatted = format_example(
            example,
            self.config,
            tokenizer_adapter=self.tokenizer_adapter,
        )
        text = formatted["text"]
        input_ids = self.tokenizer_adapter.encode(
            text,
            max_length=self.config.max_length,
            truncation=self.config.truncation,
        )
        if self.config.add_eos_token and self.tokenizer_adapter.eos_token_id is not None:
            if len(input_ids) < self.config.max_length:
                input_ids.append(self.tokenizer_adapter.eos_token_id)
        attention_mask = [1] * len(input_ids)

        if self.config.assistant_only_loss:
            active_mask = assistant_mask_from_spans(
                text,
                input_ids,
                formatted.get("assistant_spans", []),
                self.tokenizer_adapter,
                max_length=self.config.max_length,
                truncation=self.config.truncation,
            )
            if not any(active_mask):
                raise DataCollatorError(
                    "Could not identify assistant tokens for assistant_only_loss"
                )
            labels = mask_labels(input_ids, active_mask, self.config.ignore_index)
        else:
            labels = create_labels(input_ids, attention_mask, self.config.ignore_index)

        return {
            "input_ids": input_ids,
            "attention_mask": attention_mask,
            "labels": labels,
        }

    def prepare_tokenized_feature(self, example: dict[str, Any]) -> dict[str, list[int]]:
        """Maakt een feature van al getokenizede data."""
        input_ids = list(example["input_ids"])
        if self.config.truncation:
            input_ids = input_ids[: self.config.max_length]
        attention_mask = list(example.get("attention_mask", [1] * len(input_ids)))
        attention_mask = attention_mask[: len(input_ids)]
        labels = list(example.get("labels", create_labels(input_ids, attention_mask)))
        labels = labels[: len(input_ids)]
        return {
            "input_ids": input_ids,
            "attention_mask": attention_mask,
            "labels": labels,
        }

    def pad_features(self, features: list[dict[str, list[int]]]):
        """Vult features aan tot dezelfde lengte en geeft tensors terug."""
        if not features:
            raise DataCollatorError("SFTDataCollator received an empty batch")
        target_length = self.target_length(features)
        pad_id = self.tokenizer_adapter.pad_token_id
        batch = {"input_ids": [], "attention_mask": [], "labels": []}

        for feature in features:
            length = len(feature["input_ids"])
            if self.config.padding == "none" and length != target_length:
                raise DataCollatorError("padding='none' requires equal length features")
            pad_len = target_length - length
            batch["input_ids"].append(feature["input_ids"] + [pad_id] * pad_len)
            batch["attention_mask"].append(feature["attention_mask"] + [0] * pad_len)
            batch["labels"].append(feature["labels"] + [self.config.ignore_index] * pad_len)

        return {
            key: torch.tensor(value, dtype=torch.long)
            for key, value in batch.items()
        }

    def target_length(self, features: list[dict[str, list[int]]]) -> int:
        """Bepaalt de lengte waarnaar we padding toepassen."""
        if self.config.padding == "max_length":
            return self.config.max_length
        return max(len(feature["input_ids"]) for feature in features)
