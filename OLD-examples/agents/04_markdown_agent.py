"""Use the Markdown document tool in a deterministic agent loop."""

from arclm.agents import Agent, AgentRunner, ModelResponse, ToolCall
from arclm.agents.builtins import markdown_to_document


MARKDOWN = """# ArcLM

## Training
Native training tools.

## Evaluation
Metrics and reports.
"""


class MarkdownModel:
    def __init__(self) -> None:
        self.calls = 0

    def generate_response(self, *, messages, tools, instructions, session):
        self.calls += 1
        if self.calls == 1:
            return ModelResponse(
                tool_calls=[ToolCall(id="md_1", name="markdown_to_document", arguments={"markdown": MARKDOWN})]
            )
        return ModelResponse(content="Main sections: Training, Evaluation.")


if __name__ == "__main__":
    agent = Agent(
        name="markdown_reader",
        instructions="Extract sections from Markdown.",
        model=MarkdownModel(),
        tools=[markdown_to_document],
    )
    print(AgentRunner().run(agent, "What are the main sections?").output)
