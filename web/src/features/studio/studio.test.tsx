import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ReactElement } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AppProviders } from "@/providers/app-providers";
import type {
  DatasetManifestReportResponse,
  ProjectDatasetPreviewResponse,
  ProjectListResponse,
  StudioDatasetMetadata,
  StudioProject,
  StudioTokenizerMetadata,
  SystemStatusResponse,
  TokenizerInspectionResponse
} from "@/lib/api/schemas";
import {
  DataStudioPage,
  NewProjectPage,
  ProjectsPage,
  StudioOverviewPage,
  SystemPage,
  TokenizerLabPage
} from "./studio";
import { createApiClient } from "@/lib/api/client";

type StudioClient = ReturnType<typeof createApiClient>;

const project: StudioProject = {
  id: "project_abc123abc123",
  name: "Arabic Tiny LM",
  description: "Small Arabic language-model experiment.",
  created_at: 1,
  updated_at: 2,
  arclm_version: "0.9.0",
  status: "active",
  active_dataset_id: null,
  active_tokenizer_id: null
};

const dataset: StudioDatasetMetadata = {
  id: "dataset_abc123abc123",
  project_id: project.id,
  name: "training-data",
  source_type: "paste",
  original_filename: null,
  stored_format: "jsonl",
  created_at: 3,
  size_bytes: 128,
  record_count: 2,
  selected_format: "instruction_response",
  text_fields: ["instruction", "response"],
  validation_status: "not_validated",
  raw_filename: "dataset_abc123abc123_training.jsonl",
  validation_result: null,
  sft_validation_result: null
};

const tokenizer: StudioTokenizerMetadata = {
  id: "tokenizer_abc123abc123",
  project_id: project.id,
  name: "native-tokenizer",
  type: "native",
  vocab_size: 32,
  created_at: 4,
  source_dataset_id: dataset.id,
  special_tokens: {},
  status: "ready",
  tokenizer_filename: "tokenizer_abc123abc123.json"
};

function system(): SystemStatusResponse {
  return {
    arclm_version: "0.9.0",
    python_version: "3.12.10",
    pytorch_version: "2.13.0",
    operating_system: "Windows",
    cpu: null,
    cuda_available: false,
    cuda_version: null,
    gpu_name: null,
    gpu_count: 0,
    current_device: "cpu",
    optional_dependencies: {
      transformers: { package: "transformers", available: false },
      fastapi: { package: "fastapi", available: true }
    },
    backend_health: { status: "ok", service: "arclm-web-api", version: "0.9.0" },
    workspace: { available: true, project_count: 1, active_dataset_count: 1, active_tokenizer_count: 1 }
  };
}

function projectList(items: StudioProject[] = [project]): ProjectListResponse {
  return { projects: items, count: items.length };
}

function preview(): ProjectDatasetPreviewResponse {
  return {
    dataset,
    fields: ["instruction", "response"],
    total_records: 2,
    preview_limit: 20,
    truncated: false,
    records: [
      { index: 0, values: { instruction: "Explain tokenization.", response: "Tokenization creates token IDs." } }
    ]
  };
}

function report(): DatasetManifestReportResponse {
  return {
    manifest: {
      dataset_name: "training-data",
      source_type: "paste",
      manifest_version: 1
    },
    report: {
      record_count: 2,
      valid_records: 2,
      invalid_records: 0,
      token_count: 8,
      unknown_token_rate: 0,
      truncated_record_count: 0
    }
  };
}

function tokenizerInspection(): TokenizerInspectionResponse {
  return {
    text: "Explain tokenization.",
    tokens: ["Explain", "tokenization."],
    token_ids: [1, 2],
    token_count: 2,
    unknown_token_count: 0,
    decoded_text: "Explain tokenization.",
    round_trip_matches: true,
    tokenizer_class: "Tokenizer",
    vocab_size: 32,
    warnings: []
  };
}

function client(overrides: Partial<StudioClient> = {}): StudioClient {
  return {
    getSystemStatus: vi.fn().mockResolvedValue(system()),
    listProjects: vi.fn().mockResolvedValue(projectList()),
    createProject: vi.fn().mockResolvedValue(project),
    getProject: vi.fn().mockResolvedValue(project),
    deleteProject: vi.fn().mockResolvedValue(project),
    listProjectDatasets: vi.fn().mockResolvedValue({ datasets: [dataset], count: 1 }),
    pasteProjectDataset: vi.fn().mockResolvedValue(dataset),
    uploadProjectDataset: vi.fn().mockResolvedValue({ ...dataset, source_type: "upload", original_filename: "data.jsonl" }),
    getProjectDatasetPreview: vi.fn().mockResolvedValue(preview()),
    validateProjectDataset: vi.fn().mockResolvedValue({
      dataset: { ...dataset, validation_status: "valid" },
      validation: { total_records: 2, valid_count: 2, invalid_count: 0, issues: [] },
      sft_validation: null
    }),
    createProjectDatasetReport: vi.fn().mockResolvedValue(report()),
    deleteProjectDataset: vi.fn().mockResolvedValue(dataset),
    listProjectTokenizers: vi.fn().mockResolvedValue({ tokenizers: [tokenizer], count: 1 }),
    createNativeTokenizer: vi.fn().mockResolvedValue(tokenizer),
    inspectProjectTokenizer: vi.fn().mockResolvedValue(tokenizerInspection()),
    deleteProjectTokenizer: vi.fn().mockResolvedValue(tokenizer),
    ...overrides
  } as unknown as StudioClient;
}

function renderStudio(ui: ReactElement) {
  return render(<AppProviders>{ui}</AppProviders>);
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("ArcLM Studio pages", () => {
  it("renders overview with real system and project data", async () => {
    renderStudio(<StudioOverviewPage client={client()} />);

    expect(await screen.findByText("ArcLM Studio")).toBeTruthy();
    expect(screen.getByText("ArcLM 0.9.0")).toBeTruthy();
    expect(screen.getByText("1 projects")).toBeTruthy();
    expect(screen.getByText("Arabic Tiny LM")).toBeTruthy();
  });

  it("shows backend unavailable state", async () => {
    renderStudio(<StudioOverviewPage client={client({ getSystemStatus: vi.fn().mockRejectedValue(new Error("offline")) })} />);

    expect(await screen.findByText("Backend unavailable")).toBeTruthy();
    expect(screen.getByText("offline")).toBeTruthy();
  });

  it("renders projects empty state and create-project form", async () => {
    renderStudio(<ProjectsPage client={client({ listProjects: vi.fn().mockResolvedValue(projectList([])) })} />);
    expect(await screen.findByText("No projects yet")).toBeTruthy();

    const api = client();
    renderStudio(<NewProjectPage client={api} />);
    fireEvent.change(screen.getByLabelText(/Project name/), { target: { value: "Arabic Tiny LM" } });
    fireEvent.change(screen.getByLabelText("Description"), { target: { value: "Small project" } });
    fireEvent.click(screen.getByRole("button", { name: "Create project" }));

    await waitFor(() => expect(api.createProject).toHaveBeenCalledWith({ name: "Arabic Tiny LM", description: "Small project" }));
    expect(await screen.findByText(/Open Arabic Tiny LM/)).toBeTruthy();
  });

  it("requires confirmation before deleting projects", async () => {
    const api = client();
    vi.spyOn(window, "prompt").mockReturnValue(project.name);
    renderStudio(<ProjectsPage client={api} />);

    expect(await screen.findByText("Arabic Tiny LM")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));

    await waitFor(() => expect(api.deleteProject).toHaveBeenCalledWith(project.id, { confirm: true, confirm_name: project.name }));
  });

  it("supports pasted dataset, upload, preview, validation and reports", async () => {
    const api = client();
    renderStudio(<DataStudioPage projectId={project.id} client={api} />);

    expect(await screen.findByText("training-data")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Add pasted data" }));
    await waitFor(() => expect(api.pasteProjectDataset).toHaveBeenCalled());

    const file = new File(['{"instruction":"Hi","response":"Hello"}\n'], "data.jsonl", { type: "application/jsonl" });
    fireEvent.change(screen.getByLabelText("Upload dataset file"), { target: { files: [file] } });
    await waitFor(() => expect(api.uploadProjectDataset).toHaveBeenCalled());

    fireEvent.click(screen.getByRole("button", { name: "Preview" }));
    expect(await screen.findByText("Explain tokenization.")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Validate" }));
    expect(await screen.findByText("Validation passed")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Generate report" }));
    expect(await screen.findByText("Manifest JSON")).toBeTruthy();

    vi.spyOn(window, "confirm").mockReturnValue(true);
    fireEvent.click(screen.getByRole("button", { name: "Delete dataset" }));
    await waitFor(() => expect(api.deleteProjectDataset).toHaveBeenCalledWith(project.id, dataset.id));
  });

  it("creates and inspects native tokenizers", async () => {
    const api = client();
    renderStudio(<TokenizerLabPage projectId={project.id} client={api} />);

    expect(await screen.findByText(/native-tokenizer/)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Create native tokenizer" }));
    await waitFor(() => expect(api.createNativeTokenizer).toHaveBeenCalled());

    fireEvent.click(screen.getByRole("button", { name: "Inspect text" }));
    expect(await screen.findByText("Tokenizer inspection")).toBeTruthy();
    expect(screen.getByText("Explain")).toBeTruthy();
    expect(screen.getAllByText("2").length).toBeGreaterThan(0);

    vi.spyOn(window, "confirm").mockReturnValue(true);
    fireEvent.click(screen.getByRole("button", { name: "Delete tokenizer" }));
    await waitFor(() => expect(api.deleteProjectTokenizer).toHaveBeenCalledWith(project.id, tokenizer.id));
  });

  it("renders system status without sensitive paths", async () => {
    renderStudio(<SystemPage client={client()} />);

    expect(await screen.findByText("Runtime")).toBeTruthy();
    expect(screen.getByText("0.9.0")).toBeTruthy();
    expect(screen.getByText("transformers")).toBeTruthy();
    expect(screen.queryByText(/Users/)).toBeNull();
  });
});
