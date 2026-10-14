"""Simpele data pipeline voor ArcLM datasets."""

from __future__ import annotations

from collections.abc import Iterable
from typing import Any

from .base import BaseDataStep, BaseDeduplicator, BaseStreamingDataset
from .streaming import StreamingDataset
from ..exceptions import PipelineError


class DataPipeline:
    """Voert meerdere data-stappen na elkaar uit."""

    def __init__(self, steps: Iterable[Any] | None = None, progress_callback=None):
        """Maakt dit object klaar voor gebruik."""
        self.steps = list(steps or [])
        self.progress_callback = progress_callback

    def add(self, step: Any) -> None:
        """Voegt een stap toe aan het einde van de pipeline."""
        self.steps.append(step)

    def remove(self, step_or_index: Any) -> Any:
        """Verwijdert een stap op index of op object."""
        if isinstance(step_or_index, int):
            return self.steps.pop(step_or_index)
        self.steps.remove(step_or_index)
        return step_or_index

    def run(self, dataset):
        """Voert alle stappen uit en geeft de nieuwe dataset terug."""
        current = dataset

        for index, step in enumerate(self.steps):
            try:
                current = self._run_step(current, step)
            except Exception as error:
                name = step.__class__.__name__
                raise PipelineError(f"Data pipeline step {index} ({name}) failed.") from error

            if self.progress_callback is not None:
                self.progress_callback(index=index, step=step, dataset=current)

        return current

    def _run_step(self, dataset, step):
        """Interne helper voor `run_step`."""
        if isinstance(step, BaseDeduplicator) or hasattr(step, "deduplicate"):
            result = step.deduplicate(dataset)
            return getattr(result, "dataset", result)

        if isinstance(step, BaseDataStep) or hasattr(step, "process"):
            return self._run_example_step(dataset, step)

        if callable(step):
            return step(dataset)

        raise PipelineError(f"Unsupported pipeline step: {step!r}")

    def _run_example_step(self, dataset, step):
        """Interne helper voor `run_example_step`."""
        if isinstance(dataset, BaseStreamingDataset):
            return StreamingDataset(lambda: self._iter_processed(dataset, step))

        return list(self._iter_processed(dataset, step))

    def _iter_processed(self, dataset, step):
        """Interne helper voor `iter_processed`."""
        for example in dataset:
            # Zodra een stap None teruggeeft, verdwijnt dit voorbeeld.
            result = step.process(example)
            if result is not None:
                yield result
