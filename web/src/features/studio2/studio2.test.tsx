import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ReactElement } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AppProviders } from "@/providers/app-providers";
import { createApiClient } from "@/lib/api/client";
import type { StudioDatasetMetadata, StudioModelMetadata, StudioRunMetadata, StudioTokenizerMetadata } from "@/lib/api/schemas";
import { FineTuningStudioPage } from "./finetuning-studio";
import { ModelBuilderPage } from "./model-builder";
import { PretrainingStudioPage } from "./pretraining-studio";
import { RunDetailsPage } from "./run-details";
import { RunsPage } from "./runs-page";
import { TrainingStudioPage } from "./training-studio";

type StudioClient = ReturnType<typeof createApiClient>;

const dataset: StudioDatasetMetadata = {
  id: "dataset_abc123abc123",
  project_id: "project_abc123abc123",
  name: "training-data",
  source_type: "paste",
  original_filename: null,
  stored_format: "jsonl",
  created_at: 1,
  size_bytes: 100,
  record_count: 2,
  selected_format: "instruction_response",
  text_fields: ["instruction", "response"],
  validation_status: "valid",
  raw_filename: "dataset.jsonl",
  validation_result: null,
  sft_validation_result: null
};

const tokenizer: StudioTokenizerMetadata = {
  id: "tokenizer_abc123abc123",
  project_id: "project_abc123abc123",
  name: "native-tokenizer",
  type: "native",
  vocab_size: 32,
  created_at: 2,
  source_dataset_id: dataset.id,
  special_tokens: {},
  status: "ready",
  tokenizer_filename: "tokenizer.json"
};

const model: StudioModelMetadata = {
  id: "model_abc123abc123",
  project_id: "project_abc123abc123",
  name: "tiny-model",
  source: "native_arclm",
  task: "causal_language_modeling",
  status: "configured",
  created_at: 3,
  updated_at: 3,
  tokenizer_id: tokenizer.id,
  dataset_id: dataset.id,
  configuration: { vocab_size: 32, embed_dim: 8, block_size: 8, num_blocks: 1, dropout: 0 },
  parameter_count: 2048,
  estimated_memory: { warnings: ["Training-memory estimates are approximate."] },
  capabilities: { can_train: true }
};

const run: StudioRunMetadata = {
  id: "run_abc123abc123",
  project_id: "project_abc123abc123",
  name: "Native Studio training",
  status: "running",
  training_type: "native_causal_lm",
  training_mode: "pretraining",
  fine_tuning_method: null,
  base_checkpoint_id: null,
  created_at: 4,
  updated_at: 5,
  started_at: 4,
  completed_at: null,
  dataset_id: dataset.id,
  tokenizer_id: tokenizer.id,
  model_id: model.id,
  current_epoch: 0,
  total_epochs: 1,
  current_step: 1,
  total_steps: 2,
  latest_metrics: { training_loss: 1.2 },
  latest_checkpoint_id: null,
  device: "cpu",
  dtype: "fp32",
  error: null,
  warnings: [],
  configuration: { epochs: 1, batch_size: 1, learning_rate: 0.001 }
};

function client(overrides: Partial<StudioClient> = {}): StudioClient {
  return {
    listProjectDatasets: vi.fn().mockResolvedValue({ datasets: [dataset], count: 1 }),
    listProjectTokenizers: vi.fn().mockResolvedValue({ tokenizers: [tokenizer], count: 1 }),
    listProjectModels: vi.fn().mockResolvedValue({ models: [model], count: 1 }),
    estimateNativeModel: vi.fn().mockResolvedValue({
      valid: true,
      configuration: model.configuration,
      parameter_count: model.parameter_count,
      estimated_memory: model.estimated_memory,
      capabilities: model.capabilities,
      warnings: ["Native ArcLM uses fixed attention heads."]
    }),
    createNativeModel: vi.fn().mockResolvedValue(model),
    createProjectRun: vi.fn().mockResolvedValue(run),
    validateProjectPretraining: vi.fn().mockResolvedValue({
      valid: true,
      training_mode: "pretraining",
      fine_tuning_method: null,
      compatibility: { status: "ready", vocabulary_compatible: true },
      warnings: [],
      errors: []
    }),
    validateProjectFinetuning: vi.fn().mockResolvedValue({
      valid: true,
      training_mode: "fine_tuning",
      fine_tuning_method: "sft",
      compatibility: { status: "ready", vocabulary_compatible: true, model_vocabulary_size: 32, tokenizer_vocabulary_size: 32 },
      warnings: ["Formatting tags are inserted as text and are not registered as tokenizer special tokens."],
      errors: []
    }),
    previewProjectFinetuning: vi.fn().mockResolvedValue({
      valid: true,
      training_mode: "fine_tuning",
      fine_tuning_method: "sft",
      compatibility: { status: "ready", vocabulary_compatible: true, model_vocabulary_size: 32, tokenizer_vocabulary_size: 32 },
      warnings: ["Formatting tags are inserted as text and are not registered as tokenizer special tokens."],
      errors: [],
      format_fingerprint: "fmt_test",
      preview_configuration_fingerprint: "fmt_test",
      formatting: { dataset_format: "instruction_response", format_fingerprint: "fmt_test", preview_configuration_fingerprint: "fmt_test" },
      records: [{
        index: 0,
        original_record: { instruction: "What is ArcLM?", response: "A native-first learning library." },
        formatted_text: "<|instruction|> What is ArcLM?\n<|response|> A native-first learning library.\n<|end|>",
        tokens: ["<|instruction|>", "What", "is", "ArcLM?"],
        token_ids: [1, 2, 3, 4],
        labels: [-100, -100, 3, 4],
        label_mask: ["ignore", "ignore", "train", "train"],
        sequence_length: 4,
        truncated: false,
        unknown_token_count: 0,
        special_tags_detected: ["<|instruction|>", "<|response|>", "<|end|>"]
      }]
    }),
    listProjectRuns: vi.fn().mockResolvedValue({ runs: [run, { ...run, id: "run_done123456", status: "completed" }], count: 2 }),
    getProjectRun: vi.fn().mockResolvedValue(run),
    getProjectRunMetrics: vi.fn().mockResolvedValue({ items: [{ step: 1, training_loss: 1.2 }], count: 1 }),
    getProjectRunEvents: vi.fn().mockResolvedValue({ items: [{ code: "training_started", message: "Training started." }], count: 1 }),
    listProjectRunCheckpoints: vi.fn().mockResolvedValue({ checkpoints: [{ id: "checkpoint-1", step: 1, has_optimizer_state: true }], count: 1 }),
    listProjectCheckpoints: vi.fn().mockResolvedValue({ checkpoints: [{ id: "checkpoint-1", name: "checkpoint-1", step: 1, model_id: model.id, tokenizer_id: tokenizer.id, reload_status: "compatible" }], count: 1 }),
    cancelProjectRun: vi.fn().mockResolvedValue({ ...run, status: "cancelling" }),
    ...overrides
  } as unknown as StudioClient;
}

function renderStudio(ui: ReactElement) {
  return render(<AppProviders>{ui}</AppProviders>);
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("ArcLM Studio 2 pages", () => {
  it("validates, estimates and saves native model configurations", async () => {
    const api = client();
    renderStudio(<ModelBuilderPage projectId="project_abc123abc123" client={api} />);

    expect(await screen.findByText("Native Model Builder")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Validate and estimate" }));
    await waitFor(() => expect(api.estimateNativeModel).toHaveBeenCalled());
    expect(await screen.findByText("2048")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Save model configuration" }));
    await waitFor(() => expect(api.createNativeModel).toHaveBeenCalled());
    expect(await screen.findByText("Model saved")).toBeTruthy();
  });

  it("shows separate training choices in the Training Center", async () => {
    const api = client();
    renderStudio(<TrainingStudioPage projectId="project_abc123abc123" client={api} />);

    expect(await screen.findByText("Training Center")).toBeTruthy();
    expect(screen.getByText("Pre-Training")).toBeTruthy();
    expect(screen.getByText("Fine-Tuning")).toBeTruthy();
    expect(screen.getByText("Open Pre-Training")).toBeTruthy();
    expect(screen.getByText("Open Fine-Tuning")).toBeTruthy();
  });

  it("starts a pre-training run with explicit mode metadata", async () => {
    const api = client();
    renderStudio(<PretrainingStudioPage projectId="project_abc123abc123" client={api} />);

    expect(await screen.findByText("Pre-Training Studio")).toBeTruthy();
    expect(screen.getByText("Compatible")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Start pre-training run" }));
    await waitFor(() => expect(api.createProjectRun).toHaveBeenCalledWith("project_abc123abc123", expect.objectContaining({
      training_mode: "pretraining",
      tokenizer_id: tokenizer.id,
      model_id: model.id
    })));
    expect(await screen.findByText("Open run")).toBeTruthy();
  });

  it("disables training start on tokenizer/model mismatch", async () => {
    const api = client({
      listProjectTokenizers: vi.fn().mockResolvedValue({ tokenizers: [{ ...tokenizer, id: "tokenizer_other1234" }], count: 1 })
    });
    renderStudio(<PretrainingStudioPage projectId="project_abc123abc123" client={api} />);

    expect((await screen.findAllByText("Tokenizer/model mismatch")).length).toBeGreaterThan(0);
    expect((screen.getByRole("button", { name: "Start pre-training run" }) as HTMLButtonElement).disabled).toBe(true);
  });

  it("previews fine-tuning formatting and starts an SFT run", async () => {
    const api = client();
    renderStudio(<FineTuningStudioPage projectId="project_abc123abc123" client={api} />);

    expect(await screen.findByText("Fine-Tuning Studio")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Preview formatting" }));
    await waitFor(() => expect(api.previewProjectFinetuning).toHaveBeenCalledWith("project_abc123abc123", expect.objectContaining({
      fine_tuning_method: "sft",
      dataset_id: dataset.id,
      tokenizer_id: tokenizer.id,
      formatting: expect.objectContaining({
        dataset_format: "instruction_response",
        instruction_tag: "<|instruction|>",
        response_tag: "<|response|>",
        end_tag: "<|end|>",
        train_on_response_only: true
      })
    })));
    expect(await screen.findByText("Preview record 1")).toBeTruthy();
    expect(screen.getByText("Response tokens trained; prompt tokens ignored")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Start fine-tuning run" }));
    await waitFor(() => expect(api.createProjectRun).toHaveBeenCalledWith("project_abc123abc123", expect.objectContaining({
      training_mode: "fine_tuning",
      fine_tuning_method: "sft",
      fine_tuning_format: expect.objectContaining({ dataset_format: "instruction_response", format_fingerprint: "fmt_test" }),
      preview_configuration_fingerprint: "fmt_test"
    })));
  });

  it("renders run list and run details with metrics, events, checkpoints and cancellation", async () => {
    const api = client();
    renderStudio(<RunsPage projectId="project_abc123abc123" client={api} />);

    expect((await screen.findAllByText("Native Studio training")).length).toBeGreaterThan(0);
    expect(screen.getAllByText("Pre-Training").length).toBeGreaterThan(0);
    expect(screen.getAllByText("1/2").length).toBeGreaterThan(0);

    vi.spyOn(window, "confirm").mockReturnValue(true);
    const details = renderStudio(<RunDetailsPage projectId="project_abc123abc123" runId={run.id} client={api} />);
    expect(await screen.findByText("Run details, metrics, events and checkpoint metadata.")).toBeTruthy();
    expect(details.container.textContent).toContain("training_loss");
    expect(details.container.textContent).toContain("checkpoint-1");
    fireEvent.click(screen.getByRole("button", { name: "Cancel run" }));
    await waitFor(() => expect(api.cancelProjectRun).toHaveBeenCalledWith("project_abc123abc123", run.id));
  });
});
