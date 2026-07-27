"use client";

import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  EmptyState,
  ErrorState,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow
} from "@/components/ui";
import type { CapabilitiesResponse, Capability, ProjectStatusResponse } from "@/lib/api/schemas";
import type { DashboardData, DashboardState } from "./dashboard-types";
import { formatBytes, formatComputeCapability, formatMissing, formatRefreshTime, statusLabel } from "./dashboard-format";

function StatusBadge({ status }: { status: string | null | undefined }) {
  const info = statusLabel(status);
  return <Badge variant={info.tone}>{info.label}</Badge>;
}

function KeyValueList({ items }: { items: Array<[string, string | number | boolean | null | undefined]> }) {
  return (
    <dl className="dashboard-kv-list">
      {items.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{formatMissing(value)}</dd>
        </div>
      ))}
    </dl>
  );
}

function RuntimeDetails({ data }: { data: DashboardData | null }) {
  const environment = data?.environment.data;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Runtime details</CardTitle>
        <CardDescription>Safe runtime versions and device selection.</CardDescription>
      </CardHeader>
      <CardContent>
        {environment ? (
          <KeyValueList
            items={[
              ["ArcLM", environment.arclm_version],
              ["Backend service", data?.health.version],
              ["Python", environment.python_version],
              ["PyTorch", environment.pytorch_version],
              ["Platform", environment.platform],
              ["CUDA", environment.cuda_available ? "Available" : "Unavailable"],
              ["CUDA runtime", environment.cuda_runtime],
              ["Available devices", environment.device_count],
              ["Preferred device", environment.preferred_device]
            ]}
          />
        ) : (
          <ErrorState title="Runtime details unavailable" description={data?.environment.error ?? "Environment details could not be read."} />
        )}
      </CardContent>
    </Card>
  );
}

function HardwareDetails({ data }: { data: DashboardData | null }) {
  const environment = data?.environment.data;
  const training = data?.capabilities.data?.training;
  const gpu = environment?.gpus[0];
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hardware details</CardTitle>
        <CardDescription>Detected hardware and precision status from safe backend data.</CardDescription>
      </CardHeader>
      <CardContent className="ui-stack">
        {environment ? (
          <>
            <KeyValueList
              items={[
                ["Device name", gpu?.name ?? (environment.cuda_available ? "CUDA device" : "CPU")],
                ["VRAM", formatBytes(gpu?.vram_bytes)],
                ["Compute capability", formatComputeCapability(gpu?.compute_capability)],
                ["CUDA devices", environment.device_count],
                ["BF16 signal", environment.bf16_supported],
                ["FP32", training?.single_device?.status ?? "not_verified"],
                ["FP16", training?.fp16?.status ?? "not_verified"],
                ["BF16", training?.bf16?.status ?? "not_verified"],
                ["Multi-GPU", training?.multi_gpu?.status ?? "not_verified"]
              ]}
            />
            <p className="ui-section-description">
              Correctness verification does not prove hardware acceleration or representative performance.
            </p>
          </>
        ) : (
          <ErrorState title="Hardware details unavailable" description={data?.environment.error ?? "Environment details could not be read."} />
        )}
      </CardContent>
    </Card>
  );
}

function capabilityEntries(capabilities: CapabilitiesResponse | null) {
  if (!capabilities) {
    return [];
  }
  return [
    ["Training", capabilities.training],
    ["Evaluation", capabilities.evaluation],
    ["Inference", capabilities.inference],
    ["Web Experience", capabilities.web]
  ] as Array<[string, Record<string, Capability>]>;
}

function labelFromKey(key: string) {
  return key
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function CapabilityMatrix({ data }: { data: DashboardData | null }) {
  const capabilities = data?.capabilities.data ?? null;
  return (
    <Card className="dashboard-wide-card">
      <CardHeader>
        <CardTitle>Capability matrix</CardTitle>
        <CardDescription>Evidence-based feature status grouped by domain.</CardDescription>
      </CardHeader>
      <CardContent>
        {capabilities ? (
          <Table>
            <caption>Advanced capability matrix</caption>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Domain</TableHeaderCell>
                <TableHeaderCell>Capability</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Evidence</TableHeaderCell>
                <TableHeaderCell>Requirement</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {capabilityEntries(capabilities).flatMap(([domain, group]) =>
                Object.entries(group).map(([key, capability]) => (
                  <TableRow key={`${domain}-${key}`}>
                    <TableCell>{domain}</TableCell>
                    <TableCell>{labelFromKey(key)}</TableCell>
                    <TableCell>
                      <StatusBadge status={capability.status} />
                    </TableCell>
                    <TableCell>{capability.evidence ?? capability.note}</TableCell>
                    <TableCell>{capability.hardware_requirement ?? capability.optional_dependency ?? capability.product_state ?? "None"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        ) : (
          <ErrorState title="Capability matrix unavailable" description={data?.capabilities.error ?? "Capability information could not be read."} />
        )}
      </CardContent>
    </Card>
  );
}

function ValidationStatus({ projectStatus }: { projectStatus: ProjectStatusResponse | null }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Validation status</CardTitle>
        <CardDescription>Safe summary of repository and hardware validation.</CardDescription>
      </CardHeader>
      <CardContent className="dashboard-advanced-list">
        {projectStatus?.validation.length ? (
          projectStatus.validation.map((item) => (
            <div key={item.name}>
              <div>
                <strong>{item.name}</strong>
                <p>{item.note}</p>
              </div>
              <StatusBadge status={item.status} />
            </div>
          ))
        ) : (
          <EmptyState title="Validation status unavailable" description="Project validation metadata could not be read." />
        )}
      </CardContent>
    </Card>
  );
}

function OptionalIntegrations({ projectStatus }: { projectStatus: ProjectStatusResponse | null }) {
  return (
    <Card className="dashboard-wide-card">
      <CardHeader>
        <CardTitle>Optional integrations</CardTitle>
        <CardDescription>Package metadata status does not mean full ArcLM workflow support.</CardDescription>
      </CardHeader>
      <CardContent>
        {projectStatus?.integrations.length ? (
          <Table>
            <caption>Optional integration status</caption>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Integration</TableHeaderCell>
                <TableHeaderCell>Package</TableHeaderCell>
                <TableHeaderCell>Package status</TableHeaderCell>
                <TableHeaderCell>ArcLM status</TableHeaderCell>
                <TableHeaderCell>Note</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projectStatus.integrations.map((item) => (
                <TableRow key={item.name}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.package}</TableCell>
                  <TableCell>{labelFromKey(item.package_status)}</TableCell>
                  <TableCell>
                    <StatusBadge status={item.arclm_status} />
                  </TableCell>
                  <TableCell>{item.note}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <EmptyState title="Integration status unavailable" description="Optional integration metadata could not be read." />
        )}
      </CardContent>
    </Card>
  );
}

function Limitations({ projectStatus }: { projectStatus: ProjectStatusResponse | null }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Known limitations</CardTitle>
        <CardDescription>Current limits, future work, and validation gaps.</CardDescription>
      </CardHeader>
      <CardContent className="dashboard-advanced-list">
        {projectStatus?.limitations.length ? (
          projectStatus.limitations.map((item) => (
            <div key={item.title}>
              <div>
                <strong>{item.title}</strong>
                <p>{item.category}: {item.description}</p>
              </div>
              <StatusBadge status={item.status} />
            </div>
          ))
        ) : (
          <EmptyState title="Limitations unavailable" description="Project limitations could not be read." />
        )}
      </CardContent>
    </Card>
  );
}

function WebProgressAdvanced({ projectStatus }: { projectStatus: ProjectStatusResponse | null }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Web Experience progress</CardTitle>
        <CardDescription>Compact status for the current Web milestone.</CardDescription>
      </CardHeader>
      <CardContent className="dashboard-progress">
        {projectStatus ? (
          <>
            <div>
              <strong>Completed</strong>
              {projectStatus.completed.map((item) => (
                <span key={item.name}>{item.name}: {labelFromKey(item.status)}</span>
              ))}
            </div>
            <div>
              <strong>Current</strong>
              <span>{projectStatus.current?.name ?? "Not reported"}</span>
            </div>
            <div>
              <strong>Next</strong>
              {projectStatus.next.map((item) => (
                <span key={item.name}>{item.name}: {labelFromKey(item.status)}</span>
              ))}
            </div>
          </>
        ) : (
          <EmptyState title="Web progress unavailable" description="Project status could not be read." />
        )}
      </CardContent>
    </Card>
  );
}

function ApiInspector({ data }: { data: DashboardData | null }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const json = useMemo(() => {
    if (!data) {
      return "{}";
    }
    return JSON.stringify(
      {
        health: data.health,
        environment: data.environment.data,
        capabilities: data.capabilities.data,
        project_status: data.projectStatus.data
      },
      null,
      2
    );
  }, [data]);

  async function copy() {
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard unavailable");
      }
      await navigator.clipboard.writeText(json);
      setMessage("Copied API response.");
    } catch {
      setMessage("Copy failed. Select and copy the JSON manually.");
    }
  }

  return (
    <Card className="dashboard-wide-card">
      <CardHeader>
        <CardTitle>Safe API response inspector</CardTitle>
        <CardDescription>Shows only approved dashboard responses already loaded by this page.</CardDescription>
      </CardHeader>
      <CardContent className="ui-stack">
        <Button variant="secondary" onClick={() => setOpen((current) => !current)}>
          {open ? "Hide API response" : "View API response"}
        </Button>
        {open ? (
          <>
            <div className="dashboard-json-actions">
              <Button variant="secondary" size="small" onClick={copy}>Copy JSON</Button>
              {message ? <span role="status">{message}</span> : null}
            </div>
            <pre className="dashboard-json" aria-label="Approved dashboard API response JSON">
              <code>{json}</code>
            </pre>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}

function BackendDiagnostics({ dashboard }: { dashboard: DashboardState & { refresh: () => void } }) {
  const data = dashboard.data;
  const rows: Array<[string, string | number | boolean | null | undefined]> = [
    ["Backend base URL", "http://127.0.0.1:8765"],
    ["Health endpoint", dashboard.status === "connected" ? "reachable" : dashboard.status],
    ["Environment endpoint", data?.environment.error ? "failed" : data?.environment.data ? "reachable" : "not_reported"],
    ["Capabilities endpoint", data?.capabilities.error ? "failed" : data?.capabilities.data ? "reachable" : "not_reported"],
    ["Project-status endpoint", data?.projectStatus.error ? "failed" : data?.projectStatus.data ? "reachable" : "not_reported"],
    ["Last successful refresh", formatRefreshTime(dashboard.lastSuccessAt)],
    ["Last failed refresh", formatRefreshTime(dashboard.lastFailureAt)],
    ["Displayed data may be stale", dashboard.lastFailureAt && dashboard.data ? "Yes" : "No"]
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Backend diagnostics</CardTitle>
        <CardDescription>Safe client-side endpoint status for this dashboard.</CardDescription>
      </CardHeader>
      <CardContent>
        <KeyValueList items={rows} />
      </CardContent>
    </Card>
  );
}

export function AdvancedDashboardDetails({ dashboard }: { dashboard: DashboardState & { refresh: () => void } }) {
  const data = dashboard.data;
  const projectStatus = data?.projectStatus.data ?? null;

  return (
    <section className="dashboard-advanced" aria-labelledby="advanced-dashboard-heading">
      <div>
        <h2 id="advanced-dashboard-heading">Advanced dashboard</h2>
        <p className="ui-section-description">
          Technical read-only details from the same backend responses used by the Simple Dashboard.
        </p>
      </div>
      <div className="dashboard-advanced-grid">
        <RuntimeDetails data={data} />
        <HardwareDetails data={data} />
        <CapabilityMatrix data={data} />
        <ValidationStatus projectStatus={projectStatus} />
        <Limitations projectStatus={projectStatus} />
        <OptionalIntegrations projectStatus={projectStatus} />
        <WebProgressAdvanced projectStatus={projectStatus} />
        <BackendDiagnostics dashboard={dashboard} />
        <ApiInspector data={data} />
      </div>
    </section>
  );
}
