"""Read a mocked webpage safely."""

from arclm.agents import Agent, AgentRunner, AutoApprovalHandler, ModelResponse, ToolCall
from arclm.agents.builtins import create_read_webpage_tool


def fake_fetcher(url: str, timeout: float):
    return 200, {"content-type": "text/html"}, b"<h1>ArcLM</h1><p>Agent Runtime</p>", url


class WebModel:
    def __init__(self) -> None:
        self.calls = 0

    def generate_response(self, *, messages, tools, instructions, session):
        self.calls += 1
        if self.calls == 1:
            return ModelResponse(
                tool_calls=[ToolCall(id="web_1", name="read_webpage", arguments={"url": "https://93.184.216.34"})]
            )
        return ModelResponse(content="Summary: ArcLM Agent Runtime.")


if __name__ == "__main__":
    agent = Agent(
        name="web_reader",
        instructions="Read a webpage and summarize it.",
        model=WebModel(),
        tools=[create_read_webpage_tool(fetcher=fake_fetcher)],
    )
    result = AgentRunner(approval_handler=AutoApprovalHandler()).run(agent, "Summarize the page.")
    print(result.output)
