"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle, EmptyState, ErrorState, KeyValueList, PageHeader, Select } from "@/components/ui";
import { errorMessage, statusVariant, text, type StudioClient, useClient } from "./shared";

export function CheckpointsPage({ projectId, client }: { projectId: string; client?: StudioClient }) {
  const api = useClient(client);
  const [checkpoints, setCheckpoints] = useState<Array<Record<string, unknown>>>([]);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    api.listProjectCheckpoints(projectId)
      .then((response) => {
        if (!active) return;
        setCheckpoints(response.checkpoints);
        setError(null);
      })
      .catch((requestError) => active && setError(errorMessage(requestError)));
    return () => {
      active = false;
    };
  }, [api, projectId]);

  const visible = checkpoints.filter((checkpoint) => filter === "all" || checkpoint.reload_status === filter);

  return (
    <div className="studio-page">
      <PageHeader title="Checkpoint Manager" description="Project-wide native checkpoint metadata, validation and safe follow-up actions." />
      {error ? <ErrorState title="Checkpoints unavailable" description={error} /> : null}
      <Select label="Compatibility filter" value={filter} onChange={(event) => setFilter(event.target.value)}>
        <option value="all">All</option>
        <option value="compatible">Compatible</option>
        <option value="metadata_incomplete">Metadata incomplete</option>
        <option value="incompatible">Incompatible</option>
        <option value="corrupted">Corrupted</option>
      </Select>
      <div className="studio-grid">
        {visible.length ? visible.map((checkpoint) => (
          <Card key={String(checkpoint.id)}>
            <CardHeader>
              <CardTitle>{text(checkpoint.name)}</CardTitle>
              <CardDescription>Run {text(checkpoint.run_id)} - step {text(checkpoint.step)}</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant={statusVariant(checkpoint.reload_status)}>{text(checkpoint.reload_status)}</Badge>
              <KeyValueList items={[
                { label: "Model", value: text(checkpoint.model_id) },
                { label: "Tokenizer", value: text(checkpoint.tokenizer_id) },
                { label: "Dataset", value: text(checkpoint.dataset_id) },
                { label: "Size", value: `${text(checkpoint.size_bytes, "0")} bytes` },
                { label: "Optimizer", value: checkpoint.has_optimizer_state ? "Available" : "Missing" }
              ]} />
              <div className="studio-actions">
                <Link className="ui-button ui-button-secondary" href={`/projects/${projectId}/checkpoints/${checkpoint.id}`}>Details</Link>
                <Link className="ui-button ui-button-secondary" href={`/projects/${projectId}/evaluate?checkpoint=${checkpoint.id}`}>Evaluate</Link>
                <Link className="ui-button ui-button-secondary" href={`/projects/${projectId}/generate?checkpoint=${checkpoint.id}`}>Generate</Link>
              </div>
            </CardContent>
          </Card>
        )) : <EmptyState title="No checkpoints" description="Train a native model to create checkpoint metadata." />}
      </div>
    </div>
  );
}
