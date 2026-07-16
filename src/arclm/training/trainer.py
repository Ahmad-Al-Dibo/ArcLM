"""
Trainer Module - Training loop and model management
"""

import copy
import inspect
import math
import os
import shutil
import tempfile
import time
import warnings
import torch
import torch.nn.functional as F
from pathlib import Path
from torch.utils.data import DataLoader
from ..checkpoints.training import (
    CHECKPOINT_FORMAT,
    CHECKPOINT_VERSION,
    TRAINING_STATE_VERSION,
    atomic_save_checkpoint,
    build_checkpoint_metadata,
    capture_rng_state,
    checkpoint_file,
    restore_rng_state,
    safe_load_training_checkpoint,
)
from ..configs import Config
from ..exceptions import CheckpointError, TrainingError
from .base import BaseTrainer
from .callbacks import BaseCallback
from .config import TrainingConfig
from .logging import AsyncTrainingLogger
from .optimizers import create_optimizer
from .precision import PrecisionHelper
from .schedulers import create_scheduler
from .state import TrainingState
from ..lifecycle import build_training_checkpoint_metadata


class Trainer(BaseTrainer):
    """Traint een model op één apparaat.

    De trainer ondersteunt de oude ArcLM API met `train(loader, epochs)` en
    de nieuwe API met `train_dataset` en `TrainingConfig`.
    """
    
    def __init__(
        self,
        model,
        optimizer=None,
        criterion=None,
        config=None,
        *,
        train_dataset=None,
        validation_dataset=None,
        train_dataloader=None,
        validation_dataloader=None,
        scheduler=None,
        callbacks=None,
        event_logger=None,
        collate_fn=None,
    ):
        """Maakt de trainer klaar voor gebruik.

        Args:
            model: Het PyTorch model.
            optimizer: Optionele optimizer. Oude code geeft deze positie al mee.
            criterion: Optionele loss function voor token training.
            config: `TrainingConfig` of de bestaande ArcLM `Config`.
            train_dataset: Dataset voor de nieuwe eenvoudige API.
            validation_dataset: Optionele validatie dataset.
            train_dataloader: Bestaande dataloader als die al gemaakt is.
            validation_dataloader: Optionele validatie dataloader.
            scheduler: Optionele scheduler.
            callbacks: Lijst met callbacks.
        """
        self.model = model
        self.config = config or TrainingConfig()
        self.device = self._resolve_device(self.config)
        self.model.to(self.device)
        self.criterion = criterion or torch.nn.CrossEntropyLoss()
        self.train_dataset = train_dataset
        self.validation_dataset = validation_dataset
        self.train_dataloader = train_dataloader
        self.validation_dataloader = validation_dataloader
        self.collate_fn = collate_fn
        self.callbacks = list(callbacks or [])
        self.state = TrainingState()
        self.precision = PrecisionHelper(
            getattr(self.config, "precision", "fp32"),
            self.device,
        )
        self.optimizer = optimizer or create_optimizer(self.model, self.config)
        self.scheduler = scheduler
        self.event_logger = event_logger
        self._owns_event_logger = False
        if self.event_logger is None and getattr(self.config, "metrics_log_path", None):
            self.event_logger = AsyncTrainingLogger(self.config.metrics_log_path).start()
            self._owns_event_logger = True
        self.train_losses = []
        self.val_losses = []
        self.val_perplexities = []
        self.val_token_accuracies = []
        self.best_val_loss = float('inf')
        self.patience_counter = 0
        self.best_model_state_dict = None
        self.current_epoch = 0
        self.current_batch = 0
        self.global_step = 0
        self.optimizer_step = 0

    def _resolve_device(self, config):
        """Bepaalt op welk apparaat de trainer draait."""
        device = getattr(config, "device", None)
        if device is None:
            device = "cuda" if torch.cuda.is_available() else "cpu"
        return torch.device(device)

    def _config_epochs(self):
        """Geeft het aantal epochs uit nieuwe of oude configs terug."""
        return getattr(self.config, "epochs", getattr(self.config, "num_epochs", None))

    def _config_batch_size(self):
        """Geeft de batch size uit de config terug."""
        return getattr(self.config, "batch_size", 8)

    def _build_dataloader(self, dataset, shuffle=False):
        """Maakt een dataloader voor een dataset."""
        if dataset is None:
            return None
        return DataLoader(
            dataset,
            batch_size=self._config_batch_size(),
            shuffle=shuffle,
            num_workers=getattr(self.config, "num_workers", 0),
            collate_fn=self.collate_fn,
        )

    def _get_train_loader(self, loader=None):
        """Geeft de train dataloader terug."""
        if loader is not None:
            return loader
        if self.train_dataloader is None:
            self.train_dataloader = self._build_dataloader(
                self.train_dataset,
                shuffle=getattr(self.config, "shuffle", True),
            )
        return self.train_dataloader

    def _get_validation_loader(self, val_loader=None, dataset=None):
        """Geeft de validatie dataloader terug."""
        if val_loader is not None:
            return val_loader
        if dataset is not None:
            return self._build_dataloader(dataset, shuffle=False)
        if self.validation_dataloader is None:
            self.validation_dataloader = self._build_dataloader(
                self.validation_dataset,
                shuffle=False,
            )
        return self.validation_dataloader

    def _call_callbacks(self, hook, *args):
        """Voert een callback hook uit als die bestaat."""
        for callback in self.callbacks:
            method = getattr(callback, hook, None)
            if method is not None:
                method(self, *args)

    def _sync_state_from_counters(self, loss=None):
        """Houdt oude counters en nieuwe state gelijk."""
        self.state.epoch = self.current_epoch
        self.state.step = self.current_batch
        self.state.global_step = self.global_step
        self.state.optimizer_step = self.optimizer_step
        if loss is not None:
            self.state.last_loss = float(loss)
        self.state.learning_rate = self.get_learning_rate()

    def get_learning_rate(self):
        """Geeft de huidige learning rate terug."""
        if not self.optimizer.param_groups:
            return None
        return float(self.optimizer.param_groups[0].get("lr", 0.0))

    def _total_optimizer_steps(self, loader, epochs):
        """Schat het aantal optimizer stappen als de loader lengte heeft."""
        try:
            batches = len(loader)
        except TypeError:
            return None
        accumulation = getattr(self.config, "gradient_accumulation_steps", 1)
        steps_per_epoch = math.ceil(batches / accumulation)
        total = steps_per_epoch * max(epochs - self.current_epoch, 0)
        max_steps = getattr(self.config, "max_steps", None)
        if max_steps is not None:
            total = min(total, max_steps)
        return total

    def _optimizer_step(self):
        """Voert optimizer, clipping, scaler en scheduler samen uit."""
        grad_clip = getattr(
            self.config,
            "max_grad_norm",
            getattr(self.config, "grad_clip", None),
        )
        if self.precision.scaler.is_enabled():
            self.precision.scaler.unscale_(self.optimizer)
        if grad_clip is not None and grad_clip > 0:
            torch.nn.utils.clip_grad_norm_(self.model.parameters(), grad_clip)

        if self.precision.scaler.is_enabled():
            self.precision.scaler.step(self.optimizer)
            self.precision.scaler.update()
        else:
            self.optimizer.step()

        if self.scheduler is not None:
            self.scheduler.step()
        self.optimizer.zero_grad(set_to_none=True)
        self.optimizer_step += 1
    
    def train(
        self,
        loader=None,
        epochs=None,
        val_loader=None,
        early_stopping_patience=None,
        min_delta=None,
        checkpoint_callback=None,
        checkpoint_epoch_interval=None,
        checkpoint_batch_interval=None,
        resume_from_checkpoint=None,
    ):
        """Start de training en geeft de laatste state terug.
        
        Args:
            loader: Optionele train dataloader voor de oude API.
            epochs: Optioneel aantal epochs. Als dit ontbreekt gebruikt de trainer de config.
            val_loader: Optionele validatie dataloader.
            resume_from_checkpoint: Checkpoint map of bestand om te hervatten.

        Returns:
            De bijgewerkte `TrainingState`.
        """
        if resume_from_checkpoint is not None:
            self.load_checkpoint(resume_from_checkpoint)

        loader = self._get_train_loader(loader)
        val_loader = self._get_validation_loader(val_loader)
        epochs = epochs if epochs is not None else self._config_epochs()

        if loader is None:
            warnings.warn(
                "No training loader was provided; training cannot start.",
                RuntimeWarning,
                stacklevel=2,
            )
            raise ValueError("loader is required for training.")

        if epochs is None:
            warnings.warn(
                "No epoch count was provided. Pass epochs or config.num_epochs.",
                RuntimeWarning,
                stacklevel=2,
            )
            raise ValueError("epochs is required for training.")

        if epochs <= 0:
            warnings.warn(
                f"epochs must be greater than zero; got {epochs}.",
                RuntimeWarning,
                stacklevel=2,
            )
            return

        if self.scheduler is None:
            self.scheduler = create_scheduler(
                self.optimizer,
                self.config,
                self._total_optimizer_steps(loader, epochs),
            )

        try:
            loader_batches = len(loader)
        except TypeError:
            loader_batches = None

        if loader_batches == 0:
            warnings.warn(
                "The training loader has no batches; nothing will be trained.",
                RuntimeWarning,
                stacklevel=2,
            )
            return


        checkpoint_epoch_interval = self._resolve_checkpoint_interval( 
            checkpoint_epoch_interval,
            getattr(self.config, "checkpoint_interval", None),
        )
        checkpoint_batch_interval = self._resolve_checkpoint_interval(
            checkpoint_batch_interval,
            getattr(self.config, "checkpoint_batch_interval", None),
        )

        if checkpoint_callback is None:
            checkpoint_callback = getattr(self.config, "checkpoint_callback", None)

        if (
            checkpoint_callback is not None
            and checkpoint_epoch_interval == 0
            and checkpoint_batch_interval == 0
        ):
            checkpoint_epoch_interval = 1

        if checkpoint_callback is None and (
            checkpoint_epoch_interval > 0 or checkpoint_batch_interval > 0
        ):
            checkpoint_callback = self._default_checkpoint_callback

        if early_stopping_patience is not None and val_loader is None:
            warnings.warn(
                "early_stopping_patience was set, but no val_loader was provided; "
                "early stopping will be ignored.",
                RuntimeWarning,
                stacklevel=2,
            )

        if self.current_epoch >= epochs:
            print(
                f"\n[OK] Training already complete "
                f"({self.current_epoch}/{epochs} epochs)."
            )
            if val_loader is not None and getattr(self.config, "restore_best_model", True):
                self.restore_best_model()
            if self._owns_event_logger and self.event_logger is not None:
                self.event_logger.close()
                self.event_logger = None
            return

        self.model.train()
        train_start = time.time()
        if self.event_logger is not None:
            self.event_logger.info(
                "training_started",
                epochs=epochs,
                current_epoch=self.current_epoch,
                device=str(self.device),
            )
        if min_delta is None:
            min_delta = getattr(self.config, "early_stopping_min_delta", 0.0)
        accumulation_steps = getattr(self.config, "gradient_accumulation_steps", 1)
        save_every_steps = getattr(
            self.config,
            "save_every_steps",
            0 if not isinstance(self.config, TrainingConfig) else 500,
        )
        
        if self.current_epoch > 0:
            print(f"\n[OK] Resuming training from epoch {self.current_epoch + 1}/{epochs}.")

        self.optimizer.zero_grad(set_to_none=True)
        self._call_callbacks("on_train_start")

        for epoch in range(self.current_epoch, epochs):
            epoch_start = time.time()
            total_loss = 0
            log_interval = getattr(self.config, "training_log_interval", 50)
            if isinstance(self.config, TrainingConfig):
                log_interval = self.config.log_every_steps
            total_batches = loader_batches if loader_batches is not None else "?"
            batches_seen = 0
            pending_accumulation = 0
            self.current_epoch = epoch
            self._sync_state_from_counters()
            self._call_callbacks("on_epoch_start", self.state)
            
            for batch_idx, batch in enumerate(loader, start=1):
                batches_seen = batch_idx
                with self.precision.autocast():
                    loss = self.training_step(batch)

                # We delen de loss door het aantal accumulation-stappen,
                # zodat de gradients dezelfde schaal houden.
                loss_for_backward = loss / accumulation_steps
                if self.precision.scaler.is_enabled():
                    self.precision.scaler.scale(loss_for_backward).backward()
                else:
                    loss_for_backward.backward()
                
                loss_value = float(loss.detach().item())
                total_loss += loss_value
                self.current_batch = batch_idx
                self.global_step += 1
                pending_accumulation += 1

                should_step = pending_accumulation >= accumulation_steps
                if should_step:
                    self._optimizer_step()
                    pending_accumulation = 0

                self._sync_state_from_counters(loss_value)
                self._call_callbacks("on_step_end", self.state)

                if (
                    checkpoint_batch_interval > 0
                    and checkpoint_callback is not None
                    and self.global_step % checkpoint_batch_interval == 0
                ):
                    self._call_checkpoint_callback(
                        checkpoint_callback,
                        event="batch_checkpoint",
                        epoch=epoch + 1,
                        batch=batch_idx,
                        total_batches=total_batches,
                        global_step=self.global_step,
                    )

                if (
                    save_every_steps
                    and save_every_steps > 0
                    and self.global_step % save_every_steps == 0
                ):
                    checkpoint_path = self.save_checkpoint()
                    self._call_callbacks("on_checkpoint_save", checkpoint_path)

                if log_interval and batch_idx % log_interval == 0:
                    elapsed = time.time() - epoch_start
                    batches_per_second = batch_idx / elapsed if elapsed else 0.0
                    remaining_batches = (
                        total_batches - batch_idx
                        if isinstance(total_batches, int)
                        else 0
                    )
                    eta_seconds = (
                        remaining_batches / batches_per_second
                        if batches_per_second
                        else 0.0
                    )
                    print(
                        f"Epoch {epoch+1}/{epochs} | "
                        f"Batch {batch_idx}/{total_batches} | "
                        f"Loss = {loss_value:.4f} | "
                        f"Elapsed = {elapsed:.1f}s | "
                        f"ETA = {eta_seconds:.1f}s",
                        flush=True,
                    )
                    if self.event_logger is not None:
                        self.event_logger.metric(
                            "batch_completed",
                            epoch=epoch + 1,
                            batch=batch_idx,
                            total_batches=total_batches,
                            loss=loss_value,
                            elapsed_seconds=elapsed,
                            eta_seconds=eta_seconds,
                        )
                    # try:
                    #     if checkpoint_callback is not None:
                    #         checkpoint_callback(self)
                    # except Exception as e:
                    #     pass # in the feaurue i want to add logging functions

                max_steps = getattr(self.config, "max_steps", None)
                if max_steps is not None and self.optimizer_step >= max_steps:
                    break

            
            # Average training loss
            if batches_seen == 0:
                warnings.warn(
                    "The training loader yielded no batches; stopping training.",
                    RuntimeWarning,
                    stacklevel=2,
                )
                break
            if pending_accumulation:
                self._optimizer_step()
                self._sync_state_from_counters()
            avg_train_loss = total_loss / batches_seen
            self.train_losses.append(avg_train_loss)
            self.state.last_loss = float(avg_train_loss)
            
            epoch_time = time.time() - epoch_start
            
            # Validation
            val_loss = None
            should_stop = False
            if val_loader is not None:
                val_metrics = self._validate(val_loader)
                val_loss = val_metrics["loss"]
                self.state.last_validation_loss = float(val_loss)
                self.val_losses.append(val_loss)
                self.val_perplexities.append(val_metrics["perplexity"])
                self.val_token_accuracies.append(val_metrics["token_accuracy"])
                self._call_callbacks("on_evaluate", val_metrics)
                
                # Bereken de generalisatie gap.
                gen_gap = val_loss - avg_train_loss
                
                print(
                    f"Epoch {epoch+1}/{epochs}: "
                    f"Train Loss = {avg_train_loss:.4f} | "
                    f"Val Loss = {val_loss:.4f} | "
                    f"Val PPL = {val_metrics['perplexity']:.2f} | "
                    f"Val Acc = {val_metrics['token_accuracy']*100:.2f}% | "
                    f"Gen Gap = {gen_gap:.4f} | "
                    f"Time = {epoch_time:.2f}s"
                )
                if self.event_logger is not None:
                    self.event_logger.metric(
                        "epoch_completed",
                        epoch=epoch + 1,
                        train_loss=float(avg_train_loss),
                        val_loss=float(val_loss),
                        val_perplexity=float(val_metrics["perplexity"]),
                        val_token_accuracy=float(val_metrics["token_accuracy"]),
                        generalization_gap=float(gen_gap),
                        epoch_seconds=epoch_time,
                    )
                
                # Early stopping
                if early_stopping_patience is not None:
                    if self._check_early_stopping(val_loss, early_stopping_patience, min_delta):
                        print(f"\n[WARNING]  Early stopping at epoch {epoch+1}")
                        print(f"   Best validation loss: {self.best_val_loss:.4f}")
                        should_stop = True
                else:
                    self._update_best_validation(val_loss, min_delta)
            else:
                print(
                    f"Epoch {epoch+1}/{epochs}: "
                    f"Loss = {avg_train_loss:.4f} | "
                    f"Time = {epoch_time:.2f}s"
                )
                if self.event_logger is not None:
                    self.event_logger.metric(
                        "epoch_completed",
                        epoch=epoch + 1,
                        train_loss=float(avg_train_loss),
                        epoch_seconds=epoch_time,
                    )

            self.current_epoch = epoch + 1
            self.state.epoch = self.current_epoch
            if self.state.best_loss is None:
                self.state.best_loss = val_loss if val_loss is not None else avg_train_loss
            else:
                candidate = val_loss if val_loss is not None else avg_train_loss
                self.state.best_loss = min(self.state.best_loss, candidate)
            self._call_callbacks("on_epoch_end", self.state)

            if (
                checkpoint_epoch_interval > 0
                and checkpoint_callback is not None
                and self.current_epoch % checkpoint_epoch_interval == 0
            ):
                self._call_checkpoint_callback(
                    checkpoint_callback,
                    event="epoch_checkpoint",
                    epoch=self.current_epoch,
                    batch=self.current_batch,
                    total_batches=total_batches,
                    global_step=self.global_step,
                )

            if should_stop:
                break
            max_steps = getattr(self.config, "max_steps", None)
            if max_steps is not None and self.optimizer_step >= max_steps:
                break
        
        total_train_time = time.time() - train_start
        self.state.elapsed_seconds += total_train_time
        hours = int(total_train_time // 3600)
        minutes = int((total_train_time % 3600) // 60)
        seconds = int(total_train_time % 60)
        if val_loader is not None and getattr(self.config, "restore_best_model", True):
            self.restore_best_model()
        print(f"\n[OK] Training completed in {hours}h {minutes}m {seconds}s")
        if self.event_logger is not None:
            self.event_logger.info(
                "training_completed",
                epochs_completed=self.current_epoch,
                total_seconds=total_train_time,
            )
        if self._owns_event_logger and self.event_logger is not None:
            self.event_logger.close()
            self.event_logger = None
        self._call_callbacks("on_train_end")
        return self.state

    def training_step(self, batch):
        """Voert één training step uit en geeft de loss terug.

        Dict batches met `x` en `y` gebruiken de ArcLM token-loss. Andere
        dict batches worden als keyword arguments aan het model gegeven en
        moeten zelf een `loss` teruggeven.
        """
        if isinstance(batch, dict) and "x" not in batch:
            prepared = self.prepare_batch(batch)
            outputs = self.model(**prepared)
            if hasattr(outputs, "loss"):
                return outputs.loss
            if isinstance(outputs, dict) and "loss" in outputs:
                return outputs["loss"]
            raise TrainingError("Model output must contain a loss for dictionary batches")

        x, y, loss_mask = self.unpack_batch(batch)
        logits = self.model(x)
        return self.compute_loss(logits, y, loss_mask)

    def evaluate(self, dataset=None):
        """Voert evaluatie uit en geeft metrics terug.

        Args:
            dataset: Optionele dataset. Als deze ontbreekt gebruikt de trainer
                de ingestelde validatie dataloader of dataset.
        """
        val_loader = self._get_validation_loader(dataset=dataset)
        if val_loader is None:
            raise ValueError("validation dataset or dataloader is required for evaluation")
        from ..evaluation import Accuracy, EvaluationConfig, Evaluator, LossMetric, Perplexity

        def loss_fn(logits, labels, batch):
            """Berekent dezelfde loss als de trainer."""
            loss_mask = batch.get("mask") if isinstance(batch, dict) else None
            return self.compute_loss(logits, labels, loss_mask)

        evaluator = Evaluator(
            model=self.model,
            dataloader=val_loader,
            config=EvaluationConfig(
                batch_size=self._config_batch_size(),
                device=str(self.device),
            ),
            metrics=[
                LossMetric(),
                Perplexity(),
                Accuracy(ignore_index=-100),
            ],
            loss_fn=loss_fn,
        )
        result = evaluator.evaluate()
        metrics = {
            "loss": result.metrics["loss"],
            "perplexity": result.metrics["perplexity"],
            "token_accuracy": result.metrics["accuracy"] or 0.0,
        }
        self.state.last_validation_loss = float(metrics["loss"])
        self._call_callbacks("on_evaluate", metrics)
        return metrics
    
    def _validate(self, val_loader):
        """Bereken validation loss, perplexity, en token accuracy."""
        self.model.eval()
        total_loss = 0
        correct_tokens = 0
        total_tokens = 0
        log_interval = getattr(self.config, "training_log_interval", 50)
        total_batches = len(val_loader)
        validation_start = time.time()
        
        with torch.no_grad():
            for batch_idx, batch in enumerate(val_loader, start=1):
                if isinstance(batch, dict) and "x" not in batch:
                    prepared = self.prepare_batch(batch)
                    outputs = self.model(**prepared)
                    if hasattr(outputs, "loss"):
                        loss = outputs.loss
                    elif isinstance(outputs, dict) and outputs.get("loss") is not None:
                        loss = outputs["loss"]
                    else:
                        raise TrainingError("Model output must contain a loss for validation")
                    if hasattr(outputs, "logits"):
                        logits = outputs.logits
                    elif isinstance(outputs, dict):
                        logits = outputs.get("logits")
                    else:
                        logits = None
                    y = prepared.get("labels")
                    loss_mask = prepared.get("attention_mask")
                else:
                    x, y, loss_mask = self.unpack_batch(batch)
                    logits = self.model(x)
                    loss = self.compute_loss(logits, y, loss_mask)
                
                total_loss += loss.item()
                if logits is not None and y is not None:
                    predictions = logits.argmax(dim=-1)
                    active = y != -100
                    if loss_mask is not None and tuple(loss_mask.shape) == tuple(y.shape):
                        active = active & loss_mask.bool()
                    correct_tokens += ((predictions == y) & active).sum().item()
                    total_tokens += int(active.sum().item())

                if log_interval and batch_idx % log_interval == 0:
                    elapsed = time.time() - validation_start
                    batches_per_second = batch_idx / elapsed if elapsed else 0.0
                    remaining_batches = total_batches - batch_idx
                    eta_seconds = (
                        remaining_batches / batches_per_second
                        if batches_per_second
                        else 0.0
                    )
                    print(
                        f"Validation | "
                        f"Batch {batch_idx}/{total_batches} | "
                        f"Elapsed = {elapsed:.1f}s | "
                        f"ETA = {eta_seconds:.1f}s",
                        flush=True,
                    )
         
        self.model.train()
        avg_loss = total_loss / len(val_loader)
        return {
            "loss": avg_loss,
            "perplexity": math.exp(min(avg_loss, 20)),
            "token_accuracy": correct_tokens / total_tokens if total_tokens else 0.0,
        }

    def prepare_batch(self, batch):
        """Zet tensors in een batch op het juiste apparaat."""
        if torch.is_tensor(batch):
            return batch.to(self.device)
        if isinstance(batch, dict):
            return {key: self.prepare_batch(value) for key, value in batch.items()}
        if isinstance(batch, tuple):
            return tuple(self.prepare_batch(value) for value in batch)
        if isinstance(batch, list):
            return [self.prepare_batch(value) for value in batch]
        return batch

    def unpack_batch(self, batch):
        """Zet tuple en dict batches om naar `x`, `y` en `loss_mask`."""
        if isinstance(batch, dict):
            try:
                x = batch["x"].to(self.device)
                y = batch["y"].to(self.device)
            except KeyError as exc:
                raise ValueError("Dictionary batches must contain 'x' and 'y'.") from exc
            loss_mask = batch.get("mask")
            if loss_mask is not None:
                loss_mask = loss_mask.to(self.device)
            return x, y, loss_mask

        x, y = batch
        return x.to(self.device), y.to(self.device), None

    def compute_loss(self, logits, y, loss_mask=None):
        """Berekent next-token loss, eventueel alleen op gemaskeerde tokens."""
        B, T, V = logits.shape
        if loss_mask is None:
            return self.criterion(
                logits.reshape(B * T, V),
                y.reshape(B * T),
            )

        if tuple(loss_mask.shape) != tuple(y.shape):
            raise ValueError(
                "Loss mask shape must match labels: "
                f"mask={tuple(loss_mask.shape)}, labels={tuple(y.shape)}."
            )

        loss_per_token = F.cross_entropy(
            logits.reshape(B * T, V),
            y.reshape(B * T),
            reduction="none",
        ).reshape(B, T)
        loss_mask = loss_mask.to(dtype=loss_per_token.dtype)
        return (loss_per_token * loss_mask).sum() / loss_mask.sum().clamp_min(1.0)

    def _unpack_batch(self, batch):
        """Oude alias voor `unpack_batch()`."""
        return self.unpack_batch(batch)

    def _compute_loss(self, logits, y, loss_mask=None):
        """Oude alias voor `compute_loss()`."""
        return self.compute_loss(logits, y, loss_mask)
    
    def _check_early_stopping(self, val_loss, patience, min_delta=0.0):
        """Controleert of early stopping nodig is.
        
        Generalisatie eigenschap: Stop training als model niet meer verbetert
        """
        if self._update_best_validation(val_loss, min_delta):
            return False
        else:
            self.patience_counter += 1
            if self.patience_counter >= patience:
                return True
        return False

    def _update_best_validation(self, val_loss, min_delta=0.0):
        """Houdt de beste validatie loss en weights bij."""
        if val_loss < self.best_val_loss - min_delta:
            self.best_val_loss = val_loss
            self.patience_counter = 0
            self.best_model_state_dict = copy.deepcopy(self.model.state_dict())
            return True
        return False

    def _resolve_checkpoint_interval(self, explicit_value, config_value):
        """Zet checkpoint intervallen om naar niet-negatieve integers."""
        value = explicit_value if explicit_value is not None else config_value
        if value in (None, False):
            return 0
        try:
            value = int(value)
        except (TypeError, ValueError):
            warnings.warn(
                f"Invalid checkpoint interval {value!r}; automatic checkpointing is disabled.",
                RuntimeWarning,
                stacklevel=3,
            )
            return 0
        if value < 0:
            warnings.warn(
                f"Checkpoint interval must be >= 0; got {value}. Disabling it.",
                RuntimeWarning,
                stacklevel=3,
            )
            return 0
        return value

    def _default_checkpoint_callback(self, trainer, **_context):
        """Slaat een standaard checkpoint op als er geen callback is."""
        trainer.save(trainer.config)

    def _call_checkpoint_callback(self, checkpoint_callback, **context):
        """Roept checkpoint callbacks aan en houdt oude callbacks geldig."""
        try:
            signature = inspect.signature(checkpoint_callback)
        except (TypeError, ValueError):
            checkpoint_callback(self, **context)
            return

        parameters = list(signature.parameters.values())
        accepts_kwargs = any(
            parameter.kind == inspect.Parameter.VAR_KEYWORD
            for parameter in parameters
        )
        positional_params = [
            parameter
            for parameter in parameters
            if parameter.kind
            in (
                inspect.Parameter.POSITIONAL_ONLY,
                inspect.Parameter.POSITIONAL_OR_KEYWORD,
            )
        ]

        if accepts_kwargs:
            checkpoint_callback(self, **context)
        elif len(positional_params) >= 2:
            checkpoint_callback(self, context)
        else:
            checkpoint_callback(self)

    def restore_best_model(self):
        """Herstelt weights van de beste validatie loss als die bestaat."""
        if self.best_model_state_dict is not None:
            self.model.load_state_dict(self.best_model_state_dict)
            print(f"[OK] Restored best validation model ({self.best_val_loss:.4f})")
    
    def get_generalization_gap(self):
        """Geeft de generalisatie gap terug."""
        if not self.train_losses or not self.val_losses:
            return None
        return self.val_losses[-1] - self.train_losses[-1]
    
    # ===================== FINETUNING SUPPORT =====================
    
    def freeze_layers(self, pattern: str = "blocks", verbose: bool = True) -> int:
        """Bevriest lagen waarvan de naam bij het patroon past.
        
        Args:
            pattern: Naamdeel van lagen die bevroren worden.
            verbose: Of de trainer info print.
        
        Returns:
            Het aantal bevroren parameters.
        """
        frozen_count = 0
        for name, param in self.model.named_parameters():
            if pattern in name:
                param.requires_grad = False
                frozen_count += 1
                if verbose:
                    print(f"  Froze: {name}")
        
        total = sum(1 for _ in self.model.parameters())
        if verbose:
            print(f"[OK] Frozen {frozen_count}/{total} parameters")
        return frozen_count
    
    def unfreeze_layers(self, pattern: str = None, verbose: bool = True) -> int:
        """Maakt alle of sommige lagen weer trainbaar.
        
        Args:
            pattern: Naamdeel van lagen. `None` betekent alle lagen.
            verbose: Of de trainer info print.
        
        Returns:
            Het aantal trainbaar gemaakte parameters.
        """
        unfrozen_count = 0
        for name, param in self.model.named_parameters():
            if pattern is None or pattern in name:
                param.requires_grad = True
                unfrozen_count += 1
                if verbose:
                    print(f"  Unfroze: {name}")
        
        print(f"✓ Unfrozen {unfrozen_count} parameters")
        return unfrozen_count
    
    def get_frozen_layers_info(self) -> dict:
        """Geeft info over bevroren en trainbare lagen.
        
        Returns:
            Een dict met `frozen`, `trainable`, `total` en `trainable_pct`.
        """
        frozen = sum(1 for p in self.model.parameters() if not p.requires_grad)
        total = sum(1 for _ in self.model.parameters())
        trainable = total - frozen
        return {
            "frozen": frozen,
            "trainable": trainable,
            "total": total,
            "trainable_pct": (trainable / total * 100) if total > 0 else 0,
        }
    
    def get_train_history(self):
        """Geeft de training history terug."""
        return {
            "train_losses": self.train_losses,
            "val_losses": self.val_losses,
            "val_perplexities": self.val_perplexities,
            "val_token_accuracies": self.val_token_accuracies,
            "best_val_loss": self.best_val_loss,
            "patience_counter": self.patience_counter,
            "current_epoch": self.current_epoch,
            "current_batch": self.current_batch,
            "global_step": self.global_step,
            "optimizer_step": self.optimizer_step,
        }

    def _config_to_dict(self):
        """Zet nieuwe en oude configs om naar een dict."""
        if hasattr(self.config, "to_dict"):
            return self.config.to_dict()
        return dict(vars(self.config))

    def _checkpoint_payload(self, tokenizer_metadata=None):
        """Maakt de checkpoint data voor nieuwe en oude save-methodes."""
        self._sync_state_from_counters()
        config_dict = self._config_to_dict()
        state_dict = self.state.to_dict()
        lifecycle_metadata = build_training_checkpoint_metadata(
            model=self.model,
            config=config_dict,
            training_state=state_dict,
            precision=getattr(self.config, "precision", "fp32"),
            device=str(self.device),
            tokenizer_metadata=tokenizer_metadata,
            extra={
                "format": "arclm-training-core",
                "checkpoint_format": CHECKPOINT_FORMAT,
                "checkpoint_version": CHECKPOINT_VERSION,
            },
        ).to_dict()
        checkpoint_metadata = build_checkpoint_metadata(
            trainer=self,
            config=config_dict,
            training_state=state_dict,
            lifecycle_metadata=lifecycle_metadata,
        )
        return {
            "checkpoint_format": CHECKPOINT_FORMAT,
            "checkpoint_version": CHECKPOINT_VERSION,
            "training_state_version": TRAINING_STATE_VERSION,
            "model_state_dict": self.model.state_dict(),
            "optimizer_state_dict": self.optimizer.state_dict(),
            "scheduler_state_dict": (
                self.scheduler.state_dict() if self.scheduler is not None else None
            ),
            "scaler_state_dict": self.precision.state_dict(),
            "rng_state": capture_rng_state(include_cuda=self.device.type == "cuda"),
            "training_state": state_dict,
            "config": config_dict,
            "current_epoch": self.current_epoch,
            "current_batch": self.current_batch,
            "global_step": self.global_step,
            "optimizer_step": self.optimizer_step,
            "patience_counter": self.patience_counter,
            "best_val_loss": self.best_val_loss,
            "best_model_state_dict": self.best_model_state_dict,
            "train_history": self.get_train_history(),
            "lifecycle_metadata": lifecycle_metadata,
            "checkpoint_metadata": checkpoint_metadata,
            "metadata": {
                "format": "arclm-training-core",
                "checkpoint_format": CHECKPOINT_FORMAT,
                "checkpoint_version": CHECKPOINT_VERSION,
                "precision": getattr(self.config, "precision", "fp32"),
                "artifact_kind": "training_checkpoint",
                "source_type": "native_checkpoint",
                "arclm_version": lifecycle_metadata["arclm_version"],
                "pytorch_version": lifecycle_metadata["pytorch_version"],
                "model_type": lifecycle_metadata["model_type"],
                "saved_at": time.time(),
            },
        }

    def _checkpoint_file(self, path):
        """Geeft het checkpoint bestand voor een pad terug."""
        return checkpoint_file(path)

    def save_checkpoint(self, path=None):
        """Slaat de huidige training op.

        Args:
            path: Checkpoint map of bestand. Zonder pad gebruikt de trainer
                `output_dir/checkpoint-{global_step}`.

        Raises:
            CheckpointError: Als opslaan mislukt.
        """
        if path is None:
            output_dir = Path(getattr(self.config, "output_dir", "outputs"))
            path = output_dir / f"checkpoint-{self.global_step}"
        checkpoint_file = self._checkpoint_file(path)
        try:
            atomic_save_checkpoint(self._checkpoint_payload(), checkpoint_file)
            return checkpoint_file.parent if not Path(path).suffix else checkpoint_file
        except Exception as error:
            if isinstance(error, CheckpointError):
                raise
            raise CheckpointError(f"Could not save checkpoint: {checkpoint_file}") from error
        finally:
            if checkpoint_file.exists():
                self._cleanup_checkpoints()

    def save_model_artifact(
        self,
        path,
        *,
        tokenizer=None,
        training_summary=None,
        evaluation_summary=None,
        overwrite=False,
    ):
        """Bewaart het getrainde model als finale artifact.

        Dit is niet bedoeld om training te hervatten. Daarvoor blijft
        `save_checkpoint()` de juiste API.
        """
        from ..lifecycle import save_model_artifact

        summary = dict(training_summary or {})
        summary.setdefault("final_epoch", self.current_epoch)
        summary.setdefault("global_step", self.global_step)
        summary.setdefault("optimizer_step", self.optimizer_step)
        if self.train_losses:
            summary.setdefault("final_loss", float(self.train_losses[-1]))
        if self.val_losses:
            summary.setdefault("best_validation_loss", float(self.best_val_loss))
        return save_model_artifact(
            self.model,
            path,
            config=self.config,
            tokenizer=tokenizer,
            training_summary=summary,
            evaluation_summary=evaluation_summary,
            overwrite=overwrite,
            provenance={"source": "arclm.training.Trainer"},
        )

    def load_checkpoint(self, path):
        """Laadt een training checkpoint.

        Args:
            path: Checkpoint map of bestand.

        Raises:
            CheckpointError: Als verplichte checkpoint-data ontbreekt.
        """
        checkpoint_file = self._checkpoint_file(path)
        checkpoint = safe_load_training_checkpoint(
            checkpoint_file,
            map_location=self.device,
        )

        self.model.load_state_dict(checkpoint["model_state_dict"])
        self.optimizer.load_state_dict(checkpoint["optimizer_state_dict"])
        if self.scheduler is None and checkpoint.get("scheduler_state_dict") is not None:
            total_steps = self._total_optimizer_steps(
                self._get_train_loader(),
                self._config_epochs() or 1,
            )
            self.scheduler = create_scheduler(self.optimizer, self.config, total_steps)
        if self.scheduler is not None and checkpoint.get("scheduler_state_dict") is not None:
            self.scheduler.load_state_dict(checkpoint["scheduler_state_dict"])
        self.precision.load_state_dict(checkpoint.get("scaler_state_dict"))
        self._restore_state_from_checkpoint(checkpoint)
        restore_rng_state(
            checkpoint.get("rng_state"),
            restore_cuda=self.device.type == "cuda",
        )
        return checkpoint

    def resume(self, path):
        """Laadt een checkpoint om daarna verder te trainen."""
        return self.load_checkpoint(path)

    def _restore_state_from_checkpoint(self, checkpoint):
        """Herstelt counters en history uit checkpoint data."""
        self.state = TrainingState.from_dict(checkpoint.get("training_state"))
        history = checkpoint.get("train_history", {})
        self.train_losses = history.get("train_losses", self.train_losses)
        self.val_losses = history.get("val_losses", self.val_losses)
        self.val_perplexities = history.get("val_perplexities", self.val_perplexities)
        self.val_token_accuracies = history.get(
            "val_token_accuracies",
            self.val_token_accuracies,
        )
        self.current_epoch = checkpoint.get("current_epoch", self.state.epoch)
        self.current_batch = checkpoint.get("current_batch", self.state.step)
        self.global_step = checkpoint.get("global_step", self.state.global_step)
        self.optimizer_step = checkpoint.get(
            "optimizer_step",
            self.state.optimizer_step,
        )
        self.patience_counter = checkpoint.get("patience_counter", self.patience_counter)
        self.best_val_loss = checkpoint.get("best_val_loss", self.best_val_loss)
        self.best_model_state_dict = checkpoint.get("best_model_state_dict")
        self._sync_state_from_counters(self.state.last_loss)

    def _cleanup_checkpoints(self):
        """Verwijdert oude automatische checkpoints als retention aan staat."""
        keep = getattr(self.config, "keep_last_checkpoints", None)
        if keep is None or keep <= 0:
            return
        output_dir = Path(getattr(self.config, "output_dir", "outputs"))
        if not output_dir.exists():
            return
        checkpoints = sorted(
            [
                path for path in output_dir.glob("checkpoint-*")
                if path.is_dir() and (path / "training.pt").exists()
            ],
            key=self._checkpoint_step,
        )
        while len(checkpoints) > keep:
            old = checkpoints.pop(0)
            shutil.rmtree(old, ignore_errors=True)

    def _checkpoint_step(self, path):
        """Haalt het stapnummer uit een checkpoint map."""
        try:
            return int(path.name.rsplit("-", 1)[1])
        except (IndexError, ValueError):
            return -1
    
    def save(
        self,
        config:Config,
        vocab=None,
        stoi=None,
        itos=None,
        tokenizer_metadata=None,
    ):
        """Slaat een oud-stijl ArcLM checkpoint op."""
        Path(config.model_path).parent.mkdir(parents=True, exist_ok=True)
        
        checkpoint = self._checkpoint_payload(tokenizer_metadata=tokenizer_metadata)
        checkpoint.update(
            {
                "vocab": vocab,
                "stoi": stoi,
                "itos": itos,
                "tokenizer_metadata": tokenizer_metadata,
                "block_size": getattr(config, "block_size", None),
                "vocab_size": getattr(config, "vocab_size", None),
            }
        )
        model_path = Path(config.model_path)
        temp_path = None
        try:
            with tempfile.NamedTemporaryFile(
                dir=model_path.parent,
                prefix=f".{model_path.name}.",
                suffix=".tmp",
                delete=False,
            ) as temp_file:
                temp_path = Path(temp_file.name)
            torch.save(checkpoint, temp_path)
            os.replace(temp_path, model_path)
        finally:
            if temp_path is not None and temp_path.exists():
                temp_path.unlink()
        print(f"[OK] Model saved to {config.model_path}")
    
    def load(self, model_path):
        """Laadt een oud-stijl ArcLM checkpoint."""
        checkpoint = safe_load_training_checkpoint(model_path, map_location=self.device)
        self.model.load_state_dict(checkpoint["model_state_dict"])
        self.optimizer.load_state_dict(checkpoint["optimizer_state_dict"])
        if self.scheduler is not None and checkpoint.get("scheduler_state_dict") is not None:
            self.scheduler.load_state_dict(checkpoint["scheduler_state_dict"])
        self.precision.load_state_dict(checkpoint.get("scaler_state_dict"))
        
        self._restore_state_from_checkpoint(checkpoint)
        restore_rng_state(
            checkpoint.get("rng_state"),
            restore_cuda=self.device.type == "cuda",
        )
        
        print(f"[OK] Model loaded from {model_path} at epoch {self.current_epoch}")
        return checkpoint
    
    def exists(self, model_path):
        """Controleert of een checkpoint bestaat."""
        return Path(model_path).exists()
