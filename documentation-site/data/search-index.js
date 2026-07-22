window.ARCLM_SEARCH_INDEX = [
  {
    "type": "page",
    "title": "ArcLM Documentation",
    "description": "A native-first library for local language-model learning.",
    "page": "index.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "What ArcLM is",
    "description": "ArcLM is a compact Python library for local language-model workflows. The main path is dataset, tokenizer, native causal model, training, checkpoint, evaluation, generation and pipeline inspection.",
    "page": "index.html",
    "section": "what-arclm-is"
  },
  {
    "type": "section",
    "title": "What you can do",
    "description": "What you can do",
    "page": "index.html",
    "section": "what-you-can-do"
  },
  {
    "type": "section",
    "title": "Smallest import check",
    "description": "Smallest import check",
    "page": "index.html",
    "section": "smallest-import-check"
  },
  {
    "type": "page",
    "title": "Installation",
    "description": "Install ArcLM base or optional extras.",
    "page": "installation.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "Base install",
    "description": "The base package contains the native ArcLM workflow and does not require web or Hugging Face packages.",
    "page": "installation.html",
    "section": "base-install"
  },
  {
    "type": "section",
    "title": "Install variants",
    "description": "Install variants",
    "page": "installation.html",
    "section": "install-variants"
  },
  {
    "type": "section",
    "title": "Verify the install",
    "description": "Verify the install",
    "page": "installation.html",
    "section": "verify-the-install"
  },
  {
    "type": "section",
    "title": "Optional boundaries",
    "description": "Optional boundaries",
    "page": "installation.html",
    "section": "optional-boundaries"
  },
  {
    "type": "page",
    "title": "Getting Started",
    "description": "Three quick paths into ArcLM.",
    "page": "getting-started.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "Path 1 - inspect text without training",
    "description": "Create a tokenizer and tiny native model, then call inspect_text to see token IDs and tensor shapes.",
    "page": "getting-started.html",
    "section": "path-1-inspect-text-without-training"
  },
  {
    "type": "section",
    "title": "Inspect text",
    "description": "Inspect text",
    "page": "getting-started.html",
    "section": "inspect-text"
  },
  {
    "type": "section",
    "title": "Path 2 - train a tiny native model",
    "description": "Prepare records, create a tokenizer-compatible model, configure Trainer and save checkpoints. See the training guide for the complete flow.",
    "page": "getting-started.html",
    "section": "path-2-train-a-tiny-native-model"
  },
  {
    "type": "section",
    "title": "Path 3 - use ArcLM Studio",
    "description": "Install the web extra, start the local API and open the existing frontend during development. Studio keeps data and model artifacts local.",
    "page": "getting-started.html",
    "section": "path-3-use-arclm-studio"
  },
  {
    "type": "page",
    "title": "Architecture",
    "description": "How ArcLM pieces fit together.",
    "page": "architecture.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "Native-first core",
    "description": "ArcLM keeps the core workflow in local Python and PyTorch. Optional integrations are separate paths.",
    "page": "architecture.html",
    "section": "native-first-core"
  },
  {
    "type": "section",
    "title": "Core flow",
    "description": "Core flow",
    "page": "architecture.html",
    "section": "core-flow"
  },
  {
    "type": "section",
    "title": "Optional integrations",
    "description": "The Web API and Studio are optional local interfaces. Hugging Face and PEFT integrations are optional and should not be mistaken for universal model support.",
    "page": "architecture.html",
    "section": "optional-integrations"
  },
  {
    "type": "page",
    "title": "Workflows",
    "description": "Common ArcLM workflows.",
    "page": "workflows.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "Native happy path",
    "description": "Native happy path",
    "page": "workflows.html",
    "section": "native-happy-path"
  },
  {
    "type": "section",
    "title": "SFT path",
    "description": "SFT path",
    "page": "workflows.html",
    "section": "sft-path"
  },
  {
    "type": "section",
    "title": "Studio path",
    "description": "Studio path",
    "page": "workflows.html",
    "section": "studio-path"
  },
  {
    "type": "page",
    "title": "Datasets",
    "description": "Load, validate and report on local data.",
    "page": "guides/datasets.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "What datasets are",
    "description": "ArcLM datasets are local records used for tokenization, training, fine-tuning, evaluation and reports.",
    "page": "guides/datasets.html",
    "section": "what-datasets-are"
  },
  {
    "type": "section",
    "title": "Supported inputs",
    "description": "Supported inputs",
    "page": "guides/datasets.html",
    "section": "supported-inputs"
  },
  {
    "type": "section",
    "title": "Validate instruction records",
    "description": "Validate instruction records",
    "page": "guides/datasets.html",
    "section": "validate-instruction-records"
  },
  {
    "type": "section",
    "title": "Build a token report",
    "description": "Build a token report",
    "page": "guides/datasets.html",
    "section": "build-a-token-report"
  },
  {
    "type": "page",
    "title": "Tokenizers",
    "description": "Convert text to token IDs and back.",
    "page": "guides/tokenizers.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "Core concepts",
    "description": "Tokenization splits text into tokens, maps them to numeric IDs and provides decoding back to text. Models consume IDs, not raw strings.",
    "page": "guides/tokenizers.html",
    "section": "core-concepts"
  },
  {
    "type": "section",
    "title": "Modes",
    "description": "Modes",
    "page": "guides/tokenizers.html",
    "section": "modes"
  },
  {
    "type": "section",
    "title": "Create a Word tokenizer",
    "description": "Create a Word tokenizer",
    "page": "guides/tokenizers.html",
    "section": "create-a-word-tokenizer"
  },
  {
    "type": "section",
    "title": "SentencePiece configuration",
    "description": "SentencePiece configuration",
    "page": "guides/tokenizers.html",
    "section": "sentencepiece-configuration"
  },
  {
    "type": "section",
    "title": "Common mistakes",
    "description": "Common mistakes",
    "page": "guides/tokenizers.html",
    "section": "common-mistakes"
  },
  {
    "type": "page",
    "title": "Models",
    "description": "Create native ArcLM causal language models.",
    "page": "guides/models.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "Native model path",
    "description": "ArcLM provides a compact GPT-style causal language model. It is the official native model path.",
    "page": "guides/models.html",
    "section": "native-model-path"
  },
  {
    "type": "section",
    "title": "Create a tiny model",
    "description": "Create a tiny model",
    "page": "guides/models.html",
    "section": "create-a-tiny-model"
  },
  {
    "type": "section",
    "title": "Important fields",
    "description": "Important fields",
    "page": "guides/models.html",
    "section": "important-fields"
  },
  {
    "type": "section",
    "title": "Limitations",
    "description": "Limitations",
    "page": "guides/models.html",
    "section": "limitations"
  },
  {
    "type": "page",
    "title": "Training",
    "description": "Train native models with Trainer.",
    "page": "guides/training.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "How training works",
    "description": "The native path batches token IDs, runs the model forward pass, computes loss, backpropagates, steps the optimizer and saves checkpoints.",
    "page": "guides/training.html",
    "section": "how-training-works"
  },
  {
    "type": "section",
    "title": "Create TrainingConfig",
    "description": "Create TrainingConfig",
    "page": "guides/training.html",
    "section": "create-trainingconfig"
  },
  {
    "type": "section",
    "title": "Create Trainer",
    "description": "Create Trainer",
    "page": "guides/training.html",
    "section": "create-trainer"
  },
  {
    "type": "section",
    "title": "Supported options",
    "description": "Supported options",
    "page": "guides/training.html",
    "section": "supported-options"
  },
  {
    "type": "page",
    "title": "Fine-Tuning",
    "description": "Validate and prepare supervised fine-tuning records.",
    "page": "guides/fine-tuning.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "SFT contract",
    "description": "SFT accepts instruction/response, prompt/completion and normalized chat-style records. The stable contract validates records before formatting and tokenization.",
    "page": "guides/fine-tuning.html",
    "section": "sft-contract"
  },
  {
    "type": "section",
    "title": "Validate SFT records",
    "description": "Validate SFT records",
    "page": "guides/fine-tuning.html",
    "section": "validate-sft-records"
  },
  {
    "type": "section",
    "title": "Limitations",
    "description": "Limitations",
    "page": "guides/fine-tuning.html",
    "section": "limitations"
  },
  {
    "type": "page",
    "title": "PEFT and LoRA",
    "description": "Use lightweight native adapters where validated.",
    "page": "guides/peft-lora.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "Native LoRA",
    "description": "ArcLM validates native LoRA on ArcLM linear layers. External PEFT paths remain optional and model-specific.",
    "page": "guides/peft-lora.html",
    "section": "native-lora"
  },
  {
    "type": "section",
    "title": "Configure LoRA",
    "description": "Configure LoRA",
    "page": "guides/peft-lora.html",
    "section": "configure-lora"
  },
  {
    "type": "section",
    "title": "Limitations",
    "description": "Limitations",
    "page": "guides/peft-lora.html",
    "section": "limitations"
  },
  {
    "type": "page",
    "title": "Checkpoints",
    "description": "Save, inspect and reload native checkpoints.",
    "page": "guides/checkpoints.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "What checkpoints store",
    "description": "Native checkpoints store model state and training state needed for reload, resume, evaluation, generation and inspection.",
    "page": "guides/checkpoints.html",
    "section": "what-checkpoints-store"
  },
  {
    "type": "section",
    "title": "Inspect checkpoint metadata",
    "description": "Inspect checkpoint metadata",
    "page": "guides/checkpoints.html",
    "section": "inspect-checkpoint-metadata"
  },
  {
    "type": "section",
    "title": "Common errors",
    "description": "Common errors",
    "page": "guides/checkpoints.html",
    "section": "common-errors"
  },
  {
    "type": "page",
    "title": "Evaluation",
    "description": "Measure model behavior with structured reports.",
    "page": "guides/evaluation.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "What evaluation returns",
    "description": "Evaluation returns metrics such as loss, perplexity and accuracy when applicable, plus report metadata such as examples and device.",
    "page": "guides/evaluation.html",
    "section": "what-evaluation-returns"
  },
  {
    "type": "section",
    "title": "Create report object",
    "description": "Create report object",
    "page": "guides/evaluation.html",
    "section": "create-report-object"
  },
  {
    "type": "section",
    "title": "Limitations",
    "description": "Limitations",
    "page": "guides/evaluation.html",
    "section": "limitations"
  },
  {
    "type": "page",
    "title": "Inference",
    "description": "Use a trained or reloaded model for bounded local model use.",
    "page": "guides/inference.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "What inference means in ArcLM",
    "description": "Inference is the model-use side of ArcLM. The stable native path loads a trusted local native model or checkpoint, prepares token IDs with the matching tokenizer and runs a bounded generation or inspection step.",
    "page": "guides/inference.html",
    "section": "what-inference-means-in-arclm"
  },
  {
    "type": "section",
    "title": "When to use it",
    "description": "When to use it",
    "page": "guides/inference.html",
    "section": "when-to-use-it"
  },
  {
    "type": "section",
    "title": "Native generation entry point",
    "description": "Native generation entry point",
    "page": "guides/inference.html",
    "section": "native-generation-entry-point"
  },
  {
    "type": "section",
    "title": "Limitations",
    "description": "Limitations",
    "page": "guides/inference.html",
    "section": "limitations"
  },
  {
    "type": "page",
    "title": "Generation",
    "description": "Generate bounded text from native checkpoints.",
    "page": "guides/generation.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "How generation works",
    "description": "Generation tokenizes a prompt, feeds the model, selects next tokens with supported sampling settings and decodes text.",
    "page": "guides/generation.html",
    "section": "how-generation-works"
  },
  {
    "type": "section",
    "title": "Generator shape",
    "description": "Generator shape",
    "page": "guides/generation.html",
    "section": "generator-shape"
  },
  {
    "type": "section",
    "title": "Options",
    "description": "Options",
    "page": "guides/generation.html",
    "section": "options"
  },
  {
    "type": "page",
    "title": "Pipeline Inspection",
    "description": "Explain one native generation step.",
    "page": "guides/inspection.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "What inspection shows",
    "description": "Inspection exposes input text, tokens, IDs, input shape, embedding shape, logits shape, selected token, decoded text, device and dtype.",
    "page": "guides/inspection.html",
    "section": "what-inspection-shows"
  },
  {
    "type": "section",
    "title": "Inspect text",
    "description": "Inspect text",
    "page": "guides/inspection.html",
    "section": "inspect-text"
  },
  {
    "type": "section",
    "title": "Limitations",
    "description": "Limitations",
    "page": "guides/inspection.html",
    "section": "limitations"
  },
  {
    "type": "page",
    "title": "External Models",
    "description": "Optional lower-level Hugging Face causal-LM boundaries.",
    "page": "guides/external-models.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "Honest status",
    "description": "External model loading exists through optional integration paths. It is not a universal loader and may require internet for first model download.",
    "page": "guides/external-models.html",
    "section": "honest-status"
  },
  {
    "type": "section",
    "title": "Inspect source boundary",
    "description": "Inspect source boundary",
    "page": "guides/external-models.html",
    "section": "inspect-source-boundary"
  },
  {
    "type": "section",
    "title": "Limitations",
    "description": "Limitations",
    "page": "guides/external-models.html",
    "section": "limitations"
  },
  {
    "type": "page",
    "title": "CLI",
    "description": "Use ArcLM from the command line.",
    "page": "guides/cli.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "Commands",
    "description": "Commands",
    "page": "guides/cli.html",
    "section": "commands"
  },
  {
    "type": "section",
    "title": "Doctor JSON",
    "description": "Doctor JSON",
    "page": "guides/cli.html",
    "section": "doctor-json"
  },
  {
    "type": "page",
    "title": "ArcLM Studio",
    "description": "Optional local visual workflow.",
    "page": "guides/web-studio.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "Local workflow",
    "description": "Studio provides project, dataset, tokenizer, model, training run, checkpoint, evaluation, generation and inspection pages. It remains local and read/write bounded to the configured workspace.",
    "page": "guides/web-studio.html",
    "section": "local-workflow"
  },
  {
    "type": "section",
    "title": "Workflow",
    "description": "Workflow",
    "page": "guides/web-studio.html",
    "section": "workflow"
  },
  {
    "type": "section",
    "title": "Limitations",
    "description": "Limitations",
    "page": "guides/web-studio.html",
    "section": "limitations"
  },
  {
    "type": "page",
    "title": "Dataset API",
    "description": "Public datasets APIs.",
    "page": "api/datasets.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "Overview",
    "description": "Dataset API documents the public ArcLM APIs in this category.",
    "page": "api/datasets.html",
    "section": "overview"
  },
  {
    "type": "section",
    "title": "load_dataset",
    "description": "Load in-memory records or supported local dataset files.",
    "page": "api/datasets.html",
    "section": "load-dataset"
  },
  {
    "type": "section",
    "title": "load_dataset parameters",
    "description": "load_dataset parameters",
    "page": "api/datasets.html",
    "section": "load-dataset-parameters"
  },
  {
    "type": "section",
    "title": "load_dataset example",
    "description": "load_dataset example",
    "page": "api/datasets.html",
    "section": "load-dataset-example"
  },
  {
    "type": "section",
    "title": "validate_records",
    "description": "Validate required dataset fields and return structured issues.",
    "page": "api/datasets.html",
    "section": "validate-records"
  },
  {
    "type": "section",
    "title": "validate_records parameters",
    "description": "validate_records parameters",
    "page": "api/datasets.html",
    "section": "validate-records-parameters"
  },
  {
    "type": "section",
    "title": "validate_records example",
    "description": "validate_records example",
    "page": "api/datasets.html",
    "section": "validate-records-example"
  },
  {
    "type": "section",
    "title": "build_dataset_report",
    "description": "Create JSON-safe dataset and token statistics.",
    "page": "api/datasets.html",
    "section": "build-dataset-report"
  },
  {
    "type": "section",
    "title": "build_dataset_report parameters",
    "description": "build_dataset_report parameters",
    "page": "api/datasets.html",
    "section": "build-dataset-report-parameters"
  },
  {
    "type": "section",
    "title": "build_dataset_report example",
    "description": "build_dataset_report example",
    "page": "api/datasets.html",
    "section": "build-dataset-report-example"
  },
  {
    "type": "page",
    "title": "Tokenizer API",
    "description": "Public tokenizers APIs.",
    "page": "api/tokenizers.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "Overview",
    "description": "Tokenizer API documents the public ArcLM APIs in this category.",
    "page": "api/tokenizers.html",
    "section": "overview"
  },
  {
    "type": "section",
    "title": "Tokenizer",
    "description": "Simple native word tokenizer.",
    "page": "api/tokenizers.html",
    "section": "tokenizer"
  },
  {
    "type": "section",
    "title": "Tokenizer parameters",
    "description": "Tokenizer parameters",
    "page": "api/tokenizers.html",
    "section": "tokenizer-parameters"
  },
  {
    "type": "section",
    "title": "Tokenizer example",
    "description": "Tokenizer example",
    "page": "api/tokenizers.html",
    "section": "tokenizer-example"
  },
  {
    "type": "section",
    "title": "SentencePieceTokenizer",
    "description": "Native wrapper for SentencePiece BPE, unigram, character and word modes.",
    "page": "api/tokenizers.html",
    "section": "sentencepiecetokenizer"
  },
  {
    "type": "section",
    "title": "SentencePieceTokenizer parameters",
    "description": "SentencePieceTokenizer parameters",
    "page": "api/tokenizers.html",
    "section": "sentencepiecetokenizer-parameters"
  },
  {
    "type": "section",
    "title": "SentencePieceTokenizer example",
    "description": "SentencePieceTokenizer example",
    "page": "api/tokenizers.html",
    "section": "sentencepiecetokenizer-example"
  },
  {
    "type": "page",
    "title": "Model API",
    "description": "Public models APIs.",
    "page": "api/models.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "Overview",
    "description": "Model API documents the public ArcLM APIs in this category.",
    "page": "api/models.html",
    "section": "overview"
  },
  {
    "type": "section",
    "title": "ArcLM",
    "description": "Compact native causal language model.",
    "page": "api/models.html",
    "section": "arclm"
  },
  {
    "type": "section",
    "title": "ArcLM parameters",
    "description": "ArcLM parameters",
    "page": "api/models.html",
    "section": "arclm-parameters"
  },
  {
    "type": "section",
    "title": "ArcLM example",
    "description": "ArcLM example",
    "page": "api/models.html",
    "section": "arclm-example"
  },
  {
    "type": "section",
    "title": "model_support_matrix",
    "description": "Return the public model support table as JSON-safe rows.",
    "page": "api/models.html",
    "section": "model-support-matrix"
  },
  {
    "type": "section",
    "title": "model_support_matrix parameters",
    "description": "model_support_matrix parameters",
    "page": "api/models.html",
    "section": "model-support-matrix-parameters"
  },
  {
    "type": "section",
    "title": "model_support_matrix example",
    "description": "model_support_matrix example",
    "page": "api/models.html",
    "section": "model-support-matrix-example"
  },
  {
    "type": "page",
    "title": "Training API",
    "description": "Public training APIs.",
    "page": "api/training.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "Overview",
    "description": "Training API documents the public ArcLM APIs in this category.",
    "page": "api/training.html",
    "section": "overview"
  },
  {
    "type": "section",
    "title": "TrainingConfig",
    "description": "Configuration for native training.",
    "page": "api/training.html",
    "section": "trainingconfig"
  },
  {
    "type": "section",
    "title": "TrainingConfig parameters",
    "description": "TrainingConfig parameters",
    "page": "api/training.html",
    "section": "trainingconfig-parameters"
  },
  {
    "type": "section",
    "title": "TrainingConfig example",
    "description": "TrainingConfig example",
    "page": "api/training.html",
    "section": "trainingconfig-example"
  },
  {
    "type": "section",
    "title": "Trainer",
    "description": "Canonical native training loop.",
    "page": "api/training.html",
    "section": "trainer"
  },
  {
    "type": "section",
    "title": "Trainer parameters",
    "description": "Trainer parameters",
    "page": "api/training.html",
    "section": "trainer-parameters"
  },
  {
    "type": "section",
    "title": "Trainer example",
    "description": "Trainer example",
    "page": "api/training.html",
    "section": "trainer-example"
  },
  {
    "type": "section",
    "title": "validate_sft_records",
    "description": "Validate supervised fine-tuning records before formatting.",
    "page": "api/training.html",
    "section": "validate-sft-records"
  },
  {
    "type": "section",
    "title": "validate_sft_records parameters",
    "description": "validate_sft_records parameters",
    "page": "api/training.html",
    "section": "validate-sft-records-parameters"
  },
  {
    "type": "section",
    "title": "validate_sft_records example",
    "description": "validate_sft_records example",
    "page": "api/training.html",
    "section": "validate-sft-records-example"
  },
  {
    "type": "page",
    "title": "Checkpoint API",
    "description": "Public checkpoints APIs.",
    "page": "api/checkpoints.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "Overview",
    "description": "Checkpoint API documents the public ArcLM APIs in this category.",
    "page": "api/checkpoints.html",
    "section": "overview"
  },
  {
    "type": "section",
    "title": "inspect_checkpoint",
    "description": "Read safe checkpoint metadata and compatibility information.",
    "page": "api/checkpoints.html",
    "section": "inspect-checkpoint"
  },
  {
    "type": "section",
    "title": "inspect_checkpoint parameters",
    "description": "inspect_checkpoint parameters",
    "page": "api/checkpoints.html",
    "section": "inspect-checkpoint-parameters"
  },
  {
    "type": "section",
    "title": "inspect_checkpoint example",
    "description": "inspect_checkpoint example",
    "page": "api/checkpoints.html",
    "section": "inspect-checkpoint-example"
  },
  {
    "type": "page",
    "title": "Evaluation API",
    "description": "Public evaluation APIs.",
    "page": "api/evaluation.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "Overview",
    "description": "Evaluation API documents the public ArcLM APIs in this category.",
    "page": "api/evaluation.html",
    "section": "overview"
  },
  {
    "type": "section",
    "title": "Evaluator",
    "description": "Evaluate a model with canonical metrics.",
    "page": "api/evaluation.html",
    "section": "evaluator"
  },
  {
    "type": "section",
    "title": "Evaluator parameters",
    "description": "Evaluator parameters",
    "page": "api/evaluation.html",
    "section": "evaluator-parameters"
  },
  {
    "type": "section",
    "title": "Evaluator example",
    "description": "Evaluator example",
    "page": "api/evaluation.html",
    "section": "evaluator-example"
  },
  {
    "type": "section",
    "title": "build_evaluation_report",
    "description": "Wrap evaluation metrics in a JSON-safe report.",
    "page": "api/evaluation.html",
    "section": "build-evaluation-report"
  },
  {
    "type": "section",
    "title": "build_evaluation_report parameters",
    "description": "build_evaluation_report parameters",
    "page": "api/evaluation.html",
    "section": "build-evaluation-report-parameters"
  },
  {
    "type": "section",
    "title": "build_evaluation_report example",
    "description": "build_evaluation_report example",
    "page": "api/evaluation.html",
    "section": "build-evaluation-report-example"
  },
  {
    "type": "page",
    "title": "Inference API",
    "description": "Public inference APIs.",
    "page": "api/inference.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "Overview",
    "description": "Inference API documents the public ArcLM APIs in this category.",
    "page": "api/inference.html",
    "section": "overview"
  },
  {
    "type": "section",
    "title": "Generator",
    "description": "Generate bounded text from a native model.",
    "page": "api/inference.html",
    "section": "generator"
  },
  {
    "type": "section",
    "title": "Generator parameters",
    "description": "Generator parameters",
    "page": "api/inference.html",
    "section": "generator-parameters"
  },
  {
    "type": "section",
    "title": "Generator example",
    "description": "Generator example",
    "page": "api/inference.html",
    "section": "generator-example"
  },
  {
    "type": "page",
    "title": "Inspection API",
    "description": "Public inspection APIs.",
    "page": "api/inspection.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "Overview",
    "description": "Inspection API documents the public ArcLM APIs in this category.",
    "page": "api/inspection.html",
    "section": "overview"
  },
  {
    "type": "section",
    "title": "inspect_text",
    "description": "Return a PipelineTrace for one native generation step.",
    "page": "api/inspection.html",
    "section": "inspect-text"
  },
  {
    "type": "section",
    "title": "inspect_text parameters",
    "description": "inspect_text parameters",
    "page": "api/inspection.html",
    "section": "inspect-text-parameters"
  },
  {
    "type": "section",
    "title": "inspect_text example",
    "description": "inspect_text example",
    "page": "api/inspection.html",
    "section": "inspect-text-example"
  },
  {
    "type": "page",
    "title": "PEFT API",
    "description": "Public peft APIs.",
    "page": "api/peft.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "Overview",
    "description": "PEFT API documents the public ArcLM APIs in this category.",
    "page": "api/peft.html",
    "section": "overview"
  },
  {
    "type": "section",
    "title": "LoRAConfig",
    "description": "Configuration for native LoRA adapter experiments.",
    "page": "api/peft.html",
    "section": "loraconfig"
  },
  {
    "type": "section",
    "title": "LoRAConfig parameters",
    "description": "LoRAConfig parameters",
    "page": "api/peft.html",
    "section": "loraconfig-parameters"
  },
  {
    "type": "section",
    "title": "LoRAConfig example",
    "description": "LoRAConfig example",
    "page": "api/peft.html",
    "section": "loraconfig-example"
  },
  {
    "type": "page",
    "title": "Web API",
    "description": "Public web APIs.",
    "page": "api/web.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "Overview",
    "description": "Web API documents the public ArcLM APIs in this category.",
    "page": "api/web.html",
    "section": "overview"
  },
  {
    "type": "section",
    "title": "WebConfig",
    "description": "Configuration for the optional local Web API.",
    "page": "api/web.html",
    "section": "webconfig"
  },
  {
    "type": "section",
    "title": "WebConfig parameters",
    "description": "WebConfig parameters",
    "page": "api/web.html",
    "section": "webconfig-parameters"
  },
  {
    "type": "section",
    "title": "WebConfig example",
    "description": "WebConfig example",
    "page": "api/web.html",
    "section": "webconfig-example"
  },
  {
    "type": "page",
    "title": "Public API Index",
    "description": "Searchable public API catalog.",
    "page": "api/index.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "How to use this page",
    "description": "Use the search field to find public classes, functions and import paths. Deprecated imports are not recommended.",
    "page": "api/index.html",
    "section": "how-to-use-this-page"
  },
  {
    "type": "page",
    "title": "Plugins API",
    "description": "Experimental plugin interfaces.",
    "page": "api/plugins.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "Status",
    "description": "Plugin interfaces exist for advanced extension metadata. They are not required for the native workflow.",
    "page": "api/plugins.html",
    "section": "status"
  },
  {
    "type": "section",
    "title": "Limitations",
    "description": "Limitations",
    "page": "api/plugins.html",
    "section": "limitations"
  },
  {
    "type": "page",
    "title": "Registry API",
    "description": "Experimental registry surfaces.",
    "page": "api/registry.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "Status",
    "description": "Registry helpers are advanced extension surfaces. Normal users should prefer canonical imports.",
    "page": "api/registry.html",
    "section": "status"
  },
  {
    "type": "page",
    "title": "Utilities API",
    "description": "Small utility helpers.",
    "page": "api/utilities.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "Status",
    "description": "Utility modules are secondary. Prefer documented domain APIs for normal workflows.",
    "page": "api/utilities.html",
    "section": "status"
  },
  {
    "type": "page",
    "title": "Examples Hub",
    "description": "Self-contained examples.",
    "page": "examples/index.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "How examples work",
    "description": "Each example is embedded in the public site and available as a standalone download inside the site assets.",
    "page": "examples/index.html",
    "section": "how-examples-work"
  },
  {
    "type": "section",
    "title": "Filters",
    "description": "Filters",
    "page": "examples/index.html",
    "section": "filters"
  },
  {
    "type": "page",
    "title": "Dataset Examples",
    "description": "Self-contained examples.",
    "page": "examples/dataset-examples.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "How examples work",
    "description": "Each example is embedded in the public site and available as a standalone download inside the site assets.",
    "page": "examples/dataset-examples.html",
    "section": "how-examples-work"
  },
  {
    "type": "section",
    "title": "Included examples",
    "description": "Included examples",
    "page": "examples/dataset-examples.html",
    "section": "included-examples"
  },
  {
    "type": "page",
    "title": "Tokenizer Examples",
    "description": "Self-contained examples.",
    "page": "examples/tokenizer-examples.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "How examples work",
    "description": "Each example is embedded in the public site and available as a standalone download inside the site assets.",
    "page": "examples/tokenizer-examples.html",
    "section": "how-examples-work"
  },
  {
    "type": "section",
    "title": "Included examples",
    "description": "Included examples",
    "page": "examples/tokenizer-examples.html",
    "section": "included-examples"
  },
  {
    "type": "page",
    "title": "Model Examples",
    "description": "Self-contained examples.",
    "page": "examples/model-examples.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "How examples work",
    "description": "Each example is embedded in the public site and available as a standalone download inside the site assets.",
    "page": "examples/model-examples.html",
    "section": "how-examples-work"
  },
  {
    "type": "section",
    "title": "Included examples",
    "description": "Included examples",
    "page": "examples/model-examples.html",
    "section": "included-examples"
  },
  {
    "type": "page",
    "title": "Training Examples",
    "description": "Self-contained examples.",
    "page": "examples/training-examples.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "How examples work",
    "description": "Each example is embedded in the public site and available as a standalone download inside the site assets.",
    "page": "examples/training-examples.html",
    "section": "how-examples-work"
  },
  {
    "type": "section",
    "title": "Included examples",
    "description": "Included examples",
    "page": "examples/training-examples.html",
    "section": "included-examples"
  },
  {
    "type": "page",
    "title": "Evaluation Examples",
    "description": "Self-contained examples.",
    "page": "examples/evaluation-examples.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "How examples work",
    "description": "Each example is embedded in the public site and available as a standalone download inside the site assets.",
    "page": "examples/evaluation-examples.html",
    "section": "how-examples-work"
  },
  {
    "type": "section",
    "title": "Included examples",
    "description": "Included examples",
    "page": "examples/evaluation-examples.html",
    "section": "included-examples"
  },
  {
    "type": "page",
    "title": "Generation Examples",
    "description": "Self-contained examples.",
    "page": "examples/generation-examples.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "How examples work",
    "description": "Each example is embedded in the public site and available as a standalone download inside the site assets.",
    "page": "examples/generation-examples.html",
    "section": "how-examples-work"
  },
  {
    "type": "section",
    "title": "Included examples",
    "description": "Included examples",
    "page": "examples/generation-examples.html",
    "section": "included-examples"
  },
  {
    "type": "page",
    "title": "Complete Example Projects",
    "description": "Small downloadable public projects.",
    "page": "examples/complete-projects.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "What complete projects include",
    "description": "Each project explains goal, files, dataset, tokenizer, model configuration, training configuration, expected behavior, evaluation and generation notes.",
    "page": "examples/complete-projects.html",
    "section": "what-complete-projects-include"
  },
  {
    "type": "section",
    "title": "Projects",
    "description": "Projects",
    "page": "examples/complete-projects.html",
    "section": "projects"
  },
  {
    "type": "page",
    "title": "Module Explorer",
    "description": "Public-facing package organization.",
    "page": "reference/modules.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "Use canonical modules",
    "description": "Prefer arclm.datasets, arclm.tokenizers, arclm.models, arclm.training, arclm.checkpoints, arclm.evaluation, arclm.inference and arclm.inspection for new code.",
    "page": "reference/modules.html",
    "section": "use-canonical-modules"
  },
  {
    "type": "page",
    "title": "Supported Models",
    "description": "Editable model catalog with honest status labels.",
    "page": "reference/supported-models.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "Status meanings",
    "description": "Native means implemented directly by ArcLM. Compatible means handled through an optional integration boundary. Experimental means incomplete behavior. Unsupported means no current ArcLM path.",
    "page": "reference/supported-models.html",
    "section": "status-meanings"
  },
  {
    "type": "page",
    "title": "Dataset Formats",
    "description": "Accepted local dataset shapes and examples.",
    "page": "reference/dataset-formats.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "Choosing a format",
    "description": "Use Python records for scripts, JSONL for instruction data, CSV for tables and TXT for tiny causal text experiments.",
    "page": "reference/dataset-formats.html",
    "section": "choosing-a-format"
  },
  {
    "type": "page",
    "title": "Configuration Reference",
    "description": "Configuration fields users commonly set.",
    "page": "reference/configuration.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "Scope",
    "description": "This reference covers public configuration fields for model, training, evaluation, generation and web workflows.",
    "page": "reference/configuration.html",
    "section": "scope"
  },
  {
    "type": "page",
    "title": "Errors Reference",
    "description": "Stable user-facing errors and fixes.",
    "page": "reference/errors.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "How to read errors",
    "description": "Use the error code to find the meaning, common cause and recovery action.",
    "page": "reference/errors.html",
    "section": "how-to-read-errors"
  },
  {
    "type": "page",
    "title": "Status Legend",
    "description": "Meaning of public status labels.",
    "page": "reference/status-legend.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "Statuses",
    "description": "Statuses",
    "page": "reference/status-legend.html",
    "section": "statuses"
  },
  {
    "type": "page",
    "title": "Limitations",
    "description": "What ArcLM does not currently claim.",
    "page": "reference/limitations.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "Current limits",
    "description": "Current limits",
    "page": "reference/limitations.html",
    "section": "current-limits"
  },
  {
    "type": "api",
    "title": "load_dataset",
    "description": "Load in-memory records or supported local dataset files.",
    "page": "api/datasets.html",
    "section": "load-dataset"
  },
  {
    "type": "api",
    "title": "validate_records",
    "description": "Validate required dataset fields and return structured issues.",
    "page": "api/datasets.html",
    "section": "validate-records"
  },
  {
    "type": "api",
    "title": "build_dataset_report",
    "description": "Create JSON-safe dataset and token statistics.",
    "page": "api/datasets.html",
    "section": "build-dataset-report"
  },
  {
    "type": "api",
    "title": "Tokenizer",
    "description": "Simple native word tokenizer.",
    "page": "api/tokenizers.html",
    "section": "tokenizer"
  },
  {
    "type": "api",
    "title": "SentencePieceTokenizer",
    "description": "Native wrapper for SentencePiece BPE, unigram, character and word modes.",
    "page": "api/tokenizers.html",
    "section": "sentencepiecetokenizer"
  },
  {
    "type": "api",
    "title": "ArcLM",
    "description": "Compact native causal language model.",
    "page": "api/models.html",
    "section": "arclm"
  },
  {
    "type": "api",
    "title": "model_support_matrix",
    "description": "Return the public model support table as JSON-safe rows.",
    "page": "api/models.html",
    "section": "model-support-matrix"
  },
  {
    "type": "api",
    "title": "TrainingConfig",
    "description": "Configuration for native training.",
    "page": "api/training.html",
    "section": "trainingconfig"
  },
  {
    "type": "api",
    "title": "Trainer",
    "description": "Canonical native training loop.",
    "page": "api/training.html",
    "section": "trainer"
  },
  {
    "type": "api",
    "title": "LoRAConfig",
    "description": "Configuration for native LoRA adapter experiments.",
    "page": "api/peft.html",
    "section": "loraconfig"
  },
  {
    "type": "api",
    "title": "validate_sft_records",
    "description": "Validate supervised fine-tuning records before formatting.",
    "page": "api/training.html",
    "section": "validate-sft-records"
  },
  {
    "type": "api",
    "title": "inspect_checkpoint",
    "description": "Read safe checkpoint metadata and compatibility information.",
    "page": "api/checkpoints.html",
    "section": "inspect-checkpoint"
  },
  {
    "type": "api",
    "title": "Evaluator",
    "description": "Evaluate a model with canonical metrics.",
    "page": "api/evaluation.html",
    "section": "evaluator"
  },
  {
    "type": "api",
    "title": "build_evaluation_report",
    "description": "Wrap evaluation metrics in a JSON-safe report.",
    "page": "api/evaluation.html",
    "section": "build-evaluation-report"
  },
  {
    "type": "api",
    "title": "Generator",
    "description": "Generate bounded text from a native model.",
    "page": "api/inference.html",
    "section": "generator"
  },
  {
    "type": "api",
    "title": "inspect_text",
    "description": "Return a PipelineTrace for one native generation step.",
    "page": "api/inspection.html",
    "section": "inspect-text"
  },
  {
    "type": "api",
    "title": "WebConfig",
    "description": "Configuration for the optional local Web API.",
    "page": "api/web.html",
    "section": "webconfig"
  },
  {
    "type": "model",
    "title": "Native ArcLM",
    "description": "Implemented directly by ArcLM as a compact causal language model.",
    "page": "reference/supported-models.html",
    "section": "native-arclm"
  },
  {
    "type": "model",
    "title": "Tiny GPT-2 reference",
    "description": "Compatibility reference only; not a claim about full GPT-2 family coverage.",
    "page": "reference/supported-models.html",
    "section": "gpt2-tiny-reference"
  },
  {
    "type": "model",
    "title": "Qwen3 0.6B",
    "description": "Exact model path is recognized; complete load, training, SFT, LoRA and CUDA behavior are not guaranteed.",
    "page": "reference/supported-models.html",
    "section": "qwen3-0-6b"
  },
  {
    "type": "model",
    "title": "Native BERT, T5, diffusion and multimodal models",
    "description": "ArcLM does not currently provide these native model families.",
    "page": "reference/supported-models.html",
    "section": "native-bert-t5-diffusion"
  },
  {
    "type": "dataset format",
    "title": "Python list of dictionaries",
    "description": "Small scripts, tests and notebooks.",
    "page": "reference/dataset-formats.html",
    "section": "python-records"
  },
  {
    "type": "dataset format",
    "title": "JSON",
    "description": "Small structured local datasets.",
    "page": "reference/dataset-formats.html",
    "section": "json"
  },
  {
    "type": "dataset format",
    "title": "JSONL",
    "description": "Instruction datasets and append-friendly local data.",
    "page": "reference/dataset-formats.html",
    "section": "jsonl"
  },
  {
    "type": "dataset format",
    "title": "CSV",
    "description": "Tabular text data.",
    "page": "reference/dataset-formats.html",
    "section": "csv"
  },
  {
    "type": "dataset format",
    "title": "TXT",
    "description": "Tiny causal language modeling experiments.",
    "page": "reference/dataset-formats.html",
    "section": "txt"
  },
  {
    "type": "configuration",
    "title": "Model: vocab_size",
    "description": "Must match tokenizer vocabulary size.",
    "page": "reference/configuration.html",
    "section": "configuration-fields"
  },
  {
    "type": "configuration",
    "title": "Model: embed_dim",
    "description": "Embedding width for the native model.",
    "page": "reference/configuration.html",
    "section": "configuration-fields"
  },
  {
    "type": "configuration",
    "title": "Model: block_size",
    "description": "Maximum context length.",
    "page": "reference/configuration.html",
    "section": "configuration-fields"
  },
  {
    "type": "configuration",
    "title": "Model: num_blocks",
    "description": "Transformer block count.",
    "page": "reference/configuration.html",
    "section": "configuration-fields"
  },
  {
    "type": "configuration",
    "title": "Training: epochs",
    "description": "Training epochs.",
    "page": "reference/configuration.html",
    "section": "configuration-fields"
  },
  {
    "type": "configuration",
    "title": "Training: batch_size",
    "description": "Examples per batch.",
    "page": "reference/configuration.html",
    "section": "configuration-fields"
  },
  {
    "type": "configuration",
    "title": "Training: learning_rate",
    "description": "Optimizer learning rate.",
    "page": "reference/configuration.html",
    "section": "configuration-fields"
  },
  {
    "type": "configuration",
    "title": "Training: gradient_accumulation_steps",
    "description": "Accumulate gradients before optimizer step.",
    "page": "reference/configuration.html",
    "section": "configuration-fields"
  },
  {
    "type": "configuration",
    "title": "Training: precision",
    "description": "fp32, fp16 or bf16 when available.",
    "page": "reference/configuration.html",
    "section": "configuration-fields"
  },
  {
    "type": "configuration",
    "title": "Evaluation: maximum_examples",
    "description": "Bounded evaluation size for local Studio jobs.",
    "page": "reference/configuration.html",
    "section": "configuration-fields"
  },
  {
    "type": "configuration",
    "title": "Generation: max_new_tokens",
    "description": "Maximum generated tokens.",
    "page": "reference/configuration.html",
    "section": "configuration-fields"
  },
  {
    "type": "configuration",
    "title": "Generation: temperature",
    "description": "Sampling temperature.",
    "page": "reference/configuration.html",
    "section": "configuration-fields"
  },
  {
    "type": "configuration",
    "title": "Web: workspace_root",
    "description": "Local Studio workspace root.",
    "page": "reference/configuration.html",
    "section": "configuration-fields"
  },
  {
    "type": "configuration",
    "title": "Web: max_generation_history",
    "description": "Bounded stored generation history.",
    "page": "reference/configuration.html",
    "section": "configuration-fields"
  },
  {
    "type": "error",
    "title": "dataset_tokenizer_required",
    "description": "A tokenizer is required for token statistics or token inspection.",
    "page": "reference/errors.html",
    "section": "dataset_tokenizer_required"
  },
  {
    "type": "error",
    "title": "tokenizer_vocab_model_mismatch",
    "description": "Model vocabulary size does not match tokenizer vocabulary size.",
    "page": "reference/errors.html",
    "section": "tokenizer_vocab_model_mismatch"
  },
  {
    "type": "error",
    "title": "training_tokenizer_model_mismatch",
    "description": "The training tokenizer does not match the selected model.",
    "page": "reference/errors.html",
    "section": "training_tokenizer_model_mismatch"
  },
  {
    "type": "error",
    "title": "training_job_already_running",
    "description": "Another local training job is active.",
    "page": "reference/errors.html",
    "section": "training_job_already_running"
  },
  {
    "type": "error",
    "title": "checkpoint_not_found",
    "description": "The selected checkpoint ID is not available in the project.",
    "page": "reference/errors.html",
    "section": "checkpoint_not_found"
  },
  {
    "type": "error",
    "title": "checkpoint_incompatible",
    "description": "Checkpoint metadata or tensor shapes do not match the expected native model.",
    "page": "reference/errors.html",
    "section": "checkpoint_incompatible"
  },
  {
    "type": "error",
    "title": "evaluation_tokenizer_mismatch",
    "description": "Evaluation tokenizer differs from checkpoint tokenizer.",
    "page": "reference/errors.html",
    "section": "evaluation_tokenizer_mismatch"
  },
  {
    "type": "error",
    "title": "generation_context_exceeded",
    "description": "Prompt plus requested tokens exceed context length.",
    "page": "reference/errors.html",
    "section": "generation_context_exceeded"
  },
  {
    "type": "error",
    "title": "compute_resource_busy",
    "description": "A local training or evaluation worker is active.",
    "page": "reference/errors.html",
    "section": "compute_resource_busy"
  },
  {
    "type": "example",
    "title": "Load Python records",
    "description": "How to start from in-memory data.",
    "page": "examples/index.html",
    "section": "example-cards"
  },
  {
    "type": "example",
    "title": "Create and inspect a Word tokenizer",
    "description": "Vocabulary, token IDs and decoding.",
    "page": "examples/index.html",
    "section": "example-cards"
  },
  {
    "type": "example",
    "title": "Create a tiny native model",
    "description": "Native ArcLM model configuration.",
    "page": "examples/index.html",
    "section": "example-cards"
  },
  {
    "type": "example",
    "title": "Inspect a native pipeline step",
    "description": "Tokens, tensor shapes, selected token and decoded text.",
    "page": "examples/index.html",
    "section": "example-cards"
  },
  {
    "type": "example",
    "title": "Validate instruction records",
    "description": "SFT record contract.",
    "page": "examples/index.html",
    "section": "example-cards"
  },
  {
    "type": "example",
    "title": "Create an evaluation report object",
    "description": "JSON-safe evaluation report shape.",
    "page": "examples/index.html",
    "section": "example-cards"
  },
  {
    "type": "example",
    "title": "Build a dataset report",
    "description": "Record counts, text lengths and token statistics.",
    "page": "examples/index.html",
    "section": "example-cards"
  },
  {
    "type": "example",
    "title": "Read the model support matrix",
    "description": "Honest native, compatible and experimental model status.",
    "page": "examples/index.html",
    "section": "example-cards"
  },
  {
    "type": "example project",
    "title": "Tiny text model",
    "description": "Train a tiny local causal LM on synthetic text.",
    "page": "examples/complete-projects.html",
    "section": "complete-projects"
  },
  {
    "type": "example project",
    "title": "Instruction fine-tuning project",
    "description": "Validate instruction/response records and prepare an SFT workflow.",
    "page": "examples/complete-projects.html",
    "section": "complete-projects"
  },
  {
    "type": "example project",
    "title": "Pipeline inspection project",
    "description": "Show token IDs, tensor shapes and selected token from one native step.",
    "page": "examples/complete-projects.html",
    "section": "complete-projects"
  }
];
