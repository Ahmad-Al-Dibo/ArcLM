import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AppProviders } from "@/providers/app-providers";
import { ApiClientError } from "@/lib/api/client";
import type { DatasetInspectionResponse, DatasetListResponse, DatasetRootListResponse, DatasetSummary } from "@/lib/api/schemas";
import type { DatasetClient } from "./dataset-types";
import { DatasetInspector } from "./dataset-inspector";

const datasetA: DatasetSummary = {
  dataset_id: "dataset_alpha123",
  name: "instructions.jsonl",
  format: "jsonl",
  size_bytes: 482_194
};

const datasetB: DatasetSummary = {
  dataset_id: "dataset_beta456",
  name: "notes.txt",
  format: "txt",
  size_bytes: 42
};

function datasetList(datasets: DatasetSummary[] = [datasetA, datasetB]): DatasetListResponse {
  return { datasets, count: datasets.length };
}

const rootList: DatasetRootListResponse = {
  roots: [
    {
      root_id: "root_training",
      name: "Training Data",
      path: "D:\\ArcLM\\data\\training",
      enabled: true,
      recursive: false,
      source_origin: "persisted",
      validation_status: "valid",
      supported_file_count: 2,
      ignored_file_count: 0,
      warnings: [],
      removable: true,
      editable: true
    }
  ],
  count: 1,
  active_count: 1,
  datasets_found: 2,
  warnings: []
};

function inspection(overrides: Partial<DatasetInspectionResponse> = {}): DatasetInspectionResponse {
  return {
    dataset_id: datasetA.dataset_id,
    name: datasetA.name,
    format: "jsonl",
    size_bytes: datasetA.size_bytes,
    encoding: "utf-8",
    fields: [
      { name: "text", type: "string", nullable: false, observed_in_rows: 3, missing_count: 0, empty_count: 1 },
      { name: "score", type: "number", nullable: true, observed_in_rows: 2, missing_count: 1, empty_count: 0 },
      { name: "mixed_value", type: "mixed", nullable: true, observed_in_rows: 3, missing_count: 0, empty_count: 0 },
      { name: "metadata", type: "object", nullable: false, observed_in_rows: 1, missing_count: 2, empty_count: 0 },
      { name: "tags", type: "array", nullable: false, observed_in_rows: 1, missing_count: 2, empty_count: 0 },
      { name: "approved", type: "boolean", nullable: false, observed_in_rows: 1, missing_count: 2, empty_count: 0 },
      { name: "nothing", type: "null", nullable: true, observed_in_rows: 1, missing_count: 2, empty_count: 0 }
    ],
    preview_rows: [
      {
        row_id: "0",
        values: {
          text: "Hello Unicode ć",
          score: 1.25,
          mixed_value: "<strong>plain text</strong>",
          metadata: { source: "fixture" },
          tags: ["a", "b"],
          approved: true,
          nothing: null
        }
      },
      {
        row_id: "1",
        values: {
          text: "",
          score: null,
          mixed_value: "x".repeat(80),
          metadata: { nested: { value: "bounded" } },
          tags: [],
          approved: false,
          nothing: null
        }
      }
    ],
    statistics: {
      rows_scanned: 10_000,
      row_count: null,
      row_count_scope: "bounded_scan",
      field_count: 7,
      field_count_scope: "sample",
      invalid_row_count: 1,
      duplicate_count: 2,
      duplicate_scope: "bounded_scan",
      text_lengths: { min: 0, max: 15, average: 7.5 }
    },
    metadata: {
      scanned_rows: 10_000,
      preview_rows: 2,
      scan_limit: 10_000,
      preview_limit: 20,
      max_field_length: 2_000,
      max_fields: 200,
      truncated: true,
      complete: false,
      schema_source: "sample"
    },
    warnings: [
      { code: "scan_limit_reached", message: "Statistics are based on the first 10000 rows." },
      { code: "mixed_field_types", message: "One or more fields contain mixed value types." },
      { code: "new_warning", message: "A future warning still renders." }
    ],
    ...overrides
  };
}

function client(overrides: Partial<DatasetClient> = {}): DatasetClient {
  return {
    getDatasets: vi.fn().mockResolvedValue(datasetList()),
    getDatasetInspection: vi.fn().mockResolvedValue(inspection()),
    getDatasetRoots: vi.fn().mockResolvedValue(rootList),
    addDatasetRoot: vi.fn().mockResolvedValue(rootList.roots[0]),
    updateDatasetRoot: vi.fn().mockResolvedValue(rootList.roots[0]),
    removeDatasetRoot: vi.fn().mockResolvedValue(rootList.roots[0]),
    validateDatasetRoot: vi.fn().mockResolvedValue(rootList.roots[0]),
    refreshDatasets: vi.fn().mockResolvedValue({ roots_scanned: 1, datasets_found: 2, warnings: [] }),
    ...overrides
  };
}

function renderInspector(testClient: DatasetClient) {
  return render(
    <AppProviders>
      <DatasetInspector client={testClient} />
    </AppProviders>
  );
}

async function expectBoundedInspection() {
  await waitFor(() => expect(screen.getAllByText("Bounded inspection").length).toBeGreaterThan(0));
}

afterEach(() => {
  window.localStorage.clear();
  window.history.replaceState({}, "", "/data");
  vi.restoreAllMocks();
});

describe("DatasetInspector loading states", () => {
  it("renders loading and then the dataset catalogue", async () => {
    renderInspector(client());

    expect(screen.getByLabelText("Loading dataset catalogue")).toBeTruthy();
    expect(await screen.findByText("Training Data")).toBeTruthy();
    expect(await screen.findByText("instructions.jsonl")).toBeTruthy();
    expect(screen.getByText("JSONL - 470.9 KB")).toBeTruthy();
  });

  it("renders disconnected backend state with the approved command", async () => {
    renderInspector(client({ getDatasets: vi.fn().mockRejectedValue(new ApiClientError("offline", "disconnected")) }));

    expect(await screen.findByText("ArcLM backend is not connected")).toBeTruthy();
    expect(screen.getByText("python -m arclm web-api --dataset-root workspace=./data")).toBeTruthy();
  });

  it("renders empty catalogue separately from disconnected state", async () => {
    renderInspector(client({ getDatasets: vi.fn().mockResolvedValue(datasetList([])) }));

    expect(await screen.findByText("No datasets are available")).toBeTruthy();
    expect(screen.getByText("Supported formats: TXT, CSV, JSON, JSONL.")).toBeTruthy();
    expect(screen.queryByText("ArcLM backend is not connected")).toBeNull();
  });

  it("adds, disables, and removes dataset sources without claiming file deletion", async () => {
    const testClient = client();
    renderInspector(testClient);

    fireEvent.change(await screen.findByLabelText(/Source name/), { target: { value: "Evaluation Data" } });
    fireEvent.change(screen.getByLabelText(/Folder path/), { target: { value: "D:\\ArcLM\\data\\eval" } });
    fireEvent.click(screen.getByRole("button", { name: "Add dataset folder" }));

    await waitFor(() => expect(testClient.addDatasetRoot).toHaveBeenCalledWith({
      name: "Evaluation Data",
      path: "D:\\ArcLM\\data\\eval",
      recursive: false
    }));

    fireEvent.click(screen.getByRole("switch", { name: /Enabled/ }));
    await waitFor(() => expect(testClient.updateDatasetRoot).toHaveBeenCalledWith("root_training", { enabled: false }));

    fireEvent.click(screen.getByRole("button", { name: "Remove" }));
    expect(await screen.findByRole("dialog", { name: "Remove this dataset source from ArcLM?" })).toBeTruthy();
    expect(screen.getByText("The folder and its files will not be deleted.")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Remove source" }));
    await waitFor(() => expect(testClient.removeDatasetRoot).toHaveBeenCalledWith("root_training"));
  });

  it("shows root management unavailable separately from an empty catalogue", async () => {
    renderInspector(client({ getDatasetRoots: vi.fn().mockRejectedValue(new ApiClientError("disabled", "dataset_source_management_disabled", 403)) }));

    expect(await screen.findByText("Dataset source management is unavailable")).toBeTruthy();
  });
});

describe("DatasetInspector selection and URL state", () => {
  it("selects a dataset, updates the URL, and renders inspection sections", async () => {
    const testClient = client();
    renderInspector(testClient);

    fireEvent.click(await screen.findByRole("button", { name: /instructions\.jsonl/ }));

    await expectBoundedInspection();
    expect(window.location.search).toBe(`?dataset=${datasetA.dataset_id}`);
    expect(testClient.getDatasetInspection).toHaveBeenCalledWith(datasetA.dataset_id);
    expect(screen.getAllByText("Detected fields").length).toBeGreaterThan(0);
    expect(screen.getByText("Quality statistics")).toBeTruthy();
  });

  it("loads direct URL selection and supports browser back state", async () => {
    window.history.replaceState({}, "", `/data?dataset=${datasetA.dataset_id}`);
    renderInspector(client());

    await expectBoundedInspection();
    window.history.pushState({}, "", "/data");
    fireEvent.popState(window);

    expect(await screen.findByText("Select a dataset")).toBeTruthy();
  });

  it("handles unknown and invalid dataset IDs without path requests", async () => {
    window.history.replaceState({}, "", "/data?dataset=../secret.txt");
    const testClient = client();
    renderInspector(testClient);

    expect(await screen.findByText("Invalid dataset selection")).toBeTruthy();
    expect(testClient.getDatasetInspection).not.toHaveBeenCalled();
    expect(window.location.search).toBe("");
  });
});

describe("DatasetInspector inspection content", () => {
  it("renders summary, scope, schema, and statistics without total-row overclaiming", async () => {
    renderInspector(client());
    fireEvent.click(await screen.findByRole("button", { name: /instructions\.jsonl/ }));

    await waitFor(() => expect(screen.getAllByText("Rows scanned").length).toBeGreaterThan(0));
    expect(screen.queryByText("Total rows")).toBeNull();
    expect(screen.getByText("String")).toBeTruthy();
    expect(screen.getByText("Number")).toBeTruthy();
    expect(screen.getAllByText("Mixed").length).toBeGreaterThan(0);
    expect(screen.getByText("Duplicates in inspected rows")).toBeTruthy();
    expect(screen.getByText("7.5")).toBeTruthy();
  });

  it("renders preview values safely and opens row details", async () => {
    renderInspector(client());
    fireEvent.click(await screen.findByRole("button", { name: /instructions\.jsonl/ }));

    expect(await screen.findByText("Hello Unicode ć")).toBeTruthy();
    expect(screen.getAllByText("Null").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Empty").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Object").length).toBeGreaterThan(0);
    expect(screen.getByText("Array (2)")).toBeTruthy();
    expect(screen.queryByRole("img")).toBeNull();

    fireEvent.click(screen.getAllByRole("button", { name: "View row" })[0]);

    expect(await screen.findByRole("dialog", { name: "Preview row 0" })).toBeTruthy();
    expect(screen.getByLabelText("Preview row values").textContent).toContain("<strong>plain text</strong>");
  });

  it("renders known and unknown warnings with advanced codes only in advanced mode", async () => {
    const simpleRender = renderInspector(client());
    fireEvent.click(await screen.findByRole("button", { name: /instructions\.jsonl/ }));

    expect(await screen.findByText("Scan limit reached")).toBeTruthy();
    expect(screen.getByText("Dataset inspection warning")).toBeTruthy();
    expect(screen.queryByText("new_warning")).toBeNull();
    simpleRender.unmount();

    window.localStorage.setItem("arclm-interface-mode", "advanced");
    renderInspector(client());
    fireEvent.click(await screen.findByRole("button", { name: /instructions\.jsonl/ }));

    expect(await screen.findByText("new_warning")).toBeTruthy();
    expect(screen.getAllByText(datasetA.dataset_id).length).toBeGreaterThan(0);
  });

  it("supports exact inspection and empty schema states", async () => {
    renderInspector(
      client({
        getDatasetInspection: vi.fn().mockResolvedValue(
          inspection({
            fields: [],
            preview_rows: [],
            warnings: [],
            statistics: {
              rows_scanned: 0,
              row_count: 0,
              row_count_scope: "exact",
              field_count: 0,
              field_count_scope: "sample",
              invalid_row_count: 0,
              duplicate_count: 0,
              duplicate_scope: "bounded_scan",
              text_lengths: { min: null, max: null, average: null }
            },
            metadata: { ...inspection().metadata, scanned_rows: 0, preview_rows: 0, truncated: false, complete: true, schema_source: "empty" }
          })
        )
      })
    );
    fireEvent.click(await screen.findByRole("button", { name: /instructions\.jsonl/ }));

    await waitFor(() => expect(screen.getAllByText("Complete inspection").length).toBeGreaterThan(0));
    expect(screen.getByText("No fields detected")).toBeTruthy();
    expect(screen.getByText("No preview rows")).toBeTruthy();
    expect(screen.getByText("No inspection warnings")).toBeTruthy();
  });
});

describe("DatasetInspector refresh behavior", () => {
  it("retains the selected dataset on refresh and prevents duplicate refreshes", async () => {
    const delayed = new Promise<DatasetListResponse>((resolve) => {
      window.setTimeout(() => resolve(datasetList()), 20);
    });
    const testClient = client({
      getDatasets: vi.fn().mockResolvedValueOnce(datasetList()).mockReturnValueOnce(delayed).mockResolvedValueOnce(datasetList())
    });
    renderInspector(testClient);
    fireEvent.click(await screen.findByRole("button", { name: /instructions\.jsonl/ }));

    fireEvent.click(screen.getByRole("button", { name: "Refresh" }));
    fireEvent.click(screen.getByRole("button", { name: "Refreshing" }));

    await waitFor(() => expect(testClient.getDatasets).toHaveBeenCalledTimes(2));
    await expectBoundedInspection();
  });

  it("clears selection when a selected dataset is removed", async () => {
    const testClient = client({
      getDatasets: vi.fn().mockResolvedValueOnce(datasetList()).mockResolvedValueOnce(datasetList([datasetB]))
    });
    renderInspector(testClient);
    fireEvent.click(await screen.findByRole("button", { name: /instructions\.jsonl/ }));

    await expectBoundedInspection();
    fireEvent.click(screen.getByRole("button", { name: "Refresh" }));

    expect(await screen.findByText("Select a dataset")).toBeTruthy();
    expect(window.location.search).toBe("");
  });

  it("marks stale data when refresh fails", async () => {
    const testClient = client({
      getDatasets: vi.fn().mockResolvedValueOnce(datasetList()).mockRejectedValueOnce(new Error("refresh failed"))
    });
    renderInspector(testClient);
    fireEvent.click(await screen.findByRole("button", { name: /instructions\.jsonl/ }));

    await expectBoundedInspection();
    fireEvent.click(screen.getByRole("button", { name: "Refresh" }));

    expect(await screen.findByText("Displayed data may be stale")).toBeTruthy();
    expect(screen.getAllByText("Bounded inspection").length).toBeGreaterThan(0);
  });
});
