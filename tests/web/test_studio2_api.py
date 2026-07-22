import time

from fastapi.testclient import TestClient

from arclm.web import WebConfig, create_app


def _client(tmp_path):
    return TestClient(create_app(WebConfig(workspace_root=tmp_path / "studio")))


def _project(client, name="Studio 2"):
    response = client.post("/api/projects", json={"name": name, "description": "Native training."})
    assert response.status_code == 200, response.text
    return response.json()


def _dataset(client, project_id, *, records=3):
    lines = [
        f'{{"instruction":"Explain tokenization {index}.","response":"Tokenization creates IDs {index}."}}'
        for index in range(records)
    ]
    response = client.post(
        f"/api/projects/{project_id}/datasets/paste",
        json={
            "name": "training-data",
            "stored_format": "jsonl",
            "selected_format": "instruction_response",
            "text_fields": ["instruction", "response"],
            "content": "\n".join(lines) + "\n",
        },
    )
    assert response.status_code == 200, response.text
    return response.json()


def _tokenizer(client, project_id, dataset_id, name="native-tokenizer", max_vocab=32):
    response = client.post(
        f"/api/projects/{project_id}/tokenizers/native",
        json={"name": name, "dataset_id": dataset_id, "max_vocab": max_vocab, "text_fields": ["instruction", "response"]},
    )
    assert response.status_code == 200, response.text
    return response.json()


def _model(client, project_id, dataset_id, tokenizer, **configuration):
    config = {
        "vocab_size": tokenizer["vocab_size"],
        "embed_dim": 8,
        "block_size": 8,
        "num_blocks": 1,
        "dropout": 0.0,
    }
    config.update(configuration)
    response = client.post(
        f"/api/projects/{project_id}/models/native",
        json={"name": "tiny-model", "dataset_id": dataset_id, "tokenizer_id": tokenizer["id"], "configuration": config},
    )
    assert response.status_code == 200, response.text
    return response.json()


def _wait_run(client, project_id, run_id, timeout=20):
    deadline = time.time() + timeout
    last = None
    while time.time() < deadline:
        response = client.get(f"/api/projects/{project_id}/runs/{run_id}")
        assert response.status_code == 200, response.text
        last = response.json()
        if last["status"] in {"completed", "failed", "cancelled", "interrupted"}:
            return last
        time.sleep(0.05)
    raise AssertionError(f"run did not finish: {last}")


def test_native_model_builder_validation_estimate_and_crud(tmp_path):
    client = _client(tmp_path)
    project = _project(client)
    dataset = _dataset(client, project["id"])
    tokenizer = _tokenizer(client, project["id"], dataset["id"])

    payload = {
        "name": "tiny-model",
        "dataset_id": dataset["id"],
        "tokenizer_id": tokenizer["id"],
        "configuration": {"vocab_size": tokenizer["vocab_size"], "embed_dim": 8, "block_size": 8, "num_blocks": 1, "dropout": 0.0},
    }
    estimate = client.post(f"/api/projects/{project['id']}/models/native/estimate", json=payload)
    assert estimate.status_code == 200, estimate.text
    assert estimate.json()["parameter_count"] > 0
    assert "approximate" in " ".join(estimate.json()["estimated_memory"]["warnings"]).lower()

    model = client.post(f"/api/projects/{project['id']}/models/native", json=payload)
    assert model.status_code == 200, model.text
    model_id = model.json()["id"]
    assert str(tmp_path) not in str(model.json())

    assert client.get(f"/api/projects/{project['id']}/models").json()["count"] == 1
    updated = client.patch(
        f"/api/projects/{project['id']}/models/{model_id}",
        json={"name": "renamed-model"},
    )
    assert updated.status_code == 200
    assert updated.json()["name"] == "renamed-model"

    bad_vocab = dict(payload)
    bad_vocab["configuration"] = {**payload["configuration"], "vocab_size": tokenizer["vocab_size"] + 1}
    rejected = client.post(f"/api/projects/{project['id']}/models/native/validate", json=bad_vocab)
    assert rejected.status_code == 400
    assert rejected.json()["error"]["code"] == "tokenizer_vocab_model_mismatch"

    bad_heads = dict(payload)
    bad_heads["configuration"] = {**payload["configuration"], "num_attention_heads": 2}
    assert client.post(f"/api/projects/{project['id']}/models/native/validate", json=bad_heads).status_code == 400

    deleted = client.request("DELETE", f"/api/projects/{project['id']}/models/{model_id}", json={"confirm": True})
    assert deleted.status_code == 200


def test_dataset_report_requires_and_identifies_explicit_tokenizer(tmp_path):
    client = _client(tmp_path)
    project = _project(client)
    dataset = _dataset(client, project["id"])

    missing = client.post(f"/api/projects/{project['id']}/datasets/{dataset['id']}/report", json={"tokenizer_id": None})
    assert missing.status_code == 400
    assert missing.json()["error"]["code"] == "dataset_tokenizer_required"
    assert client.post(f"/api/projects/{project['id']}/datasets/{dataset['id']}/report").status_code == 200

    tokenizer_a = _tokenizer(client, project["id"], dataset["id"], name="tok-a", max_vocab=8)
    tokenizer_b = _tokenizer(client, project["id"], dataset["id"], name="tok-b", max_vocab=32)

    report_a = client.post(
        f"/api/projects/{project['id']}/datasets/{dataset['id']}/report",
        json={"tokenizer_id": tokenizer_a["id"], "maximum_sequence_length": 4},
    )
    report_b = client.post(
        f"/api/projects/{project['id']}/datasets/{dataset['id']}/report",
        json={"tokenizer_id": tokenizer_b["id"], "maximum_sequence_length": 8},
    )
    assert report_a.status_code == 200, report_a.text
    assert report_b.status_code == 200, report_b.text
    assert report_a.json()["tokenizer"]["id"] == tokenizer_a["id"]
    assert report_b.json()["tokenizer"]["id"] == tokenizer_b["id"]
    assert report_a.json()["report_identity"]["id"] != report_b.json()["report_identity"]["id"]


def test_dataset_record_token_inspection_bounds_unknowns_and_truncation(tmp_path):
    client = _client(tmp_path)
    project = _project(client)
    dataset = _dataset(client, project["id"])
    tokenizer = _tokenizer(client, project["id"], dataset["id"], max_vocab=6)

    response = client.post(
        f"/api/projects/{project['id']}/datasets/{dataset['id']}/inspect",
        json={
            "tokenizer_id": tokenizer["id"],
            "record_indexes": [0],
            "text_fields": ["instruction", "response"],
            "maximum_sequence_length": 2,
            "max_records": 1,
            "max_tokens_per_record": 2,
        },
    )
    assert response.status_code == 200, response.text
    row = response.json()["records"][0]
    assert row["token_count"] >= 2
    assert row["would_be_truncated"] is True
    assert row["unknown_token_count"] >= 0
    assert len(row["token_ids"]) <= 2

    too_many = client.post(
        f"/api/projects/{project['id']}/datasets/{dataset['id']}/inspect",
        json={"tokenizer_id": tokenizer["id"], "record_indexes": list(range(25)), "text_fields": ["instruction"]},
    )
    assert too_many.status_code == 413


def test_native_training_run_completes_metrics_events_and_checkpoint(tmp_path):
    client = _client(tmp_path)
    project = _project(client)
    dataset = _dataset(client, project["id"])
    tokenizer = _tokenizer(client, project["id"], dataset["id"])
    model = _model(client, project["id"], dataset["id"], tokenizer)

    created = client.post(
        f"/api/projects/{project['id']}/runs",
        json={
            "name": "tiny run",
            "dataset_id": dataset["id"],
            "tokenizer_id": tokenizer["id"],
            "model_id": model["id"],
            "epochs": 1,
            "batch_size": 1,
            "learning_rate": 0.001,
            "device": "cpu",
            "precision": "fp32",
            "checkpoint_interval": 1,
            "maximum_sequence_length": 8,
        },
    )
    assert created.status_code == 200, created.text
    run = _wait_run(client, project["id"], created.json()["id"])
    assert run["status"] == "completed", run
    assert run["current_step"] >= 1

    metrics = client.get(f"/api/projects/{project['id']}/runs/{run['id']}/metrics").json()
    assert metrics["count"] >= 1
    assert "training_loss" in metrics["items"][-1]

    events = client.get(f"/api/projects/{project['id']}/runs/{run['id']}/events").json()
    assert events["count"] >= 1

    checkpoints = client.get(f"/api/projects/{project['id']}/runs/{run['id']}/checkpoints")
    assert checkpoints.status_code == 200
    assert checkpoints.json()["count"] >= 1
    checkpoint_id = checkpoints.json()["checkpoints"][0]["id"]
    assert client.get(f"/api/projects/{project['id']}/runs/{run['id']}/checkpoints/{checkpoint_id}").status_code == 200


def test_run_checkpoint_list_tolerates_incomplete_checkpoint_directory(tmp_path):
    client = _client(tmp_path)
    project = _project(client)
    dataset = _dataset(client, project["id"])
    tokenizer = _tokenizer(client, project["id"], dataset["id"])
    model = _model(client, project["id"], dataset["id"], tokenizer)
    workspace = client.app.state.studio_workspace
    run = workspace.create_run_metadata(
        project["id"],
        {
            "dataset_id": dataset["id"],
            "tokenizer_id": tokenizer["id"],
            "model_id": model["id"],
            "epochs": 1,
            "device": "cpu",
        },
    )
    incomplete = tmp_path / "studio" / "projects" / project["id"] / "runs" / run.id / "checkpoints" / "checkpoint-15"
    incomplete.mkdir(parents=True)
    (incomplete / "training.pt").mkdir()

    response = client.get(f"/api/projects/{project['id']}/runs/{run.id}/checkpoints")

    assert response.status_code == 200, response.text
    payload = response.json()
    assert payload["count"] == 1
    assert payload["checkpoints"][0]["id"] == "checkpoint-15"
    assert payload["checkpoints"][0]["reload_compatibility"] == "metadata_incomplete"
    assert payload["checkpoints"][0]["warnings"]


def test_training_validation_mismatch_concurrency_cancel_and_stale_restart(tmp_path):
    client = _client(tmp_path)
    project = _project(client)
    dataset = _dataset(client, project["id"], records=80)
    tokenizer = _tokenizer(client, project["id"], dataset["id"])
    other_tokenizer = _tokenizer(client, project["id"], dataset["id"], name="other", max_vocab=24)
    model = _model(client, project["id"], dataset["id"], tokenizer)

    mismatch = client.post(
        f"/api/projects/{project['id']}/runs",
        json={"dataset_id": dataset["id"], "tokenizer_id": other_tokenizer["id"], "model_id": model["id"], "device": "cpu"},
    )
    assert mismatch.status_code == 400
    assert mismatch.json()["error"]["code"] == "training_tokenizer_model_mismatch"

    running = client.post(
        f"/api/projects/{project['id']}/runs",
        json={
            "name": "cancel-me",
            "dataset_id": dataset["id"],
            "tokenizer_id": tokenizer["id"],
            "model_id": model["id"],
            "epochs": 10,
            "batch_size": 1,
            "learning_rate": 0.001,
            "device": "cpu",
            "maximum_sequence_length": 8,
        },
    )
    assert running.status_code == 200, running.text
    conflict = client.post(
        f"/api/projects/{project['id']}/runs",
        json={"dataset_id": dataset["id"], "tokenizer_id": tokenizer["id"], "model_id": model["id"], "device": "cpu"},
    )
    assert conflict.status_code == 409
    cancelled = client.post(f"/api/projects/{project['id']}/runs/{running.json()['id']}/cancel")
    assert cancelled.status_code == 200
    terminal = _wait_run(client, project["id"], running.json()["id"])
    assert terminal["status"] in {"cancelled", "completed"}

    # Simulate app restart with stale active metadata.
    workspace = client.app.state.studio_workspace
    stale = workspace.create_run_metadata(
        project["id"],
        {"dataset_id": dataset["id"], "tokenizer_id": tokenizer["id"], "model_id": model["id"], "epochs": 1, "device": "cpu"},
    )
    stale.status = "running"
    workspace.write_run(stale)
    restarted = TestClient(create_app(WebConfig(workspace_root=tmp_path / "studio")))
    stale_after = restarted.get(f"/api/projects/{project['id']}/runs/{stale.id}").json()
    assert stale_after["status"] == "interrupted"
