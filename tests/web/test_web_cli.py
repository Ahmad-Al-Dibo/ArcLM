from types import SimpleNamespace

from arclm.cli import main, web_api_command


def test_web_api_help_is_discoverable(capsys, monkeypatch):
    monkeypatch.setattr("sys.argv", ["arclm", "web-api", "--help"])

    try:
        main()
    except SystemExit as exc:
        assert exc.code == 0

    output = capsys.readouterr().out
    assert "Start the optional FastAPI backend for the ArcLM Web UI" in output
    assert "--host" in output
    assert "--port" in output


def test_web_api_invalid_port_returns_error(capsys):
    code = web_api_command(
        SimpleNamespace(
            host="127.0.0.1",
            port=70000,
            no_docs=False,
            dataset_root=[],
        )
    )

    assert code == 1
    assert "port must be between" in capsys.readouterr().out


def test_web_api_reuses_create_app_without_starting_real_server(monkeypatch):
    calls = {}

    def fake_run(app, host, port):
        calls["host"] = host
        calls["port"] = port
        calls["app"] = app

    monkeypatch.setattr("uvicorn.run", fake_run)

    code = web_api_command(
        SimpleNamespace(
            host="127.0.0.1",
            port=8765,
            no_docs=True,
            dataset_root=[],
        )
    )

    assert code == 0
    assert calls["host"] == "127.0.0.1"
    assert calls["port"] == 8765
    assert calls["app"].docs_url is None


def test_web_api_rejects_remote_binding_without_remote_secure_transport(capsys, monkeypatch):
    calls = {}

    def fake_run(app, host, port):
        calls["host"] = host

    monkeypatch.setattr("uvicorn.run", fake_run)

    code = web_api_command(
        SimpleNamespace(
            host="0.0.0.0",
            port=8765,
            no_docs=True,
            dataset_root=[],
        )
    )

    assert code == 1
    assert calls == {}
    assert "remote Web Studio binding requires remote_secure mode" in capsys.readouterr().out


def test_web_api_accepts_dataset_root_option(tmp_path, monkeypatch):
    calls = {}

    def fake_run(app, host, port):
        calls["app"] = app

    monkeypatch.setattr("uvicorn.run", fake_run)

    code = web_api_command(
        SimpleNamespace(
            host="127.0.0.1",
            port=8765,
            no_docs=True,
            dataset_root=[f"workspace={tmp_path}"],
        )
    )

    assert code == 0
    assert calls["app"].state.web_config.dataset_roots[0].name == "workspace"
