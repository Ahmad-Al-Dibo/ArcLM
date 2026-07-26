"""Create and invoke a custom typed tool."""

from arclm.agents import tool


@tool
def word_count(text: str) -> int:
    """Return the number of words in text."""

    return len(text.split())


if __name__ == "__main__":
    print("Schema:", word_count.input_schema)
    print("Valid:", word_count.invoke({"text": "ArcLM Agent Runtime"}).to_dict())
    print("Invalid:", word_count.invoke({"text": 123}).to_dict())
