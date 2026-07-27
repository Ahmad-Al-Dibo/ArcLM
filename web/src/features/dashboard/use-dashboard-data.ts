"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ApiClientError, createApiClient } from "@/lib/api/client";
import type { DashboardClient, DashboardData, DashboardSection, DashboardState } from "./dashboard-types";

function sectionFromResult<T>(result: PromiseSettledResult<T>): DashboardSection<T> {
  if (result.status === "fulfilled") {
    return { data: result.value, error: null };
  }
  const reason = result.reason;
  const message = reason instanceof Error ? reason.message : "This information could not be read.";
  return { data: null, error: message };
}

function healthIsValid(value: unknown): value is DashboardData["health"] {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const record = value as Record<string, unknown>;
  return record.status === "ok" && record.service === "arclm-web-api" && typeof record.version === "string";
}

function messageForError(error: unknown) {
  if (error instanceof ApiClientError) {
    if (error.code === "disconnected" || error.code === "timeout") {
      return {
        status: "disconnected" as const,
        message: "Start the local backend to view environment and capability information."
      };
    }
    if (error.code === "invalid_json" || error.code === "invalid_response") {
      return {
        status: "invalid" as const,
        message: error.message
      };
    }
    return {
      status: "error" as const,
      message: error.message
    };
  }
  return {
    status: "error" as const,
    message: "The backend request failed."
  };
}

export function useDashboardData(client?: DashboardClient) {
  const requestId = useRef(0);
  const defaultClient = useMemo(() => createApiClient(), []);
  const activeClient = client ?? defaultClient;
  const [state, setState] = useState<DashboardState>({
    status: "loading",
    data: null,
    message: null,
    isRefreshing: false,
    lastSuccessAt: null,
    lastFailureAt: null
  });

  const refresh = useCallback(async () => {
    const currentRequest = requestId.current + 1;
    requestId.current = currentRequest;

    setState((current) => ({
      ...current,
      status: current.data ? current.status : "loading",
      isRefreshing: true,
      message: null
    }));

    try {
      const health = await activeClient.getHealth();
      if (!healthIsValid(health)) {
        throw new ApiClientError("The health response did not match the expected schema.", "invalid_response");
      }

      const [environment, capabilities, projectStatus] = await Promise.allSettled([
        activeClient.getEnvironment(),
        activeClient.getCapabilities(),
        activeClient.getProjectStatus()
      ]);

      if (requestId.current !== currentRequest) {
        return;
      }

      setState({
        status: "connected",
        data: {
          health,
          environment: sectionFromResult(environment),
          capabilities: sectionFromResult(capabilities),
          projectStatus: sectionFromResult(projectStatus)
        },
        message: null,
        isRefreshing: false,
        lastSuccessAt: new Date(),
        lastFailureAt: null
      });
    } catch (error) {
      if (requestId.current !== currentRequest) {
        return;
      }
      const next = messageForError(error);
      setState((current) => ({
        status: next.status,
        data: current.data,
        message: next.message,
        isRefreshing: false,
        lastSuccessAt: current.lastSuccessAt,
        lastFailureAt: new Date()
      }));
    }
  }, [activeClient]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void refresh();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [refresh]);

  return useMemo(() => ({ ...state, refresh }), [state, refresh]);
}
