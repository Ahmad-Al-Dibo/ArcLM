"use client";

import { useState } from "react";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, ErrorState, KeyValueList, PageHeader, Textarea } from "@/components/ui";
import type { PipelineTraceResponse } from "@/lib/api/schemas";
import { errorMessage, type StudioClient, useClient } from "./shared";

export function CheckpointInspectionPage({ projectId, checkpointId, client }: { projectId: string; checkpointId: string; client?: StudioClient }) {
  const api = useClient(client);
  const [text, setText] = useState("Explain ArcLM.");
  const [trace, setTrace] = useState<PipelineTraceResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function inspect() {
    try {
      setTrace(await api.inspectProjectCheckpoint(projectId, checkpointId, { text, include_values: false, max_values: 20 }));
      setError(null);
    } catch (requestError) {
      setError(errorMessage(requestError));
    }
  }

  return (
    <div className="studio-page">
      <PageHeader title="Checkpoint Inspection" description="Reconstructs the native checkpoint and calls arclm.inspect_text." />
      {error ? <ErrorState title="Inspection failed" description={error} /> : null}
      <Card>
        <CardHeader><CardTitle>Prompt</CardTitle><CardDescription>One native inspection step. No attention maps or streaming.</CardDescription></CardHeader>
        <CardContent className="studio-form">
          <Textarea label="Input text" value={text} onChange={(event) => setText(event.target.value)} />
          <Button onClick={() => void inspect()} disabled={!text.trim()}>Inspect checkpoint</Button>
        </CardContent>
      </Card>
      {trace ? (
        <Card>
          <CardHeader><CardTitle>Pipeline trace</CardTitle></CardHeader>
          <CardContent>
            <KeyValueList items={[
              { label: "Input", value: trace.input_text },
              { label: "Tokens", value: trace.tokens.join(", ") },
              { label: "Token IDs", value: JSON.stringify(trace.token_ids) },
              { label: "Input shape", value: JSON.stringify(trace.input_shape) },
              { label: "Embedding shape", value: JSON.stringify(trace.embedding_shape) },
              { label: "Logits shape", value: JSON.stringify(trace.logits_shape) },
              { label: "Selected token", value: trace.selected_token },
              { label: "Generated text", value: trace.generated_text },
              { label: "Device", value: trace.device },
              { label: "Attention", value: trace.attention_available ? "Available" : "Not available in this inspection version" }
            ]} />
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
