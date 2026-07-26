"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  Alert,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  EmptyState,
  ErrorState,
  KeyValueList,
  PageHeader,
  Select,
  TextInput
} from "@/components/ui";
import type { NativeModelValidationResponse, StudioModelMetadata } from "@/lib/api/schemas";
import { errorMessage, LoadingCard, type StudioClient, useClient, useProjectAssets } from "./shared";

export function ModelBuilderPage({ projectId, client }: { projectId: string; client?: StudioClient }) {
  const api = useClient(client);
  const assets = useProjectAssets(projectId, api);
  const [name, setName] = useState("Tiny ArcLM");
  const [datasetId, setDatasetId] = useState("");
  const [tokenizerId, setTokenizerId] = useState("");
  const [preset, setPreset] = useState("tiny");
  const [embedDim, setEmbedDim] = useState(8);
  const [blockSize, setBlockSize] = useState(8);
  const [numBlocks, setNumBlocks] = useState(1);
  const [dropout, setDropout] = useState(0);
  const [estimate, setEstimate] = useState<NativeModelValidationResponse | null>(null);
  const [created, setCreated] = useState<StudioModelMetadata | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedDatasetId = datasetId || assets.datasets[0]?.id || "";
  const selectedTokenizerId = tokenizerId || assets.tokenizers[0]?.id || "";

  function applyPreset(nextPreset: string) {
    setPreset(nextPreset);
    if (nextPreset === "tiny") {
      setEmbedDim(8); setBlockSize(8); setNumBlocks(1); setDropout(0);
    } else if (nextPreset === "small") {
      setEmbedDim(32); setBlockSize(32); setNumBlocks(2); setDropout(0.1);
    }
  }

  function configuration() {
    const tokenizer = assets.tokenizers.find((item) => item.id === selectedTokenizerId);
    return {
      vocab_size: tokenizer?.vocab_size ?? 0,
      embed_dim: embedDim,
      block_size: blockSize,
      num_blocks: numBlocks,
      dropout
    };
  }

  async function estimateModel(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    if (!selectedTokenizerId) {
      setError("Create a tokenizer before configuring a model.");
      return;
    }
    try {
      setEstimate(await api.estimateNativeModel(projectId, { name, dataset_id: selectedDatasetId || null, tokenizer_id: selectedTokenizerId, configuration: configuration() }));
      setError(null);
    } catch (requestError) {
      setError(errorMessage(requestError));
      setEstimate(null);
    }
  }

  async function createModel() {
    try {
      const model = await api.createNativeModel(projectId, { name, dataset_id: selectedDatasetId || null, tokenizer_id: selectedTokenizerId, configuration: configuration() });
      setCreated(model);
      await assets.refresh();
      setError(null);
    } catch (requestError) {
      setError(errorMessage(requestError));
    }
  }

  return (
    <div className="studio-page">
      <PageHeader title="Native Model Builder" description="Configure one native ArcLM causal language model. No external models are downloaded." />
      {assets.error ? <ErrorState title="Project assets unavailable" description={assets.error} /> : null}
      {error ? <ErrorState title="Model request failed" description={error} /> : null}
      {assets.loading ? <LoadingCard title="Model Builder" /> : (
        <div className="studio-two-column">
          <Card>
            <CardHeader><CardTitle>Configuration</CardTitle><CardDescription>Uses real ArcLM constructor fields.</CardDescription></CardHeader>
            <CardContent>
              <form className="studio-form" onSubmit={estimateModel}>
                <TextInput label="Model name" value={name} onChange={(event) => setName(event.target.value)} />
                <Select label="Dataset" value={selectedDatasetId} onChange={(event) => setDatasetId(event.target.value)}>
                  <option value="">No dataset</option>
                  {assets.datasets.map((dataset) => <option key={dataset.id} value={dataset.id}>{dataset.name}</option>)}
                </Select>
                <Select label="Tokenizer" value={selectedTokenizerId} onChange={(event) => setTokenizerId(event.target.value)}>
                  <option value="">Select tokenizer</option>
                  {assets.tokenizers.map((tokenizer) => <option key={tokenizer.id} value={tokenizer.id}>{tokenizer.name} - vocab {tokenizer.vocab_size}</option>)}
                </Select>
                <Select label="Preset" value={preset} onChange={(event) => applyPreset(event.target.value)}>
                  <option value="tiny">Tiny</option>
                  <option value="small">Small</option>
                  <option value="custom">Custom</option>
                </Select>
                <TextInput label="embed_dim" type="number" value={String(embedDim)} onChange={(event) => { setPreset("custom"); setEmbedDim(Number(event.target.value)); }} />
                <TextInput label="block_size" type="number" value={String(blockSize)} onChange={(event) => { setPreset("custom"); setBlockSize(Number(event.target.value)); }} />
                <TextInput label="num_blocks" type="number" value={String(numBlocks)} onChange={(event) => { setPreset("custom"); setNumBlocks(Number(event.target.value)); }} />
                <TextInput label="dropout" type="number" value={String(dropout)} onChange={(event) => { setPreset("custom"); setDropout(Number(event.target.value)); }} />
                <div className="studio-actions">
                  <Button type="submit" disabled={!selectedTokenizerId}>Validate and estimate</Button>
                  <Button type="button" variant="secondary" onClick={() => void createModel()} disabled={!estimate?.valid}>Save model configuration</Button>
                </div>
              </form>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Estimate</CardTitle><CardDescription>Parameter count is exact; memory is approximate.</CardDescription></CardHeader>
            <CardContent>
              {!assets.tokenizers.length ? <EmptyState title="Create a tokenizer first" description="Model vocabulary is derived from a project tokenizer." /> : null}
              {estimate ? (
                <KeyValueList items={[
                  { label: "Parameters", value: estimate.parameter_count },
                  { label: "Configuration", value: JSON.stringify(estimate.configuration) },
                  { label: "Memory", value: JSON.stringify(estimate.estimated_memory) },
                  { label: "Native heads", value: "Fixed in ArcLM v0.9 native model" }
                ]} />
              ) : null}
              {created ? <Alert variant="success" title="Model saved"><Link href={`/projects/${projectId}/train`}>Open Training Studio</Link></Alert> : null}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
