"use client";

import type { FormEvent } from "react";
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
  Checkbox,
  EmptyState,
  ErrorState,
  KeyValueList,
  Skeleton,
  Switch,
  TextInput
} from "@/components/ui";
import type { DatasetRootInfo, DatasetWarning } from "@/lib/api/schemas";
import { useInterfaceMode } from "@/providers/interface-mode-provider";
import type { DatasetClient } from "./dataset-types";
import { formatNumber } from "./dataset-format";
import { useDatasetSources } from "./use-dataset-sources";

function warningText(warnings: DatasetWarning[]) {
  if (warnings.length === 0) {
    return "No warnings";
  }
  return warnings.map((warning) => warning.message).join(" ");
}

function statusVariant(root: DatasetRootInfo) {
  if (!root.enabled) {
    return "neutral";
  }
  if (root.validation_status === "error") {
    return "error";
  }
  if (root.validation_status === "warning") {
    return "warning";
  }
  return "success";
}

function RemoveSourceDialog({
  root,
  disabled,
  onRemove
}: {
  root: DatasetRootInfo;
  disabled: boolean;
  onRemove: (rootId: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="destructive" size="small" disabled={disabled || !root.removable} onClick={() => setOpen(true)}>
        Remove
      </Button>
      {open ? (
        <div className="ui-dialog-backdrop" onMouseDown={() => setOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`remove-${root.root_id}`}
            className="ui-dialog"
            tabIndex={-1}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="ui-dialog-header">
              <h2 id={`remove-${root.root_id}`} className="ui-dialog-title">Remove this dataset source from ArcLM?</h2>
              <p className="ui-dialog-description">The folder and its files will not be deleted.</p>
            </div>
            <div className="ui-row">
              <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setOpen(false);
                  onRemove(root.root_id);
                }}
              >
                Remove source
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function SourceRow({
  root,
  disabled,
  onToggle,
  onRecursive,
  onRemove
}: {
  root: DatasetRootInfo;
  disabled: boolean;
  onToggle: (rootId: string, enabled: boolean) => void;
  onRecursive: (rootId: string, recursive: boolean) => void;
  onRemove: (rootId: string) => void;
}) {
  const { mode } = useInterfaceMode();
  return (
    <article className="dataset-source-item">
      <div className="dataset-source-main">
        <div>
          <h3>{root.name}</h3>
          <p className="dataset-source-path">{root.path}</p>
          <p className="ui-section-description">{warningText(root.warnings)}</p>
        </div>
        <div className="dataset-source-badges">
          <Badge variant={statusVariant(root)}>{root.enabled ? "Active" : "Disabled"}</Badge>
          {root.source_origin === "command_line" ? <Badge variant="experimental">Session only</Badge> : null}
        </div>
      </div>
      <div className="dataset-source-actions">
        <Switch
          label={root.enabled ? "Enabled" : "Disabled"}
          checked={root.enabled}
          disabled={disabled || !root.editable}
          onCheckedChange={(checked) => onToggle(root.root_id, checked)}
        />
        {mode === "advanced" ? (
          <Switch
            label="Include subfolders"
            checked={root.recursive}
            disabled={disabled || !root.editable}
            onCheckedChange={(checked) => onRecursive(root.root_id, checked)}
          />
        ) : null}
        <RemoveSourceDialog root={root} disabled={disabled} onRemove={onRemove} />
      </div>
      <KeyValueList
        items={[
          { label: "Datasets", value: formatNumber(root.supported_file_count) },
          { label: "Ignored files", value: formatNumber(root.ignored_file_count) },
          ...(mode === "advanced"
            ? [
                { label: "Root ID", value: <code>{root.root_id}</code> },
                { label: "Origin", value: root.source_origin },
                { label: "Recursive", value: root.recursive ? "On" : "Off" }
              ]
            : [])
        ]}
      />
    </article>
  );
}

export function DatasetSourceManager({
  client,
  onCatalogueChanged
}: {
  client?: DatasetClient;
  onCatalogueChanged?: () => Promise<void> | void;
}) {
  const { mode } = useInterfaceMode();
  const manager = useDatasetSources(client, onCatalogueChanged);
  const [name, setName] = useState("");
  const [path, setPath] = useState("");
  const [recursive, setRecursive] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void manager.addRoot(name, path, recursive);
    setName("");
    setPath("");
    setRecursive(false);
  }

  const activeCount = manager.roots.filter((root) => root.enabled).length;
  const datasetsFound = manager.roots.reduce((total, root) => total + (root.enabled ? root.supported_file_count : 0), 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dataset Sources</CardTitle>
        <CardDescription>Configure local folders that ArcLM may inspect. Files remain on this device.</CardDescription>
      </CardHeader>
      <CardContent className="ui-stack">
        <form className="dataset-source-form" onSubmit={submit}>
          <TextInput
            label="Source name"
            value={name}
            required
            onChange={(event) => setName(event.target.value)}
            placeholder="Training Data"
          />
          <TextInput
            label="Folder path"
            value={path}
            required
            onChange={(event) => setPath(event.target.value)}
            placeholder="D:\\ArcLM\\data\\training"
            description="Paste an absolute local folder path. Browsers cannot safely browse unrestricted server folders."
          />
          {mode === "advanced" ? (
            <Checkbox
              label="Include subfolders"
              checked={recursive}
              onChange={(event) => setRecursive(event.target.checked)}
              description="Off by default. Recursive scans use backend limits."
            />
          ) : null}
          <div className="ui-row">
            <Button type="submit" disabled={manager.isWorking || !name.trim() || !path.trim()}>
              Add dataset folder
            </Button>
            <Button type="button" variant="secondary" loading={manager.isWorking} loadingLabel="Refreshing" onClick={manager.refreshSources}>
              Refresh catalogue
            </Button>
          </div>
        </form>

        {manager.message ? <Alert variant="error" title="Dataset source action failed">{manager.message}</Alert> : null}
        {manager.lastAction ? <Alert variant="success" title={manager.lastAction}>The dataset catalogue was refreshed after the change.</Alert> : null}

        {manager.status === "loading" ? <Skeleton label="Loading dataset sources" /> : null}
        {manager.status === "disconnected" ? (
          <ErrorState title="Dataset source manager is disconnected" description="Start the local backend before managing dataset folders." />
        ) : null}
        {manager.status === "unavailable" ? (
          <ErrorState title="Dataset source management is unavailable" description="Root management is disabled for this backend configuration." />
        ) : null}
        {manager.status === "empty" ? (
          <EmptyState title="No dataset sources yet" description="Add a local dataset folder to populate the catalogue." />
        ) : null}

        {manager.roots.length > 0 ? (
          <div className="dataset-source-summary" aria-label="Dataset source summary">
            <span>{formatNumber(manager.roots.length)} dataset sources</span>
            <span>{formatNumber(activeCount)} active</span>
            <span>{formatNumber(datasetsFound)} supported dataset files</span>
          </div>
        ) : null}

        <div className="dataset-source-list" role="list" aria-label="Dataset sources">
          {manager.roots.map((root) => (
            <div key={root.root_id} role="listitem">
              <SourceRow
                root={root}
                disabled={manager.isWorking}
                onToggle={(rootId, enabled) => manager.updateRoot(rootId, { enabled })}
                onRecursive={(rootId, nextRecursive) => manager.updateRoot(rootId, { recursive: nextRecursive })}
                onRemove={manager.removeRoot}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
