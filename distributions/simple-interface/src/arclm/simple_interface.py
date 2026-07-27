"""Simple Flask web interface for ArcLM inference.

The module is intentionally importable from the package so users can run the
interface either from the CLI or from their own Python code.
"""

from __future__ import annotations

import json
import os
import queue
import re
import time
from collections import deque
from threading import Event, Lock, RLock, Thread

from flask import Flask, Response, jsonify, render_template, request, stream_with_context

from .inference import ModelSaveConfig, inspect_model_source, load_any_model
from .simple_chat import (
    ChatApiError,
    DEFAULT_SETTINGS,
    MAX_MESSAGE_CHARS,
    QUEUE_STATES,
    SimpleChatRequestBuilder,
    SimpleChatStore,
    SimpleChatModelAdapter,
    assistant_output_text,
    create_generation_run,
    estimate_tokens,
    performance_metrics,
    preview_template,
    response_durations,
    token_count_details,
    update_generation_run_state,
    validate_template,
)


DEFAULT_MODEL_SOURCE = (
    os.getenv("MODEL_SOURCE")
    or os.getenv("MODEL_PATH")
    or "Qwen/Qwen3-0.6B"
)
DEFAULT_MODEL_SAVE_PATH = (
    os.getenv("MODEL_SAVE_PATH")
    or os.getenv("SAVE_PATH")
    or "models/saved"
)

_model = None
_model_cache_key = None
_model_source = None
_model_options = {}
_model_lock = Lock()

MODEL_STATES = {"no_model", "queued", "loading", "ready", "generating", "unloading", "error", "cancelled"}
EVENT_LEVELS = {"debug", "info", "success", "warning", "error"}


def utc_now():
    """Return an ISO UTC timestamp for model operation events."""
    from datetime import datetime, timezone

    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def new_short_id():
    """Return a compact random ID suffix."""
    import uuid

    return uuid.uuid4().hex[:12]


def sanitize_text(value):
    """Redact secrets and avoid exposing private local paths in terminal events."""
    text = str(value or "")
    try:
        from arclm.security import redact_sensitive_text

        text = redact_sensitive_text(text)
    except Exception:
        text = re.sub(r"(?i)(api[_-]?key|password|authorization|bearer|token|secret)\s*[:=]\s*\S+", r"\1=[REDACTED]", text)
    text = re.sub(r"[A-Za-z]:\\(?:[^\\\s]+\\)+([^\\\s]+)", r"[local-path]\\\1", text)
    text = re.sub(r"/(?:Users|home|var|tmp|mnt|opt)/(?:[^\s/]+/)+([^\s/]+)", r"[local-path]/\1", text)
    return text[:1000]


def sanitize_mapping(mapping):
    """Sanitize a shallow mapping for browser-visible event details."""
    safe = {}
    for key, value in dict(mapping or {}).items():
        if any(secret in str(key).lower() for secret in ("key", "password", "authorization", "token", "secret")):
            safe[str(key)] = "[REDACTED]"
        elif isinstance(value, (str, int, float, bool)) or value is None:
            safe[str(key)] = sanitize_text(value) if isinstance(value, str) else value
        else:
            safe[str(key)] = sanitize_text(json.dumps(value, default=str))
    return safe


class OperationHub:
    """Backend-owned model operation status and bounded event transport."""

    def __init__(self, max_events=500, max_operations=50):
        self.max_events = max_events
        self.max_operations = max_operations
        self._lock = RLock()
        self._subscribers = []
        self._events = deque(maxlen=max_events)
        self._operations = {}
        self._model_status = {
            "state": "no_model",
            "operation_id": None,
            "model_source": DEFAULT_MODEL_SOURCE,
            "message": "No model is loaded.",
            "error": None,
            "updated_at": utc_now(),
            "can_cancel": False,
            "cancel_requested": False,
        }

    def status(self):
        with self._lock:
            return dict(self._model_status)

    def set_status(self, state, **values):
        if state not in MODEL_STATES:
            raise ValueError(f"Unknown model state: {state}")
        with self._lock:
            self._model_status.update(values)
            self._model_status["state"] = state
            self._model_status["updated_at"] = utc_now()
            return dict(self._model_status)

    def create_operation(self, category, source=None):
        operation_id = f"{category}_{new_short_id()}"
        operation = {
            "operation_id": operation_id,
            "category": category,
            "source": sanitize_text(source or ""),
            "created_at": utc_now(),
            "updated_at": utc_now(),
            "state": "queued",
            "cancel_requested": False,
            "cancel_event": Event(),
        }
        with self._lock:
            self._operations[operation_id] = operation
            self._prune_operations()
        return operation_id

    def operation(self, operation_id):
        with self._lock:
            return self._operations.get(operation_id)

    def request_cancel(self, operation_id):
        with self._lock:
            operation = self._operations.get(operation_id)
            if operation is None:
                return False
            operation["cancel_requested"] = True
            operation["cancel_event"].set()
            operation["updated_at"] = utc_now()
        self.emit(
            operation_id,
            category=operation["category"],
            level="warning",
            stage="cancellation_requested",
            message="Cancellation was requested for this operation.",
        )
        return True

    def is_cancelled(self, operation_id):
        with self._lock:
            operation = self._operations.get(operation_id)
            return bool(operation and operation.get("cancel_requested"))

    def complete_operation(self, operation_id, state):
        with self._lock:
            operation = self._operations.get(operation_id)
            if operation:
                operation["state"] = state
                operation["updated_at"] = utc_now()

    def emit(self, operation_id, *, category, level, stage, message, progress=None, details=None):
        if level not in EVENT_LEVELS:
            level = "info"
        event = {
            "event_id": f"event_{new_short_id()}",
            "operation_id": operation_id,
            "timestamp": utc_now(),
            "category": str(category),
            "level": level,
            "stage": str(stage),
            "message": sanitize_text(message),
            "progress": progress if progress else None,
            "details": sanitize_mapping(details or {}),
        }
        with self._lock:
            self._events.append(event)
            subscribers = list(self._subscribers)
        for subscriber in subscribers:
            try:
                subscriber.put_nowait(event)
            except Exception:
                pass
        return event

    def events_after(self, after_event_id=None, limit=200, include_debug=False):
        with self._lock:
            events = list(self._events)
        if after_event_id:
            for index, event in enumerate(events):
                if event["event_id"] == after_event_id:
                    events = events[index + 1 :]
                    break
        if not include_debug:
            events = [event for event in events if event.get("level") != "debug"]
        return events[-max(1, min(int(limit or 200), self.max_events)) :]

    def subscribe(self):
        subscriber = queue.Queue(maxsize=100)
        with self._lock:
            self._subscribers.append(subscriber)
        return subscriber

    def unsubscribe(self, subscriber):
        with self._lock:
            if subscriber in self._subscribers:
                self._subscribers.remove(subscriber)

    def reset(self):
        """Reset test-local operation state without touching the loaded model."""
        with self._lock:
            self._events.clear()
            self._operations.clear()
            self._model_status = {
                "state": "no_model",
                "operation_id": None,
                "model_source": DEFAULT_MODEL_SOURCE,
                "message": "No model is loaded.",
                "error": None,
                "updated_at": utc_now(),
                "can_cancel": False,
                "cancel_requested": False,
            }

    def _prune_operations(self):
        if len(self._operations) <= self.max_operations:
            return
        completed = [
            (operation.get("updated_at", ""), operation_id)
            for operation_id, operation in self._operations.items()
            if operation.get("state") in {"ready", "error", "cancelled", "no_model"}
        ]
        completed.sort()
        for _, operation_id in completed[: max(0, len(self._operations) - self.max_operations)]:
            self._operations.pop(operation_id, None)


_operation_hub = OperationHub()


class GenerationStreamHub:
    """Bounded generation-delta transport for real model-output streaming."""

    def __init__(self, max_events_per_generation=1000, max_generations=100):
        self.max_events_per_generation = max_events_per_generation
        self.max_generations = max_generations
        self._lock = RLock()
        self._subscribers = {}
        self._events = {}
        self._next_sequence = {}

    def emit(self, generation_id, event_type, **values):
        with self._lock:
            sequence = self._next_sequence.get(generation_id, 0)
            if event_type == "content_delta":
                sequence += 1
                self._next_sequence[generation_id] = sequence
            event = {
                "type": event_type,
                "generation_id": generation_id,
                "operation_id": values.pop("operation_id", generation_id),
                "sequence": sequence,
                "timestamp": utc_now(),
                **values,
            }
            events = self._events.setdefault(generation_id, deque(maxlen=self.max_events_per_generation))
            events.append(event)
            subscribers = list(self._subscribers.get(generation_id, []))
            self._prune_locked()
        for subscriber in subscribers:
            try:
                subscriber.put_nowait(event)
            except Exception:
                pass
        return event

    def events_after(self, generation_id, after_sequence=None, limit=500):
        with self._lock:
            events = list(self._events.get(generation_id, []))
        if after_sequence is not None:
            try:
                after = int(after_sequence)
                events = [event for event in events if int(event.get("sequence") or 0) > after or event.get("type") != "content_delta"]
            except (TypeError, ValueError):
                pass
        return events[-max(1, min(int(limit or 500), self.max_events_per_generation)) :]

    def subscribe(self, generation_id):
        subscriber = queue.Queue(maxsize=200)
        with self._lock:
            self._subscribers.setdefault(generation_id, []).append(subscriber)
        return subscriber

    def unsubscribe(self, generation_id, subscriber):
        with self._lock:
            subscribers = self._subscribers.get(generation_id, [])
            if subscriber in subscribers:
                subscribers.remove(subscriber)

    def reset(self):
        with self._lock:
            self._subscribers.clear()
            self._events.clear()
            self._next_sequence.clear()

    def _prune_locked(self):
        if len(self._events) <= self.max_generations:
            return
        for generation_id in list(self._events.keys())[: len(self._events) - self.max_generations]:
            if self._subscribers.get(generation_id):
                continue
            self._events.pop(generation_id, None)
            self._next_sequence.pop(generation_id, None)


_stream_hub = GenerationStreamHub()


class PromptQueueWorker:
    """Single local worker that serializes generation against the loaded model."""

    terminal_states = {"completed", "failed", "cancelled", "removed", "interrupted"}

    def __init__(self, store, builder, operation_hub, stream_hub):
        self.store = store
        self.builder = builder
        self.operation_hub = operation_hub
        self.stream_hub = stream_hub
        self.tools_provider = None
        self.trace_handler_factory = None
        self._stop = Event()
        self._wake = Event()
        self._thread = None

    def start(self):
        if self._thread and self._thread.is_alive():
            return
        self.store.database.initialize()
        self.store.database.mark_active_requests_interrupted()
        self._thread = Thread(target=self._loop, name="arclm-simple-generation-worker", daemon=True)
        self._thread.start()

    def stop(self, timeout=2.0):
        self._stop.set()
        self._wake.set()
        if self._thread and self._thread.is_alive():
            self._thread.join(timeout=timeout)

    def wake(self):
        self._wake.set()

    def configure_agent_hooks(self, tools_provider=None, trace_handler_factory=None):
        self.tools_provider = tools_provider
        self.trace_handler_factory = trace_handler_factory

    def _loop(self):
        while not self._stop.is_set():
            request_item = self.store.database.claim_next_generation_request()
            if request_item is None:
                self._wake.wait(0.2)
                self._wake.clear()
                continue
            self._execute(request_item)

    def _set_request_status(self, item, status, **values):
        if status not in QUEUE_STATES:
            status = "failed"
        item["status"] = status
        item["updated_at"] = utc_now()
        item.update({key: value for key, value in values.items() if value is not None})
        self.store.database.upsert_generation_request(item)
        return item

    def _emit(self, item, level, stage, message, **details):
        self.operation_hub.emit(
            item.get("operation_id") or item.get("id"),
            category="queue" if stage.startswith("queue") or stage in {"request_queued", "request_started", "request_saved"} else "response",
            level=level,
            stage=stage,
            message=message,
            details={"request_id": item.get("id"), "generation_id": item.get("generation_run_id"), **details},
        )

    def _execute(self, item):
        operation_id = item.get("operation_id") or item.get("id")
        generation_id = item.get("generation_run_id") or operation_id
        assistant_message = None
        run = None
        text = ""
        agent_metadata = {}
        try:
            if self.operation_hub.is_cancelled(operation_id):
                raise ChatApiError("generation_cancelled", "Generation was cancelled.", status_code=499)
            self._set_request_status(item, "preparing")
            self._emit(item, "info", "request_started", "Queued request started.")
            self.operation_hub.set_status(
                "generating",
                operation_id=operation_id,
                model_source=item.get("model_id"),
                message="Generating response.",
                can_cancel=True,
                cancel_requested=False,
                error=None,
            )
            self.stream_hub.emit(
                generation_id,
                "request_preparing",
                operation_id=operation_id,
                conversation_id=item["conversation_id"],
                message_id=item.get("assistant_message_id"),
            )
            model = get_model(source=item.get("model_id") or DEFAULT_MODEL_SOURCE, load_options=(item.get("load_options") or {}))
            model_info = public_model_info_for_model(model)
            adapter = SimpleChatModelAdapter(model)
            capabilities = adapter.get_capabilities()
            conversation = self.store.get_chat(item["conversation_id"])
            template = self.store.get_template(item.get("chat_template_id") or conversation.get("chat_template_id") or self.store.get_settings().get("active_template_id") or "basic-chat")
            settings = item.get("settings_snapshot") or self.store.get_settings()
            generation_settings = item.get("generation_settings") or {}
            run = create_generation_run(item["conversation_id"], mode=item.get("mode") or "chat", operation_id=operation_id, model_info=model_info)
            run["id"] = generation_id
            run["user_message_id"] = item.get("user_message_id")
            run["assistant_message_id"] = item.get("assistant_message_id")
            run["streaming_mode"] = capabilities.get("streaming_mode") or "non_streaming"
            update_generation_run_state(run, "preparing", timestamp_field="preparation_started_at")
            self.store.database.upsert_generation_run(run)
            context = self.builder.context_manager.build_context(
                conversation,
                capabilities,
                template,
                settings,
                memories=self.store.list_memories(),
                tokenizer=adapter.tokenizer,
            )
            update_generation_run_state(
                run,
                "preparing",
                timestamp_field="preparation_completed_at",
                chat_template_id=template.get("id"),
                chat_template_version=template.get("schema_version"),
                canonical_input_messages=context.get("prompt_messages"),
                rendered_model_input=context["prepared_input"] if settings.get("privacy", {}).get("save_exact_rendered_input") else None,
                generation_settings=dict(generation_settings),
                actual_device=model_info.get("primary_device") or model_info.get("device"),
                dtype=model_info.get("dtype"),
                token_metrics=context["report"].get("token_metrics"),
                context_report=context["report"],
            )
            self.store.database.upsert_generation_run(run)
            self.stream_hub.emit(generation_id, "context_ready", operation_id=operation_id, conversation_id=item["conversation_id"], message_id=item.get("assistant_message_id"))
            self._emit(item, "info", "context_ready", "Context prepared for queued request.")
            if self.operation_hub.is_cancelled(operation_id):
                raise ChatApiError("generation_cancelled", "Generation was cancelled.", status_code=499)
            self._set_request_status(item, "streaming" if capabilities.get("streaming") else "generating")
            self.store.update_message(item["conversation_id"], item["assistant_message_id"], status="streaming" if capabilities.get("streaming") else "thinking", model=model_info)
            update_generation_run_state(run, "streaming" if capabilities.get("streaming") else "generating", timestamp_field="generation_started_at")
            self.store.database.upsert_generation_run(run)
            self.stream_hub.emit(generation_id, "generation_started", operation_id=operation_id, conversation_id=item["conversation_id"], message_id=item.get("assistant_message_id"), streaming_mode=run["streaming_mode"])
            self._emit(item, "info", "generation_started", "Model generation started.", streaming_mode=run["streaming_mode"])
            if str(item.get("mode") or "chat").lower() == "agent":
                self._set_request_status(item, "running_tool")
                update_generation_run_state(run, "running_tool", timestamp_field="tool_execution_started_at")
                self.store.database.upsert_generation_run(run)
                self.stream_hub.emit(generation_id, "tool_running", operation_id=operation_id, conversation_id=item["conversation_id"], message_id=item.get("assistant_message_id"))
                tools = self.tools_provider(item["conversation_id"]) if callable(self.tools_provider) else []
                trace = self.trace_handler_factory(operation_id) if callable(self.trace_handler_factory) else None
                text, agent_metadata = self.builder._run_agent(
                    adapter=adapter,
                    context=context,
                    content=(self.store.get_message(item["conversation_id"], item["user_message_id"]).get("content") or ""),
                    settings=settings,
                    generation_settings=generation_settings,
                    tools=list(tools or []),
                    trace_handler=trace,
                    run=run,
                )
                update_generation_run_state(run, "running_tool", timestamp_field="tool_execution_completed_at")
                run["tool_calls"] = agent_metadata.get("tool_calls", [])
                run["tool_results"] = agent_metadata.get("tool_results", [])
                run["streaming_mode"] = "non_streaming"
                self.stream_hub.emit(generation_id, "tool_completed", operation_id=operation_id, conversation_id=item["conversation_id"], message_id=item.get("assistant_message_id"))
            elif capabilities.get("streaming"):
                for delta in adapter.stream_generate(context["prepared_input"], generation_settings, cancel_check=lambda: self.operation_hub.is_cancelled(operation_id)):
                    if self.operation_hub.is_cancelled(operation_id):
                        break
                    chunk = str(delta.get("text") if isinstance(delta, dict) else delta)
                    if not chunk:
                        continue
                    if not run["timestamps"].get("first_token_emitted_at"):
                        update_generation_run_state(run, "streaming", timestamp_field="first_token_emitted_at")
                        self.store.database.upsert_generation_run(run)
                        self.operation_hub.emit(operation_id, category="response", level="success", stage="first_token_emitted", message="First streamed delta emitted.")
                    text += chunk
                    token_id = delta.get("token_id") if isinstance(delta, dict) else None
                    self.stream_hub.emit(
                        generation_id,
                        "content_delta",
                        operation_id=operation_id,
                        conversation_id=item["conversation_id"],
                        message_id=item.get("assistant_message_id"),
                        text=chunk,
                        token_id=token_id,
                    )
                if self.operation_hub.is_cancelled(operation_id):
                    raise ChatApiError("generation_cancelled", "Generation was cancelled.", status_code=499)
            else:
                self.stream_hub.emit(generation_id, "streaming_unavailable", operation_id=operation_id, conversation_id=item["conversation_id"], message_id=item.get("assistant_message_id"), streaming_mode="non_streaming")
                output = adapter.generate(context["prepared_input"], generation_settings)
                text = assistant_output_text(output, context["prepared_input"])
            output_token = token_count_details(text, adapter.tokenizer)
            token_metrics = dict(context["report"].get("token_metrics") or {})
            token_metrics.update(
                {
                    "generated_output_tokens": output_token["count"],
                    "output_token_count_type": output_token["type"],
                    "total_tokens": int(token_metrics.get("total_input_tokens") or 0) + output_token["count"],
                }
            )
            update_generation_run_state(run, "generating", timestamp_field="generation_completed_at", token_metrics=token_metrics)
            run["performance_metrics"] = performance_metrics(run)
            self.store.database.upsert_generation_run(run)
            self._set_request_status(item, "saving")
            update_generation_run_state(run, "saving", timestamp_field="response_saved_at")
            run["performance_metrics"] = performance_metrics(run)
            assistant_message = self.store.update_message(
                item["conversation_id"],
                item["assistant_message_id"],
                content=text,
                status="complete",
                token_count=output_token["count"],
                model=model_info,
                generation_metadata={
                    "generation_run_id": run["id"],
                    "response_lifecycle": dict(run),
                    "response_metrics": dict(run.get("performance_metrics") or {}),
                    "token_metrics": dict(token_metrics),
                    "agent": dict(agent_metadata or {}),
                    "settings": dict(generation_settings),
                    "context_report": context["report"],
                },
                metadata={"include_in_context": True},
            )
            run["assistant_message_id"] = assistant_message["id"]
            update_generation_run_state(run, "completed")
            run["performance_metrics"] = performance_metrics(run)
            self.store.database.upsert_generation_run(run)
            self._set_request_status(item, "completed", completed_at=utc_now())
            self.stream_hub.emit(
                generation_id,
                "generation_completed",
                operation_id=operation_id,
                conversation_id=item["conversation_id"],
                message_id=assistant_message["id"],
                finish_reason="stop",
                final_text=text,
                input_tokens=token_metrics.get("total_input_tokens"),
                output_tokens=output_token["count"],
                generation_duration_ms=run.get("durations_ms", {}).get("generation_duration_ms"),
                tokens_per_second=run.get("performance_metrics", {}).get("tokens_per_second"),
            )
            self._emit(item, "success", "generation_completed", "Generation completed.")
            self.operation_hub.complete_operation(operation_id, "ready")
        except Exception as exc:
            cancelled = getattr(exc, "code", None) == "generation_cancelled" or self.operation_hub.is_cancelled(operation_id)
            status = "cancelled" if cancelled else "failed"
            safe_code = getattr(exc, "code", None) or "generation_failed"
            if run is not None:
                if run.get("timestamps", {}).get("generation_started_at") and not run.get("timestamps", {}).get("generation_completed_at"):
                    update_generation_run_state(run, status, timestamp_field="generation_completed_at")
                update_generation_run_state(run, status)
                run["performance_metrics"] = performance_metrics(run)
                self.store.database.upsert_generation_run(run)
            try:
                metadata = {"include_in_context": False}
                privacy = (item.get("settings_snapshot") or {}).get("privacy") or {}
                content = text if cancelled and privacy.get("save_streamed_partial_responses", True) else ""
                self.store.update_message(
                    item["conversation_id"],
                    item["assistant_message_id"],
                    content=content,
                    status="cancelled" if cancelled else "error",
                    model=public_model_info_for_model(_model),
                    error=None if cancelled else {"code": safe_code, "message": sanitize_text(str(exc))},
                    metadata=metadata,
                    generation_metadata={"generation_run_id": generation_id, "response_lifecycle": dict(run or {})},
                )
            except Exception:
                pass
            self._set_request_status(item, status, completed_at=utc_now(), cancelled_at=utc_now() if cancelled else None, safe_error_code=safe_code)
            self.stream_hub.emit(
                generation_id,
                "generation_cancelled" if cancelled else "generation_failed",
                operation_id=operation_id,
                conversation_id=item.get("conversation_id"),
                message_id=item.get("assistant_message_id"),
                text=text if cancelled else "",
                error_code=safe_code,
            )
            self._emit(item, "warning" if cancelled else "error", "generation_cancelled" if cancelled else "generation_failed", "Generation cancelled." if cancelled else sanitize_text(str(exc)))
            self.operation_hub.complete_operation(operation_id, status)
        finally:
            if _model is not None:
                self.operation_hub.set_status(
                    "ready",
                    operation_id=operation_id,
                    model_source=current_model_info().get("model_source"),
                    message="Model is ready.",
                    can_cancel=False,
                    cancel_requested=False,
                    error=None,
                )


def public_model_info_for_model(model):
    info = current_model_info()
    if model is not None:
        info["capabilities"] = SimpleChatModelAdapter(model).get_capabilities()
    return info


def normalize_model_source(source):
    """Voert `normalize model source` uit."""
    text = str(source or "").strip()
    lowered = text.lower()
    for prefix in ("hf://", "huggingface://"):
        if lowered.startswith(prefix):
            return text[len(prefix) :].strip("/")
    return text


def env_bool(name, default=False):
    """Voert `env bool` uit."""
    value = os.getenv(name)
    if value is None:
        return default
    return str(value).strip().lower() in {"1", "true", "yes", "on"}


def default_load_options():
    """Voert `default load options` uit."""
    options = {
        "base_model": os.getenv("BASE_MODEL"),
        "tokenizer_path": os.getenv("TOKENIZER_PATH"),
        "device": os.getenv("MODEL_DEVICE") or os.getenv("DEVICE"),
        "device_map": os.getenv("MODEL_DEVICE_MAP"),
        "dtype": os.getenv("MODEL_DTYPE", "auto"),
        "trust_remote_code": env_bool("TRUST_REMOTE_CODE", False),
        "load_in_8bit": env_bool("LOAD_IN_8BIT", False),
        "load_in_4bit": env_bool("LOAD_IN_4BIT", False),
        "default_system_prompt": os.getenv("DEFAULT_SYSTEM_PROMPT"),
        "enable_thinking": env_bool("ENABLE_THINKING", False),
    }
    return {key: value for key, value in options.items() if value not in (None, "")}


def request_load_options(data):
    """Voert `request load options` uit."""
    data = data or {}
    options = {}
    keys = (
        "base_model",
        "tokenizer_path",
        "device",
        "device_map",
        "dtype",
        "default_system_prompt",
    )
    for key in keys:
        value = data.get(key)
        if value not in (None, ""):
            options[key] = value

    for key in ("trust_remote_code", "load_in_8bit", "load_in_4bit", "enable_thinking"):
        if key in data:
            options[key] = bool(data.get(key))

    return options


def request_save_config(data):
    """Voert `request save config` uit."""
    data = data or {}
    save_options = {}
    for key in ("save_mode", "save_layout"):
        value = data.get(key)
        if value not in (None, ""):
            save_options[key] = value

    for key in (
        "overwrite",
        "save_tokenizer",
        "save_model_config",
        "save_generation_config",
        "save_training_metadata",
        "save_processor",
        "save_readme",
        "save_safetensors",
        "merge_lora",
    ):
        if key in data:
            save_options[key] = bool(data.get(key))

    return ModelSaveConfig(**save_options)


def active_source_from_payload(data):
    """Voert `active source from payload` uit."""
    return (
        (data or {}).get("model_source")
        or (data or {}).get("model_path")
        or (data or {}).get("source")
        or _model_source
        or DEFAULT_MODEL_SOURCE
    )


def cache_key_for(source, options):
    """Voert `cache key for` uit."""
    return (
        normalize_model_source(source),
        json.dumps(options, sort_keys=True, default=str),
    )


def get_model(source=None, load_options=None, force_reload=False, operation_id=None):
    """Voert `get model` uit."""
    global _model, _model_cache_key, _model_source, _model_options

    model_source = normalize_model_source(source or _model_source or DEFAULT_MODEL_SOURCE)
    merged_options = default_load_options()
    merged_options.update(load_options or {})
    key = cache_key_for(model_source, merged_options)

    with _model_lock:
        if force_reload or _model is None or _model_cache_key != key:
            if operation_id and _operation_hub.is_cancelled(operation_id):
                raise RuntimeError("Model loading was cancelled before it started.")
            if operation_id:
                _operation_hub.set_status(
                    "loading",
                    operation_id=operation_id,
                    model_source=sanitize_text(model_source),
                    message="Loading model.",
                    can_cancel=True,
                    cancel_requested=False,
                    error=None,
                )
                _operation_hub.emit(operation_id, category="model", level="info", stage="validating_source", message="Validating model source.")
                _operation_hub.emit(operation_id, category="model", level="info", stage="loading_configuration", message="Loading model configuration.")
                if merged_options.get("tokenizer_path"):
                    _operation_hub.emit(operation_id, category="model", level="info", stage="loading_tokenizer", message="Loading tokenizer from configured tokenizer source.")
                else:
                    _operation_hub.emit(operation_id, category="model", level="info", stage="loading_tokenizer", message="Loading tokenizer when the model source provides one.")
                device_label = merged_options.get("device") or merged_options.get("device_map") or "auto"
                dtype_label = merged_options.get("dtype") or "auto"
                _operation_hub.emit(operation_id, category="model", level="info", stage="selecting_device", message=f"Selecting device: {device_label}.")
                _operation_hub.emit(operation_id, category="model", level="info", stage="selecting_precision", message=f"Selecting precision: {dtype_label}.")
                _operation_hub.emit(operation_id, category="model", level="info", stage="loading_weights", message="Loading model weight files.")
            print(f"Loading model: {model_source}")
            if merged_options:
                print(f"Load options: {merged_options}")
            loaded = load_any_model(model_source, **merged_options)
            if operation_id and _operation_hub.is_cancelled(operation_id):
                _operation_hub.emit(operation_id, category="model", level="warning", stage="cancelled_after_load", message="Cancellation was requested after the non-interruptible load stage completed. Keeping the previous model when possible.")
                raise RuntimeError("Model loading was cancelled.")
            if operation_id:
                _operation_hub.emit(operation_id, category="model", level="info", stage="moving_to_device", message="Moving model to the selected device when the adapter requires it.")
                _operation_hub.emit(operation_id, category="model", level="info", stage="validating_model", message="Validating loaded model interface.")
            _model = loaded
            _model_cache_key = key
            _model_source = model_source
            _model_options = merged_options
            print("Model loaded.")
            if operation_id:
                _operation_hub.emit(operation_id, category="model", level="success", stage="ready", message="Model loaded and ready.")
                _operation_hub.set_status(
                    "ready",
                    operation_id=operation_id,
                    model_source=sanitize_text(model_source),
                    message="Model is ready.",
                    can_cancel=False,
                    cancel_requested=False,
                    error=None,
                )
                _operation_hub.complete_operation(operation_id, "ready")

    return _model


def start_model_load_operation(source, load_options=None, force_reload=False):
    """Start a background model load and return the operation ID."""
    operation_id = _operation_hub.create_operation("model_load", source=source)
    model_source = normalize_model_source(source or DEFAULT_MODEL_SOURCE)
    _operation_hub.set_status(
        "loading",
        operation_id=operation_id,
        model_source=sanitize_text(model_source),
        message="Model load queued.",
        can_cancel=True,
        cancel_requested=False,
        error=None,
    )
    _operation_hub.emit(operation_id, category="model", level="info", stage="queued", message="Model load request accepted.")

    def worker():
        try:
            if _operation_hub.is_cancelled(operation_id):
                _operation_hub.set_status(
                    "cancelled",
                    operation_id=operation_id,
                    model_source=sanitize_text(model_source),
                    message="Model load was cancelled before loading began.",
                    can_cancel=False,
                    cancel_requested=True,
                    error=None,
                )
                _operation_hub.complete_operation(operation_id, "cancelled")
                return
            get_model(source=model_source, load_options=load_options, force_reload=force_reload, operation_id=operation_id)
        except Exception as exc:
            if _operation_hub.is_cancelled(operation_id):
                _operation_hub.emit(operation_id, category="model", level="warning", stage="cancelled", message="Model load cancelled.")
                _operation_hub.set_status(
                    "cancelled",
                    operation_id=operation_id,
                    model_source=sanitize_text(model_source),
                    message="Model load cancelled.",
                    can_cancel=False,
                    cancel_requested=True,
                    error=None,
                )
                _operation_hub.complete_operation(operation_id, "cancelled")
                return
            message = sanitize_text(str(exc))
            _operation_hub.emit(operation_id, category="model", level="error", stage="load_failed", message=message)
            _operation_hub.set_status(
                "error",
                operation_id=operation_id,
                model_source=sanitize_text(model_source),
                message="Model loading failed.",
                can_cancel=False,
                cancel_requested=False,
                error={"code": "model_load_failed", "message": message},
            )
            _operation_hub.complete_operation(operation_id, "error")

    Thread(target=worker, name=f"arclm-model-load-{operation_id}", daemon=True).start()
    return operation_id


def current_model_info():
    """Voert `current model info` uit."""
    source_info = getattr(_model, "source_info", None)
    runtime = inspect_model_runtime(_model, _model_options)
    return {
        "loaded": _model is not None,
        "model_source": _model_source or normalize_model_source(DEFAULT_MODEL_SOURCE),
        "operation_status": _operation_hub.status(),
        "default_save_path": DEFAULT_MODEL_SAVE_PATH,
        "load_options": _model_options or default_load_options(),
        "device": str(getattr(_model, "device", "")) if _model is not None else None,
        **runtime,
        "source_info": source_info.to_dict() if source_info is not None else None,
    }


def inspect_model_runtime(model, options=None):
    """Inspect actual loaded-model device and dtype without guessing from CUDA availability."""
    if model is None:
        return {
            "requested_device": (options or {}).get("device"),
            "resolved_devices": [],
            "primary_device": None,
            "is_sharded": False,
            "gpu_name": None,
            "dtype": None,
            "quantization": _quantization_label(options or {}),
            "pytorch_memory": None,
            "parameter_count": None,
        }
    owners = [model, getattr(model, "model", None), getattr(model, "_native_loaded", None), getattr(getattr(model, "_native_loaded", None), "model", None)]
    devices = []
    dtypes = []
    parameter_count = 0
    for owner in [item for item in owners if item is not None]:
        for method_name in ("parameters", "buffers"):
            method = getattr(owner, method_name, None)
            if not callable(method):
                continue
            try:
                for tensor in method():
                    device = getattr(tensor, "device", None)
                    dtype = getattr(tensor, "dtype", None)
                    if device is not None:
                        devices.append(str(device))
                    if dtype is not None:
                        dtypes.append(str(dtype).replace("torch.", ""))
                    if method_name == "parameters" and hasattr(tensor, "numel"):
                        try:
                            parameter_count += int(tensor.numel())
                        except Exception:
                            pass
            except Exception:
                continue
    if not devices and getattr(model, "device", None) is not None:
        devices.append(str(getattr(model, "device")))
    if not dtypes and getattr(model, "dtype", None) is not None:
        dtypes.append(str(getattr(model, "dtype")).replace("torch.", ""))
    resolved = sorted(set(devices))
    primary = resolved[0] if resolved else None
    memory = None
    gpu_name = None
    if primary and primary.startswith("cuda"):
        try:
            import torch

            index = int(primary.split(":", 1)[1]) if ":" in primary and primary.split(":", 1)[1].isdigit() else 0
            gpu_name = torch.cuda.get_device_name(index)
            memory = {
                "allocated_bytes": int(torch.cuda.memory_allocated(index)),
                "reserved_bytes": int(torch.cuda.memory_reserved(index)),
            }
        except Exception:
            memory = None
    return {
        "requested_device": (options or {}).get("device") or (options or {}).get("device_map"),
        "resolved_devices": resolved,
        "primary_device": primary,
        "is_sharded": len(resolved) > 1 or bool((options or {}).get("device_map")),
        "gpu_name": sanitize_text(gpu_name) if gpu_name else None,
        "dtype": sorted(set(dtypes))[0] if dtypes else None,
        "quantization": _quantization_label(options or {}),
        "pytorch_memory": memory,
        "parameter_count": parameter_count or None,
    }


def _quantization_label(options):
    if (options or {}).get("load_in_4bit"):
        return "4-bit"
    if (options or {}).get("load_in_8bit"):
        return "8-bit"
    return None


def bounded_int(value, default, minimum, maximum):
    """Voert `bounded int` uit."""
    try:
        value = int(value)
    except (TypeError, ValueError):
        value = default

    return max(minimum, min(value, maximum))


def bounded_float(value, default, minimum, maximum):
    """Voert `bounded float` uit."""
    try:
        value = float(value)
    except (TypeError, ValueError):
        value = default

    return max(minimum, min(value, maximum))


def generation_options(data, default_max_tokens):
    """Voert `generation options` uit."""
    data = data or {}
    options = {
        "max_new_tokens": bounded_int(
            data.get("max_new_tokens", data.get("max_tokens")),
            default_max_tokens,
            1,
            4096,
        ),
        "temperature": bounded_float(data.get("temperature"), 0.8, 0.0, 2.0),
        "top_p": bounded_float(data.get("top_p"), 0.9, 0.05, 1.0),
        "repetition_penalty": bounded_float(
            data.get("repetition_penalty"),
            1.1,
            1.0,
            3.0,
        ),
    }
    top_k = data.get("top_k")
    if top_k not in (None, ""):
        options["top_k"] = bounded_int(top_k, 50, 1, 10000)
    if "do_sample" in data:
        options["do_sample"] = bool(data.get("do_sample"))
    if "return_full_text" in data:
        options["return_full_text"] = bool(data.get("return_full_text"))
    if data.get("stop"):
        stop = data["stop"]
        options["stop"] = stop if isinstance(stop, list) else [str(stop)]
    return options


def generated_part(prompt, text):
    """Voert `generated part` uit."""
    text = str(text or "")
    if text.startswith(prompt):
        return text[len(prompt) :]
    if text.lower().startswith(prompt.lower()):
        return text[len(prompt) :]
    return text


def create_simple_interface_app(storage_path=None):
    """Create the Flask application for ArcLM's simple inference interface."""

    app = Flask(__name__)
    chat_store = SimpleChatStore(storage_path)
    chat_builder = SimpleChatRequestBuilder(chat_store)
    queue_worker = PromptQueueWorker(chat_store, chat_builder, _operation_hub, _stream_hub)
    queue_worker.start()
    app.config["ARCLM_SIMPLE_CHAT_STORE"] = chat_store
    app.config["ARCLM_OPERATION_HUB"] = _operation_hub
    app.config["ARCLM_STREAM_HUB"] = _stream_hub
    app.config["ARCLM_QUEUE_WORKER"] = queue_worker

    def error_response(exc, status=500, code=None):
        """Voert `error response` uit."""
        if isinstance(exc, ChatApiError):
            payload = {
                "success": False,
                "error": exc.message,
                "code": exc.code,
            }
            if exc.details:
                payload["details"] = exc.details
            return jsonify(payload), exc.status_code
        return jsonify({
            "success": False,
            "error": str(exc),
            "code": code or "request_failed",
        }), status

    def api_response(payload=None, **values):
        """Return a consistent successful JSON response."""
        data = {"success": True}
        if payload:
            data.update(payload)
        data.update(values)
        return jsonify(data)

    def json_payload():
        """Read JSON and reject malformed request bodies explicitly."""
        payload = request.get_json(silent=True)
        if payload is None and request.get_data(cache=True):
            raise ChatApiError("template_invalid_json", "Invalid JSON request body.", status_code=400)
        return payload or {}

    def active_model_or_load(data=None):
        """Load or reuse the model for chat/generation routes."""
        return get_model(
            source=active_source_from_payload(data or {}),
            load_options=request_load_options(data or {}),
        )

    def public_model_info():
        """Return safe active model metadata and capability hints."""
        info = current_model_info()
        if _model is not None:
            info["capabilities"] = SimpleChatModelAdapter(_model).get_capabilities()
        else:
            info["capabilities"] = {
                "structured_messages": True,
                "text_prompts": True,
                "tokenizer_chat_template": False,
                "system_role": True,
                "tool_role": True,
                "context_limit": None,
                "streaming": False,
                "native_tool_calling": False,
                "structured_json_tool_calling": False,
                "prompt_based_tool_calling": True,
                "tool_result_messages": True,
                "parallel_tool_calls": False,
            }
        return info

    def queue_summary(conversation_id=None):
        active_statuses = ["preparing", "waiting_for_tool", "running_tool", "generating", "streaming", "saving"]
        queued_statuses = ["queued"]
        return {
            "active": chat_store.database.list_generation_requests(statuses=active_statuses, limit=10),
            "queued": chat_store.database.list_generation_requests(conversation_id=conversation_id, statuses=queued_statuses, limit=200),
            "global_queued_count": chat_store.database.count_generation_requests(statuses=queued_statuses),
            "conversation_queued_count": chat_store.database.count_generation_requests(conversation_id=conversation_id, statuses=queued_statuses) if conversation_id else None,
        }

    def wait_for_request(request_id, timeout=30.0):
        deadline = time.time() + timeout
        last = None
        while time.time() < deadline:
            last = chat_store.database.get_generation_request(request_id)
            if last.get("status") in PromptQueueWorker.terminal_states:
                return last
            time.sleep(0.02)
        raise ChatApiError("generation_timeout", "Generation did not complete before the compatibility wait timeout.", status_code=504)

    def enqueue_generation_request(chat_id, data):
        content = str(data.get("content") or data.get("prompt") or "").strip()
        if not content:
            raise ChatApiError("message_empty", "Message content is required.", status_code=400)
        settings = chat_store.get_settings()
        queue_settings = {**DEFAULT_SETTINGS["queue"], **(settings.get("queue") or {})}
        max_len = int(queue_settings.get("max_message_length") or MAX_MESSAGE_CHARS)
        if len(content) > max_len:
            raise ChatApiError("message_too_large", "Message exceeds the configured queue message length.", status_code=413)
        queued_statuses = ["queued"]
        global_count = chat_store.database.count_generation_requests(statuses=queued_statuses)
        conversation_count = chat_store.database.count_generation_requests(conversation_id=chat_id, statuses=queued_statuses)
        if global_count >= int(queue_settings.get("max_global_queued_prompts") or 100):
            raise ChatApiError("queue_full", "The global prompt queue is full.", status_code=429)
        if conversation_count >= int(queue_settings.get("max_queued_prompts_per_conversation") or 20):
            raise ChatApiError("queue_full", "This conversation's prompt queue is full.", status_code=429)

        conversation = chat_store.get_chat(chat_id)
        requested_mode = str(data.get("mode") or settings.get("agent", {}).get("mode") or ("agent" if settings.get("privacy", {}).get("enable_agent_by_default") else "chat")).lower()
        requested_mode = "agent" if requested_mode == "agent" else "chat"
        model_source = active_source_from_payload(data)
        load_options = request_load_options(data)
        model_info = public_model_info()
        operation_id = _operation_hub.create_operation("generation", source=model_source)
        run = create_generation_run(chat_id, mode=requested_mode, operation_id=operation_id, model_info=model_info)
        user_message = chat_store.append_message(
            chat_id,
            "user",
            content,
            token_count=estimate_tokens(content),
            metadata={"generation_request_id": run["id"]},
        )
        assistant_message = chat_store.append_message(
            chat_id,
            "assistant",
            "",
            status="queued",
            model=model_info,
            generation_metadata={"generation_run_id": run["id"], "response_lifecycle": run},
            metadata={"include_in_context": False, "generation_request_id": run["id"], "queue_position": conversation_count + 1},
        )
        run["user_message_id"] = user_message["id"]
        run["assistant_message_id"] = assistant_message["id"]
        chat_store.database.upsert_generation_run(run)
        queue_sequence = chat_store.database.next_queue_sequence()
        item = {
            "id": run["id"],
            "conversation_id": chat_id,
            "user_message_id": user_message["id"],
            "assistant_message_id": assistant_message["id"],
            "generation_run_id": run["id"],
            "operation_id": operation_id,
            "model_id": normalize_model_source(model_source),
            "model_load_id": current_model_info().get("operation_status", {}).get("operation_id"),
            "load_options": load_options,
            "chat_template_id": conversation.get("chat_template_id") or settings.get("active_template_id") or "basic-chat",
            "chat_template_version": 1,
            "settings_snapshot": settings,
            "generation_settings": generation_options(data, default_max_tokens=100),
            "mode": requested_mode,
            "status": "queued",
            "queue_sequence": queue_sequence,
            "priority": 0,
            "created_at": run["created_at"],
            "updated_at": run["created_at"],
            "queue_position": conversation_count + 1,
        }
        chat_store.database.upsert_generation_request(item)
        _operation_hub.emit(operation_id, category="queue", level="info", stage="request_queued", message=f"Request queued at position {conversation_count + 1}.", details={"request_id": item["id"], "conversation_id": chat_id, "queue_position": conversation_count + 1})
        _stream_hub.emit(run["id"], "request_queued", operation_id=operation_id, conversation_id=chat_id, message_id=assistant_message["id"], queue_position=conversation_count + 1)
        queue_worker.wake()
        return item, user_message, assistant_message, run

    def safe_agent_tools(chat_id):
        """Create request-scoped safe Agent Runtime tools for the Simple Interface."""
        from arclm.agents import SideEffectLevel, Tool, ToolPermission
        from arclm.agents.builtins import (
            add,
            current_datetime,
            divide,
            format_json,
            html_to_text,
            markdown_to_text,
            multiply,
            parse_json,
            subtract,
            text_statistics,
        )

        def inspect_model_tool():
            """Inspect the active model runtime without exposing private paths."""

            info = public_model_info()
            return {
                "loaded": info.get("loaded"),
                "model_source": sanitize_text(info.get("model_source")),
                "primary_device": info.get("primary_device"),
                "resolved_devices": info.get("resolved_devices"),
                "dtype": info.get("dtype"),
                "quantization": info.get("quantization"),
                "parameter_count": info.get("parameter_count"),
                "capabilities": info.get("capabilities"),
            }

        def inspect_tokenizer_tool():
            """Inspect the active tokenizer class and available chat-template support."""

            tokenizer = getattr(_model, "tokenizer", None) if _model is not None else None
            if tokenizer is None and _model is not None:
                tokenizer = getattr(getattr(_model, "config", None), "tokenizer", None)
            return {
                "available": tokenizer is not None,
                "tokenizer_class": type(tokenizer).__name__ if tokenizer is not None else None,
                "has_chat_template": bool(tokenizer is not None and getattr(tokenizer, "chat_template", None)),
            }

        def inspect_context_tool():
            """Inspect the current conversation context summary without user prompts."""

            report = chat_builder.inspect_context(chat_id, _model)
            safe = dict(report)
            safe.pop("final_formatted_input_preview", None)
            safe.pop("system_instructions", None)
            safe.pop("persistent_instructions", None)
            return safe

        local_tools = [
            Tool.from_callable(inspect_model_tool, name="inspect_model", description="Inspect the active model runtime.", category="arclm", permission=ToolPermission.PURE, side_effect=SideEffectLevel.NONE, timeout_seconds=3),
            Tool.from_callable(inspect_tokenizer_tool, name="inspect_tokenizer", description="Inspect the active tokenizer.", category="arclm", permission=ToolPermission.PURE, side_effect=SideEffectLevel.NONE, timeout_seconds=3),
            Tool.from_callable(inspect_context_tool, name="inspect_context", description="Inspect included conversation context metadata.", category="arclm", permission=ToolPermission.PURE, side_effect=SideEffectLevel.NONE, timeout_seconds=3),
        ]
        tools = [add, subtract, multiply, divide, current_datetime, text_statistics, parse_json, format_json, markdown_to_text, html_to_text, *local_tools]
        return tools

    def tool_catalog():
        catalog = []
        for item in safe_agent_tools("__catalog__"):
            spec = item.spec.to_dict()
            spec["approval_required"] = chat_store.get_settings().get("privacy", {}).get("require_tool_approvals", False) or spec.get("permission") in {"read_network", "write_local", "external_action", "sensitive"}
            spec["filesystem_access"] = spec.get("permission") == "read_local"
            spec["network_access"] = spec.get("permission") == "read_network"
            spec["secret_access"] = spec.get("permission") == "sensitive"
            spec["maximum_result_size"] = chat_store.get_settings().get("agent", {}).get("max_tool_output_bytes", 65536)
            catalog.append(spec)
        return catalog

    def response_event_callback(operation_id):
        labels = {
            "preparing": ("info", "preparing_request"),
            "waiting_for_tool": ("info", "waiting_for_tool_approval"),
            "running_tool": ("info", "running_tool"),
            "generating": ("info", "generation_startup"),
            "saving": ("info", "saving_conversation"),
            "completed": ("success", "response_completed"),
            "failed": ("error", "response_failed"),
            "tool_failed": ("error", "tool_failed"),
            "cancelled": ("warning", "response_cancelled"),
        }

        def emit(state, message, details=None):
            level, stage = labels.get(state, ("info", state))
            _operation_hub.emit(operation_id, category="response", level=level, stage=stage, message=message, details=details or {})

        return emit

    def agent_trace_event_callback(operation_id):
        def emit(event_name, values):
            tool_name = values.get("tool_name")
            metadata = values.get("metadata") or {}
            if event_name == "tool_requested":
                _operation_hub.emit(operation_id, category="tool", level="info", stage="tool_requested", message=f"Tool requested: {tool_name}.", details={"tool_name": tool_name, **metadata})
            elif event_name == "approval_denied":
                _operation_hub.emit(operation_id, category="tool", level="warning", stage="tool_denied", message=f"Tool approval denied: {tool_name}.", details={"tool_name": tool_name, **metadata})
            elif event_name == "tool_started":
                _operation_hub.emit(operation_id, category="tool", level="info", stage="running_tool", message=f"Running {tool_name}.", details={"tool_name": tool_name, **metadata})
            elif event_name in {"tool_completed", "tool_failed"}:
                _operation_hub.emit(
                    operation_id,
                    category="tool",
                    level="success" if event_name == "tool_completed" else "error",
                    stage=event_name,
                    message=f"{tool_name} {'completed' if event_name == 'tool_completed' else 'failed'}.",
                    details={"tool_name": tool_name, **metadata},
                )

        return emit

    queue_worker.configure_agent_hooks(
        tools_provider=safe_agent_tools,
        trace_handler_factory=agent_trace_event_callback,
    )

    @app.route("/")
    def home():
        """Voert `home` uit."""
        return render_template(
            "index.html",
            default_model_source=normalize_model_source(DEFAULT_MODEL_SOURCE),
            default_model_save_path=DEFAULT_MODEL_SAVE_PATH,
        )

    @app.route("/api", methods=["GET"])
    def api_home():
        """Voert `api home` uit."""
        return jsonify({
            "name": "ArcLM Prediction API",
            "status": "running",
            **current_model_info(),
        })

    @app.route("/api/operations/status", methods=["GET"])
    def operation_status():
        """Return backend-authoritative model operation status."""
        return api_response(status=_operation_hub.status(), active=public_model_info())

    @app.route("/api/operations/events", methods=["GET"])
    def operation_events():
        """Poll bounded structured operation events."""
        include_debug = str(request.args.get("debug", "")).lower() in {"1", "true", "yes"}
        return api_response(
            events=_operation_hub.events_after(
                after_event_id=request.args.get("after"),
                limit=request.args.get("limit", 200),
                include_debug=include_debug,
            ),
            status=_operation_hub.status(),
        )

    @app.route("/api/operations/stream", methods=["GET"])
    def operation_stream():
        """Stream structured operation events with Server-Sent Events."""
        include_debug = str(request.args.get("debug", "")).lower() in {"1", "true", "yes"}
        subscriber = _operation_hub.subscribe()

        def event_stream():
            try:
                for event in _operation_hub.events_after(request.args.get("after"), include_debug=include_debug):
                    yield f"id: {event['event_id']}\nevent: operation\ndata: {json.dumps(event)}\n\n"
                while True:
                    try:
                        event = subscriber.get(timeout=15)
                    except queue.Empty:
                        yield ": heartbeat\n\n"
                        continue
                    if include_debug or event.get("level") != "debug":
                        yield f"id: {event['event_id']}\nevent: operation\ndata: {json.dumps(event)}\n\n"
            finally:
                _operation_hub.unsubscribe(subscriber)

        return Response(stream_with_context(event_stream()), mimetype="text/event-stream")

    @app.route("/api/operations/<operation_id>/cancel", methods=["POST"])
    def cancel_operation(operation_id):
        """Request cancellation for a backend operation."""
        if not _operation_hub.request_cancel(operation_id):
            return error_response(ValueError("Operation was not found."), status=404, code="operation_not_found")
        status = _operation_hub.status()
        if status.get("operation_id") == operation_id and status.get("state") in {"queued", "loading"}:
            _operation_hub.set_status(
                "cancelled",
                operation_id=operation_id,
                model_source=status.get("model_source"),
                message="Cancellation requested.",
                can_cancel=False,
                cancel_requested=True,
                error=None,
            )
        return api_response(status=_operation_hub.status())

    @app.route("/api/chats", methods=["GET"])
    def list_chats():
        """List local conversations sorted by recent activity."""
        try:
            return api_response(chats=chat_store.list_chats(request.args.get("q", ""), request.args.get("limit", 100)))
        except Exception as exc:
            return error_response(exc)

    @app.route("/api/chats", methods=["POST"])
    def create_chat():
        """Create a new persisted conversation."""
        try:
            return api_response(conversation=chat_store.create_chat(request.get_json(silent=True) or {}))
        except Exception as exc:
            return error_response(exc)

    @app.route("/api/chats", methods=["DELETE"])
    def delete_all_chats():
        """Delete every persisted conversation and related runtime records."""
        try:
            result = chat_store.delete_all_chats()
            _operation_hub.emit(
                _operation_hub.status().get("operation_id") or f"chat_delete_{new_short_id()}",
                category="chat",
                level="warning",
                stage="chats_deleted",
                message=f"Deleted {result['deleted_count']} chat(s).",
                details={"deleted_count": result["deleted_count"]},
            )
            return api_response(**result)
        except Exception as exc:
            return error_response(exc)

    @app.route("/api/chats/<chat_id>", methods=["GET"])
    def get_chat(chat_id):
        """Read one persisted conversation."""
        try:
            return api_response(conversation=chat_store.get_chat(chat_id))
        except Exception as exc:
            return error_response(exc)

    @app.route("/api/chats/<chat_id>", methods=["PATCH"])
    def update_chat(chat_id):
        """Rename or update chat-scoped settings."""
        try:
            return api_response(conversation=chat_store.update_chat(chat_id, request.get_json(silent=True) or {}))
        except Exception as exc:
            return error_response(exc)

    @app.route("/api/chats/<chat_id>", methods=["DELETE"])
    def delete_chat(chat_id):
        """Delete one persisted conversation."""
        try:
            return api_response(conversation=chat_store.delete_chat(chat_id))
        except Exception as exc:
            return error_response(exc)

    @app.route("/api/chats/<chat_id>/duplicate", methods=["POST"])
    def duplicate_chat(chat_id):
        """Duplicate one conversation with fresh IDs."""
        try:
            return api_response(conversation=chat_store.duplicate_chat(chat_id))
        except Exception as exc:
            return error_response(exc)

    @app.route("/api/chats/<chat_id>/messages", methods=["POST"])
    def create_chat_message(chat_id):
        """Append a user message and enqueue generation with saved conversation context."""
        try:
            data = request.get_json(silent=True) or {}
            item, user_message, assistant_message, run = enqueue_generation_request(chat_id, data)
            wait = bool(data.get("wait", not data.get("stream")))
            if not wait:
                return api_response(
                    request=item,
                    generation_request=item,
                    user_message=user_message,
                    assistant_message=assistant_message,
                    generation_run=run,
                    conversation=chat_store.get_chat(chat_id),
                    queue=queue_summary(chat_id),
                ), 202
            finished = wait_for_request(item["id"], timeout=float(data.get("wait_timeout_seconds") or 30))
            conversation = chat_store.get_chat(chat_id)
            assistant = chat_store.get_message(chat_id, item["assistant_message_id"])
            generation_run = chat_store.database.get_generation_run(item["generation_run_id"])
            if finished.get("status") == "failed":
                raise ChatApiError(finished.get("safe_error_code") or "generation_failed", "Generation failed.", status_code=500)
            if finished.get("status") == "cancelled":
                raise ChatApiError("generation_cancelled", "Generation was cancelled.", status_code=499)
            return api_response(
                conversation=conversation,
                user_message=user_message,
                assistant_message=assistant,
                context_report=(generation_run.get("context_report") or {}),
                generation_run=generation_run,
                request=finished,
                queue=queue_summary(chat_id),
            )
        except Exception as exc:
            return error_response(exc)

    @app.route("/api/chats/<chat_id>/regenerate", methods=["POST"])
    def regenerate_chat_message(chat_id):
        """Regenerate from the latest user message while preserving history."""
        try:
            conversation = chat_store.get_chat(chat_id)
            latest_user = next((item for item in reversed(conversation.get("messages", [])) if item.get("role") == "user"), None)
            if latest_user is None:
                return error_response(ValueError("No user message is available to regenerate."), status=400, code="message_not_found")
            data = request.get_json(silent=True) or {}
            model = active_model_or_load(data)
            result = chat_builder.send_message(
                chat_id,
                latest_user.get("content", ""),
                model,
                public_model_info(),
                generation_overrides=generation_options(data, default_max_tokens=100),
            )
            result["regenerated_from_message_id"] = latest_user.get("id")
            return api_response(result)
        except Exception as exc:
            return error_response(exc)

    @app.route("/api/queue", methods=["GET"])
    def list_queue():
        """Return backend-owned generation queue state."""
        try:
            conversation_id = request.args.get("conversation_id")
            statuses = request.args.get("status")
            selected = [item.strip() for item in statuses.split(",") if item.strip()] if statuses else None
            return api_response(queue=queue_summary(conversation_id), requests=chat_store.database.list_generation_requests(conversation_id=conversation_id, statuses=selected, limit=request.args.get("limit", 200)))
        except Exception as exc:
            return error_response(exc)

    @app.route("/api/chats/<chat_id>/queue", methods=["GET"])
    def list_chat_queue(chat_id):
        try:
            return api_response(queue=queue_summary(chat_id), requests=chat_store.database.list_generation_requests(conversation_id=chat_id, limit=request.args.get("limit", 200)))
        except Exception as exc:
            return error_response(exc)

    @app.route("/api/queue/<request_id>", methods=["PATCH"])
    def update_queued_request(request_id):
        """Edit or move a queued prompt before preparation starts."""
        try:
            data = request.get_json(silent=True) or {}
            item = chat_store.database.get_generation_request(request_id)
            if item.get("status") != "queued":
                raise ChatApiError("queue_request_locked", "Only queued requests can be edited or moved.", status_code=409)
            if "content" in data:
                content = str(data.get("content") or "").strip()
                if not content:
                    raise ChatApiError("message_empty", "Message content is required.", status_code=400)
                chat_store.update_message(item["conversation_id"], item["user_message_id"], content=content, token_count=estimate_tokens(content))
                item["settings_snapshot"] = chat_store.get_settings()
            if "queue_sequence" in data:
                item["queue_sequence"] = int(data["queue_sequence"])
            if "priority" in data:
                item["priority"] = int(data["priority"])
            item["updated_at"] = utc_now()
            chat_store.database.upsert_generation_request(item)
            _operation_hub.emit(item["operation_id"], category="queue", level="info", stage="queue_updated", message="Queued request updated.", details={"request_id": request_id})
            return api_response(request=item, conversation=chat_store.get_chat(item["conversation_id"]), queue=queue_summary(item["conversation_id"]))
        except Exception as exc:
            return error_response(exc)

    @app.route("/api/queue/<request_id>", methods=["DELETE"])
    def remove_queued_request(request_id):
        """Remove a queued prompt without affecting the active generation."""
        try:
            item = chat_store.database.get_generation_request(request_id)
            if item.get("status") != "queued":
                raise ChatApiError("queue_request_locked", "Only queued requests can be removed.", status_code=409)
            item["status"] = "removed"
            item["completed_at"] = utc_now()
            item["updated_at"] = item["completed_at"]
            chat_store.database.upsert_generation_request(item)
            chat_store.update_message(item["conversation_id"], item["assistant_message_id"], status="removed", metadata={"include_in_context": False})
            _operation_hub.emit(item["operation_id"], category="queue", level="warning", stage="request_removed", message="Queued request removed.", details={"request_id": request_id})
            _stream_hub.emit(item["generation_run_id"], "request_removed", operation_id=item["operation_id"], conversation_id=item["conversation_id"], message_id=item.get("assistant_message_id"))
            return api_response(request=item, conversation=chat_store.get_chat(item["conversation_id"]), queue=queue_summary(item["conversation_id"]))
        except Exception as exc:
            return error_response(exc)

    @app.route("/api/chats/<chat_id>/queue", methods=["DELETE"])
    def clear_chat_queue(chat_id):
        """Remove all queued prompts for a conversation."""
        try:
            removed = []
            for item in chat_store.database.list_generation_requests(conversation_id=chat_id, statuses=["queued"], limit=1000):
                item["status"] = "removed"
                item["completed_at"] = utc_now()
                item["updated_at"] = item["completed_at"]
                chat_store.database.upsert_generation_request(item)
                chat_store.update_message(chat_id, item["assistant_message_id"], status="removed", metadata={"include_in_context": False})
                removed.append(item["id"])
                _stream_hub.emit(item["generation_run_id"], "request_removed", operation_id=item["operation_id"], conversation_id=chat_id, message_id=item.get("assistant_message_id"))
            _operation_hub.emit(_operation_hub.status().get("operation_id") or f"queue_{new_short_id()}", category="queue", level="warning", stage="queue_cleared", message=f"Removed {len(removed)} queued request(s).", details={"conversation_id": chat_id})
            return api_response(removed=removed, queue=queue_summary(chat_id), conversation=chat_store.get_chat(chat_id))
        except Exception as exc:
            return error_response(exc)

    @app.route("/api/generation-runs/<run_id>/cancel", methods=["POST"])
    def cancel_generation_run(run_id):
        """Cancel one active generation or remove it if still queued."""
        try:
            item = chat_store.database.get_generation_request(run_id)
            if item.get("status") == "queued":
                item["status"] = "cancelled"
                item["cancelled_at"] = utc_now()
                item["completed_at"] = item["cancelled_at"]
                item["updated_at"] = item["cancelled_at"]
                chat_store.database.upsert_generation_request(item)
                chat_store.update_message(item["conversation_id"], item["assistant_message_id"], status="cancelled", metadata={"include_in_context": False})
                _stream_hub.emit(run_id, "generation_cancelled", operation_id=item["operation_id"], conversation_id=item["conversation_id"], message_id=item.get("assistant_message_id"), text="")
            else:
                _operation_hub.request_cancel(item.get("operation_id"))
            return api_response(request=chat_store.database.get_generation_request(run_id), queue=queue_summary(item.get("conversation_id")))
        except Exception as exc:
            return error_response(exc)

    @app.route("/api/generation-runs/<run_id>/events", methods=["GET"])
    def generation_events(run_id):
        """Poll bounded generation stream events."""
        try:
            return api_response(events=_stream_hub.events_after(run_id, after_sequence=request.args.get("after_sequence"), limit=request.args.get("limit", 500)))
        except Exception as exc:
            return error_response(exc)

    @app.route("/api/generation-runs/<run_id>/stream", methods=["GET"])
    def generation_stream(run_id):
        """Stream generation deltas and lifecycle events with Server-Sent Events."""
        after_sequence = request.args.get("after_sequence")
        subscriber = _stream_hub.subscribe(run_id)

        def event_stream():
            try:
                for event in _stream_hub.events_after(run_id, after_sequence=after_sequence):
                    yield f"id: {event.get('sequence', 0)}\nevent: generation\ndata: {json.dumps(event, ensure_ascii=False)}\n\n"
                while True:
                    try:
                        event = subscriber.get(timeout=15)
                    except queue.Empty:
                        yield ": heartbeat\n\n"
                        continue
                    yield f"id: {event.get('sequence', 0)}\nevent: generation\ndata: {json.dumps(event, ensure_ascii=False)}\n\n"
                    if event.get("type") in {"generation_completed", "generation_failed", "generation_cancelled", "request_removed"}:
                        break
            finally:
                _stream_hub.unsubscribe(run_id, subscriber)

        return Response(stream_with_context(event_stream()), mimetype="text/event-stream")

    @app.route("/api/chats/<chat_id>/context", methods=["GET"])
    def inspect_chat_context(chat_id):
        """Return a safe input-only context inspection report."""
        try:
            return api_response(context=chat_builder.inspect_context(chat_id, _model))
        except Exception as exc:
            return error_response(exc)

    @app.route("/api/chats/<chat_id>/export", methods=["GET"])
    def export_chat(chat_id):
        """Export one conversation as versioned JSON."""
        try:
            return jsonify(chat_store.export_data(chat_id))
        except Exception as exc:
            return error_response(exc)

    @app.route("/api/export", methods=["GET"])
    def export_all():
        """Export all non-secret simple-interface data."""
        try:
            return jsonify(chat_store.export_data())
        except Exception as exc:
            return error_response(exc)

    @app.route("/api/import", methods=["POST"])
    def import_data():
        """Import validated simple-interface data."""
        try:
            return api_response(chat_store.import_data(request.get_json(silent=True) or {}))
        except Exception as exc:
            return error_response(exc)

    @app.route("/api/templates", methods=["GET"])
    def list_templates():
        """List built-in and user templates."""
        try:
            return api_response(templates=chat_store.list_templates())
        except Exception as exc:
            return error_response(exc)

    @app.route("/api/templates", methods=["POST"])
    def save_template():
        """Create or update a validated user template."""
        try:
            return api_response(template=chat_store.save_template(json_payload()))
        except Exception as exc:
            return error_response(exc)

    @app.route("/api/templates/<template_id>", methods=["GET"])
    def get_template(template_id):
        """Read one template."""
        try:
            return api_response(template=chat_store.get_template(template_id))
        except Exception as exc:
            return error_response(exc)

    @app.route("/api/templates/<template_id>", methods=["PATCH"])
    def patch_template(template_id):
        """Update one user template."""
        try:
            payload = json_payload()
            payload["id"] = template_id
            return api_response(template=chat_store.save_template(payload))
        except Exception as exc:
            return error_response(exc)

    @app.route("/api/templates/<template_id>", methods=["DELETE"])
    def delete_template(template_id):
        """Delete one user template."""
        try:
            return api_response(template=chat_store.delete_template(template_id))
        except Exception as exc:
            return error_response(exc)

    @app.route("/api/templates/validate", methods=["POST"])
    def validate_template_route():
        """Validate a candidate template without saving it."""
        try:
            return api_response(validate_template(json_payload()))
        except Exception as exc:
            return error_response(exc)

    @app.route("/api/templates/preview", methods=["POST"])
    def preview_template_route():
        """Preview a candidate template without saving it."""
        try:
            return api_response(preview_template(json_payload()))
        except Exception as exc:
            return error_response(exc)

    @app.route("/api/settings", methods=["GET"])
    def get_settings():
        """Read application settings."""
        try:
            return api_response(settings=chat_store.get_settings())
        except Exception as exc:
            return error_response(exc)

    @app.route("/api/settings", methods=["PATCH"])
    def patch_settings():
        """Update application settings."""
        try:
            return api_response(settings=chat_store.update_settings(request.get_json(silent=True) or {}))
        except Exception as exc:
            return error_response(exc)

    @app.route("/api/tools", methods=["GET"])
    def list_agent_tools():
        """List safe Agent Runtime tools exposed to the Simple Interface."""
        try:
            return api_response(tools=tool_catalog(), mode=chat_store.get_settings().get("agent", {}).get("mode", "chat"))
        except Exception as exc:
            return error_response(exc)

    @app.route("/api/generation-runs/<run_id>", methods=["GET"])
    def get_generation_run(run_id):
        """Return one persisted response lifecycle record."""
        try:
            return api_response(generation_run=chat_store.database.get_generation_run(run_id))
        except Exception as exc:
            return error_response(exc)

    @app.route("/api/generation-runs/<run_id>/reveal", methods=["POST"])
    def record_generation_reveal(run_id):
        """Persist frontend-observed token reveal animation timing."""
        try:
            payload = request.get_json(silent=True) or {}
            run = chat_store.database.get_generation_run(run_id)
            timestamps = dict(run.get("timestamps") or {})
            for source_key, target_key in (("started_at", "reveal_started_at"), ("completed_at", "reveal_completed_at")):
                value = payload.get(source_key)
                if value:
                    timestamps[target_key] = sanitize_text(value)
            run["timestamps"] = timestamps
            run["status"] = "completed"
            run["durations_ms"] = response_durations(timestamps)
            run["performance_metrics"] = performance_metrics(run)
            run["updated_at"] = utc_now()
            chat_store.database.upsert_generation_run(run)
            return api_response(generation_run=run)
        except Exception as exc:
            return error_response(exc)

    @app.route("/api/chats/<chat_id>/generation-runs", methods=["GET"])
    def list_generation_runs(chat_id):
        """Return persisted generation runs for a conversation."""
        try:
            runs = chat_store.database.list_rows(
                "generation_runs",
                "WHERE conversation_id = ? ORDER BY created_at",
                (chat_id,),
            )
            return api_response(generation_runs=runs)
        except Exception as exc:
            return error_response(exc)

    @app.route("/api/model-profiles", methods=["GET"])
    def list_model_profiles():
        """List saved model profiles."""
        try:
            return api_response(profiles=chat_store.list_model_profiles())
        except Exception as exc:
            return error_response(exc)

    @app.route("/api/model-profiles", methods=["POST"])
    def save_model_profile():
        """Create or update a model profile."""
        try:
            return api_response(profile=chat_store.save_model_profile(request.get_json(silent=True) or {}))
        except Exception as exc:
            return error_response(exc)

    @app.route("/api/model-profiles/<profile_id>", methods=["DELETE"])
    def delete_model_profile(profile_id):
        """Delete a model profile."""
        try:
            return api_response(profile=chat_store.delete_model_profile(profile_id))
        except Exception as exc:
            return error_response(exc)

    @app.route("/api/memories", methods=["GET"])
    def list_memories():
        """List optional local cross-chat memories."""
        try:
            return api_response(memories=chat_store.list_memories(), enabled=chat_store.get_settings().get("privacy", {}).get("enable_memory", False))
        except Exception as exc:
            return error_response(exc)

    @app.route("/api/memories", methods=["POST"])
    def save_memory():
        """Create or update a local memory when enabled."""
        try:
            return api_response(memory=chat_store.save_memory(request.get_json(silent=True) or {}))
        except Exception as exc:
            return error_response(exc)

    @app.route("/api/memories/<memory_id>", methods=["DELETE"])
    def delete_memory(memory_id):
        """Delete one local memory."""
        try:
            return api_response(chat_store.delete_memory(memory_id))
        except Exception as exc:
            return error_response(exc)

    @app.route("/api/memories", methods=["DELETE"])
    def clear_memories():
        """Clear all local memories."""
        try:
            return api_response(chat_store.delete_memory())
        except Exception as exc:
            return error_response(exc)

    @app.route("/api/models", methods=["GET"])
    def list_models():
        """Return simple-interface model choices and the active model."""
        try:
            import arclm

            return api_response(models=arclm.list_available_models(), active=public_model_info())
        except Exception as exc:
            return error_response(exc)

    @app.route("/api/models/active", methods=["GET"])
    def active_model():
        """Return the active model state."""
        return api_response(active=public_model_info())

    @app.route("/api/models/load", methods=["POST"])
    def api_load_model():
        """Start an asynchronous backend model-loading operation."""
        try:
            data = request.get_json(silent=True) or {}
            source = active_source_from_payload(data)
            operation_id = start_model_load_operation(
                source,
                load_options=request_load_options(data),
                force_reload=bool(data.get("reload", False)),
            )
            return api_response(operation_id=operation_id, status=_operation_hub.status(), active=public_model_info()), 202
        except Exception as exc:
            return error_response(exc)

    @app.route("/api/models/unload", methods=["POST"])
    def api_unload_model():
        """Unload the cached model without deleting any model files."""
        global _model, _model_cache_key, _model_source, _model_options
        operation_id = _operation_hub.create_operation("model_unload", source=_model_source)
        _operation_hub.set_status(
            "unloading",
            operation_id=operation_id,
            model_source=_model_source or normalize_model_source(DEFAULT_MODEL_SOURCE),
            message="Unloading model.",
            can_cancel=False,
            cancel_requested=False,
            error=None,
        )
        _operation_hub.emit(operation_id, category="model", level="info", stage="unloading", message="Unloading active model from the simple-interface cache.")
        with _model_lock:
            _model = None
            _model_cache_key = None
            _model_source = None
            _model_options = {}
        _operation_hub.emit(operation_id, category="model", level="success", stage="unloaded", message="Model unloaded.")
        _operation_hub.complete_operation(operation_id, "no_model")
        _operation_hub.set_status(
            "no_model",
            operation_id=operation_id,
            model_source=normalize_model_source(DEFAULT_MODEL_SOURCE),
            message="No model is loaded.",
            can_cancel=False,
            cancel_requested=False,
            error=None,
        )
        return api_response(**current_model_info())

    @app.route("/api/models/active/inspect", methods=["GET", "POST"])
    def api_active_model_inspect():
        """Compatibility API wrapper for active model inspection."""
        return inspect_model()

    @app.route("/model/inspect", methods=["GET", "POST"])
    def inspect_model():
        """Voert `inspect model` uit."""
        try:
            data = request.get_json(silent=True) or {}
            source = (
                request.args.get("source")
                or active_source_from_payload(data)
                or DEFAULT_MODEL_SOURCE
            )
            operation_id = _operation_hub.create_operation("model_inspect", source=source)
            _operation_hub.emit(operation_id, category="model", level="info", stage="validating_source", message="Inspecting model source.")
            info = inspect_model_source(normalize_model_source(source))
            _operation_hub.emit(operation_id, category="model", level="success", stage="inspection_complete", message="Model inspection completed.")
            _operation_hub.complete_operation(operation_id, "ready" if _model is not None else "no_model")
            return jsonify({
                "success": True,
                "operation_id": operation_id,
                "source_info": info.to_dict(),
                "report": info.format_report(),
            })
        except Exception as exc:
            if "operation_id" in locals():
                _operation_hub.emit(operation_id, category="model", level="error", stage="inspection_failed", message=str(exc))
                _operation_hub.complete_operation(operation_id, "error")
            return error_response(exc)

    @app.route("/model/load", methods=["POST"])
    def load_model_route():
        """Voert `load model route` uit."""
        try:
            data = request.get_json(silent=True) or {}
            source = active_source_from_payload(data)
            operation_id = _operation_hub.create_operation("model_load", source=source)
            model = get_model(
                source=source,
                load_options=request_load_options(data),
                force_reload=bool(data.get("reload", False)),
                operation_id=operation_id,
            )
            return jsonify({
                "success": True,
                "operation_id": operation_id,
                **current_model_info(),
                "source_type": getattr(model.source_info, "source_type", None),
            })
        except Exception as exc:
            if "operation_id" in locals():
                _operation_hub.emit(operation_id, category="model", level="error", stage="load_failed", message=str(exc))
                _operation_hub.set_status(
                    "error",
                    operation_id=operation_id,
                    model_source=sanitize_text(source if "source" in locals() else DEFAULT_MODEL_SOURCE),
                    message="Model loading failed.",
                    can_cancel=False,
                    cancel_requested=False,
                    error={"code": "model_load_failed", "message": sanitize_text(str(exc))},
                )
                _operation_hub.complete_operation(operation_id, "error")
            return error_response(exc)

    @app.route("/model/save", methods=["POST"])
    def save_model_route():
        """Voert `save model route` uit."""
        try:
            data = request.get_json(silent=True) or {}
            save_path = str(data.get("save_path") or DEFAULT_MODEL_SAVE_PATH).strip()
            if not save_path:
                return error_response(ValueError("Save path is required."), status=400)

            model = get_model(
                source=active_source_from_payload(data),
                load_options=request_load_options(data),
            )
            saved_path = model.save(save_path, save_config=request_save_config(data))

            return jsonify({
                "success": True,
                "saved_path": str(saved_path) if saved_path is not None else None,
                "save_path": save_path,
                **current_model_info(),
            })
        except Exception as exc:
            return error_response(exc)

    @app.route("/predict", methods=["POST"])
    def predict():
        """Voert `predict` uit."""
        try:
            data = request.get_json(silent=True) or {}
            prompt = data.get("prompt", "").strip()

            if not prompt:
                return error_response(ValueError("Prompt is required."), status=400)

            model = get_model(
                source=active_source_from_payload(data),
                load_options=request_load_options(data),
            )
            operation_id = _operation_hub.create_operation("generation", source=current_model_info().get("model_source"))
            _operation_hub.set_status(
                "generating",
                operation_id=operation_id,
                model_source=current_model_info().get("model_source"),
                message="Generating one token.",
                can_cancel=False,
                cancel_requested=False,
                error=None,
            )
            _operation_hub.emit(operation_id, category="generation", level="info", stage="generation_startup", message="Starting one-token prediction request.")
            output = model.predict(
                prompt,
                **generation_options({**data, "max_new_tokens": 1}, default_max_tokens=1),
            )
            _operation_hub.emit(operation_id, category="generation", level="success", stage="generation_complete", message="Prediction completed.")
            _operation_hub.complete_operation(operation_id, "ready")
            _operation_hub.set_status(
                "ready",
                operation_id=operation_id,
                model_source=current_model_info().get("model_source"),
                message="Model is ready.",
                can_cancel=False,
                cancel_requested=False,
                error=None,
            )
            token = generated_part(prompt, output)

            return jsonify({
                "success": True,
                "token": token,
                "text": output,
                **current_model_info(),
            })
        except Exception as exc:
            if "operation_id" in locals():
                _operation_hub.emit(operation_id, category="generation", level="error", stage="generation_failed", message=str(exc))
                _operation_hub.complete_operation(operation_id, "error")
            return error_response(exc)

    @app.route("/generate", methods=["POST"])
    def generate():
        """Voert `generate` uit."""
        try:
            data = request.get_json(silent=True) or {}
            prompt = data.get("prompt", "").strip()

            if not prompt:
                return error_response(ValueError("Prompt is required."), status=400)

            model = get_model(
                source=active_source_from_payload(data),
                load_options=request_load_options(data),
            )
            operation_id = _operation_hub.create_operation("generation", source=current_model_info().get("model_source"))
            _operation_hub.set_status(
                "generating",
                operation_id=operation_id,
                model_source=current_model_info().get("model_source"),
                message="Generating response.",
                can_cancel=False,
                cancel_requested=False,
                error=None,
            )
            _operation_hub.emit(operation_id, category="generation", level="info", stage="generation_startup", message="Starting generation request.")
            output = model.generate(
                prompt,
                **generation_options(data, default_max_tokens=100),
            )
            _operation_hub.emit(operation_id, category="generation", level="success", stage="generation_complete", message="Generation completed.")
            _operation_hub.complete_operation(operation_id, "ready")
            _operation_hub.set_status(
                "ready",
                operation_id=operation_id,
                model_source=current_model_info().get("model_source"),
                message="Model is ready.",
                can_cancel=False,
                cancel_requested=False,
                error=None,
            )
            generated = generated_part(prompt, output)
            result = output if str(output).startswith(prompt) else prompt + generated

            return jsonify({
                "success": True,
                "prompt": prompt,
                "result": result,
                "generated": generated,
                **current_model_info(),
            })
        except Exception as exc:
            if "operation_id" in locals():
                _operation_hub.emit(operation_id, category="generation", level="error", stage="generation_failed", message=str(exc))
                _operation_hub.complete_operation(operation_id, "error")
            return error_response(exc)

    @app.route("/health", methods=["GET"])
    def health():
        """Voert `health` uit."""
        return jsonify({
            "status": "ok",
            **current_model_info(),
        })

    return app


def run_simple_interface(host=None, port=None, debug=None):
    """Run ArcLM's simple web inference interface."""

    app = create_simple_interface_app()
    app.run(
        host=host or os.getenv("HOST", "127.0.0.1"),
        port=int(port or os.getenv("PORT", "5000")),
        debug=env_bool("FLASK_DEBUG", False) if debug is None else bool(debug),
    )


app = create_simple_interface_app()


if __name__ == "__main__":
    run_simple_interface()
