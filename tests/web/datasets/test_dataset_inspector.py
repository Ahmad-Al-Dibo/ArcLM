import csv
import json
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from arclm.exceptions import ConfigurationError
from arclm.web import DatasetRoot, WebConfig, create_app


def isolated_config_path(root: Path) -> Path:
    """Geeft een configpad buiten de datasetroot terug."""
    return root.parent / f"{root.name}-dataset-roots.json"


def make_client(root: Path, **kwargs):
    values = {"dataset_config_path": isolated_config_path(root), **kwargs}
    config = WebConfig(dataset_roots=(DatasetRoot(name="workspace", path=root),), **values)
    return TestClient(create_app(config))


def dataset_id_for(client: TestClient, name: str) -> str:
    response = client.get("/api/datasets")
    assert response.status_code == 200
    for item in response.json()["datasets"]:
        if item["name"] == name:
            return item["dataset_id"]
    raise AssertionError(f"Dataset was not listed: {name}")


def test_empty_catalogue_returns_empty_list(tmp_path):
    response = make_client(tmp_path).get("/api/datasets")

    assert response.status_code == 200
    assert response.json() == {"datasets": [], "count": 0}


def test_empty_isolated_catalogue_ignores_simulated_user_config(tmp_path, monkeypatch):
    user_root = tmp_path / "user-root"
    user_root.mkdir()
    (user_root / "leaked.jsonl").write_text('{"text": "should not appear"}\n', encoding="utf-8")
    user_config_dir = tmp_path / "user-config"
    user_config_dir.mkdir()
    user_config = user_config_dir / "dataset-roots.json"
    user_config.write_text(
        json.dumps(
            {
                "version": 1,
                "roots": [
                    {
                        "root_id": "root_userleak",
                        "name": "User Data",
                        "path": str(user_root),
                        "enabled": True,
                        "recursive": False,
                    }
                ],
            }
        ),
        encoding="utf-8",
    )
    monkeypatch.setenv("ARCLM_CONFIG_DIR", str(user_config_dir))

    empty_root = tmp_path / "empty"
    empty_root.mkdir()

    response = make_client(empty_root).get("/api/datasets")

    assert response.json() == {"datasets": [], "count": 0}
    assert "leaked.jsonl" not in response.text
    assert json.loads(user_config.read_text(encoding="utf-8"))["roots"][0]["name"] == "User Data"


def test_repeated_isolated_app_creation_is_deterministic(tmp_path):
    (tmp_path / "data.txt").write_text("same\n", encoding="utf-8")

    first = make_client(tmp_path).get("/api/datasets").json()
    second = make_client(tmp_path).get("/api/datasets").json()

    assert first == second
    assert [item["name"] for item in first["datasets"]] == ["data.txt"]


def test_independent_apps_see_only_their_own_roots(tmp_path):
    root_a = tmp_path / "a"
    root_b = tmp_path / "b"
    root_a.mkdir()
    root_b.mkdir()
    (root_a / "a.jsonl").write_text('{"text": "a"}\n', encoding="utf-8")
    (root_b / "b.jsonl").write_text('{"text": "b"}\n', encoding="utf-8")

    data_a = make_client(root_a).get("/api/datasets").json()
    data_b = make_client(root_b).get("/api/datasets").json()

    assert [item["name"] for item in data_a["datasets"]] == ["a.jsonl"]
    assert [item["name"] for item in data_b["datasets"]] == ["b.jsonl"]


def test_catalogue_lists_supported_files_only_with_safe_ids(tmp_path):
    (tmp_path / "b.txt").write_text("two\n", encoding="utf-8")
    (tmp_path / "a.jsonl").write_text('{"text": "one"}\n', encoding="utf-8")
    (tmp_path / "ignore.pkl").write_bytes(b"not allowed")
    (tmp_path / "folder").mkdir()

    data = make_client(tmp_path).get("/api/datasets").json()

    assert [item["name"] for item in data["datasets"]] == ["a.jsonl", "b.txt"]
    assert data["count"] == 2
    assert all(item["dataset_id"].startswith("dataset_") for item in data["datasets"])
    assert str(tmp_path) not in str(data)


def test_dataset_root_validation_rejects_duplicates_and_missing_path(tmp_path):
    with pytest.raises(ConfigurationError, match="unique"):
        WebConfig(
            dataset_roots=(
                DatasetRoot(name="workspace", path=tmp_path),
                DatasetRoot(name="workspace", path=tmp_path),
            )
        )

    with pytest.raises(ConfigurationError, match="does not exist"):
        WebConfig(dataset_roots=(DatasetRoot(name="workspace", path=tmp_path / "missing"),))


def test_txt_inspection_uses_non_empty_lines_and_bounds_preview(tmp_path):
    path = tmp_path / "notes.txt"
    path.write_text("first\n\nsecond\nthird\n", encoding="utf-8")
    client = make_client(tmp_path)

    response = client.get(f"/api/datasets/{dataset_id_for(client, path.name)}/inspection?preview_rows=2")
    data = response.json()

    assert response.status_code == 200
    assert data["format"] == "txt"
    assert data["fields"][0]["name"] == "text"
    assert data["statistics"]["rows_scanned"] == 3
    assert len(data["preview_rows"]) == 2
    assert data["preview_rows"][0]["values"] == {"text": "first"}
    assert any(warning["code"] == "preview_truncated" for warning in data["warnings"])
    assert str(tmp_path) not in response.text


def test_csv_inspection_reports_fields_missing_values_and_empty_strings(tmp_path):
    path = tmp_path / "rows.csv"
    with path.open("w", encoding="utf-8", newline="") as file:
        writer = csv.DictWriter(file, fieldnames=["text", "label"])
        writer.writeheader()
        writer.writerow({"text": "hello", "label": "positive"})
        writer.writerow({"text": "", "label": "negative"})

    client = make_client(tmp_path)
    data = client.get(f"/api/datasets/{dataset_id_for(client, path.name)}/inspection").json()

    fields = {field["name"]: field for field in data["fields"]}
    assert data["format"] == "csv"
    assert fields["text"]["empty_count"] == 1
    assert fields["label"]["observed_in_rows"] == 2


def test_json_inspection_supports_list_and_records_object(tmp_path):
    list_path = tmp_path / "list.json"
    records_path = tmp_path / "records.json"
    list_path.write_text(json.dumps([{"text": "a"}, {"text": "b"}]), encoding="utf-8")
    records_path.write_text(json.dumps({"records": [{"instruction": "Say", "output": "hi"}]}), encoding="utf-8")
    client = make_client(tmp_path)

    list_data = client.get(f"/api/datasets/{dataset_id_for(client, list_path.name)}/inspection").json()
    records_data = client.get(f"/api/datasets/{dataset_id_for(client, records_path.name)}/inspection").json()

    assert list_data["statistics"]["row_count"] == 2
    assert {field["name"] for field in records_data["fields"]} == {"instruction", "output"}


def test_json_unsupported_shape_returns_safe_error(tmp_path):
    path = tmp_path / "scalar.json"
    path.write_text(json.dumps("hello"), encoding="utf-8")
    client = make_client(tmp_path)

    response = client.get(f"/api/datasets/{dataset_id_for(client, path.name)}/inspection")

    assert response.status_code == 400
    assert response.json()["error"]["code"] == "dataset_shape_invalid"
    assert str(tmp_path) not in response.text


def test_jsonl_inspection_and_malformed_line_error(tmp_path):
    good = tmp_path / "good.jsonl"
    bad = tmp_path / "bad.jsonl"
    good.write_text('{"text": "hello"}\n{"text": "hello"}\n', encoding="utf-8")
    bad.write_text('{"text": "hello"}\n{bad json}\n', encoding="utf-8")
    client = make_client(tmp_path)

    data = client.get(f"/api/datasets/{dataset_id_for(client, good.name)}/inspection").json()
    error = client.get(f"/api/datasets/{dataset_id_for(client, bad.name)}/inspection")

    assert data["statistics"]["duplicate_count"] == 1
    assert error.status_code == 400
    assert error.json()["error"]["code"] == "dataset_shape_invalid"
    assert "{bad json}" not in error.text


def test_inspection_limits_and_truncation_warnings(tmp_path):
    path = tmp_path / "large.jsonl"
    path.write_text(
        "\n".join(json.dumps({"text": f"row {index}"}) for index in range(5)),
        encoding="utf-8",
    )
    client = make_client(tmp_path, max_scan_rows=2, default_preview_rows=2, max_preview_rows=3)
    dataset_id = dataset_id_for(client, path.name)

    limited = client.get(f"/api/datasets/{dataset_id}/inspection?preview_rows=3").json()
    invalid = client.get(f"/api/datasets/{dataset_id}/inspection?preview_rows=4")
    negative = client.get(f"/api/datasets/{dataset_id}/inspection?preview_rows=-1")

    assert limited["metadata"]["truncated"] is True
    assert limited["statistics"]["row_count_scope"] == "bounded_scan"
    assert any(warning["code"] == "scan_limit_reached" for warning in limited["warnings"])
    assert invalid.status_code == 400
    assert invalid.json()["error"]["code"] == "dataset_inspection_limit_invalid"
    assert negative.status_code == 400


def test_long_and_nested_values_are_bounded(tmp_path):
    path = tmp_path / "nested.jsonl"
    path.write_text(
        json.dumps({"text": "x" * 20, "nested": {"a": {"b": {"c": "deep"}}}, "items": list(range(30))}),
        encoding="utf-8",
    )
    client = make_client(tmp_path, max_field_length=5)

    data = client.get(f"/api/datasets/{dataset_id_for(client, path.name)}/inspection").json()

    assert data["preview_rows"][0]["values"]["text"] == "xxxxx"
    assert len(data["preview_rows"][0]["values"]["items"]) == 20
    warning_codes = {warning["code"] for warning in data["warnings"]}
    assert "field_value_truncated" in warning_codes
    assert "unsupported_nested_values" in warning_codes


def test_too_large_file_is_rejected_without_path_leak(tmp_path):
    path = tmp_path / "large.txt"
    path.write_text("hello", encoding="utf-8")
    client = make_client(tmp_path, max_inspection_file_size=1)

    response = client.get(f"/api/datasets/{dataset_id_for(client, path.name)}/inspection")

    assert response.status_code == 413
    assert response.json()["error"]["code"] == "dataset_too_large"
    assert str(tmp_path) not in response.text


def test_invalid_encoding_returns_safe_error(tmp_path):
    path = tmp_path / "bad.txt"
    path.write_bytes(b"\xff\xfe\xff")
    client = make_client(tmp_path)

    response = client.get(f"/api/datasets/{dataset_id_for(client, path.name)}/inspection")

    assert response.status_code == 400
    assert response.json()["error"]["code"] == "dataset_encoding_invalid"
    assert str(tmp_path) not in response.text


def test_unknown_or_path_like_dataset_id_returns_safe_error(tmp_path):
    client = make_client(tmp_path)

    missing = client.get("/api/datasets/dataset_missing/inspection")
    traversal = client.get("/api/datasets/../secret/inspection")
    absolute = client.get("/api/datasets/C:/secret/data.txt/inspection")

    assert missing.status_code == 404
    assert missing.json()["error"]["code"] == "dataset_not_found"
    for response in (traversal, absolute):
        assert response.status_code == 404
        assert "error" in response.json()
        assert "secret" not in response.text


def test_symlink_escape_is_not_listed(tmp_path):
    outside = tmp_path / "outside.txt"
    outside.write_text("private", encoding="utf-8")
    root = tmp_path / "root"
    root.mkdir()
    link = root / "escape.txt"
    try:
        link.symlink_to(outside)
    except OSError as exc:
        pytest.skip(f"Symlink creation is not available: {exc}")

    data = make_client(root).get("/api/datasets").json()

    assert data == {"datasets": [], "count": 0}


def test_inspection_does_not_modify_source_file(tmp_path):
    path = tmp_path / "data.jsonl"
    content = '{"text": "same"}\n'
    path.write_text(content, encoding="utf-8")
    before = path.read_bytes()
    client = make_client(tmp_path)

    response = client.get(f"/api/datasets/{dataset_id_for(client, path.name)}/inspection")

    assert response.status_code == 200
    assert path.read_bytes() == before
    assert path.read_text(encoding="utf-8") == content
