import warnings


def test_old_data_processor_import_still_warns_and_works():
    with warnings.catch_warnings(record=True) as caught:
        warnings.simplefilter("always")
        from arclm.data_processor import DataProcessor

    assert DataProcessor is not None
    assert any("arclm.data_processor is deprecated" in str(item.message) for item in caught)


def test_old_dataset_loader_prepare_methods_still_exist():
    from arclm.datasets import DatasetLoader

    class Config:
        data_path = "data/data.txt"

    loader = DatasetLoader(Config())

    assert hasattr(loader, "prepare")
    assert hasattr(loader, "load_tokens")


def test_processed_dataset_clean_still_works():
    from arclm.datasets import ProcessedDataset

    dataset = ProcessedDataset([{"text": " hello   world "}]).clean()

    assert dataset.samples == [{"text": "hello world"}]
