"""Translate with an open-source instruct model loaded through ArcLM."""

from __future__ import annotations

from typing import Any

import config as project
from prompts import build_plain_prompt, build_translation_messages


def translate_text(model: Any, text: str) -> str:
    messages = build_translation_messages(
        text, project.SOURCE_LANG, project.TARGET_LANG
    )
    try:
        raw = model.chat(
            messages,
            max_new_tokens=project.MAX_NEW_TOKENS,
            temperature=project.TEMPERATURE,
        )
    except Exception:
        # Fallback if the model path does not support .chat templates
        prompt = build_plain_prompt(
            text, project.SOURCE_LANG, project.TARGET_LANG
        )
        raw = model.predict(
            prompt,
            max_new_tokens=project.MAX_NEW_TOKENS,
            temperature=project.TEMPERATURE,
        )
    return _clean_translation(str(raw), text)


def _clean_translation(raw: str, source: str) -> str:
    """Strip echo of the prompt if the model repeats it."""
    text = raw.strip()
    # Remove common echo prefixes
    for marker in (f"{project.TARGET_LANG}:", "Translation:", "translation:"):
        if marker in text:
            text = text.split(marker, 1)[-1].strip()
    return text
