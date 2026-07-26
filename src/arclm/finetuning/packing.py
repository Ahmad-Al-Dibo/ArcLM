"""Simpele sequence packing voor SFT."""

from __future__ import annotations


def pack_sequences(features: list[dict], max_length: int, eos_token_id: int | None = None):
    """Pakt korte voorbeelden samen tot maximaal `max_length` tokens.

    Deze basisversie pakt alleen binnen de huidige batch. Packing staat
    standaard uit, omdat sommige taken duidelijke voorbeeldgrenzen nodig hebben.
    """
    packed = []
    current = {"input_ids": [], "attention_mask": [], "labels": []}
    separator = [eos_token_id] if eos_token_id is not None else []

    for feature in features:
        input_ids = list(feature["input_ids"])
        labels = list(feature["labels"])
        attention_mask = list(feature.get("attention_mask", [1] * len(input_ids)))
        extra = separator if current["input_ids"] else []
        needed = len(extra) + len(input_ids)

        if current["input_ids"] and len(current["input_ids"]) + needed > max_length:
            packed.append(current)
            current = {"input_ids": [], "attention_mask": [], "labels": []}
            extra = []

        if extra:
            current["input_ids"].extend(extra)
            current["attention_mask"].extend([1] * len(extra))
            current["labels"].extend(extra)

        remaining = max_length - len(current["input_ids"])
        current["input_ids"].extend(input_ids[:remaining])
        current["attention_mask"].extend(attention_mask[:remaining])
        current["labels"].extend(labels[:remaining])

    if current["input_ids"]:
        packed.append(current)
    return packed
