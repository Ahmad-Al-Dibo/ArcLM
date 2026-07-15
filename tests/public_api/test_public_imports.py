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
