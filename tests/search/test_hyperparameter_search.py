import json
import math
import random
from pathlib import Path

import pytest
import torch

from arclm.peft import LoRAConfig, apply_lora, is_lora_model
from arclm.search import (
    ChoiceParameter,
    FailurePolicy,
    FloatParameter,
    HyperparameterSearchConfig,
    IntegerParameter,
    ObjectiveConfig,
    SearchError,
    SearchSpace,
    SearchStorageConfig,
    SearchStatus,
    SearchStrategy,
    TrialStatus,
    compare_trials,
    create_search,
    inspect_search,
    list_searches,
    load_search,
    validate_search,
)
from arclm.tracking import validate_run
from arclm.training import Trainer, TrainingConfig
from tests.unit.training._helpers import TinyTokenDataset, TinyTokenModel


def _storage_root(tmp_path: Path) -> Path:
    return tmp_path / "searches"


def _training_config(tmp_path: Path) -> TrainingConfig:
    return TrainingConfig(
        epochs=1,
        batch_size=1,
        learning_rate=0.01,
        output_dir=str(tmp_path / "training-output"),
        save_every_steps=0,
        keep_last_checkpoints=0,
        log_every_steps=0,
        shuffle=False,
    )


def _search_config(
    tmp_path: Path,
    *,
    search_space: SearchSpace | None = None,
    strategy: SearchStrategy = SearchStrategy.GRID,
    trial_count: int | None = None,
    failure_policy: FailurePolicy = FailurePolicy.CONTINUE,
    lora_config: LoRAConfig | None = None,
) -> HyperparameterSearchConfig:
    return HyperparameterSearchConfig(
        search_space=search_space
        or SearchSpace(
            {
                "training.batch_size": ChoiceParameter((1, 2)),
                "training.learning_rate": ChoiceParameter((0.01, 0.02)),
            }
        ),
        objective=ObjectiveConfig(metric="loss", direction="minimize"),
        strategy=strategy,
        trial_count=trial_count,
        seed=123,
        max_trials=12,
        failure_policy=failure_policy,
        base_training_config=_training_config(tmp_path),
        lora_config=lora_config,
        storage=SearchStorageConfig(root_directory=_storage_root(tmp_path)),
        name="search smoke",
    )


def _run_tiny_training(context):
    values = dict(context.training_config.to_dict())
    values["output_dir"] = str(Path(values["output_dir"]) / context.trial_id)
    trainer = Trainer(
        model=TinyTokenModel(),
        train_dataset=TinyTokenDataset(size=3),
        validation_dataset=TinyTokenDataset(size=2),
        config=TrainingConfig.from_dict(values),
    )
    before = [parameter.detach().clone() for parameter in trainer.model.parameters()]
    state = trainer.train()
    metrics = trainer.evaluate()
    context.run.record_model(trainer.model)
    assert state.global_step > 0
    assert any(
        not torch.equal(old, new.detach())
        for old, new in zip(before, trainer.model.parameters())
    )
    return {"loss": float(metrics["loss"]), "token_accuracy": float(metrics["token_accuracy"])}


def test_parameter_space_validation_and_round_trip():
    space = SearchSpace(
        {
            "training.learning_rate": FloatParameter(0.001, 0.01, sampling="log", grid_size=3),
            "training.batch_size": IntegerParameter(1, 3),
            "lora.rank": ChoiceParameter((2, 4)),
        }
    )

    restored = SearchSpace.from_dict(space.to_dict())

    assert restored.estimate_grid_size() == 18
    assert restored.parameter_paths() == (
        "lora.rank",
        "training.batch_size",
        "training.learning_rate",
    )
    with pytest.raises(SearchError, match="not approved"):
        SearchSpace({"training.output_dir": ChoiceParameter(("private",))})
    with pytest.raises(SearchError, match="callables"):
        ChoiceParameter((lambda: None,))
    with pytest.raises(SearchError, match="positive"):
        FloatParameter(0.0, 1.0, sampling="log")


def test_grid_search_plans_deterministic_trials(tmp_path):
    search = create_search(_search_config(tmp_path))
    try:
        trials = search.trials()
    finally:
        search.close()

    assert [trial.trial_index for trial in trials] == [0, 1, 2, 3]
    assert [trial.status for trial in trials] == [TrialStatus.PENDING.value] * 4
    assert trials[0].overrides == {"training.batch_size": 1, "training.learning_rate": 0.01}
    assert trials[-1].overrides == {"training.batch_size": 2, "training.learning_rate": 0.02}
    assert all(trial.fingerprint.startswith("trialfp_") for trial in trials)
    assert validate_search(_storage_root(tmp_path) / search.manifest.search_id).planned_trials == 4


def test_random_search_is_seeded_and_does_not_mutate_global_rng(tmp_path):
    space = SearchSpace(
        {
            "training.batch_size": ChoiceParameter((1, 2, 3)),
            "training.learning_rate": FloatParameter(0.001, 0.01, grid_size=5),
        }
    )
    random.seed(999)
    state = random.getstate()
    first = create_search(
        _search_config(
            tmp_path / "a",
            search_space=space,
            strategy=SearchStrategy.RANDOM,
            trial_count=4,
        )
    )
    first_overrides = [trial.overrides for trial in first.trials()]
    first.close()
    assert random.getstate() == state

    second = create_search(
        _search_config(
            tmp_path / "b",
            search_space=space,
            strategy=SearchStrategy.RANDOM,
            trial_count=4,
        )
    )
    second_overrides = [trial.overrides for trial in second.trials()]
    second.close()

    assert second_overrides == first_overrides


def test_search_executes_real_cpu_training_records_runs_and_best_config(tmp_path):
    search = create_search(_search_config(tmp_path))
    try:
        result = search.execute(_run_tiny_training)
        info = inspect_search(search.search_dir)
        comparison = compare_trials(search.search_dir)
        exported = result.save_best_config(tmp_path / "best-config.json")
    finally:
        search.close()

    assert info.status == SearchStatus.COMPLETED.value
    assert info.completed_trials == 4
    assert info.failed_trials == 0
    assert result.best_trial is not None
    assert math.isfinite(result.best_trial.objective_value)
    assert comparison.best_trial_id == result.best_trial.trial_id
    assert len(comparison.trial_ids) == 4
    assert len(comparison.values) == 4
    assert exported.exists()
    payload = json.loads(exported.read_text(encoding="utf-8"))
    assert payload["training"]["output_dir"].endswith("training-output")

    for trial in load_search(search.search_dir).trials():
        run_info = validate_run(search.search_dir / trial.run_path)
        assert run_info.status == "completed"
        assert run_info.metric_count >= 1


def test_search_resume_skips_completed_trials(tmp_path):
    calls: list[str] = []
    search = create_search(
        _search_config(
            tmp_path,
            search_space=SearchSpace({"training.learning_rate": ChoiceParameter((0.01, 0.02))}),
        )
    )
    search.execute(lambda context: calls.append(context.trial_id) or {"loss": 1.0}, max_trials=1)
    search_dir = search.search_dir
    search.close()

    resumed = load_search(search_dir)
    try:
        resumed.execute(lambda context: calls.append(context.trial_id) or {"loss": 0.5})
        info = validate_search(search_dir)
    finally:
        resumed.close()

    assert info.status == SearchStatus.COMPLETED.value
    assert len(calls) == 2
    assert len(set(calls)) == 2


def test_failure_policy_continue_and_stop(tmp_path):
    continue_search = create_search(
        _search_config(
            tmp_path / "continue",
            search_space=SearchSpace({"training.learning_rate": ChoiceParameter((0.01, 0.02))}),
        )
    )
    seen = 0

    def fail_once(_context):
        nonlocal seen
        seen += 1
        if seen == 1:
            raise RuntimeError("trial boom")
        return {"loss": 1.0}

    continue_search.execute(fail_once)
    continue_info = inspect_search(continue_search.search_dir)
    continue_search.close()

    stop_search = create_search(
        _search_config(
            tmp_path / "stop",
            search_space=SearchSpace({"training.learning_rate": ChoiceParameter((0.01, 0.02))}),
            failure_policy=FailurePolicy.STOP,
        )
    )
    stop_search.execute(lambda _context: (_ for _ in ()).throw(RuntimeError("stop boom")))
    stop_info = inspect_search(stop_search.search_dir)
    stop_search.close()

    assert continue_info.status == SearchStatus.COMPLETED.value
    assert continue_info.failed_trials == 1
    assert continue_info.completed_trials == 1
    assert stop_info.status == SearchStatus.FAILED.value
    assert stop_info.failed_trials == 1
    assert stop_info.completed_trials == 0


def test_failed_trial_retry_is_bounded_to_one_retry(tmp_path):
    search = create_search(
        _search_config(
            tmp_path,
            search_space=SearchSpace({"training.learning_rate": ChoiceParameter((0.01,))}),
        )
    )
    calls = 0

    def always_fail(_context):
        nonlocal calls
        calls += 1
        raise RuntimeError("still failing")

    try:
        search.execute(always_fail)
        search.execute(always_fail, retry_failed=True)
        search.execute(always_fail, retry_failed=True)
        trial = search.trials()[0]
    finally:
        search.close()

    assert calls == 2
    assert trial.status == TrialStatus.FAILED.value
    assert trial.attempt == 2
    assert trial.retry_count == 1


def test_lora_overrides_are_materialized_in_trial_context(tmp_path):
    search = create_search(
        _search_config(
            tmp_path,
            search_space=SearchSpace({"lora.rank": ChoiceParameter((2,))}),
            lora_config=LoRAConfig(rank=4, target_modules=("head",), target_match="leaf"),
        )
    )

    def runner(context):
        assert context.lora_config is not None
        assert context.lora_config.rank == 2
        model = TinyTokenModel()
        apply_lora(model, context.lora_config)
        assert is_lora_model(model)
        values = context.training_config.to_dict()
        values["output_dir"] = str(Path(values["output_dir"]) / context.trial_id)
        trainer = Trainer(
            model=model,
            train_dataset=TinyTokenDataset(size=3),
            validation_dataset=TinyTokenDataset(size=2),
            config=TrainingConfig.from_dict(values),
        )
        state = trainer.train()
        metrics = trainer.evaluate()
        assert state.global_step > 0
        return {"loss": float(metrics["loss"])}

    try:
        search.execute(runner)
        trial = search.trials()[0]
    finally:
        search.close()

    assert trial.effective_config["lora"]["rank"] == 2


def test_validation_detects_missing_trial_run_reference(tmp_path):
    search = create_search(
        _search_config(
            tmp_path,
            search_space=SearchSpace({"training.learning_rate": ChoiceParameter((0.01,))}),
        )
    )
    try:
        search.execute(lambda _context: {"loss": 1.0})
        trial = search.trials()[0]
        assert trial.run_path is not None
        (search.search_dir / trial.run_path).rename(search.search_dir / "missing-run")
        with pytest.raises(SearchError, match="run reference is missing"):
            validate_search(search.search_dir)
    finally:
        search.close()


def test_list_searches_and_duplicate_search_id_protection(tmp_path):
    config = _search_config(tmp_path)
    first = create_search(config)
    search_id = first.manifest.search_id
    first.close()

    listed = list_searches(_storage_root(tmp_path))

    assert [item.search_id for item in listed] == [search_id]
    with pytest.raises(SearchError, match="already exists"):
        create_search(
            HyperparameterSearchConfig(
                search_space=config.search_space,
                objective=config.objective,
                base_training_config=config.base_training_config,
                storage=config.storage,
                search_id=search_id,
            )
        )
