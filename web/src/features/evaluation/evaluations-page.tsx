"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle, EmptyState, ErrorState, KeyValueList, PageHeader } from "@/components/ui";
import { errorMessage, statusVariant, text, type StudioClient, useClient } from "@/features/checkpoints/shared";

export function EvaluationsPage({ projectId, client }: { projectId: string; client?: StudioClient }) {
  const api = useClient(client);
  const [evaluations, setEvaluations] = useState<Array<Record<string, unknown>>>([]);
  const [comparison, setComparison] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.listProjectEvaluations(projectId).then((response) => setEvaluations(response.evaluations)).catch((requestError) => setError(errorMessage(requestError)));
  }, [api, projectId]);

  async function compareCompleted() {
    const ids = evaluations.filter((item) => item.status === "completed").map((item) => String(item.id));
    if (!ids.length) return;
    const response = await api.compareProjectEvaluations(projectId, { evaluation_ids: ids });
    setComparison(response as unknown as Record<string, unknown>);
  }

  return (
    <div className="studio-page">
      <PageHeader title="Evaluations" description="Completed and active native evaluation jobs." actions={<Link className="ui-button ui-button-primary" href={`/projects/${projectId}/evaluate`}>New evaluation</Link>} />
      {error ? <ErrorState title="Evaluations unavailable" description={error} /> : null}
      <div className="studio-actions"><button className="ui-button ui-button-secondary" type="button" onClick={() => void compareCompleted()}>Compare completed</button></div>
      <div className="studio-grid">
        {evaluations.length ? evaluations.map((evaluation) => (
          <Card key={String(evaluation.id)}>
            <CardHeader><CardTitle>{text(evaluation.id)}</CardTitle><CardDescription>Checkpoint {text(evaluation.checkpoint_id)}</CardDescription></CardHeader>
            <CardContent>
              <Badge variant={statusVariant(evaluation.status)}>{text(evaluation.status)}</Badge>
              <KeyValueList items={[
                { label: "Loss", value: text((evaluation.metrics as Record<string, unknown> | undefined)?.loss) },
                { label: "Perplexity", value: text((evaluation.metrics as Record<string, unknown> | undefined)?.perplexity) },
                { label: "Examples", value: text(evaluation.example_count) },
                { label: "Device", value: text(evaluation.device) }
              ]} />
              <Link className="ui-button ui-button-secondary" href={`/projects/${projectId}/evaluations/${evaluation.id}`}>Details</Link>
            </CardContent>
          </Card>
        )) : <EmptyState title="No evaluations" description="Evaluate a compatible checkpoint to create reports." />}
      </div>
      {comparison ? <Card><CardHeader><CardTitle>Comparison</CardTitle></CardHeader><CardContent><pre className="studio-json">{JSON.stringify(comparison, null, 2)}</pre></CardContent></Card> : null}
    </div>
  );
}
