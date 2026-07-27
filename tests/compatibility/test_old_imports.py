import warnings

import pytest


def _requires_complete_torch():
    pytest.importorskip("torch")
    pytest.importorskip("torch.nn")


def test_old_config_import_remains_available():
    with warnings.catch_warnings():
        warnings.simplefilter("ignore", DeprecationWarning)
        from arclm.config import Config

    assert Config is not None


def test_old_tokenizer_import_remains_available():
    with warnings.catch_warnings():
        warnings.simplefilter("ignore", DeprecationWarning)
        from arclm.tokenizer import Tokenizer

    assert Tokenizer is not None


def test_old_pipeline_import_remains_available():
    _requires_complete_torch()
    with warnings.catch_warnings():
        warnings.simplefilter("ignore", DeprecationWarning)
        from arclm.pipeline import build_model

    assert build_model is not None


def test_old_loaders_import_remains_available():
    _requires_complete_torch()
    with warnings.catch_warnings():
        warnings.simplefilter("ignore", DeprecationWarning)
        from arclm.loaders import SmartLoader

    assert SmartLoader is not None
