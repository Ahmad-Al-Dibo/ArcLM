"""Eenvoudige evaluator voor ArcLM modellen."""

from __future__ import annotations

import inspect

import torch
from torch.utils.data import DataLoader

from ..exceptions import EvaluationError
from .base import BaseEvaluator, BaseMetric
from .callbacks import BaseEvaluationCallback
from .config import EvaluationConfig
from .metrics import Accuracy, LossMetric, Perplexity
from .result import EvaluationResult


class Evaluator(BaseEvaluator):
    """Voert evaluatie uit op een model en dataset.

    De evaluator berekent de gekozen metrics en geeft de resultaten terug in
    één duidelijk object.
    """

    def __init__(
        self,
        model,
        dataset=None,
        metrics: list[BaseMetric] | None = None,
        config: EvaluationConfig | None = None,
        dataloader=None,
        callbacks: list[BaseEvaluationCallback] | None = None,
        collate_fn=None,
        loss_fn=None,
    ):
        """Maakt een evaluator.

        Args:
            model: Het model dat geëvalueerd wordt.
            dataset: Dataset voor evaluatie.
            metrics: Metrics die per batch bijgewerkt worden.
            config: Evaluatie-instellingen.
            dataloader: Optionele bestaande dataloader.
            callbacks: Optionele callback lijst.
            loss_fn: Optionele loss functie als het model geen loss geeft.
        """
        self.model = model
        self.dataset = dataset
        self.dataloader = dataloader
        self.config = config or EvaluationConfig()
        self.metrics = metrics or [
            LossMetric(),
            Perplexity(),
            Accuracy(ignore_index=self.config.ignore_index),
        ]
        self.callbacks = list(callbacks or [])
        self.collate_fn = collate_fn
        self.loss_fn = loss_fn
        self.device = torch.device(self.config.device)
        self.model.to(self.device)

    def evaluate(self, dataset=None):
        """Voert de evaluatie uit en geeft de resultaten terug."""
        loader = self._get_loader(dataset)
        if loader is None:
            raise ValueError("dataset or dataloader is required for evaluation")

        for metric in self.metrics:
            metric.reset()

        was_training = self.model.training
        self.model.eval()
        predictions_out = [] if self.config.return_predictions else None
        labels_out = [] if self.config.return_predictions else None
        num_examples = 0
        num_batches = 0

        self._call_callbacks("on_evaluate_start")
        try:
            # Tijdens evaluatie hebben we geen gradients nodig.
            with torch.no_grad():
                for batch_index, batch in enumerate(loader, start=1):
                    if (
                        self.config.max_batches is not None
                        and batch_index > self.config.max_batches
                    ):
                        break
                    prepared = self.prepare_batch(batch)
                    outputs = self.forward(prepared)
                    loss = self.get_loss(outputs, prepared)
                    predictions = self.get_predictions(outputs)
                    targets = self.get_targets(prepared)

                    if predictions is None and any(
                        isinstance(metric, Accuracy) for metric in self.metrics
                    ):
                        raise EvaluationError("Evaluation requires logits or predictions")

                    for metric in self.metrics:
                        self.update_metric(metric, predictions, targets, loss, outputs, prepared)

                    num_batches += 1
                    num_examples += self.count_examples(targets, prepared)
                    if self.config.return_predictions:
                        predictions_out.append(
                            predictions.detach().cpu() if predictions is not None else None
                        )
                        labels_out.append(
                            targets.detach().cpu() if targets is not None else None
                        )
                    self._call_callbacks(
                        "on_batch_end",
                        batch_index,
                        {"loss": self._loss_value(loss)},
                    )
        finally:
            if was_training:
                self.model.train()

        result = EvaluationResult(
            metrics={metric.name: metric.compute() for metric in self.metrics},
            num_examples=num_examples,
            num_batches=num_batches,
            predictions=predictions_out,
            labels=labels_out,
            metadata={"device": str(self.device)},
        )
        self._call_callbacks("on_evaluate_end", result)
        return result

    def _get_loader(self, dataset=None):
        """Geeft de dataloader terug of maakt er één."""
        if dataset is not None:
            return self._build_loader(dataset)
        if self.dataloader is not None:
            return self.dataloader
        if self.dataset is not None:
            self.dataloader = self._build_loader(self.dataset)
            return self.dataloader
        return None

    def _build_loader(self, dataset):
        """Maakt een dataloader voor de dataset."""
        return DataLoader(
            dataset,
            batch_size=self.config.batch_size,
            shuffle=False,
            collate_fn=self.collate_fn,
        )

    def prepare_batch(self, batch):
        """Zet tensors in een batch op het evaluatie-apparaat."""
        if torch.is_tensor(batch):
            return batch.to(self.device)
        if isinstance(batch, dict):
            return {key: self.prepare_batch(value) for key, value in batch.items()}
        if isinstance(batch, tuple):
            return tuple(self.prepare_batch(value) for value in batch)
        if isinstance(batch, list):
            return [self.prepare_batch(value) for value in batch]
        return batch

    def forward(self, batch):
        """Voert de forward pass uit."""
        if isinstance(batch, dict):
            if "x" in batch:
                return self.model(batch["x"])
            return self.model(**batch)
        if isinstance(batch, (tuple, list)):
            inputs = batch[0]
            return self.model(inputs)
        return self.model(batch)

    def get_loss(self, outputs, batch):
        """Leest loss uit outputs of berekent die met `loss_fn`."""
        if hasattr(outputs, "loss") and outputs.loss is not None:
            return outputs.loss
        if isinstance(outputs, dict) and outputs.get("loss") is not None:
            return outputs["loss"]
        if self.loss_fn is not None:
            predictions = self.get_predictions(outputs)
            targets = self.get_targets(batch)
            if predictions is None or targets is None:
                return None
            try:
                return self.loss_fn(predictions, targets, batch)
            except TypeError:
                return self.loss_fn(predictions, targets)
        return None

    def get_predictions(self, outputs):
        """Leest logits of predictions uit model outputs."""
        if torch.is_tensor(outputs):
            return outputs
        if hasattr(outputs, self.config.prediction_key):
            return getattr(outputs, self.config.prediction_key)
        if isinstance(outputs, dict):
            if self.config.prediction_key in outputs:
                return outputs[self.config.prediction_key]
            return outputs.get("predictions")
        return None

    def get_targets(self, batch):
        """Leest labels of targets uit een batch."""
        if isinstance(batch, dict):
            if self.config.label_key in batch:
                return batch[self.config.label_key]
            if "targets" in batch:
                return batch["targets"]
            return batch.get("y")
        if isinstance(batch, (tuple, list)) and len(batch) >= 2:
            return batch[1]
        return None

    def count_examples(self, targets, batch=None) -> int:
        """Telt het aantal voorbeelden in een batch."""
        if torch.is_tensor(targets) and targets.ndim > 0:
            return int(targets.shape[0])
        if isinstance(batch, dict):
            for value in batch.values():
                if torch.is_tensor(value) and value.ndim > 0:
                    return int(value.shape[0])
        if isinstance(batch, (tuple, list)) and batch:
            first = batch[0]
            if torch.is_tensor(first) and first.ndim > 0:
                return int(first.shape[0])
        return 1

    def update_metric(self, metric, predictions, targets, loss, outputs, batch) -> None:
        """Werkt een metric bij met alleen de argumenten die hij accepteert."""
        values = {
            "predictions": predictions,
            "targets": targets,
            "loss": loss,
            "outputs": outputs,
            "batch": batch,
        }
        try:
            signature = inspect.signature(metric.update)
        except (TypeError, ValueError):
            metric.update(predictions, targets)
            return

        parameters = signature.parameters
        if any(parameter.kind == inspect.Parameter.VAR_KEYWORD for parameter in parameters.values()):
            metric.update(**values)
            return
        accepted = {
            name: value
            for name, value in values.items()
            if name in parameters
        }
        if accepted:
            metric.update(**accepted)
        else:
            metric.update(predictions, targets)

    def _call_callbacks(self, hook, *args) -> None:
        """Voert callback hooks uit."""
        for callback in self.callbacks:
            method = getattr(callback, hook, None)
            if method is not None:
                method(self, *args)

    def _loss_value(self, loss):
        """Zet loss om naar een normaal getal voor callbacks."""
        if loss is None:
            return None
        return float(loss.detach().item() if torch.is_tensor(loss) else loss)


def evaluate(model, dataset=None, metrics=None, config=None, **kwargs):
    """Voert evaluatie uit met de standaard `Evaluator`."""
    evaluator = Evaluator(
        model=model,
        dataset=dataset,
        metrics=metrics,
        config=config,
        **kwargs,
    )
    return evaluator.evaluate()
