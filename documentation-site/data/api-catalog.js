window.ARCLM_API_CATALOG = [
  {
    "name": "Agent",
    "qualifiedName": "arclm.agents.Agent",
    "importPath": "arclm.agents.Agent",
    "canonicalImport": "from arclm.agents import Agent",
    "alternativeImport": "",
    "kind": "class",
    "category": "agents",
    "status": "Beta",
    "signature": "Agent(name: 'str', instructions: 'str', model: 'Any', tools: 'list[Tool]' = <factory>, description: 'str' = '', max_steps: 'int' = 8, tool_policy: 'ToolPolicy' = <factory>, approval_policy: 'dict[str, Any]' = <factory>, session_policy: 'dict[str, Any]' = <factory>, output_schema: 'dict[str, Any] | type | None' = None, security_policy: 'SecurityPolicy' = <factory>, metadata: 'dict[str, Any]' = <factory>) -> None",
    "summary": "Behavior description for a bounded tool-using agent.",
    "parameters": [
      [
        "name",
        "str",
        "required"
      ],
      [
        "instructions",
        "str",
        "required"
      ],
      [
        "model",
        "Any",
        "required"
      ],
      [
        "tools",
        "list[Tool]",
        "<factory>"
      ],
      [
        "description",
        "str",
        "''"
      ],
      [
        "max_steps",
        "int",
        "8"
      ],
      [
        "tool_policy",
        "ToolPolicy",
        "<factory>"
      ],
      [
        "approval_policy",
        "dict[str, Any]",
        "<factory>"
      ],
      [
        "session_policy",
        "dict[str, Any]",
        "<factory>"
      ],
      [
        "output_schema",
        "dict[str, Any] | type | None",
        "None"
      ],
      [
        "security_policy",
        "SecurityPolicy",
        "<factory>"
      ],
      [
        "metadata",
        "dict[str, Any]",
        "<factory>"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional audio/web integrations.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.agents import Agent\n\nprint(Agent)",
    "members": [
      [
        "config(self) -> 'AgentConfig'",
        "Return serializable agent configuration without callables."
      ]
    ]
  },
  {
    "name": "AgentCapabilityReport",
    "qualifiedName": "arclm.agents.AgentCapabilityReport",
    "importPath": "arclm.agents.AgentCapabilityReport",
    "canonicalImport": "from arclm.agents import AgentCapabilityReport",
    "alternativeImport": "",
    "kind": "class",
    "category": "agents",
    "status": "Beta",
    "signature": "AgentCapabilityReport(supports_tools: 'CapabilityStatus' = <CapabilityStatus.AVAILABLE: 'available'>, supports_parallel_tool_calls: 'CapabilityStatus' = <CapabilityStatus.AVAILABLE: 'available'>, supports_structured_output: 'CapabilityStatus' = <CapabilityStatus.EXPERIMENTAL: 'experimental'>, supports_sessions: 'CapabilityStatus' = <CapabilityStatus.AVAILABLE: 'available'>, supports_async: 'CapabilityStatus' = <CapabilityStatus.AVAILABLE: 'available'>, supports_approvals: 'CapabilityStatus' = <CapabilityStatus.AVAILABLE: 'available'>, supports_tracing: 'CapabilityStatus' = <CapabilityStatus.AVAILABLE: 'available'>, supports_resources: 'CapabilityStatus' = <CapabilityStatus.EXPERIMENTAL: 'experimental'>, supports_speech_to_text: 'CapabilityStatus' = <CapabilityStatus.OPTIONAL: 'optional'>, supports_web_reading: 'CapabilityStatus' = <CapabilityStatus.AVAILABLE: 'available'>) -> None",
    "summary": "Honest runtime capability report.",
    "parameters": [
      [
        "supports_tools",
        "CapabilityStatus",
        "<CapabilityStatus.AVAILABLE: 'available'>"
      ],
      [
        "supports_parallel_tool_calls",
        "CapabilityStatus",
        "<CapabilityStatus.AVAILABLE: 'available'>"
      ],
      [
        "supports_structured_output",
        "CapabilityStatus",
        "<CapabilityStatus.EXPERIMENTAL: 'experimental'>"
      ],
      [
        "supports_sessions",
        "CapabilityStatus",
        "<CapabilityStatus.AVAILABLE: 'available'>"
      ],
      [
        "supports_async",
        "CapabilityStatus",
        "<CapabilityStatus.AVAILABLE: 'available'>"
      ],
      [
        "supports_approvals",
        "CapabilityStatus",
        "<CapabilityStatus.AVAILABLE: 'available'>"
      ],
      [
        "supports_tracing",
        "CapabilityStatus",
        "<CapabilityStatus.AVAILABLE: 'available'>"
      ],
      [
        "supports_resources",
        "CapabilityStatus",
        "<CapabilityStatus.EXPERIMENTAL: 'experimental'>"
      ],
      [
        "supports_speech_to_text",
        "CapabilityStatus",
        "<CapabilityStatus.OPTIONAL: 'optional'>"
      ],
      [
        "supports_web_reading",
        "CapabilityStatus",
        "<CapabilityStatus.AVAILABLE: 'available'>"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional audio/web integrations.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.agents import AgentCapabilityReport\n\nprint(AgentCapabilityReport)",
    "members": [
      [
        "to_dict(self) -> 'dict[str, str]'",
        "Return a JSON-safe dictionary."
      ]
    ]
  },
  {
    "name": "AgentConfig",
    "qualifiedName": "arclm.agents.AgentConfig",
    "importPath": "arclm.agents.AgentConfig",
    "canonicalImport": "from arclm.agents import AgentConfig",
    "alternativeImport": "",
    "kind": "class",
    "category": "agents",
    "status": "Beta",
    "signature": "AgentConfig(name: 'str', description: 'str' = '', instructions: 'str' = '', max_steps: 'int' = 8, metadata: 'dict[str, Any]' = <factory>) -> None",
    "summary": "Serializable agent configuration without callables or secrets.",
    "parameters": [
      [
        "name",
        "str",
        "required"
      ],
      [
        "description",
        "str",
        "''"
      ],
      [
        "instructions",
        "str",
        "''"
      ],
      [
        "max_steps",
        "int",
        "8"
      ],
      [
        "metadata",
        "dict[str, Any]",
        "<factory>"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional audio/web integrations.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.agents import AgentConfig\n\nprint(AgentConfig)",
    "members": [
      [
        "to_dict(self) -> 'dict[str, Any]'",
        "Public method."
      ]
    ]
  },
  {
    "name": "AgentMessage",
    "qualifiedName": "arclm.agents.AgentMessage",
    "importPath": "arclm.agents.AgentMessage",
    "canonicalImport": "from arclm.agents import AgentMessage",
    "alternativeImport": "",
    "kind": "class",
    "category": "agents",
    "status": "Beta",
    "signature": "AgentMessage(role: 'AgentRole', content: 'str | None', name: 'str | None' = None, tool_call_id: 'str | None' = None, metadata: 'dict[str, Any]' = <factory>) -> None",
    "summary": "Serializable provider-independent message.",
    "parameters": [
      [
        "role",
        "AgentRole",
        "required"
      ],
      [
        "content",
        "str | None",
        "required"
      ],
      [
        "name",
        "str | None",
        "None"
      ],
      [
        "tool_call_id",
        "str | None",
        "None"
      ],
      [
        "metadata",
        "dict[str, Any]",
        "<factory>"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional audio/web integrations.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.agents import AgentMessage\n\nprint(AgentMessage)",
    "members": [
      [
        "to_dict(self) -> 'dict[str, Any]'",
        "Return a JSON-safe dictionary."
      ]
    ]
  },
  {
    "name": "AgentModel",
    "qualifiedName": "arclm.agents.AgentModel",
    "importPath": "arclm.agents.AgentModel",
    "canonicalImport": "from arclm.agents import AgentModel",
    "alternativeImport": "",
    "kind": "class",
    "category": "agents",
    "status": "Beta",
    "signature": "AgentModel(*args, **kwargs)",
    "summary": "Protocol implemented by provider-specific model adapters.",
    "parameters": [
      [
        "args",
        "Any",
        "required"
      ],
      [
        "kwargs",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional audio/web integrations.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.agents import AgentModel\n\nprint(AgentModel)",
    "members": [
      [
        "generate_response(self, *, messages: 'list[AgentMessage]', tools: 'list[dict[str, Any]]', instructions: 'str', session: 'Any') -> 'ModelResponse'",
        "Return a provider-independent model response."
      ]
    ]
  },
  {
    "name": "AgentResource",
    "qualifiedName": "arclm.agents.AgentResource",
    "importPath": "arclm.agents.AgentResource",
    "canonicalImport": "from arclm.agents import AgentResource",
    "alternativeImport": "",
    "kind": "class",
    "category": "agents",
    "status": "Beta",
    "signature": "AgentResource(uri: 'str', name: 'str', content: 'str', mime_type: 'str' = 'text/plain', metadata: 'dict[str, str]' = <factory>) -> None",
    "summary": "Read-only content that can be provided as agent context.",
    "parameters": [
      [
        "uri",
        "str",
        "required"
      ],
      [
        "name",
        "str",
        "required"
      ],
      [
        "content",
        "str",
        "required"
      ],
      [
        "mime_type",
        "str",
        "'text/plain'"
      ],
      [
        "metadata",
        "dict[str, str]",
        "<factory>"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional audio/web integrations.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.agents import AgentResource\n\nprint(AgentResource)",
    "members": [
      [
        "to_dict(self) -> 'dict[str, object]'",
        "Public method."
      ],
      [
        "to_mcp_resource(self) -> 'dict[str, object]'",
        "Return a schema-ready MCP-like resource."
      ]
    ]
  },
  {
    "name": "AgentRunner",
    "qualifiedName": "arclm.agents.AgentRunner",
    "importPath": "arclm.agents.AgentRunner",
    "canonicalImport": "from arclm.agents import AgentRunner",
    "alternativeImport": "",
    "kind": "class",
    "category": "agents",
    "status": "Beta",
    "signature": "AgentRunner(*, max_steps: 'int' = 8, approval_handler: 'ToolApprovalHandler | None' = None, timeout_seconds: 'float | None' = None, trace_handler: 'Any | None' = None) -> 'None'",
    "summary": "Execute agent behavior with bounded model/tool steps.",
    "parameters": [
      [
        "max_steps",
        "int",
        "8"
      ],
      [
        "approval_handler",
        "ToolApprovalHandler | None",
        "None"
      ],
      [
        "timeout_seconds",
        "float | None",
        "None"
      ],
      [
        "trace_handler",
        "Any | None",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional audio/web integrations.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.agents import AgentRunner\n\nprint(AgentRunner)",
    "members": [
      [
        "run(self, agent: 'Agent', user_message: 'str', *, session: 'AgentSession | None' = None) -> 'AgentRunResult'",
        "Synchronously run an agent."
      ],
      [
        "run_async(self, agent: 'Agent', user_message: 'str', *, session: 'AgentSession | None' = None) -> 'AgentRunResult'",
        "Run an agent asynchronously."
      ]
    ]
  },
  {
    "name": "AgentRunnerConfig",
    "qualifiedName": "arclm.agents.AgentRunnerConfig",
    "importPath": "arclm.agents.AgentRunnerConfig",
    "canonicalImport": "from arclm.agents import AgentRunnerConfig",
    "alternativeImport": "",
    "kind": "class",
    "category": "agents",
    "status": "Beta",
    "signature": "AgentRunnerConfig(max_steps: 'int' = 8, timeout_seconds: 'float | None' = None) -> None",
    "summary": "Serializable runner configuration.",
    "parameters": [
      [
        "max_steps",
        "int",
        "8"
      ],
      [
        "timeout_seconds",
        "float | None",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional audio/web integrations.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.agents import AgentRunnerConfig\n\nprint(AgentRunnerConfig)",
    "members": [
      [
        "to_dict(self) -> 'dict[str, Any]'",
        "Public method."
      ]
    ]
  },
  {
    "name": "AgentRunResult",
    "qualifiedName": "arclm.agents.AgentRunResult",
    "importPath": "arclm.agents.AgentRunResult",
    "canonicalImport": "from arclm.agents import AgentRunResult",
    "alternativeImport": "",
    "kind": "class",
    "category": "agents",
    "status": "Beta",
    "signature": "AgentRunResult(success: 'bool', output: 'str | None', session: 'Any', trace: 'Any', error_code: 'str | None' = None, error_message: 'str | None' = None, metadata: 'dict[str, JSONValue]' = <factory>) -> None",
    "summary": "Final outcome of a bounded agent run.",
    "parameters": [
      [
        "success",
        "bool",
        "required"
      ],
      [
        "output",
        "str | None",
        "required"
      ],
      [
        "session",
        "Any",
        "required"
      ],
      [
        "trace",
        "Any",
        "required"
      ],
      [
        "error_code",
        "str | None",
        "None"
      ],
      [
        "error_message",
        "str | None",
        "None"
      ],
      [
        "metadata",
        "dict[str, JSONValue]",
        "<factory>"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional audio/web integrations.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.agents import AgentRunResult\n\nprint(AgentRunResult)",
    "members": [
      [
        "to_dict(self) -> 'dict[str, Any]'",
        "Return a JSON-safe dictionary."
      ]
    ]
  },
  {
    "name": "AgentSession",
    "qualifiedName": "arclm.agents.AgentSession",
    "importPath": "arclm.agents.AgentSession",
    "canonicalImport": "from arclm.agents import AgentSession",
    "alternativeImport": "",
    "kind": "class",
    "category": "agents",
    "status": "Beta",
    "signature": "AgentSession(session_id: 'str' = <factory>, messages: 'list[AgentMessage]' = <factory>, tool_calls: 'list[ToolCall]' = <factory>, metadata: 'dict[str, Any]' = <factory>, created_at: 'float' = <factory>, updated_at: 'float' = <factory>, max_messages: 'int' = 100) -> None",
    "summary": "Bounded in-memory session state.",
    "parameters": [
      [
        "session_id",
        "str",
        "<factory>"
      ],
      [
        "messages",
        "list[AgentMessage]",
        "<factory>"
      ],
      [
        "tool_calls",
        "list[ToolCall]",
        "<factory>"
      ],
      [
        "metadata",
        "dict[str, Any]",
        "<factory>"
      ],
      [
        "created_at",
        "float",
        "<factory>"
      ],
      [
        "updated_at",
        "float",
        "<factory>"
      ],
      [
        "max_messages",
        "int",
        "100"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional audio/web integrations.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.agents import AgentSession\n\nprint(AgentSession)",
    "members": [
      [
        "add_message(self, message: 'AgentMessage') -> 'None'",
        "Append a message and enforce bounded history."
      ],
      [
        "add_tool_call(self, call: 'ToolCall') -> 'None'",
        "Record a tool call."
      ],
      [
        "from_dict(values: 'dict[str, Any]') -> \"'AgentSession'\"",
        "Restore a session from JSON-safe data."
      ],
      [
        "from_json(payload: 'str') -> \"'AgentSession'\"",
        "Restore a session from JSON."
      ],
      [
        "to_dict(self) -> 'dict[str, Any]'",
        "Return a JSON-safe session dictionary."
      ],
      [
        "to_json(self, **kwargs: 'Any') -> 'str'",
        "Serialize session state to JSON."
      ]
    ]
  },
  {
    "name": "AgentTrace",
    "qualifiedName": "arclm.agents.AgentTrace",
    "importPath": "arclm.agents.AgentTrace",
    "canonicalImport": "from arclm.agents import AgentTrace",
    "alternativeImport": "",
    "kind": "class",
    "category": "agents",
    "status": "Beta",
    "signature": "AgentTrace(run_id: 'str' = <factory>, events: 'list[AgentTraceEvent]' = <factory>) -> None",
    "summary": "Trace for one agent run.",
    "parameters": [
      [
        "run_id",
        "str",
        "<factory>"
      ],
      [
        "events",
        "list[AgentTraceEvent]",
        "<factory>"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional audio/web integrations.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.agents import AgentTrace\n\nprint(AgentTrace)",
    "members": [
      [
        "record(self, event_type: 'str', *, step: 'int' = 0, tool_name: 'str | None' = None, duration_seconds: 'float | None' = None, metadata: 'dict[str, Any] | None' = None) -> 'AgentTraceEvent'",
        "Append a safe trace event."
      ],
      [
        "to_dict(self) -> 'dict[str, Any]'",
        "Return a JSON-safe dictionary."
      ]
    ]
  },
  {
    "name": "AgentTraceEvent",
    "qualifiedName": "arclm.agents.AgentTraceEvent",
    "importPath": "arclm.agents.AgentTraceEvent",
    "canonicalImport": "from arclm.agents import AgentTraceEvent",
    "alternativeImport": "",
    "kind": "class",
    "category": "agents",
    "status": "Beta",
    "signature": "AgentTraceEvent(event_type: 'str', timestamp: 'float', run_id: 'str', step: 'int' = 0, tool_name: 'str | None' = None, duration_seconds: 'float | None' = None, metadata: 'dict[str, Any]' = <factory>) -> None",
    "summary": "One safe trace event.",
    "parameters": [
      [
        "event_type",
        "str",
        "required"
      ],
      [
        "timestamp",
        "float",
        "required"
      ],
      [
        "run_id",
        "str",
        "required"
      ],
      [
        "step",
        "int",
        "0"
      ],
      [
        "tool_name",
        "str | None",
        "None"
      ],
      [
        "duration_seconds",
        "float | None",
        "None"
      ],
      [
        "metadata",
        "dict[str, Any]",
        "<factory>"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional audio/web integrations.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.agents import AgentTraceEvent\n\nprint(AgentTraceEvent)",
    "members": [
      [
        "to_dict(self) -> 'dict[str, Any]'",
        "Return a JSON-safe dictionary."
      ]
    ]
  },
  {
    "name": "ApprovalDecision",
    "qualifiedName": "arclm.agents.ApprovalDecision",
    "importPath": "arclm.agents.ApprovalDecision",
    "canonicalImport": "from arclm.agents import ApprovalDecision",
    "alternativeImport": "",
    "kind": "class",
    "category": "agents",
    "status": "Beta",
    "signature": "ApprovalDecision(*values)",
    "summary": "Decision returned by an approval handler.",
    "parameters": [
      [
        "values",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional audio/web integrations.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.agents import ApprovalDecision\n\nprint(ApprovalDecision)",
    "members": []
  },
  {
    "name": "ArcLMJSONToolAdapter",
    "qualifiedName": "arclm.agents.ArcLMJSONToolAdapter",
    "importPath": "arclm.agents.ArcLMJSONToolAdapter",
    "canonicalImport": "from arclm.agents import ArcLMJSONToolAdapter",
    "alternativeImport": "",
    "kind": "class",
    "category": "agents",
    "status": "Beta",
    "signature": "ArcLMJSONToolAdapter(generate_text: 'Callable[[str], str]', max_output_bytes: 'int' = 65536) -> None",
    "summary": "Small adapter for ArcLM-style generation callables using strict JSON.",
    "parameters": [
      [
        "generate_text",
        "Callable[[str], str]",
        "required"
      ],
      [
        "max_output_bytes",
        "int",
        "65536"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional audio/web integrations.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.agents import ArcLMJSONToolAdapter\n\nprint(ArcLMJSONToolAdapter)",
    "members": [
      [
        "generate_response(self, *, messages: 'list[AgentMessage]', tools: 'list[dict[str, Any]]', instructions: 'str', session: 'Any') -> 'ModelResponse'",
        "Public method."
      ]
    ]
  },
  {
    "name": "AutoApprovalHandler",
    "qualifiedName": "arclm.agents.AutoApprovalHandler",
    "importPath": "arclm.agents.AutoApprovalHandler",
    "canonicalImport": "from arclm.agents import AutoApprovalHandler",
    "alternativeImport": "",
    "kind": "class",
    "category": "agents",
    "status": "Beta",
    "signature": "AutoApprovalHandler()",
    "summary": "Simple handler for tests and trusted local demos.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional audio/web integrations.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.agents import AutoApprovalHandler\n\nprint(AutoApprovalHandler)",
    "members": [
      [
        "request_approval(self, request: 'ToolApprovalRequest') -> 'ApprovalDecision'",
        "Public method."
      ]
    ]
  },
  {
    "name": "CallableModelAdapter",
    "qualifiedName": "arclm.agents.CallableModelAdapter",
    "importPath": "arclm.agents.CallableModelAdapter",
    "canonicalImport": "from arclm.agents import CallableModelAdapter",
    "alternativeImport": "",
    "kind": "class",
    "category": "agents",
    "status": "Beta",
    "signature": "CallableModelAdapter(function: 'Callable[..., ModelResponse]') -> None",
    "summary": "Adapter around a developer-supplied callable.",
    "parameters": [
      [
        "function",
        "Callable[..., ModelResponse]",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional audio/web integrations.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.agents import CallableModelAdapter\n\nprint(CallableModelAdapter)",
    "members": [
      [
        "generate_response(self, *, messages: 'list[AgentMessage]', tools: 'list[dict[str, Any]]', instructions: 'str', session: 'Any') -> 'ModelResponse'",
        "Public method."
      ],
      [
        "generate_response_async(self, *, messages: 'list[AgentMessage]', tools: 'list[dict[str, Any]]', instructions: 'str', session: 'Any') -> 'ModelResponse'",
        "Public method."
      ]
    ]
  },
  {
    "name": "CapabilityStatus",
    "qualifiedName": "arclm.agents.CapabilityStatus",
    "importPath": "arclm.agents.CapabilityStatus",
    "canonicalImport": "from arclm.agents import CapabilityStatus",
    "alternativeImport": "",
    "kind": "class",
    "category": "agents",
    "status": "Beta",
    "signature": "CapabilityStatus(*values)",
    "summary": "Agent capability status.",
    "parameters": [
      [
        "values",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional audio/web integrations.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.agents import CapabilityStatus\n\nprint(CapabilityStatus)",
    "members": []
  },
  {
    "name": "DenyApprovalHandler",
    "qualifiedName": "arclm.agents.DenyApprovalHandler",
    "importPath": "arclm.agents.DenyApprovalHandler",
    "canonicalImport": "from arclm.agents import DenyApprovalHandler",
    "alternativeImport": "",
    "kind": "class",
    "category": "agents",
    "status": "Beta",
    "signature": "DenyApprovalHandler()",
    "summary": "Default handler that denies requests requiring approval.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional audio/web integrations.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.agents import DenyApprovalHandler\n\nprint(DenyApprovalHandler)",
    "members": [
      [
        "request_approval(self, request: 'ToolApprovalRequest') -> 'ApprovalDecision'",
        "Public method."
      ]
    ]
  },
  {
    "name": "DocumentToolConfig",
    "qualifiedName": "arclm.agents.DocumentToolConfig",
    "importPath": "arclm.agents.DocumentToolConfig",
    "canonicalImport": "from arclm.agents import DocumentToolConfig",
    "alternativeImport": "",
    "kind": "class",
    "category": "agents",
    "status": "Beta",
    "signature": "DocumentToolConfig(max_input_bytes: 'int' = 1000000) -> None",
    "summary": "Serializable document-tool limits.",
    "parameters": [
      [
        "max_input_bytes",
        "int",
        "1000000"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional audio/web integrations.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.agents import DocumentToolConfig\n\nprint(DocumentToolConfig)",
    "members": []
  },
  {
    "name": "FakeSpeechToTextBackend",
    "qualifiedName": "arclm.agents.FakeSpeechToTextBackend",
    "importPath": "arclm.agents.FakeSpeechToTextBackend",
    "canonicalImport": "from arclm.agents import FakeSpeechToTextBackend",
    "alternativeImport": "",
    "kind": "class",
    "category": "agents",
    "status": "Beta",
    "signature": "FakeSpeechToTextBackend(text: 'str' = 'Hello ArcLM', language: 'str' = 'en') -> 'None'",
    "summary": "Deterministic backend for tests and examples.",
    "parameters": [
      [
        "text",
        "str",
        "'Hello ArcLM'"
      ],
      [
        "language",
        "str",
        "'en'"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional audio/web integrations.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.agents import FakeSpeechToTextBackend\n\nprint(FakeSpeechToTextBackend)",
    "members": [
      [
        "transcribe(self, request: 'TranscriptionRequest') -> 'TranscriptionResult'",
        "Public method."
      ]
    ]
  },
  {
    "name": "FinalResponse",
    "qualifiedName": "arclm.agents.FinalResponse",
    "importPath": "arclm.agents.FinalResponse",
    "canonicalImport": "from arclm.agents import FinalResponse",
    "alternativeImport": "",
    "kind": "class",
    "category": "agents",
    "status": "Beta",
    "signature": "ModelResponse(content: 'str | None' = None, tool_calls: 'list[ToolCall]' = <factory>, error_code: 'str | None' = None, error_message: 'str | None' = None, metadata: 'dict[str, Any]' = <factory>) -> None",
    "summary": "Response returned by an agent model adapter.",
    "parameters": [
      [
        "content",
        "str | None",
        "None"
      ],
      [
        "tool_calls",
        "list[ToolCall]",
        "<factory>"
      ],
      [
        "error_code",
        "str | None",
        "None"
      ],
      [
        "error_message",
        "str | None",
        "None"
      ],
      [
        "metadata",
        "dict[str, Any]",
        "<factory>"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional audio/web integrations.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.agents import FinalResponse\n\nprint(FinalResponse)",
    "members": [
      [
        "to_dict(self) -> 'dict[str, Any]'",
        "Return a JSON-safe dictionary."
      ]
    ]
  },
  {
    "name": "InMemoryResourceProvider",
    "qualifiedName": "arclm.agents.InMemoryResourceProvider",
    "importPath": "arclm.agents.InMemoryResourceProvider",
    "canonicalImport": "from arclm.agents import InMemoryResourceProvider",
    "alternativeImport": "",
    "kind": "class",
    "category": "agents",
    "status": "Beta",
    "signature": "InMemoryResourceProvider(resources: 'list[AgentResource] | None' = None) -> 'None'",
    "summary": "Minimal in-memory resource provider.",
    "parameters": [
      [
        "resources",
        "list[AgentResource] | None",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional audio/web integrations.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.agents import InMemoryResourceProvider\n\nprint(InMemoryResourceProvider)",
    "members": [
      [
        "add_resource(self, resource: 'AgentResource') -> 'None'",
        "Public method."
      ],
      [
        "list_resources(self) -> 'list[AgentResource]'",
        "Public method."
      ],
      [
        "read_resource(self, uri: 'str') -> 'AgentResource'",
        "Public method."
      ]
    ]
  },
  {
    "name": "JSONToolCallingAdapter",
    "qualifiedName": "arclm.agents.JSONToolCallingAdapter",
    "importPath": "arclm.agents.JSONToolCallingAdapter",
    "canonicalImport": "from arclm.agents import JSONToolCallingAdapter",
    "alternativeImport": "",
    "kind": "class",
    "category": "agents",
    "status": "Beta",
    "signature": "JSONToolCallingAdapter(generate_text: 'Callable[[str], str]', max_output_bytes: 'int' = 65536) -> None",
    "summary": "Strict JSON protocol adapter for plain generation callables.",
    "parameters": [
      [
        "generate_text",
        "Callable[[str], str]",
        "required"
      ],
      [
        "max_output_bytes",
        "int",
        "65536"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional audio/web integrations.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.agents import JSONToolCallingAdapter\n\nprint(JSONToolCallingAdapter)",
    "members": [
      [
        "generate_response(self, *, messages: 'list[AgentMessage]', tools: 'list[dict[str, Any]]', instructions: 'str', session: 'Any') -> 'ModelResponse'",
        "Public method."
      ]
    ]
  },
  {
    "name": "ModelResponse",
    "qualifiedName": "arclm.agents.ModelResponse",
    "importPath": "arclm.agents.ModelResponse",
    "canonicalImport": "from arclm.agents import ModelResponse",
    "alternativeImport": "",
    "kind": "class",
    "category": "agents",
    "status": "Beta",
    "signature": "ModelResponse(content: 'str | None' = None, tool_calls: 'list[ToolCall]' = <factory>, error_code: 'str | None' = None, error_message: 'str | None' = None, metadata: 'dict[str, Any]' = <factory>) -> None",
    "summary": "Response returned by an agent model adapter.",
    "parameters": [
      [
        "content",
        "str | None",
        "None"
      ],
      [
        "tool_calls",
        "list[ToolCall]",
        "<factory>"
      ],
      [
        "error_code",
        "str | None",
        "None"
      ],
      [
        "error_message",
        "str | None",
        "None"
      ],
      [
        "metadata",
        "dict[str, Any]",
        "<factory>"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional audio/web integrations.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.agents import ModelResponse\n\nprint(ModelResponse)",
    "members": [
      [
        "to_dict(self) -> 'dict[str, Any]'",
        "Return a JSON-safe dictionary."
      ]
    ]
  },
  {
    "name": "ResourceProvider",
    "qualifiedName": "arclm.agents.ResourceProvider",
    "importPath": "arclm.agents.ResourceProvider",
    "canonicalImport": "from arclm.agents import ResourceProvider",
    "alternativeImport": "",
    "kind": "class",
    "category": "agents",
    "status": "Beta",
    "signature": "ResourceProvider(*args, **kwargs)",
    "summary": "Protocol for read-only resource providers.",
    "parameters": [
      [
        "args",
        "Any",
        "required"
      ],
      [
        "kwargs",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional audio/web integrations.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.agents import ResourceProvider\n\nprint(ResourceProvider)",
    "members": [
      [
        "list_resources(self) -> 'list[AgentResource]'",
        "List resources."
      ],
      [
        "read_resource(self, uri: 'str') -> 'AgentResource'",
        "Read one resource."
      ]
    ]
  },
  {
    "name": "SessionConfig",
    "qualifiedName": "arclm.agents.SessionConfig",
    "importPath": "arclm.agents.SessionConfig",
    "canonicalImport": "from arclm.agents import SessionConfig",
    "alternativeImport": "",
    "kind": "class",
    "category": "agents",
    "status": "Beta",
    "signature": "SessionConfig(max_messages: 'int' = 100) -> None",
    "summary": "Serializable session configuration.",
    "parameters": [
      [
        "max_messages",
        "int",
        "100"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional audio/web integrations.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.agents import SessionConfig\n\nprint(SessionConfig)",
    "members": []
  },
  {
    "name": "SideEffectLevel",
    "qualifiedName": "arclm.agents.SideEffectLevel",
    "importPath": "arclm.agents.SideEffectLevel",
    "canonicalImport": "from arclm.agents import SideEffectLevel",
    "alternativeImport": "",
    "kind": "class",
    "category": "agents",
    "status": "Beta",
    "signature": "SideEffectLevel(*values)",
    "summary": "Declared side-effect level for a tool.",
    "parameters": [
      [
        "values",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional audio/web integrations.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.agents import SideEffectLevel\n\nprint(SideEffectLevel)",
    "members": []
  },
  {
    "name": "SpeechToTextBackend",
    "qualifiedName": "arclm.agents.SpeechToTextBackend",
    "importPath": "arclm.agents.SpeechToTextBackend",
    "canonicalImport": "from arclm.agents import SpeechToTextBackend",
    "alternativeImport": "",
    "kind": "class",
    "category": "agents",
    "status": "Beta",
    "signature": "SpeechToTextBackend(*args, **kwargs)",
    "summary": "Protocol for speech-to-text backends.",
    "parameters": [
      [
        "args",
        "Any",
        "required"
      ],
      [
        "kwargs",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional audio/web integrations.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.agents import SpeechToTextBackend\n\nprint(SpeechToTextBackend)",
    "members": [
      [
        "transcribe(self, request: 'TranscriptionRequest') -> 'TranscriptionResult'",
        "Transcribe a bounded local audio file."
      ]
    ]
  },
  {
    "name": "Tool",
    "qualifiedName": "arclm.agents.Tool",
    "importPath": "arclm.agents.Tool",
    "canonicalImport": "from arclm.agents import Tool",
    "alternativeImport": "",
    "kind": "class",
    "category": "agents",
    "status": "Beta",
    "signature": "Tool(spec: 'ToolSpec', function: 'Callable[..., Any]', inject_context: 'bool' = False) -> None",
    "summary": "Callable tool with strict schema validation and structured results.",
    "parameters": [
      [
        "spec",
        "ToolSpec",
        "required"
      ],
      [
        "function",
        "Callable[..., Any]",
        "required"
      ],
      [
        "inject_context",
        "bool",
        "False"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional audio/web integrations.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.agents import Tool\n\nprint(Tool)",
    "members": [
      [
        "from_callable(function: 'Callable[..., Any]', *, name: 'str | None' = None, description: 'str | None' = None, category: 'str' = 'utilities', tags: 'tuple[str, ...] | list[str]' = (), permission: 'ToolPermission | str' = <ToolPermission.PURE: 'pure'>, timeout_seconds: 'float | None' = None, side_effect: 'SideEffectLevel | str' = <SideEffectLevel.NONE: 'none'>, enabled: 'bool' = True, metadata: 'dict[str, Any] | None' = None, output_description: 'str | None' = None, output_schema: 'dict[str, Any] | None' = None) -> \"'Tool'\"",
        "Create a tool from a typed Python callable."
      ],
      [
        "invoke(self, arguments: 'dict[str, Any]', context: 'ToolContext | None' = None) -> 'ToolResult'",
        "Synchronously invoke a tool and return a structured result."
      ],
      [
        "invoke_async(self, arguments: 'dict[str, Any]', context: 'ToolContext | None' = None) -> 'ToolResult'",
        "Asynchronously invoke a tool and return a structured result."
      ],
      [
        "to_dict(self) -> 'dict[str, Any]'",
        "Return a JSON-safe tool definition."
      ],
      [
        "validate_arguments(self, arguments: 'dict[str, Any]', *, max_depth: 'int' = 20, max_collection_length: 'int' = 1000) -> 'dict[str, Any]'",
        "Validate and copy arguments before execution."
      ],
      [
        "with_enabled(self, enabled: 'bool') -> \"'Tool'\"",
        "Return a copy with a new enabled state."
      ]
    ]
  },
  {
    "name": "ToolApprovalHandler",
    "qualifiedName": "arclm.agents.ToolApprovalHandler",
    "importPath": "arclm.agents.ToolApprovalHandler",
    "canonicalImport": "from arclm.agents import ToolApprovalHandler",
    "alternativeImport": "",
    "kind": "class",
    "category": "agents",
    "status": "Beta",
    "signature": "ToolApprovalHandler(*args, **kwargs)",
    "summary": "Protocol for human or application approval handlers.",
    "parameters": [
      [
        "args",
        "Any",
        "required"
      ],
      [
        "kwargs",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional audio/web integrations.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.agents import ToolApprovalHandler\n\nprint(ToolApprovalHandler)",
    "members": [
      [
        "request_approval(self, request: 'ToolApprovalRequest') -> 'ApprovalDecision'",
        "Return an approval decision for a tool request."
      ]
    ]
  },
  {
    "name": "ToolApprovalRequest",
    "qualifiedName": "arclm.agents.ToolApprovalRequest",
    "importPath": "arclm.agents.ToolApprovalRequest",
    "canonicalImport": "from arclm.agents import ToolApprovalRequest",
    "alternativeImport": "",
    "kind": "class",
    "category": "agents",
    "status": "Beta",
    "signature": "ToolApprovalRequest(tool_name: 'str', permission: 'str', arguments: 'dict[str, Any]', session_id: 'str', reason: 'str | None' = None) -> None",
    "summary": "Safe approval request metadata.",
    "parameters": [
      [
        "tool_name",
        "str",
        "required"
      ],
      [
        "permission",
        "str",
        "required"
      ],
      [
        "arguments",
        "dict[str, Any]",
        "required"
      ],
      [
        "session_id",
        "str",
        "required"
      ],
      [
        "reason",
        "str | None",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional audio/web integrations.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.agents import ToolApprovalRequest\n\nprint(ToolApprovalRequest)",
    "members": []
  },
  {
    "name": "ToolCall",
    "qualifiedName": "arclm.agents.ToolCall",
    "importPath": "arclm.agents.ToolCall",
    "canonicalImport": "from arclm.agents import ToolCall",
    "alternativeImport": "",
    "kind": "class",
    "category": "agents",
    "status": "Beta",
    "signature": "ToolCall(id: 'str', name: 'str', arguments: 'dict[str, Any]') -> None",
    "summary": "Provider-independent request to invoke a tool.",
    "parameters": [
      [
        "id",
        "str",
        "required"
      ],
      [
        "name",
        "str",
        "required"
      ],
      [
        "arguments",
        "dict[str, Any]",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional audio/web integrations.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.agents import ToolCall\n\nprint(ToolCall)",
    "members": [
      [
        "to_dict(self) -> 'dict[str, Any]'",
        "Return a JSON-safe dictionary."
      ]
    ]
  },
  {
    "name": "ToolCollection",
    "qualifiedName": "arclm.agents.ToolCollection",
    "importPath": "arclm.agents.ToolCollection",
    "canonicalImport": "from arclm.agents import ToolCollection",
    "alternativeImport": "",
    "kind": "class",
    "category": "agents",
    "status": "Beta",
    "signature": "ToolCollection(name: 'str', tools: 'list[Tool]', description: 'str' = '', categories: 'tuple[str, ...]' = (), default_permissions: 'tuple[ToolPermission, ...]' = (<ToolPermission.PURE: 'pure'>,), optional_dependencies: 'tuple[str, ...]' = (), metadata: 'dict[str, str]' = <factory>) -> None",
    "summary": "Reusable named group of tools.",
    "parameters": [
      [
        "name",
        "str",
        "required"
      ],
      [
        "tools",
        "list[Tool]",
        "required"
      ],
      [
        "description",
        "str",
        "''"
      ],
      [
        "categories",
        "tuple[str, ...]",
        "()"
      ],
      [
        "default_permissions",
        "tuple[ToolPermission, ...]",
        "(<ToolPermission.PURE: 'pure'>,)"
      ],
      [
        "optional_dependencies",
        "tuple[str, ...]",
        "()"
      ],
      [
        "metadata",
        "dict[str, str]",
        "<factory>"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional audio/web integrations.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.agents import ToolCollection\n\nprint(ToolCollection)",
    "members": [
      [
        "capability_report(self) -> 'AgentCapabilityReport'",
        "Return collection capability status."
      ],
      [
        "to_dict(self) -> 'dict[str, object]'",
        "Return a JSON-safe description."
      ],
      [
        "to_registry(self) -> 'ToolRegistry'",
        "Create a registry containing this collection's tools."
      ]
    ]
  },
  {
    "name": "ToolContext",
    "qualifiedName": "arclm.agents.ToolContext",
    "importPath": "arclm.agents.ToolContext",
    "canonicalImport": "from arclm.agents import ToolContext",
    "alternativeImport": "",
    "kind": "class",
    "category": "agents",
    "status": "Beta",
    "signature": "ToolContext(session_id: 'str', agent_name: 'str', tool_call_id: 'str', approved_permissions: 'set[str]' = <factory>, workspace_root: 'Path | None' = None, metadata: 'dict[str, Any]' = <factory>, cancelled: 'bool' = False) -> None",
    "summary": "Bounded context for one tool invocation.",
    "parameters": [
      [
        "session_id",
        "str",
        "required"
      ],
      [
        "agent_name",
        "str",
        "required"
      ],
      [
        "tool_call_id",
        "str",
        "required"
      ],
      [
        "approved_permissions",
        "set[str]",
        "<factory>"
      ],
      [
        "workspace_root",
        "Path | None",
        "None"
      ],
      [
        "metadata",
        "dict[str, Any]",
        "<factory>"
      ],
      [
        "cancelled",
        "bool",
        "False"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional audio/web integrations.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.agents import ToolContext\n\nprint(ToolContext)",
    "members": [
      [
        "check_cancelled(self) -> 'None'",
        "Raise a cooperative cancellation error if requested."
      ],
      [
        "safe_metadata(self) -> 'dict[str, Any]'",
        "Return JSON-safe metadata only."
      ]
    ]
  },
  {
    "name": "ToolPermission",
    "qualifiedName": "arclm.agents.ToolPermission",
    "importPath": "arclm.agents.ToolPermission",
    "canonicalImport": "from arclm.agents import ToolPermission",
    "alternativeImport": "",
    "kind": "class",
    "category": "agents",
    "status": "Beta",
    "signature": "ToolPermission(*values)",
    "summary": "Permission categories a tool may request.",
    "parameters": [
      [
        "values",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional audio/web integrations.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.agents import ToolPermission\n\nprint(ToolPermission)",
    "members": []
  },
  {
    "name": "ToolPolicy",
    "qualifiedName": "arclm.agents.ToolPolicy",
    "importPath": "arclm.agents.ToolPolicy",
    "canonicalImport": "from arclm.agents import ToolPolicy",
    "alternativeImport": "",
    "kind": "class",
    "category": "agents",
    "status": "Beta",
    "signature": "ToolPolicy(allowed_tools: 'set[str] | None' = None, disabled_tools: 'set[str]' = <factory>, require_approval_for: 'set[ToolPermission]' = <factory>, stop_on_tool_failure: 'bool' = True, max_result_bytes: 'int' = 65536, max_argument_bytes: 'int' = 32768, max_json_depth: 'int' = 20, max_collection_length: 'int' = 1000) -> None",
    "summary": "Runtime policy controlling which tools may run.",
    "parameters": [
      [
        "allowed_tools",
        "set[str] | None",
        "None"
      ],
      [
        "disabled_tools",
        "set[str]",
        "<factory>"
      ],
      [
        "require_approval_for",
        "set[ToolPermission]",
        "<factory>"
      ],
      [
        "stop_on_tool_failure",
        "bool",
        "True"
      ],
      [
        "max_result_bytes",
        "int",
        "65536"
      ],
      [
        "max_argument_bytes",
        "int",
        "32768"
      ],
      [
        "max_json_depth",
        "int",
        "20"
      ],
      [
        "max_collection_length",
        "int",
        "1000"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional audio/web integrations.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.agents import ToolPolicy\n\nprint(ToolPolicy)",
    "members": [
      [
        "allows(self, tool_name: 'str') -> 'bool'",
        "Return whether a canonical tool name may be invoked."
      ],
      [
        "requires_approval(self, permission: 'ToolPermission | str') -> 'bool'",
        "Return whether a permission needs human approval."
      ]
    ]
  },
  {
    "name": "ToolRegistry",
    "qualifiedName": "arclm.agents.ToolRegistry",
    "importPath": "arclm.agents.ToolRegistry",
    "canonicalImport": "from arclm.agents import ToolRegistry",
    "alternativeImport": "",
    "kind": "class",
    "category": "agents",
    "status": "Beta",
    "signature": "ToolRegistry() -> 'None'",
    "summary": "Deterministic registry for agent tools.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional audio/web integrations.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.agents import ToolRegistry\n\nprint(ToolRegistry)",
    "members": [
      [
        "create_tool_set(self, names: 'Iterable[str]') -> 'list[Tool]'",
        "Return a deterministic list of tools by name."
      ],
      [
        "get_tool(self, name: 'str') -> 'Tool'",
        "Return a tool by name."
      ],
      [
        "has_tool(self, name: 'str') -> 'bool'",
        "Return whether a tool is registered."
      ],
      [
        "list_tools(self, *, category: 'str | None' = None, tags: 'Iterable[str] | None' = None, enabled: 'bool | None' = None) -> 'list[Tool]'",
        "List tools in deterministic name order with optional filters."
      ],
      [
        "register_tool(self, item: 'Tool', *, replace: 'bool' = False) -> 'Tool'",
        "Register a tool by canonical name."
      ],
      [
        "unregister_tool(self, name: 'str') -> 'None'",
        "Remove a registered tool."
      ]
    ]
  },
  {
    "name": "ToolResult",
    "qualifiedName": "arclm.agents.ToolResult",
    "importPath": "arclm.agents.ToolResult",
    "canonicalImport": "from arclm.agents import ToolResult",
    "alternativeImport": "",
    "kind": "class",
    "category": "agents",
    "status": "Beta",
    "signature": "ToolResult(success: 'bool', value: 'JSONValue' = None, content: 'str | None' = None, error_code: 'str | None' = None, error_message: 'str | None' = None, metadata: 'dict[str, JSONValue]' = <factory>) -> None",
    "summary": "Structured tool invocation result.",
    "parameters": [
      [
        "success",
        "bool",
        "required"
      ],
      [
        "value",
        "JSONValue",
        "None"
      ],
      [
        "content",
        "str | None",
        "None"
      ],
      [
        "error_code",
        "str | None",
        "None"
      ],
      [
        "error_message",
        "str | None",
        "None"
      ],
      [
        "metadata",
        "dict[str, JSONValue]",
        "<factory>"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional audio/web integrations.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.agents import ToolResult\n\nprint(ToolResult)",
    "members": [
      [
        "fail(code: 'str', message: 'str', *, metadata: 'dict[str, Any] | None' = None) -> \"'ToolResult'\"",
        "Create a failed tool result without exposing raw exceptions."
      ],
      [
        "ok(value: 'Any' = None, *, content: 'str | None' = None, metadata: 'dict[str, Any] | None' = None) -> \"'ToolResult'\"",
        "Create a successful tool result."
      ],
      [
        "to_dict(self) -> 'dict[str, Any]'",
        "Return a JSON-safe dictionary."
      ],
      [
        "to_json(self, **kwargs: 'Any') -> 'str'",
        "Return a JSON representation."
      ]
    ]
  },
  {
    "name": "ToolSpec",
    "qualifiedName": "arclm.agents.ToolSpec",
    "importPath": "arclm.agents.ToolSpec",
    "canonicalImport": "from arclm.agents import ToolSpec",
    "alternativeImport": "",
    "kind": "class",
    "category": "agents",
    "status": "Beta",
    "signature": "ToolSpec(name: 'str', description: 'str', input_schema: 'dict[str, Any]', output_schema: 'dict[str, Any] | None' = None, output_description: 'str | None' = None, category: 'str' = 'utilities', tags: 'tuple[str, ...]' = (), permission: 'ToolPermission' = <ToolPermission.PURE: 'pure'>, timeout_seconds: 'float | None' = None, side_effect: 'SideEffectLevel' = <SideEffectLevel.NONE: 'none'>, enabled: 'bool' = True, metadata: 'dict[str, Any]' = <factory>) -> None",
    "summary": "Serializable metadata describing a tool.",
    "parameters": [
      [
        "name",
        "str",
        "required"
      ],
      [
        "description",
        "str",
        "required"
      ],
      [
        "input_schema",
        "dict[str, Any]",
        "required"
      ],
      [
        "output_schema",
        "dict[str, Any] | None",
        "None"
      ],
      [
        "output_description",
        "str | None",
        "None"
      ],
      [
        "category",
        "str",
        "'utilities'"
      ],
      [
        "tags",
        "tuple[str, ...]",
        "()"
      ],
      [
        "permission",
        "ToolPermission",
        "<ToolPermission.PURE: 'pure'>"
      ],
      [
        "timeout_seconds",
        "float | None",
        "None"
      ],
      [
        "side_effect",
        "SideEffectLevel",
        "<SideEffectLevel.NONE: 'none'>"
      ],
      [
        "enabled",
        "bool",
        "True"
      ],
      [
        "metadata",
        "dict[str, Any]",
        "<factory>"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional audio/web integrations.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.agents import ToolSpec\n\nprint(ToolSpec)",
    "members": [
      [
        "to_dict(self) -> 'dict[str, Any]'",
        "Return JSON-safe tool definition data."
      ],
      [
        "to_mcp_schema(self) -> 'dict[str, Any]'",
        "Return a schema-ready MCP-like tool description."
      ]
    ]
  },
  {
    "name": "TraceConfig",
    "qualifiedName": "arclm.agents.TraceConfig",
    "importPath": "arclm.agents.TraceConfig",
    "canonicalImport": "from arclm.agents import TraceConfig",
    "alternativeImport": "",
    "kind": "class",
    "category": "agents",
    "status": "Beta",
    "signature": "TraceConfig(enabled: 'bool' = True, include_tool_content: 'bool' = False) -> None",
    "summary": "Serializable trace configuration.",
    "parameters": [
      [
        "enabled",
        "bool",
        "True"
      ],
      [
        "include_tool_content",
        "bool",
        "False"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional audio/web integrations.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.agents import TraceConfig\n\nprint(TraceConfig)",
    "members": []
  },
  {
    "name": "TranscriptionRequest",
    "qualifiedName": "arclm.agents.TranscriptionRequest",
    "importPath": "arclm.agents.TranscriptionRequest",
    "canonicalImport": "from arclm.agents import TranscriptionRequest",
    "alternativeImport": "",
    "kind": "class",
    "category": "agents",
    "status": "Beta",
    "signature": "TranscriptionRequest(audio_path: 'Path', language: 'str | None' = None, translate: 'bool' = False, max_bytes: 'int' = 50000000) -> None",
    "summary": "Speech-to-text request.",
    "parameters": [
      [
        "audio_path",
        "Path",
        "required"
      ],
      [
        "language",
        "str | None",
        "None"
      ],
      [
        "translate",
        "bool",
        "False"
      ],
      [
        "max_bytes",
        "int",
        "50000000"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional audio/web integrations.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.agents import TranscriptionRequest\n\nprint(TranscriptionRequest)",
    "members": []
  },
  {
    "name": "TranscriptionResult",
    "qualifiedName": "arclm.agents.TranscriptionResult",
    "importPath": "arclm.agents.TranscriptionResult",
    "canonicalImport": "from arclm.agents import TranscriptionResult",
    "alternativeImport": "",
    "kind": "class",
    "category": "agents",
    "status": "Beta",
    "signature": "TranscriptionResult(text: 'str', language: 'str | None' = None, duration_seconds: 'float | None' = None, segments: 'list[dict[str, object]]' = <factory>, metadata: 'dict[str, object]' = <factory>) -> None",
    "summary": "Structured speech-to-text result.",
    "parameters": [
      [
        "text",
        "str",
        "required"
      ],
      [
        "language",
        "str | None",
        "None"
      ],
      [
        "duration_seconds",
        "float | None",
        "None"
      ],
      [
        "segments",
        "list[dict[str, object]]",
        "<factory>"
      ],
      [
        "metadata",
        "dict[str, object]",
        "<factory>"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional audio/web integrations.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.agents import TranscriptionResult\n\nprint(TranscriptionResult)",
    "members": [
      [
        "to_dict(self) -> 'dict[str, object]'",
        "Public method."
      ]
    ]
  },
  {
    "name": "WebToolConfig",
    "qualifiedName": "arclm.agents.WebToolConfig",
    "importPath": "arclm.agents.WebToolConfig",
    "canonicalImport": "from arclm.agents import WebToolConfig",
    "alternativeImport": "",
    "kind": "class",
    "category": "agents",
    "status": "Beta",
    "signature": "WebToolConfig(max_response_bytes: 'int' = 1000000, timeout_seconds: 'float' = 10.0, max_redirects: 'int' = 5) -> None",
    "summary": "Serializable web-tool limits.",
    "parameters": [
      [
        "max_response_bytes",
        "int",
        "1000000"
      ],
      [
        "timeout_seconds",
        "float",
        "10.0"
      ],
      [
        "max_redirects",
        "int",
        "5"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional audio/web integrations.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.agents import WebToolConfig\n\nprint(WebToolConfig)",
    "members": []
  },
  {
    "name": "AgentRuntimeError",
    "qualifiedName": "arclm.agents.AgentRuntimeError",
    "importPath": "arclm.agents.AgentRuntimeError",
    "canonicalImport": "from arclm.agents import AgentRuntimeError",
    "alternativeImport": "",
    "kind": "exception",
    "category": "agents",
    "status": "Beta",
    "signature": "AgentRuntimeError(...)",
    "summary": "Base error for the ArcLM Agent Runtime.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional audio/web integrations.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.agents import AgentRuntimeError\n\ntry:\n    raise AgentRuntimeError(\"example\")\nexcept AgentRuntimeError as exc:\n    print(type(exc).__name__)",
    "members": []
  },
  {
    "name": "OptionalAgentDependencyError",
    "qualifiedName": "arclm.agents.OptionalAgentDependencyError",
    "importPath": "arclm.agents.OptionalAgentDependencyError",
    "canonicalImport": "from arclm.agents import OptionalAgentDependencyError",
    "alternativeImport": "",
    "kind": "exception",
    "category": "agents",
    "status": "Beta",
    "signature": "OptionalAgentDependencyError(...)",
    "summary": "Raised when an optional agent integration dependency is unavailable.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional audio/web integrations.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.agents import OptionalAgentDependencyError\n\ntry:\n    raise OptionalAgentDependencyError(\"example\")\nexcept OptionalAgentDependencyError as exc:\n    print(type(exc).__name__)",
    "members": []
  },
  {
    "name": "ToolError",
    "qualifiedName": "arclm.agents.ToolError",
    "importPath": "arclm.agents.ToolError",
    "canonicalImport": "from arclm.agents import ToolError",
    "alternativeImport": "",
    "kind": "exception",
    "category": "agents",
    "status": "Beta",
    "signature": "ToolError(...)",
    "summary": "Raised when a tool cannot be built, validated, or executed.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional audio/web integrations.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.agents import ToolError\n\ntry:\n    raise ToolError(\"example\")\nexcept ToolError as exc:\n    print(type(exc).__name__)",
    "members": []
  },
  {
    "name": "ToolSchemaError",
    "qualifiedName": "arclm.agents.ToolSchemaError",
    "importPath": "arclm.agents.ToolSchemaError",
    "canonicalImport": "from arclm.agents import ToolSchemaError",
    "alternativeImport": "",
    "kind": "exception",
    "category": "agents",
    "status": "Beta",
    "signature": "ToolSchemaError(...)",
    "summary": "Raised when a callable cannot be represented as a safe tool schema.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional audio/web integrations.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.agents import ToolSchemaError\n\ntry:\n    raise ToolSchemaError(\"example\")\nexcept ToolSchemaError as exc:\n    print(type(exc).__name__)",
    "members": []
  },
  {
    "name": "ToolValidationError",
    "qualifiedName": "arclm.agents.ToolValidationError",
    "importPath": "arclm.agents.ToolValidationError",
    "canonicalImport": "from arclm.agents import ToolValidationError",
    "alternativeImport": "",
    "kind": "exception",
    "category": "agents",
    "status": "Beta",
    "signature": "ToolValidationError(...)",
    "summary": "Raised when model-provided tool arguments fail validation.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional audio/web integrations.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.agents import ToolValidationError\n\ntry:\n    raise ToolValidationError(\"example\")\nexcept ToolValidationError as exc:\n    print(type(exc).__name__)",
    "members": []
  },
  {
    "name": "get_agent_capabilities",
    "qualifiedName": "arclm.agents.get_agent_capabilities",
    "importPath": "arclm.agents.get_agent_capabilities",
    "canonicalImport": "from arclm.agents import get_agent_capabilities",
    "alternativeImport": "",
    "kind": "function",
    "category": "agents",
    "status": "Beta",
    "signature": "get_agent_capabilities() -> 'AgentCapabilityReport'",
    "summary": "Return the base Agent Runtime capability report.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional audio/web integrations.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.agents import get_agent_capabilities\n\nprint(get_agent_capabilities)",
    "members": []
  },
  {
    "name": "tool",
    "qualifiedName": "arclm.agents.tool",
    "importPath": "arclm.agents.tool",
    "canonicalImport": "from arclm.agents import tool",
    "alternativeImport": "",
    "kind": "function",
    "category": "agents",
    "status": "Beta",
    "signature": "tool(function: 'Callable[..., Any] | None' = None, **options: 'Any')",
    "summary": "Decorator that exposes a typed Python function as a Tool.",
    "parameters": [
      [
        "function",
        "Callable[..., Any] | None",
        "None"
      ],
      [
        "options",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional audio/web integrations.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.agents import tool\n\nprint(tool)",
    "members": []
  },
  {
    "name": "AdaptedModelBundle",
    "qualifiedName": "arclm.checkpoints.AdaptedModelBundle",
    "importPath": "arclm.checkpoints.AdaptedModelBundle",
    "canonicalImport": "from arclm.checkpoints import AdaptedModelBundle",
    "alternativeImport": "from arclm import AdaptedModelBundle",
    "kind": "class",
    "category": "checkpoints",
    "status": "Stable",
    "signature": "AdaptedModelBundle(model: torch.nn.modules.module.Module, config: Any, checkpoint: arclm.checkpoints.loaders.base.LoadedCheckpoint, missing_keys: list, unexpected_keys: list, tokenizer_metadata: Dict[str, Any] = <factory>) -> None",
    "summary": "ArcLM model and metadata produced from a normalized checkpoint.",
    "parameters": [
      [
        "model",
        "Module",
        "required"
      ],
      [
        "config",
        "Any",
        "required"
      ],
      [
        "checkpoint",
        "LoadedCheckpoint",
        "required"
      ],
      [
        "missing_keys",
        "list",
        "required"
      ],
      [
        "unexpected_keys",
        "list",
        "required"
      ],
      [
        "tokenizer_metadata",
        "Dict",
        "<factory>"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.checkpoints import AdaptedModelBundle\n\nprint(AdaptedModelBundle)",
    "members": []
  },
  {
    "name": "CheckpointInfo",
    "qualifiedName": "arclm.checkpoints.CheckpointInfo",
    "importPath": "arclm.checkpoints.CheckpointInfo",
    "canonicalImport": "from arclm.checkpoints import CheckpointInfo",
    "alternativeImport": "",
    "kind": "class",
    "category": "checkpoints",
    "status": "Stable",
    "signature": "CheckpointInfo(path: 'str', format: 'str', version: 'int | None', legacy: 'bool', epoch: 'int', global_step: 'int', optimizer_step: 'int', precision: 'str | None' = None, device: 'str | None' = None, arclm_version: 'str | None' = None, pytorch_version: 'str | None' = None, created_at: 'float | None' = None, has_model_state: 'bool' = False, has_optimizer_state: 'bool' = False, has_scheduler_state: 'bool' = False, has_scaler_state: 'bool' = False, has_rng_state: 'bool' = False, has_lifecycle_metadata: 'bool' = False, training_state: 'dict[str, Any]' = <factory>, config_snapshot: 'dict[str, Any]' = <factory>, lifecycle_metadata: 'dict[str, Any]' = <factory>, metadata: 'dict[str, Any]' = <factory>) -> None",
    "summary": "Beschrijft een training checkpoint zonder training te starten.",
    "parameters": [
      [
        "path",
        "str",
        "required"
      ],
      [
        "format",
        "str",
        "required"
      ],
      [
        "version",
        "int | None",
        "required"
      ],
      [
        "legacy",
        "bool",
        "required"
      ],
      [
        "epoch",
        "int",
        "required"
      ],
      [
        "global_step",
        "int",
        "required"
      ],
      [
        "optimizer_step",
        "int",
        "required"
      ],
      [
        "precision",
        "str | None",
        "None"
      ],
      [
        "device",
        "str | None",
        "None"
      ],
      [
        "arclm_version",
        "str | None",
        "None"
      ],
      [
        "pytorch_version",
        "str | None",
        "None"
      ],
      [
        "created_at",
        "float | None",
        "None"
      ],
      [
        "has_model_state",
        "bool",
        "False"
      ],
      [
        "has_optimizer_state",
        "bool",
        "False"
      ],
      [
        "has_scheduler_state",
        "bool",
        "False"
      ],
      [
        "has_scaler_state",
        "bool",
        "False"
      ],
      [
        "has_rng_state",
        "bool",
        "False"
      ],
      [
        "has_lifecycle_metadata",
        "bool",
        "False"
      ],
      [
        "training_state",
        "dict[str, Any]",
        "<factory>"
      ],
      [
        "config_snapshot",
        "dict[str, Any]",
        "<factory>"
      ],
      [
        "lifecycle_metadata",
        "dict[str, Any]",
        "<factory>"
      ],
      [
        "metadata",
        "dict[str, Any]",
        "<factory>"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.checkpoints import CheckpointInfo\n\nprint(CheckpointInfo)",
    "members": [
      [
        "to_dict(self) -> 'dict[str, Any]'",
        "Zet checkpoint-info om naar een gewone dict."
      ]
    ]
  },
  {
    "name": "CheckpointLoader",
    "qualifiedName": "arclm.checkpoints.CheckpointLoader",
    "importPath": "arclm.checkpoints.CheckpointLoader",
    "canonicalImport": "from arclm.checkpoints import CheckpointLoader",
    "alternativeImport": "",
    "kind": "class",
    "category": "checkpoints",
    "status": "Stable",
    "signature": "CheckpointLoader()",
    "summary": "Base class for source-specific checkpoint loaders.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.checkpoints import CheckpointLoader\n\nprint(CheckpointLoader)",
    "members": [
      [
        "can_load(self, source: Any) -> bool",
        "Controleert of deze loader de bron kan laden."
      ],
      [
        "load(self, source: Any, map_location: str = 'cpu') -> arclm.checkpoints.loaders.base.LoadedCheckpoint",
        "Laadt de opgegeven bron."
      ]
    ]
  },
  {
    "name": "LoadedCheckpoint",
    "qualifiedName": "arclm.checkpoints.LoadedCheckpoint",
    "importPath": "arclm.checkpoints.LoadedCheckpoint",
    "canonicalImport": "from arclm.checkpoints import LoadedCheckpoint",
    "alternativeImport": "from arclm import LoadedCheckpoint",
    "kind": "class",
    "category": "checkpoints",
    "status": "Stable",
    "signature": "LoadedCheckpoint(source: str, source_type: str, state_dict: Dict[str, torch.Tensor], config: Dict[str, Any] = <factory>, vocab_size: Optional[int] = None, tokenizer_metadata: Dict[str, Any] = <factory>, vocab: Optional[list] = None, stoi: Optional[Dict[str, int]] = None, itos: Optional[Dict[int, str]] = None, optimizer_state_dict: Optional[Dict[str, Any]] = None, train_history: Dict[str, Any] = <factory>, metadata: Dict[str, Any] = <factory>) -> None",
    "summary": "Normalized representation of a model source that ArcLM can inspect.",
    "parameters": [
      [
        "source",
        "str",
        "required"
      ],
      [
        "source_type",
        "str",
        "required"
      ],
      [
        "state_dict",
        "Dict",
        "required"
      ],
      [
        "config",
        "Dict",
        "<factory>"
      ],
      [
        "vocab_size",
        "Optional",
        "None"
      ],
      [
        "tokenizer_metadata",
        "Dict",
        "<factory>"
      ],
      [
        "vocab",
        "Optional",
        "None"
      ],
      [
        "stoi",
        "Optional",
        "None"
      ],
      [
        "itos",
        "Optional",
        "None"
      ],
      [
        "optimizer_state_dict",
        "Optional",
        "None"
      ],
      [
        "train_history",
        "Dict",
        "<factory>"
      ],
      [
        "metadata",
        "Dict",
        "<factory>"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.checkpoints import LoadedCheckpoint\n\nprint(LoadedCheckpoint)",
    "members": [
      [
        "require_state_dict(self) -> Dict[str, torch.Tensor]",
        "Haalt de state dict op of geeft een duidelijke fout."
      ]
    ]
  },
  {
    "name": "LoaderRegistry",
    "qualifiedName": "arclm.checkpoints.LoaderRegistry",
    "importPath": "arclm.checkpoints.LoaderRegistry",
    "canonicalImport": "from arclm.checkpoints import LoaderRegistry",
    "alternativeImport": "",
    "kind": "class",
    "category": "checkpoints",
    "status": "Stable",
    "signature": "LoaderRegistry(loaders: Optional[Iterable[arclm.checkpoints.loaders.base.CheckpointLoader]] = None)",
    "summary": "Ordered registry that picks the first loader matching a source.",
    "parameters": [
      [
        "loaders",
        "Optional",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.checkpoints import LoaderRegistry\n\nprint(LoaderRegistry)",
    "members": [
      [
        "get_loader(self, source: Any) -> arclm.checkpoints.loaders.base.CheckpointLoader",
        "Haalt de juiste loader op voor een bron."
      ],
      [
        "load(self, source: Any, map_location: str = 'cpu') -> arclm.checkpoints.loaders.base.LoadedCheckpoint",
        "Laadt de opgegeven bron."
      ],
      [
        "register(self, loader: arclm.checkpoints.loaders.base.CheckpointLoader) -> None",
        "Registreert een item voor later gebruik."
      ]
    ]
  },
  {
    "name": "LoadPlan",
    "qualifiedName": "arclm.checkpoints.LoadPlan",
    "importPath": "arclm.checkpoints.LoadPlan",
    "canonicalImport": "from arclm.checkpoints import LoadPlan",
    "alternativeImport": "from arclm import LoadPlan",
    "kind": "class",
    "category": "checkpoints",
    "status": "Stable",
    "signature": "LoadPlan(source: 'str', source_type: 'str' = 'unknown', files: 'List[str]' = <factory>, metadata: 'Dict[str, Any]' = <factory>, model_type: 'Optional[str]' = None, architecture: 'Optional[str]' = None, tokenizer: 'Optional[str]' = None, weight_format: 'Optional[str]' = None, precision: 'Optional[str]' = None, load_as: 'Optional[str]' = None, has_optimizer: 'bool' = False, has_scheduler: 'bool' = False, has_training_state: 'bool' = False, can_resume_training: 'bool' = False, resume_epoch: 'Optional[int]' = None, resume_step: 'Optional[int]' = None, load_optimizer: 'Optional[bool]' = None, load_scheduler: 'Optional[bool]' = None, resume_training: 'Optional[bool]' = None) -> None",
    "summary": "Detected and user-selected settings for loading a model source.",
    "parameters": [
      [
        "source",
        "str",
        "required"
      ],
      [
        "source_type",
        "str",
        "'unknown'"
      ],
      [
        "files",
        "List[str]",
        "<factory>"
      ],
      [
        "metadata",
        "Dict[str, Any]",
        "<factory>"
      ],
      [
        "model_type",
        "Optional[str]",
        "None"
      ],
      [
        "architecture",
        "Optional[str]",
        "None"
      ],
      [
        "tokenizer",
        "Optional[str]",
        "None"
      ],
      [
        "weight_format",
        "Optional[str]",
        "None"
      ],
      [
        "precision",
        "Optional[str]",
        "None"
      ],
      [
        "load_as",
        "Optional[str]",
        "None"
      ],
      [
        "has_optimizer",
        "bool",
        "False"
      ],
      [
        "has_scheduler",
        "bool",
        "False"
      ],
      [
        "has_training_state",
        "bool",
        "False"
      ],
      [
        "can_resume_training",
        "bool",
        "False"
      ],
      [
        "resume_epoch",
        "Optional[int]",
        "None"
      ],
      [
        "resume_step",
        "Optional[int]",
        "None"
      ],
      [
        "load_optimizer",
        "Optional[bool]",
        "None"
      ],
      [
        "load_scheduler",
        "Optional[bool]",
        "None"
      ],
      [
        "resume_training",
        "Optional[bool]",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.checkpoints import LoadPlan\n\nprint(LoadPlan)",
    "members": [
      [
        "apply_overrides(self, overrides: 'Dict[str, Any]') -> 'None'",
        "Past expliciete overrides toe op de instellingen."
      ],
      [
        "format_report(self) -> 'str'",
        "Maakt een leesbaar rapport van de inspectie."
      ],
      [
        "to_dict(self) -> 'Dict[str, Any]'",
        "Zet dit object om naar een gewone dict."
      ]
    ]
  },
  {
    "name": "ModelInspector",
    "qualifiedName": "arclm.checkpoints.ModelInspector",
    "importPath": "arclm.checkpoints.ModelInspector",
    "canonicalImport": "from arclm.checkpoints import ModelInspector",
    "alternativeImport": "from arclm import ModelInspector",
    "kind": "class",
    "category": "checkpoints",
    "status": "Stable",
    "signature": "ModelInspector()",
    "summary": "Base class for source inspectors used by ``SmartLoader``.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.checkpoints import ModelInspector\n\nprint(ModelInspector)",
    "members": [
      [
        "can_inspect(self, source: 'Any') -> 'bool'",
        "Controleert of deze inspector de bron kan bekijken."
      ],
      [
        "inspect(self, source: 'Any') -> 'LoadPlan'",
        "Inspecteert een modelbron en geeft metadata terug."
      ]
    ]
  },
  {
    "name": "SmartLoader",
    "qualifiedName": "arclm.checkpoints.SmartLoader",
    "importPath": "arclm.checkpoints.SmartLoader",
    "canonicalImport": "from arclm.checkpoints import SmartLoader",
    "alternativeImport": "from arclm import SmartLoader",
    "kind": "class",
    "category": "checkpoints",
    "status": "Stable",
    "signature": "SmartLoader()",
    "summary": "High-level loading entry point with inspection and manual overrides.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.checkpoints import SmartLoader\n\nprint(SmartLoader)",
    "members": [
      [
        "inspect(source: 'Any', auto_detect: 'bool' = True, **overrides: 'Any') -> 'LoadPlan'",
        "Inspecteert een modelbron en geeft metadata terug."
      ],
      [
        "load(source: 'Any', auto_detect: 'bool' = True, map_location: 'str' = 'cpu', **overrides: 'Any') -> 'LoadedCheckpoint'",
        "Laadt de opgegeven bron."
      ],
      [
        "register_inspector(inspector: 'ModelInspector') -> 'None'",
        "Voert `register inspector` uit."
      ]
    ]
  },
  {
    "name": "CHECKPOINT_FORMAT",
    "qualifiedName": "arclm.checkpoints.CHECKPOINT_FORMAT",
    "importPath": "arclm.checkpoints.CHECKPOINT_FORMAT",
    "canonicalImport": "from arclm.checkpoints import CHECKPOINT_FORMAT",
    "alternativeImport": "",
    "kind": "constant",
    "category": "checkpoints",
    "status": "Stable",
    "signature": "CHECKPOINT_FORMAT",
    "summary": "str(object='') -> str str(bytes_or_buffer[, encoding[, errors]]) -> str Create a new string object from the given object.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.checkpoints import CHECKPOINT_FORMAT\n\nprint(CHECKPOINT_FORMAT)",
    "members": []
  },
  {
    "name": "CHECKPOINT_VERSION",
    "qualifiedName": "arclm.checkpoints.CHECKPOINT_VERSION",
    "importPath": "arclm.checkpoints.CHECKPOINT_VERSION",
    "canonicalImport": "from arclm.checkpoints import CHECKPOINT_VERSION",
    "alternativeImport": "",
    "kind": "constant",
    "category": "checkpoints",
    "status": "Stable",
    "signature": "CHECKPOINT_VERSION",
    "summary": "int([x]) -> integer int(x, base=10) -> integer Convert a number or string to an integer, or return 0 if no arguments are given.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.checkpoints import CHECKPOINT_VERSION\n\nprint(CHECKPOINT_VERSION)",
    "members": []
  },
  {
    "name": "adapt_for_training",
    "qualifiedName": "arclm.checkpoints.adapt_for_training",
    "importPath": "arclm.checkpoints.adapt_for_training",
    "canonicalImport": "from arclm.checkpoints import adapt_for_training",
    "alternativeImport": "from arclm import adapt_for_training",
    "kind": "function",
    "category": "checkpoints",
    "status": "Stable",
    "signature": "adapt_for_training(checkpoint: arclm.checkpoints.loaders.base.LoadedCheckpoint, target_config: Optional[arclm.configs.base.Config] = None, tokenizer: Optional[Any] = None, strict: bool = False, require_tokenizer_match: bool = False, **config_overrides) -> arclm.checkpoints.loaders.base.AdaptedModelBundle",
    "summary": "Create an ArcLM model from a normalized checkpoint.",
    "parameters": [
      [
        "checkpoint",
        "LoadedCheckpoint",
        "required"
      ],
      [
        "target_config",
        "Optional",
        "None"
      ],
      [
        "tokenizer",
        "Optional",
        "None"
      ],
      [
        "strict",
        "bool",
        "False"
      ],
      [
        "require_tokenizer_match",
        "bool",
        "False"
      ],
      [
        "config_overrides",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.checkpoints import adapt_for_training\n\nprint(adapt_for_training)",
    "members": []
  },
  {
    "name": "create_default_registry",
    "qualifiedName": "arclm.checkpoints.create_default_registry",
    "importPath": "arclm.checkpoints.create_default_registry",
    "canonicalImport": "from arclm.checkpoints import create_default_registry",
    "alternativeImport": "",
    "kind": "function",
    "category": "checkpoints",
    "status": "Stable",
    "signature": "create_default_registry() -> arclm.checkpoints.loaders.registry.LoaderRegistry",
    "summary": "Maakt de standaard registry met loaders.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.checkpoints import create_default_registry\n\nprint(create_default_registry)",
    "members": []
  },
  {
    "name": "inspect_checkpoint",
    "qualifiedName": "arclm.checkpoints.inspect_checkpoint",
    "importPath": "arclm.checkpoints.inspect_checkpoint",
    "canonicalImport": "from arclm.checkpoints import inspect_checkpoint",
    "alternativeImport": "",
    "kind": "function",
    "category": "checkpoints",
    "status": "Stable",
    "signature": "inspect_checkpoint(path: 'str | Path', *, validate: 'bool' = False) -> 'CheckpointInfo'",
    "summary": "Inspecteert een vertrouwd training checkpoint zonder objects te maken.",
    "parameters": [
      [
        "path",
        "str | Path",
        "required"
      ],
      [
        "validate",
        "bool",
        "False"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.checkpoints import inspect_checkpoint\n\nprint(inspect_checkpoint)",
    "members": []
  },
  {
    "name": "inspect_model_source",
    "qualifiedName": "arclm.checkpoints.inspect_model_source",
    "importPath": "arclm.checkpoints.inspect_model_source",
    "canonicalImport": "from arclm.checkpoints import inspect_model_source",
    "alternativeImport": "from arclm import inspect_model_source",
    "kind": "function",
    "category": "checkpoints",
    "status": "Stable",
    "signature": "inspect_model_source(source: 'Any', auto_detect: 'bool' = True, inspectors: 'Optional[Iterable[ModelInspector]]' = None, **overrides: 'Any') -> 'LoadPlan'",
    "summary": "Inspect a model source and merge explicit user settings over detections.",
    "parameters": [
      [
        "source",
        "Any",
        "required"
      ],
      [
        "auto_detect",
        "bool",
        "True"
      ],
      [
        "inspectors",
        "Optional[Iterable[ModelInspector]]",
        "None"
      ],
      [
        "overrides",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.checkpoints import inspect_model_source\n\nprint(inspect_model_source)",
    "members": []
  },
  {
    "name": "load_external_model",
    "qualifiedName": "arclm.checkpoints.load_external_model",
    "importPath": "arclm.checkpoints.load_external_model",
    "canonicalImport": "from arclm.checkpoints import load_external_model",
    "alternativeImport": "from arclm import load_external_model",
    "kind": "function",
    "category": "checkpoints",
    "status": "Stable",
    "signature": "load_external_model(source: Any, map_location: str = 'cpu') -> arclm.checkpoints.loaders.base.LoadedCheckpoint",
    "summary": "Load any supported external source into a normalized checkpoint bundle.",
    "parameters": [
      [
        "source",
        "Any",
        "required"
      ],
      [
        "map_location",
        "str",
        "'cpu'"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.checkpoints import load_external_model\n\nprint(load_external_model)",
    "members": []
  },
  {
    "name": "register_model_inspector",
    "qualifiedName": "arclm.checkpoints.register_model_inspector",
    "importPath": "arclm.checkpoints.register_model_inspector",
    "canonicalImport": "from arclm.checkpoints import register_model_inspector",
    "alternativeImport": "from arclm import register_model_inspector",
    "kind": "function",
    "category": "checkpoints",
    "status": "Stable",
    "signature": "register_model_inspector(inspector: 'ModelInspector') -> 'None'",
    "summary": "Register a custom model-source inspector.",
    "parameters": [
      [
        "inspector",
        "ModelInspector",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.checkpoints import register_model_inspector\n\nprint(register_model_inspector)",
    "members": []
  },
  {
    "name": "validate_checkpoint",
    "qualifiedName": "arclm.checkpoints.validate_checkpoint",
    "importPath": "arclm.checkpoints.validate_checkpoint",
    "canonicalImport": "from arclm.checkpoints import validate_checkpoint",
    "alternativeImport": "",
    "kind": "function",
    "category": "checkpoints",
    "status": "Stable",
    "signature": "validate_checkpoint(path: 'str | Path') -> 'CheckpointInfo'",
    "summary": "Valideert een checkpoint en geeft de veilige inspectie-info terug.",
    "parameters": [
      [
        "path",
        "str | Path",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.checkpoints import validate_checkpoint\n\nprint(validate_checkpoint)",
    "members": []
  },
  {
    "name": "validate_tokenizer_compatibility",
    "qualifiedName": "arclm.checkpoints.validate_tokenizer_compatibility",
    "importPath": "arclm.checkpoints.validate_tokenizer_compatibility",
    "canonicalImport": "from arclm.checkpoints import validate_tokenizer_compatibility",
    "alternativeImport": "from arclm import validate_tokenizer_compatibility",
    "kind": "function",
    "category": "checkpoints",
    "status": "Stable",
    "signature": "validate_tokenizer_compatibility(checkpoint: arclm.checkpoints.loaders.base.LoadedCheckpoint, tokenizer: Optional[Any] = None, config: Optional[arclm.configs.base.Config] = None) -> None",
    "summary": "Raise if a tokenizer cannot safely address the checkpoint vocabulary.",
    "parameters": [
      [
        "checkpoint",
        "LoadedCheckpoint",
        "required"
      ],
      [
        "tokenizer",
        "Optional",
        "None"
      ],
      [
        "config",
        "Optional",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.checkpoints import validate_tokenizer_compatibility\n\nprint(validate_tokenizer_compatibility)",
    "members": []
  },
  {
    "name": "Config",
    "qualifiedName": "arclm.configs.Config",
    "importPath": "arclm.configs.Config",
    "canonicalImport": "from arclm.configs import Config",
    "alternativeImport": "from arclm import Config",
    "kind": "class",
    "category": "configuration",
    "status": "Deprecated",
    "signature": "Config(**kwargs)",
    "summary": "Houdt alle belangrijke ArcLM instellingen bij.",
    "parameters": [
      [
        "kwargs",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.configs import Config\n\nprint(Config)",
    "members": [
      [
        "get_device(self)",
        "Geeft het ingestelde torch device terug."
      ],
      [
        "load_config_from_model(self, model_path)",
        "Laadt configwaarden uit een modelbron in dit object."
      ],
      [
        "set_safe(self, **kwargs)",
        "Zet config waarden veilig en negeert onbekende keys."
      ],
      [
        "to_dict(self)",
        "Zet de config om naar een gewone dict."
      ]
    ]
  },
  {
    "name": "DatasetConfig",
    "qualifiedName": "arclm.configs.DatasetConfig",
    "importPath": "arclm.configs.DatasetConfig",
    "canonicalImport": "from arclm.configs import DatasetConfig",
    "alternativeImport": "from arclm import DatasetConfig",
    "kind": "class",
    "category": "configuration",
    "status": "Deprecated",
    "signature": "Config(**kwargs)",
    "summary": "Houdt alle belangrijke ArcLM instellingen bij.",
    "parameters": [
      [
        "kwargs",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.configs import DatasetConfig\n\nprint(DatasetConfig)",
    "members": [
      [
        "get_device(self)",
        "Geeft het ingestelde torch device terug."
      ],
      [
        "load_config_from_model(self, model_path)",
        "Laadt configwaarden uit een modelbron in dit object."
      ],
      [
        "set_safe(self, **kwargs)",
        "Zet config waarden veilig en negeert onbekende keys."
      ],
      [
        "to_dict(self)",
        "Zet de config om naar een gewone dict."
      ]
    ]
  },
  {
    "name": "InferenceConfig",
    "qualifiedName": "arclm.configs.InferenceConfig",
    "importPath": "arclm.configs.InferenceConfig",
    "canonicalImport": "from arclm.configs import InferenceConfig",
    "alternativeImport": "",
    "kind": "class",
    "category": "configuration",
    "status": "Deprecated",
    "signature": "Config(**kwargs)",
    "summary": "Houdt alle belangrijke ArcLM instellingen bij.",
    "parameters": [
      [
        "kwargs",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.configs import InferenceConfig\n\nprint(InferenceConfig)",
    "members": [
      [
        "get_device(self)",
        "Geeft het ingestelde torch device terug."
      ],
      [
        "load_config_from_model(self, model_path)",
        "Laadt configwaarden uit een modelbron in dit object."
      ],
      [
        "set_safe(self, **kwargs)",
        "Zet config waarden veilig en negeert onbekende keys."
      ],
      [
        "to_dict(self)",
        "Zet de config om naar een gewone dict."
      ]
    ]
  },
  {
    "name": "ModelConfig",
    "qualifiedName": "arclm.configs.ModelConfig",
    "importPath": "arclm.configs.ModelConfig",
    "canonicalImport": "from arclm.configs import ModelConfig",
    "alternativeImport": "",
    "kind": "class",
    "category": "configuration",
    "status": "Deprecated",
    "signature": "Config(**kwargs)",
    "summary": "Houdt alle belangrijke ArcLM instellingen bij.",
    "parameters": [
      [
        "kwargs",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.configs import ModelConfig\n\nprint(ModelConfig)",
    "members": [
      [
        "get_device(self)",
        "Geeft het ingestelde torch device terug."
      ],
      [
        "load_config_from_model(self, model_path)",
        "Laadt configwaarden uit een modelbron in dit object."
      ],
      [
        "set_safe(self, **kwargs)",
        "Zet config waarden veilig en negeert onbekende keys."
      ],
      [
        "to_dict(self)",
        "Zet de config om naar een gewone dict."
      ]
    ]
  },
  {
    "name": "TokenizerConfig",
    "qualifiedName": "arclm.configs.TokenizerConfig",
    "importPath": "arclm.configs.TokenizerConfig",
    "canonicalImport": "from arclm.configs import TokenizerConfig",
    "alternativeImport": "",
    "kind": "class",
    "category": "configuration",
    "status": "Deprecated",
    "signature": "Config(**kwargs)",
    "summary": "Houdt alle belangrijke ArcLM instellingen bij.",
    "parameters": [
      [
        "kwargs",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.configs import TokenizerConfig\n\nprint(TokenizerConfig)",
    "members": [
      [
        "get_device(self)",
        "Geeft het ingestelde torch device terug."
      ],
      [
        "load_config_from_model(self, model_path)",
        "Laadt configwaarden uit een modelbron in dit object."
      ],
      [
        "set_safe(self, **kwargs)",
        "Zet config waarden veilig en negeert onbekende keys."
      ],
      [
        "to_dict(self)",
        "Zet de config om naar een gewone dict."
      ]
    ]
  },
  {
    "name": "TrainingConfig",
    "qualifiedName": "arclm.configs.TrainingConfig",
    "importPath": "arclm.configs.TrainingConfig",
    "canonicalImport": "from arclm.configs import TrainingConfig",
    "alternativeImport": "from arclm import TrainingConfig",
    "kind": "class",
    "category": "configuration",
    "status": "Deprecated",
    "signature": "Config(**kwargs)",
    "summary": "Houdt alle belangrijke ArcLM instellingen bij.",
    "parameters": [
      [
        "kwargs",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.configs import TrainingConfig\n\nprint(TrainingConfig)",
    "members": [
      [
        "get_device(self)",
        "Geeft het ingestelde torch device terug."
      ],
      [
        "load_config_from_model(self, model_path)",
        "Laadt configwaarden uit een modelbron in dit object."
      ],
      [
        "set_safe(self, **kwargs)",
        "Zet config waarden veilig en negeert onbekende keys."
      ],
      [
        "to_dict(self)",
        "Zet de config om naar een gewone dict."
      ]
    ]
  },
  {
    "name": "create_config",
    "qualifiedName": "arclm.configs.create_config",
    "importPath": "arclm.configs.create_config",
    "canonicalImport": "from arclm.configs import create_config",
    "alternativeImport": "from arclm import create_config",
    "kind": "function",
    "category": "configuration",
    "status": "Deprecated",
    "signature": "create_config(**kwargs) -> arclm.configs.base.Config",
    "summary": "Maakt een `Config` met praktische defaults.",
    "parameters": [
      [
        "kwargs",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.configs import create_config\n\nprint(create_config)",
    "members": []
  },
  {
    "name": "create_example_configs",
    "qualifiedName": "arclm.configs.create_example_configs",
    "importPath": "arclm.configs.create_example_configs",
    "canonicalImport": "from arclm.configs import create_example_configs",
    "alternativeImport": "",
    "kind": "function",
    "category": "configuration",
    "status": "Deprecated",
    "signature": "create_example_configs()",
    "summary": "Maakt voorbeeldconfiguraties in de `configs/` map.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.configs import create_example_configs\n\nprint(create_example_configs)",
    "members": []
  },
  {
    "name": "get_finetuning_config",
    "qualifiedName": "arclm.configs.get_finetuning_config",
    "importPath": "arclm.configs.get_finetuning_config",
    "canonicalImport": "from arclm.configs import get_finetuning_config",
    "alternativeImport": "",
    "kind": "function",
    "category": "configuration",
    "status": "Deprecated",
    "signature": "get_finetuning_config(num_epochs: int = 3, batch_size: int = 32, learning_rate: float = 2e-05, freeze_backbone: bool = True, use_discriminative_lr: bool = True, tokenizer_type: str = 'sentencepiece', vocab_size: int = None, user_defined_symbols=['<|qa_start|>', '<|res_start|>', '<|end|>', '<|pad|>'], **kwargs) -> arclm.configs.base.Config",
    "summary": "Maakt een config die handig is voor finetuning.",
    "parameters": [
      [
        "num_epochs",
        "int",
        "3"
      ],
      [
        "batch_size",
        "int",
        "32"
      ],
      [
        "learning_rate",
        "float",
        "2e-05"
      ],
      [
        "freeze_backbone",
        "bool",
        "True"
      ],
      [
        "use_discriminative_lr",
        "bool",
        "True"
      ],
      [
        "tokenizer_type",
        "str",
        "'sentencepiece'"
      ],
      [
        "vocab_size",
        "int",
        "None"
      ],
      [
        "user_defined_symbols",
        "Any",
        "['<|qa_start|>', '<|res_start|>', '<|end|>', '<|pad|>']"
      ],
      [
        "kwargs",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.configs import get_finetuning_config\n\nprint(get_finetuning_config)",
    "members": []
  },
  {
    "name": "get_instruction_tuning_config",
    "qualifiedName": "arclm.configs.get_instruction_tuning_config",
    "importPath": "arclm.configs.get_instruction_tuning_config",
    "canonicalImport": "from arclm.configs import get_instruction_tuning_config",
    "alternativeImport": "",
    "kind": "function",
    "category": "configuration",
    "status": "Deprecated",
    "signature": "get_instruction_tuning_config(num_epochs: int = 5, batch_size: int = 16, learning_rate: float = 5e-05, vocab_size: int = None, user_defined_symbols=['<|qa_start|>', '<|res_start|>', '<|end|>', '<|pad|>'], **kwargs) -> arclm.configs.base.Config",
    "summary": "Maakt een config die handig is voor instruction tuning.",
    "parameters": [
      [
        "num_epochs",
        "int",
        "5"
      ],
      [
        "batch_size",
        "int",
        "16"
      ],
      [
        "learning_rate",
        "float",
        "5e-05"
      ],
      [
        "vocab_size",
        "int",
        "None"
      ],
      [
        "user_defined_symbols",
        "Any",
        "['<|qa_start|>', '<|res_start|>', '<|end|>', '<|pad|>']"
      ],
      [
        "kwargs",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.configs import get_instruction_tuning_config\n\nprint(get_instruction_tuning_config)",
    "members": []
  },
  {
    "name": "load_config",
    "qualifiedName": "arclm.configs.load_config",
    "importPath": "arclm.configs.load_config",
    "canonicalImport": "from arclm.configs import load_config",
    "alternativeImport": "",
    "kind": "function",
    "category": "configuration",
    "status": "Deprecated",
    "signature": "load_config(filepath: str) -> arclm.configs.base.Config",
    "summary": "Laadt een configbestand en kiest YAML of JSON op basis van extensie.",
    "parameters": [
      [
        "filepath",
        "str",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.configs import load_config\n\nprint(load_config)",
    "members": []
  },
  {
    "name": "load_config_json",
    "qualifiedName": "arclm.configs.load_config_json",
    "importPath": "arclm.configs.load_config_json",
    "canonicalImport": "from arclm.configs import load_config_json",
    "alternativeImport": "",
    "kind": "function",
    "category": "configuration",
    "status": "Deprecated",
    "signature": "load_config_json(filepath: str) -> arclm.configs.base.Config",
    "summary": "Laadt een configuratie uit een JSON-bestand.",
    "parameters": [
      [
        "filepath",
        "str",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.configs import load_config_json\n\nprint(load_config_json)",
    "members": []
  },
  {
    "name": "load_config_yaml",
    "qualifiedName": "arclm.configs.load_config_yaml",
    "importPath": "arclm.configs.load_config_yaml",
    "canonicalImport": "from arclm.configs import load_config_yaml",
    "alternativeImport": "",
    "kind": "function",
    "category": "configuration",
    "status": "Deprecated",
    "signature": "load_config_yaml(filepath: str) -> arclm.configs.base.Config",
    "summary": "Laadt een configuratie uit een YAML-bestand.",
    "parameters": [
      [
        "filepath",
        "str",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.configs import load_config_yaml\n\nprint(load_config_yaml)",
    "members": []
  },
  {
    "name": "save_config",
    "qualifiedName": "arclm.configs.save_config",
    "importPath": "arclm.configs.save_config",
    "canonicalImport": "from arclm.configs import save_config",
    "alternativeImport": "",
    "kind": "function",
    "category": "configuration",
    "status": "Deprecated",
    "signature": "save_config(config: arclm.configs.base.Config, filepath: str) -> None",
    "summary": "Slaat een configuratie op en kiest YAML of JSON op basis van extensie.",
    "parameters": [
      [
        "config",
        "Config",
        "required"
      ],
      [
        "filepath",
        "str",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.configs import save_config\n\nprint(save_config)",
    "members": []
  },
  {
    "name": "save_config_json",
    "qualifiedName": "arclm.configs.save_config_json",
    "importPath": "arclm.configs.save_config_json",
    "canonicalImport": "from arclm.configs import save_config_json",
    "alternativeImport": "",
    "kind": "function",
    "category": "configuration",
    "status": "Deprecated",
    "signature": "save_config_json(config: arclm.configs.base.Config, filepath: str) -> None",
    "summary": "Slaat een configuratie op als JSON-bestand.",
    "parameters": [
      [
        "config",
        "Config",
        "required"
      ],
      [
        "filepath",
        "str",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.configs import save_config_json\n\nprint(save_config_json)",
    "members": []
  },
  {
    "name": "save_config_yaml",
    "qualifiedName": "arclm.configs.save_config_yaml",
    "importPath": "arclm.configs.save_config_yaml",
    "canonicalImport": "from arclm.configs import save_config_yaml",
    "alternativeImport": "",
    "kind": "function",
    "category": "configuration",
    "status": "Deprecated",
    "signature": "save_config_yaml(config: arclm.configs.base.Config, filepath: str) -> None",
    "summary": "Slaat een configuratie op als YAML-bestand.",
    "parameters": [
      [
        "config",
        "Config",
        "required"
      ],
      [
        "filepath",
        "str",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.configs import save_config_yaml\n\nprint(save_config_yaml)",
    "members": []
  },
  {
    "name": "BaseAugmenter",
    "qualifiedName": "arclm.datasets.BaseAugmenter",
    "importPath": "arclm.datasets.BaseAugmenter",
    "canonicalImport": "from arclm.datasets import BaseAugmenter",
    "alternativeImport": "from arclm import BaseAugmenter",
    "kind": "class",
    "category": "datasets",
    "status": "Stable",
    "signature": "BaseAugmenter()",
    "summary": "Basis class voor eigen data augmenters.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional preprocess helpers for HTML/YAML paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.datasets import BaseAugmenter\n\nprint(BaseAugmenter)",
    "members": [
      [
        "process(self, example: 'dict[str, Any]') -> 'dict[str, Any] | None'",
        "Verwerkt een voorbeeld."
      ]
    ]
  },
  {
    "name": "BaseCleaner",
    "qualifiedName": "arclm.datasets.BaseCleaner",
    "importPath": "arclm.datasets.BaseCleaner",
    "canonicalImport": "from arclm.datasets import BaseCleaner",
    "alternativeImport": "from arclm import BaseCleaner",
    "kind": "class",
    "category": "datasets",
    "status": "Stable",
    "signature": "BaseCleaner()",
    "summary": "Basis class voor eigen data cleaners.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional preprocess helpers for HTML/YAML paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.datasets import BaseCleaner\n\nprint(BaseCleaner)",
    "members": [
      [
        "process(self, example: 'dict[str, Any]') -> 'dict[str, Any] | None'",
        "Verwerkt een voorbeeld."
      ]
    ]
  },
  {
    "name": "BaseDataset",
    "qualifiedName": "arclm.datasets.BaseDataset",
    "importPath": "arclm.datasets.BaseDataset",
    "canonicalImport": "from arclm.datasets import BaseDataset",
    "alternativeImport": "from arclm import BaseDataset",
    "kind": "class",
    "category": "datasets",
    "status": "Stable",
    "signature": "BaseDataset()",
    "summary": "Basis class voor datasets met lengte en index-toegang.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional preprocess helpers for HTML/YAML paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.datasets import BaseDataset\n\nprint(BaseDataset)",
    "members": []
  },
  {
    "name": "BaseDataStep",
    "qualifiedName": "arclm.datasets.BaseDataStep",
    "importPath": "arclm.datasets.BaseDataStep",
    "canonicalImport": "from arclm.datasets import BaseDataStep",
    "alternativeImport": "from arclm import BaseDataStep",
    "kind": "class",
    "category": "datasets",
    "status": "Stable",
    "signature": "BaseDataStep()",
    "summary": "Basis class voor een stap die een voorbeeld verwerkt.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional preprocess helpers for HTML/YAML paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.datasets import BaseDataStep\n\nprint(BaseDataStep)",
    "members": [
      [
        "process(self, example: 'dict[str, Any]') -> 'dict[str, Any] | None'",
        "Verwerkt een voorbeeld."
      ]
    ]
  },
  {
    "name": "BaseDeduplicator",
    "qualifiedName": "arclm.datasets.BaseDeduplicator",
    "importPath": "arclm.datasets.BaseDeduplicator",
    "canonicalImport": "from arclm.datasets import BaseDeduplicator",
    "alternativeImport": "from arclm import BaseDeduplicator",
    "kind": "class",
    "category": "datasets",
    "status": "Stable",
    "signature": "BaseDeduplicator()",
    "summary": "Basis class voor deduplicatie over een hele dataset.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional preprocess helpers for HTML/YAML paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.datasets import BaseDeduplicator\n\nprint(BaseDeduplicator)",
    "members": [
      [
        "deduplicate(self, dataset)",
        "Verwijdert dubbele voorbeelden uit een dataset."
      ]
    ]
  },
  {
    "name": "BaseStreamingDataset",
    "qualifiedName": "arclm.datasets.BaseStreamingDataset",
    "importPath": "arclm.datasets.BaseStreamingDataset",
    "canonicalImport": "from arclm.datasets import BaseStreamingDataset",
    "alternativeImport": "from arclm import BaseStreamingDataset",
    "kind": "class",
    "category": "datasets",
    "status": "Stable",
    "signature": "BaseStreamingDataset()",
    "summary": "Basis class voor datasets die je alleen kunt doorlopen.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional preprocess helpers for HTML/YAML paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.datasets import BaseStreamingDataset\n\nprint(BaseStreamingDataset)",
    "members": []
  },
  {
    "name": "BaseSyntheticDataGenerator",
    "qualifiedName": "arclm.datasets.BaseSyntheticDataGenerator",
    "importPath": "arclm.datasets.BaseSyntheticDataGenerator",
    "canonicalImport": "from arclm.datasets import BaseSyntheticDataGenerator",
    "alternativeImport": "from arclm import BaseSyntheticDataGenerator",
    "kind": "class",
    "category": "datasets",
    "status": "Stable",
    "signature": "BaseSyntheticDataGenerator()",
    "summary": "Basis class voor eigen synthetic-data generators.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional preprocess helpers for HTML/YAML paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.datasets import BaseSyntheticDataGenerator\n\nprint(BaseSyntheticDataGenerator)",
    "members": [
      [
        "generate(self, count: 'int')",
        "Maakt `count` nieuwe voorbeelden."
      ]
    ]
  },
  {
    "name": "DataAugmenter",
    "qualifiedName": "arclm.datasets.DataAugmenter",
    "importPath": "arclm.datasets.DataAugmenter",
    "canonicalImport": "from arclm.datasets import DataAugmenter",
    "alternativeImport": "",
    "kind": "class",
    "category": "datasets",
    "status": "Stable",
    "signature": "BaseAugmenter()",
    "summary": "Basis class voor eigen data augmenters.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional preprocess helpers for HTML/YAML paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.datasets import DataAugmenter\n\nprint(DataAugmenter)",
    "members": [
      [
        "process(self, example: 'dict[str, Any]') -> 'dict[str, Any] | None'",
        "Verwerkt een voorbeeld."
      ]
    ]
  },
  {
    "name": "DataBundle",
    "qualifiedName": "arclm.datasets.DataBundle",
    "importPath": "arclm.datasets.DataBundle",
    "canonicalImport": "from arclm.datasets import DataBundle",
    "alternativeImport": "from arclm import DataBundle",
    "kind": "class",
    "category": "datasets",
    "status": "Stable",
    "signature": "DataBundle(tokens: 'list', train_tokens: 'list', val_tokens: 'list', tokenizer: 'Tokenizer | SentencePieceTokenizer | None', train_loader: 'object', val_loader: 'object', train_encoded: 'list', val_encoded: 'list') -> None",
    "summary": "Bundel met tokens, tokenizer en loaders voor training.",
    "parameters": [
      [
        "tokens",
        "list",
        "required"
      ],
      [
        "train_tokens",
        "list",
        "required"
      ],
      [
        "val_tokens",
        "list",
        "required"
      ],
      [
        "tokenizer",
        "Tokenizer | SentencePieceTokenizer | None",
        "required"
      ],
      [
        "train_loader",
        "object",
        "required"
      ],
      [
        "val_loader",
        "object",
        "required"
      ],
      [
        "train_encoded",
        "list",
        "required"
      ],
      [
        "val_encoded",
        "list",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional preprocess helpers for HTML/YAML paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.datasets import DataBundle\n\nprint(DataBundle)",
    "members": [
      [
        "count(self)",
        "Telt hoe vaak tokens voorkomen in de training data."
      ],
      [
        "save_tokenizer(self, path)",
        "Slaat de tokenizer metadata op als JSON."
      ]
    ]
  },
  {
    "name": "DataCleaner",
    "qualifiedName": "arclm.datasets.DataCleaner",
    "importPath": "arclm.datasets.DataCleaner",
    "canonicalImport": "from arclm.datasets import DataCleaner",
    "alternativeImport": "",
    "kind": "class",
    "category": "datasets",
    "status": "Stable",
    "signature": "BaseCleaner()",
    "summary": "Basis class voor eigen data cleaners.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional preprocess helpers for HTML/YAML paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.datasets import DataCleaner\n\nprint(DataCleaner)",
    "members": [
      [
        "process(self, example: 'dict[str, Any]') -> 'dict[str, Any] | None'",
        "Verwerkt een voorbeeld."
      ]
    ]
  },
  {
    "name": "DataPipeline",
    "qualifiedName": "arclm.datasets.DataPipeline",
    "importPath": "arclm.datasets.DataPipeline",
    "canonicalImport": "from arclm.datasets import DataPipeline",
    "alternativeImport": "from arclm import DataPipeline",
    "kind": "class",
    "category": "datasets",
    "status": "Stable",
    "signature": "DataPipeline(steps: 'Iterable[Any] | None' = None, progress_callback=None)",
    "summary": "Voert meerdere data-stappen na elkaar uit.",
    "parameters": [
      [
        "steps",
        "Iterable[Any] | None",
        "None"
      ],
      [
        "progress_callback",
        "Any",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional preprocess helpers for HTML/YAML paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.datasets import DataPipeline\n\nprint(DataPipeline)",
    "members": [
      [
        "add(self, step: 'Any') -> 'None'",
        "Voegt een stap toe aan het einde van de pipeline."
      ],
      [
        "remove(self, step_or_index: 'Any') -> 'Any'",
        "Verwijdert een stap op index of op object."
      ],
      [
        "run(self, dataset)",
        "Voert alle stappen uit en geeft de nieuwe dataset terug."
      ]
    ]
  },
  {
    "name": "DataProcessor",
    "qualifiedName": "arclm.datasets.DataProcessor",
    "importPath": "arclm.datasets.DataProcessor",
    "canonicalImport": "from arclm.datasets import DataProcessor",
    "alternativeImport": "from arclm import DataProcessor",
    "kind": "class",
    "category": "datasets",
    "status": "Stable",
    "signature": "DataProcessor()",
    "summary": "Compatibility-friendly entry point for ``ProcessedDataset`` workflows.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional preprocess helpers for HTML/YAML paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.datasets import DataProcessor\n\nprint(DataProcessor)",
    "members": [
      [
        "load(path: 'Any', format: 'Optional[str]' = None, loader: 'Optional[Callable[[Path], Iterable[Dict[str, Any]]]]' = None) -> 'ProcessedDataset'",
        "Load records through the canonical loader, then wrap them for processing."
      ]
    ]
  },
  {
    "name": "DatasetConfig",
    "qualifiedName": "arclm.datasets.DatasetConfig",
    "importPath": "arclm.datasets.DatasetConfig",
    "canonicalImport": "from arclm.datasets import DatasetConfig",
    "alternativeImport": "from arclm import DatasetConfig",
    "kind": "class",
    "category": "datasets",
    "status": "Stable",
    "signature": "DatasetConfig(source: 'Any', format: 'str | None' = None, text_field: 'str' = 'text', required_fields: 'list[str]' = <factory>, encoding: 'str' = 'utf-8', streaming: 'bool' = False) -> None",
    "summary": "Configuratie voor `load_dataset` wanneer je opties wilt hergebruiken.",
    "parameters": [
      [
        "source",
        "Any",
        "required"
      ],
      [
        "format",
        "str | None",
        "None"
      ],
      [
        "text_field",
        "str",
        "'text'"
      ],
      [
        "required_fields",
        "list[str]",
        "<factory>"
      ],
      [
        "encoding",
        "str",
        "'utf-8'"
      ],
      [
        "streaming",
        "bool",
        "False"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional preprocess helpers for HTML/YAML paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.datasets import DatasetConfig\n\nprint(DatasetConfig)",
    "members": []
  },
  {
    "name": "DatasetLoader",
    "qualifiedName": "arclm.datasets.DatasetLoader",
    "importPath": "arclm.datasets.DatasetLoader",
    "canonicalImport": "from arclm.datasets import DatasetLoader",
    "alternativeImport": "from arclm import DatasetLoader",
    "kind": "class",
    "category": "datasets",
    "status": "Stable",
    "signature": "DatasetLoader(config: 'Any' = None, *, text_field: 'str' = 'text', required_fields: 'Iterable[str] | None' = None, encoding: 'str' = 'utf-8', format: 'str | None' = None, streaming: 'bool' = False)",
    "summary": "Laadt datasets uit simpele lokale bronnen.",
    "parameters": [
      [
        "config",
        "Any",
        "None"
      ],
      [
        "text_field",
        "str",
        "'text'"
      ],
      [
        "required_fields",
        "Iterable[str] | None",
        "None"
      ],
      [
        "encoding",
        "str",
        "'utf-8'"
      ],
      [
        "format",
        "str | None",
        "None"
      ],
      [
        "streaming",
        "bool",
        "False"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional preprocess helpers for HTML/YAML paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.datasets import DatasetLoader\n\nprint(DatasetLoader)",
    "members": [
      [
        "load(self, source: 'Any' = None, **kwargs)",
        "Laadt een dataset uit een bestand, lijst of iterable."
      ],
      [
        "load_tokens(self)",
        "Laadt tokens via de oude training-config route."
      ],
      [
        "prepare(self, existing_tokenizer=None) -> 'DataBundle'",
        "Maakt training data via de oude `prepare_data` route."
      ]
    ]
  },
  {
    "name": "DatasetManifest",
    "qualifiedName": "arclm.datasets.DatasetManifest",
    "importPath": "arclm.datasets.DatasetManifest",
    "canonicalImport": "from arclm.datasets import DatasetManifest",
    "alternativeImport": "from arclm import DatasetManifest",
    "kind": "class",
    "category": "datasets",
    "status": "Stable",
    "signature": "DatasetManifest(dataset_name: 'str', manifest_version: 'int', source_type: 'str', source_files: 'tuple[str, ...]', record_count_before_processing: 'int', record_count_after_processing: 'int', invalid_records: 'int', duplicates_removed: 'int', text_fields: 'tuple[str, ...]', transformations_applied: 'tuple[str, ...]', split_information: 'dict[str, int]', created_at: 'float', arclm_version: 'str') -> None",
    "summary": "Lightweight provenance metadata for a processed dataset.",
    "parameters": [
      [
        "dataset_name",
        "str",
        "required"
      ],
      [
        "manifest_version",
        "int",
        "required"
      ],
      [
        "source_type",
        "str",
        "required"
      ],
      [
        "source_files",
        "tuple[str, ...]",
        "required"
      ],
      [
        "record_count_before_processing",
        "int",
        "required"
      ],
      [
        "record_count_after_processing",
        "int",
        "required"
      ],
      [
        "invalid_records",
        "int",
        "required"
      ],
      [
        "duplicates_removed",
        "int",
        "required"
      ],
      [
        "text_fields",
        "tuple[str, ...]",
        "required"
      ],
      [
        "transformations_applied",
        "tuple[str, ...]",
        "required"
      ],
      [
        "split_information",
        "dict[str, int]",
        "required"
      ],
      [
        "created_at",
        "float",
        "required"
      ],
      [
        "arclm_version",
        "str",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional preprocess helpers for HTML/YAML paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.datasets import DatasetManifest\n\nprint(DatasetManifest)",
    "members": [
      [
        "to_dict(self) -> 'dict[str, Any]'",
        "Return JSON-safe manifest data."
      ],
      [
        "to_json(self) -> 'str'",
        "Serialize the manifest."
      ]
    ]
  },
  {
    "name": "DatasetReport",
    "qualifiedName": "arclm.datasets.DatasetReport",
    "importPath": "arclm.datasets.DatasetReport",
    "canonicalImport": "from arclm.datasets import DatasetReport",
    "alternativeImport": "from arclm import DatasetReport",
    "kind": "class",
    "category": "datasets",
    "status": "Stable",
    "signature": "DatasetReport(record_count: 'int', valid_records: 'int', invalid_records: 'int', duplicates_removed: 'int', empty_records_removed: 'int', train_size: 'int | None', validation_size: 'int | None', min_text_length: 'int', max_text_length: 'int', average_text_length: 'float', token_count: 'int', min_token_length: 'int', max_token_length: 'int', average_token_length: 'float', unknown_token_count: 'int | None', unknown_token_rate: 'float | None', truncated_record_count: 'int', manifest: 'dict[str, Any] | None' = None) -> None",
    "summary": "A compact processed-dataset and tokenization report.",
    "parameters": [
      [
        "record_count",
        "int",
        "required"
      ],
      [
        "valid_records",
        "int",
        "required"
      ],
      [
        "invalid_records",
        "int",
        "required"
      ],
      [
        "duplicates_removed",
        "int",
        "required"
      ],
      [
        "empty_records_removed",
        "int",
        "required"
      ],
      [
        "train_size",
        "int | None",
        "required"
      ],
      [
        "validation_size",
        "int | None",
        "required"
      ],
      [
        "min_text_length",
        "int",
        "required"
      ],
      [
        "max_text_length",
        "int",
        "required"
      ],
      [
        "average_text_length",
        "float",
        "required"
      ],
      [
        "token_count",
        "int",
        "required"
      ],
      [
        "min_token_length",
        "int",
        "required"
      ],
      [
        "max_token_length",
        "int",
        "required"
      ],
      [
        "average_token_length",
        "float",
        "required"
      ],
      [
        "unknown_token_count",
        "int | None",
        "required"
      ],
      [
        "unknown_token_rate",
        "float | None",
        "required"
      ],
      [
        "truncated_record_count",
        "int",
        "required"
      ],
      [
        "manifest",
        "dict[str, Any] | None",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional preprocess helpers for HTML/YAML paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.datasets import DatasetReport\n\nprint(DatasetReport)",
    "members": [
      [
        "summary(self) -> 'str'",
        "Return a short human-readable report."
      ],
      [
        "to_dict(self) -> 'dict[str, Any]'",
        "Return JSON-safe report data."
      ],
      [
        "to_json(self) -> 'str'",
        "Serialize the report."
      ]
    ]
  },
  {
    "name": "DatasetValidationIssue",
    "qualifiedName": "arclm.datasets.DatasetValidationIssue",
    "importPath": "arclm.datasets.DatasetValidationIssue",
    "canonicalImport": "from arclm.datasets import DatasetValidationIssue",
    "alternativeImport": "from arclm import DatasetValidationIssue",
    "kind": "class",
    "category": "datasets",
    "status": "Stable",
    "signature": "DatasetValidationIssue(index: 'int', field: 'str | None', code: 'str', message: 'str', record_id: 'str | None' = None) -> None",
    "summary": "One validation problem tied to a record index and field.",
    "parameters": [
      [
        "index",
        "int",
        "required"
      ],
      [
        "field",
        "str | None",
        "required"
      ],
      [
        "code",
        "str",
        "required"
      ],
      [
        "message",
        "str",
        "required"
      ],
      [
        "record_id",
        "str | None",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional preprocess helpers for HTML/YAML paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.datasets import DatasetValidationIssue\n\nprint(DatasetValidationIssue)",
    "members": [
      [
        "to_dict(self) -> 'dict[str, Any]'",
        "Return JSON-safe issue data."
      ]
    ]
  },
  {
    "name": "DatasetValidationResult",
    "qualifiedName": "arclm.datasets.DatasetValidationResult",
    "importPath": "arclm.datasets.DatasetValidationResult",
    "canonicalImport": "from arclm.datasets import DatasetValidationResult",
    "alternativeImport": "from arclm import DatasetValidationResult",
    "kind": "class",
    "category": "datasets",
    "status": "Stable",
    "signature": "DatasetValidationResult(valid_records: 'list[dict[str, Any]]', issues: 'list[DatasetValidationIssue]', total_records: 'int') -> None",
    "summary": "Result of validating records against a small field schema.",
    "parameters": [
      [
        "valid_records",
        "list[dict[str, Any]]",
        "required"
      ],
      [
        "issues",
        "list[DatasetValidationIssue]",
        "required"
      ],
      [
        "total_records",
        "int",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional preprocess helpers for HTML/YAML paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.datasets import DatasetValidationResult\n\nprint(DatasetValidationResult)",
    "members": [
      [
        "summary(self) -> 'str'",
        "Return a short human-readable summary."
      ],
      [
        "to_dict(self) -> 'dict[str, Any]'",
        "Return JSON-safe validation data without record contents."
      ],
      [
        "to_json(self) -> 'str'",
        "Serialize the validation result."
      ]
    ]
  },
  {
    "name": "DeduplicationResult",
    "qualifiedName": "arclm.datasets.DeduplicationResult",
    "importPath": "arclm.datasets.DeduplicationResult",
    "canonicalImport": "from arclm.datasets import DeduplicationResult",
    "alternativeImport": "from arclm import DeduplicationResult",
    "kind": "class",
    "category": "datasets",
    "status": "Stable",
    "signature": "DeduplicationResult(dataset: 'list[dict[str, Any]]', kept: 'int', removed: 'int', duplicate_keys: 'list[Any]' = <factory>) -> None",
    "summary": "Resultaat van een deduplicatie stap.",
    "parameters": [
      [
        "dataset",
        "list[dict[str, Any]]",
        "required"
      ],
      [
        "kept",
        "int",
        "required"
      ],
      [
        "removed",
        "int",
        "required"
      ],
      [
        "duplicate_keys",
        "list[Any]",
        "<factory>"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional preprocess helpers for HTML/YAML paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.datasets import DeduplicationResult\n\nprint(DeduplicationResult)",
    "members": []
  },
  {
    "name": "Deduplicator",
    "qualifiedName": "arclm.datasets.Deduplicator",
    "importPath": "arclm.datasets.Deduplicator",
    "canonicalImport": "from arclm.datasets import Deduplicator",
    "alternativeImport": "",
    "kind": "class",
    "category": "datasets",
    "status": "Stable",
    "signature": "BaseDeduplicator()",
    "summary": "Basis class voor deduplicatie over een hele dataset.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional preprocess helpers for HTML/YAML paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.datasets import Deduplicator\n\nprint(Deduplicator)",
    "members": [
      [
        "deduplicate(self, dataset)",
        "Verwijdert dubbele voorbeelden uit een dataset."
      ]
    ]
  },
  {
    "name": "ExactDeduplicator",
    "qualifiedName": "arclm.datasets.ExactDeduplicator",
    "importPath": "arclm.datasets.ExactDeduplicator",
    "canonicalImport": "from arclm.datasets import ExactDeduplicator",
    "alternativeImport": "from arclm import ExactDeduplicator",
    "kind": "class",
    "category": "datasets",
    "status": "Stable",
    "signature": "ExactDeduplicator(field: 'str | None' = None, fields: 'list[str] | tuple[str, ...] | None' = None, *, normalize: 'bool' = False, keep: 'str' = 'first', hash_algorithm: 'str | None' = None, missing: 'str' = 'keep')",
    "summary": "Verwijdert voorbeelden met dezelfde waarde in gekozen velden.",
    "parameters": [
      [
        "field",
        "str | None",
        "None"
      ],
      [
        "fields",
        "list[str] | tuple[str, ...] | None",
        "None"
      ],
      [
        "normalize",
        "bool",
        "False"
      ],
      [
        "keep",
        "str",
        "'first'"
      ],
      [
        "hash_algorithm",
        "str | None",
        "None"
      ],
      [
        "missing",
        "str",
        "'keep'"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional preprocess helpers for HTML/YAML paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.datasets import ExactDeduplicator\n\nprint(ExactDeduplicator)",
    "members": [
      [
        "deduplicate(self, dataset) -> 'DeduplicationResult'",
        "Geeft een dataset terug zonder exacte duplicaten."
      ]
    ]
  },
  {
    "name": "InstructionDataset",
    "qualifiedName": "arclm.datasets.InstructionDataset",
    "importPath": "arclm.datasets.InstructionDataset",
    "canonicalImport": "from arclm.datasets import InstructionDataset",
    "alternativeImport": "from arclm import InstructionDataset",
    "kind": "class",
    "category": "datasets",
    "status": "Stable",
    "signature": "InstructionDataset(instructions, responses, tokenizer, block_size, instruction_prefix='<|instruction|>', response_prefix='<|response|>')",
    "summary": "Dataset voor instruction tuning met loss alleen op response tokens.",
    "parameters": [
      [
        "instructions",
        "Any",
        "required"
      ],
      [
        "responses",
        "Any",
        "required"
      ],
      [
        "tokenizer",
        "Any",
        "required"
      ],
      [
        "block_size",
        "Any",
        "required"
      ],
      [
        "instruction_prefix",
        "Any",
        "'<|instruction|>'"
      ],
      [
        "response_prefix",
        "Any",
        "'<|response|>'"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional preprocess helpers for HTML/YAML paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.datasets import InstructionDataset\n\nprint(InstructionDataset)",
    "members": []
  },
  {
    "name": "ProcessedDataset",
    "qualifiedName": "arclm.datasets.ProcessedDataset",
    "importPath": "arclm.datasets.ProcessedDataset",
    "canonicalImport": "from arclm.datasets import ProcessedDataset",
    "alternativeImport": "from arclm import ProcessedDataset",
    "kind": "class",
    "category": "datasets",
    "status": "Stable",
    "signature": "ProcessedDataset(samples: 'List[Dict[str, Any]]' = <factory>, source: 'Optional[str]' = None) -> None",
    "summary": "Kleine in-memory dataset voor formatting, cleaning en splits.",
    "parameters": [
      [
        "samples",
        "List[Dict[str, Any]]",
        "<factory>"
      ],
      [
        "source",
        "Optional[str]",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional preprocess helpers for HTML/YAML paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.datasets import ProcessedDataset\n\nprint(ProcessedDataset)",
    "members": [
      [
        "clean(self, text_keys: 'Optional[Iterable[str]]' = None) -> \"'ProcessedDataset'\"",
        "Normaliseert whitespace in tekstvelden."
      ],
      [
        "filter(self, predicate: 'Callable[[Dict[str, Any]], bool]') -> \"'ProcessedDataset'\"",
        "Houdt alleen voorbeelden waarvoor de predicate True teruggeeft."
      ],
      [
        "map_batches(self, function: 'Callable[[List[Dict[str, Any]]], Iterable[Dict[str, Any]]]', batch_size: 'int' = 32) -> \"'ProcessedDataset'\"",
        "Past een functie toe op batches van voorbeelden."
      ],
      [
        "split(self, train: 'float' = 0.8, validation: 'float' = 0.1, test: 'float' = 0.1, seed: 'int' = 42) -> 'Dict[str, List[Dict[str, Any]]]'",
        "Splitst de voorbeelden in train, validation en test lijsten."
      ],
      [
        "tokenize(self, tokenizer: 'Any', text_key: 'str' = 'text') -> \"'ProcessedDataset'\"",
        "Voegt token ids toe aan elk voorbeeld."
      ],
      [
        "transform(self, format: 'str' = 'pretraining', mapping: 'Optional[Dict[str, str]]' = None, template: 'Optional[str]' = None, text_fields: 'Optional[Iterable[str]]' = None, tokenizer: 'Any' = None) -> \"'ProcessedDataset'\"",
        "Zet voorbeelden om naar tekst voor pretraining, instructies of chat."
      ]
    ]
  },
  {
    "name": "RemoveDuplicates",
    "qualifiedName": "arclm.datasets.RemoveDuplicates",
    "importPath": "arclm.datasets.RemoveDuplicates",
    "canonicalImport": "from arclm.datasets import RemoveDuplicates",
    "alternativeImport": "from arclm import RemoveDuplicates",
    "kind": "class",
    "category": "datasets",
    "status": "Stable",
    "signature": "ExactDeduplicator(field: 'str | None' = None, fields: 'list[str] | tuple[str, ...] | None' = None, *, normalize: 'bool' = False, keep: 'str' = 'first', hash_algorithm: 'str | None' = None, missing: 'str' = 'keep')",
    "summary": "Verwijdert voorbeelden met dezelfde waarde in gekozen velden.",
    "parameters": [
      [
        "field",
        "str | None",
        "None"
      ],
      [
        "fields",
        "list[str] | tuple[str, ...] | None",
        "None"
      ],
      [
        "normalize",
        "bool",
        "False"
      ],
      [
        "keep",
        "str",
        "'first'"
      ],
      [
        "hash_algorithm",
        "str | None",
        "None"
      ],
      [
        "missing",
        "str",
        "'keep'"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional preprocess helpers for HTML/YAML paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.datasets import RemoveDuplicates\n\nprint(RemoveDuplicates)",
    "members": [
      [
        "deduplicate(self, dataset) -> 'DeduplicationResult'",
        "Geeft een dataset terug zonder exacte duplicaten."
      ]
    ]
  },
  {
    "name": "StreamingDataset",
    "qualifiedName": "arclm.datasets.StreamingDataset",
    "importPath": "arclm.datasets.StreamingDataset",
    "canonicalImport": "from arclm.datasets import StreamingDataset",
    "alternativeImport": "from arclm import StreamingDataset",
    "kind": "class",
    "category": "datasets",
    "status": "Stable",
    "signature": "StreamingDataset(factory: 'Callable[[], Iterator[dict[str, Any]]]')",
    "summary": "Dataset die voorbeelden pas leest tijdens het itereren.",
    "parameters": [
      [
        "factory",
        "Callable[[], Iterator[dict[str, Any]]]",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional preprocess helpers for HTML/YAML paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.datasets import StreamingDataset\n\nprint(StreamingDataset)",
    "members": [
      [
        "from_csv(path: 'str | Path', encoding: 'str' = 'utf-8') -> \"'StreamingDataset'\"",
        "Leest een CSV-bestand rij voor rij."
      ],
      [
        "from_jsonl(path: 'str | Path', encoding: 'str' = 'utf-8') -> \"'StreamingDataset'\"",
        "Leest een JSONL-bestand regel voor regel."
      ],
      [
        "from_txt(path: 'str | Path', text_field: 'str' = 'text', encoding: 'str' = 'utf-8') -> \"'StreamingDataset'\"",
        "Leest een tekstbestand regel voor regel."
      ]
    ]
  },
  {
    "name": "TextDataset",
    "qualifiedName": "arclm.datasets.TextDataset",
    "importPath": "arclm.datasets.TextDataset",
    "canonicalImport": "from arclm.datasets import TextDataset",
    "alternativeImport": "from arclm import TextDataset",
    "kind": "class",
    "category": "datasets",
    "status": "Stable",
    "signature": "TextDataset(data, block_size)",
    "summary": "Dataset voor taalmodeltraining met een schuivend venster.",
    "parameters": [
      [
        "data",
        "Any",
        "required"
      ],
      [
        "block_size",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional preprocess helpers for HTML/YAML paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.datasets import TextDataset\n\nprint(TextDataset)",
    "members": []
  },
  {
    "name": "build_dataset_report",
    "qualifiedName": "arclm.datasets.build_dataset_report",
    "importPath": "arclm.datasets.build_dataset_report",
    "canonicalImport": "from arclm.datasets import build_dataset_report",
    "alternativeImport": "from arclm import build_dataset_report",
    "kind": "function",
    "category": "datasets",
    "status": "Stable",
    "signature": "build_dataset_report(records: 'Iterable[Mapping[str, Any]]', *, tokenizer: 'Any | None' = None, text_fields: 'Sequence[str]' = ('text',), validation_result: 'DatasetValidationResult | None' = None, manifest: 'DatasetManifest | None' = None, split_information: 'Mapping[str, int] | None' = None, duplicates_removed: 'int' = 0, empty_records_removed: 'int | None' = None, truncated_record_count: 'int' = 0, max_token_length: 'int | None' = None) -> 'DatasetReport'",
    "summary": "Build a processed dataset report with optional token statistics.",
    "parameters": [
      [
        "records",
        "Iterable[Mapping[str, Any]]",
        "required"
      ],
      [
        "tokenizer",
        "Any | None",
        "None"
      ],
      [
        "text_fields",
        "Sequence[str]",
        "('text',)"
      ],
      [
        "validation_result",
        "DatasetValidationResult | None",
        "None"
      ],
      [
        "manifest",
        "DatasetManifest | None",
        "None"
      ],
      [
        "split_information",
        "Mapping[str, int] | None",
        "None"
      ],
      [
        "duplicates_removed",
        "int",
        "0"
      ],
      [
        "empty_records_removed",
        "int | None",
        "None"
      ],
      [
        "truncated_record_count",
        "int",
        "0"
      ],
      [
        "max_token_length",
        "int | None",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional preprocess helpers for HTML/YAML paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.datasets import build_dataset_report\n\nprint(build_dataset_report)",
    "members": []
  },
  {
    "name": "create_dataloader",
    "qualifiedName": "arclm.datasets.create_dataloader",
    "importPath": "arclm.datasets.create_dataloader",
    "canonicalImport": "from arclm.datasets import create_dataloader",
    "alternativeImport": "from arclm import create_dataloader",
    "kind": "function",
    "category": "datasets",
    "status": "Stable",
    "signature": "create_dataloader(encoded_data, block_size, batch_size, shuffle=True)",
    "summary": "Maakt een PyTorch DataLoader van token ids.",
    "parameters": [
      [
        "encoded_data",
        "Any",
        "required"
      ],
      [
        "block_size",
        "Any",
        "required"
      ],
      [
        "batch_size",
        "Any",
        "required"
      ],
      [
        "shuffle",
        "Any",
        "True"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional preprocess helpers for HTML/YAML paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.datasets import create_dataloader\n\nprint(create_dataloader)",
    "members": []
  },
  {
    "name": "create_dataset_manifest",
    "qualifiedName": "arclm.datasets.create_dataset_manifest",
    "importPath": "arclm.datasets.create_dataset_manifest",
    "canonicalImport": "from arclm.datasets import create_dataset_manifest",
    "alternativeImport": "from arclm import create_dataset_manifest",
    "kind": "function",
    "category": "datasets",
    "status": "Stable",
    "signature": "create_dataset_manifest(*, dataset_name: 'str', source_type: 'str', records_before: 'int', records_after: 'int', validation_result: 'DatasetValidationResult | None' = None, source_files: 'Sequence[str | Path]' = (), duplicates_removed: 'int' = 0, text_fields: 'Sequence[str]' = ('text',), transformations_applied: 'Sequence[str]' = (), split_information: 'Mapping[str, int] | None' = None) -> 'DatasetManifest'",
    "summary": "Create lightweight dataset provenance without storing record values.",
    "parameters": [
      [
        "dataset_name",
        "str",
        "required"
      ],
      [
        "source_type",
        "str",
        "required"
      ],
      [
        "records_before",
        "int",
        "required"
      ],
      [
        "records_after",
        "int",
        "required"
      ],
      [
        "validation_result",
        "DatasetValidationResult | None",
        "None"
      ],
      [
        "source_files",
        "Sequence[str | Path]",
        "()"
      ],
      [
        "duplicates_removed",
        "int",
        "0"
      ],
      [
        "text_fields",
        "Sequence[str]",
        "('text',)"
      ],
      [
        "transformations_applied",
        "Sequence[str]",
        "()"
      ],
      [
        "split_information",
        "Mapping[str, int] | None",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional preprocess helpers for HTML/YAML paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.datasets import create_dataset_manifest\n\nprint(create_dataset_manifest)",
    "members": []
  },
  {
    "name": "create_instruction_dataloader",
    "qualifiedName": "arclm.datasets.create_instruction_dataloader",
    "importPath": "arclm.datasets.create_instruction_dataloader",
    "canonicalImport": "from arclm.datasets import create_instruction_dataloader",
    "alternativeImport": "from arclm import create_instruction_dataloader",
    "kind": "function",
    "category": "datasets",
    "status": "Stable",
    "signature": "create_instruction_dataloader(instructions, responses, tokenizer, block_size, batch_size, shuffle=True)",
    "summary": "Maakt een DataLoader voor instruction tuning.",
    "parameters": [
      [
        "instructions",
        "Any",
        "required"
      ],
      [
        "responses",
        "Any",
        "required"
      ],
      [
        "tokenizer",
        "Any",
        "required"
      ],
      [
        "block_size",
        "Any",
        "required"
      ],
      [
        "batch_size",
        "Any",
        "required"
      ],
      [
        "shuffle",
        "Any",
        "True"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional preprocess helpers for HTML/YAML paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.datasets import create_instruction_dataloader\n\nprint(create_instruction_dataloader)",
    "members": []
  },
  {
    "name": "deduplicate",
    "qualifiedName": "arclm.datasets.deduplicate",
    "importPath": "arclm.datasets.deduplicate",
    "canonicalImport": "from arclm.datasets import deduplicate",
    "alternativeImport": "from arclm import deduplicate",
    "kind": "function",
    "category": "datasets",
    "status": "Stable",
    "signature": "deduplicate(dataset, *, return_result: 'bool' = False, **kwargs)",
    "summary": "Verwijdert exacte duplicaten met `ExactDeduplicator`.",
    "parameters": [
      [
        "dataset",
        "Any",
        "required"
      ],
      [
        "return_result",
        "bool",
        "False"
      ],
      [
        "kwargs",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional preprocess helpers for HTML/YAML paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.datasets import deduplicate\n\nprint(deduplicate)",
    "members": []
  },
  {
    "name": "load_dataset",
    "qualifiedName": "arclm.datasets.load_dataset",
    "importPath": "arclm.datasets.load_dataset",
    "canonicalImport": "from arclm.datasets import load_dataset",
    "alternativeImport": "from arclm import load_dataset",
    "kind": "function",
    "category": "datasets",
    "status": "Stable",
    "signature": "load_dataset(source: 'Any', **kwargs)",
    "summary": "Laadt een dataset met de standaard DatasetLoader.",
    "parameters": [
      [
        "source",
        "Any",
        "required"
      ],
      [
        "kwargs",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional preprocess helpers for HTML/YAML paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.datasets import load_dataset\n\nprint(load_dataset)",
    "members": []
  },
  {
    "name": "load_tokenizer_from_checkpoint",
    "qualifiedName": "arclm.datasets.load_tokenizer_from_checkpoint",
    "importPath": "arclm.datasets.load_tokenizer_from_checkpoint",
    "canonicalImport": "from arclm.datasets import load_tokenizer_from_checkpoint",
    "alternativeImport": "",
    "kind": "function",
    "category": "datasets",
    "status": "Stable",
    "signature": "load_tokenizer_from_checkpoint(checkpoint)",
    "summary": "Haalt een tokenizer uit checkpoint metadata als dat mogelijk is.",
    "parameters": [
      [
        "checkpoint",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional preprocess helpers for HTML/YAML paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.datasets import load_tokenizer_from_checkpoint\n\nprint(load_tokenizer_from_checkpoint)",
    "members": []
  },
  {
    "name": "load_tokens",
    "qualifiedName": "arclm.datasets.load_tokens",
    "importPath": "arclm.datasets.load_tokens",
    "canonicalImport": "from arclm.datasets import load_tokens",
    "alternativeImport": "from arclm import load_tokens",
    "kind": "function",
    "category": "datasets",
    "status": "Stable",
    "signature": "load_tokens(config)",
    "summary": "Laadt tokens uit de ingestelde dataset en optioneel uit domeindata.",
    "parameters": [
      [
        "config",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional preprocess helpers for HTML/YAML paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.datasets import load_tokens\n\nprint(load_tokens)",
    "members": []
  },
  {
    "name": "prepare_data",
    "qualifiedName": "arclm.datasets.prepare_data",
    "importPath": "arclm.datasets.prepare_data",
    "canonicalImport": "from arclm.datasets import prepare_data",
    "alternativeImport": "from arclm import prepare_data",
    "kind": "function",
    "category": "datasets",
    "status": "Stable",
    "signature": "prepare_data(config: 'Config', existing_tokenizer=None) -> 'DataBundle'",
    "summary": "Maakt tokens, splits, tokenizer en DataLoaders klaar voor training.",
    "parameters": [
      [
        "config",
        "Config",
        "required"
      ],
      [
        "existing_tokenizer",
        "Any",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional preprocess helpers for HTML/YAML paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.datasets import prepare_data\n\nprint(prepare_data)",
    "members": []
  },
  {
    "name": "read_tokens",
    "qualifiedName": "arclm.datasets.read_tokens",
    "importPath": "arclm.datasets.read_tokens",
    "canonicalImport": "from arclm.datasets import read_tokens",
    "alternativeImport": "from arclm import read_tokens",
    "kind": "function",
    "category": "datasets",
    "status": "Stable",
    "signature": "read_tokens(path, limit)",
    "summary": "Leest lowercase whitespace tokens uit een tekstbestand en bewaart newlines.",
    "parameters": [
      [
        "path",
        "Any",
        "required"
      ],
      [
        "limit",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional preprocess helpers for HTML/YAML paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.datasets import read_tokens\n\nprint(read_tokens)",
    "members": []
  },
  {
    "name": "split_train_val",
    "qualifiedName": "arclm.datasets.split_train_val",
    "importPath": "arclm.datasets.split_train_val",
    "canonicalImport": "from arclm.datasets import split_train_val",
    "alternativeImport": "from arclm import split_train_val",
    "kind": "function",
    "category": "datasets",
    "status": "Stable",
    "signature": "split_train_val(tokens, validation_split, block_size, seed=42)",
    "summary": "Splitst tokens in train en validatie data.",
    "parameters": [
      [
        "tokens",
        "Any",
        "required"
      ],
      [
        "validation_split",
        "Any",
        "required"
      ],
      [
        "block_size",
        "Any",
        "required"
      ],
      [
        "seed",
        "Any",
        "42"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional preprocess helpers for HTML/YAML paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.datasets import split_train_val\n\nprint(split_train_val)",
    "members": []
  },
  {
    "name": "validate_records",
    "qualifiedName": "arclm.datasets.validate_records",
    "importPath": "arclm.datasets.validate_records",
    "canonicalImport": "from arclm.datasets import validate_records",
    "alternativeImport": "from arclm import validate_records",
    "kind": "function",
    "category": "datasets",
    "status": "Stable",
    "signature": "validate_records(records: 'Iterable[Mapping[str, Any]]', *, required_fields: 'Sequence[str]', field_types: 'Mapping[str, type | tuple[type, ...]] | None' = None, allow_empty: 'bool' = False, strict: 'bool' = True, record_id_field: 'str | None' = None) -> 'DatasetValidationResult'",
    "summary": "Validate mapping records with a small schema.",
    "parameters": [
      [
        "records",
        "Iterable[Mapping[str, Any]]",
        "required"
      ],
      [
        "required_fields",
        "Sequence[str]",
        "required"
      ],
      [
        "field_types",
        "Mapping[str, type | tuple[type, ...]] | None",
        "None"
      ],
      [
        "allow_empty",
        "bool",
        "False"
      ],
      [
        "strict",
        "bool",
        "True"
      ],
      [
        "record_id_field",
        "str | None",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional preprocess helpers for HTML/YAML paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.datasets import validate_records\n\nprint(validate_records)",
    "members": []
  },
  {
    "name": "ArcLMError",
    "qualifiedName": "arclm.exceptions.ArcLMError",
    "importPath": "arclm.exceptions.ArcLMError",
    "canonicalImport": "from arclm.exceptions import ArcLMError",
    "alternativeImport": "",
    "kind": "exception",
    "category": "errors",
    "status": "Stable",
    "signature": "ArcLMError(...)",
    "summary": "Base exception for ArcLM.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.exceptions import ArcLMError\n\ntry:\n    raise ArcLMError(\"example\")\nexcept ArcLMError as exc:\n    print(type(exc).__name__)",
    "members": []
  },
  {
    "name": "CheckpointError",
    "qualifiedName": "arclm.exceptions.CheckpointError",
    "importPath": "arclm.exceptions.CheckpointError",
    "canonicalImport": "from arclm.exceptions import CheckpointError",
    "alternativeImport": "",
    "kind": "exception",
    "category": "errors",
    "status": "Stable",
    "signature": "CheckpointError(...)",
    "summary": "Raised for checkpoint errors.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.exceptions import CheckpointError\n\ntry:\n    raise CheckpointError(\"example\")\nexcept CheckpointError as exc:\n    print(type(exc).__name__)",
    "members": []
  },
  {
    "name": "CleaningError",
    "qualifiedName": "arclm.exceptions.CleaningError",
    "importPath": "arclm.exceptions.CleaningError",
    "canonicalImport": "from arclm.exceptions import CleaningError",
    "alternativeImport": "",
    "kind": "exception",
    "category": "errors",
    "status": "Stable",
    "signature": "CleaningError(...)",
    "summary": "Raised when a cleaning step cannot process an example.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.exceptions import CleaningError\n\ntry:\n    raise CleaningError(\"example\")\nexcept CleaningError as exc:\n    print(type(exc).__name__)",
    "members": []
  },
  {
    "name": "ConfigurationError",
    "qualifiedName": "arclm.exceptions.ConfigurationError",
    "importPath": "arclm.exceptions.ConfigurationError",
    "canonicalImport": "from arclm.exceptions import ConfigurationError",
    "alternativeImport": "",
    "kind": "exception",
    "category": "errors",
    "status": "Stable",
    "signature": "ConfigurationError(...)",
    "summary": "Raised for invalid configuration.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.exceptions import ConfigurationError\n\ntry:\n    raise ConfigurationError(\"example\")\nexcept ConfigurationError as exc:\n    print(type(exc).__name__)",
    "members": []
  },
  {
    "name": "DataCollatorError",
    "qualifiedName": "arclm.exceptions.DataCollatorError",
    "importPath": "arclm.exceptions.DataCollatorError",
    "canonicalImport": "from arclm.exceptions import DataCollatorError",
    "alternativeImport": "",
    "kind": "exception",
    "category": "errors",
    "status": "Stable",
    "signature": "DataCollatorError(...)",
    "summary": "Raised when SFT batches cannot be collated.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.exceptions import DataCollatorError\n\ntry:\n    raise DataCollatorError(\"example\")\nexcept DataCollatorError as exc:\n    print(type(exc).__name__)",
    "members": []
  },
  {
    "name": "DatasetError",
    "qualifiedName": "arclm.exceptions.DatasetError",
    "importPath": "arclm.exceptions.DatasetError",
    "canonicalImport": "from arclm.exceptions import DatasetError",
    "alternativeImport": "",
    "kind": "exception",
    "category": "errors",
    "status": "Stable",
    "signature": "DatasetError(...)",
    "summary": "Raised for dataset errors.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.exceptions import DatasetError\n\ntry:\n    raise DatasetError(\"example\")\nexcept DatasetError as exc:\n    print(type(exc).__name__)",
    "members": []
  },
  {
    "name": "DatasetLoadError",
    "qualifiedName": "arclm.exceptions.DatasetLoadError",
    "importPath": "arclm.exceptions.DatasetLoadError",
    "canonicalImport": "from arclm.exceptions import DatasetLoadError",
    "alternativeImport": "",
    "kind": "exception",
    "category": "errors",
    "status": "Stable",
    "signature": "DatasetLoadError(...)",
    "summary": "Raised when a dataset cannot be loaded.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.exceptions import DatasetLoadError\n\ntry:\n    raise DatasetLoadError(\"example\")\nexcept DatasetLoadError as exc:\n    print(type(exc).__name__)",
    "members": []
  },
  {
    "name": "DatasetValidationError",
    "qualifiedName": "arclm.exceptions.DatasetValidationError",
    "importPath": "arclm.exceptions.DatasetValidationError",
    "canonicalImport": "from arclm.exceptions import DatasetValidationError",
    "alternativeImport": "",
    "kind": "exception",
    "category": "errors",
    "status": "Stable",
    "signature": "DatasetValidationError(...)",
    "summary": "Raised when dataset rows do not match the expected shape.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.exceptions import DatasetValidationError\n\ntry:\n    raise DatasetValidationError(\"example\")\nexcept DatasetValidationError as exc:\n    print(type(exc).__name__)",
    "members": []
  },
  {
    "name": "DatasetVersionError",
    "qualifiedName": "arclm.exceptions.DatasetVersionError",
    "importPath": "arclm.exceptions.DatasetVersionError",
    "canonicalImport": "from arclm.exceptions import DatasetVersionError",
    "alternativeImport": "",
    "kind": "exception",
    "category": "errors",
    "status": "Stable",
    "signature": "DatasetVersionError(...)",
    "summary": "Raised when local dataset versioning fails.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.exceptions import DatasetVersionError\n\ntry:\n    raise DatasetVersionError(\"example\")\nexcept DatasetVersionError as exc:\n    print(type(exc).__name__)",
    "members": []
  },
  {
    "name": "DeduplicationError",
    "qualifiedName": "arclm.exceptions.DeduplicationError",
    "importPath": "arclm.exceptions.DeduplicationError",
    "canonicalImport": "from arclm.exceptions import DeduplicationError",
    "alternativeImport": "",
    "kind": "exception",
    "category": "errors",
    "status": "Stable",
    "signature": "DeduplicationError(...)",
    "summary": "Raised when deduplication fails.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.exceptions import DeduplicationError\n\ntry:\n    raise DeduplicationError(\"example\")\nexcept DeduplicationError as exc:\n    print(type(exc).__name__)",
    "members": []
  },
  {
    "name": "EvaluationConfigError",
    "qualifiedName": "arclm.exceptions.EvaluationConfigError",
    "importPath": "arclm.exceptions.EvaluationConfigError",
    "canonicalImport": "from arclm.exceptions import EvaluationConfigError",
    "alternativeImport": "",
    "kind": "exception",
    "category": "errors",
    "status": "Stable",
    "signature": "EvaluationConfigError(...)",
    "summary": "Raised for invalid evaluation configuration.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.exceptions import EvaluationConfigError\n\ntry:\n    raise EvaluationConfigError(\"example\")\nexcept EvaluationConfigError as exc:\n    print(type(exc).__name__)",
    "members": []
  },
  {
    "name": "EvaluationError",
    "qualifiedName": "arclm.exceptions.EvaluationError",
    "importPath": "arclm.exceptions.EvaluationError",
    "canonicalImport": "from arclm.exceptions import EvaluationError",
    "alternativeImport": "",
    "kind": "exception",
    "category": "errors",
    "status": "Stable",
    "signature": "EvaluationError(...)",
    "summary": "Raised for evaluation errors.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.exceptions import EvaluationError\n\ntry:\n    raise EvaluationError(\"example\")\nexcept EvaluationError as exc:\n    print(type(exc).__name__)",
    "members": []
  },
  {
    "name": "FineTuningError",
    "qualifiedName": "arclm.exceptions.FineTuningError",
    "importPath": "arclm.exceptions.FineTuningError",
    "canonicalImport": "from arclm.exceptions import FineTuningError",
    "alternativeImport": "",
    "kind": "exception",
    "category": "errors",
    "status": "Stable",
    "signature": "FineTuningError(...)",
    "summary": "Raised for fine-tuning errors.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.exceptions import FineTuningError\n\ntry:\n    raise FineTuningError(\"example\")\nexcept FineTuningError as exc:\n    print(type(exc).__name__)",
    "members": []
  },
  {
    "name": "FormattingError",
    "qualifiedName": "arclm.exceptions.FormattingError",
    "importPath": "arclm.exceptions.FormattingError",
    "canonicalImport": "from arclm.exceptions import FormattingError",
    "alternativeImport": "",
    "kind": "exception",
    "category": "errors",
    "status": "Stable",
    "signature": "FormattingError(...)",
    "summary": "Raised when an SFT example cannot be formatted.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.exceptions import FormattingError\n\ntry:\n    raise FormattingError(\"example\")\nexcept FormattingError as exc:\n    print(type(exc).__name__)",
    "members": []
  },
  {
    "name": "InferenceError",
    "qualifiedName": "arclm.exceptions.InferenceError",
    "importPath": "arclm.exceptions.InferenceError",
    "canonicalImport": "from arclm.exceptions import InferenceError",
    "alternativeImport": "",
    "kind": "exception",
    "category": "errors",
    "status": "Stable",
    "signature": "InferenceError(...)",
    "summary": "Raised for inference errors.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.exceptions import InferenceError\n\ntry:\n    raise InferenceError(\"example\")\nexcept InferenceError as exc:\n    print(type(exc).__name__)",
    "members": []
  },
  {
    "name": "MetricError",
    "qualifiedName": "arclm.exceptions.MetricError",
    "importPath": "arclm.exceptions.MetricError",
    "canonicalImport": "from arclm.exceptions import MetricError",
    "alternativeImport": "",
    "kind": "exception",
    "category": "errors",
    "status": "Stable",
    "signature": "MetricError(...)",
    "summary": "Raised when a metric cannot be computed.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.exceptions import MetricError\n\ntry:\n    raise MetricError(\"example\")\nexcept MetricError as exc:\n    print(type(exc).__name__)",
    "members": []
  },
  {
    "name": "ModelAdapterError",
    "qualifiedName": "arclm.exceptions.ModelAdapterError",
    "importPath": "arclm.exceptions.ModelAdapterError",
    "canonicalImport": "from arclm.exceptions import ModelAdapterError",
    "alternativeImport": "",
    "kind": "exception",
    "category": "errors",
    "status": "Stable",
    "signature": "ModelAdapterError(...)",
    "summary": "Raised when a model adapter cannot call or read a model.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.exceptions import ModelAdapterError\n\ntry:\n    raise ModelAdapterError(\"example\")\nexcept ModelAdapterError as exc:\n    print(type(exc).__name__)",
    "members": []
  },
  {
    "name": "ModelLoadError",
    "qualifiedName": "arclm.exceptions.ModelLoadError",
    "importPath": "arclm.exceptions.ModelLoadError",
    "canonicalImport": "from arclm.exceptions import ModelLoadError",
    "alternativeImport": "",
    "kind": "exception",
    "category": "errors",
    "status": "Stable",
    "signature": "ModelLoadError(...)",
    "summary": "Raised when model loading fails.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.exceptions import ModelLoadError\n\ntry:\n    raise ModelLoadError(\"example\")\nexcept ModelLoadError as exc:\n    print(type(exc).__name__)",
    "members": []
  },
  {
    "name": "OptionalDependencyError",
    "qualifiedName": "arclm.exceptions.OptionalDependencyError",
    "importPath": "arclm.exceptions.OptionalDependencyError",
    "canonicalImport": "from arclm.exceptions import OptionalDependencyError",
    "alternativeImport": "",
    "kind": "exception",
    "category": "errors",
    "status": "Stable",
    "signature": "OptionalDependencyError(...)",
    "summary": "Raised when an optional dependency is required but not installed.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.exceptions import OptionalDependencyError\n\ntry:\n    raise OptionalDependencyError(\"example\")\nexcept OptionalDependencyError as exc:\n    print(type(exc).__name__)",
    "members": []
  },
  {
    "name": "PipelineError",
    "qualifiedName": "arclm.exceptions.PipelineError",
    "importPath": "arclm.exceptions.PipelineError",
    "canonicalImport": "from arclm.exceptions import PipelineError",
    "alternativeImport": "",
    "kind": "exception",
    "category": "errors",
    "status": "Stable",
    "signature": "PipelineError(...)",
    "summary": "Raised when a data pipeline step fails.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.exceptions import PipelineError\n\ntry:\n    raise PipelineError(\"example\")\nexcept PipelineError as exc:\n    print(type(exc).__name__)",
    "members": []
  },
  {
    "name": "PrecisionError",
    "qualifiedName": "arclm.exceptions.PrecisionError",
    "importPath": "arclm.exceptions.PrecisionError",
    "canonicalImport": "from arclm.exceptions import PrecisionError",
    "alternativeImport": "",
    "kind": "exception",
    "category": "errors",
    "status": "Stable",
    "signature": "PrecisionError(...)",
    "summary": "Raised when requested training precision is not supported.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.exceptions import PrecisionError\n\ntry:\n    raise PrecisionError(\"example\")\nexcept PrecisionError as exc:\n    print(type(exc).__name__)",
    "members": []
  },
  {
    "name": "SFTConfigError",
    "qualifiedName": "arclm.exceptions.SFTConfigError",
    "importPath": "arclm.exceptions.SFTConfigError",
    "canonicalImport": "from arclm.exceptions import SFTConfigError",
    "alternativeImport": "",
    "kind": "exception",
    "category": "errors",
    "status": "Stable",
    "signature": "SFTConfigError(...)",
    "summary": "Raised for invalid SFT configuration.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.exceptions import SFTConfigError\n\ntry:\n    raise SFTConfigError(\"example\")\nexcept SFTConfigError as exc:\n    print(type(exc).__name__)",
    "members": []
  },
  {
    "name": "StreamingError",
    "qualifiedName": "arclm.exceptions.StreamingError",
    "importPath": "arclm.exceptions.StreamingError",
    "canonicalImport": "from arclm.exceptions import StreamingError",
    "alternativeImport": "",
    "kind": "exception",
    "category": "errors",
    "status": "Stable",
    "signature": "StreamingError(...)",
    "summary": "Raised when a streaming dataset cannot be read.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.exceptions import StreamingError\n\ntry:\n    raise StreamingError(\"example\")\nexcept StreamingError as exc:\n    print(type(exc).__name__)",
    "members": []
  },
  {
    "name": "SyntheticDataError",
    "qualifiedName": "arclm.exceptions.SyntheticDataError",
    "importPath": "arclm.exceptions.SyntheticDataError",
    "canonicalImport": "from arclm.exceptions import SyntheticDataError",
    "alternativeImport": "",
    "kind": "exception",
    "category": "errors",
    "status": "Stable",
    "signature": "SyntheticDataError(...)",
    "summary": "Raised when synthetic data generation fails.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.exceptions import SyntheticDataError\n\ntry:\n    raise SyntheticDataError(\"example\")\nexcept SyntheticDataError as exc:\n    print(type(exc).__name__)",
    "members": []
  },
  {
    "name": "TokenizerAdapterError",
    "qualifiedName": "arclm.exceptions.TokenizerAdapterError",
    "importPath": "arclm.exceptions.TokenizerAdapterError",
    "canonicalImport": "from arclm.exceptions import TokenizerAdapterError",
    "alternativeImport": "",
    "kind": "exception",
    "category": "errors",
    "status": "Stable",
    "signature": "TokenizerAdapterError(...)",
    "summary": "Raised when a tokenizer adapter cannot encode data.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.exceptions import TokenizerAdapterError\n\ntry:\n    raise TokenizerAdapterError(\"example\")\nexcept TokenizerAdapterError as exc:\n    print(type(exc).__name__)",
    "members": []
  },
  {
    "name": "TokenizerError",
    "qualifiedName": "arclm.exceptions.TokenizerError",
    "importPath": "arclm.exceptions.TokenizerError",
    "canonicalImport": "from arclm.exceptions import TokenizerError",
    "alternativeImport": "",
    "kind": "exception",
    "category": "errors",
    "status": "Stable",
    "signature": "TokenizerError(...)",
    "summary": "Raised for tokenizer errors.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.exceptions import TokenizerError\n\ntry:\n    raise TokenizerError(\"example\")\nexcept TokenizerError as exc:\n    print(type(exc).__name__)",
    "members": []
  },
  {
    "name": "TrainingConfigError",
    "qualifiedName": "arclm.exceptions.TrainingConfigError",
    "importPath": "arclm.exceptions.TrainingConfigError",
    "canonicalImport": "from arclm.exceptions import TrainingConfigError",
    "alternativeImport": "",
    "kind": "exception",
    "category": "errors",
    "status": "Stable",
    "signature": "TrainingConfigError(...)",
    "summary": "Raised for invalid training configuration.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.exceptions import TrainingConfigError\n\ntry:\n    raise TrainingConfigError(\"example\")\nexcept TrainingConfigError as exc:\n    print(type(exc).__name__)",
    "members": []
  },
  {
    "name": "TrainingError",
    "qualifiedName": "arclm.exceptions.TrainingError",
    "importPath": "arclm.exceptions.TrainingError",
    "canonicalImport": "from arclm.exceptions import TrainingError",
    "alternativeImport": "",
    "kind": "exception",
    "category": "errors",
    "status": "Stable",
    "signature": "TrainingError(...)",
    "summary": "Raised for training errors.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.exceptions import TrainingError\n\ntry:\n    raise TrainingError(\"example\")\nexcept TrainingError as exc:\n    print(type(exc).__name__)",
    "members": []
  },
  {
    "name": "Accuracy",
    "qualifiedName": "arclm.evaluation.Accuracy",
    "importPath": "arclm.evaluation.Accuracy",
    "canonicalImport": "from arclm.evaluation import Accuracy",
    "alternativeImport": "from arclm import Accuracy",
    "kind": "class",
    "category": "evaluation",
    "status": "Stable",
    "signature": "Accuracy(ignore_index: 'int' = -100) -> 'None'",
    "summary": "Berekent accuracy voor classificatie of token logits.",
    "parameters": [
      [
        "ignore_index",
        "int",
        "-100"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.evaluation import Accuracy\n\nprint(Accuracy)",
    "members": [
      [
        "compute(self)",
        "Geeft accuracy tussen 0 en 1 terug."
      ],
      [
        "reset(self) -> 'None'",
        "Maakt de tellingen leeg."
      ],
      [
        "update(self, predictions=None, targets=None, loss=None, outputs=None, batch=None) -> 'None'",
        "Voegt voorspellingen en targets van \u00e9\u00e9n batch toe."
      ]
    ]
  },
  {
    "name": "BaseEvaluationCallback",
    "qualifiedName": "arclm.evaluation.BaseEvaluationCallback",
    "importPath": "arclm.evaluation.BaseEvaluationCallback",
    "canonicalImport": "from arclm.evaluation import BaseEvaluationCallback",
    "alternativeImport": "from arclm import BaseEvaluationCallback",
    "kind": "class",
    "category": "evaluation",
    "status": "Stable",
    "signature": "BaseEvaluationCallback()",
    "summary": "Basis class voor eigen evaluation callbacks.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.evaluation import BaseEvaluationCallback\n\nprint(BaseEvaluationCallback)",
    "members": [
      [
        "on_batch_end(self, evaluator, batch_index: 'int', metrics: 'dict') -> 'None'",
        "Wordt uitgevoerd nadat \u00e9\u00e9n batch is verwerkt."
      ],
      [
        "on_evaluate_end(self, evaluator, result) -> 'None'",
        "Wordt uitgevoerd nadat de evaluatie klaar is."
      ],
      [
        "on_evaluate_start(self, evaluator) -> 'None'",
        "Wordt uitgevoerd voordat de evaluatie begint."
      ]
    ]
  },
  {
    "name": "BaseEvaluator",
    "qualifiedName": "arclm.evaluation.BaseEvaluator",
    "importPath": "arclm.evaluation.BaseEvaluator",
    "canonicalImport": "from arclm.evaluation import BaseEvaluator",
    "alternativeImport": "from arclm import BaseEvaluator",
    "kind": "class",
    "category": "evaluation",
    "status": "Stable",
    "signature": "BaseEvaluator()",
    "summary": "Basis class voor eigen evaluators.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.evaluation import BaseEvaluator\n\nprint(BaseEvaluator)",
    "members": [
      [
        "evaluate(self, dataset=None)",
        "Voert evaluatie uit en geeft de resultaten terug."
      ]
    ]
  },
  {
    "name": "BaseMetric",
    "qualifiedName": "arclm.evaluation.BaseMetric",
    "importPath": "arclm.evaluation.BaseMetric",
    "canonicalImport": "from arclm.evaluation import BaseMetric",
    "alternativeImport": "from arclm import BaseMetric",
    "kind": "class",
    "category": "evaluation",
    "status": "Stable",
    "signature": "BaseMetric()",
    "summary": "Basis class voor developers die een eigen metric willen maken.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.evaluation import BaseMetric\n\nprint(BaseMetric)",
    "members": [
      [
        "compute(self)",
        "Berekent de uiteindelijke waarde van de metric."
      ],
      [
        "reset(self) -> 'None'",
        "Maakt de opgeslagen metricwaarden leeg."
      ],
      [
        "update(self, predictions=None, targets=None, loss=None, outputs=None) -> 'None'",
        "Voegt de resultaten van \u00e9\u00e9n batch toe."
      ]
    ]
  },
  {
    "name": "ConceptBenchmarkCase",
    "qualifiedName": "arclm.evaluation.ConceptBenchmarkCase",
    "importPath": "arclm.evaluation.ConceptBenchmarkCase",
    "canonicalImport": "from arclm.evaluation import ConceptBenchmarkCase",
    "alternativeImport": "from arclm import ConceptBenchmarkCase",
    "kind": "class",
    "category": "evaluation",
    "status": "Stable",
    "signature": "ConceptBenchmarkCase(prompt: str, expected_concepts: list) -> None",
    "summary": "Expected concept relationships for a prompt.",
    "parameters": [
      [
        "prompt",
        "str",
        "required"
      ],
      [
        "expected_concepts",
        "list",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.evaluation import ConceptBenchmarkCase\n\nprint(ConceptBenchmarkCase)",
    "members": []
  },
  {
    "name": "ConceptBenchmarkResult",
    "qualifiedName": "arclm.evaluation.ConceptBenchmarkResult",
    "importPath": "arclm.evaluation.ConceptBenchmarkResult",
    "canonicalImport": "from arclm.evaluation import ConceptBenchmarkResult",
    "alternativeImport": "from arclm import ConceptBenchmarkResult",
    "kind": "class",
    "category": "evaluation",
    "status": "Stable",
    "signature": "ConceptBenchmarkResult(prompt: str, expected_concepts: list, predicted_tokens: list, matched_concepts: list, score: float) -> None",
    "summary": "Concept benchmark score for one prompt.",
    "parameters": [
      [
        "prompt",
        "str",
        "required"
      ],
      [
        "expected_concepts",
        "list",
        "required"
      ],
      [
        "predicted_tokens",
        "list",
        "required"
      ],
      [
        "matched_concepts",
        "list",
        "required"
      ],
      [
        "score",
        "float",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.evaluation import ConceptBenchmarkResult\n\nprint(ConceptBenchmarkResult)",
    "members": []
  },
  {
    "name": "EvaluationConfig",
    "qualifiedName": "arclm.evaluation.EvaluationConfig",
    "importPath": "arclm.evaluation.EvaluationConfig",
    "canonicalImport": "from arclm.evaluation import EvaluationConfig",
    "alternativeImport": "from arclm import EvaluationConfig",
    "kind": "class",
    "category": "evaluation",
    "status": "Stable",
    "signature": "EvaluationConfig(batch_size: 'int' = 8, device: 'str' = 'cpu', max_batches: 'int | None' = None, ignore_index: 'int' = -100, return_predictions: 'bool' = False, prediction_key: 'str' = 'logits', label_key: 'str' = 'labels') -> None",
    "summary": "Bewaart instellingen voor een evaluatierun.",
    "parameters": [
      [
        "batch_size",
        "int",
        "8"
      ],
      [
        "device",
        "str",
        "'cpu'"
      ],
      [
        "max_batches",
        "int | None",
        "None"
      ],
      [
        "ignore_index",
        "int",
        "-100"
      ],
      [
        "return_predictions",
        "bool",
        "False"
      ],
      [
        "prediction_key",
        "str",
        "'logits'"
      ],
      [
        "label_key",
        "str",
        "'labels'"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.evaluation import EvaluationConfig\n\nprint(EvaluationConfig)",
    "members": [
      [
        "to_dict(self) -> 'dict[str, Any]'",
        "Zet de config om naar een gewone dict."
      ],
      [
        "validate(self) -> 'None'",
        "Controleert of de config bruikbaar is."
      ]
    ]
  },
  {
    "name": "EvaluationReport",
    "qualifiedName": "arclm.evaluation.EvaluationReport",
    "importPath": "arclm.evaluation.EvaluationReport",
    "canonicalImport": "from arclm.evaluation import EvaluationReport",
    "alternativeImport": "from arclm import EvaluationReport",
    "kind": "class",
    "category": "evaluation",
    "status": "Stable",
    "signature": "EvaluationReport(metrics: 'dict[str, float | int | str | None]', num_examples: 'int', num_batches: 'int', num_tokens: 'int | None', model_identity: 'str | None', checkpoint_identity: 'str | None', dataset_identity: 'str | None', evaluation_timestamp: 'float', device: 'str | None', dtype: 'str | None', warnings: 'tuple[str, ...]' = ()) -> None",
    "summary": "Structured, JSON-safe summary of an evaluation run.",
    "parameters": [
      [
        "metrics",
        "dict[str, float | int | str | None]",
        "required"
      ],
      [
        "num_examples",
        "int",
        "required"
      ],
      [
        "num_batches",
        "int",
        "required"
      ],
      [
        "num_tokens",
        "int | None",
        "required"
      ],
      [
        "model_identity",
        "str | None",
        "required"
      ],
      [
        "checkpoint_identity",
        "str | None",
        "required"
      ],
      [
        "dataset_identity",
        "str | None",
        "required"
      ],
      [
        "evaluation_timestamp",
        "float",
        "required"
      ],
      [
        "device",
        "str | None",
        "required"
      ],
      [
        "dtype",
        "str | None",
        "required"
      ],
      [
        "warnings",
        "tuple[str, ...]",
        "()"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.evaluation import EvaluationReport\n\nprint(EvaluationReport)",
    "members": [
      [
        "summary(self) -> 'str'",
        "Return a short human-readable evaluation summary."
      ],
      [
        "to_dict(self) -> 'dict[str, Any]'",
        "Return JSON-safe report data."
      ],
      [
        "to_json(self) -> 'str'",
        "Serialize the report."
      ]
    ]
  },
  {
    "name": "EvaluationResult",
    "qualifiedName": "arclm.evaluation.EvaluationResult",
    "importPath": "arclm.evaluation.EvaluationResult",
    "canonicalImport": "from arclm.evaluation import EvaluationResult",
    "alternativeImport": "from arclm import EvaluationResult",
    "kind": "class",
    "category": "evaluation",
    "status": "Stable",
    "signature": "EvaluationResult(metrics: 'dict[str, float | None]', num_examples: 'int', num_batches: 'int', predictions: 'list[Any] | None' = None, labels: 'list[Any] | None' = None, metadata: 'dict[str, Any]' = <factory>) -> None",
    "summary": "Bewaart de uitkomst van een evaluatierun.",
    "parameters": [
      [
        "metrics",
        "dict[str, float | None]",
        "required"
      ],
      [
        "num_examples",
        "int",
        "required"
      ],
      [
        "num_batches",
        "int",
        "required"
      ],
      [
        "predictions",
        "list[Any] | None",
        "None"
      ],
      [
        "labels",
        "list[Any] | None",
        "None"
      ],
      [
        "metadata",
        "dict[str, Any]",
        "<factory>"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.evaluation import EvaluationResult\n\nprint(EvaluationResult)",
    "members": [
      [
        "to_dict(self) -> 'dict[str, Any]'",
        "Zet het resultaat om naar een gewone dict."
      ]
    ]
  },
  {
    "name": "Evaluator",
    "qualifiedName": "arclm.evaluation.Evaluator",
    "importPath": "arclm.evaluation.Evaluator",
    "canonicalImport": "from arclm.evaluation import Evaluator",
    "alternativeImport": "from arclm import Evaluator",
    "kind": "class",
    "category": "evaluation",
    "status": "Stable",
    "signature": "Evaluator(model, dataset=None, metrics: 'list[BaseMetric] | None' = None, config: 'EvaluationConfig | None' = None, dataloader=None, callbacks: 'list[BaseEvaluationCallback] | None' = None, collate_fn=None, loss_fn=None)",
    "summary": "Voert evaluatie uit op een model en dataset.",
    "parameters": [
      [
        "model",
        "Any",
        "required"
      ],
      [
        "dataset",
        "Any",
        "None"
      ],
      [
        "metrics",
        "list[BaseMetric] | None",
        "None"
      ],
      [
        "config",
        "EvaluationConfig | None",
        "None"
      ],
      [
        "dataloader",
        "Any",
        "None"
      ],
      [
        "callbacks",
        "list[BaseEvaluationCallback] | None",
        "None"
      ],
      [
        "collate_fn",
        "Any",
        "None"
      ],
      [
        "loss_fn",
        "Any",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.evaluation import Evaluator\n\nprint(Evaluator)",
    "members": [
      [
        "count_examples(self, targets, batch=None) -> 'int'",
        "Telt het aantal voorbeelden in een batch."
      ],
      [
        "evaluate(self, dataset=None)",
        "Voert de evaluatie uit en geeft de resultaten terug."
      ],
      [
        "forward(self, batch)",
        "Voert de forward pass uit."
      ],
      [
        "get_loss(self, outputs, batch)",
        "Leest loss uit outputs of berekent die met `loss_fn`."
      ],
      [
        "get_predictions(self, outputs)",
        "Leest logits of predictions uit model outputs."
      ],
      [
        "get_targets(self, batch)",
        "Leest labels of targets uit een batch."
      ],
      [
        "prepare_batch(self, batch)",
        "Zet tensors in een batch op het evaluatie-apparaat."
      ],
      [
        "update_metric(self, metric, predictions, targets, loss, outputs, batch) -> 'None'",
        "Werkt een metric bij met alleen de argumenten die hij accepteert."
      ]
    ]
  },
  {
    "name": "LongContextResult",
    "qualifiedName": "arclm.evaluation.LongContextResult",
    "importPath": "arclm.evaluation.LongContextResult",
    "canonicalImport": "from arclm.evaluation import LongContextResult",
    "alternativeImport": "from arclm import LongContextResult",
    "kind": "class",
    "category": "evaluation",
    "status": "Stable",
    "signature": "LongContextResult(block_size: int, validation_loss: float, concept_score: float, generated_sample: str) -> None",
    "summary": "Summary for one long-context training/evaluation run.",
    "parameters": [
      [
        "block_size",
        "int",
        "required"
      ],
      [
        "validation_loss",
        "float",
        "required"
      ],
      [
        "concept_score",
        "float",
        "required"
      ],
      [
        "generated_sample",
        "str",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.evaluation import LongContextResult\n\nprint(LongContextResult)",
    "members": []
  },
  {
    "name": "LossMetric",
    "qualifiedName": "arclm.evaluation.LossMetric",
    "importPath": "arclm.evaluation.LossMetric",
    "canonicalImport": "from arclm.evaluation import LossMetric",
    "alternativeImport": "from arclm import LossMetric",
    "kind": "class",
    "category": "evaluation",
    "status": "Stable",
    "signature": "LossMetric() -> 'None'",
    "summary": "Berekent gemiddelde loss per batch.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.evaluation import LossMetric\n\nprint(LossMetric)",
    "members": [
      [
        "compute(self)",
        "Geeft de gemiddelde batch loss terug."
      ],
      [
        "reset(self) -> 'None'",
        "Maakt de opgeslagen loss leeg."
      ],
      [
        "update(self, predictions=None, targets=None, loss=None, outputs=None, batch=None) -> 'None'",
        "Voegt loss van \u00e9\u00e9n batch toe."
      ]
    ]
  },
  {
    "name": "MetricsReport",
    "qualifiedName": "arclm.evaluation.MetricsReport",
    "importPath": "arclm.evaluation.MetricsReport",
    "canonicalImport": "from arclm.evaluation import MetricsReport",
    "alternativeImport": "from arclm import MetricsReport",
    "kind": "class",
    "category": "evaluation",
    "status": "Stable",
    "signature": "MetricsReport(perplexity: float, avg_loss: float, total_tokens: int, correct_predictions: int, accuracy: float, timestamp: str = '') -> None",
    "summary": "Comprehensive metrics report for model evaluation.",
    "parameters": [
      [
        "perplexity",
        "float",
        "required"
      ],
      [
        "avg_loss",
        "float",
        "required"
      ],
      [
        "total_tokens",
        "int",
        "required"
      ],
      [
        "correct_predictions",
        "int",
        "required"
      ],
      [
        "accuracy",
        "float",
        "required"
      ],
      [
        "timestamp",
        "str",
        "''"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.evaluation import MetricsReport\n\nprint(MetricsReport)",
    "members": [
      [
        "to_dict(self)",
        "Convert to dictionary for JSON serialization."
      ]
    ]
  },
  {
    "name": "Perplexity",
    "qualifiedName": "arclm.evaluation.Perplexity",
    "importPath": "arclm.evaluation.Perplexity",
    "canonicalImport": "from arclm.evaluation import Perplexity",
    "alternativeImport": "from arclm import Perplexity",
    "kind": "class",
    "category": "evaluation",
    "status": "Stable",
    "signature": "Perplexity(max_loss: 'float' = 20.0) -> 'None'",
    "summary": "Berekent perplexity uit gemiddelde loss.",
    "parameters": [
      [
        "max_loss",
        "float",
        "20.0"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.evaluation import Perplexity\n\nprint(Perplexity)",
    "members": [
      [
        "compute(self)",
        "Geeft `exp(loss)` terug als de loss bruikbaar is."
      ],
      [
        "reset(self) -> 'None'",
        "Maakt de opgeslagen loss leeg."
      ],
      [
        "update(self, predictions=None, targets=None, loss=None, outputs=None, batch=None) -> 'None'",
        "Voegt de batch loss toe."
      ]
    ]
  },
  {
    "name": "TopKPrediction",
    "qualifiedName": "arclm.evaluation.TopKPrediction",
    "importPath": "arclm.evaluation.TopKPrediction",
    "canonicalImport": "from arclm.evaluation import TopKPrediction",
    "alternativeImport": "from arclm import TopKPrediction",
    "kind": "class",
    "category": "evaluation",
    "status": "Stable",
    "signature": "TopKPrediction(rank: int, token: str, probability: float) -> None",
    "summary": "One next-token prediction.",
    "parameters": [
      [
        "rank",
        "int",
        "required"
      ],
      [
        "token",
        "str",
        "required"
      ],
      [
        "probability",
        "float",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.evaluation import TopKPrediction\n\nprint(TopKPrediction)",
    "members": []
  },
  {
    "name": "DEFAULT_CONCEPT_BENCHMARKS",
    "qualifiedName": "arclm.evaluation.DEFAULT_CONCEPT_BENCHMARKS",
    "importPath": "arclm.evaluation.DEFAULT_CONCEPT_BENCHMARKS",
    "canonicalImport": "from arclm.evaluation import DEFAULT_CONCEPT_BENCHMARKS",
    "alternativeImport": "from arclm import DEFAULT_CONCEPT_BENCHMARKS",
    "kind": "constant",
    "category": "evaluation",
    "status": "Stable",
    "signature": "DEFAULT_CONCEPT_BENCHMARKS",
    "summary": "Built-in mutable sequence.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.evaluation import DEFAULT_CONCEPT_BENCHMARKS\n\nprint(DEFAULT_CONCEPT_BENCHMARKS)",
    "members": []
  },
  {
    "name": "build_evaluation_report",
    "qualifiedName": "arclm.evaluation.build_evaluation_report",
    "importPath": "arclm.evaluation.build_evaluation_report",
    "canonicalImport": "from arclm.evaluation import build_evaluation_report",
    "alternativeImport": "from arclm import build_evaluation_report",
    "kind": "function",
    "category": "evaluation",
    "status": "Stable",
    "signature": "build_evaluation_report(result: 'EvaluationResult', *, model: 'Any | None' = None, checkpoint_identity: 'str | None' = None, dataset_identity: 'str | None' = None, num_tokens: 'int | None' = None, warnings: 'list[str] | tuple[str, ...]' = ()) -> 'EvaluationReport'",
    "summary": "Build a report from canonical evaluator metrics without recalculation.",
    "parameters": [
      [
        "result",
        "EvaluationResult",
        "required"
      ],
      [
        "model",
        "Any | None",
        "None"
      ],
      [
        "checkpoint_identity",
        "str | None",
        "None"
      ],
      [
        "dataset_identity",
        "str | None",
        "None"
      ],
      [
        "num_tokens",
        "int | None",
        "None"
      ],
      [
        "warnings",
        "list[str] | tuple[str, ...]",
        "()"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.evaluation import build_evaluation_report\n\nprint(build_evaluation_report)",
    "members": []
  },
  {
    "name": "build_training_diagnostics_report",
    "qualifiedName": "arclm.evaluation.build_training_diagnostics_report",
    "importPath": "arclm.evaluation.build_training_diagnostics_report",
    "canonicalImport": "from arclm.evaluation import build_training_diagnostics_report",
    "alternativeImport": "from arclm import build_training_diagnostics_report",
    "kind": "function",
    "category": "evaluation",
    "status": "Stable",
    "signature": "build_training_diagnostics_report(model, data, config)",
    "summary": "Build tokenizer, top-k, and concept benchmark diagnostics for a run.",
    "parameters": [
      [
        "model",
        "Any",
        "required"
      ],
      [
        "data",
        "Any",
        "required"
      ],
      [
        "config",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.evaluation import build_training_diagnostics_report\n\nprint(build_training_diagnostics_report)",
    "members": []
  },
  {
    "name": "calculate_metrics",
    "qualifiedName": "arclm.evaluation.calculate_metrics",
    "importPath": "arclm.evaluation.calculate_metrics",
    "canonicalImport": "from arclm.evaluation import calculate_metrics",
    "alternativeImport": "from arclm import calculate_metrics",
    "kind": "function",
    "category": "evaluation",
    "status": "Stable",
    "signature": "calculate_metrics(model, val_loader, config, device='cpu')",
    "summary": "Calculate comprehensive evaluation metrics.",
    "parameters": [
      [
        "model",
        "Any",
        "required"
      ],
      [
        "val_loader",
        "Any",
        "required"
      ],
      [
        "config",
        "Any",
        "required"
      ],
      [
        "device",
        "Any",
        "'cpu'"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.evaluation import calculate_metrics\n\nprint(calculate_metrics)",
    "members": []
  },
  {
    "name": "calculate_perplexity",
    "qualifiedName": "arclm.evaluation.calculate_perplexity",
    "importPath": "arclm.evaluation.calculate_perplexity",
    "canonicalImport": "from arclm.evaluation import calculate_perplexity",
    "alternativeImport": "from arclm import calculate_perplexity",
    "kind": "function",
    "category": "evaluation",
    "status": "Stable",
    "signature": "calculate_perplexity(loss: 'float') -> 'float'",
    "summary": "Return perplexity for a cross-entropy loss value.",
    "parameters": [
      [
        "loss",
        "float",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.evaluation import calculate_perplexity\n\nprint(calculate_perplexity)",
    "members": []
  },
  {
    "name": "evaluate",
    "qualifiedName": "arclm.evaluation.evaluate",
    "importPath": "arclm.evaluation.evaluate",
    "canonicalImport": "from arclm.evaluation import evaluate",
    "alternativeImport": "from arclm import evaluate",
    "kind": "function",
    "category": "evaluation",
    "status": "Stable",
    "signature": "evaluate(model, dataset=None, metrics=None, config=None, **kwargs)",
    "summary": "Voert evaluatie uit met de standaard `Evaluator`.",
    "parameters": [
      [
        "model",
        "Any",
        "required"
      ],
      [
        "dataset",
        "Any",
        "None"
      ],
      [
        "metrics",
        "Any",
        "None"
      ],
      [
        "config",
        "Any",
        "None"
      ],
      [
        "kwargs",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.evaluation import evaluate\n\nprint(evaluate)",
    "members": []
  },
  {
    "name": "export_metrics_to_json",
    "qualifiedName": "arclm.evaluation.export_metrics_to_json",
    "importPath": "arclm.evaluation.export_metrics_to_json",
    "canonicalImport": "from arclm.evaluation import export_metrics_to_json",
    "alternativeImport": "from arclm import export_metrics_to_json",
    "kind": "function",
    "category": "evaluation",
    "status": "Stable",
    "signature": "export_metrics_to_json(metrics_report, filepath)",
    "summary": "Export metrics report to JSON file.",
    "parameters": [
      [
        "metrics_report",
        "Any",
        "required"
      ],
      [
        "filepath",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.evaluation import export_metrics_to_json\n\nprint(export_metrics_to_json)",
    "members": []
  },
  {
    "name": "export_metrics_to_markdown",
    "qualifiedName": "arclm.evaluation.export_metrics_to_markdown",
    "importPath": "arclm.evaluation.export_metrics_to_markdown",
    "canonicalImport": "from arclm.evaluation import export_metrics_to_markdown",
    "alternativeImport": "from arclm import export_metrics_to_markdown",
    "kind": "function",
    "category": "evaluation",
    "status": "Stable",
    "signature": "export_metrics_to_markdown(metrics_report, filepath)",
    "summary": "Export metrics report to Markdown file.",
    "parameters": [
      [
        "metrics_report",
        "Any",
        "required"
      ],
      [
        "filepath",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.evaluation import export_metrics_to_markdown\n\nprint(export_metrics_to_markdown)",
    "members": []
  },
  {
    "name": "format_concept_benchmark_report",
    "qualifiedName": "arclm.evaluation.format_concept_benchmark_report",
    "importPath": "arclm.evaluation.format_concept_benchmark_report",
    "canonicalImport": "from arclm.evaluation import format_concept_benchmark_report",
    "alternativeImport": "from arclm import format_concept_benchmark_report",
    "kind": "function",
    "category": "evaluation",
    "status": "Stable",
    "signature": "format_concept_benchmark_report(report)",
    "summary": "Create a readable concept benchmark report.",
    "parameters": [
      [
        "report",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.evaluation import format_concept_benchmark_report\n\nprint(format_concept_benchmark_report)",
    "members": []
  },
  {
    "name": "format_long_context_results",
    "qualifiedName": "arclm.evaluation.format_long_context_results",
    "importPath": "arclm.evaluation.format_long_context_results",
    "canonicalImport": "from arclm.evaluation import format_long_context_results",
    "alternativeImport": "from arclm import format_long_context_results",
    "kind": "function",
    "category": "evaluation",
    "status": "Stable",
    "signature": "format_long_context_results(results)",
    "summary": "Create a readable long-context comparison report.",
    "parameters": [
      [
        "results",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.evaluation import format_long_context_results\n\nprint(format_long_context_results)",
    "members": []
  },
  {
    "name": "format_tokenizer_coverage_report",
    "qualifiedName": "arclm.evaluation.format_tokenizer_coverage_report",
    "importPath": "arclm.evaluation.format_tokenizer_coverage_report",
    "canonicalImport": "from arclm.evaluation import format_tokenizer_coverage_report",
    "alternativeImport": "from arclm import format_tokenizer_coverage_report",
    "kind": "function",
    "category": "evaluation",
    "status": "Stable",
    "signature": "format_tokenizer_coverage_report(coverage)",
    "summary": "Create a readable tokenizer coverage report.",
    "parameters": [
      [
        "coverage",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.evaluation import format_tokenizer_coverage_report\n\nprint(format_tokenizer_coverage_report)",
    "members": []
  },
  {
    "name": "format_top_k_predictions",
    "qualifiedName": "arclm.evaluation.format_top_k_predictions",
    "importPath": "arclm.evaluation.format_top_k_predictions",
    "canonicalImport": "from arclm.evaluation import format_top_k_predictions",
    "alternativeImport": "from arclm import format_top_k_predictions",
    "kind": "function",
    "category": "evaluation",
    "status": "Stable",
    "signature": "format_top_k_predictions(prompt, predictions)",
    "summary": "Create a readable diagnostic report for one prompt.",
    "parameters": [
      [
        "prompt",
        "Any",
        "required"
      ],
      [
        "predictions",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.evaluation import format_top_k_predictions\n\nprint(format_top_k_predictions)",
    "members": []
  },
  {
    "name": "predict_top_k",
    "qualifiedName": "arclm.evaluation.predict_top_k",
    "importPath": "arclm.evaluation.predict_top_k",
    "canonicalImport": "from arclm.evaluation import predict_top_k",
    "alternativeImport": "from arclm import predict_top_k",
    "kind": "function",
    "category": "evaluation",
    "status": "Stable",
    "signature": "predict_top_k(model, stoi, itos, block_size, device, prompt, k=5, tokenizer=None)",
    "summary": "Return the top-k next-token probabilities for a prompt.",
    "parameters": [
      [
        "model",
        "Any",
        "required"
      ],
      [
        "stoi",
        "Any",
        "required"
      ],
      [
        "itos",
        "Any",
        "required"
      ],
      [
        "block_size",
        "Any",
        "required"
      ],
      [
        "device",
        "Any",
        "required"
      ],
      [
        "prompt",
        "Any",
        "required"
      ],
      [
        "k",
        "Any",
        "5"
      ],
      [
        "tokenizer",
        "Any",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.evaluation import predict_top_k\n\nprint(predict_top_k)",
    "members": []
  },
  {
    "name": "run_long_context_evaluation",
    "qualifiedName": "arclm.evaluation.run_long_context_evaluation",
    "importPath": "arclm.evaluation.run_long_context_evaluation",
    "canonicalImport": "from arclm.evaluation import run_long_context_evaluation",
    "alternativeImport": "from arclm import run_long_context_evaluation",
    "kind": "function",
    "category": "evaluation",
    "status": "Stable",
    "signature": "run_long_context_evaluation(base_config, block_sizes=(32, 64, 128), benchmark_cases=None, sample_prompt='Programming is')",
    "summary": "Train and compare multiple block sizes by validation loss and concepts.",
    "parameters": [
      [
        "base_config",
        "Any",
        "required"
      ],
      [
        "block_sizes",
        "Any",
        "(32, 64, 128)"
      ],
      [
        "benchmark_cases",
        "Any",
        "None"
      ],
      [
        "sample_prompt",
        "Any",
        "'Programming is'"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.evaluation import run_long_context_evaluation\n\nprint(run_long_context_evaluation)",
    "members": []
  },
  {
    "name": "score_concept_relationships",
    "qualifiedName": "arclm.evaluation.score_concept_relationships",
    "importPath": "arclm.evaluation.score_concept_relationships",
    "canonicalImport": "from arclm.evaluation import score_concept_relationships",
    "alternativeImport": "from arclm import score_concept_relationships",
    "kind": "function",
    "category": "evaluation",
    "status": "Stable",
    "signature": "score_concept_relationships(model, stoi, itos, block_size, device, benchmark_cases=None, k=10, tokenizer=None)",
    "summary": "Score expected concepts against top-k next-token predictions.",
    "parameters": [
      [
        "model",
        "Any",
        "required"
      ],
      [
        "stoi",
        "Any",
        "required"
      ],
      [
        "itos",
        "Any",
        "required"
      ],
      [
        "block_size",
        "Any",
        "required"
      ],
      [
        "device",
        "Any",
        "required"
      ],
      [
        "benchmark_cases",
        "Any",
        "None"
      ],
      [
        "k",
        "Any",
        "10"
      ],
      [
        "tokenizer",
        "Any",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.evaluation import score_concept_relationships\n\nprint(score_concept_relationships)",
    "members": []
  },
  {
    "name": "BaseFineTuner",
    "qualifiedName": "arclm.finetuning.BaseFineTuner",
    "importPath": "arclm.finetuning.BaseFineTuner",
    "canonicalImport": "from arclm.finetuning import BaseFineTuner",
    "alternativeImport": "from arclm import BaseFineTuner",
    "kind": "class",
    "category": "finetuning",
    "status": "Beta",
    "signature": "BaseFineTuner()",
    "summary": "Basis class voor developers die een eigen fine-tuner willen maken.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional Hugging Face/PEFT for external paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.finetuning import BaseFineTuner\n\nprint(BaseFineTuner)",
    "members": [
      [
        "evaluate(self, dataset=None)",
        "Evalueert het model op een dataset."
      ],
      [
        "train(self, *args, **kwargs)",
        "Start de fine-tuning."
      ]
    ]
  },
  {
    "name": "BaseModelAdapter",
    "qualifiedName": "arclm.finetuning.BaseModelAdapter",
    "importPath": "arclm.finetuning.BaseModelAdapter",
    "canonicalImport": "from arclm.finetuning import BaseModelAdapter",
    "alternativeImport": "from arclm import BaseModelAdapter",
    "kind": "class",
    "category": "finetuning",
    "status": "Beta",
    "signature": "BaseModelAdapter()",
    "summary": "Basis class om een extern model met ArcLM te verbinden.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional Hugging Face/PEFT for external paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.finetuning import BaseModelAdapter\n\nprint(BaseModelAdapter)",
    "members": [
      [
        "forward(self, **batch)",
        "Voert het model uit en geeft loss en logits terug."
      ]
    ]
  },
  {
    "name": "BaseTokenizerAdapter",
    "qualifiedName": "arclm.finetuning.BaseTokenizerAdapter",
    "importPath": "arclm.finetuning.BaseTokenizerAdapter",
    "canonicalImport": "from arclm.finetuning import BaseTokenizerAdapter",
    "alternativeImport": "",
    "kind": "class",
    "category": "finetuning",
    "status": "Beta",
    "signature": "BaseTokenizerAdapter()",
    "summary": "Basis class om een tokenizer met ArcLM te verbinden.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional Hugging Face/PEFT for external paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.finetuning import BaseTokenizerAdapter\n\nprint(BaseTokenizerAdapter)",
    "members": [
      [
        "encode(self, text: 'str', max_length: 'int | None' = None, truncation: 'bool' = True)",
        "Zet tekst om naar token ids."
      ]
    ]
  },
  {
    "name": "FineTuningConfig",
    "qualifiedName": "arclm.finetuning.FineTuningConfig",
    "importPath": "arclm.finetuning.FineTuningConfig",
    "canonicalImport": "from arclm.finetuning import FineTuningConfig",
    "alternativeImport": "",
    "kind": "class",
    "category": "finetuning",
    "status": "Beta",
    "signature": "FineTuningConfig(mode: 'FineTuningMode | str' = <FineTuningMode.SFT: 'supervised_fine_tuning'>, formatter: 'str' = 'auto', max_sequence_length: 'int' = 1024, train_on_prompt: 'bool' = False, append_eos_token: 'bool' = True, end_behavior: 'str | None' = None, end_tag: 'str' = '<|end|>', truncation: 'bool' = True, padding: 'str' = 'longest', packing: 'bool' = False, ignore_index: 'int' = -100, label_strategy: 'str | None' = None, text_field: 'str' = 'text', prompt_field: 'str' = 'prompt', completion_field: 'str' = 'completion', instruction_field: 'str' = 'instruction', input_field: 'str' = 'input', response_field: 'str' = 'output', messages_field: 'str' = 'messages', strict_field_mapping: 'bool' = False, instruction_tag: 'str | None' = None, response_tag: 'str | None' = None, context_tag: 'str | None' = None, separator: 'str' = '\\n', register_tags_as_special_tokens: 'bool' = False, skip_invalid_records: 'bool' = False, max_report_errors: 'int' = 10, config_version: 'int' = 1) -> None",
    "summary": "Configuratie voor data, formatting en labels bij fine-tuning.",
    "parameters": [
      [
        "mode",
        "FineTuningMode | str",
        "<FineTuningMode.SFT: 'supervised_fine_tuning'>"
      ],
      [
        "formatter",
        "str",
        "'auto'"
      ],
      [
        "max_sequence_length",
        "int",
        "1024"
      ],
      [
        "train_on_prompt",
        "bool",
        "False"
      ],
      [
        "append_eos_token",
        "bool",
        "True"
      ],
      [
        "end_behavior",
        "str | None",
        "None"
      ],
      [
        "end_tag",
        "str",
        "'<|end|>'"
      ],
      [
        "truncation",
        "bool",
        "True"
      ],
      [
        "padding",
        "str",
        "'longest'"
      ],
      [
        "packing",
        "bool",
        "False"
      ],
      [
        "ignore_index",
        "int",
        "-100"
      ],
      [
        "label_strategy",
        "str | None",
        "None"
      ],
      [
        "text_field",
        "str",
        "'text'"
      ],
      [
        "prompt_field",
        "str",
        "'prompt'"
      ],
      [
        "completion_field",
        "str",
        "'completion'"
      ],
      [
        "instruction_field",
        "str",
        "'instruction'"
      ],
      [
        "input_field",
        "str",
        "'input'"
      ],
      [
        "response_field",
        "str",
        "'output'"
      ],
      [
        "messages_field",
        "str",
        "'messages'"
      ],
      [
        "strict_field_mapping",
        "bool",
        "False"
      ],
      [
        "instruction_tag",
        "str | None",
        "None"
      ],
      [
        "response_tag",
        "str | None",
        "None"
      ],
      [
        "context_tag",
        "str | None",
        "None"
      ],
      [
        "separator",
        "str",
        "'\\n'"
      ],
      [
        "register_tags_as_special_tokens",
        "bool",
        "False"
      ],
      [
        "skip_invalid_records",
        "bool",
        "False"
      ],
      [
        "max_report_errors",
        "int",
        "10"
      ],
      [
        "config_version",
        "int",
        "1"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional Hugging Face/PEFT for external paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.finetuning import FineTuningConfig\n\nprint(FineTuningConfig)",
    "members": [
      [
        "from_dict(values: 'dict[str, Any]') -> \"'FineTuningConfig'\"",
        "Maakt een config vanuit een dict met strikte veldcontrole."
      ],
      [
        "to_dict(self) -> 'dict[str, Any]'",
        "Zet de config om naar JSON-vriendelijke data."
      ],
      [
        "to_sft_config(self, training_config: 'TrainingConfig | None' = None) -> \"'SFTConfig'\"",
        "Maakt een `SFTConfig` voor de bestaande trainer-integratie."
      ],
      [
        "validate(self) -> 'None'",
        "Controleert of de fine-tuning instellingen bruikbaar zijn."
      ]
    ]
  },
  {
    "name": "FineTuningDatasetReport",
    "qualifiedName": "arclm.finetuning.FineTuningDatasetReport",
    "importPath": "arclm.finetuning.FineTuningDatasetReport",
    "canonicalImport": "from arclm.finetuning import FineTuningDatasetReport",
    "alternativeImport": "",
    "kind": "class",
    "category": "finetuning",
    "status": "Beta",
    "signature": "FineTuningDatasetReport(mode: 'str', formatter: 'str', records_seen: 'int', records_valid: 'int', records_rejected: 'int', records_truncated: 'int', examples_dropped: 'int', total_tokens: 'int', trainable_tokens: 'int', dataset_fingerprint: 'str', errors: 'list[dict[str, Any]]' = <factory>) -> None",
    "summary": "Veilige samenvatting van datasetvoorbereiding.",
    "parameters": [
      [
        "mode",
        "str",
        "required"
      ],
      [
        "formatter",
        "str",
        "required"
      ],
      [
        "records_seen",
        "int",
        "required"
      ],
      [
        "records_valid",
        "int",
        "required"
      ],
      [
        "records_rejected",
        "int",
        "required"
      ],
      [
        "records_truncated",
        "int",
        "required"
      ],
      [
        "examples_dropped",
        "int",
        "required"
      ],
      [
        "total_tokens",
        "int",
        "required"
      ],
      [
        "trainable_tokens",
        "int",
        "required"
      ],
      [
        "dataset_fingerprint",
        "str",
        "required"
      ],
      [
        "errors",
        "list[dict[str, Any]]",
        "<factory>"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional Hugging Face/PEFT for external paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.finetuning import FineTuningDatasetReport\n\nprint(FineTuningDatasetReport)",
    "members": [
      [
        "to_dict(self) -> 'dict[str, Any]'",
        "Zet de samenvatting om naar JSON-vriendelijke data."
      ]
    ]
  },
  {
    "name": "FineTuningMode",
    "qualifiedName": "arclm.finetuning.FineTuningMode",
    "importPath": "arclm.finetuning.FineTuningMode",
    "canonicalImport": "from arclm.finetuning import FineTuningMode",
    "alternativeImport": "",
    "kind": "class",
    "category": "finetuning",
    "status": "Beta",
    "signature": "FineTuningMode(*values)",
    "summary": "Beschrijft welke fine-tuning taak uitgevoerd wordt.",
    "parameters": [
      [
        "values",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional Hugging Face/PEFT for external paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.finetuning import FineTuningMode\n\nprint(FineTuningMode)",
    "members": []
  },
  {
    "name": "FineTuningResult",
    "qualifiedName": "arclm.finetuning.FineTuningResult",
    "importPath": "arclm.finetuning.FineTuningResult",
    "canonicalImport": "from arclm.finetuning import FineTuningResult",
    "alternativeImport": "",
    "kind": "class",
    "category": "finetuning",
    "status": "Beta",
    "signature": "FineTuningResult(training_state: 'Any', dataset_report: 'FineTuningDatasetReport', model: 'torch.nn.Module', tokenizer: 'Any | None' = None, fine_tuning_config: 'FineTuningConfig | None' = None, training_config: 'TrainingConfig | None' = None, evaluation_result: 'dict[str, Any] | None' = None, trainer: 'FullFineTuner | None' = None, checkpoint_path: 'str | None' = None, peft_config: 'Any | None' = None, peft_result: 'Any | None' = None, reproducibility_metadata: 'dict[str, Any] | None' = None) -> None",
    "summary": "Resultaat van een stabiele fine-tuning run.",
    "parameters": [
      [
        "training_state",
        "Any",
        "required"
      ],
      [
        "dataset_report",
        "FineTuningDatasetReport",
        "required"
      ],
      [
        "model",
        "torch.nn.Module",
        "required"
      ],
      [
        "tokenizer",
        "Any | None",
        "None"
      ],
      [
        "fine_tuning_config",
        "FineTuningConfig | None",
        "None"
      ],
      [
        "training_config",
        "TrainingConfig | None",
        "None"
      ],
      [
        "evaluation_result",
        "dict[str, Any] | None",
        "None"
      ],
      [
        "trainer",
        "FullFineTuner | None",
        "None"
      ],
      [
        "checkpoint_path",
        "str | None",
        "None"
      ],
      [
        "peft_config",
        "Any | None",
        "None"
      ],
      [
        "peft_result",
        "Any | None",
        "None"
      ],
      [
        "reproducibility_metadata",
        "dict[str, Any] | None",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional Hugging Face/PEFT for external paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.finetuning import FineTuningResult\n\nprint(FineTuningResult)",
    "members": [
      [
        "save_adapter_artifact(self, path, *, overwrite: 'bool' = False)",
        "Bewaart alleen de PEFT adapter, niet het hele model."
      ],
      [
        "save_model_artifact(self, path, *, config: 'Mapping[str, Any] | Any | None' = None, overwrite: 'bool' = False, evaluation_summary: 'Mapping[str, Any] | None' = None, merge_adapter: 'bool' = False)",
        "Bewaart het finale modelartifact via de lifecycle API."
      ],
      [
        "to_dict(self) -> 'dict[str, Any]'",
        "Geeft alleen veilige metadata terug, geen runtime objecten."
      ]
    ]
  },
  {
    "name": "FullFineTuner",
    "qualifiedName": "arclm.finetuning.FullFineTuner",
    "importPath": "arclm.finetuning.FullFineTuner",
    "canonicalImport": "from arclm.finetuning import FullFineTuner",
    "alternativeImport": "from arclm import FullFineTuner",
    "kind": "class",
    "category": "finetuning",
    "status": "Beta",
    "signature": "FullFineTuner(model, tokenizer=None, train_dataset=None, config: 'SFTConfig | None' = None, validation_dataset=None, model_adapter=None, tokenizer_adapter=None, optimizer=None, scheduler=None, callbacks=None, collate_fn=None)",
    "summary": "Traint alle trainbare modelparameters met de Training Core.",
    "parameters": [
      [
        "model",
        "Any",
        "required"
      ],
      [
        "tokenizer",
        "Any",
        "None"
      ],
      [
        "train_dataset",
        "Any",
        "None"
      ],
      [
        "config",
        "SFTConfig | None",
        "None"
      ],
      [
        "validation_dataset",
        "Any",
        "None"
      ],
      [
        "model_adapter",
        "Any",
        "None"
      ],
      [
        "tokenizer_adapter",
        "Any",
        "None"
      ],
      [
        "optimizer",
        "Any",
        "None"
      ],
      [
        "scheduler",
        "Any",
        "None"
      ],
      [
        "callbacks",
        "Any",
        "None"
      ],
      [
        "collate_fn",
        "Any",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional Hugging Face/PEFT for external paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.finetuning import FullFineTuner\n\nprint(FullFineTuner)",
    "members": [
      [
        "evaluate(self, dataset=None)",
        "Evalueert het model met de bestaande evaluatie-integratie."
      ],
      [
        "load_checkpoint(self, path)",
        "Laadt een checkpoint via de bestaande Trainer."
      ],
      [
        "resume(self, path)",
        "Laadt een checkpoint om verder te trainen."
      ],
      [
        "save_checkpoint(self, path=None)",
        "Slaat training en SFT metadata op."
      ],
      [
        "save_metadata(self, path) -> 'Path'",
        "Bewaart kleine SFT metadata naast het checkpoint."
      ],
      [
        "save_model_artifact(self, path, *, config=None, training_summary=None, evaluation_summary=None, overwrite=False)",
        "Bewaart het finale modelartifact, niet de training checkpoint-state."
      ],
      [
        "train(self, resume_from_checkpoint=None)",
        "Start fine-tuning en geeft de training state terug."
      ]
    ]
  },
  {
    "name": "ModelAdapter",
    "qualifiedName": "arclm.finetuning.ModelAdapter",
    "importPath": "arclm.finetuning.ModelAdapter",
    "canonicalImport": "from arclm.finetuning import ModelAdapter",
    "alternativeImport": "from arclm import ModelAdapter",
    "kind": "class",
    "category": "finetuning",
    "status": "Beta",
    "signature": "ModelAdapter(model, input_map: 'dict[str, str] | None' = None, output_map: 'dict[str, str] | None' = None, ignore_index: 'int' = -100, label_shift: 'bool' = True)",
    "summary": "Zet een model om naar het formaat dat ArcLM verwacht.",
    "parameters": [
      [
        "model",
        "Any",
        "required"
      ],
      [
        "input_map",
        "dict[str, str] | None",
        "None"
      ],
      [
        "output_map",
        "dict[str, str] | None",
        "None"
      ],
      [
        "ignore_index",
        "int",
        "-100"
      ],
      [
        "label_shift",
        "bool",
        "True"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional Hugging Face/PEFT for external paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.finetuning import ModelAdapter\n\nprint(ModelAdapter)",
    "members": [
      [
        "add_module(self, name: str, module: Optional[ForwardRef('Module')]) -> None",
        "Add a child module to the current module."
      ],
      [
        "apply(self, fn: collections.abc.Callable[['Module'], None]) -> Self",
        "Apply ``fn`` recursively to every submodule (as returned by ``.children()``) as well as self."
      ],
      [
        "bfloat16(self) -> Self",
        "Casts all floating point parameters and buffers to ``bfloat16`` datatype."
      ],
      [
        "buffers(self, recurse: bool = True) -> collections.abc.Iterator[torch.Tensor]",
        "Return an iterator over module buffers."
      ],
      [
        "call_model(self, model_inputs: 'dict[str, Any]')",
        "Roept het model aan met passende argumenten."
      ],
      [
        "capabilities(self) -> 'dict[str, bool]'",
        "Geeft eenvoudige modelmogelijkheden terug."
      ],
      [
        "children(self) -> collections.abc.Iterator['Module']",
        "Return an iterator over immediate children modules."
      ],
      [
        "compile(self, *args, **kwargs) -> None",
        "Compile this Module's forward using :func:`torch.compile`."
      ],
      [
        "compute_loss(self, logits, labels)",
        "Berekent causal-lm loss als het model zelf geen loss geeft."
      ],
      [
        "cpu(self) -> Self",
        "Move all model parameters and buffers to the CPU."
      ],
      [
        "cuda(self, device: int | torch.device | None = None) -> Self",
        "Move all model parameters and buffers to the GPU."
      ],
      [
        "double(self) -> Self",
        "Casts all floating point parameters and buffers to ``double`` datatype."
      ]
    ]
  },
  {
    "name": "PreparedFineTuningDataset",
    "qualifiedName": "arclm.finetuning.PreparedFineTuningDataset",
    "importPath": "arclm.finetuning.PreparedFineTuningDataset",
    "canonicalImport": "from arclm.finetuning import PreparedFineTuningDataset",
    "alternativeImport": "",
    "kind": "class",
    "category": "finetuning",
    "status": "Beta",
    "signature": "PreparedFineTuningDataset(features: 'Sequence[dict[str, list[int]]]', report: 'FineTuningDatasetReport')",
    "summary": "Dataset met vooraf getokenizede fine-tuning voorbeelden.",
    "parameters": [
      [
        "features",
        "Sequence[dict[str, list[int]]]",
        "required"
      ],
      [
        "report",
        "FineTuningDatasetReport",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional Hugging Face/PEFT for external paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.finetuning import PreparedFineTuningDataset\n\nprint(PreparedFineTuningDataset)",
    "members": []
  },
  {
    "name": "PreparedFineTuningRecord",
    "qualifiedName": "arclm.finetuning.PreparedFineTuningRecord",
    "importPath": "arclm.finetuning.PreparedFineTuningRecord",
    "canonicalImport": "from arclm.finetuning import PreparedFineTuningRecord",
    "alternativeImport": "",
    "kind": "class",
    "category": "finetuning",
    "status": "Beta",
    "signature": "PreparedFineTuningRecord(record_index: 'int', formatted_text: 'str', tokens: 'list[str]', input_ids: 'list[int]', labels: 'list[int]', label_mask: 'list[str]', attention_mask: 'list[int]', sequence_length: 'int', original_token_count: 'int', unknown_token_count: 'int', truncated: 'bool', detected_tags: 'list[str]' = <factory>, tags: 'dict[str, Any]' = <factory>, warnings: 'list[str]' = <factory>) -> None",
    "summary": "Canonical prepared representation of one fine-tuning record.",
    "parameters": [
      [
        "record_index",
        "int",
        "required"
      ],
      [
        "formatted_text",
        "str",
        "required"
      ],
      [
        "tokens",
        "list[str]",
        "required"
      ],
      [
        "input_ids",
        "list[int]",
        "required"
      ],
      [
        "labels",
        "list[int]",
        "required"
      ],
      [
        "label_mask",
        "list[str]",
        "required"
      ],
      [
        "attention_mask",
        "list[int]",
        "required"
      ],
      [
        "sequence_length",
        "int",
        "required"
      ],
      [
        "original_token_count",
        "int",
        "required"
      ],
      [
        "unknown_token_count",
        "int",
        "required"
      ],
      [
        "truncated",
        "bool",
        "required"
      ],
      [
        "detected_tags",
        "list[str]",
        "<factory>"
      ],
      [
        "tags",
        "dict[str, Any]",
        "<factory>"
      ],
      [
        "warnings",
        "list[str]",
        "<factory>"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional Hugging Face/PEFT for external paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.finetuning import PreparedFineTuningRecord\n\nprint(PreparedFineTuningRecord)",
    "members": [
      [
        "feature(self) -> 'dict[str, list[int]]'",
        "Return the Trainer-facing token feature."
      ],
      [
        "to_dict(self) -> 'dict[str, Any]'",
        "Return a JSON-safe bounded preview shape."
      ]
    ]
  },
  {
    "name": "SFTConfig",
    "qualifiedName": "arclm.finetuning.SFTConfig",
    "importPath": "arclm.finetuning.SFTConfig",
    "canonicalImport": "from arclm.finetuning import SFTConfig",
    "alternativeImport": "from arclm import SFTConfig",
    "kind": "class",
    "category": "finetuning",
    "status": "Beta",
    "signature": "SFTConfig(epochs: 'int' = 3, batch_size: 'int' = 8, learning_rate: 'float' = 2e-05, weight_decay: 'float' = 0.0, gradient_accumulation_steps: 'int' = 1, precision: 'str' = 'fp32', max_grad_norm: 'float | None' = 1.0, output_dir: 'str' = 'outputs', save_every_steps: 'int' = 500, keep_last_checkpoints: 'int | None' = 3, log_every_steps: 'int' = 10, optimizer: 'str' = 'adamw', scheduler: 'str' = 'constant', warmup_steps: 'int' = 0, max_steps: 'int | None' = None, device: 'str | None' = None, num_workers: 'int' = 0, shuffle: 'bool' = True, text_field: 'str | None' = 'text', instruction_field: 'str | None' = None, input_field: 'str | None' = None, response_field: 'str | None' = None, prompt_field: 'str | None' = None, messages_field: 'str | None' = None, max_length: 'int' = 1024, padding: 'str' = 'longest', truncation: 'bool' = True, packing: 'bool' = False, assistant_only_loss: 'bool' = False, add_eos_token: 'bool' = True, ignore_index: 'int' = -100, label_shift: 'bool' = True, chat_template: 'str | None' = None) -> None",
    "summary": "Bewaart instellingen voor supervised fine-tuning.",
    "parameters": [
      [
        "epochs",
        "int",
        "3"
      ],
      [
        "batch_size",
        "int",
        "8"
      ],
      [
        "learning_rate",
        "float",
        "2e-05"
      ],
      [
        "weight_decay",
        "float",
        "0.0"
      ],
      [
        "gradient_accumulation_steps",
        "int",
        "1"
      ],
      [
        "precision",
        "str",
        "'fp32'"
      ],
      [
        "max_grad_norm",
        "float | None",
        "1.0"
      ],
      [
        "output_dir",
        "str",
        "'outputs'"
      ],
      [
        "save_every_steps",
        "int",
        "500"
      ],
      [
        "keep_last_checkpoints",
        "int | None",
        "3"
      ],
      [
        "log_every_steps",
        "int",
        "10"
      ],
      [
        "optimizer",
        "str",
        "'adamw'"
      ],
      [
        "scheduler",
        "str",
        "'constant'"
      ],
      [
        "warmup_steps",
        "int",
        "0"
      ],
      [
        "max_steps",
        "int | None",
        "None"
      ],
      [
        "device",
        "str | None",
        "None"
      ],
      [
        "num_workers",
        "int",
        "0"
      ],
      [
        "shuffle",
        "bool",
        "True"
      ],
      [
        "text_field",
        "str | None",
        "'text'"
      ],
      [
        "instruction_field",
        "str | None",
        "None"
      ],
      [
        "input_field",
        "str | None",
        "None"
      ],
      [
        "response_field",
        "str | None",
        "None"
      ],
      [
        "prompt_field",
        "str | None",
        "None"
      ],
      [
        "messages_field",
        "str | None",
        "None"
      ],
      [
        "max_length",
        "int",
        "1024"
      ],
      [
        "padding",
        "str",
        "'longest'"
      ],
      [
        "truncation",
        "bool",
        "True"
      ],
      [
        "packing",
        "bool",
        "False"
      ],
      [
        "assistant_only_loss",
        "bool",
        "False"
      ],
      [
        "add_eos_token",
        "bool",
        "True"
      ],
      [
        "ignore_index",
        "int",
        "-100"
      ],
      [
        "label_shift",
        "bool",
        "True"
      ],
      [
        "chat_template",
        "str | None",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional Hugging Face/PEFT for external paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.finetuning import SFTConfig\n\nprint(SFTConfig)",
    "members": [
      [
        "from_dict(values: 'dict[str, Any]') -> \"'TrainingConfig'\"",
        "Maakt een config vanuit een dict."
      ],
      [
        "to_dict(self) -> 'dict[str, Any]'",
        "Zet de config om naar een gewone dict."
      ],
      [
        "validate(self) -> 'None'",
        "Controleert of de SFT instellingen bruikbaar zijn."
      ]
    ]
  },
  {
    "name": "SFTDataCollator",
    "qualifiedName": "arclm.finetuning.SFTDataCollator",
    "importPath": "arclm.finetuning.SFTDataCollator",
    "canonicalImport": "from arclm.finetuning import SFTDataCollator",
    "alternativeImport": "from arclm import SFTDataCollator",
    "kind": "class",
    "category": "finetuning",
    "status": "Beta",
    "signature": "SFTDataCollator(tokenizer=None, config: 'SFTConfig | None' = None, tokenizer_adapter=None)",
    "summary": "Zet SFT voorbeelden om naar tensors voor de trainer.",
    "parameters": [
      [
        "tokenizer",
        "Any",
        "None"
      ],
      [
        "config",
        "SFTConfig | None",
        "None"
      ],
      [
        "tokenizer_adapter",
        "Any",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional Hugging Face/PEFT for external paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.finetuning import SFTDataCollator\n\nprint(SFTDataCollator)",
    "members": [
      [
        "pad_features(self, features: 'list[dict[str, list[int]]]')",
        "Vult features aan tot dezelfde lengte en geeft tensors terug."
      ],
      [
        "prepare_feature(self, example: 'dict[str, Any]') -> 'dict[str, list[int]]'",
        "Tokenizet \u00e9\u00e9n voorbeeld en maakt labels."
      ],
      [
        "prepare_tokenized_feature(self, example: 'dict[str, Any]') -> 'dict[str, list[int]]'",
        "Maakt een feature van al getokenizede data."
      ],
      [
        "target_length(self, features: 'list[dict[str, list[int]]]') -> 'int'",
        "Bepaalt de lengte waarnaar we padding toepassen."
      ]
    ]
  },
  {
    "name": "SFTRecordContract",
    "qualifiedName": "arclm.finetuning.SFTRecordContract",
    "importPath": "arclm.finetuning.SFTRecordContract",
    "canonicalImport": "from arclm.finetuning import SFTRecordContract",
    "alternativeImport": "from arclm import SFTRecordContract",
    "kind": "class",
    "category": "finetuning",
    "status": "Beta",
    "signature": "SFTRecordContract(format: 'str', required_fields: 'tuple[str, ...]', optional_fields: 'tuple[str, ...]' = (), description: 'str' = '') -> None",
    "summary": "Public description of accepted SFT record fields.",
    "parameters": [
      [
        "format",
        "str",
        "required"
      ],
      [
        "required_fields",
        "tuple[str, ...]",
        "required"
      ],
      [
        "optional_fields",
        "tuple[str, ...]",
        "()"
      ],
      [
        "description",
        "str",
        "''"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional Hugging Face/PEFT for external paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.finetuning import SFTRecordContract\n\nprint(SFTRecordContract)",
    "members": [
      [
        "to_dict(self) -> 'dict[str, Any]'",
        "Return JSON-safe contract data."
      ]
    ]
  },
  {
    "name": "SFTTrainer",
    "qualifiedName": "arclm.finetuning.SFTTrainer",
    "importPath": "arclm.finetuning.SFTTrainer",
    "canonicalImport": "from arclm.finetuning import SFTTrainer",
    "alternativeImport": "from arclm import SFTTrainer",
    "kind": "class",
    "category": "finetuning",
    "status": "Beta",
    "signature": "SFTTrainer(model, tokenizer=None, train_dataset=None, config: 'SFTConfig | None' = None, validation_dataset=None, model_adapter=None, tokenizer_adapter=None, optimizer=None, scheduler=None, callbacks=None, collate_fn=None)",
    "summary": "Traint een tekstmodel met instruction-, chat- of tekstdatasets.",
    "parameters": [
      [
        "model",
        "Any",
        "required"
      ],
      [
        "tokenizer",
        "Any",
        "None"
      ],
      [
        "train_dataset",
        "Any",
        "None"
      ],
      [
        "config",
        "SFTConfig | None",
        "None"
      ],
      [
        "validation_dataset",
        "Any",
        "None"
      ],
      [
        "model_adapter",
        "Any",
        "None"
      ],
      [
        "tokenizer_adapter",
        "Any",
        "None"
      ],
      [
        "optimizer",
        "Any",
        "None"
      ],
      [
        "scheduler",
        "Any",
        "None"
      ],
      [
        "callbacks",
        "Any",
        "None"
      ],
      [
        "collate_fn",
        "Any",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional Hugging Face/PEFT for external paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.finetuning import SFTTrainer\n\nprint(SFTTrainer)",
    "members": [
      [
        "evaluate(self, dataset=None)",
        "Evalueert het model met de bestaande evaluatie-integratie."
      ],
      [
        "load_checkpoint(self, path)",
        "Laadt een checkpoint via de bestaande Trainer."
      ],
      [
        "resume(self, path)",
        "Laadt een checkpoint om verder te trainen."
      ],
      [
        "save_checkpoint(self, path=None)",
        "Slaat training en SFT metadata op."
      ],
      [
        "save_metadata(self, path) -> 'Path'",
        "Bewaart kleine SFT metadata naast het checkpoint."
      ],
      [
        "save_model_artifact(self, path, *, config=None, training_summary=None, evaluation_summary=None, overwrite=False)",
        "Bewaart het finale modelartifact, niet de training checkpoint-state."
      ],
      [
        "train(self, resume_from_checkpoint=None)",
        "Start fine-tuning en geeft de training state terug."
      ]
    ]
  },
  {
    "name": "SFTTrainingResult",
    "qualifiedName": "arclm.finetuning.SFTTrainingResult",
    "importPath": "arclm.finetuning.SFTTrainingResult",
    "canonicalImport": "from arclm.finetuning import SFTTrainingResult",
    "alternativeImport": "from arclm import SFTTrainingResult",
    "kind": "class",
    "category": "finetuning",
    "status": "Beta",
    "signature": "SFTTrainingResult(model: 'str', dataset: 'str', output_dir: 'str', backend: 'str', use_lora: 'bool', assistant_only_loss: 'bool', train_loss_history: 'List[float]', steps: 'int', metadata_path: 'str', adapter_path: 'Optional[str]' = None, full_model_path: 'Optional[str]' = None) -> None",
    "summary": "Result returned by ``train_sft``.",
    "parameters": [
      [
        "model",
        "str",
        "required"
      ],
      [
        "dataset",
        "str",
        "required"
      ],
      [
        "output_dir",
        "str",
        "required"
      ],
      [
        "backend",
        "str",
        "required"
      ],
      [
        "use_lora",
        "bool",
        "required"
      ],
      [
        "assistant_only_loss",
        "bool",
        "required"
      ],
      [
        "train_loss_history",
        "List[float]",
        "required"
      ],
      [
        "steps",
        "int",
        "required"
      ],
      [
        "metadata_path",
        "str",
        "required"
      ],
      [
        "adapter_path",
        "Optional[str]",
        "None"
      ],
      [
        "full_model_path",
        "Optional[str]",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional Hugging Face/PEFT for external paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.finetuning import SFTTrainingResult\n\nprint(SFTTrainingResult)",
    "members": []
  },
  {
    "name": "TokenizerAdapter",
    "qualifiedName": "arclm.finetuning.TokenizerAdapter",
    "importPath": "arclm.finetuning.TokenizerAdapter",
    "canonicalImport": "from arclm.finetuning import TokenizerAdapter",
    "alternativeImport": "from arclm import TokenizerAdapter",
    "kind": "class",
    "category": "finetuning",
    "status": "Beta",
    "signature": "TokenizerAdapter(tokenizer, pad_token_id: 'int | None' = None, eos_token_id: 'int | None' = None)",
    "summary": "Zet verschillende tokenizers om naar \u00e9\u00e9n eenvoudige interface.",
    "parameters": [
      [
        "tokenizer",
        "Any",
        "required"
      ],
      [
        "pad_token_id",
        "int | None",
        "None"
      ],
      [
        "eos_token_id",
        "int | None",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional Hugging Face/PEFT for external paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.finetuning import TokenizerAdapter\n\nprint(TokenizerAdapter)",
    "members": [
      [
        "apply_chat_template(self, messages, **kwargs)",
        "Gebruikt een tokenizer-native chat template als die bestaat."
      ],
      [
        "decode(self, ids)",
        "Zet token ids terug naar tekst als de tokenizer dat kan."
      ],
      [
        "encode(self, text: 'str', max_length: 'int | None' = None, truncation: 'bool' = True)",
        "Zet tekst om naar token ids."
      ],
      [
        "has_chat_template(self) -> 'bool'",
        "Controleert of de tokenizer een chat template heeft."
      ]
    ]
  },
  {
    "name": "create_labels",
    "qualifiedName": "arclm.finetuning.create_labels",
    "importPath": "arclm.finetuning.create_labels",
    "canonicalImport": "from arclm.finetuning import create_labels",
    "alternativeImport": "",
    "kind": "function",
    "category": "finetuning",
    "status": "Beta",
    "signature": "create_labels(input_ids: 'Sequence[int]', attention_mask: 'Sequence[int] | None' = None, ignore_index: 'int' = -100) -> 'list[int]'",
    "summary": "Maakt labels en negeert padding tijdens de lossberekening.",
    "parameters": [
      [
        "input_ids",
        "Sequence[int]",
        "required"
      ],
      [
        "attention_mask",
        "Sequence[int] | None",
        "None"
      ],
      [
        "ignore_index",
        "int",
        "-100"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional Hugging Face/PEFT for external paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.finetuning import create_labels\n\nprint(create_labels)",
    "members": []
  },
  {
    "name": "fine_tune",
    "qualifiedName": "arclm.finetuning.fine_tune",
    "importPath": "arclm.finetuning.fine_tune",
    "canonicalImport": "from arclm.finetuning import fine_tune",
    "alternativeImport": "",
    "kind": "function",
    "category": "finetuning",
    "status": "Beta",
    "signature": "fine_tune(*, model: 'torch.nn.Module | None' = None, tokenizer: 'Any | None' = None, loaded_model: 'Any | None' = None, train_dataset: 'Iterable[Mapping[str, Any]]', eval_dataset: 'Iterable[Mapping[str, Any]] | None' = None, training_config: 'TrainingConfig | None' = None, fine_tuning_config: 'FineTuningConfig | None' = None, model_adapter: 'ModelAdapter | None' = None, tokenizer_adapter: 'TokenizerAdapter | None' = None, peft_config: 'Any | None' = None, resume_from_checkpoint=None, save_checkpoint: 'bool' = False, reproducibility_metadata: 'Mapping[str, Any] | None' = None) -> 'FineTuningResult'",
    "summary": "Voert full-parameter fine-tuning uit met de bestaande Trainer.",
    "parameters": [
      [
        "model",
        "torch.nn.Module | None",
        "None"
      ],
      [
        "tokenizer",
        "Any | None",
        "None"
      ],
      [
        "loaded_model",
        "Any | None",
        "None"
      ],
      [
        "train_dataset",
        "Iterable[Mapping[str, Any]]",
        "required"
      ],
      [
        "eval_dataset",
        "Iterable[Mapping[str, Any]] | None",
        "None"
      ],
      [
        "training_config",
        "TrainingConfig | None",
        "None"
      ],
      [
        "fine_tuning_config",
        "FineTuningConfig | None",
        "None"
      ],
      [
        "model_adapter",
        "ModelAdapter | None",
        "None"
      ],
      [
        "tokenizer_adapter",
        "TokenizerAdapter | None",
        "None"
      ],
      [
        "peft_config",
        "Any | None",
        "None"
      ],
      [
        "resume_from_checkpoint",
        "Any",
        "None"
      ],
      [
        "save_checkpoint",
        "bool",
        "False"
      ],
      [
        "reproducibility_metadata",
        "Mapping[str, Any] | None",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional Hugging Face/PEFT for external paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.finetuning import fine_tune\n\nprint(fine_tune)",
    "members": []
  },
  {
    "name": "fine_tuning_format_fingerprint",
    "qualifiedName": "arclm.finetuning.fine_tuning_format_fingerprint",
    "importPath": "arclm.finetuning.fine_tuning_format_fingerprint",
    "canonicalImport": "from arclm.finetuning import fine_tuning_format_fingerprint",
    "alternativeImport": "",
    "kind": "function",
    "category": "finetuning",
    "status": "Beta",
    "signature": "fine_tuning_format_fingerprint(*, config: 'FineTuningConfig', tokenizer_identity: 'Mapping[str, Any] | None' = None) -> 'str'",
    "summary": "Fingerprint only fields that affect prepared fine-tuning examples.",
    "parameters": [
      [
        "config",
        "FineTuningConfig",
        "required"
      ],
      [
        "tokenizer_identity",
        "Mapping[str, Any] | None",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional Hugging Face/PEFT for external paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.finetuning import fine_tuning_format_fingerprint\n\nprint(fine_tuning_format_fingerprint)",
    "members": []
  },
  {
    "name": "format_chat_example",
    "qualifiedName": "arclm.finetuning.format_chat_example",
    "importPath": "arclm.finetuning.format_chat_example",
    "canonicalImport": "from arclm.finetuning import format_chat_example",
    "alternativeImport": "",
    "kind": "function",
    "category": "finetuning",
    "status": "Beta",
    "signature": "format_chat_example(example: 'dict[str, Any]', config: 'SFTConfig', tokenizer_adapter=None) -> 'dict[str, Any]'",
    "summary": "Maakt tekst van chat messages.",
    "parameters": [
      [
        "example",
        "dict[str, Any]",
        "required"
      ],
      [
        "config",
        "SFTConfig",
        "required"
      ],
      [
        "tokenizer_adapter",
        "Any",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional Hugging Face/PEFT for external paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.finetuning import format_chat_example\n\nprint(format_chat_example)",
    "members": []
  },
  {
    "name": "format_example",
    "qualifiedName": "arclm.finetuning.format_example",
    "importPath": "arclm.finetuning.format_example",
    "canonicalImport": "from arclm.finetuning import format_example",
    "alternativeImport": "",
    "kind": "function",
    "category": "finetuning",
    "status": "Beta",
    "signature": "format_example(example: 'dict[str, Any]', config: 'SFTConfig', tokenizer_adapter=None) -> 'dict[str, Any]'",
    "summary": "Formatteert \u00e9\u00e9n voorbeeld volgens de gekozen datasetvorm.",
    "parameters": [
      [
        "example",
        "dict[str, Any]",
        "required"
      ],
      [
        "config",
        "SFTConfig",
        "required"
      ],
      [
        "tokenizer_adapter",
        "Any",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional Hugging Face/PEFT for external paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.finetuning import format_example\n\nprint(format_example)",
    "members": []
  },
  {
    "name": "format_instruction_example",
    "qualifiedName": "arclm.finetuning.format_instruction_example",
    "importPath": "arclm.finetuning.format_instruction_example",
    "canonicalImport": "from arclm.finetuning import format_instruction_example",
    "alternativeImport": "",
    "kind": "function",
    "category": "finetuning",
    "status": "Beta",
    "signature": "format_instruction_example(example: 'dict[str, Any]', config: 'SFTConfig') -> 'dict[str, Any]'",
    "summary": "Maakt tekst van een instruction-response voorbeeld.",
    "parameters": [
      [
        "example",
        "dict[str, Any]",
        "required"
      ],
      [
        "config",
        "SFTConfig",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional Hugging Face/PEFT for external paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.finetuning import format_instruction_example\n\nprint(format_instruction_example)",
    "members": []
  },
  {
    "name": "format_prompt_response_example",
    "qualifiedName": "arclm.finetuning.format_prompt_response_example",
    "importPath": "arclm.finetuning.format_prompt_response_example",
    "canonicalImport": "from arclm.finetuning import format_prompt_response_example",
    "alternativeImport": "",
    "kind": "function",
    "category": "finetuning",
    "status": "Beta",
    "signature": "format_prompt_response_example(example: 'dict[str, Any]', config: 'SFTConfig') -> 'dict[str, Any]'",
    "summary": "Maakt tekst van een prompt-response voorbeeld.",
    "parameters": [
      [
        "example",
        "dict[str, Any]",
        "required"
      ],
      [
        "config",
        "SFTConfig",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional Hugging Face/PEFT for external paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.finetuning import format_prompt_response_example\n\nprint(format_prompt_response_example)",
    "members": []
  },
  {
    "name": "format_text_example",
    "qualifiedName": "arclm.finetuning.format_text_example",
    "importPath": "arclm.finetuning.format_text_example",
    "canonicalImport": "from arclm.finetuning import format_text_example",
    "alternativeImport": "",
    "kind": "function",
    "category": "finetuning",
    "status": "Beta",
    "signature": "format_text_example(example: 'dict[str, Any]', config: 'SFTConfig') -> 'dict[str, Any]'",
    "summary": "Maakt tekst van een plain-text voorbeeld.",
    "parameters": [
      [
        "example",
        "dict[str, Any]",
        "required"
      ],
      [
        "config",
        "SFTConfig",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional Hugging Face/PEFT for external paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.finetuning import format_text_example\n\nprint(format_text_example)",
    "members": []
  },
  {
    "name": "get_sft_record_contract",
    "qualifiedName": "arclm.finetuning.get_sft_record_contract",
    "importPath": "arclm.finetuning.get_sft_record_contract",
    "canonicalImport": "from arclm.finetuning import get_sft_record_contract",
    "alternativeImport": "from arclm import get_sft_record_contract",
    "kind": "function",
    "category": "finetuning",
    "status": "Beta",
    "signature": "get_sft_record_contract(formatter: 'str' = 'instruction_response') -> 'SFTRecordContract'",
    "summary": "Describe one supported SFT record format.",
    "parameters": [
      [
        "formatter",
        "str",
        "'instruction_response'"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional Hugging Face/PEFT for external paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.finetuning import get_sft_record_contract\n\nprint(get_sft_record_contract)",
    "members": []
  },
  {
    "name": "mask_labels",
    "qualifiedName": "arclm.finetuning.mask_labels",
    "importPath": "arclm.finetuning.mask_labels",
    "canonicalImport": "from arclm.finetuning import mask_labels",
    "alternativeImport": "",
    "kind": "function",
    "category": "finetuning",
    "status": "Beta",
    "signature": "mask_labels(input_ids: 'Sequence[int]', active_mask: 'Sequence[int | bool]', ignore_index: 'int' = -100) -> 'list[int]'",
    "summary": "Zet labels buiten de actieve mask op `ignore_index`.",
    "parameters": [
      [
        "input_ids",
        "Sequence[int]",
        "required"
      ],
      [
        "active_mask",
        "Sequence[int | bool]",
        "required"
      ],
      [
        "ignore_index",
        "int",
        "-100"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional Hugging Face/PEFT for external paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.finetuning import mask_labels\n\nprint(mask_labels)",
    "members": []
  },
  {
    "name": "normalize_fine_tuning_example",
    "qualifiedName": "arclm.finetuning.normalize_fine_tuning_example",
    "importPath": "arclm.finetuning.normalize_fine_tuning_example",
    "canonicalImport": "from arclm.finetuning import normalize_fine_tuning_example",
    "alternativeImport": "",
    "kind": "function",
    "category": "finetuning",
    "status": "Beta",
    "signature": "normalize_fine_tuning_example(record: 'Mapping[str, Any]', source_index: 'int', config: 'FineTuningConfig') -> 'NormalizedSFTExample'",
    "summary": "Normaliseert een datasetrecord naar veilige tekstsegmenten.",
    "parameters": [
      [
        "record",
        "Mapping[str, Any]",
        "required"
      ],
      [
        "source_index",
        "int",
        "required"
      ],
      [
        "config",
        "FineTuningConfig",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional Hugging Face/PEFT for external paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.finetuning import normalize_fine_tuning_example\n\nprint(normalize_fine_tuning_example)",
    "members": []
  },
  {
    "name": "pack_sequences",
    "qualifiedName": "arclm.finetuning.pack_sequences",
    "importPath": "arclm.finetuning.pack_sequences",
    "canonicalImport": "from arclm.finetuning import pack_sequences",
    "alternativeImport": "",
    "kind": "function",
    "category": "finetuning",
    "status": "Beta",
    "signature": "pack_sequences(features: 'list[dict]', max_length: 'int', eos_token_id: 'int | None' = None)",
    "summary": "Pakt korte voorbeelden samen tot maximaal `max_length` tokens.",
    "parameters": [
      [
        "features",
        "list[dict]",
        "required"
      ],
      [
        "max_length",
        "int",
        "required"
      ],
      [
        "eos_token_id",
        "int | None",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional Hugging Face/PEFT for external paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.finetuning import pack_sequences\n\nprint(pack_sequences)",
    "members": []
  },
  {
    "name": "prepare_fine_tuning_dataset",
    "qualifiedName": "arclm.finetuning.prepare_fine_tuning_dataset",
    "importPath": "arclm.finetuning.prepare_fine_tuning_dataset",
    "canonicalImport": "from arclm.finetuning import prepare_fine_tuning_dataset",
    "alternativeImport": "",
    "kind": "function",
    "category": "finetuning",
    "status": "Beta",
    "signature": "prepare_fine_tuning_dataset(records: 'Iterable[Mapping[str, Any]]', tokenizer: 'Any', config: 'FineTuningConfig | None' = None, *, tokenizer_adapter: 'TokenizerAdapter | None' = None) -> 'PreparedFineTuningDataset'",
    "summary": "Valideert, formatteert en tokenizet fine-tuning records.",
    "parameters": [
      [
        "records",
        "Iterable[Mapping[str, Any]]",
        "required"
      ],
      [
        "tokenizer",
        "Any",
        "required"
      ],
      [
        "config",
        "FineTuningConfig | None",
        "None"
      ],
      [
        "tokenizer_adapter",
        "TokenizerAdapter | None",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional Hugging Face/PEFT for external paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.finetuning import prepare_fine_tuning_dataset\n\nprint(prepare_fine_tuning_dataset)",
    "members": []
  },
  {
    "name": "prepare_fine_tuning_record",
    "qualifiedName": "arclm.finetuning.prepare_fine_tuning_record",
    "importPath": "arclm.finetuning.prepare_fine_tuning_record",
    "canonicalImport": "from arclm.finetuning import prepare_fine_tuning_record",
    "alternativeImport": "",
    "kind": "function",
    "category": "finetuning",
    "status": "Beta",
    "signature": "prepare_fine_tuning_record(record: 'Mapping[str, Any]', tokenizer: 'Any', config: 'FineTuningConfig | None' = None, *, tokenizer_adapter: 'TokenizerAdapter | None' = None, record_index: 'int' = 0) -> 'PreparedFineTuningRecord'",
    "summary": "Prepare exactly one record using the canonical dataset-preparation path.",
    "parameters": [
      [
        "record",
        "Mapping[str, Any]",
        "required"
      ],
      [
        "tokenizer",
        "Any",
        "required"
      ],
      [
        "config",
        "FineTuningConfig | None",
        "None"
      ],
      [
        "tokenizer_adapter",
        "TokenizerAdapter | None",
        "None"
      ],
      [
        "record_index",
        "int",
        "0"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional Hugging Face/PEFT for external paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.finetuning import prepare_fine_tuning_record\n\nprint(prepare_fine_tuning_record)",
    "members": []
  },
  {
    "name": "train_sft",
    "qualifiedName": "arclm.finetuning.train_sft",
    "importPath": "arclm.finetuning.train_sft",
    "canonicalImport": "from arclm.finetuning import train_sft",
    "alternativeImport": "from arclm import train_sft",
    "kind": "function",
    "category": "finetuning",
    "status": "Beta",
    "signature": "train_sft(model: 'str', dataset: 'str', output_dir: 'str', backend: 'str' = 'huggingface', assistant_only_loss: 'bool' = True, use_lora: 'bool' = False, batch_size: 'int' = 1, gradient_accumulation_steps: 'int' = 1, learning_rate: 'float' = 0.0002, num_epochs: 'int' = 1, max_length: 'int' = 1024, dtype: 'str' = 'auto', device_map: 'Optional[str]' = None, trust_remote_code: 'bool' = False, enable_thinking: 'Optional[bool]' = False, lora_r: 'int' = 8, lora_alpha: 'int' = 16, lora_dropout: 'float' = 0.05, lora_target_modules: 'Optional[Sequence[str]]' = None, max_steps: 'Optional[int]' = None, seed: 'int' = 42, save_tokenizer: 'bool' = True) -> 'SFTTrainingResult'",
    "summary": "Run supervised fine-tuning through an ArcLM backend.",
    "parameters": [
      [
        "model",
        "str",
        "required"
      ],
      [
        "dataset",
        "str",
        "required"
      ],
      [
        "output_dir",
        "str",
        "required"
      ],
      [
        "backend",
        "str",
        "'huggingface'"
      ],
      [
        "assistant_only_loss",
        "bool",
        "True"
      ],
      [
        "use_lora",
        "bool",
        "False"
      ],
      [
        "batch_size",
        "int",
        "1"
      ],
      [
        "gradient_accumulation_steps",
        "int",
        "1"
      ],
      [
        "learning_rate",
        "float",
        "0.0002"
      ],
      [
        "num_epochs",
        "int",
        "1"
      ],
      [
        "max_length",
        "int",
        "1024"
      ],
      [
        "dtype",
        "str",
        "'auto'"
      ],
      [
        "device_map",
        "Optional[str]",
        "None"
      ],
      [
        "trust_remote_code",
        "bool",
        "False"
      ],
      [
        "enable_thinking",
        "Optional[bool]",
        "False"
      ],
      [
        "lora_r",
        "int",
        "8"
      ],
      [
        "lora_alpha",
        "int",
        "16"
      ],
      [
        "lora_dropout",
        "float",
        "0.05"
      ],
      [
        "lora_target_modules",
        "Optional[Sequence[str]]",
        "None"
      ],
      [
        "max_steps",
        "Optional[int]",
        "None"
      ],
      [
        "seed",
        "int",
        "42"
      ],
      [
        "save_tokenizer",
        "bool",
        "True"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional Hugging Face/PEFT for external paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.finetuning import train_sft\n\nprint(train_sft)",
    "members": []
  },
  {
    "name": "validate_sft_records",
    "qualifiedName": "arclm.finetuning.validate_sft_records",
    "importPath": "arclm.finetuning.validate_sft_records",
    "canonicalImport": "from arclm.finetuning import validate_sft_records",
    "alternativeImport": "from arclm import validate_sft_records",
    "kind": "function",
    "category": "finetuning",
    "status": "Beta",
    "signature": "validate_sft_records(records: 'Iterable[Mapping[str, Any]]', config: 'FineTuningConfig | None' = None, *, strict: 'bool' = True) -> 'DatasetValidationResult'",
    "summary": "Validate SFT records through the canonical fine-tuning normalizer.",
    "parameters": [
      [
        "records",
        "Iterable[Mapping[str, Any]]",
        "required"
      ],
      [
        "config",
        "FineTuningConfig | None",
        "None"
      ],
      [
        "strict",
        "bool",
        "True"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional Hugging Face/PEFT for external paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.finetuning import validate_sft_records\n\nprint(validate_sft_records)",
    "members": []
  },
  {
    "name": "CheckpointTokenizer",
    "qualifiedName": "arclm.inference.CheckpointTokenizer",
    "importPath": "arclm.inference.CheckpointTokenizer",
    "canonicalImport": "from arclm.inference import CheckpointTokenizer",
    "alternativeImport": "",
    "kind": "class",
    "category": "inference",
    "status": "Beta",
    "signature": "CheckpointTokenizer(stoi, itos, tokenizer_type='word')",
    "summary": "Fallback tokenizer reconstructed from checkpoint vocabulary data.",
    "parameters": [
      [
        "stoi",
        "Any",
        "required"
      ],
      [
        "itos",
        "Any",
        "required"
      ],
      [
        "tokenizer_type",
        "Any",
        "'word'"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional Hugging Face stack for external models.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.inference import CheckpointTokenizer\n\nprint(CheckpointTokenizer)",
    "members": [
      [
        "decode_string(self, indices)",
        "Voert `decode string` uit."
      ],
      [
        "encode_text(self, text)",
        "Voert `encode text` uit."
      ]
    ]
  },
  {
    "name": "ExternalLoadedModel",
    "qualifiedName": "arclm.inference.ExternalLoadedModel",
    "importPath": "arclm.inference.ExternalLoadedModel",
    "canonicalImport": "from arclm.inference import ExternalLoadedModel",
    "alternativeImport": "from arclm import ExternalLoadedModel",
    "kind": "class",
    "category": "inference",
    "status": "Beta",
    "signature": "ExternalLoadedModel(model: 'Any', tokenizer: 'Any', config: 'ExternalModelConfig', source_info: 'ModelSourceInfo', device: 'Any', processor: 'Any' = None, _native_loaded: 'Optional[LoadedModel]' = None, _generation_error: 'Optional[str]' = None, _training_method: 'Optional[str]' = None, _lora_merged: 'bool' = False) -> None",
    "summary": "Loaded model wrapper with a unified inference and save API.",
    "parameters": [
      [
        "model",
        "Any",
        "required"
      ],
      [
        "tokenizer",
        "Any",
        "required"
      ],
      [
        "config",
        "ExternalModelConfig",
        "required"
      ],
      [
        "source_info",
        "ModelSourceInfo",
        "required"
      ],
      [
        "device",
        "Any",
        "required"
      ],
      [
        "processor",
        "Any",
        "None"
      ],
      [
        "_native_loaded",
        "Optional[LoadedModel]",
        "None"
      ],
      [
        "_generation_error",
        "Optional[str]",
        "None"
      ],
      [
        "_training_method",
        "Optional[str]",
        "None"
      ],
      [
        "_lora_merged",
        "bool",
        "False"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional Hugging Face stack for external models.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.inference import ExternalLoadedModel\n\nprint(ExternalLoadedModel)",
    "members": [
      [
        "batch_predict(self, prompts: 'Sequence[PromptLike]', **generation_kwargs: 'Any') -> 'List[str]'",
        "Generate one prediction per prompt."
      ],
      [
        "chat(self, messages: 'Sequence[Mapping[str, str]]', **generation_kwargs: 'Any') -> 'str'",
        "Generate a response from OpenAI-style chat messages."
      ],
      [
        "export(self, output_dir: 'PathLike', save_config: 'Optional[ModelSaveConfig]' = None) -> 'Optional[Path]'",
        "Alias for :meth:`save` for explicit export workflows."
      ],
      [
        "generate(self, prompt: 'PromptLike', **generation_kwargs: 'Any') -> 'str'",
        "Generate text with either a native ArcLM or Hugging Face model."
      ],
      [
        "predict(self, prompt: 'PromptLike', **generation_kwargs: 'Any') -> 'str'",
        "Generate a single prediction from a string prompt or chat messages."
      ],
      [
        "save(self, output_dir: 'PathLike', save_config: 'Optional[ModelSaveConfig]' = None) -> 'Optional[Path]'",
        "Save or export this loaded model using ArcLM save settings."
      ],
      [
        "save_pretrained(self, output_dir: 'PathLike', save_config: 'Optional[ModelSaveConfig]' = None) -> 'Optional[Path]'",
        "Alias for :meth:`save` for Hugging Face-style user expectations."
      ],
      [
        "stream_generate(self, prompt: 'PromptLike', **generation_kwargs: 'Any')",
        "Yield real native ArcLM text deltas when this loaded model supports it."
      ],
      [
        "to(self, device: 'Union[str, torch.device]') -> \"'ExternalLoadedModel'\"",
        "Move the underlying model to a device when the backend supports it."
      ]
    ]
  },
  {
    "name": "ExternalModelConfig",
    "qualifiedName": "arclm.inference.ExternalModelConfig",
    "importPath": "arclm.inference.ExternalModelConfig",
    "canonicalImport": "from arclm.inference import ExternalModelConfig",
    "alternativeImport": "from arclm import ExternalModelConfig",
    "kind": "class",
    "category": "inference",
    "status": "Beta",
    "signature": "ExternalModelConfig(source: 'PathLike', base_model: 'Optional[str]' = None, device: 'Optional[str]' = None, device_map: 'Optional[Any]' = None, dtype: 'Optional[Union[str, torch.dtype]]' = 'auto', trust_remote_code: 'bool' = False, tokenizer_path: 'Optional[PathLike]' = None, max_memory: 'Optional[Any]' = None, load_in_8bit: 'bool' = False, load_in_4bit: 'bool' = False, enable_thinking: 'Optional[bool]' = False, default_system_prompt: 'Optional[str]' = None, fallback_to_simple_prompt: 'bool' = True, fallback_to_cpu: 'bool' = True, require_tokenizer: 'bool' = True, prefer_best_native: 'bool' = True, generation_config: 'GenerationConfig' = <factory>, save_config: 'ModelSaveConfig' = <factory>) -> None",
    "summary": "Configuration for loading native or external causal language models.",
    "parameters": [
      [
        "source",
        "PathLike",
        "required"
      ],
      [
        "base_model",
        "Optional[str]",
        "None"
      ],
      [
        "device",
        "Optional[str]",
        "None"
      ],
      [
        "device_map",
        "Optional[Any]",
        "None"
      ],
      [
        "dtype",
        "Optional[Union[str, torch.dtype]]",
        "'auto'"
      ],
      [
        "trust_remote_code",
        "bool",
        "False"
      ],
      [
        "tokenizer_path",
        "Optional[PathLike]",
        "None"
      ],
      [
        "max_memory",
        "Optional[Any]",
        "None"
      ],
      [
        "load_in_8bit",
        "bool",
        "False"
      ],
      [
        "load_in_4bit",
        "bool",
        "False"
      ],
      [
        "enable_thinking",
        "Optional[bool]",
        "False"
      ],
      [
        "default_system_prompt",
        "Optional[str]",
        "None"
      ],
      [
        "fallback_to_simple_prompt",
        "bool",
        "True"
      ],
      [
        "fallback_to_cpu",
        "bool",
        "True"
      ],
      [
        "require_tokenizer",
        "bool",
        "True"
      ],
      [
        "prefer_best_native",
        "bool",
        "True"
      ],
      [
        "generation_config",
        "GenerationConfig",
        "<factory>"
      ],
      [
        "save_config",
        "ModelSaveConfig",
        "<factory>"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional Hugging Face stack for external models.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.inference import ExternalModelConfig\n\nprint(ExternalModelConfig)",
    "members": []
  },
  {
    "name": "GenerationConfig",
    "qualifiedName": "arclm.inference.GenerationConfig",
    "importPath": "arclm.inference.GenerationConfig",
    "canonicalImport": "from arclm.inference import GenerationConfig",
    "alternativeImport": "from arclm import GenerationConfig",
    "kind": "class",
    "category": "inference",
    "status": "Beta",
    "signature": "GenerationConfig(max_new_tokens: 'int' = 128, temperature: 'float' = 0.7, top_p: 'Optional[float]' = 0.9, top_k: 'Optional[int]' = None, do_sample: 'Optional[bool]' = None, repetition_penalty: 'float' = 1.0, pad_token_id: 'Optional[int]' = None, eos_token_id: 'Optional[Union[int, Sequence[int]]]' = None, stop: 'List[str]' = <factory>, return_full_text: 'bool' = False) -> None",
    "summary": "Text generation defaults used by :class:`ExternalLoadedModel`.",
    "parameters": [
      [
        "max_new_tokens",
        "int",
        "128"
      ],
      [
        "temperature",
        "float",
        "0.7"
      ],
      [
        "top_p",
        "Optional[float]",
        "0.9"
      ],
      [
        "top_k",
        "Optional[int]",
        "None"
      ],
      [
        "do_sample",
        "Optional[bool]",
        "None"
      ],
      [
        "repetition_penalty",
        "float",
        "1.0"
      ],
      [
        "pad_token_id",
        "Optional[int]",
        "None"
      ],
      [
        "eos_token_id",
        "Optional[Union[int, Sequence[int]]]",
        "None"
      ],
      [
        "stop",
        "List[str]",
        "<factory>"
      ],
      [
        "return_full_text",
        "bool",
        "False"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional Hugging Face stack for external models.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.inference import GenerationConfig\n\nprint(GenerationConfig)",
    "members": [
      [
        "from_overrides(base: \"Optional['GenerationConfig']\" = None, **overrides: 'Any') -> \"'GenerationConfig'\"",
        "Build a generation config by applying keyword overrides."
      ]
    ]
  },
  {
    "name": "Generator",
    "qualifiedName": "arclm.inference.Generator",
    "importPath": "arclm.inference.Generator",
    "canonicalImport": "from arclm.inference import Generator",
    "alternativeImport": "from arclm import Generator",
    "kind": "class",
    "category": "inference",
    "status": "Beta",
    "signature": "Generator(model, stoi, itos, block_size, device, tokenizer=None)",
    "summary": "Generate tokens from a trained native causal language model.",
    "parameters": [
      [
        "model",
        "Any",
        "required"
      ],
      [
        "stoi",
        "Any",
        "required"
      ],
      [
        "itos",
        "Any",
        "required"
      ],
      [
        "block_size",
        "Any",
        "required"
      ],
      [
        "device",
        "Any",
        "required"
      ],
      [
        "tokenizer",
        "Any",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional Hugging Face stack for external models.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.inference import Generator\n\nprint(Generator)",
    "members": [
      [
        "generate(self, start_text, max_new_tokens=20, temperature=1.0, repetition_penalty=1.0, top_k=None, top_p=None)",
        "Generate tokens from ``start_text`` with the native ArcLM model."
      ],
      [
        "generate_stream(self, start_text, max_new_tokens=20, temperature=1.0, repetition_penalty=1.0, top_k=None, top_p=None, cancel_check=None)",
        "Yield decoded generated token text during native ArcLM inference."
      ],
      [
        "generate_string(self, start_text, max_new_tokens=20, temperature=1.0, repetition_penalty=1.0, top_k=None, top_p=None)",
        "Generate text and return it as a string."
      ]
    ]
  },
  {
    "name": "LoadedModel",
    "qualifiedName": "arclm.inference.LoadedModel",
    "importPath": "arclm.inference.LoadedModel",
    "canonicalImport": "from arclm.inference import LoadedModel",
    "alternativeImport": "from arclm import LoadedModel",
    "kind": "class",
    "category": "inference",
    "status": "Beta",
    "signature": "LoadedModel(model: torch.nn.modules.module.Module, generator: arclm.inference.generation.Generator, config: arclm.configs.base.Config, model_path: pathlib.Path, device: torch.device) -> None",
    "summary": "Loaded model bundle with a minimal prediction method.",
    "parameters": [
      [
        "model",
        "Module",
        "required"
      ],
      [
        "generator",
        "Generator",
        "required"
      ],
      [
        "config",
        "Config",
        "required"
      ],
      [
        "model_path",
        "Path",
        "required"
      ],
      [
        "device",
        "device",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional Hugging Face stack for external models.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.inference import LoadedModel\n\nprint(LoadedModel)",
    "members": [
      [
        "predict(self, input_text, max_new_tokens=80, temperature=0.9, repetition_penalty=1.2, top_k=None, top_p=0.9)",
        "Generate a prediction from raw input text."
      ]
    ]
  },
  {
    "name": "ModelSaveConfig",
    "qualifiedName": "arclm.inference.ModelSaveConfig",
    "importPath": "arclm.inference.ModelSaveConfig",
    "canonicalImport": "from arclm.inference import ModelSaveConfig",
    "alternativeImport": "from arclm import ModelSaveConfig",
    "kind": "class",
    "category": "inference",
    "status": "Beta",
    "signature": "ModelSaveConfig(save_enabled: 'bool' = True, save_mode: 'str' = 'auto', save_layout: 'str' = 'model_id', save_tokenizer: 'bool' = True, save_model_config: 'bool' = True, save_generation_config: 'bool' = True, save_training_metadata: 'bool' = True, save_adapter_config: 'bool' = True, save_processor: 'bool' = True, save_readme: 'bool' = True, save_safetensors: 'bool' = True, merge_lora: 'bool' = False, overwrite: 'bool' = False) -> None",
    "summary": "Developer-controlled settings for saving or exporting loaded models.",
    "parameters": [
      [
        "save_enabled",
        "bool",
        "True"
      ],
      [
        "save_mode",
        "str",
        "'auto'"
      ],
      [
        "save_layout",
        "str",
        "'model_id'"
      ],
      [
        "save_tokenizer",
        "bool",
        "True"
      ],
      [
        "save_model_config",
        "bool",
        "True"
      ],
      [
        "save_generation_config",
        "bool",
        "True"
      ],
      [
        "save_training_metadata",
        "bool",
        "True"
      ],
      [
        "save_adapter_config",
        "bool",
        "True"
      ],
      [
        "save_processor",
        "bool",
        "True"
      ],
      [
        "save_readme",
        "bool",
        "True"
      ],
      [
        "save_safetensors",
        "bool",
        "True"
      ],
      [
        "merge_lora",
        "bool",
        "False"
      ],
      [
        "overwrite",
        "bool",
        "False"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional Hugging Face stack for external models.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.inference import ModelSaveConfig\n\nprint(ModelSaveConfig)",
    "members": []
  },
  {
    "name": "ModelSourceInfo",
    "qualifiedName": "arclm.inference.ModelSourceInfo",
    "importPath": "arclm.inference.ModelSourceInfo",
    "canonicalImport": "from arclm.inference import ModelSourceInfo",
    "alternativeImport": "from arclm import ModelSourceInfo",
    "kind": "class",
    "category": "inference",
    "status": "Beta",
    "signature": "ModelSourceInfo(source: 'str', source_type: 'str' = 'unknown', tokenizer_files_exist: 'bool' = False, adapter_config_exists: 'bool' = False, config_json_exists: 'bool' = False, model_weights_exist: 'bool' = False, detected_checkpoint_folders: 'List[str]' = <factory>, recommended_loading_strategy: 'str' = 'unsupported', warnings: 'List[str]' = <factory>, resolved_source: 'Optional[str]' = None, model_type: 'Optional[str]' = None, weight_format: 'Optional[str]' = None, load_as: 'Optional[str]' = None, base_model_name_or_path: 'Optional[str]' = None) -> None",
    "summary": "Structured inspection result for a model source.",
    "parameters": [
      [
        "source",
        "str",
        "required"
      ],
      [
        "source_type",
        "str",
        "'unknown'"
      ],
      [
        "tokenizer_files_exist",
        "bool",
        "False"
      ],
      [
        "adapter_config_exists",
        "bool",
        "False"
      ],
      [
        "config_json_exists",
        "bool",
        "False"
      ],
      [
        "model_weights_exist",
        "bool",
        "False"
      ],
      [
        "detected_checkpoint_folders",
        "List[str]",
        "<factory>"
      ],
      [
        "recommended_loading_strategy",
        "str",
        "'unsupported'"
      ],
      [
        "warnings",
        "List[str]",
        "<factory>"
      ],
      [
        "resolved_source",
        "Optional[str]",
        "None"
      ],
      [
        "model_type",
        "Optional[str]",
        "None"
      ],
      [
        "weight_format",
        "Optional[str]",
        "None"
      ],
      [
        "load_as",
        "Optional[str]",
        "None"
      ],
      [
        "base_model_name_or_path",
        "Optional[str]",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional Hugging Face stack for external models.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.inference import ModelSourceInfo\n\nprint(ModelSourceInfo)",
    "members": [
      [
        "format_report(self) -> 'str'",
        "Return a compact human-readable inspection report."
      ],
      [
        "to_dict(self) -> 'Dict[str, Any]'",
        "Return a JSON-serializable representation of the inspection result."
      ]
    ]
  },
  {
    "name": "TextGenerator",
    "qualifiedName": "arclm.inference.TextGenerator",
    "importPath": "arclm.inference.TextGenerator",
    "canonicalImport": "from arclm.inference import TextGenerator",
    "alternativeImport": "from arclm import TextGenerator",
    "kind": "class",
    "category": "inference",
    "status": "Beta",
    "signature": "Generator(model, stoi, itos, block_size, device, tokenizer=None)",
    "summary": "Generate tokens from a trained native causal language model.",
    "parameters": [
      [
        "model",
        "Any",
        "required"
      ],
      [
        "stoi",
        "Any",
        "required"
      ],
      [
        "itos",
        "Any",
        "required"
      ],
      [
        "block_size",
        "Any",
        "required"
      ],
      [
        "device",
        "Any",
        "required"
      ],
      [
        "tokenizer",
        "Any",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional Hugging Face stack for external models.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.inference import TextGenerator\n\nprint(TextGenerator)",
    "members": [
      [
        "generate(self, start_text, max_new_tokens=20, temperature=1.0, repetition_penalty=1.0, top_k=None, top_p=None)",
        "Generate tokens from ``start_text`` with the native ArcLM model."
      ],
      [
        "generate_stream(self, start_text, max_new_tokens=20, temperature=1.0, repetition_penalty=1.0, top_k=None, top_p=None, cancel_check=None)",
        "Yield decoded generated token text during native ArcLM inference."
      ],
      [
        "generate_string(self, start_text, max_new_tokens=20, temperature=1.0, repetition_penalty=1.0, top_k=None, top_p=None)",
        "Generate text and return it as a string."
      ]
    ]
  },
  {
    "name": "DEFAULT_MODEL_PATH",
    "qualifiedName": "arclm.inference.DEFAULT_MODEL_PATH",
    "importPath": "arclm.inference.DEFAULT_MODEL_PATH",
    "canonicalImport": "from arclm.inference import DEFAULT_MODEL_PATH",
    "alternativeImport": "from arclm import DEFAULT_MODEL_PATH",
    "kind": "constant",
    "category": "inference",
    "status": "Beta",
    "signature": "DEFAULT_MODEL_PATH",
    "summary": "Path subclass for Windows systems.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional Hugging Face stack for external models.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.inference import DEFAULT_MODEL_PATH\n\nprint(DEFAULT_MODEL_PATH)",
    "members": []
  },
  {
    "name": "continue_native_training",
    "qualifiedName": "arclm.inference.continue_native_training",
    "importPath": "arclm.inference.continue_native_training",
    "canonicalImport": "from arclm.inference import continue_native_training",
    "alternativeImport": "from arclm import continue_native_training",
    "kind": "function",
    "category": "inference",
    "status": "Beta",
    "signature": "continue_native_training(*, data: 'str', output: 'str', checkpoint: 'str', **kwargs: 'Any') -> 'Any'",
    "summary": "Continue native ArcLM training via ``train_model``.",
    "parameters": [
      [
        "data",
        "str",
        "required"
      ],
      [
        "output",
        "str",
        "required"
      ],
      [
        "checkpoint",
        "str",
        "required"
      ],
      [
        "kwargs",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional Hugging Face stack for external models.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.inference import continue_native_training\n\nprint(continue_native_training)",
    "members": []
  },
  {
    "name": "fine_tune_external_model",
    "qualifiedName": "arclm.inference.fine_tune_external_model",
    "importPath": "arclm.inference.fine_tune_external_model",
    "canonicalImport": "from arclm.inference import fine_tune_external_model",
    "alternativeImport": "from arclm import fine_tune_external_model",
    "kind": "function",
    "category": "inference",
    "status": "Beta",
    "signature": "fine_tune_external_model(model: 'str', dataset: 'str', output_dir: 'str', method: 'str' = 'sft', backend: 'str' = 'huggingface', use_lora: 'bool' = True, assistant_only_loss: 'bool' = True, save_config: 'Optional[ModelSaveConfig]' = None, **kwargs: 'Any') -> 'SFTTrainingResult'",
    "summary": "Fine-tune an external model through supported ArcLM training backends.",
    "parameters": [
      [
        "model",
        "str",
        "required"
      ],
      [
        "dataset",
        "str",
        "required"
      ],
      [
        "output_dir",
        "str",
        "required"
      ],
      [
        "method",
        "str",
        "'sft'"
      ],
      [
        "backend",
        "str",
        "'huggingface'"
      ],
      [
        "use_lora",
        "bool",
        "True"
      ],
      [
        "assistant_only_loss",
        "bool",
        "True"
      ],
      [
        "save_config",
        "Optional[ModelSaveConfig]",
        "None"
      ],
      [
        "kwargs",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional Hugging Face stack for external models.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.inference import fine_tune_external_model\n\nprint(fine_tune_external_model)",
    "members": []
  },
  {
    "name": "fine_tune_native_model",
    "qualifiedName": "arclm.inference.fine_tune_native_model",
    "importPath": "arclm.inference.fine_tune_native_model",
    "canonicalImport": "from arclm.inference import fine_tune_native_model",
    "alternativeImport": "from arclm import fine_tune_native_model",
    "kind": "function",
    "category": "inference",
    "status": "Beta",
    "signature": "fine_tune_native_model(*, data: 'str', output: 'str', checkpoint: 'str', **kwargs: 'Any') -> 'Any'",
    "summary": "Fine-tune a native ArcLM checkpoint via ``train_model``.",
    "parameters": [
      [
        "data",
        "str",
        "required"
      ],
      [
        "output",
        "str",
        "required"
      ],
      [
        "checkpoint",
        "str",
        "required"
      ],
      [
        "kwargs",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional Hugging Face stack for external models.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.inference import fine_tune_native_model\n\nprint(fine_tune_native_model)",
    "members": []
  },
  {
    "name": "inspect_model_source",
    "qualifiedName": "arclm.inference.inspect_model_source",
    "importPath": "arclm.inference.inspect_model_source",
    "canonicalImport": "from arclm.inference import inspect_model_source",
    "alternativeImport": "from arclm import inspect_model_source",
    "kind": "function",
    "category": "inference",
    "status": "Beta",
    "signature": "inspect_model_source(source: 'PathLike', **kwargs: 'Any') -> 'ModelSourceInfo'",
    "summary": "Inspect a local path or Hugging Face model ID before loading.",
    "parameters": [
      [
        "source",
        "PathLike",
        "required"
      ],
      [
        "kwargs",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional Hugging Face stack for external models.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.inference import inspect_model_source\n\nprint(inspect_model_source)",
    "members": []
  },
  {
    "name": "load_any_model",
    "qualifiedName": "arclm.inference.load_any_model",
    "importPath": "arclm.inference.load_any_model",
    "canonicalImport": "from arclm.inference import load_any_model",
    "alternativeImport": "from arclm import load_any_model",
    "kind": "function",
    "category": "inference",
    "status": "Beta",
    "signature": "load_any_model(source: 'PathLike', **kwargs: 'Any') -> 'ExternalLoadedModel'",
    "summary": "Load any supported ArcLM or Hugging Face causal LM source for inference.",
    "parameters": [
      [
        "source",
        "PathLike",
        "required"
      ],
      [
        "kwargs",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional Hugging Face stack for external models.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.inference import load_any_model\n\nprint(load_any_model)",
    "members": []
  },
  {
    "name": "load_external_for_inference",
    "qualifiedName": "arclm.inference.load_external_for_inference",
    "importPath": "arclm.inference.load_external_for_inference",
    "canonicalImport": "from arclm.inference import load_external_for_inference",
    "alternativeImport": "from arclm import load_external_for_inference",
    "kind": "function",
    "category": "inference",
    "status": "Beta",
    "signature": "load_external_for_inference(source: 'PathLike', **kwargs: 'Any') -> 'ExternalLoadedModel'",
    "summary": "Backward-friendly alias for :func:`load_any_model`.",
    "parameters": [
      [
        "source",
        "PathLike",
        "required"
      ],
      [
        "kwargs",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional Hugging Face stack for external models.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.inference import load_external_for_inference\n\nprint(load_external_for_inference)",
    "members": []
  },
  {
    "name": "load_model",
    "qualifiedName": "arclm.inference.load_model",
    "importPath": "arclm.inference.load_model",
    "canonicalImport": "from arclm.inference import load_model",
    "alternativeImport": "from arclm import load_model",
    "kind": "function",
    "category": "inference",
    "status": "Beta",
    "signature": "load_model(model_path=None, device=None, prefer_best=True)",
    "summary": "Load a trained ArcLM checkpoint for inference.",
    "parameters": [
      [
        "model_path",
        "Any",
        "None"
      ],
      [
        "device",
        "Any",
        "None"
      ],
      [
        "prefer_best",
        "Any",
        "True"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional Hugging Face stack for external models.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.inference import load_model\n\nprint(load_model)",
    "members": []
  },
  {
    "name": "predict",
    "qualifiedName": "arclm.inference.predict",
    "importPath": "arclm.inference.predict",
    "canonicalImport": "from arclm.inference import predict",
    "alternativeImport": "from arclm import predict",
    "kind": "function",
    "category": "inference",
    "status": "Beta",
    "signature": "predict(input_text, model_path=None, device=None, reload=False, **generation_options)",
    "summary": "Predict with a cached model using the same defaults as load_model().",
    "parameters": [
      [
        "input_text",
        "Any",
        "required"
      ],
      [
        "model_path",
        "Any",
        "None"
      ],
      [
        "device",
        "Any",
        "None"
      ],
      [
        "reload",
        "Any",
        "False"
      ],
      [
        "generation_options",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional Hugging Face stack for external models.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.inference import predict\n\nprint(predict)",
    "members": []
  },
  {
    "name": "predict_external",
    "qualifiedName": "arclm.inference.predict_external",
    "importPath": "arclm.inference.predict_external",
    "canonicalImport": "from arclm.inference import predict_external",
    "alternativeImport": "from arclm import predict_external",
    "kind": "function",
    "category": "inference",
    "status": "Beta",
    "signature": "predict_external(source: 'PathLike', prompt: 'str', **kwargs: 'Any') -> 'str'",
    "summary": "Load a source and return a single prediction.",
    "parameters": [
      [
        "source",
        "PathLike",
        "required"
      ],
      [
        "prompt",
        "str",
        "required"
      ],
      [
        "kwargs",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional Hugging Face stack for external models.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.inference import predict_external\n\nprint(predict_external)",
    "members": []
  },
  {
    "name": "save_loaded_model",
    "qualifiedName": "arclm.inference.save_loaded_model",
    "importPath": "arclm.inference.save_loaded_model",
    "canonicalImport": "from arclm.inference import save_loaded_model",
    "alternativeImport": "from arclm import save_loaded_model",
    "kind": "function",
    "category": "inference",
    "status": "Beta",
    "signature": "save_loaded_model(loaded_model: 'ExternalLoadedModel', output_dir: 'PathLike', save_config: 'Optional[ModelSaveConfig]' = None) -> 'Optional[Path]'",
    "summary": "Save a loaded model according to :class:`ModelSaveConfig`.",
    "parameters": [
      [
        "loaded_model",
        "ExternalLoadedModel",
        "required"
      ],
      [
        "output_dir",
        "PathLike",
        "required"
      ],
      [
        "save_config",
        "Optional[ModelSaveConfig]",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional Hugging Face stack for external models.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.inference import save_loaded_model\n\nprint(save_loaded_model)",
    "members": []
  },
  {
    "name": "train_native_model",
    "qualifiedName": "arclm.inference.train_native_model",
    "importPath": "arclm.inference.train_native_model",
    "canonicalImport": "from arclm.inference import train_native_model",
    "alternativeImport": "from arclm import train_native_model",
    "kind": "function",
    "category": "inference",
    "status": "Beta",
    "signature": "train_native_model(*, data: 'str', output: 'str', **kwargs: 'Any') -> 'Any'",
    "summary": "Train a native ArcLM model by delegating to ``train_model(mode='pretrain')``.",
    "parameters": [
      [
        "data",
        "str",
        "required"
      ],
      [
        "output",
        "str",
        "required"
      ],
      [
        "kwargs",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "Optional Hugging Face stack for external models.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.inference import train_native_model\n\nprint(train_native_model)",
    "members": []
  },
  {
    "name": "PipelineTrace",
    "qualifiedName": "arclm.inspection.PipelineTrace",
    "importPath": "arclm.inspection.PipelineTrace",
    "canonicalImport": "from arclm.inspection import PipelineTrace",
    "alternativeImport": "from arclm import PipelineTrace",
    "kind": "class",
    "category": "inspection",
    "status": "Beta",
    "signature": "PipelineTrace(input_text: 'str', tokens: 'list[str]', token_ids: 'list[int]', sequence_length: 'int', input_shape: 'list[int]', embedding_shape: 'list[int]', logits_shape: 'list[int]', selected_token_id: 'int', selected_token: 'str', generated_text: 'str', device: 'str', dtype: 'str', model_class: 'str', tokenizer_class: 'str', inspected_steps: 'int' = 1, generation_steps: 'int' = 1, attention_available: 'bool' = False, attention_note: 'str' = 'Attention tensor capture is planned for a later inspection version.', warnings: 'list[str]' = <factory>, values: 'dict[str, list[float | int]] | None' = None) -> None",
    "summary": "JSON-safe summary of one inspected native ArcLM generation step.",
    "parameters": [
      [
        "input_text",
        "str",
        "required"
      ],
      [
        "tokens",
        "list[str]",
        "required"
      ],
      [
        "token_ids",
        "list[int]",
        "required"
      ],
      [
        "sequence_length",
        "int",
        "required"
      ],
      [
        "input_shape",
        "list[int]",
        "required"
      ],
      [
        "embedding_shape",
        "list[int]",
        "required"
      ],
      [
        "logits_shape",
        "list[int]",
        "required"
      ],
      [
        "selected_token_id",
        "int",
        "required"
      ],
      [
        "selected_token",
        "str",
        "required"
      ],
      [
        "generated_text",
        "str",
        "required"
      ],
      [
        "device",
        "str",
        "required"
      ],
      [
        "dtype",
        "str",
        "required"
      ],
      [
        "model_class",
        "str",
        "required"
      ],
      [
        "tokenizer_class",
        "str",
        "required"
      ],
      [
        "inspected_steps",
        "int",
        "1"
      ],
      [
        "generation_steps",
        "int",
        "1"
      ],
      [
        "attention_available",
        "bool",
        "False"
      ],
      [
        "attention_note",
        "str",
        "'Attention tensor capture is planned for a later inspection version.'"
      ],
      [
        "warnings",
        "list[str]",
        "<factory>"
      ],
      [
        "values",
        "dict[str, list[float | int]] | None",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.inspection import PipelineTrace\n\nprint(PipelineTrace)",
    "members": [
      [
        "summary(self) -> 'str'",
        "Return a compact human-readable trace."
      ],
      [
        "to_dict(self) -> 'dict[str, Any]'",
        "Return a JSON-safe dictionary representation."
      ],
      [
        "to_json(self, **kwargs: 'Any') -> 'str'",
        "Return the trace as JSON using only the standard library."
      ]
    ]
  },
  {
    "name": "inspect_text",
    "qualifiedName": "arclm.inspection.inspect_text",
    "importPath": "arclm.inspection.inspect_text",
    "canonicalImport": "from arclm.inspection import inspect_text",
    "alternativeImport": "from arclm import inspect_text",
    "kind": "function",
    "category": "inspection",
    "status": "Beta",
    "signature": "inspect_text(*, model: 'Any', tokenizer: 'Any', text: 'str', max_new_tokens: 'int' = 1, temperature: 'float' = 1.0, repetition_penalty: 'float' = 1.0, top_k: 'int | None' = None, top_p: 'float | None' = None, include_values: 'bool' = False, max_values: 'int' = 20) -> 'PipelineTrace'",
    "summary": "Inspect one native ArcLM text-generation step.",
    "parameters": [
      [
        "model",
        "Any",
        "required"
      ],
      [
        "tokenizer",
        "Any",
        "required"
      ],
      [
        "text",
        "str",
        "required"
      ],
      [
        "max_new_tokens",
        "int",
        "1"
      ],
      [
        "temperature",
        "float",
        "1.0"
      ],
      [
        "repetition_penalty",
        "float",
        "1.0"
      ],
      [
        "top_k",
        "int | None",
        "None"
      ],
      [
        "top_p",
        "float | None",
        "None"
      ],
      [
        "include_values",
        "bool",
        "False"
      ],
      [
        "max_values",
        "int",
        "20"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.inspection import inspect_text\n\nprint(inspect_text)",
    "members": []
  },
  {
    "name": "ArcLM",
    "qualifiedName": "arclm.models.ArcLM",
    "importPath": "arclm.models.ArcLM",
    "canonicalImport": "from arclm.models import ArcLM",
    "alternativeImport": "from arclm import ArcLM",
    "kind": "class",
    "category": "models",
    "status": "Stable",
    "signature": "ArcLM(vocab_size, embed_dim=64, block_size=8, num_blocks=2, dropout=0.0)",
    "summary": "Compact causal language model for next-token prediction.",
    "parameters": [
      [
        "vocab_size",
        "Any",
        "required"
      ],
      [
        "embed_dim",
        "Any",
        "64"
      ],
      [
        "block_size",
        "Any",
        "8"
      ],
      [
        "num_blocks",
        "Any",
        "2"
      ],
      [
        "dropout",
        "Any",
        "0.0"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.models import ArcLM\n\nprint(ArcLM)",
    "members": [
      [
        "add_module(self, name: str, module: Optional[ForwardRef('Module')]) -> None",
        "Add a child module to the current module."
      ],
      [
        "apply(self, fn: collections.abc.Callable[['Module'], None]) -> Self",
        "Apply ``fn`` recursively to every submodule (as returned by ``.children()``) as well as self."
      ],
      [
        "bfloat16(self) -> Self",
        "Casts all floating point parameters and buffers to ``bfloat16`` datatype."
      ],
      [
        "buffers(self, recurse: bool = True) -> collections.abc.Iterator[torch.Tensor]",
        "Return an iterator over module buffers."
      ],
      [
        "children(self) -> collections.abc.Iterator['Module']",
        "Return an iterator over immediate children modules."
      ],
      [
        "compile(self, *args, **kwargs) -> None",
        "Compile this Module's forward using :func:`torch.compile`."
      ],
      [
        "cpu(self) -> Self",
        "Move all model parameters and buffers to the CPU."
      ],
      [
        "cuda(self, device: int | torch.device | None = None) -> Self",
        "Move all model parameters and buffers to the GPU."
      ],
      [
        "double(self) -> Self",
        "Casts all floating point parameters and buffers to ``double`` datatype."
      ],
      [
        "eval(self) -> Self",
        "Set the module in evaluation mode."
      ],
      [
        "extra_repr(self) -> str",
        "Return the extra representation of the module."
      ],
      [
        "float(self) -> Self",
        "Casts all floating point parameters and buffers to ``float`` datatype."
      ]
    ]
  },
  {
    "name": "AutoModel",
    "qualifiedName": "arclm.models.AutoModel",
    "importPath": "arclm.models.AutoModel",
    "canonicalImport": "from arclm.models import AutoModel",
    "alternativeImport": "from arclm import AutoModel",
    "kind": "class",
    "category": "models",
    "status": "Stable",
    "signature": "AutoModel()",
    "summary": "Factory for ArcLM model classes supported by the current package.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.models import AutoModel\n\nprint(AutoModel)",
    "members": [
      [
        "from_config(config)",
        "Build the native causal language model from a Config-like object."
      ],
      [
        "from_name(name: 'str', **kwargs)",
        "Build a supported model by name."
      ]
    ]
  },
  {
    "name": "GPTBlock",
    "qualifiedName": "arclm.models.GPTBlock",
    "importPath": "arclm.models.GPTBlock",
    "canonicalImport": "from arclm.models import GPTBlock",
    "alternativeImport": "",
    "kind": "class",
    "category": "models",
    "status": "Stable",
    "signature": "GPTBlock(embed_dim, dropout=0.0)",
    "summary": "Transformer blok met self-attention en feed-forward lagen.",
    "parameters": [
      [
        "embed_dim",
        "Any",
        "required"
      ],
      [
        "dropout",
        "Any",
        "0.0"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.models import GPTBlock\n\nprint(GPTBlock)",
    "members": [
      [
        "add_module(self, name: str, module: Optional[ForwardRef('Module')]) -> None",
        "Add a child module to the current module."
      ],
      [
        "apply(self, fn: collections.abc.Callable[['Module'], None]) -> Self",
        "Apply ``fn`` recursively to every submodule (as returned by ``.children()``) as well as self."
      ],
      [
        "bfloat16(self) -> Self",
        "Casts all floating point parameters and buffers to ``bfloat16`` datatype."
      ],
      [
        "buffers(self, recurse: bool = True) -> collections.abc.Iterator[torch.Tensor]",
        "Return an iterator over module buffers."
      ],
      [
        "children(self) -> collections.abc.Iterator['Module']",
        "Return an iterator over immediate children modules."
      ],
      [
        "compile(self, *args, **kwargs) -> None",
        "Compile this Module's forward using :func:`torch.compile`."
      ],
      [
        "cpu(self) -> Self",
        "Move all model parameters and buffers to the CPU."
      ],
      [
        "cuda(self, device: int | torch.device | None = None) -> Self",
        "Move all model parameters and buffers to the GPU."
      ],
      [
        "double(self) -> Self",
        "Casts all floating point parameters and buffers to ``double`` datatype."
      ],
      [
        "eval(self) -> Self",
        "Set the module in evaluation mode."
      ],
      [
        "extra_repr(self) -> str",
        "Return the extra representation of the module."
      ],
      [
        "float(self) -> Self",
        "Casts all floating point parameters and buffers to ``float`` datatype."
      ]
    ]
  },
  {
    "name": "MiniGPT",
    "qualifiedName": "arclm.models.MiniGPT",
    "importPath": "arclm.models.MiniGPT",
    "canonicalImport": "from arclm.models import MiniGPT",
    "alternativeImport": "from arclm import MiniGPT",
    "kind": "class",
    "category": "models",
    "status": "Deprecated",
    "signature": "ArcLM(vocab_size, embed_dim=64, block_size=8, num_blocks=2, dropout=0.0)",
    "summary": "Compact causal language model for next-token prediction.",
    "parameters": [
      [
        "vocab_size",
        "Any",
        "required"
      ],
      [
        "embed_dim",
        "Any",
        "64"
      ],
      [
        "block_size",
        "Any",
        "8"
      ],
      [
        "num_blocks",
        "Any",
        "2"
      ],
      [
        "dropout",
        "Any",
        "0.0"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.models import MiniGPT\n\nprint(MiniGPT)",
    "members": [
      [
        "add_module(self, name: str, module: Optional[ForwardRef('Module')]) -> None",
        "Add a child module to the current module."
      ],
      [
        "apply(self, fn: collections.abc.Callable[['Module'], None]) -> Self",
        "Apply ``fn`` recursively to every submodule (as returned by ``.children()``) as well as self."
      ],
      [
        "bfloat16(self) -> Self",
        "Casts all floating point parameters and buffers to ``bfloat16`` datatype."
      ],
      [
        "buffers(self, recurse: bool = True) -> collections.abc.Iterator[torch.Tensor]",
        "Return an iterator over module buffers."
      ],
      [
        "children(self) -> collections.abc.Iterator['Module']",
        "Return an iterator over immediate children modules."
      ],
      [
        "compile(self, *args, **kwargs) -> None",
        "Compile this Module's forward using :func:`torch.compile`."
      ],
      [
        "cpu(self) -> Self",
        "Move all model parameters and buffers to the CPU."
      ],
      [
        "cuda(self, device: int | torch.device | None = None) -> Self",
        "Move all model parameters and buffers to the GPU."
      ],
      [
        "double(self) -> Self",
        "Casts all floating point parameters and buffers to ``double`` datatype."
      ],
      [
        "eval(self) -> Self",
        "Set the module in evaluation mode."
      ],
      [
        "extra_repr(self) -> str",
        "Return the extra representation of the module."
      ],
      [
        "float(self) -> Self",
        "Casts all floating point parameters and buffers to ``float`` datatype."
      ]
    ]
  },
  {
    "name": "ModelCapabilityReport",
    "qualifiedName": "arclm.models.ModelCapabilityReport",
    "importPath": "arclm.models.ModelCapabilityReport",
    "canonicalImport": "from arclm.models import ModelCapabilityReport",
    "alternativeImport": "from arclm import ModelCapabilityReport",
    "kind": "class",
    "category": "models",
    "status": "Stable",
    "signature": "ModelCapabilityReport(model_source: 'str', model_family: 'str', exact_model: 'str', task: 'str', status: 'CapabilityStatus', can_forward: 'bool', can_generate: 'bool', can_train: 'bool', can_full_finetune: 'bool', can_sft: 'bool', can_lora: 'bool', can_save_reload: 'bool', supports_cpu: 'bool', supports_cuda: 'bool', supports_quantization: 'bool', supports_structured_output: 'bool', validated_operations: 'tuple[str, ...]' = <factory>, unvalidated_operations: 'tuple[str, ...]' = <factory>, limitations: 'tuple[str, ...]' = <factory>, operations: 'dict[str, OperationStatus]' = <factory>) -> None",
    "summary": "Describes supported operations for one exact model path.",
    "parameters": [
      [
        "model_source",
        "str",
        "required"
      ],
      [
        "model_family",
        "str",
        "required"
      ],
      [
        "exact_model",
        "str",
        "required"
      ],
      [
        "task",
        "str",
        "required"
      ],
      [
        "status",
        "CapabilityStatus",
        "required"
      ],
      [
        "can_forward",
        "bool",
        "required"
      ],
      [
        "can_generate",
        "bool",
        "required"
      ],
      [
        "can_train",
        "bool",
        "required"
      ],
      [
        "can_full_finetune",
        "bool",
        "required"
      ],
      [
        "can_sft",
        "bool",
        "required"
      ],
      [
        "can_lora",
        "bool",
        "required"
      ],
      [
        "can_save_reload",
        "bool",
        "required"
      ],
      [
        "supports_cpu",
        "bool",
        "required"
      ],
      [
        "supports_cuda",
        "bool",
        "required"
      ],
      [
        "supports_quantization",
        "bool",
        "required"
      ],
      [
        "supports_structured_output",
        "bool",
        "required"
      ],
      [
        "validated_operations",
        "tuple[str, ...]",
        "<factory>"
      ],
      [
        "unvalidated_operations",
        "tuple[str, ...]",
        "<factory>"
      ],
      [
        "limitations",
        "tuple[str, ...]",
        "<factory>"
      ],
      [
        "operations",
        "dict[str, OperationStatus]",
        "<factory>"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.models import ModelCapabilityReport\n\nprint(ModelCapabilityReport)",
    "members": [
      [
        "to_dict(self) -> 'dict[str, object]'",
        "Return a JSON-safe representation."
      ]
    ]
  },
  {
    "name": "SelfAttention",
    "qualifiedName": "arclm.models.SelfAttention",
    "importPath": "arclm.models.SelfAttention",
    "canonicalImport": "from arclm.models import SelfAttention",
    "alternativeImport": "",
    "kind": "class",
    "category": "models",
    "status": "Stable",
    "signature": "SelfAttention(embed_dim, dropout=0.0)",
    "summary": "Self-attention laag die tokens naar eerdere tokens laat kijken.",
    "parameters": [
      [
        "embed_dim",
        "Any",
        "required"
      ],
      [
        "dropout",
        "Any",
        "0.0"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.models import SelfAttention\n\nprint(SelfAttention)",
    "members": [
      [
        "add_module(self, name: str, module: Optional[ForwardRef('Module')]) -> None",
        "Add a child module to the current module."
      ],
      [
        "apply(self, fn: collections.abc.Callable[['Module'], None]) -> Self",
        "Apply ``fn`` recursively to every submodule (as returned by ``.children()``) as well as self."
      ],
      [
        "bfloat16(self) -> Self",
        "Casts all floating point parameters and buffers to ``bfloat16`` datatype."
      ],
      [
        "buffers(self, recurse: bool = True) -> collections.abc.Iterator[torch.Tensor]",
        "Return an iterator over module buffers."
      ],
      [
        "children(self) -> collections.abc.Iterator['Module']",
        "Return an iterator over immediate children modules."
      ],
      [
        "compile(self, *args, **kwargs) -> None",
        "Compile this Module's forward using :func:`torch.compile`."
      ],
      [
        "cpu(self) -> Self",
        "Move all model parameters and buffers to the CPU."
      ],
      [
        "cuda(self, device: int | torch.device | None = None) -> Self",
        "Move all model parameters and buffers to the GPU."
      ],
      [
        "double(self) -> Self",
        "Casts all floating point parameters and buffers to ``double`` datatype."
      ],
      [
        "eval(self) -> Self",
        "Set the module in evaluation mode."
      ],
      [
        "extra_repr(self) -> str",
        "Return the extra representation of the module."
      ],
      [
        "float(self) -> Self",
        "Casts all floating point parameters and buffers to ``float`` datatype."
      ]
    ]
  },
  {
    "name": "get_model_capability",
    "qualifiedName": "arclm.models.get_model_capability",
    "importPath": "arclm.models.get_model_capability",
    "canonicalImport": "from arclm.models import get_model_capability",
    "alternativeImport": "from arclm import get_model_capability",
    "kind": "function",
    "category": "models",
    "status": "Stable",
    "signature": "get_model_capability(model: 'str') -> 'ModelCapabilityReport'",
    "summary": "Return the capability report for a known exact model path.",
    "parameters": [
      [
        "model",
        "str",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.models import get_model_capability\n\nprint(get_model_capability)",
    "members": []
  },
  {
    "name": "model_support_matrix",
    "qualifiedName": "arclm.models.model_support_matrix",
    "importPath": "arclm.models.model_support_matrix",
    "canonicalImport": "from arclm.models import model_support_matrix",
    "alternativeImport": "from arclm import model_support_matrix",
    "kind": "function",
    "category": "models",
    "status": "Stable",
    "signature": "model_support_matrix() -> 'list[dict[str, object]]'",
    "summary": "Return the compact support matrix for the official 0.8 model set.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.models import model_support_matrix\n\nprint(model_support_matrix)",
    "members": []
  },
  {
    "name": "LoRAConfig",
    "qualifiedName": "arclm.peft.LoRAConfig",
    "importPath": "arclm.peft.LoRAConfig",
    "canonicalImport": "from arclm.peft import LoRAConfig",
    "alternativeImport": "",
    "kind": "class",
    "category": "peft",
    "status": "Experimental",
    "signature": "LoRAConfig(method: 'PeftMethod' = <PeftMethod.LORA: 'lora'>, enabled: 'bool' = True, config_version: 'int' = 1, rank: 'int' = 4, alpha: 'float' = 8.0, dropout: 'float' = 0.0, target_modules: 'tuple[str, ...]' = <factory>, target_match: 'str' = 'suffix', bias: 'str' = 'none', init: 'str' = 'kaiming_uniform', freeze_base_model: 'bool' = True) -> None",
    "summary": "Configuratie voor ArcLM LoRA adapters.",
    "parameters": [
      [
        "method",
        "PeftMethod",
        "<PeftMethod.LORA: 'lora'>"
      ],
      [
        "enabled",
        "bool",
        "True"
      ],
      [
        "config_version",
        "int",
        "1"
      ],
      [
        "rank",
        "int",
        "4"
      ],
      [
        "alpha",
        "float",
        "8.0"
      ],
      [
        "dropout",
        "float",
        "0.0"
      ],
      [
        "target_modules",
        "tuple[str, ...]",
        "<factory>"
      ],
      [
        "target_match",
        "str",
        "'suffix'"
      ],
      [
        "bias",
        "str",
        "'none'"
      ],
      [
        "init",
        "str",
        "'kaiming_uniform'"
      ],
      [
        "freeze_base_model",
        "bool",
        "True"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "peft, transformers, bitsandbytes for QLoRA paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.peft import LoRAConfig\n\nprint(LoRAConfig)",
    "members": [
      [
        "from_dict(values: 'Mapping[str, Any]') -> \"'LoRAConfig'\"",
        "Leest een LoRAConfig uit veilige manifestdata."
      ],
      [
        "to_dict(self) -> 'dict[str, Any]'",
        "Geeft JSON-vriendelijke configdata terug."
      ],
      [
        "validate(self) -> 'None'",
        "Controleert LoRA-waarden voordat we het model muteren."
      ]
    ]
  },
  {
    "name": "LoRALinear",
    "qualifiedName": "arclm.peft.LoRALinear",
    "importPath": "arclm.peft.LoRALinear",
    "canonicalImport": "from arclm.peft import LoRALinear",
    "alternativeImport": "",
    "kind": "class",
    "category": "peft",
    "status": "Experimental",
    "signature": "LoRALinear(base: 'nn.Linear', config: 'LoRAConfig')",
    "summary": "Lineaire laag met trainbare LoRA matrices bovenop een bevroren basislaag.",
    "parameters": [
      [
        "base",
        "nn.Linear",
        "required"
      ],
      [
        "config",
        "LoRAConfig",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "peft, transformers, bitsandbytes for QLoRA paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.peft import LoRALinear\n\nprint(LoRALinear)",
    "members": [
      [
        "add_module(self, name: str, module: Optional[ForwardRef('Module')]) -> None",
        "Add a child module to the current module."
      ],
      [
        "apply(self, fn: collections.abc.Callable[['Module'], None]) -> Self",
        "Apply ``fn`` recursively to every submodule (as returned by ``.children()``) as well as self."
      ],
      [
        "bfloat16(self) -> Self",
        "Casts all floating point parameters and buffers to ``bfloat16`` datatype."
      ],
      [
        "buffers(self, recurse: bool = True) -> collections.abc.Iterator[torch.Tensor]",
        "Return an iterator over module buffers."
      ],
      [
        "children(self) -> collections.abc.Iterator['Module']",
        "Return an iterator over immediate children modules."
      ],
      [
        "compile(self, *args, **kwargs) -> None",
        "Compile this Module's forward using :func:`torch.compile`."
      ],
      [
        "cpu(self) -> Self",
        "Move all model parameters and buffers to the CPU."
      ],
      [
        "cuda(self, device: int | torch.device | None = None) -> Self",
        "Move all model parameters and buffers to the GPU."
      ],
      [
        "double(self) -> Self",
        "Casts all floating point parameters and buffers to ``double`` datatype."
      ],
      [
        "eval(self) -> Self",
        "Set the module in evaluation mode."
      ],
      [
        "extra_repr(self) -> str",
        "Return the extra representation of the module."
      ],
      [
        "float(self) -> Self",
        "Casts all floating point parameters and buffers to ``float`` datatype."
      ]
    ]
  },
  {
    "name": "PeftAdapterInfo",
    "qualifiedName": "arclm.peft.PeftAdapterInfo",
    "importPath": "arclm.peft.PeftAdapterInfo",
    "canonicalImport": "from arclm.peft import PeftAdapterInfo",
    "alternativeImport": "",
    "kind": "class",
    "category": "peft",
    "status": "Experimental",
    "signature": "PeftAdapterInfo(adapter_id: 'str', artifact_format: 'str', artifact_version: 'int', method: 'str', target_modules: 'tuple[str, ...]', adapted_modules: 'tuple[str, ...]', base_model_fingerprint: 'str | None', file_count: 'int', total_size_bytes: 'int', integrity_verified: 'bool | None', created_at: 'str', arclm_version: 'str | None', pytorch_version: 'str | None', quantization_backend: 'str | None' = None) -> None",
    "summary": "Inspectie-info zonder adaptergewichten te laden in een model.",
    "parameters": [
      [
        "adapter_id",
        "str",
        "required"
      ],
      [
        "artifact_format",
        "str",
        "required"
      ],
      [
        "artifact_version",
        "int",
        "required"
      ],
      [
        "method",
        "str",
        "required"
      ],
      [
        "target_modules",
        "tuple[str, ...]",
        "required"
      ],
      [
        "adapted_modules",
        "tuple[str, ...]",
        "required"
      ],
      [
        "base_model_fingerprint",
        "str | None",
        "required"
      ],
      [
        "file_count",
        "int",
        "required"
      ],
      [
        "total_size_bytes",
        "int",
        "required"
      ],
      [
        "integrity_verified",
        "bool | None",
        "required"
      ],
      [
        "created_at",
        "str",
        "required"
      ],
      [
        "arclm_version",
        "str | None",
        "required"
      ],
      [
        "pytorch_version",
        "str | None",
        "required"
      ],
      [
        "quantization_backend",
        "str | None",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "peft, transformers, bitsandbytes for QLoRA paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.peft import PeftAdapterInfo\n\nprint(PeftAdapterInfo)",
    "members": [
      [
        "to_dict(self) -> 'dict[str, Any]'",
        "Geeft inspectie-info als dict terug."
      ]
    ]
  },
  {
    "name": "PeftAdapterManifest",
    "qualifiedName": "arclm.peft.PeftAdapterManifest",
    "importPath": "arclm.peft.PeftAdapterManifest",
    "canonicalImport": "from arclm.peft import PeftAdapterManifest",
    "alternativeImport": "",
    "kind": "class",
    "category": "peft",
    "status": "Experimental",
    "signature": "PeftAdapterManifest(artifact_format: 'str', artifact_version: 'int', adapter_id: 'str', created_at: 'str', created_with: 'dict[str, Any]', method: 'str', config: 'dict[str, Any]', base_model: 'dict[str, Any]', adapted_modules: 'tuple[str, ...]', parameter_report: 'dict[str, Any]', files: 'list[AdapterArtifactFile]' = <factory>, metadata: 'dict[str, Any]' = <factory>) -> None",
    "summary": "Manifest voor een ArcLM PEFT adapter.",
    "parameters": [
      [
        "artifact_format",
        "str",
        "required"
      ],
      [
        "artifact_version",
        "int",
        "required"
      ],
      [
        "adapter_id",
        "str",
        "required"
      ],
      [
        "created_at",
        "str",
        "required"
      ],
      [
        "created_with",
        "dict[str, Any]",
        "required"
      ],
      [
        "method",
        "str",
        "required"
      ],
      [
        "config",
        "dict[str, Any]",
        "required"
      ],
      [
        "base_model",
        "dict[str, Any]",
        "required"
      ],
      [
        "adapted_modules",
        "tuple[str, ...]",
        "required"
      ],
      [
        "parameter_report",
        "dict[str, Any]",
        "required"
      ],
      [
        "files",
        "list[AdapterArtifactFile]",
        "<factory>"
      ],
      [
        "metadata",
        "dict[str, Any]",
        "<factory>"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "peft, transformers, bitsandbytes for QLoRA paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.peft import PeftAdapterManifest\n\nprint(PeftAdapterManifest)",
    "members": [
      [
        "from_dict(values: 'Mapping[str, Any]') -> \"'PeftAdapterManifest'\"",
        "Valideert en maakt een manifest."
      ],
      [
        "to_dict(self) -> 'dict[str, Any]'",
        "Geeft JSON-vriendelijke manifestdata terug."
      ]
    ]
  },
  {
    "name": "PeftApplicationResult",
    "qualifiedName": "arclm.peft.PeftApplicationResult",
    "importPath": "arclm.peft.PeftApplicationResult",
    "canonicalImport": "from arclm.peft import PeftApplicationResult",
    "alternativeImport": "",
    "kind": "class",
    "category": "peft",
    "status": "Experimental",
    "signature": "PeftApplicationResult(method: 'str', adapted_modules: 'tuple[str, ...]', config: 'dict[str, Any]', parameter_report: 'PeftParameterReport', base_model_fingerprint: 'str', merged: 'bool' = False) -> None",
    "summary": "Resultaat van een PEFT-injectie.",
    "parameters": [
      [
        "method",
        "str",
        "required"
      ],
      [
        "adapted_modules",
        "tuple[str, ...]",
        "required"
      ],
      [
        "config",
        "dict[str, Any]",
        "required"
      ],
      [
        "parameter_report",
        "PeftParameterReport",
        "required"
      ],
      [
        "base_model_fingerprint",
        "str",
        "required"
      ],
      [
        "merged",
        "bool",
        "False"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "peft, transformers, bitsandbytes for QLoRA paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.peft import PeftApplicationResult\n\nprint(PeftApplicationResult)",
    "members": [
      [
        "to_dict(self) -> 'dict[str, Any]'",
        "Geeft veilige metadata terug."
      ]
    ]
  },
  {
    "name": "PeftConfig",
    "qualifiedName": "arclm.peft.PeftConfig",
    "importPath": "arclm.peft.PeftConfig",
    "canonicalImport": "from arclm.peft import PeftConfig",
    "alternativeImport": "",
    "kind": "class",
    "category": "peft",
    "status": "Experimental",
    "signature": "PeftConfig(method: 'PeftMethod' = <PeftMethod.NONE: 'none'>, enabled: 'bool' = True, config_version: 'int' = 1) -> None",
    "summary": "Kleine basisconfig voor PEFT.",
    "parameters": [
      [
        "method",
        "PeftMethod",
        "<PeftMethod.NONE: 'none'>"
      ],
      [
        "enabled",
        "bool",
        "True"
      ],
      [
        "config_version",
        "int",
        "1"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "peft, transformers, bitsandbytes for QLoRA paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.peft import PeftConfig\n\nprint(PeftConfig)",
    "members": [
      [
        "to_dict(self) -> 'dict[str, Any]'",
        "Geeft JSON-vriendelijke configdata terug."
      ],
      [
        "validate(self) -> 'None'",
        "Controleert de gedeelde PEFT-velden."
      ]
    ]
  },
  {
    "name": "PeftMethod",
    "qualifiedName": "arclm.peft.PeftMethod",
    "importPath": "arclm.peft.PeftMethod",
    "canonicalImport": "from arclm.peft import PeftMethod",
    "alternativeImport": "",
    "kind": "class",
    "category": "peft",
    "status": "Experimental",
    "signature": "PeftMethod(*values)",
    "summary": "Bekende PEFT-methodes.",
    "parameters": [
      [
        "values",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "peft, transformers, bitsandbytes for QLoRA paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.peft import PeftMethod\n\nprint(PeftMethod)",
    "members": []
  },
  {
    "name": "PeftParameterReport",
    "qualifiedName": "arclm.peft.PeftParameterReport",
    "importPath": "arclm.peft.PeftParameterReport",
    "canonicalImport": "from arclm.peft import PeftParameterReport",
    "alternativeImport": "",
    "kind": "class",
    "category": "peft",
    "status": "Experimental",
    "signature": "PeftParameterReport(total_parameters: 'int', trainable_parameters: 'int', frozen_parameters: 'int', trainable_percentage: 'float', adapted_module_count: 'int', trainable_parameter_names: 'tuple[str, ...]' = <factory>) -> None",
    "summary": "Samenvatting van trainbare en bevroren parameters.",
    "parameters": [
      [
        "total_parameters",
        "int",
        "required"
      ],
      [
        "trainable_parameters",
        "int",
        "required"
      ],
      [
        "frozen_parameters",
        "int",
        "required"
      ],
      [
        "trainable_percentage",
        "float",
        "required"
      ],
      [
        "adapted_module_count",
        "int",
        "required"
      ],
      [
        "trainable_parameter_names",
        "tuple[str, ...]",
        "<factory>"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "peft, transformers, bitsandbytes for QLoRA paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.peft import PeftParameterReport\n\nprint(PeftParameterReport)",
    "members": [
      [
        "to_dict(self) -> 'dict[str, Any]'",
        "Geeft JSON-vriendelijke parameterdata terug."
      ]
    ]
  },
  {
    "name": "PeftTarget",
    "qualifiedName": "arclm.peft.PeftTarget",
    "importPath": "arclm.peft.PeftTarget",
    "canonicalImport": "from arclm.peft import PeftTarget",
    "alternativeImport": "",
    "kind": "class",
    "category": "peft",
    "status": "Experimental",
    "signature": "PeftTarget(path: 'str', module_type: 'str', in_features: 'int', out_features: 'int', parameters: 'int') -> None",
    "summary": "Een lineaire laag die LoRA kan krijgen.",
    "parameters": [
      [
        "path",
        "str",
        "required"
      ],
      [
        "module_type",
        "str",
        "required"
      ],
      [
        "in_features",
        "int",
        "required"
      ],
      [
        "out_features",
        "int",
        "required"
      ],
      [
        "parameters",
        "int",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "peft, transformers, bitsandbytes for QLoRA paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.peft import PeftTarget\n\nprint(PeftTarget)",
    "members": [
      [
        "to_dict(self) -> 'dict[str, Any]'",
        "Geeft JSON-vriendelijke targetdata terug."
      ]
    ]
  },
  {
    "name": "QLoRAConfig",
    "qualifiedName": "arclm.peft.QLoRAConfig",
    "importPath": "arclm.peft.QLoRAConfig",
    "canonicalImport": "from arclm.peft import QLoRAConfig",
    "alternativeImport": "",
    "kind": "class",
    "category": "peft",
    "status": "Experimental",
    "signature": "QLoRAConfig(method: 'PeftMethod' = <PeftMethod.QLORA: 'qlora'>, enabled: 'bool' = True, config_version: 'int' = 1, quantization: 'QuantizationConfig' = <factory>, lora: 'LoRAConfig' = <factory>, adapter_dtype: 'QuantizedComputeDType' = <QuantizedComputeDType.FP32: 'fp32'>) -> None",
    "summary": "Configuratie voor QLoRA: 4-bit basis plus LoRA adapters.",
    "parameters": [
      [
        "method",
        "PeftMethod",
        "<PeftMethod.QLORA: 'qlora'>"
      ],
      [
        "enabled",
        "bool",
        "True"
      ],
      [
        "config_version",
        "int",
        "1"
      ],
      [
        "quantization",
        "QuantizationConfig",
        "<factory>"
      ],
      [
        "lora",
        "LoRAConfig",
        "<factory>"
      ],
      [
        "adapter_dtype",
        "QuantizedComputeDType",
        "<QuantizedComputeDType.FP32: 'fp32'>"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "peft, transformers, bitsandbytes for QLoRA paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.peft import QLoRAConfig\n\nprint(QLoRAConfig)",
    "members": [
      [
        "from_dict(values: 'Mapping[str, Any]') -> \"'QLoRAConfig'\"",
        "Leest QLoRA-config uit veilige manifestdata."
      ],
      [
        "to_dict(self) -> 'dict[str, Any]'",
        "Geeft JSON-veilige QLoRA-config terug."
      ],
      [
        "validate(self) -> 'None'",
        "Controleert QLoRA zonder een model of backend te laden."
      ]
    ]
  },
  {
    "name": "QuantizationBackend",
    "qualifiedName": "arclm.peft.QuantizationBackend",
    "importPath": "arclm.peft.QuantizationBackend",
    "canonicalImport": "from arclm.peft import QuantizationBackend",
    "alternativeImport": "",
    "kind": "class",
    "category": "peft",
    "status": "Experimental",
    "signature": "QuantizationBackend(*values)",
    "summary": "Bekende quantization backends voor fine-tuning.",
    "parameters": [
      [
        "values",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "peft, transformers, bitsandbytes for QLoRA paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.peft import QuantizationBackend\n\nprint(QuantizationBackend)",
    "members": []
  },
  {
    "name": "QuantizationCapabilityReport",
    "qualifiedName": "arclm.peft.QuantizationCapabilityReport",
    "importPath": "arclm.peft.QuantizationCapabilityReport",
    "canonicalImport": "from arclm.peft import QuantizationCapabilityReport",
    "alternativeImport": "",
    "kind": "class",
    "category": "peft",
    "status": "Experimental",
    "signature": "QuantizationCapabilityReport(backend: 'str', dependency_installed: 'bool', cuda_available: 'bool', device_supported: 'bool', four_bit_loading_supported: 'bool', qlora_training_supported: 'bool', evidence_level: 'str', backend_version: 'str | None' = None, reasons: 'tuple[str, ...]' = <factory>) -> None",
    "summary": "Leesbare status van de lokale QLoRA-mogelijkheden.",
    "parameters": [
      [
        "backend",
        "str",
        "required"
      ],
      [
        "dependency_installed",
        "bool",
        "required"
      ],
      [
        "cuda_available",
        "bool",
        "required"
      ],
      [
        "device_supported",
        "bool",
        "required"
      ],
      [
        "four_bit_loading_supported",
        "bool",
        "required"
      ],
      [
        "qlora_training_supported",
        "bool",
        "required"
      ],
      [
        "evidence_level",
        "str",
        "required"
      ],
      [
        "backend_version",
        "str | None",
        "None"
      ],
      [
        "reasons",
        "tuple[str, ...]",
        "<factory>"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "peft, transformers, bitsandbytes for QLoRA paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.peft import QuantizationCapabilityReport\n\nprint(QuantizationCapabilityReport)",
    "members": [
      [
        "to_dict(self) -> 'dict[str, Any]'",
        "Geeft JSON-vriendelijke capabilitydata terug."
      ]
    ]
  },
  {
    "name": "QuantizationConfig",
    "qualifiedName": "arclm.peft.QuantizationConfig",
    "importPath": "arclm.peft.QuantizationConfig",
    "canonicalImport": "from arclm.peft import QuantizationConfig",
    "alternativeImport": "",
    "kind": "class",
    "category": "peft",
    "status": "Experimental",
    "signature": "QuantizationConfig(backend: 'QuantizationBackend' = <QuantizationBackend.BITSANDBYTES_4BIT: 'bitsandbytes_4bit'>, bits: 'int' = 4, quant_type: 'QuantizationType' = <QuantizationType.NF4: 'nf4'>, use_double_quant: 'bool' = True, compute_dtype: 'QuantizedComputeDType' = <QuantizedComputeDType.FP16: 'fp16'>, config_version: 'int' = 1) -> None",
    "summary": "Kleine JSON-veilige config voor 4-bit quantization.",
    "parameters": [
      [
        "backend",
        "QuantizationBackend",
        "<QuantizationBackend.BITSANDBYTES_4BIT: 'bitsandbytes_4bit'>"
      ],
      [
        "bits",
        "int",
        "4"
      ],
      [
        "quant_type",
        "QuantizationType",
        "<QuantizationType.NF4: 'nf4'>"
      ],
      [
        "use_double_quant",
        "bool",
        "True"
      ],
      [
        "compute_dtype",
        "QuantizedComputeDType",
        "<QuantizedComputeDType.FP16: 'fp16'>"
      ],
      [
        "config_version",
        "int",
        "1"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "peft, transformers, bitsandbytes for QLoRA paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.peft import QuantizationConfig\n\nprint(QuantizationConfig)",
    "members": [
      [
        "from_dict(values: 'Mapping[str, Any]') -> \"'QuantizationConfig'\"",
        "Leest quantizationdata uit veilige manifestdata."
      ],
      [
        "to_dict(self) -> 'dict[str, Any]'",
        "Geeft JSON-vriendelijke quantizationdata terug."
      ],
      [
        "validate(self) -> 'None'",
        "Controleert de quantization-keuzes zonder backend te laden."
      ]
    ]
  },
  {
    "name": "QuantizationType",
    "qualifiedName": "arclm.peft.QuantizationType",
    "importPath": "arclm.peft.QuantizationType",
    "canonicalImport": "from arclm.peft import QuantizationType",
    "alternativeImport": "",
    "kind": "class",
    "category": "peft",
    "status": "Experimental",
    "signature": "QuantizationType(*values)",
    "summary": "4-bit quantization types die ArcLM accepteert.",
    "parameters": [
      [
        "values",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "peft, transformers, bitsandbytes for QLoRA paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.peft import QuantizationType\n\nprint(QuantizationType)",
    "members": []
  },
  {
    "name": "QuantizedComputeDType",
    "qualifiedName": "arclm.peft.QuantizedComputeDType",
    "importPath": "arclm.peft.QuantizedComputeDType",
    "canonicalImport": "from arclm.peft import QuantizedComputeDType",
    "alternativeImport": "",
    "kind": "class",
    "category": "peft",
    "status": "Experimental",
    "signature": "QuantizedComputeDType(*values)",
    "summary": "Compute dtype voor quantized training.",
    "parameters": [
      [
        "values",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "peft, transformers, bitsandbytes for QLoRA paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.peft import QuantizedComputeDType\n\nprint(QuantizedComputeDType)",
    "members": []
  },
  {
    "name": "QuantizedModelReport",
    "qualifiedName": "arclm.peft.QuantizedModelReport",
    "importPath": "arclm.peft.QuantizedModelReport",
    "canonicalImport": "from arclm.peft import QuantizedModelReport",
    "alternativeImport": "",
    "kind": "class",
    "category": "peft",
    "status": "Experimental",
    "signature": "QuantizedModelReport(backend: 'str', quantized_module_count: 'int', trainable_base_parameter_count: 'int', trainable_adapter_parameter_count: 'int', prepared: 'bool', metadata: 'dict[str, Any]' = <factory>) -> None",
    "summary": "Samenvatting van een quantized QLoRA-runtime model.",
    "parameters": [
      [
        "backend",
        "str",
        "required"
      ],
      [
        "quantized_module_count",
        "int",
        "required"
      ],
      [
        "trainable_base_parameter_count",
        "int",
        "required"
      ],
      [
        "trainable_adapter_parameter_count",
        "int",
        "required"
      ],
      [
        "prepared",
        "bool",
        "required"
      ],
      [
        "metadata",
        "dict[str, Any]",
        "<factory>"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "peft, transformers, bitsandbytes for QLoRA paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.peft import QuantizedModelReport\n\nprint(QuantizedModelReport)",
    "members": [
      [
        "to_dict(self) -> 'dict[str, Any]'",
        "Geeft JSON-vriendelijke modeldata terug."
      ]
    ]
  },
  {
    "name": "ADAPTER_ARTIFACT_FORMAT",
    "qualifiedName": "arclm.peft.ADAPTER_ARTIFACT_FORMAT",
    "importPath": "arclm.peft.ADAPTER_ARTIFACT_FORMAT",
    "canonicalImport": "from arclm.peft import ADAPTER_ARTIFACT_FORMAT",
    "alternativeImport": "",
    "kind": "constant",
    "category": "peft",
    "status": "Experimental",
    "signature": "ADAPTER_ARTIFACT_FORMAT",
    "summary": "str(object='') -> str str(bytes_or_buffer[, encoding[, errors]]) -> str Create a new string object from the given object.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "peft, transformers, bitsandbytes for QLoRA paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.peft import ADAPTER_ARTIFACT_FORMAT\n\nprint(ADAPTER_ARTIFACT_FORMAT)",
    "members": []
  },
  {
    "name": "ADAPTER_ARTIFACT_VERSION",
    "qualifiedName": "arclm.peft.ADAPTER_ARTIFACT_VERSION",
    "importPath": "arclm.peft.ADAPTER_ARTIFACT_VERSION",
    "canonicalImport": "from arclm.peft import ADAPTER_ARTIFACT_VERSION",
    "alternativeImport": "",
    "kind": "constant",
    "category": "peft",
    "status": "Experimental",
    "signature": "ADAPTER_ARTIFACT_VERSION",
    "summary": "int([x]) -> integer int(x, base=10) -> integer Convert a number or string to an integer, or return 0 if no arguments are given.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "peft, transformers, bitsandbytes for QLoRA paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.peft import ADAPTER_ARTIFACT_VERSION\n\nprint(ADAPTER_ARTIFACT_VERSION)",
    "members": []
  },
  {
    "name": "apply_lora",
    "qualifiedName": "arclm.peft.apply_lora",
    "importPath": "arclm.peft.apply_lora",
    "canonicalImport": "from arclm.peft import apply_lora",
    "alternativeImport": "",
    "kind": "function",
    "category": "peft",
    "status": "Experimental",
    "signature": "apply_lora(model: 'nn.Module', config: 'LoRAConfig') -> 'PeftApplicationResult'",
    "summary": "Vervangt geselecteerde `nn.Linear` lagen door LoRA wrappers.",
    "parameters": [
      [
        "model",
        "nn.Module",
        "required"
      ],
      [
        "config",
        "LoRAConfig",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "peft, transformers, bitsandbytes for QLoRA paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.peft import apply_lora\n\nprint(apply_lora)",
    "members": []
  },
  {
    "name": "apply_peft",
    "qualifiedName": "arclm.peft.apply_peft",
    "importPath": "arclm.peft.apply_peft",
    "canonicalImport": "from arclm.peft import apply_peft",
    "alternativeImport": "",
    "kind": "function",
    "category": "peft",
    "status": "Experimental",
    "signature": "apply_peft(model: 'nn.Module', config: 'PeftConfig | None') -> 'PeftApplicationResult | None'",
    "summary": "Past de gevraagde PEFT-methode toe.",
    "parameters": [
      [
        "model",
        "nn.Module",
        "required"
      ],
      [
        "config",
        "PeftConfig | None",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "peft, transformers, bitsandbytes for QLoRA paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.peft import apply_peft\n\nprint(apply_peft)",
    "members": []
  },
  {
    "name": "create_quantized_load_config",
    "qualifiedName": "arclm.peft.create_quantized_load_config",
    "importPath": "arclm.peft.create_quantized_load_config",
    "canonicalImport": "from arclm.peft import create_quantized_load_config",
    "alternativeImport": "",
    "kind": "function",
    "category": "peft",
    "status": "Experimental",
    "signature": "create_quantized_load_config(config: 'QuantizationConfig | QLoRAConfig') -> 'Any'",
    "summary": "Maakt backend-specifieke laadconfig voor tests en integraties.",
    "parameters": [
      [
        "config",
        "QuantizationConfig | QLoRAConfig",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "peft, transformers, bitsandbytes for QLoRA paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.peft import create_quantized_load_config\n\nprint(create_quantized_load_config)",
    "members": []
  },
  {
    "name": "fingerprint_base_model",
    "qualifiedName": "arclm.peft.fingerprint_base_model",
    "importPath": "arclm.peft.fingerprint_base_model",
    "canonicalImport": "from arclm.peft import fingerprint_base_model",
    "alternativeImport": "",
    "kind": "function",
    "category": "peft",
    "status": "Experimental",
    "signature": "fingerprint_base_model(model: 'nn.Module') -> 'str'",
    "summary": "Maakt een structuur-fingerprint zonder adaptergewichten.",
    "parameters": [
      [
        "model",
        "nn.Module",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "peft, transformers, bitsandbytes for QLoRA paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.peft import fingerprint_base_model\n\nprint(fingerprint_base_model)",
    "members": []
  },
  {
    "name": "get_lora_state_dict",
    "qualifiedName": "arclm.peft.get_lora_state_dict",
    "importPath": "arclm.peft.get_lora_state_dict",
    "canonicalImport": "from arclm.peft import get_lora_state_dict",
    "alternativeImport": "",
    "kind": "function",
    "category": "peft",
    "status": "Experimental",
    "signature": "get_lora_state_dict(model: 'nn.Module') -> 'dict[str, torch.Tensor]'",
    "summary": "Haalt alleen adaptergewichten uit het model.",
    "parameters": [
      [
        "model",
        "nn.Module",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "peft, transformers, bitsandbytes for QLoRA paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.peft import get_lora_state_dict\n\nprint(get_lora_state_dict)",
    "members": []
  },
  {
    "name": "get_peft_parameter_report",
    "qualifiedName": "arclm.peft.get_peft_parameter_report",
    "importPath": "arclm.peft.get_peft_parameter_report",
    "canonicalImport": "from arclm.peft import get_peft_parameter_report",
    "alternativeImport": "",
    "kind": "function",
    "category": "peft",
    "status": "Experimental",
    "signature": "get_peft_parameter_report(model: 'nn.Module', *, include_names: 'bool' = False) -> 'PeftParameterReport'",
    "summary": "Telt trainbare parameters na PEFT-injectie.",
    "parameters": [
      [
        "model",
        "nn.Module",
        "required"
      ],
      [
        "include_names",
        "bool",
        "False"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "peft, transformers, bitsandbytes for QLoRA paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.peft import get_peft_parameter_report\n\nprint(get_peft_parameter_report)",
    "members": []
  },
  {
    "name": "get_quantization_backend",
    "qualifiedName": "arclm.peft.get_quantization_backend",
    "importPath": "arclm.peft.get_quantization_backend",
    "canonicalImport": "from arclm.peft import get_quantization_backend",
    "alternativeImport": "",
    "kind": "function",
    "category": "peft",
    "status": "Experimental",
    "signature": "get_quantization_backend(backend: 'QuantizationBackend | str') -> 'QuantizationBackendAdapter'",
    "summary": "Geeft de goedgekeurde backendadapter terug.",
    "parameters": [
      [
        "backend",
        "QuantizationBackend | str",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "peft, transformers, bitsandbytes for QLoRA paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.peft import get_quantization_backend\n\nprint(get_quantization_backend)",
    "members": []
  },
  {
    "name": "inspect_adapter_artifact",
    "qualifiedName": "arclm.peft.inspect_adapter_artifact",
    "importPath": "arclm.peft.inspect_adapter_artifact",
    "canonicalImport": "from arclm.peft import inspect_adapter_artifact",
    "alternativeImport": "",
    "kind": "function",
    "category": "peft",
    "status": "Experimental",
    "signature": "inspect_adapter_artifact(path: 'str | Path', *, verify_integrity: 'bool' = False) -> 'PeftAdapterInfo'",
    "summary": "Inspecteert adaptermetadata zonder een model te bouwen.",
    "parameters": [
      [
        "path",
        "str | Path",
        "required"
      ],
      [
        "verify_integrity",
        "bool",
        "False"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "peft, transformers, bitsandbytes for QLoRA paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.peft import inspect_adapter_artifact\n\nprint(inspect_adapter_artifact)",
    "members": []
  },
  {
    "name": "inspect_lora_targets",
    "qualifiedName": "arclm.peft.inspect_lora_targets",
    "importPath": "arclm.peft.inspect_lora_targets",
    "canonicalImport": "from arclm.peft import inspect_lora_targets",
    "alternativeImport": "",
    "kind": "function",
    "category": "peft",
    "status": "Experimental",
    "signature": "inspect_lora_targets(model: 'nn.Module', config: 'LoRAConfig') -> 'tuple[PeftTarget, ...]'",
    "summary": "Maakt een droog plan zonder het model te wijzigen.",
    "parameters": [
      [
        "model",
        "nn.Module",
        "required"
      ],
      [
        "config",
        "LoRAConfig",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "peft, transformers, bitsandbytes for QLoRA paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.peft import inspect_lora_targets\n\nprint(inspect_lora_targets)",
    "members": []
  },
  {
    "name": "inspect_quantization_capabilities",
    "qualifiedName": "arclm.peft.inspect_quantization_capabilities",
    "importPath": "arclm.peft.inspect_quantization_capabilities",
    "canonicalImport": "from arclm.peft import inspect_quantization_capabilities",
    "alternativeImport": "",
    "kind": "function",
    "category": "peft",
    "status": "Experimental",
    "signature": "inspect_quantization_capabilities(config: 'QuantizationConfig | QLoRAConfig | None' = None) -> 'QuantizationCapabilityReport'",
    "summary": "Inspecteert QLoRA-mogelijkheden zonder een model te laden.",
    "parameters": [
      [
        "config",
        "QuantizationConfig | QLoRAConfig | None",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "peft, transformers, bitsandbytes for QLoRA paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.peft import inspect_quantization_capabilities\n\nprint(inspect_quantization_capabilities)",
    "members": []
  },
  {
    "name": "is_lora_model",
    "qualifiedName": "arclm.peft.is_lora_model",
    "importPath": "arclm.peft.is_lora_model",
    "canonicalImport": "from arclm.peft import is_lora_model",
    "alternativeImport": "",
    "kind": "function",
    "category": "peft",
    "status": "Experimental",
    "signature": "is_lora_model(model: 'nn.Module') -> 'bool'",
    "summary": "Controleert of een model LoRA-wrappers bevat.",
    "parameters": [
      [
        "model",
        "nn.Module",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "peft, transformers, bitsandbytes for QLoRA paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.peft import is_lora_model\n\nprint(is_lora_model)",
    "members": []
  },
  {
    "name": "is_quantized_runtime_model",
    "qualifiedName": "arclm.peft.is_quantized_runtime_model",
    "importPath": "arclm.peft.is_quantized_runtime_model",
    "canonicalImport": "from arclm.peft import is_quantized_runtime_model",
    "alternativeImport": "",
    "kind": "function",
    "category": "peft",
    "status": "Experimental",
    "signature": "is_quantized_runtime_model(model: 'nn.Module') -> 'bool'",
    "summary": "Controleert of een model als ArcLM quantized runtime is gemarkeerd.",
    "parameters": [
      [
        "model",
        "nn.Module",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "peft, transformers, bitsandbytes for QLoRA paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.peft import is_quantized_runtime_model\n\nprint(is_quantized_runtime_model)",
    "members": []
  },
  {
    "name": "load_adapter_artifact",
    "qualifiedName": "arclm.peft.load_adapter_artifact",
    "importPath": "arclm.peft.load_adapter_artifact",
    "canonicalImport": "from arclm.peft import load_adapter_artifact",
    "alternativeImport": "",
    "kind": "function",
    "category": "peft",
    "status": "Experimental",
    "signature": "load_adapter_artifact(model: 'nn.Module', path: 'str | Path', *, device: 'str | torch.device' = 'cpu', strict: 'bool' = True) -> 'PeftAdapterManifest'",
    "summary": "Past een LoRA adapterartifact toe op een schoon basismodel.",
    "parameters": [
      [
        "model",
        "nn.Module",
        "required"
      ],
      [
        "path",
        "str | Path",
        "required"
      ],
      [
        "device",
        "str | torch.device",
        "'cpu'"
      ],
      [
        "strict",
        "bool",
        "True"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "peft, transformers, bitsandbytes for QLoRA paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.peft import load_adapter_artifact\n\nprint(load_adapter_artifact)",
    "members": []
  },
  {
    "name": "load_lora_state_dict",
    "qualifiedName": "arclm.peft.load_lora_state_dict",
    "importPath": "arclm.peft.load_lora_state_dict",
    "canonicalImport": "from arclm.peft import load_lora_state_dict",
    "alternativeImport": "",
    "kind": "function",
    "category": "peft",
    "status": "Experimental",
    "signature": "load_lora_state_dict(model: 'nn.Module', state_dict: 'Mapping[str, torch.Tensor]', *, strict: 'bool' = True) -> 'None'",
    "summary": "Laadt adaptergewichten in een model dat al LoRA-wrappers heeft.",
    "parameters": [
      [
        "model",
        "nn.Module",
        "required"
      ],
      [
        "state_dict",
        "Mapping[str, torch.Tensor]",
        "required"
      ],
      [
        "strict",
        "bool",
        "True"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "peft, transformers, bitsandbytes for QLoRA paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.peft import load_lora_state_dict\n\nprint(load_lora_state_dict)",
    "members": []
  },
  {
    "name": "load_quantized_model",
    "qualifiedName": "arclm.peft.load_quantized_model",
    "importPath": "arclm.peft.load_quantized_model",
    "canonicalImport": "from arclm.peft import load_quantized_model",
    "alternativeImport": "",
    "kind": "function",
    "category": "peft",
    "status": "Experimental",
    "signature": "load_quantized_model(model_path: 'str | Path', config: 'QLoRAConfig', *, device: 'str' = 'cuda:0', trust_remote_code: 'bool' = False) -> 'nn.Module'",
    "summary": "Laadt een lokaal 4-bit model voor QLoRA.",
    "parameters": [
      [
        "model_path",
        "str | Path",
        "required"
      ],
      [
        "config",
        "QLoRAConfig",
        "required"
      ],
      [
        "device",
        "str",
        "'cuda:0'"
      ],
      [
        "trust_remote_code",
        "bool",
        "False"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "peft, transformers, bitsandbytes for QLoRA paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.peft import load_quantized_model\n\nprint(load_quantized_model)",
    "members": []
  },
  {
    "name": "merge_lora",
    "qualifiedName": "arclm.peft.merge_lora",
    "importPath": "arclm.peft.merge_lora",
    "canonicalImport": "from arclm.peft import merge_lora",
    "alternativeImport": "",
    "kind": "function",
    "category": "peft",
    "status": "Experimental",
    "signature": "merge_lora(model: 'nn.Module') -> 'None'",
    "summary": "Merged alle LoRA-lagen in-place.",
    "parameters": [
      [
        "model",
        "nn.Module",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "peft, transformers, bitsandbytes for QLoRA paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.peft import merge_lora\n\nprint(merge_lora)",
    "members": []
  },
  {
    "name": "merged_lora_model",
    "qualifiedName": "arclm.peft.merged_lora_model",
    "importPath": "arclm.peft.merged_lora_model",
    "canonicalImport": "from arclm.peft import merged_lora_model",
    "alternativeImport": "",
    "kind": "function",
    "category": "peft",
    "status": "Experimental",
    "signature": "merged_lora_model(model: 'nn.Module') -> 'nn.Module'",
    "summary": "Geeft een kopie terug waarbij LoRA in gewone Linear lagen is verwerkt.",
    "parameters": [
      [
        "model",
        "nn.Module",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "peft, transformers, bitsandbytes for QLoRA paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.peft import merged_lora_model\n\nprint(merged_lora_model)",
    "members": []
  },
  {
    "name": "prepare_model_for_qlora",
    "qualifiedName": "arclm.peft.prepare_model_for_qlora",
    "importPath": "arclm.peft.prepare_model_for_qlora",
    "canonicalImport": "from arclm.peft import prepare_model_for_qlora",
    "alternativeImport": "",
    "kind": "function",
    "category": "peft",
    "status": "Experimental",
    "signature": "prepare_model_for_qlora(model: 'nn.Module', config: 'QLoRAConfig') -> 'QuantizedModelReport'",
    "summary": "Bevriest de quantized basis voordat LoRA wordt toegevoegd.",
    "parameters": [
      [
        "model",
        "nn.Module",
        "required"
      ],
      [
        "config",
        "QLoRAConfig",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "peft, transformers, bitsandbytes for QLoRA paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.peft import prepare_model_for_qlora\n\nprint(prepare_model_for_qlora)",
    "members": []
  },
  {
    "name": "save_adapter_artifact",
    "qualifiedName": "arclm.peft.save_adapter_artifact",
    "importPath": "arclm.peft.save_adapter_artifact",
    "canonicalImport": "from arclm.peft import save_adapter_artifact",
    "alternativeImport": "",
    "kind": "function",
    "category": "peft",
    "status": "Experimental",
    "signature": "save_adapter_artifact(model: 'nn.Module', path: 'str | Path', *, config: 'LoRAConfig | QLoRAConfig | Mapping[str, Any] | None' = None, adapted_modules: 'tuple[str, ...] | None' = None, overwrite: 'bool' = False) -> 'PeftAdapterManifest'",
    "summary": "Bewaart alleen LoRA adaptergewichten.",
    "parameters": [
      [
        "model",
        "nn.Module",
        "required"
      ],
      [
        "path",
        "str | Path",
        "required"
      ],
      [
        "config",
        "LoRAConfig | QLoRAConfig | Mapping[str, Any] | None",
        "None"
      ],
      [
        "adapted_modules",
        "tuple[str, ...] | None",
        "None"
      ],
      [
        "overwrite",
        "bool",
        "False"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "peft, transformers, bitsandbytes for QLoRA paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.peft import save_adapter_artifact\n\nprint(save_adapter_artifact)",
    "members": []
  },
  {
    "name": "unmerge_lora",
    "qualifiedName": "arclm.peft.unmerge_lora",
    "importPath": "arclm.peft.unmerge_lora",
    "canonicalImport": "from arclm.peft import unmerge_lora",
    "alternativeImport": "",
    "kind": "function",
    "category": "peft",
    "status": "Experimental",
    "signature": "unmerge_lora(model: 'nn.Module') -> 'None'",
    "summary": "Maakt een eerdere merge ongedaan.",
    "parameters": [
      [
        "model",
        "nn.Module",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "peft, transformers, bitsandbytes for QLoRA paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.peft import unmerge_lora\n\nprint(unmerge_lora)",
    "members": []
  },
  {
    "name": "validate_adapter_artifact",
    "qualifiedName": "arclm.peft.validate_adapter_artifact",
    "importPath": "arclm.peft.validate_adapter_artifact",
    "canonicalImport": "from arclm.peft import validate_adapter_artifact",
    "alternativeImport": "",
    "kind": "function",
    "category": "peft",
    "status": "Experimental",
    "signature": "validate_adapter_artifact(path: 'str | Path') -> 'PeftAdapterManifest'",
    "summary": "Valideert manifest, paden en hashes zonder adapter te laden.",
    "parameters": [
      [
        "path",
        "str | Path",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "peft, transformers, bitsandbytes for QLoRA paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.peft import validate_adapter_artifact\n\nprint(validate_adapter_artifact)",
    "members": []
  },
  {
    "name": "validate_quantized_base_model",
    "qualifiedName": "arclm.peft.validate_quantized_base_model",
    "importPath": "arclm.peft.validate_quantized_base_model",
    "canonicalImport": "from arclm.peft import validate_quantized_base_model",
    "alternativeImport": "",
    "kind": "function",
    "category": "peft",
    "status": "Experimental",
    "signature": "validate_quantized_base_model(model: 'nn.Module', config: 'QLoRAConfig') -> 'QuantizedModelReport'",
    "summary": "Controleert dat QLoRA echt op een quantized basis draait.",
    "parameters": [
      [
        "model",
        "nn.Module",
        "required"
      ],
      [
        "config",
        "QLoRAConfig",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "peft, transformers, bitsandbytes for QLoRA paths.",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.peft import validate_quantized_base_model\n\nprint(validate_quantized_base_model)",
    "members": []
  },
  {
    "name": "PluginMetadata",
    "qualifiedName": "arclm.plugins.PluginMetadata",
    "importPath": "arclm.plugins.PluginMetadata",
    "canonicalImport": "from arclm.plugins import PluginMetadata",
    "alternativeImport": "",
    "kind": "class",
    "category": "plugins",
    "status": "Experimental",
    "signature": "PluginMetadata(name: 'str', version: 'str') -> None",
    "summary": "Kleine beschrijving van een plugin.",
    "parameters": [
      [
        "name",
        "str",
        "required"
      ],
      [
        "version",
        "str",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.plugins import PluginMetadata\n\nprint(PluginMetadata)",
    "members": []
  },
  {
    "name": "PluginProtocol",
    "qualifiedName": "arclm.plugins.PluginProtocol",
    "importPath": "arclm.plugins.PluginProtocol",
    "canonicalImport": "from arclm.plugins import PluginProtocol",
    "alternativeImport": "",
    "kind": "class",
    "category": "plugins",
    "status": "Experimental",
    "signature": "PluginProtocol(*args, **kwargs)",
    "summary": "Contract voor plugins die zelf ArcLM uitbreidingen registreren.",
    "parameters": [
      [
        "args",
        "Any",
        "required"
      ],
      [
        "kwargs",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.plugins import PluginProtocol\n\nprint(PluginProtocol)",
    "members": [
      [
        "register(self) -> 'None'",
        "Registreert de onderdelen die de plugin toevoegt aan ArcLM."
      ]
    ]
  },
  {
    "name": "Registry",
    "qualifiedName": "arclm.registry.Registry",
    "importPath": "arclm.registry.Registry",
    "canonicalImport": "from arclm.registry import Registry",
    "alternativeImport": "",
    "kind": "class",
    "category": "registry",
    "status": "Experimental",
    "signature": "Registry(namespace: 'str')",
    "summary": "Koppelt namen aan objecten en controleert dubbele registraties.",
    "parameters": [
      [
        "namespace",
        "str",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.registry import Registry\n\nprint(Registry)",
    "members": [
      [
        "get(self, name: 'str')",
        "Haalt een geregistreerde waarde op via naam of alias."
      ],
      [
        "items(self)",
        "Geeft een read-only view van de geregistreerde items terug."
      ],
      [
        "register(self, name: 'str', value, *, aliases: 'tuple[str, ...]' = ())",
        "Registreert een waarde onder een naam en optionele aliassen."
      ]
    ]
  },
  {
    "name": "Accuracy",
    "qualifiedName": "arclm.Accuracy",
    "importPath": "arclm.Accuracy",
    "canonicalImport": "from arclm import Accuracy",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "Accuracy(ignore_index: 'int' = -100) -> 'None'",
    "summary": "Berekent accuracy voor classificatie of token logits.",
    "parameters": [
      [
        "ignore_index",
        "int",
        "-100"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import Accuracy\n\nprint(Accuracy)",
    "members": [
      [
        "compute(self)",
        "Geeft accuracy tussen 0 en 1 terug."
      ],
      [
        "reset(self) -> 'None'",
        "Maakt de tellingen leeg."
      ],
      [
        "update(self, predictions=None, targets=None, loss=None, outputs=None, batch=None) -> 'None'",
        "Voegt voorspellingen en targets van \u00e9\u00e9n batch toe."
      ]
    ]
  },
  {
    "name": "AdaptedModelBundle",
    "qualifiedName": "arclm.AdaptedModelBundle",
    "importPath": "arclm.AdaptedModelBundle",
    "canonicalImport": "from arclm import AdaptedModelBundle",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "AdaptedModelBundle(model: torch.nn.modules.module.Module, config: Any, checkpoint: arclm.checkpoints.loaders.base.LoadedCheckpoint, missing_keys: list, unexpected_keys: list, tokenizer_metadata: Dict[str, Any] = <factory>) -> None",
    "summary": "ArcLM model and metadata produced from a normalized checkpoint.",
    "parameters": [
      [
        "model",
        "Module",
        "required"
      ],
      [
        "config",
        "Any",
        "required"
      ],
      [
        "checkpoint",
        "LoadedCheckpoint",
        "required"
      ],
      [
        "missing_keys",
        "list",
        "required"
      ],
      [
        "unexpected_keys",
        "list",
        "required"
      ],
      [
        "tokenizer_metadata",
        "Dict",
        "<factory>"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import AdaptedModelBundle\n\nprint(AdaptedModelBundle)",
    "members": []
  },
  {
    "name": "And",
    "qualifiedName": "arclm.And",
    "importPath": "arclm.And",
    "canonicalImport": "from arclm import And",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "And(*conjuncts)",
    "summary": "Logische AND met een of meer conjuncties.",
    "parameters": [
      [
        "conjuncts",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import And\n\nprint(And)",
    "members": [
      [
        "add(self, conjunct)",
        "Voegt een extra conjunctie toe."
      ],
      [
        "evaluate(self, model)",
        "Geeft True terug als alle conjuncties True zijn."
      ],
      [
        "formula(self)",
        "Geeft de formuletekst van de AND-zin terug."
      ],
      [
        "iff(self, other)",
        "Maakt een als-en-alleen-als relatie tussen twee zinnen."
      ],
      [
        "implies(self, other)",
        "Maakt een implicatie: als deze zin waar is, dan de andere."
      ],
      [
        "parenthesize(text)",
        "Zet haakjes om een formule als dat nodig is."
      ],
      [
        "symbols(self)",
        "Geeft alle symbolen uit de conjuncties terug."
      ],
      [
        "validate(sentence)",
        "Controleert of een waarde een logische zin is."
      ]
    ]
  },
  {
    "name": "ArcLM",
    "qualifiedName": "arclm.ArcLM",
    "importPath": "arclm.ArcLM",
    "canonicalImport": "from arclm import ArcLM",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "ArcLM(vocab_size, embed_dim=64, block_size=8, num_blocks=2, dropout=0.0)",
    "summary": "Compact causal language model for next-token prediction.",
    "parameters": [
      [
        "vocab_size",
        "Any",
        "required"
      ],
      [
        "embed_dim",
        "Any",
        "64"
      ],
      [
        "block_size",
        "Any",
        "8"
      ],
      [
        "num_blocks",
        "Any",
        "2"
      ],
      [
        "dropout",
        "Any",
        "0.0"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import ArcLM\n\nprint(ArcLM)",
    "members": [
      [
        "add_module(self, name: str, module: Optional[ForwardRef('Module')]) -> None",
        "Add a child module to the current module."
      ],
      [
        "apply(self, fn: collections.abc.Callable[['Module'], None]) -> Self",
        "Apply ``fn`` recursively to every submodule (as returned by ``.children()``) as well as self."
      ],
      [
        "bfloat16(self) -> Self",
        "Casts all floating point parameters and buffers to ``bfloat16`` datatype."
      ],
      [
        "buffers(self, recurse: bool = True) -> collections.abc.Iterator[torch.Tensor]",
        "Return an iterator over module buffers."
      ],
      [
        "children(self) -> collections.abc.Iterator['Module']",
        "Return an iterator over immediate children modules."
      ],
      [
        "compile(self, *args, **kwargs) -> None",
        "Compile this Module's forward using :func:`torch.compile`."
      ],
      [
        "cpu(self) -> Self",
        "Move all model parameters and buffers to the CPU."
      ],
      [
        "cuda(self, device: int | torch.device | None = None) -> Self",
        "Move all model parameters and buffers to the GPU."
      ],
      [
        "double(self) -> Self",
        "Casts all floating point parameters and buffers to ``double`` datatype."
      ],
      [
        "eval(self) -> Self",
        "Set the module in evaluation mode."
      ],
      [
        "extra_repr(self) -> str",
        "Return the extra representation of the module."
      ],
      [
        "float(self) -> Self",
        "Casts all floating point parameters and buffers to ``float`` datatype."
      ]
    ]
  },
  {
    "name": "AutoModel",
    "qualifiedName": "arclm.AutoModel",
    "importPath": "arclm.AutoModel",
    "canonicalImport": "from arclm import AutoModel",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "AutoModel()",
    "summary": "Factory for ArcLM model classes supported by the current package.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import AutoModel\n\nprint(AutoModel)",
    "members": [
      [
        "from_config(config)",
        "Build the native causal language model from a Config-like object."
      ],
      [
        "from_name(name: 'str', **kwargs)",
        "Build a supported model by name."
      ]
    ]
  },
  {
    "name": "AutoTokenizer",
    "qualifiedName": "arclm.AutoTokenizer",
    "importPath": "arclm.AutoTokenizer",
    "canonicalImport": "from arclm import AutoTokenizer",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "AutoTokenizer()",
    "summary": "Maakt ondersteunde ArcLM tokenizers vanuit config of type-naam.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import AutoTokenizer\n\nprint(AutoTokenizer)",
    "members": [
      [
        "from_config(config)",
        "Maakt een tokenizer vanuit een config-achtig object."
      ],
      [
        "from_type(tokenizer_type: 'str' = 'word', **kwargs)",
        "Maakt een tokenizer met een geregistreerde type-naam."
      ]
    ]
  },
  {
    "name": "BaseAugmenter",
    "qualifiedName": "arclm.BaseAugmenter",
    "importPath": "arclm.BaseAugmenter",
    "canonicalImport": "from arclm import BaseAugmenter",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "BaseAugmenter()",
    "summary": "Basis class voor eigen data augmenters.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import BaseAugmenter\n\nprint(BaseAugmenter)",
    "members": [
      [
        "process(self, example: 'dict[str, Any]') -> 'dict[str, Any] | None'",
        "Verwerkt een voorbeeld."
      ]
    ]
  },
  {
    "name": "BaseCallback",
    "qualifiedName": "arclm.BaseCallback",
    "importPath": "arclm.BaseCallback",
    "canonicalImport": "from arclm import BaseCallback",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "BaseCallback()",
    "summary": "Basis class voor eigen training callbacks.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import BaseCallback\n\nprint(BaseCallback)",
    "members": [
      [
        "on_checkpoint_save(self, trainer, path) -> 'None'",
        "Wordt uitgevoerd nadat een checkpoint is opgeslagen."
      ],
      [
        "on_epoch_end(self, trainer, state) -> 'None'",
        "Wordt uitgevoerd aan het einde van een epoch."
      ],
      [
        "on_epoch_start(self, trainer, state) -> 'None'",
        "Wordt uitgevoerd aan het begin van een epoch."
      ],
      [
        "on_evaluate(self, trainer, metrics) -> 'None'",
        "Wordt uitgevoerd nadat evaluatie metrics zijn berekend."
      ],
      [
        "on_step_end(self, trainer, state) -> 'None'",
        "Wordt uitgevoerd nadat een batch is verwerkt."
      ],
      [
        "on_train_end(self, trainer) -> 'None'",
        "Wordt uitgevoerd nadat de training klaar is."
      ],
      [
        "on_train_start(self, trainer) -> 'None'",
        "Wordt uitgevoerd voordat de training begint."
      ]
    ]
  },
  {
    "name": "BaseCleaner",
    "qualifiedName": "arclm.BaseCleaner",
    "importPath": "arclm.BaseCleaner",
    "canonicalImport": "from arclm import BaseCleaner",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "BaseCleaner()",
    "summary": "Basis class voor eigen data cleaners.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import BaseCleaner\n\nprint(BaseCleaner)",
    "members": [
      [
        "process(self, example: 'dict[str, Any]') -> 'dict[str, Any] | None'",
        "Verwerkt een voorbeeld."
      ]
    ]
  },
  {
    "name": "BaseDataset",
    "qualifiedName": "arclm.BaseDataset",
    "importPath": "arclm.BaseDataset",
    "canonicalImport": "from arclm import BaseDataset",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "BaseDataset()",
    "summary": "Basis class voor datasets met lengte en index-toegang.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import BaseDataset\n\nprint(BaseDataset)",
    "members": []
  },
  {
    "name": "BaseDataStep",
    "qualifiedName": "arclm.BaseDataStep",
    "importPath": "arclm.BaseDataStep",
    "canonicalImport": "from arclm import BaseDataStep",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "BaseDataStep()",
    "summary": "Basis class voor een stap die een voorbeeld verwerkt.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import BaseDataStep\n\nprint(BaseDataStep)",
    "members": [
      [
        "process(self, example: 'dict[str, Any]') -> 'dict[str, Any] | None'",
        "Verwerkt een voorbeeld."
      ]
    ]
  },
  {
    "name": "BaseDeduplicator",
    "qualifiedName": "arclm.BaseDeduplicator",
    "importPath": "arclm.BaseDeduplicator",
    "canonicalImport": "from arclm import BaseDeduplicator",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "BaseDeduplicator()",
    "summary": "Basis class voor deduplicatie over een hele dataset.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import BaseDeduplicator\n\nprint(BaseDeduplicator)",
    "members": [
      [
        "deduplicate(self, dataset)",
        "Verwijdert dubbele voorbeelden uit een dataset."
      ]
    ]
  },
  {
    "name": "BaseEvaluationCallback",
    "qualifiedName": "arclm.BaseEvaluationCallback",
    "importPath": "arclm.BaseEvaluationCallback",
    "canonicalImport": "from arclm import BaseEvaluationCallback",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "BaseEvaluationCallback()",
    "summary": "Basis class voor eigen evaluation callbacks.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import BaseEvaluationCallback\n\nprint(BaseEvaluationCallback)",
    "members": [
      [
        "on_batch_end(self, evaluator, batch_index: 'int', metrics: 'dict') -> 'None'",
        "Wordt uitgevoerd nadat \u00e9\u00e9n batch is verwerkt."
      ],
      [
        "on_evaluate_end(self, evaluator, result) -> 'None'",
        "Wordt uitgevoerd nadat de evaluatie klaar is."
      ],
      [
        "on_evaluate_start(self, evaluator) -> 'None'",
        "Wordt uitgevoerd voordat de evaluatie begint."
      ]
    ]
  },
  {
    "name": "BaseEvaluator",
    "qualifiedName": "arclm.BaseEvaluator",
    "importPath": "arclm.BaseEvaluator",
    "canonicalImport": "from arclm import BaseEvaluator",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "BaseEvaluator()",
    "summary": "Basis class voor eigen evaluators.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import BaseEvaluator\n\nprint(BaseEvaluator)",
    "members": [
      [
        "evaluate(self, dataset=None)",
        "Voert evaluatie uit en geeft de resultaten terug."
      ]
    ]
  },
  {
    "name": "BaseFineTuner",
    "qualifiedName": "arclm.BaseFineTuner",
    "importPath": "arclm.BaseFineTuner",
    "canonicalImport": "from arclm import BaseFineTuner",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "BaseFineTuner()",
    "summary": "Basis class voor developers die een eigen fine-tuner willen maken.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import BaseFineTuner\n\nprint(BaseFineTuner)",
    "members": [
      [
        "evaluate(self, dataset=None)",
        "Evalueert het model op een dataset."
      ],
      [
        "train(self, *args, **kwargs)",
        "Start de fine-tuning."
      ]
    ]
  },
  {
    "name": "BaseMetric",
    "qualifiedName": "arclm.BaseMetric",
    "importPath": "arclm.BaseMetric",
    "canonicalImport": "from arclm import BaseMetric",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "BaseMetric()",
    "summary": "Basis class voor developers die een eigen metric willen maken.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import BaseMetric\n\nprint(BaseMetric)",
    "members": [
      [
        "compute(self)",
        "Berekent de uiteindelijke waarde van de metric."
      ],
      [
        "reset(self) -> 'None'",
        "Maakt de opgeslagen metricwaarden leeg."
      ],
      [
        "update(self, predictions=None, targets=None, loss=None, outputs=None) -> 'None'",
        "Voegt de resultaten van \u00e9\u00e9n batch toe."
      ]
    ]
  },
  {
    "name": "BaseModelAdapter",
    "qualifiedName": "arclm.BaseModelAdapter",
    "importPath": "arclm.BaseModelAdapter",
    "canonicalImport": "from arclm import BaseModelAdapter",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "BaseModelAdapter()",
    "summary": "Basis class voor adapters tussen twee model implementaties.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import BaseModelAdapter\n\nprint(BaseModelAdapter)",
    "members": [
      [
        "adapt_weights(self, verbose: bool = True)",
        "Zet source weights om naar het doelmodel."
      ]
    ]
  },
  {
    "name": "BaseModelLoader",
    "qualifiedName": "arclm.BaseModelLoader",
    "importPath": "arclm.BaseModelLoader",
    "canonicalImport": "from arclm import BaseModelLoader",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "BaseModelLoader()",
    "summary": "Basis class voor model loaders die een model en metadata geven.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import BaseModelLoader\n\nprint(BaseModelLoader)",
    "members": [
      [
        "load(self)",
        "Laadt een modelbron."
      ]
    ]
  },
  {
    "name": "BaseStreamingDataset",
    "qualifiedName": "arclm.BaseStreamingDataset",
    "importPath": "arclm.BaseStreamingDataset",
    "canonicalImport": "from arclm import BaseStreamingDataset",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "BaseStreamingDataset()",
    "summary": "Basis class voor datasets die je alleen kunt doorlopen.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import BaseStreamingDataset\n\nprint(BaseStreamingDataset)",
    "members": []
  },
  {
    "name": "BaseSyntheticDataGenerator",
    "qualifiedName": "arclm.BaseSyntheticDataGenerator",
    "importPath": "arclm.BaseSyntheticDataGenerator",
    "canonicalImport": "from arclm import BaseSyntheticDataGenerator",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "BaseSyntheticDataGenerator()",
    "summary": "Basis class voor eigen synthetic-data generators.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import BaseSyntheticDataGenerator\n\nprint(BaseSyntheticDataGenerator)",
    "members": [
      [
        "generate(self, count: 'int')",
        "Maakt `count` nieuwe voorbeelden."
      ]
    ]
  },
  {
    "name": "BaseTrainer",
    "qualifiedName": "arclm.BaseTrainer",
    "importPath": "arclm.BaseTrainer",
    "canonicalImport": "from arclm import BaseTrainer",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "BaseTrainer()",
    "summary": "Basis class voor developers die een eigen trainer willen maken.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import BaseTrainer\n\nprint(BaseTrainer)",
    "members": [
      [
        "evaluate(self, dataset=None)",
        "Voert een eenvoudige evaluatie uit."
      ],
      [
        "train(self, *args, **kwargs)",
        "Start de training."
      ],
      [
        "training_step(self, batch)",
        "Voert \u00e9\u00e9n training step uit en geeft de loss terug."
      ]
    ]
  },
  {
    "name": "BaseTrainingPipeline",
    "qualifiedName": "arclm.BaseTrainingPipeline",
    "importPath": "arclm.BaseTrainingPipeline",
    "canonicalImport": "from arclm import BaseTrainingPipeline",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "BaseTrainingPipeline()",
    "summary": "Basis class voor aanpasbare training pipelines.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import BaseTrainingPipeline\n\nprint(BaseTrainingPipeline)",
    "members": [
      [
        "build(self, vocab_size: int)",
        "Bouwt de pipeline voor een vocabulairegrootte."
      ],
      [
        "get_model(self)",
        "Geeft het huidige model terug."
      ],
      [
        "save_checkpoint(self, path=None)",
        "Slaat de pipeline state op."
      ],
      [
        "train(self, train_loader, val_loader=None, num_epochs=None)",
        "Start de pipeline training."
      ]
    ]
  },
  {
    "name": "Biconditional",
    "qualifiedName": "arclm.Biconditional",
    "importPath": "arclm.Biconditional",
    "canonicalImport": "from arclm import Biconditional",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "Biconditional(left, right)",
    "summary": "Logische zin die waar is als beide kanten gelijk zijn.",
    "parameters": [
      [
        "left",
        "Any",
        "required"
      ],
      [
        "right",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import Biconditional\n\nprint(Biconditional)",
    "members": [
      [
        "evaluate(self, model)",
        "Evalueert of beide kanten dezelfde waarde hebben."
      ],
      [
        "formula(self)",
        "Geeft de formuletekst van de biconditional terug."
      ],
      [
        "iff(self, other)",
        "Maakt een als-en-alleen-als relatie tussen twee zinnen."
      ],
      [
        "implies(self, other)",
        "Maakt een implicatie: als deze zin waar is, dan de andere."
      ],
      [
        "parenthesize(text)",
        "Zet haakjes om een formule als dat nodig is."
      ],
      [
        "symbols(self)",
        "Geeft alle symbolen uit beide kanten terug."
      ],
      [
        "validate(sentence)",
        "Controleert of een waarde een logische zin is."
      ]
    ]
  },
  {
    "name": "ConceptBenchmarkCase",
    "qualifiedName": "arclm.ConceptBenchmarkCase",
    "importPath": "arclm.ConceptBenchmarkCase",
    "canonicalImport": "from arclm import ConceptBenchmarkCase",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "ConceptBenchmarkCase(prompt: str, expected_concepts: list) -> None",
    "summary": "Expected concept relationships for a prompt.",
    "parameters": [
      [
        "prompt",
        "str",
        "required"
      ],
      [
        "expected_concepts",
        "list",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import ConceptBenchmarkCase\n\nprint(ConceptBenchmarkCase)",
    "members": []
  },
  {
    "name": "ConceptBenchmarkResult",
    "qualifiedName": "arclm.ConceptBenchmarkResult",
    "importPath": "arclm.ConceptBenchmarkResult",
    "canonicalImport": "from arclm import ConceptBenchmarkResult",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "ConceptBenchmarkResult(prompt: str, expected_concepts: list, predicted_tokens: list, matched_concepts: list, score: float) -> None",
    "summary": "Concept benchmark score for one prompt.",
    "parameters": [
      [
        "prompt",
        "str",
        "required"
      ],
      [
        "expected_concepts",
        "list",
        "required"
      ],
      [
        "predicted_tokens",
        "list",
        "required"
      ],
      [
        "matched_concepts",
        "list",
        "required"
      ],
      [
        "score",
        "float",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import ConceptBenchmarkResult\n\nprint(ConceptBenchmarkResult)",
    "members": []
  },
  {
    "name": "Config",
    "qualifiedName": "arclm.Config",
    "importPath": "arclm.Config",
    "canonicalImport": "from arclm import Config",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "Config(**kwargs)",
    "summary": "Houdt alle belangrijke ArcLM instellingen bij.",
    "parameters": [
      [
        "kwargs",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import Config\n\nprint(Config)",
    "members": [
      [
        "get_device(self)",
        "Geeft het ingestelde torch device terug."
      ],
      [
        "load_config_from_model(self, model_path)",
        "Laadt configwaarden uit een modelbron in dit object."
      ],
      [
        "set_safe(self, **kwargs)",
        "Zet config waarden veilig en negeert onbekende keys."
      ],
      [
        "to_dict(self)",
        "Zet de config om naar een gewone dict."
      ]
    ]
  },
  {
    "name": "DataBundle",
    "qualifiedName": "arclm.DataBundle",
    "importPath": "arclm.DataBundle",
    "canonicalImport": "from arclm import DataBundle",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "DataBundle(tokens: 'list', train_tokens: 'list', val_tokens: 'list', tokenizer: 'Tokenizer | SentencePieceTokenizer | None', train_loader: 'object', val_loader: 'object', train_encoded: 'list', val_encoded: 'list') -> None",
    "summary": "Bundel met tokens, tokenizer en loaders voor training.",
    "parameters": [
      [
        "tokens",
        "list",
        "required"
      ],
      [
        "train_tokens",
        "list",
        "required"
      ],
      [
        "val_tokens",
        "list",
        "required"
      ],
      [
        "tokenizer",
        "Tokenizer | SentencePieceTokenizer | None",
        "required"
      ],
      [
        "train_loader",
        "object",
        "required"
      ],
      [
        "val_loader",
        "object",
        "required"
      ],
      [
        "train_encoded",
        "list",
        "required"
      ],
      [
        "val_encoded",
        "list",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import DataBundle\n\nprint(DataBundle)",
    "members": [
      [
        "count(self)",
        "Telt hoe vaak tokens voorkomen in de training data."
      ],
      [
        "save_tokenizer(self, path)",
        "Slaat de tokenizer metadata op als JSON."
      ]
    ]
  },
  {
    "name": "DataPipeline",
    "qualifiedName": "arclm.DataPipeline",
    "importPath": "arclm.DataPipeline",
    "canonicalImport": "from arclm import DataPipeline",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "DataPipeline(steps: 'Iterable[Any] | None' = None, progress_callback=None)",
    "summary": "Voert meerdere data-stappen na elkaar uit.",
    "parameters": [
      [
        "steps",
        "Iterable[Any] | None",
        "None"
      ],
      [
        "progress_callback",
        "Any",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import DataPipeline\n\nprint(DataPipeline)",
    "members": [
      [
        "add(self, step: 'Any') -> 'None'",
        "Voegt een stap toe aan het einde van de pipeline."
      ],
      [
        "remove(self, step_or_index: 'Any') -> 'Any'",
        "Verwijdert een stap op index of op object."
      ],
      [
        "run(self, dataset)",
        "Voert alle stappen uit en geeft de nieuwe dataset terug."
      ]
    ]
  },
  {
    "name": "DataProcessor",
    "qualifiedName": "arclm.DataProcessor",
    "importPath": "arclm.DataProcessor",
    "canonicalImport": "from arclm import DataProcessor",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "DataProcessor()",
    "summary": "Compatibility-friendly entry point for ``ProcessedDataset`` workflows.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import DataProcessor\n\nprint(DataProcessor)",
    "members": [
      [
        "load(path: 'Any', format: 'Optional[str]' = None, loader: 'Optional[Callable[[Path], Iterable[Dict[str, Any]]]]' = None) -> 'ProcessedDataset'",
        "Load records through the canonical loader, then wrap them for processing."
      ]
    ]
  },
  {
    "name": "DatasetConfig",
    "qualifiedName": "arclm.DatasetConfig",
    "importPath": "arclm.DatasetConfig",
    "canonicalImport": "from arclm import DatasetConfig",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "DatasetConfig(source: 'Any', format: 'str | None' = None, text_field: 'str' = 'text', required_fields: 'list[str]' = <factory>, encoding: 'str' = 'utf-8', streaming: 'bool' = False) -> None",
    "summary": "Configuratie voor `load_dataset` wanneer je opties wilt hergebruiken.",
    "parameters": [
      [
        "source",
        "Any",
        "required"
      ],
      [
        "format",
        "str | None",
        "None"
      ],
      [
        "text_field",
        "str",
        "'text'"
      ],
      [
        "required_fields",
        "list[str]",
        "<factory>"
      ],
      [
        "encoding",
        "str",
        "'utf-8'"
      ],
      [
        "streaming",
        "bool",
        "False"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import DatasetConfig\n\nprint(DatasetConfig)",
    "members": []
  },
  {
    "name": "DatasetLoader",
    "qualifiedName": "arclm.DatasetLoader",
    "importPath": "arclm.DatasetLoader",
    "canonicalImport": "from arclm import DatasetLoader",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "DatasetLoader(config: 'Any' = None, *, text_field: 'str' = 'text', required_fields: 'Iterable[str] | None' = None, encoding: 'str' = 'utf-8', format: 'str | None' = None, streaming: 'bool' = False)",
    "summary": "Laadt datasets uit simpele lokale bronnen.",
    "parameters": [
      [
        "config",
        "Any",
        "None"
      ],
      [
        "text_field",
        "str",
        "'text'"
      ],
      [
        "required_fields",
        "Iterable[str] | None",
        "None"
      ],
      [
        "encoding",
        "str",
        "'utf-8'"
      ],
      [
        "format",
        "str | None",
        "None"
      ],
      [
        "streaming",
        "bool",
        "False"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import DatasetLoader\n\nprint(DatasetLoader)",
    "members": [
      [
        "load(self, source: 'Any' = None, **kwargs)",
        "Laadt een dataset uit een bestand, lijst of iterable."
      ],
      [
        "load_tokens(self)",
        "Laadt tokens via de oude training-config route."
      ],
      [
        "prepare(self, existing_tokenizer=None) -> 'DataBundle'",
        "Maakt training data via de oude `prepare_data` route."
      ]
    ]
  },
  {
    "name": "DatasetManifest",
    "qualifiedName": "arclm.DatasetManifest",
    "importPath": "arclm.DatasetManifest",
    "canonicalImport": "from arclm import DatasetManifest",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "DatasetManifest(dataset_name: 'str', manifest_version: 'int', source_type: 'str', source_files: 'tuple[str, ...]', record_count_before_processing: 'int', record_count_after_processing: 'int', invalid_records: 'int', duplicates_removed: 'int', text_fields: 'tuple[str, ...]', transformations_applied: 'tuple[str, ...]', split_information: 'dict[str, int]', created_at: 'float', arclm_version: 'str') -> None",
    "summary": "Lightweight provenance metadata for a processed dataset.",
    "parameters": [
      [
        "dataset_name",
        "str",
        "required"
      ],
      [
        "manifest_version",
        "int",
        "required"
      ],
      [
        "source_type",
        "str",
        "required"
      ],
      [
        "source_files",
        "tuple[str, ...]",
        "required"
      ],
      [
        "record_count_before_processing",
        "int",
        "required"
      ],
      [
        "record_count_after_processing",
        "int",
        "required"
      ],
      [
        "invalid_records",
        "int",
        "required"
      ],
      [
        "duplicates_removed",
        "int",
        "required"
      ],
      [
        "text_fields",
        "tuple[str, ...]",
        "required"
      ],
      [
        "transformations_applied",
        "tuple[str, ...]",
        "required"
      ],
      [
        "split_information",
        "dict[str, int]",
        "required"
      ],
      [
        "created_at",
        "float",
        "required"
      ],
      [
        "arclm_version",
        "str",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import DatasetManifest\n\nprint(DatasetManifest)",
    "members": [
      [
        "to_dict(self) -> 'dict[str, Any]'",
        "Return JSON-safe manifest data."
      ],
      [
        "to_json(self) -> 'str'",
        "Serialize the manifest."
      ]
    ]
  },
  {
    "name": "DatasetReport",
    "qualifiedName": "arclm.DatasetReport",
    "importPath": "arclm.DatasetReport",
    "canonicalImport": "from arclm import DatasetReport",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "DatasetReport(record_count: 'int', valid_records: 'int', invalid_records: 'int', duplicates_removed: 'int', empty_records_removed: 'int', train_size: 'int | None', validation_size: 'int | None', min_text_length: 'int', max_text_length: 'int', average_text_length: 'float', token_count: 'int', min_token_length: 'int', max_token_length: 'int', average_token_length: 'float', unknown_token_count: 'int | None', unknown_token_rate: 'float | None', truncated_record_count: 'int', manifest: 'dict[str, Any] | None' = None) -> None",
    "summary": "A compact processed-dataset and tokenization report.",
    "parameters": [
      [
        "record_count",
        "int",
        "required"
      ],
      [
        "valid_records",
        "int",
        "required"
      ],
      [
        "invalid_records",
        "int",
        "required"
      ],
      [
        "duplicates_removed",
        "int",
        "required"
      ],
      [
        "empty_records_removed",
        "int",
        "required"
      ],
      [
        "train_size",
        "int | None",
        "required"
      ],
      [
        "validation_size",
        "int | None",
        "required"
      ],
      [
        "min_text_length",
        "int",
        "required"
      ],
      [
        "max_text_length",
        "int",
        "required"
      ],
      [
        "average_text_length",
        "float",
        "required"
      ],
      [
        "token_count",
        "int",
        "required"
      ],
      [
        "min_token_length",
        "int",
        "required"
      ],
      [
        "max_token_length",
        "int",
        "required"
      ],
      [
        "average_token_length",
        "float",
        "required"
      ],
      [
        "unknown_token_count",
        "int | None",
        "required"
      ],
      [
        "unknown_token_rate",
        "float | None",
        "required"
      ],
      [
        "truncated_record_count",
        "int",
        "required"
      ],
      [
        "manifest",
        "dict[str, Any] | None",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import DatasetReport\n\nprint(DatasetReport)",
    "members": [
      [
        "summary(self) -> 'str'",
        "Return a short human-readable report."
      ],
      [
        "to_dict(self) -> 'dict[str, Any]'",
        "Return JSON-safe report data."
      ],
      [
        "to_json(self) -> 'str'",
        "Serialize the report."
      ]
    ]
  },
  {
    "name": "DatasetValidationIssue",
    "qualifiedName": "arclm.DatasetValidationIssue",
    "importPath": "arclm.DatasetValidationIssue",
    "canonicalImport": "from arclm import DatasetValidationIssue",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "DatasetValidationIssue(index: 'int', field: 'str | None', code: 'str', message: 'str', record_id: 'str | None' = None) -> None",
    "summary": "One validation problem tied to a record index and field.",
    "parameters": [
      [
        "index",
        "int",
        "required"
      ],
      [
        "field",
        "str | None",
        "required"
      ],
      [
        "code",
        "str",
        "required"
      ],
      [
        "message",
        "str",
        "required"
      ],
      [
        "record_id",
        "str | None",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import DatasetValidationIssue\n\nprint(DatasetValidationIssue)",
    "members": [
      [
        "to_dict(self) -> 'dict[str, Any]'",
        "Return JSON-safe issue data."
      ]
    ]
  },
  {
    "name": "DatasetValidationResult",
    "qualifiedName": "arclm.DatasetValidationResult",
    "importPath": "arclm.DatasetValidationResult",
    "canonicalImport": "from arclm import DatasetValidationResult",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "DatasetValidationResult(valid_records: 'list[dict[str, Any]]', issues: 'list[DatasetValidationIssue]', total_records: 'int') -> None",
    "summary": "Result of validating records against a small field schema.",
    "parameters": [
      [
        "valid_records",
        "list[dict[str, Any]]",
        "required"
      ],
      [
        "issues",
        "list[DatasetValidationIssue]",
        "required"
      ],
      [
        "total_records",
        "int",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import DatasetValidationResult\n\nprint(DatasetValidationResult)",
    "members": [
      [
        "summary(self) -> 'str'",
        "Return a short human-readable summary."
      ],
      [
        "to_dict(self) -> 'dict[str, Any]'",
        "Return JSON-safe validation data without record contents."
      ],
      [
        "to_json(self) -> 'str'",
        "Serialize the validation result."
      ]
    ]
  },
  {
    "name": "DeduplicationResult",
    "qualifiedName": "arclm.DeduplicationResult",
    "importPath": "arclm.DeduplicationResult",
    "canonicalImport": "from arclm import DeduplicationResult",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "DeduplicationResult(dataset: 'list[dict[str, Any]]', kept: 'int', removed: 'int', duplicate_keys: 'list[Any]' = <factory>) -> None",
    "summary": "Resultaat van een deduplicatie stap.",
    "parameters": [
      [
        "dataset",
        "list[dict[str, Any]]",
        "required"
      ],
      [
        "kept",
        "int",
        "required"
      ],
      [
        "removed",
        "int",
        "required"
      ],
      [
        "duplicate_keys",
        "list[Any]",
        "<factory>"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import DeduplicationResult\n\nprint(DeduplicationResult)",
    "members": []
  },
  {
    "name": "EarlyStopping",
    "qualifiedName": "arclm.EarlyStopping",
    "importPath": "arclm.EarlyStopping",
    "canonicalImport": "from arclm import EarlyStopping",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "EarlyStopping(patience=10, min_delta=0.0001)",
    "summary": "Early stopping to prevent overfitting",
    "parameters": [
      [
        "patience",
        "Any",
        "10"
      ],
      [
        "min_delta",
        "Any",
        "0.0001"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import EarlyStopping\n\nprint(EarlyStopping)",
    "members": [
      [
        "check(self, val_loss)",
        "Check if training should stop Returns: True if should stop, False otherwise"
      ],
      [
        "reset(self)",
        "Reset early stopping"
      ]
    ]
  },
  {
    "name": "EntailmentResult",
    "qualifiedName": "arclm.EntailmentResult",
    "importPath": "arclm.EntailmentResult",
    "canonicalImport": "from arclm import EntailmentResult",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "EntailmentResult(query: str, answer: bool, symbols: list[str], knowledge: str, consistent: bool = True) -> None",
    "summary": "Resultaat van een vraag aan een knowledge base.",
    "parameters": [
      [
        "query",
        "str",
        "required"
      ],
      [
        "answer",
        "bool",
        "required"
      ],
      [
        "symbols",
        "list",
        "required"
      ],
      [
        "knowledge",
        "str",
        "required"
      ],
      [
        "consistent",
        "bool",
        "True"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import EntailmentResult\n\nprint(EntailmentResult)",
    "members": [
      [
        "to_dict(self)",
        "Geeft het resultaat terug als gewone dict."
      ]
    ]
  },
  {
    "name": "EvaluationConfig",
    "qualifiedName": "arclm.EvaluationConfig",
    "importPath": "arclm.EvaluationConfig",
    "canonicalImport": "from arclm import EvaluationConfig",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "EvaluationConfig(batch_size: 'int' = 8, device: 'str' = 'cpu', max_batches: 'int | None' = None, ignore_index: 'int' = -100, return_predictions: 'bool' = False, prediction_key: 'str' = 'logits', label_key: 'str' = 'labels') -> None",
    "summary": "Bewaart instellingen voor een evaluatierun.",
    "parameters": [
      [
        "batch_size",
        "int",
        "8"
      ],
      [
        "device",
        "str",
        "'cpu'"
      ],
      [
        "max_batches",
        "int | None",
        "None"
      ],
      [
        "ignore_index",
        "int",
        "-100"
      ],
      [
        "return_predictions",
        "bool",
        "False"
      ],
      [
        "prediction_key",
        "str",
        "'logits'"
      ],
      [
        "label_key",
        "str",
        "'labels'"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import EvaluationConfig\n\nprint(EvaluationConfig)",
    "members": [
      [
        "to_dict(self) -> 'dict[str, Any]'",
        "Zet de config om naar een gewone dict."
      ],
      [
        "validate(self) -> 'None'",
        "Controleert of de config bruikbaar is."
      ]
    ]
  },
  {
    "name": "EvaluationReport",
    "qualifiedName": "arclm.EvaluationReport",
    "importPath": "arclm.EvaluationReport",
    "canonicalImport": "from arclm import EvaluationReport",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "EvaluationReport(metrics: 'dict[str, float | int | str | None]', num_examples: 'int', num_batches: 'int', num_tokens: 'int | None', model_identity: 'str | None', checkpoint_identity: 'str | None', dataset_identity: 'str | None', evaluation_timestamp: 'float', device: 'str | None', dtype: 'str | None', warnings: 'tuple[str, ...]' = ()) -> None",
    "summary": "Structured, JSON-safe summary of an evaluation run.",
    "parameters": [
      [
        "metrics",
        "dict[str, float | int | str | None]",
        "required"
      ],
      [
        "num_examples",
        "int",
        "required"
      ],
      [
        "num_batches",
        "int",
        "required"
      ],
      [
        "num_tokens",
        "int | None",
        "required"
      ],
      [
        "model_identity",
        "str | None",
        "required"
      ],
      [
        "checkpoint_identity",
        "str | None",
        "required"
      ],
      [
        "dataset_identity",
        "str | None",
        "required"
      ],
      [
        "evaluation_timestamp",
        "float",
        "required"
      ],
      [
        "device",
        "str | None",
        "required"
      ],
      [
        "dtype",
        "str | None",
        "required"
      ],
      [
        "warnings",
        "tuple[str, ...]",
        "()"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import EvaluationReport\n\nprint(EvaluationReport)",
    "members": [
      [
        "summary(self) -> 'str'",
        "Return a short human-readable evaluation summary."
      ],
      [
        "to_dict(self) -> 'dict[str, Any]'",
        "Return JSON-safe report data."
      ],
      [
        "to_json(self) -> 'str'",
        "Serialize the report."
      ]
    ]
  },
  {
    "name": "EvaluationResult",
    "qualifiedName": "arclm.EvaluationResult",
    "importPath": "arclm.EvaluationResult",
    "canonicalImport": "from arclm import EvaluationResult",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "EvaluationResult(metrics: 'dict[str, float | None]', num_examples: 'int', num_batches: 'int', predictions: 'list[Any] | None' = None, labels: 'list[Any] | None' = None, metadata: 'dict[str, Any]' = <factory>) -> None",
    "summary": "Bewaart de uitkomst van een evaluatierun.",
    "parameters": [
      [
        "metrics",
        "dict[str, float | None]",
        "required"
      ],
      [
        "num_examples",
        "int",
        "required"
      ],
      [
        "num_batches",
        "int",
        "required"
      ],
      [
        "predictions",
        "list[Any] | None",
        "None"
      ],
      [
        "labels",
        "list[Any] | None",
        "None"
      ],
      [
        "metadata",
        "dict[str, Any]",
        "<factory>"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import EvaluationResult\n\nprint(EvaluationResult)",
    "members": [
      [
        "to_dict(self) -> 'dict[str, Any]'",
        "Zet het resultaat om naar een gewone dict."
      ]
    ]
  },
  {
    "name": "Evaluator",
    "qualifiedName": "arclm.Evaluator",
    "importPath": "arclm.Evaluator",
    "canonicalImport": "from arclm import Evaluator",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "Evaluator(model, dataset=None, metrics: 'list[BaseMetric] | None' = None, config: 'EvaluationConfig | None' = None, dataloader=None, callbacks: 'list[BaseEvaluationCallback] | None' = None, collate_fn=None, loss_fn=None)",
    "summary": "Voert evaluatie uit op een model en dataset.",
    "parameters": [
      [
        "model",
        "Any",
        "required"
      ],
      [
        "dataset",
        "Any",
        "None"
      ],
      [
        "metrics",
        "list[BaseMetric] | None",
        "None"
      ],
      [
        "config",
        "EvaluationConfig | None",
        "None"
      ],
      [
        "dataloader",
        "Any",
        "None"
      ],
      [
        "callbacks",
        "list[BaseEvaluationCallback] | None",
        "None"
      ],
      [
        "collate_fn",
        "Any",
        "None"
      ],
      [
        "loss_fn",
        "Any",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import Evaluator\n\nprint(Evaluator)",
    "members": [
      [
        "count_examples(self, targets, batch=None) -> 'int'",
        "Telt het aantal voorbeelden in een batch."
      ],
      [
        "evaluate(self, dataset=None)",
        "Voert de evaluatie uit en geeft de resultaten terug."
      ],
      [
        "forward(self, batch)",
        "Voert de forward pass uit."
      ],
      [
        "get_loss(self, outputs, batch)",
        "Leest loss uit outputs of berekent die met `loss_fn`."
      ],
      [
        "get_predictions(self, outputs)",
        "Leest logits of predictions uit model outputs."
      ],
      [
        "get_targets(self, batch)",
        "Leest labels of targets uit een batch."
      ],
      [
        "prepare_batch(self, batch)",
        "Zet tensors in een batch op het evaluatie-apparaat."
      ],
      [
        "update_metric(self, metric, predictions, targets, loss, outputs, batch) -> 'None'",
        "Werkt een metric bij met alleen de argumenten die hij accepteert."
      ]
    ]
  },
  {
    "name": "ExactDeduplicator",
    "qualifiedName": "arclm.ExactDeduplicator",
    "importPath": "arclm.ExactDeduplicator",
    "canonicalImport": "from arclm import ExactDeduplicator",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "ExactDeduplicator(field: 'str | None' = None, fields: 'list[str] | tuple[str, ...] | None' = None, *, normalize: 'bool' = False, keep: 'str' = 'first', hash_algorithm: 'str | None' = None, missing: 'str' = 'keep')",
    "summary": "Verwijdert voorbeelden met dezelfde waarde in gekozen velden.",
    "parameters": [
      [
        "field",
        "str | None",
        "None"
      ],
      [
        "fields",
        "list[str] | tuple[str, ...] | None",
        "None"
      ],
      [
        "normalize",
        "bool",
        "False"
      ],
      [
        "keep",
        "str",
        "'first'"
      ],
      [
        "hash_algorithm",
        "str | None",
        "None"
      ],
      [
        "missing",
        "str",
        "'keep'"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import ExactDeduplicator\n\nprint(ExactDeduplicator)",
    "members": [
      [
        "deduplicate(self, dataset) -> 'DeduplicationResult'",
        "Geeft een dataset terug zonder exacte duplicaten."
      ]
    ]
  },
  {
    "name": "ExternalLoadedModel",
    "qualifiedName": "arclm.ExternalLoadedModel",
    "importPath": "arclm.ExternalLoadedModel",
    "canonicalImport": "from arclm import ExternalLoadedModel",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "ExternalLoadedModel(model: 'Any', tokenizer: 'Any', config: 'ExternalModelConfig', source_info: 'ModelSourceInfo', device: 'Any', processor: 'Any' = None, _native_loaded: 'Optional[LoadedModel]' = None, _generation_error: 'Optional[str]' = None, _training_method: 'Optional[str]' = None, _lora_merged: 'bool' = False) -> None",
    "summary": "Loaded model wrapper with a unified inference and save API.",
    "parameters": [
      [
        "model",
        "Any",
        "required"
      ],
      [
        "tokenizer",
        "Any",
        "required"
      ],
      [
        "config",
        "ExternalModelConfig",
        "required"
      ],
      [
        "source_info",
        "ModelSourceInfo",
        "required"
      ],
      [
        "device",
        "Any",
        "required"
      ],
      [
        "processor",
        "Any",
        "None"
      ],
      [
        "_native_loaded",
        "Optional[LoadedModel]",
        "None"
      ],
      [
        "_generation_error",
        "Optional[str]",
        "None"
      ],
      [
        "_training_method",
        "Optional[str]",
        "None"
      ],
      [
        "_lora_merged",
        "bool",
        "False"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import ExternalLoadedModel\n\nprint(ExternalLoadedModel)",
    "members": [
      [
        "batch_predict(self, prompts: 'Sequence[PromptLike]', **generation_kwargs: 'Any') -> 'List[str]'",
        "Generate one prediction per prompt."
      ],
      [
        "chat(self, messages: 'Sequence[Mapping[str, str]]', **generation_kwargs: 'Any') -> 'str'",
        "Generate a response from OpenAI-style chat messages."
      ],
      [
        "export(self, output_dir: 'PathLike', save_config: 'Optional[ModelSaveConfig]' = None) -> 'Optional[Path]'",
        "Alias for :meth:`save` for explicit export workflows."
      ],
      [
        "generate(self, prompt: 'PromptLike', **generation_kwargs: 'Any') -> 'str'",
        "Generate text with either a native ArcLM or Hugging Face model."
      ],
      [
        "predict(self, prompt: 'PromptLike', **generation_kwargs: 'Any') -> 'str'",
        "Generate a single prediction from a string prompt or chat messages."
      ],
      [
        "save(self, output_dir: 'PathLike', save_config: 'Optional[ModelSaveConfig]' = None) -> 'Optional[Path]'",
        "Save or export this loaded model using ArcLM save settings."
      ],
      [
        "save_pretrained(self, output_dir: 'PathLike', save_config: 'Optional[ModelSaveConfig]' = None) -> 'Optional[Path]'",
        "Alias for :meth:`save` for Hugging Face-style user expectations."
      ],
      [
        "stream_generate(self, prompt: 'PromptLike', **generation_kwargs: 'Any')",
        "Yield real native ArcLM text deltas when this loaded model supports it."
      ],
      [
        "to(self, device: 'Union[str, torch.device]') -> \"'ExternalLoadedModel'\"",
        "Move the underlying model to a device when the backend supports it."
      ]
    ]
  },
  {
    "name": "ExternalModelConfig",
    "qualifiedName": "arclm.ExternalModelConfig",
    "importPath": "arclm.ExternalModelConfig",
    "canonicalImport": "from arclm import ExternalModelConfig",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "ExternalModelConfig(source: 'PathLike', base_model: 'Optional[str]' = None, device: 'Optional[str]' = None, device_map: 'Optional[Any]' = None, dtype: 'Optional[Union[str, torch.dtype]]' = 'auto', trust_remote_code: 'bool' = False, tokenizer_path: 'Optional[PathLike]' = None, max_memory: 'Optional[Any]' = None, load_in_8bit: 'bool' = False, load_in_4bit: 'bool' = False, enable_thinking: 'Optional[bool]' = False, default_system_prompt: 'Optional[str]' = None, fallback_to_simple_prompt: 'bool' = True, fallback_to_cpu: 'bool' = True, require_tokenizer: 'bool' = True, prefer_best_native: 'bool' = True, generation_config: 'GenerationConfig' = <factory>, save_config: 'ModelSaveConfig' = <factory>) -> None",
    "summary": "Configuration for loading native or external causal language models.",
    "parameters": [
      [
        "source",
        "PathLike",
        "required"
      ],
      [
        "base_model",
        "Optional[str]",
        "None"
      ],
      [
        "device",
        "Optional[str]",
        "None"
      ],
      [
        "device_map",
        "Optional[Any]",
        "None"
      ],
      [
        "dtype",
        "Optional[Union[str, torch.dtype]]",
        "'auto'"
      ],
      [
        "trust_remote_code",
        "bool",
        "False"
      ],
      [
        "tokenizer_path",
        "Optional[PathLike]",
        "None"
      ],
      [
        "max_memory",
        "Optional[Any]",
        "None"
      ],
      [
        "load_in_8bit",
        "bool",
        "False"
      ],
      [
        "load_in_4bit",
        "bool",
        "False"
      ],
      [
        "enable_thinking",
        "Optional[bool]",
        "False"
      ],
      [
        "default_system_prompt",
        "Optional[str]",
        "None"
      ],
      [
        "fallback_to_simple_prompt",
        "bool",
        "True"
      ],
      [
        "fallback_to_cpu",
        "bool",
        "True"
      ],
      [
        "require_tokenizer",
        "bool",
        "True"
      ],
      [
        "prefer_best_native",
        "bool",
        "True"
      ],
      [
        "generation_config",
        "GenerationConfig",
        "<factory>"
      ],
      [
        "save_config",
        "ModelSaveConfig",
        "<factory>"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import ExternalModelConfig\n\nprint(ExternalModelConfig)",
    "members": []
  },
  {
    "name": "FullFineTuner",
    "qualifiedName": "arclm.FullFineTuner",
    "importPath": "arclm.FullFineTuner",
    "canonicalImport": "from arclm import FullFineTuner",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "FullFineTuner(model, tokenizer=None, train_dataset=None, config: 'SFTConfig | None' = None, validation_dataset=None, model_adapter=None, tokenizer_adapter=None, optimizer=None, scheduler=None, callbacks=None, collate_fn=None)",
    "summary": "Traint alle trainbare modelparameters met de Training Core.",
    "parameters": [
      [
        "model",
        "Any",
        "required"
      ],
      [
        "tokenizer",
        "Any",
        "None"
      ],
      [
        "train_dataset",
        "Any",
        "None"
      ],
      [
        "config",
        "SFTConfig | None",
        "None"
      ],
      [
        "validation_dataset",
        "Any",
        "None"
      ],
      [
        "model_adapter",
        "Any",
        "None"
      ],
      [
        "tokenizer_adapter",
        "Any",
        "None"
      ],
      [
        "optimizer",
        "Any",
        "None"
      ],
      [
        "scheduler",
        "Any",
        "None"
      ],
      [
        "callbacks",
        "Any",
        "None"
      ],
      [
        "collate_fn",
        "Any",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import FullFineTuner\n\nprint(FullFineTuner)",
    "members": [
      [
        "evaluate(self, dataset=None)",
        "Evalueert het model met de bestaande evaluatie-integratie."
      ],
      [
        "load_checkpoint(self, path)",
        "Laadt een checkpoint via de bestaande Trainer."
      ],
      [
        "resume(self, path)",
        "Laadt een checkpoint om verder te trainen."
      ],
      [
        "save_checkpoint(self, path=None)",
        "Slaat training en SFT metadata op."
      ],
      [
        "save_metadata(self, path) -> 'Path'",
        "Bewaart kleine SFT metadata naast het checkpoint."
      ],
      [
        "save_model_artifact(self, path, *, config=None, training_summary=None, evaluation_summary=None, overwrite=False)",
        "Bewaart het finale modelartifact, niet de training checkpoint-state."
      ],
      [
        "train(self, resume_from_checkpoint=None)",
        "Start fine-tuning en geeft de training state terug."
      ]
    ]
  },
  {
    "name": "GeneralizationMonitor",
    "qualifiedName": "arclm.GeneralizationMonitor",
    "importPath": "arclm.GeneralizationMonitor",
    "canonicalImport": "from arclm import GeneralizationMonitor",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "GeneralizationMonitor()",
    "summary": "Monitor model generalization during training Traceert training vs validation loss om overfitting te detecteren",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import GeneralizationMonitor\n\nprint(GeneralizationMonitor)",
    "members": [
      [
        "get_average_gap(self, window=10)",
        "Get average generalization gap over window"
      ],
      [
        "get_generalization_gap(self)",
        "Get current generalization gap (val - train)"
      ],
      [
        "get_report(self)",
        "Get generalization report"
      ],
      [
        "is_overfitting(self, threshold=0.5)",
        "Check if model is overfitting Args: threshold: Gap threshold to consider overfitting Returns: True if generalization gap > threshold"
      ],
      [
        "update(self, train_loss, val_loss)",
        "Update monitor with new losses"
      ]
    ]
  },
  {
    "name": "GenerationConfig",
    "qualifiedName": "arclm.GenerationConfig",
    "importPath": "arclm.GenerationConfig",
    "canonicalImport": "from arclm import GenerationConfig",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "GenerationConfig(max_new_tokens: 'int' = 128, temperature: 'float' = 0.7, top_p: 'Optional[float]' = 0.9, top_k: 'Optional[int]' = None, do_sample: 'Optional[bool]' = None, repetition_penalty: 'float' = 1.0, pad_token_id: 'Optional[int]' = None, eos_token_id: 'Optional[Union[int, Sequence[int]]]' = None, stop: 'List[str]' = <factory>, return_full_text: 'bool' = False) -> None",
    "summary": "Text generation defaults used by :class:`ExternalLoadedModel`.",
    "parameters": [
      [
        "max_new_tokens",
        "int",
        "128"
      ],
      [
        "temperature",
        "float",
        "0.7"
      ],
      [
        "top_p",
        "Optional[float]",
        "0.9"
      ],
      [
        "top_k",
        "Optional[int]",
        "None"
      ],
      [
        "do_sample",
        "Optional[bool]",
        "None"
      ],
      [
        "repetition_penalty",
        "float",
        "1.0"
      ],
      [
        "pad_token_id",
        "Optional[int]",
        "None"
      ],
      [
        "eos_token_id",
        "Optional[Union[int, Sequence[int]]]",
        "None"
      ],
      [
        "stop",
        "List[str]",
        "<factory>"
      ],
      [
        "return_full_text",
        "bool",
        "False"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import GenerationConfig\n\nprint(GenerationConfig)",
    "members": [
      [
        "from_overrides(base: \"Optional['GenerationConfig']\" = None, **overrides: 'Any') -> \"'GenerationConfig'\"",
        "Build a generation config by applying keyword overrides."
      ]
    ]
  },
  {
    "name": "Generator",
    "qualifiedName": "arclm.Generator",
    "importPath": "arclm.Generator",
    "canonicalImport": "from arclm import Generator",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "Generator(model, stoi, itos, block_size, device, tokenizer=None)",
    "summary": "Generate tokens from a trained native causal language model.",
    "parameters": [
      [
        "model",
        "Any",
        "required"
      ],
      [
        "stoi",
        "Any",
        "required"
      ],
      [
        "itos",
        "Any",
        "required"
      ],
      [
        "block_size",
        "Any",
        "required"
      ],
      [
        "device",
        "Any",
        "required"
      ],
      [
        "tokenizer",
        "Any",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import Generator\n\nprint(Generator)",
    "members": [
      [
        "generate(self, start_text, max_new_tokens=20, temperature=1.0, repetition_penalty=1.0, top_k=None, top_p=None)",
        "Generate tokens from ``start_text`` with the native ArcLM model."
      ],
      [
        "generate_stream(self, start_text, max_new_tokens=20, temperature=1.0, repetition_penalty=1.0, top_k=None, top_p=None, cancel_check=None)",
        "Yield decoded generated token text during native ArcLM inference."
      ],
      [
        "generate_string(self, start_text, max_new_tokens=20, temperature=1.0, repetition_penalty=1.0, top_k=None, top_p=None)",
        "Generate text and return it as a string."
      ]
    ]
  },
  {
    "name": "Implication",
    "qualifiedName": "arclm.Implication",
    "importPath": "arclm.Implication",
    "canonicalImport": "from arclm import Implication",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "Implication(antecedent, consequent)",
    "summary": "Logische zin van de vorm als A dan B.",
    "parameters": [
      [
        "antecedent",
        "Any",
        "required"
      ],
      [
        "consequent",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import Implication\n\nprint(Implication)",
    "members": [
      [
        "evaluate(self, model)",
        "Evalueert de implicatie in een model."
      ],
      [
        "formula(self)",
        "Geeft de formuletekst van de implicatie terug."
      ],
      [
        "iff(self, other)",
        "Maakt een als-en-alleen-als relatie tussen twee zinnen."
      ],
      [
        "implies(self, other)",
        "Maakt een implicatie: als deze zin waar is, dan de andere."
      ],
      [
        "parenthesize(text)",
        "Zet haakjes om een formule als dat nodig is."
      ],
      [
        "symbols(self)",
        "Geeft alle symbolen uit beide kanten terug."
      ],
      [
        "validate(sentence)",
        "Controleert of een waarde een logische zin is."
      ]
    ]
  },
  {
    "name": "InstructionDataset",
    "qualifiedName": "arclm.InstructionDataset",
    "importPath": "arclm.InstructionDataset",
    "canonicalImport": "from arclm import InstructionDataset",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "InstructionDataset(instructions, responses, tokenizer, block_size, instruction_prefix='<|instruction|>', response_prefix='<|response|>')",
    "summary": "Dataset voor instruction tuning met loss alleen op response tokens.",
    "parameters": [
      [
        "instructions",
        "Any",
        "required"
      ],
      [
        "responses",
        "Any",
        "required"
      ],
      [
        "tokenizer",
        "Any",
        "required"
      ],
      [
        "block_size",
        "Any",
        "required"
      ],
      [
        "instruction_prefix",
        "Any",
        "'<|instruction|>'"
      ],
      [
        "response_prefix",
        "Any",
        "'<|response|>'"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import InstructionDataset\n\nprint(InstructionDataset)",
    "members": []
  },
  {
    "name": "KnowledgeBase",
    "qualifiedName": "arclm.KnowledgeBase",
    "importPath": "arclm.KnowledgeBase",
    "canonicalImport": "from arclm import KnowledgeBase",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "KnowledgeBase(*sentences)",
    "summary": "Bewaart logische regels en beantwoordt simpele vragen.",
    "parameters": [
      [
        "sentences",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import KnowledgeBase\n\nprint(KnowledgeBase)",
    "members": [
      [
        "add(self, sentence)",
        "Voegt een regel of feit toe."
      ],
      [
        "add_all(self, sentences)",
        "Voegt meerdere regels of feiten toe."
      ],
      [
        "as_sentence(self)",
        "Geeft alle regels terug als een grote AND-zin."
      ],
      [
        "ask(self, query)",
        "Geeft True als de knowledge base de query bewijst."
      ],
      [
        "clear(self)",
        "Verwijdert alle kennis uit de knowledge base."
      ],
      [
        "copy(self)",
        "Maakt een nieuwe knowledge base met dezelfde regels."
      ],
      [
        "delete(self, sentence)",
        "Verwijdert een regel of feit."
      ],
      [
        "discard(self, sentence)",
        "Verwijdert een regel als die bestaat."
      ],
      [
        "explain(self, query)",
        "Geeft een klein uitlegbaar resultaat voor een query."
      ],
      [
        "formula(self)",
        "Geeft alle kennis als formuletekst terug."
      ],
      [
        "has(self, sentence)",
        "Controleert of een regel of feit bestaat."
      ],
      [
        "is_consistent(self)",
        "Geeft True als minstens een model bij alle kennis past."
      ]
    ]
  },
  {
    "name": "L1Regularization",
    "qualifiedName": "arclm.L1Regularization",
    "importPath": "arclm.L1Regularization",
    "canonicalImport": "from arclm import L1Regularization",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "L1Regularization(lambda_l1=0.0001)",
    "summary": "L1 Regularization - Sparsity inducing",
    "parameters": [
      [
        "lambda_l1",
        "Any",
        "0.0001"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import L1Regularization\n\nprint(L1Regularization)",
    "members": [
      [
        "compute_loss(self, model)",
        "Compute L1 regularization loss"
      ]
    ]
  },
  {
    "name": "L2Regularization",
    "qualifiedName": "arclm.L2Regularization",
    "importPath": "arclm.L2Regularization",
    "canonicalImport": "from arclm import L2Regularization",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "L2Regularization(lambda_l2=0.0001)",
    "summary": "L2 Regularization (Weight Decay) - Smoothness inducing",
    "parameters": [
      [
        "lambda_l2",
        "Any",
        "0.0001"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import L2Regularization\n\nprint(L2Regularization)",
    "members": [
      [
        "compute_loss(self, model)",
        "Compute L2 regularization loss"
      ]
    ]
  },
  {
    "name": "LabelSmoothing",
    "qualifiedName": "arclm.LabelSmoothing",
    "importPath": "arclm.LabelSmoothing",
    "canonicalImport": "from arclm import LabelSmoothing",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "LabelSmoothing(num_classes, smoothing=0.1)",
    "summary": "Label smoothing regularization Voorkomt overconfident voorspellingen door targets glad te maken",
    "parameters": [
      [
        "num_classes",
        "Any",
        "required"
      ],
      [
        "smoothing",
        "Any",
        "0.1"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import LabelSmoothing\n\nprint(LabelSmoothing)",
    "members": [
      [
        "add_module(self, name: str, module: Optional[ForwardRef('Module')]) -> None",
        "Add a child module to the current module."
      ],
      [
        "apply(self, fn: collections.abc.Callable[['Module'], None]) -> Self",
        "Apply ``fn`` recursively to every submodule (as returned by ``.children()``) as well as self."
      ],
      [
        "bfloat16(self) -> Self",
        "Casts all floating point parameters and buffers to ``bfloat16`` datatype."
      ],
      [
        "buffers(self, recurse: bool = True) -> collections.abc.Iterator[torch.Tensor]",
        "Return an iterator over module buffers."
      ],
      [
        "children(self) -> collections.abc.Iterator['Module']",
        "Return an iterator over immediate children modules."
      ],
      [
        "compile(self, *args, **kwargs) -> None",
        "Compile this Module's forward using :func:`torch.compile`."
      ],
      [
        "cpu(self) -> Self",
        "Move all model parameters and buffers to the CPU."
      ],
      [
        "cuda(self, device: int | torch.device | None = None) -> Self",
        "Move all model parameters and buffers to the GPU."
      ],
      [
        "double(self) -> Self",
        "Casts all floating point parameters and buffers to ``double`` datatype."
      ],
      [
        "eval(self) -> Self",
        "Set the module in evaluation mode."
      ],
      [
        "extra_repr(self) -> str",
        "Return the extra representation of the module."
      ],
      [
        "float(self) -> Self",
        "Casts all floating point parameters and buffers to ``float`` datatype."
      ]
    ]
  },
  {
    "name": "LearningRateScheduler",
    "qualifiedName": "arclm.LearningRateScheduler",
    "importPath": "arclm.LearningRateScheduler",
    "canonicalImport": "from arclm import LearningRateScheduler",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "LearningRateScheduler(optimizer, strategy='cosine', total_epochs=100)",
    "summary": "Learning rate scheduler for better generalization Reduce learning rate during training for better convergence",
    "parameters": [
      [
        "optimizer",
        "Any",
        "required"
      ],
      [
        "strategy",
        "Any",
        "'cosine'"
      ],
      [
        "total_epochs",
        "Any",
        "100"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import LearningRateScheduler\n\nprint(LearningRateScheduler)",
    "members": [
      [
        "step(self, epoch)",
        "Update learning rate for current epoch"
      ]
    ]
  },
  {
    "name": "LoadedCheckpoint",
    "qualifiedName": "arclm.LoadedCheckpoint",
    "importPath": "arclm.LoadedCheckpoint",
    "canonicalImport": "from arclm import LoadedCheckpoint",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "LoadedCheckpoint(source: str, source_type: str, state_dict: Dict[str, torch.Tensor], config: Dict[str, Any] = <factory>, vocab_size: Optional[int] = None, tokenizer_metadata: Dict[str, Any] = <factory>, vocab: Optional[list] = None, stoi: Optional[Dict[str, int]] = None, itos: Optional[Dict[int, str]] = None, optimizer_state_dict: Optional[Dict[str, Any]] = None, train_history: Dict[str, Any] = <factory>, metadata: Dict[str, Any] = <factory>) -> None",
    "summary": "Normalized representation of a model source that ArcLM can inspect.",
    "parameters": [
      [
        "source",
        "str",
        "required"
      ],
      [
        "source_type",
        "str",
        "required"
      ],
      [
        "state_dict",
        "Dict",
        "required"
      ],
      [
        "config",
        "Dict",
        "<factory>"
      ],
      [
        "vocab_size",
        "Optional",
        "None"
      ],
      [
        "tokenizer_metadata",
        "Dict",
        "<factory>"
      ],
      [
        "vocab",
        "Optional",
        "None"
      ],
      [
        "stoi",
        "Optional",
        "None"
      ],
      [
        "itos",
        "Optional",
        "None"
      ],
      [
        "optimizer_state_dict",
        "Optional",
        "None"
      ],
      [
        "train_history",
        "Dict",
        "<factory>"
      ],
      [
        "metadata",
        "Dict",
        "<factory>"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import LoadedCheckpoint\n\nprint(LoadedCheckpoint)",
    "members": [
      [
        "require_state_dict(self) -> Dict[str, torch.Tensor]",
        "Haalt de state dict op of geeft een duidelijke fout."
      ]
    ]
  },
  {
    "name": "LoadedModel",
    "qualifiedName": "arclm.LoadedModel",
    "importPath": "arclm.LoadedModel",
    "canonicalImport": "from arclm import LoadedModel",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "LoadedModel(model: torch.nn.modules.module.Module, generator: arclm.inference.generation.Generator, config: arclm.configs.base.Config, model_path: pathlib.Path, device: torch.device) -> None",
    "summary": "Loaded model bundle with a minimal prediction method.",
    "parameters": [
      [
        "model",
        "Module",
        "required"
      ],
      [
        "generator",
        "Generator",
        "required"
      ],
      [
        "config",
        "Config",
        "required"
      ],
      [
        "model_path",
        "Path",
        "required"
      ],
      [
        "device",
        "device",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import LoadedModel\n\nprint(LoadedModel)",
    "members": [
      [
        "predict(self, input_text, max_new_tokens=80, temperature=0.9, repetition_penalty=1.2, top_k=None, top_p=0.9)",
        "Generate a prediction from raw input text."
      ]
    ]
  },
  {
    "name": "LoadPlan",
    "qualifiedName": "arclm.LoadPlan",
    "importPath": "arclm.LoadPlan",
    "canonicalImport": "from arclm import LoadPlan",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "LoadPlan(source: 'str', source_type: 'str' = 'unknown', files: 'List[str]' = <factory>, metadata: 'Dict[str, Any]' = <factory>, model_type: 'Optional[str]' = None, architecture: 'Optional[str]' = None, tokenizer: 'Optional[str]' = None, weight_format: 'Optional[str]' = None, precision: 'Optional[str]' = None, load_as: 'Optional[str]' = None, has_optimizer: 'bool' = False, has_scheduler: 'bool' = False, has_training_state: 'bool' = False, can_resume_training: 'bool' = False, resume_epoch: 'Optional[int]' = None, resume_step: 'Optional[int]' = None, load_optimizer: 'Optional[bool]' = None, load_scheduler: 'Optional[bool]' = None, resume_training: 'Optional[bool]' = None) -> None",
    "summary": "Detected and user-selected settings for loading a model source.",
    "parameters": [
      [
        "source",
        "str",
        "required"
      ],
      [
        "source_type",
        "str",
        "'unknown'"
      ],
      [
        "files",
        "List[str]",
        "<factory>"
      ],
      [
        "metadata",
        "Dict[str, Any]",
        "<factory>"
      ],
      [
        "model_type",
        "Optional[str]",
        "None"
      ],
      [
        "architecture",
        "Optional[str]",
        "None"
      ],
      [
        "tokenizer",
        "Optional[str]",
        "None"
      ],
      [
        "weight_format",
        "Optional[str]",
        "None"
      ],
      [
        "precision",
        "Optional[str]",
        "None"
      ],
      [
        "load_as",
        "Optional[str]",
        "None"
      ],
      [
        "has_optimizer",
        "bool",
        "False"
      ],
      [
        "has_scheduler",
        "bool",
        "False"
      ],
      [
        "has_training_state",
        "bool",
        "False"
      ],
      [
        "can_resume_training",
        "bool",
        "False"
      ],
      [
        "resume_epoch",
        "Optional[int]",
        "None"
      ],
      [
        "resume_step",
        "Optional[int]",
        "None"
      ],
      [
        "load_optimizer",
        "Optional[bool]",
        "None"
      ],
      [
        "load_scheduler",
        "Optional[bool]",
        "None"
      ],
      [
        "resume_training",
        "Optional[bool]",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import LoadPlan\n\nprint(LoadPlan)",
    "members": [
      [
        "apply_overrides(self, overrides: 'Dict[str, Any]') -> 'None'",
        "Past expliciete overrides toe op de instellingen."
      ],
      [
        "format_report(self) -> 'str'",
        "Maakt een leesbaar rapport van de inspectie."
      ],
      [
        "to_dict(self) -> 'Dict[str, Any]'",
        "Zet dit object om naar een gewone dict."
      ]
    ]
  },
  {
    "name": "LongContextResult",
    "qualifiedName": "arclm.LongContextResult",
    "importPath": "arclm.LongContextResult",
    "canonicalImport": "from arclm import LongContextResult",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "LongContextResult(block_size: int, validation_loss: float, concept_score: float, generated_sample: str) -> None",
    "summary": "Summary for one long-context training/evaluation run.",
    "parameters": [
      [
        "block_size",
        "int",
        "required"
      ],
      [
        "validation_loss",
        "float",
        "required"
      ],
      [
        "concept_score",
        "float",
        "required"
      ],
      [
        "generated_sample",
        "str",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import LongContextResult\n\nprint(LongContextResult)",
    "members": []
  },
  {
    "name": "LossMetric",
    "qualifiedName": "arclm.LossMetric",
    "importPath": "arclm.LossMetric",
    "canonicalImport": "from arclm import LossMetric",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "LossMetric() -> 'None'",
    "summary": "Berekent gemiddelde loss per batch.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import LossMetric\n\nprint(LossMetric)",
    "members": [
      [
        "compute(self)",
        "Geeft de gemiddelde batch loss terug."
      ],
      [
        "reset(self) -> 'None'",
        "Maakt de opgeslagen loss leeg."
      ],
      [
        "update(self, predictions=None, targets=None, loss=None, outputs=None, batch=None) -> 'None'",
        "Voegt loss van \u00e9\u00e9n batch toe."
      ]
    ]
  },
  {
    "name": "MetricsReport",
    "qualifiedName": "arclm.MetricsReport",
    "importPath": "arclm.MetricsReport",
    "canonicalImport": "from arclm import MetricsReport",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "MetricsReport(perplexity: float, avg_loss: float, total_tokens: int, correct_predictions: int, accuracy: float, timestamp: str = '') -> None",
    "summary": "Comprehensive metrics report for model evaluation.",
    "parameters": [
      [
        "perplexity",
        "float",
        "required"
      ],
      [
        "avg_loss",
        "float",
        "required"
      ],
      [
        "total_tokens",
        "int",
        "required"
      ],
      [
        "correct_predictions",
        "int",
        "required"
      ],
      [
        "accuracy",
        "float",
        "required"
      ],
      [
        "timestamp",
        "str",
        "''"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import MetricsReport\n\nprint(MetricsReport)",
    "members": [
      [
        "to_dict(self)",
        "Convert to dictionary for JSON serialization."
      ]
    ]
  },
  {
    "name": "MiniGPT",
    "qualifiedName": "arclm.MiniGPT",
    "importPath": "arclm.MiniGPT",
    "canonicalImport": "from arclm import MiniGPT",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Deprecated",
    "signature": "ArcLM(vocab_size, embed_dim=64, block_size=8, num_blocks=2, dropout=0.0)",
    "summary": "Compact causal language model for next-token prediction.",
    "parameters": [
      [
        "vocab_size",
        "Any",
        "required"
      ],
      [
        "embed_dim",
        "Any",
        "64"
      ],
      [
        "block_size",
        "Any",
        "8"
      ],
      [
        "num_blocks",
        "Any",
        "2"
      ],
      [
        "dropout",
        "Any",
        "0.0"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import MiniGPT\n\nprint(MiniGPT)",
    "members": [
      [
        "add_module(self, name: str, module: Optional[ForwardRef('Module')]) -> None",
        "Add a child module to the current module."
      ],
      [
        "apply(self, fn: collections.abc.Callable[['Module'], None]) -> Self",
        "Apply ``fn`` recursively to every submodule (as returned by ``.children()``) as well as self."
      ],
      [
        "bfloat16(self) -> Self",
        "Casts all floating point parameters and buffers to ``bfloat16`` datatype."
      ],
      [
        "buffers(self, recurse: bool = True) -> collections.abc.Iterator[torch.Tensor]",
        "Return an iterator over module buffers."
      ],
      [
        "children(self) -> collections.abc.Iterator['Module']",
        "Return an iterator over immediate children modules."
      ],
      [
        "compile(self, *args, **kwargs) -> None",
        "Compile this Module's forward using :func:`torch.compile`."
      ],
      [
        "cpu(self) -> Self",
        "Move all model parameters and buffers to the CPU."
      ],
      [
        "cuda(self, device: int | torch.device | None = None) -> Self",
        "Move all model parameters and buffers to the GPU."
      ],
      [
        "double(self) -> Self",
        "Casts all floating point parameters and buffers to ``double`` datatype."
      ],
      [
        "eval(self) -> Self",
        "Set the module in evaluation mode."
      ],
      [
        "extra_repr(self) -> str",
        "Return the extra representation of the module."
      ],
      [
        "float(self) -> Self",
        "Casts all floating point parameters and buffers to ``float`` datatype."
      ]
    ]
  },
  {
    "name": "MixupAugmentation",
    "qualifiedName": "arclm.MixupAugmentation",
    "importPath": "arclm.MixupAugmentation",
    "canonicalImport": "from arclm import MixupAugmentation",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "MixupAugmentation(alpha=1.0)",
    "summary": "Mixup data augmentation for better generalization Combineert twee samples lineair om data augmentation te krijgen",
    "parameters": [
      [
        "alpha",
        "Any",
        "1.0"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import MixupAugmentation\n\nprint(MixupAugmentation)",
    "members": []
  },
  {
    "name": "ModelAdapter",
    "qualifiedName": "arclm.ModelAdapter",
    "importPath": "arclm.ModelAdapter",
    "canonicalImport": "from arclm import ModelAdapter",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "ModelAdapter(source_model: torch.nn.modules.module.Module, target_model: arclm.models.text.causal_lm.ArcLM)",
    "summary": "Adapt weights from external models to ArcLM architecture.",
    "parameters": [
      [
        "source_model",
        "Module",
        "required"
      ],
      [
        "target_model",
        "ArcLM",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import ModelAdapter\n\nprint(ModelAdapter)",
    "members": [
      [
        "adapt_weights(self, verbose: bool = True) -> Dict[str, int]",
        "Adapt source model weights to target model architecture."
      ]
    ]
  },
  {
    "name": "ModelCapabilityReport",
    "qualifiedName": "arclm.ModelCapabilityReport",
    "importPath": "arclm.ModelCapabilityReport",
    "canonicalImport": "from arclm import ModelCapabilityReport",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "ModelCapabilityReport(model_source: 'str', model_family: 'str', exact_model: 'str', task: 'str', status: 'CapabilityStatus', can_forward: 'bool', can_generate: 'bool', can_train: 'bool', can_full_finetune: 'bool', can_sft: 'bool', can_lora: 'bool', can_save_reload: 'bool', supports_cpu: 'bool', supports_cuda: 'bool', supports_quantization: 'bool', supports_structured_output: 'bool', validated_operations: 'tuple[str, ...]' = <factory>, unvalidated_operations: 'tuple[str, ...]' = <factory>, limitations: 'tuple[str, ...]' = <factory>, operations: 'dict[str, OperationStatus]' = <factory>) -> None",
    "summary": "Describes supported operations for one exact model path.",
    "parameters": [
      [
        "model_source",
        "str",
        "required"
      ],
      [
        "model_family",
        "str",
        "required"
      ],
      [
        "exact_model",
        "str",
        "required"
      ],
      [
        "task",
        "str",
        "required"
      ],
      [
        "status",
        "CapabilityStatus",
        "required"
      ],
      [
        "can_forward",
        "bool",
        "required"
      ],
      [
        "can_generate",
        "bool",
        "required"
      ],
      [
        "can_train",
        "bool",
        "required"
      ],
      [
        "can_full_finetune",
        "bool",
        "required"
      ],
      [
        "can_sft",
        "bool",
        "required"
      ],
      [
        "can_lora",
        "bool",
        "required"
      ],
      [
        "can_save_reload",
        "bool",
        "required"
      ],
      [
        "supports_cpu",
        "bool",
        "required"
      ],
      [
        "supports_cuda",
        "bool",
        "required"
      ],
      [
        "supports_quantization",
        "bool",
        "required"
      ],
      [
        "supports_structured_output",
        "bool",
        "required"
      ],
      [
        "validated_operations",
        "tuple[str, ...]",
        "<factory>"
      ],
      [
        "unvalidated_operations",
        "tuple[str, ...]",
        "<factory>"
      ],
      [
        "limitations",
        "tuple[str, ...]",
        "<factory>"
      ],
      [
        "operations",
        "dict[str, OperationStatus]",
        "<factory>"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import ModelCapabilityReport\n\nprint(ModelCapabilityReport)",
    "members": [
      [
        "to_dict(self) -> 'dict[str, object]'",
        "Return a JSON-safe representation."
      ]
    ]
  },
  {
    "name": "ModelInspector",
    "qualifiedName": "arclm.ModelInspector",
    "importPath": "arclm.ModelInspector",
    "canonicalImport": "from arclm import ModelInspector",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "ModelInspector()",
    "summary": "Base class for source inspectors used by ``SmartLoader``.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import ModelInspector\n\nprint(ModelInspector)",
    "members": [
      [
        "can_inspect(self, source: 'Any') -> 'bool'",
        "Controleert of deze inspector de bron kan bekijken."
      ],
      [
        "inspect(self, source: 'Any') -> 'LoadPlan'",
        "Inspecteert een modelbron en geeft metadata terug."
      ]
    ]
  },
  {
    "name": "ModelSaveConfig",
    "qualifiedName": "arclm.ModelSaveConfig",
    "importPath": "arclm.ModelSaveConfig",
    "canonicalImport": "from arclm import ModelSaveConfig",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "ModelSaveConfig(save_enabled: 'bool' = True, save_mode: 'str' = 'auto', save_layout: 'str' = 'model_id', save_tokenizer: 'bool' = True, save_model_config: 'bool' = True, save_generation_config: 'bool' = True, save_training_metadata: 'bool' = True, save_adapter_config: 'bool' = True, save_processor: 'bool' = True, save_readme: 'bool' = True, save_safetensors: 'bool' = True, merge_lora: 'bool' = False, overwrite: 'bool' = False) -> None",
    "summary": "Developer-controlled settings for saving or exporting loaded models.",
    "parameters": [
      [
        "save_enabled",
        "bool",
        "True"
      ],
      [
        "save_mode",
        "str",
        "'auto'"
      ],
      [
        "save_layout",
        "str",
        "'model_id'"
      ],
      [
        "save_tokenizer",
        "bool",
        "True"
      ],
      [
        "save_model_config",
        "bool",
        "True"
      ],
      [
        "save_generation_config",
        "bool",
        "True"
      ],
      [
        "save_training_metadata",
        "bool",
        "True"
      ],
      [
        "save_adapter_config",
        "bool",
        "True"
      ],
      [
        "save_processor",
        "bool",
        "True"
      ],
      [
        "save_readme",
        "bool",
        "True"
      ],
      [
        "save_safetensors",
        "bool",
        "True"
      ],
      [
        "merge_lora",
        "bool",
        "False"
      ],
      [
        "overwrite",
        "bool",
        "False"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import ModelSaveConfig\n\nprint(ModelSaveConfig)",
    "members": []
  },
  {
    "name": "ModelSourceInfo",
    "qualifiedName": "arclm.ModelSourceInfo",
    "importPath": "arclm.ModelSourceInfo",
    "canonicalImport": "from arclm import ModelSourceInfo",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "ModelSourceInfo(source: 'str', source_type: 'str' = 'unknown', tokenizer_files_exist: 'bool' = False, adapter_config_exists: 'bool' = False, config_json_exists: 'bool' = False, model_weights_exist: 'bool' = False, detected_checkpoint_folders: 'List[str]' = <factory>, recommended_loading_strategy: 'str' = 'unsupported', warnings: 'List[str]' = <factory>, resolved_source: 'Optional[str]' = None, model_type: 'Optional[str]' = None, weight_format: 'Optional[str]' = None, load_as: 'Optional[str]' = None, base_model_name_or_path: 'Optional[str]' = None) -> None",
    "summary": "Structured inspection result for a model source.",
    "parameters": [
      [
        "source",
        "str",
        "required"
      ],
      [
        "source_type",
        "str",
        "'unknown'"
      ],
      [
        "tokenizer_files_exist",
        "bool",
        "False"
      ],
      [
        "adapter_config_exists",
        "bool",
        "False"
      ],
      [
        "config_json_exists",
        "bool",
        "False"
      ],
      [
        "model_weights_exist",
        "bool",
        "False"
      ],
      [
        "detected_checkpoint_folders",
        "List[str]",
        "<factory>"
      ],
      [
        "recommended_loading_strategy",
        "str",
        "'unsupported'"
      ],
      [
        "warnings",
        "List[str]",
        "<factory>"
      ],
      [
        "resolved_source",
        "Optional[str]",
        "None"
      ],
      [
        "model_type",
        "Optional[str]",
        "None"
      ],
      [
        "weight_format",
        "Optional[str]",
        "None"
      ],
      [
        "load_as",
        "Optional[str]",
        "None"
      ],
      [
        "base_model_name_or_path",
        "Optional[str]",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import ModelSourceInfo\n\nprint(ModelSourceInfo)",
    "members": [
      [
        "format_report(self) -> 'str'",
        "Return a compact human-readable inspection report."
      ],
      [
        "to_dict(self) -> 'Dict[str, Any]'",
        "Return a JSON-serializable representation of the inspection result."
      ]
    ]
  },
  {
    "name": "Not",
    "qualifiedName": "arclm.Not",
    "importPath": "arclm.Not",
    "canonicalImport": "from arclm import Not",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "Not(operand)",
    "summary": "Logische NOT rond een operand.",
    "parameters": [
      [
        "operand",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import Not\n\nprint(Not)",
    "members": [
      [
        "evaluate(self, model)",
        "Geeft de omgekeerde waarde van de operand terug."
      ],
      [
        "formula(self)",
        "Geeft de formuletekst van de negatie terug."
      ],
      [
        "iff(self, other)",
        "Maakt een als-en-alleen-als relatie tussen twee zinnen."
      ],
      [
        "implies(self, other)",
        "Maakt een implicatie: als deze zin waar is, dan de andere."
      ],
      [
        "parenthesize(text)",
        "Zet haakjes om een formule als dat nodig is."
      ],
      [
        "symbols(self)",
        "Geeft alle symbolen uit de operand terug."
      ],
      [
        "validate(sentence)",
        "Controleert of een waarde een logische zin is."
      ]
    ]
  },
  {
    "name": "Or",
    "qualifiedName": "arclm.Or",
    "importPath": "arclm.Or",
    "canonicalImport": "from arclm import Or",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "Or(*disjuncts)",
    "summary": "Logische OR met een of meer disjuncties.",
    "parameters": [
      [
        "disjuncts",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import Or\n\nprint(Or)",
    "members": [
      [
        "evaluate(self, model)",
        "Geeft True terug als minstens een disjunctie True is."
      ],
      [
        "formula(self)",
        "Geeft de formuletekst van de OR-zin terug."
      ],
      [
        "iff(self, other)",
        "Maakt een als-en-alleen-als relatie tussen twee zinnen."
      ],
      [
        "implies(self, other)",
        "Maakt een implicatie: als deze zin waar is, dan de andere."
      ],
      [
        "parenthesize(text)",
        "Zet haakjes om een formule als dat nodig is."
      ],
      [
        "symbols(self)",
        "Geeft alle symbolen uit de disjuncties terug."
      ],
      [
        "validate(sentence)",
        "Controleert of een waarde een logische zin is."
      ]
    ]
  },
  {
    "name": "Perplexity",
    "qualifiedName": "arclm.Perplexity",
    "importPath": "arclm.Perplexity",
    "canonicalImport": "from arclm import Perplexity",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "Perplexity(max_loss: 'float' = 20.0) -> 'None'",
    "summary": "Berekent perplexity uit gemiddelde loss.",
    "parameters": [
      [
        "max_loss",
        "float",
        "20.0"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import Perplexity\n\nprint(Perplexity)",
    "members": [
      [
        "compute(self)",
        "Geeft `exp(loss)` terug als de loss bruikbaar is."
      ],
      [
        "reset(self) -> 'None'",
        "Maakt de opgeslagen loss leeg."
      ],
      [
        "update(self, predictions=None, targets=None, loss=None, outputs=None, batch=None) -> 'None'",
        "Voegt de batch loss toe."
      ]
    ]
  },
  {
    "name": "PipelineTrace",
    "qualifiedName": "arclm.PipelineTrace",
    "importPath": "arclm.PipelineTrace",
    "canonicalImport": "from arclm import PipelineTrace",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "PipelineTrace(input_text: 'str', tokens: 'list[str]', token_ids: 'list[int]', sequence_length: 'int', input_shape: 'list[int]', embedding_shape: 'list[int]', logits_shape: 'list[int]', selected_token_id: 'int', selected_token: 'str', generated_text: 'str', device: 'str', dtype: 'str', model_class: 'str', tokenizer_class: 'str', inspected_steps: 'int' = 1, generation_steps: 'int' = 1, attention_available: 'bool' = False, attention_note: 'str' = 'Attention tensor capture is planned for a later inspection version.', warnings: 'list[str]' = <factory>, values: 'dict[str, list[float | int]] | None' = None) -> None",
    "summary": "JSON-safe summary of one inspected native ArcLM generation step.",
    "parameters": [
      [
        "input_text",
        "str",
        "required"
      ],
      [
        "tokens",
        "list[str]",
        "required"
      ],
      [
        "token_ids",
        "list[int]",
        "required"
      ],
      [
        "sequence_length",
        "int",
        "required"
      ],
      [
        "input_shape",
        "list[int]",
        "required"
      ],
      [
        "embedding_shape",
        "list[int]",
        "required"
      ],
      [
        "logits_shape",
        "list[int]",
        "required"
      ],
      [
        "selected_token_id",
        "int",
        "required"
      ],
      [
        "selected_token",
        "str",
        "required"
      ],
      [
        "generated_text",
        "str",
        "required"
      ],
      [
        "device",
        "str",
        "required"
      ],
      [
        "dtype",
        "str",
        "required"
      ],
      [
        "model_class",
        "str",
        "required"
      ],
      [
        "tokenizer_class",
        "str",
        "required"
      ],
      [
        "inspected_steps",
        "int",
        "1"
      ],
      [
        "generation_steps",
        "int",
        "1"
      ],
      [
        "attention_available",
        "bool",
        "False"
      ],
      [
        "attention_note",
        "str",
        "'Attention tensor capture is planned for a later inspection version.'"
      ],
      [
        "warnings",
        "list[str]",
        "<factory>"
      ],
      [
        "values",
        "dict[str, list[float | int]] | None",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import PipelineTrace\n\nprint(PipelineTrace)",
    "members": [
      [
        "summary(self) -> 'str'",
        "Return a compact human-readable trace."
      ],
      [
        "to_dict(self) -> 'dict[str, Any]'",
        "Return a JSON-safe dictionary representation."
      ],
      [
        "to_json(self, **kwargs: 'Any') -> 'str'",
        "Return the trace as JSON using only the standard library."
      ]
    ]
  },
  {
    "name": "PreTrainedModelLoader",
    "qualifiedName": "arclm.PreTrainedModelLoader",
    "importPath": "arclm.PreTrainedModelLoader",
    "canonicalImport": "from arclm import PreTrainedModelLoader",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "PreTrainedModelLoader(source: Union[str, pathlib.Path], target_vocab_size: int, target_config: arclm.configs.base.Config, device: str = 'cpu', strict_loading: bool = False) -> None",
    "summary": "Load pre-trained models from multiple sources: - HuggingFace transformers - Local checkpoint files - Custom model paths Handles weight alignment and architecture mismatch gracefully.",
    "parameters": [
      [
        "source",
        "Union",
        "required"
      ],
      [
        "target_vocab_size",
        "int",
        "required"
      ],
      [
        "target_config",
        "Config",
        "required"
      ],
      [
        "device",
        "str",
        "'cpu'"
      ],
      [
        "strict_loading",
        "bool",
        "False"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import PreTrainedModelLoader\n\nprint(PreTrainedModelLoader)",
    "members": [
      [
        "load(self, revision: str | None = None, trust_remote_code: bool = False) -> tuple",
        "Load model and return (model, metadata)."
      ]
    ]
  },
  {
    "name": "ProcessedDataset",
    "qualifiedName": "arclm.ProcessedDataset",
    "importPath": "arclm.ProcessedDataset",
    "canonicalImport": "from arclm import ProcessedDataset",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "ProcessedDataset(samples: 'List[Dict[str, Any]]' = <factory>, source: 'Optional[str]' = None) -> None",
    "summary": "Kleine in-memory dataset voor formatting, cleaning en splits.",
    "parameters": [
      [
        "samples",
        "List[Dict[str, Any]]",
        "<factory>"
      ],
      [
        "source",
        "Optional[str]",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import ProcessedDataset\n\nprint(ProcessedDataset)",
    "members": [
      [
        "clean(self, text_keys: 'Optional[Iterable[str]]' = None) -> \"'ProcessedDataset'\"",
        "Normaliseert whitespace in tekstvelden."
      ],
      [
        "filter(self, predicate: 'Callable[[Dict[str, Any]], bool]') -> \"'ProcessedDataset'\"",
        "Houdt alleen voorbeelden waarvoor de predicate True teruggeeft."
      ],
      [
        "map_batches(self, function: 'Callable[[List[Dict[str, Any]]], Iterable[Dict[str, Any]]]', batch_size: 'int' = 32) -> \"'ProcessedDataset'\"",
        "Past een functie toe op batches van voorbeelden."
      ],
      [
        "split(self, train: 'float' = 0.8, validation: 'float' = 0.1, test: 'float' = 0.1, seed: 'int' = 42) -> 'Dict[str, List[Dict[str, Any]]]'",
        "Splitst de voorbeelden in train, validation en test lijsten."
      ],
      [
        "tokenize(self, tokenizer: 'Any', text_key: 'str' = 'text') -> \"'ProcessedDataset'\"",
        "Voegt token ids toe aan elk voorbeeld."
      ],
      [
        "transform(self, format: 'str' = 'pretraining', mapping: 'Optional[Dict[str, str]]' = None, template: 'Optional[str]' = None, text_fields: 'Optional[Iterable[str]]' = None, tokenizer: 'Any' = None) -> \"'ProcessedDataset'\"",
        "Zet voorbeelden om naar tekst voor pretraining, instructies of chat."
      ]
    ]
  },
  {
    "name": "RemoveDuplicates",
    "qualifiedName": "arclm.RemoveDuplicates",
    "importPath": "arclm.RemoveDuplicates",
    "canonicalImport": "from arclm import RemoveDuplicates",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "ExactDeduplicator(field: 'str | None' = None, fields: 'list[str] | tuple[str, ...] | None' = None, *, normalize: 'bool' = False, keep: 'str' = 'first', hash_algorithm: 'str | None' = None, missing: 'str' = 'keep')",
    "summary": "Verwijdert voorbeelden met dezelfde waarde in gekozen velden.",
    "parameters": [
      [
        "field",
        "str | None",
        "None"
      ],
      [
        "fields",
        "list[str] | tuple[str, ...] | None",
        "None"
      ],
      [
        "normalize",
        "bool",
        "False"
      ],
      [
        "keep",
        "str",
        "'first'"
      ],
      [
        "hash_algorithm",
        "str | None",
        "None"
      ],
      [
        "missing",
        "str",
        "'keep'"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import RemoveDuplicates\n\nprint(RemoveDuplicates)",
    "members": [
      [
        "deduplicate(self, dataset) -> 'DeduplicationResult'",
        "Geeft een dataset terug zonder exacte duplicaten."
      ]
    ]
  },
  {
    "name": "Sentence",
    "qualifiedName": "arclm.Sentence",
    "importPath": "arclm.Sentence",
    "canonicalImport": "from arclm import Sentence",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "Sentence()",
    "summary": "Basis class voor logische zinnen.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import Sentence\n\nprint(Sentence)",
    "members": [
      [
        "evaluate(self, model)",
        "Evalueert de zin met waarden uit een model."
      ],
      [
        "formula(self)",
        "Geeft de formule als tekst terug."
      ],
      [
        "iff(self, other)",
        "Maakt een als-en-alleen-als relatie tussen twee zinnen."
      ],
      [
        "implies(self, other)",
        "Maakt een implicatie: als deze zin waar is, dan de andere."
      ],
      [
        "parenthesize(text)",
        "Zet haakjes om een formule als dat nodig is."
      ],
      [
        "symbols(self)",
        "Geeft alle symbolen terug die in de zin voorkomen."
      ],
      [
        "validate(sentence)",
        "Controleert of een waarde een logische zin is."
      ]
    ]
  },
  {
    "name": "SentencePieceTokenizer",
    "qualifiedName": "arclm.SentencePieceTokenizer",
    "importPath": "arclm.SentencePieceTokenizer",
    "canonicalImport": "from arclm import SentencePieceTokenizer",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "SentencePieceTokenizer(max_vocab=50000, model_type='bpe', character_coverage=1.0, default_token='<UNK>', model_name=None, user_defined_symbols=None)",
    "summary": "SentencePiece tokenizer voor subword taalmodeltraining.",
    "parameters": [
      [
        "max_vocab",
        "Any",
        "50000"
      ],
      [
        "model_type",
        "Any",
        "'bpe'"
      ],
      [
        "character_coverage",
        "Any",
        "1.0"
      ],
      [
        "default_token",
        "Any",
        "'<UNK>'"
      ],
      [
        "model_name",
        "Any",
        "None"
      ],
      [
        "user_defined_symbols",
        "Any",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import SentencePieceTokenizer\n\nprint(SentencePieceTokenizer)",
    "members": [
      [
        "analyze_coverage(self, tokens, rare_threshold=2, top_unknown=20)",
        "Meet hoeveel SentencePiece stukjes bekend of onbekend zijn."
      ],
      [
        "build(self, text: str) -> dict",
        "Traint een SentencePiece tokenizer op ruwe tekst."
      ],
      [
        "decode(self, indices)",
        "Zet token ids terug naar SentencePiece stukjes."
      ],
      [
        "decode_string(self, indices)",
        "Zet token ids direct terug naar tekst."
      ],
      [
        "encode(self, tokens)",
        "Zet tokens om naar ids door ze eerst weer tekst te maken."
      ],
      [
        "encode_text(self, text, out_type=<class 'int'>)",
        "Zet ruwe tekst om naar SentencePiece token ids."
      ],
      [
        "from_checkpoint(metadata)",
        "Maakt een SentencePiece tokenizer vanuit checkpoint metadata."
      ],
      [
        "from_json(data)",
        "Maakt een SentencePiece tokenizer vanuit een JSON-vriendelijke dict."
      ],
      [
        "get_meta_data(self)",
        "Geeft korte metadata over de tokenizer terug."
      ],
      [
        "get_rare_tokens(self, min_count=2, limit=20)",
        "Geeft zeldzame whitespace-tokens uit de trainingstekst terug."
      ],
      [
        "get_unknown_index(self)",
        "Geeft de index terug voor onbekende SentencePiece stukjes."
      ],
      [
        "get_vocab_size(self)",
        "Geeft het aantal tokens in de vocabulaire terug."
      ]
    ]
  },
  {
    "name": "SFTConfig",
    "qualifiedName": "arclm.SFTConfig",
    "importPath": "arclm.SFTConfig",
    "canonicalImport": "from arclm import SFTConfig",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "SFTConfig(epochs: 'int' = 3, batch_size: 'int' = 8, learning_rate: 'float' = 2e-05, weight_decay: 'float' = 0.0, gradient_accumulation_steps: 'int' = 1, precision: 'str' = 'fp32', max_grad_norm: 'float | None' = 1.0, output_dir: 'str' = 'outputs', save_every_steps: 'int' = 500, keep_last_checkpoints: 'int | None' = 3, log_every_steps: 'int' = 10, optimizer: 'str' = 'adamw', scheduler: 'str' = 'constant', warmup_steps: 'int' = 0, max_steps: 'int | None' = None, device: 'str | None' = None, num_workers: 'int' = 0, shuffle: 'bool' = True, text_field: 'str | None' = 'text', instruction_field: 'str | None' = None, input_field: 'str | None' = None, response_field: 'str | None' = None, prompt_field: 'str | None' = None, messages_field: 'str | None' = None, max_length: 'int' = 1024, padding: 'str' = 'longest', truncation: 'bool' = True, packing: 'bool' = False, assistant_only_loss: 'bool' = False, add_eos_token: 'bool' = True, ignore_index: 'int' = -100, label_shift: 'bool' = True, chat_template: 'str | None' = None) -> None",
    "summary": "Bewaart instellingen voor supervised fine-tuning.",
    "parameters": [
      [
        "epochs",
        "int",
        "3"
      ],
      [
        "batch_size",
        "int",
        "8"
      ],
      [
        "learning_rate",
        "float",
        "2e-05"
      ],
      [
        "weight_decay",
        "float",
        "0.0"
      ],
      [
        "gradient_accumulation_steps",
        "int",
        "1"
      ],
      [
        "precision",
        "str",
        "'fp32'"
      ],
      [
        "max_grad_norm",
        "float | None",
        "1.0"
      ],
      [
        "output_dir",
        "str",
        "'outputs'"
      ],
      [
        "save_every_steps",
        "int",
        "500"
      ],
      [
        "keep_last_checkpoints",
        "int | None",
        "3"
      ],
      [
        "log_every_steps",
        "int",
        "10"
      ],
      [
        "optimizer",
        "str",
        "'adamw'"
      ],
      [
        "scheduler",
        "str",
        "'constant'"
      ],
      [
        "warmup_steps",
        "int",
        "0"
      ],
      [
        "max_steps",
        "int | None",
        "None"
      ],
      [
        "device",
        "str | None",
        "None"
      ],
      [
        "num_workers",
        "int",
        "0"
      ],
      [
        "shuffle",
        "bool",
        "True"
      ],
      [
        "text_field",
        "str | None",
        "'text'"
      ],
      [
        "instruction_field",
        "str | None",
        "None"
      ],
      [
        "input_field",
        "str | None",
        "None"
      ],
      [
        "response_field",
        "str | None",
        "None"
      ],
      [
        "prompt_field",
        "str | None",
        "None"
      ],
      [
        "messages_field",
        "str | None",
        "None"
      ],
      [
        "max_length",
        "int",
        "1024"
      ],
      [
        "padding",
        "str",
        "'longest'"
      ],
      [
        "truncation",
        "bool",
        "True"
      ],
      [
        "packing",
        "bool",
        "False"
      ],
      [
        "assistant_only_loss",
        "bool",
        "False"
      ],
      [
        "add_eos_token",
        "bool",
        "True"
      ],
      [
        "ignore_index",
        "int",
        "-100"
      ],
      [
        "label_shift",
        "bool",
        "True"
      ],
      [
        "chat_template",
        "str | None",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import SFTConfig\n\nprint(SFTConfig)",
    "members": [
      [
        "from_dict(values: 'dict[str, Any]') -> \"'TrainingConfig'\"",
        "Maakt een config vanuit een dict."
      ],
      [
        "to_dict(self) -> 'dict[str, Any]'",
        "Zet de config om naar een gewone dict."
      ],
      [
        "validate(self) -> 'None'",
        "Controleert of de SFT instellingen bruikbaar zijn."
      ]
    ]
  },
  {
    "name": "SFTDataCollator",
    "qualifiedName": "arclm.SFTDataCollator",
    "importPath": "arclm.SFTDataCollator",
    "canonicalImport": "from arclm import SFTDataCollator",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "SFTDataCollator(tokenizer=None, config: 'SFTConfig | None' = None, tokenizer_adapter=None)",
    "summary": "Zet SFT voorbeelden om naar tensors voor de trainer.",
    "parameters": [
      [
        "tokenizer",
        "Any",
        "None"
      ],
      [
        "config",
        "SFTConfig | None",
        "None"
      ],
      [
        "tokenizer_adapter",
        "Any",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import SFTDataCollator\n\nprint(SFTDataCollator)",
    "members": [
      [
        "pad_features(self, features: 'list[dict[str, list[int]]]')",
        "Vult features aan tot dezelfde lengte en geeft tensors terug."
      ],
      [
        "prepare_feature(self, example: 'dict[str, Any]') -> 'dict[str, list[int]]'",
        "Tokenizet \u00e9\u00e9n voorbeeld en maakt labels."
      ],
      [
        "prepare_tokenized_feature(self, example: 'dict[str, Any]') -> 'dict[str, list[int]]'",
        "Maakt een feature van al getokenizede data."
      ],
      [
        "target_length(self, features: 'list[dict[str, list[int]]]') -> 'int'",
        "Bepaalt de lengte waarnaar we padding toepassen."
      ]
    ]
  },
  {
    "name": "SFTRecordContract",
    "qualifiedName": "arclm.SFTRecordContract",
    "importPath": "arclm.SFTRecordContract",
    "canonicalImport": "from arclm import SFTRecordContract",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "SFTRecordContract(format: 'str', required_fields: 'tuple[str, ...]', optional_fields: 'tuple[str, ...]' = (), description: 'str' = '') -> None",
    "summary": "Public description of accepted SFT record fields.",
    "parameters": [
      [
        "format",
        "str",
        "required"
      ],
      [
        "required_fields",
        "tuple[str, ...]",
        "required"
      ],
      [
        "optional_fields",
        "tuple[str, ...]",
        "()"
      ],
      [
        "description",
        "str",
        "''"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import SFTRecordContract\n\nprint(SFTRecordContract)",
    "members": [
      [
        "to_dict(self) -> 'dict[str, Any]'",
        "Return JSON-safe contract data."
      ]
    ]
  },
  {
    "name": "SFTTrainer",
    "qualifiedName": "arclm.SFTTrainer",
    "importPath": "arclm.SFTTrainer",
    "canonicalImport": "from arclm import SFTTrainer",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "SFTTrainer(model, tokenizer=None, train_dataset=None, config: 'SFTConfig | None' = None, validation_dataset=None, model_adapter=None, tokenizer_adapter=None, optimizer=None, scheduler=None, callbacks=None, collate_fn=None)",
    "summary": "Traint een tekstmodel met instruction-, chat- of tekstdatasets.",
    "parameters": [
      [
        "model",
        "Any",
        "required"
      ],
      [
        "tokenizer",
        "Any",
        "None"
      ],
      [
        "train_dataset",
        "Any",
        "None"
      ],
      [
        "config",
        "SFTConfig | None",
        "None"
      ],
      [
        "validation_dataset",
        "Any",
        "None"
      ],
      [
        "model_adapter",
        "Any",
        "None"
      ],
      [
        "tokenizer_adapter",
        "Any",
        "None"
      ],
      [
        "optimizer",
        "Any",
        "None"
      ],
      [
        "scheduler",
        "Any",
        "None"
      ],
      [
        "callbacks",
        "Any",
        "None"
      ],
      [
        "collate_fn",
        "Any",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import SFTTrainer\n\nprint(SFTTrainer)",
    "members": [
      [
        "evaluate(self, dataset=None)",
        "Evalueert het model met de bestaande evaluatie-integratie."
      ],
      [
        "load_checkpoint(self, path)",
        "Laadt een checkpoint via de bestaande Trainer."
      ],
      [
        "resume(self, path)",
        "Laadt een checkpoint om verder te trainen."
      ],
      [
        "save_checkpoint(self, path=None)",
        "Slaat training en SFT metadata op."
      ],
      [
        "save_metadata(self, path) -> 'Path'",
        "Bewaart kleine SFT metadata naast het checkpoint."
      ],
      [
        "save_model_artifact(self, path, *, config=None, training_summary=None, evaluation_summary=None, overwrite=False)",
        "Bewaart het finale modelartifact, niet de training checkpoint-state."
      ],
      [
        "train(self, resume_from_checkpoint=None)",
        "Start fine-tuning en geeft de training state terug."
      ]
    ]
  },
  {
    "name": "SFTTrainingResult",
    "qualifiedName": "arclm.SFTTrainingResult",
    "importPath": "arclm.SFTTrainingResult",
    "canonicalImport": "from arclm import SFTTrainingResult",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "SFTTrainingResult(model: 'str', dataset: 'str', output_dir: 'str', backend: 'str', use_lora: 'bool', assistant_only_loss: 'bool', train_loss_history: 'List[float]', steps: 'int', metadata_path: 'str', adapter_path: 'Optional[str]' = None, full_model_path: 'Optional[str]' = None) -> None",
    "summary": "Result returned by ``train_sft``.",
    "parameters": [
      [
        "model",
        "str",
        "required"
      ],
      [
        "dataset",
        "str",
        "required"
      ],
      [
        "output_dir",
        "str",
        "required"
      ],
      [
        "backend",
        "str",
        "required"
      ],
      [
        "use_lora",
        "bool",
        "required"
      ],
      [
        "assistant_only_loss",
        "bool",
        "required"
      ],
      [
        "train_loss_history",
        "List[float]",
        "required"
      ],
      [
        "steps",
        "int",
        "required"
      ],
      [
        "metadata_path",
        "str",
        "required"
      ],
      [
        "adapter_path",
        "Optional[str]",
        "None"
      ],
      [
        "full_model_path",
        "Optional[str]",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import SFTTrainingResult\n\nprint(SFTTrainingResult)",
    "members": []
  },
  {
    "name": "SmartLoader",
    "qualifiedName": "arclm.SmartLoader",
    "importPath": "arclm.SmartLoader",
    "canonicalImport": "from arclm import SmartLoader",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "SmartLoader()",
    "summary": "High-level loading entry point with inspection and manual overrides.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import SmartLoader\n\nprint(SmartLoader)",
    "members": [
      [
        "inspect(source: 'Any', auto_detect: 'bool' = True, **overrides: 'Any') -> 'LoadPlan'",
        "Inspecteert een modelbron en geeft metadata terug."
      ],
      [
        "load(source: 'Any', auto_detect: 'bool' = True, map_location: 'str' = 'cpu', **overrides: 'Any') -> 'LoadedCheckpoint'",
        "Laadt de opgegeven bron."
      ],
      [
        "register_inspector(inspector: 'ModelInspector') -> 'None'",
        "Voert `register inspector` uit."
      ]
    ]
  },
  {
    "name": "StoppingCriteria",
    "qualifiedName": "arclm.StoppingCriteria",
    "importPath": "arclm.StoppingCriteria",
    "canonicalImport": "from arclm import StoppingCriteria",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "StoppingCriteria(max_steps: Optional[int] = None, early_stopping_patience: Optional[int] = None, early_stopping_min_delta: float = 0.0) -> None",
    "summary": "Base stopping criteria for training loop control.",
    "parameters": [
      [
        "max_steps",
        "Optional",
        "None"
      ],
      [
        "early_stopping_patience",
        "Optional",
        "None"
      ],
      [
        "early_stopping_min_delta",
        "float",
        "0.0"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import StoppingCriteria\n\nprint(StoppingCriteria)",
    "members": [
      [
        "should_stop_by_steps(self, current_step: int) -> bool",
        "Check if max_steps exceeded."
      ],
      [
        "should_stop_by_validation(self, val_loss: float, best_val_loss: float, patience_counter: int) -> bool",
        "Check if early stopping criteria met."
      ]
    ]
  },
  {
    "name": "StreamingDataset",
    "qualifiedName": "arclm.StreamingDataset",
    "importPath": "arclm.StreamingDataset",
    "canonicalImport": "from arclm import StreamingDataset",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "StreamingDataset(factory: 'Callable[[], Iterator[dict[str, Any]]]')",
    "summary": "Dataset die voorbeelden pas leest tijdens het itereren.",
    "parameters": [
      [
        "factory",
        "Callable[[], Iterator[dict[str, Any]]]",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import StreamingDataset\n\nprint(StreamingDataset)",
    "members": [
      [
        "from_csv(path: 'str | Path', encoding: 'str' = 'utf-8') -> \"'StreamingDataset'\"",
        "Leest een CSV-bestand rij voor rij."
      ],
      [
        "from_jsonl(path: 'str | Path', encoding: 'str' = 'utf-8') -> \"'StreamingDataset'\"",
        "Leest een JSONL-bestand regel voor regel."
      ],
      [
        "from_txt(path: 'str | Path', text_field: 'str' = 'text', encoding: 'str' = 'utf-8') -> \"'StreamingDataset'\"",
        "Leest een tekstbestand regel voor regel."
      ]
    ]
  },
  {
    "name": "Symbol",
    "qualifiedName": "arclm.Symbol",
    "importPath": "arclm.Symbol",
    "canonicalImport": "from arclm import Symbol",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "Symbol(name)",
    "summary": "Een enkel logisch symbool, zoals P of Q.",
    "parameters": [
      [
        "name",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import Symbol\n\nprint(Symbol)",
    "members": [
      [
        "evaluate(self, model)",
        "Haalt de waarde van dit symbool uit het model."
      ],
      [
        "formula(self)",
        "Geeft de formuletekst van dit symbool terug."
      ],
      [
        "iff(self, other)",
        "Maakt een als-en-alleen-als relatie tussen twee zinnen."
      ],
      [
        "implies(self, other)",
        "Maakt een implicatie: als deze zin waar is, dan de andere."
      ],
      [
        "parenthesize(text)",
        "Zet haakjes om een formule als dat nodig is."
      ],
      [
        "symbols(self)",
        "Geeft dit ene symbool terug als set."
      ],
      [
        "validate(sentence)",
        "Controleert of een waarde een logische zin is."
      ]
    ]
  },
  {
    "name": "TextDataset",
    "qualifiedName": "arclm.TextDataset",
    "importPath": "arclm.TextDataset",
    "canonicalImport": "from arclm import TextDataset",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "TextDataset(data, block_size)",
    "summary": "Dataset voor taalmodeltraining met een schuivend venster.",
    "parameters": [
      [
        "data",
        "Any",
        "required"
      ],
      [
        "block_size",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import TextDataset\n\nprint(TextDataset)",
    "members": []
  },
  {
    "name": "TextGenerator",
    "qualifiedName": "arclm.TextGenerator",
    "importPath": "arclm.TextGenerator",
    "canonicalImport": "from arclm import TextGenerator",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "Generator(model, stoi, itos, block_size, device, tokenizer=None)",
    "summary": "Generate tokens from a trained native causal language model.",
    "parameters": [
      [
        "model",
        "Any",
        "required"
      ],
      [
        "stoi",
        "Any",
        "required"
      ],
      [
        "itos",
        "Any",
        "required"
      ],
      [
        "block_size",
        "Any",
        "required"
      ],
      [
        "device",
        "Any",
        "required"
      ],
      [
        "tokenizer",
        "Any",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import TextGenerator\n\nprint(TextGenerator)",
    "members": [
      [
        "generate(self, start_text, max_new_tokens=20, temperature=1.0, repetition_penalty=1.0, top_k=None, top_p=None)",
        "Generate tokens from ``start_text`` with the native ArcLM model."
      ],
      [
        "generate_stream(self, start_text, max_new_tokens=20, temperature=1.0, repetition_penalty=1.0, top_k=None, top_p=None, cancel_check=None)",
        "Yield decoded generated token text during native ArcLM inference."
      ],
      [
        "generate_string(self, start_text, max_new_tokens=20, temperature=1.0, repetition_penalty=1.0, top_k=None, top_p=None)",
        "Generate text and return it as a string."
      ]
    ]
  },
  {
    "name": "Tokenizer",
    "qualifiedName": "arclm.Tokenizer",
    "importPath": "arclm.Tokenizer",
    "canonicalImport": "from arclm import Tokenizer",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "Tokenizer(max_vocab=50000, default_token='<UNK>', user_defined_symbols=None)",
    "summary": "Zet tekst om naar woord-tokens en token ids.",
    "parameters": [
      [
        "max_vocab",
        "Any",
        "50000"
      ],
      [
        "default_token",
        "Any",
        "'<UNK>'"
      ],
      [
        "user_defined_symbols",
        "Any",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import Tokenizer\n\nprint(Tokenizer)",
    "members": [
      [
        "analyze_coverage(self, tokens, rare_threshold=2, top_unknown=20)",
        "Meet hoeveel tokens bekend, onbekend of zeldzaam zijn."
      ],
      [
        "build(self, text)",
        "Bouwt de vocabulaire op basis van tekst."
      ],
      [
        "decode(self, indices)",
        "Zet token ids terug naar tokens."
      ],
      [
        "decode_string(self, indices)",
        "Zet token ids terug naar een tekststring."
      ],
      [
        "encode(self, tokens)",
        "Zet tokens om naar token ids."
      ],
      [
        "encode_text(self, text)",
        "Zet ruwe tekst om naar token ids."
      ],
      [
        "from_json(data)",
        "Maakt een woord-tokenizer vanuit een JSON-vriendelijke dict."
      ],
      [
        "get_rare_tokens(self, min_count=2, limit=20)",
        "Geeft tokens terug die weinig voorkwamen tijdens het bouwen."
      ],
      [
        "get_unknown_index(self)",
        "Geeft de index terug die voor onbekende tokens wordt gebruikt."
      ],
      [
        "get_vocab_size(self)",
        "Geeft het aantal tokens in de vocabulaire terug."
      ],
      [
        "load_vocab(self, path)",
        "Laadt de vocabulaire uit een tekstbestand."
      ],
      [
        "save(self, path)",
        "Slaat de tokenizer op als JSON-bestand."
      ]
    ]
  },
  {
    "name": "TokenizerAdapter",
    "qualifiedName": "arclm.TokenizerAdapter",
    "importPath": "arclm.TokenizerAdapter",
    "canonicalImport": "from arclm import TokenizerAdapter",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "TokenizerAdapter(tokenizer, pad_token_id: 'int | None' = None, eos_token_id: 'int | None' = None)",
    "summary": "Zet verschillende tokenizers om naar \u00e9\u00e9n eenvoudige interface.",
    "parameters": [
      [
        "tokenizer",
        "Any",
        "required"
      ],
      [
        "pad_token_id",
        "int | None",
        "None"
      ],
      [
        "eos_token_id",
        "int | None",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import TokenizerAdapter\n\nprint(TokenizerAdapter)",
    "members": [
      [
        "apply_chat_template(self, messages, **kwargs)",
        "Gebruikt een tokenizer-native chat template als die bestaat."
      ],
      [
        "decode(self, ids)",
        "Zet token ids terug naar tekst als de tokenizer dat kan."
      ],
      [
        "encode(self, text: 'str', max_length: 'int | None' = None, truncation: 'bool' = True)",
        "Zet tekst om naar token ids."
      ],
      [
        "has_chat_template(self) -> 'bool'",
        "Controleert of de tokenizer een chat template heeft."
      ]
    ]
  },
  {
    "name": "TokenizerFactory",
    "qualifiedName": "arclm.TokenizerFactory",
    "importPath": "arclm.TokenizerFactory",
    "canonicalImport": "from arclm import TokenizerFactory",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "TokenizerFactory()",
    "summary": "Kiest en maakt tokenizer classes op basis van een korte naam.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import TokenizerFactory\n\nprint(TokenizerFactory)",
    "members": [
      [
        "create(tokenizer_type='word', **kwargs)",
        "Maakt een tokenizer op basis van de geregistreerde type-naam."
      ],
      [
        "from_config(config)",
        "Maakt een tokenizer vanuit een config-achtig object."
      ],
      [
        "register(tokenizer_type, tokenizer_class)",
        "Registreert een tokenizer class onder een type-naam."
      ]
    ]
  },
  {
    "name": "TopKPrediction",
    "qualifiedName": "arclm.TopKPrediction",
    "importPath": "arclm.TopKPrediction",
    "canonicalImport": "from arclm import TopKPrediction",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "TopKPrediction(rank: int, token: str, probability: float) -> None",
    "summary": "One next-token prediction.",
    "parameters": [
      [
        "rank",
        "int",
        "required"
      ],
      [
        "token",
        "str",
        "required"
      ],
      [
        "probability",
        "float",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import TopKPrediction\n\nprint(TopKPrediction)",
    "members": []
  },
  {
    "name": "Trainer",
    "qualifiedName": "arclm.Trainer",
    "importPath": "arclm.Trainer",
    "canonicalImport": "from arclm import Trainer",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "Trainer(model, optimizer=None, criterion=None, config=None, *, train_dataset=None, validation_dataset=None, train_dataloader=None, validation_dataloader=None, scheduler=None, callbacks=None, event_logger=None, collate_fn=None, distributed_config=None)",
    "summary": "Traint een model op \u00e9\u00e9n apparaat.",
    "parameters": [
      [
        "model",
        "Any",
        "required"
      ],
      [
        "optimizer",
        "Any",
        "None"
      ],
      [
        "criterion",
        "Any",
        "None"
      ],
      [
        "config",
        "Any",
        "None"
      ],
      [
        "train_dataset",
        "Any",
        "None"
      ],
      [
        "validation_dataset",
        "Any",
        "None"
      ],
      [
        "train_dataloader",
        "Any",
        "None"
      ],
      [
        "validation_dataloader",
        "Any",
        "None"
      ],
      [
        "scheduler",
        "Any",
        "None"
      ],
      [
        "callbacks",
        "Any",
        "None"
      ],
      [
        "event_logger",
        "Any",
        "None"
      ],
      [
        "collate_fn",
        "Any",
        "None"
      ],
      [
        "distributed_config",
        "Any",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import Trainer\n\nprint(Trainer)",
    "members": [
      [
        "compute_loss(self, logits, y, loss_mask=None)",
        "Berekent next-token loss, eventueel alleen op gemaskeerde tokens."
      ],
      [
        "evaluate(self, dataset=None)",
        "Voert evaluatie uit en geeft metrics terug."
      ],
      [
        "exists(self, model_path)",
        "Controleert of een checkpoint bestaat."
      ],
      [
        "freeze_layers(self, pattern: str = 'blocks', verbose: bool = True) -> int",
        "Bevriest lagen waarvan de naam bij het patroon past."
      ],
      [
        "get_frozen_layers_info(self) -> dict",
        "Geeft info over bevroren en trainbare lagen."
      ],
      [
        "get_generalization_gap(self)",
        "Geeft de generalisatie gap terug."
      ],
      [
        "get_learning_rate(self)",
        "Geeft de huidige learning rate terug."
      ],
      [
        "get_train_history(self)",
        "Geeft de training history terug."
      ],
      [
        "load(self, model_path)",
        "Laadt een oud-stijl ArcLM checkpoint."
      ],
      [
        "load_checkpoint(self, path, *, synchronize=None)",
        "Laadt een training checkpoint."
      ],
      [
        "prepare_batch(self, batch)",
        "Zet tensors in een batch op het juiste apparaat."
      ],
      [
        "restore_best_model(self)",
        "Herstelt weights van de beste validatie loss als die bestaat."
      ]
    ]
  },
  {
    "name": "TrainingConfig",
    "qualifiedName": "arclm.TrainingConfig",
    "importPath": "arclm.TrainingConfig",
    "canonicalImport": "from arclm import TrainingConfig",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "Config(**kwargs)",
    "summary": "Houdt alle belangrijke ArcLM instellingen bij.",
    "parameters": [
      [
        "kwargs",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import TrainingConfig\n\nprint(TrainingConfig)",
    "members": [
      [
        "get_device(self)",
        "Geeft het ingestelde torch device terug."
      ],
      [
        "load_config_from_model(self, model_path)",
        "Laadt configwaarden uit een modelbron in dit object."
      ],
      [
        "set_safe(self, **kwargs)",
        "Zet config waarden veilig en negeert onbekende keys."
      ],
      [
        "to_dict(self)",
        "Zet de config om naar een gewone dict."
      ]
    ]
  },
  {
    "name": "TrainingResult",
    "qualifiedName": "arclm.TrainingResult",
    "importPath": "arclm.TrainingResult",
    "canonicalImport": "from arclm import TrainingResult",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "TrainingResult(mode: str, model_path: str, config: arclm.configs.base.Config, history: Dict[str, Any], vocab_size: int, tokenizer: Union[arclm.tokenizers.base.Tokenizer, arclm.tokenizers.base.SentencePieceTokenizer, NoneType] = None, checkpoint_source: Optional[str] = None) -> None",
    "summary": "Resultaat dat `train_model` teruggeeft na een trainingsrun.",
    "parameters": [
      [
        "mode",
        "str",
        "required"
      ],
      [
        "model_path",
        "str",
        "required"
      ],
      [
        "config",
        "Config",
        "required"
      ],
      [
        "history",
        "Dict",
        "required"
      ],
      [
        "vocab_size",
        "int",
        "required"
      ],
      [
        "tokenizer",
        "Union",
        "None"
      ],
      [
        "checkpoint_source",
        "Optional",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import TrainingResult\n\nprint(TrainingResult)",
    "members": []
  },
  {
    "name": "TrainingState",
    "qualifiedName": "arclm.TrainingState",
    "importPath": "arclm.TrainingState",
    "canonicalImport": "from arclm import TrainingState",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "TrainingState(epoch: 'int' = 0, step: 'int' = 0, global_step: 'int' = 0, optimizer_step: 'int' = 0, best_loss: 'float | None' = None, last_loss: 'float | None' = None, last_validation_loss: 'float | None' = None, learning_rate: 'float | None' = None, elapsed_seconds: 'float' = 0.0) -> None",
    "summary": "Houdt bij waar de training is.",
    "parameters": [
      [
        "epoch",
        "int",
        "0"
      ],
      [
        "step",
        "int",
        "0"
      ],
      [
        "global_step",
        "int",
        "0"
      ],
      [
        "optimizer_step",
        "int",
        "0"
      ],
      [
        "best_loss",
        "float | None",
        "None"
      ],
      [
        "last_loss",
        "float | None",
        "None"
      ],
      [
        "last_validation_loss",
        "float | None",
        "None"
      ],
      [
        "learning_rate",
        "float | None",
        "None"
      ],
      [
        "elapsed_seconds",
        "float",
        "0.0"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import TrainingState\n\nprint(TrainingState)",
    "members": [
      [
        "from_dict(values: 'dict[str, Any] | None') -> \"'TrainingState'\"",
        "Maakt een state vanuit checkpoint-data."
      ],
      [
        "to_dict(self) -> 'dict[str, Any]'",
        "Zet de state om naar een gewone dict."
      ]
    ]
  },
  {
    "name": "UnifiedPipeline",
    "qualifiedName": "arclm.UnifiedPipeline",
    "importPath": "arclm.UnifiedPipeline",
    "canonicalImport": "from arclm import UnifiedPipeline",
    "alternativeImport": "",
    "kind": "class",
    "category": "root",
    "status": "Stable",
    "signature": "UnifiedPipeline(config: arclm.configs.base.Config, mode: str = 'fine_tuning', pretrained_source: Union[str, pathlib.Path, NoneType] = None, stopping_criteria: Optional[arclm.training.unified.StoppingCriteria] = None)",
    "summary": "Unified training pipeline supporting multiple modes: - PRE_TRAINING: Train from scratch on large corpus - FINE_TUNING: Fine-tune pre-trained model on task data - INSTRUCTION_TUNING: Fine-tune on instruction-response pair",
    "parameters": [
      [
        "config",
        "Config",
        "required"
      ],
      [
        "mode",
        "str",
        "'fine_tuning'"
      ],
      [
        "pretrained_source",
        "Union",
        "None"
      ],
      [
        "stopping_criteria",
        "Optional",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import UnifiedPipeline\n\nprint(UnifiedPipeline)",
    "members": [
      [
        "build(self, vocab_size: int) -> 'UnifiedPipeline'",
        "Build model and trainer."
      ],
      [
        "get_model(self) -> arclm.models.text.causal_lm.ArcLM",
        "Get the trained model."
      ],
      [
        "save_checkpoint(self, path: Optional[str] = None) -> pathlib.Path",
        "Save model checkpoint with metadata."
      ],
      [
        "train(self, train_loader, val_loader=None, num_epochs: Optional[int] = None) -> Dict[str, Any]",
        "Execute training with stopping criteria."
      ]
    ]
  },
  {
    "name": "__version__",
    "qualifiedName": "arclm.__version__",
    "importPath": "arclm.__version__",
    "canonicalImport": "from arclm import __version__",
    "alternativeImport": "",
    "kind": "constant",
    "category": "root",
    "status": "Stable",
    "signature": "__version__",
    "summary": "str(object='') -> str str(bytes_or_buffer[, encoding[, errors]]) -> str Create a new string object from the given object.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import __version__\n\nprint(__version__)",
    "members": []
  },
  {
    "name": "DEFAULT_CONCEPT_BENCHMARKS",
    "qualifiedName": "arclm.DEFAULT_CONCEPT_BENCHMARKS",
    "importPath": "arclm.DEFAULT_CONCEPT_BENCHMARKS",
    "canonicalImport": "from arclm import DEFAULT_CONCEPT_BENCHMARKS",
    "alternativeImport": "",
    "kind": "constant",
    "category": "root",
    "status": "Stable",
    "signature": "DEFAULT_CONCEPT_BENCHMARKS",
    "summary": "Built-in mutable sequence.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import DEFAULT_CONCEPT_BENCHMARKS\n\nprint(DEFAULT_CONCEPT_BENCHMARKS)",
    "members": []
  },
  {
    "name": "DEFAULT_MODEL_PATH",
    "qualifiedName": "arclm.DEFAULT_MODEL_PATH",
    "importPath": "arclm.DEFAULT_MODEL_PATH",
    "canonicalImport": "from arclm import DEFAULT_MODEL_PATH",
    "alternativeImport": "",
    "kind": "constant",
    "category": "root",
    "status": "Stable",
    "signature": "DEFAULT_MODEL_PATH",
    "summary": "Path subclass for Windows systems.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import DEFAULT_MODEL_PATH\n\nprint(DEFAULT_MODEL_PATH)",
    "members": []
  },
  {
    "name": "adapt_for_training",
    "qualifiedName": "arclm.adapt_for_training",
    "importPath": "arclm.adapt_for_training",
    "canonicalImport": "from arclm import adapt_for_training",
    "alternativeImport": "",
    "kind": "function",
    "category": "root",
    "status": "Stable",
    "signature": "adapt_for_training(checkpoint: arclm.checkpoints.loaders.base.LoadedCheckpoint, target_config: Optional[arclm.configs.base.Config] = None, tokenizer: Optional[Any] = None, strict: bool = False, require_tokenizer_match: bool = False, **config_overrides) -> arclm.checkpoints.loaders.base.AdaptedModelBundle",
    "summary": "Create an ArcLM model from a normalized checkpoint.",
    "parameters": [
      [
        "checkpoint",
        "LoadedCheckpoint",
        "required"
      ],
      [
        "target_config",
        "Optional",
        "None"
      ],
      [
        "tokenizer",
        "Optional",
        "None"
      ],
      [
        "strict",
        "bool",
        "False"
      ],
      [
        "require_tokenizer_match",
        "bool",
        "False"
      ],
      [
        "config_overrides",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import adapt_for_training\n\nprint(adapt_for_training)",
    "members": []
  },
  {
    "name": "build_dataset_report",
    "qualifiedName": "arclm.build_dataset_report",
    "importPath": "arclm.build_dataset_report",
    "canonicalImport": "from arclm import build_dataset_report",
    "alternativeImport": "",
    "kind": "function",
    "category": "root",
    "status": "Stable",
    "signature": "build_dataset_report(records: 'Iterable[Mapping[str, Any]]', *, tokenizer: 'Any | None' = None, text_fields: 'Sequence[str]' = ('text',), validation_result: 'DatasetValidationResult | None' = None, manifest: 'DatasetManifest | None' = None, split_information: 'Mapping[str, int] | None' = None, duplicates_removed: 'int' = 0, empty_records_removed: 'int | None' = None, truncated_record_count: 'int' = 0, max_token_length: 'int | None' = None) -> 'DatasetReport'",
    "summary": "Build a processed dataset report with optional token statistics.",
    "parameters": [
      [
        "records",
        "Iterable[Mapping[str, Any]]",
        "required"
      ],
      [
        "tokenizer",
        "Any | None",
        "None"
      ],
      [
        "text_fields",
        "Sequence[str]",
        "('text',)"
      ],
      [
        "validation_result",
        "DatasetValidationResult | None",
        "None"
      ],
      [
        "manifest",
        "DatasetManifest | None",
        "None"
      ],
      [
        "split_information",
        "Mapping[str, int] | None",
        "None"
      ],
      [
        "duplicates_removed",
        "int",
        "0"
      ],
      [
        "empty_records_removed",
        "int | None",
        "None"
      ],
      [
        "truncated_record_count",
        "int",
        "0"
      ],
      [
        "max_token_length",
        "int | None",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import build_dataset_report\n\nprint(build_dataset_report)",
    "members": []
  },
  {
    "name": "build_evaluation_report",
    "qualifiedName": "arclm.build_evaluation_report",
    "importPath": "arclm.build_evaluation_report",
    "canonicalImport": "from arclm import build_evaluation_report",
    "alternativeImport": "",
    "kind": "function",
    "category": "root",
    "status": "Stable",
    "signature": "build_evaluation_report(result: 'EvaluationResult', *, model: 'Any | None' = None, checkpoint_identity: 'str | None' = None, dataset_identity: 'str | None' = None, num_tokens: 'int | None' = None, warnings: 'list[str] | tuple[str, ...]' = ()) -> 'EvaluationReport'",
    "summary": "Build a report from canonical evaluator metrics without recalculation.",
    "parameters": [
      [
        "result",
        "EvaluationResult",
        "required"
      ],
      [
        "model",
        "Any | None",
        "None"
      ],
      [
        "checkpoint_identity",
        "str | None",
        "None"
      ],
      [
        "dataset_identity",
        "str | None",
        "None"
      ],
      [
        "num_tokens",
        "int | None",
        "None"
      ],
      [
        "warnings",
        "list[str] | tuple[str, ...]",
        "()"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import build_evaluation_report\n\nprint(build_evaluation_report)",
    "members": []
  },
  {
    "name": "build_model",
    "qualifiedName": "arclm.build_model",
    "importPath": "arclm.build_model",
    "canonicalImport": "from arclm import build_model",
    "alternativeImport": "",
    "kind": "function",
    "category": "root",
    "status": "Stable",
    "signature": "build_model(config, vocab_size=None) -> arclm.models.text.causal_lm.ArcLM",
    "summary": "Maakt een ArcLM model vanuit config en zet het op het gekozen device.",
    "parameters": [
      [
        "config",
        "Any",
        "required"
      ],
      [
        "vocab_size",
        "Any",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import build_model\n\nprint(build_model)",
    "members": []
  },
  {
    "name": "build_trainer",
    "qualifiedName": "arclm.build_trainer",
    "importPath": "arclm.build_trainer",
    "canonicalImport": "from arclm import build_trainer",
    "alternativeImport": "",
    "kind": "function",
    "category": "root",
    "status": "Stable",
    "signature": "build_trainer(model, config, event_logger=None)",
    "summary": "Maakt de optimizer, loss function en Trainer voor een model.",
    "parameters": [
      [
        "model",
        "Any",
        "required"
      ],
      [
        "config",
        "Any",
        "required"
      ],
      [
        "event_logger",
        "Any",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import build_trainer\n\nprint(build_trainer)",
    "members": []
  },
  {
    "name": "build_training_diagnostics_report",
    "qualifiedName": "arclm.build_training_diagnostics_report",
    "importPath": "arclm.build_training_diagnostics_report",
    "canonicalImport": "from arclm import build_training_diagnostics_report",
    "alternativeImport": "",
    "kind": "function",
    "category": "root",
    "status": "Stable",
    "signature": "build_training_diagnostics_report(model, data, config)",
    "summary": "Build tokenizer, top-k, and concept benchmark diagnostics for a run.",
    "parameters": [
      [
        "model",
        "Any",
        "required"
      ],
      [
        "data",
        "Any",
        "required"
      ],
      [
        "config",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import build_training_diagnostics_report\n\nprint(build_training_diagnostics_report)",
    "members": []
  },
  {
    "name": "calculate_metrics",
    "qualifiedName": "arclm.calculate_metrics",
    "importPath": "arclm.calculate_metrics",
    "canonicalImport": "from arclm import calculate_metrics",
    "alternativeImport": "",
    "kind": "function",
    "category": "root",
    "status": "Stable",
    "signature": "calculate_metrics(model, val_loader, config, device='cpu')",
    "summary": "Calculate comprehensive evaluation metrics.",
    "parameters": [
      [
        "model",
        "Any",
        "required"
      ],
      [
        "val_loader",
        "Any",
        "required"
      ],
      [
        "config",
        "Any",
        "required"
      ],
      [
        "device",
        "Any",
        "'cpu'"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import calculate_metrics\n\nprint(calculate_metrics)",
    "members": []
  },
  {
    "name": "calculate_perplexity",
    "qualifiedName": "arclm.calculate_perplexity",
    "importPath": "arclm.calculate_perplexity",
    "canonicalImport": "from arclm import calculate_perplexity",
    "alternativeImport": "",
    "kind": "function",
    "category": "root",
    "status": "Stable",
    "signature": "calculate_perplexity(loss: 'float') -> 'float'",
    "summary": "Return perplexity for a cross-entropy loss value.",
    "parameters": [
      [
        "loss",
        "float",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import calculate_perplexity\n\nprint(calculate_perplexity)",
    "members": []
  },
  {
    "name": "checkpoint_is_compatible_for_continue_training",
    "qualifiedName": "arclm.checkpoint_is_compatible_for_continue_training",
    "importPath": "arclm.checkpoint_is_compatible_for_continue_training",
    "canonicalImport": "from arclm import checkpoint_is_compatible_for_continue_training",
    "alternativeImport": "",
    "kind": "function",
    "category": "root",
    "status": "Stable",
    "signature": "checkpoint_is_compatible_for_continue_training(checkpoint, config, vocab_size, tokenizer=None)",
    "summary": "Controleert of een checkpoint past bij continued training.",
    "parameters": [
      [
        "checkpoint",
        "Any",
        "required"
      ],
      [
        "config",
        "Any",
        "required"
      ],
      [
        "vocab_size",
        "Any",
        "required"
      ],
      [
        "tokenizer",
        "Any",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import checkpoint_is_compatible_for_continue_training\n\nprint(checkpoint_is_compatible_for_continue_training)",
    "members": []
  },
  {
    "name": "checkpoint_is_compatible_for_tuining",
    "qualifiedName": "arclm.checkpoint_is_compatible_for_tuining",
    "importPath": "arclm.checkpoint_is_compatible_for_tuining",
    "canonicalImport": "from arclm import checkpoint_is_compatible_for_tuining",
    "alternativeImport": "",
    "kind": "function",
    "category": "root",
    "status": "Deprecated",
    "signature": "checkpoint_is_compatible_for_tuining(checkpoint, config, vocab_size, tokenizer=None)",
    "summary": "Controleert of een checkpoint past bij finetuning.",
    "parameters": [
      [
        "checkpoint",
        "Any",
        "required"
      ],
      [
        "config",
        "Any",
        "required"
      ],
      [
        "vocab_size",
        "Any",
        "required"
      ],
      [
        "tokenizer",
        "Any",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import checkpoint_is_compatible_for_tuining\n\nprint(checkpoint_is_compatible_for_tuining)",
    "members": []
  },
  {
    "name": "continue_native_training",
    "qualifiedName": "arclm.continue_native_training",
    "importPath": "arclm.continue_native_training",
    "canonicalImport": "from arclm import continue_native_training",
    "alternativeImport": "",
    "kind": "function",
    "category": "root",
    "status": "Stable",
    "signature": "continue_native_training(*, data: 'str', output: 'str', checkpoint: 'str', **kwargs: 'Any') -> 'Any'",
    "summary": "Continue native ArcLM training via ``train_model``.",
    "parameters": [
      [
        "data",
        "str",
        "required"
      ],
      [
        "output",
        "str",
        "required"
      ],
      [
        "checkpoint",
        "str",
        "required"
      ],
      [
        "kwargs",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import continue_native_training\n\nprint(continue_native_training)",
    "members": []
  },
  {
    "name": "create_checkpoint_callback",
    "qualifiedName": "arclm.create_checkpoint_callback",
    "importPath": "arclm.create_checkpoint_callback",
    "canonicalImport": "from arclm import create_checkpoint_callback",
    "alternativeImport": "",
    "kind": "function",
    "category": "root",
    "status": "Stable",
    "signature": "create_checkpoint_callback(config, tokenizer, vocab_size)",
    "summary": "Maakt een callback die het laatste hervatbare checkpoint opslaat.",
    "parameters": [
      [
        "config",
        "Any",
        "required"
      ],
      [
        "tokenizer",
        "Any",
        "required"
      ],
      [
        "vocab_size",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import create_checkpoint_callback\n\nprint(create_checkpoint_callback)",
    "members": []
  },
  {
    "name": "create_config",
    "qualifiedName": "arclm.create_config",
    "importPath": "arclm.create_config",
    "canonicalImport": "from arclm import create_config",
    "alternativeImport": "",
    "kind": "function",
    "category": "root",
    "status": "Stable",
    "signature": "create_config(**kwargs) -> arclm.configs.base.Config",
    "summary": "Maakt een `Config` met praktische defaults.",
    "parameters": [
      [
        "kwargs",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import create_config\n\nprint(create_config)",
    "members": []
  },
  {
    "name": "create_dataloader",
    "qualifiedName": "arclm.create_dataloader",
    "importPath": "arclm.create_dataloader",
    "canonicalImport": "from arclm import create_dataloader",
    "alternativeImport": "",
    "kind": "function",
    "category": "root",
    "status": "Stable",
    "signature": "create_dataloader(encoded_data, block_size, batch_size, shuffle=True)",
    "summary": "Maakt een PyTorch DataLoader van token ids.",
    "parameters": [
      [
        "encoded_data",
        "Any",
        "required"
      ],
      [
        "block_size",
        "Any",
        "required"
      ],
      [
        "batch_size",
        "Any",
        "required"
      ],
      [
        "shuffle",
        "Any",
        "True"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import create_dataloader\n\nprint(create_dataloader)",
    "members": []
  },
  {
    "name": "create_dataset_manifest",
    "qualifiedName": "arclm.create_dataset_manifest",
    "importPath": "arclm.create_dataset_manifest",
    "canonicalImport": "from arclm import create_dataset_manifest",
    "alternativeImport": "",
    "kind": "function",
    "category": "root",
    "status": "Stable",
    "signature": "create_dataset_manifest(*, dataset_name: 'str', source_type: 'str', records_before: 'int', records_after: 'int', validation_result: 'DatasetValidationResult | None' = None, source_files: 'Sequence[str | Path]' = (), duplicates_removed: 'int' = 0, text_fields: 'Sequence[str]' = ('text',), transformations_applied: 'Sequence[str]' = (), split_information: 'Mapping[str, int] | None' = None) -> 'DatasetManifest'",
    "summary": "Create lightweight dataset provenance without storing record values.",
    "parameters": [
      [
        "dataset_name",
        "str",
        "required"
      ],
      [
        "source_type",
        "str",
        "required"
      ],
      [
        "records_before",
        "int",
        "required"
      ],
      [
        "records_after",
        "int",
        "required"
      ],
      [
        "validation_result",
        "DatasetValidationResult | None",
        "None"
      ],
      [
        "source_files",
        "Sequence[str | Path]",
        "()"
      ],
      [
        "duplicates_removed",
        "int",
        "0"
      ],
      [
        "text_fields",
        "Sequence[str]",
        "('text',)"
      ],
      [
        "transformations_applied",
        "Sequence[str]",
        "()"
      ],
      [
        "split_information",
        "Mapping[str, int] | None",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import create_dataset_manifest\n\nprint(create_dataset_manifest)",
    "members": []
  },
  {
    "name": "create_epoch_checkpoint_callback",
    "qualifiedName": "arclm.create_epoch_checkpoint_callback",
    "importPath": "arclm.create_epoch_checkpoint_callback",
    "canonicalImport": "from arclm import create_epoch_checkpoint_callback",
    "alternativeImport": "",
    "kind": "function",
    "category": "root",
    "status": "Stable",
    "signature": "create_epoch_checkpoint_callback(config, tokenizer, vocab_size)",
    "summary": "Oude alias voor `create_checkpoint_callback`.",
    "parameters": [
      [
        "config",
        "Any",
        "required"
      ],
      [
        "tokenizer",
        "Any",
        "required"
      ],
      [
        "vocab_size",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import create_epoch_checkpoint_callback\n\nprint(create_epoch_checkpoint_callback)",
    "members": []
  },
  {
    "name": "create_instruction_dataloader",
    "qualifiedName": "arclm.create_instruction_dataloader",
    "importPath": "arclm.create_instruction_dataloader",
    "canonicalImport": "from arclm import create_instruction_dataloader",
    "alternativeImport": "",
    "kind": "function",
    "category": "root",
    "status": "Stable",
    "signature": "create_instruction_dataloader(instructions, responses, tokenizer, block_size, batch_size, shuffle=True)",
    "summary": "Maakt een DataLoader voor instruction tuning.",
    "parameters": [
      [
        "instructions",
        "Any",
        "required"
      ],
      [
        "responses",
        "Any",
        "required"
      ],
      [
        "tokenizer",
        "Any",
        "required"
      ],
      [
        "block_size",
        "Any",
        "required"
      ],
      [
        "batch_size",
        "Any",
        "required"
      ],
      [
        "shuffle",
        "Any",
        "True"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import create_instruction_dataloader\n\nprint(create_instruction_dataloader)",
    "members": []
  },
  {
    "name": "create_simple_interface_app",
    "qualifiedName": "arclm.create_simple_interface_app",
    "importPath": "arclm.create_simple_interface_app",
    "canonicalImport": "from arclm import create_simple_interface_app",
    "alternativeImport": "",
    "kind": "function",
    "category": "root",
    "status": "Stable",
    "signature": "create_simple_interface_app()",
    "summary": "Create the optional Flask app for ArcLM's simple web interface.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import create_simple_interface_app\n\nprint(create_simple_interface_app)",
    "members": []
  },
  {
    "name": "create_symbols",
    "qualifiedName": "arclm.create_symbols",
    "importPath": "arclm.create_symbols",
    "canonicalImport": "from arclm import create_symbols",
    "alternativeImport": "",
    "kind": "function",
    "category": "root",
    "status": "Stable",
    "signature": "create_symbols(*names)",
    "summary": "Maakt meerdere symbolen en geeft ze terug in een dict.",
    "parameters": [
      [
        "names",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import create_symbols\n\nprint(create_symbols)",
    "members": []
  },
  {
    "name": "create_tokenizer",
    "qualifiedName": "arclm.create_tokenizer",
    "importPath": "arclm.create_tokenizer",
    "canonicalImport": "from arclm import create_tokenizer",
    "alternativeImport": "",
    "kind": "function",
    "category": "root",
    "status": "Stable",
    "signature": "create_tokenizer(tokenizer_type='word', **kwargs)",
    "summary": "Maakt een tokenizer met een korte type-naam.",
    "parameters": [
      [
        "tokenizer_type",
        "Any",
        "'word'"
      ],
      [
        "kwargs",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import create_tokenizer\n\nprint(create_tokenizer)",
    "members": []
  },
  {
    "name": "deduplicate",
    "qualifiedName": "arclm.deduplicate",
    "importPath": "arclm.deduplicate",
    "canonicalImport": "from arclm import deduplicate",
    "alternativeImport": "",
    "kind": "function",
    "category": "root",
    "status": "Stable",
    "signature": "deduplicate(dataset, *, return_result: 'bool' = False, **kwargs)",
    "summary": "Verwijdert exacte duplicaten met `ExactDeduplicator`.",
    "parameters": [
      [
        "dataset",
        "Any",
        "required"
      ],
      [
        "return_result",
        "bool",
        "False"
      ],
      [
        "kwargs",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import deduplicate\n\nprint(deduplicate)",
    "members": []
  },
  {
    "name": "evaluate",
    "qualifiedName": "arclm.evaluate",
    "importPath": "arclm.evaluate",
    "canonicalImport": "from arclm import evaluate",
    "alternativeImport": "",
    "kind": "function",
    "category": "root",
    "status": "Stable",
    "signature": "evaluate(model, dataset=None, metrics=None, config=None, **kwargs)",
    "summary": "Voert evaluatie uit met de standaard `Evaluator`.",
    "parameters": [
      [
        "model",
        "Any",
        "required"
      ],
      [
        "dataset",
        "Any",
        "None"
      ],
      [
        "metrics",
        "Any",
        "None"
      ],
      [
        "config",
        "Any",
        "None"
      ],
      [
        "kwargs",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import evaluate\n\nprint(evaluate)",
    "members": []
  },
  {
    "name": "export_metrics_to_json",
    "qualifiedName": "arclm.export_metrics_to_json",
    "importPath": "arclm.export_metrics_to_json",
    "canonicalImport": "from arclm import export_metrics_to_json",
    "alternativeImport": "",
    "kind": "function",
    "category": "root",
    "status": "Stable",
    "signature": "export_metrics_to_json(metrics_report, filepath)",
    "summary": "Export metrics report to JSON file.",
    "parameters": [
      [
        "metrics_report",
        "Any",
        "required"
      ],
      [
        "filepath",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import export_metrics_to_json\n\nprint(export_metrics_to_json)",
    "members": []
  },
  {
    "name": "export_metrics_to_markdown",
    "qualifiedName": "arclm.export_metrics_to_markdown",
    "importPath": "arclm.export_metrics_to_markdown",
    "canonicalImport": "from arclm import export_metrics_to_markdown",
    "alternativeImport": "",
    "kind": "function",
    "category": "root",
    "status": "Stable",
    "signature": "export_metrics_to_markdown(metrics_report, filepath)",
    "summary": "Export metrics report to Markdown file.",
    "parameters": [
      [
        "metrics_report",
        "Any",
        "required"
      ],
      [
        "filepath",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import export_metrics_to_markdown\n\nprint(export_metrics_to_markdown)",
    "members": []
  },
  {
    "name": "fine_tune_external_model",
    "qualifiedName": "arclm.fine_tune_external_model",
    "importPath": "arclm.fine_tune_external_model",
    "canonicalImport": "from arclm import fine_tune_external_model",
    "alternativeImport": "",
    "kind": "function",
    "category": "root",
    "status": "Stable",
    "signature": "fine_tune_external_model(model: 'str', dataset: 'str', output_dir: 'str', method: 'str' = 'sft', backend: 'str' = 'huggingface', use_lora: 'bool' = True, assistant_only_loss: 'bool' = True, save_config: 'Optional[ModelSaveConfig]' = None, **kwargs: 'Any') -> 'SFTTrainingResult'",
    "summary": "Fine-tune an external model through supported ArcLM training backends.",
    "parameters": [
      [
        "model",
        "str",
        "required"
      ],
      [
        "dataset",
        "str",
        "required"
      ],
      [
        "output_dir",
        "str",
        "required"
      ],
      [
        "method",
        "str",
        "'sft'"
      ],
      [
        "backend",
        "str",
        "'huggingface'"
      ],
      [
        "use_lora",
        "bool",
        "True"
      ],
      [
        "assistant_only_loss",
        "bool",
        "True"
      ],
      [
        "save_config",
        "Optional[ModelSaveConfig]",
        "None"
      ],
      [
        "kwargs",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import fine_tune_external_model\n\nprint(fine_tune_external_model)",
    "members": []
  },
  {
    "name": "fine_tune_native_model",
    "qualifiedName": "arclm.fine_tune_native_model",
    "importPath": "arclm.fine_tune_native_model",
    "canonicalImport": "from arclm import fine_tune_native_model",
    "alternativeImport": "",
    "kind": "function",
    "category": "root",
    "status": "Stable",
    "signature": "fine_tune_native_model(*, data: 'str', output: 'str', checkpoint: 'str', **kwargs: 'Any') -> 'Any'",
    "summary": "Fine-tune a native ArcLM checkpoint via ``train_model``.",
    "parameters": [
      [
        "data",
        "str",
        "required"
      ],
      [
        "output",
        "str",
        "required"
      ],
      [
        "checkpoint",
        "str",
        "required"
      ],
      [
        "kwargs",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import fine_tune_native_model\n\nprint(fine_tune_native_model)",
    "members": []
  },
  {
    "name": "format_concept_benchmark_report",
    "qualifiedName": "arclm.format_concept_benchmark_report",
    "importPath": "arclm.format_concept_benchmark_report",
    "canonicalImport": "from arclm import format_concept_benchmark_report",
    "alternativeImport": "",
    "kind": "function",
    "category": "root",
    "status": "Stable",
    "signature": "format_concept_benchmark_report(report)",
    "summary": "Create a readable concept benchmark report.",
    "parameters": [
      [
        "report",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import format_concept_benchmark_report\n\nprint(format_concept_benchmark_report)",
    "members": []
  },
  {
    "name": "format_duration",
    "qualifiedName": "arclm.format_duration",
    "importPath": "arclm.format_duration",
    "canonicalImport": "from arclm import format_duration",
    "alternativeImport": "",
    "kind": "function",
    "category": "root",
    "status": "Stable",
    "signature": "format_duration(total_seconds)",
    "summary": "Zet seconden om naar uren, minuten en seconden.",
    "parameters": [
      [
        "total_seconds",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import format_duration\n\nprint(format_duration)",
    "members": []
  },
  {
    "name": "format_long_context_results",
    "qualifiedName": "arclm.format_long_context_results",
    "importPath": "arclm.format_long_context_results",
    "canonicalImport": "from arclm import format_long_context_results",
    "alternativeImport": "",
    "kind": "function",
    "category": "root",
    "status": "Stable",
    "signature": "format_long_context_results(results)",
    "summary": "Create a readable long-context comparison report.",
    "parameters": [
      [
        "results",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import format_long_context_results\n\nprint(format_long_context_results)",
    "members": []
  },
  {
    "name": "format_tokenizer_coverage_report",
    "qualifiedName": "arclm.format_tokenizer_coverage_report",
    "importPath": "arclm.format_tokenizer_coverage_report",
    "canonicalImport": "from arclm import format_tokenizer_coverage_report",
    "alternativeImport": "",
    "kind": "function",
    "category": "root",
    "status": "Stable",
    "signature": "format_tokenizer_coverage_report(coverage)",
    "summary": "Create a readable tokenizer coverage report.",
    "parameters": [
      [
        "coverage",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import format_tokenizer_coverage_report\n\nprint(format_tokenizer_coverage_report)",
    "members": []
  },
  {
    "name": "format_top_k_predictions",
    "qualifiedName": "arclm.format_top_k_predictions",
    "importPath": "arclm.format_top_k_predictions",
    "canonicalImport": "from arclm import format_top_k_predictions",
    "alternativeImport": "",
    "kind": "function",
    "category": "root",
    "status": "Stable",
    "signature": "format_top_k_predictions(prompt, predictions)",
    "summary": "Create a readable diagnostic report for one prompt.",
    "parameters": [
      [
        "prompt",
        "Any",
        "required"
      ],
      [
        "predictions",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import format_top_k_predictions\n\nprint(format_top_k_predictions)",
    "members": []
  },
  {
    "name": "get_api_version",
    "qualifiedName": "arclm.get_api_version",
    "importPath": "arclm.get_api_version",
    "canonicalImport": "from arclm import get_api_version",
    "alternativeImport": "",
    "kind": "function",
    "category": "root",
    "status": "Stable",
    "signature": "get_api_version() -> 'str'",
    "summary": "Return the installed ArcLM API version.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import get_api_version\n\nprint(get_api_version)",
    "members": []
  },
  {
    "name": "get_device",
    "qualifiedName": "arclm.get_device",
    "importPath": "arclm.get_device",
    "canonicalImport": "from arclm import get_device",
    "alternativeImport": "",
    "kind": "function",
    "category": "root",
    "status": "Stable",
    "signature": "get_device()",
    "summary": "Return the preferred local torch device.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import get_device\n\nprint(get_device)",
    "members": []
  },
  {
    "name": "get_model_capability",
    "qualifiedName": "arclm.get_model_capability",
    "importPath": "arclm.get_model_capability",
    "canonicalImport": "from arclm import get_model_capability",
    "alternativeImport": "",
    "kind": "function",
    "category": "root",
    "status": "Stable",
    "signature": "get_model_capability(model: 'str') -> 'ModelCapabilityReport'",
    "summary": "Return the capability report for a known exact model path.",
    "parameters": [
      [
        "model",
        "str",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import get_model_capability\n\nprint(get_model_capability)",
    "members": []
  },
  {
    "name": "get_sft_record_contract",
    "qualifiedName": "arclm.get_sft_record_contract",
    "importPath": "arclm.get_sft_record_contract",
    "canonicalImport": "from arclm import get_sft_record_contract",
    "alternativeImport": "",
    "kind": "function",
    "category": "root",
    "status": "Stable",
    "signature": "get_sft_record_contract(formatter: 'str' = 'instruction_response') -> 'SFTRecordContract'",
    "summary": "Describe one supported SFT record format.",
    "parameters": [
      [
        "formatter",
        "str",
        "'instruction_response'"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import get_sft_record_contract\n\nprint(get_sft_record_contract)",
    "members": []
  },
  {
    "name": "get_tokenizer_from_config",
    "qualifiedName": "arclm.get_tokenizer_from_config",
    "importPath": "arclm.get_tokenizer_from_config",
    "canonicalImport": "from arclm import get_tokenizer_from_config",
    "alternativeImport": "",
    "kind": "function",
    "category": "root",
    "status": "Stable",
    "signature": "get_tokenizer_from_config(config)",
    "summary": "Maakt een tokenizer vanuit een config object.",
    "parameters": [
      [
        "config",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import get_tokenizer_from_config\n\nprint(get_tokenizer_from_config)",
    "members": []
  },
  {
    "name": "get_version",
    "qualifiedName": "arclm.get_version",
    "importPath": "arclm.get_version",
    "canonicalImport": "from arclm import get_version",
    "alternativeImport": "",
    "kind": "function",
    "category": "root",
    "status": "Stable",
    "signature": "get_version() -> 'str'",
    "summary": "Return the installed ArcLM version.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import get_version\n\nprint(get_version)",
    "members": []
  },
  {
    "name": "inspect_model_source",
    "qualifiedName": "arclm.inspect_model_source",
    "importPath": "arclm.inspect_model_source",
    "canonicalImport": "from arclm import inspect_model_source",
    "alternativeImport": "",
    "kind": "function",
    "category": "root",
    "status": "Stable",
    "signature": "inspect_model_source(source: 'PathLike', **kwargs: 'Any') -> 'ModelSourceInfo'",
    "summary": "Inspect a local path or Hugging Face model ID before loading.",
    "parameters": [
      [
        "source",
        "PathLike",
        "required"
      ],
      [
        "kwargs",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import inspect_model_source\n\nprint(inspect_model_source)",
    "members": []
  },
  {
    "name": "inspect_text",
    "qualifiedName": "arclm.inspect_text",
    "importPath": "arclm.inspect_text",
    "canonicalImport": "from arclm import inspect_text",
    "alternativeImport": "",
    "kind": "function",
    "category": "root",
    "status": "Stable",
    "signature": "inspect_text(*, model: 'Any', tokenizer: 'Any', text: 'str', max_new_tokens: 'int' = 1, temperature: 'float' = 1.0, repetition_penalty: 'float' = 1.0, top_k: 'int | None' = None, top_p: 'float | None' = None, include_values: 'bool' = False, max_values: 'int' = 20) -> 'PipelineTrace'",
    "summary": "Inspect one native ArcLM text-generation step.",
    "parameters": [
      [
        "model",
        "Any",
        "required"
      ],
      [
        "tokenizer",
        "Any",
        "required"
      ],
      [
        "text",
        "str",
        "required"
      ],
      [
        "max_new_tokens",
        "int",
        "1"
      ],
      [
        "temperature",
        "float",
        "1.0"
      ],
      [
        "repetition_penalty",
        "float",
        "1.0"
      ],
      [
        "top_k",
        "int | None",
        "None"
      ],
      [
        "top_p",
        "float | None",
        "None"
      ],
      [
        "include_values",
        "bool",
        "False"
      ],
      [
        "max_values",
        "int",
        "20"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import inspect_text\n\nprint(inspect_text)",
    "members": []
  },
  {
    "name": "list_available_models",
    "qualifiedName": "arclm.list_available_models",
    "importPath": "arclm.list_available_models",
    "canonicalImport": "from arclm import list_available_models",
    "alternativeImport": "",
    "kind": "function",
    "category": "root",
    "status": "Stable",
    "signature": "list_available_models(models_dir: 'str | Path' = 'models') -> 'list[str]'",
    "summary": "List local ``.pth`` checkpoints in a models directory.",
    "parameters": [
      [
        "models_dir",
        "str | Path",
        "'models'"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import list_available_models\n\nprint(list_available_models)",
    "members": []
  },
  {
    "name": "load_any_model",
    "qualifiedName": "arclm.load_any_model",
    "importPath": "arclm.load_any_model",
    "canonicalImport": "from arclm import load_any_model",
    "alternativeImport": "",
    "kind": "function",
    "category": "root",
    "status": "Stable",
    "signature": "load_any_model(source: 'PathLike', **kwargs: 'Any') -> 'ExternalLoadedModel'",
    "summary": "Load any supported ArcLM or Hugging Face causal LM source for inference.",
    "parameters": [
      [
        "source",
        "PathLike",
        "required"
      ],
      [
        "kwargs",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import load_any_model\n\nprint(load_any_model)",
    "members": []
  },
  {
    "name": "load_compatible_checkpoint",
    "qualifiedName": "arclm.load_compatible_checkpoint",
    "importPath": "arclm.load_compatible_checkpoint",
    "canonicalImport": "from arclm import load_compatible_checkpoint",
    "alternativeImport": "",
    "kind": "function",
    "category": "root",
    "status": "Stable",
    "signature": "load_compatible_checkpoint(trainer, config, vocab_size, tokenizer=None)",
    "summary": "Laadt een bestaand checkpoint als het past bij deze training.",
    "parameters": [
      [
        "trainer",
        "Any",
        "required"
      ],
      [
        "config",
        "Any",
        "required"
      ],
      [
        "vocab_size",
        "Any",
        "required"
      ],
      [
        "tokenizer",
        "Any",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import load_compatible_checkpoint\n\nprint(load_compatible_checkpoint)",
    "members": []
  },
  {
    "name": "load_dataset",
    "qualifiedName": "arclm.load_dataset",
    "importPath": "arclm.load_dataset",
    "canonicalImport": "from arclm import load_dataset",
    "alternativeImport": "",
    "kind": "function",
    "category": "root",
    "status": "Stable",
    "signature": "load_dataset(source: 'Any', **kwargs)",
    "summary": "Laadt een dataset met de standaard DatasetLoader.",
    "parameters": [
      [
        "source",
        "Any",
        "required"
      ],
      [
        "kwargs",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import load_dataset\n\nprint(load_dataset)",
    "members": []
  },
  {
    "name": "load_external_for_inference",
    "qualifiedName": "arclm.load_external_for_inference",
    "importPath": "arclm.load_external_for_inference",
    "canonicalImport": "from arclm import load_external_for_inference",
    "alternativeImport": "",
    "kind": "function",
    "category": "root",
    "status": "Stable",
    "signature": "load_external_for_inference(source: 'PathLike', **kwargs: 'Any') -> 'ExternalLoadedModel'",
    "summary": "Backward-friendly alias for :func:`load_any_model`.",
    "parameters": [
      [
        "source",
        "PathLike",
        "required"
      ],
      [
        "kwargs",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import load_external_for_inference\n\nprint(load_external_for_inference)",
    "members": []
  },
  {
    "name": "load_external_model",
    "qualifiedName": "arclm.load_external_model",
    "importPath": "arclm.load_external_model",
    "canonicalImport": "from arclm import load_external_model",
    "alternativeImport": "",
    "kind": "function",
    "category": "root",
    "status": "Stable",
    "signature": "load_external_model(source: Any, map_location: str = 'cpu') -> arclm.checkpoints.loaders.base.LoadedCheckpoint",
    "summary": "Load any supported external source into a normalized checkpoint bundle.",
    "parameters": [
      [
        "source",
        "Any",
        "required"
      ],
      [
        "map_location",
        "str",
        "'cpu'"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import load_external_model\n\nprint(load_external_model)",
    "members": []
  },
  {
    "name": "load_model",
    "qualifiedName": "arclm.load_model",
    "importPath": "arclm.load_model",
    "canonicalImport": "from arclm import load_model",
    "alternativeImport": "",
    "kind": "function",
    "category": "root",
    "status": "Stable",
    "signature": "load_model(model_path=None, device=None, prefer_best=True)",
    "summary": "Load a trained ArcLM checkpoint for inference.",
    "parameters": [
      [
        "model_path",
        "Any",
        "None"
      ],
      [
        "device",
        "Any",
        "None"
      ],
      [
        "prefer_best",
        "Any",
        "True"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import load_model\n\nprint(load_model)",
    "members": []
  },
  {
    "name": "load_tokens",
    "qualifiedName": "arclm.load_tokens",
    "importPath": "arclm.load_tokens",
    "canonicalImport": "from arclm import load_tokens",
    "alternativeImport": "",
    "kind": "function",
    "category": "root",
    "status": "Stable",
    "signature": "load_tokens(config)",
    "summary": "Laadt tokens uit de ingestelde dataset en optioneel uit domeindata.",
    "parameters": [
      [
        "config",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import load_tokens\n\nprint(load_tokens)",
    "members": []
  },
  {
    "name": "load_training_checkpoint",
    "qualifiedName": "arclm.load_training_checkpoint",
    "importPath": "arclm.load_training_checkpoint",
    "canonicalImport": "from arclm import load_training_checkpoint",
    "alternativeImport": "",
    "kind": "function",
    "category": "root",
    "status": "Stable",
    "signature": "load_training_checkpoint(path: 'str | Path', device_type: 'str' = 'cpu')",
    "summary": "Load a trusted ArcLM/PyTorch training checkpoint.",
    "parameters": [
      [
        "path",
        "str | Path",
        "required"
      ],
      [
        "device_type",
        "str",
        "'cpu'"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import load_training_checkpoint\n\nprint(load_training_checkpoint)",
    "members": []
  },
  {
    "name": "model_check",
    "qualifiedName": "arclm.model_check",
    "importPath": "arclm.model_check",
    "canonicalImport": "from arclm import model_check",
    "alternativeImport": "",
    "kind": "function",
    "category": "root",
    "status": "Stable",
    "signature": "model_check(knowledge, query)",
    "summary": "Controleert of kennis altijd de query waar maakt.",
    "parameters": [
      [
        "knowledge",
        "Any",
        "required"
      ],
      [
        "query",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import model_check\n\nprint(model_check)",
    "members": []
  },
  {
    "name": "model_support_matrix",
    "qualifiedName": "arclm.model_support_matrix",
    "importPath": "arclm.model_support_matrix",
    "canonicalImport": "from arclm import model_support_matrix",
    "alternativeImport": "",
    "kind": "function",
    "category": "root",
    "status": "Stable",
    "signature": "model_support_matrix() -> 'list[dict[str, object]]'",
    "summary": "Return the compact support matrix for the official 0.8 model set.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import model_support_matrix\n\nprint(model_support_matrix)",
    "members": []
  },
  {
    "name": "predict",
    "qualifiedName": "arclm.predict",
    "importPath": "arclm.predict",
    "canonicalImport": "from arclm import predict",
    "alternativeImport": "",
    "kind": "function",
    "category": "root",
    "status": "Stable",
    "signature": "predict(input_text, model_path=None, device=None, reload=False, **generation_options)",
    "summary": "Predict with a cached model using the same defaults as load_model().",
    "parameters": [
      [
        "input_text",
        "Any",
        "required"
      ],
      [
        "model_path",
        "Any",
        "None"
      ],
      [
        "device",
        "Any",
        "None"
      ],
      [
        "reload",
        "Any",
        "False"
      ],
      [
        "generation_options",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import predict\n\nprint(predict)",
    "members": []
  },
  {
    "name": "predict_external",
    "qualifiedName": "arclm.predict_external",
    "importPath": "arclm.predict_external",
    "canonicalImport": "from arclm import predict_external",
    "alternativeImport": "",
    "kind": "function",
    "category": "root",
    "status": "Stable",
    "signature": "predict_external(source: 'PathLike', prompt: 'str', **kwargs: 'Any') -> 'str'",
    "summary": "Load a source and return a single prediction.",
    "parameters": [
      [
        "source",
        "PathLike",
        "required"
      ],
      [
        "prompt",
        "str",
        "required"
      ],
      [
        "kwargs",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import predict_external\n\nprint(predict_external)",
    "members": []
  },
  {
    "name": "predict_top_k",
    "qualifiedName": "arclm.predict_top_k",
    "importPath": "arclm.predict_top_k",
    "canonicalImport": "from arclm import predict_top_k",
    "alternativeImport": "",
    "kind": "function",
    "category": "root",
    "status": "Stable",
    "signature": "predict_top_k(model, stoi, itos, block_size, device, prompt, k=5, tokenizer=None)",
    "summary": "Return the top-k next-token probabilities for a prompt.",
    "parameters": [
      [
        "model",
        "Any",
        "required"
      ],
      [
        "stoi",
        "Any",
        "required"
      ],
      [
        "itos",
        "Any",
        "required"
      ],
      [
        "block_size",
        "Any",
        "required"
      ],
      [
        "device",
        "Any",
        "required"
      ],
      [
        "prompt",
        "Any",
        "required"
      ],
      [
        "k",
        "Any",
        "5"
      ],
      [
        "tokenizer",
        "Any",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import predict_top_k\n\nprint(predict_top_k)",
    "members": []
  },
  {
    "name": "prepare_data",
    "qualifiedName": "arclm.prepare_data",
    "importPath": "arclm.prepare_data",
    "canonicalImport": "from arclm import prepare_data",
    "alternativeImport": "",
    "kind": "function",
    "category": "root",
    "status": "Stable",
    "signature": "prepare_data(config: 'Config', existing_tokenizer=None) -> 'DataBundle'",
    "summary": "Maakt tokens, splits, tokenizer en DataLoaders klaar voor training.",
    "parameters": [
      [
        "config",
        "Config",
        "required"
      ],
      [
        "existing_tokenizer",
        "Any",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import prepare_data\n\nprint(prepare_data)",
    "members": []
  },
  {
    "name": "read_tokens",
    "qualifiedName": "arclm.read_tokens",
    "importPath": "arclm.read_tokens",
    "canonicalImport": "from arclm import read_tokens",
    "alternativeImport": "",
    "kind": "function",
    "category": "root",
    "status": "Stable",
    "signature": "read_tokens(path, limit)",
    "summary": "Leest lowercase whitespace tokens uit een tekstbestand en bewaart newlines.",
    "parameters": [
      [
        "path",
        "Any",
        "required"
      ],
      [
        "limit",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import read_tokens\n\nprint(read_tokens)",
    "members": []
  },
  {
    "name": "register_model_inspector",
    "qualifiedName": "arclm.register_model_inspector",
    "importPath": "arclm.register_model_inspector",
    "canonicalImport": "from arclm import register_model_inspector",
    "alternativeImport": "",
    "kind": "function",
    "category": "root",
    "status": "Stable",
    "signature": "register_model_inspector(inspector: 'ModelInspector') -> 'None'",
    "summary": "Register a custom model-source inspector.",
    "parameters": [
      [
        "inspector",
        "ModelInspector",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import register_model_inspector\n\nprint(register_model_inspector)",
    "members": []
  },
  {
    "name": "report_environment",
    "qualifiedName": "arclm.report_environment",
    "importPath": "arclm.report_environment",
    "canonicalImport": "from arclm import report_environment",
    "alternativeImport": "",
    "kind": "function",
    "category": "root",
    "status": "Stable",
    "signature": "report_environment(models_dir: 'str | Path' = 'models') -> 'str'",
    "summary": "Return a short human-readable runtime report.",
    "parameters": [
      [
        "models_dir",
        "str | Path",
        "'models'"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import report_environment\n\nprint(report_environment)",
    "members": []
  },
  {
    "name": "run_long_context_evaluation",
    "qualifiedName": "arclm.run_long_context_evaluation",
    "importPath": "arclm.run_long_context_evaluation",
    "canonicalImport": "from arclm import run_long_context_evaluation",
    "alternativeImport": "",
    "kind": "function",
    "category": "root",
    "status": "Stable",
    "signature": "run_long_context_evaluation(base_config, block_sizes=(32, 64, 128), benchmark_cases=None, sample_prompt='Programming is')",
    "summary": "Train and compare multiple block sizes by validation loss and concepts.",
    "parameters": [
      [
        "base_config",
        "Any",
        "required"
      ],
      [
        "block_sizes",
        "Any",
        "(32, 64, 128)"
      ],
      [
        "benchmark_cases",
        "Any",
        "None"
      ],
      [
        "sample_prompt",
        "Any",
        "'Programming is'"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import run_long_context_evaluation\n\nprint(run_long_context_evaluation)",
    "members": []
  },
  {
    "name": "run_simple_interface",
    "qualifiedName": "arclm.run_simple_interface",
    "importPath": "arclm.run_simple_interface",
    "canonicalImport": "from arclm import run_simple_interface",
    "alternativeImport": "",
    "kind": "function",
    "category": "root",
    "status": "Stable",
    "signature": "run_simple_interface(*args, **kwargs)",
    "summary": "Run ArcLM's optional simple web interface.",
    "parameters": [
      [
        "args",
        "Any",
        "required"
      ],
      [
        "kwargs",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import run_simple_interface\n\nprint(run_simple_interface)",
    "members": []
  },
  {
    "name": "save_loaded_model",
    "qualifiedName": "arclm.save_loaded_model",
    "importPath": "arclm.save_loaded_model",
    "canonicalImport": "from arclm import save_loaded_model",
    "alternativeImport": "",
    "kind": "function",
    "category": "root",
    "status": "Stable",
    "signature": "save_loaded_model(loaded_model: 'ExternalLoadedModel', output_dir: 'PathLike', save_config: 'Optional[ModelSaveConfig]' = None) -> 'Optional[Path]'",
    "summary": "Save a loaded model according to :class:`ModelSaveConfig`.",
    "parameters": [
      [
        "loaded_model",
        "ExternalLoadedModel",
        "required"
      ],
      [
        "output_dir",
        "PathLike",
        "required"
      ],
      [
        "save_config",
        "Optional[ModelSaveConfig]",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import save_loaded_model\n\nprint(save_loaded_model)",
    "members": []
  },
  {
    "name": "save_training_checkpoint",
    "qualifiedName": "arclm.save_training_checkpoint",
    "importPath": "arclm.save_training_checkpoint",
    "canonicalImport": "from arclm import save_training_checkpoint",
    "alternativeImport": "",
    "kind": "function",
    "category": "root",
    "status": "Stable",
    "signature": "save_training_checkpoint(trainer, config, tokenizer, vocab_size)",
    "summary": "Slaat een trainer checkpoint op met tokenizer metadata.",
    "parameters": [
      [
        "trainer",
        "Any",
        "required"
      ],
      [
        "config",
        "Any",
        "required"
      ],
      [
        "tokenizer",
        "Any",
        "required"
      ],
      [
        "vocab_size",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import save_training_checkpoint\n\nprint(save_training_checkpoint)",
    "members": []
  },
  {
    "name": "score_concept_relationships",
    "qualifiedName": "arclm.score_concept_relationships",
    "importPath": "arclm.score_concept_relationships",
    "canonicalImport": "from arclm import score_concept_relationships",
    "alternativeImport": "",
    "kind": "function",
    "category": "root",
    "status": "Stable",
    "signature": "score_concept_relationships(model, stoi, itos, block_size, device, benchmark_cases=None, k=10, tokenizer=None)",
    "summary": "Score expected concepts against top-k next-token predictions.",
    "parameters": [
      [
        "model",
        "Any",
        "required"
      ],
      [
        "stoi",
        "Any",
        "required"
      ],
      [
        "itos",
        "Any",
        "required"
      ],
      [
        "block_size",
        "Any",
        "required"
      ],
      [
        "device",
        "Any",
        "required"
      ],
      [
        "benchmark_cases",
        "Any",
        "None"
      ],
      [
        "k",
        "Any",
        "10"
      ],
      [
        "tokenizer",
        "Any",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import score_concept_relationships\n\nprint(score_concept_relationships)",
    "members": []
  },
  {
    "name": "split_train_val",
    "qualifiedName": "arclm.split_train_val",
    "importPath": "arclm.split_train_val",
    "canonicalImport": "from arclm import split_train_val",
    "alternativeImport": "",
    "kind": "function",
    "category": "root",
    "status": "Stable",
    "signature": "split_train_val(tokens, validation_split, block_size, seed=42)",
    "summary": "Splitst tokens in train en validatie data.",
    "parameters": [
      [
        "tokens",
        "Any",
        "required"
      ],
      [
        "validation_split",
        "Any",
        "required"
      ],
      [
        "block_size",
        "Any",
        "required"
      ],
      [
        "seed",
        "Any",
        "42"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import split_train_val\n\nprint(split_train_val)",
    "members": []
  },
  {
    "name": "tokenizer_from_checkpoint",
    "qualifiedName": "arclm.tokenizer_from_checkpoint",
    "importPath": "arclm.tokenizer_from_checkpoint",
    "canonicalImport": "from arclm import tokenizer_from_checkpoint",
    "alternativeImport": "",
    "kind": "function",
    "category": "root",
    "status": "Stable",
    "signature": "tokenizer_from_checkpoint(checkpoint_or_source)",
    "summary": "Haalt een ArcLM tokenizer uit een checkpoint of checkpoint-pad.",
    "parameters": [
      [
        "checkpoint_or_source",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import tokenizer_from_checkpoint\n\nprint(tokenizer_from_checkpoint)",
    "members": []
  },
  {
    "name": "train_model",
    "qualifiedName": "arclm.train_model",
    "importPath": "arclm.train_model",
    "canonicalImport": "from arclm import train_model",
    "alternativeImport": "",
    "kind": "function",
    "category": "root",
    "status": "Stable",
    "signature": "train_model(mode: str, data: str, output: str, checkpoint: Optional[str] = None, config: Optional[arclm.configs.base.Config] = None, tokenizer=None, **config_overrides) -> arclm.training.pipeline.TrainingResult",
    "summary": "Traint een ArcLM model in pretrain, finetune of continue_training mode.",
    "parameters": [
      [
        "mode",
        "str",
        "required"
      ],
      [
        "data",
        "str",
        "required"
      ],
      [
        "output",
        "str",
        "required"
      ],
      [
        "checkpoint",
        "Optional",
        "None"
      ],
      [
        "config",
        "Optional",
        "None"
      ],
      [
        "tokenizer",
        "Any",
        "None"
      ],
      [
        "config_overrides",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import train_model\n\nprint(train_model)",
    "members": []
  },
  {
    "name": "train_native_model",
    "qualifiedName": "arclm.train_native_model",
    "importPath": "arclm.train_native_model",
    "canonicalImport": "from arclm import train_native_model",
    "alternativeImport": "",
    "kind": "function",
    "category": "root",
    "status": "Stable",
    "signature": "train_native_model(*, data: 'str', output: 'str', **kwargs: 'Any') -> 'Any'",
    "summary": "Train a native ArcLM model by delegating to ``train_model(mode='pretrain')``.",
    "parameters": [
      [
        "data",
        "str",
        "required"
      ],
      [
        "output",
        "str",
        "required"
      ],
      [
        "kwargs",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import train_native_model\n\nprint(train_native_model)",
    "members": []
  },
  {
    "name": "train_sft",
    "qualifiedName": "arclm.train_sft",
    "importPath": "arclm.train_sft",
    "canonicalImport": "from arclm import train_sft",
    "alternativeImport": "",
    "kind": "function",
    "category": "root",
    "status": "Stable",
    "signature": "train_sft(model: 'str', dataset: 'str', output_dir: 'str', backend: 'str' = 'huggingface', assistant_only_loss: 'bool' = True, use_lora: 'bool' = False, batch_size: 'int' = 1, gradient_accumulation_steps: 'int' = 1, learning_rate: 'float' = 0.0002, num_epochs: 'int' = 1, max_length: 'int' = 1024, dtype: 'str' = 'auto', device_map: 'Optional[str]' = None, trust_remote_code: 'bool' = False, enable_thinking: 'Optional[bool]' = False, lora_r: 'int' = 8, lora_alpha: 'int' = 16, lora_dropout: 'float' = 0.05, lora_target_modules: 'Optional[Sequence[str]]' = None, max_steps: 'Optional[int]' = None, seed: 'int' = 42, save_tokenizer: 'bool' = True) -> 'SFTTrainingResult'",
    "summary": "Run supervised fine-tuning through an ArcLM backend.",
    "parameters": [
      [
        "model",
        "str",
        "required"
      ],
      [
        "dataset",
        "str",
        "required"
      ],
      [
        "output_dir",
        "str",
        "required"
      ],
      [
        "backend",
        "str",
        "'huggingface'"
      ],
      [
        "assistant_only_loss",
        "bool",
        "True"
      ],
      [
        "use_lora",
        "bool",
        "False"
      ],
      [
        "batch_size",
        "int",
        "1"
      ],
      [
        "gradient_accumulation_steps",
        "int",
        "1"
      ],
      [
        "learning_rate",
        "float",
        "0.0002"
      ],
      [
        "num_epochs",
        "int",
        "1"
      ],
      [
        "max_length",
        "int",
        "1024"
      ],
      [
        "dtype",
        "str",
        "'auto'"
      ],
      [
        "device_map",
        "Optional[str]",
        "None"
      ],
      [
        "trust_remote_code",
        "bool",
        "False"
      ],
      [
        "enable_thinking",
        "Optional[bool]",
        "False"
      ],
      [
        "lora_r",
        "int",
        "8"
      ],
      [
        "lora_alpha",
        "int",
        "16"
      ],
      [
        "lora_dropout",
        "float",
        "0.05"
      ],
      [
        "lora_target_modules",
        "Optional[Sequence[str]]",
        "None"
      ],
      [
        "max_steps",
        "Optional[int]",
        "None"
      ],
      [
        "seed",
        "int",
        "42"
      ],
      [
        "save_tokenizer",
        "bool",
        "True"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import train_sft\n\nprint(train_sft)",
    "members": []
  },
  {
    "name": "validate_records",
    "qualifiedName": "arclm.validate_records",
    "importPath": "arclm.validate_records",
    "canonicalImport": "from arclm import validate_records",
    "alternativeImport": "",
    "kind": "function",
    "category": "root",
    "status": "Stable",
    "signature": "validate_records(records: 'Iterable[Mapping[str, Any]]', *, required_fields: 'Sequence[str]', field_types: 'Mapping[str, type | tuple[type, ...]] | None' = None, allow_empty: 'bool' = False, strict: 'bool' = True, record_id_field: 'str | None' = None) -> 'DatasetValidationResult'",
    "summary": "Validate mapping records with a small schema.",
    "parameters": [
      [
        "records",
        "Iterable[Mapping[str, Any]]",
        "required"
      ],
      [
        "required_fields",
        "Sequence[str]",
        "required"
      ],
      [
        "field_types",
        "Mapping[str, type | tuple[type, ...]] | None",
        "None"
      ],
      [
        "allow_empty",
        "bool",
        "False"
      ],
      [
        "strict",
        "bool",
        "True"
      ],
      [
        "record_id_field",
        "str | None",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import validate_records\n\nprint(validate_records)",
    "members": []
  },
  {
    "name": "validate_sft_records",
    "qualifiedName": "arclm.validate_sft_records",
    "importPath": "arclm.validate_sft_records",
    "canonicalImport": "from arclm import validate_sft_records",
    "alternativeImport": "",
    "kind": "function",
    "category": "root",
    "status": "Stable",
    "signature": "validate_sft_records(records: 'Iterable[Mapping[str, Any]]', config: 'FineTuningConfig | None' = None, *, strict: 'bool' = True) -> 'DatasetValidationResult'",
    "summary": "Validate SFT records through the canonical fine-tuning normalizer.",
    "parameters": [
      [
        "records",
        "Iterable[Mapping[str, Any]]",
        "required"
      ],
      [
        "config",
        "FineTuningConfig | None",
        "None"
      ],
      [
        "strict",
        "bool",
        "True"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import validate_sft_records\n\nprint(validate_sft_records)",
    "members": []
  },
  {
    "name": "validate_tokenizer_compatibility",
    "qualifiedName": "arclm.validate_tokenizer_compatibility",
    "importPath": "arclm.validate_tokenizer_compatibility",
    "canonicalImport": "from arclm import validate_tokenizer_compatibility",
    "alternativeImport": "",
    "kind": "function",
    "category": "root",
    "status": "Stable",
    "signature": "validate_tokenizer_compatibility(checkpoint: arclm.checkpoints.loaders.base.LoadedCheckpoint, tokenizer: Optional[Any] = None, config: Optional[arclm.configs.base.Config] = None) -> None",
    "summary": "Raise if a tokenizer cannot safely address the checkpoint vocabulary.",
    "parameters": [
      [
        "checkpoint",
        "LoadedCheckpoint",
        "required"
      ],
      [
        "tokenizer",
        "Optional",
        "None"
      ],
      [
        "config",
        "Optional",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "None",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm import validate_tokenizer_compatibility\n\nprint(validate_tokenizer_compatibility)",
    "members": []
  },
  {
    "name": "EncryptedEnvelope",
    "qualifiedName": "arclm.security.EncryptedEnvelope",
    "importPath": "arclm.security.EncryptedEnvelope",
    "canonicalImport": "from arclm.security import EncryptedEnvelope",
    "alternativeImport": "",
    "kind": "class",
    "category": "security",
    "status": "Beta",
    "signature": "EncryptedEnvelope(format: 'str', version: 'int', algorithm: 'str', key_id: 'str', nonce: 'str', associated_data: 'dict[str, Any]', ciphertext: 'str', created_at: 'str', metadata: 'dict[str, Any]' = <factory>, encrypted_data_key: 'str | None' = None, key_encryption_key_id: 'str | None' = None, password_kdf: 'dict[str, Any] | None' = None) -> None",
    "summary": "JSON-safe authenticated encryption envelope.",
    "parameters": [
      [
        "format",
        "str",
        "required"
      ],
      [
        "version",
        "int",
        "required"
      ],
      [
        "algorithm",
        "str",
        "required"
      ],
      [
        "key_id",
        "str",
        "required"
      ],
      [
        "nonce",
        "str",
        "required"
      ],
      [
        "associated_data",
        "dict[str, Any]",
        "required"
      ],
      [
        "ciphertext",
        "str",
        "required"
      ],
      [
        "created_at",
        "str",
        "required"
      ],
      [
        "metadata",
        "dict[str, Any]",
        "<factory>"
      ],
      [
        "encrypted_data_key",
        "str | None",
        "None"
      ],
      [
        "key_encryption_key_id",
        "str | None",
        "None"
      ],
      [
        "password_kdf",
        "dict[str, Any] | None",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "cryptography",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.security import EncryptedEnvelope\n\nprint(EncryptedEnvelope)",
    "members": [
      [
        "ciphertext_bytes(self) -> 'bytes'",
        "Public method."
      ],
      [
        "create(*, algorithm: 'str', key_id: 'str', nonce: 'bytes', associated_data: 'dict[str, Any]', ciphertext: 'bytes', metadata: 'dict[str, Any] | None' = None, encrypted_data_key: 'bytes | None' = None, key_encryption_key_id: 'str | None' = None, password_kdf: 'dict[str, Any] | None' = None) -> \"'EncryptedEnvelope'\"",
        "Public method."
      ],
      [
        "encrypted_data_key_bytes(self) -> 'bytes | None'",
        "Public method."
      ],
      [
        "from_dict(values: 'dict[str, Any]') -> \"'EncryptedEnvelope'\"",
        "Public method."
      ],
      [
        "from_json(payload: 'str') -> \"'EncryptedEnvelope'\"",
        "Public method."
      ],
      [
        "nonce_bytes(self) -> 'bytes'",
        "Public method."
      ],
      [
        "to_dict(self) -> 'dict[str, Any]'",
        "Public method."
      ],
      [
        "to_json(self, **kwargs: 'Any') -> 'str'",
        "Public method."
      ],
      [
        "validate(self) -> 'None'",
        "Public method."
      ]
    ]
  },
  {
    "name": "InMemorySecurityAuditLog",
    "qualifiedName": "arclm.security.InMemorySecurityAuditLog",
    "importPath": "arclm.security.InMemorySecurityAuditLog",
    "canonicalImport": "from arclm.security import InMemorySecurityAuditLog",
    "alternativeImport": "",
    "kind": "class",
    "category": "security",
    "status": "Beta",
    "signature": "InMemorySecurityAuditLog() -> 'None'",
    "summary": "Small local audit sink for tests and local applications.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "cryptography",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.security import InMemorySecurityAuditLog\n\nprint(InMemorySecurityAuditLog)",
    "members": [
      [
        "record(self, event_type: 'str', **kwargs: 'Any') -> 'SecurityAuditEvent'",
        "Public method."
      ],
      [
        "to_dict(self) -> 'dict[str, Any]'",
        "Public method."
      ]
    ]
  },
  {
    "name": "LegacyArtifactPolicy",
    "qualifiedName": "arclm.security.LegacyArtifactPolicy",
    "importPath": "arclm.security.LegacyArtifactPolicy",
    "canonicalImport": "from arclm.security import LegacyArtifactPolicy",
    "alternativeImport": "",
    "kind": "class",
    "category": "security",
    "status": "Beta",
    "signature": "LegacyArtifactPolicy(*values)",
    "summary": "Compatibility policy for existing plaintext artifacts.",
    "parameters": [
      [
        "values",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "cryptography",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.security import LegacyArtifactPolicy\n\nprint(LegacyArtifactPolicy)",
    "members": []
  },
  {
    "name": "PasswordKDFConfig",
    "qualifiedName": "arclm.security.PasswordKDFConfig",
    "importPath": "arclm.security.PasswordKDFConfig",
    "canonicalImport": "from arclm.security import PasswordKDFConfig",
    "alternativeImport": "",
    "kind": "class",
    "category": "security",
    "status": "Beta",
    "signature": "PasswordKDFConfig(algorithm: 'str' = 'argon2id', memory_cost_kib: 'int' = 65536, iterations: 'int' = 3, lanes: 'int' = 4, salt_length: 'int' = 16, output_length: 'int' = 32) -> None",
    "summary": "Bounded Argon2id configuration.",
    "parameters": [
      [
        "algorithm",
        "str",
        "'argon2id'"
      ],
      [
        "memory_cost_kib",
        "int",
        "65536"
      ],
      [
        "iterations",
        "int",
        "3"
      ],
      [
        "lanes",
        "int",
        "4"
      ],
      [
        "salt_length",
        "int",
        "16"
      ],
      [
        "output_length",
        "int",
        "32"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "cryptography",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.security import PasswordKDFConfig\n\nprint(PasswordKDFConfig)",
    "members": [
      [
        "to_dict(self) -> 'dict[str, int | str]'",
        "Public method."
      ]
    ]
  },
  {
    "name": "SecurityAuditEvent",
    "qualifiedName": "arclm.security.SecurityAuditEvent",
    "importPath": "arclm.security.SecurityAuditEvent",
    "canonicalImport": "from arclm.security import SecurityAuditEvent",
    "alternativeImport": "",
    "kind": "class",
    "category": "security",
    "status": "Beta",
    "signature": "SecurityAuditEvent(event_type: 'str', timestamp: 'float', event_id: 'str' = <factory>, actor: 'str | None' = None, artifact_type: 'str | None' = None, result: 'str' = 'ok', metadata: 'dict[str, Any]' = <factory>) -> None",
    "summary": "SecurityAuditEvent(event_type: 'str', timestamp: 'float', event_id: 'str' = <factory>, actor: 'str | None' = None, artifact_type: 'str | None' = None, result: 'str' = 'ok', metadata: 'dict[str, Any]' = <factory>)",
    "parameters": [
      [
        "event_type",
        "str",
        "required"
      ],
      [
        "timestamp",
        "float",
        "required"
      ],
      [
        "event_id",
        "str",
        "<factory>"
      ],
      [
        "actor",
        "str | None",
        "None"
      ],
      [
        "artifact_type",
        "str | None",
        "None"
      ],
      [
        "result",
        "str",
        "'ok'"
      ],
      [
        "metadata",
        "dict[str, Any]",
        "<factory>"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "cryptography",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.security import SecurityAuditEvent\n\nprint(SecurityAuditEvent)",
    "members": [
      [
        "to_dict(self) -> 'dict[str, Any]'",
        "Public method."
      ]
    ]
  },
  {
    "name": "SecurityCapabilities",
    "qualifiedName": "arclm.security.SecurityCapabilities",
    "importPath": "arclm.security.SecurityCapabilities",
    "canonicalImport": "from arclm.security import SecurityCapabilities",
    "alternativeImport": "",
    "kind": "class",
    "category": "security",
    "status": "Beta",
    "signature": "SecurityCapabilities(encryption: 'SecurityCapabilityStatus', signatures: 'SecurityCapabilityStatus', password_kdf: 'SecurityCapabilityStatus', hkdf: 'SecurityCapabilityStatus', keyring: 'SecurityCapabilityStatus' = <SecurityCapabilityStatus.OPTIONAL: 'optional'>, streaming_encryption: 'SecurityCapabilityStatus' = <SecurityCapabilityStatus.UNSUPPORTED: 'unsupported'>, filesystem_permissions_supported: 'bool' = True, tls13_supported: 'bool' = <factory>) -> None",
    "summary": "Safe security capability report.",
    "parameters": [
      [
        "encryption",
        "SecurityCapabilityStatus",
        "required"
      ],
      [
        "signatures",
        "SecurityCapabilityStatus",
        "required"
      ],
      [
        "password_kdf",
        "SecurityCapabilityStatus",
        "required"
      ],
      [
        "hkdf",
        "SecurityCapabilityStatus",
        "required"
      ],
      [
        "keyring",
        "SecurityCapabilityStatus",
        "<SecurityCapabilityStatus.OPTIONAL: 'optional'>"
      ],
      [
        "streaming_encryption",
        "SecurityCapabilityStatus",
        "<SecurityCapabilityStatus.UNSUPPORTED: 'unsupported'>"
      ],
      [
        "filesystem_permissions_supported",
        "bool",
        "True"
      ],
      [
        "tls13_supported",
        "bool",
        "<factory>"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "cryptography",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.security import SecurityCapabilities\n\nprint(SecurityCapabilities)",
    "members": [
      [
        "to_dict(self) -> 'dict[str, object]'",
        "Public method."
      ]
    ]
  },
  {
    "name": "SecurityCapabilityStatus",
    "qualifiedName": "arclm.security.SecurityCapabilityStatus",
    "importPath": "arclm.security.SecurityCapabilityStatus",
    "canonicalImport": "from arclm.security import SecurityCapabilityStatus",
    "alternativeImport": "",
    "kind": "class",
    "category": "security",
    "status": "Beta",
    "signature": "SecurityCapabilityStatus(*values)",
    "summary": "Security capability status.",
    "parameters": [
      [
        "values",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "cryptography",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.security import SecurityCapabilityStatus\n\nprint(SecurityCapabilityStatus)",
    "members": []
  },
  {
    "name": "SecurityInventoryItem",
    "qualifiedName": "arclm.security.SecurityInventoryItem",
    "importPath": "arclm.security.SecurityInventoryItem",
    "canonicalImport": "from arclm.security import SecurityInventoryItem",
    "alternativeImport": "",
    "kind": "class",
    "category": "security",
    "status": "Beta",
    "signature": "SecurityInventoryItem(asset: 'str', location: 'str', sensitivity: 'str', current_protection: 'str', threats: 'tuple[str, ...]', required_protection: 'str', owner_subsystem: 'str', migration_requirement: 'str') -> None",
    "summary": "SecurityInventoryItem(asset: 'str', location: 'str', sensitivity: 'str', current_protection: 'str', threats: 'tuple[str, ...]', required_protection: 'str', owner_subsystem: 'str', migration_requirement: 'str')",
    "parameters": [
      [
        "asset",
        "str",
        "required"
      ],
      [
        "location",
        "str",
        "required"
      ],
      [
        "sensitivity",
        "str",
        "required"
      ],
      [
        "current_protection",
        "str",
        "required"
      ],
      [
        "threats",
        "tuple[str, ...]",
        "required"
      ],
      [
        "required_protection",
        "str",
        "required"
      ],
      [
        "owner_subsystem",
        "str",
        "required"
      ],
      [
        "migration_requirement",
        "str",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "cryptography",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.security import SecurityInventoryItem\n\nprint(SecurityInventoryItem)",
    "members": [
      [
        "to_dict(self) -> 'dict[str, Any]'",
        "Public method."
      ]
    ]
  },
  {
    "name": "SecurityMode",
    "qualifiedName": "arclm.security.SecurityMode",
    "importPath": "arclm.security.SecurityMode",
    "canonicalImport": "from arclm.security import SecurityMode",
    "alternativeImport": "",
    "kind": "class",
    "category": "security",
    "status": "Beta",
    "signature": "SecurityMode(*values)",
    "summary": "ArcLM security operating mode.",
    "parameters": [
      [
        "values",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "cryptography",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.security import SecurityMode\n\nprint(SecurityMode)",
    "members": []
  },
  {
    "name": "SecurityPolicy",
    "qualifiedName": "arclm.security.SecurityPolicy",
    "importPath": "arclm.security.SecurityPolicy",
    "canonicalImport": "from arclm.security import SecurityPolicy",
    "alternativeImport": "",
    "kind": "class",
    "category": "security",
    "status": "Beta",
    "signature": "SecurityPolicy(mode: 'SecurityMode' = <SecurityMode.LOCAL_SECURE: 'local_secure'>, legacy_artifacts: 'LegacyArtifactPolicy' = <LegacyArtifactPolicy.LEGACY_READ: 'legacy_read'>, encryption_required_for: 'tuple[str, ...]' = ('agent_session', 'tool_trace', 'run_metadata'), signature_required_for: 'tuple[str, ...]' = ('model_artifact', 'checkpoint'), allowed_encryption_algorithms: 'tuple[str, ...]' = ('AES-256-GCM', 'ChaCha20-Poly1305'), default_encryption_algorithm: 'str' = 'AES-256-GCM', allowed_hash_algorithms: 'tuple[str, ...]' = ('sha256', 'sha512'), default_hash_algorithm: 'str' = 'sha256', allow_untrusted_pickle: 'bool' = False, allow_remote_model_code: 'bool' = False, tls_required_for_remote: 'bool' = True, allow_wildcard_cors_with_credentials: 'bool' = False, redact_traces: 'bool' = True, max_encryption_bytes: 'int' = 16777216, max_manifest_files: 'int' = 10000, metadata: 'dict[str, str]' = <factory>) -> None",
    "summary": "Framework-wide security policy.",
    "parameters": [
      [
        "mode",
        "SecurityMode",
        "<SecurityMode.LOCAL_SECURE: 'local_secure'>"
      ],
      [
        "legacy_artifacts",
        "LegacyArtifactPolicy",
        "<LegacyArtifactPolicy.LEGACY_READ: 'legacy_read'>"
      ],
      [
        "encryption_required_for",
        "tuple[str, ...]",
        "('agent_session', 'tool_trace', 'run_metadata')"
      ],
      [
        "signature_required_for",
        "tuple[str, ...]",
        "('model_artifact', 'checkpoint')"
      ],
      [
        "allowed_encryption_algorithms",
        "tuple[str, ...]",
        "('AES-256-GCM', 'ChaCha20-Poly1305')"
      ],
      [
        "default_encryption_algorithm",
        "str",
        "'AES-256-GCM'"
      ],
      [
        "allowed_hash_algorithms",
        "tuple[str, ...]",
        "('sha256', 'sha512')"
      ],
      [
        "default_hash_algorithm",
        "str",
        "'sha256'"
      ],
      [
        "allow_untrusted_pickle",
        "bool",
        "False"
      ],
      [
        "allow_remote_model_code",
        "bool",
        "False"
      ],
      [
        "tls_required_for_remote",
        "bool",
        "True"
      ],
      [
        "allow_wildcard_cors_with_credentials",
        "bool",
        "False"
      ],
      [
        "redact_traces",
        "bool",
        "True"
      ],
      [
        "max_encryption_bytes",
        "int",
        "16777216"
      ],
      [
        "max_manifest_files",
        "int",
        "10000"
      ],
      [
        "metadata",
        "dict[str, str]",
        "<factory>"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "cryptography",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.security import SecurityPolicy\n\nprint(SecurityPolicy)",
    "members": [
      [
        "requires_encryption(self, artifact_type: 'str') -> 'bool'",
        "Public method."
      ],
      [
        "requires_signature(self, artifact_type: 'str') -> 'bool'",
        "Public method."
      ],
      [
        "to_dict(self) -> 'dict[str, object]'",
        "Public method."
      ]
    ]
  },
  {
    "name": "ThreatModelItem",
    "qualifiedName": "arclm.security.ThreatModelItem",
    "importPath": "arclm.security.ThreatModelItem",
    "canonicalImport": "from arclm.security import ThreatModelItem",
    "alternativeImport": "",
    "kind": "class",
    "category": "security",
    "status": "Beta",
    "signature": "ThreatModelItem(threat: 'str', affected_assets: 'tuple[str, ...]', entry_point: 'str', likelihood: 'str', impact: 'str', mitigation: 'str', remaining_risk: 'str', required_tests: 'tuple[str, ...]') -> None",
    "summary": "ThreatModelItem(threat: 'str', affected_assets: 'tuple[str, ...]', entry_point: 'str', likelihood: 'str', impact: 'str', mitigation: 'str', remaining_risk: 'str', required_tests: 'tuple[str, ...]')",
    "parameters": [
      [
        "threat",
        "str",
        "required"
      ],
      [
        "affected_assets",
        "tuple[str, ...]",
        "required"
      ],
      [
        "entry_point",
        "str",
        "required"
      ],
      [
        "likelihood",
        "str",
        "required"
      ],
      [
        "impact",
        "str",
        "required"
      ],
      [
        "mitigation",
        "str",
        "required"
      ],
      [
        "remaining_risk",
        "str",
        "required"
      ],
      [
        "required_tests",
        "tuple[str, ...]",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "cryptography",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.security import ThreatModelItem\n\nprint(ThreatModelItem)",
    "members": [
      [
        "to_dict(self) -> 'dict[str, Any]'",
        "Public method."
      ]
    ]
  },
  {
    "name": "DecryptionError",
    "qualifiedName": "arclm.security.DecryptionError",
    "importPath": "arclm.security.DecryptionError",
    "canonicalImport": "from arclm.security import DecryptionError",
    "alternativeImport": "",
    "kind": "exception",
    "category": "security",
    "status": "Beta",
    "signature": "DecryptionError(...)",
    "summary": "Raised when decryption or authentication fails.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "cryptography",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.security import DecryptionError\n\ntry:\n    raise DecryptionError(\"example\")\nexcept DecryptionError as exc:\n    print(type(exc).__name__)",
    "members": []
  },
  {
    "name": "EncryptionError",
    "qualifiedName": "arclm.security.EncryptionError",
    "importPath": "arclm.security.EncryptionError",
    "canonicalImport": "from arclm.security import EncryptionError",
    "alternativeImport": "",
    "kind": "exception",
    "category": "security",
    "status": "Beta",
    "signature": "EncryptionError(...)",
    "summary": "Raised when encryption cannot complete safely.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "cryptography",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.security import EncryptionError\n\ntry:\n    raise EncryptionError(\"example\")\nexcept EncryptionError as exc:\n    print(type(exc).__name__)",
    "members": []
  },
  {
    "name": "KeyManagementError",
    "qualifiedName": "arclm.security.KeyManagementError",
    "importPath": "arclm.security.KeyManagementError",
    "canonicalImport": "from arclm.security import KeyManagementError",
    "alternativeImport": "",
    "kind": "exception",
    "category": "security",
    "status": "Beta",
    "signature": "KeyManagementError(...)",
    "summary": "Raised by key providers and key lifecycle checks.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "cryptography",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.security import KeyManagementError\n\ntry:\n    raise KeyManagementError(\"example\")\nexcept KeyManagementError as exc:\n    print(type(exc).__name__)",
    "members": []
  },
  {
    "name": "ManifestError",
    "qualifiedName": "arclm.security.ManifestError",
    "importPath": "arclm.security.ManifestError",
    "canonicalImport": "from arclm.security import ManifestError",
    "alternativeImport": "",
    "kind": "exception",
    "category": "security",
    "status": "Beta",
    "signature": "ManifestError(...)",
    "summary": "Raised for invalid or unsafe security manifests.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "cryptography",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.security import ManifestError\n\ntry:\n    raise ManifestError(\"example\")\nexcept ManifestError as exc:\n    print(type(exc).__name__)",
    "members": []
  },
  {
    "name": "SecureLoadError",
    "qualifiedName": "arclm.security.SecureLoadError",
    "importPath": "arclm.security.SecureLoadError",
    "canonicalImport": "from arclm.security import SecureLoadError",
    "alternativeImport": "",
    "kind": "exception",
    "category": "security",
    "status": "Beta",
    "signature": "SecureLoadError(...)",
    "summary": "Raised when secure loading policy blocks an artifact.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "cryptography",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.security import SecureLoadError\n\ntry:\n    raise SecureLoadError(\"example\")\nexcept SecureLoadError as exc:\n    print(type(exc).__name__)",
    "members": []
  },
  {
    "name": "SecurityDependencyError",
    "qualifiedName": "arclm.security.SecurityDependencyError",
    "importPath": "arclm.security.SecurityDependencyError",
    "canonicalImport": "from arclm.security import SecurityDependencyError",
    "alternativeImport": "",
    "kind": "exception",
    "category": "security",
    "status": "Beta",
    "signature": "SecurityDependencyError(...)",
    "summary": "Raised when a required security dependency is unavailable.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "cryptography",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.security import SecurityDependencyError\n\ntry:\n    raise SecurityDependencyError(\"example\")\nexcept SecurityDependencyError as exc:\n    print(type(exc).__name__)",
    "members": []
  },
  {
    "name": "SecurityError",
    "qualifiedName": "arclm.security.SecurityError",
    "importPath": "arclm.security.SecurityError",
    "canonicalImport": "from arclm.security import SecurityError",
    "alternativeImport": "",
    "kind": "exception",
    "category": "security",
    "status": "Beta",
    "signature": "SecurityError(...)",
    "summary": "Base error for ArcLM Security Core.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "cryptography",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.security import SecurityError\n\ntry:\n    raise SecurityError(\"example\")\nexcept SecurityError as exc:\n    print(type(exc).__name__)",
    "members": []
  },
  {
    "name": "SecurityPolicyError",
    "qualifiedName": "arclm.security.SecurityPolicyError",
    "importPath": "arclm.security.SecurityPolicyError",
    "canonicalImport": "from arclm.security import SecurityPolicyError",
    "alternativeImport": "",
    "kind": "exception",
    "category": "security",
    "status": "Beta",
    "signature": "SecurityPolicyError(...)",
    "summary": "Raised when security policy denies an operation.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "cryptography",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.security import SecurityPolicyError\n\ntry:\n    raise SecurityPolicyError(\"example\")\nexcept SecurityPolicyError as exc:\n    print(type(exc).__name__)",
    "members": []
  },
  {
    "name": "SignatureError",
    "qualifiedName": "arclm.security.SignatureError",
    "importPath": "arclm.security.SignatureError",
    "canonicalImport": "from arclm.security import SignatureError",
    "alternativeImport": "",
    "kind": "exception",
    "category": "security",
    "status": "Beta",
    "signature": "SignatureError(...)",
    "summary": "Raised when manifest signing or verification fails.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "cryptography",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.security import SignatureError\n\ntry:\n    raise SignatureError(\"example\")\nexcept SignatureError as exc:\n    print(type(exc).__name__)",
    "members": []
  },
  {
    "name": "decrypt_bytes",
    "qualifiedName": "arclm.security.decrypt_bytes",
    "importPath": "arclm.security.decrypt_bytes",
    "canonicalImport": "from arclm.security import decrypt_bytes",
    "alternativeImport": "",
    "kind": "function",
    "category": "security",
    "status": "Beta",
    "signature": "decrypt_bytes(envelope: 'EncryptedEnvelope | dict[str, Any] | str', key: 'bytes | SecretValue') -> 'bytes'",
    "summary": "Decrypt an AEAD envelope or raise without returning partial plaintext.",
    "parameters": [
      [
        "envelope",
        "EncryptedEnvelope | dict[str, Any] | str",
        "required"
      ],
      [
        "key",
        "bytes | SecretValue",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "cryptography",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.security import decrypt_bytes\n\nprint(decrypt_bytes)",
    "members": []
  },
  {
    "name": "decrypt_json",
    "qualifiedName": "arclm.security.decrypt_json",
    "importPath": "arclm.security.decrypt_json",
    "canonicalImport": "from arclm.security import decrypt_json",
    "alternativeImport": "",
    "kind": "function",
    "category": "security",
    "status": "Beta",
    "signature": "decrypt_json(envelope: 'EncryptedEnvelope | dict[str, Any] | str', key: 'bytes | SecretValue') -> 'Any'",
    "summary": "Decrypt JSON-safe data.",
    "parameters": [
      [
        "envelope",
        "EncryptedEnvelope | dict[str, Any] | str",
        "required"
      ],
      [
        "key",
        "bytes | SecretValue",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "cryptography",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.security import decrypt_json\n\nprint(decrypt_json)",
    "members": []
  },
  {
    "name": "derive_key_argon2id",
    "qualifiedName": "arclm.security.derive_key_argon2id",
    "importPath": "arclm.security.derive_key_argon2id",
    "canonicalImport": "from arclm.security import derive_key_argon2id",
    "alternativeImport": "",
    "kind": "function",
    "category": "security",
    "status": "Beta",
    "signature": "derive_key_argon2id(password: 'str | bytes', *, salt: 'bytes | None' = None, config: 'PasswordKDFConfig | None' = None) -> 'DerivedKey'",
    "summary": "Derive a key-encryption key from a password using Argon2id.",
    "parameters": [
      [
        "password",
        "str | bytes",
        "required"
      ],
      [
        "salt",
        "bytes | None",
        "None"
      ],
      [
        "config",
        "PasswordKDFConfig | None",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "cryptography",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.security import derive_key_argon2id\n\nprint(derive_key_argon2id)",
    "members": []
  },
  {
    "name": "derive_subkey_hkdf",
    "qualifiedName": "arclm.security.derive_subkey_hkdf",
    "importPath": "arclm.security.derive_subkey_hkdf",
    "canonicalImport": "from arclm.security import derive_subkey_hkdf",
    "alternativeImport": "",
    "kind": "function",
    "category": "security",
    "status": "Beta",
    "signature": "derive_subkey_hkdf(master_key: 'bytes', *, purpose: 'str', context: 'bytes' = b'', length: 'int' = 32) -> 'bytes'",
    "summary": "Derive a purpose-bound subkey from high-entropy key material.",
    "parameters": [
      [
        "master_key",
        "bytes",
        "required"
      ],
      [
        "purpose",
        "str",
        "required"
      ],
      [
        "context",
        "bytes",
        "b''"
      ],
      [
        "length",
        "int",
        "32"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "cryptography",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.security import derive_subkey_hkdf\n\nprint(derive_subkey_hkdf)",
    "members": []
  },
  {
    "name": "encrypt_bytes",
    "qualifiedName": "arclm.security.encrypt_bytes",
    "importPath": "arclm.security.encrypt_bytes",
    "canonicalImport": "from arclm.security import encrypt_bytes",
    "alternativeImport": "",
    "kind": "function",
    "category": "security",
    "status": "Beta",
    "signature": "encrypt_bytes(data: 'bytes', key: 'bytes | SecretValue', *, key_id: 'str' = 'direct', algorithm: 'str' = 'AES-256-GCM', associated_data: 'dict[str, Any] | None' = None, metadata: 'dict[str, Any] | None' = None, policy: 'SecurityPolicy | None' = None) -> 'EncryptedEnvelope'",
    "summary": "Encrypt bytes with AEAD and return a versioned envelope.",
    "parameters": [
      [
        "data",
        "bytes",
        "required"
      ],
      [
        "key",
        "bytes | SecretValue",
        "required"
      ],
      [
        "key_id",
        "str",
        "'direct'"
      ],
      [
        "algorithm",
        "str",
        "'AES-256-GCM'"
      ],
      [
        "associated_data",
        "dict[str, Any] | None",
        "None"
      ],
      [
        "metadata",
        "dict[str, Any] | None",
        "None"
      ],
      [
        "policy",
        "SecurityPolicy | None",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "cryptography",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.security import encrypt_bytes\n\nprint(encrypt_bytes)",
    "members": []
  },
  {
    "name": "encrypt_json",
    "qualifiedName": "arclm.security.encrypt_json",
    "importPath": "arclm.security.encrypt_json",
    "canonicalImport": "from arclm.security import encrypt_json",
    "alternativeImport": "",
    "kind": "function",
    "category": "security",
    "status": "Beta",
    "signature": "encrypt_json(value: 'Any', key: 'bytes | SecretValue', **kwargs: 'Any') -> 'EncryptedEnvelope'",
    "summary": "Encrypt JSON-safe data.",
    "parameters": [
      [
        "value",
        "Any",
        "required"
      ],
      [
        "key",
        "bytes | SecretValue",
        "required"
      ],
      [
        "kwargs",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "cryptography",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.security import encrypt_json\n\nprint(encrypt_json)",
    "members": []
  },
  {
    "name": "generate_signing_keypair",
    "qualifiedName": "arclm.security.generate_signing_keypair",
    "importPath": "arclm.security.generate_signing_keypair",
    "canonicalImport": "from arclm.security import generate_signing_keypair",
    "alternativeImport": "",
    "kind": "function",
    "category": "security",
    "status": "Beta",
    "signature": "generate_signing_keypair(*, key_id: 'str' = 'signing_key_local') -> 'SigningKeyPair'",
    "summary": "Generate a local Ed25519 signing key pair.",
    "parameters": [
      [
        "key_id",
        "str",
        "'signing_key_local'"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "cryptography",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.security import generate_signing_keypair\n\nprint(generate_signing_keypair)",
    "members": []
  },
  {
    "name": "get_security_capabilities",
    "qualifiedName": "arclm.security.get_security_capabilities",
    "importPath": "arclm.security.get_security_capabilities",
    "canonicalImport": "from arclm.security import get_security_capabilities",
    "alternativeImport": "",
    "kind": "function",
    "category": "security",
    "status": "Beta",
    "signature": "get_security_capabilities() -> 'SecurityCapabilities'",
    "summary": "Return Security Core capability status without leaking local paths.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "cryptography",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.security import get_security_capabilities\n\nprint(get_security_capabilities)",
    "members": []
  },
  {
    "name": "hash_bytes",
    "qualifiedName": "arclm.security.hash_bytes",
    "importPath": "arclm.security.hash_bytes",
    "canonicalImport": "from arclm.security import hash_bytes",
    "alternativeImport": "",
    "kind": "function",
    "category": "security",
    "status": "Beta",
    "signature": "hash_bytes(data: 'bytes', *, algorithm: 'str' = 'sha256') -> 'str'",
    "summary": "Hash bytes with an allowlisted algorithm.",
    "parameters": [
      [
        "data",
        "bytes",
        "required"
      ],
      [
        "algorithm",
        "str",
        "'sha256'"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "cryptography",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.security import hash_bytes\n\nprint(hash_bytes)",
    "members": []
  },
  {
    "name": "hash_file",
    "qualifiedName": "arclm.security.hash_file",
    "importPath": "arclm.security.hash_file",
    "canonicalImport": "from arclm.security import hash_file",
    "alternativeImport": "",
    "kind": "function",
    "category": "security",
    "status": "Beta",
    "signature": "hash_file(path: 'str | Path', *, algorithm: 'str' = 'sha256', chunk_size: 'int' = 1048576) -> 'str'",
    "summary": "Hash a file without loading it all into memory.",
    "parameters": [
      [
        "path",
        "str | Path",
        "required"
      ],
      [
        "algorithm",
        "str",
        "'sha256'"
      ],
      [
        "chunk_size",
        "int",
        "1048576"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "cryptography",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.security import hash_file\n\nprint(hash_file)",
    "members": []
  },
  {
    "name": "redact_mapping",
    "qualifiedName": "arclm.security.redact_mapping",
    "importPath": "arclm.security.redact_mapping",
    "canonicalImport": "from arclm.security import redact_mapping",
    "alternativeImport": "",
    "kind": "function",
    "category": "security",
    "status": "Beta",
    "signature": "redact_mapping(value: 'Any') -> 'Any'",
    "summary": "Recursively redact sensitive mapping values.",
    "parameters": [
      [
        "value",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "cryptography",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.security import redact_mapping\n\nprint(redact_mapping)",
    "members": []
  },
  {
    "name": "redact_sensitive_text",
    "qualifiedName": "arclm.security.redact_sensitive_text",
    "importPath": "arclm.security.redact_sensitive_text",
    "canonicalImport": "from arclm.security import redact_sensitive_text",
    "alternativeImport": "",
    "kind": "function",
    "category": "security",
    "status": "Beta",
    "signature": "redact_sensitive_text(text: 'str') -> 'str'",
    "summary": "Redact common secret patterns from text.",
    "parameters": [
      [
        "text",
        "str",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "cryptography",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.security import redact_sensitive_text\n\nprint(redact_sensitive_text)",
    "members": []
  },
  {
    "name": "security_inventory",
    "qualifiedName": "arclm.security.security_inventory",
    "importPath": "arclm.security.security_inventory",
    "canonicalImport": "from arclm.security import security_inventory",
    "alternativeImport": "",
    "kind": "function",
    "category": "security",
    "status": "Beta",
    "signature": "security_inventory() -> 'list[SecurityInventoryItem]'",
    "summary": "Public function exported by arclm.security.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "cryptography",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.security import security_inventory\n\nprint(security_inventory)",
    "members": []
  },
  {
    "name": "security_status",
    "qualifiedName": "arclm.security.security_status",
    "importPath": "arclm.security.security_status",
    "canonicalImport": "from arclm.security import security_status",
    "alternativeImport": "",
    "kind": "function",
    "category": "security",
    "status": "Beta",
    "signature": "security_status(policy: 'SecurityPolicy | None' = None) -> 'dict[str, object]'",
    "summary": "Return a safe security status report without paths or secrets.",
    "parameters": [
      [
        "policy",
        "SecurityPolicy | None",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "cryptography",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.security import security_status\n\nprint(security_status)",
    "members": []
  },
  {
    "name": "sign_manifest",
    "qualifiedName": "arclm.security.sign_manifest",
    "importPath": "arclm.security.sign_manifest",
    "canonicalImport": "from arclm.security import sign_manifest",
    "alternativeImport": "",
    "kind": "function",
    "category": "security",
    "status": "Beta",
    "signature": "sign_manifest(manifest: 'dict[str, Any]', private_key: 'bytes', *, key_id: 'str') -> 'dict[str, Any]'",
    "summary": "Return a signed manifest copy.",
    "parameters": [
      [
        "manifest",
        "dict[str, Any]",
        "required"
      ],
      [
        "private_key",
        "bytes",
        "required"
      ],
      [
        "key_id",
        "str",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "cryptography",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.security import sign_manifest\n\nprint(sign_manifest)",
    "members": []
  },
  {
    "name": "threat_model",
    "qualifiedName": "arclm.security.threat_model",
    "importPath": "arclm.security.threat_model",
    "canonicalImport": "from arclm.security import threat_model",
    "alternativeImport": "",
    "kind": "function",
    "category": "security",
    "status": "Beta",
    "signature": "threat_model() -> 'list[ThreatModelItem]'",
    "summary": "Public function exported by arclm.security.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "cryptography",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.security import threat_model\n\nprint(threat_model)",
    "members": []
  },
  {
    "name": "verify_file_hash",
    "qualifiedName": "arclm.security.verify_file_hash",
    "importPath": "arclm.security.verify_file_hash",
    "canonicalImport": "from arclm.security import verify_file_hash",
    "alternativeImport": "",
    "kind": "function",
    "category": "security",
    "status": "Beta",
    "signature": "verify_file_hash(path: 'str | Path', expected: 'str') -> 'bool'",
    "summary": "Verify a trusted expected file hash.",
    "parameters": [
      [
        "path",
        "str | Path",
        "required"
      ],
      [
        "expected",
        "str",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "cryptography",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.security import verify_file_hash\n\nprint(verify_file_hash)",
    "members": []
  },
  {
    "name": "verify_manifest",
    "qualifiedName": "arclm.security.verify_manifest",
    "importPath": "arclm.security.verify_manifest",
    "canonicalImport": "from arclm.security import verify_manifest",
    "alternativeImport": "",
    "kind": "function",
    "category": "security",
    "status": "Beta",
    "signature": "verify_manifest(manifest: 'dict[str, Any]', public_key: 'bytes', *, expected_key_id: 'str | None' = None) -> 'bool'",
    "summary": "Verify a signed manifest.",
    "parameters": [
      [
        "manifest",
        "dict[str, Any]",
        "required"
      ],
      [
        "public_key",
        "bytes",
        "required"
      ],
      [
        "expected_key_id",
        "str | None",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "cryptography",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.security import verify_manifest\n\nprint(verify_manifest)",
    "members": []
  },
  {
    "name": "verify_manifest_signature",
    "qualifiedName": "arclm.security.verify_manifest_signature",
    "importPath": "arclm.security.verify_manifest_signature",
    "canonicalImport": "from arclm.security import verify_manifest_signature",
    "alternativeImport": "",
    "kind": "function",
    "category": "security",
    "status": "Beta",
    "signature": "verify_manifest(manifest: 'dict[str, Any]', public_key: 'bytes', *, expected_key_id: 'str | None' = None) -> 'bool'",
    "summary": "Verify a signed manifest.",
    "parameters": [
      [
        "manifest",
        "dict[str, Any]",
        "required"
      ],
      [
        "public_key",
        "bytes",
        "required"
      ],
      [
        "expected_key_id",
        "str | None",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "cryptography",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.security import verify_manifest_signature\n\nprint(verify_manifest_signature)",
    "members": []
  },
  {
    "name": "SentencePieceTokenizer",
    "qualifiedName": "arclm.tokenizers.SentencePieceTokenizer",
    "importPath": "arclm.tokenizers.SentencePieceTokenizer",
    "canonicalImport": "from arclm.tokenizers import SentencePieceTokenizer",
    "alternativeImport": "from arclm import SentencePieceTokenizer",
    "kind": "class",
    "category": "tokenizers",
    "status": "Stable",
    "signature": "SentencePieceTokenizer(max_vocab=50000, model_type='bpe', character_coverage=1.0, default_token='<UNK>', model_name=None, user_defined_symbols=None)",
    "summary": "SentencePiece tokenizer voor subword taalmodeltraining.",
    "parameters": [
      [
        "max_vocab",
        "Any",
        "50000"
      ],
      [
        "model_type",
        "Any",
        "'bpe'"
      ],
      [
        "character_coverage",
        "Any",
        "1.0"
      ],
      [
        "default_token",
        "Any",
        "'<UNK>'"
      ],
      [
        "model_name",
        "Any",
        "None"
      ],
      [
        "user_defined_symbols",
        "Any",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "sentencepiece",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.tokenizers import SentencePieceTokenizer\n\nprint(SentencePieceTokenizer)",
    "members": [
      [
        "analyze_coverage(self, tokens, rare_threshold=2, top_unknown=20)",
        "Meet hoeveel SentencePiece stukjes bekend of onbekend zijn."
      ],
      [
        "build(self, text: str) -> dict",
        "Traint een SentencePiece tokenizer op ruwe tekst."
      ],
      [
        "decode(self, indices)",
        "Zet token ids terug naar SentencePiece stukjes."
      ],
      [
        "decode_string(self, indices)",
        "Zet token ids direct terug naar tekst."
      ],
      [
        "encode(self, tokens)",
        "Zet tokens om naar ids door ze eerst weer tekst te maken."
      ],
      [
        "encode_text(self, text, out_type=<class 'int'>)",
        "Zet ruwe tekst om naar SentencePiece token ids."
      ],
      [
        "from_checkpoint(metadata)",
        "Maakt een SentencePiece tokenizer vanuit checkpoint metadata."
      ],
      [
        "from_json(data)",
        "Maakt een SentencePiece tokenizer vanuit een JSON-vriendelijke dict."
      ],
      [
        "get_meta_data(self)",
        "Geeft korte metadata over de tokenizer terug."
      ],
      [
        "get_rare_tokens(self, min_count=2, limit=20)",
        "Geeft zeldzame whitespace-tokens uit de trainingstekst terug."
      ],
      [
        "get_unknown_index(self)",
        "Geeft de index terug voor onbekende SentencePiece stukjes."
      ],
      [
        "get_vocab_size(self)",
        "Geeft het aantal tokens in de vocabulaire terug."
      ]
    ]
  },
  {
    "name": "Tokenizer",
    "qualifiedName": "arclm.tokenizers.Tokenizer",
    "importPath": "arclm.tokenizers.Tokenizer",
    "canonicalImport": "from arclm.tokenizers import Tokenizer",
    "alternativeImport": "from arclm import Tokenizer",
    "kind": "class",
    "category": "tokenizers",
    "status": "Stable",
    "signature": "Tokenizer(max_vocab=50000, default_token='<UNK>', user_defined_symbols=None)",
    "summary": "Zet tekst om naar woord-tokens en token ids.",
    "parameters": [
      [
        "max_vocab",
        "Any",
        "50000"
      ],
      [
        "default_token",
        "Any",
        "'<UNK>'"
      ],
      [
        "user_defined_symbols",
        "Any",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "sentencepiece",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.tokenizers import Tokenizer\n\nprint(Tokenizer)",
    "members": [
      [
        "analyze_coverage(self, tokens, rare_threshold=2, top_unknown=20)",
        "Meet hoeveel tokens bekend, onbekend of zeldzaam zijn."
      ],
      [
        "build(self, text)",
        "Bouwt de vocabulaire op basis van tekst."
      ],
      [
        "decode(self, indices)",
        "Zet token ids terug naar tokens."
      ],
      [
        "decode_string(self, indices)",
        "Zet token ids terug naar een tekststring."
      ],
      [
        "encode(self, tokens)",
        "Zet tokens om naar token ids."
      ],
      [
        "encode_text(self, text)",
        "Zet ruwe tekst om naar token ids."
      ],
      [
        "from_json(data)",
        "Maakt een woord-tokenizer vanuit een JSON-vriendelijke dict."
      ],
      [
        "get_rare_tokens(self, min_count=2, limit=20)",
        "Geeft tokens terug die weinig voorkwamen tijdens het bouwen."
      ],
      [
        "get_unknown_index(self)",
        "Geeft de index terug die voor onbekende tokens wordt gebruikt."
      ],
      [
        "get_vocab_size(self)",
        "Geeft het aantal tokens in de vocabulaire terug."
      ],
      [
        "load_vocab(self, path)",
        "Laadt de vocabulaire uit een tekstbestand."
      ],
      [
        "save(self, path)",
        "Slaat de tokenizer op als JSON-bestand."
      ]
    ]
  },
  {
    "name": "TokenizerFactory",
    "qualifiedName": "arclm.tokenizers.TokenizerFactory",
    "importPath": "arclm.tokenizers.TokenizerFactory",
    "canonicalImport": "from arclm.tokenizers import TokenizerFactory",
    "alternativeImport": "from arclm import TokenizerFactory",
    "kind": "class",
    "category": "tokenizers",
    "status": "Stable",
    "signature": "TokenizerFactory()",
    "summary": "Kiest en maakt tokenizer classes op basis van een korte naam.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "sentencepiece",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.tokenizers import TokenizerFactory\n\nprint(TokenizerFactory)",
    "members": [
      [
        "create(tokenizer_type='word', **kwargs)",
        "Maakt een tokenizer op basis van de geregistreerde type-naam."
      ],
      [
        "from_config(config)",
        "Maakt een tokenizer vanuit een config-achtig object."
      ],
      [
        "register(tokenizer_type, tokenizer_class)",
        "Registreert een tokenizer class onder een type-naam."
      ]
    ]
  },
  {
    "name": "create_tokenizer",
    "qualifiedName": "arclm.tokenizers.create_tokenizer",
    "importPath": "arclm.tokenizers.create_tokenizer",
    "canonicalImport": "from arclm.tokenizers import create_tokenizer",
    "alternativeImport": "from arclm import create_tokenizer",
    "kind": "function",
    "category": "tokenizers",
    "status": "Stable",
    "signature": "create_tokenizer(tokenizer_type='word', **kwargs)",
    "summary": "Maakt een tokenizer met een korte type-naam.",
    "parameters": [
      [
        "tokenizer_type",
        "Any",
        "'word'"
      ],
      [
        "kwargs",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "sentencepiece",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.tokenizers import create_tokenizer\n\nprint(create_tokenizer)",
    "members": []
  },
  {
    "name": "get_tokenizer_from_config",
    "qualifiedName": "arclm.tokenizers.get_tokenizer_from_config",
    "importPath": "arclm.tokenizers.get_tokenizer_from_config",
    "canonicalImport": "from arclm.tokenizers import get_tokenizer_from_config",
    "alternativeImport": "from arclm import get_tokenizer_from_config",
    "kind": "function",
    "category": "tokenizers",
    "status": "Stable",
    "signature": "get_tokenizer_from_config(config)",
    "summary": "Maakt een tokenizer vanuit een config object.",
    "parameters": [
      [
        "config",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "sentencepiece",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.tokenizers import get_tokenizer_from_config\n\nprint(get_tokenizer_from_config)",
    "members": []
  },
  {
    "name": "BaseCallback",
    "qualifiedName": "arclm.training.BaseCallback",
    "importPath": "arclm.training.BaseCallback",
    "canonicalImport": "from arclm.training import BaseCallback",
    "alternativeImport": "from arclm import BaseCallback",
    "kind": "class",
    "category": "training",
    "status": "Stable",
    "signature": "BaseCallback()",
    "summary": "Basis class voor eigen training callbacks.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "torch",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.training import BaseCallback\n\nprint(BaseCallback)",
    "members": [
      [
        "on_checkpoint_save(self, trainer, path) -> 'None'",
        "Wordt uitgevoerd nadat een checkpoint is opgeslagen."
      ],
      [
        "on_epoch_end(self, trainer, state) -> 'None'",
        "Wordt uitgevoerd aan het einde van een epoch."
      ],
      [
        "on_epoch_start(self, trainer, state) -> 'None'",
        "Wordt uitgevoerd aan het begin van een epoch."
      ],
      [
        "on_evaluate(self, trainer, metrics) -> 'None'",
        "Wordt uitgevoerd nadat evaluatie metrics zijn berekend."
      ],
      [
        "on_step_end(self, trainer, state) -> 'None'",
        "Wordt uitgevoerd nadat een batch is verwerkt."
      ],
      [
        "on_train_end(self, trainer) -> 'None'",
        "Wordt uitgevoerd nadat de training klaar is."
      ],
      [
        "on_train_start(self, trainer) -> 'None'",
        "Wordt uitgevoerd voordat de training begint."
      ]
    ]
  },
  {
    "name": "BaseModelAdapter",
    "qualifiedName": "arclm.training.BaseModelAdapter",
    "importPath": "arclm.training.BaseModelAdapter",
    "canonicalImport": "from arclm.training import BaseModelAdapter",
    "alternativeImport": "from arclm import BaseModelAdapter",
    "kind": "class",
    "category": "training",
    "status": "Stable",
    "signature": "BaseModelAdapter()",
    "summary": "Basis class voor adapters tussen twee model implementaties.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "torch",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.training import BaseModelAdapter\n\nprint(BaseModelAdapter)",
    "members": [
      [
        "adapt_weights(self, verbose: bool = True)",
        "Zet source weights om naar het doelmodel."
      ]
    ]
  },
  {
    "name": "BaseModelLoader",
    "qualifiedName": "arclm.training.BaseModelLoader",
    "importPath": "arclm.training.BaseModelLoader",
    "canonicalImport": "from arclm.training import BaseModelLoader",
    "alternativeImport": "from arclm import BaseModelLoader",
    "kind": "class",
    "category": "training",
    "status": "Stable",
    "signature": "BaseModelLoader()",
    "summary": "Basis class voor model loaders die een model en metadata geven.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "torch",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.training import BaseModelLoader\n\nprint(BaseModelLoader)",
    "members": [
      [
        "load(self)",
        "Laadt een modelbron."
      ]
    ]
  },
  {
    "name": "BaseTrainer",
    "qualifiedName": "arclm.training.BaseTrainer",
    "importPath": "arclm.training.BaseTrainer",
    "canonicalImport": "from arclm.training import BaseTrainer",
    "alternativeImport": "from arclm import BaseTrainer",
    "kind": "class",
    "category": "training",
    "status": "Stable",
    "signature": "BaseTrainer()",
    "summary": "Basis class voor developers die een eigen trainer willen maken.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "torch",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.training import BaseTrainer\n\nprint(BaseTrainer)",
    "members": [
      [
        "evaluate(self, dataset=None)",
        "Voert een eenvoudige evaluatie uit."
      ],
      [
        "train(self, *args, **kwargs)",
        "Start de training."
      ],
      [
        "training_step(self, batch)",
        "Voert \u00e9\u00e9n training step uit en geeft de loss terug."
      ]
    ]
  },
  {
    "name": "BaseTrainingPipeline",
    "qualifiedName": "arclm.training.BaseTrainingPipeline",
    "importPath": "arclm.training.BaseTrainingPipeline",
    "canonicalImport": "from arclm.training import BaseTrainingPipeline",
    "alternativeImport": "from arclm import BaseTrainingPipeline",
    "kind": "class",
    "category": "training",
    "status": "Stable",
    "signature": "BaseTrainingPipeline()",
    "summary": "Basis class voor aanpasbare training pipelines.",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "torch",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.training import BaseTrainingPipeline\n\nprint(BaseTrainingPipeline)",
    "members": [
      [
        "build(self, vocab_size: int)",
        "Bouwt de pipeline voor een vocabulairegrootte."
      ],
      [
        "get_model(self)",
        "Geeft het huidige model terug."
      ],
      [
        "save_checkpoint(self, path=None)",
        "Slaat de pipeline state op."
      ],
      [
        "train(self, train_loader, val_loader=None, num_epochs=None)",
        "Start de pipeline training."
      ]
    ]
  },
  {
    "name": "EarlyStopping",
    "qualifiedName": "arclm.training.EarlyStopping",
    "importPath": "arclm.training.EarlyStopping",
    "canonicalImport": "from arclm.training import EarlyStopping",
    "alternativeImport": "from arclm import EarlyStopping",
    "kind": "class",
    "category": "training",
    "status": "Stable",
    "signature": "EarlyStopping(patience=10, min_delta=0.0001)",
    "summary": "Early stopping to prevent overfitting",
    "parameters": [
      [
        "patience",
        "Any",
        "10"
      ],
      [
        "min_delta",
        "Any",
        "0.0001"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "torch",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.training import EarlyStopping\n\nprint(EarlyStopping)",
    "members": [
      [
        "check(self, val_loss)",
        "Check if training should stop Returns: True if should stop, False otherwise"
      ],
      [
        "reset(self)",
        "Reset early stopping"
      ]
    ]
  },
  {
    "name": "GeneralizationMonitor",
    "qualifiedName": "arclm.training.GeneralizationMonitor",
    "importPath": "arclm.training.GeneralizationMonitor",
    "canonicalImport": "from arclm.training import GeneralizationMonitor",
    "alternativeImport": "from arclm import GeneralizationMonitor",
    "kind": "class",
    "category": "training",
    "status": "Stable",
    "signature": "GeneralizationMonitor()",
    "summary": "Monitor model generalization during training Traceert training vs validation loss om overfitting te detecteren",
    "parameters": [],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "torch",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.training import GeneralizationMonitor\n\nprint(GeneralizationMonitor)",
    "members": [
      [
        "get_average_gap(self, window=10)",
        "Get average generalization gap over window"
      ],
      [
        "get_generalization_gap(self)",
        "Get current generalization gap (val - train)"
      ],
      [
        "get_report(self)",
        "Get generalization report"
      ],
      [
        "is_overfitting(self, threshold=0.5)",
        "Check if model is overfitting Args: threshold: Gap threshold to consider overfitting Returns: True if generalization gap > threshold"
      ],
      [
        "update(self, train_loss, val_loss)",
        "Update monitor with new losses"
      ]
    ]
  },
  {
    "name": "L1Regularization",
    "qualifiedName": "arclm.training.L1Regularization",
    "importPath": "arclm.training.L1Regularization",
    "canonicalImport": "from arclm.training import L1Regularization",
    "alternativeImport": "from arclm import L1Regularization",
    "kind": "class",
    "category": "training",
    "status": "Stable",
    "signature": "L1Regularization(lambda_l1=0.0001)",
    "summary": "L1 Regularization - Sparsity inducing",
    "parameters": [
      [
        "lambda_l1",
        "Any",
        "0.0001"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "torch",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.training import L1Regularization\n\nprint(L1Regularization)",
    "members": [
      [
        "compute_loss(self, model)",
        "Compute L1 regularization loss"
      ]
    ]
  },
  {
    "name": "L2Regularization",
    "qualifiedName": "arclm.training.L2Regularization",
    "importPath": "arclm.training.L2Regularization",
    "canonicalImport": "from arclm.training import L2Regularization",
    "alternativeImport": "from arclm import L2Regularization",
    "kind": "class",
    "category": "training",
    "status": "Stable",
    "signature": "L2Regularization(lambda_l2=0.0001)",
    "summary": "L2 Regularization (Weight Decay) - Smoothness inducing",
    "parameters": [
      [
        "lambda_l2",
        "Any",
        "0.0001"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "torch",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.training import L2Regularization\n\nprint(L2Regularization)",
    "members": [
      [
        "compute_loss(self, model)",
        "Compute L2 regularization loss"
      ]
    ]
  },
  {
    "name": "LabelSmoothing",
    "qualifiedName": "arclm.training.LabelSmoothing",
    "importPath": "arclm.training.LabelSmoothing",
    "canonicalImport": "from arclm.training import LabelSmoothing",
    "alternativeImport": "from arclm import LabelSmoothing",
    "kind": "class",
    "category": "training",
    "status": "Stable",
    "signature": "LabelSmoothing(num_classes, smoothing=0.1)",
    "summary": "Label smoothing regularization Voorkomt overconfident voorspellingen door targets glad te maken",
    "parameters": [
      [
        "num_classes",
        "Any",
        "required"
      ],
      [
        "smoothing",
        "Any",
        "0.1"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "torch",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.training import LabelSmoothing\n\nprint(LabelSmoothing)",
    "members": [
      [
        "add_module(self, name: str, module: Optional[ForwardRef('Module')]) -> None",
        "Add a child module to the current module."
      ],
      [
        "apply(self, fn: collections.abc.Callable[['Module'], None]) -> Self",
        "Apply ``fn`` recursively to every submodule (as returned by ``.children()``) as well as self."
      ],
      [
        "bfloat16(self) -> Self",
        "Casts all floating point parameters and buffers to ``bfloat16`` datatype."
      ],
      [
        "buffers(self, recurse: bool = True) -> collections.abc.Iterator[torch.Tensor]",
        "Return an iterator over module buffers."
      ],
      [
        "children(self) -> collections.abc.Iterator['Module']",
        "Return an iterator over immediate children modules."
      ],
      [
        "compile(self, *args, **kwargs) -> None",
        "Compile this Module's forward using :func:`torch.compile`."
      ],
      [
        "cpu(self) -> Self",
        "Move all model parameters and buffers to the CPU."
      ],
      [
        "cuda(self, device: int | torch.device | None = None) -> Self",
        "Move all model parameters and buffers to the GPU."
      ],
      [
        "double(self) -> Self",
        "Casts all floating point parameters and buffers to ``double`` datatype."
      ],
      [
        "eval(self) -> Self",
        "Set the module in evaluation mode."
      ],
      [
        "extra_repr(self) -> str",
        "Return the extra representation of the module."
      ],
      [
        "float(self) -> Self",
        "Casts all floating point parameters and buffers to ``float`` datatype."
      ]
    ]
  },
  {
    "name": "LearningRateScheduler",
    "qualifiedName": "arclm.training.LearningRateScheduler",
    "importPath": "arclm.training.LearningRateScheduler",
    "canonicalImport": "from arclm.training import LearningRateScheduler",
    "alternativeImport": "from arclm import LearningRateScheduler",
    "kind": "class",
    "category": "training",
    "status": "Stable",
    "signature": "LearningRateScheduler(optimizer, strategy='cosine', total_epochs=100)",
    "summary": "Learning rate scheduler for better generalization Reduce learning rate during training for better convergence",
    "parameters": [
      [
        "optimizer",
        "Any",
        "required"
      ],
      [
        "strategy",
        "Any",
        "'cosine'"
      ],
      [
        "total_epochs",
        "Any",
        "100"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "torch",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.training import LearningRateScheduler\n\nprint(LearningRateScheduler)",
    "members": [
      [
        "step(self, epoch)",
        "Update learning rate for current epoch"
      ]
    ]
  },
  {
    "name": "MixupAugmentation",
    "qualifiedName": "arclm.training.MixupAugmentation",
    "importPath": "arclm.training.MixupAugmentation",
    "canonicalImport": "from arclm.training import MixupAugmentation",
    "alternativeImport": "from arclm import MixupAugmentation",
    "kind": "class",
    "category": "training",
    "status": "Stable",
    "signature": "MixupAugmentation(alpha=1.0)",
    "summary": "Mixup data augmentation for better generalization Combineert twee samples lineair om data augmentation te krijgen",
    "parameters": [
      [
        "alpha",
        "Any",
        "1.0"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "torch",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.training import MixupAugmentation\n\nprint(MixupAugmentation)",
    "members": []
  },
  {
    "name": "ModelAdapter",
    "qualifiedName": "arclm.training.ModelAdapter",
    "importPath": "arclm.training.ModelAdapter",
    "canonicalImport": "from arclm.training import ModelAdapter",
    "alternativeImport": "from arclm import ModelAdapter",
    "kind": "class",
    "category": "training",
    "status": "Stable",
    "signature": "ModelAdapter(source_model: torch.nn.modules.module.Module, target_model: arclm.models.text.causal_lm.ArcLM)",
    "summary": "Adapt weights from external models to ArcLM architecture.",
    "parameters": [
      [
        "source_model",
        "Module",
        "required"
      ],
      [
        "target_model",
        "ArcLM",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "torch",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.training import ModelAdapter\n\nprint(ModelAdapter)",
    "members": [
      [
        "adapt_weights(self, verbose: bool = True) -> Dict[str, int]",
        "Adapt source model weights to target model architecture."
      ]
    ]
  },
  {
    "name": "PreTrainedModelLoader",
    "qualifiedName": "arclm.training.PreTrainedModelLoader",
    "importPath": "arclm.training.PreTrainedModelLoader",
    "canonicalImport": "from arclm.training import PreTrainedModelLoader",
    "alternativeImport": "from arclm import PreTrainedModelLoader",
    "kind": "class",
    "category": "training",
    "status": "Stable",
    "signature": "PreTrainedModelLoader(source: Union[str, pathlib.Path], target_vocab_size: int, target_config: arclm.configs.base.Config, device: str = 'cpu', strict_loading: bool = False) -> None",
    "summary": "Load pre-trained models from multiple sources: - HuggingFace transformers - Local checkpoint files - Custom model paths Handles weight alignment and architecture mismatch gracefully.",
    "parameters": [
      [
        "source",
        "Union",
        "required"
      ],
      [
        "target_vocab_size",
        "int",
        "required"
      ],
      [
        "target_config",
        "Config",
        "required"
      ],
      [
        "device",
        "str",
        "'cpu'"
      ],
      [
        "strict_loading",
        "bool",
        "False"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "torch",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.training import PreTrainedModelLoader\n\nprint(PreTrainedModelLoader)",
    "members": [
      [
        "load(self, revision: str | None = None, trust_remote_code: bool = False) -> tuple",
        "Load model and return (model, metadata)."
      ]
    ]
  },
  {
    "name": "StoppingCriteria",
    "qualifiedName": "arclm.training.StoppingCriteria",
    "importPath": "arclm.training.StoppingCriteria",
    "canonicalImport": "from arclm.training import StoppingCriteria",
    "alternativeImport": "from arclm import StoppingCriteria",
    "kind": "class",
    "category": "training",
    "status": "Stable",
    "signature": "StoppingCriteria(max_steps: Optional[int] = None, early_stopping_patience: Optional[int] = None, early_stopping_min_delta: float = 0.0) -> None",
    "summary": "Base stopping criteria for training loop control.",
    "parameters": [
      [
        "max_steps",
        "Optional",
        "None"
      ],
      [
        "early_stopping_patience",
        "Optional",
        "None"
      ],
      [
        "early_stopping_min_delta",
        "float",
        "0.0"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "torch",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.training import StoppingCriteria\n\nprint(StoppingCriteria)",
    "members": [
      [
        "should_stop_by_steps(self, current_step: int) -> bool",
        "Check if max_steps exceeded."
      ],
      [
        "should_stop_by_validation(self, val_loss: float, best_val_loss: float, patience_counter: int) -> bool",
        "Check if early stopping criteria met."
      ]
    ]
  },
  {
    "name": "Trainer",
    "qualifiedName": "arclm.training.Trainer",
    "importPath": "arclm.training.Trainer",
    "canonicalImport": "from arclm.training import Trainer",
    "alternativeImport": "from arclm import Trainer",
    "kind": "class",
    "category": "training",
    "status": "Stable",
    "signature": "Trainer(model, optimizer=None, criterion=None, config=None, *, train_dataset=None, validation_dataset=None, train_dataloader=None, validation_dataloader=None, scheduler=None, callbacks=None, event_logger=None, collate_fn=None, distributed_config=None)",
    "summary": "Traint een model op \u00e9\u00e9n apparaat.",
    "parameters": [
      [
        "model",
        "Any",
        "required"
      ],
      [
        "optimizer",
        "Any",
        "None"
      ],
      [
        "criterion",
        "Any",
        "None"
      ],
      [
        "config",
        "Any",
        "None"
      ],
      [
        "train_dataset",
        "Any",
        "None"
      ],
      [
        "validation_dataset",
        "Any",
        "None"
      ],
      [
        "train_dataloader",
        "Any",
        "None"
      ],
      [
        "validation_dataloader",
        "Any",
        "None"
      ],
      [
        "scheduler",
        "Any",
        "None"
      ],
      [
        "callbacks",
        "Any",
        "None"
      ],
      [
        "event_logger",
        "Any",
        "None"
      ],
      [
        "collate_fn",
        "Any",
        "None"
      ],
      [
        "distributed_config",
        "Any",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "torch",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.training import Trainer\n\nprint(Trainer)",
    "members": [
      [
        "compute_loss(self, logits, y, loss_mask=None)",
        "Berekent next-token loss, eventueel alleen op gemaskeerde tokens."
      ],
      [
        "evaluate(self, dataset=None)",
        "Voert evaluatie uit en geeft metrics terug."
      ],
      [
        "exists(self, model_path)",
        "Controleert of een checkpoint bestaat."
      ],
      [
        "freeze_layers(self, pattern: str = 'blocks', verbose: bool = True) -> int",
        "Bevriest lagen waarvan de naam bij het patroon past."
      ],
      [
        "get_frozen_layers_info(self) -> dict",
        "Geeft info over bevroren en trainbare lagen."
      ],
      [
        "get_generalization_gap(self)",
        "Geeft de generalisatie gap terug."
      ],
      [
        "get_learning_rate(self)",
        "Geeft de huidige learning rate terug."
      ],
      [
        "get_train_history(self)",
        "Geeft de training history terug."
      ],
      [
        "load(self, model_path)",
        "Laadt een oud-stijl ArcLM checkpoint."
      ],
      [
        "load_checkpoint(self, path, *, synchronize=None)",
        "Laadt een training checkpoint."
      ],
      [
        "prepare_batch(self, batch)",
        "Zet tensors in een batch op het juiste apparaat."
      ],
      [
        "restore_best_model(self)",
        "Herstelt weights van de beste validatie loss als die bestaat."
      ]
    ]
  },
  {
    "name": "TrainingConfig",
    "qualifiedName": "arclm.training.TrainingConfig",
    "importPath": "arclm.training.TrainingConfig",
    "canonicalImport": "from arclm.training import TrainingConfig",
    "alternativeImport": "from arclm import TrainingConfig",
    "kind": "class",
    "category": "training",
    "status": "Stable",
    "signature": "TrainingConfig(epochs: 'int' = 3, batch_size: 'int' = 8, learning_rate: 'float' = 2e-05, weight_decay: 'float' = 0.0, gradient_accumulation_steps: 'int' = 1, precision: 'str' = 'fp32', max_grad_norm: 'float | None' = 1.0, output_dir: 'str' = 'outputs', save_every_steps: 'int' = 500, keep_last_checkpoints: 'int | None' = 3, log_every_steps: 'int' = 10, optimizer: 'str' = 'adamw', scheduler: 'str' = 'constant', warmup_steps: 'int' = 0, max_steps: 'int | None' = None, device: 'str | None' = None, num_workers: 'int' = 0, shuffle: 'bool' = True) -> None",
    "summary": "Bewaart de belangrijkste instellingen voor een training.",
    "parameters": [
      [
        "epochs",
        "int",
        "3"
      ],
      [
        "batch_size",
        "int",
        "8"
      ],
      [
        "learning_rate",
        "float",
        "2e-05"
      ],
      [
        "weight_decay",
        "float",
        "0.0"
      ],
      [
        "gradient_accumulation_steps",
        "int",
        "1"
      ],
      [
        "precision",
        "str",
        "'fp32'"
      ],
      [
        "max_grad_norm",
        "float | None",
        "1.0"
      ],
      [
        "output_dir",
        "str",
        "'outputs'"
      ],
      [
        "save_every_steps",
        "int",
        "500"
      ],
      [
        "keep_last_checkpoints",
        "int | None",
        "3"
      ],
      [
        "log_every_steps",
        "int",
        "10"
      ],
      [
        "optimizer",
        "str",
        "'adamw'"
      ],
      [
        "scheduler",
        "str",
        "'constant'"
      ],
      [
        "warmup_steps",
        "int",
        "0"
      ],
      [
        "max_steps",
        "int | None",
        "None"
      ],
      [
        "device",
        "str | None",
        "None"
      ],
      [
        "num_workers",
        "int",
        "0"
      ],
      [
        "shuffle",
        "bool",
        "True"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "torch",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.training import TrainingConfig\n\nprint(TrainingConfig)",
    "members": [
      [
        "from_dict(values: 'dict[str, Any]') -> \"'TrainingConfig'\"",
        "Maakt een config vanuit een dict."
      ],
      [
        "to_dict(self) -> 'dict[str, Any]'",
        "Zet de config om naar een gewone dict."
      ],
      [
        "validate(self) -> 'None'",
        "Controleert of de training instellingen bruikbaar zijn."
      ]
    ]
  },
  {
    "name": "TrainingResult",
    "qualifiedName": "arclm.training.TrainingResult",
    "importPath": "arclm.training.TrainingResult",
    "canonicalImport": "from arclm.training import TrainingResult",
    "alternativeImport": "from arclm import TrainingResult",
    "kind": "class",
    "category": "training",
    "status": "Stable",
    "signature": "TrainingResult(mode: str, model_path: str, config: arclm.configs.base.Config, history: Dict[str, Any], vocab_size: int, tokenizer: Union[arclm.tokenizers.base.Tokenizer, arclm.tokenizers.base.SentencePieceTokenizer, NoneType] = None, checkpoint_source: Optional[str] = None) -> None",
    "summary": "Resultaat dat `train_model` teruggeeft na een trainingsrun.",
    "parameters": [
      [
        "mode",
        "str",
        "required"
      ],
      [
        "model_path",
        "str",
        "required"
      ],
      [
        "config",
        "Config",
        "required"
      ],
      [
        "history",
        "Dict",
        "required"
      ],
      [
        "vocab_size",
        "int",
        "required"
      ],
      [
        "tokenizer",
        "Union",
        "None"
      ],
      [
        "checkpoint_source",
        "Optional",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "torch",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.training import TrainingResult\n\nprint(TrainingResult)",
    "members": []
  },
  {
    "name": "TrainingState",
    "qualifiedName": "arclm.training.TrainingState",
    "importPath": "arclm.training.TrainingState",
    "canonicalImport": "from arclm.training import TrainingState",
    "alternativeImport": "from arclm import TrainingState",
    "kind": "class",
    "category": "training",
    "status": "Stable",
    "signature": "TrainingState(epoch: 'int' = 0, step: 'int' = 0, global_step: 'int' = 0, optimizer_step: 'int' = 0, best_loss: 'float | None' = None, last_loss: 'float | None' = None, last_validation_loss: 'float | None' = None, learning_rate: 'float | None' = None, elapsed_seconds: 'float' = 0.0) -> None",
    "summary": "Houdt bij waar de training is.",
    "parameters": [
      [
        "epoch",
        "int",
        "0"
      ],
      [
        "step",
        "int",
        "0"
      ],
      [
        "global_step",
        "int",
        "0"
      ],
      [
        "optimizer_step",
        "int",
        "0"
      ],
      [
        "best_loss",
        "float | None",
        "None"
      ],
      [
        "last_loss",
        "float | None",
        "None"
      ],
      [
        "last_validation_loss",
        "float | None",
        "None"
      ],
      [
        "learning_rate",
        "float | None",
        "None"
      ],
      [
        "elapsed_seconds",
        "float",
        "0.0"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "torch",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.training import TrainingState\n\nprint(TrainingState)",
    "members": [
      [
        "from_dict(values: 'dict[str, Any] | None') -> \"'TrainingState'\"",
        "Maakt een state vanuit checkpoint-data."
      ],
      [
        "to_dict(self) -> 'dict[str, Any]'",
        "Zet de state om naar een gewone dict."
      ]
    ]
  },
  {
    "name": "UnifiedPipeline",
    "qualifiedName": "arclm.training.UnifiedPipeline",
    "importPath": "arclm.training.UnifiedPipeline",
    "canonicalImport": "from arclm.training import UnifiedPipeline",
    "alternativeImport": "from arclm import UnifiedPipeline",
    "kind": "class",
    "category": "training",
    "status": "Stable",
    "signature": "UnifiedPipeline(config: arclm.configs.base.Config, mode: str = 'fine_tuning', pretrained_source: Union[str, pathlib.Path, NoneType] = None, stopping_criteria: Optional[arclm.training.unified.StoppingCriteria] = None)",
    "summary": "Unified training pipeline supporting multiple modes: - PRE_TRAINING: Train from scratch on large corpus - FINE_TUNING: Fine-tune pre-trained model on task data - INSTRUCTION_TUNING: Fine-tune on instruction-response pair",
    "parameters": [
      [
        "config",
        "Config",
        "required"
      ],
      [
        "mode",
        "str",
        "'fine_tuning'"
      ],
      [
        "pretrained_source",
        "Union",
        "None"
      ],
      [
        "stopping_criteria",
        "Optional",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "torch",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.training import UnifiedPipeline\n\nprint(UnifiedPipeline)",
    "members": [
      [
        "build(self, vocab_size: int) -> 'UnifiedPipeline'",
        "Build model and trainer."
      ],
      [
        "get_model(self) -> arclm.models.text.causal_lm.ArcLM",
        "Get the trained model."
      ],
      [
        "save_checkpoint(self, path: Optional[str] = None) -> pathlib.Path",
        "Save model checkpoint with metadata."
      ],
      [
        "train(self, train_loader, val_loader=None, num_epochs: Optional[int] = None) -> Dict[str, Any]",
        "Execute training with stopping criteria."
      ]
    ]
  },
  {
    "name": "build_model",
    "qualifiedName": "arclm.training.build_model",
    "importPath": "arclm.training.build_model",
    "canonicalImport": "from arclm.training import build_model",
    "alternativeImport": "from arclm import build_model",
    "kind": "function",
    "category": "training",
    "status": "Stable",
    "signature": "build_model(config, vocab_size=None) -> arclm.models.text.causal_lm.ArcLM",
    "summary": "Maakt een ArcLM model vanuit config en zet het op het gekozen device.",
    "parameters": [
      [
        "config",
        "Any",
        "required"
      ],
      [
        "vocab_size",
        "Any",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "torch",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.training import build_model\n\nprint(build_model)",
    "members": []
  },
  {
    "name": "build_optimizer_with_discriminative_lr",
    "qualifiedName": "arclm.training.build_optimizer_with_discriminative_lr",
    "importPath": "arclm.training.build_optimizer_with_discriminative_lr",
    "canonicalImport": "from arclm.training import build_optimizer_with_discriminative_lr",
    "alternativeImport": "",
    "kind": "function",
    "category": "training",
    "status": "Stable",
    "signature": "build_optimizer_with_discriminative_lr(model, learning_rate: float, weight_decay: float, lr_multiplier: dict = None) -> torch.optim.optimizer.Optimizer",
    "summary": "Maakt een optimizer met aparte learning rates per laag-groep.",
    "parameters": [
      [
        "model",
        "Any",
        "required"
      ],
      [
        "learning_rate",
        "float",
        "required"
      ],
      [
        "weight_decay",
        "float",
        "required"
      ],
      [
        "lr_multiplier",
        "dict",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "torch",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.training import build_optimizer_with_discriminative_lr\n\nprint(build_optimizer_with_discriminative_lr)",
    "members": []
  },
  {
    "name": "build_trainer",
    "qualifiedName": "arclm.training.build_trainer",
    "importPath": "arclm.training.build_trainer",
    "canonicalImport": "from arclm.training import build_trainer",
    "alternativeImport": "from arclm import build_trainer",
    "kind": "function",
    "category": "training",
    "status": "Stable",
    "signature": "build_trainer(model, config, event_logger=None)",
    "summary": "Maakt de optimizer, loss function en Trainer voor een model.",
    "parameters": [
      [
        "model",
        "Any",
        "required"
      ],
      [
        "config",
        "Any",
        "required"
      ],
      [
        "event_logger",
        "Any",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "torch",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.training import build_trainer\n\nprint(build_trainer)",
    "members": []
  },
  {
    "name": "checkpoint_is_compatible_for_continue_training",
    "qualifiedName": "arclm.training.checkpoint_is_compatible_for_continue_training",
    "importPath": "arclm.training.checkpoint_is_compatible_for_continue_training",
    "canonicalImport": "from arclm.training import checkpoint_is_compatible_for_continue_training",
    "alternativeImport": "from arclm import checkpoint_is_compatible_for_continue_training",
    "kind": "function",
    "category": "training",
    "status": "Stable",
    "signature": "checkpoint_is_compatible_for_continue_training(checkpoint, config, vocab_size, tokenizer=None)",
    "summary": "Controleert of een checkpoint past bij continued training.",
    "parameters": [
      [
        "checkpoint",
        "Any",
        "required"
      ],
      [
        "config",
        "Any",
        "required"
      ],
      [
        "vocab_size",
        "Any",
        "required"
      ],
      [
        "tokenizer",
        "Any",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "torch",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.training import checkpoint_is_compatible_for_continue_training\n\nprint(checkpoint_is_compatible_for_continue_training)",
    "members": []
  },
  {
    "name": "checkpoint_is_compatible_for_tuining",
    "qualifiedName": "arclm.training.checkpoint_is_compatible_for_tuining",
    "importPath": "arclm.training.checkpoint_is_compatible_for_tuining",
    "canonicalImport": "from arclm.training import checkpoint_is_compatible_for_tuining",
    "alternativeImport": "from arclm import checkpoint_is_compatible_for_tuining",
    "kind": "function",
    "category": "training",
    "status": "Deprecated",
    "signature": "checkpoint_is_compatible_for_tuining(checkpoint, config, vocab_size, tokenizer=None)",
    "summary": "Controleert of een checkpoint past bij finetuning.",
    "parameters": [
      [
        "checkpoint",
        "Any",
        "required"
      ],
      [
        "config",
        "Any",
        "required"
      ],
      [
        "vocab_size",
        "Any",
        "required"
      ],
      [
        "tokenizer",
        "Any",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "torch",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.training import checkpoint_is_compatible_for_tuining\n\nprint(checkpoint_is_compatible_for_tuining)",
    "members": []
  },
  {
    "name": "create_checkpoint_callback",
    "qualifiedName": "arclm.training.create_checkpoint_callback",
    "importPath": "arclm.training.create_checkpoint_callback",
    "canonicalImport": "from arclm.training import create_checkpoint_callback",
    "alternativeImport": "from arclm import create_checkpoint_callback",
    "kind": "function",
    "category": "training",
    "status": "Stable",
    "signature": "create_checkpoint_callback(config, tokenizer, vocab_size)",
    "summary": "Maakt een callback die het laatste hervatbare checkpoint opslaat.",
    "parameters": [
      [
        "config",
        "Any",
        "required"
      ],
      [
        "tokenizer",
        "Any",
        "required"
      ],
      [
        "vocab_size",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "torch",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.training import create_checkpoint_callback\n\nprint(create_checkpoint_callback)",
    "members": []
  },
  {
    "name": "create_epoch_checkpoint_callback",
    "qualifiedName": "arclm.training.create_epoch_checkpoint_callback",
    "importPath": "arclm.training.create_epoch_checkpoint_callback",
    "canonicalImport": "from arclm.training import create_epoch_checkpoint_callback",
    "alternativeImport": "from arclm import create_epoch_checkpoint_callback",
    "kind": "function",
    "category": "training",
    "status": "Stable",
    "signature": "create_epoch_checkpoint_callback(config, tokenizer, vocab_size)",
    "summary": "Oude alias voor `create_checkpoint_callback`.",
    "parameters": [
      [
        "config",
        "Any",
        "required"
      ],
      [
        "tokenizer",
        "Any",
        "required"
      ],
      [
        "vocab_size",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "torch",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.training import create_epoch_checkpoint_callback\n\nprint(create_epoch_checkpoint_callback)",
    "members": []
  },
  {
    "name": "load_compatible_checkpoint",
    "qualifiedName": "arclm.training.load_compatible_checkpoint",
    "importPath": "arclm.training.load_compatible_checkpoint",
    "canonicalImport": "from arclm.training import load_compatible_checkpoint",
    "alternativeImport": "from arclm import load_compatible_checkpoint",
    "kind": "function",
    "category": "training",
    "status": "Stable",
    "signature": "load_compatible_checkpoint(trainer, config, vocab_size, tokenizer=None)",
    "summary": "Laadt een bestaand checkpoint als het past bij deze training.",
    "parameters": [
      [
        "trainer",
        "Any",
        "required"
      ],
      [
        "config",
        "Any",
        "required"
      ],
      [
        "vocab_size",
        "Any",
        "required"
      ],
      [
        "tokenizer",
        "Any",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "torch",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.training import load_compatible_checkpoint\n\nprint(load_compatible_checkpoint)",
    "members": []
  },
  {
    "name": "save_training_checkpoint",
    "qualifiedName": "arclm.training.save_training_checkpoint",
    "importPath": "arclm.training.save_training_checkpoint",
    "canonicalImport": "from arclm.training import save_training_checkpoint",
    "alternativeImport": "from arclm import save_training_checkpoint",
    "kind": "function",
    "category": "training",
    "status": "Stable",
    "signature": "save_training_checkpoint(trainer, config, tokenizer, vocab_size)",
    "summary": "Slaat een trainer checkpoint op met tokenizer metadata.",
    "parameters": [
      [
        "trainer",
        "Any",
        "required"
      ],
      [
        "config",
        "Any",
        "required"
      ],
      [
        "tokenizer",
        "Any",
        "required"
      ],
      [
        "vocab_size",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "torch",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.training import save_training_checkpoint\n\nprint(save_training_checkpoint)",
    "members": []
  },
  {
    "name": "tokenizer_from_checkpoint",
    "qualifiedName": "arclm.training.tokenizer_from_checkpoint",
    "importPath": "arclm.training.tokenizer_from_checkpoint",
    "canonicalImport": "from arclm.training import tokenizer_from_checkpoint",
    "alternativeImport": "from arclm import tokenizer_from_checkpoint",
    "kind": "function",
    "category": "training",
    "status": "Stable",
    "signature": "tokenizer_from_checkpoint(checkpoint_or_source)",
    "summary": "Haalt een ArcLM tokenizer uit een checkpoint of checkpoint-pad.",
    "parameters": [
      [
        "checkpoint_or_source",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "torch",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.training import tokenizer_from_checkpoint\n\nprint(tokenizer_from_checkpoint)",
    "members": []
  },
  {
    "name": "train_model",
    "qualifiedName": "arclm.training.train_model",
    "importPath": "arclm.training.train_model",
    "canonicalImport": "from arclm.training import train_model",
    "alternativeImport": "from arclm import train_model",
    "kind": "function",
    "category": "training",
    "status": "Stable",
    "signature": "train_model(mode: str, data: str, output: str, checkpoint: Optional[str] = None, config: Optional[arclm.configs.base.Config] = None, tokenizer=None, **config_overrides) -> arclm.training.pipeline.TrainingResult",
    "summary": "Traint een ArcLM model in pretrain, finetune of continue_training mode.",
    "parameters": [
      [
        "mode",
        "str",
        "required"
      ],
      [
        "data",
        "str",
        "required"
      ],
      [
        "output",
        "str",
        "required"
      ],
      [
        "checkpoint",
        "Optional",
        "None"
      ],
      [
        "config",
        "Optional",
        "None"
      ],
      [
        "tokenizer",
        "Any",
        "None"
      ],
      [
        "config_overrides",
        "Any",
        "required"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "torch",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.training import train_model\n\nprint(train_model)",
    "members": []
  },
  {
    "name": "DatasetRoot",
    "qualifiedName": "arclm.web.DatasetRoot",
    "importPath": "arclm.web.DatasetRoot",
    "canonicalImport": "from arclm.web import DatasetRoot",
    "alternativeImport": "",
    "kind": "class",
    "category": "web",
    "status": "Beta",
    "signature": "DatasetRoot(name: 'str', path: 'str | Path', root_id: 'str | None' = None, enabled: 'bool' = True, recursive: 'bool' = True, source_origin: \"Literal['persisted', 'command_line']\" = 'command_line') -> None",
    "summary": "Een server-side datasetmap die de browser mag laten inspecteren.",
    "parameters": [
      [
        "name",
        "str",
        "required"
      ],
      [
        "path",
        "str | Path",
        "required"
      ],
      [
        "root_id",
        "str | None",
        "None"
      ],
      [
        "enabled",
        "bool",
        "True"
      ],
      [
        "recursive",
        "bool",
        "True"
      ],
      [
        "source_origin",
        "Literal['persisted', 'command_line']",
        "'command_line'"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "fastapi, uvicorn",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.web import DatasetRoot\n\nprint(DatasetRoot)",
    "members": []
  },
  {
    "name": "WebConfig",
    "qualifiedName": "arclm.web.WebConfig",
    "importPath": "arclm.web.WebConfig",
    "canonicalImport": "from arclm.web import WebConfig",
    "alternativeImport": "",
    "kind": "class",
    "category": "web",
    "status": "Beta",
    "signature": "WebConfig(host: 'str' = '127.0.0.1', port: 'int' = 8765, allowed_origins: 'tuple[str, ...]' = ('http://127.0.0.1:3000', 'http://localhost:3000'), expose_docs: 'bool' = True, dataset_config_path: 'str | Path | None' = None, dataset_source_management: 'bool' = True, workspace_root: 'str | Path' = 'workspace', dataset_roots: 'tuple[DatasetRoot, ...]' = (), max_dataset_roots: 'int' = 20, max_catalogue_entries: 'int' = 500, max_recursive_depth: 'int' = 5, default_preview_rows: 'int' = 20, max_preview_rows: 'int' = 100, max_scan_rows: 'int' = 10000, max_field_length: 'int' = 2000, max_fields: 'int' = 200, max_inspection_file_size: 'int' = 10485760, max_upload_size: 'int' = 26214400, max_paste_size: 'int' = 2097152, max_tokenizer_text_length: 'int' = 20000, max_dataset_inspection_records: 'int' = 20, max_dataset_inspection_tokens: 'int' = 256, max_active_training_jobs: 'int' = 1, max_evaluation_examples: 'int' = 256, max_generation_prompt_chars: 'int' = 8000, max_generation_new_tokens: 'int' = 128, max_generation_history: 'int' = 100) -> None",
    "summary": "Instellingen voor de lokale Web API.",
    "parameters": [
      [
        "host",
        "str",
        "'127.0.0.1'"
      ],
      [
        "port",
        "int",
        "8765"
      ],
      [
        "allowed_origins",
        "tuple[str, ...]",
        "('http://127.0.0.1:3000', 'http://localhost:3000')"
      ],
      [
        "expose_docs",
        "bool",
        "True"
      ],
      [
        "dataset_config_path",
        "str | Path | None",
        "None"
      ],
      [
        "dataset_source_management",
        "bool",
        "True"
      ],
      [
        "workspace_root",
        "str | Path",
        "'workspace'"
      ],
      [
        "dataset_roots",
        "tuple[DatasetRoot, ...]",
        "()"
      ],
      [
        "max_dataset_roots",
        "int",
        "20"
      ],
      [
        "max_catalogue_entries",
        "int",
        "500"
      ],
      [
        "max_recursive_depth",
        "int",
        "5"
      ],
      [
        "default_preview_rows",
        "int",
        "20"
      ],
      [
        "max_preview_rows",
        "int",
        "100"
      ],
      [
        "max_scan_rows",
        "int",
        "10000"
      ],
      [
        "max_field_length",
        "int",
        "2000"
      ],
      [
        "max_fields",
        "int",
        "200"
      ],
      [
        "max_inspection_file_size",
        "int",
        "10485760"
      ],
      [
        "max_upload_size",
        "int",
        "26214400"
      ],
      [
        "max_paste_size",
        "int",
        "2097152"
      ],
      [
        "max_tokenizer_text_length",
        "int",
        "20000"
      ],
      [
        "max_dataset_inspection_records",
        "int",
        "20"
      ],
      [
        "max_dataset_inspection_tokens",
        "int",
        "256"
      ],
      [
        "max_active_training_jobs",
        "int",
        "1"
      ],
      [
        "max_evaluation_examples",
        "int",
        "256"
      ],
      [
        "max_generation_prompt_chars",
        "int",
        "8000"
      ],
      [
        "max_generation_new_tokens",
        "int",
        "128"
      ],
      [
        "max_generation_history",
        "int",
        "100"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "fastapi, uvicorn",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.web import WebConfig\n\nprint(WebConfig)",
    "members": []
  },
  {
    "name": "create_app",
    "qualifiedName": "arclm.web.create_app",
    "importPath": "arclm.web.create_app",
    "canonicalImport": "from arclm.web import create_app",
    "alternativeImport": "",
    "kind": "function",
    "category": "web",
    "status": "Beta",
    "signature": "create_app(config: 'WebConfig | None' = None, *, model: 'Any | None' = None, tokenizer: 'Any | None' = None)",
    "summary": "Maakt de lokale ArcLM Web API.",
    "parameters": [
      [
        "config",
        "WebConfig | None",
        "None"
      ],
      [
        "model",
        "Any | None",
        "None"
      ],
      [
        "tokenizer",
        "Any | None",
        "None"
      ]
    ],
    "returns": "See the function or class docstring and type annotations.",
    "errors": [
      "Raises documented subsystem errors for invalid inputs or missing optional dependencies."
    ],
    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
    "optionalDependencies": "fastapi, uvicorn",
    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
    "limitations": "Status label and subsystem guide describe the stable boundary.",
    "usage": "from arclm.web import create_app\n\nprint(create_app)",
    "members": []
  }
];
