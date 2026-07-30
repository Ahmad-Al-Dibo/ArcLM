from __future__ import annotations

import hashlib
import json
import re
from collections import Counter
from dataclasses import dataclass
from pathlib import Path
from typing import Iterator

import torch
from torch.utils.data import Dataset

from .config import ProjectConfig


@dataclass(slots=True)
class CleanedSample:
    text: str
    language: str
    source: str
    quality_score: float
    char_count: int
    word_count: int
    sha256: str


class MultilingualTextDataset(Dataset):
    """Simple dataset that returns tokenized windows for pre-training."""

    def __init__(self, texts: list[str], tokenizer: object, block_size: int, max_length: int | None = None) -> None:
        self.texts = texts
        self.tokenizer = tokenizer
        self.block_size = block_size
        self.max_length = max_length or block_size
        self._token_ids: list[list[int]] = []
        for text in texts:
            ids = tokenizer.encode_text(text)
            if not ids:
                continue
            if len(ids) < self.max_length:
                self._token_ids.append(ids[: self.max_length] + [0] * max(0, self.max_length - len(ids)))
                continue
            self._token_ids.append(ids)

    def __len__(self) -> int:
        return len(self._token_ids)

    def __getitem__(self, index: int) -> tuple[torch.Tensor, torch.Tensor]:
        ids = self._token_ids[index]
        if len(ids) < self.max_length + 1:
            ids = ids + [0] * (self.max_length + 1 - len(ids))
        x = torch.tensor(ids[: self.max_length], dtype=torch.long)
        y = torch.tensor(ids[1 : self.max_length + 1], dtype=torch.long)
        return x, y


class DataPipeline:
    """Cleans, validates, balances, and profiles multilingual text samples."""

    def __init__(self, config: ProjectConfig) -> None:
        self.config = config
        self.language_patterns = {
            "ar": re.compile(r"[\u0600-\u06FF]"),
            "nl": re.compile(r"[\u00C0-\u00F6\u00F8-\u024F]"),
        }

    def load_texts(self, input_paths: list[Path]) -> list[dict[str, object]]:
        records: list[dict[str, object]] = []
        for path in input_paths:
            if not path.exists():
                continue
            text = path.read_text(encoding="utf-8")
            for paragraph in self._split_paragraphs(text):
                records.append({"text": paragraph, "source": str(path)})
        return records

    def clean_records(self, records: list[dict[str, object]]) -> list[CleanedSample]:
        cleaned: list[CleanedSample] = []
        for record in records:
            text = str(record["text"])
            text = self._normalize_text(text)
            text = self._remove_noise(text)
            if self._is_valid_sample(text):
                language = self.detect_language(text)
                sha256 = hashlib.sha256(text.encode("utf-8")).hexdigest()
                quality_score = self._quality_score(text)
                cleaned.append(
                    CleanedSample(
                        text=text,
                        language=language,
                        source=str(record.get("source", "unknown")),
                        quality_score=quality_score,
                        char_count=len(text),
                        word_count=len(text.split()),
                        sha256=sha256,
                    )
                )
        return self._deduplicate(cleaned)

    def detect_language(self, text: str) -> str:
        arabic_count = len(self.language_patterns["ar"].findall(text))
        dutch_count = len(self.language_patterns["nl"].findall(text))
        if arabic_count and arabic_count >= dutch_count:
            return "ar"
        if dutch_count:
            return "nl"
        return "other"

    def build_balanced_texts(self, samples: list[CleanedSample]) -> list[str]:
        samples_by_lang = {lang: [sample for sample in samples if sample.language == lang] for lang in ["ar", "nl", "other"]}
        target_counts = {
            "ar": int(len(samples) * self.config.arabic_ratio_target),
            "nl": int(len(samples) * self.config.dutch_ratio_target),
            "other": int(len(samples) * self.config.other_ratio_target),
        }
        selected: list[str] = []
        for lang in ["ar", "nl", "other"]:
            chosen = sorted(samples_by_lang.get(lang, []), key=lambda sample: sample.quality_score, reverse=True)[: max(target_counts[lang], 0)]
            selected.extend(sample.text for sample in chosen)
        return selected

    def build_dataset(self, input_paths: list[Path]) -> tuple[list[str], dict[str, object]]:
        records = self.load_texts(input_paths)
        cleaned = self.clean_records(records)
        balanced = self.build_balanced_texts(cleaned)
        report = self.build_report(cleaned, balanced)
        return balanced, report

    def build_report(self, cleaned: list[CleanedSample], balanced: list[str]) -> dict[str, object]:
        counts = Counter(sample.language for sample in cleaned)
        return {
            "samples_after_cleaning": len(cleaned),
            "balanced_samples": len(balanced),
            "language_counts": dict(counts),
            "avg_quality_score": round(sum(sample.quality_score for sample in cleaned) / len(cleaned), 4) if cleaned else 0.0,
        }

    def _split_paragraphs(self, text: str) -> list[str]:
        chunks = [chunk.strip() for chunk in re.split(r"\n{2,}", text) if chunk.strip()]
        return chunks if chunks else [text]

    def _normalize_text(self, text: str) -> str:
        text = re.sub(r"\s+", " ", text.strip())
        text = text.replace("\u00a0", " ")
        return text

    def _remove_noise(self, text: str) -> str:
        text = re.sub(r"<[^>]+>", " ", text)
        text = re.sub(r"http\S+|www\.\S+", " ", text)
        text = re.sub(r"[\u200b\u200c\u200d]", "", text)
        text = re.sub(r"\s+", " ", text).strip()
        return text

    def _is_valid_sample(self, text: str) -> bool:
        words = text.split()
        if len(words) < self.config.min_words or len(words) > self.config.max_words:
            return False
        if len(text) < self.config.min_text_length:
            return False
        if re.fullmatch(r"[\W_]+", text):
            return False
        return True

    def _quality_score(self, text: str) -> float:
        score = 0.0
        if len(text) > 150:
            score += 0.4
        if len(text.split()) > 30:
            score += 0.3
        if re.search(r"[A-Za-z]", text):
            score += 0.2
        if re.search(r"[\u0600-\u06FF]", text):
            score += 0.1
        return min(score, 1.0)

    def _deduplicate(self, samples: list[CleanedSample]) -> list[CleanedSample]:
        seen: set[str] = set()
        uniq: list[CleanedSample] = []
        for sample in samples:
            if sample.sha256 in seen:
                continue
            seen.add(sample.sha256)
            uniq.append(sample)
        return uniq
