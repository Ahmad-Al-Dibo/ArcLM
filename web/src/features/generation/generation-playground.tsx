"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Alert, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, EmptyState, ErrorState, KeyValueList, PageHeader, Select, Textarea, TextInput } from "@/components/ui";
import { errorMessage, text, type StudioClient, useClient } from "@/features/checkpoints/shared";

export function GenerationPlaygroundPage({ projectId, initialCheckpointId, client }: { projectId: string; initialCheckpointId?: string; client?: StudioClient }) {
  const api = useClient(client);
  const [checkpoints, setCheckpoints] = useState<Array<Record<string, unknown>>>([]);
  const [history, setHistory] = useState<Array<Record<string, unknown>>>([]);
  const [checkpointId, setCheckpointId] = useState(initialCheckpointId ?? "");
  const [prompt, setPrompt] = useState("Explain ArcLM.");
  const [maxNewTokens, setMaxNewTokens] = useState(16);
  const [temperature, setTemperature] = useState(1);
  const [topK, setTopK] = useState("");
  const [topP, setTopP] = useState("");
  const [seed, setSeed] = useState("");
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    const [checkpointData, generationData] = await Promise.all([
      api.listProjectCheckpoints(projectId),
      api.listProjectGenerations(projectId)
    ]);
    setCheckpoints(checkpointData.checkpoints);
    setHistory(generationData.generations);
    setCheckpointId((current) => current || initialCheckpointId || String(checkpointData.checkpoints[0]?.id ?? ""));
  }

  useEffect(() => {
    let active = true;
    void Promise.all([
      api.listProjectCheckpoints(projectId),
      api.listProjectGenerations(projectId)
    ]).then(([checkpointData, generationData]) => {
      if (!active) return;
      setCheckpoints(checkpointData.checkpoints);
      setHistory(generationData.generations);
      setCheckpointId((current) => current || initialCheckpointId || String(checkpointData.checkpoints[0]?.id ?? ""));
    }).catch((requestError) => {
      if (active) setError(errorMessage(requestError));
    });
    return () => {
      active = false;
    };
  }, [api, projectId, initialCheckpointId]);

  async function generate() {
    try {
      const response = await api.createProjectGeneration(projectId, {
        checkpoint_id: checkpointId,
        prompt,
        max_new_tokens: maxNewTokens,
        temperature,
        top_k: topK ? Number(topK) : null,
        top_p: topP ? Number(topP) : null,
        seed: seed ? Number(seed) : null,
        device: "cpu",
        precision: "fp32"
      });
      setResult(response.generation);
      await refresh();
      setError(null);
    } catch (requestError) {
      setError(errorMessage(requestError));
    }
  }

  async function deleteGeneration(generationId: string) {
    await api.deleteProjectGeneration(projectId, generationId, { confirm: true });
    await refresh();
  }

  const selected = checkpoints.find((checkpoint) => checkpoint.id === checkpointId);

  return (
    <div className="studio-page">
      <PageHeader title="Generation Playground" description="Bounded native text completion from compatible ArcLM checkpoints. No streaming or external models." />
      {error ? <ErrorState title="Generation failed" description={error} /> : null}
      <div className="studio-two-column">
        <Card>
          <CardHeader><CardTitle>Prompt</CardTitle><CardDescription>Generation uses the checkpoint tokenizer. Maximum new tokens limits output length; temperature controls randomness; top-k and top-p restrict sampling choices.</CardDescription></CardHeader>
          <CardContent className="studio-form">
            {!checkpoints.length ? <EmptyState title="No compatible checkpoints" description="Train a native model and validate a checkpoint before generating text." /> : null}
            <Select label="Checkpoint" value={checkpointId} onChange={(event) => setCheckpointId(event.target.value)}>
              <option value="">Select checkpoint</option>
              {checkpoints.map((checkpoint) => <option key={String(checkpoint.id)} value={String(checkpoint.id)}>{text(checkpoint.name)} - {text(checkpoint.reload_status)}</option>)}
            </Select>
            <Textarea label="Prompt" value={prompt} onChange={(event) => setPrompt(event.target.value)} rows={6} />
            <TextInput label="Maximum new tokens" type="number" value={String(maxNewTokens)} onChange={(event) => setMaxNewTokens(Number(event.target.value))} />
            <TextInput label="Temperature" type="number" value={String(temperature)} onChange={(event) => setTemperature(Number(event.target.value))} />
            <TextInput label="Top-k" type="number" value={topK} onChange={(event) => setTopK(event.target.value)} />
            <TextInput label="Top-p" type="number" value={topP} onChange={(event) => setTopP(event.target.value)} />
            <TextInput label="Seed" type="number" value={seed} onChange={(event) => setSeed(event.target.value)} />
            <Button onClick={() => void generate()} disabled={!checkpointId || !prompt.trim() || selected?.reload_status !== "compatible"}>Generate</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Result</CardTitle><CardDescription>Generated text is stored as bounded local history.</CardDescription></CardHeader>
          <CardContent>
            {result ? (
              <>
                <Alert variant="success" title="Generation completed">{text(result.generated_text)}</Alert>
                <KeyValueList items={[
                  { label: "Input tokens", value: text(result.input_token_count) },
                  { label: "Generated tokens", value: text(result.generated_token_count) },
                  { label: "Elapsed", value: `${text(result.elapsed_seconds)} seconds` },
                  { label: "Tokens/sec", value: text(result.tokens_per_second) },
                  { label: "Device", value: text(result.device) }
                ]} />
                <div className="studio-actions">
                  <button className="ui-button ui-button-secondary" type="button" onClick={() => void navigator.clipboard?.writeText(String(result.generated_text ?? ""))}>Copy</button>
                  <Link className="ui-button ui-button-secondary" href={`/projects/${projectId}/checkpoints/${checkpointId}/inspect`}>Inspect first step</Link>
                </div>
              </>
            ) : <p>No generation yet.</p>}
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Generation history</CardTitle><CardDescription>Prompt and output records are bounded; tensors are never stored.</CardDescription></CardHeader>
        <CardContent className="studio-list">
          {history.length ? history.map((item) => (
            <div className="studio-list-item" key={String(item.id)}>
              <strong>{text(item.prompt)}</strong>
              <span>{text(item.generated_text)}</span>
              <div className="studio-actions">
                <button className="ui-button ui-button-secondary" type="button" onClick={() => setResult(item)}>Open</button>
                <button className="ui-button ui-button-destructive" type="button" onClick={() => void deleteGeneration(String(item.id))}>Delete</button>
              </div>
            </div>
          )) : <EmptyState title="No generations" description="Generate from a compatible checkpoint to create local history." />}
        </CardContent>
      </Card>
    </div>
  );
}
