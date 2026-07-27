"""Canonical tool abstraction for ArcLM Agent Runtime."""

from __future__ import annotations

import asyncio
import inspect
import json
import re
from dataclasses import dataclass, field
from typing import Any, Callable

from .context import ToolContext
from .errors import ToolError, ToolValidationError
from .permissions import SideEffectLevel, ToolPermission
from .results import ToolResult, ensure_json_safe
from .schema import schema_for_callable, validate_arguments


_NAME_RE = re.compile(r"^[a-zA-Z][a-zA-Z0-9_.-]{0,127}$")


@dataclass(frozen=True)
class ToolSpec:
    """Serializable metadata describing a tool."""

    name: str
    description: str
    input_schema: dict[str, Any]
    output_schema: dict[str, Any] | None = None
    output_description: str | None = None
    category: str = "utilities"
    tags: tuple[str, ...] = ()
    permission: ToolPermission = ToolPermission.PURE
    timeout_seconds: float | None = None
    side_effect: SideEffectLevel = SideEffectLevel.NONE
    enabled: bool = True
    metadata: dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> dict[str, Any]:
        """Return JSON-safe tool definition data."""

        return {
            "name": self.name,
            "description": self.description,
            "input_schema": self.input_schema,
            "output_schema": self.output_schema,
            "output_description": self.output_description,
            "category": self.category,
            "tags": list(self.tags),
            "permission": self.permission.value,
            "timeout_seconds": self.timeout_seconds,
            "side_effect": self.side_effect.value,
            "enabled": self.enabled,
            "metadata": dict(self.metadata),
        }

    def to_mcp_schema(self) -> dict[str, Any]:
        """Return a schema-ready MCP-like tool description."""

        return {
            "name": self.name,
            "description": self.description,
            "inputSchema": self.input_schema,
        }


@dataclass
class Tool:
    """Callable tool with strict schema validation and structured results."""

    spec: ToolSpec
    function: Callable[..., Any]
    inject_context: bool = False

    @property
    def name(self) -> str:
        return self.spec.name

    @property
    def description(self) -> str:
        return self.spec.description

    @property
    def input_schema(self) -> dict[str, Any]:
        return self.spec.input_schema

    @property
    def enabled(self) -> bool:
        return self.spec.enabled

    @classmethod
    def from_callable(
        cls,
        function: Callable[..., Any],
        *,
        name: str | None = None,
        description: str | None = None,
        category: str = "utilities",
        tags: tuple[str, ...] | list[str] = (),
        permission: ToolPermission | str = ToolPermission.PURE,
        timeout_seconds: float | None = None,
        side_effect: SideEffectLevel | str = SideEffectLevel.NONE,
        enabled: bool = True,
        metadata: dict[str, Any] | None = None,
        output_description: str | None = None,
        output_schema: dict[str, Any] | None = None,
    ) -> "Tool":
        """Create a tool from a typed Python callable."""

        tool_name = _canonical_name(name or function.__name__)
        doc = inspect.getdoc(function) or ""
        tool_description = description or doc.splitlines()[0] if doc else description or ""
        signature = inspect.signature(function)
        inject_context = any(
            parameter.annotation is ToolContext or key in {"context", "ctx"} and parameter.annotation is ToolContext
            for key, parameter in signature.parameters.items()
        )
        spec = ToolSpec(
            name=tool_name,
            description=tool_description,
            input_schema=schema_for_callable(function, context_type=ToolContext),
            output_schema=output_schema,
            output_description=output_description,
            category=category,
            tags=tuple(tags),
            permission=ToolPermission(permission),
            timeout_seconds=timeout_seconds,
            side_effect=SideEffectLevel(side_effect),
            enabled=enabled,
            metadata=ensure_json_safe(metadata or {}),
        )
        return cls(spec=spec, function=function, inject_context=inject_context)

    def with_enabled(self, enabled: bool) -> "Tool":
        """Return a copy with a new enabled state."""

        spec = ToolSpec(**{**self.spec.to_dict(), "tags": tuple(self.spec.tags), "permission": self.spec.permission, "side_effect": self.spec.side_effect, "enabled": enabled})
        return Tool(spec=spec, function=self.function, inject_context=self.inject_context)

    def validate_arguments(
        self,
        arguments: dict[str, Any],
        *,
        max_depth: int = 20,
        max_collection_length: int = 1000,
    ) -> dict[str, Any]:
        """Validate and copy arguments before execution."""

        return validate_arguments(
            self.input_schema,
            dict(arguments),
            max_depth=max_depth,
            max_collection_length=max_collection_length,
        )

    def invoke(self, arguments: dict[str, Any], context: ToolContext | None = None) -> ToolResult:
        """Synchronously invoke a tool and return a structured result."""

        if inspect.iscoroutinefunction(self.function):
            return _run_coroutine_blocking(self.invoke_async(arguments, context))
        try:
            values = self.validate_arguments(arguments)
            raw = self.function(**_with_context(values, context, self.inject_context))
            return raw if isinstance(raw, ToolResult) else ToolResult.ok(raw)
        except ToolValidationError as exc:
            return ToolResult.fail("tool_invalid_arguments", str(exc))
        except Exception as exc:
            return ToolResult.fail("tool_execution_failed", "tool execution failed", metadata={"exception_type": type(exc).__name__})

    async def invoke_async(self, arguments: dict[str, Any], context: ToolContext | None = None) -> ToolResult:
        """Asynchronously invoke a tool and return a structured result."""

        try:
            values = self.validate_arguments(arguments)
            kwargs = _with_context(values, context, self.inject_context)
            if inspect.iscoroutinefunction(self.function):
                coroutine = self.function(**kwargs)
            else:
                loop = asyncio.get_running_loop()
                coroutine = loop.run_in_executor(None, lambda: self.function(**kwargs))
            if self.spec.timeout_seconds is not None:
                raw = await asyncio.wait_for(coroutine, timeout=self.spec.timeout_seconds)
            else:
                raw = await coroutine
            result = raw if isinstance(raw, ToolResult) else ToolResult.ok(raw)
            _check_result_size(result)
            return result
        except asyncio.TimeoutError:
            return ToolResult.fail("tool_timeout", "tool execution timed out")
        except ToolValidationError as exc:
            return ToolResult.fail("tool_invalid_arguments", str(exc))
        except Exception as exc:
            return ToolResult.fail("tool_execution_failed", "tool execution failed", metadata={"exception_type": type(exc).__name__})

    def to_dict(self) -> dict[str, Any]:
        """Return a JSON-safe tool definition."""

        return self.spec.to_dict()


def tool(function: Callable[..., Any] | None = None, **options: Any):
    """Decorator that exposes a typed Python function as a Tool."""

    def decorate(target: Callable[..., Any]) -> Tool:
        return Tool.from_callable(target, **options)

    if function is None:
        return decorate
    if not callable(function):
        raise ToolError("@tool can decorate only callables")
    return decorate(function)


def _canonical_name(name: str) -> str:
    value = name.lower().strip().replace(" ", "_")
    if not _NAME_RE.match(value):
        raise ToolError(f"invalid tool name: {name!r}")
    return value


def _with_context(values: dict[str, Any], context: ToolContext | None, inject_context: bool) -> dict[str, Any]:
    if inject_context:
        return {**values, "context": context}
    return values


def _check_result_size(result: ToolResult) -> None:
    encoded = json.dumps(result.to_dict())
    if len(encoded.encode("utf-8")) > 1_000_000:
        raise ToolError("tool result exceeds maximum size")


def _run_coroutine_blocking(coroutine: Any) -> ToolResult:
    try:
        asyncio.get_running_loop()
    except RuntimeError:
        return asyncio.run(coroutine)
    raise RuntimeError("cannot synchronously invoke an async tool from a running event loop")
