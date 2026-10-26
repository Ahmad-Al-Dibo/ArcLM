"""Build chat-style messages for translation with an instruct model."""

from __future__ import annotations

from typing import Any


def build_translation_messages(
    text: str,
    source_lang: str,
    target_lang: str,
) -> list[dict[str, str]]:
    """OpenAI-style messages; ArcLM uses the tokenizer chat template when present."""
    system = (
        f"You are a careful translator. Translate from {source_lang} to {target_lang}. "
        "Reply with the translation only. No explanations."
    )
    user = f"Translate to {target_lang}:\n\n{text}"
    return [
        {"role": "system", "content": system},
        {"role": "user", "content": user},
    ]


def build_plain_prompt(text: str, source_lang: str, target_lang: str) -> str:
    return (
        f"Translate from {source_lang} to {target_lang}.\n"
        f"{text}\n"
        f"{target_lang}:"
    )
