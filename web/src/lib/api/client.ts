import type {
  CapabilitiesResponse,
  CheckpointListResponse,
  CheckpointDeleteRequest,
  CheckpointMetadataResponse,
  CheckpointValidationResponse,
  DatasetManifestReportResponse,
  DatasetManifestResponse,
  DatasetPasteRequest,
  DatasetRecordInspectionRequest,
  DatasetRecordTokenInspectionResponse,
  DatasetReportRequest,
  DatasetReportResponse,
  DatasetUploadRequest,
  DatasetValidationRequest,
  DatasetValidationResponse,
  DatasetField,
  DatasetFormat,
  DatasetInspectionMetadata,
  DatasetInspectionResponse,
  DatasetListResponse,
  DatasetPreviewRow,
  DatasetRefreshResponse,
  DatasetRootCreateRequest,
  DatasetRootInfo,
  DatasetRootListResponse,
  DatasetRootUpdateRequest,
  DatasetStatistics,
  DatasetSummary,
  DatasetWarning,
  EnvironmentResponse,
  EvaluationCompareRequest,
  EvaluationComparisonResponse,
  EvaluationCreateRequest,
  EvaluationListResponse,
  EvaluationMetadataResponse,
  EvaluationReportResponse,
  FineTuningPreviewRequest,
  FineTuningPreviewResponse,
  FineTuningValidationRequest,
  GenerationCreateRequest,
  GenerationDeleteRequest,
  GenerationListResponse,
  GenerationMetadataResponse,
  HealthResponse,
  ModelListResponse,
  NativeModelDeleteRequest,
  NativeModelRequest,
  NativeModelUpdateRequest,
  NativeModelValidationResponse,
  PipelineInspectionRequest,
  PipelineInspectionStatusResponse,
  PipelineTraceResponse,
  ProjectCreateRequest,
  ProjectDatasetListResponse,
  ProjectDatasetPreviewResponse,
  ProjectDeleteRequest,
  ProjectListResponse,
  ProjectStatusResponse,
  ProjectUpdateRequest,
  PretrainingValidationRequest,
  RunListResponse,
  RunLogResponse,
  StudioDatasetMetadata,
  StudioModelMetadata,
  StudioProject,
  StudioRunMetadata,
  StudioTokenizerMetadata,
  SystemStatusResponse,
  TextLengthStatistics,
  TokenizerCreateRequest,
  TokenizerInspectionResponse,
  TokenizerInspectRequest,
  TokenizerListResponse,
  TrainingModeValidationResponse,
  TrainingRunRequest
} from "./schemas";
import { apiEndpoints } from "./endpoints";

export class ApiClientError extends Error {
  code: string;
  status?: number;

  constructor(message: string, code = "request_failed", status?: number) {
    super(message);
    this.name = "ApiClientError";
    this.code = code;
    this.status = status;
  }
}

export type ApiClientOptions = {
  baseUrl?: string;
  timeoutMs?: number;
  fetcher?: typeof fetch;
};

const defaultBaseUrl = process.env.NEXT_PUBLIC_ARCLM_API_BASE_URL ?? "http://127.0.0.1:8765";
const defaultTimeoutMs = 5000;

function joinUrl(baseUrl: string, path: string) {
  return `${baseUrl.replace(/\/$/, "")}${path}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseApiError(value: unknown) {
  if (!isRecord(value) || !isRecord(value.error)) {
    return null;
  }
  const code = value.error.code;
  const message = value.error.message;
  if (typeof code !== "string" || typeof message !== "string") {
    return null;
  }
  return { code, message };
}

const datasetFormats = new Set(["txt", "csv", "json", "jsonl"]);
const fieldTypes = new Set(["string", "integer", "number", "boolean", "null", "object", "array", "mixed"]);
const rootOrigins = new Set(["persisted", "command_line"]);
const rootValidationStatuses = new Set(["valid", "warning", "error", "unvalidated"]);

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

function isDatasetFormat(value: unknown): value is DatasetFormat {
  return isString(value) && datasetFormats.has(value);
}

function isTextLengthStatistics(value: unknown): value is TextLengthStatistics {
  if (!isRecord(value)) {
    return false;
  }
  return (
    (value.min === null || isNumber(value.min)) &&
    (value.max === null || isNumber(value.max)) &&
    (value.average === null || isNumber(value.average))
  );
}

function isDatasetWarning(value: unknown): value is DatasetWarning {
  return isRecord(value) && isString(value.code) && isString(value.message);
}

function isDatasetSummary(value: unknown): value is DatasetSummary {
  return (
    isRecord(value) &&
    isString(value.dataset_id) &&
    isString(value.name) &&
    isDatasetFormat(value.format) &&
    isNumber(value.size_bytes) &&
    (value.source_name === undefined || value.source_name === null || isString(value.source_name)) &&
    (value.source_id === undefined || value.source_id === null || isString(value.source_id))
  );
}

function isDatasetRootInfo(value: unknown): value is DatasetRootInfo {
  return (
    isRecord(value) &&
    isString(value.root_id) &&
    isString(value.name) &&
    isString(value.path) &&
    isBoolean(value.enabled) &&
    isBoolean(value.recursive) &&
    isString(value.source_origin) &&
    rootOrigins.has(value.source_origin) &&
    isString(value.validation_status) &&
    rootValidationStatuses.has(value.validation_status) &&
    isNumber(value.supported_file_count) &&
    isNumber(value.ignored_file_count) &&
    Array.isArray(value.warnings) &&
    value.warnings.every(isDatasetWarning) &&
    isBoolean(value.removable) &&
    isBoolean(value.editable)
  );
}

function isDatasetField(value: unknown): value is DatasetField {
  return (
    isRecord(value) &&
    isString(value.name) &&
    isString(value.type) &&
    fieldTypes.has(value.type) &&
    isBoolean(value.nullable) &&
    isNumber(value.observed_in_rows) &&
    isNumber(value.missing_count) &&
    isNumber(value.empty_count)
  );
}

function isDatasetPreviewRow(value: unknown): value is DatasetPreviewRow {
  return isRecord(value) && isString(value.row_id) && isRecord(value.values);
}

function isDatasetStatistics(value: unknown): value is DatasetStatistics {
  if (!isRecord(value)) {
    return false;
  }
  return (
    isNumber(value.rows_scanned) &&
    (value.row_count === null || isNumber(value.row_count)) &&
    (value.row_count_scope === "exact" || value.row_count_scope === "bounded_scan" || value.row_count_scope === "unavailable") &&
    isNumber(value.field_count) &&
    (value.field_count_scope === "exact" || value.field_count_scope === "bounded_scan" || value.field_count_scope === "sample") &&
    isNumber(value.invalid_row_count) &&
    isNumber(value.duplicate_count) &&
    value.duplicate_scope === "bounded_scan" &&
    isTextLengthStatistics(value.text_lengths)
  );
}

function isDatasetMetadata(value: unknown): value is DatasetInspectionMetadata {
  if (!isRecord(value)) {
    return false;
  }
  return (
    isNumber(value.scanned_rows) &&
    isNumber(value.preview_rows) &&
    isNumber(value.scan_limit) &&
    isNumber(value.preview_limit) &&
    isNumber(value.max_field_length) &&
    isNumber(value.max_fields) &&
    isBoolean(value.truncated) &&
    isBoolean(value.complete) &&
    (value.schema_source === "sample" || value.schema_source === "empty")
  );
}

function isDatasetListResponse(value: unknown): value is DatasetListResponse {
  return (
    isRecord(value) &&
    Array.isArray(value.datasets) &&
    value.datasets.every(isDatasetSummary) &&
    isNumber(value.count)
  );
}

function isDatasetRootListResponse(value: unknown): value is DatasetRootListResponse {
  return (
    isRecord(value) &&
    Array.isArray(value.roots) &&
    value.roots.every(isDatasetRootInfo) &&
    isNumber(value.count) &&
    isNumber(value.active_count) &&
    isNumber(value.datasets_found) &&
    Array.isArray(value.warnings) &&
    value.warnings.every(isDatasetWarning)
  );
}

function isDatasetRefreshResponse(value: unknown): value is DatasetRefreshResponse {
  return (
    isRecord(value) &&
    isNumber(value.roots_scanned) &&
    isNumber(value.datasets_found) &&
    Array.isArray(value.warnings) &&
    value.warnings.every(isDatasetWarning)
  );
}

function isDatasetInspectionResponse(value: unknown): value is DatasetInspectionResponse {
  return (
    isRecord(value) &&
    isString(value.dataset_id) &&
    isString(value.name) &&
    isDatasetFormat(value.format) &&
    isNumber(value.size_bytes) &&
    isString(value.encoding) &&
    Array.isArray(value.fields) &&
    value.fields.every(isDatasetField) &&
    Array.isArray(value.preview_rows) &&
    value.preview_rows.every(isDatasetPreviewRow) &&
    isDatasetStatistics(value.statistics) &&
    isDatasetMetadata(value.metadata) &&
    Array.isArray(value.warnings) &&
    value.warnings.every(isDatasetWarning)
  );
}

function isNumberArray(value: unknown): value is number[] {
  return Array.isArray(value) && value.every(isNumber);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isString);
}

function isPipelineValues(value: unknown): value is Record<string, number[]> | null {
  if (value === null) {
    return true;
  }
  if (!isRecord(value)) {
    return false;
  }
  return Object.values(value).every(isNumberArray);
}

function isPipelineTraceResponse(value: unknown): value is PipelineTraceResponse {
  return (
    isRecord(value) &&
    isString(value.input_text) &&
    isStringArray(value.tokens) &&
    isNumberArray(value.token_ids) &&
    isNumber(value.sequence_length) &&
    isNumberArray(value.input_shape) &&
    isNumberArray(value.embedding_shape) &&
    isNumberArray(value.logits_shape) &&
    isNumber(value.selected_token_id) &&
    isString(value.selected_token) &&
    isString(value.generated_text) &&
    isString(value.device) &&
    isString(value.dtype) &&
    isString(value.model_class) &&
    isString(value.tokenizer_class) &&
    isNumber(value.inspected_steps) &&
    isNumber(value.generation_steps) &&
    isBoolean(value.attention_available) &&
    isString(value.attention_note) &&
    isStringArray(value.warnings) &&
    isPipelineValues(value.values)
  );
}

function isPipelineInspectionStatusResponse(value: unknown): value is PipelineInspectionStatusResponse {
  return (
    isRecord(value) &&
    isBoolean(value.available) &&
    isBoolean(value.initialized) &&
    (value.mode === null || isString(value.mode)) &&
    (value.reason === null || isString(value.reason)) &&
    Array.isArray(value.supported_modes) &&
    value.supported_modes.every(isString) &&
    (value.project_id === null || isString(value.project_id)) &&
    (value.checkpoint_id === null || isString(value.checkpoint_id)) &&
    (value.model_class === null || isString(value.model_class)) &&
    (value.tokenizer_class === null || isString(value.tokenizer_class)) &&
    (value.device === null || isString(value.device)) &&
    (value.dtype === null || isString(value.dtype)) &&
    isBoolean(value.supports_attention) &&
    isBoolean(value.supports_value_capture) &&
    isBoolean(value.supports_streaming) &&
    isBoolean(value.supports_external_models) &&
    (value.message === null || isString(value.message))
  );
}

function assertDatasetListResponse(value: unknown): DatasetListResponse {
  if (!isDatasetListResponse(value)) {
    throw new ApiClientError("The dataset list response did not match the expected schema.", "invalid_response");
  }
  return value;
}

function assertDatasetInspectionResponse(value: unknown): DatasetInspectionResponse {
  if (!isDatasetInspectionResponse(value)) {
    throw new ApiClientError("The dataset inspection response did not match the expected schema.", "invalid_response");
  }
  return value;
}

function assertPipelineTraceResponse(value: unknown): PipelineTraceResponse {
  if (!isPipelineTraceResponse(value)) {
    throw new ApiClientError("The pipeline inspection response did not match the expected schema.", "invalid_response");
  }
  return value;
}

function assertPipelineInspectionStatusResponse(value: unknown): PipelineInspectionStatusResponse {
  if (!isPipelineInspectionStatusResponse(value)) {
    throw new ApiClientError("The pipeline inspection status response did not match the expected schema.", "invalid_response");
  }
  return value;
}

function assertDatasetRootInfo(value: unknown): DatasetRootInfo {
  if (!isDatasetRootInfo(value)) {
    throw new ApiClientError("The dataset source response did not match the expected schema.", "invalid_response");
  }
  return value;
}

function assertDatasetRootListResponse(value: unknown): DatasetRootListResponse {
  if (!isDatasetRootListResponse(value)) {
    throw new ApiClientError("The dataset source list response did not match the expected schema.", "invalid_response");
  }
  return value;
}

function assertDatasetRefreshResponse(value: unknown): DatasetRefreshResponse {
  if (!isDatasetRefreshResponse(value)) {
    throw new ApiClientError("The dataset refresh response did not match the expected schema.", "invalid_response");
  }
  return value;
}

async function readJson(response: Response) {
  try {
    return await response.json();
  } catch {
    throw new ApiClientError("The backend returned invalid JSON.", "invalid_json", response.status);
  }
}

function withTimeout(timeoutMs: number) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);
  return { controller, timeout };
}

function getDefaultFetcher() {
  return globalThis.fetch.bind(globalThis);
}

export class ArcLMApiClient {
  private baseUrl: string;
  private timeoutMs: number;
  private fetcher: typeof fetch;

  constructor(options: ApiClientOptions = {}) {
    this.baseUrl = options.baseUrl ?? defaultBaseUrl;
    this.timeoutMs = options.timeoutMs ?? defaultTimeoutMs;
    this.fetcher = options.fetcher ?? getDefaultFetcher();
  }

  async request<T>(
    path: string,
    options: { method?: "GET" | "POST" | "PATCH" | "DELETE"; body?: unknown } = {}
  ): Promise<T> {
    const { controller, timeout } = withTimeout(this.timeoutMs);
    const method = options.method ?? "GET";
    try {
      const response = await this.fetcher(joinUrl(this.baseUrl, path), {
        method,
        headers: {
          accept: "application/json",
          ...(options.body === undefined ? {} : { "content-type": "application/json" })
        },
        body: options.body === undefined ? undefined : JSON.stringify(options.body),
        signal: controller.signal
      });
      const data = await readJson(response);
      if (!response.ok) {
        const apiError = parseApiError(data);
        if (apiError) {
          throw new ApiClientError(apiError.message, apiError.code, response.status);
        }
        throw new ApiClientError(`Backend request failed with status ${response.status}.`, "http_error", response.status);
      }
      return data as T;
    } catch (error) {
      if (error instanceof ApiClientError) {
        throw error;
      }
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new ApiClientError("The backend request timed out.", "timeout");
      }
      throw new ApiClientError("The backend is disconnected.", "disconnected");
    } finally {
      window.clearTimeout(timeout);
    }
  }

  getHealth() {
    return this.request<HealthResponse>(apiEndpoints.health);
  }

  getEnvironment() {
    return this.request<EnvironmentResponse>(apiEndpoints.environment);
  }

  getCapabilities() {
    return this.request<CapabilitiesResponse>(apiEndpoints.capabilities);
  }

  getSystemStatus() {
    return this.request<SystemStatusResponse>(apiEndpoints.systemStatus);
  }

  getProjectStatus() {
    return this.request<ProjectStatusResponse>(apiEndpoints.projectStatus);
  }

  listProjects() {
    return this.request<ProjectListResponse>(apiEndpoints.projects);
  }

  createProject(payload: ProjectCreateRequest) {
    return this.request<StudioProject>(apiEndpoints.projects, { method: "POST", body: payload });
  }

  getProject(projectId: string) {
    return this.request<StudioProject>(apiEndpoints.project(projectId));
  }

  updateProject(projectId: string, payload: ProjectUpdateRequest) {
    return this.request<StudioProject>(apiEndpoints.project(projectId), { method: "PATCH", body: payload });
  }

  deleteProject(projectId: string, payload: ProjectDeleteRequest) {
    return this.request<StudioProject>(apiEndpoints.project(projectId), { method: "DELETE", body: payload });
  }

  listProjectDatasets(projectId: string) {
    return this.request<ProjectDatasetListResponse>(apiEndpoints.projectDatasets(projectId));
  }

  uploadProjectDataset(projectId: string, payload: DatasetUploadRequest) {
    return this.request<StudioDatasetMetadata>(apiEndpoints.projectDatasetUpload(projectId), { method: "POST", body: payload });
  }

  pasteProjectDataset(projectId: string, payload: DatasetPasteRequest) {
    return this.request<StudioDatasetMetadata>(apiEndpoints.projectDatasetPaste(projectId), { method: "POST", body: payload });
  }

  getProjectDataset(projectId: string, datasetId: string) {
    return this.request<StudioDatasetMetadata>(apiEndpoints.projectDataset(projectId, datasetId));
  }

  getProjectDatasetPreview(projectId: string, datasetId: string) {
    return this.request<ProjectDatasetPreviewResponse>(apiEndpoints.projectDatasetPreview(projectId, datasetId));
  }

  validateProjectDataset(projectId: string, datasetId: string, payload: DatasetValidationRequest) {
    return this.request<DatasetValidationResponse>(apiEndpoints.projectDatasetValidate(projectId, datasetId), { method: "POST", body: payload });
  }

  createProjectDatasetReport(projectId: string, datasetId: string, payload?: DatasetReportRequest) {
    return this.request<DatasetManifestReportResponse>(
      apiEndpoints.projectDatasetReport(projectId, datasetId),
      payload === undefined ? { method: "POST" } : { method: "POST", body: payload }
    );
  }

  getProjectDatasetManifest(projectId: string, datasetId: string) {
    return this.request<DatasetManifestResponse>(apiEndpoints.projectDatasetManifest(projectId, datasetId));
  }

  getProjectDatasetReport(projectId: string, datasetId: string) {
    return this.request<DatasetReportResponse>(apiEndpoints.projectDatasetReport(projectId, datasetId));
  }

  deleteProjectDataset(projectId: string, datasetId: string, confirm = true) {
    return this.request<StudioDatasetMetadata>(apiEndpoints.projectDataset(projectId, datasetId), { method: "DELETE", body: { confirm } });
  }

  listProjectTokenizers(projectId: string) {
    return this.request<TokenizerListResponse>(apiEndpoints.projectTokenizers(projectId));
  }

  createNativeTokenizer(projectId: string, payload: TokenizerCreateRequest) {
    return this.request<StudioTokenizerMetadata>(apiEndpoints.projectTokenizerNative(projectId), { method: "POST", body: payload });
  }

  getProjectTokenizer(projectId: string, tokenizerId: string) {
    return this.request<StudioTokenizerMetadata>(apiEndpoints.projectTokenizer(projectId, tokenizerId));
  }

  inspectProjectTokenizer(projectId: string, tokenizerId: string, payload: TokenizerInspectRequest) {
    return this.request<TokenizerInspectionResponse>(apiEndpoints.projectTokenizerInspect(projectId, tokenizerId), { method: "POST", body: payload });
  }

  deleteProjectTokenizer(projectId: string, tokenizerId: string, confirm = true) {
    return this.request<StudioTokenizerMetadata>(apiEndpoints.projectTokenizer(projectId, tokenizerId), { method: "DELETE", body: { confirm } });
  }

  inspectProjectDatasetRecords(projectId: string, datasetId: string, payload: DatasetRecordInspectionRequest) {
    return this.request<DatasetRecordTokenInspectionResponse>(apiEndpoints.projectDatasetInspect(projectId, datasetId), { method: "POST", body: payload });
  }

  listProjectModels(projectId: string) {
    return this.request<ModelListResponse>(apiEndpoints.projectModels(projectId));
  }

  validateNativeModel(projectId: string, payload: NativeModelRequest) {
    return this.request<NativeModelValidationResponse>(apiEndpoints.projectModelValidate(projectId), { method: "POST", body: payload });
  }

  estimateNativeModel(projectId: string, payload: NativeModelRequest) {
    return this.request<NativeModelValidationResponse>(apiEndpoints.projectModelEstimate(projectId), { method: "POST", body: payload });
  }

  createNativeModel(projectId: string, payload: NativeModelRequest) {
    return this.request<StudioModelMetadata>(apiEndpoints.projectModelNative(projectId), { method: "POST", body: payload });
  }

  getProjectModel(projectId: string, modelId: string) {
    return this.request<StudioModelMetadata>(apiEndpoints.projectModel(projectId, modelId));
  }

  updateProjectModel(projectId: string, modelId: string, payload: NativeModelUpdateRequest) {
    return this.request<StudioModelMetadata>(apiEndpoints.projectModel(projectId, modelId), { method: "PATCH", body: payload });
  }

  deleteProjectModel(projectId: string, modelId: string, payload: NativeModelDeleteRequest) {
    return this.request<StudioModelMetadata>(apiEndpoints.projectModel(projectId, modelId), { method: "DELETE", body: payload });
  }

  listProjectRuns(projectId: string) {
    return this.request<RunListResponse>(apiEndpoints.projectRuns(projectId));
  }

  createProjectRun(projectId: string, payload: TrainingRunRequest) {
    return this.request<StudioRunMetadata>(apiEndpoints.projectRuns(projectId), { method: "POST", body: payload });
  }

  validateProjectPretraining(projectId: string, payload: PretrainingValidationRequest) {
    return this.request<TrainingModeValidationResponse>(apiEndpoints.projectPretrainingValidate(projectId), { method: "POST", body: payload });
  }

  validateProjectFinetuning(projectId: string, payload: FineTuningValidationRequest) {
    return this.request<TrainingModeValidationResponse>(apiEndpoints.projectFinetuningValidate(projectId), { method: "POST", body: payload });
  }

  previewProjectFinetuning(projectId: string, payload: FineTuningPreviewRequest) {
    return this.request<FineTuningPreviewResponse>(apiEndpoints.projectFinetuningPreview(projectId), { method: "POST", body: payload });
  }

  getProjectRun(projectId: string, runId: string) {
    return this.request<StudioRunMetadata>(apiEndpoints.projectRun(projectId, runId));
  }

  getProjectRunMetrics(projectId: string, runId: string) {
    return this.request<RunLogResponse>(apiEndpoints.projectRunMetrics(projectId, runId));
  }

  getProjectRunEvents(projectId: string, runId: string) {
    return this.request<RunLogResponse>(apiEndpoints.projectRunEvents(projectId, runId));
  }

  cancelProjectRun(projectId: string, runId: string) {
    return this.request<StudioRunMetadata>(apiEndpoints.projectRunCancel(projectId, runId), { method: "POST" });
  }

  listProjectRunCheckpoints(projectId: string, runId: string) {
    return this.request<CheckpointListResponse>(apiEndpoints.projectRunCheckpoints(projectId, runId));
  }

  getProjectRunCheckpoint(projectId: string, runId: string, checkpointId: string) {
    return this.request<CheckpointMetadataResponse>(apiEndpoints.projectRunCheckpoint(projectId, runId, checkpointId));
  }

  listProjectCheckpoints(projectId: string) {
    return this.request<CheckpointListResponse>(apiEndpoints.projectCheckpoints(projectId));
  }

  getProjectCheckpoint(projectId: string, checkpointId: string) {
    return this.request<CheckpointMetadataResponse>(apiEndpoints.projectCheckpoint(projectId, checkpointId));
  }

  validateProjectCheckpoint(projectId: string, checkpointId: string) {
    return this.request<CheckpointValidationResponse>(apiEndpoints.projectCheckpointValidate(projectId, checkpointId), { method: "POST" });
  }

  deleteProjectCheckpoint(projectId: string, checkpointId: string, payload: CheckpointDeleteRequest) {
    return this.request<CheckpointMetadataResponse>(apiEndpoints.projectCheckpoint(projectId, checkpointId), { method: "DELETE", body: payload });
  }

  inspectProjectCheckpoint(projectId: string, checkpointId: string, payload: PipelineInspectionRequest) {
    return this.request<PipelineTraceResponse>(apiEndpoints.projectCheckpointInspect(projectId, checkpointId), { method: "POST", body: payload });
  }

  listProjectEvaluations(projectId: string) {
    return this.request<EvaluationListResponse>(apiEndpoints.projectEvaluations(projectId));
  }

  createProjectEvaluation(projectId: string, payload: EvaluationCreateRequest) {
    return this.request<EvaluationMetadataResponse>(apiEndpoints.projectEvaluations(projectId), { method: "POST", body: payload });
  }

  getProjectEvaluation(projectId: string, evaluationId: string) {
    return this.request<EvaluationMetadataResponse>(apiEndpoints.projectEvaluation(projectId, evaluationId));
  }

  getProjectEvaluationEvents(projectId: string, evaluationId: string) {
    return this.request<RunLogResponse>(apiEndpoints.projectEvaluationEvents(projectId, evaluationId));
  }

  getProjectEvaluationReport(projectId: string, evaluationId: string) {
    return this.request<EvaluationReportResponse>(apiEndpoints.projectEvaluationReport(projectId, evaluationId));
  }

  cancelProjectEvaluation(projectId: string, evaluationId: string) {
    return this.request<EvaluationMetadataResponse>(apiEndpoints.projectEvaluationCancel(projectId, evaluationId), { method: "POST" });
  }

  compareProjectEvaluations(projectId: string, payload: EvaluationCompareRequest) {
    return this.request<EvaluationComparisonResponse>(apiEndpoints.projectEvaluationCompare(projectId), { method: "POST", body: payload });
  }

  listProjectGenerations(projectId: string) {
    return this.request<GenerationListResponse>(apiEndpoints.projectGenerations(projectId));
  }

  createProjectGeneration(projectId: string, payload: GenerationCreateRequest) {
    return this.request<GenerationMetadataResponse>(apiEndpoints.projectGenerations(projectId), { method: "POST", body: payload });
  }

  getProjectGeneration(projectId: string, generationId: string) {
    return this.request<GenerationMetadataResponse>(apiEndpoints.projectGeneration(projectId, generationId));
  }

  deleteProjectGeneration(projectId: string, generationId: string, payload: GenerationDeleteRequest) {
    return this.request<GenerationMetadataResponse>(apiEndpoints.projectGeneration(projectId, generationId), { method: "DELETE", body: payload });
  }

  async getPipelineInspectionStatus() {
    return assertPipelineInspectionStatusResponse(await this.request<unknown>(apiEndpoints.pipelineInspectionStatus));
  }

  async inspectPipelineText(payload: PipelineInspectionRequest) {
    return assertPipelineTraceResponse(
      await this.request<unknown>(apiEndpoints.pipelineInspection, { method: "POST", body: payload })
    );
  }

  async getDatasets() {
    return assertDatasetListResponse(await this.request<unknown>(apiEndpoints.datasets));
  }

  async getDatasetInspection(datasetId: string) {
    return assertDatasetInspectionResponse(await this.request<unknown>(apiEndpoints.datasetInspection(datasetId)));
  }

  async getDatasetRoots() {
    return assertDatasetRootListResponse(await this.request<unknown>(apiEndpoints.datasetRoots));
  }

  async addDatasetRoot(payload: DatasetRootCreateRequest) {
    return assertDatasetRootInfo(await this.request<unknown>(apiEndpoints.datasetRoots, { method: "POST", body: payload }));
  }

  async updateDatasetRoot(rootId: string, payload: DatasetRootUpdateRequest) {
    return assertDatasetRootInfo(await this.request<unknown>(apiEndpoints.datasetRoot(rootId), { method: "PATCH", body: payload }));
  }

  async removeDatasetRoot(rootId: string) {
    return assertDatasetRootInfo(await this.request<unknown>(apiEndpoints.datasetRoot(rootId), { method: "DELETE" }));
  }

  async validateDatasetRoot(rootId: string) {
    return assertDatasetRootInfo(await this.request<unknown>(apiEndpoints.datasetRootValidate(rootId), { method: "POST" }));
  }

  async refreshDatasets() {
    return assertDatasetRefreshResponse(await this.request<unknown>(apiEndpoints.datasetRefresh, { method: "POST" }));
  }
}

export function createApiClient(options?: ApiClientOptions) {
  return new ArcLMApiClient(options);
}
