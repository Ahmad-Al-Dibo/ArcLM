from __future__ import annotations

from typing import Any

LAB_METADATA = {
    "id": "intermediate-08-intermediate-capstone",
    "title": "Build a tiny training workbench",
    "level": "intermediate",
    "category": "training",
    "type": "from_scratch",
    "estimated_minutes": 150,
    "points": 220,
    "requires_network": False,
    "requires_gpu": False,
    "production_code_modified": False
}

def run_training_workbench(*args: Any, **kwargs: Any) -> Any:
    """Complete `run_training_workbench` for `Build a tiny training workbench`.

    Purpose
    -------
    Practice the `training` concept in isolation before using or
    changing production ArcLM code.

    Parameters
    ----------
    *args, **kwargs:
        Replace this broad starter signature with explicit parameters when you
        implement the challenge.

    Returns
    -------
    Any
        A deterministic, JSON-safe result matching the README examples.

    Required behavior
    -----------------
    - Follow the input and output contracts in `README.md`.
    - Validate malformed input with clear exceptions.
    - Preserve caller-owned input objects unless mutation is explicitly allowed.
    - Use only CPU-compatible, local, bounded data.
    - Do not download data or models.
    - Do not modify production ArcLM modules.

    Example
    -------
    See the Normal, Edge, and Invalid examples in `README.md`.
    """
    pass

class WorkbenchReport:
    """Learner-owned type for `Build a tiny training workbench`.

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
