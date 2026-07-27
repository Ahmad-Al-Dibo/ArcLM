"use client";

import { useEffect, useState } from "react";
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ErrorState,
  KeyValueList,
  PageHeader
} from "@/components/ui";
import type { SystemStatusResponse } from "@/lib/api/schemas";
import { errorMessage, LoadingCard, type StudioClient, useStudioClient } from "./shared";

export function SystemPage({ client }: { client?: StudioClient }) {
  const api = useStudioClient(client);
  const [system, setSystem] = useState<SystemStatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    api.getSystemStatus()
      .then((response) => {
        if (!active) return;
        setSystem(response);
        setError(null);
      })
      .catch((requestError) => {
        if (active) setError(errorMessage(requestError));
      });
    return () => {
      active = false;
    };
  }, [api]);

  return (
    <div className="studio-page">
      <PageHeader title="Environment" description="Safe local runtime, dependency, and workspace status." />
      {error ? <ErrorState title="System status unavailable" description={error} /> : null}
      {!system ? <LoadingCard title="System status" /> : (
        <>
          <Card>
            <CardHeader><CardTitle>Runtime</CardTitle><CardDescription>No secrets, paths, or environment values are exposed.</CardDescription></CardHeader>
            <CardContent>
              <KeyValueList items={[
                { label: "ArcLM", value: system.arclm_version },
                { label: "Python", value: system.python_version },
                { label: "PyTorch", value: system.pytorch_version ?? "Not available" },
                { label: "Operating system", value: system.operating_system },
                { label: "Current device", value: system.current_device },
                { label: "CUDA", value: system.cuda_available ? `Available (${system.cuda_version ?? "unknown"})` : "Not available" },
                { label: "GPU", value: system.gpu_name ?? "None" },
                { label: "Projects", value: system.workspace.project_count },
                { label: "Active compute", value: system.active_compute_operation },
                { label: "Workspace available", value: system.workspace.available ? "Yes" : "No" },
                { label: "Datasets", value: system.workspace.active_dataset_count },
                { label: "Tokenizers", value: system.workspace.active_tokenizer_count }
              ]} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Diagnostics</CardTitle><CardDescription>Safe summary without user paths or environment values.</CardDescription></CardHeader>
            <CardContent>
              <KeyValueList items={[
                { label: "Backend", value: `${system.backend_health.service} ${system.backend_health.status}` },
                { label: "Path details exposed", value: system.diagnostics.path_details_exposed ? "Yes" : "No" },
                { label: "Warnings", value: system.warnings.length ? system.warnings.join("; ") : "None" }
              ]} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Optional integrations</CardTitle><CardDescription>Detected with importlib metadata checks, not heavy imports.</CardDescription></CardHeader>
            <CardContent className="studio-token-row">
              {Object.values(system.optional_dependencies).map((dep) => (
                <span key={dep.package}>{dep.package}<Badge variant={dep.available ? "success" : "neutral"}>{dep.available ? "Available" : "Missing"}</Badge></span>
              ))}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
