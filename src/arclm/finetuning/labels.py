"""Helpers voor SFT labels en masks."""

from __future__ import annotations

from collections.abc import Sequence

from ..exceptions import DataCollatorError


def create_labels(
    input_ids: Sequence[int],
    attention_mask: Sequence[int] | None = None,
    ignore_index: int = -100,
) -> list[int]:
    """Maakt labels en negeert padding tijdens de lossberekening."""
    labels = list(input_ids)
    if attention_mask is None:
        return labels
    return [
        token_id if active else ignore_index
        for token_id, active in zip(labels, attention_mask)
    ]


def mask_labels(
    input_ids: Sequence[int],
    active_mask: Sequence[int | bool],
    ignore_index: int = -100,
) -> list[int]:
    """Zet labels buiten de actieve mask op `ignore_index`."""
    if len(input_ids) != len(active_mask):
        raise DataCollatorError("active_mask length must match input_ids length")
    return [
        token_id if bool(active) else ignore_index
        for token_id, active in zip(input_ids, active_mask)
    ]


def assistant_mask_from_spans(
    text: str,
    input_ids: Sequence[int],
    spans: Sequence[tuple[int, int]],
    tokenizer_adapter,
    max_length: int | None = None,
    truncation: bool = True,
) -> list[int]:
    """Maakt een tokenmask voor assistant-spans in de tekst."""
    mask = [0] * len(input_ids)
    cursor = 0
    for start_char, end_char in spans:
        content = text[start_char:end_char]
        if not content:
            continue
        content_ids = tokenizer_adapter.encode(content, max_length=None, truncation=False)
        if not content_ids:
            continue
        prefix_ids = tokenizer_adapter.encode(
            text[:start_char],
            max_length=max_length,
            truncation=truncation,
        )
        start = _find_subsequence(input_ids, content_ids, max(0, len(prefix_ids) - 3))
        if start is None:
            start = _find_subsequence(input_ids, content_ids, cursor)
        if start is None:
            continue
        end = min(start + len(content_ids), len(mask))
        for index in range(start, end):
            mask[index] = 1
        cursor = end
    return mask


def _find_subsequence(values: Sequence[int], pattern: Sequence[int], start: int = 0):
    """Zoekt een reeks tokens in een grotere reeks."""
    if not pattern:
        return None
    max_start = len(values) - len(pattern)
    for index in range(start, max_start + 1):
        if list(values[index:index + len(pattern)]) == list(pattern):
            return index
    return None
