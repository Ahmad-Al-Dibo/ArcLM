"use client";

import { useMemo } from "react";
import { ApiClientError, createApiClient } from "@/lib/api/client";

export type StudioClient = ReturnType<typeof createApiClient>;

export function useClient(client?: StudioClient) {
  return useMemo(() => client ?? createApiClient({ timeoutMs: 15000 }), [client]);
}

export function errorMessage(error: unknown) {
  if (error instanceof ApiClientError || error instanceof Error) return error.message;
  return "The request failed.";
}

export function text(value: unknown, fallback = "Not available") {
  if (value === null || value === undefined || value === "") return fallback;
  return String(value);
}

export function statusVariant(value: unknown) {
  const status = String(value);
  if (status === "compatible" || status === "completed") return "success" as const;
  if (status === "incompatible" || status === "corrupted" || status === "failed") return "error" as const;
  return "neutral" as const;
}
