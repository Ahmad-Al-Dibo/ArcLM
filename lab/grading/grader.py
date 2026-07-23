from __future__ import annotations

from lab.grading.reports import GradeReport
from lab.grading.rubrics import rubric_for_category


def grade_public_result(challenge_id: str, category: str, passed_public_tests: bool) -> GradeReport:
    """Create a bounded grade from public-test status and a category rubric."""

    rubric = rubric_for_category(category)
    max_score = sum(rubric.values())
    score = max_score if passed_public_tests else 0
    notes = () if passed_public_tests else ("Public tests did not pass.",)
    return GradeReport(
        challenge_id=challenge_id,
        score=score,
        max_score=max_score,
        passed_public_tests=passed_public_tests,
        notes=notes,
    )
