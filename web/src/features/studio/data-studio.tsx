"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
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
  PageHeader,
  Select,
  TextInput,
  Textarea
} from "@/components/ui";
import type {
  DatasetFormat,
  DatasetManifestReportResponse,
  DatasetValidationResponse,
  ProjectDatasetPreviewResponse,
  StudioDatasetMetadata,
  StudioTokenizerMetadata
} from "@/lib/api/schemas";
import { DatasetPreviewTable, RecordTokenInspectionView, ReportView, ValidationView } from "./components/dataset-views";
import { errorMessage, fieldsFromString, formatChoices, type StudioClient, useStudioClient } from "./shared";

export function DataStudioPage({ projectId, client }: { projectId: string; client?: StudioClient }) {
  const api = useStudioClient(client);
  const [datasets, setDatasets] = useState<StudioDatasetMetadata[]>([]);
  const [tokenizers, setTokenizers] = useState<StudioTokenizerMetadata[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [selectedTokenizerId, setSelectedTokenizerId] = useState("");
  const [preview, setPreview] = useState<ProjectDatasetPreviewResponse | null>(null);
  const [validation, setValidation] = useState<DatasetValidationResponse | null>(null);
  const [report, setReport] = useState<DatasetManifestReportResponse | null>(null);
  const [recordInspection, setRecordInspection] = useState<Record<string, unknown> | null>(null);
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
    Promise.all([api.listProjectDatasets(projectId), api.listProjectTokenizers(projectId)])
      .then(([response, tokenizerResponse]) => {
        if (!active) return;
        setDatasets(response.datasets);
        setSelectedId(response.datasets[0]?.id ?? "");
        setTokenizers(tokenizerResponse.tokenizers);
        setSelectedTokenizerId(tokenizerResponse.tokenizers[0]?.id ?? "");
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
    if (!selectedTokenizerId) {
      setError("Create or select a tokenizer before generating token statistics.");
      return;
    }
    setReport(await api.createProjectDatasetReport(projectId, selectedId, {
      tokenizer_id: selectedTokenizerId,
      maximum_sequence_length: 256
    }));
    setRecordInspection(null);
  }

  async function inspectSelectedRecords() {
    if (!selectedId || !selectedTokenizerId) return;
    const indexes = preview?.records.slice(0, 3).map((record) => record.index) ?? [0];
    setRecordInspection(await api.inspectProjectDatasetRecords(projectId, selectedId, {
      tokenizer_id: selectedTokenizerId,
      record_indexes: indexes,
      text_fields: fieldsFromString(fields),
      maximum_sequence_length: 256,
      max_records: 3,
      max_tokens_per_record: 64
    }) as unknown as Record<string, unknown>);
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
        <Select label="Tokenizer for statistics" value={selectedTokenizerId} onChange={(event) => {
          setSelectedTokenizerId(event.target.value);
          setReport(null);
          setRecordInspection(null);
        }}>
          <option value="">Select tokenizer</option>
          {tokenizers.map((tokenizer) => <option key={tokenizer.id} value={tokenizer.id}>{tokenizer.name} - vocab {tokenizer.vocab_size}</option>)}
        </Select>
        <Button variant="secondary" onClick={() => void reportSelected()} disabled={!selectedId || !selectedTokenizerId}>Generate token report</Button>
        <Button variant="secondary" onClick={() => void inspectSelectedRecords()} disabled={!selectedId || !selectedTokenizerId}>Inspect record tokens</Button>
        <Button variant="destructive" onClick={() => void deleteSelectedDataset()} disabled={!selectedId}>Delete dataset</Button>
      </div>
      {!tokenizers.length ? (
        <Card>
          <CardContent>
            <EmptyState title="Create a tokenizer before generating token statistics" description="Schema validation and preview still work without a tokenizer." />
            <Link className="ui-button ui-button-secondary" href={`/projects/${projectId}/tokenizer`}>Open Tokenizer Lab</Link>
          </CardContent>
        </Card>
      ) : null}
      {preview ? <DatasetPreviewTable preview={preview} /> : null}
      {validation ? <ValidationView validation={validation} /> : null}
      {report ? <ReportView report={report} /> : null}
      {recordInspection ? <RecordTokenInspectionView inspection={recordInspection} /> : null}
    </div>
  );
}
