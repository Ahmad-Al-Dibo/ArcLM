"""Formatters voor SFT voorbeelden."""

from __future__ import annotations

from typing import Any

from ..exceptions import FormattingError
from .config import SFTConfig


def format_text_example(example: dict[str, Any], config: SFTConfig) -> dict[str, Any]:
    """Maakt tekst van een plain-text voorbeeld."""
    value = example.get(config.text_field or "text")
    if value is None:
        raise FormattingError(f"Example is missing text field: {config.text_field}")
    return {"text": str(value), "assistant_spans": []}


def format_instruction_example(example: dict[str, Any], config: SFTConfig) -> dict[str, Any]:
    """Maakt tekst van een instruction-response voorbeeld."""
    instruction_field = config.instruction_field or "instruction"
    response_field = config.response_field or "output"
    instruction = example.get(instruction_field)
    response = example.get(response_field)
    if instruction is None or response is None:
        raise FormattingError("Instruction examples require instruction and response fields")

    parts = [f"Instruction:\n{instruction}"]
    if config.input_field and example.get(config.input_field):
        parts.append(f"Input:\n{example[config.input_field]}")
    prompt = "\n\n".join(parts) + "\n\nResponse:\n"
    response_text = str(response)
    start = len(prompt)
    text = prompt + response_text
    return {"text": text, "assistant_spans": [(start, len(text))]}


def format_prompt_response_example(example: dict[str, Any], config: SFTConfig) -> dict[str, Any]:
    """Maakt tekst van een prompt-response voorbeeld."""
    prompt_field = config.prompt_field or "prompt"
    response_field = config.response_field or "response"
    prompt = example.get(prompt_field)
    response = example.get(response_field)
    if prompt is None or response is None:
        raise FormattingError("Prompt-response examples require prompt and response fields")
    prefix = f"Prompt:\n{prompt}\n\nResponse:\n"
    response_text = str(response)
    text = prefix + response_text
    return {"text": text, "assistant_spans": [(len(prefix), len(text))]}


def format_chat_example(example: dict[str, Any], config: SFTConfig, tokenizer_adapter=None) -> dict[str, Any]:
    """Maakt tekst van chat messages.

    Als de tokenizer een native template heeft, gebruiken we die voor de tekst.
    Voor assistant-only masks gebruiken we de fallback alleen wanneer we spans
    betrouwbaar uit de tekst kunnen halen.
    """
    messages = example.get(config.messages_field or "messages")
    if not isinstance(messages, list):
        raise FormattingError("Chat examples require a messages list")

    if tokenizer_adapter is not None and tokenizer_adapter.has_chat_template():
        try:
            text = tokenizer_adapter.apply_chat_template(
                messages,
                tokenize=False,
                add_generation_prompt=False,
            )
            spans = _assistant_spans_from_text(text, messages)
            return {"text": text, "messages": messages, "assistant_spans": spans}
        except Exception:
            if config.assistant_only_loss:
                raise FormattingError(
                    "Could not identify assistant spans from the chat template"
                )

    text, spans = _manual_chat_text(messages)
    return {"text": text, "messages": messages, "assistant_spans": spans}


def format_example(example: dict[str, Any], config: SFTConfig, tokenizer_adapter=None) -> dict[str, Any]:
    """Formatteert één voorbeeld volgens de gekozen datasetvorm."""
    dataset_format = config.dataset_format
    if dataset_format == "chat":
        return format_chat_example(example, config, tokenizer_adapter=tokenizer_adapter)
    if dataset_format == "instruction":
        return format_instruction_example(example, config)
    if dataset_format == "prompt_response":
        return format_prompt_response_example(example, config)
    return format_text_example(example, config)


def _manual_chat_text(messages: list[dict[str, Any]]) -> tuple[str, list[tuple[int, int]]]:
    """Maakt simpele chattekst en onthoudt assistant-spans."""
    parts = []
    spans = []
    cursor = 0
    for message in messages:
        role = str(message.get("role", "")).lower().strip()
        content = str(message.get("content", ""))
        prefix = f"{role}: "
        line = prefix + content
        start = cursor + len(prefix)
        end = start + len(content)
        if role == "assistant":
            spans.append((start, end))
        parts.append(line)
        cursor += len(line) + 1
    return "\n".join(parts), spans


def _assistant_spans_from_text(text: str, messages: list[dict[str, Any]]) -> list[tuple[int, int]]:
    """Zoekt assistant-teksten terug in gerenderde chattekst."""
    spans = []
    cursor = 0
    for message in messages:
        if str(message.get("role", "")).lower().strip() != "assistant":
            continue
        content = str(message.get("content", ""))
        start = text.find(content, cursor)
        if start < 0:
            continue
        end = start + len(content)
        spans.append((start, end))
        cursor = end
    return spans
