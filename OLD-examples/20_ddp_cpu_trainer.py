"""Voorbeeld: Trainer met DDP op twee CPU-processen.

Dit voorbeeld gebruikt Gloo en twee lokale processen. Het is bedoeld als kleine
rooktest voor de DDP-trainergrens; het claimt geen multi-GPU validatie.
"""

from __future__ import annotations

import tempfile
from pathlib import Path

import torch
from torch import nn
from torch.utils.data import Dataset

from arclm.distributed import DistributedConfig, launch_processes
from arclm.training import Trainer, TrainingConfig


class TinyDataset(Dataset):
    def __len__(self) -> int:
        return 8

    def __getitem__(self, index: int):
        x = torch.tensor([index % 8, (index + 1) % 8], dtype=torch.long)
        y = (x + 1).remainder(8)
        return x, y


class TinyModel(nn.Module):
    def __init__(self):
        super().__init__()
        self.embedding = nn.Embedding(8, 6)
        self.head = nn.Linear(6, 8)

    def forward(self, x):
        return self.head(self.embedding(x))


def worker(config: DistributedConfig, output_dir: str) -> dict[str, object]:
    torch.manual_seed(123)
    trainer = Trainer(
        model=TinyModel(),
        train_dataset=TinyDataset(),
        config=TrainingConfig(
            epochs=1,
            batch_size=1,
            learning_rate=1e-2,
            output_dir=output_dir,
            save_every_steps=0,
            log_every_steps=0,
            device="cpu",
            shuffle=False,
        ),
        distributed_config=config,
    )
    state = trainer.train()
    checkpoint = trainer.save_checkpoint(Path(output_dir) / f"rank-{config.rank}")
    return {
        "rank": config.rank,
        "ddp": hasattr(trainer.model, "module"),
        "global_step": state.global_step,
        "optimizer_step": state.optimizer_step,
        "checkpoint": str(checkpoint) if checkpoint is not None else None,
    }


def main() -> None:
    with tempfile.TemporaryDirectory(prefix="arclm-ddp-example-") as tmp:
        result = launch_processes(
            DistributedConfig(world_size=2, device="cpu", timeout_seconds=30),
            worker,
            args=(tmp,),
            initialize_process_group=True,
            max_processes=2,
            join_timeout_seconds=90,
        )
        result.raise_for_errors()
        for item in result.workers:
            print(item.to_dict())


if __name__ == "__main__":
    main()
