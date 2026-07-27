from arclm.finetuning import (
    SFTConfig,
    TokenizerAdapter,
    format_chat_example,
    format_instruction_example,
    format_prompt_response_example,
    format_text_example,
)

from ._helpers import TinyTokenizer


def test_plain_text_formatting():
    formatted = format_text_example({"text": "hello world"}, SFTConfig(max_length=8))

    assert formatted["text"] == "hello world"
    assert formatted["assistant_spans"] == []


def test_instruction_formatting_tracks_response_span():
    config = SFTConfig(
        instruction_field="instruction",
        input_field="input",
        response_field="output",
        max_length=16,
    )

    formatted = format_instruction_example(
        {"instruction": "Translate", "input": "Hallo", "output": "Hello"},
        config,
    )

    start, end = formatted["assistant_spans"][0]
    assert formatted["text"][start:end] == "Hello"


def test_prompt_response_formatting_tracks_response_span():
    config = SFTConfig(prompt_field="prompt", response_field="response", max_length=16)

    formatted = format_prompt_response_example(
        {"prompt": "What is Python?", "response": "A language."},
        config,
    )

    start, end = formatted["assistant_spans"][0]
    assert formatted["text"][start:end] == "A language."


def test_chat_formatting_supports_manual_and_native_template():
    config = SFTConfig(messages_field="messages", max_length=32)
    example = {
        "messages": [
            {"role": "system", "content": "Be short."},
            {"role": "user", "content": "Hi"},
            {"role": "assistant", "content": "Hello"},
        ]
    }

    manual = format_chat_example(example, config)
    native = format_chat_example(
        example,
        config,
        tokenizer_adapter=TokenizerAdapter(TinyTokenizer(chat_template=True)),
    )

    assert "assistant" in manual["text"]
    assert manual["assistant_spans"]
    assert native["assistant_spans"]
