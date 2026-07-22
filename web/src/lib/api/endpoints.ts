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
  pipelineInspection: "/api/inspection/text",
  pipelineInspectionStatus: "/api/inspection/status",
  datasets: "/api/datasets",
  datasetInspection: (datasetId: string) => `/api/datasets/${encodeURIComponent(datasetId)}/inspection`,
  datasetRoots: "/api/dataset-roots",
  datasetRoot: (rootId: string) => `/api/dataset-roots/${encodeURIComponent(rootId)}`,
  datasetRootValidate: (rootId: string) => `/api/dataset-roots/${encodeURIComponent(rootId)}/validate`,
  datasetRefresh: "/api/datasets/refresh"
} as const;
