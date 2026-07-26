import type { CapabilityStatus } from "@/lib/api/schemas";

export type BadgeTone = "neutral" | "info" | "success" | "warning" | "error" | "planned" | "experimental";

export const statusLabels: Record<CapabilityStatus, { label: string; tone: BadgeTone }> = {
  available: { label: "Available", tone: "success" },
  locally_verified: { label: "Locally verified", tone: "success" },
  verified_for_correctness: { label: "Verified for correctness", tone: "info" },
  planned: { label: "Planned", tone: "planned" },
  experimental: { label: "Experimental", tone: "experimental" },
  hardware_unavailable: { label: "Hardware unavailable", tone: "warning" },
  dependency_missing: { label: "Dependency missing", tone: "warning" },
  not_verified: { label: "Not verified", tone: "warning" },
  unsupported: { label: "Unsupported in this build", tone: "error" }
};

const extraStatusLabels: Record<string, { label: string; tone: BadgeTone }> = {
  verified: { label: "Verified", tone: "success" },
  pending_cloud_validation: { label: "Pending cloud validation", tone: "warning" },
  not_implemented: { label: "Not implemented", tone: "planned" },
  hardware_unavailable_locally: { label: "Hardware unavailable locally", tone: "warning" },
  installed: { label: "Installed", tone: "success" },
  not_installed: { label: "Not installed", tone: "neutral" }
};

export function statusLabel(status: string | null | undefined) {
  if (status && status in statusLabels) {
    return statusLabels[status as CapabilityStatus];
  }
  if (status && status in extraStatusLabels) {
    return extraStatusLabels[status];
  }
  return { label: "Unknown status", tone: "neutral" as const };
}

export function formatMissing(value: string | number | boolean | null | undefined) {
  if (value === null || value === undefined || value === "") {
    return "Not reported";
  }
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }
  return String(value);
}

export function formatBytes(bytes: number | null | undefined) {
  if (!bytes || bytes <= 0 || !Number.isFinite(bytes)) {
    return "Not reported";
  }
  const gib = bytes / 1024 ** 3;
  if (gib >= 1) {
    return `${gib.toFixed(1)} GB`;
  }
  return `${Math.round(bytes / 1024 ** 2)} MB`;
}

export function formatComputeCapability(value: [number, number] | null | undefined) {
  if (!value) {
    return "Not reported";
  }
  return `${value[0]}.${value[1]}`;
}

export function formatRefreshTime(date: Date | null) {
  if (!date) {
    return "Not reported";
  }
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}
