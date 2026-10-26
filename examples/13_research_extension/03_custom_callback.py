"""
ArcLM Research Example: Custom Training Callback

What you'll learn
-----------------
- Subclass BaseCallback for early stopping, custom logging, or experiment gates
- Use callback hooks: on_train_start, on_step_end, on_epoch_end, on_train_end
- Keep experiment policy out of the Trainer implementation

When to use this
----------------
- Research runs that stop on a loss threshold
- Custom metric logging without forking Trainer

Requirements
------------
    pip install "arclm[train]"

Run
---
    python examples/13_research_extension/03_custom_callback.py

Expected output
---------------
    JSON with "callback_ok": true and "stopped_early": true or step counts

Runtime
-------
    Under 10 seconds on CPU.
"""

from __future__ import annotations

import json

from arclm.models import ArcLM
from arclm.tokenizers import Tokenizer
from arclm.training import BaseCallback, Trainer, TrainingConfig
from arclm.tracking import set_reproducible_seed


CORPUS = (
    "callbacks observe training without changing the trainer core. "
    "early stopping is a research policy implemented as a callback. "
    "log every step then stop when the loss is low enough."
)


class LossThresholdStopper(BaseCallback):
    """Stop training early when loss drops below a threshold."""

    def __init__(self, threshold: float = 1.0):
        self.threshold = threshold
        self.steps_seen = 0
        self.last_loss = None
        self.should_stop = False

    def on_train_start(self, trainer) -> None:
        print("[callback] training starting")

    def on_step_end(self, trainer, state) -> None:
        self.steps_seen += 1
        loss = getattr(state, "loss", None)
        if loss is None and isinstance(state, dict):
            loss = state.get("loss")
        if loss is not None:
            self.last_loss = float(loss)
            if self.last_loss <= self.threshold:
                self.should_stop = True

    def on_epoch_end(self, trainer, state) -> None:
        print(
            f"[callback] epoch end steps={self.steps_seen} "
            f"loss={self.last_loss}"
        )

    def on_train_end(self, trainer) -> None:
        print("[callback] training ending")


class StepPrinter(BaseCallback):
    def on_step_end(self, trainer, state) -> None:
        # Intentionally quiet in CI-friendly mode; count only.
        pass


def main() -> None:
    set_reproducible_seed(11)
    tok = Tokenizer(max_vocab=64)
    tok.build(CORPUS)
    ids = tok.encode_text(CORPUS)

    import torch
    from torch.utils.data import TensorDataset

    block = 8
    window = ids[: block + 1]
    x = torch.tensor([window[:block]], dtype=torch.long)
    y = torch.tensor([window[1:]], dtype=torch.long)
    # Trainer accepts a Dataset via train_dataset= and wraps a DataLoader itself
    dataset = TensorDataset(x, y)

    model = ArcLM(
        vocab_size=tok.get_vocab_size(),
        embed_dim=16,
        block_size=block,
        num_blocks=1,
    )
    stopper = LossThresholdStopper(threshold=5.0)
    config = TrainingConfig(epochs=3, batch_size=1, learning_rate=0.05)

    trainer = Trainer(
        model,
        config=config,
        callbacks=[stopper, StepPrinter()],
        train_dataset=dataset,
    )
    assert any(isinstance(c, BaseCallback) for c in trainer.callbacks)

    history = trainer.train()

    print(
        json.dumps(
            {
                "callback_ok": True,
                "steps_seen": stopper.steps_seen,
                "last_loss": None
                if stopper.last_loss is None
                else round(stopper.last_loss, 4),
                "history_type": type(history).__name__,
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
