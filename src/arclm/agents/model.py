"""Provider-independent model adapter protocol for agents."""

from __future__ import annotations

import asyncio
import inspect
import json
from dataclasses import dataclass
from typing import Any, Callable, Protocol

from .messages import AgentMessage, ModelResponse, ToolCall


class AgentModel(Protocol):
    """Protocol implemented by provider-specific model adapters."""

    def generate_response(
        self,
        *,
        messages: list[AgentMessage],
        tools: list[dict[str, Any]],
        instructions: str,
        session: Any,
    ) -> ModelResponse:
        """Return a provider-independent model response."""


class AsyncAgentModel(Protocol):
    """Async model adapter protocol."""

    async def generate_response_async(
        self,
        *,
        messages: list[AgentMessage],
        tools: list[dict[str, Any]],
        instructions: str,
        session: Any,
    ) -> ModelResponse:
        """Return a provider-independent model response asynchronously."""


@dataclass
class CallableModelAdapter:
    """Adapter around a developer-supplied callable."""

    function: Callable[..., ModelResponse]

    def generate_response(
        self,
        *,
        messages: list[AgentMessage],
        tools: list[dict[str, Any]],
        instructions: str,
        session: Any,
    ) -> ModelResponse:
        response = self.function(
            messages=messages,
            tools=tools,
            instructions=instructions,
            session=session,
        )
        if inspect.isawaitable(response):
            return _run_coroutine_blocking(response)
        return response

    async def generate_response_async(
        self,
        *,
        messages: list[AgentMessage],
        tools: list[dict[str, Any]],
        instructions: str,
        session: Any,
    ) -> ModelResponse:
        response = self.function(
            messages=messages,
            tools=tools,
            instructions=instructions,
            session=session,
        )
        if inspect.isawaitable(response):
            return await response
        return response


@dataclass
class JSONToolCallingAdapter:
    """Strict JSON protocol adapter for plain generation callables.

    This does not make arbitrary causal language models reliable tool callers;
    malformed or non-JSON output is rejected by design.
    """

    generate_text: Callable[[str], str]
    max_output_bytes: int = 65536

    def generate_response(
        self,
        *,
        messages: list[AgentMessage],
        tools: list[dict[str, Any]],
        instructions: str,
        session: Any,
    ) -> ModelResponse:
        prompt = _json_protocol_prompt(messages=messages, tools=tools, instructions=instructions)
        text = self.generate_text(prompt)
        return parse_json_model_response(text, max_bytes=self.max_output_bytes)


class ArcLMJSONToolAdapter(JSONToolCallingAdapter):
    """Small adapter for ArcLM-style generation callables using strict JSON."""


def parse_json_model_response(text: str, *, max_bytes: int = 65536) -> ModelResponse:
    """Parse a bounded JSON model response."""

    if len(text.encode("utf-8")) > max_bytes:
        return ModelResponse(error_code="agent_invalid_model_response", error_message="model response too large")
    try:
        payload = json.loads(text)
    except json.JSONDecodeError:
        return ModelResponse(error_code="agent_invalid_model_response", error_message="model response is not valid JSON")
    if not isinstance(payload, dict):
        return ModelResponse(error_code="agent_invalid_model_response", error_message="model response must be a JSON object")
    response_type = payload.get("type")
    if response_type == "final" and isinstance(payload.get("content"), str):
        return ModelResponse(content=payload["content"])
    if response_type == "tool_call":
        tool_name = payload.get("tool")
        arguments = payload.get("arguments")
        if not isinstance(tool_name, str) or not isinstance(arguments, dict):
            return ModelResponse(error_code="agent_invalid_model_response", error_message="tool call response is malformed")
        return ModelResponse(tool_calls=[ToolCall(id=str(payload.get("id", "call_1")), name=tool_name, arguments=arguments)])
    return ModelResponse(error_code="agent_invalid_model_response", error_message="model response type is unsupported")


def _json_protocol_prompt(*, messages: list[AgentMessage], tools: list[dict[str, Any]], instructions: str) -> str:
    return json.dumps(
        {
            "instructions": instructions,
            "messages": [message.to_dict() for message in messages],
            "tools": tools,
            "expected_response": [
                {"type": "final", "content": "..."},
                {"type": "tool_call", "tool": "tool_name", "arguments": {}},
            ],
        },
        sort_keys=True,
    )


def _run_coroutine_blocking(coroutine: Any) -> ModelResponse:
    try:
        asyncio.get_running_loop()
    except RuntimeError:
        return asyncio.run(coroutine)
    raise RuntimeError("cannot synchronously call an async model from a running event loop")
