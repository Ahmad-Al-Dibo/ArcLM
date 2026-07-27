"""Configuration public API."""

from .base import Config, create_config, get_finetuning_config, get_instruction_tuning_config
from .serialization import (
    create_example_configs,
    load_config,
    load_config_json,
    load_config_yaml,
    save_config,
    save_config_json,
    save_config_yaml,
)

TrainingConfig = Config
ModelConfig = Config
TokenizerConfig = Config
DatasetConfig = Config
InferenceConfig = Config

__all__ = [
    "Config",
    "TrainingConfig",
    "ModelConfig",
    "TokenizerConfig",
    "DatasetConfig",
    "InferenceConfig",
    "create_config",
    "get_finetuning_config",
    "get_instruction_tuning_config",
    "load_config",
    "load_config_json",
    "load_config_yaml",
    "save_config",
    "save_config_json",
    "save_config_yaml",
    "create_example_configs",
]
