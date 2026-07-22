"use client";

import Link from "next/link";
import {
  Alert,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  EmptyState,
  KeyValueList,
  PageHeader
} from "@/components/ui";
import { LoadingCard, type StudioClient, useClient, useProjectAssets } from "./shared";

export function TrainingStudioPage({ projectId, client }: { projectId: string; client?: StudioClient }) {
  const api = useClient(client);
  const assets = useProjectAssets(projectId, api);

  const hasData = assets.datasets.length > 0;
  const hasTokenizer = assets.tokenizers.length > 0;
  const hasModel = assets.models.length > 0;
  const pretrainingReady = hasData && hasTokenizer && hasModel;
  const fineTuningReady = pretrainingReady;

  return (
    <div className="studio-page">
      <PageHeader
        title="Training Center"
        description="Choose whether you are starting a new native model from an initialized state or fine-tuning an existing model/checkpoint."
      />
      {assets.loading ? (
        <LoadingCard title="Training Center" />
      ) : (
        <>
          <Alert variant="info" title="Two different workflows">
            Pre-training starts from a newly initialized native ArcLM model. Fine-tuning starts from an existing model configuration or compatible checkpoint and applies a formatting contract to the dataset.
          </Alert>
          {assets.error ? <EmptyState title="Project assets unavailable" description={assets.error} /> : null}
          <div className="studio-grid">
            <Card>
              <CardHeader>
                <CardTitle>Pre-Training</CardTitle>
                <CardDescription>Create and train a new initialized native ArcLM causal model from local text records.</CardDescription>
              </CardHeader>
              <CardContent>
                <KeyValueList items={[
                  { label: "Dataset", value: hasData ? "Ready" : "Missing" },
                  { label: "Tokenizer", value: hasTokenizer ? "Ready" : "Missing" },
                  { label: "Native model", value: hasModel ? "Ready" : "Missing" },
                  { label: "Starting source", value: "Initialized model parameters" }
                ]} />
                <div className="studio-actions">
                  <Link className="ui-button ui-button-primary" href={`/projects/${projectId}/train/pretraining`}>
                    Open Pre-Training
                  </Link>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Fine-Tuning</CardTitle>
                <CardDescription>Continue from a saved project model or compatible checkpoint using explicit SFT formatting.</CardDescription>
              </CardHeader>
              <CardContent>
                <KeyValueList items={[
                  { label: "Dataset", value: hasData ? "Ready" : "Missing" },
                  { label: "Tokenizer", value: hasTokenizer ? "Ready" : "Missing" },
                  { label: "Base model/checkpoint", value: hasModel ? "Model available" : "Missing" },
                  { label: "Supported methods", value: "Full, SFT" }
                ]} />
                <div className="studio-actions">
                  <Link className="ui-button ui-button-primary" href={`/projects/${projectId}/train/finetuning`}>
                    Open Fine-Tuning
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
          {!pretrainingReady || !fineTuningReady ? (
            <EmptyState
              title="Training setup is not ready yet"
              description="Add a dataset, create a tokenizer, and configure a native model before starting either workflow."
            />
          ) : null}
          <div className="studio-actions">
            <Link className="ui-button ui-button-secondary" href={`/projects/${projectId}/runs`}>View runs</Link>
            <Link className="ui-button ui-button-secondary" href={`/projects/${projectId}/checkpoints`}>View checkpoints</Link>
          </div>
        </>
      )}
    </div>
  );
}
