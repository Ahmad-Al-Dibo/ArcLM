"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ApiClientError, createApiClient } from "@/lib/api/client";
import type { DatasetInspectionResponse, DatasetSummary } from "@/lib/api/schemas";
import { isSafeDatasetId } from "./dataset-format";
import type { CatalogueStatus, DatasetClient, InspectionStatus } from "./dataset-types";

function readSelectedDatasetId() {
  if (typeof window === "undefined") {
    return null;
  }
  return new URLSearchParams(window.location.search).get("dataset");
}

function writeSelectedDatasetId(datasetId: string | null) {
  const url = new URL(window.location.href);
  if (datasetId) {
    url.searchParams.set("dataset", datasetId);
  } else {
    url.searchParams.delete("dataset");
  }
  window.history.pushState({}, "", url);
}

function catalogueStatusForError(error: unknown): CatalogueStatus {
  if (error instanceof ApiClientError) {
    if (error.code === "disconnected" || error.code === "timeout") {
      return "disconnected";
    }
    if (error.code === "invalid_json" || error.code === "invalid_response") {
      return "invalid";
    }
  }
  return "error";
}

function inspectionStatusForError(error: unknown): InspectionStatus {
  if (error instanceof ApiClientError && (error.code === "invalid_json" || error.code === "invalid_response")) {
    return "invalid";
  }
  return "error";
}

function errorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
}

export function useDatasetInspector(client?: DatasetClient) {
  const defaultClient = useMemo(() => createApiClient(), []);
  const activeClient = client ?? defaultClient;
  const requestId = useRef(0);
  const inFlight = useRef(false);
  const hasLoaded = useRef(false);
  const [datasets, setDatasets] = useState<DatasetSummary[]>([]);
  const [catalogueStatus, setCatalogueStatus] = useState<CatalogueStatus>("loading");
  const [catalogueMessage, setCatalogueMessage] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [inspection, setInspection] = useState<DatasetInspectionResponse | null>(null);
  const [inspectionStatus, setInspectionStatus] = useState<InspectionStatus>("idle");
  const [inspectionMessage, setInspectionMessage] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isStale, setIsStale] = useState(false);
  const [lastSuccessAt, setLastSuccessAt] = useState<Date | null>(null);

  const loadInspection = useCallback(
    async (datasetId: string, currentRequest: number) => {
      setInspectionStatus("loading");
      setInspectionMessage(null);
      try {
        const response = await activeClient.getDatasetInspection(datasetId);
        if (requestId.current !== currentRequest) {
          return;
        }
        setInspection(response);
        setInspectionStatus("loaded");
        setInspectionMessage(null);
        setLastSuccessAt(new Date());
      } catch (error) {
        if (requestId.current !== currentRequest) {
          return;
        }
        setInspectionStatus(inspectionStatusForError(error));
        setInspectionMessage(errorMessage(error, "Dataset inspection failed."));
      }
    },
    [activeClient]
  );

  const refresh = useCallback(async () => {
    if (inFlight.current) {
      return;
    }
    inFlight.current = true;
    const currentRequest = requestId.current + 1;
    requestId.current = currentRequest;
    setIsRefreshing(true);
    setCatalogueMessage(null);
    setInspectionMessage(null);
    setCatalogueStatus((current) => (datasets.length ? current : "loading"));

    try {
      const response = await activeClient.getDatasets();
      if (requestId.current !== currentRequest) {
        return;
      }

      setDatasets(response.datasets);
      setCatalogueStatus(response.datasets.length ? "loaded" : "empty");
      setCatalogueMessage(null);
      setIsStale(false);

      const urlSelection = readSelectedDatasetId();
      const nextSelected = isSafeDatasetId(urlSelection) ? urlSelection : selectedId;
      if (urlSelection && !isSafeDatasetId(urlSelection)) {
        writeSelectedDatasetId(null);
        setSelectedId(null);
        setInspection(null);
        setInspectionStatus("invalid");
        setInspectionMessage("Invalid dataset selection was ignored.");
        return;
      }

      if (!nextSelected) {
        setSelectedId(null);
        setInspection(null);
        setInspectionStatus("idle");
        return;
      }

      const stillExists = response.datasets.some((dataset) => dataset.dataset_id === nextSelected);
      if (!stillExists && (datasets.length > 0 || inspection !== null)) {
        writeSelectedDatasetId(null);
        setSelectedId(null);
        setInspection(null);
        setInspectionStatus("idle");
        setInspectionMessage("The selected dataset was removed from the catalogue.");
        return;
      }

      if (!stillExists) {
        setSelectedId(nextSelected);
        setInspection(null);
        setInspectionStatus("unknown");
        setInspectionMessage("The selected dataset is not available in the current catalogue.");
        return;
      }

      setSelectedId(nextSelected);
      await loadInspection(nextSelected, currentRequest);
    } catch (error) {
      if (requestId.current !== currentRequest) {
        return;
      }
      setCatalogueStatus(catalogueStatusForError(error));
      setCatalogueMessage(errorMessage(error, "Dataset catalogue failed to load."));
      setIsStale(datasets.length > 0 || inspection !== null);
    } finally {
      if (requestId.current === currentRequest) {
        setIsRefreshing(false);
      }
      inFlight.current = false;
    }
  }, [activeClient, datasets.length, inspection, loadInspection, selectedId]);

  const selectDataset = useCallback(
    (datasetId: string | null) => {
      if (datasetId && !isSafeDatasetId(datasetId)) {
        setSelectedId(null);
        setInspection(null);
        setInspectionStatus("invalid");
        setInspectionMessage("Invalid dataset selection was ignored.");
        return;
      }

      writeSelectedDatasetId(datasetId);
      setSelectedId(datasetId);
      setInspection(null);
      setInspectionMessage(null);

      if (!datasetId) {
        setInspectionStatus("idle");
        return;
      }

      const currentRequest = requestId.current + 1;
      requestId.current = currentRequest;
      void loadInspection(datasetId, currentRequest);
    },
    [loadInspection]
  );

  useEffect(() => {
    if (hasLoaded.current) {
      return;
    }
    hasLoaded.current = true;
    const timer = window.setTimeout(() => {
      void refresh();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [refresh]);

  useEffect(() => {
    function handlePopState() {
      const datasetId = readSelectedDatasetId();
      if (!datasetId) {
        setSelectedId(null);
        setInspection(null);
        setInspectionStatus("idle");
        setInspectionMessage(null);
        return;
      }
      const exists = datasets.some((dataset) => dataset.dataset_id === datasetId);
      if (isSafeDatasetId(datasetId) && exists) {
        setSelectedId(datasetId);
        const currentRequest = requestId.current + 1;
        requestId.current = currentRequest;
        void loadInspection(datasetId, currentRequest);
      } else {
        if (!isSafeDatasetId(datasetId)) {
          writeSelectedDatasetId(null);
        }
        setSelectedId(datasetId);
        setInspection(null);
        setInspectionStatus(isSafeDatasetId(datasetId) ? "unknown" : "invalid");
        setInspectionMessage(isSafeDatasetId(datasetId) ? "The selected dataset is not available in the current catalogue." : "Invalid dataset selection was ignored.");
      }
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [datasets, loadInspection, selectDataset]);

  const selectedDataset = datasets.find((dataset) => dataset.dataset_id === selectedId) ?? null;

  return {
    datasets,
    catalogueStatus,
    catalogueMessage,
    selectedId,
    selectedDataset,
    inspection,
    inspectionStatus,
    inspectionMessage,
    isRefreshing,
    isStale,
    lastSuccessAt,
    refresh,
    selectDataset
  };
}
