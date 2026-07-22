import pytest
from fastapi.testclient import TestClient

from arclm.web import WebConfig, create_app


def _client(tmp_path):
    return TestClient(create_app(WebConfig(workspace_root=tmp_path / "studio")))


def _project(client):
    response = client.post(
        "/api/projects",
        json={"name": "Arabic Tiny LM", "description": "Small local project."},
    )
    assert response.status_code == 200, response.text
    return response.json()


def _dataset(client, project_id):
    response = client.post(
        f"/api/projects/{project_id}/datasets/paste",
        json={
            "name": "training-data",
            "stored_format": "jsonl",
            "selected_format": "instruction_response",
            "text_fields": ["instruction", "response"],
            "content": (
                '{"instruction":"Explain tokenization.","response":"Tokenization makes tokens."}\n'
                '{"instruction":"Explain checkpoints.","response":"Checkpoints save state."}\n'
            ),
        },
    )
    assert response.status_code == 200, response.text
    return response.json()


def test_project_crud_and_delete_confirmation(tmp_path):
    client = _client(tmp_path)

    project = _project(client)
    project_id = project["id"]

    listing = client.get("/api/projects").json()
    assert listing["count"] == 1
    assert listing["projects"][0]["name"] == "Arabic Tiny LM"
    assert "workspace" not in str(listing).lower()

    read = client.get(f"/api/projects/{project_id}")
    assert read.status_code == 200

    updated = client.patch(
        f"/api/projects/{project_id}",
        json={"name": "Arabic Tiny LM v2", "description": "Updated."},
    )
    assert updated.status_code == 200
    assert updated.json()["name"] == "Arabic Tiny LM v2"

    rejected = client.request(
        "DELETE",
        f"/api/projects/{project_id}",
        json={"confirm": True, "confirm_name": "wrong"},
    )
    assert rejected.status_code == 400

    deleted = client.request(
        "DELETE",
        f"/api/projects/{project_id}",
        json={"confirm": True, "confirm_name": "Arabic Tiny LM v2"},
    )
    assert deleted.status_code == 200
    assert client.get(f"/api/projects/{project_id}").status_code == 404


def test_project_ids_reject_traversal_and_encoded_traversal(tmp_path):
    client = _client(tmp_path)

    for bad_id in ("../secret", "%2e%2e%2fsecret", "project_../../evil", "project_123"):
        response = client.get(f"/api/projects/{bad_id}")
        assert response.status_code == 404
        assert response.json()["error"]["code"] in {"project_not_found", "not_found"}


def test_system_status_is_safe_and_counts_workspace(tmp_path):
    client = _client(tmp_path)
    _project(client)

    response = client.get("/api/system/status")

    assert response.status_code == 200
    data = response.json()
    assert data["arclm_version"]
    assert data["python_version"]
    assert data["backend_health"]["status"] == "ok"
    assert data["workspace"]["project_count"] == 1
    assert "transformers" in data["optional_dependencies"]
    assert "HOME" not in str(data)
    assert str(tmp_path) not in str(data)


def test_dataset_paste_preview_validation_report_and_deletion(tmp_path):
    client = _client(tmp_path)
    project = _project(client)
    dataset = _dataset(client, project["id"])

    listing = client.get(f"/api/projects/{project['id']}/datasets").json()
    assert listing["count"] == 1
    assert listing["datasets"][0]["record_count"] == 2
    assert "raw_filename" in listing["datasets"][0]
    assert str(tmp_path) not in str(listing)

    preview = client.get(
        f"/api/projects/{project['id']}/datasets/{dataset['id']}/preview",
        params={"limit": 1},
    )
    assert preview.status_code == 200
    assert preview.json()["preview_limit"] == 1
    assert preview.json()["truncated"] is True
    assert preview.json()["records"][0]["index"] == 0

    validation = client.post(
        f"/api/projects/{project['id']}/datasets/{dataset['id']}/validate",
        json={
            "selected_format": "instruction_response",
            "text_fields": ["instruction", "response"],
            "strict": False,
        },
    )
    assert validation.status_code == 200
    assert validation.json()["validation"]["valid_count"] == 2
    assert validation.json()["dataset"]["validation_status"] == "valid"

    report = client.post(f"/api/projects/{project['id']}/datasets/{dataset['id']}/report")
    assert report.status_code == 200
    assert report.json()["manifest"]["source_type"] == "paste"
    assert report.json()["report"]["token_count"] > 0

    assert client.get(f"/api/projects/{project['id']}/datasets/{dataset['id']}/manifest").status_code == 200
    assert client.get(f"/api/projects/{project['id']}/datasets/{dataset['id']}/report").status_code == 200

    rejected = client.request(
        "DELETE",
        f"/api/projects/{project['id']}/datasets/{dataset['id']}",
        json={"confirm": False},
    )
    assert rejected.status_code == 400

    deleted = client.request(
        "DELETE",
        f"/api/projects/{project['id']}/datasets/{dataset['id']}",
        json={"confirm": True},
    )
    assert deleted.status_code == 200


def test_dataset_upload_formats_limits_parse_errors_and_filename_sanitization(tmp_path):
    client = _client(tmp_path)
    project = _project(client)

    cases = [
        ("json", "bad/../safe.json", '[{"text":"hello"}]'),
        ("csv", "data.csv", "text\nhello\n"),
        ("txt", "notes.txt", "hello\nworld\n"),
    ]
    for stored_format, filename, content in cases:
        response = client.post(
            f"/api/projects/{project['id']}/datasets/upload",
            json={
                "name": f"{stored_format}-data",
                "original_filename": filename,
                "stored_format": stored_format,
                "selected_format": "plain_text",
                "text_fields": ["text"],
                "content": content,
            },
        )
        assert response.status_code == 200, response.text
        assert "/" not in response.json()["raw_filename"]
        assert "\\" not in response.json()["raw_filename"]

    unsupported = client.post(
        f"/api/projects/{project['id']}/datasets/upload",
        json={
            "name": "binary",
            "original_filename": "data.exe",
            "selected_format": "plain_text",
            "text_fields": ["text"],
            "content": "x",
        },
    )
    assert unsupported.status_code == 415

    malformed = client.post(
        f"/api/projects/{project['id']}/datasets/upload",
        json={
            "name": "bad-jsonl",
            "original_filename": "bad.jsonl",
            "stored_format": "jsonl",
            "selected_format": "plain_text",
            "text_fields": ["text"],
            "content": '{"text": "ok"}\nnot-json\n',
        },
    )
    assert malformed.status_code == 400

    small_limit_client = TestClient(
        create_app(WebConfig(workspace_root=tmp_path / "small", max_paste_size=5))
    )
    small_project = _project(small_limit_client)
    too_large = small_limit_client.post(
        f"/api/projects/{small_project['id']}/datasets/paste",
        json={
            "name": "large",
            "stored_format": "txt",
            "content": "too large",
            "selected_format": "plain_text",
            "text_fields": ["text"],
        },
    )
    assert too_large.status_code == 413


def test_dataset_validation_issues_are_returned(tmp_path):
    client = _client(tmp_path)
    project = _project(client)
    response = client.post(
        f"/api/projects/{project['id']}/datasets/paste",
        json={
            "name": "invalid-sft",
            "stored_format": "jsonl",
            "selected_format": "instruction_response",
            "text_fields": ["instruction", "response"],
            "content": '{"instruction":"Explain."}\n{"instruction":"","response":"No."}\n',
        },
    )
    assert response.status_code == 200
    dataset = response.json()

    validation = client.post(
        f"/api/projects/{project['id']}/datasets/{dataset['id']}/validate",
        json={
            "selected_format": "instruction_response",
            "text_fields": ["instruction", "response"],
            "strict": False,
        },
    ).json()

    assert validation["validation"]["invalid_count"] == 2
    codes = {issue["code"] for issue in validation["validation"]["issues"]}
    assert {"missing_field", "empty_value"} <= codes


def test_native_tokenizer_creation_inspection_and_delete(tmp_path):
    client = _client(tmp_path)
    project = _project(client)
    dataset = _dataset(client, project["id"])

    created = client.post(
        f"/api/projects/{project['id']}/tokenizers/native",
        json={
            "name": "native-tokenizer",
            "dataset_id": dataset["id"],
            "max_vocab": 32,
            "text_fields": ["instruction", "response"],
        },
    )
    assert created.status_code == 200, created.text
    tokenizer = created.json()
    assert tokenizer["type"] == "native"
    assert tokenizer["vocab_size"] > 1
    assert str(tmp_path) not in str(tokenizer)

    listing = client.get(f"/api/projects/{project['id']}/tokenizers").json()
    assert listing["count"] == 1

    inspection = client.post(
        f"/api/projects/{project['id']}/tokenizers/{tokenizer['id']}/inspect",
        json={"text": "Explain tokenization."},
    )
    assert inspection.status_code == 200
    data = inspection.json()
    assert data["token_count"] >= 1
    assert data["tokenizer_class"] == "Tokenizer"
    assert "token_ids" in data

    too_long = client.post(
        f"/api/projects/{project['id']}/tokenizers/{tokenizer['id']}/inspect",
        json={"text": "x" * 20001},
    )
    assert too_long.status_code == 413

    deleted = client.request(
        "DELETE",
        f"/api/projects/{project['id']}/tokenizers/{tokenizer['id']}",
        json={"confirm": True},
    )
    assert deleted.status_code == 200
    assert client.get(f"/api/projects/{project['id']}/tokenizers/{tokenizer['id']}").status_code == 404
