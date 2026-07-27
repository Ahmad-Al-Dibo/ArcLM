"""Echte externe gate voor twee-GPU CUDA DDP-validatie."""

from __future__ import annotations

from pathlib import Path

import pytest
import torch

from arclm.distributed import DistributedConfig, launch_processes
from arclm.training import Trainer, TrainingConfig
from tests.unit.training._helpers import TinyTokenDataset, TinyTokenModel


pytestmark = [
    pytest.mark.gpu,
    pytest.mark.cuda,
    pytest.mark.multi_gpu,
    pytest.mark.distributed,
    pytest.mark.checkpoint,
]


def two_gpu_cuda_ddp_worker(config: DistributedConfig, output_dir: str) -> dict[str, object]:
    """Draait een kleine DDP train-save-resume cyclus op een echte CUDA rank."""
    torch.cuda.set_device(config.local_rank)
    torch.manual_seed(991)
    output_path = Path(output_dir)
    checkpoint_path = output_path / "two-gpu-ddp-checkpoint"

    first = Trainer(
        model=TinyTokenModel(),
        train_dataset=TinyTokenDataset(size=8),
        config=_training_config(output_dir, epochs=1),
        distributed_config=config,
    )
    device_before = _parameter_device(first._raw_model())
    first.train()
    saved_path = first.save_checkpoint(checkpoint_path, synchronize=True)

    resumed = Trainer(
        model=TinyTokenModel(),
        train_dataset=TinyTokenDataset(size=8),
        config=_training_config(output_dir, epochs=2),
        distributed_config=config,
    )
    checkpoint = resumed.load_checkpoint(checkpoint_path)
    loaded_sum = _parameter_sum(resumed._raw_model())
    resumed.train()
    torch.cuda.synchronize(config.local_rank)
    return {
        "rank": config.rank,
        "local_rank": config.local_rank,
        "device_before": device_before,
        "device_after": _parameter_device(resumed._raw_model()),
        "is_ddp": hasattr(resumed.model, "module"),
        "saved_path": str(saved_path) if saved_path is not None else None,
        "checkpoint_exists": (checkpoint_path / "training.pt").exists(),
        "loaded_global_step": checkpoint["global_step"],
        "loaded_optimizer_step": checkpoint["optimizer_step"],
        "final_global_step": resumed.global_step,
        "final_optimizer_step": resumed.optimizer_step,
        "loaded_parameter_sum": loaded_sum,
        "final_parameter_sum": _parameter_sum(resumed._raw_model()),
        "distributed_metadata": checkpoint.get("distributed"),
        "allocated_bytes": int(torch.cuda.memory_allocated(config.local_rank)),
        "peak_bytes": int(torch.cuda.max_memory_allocated(config.local_rank)),
    }


def test_two_gpu_cuda_ddp_checkpoint_resume_runtime(tmp_path):
    """Valideert echte twee-GPU DDP alleen op passende externe hardware."""
    _skip_if_two_gpu_cuda_ddp_unavailable()
    result = launch_processes(
        DistributedConfig(
            backend="nccl",
            world_size=2,
            timeout_seconds=60,
            device="cuda",
            use_cuda=True,
            require_cuda=True,
        ),
        two_gpu_cuda_ddp_worker,
        args=(str(tmp_path),),
        initialize_process_group=True,
        max_processes=2,
        join_timeout_seconds=180,
    )

    result.raise_for_errors()
    records = {worker.rank: worker.result for worker in result.workers}

    assert result.success is True
    assert set(records) == {0, 1}
    assert all(record["is_ddp"] for record in records.values())
    assert {record["device_before"] for record in records.values()} == {"cuda:0", "cuda:1"}
    assert {record["device_after"] for record in records.values()} == {"cuda:0", "cuda:1"}
    assert records[0]["saved_path"] is not None
    assert records[1]["saved_path"] is None
    assert all(record["checkpoint_exists"] for record in records.values())
    assert {record["loaded_global_step"] for record in records.values()} == {4}
    assert {record["loaded_optimizer_step"] for record in records.values()} == {4}
    assert {record["final_global_step"] for record in records.values()} == {8}
    assert {record["final_optimizer_step"] for record in records.values()} == {8}
    assert records[0]["loaded_parameter_sum"] == records[1]["loaded_parameter_sum"]
    assert records[0]["final_parameter_sum"] == records[1]["final_parameter_sum"]
    assert records[0]["final_parameter_sum"] != records[0]["loaded_parameter_sum"]
    assert records[0]["distributed_metadata"]["rank_zero_only"] is True
    assert records[0]["distributed_metadata"]["resume_synchronizes_ranks"] is True


def _training_config(output_dir: str, *, epochs: int) -> TrainingConfig:
    return TrainingConfig(
        epochs=epochs,
        batch_size=1,
        learning_rate=1e-2,
        output_dir=output_dir,
        save_every_steps=0,
        keep_last_checkpoints=None,
        log_every_steps=0,
        device="cuda",
        shuffle=False,
    )


def _skip_if_two_gpu_cuda_ddp_unavailable() -> None:
    if not torch.cuda.is_available():
        pytest.skip("Two-GPU CUDA DDP validation requires CUDA.")
    device_count = int(torch.cuda.device_count())
    if device_count < 2:
        pytest.skip(
            "Two-GPU CUDA DDP validation requires at least two CUDA GPUs; "
            f"detected {device_count}."
        )
    if not torch.distributed.is_available():
        pytest.skip("Two-GPU CUDA DDP validation requires torch.distributed.")
    if not torch.distributed.is_nccl_available():
        pytest.skip("Two-GPU CUDA DDP validation requires the NCCL backend.")


def _parameter_device(model) -> str:
    return str(next(model.parameters()).device)


def _parameter_sum(model) -> float:
    return round(
        sum(float(parameter.detach().sum().item()) for parameter in model.parameters()),
        6,
    )
