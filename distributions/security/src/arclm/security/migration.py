"""Legacy artifact migration planning."""

from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path


@dataclass(frozen=True)
class MigrationPlanItem:
    path: str
    artifact_type: str
    size_bytes: int
    action: str
    warning: str | None = None


@dataclass(frozen=True)
class MigrationPlan:
    root: str
    items: list[MigrationPlanItem] = field(default_factory=list)
    requires_confirmation: bool = True
    plaintext_preserved: bool = True

    def to_dict(self) -> dict[str, object]:
        return {
            "root": self.root,
            "items": [item.__dict__ for item in self.items],
            "requires_confirmation": self.requires_confirmation,
            "plaintext_preserved": self.plaintext_preserved,
        }


def inspect_workspace_for_security_migration(root: str | Path) -> MigrationPlan:
    """Classify existing plaintext artifacts without changing them."""

    root_path = Path(root).resolve()
    items: list[MigrationPlanItem] = []
    if not root_path.exists():
        return MigrationPlan(root="<workspace>", items=items)
    for path in sorted(item for item in root_path.rglob("*") if item.is_file()):
        relative = path.relative_to(root_path).as_posix()
        suffix = path.suffix.lower()
        artifact_type = _artifact_type(relative, suffix)
        if artifact_type:
            items.append(
                MigrationPlanItem(
                    path=relative,
                    artifact_type=artifact_type,
                    size_bytes=path.stat().st_size,
                    action="encrypt_copy_then_verify",
                    warning=None if path.stat().st_size <= 16 * 1024 * 1024 else "large artifact requires streaming backend",
                )
            )
    return MigrationPlan(root="<workspace>", items=items)


def _artifact_type(relative: str, suffix: str) -> str | None:
    if suffix in {".json", ".jsonl", ".csv", ".txt", ".md"}:
        return "metadata_or_dataset"
    if suffix in {".pt", ".pth", ".safetensors"}:
        return "model_or_checkpoint"
    return None
