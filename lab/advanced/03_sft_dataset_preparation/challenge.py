from __future__ import annotations

from typing import Any

LAB_METADATA = {
    "id": "advanced-03-sft-dataset-preparation",
    "title": "Prepare SFT examples identically",
    "level": "advanced",
    "category": "fine_tuning",
    "type": "arclm_integration",
    "estimated_minutes": 110,
    "points": 180,
    "requires_network": False,
    "requires_gpu": False,
    "production_code_modified": False
}

class PreparedSFTExample:
    """Learner-owned type for `Prepare SFT examples identically`.

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

def prepare_sft_example(*args: Any, **kwargs: Any) -> Any:
    """Complete `prepare_sft_example` for `Prepare SFT examples identically`.

    Purpose
    -------
    Practice the `fine_tuning` concept in isolation before using or
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

def compare_preview_to_training(*args: Any, **kwargs: Any) -> Any:
    """Complete `compare_preview_to_training` for `Prepare SFT examples identically`.

    Purpose
    -------
    Practice the `fine_tuning` concept in isolation before using or
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
