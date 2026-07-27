export const apiEndpoints = {
  health: "/api/health",
  environment: "/api/environment",
  capabilities: "/api/capabilities",
  systemStatus: "/api/system/status",
  projectStatus: "/api/project/status",
  projects: "/api/projects",
  project: (projectId: string) => `/api/projects/${encodeURIComponent(projectId)}`,
  projectDatasets: (projectId: string) => `/api/projects/${encodeURIComponent(projectId)}/datasets`,
  projectDatasetUpload: (projectId: string) => `/api/projects/${encodeURIComponent(projectId)}/datasets/upload`,
  projectDatasetPaste: (projectId: string) => `/api/projects/${encodeURIComponent(projectId)}/datasets/paste`,
  projectDataset: (projectId: string, datasetId: string) =>
    `/api/projects/${encodeURIComponent(projectId)}/datasets/${encodeURIComponent(datasetId)}`,
  projectDatasetPreview: (projectId: string, datasetId: string) =>
    `/api/projects/${encodeURIComponent(projectId)}/datasets/${encodeURIComponent(datasetId)}/preview`,
  projectDatasetValidate: (projectId: string, datasetId: string) =>
    `/api/projects/${encodeURIComponent(projectId)}/datasets/${encodeURIComponent(datasetId)}/validate`,
  projectDatasetReport: (projectId: string, datasetId: string) =>
    `/api/projects/${encodeURIComponent(projectId)}/datasets/${encodeURIComponent(datasetId)}/report`,
  projectDatasetManifest: (projectId: string, datasetId: string) =>
    `/api/projects/${encodeURIComponent(projectId)}/datasets/${encodeURIComponent(datasetId)}/manifest`,
  projectTokenizers: (projectId: string) => `/api/projects/${encodeURIComponent(projectId)}/tokenizers`,
  projectTokenizerNative: (projectId: string) => `/api/projects/${encodeURIComponent(projectId)}/tokenizers/native`,
  projectTokenizer: (projectId: string, tokenizerId: string) =>
    `/api/projects/${encodeURIComponent(projectId)}/tokenizers/${encodeURIComponent(tokenizerId)}`,
  projectTokenizerInspect: (projectId: string, tokenizerId: string) =>
    `/api/projects/${encodeURIComponent(projectId)}/tokenizers/${encodeURIComponent(tokenizerId)}/inspect`,
  projectModels: (projectId: string) => `/api/projects/${encodeURIComponent(projectId)}/models`,
  projectModelNative: (projectId: string) => `/api/projects/${encodeURIComponent(projectId)}/models/native`,
  projectModelValidate: (projectId: string) => `/api/projects/${encodeURIComponent(projectId)}/models/native/validate`,
  projectModelEstimate: (projectId: string) => `/api/projects/${encodeURIComponent(projectId)}/models/native/estimate`,
  projectModel: (projectId: string, modelId: string) =>
    `/api/projects/${encodeURIComponent(projectId)}/models/${encodeURIComponent(modelId)}`,
  projectDatasetInspect: (projectId: string, datasetId: string) =>
    `/api/projects/${encodeURIComponent(projectId)}/datasets/${encodeURIComponent(datasetId)}/inspect`,
  projectRuns: (projectId: string) => `/api/projects/${encodeURIComponent(projectId)}/runs`,
  projectPretrainingValidate: (projectId: string) =>
    `/api/projects/${encodeURIComponent(projectId)}/training/pretraining/validate`,
  projectFinetuningValidate: (projectId: string) =>
    `/api/projects/${encodeURIComponent(projectId)}/training/finetuning/validate`,
  projectFinetuningPreview: (projectId: string) =>
    `/api/projects/${encodeURIComponent(projectId)}/training/finetuning/preview`,
  projectRun: (projectId: string, runId: string) =>
    `/api/projects/${encodeURIComponent(projectId)}/runs/${encodeURIComponent(runId)}`,
  projectRunMetrics: (projectId: string, runId: string) =>
    `/api/projects/${encodeURIComponent(projectId)}/runs/${encodeURIComponent(runId)}/metrics`,
  projectRunEvents: (projectId: string, runId: string) =>
    `/api/projects/${encodeURIComponent(projectId)}/runs/${encodeURIComponent(runId)}/events`,
  projectRunCancel: (projectId: string, runId: string) =>
    `/api/projects/${encodeURIComponent(projectId)}/runs/${encodeURIComponent(runId)}/cancel`,
  projectRunCheckpoints: (projectId: string, runId: string) =>
    `/api/projects/${encodeURIComponent(projectId)}/runs/${encodeURIComponent(runId)}/checkpoints`,
  projectRunCheckpoint: (projectId: string, runId: string, checkpointId: string) =>
    `/api/projects/${encodeURIComponent(projectId)}/runs/${encodeURIComponent(runId)}/checkpoints/${encodeURIComponent(checkpointId)}`,
  projectCheckpoints: (projectId: string) => `/api/projects/${encodeURIComponent(projectId)}/checkpoints`,
  projectCheckpoint: (projectId: string, checkpointId: string) =>
    `/api/projects/${encodeURIComponent(projectId)}/checkpoints/${encodeURIComponent(checkpointId)}`,
  projectCheckpointValidate: (projectId: string, checkpointId: string) =>
    `/api/projects/${encodeURIComponent(projectId)}/checkpoints/${encodeURIComponent(checkpointId)}/validate`,
  projectCheckpointInspect: (projectId: string, checkpointId: string) =>
    `/api/projects/${encodeURIComponent(projectId)}/checkpoints/${encodeURIComponent(checkpointId)}/inspect`,
  projectEvaluations: (projectId: string) => `/api/projects/${encodeURIComponent(projectId)}/evaluations`,
  projectEvaluation: (projectId: string, evaluationId: string) =>
    `/api/projects/${encodeURIComponent(projectId)}/evaluations/${encodeURIComponent(evaluationId)}`,
  projectEvaluationEvents: (projectId: string, evaluationId: string) =>
    `/api/projects/${encodeURIComponent(projectId)}/evaluations/${encodeURIComponent(evaluationId)}/events`,
  projectEvaluationReport: (projectId: string, evaluationId: string) =>
    `/api/projects/${encodeURIComponent(projectId)}/evaluations/${encodeURIComponent(evaluationId)}/report`,
  projectEvaluationCancel: (projectId: string, evaluationId: string) =>
    `/api/projects/${encodeURIComponent(projectId)}/evaluations/${encodeURIComponent(evaluationId)}/cancel`,
  projectEvaluationCompare: (projectId: string) => `/api/projects/${encodeURIComponent(projectId)}/evaluations/compare`,
  projectGenerations: (projectId: string) => `/api/projects/${encodeURIComponent(projectId)}/generations`,
  projectGeneration: (projectId: string, generationId: string) =>
    `/api/projects/${encodeURIComponent(projectId)}/generations/${encodeURIComponent(generationId)}`,
  pipelineInspection: "/api/inspection/text",
  pipelineInspectionStatus: "/api/inspection/status",
  datasets: "/api/datasets",
  datasetInspection: (datasetId: string) => `/api/datasets/${encodeURIComponent(datasetId)}/inspection`,
  datasetRoots: "/api/dataset-roots",
  datasetRoot: (rootId: string) => `/api/dataset-roots/${encodeURIComponent(rootId)}`,
  datasetRootValidate: (rootId: string) => `/api/dataset-roots/${encodeURIComponent(rootId)}/validate`,
  datasetRefresh: "/api/datasets/refresh"
} as const;
