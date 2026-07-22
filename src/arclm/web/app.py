"""FastAPI app factory voor de lokale ArcLM Web API."""

from __future__ import annotations

import logging
import platform as platform_module
from importlib.util import find_spec
from threading import Lock
from typing import Any

import arclm
from arclm.exceptions import ArcLMError, ConfigurationError

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
    DatasetRootCreateRequest,
    DatasetRootInfo,
    DatasetRootListResponse,
    DatasetRootUpdateRequest,
    DatasetUploadRequest,
    DatasetValidationRequest,
    DatasetValidationResponse,
    EnvironmentResponse,
    ErrorResponse,
    HealthResponse,
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
    StudioDatasetMetadata,
    StudioProject,
    StudioTokenizerMetadata,
    SystemStatusResponse,
    TokenizerCreateRequest,
    TokenizerDeleteRequest,
    TokenizerInspectionResponse,
    TokenizerInspectRequest,
    TokenizerListResponse,
)
from .services import get_capabilities, get_environment, get_project_status
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


def _optional_dependency_status() -> dict[str, dict[str, Any]]:
    """Checks optional packages without importing them."""
    packages = [
        "transformers",
        "datasets",
        "accelerate",
        "peft",
        "bitsandbytes",
        "safetensors",
        "fastapi",
        "uvicorn",
        "sentencepiece",
    ]
    return {package: {"package": package, "available": find_spec(package) is not None} for package in packages}


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
        env = get_environment()
        return SystemStatusResponse(
            arclm_version=env.arclm_version,
            python_version=env.python_version,
            pytorch_version=env.pytorch_version,
            operating_system=env.platform,
            cpu=platform_module.processor() or None,
            cuda_available=env.cuda_available,
            cuda_version=env.cuda_runtime,
            gpu_name=env.gpus[0].name if env.gpus else None,
            gpu_count=env.device_count,
            current_device=env.preferred_device,
            optional_dependencies=_optional_dependency_status(),
            backend_health=HealthResponse(status="ok", service="arclm-web-api", version=arclm.__version__),
            workspace=app.state.studio_workspace.status(),
        )

    @app.get("/api/inspection/status", response_model=PipelineInspectionStatusResponse)
    def inspection_status() -> PipelineInspectionStatusResponse:
        """Geeft veilige capability-informatie voor native inspectie terug."""
        native_model = getattr(app.state, "arclm_model", None)
        native_tokenizer = getattr(app.state, "arclm_tokenizer", None)
        if native_model is None or native_tokenizer is None:
            return PipelineInspectionStatusResponse(
                available=False,
                message="The local ArcLM inspection model and tokenizer are not configured.",
            )
        return PipelineInspectionStatusResponse(
            available=True,
            model_class=type(native_model).__name__,
            tokenizer_class=type(native_tokenizer).__name__,
            supports_attention=False,
            supports_value_capture=True,
            supports_streaming=False,
            supports_external_models=False,
        )

    @app.post("/api/inspection/text", response_model=PipelineTraceResponse)
    def inspect_pipeline_text(payload: PipelineInspectionRequest) -> dict[str, Any]:
        """Inspecteert een prompt via de canonical native ``inspect_text`` API."""
        validate_inspection_request(payload)
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
        return trace.to_dict()

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
    def create_project_dataset_report(project_id: str, dataset_id: str) -> dict[str, Any]:
        """Creates dataset manifest and token report via ArcLM APIs."""
        return app.state.studio_workspace.create_manifest_and_report(project_id, dataset_id)

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
