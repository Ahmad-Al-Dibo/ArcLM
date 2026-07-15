"use client";

import { useState } from "react";
import Link from "next/link";
import { Alert, Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, EmptyState, ErrorState, PageHeader, Skeleton } from "@/components/ui";
import type { Capability, CapabilityStatus, ProjectStatusResponse } from "@/lib/api/schemas";
import { useInterfaceMode } from "@/providers/interface-mode-provider";
import { AdvancedDashboardDetails } from "./advanced-dashboard";
import { statusLabel, statusLabels } from "./dashboard-format";
import type { DashboardClient, DashboardData, DashboardStatus } from "./dashboard-types";
import { useDashboardData } from "./use-dashboard-data";

type BadgeTone = "neutral" | "info" | "success" | "warning" | "error" | "planned" | "experimental";

const trainingCommand = "arclm train --config config.yaml --data data.txt --output models/model.pth";
const evaluationCommand = "arclm eval --model models/model.pth --data test.txt";
const generationCommand = 'arclm generate --model models/model.pth --prompt "Hello"';

function statusBadge(status: CapabilityStatus | string | undefined) {
  const statusInfo = statusLabel(status);
  return <Badge variant={statusInfo.tone}>{statusInfo.label}</Badge>;
}

function formatVram(bytes: number | null | undefined) {
  if (!bytes || bytes <= 0) {
    return null;
  }
  return `${Math.round(bytes / 1024 ** 3)} GB VRAM`;
}

function connectionTitle(status: DashboardStatus) {
  if (status === "connected") {
    return "ArcLM is ready";
  }
  if (status === "loading") {
    return "Connecting to ArcLM";
  }
  if (status === "invalid") {
    return "ArcLM response needs attention";
  }
  if (status === "error") {
    return "ArcLM backend returned an error";
  }
  return "ArcLM backend is not connected";
}

function connectionVariant(status: DashboardStatus): BadgeTone {
  if (status === "connected") {
    return "success";
  }
  if (status === "loading") {
    return "info";
  }
  if (status === "disconnected") {
    return "warning";
  }
  return "error";
}

function ConnectionBanner({
  status,
  message,
  isRefreshing,
  onRefresh
}: {
  status: DashboardStatus;
  message: string | null;
  isRefreshing: boolean;
  onRefresh: () => void;
}) {
  const connected = status === "connected";
  return (
    <section className="dashboard-connection" aria-live="polite">
      <div>
        <Badge variant={connectionVariant(status)}>{connected ? "Connected" : status === "loading" ? "Loading" : "Needs action"}</Badge>
        <h2>{connectionTitle(status)}</h2>
        <p>
          {connected
            ? "The local ArcLM backend is running."
            : message ?? "Start the local backend to view environment and capability information."}
        </p>
        {!connected && status !== "loading" ? <code className="dashboard-command">python -m arclm web-api</code> : null}
      </div>
      <Button variant={connected ? "secondary" : "primary"} onClick={onRefresh} loading={isRefreshing} loadingLabel="Refreshing">
        {connected ? "Refresh" : "Retry"}
      </Button>
    </section>
  );
}

function StatusSummary({ data }: { data: DashboardData | null }) {
  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>ArcLM status</CardTitle>
          <CardDescription>Reading backend status.</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton label="Loading ArcLM status" />
        </CardContent>
      </Card>
    );
  }

  const project = data.projectStatus.data;
  return (
    <Card>
      <CardHeader>
        <CardTitle>ArcLM status</CardTitle>
        <CardDescription>Real status from the local backend.</CardDescription>
      </CardHeader>
      <CardContent className="dashboard-card-list">
        <div>
          <span>Version</span>
          <strong>ArcLM {data.health.version}</strong>
        </div>
        <div>
          <span>Backend</span>
          <strong>Local backend connected</strong>
        </div>
        <div>
          <span>Web milestone</span>
          <strong>{project?.web_milestone.name ?? "Milestone unavailable"}</strong>
        </div>
        <div>
          <span>Current feature</span>
          <strong>{project?.web_milestone.feature ?? "Feature status unavailable"}</strong>
        </div>
        {data.projectStatus.error ? <p className="ui-caption">Project status could not be read.</p> : null}
      </CardContent>
    </Card>
  );
}

function precisionText(data: DashboardData | null) {
  const training = data?.capabilities.data?.training;
  if (!training) {
    return "Precision details unavailable.";
  }
  const fp16 = statusLabels[training.fp16?.status ?? "not_verified"].label;
  const bf16 = statusLabels[training.bf16?.status ?? "not_verified"].label;
  return `FP16: ${fp16}. BF16: ${bf16}.`;
}

function DeviceSummary({ data }: { data: DashboardData | null }) {
  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Device</CardTitle>
          <CardDescription>Waiting for environment details.</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton label="Loading device" />
        </CardContent>
      </Card>
    );
  }

  const environment = data.environment.data;
  if (!environment) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Device</CardTitle>
          <CardDescription>Device details unavailable.</CardDescription>
        </CardHeader>
        <CardContent>
          <ErrorState title="Device details unavailable" description={data.environment.error ?? "The backend is connected, but environment information could not be read."} />
        </CardContent>
      </Card>
    );
  }

  const primaryGpu = environment.gpus[0];
  const vram = formatVram(primaryGpu?.vram_bytes);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Device</CardTitle>
        <CardDescription>{environment.cuda_available ? "CUDA is available in this environment." : "CUDA is not available in this environment."}</CardDescription>
      </CardHeader>
      <CardContent className="dashboard-card-list">
        <div>
          <span>Using</span>
          <strong>{environment.cuda_available ? primaryGpu?.name ?? "CUDA device" : "CPU"}</strong>
        </div>
        {vram ? (
          <div>
            <span>Memory</span>
            <strong>Approximately {vram}</strong>
          </div>
        ) : null}
        <p className="ui-section-description">{precisionText(data)}</p>
      </CardContent>
    </Card>
  );
}

function capabilityRows(data: DashboardData | null) {
  const caps = data?.capabilities.data;
  if (!caps) {
    return [];
  }
  const mixedStatus = caps.training.fp16?.status ?? caps.training.bf16?.status ?? "not_verified";
  return [
    ["Single-device training", "Train local models on one device.", caps.training.single_device],
    ["Checkpoints and resume", "Save and resume interrupted training.", caps.training.checkpoints],
    ["Basic evaluation", "Run validation loss and core metrics.", caps.evaluation.basic],
    ["Local inference", "Use local inference APIs from Python.", caps.inference.basic],
    ["Mixed precision", "Use FP16 or BF16 where hardware supports it.", { status: mixedStatus, note: precisionText(data) }],
    ["Modern Web backend", "Read local status through the Web API.", caps.web.backend]
  ] as Array<[string, string, Capability | undefined]>;
}

function CapabilitySummary({ data }: { data: DashboardData | null }) {
  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Core capabilities</CardTitle>
          <CardDescription>Loading capability status.</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton label="Loading capabilities" />
        </CardContent>
      </Card>
    );
  }
  if (!data.capabilities.data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Core capabilities</CardTitle>
          <CardDescription>Capabilities unavailable.</CardDescription>
        </CardHeader>
        <CardContent>
          <ErrorState title="Capabilities unavailable" description={data.capabilities.error ?? "The backend is connected, but capability information could not be read."} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="dashboard-wide-card">
      <CardHeader>
        <CardTitle>Core capabilities</CardTitle>
        <CardDescription>Small set of important features, based on backend status.</CardDescription>
      </CardHeader>
      <CardContent className="dashboard-capability-grid">
        {capabilityRows(data).map(([title, description, capability]) => (
          <div className="dashboard-capability" key={title}>
            <div>
              <strong>{title}</strong>
              <p>{description}</p>
            </div>
            {statusBadge(capability?.status)}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function CopyCommand({ label, command }: { label: string; command: string }) {
  const [message, setMessage] = useState<string | null>(null);

  async function copy() {
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard unavailable");
      }
      await navigator.clipboard.writeText(command);
      setMessage(`Copied ${label}.`);
    } catch {
      setMessage("Copy failed. Select and copy the command manually.");
    }
  }

  return (
    <div className="dashboard-command-row">
      <code>{command}</code>
      <Button variant="secondary" size="small" onClick={copy}>
        Copy
      </Button>
      {message ? <span role="status">{message}</span> : null}
    </div>
  );
}

function QuickActions() {
  const links = [
    ["Data Pipeline", "/data"],
    ["Training", "/training"],
    ["Evaluation", "/evaluation"],
    ["Models", "/models"],
    ["Inference", "/inference"],
    ["Settings", "/settings"]
  ];
  return (
    <Card className="dashboard-wide-card">
      <CardHeader>
        <CardTitle>Quick actions</CardTitle>
        <CardDescription>Open existing routes or copy current CLI commands. Browser execution is not available.</CardDescription>
      </CardHeader>
      <CardContent className="ui-stack">
        <div className="dashboard-link-grid">
          {links.map(([label, href]) => (
            <Link className="dashboard-link-card" href={href} key={href}>
              {label}
            </Link>
          ))}
        </div>
        <div className="dashboard-command-list">
          <CopyCommand label="training command" command={trainingCommand} />
          <CopyCommand label="evaluation command" command={evaluationCommand} />
          <CopyCommand label="generation command" command={generationCommand} />
        </div>
        <div className="dashboard-planned-actions">
          {[
            "Upload dataset: planned for Data Pipeline Studio",
            "Start training from browser: browser controls are not available yet",
            "Resume training from browser: planned for a later dashboard",
            "Create model: planned for Model Registry",
            "Install plugin: planned after plugin permissions",
            "Open marketplace: not available in this build"
          ].map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ProductProgress({ projectStatus }: { projectStatus: ProjectStatusResponse | null }) {
  if (!projectStatus) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Web progress</CardTitle>
          <CardDescription>Project status unavailable.</CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState title="Progress unavailable" description="The backend is connected, but project progress could not be read." />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Web progress</CardTitle>
        <CardDescription>Small view of the current Web Experience milestone.</CardDescription>
      </CardHeader>
      <CardContent className="dashboard-progress">
        <div>
          <strong>Completed</strong>
          {projectStatus.completed.map((item) => (
            <span key={item.name}>Done: {item.name}</span>
          ))}
        </div>
        <div>
          <strong>Current</strong>
          <span>{projectStatus.current?.name ?? "Current feature unavailable"}</span>
        </div>
        <div>
          <strong>Next</strong>
          {projectStatus.next.map((item) => (
            <span key={item.name}>{item.name}</span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function PlannedFeatures({ projectStatus }: { projectStatus: ProjectStatusResponse | null }) {
  const features = projectStatus?.planned_features ?? [];
  return (
    <Card>
      <CardHeader>
        <CardTitle>Planned features</CardTitle>
        <CardDescription>Important future areas. These are not active controls.</CardDescription>
      </CardHeader>
      <CardContent className="dashboard-planned-grid">
        {features.length > 0 ? (
          features.map((feature) => (
            <div className="dashboard-planned-card" key={feature.name}>
              <div>
                <strong>{feature.name}</strong>
                <p>{feature.description}</p>
              </div>
              <Badge variant="planned">{feature.milestone}</Badge>
            </div>
          ))
        ) : (
          <EmptyState title="Planned features unavailable" description="Project status could not be read." />
        )}
      </CardContent>
    </Card>
  );
}

export function SimpleDashboard({ client }: { client?: DashboardClient }) {
  const { mode } = useInterfaceMode();
  const dashboard = useDashboardData(client);
  const data = dashboard.data;
  const projectStatus = data?.projectStatus.data ?? null;

  return (
    <div className="dashboard-page">
      <PageHeader
        title="Overview"
        description="Simple dashboard for the local ArcLM development environment."
        actions={
          <Button variant="secondary" onClick={dashboard.refresh} loading={dashboard.isRefreshing} loadingLabel="Refreshing">
            Refresh
          </Button>
        }
      />
      {mode === "advanced" ? (
        <Alert variant="info" title="Advanced dashboard">
          Advanced dashboard details are visible below. The view is read-only and uses the same loaded backend data.
        </Alert>
      ) : null}
      <ConnectionBanner
        status={dashboard.status}
        message={dashboard.message}
        isRefreshing={dashboard.isRefreshing}
        onRefresh={dashboard.refresh}
      />
      <div className="dashboard-summary-grid">
        <StatusSummary data={data} />
        <DeviceSummary data={data} />
        <CapabilitySummary data={data} />
      </div>
      <QuickActions />
      <div className="dashboard-lower-grid">
        <ProductProgress projectStatus={projectStatus} />
        <PlannedFeatures projectStatus={projectStatus} />
      </div>
      {mode === "advanced" ? <AdvancedDashboardDetails dashboard={dashboard} /> : null}
    </div>
  );
}
