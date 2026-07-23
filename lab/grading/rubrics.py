from __future__ import annotations


DEFAULT_RUBRIC = {
    "correctness": 50,
    "edge_cases": 15,
    "api_contract": 10,
    "code_quality": 10,
    "learner_tests": 10,
    "explanation": 5,
}

ARCHITECTURE_RUBRIC = {
    "technical_correctness": 30,
    "tradeoff_analysis": 25,
    "failure_handling": 20,
    "compatibility": 15,
    "clarity": 10,
}


def rubric_for_category(category: str) -> dict[str, int]:
    """Return the scoring rubric for a challenge category."""

    if category in {"architecture", "distributed", "lifecycle", "events", "registry"}:
        return dict(ARCHITECTURE_RUBRIC)
    return dict(DEFAULT_RUBRIC)

