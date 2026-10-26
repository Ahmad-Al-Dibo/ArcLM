"""Translate text with the trained tiny model (native ArcLM path)."""

from __future__ import annotations

import re

from arclm.inference import load_model

import config as project


def _parse_translation(raw: str) -> str:
    """Extract the segment after the first '>' prompt marker."""
    text = raw.strip()
    if ">" in text:
        text = text.split(">", 1)[1]
    # Cut at the next training-style prompt if the model continues
    text = re.split(r"\btranslate\b", text, maxsplit=1)[0]
    text = re.sub(r"<UNK>", "", text)
    return text.strip().strip(".").strip()


def translate(checkpoint_path: str, text: str, max_new_tokens: int = 24) -> str:
    """Run one translation prompt through the native checkpoint."""
    prompt = f"translate {project.SOURCE_LANG} to {project.TARGET_LANG}: {text} >"
    model = load_model(checkpoint_path, device=project.DEVICE)
    raw = model.predict(
        prompt,
        max_new_tokens=max_new_tokens,
        temperature=0.1,
        repetition_penalty=1.1,
    )
    return _parse_translation(raw)

