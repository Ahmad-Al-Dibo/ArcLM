"""Small structured-output benchmark for the Qwen3 SFT example."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

EXAMPLE_DIR = Path(__file__).resolve().parent
DEFAULT_PROMPTS = EXAMPLE_DIR / "data" / "benchmark_prompts.jsonl"
DEFAULT_BASE = EXAMPLE_DIR / "output" / "base_outputs.jsonl"
DEFAULT_FINETUNED = EXAMPLE_DIR / "output" / "finetuned_outputs.jsonl"
DEFAULT_OUTPUT = EXAMPLE_DIR / "output" / "benchmark_results.json"


def main():
    parser = argparse.ArgumentParser(description="Compare base and fine-tuned structured JSON outputs.")
    parser.add_argument("--prompts", default=str(DEFAULT_PROMPTS))
    parser.add_argument("--base-outputs", default=str(DEFAULT_BASE))
    parser.add_argument("--finetuned-outputs", default=str(DEFAULT_FINETUNED))
    parser.add_argument("--output", default=str(DEFAULT_OUTPUT))
    args = parser.parse_args()

    print("This is a small structured-output benchmark, not a full model evaluation.")
    results = compare_outputs(
        prompts_path=Path(args.prompts),
        base_outputs_path=Path(args.base_outputs),
        finetuned_outputs_path=Path(args.finetuned_outputs),
    )
    print_table(results)
    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(results, indent=2), encoding="utf-8")
    print(f"\nSaved benchmark results: {output_path}")


def compare_outputs(prompts_path: Path, base_outputs_path: Path, finetuned_outputs_path: Path):
    prompts = {row["id"]: row for row in read_jsonl(prompts_path)}
    base = {row["id"]: row for row in read_jsonl_required(base_outputs_path)}
    finetuned = {row["id"]: row for row in read_jsonl_required(finetuned_outputs_path)}
    results = []
    for prompt_id, prompt in prompts.items():
        required_keys = prompt.get("required_keys", [])
        expected_tags = prompt.get("expected_tags", [])
        required_task = prompt.get("required_task")
        base_text = base.get(prompt_id, {}).get("generated_text", "")
        finetuned_text = finetuned.get(prompt_id, {}).get("generated_text", "")
        base_check = validate_structured_output(base_text, required_keys, required_task, expected_tags)
        finetuned_check = validate_structured_output(
            finetuned_text,
            required_keys,
            required_task,
            expected_tags,
        )
        results.append({
            "id": prompt_id,
            "prompt": prompt["prompt"],
            "required_task": required_task,
            "required_keys": required_keys,
            "expected_tags": expected_tags,
            "base_output": base_text,
            "finetuned_output": finetuned_text,
            "base_valid_json": base_check["valid_json"],
            "finetuned_valid_json": finetuned_check["valid_json"],
            "base_score": base_check["score"],
            "finetuned_score": finetuned_check["score"],
            "base_errors": base_check["errors"],
            "finetuned_errors": finetuned_check["errors"],
        })
    return results


def validate_structured_output(text: str, required_keys, required_task, expected_tags):
    errors = []
    try:
        parsed = json.loads(text)
    except json.JSONDecodeError:
        return {"valid_json": False, "score": 0.0, "errors": ["invalid_json"]}

    if not isinstance(parsed, dict):
        return {"valid_json": False, "score": 0.0, "errors": ["json_is_not_object"]}

    score_parts = []
    missing_keys = [key for key in required_keys if key not in parsed]
    if missing_keys:
        errors.append(f"missing_keys:{','.join(missing_keys)}")
    score_parts.append(1.0 if not missing_keys else 0.0)

    if required_task:
        task_matches = parsed.get("task") == required_task
        if not task_matches:
            errors.append("task_mismatch")
        score_parts.append(1.0 if task_matches else 0.0)

    tags = parsed.get("tags", [])
    if not isinstance(tags, list):
        errors.append("tags_not_list")
        score_parts.append(0.0)
    elif expected_tags:
        normalized_tags = {str(tag).lower() for tag in tags}
        found = sum(1 for tag in expected_tags if str(tag).lower() in normalized_tags)
        score_parts.append(found / len(expected_tags))

    answer = parsed.get("answer")
    answer_ok = isinstance(answer, str) and bool(answer.strip())
    if not answer_ok:
        errors.append("answer_missing")
    score_parts.append(1.0 if answer_ok else 0.0)

    score = sum(score_parts) / len(score_parts) if score_parts else 0.0
    return {"valid_json": True, "score": score, "errors": errors}


def print_table(results):
    print()
    print(f"{'Prompt ID':<24} {'Base JSON':<10} {'Base Score':<12} {'Fine JSON':<10} {'Fine Score':<12}")
    for row in results:
        print(
            f"{row['id']:<24} "
            f"{str(row['base_valid_json']):<10} "
            f"{row['base_score']:<12.2f} "
            f"{str(row['finetuned_valid_json']):<10} "
            f"{row['finetuned_score']:<12.2f}"
        )


def read_jsonl_required(path: Path):
    if not path.exists():
        raise SystemExit(
            f"Missing output file: {path}\n"
            "Run test_base_model.py and test_finetuned_model.py before benchmarking."
        )
    return list(read_jsonl(path))


def read_jsonl(path: Path):
    with path.open("r", encoding="utf-8") as handle:
        for line in handle:
            if line.strip():
                yield json.loads(line)


if __name__ == "__main__":
    main()
