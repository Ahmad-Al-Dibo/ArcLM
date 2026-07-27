import json
import threading
import time

import pytest


pytestmark = pytest.mark.filterwarnings("ignore::DeprecationWarning")


class FakeSourceInfo:
    source_type = "fake_local"

    def to_dict(self):
        return {"source_type": self.source_type, "warnings": [], "model_type": "deterministic"}


class ContextAwareFakeModel:
    source_info = FakeSourceInfo()
    device = "cpu"

    def __init__(self):
        self.inputs = []

    def generate(self, prepared_input, **kwargs):
        self.inputs.append(prepared_input)
        text = json.dumps(prepared_input).lower() if not isinstance(prepared_input, str) else prepared_input.lower()
        if "my project is called arclm" in text and "what is my project called" in text:
            return "Your project is called ArcLM."
        return "Recorded."


class FakeParameter:
    device = "cuda:0"
    dtype = "torch.float16"

    def numel(self):
        return 123


class AgentToolFakeModel(ContextAwareFakeModel):
    device = "cuda:0"

    def parameters(self):
        return [FakeParameter()]

    def generate(self, prepared_input, **kwargs):
        self.inputs.append(prepared_input)
        if isinstance(prepared_input, str):
            payload = json.loads(prepared_input)
            if any(message.get("role") == "tool" and message.get("name") == "inspect_model" for message in payload.get("messages", [])):
                if "support-data" in prepared_input:
                    return json.dumps({"type": "final", "content": "The model is on cuda:0, and your dataset is support-data."})
                return json.dumps({"type": "final", "content": "The inspected model is running on cuda:0."})
            return json.dumps({"type": "tool_call", "id": "tool_call_1", "tool": "inspect_model", "arguments": {}})
        return super().generate(prepared_input, **kwargs)


class BlockingStreamingFakeModel(ContextAwareFakeModel):
    source_info = FakeSourceInfo()
    device = "cpu"

    def __init__(self):
        super().__init__()
        self.first_delta_emitted = threading.Event()
        self.allow_completion = threading.Event()
        self.completed = threading.Event()
        self.calls = 0

    def stream_generate(self, prepared_input, **kwargs):
        self.inputs.append(prepared_input)
        self.calls += 1
        text = json.dumps(prepared_input, ensure_ascii=False)
        if "What is my project called?" in text:
            chunks = ["Your project ", "is ArcLM. مرحبا\n```json\n", "{\"ok\": true}", "\n```"]
        elif "My project is called ArcLM." in text:
            chunks = ["Prompt 1 ", "response."]
        else:
            chunks = ["Hello ", "stream."]
        yield {"text": chunks[0], "token_id": 101}
        self.first_delta_emitted.set()
        self.allow_completion.wait(2)
        for index, chunk in enumerate(chunks[1:], start=102):
            yield {"text": chunk, "token_id": index}
        self.completed.set()


def make_client(monkeypatch, tmp_path):
    import arclm.simple_interface as simple_interface

    fake = ContextAwareFakeModel()
    monkeypatch.setattr(simple_interface, "_model", None)
    monkeypatch.setattr(simple_interface, "_model_cache_key", None)
    monkeypatch.setattr(simple_interface, "_model_source", None)
    monkeypatch.setattr(simple_interface, "_model_options", {})
    monkeypatch.setattr(simple_interface, "load_any_model", lambda *args, **kwargs: fake)
    app = simple_interface.create_simple_interface_app(storage_path=tmp_path / "chat-store.json")
    app.config["ARCLM_OPERATION_HUB"].reset()
    return app.test_client(), fake


def make_client_with_model(monkeypatch, tmp_path, fake):
    import arclm.simple_interface as simple_interface

    monkeypatch.setattr(simple_interface, "_model", None)
    monkeypatch.setattr(simple_interface, "_model_cache_key", None)
    monkeypatch.setattr(simple_interface, "_model_source", None)
    monkeypatch.setattr(simple_interface, "_model_options", {})
    monkeypatch.setattr(simple_interface, "load_any_model", lambda *args, **kwargs: fake)
    app = simple_interface.create_simple_interface_app(storage_path=tmp_path / "chat-store.json")
    app.config["ARCLM_OPERATION_HUB"].reset()
    return app.test_client(), fake


def wait_for_status(client, expected, timeout=2.0):
    deadline = time.time() + timeout
    last = None
    while time.time() < deadline:
        response = client.get("/api/operations/status")
        assert response.status_code == 200
        last = response.json["status"]
        if last["state"] == expected:
            return last
        time.sleep(0.02)
    raise AssertionError(f"Expected status {expected!r}, got {last!r}")


def wait_for_generation_request(client, request_id, expected, timeout=3.0):
    deadline = time.time() + timeout
    last = None
    while time.time() < deadline:
        response = client.get(f"/api/generation-runs/{request_id}")
        if response.status_code == 200:
            last = response.json["generation_run"]
            if last["status"] == expected:
                return last
        time.sleep(0.02)
    raise AssertionError(f"Expected generation run {expected!r}, got {last!r}")


def wait_for_stream_events(client, generation_id, event_type, timeout=3.0):
    deadline = time.time() + timeout
    while time.time() < deadline:
        response = client.get(f"/api/generation-runs/{generation_id}/events")
        assert response.status_code == 200
        events = response.json["events"]
        if any(event.get("type") == event_type for event in events):
            return events
        time.sleep(0.02)
    raise AssertionError(f"Expected stream event {event_type!r}")


def wait_for_message_status(client, chat_id, message_id, expected, timeout=3.0):
    deadline = time.time() + timeout
    last = None
    while time.time() < deadline:
        conversation = client.get(f"/api/chats/{chat_id}").json["conversation"]
        message = next(item for item in conversation["messages"] if item["id"] == message_id)
        last = message
        if message["status"] == expected:
            return message
        time.sleep(0.02)
    raise AssertionError(f"Expected message status {expected!r}, got {last!r}")


def test_conversation_persists_and_follow_up_receives_context(monkeypatch, tmp_path):
    client, fake = make_client(monkeypatch, tmp_path)

    chat = client.post("/api/chats", json={"model_source": "fake/model"}).json["conversation"]
    first = client.post(f"/api/chats/{chat['id']}/messages", json={"content": "My project is called ArcLM."})
    second = client.post(f"/api/chats/{chat['id']}/messages", json={"content": "What is my project called?"})

    assert first.status_code == 200
    assert second.status_code == 200
    assert second.json["assistant_message"]["content"] == "Your project is called ArcLM."
    prepared_second = json.dumps(fake.inputs[-1])
    assert "My project is called ArcLM" in prepared_second
    assert "Recorded." in prepared_second
    assert "What is my project called?" in prepared_second

    reopened_client, reopened_fake = make_client(monkeypatch, tmp_path)
    reopened = reopened_client.get(f"/api/chats/{chat['id']}").json["conversation"]
    assert [message["role"] for message in reopened["messages"]] == ["user", "assistant", "user", "assistant"]
    follow_up = reopened_client.post(f"/api/chats/{chat['id']}/messages", json={"content": "Repeat the answer."})
    assert follow_up.status_code == 200
    prepared_after_restart = json.dumps(reopened_fake.inputs[-1])
    assert "My project is called ArcLM" in prepared_after_restart
    assert "Your project is called ArcLM." in prepared_after_restart


def test_generation_run_lifecycle_timing_metrics_and_reveal_persistence(monkeypatch, tmp_path):
    client, _ = make_client(monkeypatch, tmp_path)
    chat = client.post("/api/chats", json={"model_source": "fake/model"}).json["conversation"]

    response = client.post(f"/api/chats/{chat['id']}/messages", json={"content": "Measure this response."})

    assert response.status_code == 200
    run = response.json["generation_run"]
    assert run["status"] == "completed"
    assert run["timestamps"]["request_received_at"]
    assert run["timestamps"]["preparation_started_at"]
    assert run["timestamps"]["preparation_completed_at"]
    assert run["timestamps"]["generation_started_at"]
    assert run["timestamps"]["generation_completed_at"]
    assert run["timestamps"]["response_saved_at"]
    assert run["durations_ms"]["preparation_duration_ms"] >= 0
    assert run["durations_ms"]["generation_duration_ms"] >= 0
    assert run["performance_metrics"]["true_streaming"] is False
    assert run["performance_metrics"]["time_to_first_token_ms"] is None
    assert run["token_metrics"]["generated_output_tokens"] >= 1
    assert run["token_metrics"]["input_token_count_type"] in {"exact", "estimated"}

    stored = client.get(f"/api/generation-runs/{run['id']}")
    assert stored.status_code == 200
    assert stored.json["generation_run"]["id"] == run["id"]
    revealed = client.post(
        f"/api/generation-runs/{run['id']}/reveal",
        json={"started_at": "2026-07-27T00:00:00+00:00", "completed_at": "2026-07-27T00:00:01+00:00"},
    )
    assert revealed.status_code == 200
    assert revealed.json["generation_run"]["durations_ms"]["reveal_duration_ms"] == 1000
    assert (tmp_path / "chat-store.sqlite3").exists()


def test_real_streaming_first_delta_before_completion_and_exact_final_equality(monkeypatch, tmp_path):
    fake = BlockingStreamingFakeModel()
    client, _ = make_client_with_model(monkeypatch, tmp_path, fake)
    chat = client.post("/api/chats", json={"model_source": "fake/stream"}).json["conversation"]

    response = client.post(f"/api/chats/{chat['id']}/messages", json={"content": "Stream this please.", "stream": True})

    assert response.status_code == 202
    run = response.json["generation_run"]
    assert fake.first_delta_emitted.wait(2)
    events = wait_for_stream_events(client, run["id"], "content_delta")
    deltas = [event for event in events if event["type"] == "content_delta"]
    assert deltas[0]["text"] == "Hello "
    assert not fake.completed.is_set()
    fake.allow_completion.set()
    completed = wait_for_stream_events(client, run["id"], "generation_completed")
    final = next(event for event in completed if event["type"] == "generation_completed")
    saved = wait_for_generation_request(client, run["id"], "completed")
    conversation = client.get(f"/api/chats/{chat['id']}").json["conversation"]
    assistant = next(message for message in conversation["messages"] if message["id"] == run["assistant_message_id"])
    streamed_text = "".join(event["text"] for event in completed if event["type"] == "content_delta")

    assert [event["sequence"] for event in completed if event["type"] == "content_delta"] == [1, 2]
    assert streamed_text == "Hello stream."
    assert final["final_text"] == streamed_text
    assert assistant["content"] == streamed_text
    assert saved["performance_metrics"]["true_streaming"] is True
    assert saved["performance_metrics"]["time_to_first_token_ms"] is not None


def test_mid_stream_cancellation_preserves_partial_and_stops_deltas(monkeypatch, tmp_path):
    fake = BlockingStreamingFakeModel()
    client, _ = make_client_with_model(monkeypatch, tmp_path, fake)
    chat = client.post("/api/chats", json={"model_source": "fake/stream"}).json["conversation"]
    response = client.post(f"/api/chats/{chat['id']}/messages", json={"content": "Cancel this stream.", "stream": True})
    run_id = response.json["generation_run"]["id"]

    assert fake.first_delta_emitted.wait(2)
    cancelled = client.post(f"/api/generation-runs/{run_id}/cancel")
    fake.allow_completion.set()
    events = wait_for_stream_events(client, run_id, "generation_cancelled")
    run = wait_for_generation_request(client, run_id, "cancelled")
    assistant = wait_for_message_status(client, chat["id"], response.json["assistant_message"]["id"], "cancelled")
    deltas = [event for event in events if event["type"] == "content_delta"]

    assert cancelled.status_code == 200
    assert [event["sequence"] for event in deltas] == [1]
    assert assistant["status"] == "cancelled"
    assert assistant["content"] == "Hello "
    assert run["status"] == "cancelled"


def test_streaming_preserves_unicode_arabic_markdown_and_code_blocks(monkeypatch, tmp_path):
    fake = BlockingStreamingFakeModel()
    client, _ = make_client_with_model(monkeypatch, tmp_path, fake)
    chat = client.post("/api/chats", json={"model_source": "fake/stream"}).json["conversation"]
    first = client.post(f"/api/chats/{chat['id']}/messages", json={"content": "My project is called ArcLM.", "stream": True})
    fake.first_delta_emitted.wait(2)
    fake.allow_completion.set()
    wait_for_generation_request(client, first.json["generation_run"]["id"], "completed")

    fake.first_delta_emitted.clear()
    fake.allow_completion.clear()
    follow = client.post(f"/api/chats/{chat['id']}/messages", json={"content": "What is my project called?", "stream": True})
    assert follow.status_code == 202
    assert fake.first_delta_emitted.wait(2)
    fake.allow_completion.set()
    events = wait_for_stream_events(client, follow.json["generation_run"]["id"], "generation_completed")
    streamed_text = "".join(event["text"] for event in events if event["type"] == "content_delta")

    assert "ArcLM" in streamed_text
    assert "مرحبا" in streamed_text
    assert "```json" in streamed_text
    assert '{"ok": true}' in streamed_text
    assert "\ufffd" not in streamed_text


def test_sequential_queue_resolves_context_when_request_begins(monkeypatch, tmp_path):
    fake = BlockingStreamingFakeModel()
    client, _ = make_client_with_model(monkeypatch, tmp_path, fake)
    chat = client.post("/api/chats", json={"model_source": "fake/stream"}).json["conversation"]

    first = client.post(f"/api/chats/{chat['id']}/messages", json={"content": "My project is called ArcLM.", "stream": True})
    assert first.status_code == 202
    assert fake.first_delta_emitted.wait(2)
    second = client.post(f"/api/chats/{chat['id']}/messages", json={"content": "What is my project called?", "stream": True})
    third = client.post(f"/api/chats/{chat['id']}/messages", json={"content": "Queue item three.", "stream": True})

    assert second.status_code == 202
    assert third.status_code == 202
    assert second.json["generation_request"]["queue_position"] == 1
    assert third.json["generation_request"]["queue_position"] == 2
    fake.allow_completion.set()
    wait_for_generation_request(client, first.json["generation_run"]["id"], "completed")
    wait_for_generation_request(client, second.json["generation_run"]["id"], "completed")
    wait_for_generation_request(client, third.json["generation_run"]["id"], "completed")

    second_prepared = json.dumps(fake.inputs[1], ensure_ascii=False)
    assert "My project is called ArcLM." in second_prepared
    assert "Prompt 1 response." in second_prepared
    assert "What is my project called?" in second_prepared
    requests = client.get(f"/api/chats/{chat['id']}/queue").json["requests"]
    assert [item["status"] for item in requests[:3]] == ["completed", "completed", "completed"]


def test_model_device_reporting_uses_parameters_not_cuda_availability(monkeypatch, tmp_path):
    client, _ = make_client_with_model(monkeypatch, tmp_path, AgentToolFakeModel())

    client.post("/api/models/load", json={"model_source": "fake/device", "device": "cuda:0", "dtype": "float16", "reload": True})
    wait_for_status(client, "ready")
    active = client.get("/api/models/active").json["active"]

    assert active["requested_device"] == "cuda:0"
    assert active["primary_device"] == "cuda:0"
    assert active["dtype"] == "float16"
    assert active["parameter_count"] == 123


def test_agent_mode_executes_safe_tool_and_persists_tool_call(monkeypatch, tmp_path):
    client, fake = make_client_with_model(monkeypatch, tmp_path, AgentToolFakeModel())
    chat = client.post("/api/chats", json={"model_source": "fake/agent"}).json["conversation"]

    response = client.post(f"/api/chats/{chat['id']}/messages", json={"content": "Which device is the model using?", "mode": "agent"})

    assert response.status_code == 200
    assistant = response.json["assistant_message"]
    assert assistant["content"] == "The inspected model is running on cuda:0."
    run = response.json["generation_run"]
    assert run["mode"] == "agent"
    assert run["tool_calls"][0]["tool_name"] == "inspect_model"
    assert run["tool_calls"][0]["status"] == "completed"
    stored = client.get(f"/api/generation-runs/{run['id']}").json["generation_run"]
    assert stored["tool_results"][0]["structured_safe_result"]["success"] is True
    assert "Which device is the model using?" in fake.inputs[0]


def test_agent_mode_tool_approval_requirement_denies_without_human_resume(monkeypatch, tmp_path):
    client, _ = make_client_with_model(monkeypatch, tmp_path, AgentToolFakeModel())
    client.patch("/api/settings", json={"privacy": {"require_tool_approvals": True}})
    chat = client.post("/api/chats", json={"model_source": "fake/agent"}).json["conversation"]

    response = client.post(f"/api/chats/{chat['id']}/messages", json={"content": "Which device is the model using?", "mode": "agent"})

    assert response.status_code == 500
    assert response.json["code"] == "tool_approval_denied"
    runs = client.get(f"/api/chats/{chat['id']}/generation-runs").json["generation_runs"]
    assert runs[-1]["tool_calls"][0]["status"] == "denied"
    assert runs[-1]["tool_calls"][0]["approval_required"] is True


def test_agent_mode_combines_prior_context_and_tool_result(monkeypatch, tmp_path):
    client, fake = make_client_with_model(monkeypatch, tmp_path, AgentToolFakeModel())
    chat = client.post("/api/chats", json={"model_source": "fake/agent"}).json["conversation"]
    first = client.post(f"/api/chats/{chat['id']}/messages", json={"content": "My dataset is called support-data.", "mode": "chat"})
    second = client.post(f"/api/chats/{chat['id']}/messages", json={"content": "Inspect the current model and tell me which dataset I named.", "mode": "agent"})

    assert first.status_code == 200
    assert second.status_code == 200
    assert second.json["assistant_message"]["content"] == "The model is on cuda:0, and your dataset is support-data."
    final_agent_prompt = fake.inputs[-1]
    assert "support-data" in final_agent_prompt
    assert "inspect_model" in final_agent_prompt


def test_template_validation_preview_and_invalid_template_rejection(monkeypatch, tmp_path):
    client, _ = make_client(monkeypatch, tmp_path)
    valid_template = {
        "schema_version": 1,
        "id": "human-model",
        "name": "Human Model",
        "roles": {"system": "instruction", "user": "human", "assistant": "model"},
        "input_mapping": {"user_role": "user", "user_input_field": "content"},
        "output": {"type": "formatted_text"},
        "template": "System: {{system}}\n{{history}}\nHuman: {{user_input}}\nAssistant:",
    }

    validation = client.post("/api/templates/validate", json=valid_template)
    preview = client.post("/api/templates/preview", json=valid_template)
    saved = client.post("/api/templates", json=valid_template)
    invalid = client.post(
        "/api/templates",
        json={**valid_template, "id": "bad", "template": "{{unknown}}\n{{user_input}}"},
    )
    malformed_json = client.post("/api/templates/validate", data="{bad", content_type="application/json")
    schema_error = client.post("/api/templates/validate", json={**valid_template, "schema_version": 2})
    unknown_role = client.post("/api/templates/validate", json={**valid_template, "roles": {**valid_template["roles"], "developer": "developer"}})
    bad_mode = client.post("/api/templates/validate", json={**valid_template, "output": {"type": "javascript"}})
    long_content = client.post("/api/templates/validate", json={**valid_template, "template": "{{user_input}}" + ("x" * 70000)})
    messages_preview = client.post("/api/templates/preview", json={**valid_template, "output": {"type": "messages"}})

    assert validation.status_code == 200
    assert validation.json["valid"] is True
    assert preview.status_code == 200
    assert "Human: Explain tokenization." in preview.json["preview"]
    assert saved.status_code == 200
    assert invalid.status_code == 400
    assert invalid.json["code"] == "template_invalid"
    assert malformed_json.status_code == 400
    assert malformed_json.json["code"] == "template_invalid_json"
    assert schema_error.json["valid"] is False
    assert schema_error.json["errors"][0]["code"] == "template_invalid"
    assert unknown_role.json["valid"] is False
    assert unknown_role.json["errors"][0]["code"] == "template_role_invalid"
    assert bad_mode.json["valid"] is False
    assert bad_mode.json["errors"][0]["code"] == "template_output_unsupported"
    assert long_content.status_code == 413
    assert messages_preview.status_code == 200
    assert isinstance(messages_preview.json["preview"], list)
    assert {"role", "content"}.issubset(messages_preview.json["preview"][0])


def test_model_operation_success_ready_events_and_refresh_status(monkeypatch, tmp_path):
    client, _ = make_client(monkeypatch, tmp_path)

    started = client.post("/api/models/load", json={"model_source": "fake/model", "reload": True})

    assert started.status_code == 202
    assert started.json["operation_id"].startswith("model_load_")
    ready = wait_for_status(client, "ready")
    assert ready["model_source"] == "fake/model"
    refreshed = client.get("/api/models/active").json["active"]
    assert refreshed["operation_status"]["state"] == "ready"
    events = client.get("/api/operations/events?limit=50").json["events"]
    stages = [event["stage"] for event in events if event["operation_id"] == started.json["operation_id"]]
    assert stages[:2] == ["queued", "validating_source"]
    assert "loading_configuration" in stages
    assert "loading_tokenizer" in stages
    assert "loading_weights" in stages
    assert "moving_to_device" in stages
    assert stages[-1] == "ready"


def test_model_operation_failure_error_and_redaction(monkeypatch, tmp_path):
    import arclm.simple_interface as simple_interface

    client, _ = make_client(monkeypatch, tmp_path)

    def fail_load(*args, **kwargs):
        raise RuntimeError(r"password=supersecret C:\Users\User\secret\model.bin")

    monkeypatch.setattr(simple_interface, "load_any_model", fail_load)
    started = client.post("/api/models/load", json={"model_source": r"C:\Users\User\secret\model.bin", "reload": True})

    assert started.status_code == 202
    status = wait_for_status(client, "error")
    assert status["error"]["code"] == "model_load_failed"
    events = client.get("/api/operations/events?limit=50").json["events"]
    rendered = json.dumps(events)
    assert "supersecret" not in rendered
    assert r"C:\Users" not in rendered
    assert r"\secret" not in rendered


def test_model_loading_cancellation_preserves_previous_model(monkeypatch, tmp_path):
    import arclm.simple_interface as simple_interface

    client, previous_model = make_client(monkeypatch, tmp_path)
    client.post("/api/models/load", json={"model_source": "fake/previous", "reload": True})
    wait_for_status(client, "ready")
    assert simple_interface._model is previous_model

    started_event = threading.Event()
    release_event = threading.Event()
    replacement = ContextAwareFakeModel()

    def blocking_load(*args, **kwargs):
        started_event.set()
        release_event.wait(1.0)
        return replacement

    monkeypatch.setattr(simple_interface, "load_any_model", blocking_load)
    started = client.post("/api/models/load", json={"model_source": "fake/replacement", "reload": True})
    assert started.status_code == 202
    assert started_event.wait(1.0)
    cancelled = client.post(f"/api/operations/{started.json['operation_id']}/cancel")
    assert cancelled.status_code == 200
    release_event.set()
    status = wait_for_status(client, "cancelled")
    assert status["cancel_requested"] is True
    assert simple_interface._model is previous_model
    events = client.get("/api/operations/events?limit=50").json["events"]
    assert "cancellation_requested" in [event["stage"] for event in events]


def test_operation_event_history_is_bounded_ordered_and_filters_debug(monkeypatch, tmp_path):
    client, _ = make_client(monkeypatch, tmp_path)
    hub = client.application.config["ARCLM_OPERATION_HUB"]
    operation_id = hub.create_operation("model_test", source=r"C:\Users\User\private\model.bin")
    for index in range(525):
        level = "debug" if index == 524 else "info"
        hub.emit(operation_id, category="model", level=level, stage=f"stage_{index:03d}", message=f"event {index}")

    public_events = client.get("/api/operations/events?limit=999").json["events"]
    debug_events = client.get("/api/operations/events?limit=999&debug=1").json["events"]

    assert len(debug_events) == 500
    assert [event["stage"] for event in debug_events[:3]] == ["stage_025", "stage_026", "stage_027"]
    assert debug_events[-1]["stage"] == "stage_524"
    assert all(event["level"] != "debug" for event in public_events)
    assert r"C:\Users\User\private" not in json.dumps(debug_events)


def test_simple_interface_frontend_contains_modelpill_terminal_and_token_reveal(monkeypatch, tmp_path):
    client, _ = make_client(monkeypatch, tmp_path)
    html = client.get("/").get_data(as_text=True)

    assert 'id="modelPill"' in html
    assert "Loading" in html
    assert 'id="openTerminalButton"' in html
    assert 'id="terminalDrawer"' in html
    assert 'role="log"' in html
    assert 'aria-live="polite"' in html
    assert 'id="showDebugEvents"' in html
    assert 'id="cancelOperationButton"' in html
    assert "EventSource(\"/api/operations/stream\")" in html
    assert "tokenRevealAnimation" in html
    assert "token-reveal" in html
    assert "connectGenerationStream" in html
    assert "@media (max-width: 880px)" in html


def test_context_budget_excludes_old_messages(monkeypatch, tmp_path):
    client, _ = make_client(monkeypatch, tmp_path)
    chat = client.post(
        "/api/chats",
        json={"context_settings": {"max_context_tokens": 40, "reserved_response_tokens": 8, "max_history_messages": 2, "strategy": "token_budget"}},
    ).json["conversation"]

    for index in range(4):
        response = client.post(f"/api/chats/{chat['id']}/messages", json={"content": f"Message {index} with extra context words"})
        assert response.status_code == 200

    report = client.get(f"/api/chats/{chat['id']}/context").json["context"]
    assert report["messages_excluded"]
    assert len(report["messages_included"]) <= 2


def test_memory_is_disabled_by_default(monkeypatch, tmp_path):
    client, _ = make_client(monkeypatch, tmp_path)

    response = client.post("/api/memories", json={"key": "preferred_language", "value": "Arabic"})

    assert response.status_code == 403
    assert response.json["code"] == "memory_disabled"


def test_privacy_setting_can_disable_conversation_persistence(monkeypatch, tmp_path):
    client, _ = make_client(monkeypatch, tmp_path)
    store_path = tmp_path / "chat-store.json"
    client.patch("/api/settings", json={"privacy": {"save_conversations": False}})
    chat = client.post("/api/chats", json={}).json["conversation"]
    client.post(f"/api/chats/{chat['id']}/messages", json={"content": "Do not persist this chat."})

    stored = json.loads(store_path.read_text(encoding="utf-8"))

    assert stored["conversations"] == {}


def test_chat_title_rename_delete_and_search(monkeypatch, tmp_path):
    client, _ = make_client(monkeypatch, tmp_path)
    chat = client.post("/api/chats", json={}).json["conversation"]
    client.post(f"/api/chats/{chat['id']}/messages", json={"content": "How can I fine-tune a local ArcLM model?"})

    updated = client.patch(f"/api/chats/{chat['id']}", json={"title": "Fine tuning notes"}).json["conversation"]
    search = client.get("/api/chats?q=fine+tuning").json["chats"]
    duplicate = client.post(f"/api/chats/{chat['id']}/duplicate").json["conversation"]
    deleted = client.delete(f"/api/chats/{chat['id']}")

    assert updated["title"] == "Fine tuning notes"
    assert search[0]["id"] == chat["id"]
    assert duplicate["id"] != chat["id"]
    assert deleted.status_code == 200
    assert client.get(f"/api/chats/{chat['id']}").status_code == 404
