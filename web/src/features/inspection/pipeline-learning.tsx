"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  ErrorState,
  KeyValueList,
  PageHeader,
  Select,
  TextInput,
  Textarea
} from "@/components/ui";
import { ApiClientError, createApiClient } from "@/lib/api/client";
import type { PipelineInspectionRequest, PipelineInspectionStatusResponse, PipelineTraceResponse } from "@/lib/api/schemas";

export type PipelineInspectionClient = {
  getPipelineInspectionStatus?: () => Promise<PipelineInspectionStatusResponse>;
  inspectPipelineText: (payload: PipelineInspectionRequest) => Promise<PipelineTraceResponse>;
};

const defaultPrompt = "hello arclm";

function formatList(values: Array<string | number>) {
  return values.length ? values.join(", ") : "Not available in this inspection version";
}

function formatShape(shape: number[]) {
  return shape.length ? `[${shape.join(", ")}]` : "Not available in this inspection version";
}

function errorTitle(error: ApiClientError | null) {
  if (!error) return "Pipeline inspection failed";
  if (error.code === "native_model_not_configured" || error.code === "inspection_source_not_selected") return "Inspection source is not selected";
  if (error.code === "disconnected" || error.code === "timeout") return "ArcLM backend is not connected";
  return "Pipeline inspection failed";
}

function stringValue(value: unknown) {
  if (value === null || value === undefined || value === "") return "Not available in this inspection version";
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function StageCard({ index, title, description, value }: { index: number; title: string; description: string; value: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{index}. {title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <code className="pipeline-value">{value || "Not available in this inspection version"}</code>
      </CardContent>
    </Card>
  );
}

function StatusRecovery({ status, onDemo }: { status: PipelineInspectionStatusResponse | null; onDemo: () => void }) {
  if (!status || status.initialized) return null;
  return (
    <Alert variant="info" title="Inspection source not selected">
      <p>{status.message ?? "Choose how ArcLM should source the model and tokenizer for inspection."}</p>
      <div className="studio-actions">
        <Button type="button" onClick={onDemo}>Start educational demo</Button>
        <Link className="ui-button ui-button-secondary" href="/projects">Select a project model</Link>
        <Link className="ui-button ui-button-secondary" href="/projects">Open Checkpoint Manager</Link>
      </div>
    </Alert>
  );
}

function TraceView({ trace }: { trace: PipelineTraceResponse }) {
  const model = trace.model ?? {};
  const tokenizer = trace.tokenizer ?? {};
  const configuration = (model.configuration ?? {}) as Record<string, unknown>;
  const stages = [
    ["Input text", "Original text submitted to the backend.", trace.input_text],
    ["Tokenization", "Readable tokens or pieces from the tokenizer.", formatList(trace.tokens)],
    ["Token IDs", "Numeric identifiers passed to the native model.", `[${formatList(trace.token_ids)}]`],
    ["Input tensor shape", "Batch and sequence shape entering the model.", formatShape(trace.input_shape)],
    ["Token embeddings", "Shape from the real native embedding layer.", formatShape(trace.embedding_shape)],
    ["Position information", "Position embedding metadata when model configuration exposes it.", `context length ${stringValue(configuration.block_size)}`],
    ["Transformer blocks", "Native ArcLM transformer stack metadata; attention maps are not captured.", `blocks ${stringValue(configuration.num_blocks)}, hidden ${stringValue(configuration.embed_dim)}`],
    ["Final hidden state", "Hidden-state tensor capture is not retained in this inspection version.", "Not available in this inspection version"],
    ["Logits shape", "Shape returned by the native forward pass.", formatShape(trace.logits_shape)],
    ["Selected token", "The one token selected by canonical native generation.", `${trace.selected_token} (${trace.selected_token_id})`],
    ["One generated token", "Decoded result after the inspected one-step generation.", trace.generated_text]
  ] satisfies Array<[string, string, string]>;

  return (
    <div className="pipeline-result" aria-live="polite">
      <Card>
        <CardHeader>
          <CardTitle>Native trace metadata</CardTitle>
          <CardDescription>Read-only information returned by PipelineTrace and safe web source metadata.</CardDescription>
        </CardHeader>
        <CardContent>
          <KeyValueList
            items={[
              { label: "Source", value: trace.source_label ?? trace.source_mode ?? "Configured native model" },
              { label: "Model state", value: trace.model_state ?? "configured" },
              { label: "Model", value: trace.model_class },
              { label: "Tokenizer", value: trace.tokenizer_class },
              { label: "Tokenizer type", value: stringValue(tokenizer.tokenizer_type) },
              { label: "Vocabulary size", value: stringValue(tokenizer.vocab_size ?? configuration.vocab_size) },
              { label: "Device", value: trace.device },
              { label: "Dtype", value: trace.dtype },
              { label: "Inspected steps", value: trace.inspected_steps },
              { label: "Generation steps", value: trace.generation_steps },
              { label: "Attention", value: trace.attention_available ? "Available" : "Not available in this inspection version" }
            ]}
          />
        </CardContent>
      </Card>

      <div className="pipeline-stage-grid">
        {stages.map(([title, description, value], index) => (
          <StageCard key={title} index={index + 1} title={title} description={description} value={value} />
        ))}
      </div>

      {trace.values ? (
        <Card>
          <CardHeader><CardTitle>Bounded value preview</CardTitle><CardDescription>Small detached samples only; full tensors are not returned.</CardDescription></CardHeader>
          <CardContent><pre className="studio-json">{JSON.stringify(trace.values, null, 2)}</pre></CardContent>
        </Card>
      ) : null}

      <Alert variant="info" title="Attention availability">
        {trace.attention_available ? "Attention metadata is available for this trace." : trace.attention_note}
      </Alert>

      {trace.warnings.length ? (
        <Card>
          <CardHeader><CardTitle>Trace warnings</CardTitle><CardDescription>Warnings returned by the native inspector.</CardDescription></CardHeader>
          <CardContent className="pipeline-warning-list">
            {trace.warnings.map((warning) => <Badge key={warning} variant="warning">{warning}</Badge>)}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

export function PipelineLearningPage({ client }: { client?: PipelineInspectionClient }) {
  const defaultClient = useMemo(() => createApiClient(), []);
  const activeClient = client ?? defaultClient;
  const [status, setStatus] = useState<PipelineInspectionStatusResponse | null>(null);
  const [sourceMode, setSourceMode] = useState<PipelineInspectionRequest["source_mode"]>("demo");
  const [projectId, setProjectId] = useState("");
  const [datasetId, setDatasetId] = useState("");
  const [tokenizerId, setTokenizerId] = useState("");
  const [modelId, setModelId] = useState("");
  const [checkpointId, setCheckpointId] = useState("");
  const [text, setText] = useState(defaultPrompt);
  const [device, setDevice] = useState<"auto" | "cpu" | "cuda">("cpu");
  const [includeValues, setIncludeValues] = useState(false);
  const [maxValues, setMaxValues] = useState(20);
  const [trace, setTrace] = useState<PipelineTraceResponse | null>(null);
  const [error, setError] = useState<ApiClientError | null>(null);
  const [inlineError, setInlineError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    activeClient.getPipelineInspectionStatus?.()
      .then((value) => { if (active) setStatus(value); })
      .catch(() => undefined);
    return () => { active = false; };
  }, [activeClient]);

  async function submit(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    setInlineError(null);
    setError(null);
    if (!text.trim()) {
      setInlineError("Enter text before inspecting the pipeline.");
      return;
    }
    if (sourceMode === "project_model" && (!projectId || !modelId)) {
      setInlineError("Project model inspection requires a project ID and model ID.");
      return;
    }
    if (sourceMode === "checkpoint" && (!projectId || !checkpointId)) {
      setInlineError("Checkpoint inspection requires a project ID and checkpoint ID.");
      return;
    }

    setLoading(true);
    try {
      const response = await activeClient.inspectPipelineText({
        text,
        include_values: includeValues,
        max_values: maxValues,
        source_mode: sourceMode,
        project_id: projectId || null,
        dataset_id: datasetId || null,
        tokenizer_id: tokenizerId || null,
        model_id: modelId || null,
        checkpoint_id: checkpointId || null,
        device,
        precision: "fp32"
      });
      setTrace(response);
    } catch (requestError) {
      setTrace(null);
      setError(requestError instanceof ApiClientError ? requestError : new ApiClientError("Pipeline inspection failed.", "request_failed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pipeline-page">
      <PageHeader title="Pipeline Learning" description="Inspect one read-only native ArcLM pipeline step from text input through one decoded token." />

      <StatusRecovery status={status} onDemo={() => setSourceMode("demo")} />

      <Card>
        <CardHeader>
          <CardTitle>Inspection source</CardTitle>
          <CardDescription>Choose a real source. Demo uses a tiny untrained CPU model created by the backend.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="pipeline-form" onSubmit={(event) => void submit(event)}>
            <Select label="Inspection source" value={sourceMode} onChange={(event) => setSourceMode(event.target.value as PipelineInspectionRequest["source_mode"])}>
              <option value="demo">Learn with a tiny demo</option>
              <option value="project_model">Inspect a project model</option>
              <option value="checkpoint">Inspect a checkpoint</option>
              <option value="configured">Configured app model</option>
            </Select>
            {sourceMode !== "demo" && sourceMode !== "configured" ? (
              <div className="studio-grid">
                <TextInput label="Project ID" value={projectId} onChange={(event) => setProjectId(event.target.value)} />
                {sourceMode === "project_model" ? (
                  <>
                    <TextInput label="Model ID" value={modelId} onChange={(event) => setModelId(event.target.value)} />
                    <TextInput label="Tokenizer ID" value={tokenizerId} onChange={(event) => setTokenizerId(event.target.value)} />
                    <TextInput label="Dataset ID" value={datasetId} onChange={(event) => setDatasetId(event.target.value)} />
                  </>
                ) : (
                  <TextInput label="Checkpoint ID" value={checkpointId} onChange={(event) => setCheckpointId(event.target.value)} />
                )}
              </div>
            ) : null}
            <Textarea label="Input text" value={text} onChange={(event) => setText(event.target.value)} error={inlineError ?? undefined} required />
            <div className="pipeline-options">
              <Select label="Device" value={device} onChange={(event) => setDevice(event.target.value as "auto" | "cpu" | "cuda")}>
                <option value="cpu">cpu</option>
                <option value="auto">auto</option>
                <option value="cuda">cuda</option>
              </Select>
              <Checkbox label="Include limited tensor values" description="Disabled by default; shapes and metadata are usually enough." checked={includeValues} onChange={(event) => setIncludeValues(event.currentTarget.checked)} />
              <TextInput label="Maximum displayed values" type="number" min={1} max={50} value={maxValues} onChange={(event) => setMaxValues(Number(event.target.value))} />
            </div>
            <Button type="submit" loading={loading} loadingLabel="Inspecting pipeline">Inspect pipeline</Button>
          </form>
        </CardContent>
      </Card>

      {error ? <ErrorState title={errorTitle(error)} description={error.message} details={error.code} /> : null}
      {trace ? <TraceView trace={trace} /> : null}
    </div>
  );
}
