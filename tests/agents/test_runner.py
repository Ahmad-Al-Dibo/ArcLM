import asyncio

import pytest

from arclm.agents import (
    Agent,
    AgentRunner,
    AutoApprovalHandler,
    ModelResponse,
    ToolCall,
    ToolPermission,
    ToolPolicy,
    tool,
)


@tool
def add(left: int, right: int) -> int:
    """Add two integers."""

    return left + right


class ScriptedModel:
    def __init__(self, responses):
        self.responses = list(responses)

    def generate_response(self, *, messages, tools, instructions, session):
        return self.responses.pop(0)


def test_runner_returns_immediate_final_response():
    agent = Agent(name="demo", instructions="x", model=ScriptedModel([ModelResponse(content="hello")]))
    result = AgentRunner().run(agent, "hi")

    assert result.success
    assert result.output == "hello"
    assert result.session.messages[-1].role == "assistant"


def test_runner_executes_one_tool_call_and_records_trace():
    model = ScriptedModel(
        [
            ModelResponse(tool_calls=[ToolCall(id="call_1", name="add", arguments={"left": 2, "right": 3})]),
            ModelResponse(content="5"),
        ]
    )
    agent = Agent(name="demo", instructions="x", model=model, tools=[add])

    result = AgentRunner(max_steps=3).run(agent, "add")

    assert result.success
    assert result.output == "5"
    assert "tool_completed" in [event.event_type for event in result.trace.events]
    assert result.session.tool_calls[0].name == "add"


def test_runner_unknown_disabled_and_malformed_tool_paths():
    unknown = Agent(
        name="demo",
        instructions="x",
        model=ScriptedModel([ModelResponse(tool_calls=[ToolCall(id="x", name="missing", arguments={})])]),
        tools=[add],
    )
    assert AgentRunner().run(unknown, "x").error_code == "tool_not_found"

    @tool(name="disabled_add", enabled=False)
    def disabled(left: int, right: int) -> int:
        return left + right
    agent = Agent(
        name="demo",
        instructions="x",
        model=ScriptedModel([ModelResponse(tool_calls=[ToolCall(id="x", name="disabled_add", arguments={"left": 1, "right": 2})])]),
        tools=[disabled],
    )
    assert AgentRunner().run(agent, "x").error_code == "tool_disabled"

    malformed = Agent(
        name="demo",
        instructions="x",
        model=ScriptedModel([ModelResponse(tool_calls=[ToolCall(id="x", name="add", arguments={"left": "no", "right": 2})])]),
        tools=[add],
    )
    assert AgentRunner().run(malformed, "x").error_code == "tool_invalid_arguments"


def test_runner_approval_granted_denied_and_max_steps():
    @tool(name="read_network", permission=ToolPermission.READ_NETWORK)
    def read_tool(url: str) -> str:
        return url
    denied = Agent(
        name="demo",
        instructions="x",
        model=ScriptedModel([ModelResponse(tool_calls=[ToolCall(id="x", name="read_network", arguments={"url": "https://example.com"})])]),
        tools=[read_tool],
    )
    assert AgentRunner().run(denied, "x").error_code == "tool_approval_denied"

    granted = Agent(
        name="demo",
        instructions="x",
        model=ScriptedModel(
            [
                ModelResponse(tool_calls=[ToolCall(id="x", name="read_network", arguments={"url": "https://example.com"})]),
                ModelResponse(content="ok"),
            ]
        ),
        tools=[read_tool],
    )
    assert AgentRunner(max_steps=2, approval_handler=AutoApprovalHandler()).run(granted, "x").success

    looping = Agent(
        name="demo",
        instructions="x",
        model=ScriptedModel([ModelResponse(tool_calls=[ToolCall(id="x", name="add", arguments={"left": 1, "right": 1})])] * 3),
        tools=[add],
    )
    assert AgentRunner(max_steps=1).run(looping, "x").error_code == "agent_max_steps_reached"


def test_runner_validates_explicit_structured_output():
    schema = {
        "type": "object",
        "properties": {"answer": {"type": "string"}},
        "required": ["answer"],
        "additionalProperties": False,
    }
    valid = Agent(
        name="demo",
        instructions="x",
        model=ScriptedModel([ModelResponse(content='{"answer": "ok"}', metadata={"structured_output": True})]),
        output_schema=schema,
    )
    assert AgentRunner().run(valid, "x").success

    invalid = Agent(
        name="demo",
        instructions="x",
        model=ScriptedModel([ModelResponse(content='{"extra": "no"}', metadata={"structured_output": True})]),
        output_schema=schema,
    )
    assert AgentRunner().run(invalid, "x").error_code == "agent_invalid_model_response"


def test_async_runner_and_model_failure():
    class AsyncModel:
        async def generate_response_async(self, *, messages, tools, instructions, session):
            await asyncio.sleep(0)
            return ModelResponse(error_code="agent_model_failed", error_message="boom")

    result = asyncio.run(AgentRunner().run_async(Agent(name="demo", instructions="x", model=AsyncModel()), "hi"))

    assert result.error_code == "agent_model_failed"
