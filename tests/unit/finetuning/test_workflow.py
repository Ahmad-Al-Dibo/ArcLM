import pytest

from arclm.exceptions import FineTuningError, FormattingError
from arclm.finetuning import (
    FineTuningConfig,
    FineTuningMode,
    PreparedFineTuningDataset,
    normalize_fine_tuning_example,
    prepare_fine_tuning_dataset,
)

from ._helpers import TinyTokenizer


def test_prepare_plain_text_and_prompt_completion_masks_prompt():
    tokenizer = TinyTokenizer()
    config = FineTuningConfig(
        formatter="prompt_completion",
        max_sequence_length=24,
        train_on_prompt=False,
    )

    prepared = prepare_fine_tuning_dataset(
        [{"prompt": "Say hi", "completion": "hello"}],
        tokenizer,
        config,
    )
    feature = prepared[0]

    assert isinstance(prepared, PreparedFineTuningDataset)
    assert prepared.report.records_valid == 1
    assert prepared.report.records_rejected == 0
    assert feature["input_ids"] == feature["attention_mask"] or all(
        value == 1 for value in feature["attention_mask"]
    )
    assert any(label == -100 for label in feature["labels"])
    assert any(label != -100 for label in feature["labels"])


def test_train_on_prompt_keeps_prompt_labels():
    tokenizer = TinyTokenizer()
    masked = prepare_fine_tuning_dataset(
        [{"instruction": "Say hi", "output": "hello"}],
        tokenizer,
        FineTuningConfig(formatter="instruction_response", train_on_prompt=False),
    )[0]
    unmasked = prepare_fine_tuning_dataset(
        [{"instruction": "Say hi", "output": "hello"}],
        tokenizer,
        FineTuningConfig(formatter="instruction_response", train_on_prompt=True),
    )[0]

    assert sum(label == -100 for label in masked["labels"]) > 0
    assert sum(label == -100 for label in unmasked["labels"]) == 0


def test_chat_schema_masks_only_assistant_messages_by_default():
    tokenizer = TinyTokenizer()
    prepared = prepare_fine_tuning_dataset(
        [
            {
                "messages": [
                    {"role": "system", "content": "Be short"},
                    {"role": "user", "content": "Hello"},
                    {"role": "assistant", "content": "Hi"},
                    {"role": "user", "content": "Bye"},
                    {"role": "assistant", "content": "Goodbye"},
                ]
            }
        ],
        tokenizer,
        FineTuningConfig(formatter="chat", max_sequence_length=40),
    )

    labels = prepared[0]["labels"]
    assert prepared.report.formatter == "chat"
    assert any(label == -100 for label in labels)
    assert sum(label != -100 for label in labels) >= 2


def test_chat_rejects_unknown_role_and_missing_assistant():
    with pytest.raises(FineTuningError, match="chat role"):
        prepare_fine_tuning_dataset(
            [{"messages": [{"role": "tool", "content": "x"}]}],
            TinyTokenizer(),
            FineTuningConfig(formatter="chat"),
        )

    with pytest.raises(FineTuningError, match="assistant"):
        prepare_fine_tuning_dataset(
            [{"messages": [{"role": "user", "content": "x"}]}],
            TinyTokenizer(),
            FineTuningConfig(formatter="chat"),
        )


def test_empty_response_is_rejected_and_skip_mode_reports_without_text():
    config = FineTuningConfig(
        formatter="instruction_response",
        skip_invalid_records=True,
        max_report_errors=1,
    )
    prepared = prepare_fine_tuning_dataset(
        [
            {"instruction": "Bad", "output": ""},
            {"instruction": "Good", "output": "ok"},
        ],
        TinyTokenizer(),
        config,
    )

    assert prepared.report.records_seen == 2
    assert prepared.report.records_valid == 1
    assert prepared.report.records_rejected == 1
    assert prepared.report.errors == [
        {
            "index": 0,
            "error": "FormattingError",
            "message": "response must not be empty",
        }
    ]


def test_truncation_reports_and_rejects_fully_masked_examples():
    tokenizer = TinyTokenizer()
    prepared = prepare_fine_tuning_dataset(
        [{"prompt": "one two three four five six", "completion": "answer"}],
        tokenizer,
        FineTuningConfig(
            formatter="prompt_completion",
            max_sequence_length=4,
            train_on_prompt=True,
        ),
    )

    assert prepared.report.records_truncated == 1

    with pytest.raises(FineTuningError, match="no trainable tokens"):
        prepare_fine_tuning_dataset(
            [{"prompt": "one two three four five six", "completion": "answer"}],
            tokenizer,
            FineTuningConfig(
                formatter="prompt_completion",
                max_sequence_length=3,
                train_on_prompt=False,
            ),
        )


def test_fingerprint_is_deterministic_and_record_is_unchanged():
    record = {"instruction": "Name", "output": "ArcLM", "extra": {"kept": True}}
    before = dict(record)
    config = FineTuningConfig(formatter="instruction_response")

    first = prepare_fine_tuning_dataset([record], TinyTokenizer(), config)
    second = prepare_fine_tuning_dataset([record], TinyTokenizer(), config)

    assert record == before
    assert first.report.dataset_fingerprint == second.report.dataset_fingerprint
    assert "ArcLM" not in str(first.report.to_dict())


def test_normalization_supports_causal_lm_mode():
    example = normalize_fine_tuning_example(
        {"text": "hello world"},
        0,
        FineTuningConfig(mode=FineTuningMode.CAUSAL_LM, formatter="plain_text"),
    )

    assert example.formatter == "plain_text"
    assert example.full_text == "hello world"
