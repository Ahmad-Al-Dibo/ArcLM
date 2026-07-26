import csv
import json

import pytest

from arclm.datasets import DatasetConfig, DatasetLoader, StreamingDataset, load_dataset
from arclm.exceptions import DatasetLoadError, DatasetValidationError, StreamingError


def test_load_dataset_reads_json_list(tmp_path):
    path = tmp_path / "data.json"
    path.write_text(json.dumps([{"text": "hello"}]), encoding="utf-8")

    assert load_dataset(path) == [{"text": "hello"}]


def test_load_dataset_reads_jsonl(tmp_path):
    path = tmp_path / "data.jsonl"
    path.write_text('{"text": "one"}\n{"text": "two"}\n', encoding="utf-8")

    assert load_dataset(path) == [{"text": "one"}, {"text": "two"}]


def test_load_dataset_reads_csv(tmp_path):
    path = tmp_path / "data.csv"
    with path.open("w", encoding="utf-8", newline="") as file:
        writer = csv.DictWriter(file, fieldnames=["text", "label"])
        writer.writeheader()
        writer.writerow({"text": "hello", "label": "ok"})

    assert load_dataset(path) == [{"text": "hello", "label": "ok"}]


def test_load_dataset_reads_txt(tmp_path):
    path = tmp_path / "data.txt"
    path.write_text("hello\n\nworld\n", encoding="utf-8")

    assert load_dataset(path) == [{"text": "hello"}, {"text": "world"}]


def test_load_dataset_accepts_python_lists():
    assert load_dataset(["a", {"text": "b"}]) == [{"text": "a"}, {"text": "b"}]


def test_load_dataset_raises_error_for_missing_file(tmp_path):
    with pytest.raises(DatasetLoadError):
        load_dataset(tmp_path / "missing.jsonl")


def test_load_dataset_raises_error_for_invalid_format(tmp_path):
    path = tmp_path / "data.bin"
    path.write_text("x", encoding="utf-8")

    with pytest.raises(DatasetLoadError):
        load_dataset(path)


def test_load_dataset_validates_required_fields(tmp_path):
    path = tmp_path / "data.jsonl"
    path.write_text('{"text": "one"}\n', encoding="utf-8")

    with pytest.raises(DatasetValidationError):
        load_dataset(path, required_fields=["text", "label"])


def test_dataset_config_can_be_used_for_loading(tmp_path):
    path = tmp_path / "data.txt"
    path.write_text("hello\n", encoding="utf-8")

    config = DatasetConfig(source=path, text_field="content")

    assert load_dataset(config) == [{"content": "hello"}]


def test_streaming_jsonl_is_lazy(tmp_path):
    path = tmp_path / "data.jsonl"
    path.write_text('{"text": "one"}\n{"text": "two"}\n', encoding="utf-8")

    dataset = load_dataset(path, streaming=True)

    assert isinstance(dataset, StreamingDataset)
    assert list(dataset) == [{"text": "one"}, {"text": "two"}]


def test_streaming_rejects_json_files(tmp_path):
    path = tmp_path / "data.json"
    path.write_text("[]", encoding="utf-8")

    with pytest.raises(StreamingError):
        load_dataset(path, streaming=True)


def test_dataset_loader_keeps_old_config_prepare_shape():
    class Config:
        data_path = "data/data.txt"

    loader = DatasetLoader(Config())

    assert loader.config is not None
    assert hasattr(loader, "prepare")
    assert hasattr(loader, "load_tokens")
