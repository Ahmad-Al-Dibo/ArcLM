"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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
  PageHeader
} from "@/components/ui";
import type { ProjectListResponse, SystemStatusResponse } from "@/lib/api/schemas";
import { readStorage, writeStorage } from "@/lib/storage";
import { errorMessage, LoadingCard, ProjectCard, type StudioClient, useStudioClient } from "./shared";

const onboardingStorageKey = "arclm-studio-onboarding-dismissed";

export function StudioOverviewPage({ client }: { client?: StudioClient }) {
  const api = useStudioClient(client);
  const [system, setSystem] = useState<SystemStatusResponse | null>(null);
  const [projects, setProjects] = useState<ProjectListResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [onboardingDismissed, setOnboardingDismissed] = useState(false);

  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(() => {
      if (active) setOnboardingDismissed(readStorage(onboardingStorageKey) === "true");
    }, 0);
    Promise.all([api.getSystemStatus(), api.listProjects()])
      .then(([systemData, projectData]) => {
        if (!active) return;
        setSystem(systemData);
        setProjects(projectData);
      })
      .catch((requestError) => {
        if (active) setError(errorMessage(requestError));
      });
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [api]);

  const recent = projects?.projects.slice(0, 3) ?? [];

  function dismissOnboarding() {
    setOnboardingDismissed(true);
    writeStorage(onboardingStorageKey, "true");
  }

  return (
    <div className="studio-page">
      <PageHeader
        title="ArcLM Studio"
        description="A local visual workspace for preparing data, building and understanding language-model workflows with ArcLM."
        actions={<Link className="ui-button ui-button-primary" href="/projects/new">Create project</Link>}
      />
      {error ? <ErrorState title="Backend unavailable" description={error} details="python -m arclm web-api" /> : null}
      {!system || !projects ? (
        <LoadingCard title="Studio overview" />
      ) : (
        <>
          {!onboardingDismissed ? (
            <Alert variant="info" title="First run guide">
              ArcLM Studio is a local learning workspace. Your datasets, native model configs, runs,
              checkpoints, evaluations, generations, and pipeline traces stay on this machine. Start
              with a tiny project, explore tokenization, or inspect the native pipeline.
              <div className="studio-actions">
                <Link className="ui-button ui-button-primary" href="/projects/new">Create a tiny model</Link>
                <Link className="ui-button ui-button-secondary" href="/projects">Open existing project</Link>
                <Link className="ui-button ui-button-secondary" href="/learn/pipeline">Inspect the pipeline</Link>
                <Button variant="ghost" onClick={dismissOnboarding}>Dismiss guide</Button>
              </div>
            </Alert>
          ) : null}
          <div className="studio-metrics">
            <Card>
              <CardHeader>
                <CardTitle>Backend</CardTitle>
                <CardDescription>Local FastAPI connection.</CardDescription>
              </CardHeader>
              <CardContent><strong>ArcLM {system.arclm_version}</strong></CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Workspace</CardTitle>
                <CardDescription>Configured local workspace.</CardDescription>
              </CardHeader>
              <CardContent><strong>{system.workspace.project_count} projects</strong></CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Device</CardTitle>
                <CardDescription>Safe runtime status.</CardDescription>
              </CardHeader>
              <CardContent><strong>{system.cuda_available ? system.gpu_name ?? "CUDA" : "CPU"}</strong></CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Recent projects</CardTitle>
              <CardDescription>Open a project to work with data and tokenizers.</CardDescription>
            </CardHeader>
            <CardContent className="studio-grid">
              {recent.length ? recent.map((project) => <ProjectCard key={project.id} project={project} />) : (
                <EmptyState title="No projects yet" description="Create a project to begin uploading data and creating tokenizers." />
              )}
            </CardContent>
          </Card>
          <div className="studio-actions">
            <Link className="ui-button ui-button-secondary" href="/system">View environment</Link>
            <Link className="ui-button ui-button-secondary" href="/learn/pipeline">Inspect pipeline</Link>
          </div>
        </>
      )}
    </div>
  );
}
