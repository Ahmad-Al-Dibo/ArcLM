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
  active_compute_operation: string;
  warnings: string[];
  diagnostics: Record<string, unknown>;
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
  dataset_id?: string | null;
  manifest: Record<string, unknown>;
  report: Record<string, unknown>;
  tokenizer?: Record<string, unknown> | null;
  report_identity?: Record<string, unknown> | null;
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
  tokenizer_type?: "word" | "sentencepiece";
  sentencepiece_model_type?: "bpe" | "unigram" | "char" | "word" | null;
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
  tokenizer_type?: "word" | "sentencepiece";
  sentencepiece_model_type?: "bpe" | "unigram" | "char" | "word";
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

export type DatasetReportRequest = {
  tokenizer_id?: string | null;
  maximum_sequence_length?: number | null;
};

export type DatasetRecordInspectionRequest = {
  tokenizer_id: string;
  record_indexes: number[];
  text_fields: string[];
  maximum_sequence_length?: number | null;
  max_records?: number;
  max_tokens_per_record?: number;
};

export type DatasetRecordTokenInspectionResponse = {
  dataset_id: string;
  tokenizer: Record<string, unknown>;
  maximum_sequence_length: number | null;
  records: Array<Record<string, unknown>>;
};

export type StudioModelMetadata = {
  id: string;
  project_id: string;
  name: string;
  source: "native_arclm";
  task: "causal_language_modeling";
  status: "configured";
  created_at: number;
  updated_at: number;
  tokenizer_id: string;
  dataset_id: string | null;
  configuration: Record<string, unknown>;
  parameter_count: number;
  estimated_memory: Record<string, unknown>;
  capabilities: Record<string, unknown>;
};

export type ModelListResponse = {
  models: StudioModelMetadata[];
  count: number;
};

export type NativeModelRequest = {
  name?: string;
  tokenizer_id: string;
  dataset_id?: string | null;
  configuration: Record<string, unknown>;
};

export type NativeModelUpdateRequest = {
  name?: string | null;
  configuration?: Record<string, unknown> | null;
};

export type NativeModelDeleteRequest = {
  confirm: boolean;
};

export type NativeModelValidationResponse = {
  valid: boolean;
  configuration: Record<string, unknown>;
  parameter_count: number;
  estimated_memory: Record<string, unknown>;
  capabilities: Record<string, unknown>;
  warnings: string[];
};

export type TrainingRunRequest = {
  name?: string;
  dataset_id: string;
  tokenizer_id: string;
  model_id: string;
  training_type?: "native_causal_lm";
  training_mode?: "pretraining" | "fine_tuning";
  fine_tuning_method?: "full" | "sft" | null;
  base_checkpoint_id?: string | null;
  fine_tuning_format?: Record<string, unknown> | null;
  preview_configuration_fingerprint?: string | null;
  epochs?: number;
  batch_size?: number;
  learning_rate?: number;
  weight_decay?: number;
  gradient_accumulation_steps?: number;
  gradient_clip_norm?: number | null;
  optimizer?: "adamw" | "adam" | "sgd";
  scheduler?: "constant" | "linear" | "cosine";
  warmup_steps?: number;
  validation_split?: number;
  maximum_sequence_length?: number | null;
  seed?: number;
  device?: "auto" | "cpu" | "cuda";
  precision?: "fp32" | "fp16" | "bf16";
  checkpoint_interval?: number;
  maximum_checkpoints_to_keep?: number;
};

export type StudioRunMetadata = {
  id: string;
  project_id: string;
  name: string;
  status: "queued" | "starting" | "running" | "cancelling" | "cancelled" | "completed" | "failed" | "interrupted";
  training_type: string;
  training_mode: string;
  fine_tuning_method: string | null;
  base_checkpoint_id: string | null;
  created_at: number;
  updated_at: number;
  started_at: number | null;
  completed_at: number | null;
  dataset_id: string;
  tokenizer_id: string;
  model_id: string;
  current_epoch: number;
  total_epochs: number;
  current_step: number;
  total_steps: number | null;
  latest_metrics: Record<string, unknown>;
  latest_checkpoint_id: string | null;
  device: string;
  dtype: string;
  error: Record<string, unknown> | null;
  warnings: string[];
  configuration: Record<string, unknown>;
};

export type RunListResponse = {
  runs: StudioRunMetadata[];
  count: number;
};

export type RunLogResponse = {
  items: Array<Record<string, unknown>>;
  count: number;
};

export type CheckpointListResponse = {
  checkpoints: Array<Record<string, unknown>>;
  count: number;
};

export type CheckpointMetadataResponse = {
  checkpoint: Record<string, unknown>;
};

export type CheckpointValidationResponse = {
  valid: boolean;
  checkpoint: Record<string, unknown>;
  reload_status: string;
  warnings: string[];
};

export type CheckpointDeleteRequest = {
  confirm: boolean;
  checkpoint_name?: string | null;
};

export type EvaluationCreateRequest = {
  checkpoint_id: string;
  dataset_id: string;
  tokenizer_id: string;
  split?: string;
  batch_size?: number;
  maximum_sequence_length?: number | null;
  maximum_examples?: number;
  device?: "auto" | "cpu" | "cuda";
  precision?: "fp32" | "fp16" | "bf16";
  seed?: number;
  selected_metrics?: string[];
};

export type EvaluationListResponse = {
  evaluations: Array<Record<string, unknown>>;
  count: number;
};

export type EvaluationMetadataResponse = {
  evaluation: Record<string, unknown>;
};

export type EvaluationReportResponse = {
  report: Record<string, unknown>;
};

export type EvaluationCompareRequest = {
  evaluation_ids: string[];
};

export type EvaluationComparisonResponse = {
  compatible: boolean;
  warnings: string[];
  rows: Array<Record<string, unknown>>;
  csv: string;
};

export type GenerationCreateRequest = {
  checkpoint_id: string;
  prompt: string;
  max_new_tokens?: number;
  temperature?: number;
  top_k?: number | null;
  top_p?: number | null;
  seed?: number | null;
  device?: "auto" | "cpu" | "cuda";
  precision?: "fp32" | "fp16" | "bf16";
  include_token_details?: boolean;
};

export type GenerationDeleteRequest = {
  confirm: boolean;
};

export type GenerationListResponse = {
  generations: Array<Record<string, unknown>>;
  count: number;
};

export type GenerationMetadataResponse = {
  generation: Record<string, unknown>;
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
  source_mode?: "configured" | "demo" | "project_model" | "checkpoint";
  project_id?: string | null;
  dataset_id?: string | null;
  tokenizer_id?: string | null;
  model_id?: string | null;
  checkpoint_id?: string | null;
  device?: "auto" | "cpu" | "cuda";
  precision?: "fp32";
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
  source_mode?: string | null;
  source_label?: string | null;
  model_state?: string | null;
  tokenizer?: Record<string, unknown> | null;
  model?: Record<string, unknown> | null;
};

export type PipelineInspectionStatusResponse = {
  available: boolean;
  initialized: boolean;
  mode: string | null;
  reason: string | null;
  supported_modes: string[];
  project_id: string | null;
  checkpoint_id: string | null;
  model_class: string | null;
  tokenizer_class: string | null;
  device: string | null;
  dtype: string | null;
  supports_attention: boolean;
  supports_value_capture: boolean;
  supports_streaming: boolean;
  supports_external_models: boolean;
  message: string | null;
};

export type FineTuningFormattingRequest = {
  dataset_format?: "instruction_response" | "prompt_completion" | "plain_text";
  instruction_field?: string;
  response_field?: string;
  prompt_field?: string;
  completion_field?: string;
  text_field?: string;
  context_field?: string | null;
  instruction_tag?: string;
  response_tag?: string;
  end_tag?: string;
  separator?: string;
  end_behavior?: "custom_tag" | "custom_end_tag" | "tokenizer_eos" | "none";
  append_end_tag?: boolean;
  register_tags_as_special_tokens?: boolean;
  train_on_response_only?: boolean;
  maximum_sequence_length?: number;
  preview_configuration_fingerprint?: string | null;
};

export type FineTuningValidationRequest = {
  training_mode?: "fine_tuning";
  fine_tuning_method?: "full" | "sft";
  base_model_id?: string | null;
  base_checkpoint_id?: string | null;
  dataset_id: string;
  tokenizer_id: string;
  formatting?: FineTuningFormattingRequest;
  device?: "auto" | "cpu" | "cuda";
  precision?: "fp32";
};

export type FineTuningPreviewRequest = FineTuningValidationRequest & {
  preview_records?: number;
};

export type PretrainingValidationRequest = {
  training_mode?: "pretraining";
  dataset_id: string;
  tokenizer_id: string;
  model_id: string;
  device?: "auto" | "cpu" | "cuda";
  precision?: "fp32";
};

export type TrainingModeValidationResponse = {
  valid: boolean;
  training_mode: string;
  fine_tuning_method: string | null;
  compatibility: Record<string, unknown>;
  warnings: string[];
  errors: Array<{ code: string; message: string; details?: Record<string, unknown> | null }>;
  format_fingerprint?: string | null;
  preview_configuration_fingerprint?: string | null;
  label_strategy?: string | null;
};

export type FineTuningPreviewRecord = {
  index: number;
  original_record: Record<string, unknown>;
  formatted_text: string;
  tokens: string[];
  token_ids: number[];
  labels?: number[];
  label_mask: string[];
  sequence_length: number;
  original_token_count?: number;
  truncated: boolean;
  unknown_token_count: number;
  special_tags_detected: string[];
  warnings?: string[];
};

export type FineTuningPreviewResponse = TrainingModeValidationResponse & {
  formatting: Record<string, unknown>;
  format_fingerprint?: string | null;
  preview_configuration_fingerprint?: string | null;
  records: FineTuningPreviewRecord[];
};
