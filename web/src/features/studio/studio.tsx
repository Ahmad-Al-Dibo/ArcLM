"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
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
  Select,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeaderCell,
  TableRow,
  TextInput,
  Textarea
} from "@/components/ui";
import { ApiClientError, createApiClient } from "@/lib/api/client";
import type {
  DatasetFormat,
  DatasetManifestReportResponse,
  DatasetValidationResponse,
  ProjectDatasetPreviewResponse,
  ProjectListResponse,
  StudioDatasetMetadata,
  StudioProject,
  StudioTokenizerMetadata,
  SystemStatusResponse,
  TokenizerInspectionResponse
} from "@/lib/api/schemas";

type StudioClient = ReturnType<typeof createApiClient>;

const formatChoices = [
  { id: "plain_text", label: "Plain text", fields: "text" },
  { id: "prompt_completion", label: "Prompt + Completion", fields: "prompt,completion" },
  { id: "instruction_response", label: "Instruction + Response", fields: "instruction,response" },
  { id: "chat_messages", label: "Chat Messages", fields: "messages" },
  { id: "custom_fields", label: "Custom fields", fields: "text" }
];

function formatTime(value: number) {
  return new Date(value * 1000).toLocaleString();
}

function errorMessage(error: unknown) {
  if (error instanceof ApiClientError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "The request failed.";
}

function useStudioClient(client?: StudioClient) {
  return useMemo(() => client ?? createApiClient(), [client]);
}

function LoadingCard({ title }: { title: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Loading ArcLM Studio data.</CardDescription>
      </CardHeader>
      <CardContent>
        <Skeleton label={`Loading ${title}`} />
      </CardContent>
    </Card>
  );
}

function ProjectCard({ project, onDelete }: { project: StudioProject; onDelete?: (project: StudioProject) => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{project.name}</CardTitle>
        <CardDescription>{project.description || "No description yet."}</CardDescription>
      </CardHeader>
      <CardContent className="studio-card-actions">
        <KeyValueList
          items={[
            { label: "Status", value: project.status },
            { label: "Updated", value: formatTime(project.updated_at) },
            { label: "Active dataset", value: project.active_dataset_id ?? "None" },
            { label: "Active tokenizer", value: project.active_tokenizer_id ?? "None" }
          ]}
        />
        <div className="studio-actions">
          <Link className="ui-button ui-button-primary" href={`/projects/${project.id}`}>
            Open project
          </Link>
          <Link className="ui-button ui-button-secondary" href={`/projects/${project.id}/data`}>
            Data
          </Link>
          <Link className="ui-button ui-button-secondary" href={`/projects/${project.id}/tokenizer`}>
            Tokenizer
          </Link>
          {onDelete ? (
            <Button variant="destructive" onClick={() => onDelete(project)}>
              Delete
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

export function StudioOverviewPage({ client }: { client?: StudioClient }) {
  const api = useStudioClient(client);
  const [system, setSystem] = useState<SystemStatusResponse | null>(null);
  const [projects, setProjects] = useState<ProjectListResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
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
    };
  }, [api]);

  const recent = projects?.projects.slice(0, 3) ?? [];

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([api.getProject(projectId), api.listProjectDatasets(projectId), api.listProjectTokenizers(projectId)])
      .then(([projectData, datasetData, tokenizerData]) => {
        if (!active) return;
        setProject(projectData);
        setDatasets(datasetData.datasets);
        setTokenizers(tokenizerData.tokenizers);
      })
      .catch((requestError) => active && setError(errorMessage(requestError)));
    return () => {
      active = false;
    };
  }, [api, projectId]);

  if (error) return <ErrorState title="Project unavailable" description={error} />;
  if (!project) return <LoadingCard title="Project" />;

  const nextAction = !datasets.length ? "Upload a dataset" : !tokenizers.length ? "Create a tokenizer" : "Inspect text";

  return (
    <div className="studio-page">
      <PageHeader title={project.name} description={project.description || "ArcLM Studio project workspace."} />
      <div className="studio-metrics">
        <Card><CardHeader><CardTitle>Datasets</CardTitle></CardHeader><CardContent><strong>{datasets.length}</strong></CardContent></Card>
        <Card><CardHeader><CardTitle>Tokenizers</CardTitle></CardHeader><CardContent><strong>{tokenizers.length}</strong></CardContent></Card>
        <Card><CardHeader><CardTitle>Next action</CardTitle></CardHeader><CardContent><strong>{nextAction}</strong></CardContent></Card>
      </div>
      <div className="studio-actions">
        <Link className="ui-button ui-button-primary" href={`/projects/${projectId}/data`}>Open Data Studio</Link>
        <Link className="ui-button ui-button-secondary" href={`/projects/${projectId}/tokenizer`}>Open Tokenizer Lab</Link>
      </div>
    </div>
  );
}

function fieldsFromString(value: string) {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

export function DataStudioPage({ projectId, client }: { projectId: string; client?: StudioClient }) {
  const api = useStudioClient(client);
  const [datasets, setDatasets] = useState<StudioDatasetMetadata[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [preview, setPreview] = useState<ProjectDatasetPreviewResponse | null>(null);
  const [validation, setValidation] = useState<DatasetValidationResponse | null>(null);
  const [report, setReport] = useState<DatasetManifestReportResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("training-data");
  const [storedFormat, setStoredFormat] = useState<DatasetFormat>("jsonl");
  const [selectedFormat, setSelectedFormat] = useState("instruction_response");
  const [fields, setFields] = useState("instruction,response");
  const [paste, setPaste] = useState('{"instruction":"Explain tokenization.","response":"Tokenization creates token IDs."}');

  async function refresh(selectId?: string) {
    const response = await api.listProjectDatasets(projectId);
    setDatasets(response.datasets);
    const nextId = selectId ?? selectedId ?? response.datasets[0]?.id ?? "";
    setSelectedId(nextId);
  }

  useEffect(() => {
    let active = true;
    api.listProjectDatasets(projectId)
      .then((response) => {
        if (!active) return;
        setDatasets(response.datasets);
        setSelectedId(response.datasets[0]?.id ?? "");
      })
      .catch((requestError) => {
        if (active) setError(errorMessage(requestError));
      });
    return () => {
      active = false;
    };
  }, [api, projectId]);

  async function addPaste(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const dataset = await api.pasteProjectDataset(projectId, {
        name,
        content: storedFormat === "jsonl" && !paste.includes("\n") ? `${paste}\n` : paste,
        stored_format: storedFormat,
        selected_format: selectedFormat,
        text_fields: fieldsFromString(fields)
      });
      await refresh(dataset.id);
      setError(null);
    } catch (requestError) {
      setError(errorMessage(requestError));
    }
  }

  async function addUpload(file: File | null) {
    if (!file) return;
    try {
      const content = await file.text();
      const dataset = await api.uploadProjectDataset(projectId, {
        name: file.name.replace(/\.[^.]+$/, ""),
        original_filename: file.name,
        content,
        selected_format: selectedFormat,
        text_fields: fieldsFromString(fields)
      });
      await refresh(dataset.id);
      setError(null);
    } catch (requestError) {
      setError(errorMessage(requestError));
    }
  }

  async function loadPreview() {
    if (!selectedId) return;
    setPreview(await api.getProjectDatasetPreview(projectId, selectedId));
  }

  async function validateSelected() {
    if (!selectedId) return;
    setValidation(await api.validateProjectDataset(projectId, selectedId, {
      selected_format: selectedFormat,
      text_fields: fieldsFromString(fields),
      strict: false
    }));
  }

  async function reportSelected() {
    if (!selectedId) return;
    setReport(await api.createProjectDatasetReport(projectId, selectedId));
  }

  async function deleteSelectedDataset() {
    if (!selectedId || !window.confirm("Delete the selected dataset from this project?")) {
      return;
    }
    try {
      await api.deleteProjectDataset(projectId, selectedId);
      setPreview(null);
      setValidation(null);
      setReport(null);
      await refresh("");
      setError(null);
    } catch (requestError) {
      setError(errorMessage(requestError));
    }
  }

  return (
    <div className="studio-page">
      <PageHeader title="Data Studio" description="Upload, paste, preview, validate, and report project datasets." />
      {error ? <ErrorState title="Data request failed" description={error} /> : null}
      <div className="studio-two-column">
        <Card>
          <CardHeader><CardTitle>Add dataset</CardTitle><CardDescription>Supported formats: JSON, JSONL, CSV, TXT.</CardDescription></CardHeader>
          <CardContent>
            <form className="studio-form" onSubmit={addPaste}>
              <TextInput label="Dataset name" value={name} onChange={(event) => setName(event.target.value)} />
              <Select label="Stored format" value={storedFormat} onChange={(event) => setStoredFormat(event.target.value as DatasetFormat)}>
                <option value="jsonl">JSONL</option><option value="json">JSON</option><option value="csv">CSV</option><option value="txt">TXT</option>
              </Select>
              <Select label="Data contract" value={selectedFormat} onChange={(event) => {
                const choice = formatChoices.find((item) => item.id === event.target.value);
                setSelectedFormat(event.target.value);
                if (choice) setFields(choice.fields);
              }}>
                {formatChoices.map((choice) => <option key={choice.id} value={choice.id}>{choice.label}</option>)}
              </Select>
              <TextInput label="Text fields" value={fields} onChange={(event) => setFields(event.target.value)} description="Comma-separated field names validated by the backend." />
              <Textarea label="Paste data" value={paste} onChange={(event) => setPaste(event.target.value)} rows={7} />
              <Button type="submit">Add pasted data</Button>
              <label className="ui-field">
                <span className="ui-label">Upload file</span>
                <input aria-label="Upload dataset file" type="file" accept=".json,.jsonl,.csv,.txt" onChange={(event) => void addUpload(event.target.files?.[0] ?? null)} />
                <span className="ui-description">The browser reads the file as text; the backend stores it inside the controlled workspace.</span>
              </label>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Datasets</CardTitle><CardDescription>Select a dataset to preview, validate, or report.</CardDescription></CardHeader>
          <CardContent className="studio-list">
            {datasets.length ? datasets.map((dataset) => (
              <button key={dataset.id} type="button" className="studio-list-item" aria-pressed={selectedId === dataset.id} onClick={() => setSelectedId(dataset.id)}>
                <strong>{dataset.name}</strong>
                <span>{dataset.record_count} records - {dataset.stored_format.toUpperCase()}</span>
                <Badge variant={dataset.validation_status === "valid" ? "success" : dataset.validation_status === "invalid" ? "error" : "neutral"}>{dataset.validation_status}</Badge>
              </button>
            )) : <EmptyState title="No datasets" description="Upload or paste data to begin." />}
          </CardContent>
        </Card>
      </div>
      <div className="studio-actions">
        <Button onClick={() => void loadPreview()} disabled={!selectedId}>Preview</Button>
        <Button variant="secondary" onClick={() => void validateSelected()} disabled={!selectedId}>Validate</Button>
        <Button variant="secondary" onClick={() => void reportSelected()} disabled={!selectedId}>Generate report</Button>
        <Button variant="destructive" onClick={() => void deleteSelectedDataset()} disabled={!selectedId}>Delete dataset</Button>
      </div>
      {preview ? <DatasetPreviewTable preview={preview} /> : null}
      {validation ? <ValidationView validation={validation} /> : null}
      {report ? <ReportView report={report} /> : null}
    </div>
  );
}

function DatasetPreviewTable({ preview }: { preview: ProjectDatasetPreviewResponse }) {
  return (
    <Card>
      <CardHeader><CardTitle>Preview</CardTitle><CardDescription>Showing {preview.records.length} of {preview.total_records} records.</CardDescription></CardHeader>
      <CardContent>
        <Table>
          <TableHead><TableRow><TableHeaderCell>Index</TableHeaderCell>{preview.fields.map((field) => <TableHeaderCell key={field}>{field}</TableHeaderCell>)}</TableRow></TableHead>
          {preview.records.length ? (
            <TableBody>
              {preview.records.map((row) => (
                <TableRow key={row.index}><TableCell>{row.index}</TableCell>{preview.fields.map((field) => <TableCell key={field}>{String(row.values[field] ?? "")}</TableCell>)}</TableRow>
              ))}
            </TableBody>
          ) : <TableEmpty columns={preview.fields.length + 1} title="No preview rows" description="This dataset did not produce previewable records." />}
        </Table>
      </CardContent>
    </Card>
  );
}

function ValidationView({ validation }: { validation: DatasetValidationResponse }) {
  const result = validation.validation as { total_records?: number; valid_count?: number; invalid_count?: number; issues?: Array<Record<string, unknown>> };
  return (
    <Card>
      <CardHeader><CardTitle>Validation result</CardTitle><CardDescription>Authoritative backend validation through ArcLM APIs.</CardDescription></CardHeader>
      <CardContent>
        <KeyValueList items={[
          { label: "Total records", value: result.total_records ?? 0 },
          { label: "Valid records", value: result.valid_count ?? 0 },
          { label: "Invalid records", value: result.invalid_count ?? 0 }
        ]} />
        {(result.issues ?? []).length ? <ul>{(result.issues ?? []).map((issue, index) => <li key={index}>Record {String(issue.index)} - {String(issue.field ?? "record")}: {String(issue.message)}</li>)}</ul> : <Alert variant="success" title="Validation passed">No validation issues were returned.</Alert>}
      </CardContent>
    </Card>
  );
}

function ReportView({ report }: { report: DatasetManifestReportResponse }) {
  const metrics = report.report as Record<string, unknown>;
  return (
    <Card>
      <CardHeader><CardTitle>Manifest and token report</CardTitle><CardDescription>Generated by ArcLM dataset manifest and report APIs.</CardDescription></CardHeader>
      <CardContent>
        <KeyValueList items={[
          { label: "Records", value: String(metrics.record_count ?? 0) },
          { label: "Valid records", value: String(metrics.valid_records ?? 0) },
          { label: "Invalid records", value: String(metrics.invalid_records ?? 0) },
          { label: "Total tokens", value: String(metrics.token_count ?? 0) },
          { label: "Unknown-token rate", value: String(metrics.unknown_token_rate ?? "n/a") },
          { label: "Truncated records", value: String(metrics.truncated_record_count ?? 0) }
        ]} />
        <details><summary>Manifest JSON</summary><pre className="studio-json">{JSON.stringify(report.manifest, null, 2)}</pre></details>
      </CardContent>
    </Card>
  );
}

export function TokenizerLabPage({ projectId, client }: { projectId: string; client?: StudioClient }) {
  const api = useStudioClient(client);
  const [datasets, setDatasets] = useState<StudioDatasetMetadata[]>([]);
  const [tokenizers, setTokenizers] = useState<StudioTokenizerMetadata[]>([]);
  const [datasetId, setDatasetId] = useState("");
  const [tokenizerId, setTokenizerId] = useState("");
  const [text, setText] = useState("ArcLM makes language models understandable.");
  const [inspection, setInspection] = useState<TokenizerInspectionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    const [datasetData, tokenizerData] = await Promise.all([
      api.listProjectDatasets(projectId),
      api.listProjectTokenizers(projectId)
    ]);
    setDatasets(datasetData.datasets);
    setTokenizers(tokenizerData.tokenizers);
    setDatasetId((current) => current || datasetData.datasets[0]?.id || "");
    setTokenizerId((current) => current || tokenizerData.tokenizers[0]?.id || "");
  }

  useEffect(() => {
    let active = true;
    Promise.all([api.listProjectDatasets(projectId), api.listProjectTokenizers(projectId)])
      .then(([datasetData, tokenizerData]) => {
        if (!active) return;
        setDatasets(datasetData.datasets);
        setTokenizers(tokenizerData.tokenizers);
        setDatasetId(datasetData.datasets[0]?.id ?? "");
        setTokenizerId(tokenizerData.tokenizers[0]?.id ?? "");
      })
      .catch((requestError) => {
        if (active) setError(errorMessage(requestError));
      });
    return () => {
      active = false;
    };
  }, [api, projectId]);

  async function createTokenizer() {
    if (!datasetId) return;
    try {
      const tokenizer = await api.createNativeTokenizer(projectId, {
        name: "native-tokenizer",
        dataset_id: datasetId,
        max_vocab: 2000,
        text_fields: ["instruction", "response", "text"]
      });
      await refresh();
      setTokenizerId(tokenizer.id);
      setError(null);
    } catch (requestError) {
      setError(errorMessage(requestError));
    }
  }

  async function inspectText() {
    if (!tokenizerId) return;
    try {
      setInspection(await api.inspectProjectTokenizer(projectId, tokenizerId, { text }));
      setError(null);
    } catch (requestError) {
      setError(errorMessage(requestError));
    }
  }

  async function deleteTokenizer() {
    if (!tokenizerId || !window.confirm("Delete the selected tokenizer from this project?")) {
      return;
    }
    try {
      await api.deleteProjectTokenizer(projectId, tokenizerId);
      setInspection(null);
      setTokenizerId("");
      await refresh();
      setError(null);
    } catch (requestError) {
      setError(errorMessage(requestError));
    }
  }

  return (
    <div className="studio-page">
      <PageHeader title="Tokenizer Lab" description="Create a native ArcLM tokenizer from project data and inspect token IDs." />
      {error ? <ErrorState title="Tokenizer request failed" description={error} /> : null}
      <div className="studio-two-column">
        <Card>
          <CardHeader><CardTitle>Create native tokenizer</CardTitle><CardDescription>Uses the canonical ArcLM Tokenizer; no external downloads.</CardDescription></CardHeader>
          <CardContent className="studio-form">
            <Select label="Source dataset" value={datasetId} onChange={(event) => setDatasetId(event.target.value)}>
              <option value="">Select dataset</option>
              {datasets.map((dataset) => <option key={dataset.id} value={dataset.id}>{dataset.name}</option>)}
            </Select>
            <Button onClick={() => void createTokenizer()} disabled={!datasetId}>Create native tokenizer</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Inspect tokenizer</CardTitle><CardDescription>Tokenize text and show IDs, unknowns, and decoding.</CardDescription></CardHeader>
          <CardContent className="studio-form">
            <Select label="Tokenizer" value={tokenizerId} onChange={(event) => setTokenizerId(event.target.value)}>
              <option value="">Select tokenizer</option>
              {tokenizers.map((tokenizer) => <option key={tokenizer.id} value={tokenizer.id}>{tokenizer.name} ({tokenizer.vocab_size})</option>)}
            </Select>
            <Textarea label="Text" value={text} onChange={(event) => setText(event.target.value)} />
            <div className="studio-actions">
              <Button onClick={() => void inspectText()} disabled={!tokenizerId || !text.trim()}>Inspect text</Button>
              <Button variant="destructive" onClick={() => void deleteTokenizer()} disabled={!tokenizerId}>Delete tokenizer</Button>
            </div>
          </CardContent>
        </Card>
      </div>
      {inspection ? (
        <Card>
          <CardHeader><CardTitle>Tokenizer inspection</CardTitle><CardDescription>Real output from the project tokenizer.</CardDescription></CardHeader>
          <CardContent>
            <KeyValueList items={[
              { label: "Tokenizer", value: inspection.tokenizer_class },
              { label: "Vocabulary size", value: inspection.vocab_size },
              { label: "Token count", value: inspection.token_count },
              { label: "Unknown tokens", value: inspection.unknown_token_count },
              { label: "Round trip", value: inspection.round_trip_matches ? "Matches" : "Differs" },
              { label: "Decoded text", value: inspection.decoded_text }
            ]} />
            <div className="studio-token-row">{inspection.tokens.map((token, index) => <span key={`${token}-${index}`}>{token}<code>{inspection.token_ids[index]}</code></span>)}</div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

export function SystemPage({ client }: { client?: StudioClient }) {
  const api = useStudioClient(client);
  const [system, setSystem] = useState<SystemStatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getSystemStatus().then(setSystem).catch((requestError) => setError(errorMessage(requestError)));
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
                { label: "Projects", value: system.workspace.project_count }
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
