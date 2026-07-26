"""FastAPI app factory voor de lokale ArcLM Web API."""

from __future__ import annotations

import logging
from threading import Lock
from typing import Any

import arclm
from arclm.diagnostics_runtime import optional_dependency_status
from arclm.exceptions import ArcLMError, ConfigurationError
from arclm.finetuning import (
    FineTuningConfig,
    FineTuningMode,
    fine_tuning_format_fingerprint,
    prepare_fine_tuning_dataset,
    prepare_fine_tuning_record,
)

from .config import WebConfig
from .datasets import DatasetApiError, DatasetCatalogue, DatasetInspector
from .dataset_sources import DatasetSourceError, DatasetSourceManager
from .schemas import (
    CapabilitiesResponse,
    DatasetRefreshResponse,
    DatasetDeleteRequest,
    DatasetInspectionResponse,
    DatasetListResponse,
    DatasetManifestReportResponse,
    DatasetManifestResponse,
    DatasetPasteRequest,
    DatasetReportResponse,
    DatasetReportRequest,
    DatasetRecordInspectionRequest,
    DatasetRecordTokenInspectionResponse,
    DatasetRootCreateRequest,
    DatasetRootInfo,
    DatasetRootListResponse,
    DatasetRootUpdateRequest,
    DatasetUploadRequest,
    DatasetValidationRequest,
    DatasetValidationResponse,
    EnvironmentResponse,
    ErrorResponse,
    EvaluationCompareRequest,
    EvaluationComparisonResponse,
    EvaluationCreateRequest,
    EvaluationListResponse,
    EvaluationMetadataResponse,
    EvaluationReportResponse,
    FineTuningPreviewRequest,
    FineTuningPreviewResponse,
    FineTuningValidationRequest,
    HealthResponse,
    CheckpointListResponse,
    CheckpointDeleteRequest,
    CheckpointMetadataResponse,
    CheckpointValidationResponse,
    GenerationCreateRequest,
    GenerationDeleteRequest,
    GenerationListResponse,
    GenerationMetadataResponse,
    PipelineInspectionRequest,
    PipelineInspectionStatusResponse,
    PipelineTraceResponse,
    ProjectCreateRequest,
    ProjectDeleteRequest,
    ProjectDatasetListResponse,
    ProjectDatasetPreviewResponse,
    ProjectListResponse,
    ProjectStatusResponse,
    ProjectUpdateRequest,
    ModelListResponse,
    NativeModelDeleteRequest,
    NativeModelRequest,
    NativeModelUpdateRequest,
    NativeModelValidationResponse,
    PretrainingValidationRequest,
    RunListResponse,
    RunLogResponse,
    StudioDatasetMetadata,
    StudioModelMetadata,
    StudioProject,
    StudioRunMetadata,
    StudioTokenizerMetadata,
    SystemStatusResponse,
    TokenizerCreateRequest,
    TokenizerDeleteRequest,
    TokenizerInspectionResponse,
    TokenizerInspectRequest,
    TokenizerListResponse,
    TrainingRunRequest,
    TrainingModeValidationResponse,
)
from .services import get_capabilities, get_environment, get_project_status, get_system_diagnostics
from .studio3 import Studio3Coordinator
from .studio_training import StudioTrainingCoordinator
from .workspace import StudioWorkspace, WorkspaceApiError

logger = logging.getLogger(__name__)

MAX_INSPECTION_TEXT_LENGTH = 2_000
MAX_INSPECTION_VALUES = 50


class InspectionApiError(Exception):
    """Fout die veilig naar de inspection API kan worden vertaald."""

    def __init__(self, code: str, message: str, status_code: int = 400):
        """Bewaart een stabiele foutcode en een Engelse melding."""
        super().__init__(message)
        self.code = code
        self.message = message
        self.status_code = status_code


def _optional_fastapi() -> tuple[Any, Any, Any, Any, Any, Any, Any]:
    """Laadt FastAPI pas wanneer de Web API echt wordt gebruikt."""
    try:
        from fastapi import FastAPI, HTTPException, Request
        from fastapi.middleware.cors import CORSMiddleware
        from fastapi.responses import JSONResponse
        from starlette.exceptions import HTTPException as StarletteHTTPException
    except ModuleNotFoundError as exc:
        if exc.name in {"fastapi", "starlette", "pydantic"}:
            raise RuntimeError(
                "ArcLM Web API requires the optional web dependencies.\n\n"
                "Install them with:\n\n"
                '    pip install "arclm[web]"'
            ) from exc
        raise
    return FastAPI, HTTPException, Request, CORSMiddleware, JSONResponse, StarletteHTTPException, ErrorResponse


def _error_payload(code: str, message: str, details: dict[str, Any] | None = None) -> dict[str, dict[str, Any]]:
    """Maakt het vaste foutformaat voor API responses."""
    payload: dict[str, Any] = {"code": code, "message": message}
    if details:
        payload["details"] = dict(details)
    return {"error": payload}


def create_app(config: WebConfig | None = None, *, model: Any | None = None, tokenizer: Any | None = None):
    """Maakt de lokale ArcLM Web API.

    De functie start geen server, laadt geen modellen en doet geen hardware-
    detectie bij import. Routes lezen alleen veilige, read-only informatie.
    Een native model/tokenizer kan expliciet worden geinjecteerd voor de
    read-only pipeline-inspectie.
    """
    FastAPI, HTTPException, Request, CORSMiddleware, JSONResponse, StarletteHTTPException, _ = _optional_fastapi()
    globals()["Request"] = Request
    web_config = config or WebConfig()

    if web_config.is_remote_binding:
        logger.warning(
            "ArcLM Web API configured for non-local host %s. This is not production-safe.",
            web_config.host,
        )

    app = FastAPI(
        title="ArcLM Local Web API",
        version=arclm.__version__,
        docs_url="/docs" if web_config.expose_docs else None,
        redoc_url=None,
        openapi_url="/openapi.json" if web_config.expose_docs else None,
    )
    app.state.web_config = web_config
    app.state.dataset_source_manager = DatasetSourceManager(web_config)
    app.state.dataset_catalogue = DatasetCatalogue(web_config, source_manager=app.state.dataset_source_manager)
    app.state.dataset_inspector = DatasetInspector(web_config)
    app.state.arclm_model = model
    app.state.arclm_tokenizer = tokenizer
    app.state.arclm_inspection_lock = Lock()
    app.state.studio_workspace = StudioWorkspace(web_config)
    app.state.training_coordinator = StudioTrainingCoordinator(
        app.state.studio_workspace,
        max_active_jobs=web_config.max_active_training_jobs,
    )
    app.state.studio_compute_lock = Lock()
    app.state.studio3_coordinator = Studio3Coordinator(
        app.state.studio_workspace,
        training_coordinator=app.state.training_coordinator,
        compute_lock=app.state.studio_compute_lock,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=list(web_config.allowed_origins),
        allow_credentials=False,
        allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
        allow_headers=["content-type"],
    )

    def require_dataset_source_management(request: Request) -> None:
        """Controleert of rootbeheer lokaal en bewust gebruikt wordt."""
        if not web_config.dataset_source_management:
            raise DatasetSourceError(
                "dataset_source_management_disabled",
                "Dataset source management is disabled.",
                status_code=403,
            )
        if web_config.is_remote_binding:
            raise DatasetSourceError(
                "dataset_source_management_disabled",
                "Dataset source management is disabled for non-local server access.",
                status_code=403,
            )
        origin = request.headers.get("origin")
        if origin and origin not in web_config.allowed_origins:
            raise DatasetSourceError(
                "dataset_source_origin_rejected",
                "Dataset source management requires an approved local origin.",
                status_code=403,
            )

    def inspection_objects() -> tuple[Any, Any]:
        """Geeft het geinjecteerde native model/tokenizer paar terug."""
        native_model = getattr(app.state, "arclm_model", None)
        native_tokenizer = getattr(app.state, "arclm_tokenizer", None)
        if native_model is None or native_tokenizer is None:
            raise InspectionApiError(
                "native_model_not_configured",
                "The local ArcLM inspection model and tokenizer are not configured.",
                status_code=409,
            )
        return native_model, native_tokenizer

    def validate_inspection_request(payload: PipelineInspectionRequest) -> None:
        """Controleert clientopties voordat de native trace wordt gemaakt."""
        if not payload.text.strip():
            raise InspectionApiError(
                "inspection_text_empty",
                "text must contain at least one non-whitespace character.",
                status_code=400,
            )
        if len(payload.text) > MAX_INSPECTION_TEXT_LENGTH:
            raise InspectionApiError(
                "inspection_text_too_long",
                f"text must be at most {MAX_INSPECTION_TEXT_LENGTH} characters.",
                status_code=413,
            )
        if payload.max_values < 1 or payload.max_values > MAX_INSPECTION_VALUES:
            raise InspectionApiError(
                "inspection_values_limit_invalid",
                f"max_values must be between 1 and {MAX_INSPECTION_VALUES}.",
                status_code=400,
            )
        if payload.device == "cuda":
            try:
                import torch
            except ModuleNotFoundError as exc:
                raise InspectionApiError("inspection_device_unavailable", "CUDA inspection requires PyTorch.", status_code=400) from exc
            if not torch.cuda.is_available():
                raise InspectionApiError("inspection_device_unavailable", "CUDA was requested but is not available.", status_code=400)

    def demo_inspection_objects() -> tuple[Any, Any]:
        """Create or reuse a tiny deterministic CPU demo model for learning."""
        if getattr(app.state, "arclm_demo_model", None) is None or getattr(app.state, "arclm_demo_tokenizer", None) is None:
            from arclm.models import ArcLM
            from arclm.tokenizers import Tokenizer

            tokenizer = Tokenizer(max_vocab=24, user_defined_symbols=["<|instruction|>", "<|response|>", "<|end|>"])
            tokenizer.build("hello arclm pipeline token embedding transformer logits selected generated")
            model = ArcLM(
                vocab_size=tokenizer.get_vocab_size(),
                embed_dim=8,
                block_size=8,
                num_blocks=1,
                dropout=0.0,
            )
            model.eval()
            app.state.arclm_demo_model = model
            app.state.arclm_demo_tokenizer = tokenizer
        return app.state.arclm_demo_model, app.state.arclm_demo_tokenizer

    def project_model_inspection_objects(payload: PipelineInspectionRequest) -> tuple[Any, Any, dict[str, Any], dict[str, Any]]:
        """Build an untrained project model from stored safe project metadata."""
        if not payload.project_id or not payload.model_id:
            raise InspectionApiError(
                "inspection_source_not_selected",
                "Select a project and native model before inspecting a project model.",
                status_code=400,
            )
        from arclm.models import ArcLM

        model_meta = app.state.studio_workspace.get_model(payload.project_id, payload.model_id)
        tokenizer_id = payload.tokenizer_id or model_meta.tokenizer_id
        tokenizer_meta = app.state.studio_workspace.get_ready_tokenizer(payload.project_id, tokenizer_id)
        if tokenizer_meta.id != model_meta.tokenizer_id:
            raise InspectionApiError(
                "fine_tuning_tokenizer_model_mismatch",
                "The selected tokenizer must match the model tokenizer.",
                status_code=400,
            )
        if int(model_meta.configuration["vocab_size"]) != int(tokenizer_meta.vocab_size):
            raise InspectionApiError(
                "fine_tuning_tokenizer_model_mismatch",
                "Tokenizer vocabulary does not match the model vocabulary.",
                status_code=400,
            )
        model = ArcLM(**model_meta.configuration)
        tokenizer = app.state.studio_workspace._load_tokenizer(payload.project_id, tokenizer_meta)
        return model, tokenizer, model_meta.to_dict(), tokenizer_meta.to_dict()

    def enrich_trace(
        trace: dict[str, Any],
        *,
        source_mode: str,
        source_label: str,
        model_state: str,
        model: dict[str, Any] | None = None,
        tokenizer: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        """Attach web-source metadata without changing PipelineTrace semantics."""
        result = dict(trace)
        result.update(
            {
                "source_mode": source_mode,
                "source_label": source_label,
                "model_state": model_state,
                "model": model,
                "tokenizer": tokenizer,
            }
        )
        return result

    def validate_pretraining_config(project_id: str, payload: PretrainingValidationRequest) -> dict[str, Any]:
        """Validate the existing native pre-training path without starting it."""
        try:
            app.state.training_coordinator._validate_payload(project_id, payload.model_dump())
        except WorkspaceApiError as exc:
            return {
                "valid": False,
                "training_mode": "pretraining",
                "fine_tuning_method": None,
                "compatibility": {"status": "blocked"},
                "warnings": [],
                "errors": [{"code": exc.code, "message": exc.message, "details": exc.details}],
            }
        model = app.state.studio_workspace.get_model(project_id, payload.model_id)
        tokenizer = app.state.studio_workspace.get_ready_tokenizer(project_id, payload.tokenizer_id)
        dataset = app.state.studio_workspace.get_dataset(project_id, payload.dataset_id)
        return {
            "valid": True,
            "training_mode": "pretraining",
            "fine_tuning_method": None,
            "compatibility": {
                "status": "ready",
                "dataset_id": dataset.id,
                "tokenizer_id": tokenizer.id,
                "model_id": model.id,
                "model_vocabulary_size": int(model.configuration["vocab_size"]),
                "tokenizer_vocabulary_size": int(tokenizer.vocab_size),
                "context_length": int(model.configuration["block_size"]),
            },
            "warnings": [],
            "errors": [],
        }

    def validate_fine_tuning_config(project_id: str, payload: FineTuningValidationRequest) -> dict[str, Any]:
        """Validate fine-tuning source, formatting and tokenizer/model compatibility."""
        errors: list[dict[str, Any]] = []
        warnings: list[str] = []
        if payload.fine_tuning_method not in {"full", "sft"}:
            errors.append({"code": "fine_tuning_method_unsupported", "message": "Only full and sft are currently exposed."})
        if not payload.base_model_id and not payload.base_checkpoint_id:
            errors.append({"code": "fine_tuning_source_required", "message": "Select a base model or compatible checkpoint."})

        model_id = payload.base_model_id
        checkpoint_summary: dict[str, Any] | None = None
        if payload.base_checkpoint_id:
            try:
                checkpoint_summary = app.state.studio3_coordinator.get_checkpoint(project_id, payload.base_checkpoint_id)
                if checkpoint_summary.get("reload_status") != "compatible":
                    errors.append({"code": "inspection_checkpoint_incompatible", "message": "The selected checkpoint is not compatible."})
                model_id = str(checkpoint_summary.get("model_id") or model_id or "")
            except WorkspaceApiError as exc:
                errors.append({"code": exc.code, "message": exc.message})

        model = None
        tokenizer = None
        dataset = None
        tokenizer_object = None
        try:
            if model_id:
                model = app.state.studio_workspace.get_model(project_id, model_id)
            dataset = app.state.studio_workspace.get_dataset(project_id, payload.dataset_id)
            tokenizer = app.state.studio_workspace.get_ready_tokenizer(project_id, payload.tokenizer_id)
            tokenizer_object = app.state.studio_workspace._load_tokenizer(project_id, tokenizer)
        except WorkspaceApiError as exc:
            errors.append({"code": exc.code, "message": exc.message, "details": exc.details})

        if model is not None and tokenizer is not None:
            if model.tokenizer_id != tokenizer.id:
                errors.append({"code": "fine_tuning_tokenizer_model_mismatch", "message": "Fine-tuning tokenizer must match the base model tokenizer."})
            if int(model.configuration["vocab_size"]) != int(tokenizer.vocab_size):
                errors.append({"code": "fine_tuning_tokenizer_model_mismatch", "message": "Tokenizer vocabulary does not match the model vocabulary."})

        ft_config = None
        format_fingerprint = None
        try:
            ft_config = _fine_tuning_config_from_formatting(payload.formatting, payload.fine_tuning_method)
        except Exception as exc:
            message = str(exc)[:240]
            code = "fine_tuning_tag_duplicate" if "distinct" in message else "fine_tuning_format_configuration_invalid"
            errors.append({"code": code, "message": message})

        if ft_config is not None:
            tag_result = _validate_fine_tuning_tags(ft_config, tokenizer_object)
            errors.extend(tag_result["errors"])
            warnings.extend(tag_result["warnings"])
            tokenizer_identity = _fine_tuning_tokenizer_identity(tokenizer)
            format_fingerprint = fine_tuning_format_fingerprint(
                config=ft_config,
                tokenizer_identity=tokenizer_identity,
            )
            if payload.formatting.preview_configuration_fingerprint and payload.formatting.preview_configuration_fingerprint != format_fingerprint:
                errors.append(
                    {
                        "code": "fine_tuning_format_fingerprint_mismatch",
                        "message": "The supplied preview fingerprint does not match the current configuration.",
                    }
                )

        if payload.device == "cuda":
            try:
                import torch
            except ModuleNotFoundError:
                errors.append({"code": "training_device_unavailable", "message": "CUDA requires PyTorch."})
            else:
                if not torch.cuda.is_available():
                    errors.append({"code": "training_device_unavailable", "message": "CUDA was requested but is not available."})

        if payload.precision != "fp32":
            errors.append({"code": "fine_tuning_label_strategy_unsupported", "message": "Web fine-tuning validation currently supports fp32 only."})

        record_count = int(dataset.record_count) if dataset is not None else 0
        usable_record_count = 0
        rejected_record_count = 0
        if dataset is not None and tokenizer_object is not None and ft_config is not None:
            records = app.state.studio_workspace._load_dataset_records(dataset)
            record_count = len(records)
            for index, record in enumerate(records):
                try:
                    prepare_fine_tuning_record(
                        record,
                        tokenizer_object,
                        ft_config,
                        record_index=index,
                    )
                except Exception as exc:
                    rejected_record_count += 1
                    if len(errors) < 10:
                        errors.append(
                            {
                                "code": _fine_tuning_error_code(exc),
                                "message": f"Record {index} is not usable for fine-tuning.",
                            }
                        )
                else:
                    usable_record_count += 1
            if record_count and usable_record_count == 0:
                errors.append({"code": "fine_tuning_record_unusable", "message": "No records produced trainable examples."})

        compatibility = {
            "status": "ready" if not errors else "blocked",
            "base_source": "checkpoint" if payload.base_checkpoint_id else "project_model",
            "base_checkpoint_id": payload.base_checkpoint_id,
            "base_model_id": model.id if model is not None else model_id,
            "dataset_id": dataset.id if dataset is not None else payload.dataset_id,
            "tokenizer_id": tokenizer.id if tokenizer is not None else payload.tokenizer_id,
            "model_vocabulary_size": int(model.configuration["vocab_size"]) if model is not None else None,
            "tokenizer_vocabulary_size": int(tokenizer.vocab_size) if tokenizer is not None else None,
            "vocabulary_compatible": not any(error["code"] in {"fine_tuning_tokenizer_model_mismatch", "fine_tuning_vocab_resize_required"} for error in errors),
            "supports_vocab_resize": False,
            "supported_methods": ["full", "sft"],
            "unsupported_methods": ["lora", "qlora"],
            "format_fingerprint": format_fingerprint,
        }
        return {
            "valid": not errors,
            "training_mode": "fine_tuning",
            "fine_tuning_method": payload.fine_tuning_method,
            "dataset_format": ft_config.formatter if ft_config is not None else payload.formatting.dataset_format,
            "record_count": record_count,
            "usable_record_count": usable_record_count,
            "rejected_record_count": rejected_record_count,
            "tokenizer_vocab_size": int(tokenizer.vocab_size) if tokenizer is not None else None,
            "model_vocab_size": int(model.configuration["vocab_size"]) if model is not None else None,
            "label_strategy": ft_config.label_strategy if ft_config is not None else None,
            "format_fingerprint": format_fingerprint,
            "compatibility": compatibility,
            "warnings": warnings,
            "errors": errors,
        }

    def fine_tuning_preview(project_id: str, payload: FineTuningPreviewRequest) -> dict[str, Any]:
        """Return bounded formatting, token and label-mask previews."""
        validation = validate_fine_tuning_config(project_id, payload)
        if not validation["valid"]:
            return {**validation, "formatting": payload.formatting.model_dump(), "records": []}
        dataset = app.state.studio_workspace.get_dataset(project_id, payload.dataset_id)
        tokenizer_meta = app.state.studio_workspace.get_ready_tokenizer(project_id, payload.tokenizer_id)
        tokenizer = app.state.studio_workspace._load_tokenizer(project_id, tokenizer_meta)
        records = app.state.studio_workspace._load_dataset_records(dataset)
        limit = min(max(int(payload.preview_records), 1), 5)
        previews = []
        ft_config = _fine_tuning_config_from_formatting(payload.formatting, payload.fine_tuning_method)
        for index, record in enumerate(records[:limit]):
            prepared = prepare_fine_tuning_record(
                record,
                tokenizer,
                ft_config,
                record_index=index,
            )
            row = prepared.to_dict()
            row["index"] = index
            row["record_index"] = index
            row["original_record"] = {str(k): v for k, v in record.items()}
            row["token_ids"] = row.pop("input_ids")
            row["special_tags_detected"] = row.get("detected_tags", [])
            previews.append(
                row
            )
        return {
            **validation,
            "formatting": _preview_formatting_payload(payload.formatting, ft_config, validation.get("format_fingerprint")),
            "format_fingerprint": validation.get("format_fingerprint"),
            "preview_configuration_fingerprint": validation.get("format_fingerprint"),
            "records": previews,
        }

    def _fine_tuning_config_from_formatting(formatting: Any, method: str) -> FineTuningConfig:
        dataset_format = str(formatting.dataset_format)
        end_behavior = str(formatting.end_behavior)
        if end_behavior == "custom_end_tag":
            end_behavior = "custom_tag"
        return FineTuningConfig(
            mode=FineTuningMode.SFT if method == "sft" else FineTuningMode.CAUSAL_LM,
            formatter="plain_text" if dataset_format == "plain_text" else dataset_format,
            max_sequence_length=max(1, int(formatting.maximum_sequence_length)),
            train_on_prompt=not bool(formatting.train_on_response_only),
            label_strategy="response_only" if formatting.train_on_response_only else "full_sequence",
            end_behavior=end_behavior,
            end_tag=str(formatting.end_tag),
            text_field=str(formatting.text_field),
            prompt_field=str(formatting.prompt_field),
            completion_field=str(formatting.completion_field),
            instruction_field=str(formatting.instruction_field),
            input_field=str(formatting.context_field or "input"),
            response_field=str(formatting.response_field),
            instruction_tag=str(formatting.instruction_tag),
            response_tag=str(formatting.response_tag),
            context_tag=None,
            separator=str(formatting.separator),
            register_tags_as_special_tokens=bool(formatting.register_tags_as_special_tokens),
            strict_field_mapping=True,
            skip_invalid_records=False,
        )

    def _fine_tuning_tokenizer_identity(tokenizer_meta: Any | None) -> dict[str, Any]:
        if tokenizer_meta is None:
            return {}
        return {
            "id": tokenizer_meta.id,
            "type": tokenizer_meta.type,
            "tokenizer_type": tokenizer_meta.tokenizer_type,
            "sentencepiece_model_type": tokenizer_meta.sentencepiece_model_type,
            "vocab_size": int(tokenizer_meta.vocab_size),
        }

    def _preview_formatting_payload(formatting: Any, config: FineTuningConfig, fingerprint: str | None) -> dict[str, Any]:
        values = formatting.model_dump() if hasattr(formatting, "model_dump") else dict(formatting)
        values["end_behavior"] = config.end_behavior
        values["label_strategy"] = config.label_strategy
        values["maximum_sequence_length"] = config.max_sequence_length
        values["format_fingerprint"] = fingerprint
        values["preview_configuration_fingerprint"] = fingerprint
        values["strict_field_mapping"] = True
        return values

    def _validate_fine_tuning_tags(config: FineTuningConfig, tokenizer: Any | None) -> dict[str, Any]:
        errors: list[dict[str, str]] = []
        warnings: list[str] = []
        tags = [
            config.instruction_tag if config.formatter == "instruction_response" else None,
            config.response_tag if config.formatter in {"instruction_response", "prompt_completion"} else None,
            config.end_tag if config.end_behavior == "custom_tag" else None,
        ]
        clean_tags = [str(tag) for tag in tags if tag is not None]
        for tag in clean_tags:
            if not tag.strip():
                errors.append({"code": "fine_tuning_format_configuration_invalid", "message": "Required tags must not be empty."})
            if len(tag) > 80:
                errors.append({"code": "fine_tuning_format_configuration_invalid", "message": "Tags must be at most 80 characters."})
            if any(ord(char) < 32 for char in tag):
                errors.append({"code": "fine_tuning_format_configuration_invalid", "message": "Tags must not contain control characters."})
        if len(set(clean_tags)) != len(clean_tags):
            errors.append({"code": "fine_tuning_tag_duplicate", "message": "Instruction, response and end tags must be distinct."})
        reserved = {"<UNK>", "<|pad|>"}
        tokenizer_vocab = getattr(tokenizer, "stoi", {}) if tokenizer is not None else {}
        for tag in clean_tags:
            if tag in reserved:
                errors.append({"code": "fine_tuning_reserved_token_conflict", "message": f"{tag} conflicts with a reserved tokenizer token."})
        if config.register_tags_as_special_tokens:
            missing = [tag for tag in clean_tags if tag not in tokenizer_vocab]
            if missing:
                errors.append(
                    {
                        "code": "fine_tuning_vocab_resize_required",
                        "message": "Registering these tags would change tokenizer vocabulary, but Web Studio has no safe model resize operation.",
                    }
                )
        else:
            warnings.append("Formatting tags are inserted as text and are not registered as tokenizer special tokens.")
        if config.end_behavior == "tokenizer_eos":
            eos_id = getattr(tokenizer, "eos_token_id", None)
            if eos_id is None:
                processor = getattr(tokenizer, "processor", None)
                eos_id = processor.eos_id() if processor is not None and hasattr(processor, "eos_id") else None
            if eos_id is None or int(eos_id) < 0:
                errors.append({"code": "fine_tuning_eos_unavailable", "message": "The selected tokenizer does not expose an EOS token."})
        return {"errors": errors, "warnings": warnings}

    def _fine_tuning_error_code(exc: Exception) -> str:
        message = str(exc)
        if "fine_tuning_response_fully_truncated" in message or "no trainable tokens" in message:
            return "fine_tuning_response_fully_truncated"
        if "eos" in message.lower():
            return "fine_tuning_eos_unavailable"
        return "fine_tuning_record_unusable"

    @app.exception_handler(ConfigurationError)
    async def configuration_error_handler(_: Request, exc: ConfigurationError):
        """Geeft configuratiefouten terug zonder stacktrace."""
        return JSONResponse(
            status_code=400,
            content=_error_payload("invalid_configuration", str(exc)),
        )

    @app.exception_handler(StarletteHTTPException)
    async def http_error_handler(_: Request, exc: HTTPException):
        """Zet HTTP-fouten om naar het vaste foutformaat."""
        detail = exc.detail if isinstance(exc.detail, str) else "Request failed"
        code = "not_found" if exc.status_code == 404 else "request_failed"
        return JSONResponse(
            status_code=exc.status_code,
            content=_error_payload(code, detail),
        )

    @app.exception_handler(ArcLMError)
    async def arclm_error_handler(_: Request, exc: ArcLMError):
        """Zet ArcLM-fouten om naar een veilig API antwoord."""
        return JSONResponse(
            status_code=400,
            content=_error_payload("arclm_error", str(exc)),
        )

    @app.exception_handler(DatasetApiError)
    async def dataset_error_handler(_: Request, exc: DatasetApiError):
        """Zet datasetfouten om naar het vaste foutformaat."""
        return JSONResponse(
            status_code=exc.status_code,
            content=_error_payload(exc.code, exc.message),
        )

    @app.exception_handler(DatasetSourceError)
    async def dataset_source_error_handler(_: Request, exc: DatasetSourceError):
        """Zet datasetbronfouten om naar het vaste foutformaat."""
        return JSONResponse(
            status_code=exc.status_code,
            content=_error_payload(exc.code, exc.message),
        )

    @app.exception_handler(WorkspaceApiError)
    async def workspace_error_handler(_: Request, exc: WorkspaceApiError):
        """Zet workspacefouten om naar het vaste foutformaat."""
        return JSONResponse(
            status_code=exc.status_code,
            content=_error_payload(exc.code, exc.message, exc.details),
        )

    @app.exception_handler(InspectionApiError)
    async def inspection_error_handler(_: Request, exc: InspectionApiError):
        """Zet inspectiefouten om naar het vaste foutformaat."""
        return JSONResponse(
            status_code=exc.status_code,
            content=_error_payload(exc.code, exc.message),
        )

    @app.exception_handler(Exception)
    async def unexpected_error_handler(_: Request, exc: Exception):
        """Verbergt interne details bij onverwachte fouten."""
        logger.exception("Unexpected ArcLM Web API error: %s", exc)
        return JSONResponse(
            status_code=500,
            content=_error_payload("internal_error", "An unexpected server error occurred."),
        )

    @app.get("/api/health", response_model=HealthResponse)
    def health() -> HealthResponse:
        """Geeft snel terug of de API leeft."""
        return HealthResponse(status="ok", service="arclm-web-api", version=arclm.__version__)

    @app.get("/api/environment", response_model=EnvironmentResponse)
    def environment() -> EnvironmentResponse:
        """Geeft veilige runtime-informatie terug."""
        return get_environment()

    @app.get("/api/capabilities", response_model=CapabilitiesResponse)
    def capabilities() -> CapabilitiesResponse:
        """Geeft de huidige ArcLM mogelijkheden terug."""
        return get_capabilities()

    @app.get("/api/system/status", response_model=SystemStatusResponse)
    def system_status() -> SystemStatusResponse:
        """Geeft veilige ArcLM Studio runtime- en workspace-informatie terug."""
        workspace_status = app.state.studio_workspace.status()
        if app.state.training_coordinator.has_active_job():
            active_compute = "training"
        elif app.state.studio3_coordinator.has_active_evaluation():
            active_compute = "evaluation"
        else:
            active_compute = "idle"
        diagnostics = get_system_diagnostics(
            workspace=workspace_status,
            active_compute_operation=active_compute,
        )
        return SystemStatusResponse(
            arclm_version=diagnostics["arclm_version"],
            python_version=diagnostics["python_version"],
            pytorch_version=diagnostics["pytorch_version"],
            operating_system=diagnostics["operating_system"],
            cpu=diagnostics["cpu"],
            cuda_available=diagnostics["cuda_available"],
            cuda_version=diagnostics["cuda_version"],
            gpu_name=diagnostics["gpu_name"],
            gpu_count=diagnostics["gpu_count"],
            current_device=diagnostics["current_device"],
            optional_dependencies=optional_dependency_status(),
            backend_health=HealthResponse(status="ok", service="arclm-web-api", version=arclm.__version__),
            workspace=workspace_status,
            active_compute_operation=active_compute,
            warnings=list(diagnostics["warnings"]),
            diagnostics={
                "gpu_count": diagnostics["gpu_count"],
                "optional_dependency_count": len(diagnostics["optional_dependencies"]),
                "path_details_exposed": False,
            },
        )

    @app.get("/api/inspection/status", response_model=PipelineInspectionStatusResponse)
    def inspection_status() -> PipelineInspectionStatusResponse:
        """Geeft veilige capability-informatie voor native inspectie terug."""
        native_model = getattr(app.state, "arclm_model", None)
        native_tokenizer = getattr(app.state, "arclm_tokenizer", None)
        if native_model is None or native_tokenizer is None:
            return PipelineInspectionStatusResponse(
                available=True,
                initialized=False,
                mode=None,
                reason="inspection_source_not_selected",
                supported_modes=["demo", "project_model", "checkpoint"],
                message=(
                    "Inspection is ready, but no source is selected. Start the educational demo, "
                    "select a project model, or select a trained checkpoint."
                ),
            )
        return PipelineInspectionStatusResponse(
            available=True,
            initialized=True,
            mode="configured",
            reason=None,
            supported_modes=["demo", "project_model", "checkpoint"],
            model_class=type(native_model).__name__,
            tokenizer_class=type(native_tokenizer).__name__,
            device="cpu",
            dtype="float32",
            supports_attention=False,
            supports_value_capture=True,
            supports_streaming=False,
            supports_external_models=False,
        )

    @app.post("/api/inspection/text", response_model=PipelineTraceResponse)
    def inspect_pipeline_text(payload: PipelineInspectionRequest) -> dict[str, Any]:
        """Inspecteert een prompt via de canonical native ``inspect_text`` API."""
        validate_inspection_request(payload)
        if payload.source_mode == "checkpoint":
            if not payload.project_id or not payload.checkpoint_id:
                raise InspectionApiError(
                    "inspection_source_not_selected",
                    "Select a project and checkpoint before inspecting a checkpoint.",
                    status_code=400,
                )
            trace = app.state.studio3_coordinator.inspect_checkpoint(
                payload.project_id,
                payload.checkpoint_id,
                payload.model_dump(),
            )
            checkpoint = app.state.studio3_coordinator.get_checkpoint(payload.project_id, payload.checkpoint_id)
            return enrich_trace(
                trace,
                source_mode="checkpoint",
                source_label=str(checkpoint.get("name") or payload.checkpoint_id),
                model_state="checkpoint",
                model=checkpoint.get("model") if isinstance(checkpoint.get("model"), dict) else None,
                tokenizer=checkpoint.get("tokenizer") if isinstance(checkpoint.get("tokenizer"), dict) else None,
            )

        model_meta: dict[str, Any] | None = None
        tokenizer_meta: dict[str, Any] | None = None
        source_label = "Configured native model"
        model_state = "configured"
        if payload.source_mode == "demo":
            native_model, native_tokenizer = demo_inspection_objects()
            source_label = "Educational tiny demo"
            model_state = "untrained_demo"
            tokenizer_meta = {"tokenizer_type": "word", "vocab_size": native_tokenizer.get_vocab_size()}
            model_meta = {"source": "demo", "state": "untrained", "configuration": {"vocab_size": native_tokenizer.get_vocab_size(), "embed_dim": 8, "block_size": 8, "num_blocks": 1}}
        elif payload.source_mode == "project_model":
            native_model, native_tokenizer, model_meta, tokenizer_meta = project_model_inspection_objects(payload)
            source_label = str(model_meta.get("name") or payload.model_id)
            model_state = "untrained"
        else:
            native_model, native_tokenizer = inspection_objects()
        try:
            with app.state.arclm_inspection_lock:
                trace = arclm.inspect_text(
                    model=native_model,
                    tokenizer=native_tokenizer,
                    text=payload.text,
                    include_values=payload.include_values,
                    max_values=payload.max_values,
                )
        except (TypeError, ValueError) as exc:
            raise InspectionApiError("inspection_failed", str(exc), status_code=400) from exc
        except RuntimeError as exc:
            raise InspectionApiError(
                "inspection_runtime_failed",
                "The native inspection request could not be completed.",
                status_code=500,
            ) from exc
        return enrich_trace(
            trace.to_dict(),
            source_mode=payload.source_mode,
            source_label=source_label,
            model_state=model_state,
            model=model_meta,
            tokenizer=tokenizer_meta,
        )

    @app.get("/api/project/status", response_model=ProjectStatusResponse)
    def project_status() -> ProjectStatusResponse:
        """Geeft een kleine veilige projectstatus terug."""
        return get_project_status()

    @app.get("/api/projects", response_model=ProjectListResponse)
    def list_projects() -> ProjectListResponse:
        """Lists ArcLM Studio projects without exposing filesystem paths."""
        projects = [StudioProject(**project.to_dict()) for project in app.state.studio_workspace.list_projects()]
        return ProjectListResponse(projects=projects, count=len(projects))

    @app.post("/api/projects", response_model=StudioProject)
    def create_project(payload: ProjectCreateRequest) -> StudioProject:
        """Creates a project under the configured Studio workspace."""
        project = app.state.studio_workspace.create_project(payload.name, payload.description)
        return StudioProject(**project.to_dict())

    @app.get("/api/projects/{project_id}", response_model=StudioProject)
    def read_project(project_id: str) -> StudioProject:
        """Reads safe project metadata."""
        return StudioProject(**app.state.studio_workspace.get_project(project_id).to_dict())

    @app.patch("/api/projects/{project_id}", response_model=StudioProject)
    def update_project(project_id: str, payload: ProjectUpdateRequest) -> StudioProject:
        """Updates safe project fields."""
        project = app.state.studio_workspace.update_project(
            project_id,
            name=payload.name,
            description=payload.description,
        )
        return StudioProject(**project.to_dict())

    @app.delete("/api/projects/{project_id}", response_model=StudioProject)
    def delete_project(project_id: str, payload: ProjectDeleteRequest) -> StudioProject:
        """Deletes a project only after explicit confirmation."""
        project = app.state.studio_workspace.delete_project(
            project_id,
            confirm=payload.confirm,
            confirm_name=payload.confirm_name,
        )
        return StudioProject(**project.to_dict())

    @app.get("/api/projects/{project_id}/models", response_model=ModelListResponse)
    def list_project_models(project_id: str) -> ModelListResponse:
        """Lists native ArcLM model configurations for one project."""
        models = [StudioModelMetadata(**item.to_dict()) for item in app.state.studio_workspace.list_models(project_id)]
        return ModelListResponse(models=models, count=len(models))

    @app.post("/api/projects/{project_id}/models/native/validate", response_model=NativeModelValidationResponse)
    def validate_project_native_model(project_id: str, payload: NativeModelRequest) -> dict[str, Any]:
        """Validates a native model config through the real ArcLM constructor."""
        return app.state.studio_workspace.validate_native_model(project_id, payload.configuration, payload.tokenizer_id)

    @app.post("/api/projects/{project_id}/models/native/estimate", response_model=NativeModelValidationResponse)
    def estimate_project_native_model(project_id: str, payload: NativeModelRequest) -> dict[str, Any]:
        """Returns exact parameter count and approximate memory estimates."""
        return app.state.studio_workspace.estimate_native_model(project_id, payload.configuration, payload.tokenizer_id)

    @app.post("/api/projects/{project_id}/models/native", response_model=StudioModelMetadata)
    def create_project_native_model(project_id: str, payload: NativeModelRequest) -> StudioModelMetadata:
        """Stores native ArcLM model configuration metadata without weights."""
        model = app.state.studio_workspace.create_native_model(
            project_id,
            name=payload.name,
            tokenizer_id=payload.tokenizer_id,
            dataset_id=payload.dataset_id,
            configuration=payload.configuration,
        )
        return StudioModelMetadata(**model.to_dict())

    @app.get("/api/projects/{project_id}/models/{model_id}", response_model=StudioModelMetadata)
    def read_project_model(project_id: str, model_id: str) -> StudioModelMetadata:
        """Reads one native model configuration."""
        return StudioModelMetadata(**app.state.studio_workspace.get_model(project_id, model_id).to_dict())

    @app.patch("/api/projects/{project_id}/models/{model_id}", response_model=StudioModelMetadata)
    def update_project_model(project_id: str, model_id: str, payload: NativeModelUpdateRequest) -> StudioModelMetadata:
        """Updates safe native model fields."""
        model = app.state.studio_workspace.update_model(project_id, model_id, name=payload.name, configuration=payload.configuration)
        return StudioModelMetadata(**model.to_dict())

    @app.delete("/api/projects/{project_id}/models/{model_id}", response_model=StudioModelMetadata)
    def delete_project_model(project_id: str, model_id: str, payload: NativeModelDeleteRequest) -> StudioModelMetadata:
        """Deletes model config metadata only after confirmation."""
        model = app.state.studio_workspace.delete_model(project_id, model_id, confirm=payload.confirm)
        return StudioModelMetadata(**model.to_dict())

    @app.get("/api/projects/{project_id}/runs", response_model=RunListResponse)
    def list_project_runs(project_id: str) -> RunListResponse:
        """Lists persistent training runs for a project."""
        runs = [StudioRunMetadata(**item.to_dict()) for item in app.state.studio_workspace.list_runs(project_id)]
        return RunListResponse(runs=runs, count=len(runs))

    @app.post("/api/projects/{project_id}/runs", response_model=StudioRunMetadata)
    def create_project_run(project_id: str, payload: TrainingRunRequest) -> StudioRunMetadata:
        """Creates and starts a local native training run in the background."""
        run = app.state.training_coordinator.create_run(project_id, payload.model_dump())
        return StudioRunMetadata(**run.to_dict())

    @app.post("/api/projects/{project_id}/training/pretraining/validate", response_model=TrainingModeValidationResponse)
    def validate_project_pretraining(project_id: str, payload: PretrainingValidationRequest) -> dict[str, Any]:
        """Validate pre-training setup without starting a run."""
        return validate_pretraining_config(project_id, payload)

    @app.post("/api/projects/{project_id}/training/finetuning/validate", response_model=TrainingModeValidationResponse)
    def validate_project_fine_tuning(project_id: str, payload: FineTuningValidationRequest) -> dict[str, Any]:
        """Validate fine-tuning setup without starting a run."""
        return validate_fine_tuning_config(project_id, payload)

    @app.post("/api/projects/{project_id}/training/finetuning/preview", response_model=FineTuningPreviewResponse)
    def preview_project_fine_tuning(project_id: str, payload: FineTuningPreviewRequest) -> dict[str, Any]:
        """Preview formatted records, token IDs and label masks without mutating data."""
        return fine_tuning_preview(project_id, payload)

    @app.get("/api/projects/{project_id}/runs/{run_id}", response_model=StudioRunMetadata)
    def read_project_run(project_id: str, run_id: str) -> StudioRunMetadata:
        """Reads one training run metadata snapshot."""
        return StudioRunMetadata(**app.state.studio_workspace.get_run(project_id, run_id).to_dict())

    @app.get("/api/projects/{project_id}/runs/{run_id}/metrics", response_model=RunLogResponse)
    def read_project_run_metrics(project_id: str, run_id: str, limit: int = 200) -> RunLogResponse:
        """Reads bounded metrics from metrics.jsonl."""
        items = app.state.studio_workspace.read_run_jsonl(project_id, run_id, "metrics.jsonl", limit)
        return RunLogResponse(items=items, count=len(items))

    @app.get("/api/projects/{project_id}/runs/{run_id}/events", response_model=RunLogResponse)
    def read_project_run_events(project_id: str, run_id: str, limit: int = 200) -> RunLogResponse:
        """Reads bounded events from events.jsonl."""
        items = app.state.studio_workspace.read_run_jsonl(project_id, run_id, "events.jsonl", limit)
        return RunLogResponse(items=items, count=len(items))

    @app.post("/api/projects/{project_id}/runs/{run_id}/cancel", response_model=StudioRunMetadata)
    def cancel_project_run(project_id: str, run_id: str) -> StudioRunMetadata:
        """Requests cooperative cancellation at a safe Trainer callback boundary."""
        run = app.state.training_coordinator.cancel(project_id, run_id)
        return StudioRunMetadata(**run.to_dict())

    @app.get("/api/projects/{project_id}/runs/{run_id}/checkpoints", response_model=CheckpointListResponse)
    def list_project_run_checkpoints(project_id: str, run_id: str) -> CheckpointListResponse:
        """Lists metadata for checkpoints generated by a run."""
        checkpoints = app.state.studio_workspace.list_run_checkpoints(project_id, run_id)
        return CheckpointListResponse(checkpoints=checkpoints, count=len(checkpoints))

    @app.get("/api/projects/{project_id}/runs/{run_id}/checkpoints/{checkpoint_id}", response_model=CheckpointMetadataResponse)
    def read_project_run_checkpoint(project_id: str, run_id: str, checkpoint_id: str) -> CheckpointMetadataResponse:
        """Reads one checkpoint metadata object without returning binary contents."""
        return CheckpointMetadataResponse(
            checkpoint=app.state.studio_workspace.get_run_checkpoint(project_id, run_id, checkpoint_id)
        )

    @app.get("/api/projects/{project_id}/checkpoints", response_model=CheckpointListResponse)
    def list_project_checkpoints(project_id: str) -> CheckpointListResponse:
        """Lists project-wide checkpoint metadata using safe generated IDs."""
        checkpoints = app.state.studio3_coordinator.list_checkpoints(project_id)
        return CheckpointListResponse(checkpoints=checkpoints, count=len(checkpoints))

    @app.get("/api/projects/{project_id}/checkpoints/{checkpoint_id}", response_model=CheckpointMetadataResponse)
    def read_project_checkpoint(project_id: str, checkpoint_id: str) -> CheckpointMetadataResponse:
        """Reads safe checkpoint details without returning model binaries."""
        return CheckpointMetadataResponse(checkpoint=app.state.studio3_coordinator.get_checkpoint(project_id, checkpoint_id))

    @app.post("/api/projects/{project_id}/checkpoints/{checkpoint_id}/validate", response_model=CheckpointValidationResponse)
    def validate_project_checkpoint(project_id: str, checkpoint_id: str) -> dict[str, Any]:
        """Validates native checkpoint reload compatibility explicitly."""
        return app.state.studio3_coordinator.validate_checkpoint(project_id, checkpoint_id)

    @app.delete("/api/projects/{project_id}/checkpoints/{checkpoint_id}", response_model=CheckpointMetadataResponse)
    def delete_project_checkpoint(project_id: str, checkpoint_id: str, payload: CheckpointDeleteRequest) -> CheckpointMetadataResponse:
        """Deletes exactly one checkpoint after explicit confirmation."""
        checkpoint = app.state.studio3_coordinator.delete_checkpoint(
            project_id,
            checkpoint_id,
            confirm=payload.confirm,
            checkpoint_name=payload.checkpoint_name,
        )
        return CheckpointMetadataResponse(checkpoint=checkpoint)

    @app.post("/api/projects/{project_id}/checkpoints/{checkpoint_id}/inspect", response_model=PipelineTraceResponse)
    def inspect_project_checkpoint(project_id: str, checkpoint_id: str, payload: PipelineInspectionRequest) -> dict[str, Any]:
        """Inspects a native checkpoint through canonical arclm.inspect_text."""
        return app.state.studio3_coordinator.inspect_checkpoint(project_id, checkpoint_id, payload.model_dump())

    @app.get("/api/projects/{project_id}/evaluations", response_model=EvaluationListResponse)
    def list_project_evaluations(project_id: str) -> EvaluationListResponse:
        """Lists stored evaluation jobs for a project."""
        evaluations = app.state.studio3_coordinator.list_evaluations(project_id)
        return EvaluationListResponse(evaluations=evaluations, count=len(evaluations))

    @app.post("/api/projects/{project_id}/evaluations", response_model=EvaluationMetadataResponse)
    def create_project_evaluation(project_id: str, payload: EvaluationCreateRequest) -> EvaluationMetadataResponse:
        """Queues a bounded background evaluation job."""
        evaluation = app.state.studio3_coordinator.create_evaluation(project_id, payload.model_dump())
        return EvaluationMetadataResponse(evaluation=evaluation)

    @app.post("/api/projects/{project_id}/evaluations/compare", response_model=EvaluationComparisonResponse)
    def compare_project_evaluations(project_id: str, payload: EvaluationCompareRequest) -> dict[str, Any]:
        """Compares completed evaluations only when conditions match."""
        return app.state.studio3_coordinator.compare_evaluations(project_id, payload.evaluation_ids)

    @app.get("/api/projects/{project_id}/evaluations/{evaluation_id}", response_model=EvaluationMetadataResponse)
    def read_project_evaluation(project_id: str, evaluation_id: str) -> EvaluationMetadataResponse:
        """Reads one evaluation metadata snapshot."""
        return EvaluationMetadataResponse(evaluation=app.state.studio3_coordinator.get_evaluation(project_id, evaluation_id))

    @app.get("/api/projects/{project_id}/evaluations/{evaluation_id}/events", response_model=RunLogResponse)
    def read_project_evaluation_events(project_id: str, evaluation_id: str, limit: int = 200) -> RunLogResponse:
        """Reads bounded evaluation events."""
        items = app.state.studio3_coordinator.get_evaluation_events(project_id, evaluation_id, limit)
        return RunLogResponse(items=items, count=len(items))

    @app.get("/api/projects/{project_id}/evaluations/{evaluation_id}/report", response_model=EvaluationReportResponse)
    def read_project_evaluation_report(project_id: str, evaluation_id: str) -> EvaluationReportResponse:
        """Reads the stored canonical EvaluationReport."""
        return EvaluationReportResponse(report=app.state.studio3_coordinator.get_evaluation_report(project_id, evaluation_id))

    @app.post("/api/projects/{project_id}/evaluations/{evaluation_id}/cancel", response_model=EvaluationMetadataResponse)
    def cancel_project_evaluation(project_id: str, evaluation_id: str) -> EvaluationMetadataResponse:
        """Requests cooperative evaluation cancellation."""
        return EvaluationMetadataResponse(evaluation=app.state.studio3_coordinator.cancel_evaluation(project_id, evaluation_id))

    @app.get("/api/projects/{project_id}/generations", response_model=GenerationListResponse)
    def list_project_generations(project_id: str) -> GenerationListResponse:
        """Lists bounded generation history."""
        generations = app.state.studio3_coordinator.list_generations(project_id)
        return GenerationListResponse(generations=generations, count=len(generations))

    @app.post("/api/projects/{project_id}/generations", response_model=GenerationMetadataResponse)
    def create_project_generation(project_id: str, payload: GenerationCreateRequest) -> GenerationMetadataResponse:
        """Runs one bounded native checkpoint generation."""
        return GenerationMetadataResponse(generation=app.state.studio3_coordinator.generate(project_id, payload.model_dump()))

    @app.get("/api/projects/{project_id}/generations/{generation_id}", response_model=GenerationMetadataResponse)
    def read_project_generation(project_id: str, generation_id: str) -> GenerationMetadataResponse:
        """Reads one generation history record."""
        return GenerationMetadataResponse(generation=app.state.studio3_coordinator.get_generation(project_id, generation_id))

    @app.delete("/api/projects/{project_id}/generations/{generation_id}", response_model=GenerationMetadataResponse)
    def delete_project_generation(project_id: str, generation_id: str, payload: GenerationDeleteRequest) -> GenerationMetadataResponse:
        """Deletes one generation record after confirmation."""
        generation = app.state.studio3_coordinator.delete_generation(project_id, generation_id, confirm=payload.confirm)
        return GenerationMetadataResponse(generation=generation)

    @app.get("/api/projects/{project_id}/datasets", response_model=ProjectDatasetListResponse)
    def list_project_datasets(project_id: str) -> ProjectDatasetListResponse:
        """Lists datasets stored in one project."""
        datasets = [StudioDatasetMetadata(**item.to_dict()) for item in app.state.studio_workspace.list_datasets(project_id)]
        return ProjectDatasetListResponse(datasets=datasets, count=len(datasets))

    @app.post("/api/projects/{project_id}/datasets/upload", response_model=StudioDatasetMetadata)
    def upload_project_dataset(project_id: str, payload: DatasetUploadRequest) -> StudioDatasetMetadata:
        """Stores browser-uploaded text content after safe validation."""
        dataset = app.state.studio_workspace.add_dataset(
            project_id,
            name=payload.name,
            source_type="upload",
            content=payload.content,
            selected_format=payload.selected_format,
            stored_format=payload.stored_format,
            original_filename=payload.original_filename,
            text_fields=payload.text_fields,
        )
        return StudioDatasetMetadata(**dataset.to_dict())

    @app.post("/api/projects/{project_id}/datasets/paste", response_model=StudioDatasetMetadata)
    def paste_project_dataset(project_id: str, payload: DatasetPasteRequest) -> StudioDatasetMetadata:
        """Stores pasted text data under the project workspace."""
        dataset = app.state.studio_workspace.add_dataset(
            project_id,
            name=payload.name,
            source_type="paste",
            content=payload.content,
            selected_format=payload.selected_format,
            stored_format=payload.stored_format,
            original_filename=None,
            text_fields=payload.text_fields,
        )
        return StudioDatasetMetadata(**dataset.to_dict())

    @app.get("/api/projects/{project_id}/datasets/{dataset_id}", response_model=StudioDatasetMetadata)
    def read_project_dataset(project_id: str, dataset_id: str) -> StudioDatasetMetadata:
        """Reads project dataset metadata."""
        return StudioDatasetMetadata(**app.state.studio_workspace.get_dataset(project_id, dataset_id).to_dict())

    @app.get("/api/projects/{project_id}/datasets/{dataset_id}/preview", response_model=ProjectDatasetPreviewResponse)
    def preview_project_dataset(
        project_id: str,
        dataset_id: str,
        limit: int | None = None,
    ) -> dict[str, Any]:
        """Returns a bounded dataset preview."""
        return app.state.studio_workspace.preview_dataset(project_id, dataset_id, limit)

    @app.delete("/api/projects/{project_id}/datasets/{dataset_id}", response_model=StudioDatasetMetadata)
    def delete_project_dataset(
        project_id: str,
        dataset_id: str,
        payload: DatasetDeleteRequest,
    ) -> StudioDatasetMetadata:
        """Deletes a project dataset only after explicit confirmation."""
        dataset = app.state.studio_workspace.delete_dataset(project_id, dataset_id, confirm=payload.confirm)
        return StudioDatasetMetadata(**dataset.to_dict())

    @app.post("/api/projects/{project_id}/datasets/{dataset_id}/validate", response_model=DatasetValidationResponse)
    def validate_project_dataset(
        project_id: str,
        dataset_id: str,
        payload: DatasetValidationRequest,
    ) -> dict[str, Any]:
        """Validates a project dataset through ArcLM public validation APIs."""
        return app.state.studio_workspace.validate_dataset(
            project_id,
            dataset_id,
            selected_format=payload.selected_format,
            text_fields=payload.text_fields,
            strict=payload.strict,
        )

    @app.post("/api/projects/{project_id}/datasets/{dataset_id}/report", response_model=DatasetManifestReportResponse)
    def create_project_dataset_report(
        project_id: str,
        dataset_id: str,
        payload: DatasetReportRequest | None = None,
    ) -> dict[str, Any]:
        """Creates dataset manifest and token report via ArcLM APIs."""
        if payload is not None:
            return app.state.studio_workspace.create_tokenized_report(
                project_id,
                dataset_id,
                tokenizer_id=payload.tokenizer_id,
                maximum_sequence_length=payload.maximum_sequence_length,
            )
        return app.state.studio_workspace.create_manifest_and_report(project_id, dataset_id)

    @app.post("/api/projects/{project_id}/datasets/{dataset_id}/inspect", response_model=DatasetRecordTokenInspectionResponse)
    def inspect_project_dataset_records(
        project_id: str,
        dataset_id: str,
        payload: DatasetRecordInspectionRequest,
    ) -> dict[str, Any]:
        """Tokenizes selected records with an explicit project tokenizer."""
        return app.state.studio_workspace.inspect_dataset_records(
            project_id,
            dataset_id,
            tokenizer_id=payload.tokenizer_id,
            record_indexes=payload.record_indexes,
            text_fields=payload.text_fields,
            maximum_sequence_length=payload.maximum_sequence_length,
            max_records=payload.max_records,
            max_tokens_per_record=payload.max_tokens_per_record,
        )

    @app.get("/api/projects/{project_id}/datasets/{dataset_id}/manifest", response_model=DatasetManifestResponse)
    def read_project_dataset_manifest(project_id: str, dataset_id: str) -> dict[str, Any]:
        """Reads a stored bounded manifest."""
        return {"manifest": app.state.studio_workspace.get_manifest(project_id, dataset_id)}

    @app.get("/api/projects/{project_id}/datasets/{dataset_id}/report", response_model=DatasetReportResponse)
    def read_project_dataset_report(project_id: str, dataset_id: str) -> dict[str, Any]:
        """Reads a stored bounded dataset report."""
        return {"report": app.state.studio_workspace.get_report(project_id, dataset_id)}

    @app.get("/api/projects/{project_id}/tokenizers", response_model=TokenizerListResponse)
    def list_project_tokenizers(project_id: str) -> TokenizerListResponse:
        """Lists native tokenizers stored in a project."""
        tokenizers = [StudioTokenizerMetadata(**item.to_dict()) for item in app.state.studio_workspace.list_tokenizers(project_id)]
        return TokenizerListResponse(tokenizers=tokenizers, count=len(tokenizers))

    @app.post("/api/projects/{project_id}/tokenizers/native", response_model=StudioTokenizerMetadata)
    def create_project_native_tokenizer(project_id: str, payload: TokenizerCreateRequest) -> StudioTokenizerMetadata:
        """Creates a native ArcLM tokenizer from a project dataset."""
        tokenizer = app.state.studio_workspace.create_native_tokenizer(
            project_id,
            dataset_id=payload.dataset_id,
            name=payload.name,
            max_vocab=payload.max_vocab,
            text_fields=payload.text_fields,
            tokenizer_type=payload.tokenizer_type,
            sentencepiece_model_type=payload.sentencepiece_model_type,
        )
        return StudioTokenizerMetadata(**tokenizer.to_dict())

    @app.get("/api/projects/{project_id}/tokenizers/{tokenizer_id}", response_model=StudioTokenizerMetadata)
    def read_project_tokenizer(project_id: str, tokenizer_id: str) -> StudioTokenizerMetadata:
        """Reads tokenizer metadata."""
        return StudioTokenizerMetadata(**app.state.studio_workspace.get_tokenizer(project_id, tokenizer_id).to_dict())

    @app.post("/api/projects/{project_id}/tokenizers/{tokenizer_id}/inspect", response_model=TokenizerInspectionResponse)
    def inspect_project_tokenizer(
        project_id: str,
        tokenizer_id: str,
        payload: TokenizerInspectRequest,
    ) -> dict[str, Any]:
        """Inspects text through a stored native tokenizer."""
        return app.state.studio_workspace.inspect_tokenizer(project_id, tokenizer_id, payload.text)

    @app.delete("/api/projects/{project_id}/tokenizers/{tokenizer_id}", response_model=StudioTokenizerMetadata)
    def delete_project_tokenizer(
        project_id: str,
        tokenizer_id: str,
        payload: TokenizerDeleteRequest,
    ) -> StudioTokenizerMetadata:
        """Deletes a tokenizer after explicit confirmation."""
        tokenizer = app.state.studio_workspace.delete_tokenizer(project_id, tokenizer_id, confirm=payload.confirm)
        return StudioTokenizerMetadata(**tokenizer.to_dict())

    @app.get("/api/datasets", response_model=DatasetListResponse)
    def datasets() -> DatasetListResponse:
        """Geeft de veilige datasetcatalogus terug."""
        records = app.state.dataset_catalogue.list_records()
        summaries = [record.to_summary() for record in records]
        return DatasetListResponse(datasets=summaries, count=len(summaries))

    @app.get("/api/dataset-roots", response_model=DatasetRootListResponse)
    def dataset_roots(request: Request) -> DatasetRootListResponse:
        """Geeft lokale datasetbronnen terug voor beheer in de UI."""
        require_dataset_source_management(request)
        roots = app.state.dataset_source_manager.list_roots()
        return DatasetRootListResponse(
            roots=roots,
            count=len(roots),
            active_count=sum(1 for root in roots if root.enabled),
            datasets_found=sum(root.supported_file_count for root in roots if root.enabled),
        )

    @app.post("/api/dataset-roots", response_model=DatasetRootInfo)
    def add_dataset_root(
        request: Request,
        payload: DatasetRootCreateRequest,
    ) -> DatasetRootInfo:
        """Voegt een persistente datasetbron toe."""
        require_dataset_source_management(request)
        return app.state.dataset_source_manager.add_root(
            name=payload.name,
            path=payload.path,
            recursive=payload.recursive,
        )

    @app.patch("/api/dataset-roots/{root_id}", response_model=DatasetRootInfo)
    def update_dataset_root(
        root_id: str,
        request: Request,
        payload: DatasetRootUpdateRequest,
    ) -> DatasetRootInfo:
        """Wijzigt naam, enabled of recursive voor een datasetbron."""
        require_dataset_source_management(request)
        return app.state.dataset_source_manager.update_root(
            root_id,
            name=payload.name,
            enabled=payload.enabled,
            recursive=payload.recursive,
        )

    @app.delete("/api/dataset-roots/{root_id}", response_model=DatasetRootInfo)
    def remove_dataset_root(root_id: str, request: Request) -> DatasetRootInfo:
        """Verwijdert alleen de ArcLM-configuratie, niet de map."""
        require_dataset_source_management(request)
        return app.state.dataset_source_manager.remove_root(root_id)

    @app.post("/api/dataset-roots/{root_id}/validate", response_model=DatasetRootInfo)
    def validate_dataset_root(root_id: str, request: Request) -> DatasetRootInfo:
        """Valideert een bestaande datasetbron opnieuw."""
        require_dataset_source_management(request)
        return app.state.dataset_source_manager.validate_root(root_id)

    @app.post("/api/datasets/refresh", response_model=DatasetRefreshResponse)
    def refresh_datasets(request: Request) -> DatasetRefreshResponse:
        """Scant actieve roots opnieuw en geeft een veilige samenvatting."""
        require_dataset_source_management(request)
        roots_scanned, datasets_found, warnings = app.state.dataset_source_manager.refresh_summary()
        return DatasetRefreshResponse(
            roots_scanned=roots_scanned,
            datasets_found=datasets_found,
            warnings=warnings,
        )

    @app.get("/api/datasets/{dataset_id}/inspection", response_model=DatasetInspectionResponse)
    def dataset_inspection(
        dataset_id: str,
        preview_rows: int | None = None,
    ) -> DatasetInspectionResponse:
        """Inspecteert een dataset via veilige ID en bounded limieten."""
        record = app.state.dataset_catalogue.find(dataset_id)
        return app.state.dataset_inspector.inspect(record, preview_rows=preview_rows)

    @app.get("/api/datasets/{dataset_id:path}/inspection", response_model=DatasetInspectionResponse)
    def path_like_dataset_inspection(
        dataset_id: str,
        preview_rows: int | None = None,
    ) -> DatasetInspectionResponse:
        """Vangt pad-achtige dataset IDs af als gewone ongeldige IDs."""
        record = app.state.dataset_catalogue.find(dataset_id)
        return app.state.dataset_inspector.inspect(record, preview_rows=preview_rows)

    return app
