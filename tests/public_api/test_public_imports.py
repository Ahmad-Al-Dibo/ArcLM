def test_configs_public_import():
    from arclm.configs import Config, TrainingConfig

    assert Config is not None
    assert TrainingConfig is Config


def test_tokenizer_public_import():
    from arclm.tokenizers import AutoTokenizer, Tokenizer

    assert AutoTokenizer is not None
    assert Tokenizer is not None


def test_registry_public_import():
    from arclm.registry import Registry

    registry = Registry("test")
    registry.register("one", object())
    assert registry.get("one") is not None


def test_optional_dependency_helper_import():
    from arclm.utils import require_optional_dependency

    assert require_optional_dependency is not None


def test_logics_public_import():
    from arclm.logics import KnowledgeBase, Symbol, create_symbols

    assert KnowledgeBase is not None
    assert Symbol is not None
    assert create_symbols is not None


def test_peft_qlora_public_imports_are_lightweight():
    from arclm.peft import (
        QLoRAConfig,
        QuantizationBackend,
        QuantizationConfig,
        inspect_quantization_capabilities,
    )

    assert QLoRAConfig is not None
    assert QuantizationBackend.BITSANDBYTES_4BIT.value == "bitsandbytes_4bit"
    assert QuantizationConfig().bits == 4
    assert inspect_quantization_capabilities is not None


def test_tracking_public_imports_are_available():
    from arclm.tracking import RunConfig, RunStatus, RunTracker, create_run, inspect_run

    assert RunConfig is not None
    assert RunStatus.CREATED.value == "created"
    assert RunTracker is not None
    assert create_run is not None
    assert inspect_run is not None


def test_search_public_imports_are_available():
    from arclm.search import (
        ChoiceParameter,
        HyperparameterSearchConfig,
        ObjectiveConfig,
        SearchSpace,
        SearchStrategy,
        create_search,
    )

    assert ChoiceParameter is not None
    assert HyperparameterSearchConfig is not None
    assert ObjectiveConfig is not None
    assert SearchSpace is not None
    assert SearchStrategy.GRID.value == "grid"
    assert create_search is not None


def test_distributed_public_imports_are_available():
    from arclm.distributed import (
        DistributedBackend,
        DistributedConfig,
        DistributedValidationResult,
        ExternalValidationTarget,
        FSDP_CHECKPOINT_POLICY_FORMAT,
        FSDPCapabilityInfo,
        FSDPCheckpointPlan,
        FSDPCheckpointPolicy,
        FSDPWrapConfig,
        FSDPWrappedModel,
        get_external_multi_gpu_validation_matrix,
        get_distributed_info,
        inspect_fsdp_capability,
        launch_processes,
        plan_fsdp_sharded_checkpoint,
        resolve_process_device,
        validate_distributed_setup,
        validate_fsdp_checkpoint_policy,
        wrap_fsdp_model,
    )

    config = DistributedConfig()
    assert DistributedBackend.GLOO.value == "gloo"
    assert resolve_process_device(config) == "cpu"
    assert get_distributed_info is not None
    assert launch_processes is not None
    assert isinstance(inspect_fsdp_capability(), FSDPCapabilityInfo)
    assert FSDP_CHECKPOINT_POLICY_FORMAT == "arclm-fsdp-sharded-checkpoint-policy"
    assert FSDPCheckpointPolicy().state_dict_type == "sharded"
    assert FSDPCheckpointPolicy().optimizer_state_policy == "sharded"
    assert FSDPCheckpointPolicy().resume_policy == "rank_synchronized"
    assert FSDPCheckpointPolicy().artifact_handoff_policy == "rank_zero_metadata"
    assert FSDPCheckpointPlan is not None
    assert FSDPWrapConfig().use_orig_params is True
    assert FSDPWrappedModel is not None
    assert plan_fsdp_sharded_checkpoint is not None
    assert validate_fsdp_checkpoint_policy is not None
    assert wrap_fsdp_model is not None
    assert isinstance(validate_distributed_setup(config), DistributedValidationResult)
    assert isinstance(get_external_multi_gpu_validation_matrix()[0], ExternalValidationTarget)
