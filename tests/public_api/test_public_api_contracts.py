import importlib
import os
import subprocess
import sys


def test_documented_domain_imports_are_available():
    imports = {
        "arclm.datasets": ["DataPipeline", "DatasetLoader", "load_dataset"],
        "arclm.training": ["BaseTrainer", "Trainer", "TrainingConfig", "TrainingState"],
        "arclm.evaluation": ["Evaluator", "EvaluationConfig", "Accuracy"],
        "arclm.finetuning": ["SFTTrainer", "SFTConfig", "ModelAdapter"],
        "arclm.inference": ["TextGenerator", "load_model", "predict"],
        "arclm.inspection": ["PipelineTrace", "inspect_text"],
        "arclm.checkpoints": [
            "CheckpointInfo",
            "SmartLoader",
            "inspect_checkpoint",
            "load_external_model",
            "validate_checkpoint",
        ],
        "arclm.lifecycle": [
            "ARTIFACT_FORMAT",
            "ARTIFACT_VERSION",
            "LoadedModel",
            "ModelArtifactInfo",
            "ModelArtifactManifest",
            "ModelSource",
            "inspect_model_artifact",
            "load_model_artifact",
            "save_model_artifact",
            "validate_model_artifact",
        ],
        "arclm.peft": [
            "ADAPTER_ARTIFACT_FORMAT",
            "LoRAConfig",
            "LoRALinear",
            "PeftMethod",
            "apply_lora",
            "inspect_adapter_artifact",
            "load_adapter_artifact",
            "save_adapter_artifact",
            "validate_adapter_artifact",
        ],
        "arclm.tracking": [
            "RunConfig",
            "RunInfo",
            "RunManifest",
            "RunStatus",
            "RunTracker",
            "create_run",
            "inspect_run",
            "list_runs",
            "validate_run",
        ],
        "arclm.search": [
            "ChoiceParameter",
            "FloatParameter",
            "HyperparameterSearch",
            "HyperparameterSearchConfig",
            "IntegerParameter",
            "ObjectiveConfig",
            "SearchSpace",
            "SearchStrategy",
            "TrialResult",
            "create_search",
            "inspect_search",
            "load_search",
            "validate_search",
        ],
        "arclm.distributed": [
            "DistributedBackend",
            "DistributedConfig",
            "DistributedError",
            "DistributedLaunchResult",
            "DistributedProcessGroupInfo",
            "DistributedRuntimeInfo",
            "DistributedValidationIssue",
            "DistributedValidationResult",
            "DistributedWorkerResult",
            "ExternalValidationTarget",
            "SingleGpuBoundaryInfo",
            "build_distributed_env",
            "destroy_process_group",
            "get_external_multi_gpu_validation_matrix",
            "get_distributed_info",
            "init_process_group",
            "inspect_single_gpu_boundary",
            "launch_processes",
            "process_group_context",
            "resolve_process_device",
            "validate_distributed_config",
            "validate_distributed_setup",
            "validate_single_gpu_boundary",
        ],
    }

    for module_name, names in imports.items():
        module = importlib.import_module(module_name)
        for name in names:
            assert getattr(module, name) is not None


def test_domain_all_exports_resolve():
    module_names = [
        "arclm.datasets",
        "arclm.training",
        "arclm.evaluation",
        "arclm.finetuning",
        "arclm.inference",
        "arclm.checkpoints",
        "arclm.lifecycle",
        "arclm.peft",
        "arclm.tracking",
        "arclm.search",
        "arclm.distributed",
    ]

    for module_name in module_names:
        module = importlib.import_module(module_name)
        for name in module.__all__:
            assert getattr(module, name) is not None, f"{module_name}.{name}"


def test_root_import_stays_lightweight_for_optional_packages():
    code = """
import sys
import arclm

assert arclm.__version__
for name in ["torch", "transformers", "peft", "datasets", "flask"]:
    assert name not in sys.modules, name
"""
    env = dict(os.environ)
    env["PYTHONPATH"] = "src"
    result = subprocess.run(
        [sys.executable, "-c", code],
        capture_output=True,
        text=True,
        env=env,
        check=False,
    )

    assert result.returncode == 0, result.stderr


def test_training_config_names_are_documented_as_different_contracts():
    from arclm import TrainingConfig as RootTrainingConfig
    from arclm.configs import Config
    from arclm.configs import TrainingConfig as LegacyTrainingConfig
    from arclm.training import TrainingConfig as CoreTrainingConfig

    assert LegacyTrainingConfig is Config
    assert RootTrainingConfig is LegacyTrainingConfig
    assert CoreTrainingConfig is not LegacyTrainingConfig


def test_model_adapter_names_are_domain_specific():
    from arclm.finetuning import ModelAdapter as FineTuningModelAdapter
    from arclm.training import ModelAdapter as TrainingModelAdapter

    assert FineTuningModelAdapter is not TrainingModelAdapter
    assert FineTuningModelAdapter.__module__.startswith("arclm.finetuning")
    assert TrainingModelAdapter.__module__.startswith("arclm.training")
