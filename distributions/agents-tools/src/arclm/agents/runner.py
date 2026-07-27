"""Bounded agent execution loop."""

from __future__ import annotations

import asyncio
import inspect
import json
import time
from typing import Any

from .agent import Agent
from .approvals import ApprovalDecision, DenyApprovalHandler, ToolApprovalHandler, ToolApprovalRequest
from .context import ToolContext
from .messages import AgentMessage, ModelResponse, tool_result_message
from .registry import ToolRegistry
from .results import AgentRunResult
from .session import AgentSession
from .schema import validate_arguments
from .tracing import AgentTrace
from arclm.security.redaction import redact_mapping


class AgentRunner:
    """Execute agent behavior with bounded model/tool steps."""

    def __init__(
        self,
        *,
        max_steps: int = 8,
        approval_handler: ToolApprovalHandler | None = None,
        timeout_seconds: float | None = None,
        trace_handler: Any | None = None,
    ) -> None:
        if max_steps <= 0:
            raise ValueError("max_steps must be greater than zero")
        self.max_steps = max_steps
        self.approval_handler = approval_handler or DenyApprovalHandler()
        self.timeout_seconds = timeout_seconds
        self.trace_handler = trace_handler

    def run(
        self,
        agent: Agent,
        user_message: str,
        *,
        session: AgentSession | None = None,
    ) -> AgentRunResult:
        """Synchronously run an agent."""

        try:
            asyncio.get_running_loop()
        except RuntimeError:
            return asyncio.run(self.run_async(agent, user_message, session=session))
        raise RuntimeError("AgentRunner.run() cannot be used inside a running event loop; use run_async()")

    async def run_async(
        self,
        agent: Agent,
        user_message: str,
        *,
        session: AgentSession | None = None,
    ) -> AgentRunResult:
        """Run an agent asynchronously."""

        coroutine = self._run_async(agent, user_message, session=session)
        if self.timeout_seconds is not None:
            return await asyncio.wait_for(coroutine, timeout=self.timeout_seconds)
        return await coroutine

    async def _run_async(
        self,
        agent: Agent,
        user_message: str,
        *,
        session: AgentSession | None,
    ) -> AgentRunResult:
        session = session or AgentSession(max_messages=int(agent.session_policy.get("max_messages", 100)) if agent.session_policy else 100)
        trace = AgentTrace()
        self._record(trace, "run_started", metadata={"agent": agent.name})
        session.add_message(AgentMessage(role="user", content=user_message))
        registry = _registry_for(agent)
        max_steps = min(self.max_steps, agent.max_steps)

        for step in range(1, max_steps + 1):
            response = await self._call_model(agent, session, registry)
            if not isinstance(response, ModelResponse):
                self._record(trace, "run_failed", step=step, metadata={"code": "agent_invalid_model_response"})
                return _failure("agent_invalid_model_response", "model adapter returned an invalid response", session, trace)
            if response.error_code:
                self._record(trace, "run_failed", step=step, metadata={"code": response.error_code})
                return _failure(response.error_code, response.error_message or "model failed", session, trace)
            self._record(trace, "model_responded", step=step, metadata={"tool_calls": len(response.tool_calls)})

            if response.is_final:
                structured_error = _validate_structured_output(agent, response)
                if structured_error is not None:
                    return _failure("agent_invalid_model_response", structured_error, session, trace)
                session.add_message(AgentMessage(role="assistant", content=response.content))
                self._record(trace, "run_completed", step=step)
                return AgentRunResult(success=True, output=response.content, session=session, trace=trace)

            if not response.tool_calls:
                self._record(trace, "run_failed", step=step, metadata={"code": "agent_invalid_model_response"})
                return _failure("agent_invalid_model_response", "model returned neither final content nor tool calls", session, trace)

            for call in response.tool_calls:
                session.add_tool_call(call)
                self._record(trace, "tool_requested", step=step, tool_name=call.name, metadata={"tool_call_id": call.id})
                if not registry.has_tool(call.name):
                    return _failure("tool_not_found", f"tool {call.name!r} is not registered", session, trace)
                current_tool = registry.get_tool(call.name)
                if not current_tool.enabled:
                    return _failure("tool_disabled", f"tool {call.name!r} is disabled", session, trace)
                if not agent.tool_policy.allows(current_tool.name):
                    return _failure("tool_not_allowed", f"tool {call.name!r} is not allowed", session, trace)
                approval = await self._check_approval(agent, session, current_tool, call.arguments)
                if approval == ApprovalDecision.DENY:
                    self._record(trace, "approval_denied", step=step, tool_name=current_tool.name, metadata={"tool_call_id": call.id})
                    return _failure("tool_approval_denied", f"approval denied for tool {current_tool.name!r}", session, trace)

                self._record(trace, "tool_started", step=step, tool_name=current_tool.name, metadata={"tool_call_id": call.id})
                start = time.perf_counter()
                context = ToolContext(
                    session_id=session.session_id,
                    agent_name=agent.name,
                    tool_call_id=call.id,
                    approved_permissions={current_tool.spec.permission.value},
                )
                result = await current_tool.invoke_async(call.arguments, context=context)
                duration = time.perf_counter() - start
                self._record(
                    trace,
                    "tool_completed" if result.success else "tool_failed",
                    step=step,
                    tool_name=current_tool.name,
                    duration_seconds=duration,
                    metadata={"success": result.success, "error_code": result.error_code},
                )
                safe_result = result
                if getattr(agent.security_policy, "redact_traces", True):
                    safe_result = _redacted_tool_result(result)
                session.add_message(tool_result_message(call.id, current_tool.name, safe_result))
                if not result.success and agent.tool_policy.stop_on_tool_failure:
                    return _failure(result.error_code or "tool_execution_failed", result.error_message or "tool failed", session, trace)
            self._record(trace, "step_completed", step=step)

        self._record(trace, "run_failed", step=max_steps, metadata={"code": "agent_max_steps_reached"})
        return _failure("agent_max_steps_reached", "agent reached the maximum number of steps", session, trace)

    def _record(self, trace: AgentTrace, event: str, **values: Any) -> None:
        trace.record(event, **values)
        if self.trace_handler is None:
            return
        try:
            self.trace_handler(event, values)
        except Exception:
            pass

    async def _call_model(self, agent: Agent, session: AgentSession, registry: ToolRegistry) -> ModelResponse:
        tools = [tool.spec.to_dict() for tool in registry.list_tools(enabled=True)]
        model = agent.model
        if hasattr(model, "generate_response_async"):
            return await model.generate_response_async(
                messages=list(session.messages),
                tools=tools,
                instructions=agent.instructions,
                session=session,
            )
        response = model.generate_response(
            messages=list(session.messages),
            tools=tools,
            instructions=agent.instructions,
            session=session,
        )
        if inspect.isawaitable(response):
            return await response
        return response

    async def _check_approval(self, agent: Agent, session: AgentSession, tool: Any, arguments: dict[str, Any]) -> ApprovalDecision:
        if not agent.tool_policy.requires_approval(tool.spec.permission):
            return ApprovalDecision.APPROVE_ONCE
        request = ToolApprovalRequest(
            tool_name=tool.name,
            permission=tool.spec.permission.value,
            arguments=json.loads(json.dumps(arguments)),
            session_id=session.session_id,
        )
        return await self.approval_handler.request_approval(request)


def _registry_for(agent: Agent) -> ToolRegistry:
    registry = ToolRegistry()
    for item in agent.tools:
        registry.register_tool(item)
    return registry


def _failure(code: str, message: str, session: AgentSession, trace: AgentTrace) -> AgentRunResult:
    trace.record("run_failed", metadata={"code": code})
    return AgentRunResult(success=False, output=None, session=session, trace=trace, error_code=code, error_message=message)


def _validate_structured_output(agent: Agent, response: ModelResponse) -> str | None:
    if agent.output_schema is None:
        return None
    if not response.metadata.get("structured_output"):
        return None
    if not isinstance(agent.output_schema, dict):
        return "structured output validation supports JSON-schema dictionaries in this phase"
    try:
        payload = json.loads(response.content or "")
        if not isinstance(payload, dict):
            return "structured output must be a JSON object"
        validate_arguments(agent.output_schema, payload)
    except Exception as exc:
        return f"structured output validation failed: {exc}"
    return None


def _redacted_tool_result(result: Any) -> Any:
    from .results import ToolResult

    if not isinstance(result, ToolResult):
        return result
    metadata = redact_mapping(result.metadata)
    value = redact_mapping(result.value)
    content = None if result.content is None else redact_mapping(result.content)
    return ToolResult(
        success=result.success,
        value=value,
        content=content,
        error_code=result.error_code,
        error_message=result.error_message,
        metadata=metadata,
    )
