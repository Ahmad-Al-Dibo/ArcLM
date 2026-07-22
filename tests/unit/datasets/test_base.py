from arclm.datasets import BaseDataStep, BaseDataset, BaseStreamingDataset


class TinyDataset(BaseDataset):
    def __init__(self):
        self.rows = [{"text": "one"}, {"text": "two"}]

    def __len__(self):
        return len(self.rows)

    def __getitem__(self, index):
        return self.rows[index]


class TinyStreamingDataset(BaseStreamingDataset):
    def __iter__(self):
        yield {"text": "one"}


class KeepStep(BaseDataStep):
    def process(self, example):
        return example


def test_base_dataset_iterates_with_indexes():
    assert list(TinyDataset()) == [{"text": "one"}, {"text": "two"}]


def test_base_streaming_dataset_can_be_iterated():
    assert list(TinyStreamingDataset()) == [{"text": "one"}]


def test_base_data_step_can_be_subclassed():
    assert KeepStep().process({"text": "ok"}) == {"text": "ok"}
