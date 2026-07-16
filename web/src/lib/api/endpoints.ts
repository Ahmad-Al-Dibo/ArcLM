export const apiEndpoints = {
  health: "/api/health",
  environment: "/api/environment",
  capabilities: "/api/capabilities",
  projectStatus: "/api/project/status",
  datasets: "/api/datasets",
  datasetInspection: (datasetId: string) => `/api/datasets/${encodeURIComponent(datasetId)}/inspection`,
  datasetRoots: "/api/dataset-roots",
  datasetRoot: (rootId: string) => `/api/dataset-roots/${encodeURIComponent(rootId)}`,
  datasetRootValidate: (rootId: string) => `/api/dataset-roots/${encodeURIComponent(rootId)}/validate`,
  datasetRefresh: "/api/datasets/refresh"
} as const;
