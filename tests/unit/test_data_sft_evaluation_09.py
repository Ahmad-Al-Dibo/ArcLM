import json
import random

import pytest
import torch

from arclm.datasets import (
    build_dataset_report,
    create_dataset_manifest,
    validate_records,
)
from arclm.evaluation import EvaluationResult, build_evaluation_report
from arclm.exceptions import DatasetValidationError
from arclm.finetuning import (
    FineTuningConfig,
    get_sft_record_contract,
    validate_sft_records,
)
from arclm.models import get_model_capability
from arclm.tokenizers import Tokenizer
from arclm.tracking import set_reproducible_seed


def test_dataset_validation_strict_and_non_strict_modes():
    records = [
        {"id": "ok", "instruction": "Explain tokenization.", "response": "It makes tokens."},
        {"id": "missing", "instruction": "No response."},
        {"id": "empty", "instruction": "Blank response.", "response": " "},
        {"id": "type", "instruction": 12, "response": "bad"},
    ]

    result = validate_records(
        records,
        required_fields=["instruction", "response"],
        strict=False,
        record_id_field="id",
    )

    assert result.valid_count == 1
    assert result.invalid_count == 3
    assert result.invalid_indexes == [1, 2, 3]
    assert result.issues[0].record_id == "missing"
    assert "Dataset Validation" in result.summary()
    json.dumps(result.to_dict())

    with pytest.raises(DatasetValidationError, match="record 1"):
        validate_records(records, required_fields=["instruction", "response"])


def test_dataset_manifest_and_report_do_not_store_record_values():
    records = [
        {"instruction": "Explain tokens", "response": "Tokens are pieces."},
        {"instruction": "Explain ids", "response": "IDs are numbers."},
    ]
    validation = validate_records(
        records,
        required_fields=["instruction", "response"],
        strict=False,
    )
    tokenizer = Tokenizer(max_vocab=24)
    tokenizer.build(" ".join(f"{row['instruction']} {row['response']}" for row in records))
    manifest = create_dataset_manifest(
        dataset_name="tiny-instruction",
        source_type="memory",
        records_before=len(records),
        records_after=validation.valid_count,
        validation_result=validation,
        text_fields=["instruction", "response"],
        transformations_applied=["validation"],
        split_information={"train": 1, "validation": 1},
    )
    report = build_dataset_report(
        validation.valid_records,
        tokenizer=tokenizer,
        text_fields=["instruction", "response"],
        validation_result=validation,
        manifest=manifest,
        split_information={"train": 1, "validation": 1},
    )

    assert manifest.record_count_before_processing == 2
    assert report.record_count == 2
    assert report.token_count > 0
    assert report.unknown_token_rate == 0
    assert report.train_size == 1
    assert report.validation_size == 1
    assert "Explain tokens" not in report.to_json()
    assert "Dataset Report" in report.summary()


def test_sft_record_contract_and_validation_reuse_canonical_normalizer():
    contract = get_sft_record_contract("instruction_response")
    assert contract.required_fields == ("instruction", "response")
    assert "output" in contract.optional_fields

    records = [
        {"instruction": "Name library", "response": "ArcLM"},
        {"instruction": "Alias response", "output": "Also accepted"},
        {"instruction": "", "response": "bad"},
    ]
    result = validate_sft_records(
        records,
        FineTuningConfig(formatter="instruction_response"),
        strict=False,
    )

    assert result.valid_count == 2
    assert result.invalid_count == 1
    assert result.issues[0].code == "invalid_sft_record"


def test_evaluation_report_serializes_without_recalculating_metrics():
    result = EvaluationResult(
        metrics={"loss": 1.5, "accuracy": 0.25},
        num_examples=4,
        num_batches=2,
        metadata={"device": "cpu", "num_tokens": 12, "dataset_identity": "manifest:abc"},
    )

    report = build_evaluation_report(result, dataset_identity="manifest:abc")

    assert report.metrics["loss"] == 1.5
    assert report.num_tokens == 12
    assert report.dataset_identity == "manifest:abc"
    assert "Evaluation Report" in report.summary()
    json.dumps(report.to_dict())


def test_reproducible_seed_metadata_and_native_lora_capability():
    first = set_reproducible_seed(123)
    a = random.random()
    b = torch.rand(1).item()
    second = set_reproducible_seed(123)

    assert first["python_seeded"] is True
    assert second["torch_cpu_seeded"] is True
    assert random.random() == a
    assert torch.rand(1).item() == b
    assert get_model_capability("native").operations["LoRA"] == "Passed"
