"""Base exception types for ArcLM."""


class ArcLMError(Exception):
    """Base exception for ArcLM."""


class ConfigurationError(ArcLMError):
    """Raised for invalid configuration."""


class ModelLoadError(ArcLMError):
    """Raised when model loading fails."""


class TokenizerError(ArcLMError):
    """Raised for tokenizer errors."""


class DatasetError(ArcLMError):
    """Raised for dataset errors."""


class DatasetLoadError(DatasetError):
    """Raised when a dataset cannot be loaded."""


class DatasetValidationError(DatasetError):
    """Raised when dataset rows do not match the expected shape."""


class DatasetFormatError(DatasetError, ValueError):
    """Raised when dataset input cannot be parsed into records."""


class PipelineError(DatasetError):
    """Raised when a data pipeline step fails."""


class CleaningError(DatasetError):
    """Raised when a cleaning step cannot process an example."""


class DeduplicationError(DatasetError):
    """Raised when deduplication fails."""


class DatasetVersionError(DatasetError):
    """Raised when local dataset versioning fails."""


class StreamingError(DatasetError):
    """Raised when a streaming dataset cannot be read."""


class SyntheticDataError(DatasetError):
    """Raised when synthetic data generation fails."""


class TrainingError(ArcLMError):
    """Raised for training errors."""


class TrainingConfigError(TrainingError):
    """Raised for invalid training configuration."""


class PrecisionError(TrainingError):
    """Raised when requested training precision is not supported."""


class CheckpointError(ArcLMError):
    """Raised for checkpoint errors."""


class ModelError(ArcLMError):
    """Base class for model errors."""


class UnsupportedModelError(ModelError, ValueError):
    """Raised when a model is outside ArcLM's supported workflow."""


class ModelCompatibilityError(ModelError, ValueError):
    """Raised when a model is not compatible with a requested task."""


class EvaluationError(ArcLMError):
    """Raised for evaluation errors."""


class EvaluationConfigError(EvaluationError):
    """Raised for invalid evaluation configuration."""


class MetricError(EvaluationError):
    """Raised when a metric cannot be computed."""


class FineTuningError(ArcLMError):
    """Raised for fine-tuning errors."""


class SFTConfigError(FineTuningError):
    """Raised for invalid SFT configuration."""


class ModelAdapterError(FineTuningError):
    """Raised when a model adapter cannot call or read a model."""


class TokenizerAdapterError(FineTuningError):
    """Raised when a tokenizer adapter cannot encode data."""


class FormattingError(FineTuningError):
    """Raised when an SFT example cannot be formatted."""


class DataCollatorError(FineTuningError):
    """Raised when SFT batches cannot be collated."""


class InferenceError(ArcLMError):
    """Raised for inference errors."""


class RetrievalError(ArcLMError):
    """Raised for retrieval / RAG index errors."""


class IndexBuildError(RetrievalError):
    """Raised when an index cannot be built from the input."""


class EvalHarnessError(ArcLMError):
    """Raised for evaluation-set / eval-runner errors."""

    def __init__(self, code: str, message: str = "") -> None:
        self.code = code
        super().__init__(message or code)


class OptionalDependencyError(ArcLMError):
    """Raised when an optional dependency is required but not installed."""
