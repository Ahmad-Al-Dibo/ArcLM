import type { CapabilitiesResponse, EnvironmentResponse, HealthResponse, ProjectStatusResponse } from "@/lib/api/schemas";

export type DashboardSection<T> = {
  data: T | null;
  error: string | null;
};

export type DashboardData = {
  health: HealthResponse;
  environment: DashboardSection<EnvironmentResponse>;
  capabilities: DashboardSection<CapabilitiesResponse>;
  projectStatus: DashboardSection<ProjectStatusResponse>;
};

export type DashboardStatus = "loading" | "connected" | "disconnected" | "error" | "invalid";

export type DashboardState = {
  status: DashboardStatus;
  data: DashboardData | null;
  message: string | null;
  isRefreshing: boolean;
  lastSuccessAt: Date | null;
  lastFailureAt: Date | null;
};

export type DashboardClient = {
  getHealth: () => Promise<HealthResponse>;
  getEnvironment: () => Promise<EnvironmentResponse>;
  getCapabilities: () => Promise<CapabilitiesResponse>;
  getProjectStatus: () => Promise<ProjectStatusResponse>;
};
