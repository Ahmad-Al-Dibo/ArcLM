import csv
import json

import pytest

from arclm import DataProcessor, ProcessedDataset, Tokenizer, load_dataset


def test_data_processor_loads_jsonl_transforms_and_splits(tmp_path):
    path = tmp_path / "data.jsonl"
    rows = [
        {"question": "What is ArcLM?", "context": "A library", "answer": "A compact LM toolkit"},
        {"question": "Use?", "context": "", "answer": "Training"},
        {"question": "", "context": "skip", "answer": "empty"},
    ]
    path.write_text(
        "\n".join(json.dumps(row) for row in rows),
        encoding="utf-8",
    )

    dataset = DataProcessor.load(path)
    processed = (
        dataset.clean()
        .filter(lambda row: bool(row.get("question")))
        .transform(
            format="instruction",
            mapping={
                "instruction": "question",
                "input": "context",
                "output": "answer",
            },
            template="{instruction}\n{input}\n{output}",
        )
    )
    splits = processed.split(train=0.5, validation=0.5, test=0.0, seed=1)

    assert processed.samples[0]["text"] == "What is ArcLM?\nA library\nA compact LM toolkit"
    assert len(splits["train"]) == 1
    assert len(splits["validation"]) == 1
    assert splits["test"] == []


def test_data_processor_loads_txt_and_tokenizes(tmp_path):
    path = tmp_path / "data.txt"
    path.write_text("arc lm\ntrains data", encoding="utf-8")

    tokenizer = Tokenizer(max_vocab=10)
    tokenizer.build("arc lm trains data")

    processed = DataProcessor.load(path).transform(format="pretraining").tokenize(tokenizer)

    assert processed.samples[0]["text"] == "arc lm"
    assert processed.samples[0]["tokens"] == tokenizer.encode_text("arc lm")


def test_data_processor_load_returns_processed_dataset_matching_dataset_loader(tmp_path):
    path = tmp_path / "rows.csv"
    with path.open("w", encoding="utf-8", newline="") as file:
        writer = csv.DictWriter(file, fieldnames=["text", "label"])
        writer.writeheader()
        writer.writerow({"text": "ArcLM", "label": "library"})
        writer.writerow({"text": "DatasetLoader", "label": "loader"})

    processed = DataProcessor.load(path)
    loaded_rows = load_dataset(path)

    assert isinstance(processed, ProcessedDataset)
    assert processed.samples == loaded_rows
    assert processed.source == str(path)


def test_data_processor_custom_loader_keeps_processing_workflow(tmp_path):
    path = tmp_path / "custom.data"
    path.write_text("ignored", encoding="utf-8")

    processed = DataProcessor.load(path, loader=lambda source: [{"text": source.name}])

    assert processed.samples == [{"text": "custom.data"}]
    assert processed.clean().samples == [{"text": "custom.data"}]


def test_data_processor_keeps_legacy_error_type_for_unknown_format(tmp_path):
    path = tmp_path / "rows.unsupported"
    path.write_text("ArcLM", encoding="utf-8")

    with pytest.raises(ValueError, match="Unsupported dataset format"):
        DataProcessor.load(path)
