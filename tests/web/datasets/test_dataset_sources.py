import json
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from arclm.exceptions import ConfigurationError
from arclm.web import DatasetRoot, WebConfig, create_app


def make_client(tmp_path: Path, **kwargs):
    config = WebConfig(dataset_config_path=tmp_path / "dataset-roots.json", **kwargs)
    return TestClient(create_app(config))


def add_root(client: TestClient, name: str, path: Path, recursive: bool = False):
    response = client.post(
        "/api/dataset-roots",
        json={"name": name, "path": str(path), "recursive": recursive},
    )
    assert response.status_code == 200, response.text
    return response.json()


def test_dataset_roots_start_empty(tmp_path):
    response = make_client(tmp_path).get("/api/dataset-roots")

    assert response.status_code == 200
    assert response.json() == {
        "roots": [],
        "count": 0,
        "active_count": 0,
        "datasets_found": 0,
        "warnings": [],
    }


def test_add_persisted_root_and_catalogue_has_no_paths(tmp_path):
    source = tmp_path / "training"
    source.mkdir()
    (source / "train.jsonl").write_text('{"text": "hello"}\n', encoding="utf-8")
    client = make_client(tmp_path)

    root = add_root(client, "Training Data", source)
    catalogue = client.get("/api/datasets").json()

    assert root["name"] == "Training Data"
    assert root["enabled"] is True
    assert root["recursive"] is False
    assert root["source_origin"] == "persisted"
    assert root["supported_file_count"] == 1
    assert catalogue["count"] == 1
    assert catalogue["datasets"][0]["source_name"] == "Training Data"
    assert str(source) not in str(catalogue)

    reloaded = make_client(tmp_path).get("/api/dataset-roots").json()
    assert reloaded["count"] == 1
    assert reloaded["roots"][0]["name"] == "Training Data"


def test_duplicate_name_and_path_are_rejected(tmp_path):
    one = tmp_path / "one"
    two = tmp_path / "two"
    one.mkdir()
    two.mkdir()
    client = make_client(tmp_path)
    add_root(client, "Training", one)

    duplicate_name = client.post("/api/dataset-roots", json={"name": "Training", "path": str(two)})
    duplicate_path = client.post("/api/dataset-roots", json={"name": "Other", "path": str(one)})

    assert duplicate_name.status_code == 400
    assert duplicate_name.json()["error"]["code"] == "dataset_root_duplicate_name"
    assert duplicate_path.status_code == 400
    assert duplicate_path.json()["error"]["code"] == "dataset_root_duplicate_path"


def test_enable_disable_and_remove_do_not_delete_files(tmp_path):
    source = tmp_path / "training"
    source.mkdir()
    dataset = source / "train.jsonl"
    dataset.write_text('{"text": "hello"}\n', encoding="utf-8")
    client = make_client(tmp_path)
    root = add_root(client, "Training", source)

    disabled = client.patch(f"/api/dataset-roots/{root['root_id']}", json={"enabled": False})
    assert disabled.status_code == 200
    assert client.get("/api/datasets").json()["count"] == 0

    enabled = client.patch(f"/api/dataset-roots/{root['root_id']}", json={"enabled": True})
    assert enabled.status_code == 200
    assert client.get("/api/datasets").json()["count"] == 1

    removed = client.delete(f"/api/dataset-roots/{root['root_id']}")
    assert removed.status_code == 200
    assert dataset.exists()
    assert client.get("/api/datasets").json()["count"] == 0


def test_recursive_scanning_is_opt_in(tmp_path):
    source = tmp_path / "data"
    nested = source / "nested"
    nested.mkdir(parents=True)
    (nested / "corpus.txt").write_text("hello\n", encoding="utf-8")
    client = make_client(tmp_path)
    root = add_root(client, "Data", source, recursive=False)

    assert client.get("/api/datasets").json()["count"] == 0

    response = client.patch(f"/api/dataset-roots/{root['root_id']}", json={"recursive": True})

    assert response.status_code == 200
    assert client.get("/api/datasets").json()["count"] == 1


def test_invalid_paths_are_rejected(tmp_path):
    source_file = tmp_path / "file.txt"
    source_file.write_text("not a root", encoding="utf-8")
    client = make_client(tmp_path)

    relative = client.post("/api/dataset-roots", json={"name": "Relative", "path": "data"})
    missing = client.post("/api/dataset-roots", json={"name": "Missing", "path": str(tmp_path / "missing")})
    file_path = client.post("/api/dataset-roots", json={"name": "File", "path": str(source_file)})
    filesystem_root = client.post("/api/dataset-roots", json={"name": "Root", "path": str(tmp_path.anchor)})

    assert relative.json()["error"]["code"] == "invalid_dataset_root_path"
    assert missing.json()["error"]["code"] == "dataset_root_missing"
    assert file_path.json()["error"]["code"] == "invalid_dataset_root_path"
    assert filesystem_root.json()["error"]["code"] == "invalid_dataset_root_path"


def test_symlink_root_is_rejected(tmp_path):
    target = tmp_path / "target"
    target.mkdir()
    link = tmp_path / "link"
    try:
        link.symlink_to(target, target_is_directory=True)
    except OSError as exc:
        pytest.skip(f"Symlink creation is not available: {exc}")

    response = make_client(tmp_path).post(
        "/api/dataset-roots",
        json={"name": "Link", "path": str(link)},
    )

    assert response.status_code == 400
    assert response.json()["error"]["code"] == "invalid_dataset_root_path"


def test_nested_roots_warn(tmp_path):
    parent = tmp_path / "parent"
    child = parent / "child"
    child.mkdir(parents=True)
    client = make_client(tmp_path)
    add_root(client, "Parent", parent)
    add_root(client, "Child", child)

    roots = client.get("/api/dataset-roots").json()["roots"]

    assert any(
        warning["code"] == "nested_dataset_root"
        for root in roots
        for warning in root["warnings"]
    )


def test_cli_root_merges_as_session_only_and_cannot_be_removed(tmp_path):
    persisted = tmp_path / "persisted"
    session = tmp_path / "session"
    persisted.mkdir()
    session.mkdir()
    (session / "eval.json").write_text('{"text": "hello"}', encoding="utf-8")
    config_path = tmp_path / "dataset-roots.json"
    first_client = TestClient(create_app(WebConfig(dataset_config_path=config_path)))
    add_root(first_client, "Persisted", persisted)

    client = TestClient(
        create_app(
            WebConfig(
                dataset_config_path=config_path,
                dataset_roots=(DatasetRoot(name="cli", path=session),),
            )
        )
    )
    roots = client.get("/api/dataset-roots").json()["roots"]
    session_root = next(root for root in roots if root["source_origin"] == "command_line")
    removed = client.delete(f"/api/dataset-roots/{session_root['root_id']}")

    assert len(roots) == 2
    assert session_root["editable"] is False
    assert removed.status_code == 400
    assert removed.json()["error"]["code"] == "dataset_root_session_only"


def test_non_loopback_server_disables_root_management(tmp_path):
    config = WebConfig(host="0.0.0.0", dataset_config_path=tmp_path / "dataset-roots.json")
    client = TestClient(create_app(config))

    list_response = client.get("/api/dataset-roots")
    add_response = client.post("/api/dataset-roots", json={"name": "Data", "path": str(tmp_path)})

    assert list_response.status_code == 403
    assert add_response.status_code == 403
    assert list_response.json()["error"]["code"] == "dataset_source_management_disabled"


def test_unknown_origin_is_rejected_for_root_management(tmp_path):
    response = make_client(tmp_path).post(
        "/api/dataset-roots",
        headers={"Origin": "http://example.com"},
        json={"name": "Data", "path": str(tmp_path)},
    )

    assert response.status_code == 403
    assert response.json()["error"]["code"] == "dataset_source_origin_rejected"


def test_refresh_summary_counts_enabled_roots(tmp_path):
    source = tmp_path / "data"
    source.mkdir()
    (source / "one.txt").write_text("hello\n", encoding="utf-8")
    client = make_client(tmp_path)
    add_root(client, "Data", source)

    response = client.post("/api/datasets/refresh")

    assert response.status_code == 200
    assert response.json()["roots_scanned"] == 1
    assert response.json()["datasets_found"] == 1


def test_corrupt_config_file_returns_controlled_error(tmp_path):
    config_path = tmp_path / "dataset-roots.json"
    config_path.write_text("{broken", encoding="utf-8")

    with pytest.raises(ConfigurationError, match="corrupt"):
        create_app(WebConfig(dataset_config_path=config_path))


def test_maximum_root_count_is_enforced(tmp_path):
    client = make_client(tmp_path, max_dataset_roots=1)
    one = tmp_path / "one"
    two = tmp_path / "two"
    one.mkdir()
    two.mkdir()
    add_root(client, "One", one)

    response = client.post("/api/dataset-roots", json={"name": "Two", "path": str(two)})

    assert response.status_code == 400
    assert response.json()["error"]["code"] == "dataset_root_limit_reached"
