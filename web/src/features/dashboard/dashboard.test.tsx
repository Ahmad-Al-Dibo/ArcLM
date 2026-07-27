import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AppProviders } from "@/providers/app-providers";
import { ApiClientError } from "@/lib/api/client";
import type { CapabilitiesResponse, EnvironmentResponse, HealthResponse, ProjectStatusResponse } from "@/lib/api/schemas";
import { useInterfaceMode } from "@/providers/interface-mode-provider";
import type { DashboardClient } from "./dashboard-types";
import { SimpleDashboard } from "./dashboard";

function health(version = "0.6.1"): HealthResponse {
  return { status: "ok", service: "arclm-web-api", version };
}

function cpuEnvironment(): EnvironmentResponse {
  return {
    arclm_version: "0.6.1",
    python_version: "3.12.10",
    platform: "Windows",
    pytorch_version: "2.13.0+cpu",
    cuda_available: false,
    cuda_runtime: null,
    device_count: 0,
    available_devices: ["cpu"],
    preferred_device: "cpu",
    gpus: [],
    bf16_supported: null
  };
}

function cudaEnvironment(): EnvironmentResponse {
  return {
    arclm_version: "0.6.1",
    python_version: "3.12.10",
    platform: "Windows",
    pytorch_version: "2.5.1+cu121",
    cuda_available: true,
    cuda_runtime: "12.1",
    device_count: 1,
    available_devices: ["cpu", "cuda:0"],
    preferred_device: "cuda:0",
    gpus: [
      {
        name: "NVIDIA GeForce GTX 1050 Ti",
        vram_bytes: 4_294_770_688,
        compute_capability: [6, 1]
      }
    ],
    bf16_supported: false
  };
}

function capabilities(): CapabilitiesResponse {
  return {
    training: {
      single_device: { status: "available", note: "Ready" },
      checkpoints: { status: "available", note: "Ready" },
      fp16: { status: "locally_verified", note: "Verified" },
      bf16: { status: "hardware_unavailable", note: "No native BF16" },
      multi_gpu: { status: "hardware_unavailable", note: "One GPU" }
    },
    evaluation: {
      basic: { status: "available", note: "Ready" }
    },
    inference: {
      basic: { status: "available", note: "Ready" }
    },
    web: {
      backend: { status: "available", note: "Ready" },
      dashboard: { status: "planned", note: "Later" }
    }
  };
}

function projectStatus(): ProjectStatusResponse {
  return {
    project: { name: "ArcLM", version: "0.6.1" },
    web_milestone: {
      name: "Web Milestone 1",
      feature: "Advanced Dashboard",
      status: "complete"
    },
    available_sections: ["overview", "training", "evaluation"],
    completed: [
      { name: "Frontend Foundation", status: "implemented" },
      { name: "Design System", status: "implemented" },
      { name: "Application Shell", status: "implemented" },
      { name: "Local Web Backend", status: "implemented" },
      { name: "Simple Dashboard", status: "implemented" },
      { name: "Advanced Dashboard", status: "implemented" }
    ],
    current: { name: "Data Pipeline Studio", status: "planned" },
    next: [{ name: "Training Dashboard", status: "planned" }],
    planned_features: [
      {
        name: "Data Pipeline Studio",
        description: "Visual dataset preparation.",
        milestone: "Web Milestone 2",
        status: "planned"
      },
      {
        name: "Plugin Management",
        description: "Plugin visibility after permissions.",
        milestone: "Web Milestone 5",
        status: "planned"
      }
    ],
    validation: [
      { name: "CPU core suite", status: "verified", note: "Full CPU pytest passed." },
      { name: "CUDA FP16", status: "locally_verified", note: "Local GPU validation exists." },
      { name: "CUDA BF16 correctness", status: "verified_for_correctness", note: "Correctness only." },
      { name: "Multi-GPU", status: "pending_cloud_validation", note: "Needs two GPUs." }
    ],
    integrations: [
      {
        name: "Transformers",
        package: "transformers",
        package_status: "installed",
        arclm_status: "experimental",
        note: "External model support is partial.",
        extra: null
      },
      {
        name: "PEFT",
        package: "peft",
        package_status: "not_installed",
        arclm_status: "planned",
        note: "PEFT stabilization is planned.",
        extra: null
      }
    ],
    limitations: [
      {
        category: "Hardware limitation",
        title: "Single local GPU",
        description: "Multi-GPU cannot be proven locally.",
        status: "hardware_unavailable_locally"
      },
      {
        category: "Planned feature",
        title: "Browser training controls",
        description: "The dashboard is read-only.",
        status: "planned"
      }
    ]
  };
}

function client(overrides: Partial<DashboardClient> = {}): DashboardClient {
  return {
    getHealth: vi.fn().mockResolvedValue(health()),
    getEnvironment: vi.fn().mockResolvedValue(cpuEnvironment()),
    getCapabilities: vi.fn().mockResolvedValue(capabilities()),
    getProjectStatus: vi.fn().mockResolvedValue(projectStatus()),
    ...overrides
  };
}

function renderDashboard(testClient: DashboardClient) {
  return render(
    <AppProviders>
      <SimpleDashboard client={testClient} />
    </AppProviders>
  );
}

function ModeToggleDashboard({ testClient }: { testClient: DashboardClient }) {
  const { setMode } = useInterfaceMode();
  return (
    <>
      <button type="button" onClick={() => setMode("advanced")}>Switch advanced</button>
      <SimpleDashboard client={testClient} />
    </>
  );
}

function renderToggleDashboard(testClient: DashboardClient) {
  return render(
    <AppProviders>
      <ModeToggleDashboard testClient={testClient} />
    </AppProviders>
  );
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

afterEach(() => {
  window.localStorage.clear();
  vi.restoreAllMocks();
});

describe("SimpleDashboard connection state", () => {
  it("renders loading state without premature device claims", () => {
    const pending = deferred<HealthResponse>();
    renderDashboard(client({ getHealth: vi.fn().mockReturnValue(pending.promise) }));

    expect(screen.getByText("Connecting to ArcLM")).toBeTruthy();
    expect(screen.queryByText(/CUDA is not available/)).toBeNull();
  });

  it("renders connected state from real health data", async () => {
    renderDashboard(client());

    expect(await screen.findByText("ArcLM is ready")).toBeTruthy();
    expect(screen.getByText("ArcLM 0.6.1")).toBeTruthy();
    expect(screen.getByText("Web Milestone 1")).toBeTruthy();
  });

  it("renders disconnected state and retries", async () => {
    const testClient = client({
      getHealth: vi
        .fn()
        .mockRejectedValueOnce(new ApiClientError("Backend unavailable", "disconnected"))
        .mockResolvedValueOnce(health())
    });
    renderDashboard(testClient);

    expect(await screen.findByText("ArcLM backend is not connected")).toBeTruthy();
    expect(screen.getByText("python -m arclm web-api")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Retry" }));

    expect(await screen.findByText("ArcLM is ready")).toBeTruthy();
  });

  it("renders controlled error for invalid health response", async () => {
    renderDashboard(client({ getHealth: vi.fn().mockResolvedValue({ status: "ok" }) }));

    expect(await screen.findByText("ArcLM response needs attention")).toBeTruthy();
    expect(screen.getByText("The health response did not match the expected schema.")).toBeTruthy();
  });
});

describe("SimpleDashboard data sections", () => {
  it("renders CPU environment", async () => {
    renderDashboard(client());

    expect(await screen.findByText("CPU")).toBeTruthy();
    expect(screen.getByText("CUDA is not available in this environment.")).toBeTruthy();
  });

  it("renders CUDA environment with rounded VRAM", async () => {
    renderDashboard(client({ getEnvironment: vi.fn().mockResolvedValue(cudaEnvironment()) }));

    expect(await screen.findByText("NVIDIA GeForce GTX 1050 Ti")).toBeTruthy();
    expect(screen.getByText("Approximately 4 GB VRAM")).toBeTruthy();
  });

  it("handles missing GPU fields", async () => {
    const environment = { ...cudaEnvironment(), gpus: [] };
    renderDashboard(client({ getEnvironment: vi.fn().mockResolvedValue(environment) }));

    expect(await screen.findByText("CUDA device")).toBeTruthy();
  });

  it("renders capability statuses and planned values honestly", async () => {
    renderDashboard(client());

    expect(await screen.findByText("Single-device training")).toBeTruthy();
    expect(screen.getAllByText("Available").length).toBeGreaterThan(0);
    expect(screen.getByText(/BF16: Hardware unavailable/)).toBeTruthy();
    expect(screen.queryByText(/Multi-GPU.*Available/)).toBeNull();
  });

  it("uses safe fallback for unknown capability values", async () => {
    const altered = capabilities();
    altered.web.backend.status = "new_status" as CapabilitiesResponse["web"][string]["status"];
    renderDashboard(client({ getCapabilities: vi.fn().mockResolvedValue(altered) }));

    expect(await screen.findByText("Modern Web backend")).toBeTruthy();
    expect(screen.getAllByText("Unknown status").length).toBeGreaterThan(0);
  });
});

describe("SimpleDashboard actions and failure handling", () => {
  it("renders available route links and non-executable planned actions", async () => {
    renderDashboard(client());

    expect((await screen.findByRole("link", { name: "Training" })).getAttribute("href")).toBe("/training");
    expect(screen.getByText("Upload dataset: planned for Data Pipeline Studio")).toBeTruthy();
    expect(screen.queryByRole("button", { name: /Upload dataset/ })).toBeNull();
  });

  it("copies CLI commands and handles copy failure", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText }
    });
    renderDashboard(client());

    await screen.findByText("ArcLM is ready");
    fireEvent.click(screen.getAllByRole("button", { name: "Copy" })[0]);

    await waitFor(() => expect(writeText).toHaveBeenCalledWith("arclm train --config config.yaml --data data.txt --output models/model.pth"));
    expect(await screen.findByText("Copied training command.")).toBeTruthy();

    writeText.mockRejectedValueOnce(new Error("denied"));
    fireEvent.click(screen.getAllByRole("button", { name: "Copy" })[1]);
    expect(await screen.findByText("Copy failed. Select and copy the command manually.")).toBeTruthy();
  });

  it("keeps dashboard usable when secondary endpoints fail", async () => {
    renderDashboard(
      client({
        getEnvironment: vi.fn().mockRejectedValue(new Error("environment failed")),
        getCapabilities: vi.fn().mockRejectedValue(new Error("capabilities failed")),
        getProjectStatus: vi.fn().mockRejectedValue(new Error("project failed"))
      })
    );

    expect(await screen.findByText("ArcLM is ready")).toBeTruthy();
    expect(screen.getByText("Device details unavailable")).toBeTruthy();
    expect(screen.getByText("Capabilities unavailable")).toBeTruthy();
    expect(screen.getByText("Progress unavailable")).toBeTruthy();
  });

  it("preserves last successful data after failed refresh", async () => {
    const testClient = client({
      getHealth: vi.fn().mockResolvedValueOnce(health()).mockRejectedValueOnce(new Error("offline"))
    });
    renderDashboard(testClient);

    expect(await screen.findByText("ArcLM 0.6.1")).toBeTruthy();
    fireEvent.click(screen.getAllByRole("button", { name: "Refresh" })[0]);

    expect(await screen.findByText("ArcLM backend returned an error")).toBeTruthy();
    expect(screen.getByText("ArcLM 0.6.1")).toBeTruthy();
  });

  it("keeps technical sections out of simple mode", async () => {
    renderDashboard(client());

    expect(await screen.findByText("ArcLM is ready")).toBeTruthy();
    expect(screen.queryByText("Runtime details")).toBeNull();
    expect(screen.queryByText(/"project"/)).toBeNull();
  });

  it("shows advanced details without raw data by default", async () => {
    window.localStorage.setItem("arclm-interface-mode", "advanced");
    renderDashboard(client());

    expect(await screen.findByText("Advanced dashboard details are visible below. The view is read-only and uses the same loaded backend data.")).toBeTruthy();
    expect(screen.getByText("Runtime details")).toBeTruthy();
    expect(screen.getByText("Capability matrix")).toBeTruthy();
    expect(screen.queryByText(/"project"/)).toBeNull();
  });
});

describe("AdvancedDashboard technical sections", () => {
  it("switches to advanced mode without starting a duplicate request cycle", async () => {
    const testClient = client();
    renderToggleDashboard(testClient);

    expect(await screen.findByText("ArcLM is ready")).toBeTruthy();
    expect(testClient.getHealth).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole("button", { name: "Switch advanced" }));

    expect(await screen.findByText("Runtime details")).toBeTruthy();
    expect(testClient.getHealth).toHaveBeenCalledTimes(1);
    expect(testClient.getEnvironment).toHaveBeenCalledTimes(1);
    expect(testClient.getCapabilities).toHaveBeenCalledTimes(1);
    expect(testClient.getProjectStatus).toHaveBeenCalledTimes(1);
  });

  it("renders CPU runtime details with safe fallbacks and no private fields", async () => {
    window.localStorage.setItem("arclm-interface-mode", "advanced");
    const environment = { ...cpuEnvironment(), pytorch_version: null };
    renderDashboard(client({ getEnvironment: vi.fn().mockResolvedValue(environment) }));

    expect(await screen.findByText("ArcLM is ready")).toBeTruthy();
    expect(screen.getByText("3.12.10")).toBeTruthy();
    expect(screen.getAllByText("Not reported").length).toBeGreaterThan(0);
    expect(screen.queryByText(/Users/)).toBeNull();
    expect(screen.queryByText(/D:\\/)).toBeNull();
    expect(screen.queryByText(/API_KEY/)).toBeNull();
  });

  it("renders CUDA hardware details without false acceleration claims", async () => {
    window.localStorage.setItem("arclm-interface-mode", "advanced");
    renderDashboard(client({ getEnvironment: vi.fn().mockResolvedValue(cudaEnvironment()) }));

    await waitFor(() => expect(screen.getAllByText("NVIDIA GeForce GTX 1050 Ti").length).toBeGreaterThan(0));
    expect(screen.getByText("4.0 GB")).toBeTruthy();
    expect(screen.getByText("6.1")).toBeTruthy();
    expect(screen.getByText(/Correctness verification does not prove hardware acceleration/)).toBeTruthy();
    expect(screen.queryByText(/Tensor Core/i)).toBeNull();
  });

  it("renders grouped capability matrix and unknown statuses safely", async () => {
    window.localStorage.setItem("arclm-interface-mode", "advanced");
    const altered = capabilities();
    altered.training.ddp = { status: "planned", note: "Not implemented" };
    altered.web.backend.status = "brand_new_status" as CapabilitiesResponse["web"][string]["status"];
    renderDashboard(client({ getCapabilities: vi.fn().mockResolvedValue(altered) }));

    expect(await screen.findByText("ArcLM is ready")).toBeTruthy();
    expect(screen.getAllByText("Unknown status").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Training").length).toBeGreaterThan(0);
    expect(screen.getByText("Ddp")).toBeTruthy();
    expect(screen.queryByText(/DDP.*Available/)).toBeNull();
  });

  it("renders validation, integrations, limitations, and diagnostics", async () => {
    window.localStorage.setItem("arclm-interface-mode", "advanced");
    renderDashboard(client());

    expect(await screen.findByText("CUDA BF16 correctness")).toBeTruthy();
    expect(screen.getByText("Optional integrations")).toBeTruthy();
    expect(screen.getByText("Transformers")).toBeTruthy();
    expect(screen.getByText("PEFT")).toBeTruthy();
    expect(screen.getByText("Known limitations")).toBeTruthy();
    expect(screen.getByText("Single local GPU")).toBeTruthy();
    expect(screen.getByText("Backend diagnostics")).toBeTruthy();
    expect(screen.getByText("http://127.0.0.1:8765")).toBeTruthy();
  });

  it("shows endpoint failures and stale refresh state in diagnostics", async () => {
    window.localStorage.setItem("arclm-interface-mode", "advanced");
    const testClient = client({
      getHealth: vi.fn().mockResolvedValueOnce(health()).mockRejectedValueOnce(new Error("offline")),
      getEnvironment: vi.fn().mockRejectedValue(new Error("environment failed"))
    });
    renderDashboard(testClient);

    expect(await screen.findByText("ArcLM is ready")).toBeTruthy();
    expect(screen.getAllByText("failed").length).toBeGreaterThan(0);

    fireEvent.click(screen.getAllByRole("button", { name: "Refresh" })[0]);

    expect(await screen.findByText("ArcLM backend returned an error")).toBeTruthy();
    expect(screen.getByText("Displayed data may be stale")).toBeTruthy();
    expect(screen.getByText("Yes")).toBeTruthy();
  });

  it("opens the safe raw response inspector and copies JSON", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText }
    });
    window.localStorage.setItem("arclm-interface-mode", "advanced");
    renderDashboard(client());

    expect(await screen.findByText("Safe API response inspector")).toBeTruthy();
    expect(screen.queryByLabelText("Approved dashboard API response JSON")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "View API response" }));

    const codeRegion = await screen.findByLabelText("Approved dashboard API response JSON");
    expect(codeRegion.textContent).toContain('"health"');
    expect(codeRegion.textContent).toContain('"project_status"');
    expect(screen.queryByRole("textbox")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Copy JSON" }));

    await waitFor(() => expect(writeText).toHaveBeenCalled());
    expect(await screen.findByText("Copied API response.")).toBeTruthy();
  });
});
