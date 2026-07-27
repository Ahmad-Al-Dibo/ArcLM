import pytest

from arclm.datasets import BaseDataStep, DataPipeline, ExactDeduplicator, StreamingDataset
from arclm.exceptions import PipelineError


class AddMark(BaseDataStep):
    def process(self, example):
        item = dict(example)
        item["mark"] = True
        return item


class DropEmpty(BaseDataStep):
    def process(self, example):
        if not example.get("text"):
            return None
        return example


class BadStep(BaseDataStep):
    def process(self, example):
        raise RuntimeError("boom")


def test_pipeline_runs_steps_in_order():
    dataset = [{"text": "hello"}]
    pipeline = DataPipeline([AddMark()])

    assert pipeline.run(dataset) == [{"text": "hello", "mark": True}]


def test_pipeline_removes_item_when_step_returns_none():
    dataset = [{"text": "hello"}, {"text": ""}]
    pipeline = DataPipeline([DropEmpty()])

    assert pipeline.run(dataset) == [{"text": "hello"}]


def test_pipeline_runs_deduplicator_steps():
    dataset = [{"text": "same"}, {"text": "same"}, {"text": "new"}]
    pipeline = DataPipeline([ExactDeduplicator(field="text")])

    assert pipeline.run(dataset) == [{"text": "same"}, {"text": "new"}]


def test_pipeline_can_add_and_remove_steps():
    pipeline = DataPipeline()
    step = AddMark()

    pipeline.add(step)
    removed = pipeline.remove(0)

    assert removed is step
    assert pipeline.steps == []


def test_pipeline_wraps_step_errors():
    pipeline = DataPipeline([BadStep()])

    with pytest.raises(PipelineError):
        pipeline.run([{"text": "hello"}])


def test_pipeline_keeps_streaming_steps_lazy():
    dataset = StreamingDataset(lambda: iter([{"text": "hello"}, {"text": ""}]))
    pipeline = DataPipeline([DropEmpty()])

    result = pipeline.run(dataset)

    assert isinstance(result, StreamingDataset)
    assert list(result) == [{"text": "hello"}]
