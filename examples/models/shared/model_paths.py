"""Veilige paden voor lokale model- en datasetbestanden."""

from __future__ import annotations

from pathlib import Path


def resolve_within(root: Path, *parts: str) -> Path:
    """Maak een pad dat niet buiten de opgegeven root mag vallen."""

    root = root.expanduser().resolve()
    target = root.joinpath(*parts).resolve()
    if target != root and root not in target.parents:
        raise ValueError(f"Pad valt buiten de toegestane root: {target}")
    return target


def model_storage_path(model_root: Path, model_id: str) -> Path:
    """Geef de lokale opslagmap voor een model-ID."""

    return resolve_within(model_root, model_id)


def example_dataset_path(example_root: Path, dataset_path: str) -> Path:
    """Los een manifest-datasetpad veilig op binnen examples/models."""

    return resolve_within(example_root, *Path(dataset_path).parts)

