"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton
} from "@/components/ui";
import { ApiClientError, createApiClient } from "@/lib/api/client";
import type { StudioDatasetMetadata, StudioModelMetadata, StudioTokenizerMetadata } from "@/lib/api/schemas";

export type StudioClient = ReturnType<typeof createApiClient>;

export function useClient(client?: StudioClient) {
  return useMemo(() => client ?? createApiClient(), [client]);
}

export function errorMessage(error: unknown) {
  if (error instanceof ApiClientError || error instanceof Error) return error.message;
  return "The request failed.";
}

export function LoadingCard({ title }: { title: string }) {
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent><Skeleton label={`Loading ${title}`} /></CardContent>
    </Card>
  );
}

export function useProjectAssets(projectId: string, api: StudioClient) {
  const [datasets, setDatasets] = useState<StudioDatasetMetadata[]>([]);
  const [tokenizers, setTokenizers] = useState<StudioTokenizerMetadata[]>([]);
  const [models, setModels] = useState<StudioModelMetadata[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    try {
      const [datasetData, tokenizerData, modelData] = await Promise.all([
        api.listProjectDatasets(projectId),
        api.listProjectTokenizers(projectId),
        api.listProjectModels(projectId)
      ]);
      setDatasets(datasetData.datasets);
      setTokenizers(tokenizerData.tokenizers);
      setModels(modelData.models);
      setError(null);
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    Promise.all([api.listProjectDatasets(projectId), api.listProjectTokenizers(projectId), api.listProjectModels(projectId)])
      .then(([datasetData, tokenizerData, modelData]) => {
        if (!active) return;
        setDatasets(datasetData.datasets);
        setTokenizers(tokenizerData.tokenizers);
        setModels(modelData.models);
        setError(null);
      })
      .catch((requestError) => {
        if (active) setError(errorMessage(requestError));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [api, projectId]);

  return { datasets, tokenizers, models, error, loading, refresh };
}
