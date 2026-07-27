def test_dataset_public_api():
    from arclm.datasets import (
        BaseDataStep,
        BaseDataset,
        BaseStreamingDataset,
        DataPipeline,
        DatasetLoader,
        ExactDeduplicator,
        load_dataset,
    )

    assert BaseDataset is not None
    assert BaseStreamingDataset is not None
    assert BaseDataStep is not None
    assert DataPipeline is not None
    assert DatasetLoader is not None
    assert ExactDeduplicator is not None
    assert load_dataset is not None


def test_dataset_cleaning_public_api():
    from arclm.datasets.cleaning import (
        FilterByLength,
        NormalizeWhitespace,
        RemoveEmptyText,
    )

    assert FilterByLength is not None
    assert NormalizeWhitespace is not None
    assert RemoveEmptyText is not None


def test_dataset_deduplication_public_api():
    from arclm.datasets.deduplication import ExactDeduplicator, deduplicate

    assert ExactDeduplicator is not None
    assert deduplicate is not None
