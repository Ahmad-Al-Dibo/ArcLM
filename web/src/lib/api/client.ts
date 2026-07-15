import type {
  CapabilitiesResponse,
  DatasetField,
  DatasetFormat,
  DatasetInspectionMetadata,
  DatasetInspectionResponse,
  DatasetListResponse,
  DatasetPreviewRow,
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

const defaultBaseUrl = "http://127.0.0.1:8765";
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
    isNumber(value.size_bytes)
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

  async request<T>(path: string): Promise<T> {
    const { controller, timeout } = withTimeout(this.timeoutMs);
    try {
      const response = await this.fetcher(joinUrl(this.baseUrl, path), {
        method: "GET",
        headers: { accept: "application/json" },
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
}

export function createApiClient(options?: ApiClientOptions) {
  return new ArcLMApiClient(options);
}
