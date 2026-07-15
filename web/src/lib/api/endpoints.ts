export const apiEndpoints = {
  health: "/api/health",
  environment: "/api/environment",
  capabilities: "/api/capabilities",
  projectStatus: "/api/project/status",
  datasets: "/api/datasets",
  datasetInspection: (datasetId: string) => `/api/datasets/${encodeURIComponent(datasetId)}/inspection`
} as const;
