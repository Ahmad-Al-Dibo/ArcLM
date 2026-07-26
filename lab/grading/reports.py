from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class GradeReport:
    """Small JSON-safe grading result."""

    challenge_id: str
    score: int
    max_score: int
    passed_public_tests: bool
    notes: tuple[str, ...] = ()

    def to_dict(self) -> dict[str, object]:
        return {
            "challenge_id": self.challenge_id,
            "score": self.score,
            "max_score": self.max_score,
            "passed_public_tests": self.passed_public_tests,
            "notes": list(self.notes),
        }

