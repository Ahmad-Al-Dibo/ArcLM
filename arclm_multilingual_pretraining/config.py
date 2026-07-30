from __future__ import annotations

from pathlib import Path
from typing import Any

from arclm import Config


class ProjectConfig(Config):
    """ArcLM-native configuration for the multilingual pre-training project."""

    def __init__(self, **kwargs: Any) -> None:
        super().__init__(**kwargs)
        self.project_root = Path(kwargs.get("project_root", Path(__file__).resolve().parent.parent)).resolve()
        self.data_dir = Path(kwargs.get("data_dir", self.project_root / "data")).resolve()
        self.output_dir = Path(kwargs.get("output_dir", self.project_root / "outputs")).resolve()
        self.cache_dir = Path(kwargs.get("cache_dir", self.project_root / "cache")).resolve()
        self.seed = int(kwargs.get("seed", 7))
        self.min_text_length = int(kwargs.get("min_text_length", 40))
        self.max_text_length = int(kwargs.get("max_text_length", 4000))
        self.min_words = int(kwargs.get("min_words", 8))
        self.max_words = int(kwargs.get("max_words", 2000))
        self.arabic_ratio_target = float(kwargs.get("arabic_ratio_target", 0.45))
        self.dutch_ratio_target = float(kwargs.get("dutch_ratio_target", 0.45))
        self.other_ratio_target = float(kwargs.get("other_ratio_target", 0.10))
        self.vocab_size = int(kwargs.get("vocab_size", 24576))
        self.block_size = int(kwargs.get("block_size", 512))
        self.embed_dim = int(kwargs.get("embed_dim", 448))
        self.num_blocks = int(kwargs.get("num_blocks", 8))
        self.num_heads = int(kwargs.get("num_heads", 7))
        self.ff_dim = int(kwargs.get("ff_dim", 1792))
        self.positional_embedding_type = str(kwargs.get("positional_embedding_type", "learned_absolute"))
        self.activation_function = str(kwargs.get("activation_function", "gelu"))
        self.normalization = str(kwargs.get("normalization", "layernorm"))
        self.dropout = float(kwargs.get("dropout", 0.10))
        self.learning_rate = float(kwargs.get("learning_rate", 3e-4))
        self.weight_decay = float(kwargs.get("weight_decay", 0.1))
        self.batch_size = int(kwargs.get("batch_size", 8))
        self.gradient_accumulation_steps = int(kwargs.get("gradient_accumulation_steps", 4))
        self.epochs = int(kwargs.get("epochs", kwargs.get("num_epochs", 2)))
        self.num_epochs = self.epochs
        self.warmup_steps = int(kwargs.get("warmup_steps", 2000))
        self.max_steps = kwargs.get("max_steps", 20000)
        self.save_every_steps = int(kwargs.get("save_every_steps", 1000))
        self.eval_every_steps = int(kwargs.get("eval_every_steps", 1000))
        self.device = str(kwargs.get("device", "cpu"))
        self.mixed_precision = bool(kwargs.get("mixed_precision", True))
        self.use_gradient_clipping = bool(kwargs.get("use_gradient_clipping", True))
        self.max_grad_norm = float(kwargs.get("max_grad_norm", 1.0))
        self.log_every_steps = int(kwargs.get("log_every_steps", 100))
        self.checkpoint_dir = Path(kwargs.get("checkpoint_dir", self.output_dir / "checkpoints")).resolve()

    def to_dict(self) -> dict[str, Any]:
        values = super().to_dict()
        values.update(
            {
                "project_root": str(self.project_root),
                "data_dir": str(self.data_dir),
                "output_dir": str(self.output_dir),
                "cache_dir": str(self.cache_dir),
                "seed": self.seed,
                "min_text_length": self.min_text_length,
                "max_text_length": self.max_text_length,
                "min_words": self.min_words,
                "max_words": self.max_words,
                "arabic_ratio_target": self.arabic_ratio_target,
                "dutch_ratio_target": self.dutch_ratio_target,
                "other_ratio_target": self.other_ratio_target,
                "vocab_size": self.vocab_size,
                "block_size": self.block_size,
                "embed_dim": self.embed_dim,
                "num_blocks": self.num_blocks,
                "num_heads": self.num_heads,
                "ff_dim": self.ff_dim,
                "positional_embedding_type": self.positional_embedding_type,
                "activation_function": self.activation_function,
                "normalization": self.normalization,
                "dropout": self.dropout,
                "learning_rate": self.learning_rate,
                "weight_decay": self.weight_decay,
                "batch_size": self.batch_size,
                "gradient_accumulation_steps": self.gradient_accumulation_steps,
                "epochs": self.epochs,
                "num_epochs": self.num_epochs,
                "warmup_steps": self.warmup_steps,
                "max_steps": self.max_steps,
                "save_every_steps": self.save_every_steps,
                "eval_every_steps": self.eval_every_steps,
                "device": self.device,
                "mixed_precision": self.mixed_precision,
                "use_gradient_clipping": self.use_gradient_clipping,
                "max_grad_norm": self.max_grad_norm,
                "log_every_steps": self.log_every_steps,
                "checkpoint_dir": str(self.checkpoint_dir),
            }
        )
        return values
