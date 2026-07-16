"""Kleine distributed runtime-contracten voor toekomstige DDP/FSDP features."""

from __future__ import annotations

import os
import socket
import traceback
from contextlib import contextmanager
from dataclasses import dataclass, field
from datetime import timedelta
from enum import Enum
from multiprocessing.queues import Queue
from typing import Callable, Iterator, Mapping, Sequence


FSDP_CHECKPOINT_POLICY_FORMAT = "arclm-fsdp-sharded-checkpoint-policy"
FSDP_CHECKPOINT_POLICY_VERSION = 1


class DistributedError(RuntimeError):
    """Fout voor distributed runtime-configuratie."""

    def __init__(self, code: str, message: str):
        super().__init__(message)
        self.code = code


class DistributedBackend(str, Enum):
    """Ondersteunde torch.distributed backends voor de runtime-laag."""

    GLOO = "gloo"
    NCCL = "nccl"


@dataclass(frozen=True)
class DistributedValidationIssue:
    """Een fout of waarschuwing uit distributed config-validatie."""

    code: str
    message: str
    severity: str

    def __post_init__(self) -> None:
        if self.severity not in {"error", "warning"}:
            raise DistributedError(
                "distributed_validation_invalid",
                "validation issue severity must be error or warning",
            )

    def to_dict(self) -> dict[str, str]:
        """Zet het issue om naar JSON-vriendelijke data."""
        return {
            "code": self.code,
            "message": self.message,
            "severity": self.severity,
        }


@dataclass(frozen=True)
class DistributedValidationResult:
    """Resultaat van distributed config-validatie zonder side effects."""

    valid: bool
    errors: tuple[DistributedValidationIssue, ...]
    warnings: tuple[DistributedValidationIssue, ...]
    runtime: "DistributedRuntimeInfo"
    requires_process_group: bool
    requires_cuda: bool
    requires_multi_gpu: bool

    def raise_for_errors(self) -> None:
        """Gooit de eerste validatiefout als er fouten zijn."""
        if self.errors:
            issue = self.errors[0]
            raise DistributedError(issue.code, issue.message)

    def to_dict(self) -> dict[str, object]:
        """Zet het resultaat om naar JSON-vriendelijke data."""
        return {
            "valid": self.valid,
            "errors": [issue.to_dict() for issue in self.errors],
            "warnings": [issue.to_dict() for issue in self.warnings],
            "runtime": self.runtime.to_dict(),
            "requires_process_group": self.requires_process_group,
            "requires_cuda": self.requires_cuda,
            "requires_multi_gpu": self.requires_multi_gpu,
        }


@dataclass(frozen=True)
class DistributedConfig:
    """Beschrijft een distributed proces zonder een process group te starten."""

    backend: DistributedBackend | str = DistributedBackend.GLOO
    world_size: int = 1
    rank: int = 0
    local_rank: int = 0
    device: str | None = None
    use_cuda: bool = False
    require_cuda: bool = False
    init_method: str | None = None
    master_addr: str | None = None
    master_port: int | None = None
    timeout_seconds: float = 1800.0

    def __post_init__(self) -> None:
        _coerce_backend(self.backend)
        _validate_positive_int("world_size", self.world_size)
        _validate_non_negative_int("rank", self.rank)
        _validate_non_negative_int("local_rank", self.local_rank)
        if self.rank >= self.world_size:
            raise DistributedError(
                "distributed_config_invalid",
                "rank must be smaller than world_size",
            )
        if self.timeout_seconds <= 0:
            raise DistributedError(
                "distributed_config_invalid",
                "timeout_seconds must be greater than zero",
            )
        if self.master_port is not None and not (1 <= int(self.master_port) <= 65535):
            raise DistributedError(
                "distributed_config_invalid",
                "master_port must be between 1 and 65535",
            )
        if self.device is not None:
            _validate_device_name(self.device)
        if self.init_method is not None and not _is_safe_init_method(self.init_method):
            raise DistributedError(
                "distributed_config_invalid",
                "init_method must start with env://, tcp://, or file://",
            )

    @property
    def backend_name(self) -> str:
        """Geeft de backend als stabiele string terug."""
        return _coerce_backend(self.backend).value

    @property
    def is_distributed(self) -> bool:
        """Geeft aan of deze config meer dan een proces verwacht."""
        return self.world_size > 1

    def to_dict(self) -> dict[str, object]:
        """Zet de config om naar JSON-vriendelijke data."""
        return {
            "backend": self.backend_name,
            "world_size": self.world_size,
            "rank": self.rank,
            "local_rank": self.local_rank,
            "device": self.device,
            "use_cuda": self.use_cuda,
            "require_cuda": self.require_cuda,
            "init_method": self.init_method,
            "master_addr": self.master_addr,
            "master_port": self.master_port,
            "timeout_seconds": self.timeout_seconds,
        }

    @classmethod
    def from_dict(cls, values: Mapping[str, object]) -> "DistributedConfig":
        """Leest een distributed config uit gewone mapping-data."""
        return cls(
            backend=values.get("backend", DistributedBackend.GLOO),
            world_size=_int_value(values.get("world_size", 1), "world_size"),
            rank=_int_value(values.get("rank", 0), "rank"),
            local_rank=_int_value(values.get("local_rank", 0), "local_rank"),
            device=_optional_str(values.get("device")),
            use_cuda=bool(values.get("use_cuda", False)),
            require_cuda=bool(values.get("require_cuda", False)),
            init_method=_optional_str(values.get("init_method")),
            master_addr=_optional_str(values.get("master_addr")),
            master_port=(
                _int_value(values["master_port"], "master_port")
                if values.get("master_port") is not None
                else None
            ),
            timeout_seconds=float(values.get("timeout_seconds", 1800.0)),
        )

    @classmethod
    def from_env(
        cls,
        env: Mapping[str, str] | None = None,
        *,
        backend: DistributedBackend | str = DistributedBackend.GLOO,
        device: str | None = None,
        use_cuda: bool = False,
        require_cuda: bool = False,
    ) -> "DistributedConfig":
        """Leest rank-gegevens uit de standaard distributed environment."""
        values = os.environ if env is None else env
        return cls(
            backend=backend,
            world_size=_env_int(values, "WORLD_SIZE", 1),
            rank=_env_int(values, "RANK", 0),
            local_rank=_env_int(values, "LOCAL_RANK", 0),
            device=device,
            use_cuda=use_cuda,
            require_cuda=require_cuda,
            init_method=values.get("INIT_METHOD"),
            master_addr=values.get("MASTER_ADDR"),
            master_port=(
                _env_int(values, "MASTER_PORT", 0)
                if values.get("MASTER_PORT") is not None
                else None
            ),
        )


@dataclass(frozen=True)
class DistributedRuntimeInfo:
    """Veilige runtime-informatie zonder process group side effects."""

    distributed_available: bool
    initialized: bool
    backend: str
    backend_available: bool
    world_size: int
    rank: int
    local_rank: int
    is_distributed: bool
    cuda_available: bool
    cuda_device_count: int
    resolved_device: str | None = None
    warnings: tuple[str, ...] = field(default_factory=tuple)

    def to_dict(self) -> dict[str, object]:
        """Zet de runtime-info om naar JSON-vriendelijke data."""
        return {
            "distributed_available": self.distributed_available,
            "initialized": self.initialized,
            "backend": self.backend,
            "backend_available": self.backend_available,
            "world_size": self.world_size,
            "rank": self.rank,
            "local_rank": self.local_rank,
            "is_distributed": self.is_distributed,
            "cuda_available": self.cuda_available,
            "cuda_device_count": self.cuda_device_count,
            "resolved_device": self.resolved_device,
            "warnings": list(self.warnings),
        }


@dataclass(frozen=True)
class DistributedProcessGroupInfo:
    """Informatie over een actieve torch process group."""

    backend: str
    world_size: int
    rank: int
    initialized: bool
    init_method: str

    def to_dict(self) -> dict[str, object]:
        """Zet de process-group info om naar JSON-vriendelijke data."""
        return {
            "backend": self.backend,
            "world_size": self.world_size,
            "rank": self.rank,
            "initialized": self.initialized,
            "init_method": self.init_method,
        }


@dataclass(frozen=True)
class DistributedWorkerResult:
    """Resultaat van een lokale multiprocessing worker."""

    rank: int
    local_rank: int
    success: bool
    result: object | None = None
    error_code: str | None = None
    error_message: str | None = None
    exit_code: int | None = None

    def to_dict(self) -> dict[str, object]:
        """Zet het workerresultaat om naar simpele data."""
        return {
            "rank": self.rank,
            "local_rank": self.local_rank,
            "success": self.success,
            "result": self.result,
            "error_code": self.error_code,
            "error_message": self.error_message,
            "exit_code": self.exit_code,
        }


@dataclass(frozen=True)
class DistributedLaunchResult:
    """Resultaat van een lokale multiprocessing launch."""

    world_size: int
    workers: tuple[DistributedWorkerResult, ...]

    @property
    def success(self) -> bool:
        """Geeft aan of alle workers succesvol klaar waren."""
        return len(self.workers) == self.world_size and all(worker.success for worker in self.workers)

    def raise_for_errors(self) -> None:
        """Gooit een fout als een worker faalde."""
        for worker in self.workers:
            if not worker.success:
                raise DistributedError(
                    worker.error_code or "worker_failed",
                    worker.error_message or f"Distributed worker {worker.rank} failed",
                )
        if len(self.workers) != self.world_size:
            raise DistributedError(
                "launch_incomplete",
                "Not every distributed worker returned a result",
            )

    def to_dict(self) -> dict[str, object]:
        """Zet het launchresultaat om naar simpele data."""
        return {
            "world_size": self.world_size,
            "success": self.success,
            "workers": [worker.to_dict() for worker in self.workers],
        }


@dataclass(frozen=True)
class SingleGpuBoundaryInfo:
    """Eerlijke status voor lokale single-GPU distributed smoke tests."""

    status: str
    cuda_available: bool
    cuda_device_count: int
    requested_world_size: int
    local_rank: int
    can_run_single_gpu: bool
    requires_external_multi_gpu: bool
    device: str | None
    reason: str

    def to_dict(self) -> dict[str, object]:
        """Zet de single-GPU status om naar simpele data."""
        return {
            "status": self.status,
            "cuda_available": self.cuda_available,
            "cuda_device_count": self.cuda_device_count,
            "requested_world_size": self.requested_world_size,
            "local_rank": self.local_rank,
            "can_run_single_gpu": self.can_run_single_gpu,
            "requires_external_multi_gpu": self.requires_external_multi_gpu,
            "device": self.device,
            "reason": self.reason,
        }


@dataclass(frozen=True)
class FSDPCapabilityInfo:
    """Eerlijke FSDP-capability zonder een model te wrappen."""

    status: str
    fsdp_available: bool
    distributed_available: bool
    backend: str
    backend_available: bool
    cuda_available: bool
    cuda_device_count: int
    required_world_size: int
    can_run_locally: bool
    requires_external_multi_gpu: bool
    required_hardware: str
    test_command: str
    reason: str
    warnings: tuple[str, ...] = field(default_factory=tuple)

    def to_dict(self) -> dict[str, object]:
        """Zet de FSDP-status om naar simpele data."""
        return {
            "status": self.status,
            "fsdp_available": self.fsdp_available,
            "distributed_available": self.distributed_available,
            "backend": self.backend,
            "backend_available": self.backend_available,
            "cuda_available": self.cuda_available,
            "cuda_device_count": self.cuda_device_count,
            "required_world_size": self.required_world_size,
            "can_run_locally": self.can_run_locally,
            "requires_external_multi_gpu": self.requires_external_multi_gpu,
            "required_hardware": self.required_hardware,
            "test_command": self.test_command,
            "reason": self.reason,
            "warnings": list(self.warnings),
        }


@dataclass(frozen=True)
class FSDPWrapConfig:
    """Kleine FSDP wrap-instellingen zonder checkpointbeleid."""

    use_orig_params: bool = True
    sync_module_states: bool = False
    forward_prefetch: bool = False
    limit_all_gathers: bool = True

    def to_dict(self) -> dict[str, bool]:
        """Zet de wrap-config om naar simpele data."""
        return {
            "use_orig_params": self.use_orig_params,
            "sync_module_states": self.sync_module_states,
            "forward_prefetch": self.forward_prefetch,
            "limit_all_gathers": self.limit_all_gathers,
        }


@dataclass(frozen=True)
class FSDPWrapInfo:
    """Metadata over een expliciet gewrapt FSDP-model."""

    wrapper_type: str
    backend: str
    world_size: int
    rank: int
    local_rank: int
    device: str
    sharded_checkpointing: bool
    optimizer_state_handling: bool

    def to_dict(self) -> dict[str, object]:
        """Zet de wrap-info om naar simpele data."""
        return {
            "wrapper_type": self.wrapper_type,
            "backend": self.backend,
            "world_size": self.world_size,
            "rank": self.rank,
            "local_rank": self.local_rank,
            "device": self.device,
            "sharded_checkpointing": self.sharded_checkpointing,
            "optimizer_state_handling": self.optimizer_state_handling,
        }


@dataclass(frozen=True)
class FSDPWrappedModel:
    """Resultaat van expliciete FSDP wrapping."""

    model: object
    original_model: object
    wrap_config: FSDPWrapConfig
    info: FSDPWrapInfo


@dataclass(frozen=True)
class FSDPCheckpointPolicy:
    """Beleid voor toekomstige FSDP model- en optimizer-shards zonder writer."""

    state_dict_type: str = "sharded"
    rank_zero_manifest: bool = True
    per_rank_model_shards: bool = True
    optimizer_state_policy: str = "sharded"
    resume_policy: str = "rank_synchronized"
    artifact_handoff_policy: str = "rank_zero_metadata"
    atomic_manifest: bool = True
    shard_directory: str = "model-shards"
    optimizer_shard_directory: str = "optimizer-shards"
    artifact_handoff_directory: str = "artifact-handoff"
    manifest_file: str = "manifest.json"
    policy_format: str = FSDP_CHECKPOINT_POLICY_FORMAT
    policy_version: int = FSDP_CHECKPOINT_POLICY_VERSION

    def __post_init__(self) -> None:
        if self.policy_format != FSDP_CHECKPOINT_POLICY_FORMAT:
            raise DistributedError(
                "fsdp_checkpoint_policy_invalid",
                "FSDP checkpoint policy format is not supported",
            )
        if self.policy_version != FSDP_CHECKPOINT_POLICY_VERSION:
            raise DistributedError(
                "fsdp_checkpoint_policy_invalid",
                "FSDP checkpoint policy version is not supported",
            )
        if self.state_dict_type != "sharded":
            raise DistributedError(
                "fsdp_checkpoint_policy_invalid",
                "FSDP checkpoint policy only supports sharded state dictionaries",
            )
        if not self.rank_zero_manifest:
            raise DistributedError(
                "fsdp_checkpoint_policy_invalid",
                "FSDP checkpoint policy requires a rank-zero manifest",
            )
        if not self.per_rank_model_shards:
            raise DistributedError(
                "fsdp_checkpoint_policy_invalid",
                "FSDP checkpoint policy requires per-rank model shards",
            )
        if self.optimizer_state_policy not in {"sharded", "not_supported"}:
            raise DistributedError(
                "fsdp_checkpoint_policy_invalid",
                "FSDP optimizer-state policy must be sharded or not_supported",
            )
        if self.resume_policy not in {"rank_synchronized", "not_supported"}:
            raise DistributedError(
                "fsdp_checkpoint_policy_invalid",
                "FSDP resume policy must be rank_synchronized or not_supported",
            )
        if self.artifact_handoff_policy not in {"rank_zero_metadata", "not_supported"}:
            raise DistributedError(
                "fsdp_checkpoint_policy_invalid",
                "FSDP artifact handoff policy must be rank_zero_metadata or not_supported",
            )
        _validate_relative_policy_path("shard_directory", self.shard_directory)
        _validate_relative_policy_path(
            "optimizer_shard_directory",
            self.optimizer_shard_directory,
        )
        _validate_relative_policy_path(
            "artifact_handoff_directory",
            self.artifact_handoff_directory,
        )
        _validate_relative_policy_path("manifest_file", self.manifest_file)

    def to_dict(self) -> dict[str, object]:
        """Zet het beleid om naar simpele data."""
        return {
            "policy_format": self.policy_format,
            "policy_version": self.policy_version,
            "state_dict_type": self.state_dict_type,
            "rank_zero_manifest": self.rank_zero_manifest,
            "per_rank_model_shards": self.per_rank_model_shards,
            "optimizer_state_policy": self.optimizer_state_policy,
            "resume_policy": self.resume_policy,
            "artifact_handoff_policy": self.artifact_handoff_policy,
            "atomic_manifest": self.atomic_manifest,
            "shard_directory": self.shard_directory,
            "optimizer_shard_directory": self.optimizer_shard_directory,
            "artifact_handoff_directory": self.artifact_handoff_directory,
            "manifest_file": self.manifest_file,
        }


@dataclass(frozen=True)
class FSDPCheckpointPlan:
    """Rank-specifiek plan voor toekomstige FSDP checkpointbestanden."""

    policy: FSDPCheckpointPolicy
    wrapper_type: str
    backend: str
    world_size: int
    rank: int
    manifest_rank: int
    writes_manifest: bool
    writes_model_shard: bool
    manifest_path: str
    model_shard_path: str
    writes_optimizer_state: bool
    optimizer_shard_path: str | None
    resume_supported: bool
    requires_all_rank_resume: bool
    artifact_handoff_supported: bool
    artifact_handoff_rank: int
    writes_artifact_handoff_metadata: bool
    artifact_handoff_path: str | None
    runtime_validation_required: bool

    def to_dict(self) -> dict[str, object]:
        """Zet het plan om naar simpele data."""
        return {
            "policy": self.policy.to_dict(),
            "wrapper_type": self.wrapper_type,
            "backend": self.backend,
            "world_size": self.world_size,
            "rank": self.rank,
            "manifest_rank": self.manifest_rank,
            "writes_manifest": self.writes_manifest,
            "writes_model_shard": self.writes_model_shard,
            "manifest_path": self.manifest_path,
            "model_shard_path": self.model_shard_path,
            "writes_optimizer_state": self.writes_optimizer_state,
            "optimizer_shard_path": self.optimizer_shard_path,
            "resume_supported": self.resume_supported,
            "requires_all_rank_resume": self.requires_all_rank_resume,
            "artifact_handoff_supported": self.artifact_handoff_supported,
            "artifact_handoff_rank": self.artifact_handoff_rank,
            "writes_artifact_handoff_metadata": self.writes_artifact_handoff_metadata,
            "artifact_handoff_path": self.artifact_handoff_path,
            "runtime_validation_required": self.runtime_validation_required,
        }


@dataclass(frozen=True)
class ExternalValidationTarget:
    """Provider-onafhankelijke cloudvalidatie voor hardware die lokaal ontbreekt."""

    target_id: str
    name: str
    category: str
    implementation_status: str
    local_runtime_status: str
    external_runtime_status: str
    required_hardware: str
    command: str
    expected_result: str
    release_gate: str
    notes: tuple[str, ...] = ()

    def __post_init__(self) -> None:
        if not self.target_id or not self.target_id.replace("_", "").replace("-", "").isalnum():
            raise DistributedError(
                "external_validation_target_invalid",
                "target_id must be a non-empty safe identifier",
            )
        if not self.name.strip():
            raise DistributedError(
                "external_validation_target_invalid",
                "validation target name must not be empty",
            )
        if not self.command.startswith("python -m pytest "):
            raise DistributedError(
                "external_validation_target_invalid",
                "validation command must be a pytest command",
            )

    def to_dict(self) -> dict[str, object]:
        """Zet het validatiedoel om naar JSON-vriendelijke data."""
        return {
            "target_id": self.target_id,
            "name": self.name,
            "category": self.category,
            "implementation_status": self.implementation_status,
            "local_runtime_status": self.local_runtime_status,
            "external_runtime_status": self.external_runtime_status,
            "required_hardware": self.required_hardware,
            "command": self.command,
            "expected_result": self.expected_result,
            "release_gate": self.release_gate,
            "notes": list(self.notes),
        }


WorkerFunction = Callable[[DistributedConfig], object]


def get_distributed_info(config: DistributedConfig | None = None) -> DistributedRuntimeInfo:
    """Inspecteert torch.distributed zonder een process group te starten."""
    cfg = config or DistributedConfig()
    torch = _import_torch()
    dist = getattr(torch, "distributed", None)
    distributed_available = bool(dist is not None and dist.is_available())
    initialized = bool(distributed_available and dist.is_initialized())
    backend_available = _backend_available(dist, cfg.backend_name, distributed_available)
    cuda_available = bool(torch.cuda.is_available())
    cuda_device_count = int(torch.cuda.device_count()) if cuda_available else 0
    warnings: list[str] = []

    world_size = cfg.world_size
    rank = cfg.rank
    if initialized:
        world_size = int(dist.get_world_size())
        rank = int(dist.get_rank())

    try:
        resolved_device = resolve_process_device(cfg)
    except DistributedError as exc:
        resolved_device = None
        warnings.append(exc.code)

    if cfg.backend_name == DistributedBackend.NCCL.value and not backend_available:
        warnings.append("backend_unavailable")
    if cfg.use_cuda and not cuda_available:
        warnings.append("cuda_unavailable")

    return DistributedRuntimeInfo(
        distributed_available=distributed_available,
        initialized=initialized,
        backend=cfg.backend_name,
        backend_available=backend_available,
        world_size=world_size,
        rank=rank,
        local_rank=cfg.local_rank,
        is_distributed=world_size > 1,
        cuda_available=cuda_available,
        cuda_device_count=cuda_device_count,
        resolved_device=resolved_device,
        warnings=tuple(dict.fromkeys(warnings)),
    )


def validate_distributed_config(config: DistributedConfig) -> DistributedRuntimeInfo:
    """Controleert of de gevraagde runtime lokaal mogelijk lijkt."""
    info = get_distributed_info(config)
    if not info.distributed_available:
        raise DistributedError(
            "distributed_unavailable",
            "torch.distributed is not available in this environment",
        )
    if not info.backend_available:
        raise DistributedError(
            "distributed_backend_unavailable",
            f"Distributed backend '{config.backend_name}' is not available",
        )
    resolve_process_device(config)
    return info


def validate_distributed_setup(config: DistributedConfig) -> DistributedValidationResult:
    """Valideert distributed intentie zonder process groups te starten."""
    info = get_distributed_info(config)
    errors: list[DistributedValidationIssue] = []
    warnings: list[DistributedValidationIssue] = []
    requires_process_group = config.world_size > 1
    requires_cuda = _config_requires_cuda(config)
    requires_multi_gpu = requires_process_group and requires_cuda

    if not info.distributed_available:
        errors.append(
            _validation_error(
                "distributed_unavailable",
                "torch.distributed is not available in this environment",
            )
        )
    if not info.backend_available:
        errors.append(
            _validation_error(
                "distributed_backend_unavailable",
                f"Distributed backend '{config.backend_name}' is not available",
            )
        )
    if requires_process_group:
        _validate_rendezvous(config, errors, warnings)
    else:
        _warn_unused_rendezvous(config, warnings)
    if config.local_rank >= config.world_size:
        errors.append(
            _validation_error(
                "local_rank_invalid",
                "local_rank must be smaller than world_size for this local runtime",
            )
        )
    if config.device == "cpu" and (config.use_cuda or config.require_cuda):
        errors.append(
            _validation_error(
                "device_conflict",
                "CUDA was requested but the configured device is CPU",
            )
        )
    if requires_cuda:
        _validate_cuda_request(config, info, errors, warnings)
    if config.backend_name == DistributedBackend.GLOO.value and requires_cuda:
        warnings.append(
            _validation_warning(
                "nccl_recommended_for_cuda",
                "NCCL is recommended for CUDA distributed training when available",
            )
        )

    return DistributedValidationResult(
        valid=not errors,
        errors=tuple(errors),
        warnings=tuple(warnings),
        runtime=info,
        requires_process_group=requires_process_group,
        requires_cuda=requires_cuda,
        requires_multi_gpu=requires_multi_gpu,
    )


def init_process_group(config: DistributedConfig) -> DistributedProcessGroupInfo:
    """Start een torch process group met vooraf gevalideerde instellingen."""
    result = validate_distributed_setup(config)
    result.raise_for_errors()
    torch = _import_torch()
    dist = torch.distributed
    if dist.is_initialized():
        raise DistributedError(
            "process_group_already_initialized",
            "A torch distributed process group is already initialized",
        )
    init_method = _resolve_init_method(config)
    try:
        dist.init_process_group(
            backend=config.backend_name,
            init_method=init_method,
            world_size=config.world_size,
            rank=config.rank,
            timeout=timedelta(seconds=float(config.timeout_seconds)),
        )
    except Exception as exc:
        raise DistributedError(
            "process_group_init_failed",
            "Failed to initialize the torch distributed process group",
        ) from exc

    return DistributedProcessGroupInfo(
        backend=str(dist.get_backend()),
        world_size=int(dist.get_world_size()),
        rank=int(dist.get_rank()),
        initialized=True,
        init_method=init_method,
    )


def destroy_process_group() -> bool:
    """Sluit de actieve torch process group als die bestaat."""
    torch = _import_torch()
    dist = torch.distributed
    if not dist.is_available() or not dist.is_initialized():
        return False
    dist.destroy_process_group()
    return True


@contextmanager
def process_group_context(config: DistributedConfig) -> Iterator[DistributedProcessGroupInfo]:
    """Start en sluit een process group rond een klein runtime-blok."""
    info = init_process_group(config)
    try:
        yield info
    finally:
        destroy_process_group()


def launch_processes(
    config: DistributedConfig,
    worker: WorkerFunction,
    *,
    args: Sequence[object] = (),
    kwargs: Mapping[str, object] | None = None,
    initialize_process_group: bool = False,
    max_processes: int = 8,
    join_timeout_seconds: float | None = None,
    start_method: str = "spawn",
) -> DistributedLaunchResult:
    """Start lokale workerprocessen en verzamelt hun resultaten."""
    _validate_launch_request(config, max_processes=max_processes)
    launch_config = _prepare_launch_config(config)
    ctx = _multiprocessing_context(start_method)
    result_queue = ctx.Queue()
    worker_kwargs = dict(kwargs or {})
    processes = []
    for rank in range(launch_config.world_size):
        worker_config = _worker_config(launch_config, rank)
        process = ctx.Process(
            target=_launch_worker_entry,
            args=(
                result_queue,
                worker,
                worker_config,
                tuple(args),
                worker_kwargs,
                initialize_process_group,
            ),
        )
        process.start()
        processes.append((rank, worker_config.local_rank, process))

    timeout = _join_timeout(config, join_timeout_seconds)
    timed_out: set[int] = set()
    for _rank, _local_rank, process in processes:
        process.join(timeout)
        if process.is_alive():
            timed_out.add(_rank)
            process.terminate()
            process.join(5)

    results_by_rank: dict[int, DistributedWorkerResult] = {}
    while not result_queue.empty():
        result = result_queue.get()
        if isinstance(result, DistributedWorkerResult):
            results_by_rank[result.rank] = result

    for rank, local_rank, process in processes:
        if rank not in results_by_rank:
            code = "worker_timeout" if rank in timed_out else "worker_failed"
            message = (
                f"Distributed worker {rank} timed out"
                if rank in timed_out
                else f"Distributed worker {rank} exited with code {process.exitcode}"
            )
            results_by_rank[rank] = DistributedWorkerResult(
                rank=rank,
                local_rank=local_rank,
                success=False,
                error_code=code,
                error_message=message,
                exit_code=process.exitcode,
            )
        else:
            existing = results_by_rank[rank]
            results_by_rank[rank] = DistributedWorkerResult(
                rank=existing.rank,
                local_rank=existing.local_rank,
                success=existing.success,
                result=existing.result,
                error_code=existing.error_code,
                error_message=existing.error_message,
                exit_code=process.exitcode,
            )

    return DistributedLaunchResult(
        world_size=launch_config.world_size,
        workers=tuple(results_by_rank[rank] for rank in sorted(results_by_rank)),
    )


def inspect_single_gpu_boundary(config: DistributedConfig | None = None) -> SingleGpuBoundaryInfo:
    """Inspecteert of lokale single-GPU distributed smoke veilig kan draaien."""
    cfg = config or DistributedConfig(world_size=1, local_rank=0, device="cuda", use_cuda=True)
    torch = _import_torch()
    cuda_available = bool(torch.cuda.is_available())
    cuda_device_count = int(torch.cuda.device_count()) if cuda_available else 0
    requires_external_multi_gpu = cfg.world_size > 1
    if requires_external_multi_gpu:
        return SingleGpuBoundaryInfo(
            status="external_multi_gpu_required",
            cuda_available=cuda_available,
            cuda_device_count=cuda_device_count,
            requested_world_size=cfg.world_size,
            local_rank=cfg.local_rank,
            can_run_single_gpu=False,
            requires_external_multi_gpu=True,
            device=None,
            reason="world_size greater than one requires external multi-GPU validation",
        )
    if not cuda_available:
        return SingleGpuBoundaryInfo(
            status="hardware_unavailable",
            cuda_available=False,
            cuda_device_count=0,
            requested_world_size=cfg.world_size,
            local_rank=cfg.local_rank,
            can_run_single_gpu=False,
            requires_external_multi_gpu=False,
            device=None,
            reason="CUDA is not available in this environment",
        )
    if cfg.local_rank >= cuda_device_count:
        return SingleGpuBoundaryInfo(
            status="hardware_unavailable",
            cuda_available=True,
            cuda_device_count=cuda_device_count,
            requested_world_size=cfg.world_size,
            local_rank=cfg.local_rank,
            can_run_single_gpu=False,
            requires_external_multi_gpu=False,
            device=None,
            reason=f"CUDA local_rank {cfg.local_rank} is not available",
        )
    return SingleGpuBoundaryInfo(
        status="available",
        cuda_available=True,
        cuda_device_count=cuda_device_count,
        requested_world_size=cfg.world_size,
        local_rank=cfg.local_rank,
        can_run_single_gpu=True,
        requires_external_multi_gpu=False,
        device=f"cuda:{cfg.local_rank}",
        reason="Single-GPU CUDA distributed smoke can run locally",
    )


def validate_single_gpu_boundary(config: DistributedConfig | None = None) -> SingleGpuBoundaryInfo:
    """Geeft single-GPU status terug of faalt met een duidelijke reden."""
    info = inspect_single_gpu_boundary(config)
    if not info.can_run_single_gpu:
        code = (
            "external_multi_gpu_required"
            if info.requires_external_multi_gpu
            else "single_gpu_unavailable"
        )
        raise DistributedError(code, info.reason)
    return info


def inspect_fsdp_capability(
    config: DistributedConfig | None = None,
    *,
    required_world_size: int = 2,
) -> FSDPCapabilityInfo:
    """Inspecteert FSDP-capability zonder model wrapping of process group."""
    if not isinstance(required_world_size, int) or required_world_size < 2:
        raise DistributedError(
            "fsdp_config_invalid",
            "required_world_size must be an integer greater than one",
        )
    cfg = config or DistributedConfig(
        backend=DistributedBackend.NCCL,
        world_size=required_world_size,
        device="cuda",
        use_cuda=True,
        require_cuda=True,
    )
    requested_world_size = max(required_world_size, cfg.world_size)
    torch = _import_torch()
    dist = getattr(torch, "distributed", None)
    distributed_available = bool(dist is not None and dist.is_available())
    backend_available = _backend_available(dist, cfg.backend_name, distributed_available)
    cuda_available = bool(torch.cuda.is_available())
    cuda_device_count = int(torch.cuda.device_count()) if cuda_available else 0
    fsdp_available = _fsdp_available()
    warnings: list[str] = []

    if cfg.backend_name != DistributedBackend.NCCL.value:
        warnings.append("nccl_required_for_external_fsdp")

    status = "available"
    reason = "FSDP capability requirements are available for the requested local runtime"
    can_run_locally = True
    requires_external_multi_gpu = False

    if not fsdp_available:
        status = "fsdp_unavailable"
        reason = "PyTorch FSDP is not importable in this environment"
        can_run_locally = False
    elif not distributed_available:
        status = "distributed_unavailable"
        reason = "torch.distributed is not available in this environment"
        can_run_locally = False
    elif not cuda_available:
        status = "hardware_unavailable"
        reason = "FSDP external validation requires CUDA, but CUDA is not available"
        can_run_locally = False
        requires_external_multi_gpu = True
    elif cuda_device_count < requested_world_size:
        status = "hardware_unavailable"
        reason = (
            f"FSDP external validation requires at least {requested_world_size} CUDA devices, "
            f"but {cuda_device_count} are available"
        )
        can_run_locally = False
        requires_external_multi_gpu = True
    elif cfg.backend_name != DistributedBackend.NCCL.value:
        status = "backend_unsupported"
        reason = "FSDP multi-GPU CUDA validation requires the NCCL backend"
        can_run_locally = False
    elif not backend_available:
        status = "backend_unavailable"
        reason = "FSDP multi-GPU CUDA validation requires an available NCCL backend"
        can_run_locally = False

    return FSDPCapabilityInfo(
        status=status,
        fsdp_available=fsdp_available,
        distributed_available=distributed_available,
        backend=cfg.backend_name,
        backend_available=backend_available,
        cuda_available=cuda_available,
        cuda_device_count=cuda_device_count,
        required_world_size=requested_world_size,
        can_run_locally=can_run_locally,
        requires_external_multi_gpu=requires_external_multi_gpu,
        required_hardware="At least two CUDA GPUs with PyTorch FSDP and NCCL support",
        test_command='python -m pytest tests/gpu -v -m "multi_gpu and fsdp"',
        reason=reason,
        warnings=tuple(dict.fromkeys(warnings)),
    )


def validate_fsdp_capability(
    config: DistributedConfig | None = None,
    *,
    required_world_size: int = 2,
) -> FSDPCapabilityInfo:
    """Geeft FSDP status terug of faalt met een duidelijke reden."""
    info = inspect_fsdp_capability(config, required_world_size=required_world_size)
    if not info.can_run_locally:
        raise DistributedError(f"fsdp_{info.status}", info.reason)
    return info


def wrap_fsdp_model(
    model: object,
    config: DistributedConfig,
    *,
    wrap_config: FSDPWrapConfig | None = None,
) -> FSDPWrappedModel:
    """Wikkelt een model expliciet in FSDP na strikte runtime-checks."""
    if config.world_size < 2:
        raise DistributedError(
            "fsdp_world_size_invalid",
            "FSDP model wrapping requires world_size greater than one",
        )
    capability = validate_fsdp_capability(config, required_world_size=config.world_size)
    torch = _import_torch()
    dist = torch.distributed
    if not dist.is_initialized():
        raise DistributedError(
            "fsdp_process_group_required",
            "FSDP model wrapping requires an initialized torch distributed process group",
        )
    if int(dist.get_world_size()) != config.world_size:
        raise DistributedError(
            "fsdp_process_group_mismatch",
            "FSDP world_size does not match the active process group",
        )
    if int(dist.get_rank()) != config.rank:
        raise DistributedError(
            "fsdp_process_group_mismatch",
            "FSDP rank does not match the active process group",
        )

    resolved_device = resolve_process_device(config)
    if hasattr(model, "to"):
        model.to(resolved_device)
    fsdp_class = _fsdp_class()
    options = wrap_config or FSDPWrapConfig()
    kwargs = options.to_dict()
    if resolved_device.startswith("cuda:"):
        kwargs["device_id"] = _parse_cuda_index(resolved_device)
    try:
        wrapped = fsdp_class(model, **kwargs)
    except Exception as exc:
        raise DistributedError(
            "fsdp_wrap_failed",
            "Failed to wrap the model with PyTorch FSDP",
        ) from exc

    return FSDPWrappedModel(
        model=wrapped,
        original_model=model,
        wrap_config=options,
        info=FSDPWrapInfo(
            wrapper_type="FullyShardedDataParallel",
            backend=capability.backend,
            world_size=config.world_size,
            rank=config.rank,
            local_rank=config.local_rank,
            device=resolved_device,
            sharded_checkpointing=False,
            optimizer_state_handling=False,
        ),
    )


def plan_fsdp_sharded_checkpoint(
    wrapped: FSDPWrappedModel | FSDPWrapInfo,
    policy: FSDPCheckpointPolicy | None = None,
) -> FSDPCheckpointPlan:
    """Maakt een rank-specifiek FSDP checkpointplan zonder bestanden te schrijven."""
    info = _fsdp_wrap_info(wrapped)
    selected_policy = policy or FSDPCheckpointPolicy()
    _validate_fsdp_checkpoint_info(info)
    shard_name = f"rank-{info.rank:05d}-of-{info.world_size:05d}.pt"
    writes_optimizer_state = selected_policy.optimizer_state_policy == "sharded"
    optimizer_shard_path = (
        f"{selected_policy.optimizer_shard_directory}/{shard_name}"
        if writes_optimizer_state
        else None
    )
    resume_supported = selected_policy.resume_policy == "rank_synchronized"
    artifact_handoff_supported = (
        selected_policy.artifact_handoff_policy == "rank_zero_metadata"
    )
    artifact_handoff_rank = 0
    artifact_handoff_path = (
        f"{selected_policy.artifact_handoff_directory}/rank-zero-artifact.json"
        if artifact_handoff_supported
        else None
    )
    return FSDPCheckpointPlan(
        policy=selected_policy,
        wrapper_type=info.wrapper_type,
        backend=info.backend,
        world_size=info.world_size,
        rank=info.rank,
        manifest_rank=0,
        writes_manifest=info.rank == 0,
        writes_model_shard=True,
        manifest_path=selected_policy.manifest_file,
        model_shard_path=f"{selected_policy.shard_directory}/{shard_name}",
        writes_optimizer_state=writes_optimizer_state,
        optimizer_shard_path=optimizer_shard_path,
        resume_supported=resume_supported,
        requires_all_rank_resume=resume_supported,
        artifact_handoff_supported=artifact_handoff_supported,
        artifact_handoff_rank=artifact_handoff_rank,
        writes_artifact_handoff_metadata=(
            artifact_handoff_supported and info.rank == artifact_handoff_rank
        ),
        artifact_handoff_path=artifact_handoff_path,
        runtime_validation_required=True,
    )


def validate_fsdp_checkpoint_policy(
    wrapped: FSDPWrappedModel | FSDPWrapInfo,
    policy: FSDPCheckpointPolicy | None = None,
) -> FSDPCheckpointPlan:
    """Valideert FSDP checkpointbeleid en geeft het plan terug."""
    return plan_fsdp_sharded_checkpoint(wrapped, policy)


def get_external_multi_gpu_validation_matrix() -> tuple[ExternalValidationTarget, ...]:
    """Geeft de provider-onafhankelijke multi-GPU release gates terug."""
    return (
        ExternalValidationTarget(
            target_id="cuda_bf16_modern_gpu",
            name="CUDA BF16 runtime on modern GPU",
            category="mixed_precision",
            implementation_status="Implemented",
            local_runtime_status="Hardware unsupported locally for native BF16 acceleration",
            external_runtime_status="Pending cloud runtime validation",
            required_hardware="One CUDA GPU where torch.cuda.is_bf16_supported() is true",
            command='python -m pytest tests/gpu -v -m "cuda and bf16"',
            expected_result="BF16 training, evaluation, checkpoint, and resume tests pass without FP32 emulation",
            release_gate="Required before claiming native CUDA BF16 runtime verified",
            notes=(
                "GTX 1050 Ti local checks do not prove native BF16 acceleration.",
                "Capability must be detected with torch.cuda.is_bf16_supported().",
            ),
        ),
        ExternalValidationTarget(
            target_id="two_gpu_ddp_runtime",
            name="Two-GPU DDP runtime",
            category="ddp",
            implementation_status="Implemented",
            local_runtime_status="Hardware unavailable locally",
            external_runtime_status="Pending external runtime validation",
            required_hardware="At least two CUDA GPUs with torch.distributed and NCCL available",
            command='python -m pytest tests/gpu -v -m "multi_gpu and distributed"',
            expected_result="Two CUDA ranks initialize, train, save a rank-zero checkpoint, resume on new objects, synchronize gradients, and exit cleanly",
            release_gate="Required before claiming DDP or multi-GPU training verified",
            notes=(
                "Single-GPU smoke and CPU process groups do not count as two-GPU DDP validation.",
                "The gate skips unless CUDA has at least two devices and NCCL is available.",
            ),
        ),
        ExternalValidationTarget(
            target_id="multi_gpu_fp16_runtime",
            name="Multi-GPU FP16 mixed precision",
            category="mixed_precision",
            implementation_status="Not implemented",
            local_runtime_status="Hardware unavailable locally",
            external_runtime_status="Pending after DDP implementation exists",
            required_hardware="At least two CUDA GPUs with FP16 support",
            command='python -m pytest tests/gpu -v -m "multi_gpu and fp16"',
            expected_result="FP16 autocast and gradient scaling run across real GPU ranks with finite loss",
            release_gate="Required before claiming multi-GPU FP16 verified",
        ),
        ExternalValidationTarget(
            target_id="multi_gpu_bf16_runtime",
            name="Multi-GPU BF16 mixed precision",
            category="mixed_precision",
            implementation_status="Not implemented",
            local_runtime_status="Hardware unavailable locally",
            external_runtime_status="Pending after DDP implementation exists",
            required_hardware="At least two CUDA GPUs where torch.cuda.is_bf16_supported() is true",
            command='python -m pytest tests/gpu -v -m "multi_gpu and bf16"',
            expected_result="BF16 distributed training and evaluation run on native BF16-capable GPUs",
            release_gate="Required before claiming multi-GPU BF16 verified",
        ),
        ExternalValidationTarget(
            target_id="distributed_checkpoint_resume",
            name="Distributed checkpoint and resume",
            category="checkpointing",
            implementation_status="Implemented",
            local_runtime_status="Hardware unavailable locally",
            external_runtime_status="Pending external runtime validation",
            required_hardware="At least two CUDA GPUs with torch.distributed and NCCL available",
            command='python -m pytest tests/gpu -v -m "multi_gpu and checkpoint"',
            expected_result="Distributed checkpoint saves from rank zero, loads on new CUDA trainer objects, and resumes with matching step state",
            release_gate="Required before claiming distributed checkpoint or resume support",
        ),
        ExternalValidationTarget(
            target_id="fsdp_runtime",
            name="FSDP runtime",
            category="fsdp",
            implementation_status="Implemented boundary and policy",
            local_runtime_status="Hardware unavailable locally",
            external_runtime_status="Pending after external FSDP runtime validation exists",
            required_hardware="At least two CUDA GPUs with PyTorch FSDP support",
            command='python -m pytest tests/gpu -v -m "multi_gpu and fsdp"',
            expected_result="FSDP wraps a tiny model, shards parameters, trains, checkpoints, and resumes",
            release_gate="Required before claiming FSDP verified",
            notes=(
                "FSDP config checks and explicit model wrapping boundary exist.",
                "Sharded model, optimizer-state, resume, and artifact handoff policies exist.",
                "No shard files are written yet and real runtime validation remains planned.",
            ),
        ),
        ExternalValidationTarget(
            target_id="flash_attention_newer_gpu",
            name="Flash Attention and newer-GPU optimizations",
            category="optimization",
            implementation_status="Not implemented",
            local_runtime_status="Hardware unsupported locally",
            external_runtime_status="Pending after optimization backend is selected",
            required_hardware="CUDA GPU and backend combination that officially supports the selected optimization",
            command='python -m pytest tests/gpu -v -m "cuda and optimization"',
            expected_result="Optimization backend is capability-detected, produces valid outputs, and falls back clearly when unavailable",
            release_gate="Required before claiming Flash Attention or newer-GPU optimization verified",
            notes=(
                "Do not infer support from GPU name alone.",
                "Use the selected backend's official capability check.",
            ),
        ),
    )


def resolve_process_device(config: DistributedConfig | None = None) -> str:
    """Bepaalt het apparaat voor dit proces zonder stille CUDA fallback."""
    cfg = config or DistributedConfig()
    requested = cfg.device or ("cuda" if cfg.use_cuda or cfg.require_cuda else "cpu")
    if requested == "auto":
        requested = "cuda" if cfg.use_cuda or cfg.require_cuda else "cpu"
    if requested == "cpu":
        if cfg.require_cuda:
            raise DistributedError(
                "device_unavailable",
                "CUDA was required but the configured device is CPU",
            )
        return "cpu"
    if requested == "cuda":
        return _resolve_cuda_device(cfg.local_rank)
    if requested.startswith("cuda:"):
        index = _parse_cuda_index(requested)
        return _resolve_cuda_device(index)
    raise DistributedError("device_invalid", "device must be cpu, cuda, cuda:<index>, or auto")


def build_distributed_env(config: DistributedConfig) -> dict[str, str]:
    """Maakt alleen de standaard rank-omgeving voor een toekomstige launcher."""
    env = {
        "RANK": str(config.rank),
        "WORLD_SIZE": str(config.world_size),
        "LOCAL_RANK": str(config.local_rank),
    }
    if config.master_addr:
        env["MASTER_ADDR"] = config.master_addr
    if config.master_port is not None:
        env["MASTER_PORT"] = str(config.master_port)
    return env


def is_distributed_available() -> bool:
    """Geeft aan of torch.distributed importeerbaar en beschikbaar is."""
    torch = _import_torch()
    dist = getattr(torch, "distributed", None)
    return bool(dist is not None and dist.is_available())


def is_distributed_initialized() -> bool:
    """Geeft aan of er al een process group actief is."""
    torch = _import_torch()
    dist = getattr(torch, "distributed", None)
    return bool(dist is not None and dist.is_available() and dist.is_initialized())


def _fsdp_available() -> bool:
    try:
        import importlib

        importlib.import_module("torch.distributed.fsdp")
    except Exception:
        return False
    return True


def _fsdp_class():
    try:
        import importlib

        module = importlib.import_module("torch.distributed.fsdp")
        return module.FullyShardedDataParallel
    except Exception as exc:
        raise DistributedError(
            "fsdp_unavailable",
            "PyTorch FSDP is not importable in this environment",
        ) from exc


def _fsdp_wrap_info(wrapped: FSDPWrappedModel | FSDPWrapInfo) -> FSDPWrapInfo:
    if isinstance(wrapped, FSDPWrappedModel):
        return wrapped.info
    if isinstance(wrapped, FSDPWrapInfo):
        return wrapped
    raise DistributedError(
        "fsdp_checkpoint_policy_invalid",
        "FSDP checkpoint policy requires FSDP wrap metadata",
    )


def _validate_fsdp_checkpoint_info(info: FSDPWrapInfo) -> None:
    if info.wrapper_type != "FullyShardedDataParallel":
        raise DistributedError(
            "fsdp_checkpoint_policy_invalid",
            "FSDP checkpoint policy requires a FullyShardedDataParallel wrapper",
        )
    if info.world_size < 2:
        raise DistributedError(
            "fsdp_checkpoint_policy_invalid",
            "FSDP sharded checkpoint policy requires world_size greater than one",
        )
    if info.rank < 0 or info.rank >= info.world_size:
        raise DistributedError(
            "fsdp_checkpoint_policy_invalid",
            "FSDP checkpoint rank must be within world_size",
        )


def _validate_relative_policy_path(name: str, value: str) -> None:
    if not isinstance(value, str) or not value.strip():
        raise DistributedError(
            "fsdp_checkpoint_policy_invalid",
            f"{name} must be a non-empty relative path",
        )
    normalized = value.replace("\\", "/")
    parts = [part for part in normalized.split("/") if part]
    if normalized.startswith("/") or ":" in normalized or ".." in parts:
        raise DistributedError(
            "fsdp_checkpoint_policy_invalid",
            f"{name} must be a safe relative path",
        )


def _import_torch():
    try:
        import torch
    except Exception as exc:  # pragma: no cover - torch is a core dependency
        raise DistributedError(
            "distributed_dependency_missing",
            "PyTorch is required for distributed runtime inspection",
        ) from exc
    return torch


def _backend_available(dist, backend: str, distributed_available: bool) -> bool:
    if not distributed_available:
        return False
    if hasattr(dist, "is_backend_available"):
        return bool(dist.is_backend_available(backend))
    return backend == DistributedBackend.GLOO.value


def _coerce_backend(value: DistributedBackend | str) -> DistributedBackend:
    if isinstance(value, DistributedBackend):
        return value
    try:
        return DistributedBackend(str(value))
    except ValueError as exc:
        raise DistributedError(
            "distributed_config_invalid",
            "backend must be gloo or nccl",
        ) from exc


def _validate_positive_int(name: str, value: int) -> None:
    if not isinstance(value, int) or value <= 0:
        raise DistributedError("distributed_config_invalid", f"{name} must be greater than zero")


def _validate_non_negative_int(name: str, value: int) -> None:
    if not isinstance(value, int) or value < 0:
        raise DistributedError("distributed_config_invalid", f"{name} must be zero or greater")


def _int_value(value: object, name: str) -> int:
    try:
        return int(value)
    except (TypeError, ValueError) as exc:
        raise DistributedError("distributed_config_invalid", f"{name} must be an integer") from exc


def _optional_str(value: object) -> str | None:
    if value is None:
        return None
    return str(value)


def _env_int(env: Mapping[str, str], name: str, default: int) -> int:
    if name not in env:
        return default
    return _int_value(env[name], name)


def _validate_device_name(device: str) -> None:
    if device in {"auto", "cpu", "cuda"}:
        return
    if device.startswith("cuda:"):
        _parse_cuda_index(device)
        return
    raise DistributedError("distributed_config_invalid", "device must be cpu, cuda, cuda:<index>, or auto")


def _parse_cuda_index(device: str) -> int:
    try:
        index = int(device.split(":", 1)[1])
    except (IndexError, ValueError) as exc:
        raise DistributedError("device_invalid", "CUDA device index must be an integer") from exc
    if index < 0:
        raise DistributedError("device_invalid", "CUDA device index must be zero or greater")
    return index


def _resolve_cuda_device(index: int) -> str:
    torch = _import_torch()
    if not torch.cuda.is_available():
        raise DistributedError("device_unavailable", "CUDA is not available in this environment")
    device_count = int(torch.cuda.device_count())
    if index >= device_count:
        raise DistributedError(
            "device_unavailable",
            f"CUDA device index {index} is not available",
        )
    return f"cuda:{index}"


def _is_safe_init_method(value: str) -> bool:
    return value.startswith(("env://", "tcp://", "file://"))


def _resolve_init_method(config: DistributedConfig) -> str:
    if config.init_method:
        return config.init_method
    if config.master_addr and config.master_port is not None:
        method = f"tcp://{config.master_addr}:{config.master_port}"
        # Windows CUDA wheels can request libuv even when the wheel lacks it.
        # Voor ArcLM-gemaakte rendezvous zetten we dat expliciet uit.
        if os.name == "nt":
            method = f"{method}?use_libuv=0"
        return method
    raise DistributedError(
        "process_group_rendezvous_missing",
        "init_method or master_addr/master_port is required to initialize a process group",
    )


def _multiprocessing_context(start_method: str):
    try:
        import multiprocessing

        return multiprocessing.get_context(start_method)
    except ValueError as exc:
        raise DistributedError(
            "launch_start_method_invalid",
            "start_method is not supported by multiprocessing",
        ) from exc


def _validate_launch_request(config: DistributedConfig, *, max_processes: int) -> None:
    if max_processes <= 0:
        raise DistributedError("launch_config_invalid", "max_processes must be greater than zero")
    if config.world_size > max_processes:
        raise DistributedError(
            "launch_too_many_processes",
            "world_size is larger than max_processes",
        )
    if config.world_size < 1:
        raise DistributedError("launch_config_invalid", "world_size must be greater than zero")
    if config.rank != 0:
        raise DistributedError(
            "launch_config_invalid",
            "launcher config rank must be zero",
        )


def _prepare_launch_config(config: DistributedConfig) -> DistributedConfig:
    master_addr = config.master_addr or "127.0.0.1"
    master_port = config.master_port or _find_free_port()
    return DistributedConfig(
        backend=config.backend,
        world_size=config.world_size,
        rank=0,
        local_rank=0,
        device=config.device,
        use_cuda=config.use_cuda,
        require_cuda=config.require_cuda,
        init_method=config.init_method,
        master_addr=master_addr,
        master_port=master_port,
        timeout_seconds=config.timeout_seconds,
    )


def _worker_config(config: DistributedConfig, rank: int) -> DistributedConfig:
    return DistributedConfig(
        backend=config.backend,
        world_size=config.world_size,
        rank=rank,
        local_rank=rank,
        device=config.device,
        use_cuda=config.use_cuda,
        require_cuda=config.require_cuda,
        init_method=config.init_method,
        master_addr=config.master_addr,
        master_port=config.master_port,
        timeout_seconds=config.timeout_seconds,
    )


def _launch_worker_entry(
    result_queue: "Queue[DistributedWorkerResult]",
    worker: WorkerFunction,
    config: DistributedConfig,
    args: tuple[object, ...],
    kwargs: dict[str, object],
    initialize_process_group: bool,
) -> None:
    try:
        if initialize_process_group:
            with process_group_context(config):
                result = worker(config, *args, **kwargs)
        else:
            result = worker(config, *args, **kwargs)
        result_queue.put(
            DistributedWorkerResult(
                rank=config.rank,
                local_rank=config.local_rank,
                success=True,
                result=result,
            )
        )
    except DistributedError as exc:
        result_queue.put(
            DistributedWorkerResult(
                rank=config.rank,
                local_rank=config.local_rank,
                success=False,
                error_code=exc.code,
                error_message=str(exc),
            )
        )
    except Exception as exc:  # pragma: no cover - exercised from subprocess tests
        result_queue.put(
            DistributedWorkerResult(
                rank=config.rank,
                local_rank=config.local_rank,
                success=False,
                error_code="worker_failed",
                error_message=f"{exc}\n{traceback.format_exc(limit=3)}",
            )
        )


def _join_timeout(config: DistributedConfig, override: float | None) -> float:
    if override is not None:
        if override <= 0:
            raise DistributedError("launch_config_invalid", "join_timeout_seconds must be greater than zero")
        return float(override)
    return max(5.0, float(config.timeout_seconds) + 5.0)


def _find_free_port() -> int:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.bind(("127.0.0.1", 0))
        return int(sock.getsockname()[1])


def _config_requires_cuda(config: DistributedConfig) -> bool:
    if config.use_cuda or config.require_cuda or config.backend_name == DistributedBackend.NCCL.value:
        return True
    return bool(config.device and config.device.startswith("cuda"))


def _validate_rendezvous(
    config: DistributedConfig,
    errors: list[DistributedValidationIssue],
    warnings: list[DistributedValidationIssue],
) -> None:
    # Voor world_size > 1 moet een toekomstige launcher weten waar processen elkaar vinden.
    if config.init_method in {None, "env://"}:
        if not config.master_addr or config.master_port is None:
            errors.append(
                _validation_error(
                    "rendezvous_missing",
                    "master_addr and master_port are required for multi-process env rendezvous",
                )
            )
    if config.master_addr is not None:
        address = config.master_addr.strip()
        if not address:
            errors.append(_validation_error("master_addr_invalid", "master_addr must not be empty"))
        elif address == "0.0.0.0":
            warnings.append(
                _validation_warning(
                    "master_addr_non_loopback",
                    "0.0.0.0 is broad for local distributed validation",
                )
            )


def _warn_unused_rendezvous(
    config: DistributedConfig,
    warnings: list[DistributedValidationIssue],
) -> None:
    if config.init_method or config.master_addr or config.master_port is not None:
        warnings.append(
            _validation_warning(
                "rendezvous_unused",
                "rendezvous settings are ignored for single-process validation",
            )
        )


def _validate_cuda_request(
    config: DistributedConfig,
    info: DistributedRuntimeInfo,
    errors: list[DistributedValidationIssue],
    warnings: list[DistributedValidationIssue],
) -> None:
    if not info.cuda_available:
        errors.append(_validation_error("device_unavailable", "CUDA is not available in this environment"))
        return
    if config.local_rank >= info.cuda_device_count:
        errors.append(
            _validation_error(
                "device_unavailable",
                f"CUDA local_rank {config.local_rank} is not available",
            )
        )
    if config.world_size > info.cuda_device_count:
        warnings.append(
            _validation_warning(
                "multi_gpu_not_verified_locally",
                "Requested world_size is larger than the local CUDA device count",
            )
        )


def _validation_error(code: str, message: str) -> DistributedValidationIssue:
    return DistributedValidationIssue(code=code, message=message, severity="error")


def _validation_warning(code: str, message: str) -> DistributedValidationIssue:
    return DistributedValidationIssue(code=code, message=message, severity="warning")


__all__ = [
    "DistributedBackend",
    "DistributedConfig",
    "DistributedError",
    "DistributedLaunchResult",
    "DistributedProcessGroupInfo",
    "DistributedRuntimeInfo",
    "DistributedValidationIssue",
    "DistributedValidationResult",
    "DistributedWorkerResult",
    "ExternalValidationTarget",
    "FSDP_CHECKPOINT_POLICY_FORMAT",
    "FSDP_CHECKPOINT_POLICY_VERSION",
    "FSDPCapabilityInfo",
    "FSDPCheckpointPlan",
    "FSDPCheckpointPolicy",
    "FSDPWrapConfig",
    "FSDPWrapInfo",
    "FSDPWrappedModel",
    "SingleGpuBoundaryInfo",
    "build_distributed_env",
    "destroy_process_group",
    "get_external_multi_gpu_validation_matrix",
    "get_distributed_info",
    "init_process_group",
    "inspect_fsdp_capability",
    "inspect_single_gpu_boundary",
    "is_distributed_available",
    "is_distributed_initialized",
    "launch_processes",
    "plan_fsdp_sharded_checkpoint",
    "process_group_context",
    "resolve_process_device",
    "validate_distributed_config",
    "validate_distributed_setup",
    "validate_fsdp_checkpoint_policy",
    "validate_fsdp_capability",
    "validate_single_gpu_boundary",
    "wrap_fsdp_model",
]
