"""Expert tasks for distributed runtime contracts."""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class LabDistributedConfig:
    """Configuration for one distributed worker.

    Example:
        LabDistributedConfig(
            backend="gloo",
            world_size=2,
            rank=0,
            local_rank=0,
            device="cpu",
        )
    """

    backend: str
    world_size: int
    rank: int
    local_rank: int
    device: str


def validate_distributed_config(config: LabDistributedConfig) -> None:
    """Validate rank, world size, backend, and device intent.

    Example valid input:
        LabDistributedConfig("gloo", 2, 1, 1, "cpu")

    Example invalid input:
        rank=2 with world_size=2 should raise a clear error.
    """
    pass


def build_worker_environment(config: LabDistributedConfig) -> dict[str, str]:
    """Build safe environment variables for one local worker.

    Example input:
        LabDistributedConfig("gloo", 2, 1, 1, "cpu")

    Expected output:
        {"RANK": "1", "WORLD_SIZE": "2", "LOCAL_RANK": "1", ...}
    """
    pass


def launch_local_workers(configs: list[LabDistributedConfig], worker_fn: object) -> list[object]:
    """Launch bounded local workers and collect structured results.

    Example input:
        two configs with ranks 0 and 1

    Expected output:
        A list with one structured result per worker, ordered by rank.
    """
    pass


def require_real_multi_gpu_runtime() -> None:
    """Fail unless at least two real CUDA GPUs are available.

    Example CPU-only behavior:
        Raises "multi-GPU validation requires at least two CUDA devices".

    Example two-GPU behavior:
        Returns None and allows the real runtime test to continue.
    """
    pass
