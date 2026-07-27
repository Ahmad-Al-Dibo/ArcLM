"""Lokale hyperparameter search bovenop ArcLM run tracking."""

from __future__ import annotations

import hashlib
import json
import math
import os
import random
import tempfile
import time
import uuid
from dataclasses import asdict, dataclass, field, is_dataclass
from datetime import UTC, datetime
from enum import Enum
from itertools import product
from pathlib import Path
from typing import Any, Callable, Iterable, Mapping, Protocol

from arclm.finetuning import FineTuningConfig
from arclm.peft import LoRAConfig, QLoRAConfig
from arclm.training import TrainingConfig
from arclm.tracking import (
    RunConfig,
    RunOperation,
    RunStatus,
    RunStorageConfig,
    RunTracker,
    TrainingMethod,
    create_run,
)


SEARCH_FORMAT = "arclm-hyperparameter-search"
SEARCH_VERSION = 1
SEARCH_EVENT_VERSION = 1
DEFAULT_SEARCH_ROOT = "searches"
DEFAULT_MAX_TRIALS = 1000
MAX_OBJECTIVE_NAME_LENGTH = 120
MAX_SEARCH_NAME_LENGTH = 120
MAX_EVENT_PAYLOAD_KEYS = 32


class SearchError(RuntimeError):
    """Fout voor lokale hyperparameter search."""

    def __init__(self, code: str, message: str):
        super().__init__(message)
        self.code = code


class SearchStrategy(str, Enum):
    """Ondersteunde search strategieën."""

    GRID = "grid"
    RANDOM = "random"


class SearchStatus(str, Enum):
    """Stabiele statuswaarden voor een search."""

    CREATED = "created"
    RUNNING = "running"
    INTERRUPTED = "interrupted"
    COMPLETED = "completed"
    FAILED = "failed"


class TrialStatus(str, Enum):
    """Stabiele statuswaarden voor een trial."""

    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    INTERRUPTED = "interrupted"
    SKIPPED = "skipped"


class ObjectiveDirection(str, Enum):
    """Richting voor de objective metric."""

    MINIMIZE = "minimize"
    MAXIMIZE = "maximize"


class FailurePolicy(str, Enum):
    """Wat een search doet na een gefaalde trial."""

    CONTINUE = "continue"
    STOP = "stop"


_SEARCH_TRANSITIONS = {
    SearchStatus.CREATED: {
        SearchStatus.RUNNING,
        SearchStatus.COMPLETED,
        SearchStatus.FAILED,
        SearchStatus.INTERRUPTED,
    },
    SearchStatus.RUNNING: {
        SearchStatus.COMPLETED,
        SearchStatus.FAILED,
        SearchStatus.INTERRUPTED,
    },
    SearchStatus.INTERRUPTED: {SearchStatus.RUNNING, SearchStatus.FAILED},
    SearchStatus.COMPLETED: set(),
    SearchStatus.FAILED: set(),
}


_APPROVED_PATHS = {
    "training.epochs",
    "training.batch_size",
    "training.learning_rate",
    "training.weight_decay",
    "training.gradient_accumulation_steps",
    "training.max_grad_norm",
    "training.save_every_steps",
    "training.keep_last_checkpoints",
    "training.log_every_steps",
    "training.optimizer",
    "training.scheduler",
    "training.warmup_steps",
    "training.max_steps",
    "training.num_workers",
    "training.shuffle",
    "fine_tuning.formatter",
    "fine_tuning.max_sequence_length",
    "fine_tuning.train_on_prompt",
    "fine_tuning.append_eos_token",
    "fine_tuning.truncation",
    "fine_tuning.padding",
    "fine_tuning.ignore_index",
    "fine_tuning.skip_invalid_records",
    "fine_tuning.max_report_errors",
    "lora.rank",
    "lora.alpha",
    "lora.dropout",
    "lora.target_match",
    "lora.freeze_base_model",
}


@dataclass(frozen=True)
class SearchStorageConfig:
    """Instellingen voor lokale search opslag."""

    root_directory: str | Path = DEFAULT_SEARCH_ROOT
    fsync: bool = False
    lock_timeout_seconds: float | None = None

    def __post_init__(self) -> None:
        if self.lock_timeout_seconds is not None and self.lock_timeout_seconds <= 0:
            raise SearchError(
                "search_config_invalid",
                "lock_timeout_seconds must be greater than zero",
            )

    def to_dict(self) -> dict[str, Any]:
        """Geeft een veilige opslagconfig terug."""
        return {
            "root_directory": "<local-search-root>",
            "fsync": bool(self.fsync),
            "lock_timeout_seconds": self.lock_timeout_seconds,
        }


@dataclass(frozen=True)
class ObjectiveConfig:
    """Beschrijft welke metric een trial beoordeelt."""

    metric: str
    direction: ObjectiveDirection | str

    def __post_init__(self) -> None:
        metric = str(self.metric)
        if not metric or len(metric) > MAX_OBJECTIVE_NAME_LENGTH:
            raise SearchError("search_config_invalid", "objective metric is invalid")
        if any(char.isspace() for char in metric):
            raise SearchError(
                "search_config_invalid",
                "objective metric must not contain whitespace",
            )
        _coerce_direction(self.direction)

    def to_dict(self) -> dict[str, Any]:
        """Zet de objective om naar JSON data."""
        return {
            "metric": str(self.metric),
            "direction": _coerce_direction(self.direction).value,
        }

    @classmethod
    def from_dict(cls, values: Mapping[str, Any]) -> "ObjectiveConfig":
        """Leest een objective uit manifestdata."""
        return cls(metric=str(values.get("metric", "")), direction=values.get("direction", ""))


class Parameter(Protocol):
    """Kleine interface voor search parameters."""

    def grid_values(self) -> tuple[Any, ...]:
        """Geeft alle gridwaarden terug."""

    def sample(self, rng: random.Random) -> Any:
        """Trekt één waarde uit een dedicated search RNG."""

    def to_dict(self) -> dict[str, Any]:
        """Zet de parameter om naar JSON data."""


@dataclass(frozen=True)
class ChoiceParameter:
    """Parameter met een vaste lijst keuzes."""

    values: tuple[Any, ...]

    def __post_init__(self) -> None:
        if not self.values:
            raise SearchError("search_space_invalid", "ChoiceParameter values must not be empty")
        clean = tuple(_json_safe(value) for value in self.values)
        encoded = [json.dumps(value, sort_keys=True) for value in clean]
        if len(set(encoded)) != len(encoded):
            raise SearchError("search_space_invalid", "ChoiceParameter values must be unique")
        object.__setattr__(self, "values", clean)

    def grid_values(self) -> tuple[Any, ...]:
        """Geeft de keuzes in vaste volgorde terug."""
        return self.values

    def sample(self, rng: random.Random) -> Any:
        """Trekt een keuze zonder globale RNG te muteren."""
        return self.values[rng.randrange(len(self.values))]

    def to_dict(self) -> dict[str, Any]:
        """Zet de parameter om naar JSON data."""
        return {"type": "choice", "values": list(self.values)}


@dataclass(frozen=True)
class IntegerParameter:
    """Integer range met vaste stap."""

    minimum: int
    maximum: int
    step: int = 1

    def __post_init__(self) -> None:
        if isinstance(self.minimum, bool) or isinstance(self.maximum, bool):
            raise SearchError("search_space_invalid", "Integer bounds must be integers")
        if self.minimum > self.maximum:
            raise SearchError("search_space_invalid", "minimum must not be greater than maximum")
        if self.step <= 0:
            raise SearchError("search_space_invalid", "step must be greater than zero")

    def grid_values(self) -> tuple[int, ...]:
        """Geeft alle integer waarden terug."""
        return tuple(range(int(self.minimum), int(self.maximum) + 1, int(self.step)))

    def sample(self, rng: random.Random) -> int:
        """Trekt een integer uit de range."""
        values = self.grid_values()
        return values[rng.randrange(len(values))]

    def to_dict(self) -> dict[str, Any]:
        """Zet de parameter om naar JSON data."""
        return {
            "type": "integer",
            "minimum": int(self.minimum),
            "maximum": int(self.maximum),
            "step": int(self.step),
        }


@dataclass(frozen=True)
class FloatParameter:
    """Float range voor lineair of log sampling."""

    minimum: float
    maximum: float
    sampling: str = "linear"
    grid_size: int = 3

    def __post_init__(self) -> None:
        if not math.isfinite(float(self.minimum)) or not math.isfinite(float(self.maximum)):
            raise SearchError("search_space_invalid", "Float bounds must be finite")
        if self.minimum > self.maximum:
            raise SearchError("search_space_invalid", "minimum must not be greater than maximum")
        if self.sampling not in {"linear", "log"}:
            raise SearchError("search_space_invalid", "sampling must be linear or log")
        if self.sampling == "log" and (self.minimum <= 0 or self.maximum <= 0):
            raise SearchError("search_space_invalid", "log sampling requires positive bounds")
        if self.grid_size <= 0:
            raise SearchError("search_space_invalid", "grid_size must be greater than zero")

    def grid_values(self) -> tuple[float, ...]:
        """Geeft een kleine vaste grid terug voor float parameters."""
        if self.grid_size == 1:
            return (float(self.minimum),)
        if self.sampling == "log":
            low = math.log(float(self.minimum))
            high = math.log(float(self.maximum))
            return tuple(
                math.exp(low + (high - low) * index / (self.grid_size - 1))
                for index in range(self.grid_size)
            )
        return tuple(
            float(self.minimum)
            + (float(self.maximum) - float(self.minimum)) * index / (self.grid_size - 1)
            for index in range(self.grid_size)
        )

    def sample(self, rng: random.Random) -> float:
        """Trekt een float met een dedicated RNG."""
        if self.sampling == "log":
            low = math.log(float(self.minimum))
            high = math.log(float(self.maximum))
            return math.exp(rng.uniform(low, high))
        return rng.uniform(float(self.minimum), float(self.maximum))

    def to_dict(self) -> dict[str, Any]:
        """Zet de parameter om naar JSON data."""
        return {
            "type": "float",
            "minimum": float(self.minimum),
            "maximum": float(self.maximum),
            "sampling": self.sampling,
            "grid_size": int(self.grid_size),
        }


@dataclass(frozen=True)
class SearchSpace:
    """Verzameling goedgekeurde parameterpaden."""

    parameters: Mapping[str, Parameter]
    space_version: int = 1

    def __post_init__(self) -> None:
        if self.space_version != 1:
            raise SearchError("search_space_invalid", "space_version must be 1")
        if not self.parameters:
            raise SearchError("search_space_invalid", "SearchSpace must not be empty")
        normalized: dict[str, Parameter] = {}
        for path, parameter in self.parameters.items():
            _validate_parameter_path(path)
            if path in normalized:
                raise SearchError("search_space_invalid", f"Duplicate parameter path: {path}")
            if not hasattr(parameter, "grid_values") or not hasattr(parameter, "sample"):
                raise SearchError("search_space_invalid", "Unknown parameter type")
            normalized[str(path)] = parameter
        object.__setattr__(self, "parameters", normalized)

    def parameter_paths(self) -> tuple[str, ...]:
        """Geeft paden in deterministische volgorde terug."""
        return tuple(sorted(self.parameters))

    def estimate_grid_size(self) -> int:
        """Berekent de volledige gridgrootte zonder trials te maken."""
        total = 1
        for path in self.parameter_paths():
            total *= len(self.parameters[path].grid_values())
        return total

    def to_dict(self) -> dict[str, Any]:
        """Zet de search space om naar JSON data."""
        return {
            "space_version": self.space_version,
            "parameters": {
                path: self.parameters[path].to_dict()
                for path in self.parameter_paths()
            },
        }

    @classmethod
    def from_dict(cls, values: Mapping[str, Any]) -> "SearchSpace":
        """Leest een search space uit manifestdata."""
        raw = values.get("parameters", {})
        if not isinstance(raw, Mapping):
            raise SearchError("search_space_invalid", "parameters must be an object")
        params = {
            str(path): _parameter_from_dict(item)
            for path, item in raw.items()
        }
        return cls(parameters=params, space_version=int(values.get("space_version", 1)))


@dataclass(frozen=True)
class HyperparameterSearchConfig:
    """Configuratie voor een lokale search."""

    search_space: SearchSpace
    objective: ObjectiveConfig
    strategy: SearchStrategy | str = SearchStrategy.GRID
    base_training_config: TrainingConfig = field(default_factory=TrainingConfig)
    base_fine_tuning_config: FineTuningConfig | None = None
    lora_config: LoRAConfig | None = None
    qlora_config: QLoRAConfig | None = None
    trial_count: int | None = None
    seed: int = 0
    max_trials: int = DEFAULT_MAX_TRIALS
    failure_policy: FailurePolicy | str = FailurePolicy.CONTINUE
    storage: SearchStorageConfig = field(default_factory=SearchStorageConfig)
    name: str | None = None
    search_id: str | None = None
    dataset_fingerprint: str | None = None
    model_fingerprint: str | None = None
    tokenizer_fingerprint: str | None = None

    def __post_init__(self) -> None:
        strategy = _coerce_strategy(self.strategy)
        _coerce_failure_policy(self.failure_policy)
        if self.search_id is not None and not _is_safe_id(self.search_id, "search_"):
            raise SearchError("search_config_invalid", "search_id is not valid")
        if self.name is not None and (not self.name or len(self.name) > MAX_SEARCH_NAME_LENGTH):
            raise SearchError("search_config_invalid", "search name is invalid")
        if self.max_trials <= 0:
            raise SearchError("search_config_invalid", "max_trials must be greater than zero")
        if strategy == SearchStrategy.GRID:
            planned = self.search_space.estimate_grid_size()
            if self.trial_count is not None and self.trial_count != planned:
                raise SearchError("search_config_invalid", "grid trial_count must match grid size")
        else:
            if self.trial_count is None or self.trial_count <= 0:
                raise SearchError("search_config_invalid", "random search requires trial_count")
            planned = int(self.trial_count)
        if planned > self.max_trials:
            raise SearchError(
                "search_too_large",
                f"Search requests {planned} trials but max_trials is {self.max_trials}",
            )
        object.__setattr__(self, "strategy", strategy)
        object.__setattr__(self, "failure_policy", _coerce_failure_policy(self.failure_policy))

    @property
    def planned_trials(self) -> int:
        """Geeft het geplande aantal trials terug."""
        if self.strategy == SearchStrategy.GRID:
            return self.search_space.estimate_grid_size()
        return int(self.trial_count or 0)

    def to_dict(self) -> dict[str, Any]:
        """Zet de search config om naar JSON data."""
        return {
            "search_space": self.search_space.to_dict(),
            "objective": self.objective.to_dict(),
            "strategy": self.strategy.value,
            "base_training_config": self.base_training_config.to_dict(),
            "base_fine_tuning_config": (
                self.base_fine_tuning_config.to_dict()
                if self.base_fine_tuning_config is not None
                else None
            ),
            "lora_config": self.lora_config.to_dict() if self.lora_config is not None else None,
            "qlora_config": self.qlora_config.to_dict() if self.qlora_config is not None else None,
            "trial_count": self.trial_count,
            "seed": int(self.seed),
            "max_trials": int(self.max_trials),
            "failure_policy": self.failure_policy.value,
            "storage": self.storage.to_dict(),
            "name": self.name,
            "search_id": self.search_id,
            "dataset_fingerprint": self.dataset_fingerprint,
            "model_fingerprint": self.model_fingerprint,
            "tokenizer_fingerprint": self.tokenizer_fingerprint,
        }


@dataclass
class SearchManifest:
    """Versioned manifest voor een lokale search."""

    search_format: str
    search_version: int
    search_id: str
    name: str | None
    status: str
    strategy: str
    objective: dict[str, Any]
    search_space: dict[str, Any]
    base_configs: dict[str, Any]
    seed: int
    max_trials: int
    planned_trials: int
    completed_trials: int = 0
    failed_trials: int = 0
    interrupted_trials: int = 0
    skipped_trials: int = 0
    resume_count: int = 0
    best_trial_id: str | None = None
    best_objective: float | None = None
    best_config: dict[str, Any] | None = None
    search_fingerprint: str | None = None
    created_at: str = ""
    started_at: str | None = None
    updated_at: str | None = None
    completed_at: str | None = None
    failed_at: str | None = None
    interrupted_at: str | None = None
    result_summary: dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> dict[str, Any]:
        """Zet het manifest om naar JSON data."""
        return _json_safe(asdict(self))

    @classmethod
    def from_dict(cls, values: Mapping[str, Any]) -> "SearchManifest":
        """Leest en valideert een search manifest."""
        if values.get("search_format") != SEARCH_FORMAT:
            raise SearchError("search_invalid", "Unsupported search format")
        version = values.get("search_version")
        if not isinstance(version, int) or version <= 0:
            raise SearchError("search_invalid", "search_version must be positive")
        if version > SEARCH_VERSION:
            raise SearchError("search_version_unsupported", "Unsupported search version")
        search_id = values.get("search_id")
        if not isinstance(search_id, str) or not _is_safe_id(search_id, "search_"):
            raise SearchError("search_invalid", "search_id is not valid")
        _coerce_search_status(values.get("status"))
        _coerce_strategy(values.get("strategy"))
        return cls(
            search_format=SEARCH_FORMAT,
            search_version=version,
            search_id=search_id,
            name=values.get("name"),
            status=str(values.get("status")),
            strategy=str(values.get("strategy")),
            objective=dict(values.get("objective") or {}),
            search_space=dict(values.get("search_space") or {}),
            base_configs=dict(values.get("base_configs") or {}),
            seed=int(values.get("seed", 0)),
            max_trials=int(values.get("max_trials", DEFAULT_MAX_TRIALS)),
            planned_trials=int(values.get("planned_trials", 0)),
            completed_trials=int(values.get("completed_trials", 0)),
            failed_trials=int(values.get("failed_trials", 0)),
            interrupted_trials=int(values.get("interrupted_trials", 0)),
            skipped_trials=int(values.get("skipped_trials", 0)),
            resume_count=int(values.get("resume_count", 0)),
            best_trial_id=values.get("best_trial_id"),
            best_objective=values.get("best_objective"),
            best_config=values.get("best_config"),
            search_fingerprint=values.get("search_fingerprint"),
            created_at=str(values.get("created_at", "")),
            started_at=values.get("started_at"),
            updated_at=values.get("updated_at"),
            completed_at=values.get("completed_at"),
            failed_at=values.get("failed_at"),
            interrupted_at=values.get("interrupted_at"),
            result_summary=dict(values.get("result_summary") or {}),
        )


@dataclass
class TrialResult:
    """Persistente trial samenvatting."""

    trial_id: str
    trial_index: int
    status: str
    overrides: dict[str, Any]
    effective_config: dict[str, Any]
    fingerprint: str
    run_id: str | None = None
    run_path: str | None = None
    objective_metric: str | None = None
    objective_value: float | None = None
    error_code: str | None = None
    error_message: str | None = None
    started_at: str | None = None
    completed_at: str | None = None
    updated_at: str | None = None
    duration_seconds: float | None = None
    attempt: int = 0
    retry_count: int = 0

    def to_dict(self) -> dict[str, Any]:
        """Zet de trial om naar JSON data."""
        return _json_safe(asdict(self))

    @classmethod
    def from_dict(cls, values: Mapping[str, Any]) -> "TrialResult":
        """Leest een trial record."""
        trial_id = str(values.get("trial_id", ""))
        if not _is_safe_id(trial_id, "trial_"):
            raise SearchError("trial_invalid", "trial_id is not valid")
        _coerce_trial_status(values.get("status"))
        return cls(
            trial_id=trial_id,
            trial_index=int(values.get("trial_index", 0)),
            status=str(values.get("status")),
            overrides=dict(values.get("overrides") or {}),
            effective_config=dict(values.get("effective_config") or {}),
            fingerprint=str(values.get("fingerprint", "")),
            run_id=values.get("run_id"),
            run_path=values.get("run_path"),
            objective_metric=values.get("objective_metric"),
            objective_value=values.get("objective_value"),
            error_code=values.get("error_code"),
            error_message=values.get("error_message"),
            started_at=values.get("started_at"),
            completed_at=values.get("completed_at"),
            updated_at=values.get("updated_at"),
            duration_seconds=values.get("duration_seconds"),
            attempt=int(values.get("attempt", 0)),
            retry_count=int(values.get("retry_count", 0)),
        )


@dataclass(frozen=True)
class SearchInfo:
    """Kleine inspecteerbare search samenvatting."""

    search_id: str
    path: str
    status: str
    strategy: str
    objective: dict[str, Any]
    planned_trials: int
    completed_trials: int
    failed_trials: int
    interrupted_trials: int
    skipped_trials: int
    best_trial_id: str | None
    best_objective: float | None
    event_count: int
    trial_count: int
    warnings: list[str] = field(default_factory=list)


@dataclass(frozen=True)
class TrialContext:
    """Runtime data die de trial runner krijgt."""

    search_id: str
    trial_id: str
    trial_index: int
    run: RunTracker
    training_config: TrainingConfig
    fine_tuning_config: FineTuningConfig | None
    lora_config: LoRAConfig | None
    qlora_config: QLoRAConfig | None
    overrides: dict[str, Any]
    fingerprint: str


@dataclass(frozen=True)
class SearchComparison:
    """Vergelijkt trials binnen één search."""

    search_id: str
    trial_ids: list[str]
    metric: str
    values: dict[str, float]
    best_trial_id: str | None
    direction: str


class HyperparameterSearch:
    """Beheert een lokale sequentiële hyperparameter search."""

    def __init__(
        self,
        search_dir: str | Path,
        *,
        config: HyperparameterSearchConfig | None = None,
    ) -> None:
        self.search_dir = Path(search_dir)
        self.manifest_path = self.search_dir / "manifest.json"
        self.trials_path = self.search_dir / "trials.jsonl"
        self.events_path = self.search_dir / "events.jsonl"
        self.summaries_dir = self.search_dir / "summaries"
        self.lock_path = self.search_dir / ".search.lock"
        if not self.manifest_path.exists():
            raise SearchError("search_not_found", "Search manifest not found")
        self.manifest = load_search_manifest(self.search_dir)
        self.config = config or _config_from_manifest(self.manifest)
        self._event_sequence = _last_sequence(self.events_path)
        self._acquire_lock()

    @classmethod
    def create(
        cls,
        config: HyperparameterSearchConfig,
    ) -> "HyperparameterSearch":
        """Maakt een nieuwe search en materialiseert alle trials."""
        search_id = config.search_id or _generate_search_id()
        root = Path(config.storage.root_directory)
        _reject_unsafe_root(root)
        search_dir = root / search_id
        if search_dir.exists():
            raise SearchError("search_already_exists", "Search directory already exists")
        root.mkdir(parents=True, exist_ok=True)
        search_dir.mkdir()
        (search_dir / "summaries").mkdir()
        created_at = _utc_now()
        trials = _generate_trials(config)
        manifest = SearchManifest(
            search_format=SEARCH_FORMAT,
            search_version=SEARCH_VERSION,
            search_id=search_id,
            name=config.name,
            status=SearchStatus.CREATED.value,
            strategy=config.strategy.value,
            objective=config.objective.to_dict(),
            search_space=config.search_space.to_dict(),
            base_configs=_base_config_payload(config),
            seed=int(config.seed),
            max_trials=int(config.max_trials),
            planned_trials=len(trials),
            created_at=created_at,
            updated_at=created_at,
        )
        manifest.search_fingerprint = build_search_fingerprint(manifest)
        _write_json_atomic(search_dir / "manifest.json", manifest.to_dict())
        for trial in trials:
            _append_jsonl(search_dir / "trials.jsonl", trial.to_dict(), fsync=config.storage.fsync)
        search = cls(search_dir, config=config)
        search.record_event("search_created", {"planned_trials": len(trials)})
        return search

    def close(self) -> None:
        """Verwijdert de lokale schrijf-lock."""
        if self.lock_path.exists():
            try:
                self.lock_path.unlink()
            except OSError:
                pass

    def __enter__(self) -> "HyperparameterSearch":
        return self

    def __exit__(self, exc_type, exc, tb) -> None:
        if exc is not None and self.manifest.status == SearchStatus.RUNNING.value:
            self.interrupt(str(exc))
        self.close()

    def start(self) -> None:
        """Zet de search op running."""
        if self.manifest.status == SearchStatus.CREATED.value:
            self._transition(SearchStatus.RUNNING, "search_started")
        elif self.manifest.status == SearchStatus.INTERRUPTED.value:
            self.manifest.resume_count += 1
            self._transition(SearchStatus.RUNNING, "search_resumed")

    def interrupt(self, reason: str | None = None) -> None:
        """Markeert de search als onderbroken."""
        self._transition(SearchStatus.INTERRUPTED, "search_interrupted", {"reason": reason})

    def fail(self, message: str, *, code: str = "search_failed") -> None:
        """Markeert de search als gefaald."""
        self._transition(SearchStatus.FAILED, "search_failed", {"code": code, "message": _bounded_string(message, 500)})

    def execute(
        self,
        trial_runner: Callable[[TrialContext], Mapping[str, Any]],
        *,
        retry_failed: bool = False,
        max_trials: int | None = None,
    ) -> "HyperparameterSearchResult":
        """Voert pending trials sequentieel uit.

        De runner maakt zelf model/tokenizer/dataset objecten. Zo krijgt elke
        trial verse runtime objecten zonder een tweede training engine.
        """
        self.start()
        trials = self.trials()
        executed = 0
        for trial in trials:
            status = _coerce_trial_status(trial.status)
            if status == TrialStatus.COMPLETED:
                continue
            if status == TrialStatus.FAILED and not retry_failed:
                continue
            if status == TrialStatus.FAILED and trial.retry_count >= 1:
                continue
            if status == TrialStatus.SKIPPED:
                continue
            if max_trials is not None and executed >= max_trials:
                self.interrupt("max_trials reached")
                break
            self._execute_trial(trial, trial_runner)
            executed += 1
            if (
                _coerce_failure_policy(self.config.failure_policy) == FailurePolicy.STOP
                and self.trials_by_id()[trial.trial_id].status == TrialStatus.FAILED.value
            ):
                self.fail("Trial failed and failure_policy is stop")
                break
        if self.manifest.status == SearchStatus.RUNNING.value:
            self._refresh_counts()
            if self._all_terminal():
                self._transition(SearchStatus.COMPLETED, "search_completed")
        self._write_summary()
        return HyperparameterSearchResult(self.search_dir)

    def _execute_trial(
        self,
        trial: TrialResult,
        trial_runner: Callable[[TrialContext], Mapping[str, Any]],
    ) -> None:
        start_time = time.time()
        if trial.status == TrialStatus.FAILED.value:
            trial.retry_count += 1
        trial.attempt += 1
        run = create_run(
            RunConfig(
                name=f"{self.manifest.search_id}:{trial.trial_id}",
                operation=RunOperation.TRAINING,
                training_method=_training_method_from_config(self.config).value,
                storage=RunStorageConfig(root_directory=self.search_dir / "runs"),
            )
        )
        run.start()
        run.record_config(
            training_config=TrainingConfig.from_dict(trial.effective_config["training"]),
            fine_tuning_config=(
                FineTuningConfig.from_dict(trial.effective_config["fine_tuning"])
                if trial.effective_config.get("fine_tuning") is not None
                else None
            ),
            peft_config=(
                QLoRAConfig.from_dict(trial.effective_config["qlora"])
                if trial.effective_config.get("qlora") is not None
                else (
                    LoRAConfig.from_dict(trial.effective_config["lora"])
                    if trial.effective_config.get("lora") is not None
                    else None
                )
            ),
            quantization_config=(
                QLoRAConfig.from_dict(trial.effective_config["qlora"]).quantization
                if trial.effective_config.get("qlora") is not None
                else None
            ),
        )
        run.update_manifest(
            summaries={
                "search": {
                    "search_id": self.manifest.search_id,
                    "trial_id": trial.trial_id,
                    "trial_fingerprint": trial.fingerprint,
                    "strategy": self.manifest.strategy,
                    "overrides": trial.overrides,
                    "objective": self.manifest.objective,
                }
            }
        )
        trial.status = TrialStatus.RUNNING.value
        trial.run_id = run.manifest.run_id
        trial.run_path = _relative_path(run.run_dir, self.search_dir)
        trial.started_at = _utc_now()
        trial.updated_at = trial.started_at
        self._replace_trial(trial)
        self.record_event("trial_started", {"trial_id": trial.trial_id})
        try:
            context = TrialContext(
                search_id=self.manifest.search_id,
                trial_id=trial.trial_id,
                trial_index=trial.trial_index,
                run=run,
                training_config=TrainingConfig.from_dict(trial.effective_config["training"]),
                fine_tuning_config=(
                    FineTuningConfig.from_dict(trial.effective_config["fine_tuning"])
                    if trial.effective_config.get("fine_tuning") is not None
                    else None
                ),
                lora_config=(
                    LoRAConfig.from_dict(trial.effective_config["lora"])
                    if trial.effective_config.get("lora") is not None
                    else None
                ),
                qlora_config=(
                    QLoRAConfig.from_dict(trial.effective_config["qlora"])
                    if trial.effective_config.get("qlora") is not None
                    else None
                ),
                overrides=dict(trial.overrides),
                fingerprint=trial.fingerprint,
            )
            metrics = dict(trial_runner(context) or {})
            objective_value = _extract_objective(metrics, self.config.objective.metric)
            run.record_metric(metrics=metrics, split="eval")
            run.complete({"objective": objective_value})
            trial.status = TrialStatus.COMPLETED.value
            trial.objective_metric = self.config.objective.metric
            trial.objective_value = objective_value
            trial.completed_at = _utc_now()
            trial.error_code = None
            trial.error_message = None
            self.record_event(
                "trial_completed",
                {"trial_id": trial.trial_id, "objective": objective_value},
            )
        except KeyboardInterrupt:
            run.interrupt("trial interrupted")
            trial.status = TrialStatus.INTERRUPTED.value
            trial.error_code = "trial_interrupted"
            trial.error_message = "Trial interrupted"
            trial.completed_at = _utc_now()
            self.record_event("trial_interrupted", {"trial_id": trial.trial_id})
            raise
        except Exception as error:
            run.fail(str(error), code=getattr(error, "code", "trial_execution_failed"))
            trial.status = TrialStatus.FAILED.value
            trial.error_code = getattr(error, "code", "trial_execution_failed")
            trial.error_message = _bounded_string(str(error), 500)
            trial.completed_at = _utc_now()
            self.record_event(
                "trial_failed",
                {"trial_id": trial.trial_id, "code": trial.error_code},
            )
        finally:
            run.close()
            trial.duration_seconds = time.time() - start_time
            trial.updated_at = _utc_now()
            self._replace_trial(trial)
            self._refresh_counts()

    def trials(self) -> list[TrialResult]:
        """Leest alle trial records."""
        warnings_found: list[str] = []
        return [TrialResult.from_dict(record) for record in _read_jsonl(self.trials_path, warnings_found)]

    def trials_by_id(self) -> dict[str, TrialResult]:
        """Geeft trials per ID terug."""
        return {trial.trial_id: trial for trial in self.trials()}

    def record_event(self, event_type: str, payload: Mapping[str, Any] | None = None) -> None:
        """Schrijft een veilig search event."""
        if not event_type:
            raise SearchError("search_invalid", "event_type must not be empty")
        payload = _bounded_payload(payload or {})
        self._event_sequence += 1
        _append_jsonl(
            self.events_path,
            {
                "event_format": "arclm-search-event",
                "event_version": SEARCH_EVENT_VERSION,
                "search_id": self.manifest.search_id,
                "sequence": self._event_sequence,
                "timestamp": _utc_now(),
                "event_type": event_type,
                "payload": payload,
            },
            fsync=self.config.storage.fsync,
        )

    def export_best_config(self, path: str | Path, *, overwrite: bool = False) -> Path:
        """Schrijft de beste effectieve config als JSON."""
        if self.manifest.best_config is None:
            raise SearchError("objective_metric_missing", "No best trial is available")
        target = Path(path)
        if target.exists() and not overwrite:
            raise SearchError("search_already_exists", "Best config destination already exists")
        _write_json_atomic(target, self.manifest.best_config)
        return target

    def _replace_trial(self, updated: TrialResult) -> None:
        trials = self.trials()
        replaced = False
        for index, trial in enumerate(trials):
            if trial.trial_id == updated.trial_id:
                trials[index] = updated
                replaced = True
                break
        if not replaced:
            raise SearchError("trial_invalid", "Trial is not part of this search")
        _write_jsonl_atomic(self.trials_path, [trial.to_dict() for trial in trials])

    def _refresh_counts(self) -> None:
        trials = self.trials()
        self.manifest.completed_trials = sum(t.status == TrialStatus.COMPLETED.value for t in trials)
        self.manifest.failed_trials = sum(t.status == TrialStatus.FAILED.value for t in trials)
        self.manifest.interrupted_trials = sum(t.status == TrialStatus.INTERRUPTED.value for t in trials)
        self.manifest.skipped_trials = sum(t.status == TrialStatus.SKIPPED.value for t in trials)
        self._update_best(trials)
        self._save_manifest()

    def _update_best(self, trials: list[TrialResult]) -> None:
        direction = _coerce_direction(self.config.objective.direction)
        completed = [
            trial for trial in trials
            if trial.status == TrialStatus.COMPLETED.value and trial.objective_value is not None
        ]
        if not completed:
            self.manifest.best_trial_id = None
            self.manifest.best_objective = None
            self.manifest.best_config = None
            return
        key = (
            (lambda trial: (float(trial.objective_value), trial.trial_index))
            if direction == ObjectiveDirection.MINIMIZE
            else (lambda trial: (-float(trial.objective_value), trial.trial_index))
        )
        best = min(completed, key=key)
        self.manifest.best_trial_id = best.trial_id
        self.manifest.best_objective = float(best.objective_value)
        self.manifest.best_config = best.effective_config

    def _all_terminal(self) -> bool:
        terminal = {
            TrialStatus.COMPLETED.value,
            TrialStatus.FAILED.value,
            TrialStatus.SKIPPED.value,
        }
        return all(trial.status in terminal for trial in self.trials())

    def _transition(
        self,
        status: SearchStatus,
        event_type: str,
        payload: Mapping[str, Any] | None = None,
    ) -> None:
        current = _coerce_search_status(self.manifest.status)
        if status not in _SEARCH_TRANSITIONS[current]:
            raise SearchError(
                "search_status_invalid",
                f"Cannot transition search from {current.value} to {status.value}",
            )
        now = _utc_now()
        self.manifest.status = status.value
        self.manifest.updated_at = now
        if status == SearchStatus.RUNNING and self.manifest.started_at is None:
            self.manifest.started_at = now
        if status == SearchStatus.COMPLETED:
            self.manifest.completed_at = now
        if status == SearchStatus.FAILED:
            self.manifest.failed_at = now
        if status == SearchStatus.INTERRUPTED:
            self.manifest.interrupted_at = now
        self._save_manifest()
        self.record_event(event_type, payload)

    def _write_summary(self) -> None:
        summary = {
            "search_id": self.manifest.search_id,
            "status": self.manifest.status,
            "strategy": self.manifest.strategy,
            "objective": self.manifest.objective,
            "planned_trials": self.manifest.planned_trials,
            "completed_trials": self.manifest.completed_trials,
            "failed_trials": self.manifest.failed_trials,
            "interrupted_trials": self.manifest.interrupted_trials,
            "skipped_trials": self.manifest.skipped_trials,
            "best_trial_id": self.manifest.best_trial_id,
            "best_objective": self.manifest.best_objective,
            "best_config": self.manifest.best_config,
        }
        self.manifest.result_summary = summary
        self._save_manifest()
        _write_json_atomic(self.summaries_dir / "results.json", summary)

    def _save_manifest(self) -> None:
        self.manifest.updated_at = _utc_now()
        _write_json_atomic(self.manifest_path, self.manifest.to_dict())

    def _acquire_lock(self) -> None:
        if self.lock_path.exists():
            timeout = self.config.storage.lock_timeout_seconds
            if timeout is None:
                raise SearchError("search_locked", "Search is already open for writing")
            age = time.time() - self.lock_path.stat().st_mtime
            if age < timeout:
                raise SearchError("search_locked", "Search is already open for writing")
        self.lock_path.write_text(
            json.dumps({"search_id": self.manifest.search_id, "created_at": _utc_now()}),
            encoding="utf-8",
        )


@dataclass(frozen=True)
class HyperparameterSearchResult:
    """Result object voor een uitgevoerde search."""

    search_dir: Path

    @property
    def info(self) -> SearchInfo:
        """Geeft de inspectie terug."""
        return inspect_search(self.search_dir)

    @property
    def best_trial(self) -> TrialResult | None:
        """Geeft de beste trial terug."""
        manifest = load_search_manifest(self.search_dir)
        if manifest.best_trial_id is None:
            return None
        trials = [
            TrialResult.from_dict(record)
            for record in _read_jsonl(self.search_dir / "trials.jsonl", [])
        ]
        return next((trial for trial in trials if trial.trial_id == manifest.best_trial_id), None)

    def save_best_config(self, path: str | Path, *, overwrite: bool = False) -> Path:
        """Schrijft de beste config zonder de search opnieuw te locken."""
        best_trial = self.best_trial
        if best_trial is None:
            raise SearchError("search_no_best_trial", "Search has no completed trial")
        target = Path(path)
        if target.exists() and not overwrite:
            raise SearchError("search_output_exists", "Best config output already exists")
        _write_json_atomic(target, best_trial.effective_config)
        return target


def create_search(config: HyperparameterSearchConfig) -> HyperparameterSearch:
    """Maakt een lokale hyperparameter search."""
    return HyperparameterSearch.create(config)


def load_search(path: str | Path) -> HyperparameterSearch:
    """Opent een bestaande search voor schrijven."""
    return HyperparameterSearch(_resolve_search_dir(path))


def inspect_search(path: str | Path) -> SearchInfo:
    """Inspecteert een search zonder modellen of CUDA te laden."""
    search_dir = _resolve_search_dir(path)
    manifest = load_search_manifest(search_dir)
    warnings_found: list[str] = []
    trials = [TrialResult.from_dict(record) for record in _read_jsonl(search_dir / "trials.jsonl", warnings_found)]
    events = _read_jsonl(search_dir / "events.jsonl", warnings_found)
    return SearchInfo(
        search_id=manifest.search_id,
        path=str(search_dir),
        status=manifest.status,
        strategy=manifest.strategy,
        objective=manifest.objective,
        planned_trials=manifest.planned_trials,
        completed_trials=manifest.completed_trials,
        failed_trials=manifest.failed_trials,
        interrupted_trials=manifest.interrupted_trials,
        skipped_trials=manifest.skipped_trials,
        best_trial_id=manifest.best_trial_id,
        best_objective=manifest.best_objective,
        event_count=len(events),
        trial_count=len(trials),
        warnings=warnings_found,
    )


def validate_search(path: str | Path) -> SearchInfo:
    """Valideert manifest, trials en veilige run-referenties."""
    search_dir = _resolve_search_dir(path)
    if _has_symlink_escape(search_dir):
        raise SearchError("search_invalid", "Search directory contains an unsafe symlink")
    manifest = load_search_manifest(search_dir)
    trials = [TrialResult.from_dict(record) for record in _read_jsonl(search_dir / "trials.jsonl", [])]
    if len(trials) != manifest.planned_trials:
        raise SearchError("search_invalid", "Trial count does not match manifest")
    ids = [trial.trial_id for trial in trials]
    if len(set(ids)) != len(ids):
        raise SearchError("trial_duplicate", "Duplicate trial ID")
    fingerprints = [trial.fingerprint for trial in trials]
    if len(set(fingerprints)) != len(fingerprints):
        raise SearchError("trial_duplicate", "Duplicate trial fingerprint")
    if manifest.best_trial_id is not None and manifest.best_trial_id not in ids:
        raise SearchError("search_invalid", "Best trial is not part of the search")
    for trial in trials:
        if trial.run_path is None:
            continue
        if Path(trial.run_path).is_absolute() or ".." in Path(trial.run_path).parts:
            raise SearchError("search_invalid", "Run reference is not safe")
        if trial.status in {TrialStatus.COMPLETED.value, TrialStatus.FAILED.value}:
            if not (search_dir / trial.run_path).exists():
                raise SearchError("search_invalid", "Trial run reference is missing")
    return inspect_search(search_dir)


def list_searches(
    root_directory: str | Path = DEFAULT_SEARCH_ROOT,
    *,
    status: SearchStatus | str | None = None,
    strategy: SearchStrategy | str | None = None,
    limit: int = 100,
) -> list[SearchInfo]:
    """Geeft searches in deterministische volgorde terug."""
    if limit <= 0:
        raise SearchError("search_config_invalid", "limit must be greater than zero")
    root = Path(root_directory)
    if not root.exists():
        return []
    wanted_status = _coerce_search_status(status).value if status is not None else None
    wanted_strategy = _coerce_strategy(strategy).value if strategy is not None else None
    infos: list[SearchInfo] = []
    for entry in sorted(root.iterdir(), key=lambda item: item.name):
        if not entry.is_dir():
            continue
        try:
            info = inspect_search(entry)
        except SearchError:
            continue
        if wanted_status is not None and info.status != wanted_status:
            continue
        if wanted_strategy is not None and info.strategy != wanted_strategy:
            continue
        infos.append(info)
        if len(infos) >= limit:
            break
    return infos


def compare_trials(path: str | Path, *, metric_name: str | None = None) -> SearchComparison:
    """Vergelijkt trial objectives binnen een search."""
    search_dir = _resolve_search_dir(path)
    manifest = load_search_manifest(search_dir)
    metric = metric_name or str(manifest.objective.get("metric"))
    direction = _coerce_direction(manifest.objective.get("direction")).value
    trials = [TrialResult.from_dict(record) for record in _read_jsonl(search_dir / "trials.jsonl", [])]
    values = {
        trial.trial_id: float(trial.objective_value)
        for trial in trials
        if trial.objective_metric == metric and trial.objective_value is not None
    }
    return SearchComparison(
        search_id=manifest.search_id,
        trial_ids=[trial.trial_id for trial in trials],
        metric=metric,
        values=values,
        best_trial_id=manifest.best_trial_id,
        direction=direction,
    )


def load_search_manifest(path: str | Path) -> SearchManifest:
    """Laadt een search manifest."""
    manifest_path = Path(path)
    if manifest_path.is_dir():
        manifest_path = manifest_path / "manifest.json"
    if not manifest_path.exists():
        raise SearchError("search_not_found", "Search manifest not found")
    try:
        data = json.loads(manifest_path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as error:
        raise SearchError("search_invalid", "Search manifest is not valid JSON") from error
    if not isinstance(data, Mapping):
        raise SearchError("search_invalid", "Search manifest must be an object")
    return SearchManifest.from_dict(data)


def build_search_fingerprint(manifest: SearchManifest | Mapping[str, Any]) -> str:
    """Berekent een deterministische search fingerprint."""
    values = manifest.to_dict() if isinstance(manifest, SearchManifest) else dict(manifest)
    payload = {
        "search_format": values.get("search_format"),
        "search_version": values.get("search_version"),
        "strategy": values.get("strategy"),
        "objective": values.get("objective"),
        "search_space": values.get("search_space"),
        "base_configs": values.get("base_configs"),
        "seed": values.get("seed"),
        "planned_trials": values.get("planned_trials"),
    }
    return "searchfp_" + _fingerprint_payload(payload)


def build_trial_fingerprint(
    *,
    overrides: Mapping[str, Any],
    effective_config: Mapping[str, Any],
    base_configs: Mapping[str, Any],
    dataset_fingerprint: str | None = None,
    model_fingerprint: str | None = None,
    tokenizer_fingerprint: str | None = None,
) -> str:
    """Berekent een deterministische trial fingerprint."""
    return "trialfp_" + _fingerprint_payload(
        {
            "overrides": dict(overrides),
            "effective_config": dict(effective_config),
            "base_configs": dict(base_configs),
            "dataset_fingerprint": dataset_fingerprint,
            "model_fingerprint": model_fingerprint,
            "tokenizer_fingerprint": tokenizer_fingerprint,
        }
    )


def _generate_trials(config: HyperparameterSearchConfig) -> list[TrialResult]:
    if config.strategy == SearchStrategy.GRID:
        overrides = _grid_overrides(config.search_space)
    else:
        overrides = _random_overrides(config)
    trials: list[TrialResult] = []
    seen: set[str] = set()
    base = _base_config_payload(config)
    for index, override in enumerate(overrides, start=1):
        effective = _materialize_effective_config(config, override)
        fingerprint = build_trial_fingerprint(
            overrides=override,
            effective_config=effective,
            base_configs=base,
            dataset_fingerprint=config.dataset_fingerprint,
            model_fingerprint=config.model_fingerprint,
            tokenizer_fingerprint=config.tokenizer_fingerprint,
        )
        if fingerprint in seen:
            continue
        seen.add(fingerprint)
        trials.append(
            TrialResult(
                trial_id=f"trial_{len(trials) + 1:04d}",
                trial_index=len(trials),
                status=TrialStatus.PENDING.value,
                overrides=dict(override),
                effective_config=effective,
                fingerprint=fingerprint,
            )
        )
    if len(trials) != len(overrides):
        raise SearchError("trial_duplicate", "Duplicate materialized trial configuration")
    return trials


def _grid_overrides(space: SearchSpace) -> list[dict[str, Any]]:
    paths = space.parameter_paths()
    values = [space.parameters[path].grid_values() for path in paths]
    return [
        {path: _json_safe(value) for path, value in zip(paths, combination)}
        for combination in product(*values)
    ]


def _random_overrides(config: HyperparameterSearchConfig) -> list[dict[str, Any]]:
    rng = random.Random(config.seed)
    paths = config.search_space.parameter_paths()
    target = int(config.trial_count or 0)
    overrides: list[dict[str, Any]] = []
    seen: set[str] = set()
    attempts = 0
    max_attempts = max(target * 20, 100)
    finite_limit = _finite_unique_limit(config.search_space)
    if finite_limit is not None and target > finite_limit:
        raise SearchError("search_too_large", "Random search requests more unique trials than the finite space")
    while len(overrides) < target and attempts < max_attempts:
        attempts += 1
        row = {path: _json_safe(config.search_space.parameters[path].sample(rng)) for path in paths}
        encoded = json.dumps(row, sort_keys=True, separators=(",", ":"))
        if encoded in seen:
            continue
        seen.add(encoded)
        overrides.append(row)
    if len(overrides) < target:
        raise SearchError("trial_duplicate", "Could not generate enough unique random trials")
    return overrides


def _finite_unique_limit(space: SearchSpace) -> int | None:
    total = 1
    for path in space.parameter_paths():
        parameter = space.parameters[path]
        if isinstance(parameter, FloatParameter):
            return None
        total *= len(parameter.grid_values())
    return total


def _materialize_effective_config(
    config: HyperparameterSearchConfig,
    overrides: Mapping[str, Any],
) -> dict[str, Any]:
    training = config.base_training_config.to_dict()
    fine_tuning = (
        config.base_fine_tuning_config.to_dict()
        if config.base_fine_tuning_config is not None
        else None
    )
    lora = config.lora_config.to_dict() if config.lora_config is not None else None
    qlora = config.qlora_config.to_dict() if config.qlora_config is not None else None
    for path, value in overrides.items():
        section, field_name = path.split(".", 1)
        if section == "training":
            training[field_name] = value
        elif section == "fine_tuning":
            if fine_tuning is None:
                fine_tuning = FineTuningConfig().to_dict()
            fine_tuning[field_name] = value
        elif section == "lora":
            if lora is None:
                lora = LoRAConfig().to_dict()
            lora[field_name] = value
        else:
            raise SearchError("search_space_invalid", f"Unsupported parameter path: {path}")
    training_config = TrainingConfig.from_dict(training)
    fine_tuning_config = FineTuningConfig.from_dict(fine_tuning) if fine_tuning is not None else None
    lora_config = LoRAConfig.from_dict(lora) if lora is not None else None
    return {
        "training": training_config.to_dict(),
        "fine_tuning": fine_tuning_config.to_dict() if fine_tuning_config is not None else None,
        "lora": lora_config.to_dict() if lora_config is not None else None,
        "qlora": qlora,
    }


def _config_from_manifest(manifest: SearchManifest) -> HyperparameterSearchConfig:
    base = dict(manifest.base_configs)
    return HyperparameterSearchConfig(
        search_space=SearchSpace.from_dict(manifest.search_space),
        objective=ObjectiveConfig.from_dict(manifest.objective),
        strategy=manifest.strategy,
        base_training_config=TrainingConfig.from_dict(base["training"]),
        base_fine_tuning_config=(
            FineTuningConfig.from_dict(base["fine_tuning"])
            if base.get("fine_tuning") is not None
            else None
        ),
        lora_config=LoRAConfig.from_dict(base["lora"]) if base.get("lora") is not None else None,
        qlora_config=QLoRAConfig.from_dict(base["qlora"]) if base.get("qlora") is not None else None,
        trial_count=manifest.planned_trials if manifest.strategy == SearchStrategy.RANDOM.value else None,
        seed=manifest.seed,
        max_trials=manifest.max_trials,
        name=manifest.name,
        search_id=manifest.search_id,
    )


def _base_config_payload(config: HyperparameterSearchConfig) -> dict[str, Any]:
    return {
        "training": config.base_training_config.to_dict(),
        "fine_tuning": (
            config.base_fine_tuning_config.to_dict()
            if config.base_fine_tuning_config is not None
            else None
        ),
        "lora": config.lora_config.to_dict() if config.lora_config is not None else None,
        "qlora": config.qlora_config.to_dict() if config.qlora_config is not None else None,
        "dataset_fingerprint": config.dataset_fingerprint,
        "model_fingerprint": config.model_fingerprint,
        "tokenizer_fingerprint": config.tokenizer_fingerprint,
    }


def _extract_objective(metrics: Mapping[str, Any], metric_name: str) -> float:
    if metric_name not in metrics:
        raise SearchError("objective_metric_missing", f"Objective metric is missing: {metric_name}")
    value = metrics[metric_name]
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        raise SearchError("objective_metric_invalid", "Objective metric must be numeric")
    value = float(value)
    if not math.isfinite(value):
        raise SearchError("objective_metric_invalid", "Objective metric must be finite")
    return value


def _parameter_from_dict(values: Mapping[str, Any]) -> Parameter:
    kind = values.get("type")
    if kind == "choice":
        return ChoiceParameter(tuple(values.get("values", ())))
    if kind == "integer":
        return IntegerParameter(
            minimum=int(values.get("minimum")),
            maximum=int(values.get("maximum")),
            step=int(values.get("step", 1)),
        )
    if kind == "float":
        return FloatParameter(
            minimum=float(values.get("minimum")),
            maximum=float(values.get("maximum")),
            sampling=str(values.get("sampling", "linear")),
            grid_size=int(values.get("grid_size", 3)),
        )
    raise SearchError("search_space_invalid", "Unknown parameter type")


def _write_json_atomic(path: Path, payload: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temp_path: Path | None = None
    try:
        with tempfile.NamedTemporaryFile(
            "w",
            dir=path.parent,
            encoding="utf-8",
            delete=False,
        ) as handle:
            json.dump(_json_safe(payload), handle, indent=2, sort_keys=True)
            handle.write("\n")
            handle.flush()
            os.fsync(handle.fileno())
            temp_path = Path(handle.name)
        temp_path.replace(path)
    finally:
        if temp_path is not None and temp_path.exists():
            temp_path.unlink(missing_ok=True)


def _write_jsonl_atomic(path: Path, records: Iterable[Mapping[str, Any]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temp_path: Path | None = None
    try:
        with tempfile.NamedTemporaryFile("w", dir=path.parent, encoding="utf-8", delete=False) as handle:
            for record in records:
                handle.write(json.dumps(_json_safe(record), sort_keys=True) + "\n")
            handle.flush()
            os.fsync(handle.fileno())
            temp_path = Path(handle.name)
        temp_path.replace(path)
    finally:
        if temp_path is not None and temp_path.exists():
            temp_path.unlink(missing_ok=True)


def _append_jsonl(path: Path, record: Mapping[str, Any], *, fsync: bool = False) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(_json_safe(record), sort_keys=True) + "\n")
        handle.flush()
        if fsync:
            os.fsync(handle.fileno())


def _read_jsonl(path: Path, warnings_found: list[str]) -> list[dict[str, Any]]:
    if not path.exists():
        return []
    records: list[dict[str, Any]] = []
    lines = path.read_text(encoding="utf-8").splitlines()
    for index, line in enumerate(lines):
        if not line.strip():
            continue
        try:
            value = json.loads(line)
        except json.JSONDecodeError:
            if index == len(lines) - 1:
                warnings_found.append(f"Ignored truncated final line in {path.name}")
                break
            raise SearchError("search_invalid", f"{path.name} contains invalid JSON")
        if not isinstance(value, dict):
            raise SearchError("search_invalid", f"{path.name} records must be objects")
        records.append(value)
    return records


def _last_sequence(path: Path) -> int:
    records = _read_jsonl(path, [])
    if not records:
        return 0
    return int(records[-1].get("sequence", 0) or 0)


def _json_safe(value: Any) -> Any:
    if callable(value):
        raise SearchError("search_invalid", "Search metadata cannot contain callables")
    if isinstance(value, Enum):
        return value.value
    if isinstance(value, Mapping):
        return {str(key): _json_safe(item) for key, item in value.items()}
    if isinstance(value, (list, tuple)):
        return [_json_safe(item) for item in value]
    if isinstance(value, (str, int, bool)) or value is None:
        return value
    if isinstance(value, float):
        if not math.isfinite(value):
            raise SearchError("search_invalid", "Search metadata must be finite")
        return value
    if isinstance(value, Path):
        return {"path": True, "name": value.name}
    if is_dataclass(value):
        return _json_safe(asdict(value))
    return str(value)


def _bounded_payload(payload: Mapping[str, Any]) -> dict[str, Any]:
    if len(payload) > MAX_EVENT_PAYLOAD_KEYS:
        raise SearchError("search_invalid", "Event payload has too many fields")
    return _json_safe(payload)


def _validate_parameter_path(path: str) -> None:
    if path not in _APPROVED_PATHS:
        raise SearchError("search_space_invalid", f"Parameter path is not approved: {path}")


def _coerce_strategy(value: SearchStrategy | str | None) -> SearchStrategy:
    try:
        return value if isinstance(value, SearchStrategy) else SearchStrategy(str(value))
    except ValueError as error:
        raise SearchError("search_config_invalid", "Search strategy must be grid or random") from error


def _coerce_search_status(value: SearchStatus | str | None) -> SearchStatus:
    try:
        return value if isinstance(value, SearchStatus) else SearchStatus(str(value))
    except ValueError as error:
        raise SearchError("search_status_invalid", "Search status is not supported") from error


def _coerce_trial_status(value: TrialStatus | str | None) -> TrialStatus:
    try:
        return value if isinstance(value, TrialStatus) else TrialStatus(str(value))
    except ValueError as error:
        raise SearchError("trial_invalid", "Trial status is not supported") from error


def _coerce_direction(value: ObjectiveDirection | str | None) -> ObjectiveDirection:
    try:
        return value if isinstance(value, ObjectiveDirection) else ObjectiveDirection(str(value))
    except ValueError as error:
        raise SearchError("search_config_invalid", "Objective direction must be minimize or maximize") from error


def _coerce_failure_policy(value: FailurePolicy | str | None) -> FailurePolicy:
    try:
        return value if isinstance(value, FailurePolicy) else FailurePolicy(str(value))
    except ValueError as error:
        raise SearchError("search_config_invalid", "failure_policy must be continue or stop") from error


def _training_method_from_config(config: HyperparameterSearchConfig) -> TrainingMethod:
    if config.qlora_config is not None:
        return TrainingMethod.QLORA
    if config.lora_config is not None:
        return TrainingMethod.LORA
    return TrainingMethod.FULL_FINE_TUNING


def _generate_search_id() -> str:
    return "search_" + uuid.uuid4().hex[:20]


def _utc_now() -> str:
    return datetime.now(UTC).isoformat().replace("+00:00", "Z")


def _fingerprint_payload(payload: Mapping[str, Any]) -> str:
    encoded = json.dumps(_json_safe(payload), sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(encoded.encode("utf-8")).hexdigest()[:24]


def _resolve_search_dir(path: str | Path) -> Path:
    search_dir = Path(path)
    if search_dir.is_file() and search_dir.name == "manifest.json":
        search_dir = search_dir.parent
    if not search_dir.exists():
        raise SearchError("search_not_found", "Search directory not found")
    return search_dir


def _reject_unsafe_root(root: Path) -> None:
    resolved = root.resolve()
    if resolved == resolved.anchor:
        raise SearchError("search_config_invalid", "Search root must not be the filesystem root")
    if _has_symlink_escape(resolved):
        raise SearchError("search_config_invalid", "Search root contains an unsafe symlink")


def _has_symlink_escape(root: Path) -> bool:
    if not root.exists():
        return False
    resolved = root.resolve()
    for entry in root.rglob("*"):
        if entry.is_symlink():
            try:
                target = entry.resolve()
            except OSError:
                return True
            if resolved not in (target, *target.parents):
                return True
    return False


def _is_safe_id(value: str, prefix: str) -> bool:
    if not value.startswith(prefix):
        return False
    rest = value[len(prefix):]
    return bool(rest) and all(char.isalnum() or char in {"_", "-"} for char in rest)


def _relative_path(path: Path, base: Path) -> str:
    try:
        return path.relative_to(base).as_posix()
    except ValueError as error:
        raise SearchError("search_invalid", "Reference path must stay inside the search") from error


def _bounded_string(value: str, limit: int) -> str:
    return value if len(value) <= limit else value[: limit - 3] + "..."


__all__ = [
    "DEFAULT_MAX_TRIALS",
    "DEFAULT_SEARCH_ROOT",
    "SEARCH_FORMAT",
    "SEARCH_VERSION",
    "ChoiceParameter",
    "FailurePolicy",
    "FloatParameter",
    "HyperparameterSearch",
    "HyperparameterSearchConfig",
    "HyperparameterSearchResult",
    "IntegerParameter",
    "ObjectiveConfig",
    "ObjectiveDirection",
    "SearchComparison",
    "SearchError",
    "SearchInfo",
    "SearchManifest",
    "SearchSpace",
    "SearchStatus",
    "SearchStorageConfig",
    "SearchStrategy",
    "TrialContext",
    "TrialResult",
    "TrialStatus",
    "build_search_fingerprint",
    "build_trial_fingerprint",
    "compare_trials",
    "create_search",
    "inspect_search",
    "list_searches",
    "load_search",
    "load_search_manifest",
    "validate_search",
]
