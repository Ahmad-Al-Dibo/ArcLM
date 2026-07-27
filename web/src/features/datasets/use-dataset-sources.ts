"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ApiClientError, createApiClient } from "@/lib/api/client";
import type { DatasetRootInfo } from "@/lib/api/schemas";
import type { DatasetClient } from "./dataset-types";

export type SourceStatus = "loading" | "loaded" | "empty" | "disconnected" | "error" | "invalid" | "unavailable";

function statusForError(error: unknown): SourceStatus {
  if (error instanceof ApiClientError) {
    if (error.code === "disconnected" || error.code === "timeout") {
      return "disconnected";
    }
    if (error.code === "invalid_json" || error.code === "invalid_response") {
      return "invalid";
    }
    if (error.code === "dataset_source_management_disabled" || error.status === 403) {
      return "unavailable";
    }
  }
  return "error";
}

function errorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
}

export function useDatasetSources(client?: DatasetClient, onCatalogueChanged?: () => Promise<void> | void) {
  const defaultClient = useMemo(() => createApiClient(), []);
  const activeClient = client ?? defaultClient;
  const inFlight = useRef(false);
  const [roots, setRoots] = useState<DatasetRootInfo[]>([]);
  const [status, setStatus] = useState<SourceStatus>("loading");
  const [message, setMessage] = useState<string | null>(null);
  const [isWorking, setIsWorking] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);

  const loadRoots = useCallback(async () => {
    setMessage(null);
    setStatus((current) => (roots.length ? current : "loading"));
    try {
      const response = await activeClient.getDatasetRoots();
      setRoots(response.roots);
      setStatus(response.roots.length ? "loaded" : "empty");
    } catch (error) {
      setStatus(statusForError(error));
      setMessage(errorMessage(error, "Dataset sources could not be loaded."));
    }
  }, [activeClient, roots.length]);

  const afterMutation = useCallback(
    async (label: string) => {
      setLastAction(label);
      await loadRoots();
      await onCatalogueChanged?.();
    },
    [loadRoots, onCatalogueChanged]
  );

  const addRoot = useCallback(
    async (name: string, path: string, recursive: boolean) => {
      if (inFlight.current) {
        return;
      }
      inFlight.current = true;
      setIsWorking(true);
      setMessage(null);
      try {
        await activeClient.addDatasetRoot({ name, path, recursive });
        await afterMutation("Dataset source added.");
      } catch (error) {
        setMessage(errorMessage(error, "Dataset source could not be added."));
      } finally {
        setIsWorking(false);
        inFlight.current = false;
      }
    },
    [activeClient, afterMutation]
  );

  const updateRoot = useCallback(
    async (rootId: string, payload: { name?: string; enabled?: boolean; recursive?: boolean }) => {
      if (inFlight.current) {
        return;
      }
      inFlight.current = true;
      setIsWorking(true);
      setMessage(null);
      try {
        await activeClient.updateDatasetRoot(rootId, payload);
        await afterMutation(payload.enabled === false ? "Dataset source disabled." : "Dataset source updated.");
      } catch (error) {
        setMessage(errorMessage(error, "Dataset source could not be updated."));
      } finally {
        setIsWorking(false);
        inFlight.current = false;
      }
    },
    [activeClient, afterMutation]
  );

  const removeRoot = useCallback(
    async (rootId: string) => {
      if (inFlight.current) {
        return;
      }
      inFlight.current = true;
      setIsWorking(true);
      setMessage(null);
      try {
        await activeClient.removeDatasetRoot(rootId);
        await afterMutation("Dataset source removed. Files were not deleted.");
      } catch (error) {
        setMessage(errorMessage(error, "Dataset source could not be removed."));
      } finally {
        setIsWorking(false);
        inFlight.current = false;
      }
    },
    [activeClient, afterMutation]
  );

  const refreshSources = useCallback(async () => {
    if (inFlight.current) {
      return;
    }
    inFlight.current = true;
    setIsWorking(true);
    setMessage(null);
    try {
      const response = await activeClient.refreshDatasets();
      await afterMutation(`Catalogue refreshed. ${response.datasets_found} supported datasets found.`);
    } catch (error) {
      setMessage(errorMessage(error, "Dataset catalogue could not be refreshed."));
    } finally {
      setIsWorking(false);
      inFlight.current = false;
    }
  }, [activeClient, afterMutation]);

  useEffect(() => {
    let cancelled = false;

    activeClient
      .getDatasetRoots()
      .then((response) => {
        if (cancelled) {
          return;
        }
        setRoots(response.roots);
        setStatus(response.roots.length ? "loaded" : "empty");
      })
      .catch((error: unknown) => {
        if (cancelled) {
          return;
        }
        setStatus(statusForError(error));
        setMessage(errorMessage(error, "Dataset sources could not be loaded."));
      });

    return () => {
      cancelled = true;
    };
  }, [activeClient]);

  return {
    roots,
    status,
    message,
    isWorking,
    lastAction,
    addRoot,
    updateRoot,
    removeRoot,
    refreshSources,
    reloadSources: loadRoots
  };
}
