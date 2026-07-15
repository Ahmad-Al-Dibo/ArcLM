"""Evaluation and diagnostics public API."""

from .base import BaseEvaluator, BaseMetric
from .callbacks import BaseEvaluationCallback
from .config import EvaluationConfig
from .diagnostics import (
    DEFAULT_CONCEPT_BENCHMARKS,
    ConceptBenchmarkCase,
    ConceptBenchmarkResult,
    LongContextResult,
    MetricsReport,
    TopKPrediction,
    build_training_diagnostics_report,
    calculate_metrics,
    calculate_perplexity,
    export_metrics_to_json,
    export_metrics_to_markdown,
    format_concept_benchmark_report,
    format_long_context_results,
    format_tokenizer_coverage_report,
    format_top_k_predictions,
    predict_top_k,
    run_long_context_evaluation,
    score_concept_relationships,
)
from .evaluator import Evaluator, evaluate
from .metrics import Accuracy, LossMetric, Perplexity
from .result import EvaluationResult

__all__ = [
    "Accuracy",
    "BaseEvaluationCallback",
    "BaseEvaluator",
    "BaseMetric",
    "DEFAULT_CONCEPT_BENCHMARKS",
    "ConceptBenchmarkCase",
    "ConceptBenchmarkResult",
    "EvaluationConfig",
    "EvaluationResult",
    "Evaluator",
    "LossMetric",
    "LongContextResult",
    "MetricsReport",
    "Perplexity",
    "TopKPrediction",
    "build_training_diagnostics_report",
    "calculate_metrics",
    "calculate_perplexity",
    "evaluate",
    "export_metrics_to_json",
    "export_metrics_to_markdown",
    "format_concept_benchmark_report",
    "format_long_context_results",
    "format_tokenizer_coverage_report",
    "format_top_k_predictions",
    "predict_top_k",
    "run_long_context_evaluation",
    "score_concept_relationships",
]
