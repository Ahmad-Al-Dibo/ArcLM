"""Helpers voor modelbouw, training en checkpoints."""

from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, Optional, Union
import time

from ..utils.imports import require_torch

require_torch("ArcLM training")
import torch
import torch.nn as nn

from ..configs import Config
from ..datasets import prepare_data
from ..checkpoints.loaders import (
    adapt_for_training,
    load_external_model,
    validate_tokenizer_compatibility,
)
from ..models import ArcLM
from ..tokenizers import SentencePieceTokenizer, Tokenizer
from .trainer import Trainer


def build_model(config, vocab_size=None) -> ArcLM:
    """Maakt een ArcLM model vanuit config en zet het op het gekozen device."""
    model = ArcLM(
        vocab_size=vocab_size if vocab_size is not None else config.vocab_size,
        embed_dim=config.embed_dim,
        block_size=config.block_size,
        num_blocks=config.num_blocks,
        dropout=config.dropout,
    )
    return model.to(torch.device(config.device))


def build_optimizer_with_discriminative_lr(
    model,
    learning_rate: float,
    weight_decay: float,
    lr_multiplier: dict = None
) -> torch.optim.Optimizer:
    """Maakt een optimizer met aparte learning rates per laag-groep.
    
    Args:
        model: Het ArcLM model.
        learning_rate: De basis learning rate.
        weight_decay: Weight decay voor AdamW.
        lr_multiplier: Vermenigvuldigers per groep, bijvoorbeeld embeddings,
            blocks en head.
    
    Returns:
        Een AdamW optimizer met parametergroepen.
    """
    if lr_multiplier is None:
        lr_multiplier = {
            'embeddings': 0.1,
            'blocks': 0.1,
            'head': 1.0
        }
    
    param_groups = []
    assigned_params_names = set()
    
    # Groep 1: embeddings krijgen vaak een kleinere learning rate.
    embedding_params = []
    for name, param in model.named_parameters():
        if 'embedding' in name.lower():
            embedding_params.append(param)
            assigned_params_names.add(name)
    
    if embedding_params:
        param_groups.append({
            'params': embedding_params,
            'lr': learning_rate * lr_multiplier.get('embeddings', 1.0),
            'weight_decay': weight_decay,
        })
    
    # Groep 2: transformer blokken vormen de backbone van het model.
    block_params = []
    for name, param in model.named_parameters():
        if 'blocks' in name:
            block_params.append(param)
            assigned_params_names.add(name)
    
    if block_params:
        param_groups.append({
            'params': block_params,
            'lr': learning_rate * lr_multiplier.get('blocks', 1.0),
            'weight_decay': weight_decay,
        })
    
    # Groep 3: de output head bevat alles wat nog niet is ingedeeld.
    head_params = []
    for name, param in model.named_parameters():
        if name not in assigned_params_names:
            head_params.append(param)
    
    if head_params:
        param_groups.append({
            'params': head_params,
            'lr': learning_rate * lr_multiplier.get('head', 1.0),
            'weight_decay': weight_decay,
        })
    
    return torch.optim.AdamW(param_groups, lr=learning_rate)


@dataclass
class TrainingResult:
    """Resultaat dat `train_model` teruggeeft na een trainingsrun."""

    mode: str
    model_path: str
    config: Config
    history: Dict[str, Any]
    vocab_size: int
    tokenizer: Optional[Union[Tokenizer, SentencePieceTokenizer]] = None
    checkpoint_source: Optional[str] = None


def build_trainer(model, config, event_logger=None):
    """Maakt de optimizer, loss function en Trainer voor een model."""
    # Bij finetuning kan elke laag-groep een eigen learning rate krijgen.
    if hasattr(config, 'use_discriminative_lr') and config.use_discriminative_lr:
        lr_multiplier = getattr(config, 'lr_multiplier', None)
        if lr_multiplier is None:
            lr_multiplier = {
                'embeddings': 0.1,
                'blocks': 0.1,
                'head': 1.0
            }
        optimizer = build_optimizer_with_discriminative_lr(
            model,
            config.learning_rate,
            config.weight_decay,
            lr_multiplier
        )
        logger = __import__('logging').getLogger(__name__)
        logger.info("✓ Using discriminative learning rates:")
        logger.info(f"  Embeddings: {config.learning_rate * lr_multiplier.get('embeddings', 1.0):.2e}")
        logger.info(f"  Blocks: {config.learning_rate * lr_multiplier.get('blocks', 1.0):.2e}")
        logger.info(f"  Head: {config.learning_rate * lr_multiplier.get('head', 1.0):.2e}")
    else:
        optimizer = torch.optim.AdamW(
            model.parameters(),
            lr=config.learning_rate,
            weight_decay=config.weight_decay,
        )
    
    criterion = nn.CrossEntropyLoss()
    return Trainer(model, optimizer, criterion, config, event_logger=event_logger)


def train_model(
    mode: str,
    data: str,
    output: str,
    checkpoint: Optional[str] = None,
    config: Optional[Config] = None,
    tokenizer=None,
    **config_overrides,
) -> TrainingResult:
    """Traint een ArcLM model in pretrain, finetune of continue_training mode.

    Deze functie voert de hele standaard workflow uit: data klaarmaken,
    tokenizer controleren, model bouwen of aanpassen, trainen, opslaan en
    metrics loggen.
    """

    normalized_mode = _normalize_training_mode(mode)
    config = _build_training_config(config, data, output, config_overrides)

    loaded_checkpoint = None
    existing_tokenizer = tokenizer
    if normalized_mode in {"finetune", "continue_training"}:
        if checkpoint is None:
            raise ValueError(f"mode='{mode}' requires checkpoint='path/or/model-id'.")
        loaded_checkpoint = load_external_model(checkpoint, map_location=config.device)
        if existing_tokenizer is None:
            existing_tokenizer = _tokenizer_from_loaded_checkpoint(loaded_checkpoint)
        if normalized_mode == "continue_training" and existing_tokenizer is None:
            raise ValueError(
                "continue_training requires a checkpoint with restorable tokenizer metadata "
                "or an explicit tokenizer."
            )

    data_bundle = prepare_data(config, existing_tokenizer=existing_tokenizer)
    config.vocab_size = data_bundle.vocab_size
    if config.metrics_log_path is None:
        run_id = f"{normalized_mode}-{int(time.time())}"
        config.metrics_log_path = str(Path(output).parent / "runs" / run_id / "metrics.jsonl")

    if loaded_checkpoint is None:
        model = build_model(config, data_bundle.vocab_size)
    else:
        require_match = normalized_mode == "continue_training" or loaded_checkpoint.is_arclm_checkpoint
        if require_match:
            validate_tokenizer_compatibility(
                loaded_checkpoint,
                tokenizer=data_bundle.tokenizer,
                config=config,
            )
        adapted = adapt_for_training(
            loaded_checkpoint,
            target_config=config,
            tokenizer=data_bundle.tokenizer,
            require_tokenizer_match=require_match,
        )
        model = adapted.model
        config = adapted.config
        config.data_path = data
        config.model_path = output
        config.metrics_log_path = config.metrics_log_path or str(
            Path(output).parent / "runs" / f"{normalized_mode}-{int(time.time())}" / "metrics.jsonl"
        )

    trainer = build_trainer(model, config)
    if normalized_mode in {"finetune", "continue_training"}:
        if getattr(config, "freeze_embedding", False):
            trainer.freeze_layers("token_embedding", verbose=False)
        if getattr(config, "freeze_backbone", False):
            trainer.freeze_layers("blocks", verbose=False)

    if normalized_mode == "continue_training" and loaded_checkpoint is not None:
        if loaded_checkpoint.optimizer_state_dict is not None:
            try:
                trainer.optimizer.load_state_dict(loaded_checkpoint.optimizer_state_dict)
            except ValueError:
                print("[WARNING] Optimizer state is incompatible; continuing with a new optimizer.")
        trainer.train_losses = loaded_checkpoint.train_history.get("train_losses", [])
        trainer.val_losses = loaded_checkpoint.train_history.get("val_losses", [])
        trainer.current_epoch = int(loaded_checkpoint.metadata.get("current_epoch", len(trainer.train_losses)))

    checkpoint_callback = None
    if config.checkpoint_interval > 0 or config.checkpoint_batch_interval > 0:
        checkpoint_callback = create_checkpoint_callback(
            config,
            data_bundle.tokenizer,
            data_bundle.vocab_size,
        )

    trainer.train(
        data_bundle.train_loader,
        config.num_epochs,
        val_loader=data_bundle.val_loader,
        early_stopping_patience=config.early_stopping_patience,
        min_delta=config.early_stopping_min_delta,
        checkpoint_callback=checkpoint_callback,
        checkpoint_epoch_interval=config.checkpoint_interval,
        checkpoint_batch_interval=config.checkpoint_batch_interval,
    )
    trainer.save(
        config,
        vocab=data_bundle.tokenizer.vocab,
        stoi=data_bundle.tokenizer.stoi,
        itos=data_bundle.tokenizer.itos,
        tokenizer_metadata=data_bundle.tokenizer.to_checkpoint(),
    )

    return TrainingResult(
        mode=normalized_mode,
        model_path=str(config.model_path),
        config=config,
        history=trainer.get_train_history(),
        vocab_size=data_bundle.vocab_size,
        tokenizer=data_bundle.tokenizer,
        checkpoint_source=loaded_checkpoint.source if loaded_checkpoint else None,
    )


def _normalize_training_mode(mode: str) -> str:
    """Zet verschillende mode-namen om naar de interne naam."""
    normalized = mode.lower().replace("-", "_")
    aliases = {
        "pre_training": "pretrain",
        "pretrain": "pretrain",
        "finetune": "finetune",
        "fine_tuning": "finetune",
        "fine_tune": "finetune",
        "continue": "continue_training",
        "continued": "continue_training",
        "continue_training": "continue_training",
    }
    if normalized not in aliases:
        raise ValueError("mode must be one of: pretrain, finetune, continue_training.")
    return aliases[normalized]


def _build_training_config(config, data, output, overrides):
    """Maakt of werkt de training config bij met pad- en override waarden."""
    values = dict(overrides)
    values["data_path"] = data
    values["model_path"] = output
    if config is None:
        return Config(**values)
    for key, value in values.items():
        if not hasattr(config, key):
            raise ValueError(f"Unknown configuration parameter: {key}")
        setattr(config, key, value)
    return config


def _tokenizer_from_loaded_checkpoint(checkpoint):
    """Probeert een tokenizer terug te halen uit een geladen checkpoint."""
    metadata = checkpoint.tokenizer_metadata or {}
    tokenizer_type = metadata.get("tokenizer_type", checkpoint.config.get("tokenizer_type", "word"))

    if tokenizer_type == "sentencepiece" and metadata.get("model_proto"):
        return SentencePieceTokenizer.from_checkpoint(metadata)

    if tokenizer_type == "word" and checkpoint.vocab is not None:
        tokenizer = Tokenizer(max_vocab=metadata.get("max_vocab", len(checkpoint.vocab)))
        tokenizer.vocab = list(checkpoint.vocab)
        tokenizer.vocab_size = len(tokenizer.vocab)
        tokenizer.stoi = checkpoint.stoi or {token: idx for idx, token in enumerate(tokenizer.vocab)}
        tokenizer.itos = checkpoint.itos or {idx: token for idx, token in enumerate(tokenizer.vocab)}
        return tokenizer

    return None


def tokenizer_from_checkpoint(checkpoint_or_source):
    """Haalt een ArcLM tokenizer uit een checkpoint of checkpoint-pad."""
    checkpoint = checkpoint_or_source
    if not hasattr(checkpoint, "tokenizer_metadata"):
        checkpoint = load_external_model(checkpoint_or_source)

    tokenizer = _tokenizer_from_loaded_checkpoint(checkpoint)
    if tokenizer is None:
        raise ValueError(
            "Checkpoint does not contain restorable ArcLM tokenizer metadata. "
            "Use a checkpoint saved by train_model()/Trainer.save(), or pass an "
            "explicit tokenizer built for the target data."
        )
    return tokenizer


def checkpoint_is_compatible_for_continue_training(checkpoint, config, vocab_size, tokenizer=None):
    """Controleert of een checkpoint past bij continued training."""
    checkpoint_config = checkpoint.get("config", {})
    if checkpoint_config == {}:
        print("[WARNING] in `checkpoint_is_compatible` checkpoint config return {}! ")
    same_vocab = checkpoint.get("vocab_size") == vocab_size
    same_shape = (
        checkpoint_config.get("embed_dim", config.embed_dim) == config.embed_dim
        and checkpoint_config.get("block_size", config.block_size) == config.block_size
        and checkpoint_config.get("num_blocks", config.num_blocks) == config.num_blocks
    )
    same_tokenizer = (
        checkpoint_config.get("tokenizer_type", "word")
        == getattr(config, "tokenizer_type", "word")
        and checkpoint_config.get("sentencepiece_model_type", "bpe")
        == getattr(config, "sentencepiece_model_type", "bpe")
    )
    if tokenizer is not None:
        checkpoint_stoi = checkpoint.get("stoi")
        checkpoint_vocab = checkpoint.get("vocab")
        if checkpoint_stoi is not None:
            same_tokenizer = same_tokenizer and checkpoint_stoi == tokenizer.stoi
        elif checkpoint_vocab is not None:
            same_tokenizer = same_tokenizer and checkpoint_vocab == tokenizer.vocab
        else:
            same_tokenizer = False

    same_training_strategy = (
        checkpoint_config.get("learning_rate", config.learning_rate) == config.learning_rate
        and checkpoint_config.get("weight_decay", config.weight_decay) == config.weight_decay
        and checkpoint_config.get("dropout", 0.0) == config.dropout
        and checkpoint_config.get("validation_split", config.validation_split)
        == config.validation_split
    )
    
    # Continued training is strict: vocab, model shape, tokenizer and training must match.
    return same_vocab and same_shape and same_tokenizer and same_training_strategy


def checkpoint_is_compatible_for_tuning(checkpoint, config, vocab_size, tokenizer=None):
    """Controleert of een checkpoint past bij finetuning."""
    checkpoint_config = checkpoint.get("config", {})
    if checkpoint_config == {}:
        print("[WARNING] in `checkpoint_is_compatible` checkpoint config return {}! ")
    same_vocab = checkpoint.get("vocab_size") == vocab_size
    same_shape = (
        checkpoint_config.get("embed_dim", config.embed_dim) == config.embed_dim
        and checkpoint_config.get("block_size", config.block_size) == config.block_size
        and checkpoint_config.get("num_blocks", config.num_blocks) == config.num_blocks
    )
    same_tokenizer = (
        checkpoint_config.get("tokenizer_type", "word")
        == getattr(config, "tokenizer_type", "word")
        and checkpoint_config.get("sentencepiece_model_type", "bpe")
        == getattr(config, "sentencepiece_model_type", "bpe")
    )
    if tokenizer is not None:
        checkpoint_stoi = checkpoint.get("stoi")
        checkpoint_vocab = checkpoint.get("vocab")
        if checkpoint_stoi is not None:
            same_tokenizer = same_tokenizer and checkpoint_stoi == tokenizer.stoi
        elif checkpoint_vocab is not None:
            same_tokenizer = same_tokenizer and checkpoint_vocab == tokenizer.vocab
        else:
            same_tokenizer = False

    # Bij finetuning hoeft de learning rate niet gelijk te zijn aan het checkpoint.
    # De oude, strengere check blijft hier als referentie staan.
    # same_training_strategy = (
    #     checkpoint_config.get("learning_rate", config.learning_rate) == config.learning_rate
    #     and checkpoint_config.get("weight_decay", config.weight_decay) == config.weight_decay
    #     and checkpoint_config.get("dropout", 0.0) == config.dropout
    #     and checkpoint_config.get("validation_split", config.validation_split)
    #     == config.validation_split
    # )
    same_training_strategy = (
        checkpoint_config.get("weight_decay", config.weight_decay) == config.weight_decay
        and checkpoint_config.get("dropout", 0.0) == config.dropout
        and checkpoint_config.get("validation_split", config.validation_split)
        == config.validation_split
    )
    print("same_vocab, same_shape, same_tokenizer, same_training_strategy", same_vocab, same_shape, same_tokenizer, same_training_strategy)
    # Finetuning mag een andere vocab_size hebben, maar de basisvorm moet passen.
    return same_shape and same_tokenizer and same_training_strategy





def load_compatible_checkpoint(trainer, config, vocab_size, tokenizer=None):
    """Laadt een bestaand checkpoint als het past bij deze training."""
    if not trainer.exists(config.model_path):
        return False

    checkpoint = torch.load(config.model_path, map_location=torch.device(config.device))
    if checkpoint_is_compatible_for_continue_training(checkpoint, config, vocab_size, tokenizer=tokenizer):
        trainer.load(config.model_path)
        return True

    print("[WARNING] Existing checkpoint is incompatible; retraining.")
    print(f"  Checkpoint vocab: {checkpoint.get('vocab_size')}, current vocab: {vocab_size}")
    print(f"  Checkpoint config: {checkpoint.get('config', {})}")
    if tokenizer is not None:
        print("  Tokenizer mapping differs or is missing; retraining is required.")
    return False


def create_checkpoint_callback(config, tokenizer, vocab_size):
    """Maakt een callback die het laatste hervatbare checkpoint opslaat."""
    def checkpoint_callback(trainer, **_context):
        """Slaat tijdens training een checkpoint op."""
        save_training_checkpoint(trainer, config, tokenizer, vocab_size)

    return checkpoint_callback


def create_epoch_checkpoint_callback(config, tokenizer, vocab_size):
    """Oude alias voor `create_checkpoint_callback`."""
    return create_checkpoint_callback(config, tokenizer, vocab_size)


def save_training_checkpoint(trainer, config, tokenizer, vocab_size):
    """Slaat een trainer checkpoint op met tokenizer metadata."""
    tokenizer_metadata = None
    if hasattr(tokenizer, "to_checkpoint"):
        tokenizer_metadata = tokenizer.to_checkpoint()
    config.vocab_size = vocab_size

    trainer.save(
        config,
        vocab=tokenizer.vocab,
        stoi=tokenizer.stoi,
        itos=tokenizer.itos,
        tokenizer_metadata=tokenizer_metadata,
    )
