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
