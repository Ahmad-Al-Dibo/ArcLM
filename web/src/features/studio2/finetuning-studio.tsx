"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  ErrorState,
  KeyValueList,
  PageHeader,
  Select,
  TextInput
} from "@/components/ui";
import type { FineTuningFormattingRequest, FineTuningPreviewResponse, StudioRunMetadata } from "@/lib/api/schemas";
import { errorMessage, LoadingCard, type StudioClient, useClient, useProjectAssets } from "./shared";

const DATASET_FORMATS = [
  ["instruction_response", "Instruction / Response"],
  ["prompt_completion", "Prompt / Completion"],
  ["plain_text", "Plain continuation text"]
] as const;

function text(value: unknown, fallback = "n/a") {
  return value === null || value === undefined || value === "" ? fallback : String(value);
}

function displayMode(mode: string, method?: string | null) {
  if (mode === "fine_tuning") return method ? `Fine-Tuning - ${method.toUpperCase()}` : "Fine-Tuning";
  if (mode === "pretraining") return "Pre-Training";
  return "Legacy native training";
}

export function FineTuningStudioPage({ projectId, client }: { projectId: string; client?: StudioClient }) {
  const api = useClient(client);
  const assets = useProjectAssets(projectId, api);
  const [checkpoints, setCheckpoints] = useState<Array<Record<string, unknown>>>([]);
  const [checkpointError, setCheckpointError] = useState<string | null>(null);
  const [baseSource, setBaseSource] = useState<"model" | "checkpoint">("model");
  const [baseModelId, setBaseModelId] = useState("");
  const [baseCheckpointId, setBaseCheckpointId] = useState("");
  const [datasetId, setDatasetId] = useState("");
  const [tokenizerId, setTokenizerId] = useState("");
  const [method, setMethod] = useState<"full" | "sft">("sft");
  const [datasetFormat, setDatasetFormat] = useState<FineTuningFormattingRequest["dataset_format"]>("instruction_response");
  const [instructionField, setInstructionField] = useState("instruction");
  const [responseField, setResponseField] = useState("response");
  const [promptField, setPromptField] = useState("prompt");
  const [completionField, setCompletionField] = useState("completion");
  const [textField, setTextField] = useState("text");
  const [contextField, setContextField] = useState("");
  const [instructionTag, setInstructionTag] = useState("<|instruction|>");
  const [responseTag, setResponseTag] = useState("<|response|>");
  const [endTag, setEndTag] = useState("<|end|>");
  const [endBehavior, setEndBehavior] = useState<FineTuningFormattingRequest["end_behavior"]>("custom_end_tag");
  const [appendEndTag, setAppendEndTag] = useState(true);
  const [registerTags, setRegisterTags] = useState(false);
  const [trainOnResponseOnly, setTrainOnResponseOnly] = useState(true);
  const [maximumSequenceLength, setMaximumSequenceLength] = useState(64);
  const [epochs, setEpochs] = useState(1);
  const [batchSize, setBatchSize] = useState(1);
  const [learningRate, setLearningRate] = useState(0.001);
  const [device, setDevice] = useState<"auto" | "cpu" | "cuda">("cpu");
  const [preview, setPreview] = useState<FineTuningPreviewResponse | null>(null);
  const [createdRun, setCreatedRun] = useState<StudioRunMetadata | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    api.listProjectCheckpoints(projectId)
      .then((response) => {
        if (!active) return;
        setCheckpoints(response.checkpoints);
        setCheckpointError(null);
      })
      .catch((requestError) => {
        if (active) setCheckpointError(errorMessage(requestError));
      });
    return () => {
      active = false;
    };
  }, [api, projectId]);

  const selectedDatasetId = datasetId || assets.datasets[0]?.id || "";
  const selectedTokenizerId = tokenizerId || assets.tokenizers[0]?.id || "";
  const selectedCheckpoint = checkpoints.find((checkpoint) => String(checkpoint.id) === (baseCheckpointId || String(checkpoints[0]?.id ?? "")));
  const selectedBaseModelId = baseSource === "checkpoint"
    ? text(selectedCheckpoint?.model_id, "")
    : baseModelId || assets.models[0]?.id || "";
  const selectedBaseCheckpointId = baseSource === "checkpoint" ? baseCheckpointId || String(checkpoints[0]?.id ?? "") : "";
  const selectedModel = assets.models.find((model) => model.id === selectedBaseModelId);

  const formatting = useMemo<FineTuningFormattingRequest>(() => ({
    dataset_format: datasetFormat,
    instruction_field: instructionField,
    response_field: responseField,
    prompt_field: promptField,
    completion_field: completionField,
    text_field: textField,
    context_field: contextField.trim() ? contextField.trim() : null,
    instruction_tag: instructionTag,
    response_tag: responseTag,
    end_tag: endTag,
    end_behavior: endBehavior,
    separator: "\n",
    append_end_tag: appendEndTag,
    register_tags_as_special_tokens: registerTags,
    train_on_response_only: trainOnResponseOnly,
    maximum_sequence_length: maximumSequenceLength
  }), [
    appendEndTag,
    completionField,
    contextField,
    datasetFormat,
    endBehavior,
    endTag,
    instructionField,
    instructionTag,
    maximumSequenceLength,
    promptField,
    registerTags,
    responseField,
    responseTag,
    textField,
    trainOnResponseOnly
  ]);

  const requestPayload = {
    fine_tuning_method: method,
    base_model_id: baseSource === "model" ? selectedBaseModelId : null,
    base_checkpoint_id: baseSource === "checkpoint" ? selectedBaseCheckpointId : null,
    dataset_id: selectedDatasetId,
    tokenizer_id: selectedTokenizerId,
    formatting,
    device,
    precision: "fp32" as const
  };

  const startDisabled = !preview?.valid || !selectedDatasetId || !selectedTokenizerId || !selectedBaseModelId;

  async function previewFormatting() {
    try {
      const response = await api.previewProjectFinetuning(projectId, { ...requestPayload, preview_records: 3 });
      setPreview(response);
      setError(null);
    } catch (requestError) {
      setPreview(null);
      setError(errorMessage(requestError));
    }
  }

  async function startFineTuning() {
    if (startDisabled) return;
    try {
      const run = await api.createProjectRun(projectId, {
        name: method === "sft" ? "Native SFT run" : "Native full fine-tuning run",
        training_mode: "fine_tuning",
        fine_tuning_method: method,
        base_checkpoint_id: selectedBaseCheckpointId || null,
        fine_tuning_format: formatting,
        dataset_id: selectedDatasetId,
        tokenizer_id: selectedTokenizerId,
        model_id: selectedBaseModelId,
        training_type: "native_causal_lm",
        epochs,
        batch_size: batchSize,
        learning_rate: learningRate,
        device,
        precision: "fp32",
        checkpoint_interval: 1,
        maximum_sequence_length: maximumSequenceLength
      });
      setCreatedRun(run);
      setError(null);
    } catch (requestError) {
      setError(errorMessage(requestError));
    }
  }

  return (
    <div className="studio-page">
      <PageHeader title="Fine-Tuning Studio" description="Format a local dataset and continue from an existing native ArcLM model or compatible checkpoint." />
      {error ? <ErrorState title="Fine-tuning request failed" description={error} /> : null}
      {checkpointError ? <Alert variant="warning" title="Checkpoint list unavailable">{checkpointError}</Alert> : null}
      {assets.loading ? <LoadingCard title="Fine-Tuning Studio" /> : (
        <>
          <Alert variant="info" title="Formatting tags are text">
            Formatting tags are inserted into training text. Tokenizer special tokens are separate and are never registered silently because that can change model vocabulary size.
          </Alert>
          <div className="studio-grid">
            <Card>
              <CardHeader><CardTitle>Step 1 - Base source</CardTitle><CardDescription>Use a saved project model configuration or a compatible checkpoint.</CardDescription></CardHeader>
              <CardContent className="studio-form">
                <Select label="Base source" value={baseSource} onChange={(event) => setBaseSource(event.target.value as "model" | "checkpoint")}>
                  <option value="model">Project model configuration</option>
                  <option value="checkpoint">Compatible checkpoint</option>
                </Select>
                {baseSource === "model" ? (
                  <Select label="Base model" value={selectedBaseModelId} onChange={(event) => setBaseModelId(event.target.value)}>
                    <option value="">Select model</option>
                    {assets.models.map((model) => <option key={model.id} value={model.id}>{model.name} - vocab {text(model.configuration.vocab_size)}</option>)}
                  </Select>
                ) : (
                  <Select label="Checkpoint" value={selectedBaseCheckpointId} onChange={(event) => setBaseCheckpointId(event.target.value)}>
                    <option value="">Select checkpoint</option>
                    {checkpoints.map((checkpoint) => <option key={String(checkpoint.id)} value={String(checkpoint.id)}>{text(checkpoint.name, String(checkpoint.id))} - {text(checkpoint.reload_status)}</option>)}
                  </Select>
                )}
                <Select label="Fine-tuning method" value={method} onChange={(event) => setMethod(event.target.value as "full" | "sft")}>
                  <option value="sft">Supervised fine-tuning</option>
                  <option value="full">Full fine-tuning</option>
                </Select>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Step 2 - Dataset and tokenizer</CardTitle><CardDescription>Tokenizer must match the base model vocabulary.</CardDescription></CardHeader>
              <CardContent className="studio-form">
                <Select label="Dataset" value={selectedDatasetId} onChange={(event) => setDatasetId(event.target.value)}>
                  <option value="">Select dataset</option>
                  {assets.datasets.map((dataset) => <option key={dataset.id} value={dataset.id}>{dataset.name} ({dataset.validation_status})</option>)}
                </Select>
                <Select label="Tokenizer" value={selectedTokenizerId} onChange={(event) => setTokenizerId(event.target.value)}>
                  <option value="">Select tokenizer</option>
                  {assets.tokenizers.map((tokenizer) => <option key={tokenizer.id} value={tokenizer.id}>{tokenizer.name} - vocab {tokenizer.vocab_size}</option>)}
                </Select>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader><CardTitle>Step 3 - Formatting</CardTitle><CardDescription>Choose how records become training text and labels.</CardDescription></CardHeader>
            <CardContent className="studio-form">
              <Select label="Dataset format" value={datasetFormat} onChange={(event) => setDatasetFormat(event.target.value as FineTuningFormattingRequest["dataset_format"])}>
                {DATASET_FORMATS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </Select>
              {datasetFormat === "instruction_response" ? (
                <>
                  <TextInput label="Instruction field" value={instructionField} onChange={(event) => setInstructionField(event.target.value)} />
                  <TextInput label="Response field" value={responseField} onChange={(event) => setResponseField(event.target.value)} />
                  <TextInput label="Optional context field" value={contextField} onChange={(event) => setContextField(event.target.value)} />
                </>
              ) : null}
              {datasetFormat === "prompt_completion" ? (
                <>
                  <TextInput label="Prompt field" value={promptField} onChange={(event) => setPromptField(event.target.value)} />
                  <TextInput label="Completion field" value={completionField} onChange={(event) => setCompletionField(event.target.value)} />
                </>
              ) : null}
              {datasetFormat === "plain_text" ? <TextInput label="Text field" value={textField} onChange={(event) => setTextField(event.target.value)} /> : null}
              <div className="studio-grid">
                <TextInput label="Instruction tag" value={instructionTag} onChange={(event) => setInstructionTag(event.target.value)} />
                <TextInput label="Response tag" value={responseTag} onChange={(event) => setResponseTag(event.target.value)} />
                <TextInput label="End tag" value={endTag} onChange={(event) => setEndTag(event.target.value)} />
              </div>
              <Select label="End behavior" value={endBehavior} onChange={(event) => setEndBehavior(event.target.value as FineTuningFormattingRequest["end_behavior"])}>
                <option value="custom_end_tag">Use selected end tag</option>
                <option value="tokenizer_eos">Use tokenizer EOS token when available</option>
                <option value="none">Do not append an end marker</option>
              </Select>
              <Checkbox label="Append end tag after every response" checked={appendEndTag} onChange={(event) => setAppendEndTag(event.currentTarget.checked)} />
              <Checkbox label="Register tags as tokenizer special tokens" description="Validation blocks this if it would require a model vocabulary resize." checked={registerTags} onChange={(event) => setRegisterTags(event.currentTarget.checked)} />
              <Checkbox label="Train on response only" description="When enabled, prompt/instruction tokens are ignored in the label mask." checked={trainOnResponseOnly} onChange={(event) => setTrainOnResponseOnly(event.currentTarget.checked)} />
              <TextInput label="Maximum sequence length" type="number" min={1} max={2048} value={String(maximumSequenceLength)} onChange={(event) => setMaximumSequenceLength(Number(event.target.value))} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Step 4 - Training options</CardTitle></CardHeader>
            <CardContent className="studio-form">
              <TextInput label="Epochs" type="number" value={String(epochs)} onChange={(event) => setEpochs(Number(event.target.value))} />
              <TextInput label="Batch size" type="number" value={String(batchSize)} onChange={(event) => setBatchSize(Number(event.target.value))} />
              <TextInput label="Learning rate" type="number" value={String(learningRate)} onChange={(event) => setLearningRate(Number(event.target.value))} />
              <Select label="Device" value={device} onChange={(event) => setDevice(event.target.value as "auto" | "cpu" | "cuda")}><option value="cpu">cpu</option><option value="auto">auto</option><option value="cuda">cuda</option></Select>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Step 5 - Preview and review</CardTitle><CardDescription>Preview is required before starting so the backend can validate fields, tags and label masks.</CardDescription></CardHeader>
            <CardContent>
              <div className="studio-actions">
                <Button onClick={() => void previewFormatting()} disabled={!selectedDatasetId || !selectedTokenizerId || !selectedBaseModelId}>Preview formatting</Button>
                <Button onClick={() => void startFineTuning()} disabled={startDisabled}>Start fine-tuning run</Button>
                {createdRun ? <Link className="ui-button ui-button-secondary" href={`/projects/${projectId}/runs/${createdRun.id}`}>Open run</Link> : null}
              </div>
              {preview ? (
                <>
                  <KeyValueList items={[
                    { label: "Training mode", value: displayMode("fine_tuning", method) },
                    { label: "Base", value: baseSource === "checkpoint" ? selectedBaseCheckpointId : selectedBaseModelId },
                    { label: "Base model name", value: selectedModel?.name ?? "Selected from checkpoint metadata" },
                    { label: "Dataset format", value: datasetFormat },
                    { label: "Tokenizer vocabulary", value: text(preview.compatibility.tokenizer_vocabulary_size) },
                    { label: "Model vocabulary", value: text(preview.compatibility.model_vocabulary_size) },
                    { label: "Vocabulary compatibility", value: preview.compatibility.vocabulary_compatible ? "Compatible" : "Blocked" },
                    { label: "End behavior", value: endBehavior === "none" ? "No explicit end marker" : endBehavior === "tokenizer_eos" ? "Tokenizer EOS token" : `Response ends with ${endTag}` },
                    { label: "Label strategy", value: trainOnResponseOnly ? "Response tokens trained; prompt tokens ignored" : "Full formatted sequence trained" },
                    { label: "Special-token registration", value: registerTags ? "Requested and backend-validated" : "Tags used as ordinary formatted text" }
                  ]} />
                  {preview.errors.length ? preview.errors.map((item) => <Alert key={`${item.code}-${item.message}`} variant="error" title={item.code}>{item.message}</Alert>) : null}
                  {preview.warnings.map((warning) => <Alert key={warning} variant="warning" title="Warning">{warning}</Alert>)}
                  {preview.records.map((record) => (
                    <Card key={record.index}>
                      <CardHeader><CardTitle>Preview record {record.index + 1}</CardTitle><CardDescription>Backend formatted text, token IDs and label mask.</CardDescription></CardHeader>
                      <CardContent>
                        <pre className="studio-json">{JSON.stringify(record.original_record, null, 2)}</pre>
                        <KeyValueList items={[
                          { label: "Formatted text", value: record.formatted_text },
                          { label: "Token IDs", value: record.token_ids.join(", ") },
                          { label: "Label mask", value: record.label_mask.join(", ") },
                          { label: "Sequence length", value: record.sequence_length },
                          { label: "Truncated", value: record.truncated ? "Yes" : "No" },
                          { label: "Unknown tokens", value: record.unknown_token_count },
                          { label: "Special tags detected", value: record.special_tags_detected.join(", ") || "None" }
                        ]} />
                      </CardContent>
                    </Card>
                  ))}
                </>
              ) : null}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
