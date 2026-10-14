"""Dataset loading helpers for native ArcLM workflows.

This module owns file/list loading, simple validation, train/validation token
splits, tokenizer reconstruction from checkpoints, and DataLoader preparation.
It does not own dataset cleaning rules; those live in ``arclm.datasets.cleaning``
and ``arclm.datasets.pipeline``.
"""

from __future__ import annotations

import csv
import random
import re
import json
import os
from dataclasses import dataclass, field
from pathlib import Path
from collections import Counter
from .base import create_dataloader
from .streaming import StreamingDataset
from ..tokenizers import SentencePieceTokenizer, Tokenizer
from ..configs import Config
from ..exceptions import DatasetLoadError, DatasetValidationError, StreamingError
from typing import Any, Iterable, Optional

@dataclass
class DataBundle:
    """Bundel met tokens, tokenizer en loaders voor training."""

    tokens: list
    train_tokens: list
    val_tokens: list
    # Betekent: Tokenizer, SentencePieceTokenizer, OF None
    tokenizer: Tokenizer | SentencePieceTokenizer | None
    train_loader: object
    val_loader: object
    train_encoded: list
    val_encoded: list

    @property
    def vocab_size(self):
        # Voorkom een crash als tokenizer None is
        """Geeft de vocabulairegrootte terug."""
        return self.tokenizer.get_vocab_size() if self.tokenizer else 0

    def count(self):
        """Telt hoe vaak tokens voorkomen in de training data."""
        if self.train_encoded is None:
            raise RuntimeError(
                "train_encoded has not been initialized. Load and encode data first."
            )

        return Counter(self.tokenizer.decode(self.train_encoded))

    def save_tokenizer(self, path):
        """Slaat de tokenizer metadata op als JSON."""
        tdata = self.tokenizer.to_json()
        with open(path, "w") as f:
            f.write(json.dumps(tdata))
        return tdata



########## Oud: deze versie voegde geen \n toe aan de tokenlijst ##########
# def read_tokens(path, limit):
#     """Leest lowercase whitespace tokens uit een tekstbestand."""
#     collected = []
#     with open(path, "r", encoding="utf-8") as f:
#         for line in f:
#             collected.extend(line.lower().split())
#             if len(collected) >= limit:
#                 return collected[:limit]
#     return collected

def read_tokens(path, limit):
    """Leest lowercase whitespace tokens uit een tekstbestand en bewaart newlines."""
    collected = []
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            # 1. Controleer of de regel daadwerkelijk eindigt op een newline
            has_newline = line.endswith('\n')
            
            # 2. Splits de woorden van de regel (dit haalt de \n weg)
            words = line.lower().split()
            collected.extend(words)
            
            # 3. Voeg handmatig de '\n' toe als de regel die oorspronkelijk had
            if has_newline:
                collected.append('\n')
                
            # 4. Check direct of we de limiet al hebben bereikt
            if len(collected) >= limit:
                return collected[:limit]
                
    return collected


def load_tokens(config):
    """Laadt tokens uit de ingestelde dataset en optioneel uit domeindata."""
    data_path = Path(config.data_path)
    if not data_path.exists():
        fallback_path = Path("data/data.txt")
        print(f"[WARNING] Data file not found: {data_path}")
        print(f"[WARNING] Falling back to {fallback_path}")
        data_path = fallback_path

    tokens = []
    domain_path = Path(config.domain_data_path) if config.domain_data_path else None
    if domain_path and domain_path.exists():
        domain_tokens = read_tokens(domain_path, config.max_data_size)
        for _ in range(config.domain_data_repeats):
            tokens.extend(domain_tokens)
            if len(tokens) >= config.max_data_size:
                return tokens[: config.max_data_size]

    remaining = config.max_data_size - len(tokens)
    if remaining > 0:
        tokens.extend(read_tokens(data_path, remaining))

    return tokens[: config.max_data_size]


def split_train_val(tokens, validation_split, block_size, seed=42):
    """Splitst tokens in train en validatie data."""
    if validation_split <= 0:
        return tokens, []

    text = " ".join(tokens)
    sentences = [
        sentence.strip()
        for sentence in re.findall(r"[^.!?\n]+[.!?]?", text)
        if sentence.strip()
    ]
    if len(sentences) >= 4:
        rng = random.Random(seed)
        rng.shuffle(sentences)
        val_sentence_count = max(1, int(len(sentences) * validation_split))
        val_sentences = sentences[:val_sentence_count]
        train_sentences = sentences[val_sentence_count:]
        train_tokens = " ".join(train_sentences).split()
        val_tokens = " ".join(val_sentences).split()
        if len(train_tokens) > block_size and len(val_tokens) > block_size:
            return train_tokens, val_tokens

    min_val_tokens = block_size + 1
    val_count = max(min_val_tokens, int(len(tokens) * validation_split))

    if len(tokens) <= min_val_tokens * 2:
        return tokens, []

    val_count = min(val_count, len(tokens) - min_val_tokens)
    return tokens[:-val_count], tokens[-val_count:]


def load_tokenizer_from_checkpoint(checkpoint):
    """Haalt een tokenizer uit checkpoint metadata als dat mogelijk is."""
    tok_data = checkpoint.get("tokenizer") or checkpoint.get("tokenizer_metadata")

    if tok_data is None:
        return None

    if tok_data["tokenizer_type"] == "word":
        if tok_data.get("vocab") is not None:
            return Tokenizer.from_json(tok_data)
        vocab = checkpoint.get("vocab")
        if vocab is None:
            return None
        tokenizer = Tokenizer(max_vocab=tok_data.get("max_vocab", len(vocab)))
        tokenizer.vocab = vocab
        tokenizer.vocab_size = len(vocab)
        tokenizer.stoi = {token: idx for idx, token in enumerate(vocab)}
        tokenizer.itos = {idx: token for idx, token in enumerate(vocab)}
        return tokenizer

    if tok_data["tokenizer_type"] == "sentencepiece":
        if "model_proto" in tok_data and isinstance(tok_data["model_proto"], bytes):
            return SentencePieceTokenizer.from_checkpoint(tok_data)
        return SentencePieceTokenizer.from_json(tok_data)

    raise ValueError(
        f"Unknown tokenizer type: {tok_data['tokenizer_type']}"
    )


def prepare_data(config: Config, existing_tokenizer=None) -> DataBundle:
    """Maakt tokens, splits, tokenizer en DataLoaders klaar voor training.

    Args:
        config: ArcLM config met data- en traininginstellingen.
        existing_tokenizer: Optionele tokenizer die opnieuw gebruikt wordt.

    Returns:
        Een `DataBundle` met tokens, tokenizer en loaders.
    """
    tokens = load_tokens(config)
    train_tokens, val_tokens = split_train_val(
        tokens,
        config.validation_split,
        config.block_size,
        config.seed,
    )


    if existing_tokenizer is not None:
        tokenizer = existing_tokenizer

    else:
        tokenizer_type = getattr(
            config,
            "tokenizer_type",
            "word"
        )

        if tokenizer_type == "sentencepiece":
            tokenizer = SentencePieceTokenizer(
                max_vocab=config.max_vocab,
                model_type=getattr(
                    config,
                    "sentencepiece_model_type",
                    "bpe"
                ),
                character_coverage=getattr(
                    config,
                    "sentencepiece_character_coverage",
                    1.0
                ),
                user_defined_symbols=getattr(
                    config,
                    "user_defined_symbols",
                    None
                ),
            )

        elif tokenizer_type == "word":
            tokenizer = Tokenizer(
                max_vocab=config.max_vocab,
                user_defined_symbols=getattr(
                    config,
                    "user_defined_symbols",
                    None
                ),
            )

        else:
            raise ValueError(
                f"Unsupported tokenizer_type: {tokenizer_type}"
            )

        tokenizer.build(" ".join(train_tokens))

    train_encoded = tokenizer.encode(train_tokens)
    train_loader = create_dataloader(
        train_encoded,
        config.block_size,
        config.batch_size,
        shuffle=True,
    )

    val_encoded = []
    val_loader = None
    if val_tokens:
        val_encoded = tokenizer.encode(val_tokens)
        val_loader = create_dataloader(
            val_encoded,
            config.block_size,
            config.batch_size,
            shuffle=False,
        )

    return DataBundle(
        tokens=tokens,
        train_tokens=train_tokens,
        val_tokens=val_tokens,
        tokenizer=tokenizer,
        train_loader=train_loader,
        val_loader=val_loader,
        train_encoded=train_encoded,
        val_encoded=val_encoded,
    )


@dataclass
class DatasetConfig:
    """Configuratie voor `load_dataset` wanneer je opties wilt hergebruiken."""

    source: Any
    format: str | None = None
    text_field: str = "text"
    required_fields: list[str] = field(default_factory=list)
    encoding: str = "utf-8"
    streaming: bool = False


class DatasetLoader:
    """Laadt datasets uit simpele lokale bronnen."""

    def __init__(
        self,
        config: Any = None,
        *,
        text_field: str = "text",
        required_fields: Iterable[str] | None = None,
        encoding: str = "utf-8",
        format: str | None = None,
        streaming: bool = False,
    ):
        """Maakt een loader met standaardinstellingen voor dataset loading."""
        self.config = None

        if isinstance(config, DatasetConfig):
            text_field = config.text_field
            required_fields = config.required_fields
            encoding = config.encoding
            format = config.format
            streaming = config.streaming
            self._default_source = config.source
        else:
            self.config = config
            self._default_source = None

        self.text_field = text_field
        self.required_fields = list(required_fields or [])
        self.encoding = encoding
        self.format = format
        self.streaming = streaming

    def load(self, source: Any = None, **kwargs):
        """Laadt een dataset uit een bestand, lijst of iterable."""
        if isinstance(source, DatasetConfig):
            return DatasetLoader(source).load()

        source = source if source is not None else self._default_source
        if source is None and self.config is not None:
            source = getattr(self.config, "data_path", None)
        if source is None:
            raise DatasetLoadError("No dataset source was provided.")

        text_field = kwargs.get("text_field", self.text_field)
        required_fields = list(kwargs.get("required_fields", self.required_fields))
        encoding = kwargs.get("encoding", self.encoding)
        format = kwargs.get("format", self.format)
        streaming = kwargs.get("streaming", self.streaming)

        if streaming:
            return self._load_streaming(source, format, text_field, required_fields, encoding)

        rows = self._load_in_memory(source, format, text_field, encoding)
        self._validate_required_fields(rows, required_fields)
        return rows

    def load_tokens(self):
        """Laadt tokens via de oude training-config route."""
        if self.config is None:
            raise DatasetLoadError("DatasetLoader.load_tokens() needs an ArcLM Config.")
        return load_tokens(self.config)

    def prepare(self, existing_tokenizer=None) -> DataBundle:
        """Maakt training data via de oude `prepare_data` route."""
        if self.config is None:
            raise DatasetLoadError("DatasetLoader.prepare() needs an ArcLM Config.")
        return prepare_data(self.config, existing_tokenizer=existing_tokenizer)

    def _load_in_memory(
        self,
        source: Any,
        format: str | None,
        text_field: str,
        encoding: str,
    ) -> list[dict[str, Any]]:
        """Laadt een dataset volledig in het geheugen."""
        if isinstance(source, list):
            return self._normalize_rows(source, text_field)

        if not isinstance(source, (str, Path)):
            if hasattr(source, "__iter__"):
                return self._normalize_rows(list(source), text_field)
            raise DatasetLoadError(f"Unsupported dataset source: {type(source).__name__}")

        path = Path(source)
        self._check_path(path)
        detected = self._detect_format(path, format)

        try:
            if detected == "json":
                return self._load_json(path, text_field, encoding)
            if detected == "jsonl":
                return self._load_jsonl(path, text_field, encoding)
            if detected == "csv":
                return self._load_csv(path, encoding)
            if detected in {"txt", "text"}:
                return self._load_txt(path, text_field, encoding)
        except UnicodeDecodeError as error:
            raise DatasetLoadError(f"Could not decode dataset file: {path}") from error
        except OSError as error:
            raise DatasetLoadError(f"Could not load dataset from {path}") from error

        raise DatasetLoadError(f"Unsupported dataset format: {detected}")

    def _load_streaming(
        self,
        source: Any,
        format: str | None,
        text_field: str,
        required_fields: list[str],
        encoding: str,
    ) -> StreamingDataset:
        """Maakt een streaming dataset voor bestandstypen die dat ondersteunen."""
        if not isinstance(source, (str, Path)):
            raise StreamingError("Streaming datasets currently need a file path.")

        path = Path(source)
        self._check_path(path)
        detected = self._detect_format(path, format)

        if detected == "jsonl":
            dataset = StreamingDataset.from_jsonl(path, encoding=encoding)
        elif detected == "csv":
            dataset = StreamingDataset.from_csv(path, encoding=encoding)
        elif detected in {"txt", "text"}:
            dataset = StreamingDataset.from_txt(path, text_field=text_field, encoding=encoding)
        else:
            raise StreamingError(f"Streaming is not supported for format: {detected}")

        if not required_fields:
            return dataset

        def checked_rows():
            """Controleert verplichte velden terwijl de stream wordt gelezen."""
            for row in dataset:
                self._validate_required_fields([row], required_fields)
                yield row

        return StreamingDataset(checked_rows)

    def _detect_format(self, path: Path, format: str | None) -> str:
        """Bepaalt het formaat uit een expliciete waarde of bestandsextensie."""
        return (format or path.suffix.lstrip(".")).lower()

    def _check_path(self, path: Path) -> None:
        """Controleert of het datasetpad bestaat en een bestand is."""
        if not path.exists():
            raise DatasetLoadError(f"Dataset file does not exist: {path}")
        if not path.is_file():
            raise DatasetLoadError(f"Dataset source is not a file: {path}")

    def _load_json(
        self,
        path: Path,
        text_field: str,
        encoding: str,
    ) -> list[dict[str, Any]]:
        """Laadt voorbeelden uit een JSON-bestand."""
        with path.open("r", encoding=encoding) as file:
            value = json.load(file)

        if isinstance(value, dict):
            records = value.get("data") or value.get("samples") or value.get("records")
            if isinstance(records, list):
                return self._normalize_rows(records, text_field)
            return [value]

        if isinstance(value, list):
            return self._normalize_rows(value, text_field)

        return [{text_field: value}]

    def _load_jsonl(
        self,
        path: Path,
        text_field: str,
        encoding: str,
    ) -> list[dict[str, Any]]:
        """Laadt voorbeelden uit een JSONL-bestand."""
        rows = []
        with path.open("r", encoding=encoding) as file:
            for line_number, line in enumerate(file, 1):
                if not line.strip():
                    continue
                try:
                    value = json.loads(line)
                except json.JSONDecodeError as error:
                    raise DatasetLoadError(
                        f"Invalid JSON on line {line_number} in {path}"
                    ) from error
                rows.append(value)
        return self._normalize_rows(rows, text_field)

    def _load_csv(self, path: Path, encoding: str) -> list[dict[str, Any]]:
        """Laadt voorbeelden uit een CSV-bestand."""
        with path.open("r", encoding=encoding, newline="") as file:
            return [dict(row) for row in csv.DictReader(file)]

    def _load_txt(
        self,
        path: Path,
        text_field: str,
        encoding: str,
    ) -> list[dict[str, Any]]:
        """Laadt niet-lege regels uit een tekstbestand."""
        with path.open("r", encoding=encoding) as file:
            return [{text_field: line.strip()} for line in file if line.strip()]

    def _normalize_rows(
        self,
        rows: Iterable[Any],
        text_field: str,
    ) -> list[dict[str, Any]]:
        """Zet losse waarden om naar dicts met een tekstveld."""
        normalized = []
        for row in rows:
            if isinstance(row, dict):
                normalized.append(dict(row))
            else:
                normalized.append({text_field: row})
        return normalized

    def _validate_required_fields(
        self,
        rows: Iterable[dict[str, Any]],
        required_fields: list[str],
    ) -> None:
        """Controleert of elk voorbeeld de verplichte velden heeft."""
        if not required_fields:
            return

        for index, row in enumerate(rows):
            missing = [field for field in required_fields if field not in row]
            if missing:
                fields = ", ".join(missing)
                raise DatasetValidationError(
                    f"Dataset example {index} is missing required fields: {fields}"
                )


def load_dataset(source: Any, **kwargs):
    """Laadt een dataset met de standaard DatasetLoader."""
    if isinstance(source, DatasetConfig):
        return DatasetLoader(source).load()
    return DatasetLoader(**kwargs).load(source)
