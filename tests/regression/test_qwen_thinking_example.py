"""Regression tests for the Qwen thinking example."""

from __future__ import annotations

import importlib.util
from pathlib import Path


EXAMPLE_DIR = Path(__file__).resolve().parents[2] / "examples" / "qwen_thinking"


def load_usage_module():
    spec = importlib.util.spec_from_file_location("qwen_thinking_usage", EXAMPLE_DIR / "usage.py")
    assert spec is not None
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(module)
    return module


class ThinkingTokenizer:
    chat_template = "template"

    def __init__(self):
        self.calls = []

    def apply_chat_template(self, messages, **kwargs):
        self.calls.append(kwargs)
        return f"thinking={kwargs['enable_thinking']} messages={len(messages)}"


class LegacyTokenizer:
    chat_template = "template"

    def apply_chat_template(self, messages, **kwargs):
        if "enable_thinking" in kwargs:
            raise TypeError("enable_thinking is not supported")
        return f"legacy messages={len(messages)}"


def test_qwen_thinking_template_passes_enable_thinking():
    usage = load_usage_module()
    tokenizer = ThinkingTokenizer()

    text = usage.apply_chat_template(
        tokenizer,
        [{"role": "user", "content": "Solve this."}],
        enable_thinking=True,
    )

    assert text == "thinking=True messages=1"
    assert tokenizer.calls[0]["enable_thinking"] is True


def test_qwen_thinking_template_falls_back_for_legacy_tokenizer():
    usage = load_usage_module()

    text = usage.apply_chat_template(
        LegacyTokenizer(),
        [{"role": "user", "content": "Solve this."}],
        enable_thinking=True,
    )

    assert text == "legacy messages=1"


def test_split_thinking_text_extracts_final_answer():
    usage = load_usage_module()

    parsed = usage.split_thinking_text("<think>scratch work</think>\nFinal answer.")

    assert parsed == {
        "thinking_text": "scratch work",
        "final_answer": "Final answer.",
    }
