"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Alert, Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, ErrorState, KeyValueList, PageHeader } from "@/components/ui";
import { errorMessage, statusVariant, text, type StudioClient, useClient } from "./shared";

export function CheckpointDetailsPage({ projectId, checkpointId, client }: { projectId: string; checkpointId: string; client?: StudioClient }) {
  const api = useClient(client);
  const [checkpoint, setCheckpoint] = useState<Record<string, unknown> | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void api.getProjectCheckpoint(projectId, checkpointId).then((response) => {
      if (active) setCheckpoint(response.checkpoint);
    }).catch((requestError) => {
      if (active) setError(errorMessage(requestError));
    });
    return () => {
      active = false;
    };
  }, [api, projectId, checkpointId]);

  async function validate() {
    try {
      const response = await api.validateProjectCheckpoint(projectId, checkpointId);
      setCheckpoint(response.checkpoint);
      setMessage(`Validation ${response.reload_status}.`);
      setError(null);
    } catch (requestError) {
      setError(errorMessage(requestError));
    }
  }

  async function remove() {
    if (!checkpoint || !window.confirm("Delete this checkpoint metadata and tensor files?")) return;
    try {
      await api.deleteProjectCheckpoint(projectId, checkpointId, { confirm: true, checkpoint_name: String(checkpoint.name) });
      setMessage("Checkpoint deleted.");
    } catch (requestError) {
      setError(errorMessage(requestError));
    }
  }

  if (error) return <ErrorState title="Checkpoint unavailable" description={error} />;
  if (!checkpoint) return <Card><CardContent>Loading checkpoint.</CardContent></Card>;
  const fineTuning = checkpoint.fine_tuning as Record<string, unknown> | undefined;

  return (
    <div className="studio-page">
      <PageHeader title={text(checkpoint.name)} description="Native checkpoint metadata, compatibility and safe actions." />
      {message ? <Alert variant="success" title="Checkpoint action">{message}</Alert> : null}
      <Card>
        <CardHeader><CardTitle>Status</CardTitle><CardDescription>No checkpoint binaries or paths are exposed.</CardDescription></CardHeader>
        <CardContent>
          <Badge variant={statusVariant(checkpoint.reload_status)}>{text(checkpoint.reload_status)}</Badge>
          <KeyValueList items={[
            { label: "Source run", value: text(checkpoint.run_id) },
            { label: "Architecture", value: text(checkpoint.architecture) },
            { label: "Task", value: text(checkpoint.model_task) },
            { label: "Model", value: text(checkpoint.model_id) },
            { label: "Tokenizer", value: text(checkpoint.tokenizer_id) },
            { label: "Dataset", value: text(checkpoint.dataset_id) },
            { label: "Epoch", value: text(checkpoint.epoch) },
            { label: "Step", value: text(checkpoint.step) },
            { label: "Optimizer state", value: checkpoint.has_optimizer_state ? "Available" : "Missing" },
            { label: "Scheduler state", value: checkpoint.has_scheduler_state ? "Available" : "Missing" },
            { label: "RNG state", value: checkpoint.has_rng_state ? "Available" : "Missing" }
          ]} />
        </CardContent>
      </Card>
      <div className="studio-actions">
        <Button onClick={() => void validate()}>Validate</Button>
        <Link className="ui-button ui-button-secondary" href={`/projects/${projectId}/evaluate?checkpoint=${checkpointId}`}>Evaluate</Link>
        <Link className="ui-button ui-button-secondary" href={`/projects/${projectId}/generate?checkpoint=${checkpointId}`}>Generate</Link>
        <Link className="ui-button ui-button-secondary" href={`/projects/${projectId}/checkpoints/${checkpointId}/inspect`}>Inspect</Link>
        <Button variant="destructive" onClick={() => void remove()}>Delete</Button>
      </div>
      {fineTuning ? (
        <Card>
          <CardHeader><CardTitle>Fine-tuning summary</CardTitle><CardDescription>Formatting identity preserved with this checkpoint.</CardDescription></CardHeader>
          <CardContent>
            <KeyValueList items={[
              { label: "Method", value: text(fineTuning.fine_tuning_method) },
              { label: "Dataset format", value: text(fineTuning.dataset_format) },
              { label: "Label strategy", value: text(fineTuning.label_strategy) },
              { label: "Maximum sequence length", value: text(fineTuning.maximum_sequence_length) },
              { label: "Formatting fingerprint", value: text(fineTuning.format_fingerprint) }
            ]} />
          </CardContent>
        </Card>
      ) : null}
      <Card><CardHeader><CardTitle>Metadata JSON</CardTitle></CardHeader><CardContent><pre className="studio-json">{JSON.stringify(checkpoint, null, 2)}</pre></CardContent></Card>
    </div>
  );
}
