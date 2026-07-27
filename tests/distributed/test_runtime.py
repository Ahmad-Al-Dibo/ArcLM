import json
import os
import socket
import subprocess
import sys
import time
from pathlib import Path

import pytest
import torch

import arclm.distributed as distributed_module
from arclm.distributed import (
    DistributedBackend,
    DistributedConfig,
    DistributedError,
    DistributedLaunchResult,
    DistributedProcessGroupInfo,
    DistributedWorkerResult,
    DistributedValidationIssue,
    DistributedValidationResult,
    FSDP_CHECKPOINT_POLICY_FORMAT,
    FSDP_CHECKPOINT_POLICY_VERSION,
    FSDPCapabilityInfo,
    FSDPCheckpointPlan,
    FSDPCheckpointPolicy,
    FSDPWrapConfig,
    FSDPWrapInfo,
    FSDPWrappedModel,
    SingleGpuBoundaryInfo,
    build_distributed_env,
    destroy_process_group,
    get_external_multi_gpu_validation_matrix,
    get_distributed_info,
    init_process_group,
    inspect_fsdp_capability,
    inspect_single_gpu_boundary,
    is_distributed_available,
    is_distributed_initialized,
    launch_processes,
    plan_fsdp_sharded_checkpoint,
    process_group_context,
    resolve_process_device,
    validate_distributed_config,
    validate_distributed_setup,
    validate_fsdp_checkpoint_policy,
    validate_fsdp_capability,
    validate_single_gpu_boundary,
    wrap_fsdp_model,
)
from arclm.training import Trainer, TrainingConfig
from tests.unit.training._helpers import TinyTokenDataset, TinyTokenModel

pytestmark = pytest.mark.distributed


def simple_rank_worker(config: DistributedConfig) -> dict[str, int]:
    return {
        "rank": config.rank,
        "world_size": config.world_size,
        "value": (config.rank + 1) ** 2,
    }


def failing_worker(config: DistributedConfig) -> dict[str, int]:
    raise RuntimeError(f"worker {config.rank} failed")


def slow_worker(config: DistributedConfig) -> int:
    time.sleep(5)
    return config.rank


def process_group_sum_worker(config: DistributedConfig) -> dict[str, float | int]:
    import torch

    value = torch.tensor([float(config.rank + 1)])
    torch.distributed.all_reduce(value)
    return {
        "rank": config.rank,
        "sum": float(value.item()),
    }


def ddp_trainer_worker(config: DistributedConfig, output_dir: str) -> dict[str, object]:
    torch.manual_seed(123)
    output_path = Path(output_dir)
    callback_file = output_path / f"rank-{config.rank}-checkpoint.txt"
    model = TinyTokenModel()
    training_config = TrainingConfig(
        epochs=1,
        batch_size=1,
        learning_rate=1e-2,
        output_dir=output_dir,
        save_every_steps=0,
        keep_last_checkpoints=None,
        log_every_steps=0,
        device="cpu",
        shuffle=False,
    )

    def checkpoint_callback(trainer, **_context):
        callback_file.write_text(f"rank={config.rank}", encoding="utf-8")

    trainer = Trainer(
        model=model,
        train_dataset=TinyTokenDataset(size=8),
        config=training_config,
        distributed_config=config,
    )
    before = _parameter_sum(trainer._raw_model())
    state = trainer.train(
        checkpoint_callback=checkpoint_callback,
        checkpoint_batch_interval=2,
    )
    manual_checkpoint = trainer.save_checkpoint(output_path / f"manual-rank-{config.rank}")
    return {
        "rank": config.rank,
        "is_rank_zero": trainer.is_rank_zero,
        "is_ddp": hasattr(trainer.model, "module"),
        "sampler": type(trainer.train_dataloader.sampler).__name__,
        "global_step": state.global_step,
        "optimizer_step": state.optimizer_step,
        "parameter_sum_before": before,
        "parameter_sum_after": _parameter_sum(trainer._raw_model()),
        "callback_file_exists": callback_file.exists(),
        "manual_checkpoint": str(manual_checkpoint) if manual_checkpoint is not None else None,
    }


def ddp_resume_worker(config: DistributedConfig, output_dir: str) -> dict[str, object]:
    torch.manual_seed(321)
    output_path = Path(output_dir)
    checkpoint_path = output_path / "resume-checkpoint"
    first_config = TrainingConfig(
        epochs=1,
        batch_size=1,
        learning_rate=1e-2,
        output_dir=output_dir,
        save_every_steps=0,
        keep_last_checkpoints=None,
        log_every_steps=0,
        device="cpu",
        shuffle=False,
    )
    first = Trainer(
        model=TinyTokenModel(),
        train_dataset=TinyTokenDataset(size=8),
        config=first_config,
        distributed_config=config,
    )
    first.train()
    saved_path = first.save_checkpoint(checkpoint_path, synchronize=True)

    resumed_config = TrainingConfig(
        epochs=2,
        batch_size=1,
        learning_rate=1e-2,
        output_dir=output_dir,
        save_every_steps=0,
        keep_last_checkpoints=None,
        log_every_steps=0,
        device="cpu",
        shuffle=False,
    )
    resumed = Trainer(
        model=TinyTokenModel(),
        train_dataset=TinyTokenDataset(size=8),
        config=resumed_config,
        distributed_config=config,
    )
    checkpoint = resumed.load_checkpoint(checkpoint_path)
    loaded_sum = _parameter_sum(resumed._raw_model())
    resumed.train()
    return {
        "rank": config.rank,
        "is_rank_zero": resumed.is_rank_zero,
        "saved_path": str(saved_path) if saved_path is not None else None,
        "checkpoint_exists": (checkpoint_path / "training.pt").exists(),
        "loaded_global_step": checkpoint["global_step"],
        "loaded_optimizer_step": checkpoint["optimizer_step"],
        "loaded_epoch": checkpoint["current_epoch"],
        "distributed_metadata": checkpoint.get("distributed"),
        "loaded_parameter_sum": loaded_sum,
        "final_global_step": resumed.global_step,
        "final_optimizer_step": resumed.optimizer_step,
        "final_epoch": resumed.current_epoch,
        "final_parameter_sum": _parameter_sum(resumed._raw_model()),
    }


@pytest.fixture(autouse=True)
def clean_process_group():
    yield
    destroy_process_group()


def test_default_config_is_single_process_cpu():
    config = DistributedConfig()

    assert config.backend_name == "gloo"
    assert config.world_size == 1
    assert config.rank == 0
    assert config.local_rank == 0
    assert config.is_distributed is False
    assert resolve_process_device(config) == "cpu"


def test_config_round_trip():
    config = DistributedConfig(
        backend=DistributedBackend.GLOO,
        world_size=2,
        rank=1,
        local_rank=1,
        device="cpu",
        master_addr="127.0.0.1",
        master_port=29500,
        timeout_seconds=60,
    )

    loaded = DistributedConfig.from_dict(config.to_dict())

    assert loaded == config


def test_config_from_env_reads_standard_rank_values():
    config = DistributedConfig.from_env(
        {
            "WORLD_SIZE": "4",
            "RANK": "2",
            "LOCAL_RANK": "1",
            "MASTER_ADDR": "127.0.0.1",
            "MASTER_PORT": "29501",
        }
    )

    assert config.world_size == 4
    assert config.rank == 2
    assert config.local_rank == 1
    assert config.master_addr == "127.0.0.1"
    assert config.master_port == 29501


@pytest.mark.parametrize(
    "kwargs",
    [
        {"world_size": 0},
        {"rank": -1},
        {"local_rank": -1},
        {"world_size": 2, "rank": 2},
        {"backend": "mpi"},
        {"device": "gpu"},
        {"device": "cuda:-1"},
        {"master_port": 70000},
        {"timeout_seconds": 0},
        {"init_method": "ssh://host"},
    ],
)
def test_invalid_config_values_raise_clear_error(kwargs):
    with pytest.raises(DistributedError) as exc_info:
        DistributedConfig(**kwargs)

    assert exc_info.value.code == "distributed_config_invalid" or exc_info.value.code == "device_invalid"


def test_runtime_info_does_not_initialize_process_group():
    before = is_distributed_initialized()

    info = get_distributed_info(DistributedConfig())

    assert info.backend == "gloo"
    assert info.world_size == 1
    assert info.rank == 0
    assert info.resolved_device == "cpu"
    assert is_distributed_initialized() is before


def test_validate_default_config_reports_available_backend_when_supported():
    info = validate_distributed_config(DistributedConfig())

    assert info.distributed_available is is_distributed_available()
    assert info.backend_available is True


def test_unavailable_nccl_backend_is_reported_without_cuda_claim():
    config = DistributedConfig(backend="nccl")

    info = get_distributed_info(config)

    if not info.backend_available:
        assert "backend_unavailable" in info.warnings
        with pytest.raises(DistributedError, match="not available"):
            validate_distributed_config(config)


def test_cuda_request_does_not_silently_fall_back_to_cpu():
    config = DistributedConfig(use_cuda=True)
    info = get_distributed_info(config)

    if not info.cuda_available:
        assert info.resolved_device is None
        assert "device_unavailable" in info.warnings
        with pytest.raises(DistributedError, match="CUDA is not available"):
            resolve_process_device(config)


def test_build_distributed_env_contains_only_launcher_values():
    config = DistributedConfig(
        world_size=2,
        rank=1,
        local_rank=1,
        master_addr="127.0.0.1",
        master_port=29500,
    )

    env = build_distributed_env(config)

    assert env == {
        "RANK": "1",
        "WORLD_SIZE": "2",
        "LOCAL_RANK": "1",
        "MASTER_ADDR": "127.0.0.1",
        "MASTER_PORT": "29500",
    }


def test_validate_distributed_setup_accepts_single_process_cpu():
    result = validate_distributed_setup(DistributedConfig())

    assert result.valid is True
    assert result.errors == ()
    assert result.requires_process_group is False
    assert result.requires_cuda is False
    assert result.requires_multi_gpu is False
    assert result.runtime.resolved_device == "cpu"


def test_validate_distributed_setup_reports_missing_rendezvous():
    config = DistributedConfig(world_size=2, rank=0, local_rank=0)

    result = validate_distributed_setup(config)

    assert result.valid is False
    assert _issue_codes(result.errors) == {"rendezvous_missing"}
    assert result.requires_process_group is True
    with pytest.raises(DistributedError, match="master_addr"):
        result.raise_for_errors()


def test_validate_distributed_setup_accepts_multi_process_gloo_config():
    config = DistributedConfig(
        world_size=2,
        rank=1,
        local_rank=1,
        master_addr="127.0.0.1",
        master_port=29500,
    )

    result = validate_distributed_setup(config)

    assert result.valid is True
    assert result.errors == ()
    assert result.requires_process_group is True
    assert result.requires_cuda is False


def test_validate_distributed_setup_warns_about_unused_single_process_rendezvous():
    config = DistributedConfig(master_addr="127.0.0.1", master_port=29500)

    result = validate_distributed_setup(config)

    assert result.valid is True
    assert "rendezvous_unused" in _issue_codes(result.warnings)


def test_validate_distributed_setup_reports_local_rank_mismatch():
    config = DistributedConfig(world_size=1, rank=0, local_rank=1)

    result = validate_distributed_setup(config)

    assert result.valid is False
    assert "local_rank_invalid" in _issue_codes(result.errors)


def test_validate_distributed_setup_reports_cuda_conflict():
    config = DistributedConfig(device="cpu", use_cuda=True)

    result = validate_distributed_setup(config)

    assert result.valid is False
    assert "device_conflict" in _issue_codes(result.errors)


def test_validate_distributed_setup_reports_cuda_unavailable_without_fallback():
    config = DistributedConfig(device="cuda", use_cuda=True)

    result = validate_distributed_setup(config)

    if not result.runtime.cuda_available:
        assert result.valid is False
        assert "device_unavailable" in _issue_codes(result.errors)
        assert result.runtime.resolved_device is None


def test_validate_distributed_setup_reports_nccl_backend_unavailable():
    config = DistributedConfig(
        backend="nccl",
        world_size=2,
        rank=0,
        local_rank=0,
        master_addr="127.0.0.1",
        master_port=29500,
    )

    result = validate_distributed_setup(config)

    if not result.runtime.backend_available:
        assert result.valid is False
        assert "distributed_backend_unavailable" in _issue_codes(result.errors)
        assert result.requires_cuda is True


def test_validation_issue_and_result_are_serializable():
    result = validate_distributed_setup(DistributedConfig())
    data = result.to_dict()

    assert isinstance(DistributedValidationIssue("x", "message", "warning").to_dict(), dict)
    assert isinstance(result, DistributedValidationResult)
    assert data["valid"] is True
    assert data["runtime"]["backend"] == "gloo"


def test_validation_issue_rejects_unknown_severity():
    with pytest.raises(DistributedError, match="severity"):
        DistributedValidationIssue("x", "message", "info")


def test_single_process_gloo_process_group_lifecycle():
    _skip_if_gloo_unavailable()
    config = DistributedConfig(init_method=f"tcp://127.0.0.1:{_free_port()}", timeout_seconds=20)

    info = init_process_group(config)

    assert isinstance(info, DistributedProcessGroupInfo)
    assert info.initialized is True
    assert info.backend == "gloo"
    assert info.world_size == 1
    assert info.rank == 0
    assert is_distributed_initialized() is True
    assert destroy_process_group() is True
    assert is_distributed_initialized() is False
    assert destroy_process_group() is False


def test_process_group_context_cleans_up_after_success():
    _skip_if_gloo_unavailable()
    config = DistributedConfig(init_method=f"tcp://127.0.0.1:{_free_port()}", timeout_seconds=20)

    with process_group_context(config) as info:
        assert info.initialized is True
        assert is_distributed_initialized() is True

    assert is_distributed_initialized() is False


def test_process_group_context_cleans_up_after_error():
    _skip_if_gloo_unavailable()
    config = DistributedConfig(init_method=f"tcp://127.0.0.1:{_free_port()}", timeout_seconds=20)

    with pytest.raises(RuntimeError, match="boom"):
        with process_group_context(config):
            raise RuntimeError("boom")

    assert is_distributed_initialized() is False


def test_process_group_init_requires_rendezvous():
    _skip_if_gloo_unavailable()

    with pytest.raises(DistributedError) as exc_info:
        init_process_group(DistributedConfig())

    assert exc_info.value.code == "process_group_rendezvous_missing"


def test_process_group_init_rejects_existing_group():
    _skip_if_gloo_unavailable()
    config = DistributedConfig(init_method=f"tcp://127.0.0.1:{_free_port()}", timeout_seconds=20)

    init_process_group(config)

    with pytest.raises(DistributedError) as exc_info:
        init_process_group(config)

    assert exc_info.value.code == "process_group_already_initialized"


def test_two_cpu_processes_join_gloo_group():
    _skip_if_gloo_unavailable()
    port = _free_port()
    script = r"""
import json
import sys
import torch
from arclm.distributed import DistributedConfig, destroy_process_group, init_process_group

rank = int(sys.argv[1])
port = int(sys.argv[2])
config = DistributedConfig(
    world_size=2,
    rank=rank,
    local_rank=rank,
    init_method=f"tcp://127.0.0.1:{port}",
    timeout_seconds=20,
)
info = init_process_group(config)
value = torch.tensor([float(rank + 1)])
torch.distributed.all_reduce(value)
print(json.dumps({"rank": info.rank, "world_size": info.world_size, "sum": float(value.item())}))
destroy_process_group()
"""
    env = dict(os.environ)
    env["PYTHONPATH"] = os.pathsep.join(
        part for part in ["src", env.get("PYTHONPATH", "")] if part
    )
    processes = [
        subprocess.Popen(
            [sys.executable, "-c", script, str(rank), str(port)],
            cwd=os.getcwd(),
            env=env,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )
        for rank in (0, 1)
    ]

    outputs = []
    for process in processes:
        try:
            stdout, stderr = process.communicate(timeout=60)
        except subprocess.TimeoutExpired:
            process.kill()
            stdout, stderr = process.communicate()
            pytest.fail(f"distributed subprocess timed out\nSTDOUT:\n{stdout}\nSTDERR:\n{stderr}")
        assert process.returncode == 0, stderr
        outputs.append(_json_from_output(stdout))

    assert {item["rank"] for item in outputs} == {0, 1}
    assert {item["world_size"] for item in outputs} == {2}
    assert {item["sum"] for item in outputs} == {3.0}


def test_launch_processes_runs_simple_worker_without_process_group():
    result = launch_processes(
        DistributedConfig(world_size=2, timeout_seconds=20),
        simple_rank_worker,
        max_processes=2,
    )

    assert isinstance(result, DistributedLaunchResult)
    assert result.success is True
    assert [worker.rank for worker in result.workers] == [0, 1]
    assert [worker.result["value"] for worker in result.workers] == [1, 4]


def test_launch_processes_can_initialize_process_group_for_workers():
    _skip_if_gloo_unavailable()
    result = launch_processes(
        DistributedConfig(world_size=2, timeout_seconds=20),
        process_group_sum_worker,
        initialize_process_group=True,
        max_processes=2,
    )

    assert result.success is True
    assert {worker.result["sum"] for worker in result.workers} == {3.0}


def test_ddp_trainer_runs_on_two_cpu_processes(tmp_path):
    _skip_if_gloo_unavailable()
    result = launch_processes(
        DistributedConfig(world_size=2, timeout_seconds=30, device="cpu"),
        ddp_trainer_worker,
        args=(str(tmp_path),),
        initialize_process_group=True,
        max_processes=2,
        join_timeout_seconds=90,
    )

    result.raise_for_errors()
    records = {worker.rank: worker.result for worker in result.workers}

    assert result.success is True
    assert set(records) == {0, 1}
    assert all(record["is_ddp"] for record in records.values())
    assert all(record["sampler"] == "DistributedSampler" for record in records.values())
    assert {record["global_step"] for record in records.values()} == {4}
    assert {record["optimizer_step"] for record in records.values()} == {4}
    assert records[0]["callback_file_exists"] is True
    assert records[1]["callback_file_exists"] is False
    assert records[0]["manual_checkpoint"] is not None
    assert records[1]["manual_checkpoint"] is None
    assert (tmp_path / "manual-rank-0" / "training.pt").exists()
    assert not (tmp_path / "manual-rank-1" / "training.pt").exists()
    assert records[0]["parameter_sum_before"] == records[1]["parameter_sum_before"]
    assert records[0]["parameter_sum_after"] == records[1]["parameter_sum_after"]
    assert records[0]["parameter_sum_after"] != records[0]["parameter_sum_before"]


def test_ddp_trainer_resumes_from_rank_zero_checkpoint_on_new_objects(tmp_path):
    _skip_if_gloo_unavailable()
    result = launch_processes(
        DistributedConfig(world_size=2, timeout_seconds=30, device="cpu"),
        ddp_resume_worker,
        args=(str(tmp_path),),
        initialize_process_group=True,
        max_processes=2,
        join_timeout_seconds=90,
    )

    result.raise_for_errors()
    records = {worker.rank: worker.result for worker in result.workers}

    assert result.success is True
    assert set(records) == {0, 1}
    assert records[0]["saved_path"] is not None
    assert records[1]["saved_path"] is None
    assert all(record["checkpoint_exists"] for record in records.values())
    assert {record["loaded_epoch"] for record in records.values()} == {1}
    assert {record["loaded_global_step"] for record in records.values()} == {4}
    assert {record["loaded_optimizer_step"] for record in records.values()} == {4}
    assert {record["final_epoch"] for record in records.values()} == {2}
    assert {record["final_global_step"] for record in records.values()} == {8}
    assert {record["final_optimizer_step"] for record in records.values()} == {8}
    assert records[0]["loaded_parameter_sum"] == records[1]["loaded_parameter_sum"]
    assert records[0]["final_parameter_sum"] == records[1]["final_parameter_sum"]
    assert records[0]["final_parameter_sum"] != records[0]["loaded_parameter_sum"]
    metadata = records[0]["distributed_metadata"]
    assert metadata["enabled"] is True
    assert metadata["rank_zero_only"] is True
    assert metadata["resume_synchronizes_ranks"] is True
    assert metadata["world_size"] == 2


def test_launch_processes_collects_worker_failure():
    result = launch_processes(
        DistributedConfig(world_size=1, timeout_seconds=20),
        failing_worker,
        max_processes=1,
    )

    assert result.success is False
    assert isinstance(result.workers[0], DistributedWorkerResult)
    assert result.workers[0].error_code == "worker_failed"
    with pytest.raises(DistributedError, match="worker 0 failed"):
        result.raise_for_errors()


def test_launch_processes_enforces_max_processes():
    with pytest.raises(DistributedError) as exc_info:
        launch_processes(
            DistributedConfig(world_size=3),
            simple_rank_worker,
            max_processes=2,
        )

    assert exc_info.value.code == "launch_too_many_processes"


def test_launch_processes_reports_timeout():
    result = launch_processes(
        DistributedConfig(world_size=1, timeout_seconds=20),
        slow_worker,
        max_processes=1,
        join_timeout_seconds=0.25,
    )

    assert result.success is False
    assert result.workers[0].error_code == "worker_timeout"


def test_single_gpu_boundary_reports_cpu_environment_without_claim():
    info = inspect_single_gpu_boundary(DistributedConfig(world_size=1, device="cuda", use_cuda=True))

    assert isinstance(info, SingleGpuBoundaryInfo)
    assert info.requested_world_size == 1
    if not info.cuda_available:
        assert info.status == "hardware_unavailable"
        assert info.can_run_single_gpu is False
        assert info.device is None
        with pytest.raises(DistributedError) as exc_info:
            validate_single_gpu_boundary(DistributedConfig(world_size=1, device="cuda", use_cuda=True))
        assert exc_info.value.code == "single_gpu_unavailable"


def test_single_gpu_boundary_marks_multi_gpu_as_external_validation():
    info = inspect_single_gpu_boundary(DistributedConfig(world_size=2, rank=0, local_rank=0, device="cuda"))

    assert info.status == "external_multi_gpu_required"
    assert info.requires_external_multi_gpu is True
    assert info.can_run_single_gpu is False
    with pytest.raises(DistributedError) as exc_info:
        validate_single_gpu_boundary(DistributedConfig(world_size=2, rank=0, local_rank=0, device="cuda"))
    assert exc_info.value.code == "external_multi_gpu_required"


def test_single_gpu_boundary_info_is_serializable():
    info = inspect_single_gpu_boundary()
    data = info.to_dict()

    assert data["status"] in {"available", "hardware_unavailable", "external_multi_gpu_required"}
    assert "reason" in data


def test_fsdp_capability_reports_local_hardware_without_runtime_claim():
    before = is_distributed_initialized()

    info = inspect_fsdp_capability()

    assert isinstance(info, FSDPCapabilityInfo)
    assert info.required_world_size >= 2
    assert info.test_command == 'python -m pytest tests/gpu -v -m "multi_gpu and fsdp"'
    assert info.to_dict()["status"] == info.status
    assert is_distributed_initialized() is before
    if info.cuda_device_count < info.required_world_size:
        assert info.can_run_locally is False
        assert info.requires_external_multi_gpu is True
        assert info.status == "hardware_unavailable"
        with pytest.raises(DistributedError) as exc_info:
            validate_fsdp_capability()
        assert exc_info.value.code == "fsdp_hardware_unavailable"


def test_fsdp_capability_rejects_single_process_release_gate():
    with pytest.raises(DistributedError) as exc_info:
        inspect_fsdp_capability(required_world_size=1)

    assert exc_info.value.code == "fsdp_config_invalid"


def test_fsdp_capability_can_report_available_when_requirements_are_mocked(monkeypatch):
    class FakeDistributed:
        def is_available(self):
            return True

        def is_initialized(self):
            return False

        def is_backend_available(self, backend):
            return backend == "nccl"

    class FakeCuda:
        def is_available(self):
            return True

        def device_count(self):
            return 2

    class FakeTorch:
        distributed = FakeDistributed()
        cuda = FakeCuda()

    monkeypatch.setattr(distributed_module, "_import_torch", lambda: FakeTorch())
    monkeypatch.setattr(distributed_module, "_fsdp_available", lambda: True)

    info = inspect_fsdp_capability(
        DistributedConfig(
            backend="nccl",
            world_size=2,
            rank=0,
            local_rank=0,
            device="cuda",
            use_cuda=True,
            require_cuda=True,
        )
    )

    assert info.status == "available"
    assert info.can_run_locally is True
    assert info.requires_external_multi_gpu is False
    assert validate_fsdp_capability().status == "available"


def test_fsdp_capability_reports_backend_boundary(monkeypatch):
    class FakeDistributed:
        def is_available(self):
            return True

        def is_initialized(self):
            return False

        def is_backend_available(self, backend):
            return backend == "gloo"

    class FakeCuda:
        def is_available(self):
            return True

        def device_count(self):
            return 2

    class FakeTorch:
        distributed = FakeDistributed()
        cuda = FakeCuda()

    monkeypatch.setattr(distributed_module, "_import_torch", lambda: FakeTorch())
    monkeypatch.setattr(distributed_module, "_fsdp_available", lambda: True)

    config = DistributedConfig(backend="gloo", world_size=2, device="cuda", use_cuda=True)
    info = inspect_fsdp_capability(config)

    assert info.status == "backend_unsupported"
    assert info.can_run_locally is False
    assert "nccl_required_for_external_fsdp" in info.warnings
    with pytest.raises(DistributedError) as exc_info:
        validate_fsdp_capability(config)
    assert exc_info.value.code == "fsdp_backend_unsupported"


def test_fsdp_wrap_config_is_serializable():
    config = FSDPWrapConfig(
        use_orig_params=False,
        sync_module_states=True,
        forward_prefetch=True,
        limit_all_gathers=False,
    )

    assert config.to_dict() == {
        "use_orig_params": False,
        "sync_module_states": True,
        "forward_prefetch": True,
        "limit_all_gathers": False,
    }


def test_fsdp_wrap_rejects_single_process_config():
    with pytest.raises(DistributedError) as exc_info:
        wrap_fsdp_model(object(), DistributedConfig(world_size=1))

    assert exc_info.value.code == "fsdp_world_size_invalid"


def test_fsdp_wrap_reports_local_hardware_boundary():
    model = torch.nn.Linear(2, 2)
    config = DistributedConfig(
        backend="nccl",
        world_size=2,
        rank=0,
        local_rank=0,
        device="cuda",
        use_cuda=True,
        require_cuda=True,
    )

    with pytest.raises(DistributedError) as exc_info:
        wrap_fsdp_model(model, config)

    if not torch.cuda.is_available():
        assert exc_info.value.code == "fsdp_hardware_unavailable"


def test_fsdp_wrap_requires_initialized_process_group(monkeypatch):
    class FakeDistributed:
        def is_available(self):
            return True

        def is_initialized(self):
            return False

        def is_backend_available(self, backend):
            return backend == "nccl"

    class FakeCuda:
        def is_available(self):
            return True

        def device_count(self):
            return 2

    class FakeTorch:
        distributed = FakeDistributed()
        cuda = FakeCuda()

    monkeypatch.setattr(distributed_module, "_import_torch", lambda: FakeTorch())
    monkeypatch.setattr(distributed_module, "_fsdp_available", lambda: True)

    with pytest.raises(DistributedError) as exc_info:
        wrap_fsdp_model(
            _FakeModel(),
            DistributedConfig(
                backend="nccl",
                world_size=2,
                rank=0,
                local_rank=0,
                device="cuda",
                use_cuda=True,
                require_cuda=True,
            ),
        )

    assert exc_info.value.code == "fsdp_process_group_required"


def test_fsdp_wrap_calls_pytorch_fsdp_when_requirements_are_met(monkeypatch):
    class FakeDistributed:
        def is_available(self):
            return True

        def is_initialized(self):
            return True

        def is_backend_available(self, backend):
            return backend == "nccl"

        def get_world_size(self):
            return 2

        def get_rank(self):
            return 1

    class FakeCuda:
        def is_available(self):
            return True

        def device_count(self):
            return 2

    class FakeTorch:
        distributed = FakeDistributed()
        cuda = FakeCuda()

    class FakeFSDP:
        def __init__(self, model, **kwargs):
            self.module = model
            self.kwargs = kwargs

    monkeypatch.setattr(distributed_module, "_import_torch", lambda: FakeTorch())
    monkeypatch.setattr(distributed_module, "_fsdp_available", lambda: True)
    monkeypatch.setattr(distributed_module, "_fsdp_class", lambda: FakeFSDP)

    model = _FakeModel()
    config = DistributedConfig(
        backend="nccl",
        world_size=2,
        rank=1,
        local_rank=1,
        device="cuda",
        use_cuda=True,
        require_cuda=True,
    )
    wrapped = wrap_fsdp_model(model, config, wrap_config=FSDPWrapConfig(forward_prefetch=True))

    assert isinstance(wrapped, FSDPWrappedModel)
    assert isinstance(wrapped.model, FakeFSDP)
    assert wrapped.original_model is model
    assert model.devices == ["cuda:1"]
    assert wrapped.model.kwargs["device_id"] == 1
    assert wrapped.model.kwargs["forward_prefetch"] is True
    assert wrapped.info.wrapper_type == "FullyShardedDataParallel"
    assert wrapped.info.sharded_checkpointing is False
    assert wrapped.info.optimizer_state_handling is False
    assert wrapped.info.to_dict()["world_size"] == 2


def test_fsdp_checkpoint_policy_is_serializable_and_safe():
    policy = FSDPCheckpointPolicy()
    data = policy.to_dict()

    assert data["policy_format"] == FSDP_CHECKPOINT_POLICY_FORMAT
    assert data["policy_version"] == FSDP_CHECKPOINT_POLICY_VERSION
    assert data["state_dict_type"] == "sharded"
    assert data["optimizer_state_policy"] == "sharded"
    assert data["resume_policy"] == "rank_synchronized"
    assert data["artifact_handoff_policy"] == "rank_zero_metadata"
    assert data["shard_directory"] == "model-shards"
    assert data["optimizer_shard_directory"] == "optimizer-shards"
    assert data["artifact_handoff_directory"] == "artifact-handoff"
    assert data["manifest_file"] == "manifest.json"


@pytest.mark.parametrize(
    "kwargs",
    [
        {"state_dict_type": "full"},
        {"rank_zero_manifest": False},
        {"per_rank_model_shards": False},
        {"optimizer_state_policy": "full"},
        {"resume_policy": "supported"},
        {"artifact_handoff_policy": "write_full_model"},
        {"shard_directory": "../escape"},
        {"optimizer_shard_directory": "../escape"},
        {"artifact_handoff_directory": "../escape"},
        {"manifest_file": "C:/secret/manifest.json"},
    ],
)
def test_fsdp_checkpoint_policy_rejects_unsupported_options(kwargs):
    with pytest.raises(DistributedError) as exc_info:
        FSDPCheckpointPolicy(**kwargs)

    assert exc_info.value.code == "fsdp_checkpoint_policy_invalid"


def test_fsdp_sharded_checkpoint_plan_marks_rank_zero_manifest():
    info = FSDPWrapInfo(
        wrapper_type="FullyShardedDataParallel",
        backend="nccl",
        world_size=2,
        rank=0,
        local_rank=0,
        device="cuda:0",
        sharded_checkpointing=False,
        optimizer_state_handling=False,
    )

    plan = plan_fsdp_sharded_checkpoint(info)

    assert isinstance(plan, FSDPCheckpointPlan)
    assert plan.writes_manifest is True
    assert plan.writes_model_shard is True
    assert plan.writes_optimizer_state is True
    assert plan.optimizer_shard_path == "optimizer-shards/rank-00000-of-00002.pt"
    assert plan.resume_supported is True
    assert plan.requires_all_rank_resume is True
    assert plan.artifact_handoff_supported is True
    assert plan.artifact_handoff_rank == 0
    assert plan.writes_artifact_handoff_metadata is True
    assert plan.artifact_handoff_path == "artifact-handoff/rank-zero-artifact.json"
    assert plan.runtime_validation_required is True
    assert plan.manifest_path == "manifest.json"
    assert plan.model_shard_path == "model-shards/rank-00000-of-00002.pt"
    assert plan.to_dict()["policy"]["policy_format"] == FSDP_CHECKPOINT_POLICY_FORMAT


def test_fsdp_sharded_checkpoint_plan_marks_nonzero_rank_as_shard_only():
    info = FSDPWrapInfo(
        wrapper_type="FullyShardedDataParallel",
        backend="nccl",
        world_size=4,
        rank=3,
        local_rank=3,
        device="cuda:3",
        sharded_checkpointing=False,
        optimizer_state_handling=False,
    )

    plan = validate_fsdp_checkpoint_policy(info)

    assert plan.writes_manifest is False
    assert plan.writes_model_shard is True
    assert plan.model_shard_path == "model-shards/rank-00003-of-00004.pt"
    assert plan.optimizer_shard_path == "optimizer-shards/rank-00003-of-00004.pt"
    assert plan.resume_supported is True
    assert plan.requires_all_rank_resume is True
    assert plan.writes_artifact_handoff_metadata is False
    assert plan.artifact_handoff_path == "artifact-handoff/rank-zero-artifact.json"


def test_fsdp_checkpoint_policy_can_disable_optimizer_state_for_compatibility():
    info = FSDPWrapInfo(
        wrapper_type="FullyShardedDataParallel",
        backend="nccl",
        world_size=2,
        rank=1,
        local_rank=1,
        device="cuda:1",
        sharded_checkpointing=False,
        optimizer_state_handling=False,
    )
    policy = FSDPCheckpointPolicy(optimizer_state_policy="not_supported")

    plan = plan_fsdp_sharded_checkpoint(info, policy)

    assert plan.writes_optimizer_state is False
    assert plan.optimizer_shard_path is None
    assert plan.to_dict()["optimizer_shard_path"] is None


def test_fsdp_checkpoint_policy_can_disable_resume_and_artifact_handoff():
    info = FSDPWrapInfo(
        wrapper_type="FullyShardedDataParallel",
        backend="nccl",
        world_size=2,
        rank=0,
        local_rank=0,
        device="cuda:0",
        sharded_checkpointing=False,
        optimizer_state_handling=False,
    )
    policy = FSDPCheckpointPolicy(
        resume_policy="not_supported",
        artifact_handoff_policy="not_supported",
    )

    plan = plan_fsdp_sharded_checkpoint(info, policy)

    assert plan.resume_supported is False
    assert plan.requires_all_rank_resume is False
    assert plan.artifact_handoff_supported is False
    assert plan.writes_artifact_handoff_metadata is False
    assert plan.artifact_handoff_path is None
    assert plan.to_dict()["artifact_handoff_path"] is None


def test_fsdp_sharded_checkpoint_plan_accepts_wrapped_model_metadata():
    info = FSDPWrapInfo(
        wrapper_type="FullyShardedDataParallel",
        backend="nccl",
        world_size=2,
        rank=1,
        local_rank=1,
        device="cuda:1",
        sharded_checkpointing=False,
        optimizer_state_handling=False,
    )
    wrapped = FSDPWrappedModel(
        model=object(),
        original_model=object(),
        wrap_config=FSDPWrapConfig(),
        info=info,
    )

    plan = plan_fsdp_sharded_checkpoint(wrapped)

    assert plan.rank == 1
    assert plan.world_size == 2
    assert plan.model_shard_path.endswith("rank-00001-of-00002.pt")


def test_fsdp_sharded_checkpoint_plan_rejects_non_fsdp_metadata():
    info = FSDPWrapInfo(
        wrapper_type="DistributedDataParallel",
        backend="gloo",
        world_size=2,
        rank=0,
        local_rank=0,
        device="cpu",
        sharded_checkpointing=False,
        optimizer_state_handling=False,
    )

    with pytest.raises(DistributedError) as exc_info:
        plan_fsdp_sharded_checkpoint(info)

    assert exc_info.value.code == "fsdp_checkpoint_policy_invalid"


def test_external_multi_gpu_validation_matrix_is_provider_independent():
    matrix = get_external_multi_gpu_validation_matrix()

    assert len(matrix) >= 6
    assert {target.target_id for target in matrix} >= {
        "cuda_bf16_modern_gpu",
        "two_gpu_ddp_runtime",
        "fsdp_runtime",
        "distributed_checkpoint_resume",
    }
    assert all("AWS" not in target.required_hardware for target in matrix)
    assert all("Azure" not in target.required_hardware for target in matrix)
    assert all("GCP" not in target.required_hardware for target in matrix)
    assert all(target.command.startswith("python -m pytest ") for target in matrix)


def test_external_multi_gpu_validation_matrix_does_not_claim_local_multi_gpu_pass():
    matrix = get_external_multi_gpu_validation_matrix()
    data = [target.to_dict() for target in matrix]

    assert all(item["external_runtime_status"].lower().startswith("pending") for item in data)
    assert any(item["implementation_status"] == "Implemented" for item in data)
    assert any(item["implementation_status"] == "Not implemented" for item in data)
    for item in data:
        assert "verified" not in str(item["local_runtime_status"]).lower()
    assert any("before claiming DDP" in item["release_gate"] for item in data)


def test_external_multi_gpu_validation_matrix_is_lightweight():
    code = """
import sys
from arclm.distributed import get_external_multi_gpu_validation_matrix

matrix = get_external_multi_gpu_validation_matrix()
assert matrix
assert "torch" not in sys.modules
"""

    result = subprocess.run(
        [sys.executable, "-c", code],
        capture_output=True,
        text=True,
        check=False,
    )

    assert result.returncode == 0, result.stderr


def test_public_import_is_lightweight_for_torch_until_runtime_call():
    code = """
import sys
import arclm
import arclm.distributed

assert "torch" not in sys.modules
assert arclm.__version__
"""

    result = subprocess.run(
        [sys.executable, "-c", code],
        capture_output=True,
        text=True,
        check=False,
    )

    assert result.returncode == 0, result.stderr


class _FakeModel:
    def __init__(self):
        self.devices = []

    def to(self, device):
        self.devices.append(device)
        return self


def _issue_codes(issues):
    return {issue.code for issue in issues}


def _free_port() -> int:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.bind(("127.0.0.1", 0))
        return int(sock.getsockname()[1])


def _skip_if_gloo_unavailable() -> None:
    info = get_distributed_info(DistributedConfig(init_method="tcp://127.0.0.1:1"))
    if not info.distributed_available or not info.backend_available:
        pytest.skip("Gloo distributed backend is not available in this environment.")


def _json_from_output(output: str):
    for line in reversed(output.splitlines()):
        line = line.strip()
        if line.startswith("{"):
            return json.loads(line)
    raise AssertionError(f"No JSON line found in output:\n{output}")


def _parameter_sum(model) -> float:
    return round(
        sum(float(parameter.detach().sum().item()) for parameter in model.parameters()),
        6,
    )
