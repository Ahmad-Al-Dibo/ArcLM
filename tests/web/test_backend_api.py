import builtins

import pytest
from fastapi import HTTPException
from fastapi.testclient import TestClient

import arclm
from arclm.exceptions import ConfigurationError
from arclm.web import WebConfig, create_app
from arclm.web.schemas import EnvironmentResponse, GpuInfo
from arclm.web.services import clear_runtime_cache


def make_client(config=None, **kwargs):
    return TestClient(create_app(config or WebConfig(), **kwargs))


def test_create_app_registers_routes_and_openapi():
    app = create_app()
    paths = {route.path for route in app.routes}

    assert "/api/health" in paths
    assert "/api/environment" in paths
    assert "/api/capabilities" in paths
    assert "/api/project/status" in paths
    assert "/api/datasets" in paths
    assert "/api/datasets/{dataset_id}/inspection" in paths
    assert app.openapi()["info"]["title"] == "ArcLM Local Web API"


def test_web_config_validation():
    with pytest.raises(ConfigurationError, match="port must be between"):
        WebConfig(port=70000)
    with pytest.raises(ConfigurationError, match="must not contain"):
        WebConfig(allowed_origins=("*",))
    with pytest.raises(ConfigurationError, match="absolute HTTP origins"):
        WebConfig(allowed_origins=("file:///tmp",))


def test_health_is_fast_and_safe():
    response = make_client().get("/api/health")

    assert response.status_code == 200
    assert response.json() == {
        "status": "ok",
        "service": "arclm-web-api",
        "version": arclm.__version__,
    }
    assert "environment" not in response.text.lower()


def test_environment_cpu_response(monkeypatch):
    import arclm.web.services as services

    class FakeCuda:
        @staticmethod
        def is_available():
            return False

    class FakeTorch:
        __version__ = "2.5.1+cpu"
        cuda = FakeCuda()

        class version:
            cuda = None

    clear_runtime_cache()
    monkeypatch.setattr(services, "_load_torch", lambda: FakeTorch)

    data = make_client().get("/api/environment").json()

    assert data["cuda_available"] is False
    assert data["preferred_device"] == "cpu"
    assert data["available_devices"] == ["cpu"]
    assert data["gpus"] == []
    assert "Users" not in str(data)


def test_environment_single_gpu_response(monkeypatch):
    import arclm.web.app as app_module

    fake_environment = EnvironmentResponse(
        arclm_version=arclm.__version__,
        python_version="3.12.10",
        platform="Windows",
        pytorch_version="2.5.1+cu121",
        cuda_available=True,
        cuda_runtime="12.1",
        device_count=1,
        available_devices=["cpu", "cuda:0"],
        preferred_device="cuda:0",
        gpus=[
            GpuInfo(
                name="NVIDIA GeForce GTX 1050 Ti",
                vram_bytes=4_294_770_688,
                compute_capability=(6, 1),
            )
        ],
        bf16_supported=False,
    )
    monkeypatch.setattr(app_module, "get_environment", lambda: fake_environment)

    data = make_client().get("/api/environment").json()

    assert data["cuda_available"] is True
    assert data["gpus"][0]["name"] == "NVIDIA GeForce GTX 1050 Ti"
    assert data["gpus"][0]["compute_capability"] == [6, 1]


def test_capabilities_are_evidence_based():
    data = make_client().get("/api/capabilities").json()

    assert data["training"]["single_device"]["status"] == "available"
    assert data["web"]["backend"]["status"] == "available"
    assert data["web"]["simple_dashboard"]["status"] == "locally_verified"
    assert data["web"]["advanced_dashboard"]["status"] == "locally_verified"
    assert data["web"]["dataset_inspector_backend"]["status"] == "available"
    assert data["web"]["dataset_inspector_ui"]["status"] == "available"
    assert data["web"]["dataset_source_manager"]["status"] == "available"
    assert data["training"]["ddp"]["status"] == "planned"
    assert data["training"]["fp16"]["hardware_requirement"] == "CUDA-capable NVIDIA GPU"
    assert data["training"]["multi_gpu"]["status"] in {"hardware_unavailable", "not_verified"}


def test_project_status_is_safe_metadata():
    data = make_client().get("/api/project/status").json()

    assert data["project"]["name"] == "ArcLM"
    assert data["web_milestone"]["feature"] == "Dataset Source Manager"
    assert data["web_milestone"]["status"] == "complete"
    assert "overview" in data["available_sections"]
    assert data["completed"][0]["name"] == "Frontend Foundation"
    assert any(item["name"] == "Simple Dashboard" for item in data["completed"])
    assert any(item["name"] == "Advanced Dashboard" for item in data["completed"])
    assert any(item["name"] == "Dataset Inspector Backend" for item in data["completed"])
    assert any(item["name"] == "Dataset Inspector UI" for item in data["completed"])
    assert any(item["name"] == "Dataset Source Manager" for item in data["completed"])
    assert data["current"]["name"] == "Data Pipeline Studio"
    assert any(item["name"] == "Approved Pipeline Step Registry" for item in data["planned_features"])
    assert any(item["name"] == "CPU core suite" for item in data["validation"])
    assert any(item["name"] == "Transformers" for item in data["integrations"])
    assert any(item["title"] == "Single local GPU" for item in data["limitations"])
    assert "PROJECT_MAP" not in str(data)
    assert "D:\\" not in str(data)
    assert "API_KEY" not in str(data)


def test_cors_allows_local_origin_and_rejects_unknown_origin():
    client = make_client()

    allowed = client.options(
        "/api/health",
        headers={
            "Origin": "http://127.0.0.1:3000",
            "Access-Control-Request-Method": "GET",
        },
    )
    rejected = client.options(
        "/api/health",
        headers={
            "Origin": "http://example.com",
            "Access-Control-Request-Method": "GET",
        },
    )

    assert allowed.status_code == 200
    assert allowed.headers["access-control-allow-origin"] == "http://127.0.0.1:3000"
    assert rejected.status_code == 400
    assert rejected.headers.get("access-control-allow-origin") is None


def test_error_format_hides_stack_traces():
    app = create_app()

    @app.get("/boom")
    def boom():
        raise RuntimeError("D:\\secret\\trace.txt")

    client = TestClient(app, raise_server_exceptions=False)
    response = client.get("/boom")

    assert response.status_code == 500
    assert response.json() == {
        "error": {
            "code": "internal_error",
            "message": "An unexpected server error occurred.",
        }
    }
    assert "secret" not in response.text


def test_http_error_uses_consistent_error_format():
    app = create_app()

    @app.get("/missing")
    def missing():
        raise HTTPException(status_code=404, detail="Missing item")

    response = TestClient(app, raise_server_exceptions=False).get("/missing")

    assert response.status_code == 404
    assert response.json()["error"]["message"] == "Missing item"


def test_optional_dependency_message(monkeypatch):
    import arclm.web.app as app_module

    real_import = builtins.__import__

    def blocked_import(name, *args, **kwargs):
        if name == "fastapi":
            raise ModuleNotFoundError("No module named 'fastapi'", name="fastapi")
        return real_import(name, *args, **kwargs)

    monkeypatch.setattr(builtins, "__import__", blocked_import)

    with pytest.raises(RuntimeError, match='pip install "arclm\\[web\\]"'):
        app_module._optional_fastapi()


def test_legacy_flask_import_still_exists():
    from arclm.simple_interface import create_simple_interface_app

    assert callable(create_simple_interface_app)
