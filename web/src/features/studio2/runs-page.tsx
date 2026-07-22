"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  EmptyState,
  ErrorState,
  KeyValueList,
  PageHeader,
  Select
} from "@/components/ui";
import type { StudioRunMetadata } from "@/lib/api/schemas";
import { errorMessage, type StudioClient, useClient } from "./shared";

function runModeLabel(run: StudioRunMetadata) {
  if (run.training_mode === "fine_tuning") {
    return run.fine_tuning_method ? `Fine-Tuning - ${run.fine_tuning_method.toUpperCase()}` : "Fine-Tuning";
  }
  if (run.training_mode === "pretraining") return "Pre-Training";
  return "Legacy native training";
}

export function RunsPage({ projectId, client }: { projectId: string; client?: StudioClient }) {
  const api = useClient(client);
  const [runs, setRuns] = useState<StudioRunMetadata[]>([]);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    api.listProjectRuns(projectId)
      .then((response) => {
        if (!active) return;
        setRuns(response.runs);
        setError(null);
      })
      .catch((requestError) => {
        if (active) setError(errorMessage(requestError));
      });
    return () => {
      active = false;
    };
  }, [api, projectId]);

  const visible = runs.filter((run) => filter === "all" || run.status === filter);

  return (
    <div className="studio-page">
      <PageHeader title="Runs" description="Training history, progress and terminal states." actions={<Link className="ui-button ui-button-primary" href={`/projects/${projectId}/train`}>New run</Link>} />
      {error ? <ErrorState title="Runs unavailable" description={error} /> : null}
      <Select label="Filter" value={filter} onChange={(event) => setFilter(event.target.value)}>
        {["all", "running", "completed", "failed", "cancelled", "interrupted"].map((item) => <option key={item} value={item}>{item}</option>)}
      </Select>
      <div className="studio-grid">
        {visible.length ? visible.map((run) => (
          <Card key={run.id}>
            <CardHeader><CardTitle>{run.name}</CardTitle><CardDescription>{runModeLabel(run)} - {run.training_type}</CardDescription></CardHeader>
            <CardContent>
              <Badge variant={run.status === "completed" ? "success" : run.status === "failed" ? "error" : "neutral"}>{run.status}</Badge>
              <KeyValueList items={[
                { label: "Mode", value: runModeLabel(run) },
                { label: "Progress", value: `${run.current_step}/${run.total_steps ?? "?"}` },
                { label: "Latest loss", value: String(run.latest_metrics.training_loss ?? "n/a") },
                { label: "Device", value: run.device }
              ]} />
              <Link className="ui-button ui-button-secondary" href={`/projects/${projectId}/runs/${run.id}`}>Open details</Link>
            </CardContent>
          </Card>
        )) : <EmptyState title="No runs" description="Start a native training job to see run history." />}
      </div>
    </div>
  );
}
