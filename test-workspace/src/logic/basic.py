from pathlib import Path


def run_logic_example() -> None:
    """Show a tiny custom-logic pattern for project-specific rules."""
    result = sum(value for value in range(3))
    print(f"Logic example ready. Sum={result}")


if __name__ == "__main__":
    run_logic_example()
