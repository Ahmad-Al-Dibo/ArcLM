"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  EmptyState,
  ErrorState,
  KeyValueList,
  Metric,
  PageHeader,
  SectionHeader,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeaderCell,
  TableRow
} from "@/components/ui";
import type { DatasetField, DatasetInspectionResponse, DatasetPreviewRow, DatasetSummary, DatasetWarning } from "@/lib/api/schemas";
import { useInterfaceMode } from "@/providers/interface-mode-provider";
import {
  formatBytes,
  formatDatasetFormat,
  formatDecimal,
  formatFieldType,
  formatNumber,
  inspectionScope,
  previewDetail,
  previewLabel,
  warningTitle
} from "./dataset-format";
import type { DatasetClient } from "./dataset-types";
import { DatasetSourceManager } from "./dataset-source-manager";
import { useDatasetInspector } from "./use-dataset-inspector";

function DatasetCatalogue({
  datasets,
  selectedId,
  onSelect
}: {
  datasets: DatasetSummary[];
  selectedId: string | null;
  onSelect: (datasetId: string) => void;
}) {
  const { mode } = useInterfaceMode();
  return (
    <Card className="dataset-catalogue">
      <CardHeader>
        <CardTitle>Dataset catalogue</CardTitle>
        <CardDescription>Approved local datasets from configured backend roots.</CardDescription>
      </CardHeader>
      <CardContent className="dataset-list" role="list" aria-label="Available datasets">
        {datasets.map((dataset) => {
          const selected = selectedId === dataset.dataset_id;
          return (
            <div key={dataset.dataset_id} role="listitem">
              <button
                type="button"
                className="dataset-list-item"
                aria-pressed={selected}
                onClick={() => onSelect(dataset.dataset_id)}
              >
                <span>
                  <strong>{dataset.name}</strong>
                  <span>{formatDatasetFormat(dataset.format)} - {formatBytes(dataset.size_bytes)}</span>
                  {mode === "advanced" ? <code>{dataset.dataset_id}</code> : null}
                </span>
                <Badge variant={selected ? "success" : "neutral"}>{selected ? "Selected" : formatDatasetFormat(dataset.format)}</Badge>
              </button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function LoadingCatalogue() {
  return (
    <Card className="dataset-catalogue">
      <CardHeader>
        <CardTitle>Dataset catalogue</CardTitle>
        <CardDescription>Loading approved local datasets.</CardDescription>
      </CardHeader>
      <CardContent>
        <Skeleton label="Loading dataset catalogue" />
      </CardContent>
    </Card>
  );
}

function CatalogueState({
  status,
  message,
  onRefresh
}: {
  status: string;
  message: string | null;
  onRefresh: () => void;
}) {
  if (status === "empty") {
    return (
      <Card className="dataset-catalogue">
        <CardHeader>
          <CardTitle>No datasets are available</CardTitle>
          <CardDescription>The backend is connected, but no supported dataset files were found inside the configured dataset roots.</CardDescription>
        </CardHeader>
        <CardContent className="ui-stack">
          <p className="ui-section-description">Supported formats: TXT, CSV, JSON, JSONL.</p>
          <SupportedFormats />
        </CardContent>
      </Card>
    );
  }

  if (status === "disconnected") {
    return (
      <Card className="dataset-catalogue">
        <CardHeader>
          <CardTitle>ArcLM backend is not connected</CardTitle>
          <CardDescription>Start the local backend with an approved dataset root.</CardDescription>
        </CardHeader>
        <CardContent className="ui-stack">
          <code className="dataset-command">python -m arclm web-api --dataset-root workspace=./data</code>
          <Button onClick={onRefresh}>Retry</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="dataset-catalogue">
      <CardHeader>
        <CardTitle>{status === "invalid" ? "Dataset catalogue response is invalid" : "Dataset catalogue failed"}</CardTitle>
        <CardDescription>{message ?? "The dataset catalogue could not be loaded."}</CardDescription>
      </CardHeader>
      <CardContent>
        <ErrorState title="Catalogue unavailable" description={message ?? "Try refreshing after the backend is running."} actionLabel="Retry" onAction={onRefresh} />
      </CardContent>
    </Card>
  );
}

function Summary({ inspection }: { inspection: DatasetInspectionResponse }) {
  const { mode } = useInterfaceMode();
  const scope = inspectionScope(inspection.metadata);
  const items: Array<{ label: string; value: ReactNode }> = [
    { label: "Format", value: formatDatasetFormat(inspection.format) },
    { label: "Size", value: formatBytes(inspection.size_bytes) },
    { label: "Rows scanned", value: formatNumber(inspection.statistics.rows_scanned) },
    { label: "Detected fields", value: formatNumber(inspection.statistics.field_count) },
    { label: "Preview rows", value: formatNumber(inspection.metadata.preview_rows) },
    { label: "Inspection scope", value: scope.title },
    { label: "Warnings", value: formatNumber(inspection.warnings.length) }
  ];

  if (mode === "advanced") {
    items.push(
      { label: "Dataset ID", value: <code>{inspection.dataset_id}</code> },
      { label: "Encoding", value: inspection.encoding },
      { label: "Scan limit", value: formatNumber(inspection.metadata.scan_limit) },
      { label: "Preview limit", value: formatNumber(inspection.metadata.preview_limit) },
      { label: "Schema source", value: inspection.metadata.schema_source },
      { label: "Truncated", value: inspection.metadata.truncated ? "Yes" : "No" }
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{inspection.name}</CardTitle>
        <CardDescription>Read-only summary of the selected dataset.</CardDescription>
      </CardHeader>
      <CardContent>
        <KeyValueList items={items} />
      </CardContent>
    </Card>
  );
}

function ScopeNotice({ inspection }: { inspection: DatasetInspectionResponse }) {
  const { mode } = useInterfaceMode();
  const scope = inspectionScope(inspection.metadata);
  return (
    <Alert variant={scope.tone} title={scope.title}>
      {scope.description}
      {mode === "advanced" ? ` Scan limit: ${formatNumber(inspection.metadata.scan_limit)}. Preview limit: ${formatNumber(inspection.metadata.preview_limit)}.` : null}
    </Alert>
  );
}

function SchemaView({ fields }: { fields: DatasetField[] }) {
  if (fields.length === 0) {
    return <EmptyState title="No fields detected" description="The inspected sample did not contain structured fields." />;
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detected fields</CardTitle>
        <CardDescription>Field inference is based on the inspected sample.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <caption>Detected dataset fields</caption>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Type</TableHeaderCell>
              <TableHeaderCell>Nullable</TableHeaderCell>
              <TableHeaderCell>Observed rows</TableHeaderCell>
              <TableHeaderCell>Missing</TableHeaderCell>
              <TableHeaderCell>Empty</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fields.map((field) => (
              <TableRow key={field.name}>
                <TableCell><span className="dataset-long-text">{field.name}</span></TableCell>
                <TableCell>
                  {formatFieldType(field.type)} {field.type === "mixed" ? <Badge variant="warning">Mixed</Badge> : null}
                </TableCell>
                <TableCell>{field.nullable ? "Yes" : "No"}</TableCell>
                <TableCell>{formatNumber(field.observed_in_rows)}</TableCell>
                <TableCell>{formatNumber(field.missing_count)}</TableCell>
                <TableCell>{formatNumber(field.empty_count)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function RowDetail({ row }: { row: DatasetPreviewRow }) {
  return (
    <Dialog triggerLabel="View row" title={`Preview row ${row.row_id}`} description="Read-only view of values already returned by the bounded API.">
      <pre className="dataset-row-detail" aria-label="Preview row values">{JSON.stringify(row.values, null, 2)}</pre>
    </Dialog>
  );
}

function PreviewTable({ inspection }: { inspection: DatasetInspectionResponse }) {
  const fieldNames = inspection.fields.map((field) => field.name);
  const columns = fieldNames.length + 2;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Preview</CardTitle>
        <CardDescription>Bounded rows returned by the backend. Values are rendered as plain text.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <caption>Bounded dataset preview rows</caption>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Row</TableHeaderCell>
              {fieldNames.map((field) => (
                <TableHeaderCell key={field}>{field}</TableHeaderCell>
              ))}
              <TableHeaderCell>Details</TableHeaderCell>
            </TableRow>
          </TableHead>
          {inspection.preview_rows.length === 0 ? (
            <TableEmpty columns={columns} title="No preview rows" description="The backend did not return rows for this dataset." />
          ) : (
            <TableBody>
              {inspection.preview_rows.map((row) => (
                <TableRow key={row.row_id}>
                  <TableCell>{row.row_id}</TableCell>
                  {fieldNames.map((field) => (
                    <TableCell key={field}>
                      <span className="dataset-preview-value" title={previewDetail(row.values[field])}>
                        {previewLabel(row.values[field])}
                      </span>
                    </TableCell>
                  ))}
                  <TableCell><RowDetail row={row} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </CardContent>
    </Card>
  );
}

function Statistics({ inspection }: { inspection: DatasetInspectionResponse }) {
  const stats = inspection.statistics;
  const text = stats.text_lengths;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quality statistics</CardTitle>
        <CardDescription>All values describe inspected rows, not necessarily the full dataset.</CardDescription>
      </CardHeader>
      <CardContent className="dataset-stat-grid">
        <Metric label="Rows scanned" value={formatNumber(stats.rows_scanned)} hint={stats.row_count_scope} />
        <Metric label="Missing values" value={formatNumber(inspection.fields.reduce((total, field) => total + field.missing_count, 0))} hint="Across detected fields" />
        <Metric label="Empty strings" value={formatNumber(inspection.fields.reduce((total, field) => total + field.empty_count, 0))} hint="Across detected fields" />
        <Metric label="Duplicates in inspected rows" value={formatNumber(stats.duplicate_count)} hint={stats.duplicate_scope} />
        <Metric label="Average text length" value={formatDecimal(text.average)} hint="Characters" />
        <Metric label="Invalid rows" value={formatNumber(stats.invalid_row_count)} hint="During inspection" />
      </CardContent>
    </Card>
  );
}

function FieldQuality({ fields }: { fields: DatasetField[] }) {
  const { mode } = useInterfaceMode();
  if (mode !== "advanced" || fields.length === 0) {
    return null;
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Field quality details</CardTitle>
        <CardDescription>Advanced view of missing and empty values per detected field.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <caption>Field-level quality summary</caption>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Field</TableHeaderCell>
              <TableHeaderCell>Observed type</TableHeaderCell>
              <TableHeaderCell>Observed rows</TableHeaderCell>
              <TableHeaderCell>Missing values</TableHeaderCell>
              <TableHeaderCell>Empty strings</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fields.map((field) => (
              <TableRow key={field.name}>
                <TableCell>{field.name}</TableCell>
                <TableCell>{formatFieldType(field.type)}</TableCell>
                <TableCell>{formatNumber(field.observed_in_rows)}</TableCell>
                <TableCell>{formatNumber(field.missing_count)}</TableCell>
                <TableCell>{formatNumber(field.empty_count)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function WarningPanel({ warnings }: { warnings: DatasetWarning[] }) {
  const { mode } = useInterfaceMode();
  if (warnings.length === 0) {
    return (
      <Alert variant="success" title="No inspection warnings">
        The bounded inspection did not report warnings.
      </Alert>
    );
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Inspection warnings</CardTitle>
        <CardDescription>Warnings returned by the backend inspection.</CardDescription>
      </CardHeader>
      <CardContent className="dataset-warning-list">
        {warnings.map((warning) => (
          <Alert key={`${warning.code}-${warning.message}`} variant={warning.code === "mixed_field_types" ? "warning" : "info"} title={warningTitle(warning)}>
            {warning.message}
            {mode === "advanced" ? <code className="dataset-inline-code">{warning.code}</code> : null}
          </Alert>
        ))}
      </CardContent>
    </Card>
  );
}

function SupportedFormats() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Supported in this version</CardTitle>
        <CardDescription>Read-only inspection supports local files approved by the backend.</CardDescription>
      </CardHeader>
      <CardContent className="dataset-format-grid">
        <span><strong>TXT</strong> Non-empty lines become text records.</span>
        <span><strong>CSV</strong> Header fields define columns.</span>
        <span><strong>JSON</strong> Approved record structures are inspected.</span>
        <span><strong>JSONL</strong> One JSON object per line is expected.</span>
      </CardContent>
    </Card>
  );
}

function AdvancedInspector({ inspection }: { inspection: DatasetInspectionResponse }) {
  const { mode } = useInterfaceMode();
  const [open, setOpen] = useState(false);
  if (mode !== "advanced") {
    return null;
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced inspection metadata</CardTitle>
        <CardDescription>Safe technical fields from the bounded inspection response.</CardDescription>
      </CardHeader>
      <CardContent className="ui-stack">
        <KeyValueList
          items={[
            { label: "Dataset ID", value: <code>{inspection.dataset_id}</code> },
            { label: "Format identifier", value: inspection.format },
            { label: "Exact row count", value: inspection.statistics.row_count_scope === "exact" ? formatNumber(inspection.statistics.row_count) : "Not available" },
            { label: "Field count scope", value: inspection.statistics.field_count_scope },
            { label: "Maximum field length", value: formatNumber(inspection.metadata.max_field_length) },
            { label: "Maximum fields", value: formatNumber(inspection.metadata.max_fields) }
          ]}
        />
        <Button variant="secondary" onClick={() => setOpen((current) => !current)}>
          {open ? "Hide safe response" : "View safe response"}
        </Button>
        {open ? (
          <pre className="dataset-row-detail" aria-label="Safe dataset inspection response">{JSON.stringify(inspection, null, 2)}</pre>
        ) : null}
      </CardContent>
    </Card>
  );
}

function SelectedDatasetContent({
  status,
  message,
  inspection,
  hasDatasets
}: {
  status: string;
  message: string | null;
  inspection: DatasetInspectionResponse | null;
  hasDatasets: boolean;
}) {
  if (!hasDatasets) {
    return null;
  }
  if (status === "idle") {
    return <EmptyState title="Select a dataset" description="Choose an approved local dataset to inspect its fields, preview, statistics, and warnings." />;
  }
  if (status === "loading") {
    return <Skeleton label="Loading dataset inspection" />;
  }
  if (status === "unknown") {
    return <ErrorState title="Selected dataset is unavailable" description={message ?? "The selected dataset is not available in the current catalogue."} />;
  }
  if (status === "invalid") {
    return <ErrorState title="Invalid dataset selection" description={message ?? "The selected dataset ID is not valid."} />;
  }
  if (status === "error" || !inspection) {
    return <ErrorState title="Dataset inspection failed" description={message ?? "The selected dataset could not be inspected."} />;
  }

  return (
    <div className="dataset-selected-stack">
      <Summary inspection={inspection} />
      <ScopeNotice inspection={inspection} />
      <SchemaView fields={inspection.fields} />
      <PreviewTable inspection={inspection} />
      <Statistics inspection={inspection} />
      <FieldQuality fields={inspection.fields} />
      <WarningPanel warnings={inspection.warnings} />
      <AdvancedInspector inspection={inspection} />
    </div>
  );
}

export function DatasetInspector({ client }: { client?: DatasetClient }) {
  const { mode } = useInterfaceMode();
  const inspector = useDatasetInspector(client);
  const loadingCatalogue = inspector.catalogueStatus === "loading";
  const canShowCatalogue = inspector.catalogueStatus === "loaded" || inspector.catalogueStatus === "empty";

  return (
    <div className="dataset-page">
      <PageHeader
        title="Data"
        description={mode === "advanced"
          ? "Inspect approved local datasets before preprocessing or training. The browser receives safe dataset IDs, not filesystem paths."
          : "Inspect approved local datasets before preprocessing or training."}
        actions={
          <Button variant="secondary" onClick={inspector.refresh} loading={inspector.isRefreshing} loadingLabel="Refreshing">
            Refresh
          </Button>
        }
      />

      {inspector.isStale ? (
        <Alert variant="warning" title="Displayed data may be stale">
          The last refresh failed. Existing inspection data is still shown until a new request succeeds.
        </Alert>
      ) : null}

      <DatasetSourceManager client={client} onCatalogueChanged={inspector.refresh} />

      <div className="dataset-workspace">
        {loadingCatalogue ? <LoadingCatalogue /> : null}
        {!loadingCatalogue && canShowCatalogue && inspector.datasets.length > 0 ? (
          <DatasetCatalogue datasets={inspector.datasets} selectedId={inspector.selectedId} onSelect={inspector.selectDataset} />
        ) : null}
        {!loadingCatalogue && (inspector.catalogueStatus !== "loaded" || inspector.datasets.length === 0) ? (
          <CatalogueState status={inspector.catalogueStatus} message={inspector.catalogueMessage} onRefresh={inspector.refresh} />
        ) : null}

        <main className="dataset-main" aria-live="polite">
          <SectionHeader title="Selected dataset" description="Inspection is bounded and read-only." />
          <SelectedDatasetContent
            status={inspector.inspectionStatus}
            message={inspector.inspectionMessage}
            inspection={inspector.inspection}
            hasDatasets={inspector.datasets.length > 0}
          />
        </main>
      </div>

      <SupportedFormats />

      <Alert variant="planned" title="Next: Data Pipeline Studio">
        A later feature will allow supported preprocessing steps to be validated and previewed on a bounded sample. Planned capabilities include field mapping, cleaning, filtering, deduplication, preview, and before/after comparison.
      </Alert>
    </div>
  );
}
