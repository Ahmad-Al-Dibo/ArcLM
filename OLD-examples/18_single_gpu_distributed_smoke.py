"""Voorbeeld: veilige single-GPU distributed smoke-check.

Dit voorbeeld claimt geen multi-GPU training. Op een CPU-only omgeving print het
alleen waarom de CUDA-smoke niet kan draaien.
"""

from __future__ import annotations

from arclm.distributed import (
    DistributedConfig,
    DistributedError,
    inspect_single_gpu_boundary,
    launch_processes,
    resolve_process_device,
    validate_single_gpu_boundary,
)


def cuda_worker(config: DistributedConfig) -> dict[str, object]:
    """Voert een heel kleine CUDA-berekening uit in een workerproces."""
    import torch

    device = resolve_process_device(config)
    torch.cuda.set_device(device)
    values = torch.tensor([1.0, 2.0, 3.0], device=device, requires_grad=True)
    loss = (values * values).sum()
    loss.backward()
    torch.cuda.synchronize()
    return {
        "rank": config.rank,
        "device": str(values.device),
        "loss": float(loss.item()),
        "grad_finite": bool(torch.isfinite(values.grad).all().item()),
    }


def main() -> None:
    config = DistributedConfig(
        world_size=1,
        rank=0,
        local_rank=0,
        device="cuda",
        use_cuda=True,
        require_cuda=True,
        timeout_seconds=30,
    )
    status = inspect_single_gpu_boundary(config)
    print("Single-GPU boundary:", status.to_dict())

    try:
        validate_single_gpu_boundary(config)
    except DistributedError as exc:
        print(f"CUDA single-GPU smoke not run: {exc}")
        return

    result = launch_processes(
        config,
        cuda_worker,
        initialize_process_group=True,
        max_processes=1,
        join_timeout_seconds=60,
    )
    result.raise_for_errors()
    print("Worker result:", result.workers[0].to_dict())


if __name__ == "__main__":
    main()
