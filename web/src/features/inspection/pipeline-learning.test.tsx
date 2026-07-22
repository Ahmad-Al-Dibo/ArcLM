import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ApiClientError } from "@/lib/api/client";
import type { PipelineTraceResponse } from "@/lib/api/schemas";
import LearnPipelinePage from "@/app/learn/pipeline/page";
import type { PipelineInspectionClient } from "./pipeline-learning";
import { PipelineLearningPage } from "./pipeline-learning";

const trace: PipelineTraceResponse = {
  input_text: "hello arclm",
  tokens: ["hello", "arclm"],
  token_ids: [1, 2],
  sequence_length: 2,
  input_shape: [1, 2],
  embedding_shape: [1, 2, 8],
  logits_shape: [1, 2, 16],
  selected_token_id: 3,
  selected_token: "trace",
  generated_text: "hello arclm trace",
  device: "cpu",
  dtype: "float32",
  model_class: "ArcLM",
  tokenizer_class: "Tokenizer",
  inspected_steps: 1,
  generation_steps: 1,
  attention_available: false,
  attention_note: "Attention tensor capture is planned for a later inspection version.",
  warnings: [],
  values: null
};

function client(result: Promise<PipelineTraceResponse> = Promise.resolve(trace)): PipelineInspectionClient {
  return {
    inspectPipelineText: vi.fn().mockReturnValue(result)
  };
}

describe("PipelineLearningPage", () => {
  it("renders through the /learn/pipeline route", () => {
    render(<LearnPipelinePage />);

    expect(screen.getByRole("heading", { name: "Pipeline Learning" })).toBeTruthy();
    expect(screen.getByLabelText(/Input text/)).toBeTruthy();
    expect(screen.getByRole("button", { name: "Inspect pipeline" })).toBeTruthy();
  });

  it("sends entered text to the inspection endpoint client", async () => {
    const testClient = client();
    render(<PipelineLearningPage client={testClient} />);

    fireEvent.change(screen.getByLabelText(/Input text/), { target: { value: "custom prompt" } });
    fireEvent.click(screen.getByRole("button", { name: "Inspect pipeline" }));

    await waitFor(() => expect(testClient.inspectPipelineText).toHaveBeenCalledWith({
      text: "custom prompt",
      include_values: false,
      max_values: 20
    }));
  });

  it("shows a loading state while inspection is running", async () => {
    let resolveTrace: (value: PipelineTraceResponse) => void = () => {};
    const pending = new Promise<PipelineTraceResponse>((resolve) => {
      resolveTrace = resolve;
    });
    render(<PipelineLearningPage client={client(pending)} />);

    fireEvent.click(screen.getByRole("button", { name: "Inspect pipeline" }));

    expect(screen.getByRole("button", { name: "Inspecting pipeline" })).toBeTruthy();
    resolveTrace(trace);
    expect(await screen.findByText("hello arclm trace")).toBeTruthy();
  });

  it("renders trace cards from the backend result", async () => {
    render(<PipelineLearningPage client={client()} />);

    fireEvent.click(screen.getByRole("button", { name: "Inspect pipeline" }));

    expect(await screen.findByText("Native trace metadata")).toBeTruthy();
    expect(screen.getByText("1. Input")).toBeTruthy();
    expect(screen.getByText("2. Tokenization")).toBeTruthy();
    expect(screen.getByText("3. Token IDs")).toBeTruthy();
    expect(screen.getByText("4. Input Tensor")).toBeTruthy();
    expect(screen.getByText("5. Embeddings")).toBeTruthy();
    expect(screen.getByText("6. Model Output / Logits")).toBeTruthy();
    expect(screen.getByText("7. Selected Token")).toBeTruthy();
    expect(screen.getByText("8. Generated Text")).toBeTruthy();
    expect(screen.getByText("[1, 2, 8]")).toBeTruthy();
    expect(screen.getByText("trace (3)")).toBeTruthy();
  });

  it("shows missing-model errors clearly", async () => {
    const testClient = client(Promise.reject(
      new ApiClientError("The local ArcLM inspection model and tokenizer are not configured.", "native_model_not_configured", 409)
    ));
    render(<PipelineLearningPage client={testClient} />);

    fireEvent.click(screen.getByRole("button", { name: "Inspect pipeline" }));

    expect(await screen.findByText("Local inspection model is not configured")).toBeTruthy();
    expect(screen.getByText("native_model_not_configured")).toBeTruthy();
  });

  it("handles backend unavailable errors", async () => {
    const testClient = client(Promise.reject(new ApiClientError("The backend is disconnected.", "disconnected")));
    render(<PipelineLearningPage client={testClient} />);

    fireEvent.click(screen.getByRole("button", { name: "Inspect pipeline" }));

    expect(await screen.findByText("ArcLM backend is not connected")).toBeTruthy();
    expect(screen.getByText("The backend is disconnected.")).toBeTruthy();
  });

  it("shows attention as unavailable without inventing maps", async () => {
    render(<PipelineLearningPage client={client()} />);

    fireEvent.click(screen.getByRole("button", { name: "Inspect pipeline" }));

    expect(await screen.findAllByText("Not available in this inspection version")).toHaveLength(1);
    expect(screen.getByText("Attention tensor capture is planned for a later inspection version.")).toBeTruthy();
  });
});
