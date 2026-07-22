"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import {
  Alert,
  Badge,
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
  TextInput,
  Textarea
} from "@/components/ui";
import type { StudioDatasetMetadata, StudioProject, StudioTokenizerMetadata } from "@/lib/api/schemas";
import { errorMessage, LoadingCard, ProjectCard, type StudioClient, useStudioClient } from "./shared";

export function ProjectsPage({ client }: { client?: StudioClient }) {
  const api = useStudioClient(client);
  const [projects, setProjects] = useState<StudioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    try {
      const response = await api.listProjects();
      setProjects(response.projects);
      setError(null);
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }

  async function deleteProject(project: StudioProject) {
    const confirmation = window.prompt(`Type "${project.name}" to delete this project.`);
    if (confirmation !== project.name) {
      return;
    }
    try {
      await api.deleteProject(project.id, { confirm: true, confirm_name: confirmation });
      await refresh();
      setError(null);
    } catch (requestError) {
      setError(errorMessage(requestError));
    }
  }

  useEffect(() => {
    let active = true;
    api.listProjects()
      .then((response) => {
        if (!active) return;
        setProjects(response.projects);
        setError(null);
      })
      .catch((requestError) => {
        if (active) setError(errorMessage(requestError));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [api]);

  return (
    <div className="studio-page">
      <PageHeader
        title="Projects"
        description="Create and manage local ArcLM Studio workspaces."
        actions={<Link className="ui-button ui-button-primary" href="/projects/new">New project</Link>}
      />
      {error ? <ErrorState title="Projects unavailable" description={error} actionLabel="Retry" onAction={refresh} /> : null}
      {loading ? <LoadingCard title="Projects" /> : null}
      {!loading && !projects.length ? <EmptyState title="No projects yet" description="Create a project to start a local ArcLM workflow." /> : null}
      <div className="studio-grid">
        {projects.map((project) => <ProjectCard key={project.id} project={project} onDelete={deleteProject} />)}
      </div>
    </div>
  );
}

export function NewProjectPage({ client }: { client?: StudioClient }) {
  const api = useStudioClient(client);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [created, setCreated] = useState<StudioProject | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) {
      setError("Project name is required.");
      return;
    }
    setLoading(true);
    try {
      const project = await api.createProject({ name, description });
      setCreated(project);
      setError(null);
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="studio-page">
      <PageHeader title="Create project" description="Start a controlled local workspace for datasets and tokenizers." />
      <Card>
        <CardHeader>
          <CardTitle>Project details</CardTitle>
          <CardDescription>Names are validated by the backend and project IDs are generated server-side.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="studio-form" onSubmit={submit}>
            <TextInput label="Project name" value={name} onChange={(event) => setName(event.target.value)} required />
            <Textarea label="Description" value={description} onChange={(event) => setDescription(event.target.value)} />
            <Button type="submit" loading={loading}>Create project</Button>
          </form>
        </CardContent>
      </Card>
      {error ? <ErrorState title="Project could not be created" description={error} /> : null}
      {created ? (
        <Alert variant="success" title="Project created">
          <Link href={`/projects/${created.id}`}>Open {created.name}</Link>
        </Alert>
      ) : null}
    </div>
  );
}

export function ProjectOverviewPage({ projectId, client }: { projectId: string; client?: StudioClient }) {
  const api = useStudioClient(client);
  const [project, setProject] = useState<StudioProject | null>(null);
  const [datasets, setDatasets] = useState<StudioDatasetMetadata[]>([]);
  const [tokenizers, setTokenizers] = useState<StudioTokenizerMetadata[]>([]);
  const [modelCount, setModelCount] = useState(0);
  const [runCount, setRunCount] = useState(0);
  const [completedRunCount, setCompletedRunCount] = useState(0);
  const [checkpointCount, setCheckpointCount] = useState(0);
  const [compatibleCheckpointCount, setCompatibleCheckpointCount] = useState(0);
  const [evaluationCount, setEvaluationCount] = useState(0);
  const [generationCount, setGenerationCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([
      api.getProject(projectId),
      api.listProjectDatasets(projectId),
      api.listProjectTokenizers(projectId),
      api.listProjectModels(projectId),
      api.listProjectRuns(projectId),
      api.listProjectCheckpoints(projectId),
      api.listProjectEvaluations(projectId),
      api.listProjectGenerations(projectId)
    ])
      .then(([projectData, datasetData, tokenizerData, modelData, runData, checkpointData, evaluationData, generationData]) => {
        if (!active) return;
        setProject(projectData);
        setDatasets(datasetData.datasets);
        setTokenizers(tokenizerData.tokenizers);
        setModelCount(modelData.count);
        setRunCount(runData.count);
        setCompletedRunCount(runData.runs.filter((run) => run.status === "completed").length);
        setCheckpointCount(checkpointData.count);
        setCompatibleCheckpointCount(checkpointData.checkpoints.filter((checkpoint) => checkpoint.reload_status === "compatible").length);
        setEvaluationCount(evaluationData.count);
        setGenerationCount(generationData.count);
      })
      .catch((requestError) => active && setError(errorMessage(requestError)));
    return () => {
      active = false;
    };
  }, [api, projectId]);

  if (error) return <ErrorState title="Project unavailable" description={error} />;
  if (!project) return <LoadingCard title="Project" />;

  const progress = projectProgress(projectId, {
    datasets: datasets.length,
    tokenizers: tokenizers.length,
    models: modelCount,
    runs: runCount,
    completedRuns: completedRunCount,
    checkpoints: compatibleCheckpointCount,
    evaluations: evaluationCount,
    generations: generationCount
  });
  const currentStage = progress.find((stage) => stage.status !== "completed") ?? progress[progress.length - 1];

  return (
    <div className="studio-page">
      <PageHeader title={project.name} description={project.description || "ArcLM Studio project workspace."} />
      <Card>
        <CardHeader>
          <CardTitle>Recommended next step</CardTitle>
          <CardDescription>{currentStage.reason}</CardDescription>
        </CardHeader>
        <CardContent className="studio-card-actions">
          <div className="studio-progress-list" aria-label="Project workflow progress">
            {progress.map((stage) => (
              <div className="studio-progress-item" key={stage.name}>
                <strong>{stage.name}</strong>
                <Badge variant={stage.status === "completed" ? "success" : stage.status === "current" ? "warning" : "neutral"}>
                  {stage.status === "completed" ? "Ready" : stage.status === "current" ? "Next" : "Blocked"}
                </Badge>
                <span>{stage.reason}</span>
              </div>
            ))}
          </div>
          <Link className="ui-button ui-button-primary" href={currentStage.href}>{currentStage.action}</Link>
        </CardContent>
      </Card>
      <div className="studio-metrics">
        <Card><CardHeader><CardTitle>Datasets</CardTitle></CardHeader><CardContent><strong>{datasets.length}</strong></CardContent></Card>
        <Card><CardHeader><CardTitle>Tokenizers</CardTitle></CardHeader><CardContent><strong>{tokenizers.length}</strong></CardContent></Card>
        <Card><CardHeader><CardTitle>Models</CardTitle></CardHeader><CardContent><strong>{modelCount}</strong></CardContent></Card>
        <Card><CardHeader><CardTitle>Runs</CardTitle></CardHeader><CardContent><strong>{completedRunCount}/{runCount}</strong></CardContent></Card>
        <Card><CardHeader><CardTitle>Checkpoints</CardTitle></CardHeader><CardContent><strong>{compatibleCheckpointCount}/{checkpointCount}</strong></CardContent></Card>
        <Card><CardHeader><CardTitle>Evaluations</CardTitle></CardHeader><CardContent><strong>{evaluationCount}</strong></CardContent></Card>
        <Card><CardHeader><CardTitle>Generations</CardTitle></CardHeader><CardContent><strong>{generationCount}</strong></CardContent></Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Project state</CardTitle><CardDescription>Derived from real local artifacts.</CardDescription></CardHeader>
        <CardContent>
          <KeyValueList items={[
            { label: "Current stage", value: currentStage.name },
            { label: "Recommended action", value: currentStage.action },
            { label: "Completed workflow stages", value: progress.filter((stage) => stage.status === "completed").length }
          ]} />
        </CardContent>
      </Card>
      <div className="studio-actions">
        <Link className="ui-button ui-button-primary" href={`/projects/${projectId}/data`}>Open Data Studio</Link>
        <Link className="ui-button ui-button-secondary" href={`/projects/${projectId}/tokenizer`}>Open Tokenizer Lab</Link>
        <Link className="ui-button ui-button-secondary" href={`/projects/${projectId}/model`}>Open Model Builder</Link>
        <Link className="ui-button ui-button-secondary" href={`/projects/${projectId}/train`}>Open Training Studio</Link>
        <Link className="ui-button ui-button-secondary" href={`/projects/${projectId}/runs`}>View Runs</Link>
        <Link className="ui-button ui-button-secondary" href={`/projects/${projectId}/checkpoints`}>Validate checkpoints</Link>
        <Link className="ui-button ui-button-secondary" href={`/projects/${projectId}/evaluate`}>Evaluate checkpoint</Link>
        <Link className="ui-button ui-button-secondary" href={`/projects/${projectId}/generate`}>Generate text</Link>
      </div>
    </div>
  );
}

type ProjectProgressCounts = {
  datasets: number;
  tokenizers: number;
  models: number;
  runs: number;
  completedRuns: number;
  checkpoints: number;
  evaluations: number;
  generations: number;
};

type ProjectProgressStage = {
  name: string;
  status: "completed" | "current" | "blocked";
  reason: string;
  action: string;
  href: string;
};

function projectProgress(projectId: string, counts: ProjectProgressCounts): ProjectProgressStage[] {
  const definitions = [
    ["Data", counts.datasets > 0, "Add a dataset before tokenizer or model work can start.", "Open Data Studio", `/projects/${projectId}/data`],
    ["Tokenizer", counts.tokenizers > 0, "Create a tokenizer from project data.", "Open Tokenizer Lab", `/projects/${projectId}/tokenizer`],
    ["Model", counts.models > 0, "Configure a Native ArcLM model that matches the tokenizer vocabulary.", "Open Model Builder", `/projects/${projectId}/model`],
    ["Training", counts.completedRuns > 0, counts.runs > 0 ? "A training run exists but has not completed successfully." : "Start a CPU-friendly native training run.", "Open Training Studio", `/projects/${projectId}/train`],
    ["Checkpoint", counts.checkpoints > 0, "A compatible checkpoint is required for evaluation, generation and inspection.", "Validate checkpoints", `/projects/${projectId}/checkpoints`],
    ["Evaluation", counts.evaluations > 0, "Evaluate a compatible checkpoint to create metrics.", "Evaluate checkpoint", `/projects/${projectId}/evaluate`],
    ["Generation", counts.generations > 0, "Generate text from a compatible checkpoint.", "Generate text", `/projects/${projectId}/generate`],
    ["Inspection", counts.generations > 0 && counts.checkpoints > 0, "Inspect a checkpoint to see the native pipeline stages.", "Inspect checkpoint", `/projects/${projectId}/checkpoints`]
  ] as const;
  const firstMissing = definitions.findIndex((definition) => !definition[1]);
  return definitions.map(([name, complete, reason, action, href], index) => ({
    name,
    status: complete ? "completed" : index === firstMissing ? "current" : "blocked",
    reason: complete ? `${name} ready.` : reason,
    action,
    href
  }));
}
