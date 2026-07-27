"""Single-GPU distributed smoke-tests voor CUDA-machines."""

from __future__ import annotations

import pytest
import torch

from arclm.distributed import (
    DistributedConfig,
    inspect_single_gpu_boundary,
    launch_processes,
    resolve_process_device,
    validate_single_gpu_boundary,
)


pytestmark = [pytest.mark.gpu, pytest.mark.cuda, pytest.mark.distributed]


def require_cuda() -> None:
    """Skipt voordat de CUDA-runtime wordt gebruikt."""
    if not torch.cuda.is_available():
        pytest.skip("CUDA distributed smoke requires a CUDA-enabled PyTorch runtime.")


def cuda_process_group_worker(config: DistributedConfig) -> dict[str, object]:
    """Draait een kleine CUDA backward-pass binnen een workerproces."""
    device = resolve_process_device(config)
    torch.cuda.set_device(device)
    values = torch.tensor([[1.0, 2.0], [3.0, 4.0]], device=device, requires_grad=True)
    loss = (values @ values).sum()
    loss.backward()
    torch.cuda.synchronize()
    return {
        "rank": config.rank,
        "device": str(values.device),
        "process_group_initialized": bool(torch.distributed.is_initialized()),
        "grad_finite": bool(torch.isfinite(values.grad).all().item()),
    }


def test_single_gpu_distributed_smoke_runs_without_multi_gpu_claim():
    require_cuda()

    config = DistributedConfig(
        world_size=1,
        rank=0,
        local_rank=0,
        device="cuda",
        use_cuda=True,
        require_cuda=True,
        timeout_seconds=30,
    )
    boundary = validate_single_gpu_boundary(config)
    result = launch_processes(
        config,
        cuda_process_group_worker,
        initialize_process_group=True,
        max_processes=1,
        join_timeout_seconds=60,
    )

    result.raise_for_errors()
    worker = result.workers[0]
    assert boundary.can_run_single_gpu is True
    assert boundary.requires_external_multi_gpu is False
    assert result.success is True
    assert worker.result["rank"] == 0
    assert str(worker.result["device"]).startswith("cuda")
    assert worker.result["process_group_initialized"] is True
    assert worker.result["grad_finite"] is True


def test_single_gpu_boundary_does_not_turn_world_size_two_into_local_pass():
    require_cuda()

    info = inspect_single_gpu_boundary(
        DistributedConfig(world_size=2, rank=0, local_rank=0, device="cuda", use_cuda=True)
    )

    assert info.can_run_single_gpu is False
    assert info.requires_external_multi_gpu is True
    assert info.status == "external_multi_gpu_required"
