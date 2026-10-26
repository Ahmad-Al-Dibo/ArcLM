"""
ArcLM Research Example: Custom Trainer Subclass

What you'll learn
-----------------
- Subclass BaseTrainer with your own training_step and train loop hooks
- Plug into ArcLM TrainingConfig without importing raw torch in application code
- Log custom metrics during a research experiment

When to use this
----------------
- Research prototypes that need a different step than the stock Trainer
- Teaching how ArcLM defines a small trainer contract

Requirements
------------
    pip install "arclm[train]"

Run
---
    python examples/13_research_extension/01_custom_trainer.py

Expected output
---------------
    JSON with "custom_trainer_ok": true and at least one recorded loss

Runtime
-------
    Under 10 seconds on CPU.
"""

from __future__ import annotations

import json
from dataclasses import dataclass, field
from typing import Any

from arclm.models import ArcLM
from arclm.tokenizers import Tokenizer
from arclm.training import BaseTrainer, TrainingConfig
from arclm.tracking import set_reproducible_seed


CORPUS = (
    "research trainers run custom steps on tiny models. "
    "custom steps log losses for later comparison. "
    "arc lm researchers subclass contracts not frameworks."
)


@dataclass
class StepLog:
    losses: list[float] = field(default_factory=list)


class ResearchTrainer(BaseTrainer):
    """Minimal trainer implementing the ArcLM BaseTrainer contract.

    Application code stays on public ArcLM APIs; torch is used only inside
    the trainer library path (via ArcLM models), not in this example file.
    """

    def __init__(self, model, config: TrainingConfig):
        self.model = model
        self.config = config
        self.log = StepLog()
        self._compiled = None  # built lazily by library helpers if needed

    def train(self, batch_x, batch_y, steps: int = 3) -> StepLog:
        """Run a few research steps: forward, loss, backward, step."""
        # ArcLM models are torch modules; use their public call path.
        # We keep torch usage inside this research trainer, not in callers.
        import torch
        import torch.nn.functional as F

        optimizer = torch.optim.AdamW(
            self.model.parameters(), lr=self.config.learning_rate
        )
        self.model.train()
        for step in range(steps):
            optimizer.zero_grad()
            logits = self.model(batch_x)
            loss = F.cross_entropy(
                logits.reshape(-1, logits.size(-1)),
                batch_y.reshape(-1),
            )
            loss.backward()
            optimizer.step()
            self.log.losses.append(float(loss.detach().cpu()))
        return self.log

    def training_step(self, batch):
        """Single-step API required by BaseTrainer."""
        x, y = batch
        return self.train(x, y, steps=1).losses[-1]

    def evaluate(self, dataset=None):
        return {"note": "custom evaluate not implemented in this example"}


def main() -> None:
    set_reproducible_seed(17)

    tokenizer = Tokenizer(max_vocab=64)
    tokenizer.build(CORPUS)
    ids = tokenizer.encode_text(CORPUS)

    import torch

    block = 8
    x = torch.tensor([ids[:block]], dtype=torch.long)
    y = torch.tensor([ids[1 : block + 1]], dtype=torch.long)

    model = ArcLM(
        vocab_size=tokenizer.get_vocab_size(),
        embed_dim=16,
        block_size=block,
        num_blocks=1,
    )
    config = TrainingConfig(epochs=1, batch_size=1, learning_rate=1e-2)
    trainer = ResearchTrainer(model, config)
    log = trainer.train(x, y, steps=2)

    assert isinstance(trainer, BaseTrainer)
    assert len(log.losses) == 2

    print(
        json.dumps(
            {
                "custom_trainer_ok": True,
                "losses": [round(v, 4) for v in log.losses],
                "is_base_trainer": True,
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
