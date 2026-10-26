"""
ArcLM Research Example: Custom Training Pipeline

What you'll learn
-----------------
- Implement BaseTrainingPipeline (build / train / save_checkpoint / get_model)
- Compose ArcLM Tokenizer + ArcLM model + TrackingConfig-style research flow
- Separate pipeline orchestration from raw tensor code

When to use this
----------------
- Custom research loops that are not the stock train_model() path
- Comparing several model sizes under one pipeline interface

Requirements
------------
    pip install "arclm[train]"

Run
---
    python examples/13_research_extension/02_custom_pipeline.py

Expected output
---------------
    JSON with "pipeline_ok": true, final loss, and checkpoint path basename

Runtime
-------
    Under 10 seconds on CPU.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Optional

from arclm.configs import create_config
from arclm.models import ArcLM
from arclm.tokenizers import Tokenizer
from arclm.training import BaseTrainingPipeline, TrainingConfig
from arclm.tracking import set_reproducible_seed


CORPUS = (
    "pipelines orchestrate tokenizer model and training steps. "
    "research pipelines save checkpoints after a fixed number of updates. "
    "keep orchestration separate from tensor math."
)


class ResearchPipeline(BaseTrainingPipeline):
    """Example pipeline: build model for vocab, train N steps, save via Trainer.save.

    Uses ArcLM public construction APIs. Torch appears only in the train body
    (library-side), not in the caller's code.
    """

    def __init__(self, tokenizer: Tokenizer, block_size: int = 8, embed_dim: int = 16):
        self.tokenizer = tokenizer
        self.block_size = block_size
        self.embed_dim = embed_dim
        self.model: Optional[ArcLM] = None
        self._trainer = None
        self.last_loss: Optional[float] = None

    def build(self, vocab_size: int) -> ArcLM:
        self.model = ArcLM(
            vocab_size=vocab_size,
            embed_dim=self.embed_dim,
            block_size=self.block_size,
            num_blocks=1,
        )
        return self.model

    def train(self, train_loader, val_loader=None, num_epochs=None):
        import torch
        import torch.nn.functional as F
        from arclm.training import Trainer

        if self.model is None:
            raise RuntimeError("call build(vocab_size) before train()")
        epochs = int(num_epochs or 1)
        optimizer = torch.optim.AdamW(self.model.parameters(), lr=1e-2)
        self.model.train()
        last = 0.0
        for _ in range(epochs):
            for x, y in train_loader:
                optimizer.zero_grad()
                logits = self.model(x)
                loss = F.cross_entropy(
                    logits.reshape(-1, logits.size(-1)), y.reshape(-1)
                )
                loss.backward()
                optimizer.step()
                last = float(loss.detach().cpu())
        self.last_loss = last
        # Wrap with public Trainer so research code can save via ArcLM API
        tcfg = TrainingConfig(epochs=epochs, batch_size=1, learning_rate=1e-2)
        self._trainer = Trainer(self.model, config=tcfg)
        return {"loss": last, "epochs": epochs}

    def save_checkpoint(self, path=None):
        import tempfile

        from arclm.configs import Config

        if self._trainer is None:
            raise RuntimeError("no trainer to save; train() first")
        tmp = Path(path) if path else Path(tempfile.mkdtemp()) / "pipeline_ckpt.pt"
        cfg = create_config(
            model_path=str(tmp),
            block_size=self.block_size,
            embed_dim=self.embed_dim,
            vocab_size=self.tokenizer.get_vocab_size(),
        )
        self._trainer.save(
            cfg,
            vocab=self.tokenizer.vocab,
            stoi=self.tokenizer.stoi,
            itos=self.tokenizer.itos,
        )
        return tmp

    def get_model(self) -> ArcLM:
        if self.model is None:
            raise RuntimeError("model not built yet")
        return self.model


def main() -> None:
    set_reproducible_seed(3)
    tok = Tokenizer(max_vocab=64)
    tok.build(CORPUS)
    ids = tok.encode_text(CORPUS)

    import torch
    from torch.utils.data import DataLoader, TensorDataset

    block = 8
    xs = []
    ys = []
    for i in range(0, max(1, len(ids) - block - 1)):
        window = ids[i : i + block + 1]
        if len(window) < block + 1:
            break
        xs.append(window[:block])
        ys.append(window[1 : block + 1])
    if not xs:
        xs = [ids[:block]]
        ys = [ids[1 : block + 1]]
    x_t = torch.tensor(xs, dtype=torch.long)
    y_t = torch.tensor(ys, dtype=torch.long)
    loader = DataLoader(TensorDataset(x_t, y_t), batch_size=1)

    pipe = ResearchPipeline(tok, block_size=block, embed_dim=16)
    assert isinstance(pipe, BaseTrainingPipeline)
    pipe.build(tok.get_vocab_size())
    result = pipe.train(loader, num_epochs=1)
    ckpt = pipe.save_checkpoint()
    model = pipe.get_model()

    print(
        json.dumps(
            {
                "pipeline_ok": True,
                "is_base_pipeline": True,
                "loss": round(result["loss"], 4),
                "checkpoint": Path(ckpt).name,
                "model_params": model.get_num_parameters(),
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
