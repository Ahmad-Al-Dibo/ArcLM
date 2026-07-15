"""
Publieke API voor ArcLM.

Deze module laadt veel onderdelen pas wanneer ze echt nodig zijn.
Zo blijft `import arclm` snel en licht.

Example:
    >>> from arclm import Config, UnifiedPipeline, load_model
    >>> config = Config(embed_dim=128, learning_rate=1e-3)
    >>> pipeline = UnifiedPipeline(config, mode="pre_training")
    >>> pipeline.build(vocab_size=10000)
    >>> results = pipeline.train(train_loader, num_epochs=5)
"""

from ._version import __version__

__author__ = "ArcLM Contributors"
__all__ = [
    # Basisconfiguratie
    "Config",
    
    # Training API
    "UnifiedPipeline",
    "StoppingCriteria",
    "PreTrainedModelLoader",
    "ModelAdapter",
    "train_model",
    "train_sft",
    "SFTTrainingResult",
    "tokenizer_from_checkpoint",
    "load_external_model",
    "adapt_for_training",
    "SmartLoader",
    "inspect_model_source",
    "DataProcessor",
    
    # Tokenizers
    "create_tokenizer",
    "get_tokenizer_from_config",
    "Tokenizer",
    "SentencePieceTokenizer",
    "TokenizerFactory",
    
    # Metrics en evaluatie
    "calculate_metrics",
    "calculate_perplexity",
    "export_metrics_to_json",
    "export_metrics_to_markdown",
    "MetricsReport",
    
    # Model laden en inference
    "load_model",
    "LoadedModel",
    "predict",
    
    # Configbestanden en experimenten bijhouden
    "load_config",
    "load_config_yaml",
    "load_config_json",
    "save_config",
    "save_config_yaml",
    "save_config_json",
    "ExperimentTracker",
    "create_experiment",
    "list_experiments",
    
    # Kleine helpers
    "create_config",
]

# We importeren zware modules pas wanneer de gebruiker ze opvraagt.
def __getattr__(name):
    """Laadt een publieke naam pas wanneer die voor het eerst nodig is."""
    if name == "Config":
        from .configs import Config
        return Config
    elif name == "create_config":
        from .configs import create_config
        return create_config
    elif name == "UnifiedPipeline":
        from .training import UnifiedPipeline
        return UnifiedPipeline
    elif name == "StoppingCriteria":
        from .training import StoppingCriteria
        return StoppingCriteria
    elif name == "PreTrainedModelLoader":
        from .training import PreTrainedModelLoader
        return PreTrainedModelLoader
    elif name == "ModelAdapter":
        from .training import ModelAdapter
        return ModelAdapter
    elif name == "train_model":
        from .training import train_model
        return train_model
    elif name == "train_sft":
        from .finetuning import train_sft
        return train_sft
    elif name == "SFTTrainingResult":
        from .finetuning import SFTTrainingResult
        return SFTTrainingResult
    elif name == "tokenizer_from_checkpoint":
        from .training import tokenizer_from_checkpoint
        return tokenizer_from_checkpoint
    elif name == "load_external_model":
        from .checkpoints import load_external_model
        return load_external_model
    elif name == "adapt_for_training":
        from .checkpoints import adapt_for_training
        return adapt_for_training
    elif name == "SmartLoader":
        from .checkpoints import SmartLoader
        return SmartLoader
    elif name == "inspect_model_source":
        from .checkpoints import inspect_model_source
        return inspect_model_source
    elif name == "DataProcessor":
        from .datasets import DataProcessor
        return DataProcessor
    elif name == "create_tokenizer":
        from .tokenizers import create_tokenizer
        return create_tokenizer
    elif name == "get_tokenizer_from_config":
        from .tokenizers import get_tokenizer_from_config
        return get_tokenizer_from_config
    elif name == "Tokenizer":
        from .tokenizers import Tokenizer
        return Tokenizer
    elif name == "SentencePieceTokenizer":
        from .tokenizers import SentencePieceTokenizer
        return SentencePieceTokenizer
    elif name == "TokenizerFactory":
        from .tokenizers import TokenizerFactory
        return TokenizerFactory
    elif name == "calculate_metrics":
        from .diagnostics import calculate_metrics
        return calculate_metrics
    elif name == "calculate_perplexity":
        from .diagnostics import calculate_perplexity
        return calculate_perplexity
    elif name == "export_metrics_to_json":
        from .diagnostics import export_metrics_to_json
        return export_metrics_to_json
    elif name == "export_metrics_to_markdown":
        from .diagnostics import export_metrics_to_markdown
        return export_metrics_to_markdown
    elif name == "MetricsReport":
        from .diagnostics import MetricsReport
        return MetricsReport
    elif name == "load_model":
        from .inference import load_model
        return load_model
    elif name == "LoadedModel":
        from .inference import LoadedModel
        return LoadedModel
    elif name == "predict":
        from .inference import predict
        return predict
    elif name == "load_config":
        from .configs import load_config
        return load_config
    elif name == "load_config_yaml":
        from .configs import load_config_yaml
        return load_config_yaml
    elif name == "load_config_json":
        from .configs import load_config_json
        return load_config_json
    elif name == "save_config":
        from .configs import save_config
        return save_config
    elif name == "save_config_yaml":
        from .configs import save_config_yaml
        return save_config_yaml
    elif name == "save_config_json":
        from .configs import save_config_json
        return save_config_json
    elif name == "ExperimentTracker":
        from .tracking import ExperimentTracker
        return ExperimentTracker
    elif name == "create_experiment":
        from .tracking import create_experiment
        return create_experiment
    elif name == "list_experiments":
        from .tracking import list_experiments
        return list_experiments
    else:
        raise AttributeError(f"module {__name__!r} has no attribute {name!r}")


def get_version():
    """Geeft de huidige ArcLM versie terug."""
    return __version__


def list_available_models():
    """Geeft lokale `.pth` checkpoints terug uit de models-map.
    
    Returns:
        Een lijst met modelnamen zonder bestandsextensie.
    """
    from pathlib import Path
    models_dir = Path(__file__).parent.parent / "models"
    
    if not models_dir.exists():
        return []
    
    models = [
        f.stem for f in models_dir.glob("*.pth") 
        if f.is_file()
    ]
    return sorted(models)
