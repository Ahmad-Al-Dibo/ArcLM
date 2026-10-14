import json

import pytest

from arclm import ConfigurationError, normalize_device, normalize_precision
from arclm.config import load_arclm_config, migrate_config
from arclm.stability import cli_manifest, stable_api_paths


@pytest.mark.config
def test_typed_config_rejects_unknown_and_resolves_paths(tmp_path):
    data_path = tmp_path / "data.jsonl"
    data_path.write_text('{"text":"hello"}\n', encoding="utf-8")
    config_path = tmp_path / "arclm.json"
    config_path.write_text(
        json.dumps(
            {
                "schema_version": "1",
                "data": {"path": "data.jsonl", "format": "jsonl", "schema": "text"},
                "model": {"name": "gpt2"},
                "unexpected": True,
            }
        ),
        encoding="utf-8",
    )

    with pytest.raises(ConfigurationError, match="unknown field"):
        load_arclm_config(config_path)

    cfg = load_arclm_config(config_path, permissive=True)
    assert cfg.data.path == str(data_path.resolve())


@pytest.mark.config
def test_config_migration_renames_model_source(tmp_path):
    old = tmp_path / "old.json"
    new = tmp_path / "new.json"
    old.write_text(
        json.dumps({"version": "0", "data": {"path": "data.jsonl"}, "model": {"source": "gpt2"}}),
        encoding="utf-8",
    )

    report = migrate_config(old, output=new)

    assert "version -> schema_version" in report.fields_renamed
    assert "model.source -> model.name" in report.fields_renamed
    assert report.config.model.name == "gpt2"
    assert new.exists()


@pytest.mark.config
def test_config_env_expansion_is_explicit(monkeypatch):
    monkeypatch.setenv("ARCLM_TEST_DATA", "data.jsonl")
    raw = {"schema_version": "1", "data": {"path": "${ARCLM_TEST_DATA}"}}

    with pytest.raises(ConfigurationError, match="Environment-variable expansion is disabled"):
        load_arclm_config(raw)
    assert load_arclm_config(raw, allow_env=True).data.path.endswith("data.jsonl")


@pytest.mark.compatibility
def test_stability_manifest_lists_new_stable_api_and_cli_contract():
    stable = stable_api_paths()
    assert "arclm.data.open_dataset" in stable
    assert "arclm.config.ArcLMConfig" in stable
    assert cli_manifest()["arclm data validate"] == "stable"
    assert cli_manifest()["arclm doctor"] == "stable"


def test_config_validation_helpers_are_root_compatible():
    assert normalize_device("auto") in {"cpu", "cuda"}
    assert normalize_precision("torch.float32") == "float32"
    with pytest.raises(ConfigurationError):
        normalize_device("tpu")
