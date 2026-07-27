"""Localhost-only webstudio voor veilige modelvoorbeelden."""

from __future__ import annotations

import importlib.util
import json
import sys
from pathlib import Path
from typing import Any, Dict


def _load_memory_module():
    path = Path(__file__).resolve().parents[1] / "shared" / "memory.py"
    spec = importlib.util.spec_from_file_location("arclm_examples_memory", path)
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module


_memory_module = _load_memory_module()
ConversationMemory = _memory_module.ConversationMemory
MemoryConfig = _memory_module.MemoryConfig


def _manifest() -> Dict[str, Any]:
    return json.loads((Path(__file__).resolve().parents[1] / "models.json").read_text(encoding="utf-8"))


def iter_models():
    yield from _manifest().get("models", [])


def get_model(model_id: str) -> Dict[str, Any]:
    for model in iter_models():
        if model.get("id") == model_id:
            return model
    raise ValueError(f"Onbekend model-id: {model_id}")


def create_app():
    try:
        from flask import Flask, jsonify, request
    except ImportError as exc:
        raise ImportError("Deze webstudio vereist Flask. Installeer met: pip install 'arclm[web]'") from exc

    app = Flask(__name__, static_folder="static", static_url_path="")
    sessions: Dict[str, ConversationMemory] = {}

    @app.errorhandler(ValueError)
    def handle_value_error(error):
        return jsonify({"error": "invalid_request", "message": str(error)}), 404

    @app.get("/")
    def index():
        return app.send_static_file("index.html")

    @app.get("/api/models")
    def models():
        return jsonify({"models": list(iter_models())})

    @app.get("/api/models/<model_id>")
    def model_detail(model_id: str):
        return jsonify(get_model(model_id))

    @app.post("/api/models/<model_id>/download")
    def download(model_id: str):
        model = get_model(model_id)
        payload: Dict[str, Any] = request.get_json(silent=True) or {}
        if payload.get("confirm") is not True:
            return jsonify({"error": "download_requires_explicit_confirmation", "model": model["id"]}), 400
        return jsonify({"status": "accepted", "model": model["id"], "revision": model["revision"]})

    @app.post("/api/models/<model_id>/load")
    def load(model_id: str):
        return jsonify({"status": "not_tested", "model": get_model(model_id)["id"]})

    @app.post("/api/models/<model_id>/unload")
    def unload(model_id: str):
        return jsonify({"status": "ok", "model": get_model(model_id)["id"]})

    @app.post("/api/models/<model_id>/generate")
    def generate(model_id: str):
        get_model(model_id)
        payload = request.get_json(silent=True) or {}
        prompt = str(payload.get("prompt", "")).strip()
        max_new_tokens = int(payload.get("max_new_tokens", 32))
        if not prompt or max_new_tokens < 1 or max_new_tokens > 256:
            return jsonify({"error": "invalid_generation_request"}), 400
        return jsonify({"status": "not_tested", "generated_text": "", "model": model_id})

    @app.post("/api/models/<model_id>/prepare-sft")
    def prepare_sft(model_id: str):
        return jsonify({"status": "not_tested", "model": get_model(model_id)["id"]})

    @app.post("/api/models/<model_id>/fine-tune")
    def fine_tune(model_id: str):
        return jsonify({"status": "not_tested", "model": get_model(model_id)["id"]})

    @app.post("/api/models/<model_id>/save")
    def save(model_id: str):
        return jsonify({"status": "not_tested", "model": get_model(model_id)["id"]})

    @app.post("/api/models/<model_id>/benchmark")
    def benchmark(model_id: str):
        return jsonify({"status": "not_tested", "model": get_model(model_id)["id"]})

    @app.post("/api/agent/sessions")
    def create_session():
        payload = request.get_json(silent=True) or {}
        session_id = str(payload.get("session_id", f"session-{len(sessions) + 1}"))
        config = MemoryConfig(**payload.get("memory", {}))
        sessions[session_id] = ConversationMemory(config, session_id=session_id)
        return jsonify({"session_id": session_id, "memory": config.__dict__})

    @app.post("/api/agent/sessions/<session_id>/messages")
    def add_message(session_id: str):
        memory = sessions.get(session_id)
        if memory is None:
            return jsonify({"error": "unknown_session"}), 404
        payload = request.get_json(silent=True) or {}
        content = str(payload.get("content", "")).strip()
        if not content:
            return jsonify({"error": "empty_message"}), 400
        memory.add("user", content)
        recall = memory.recall(content)
        response = "Memory bevat relevante eerdere context." if recall else "Geen relevante memory gevonden."
        memory.add("assistant", response)
        return jsonify({"response": response, "recall": recall})

    @app.get("/api/agent/sessions/<session_id>")
    def get_session(session_id: str):
        memory = sessions.get(session_id)
        if memory is None:
            return jsonify({"error": "unknown_session"}), 404
        return jsonify({"session_id": session_id, "messages": memory.messages, "compactions": memory.compactions})

    @app.delete("/api/agent/sessions/<session_id>/memory")
    def clear_memory(session_id: str):
        memory = sessions.get(session_id)
        if memory is None:
            return jsonify({"error": "unknown_session"}), 404
        memory.clear()
        return jsonify({"status": "cleared"})

    return app


if __name__ == "__main__":
    create_app().run(host="127.0.0.1", port=7860, debug=False)
