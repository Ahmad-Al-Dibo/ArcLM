import type {
  CapabilitiesResponse,
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
  HealthResponse,
  ProjectStatusResponse,
  TextLengthStatistics
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

  getProjectStatus() {
    return this.request<ProjectStatusResponse>(apiEndpoints.projectStatus);
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
