"use client";

import { FormEvent, useMemo, useState } from "react";
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
  TextInput,
  Textarea
} from "@/components/ui";
import { ApiClientError, createApiClient } from "@/lib/api/client";
import type { PipelineInspectionRequest, PipelineTraceResponse } from "@/lib/api/schemas";

export type PipelineInspectionClient = {
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
  if (!error) {
    return "Pipeline inspection failed";
  }
  if (error.code === "native_model_not_configured") {
    return "Local inspection model is not configured";
  }
  if (error.code === "disconnected" || error.code === "timeout") {
    return "ArcLM backend is not connected";
  }
  return "Pipeline inspection failed";
}

function StageCard({
  index,
  title,
  description,
  value
}: {
  index: number;
  title: string;
  description: string;
  value: string;
}) {
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

function TraceView({ trace }: { trace: PipelineTraceResponse }) {
  const stages = [
    {
      title: "Input",
      description: "Text submitted to the native ArcLM inspection endpoint.",
      value: trace.input_text
    },
    {
      title: "Tokenization",
      description: "Readable token pieces produced by the tokenizer.",
      value: formatList(trace.tokens)
    },
    {
      title: "Token IDs",
      description: "Numeric identifiers passed into the native model.",
      value: `[${formatList(trace.token_ids)}]`
    },
    {
      title: "Input Tensor",
      description: "Batch and sequence shape entering the model.",
      value: formatShape(trace.input_shape)
    },
    {
      title: "Embeddings",
      description: "Shape produced by the model input embedding layer.",
      value: formatShape(trace.embedding_shape)
    },
    {
      title: "Model Output / Logits",
      description: "Shape returned by the native forward pass.",
      value: formatShape(trace.logits_shape)
    },
    {
      title: "Selected Token",
      description: "The token selected by the existing native generator.",
      value: `${trace.selected_token} (${trace.selected_token_id})`
    },
    {
      title: "Generated Text",
      description: "Decoded text after the inspected generation step.",
      value: trace.generated_text
    }
  ];

  return (
    <div className="pipeline-result" aria-live="polite">
      <Card>
        <CardHeader>
          <CardTitle>Native trace metadata</CardTitle>
          <CardDescription>Read-only information returned by PipelineTrace.</CardDescription>
        </CardHeader>
        <CardContent>
          <KeyValueList
            items={[
              { label: "Model", value: trace.model_class },
              { label: "Tokenizer", value: trace.tokenizer_class },
              { label: "Device", value: trace.device },
              { label: "Dtype", value: trace.dtype },
              { label: "Inspected steps", value: trace.inspected_steps },
              { label: "Generation steps", value: trace.generation_steps },
              {
                label: "Attention",
                value: trace.attention_available ? "Available" : "Not available in this inspection version"
              }
            ]}
          />
        </CardContent>
      </Card>

      <div className="pipeline-stage-grid">
        {stages.map((stage, index) => (
          <StageCard key={stage.title} index={index + 1} {...stage} />
        ))}
      </div>

      <Alert variant="info" title="Attention availability">
        {trace.attention_available ? "Attention metadata is available for this trace." : trace.attention_note}
      </Alert>

      {trace.warnings.length ? (
        <Card>
          <CardHeader>
            <CardTitle>Trace warnings</CardTitle>
            <CardDescription>Warnings returned by the native inspector.</CardDescription>
          </CardHeader>
          <CardContent className="pipeline-warning-list">
            {trace.warnings.map((warning) => (
              <Badge key={warning} variant="warning">{warning}</Badge>
            ))}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

export function PipelineLearningPage({ client }: { client?: PipelineInspectionClient }) {
  const defaultClient = useMemo(() => createApiClient(), []);
  const activeClient = client ?? defaultClient;
  const [text, setText] = useState(defaultPrompt);
  const [includeValues, setIncludeValues] = useState(false);
  const [maxValues, setMaxValues] = useState(20);
  const [trace, setTrace] = useState<PipelineTraceResponse | null>(null);
  const [error, setError] = useState<ApiClientError | null>(null);
  const [inlineError, setInlineError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setInlineError(null);
    setError(null);
    if (!text.trim()) {
      setInlineError("Enter text before inspecting the pipeline.");
      return;
    }

    setLoading(true);
    try {
      const response = await activeClient.inspectPipelineText({
        text,
        include_values: includeValues,
        max_values: maxValues
      });
      setTrace(response);
    } catch (requestError) {
      setTrace(null);
      if (requestError instanceof ApiClientError) {
        setError(requestError);
      } else {
        setError(new ApiClientError("Pipeline inspection failed.", "request_failed"));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pipeline-page">
      <PageHeader
        title="Pipeline Learning"
        description="Inspect one read-only native ArcLM text-generation step from tokenizer input through decoded output."
      />

      <Card>
        <CardHeader>
          <CardTitle>Inspect native pipeline</CardTitle>
          <CardDescription>The backend calls arclm.inspect_text with the configured local native model and tokenizer.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="pipeline-form" onSubmit={submit}>
            <Textarea
              label="Input text"
              value={text}
              onChange={(event) => setText(event.target.value)}
              error={inlineError ?? undefined}
              required
            />
            <div className="pipeline-options">
              <Checkbox
                label="Include limited tensor values"
                description="Disabled by default; shapes and metadata are usually enough."
                checked={includeValues}
                onChange={(event) => setIncludeValues(event.currentTarget.checked)}
              />
              <TextInput
                label="Maximum values"
                type="number"
                min={1}
                max={50}
                value={maxValues}
                onChange={(event) => setMaxValues(Number(event.target.value))}
              />
            </div>
            <Button type="submit" loading={loading} loadingLabel="Inspecting pipeline">
              Inspect pipeline
            </Button>
          </form>
        </CardContent>
      </Card>

      {error ? (
        <ErrorState
          title={errorTitle(error)}
          description={error.message}
          details={error.code}
        />
      ) : null}

      {trace ? <TraceView trace={trace} /> : null}
    </div>
  );
}
