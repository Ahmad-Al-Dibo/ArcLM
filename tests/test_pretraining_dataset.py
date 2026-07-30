import torch

from arclm_multilingual_pretraining.train import PretrainingDataset


class DummyTokenizer:
    def encode_text(self, text: str):
        return [1, 2, 3, 4, 5]


def test_pretraining_dataset_creates_padded_windows_for_short_texts():
    dataset = PretrainingDataset(["short sample"], DummyTokenizer(), block_size=64)

    assert len(dataset) == 1
    x, y = dataset[0]
    assert x.shape == (64,)
    assert y.shape == (64,)
    assert x.dtype == torch.long
    assert y.dtype == torch.long
