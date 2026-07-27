import pytest

from arclm.datasets import ExactDeduplicator, deduplicate
from arclm.datasets.deduplication import RemoveDuplicates
from arclm.exceptions import DeduplicationError


def test_exact_deduplicator_keeps_first_match():
    dataset = [{"text": "a"}, {"text": "a"}, {"text": "b"}]

    result = ExactDeduplicator(field="text").deduplicate(dataset)

    assert result.dataset == [{"text": "a"}, {"text": "b"}]
    assert result.kept == 2
    assert result.removed == 1


def test_exact_deduplicator_can_keep_last_match():
    dataset = [
        {"id": 1, "text": "a"},
        {"id": 2, "text": "a"},
        {"id": 3, "text": "b"},
    ]

    result = ExactDeduplicator(field="text", keep="last").deduplicate(dataset)

    assert result.dataset == [{"id": 2, "text": "a"}, {"id": 3, "text": "b"}]


def test_exact_deduplicator_normalizes_text():
    dataset = [{"text": "Hello   World"}, {"text": "hello world"}]

    result = ExactDeduplicator(field="text", normalize=True).deduplicate(dataset)

    assert result.removed == 1


def test_exact_deduplicator_hashes_keys():
    dataset = [{"text": "a"}, {"text": "a"}]

    result = ExactDeduplicator(field="text", hash_algorithm="sha256").deduplicate(dataset)

    assert result.removed == 1


def test_exact_deduplicator_can_error_for_missing_fields():
    with pytest.raises(DeduplicationError):
        ExactDeduplicator(field="text", missing="error").deduplicate([{"other": "x"}])


def test_deduplicate_function_returns_dataset_by_default():
    dataset = [{"text": "a"}, {"text": "a"}]

    assert deduplicate(dataset, field="text") == [{"text": "a"}]


def test_remove_duplicates_alias_points_to_exact_deduplicator():
    assert RemoveDuplicates is ExactDeduplicator
