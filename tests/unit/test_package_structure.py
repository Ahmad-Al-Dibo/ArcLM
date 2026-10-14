from arclm import TokenizerFactory
from arclm.tokenizers import Tokenizer, create_tokenizer
from arclm.training import (
    BaseModelAdapter,
    BaseModelLoader,
    BaseTrainingPipeline,
    ModelAdapter,
    PreTrainedModelLoader,
    UnifiedPipeline,
    build_model,
)


def test_tokenizer_factory_selects_word_tokenizer():
    tokenizer = TokenizerFactory.create("word", max_vocab=8)
    tokenizer.build("arc lm arc")

    assert tokenizer.encode_text("arc")[0] != tokenizer.get_unknown_index()
    assert create_tokenizer("word", max_vocab=8).__class__ is tokenizer.__class__


def test_tokenizer_factory_registers_custom_tokenizer():
    class CustomTokenizer(Tokenizer):
        pass

    TokenizerFactory.register("custom_test", CustomTokenizer)

    assert isinstance(TokenizerFactory.create("custom_test", max_vocab=4), CustomTokenizer)


def test_training_exports_are_inheritable_base_classes():
    assert issubclass(UnifiedPipeline, BaseTrainingPipeline)
    assert issubclass(PreTrainedModelLoader, BaseModelLoader)
    assert issubclass(ModelAdapter, BaseModelAdapter)


def test_build_model_is_exported():
    assert callable(build_model)
