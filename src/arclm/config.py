"""Deprecated compatibility shim for ``arclm.config``."""

import warnings

warnings.warn(
    "arclm.config is deprecated and will be removed in a future release. "
    "Use 'from arclm.configs import Config' instead.",
    DeprecationWarning,
    stacklevel=2,
)

from .config_schema import (
    ArcLMConfig,
    CacheConfig,
    CONFIG_SCHEMA_VERSION,
    ConfigMigrationReport,
    DataConfig,
    EvaluationConfig,
    InferenceConfig,
    ModelConfig,
    PreprocessingConfig,
    QualityConfig,
    RunConfig,
    SecurityConfig,
    SplitConfig,
    TokenizationConfig,
    ValidationConfig,
    load_arclm_config,
    migrate_config,
    validate_arclm_config,
)
from .configs import Config, create_config, get_finetuning_config, get_instruction_tuning_config

__all__ = [
    "Config",
    "ArcLMConfig",
    "CacheConfig",
    "CONFIG_SCHEMA_VERSION",
    "ConfigMigrationReport",
    "DataConfig",
    "EvaluationConfig",
    "InferenceConfig",
    "ModelConfig",
    "PreprocessingConfig",
    "QualityConfig",
    "RunConfig",
    "SecurityConfig",
    "SplitConfig",
    "TokenizationConfig",
    "ValidationConfig",
    "create_config",
    "get_finetuning_config",
    "get_instruction_tuning_config",
    "load_arclm_config",
    "migrate_config",
    "validate_arclm_config",
]
