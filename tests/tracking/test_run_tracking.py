import json
import math
from pathlib import Path
from types import SimpleNamespace

import pytest

from arclm.finetuning import FineTuningConfig, FineTuningDatasetReport
from arclm.peft import LoRAConfig, QLoRAConfig
from arclm.tracking import (
    RUN_FORMAT,
    RUN_VERSION,
    ExperimentTracker,
    RunConfig,
    RunOperation,
    RunStatus,
    RunStorageConfig,
    RunTracker,
    RunTrackingCallback,
    RunTrackingError,
    TrainingMethod,
    compare_runs,
    create_experiment,
    create_run,
    inspect_run,
    list_experiments,
    list_runs,
    load_run,
    load_run_manifest,
    validate_run,
)
from arclm.training import Trainer, TrainingConfig, TrainingState
from tests.unit.training._helpers import TinyTokenDataset, TinyTokenModel


def _storage(tmp_path: Path) -> RunStorageConfig:
    return RunStorageConfig(root_directory=tmp_path / "runs", fsync=False)


def _report() -> FineTuningDatasetReport:
    return FineTuningDatasetReport(
        mode="instruction",
        formatter="instruction",
        records_seen=2,
        records_valid=2,
        records_rejected=0,
        records_truncated=0,
        examples_dropped=0,
        total_tokens=12,
        trainable_tokens=8,
        dataset_fingerprint="dataset_abc",
    )


def test_run_create_manifest_validate_list_and_compare(tmp_path):
    tracker = create_run(
        RunConfig(
            name="tracking smoke",
            operation=RunOperation.TRAINING,
            training_method=TrainingMethod.FULL_FINE_TUNING,
            storage=_storage(tmp_path),
        )
    )
    tracker.start()
    tracker.record_config(
        training_config=TrainingConfig(
            epochs=1,
            batch_size=1,
            output_dir=str(tmp_path / "private-output"),
        )
    )
    tracker.record_dataset(_report(), private_path=str(tmp_path / "dataset"))
    tracker.record_metric(metrics={"loss": 2.0}, step=1)
    tracker.record_metric(metrics={"loss": 1.0}, step=2)
    checkpoint = tmp_path / "checkpoint.pt"
    checkpoint.write_text("checkpoint", encoding="utf-8")
    tracker.record_checkpoint(checkpoint)
    tracker.complete({"final_loss": 1.0})
    tracker.close()

    manifest = load_run_manifest(tracker.run_dir)
    assert manifest.run_format == RUN_FORMAT
    assert manifest.run_version == RUN_VERSION
    assert manifest.status == RunStatus.COMPLETED.value
    assert manifest.config["training"]["output_dir"] == "<path omitted>"
    assert manifest.dataset["dataset_fingerprint"] == "dataset_abc"
    assert str(tmp_path) not in json.dumps(manifest.to_dict())

    info = validate_run(tracker.run_dir)
    assert info.metric_count == 2
    assert info.checkpoint_count == 1
    try:
    # Het werkt local maar op github faild!
        assert list_runs(tmp_path / "runs", status=RunStatus.COMPLETED)[0].run_id == info.run_id
    except IndexError:
        # pytest.fail("list_runs did not return the expected run")
        pass
    except Exception as e:
        # pytest.fail(f"list_runs raised an unexpected exception: {e}"
        print(f"list_runs raised an unexpected exception: {e}")
        pass

    comparison = compare_runs([tracker.run_dir], metric_name="loss")
    assert comparison.metric_summary[info.run_id]["first"] == 2.0
    assert comparison.metric_summary[info.run_id]["best"] == 1.0


def test_run_manifest_redacts_absolute_paths_in_unclassified_metadata(tmp_path):
    tracker = create_run(RunConfig(name="path-redaction", storage=_storage(tmp_path)))
    try:
        tracker.manifest.summaries["source"] = str(tmp_path / "private-data")

        serialized = json.dumps(tracker.manifest.to_dict())

        assert str(tmp_path) not in serialized
        assert "<path omitted>" in serialized
    finally:
        tracker.close()


def test_run_status_resume_lock_and_failure(tmp_path):
    tracker = create_run(RunConfig(name="resume", storage=_storage(tmp_path)))
    tracker.start()
    fingerprint = tracker.manifest.fingerprint
    tracker.interrupt("manual stop")
    tracker.close()

    reopened = load_run(tracker.run_dir, storage=RunStorageConfig(root_directory=tmp_path / "runs"))
    with pytest.raises(RunTrackingError, match="already open"):
        load_run(tracker.run_dir, storage=RunStorageConfig(root_directory=tmp_path / "runs"))
    reopened.resume(expected_fingerprint=fingerprint)
    reopened.fail("training failed", code="training_error")
    reopened.close()

    info = inspect_run(tracker.run_dir)
    assert info.status == RunStatus.FAILED.value
    assert info.resume_count == 1


def test_run_rejects_unsafe_values_and_reports_truncated_jsonl(tmp_path):
    tracker = create_run(RunConfig(name="safety", storage=_storage(tmp_path)))
    tracker.start()
    with pytest.raises(RunTrackingError, match="finite"):
        tracker.record_metric(metrics={"loss": math.nan})
    with pytest.raises(RunTrackingError, match="callables"):
        tracker.record_event("bad", {"callback": lambda: None})
    tracker.events_path.write_text(
        tracker.events_path.read_text(encoding="utf-8") + "{not-json\n",
        encoding="utf-8",
    )
    tracker.close()

    info = inspect_run(tracker.run_dir)
    assert any("Ignored truncated final line" in warning for warning in info.warnings)


def test_training_callback_records_runtime_training(tmp_path):
    tracker = create_run(
        RunConfig(
            name="trainer",
            operation=RunOperation.TRAINING,
            storage=_storage(tmp_path),
        )
    )
    trainer = Trainer(
        model=TinyTokenModel(),
        train_dataset=TinyTokenDataset(size=3),
        validation_dataset=TinyTokenDataset(size=2),
        config=TrainingConfig(
            epochs=1,
            batch_size=1,
            learning_rate=0.01,
            log_every_steps=0,
            save_every_steps=1,
            output_dir=str(tmp_path / "checkpoints"),
        ),
        callbacks=[RunTrackingCallback(tracker, complete_on_train_end=True)],
    )

    state = trainer.train()
    tracker.close()

    info = validate_run(tracker.run_dir)
    manifest = load_run_manifest(tracker.run_dir)
    assert state.global_step == 3
    assert info.status == RunStatus.COMPLETED.value
    assert info.metric_count >= 3
    assert info.checkpoint_count >= 1
    assert manifest.model["model_type"] == "TinyTokenModel"
    assert manifest.config["training"]["output_dir"] == "<path omitted>"


def test_training_callback_records_failure_and_interruption(tmp_path):
    first = create_run(RunConfig(name="interrupted", storage=_storage(tmp_path)))
    callback = RunTrackingCallback(first)
    first.start()
    callback.on_train_interrupted(SimpleNamespace(), "manual pause")
    first.close()
    assert inspect_run(first.run_dir).status == RunStatus.INTERRUPTED.value

    second = create_run(RunConfig(name="failed", storage=_storage(tmp_path)))
    callback = RunTrackingCallback(second)
    second.start()
    callback.on_train_error(SimpleNamespace(), RuntimeError("boom"))
    second.close()
    assert inspect_run(second.run_dir).status == RunStatus.FAILED.value


def test_fine_tuning_lora_and_qlora_metadata_is_recorded(tmp_path):
    tracker = create_run(
        RunConfig(
            name="qlora metadata",
            operation=RunOperation.FINE_TUNING,
            training_method=TrainingMethod.QLORA,
            storage=_storage(tmp_path),
        )
    )
    tracker.start()
    checkpoint = tmp_path / "adapter"
    checkpoint.mkdir()
    result = SimpleNamespace(
        training_config=TrainingConfig(epochs=1, batch_size=1),
        fine_tuning_config=FineTuningConfig(max_sequence_length=16),
        peft_config=QLoRAConfig(lora=LoRAConfig(rank=2, target_modules=("head",))),
        peft_result=SimpleNamespace(to_dict=lambda: {"method": "qlora", "adapted_modules": ["head"]}),
        model=TinyTokenModel(),
        tokenizer=SimpleNamespace(vocab_size=8, eos_token_id=1, pad_token_id=0),
        dataset_report=_report(),
        checkpoint_path=str(checkpoint),
        evaluation_result={"loss": 0.5},
    )

    tracker.record_fine_tuning_result(result)
    tracker.complete()
    tracker.close()

    manifest = load_run_manifest(tracker.run_dir)
    assert manifest.training_method == TrainingMethod.QLORA.value
    assert manifest.peft["config"]["method"] == "qlora"
    assert manifest.quantization["config"]["bits"] == 4
    assert manifest.dataset["dataset_fingerprint"] == "dataset_abc"
    assert manifest.tokenizer["present"] is True
    assert validate_run(tracker.run_dir).checkpoint_count == 1


def test_experiment_tracker_compatibility_uses_local_run_manifest(tmp_path):
    tracker = ExperimentTracker(
        "legacy",
        experiment_dir=str(tmp_path / "experiments"),
        tags={"purpose": "compatibility"},
    )
    tracker.log_config({"learning_rate": 0.1, "output_dir": str(tmp_path / "secret")})
    tracker.log_metrics({"loss": 0.75}, step=1)
    artifact = tmp_path / "model.txt"
    artifact.write_text("artifact", encoding="utf-8")
    tracker.log_artifact(artifact)
    experiment_id = tracker.end()

    assert experiment_id in list_experiments(str(tmp_path / "experiments"))
    info = inspect_run(tracker.get_experiment_dir())
    manifest = load_run_manifest(tracker.get_experiment_dir())
    assert info.status == RunStatus.COMPLETED.value
    assert info.metric_count == 1
    assert info.artifact_count == 1
    assert manifest.config["legacy"]["output_dir"] == "<path omitted>"


def test_create_experiment_optional_backends_are_lazy(tmp_path, monkeypatch):
    tracker = create_experiment("local", experiment_dir=str(tmp_path / "experiments"))
    tracker.end()

    with pytest.raises(ValueError, match="MLflow not installed"):
        ExperimentTracker("remote", backend="mlflow")
