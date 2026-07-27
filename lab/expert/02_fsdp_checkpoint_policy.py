"""Expert tasks for FSDP checkpoint policy design."""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class LabFSDPCheckpointPolicy:
    """Policy for future FSDP model and optimizer shards.

    Example:
        LabFSDPCheckpointPolicy(
            state_dict_type="sharded",
            model_shard_directory="model-shards",
            optimizer_shard_directory="optimizer-shards",
            rank_zero_manifest=True,
            resume_supported=False,
        )
    """

    state_dict_type: str
    model_shard_directory: str
    optimizer_shard_directory: str
    rank_zero_manifest: bool
    resume_supported: bool


def validate_fsdp_policy(policy: LabFSDPCheckpointPolicy) -> None:
    """Validate sharded state, safe relative paths, and unsupported resume.

    Example valid input:
        state_dict_type="sharded", model_shard_directory="model-shards"

    Example invalid input:
        model_shard_directory="../escape" should raise a clear error.
    """
    pass


def plan_rank_checkpoint_files(
    policy: LabFSDPCheckpointPolicy,
    rank: int,
    world_size: int,
) -> dict[str, str | bool]:
    """Return manifest, model shard, and optimizer shard intent for one rank.

    Example input:
        rank=1
        world_size=2

    Expected output:
        {
            "writes_manifest": False,
            "model_shard_path": "model-shards/rank-00001-of-00002.pt",
            "optimizer_shard_path": "optimizer-shards/rank-00001-of-00002.pt",
        }
    """
    pass


def reject_unsafe_manifest_path(path: str) -> None:
    """Reject absolute paths, traversal, symlinks, and platform-specific secrets.

    Example valid input:
        "manifest.json"

    Example invalid input:
        "C:/Users/name/manifest.json" or "../manifest.json"
    """
    pass
