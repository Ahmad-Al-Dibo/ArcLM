from __future__ import annotations

from typing import Any

LAB_METADATA = {
    "id": "beginner-07-training-counters",
    "title": "Track training progress",
    "level": "beginner",
    "category": "training",
    "type": "from_scratch",
    "estimated_minutes": 45,
    "points": 100,
    "requires_network": False,
    "requires_gpu": False,
    "production_code_modified": False
}

class TrainingProgress:
    """Learner-owned type for `Track training progress`.

    Purpose
    -------
    Represent the challenge concept with a small, explicit Python API.

    Required behavior
    -----------------
    - Keep state deterministic and JSON-safe when serialized.
    - Validate invalid configuration values with clear errors.
    - Do not mutate caller-owned records unless explicitly permitted.
    - Do not read or write arbitrary filesystem paths.

    Example
    -------
    Construct the object from tiny in-memory values and compare the result
    with the examples in the README.
    """

    pass
