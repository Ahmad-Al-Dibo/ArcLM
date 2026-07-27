import pytest
import torch

from arclm.exceptions import DataCollatorError
from arclm.finetuning import SFTConfig, SFTDataCollator

from ._helpers import TinyTokenizer


def test_collator_creates_labels_and_padding_for_text():
    collator = SFTDataCollator(
        tokenizer=TinyTokenizer(),
        config=SFTConfig(max_length=12, batch_size=2),
    )

    batch = collator([{"text": "hello world"}, {"text": "hello"}])

    assert set(batch) == {"input_ids", "attention_mask", "labels"}
    assert batch["input_ids"].shape[0] == 2
    assert torch.equal(batch["labels"][batch["attention_mask"] == 0], torch.full_like(batch["labels"][batch["attention_mask"] == 0], -100))


def test_collator_truncates_to_max_length():
    collator = SFTDataCollator(
        tokenizer=TinyTokenizer(),
        config=SFTConfig(max_length=3, truncation=True),
    )

    batch = collator([{"text": "one two three four five"}])

    assert batch["input_ids"].shape[1] == 3


def test_assistant_only_masking_for_instruction_data():
    tokenizer = TinyTokenizer()
    config = SFTConfig(
        instruction_field="instruction",
        input_field="input",
        response_field="output",
        assistant_only_loss=True,
        max_length=32,
    )
    collator = SFTDataCollator(tokenizer=tokenizer, config=config)

    batch = collator([{"instruction": "Translate", "input": "Hallo", "output": "Hello"}])

    assert (batch["labels"] != -100).sum().item() >= 1
    assert (batch["labels"] == -100).sum().item() >= 1


def test_assistant_only_masking_rejects_missing_span():
    collator = SFTDataCollator(
        tokenizer=TinyTokenizer(),
        config=SFTConfig(
            messages_field="messages",
            assistant_only_loss=True,
            max_length=16,
        ),
    )

    with pytest.raises(DataCollatorError, match="assistant tokens"):
        collator([{"messages": [{"role": "user", "content": "Hi"}]}])


def test_sequence_packing_is_disabled_by_default_and_optional():
    tokenizer = TinyTokenizer()
    unpacked = SFTDataCollator(
        tokenizer=tokenizer,
        config=SFTConfig(max_length=12, packing=False),
    )([{"text": "a"}, {"text": "b"}])
    packed = SFTDataCollator(
        tokenizer=tokenizer,
        config=SFTConfig(max_length=12, packing=True),
    )([{"text": "a"}, {"text": "b"}])

    assert unpacked["input_ids"].shape[0] == 2
    assert packed["input_ids"].shape[0] == 1
