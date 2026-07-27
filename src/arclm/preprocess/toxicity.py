"""Lichte toxicity helpers voor preprocess filtering."""

from __future__ import annotations

BAD_WORDS = {"idiot", "stupid", "hate"}


def toxicity_score(text: str) -> float:
    """Geeft een simpele toxicity score op basis van woorden."""
    # Dit is bewust licht; een echte classifier kan later worden aangesloten.
    words = [w.strip(".,!?;:").lower() for w in text.split()]
    if not words:
        return 0.0
    hits = sum(1 for w in words if w in BAD_WORDS)
    return min(1.0, hits / max(1, len(words)) * 5)


def toxicity_reasons(text: str, cfg) -> list[str]:
    """Geeft een filterreden terug als toxicity te hoog is."""
    if not cfg.toxicity_enabled:
        return []
    score = toxicity_score(text)
    if score > cfg.max_toxicity_score:
        return [f"toxicity:{score:.2f}"]
    return []
