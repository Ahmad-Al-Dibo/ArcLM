import type { DatasetFieldType, DatasetFormat, DatasetInspectionMetadata, DatasetWarning } from "@/lib/api/schemas";

export type BadgeTone = "neutral" | "info" | "success" | "warning" | "error" | "planned" | "experimental";

export function formatBytes(bytes: number | null | undefined) {
  if (bytes === null || bytes === undefined || !Number.isFinite(bytes) || bytes < 0) {
    return "Not reported";
  }
  if (bytes >= 1024 ** 2) {
    return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  }
  if (bytes >= 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${bytes} B`;
}

export function formatNumber(value: number | null | undefined) {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return "Not available";
  }
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatDecimal(value: number | null | undefined) {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return "Not available";
  }
  return value.toFixed(1);
}

export function formatDatasetFormat(format: DatasetFormat | string) {
  return format.toUpperCase();
}

const fieldTypeLabels: Record<DatasetFieldType, string> = {
  string: "String",
  integer: "Integer",
  number: "Number",
  boolean: "Boolean",
  null: "Null",
  object: "Object",
  array: "Array",
  mixed: "Mixed"
};

export function formatFieldType(type: DatasetFieldType) {
  return fieldTypeLabels[type] ?? "Unknown";
}

export function inspectionScope(metadata: DatasetInspectionMetadata) {
  if (metadata.complete) {
    return {
      title: "Complete inspection",
      description: "All available rows were inspected.",
      tone: "success" as BadgeTone
    };
  }
  return {
    title: "Bounded inspection",
    description: `Statistics are based on the first ${formatNumber(metadata.scan_limit)} rows.`,
    tone: "warning" as BadgeTone
  };
}

const warningTitles: Record<string, string> = {
  scan_limit_reached: "Scan limit reached",
  preview_truncated: "Preview truncated",
  field_value_truncated: "Field value truncated",
  mixed_field_types: "Mixed field types",
  too_many_fields: "Too many fields",
  unsupported_nested_values: "Nested values summarized"
};

export function warningTitle(warning: DatasetWarning) {
  return warningTitles[warning.code] ?? "Dataset inspection warning";
}

export function previewLabel(value: unknown) {
  if (value === null) {
    return "Null";
  }
  if (value === "") {
    return "Empty";
  }
  if (Array.isArray(value)) {
    return `Array (${value.length})`;
  }
  if (typeof value === "object") {
    return "Object";
  }
  return String(value);
}

export function previewDetail(value: unknown) {
  if (value === null) {
    return "Null";
  }
  if (value === "") {
    return "Empty string";
  }
  if (typeof value === "object") {
    return JSON.stringify(value, null, 2);
  }
  return String(value);
}

export function isSafeDatasetId(value: string | null | undefined) {
  return typeof value === "string" && /^dataset_[A-Za-z0-9_-]+$/.test(value);
}
