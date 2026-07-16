"""Full fine-tuning bovenop de bestaande Trainer."""

from __future__ import annotations

import json
from dataclasses import asdict
from pathlib import Path

from ..training import Trainer
from .adapters import ModelAdapter, TokenizerAdapter
from .base import BaseFineTuner
from .collator import SFTDataCollator
from .config import SFTConfig


class FullFineTuner(BaseFineTuner):
    """Traint alle trainbare modelparameters met de Training Core.

    De fine-tuner maakt data en adapters klaar. De echte training, checkpoints
    en resume blijven bij `Trainer`.
    """

    def __init__(
        self,
        model,
        tokenizer=None,
        train_dataset=None,
        config: SFTConfig | None = None,
        validation_dataset=None,
        model_adapter=None,
        tokenizer_adapter=None,
        optimizer=None,
        scheduler=None,
        callbacks=None,
        collate_fn=None,
    ):
        """Maakt een full fine-tuner."""
        self.model = model
        self.tokenizer = tokenizer
        self.config = config or SFTConfig()
        self.model_adapter = model_adapter or ModelAdapter(
            model,
            ignore_index=self.config.ignore_index,
            label_shift=self.config.label_shift,
        )
        self.tokenizer_adapter = tokenizer_adapter or TokenizerAdapter(tokenizer)
        self.collator = collate_fn or SFTDataCollator(
            tokenizer=tokenizer,
            tokenizer_adapter=self.tokenizer_adapter,
            config=self.config,
        )
        self.trainer = Trainer(
            model=self.model_adapter,
            train_dataset=train_dataset,
            validation_dataset=validation_dataset,
            config=self.config,
            optimizer=optimizer,
            scheduler=scheduler,
            callbacks=callbacks,
            collate_fn=self.collator,
        )

    def train(self, resume_from_checkpoint=None):
        """Start fine-tuning en geeft de training state terug."""
        return self.trainer.train(resume_from_checkpoint=resume_from_checkpoint)

    def evaluate(self, dataset=None):
        """Evalueert het model met de bestaande evaluatie-integratie."""
        return self.trainer.evaluate(dataset)

    def save_checkpoint(self, path=None):
        """Slaat training en SFT metadata op."""
        checkpoint_path = self.trainer.save_checkpoint(path)
        self.save_metadata(checkpoint_path)
        return checkpoint_path

    def load_checkpoint(self, path):
        """Laadt een checkpoint via de bestaande Trainer."""
        return self.trainer.load_checkpoint(path)

    def resume(self, path):
        """Laadt een checkpoint om verder te trainen."""
        return self.load_checkpoint(path)

    def save_metadata(self, path) -> Path:
        """Bewaart kleine SFT metadata naast het checkpoint."""
        path = Path(path)
        if path.suffix:
            path = path.parent
        path.mkdir(parents=True, exist_ok=True)
        metadata = {
            "format": "arclm-sft-core",
            "model_adapter": type(self.model_adapter).__name__,
            "tokenizer_adapter": type(self.tokenizer_adapter).__name__,
            "dataset_format": self.config.dataset_format,
            "sft_config": asdict(self.config),
        }
        metadata_path = path / "sft_metadata.json"
        metadata_path.write_text(json.dumps(metadata, indent=2), encoding="utf-8")
        return metadata_path

    def save_model_artifact(
        self,
        path,
        *,
        config=None,
        training_summary=None,
        evaluation_summary=None,
        overwrite=False,
    ):
        """Bewaart het finale modelartifact, niet de training checkpoint-state."""
        from ..lifecycle import save_model_artifact

        summary = dict(training_summary or {})
        summary.setdefault("fine_tuning_config", asdict(self.config))
        summary.setdefault("dataset_format", self.config.dataset_format)
        summary.setdefault("global_step", self.trainer.global_step)
        summary.setdefault("optimizer_step", self.trainer.optimizer_step)
        if self.trainer.train_losses:
            summary.setdefault("final_loss", float(self.trainer.train_losses[-1]))
        return save_model_artifact(
            self.model,
            path,
            config=config,
            tokenizer=self.tokenizer,
            training_summary=summary,
            evaluation_summary=evaluation_summary,
            overwrite=overwrite,
            provenance={"source": "arclm.finetuning.FullFineTuner"},
        )


class SFTTrainer(FullFineTuner):
    """Traint een tekstmodel met instruction-, chat- of tekstdatasets."""
