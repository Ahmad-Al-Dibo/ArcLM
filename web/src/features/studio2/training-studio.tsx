"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Alert,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ErrorState,
  KeyValueList,
  PageHeader,
  Select,
  TextInput
} from "@/components/ui";
import type { StudioRunMetadata } from "@/lib/api/schemas";
import { errorMessage, LoadingCard, type StudioClient, useClient, useProjectAssets } from "./shared";

export function TrainingStudioPage({ projectId, client }: { projectId: string; client?: StudioClient }) {
  const api = useClient(client);
  const assets = useProjectAssets(projectId, api);
  const [datasetId, setDatasetId] = useState("");
  const [tokenizerId, setTokenizerId] = useState("");
  const [modelId, setModelId] = useState("");
  const [epochs, setEpochs] = useState(1);
  const [batchSize, setBatchSize] = useState(1);
  const [learningRate, setLearningRate] = useState(0.001);
  const [device, setDevice] = useState<"auto" | "cpu" | "cuda">("cpu");
  const [createdRun, setCreatedRun] = useState<StudioRunMetadata | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedDatasetId = datasetId || assets.datasets[0]?.id || "";
  const selectedTokenizerId = tokenizerId || assets.tokenizers[0]?.id || "";
  const selectedModelId = modelId || assets.models[0]?.id || "";
  const selectedModel = assets.models.find((model) => model.id === selectedModelId);
  const tokenizerModelMismatch = Boolean(selectedModel && selectedTokenizerId && selectedModel.tokenizer_id !== selectedTokenizerId);
  const startDisabled = !selectedDatasetId || !selectedTokenizerId || !selectedModelId || tokenizerModelMismatch;

  async function startRun() {
    try {
      const run = await api.createProjectRun(projectId, {
        name: "Native Studio training",
        dataset_id: selectedDatasetId,
        tokenizer_id: selectedTokenizerId,
        model_id: selectedModelId,
        training_type: "native_causal_lm",
        epochs,
        batch_size: batchSize,
        learning_rate: learningRate,
        device,
        precision: "fp32",
        checkpoint_interval: 1,
        maximum_sequence_length: Number(selectedModel?.configuration.block_size ?? 8)
      });
      setCreatedRun(run);
      setError(null);
    } catch (requestError) {
      setError(errorMessage(requestError));
    }
  }

  return (
    <div className="studio-page">
      <PageHeader title="Training Studio" description="Guided native-only training setup with explicit dataset, tokenizer and model compatibility." />
      {error ? <ErrorState title="Training request failed" description={error} /> : null}
      {assets.loading ? <LoadingCard title="Training Studio" /> : (
        <>
          <div className="studio-grid">
            <Card><CardHeader><CardTitle>Step 1 - Data</CardTitle></CardHeader><CardContent><Select label="Dataset" value={selectedDatasetId} onChange={(event) => setDatasetId(event.target.value)}>{assets.datasets.map((dataset) => <option key={dataset.id} value={dataset.id}>{dataset.name} ({dataset.validation_status})</option>)}</Select></CardContent></Card>
            <Card><CardHeader><CardTitle>Step 2 - Tokenizer</CardTitle></CardHeader><CardContent><Select label="Tokenizer" value={selectedTokenizerId} onChange={(event) => setTokenizerId(event.target.value)}>{assets.tokenizers.map((tokenizer) => <option key={tokenizer.id} value={tokenizer.id}>{tokenizer.name} - vocab {tokenizer.vocab_size}</option>)}</Select></CardContent></Card>
            <Card><CardHeader><CardTitle>Step 3 - Model</CardTitle></CardHeader><CardContent><Select label="Native model" value={selectedModelId} onChange={(event) => setModelId(event.target.value)}>{assets.models.map((model) => <option key={model.id} value={model.id}>{model.name} - {model.parameter_count} params</option>)}</Select></CardContent></Card>
          </div>
          <Card>
            <CardHeader><CardTitle>Configure training</CardTitle><CardDescription>Native causal-LM training is active; other native training types stay backend-validated.</CardDescription></CardHeader>
            <CardContent className="studio-form">
              <Select label="Training type" value="native_causal_lm" onChange={() => undefined}><option value="native_causal_lm">Native causal-LM training</option></Select>
              <TextInput label="Epochs" type="number" value={String(epochs)} onChange={(event) => setEpochs(Number(event.target.value))} />
              <TextInput label="Batch size" type="number" value={String(batchSize)} onChange={(event) => setBatchSize(Number(event.target.value))} />
              <TextInput label="Learning rate" type="number" value={String(learningRate)} onChange={(event) => setLearningRate(Number(event.target.value))} />
              <Select label="Device" value={device} onChange={(event) => setDevice(event.target.value as "auto" | "cpu" | "cuda")}><option value="cpu">cpu</option><option value="auto">auto</option><option value="cuda">cuda</option></Select>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Review</CardTitle><CardDescription>Start remains disabled while compatibility errors remain.</CardDescription></CardHeader>
            <CardContent>
              <KeyValueList items={[
                { label: "Dataset", value: selectedDatasetId || "Select dataset" },
                { label: "Dataset tokenizer", value: selectedTokenizerId || "Select tokenizer" },
                { label: "Model tokenizer", value: selectedModel?.tokenizer_id ?? "Select model" },
                { label: "Model vocabulary size", value: String(selectedModel?.configuration.vocab_size ?? "n/a") },
                { label: "Maximum sequence length", value: String(selectedModel?.configuration.block_size ?? "n/a") },
                { label: "Compatibility", value: tokenizerModelMismatch ? "Tokenizer/model mismatch" : "Compatible" }
              ]} />
              {tokenizerModelMismatch ? <Alert variant="error" title="Tokenizer/model mismatch">Select the tokenizer used by the model before starting training.</Alert> : null}
              <div className="studio-actions">
                <Button onClick={() => void startRun()} disabled={startDisabled}>Start training job</Button>
                {createdRun ? <Link className="ui-button ui-button-secondary" href={`/projects/${projectId}/runs/${createdRun.id}`}>Open run</Link> : null}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
