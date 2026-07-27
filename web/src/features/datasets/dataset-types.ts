import type {
  DatasetInspectionResponse,
  DatasetListResponse,
  DatasetRefreshResponse,
  DatasetRootCreateRequest,
  DatasetRootInfo,
  DatasetRootListResponse,
  DatasetRootUpdateRequest
} from "@/lib/api/schemas";

export type DatasetClient = {
  getDatasets: () => Promise<DatasetListResponse>;
  getDatasetInspection: (datasetId: string) => Promise<DatasetInspectionResponse>;
  getDatasetRoots: () => Promise<DatasetRootListResponse>;
  addDatasetRoot: (payload: DatasetRootCreateRequest) => Promise<DatasetRootInfo>;
  updateDatasetRoot: (rootId: string, payload: DatasetRootUpdateRequest) => Promise<DatasetRootInfo>;
  removeDatasetRoot: (rootId: string) => Promise<DatasetRootInfo>;
  validateDatasetRoot: (rootId: string) => Promise<DatasetRootInfo>;
  refreshDatasets: () => Promise<DatasetRefreshResponse>;
};

export type CatalogueStatus = "loading" | "loaded" | "empty" | "disconnected" | "error" | "invalid";

export type InspectionStatus = "idle" | "loading" | "loaded" | "error" | "invalid" | "unknown";
