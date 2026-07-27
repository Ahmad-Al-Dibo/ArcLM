"use client";

import { useCallback, useEffect, useState } from "react";
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, ErrorState, KeyValueList, PageHeader } from "@/components/ui";
import { errorMessage, statusVariant, text, type StudioClient, useClient } from "@/features/checkpoints/shared";

export function EvaluationDetailsPage({ projectId, evaluationId, client }: { projectId: string; evaluationId: string; client?: StudioClient }) {
  const api = useClient(client);
  const [evaluation, setEvaluation] = useState<Record<string, unknown> | null>(null);
  const [events, setEvents] = useState<Array<Record<string, unknown>>>([]);
  const [report, setReport] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const [evaluationData, eventData] = await Promise.all([
      api.getProjectEvaluation(projectId, evaluationId),
      api.getProjectEvaluationEvents(projectId, evaluationId)
    ]);
    setEvaluation(evaluationData.evaluation);
    setEvents(eventData.items);
    if (evaluationData.evaluation.status === "completed") {
      const reportData = await api.getProjectEvaluationReport(projectId, evaluationId);
      setReport(reportData.report);
    }
    return evaluationData.evaluation;
  }, [api, projectId, evaluationId]);

  useEffect(() => {
    let active = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const poll = () => {
      refresh().then((next) => {
        if (!active) return;
        if (!["completed", "failed", "cancelled", "interrupted"].includes(String(next.status))) timer = setTimeout(poll, 2000);
      }).catch((requestError) => active && setError(errorMessage(requestError)));
    };
    poll();
    return () => {
      active = false;
      if (timer) clearTimeout(timer);
    };
  }, [refresh]);

  async function cancel() {
    const response = await api.cancelProjectEvaluation(projectId, evaluationId);
    setEvaluation(response.evaluation);
  }

  if (error) return <ErrorState title="Evaluation unavailable" description={error} />;
  if (!evaluation) return <Card><CardContent>Loading evaluation.</CardContent></Card>;

  return (
    <div className="studio-page">
      <PageHeader title={String(evaluation.id)} description="Evaluation status, canonical report and event history." />
      <Badge variant={statusVariant(evaluation.status)}>{text(evaluation.status)}</Badge>
      {["queued", "starting", "running", "cancelling"].includes(String(evaluation.status)) ? <Button variant="destructive" onClick={() => void cancel()}>Cancel evaluation</Button> : null}
      <Card>
        <CardHeader><CardTitle>Report summary</CardTitle><CardDescription>Metrics originate from EvaluationReport.to_dict().</CardDescription></CardHeader>
        <CardContent>
          <KeyValueList items={[
            { label: "Checkpoint", value: text(evaluation.checkpoint_id) },
            { label: "Dataset", value: text(evaluation.dataset_id) },
            { label: "Tokenizer", value: text(evaluation.tokenizer_id) },
            { label: "Examples", value: text(evaluation.example_count) },
            { label: "Tokens", value: text(evaluation.token_count) },
            { label: "Loss", value: text((evaluation.metrics as Record<string, unknown> | undefined)?.loss) },
            { label: "Perplexity", value: text((evaluation.metrics as Record<string, unknown> | undefined)?.perplexity) },
            { label: "Accuracy", value: text((evaluation.metrics as Record<string, unknown> | undefined)?.accuracy) },
            { label: "Device", value: text(evaluation.device) },
            { label: "Precision", value: text(evaluation.precision) }
          ]} />
        </CardContent>
      </Card>
      {report ? <Card><CardHeader><CardTitle>Report JSON export</CardTitle></CardHeader><CardContent><pre className="studio-json">{JSON.stringify(report, null, 2)}</pre></CardContent></Card> : null}
      <Card><CardHeader><CardTitle>Events</CardTitle></CardHeader><CardContent><pre className="studio-json">{JSON.stringify(events, null, 2)}</pre></CardContent></Card>
    </div>
  );
}
