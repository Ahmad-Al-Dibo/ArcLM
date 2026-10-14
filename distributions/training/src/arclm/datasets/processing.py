"""In-memory dataset processing helpers.

``DatasetLoader`` and ``load_dataset`` own file/list loading. ``DataProcessor``
is a small facade that turns those loaded records into ``ProcessedDataset`` so
callers can clean, transform, tokenize, map batches, and split examples without
learning a larger pipeline framework.
"""

from __future__ import annotations

import random
import re
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Callable, Dict, Iterable, List, Optional

from ..exceptions import DatasetLoadError
from .loader import DatasetLoader


@dataclass
class ProcessedDataset:
    """Kleine in-memory dataset voor formatting, cleaning en splits."""

    samples: List[Dict[str, Any]] = field(default_factory=list)
    source: Optional[str] = None

    def transform(
        self,
        format: str = "pretraining",
        mapping: Optional[Dict[str, str]] = None,
        template: Optional[str] = None,
        text_fields: Optional[Iterable[str]] = None,
        tokenizer: Any = None,
    ) -> "ProcessedDataset":
        """Zet voorbeelden om naar tekst voor pretraining, instructies of chat."""
        mapping = mapping or {}
        transformed = []
        for sample in self.samples:
            values = dict(sample)
            values.update({
                target: sample.get(source, "")
                for target, source in mapping.items()
            })
            text = self._format_text(sample, values, format, template, text_fields)
            item = dict(sample)
            item["text"] = text
            if tokenizer is not None:
                item["tokens"] = tokenizer.encode_text(text)
            transformed.append(item)
        return ProcessedDataset(transformed, source=self.source)

    def tokenize(self, tokenizer: Any, text_key: str = "text") -> "ProcessedDataset":
        """Voegt token ids toe aan elk voorbeeld."""
        tokenized = []
        for sample in self.samples:
            item = dict(sample)
            item["tokens"] = tokenizer.encode_text(str(item.get(text_key, "")))
            tokenized.append(item)
        return ProcessedDataset(tokenized, source=self.source)

    def split(
        self,
        train: float = 0.8,
        validation: float = 0.1,
        test: float = 0.1,
        seed: int = 42,
    ) -> Dict[str, List[Dict[str, Any]]]:
        """Splitst de voorbeelden in train, validation en test lijsten."""
        total = train + validation + test
        if total <= 0:
            raise ValueError("At least one split ratio must be greater than zero.")
        samples = list(self.samples)
        random.Random(seed).shuffle(samples)
        train_count = int(len(samples) * (train / total))
        validation_count = int(len(samples) * (validation / total))
        return {
            "train": samples[:train_count],
            "validation": samples[train_count:train_count + validation_count],
            "test": samples[train_count + validation_count:],
        }

    def filter(self, predicate: Callable[[Dict[str, Any]], bool]) -> "ProcessedDataset":
        """Houdt alleen voorbeelden waarvoor de predicate True teruggeeft."""
        return ProcessedDataset(
            [sample for sample in self.samples if predicate(sample)],
            source=self.source,
        )

    def clean(self, text_keys: Optional[Iterable[str]] = None) -> "ProcessedDataset":
        """Normaliseert whitespace in tekstvelden."""
        cleaned = []
        for sample in self.samples:
            item = dict(sample)
            keys = list(text_keys) if text_keys is not None else [
                key for key, value in item.items() if isinstance(value, str)
            ]
            for key in keys:
                if key in item and isinstance(item[key], str):
                    item[key] = re.sub(r"\s+", " ", item[key]).strip()
            cleaned.append(item)
        return ProcessedDataset(cleaned, source=self.source)

    def map_batches(
        self,
        function: Callable[[List[Dict[str, Any]]], Iterable[Dict[str, Any]]],
        batch_size: int = 32,
    ) -> "ProcessedDataset":
        """Past een functie toe op batches van voorbeelden."""
        if batch_size <= 0:
            raise ValueError("batch_size must be greater than zero.")
        processed = []
        for index in range(0, len(self.samples), batch_size):
            processed.extend(function(self.samples[index:index + batch_size]))
        return ProcessedDataset(list(processed), source=self.source)

    def _format_text(
        self,
        sample: Dict[str, Any],
        values: Dict[str, Any],
        format: str,
        template: Optional[str],
        text_fields: Optional[Iterable[str]],
    ) -> str:
        """Maakt de uiteindelijke tekst voor een voorbeeld."""
        if template:
            return template.format(**values)
        if format == "instruction":
            return "\n".join(
                str(values.get(key, ""))
                for key in ("instruction", "input", "output")
                if values.get(key, "") != ""
            )
        if format == "chat":
            user = values.get("user") or values.get("instruction") or sample.get("user", "")
            assistant = values.get("assistant") or values.get("output") or sample.get("assistant", "")
            return f"User: {user}\nAssistant: {assistant}".strip()
        fields = list(text_fields) if text_fields is not None else ["text"]
        if any(field in sample for field in fields):
            return "\n".join(str(sample.get(field, "")) for field in fields if sample.get(field, "") != "")
        return "\n".join(str(value) for value in sample.values() if value is not None)


class DataProcessor:
    """Compatibility-friendly entry point for ``ProcessedDataset`` workflows."""

    @staticmethod
    def load(
        path: Any,
        format: Optional[str] = None,
        loader: Optional[Callable[[Path], Iterable[Dict[str, Any]]]] = None,
    ) -> ProcessedDataset:
        """Load records through the canonical loader, then wrap them for processing."""
        path = Path(path)
        if loader is not None:
            return ProcessedDataset(list(loader(path)), source=str(path))
        try:
            samples = DatasetLoader(format=format).load(path)
        except DatasetLoadError as error:
            raise ValueError(str(error)) from error
        return ProcessedDataset(samples, source=str(path))
