from pathlib import Path as _Path
from typing import Any as _Any
from typing import Union as _Union

import torch as _torch

from ._version import __version__ as __version__
from .models import ArcLM as ArcLM
from .models import AutoModel as AutoModel
from .models import MiniGPT as MiniGPT
from .models import ModelCapabilityReport as ModelCapabilityReport
from .models import get_model_capability as get_model_capability
from .models import model_support_matrix as model_support_matrix
from .configs import Config as Config
from .configs import TrainingConfig as TrainingConfig
from .configs import create_config as create_config
from .tokenizers import AutoTokenizer as AutoTokenizer
from .tokenizers import SentencePieceTokenizer as SentencePieceTokenizer
from .tokenizers import Tokenizer as Tokenizer
from .tokenizers import TokenizerFactory as TokenizerFactory
from .tokenizers import create_tokenizer as create_tokenizer
from .tokenizers import get_tokenizer_from_config as get_tokenizer_from_config
from .datasets import BaseAugmenter as BaseAugmenter
from .datasets import BaseCleaner as BaseCleaner
from .datasets import BaseDataStep as BaseDataStep
from .datasets import BaseDataset as BaseDataset
from .datasets import BaseDeduplicator as BaseDeduplicator
from .datasets import BaseStreamingDataset as BaseStreamingDataset
from .datasets import BaseSyntheticDataGenerator as BaseSyntheticDataGenerator
from .datasets import DataBundle as DataBundle
from .datasets import DataPipeline as DataPipeline
from .datasets import DataProcessor as DataProcessor
from .datasets import DatasetConfig as DatasetConfig
from .datasets import DatasetLoader as DatasetLoader
from .datasets import DatasetManifest as DatasetManifest
from .datasets import DatasetReport as DatasetReport
from .datasets import DatasetValidationIssue as DatasetValidationIssue
from .datasets import DatasetValidationResult as DatasetValidationResult
from .datasets import DeduplicationResult as DeduplicationResult
from .datasets import ExactDeduplicator as ExactDeduplicator
from .datasets import InstructionDataset as InstructionDataset
from .datasets import ProcessedDataset as ProcessedDataset
from .datasets import RemoveDuplicates as RemoveDuplicates
from .datasets import StreamingDataset as StreamingDataset
from .datasets import TextDataset as TextDataset
from .datasets import build_dataset_report as build_dataset_report
from .datasets import create_dataloader as create_dataloader
from .datasets import create_dataset_manifest as create_dataset_manifest
from .datasets import create_instruction_dataloader as create_instruction_dataloader
from .datasets import deduplicate as deduplicate
from .datasets import load_dataset as load_dataset
from .datasets import load_tokens as load_tokens
from .datasets import prepare_data as prepare_data
from .datasets import read_tokens as read_tokens
from .datasets import split_train_val as split_train_val
from .datasets import validate_records as validate_records
from .inspection import PipelineTrace as PipelineTrace
from .inspection import inspect_text as inspect_text
from .training import BaseCallback as BaseCallback
from .training import BaseModelAdapter as BaseModelAdapter
from .training import BaseModelLoader as BaseModelLoader
from .training import BaseTrainer as BaseTrainer
from .training import BaseTrainingPipeline as BaseTrainingPipeline
from .training import EarlyStopping as EarlyStopping
from .training import GeneralizationMonitor as GeneralizationMonitor
from .training import L1Regularization as L1Regularization
from .training import L2Regularization as L2Regularization
from .training import LabelSmoothing as LabelSmoothing
from .training import LearningRateScheduler as LearningRateScheduler
from .training import MixupAugmentation as MixupAugmentation
from .training import ModelAdapter as ModelAdapter
from .training import PreTrainedModelLoader as PreTrainedModelLoader
from .training import StoppingCriteria as StoppingCriteria
from .training import Trainer as Trainer
from .training import TrainingResult as TrainingResult
from .training import TrainingState as TrainingState
from .training import UnifiedPipeline as UnifiedPipeline
from .training import build_model as build_model
from .training import build_trainer as build_trainer
from .training import checkpoint_is_compatible_for_continue_training as checkpoint_is_compatible_for_continue_training
from .training import checkpoint_is_compatible_for_tuining as checkpoint_is_compatible_for_tuining
from .training import create_checkpoint_callback as create_checkpoint_callback
from .training import create_epoch_checkpoint_callback as create_epoch_checkpoint_callback
from .training import load_compatible_checkpoint as load_compatible_checkpoint
from .training import save_training_checkpoint as save_training_checkpoint
from .training import tokenizer_from_checkpoint as tokenizer_from_checkpoint
from .training import train_model as train_model
from .finetuning import BaseFineTuner as BaseFineTuner
from .finetuning import FullFineTuner as FullFineTuner
from .finetuning import SFTConfig as SFTConfig
from .finetuning import SFTDataCollator as SFTDataCollator
from .finetuning import SFTRecordContract as SFTRecordContract
from .finetuning import SFTTrainer as SFTTrainer
from .finetuning import SFTTrainingResult as SFTTrainingResult
from .finetuning import TokenizerAdapter as TokenizerAdapter
from .finetuning import get_sft_record_contract as get_sft_record_contract
from .finetuning import train_sft as train_sft
from .finetuning import validate_sft_records as validate_sft_records
from .inference import DEFAULT_MODEL_PATH as DEFAULT_MODEL_PATH
from .inference import ExternalLoadedModel as ExternalLoadedModel
from .inference import ExternalModelConfig as ExternalModelConfig
from .inference import GenerationConfig as GenerationConfig
from .inference import Generator as Generator
from .inference import LoadedModel as LoadedModel
from .inference import ModelSaveConfig as ModelSaveConfig
from .inference import ModelSourceInfo as ModelSourceInfo
from .inference import TextGenerator as TextGenerator
from .inference import continue_native_training as continue_native_training
from .inference import fine_tune_external_model as fine_tune_external_model
from .inference import fine_tune_native_model as fine_tune_native_model
from .inference import inspect_model_source as inspect_model_source
from .inference import load_any_model as load_any_model
from .inference import load_external_for_inference as load_external_for_inference
from .inference import load_model as load_model
from .inference import predict as predict
from .inference import predict_external as predict_external
from .inference import save_loaded_model as save_loaded_model
from .inference import train_native_model as train_native_model
from .checkpoints import AdaptedModelBundle as AdaptedModelBundle
from .checkpoints import LoadPlan as LoadPlan
from .checkpoints import LoadedCheckpoint as LoadedCheckpoint
from .checkpoints import ModelInspector as ModelInspector
from .checkpoints import SmartLoader as SmartLoader
from .checkpoints import adapt_for_training as adapt_for_training
from .checkpoints import load_external_model as load_external_model
from .checkpoints import register_model_inspector as register_model_inspector
from .checkpoints import validate_tokenizer_compatibility as validate_tokenizer_compatibility
from .evaluation import Accuracy as Accuracy
from .evaluation import BaseEvaluationCallback as BaseEvaluationCallback
from .evaluation import BaseEvaluator as BaseEvaluator
from .evaluation import BaseMetric as BaseMetric
from .evaluation import ConceptBenchmarkCase as ConceptBenchmarkCase
from .evaluation import ConceptBenchmarkResult as ConceptBenchmarkResult
from .evaluation import DEFAULT_CONCEPT_BENCHMARKS as DEFAULT_CONCEPT_BENCHMARKS
from .evaluation import EvaluationConfig as EvaluationConfig
from .evaluation import EvaluationReport as EvaluationReport
from .evaluation import EvaluationResult as EvaluationResult
from .evaluation import Evaluator as Evaluator
from .evaluation import LongContextResult as LongContextResult
from .evaluation import LossMetric as LossMetric
from .evaluation import MetricsReport as MetricsReport
from .evaluation import Perplexity as Perplexity
from .evaluation import TopKPrediction as TopKPrediction
from .evaluation import build_evaluation_report as build_evaluation_report
from .evaluation import build_training_diagnostics_report as build_training_diagnostics_report
from .evaluation import calculate_metrics as calculate_metrics
from .evaluation import calculate_perplexity as calculate_perplexity
from .evaluation import evaluate as evaluate
from .evaluation import export_metrics_to_json as export_metrics_to_json
from .evaluation import export_metrics_to_markdown as export_metrics_to_markdown
from .evaluation import format_concept_benchmark_report as format_concept_benchmark_report
from .evaluation import format_long_context_results as format_long_context_results
from .evaluation import format_tokenizer_coverage_report as format_tokenizer_coverage_report
from .evaluation import format_top_k_predictions as format_top_k_predictions
from .evaluation import predict_top_k as predict_top_k
from .evaluation import run_long_context_evaluation as run_long_context_evaluation
from .evaluation import score_concept_relationships as score_concept_relationships
from .utils import format_duration as format_duration
from .logics import And as And
from .logics import Biconditional as Biconditional
from .logics import EntailmentResult as EntailmentResult
from .logics import Implication as Implication
from .logics import KnowledgeBase as KnowledgeBase
from .logics import Not as Not
from .logics import Or as Or
from .logics import Sentence as Sentence
from .logics import Symbol as Symbol
from .logics import create_symbols as create_symbols
from .logics import model_check as model_check


def get_version() -> str: ...


def get_device() -> _torch.device: ...


def list_available_models(models_dir: _Union[str, _Path] = ...) -> list[str]: ...


def load_training_checkpoint(
    path: _Union[str, _Path], device_type: str = ...
) -> dict[str, _Any]: ...


def report_environment(models_dir: _Union[str, _Path] = ...) -> str: ...


def create_simple_interface_app() -> _Any: ...


def run_simple_interface(
    host: str | None = ..., port: int | None = ..., debug: bool | None = ...
) -> None: ...
