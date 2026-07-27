import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ReactElement } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createApiClient } from "@/lib/api/client";
import { AppProviders } from "@/providers/app-providers";
import { CheckpointDetailsPage } from "./checkpoint-details";
import { CheckpointInspectionPage } from "./checkpoint-inspection";
import { CheckpointsPage } from "./checkpoints-page";
import { EvaluationDetailsPage } from "@/features/evaluation/evaluation-details";
import { EvaluationStudioPage } from "@/features/evaluation/evaluation-studio";
import { EvaluationsPage } from "@/features/evaluation/evaluations-page";
import { GenerationPlaygroundPage } from "@/features/generation/generation-playground";

type StudioClient = ReturnType<typeof createApiClient>;

const projectId = "project_abc123abc123";
const checkpoint = {
  id: "ckpt_abc123abc123_1",
  project_id: projectId,
  run_id: "run_abc123abc123",
  name: "checkpoint-1",
  reload_status: "compatible",
  step: 1,
  epoch: 1,
  size_bytes: 1234,
  model_id: "model_abc123abc123",
  dataset_id: "dataset_abc123abc123",
  tokenizer_id: "tokenizer_abc123abc123",
  architecture: "ArcLM",
  model_task: "causal_language_modeling",
  has_optimizer_state: true,
  has_scheduler_state: true,
  has_rng_state: true,
  metrics: { training_loss: 1.2 },
  model: { configuration: { block_size: 8 } },
  warnings: []
};

const dataset = {
  id: "dataset_abc123abc123",
  name: "training-data",
  project_id: projectId,
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

const tokenizer = {
  id: "tokenizer_abc123abc123",
  name: "native-tokenizer",
  project_id: projectId,
  type: "native",
  tokenizer_type: "word",
  sentencepiece_model_type: null,
  vocab_size: 32,
  created_at: 1,
  source_dataset_id: dataset.id,
  special_tokens: {},
  status: "ready",
  tokenizer_filename: "tokenizer.json"
};

const evaluation = {
  id: "evaluation_abc123abc123",
  checkpoint_id: checkpoint.id,
  dataset_id: dataset.id,
  tokenizer_id: tokenizer.id,
  status: "completed",
  example_count: 2,
  token_count: 12,
  metrics: { loss: 1.1, perplexity: 3.0, accuracy: 0.5 },
  device: "cpu",
  precision: "fp32",
  configuration: {}
};

const generation = {
  id: "generation_abc123abc123",
  checkpoint_id: checkpoint.id,
  prompt: "Explain ArcLM.",
  generated_text: "Explain ArcLM. native",
  input_token_count: 2,
  generated_token_count: 1,
  elapsed_seconds: 0.1,
  tokens_per_second: 10,
  device: "cpu"
};

function client(overrides: Partial<StudioClient> = {}): StudioClient {
  return {
    listProjectCheckpoints: vi.fn().mockResolvedValue({ checkpoints: [checkpoint], count: 1 }),
    getProjectCheckpoint: vi.fn().mockResolvedValue({ checkpoint }),
    validateProjectCheckpoint: vi.fn().mockResolvedValue({ valid: true, checkpoint, reload_status: "compatible", warnings: [] }),
    deleteProjectCheckpoint: vi.fn().mockResolvedValue({ checkpoint }),
    inspectProjectCheckpoint: vi.fn().mockResolvedValue({
      input_text: "Explain ArcLM.",
      tokens: ["Explain", "ArcLM."],
      token_ids: [1, 2],
      sequence_length: 2,
      input_shape: [1, 2],
      embedding_shape: [1, 2, 8],
      logits_shape: [1, 2, 32],
      selected_token_id: 3,
      selected_token: "native",
      generated_text: "Explain ArcLM. native",
      device: "cpu",
      dtype: "torch.float32",
      model_class: "ArcLM",
      tokenizer_class: "Tokenizer",
      inspected_steps: 1,
      generation_steps: 1,
      attention_available: false,
      attention_note: "Not available",
      warnings: [],
      values: null
    }),
    listProjectDatasets: vi.fn().mockResolvedValue({ datasets: [dataset], count: 1 }),
    listProjectTokenizers: vi.fn().mockResolvedValue({ tokenizers: [tokenizer], count: 1 }),
    createProjectEvaluation: vi.fn().mockResolvedValue({ evaluation }),
    listProjectEvaluations: vi.fn().mockResolvedValue({ evaluations: [evaluation], count: 1 }),
    getProjectEvaluation: vi.fn().mockResolvedValue({ evaluation }),
    getProjectEvaluationEvents: vi.fn().mockResolvedValue({ items: [{ code: "evaluation_completed" }], count: 1 }),
    getProjectEvaluationReport: vi.fn().mockResolvedValue({ report: { metrics: evaluation.metrics, num_examples: 2, num_tokens: 12 } }),
    cancelProjectEvaluation: vi.fn().mockResolvedValue({ evaluation: { ...evaluation, status: "cancelling" } }),
    compareProjectEvaluations: vi.fn().mockResolvedValue({ compatible: true, warnings: [], rows: [], csv: "evaluation_id,loss\n" }),
    listProjectGenerations: vi.fn().mockResolvedValue({ generations: [generation], count: 1 }),
    createProjectGeneration: vi.fn().mockResolvedValue({ generation }),
    getProjectGeneration: vi.fn().mockResolvedValue({ generation }),
    deleteProjectGeneration: vi.fn().mockResolvedValue({ generation }),
    ...overrides
  } as unknown as StudioClient;
}

function renderStudio(ui: ReactElement) {
  return render(<AppProviders>{ui}</AppProviders>);
}

afterEach(() => {
  vi.restoreAllMocks();
  cleanup();
});

describe("ArcLM Studio 3 pages", () => {
  it("renders checkpoint list, details, validation and deletion", async () => {
    const api = client();
    const checkpointList = renderStudio(<CheckpointsPage projectId={projectId} client={api} />);
    expect(await screen.findByText("Checkpoint Manager")).toBeTruthy();
    expect(screen.getByText("checkpoint-1")).toBeTruthy();
    checkpointList.unmount();

    vi.spyOn(window, "confirm").mockReturnValue(true);
    renderStudio(<CheckpointDetailsPage projectId={projectId} checkpointId={checkpoint.id} client={api} />);
    expect(await screen.findByText("Native checkpoint metadata, compatibility and safe actions.")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Validate" }));
    await waitFor(() => expect(api.validateProjectCheckpoint).toHaveBeenCalled());
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    await waitFor(() => expect(api.deleteProjectCheckpoint).toHaveBeenCalledWith(projectId, checkpoint.id, { confirm: true, checkpoint_name: "checkpoint-1" }));
  });

  it("starts evaluation, lists evaluations and shows reports", async () => {
    const api = client();
    const evaluationStudio = renderStudio(<EvaluationStudioPage projectId={projectId} initialCheckpointId={checkpoint.id} client={api} />);
    expect(await screen.findByText("Evaluation Studio")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Start evaluation" }));
    await waitFor(() => expect(api.createProjectEvaluation).toHaveBeenCalled());
    evaluationStudio.unmount();

    const evaluationsPage = renderStudio(<EvaluationsPage projectId={projectId} client={api} />);
    expect(await screen.findByText("Evaluations")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Compare completed" }));
    await waitFor(() => expect(api.compareProjectEvaluations).toHaveBeenCalled());
    evaluationsPage.unmount();

    const detailsPage = renderStudio(<EvaluationDetailsPage projectId={projectId} evaluationId={evaluation.id} client={api} />);
    expect(await screen.findByText("Evaluation status, canonical report and event history.")).toBeTruthy();
    await waitFor(() => expect(detailsPage.container.textContent).toContain("perplexity"));
    expect(detailsPage.container.textContent).toContain("3");
  });

  it("generates text, shows history and checkpoint inspection trace", async () => {
    const api = client();
    const generationPage = renderStudio(<GenerationPlaygroundPage projectId={projectId} initialCheckpointId={checkpoint.id} client={api} />);
    expect(await screen.findByText("Generation Playground")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Generate" }));
    await waitFor(() => expect(api.createProjectGeneration).toHaveBeenCalled());
    expect(await screen.findByText("Generation completed")).toBeTruthy();
    generationPage.unmount();

    const inspectionPage = renderStudio(<CheckpointInspectionPage projectId={projectId} checkpointId={checkpoint.id} client={api} />);
    expect(await screen.findByText("Checkpoint Inspection")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Inspect checkpoint" }));
    await waitFor(() => expect(api.inspectProjectCheckpoint).toHaveBeenCalled());
    await waitFor(() => expect(inspectionPage.container.textContent).toContain("[1,2]"));
    expect(inspectionPage.container.textContent).toContain("Not available in this inspection version");
  });
});
