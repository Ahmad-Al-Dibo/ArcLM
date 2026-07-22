"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Alert, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, ErrorState, KeyValueList, PageHeader, Select, TextInput } from "@/components/ui";
import { errorMessage, text, type StudioClient, useClient } from "@/features/checkpoints/shared";

export function EvaluationStudioPage({ projectId, initialCheckpointId, client }: { projectId: string; initialCheckpointId?: string; client?: StudioClient }) {
  const api = useClient(client);
  const [checkpoints, setCheckpoints] = useState<Array<Record<string, unknown>>>([]);
  const [datasets, setDatasets] = useState<Array<{ id: string; name: string }>>([]);
  const [tokenizers, setTokenizers] = useState<Array<{ id: string; name: string }>>([]);
  const [checkpointId, setCheckpointId] = useState(initialCheckpointId ?? "");
  const [datasetId, setDatasetId] = useState("");
  const [tokenizerId, setTokenizerId] = useState("");
  const [batchSize, setBatchSize] = useState(1);
  const [maximumExamples, setMaximumExamples] = useState(8);
  const [createdId, setCreatedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([api.listProjectCheckpoints(projectId), api.listProjectDatasets(projectId), api.listProjectTokenizers(projectId)])
      .then(([checkpointData, datasetData, tokenizerData]) => {
        if (!active) return;
        setCheckpoints(checkpointData.checkpoints);
        setDatasets(datasetData.datasets);
        setTokenizers(tokenizerData.tokenizers);
        const checkpoint = checkpointData.checkpoints.find((item) => item.id === (initialCheckpointId ?? "")) ?? checkpointData.checkpoints[0];
        setCheckpointId(String(checkpoint?.id ?? ""));
        setDatasetId(String(checkpoint?.dataset_id ?? datasetData.datasets[0]?.id ?? ""));
        setTokenizerId(String(checkpoint?.tokenizer_id ?? tokenizerData.tokenizers[0]?.id ?? ""));
      })
      .catch((requestError) => active && setError(errorMessage(requestError)));
    return () => {
      active = false;
    };
  }, [api, projectId, initialCheckpointId]);

  const checkpoint = checkpoints.find((item) => item.id === checkpointId);
  const compatible = checkpoint?.reload_status === "compatible";
  const modelDetails = checkpoint?.model as Record<string, unknown> | undefined;
  const modelConfiguration = modelDetails?.configuration as Record<string, unknown> | undefined;

  async function start() {
    try {
      const response = await api.createProjectEvaluation(projectId, {
        checkpoint_id: checkpointId,
        dataset_id: datasetId,
        tokenizer_id: tokenizerId,
        split: "all",
        batch_size: batchSize,
        maximum_sequence_length: Number(modelConfiguration?.block_size ?? checkpoint?.step ?? 8),
        maximum_examples: maximumExamples,
        device: "cpu",
        precision: "fp32",
        selected_metrics: ["loss", "perplexity", "accuracy"]
      });
      setCreatedId(String(response.evaluation.id));
      setError(null);
    } catch (requestError) {
      setError(errorMessage(requestError));
    }
  }

  return (
    <div className="studio-page">
      <PageHeader title="Evaluation Studio" description="Queue a bounded native checkpoint evaluation using canonical ArcLM Evaluator reports." />
      {error ? <ErrorState title="Evaluation setup failed" description={error} /> : null}
      {createdId ? <Alert variant="success" title="Evaluation queued"><Link href={`/projects/${projectId}/evaluations/${createdId}`}>Open evaluation</Link></Alert> : null}
      <div className="studio-two-column">
        <Card>
          <CardHeader><CardTitle>Setup</CardTitle><CardDescription>Select compatible native project assets.</CardDescription></CardHeader>
          <CardContent className="studio-form">
            <Select label="Checkpoint" value={checkpointId} onChange={(event) => {
              const next = checkpoints.find((item) => item.id === event.target.value);
              setCheckpointId(event.target.value);
              setDatasetId(String(next?.dataset_id ?? datasetId));
              setTokenizerId(String(next?.tokenizer_id ?? tokenizerId));
            }}>
              <option value="">Select checkpoint</option>
              {checkpoints.map((item) => <option key={String(item.id)} value={String(item.id)}>{text(item.name)} - {text(item.reload_status)}</option>)}
            </Select>
            <Select label="Dataset" value={datasetId} onChange={(event) => setDatasetId(event.target.value)}>
              {datasets.map((dataset) => <option key={dataset.id} value={dataset.id}>{dataset.name}</option>)}
            </Select>
            <Select label="Tokenizer" value={tokenizerId} onChange={(event) => setTokenizerId(event.target.value)}>
              {tokenizers.map((tokenizer) => <option key={tokenizer.id} value={tokenizer.id}>{tokenizer.name}</option>)}
            </Select>
            <TextInput label="Batch size" type="number" value={String(batchSize)} onChange={(event) => setBatchSize(Number(event.target.value))} />
            <TextInput label="Maximum examples" type="number" value={String(maximumExamples)} onChange={(event) => setMaximumExamples(Number(event.target.value))} />
            <Button onClick={() => void start()} disabled={!checkpointId || !datasetId || !tokenizerId || !compatible}>Start evaluation</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Review</CardTitle><CardDescription>Start is disabled while compatibility is unclear.</CardDescription></CardHeader>
          <CardContent>
            <KeyValueList items={[
              { label: "Checkpoint", value: text(checkpoint?.name) },
              { label: "Source run", value: text(checkpoint?.run_id) },
              { label: "Compatibility", value: text(checkpoint?.reload_status) },
              { label: "Dataset", value: datasetId || "Select dataset" },
              { label: "Tokenizer", value: tokenizerId || "Select tokenizer" },
              { label: "Metrics", value: "loss, perplexity, accuracy" },
              { label: "Device", value: "cpu" },
              { label: "Precision", value: "fp32" }
            ]} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
