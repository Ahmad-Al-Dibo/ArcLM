export type BackendState = "not_implemented" | "connecting" | "connected" | "disconnected" | "error";

export type CapabilityStatus =
  | "available"
  | "locally_verified"
  | "verified_for_correctness"
  | "planned"
  | "experimental"
  | "hardware_unavailable"
  | "dependency_missing"
  | "not_verified"
  | "unsupported";

export type HealthResponse = {
  status: "ok";
  service: "arclm-web-api";
  version: string;
};

export type GpuInfo = {
  name: string;
  vram_bytes: number | null;
  compute_capability: [number, number] | null;
};

export type EnvironmentResponse = {
  arclm_version: string;
  python_version: string;
  platform: string;
  pytorch_version: string | null;
  cuda_available: boolean;
  cuda_runtime: string | null;
  device_count: number;
  available_devices: string[];
  preferred_device: string;
  gpus: GpuInfo[];
  bf16_supported: boolean | null;
};

export type OptionalDependencyStatus = {
  package: string;
  available: boolean;
};

export type StudioWorkspaceStatus = {
  available: boolean;
  project_count: number;
  active_dataset_count: number;
  active_tokenizer_count: number;
};

export type SystemStatusResponse = {
  arclm_version: string;
  python_version: string;
  pytorch_version: string | null;
  operating_system: string;
  cpu: string | null;
  cuda_available: boolean;
  cuda_version: string | null;
  gpu_name: string | null;
  gpu_count: number;
  current_device: string;
  optional_dependencies: Record<string, OptionalDependencyStatus>;
  backend_health: HealthResponse;
  workspace: StudioWorkspaceStatus;
};

export type StudioProject = {
  id: string;
  name: string;
  description: string;
  created_at: number;
  updated_at: number;
  arclm_version: string;
  status: "active";
  active_dataset_id: string | null;
  active_tokenizer_id: string | null;
};

export type ProjectListResponse = {
  projects: StudioProject[];
  count: number;
};

export type ProjectCreateRequest = {
  name: string;
  description?: string;
};

export type ProjectUpdateRequest = {
  name?: string | null;
  description?: string | null;
};

export type ProjectDeleteRequest = {
  confirm: boolean;
  confirm_name?: string | null;
};

export type StudioDatasetMetadata = {
  id: string;
  project_id: string;
  name: string;
  source_type: "upload" | "paste";
  original_filename: string | null;
  stored_format: DatasetFormat;
  created_at: number;
  size_bytes: number;
  record_count: number;
  selected_format: string;
  text_fields: string[];
  validation_status: "not_validated" | "valid" | "invalid";
  raw_filename: string;
  validation_result: Record<string, unknown> | null;
  sft_validation_result: Record<string, unknown> | null;
};

export type DatasetUploadRequest = {
  name: string;
  original_filename: string;
  content: string;
  stored_format?: DatasetFormat | null;
  selected_format?: string;
  text_fields?: string[];
};

export type DatasetPasteRequest = {
  name: string;
  content: string;
  stored_format: DatasetFormat;
  selected_format?: string;
  text_fields?: string[];
};

export type DatasetValidationRequest = {
  selected_format: string;
  text_fields: string[];
  strict?: boolean;
};

export type ProjectDatasetListResponse = {
  datasets: StudioDatasetMetadata[];
  count: number;
};

export type ProjectDatasetPreviewResponse = {
  dataset: StudioDatasetMetadata;
  fields: string[];
  total_records: number;
  preview_limit: number;
  truncated: boolean;
  records: Array<{ index: number; values: Record<string, DatasetPreviewValue> }>;
};

export type DatasetValidationResponse = {
  dataset: StudioDatasetMetadata;
  validation: Record<string, unknown>;
  sft_validation: Record<string, unknown> | null;
};

export type DatasetManifestReportResponse = {
  manifest: Record<string, unknown>;
  report: Record<string, unknown>;
};

export type DatasetManifestResponse = {
  manifest: Record<string, unknown>;
};

export type DatasetReportResponse = {
  report: Record<string, unknown>;
};

export type StudioTokenizerMetadata = {
  id: string;
  project_id: string;
  name: string;
  type: "native";
  vocab_size: number;
  created_at: number;
  source_dataset_id: string;
  special_tokens: Record<string, string>;
  status: "ready";
  tokenizer_filename: string;
};

export type TokenizerListResponse = {
  tokenizers: StudioTokenizerMetadata[];
  count: number;
};

export type TokenizerCreateRequest = {
  name: string;
  dataset_id: string;
  max_vocab?: number;
  text_fields?: string[];
};

export type TokenizerInspectRequest = {
  text: string;
};

export type TokenizerInspectionResponse = {
  text: string;
  tokens: string[];
  token_ids: number[];
  token_count: number;
  unknown_token_count: number;
  decoded_text: string;
  round_trip_matches: boolean;
  tokenizer_class: string;
  vocab_size: number;
  warnings: string[];
};

export type Capability = {
  status: CapabilityStatus;
  note: string;
  evidence?: string | null;
  hardware_requirement?: string | null;
  optional_dependency?: string | null;
  product_state?: string | null;
};

export type CapabilitiesResponse = {
  training: Record<string, Capability>;
  evaluation: Record<string, Capability>;
  inference: Record<string, Capability>;
  web: Record<string, Capability>;
};

export type ProjectStatusResponse = {
  project: {
    name: string;
    version: string;
  };
  web_milestone: {
    name: string;
    feature: string;
    status: string;
  };
  available_sections: string[];
  completed: Array<{
    name: string;
    status: string;
  }>;
  current: {
    name: string;
    status: string;
  } | null;
  next: Array<{
    name: string;
    status: string;
  }>;
  planned_features: Array<{
    name: string;
    description: string;
    milestone: string;
    status: string;
  }>;
  validation: Array<{
    name: string;
    status: string;
    note: string;
  }>;
  integrations: Array<{
    name: string;
    package: string;
    package_status: string;
    arclm_status: string;
    note: string;
    extra: string | null;
  }>;
  limitations: Array<{
    category: string;
    title: string;
    description: string;
    status: string;
  }>;
};

export type ApiErrorResponse = {
  error: {
    code: string;
    message: string;
  };
};

export type DatasetFormat = "txt" | "csv" | "json" | "jsonl";

export type DatasetFieldType =
  | "string"
  | "integer"
  | "number"
  | "boolean"
  | "null"
  | "object"
  | "array"
  | "mixed";

export type DatasetWarning = {
  code: string;
  message: string;
};

export type DatasetRootSourceOrigin = "persisted" | "command_line";

export type DatasetRootValidationStatus = "valid" | "warning" | "error" | "unvalidated";

export type DatasetRootInfo = {
  root_id: string;
  name: string;
  path: string;
  enabled: boolean;
  recursive: boolean;
  source_origin: DatasetRootSourceOrigin;
  validation_status: DatasetRootValidationStatus;
  supported_file_count: number;
  ignored_file_count: number;
  warnings: DatasetWarning[];
  removable: boolean;
  editable: boolean;
};

export type DatasetRootListResponse = {
  roots: DatasetRootInfo[];
  count: number;
  active_count: number;
  datasets_found: number;
  warnings: DatasetWarning[];
};

export type DatasetRootCreateRequest = {
  name: string;
  path: string;
  recursive?: boolean;
};

export type DatasetRootUpdateRequest = {
  name?: string;
  enabled?: boolean;
  recursive?: boolean;
};

export type DatasetRefreshResponse = {
  roots_scanned: number;
  datasets_found: number;
  warnings: DatasetWarning[];
};

export type DatasetSummary = {
  dataset_id: string;
  name: string;
  format: DatasetFormat;
  size_bytes: number;
  source_name?: string | null;
  source_id?: string | null;
};

export type DatasetListResponse = {
  datasets: DatasetSummary[];
  count: number;
};

export type DatasetField = {
  name: string;
  type: DatasetFieldType;
  nullable: boolean;
  observed_in_rows: number;
  missing_count: number;
  empty_count: number;
};

export type DatasetPreviewValue = string | number | boolean | null | Record<string, unknown> | unknown[];

export type DatasetPreviewRow = {
  row_id: string;
  values: Record<string, DatasetPreviewValue>;
};

export type TextLengthStatistics = {
  min: number | null;
  max: number | null;
  average: number | null;
};

export type DatasetStatistics = {
  rows_scanned: number;
  row_count: number | null;
  row_count_scope: "exact" | "bounded_scan" | "unavailable";
  field_count: number;
  field_count_scope: "exact" | "bounded_scan" | "sample";
  invalid_row_count: number;
  duplicate_count: number;
  duplicate_scope: "bounded_scan";
  text_lengths: TextLengthStatistics;
};

export type DatasetInspectionMetadata = {
  scanned_rows: number;
  preview_rows: number;
  scan_limit: number;
  preview_limit: number;
  max_field_length: number;
  max_fields: number;
  truncated: boolean;
  complete: boolean;
  schema_source: "sample" | "empty";
};

export type DatasetInspectionResponse = {
  dataset_id: string;
  name: string;
  format: DatasetFormat;
  size_bytes: number;
  encoding: string;
  fields: DatasetField[];
  preview_rows: DatasetPreviewRow[];
  statistics: DatasetStatistics;
  metadata: DatasetInspectionMetadata;
  warnings: DatasetWarning[];
};

export type PipelineInspectionRequest = {
  text: string;
  include_values?: boolean;
  max_values?: number;
};

export type PipelineTraceResponse = {
  input_text: string;
  tokens: string[];
  token_ids: number[];
  sequence_length: number;
  input_shape: number[];
  embedding_shape: number[];
  logits_shape: number[];
  selected_token_id: number;
  selected_token: string;
  generated_text: string;
  device: string;
  dtype: string;
  model_class: string;
  tokenizer_class: string;
  inspected_steps: number;
  generation_steps: number;
  attention_available: boolean;
  attention_note: string;
  warnings: string[];
  values: Record<string, number[]> | null;
};

export type PipelineInspectionStatusResponse = {
  available: boolean;
  model_class: string | null;
  tokenizer_class: string | null;
  supports_attention: boolean;
  supports_value_capture: boolean;
  supports_streaming: boolean;
  supports_external_models: boolean;
  message: string | null;
};
