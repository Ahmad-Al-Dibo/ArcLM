"""Stabiele fine-tuning workflow bovenop de bestaande Training Core."""

from __future__ import annotations

import hashlib
import json
import math
import platform
from dataclasses import asdict, dataclass, field
from typing import Any, Iterable, Mapping, Sequence

import torch
from torch.utils.data import Dataset

from .._version import __version__
from ..exceptions import FineTuningError, FormattingError, TokenizerAdapterError
from ..training import TrainingConfig
from .adapters import ModelAdapter, TokenizerAdapter
from .config import FineTuningConfig, FineTuningMode
from .full import FullFineTuner


@dataclass(frozen=True)
class NormalizedSFTExample:
    """Interne vorm met segmenten waarvan bekend is wat trainbaar is."""

    formatter: str
    source_index: int
    segments: tuple[tuple[str, bool], ...]
    metadata: dict[str, Any] = field(default_factory=dict)

    @property
    def full_text(self) -> str:
        """Geeft de volledige tekst terug zonder extra interpretatie."""
        return "".join(text for text, _trainable in self.segments)


@dataclass
class FineTuningDatasetReport:
    """Veilige samenvatting van datasetvoorbereiding."""

    mode: str
    formatter: str
    records_seen: int
    records_valid: int
    records_rejected: int
    records_truncated: int
    examples_dropped: int
    total_tokens: int
    trainable_tokens: int
    dataset_fingerprint: str
    errors: list[dict[str, Any]] = field(default_factory=list)

    def to_dict(self) -> dict[str, Any]:
        """Zet de samenvatting om naar JSON-vriendelijke data."""
        return asdict(self)


class PreparedFineTuningDataset(Dataset):
    """Dataset met vooraf getokenizede fine-tuning voorbeelden."""

    def __init__(
        self,
        features: Sequence[dict[str, list[int]]],
        report: FineTuningDatasetReport,
    ):
        """Bewaart features en rapport."""
        self.features = [dict(feature) for feature in features]
        self.report = report

    def __len__(self) -> int:
        """Geeft het aantal bruikbare voorbeelden terug."""
        return len(self.features)

    def __getitem__(self, index: int) -> dict[str, list[int]]:
        """Geeft een kopie terug zodat collators niets per ongeluk muteren."""
        return {
            key: list(value)
            for key, value in self.features[index].items()
        }


@dataclass
class FineTuningResult:
    """Resultaat van een stabiele fine-tuning run."""

    training_state: Any
    dataset_report: FineTuningDatasetReport
    model: torch.nn.Module
    tokenizer: Any | None = None
    fine_tuning_config: FineTuningConfig | None = None
    training_config: TrainingConfig | None = None
    evaluation_result: dict[str, Any] | None = None
    trainer: FullFineTuner | None = None
    checkpoint_path: str | None = None
    peft_config: Any | None = None
    peft_result: Any | None = None

    def to_dict(self) -> dict[str, Any]:
        """Geeft alleen veilige metadata terug, geen runtime objecten."""
        training_state = (
            self.training_state.to_dict()
            if hasattr(self.training_state, "to_dict")
            else {}
        )
        return {
            "training_state": training_state,
            "dataset_report": self.dataset_report.to_dict(),
            "fine_tuning_config": (
                self.fine_tuning_config.to_dict()
                if self.fine_tuning_config is not None
                else None
            ),
            "training_config": (
                self.training_config.to_dict()
                if self.training_config is not None
                else None
            ),
            "evaluation_result": _safe_metrics(self.evaluation_result),
            "checkpoint_path": self.checkpoint_path,
            "peft": (
                self.peft_result.to_dict()
                if self.peft_result is not None and hasattr(self.peft_result, "to_dict")
                else None
            ),
        }

    def save_model_artifact(
        self,
        path,
        *,
        config: Mapping[str, Any] | Any | None = None,
        overwrite: bool = False,
        evaluation_summary: Mapping[str, Any] | None = None,
        merge_adapter: bool = False,
    ):
        """Bewaart het finale modelartifact via de lifecycle API."""
        from ..lifecycle import save_model_artifact
        from ..peft import is_lora_model, merged_lora_model

        summary = self._training_summary()
        evaluation = dict(evaluation_summary or {})
        if not evaluation and self.evaluation_result is not None:
            evaluation = {"metrics": _safe_metrics(self.evaluation_result)}
        model = self.model
        if is_lora_model(model):
            if not merge_adapter:
                raise FineTuningError(
                    "LoRA fine-tuned models must be saved as adapter artifacts or "
                    "with merge_adapter=True for a final model artifact"
                )
            model = merged_lora_model(model)
        return save_model_artifact(
            model,
            path,
            config=config,
            tokenizer=self.tokenizer,
            training_summary=summary,
            evaluation_summary=evaluation or None,
            provenance={
                "source": "arclm.finetuning.fine_tune",
                "fine_tuning_mode": (
                    self.fine_tuning_config.mode.value
                    if self.fine_tuning_config is not None
                    else None
                ),
                "dataset_fingerprint": self.dataset_report.dataset_fingerprint,
            },
            overwrite=overwrite,
        )

    def save_adapter_artifact(self, path, *, overwrite: bool = False):
        """Bewaart alleen de PEFT adapter, niet het hele model."""
        if self.peft_config is None:
            raise FineTuningError("No PEFT adapter is attached to this result")
        from ..peft import save_adapter_artifact

        adapted_modules = (
            self.peft_result.adapted_modules
            if self.peft_result is not None
            else None
        )
        return save_adapter_artifact(
            self.model,
            path,
            config=self.peft_config,
            adapted_modules=adapted_modules,
            overwrite=overwrite,
        )

    def _training_summary(self) -> dict[str, Any]:
        """Maakt een veilige trainingssamenvatting voor artifacts."""
        state = (
            self.training_state.to_dict()
            if hasattr(self.training_state, "to_dict")
            else {}
        )
        summary = {
            "arclm_version": __version__,
            "python_version": platform.python_version(),
            "pytorch_version": str(torch.__version__),
            "global_step": state.get("global_step"),
            "optimizer_step": state.get("optimizer_step"),
            "final_loss": state.get("last_loss"),
            "fine_tuning_config": (
                self.fine_tuning_config.to_dict()
                if self.fine_tuning_config is not None
                else None
            ),
            "dataset_report": self.dataset_report.to_dict(),
            "peft": (
                self.peft_result.to_dict()
                if self.peft_result is not None and hasattr(self.peft_result, "to_dict")
                else None
            ),
        }
        return _reject_non_finite(summary)


def prepare_fine_tuning_dataset(
    records: Iterable[Mapping[str, Any]],
    tokenizer: Any,
    config: FineTuningConfig | None = None,
    *,
    tokenizer_adapter: TokenizerAdapter | None = None,
) -> PreparedFineTuningDataset:
    """Valideert, formatteert en tokenizet fine-tuning records."""
    config = config or FineTuningConfig()
    adapter = tokenizer_adapter or TokenizerAdapter(tokenizer)
    raw_records = list(records)
    if not raw_records:
        raise FineTuningError("Fine-tuning dataset must not be empty")

    features: list[dict[str, list[int]]] = []
    errors: list[dict[str, Any]] = []
    truncated = 0
    dropped = 0
    total_tokens = 0
    trainable_tokens = 0
    fingerprint_rows: list[dict[str, Any]] = []
    formatter = "auto"

    for index, record in enumerate(raw_records):
        try:
            normalized = normalize_fine_tuning_example(record, index, config)
            formatter = normalized.formatter if formatter == "auto" else formatter
            feature, was_truncated = tokenize_normalized_example(
                normalized,
                adapter,
                config,
            )
        except Exception as error:
            dropped += 1
            _append_error(errors, index, error, config)
            if not config.skip_invalid_records:
                raise FineTuningError(
                    f"Fine-tuning record {index} is invalid: {_safe_error(error)}"
                ) from error
            continue
        features.append(feature)
        truncated += int(was_truncated)
        active_labels = sum(
            1 for label in feature["labels"] if label != config.ignore_index
        )
        total_tokens += len(feature["input_ids"])
        trainable_tokens += active_labels
        fingerprint_rows.append(
            {
                "formatter": normalized.formatter,
                "input_ids": feature["input_ids"],
                "labels": feature["labels"],
            }
        )

    if not features:
        raise FineTuningError("Fine-tuning dataset produced no trainable examples")

    fingerprint = _fingerprint(
        {
            "config": config.to_dict(),
            "records": fingerprint_rows,
            "records_seen": len(raw_records),
        }
    )
    report = FineTuningDatasetReport(
        mode=config.mode.value,
        formatter=formatter,
        records_seen=len(raw_records),
        records_valid=len(features),
        records_rejected=dropped,
        records_truncated=truncated,
        examples_dropped=dropped,
        total_tokens=total_tokens,
        trainable_tokens=trainable_tokens,
        dataset_fingerprint=fingerprint,
        errors=errors,
    )
    return PreparedFineTuningDataset(features, report)


def normalize_fine_tuning_example(
    record: Mapping[str, Any],
    source_index: int,
    config: FineTuningConfig,
) -> NormalizedSFTExample:
    """Normaliseert een datasetrecord naar veilige tekstsegmenten."""
    if not isinstance(record, Mapping):
        raise FormattingError("Fine-tuning records must be mappings")
    formatter = _resolve_formatter(record, config)
    if formatter in {"plain_text", "text"}:
        return _normalize_text(record, source_index, config)
    if formatter == "prompt_completion":
        return _normalize_prompt_completion(record, source_index, config)
    if formatter == "instruction_response":
        return _normalize_instruction(record, source_index, config)
    if formatter == "chat":
        return _normalize_chat(record, source_index, config)
    raise FormattingError("Fine-tuning formatter is not supported")


def tokenize_normalized_example(
    example: NormalizedSFTExample,
    tokenizer_adapter: TokenizerAdapter,
    config: FineTuningConfig,
) -> tuple[dict[str, list[int]], bool]:
    """Tokenizet segmenten zonder response-grenzen te zoeken in decode output."""
    input_ids: list[int] = []
    labels: list[int] = []
    for text, trainable in example.segments:
        token_ids = _encode_segment(tokenizer_adapter, text)
        input_ids.extend(token_ids)
        active = config.mode == FineTuningMode.CAUSAL_LM or trainable
        labels.extend(token_ids if active else [config.ignore_index] * len(token_ids))

    eos_id = tokenizer_adapter.eos_token_id
    if config.append_eos_token and eos_id is not None:
        input_ids.append(int(eos_id))
        last_trainable = (
            config.mode == FineTuningMode.CAUSAL_LM
            or bool(example.segments and example.segments[-1][1])
        )
        labels.append(int(eos_id) if last_trainable else config.ignore_index)

    if not input_ids:
        raise FineTuningError("Fine-tuning example produced no tokens")
    original_length = len(input_ids)
    if original_length > config.max_sequence_length:
        if not config.truncation:
            raise FineTuningError("Fine-tuning example exceeds max_sequence_length")
        input_ids = input_ids[: config.max_sequence_length]
        labels = labels[: config.max_sequence_length]
    if not any(label != config.ignore_index for label in labels):
        raise FineTuningError("Fine-tuning example has no trainable tokens")
    attention_mask = [1] * len(input_ids)
    return {
        "input_ids": input_ids,
        "attention_mask": attention_mask,
        "labels": labels,
    }, original_length > len(input_ids)


def fine_tune(
    *,
    model: torch.nn.Module | None = None,
    tokenizer: Any | None = None,
    loaded_model: Any | None = None,
    train_dataset: Iterable[Mapping[str, Any]],
    eval_dataset: Iterable[Mapping[str, Any]] | None = None,
    training_config: TrainingConfig | None = None,
    fine_tuning_config: FineTuningConfig | None = None,
    model_adapter: ModelAdapter | None = None,
    tokenizer_adapter: TokenizerAdapter | None = None,
    peft_config: Any | None = None,
    resume_from_checkpoint=None,
    save_checkpoint: bool = False,
) -> FineTuningResult:
    """Voert full-parameter fine-tuning uit met de bestaande Trainer."""
    if loaded_model is not None:
        model = model or getattr(loaded_model, "model", None)
        tokenizer = tokenizer or getattr(loaded_model, "tokenizer", None)
    if model is None:
        raise FineTuningError("model or loaded_model is required")
    if tokenizer is None and tokenizer_adapter is None:
        raise FineTuningError("tokenizer or tokenizer_adapter is required")

    ft_config = fine_tuning_config or FineTuningConfig()
    train_prepared = prepare_fine_tuning_dataset(
        train_dataset,
        tokenizer,
        ft_config,
        tokenizer_adapter=tokenizer_adapter,
    )
    eval_prepared = (
        prepare_fine_tuning_dataset(
            eval_dataset,
            tokenizer,
            ft_config,
            tokenizer_adapter=tokenizer_adapter,
        )
        if eval_dataset is not None
        else None
    )
    trainer_config = training_config or TrainingConfig()
    peft_result = None
    if peft_config is not None:
        from ..peft import apply_peft

        peft_result = apply_peft(model, peft_config)
    sft_config = ft_config.to_sft_config(trainer_config)
    fine_tuner = FullFineTuner(
        model=model,
        tokenizer=tokenizer,
        train_dataset=train_prepared,
        validation_dataset=eval_prepared,
        config=sft_config,
        model_adapter=model_adapter,
        tokenizer_adapter=tokenizer_adapter,
    )
    state = fine_tuner.train(resume_from_checkpoint=resume_from_checkpoint)
    evaluation = fine_tuner.evaluate(eval_prepared) if eval_prepared is not None else None
    checkpoint_path = None
    if save_checkpoint:
        checkpoint_path = str(fine_tuner.save_checkpoint())
    return FineTuningResult(
        training_state=state,
        dataset_report=train_prepared.report,
        model=model,
        tokenizer=tokenizer,
        fine_tuning_config=ft_config,
        training_config=trainer_config,
        evaluation_result=evaluation,
        trainer=fine_tuner,
        checkpoint_path=checkpoint_path,
        peft_config=peft_config,
        peft_result=peft_result,
    )


def _resolve_formatter(record: Mapping[str, Any], config: FineTuningConfig) -> str:
    """Kiest de formatter zonder op kolomnamen alleen de taak te raden."""
    if config.formatter != "auto":
        return "plain_text" if config.formatter == "text" else config.formatter
    if config.messages_field in record:
        return "chat"
    if _has_any(record, (config.instruction_field,)) or _read_response(record, config) is not None:
        if _has_any(record, (config.instruction_field,)):
            return "instruction_response"
    if config.prompt_field in record or config.completion_field in record:
        return "prompt_completion"
    if config.text_field in record:
        return "plain_text"
    raise FormattingError("Record does not match a supported fine-tuning schema")


def _normalize_text(
    record: Mapping[str, Any],
    source_index: int,
    config: FineTuningConfig,
) -> NormalizedSFTExample:
    """Normaliseert plain-text records."""
    text = _required_string(record, config.text_field, "text")
    if not text.strip():
        raise FormattingError("text must not be empty")
    return NormalizedSFTExample(
        formatter="plain_text",
        source_index=source_index,
        segments=((text, True),),
    )


def _normalize_prompt_completion(
    record: Mapping[str, Any],
    source_index: int,
    config: FineTuningConfig,
) -> NormalizedSFTExample:
    """Normaliseert prompt/completion records."""
    prompt = _optional_string(record, config.prompt_field, default="")
    completion = _required_string(record, config.completion_field, "completion")
    if not completion.strip():
        raise FormattingError("completion must not be empty")
    prefix = f"Prompt:\n{prompt}\n\nCompletion:\n"
    return NormalizedSFTExample(
        formatter="prompt_completion",
        source_index=source_index,
        segments=((prefix, config.train_on_prompt), (completion, True)),
    )


def _normalize_instruction(
    record: Mapping[str, Any],
    source_index: int,
    config: FineTuningConfig,
) -> NormalizedSFTExample:
    """Normaliseert instruction/input/response records."""
    instruction = _required_string(record, config.instruction_field, "instruction")
    response = _read_response(record, config)
    if response is None:
        raise FormattingError("response field is required")
    if not str(response).strip():
        raise FormattingError("response must not be empty")
    input_text = _optional_string(record, config.input_field, default="")
    parts = [f"Instruction:\n{instruction.strip()}"]
    if input_text.strip():
        parts.append(f"Input:\n{input_text.strip()}")
    prefix = "\n\n".join(parts) + "\n\nResponse:\n"
    return NormalizedSFTExample(
        formatter="instruction_response",
        source_index=source_index,
        segments=((prefix, config.train_on_prompt), (str(response).strip(), True)),
    )


def _normalize_chat(
    record: Mapping[str, Any],
    source_index: int,
    config: FineTuningConfig,
) -> NormalizedSFTExample:
    """Normaliseert chat records met expliciete role-grenzen."""
    messages = record.get(config.messages_field)
    if not isinstance(messages, list) or not messages:
        raise FormattingError("messages must be a non-empty list")
    segments: list[tuple[str, bool]] = []
    assistant_count = 0
    for message in messages:
        if not isinstance(message, Mapping):
            raise FormattingError("chat messages must be mappings")
        role = str(message.get("role", "")).strip().lower()
        if role not in {"system", "user", "assistant"}:
            raise FormattingError("chat role must be one of: system, user, assistant")
        content = message.get("content")
        if not isinstance(content, str):
            raise FormattingError("chat message content must be a string")
        if role == "assistant" and not content.strip():
            raise FormattingError("assistant message content must not be empty")
        prefix = f"{role}: "
        trainable = role == "assistant" or config.train_on_prompt
        segments.append((prefix, config.train_on_prompt))
        segments.append((content.strip(), trainable))
        segments.append(("\n", config.train_on_prompt))
        if role == "assistant":
            assistant_count += 1
    if config.mode == FineTuningMode.SFT and assistant_count == 0:
        raise FormattingError("chat records require at least one assistant message")
    return NormalizedSFTExample(
        formatter="chat",
        source_index=source_index,
        segments=tuple(segments),
        metadata={"assistant_messages": assistant_count},
    )


def _required_string(record: Mapping[str, Any], field_name: str, label: str) -> str:
    """Leest een verplicht stringveld."""
    value = record.get(field_name)
    if not isinstance(value, str):
        raise FormattingError(f"{label} must be a string")
    return value


def _optional_string(record: Mapping[str, Any], field_name: str, default: str) -> str:
    """Leest een optioneel stringveld."""
    value = record.get(field_name, default)
    if value is None:
        return default
    if not isinstance(value, str):
        raise FormattingError(f"{field_name} must be a string")
    return value


def _read_response(record: Mapping[str, Any], config: FineTuningConfig) -> str | None:
    """Leest response met enkele bestaande veldnamen als compatibiliteit."""
    for field_name in (
        config.response_field,
        "response",
        "output",
        "completion",
        "answer",
    ):
        if field_name in record:
            value = record[field_name]
            if not isinstance(value, str):
                raise FormattingError(f"{field_name} must be a string")
            return value
    return None


def _has_any(record: Mapping[str, Any], fields: Sequence[str]) -> bool:
    """Controleert of een veld aanwezig is."""
    return any(field in record for field in fields)


def _encode_segment(tokenizer_adapter: TokenizerAdapter, text: str) -> list[int]:
    """Encodeert een tekstsegment en geeft duidelijke tokenizerfouten."""
    if not text:
        return []
    try:
        return list(tokenizer_adapter.encode(text, max_length=None, truncation=False))
    except Exception as error:
        if isinstance(error, TokenizerAdapterError):
            raise
        raise TokenizerAdapterError(f"Tokenizer could not encode fine-tuning text: {error}") from error


def _append_error(
    errors: list[dict[str, Any]],
    index: int,
    error: Exception,
    config: FineTuningConfig,
) -> None:
    """Voegt een begrensde fout toe zonder voorbeeldtekst te bewaren."""
    if len(errors) >= config.max_report_errors:
        return
    errors.append(
        {
            "index": index,
            "error": type(error).__name__,
            "message": _safe_error(error),
        }
    )


def _safe_error(error: Exception) -> str:
    """Houdt foutmeldingen kort en vrij van recordinhoud."""
    message = str(error).splitlines()[0]
    return message[:240]


def _fingerprint(payload: Mapping[str, Any]) -> str:
    """Maakt een deterministische vingerafdruk van veilige token-data."""
    data = json.dumps(payload, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return "sft_" + hashlib.sha256(data).hexdigest()[:24]


def _safe_metrics(metrics: Mapping[str, Any] | None) -> dict[str, Any] | None:
    """Maakt metrics JSON-veilig zonder tensors te bewaren."""
    if metrics is None:
        return None
    safe: dict[str, Any] = {}
    for key, value in dict(metrics).items():
        if torch.is_tensor(value):
            if value.numel() == 1:
                value = float(value.detach().cpu().item())
            else:
                continue
        if isinstance(value, (int, float, str, bool)) or value is None:
            safe[str(key)] = value
    return _reject_non_finite(safe)


def _reject_non_finite(value: Any) -> Any:
    """Weigert NaN en Infinity in summaries."""
    if isinstance(value, float) and not math.isfinite(value):
        raise FineTuningError("Fine-tuning summary contains a non-finite number")
    if isinstance(value, dict):
        return {str(key): _reject_non_finite(item) for key, item in value.items()}
    if isinstance(value, list):
        return [_reject_non_finite(item) for item in value]
    return value
