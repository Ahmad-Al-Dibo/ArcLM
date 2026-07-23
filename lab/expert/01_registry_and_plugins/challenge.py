from __future__ import annotations

from typing import Any

LAB_METADATA = {
    "id": "expert-01-registry-and-plugins",
    "title": "Build a safe component registry",
    "level": "expert",
    "category": "registry",
    "type": "from_scratch",
    "estimated_minutes": 100,
    "points": 170,
    "requires_network": False,
    "requires_gpu": False,
    "production_code_modified": False
}

class ComponentRegistry:
    """Learner-owned type for `Build a safe component registry`.

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

class RegistryEntry:
    """Learner-owned type for `Build a safe component registry`.

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
