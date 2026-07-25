"""Register tools and create deterministic tool sets."""

from arclm.agents import ToolRegistry, tool


@tool(category="math", tags=("demo",))
def add(left: int, right: int) -> int:
    """Add two integers."""

    return left + right


@tool(category="math", tags=("demo",))
def multiply(left: int, right: int) -> int:
    """Multiply two integers."""

    return left * right


if __name__ == "__main__":
    registry = ToolRegistry()
    registry.register_tool(multiply)
    registry.register_tool(add)
    print([tool.name for tool in registry.list_tools(category="math", tags=("demo",))])
    print([tool.name for tool in registry.create_tool_set(["multiply", "add"])])
