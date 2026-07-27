import time

from fastapi.testclient import TestClient

from arclm.web import WebConfig, create_app


def _client(tmp_path):
    return TestClient(create_app(WebConfig(workspace_root=tmp_path / "studio", max_evaluation_examples=16, max_generation_new_tokens=16)))


def _project(client):
    response = client.post("/api/projects", json={"name": "Studio 3", "description": "Native checkpoint use."})
    assert response.status_code == 200, response.text
    return response.json()


def _dataset(client, project_id, suffix=""):
    response = client.post(
        f"/api/projects/{project_id}/datasets/paste",
        json={
            "name": f"training-data{suffix}",
            "stored_format": "jsonl",
            "selected_format": "instruction_response",
            "text_fields": ["instruction", "response"],
            "content": (
                '{"instruction":"Explain ArcLM.","response":"ArcLM is native and small."}\n'
                '{"instruction":"Explain tokens.","response":"Tokens become ids."}\n'
                '{"instruction":"Explain checkpoints.","response":"Checkpoints reload state."}\n'
            ),
        },
    )
    assert response.status_code == 200, response.text
    return response.json()


def _tokenizer(client, project_id, dataset_id):
    response = client.post(
        f"/api/projects/{project_id}/tokenizers/native",
        json={"name": "tok", "dataset_id": dataset_id, "max_vocab": 48, "text_fields": ["instruction", "response"]},
    )
    assert response.status_code == 200, response.text
    return response.json()


def _model(client, project_id, dataset_id, tokenizer):
    response = client.post(
        f"/api/projects/{project_id}/models/native",
        json={
            "name": "tiny",
            "dataset_id": dataset_id,
            "tokenizer_id": tokenizer["id"],
            "configuration": {"vocab_size": tokenizer["vocab_size"], "embed_dim": 8, "block_size": 8, "num_blocks": 1, "dropout": 0.0},
        },
    )
    assert response.status_code == 200, response.text
    return response.json()


def _wait_run(client, project_id, run_id, timeout=20):
    deadline = time.time() + timeout
    while time.time() < deadline:
        response = client.get(f"/api/projects/{project_id}/runs/{run_id}")
        assert response.status_code == 200, response.text
        run = response.json()
        if run["status"] in {"completed", "failed", "cancelled", "interrupted"}:
            return run
        time.sleep(0.05)
    raise AssertionError("run did not finish")


def _wait_evaluation(client, project_id, evaluation_id, timeout=20):
    deadline = time.time() + timeout
    while time.time() < deadline:
        response = client.get(f"/api/projects/{project_id}/evaluations/{evaluation_id}")
        assert response.status_code == 200, response.text
        evaluation = response.json()["evaluation"]
        if evaluation["status"] in {"completed", "failed", "cancelled", "interrupted"}:
            return evaluation
        time.sleep(0.05)
    raise AssertionError("evaluation did not finish")


def _trained_checkpoint(client, tmp_path):
    project = _project(client)
    dataset = _dataset(client, project["id"])
    tokenizer = _tokenizer(client, project["id"], dataset["id"])
    model = _model(client, project["id"], dataset["id"], tokenizer)
    response = client.post(
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
    assert response.status_code == 200, response.text
    run = _wait_run(client, project["id"], response.json()["id"])
    assert run["status"] == "completed", run
    checkpoints = client.get(f"/api/projects/{project['id']}/checkpoints")
    assert checkpoints.status_code == 200, checkpoints.text
    checkpoint = checkpoints.json()["checkpoints"][0]
    assert str(tmp_path) not in str(checkpoint)
    return project, dataset, tokenizer, model, run, checkpoint


def test_project_wide_checkpoint_validate_delete_and_security(tmp_path):
    client = _client(tmp_path)
    project, _, _, _, _, checkpoint = _trained_checkpoint(client, tmp_path)

    detail = client.get(f"/api/projects/{project['id']}/checkpoints/{checkpoint['id']}")
    assert detail.status_code == 200, detail.text
    assert detail.json()["checkpoint"]["reload_status"] == "compatible"

    validation = client.post(f"/api/projects/{project['id']}/checkpoints/{checkpoint['id']}/validate")
    assert validation.status_code == 200, validation.text
    assert validation.json()["valid"] is True

    bad = client.get(f"/api/projects/{project['id']}/checkpoints/%2e%2e%2fsecret")
    assert bad.status_code == 404

    rejected = client.request(
        "DELETE",
        f"/api/projects/{project['id']}/checkpoints/{checkpoint['id']}",
        json={"confirm": True, "checkpoint_name": "wrong"},
    )
    assert rejected.status_code == 400
    deleted = client.request(
        "DELETE",
        f"/api/projects/{project['id']}/checkpoints/{checkpoint['id']}",
        json={"confirm": True, "checkpoint_name": checkpoint["name"]},
    )
    assert deleted.status_code == 200


def test_evaluation_generation_history_and_checkpoint_inspection(tmp_path):
    client = _client(tmp_path)
    project, dataset, tokenizer, _, _, checkpoint = _trained_checkpoint(client, tmp_path)

    created = client.post(
        f"/api/projects/{project['id']}/evaluations",
        json={
            "checkpoint_id": checkpoint["id"],
            "dataset_id": dataset["id"],
            "tokenizer_id": tokenizer["id"],
            "batch_size": 1,
            "maximum_sequence_length": 8,
            "maximum_examples": 2,
            "device": "cpu",
            "precision": "fp32",
            "selected_metrics": ["loss", "perplexity", "accuracy"],
        },
    )
    assert created.status_code == 200, created.text
    evaluation = _wait_evaluation(client, project["id"], created.json()["evaluation"]["id"])
    assert evaluation["status"] == "completed", evaluation
    report = client.get(f"/api/projects/{project['id']}/evaluations/{evaluation['id']}/report")
    assert report.status_code == 200, report.text
    assert "loss" in report.json()["report"]["metrics"]

    comparison = client.post(
        f"/api/projects/{project['id']}/evaluations/compare",
        json={"evaluation_ids": [evaluation["id"]]},
    )
    assert comparison.status_code == 200
    assert comparison.json()["compatible"] is True
    assert "evaluation_id" in comparison.json()["csv"]

    generation = client.post(
        f"/api/projects/{project['id']}/generations",
        json={"checkpoint_id": checkpoint["id"], "prompt": "Explain ArcLM.", "max_new_tokens": 2, "device": "cpu"},
    )
    assert generation.status_code == 200, generation.text
    assert generation.json()["generation"]["generated_text"]
    assert client.get(f"/api/projects/{project['id']}/generations").json()["count"] == 1

    inspection = client.post(
        f"/api/projects/{project['id']}/checkpoints/{checkpoint['id']}/inspect",
        json={"text": "Explain ArcLM.", "include_values": False, "max_values": 5},
    )
    assert inspection.status_code == 200, inspection.text
    assert inspection.json()["input_text"] == "Explain ArcLM."


def test_studio3_validation_errors_and_bounds(tmp_path):
    client = _client(tmp_path)
    project, dataset, tokenizer, _, _, checkpoint = _trained_checkpoint(client, tmp_path)
    other_dataset = _dataset(client, project["id"], suffix="-other")
    other_tokenizer = _tokenizer(client, project["id"], other_dataset["id"])

    mismatch = client.post(
        f"/api/projects/{project['id']}/evaluations",
        json={
            "checkpoint_id": checkpoint["id"],
            "dataset_id": dataset["id"],
            "tokenizer_id": other_tokenizer["id"],
            "maximum_examples": 1,
        },
    )
    assert mismatch.status_code == 400
    assert mismatch.json()["error"]["code"] == "evaluation_tokenizer_mismatch"

    too_many_examples = client.post(
        f"/api/projects/{project['id']}/evaluations",
        json={
            "checkpoint_id": checkpoint["id"],
            "dataset_id": dataset["id"],
            "tokenizer_id": tokenizer["id"],
            "maximum_examples": 999,
        },
    )
    assert too_many_examples.status_code == 400

    empty_prompt = client.post(
        f"/api/projects/{project['id']}/generations",
        json={"checkpoint_id": checkpoint["id"], "prompt": "   "},
    )
    assert empty_prompt.status_code == 400
    assert empty_prompt.json()["error"]["code"] == "generation_prompt_empty"

    too_many_tokens = client.post(
        f"/api/projects/{project['id']}/generations",
        json={"checkpoint_id": checkpoint["id"], "prompt": "Explain ArcLM.", "max_new_tokens": 99},
    )
    assert too_many_tokens.status_code == 400

    no_cuda = client.post(
        f"/api/projects/{project['id']}/generations",
        json={"checkpoint_id": checkpoint["id"], "prompt": "Explain ArcLM.", "device": "cuda"},
    )
    if no_cuda.status_code != 200:
        assert no_cuda.json()["error"]["code"] == "generation_configuration_invalid"
