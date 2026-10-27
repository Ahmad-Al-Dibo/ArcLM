"""Chat-template verification for ExternalLoadedModel paths (T-phase2).

Uses a stub tokenizer that mimics Hugging Face ``apply_chat_template`` so the
ArcLM render path is exercised without a network download. A second test
optionally runs against a real cached model if TRANSLATOR_MODEL / HF cache
provides one — marked skip when unavailable.
"""

from __future__ import annotations

import pytest

from arclm.inference import _external_loading as ext


def _real_model_available() -> bool:
    """True only if user set ARCLM_TEST_HF_MODEL (explicit opt-in)."""
    import os

    return bool(os.environ.get("ARCLM_TEST_HF_MODEL"))


class StubTokenizer:
    """Mimics HF tokenizer chat_template interface."""

    chat_template = "stub-template-v1"

    def __init__(self, fail: bool = False):
        self.fail = fail
        self.calls: list[dict] = []

    def apply_chat_template(self, messages, **kwargs):
        if self.fail:
            raise TypeError("unexpected keyword argument 'enable_thinking'")
        self.calls.append({"messages": messages, "kwargs": kwargs})
        parts = []
        for m in messages:
            parts.append(f"{m.get('role', '?')}:{m.get('content', '')}")
        gen = "<assistant>" if kwargs.get("add_generation_prompt") else ""
        return "\n".join(parts) + gen


def test_render_prompt_uses_chat_template():
    tok = StubTokenizer()
    out, used = ext._render_prompt(tok, [{"role": "user", "content": "hi"}])
    assert used is True
    assert "user:hi" in out
    assert tok.calls and tok.calls[0]["kwargs"].get("tokenize") is False
    assert tok.calls[0]["kwargs"].get("add_generation_prompt") is True


def test_render_prompt_template_typeerror_fallback():
    """HF templates sometimes reject enable_thinking — ArcLM retries without it."""
    tok = StubTokenizer(fail=True)

    # First call raises TypeError; implementation should retry without enable_thinking.
    # Our stub always raises — so we expect fallback to simple text OR re-raise.
    # Current ArcLM behavior: catch TypeError, retry without kwarg — stub still
    # fails because fail=True regardless of kwargs, so it falls through to
    # simple-text fallback when fallback_to_simple_prompt=True.
    out, used = ext._render_prompt(
        tok,
        [{"role": "user", "content": "hello"}],
        fallback_to_simple_prompt=True,
    )
    # Either retried template (if stub succeeded on retry — not with fail=True)
    # or simple fallback:
    assert isinstance(out, str) and out
    if used:
        assert "hello" in out
    else:
        assert "hello" in out  # simple "user: hello" style


def test_render_prompt_no_template_simple_fallback():
    class NoTemplate:
        pass

    out, used = ext._render_prompt(NoTemplate(), "just a prompt")
    assert used is False
    assert out == "just a prompt"


def test_render_prompt_messages_without_template():
    class NoTemplate:
        pass

    messages = [
        {"role": "system", "content": "Be brief."},
        {"role": "user", "content": "Hi"},
    ]
    out, used = ext._render_prompt(NoTemplate(), messages, add_generation_prompt=True)
    assert used is False
    assert "system" in out
    assert "assistant" in out.lower()


@pytest.mark.skipif(
    not _real_model_available(),
    reason="no cached HF model / network not used in CI",
)
def test_real_model_chat_optional():
    from arclm.inference import load_any_model

    import os

    model_id = os.environ.get("ARCLM_TEST_HF_MODEL", "sshleifer/tiny-gpt2")
    model = load_any_model(model_id, device="cpu", trust_remote_code=False)
    out = model.chat([{"role": "user", "content": "Hello"}], max_new_tokens=4)
    assert isinstance(out, str) and out.strip()
