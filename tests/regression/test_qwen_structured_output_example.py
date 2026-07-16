"""Regression tests for the Qwen structured-output example."""

from __future__ import annotations

import importlib.util
import json
from pathlib import Path


EXAMPLE_DIR = Path(__file__).resolve().parents[2] / "examples" / "qwen3_0_6b_sft"


def load_module(name: str, path: Path):
    spec = importlib.util.spec_from_file_location(name, path)
    assert spec is not None
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(module)
    return module


def read_jsonl(path: Path) -> list[dict[str, object]]:
    rows: list[dict[str, object]] = []
    with path.open("r", encoding="utf-8") as handle:
        for line in handle:
            if line.strip():
                rows.append(json.loads(line))
    return rows


def test_qwen_sft_dataset_uses_structured_json_assistant_messages():
    rows = read_jsonl(EXAMPLE_DIR / "data" / "sample_sft.jsonl")

    assert rows
    for row in rows:
        messages = row["messages"]
        assert isinstance(messages, list)
        assistant = messages[-1]
        assert assistant["role"] == "assistant"

        parsed = json.loads(str(assistant["content"]))
        assert set(parsed) == {"task", "answer", "confidence", "tags"}
        assert parsed["task"]
        assert parsed["answer"]
        assert parsed["confidence"] in {"low", "medium", "high"}
        assert isinstance(parsed["tags"], list)


def test_structured_output_benchmark_scores_valid_and_invalid_json():
    benchmark = load_module(
        "qwen_structured_benchmark",
        EXAMPLE_DIR / "benchmark_base_vs_finetuned.py",
    )

    valid = benchmark.validate_structured_output(
        '{"task":"summarize","answer":"Short summary.","confidence":"high","tags":["summary"]}',
        ["task", "answer", "confidence", "tags"],
        "summarize",
        ["summary"],
    )
    invalid = benchmark.validate_structured_output(
        "not json",
        ["task", "answer", "confidence", "tags"],
        "summarize",
        ["summary"],
    )

    assert valid["valid_json"] is True
    assert valid["score"] == 1.0
    assert valid["errors"] == []
    assert invalid == {"valid_json": False, "score": 0.0, "errors": ["invalid_json"]}


def test_structured_output_validator_reports_actionable_errors():
    validator = load_module(
        "qwen_structured_validator",
        EXAMPLE_DIR / "validate_structured_outputs.py",
    )

    ok = validator.validate_row(
        {
            "id": "ok",
            "generated_text": (
                '{"task":"classify","answer":"Positive.","confidence":"medium",'
                '"tags":["sentiment"]}'
            ),
        }
    )
    bad = validator.validate_row(
        {
            "id": "bad",
            "generated_text": '{"task":"classify","answer":"","confidence":"sure","tags":"sentiment"}',
        }
    )

    assert ok == {"id": "ok", "valid": True, "errors": []}
    assert bad["id"] == "bad"
    assert bad["valid"] is False
    assert "answer must be a non-empty string" in bad["errors"]
    assert "confidence must be low, medium, or high" in bad["errors"]
    assert "tags must be a list of strings" in bad["errors"]
