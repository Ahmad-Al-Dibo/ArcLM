from arclm.datasets import DataPipeline
from arclm.datasets.cleaning import (
    DropFields,
    FilterByLength,
    NormalizeWhitespace,
    RemoveControlCharacters,
    RemoveEmptyText,
    RenameFields,
    SelectFields,
    StripText,
)


def test_text_cleaning_steps_clean_without_mutating_input():
    example = {"text": "  hello\t\tworld\x00  "}
    pipeline = DataPipeline([
        RemoveControlCharacters("text"),
        NormalizeWhitespace("text"),
        StripText("text"),
    ])

    result = pipeline.run([example])

    assert result == [{"text": "hello world"}]
    assert example["text"] == "  hello\t\tworld\x00  "


def test_remove_empty_text_drops_empty_examples():
    pipeline = DataPipeline([RemoveEmptyText("text")])

    assert pipeline.run([{"text": "ok"}, {"text": "   "}]) == [{"text": "ok"}]


def test_filter_by_length_drops_short_text():
    pipeline = DataPipeline([FilterByLength("text", min_length=4)])

    assert pipeline.run([{"text": "hey"}, {"text": "hello"}]) == [{"text": "hello"}]


def test_field_cleaning_steps_change_fields_explicitly():
    pipeline = DataPipeline([
        RenameFields({"question": "instruction"}),
        DropFields("unused"),
        SelectFields(["instruction", "answer"]),
    ])

    result = pipeline.run([
        {"question": "Q", "answer": "A", "unused": "x"},
    ])

    assert result == [{"instruction": "Q", "answer": "A"}]
