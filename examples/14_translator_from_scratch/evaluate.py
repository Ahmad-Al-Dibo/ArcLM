"""Evaluate exact-match accuracy on held-out pairs (educational metric)."""

from __future__ import annotations

from arclm.evaluation import calculate_perplexity

from translate import translate


def evaluate_translator(
    checkpoint_path: str,
    pairs: list[dict[str, str]],
    max_examples: int = 5,
) -> dict:
    hits = 0
    total = 0
    samples = []
    for pair in pairs[:max_examples]:
        pred = translate(checkpoint_path, pair["src"], max_new_tokens=16)
        # Educational scoring: target appears in generation (substring)
        ok = pair["tgt"].lower() in pred.lower() or pred.lower().strip() == pair["tgt"].lower()
        hits += int(ok)
        total += 1
        samples.append(
            {
                "src": pair["src"],
                "expected": pair["tgt"],
                "raw_output": pred,
                "match": bool(ok),
            }
        )
    return {
        "examples": total,
        "matches": hits,
        "exact_or_contains_rate": hits / total if total else 0.0,
        "samples": samples,
        "note": (
            "Tiny causal model: low accuracy is expected; this is an "
            "educational pipeline, not production NMT."
        ),,
    }
