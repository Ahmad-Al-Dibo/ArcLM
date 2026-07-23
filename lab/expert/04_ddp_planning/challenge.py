from __future__ import annotations

from typing import Any

LAB_METADATA = {
    "id": "expert-04-ddp-planning",
    "title": "Model DDP responsibilities",
    "level": "expert",
    "category": "distributed",
    "type": "from_scratch",
    "estimated_minutes": 110,
    "points": 180,
    "requires_network": False,
    "requires_gpu": False,
    "production_code_modified": False
}

class DDPPartitionPlan:
    """Learner-owned type for `Model DDP responsibilities`.

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

def partition_indices_for_ranks(*args: Any, **kwargs: Any) -> Any:
    """Complete `partition_indices_for_ranks` for `Model DDP responsibilities`.

    Purpose
    -------
    Practice the `distributed` concept in isolation before using or
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
