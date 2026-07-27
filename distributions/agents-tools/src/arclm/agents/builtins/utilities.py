"""Pure utility tools."""

from __future__ import annotations

import json
from datetime import datetime
from typing import Any
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

from arclm.agents.results import ToolResult
from arclm.agents.tool import tool


MAX_ABS_NUMBER = 1_000_000_000
MAX_POWER_EXPONENT = 12
MAX_JSON_INPUT_BYTES = 1_000_000
MAX_JSON_DEPTH = 50


@tool(category="utilities")
def add(left: float, right: float) -> float:
    """Add two numbers."""

    return _bounded_number(left + right)


@tool(category="utilities")
def subtract(left: float, right: float) -> float:
    """Subtract right from left."""

    return _bounded_number(left - right)


@tool(category="utilities")
def multiply(left: float, right: float) -> float:
    """Multiply two numbers."""

    return _bounded_number(left * right)


@tool(category="utilities")
def divide(left: float, right: float) -> float:
    """Divide left by right."""

    if right == 0:
        raise ValueError("division by zero")
    return _bounded_number(left / right)


@tool(category="utilities")
def power(base: float, exponent: int) -> float:
    """Raise a number to a bounded integer power."""

    if abs(exponent) > MAX_POWER_EXPONENT:
        raise ValueError("exponent is too large")
    return _bounded_number(base**exponent)


@tool(category="utilities")
def current_datetime(timezone: str = "UTC") -> dict[str, str]:
    """Return the current date and time for an explicit timezone."""

    try:
        zone = ZoneInfo(timezone)
    except ZoneInfoNotFoundError as exc:
        raise ValueError("timezone is not available") from exc
    now = datetime.now(zone)
    return {
        "timezone": timezone,
        "iso": now.isoformat(),
        "date": now.date().isoformat(),
        "time": now.time().replace(microsecond=0).isoformat(),
    }


@tool(category="text")
def text_statistics(text: str) -> dict[str, int]:
    """Return basic text statistics."""

    lines = text.splitlines()
    return {
        "characters": len(text),
        "words": len(text.split()),
        "lines": len(lines),
        "non_empty_lines": sum(1 for line in lines if line.strip()),
    }


@tool(category="json")
def parse_json(text: str) -> ToolResult:
    """Parse JSON safely using the standard library."""

    _check_input_size(text)
    try:
        value = json.loads(text)
        _check_depth(value)
    except json.JSONDecodeError as exc:
        return ToolResult.ok({"valid": False, "value": None, "error": str(exc)})
    except ValueError as exc:
        return ToolResult.ok({"valid": False, "value": None, "error": str(exc)})
    return ToolResult.ok({"valid": True, "value": value, "error": None})


@tool(category="json")
def format_json(text: str, indent: int = 2, sort_keys: bool = True) -> ToolResult:
    """Parse and format JSON with bounded input."""

    _check_input_size(text)
    if indent < 0 or indent > 8:
        return ToolResult.fail("tool_invalid_arguments", "indent must be between 0 and 8")
    try:
        value = json.loads(text)
        _check_depth(value)
    except (json.JSONDecodeError, ValueError) as exc:
        return ToolResult.fail("tool_invalid_arguments", str(exc))
    return ToolResult.ok(json.dumps(value, indent=indent, sort_keys=sort_keys))


@tool(category="json")
def validate_json_shape(text: str, required_keys: list[str]) -> dict[str, object]:
    """Validate that a JSON object contains required top-level keys."""

    _check_input_size(text)
    value = json.loads(text)
    if not isinstance(value, dict):
        return {"valid": False, "missing": required_keys, "error": "JSON value is not an object"}
    missing = [key for key in required_keys if key not in value]
    return {"valid": not missing, "missing": missing, "error": None if not missing else "missing required keys"}


def _bounded_number(value: float) -> float:
    if abs(value) > MAX_ABS_NUMBER:
        raise ValueError("numeric result exceeds bounded range")
    return float(value)


def _check_input_size(text: str) -> None:
    if len(text.encode("utf-8")) > MAX_JSON_INPUT_BYTES:
        raise ValueError("JSON input is too large")


def _check_depth(value: Any, depth: int = 0) -> None:
    if depth > MAX_JSON_DEPTH:
        raise ValueError("JSON input exceeds maximum nesting depth")
    if isinstance(value, dict):
        for child in value.values():
            _check_depth(child, depth + 1)
    elif isinstance(value, list):
        for child in value:
            _check_depth(child, depth + 1)
