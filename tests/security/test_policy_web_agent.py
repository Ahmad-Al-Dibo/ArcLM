import os
import subprocess
import sys

import pytest

from arclm.agents import Agent, AgentRunner, ModelResponse, ToolCall, tool
from arclm.security import redact_mapping, redact_sensitive_text, security_status
from arclm.security.network import validate_url_for_fetch
from arclm.security.paths import resolve_under_root
from arclm.security.tools import create_security_tool_collection
from arclm.security.web import CsrfTokenManager, WebTransportPolicy, security_headers, validate_cors_policy, validate_transport_policy
from arclm.security.configuration import SecurityMode


def test_redaction_and_status_are_safe():
    assert "supersecret" not in redact_sensitive_text("password=supersecret")
    assert "abc.def" not in redact_sensitive_text("Authorization: Bearer abc.def.ghi")
    assert redact_mapping({"api_key": "abc"})["api_key"] == "[REDACTED]"
    status = security_status()
    assert "warnings" in status
    assert "key" not in str(status).lower()


def test_path_and_url_security_helpers(tmp_path, monkeypatch):
    root = tmp_path / "root"
    root.mkdir()
    assert resolve_under_root(root, "safe/file.txt").is_absolute()
    with pytest.raises(Exception):
        resolve_under_root(root, "../escape.txt")

    monkeypatch.setattr("arclm.security.network.host_is_private", lambda host: host == "127.0.0.1")
    assert validate_url_for_fetch("https://example.com") == "https://example.com"
    with pytest.raises(Exception):
        validate_url_for_fetch("file:///tmp/a")
    with pytest.raises(Exception):
        validate_url_for_fetch("http://127.0.0.1")


def test_web_security_policy_helpers():
    validate_cors_policy(allowed_origins=("http://127.0.0.1:3000",), allow_credentials=False)
    with pytest.raises(Exception):
        validate_cors_policy(allowed_origins=("*",), allow_credentials=True)
    with pytest.raises(Exception):
        validate_transport_policy(WebTransportPolicy(mode=SecurityMode.REMOTE_SECURE, host="0.0.0.0", tls_enabled=False))
    token_manager = CsrfTokenManager()
    token = token_manager.create_token()
    token_manager.validate_token(token)
    assert "X-Content-Type-Options" in security_headers()


def test_agent_tool_result_is_redacted_before_session_trace():
    @tool
    def leak() -> str:
        """Return synthetic secret text."""

        return "password=supersecret"

    class FakeModel:
        def __init__(self):
            self.calls = 0

        def generate_response(self, *, messages, tools, instructions, session):
            self.calls += 1
            if self.calls == 1:
                return ModelResponse(tool_calls=[ToolCall(id="c1", name="leak", arguments={})])
            return ModelResponse(content="done")

    result = AgentRunner(max_steps=2).run(Agent(name="safe", instructions="x", model=FakeModel(), tools=[leak]), "go")
    serialized = result.session.to_json()
    assert "supersecret" not in serialized
    assert "[REDACTED]" in serialized


def test_security_agent_tool_collection_is_pure():
    collection = create_security_tool_collection()
    names = [tool.name for tool in collection.tools]
    assert names == ["redact_sensitive_text", "hash_text"]
    assert collection.tools[0].invoke({"text": "api_key=abc"}).value == "api_key=[REDACTED]"


def test_security_import_boundary_is_lightweight():
    code = """
import sys
import arclm
import arclm.security
for name in ["keyring", "tink", "fastapi", "openai", "anthropic", "safetensors"]:
    assert name not in sys.modules, name
"""
    env = dict(os.environ)
    env["PYTHONPATH"] = "src"
    result = subprocess.run([sys.executable, "-c", code], env=env, text=True, capture_output=True, check=False)
    assert result.returncode == 0, result.stderr
