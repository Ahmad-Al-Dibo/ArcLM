"""Advanced tasks for checkpoints and final model artifacts."""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class LabArtifactManifest:
    """Manifest for a tiny final model artifact.

    Example:
        LabArtifactManifest(
            artifact_format="lab-model-artifact",
            artifact_version=1,
            model_config_file="model/config.json",
            weights_file="model/weights.pt",
            sha256="...",
        )
    """

    artifact_format: str
    artifact_version: int
    model_config_file: str
    weights_file: str
    sha256: str


def save_training_checkpoint(path: str, state: dict[str, object]) -> None:
    """Save a restart checkpoint with model, optimizer, and training state.

    Example input:
        state={
            "model_state": {...},
            "optimizer_state": {...},
            "epoch": 2,
            "global_step": 50,
        }

    Expected output:
        A checkpoint file at `path` that can resume training.
    """
    pass


def save_final_artifact(path: str, model: object, config: object) -> LabArtifactManifest:
    """Save a final artifact without optimizer, scheduler, or RNG state.

    Example input:
        path="out/my-model"
        model=tiny_model
        config={"architecture": "tiny-gpt"}

    Expected output:
        LabArtifactManifest(..., model_config_file="model/config.json", ...)
    """
    pass


def inspect_artifact(path: str, verify_integrity: bool = True) -> LabArtifactManifest:
    """Read artifact metadata without constructing the model.

    Example input:
        path="out/my-model"
        verify_integrity=True

    Expected output:
        LabArtifactManifest with file paths and hash metadata.
    """
    pass


def reject_checkpoint_as_artifact(path: str) -> None:
    """Raise a clear error when a training checkpoint is used as an artifact.

    Example input:
        path="checkpoint-step-50.pt"

    Expected behavior:
        Raise an error such as "training checkpoints are not final artifacts".
    """
    pass
