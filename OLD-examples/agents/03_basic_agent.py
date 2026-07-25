"""Run a basic deterministic agent without API keys."""

from arclm.agents import Agent, AgentRunner, ModelResponse, ToolCall, tool


@tool
def calculate_total(price: float, quantity: int) -> float:
    """Calculate a total price."""

    return price * quantity


class DeterministicModel:
    def __init__(self) -> None:
        self.calls = 0

    def generate_response(self, *, messages, tools, instructions, session):
        self.calls += 1
        if self.calls == 1:
            return ModelResponse(
                tool_calls=[
                    ToolCall(
                        id="call_1",
                        name="calculate_total",
                        arguments={"price": 12.5, "quantity": 3},
                    )
                ]
            )
        return ModelResponse(content="The total is 37.5.")


if __name__ == "__main__":
    agent = Agent(
        name="shopping_assistant",
        instructions="Help the user calculate product totals.",
        model=DeterministicModel(),
        tools=[calculate_total],
    )
    result = AgentRunner(max_steps=5).run(agent, "What is 3 * 12.50?")
    print(result.output)
    print([event.event_type for event in result.trace.events])
