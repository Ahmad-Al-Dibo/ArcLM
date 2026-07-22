"""Responsemodellen voor de lokale ArcLM Web API."""

from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field


CapabilityStatus = Literal[
    "available",
    "locally_verified",
    "verified_for_correctness",
    "planned",
    "experimental",
    "hardware_unavailable",
    "dependency_missing",
    "not_verified",
    "unsupported",
]


class ErrorDetail(BaseModel):
    """Beschrijft een API-fout zonder interne details te lekken."""

    code: str
    message: str
    details: dict[str, Any] = Field(default_factory=dict)


class ErrorResponse(BaseModel):
    """Standaard foutresponse voor de Web API."""

    error: ErrorDetail


class DatasetWarning(BaseModel):
    """Waarschuwing die bij inspectie hoort."""

    code: str
    message: str


class DatasetRootInfo(BaseModel):
    """Veilige beheerinformatie over een datasetbron."""

    root_id: str
    name: str
    path: str
    enabled: bool
    recursive: bool
    source_origin: Literal["persisted", "command_line"]
    validation_status: Literal["valid", "warning", "error", "unvalidated"]
    supported_file_count: int
    ignored_file_count: int = 0
    warnings: list[DatasetWarning] = Field(default_factory=list)
    removable: bool = True
    editable: bool = True


class DatasetRootListResponse(BaseModel):
    """Lijst met geconfigureerde datasetbronnen."""

    roots: list[DatasetRootInfo]
    count: int
    active_count: int
    datasets_found: int
    warnings: list[DatasetWarning] = Field(default_factory=list)


class DatasetRootCreateRequest(BaseModel):
    """Request om een nieuwe datasetbron op te slaan."""

    name: str
    path: str
    recursive: bool = False


class DatasetRootUpdateRequest(BaseModel):
    """Request om veilige velden van een datasetbron te wijzigen."""

    name: str | None = None
    enabled: bool | None = None
    recursive: bool | None = None


class DatasetRefreshResponse(BaseModel):
    """Resultaat van een catalogusrefresh."""

    roots_scanned: int
    datasets_found: int
    warnings: list[DatasetWarning] = Field(default_factory=list)


class DatasetSummary(BaseModel):
    """Veilige datasetinformatie voor de catalogus."""

    dataset_id: str
    name: str
    format: Literal["txt", "csv", "json", "jsonl"]
    size_bytes: int
    source_name: str | None = None
    source_id: str | None = None


class DatasetListResponse(BaseModel):
    """Lijst met datasets uit de geconfigureerde roots."""

    datasets: list[DatasetSummary]
    count: int


class StudioWorkspaceStatus(BaseModel):
    """Safe ArcLM Studio workspace status."""

    available: bool
    project_count: int
    active_dataset_count: int
    active_tokenizer_count: int


class ProjectCreateRequest(BaseModel):
    """Create an ArcLM Studio project."""

    model_config = ConfigDict(extra="forbid")

    name: str
    description: str = ""


class ProjectUpdateRequest(BaseModel):
    """Update safe project fields."""

    model_config = ConfigDict(extra="forbid")

    name: str | None = None
    description: str | None = None


class ProjectDeleteRequest(BaseModel):
    """Confirm project deletion."""

    model_config = ConfigDict(extra="forbid")

    confirm: bool = False
    confirm_name: str | None = None


class StudioProject(BaseModel):
    """ArcLM Studio project metadata."""

    id: str
    name: str
    description: str
    created_at: float
    updated_at: float
    arclm_version: str
    status: Literal["active"]
    active_dataset_id: str | None = None
    active_tokenizer_id: str | None = None


class ProjectListResponse(BaseModel):
    """Project list response."""

    projects: list[StudioProject]
    count: int


class StudioDatasetMetadata(BaseModel):
    """Stored project dataset metadata."""

    id: str
    project_id: str
    name: str
    source_type: Literal["upload", "paste"]
    original_filename: str | None = None
    stored_format: Literal["txt", "csv", "json", "jsonl"]
    created_at: float
    size_bytes: int
    record_count: int
    selected_format: str
    text_fields: list[str]
    validation_status: Literal["not_validated", "valid", "invalid"]
    raw_filename: str
    validation_result: dict[str, Any] | None = None
    sft_validation_result: dict[str, Any] | None = None


class DatasetUploadRequest(BaseModel):
    """Text upload request after the browser reads a supported file."""

    model_config = ConfigDict(extra="forbid")

    name: str
    original_filename: str
    content: str
    stored_format: Literal["txt", "csv", "json", "jsonl"] | None = None
    selected_format: str = "plain_text"
    text_fields: list[str] = Field(default_factory=lambda: ["text"])


class DatasetPasteRequest(BaseModel):
    """Pasted dataset request."""

    model_config = ConfigDict(extra="forbid")

    name: str
    content: str
    stored_format: Literal["txt", "csv", "json", "jsonl"]
    selected_format: str = "plain_text"
    text_fields: list[str] = Field(default_factory=lambda: ["text"])


class DatasetDeleteRequest(BaseModel):
    """Confirm dataset deletion."""

    model_config = ConfigDict(extra="forbid")

    confirm: bool = False


class DatasetValidationRequest(BaseModel):
    """Validate a project dataset."""

    model_config = ConfigDict(extra="forbid")

    selected_format: str = "plain_text"
    text_fields: list[str] = Field(default_factory=lambda: ["text"])
    strict: bool = False


class ProjectDatasetListResponse(BaseModel):
    """Datasets stored inside one Studio project."""

    datasets: list[StudioDatasetMetadata]
    count: int


class ProjectDatasetPreviewRow(BaseModel):
    """Bounded preview row."""

    index: int
    values: dict[str, Any]


class ProjectDatasetPreviewResponse(BaseModel):
    """Bounded dataset preview response."""

    dataset: StudioDatasetMetadata
    fields: list[str]
    total_records: int
    preview_limit: int
    truncated: bool
    records: list[ProjectDatasetPreviewRow]


class DatasetValidationResponse(BaseModel):
    """Dataset and SFT validation result."""

    dataset: StudioDatasetMetadata
    validation: dict[str, Any]
    sft_validation: dict[str, Any] | None = None


class DatasetManifestReportResponse(BaseModel):
    """Dataset manifest plus token report."""

    manifest: dict[str, Any]
    report: dict[str, Any]


class DatasetManifestResponse(BaseModel):
    """Stored manifest response."""

    manifest: dict[str, Any]


class DatasetReportResponse(BaseModel):
    """Stored dataset report response."""

    report: dict[str, Any]


class StudioTokenizerMetadata(BaseModel):
    """Project tokenizer metadata."""

    id: str
    project_id: str
    name: str
    type: Literal["native"]
    vocab_size: int
    created_at: float
    source_dataset_id: str
    special_tokens: dict[str, str]
    status: Literal["ready"]
    tokenizer_filename: str


class TokenizerListResponse(BaseModel):
    """List project tokenizers."""

    tokenizers: list[StudioTokenizerMetadata]
    count: int


class TokenizerCreateRequest(BaseModel):
    """Create a native tokenizer from a project dataset."""

    model_config = ConfigDict(extra="forbid")

    name: str
    dataset_id: str
    max_vocab: int = 2000
    text_fields: list[str] = Field(default_factory=lambda: ["text"])


class TokenizerInspectRequest(BaseModel):
    """Inspect text with a project tokenizer."""

    model_config = ConfigDict(extra="forbid")

    text: str


class TokenizerDeleteRequest(BaseModel):
    """Confirm tokenizer deletion."""

    model_config = ConfigDict(extra="forbid")

    confirm: bool = False


class TokenizerInspectionResponse(BaseModel):
    """JSON-safe tokenizer inspection result."""

    text: str
    tokens: list[str]
    token_ids: list[int]
    token_count: int
    unknown_token_count: int
    decoded_text: str
    round_trip_matches: bool
    tokenizer_class: str
    vocab_size: int
    warnings: list[str] = Field(default_factory=list)


class DatasetField(BaseModel):
    """Samenvatting van een veld dat in de sample is gezien."""

    name: str
    type: Literal["string", "integer", "number", "boolean", "null", "object", "array", "mixed"]
    nullable: bool
    observed_in_rows: int
    missing_count: int
    empty_count: int


class DatasetPreviewRow(BaseModel):
    """Een veilige previewrij met afgekorte waarden."""

    row_id: str
    values: dict[str, object]


class TextLengthStatistics(BaseModel):
    """Tekstlengtes binnen de gescande waarden."""

    min: int | None = None
    max: int | None = None
    average: float | None = None


class DatasetStatistics(BaseModel):
    """Kleine statistieken uit de bounded scan."""

    rows_scanned: int
    row_count: int | None = None
    row_count_scope: Literal["exact", "bounded_scan", "unavailable"]
    field_count: int
    field_count_scope: Literal["exact", "bounded_scan", "sample"]
    invalid_row_count: int
    duplicate_count: int
    duplicate_scope: Literal["bounded_scan"]
    text_lengths: TextLengthStatistics


class DatasetInspectionMetadata(BaseModel):
    """Legt uit welke grenzen zijn gebruikt bij inspectie."""

    scanned_rows: int
    preview_rows: int
    scan_limit: int
    preview_limit: int
    max_field_length: int
    max_fields: int
    truncated: bool
    complete: bool
    schema_source: Literal["sample", "empty"]


class DatasetInspectionResponse(BaseModel):
    """Volledig maar bounded inspectieresultaat voor een dataset."""

    dataset_id: str
    name: str
    format: Literal["txt", "csv", "json", "jsonl"]
    size_bytes: int
    encoding: str
    fields: list[DatasetField]
    preview_rows: list[DatasetPreviewRow]
    statistics: DatasetStatistics
    metadata: DatasetInspectionMetadata
    warnings: list[DatasetWarning] = Field(default_factory=list)


class PipelineInspectionRequest(BaseModel):
    """Request voor een read-only native pipeline-inspectie."""

    model_config = ConfigDict(extra="forbid")

    text: str
    include_values: bool = False
    max_values: int = 20


class PipelineTraceResponse(BaseModel):
    """JSON-safe response uit ``PipelineTrace.to_dict()``."""

    input_text: str
    tokens: list[str]
    token_ids: list[int]
    sequence_length: int
    input_shape: list[int]
    embedding_shape: list[int]
    logits_shape: list[int]
    selected_token_id: int
    selected_token: str
    generated_text: str
    device: str
    dtype: str
    model_class: str
    tokenizer_class: str
    inspected_steps: int
    generation_steps: int
    attention_available: bool
    attention_note: str
    warnings: list[str] = Field(default_factory=list)
    values: dict[str, list[int | float]] | None = None


class PipelineInspectionStatusResponse(BaseModel):
    """Veilige status van de lokale native inspectie-capability."""

    available: bool
    model_class: str | None = None
    tokenizer_class: str | None = None
    supports_attention: bool = False
    supports_value_capture: bool = True
    supports_streaming: bool = False
    supports_external_models: bool = False
    message: str | None = None


class HealthResponse(BaseModel):
    """Gezondheidsstatus van de lokale Web API."""

    status: Literal["ok"]
    service: Literal["arclm-web-api"]
    version: str


class GpuInfo(BaseModel):
    """Veilige informatie over een CUDA-apparaat."""

    name: str
    vram_bytes: int | None = None
    compute_capability: tuple[int, int] | None = None


class EnvironmentResponse(BaseModel):
    """Veilige runtime-informatie voor de frontend."""

    arclm_version: str
    python_version: str
    platform: str
    pytorch_version: str | None = None
    cuda_available: bool
    cuda_runtime: str | None = None
    device_count: int
    available_devices: list[str] = Field(default_factory=list)
    preferred_device: str
    gpus: list[GpuInfo] = Field(default_factory=list)
    bf16_supported: bool | None = None


class OptionalDependencyStatus(BaseModel):
    """Availability of an optional Python package without importing it."""

    package: str
    available: bool


class SystemStatusResponse(BaseModel):
    """Safe runtime and workspace status for ArcLM Studio."""

    arclm_version: str
    python_version: str
    pytorch_version: str | None = None
    operating_system: str
    cpu: str | None = None
    cuda_available: bool
    cuda_version: str | None = None
    gpu_name: str | None = None
    gpu_count: int
    current_device: str
    optional_dependencies: dict[str, OptionalDependencyStatus]
    backend_health: HealthResponse
    workspace: StudioWorkspaceStatus


class Capability(BaseModel):
    """Status van een mogelijkheid in ArcLM."""

    status: CapabilityStatus
    note: str
    evidence: str | None = None
    hardware_requirement: str | None = None
    optional_dependency: str | None = None
    product_state: str | None = None


class CapabilitiesResponse(BaseModel):
    """Groepeert de mogelijkheden die de frontend mag tonen."""

    training: dict[str, Capability]
    evaluation: dict[str, Capability]
    inference: dict[str, Capability]
    web: dict[str, Capability]


class ProjectInfo(BaseModel):
    """Kleine veilige projectidentiteit."""

    name: str
    version: str


class WebMilestoneInfo(BaseModel):
    """Status van de huidige web-mijlpaal."""

    name: str
    feature: str
    status: str


class ProgressItem(BaseModel):
    """Kleine statusregel voor de webvoortgang."""

    name: str
    status: str


class PlannedFeature(BaseModel):
    """Veilige samenvatting van een geplande webfeature."""

    name: str
    description: str
    milestone: str
    status: str = "planned"


class ValidationItem(BaseModel):
    """Veilige statusregel voor lokale en externe validatie."""

    name: str
    status: str
    note: str


class IntegrationInfo(BaseModel):
    """Veilige status van een optionele integratie."""

    name: str
    package: str
    package_status: str
    arclm_status: str
    note: str
    extra: str | None = None


class LimitationInfo(BaseModel):
    """Korte uitleg van een bekende beperking."""

    category: str
    title: str
    description: str
    status: str


class ProjectStatusResponse(BaseModel):
    """Veilige samenvatting van de huidige ArcLM projectstatus."""

    project: ProjectInfo
    web_milestone: WebMilestoneInfo
    available_sections: list[str]
    completed: list[ProgressItem] = Field(default_factory=list)
    current: ProgressItem | None = None
    next: list[ProgressItem] = Field(default_factory=list)
    planned_features: list[PlannedFeature] = Field(default_factory=list)
    validation: list[ValidationItem] = Field(default_factory=list)
    integrations: list[IntegrationInfo] = Field(default_factory=list)
    limitations: list[LimitationInfo] = Field(default_factory=list)
