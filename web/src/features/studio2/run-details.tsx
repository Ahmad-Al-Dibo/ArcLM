"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ErrorState,
  PageHeader
} from "@/components/ui";
import type { StudioRunMetadata } from "@/lib/api/schemas";
import { errorMessage, LoadingCard, type StudioClient, useClient } from "./shared";

function runModeLabel(run: StudioRunMetadata) {
  if (run.training_mode === "fine_tuning") {
    return run.fine_tuning_method ? `Fine-Tuning - ${run.fine_tuning_method.toUpperCase()}` : "Fine-Tuning";
  }
  if (run.training_mode === "pretraining") return "Pre-Training";
  return "Legacy native training";
}

export function RunDetailsPage({ projectId, runId, client }: { projectId: string; runId: string; client?: StudioClient }) {
  const api = useClient(client);
  const [run, setRun] = useState<StudioRunMetadata | null>(null);
  const [metrics, setMetrics] = useState<Array<Record<string, unknown>>>([]);
  const [events, setEvents] = useState<Array<Record<string, unknown>>>([]);
  const [checkpoints, setCheckpoints] = useState<Array<Record<string, unknown>>>([]);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const [runData, metricData, eventData, checkpointData] = await Promise.all([
      api.getProjectRun(projectId, runId),
      api.getProjectRunMetrics(projectId, runId),
      api.getProjectRunEvents(projectId, runId),
      api.listProjectRunCheckpoints(projectId, runId)
    ]);
    setRun(runData);
    setMetrics(metricData.items);
    setEvents(eventData.items);
    setCheckpoints(checkpointData.checkpoints);
    return runData;
  }, [api, projectId, runId]);

  useEffect(() => {
    let active = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const poll = () => {
      refresh()
        .then((nextRun) => {
          if (!active) return;
          const terminal = ["completed", "failed", "cancelled", "interrupted"].includes(nextRun.status);
          if (!terminal) timer = setTimeout(poll, document.hidden ? 5000 : 2000);
        })
        .catch((requestError) => {
          if (active) setError(errorMessage(requestError));
        });
    };
    poll();
    return () => {
      active = false;
      if (timer) clearTimeout(timer);
    };
  }, [refresh]);

  async function cancelRun() {
    if (!window.confirm("Request cancellation for this training run?")) return;
    setRun(await api.cancelProjectRun(projectId, runId));
  }

  if (error) return <ErrorState title="Run unavailable" description={error} />;
  if (!run) return <LoadingCard title="Run details" />;

  const canCancel = ["queued", "starting", "running", "cancelling"].includes(run.status);
  const fineTuningFormat = run.training_mode === "fine_tuning" ? (run.configuration.fine_tuning_format as Record<string, unknown> | undefined) : undefined;

  return (
    <div className="studio-page">
      <PageHeader title={run.name} description="Run details, metrics, events and checkpoint metadata." />
      <div className="studio-metrics">
        <Card><CardHeader><CardTitle>Status</CardTitle></CardHeader><CardContent><Badge variant={run.status === "completed" ? "success" : run.status === "failed" ? "error" : "neutral"}>{run.status}</Badge></CardContent></Card>
        <Card><CardHeader><CardTitle>Mode</CardTitle></CardHeader><CardContent><strong>{runModeLabel(run)}</strong></CardContent></Card>
        <Card><CardHeader><CardTitle>Progress</CardTitle></CardHeader><CardContent><strong>{run.current_step}/{run.total_steps ?? "?"}</strong></CardContent></Card>
        <Card><CardHeader><CardTitle>Device</CardTitle></CardHeader><CardContent><strong>{run.device}</strong></CardContent></Card>
      </div>
      {run.error ? <Alert variant="error" title={String(run.error.code ?? "Run error")}>{String(run.error.message ?? "The run did not complete.")}</Alert> : null}
      {canCancel ? <Button variant="destructive" onClick={() => void cancelRun()}>Cancel run</Button> : null}
      <div className="studio-two-column">
        <Card><CardHeader><CardTitle>Latest metrics</CardTitle></CardHeader><CardContent><pre className="studio-json">{JSON.stringify(run.latest_metrics, null, 2)}</pre></CardContent></Card>
        <Card><CardHeader><CardTitle>Training configuration</CardTitle></CardHeader><CardContent><pre className="studio-json">{JSON.stringify(run.configuration, null, 2)}</pre></CardContent></Card>
      </div>
      {fineTuningFormat ? (
        <Card>
          <CardHeader><CardTitle>Fine-tuning format</CardTitle><CardDescription>Prepared data identity used by the training run.</CardDescription></CardHeader>
          <CardContent><pre className="studio-json">{JSON.stringify({
            dataset_format: fineTuningFormat.dataset_format,
            label_strategy: fineTuningFormat.label_strategy,
            maximum_sequence_length: fineTuningFormat.maximum_sequence_length,
            format_fingerprint: fineTuningFormat.format_fingerprint
          }, null, 2)}</pre></CardContent>
        </Card>
      ) : null}
      <Card><CardHeader><CardTitle>Metrics</CardTitle></CardHeader><CardContent><pre className="studio-json">{JSON.stringify(metrics.slice(-10), null, 2)}</pre></CardContent></Card>
      <Card><CardHeader><CardTitle>Events</CardTitle></CardHeader><CardContent><pre className="studio-json">{JSON.stringify(events.slice(-10), null, 2)}</pre></CardContent></Card>
      <Card><CardHeader><CardTitle>Checkpoints</CardTitle><CardDescription>Metadata only; checkpoint binaries are not returned.</CardDescription></CardHeader><CardContent><pre className="studio-json">{JSON.stringify(checkpoints, null, 2)}</pre></CardContent></Card>
    </div>
  );
}
