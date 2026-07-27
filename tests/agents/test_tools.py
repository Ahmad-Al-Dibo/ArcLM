import asyncio
import enum

import pytest

from arclm.agents import Tool, ToolRegistry, ToolResult, ToolSchemaError, tool


def test_tool_decorator_generates_schema_and_invokes_without_mutating_input():
    @tool
    def word_count(text: str, minimum: int = 0) -> int:
        """Return the number of words in text."""

        return max(minimum, len(text.split()))

    arguments = {"text": "hello ArcLM"}
    result = word_count.invoke(arguments)

    assert word_count.name == "word_count"
    assert word_count.input_schema["properties"]["text"]["type"] == "string"
    assert word_count.input_schema["properties"]["minimum"]["default"] == 0
    assert result == ToolResult.ok(2)
    assert arguments == {"text": "hello ArcLM"}


def test_tool_decorator_with_metadata_literals_enums_lists_and_dicts():
    class Mode(str, enum.Enum):
        SHORT = "short"
        LONG = "long"

    @tool(name="summarize", description="Summarize text.", category="text", tags=("demo",))
    def summarize(text: str, mode: Mode, labels: list[str], counts: dict[str, int]) -> dict[str, int]:
        return {"labels": len(labels), "counts": len(counts), "mode": 1 if mode == "short" else 2}

    assert summarize.spec.category == "text"
    assert summarize.spec.tags == ("demo",)
    assert summarize.invoke(
        {"text": "x", "mode": "short", "labels": ["a"], "counts": {"a": 1}}
    ).success


def test_tool_rejects_unsupported_annotations_and_invalid_arguments():
    with pytest.raises(ToolSchemaError):

        @tool
        def bad(value: object) -> str:
            return str(value)

    @tool
    def add(left: int, right: int) -> int:
        return left + right

    assert add.invoke({"left": 1, "right": "x"}).error_code == "tool_invalid_arguments"
    assert add.invoke({"left": 1, "right": 2, "extra": 3}).error_code == "tool_invalid_arguments"


def test_tool_registry_is_deterministic_and_rejects_duplicates():
    @tool
    def beta(value: int) -> int:
        return value

    def identity(value: int) -> int:
        return value

    alpha = Tool.from_callable(identity, name="alpha", description="Alpha")
    registry = ToolRegistry()
    registry.register_tool(beta)
    registry.register_tool(alpha)

    assert [item.name for item in registry.list_tools()] == ["alpha", "beta"]
    with pytest.raises(ValueError):
        registry.register_tool(beta)


def test_async_tool_invocation():
    @tool
    async def double(value: int) -> int:
        return value * 2

    result = asyncio.run(double.invoke_async({"value": 4}))

    assert result.success
    assert result.value == 8
