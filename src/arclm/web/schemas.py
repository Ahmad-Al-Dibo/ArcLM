"""Responsemodellen voor de lokale ArcLM Web API."""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


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


class ErrorResponse(BaseModel):
    """Standaard foutresponse voor de Web API."""

    error: ErrorDetail


class DatasetWarning(BaseModel):
    """Waarschuwing die bij inspectie hoort."""

    code: str
    message: str


class DatasetSummary(BaseModel):
    """Veilige datasetinformatie voor de catalogus."""

    dataset_id: str
    name: str
    format: Literal["txt", "csv", "json", "jsonl"]
    size_bytes: int


class DatasetListResponse(BaseModel):
    """Lijst met datasets uit de geconfigureerde roots."""

    datasets: list[DatasetSummary]
    count: int


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
