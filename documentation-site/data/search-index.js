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
    "title": "Pipelines",
    "description": "Compose the verified native lifecycle.",
    "page": "guides/pipelines.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "Lifecycle",
    "description": "ArcLM pipelines are the practical sequence that connects records, tokenizer, model, trainer, checkpoint, evaluator, generator and inspection trace.",
    "page": "guides/pipelines.html",
    "section": "lifecycle"
  },
  {
    "type": "section",
    "title": "Native flow",
    "description": "Native flow",
    "page": "guides/pipelines.html",
    "section": "native-flow"
  },
  {
    "type": "section",
    "title": "Inspect the pipeline",
    "description": "Inspect the pipeline",
    "page": "guides/pipelines.html",
    "section": "inspect-the-pipeline"
  },
  {
    "type": "section",
    "title": "Limits",
    "description": "Limits",
    "page": "guides/pipelines.html",
    "section": "limits"
  },
  {
    "type": "page",
    "title": "Agent Runtime",
    "description": "Run deterministic provider-independent tool loops.",
    "page": "guides/agent-runtime.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "Runtime shape",
    "description": "Agent Runtime separates model responses, tool schemas, sessions, traces, permissions and runner stop conditions. The core runtime does not require a hosted provider.",
    "page": "guides/agent-runtime.html",
    "section": "runtime-shape"
  },
  {
    "type": "section",
    "title": "Create a tool",
    "description": "Create a tool",
    "page": "guides/agent-runtime.html",
    "section": "create-a-tool"
  },
  {
    "type": "section",
    "title": "Boundaries",
    "description": "Boundaries",
    "page": "guides/agent-runtime.html",
    "section": "boundaries"
  },
  {
    "type": "page",
    "title": "Agent Tools",
    "description": "Define typed local tools with validation and permissions.",
    "page": "guides/agent-tools.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "Tool contract",
    "description": "Tools are typed Python callables wrapped with metadata. Arguments are validated before execution and tool calls are recorded in the session trace.",
    "page": "guides/agent-tools.html",
    "section": "tool-contract"
  },
  {
    "type": "section",
    "title": "Tool schema",
    "description": "Tool schema",
    "page": "guides/agent-tools.html",
    "section": "tool-schema"
  },
  {
    "type": "section",
    "title": "Security notes",
    "description": "Security notes",
    "page": "guides/agent-tools.html",
    "section": "security-notes"
  },
  {
    "type": "page",
    "title": "Security",
    "description": "Use Security Core for local policies, redaction, hashing, signatures and encryption.",
    "page": "guides/security.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "Security Core",
    "description": "Security Core provides typed policy objects, safe status reports, AEAD encryption envelopes, signed manifests, hashing helpers, redaction and Web/Agent boundary helpers.",
    "page": "guides/security.html",
    "section": "security-core"
  },
  {
    "type": "section",
    "title": "Encrypt and reject tampering",
    "description": "Encrypt and reject tampering",
    "page": "guides/security.html",
    "section": "encrypt-and-reject-tampering"
  },
  {
    "type": "section",
    "title": "Boundaries",
    "description": "Boundaries",
    "page": "guides/security.html",
    "section": "boundaries"
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
    "title": "ArcLM Lab",
    "description": "Learn ArcLM architecture through four progressive levels.",
    "page": "guides/lab.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "Purpose",
    "description": "The Lab teaches ArcLM concepts through learner exercises. It is educational scaffolding, not proof that every topic is a production feature.",
    "page": "guides/lab.html",
    "section": "purpose"
  },
  {
    "type": "section",
    "title": "Levels",
    "description": "Levels",
    "page": "guides/lab.html",
    "section": "levels"
  },
  {
    "type": "section",
    "title": "Run the Lab",
    "description": "Run the Lab",
    "page": "guides/lab.html",
    "section": "run-the-lab"
  },
  {
    "type": "page",
    "title": "Root API",
    "description": "Public root APIs.",
    "page": "api/root.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "Overview",
    "description": "Root API documents the public ArcLM APIs in this category.",
    "page": "api/root.html",
    "section": "overview"
  },
  {
    "type": "section",
    "title": "Accuracy",
    "description": "Berekent accuracy voor classificatie of token logits. Canonical import: from arclm import Accuracy. Fully qualified name: arclm.Accuracy. Status: Stable.",
    "page": "api/root.html",
    "section": "accuracy"
  },
  {
    "type": "section",
    "title": "Accuracy parameters",
    "description": "Accuracy parameters",
    "page": "api/root.html",
    "section": "accuracy-parameters"
  },
  {
    "type": "section",
    "title": "Accuracy example",
    "description": "Accuracy example",
    "page": "api/root.html",
    "section": "accuracy-example"
  },
  {
    "type": "section",
    "title": "AdaptedModelBundle",
    "description": "ArcLM model and metadata produced from a normalized checkpoint. Canonical import: from arclm import AdaptedModelBundle. Fully qualified name: arclm.AdaptedModelBundle. Status: Stable.",
    "page": "api/root.html",
    "section": "adaptedmodelbundle"
  },
  {
    "type": "section",
    "title": "AdaptedModelBundle parameters",
    "description": "AdaptedModelBundle parameters",
    "page": "api/root.html",
    "section": "adaptedmodelbundle-parameters"
  },
  {
    "type": "section",
    "title": "AdaptedModelBundle example",
    "description": "AdaptedModelBundle example",
    "page": "api/root.html",
    "section": "adaptedmodelbundle-example"
  },
  {
    "type": "section",
    "title": "And",
    "description": "Logische AND met een of meer conjuncties. Canonical import: from arclm import And. Fully qualified name: arclm.And. Status: Stable.",
    "page": "api/root.html",
    "section": "and"
  },
  {
    "type": "section",
    "title": "And parameters",
    "description": "And parameters",
    "page": "api/root.html",
    "section": "and-parameters"
  },
  {
    "type": "section",
    "title": "And example",
    "description": "And example",
    "page": "api/root.html",
    "section": "and-example"
  },
  {
    "type": "section",
    "title": "ArcLM",
    "description": "Compact causal language model for next-token prediction. Canonical import: from arclm import ArcLM. Fully qualified name: arclm.ArcLM. Status: Stable.",
    "page": "api/root.html",
    "section": "arclm"
  },
  {
    "type": "section",
    "title": "ArcLM parameters",
    "description": "ArcLM parameters",
    "page": "api/root.html",
    "section": "arclm-parameters"
  },
  {
    "type": "section",
    "title": "ArcLM example",
    "description": "ArcLM example",
    "page": "api/root.html",
    "section": "arclm-example"
  },
  {
    "type": "section",
    "title": "AutoModel",
    "description": "Factory for ArcLM model classes supported by the current package. Canonical import: from arclm import AutoModel. Fully qualified name: arclm.AutoModel. Status: Stable.",
    "page": "api/root.html",
    "section": "automodel"
  },
  {
    "type": "section",
    "title": "AutoModel parameters",
    "description": "AutoModel parameters",
    "page": "api/root.html",
    "section": "automodel-parameters"
  },
  {
    "type": "section",
    "title": "AutoModel example",
    "description": "AutoModel example",
    "page": "api/root.html",
    "section": "automodel-example"
  },
  {
    "type": "section",
    "title": "AutoTokenizer",
    "description": "Maakt ondersteunde ArcLM tokenizers vanuit config of type-naam. Canonical import: from arclm import AutoTokenizer. Fully qualified name: arclm.AutoTokenizer. Status: Stable.",
    "page": "api/root.html",
    "section": "autotokenizer"
  },
  {
    "type": "section",
    "title": "AutoTokenizer parameters",
    "description": "AutoTokenizer parameters",
    "page": "api/root.html",
    "section": "autotokenizer-parameters"
  },
  {
    "type": "section",
    "title": "AutoTokenizer example",
    "description": "AutoTokenizer example",
    "page": "api/root.html",
    "section": "autotokenizer-example"
  },
  {
    "type": "section",
    "title": "BaseAugmenter",
    "description": "Basis class voor eigen data augmenters. Canonical import: from arclm import BaseAugmenter. Fully qualified name: arclm.BaseAugmenter. Status: Stable.",
    "page": "api/root.html",
    "section": "baseaugmenter"
  },
  {
    "type": "section",
    "title": "BaseAugmenter parameters",
    "description": "BaseAugmenter parameters",
    "page": "api/root.html",
    "section": "baseaugmenter-parameters"
  },
  {
    "type": "section",
    "title": "BaseAugmenter example",
    "description": "BaseAugmenter example",
    "page": "api/root.html",
    "section": "baseaugmenter-example"
  },
  {
    "type": "section",
    "title": "BaseCallback",
    "description": "Basis class voor eigen training callbacks. Canonical import: from arclm import BaseCallback. Fully qualified name: arclm.BaseCallback. Status: Stable.",
    "page": "api/root.html",
    "section": "basecallback"
  },
  {
    "type": "section",
    "title": "BaseCallback parameters",
    "description": "BaseCallback parameters",
    "page": "api/root.html",
    "section": "basecallback-parameters"
  },
  {
    "type": "section",
    "title": "BaseCallback example",
    "description": "BaseCallback example",
    "page": "api/root.html",
    "section": "basecallback-example"
  },
  {
    "type": "section",
    "title": "BaseCleaner",
    "description": "Basis class voor eigen data cleaners. Canonical import: from arclm import BaseCleaner. Fully qualified name: arclm.BaseCleaner. Status: Stable.",
    "page": "api/root.html",
    "section": "basecleaner"
  },
  {
    "type": "section",
    "title": "BaseCleaner parameters",
    "description": "BaseCleaner parameters",
    "page": "api/root.html",
    "section": "basecleaner-parameters"
  },
  {
    "type": "section",
    "title": "BaseCleaner example",
    "description": "BaseCleaner example",
    "page": "api/root.html",
    "section": "basecleaner-example"
  },
  {
    "type": "section",
    "title": "BaseDataset",
    "description": "Basis class voor datasets met lengte en index-toegang. Canonical import: from arclm import BaseDataset. Fully qualified name: arclm.BaseDataset. Status: Stable.",
    "page": "api/root.html",
    "section": "basedataset"
  },
  {
    "type": "section",
    "title": "BaseDataset parameters",
    "description": "BaseDataset parameters",
    "page": "api/root.html",
    "section": "basedataset-parameters"
  },
  {
    "type": "section",
    "title": "BaseDataset example",
    "description": "BaseDataset example",
    "page": "api/root.html",
    "section": "basedataset-example"
  },
  {
    "type": "section",
    "title": "BaseDataStep",
    "description": "Basis class voor een stap die een voorbeeld verwerkt. Canonical import: from arclm import BaseDataStep. Fully qualified name: arclm.BaseDataStep. Status: Stable.",
    "page": "api/root.html",
    "section": "basedatastep"
  },
  {
    "type": "section",
    "title": "BaseDataStep parameters",
    "description": "BaseDataStep parameters",
    "page": "api/root.html",
    "section": "basedatastep-parameters"
  },
  {
    "type": "section",
    "title": "BaseDataStep example",
    "description": "BaseDataStep example",
    "page": "api/root.html",
    "section": "basedatastep-example"
  },
  {
    "type": "section",
    "title": "BaseDeduplicator",
    "description": "Basis class voor deduplicatie over een hele dataset. Canonical import: from arclm import BaseDeduplicator. Fully qualified name: arclm.BaseDeduplicator. Status: Stable.",
    "page": "api/root.html",
    "section": "basededuplicator"
  },
  {
    "type": "section",
    "title": "BaseDeduplicator parameters",
    "description": "BaseDeduplicator parameters",
    "page": "api/root.html",
    "section": "basededuplicator-parameters"
  },
  {
    "type": "section",
    "title": "BaseDeduplicator example",
    "description": "BaseDeduplicator example",
    "page": "api/root.html",
    "section": "basededuplicator-example"
  },
  {
    "type": "section",
    "title": "BaseEvaluationCallback",
    "description": "Basis class voor eigen evaluation callbacks. Canonical import: from arclm import BaseEvaluationCallback. Fully qualified name: arclm.BaseEvaluationCallback. Status: Stable.",
    "page": "api/root.html",
    "section": "baseevaluationcallback"
  },
  {
    "type": "section",
    "title": "BaseEvaluationCallback parameters",
    "description": "BaseEvaluationCallback parameters",
    "page": "api/root.html",
    "section": "baseevaluationcallback-parameters"
  },
  {
    "type": "section",
    "title": "BaseEvaluationCallback example",
    "description": "BaseEvaluationCallback example",
    "page": "api/root.html",
    "section": "baseevaluationcallback-example"
  },
  {
    "type": "section",
    "title": "BaseEvaluator",
    "description": "Basis class voor eigen evaluators. Canonical import: from arclm import BaseEvaluator. Fully qualified name: arclm.BaseEvaluator. Status: Stable.",
    "page": "api/root.html",
    "section": "baseevaluator"
  },
  {
    "type": "section",
    "title": "BaseEvaluator parameters",
    "description": "BaseEvaluator parameters",
    "page": "api/root.html",
    "section": "baseevaluator-parameters"
  },
  {
    "type": "section",
    "title": "BaseEvaluator example",
    "description": "BaseEvaluator example",
    "page": "api/root.html",
    "section": "baseevaluator-example"
  },
  {
    "type": "section",
    "title": "BaseFineTuner",
    "description": "Basis class voor developers die een eigen fine-tuner willen maken. Canonical import: from arclm import BaseFineTuner. Fully qualified name: arclm.BaseFineTuner. Status: Stable.",
    "page": "api/root.html",
    "section": "basefinetuner"
  },
  {
    "type": "section",
    "title": "BaseFineTuner parameters",
    "description": "BaseFineTuner parameters",
    "page": "api/root.html",
    "section": "basefinetuner-parameters"
  },
  {
    "type": "section",
    "title": "BaseFineTuner example",
    "description": "BaseFineTuner example",
    "page": "api/root.html",
    "section": "basefinetuner-example"
  },
  {
    "type": "section",
    "title": "BaseMetric",
    "description": "Basis class voor developers die een eigen metric willen maken. Canonical import: from arclm import BaseMetric. Fully qualified name: arclm.BaseMetric. Status: Stable.",
    "page": "api/root.html",
    "section": "basemetric"
  },
  {
    "type": "section",
    "title": "BaseMetric parameters",
    "description": "BaseMetric parameters",
    "page": "api/root.html",
    "section": "basemetric-parameters"
  },
  {
    "type": "section",
    "title": "BaseMetric example",
    "description": "BaseMetric example",
    "page": "api/root.html",
    "section": "basemetric-example"
  },
  {
    "type": "section",
    "title": "BaseModelAdapter",
    "description": "Basis class voor adapters tussen twee model implementaties. Canonical import: from arclm import BaseModelAdapter. Fully qualified name: arclm.BaseModelAdapter. Status: Stable.",
    "page": "api/root.html",
    "section": "basemodeladapter"
  },
  {
    "type": "section",
    "title": "BaseModelAdapter parameters",
    "description": "BaseModelAdapter parameters",
    "page": "api/root.html",
    "section": "basemodeladapter-parameters"
  },
  {
    "type": "section",
    "title": "BaseModelAdapter example",
    "description": "BaseModelAdapter example",
    "page": "api/root.html",
    "section": "basemodeladapter-example"
  },
  {
    "type": "section",
    "title": "BaseModelLoader",
    "description": "Basis class voor model loaders die een model en metadata geven. Canonical import: from arclm import BaseModelLoader. Fully qualified name: arclm.BaseModelLoader. Status: Stable.",
    "page": "api/root.html",
    "section": "basemodelloader"
  },
  {
    "type": "section",
    "title": "BaseModelLoader parameters",
    "description": "BaseModelLoader parameters",
    "page": "api/root.html",
    "section": "basemodelloader-parameters"
  },
  {
    "type": "section",
    "title": "BaseModelLoader example",
    "description": "BaseModelLoader example",
    "page": "api/root.html",
    "section": "basemodelloader-example"
  },
  {
    "type": "section",
    "title": "BaseStreamingDataset",
    "description": "Basis class voor datasets die je alleen kunt doorlopen. Canonical import: from arclm import BaseStreamingDataset. Fully qualified name: arclm.BaseStreamingDataset. Status: Stable.",
    "page": "api/root.html",
    "section": "basestreamingdataset"
  },
  {
    "type": "section",
    "title": "BaseStreamingDataset parameters",
    "description": "BaseStreamingDataset parameters",
    "page": "api/root.html",
    "section": "basestreamingdataset-parameters"
  },
  {
    "type": "section",
    "title": "BaseStreamingDataset example",
    "description": "BaseStreamingDataset example",
    "page": "api/root.html",
    "section": "basestreamingdataset-example"
  },
  {
    "type": "section",
    "title": "BaseSyntheticDataGenerator",
    "description": "Basis class voor eigen synthetic-data generators. Canonical import: from arclm import BaseSyntheticDataGenerator. Fully qualified name: arclm.BaseSyntheticDataGenerator. Status: Stable.",
    "page": "api/root.html",
    "section": "basesyntheticdatagenerator"
  },
  {
    "type": "section",
    "title": "BaseSyntheticDataGenerator parameters",
    "description": "BaseSyntheticDataGenerator parameters",
    "page": "api/root.html",
    "section": "basesyntheticdatagenerator-parameters"
  },
  {
    "type": "section",
    "title": "BaseSyntheticDataGenerator example",
    "description": "BaseSyntheticDataGenerator example",
    "page": "api/root.html",
    "section": "basesyntheticdatagenerator-example"
  },
  {
    "type": "section",
    "title": "BaseTrainer",
    "description": "Basis class voor developers die een eigen trainer willen maken. Canonical import: from arclm import BaseTrainer. Fully qualified name: arclm.BaseTrainer. Status: Stable.",
    "page": "api/root.html",
    "section": "basetrainer"
  },
  {
    "type": "section",
    "title": "BaseTrainer parameters",
    "description": "BaseTrainer parameters",
    "page": "api/root.html",
    "section": "basetrainer-parameters"
  },
  {
    "type": "section",
    "title": "BaseTrainer example",
    "description": "BaseTrainer example",
    "page": "api/root.html",
    "section": "basetrainer-example"
  },
  {
    "type": "section",
    "title": "BaseTrainingPipeline",
    "description": "Basis class voor aanpasbare training pipelines. Canonical import: from arclm import BaseTrainingPipeline. Fully qualified name: arclm.BaseTrainingPipeline. Status: Stable.",
    "page": "api/root.html",
    "section": "basetrainingpipeline"
  },
  {
    "type": "section",
    "title": "BaseTrainingPipeline parameters",
    "description": "BaseTrainingPipeline parameters",
    "page": "api/root.html",
    "section": "basetrainingpipeline-parameters"
  },
  {
    "type": "section",
    "title": "BaseTrainingPipeline example",
    "description": "BaseTrainingPipeline example",
    "page": "api/root.html",
    "section": "basetrainingpipeline-example"
  },
  {
    "type": "section",
    "title": "Biconditional",
    "description": "Logische zin die waar is als beide kanten gelijk zijn. Canonical import: from arclm import Biconditional. Fully qualified name: arclm.Biconditional. Status: Stable.",
    "page": "api/root.html",
    "section": "biconditional"
  },
  {
    "type": "section",
    "title": "Biconditional parameters",
    "description": "Biconditional parameters",
    "page": "api/root.html",
    "section": "biconditional-parameters"
  },
  {
    "type": "section",
    "title": "Biconditional example",
    "description": "Biconditional example",
    "page": "api/root.html",
    "section": "biconditional-example"
  },
  {
    "type": "section",
    "title": "ConceptBenchmarkCase",
    "description": "Expected concept relationships for a prompt. Canonical import: from arclm import ConceptBenchmarkCase. Fully qualified name: arclm.ConceptBenchmarkCase. Status: Stable.",
    "page": "api/root.html",
    "section": "conceptbenchmarkcase"
  },
  {
    "type": "section",
    "title": "ConceptBenchmarkCase parameters",
    "description": "ConceptBenchmarkCase parameters",
    "page": "api/root.html",
    "section": "conceptbenchmarkcase-parameters"
  },
  {
    "type": "section",
    "title": "ConceptBenchmarkCase example",
    "description": "ConceptBenchmarkCase example",
    "page": "api/root.html",
    "section": "conceptbenchmarkcase-example"
  },
  {
    "type": "section",
    "title": "ConceptBenchmarkResult",
    "description": "Concept benchmark score for one prompt. Canonical import: from arclm import ConceptBenchmarkResult. Fully qualified name: arclm.ConceptBenchmarkResult. Status: Stable.",
    "page": "api/root.html",
    "section": "conceptbenchmarkresult"
  },
  {
    "type": "section",
    "title": "ConceptBenchmarkResult parameters",
    "description": "ConceptBenchmarkResult parameters",
    "page": "api/root.html",
    "section": "conceptbenchmarkresult-parameters"
  },
  {
    "type": "section",
    "title": "ConceptBenchmarkResult example",
    "description": "ConceptBenchmarkResult example",
    "page": "api/root.html",
    "section": "conceptbenchmarkresult-example"
  },
  {
    "type": "section",
    "title": "Config",
    "description": "Houdt alle belangrijke ArcLM instellingen bij. Canonical import: from arclm import Config. Fully qualified name: arclm.Config. Status: Stable.",
    "page": "api/root.html",
    "section": "config"
  },
  {
    "type": "section",
    "title": "Config parameters",
    "description": "Config parameters",
    "page": "api/root.html",
    "section": "config-parameters"
  },
  {
    "type": "section",
    "title": "Config example",
    "description": "Config example",
    "page": "api/root.html",
    "section": "config-example"
  },
  {
    "type": "section",
    "title": "DataBundle",
    "description": "Bundel met tokens, tokenizer en loaders voor training. Canonical import: from arclm import DataBundle. Fully qualified name: arclm.DataBundle. Status: Stable.",
    "page": "api/root.html",
    "section": "databundle"
  },
  {
    "type": "section",
    "title": "DataBundle parameters",
    "description": "DataBundle parameters",
    "page": "api/root.html",
    "section": "databundle-parameters"
  },
  {
    "type": "section",
    "title": "DataBundle example",
    "description": "DataBundle example",
    "page": "api/root.html",
    "section": "databundle-example"
  },
  {
    "type": "section",
    "title": "DataPipeline",
    "description": "Voert meerdere data-stappen na elkaar uit. Canonical import: from arclm import DataPipeline. Fully qualified name: arclm.DataPipeline. Status: Stable.",
    "page": "api/root.html",
    "section": "datapipeline"
  },
  {
    "type": "section",
    "title": "DataPipeline parameters",
    "description": "DataPipeline parameters",
    "page": "api/root.html",
    "section": "datapipeline-parameters"
  },
  {
    "type": "section",
    "title": "DataPipeline example",
    "description": "DataPipeline example",
    "page": "api/root.html",
    "section": "datapipeline-example"
  },
  {
    "type": "section",
    "title": "DataProcessor",
    "description": "Compatibility-friendly entry point for ``ProcessedDataset`` workflows. Canonical import: from arclm import DataProcessor. Fully qualified name: arclm.DataProcessor. Status: Stable.",
    "page": "api/root.html",
    "section": "dataprocessor"
  },
  {
    "type": "section",
    "title": "DataProcessor parameters",
    "description": "DataProcessor parameters",
    "page": "api/root.html",
    "section": "dataprocessor-parameters"
  },
  {
    "type": "section",
    "title": "DataProcessor example",
    "description": "DataProcessor example",
    "page": "api/root.html",
    "section": "dataprocessor-example"
  },
  {
    "type": "section",
    "title": "DatasetConfig",
    "description": "Configuratie voor `load_dataset` wanneer je opties wilt hergebruiken. Canonical import: from arclm import DatasetConfig. Fully qualified name: arclm.DatasetConfig. Status: Stable.",
    "page": "api/root.html",
    "section": "datasetconfig"
  },
  {
    "type": "section",
    "title": "DatasetConfig parameters",
    "description": "DatasetConfig parameters",
    "page": "api/root.html",
    "section": "datasetconfig-parameters"
  },
  {
    "type": "section",
    "title": "DatasetConfig example",
    "description": "DatasetConfig example",
    "page": "api/root.html",
    "section": "datasetconfig-example"
  },
  {
    "type": "section",
    "title": "DatasetLoader",
    "description": "Laadt datasets uit simpele lokale bronnen. Canonical import: from arclm import DatasetLoader. Fully qualified name: arclm.DatasetLoader. Status: Stable.",
    "page": "api/root.html",
    "section": "datasetloader"
  },
  {
    "type": "section",
    "title": "DatasetLoader parameters",
    "description": "DatasetLoader parameters",
    "page": "api/root.html",
    "section": "datasetloader-parameters"
  },
  {
    "type": "section",
    "title": "DatasetLoader example",
    "description": "DatasetLoader example",
    "page": "api/root.html",
    "section": "datasetloader-example"
  },
  {
    "type": "section",
    "title": "DatasetManifest",
    "description": "Lightweight provenance metadata for a processed dataset. Canonical import: from arclm import DatasetManifest. Fully qualified name: arclm.DatasetManifest. Status: Stable.",
    "page": "api/root.html",
    "section": "datasetmanifest"
  },
  {
    "type": "section",
    "title": "DatasetManifest parameters",
    "description": "DatasetManifest parameters",
    "page": "api/root.html",
    "section": "datasetmanifest-parameters"
  },
  {
    "type": "section",
    "title": "DatasetManifest example",
    "description": "DatasetManifest example",
    "page": "api/root.html",
    "section": "datasetmanifest-example"
  },
  {
    "type": "section",
    "title": "DatasetReport",
    "description": "A compact processed-dataset and tokenization report. Canonical import: from arclm import DatasetReport. Fully qualified name: arclm.DatasetReport. Status: Stable.",
    "page": "api/root.html",
    "section": "datasetreport"
  },
  {
    "type": "section",
    "title": "DatasetReport parameters",
    "description": "DatasetReport parameters",
    "page": "api/root.html",
    "section": "datasetreport-parameters"
  },
  {
    "type": "section",
    "title": "DatasetReport example",
    "description": "DatasetReport example",
    "page": "api/root.html",
    "section": "datasetreport-example"
  },
  {
    "type": "section",
    "title": "DatasetValidationIssue",
    "description": "One validation problem tied to a record index and field. Canonical import: from arclm import DatasetValidationIssue. Fully qualified name: arclm.DatasetValidationIssue. Status: Stable.",
    "page": "api/root.html",
    "section": "datasetvalidationissue"
  },
  {
    "type": "section",
    "title": "DatasetValidationIssue parameters",
    "description": "DatasetValidationIssue parameters",
    "page": "api/root.html",
    "section": "datasetvalidationissue-parameters"
  },
  {
    "type": "section",
    "title": "DatasetValidationIssue example",
    "description": "DatasetValidationIssue example",
    "page": "api/root.html",
    "section": "datasetvalidationissue-example"
  },
  {
    "type": "section",
    "title": "DatasetValidationResult",
    "description": "Result of validating records against a small field schema. Canonical import: from arclm import DatasetValidationResult. Fully qualified name: arclm.DatasetValidationResult. Status: Stable.",
    "page": "api/root.html",
    "section": "datasetvalidationresult"
  },
  {
    "type": "section",
    "title": "DatasetValidationResult parameters",
    "description": "DatasetValidationResult parameters",
    "page": "api/root.html",
    "section": "datasetvalidationresult-parameters"
  },
  {
    "type": "section",
    "title": "DatasetValidationResult example",
    "description": "DatasetValidationResult example",
    "page": "api/root.html",
    "section": "datasetvalidationresult-example"
  },
  {
    "type": "section",
    "title": "DeduplicationResult",
    "description": "Resultaat van een deduplicatie stap. Canonical import: from arclm import DeduplicationResult. Fully qualified name: arclm.DeduplicationResult. Status: Stable.",
    "page": "api/root.html",
    "section": "deduplicationresult"
  },
  {
    "type": "section",
    "title": "DeduplicationResult parameters",
    "description": "DeduplicationResult parameters",
    "page": "api/root.html",
    "section": "deduplicationresult-parameters"
  },
  {
    "type": "section",
    "title": "DeduplicationResult example",
    "description": "DeduplicationResult example",
    "page": "api/root.html",
    "section": "deduplicationresult-example"
  },
  {
    "type": "section",
    "title": "EarlyStopping",
    "description": "Early stopping to prevent overfitting Canonical import: from arclm import EarlyStopping. Fully qualified name: arclm.EarlyStopping. Status: Stable.",
    "page": "api/root.html",
    "section": "earlystopping"
  },
  {
    "type": "section",
    "title": "EarlyStopping parameters",
    "description": "EarlyStopping parameters",
    "page": "api/root.html",
    "section": "earlystopping-parameters"
  },
  {
    "type": "section",
    "title": "EarlyStopping example",
    "description": "EarlyStopping example",
    "page": "api/root.html",
    "section": "earlystopping-example"
  },
  {
    "type": "section",
    "title": "EntailmentResult",
    "description": "Resultaat van een vraag aan een knowledge base. Canonical import: from arclm import EntailmentResult. Fully qualified name: arclm.EntailmentResult. Status: Stable.",
    "page": "api/root.html",
    "section": "entailmentresult"
  },
  {
    "type": "section",
    "title": "EntailmentResult parameters",
    "description": "EntailmentResult parameters",
    "page": "api/root.html",
    "section": "entailmentresult-parameters"
  },
  {
    "type": "section",
    "title": "EntailmentResult example",
    "description": "EntailmentResult example",
    "page": "api/root.html",
    "section": "entailmentresult-example"
  },
  {
    "type": "section",
    "title": "EvaluationConfig",
    "description": "Bewaart instellingen voor een evaluatierun. Canonical import: from arclm import EvaluationConfig. Fully qualified name: arclm.EvaluationConfig. Status: Stable.",
    "page": "api/root.html",
    "section": "evaluationconfig"
  },
  {
    "type": "section",
    "title": "EvaluationConfig parameters",
    "description": "EvaluationConfig parameters",
    "page": "api/root.html",
    "section": "evaluationconfig-parameters"
  },
  {
    "type": "section",
    "title": "EvaluationConfig example",
    "description": "EvaluationConfig example",
    "page": "api/root.html",
    "section": "evaluationconfig-example"
  },
  {
    "type": "section",
    "title": "EvaluationReport",
    "description": "Structured, JSON-safe summary of an evaluation run. Canonical import: from arclm import EvaluationReport. Fully qualified name: arclm.EvaluationReport. Status: Stable.",
    "page": "api/root.html",
    "section": "evaluationreport"
  },
  {
    "type": "section",
    "title": "EvaluationReport parameters",
    "description": "EvaluationReport parameters",
    "page": "api/root.html",
    "section": "evaluationreport-parameters"
  },
  {
    "type": "section",
    "title": "EvaluationReport example",
    "description": "EvaluationReport example",
    "page": "api/root.html",
    "section": "evaluationreport-example"
  },
  {
    "type": "section",
    "title": "EvaluationResult",
    "description": "Bewaart de uitkomst van een evaluatierun. Canonical import: from arclm import EvaluationResult. Fully qualified name: arclm.EvaluationResult. Status: Stable.",
    "page": "api/root.html",
    "section": "evaluationresult"
  },
  {
    "type": "section",
    "title": "EvaluationResult parameters",
    "description": "EvaluationResult parameters",
    "page": "api/root.html",
    "section": "evaluationresult-parameters"
  },
  {
    "type": "section",
    "title": "EvaluationResult example",
    "description": "EvaluationResult example",
    "page": "api/root.html",
    "section": "evaluationresult-example"
  },
  {
    "type": "section",
    "title": "Evaluator",
    "description": "Voert evaluatie uit op een model en dataset. Canonical import: from arclm import Evaluator. Fully qualified name: arclm.Evaluator. Status: Stable.",
    "page": "api/root.html",
    "section": "evaluator"
  },
  {
    "type": "section",
    "title": "Evaluator parameters",
    "description": "Evaluator parameters",
    "page": "api/root.html",
    "section": "evaluator-parameters"
  },
  {
    "type": "section",
    "title": "Evaluator example",
    "description": "Evaluator example",
    "page": "api/root.html",
    "section": "evaluator-example"
  },
  {
    "type": "section",
    "title": "ExactDeduplicator",
    "description": "Verwijdert voorbeelden met dezelfde waarde in gekozen velden. Canonical import: from arclm import ExactDeduplicator. Fully qualified name: arclm.ExactDeduplicator. Status: Stable.",
    "page": "api/root.html",
    "section": "exactdeduplicator"
  },
  {
    "type": "section",
    "title": "ExactDeduplicator parameters",
    "description": "ExactDeduplicator parameters",
    "page": "api/root.html",
    "section": "exactdeduplicator-parameters"
  },
  {
    "type": "section",
    "title": "ExactDeduplicator example",
    "description": "ExactDeduplicator example",
    "page": "api/root.html",
    "section": "exactdeduplicator-example"
  },
  {
    "type": "section",
    "title": "ExternalLoadedModel",
    "description": "Loaded model wrapper with a unified inference and save API. Canonical import: from arclm import ExternalLoadedModel. Fully qualified name: arclm.ExternalLoadedModel. Status: Stable.",
    "page": "api/root.html",
    "section": "externalloadedmodel"
  },
  {
    "type": "section",
    "title": "ExternalLoadedModel parameters",
    "description": "ExternalLoadedModel parameters",
    "page": "api/root.html",
    "section": "externalloadedmodel-parameters"
  },
  {
    "type": "section",
    "title": "ExternalLoadedModel example",
    "description": "ExternalLoadedModel example",
    "page": "api/root.html",
    "section": "externalloadedmodel-example"
  },
  {
    "type": "section",
    "title": "ExternalModelConfig",
    "description": "Configuration for loading native or external causal language models. Canonical import: from arclm import ExternalModelConfig. Fully qualified name: arclm.ExternalModelConfig. Status: Stable.",
    "page": "api/root.html",
    "section": "externalmodelconfig"
  },
  {
    "type": "section",
    "title": "ExternalModelConfig parameters",
    "description": "ExternalModelConfig parameters",
    "page": "api/root.html",
    "section": "externalmodelconfig-parameters"
  },
  {
    "type": "section",
    "title": "ExternalModelConfig example",
    "description": "ExternalModelConfig example",
    "page": "api/root.html",
    "section": "externalmodelconfig-example"
  },
  {
    "type": "section",
    "title": "FullFineTuner",
    "description": "Traint alle trainbare modelparameters met de Training Core. Canonical import: from arclm import FullFineTuner. Fully qualified name: arclm.FullFineTuner. Status: Stable.",
    "page": "api/root.html",
    "section": "fullfinetuner"
  },
  {
    "type": "section",
    "title": "FullFineTuner parameters",
    "description": "FullFineTuner parameters",
    "page": "api/root.html",
    "section": "fullfinetuner-parameters"
  },
  {
    "type": "section",
    "title": "FullFineTuner example",
    "description": "FullFineTuner example",
    "page": "api/root.html",
    "section": "fullfinetuner-example"
  },
  {
    "type": "section",
    "title": "GeneralizationMonitor",
    "description": "Monitor model generalization during training Traceert training vs validation loss om overfitting te detecteren Canonical import: from arclm import GeneralizationMonitor. Fully qualified name: arclm.GeneralizationMonitor. Status: Stable.",
    "page": "api/root.html",
    "section": "generalizationmonitor"
  },
  {
    "type": "section",
    "title": "GeneralizationMonitor parameters",
    "description": "GeneralizationMonitor parameters",
    "page": "api/root.html",
    "section": "generalizationmonitor-parameters"
  },
  {
    "type": "section",
    "title": "GeneralizationMonitor example",
    "description": "GeneralizationMonitor example",
    "page": "api/root.html",
    "section": "generalizationmonitor-example"
  },
  {
    "type": "section",
    "title": "GenerationConfig",
    "description": "Text generation defaults used by :class:`ExternalLoadedModel`. Canonical import: from arclm import GenerationConfig. Fully qualified name: arclm.GenerationConfig. Status: Stable.",
    "page": "api/root.html",
    "section": "generationconfig"
  },
  {
    "type": "section",
    "title": "GenerationConfig parameters",
    "description": "GenerationConfig parameters",
    "page": "api/root.html",
    "section": "generationconfig-parameters"
  },
  {
    "type": "section",
    "title": "GenerationConfig example",
    "description": "GenerationConfig example",
    "page": "api/root.html",
    "section": "generationconfig-example"
  },
  {
    "type": "section",
    "title": "Generator",
    "description": "Generate tokens from a trained native causal language model. Canonical import: from arclm import Generator. Fully qualified name: arclm.Generator. Status: Stable.",
    "page": "api/root.html",
    "section": "generator"
  },
  {
    "type": "section",
    "title": "Generator parameters",
    "description": "Generator parameters",
    "page": "api/root.html",
    "section": "generator-parameters"
  },
  {
    "type": "section",
    "title": "Generator example",
    "description": "Generator example",
    "page": "api/root.html",
    "section": "generator-example"
  },
  {
    "type": "section",
    "title": "Implication",
    "description": "Logische zin van de vorm als A dan B. Canonical import: from arclm import Implication. Fully qualified name: arclm.Implication. Status: Stable.",
    "page": "api/root.html",
    "section": "implication"
  },
  {
    "type": "section",
    "title": "Implication parameters",
    "description": "Implication parameters",
    "page": "api/root.html",
    "section": "implication-parameters"
  },
  {
    "type": "section",
    "title": "Implication example",
    "description": "Implication example",
    "page": "api/root.html",
    "section": "implication-example"
  },
  {
    "type": "section",
    "title": "InstructionDataset",
    "description": "Dataset voor instruction tuning met loss alleen op response tokens. Canonical import: from arclm import InstructionDataset. Fully qualified name: arclm.InstructionDataset. Status: Stable.",
    "page": "api/root.html",
    "section": "instructiondataset"
  },
  {
    "type": "section",
    "title": "InstructionDataset parameters",
    "description": "InstructionDataset parameters",
    "page": "api/root.html",
    "section": "instructiondataset-parameters"
  },
  {
    "type": "section",
    "title": "InstructionDataset example",
    "description": "InstructionDataset example",
    "page": "api/root.html",
    "section": "instructiondataset-example"
  },
  {
    "type": "section",
    "title": "KnowledgeBase",
    "description": "Bewaart logische regels en beantwoordt simpele vragen. Canonical import: from arclm import KnowledgeBase. Fully qualified name: arclm.KnowledgeBase. Status: Stable.",
    "page": "api/root.html",
    "section": "knowledgebase"
  },
  {
    "type": "section",
    "title": "KnowledgeBase parameters",
    "description": "KnowledgeBase parameters",
    "page": "api/root.html",
    "section": "knowledgebase-parameters"
  },
  {
    "type": "section",
    "title": "KnowledgeBase example",
    "description": "KnowledgeBase example",
    "page": "api/root.html",
    "section": "knowledgebase-example"
  },
  {
    "type": "section",
    "title": "L1Regularization",
    "description": "L1 Regularization - Sparsity inducing Canonical import: from arclm import L1Regularization. Fully qualified name: arclm.L1Regularization. Status: Stable.",
    "page": "api/root.html",
    "section": "l1regularization"
  },
  {
    "type": "section",
    "title": "L1Regularization parameters",
    "description": "L1Regularization parameters",
    "page": "api/root.html",
    "section": "l1regularization-parameters"
  },
  {
    "type": "section",
    "title": "L1Regularization example",
    "description": "L1Regularization example",
    "page": "api/root.html",
    "section": "l1regularization-example"
  },
  {
    "type": "section",
    "title": "L2Regularization",
    "description": "L2 Regularization (Weight Decay) - Smoothness inducing Canonical import: from arclm import L2Regularization. Fully qualified name: arclm.L2Regularization. Status: Stable.",
    "page": "api/root.html",
    "section": "l2regularization"
  },
  {
    "type": "section",
    "title": "L2Regularization parameters",
    "description": "L2Regularization parameters",
    "page": "api/root.html",
    "section": "l2regularization-parameters"
  },
  {
    "type": "section",
    "title": "L2Regularization example",
    "description": "L2Regularization example",
    "page": "api/root.html",
    "section": "l2regularization-example"
  },
  {
    "type": "section",
    "title": "LabelSmoothing",
    "description": "Label smoothing regularization Voorkomt overconfident voorspellingen door targets glad te maken Canonical import: from arclm import LabelSmoothing. Fully qualified name: arclm.LabelSmoothing. Status: Stable.",
    "page": "api/root.html",
    "section": "labelsmoothing"
  },
  {
    "type": "section",
    "title": "LabelSmoothing parameters",
    "description": "LabelSmoothing parameters",
    "page": "api/root.html",
    "section": "labelsmoothing-parameters"
  },
  {
    "type": "section",
    "title": "LabelSmoothing example",
    "description": "LabelSmoothing example",
    "page": "api/root.html",
    "section": "labelsmoothing-example"
  },
  {
    "type": "section",
    "title": "LearningRateScheduler",
    "description": "Learning rate scheduler for better generalization Reduce learning rate during training for better convergence Canonical import: from arclm import LearningRateScheduler. Fully qualified name: arclm.LearningRateScheduler. Status: Stable.",
    "page": "api/root.html",
    "section": "learningratescheduler"
  },
  {
    "type": "section",
    "title": "LearningRateScheduler parameters",
    "description": "LearningRateScheduler parameters",
    "page": "api/root.html",
    "section": "learningratescheduler-parameters"
  },
  {
    "type": "section",
    "title": "LearningRateScheduler example",
    "description": "LearningRateScheduler example",
    "page": "api/root.html",
    "section": "learningratescheduler-example"
  },
  {
    "type": "section",
    "title": "LoadedCheckpoint",
    "description": "Normalized representation of a model source that ArcLM can inspect. Canonical import: from arclm import LoadedCheckpoint. Fully qualified name: arclm.LoadedCheckpoint. Status: Stable.",
    "page": "api/root.html",
    "section": "loadedcheckpoint"
  },
  {
    "type": "section",
    "title": "LoadedCheckpoint parameters",
    "description": "LoadedCheckpoint parameters",
    "page": "api/root.html",
    "section": "loadedcheckpoint-parameters"
  },
  {
    "type": "section",
    "title": "LoadedCheckpoint example",
    "description": "LoadedCheckpoint example",
    "page": "api/root.html",
    "section": "loadedcheckpoint-example"
  },
  {
    "type": "section",
    "title": "LoadedModel",
    "description": "Loaded model bundle with a minimal prediction method. Canonical import: from arclm import LoadedModel. Fully qualified name: arclm.LoadedModel. Status: Stable.",
    "page": "api/root.html",
    "section": "loadedmodel"
  },
  {
    "type": "section",
    "title": "LoadedModel parameters",
    "description": "LoadedModel parameters",
    "page": "api/root.html",
    "section": "loadedmodel-parameters"
  },
  {
    "type": "section",
    "title": "LoadedModel example",
    "description": "LoadedModel example",
    "page": "api/root.html",
    "section": "loadedmodel-example"
  },
  {
    "type": "section",
    "title": "LoadPlan",
    "description": "Detected and user-selected settings for loading a model source. Canonical import: from arclm import LoadPlan. Fully qualified name: arclm.LoadPlan. Status: Stable.",
    "page": "api/root.html",
    "section": "loadplan"
  },
  {
    "type": "section",
    "title": "LoadPlan parameters",
    "description": "LoadPlan parameters",
    "page": "api/root.html",
    "section": "loadplan-parameters"
  },
  {
    "type": "section",
    "title": "LoadPlan example",
    "description": "LoadPlan example",
    "page": "api/root.html",
    "section": "loadplan-example"
  },
  {
    "type": "section",
    "title": "LongContextResult",
    "description": "Summary for one long-context training/evaluation run. Canonical import: from arclm import LongContextResult. Fully qualified name: arclm.LongContextResult. Status: Stable.",
    "page": "api/root.html",
    "section": "longcontextresult"
  },
  {
    "type": "section",
    "title": "LongContextResult parameters",
    "description": "LongContextResult parameters",
    "page": "api/root.html",
    "section": "longcontextresult-parameters"
  },
  {
    "type": "section",
    "title": "LongContextResult example",
    "description": "LongContextResult example",
    "page": "api/root.html",
    "section": "longcontextresult-example"
  },
  {
    "type": "section",
    "title": "LossMetric",
    "description": "Berekent gemiddelde loss per batch. Canonical import: from arclm import LossMetric. Fully qualified name: arclm.LossMetric. Status: Stable.",
    "page": "api/root.html",
    "section": "lossmetric"
  },
  {
    "type": "section",
    "title": "LossMetric parameters",
    "description": "LossMetric parameters",
    "page": "api/root.html",
    "section": "lossmetric-parameters"
  },
  {
    "type": "section",
    "title": "LossMetric example",
    "description": "LossMetric example",
    "page": "api/root.html",
    "section": "lossmetric-example"
  },
  {
    "type": "section",
    "title": "MetricsReport",
    "description": "Comprehensive metrics report for model evaluation. Canonical import: from arclm import MetricsReport. Fully qualified name: arclm.MetricsReport. Status: Stable.",
    "page": "api/root.html",
    "section": "metricsreport"
  },
  {
    "type": "section",
    "title": "MetricsReport parameters",
    "description": "MetricsReport parameters",
    "page": "api/root.html",
    "section": "metricsreport-parameters"
  },
  {
    "type": "section",
    "title": "MetricsReport example",
    "description": "MetricsReport example",
    "page": "api/root.html",
    "section": "metricsreport-example"
  },
  {
    "type": "section",
    "title": "MiniGPT",
    "description": "Compact causal language model for next-token prediction. Canonical import: from arclm import MiniGPT. Fully qualified name: arclm.MiniGPT. Status: Deprecated.",
    "page": "api/root.html",
    "section": "minigpt"
  },
  {
    "type": "section",
    "title": "MiniGPT parameters",
    "description": "MiniGPT parameters",
    "page": "api/root.html",
    "section": "minigpt-parameters"
  },
  {
    "type": "section",
    "title": "MiniGPT example",
    "description": "MiniGPT example",
    "page": "api/root.html",
    "section": "minigpt-example"
  },
  {
    "type": "section",
    "title": "MixupAugmentation",
    "description": "Mixup data augmentation for better generalization Combineert twee samples lineair om data augmentation te krijgen Canonical import: from arclm import MixupAugmentation. Fully qualified name: arclm.MixupAugmentation. Status: Stable.",
    "page": "api/root.html",
    "section": "mixupaugmentation"
  },
  {
    "type": "section",
    "title": "MixupAugmentation parameters",
    "description": "MixupAugmentation parameters",
    "page": "api/root.html",
    "section": "mixupaugmentation-parameters"
  },
  {
    "type": "section",
    "title": "MixupAugmentation example",
    "description": "MixupAugmentation example",
    "page": "api/root.html",
    "section": "mixupaugmentation-example"
  },
  {
    "type": "section",
    "title": "ModelAdapter",
    "description": "Adapt weights from external models to ArcLM architecture. Canonical import: from arclm import ModelAdapter. Fully qualified name: arclm.ModelAdapter. Status: Stable.",
    "page": "api/root.html",
    "section": "modeladapter"
  },
  {
    "type": "section",
    "title": "ModelAdapter parameters",
    "description": "ModelAdapter parameters",
    "page": "api/root.html",
    "section": "modeladapter-parameters"
  },
  {
    "type": "section",
    "title": "ModelAdapter example",
    "description": "ModelAdapter example",
    "page": "api/root.html",
    "section": "modeladapter-example"
  },
  {
    "type": "section",
    "title": "ModelCapabilityReport",
    "description": "Describes supported operations for one exact model path. Canonical import: from arclm import ModelCapabilityReport. Fully qualified name: arclm.ModelCapabilityReport. Status: Stable.",
    "page": "api/root.html",
    "section": "modelcapabilityreport"
  },
  {
    "type": "section",
    "title": "ModelCapabilityReport parameters",
    "description": "ModelCapabilityReport parameters",
    "page": "api/root.html",
    "section": "modelcapabilityreport-parameters"
  },
  {
    "type": "section",
    "title": "ModelCapabilityReport example",
    "description": "ModelCapabilityReport example",
    "page": "api/root.html",
    "section": "modelcapabilityreport-example"
  },
  {
    "type": "section",
    "title": "ModelInspector",
    "description": "Base class for source inspectors used by ``SmartLoader``. Canonical import: from arclm import ModelInspector. Fully qualified name: arclm.ModelInspector. Status: Stable.",
    "page": "api/root.html",
    "section": "modelinspector"
  },
  {
    "type": "section",
    "title": "ModelInspector parameters",
    "description": "ModelInspector parameters",
    "page": "api/root.html",
    "section": "modelinspector-parameters"
  },
  {
    "type": "section",
    "title": "ModelInspector example",
    "description": "ModelInspector example",
    "page": "api/root.html",
    "section": "modelinspector-example"
  },
  {
    "type": "section",
    "title": "ModelSaveConfig",
    "description": "Developer-controlled settings for saving or exporting loaded models. Canonical import: from arclm import ModelSaveConfig. Fully qualified name: arclm.ModelSaveConfig. Status: Stable.",
    "page": "api/root.html",
    "section": "modelsaveconfig"
  },
  {
    "type": "section",
    "title": "ModelSaveConfig parameters",
    "description": "ModelSaveConfig parameters",
    "page": "api/root.html",
    "section": "modelsaveconfig-parameters"
  },
  {
    "type": "section",
    "title": "ModelSaveConfig example",
    "description": "ModelSaveConfig example",
    "page": "api/root.html",
    "section": "modelsaveconfig-example"
  },
  {
    "type": "section",
    "title": "ModelSourceInfo",
    "description": "Structured inspection result for a model source. Canonical import: from arclm import ModelSourceInfo. Fully qualified name: arclm.ModelSourceInfo. Status: Stable.",
    "page": "api/root.html",
    "section": "modelsourceinfo"
  },
  {
    "type": "section",
    "title": "ModelSourceInfo parameters",
    "description": "ModelSourceInfo parameters",
    "page": "api/root.html",
    "section": "modelsourceinfo-parameters"
  },
  {
    "type": "section",
    "title": "ModelSourceInfo example",
    "description": "ModelSourceInfo example",
    "page": "api/root.html",
    "section": "modelsourceinfo-example"
  },
  {
    "type": "section",
    "title": "Not",
    "description": "Logische NOT rond een operand. Canonical import: from arclm import Not. Fully qualified name: arclm.Not. Status: Stable.",
    "page": "api/root.html",
    "section": "not"
  },
  {
    "type": "section",
    "title": "Not parameters",
    "description": "Not parameters",
    "page": "api/root.html",
    "section": "not-parameters"
  },
  {
    "type": "section",
    "title": "Not example",
    "description": "Not example",
    "page": "api/root.html",
    "section": "not-example"
  },
  {
    "type": "section",
    "title": "Or",
    "description": "Logische OR met een of meer disjuncties. Canonical import: from arclm import Or. Fully qualified name: arclm.Or. Status: Stable.",
    "page": "api/root.html",
    "section": "or"
  },
  {
    "type": "section",
    "title": "Or parameters",
    "description": "Or parameters",
    "page": "api/root.html",
    "section": "or-parameters"
  },
  {
    "type": "section",
    "title": "Or example",
    "description": "Or example",
    "page": "api/root.html",
    "section": "or-example"
  },
  {
    "type": "section",
    "title": "Perplexity",
    "description": "Berekent perplexity uit gemiddelde loss. Canonical import: from arclm import Perplexity. Fully qualified name: arclm.Perplexity. Status: Stable.",
    "page": "api/root.html",
    "section": "perplexity"
  },
  {
    "type": "section",
    "title": "Perplexity parameters",
    "description": "Perplexity parameters",
    "page": "api/root.html",
    "section": "perplexity-parameters"
  },
  {
    "type": "section",
    "title": "Perplexity example",
    "description": "Perplexity example",
    "page": "api/root.html",
    "section": "perplexity-example"
  },
  {
    "type": "section",
    "title": "PipelineTrace",
    "description": "JSON-safe summary of one inspected native ArcLM generation step. Canonical import: from arclm import PipelineTrace. Fully qualified name: arclm.PipelineTrace. Status: Stable.",
    "page": "api/root.html",
    "section": "pipelinetrace"
  },
  {
    "type": "section",
    "title": "PipelineTrace parameters",
    "description": "PipelineTrace parameters",
    "page": "api/root.html",
    "section": "pipelinetrace-parameters"
  },
  {
    "type": "section",
    "title": "PipelineTrace example",
    "description": "PipelineTrace example",
    "page": "api/root.html",
    "section": "pipelinetrace-example"
  },
  {
    "type": "section",
    "title": "PreTrainedModelLoader",
    "description": "Load pre-trained models from multiple sources: - HuggingFace transformers - Local checkpoint files - Custom model paths Handles weight alignment and architecture mismatch gracefully. Canonical import: from arclm import PreTrainedModelLoader. Fully qualified name: arclm.PreTrainedModelLoader. Status: Stable.",
    "page": "api/root.html",
    "section": "pretrainedmodelloader"
  },
  {
    "type": "section",
    "title": "PreTrainedModelLoader parameters",
    "description": "PreTrainedModelLoader parameters",
    "page": "api/root.html",
    "section": "pretrainedmodelloader-parameters"
  },
  {
    "type": "section",
    "title": "PreTrainedModelLoader example",
    "description": "PreTrainedModelLoader example",
    "page": "api/root.html",
    "section": "pretrainedmodelloader-example"
  },
  {
    "type": "section",
    "title": "ProcessedDataset",
    "description": "Kleine in-memory dataset voor formatting, cleaning en splits. Canonical import: from arclm import ProcessedDataset. Fully qualified name: arclm.ProcessedDataset. Status: Stable.",
    "page": "api/root.html",
    "section": "processeddataset"
  },
  {
    "type": "section",
    "title": "ProcessedDataset parameters",
    "description": "ProcessedDataset parameters",
    "page": "api/root.html",
    "section": "processeddataset-parameters"
  },
  {
    "type": "section",
    "title": "ProcessedDataset example",
    "description": "ProcessedDataset example",
    "page": "api/root.html",
    "section": "processeddataset-example"
  },
  {
    "type": "section",
    "title": "RemoveDuplicates",
    "description": "Verwijdert voorbeelden met dezelfde waarde in gekozen velden. Canonical import: from arclm import RemoveDuplicates. Fully qualified name: arclm.RemoveDuplicates. Status: Stable.",
    "page": "api/root.html",
    "section": "removeduplicates"
  },
  {
    "type": "section",
    "title": "RemoveDuplicates parameters",
    "description": "RemoveDuplicates parameters",
    "page": "api/root.html",
    "section": "removeduplicates-parameters"
  },
  {
    "type": "section",
    "title": "RemoveDuplicates example",
    "description": "RemoveDuplicates example",
    "page": "api/root.html",
    "section": "removeduplicates-example"
  },
  {
    "type": "section",
    "title": "Sentence",
    "description": "Basis class voor logische zinnen. Canonical import: from arclm import Sentence. Fully qualified name: arclm.Sentence. Status: Stable.",
    "page": "api/root.html",
    "section": "sentence"
  },
  {
    "type": "section",
    "title": "Sentence parameters",
    "description": "Sentence parameters",
    "page": "api/root.html",
    "section": "sentence-parameters"
  },
  {
    "type": "section",
    "title": "Sentence example",
    "description": "Sentence example",
    "page": "api/root.html",
    "section": "sentence-example"
  },
  {
    "type": "section",
    "title": "SentencePieceTokenizer",
    "description": "SentencePiece tokenizer voor subword taalmodeltraining. Canonical import: from arclm import SentencePieceTokenizer. Fully qualified name: arclm.SentencePieceTokenizer. Status: Stable.",
    "page": "api/root.html",
    "section": "sentencepiecetokenizer"
  },
  {
    "type": "section",
    "title": "SentencePieceTokenizer parameters",
    "description": "SentencePieceTokenizer parameters",
    "page": "api/root.html",
    "section": "sentencepiecetokenizer-parameters"
  },
  {
    "type": "section",
    "title": "SentencePieceTokenizer example",
    "description": "SentencePieceTokenizer example",
    "page": "api/root.html",
    "section": "sentencepiecetokenizer-example"
  },
  {
    "type": "section",
    "title": "SFTConfig",
    "description": "Bewaart instellingen voor supervised fine-tuning. Canonical import: from arclm import SFTConfig. Fully qualified name: arclm.SFTConfig. Status: Stable.",
    "page": "api/root.html",
    "section": "sftconfig"
  },
  {
    "type": "section",
    "title": "SFTConfig parameters",
    "description": "SFTConfig parameters",
    "page": "api/root.html",
    "section": "sftconfig-parameters"
  },
  {
    "type": "section",
    "title": "SFTConfig example",
    "description": "SFTConfig example",
    "page": "api/root.html",
    "section": "sftconfig-example"
  },
  {
    "type": "section",
    "title": "SFTDataCollator",
    "description": "Zet SFT voorbeelden om naar tensors voor de trainer. Canonical import: from arclm import SFTDataCollator. Fully qualified name: arclm.SFTDataCollator. Status: Stable.",
    "page": "api/root.html",
    "section": "sftdatacollator"
  },
  {
    "type": "section",
    "title": "SFTDataCollator parameters",
    "description": "SFTDataCollator parameters",
    "page": "api/root.html",
    "section": "sftdatacollator-parameters"
  },
  {
    "type": "section",
    "title": "SFTDataCollator example",
    "description": "SFTDataCollator example",
    "page": "api/root.html",
    "section": "sftdatacollator-example"
  },
  {
    "type": "section",
    "title": "SFTRecordContract",
    "description": "Public description of accepted SFT record fields. Canonical import: from arclm import SFTRecordContract. Fully qualified name: arclm.SFTRecordContract. Status: Stable.",
    "page": "api/root.html",
    "section": "sftrecordcontract"
  },
  {
    "type": "section",
    "title": "SFTRecordContract parameters",
    "description": "SFTRecordContract parameters",
    "page": "api/root.html",
    "section": "sftrecordcontract-parameters"
  },
  {
    "type": "section",
    "title": "SFTRecordContract example",
    "description": "SFTRecordContract example",
    "page": "api/root.html",
    "section": "sftrecordcontract-example"
  },
  {
    "type": "section",
    "title": "SFTTrainer",
    "description": "Traint een tekstmodel met instruction-, chat- of tekstdatasets. Canonical import: from arclm import SFTTrainer. Fully qualified name: arclm.SFTTrainer. Status: Stable.",
    "page": "api/root.html",
    "section": "sfttrainer"
  },
  {
    "type": "section",
    "title": "SFTTrainer parameters",
    "description": "SFTTrainer parameters",
    "page": "api/root.html",
    "section": "sfttrainer-parameters"
  },
  {
    "type": "section",
    "title": "SFTTrainer example",
    "description": "SFTTrainer example",
    "page": "api/root.html",
    "section": "sfttrainer-example"
  },
  {
    "type": "section",
    "title": "SFTTrainingResult",
    "description": "Result returned by ``train_sft``. Canonical import: from arclm import SFTTrainingResult. Fully qualified name: arclm.SFTTrainingResult. Status: Stable.",
    "page": "api/root.html",
    "section": "sfttrainingresult"
  },
  {
    "type": "section",
    "title": "SFTTrainingResult parameters",
    "description": "SFTTrainingResult parameters",
    "page": "api/root.html",
    "section": "sfttrainingresult-parameters"
  },
  {
    "type": "section",
    "title": "SFTTrainingResult example",
    "description": "SFTTrainingResult example",
    "page": "api/root.html",
    "section": "sfttrainingresult-example"
  },
  {
    "type": "section",
    "title": "SmartLoader",
    "description": "High-level loading entry point with inspection and manual overrides. Canonical import: from arclm import SmartLoader. Fully qualified name: arclm.SmartLoader. Status: Stable.",
    "page": "api/root.html",
    "section": "smartloader"
  },
  {
    "type": "section",
    "title": "SmartLoader parameters",
    "description": "SmartLoader parameters",
    "page": "api/root.html",
    "section": "smartloader-parameters"
  },
  {
    "type": "section",
    "title": "SmartLoader example",
    "description": "SmartLoader example",
    "page": "api/root.html",
    "section": "smartloader-example"
  },
  {
    "type": "section",
    "title": "StoppingCriteria",
    "description": "Base stopping criteria for training loop control. Canonical import: from arclm import StoppingCriteria. Fully qualified name: arclm.StoppingCriteria. Status: Stable.",
    "page": "api/root.html",
    "section": "stoppingcriteria"
  },
  {
    "type": "section",
    "title": "StoppingCriteria parameters",
    "description": "StoppingCriteria parameters",
    "page": "api/root.html",
    "section": "stoppingcriteria-parameters"
  },
  {
    "type": "section",
    "title": "StoppingCriteria example",
    "description": "StoppingCriteria example",
    "page": "api/root.html",
    "section": "stoppingcriteria-example"
  },
  {
    "type": "section",
    "title": "StreamingDataset",
    "description": "Dataset die voorbeelden pas leest tijdens het itereren. Canonical import: from arclm import StreamingDataset. Fully qualified name: arclm.StreamingDataset. Status: Stable.",
    "page": "api/root.html",
    "section": "streamingdataset"
  },
  {
    "type": "section",
    "title": "StreamingDataset parameters",
    "description": "StreamingDataset parameters",
    "page": "api/root.html",
    "section": "streamingdataset-parameters"
  },
  {
    "type": "section",
    "title": "StreamingDataset example",
    "description": "StreamingDataset example",
    "page": "api/root.html",
    "section": "streamingdataset-example"
  },
  {
    "type": "section",
    "title": "Symbol",
    "description": "Een enkel logisch symbool, zoals P of Q. Canonical import: from arclm import Symbol. Fully qualified name: arclm.Symbol. Status: Stable.",
    "page": "api/root.html",
    "section": "symbol"
  },
  {
    "type": "section",
    "title": "Symbol parameters",
    "description": "Symbol parameters",
    "page": "api/root.html",
    "section": "symbol-parameters"
  },
  {
    "type": "section",
    "title": "Symbol example",
    "description": "Symbol example",
    "page": "api/root.html",
    "section": "symbol-example"
  },
  {
    "type": "section",
    "title": "TextDataset",
    "description": "Dataset voor taalmodeltraining met een schuivend venster. Canonical import: from arclm import TextDataset. Fully qualified name: arclm.TextDataset. Status: Stable.",
    "page": "api/root.html",
    "section": "textdataset"
  },
  {
    "type": "section",
    "title": "TextDataset parameters",
    "description": "TextDataset parameters",
    "page": "api/root.html",
    "section": "textdataset-parameters"
  },
  {
    "type": "section",
    "title": "TextDataset example",
    "description": "TextDataset example",
    "page": "api/root.html",
    "section": "textdataset-example"
  },
  {
    "type": "section",
    "title": "TextGenerator",
    "description": "Generate tokens from a trained native causal language model. Canonical import: from arclm import TextGenerator. Fully qualified name: arclm.TextGenerator. Status: Stable.",
    "page": "api/root.html",
    "section": "textgenerator"
  },
  {
    "type": "section",
    "title": "TextGenerator parameters",
    "description": "TextGenerator parameters",
    "page": "api/root.html",
    "section": "textgenerator-parameters"
  },
  {
    "type": "section",
    "title": "TextGenerator example",
    "description": "TextGenerator example",
    "page": "api/root.html",
    "section": "textgenerator-example"
  },
  {
    "type": "section",
    "title": "Tokenizer",
    "description": "Zet tekst om naar woord-tokens en token ids. Canonical import: from arclm import Tokenizer. Fully qualified name: arclm.Tokenizer. Status: Stable.",
    "page": "api/root.html",
    "section": "tokenizer"
  },
  {
    "type": "section",
    "title": "Tokenizer parameters",
    "description": "Tokenizer parameters",
    "page": "api/root.html",
    "section": "tokenizer-parameters"
  },
  {
    "type": "section",
    "title": "Tokenizer example",
    "description": "Tokenizer example",
    "page": "api/root.html",
    "section": "tokenizer-example"
  },
  {
    "type": "section",
    "title": "TokenizerAdapter",
    "description": "Zet verschillende tokenizers om naar \u00e9\u00e9n eenvoudige interface. Canonical import: from arclm import TokenizerAdapter. Fully qualified name: arclm.TokenizerAdapter. Status: Stable.",
    "page": "api/root.html",
    "section": "tokenizeradapter"
  },
  {
    "type": "section",
    "title": "TokenizerAdapter parameters",
    "description": "TokenizerAdapter parameters",
    "page": "api/root.html",
    "section": "tokenizeradapter-parameters"
  },
  {
    "type": "section",
    "title": "TokenizerAdapter example",
    "description": "TokenizerAdapter example",
    "page": "api/root.html",
    "section": "tokenizeradapter-example"
  },
  {
    "type": "section",
    "title": "TokenizerFactory",
    "description": "Kiest en maakt tokenizer classes op basis van een korte naam. Canonical import: from arclm import TokenizerFactory. Fully qualified name: arclm.TokenizerFactory. Status: Stable.",
    "page": "api/root.html",
    "section": "tokenizerfactory"
  },
  {
    "type": "section",
    "title": "TokenizerFactory parameters",
    "description": "TokenizerFactory parameters",
    "page": "api/root.html",
    "section": "tokenizerfactory-parameters"
  },
  {
    "type": "section",
    "title": "TokenizerFactory example",
    "description": "TokenizerFactory example",
    "page": "api/root.html",
    "section": "tokenizerfactory-example"
  },
  {
    "type": "section",
    "title": "TopKPrediction",
    "description": "One next-token prediction. Canonical import: from arclm import TopKPrediction. Fully qualified name: arclm.TopKPrediction. Status: Stable.",
    "page": "api/root.html",
    "section": "topkprediction"
  },
  {
    "type": "section",
    "title": "TopKPrediction parameters",
    "description": "TopKPrediction parameters",
    "page": "api/root.html",
    "section": "topkprediction-parameters"
  },
  {
    "type": "section",
    "title": "TopKPrediction example",
    "description": "TopKPrediction example",
    "page": "api/root.html",
    "section": "topkprediction-example"
  },
  {
    "type": "section",
    "title": "Trainer",
    "description": "Traint een model op \u00e9\u00e9n apparaat. Canonical import: from arclm import Trainer. Fully qualified name: arclm.Trainer. Status: Stable.",
    "page": "api/root.html",
    "section": "trainer"
  },
  {
    "type": "section",
    "title": "Trainer parameters",
    "description": "Trainer parameters",
    "page": "api/root.html",
    "section": "trainer-parameters"
  },
  {
    "type": "section",
    "title": "Trainer example",
    "description": "Trainer example",
    "page": "api/root.html",
    "section": "trainer-example"
  },
  {
    "type": "section",
    "title": "TrainingConfig",
    "description": "Houdt alle belangrijke ArcLM instellingen bij. Canonical import: from arclm import TrainingConfig. Fully qualified name: arclm.TrainingConfig. Status: Stable.",
    "page": "api/root.html",
    "section": "trainingconfig"
  },
  {
    "type": "section",
    "title": "TrainingConfig parameters",
    "description": "TrainingConfig parameters",
    "page": "api/root.html",
    "section": "trainingconfig-parameters"
  },
  {
    "type": "section",
    "title": "TrainingConfig example",
    "description": "TrainingConfig example",
    "page": "api/root.html",
    "section": "trainingconfig-example"
  },
  {
    "type": "section",
    "title": "TrainingResult",
    "description": "Resultaat dat `train_model` teruggeeft na een trainingsrun. Canonical import: from arclm import TrainingResult. Fully qualified name: arclm.TrainingResult. Status: Stable.",
    "page": "api/root.html",
    "section": "trainingresult"
  },
  {
    "type": "section",
    "title": "TrainingResult parameters",
    "description": "TrainingResult parameters",
    "page": "api/root.html",
    "section": "trainingresult-parameters"
  },
  {
    "type": "section",
    "title": "TrainingResult example",
    "description": "TrainingResult example",
    "page": "api/root.html",
    "section": "trainingresult-example"
  },
  {
    "type": "section",
    "title": "TrainingState",
    "description": "Houdt bij waar de training is. Canonical import: from arclm import TrainingState. Fully qualified name: arclm.TrainingState. Status: Stable.",
    "page": "api/root.html",
    "section": "trainingstate"
  },
  {
    "type": "section",
    "title": "TrainingState parameters",
    "description": "TrainingState parameters",
    "page": "api/root.html",
    "section": "trainingstate-parameters"
  },
  {
    "type": "section",
    "title": "TrainingState example",
    "description": "TrainingState example",
    "page": "api/root.html",
    "section": "trainingstate-example"
  },
  {
    "type": "section",
    "title": "UnifiedPipeline",
    "description": "Unified training pipeline supporting multiple modes: - PRE_TRAINING: Train from scratch on large corpus - FINE_TUNING: Fine-tune pre-trained model on task data - INSTRUCTION_TUNING: Fine-tune on instruction-response pair Canonical import: from arclm import UnifiedPipeline. Fully qualified name: arclm.UnifiedPipeline. Status: Stable.",
    "page": "api/root.html",
    "section": "unifiedpipeline"
  },
  {
    "type": "section",
    "title": "UnifiedPipeline parameters",
    "description": "UnifiedPipeline parameters",
    "page": "api/root.html",
    "section": "unifiedpipeline-parameters"
  },
  {
    "type": "section",
    "title": "UnifiedPipeline example",
    "description": "UnifiedPipeline example",
    "page": "api/root.html",
    "section": "unifiedpipeline-example"
  },
  {
    "type": "section",
    "title": "__version__",
    "description": "str(object='') -> str str(bytes_or_buffer[, encoding[, errors]]) -> str Create a new string object from the given object. Canonical import: from arclm import __version__. Fully qualified name: arclm.__version__. Status: Stable.",
    "page": "api/root.html",
    "section": "version"
  },
  {
    "type": "section",
    "title": "__version__ parameters",
    "description": "__version__ parameters",
    "page": "api/root.html",
    "section": "version-parameters"
  },
  {
    "type": "section",
    "title": "__version__ example",
    "description": "__version__ example",
    "page": "api/root.html",
    "section": "version-example"
  },
  {
    "type": "section",
    "title": "DEFAULT_CONCEPT_BENCHMARKS",
    "description": "Built-in mutable sequence. Canonical import: from arclm import DEFAULT_CONCEPT_BENCHMARKS. Fully qualified name: arclm.DEFAULT_CONCEPT_BENCHMARKS. Status: Stable.",
    "page": "api/root.html",
    "section": "default-concept-benchmarks"
  },
  {
    "type": "section",
    "title": "DEFAULT_CONCEPT_BENCHMARKS parameters",
    "description": "DEFAULT_CONCEPT_BENCHMARKS parameters",
    "page": "api/root.html",
    "section": "default-concept-benchmarks-parameters"
  },
  {
    "type": "section",
    "title": "DEFAULT_CONCEPT_BENCHMARKS example",
    "description": "DEFAULT_CONCEPT_BENCHMARKS example",
    "page": "api/root.html",
    "section": "default-concept-benchmarks-example"
  },
  {
    "type": "section",
    "title": "DEFAULT_MODEL_PATH",
    "description": "Path subclass for Windows systems. Canonical import: from arclm import DEFAULT_MODEL_PATH. Fully qualified name: arclm.DEFAULT_MODEL_PATH. Status: Stable.",
    "page": "api/root.html",
    "section": "default-model-path"
  },
  {
    "type": "section",
    "title": "DEFAULT_MODEL_PATH parameters",
    "description": "DEFAULT_MODEL_PATH parameters",
    "page": "api/root.html",
    "section": "default-model-path-parameters"
  },
  {
    "type": "section",
    "title": "DEFAULT_MODEL_PATH example",
    "description": "DEFAULT_MODEL_PATH example",
    "page": "api/root.html",
    "section": "default-model-path-example"
  },
  {
    "type": "section",
    "title": "adapt_for_training",
    "description": "Create an ArcLM model from a normalized checkpoint. Canonical import: from arclm import adapt_for_training. Fully qualified name: arclm.adapt_for_training. Status: Stable.",
    "page": "api/root.html",
    "section": "adapt-for-training"
  },
  {
    "type": "section",
    "title": "adapt_for_training parameters",
    "description": "adapt_for_training parameters",
    "page": "api/root.html",
    "section": "adapt-for-training-parameters"
  },
  {
    "type": "section",
    "title": "adapt_for_training example",
    "description": "adapt_for_training example",
    "page": "api/root.html",
    "section": "adapt-for-training-example"
  },
  {
    "type": "section",
    "title": "build_dataset_report",
    "description": "Build a processed dataset report with optional token statistics. Canonical import: from arclm import build_dataset_report. Fully qualified name: arclm.build_dataset_report. Status: Stable.",
    "page": "api/root.html",
    "section": "build-dataset-report"
  },
  {
    "type": "section",
    "title": "build_dataset_report parameters",
    "description": "build_dataset_report parameters",
    "page": "api/root.html",
    "section": "build-dataset-report-parameters"
  },
  {
    "type": "section",
    "title": "build_dataset_report example",
    "description": "build_dataset_report example",
    "page": "api/root.html",
    "section": "build-dataset-report-example"
  },
  {
    "type": "section",
    "title": "build_evaluation_report",
    "description": "Build a report from canonical evaluator metrics without recalculation. Canonical import: from arclm import build_evaluation_report. Fully qualified name: arclm.build_evaluation_report. Status: Stable.",
    "page": "api/root.html",
    "section": "build-evaluation-report"
  },
  {
    "type": "section",
    "title": "build_evaluation_report parameters",
    "description": "build_evaluation_report parameters",
    "page": "api/root.html",
    "section": "build-evaluation-report-parameters"
  },
  {
    "type": "section",
    "title": "build_evaluation_report example",
    "description": "build_evaluation_report example",
    "page": "api/root.html",
    "section": "build-evaluation-report-example"
  },
  {
    "type": "section",
    "title": "build_model",
    "description": "Maakt een ArcLM model vanuit config en zet het op het gekozen device. Canonical import: from arclm import build_model. Fully qualified name: arclm.build_model. Status: Stable.",
    "page": "api/root.html",
    "section": "build-model"
  },
  {
    "type": "section",
    "title": "build_model parameters",
    "description": "build_model parameters",
    "page": "api/root.html",
    "section": "build-model-parameters"
  },
  {
    "type": "section",
    "title": "build_model example",
    "description": "build_model example",
    "page": "api/root.html",
    "section": "build-model-example"
  },
  {
    "type": "section",
    "title": "build_trainer",
    "description": "Maakt de optimizer, loss function en Trainer voor een model. Canonical import: from arclm import build_trainer. Fully qualified name: arclm.build_trainer. Status: Stable.",
    "page": "api/root.html",
    "section": "build-trainer"
  },
  {
    "type": "section",
    "title": "build_trainer parameters",
    "description": "build_trainer parameters",
    "page": "api/root.html",
    "section": "build-trainer-parameters"
  },
  {
    "type": "section",
    "title": "build_trainer example",
    "description": "build_trainer example",
    "page": "api/root.html",
    "section": "build-trainer-example"
  },
  {
    "type": "section",
    "title": "build_training_diagnostics_report",
    "description": "Build tokenizer, top-k, and concept benchmark diagnostics for a run. Canonical import: from arclm import build_training_diagnostics_report. Fully qualified name: arclm.build_training_diagnostics_report. Status: Stable.",
    "page": "api/root.html",
    "section": "build-training-diagnostics-report"
  },
  {
    "type": "section",
    "title": "build_training_diagnostics_report parameters",
    "description": "build_training_diagnostics_report parameters",
    "page": "api/root.html",
    "section": "build-training-diagnostics-report-parameters"
  },
  {
    "type": "section",
    "title": "build_training_diagnostics_report example",
    "description": "build_training_diagnostics_report example",
    "page": "api/root.html",
    "section": "build-training-diagnostics-report-example"
  },
  {
    "type": "section",
    "title": "calculate_metrics",
    "description": "Calculate comprehensive evaluation metrics. Canonical import: from arclm import calculate_metrics. Fully qualified name: arclm.calculate_metrics. Status: Stable.",
    "page": "api/root.html",
    "section": "calculate-metrics"
  },
  {
    "type": "section",
    "title": "calculate_metrics parameters",
    "description": "calculate_metrics parameters",
    "page": "api/root.html",
    "section": "calculate-metrics-parameters"
  },
  {
    "type": "section",
    "title": "calculate_metrics example",
    "description": "calculate_metrics example",
    "page": "api/root.html",
    "section": "calculate-metrics-example"
  },
  {
    "type": "section",
    "title": "calculate_perplexity",
    "description": "Return perplexity for a cross-entropy loss value. Canonical import: from arclm import calculate_perplexity. Fully qualified name: arclm.calculate_perplexity. Status: Stable.",
    "page": "api/root.html",
    "section": "calculate-perplexity"
  },
  {
    "type": "section",
    "title": "calculate_perplexity parameters",
    "description": "calculate_perplexity parameters",
    "page": "api/root.html",
    "section": "calculate-perplexity-parameters"
  },
  {
    "type": "section",
    "title": "calculate_perplexity example",
    "description": "calculate_perplexity example",
    "page": "api/root.html",
    "section": "calculate-perplexity-example"
  },
  {
    "type": "section",
    "title": "checkpoint_is_compatible_for_continue_training",
    "description": "Controleert of een checkpoint past bij continued training. Canonical import: from arclm import checkpoint_is_compatible_for_continue_training. Fully qualified name: arclm.checkpoint_is_compatible_for_continue_training. Status: Stable.",
    "page": "api/root.html",
    "section": "checkpoint-is-compatible-for-continue-training"
  },
  {
    "type": "section",
    "title": "checkpoint_is_compatible_for_continue_training parameters",
    "description": "checkpoint_is_compatible_for_continue_training parameters",
    "page": "api/root.html",
    "section": "checkpoint-is-compatible-for-continue-training-parameters"
  },
  {
    "type": "section",
    "title": "checkpoint_is_compatible_for_continue_training example",
    "description": "checkpoint_is_compatible_for_continue_training example",
    "page": "api/root.html",
    "section": "checkpoint-is-compatible-for-continue-training-example"
  },
  {
    "type": "section",
    "title": "checkpoint_is_compatible_for_tuining",
    "description": "Controleert of een checkpoint past bij finetuning. Canonical import: from arclm import checkpoint_is_compatible_for_tuining. Fully qualified name: arclm.checkpoint_is_compatible_for_tuining. Status: Deprecated.",
    "page": "api/root.html",
    "section": "checkpoint-is-compatible-for-tuining"
  },
  {
    "type": "section",
    "title": "checkpoint_is_compatible_for_tuining parameters",
    "description": "checkpoint_is_compatible_for_tuining parameters",
    "page": "api/root.html",
    "section": "checkpoint-is-compatible-for-tuining-parameters"
  },
  {
    "type": "section",
    "title": "checkpoint_is_compatible_for_tuining example",
    "description": "checkpoint_is_compatible_for_tuining example",
    "page": "api/root.html",
    "section": "checkpoint-is-compatible-for-tuining-example"
  },
  {
    "type": "section",
    "title": "continue_native_training",
    "description": "Continue native ArcLM training via ``train_model``. Canonical import: from arclm import continue_native_training. Fully qualified name: arclm.continue_native_training. Status: Stable.",
    "page": "api/root.html",
    "section": "continue-native-training"
  },
  {
    "type": "section",
    "title": "continue_native_training parameters",
    "description": "continue_native_training parameters",
    "page": "api/root.html",
    "section": "continue-native-training-parameters"
  },
  {
    "type": "section",
    "title": "continue_native_training example",
    "description": "continue_native_training example",
    "page": "api/root.html",
    "section": "continue-native-training-example"
  },
  {
    "type": "section",
    "title": "create_checkpoint_callback",
    "description": "Maakt een callback die het laatste hervatbare checkpoint opslaat. Canonical import: from arclm import create_checkpoint_callback. Fully qualified name: arclm.create_checkpoint_callback. Status: Stable.",
    "page": "api/root.html",
    "section": "create-checkpoint-callback"
  },
  {
    "type": "section",
    "title": "create_checkpoint_callback parameters",
    "description": "create_checkpoint_callback parameters",
    "page": "api/root.html",
    "section": "create-checkpoint-callback-parameters"
  },
  {
    "type": "section",
    "title": "create_checkpoint_callback example",
    "description": "create_checkpoint_callback example",
    "page": "api/root.html",
    "section": "create-checkpoint-callback-example"
  },
  {
    "type": "section",
    "title": "create_config",
    "description": "Maakt een `Config` met praktische defaults. Canonical import: from arclm import create_config. Fully qualified name: arclm.create_config. Status: Stable.",
    "page": "api/root.html",
    "section": "create-config"
  },
  {
    "type": "section",
    "title": "create_config parameters",
    "description": "create_config parameters",
    "page": "api/root.html",
    "section": "create-config-parameters"
  },
  {
    "type": "section",
    "title": "create_config example",
    "description": "create_config example",
    "page": "api/root.html",
    "section": "create-config-example"
  },
  {
    "type": "section",
    "title": "create_dataloader",
    "description": "Maakt een PyTorch DataLoader van token ids. Canonical import: from arclm import create_dataloader. Fully qualified name: arclm.create_dataloader. Status: Stable.",
    "page": "api/root.html",
    "section": "create-dataloader"
  },
  {
    "type": "section",
    "title": "create_dataloader parameters",
    "description": "create_dataloader parameters",
    "page": "api/root.html",
    "section": "create-dataloader-parameters"
  },
  {
    "type": "section",
    "title": "create_dataloader example",
    "description": "create_dataloader example",
    "page": "api/root.html",
    "section": "create-dataloader-example"
  },
  {
    "type": "section",
    "title": "create_dataset_manifest",
    "description": "Create lightweight dataset provenance without storing record values. Canonical import: from arclm import create_dataset_manifest. Fully qualified name: arclm.create_dataset_manifest. Status: Stable.",
    "page": "api/root.html",
    "section": "create-dataset-manifest"
  },
  {
    "type": "section",
    "title": "create_dataset_manifest parameters",
    "description": "create_dataset_manifest parameters",
    "page": "api/root.html",
    "section": "create-dataset-manifest-parameters"
  },
  {
    "type": "section",
    "title": "create_dataset_manifest example",
    "description": "create_dataset_manifest example",
    "page": "api/root.html",
    "section": "create-dataset-manifest-example"
  },
  {
    "type": "section",
    "title": "create_epoch_checkpoint_callback",
    "description": "Oude alias voor `create_checkpoint_callback`. Canonical import: from arclm import create_epoch_checkpoint_callback. Fully qualified name: arclm.create_epoch_checkpoint_callback. Status: Stable.",
    "page": "api/root.html",
    "section": "create-epoch-checkpoint-callback"
  },
  {
    "type": "section",
    "title": "create_epoch_checkpoint_callback parameters",
    "description": "create_epoch_checkpoint_callback parameters",
    "page": "api/root.html",
    "section": "create-epoch-checkpoint-callback-parameters"
  },
  {
    "type": "section",
    "title": "create_epoch_checkpoint_callback example",
    "description": "create_epoch_checkpoint_callback example",
    "page": "api/root.html",
    "section": "create-epoch-checkpoint-callback-example"
  },
  {
    "type": "section",
    "title": "create_instruction_dataloader",
    "description": "Maakt een DataLoader voor instruction tuning. Canonical import: from arclm import create_instruction_dataloader. Fully qualified name: arclm.create_instruction_dataloader. Status: Stable.",
    "page": "api/root.html",
    "section": "create-instruction-dataloader"
  },
  {
    "type": "section",
    "title": "create_instruction_dataloader parameters",
    "description": "create_instruction_dataloader parameters",
    "page": "api/root.html",
    "section": "create-instruction-dataloader-parameters"
  },
  {
    "type": "section",
    "title": "create_instruction_dataloader example",
    "description": "create_instruction_dataloader example",
    "page": "api/root.html",
    "section": "create-instruction-dataloader-example"
  },
  {
    "type": "section",
    "title": "create_simple_interface_app",
    "description": "Create the optional Flask app for ArcLM's simple web interface. Canonical import: from arclm import create_simple_interface_app. Fully qualified name: arclm.create_simple_interface_app. Status: Stable.",
    "page": "api/root.html",
    "section": "create-simple-interface-app"
  },
  {
    "type": "section",
    "title": "create_simple_interface_app parameters",
    "description": "create_simple_interface_app parameters",
    "page": "api/root.html",
    "section": "create-simple-interface-app-parameters"
  },
  {
    "type": "section",
    "title": "create_simple_interface_app example",
    "description": "create_simple_interface_app example",
    "page": "api/root.html",
    "section": "create-simple-interface-app-example"
  },
  {
    "type": "section",
    "title": "create_symbols",
    "description": "Maakt meerdere symbolen en geeft ze terug in een dict. Canonical import: from arclm import create_symbols. Fully qualified name: arclm.create_symbols. Status: Stable.",
    "page": "api/root.html",
    "section": "create-symbols"
  },
  {
    "type": "section",
    "title": "create_symbols parameters",
    "description": "create_symbols parameters",
    "page": "api/root.html",
    "section": "create-symbols-parameters"
  },
  {
    "type": "section",
    "title": "create_symbols example",
    "description": "create_symbols example",
    "page": "api/root.html",
    "section": "create-symbols-example"
  },
  {
    "type": "section",
    "title": "create_tokenizer",
    "description": "Maakt een tokenizer met een korte type-naam. Canonical import: from arclm import create_tokenizer. Fully qualified name: arclm.create_tokenizer. Status: Stable.",
    "page": "api/root.html",
    "section": "create-tokenizer"
  },
  {
    "type": "section",
    "title": "create_tokenizer parameters",
    "description": "create_tokenizer parameters",
    "page": "api/root.html",
    "section": "create-tokenizer-parameters"
  },
  {
    "type": "section",
    "title": "create_tokenizer example",
    "description": "create_tokenizer example",
    "page": "api/root.html",
    "section": "create-tokenizer-example"
  },
  {
    "type": "section",
    "title": "deduplicate",
    "description": "Verwijdert exacte duplicaten met `ExactDeduplicator`. Canonical import: from arclm import deduplicate. Fully qualified name: arclm.deduplicate. Status: Stable.",
    "page": "api/root.html",
    "section": "deduplicate"
  },
  {
    "type": "section",
    "title": "deduplicate parameters",
    "description": "deduplicate parameters",
    "page": "api/root.html",
    "section": "deduplicate-parameters"
  },
  {
    "type": "section",
    "title": "deduplicate example",
    "description": "deduplicate example",
    "page": "api/root.html",
    "section": "deduplicate-example"
  },
  {
    "type": "section",
    "title": "evaluate",
    "description": "Voert evaluatie uit met de standaard `Evaluator`. Canonical import: from arclm import evaluate. Fully qualified name: arclm.evaluate. Status: Stable.",
    "page": "api/root.html",
    "section": "evaluate"
  },
  {
    "type": "section",
    "title": "evaluate parameters",
    "description": "evaluate parameters",
    "page": "api/root.html",
    "section": "evaluate-parameters"
  },
  {
    "type": "section",
    "title": "evaluate example",
    "description": "evaluate example",
    "page": "api/root.html",
    "section": "evaluate-example"
  },
  {
    "type": "section",
    "title": "export_metrics_to_json",
    "description": "Export metrics report to JSON file. Canonical import: from arclm import export_metrics_to_json. Fully qualified name: arclm.export_metrics_to_json. Status: Stable.",
    "page": "api/root.html",
    "section": "export-metrics-to-json"
  },
  {
    "type": "section",
    "title": "export_metrics_to_json parameters",
    "description": "export_metrics_to_json parameters",
    "page": "api/root.html",
    "section": "export-metrics-to-json-parameters"
  },
  {
    "type": "section",
    "title": "export_metrics_to_json example",
    "description": "export_metrics_to_json example",
    "page": "api/root.html",
    "section": "export-metrics-to-json-example"
  },
  {
    "type": "section",
    "title": "export_metrics_to_markdown",
    "description": "Export metrics report to Markdown file. Canonical import: from arclm import export_metrics_to_markdown. Fully qualified name: arclm.export_metrics_to_markdown. Status: Stable.",
    "page": "api/root.html",
    "section": "export-metrics-to-markdown"
  },
  {
    "type": "section",
    "title": "export_metrics_to_markdown parameters",
    "description": "export_metrics_to_markdown parameters",
    "page": "api/root.html",
    "section": "export-metrics-to-markdown-parameters"
  },
  {
    "type": "section",
    "title": "export_metrics_to_markdown example",
    "description": "export_metrics_to_markdown example",
    "page": "api/root.html",
    "section": "export-metrics-to-markdown-example"
  },
  {
    "type": "section",
    "title": "fine_tune_external_model",
    "description": "Fine-tune an external model through supported ArcLM training backends. Canonical import: from arclm import fine_tune_external_model. Fully qualified name: arclm.fine_tune_external_model. Status: Stable.",
    "page": "api/root.html",
    "section": "fine-tune-external-model"
  },
  {
    "type": "section",
    "title": "fine_tune_external_model parameters",
    "description": "fine_tune_external_model parameters",
    "page": "api/root.html",
    "section": "fine-tune-external-model-parameters"
  },
  {
    "type": "section",
    "title": "fine_tune_external_model example",
    "description": "fine_tune_external_model example",
    "page": "api/root.html",
    "section": "fine-tune-external-model-example"
  },
  {
    "type": "section",
    "title": "fine_tune_native_model",
    "description": "Fine-tune a native ArcLM checkpoint via ``train_model``. Canonical import: from arclm import fine_tune_native_model. Fully qualified name: arclm.fine_tune_native_model. Status: Stable.",
    "page": "api/root.html",
    "section": "fine-tune-native-model"
  },
  {
    "type": "section",
    "title": "fine_tune_native_model parameters",
    "description": "fine_tune_native_model parameters",
    "page": "api/root.html",
    "section": "fine-tune-native-model-parameters"
  },
  {
    "type": "section",
    "title": "fine_tune_native_model example",
    "description": "fine_tune_native_model example",
    "page": "api/root.html",
    "section": "fine-tune-native-model-example"
  },
  {
    "type": "section",
    "title": "format_concept_benchmark_report",
    "description": "Create a readable concept benchmark report. Canonical import: from arclm import format_concept_benchmark_report. Fully qualified name: arclm.format_concept_benchmark_report. Status: Stable.",
    "page": "api/root.html",
    "section": "format-concept-benchmark-report"
  },
  {
    "type": "section",
    "title": "format_concept_benchmark_report parameters",
    "description": "format_concept_benchmark_report parameters",
    "page": "api/root.html",
    "section": "format-concept-benchmark-report-parameters"
  },
  {
    "type": "section",
    "title": "format_concept_benchmark_report example",
    "description": "format_concept_benchmark_report example",
    "page": "api/root.html",
    "section": "format-concept-benchmark-report-example"
  },
  {
    "type": "section",
    "title": "format_duration",
    "description": "Zet seconden om naar uren, minuten en seconden. Canonical import: from arclm import format_duration. Fully qualified name: arclm.format_duration. Status: Stable.",
    "page": "api/root.html",
    "section": "format-duration"
  },
  {
    "type": "section",
    "title": "format_duration parameters",
    "description": "format_duration parameters",
    "page": "api/root.html",
    "section": "format-duration-parameters"
  },
  {
    "type": "section",
    "title": "format_duration example",
    "description": "format_duration example",
    "page": "api/root.html",
    "section": "format-duration-example"
  },
  {
    "type": "section",
    "title": "format_long_context_results",
    "description": "Create a readable long-context comparison report. Canonical import: from arclm import format_long_context_results. Fully qualified name: arclm.format_long_context_results. Status: Stable.",
    "page": "api/root.html",
    "section": "format-long-context-results"
  },
  {
    "type": "section",
    "title": "format_long_context_results parameters",
    "description": "format_long_context_results parameters",
    "page": "api/root.html",
    "section": "format-long-context-results-parameters"
  },
  {
    "type": "section",
    "title": "format_long_context_results example",
    "description": "format_long_context_results example",
    "page": "api/root.html",
    "section": "format-long-context-results-example"
  },
  {
    "type": "section",
    "title": "format_tokenizer_coverage_report",
    "description": "Create a readable tokenizer coverage report. Canonical import: from arclm import format_tokenizer_coverage_report. Fully qualified name: arclm.format_tokenizer_coverage_report. Status: Stable.",
    "page": "api/root.html",
    "section": "format-tokenizer-coverage-report"
  },
  {
    "type": "section",
    "title": "format_tokenizer_coverage_report parameters",
    "description": "format_tokenizer_coverage_report parameters",
    "page": "api/root.html",
    "section": "format-tokenizer-coverage-report-parameters"
  },
  {
    "type": "section",
    "title": "format_tokenizer_coverage_report example",
    "description": "format_tokenizer_coverage_report example",
    "page": "api/root.html",
    "section": "format-tokenizer-coverage-report-example"
  },
  {
    "type": "section",
    "title": "format_top_k_predictions",
    "description": "Create a readable diagnostic report for one prompt. Canonical import: from arclm import format_top_k_predictions. Fully qualified name: arclm.format_top_k_predictions. Status: Stable.",
    "page": "api/root.html",
    "section": "format-top-k-predictions"
  },
  {
    "type": "section",
    "title": "format_top_k_predictions parameters",
    "description": "format_top_k_predictions parameters",
    "page": "api/root.html",
    "section": "format-top-k-predictions-parameters"
  },
  {
    "type": "section",
    "title": "format_top_k_predictions example",
    "description": "format_top_k_predictions example",
    "page": "api/root.html",
    "section": "format-top-k-predictions-example"
  },
  {
    "type": "section",
    "title": "get_api_version",
    "description": "Return the installed ArcLM API version. Canonical import: from arclm import get_api_version. Fully qualified name: arclm.get_api_version. Status: Stable.",
    "page": "api/root.html",
    "section": "get-api-version"
  },
  {
    "type": "section",
    "title": "get_api_version parameters",
    "description": "get_api_version parameters",
    "page": "api/root.html",
    "section": "get-api-version-parameters"
  },
  {
    "type": "section",
    "title": "get_api_version example",
    "description": "get_api_version example",
    "page": "api/root.html",
    "section": "get-api-version-example"
  },
  {
    "type": "section",
    "title": "get_device",
    "description": "Return the preferred local torch device. Canonical import: from arclm import get_device. Fully qualified name: arclm.get_device. Status: Stable.",
    "page": "api/root.html",
    "section": "get-device"
  },
  {
    "type": "section",
    "title": "get_device parameters",
    "description": "get_device parameters",
    "page": "api/root.html",
    "section": "get-device-parameters"
  },
  {
    "type": "section",
    "title": "get_device example",
    "description": "get_device example",
    "page": "api/root.html",
    "section": "get-device-example"
  },
  {
    "type": "section",
    "title": "get_model_capability",
    "description": "Return the capability report for a known exact model path. Canonical import: from arclm import get_model_capability. Fully qualified name: arclm.get_model_capability. Status: Stable.",
    "page": "api/root.html",
    "section": "get-model-capability"
  },
  {
    "type": "section",
    "title": "get_model_capability parameters",
    "description": "get_model_capability parameters",
    "page": "api/root.html",
    "section": "get-model-capability-parameters"
  },
  {
    "type": "section",
    "title": "get_model_capability example",
    "description": "get_model_capability example",
    "page": "api/root.html",
    "section": "get-model-capability-example"
  },
  {
    "type": "section",
    "title": "get_sft_record_contract",
    "description": "Describe one supported SFT record format. Canonical import: from arclm import get_sft_record_contract. Fully qualified name: arclm.get_sft_record_contract. Status: Stable.",
    "page": "api/root.html",
    "section": "get-sft-record-contract"
  },
  {
    "type": "section",
    "title": "get_sft_record_contract parameters",
    "description": "get_sft_record_contract parameters",
    "page": "api/root.html",
    "section": "get-sft-record-contract-parameters"
  },
  {
    "type": "section",
    "title": "get_sft_record_contract example",
    "description": "get_sft_record_contract example",
    "page": "api/root.html",
    "section": "get-sft-record-contract-example"
  },
  {
    "type": "section",
    "title": "get_tokenizer_from_config",
    "description": "Maakt een tokenizer vanuit een config object. Canonical import: from arclm import get_tokenizer_from_config. Fully qualified name: arclm.get_tokenizer_from_config. Status: Stable.",
    "page": "api/root.html",
    "section": "get-tokenizer-from-config"
  },
  {
    "type": "section",
    "title": "get_tokenizer_from_config parameters",
    "description": "get_tokenizer_from_config parameters",
    "page": "api/root.html",
    "section": "get-tokenizer-from-config-parameters"
  },
  {
    "type": "section",
    "title": "get_tokenizer_from_config example",
    "description": "get_tokenizer_from_config example",
    "page": "api/root.html",
    "section": "get-tokenizer-from-config-example"
  },
  {
    "type": "section",
    "title": "get_version",
    "description": "Return the installed ArcLM version. Canonical import: from arclm import get_version. Fully qualified name: arclm.get_version. Status: Stable.",
    "page": "api/root.html",
    "section": "get-version"
  },
  {
    "type": "section",
    "title": "get_version parameters",
    "description": "get_version parameters",
    "page": "api/root.html",
    "section": "get-version-parameters"
  },
  {
    "type": "section",
    "title": "get_version example",
    "description": "get_version example",
    "page": "api/root.html",
    "section": "get-version-example"
  },
  {
    "type": "section",
    "title": "inspect_model_source",
    "description": "Inspect a local path or Hugging Face model ID before loading. Canonical import: from arclm import inspect_model_source. Fully qualified name: arclm.inspect_model_source. Status: Stable.",
    "page": "api/root.html",
    "section": "inspect-model-source"
  },
  {
    "type": "section",
    "title": "inspect_model_source parameters",
    "description": "inspect_model_source parameters",
    "page": "api/root.html",
    "section": "inspect-model-source-parameters"
  },
  {
    "type": "section",
    "title": "inspect_model_source example",
    "description": "inspect_model_source example",
    "page": "api/root.html",
    "section": "inspect-model-source-example"
  },
  {
    "type": "section",
    "title": "inspect_text",
    "description": "Inspect one native ArcLM text-generation step. Canonical import: from arclm import inspect_text. Fully qualified name: arclm.inspect_text. Status: Stable.",
    "page": "api/root.html",
    "section": "inspect-text"
  },
  {
    "type": "section",
    "title": "inspect_text parameters",
    "description": "inspect_text parameters",
    "page": "api/root.html",
    "section": "inspect-text-parameters"
  },
  {
    "type": "section",
    "title": "inspect_text example",
    "description": "inspect_text example",
    "page": "api/root.html",
    "section": "inspect-text-example"
  },
  {
    "type": "section",
    "title": "list_available_models",
    "description": "List local ``.pth`` checkpoints in a models directory. Canonical import: from arclm import list_available_models. Fully qualified name: arclm.list_available_models. Status: Stable.",
    "page": "api/root.html",
    "section": "list-available-models"
  },
  {
    "type": "section",
    "title": "list_available_models parameters",
    "description": "list_available_models parameters",
    "page": "api/root.html",
    "section": "list-available-models-parameters"
  },
  {
    "type": "section",
    "title": "list_available_models example",
    "description": "list_available_models example",
    "page": "api/root.html",
    "section": "list-available-models-example"
  },
  {
    "type": "section",
    "title": "load_any_model",
    "description": "Load any supported ArcLM or Hugging Face causal LM source for inference. Canonical import: from arclm import load_any_model. Fully qualified name: arclm.load_any_model. Status: Stable.",
    "page": "api/root.html",
    "section": "load-any-model"
  },
  {
    "type": "section",
    "title": "load_any_model parameters",
    "description": "load_any_model parameters",
    "page": "api/root.html",
    "section": "load-any-model-parameters"
  },
  {
    "type": "section",
    "title": "load_any_model example",
    "description": "load_any_model example",
    "page": "api/root.html",
    "section": "load-any-model-example"
  },
  {
    "type": "section",
    "title": "load_compatible_checkpoint",
    "description": "Laadt een bestaand checkpoint als het past bij deze training. Canonical import: from arclm import load_compatible_checkpoint. Fully qualified name: arclm.load_compatible_checkpoint. Status: Stable.",
    "page": "api/root.html",
    "section": "load-compatible-checkpoint"
  },
  {
    "type": "section",
    "title": "load_compatible_checkpoint parameters",
    "description": "load_compatible_checkpoint parameters",
    "page": "api/root.html",
    "section": "load-compatible-checkpoint-parameters"
  },
  {
    "type": "section",
    "title": "load_compatible_checkpoint example",
    "description": "load_compatible_checkpoint example",
    "page": "api/root.html",
    "section": "load-compatible-checkpoint-example"
  },
  {
    "type": "section",
    "title": "load_dataset",
    "description": "Laadt een dataset met de standaard DatasetLoader. Canonical import: from arclm import load_dataset. Fully qualified name: arclm.load_dataset. Status: Stable.",
    "page": "api/root.html",
    "section": "load-dataset"
  },
  {
    "type": "section",
    "title": "load_dataset parameters",
    "description": "load_dataset parameters",
    "page": "api/root.html",
    "section": "load-dataset-parameters"
  },
  {
    "type": "section",
    "title": "load_dataset example",
    "description": "load_dataset example",
    "page": "api/root.html",
    "section": "load-dataset-example"
  },
  {
    "type": "section",
    "title": "load_external_for_inference",
    "description": "Backward-friendly alias for :func:`load_any_model`. Canonical import: from arclm import load_external_for_inference. Fully qualified name: arclm.load_external_for_inference. Status: Stable.",
    "page": "api/root.html",
    "section": "load-external-for-inference"
  },
  {
    "type": "section",
    "title": "load_external_for_inference parameters",
    "description": "load_external_for_inference parameters",
    "page": "api/root.html",
    "section": "load-external-for-inference-parameters"
  },
  {
    "type": "section",
    "title": "load_external_for_inference example",
    "description": "load_external_for_inference example",
    "page": "api/root.html",
    "section": "load-external-for-inference-example"
  },
  {
    "type": "section",
    "title": "load_external_model",
    "description": "Load any supported external source into a normalized checkpoint bundle. Canonical import: from arclm import load_external_model. Fully qualified name: arclm.load_external_model. Status: Stable.",
    "page": "api/root.html",
    "section": "load-external-model"
  },
  {
    "type": "section",
    "title": "load_external_model parameters",
    "description": "load_external_model parameters",
    "page": "api/root.html",
    "section": "load-external-model-parameters"
  },
  {
    "type": "section",
    "title": "load_external_model example",
    "description": "load_external_model example",
    "page": "api/root.html",
    "section": "load-external-model-example"
  },
  {
    "type": "section",
    "title": "load_model",
    "description": "Load a trained ArcLM checkpoint for inference. Canonical import: from arclm import load_model. Fully qualified name: arclm.load_model. Status: Stable.",
    "page": "api/root.html",
    "section": "load-model"
  },
  {
    "type": "section",
    "title": "load_model parameters",
    "description": "load_model parameters",
    "page": "api/root.html",
    "section": "load-model-parameters"
  },
  {
    "type": "section",
    "title": "load_model example",
    "description": "load_model example",
    "page": "api/root.html",
    "section": "load-model-example"
  },
  {
    "type": "section",
    "title": "load_tokens",
    "description": "Laadt tokens uit de ingestelde dataset en optioneel uit domeindata. Canonical import: from arclm import load_tokens. Fully qualified name: arclm.load_tokens. Status: Stable.",
    "page": "api/root.html",
    "section": "load-tokens"
  },
  {
    "type": "section",
    "title": "load_tokens parameters",
    "description": "load_tokens parameters",
    "page": "api/root.html",
    "section": "load-tokens-parameters"
  },
  {
    "type": "section",
    "title": "load_tokens example",
    "description": "load_tokens example",
    "page": "api/root.html",
    "section": "load-tokens-example"
  },
  {
    "type": "section",
    "title": "load_training_checkpoint",
    "description": "Load a trusted ArcLM/PyTorch training checkpoint. Canonical import: from arclm import load_training_checkpoint. Fully qualified name: arclm.load_training_checkpoint. Status: Stable.",
    "page": "api/root.html",
    "section": "load-training-checkpoint"
  },
  {
    "type": "section",
    "title": "load_training_checkpoint parameters",
    "description": "load_training_checkpoint parameters",
    "page": "api/root.html",
    "section": "load-training-checkpoint-parameters"
  },
  {
    "type": "section",
    "title": "load_training_checkpoint example",
    "description": "load_training_checkpoint example",
    "page": "api/root.html",
    "section": "load-training-checkpoint-example"
  },
  {
    "type": "section",
    "title": "model_check",
    "description": "Controleert of kennis altijd de query waar maakt. Canonical import: from arclm import model_check. Fully qualified name: arclm.model_check. Status: Stable.",
    "page": "api/root.html",
    "section": "model-check"
  },
  {
    "type": "section",
    "title": "model_check parameters",
    "description": "model_check parameters",
    "page": "api/root.html",
    "section": "model-check-parameters"
  },
  {
    "type": "section",
    "title": "model_check example",
    "description": "model_check example",
    "page": "api/root.html",
    "section": "model-check-example"
  },
  {
    "type": "section",
    "title": "model_support_matrix",
    "description": "Return the compact support matrix for the official 0.8 model set. Canonical import: from arclm import model_support_matrix. Fully qualified name: arclm.model_support_matrix. Status: Stable.",
    "page": "api/root.html",
    "section": "model-support-matrix"
  },
  {
    "type": "section",
    "title": "model_support_matrix parameters",
    "description": "model_support_matrix parameters",
    "page": "api/root.html",
    "section": "model-support-matrix-parameters"
  },
  {
    "type": "section",
    "title": "model_support_matrix example",
    "description": "model_support_matrix example",
    "page": "api/root.html",
    "section": "model-support-matrix-example"
  },
  {
    "type": "section",
    "title": "predict",
    "description": "Predict with a cached model using the same defaults as load_model(). Canonical import: from arclm import predict. Fully qualified name: arclm.predict. Status: Stable.",
    "page": "api/root.html",
    "section": "predict"
  },
  {
    "type": "section",
    "title": "predict parameters",
    "description": "predict parameters",
    "page": "api/root.html",
    "section": "predict-parameters"
  },
  {
    "type": "section",
    "title": "predict example",
    "description": "predict example",
    "page": "api/root.html",
    "section": "predict-example"
  },
  {
    "type": "section",
    "title": "predict_external",
    "description": "Load a source and return a single prediction. Canonical import: from arclm import predict_external. Fully qualified name: arclm.predict_external. Status: Stable.",
    "page": "api/root.html",
    "section": "predict-external"
  },
  {
    "type": "section",
    "title": "predict_external parameters",
    "description": "predict_external parameters",
    "page": "api/root.html",
    "section": "predict-external-parameters"
  },
  {
    "type": "section",
    "title": "predict_external example",
    "description": "predict_external example",
    "page": "api/root.html",
    "section": "predict-external-example"
  },
  {
    "type": "section",
    "title": "predict_top_k",
    "description": "Return the top-k next-token probabilities for a prompt. Canonical import: from arclm import predict_top_k. Fully qualified name: arclm.predict_top_k. Status: Stable.",
    "page": "api/root.html",
    "section": "predict-top-k"
  },
  {
    "type": "section",
    "title": "predict_top_k parameters",
    "description": "predict_top_k parameters",
    "page": "api/root.html",
    "section": "predict-top-k-parameters"
  },
  {
    "type": "section",
    "title": "predict_top_k example",
    "description": "predict_top_k example",
    "page": "api/root.html",
    "section": "predict-top-k-example"
  },
  {
    "type": "section",
    "title": "prepare_data",
    "description": "Maakt tokens, splits, tokenizer en DataLoaders klaar voor training. Canonical import: from arclm import prepare_data. Fully qualified name: arclm.prepare_data. Status: Stable.",
    "page": "api/root.html",
    "section": "prepare-data"
  },
  {
    "type": "section",
    "title": "prepare_data parameters",
    "description": "prepare_data parameters",
    "page": "api/root.html",
    "section": "prepare-data-parameters"
  },
  {
    "type": "section",
    "title": "prepare_data example",
    "description": "prepare_data example",
    "page": "api/root.html",
    "section": "prepare-data-example"
  },
  {
    "type": "section",
    "title": "read_tokens",
    "description": "Leest lowercase whitespace tokens uit een tekstbestand en bewaart newlines. Canonical import: from arclm import read_tokens. Fully qualified name: arclm.read_tokens. Status: Stable.",
    "page": "api/root.html",
    "section": "read-tokens"
  },
  {
    "type": "section",
    "title": "read_tokens parameters",
    "description": "read_tokens parameters",
    "page": "api/root.html",
    "section": "read-tokens-parameters"
  },
  {
    "type": "section",
    "title": "read_tokens example",
    "description": "read_tokens example",
    "page": "api/root.html",
    "section": "read-tokens-example"
  },
  {
    "type": "section",
    "title": "register_model_inspector",
    "description": "Register a custom model-source inspector. Canonical import: from arclm import register_model_inspector. Fully qualified name: arclm.register_model_inspector. Status: Stable.",
    "page": "api/root.html",
    "section": "register-model-inspector"
  },
  {
    "type": "section",
    "title": "register_model_inspector parameters",
    "description": "register_model_inspector parameters",
    "page": "api/root.html",
    "section": "register-model-inspector-parameters"
  },
  {
    "type": "section",
    "title": "register_model_inspector example",
    "description": "register_model_inspector example",
    "page": "api/root.html",
    "section": "register-model-inspector-example"
  },
  {
    "type": "section",
    "title": "report_environment",
    "description": "Return a short human-readable runtime report. Canonical import: from arclm import report_environment. Fully qualified name: arclm.report_environment. Status: Stable.",
    "page": "api/root.html",
    "section": "report-environment"
  },
  {
    "type": "section",
    "title": "report_environment parameters",
    "description": "report_environment parameters",
    "page": "api/root.html",
    "section": "report-environment-parameters"
  },
  {
    "type": "section",
    "title": "report_environment example",
    "description": "report_environment example",
    "page": "api/root.html",
    "section": "report-environment-example"
  },
  {
    "type": "section",
    "title": "run_long_context_evaluation",
    "description": "Train and compare multiple block sizes by validation loss and concepts. Canonical import: from arclm import run_long_context_evaluation. Fully qualified name: arclm.run_long_context_evaluation. Status: Stable.",
    "page": "api/root.html",
    "section": "run-long-context-evaluation"
  },
  {
    "type": "section",
    "title": "run_long_context_evaluation parameters",
    "description": "run_long_context_evaluation parameters",
    "page": "api/root.html",
    "section": "run-long-context-evaluation-parameters"
  },
  {
    "type": "section",
    "title": "run_long_context_evaluation example",
    "description": "run_long_context_evaluation example",
    "page": "api/root.html",
    "section": "run-long-context-evaluation-example"
  },
  {
    "type": "section",
    "title": "run_simple_interface",
    "description": "Run ArcLM's optional simple web interface. Canonical import: from arclm import run_simple_interface. Fully qualified name: arclm.run_simple_interface. Status: Stable.",
    "page": "api/root.html",
    "section": "run-simple-interface"
  },
  {
    "type": "section",
    "title": "run_simple_interface parameters",
    "description": "run_simple_interface parameters",
    "page": "api/root.html",
    "section": "run-simple-interface-parameters"
  },
  {
    "type": "section",
    "title": "run_simple_interface example",
    "description": "run_simple_interface example",
    "page": "api/root.html",
    "section": "run-simple-interface-example"
  },
  {
    "type": "section",
    "title": "save_loaded_model",
    "description": "Save a loaded model according to :class:`ModelSaveConfig`. Canonical import: from arclm import save_loaded_model. Fully qualified name: arclm.save_loaded_model. Status: Stable.",
    "page": "api/root.html",
    "section": "save-loaded-model"
  },
  {
    "type": "section",
    "title": "save_loaded_model parameters",
    "description": "save_loaded_model parameters",
    "page": "api/root.html",
    "section": "save-loaded-model-parameters"
  },
  {
    "type": "section",
    "title": "save_loaded_model example",
    "description": "save_loaded_model example",
    "page": "api/root.html",
    "section": "save-loaded-model-example"
  },
  {
    "type": "section",
    "title": "save_training_checkpoint",
    "description": "Slaat een trainer checkpoint op met tokenizer metadata. Canonical import: from arclm import save_training_checkpoint. Fully qualified name: arclm.save_training_checkpoint. Status: Stable.",
    "page": "api/root.html",
    "section": "save-training-checkpoint"
  },
  {
    "type": "section",
    "title": "save_training_checkpoint parameters",
    "description": "save_training_checkpoint parameters",
    "page": "api/root.html",
    "section": "save-training-checkpoint-parameters"
  },
  {
    "type": "section",
    "title": "save_training_checkpoint example",
    "description": "save_training_checkpoint example",
    "page": "api/root.html",
    "section": "save-training-checkpoint-example"
  },
  {
    "type": "section",
    "title": "score_concept_relationships",
    "description": "Score expected concepts against top-k next-token predictions. Canonical import: from arclm import score_concept_relationships. Fully qualified name: arclm.score_concept_relationships. Status: Stable.",
    "page": "api/root.html",
    "section": "score-concept-relationships"
  },
  {
    "type": "section",
    "title": "score_concept_relationships parameters",
    "description": "score_concept_relationships parameters",
    "page": "api/root.html",
    "section": "score-concept-relationships-parameters"
  },
  {
    "type": "section",
    "title": "score_concept_relationships example",
    "description": "score_concept_relationships example",
    "page": "api/root.html",
    "section": "score-concept-relationships-example"
  },
  {
    "type": "section",
    "title": "split_train_val",
    "description": "Splitst tokens in train en validatie data. Canonical import: from arclm import split_train_val. Fully qualified name: arclm.split_train_val. Status: Stable.",
    "page": "api/root.html",
    "section": "split-train-val"
  },
  {
    "type": "section",
    "title": "split_train_val parameters",
    "description": "split_train_val parameters",
    "page": "api/root.html",
    "section": "split-train-val-parameters"
  },
  {
    "type": "section",
    "title": "split_train_val example",
    "description": "split_train_val example",
    "page": "api/root.html",
    "section": "split-train-val-example"
  },
  {
    "type": "section",
    "title": "tokenizer_from_checkpoint",
    "description": "Haalt een ArcLM tokenizer uit een checkpoint of checkpoint-pad. Canonical import: from arclm import tokenizer_from_checkpoint. Fully qualified name: arclm.tokenizer_from_checkpoint. Status: Stable.",
    "page": "api/root.html",
    "section": "tokenizer-from-checkpoint"
  },
  {
    "type": "section",
    "title": "tokenizer_from_checkpoint parameters",
    "description": "tokenizer_from_checkpoint parameters",
    "page": "api/root.html",
    "section": "tokenizer-from-checkpoint-parameters"
  },
  {
    "type": "section",
    "title": "tokenizer_from_checkpoint example",
    "description": "tokenizer_from_checkpoint example",
    "page": "api/root.html",
    "section": "tokenizer-from-checkpoint-example"
  },
  {
    "type": "section",
    "title": "train_model",
    "description": "Traint een ArcLM model in pretrain, finetune of continue_training mode. Canonical import: from arclm import train_model. Fully qualified name: arclm.train_model. Status: Stable.",
    "page": "api/root.html",
    "section": "train-model"
  },
  {
    "type": "section",
    "title": "train_model parameters",
    "description": "train_model parameters",
    "page": "api/root.html",
    "section": "train-model-parameters"
  },
  {
    "type": "section",
    "title": "train_model example",
    "description": "train_model example",
    "page": "api/root.html",
    "section": "train-model-example"
  },
  {
    "type": "section",
    "title": "train_native_model",
    "description": "Train a native ArcLM model by delegating to ``train_model(mode='pretrain')``. Canonical import: from arclm import train_native_model. Fully qualified name: arclm.train_native_model. Status: Stable.",
    "page": "api/root.html",
    "section": "train-native-model"
  },
  {
    "type": "section",
    "title": "train_native_model parameters",
    "description": "train_native_model parameters",
    "page": "api/root.html",
    "section": "train-native-model-parameters"
  },
  {
    "type": "section",
    "title": "train_native_model example",
    "description": "train_native_model example",
    "page": "api/root.html",
    "section": "train-native-model-example"
  },
  {
    "type": "section",
    "title": "train_sft",
    "description": "Run supervised fine-tuning through an ArcLM backend. Canonical import: from arclm import train_sft. Fully qualified name: arclm.train_sft. Status: Stable.",
    "page": "api/root.html",
    "section": "train-sft"
  },
  {
    "type": "section",
    "title": "train_sft parameters",
    "description": "train_sft parameters",
    "page": "api/root.html",
    "section": "train-sft-parameters"
  },
  {
    "type": "section",
    "title": "train_sft example",
    "description": "train_sft example",
    "page": "api/root.html",
    "section": "train-sft-example"
  },
  {
    "type": "section",
    "title": "validate_records",
    "description": "Validate mapping records with a small schema. Canonical import: from arclm import validate_records. Fully qualified name: arclm.validate_records. Status: Stable.",
    "page": "api/root.html",
    "section": "validate-records"
  },
  {
    "type": "section",
    "title": "validate_records parameters",
    "description": "validate_records parameters",
    "page": "api/root.html",
    "section": "validate-records-parameters"
  },
  {
    "type": "section",
    "title": "validate_records example",
    "description": "validate_records example",
    "page": "api/root.html",
    "section": "validate-records-example"
  },
  {
    "type": "section",
    "title": "validate_sft_records",
    "description": "Validate SFT records through the canonical fine-tuning normalizer. Canonical import: from arclm import validate_sft_records. Fully qualified name: arclm.validate_sft_records. Status: Stable.",
    "page": "api/root.html",
    "section": "validate-sft-records"
  },
  {
    "type": "section",
    "title": "validate_sft_records parameters",
    "description": "validate_sft_records parameters",
    "page": "api/root.html",
    "section": "validate-sft-records-parameters"
  },
  {
    "type": "section",
    "title": "validate_sft_records example",
    "description": "validate_sft_records example",
    "page": "api/root.html",
    "section": "validate-sft-records-example"
  },
  {
    "type": "section",
    "title": "validate_tokenizer_compatibility",
    "description": "Raise if a tokenizer cannot safely address the checkpoint vocabulary. Canonical import: from arclm import validate_tokenizer_compatibility. Fully qualified name: arclm.validate_tokenizer_compatibility. Status: Stable.",
    "page": "api/root.html",
    "section": "validate-tokenizer-compatibility"
  },
  {
    "type": "section",
    "title": "validate_tokenizer_compatibility parameters",
    "description": "validate_tokenizer_compatibility parameters",
    "page": "api/root.html",
    "section": "validate-tokenizer-compatibility-parameters"
  },
  {
    "type": "section",
    "title": "validate_tokenizer_compatibility example",
    "description": "validate_tokenizer_compatibility example",
    "page": "api/root.html",
    "section": "validate-tokenizer-compatibility-example"
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
    "title": "BaseAugmenter",
    "description": "Basis class voor eigen data augmenters. Canonical import: from arclm.datasets import BaseAugmenter. Fully qualified name: arclm.datasets.BaseAugmenter. Status: Stable.",
    "page": "api/datasets.html",
    "section": "baseaugmenter"
  },
  {
    "type": "section",
    "title": "BaseAugmenter parameters",
    "description": "BaseAugmenter parameters",
    "page": "api/datasets.html",
    "section": "baseaugmenter-parameters"
  },
  {
    "type": "section",
    "title": "BaseAugmenter example",
    "description": "BaseAugmenter example",
    "page": "api/datasets.html",
    "section": "baseaugmenter-example"
  },
  {
    "type": "section",
    "title": "BaseCleaner",
    "description": "Basis class voor eigen data cleaners. Canonical import: from arclm.datasets import BaseCleaner. Fully qualified name: arclm.datasets.BaseCleaner. Status: Stable.",
    "page": "api/datasets.html",
    "section": "basecleaner"
  },
  {
    "type": "section",
    "title": "BaseCleaner parameters",
    "description": "BaseCleaner parameters",
    "page": "api/datasets.html",
    "section": "basecleaner-parameters"
  },
  {
    "type": "section",
    "title": "BaseCleaner example",
    "description": "BaseCleaner example",
    "page": "api/datasets.html",
    "section": "basecleaner-example"
  },
  {
    "type": "section",
    "title": "BaseDataset",
    "description": "Basis class voor datasets met lengte en index-toegang. Canonical import: from arclm.datasets import BaseDataset. Fully qualified name: arclm.datasets.BaseDataset. Status: Stable.",
    "page": "api/datasets.html",
    "section": "basedataset"
  },
  {
    "type": "section",
    "title": "BaseDataset parameters",
    "description": "BaseDataset parameters",
    "page": "api/datasets.html",
    "section": "basedataset-parameters"
  },
  {
    "type": "section",
    "title": "BaseDataset example",
    "description": "BaseDataset example",
    "page": "api/datasets.html",
    "section": "basedataset-example"
  },
  {
    "type": "section",
    "title": "BaseDataStep",
    "description": "Basis class voor een stap die een voorbeeld verwerkt. Canonical import: from arclm.datasets import BaseDataStep. Fully qualified name: arclm.datasets.BaseDataStep. Status: Stable.",
    "page": "api/datasets.html",
    "section": "basedatastep"
  },
  {
    "type": "section",
    "title": "BaseDataStep parameters",
    "description": "BaseDataStep parameters",
    "page": "api/datasets.html",
    "section": "basedatastep-parameters"
  },
  {
    "type": "section",
    "title": "BaseDataStep example",
    "description": "BaseDataStep example",
    "page": "api/datasets.html",
    "section": "basedatastep-example"
  },
  {
    "type": "section",
    "title": "BaseDeduplicator",
    "description": "Basis class voor deduplicatie over een hele dataset. Canonical import: from arclm.datasets import BaseDeduplicator. Fully qualified name: arclm.datasets.BaseDeduplicator. Status: Stable.",
    "page": "api/datasets.html",
    "section": "basededuplicator"
  },
  {
    "type": "section",
    "title": "BaseDeduplicator parameters",
    "description": "BaseDeduplicator parameters",
    "page": "api/datasets.html",
    "section": "basededuplicator-parameters"
  },
  {
    "type": "section",
    "title": "BaseDeduplicator example",
    "description": "BaseDeduplicator example",
    "page": "api/datasets.html",
    "section": "basededuplicator-example"
  },
  {
    "type": "section",
    "title": "BaseStreamingDataset",
    "description": "Basis class voor datasets die je alleen kunt doorlopen. Canonical import: from arclm.datasets import BaseStreamingDataset. Fully qualified name: arclm.datasets.BaseStreamingDataset. Status: Stable.",
    "page": "api/datasets.html",
    "section": "basestreamingdataset"
  },
  {
    "type": "section",
    "title": "BaseStreamingDataset parameters",
    "description": "BaseStreamingDataset parameters",
    "page": "api/datasets.html",
    "section": "basestreamingdataset-parameters"
  },
  {
    "type": "section",
    "title": "BaseStreamingDataset example",
    "description": "BaseStreamingDataset example",
    "page": "api/datasets.html",
    "section": "basestreamingdataset-example"
  },
  {
    "type": "section",
    "title": "BaseSyntheticDataGenerator",
    "description": "Basis class voor eigen synthetic-data generators. Canonical import: from arclm.datasets import BaseSyntheticDataGenerator. Fully qualified name: arclm.datasets.BaseSyntheticDataGenerator. Status: Stable.",
    "page": "api/datasets.html",
    "section": "basesyntheticdatagenerator"
  },
  {
    "type": "section",
    "title": "BaseSyntheticDataGenerator parameters",
    "description": "BaseSyntheticDataGenerator parameters",
    "page": "api/datasets.html",
    "section": "basesyntheticdatagenerator-parameters"
  },
  {
    "type": "section",
    "title": "BaseSyntheticDataGenerator example",
    "description": "BaseSyntheticDataGenerator example",
    "page": "api/datasets.html",
    "section": "basesyntheticdatagenerator-example"
  },
  {
    "type": "section",
    "title": "DataAugmenter",
    "description": "Basis class voor eigen data augmenters. Canonical import: from arclm.datasets import DataAugmenter. Fully qualified name: arclm.datasets.DataAugmenter. Status: Stable.",
    "page": "api/datasets.html",
    "section": "dataaugmenter"
  },
  {
    "type": "section",
    "title": "DataAugmenter parameters",
    "description": "DataAugmenter parameters",
    "page": "api/datasets.html",
    "section": "dataaugmenter-parameters"
  },
  {
    "type": "section",
    "title": "DataAugmenter example",
    "description": "DataAugmenter example",
    "page": "api/datasets.html",
    "section": "dataaugmenter-example"
  },
  {
    "type": "section",
    "title": "DataBundle",
    "description": "Bundel met tokens, tokenizer en loaders voor training. Canonical import: from arclm.datasets import DataBundle. Fully qualified name: arclm.datasets.DataBundle. Status: Stable.",
    "page": "api/datasets.html",
    "section": "databundle"
  },
  {
    "type": "section",
    "title": "DataBundle parameters",
    "description": "DataBundle parameters",
    "page": "api/datasets.html",
    "section": "databundle-parameters"
  },
  {
    "type": "section",
    "title": "DataBundle example",
    "description": "DataBundle example",
    "page": "api/datasets.html",
    "section": "databundle-example"
  },
  {
    "type": "section",
    "title": "DataCleaner",
    "description": "Basis class voor eigen data cleaners. Canonical import: from arclm.datasets import DataCleaner. Fully qualified name: arclm.datasets.DataCleaner. Status: Stable.",
    "page": "api/datasets.html",
    "section": "datacleaner"
  },
  {
    "type": "section",
    "title": "DataCleaner parameters",
    "description": "DataCleaner parameters",
    "page": "api/datasets.html",
    "section": "datacleaner-parameters"
  },
  {
    "type": "section",
    "title": "DataCleaner example",
    "description": "DataCleaner example",
    "page": "api/datasets.html",
    "section": "datacleaner-example"
  },
  {
    "type": "section",
    "title": "DataPipeline",
    "description": "Voert meerdere data-stappen na elkaar uit. Canonical import: from arclm.datasets import DataPipeline. Fully qualified name: arclm.datasets.DataPipeline. Status: Stable.",
    "page": "api/datasets.html",
    "section": "datapipeline"
  },
  {
    "type": "section",
    "title": "DataPipeline parameters",
    "description": "DataPipeline parameters",
    "page": "api/datasets.html",
    "section": "datapipeline-parameters"
  },
  {
    "type": "section",
    "title": "DataPipeline example",
    "description": "DataPipeline example",
    "page": "api/datasets.html",
    "section": "datapipeline-example"
  },
  {
    "type": "section",
    "title": "DataProcessor",
    "description": "Compatibility-friendly entry point for ``ProcessedDataset`` workflows. Canonical import: from arclm.datasets import DataProcessor. Fully qualified name: arclm.datasets.DataProcessor. Status: Stable.",
    "page": "api/datasets.html",
    "section": "dataprocessor"
  },
  {
    "type": "section",
    "title": "DataProcessor parameters",
    "description": "DataProcessor parameters",
    "page": "api/datasets.html",
    "section": "dataprocessor-parameters"
  },
  {
    "type": "section",
    "title": "DataProcessor example",
    "description": "DataProcessor example",
    "page": "api/datasets.html",
    "section": "dataprocessor-example"
  },
  {
    "type": "section",
    "title": "DatasetConfig",
    "description": "Configuratie voor `load_dataset` wanneer je opties wilt hergebruiken. Canonical import: from arclm.datasets import DatasetConfig. Fully qualified name: arclm.datasets.DatasetConfig. Status: Stable.",
    "page": "api/datasets.html",
    "section": "datasetconfig"
  },
  {
    "type": "section",
    "title": "DatasetConfig parameters",
    "description": "DatasetConfig parameters",
    "page": "api/datasets.html",
    "section": "datasetconfig-parameters"
  },
  {
    "type": "section",
    "title": "DatasetConfig example",
    "description": "DatasetConfig example",
    "page": "api/datasets.html",
    "section": "datasetconfig-example"
  },
  {
    "type": "section",
    "title": "DatasetLoader",
    "description": "Laadt datasets uit simpele lokale bronnen. Canonical import: from arclm.datasets import DatasetLoader. Fully qualified name: arclm.datasets.DatasetLoader. Status: Stable.",
    "page": "api/datasets.html",
    "section": "datasetloader"
  },
  {
    "type": "section",
    "title": "DatasetLoader parameters",
    "description": "DatasetLoader parameters",
    "page": "api/datasets.html",
    "section": "datasetloader-parameters"
  },
  {
    "type": "section",
    "title": "DatasetLoader example",
    "description": "DatasetLoader example",
    "page": "api/datasets.html",
    "section": "datasetloader-example"
  },
  {
    "type": "section",
    "title": "DatasetManifest",
    "description": "Lightweight provenance metadata for a processed dataset. Canonical import: from arclm.datasets import DatasetManifest. Fully qualified name: arclm.datasets.DatasetManifest. Status: Stable.",
    "page": "api/datasets.html",
    "section": "datasetmanifest"
  },
  {
    "type": "section",
    "title": "DatasetManifest parameters",
    "description": "DatasetManifest parameters",
    "page": "api/datasets.html",
    "section": "datasetmanifest-parameters"
  },
  {
    "type": "section",
    "title": "DatasetManifest example",
    "description": "DatasetManifest example",
    "page": "api/datasets.html",
    "section": "datasetmanifest-example"
  },
  {
    "type": "section",
    "title": "DatasetReport",
    "description": "A compact processed-dataset and tokenization report. Canonical import: from arclm.datasets import DatasetReport. Fully qualified name: arclm.datasets.DatasetReport. Status: Stable.",
    "page": "api/datasets.html",
    "section": "datasetreport"
  },
  {
    "type": "section",
    "title": "DatasetReport parameters",
    "description": "DatasetReport parameters",
    "page": "api/datasets.html",
    "section": "datasetreport-parameters"
  },
  {
    "type": "section",
    "title": "DatasetReport example",
    "description": "DatasetReport example",
    "page": "api/datasets.html",
    "section": "datasetreport-example"
  },
  {
    "type": "section",
    "title": "DatasetValidationIssue",
    "description": "One validation problem tied to a record index and field. Canonical import: from arclm.datasets import DatasetValidationIssue. Fully qualified name: arclm.datasets.DatasetValidationIssue. Status: Stable.",
    "page": "api/datasets.html",
    "section": "datasetvalidationissue"
  },
  {
    "type": "section",
    "title": "DatasetValidationIssue parameters",
    "description": "DatasetValidationIssue parameters",
    "page": "api/datasets.html",
    "section": "datasetvalidationissue-parameters"
  },
  {
    "type": "section",
    "title": "DatasetValidationIssue example",
    "description": "DatasetValidationIssue example",
    "page": "api/datasets.html",
    "section": "datasetvalidationissue-example"
  },
  {
    "type": "section",
    "title": "DatasetValidationResult",
    "description": "Result of validating records against a small field schema. Canonical import: from arclm.datasets import DatasetValidationResult. Fully qualified name: arclm.datasets.DatasetValidationResult. Status: Stable.",
    "page": "api/datasets.html",
    "section": "datasetvalidationresult"
  },
  {
    "type": "section",
    "title": "DatasetValidationResult parameters",
    "description": "DatasetValidationResult parameters",
    "page": "api/datasets.html",
    "section": "datasetvalidationresult-parameters"
  },
  {
    "type": "section",
    "title": "DatasetValidationResult example",
    "description": "DatasetValidationResult example",
    "page": "api/datasets.html",
    "section": "datasetvalidationresult-example"
  },
  {
    "type": "section",
    "title": "DeduplicationResult",
    "description": "Resultaat van een deduplicatie stap. Canonical import: from arclm.datasets import DeduplicationResult. Fully qualified name: arclm.datasets.DeduplicationResult. Status: Stable.",
    "page": "api/datasets.html",
    "section": "deduplicationresult"
  },
  {
    "type": "section",
    "title": "DeduplicationResult parameters",
    "description": "DeduplicationResult parameters",
    "page": "api/datasets.html",
    "section": "deduplicationresult-parameters"
  },
  {
    "type": "section",
    "title": "DeduplicationResult example",
    "description": "DeduplicationResult example",
    "page": "api/datasets.html",
    "section": "deduplicationresult-example"
  },
  {
    "type": "section",
    "title": "Deduplicator",
    "description": "Basis class voor deduplicatie over een hele dataset. Canonical import: from arclm.datasets import Deduplicator. Fully qualified name: arclm.datasets.Deduplicator. Status: Stable.",
    "page": "api/datasets.html",
    "section": "deduplicator"
  },
  {
    "type": "section",
    "title": "Deduplicator parameters",
    "description": "Deduplicator parameters",
    "page": "api/datasets.html",
    "section": "deduplicator-parameters"
  },
  {
    "type": "section",
    "title": "Deduplicator example",
    "description": "Deduplicator example",
    "page": "api/datasets.html",
    "section": "deduplicator-example"
  },
  {
    "type": "section",
    "title": "ExactDeduplicator",
    "description": "Verwijdert voorbeelden met dezelfde waarde in gekozen velden. Canonical import: from arclm.datasets import ExactDeduplicator. Fully qualified name: arclm.datasets.ExactDeduplicator. Status: Stable.",
    "page": "api/datasets.html",
    "section": "exactdeduplicator"
  },
  {
    "type": "section",
    "title": "ExactDeduplicator parameters",
    "description": "ExactDeduplicator parameters",
    "page": "api/datasets.html",
    "section": "exactdeduplicator-parameters"
  },
  {
    "type": "section",
    "title": "ExactDeduplicator example",
    "description": "ExactDeduplicator example",
    "page": "api/datasets.html",
    "section": "exactdeduplicator-example"
  },
  {
    "type": "section",
    "title": "InstructionDataset",
    "description": "Dataset voor instruction tuning met loss alleen op response tokens. Canonical import: from arclm.datasets import InstructionDataset. Fully qualified name: arclm.datasets.InstructionDataset. Status: Stable.",
    "page": "api/datasets.html",
    "section": "instructiondataset"
  },
  {
    "type": "section",
    "title": "InstructionDataset parameters",
    "description": "InstructionDataset parameters",
    "page": "api/datasets.html",
    "section": "instructiondataset-parameters"
  },
  {
    "type": "section",
    "title": "InstructionDataset example",
    "description": "InstructionDataset example",
    "page": "api/datasets.html",
    "section": "instructiondataset-example"
  },
  {
    "type": "section",
    "title": "ProcessedDataset",
    "description": "Kleine in-memory dataset voor formatting, cleaning en splits. Canonical import: from arclm.datasets import ProcessedDataset. Fully qualified name: arclm.datasets.ProcessedDataset. Status: Stable.",
    "page": "api/datasets.html",
    "section": "processeddataset"
  },
  {
    "type": "section",
    "title": "ProcessedDataset parameters",
    "description": "ProcessedDataset parameters",
    "page": "api/datasets.html",
    "section": "processeddataset-parameters"
  },
  {
    "type": "section",
    "title": "ProcessedDataset example",
    "description": "ProcessedDataset example",
    "page": "api/datasets.html",
    "section": "processeddataset-example"
  },
  {
    "type": "section",
    "title": "RemoveDuplicates",
    "description": "Verwijdert voorbeelden met dezelfde waarde in gekozen velden. Canonical import: from arclm.datasets import RemoveDuplicates. Fully qualified name: arclm.datasets.RemoveDuplicates. Status: Stable.",
    "page": "api/datasets.html",
    "section": "removeduplicates"
  },
  {
    "type": "section",
    "title": "RemoveDuplicates parameters",
    "description": "RemoveDuplicates parameters",
    "page": "api/datasets.html",
    "section": "removeduplicates-parameters"
  },
  {
    "type": "section",
    "title": "RemoveDuplicates example",
    "description": "RemoveDuplicates example",
    "page": "api/datasets.html",
    "section": "removeduplicates-example"
  },
  {
    "type": "section",
    "title": "StreamingDataset",
    "description": "Dataset die voorbeelden pas leest tijdens het itereren. Canonical import: from arclm.datasets import StreamingDataset. Fully qualified name: arclm.datasets.StreamingDataset. Status: Stable.",
    "page": "api/datasets.html",
    "section": "streamingdataset"
  },
  {
    "type": "section",
    "title": "StreamingDataset parameters",
    "description": "StreamingDataset parameters",
    "page": "api/datasets.html",
    "section": "streamingdataset-parameters"
  },
  {
    "type": "section",
    "title": "StreamingDataset example",
    "description": "StreamingDataset example",
    "page": "api/datasets.html",
    "section": "streamingdataset-example"
  },
  {
    "type": "section",
    "title": "TextDataset",
    "description": "Dataset voor taalmodeltraining met een schuivend venster. Canonical import: from arclm.datasets import TextDataset. Fully qualified name: arclm.datasets.TextDataset. Status: Stable.",
    "page": "api/datasets.html",
    "section": "textdataset"
  },
  {
    "type": "section",
    "title": "TextDataset parameters",
    "description": "TextDataset parameters",
    "page": "api/datasets.html",
    "section": "textdataset-parameters"
  },
  {
    "type": "section",
    "title": "TextDataset example",
    "description": "TextDataset example",
    "page": "api/datasets.html",
    "section": "textdataset-example"
  },
  {
    "type": "section",
    "title": "build_dataset_report",
    "description": "Build a processed dataset report with optional token statistics. Canonical import: from arclm.datasets import build_dataset_report. Fully qualified name: arclm.datasets.build_dataset_report. Status: Stable.",
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
    "type": "section",
    "title": "create_dataloader",
    "description": "Maakt een PyTorch DataLoader van token ids. Canonical import: from arclm.datasets import create_dataloader. Fully qualified name: arclm.datasets.create_dataloader. Status: Stable.",
    "page": "api/datasets.html",
    "section": "create-dataloader"
  },
  {
    "type": "section",
    "title": "create_dataloader parameters",
    "description": "create_dataloader parameters",
    "page": "api/datasets.html",
    "section": "create-dataloader-parameters"
  },
  {
    "type": "section",
    "title": "create_dataloader example",
    "description": "create_dataloader example",
    "page": "api/datasets.html",
    "section": "create-dataloader-example"
  },
  {
    "type": "section",
    "title": "create_dataset_manifest",
    "description": "Create lightweight dataset provenance without storing record values. Canonical import: from arclm.datasets import create_dataset_manifest. Fully qualified name: arclm.datasets.create_dataset_manifest. Status: Stable.",
    "page": "api/datasets.html",
    "section": "create-dataset-manifest"
  },
  {
    "type": "section",
    "title": "create_dataset_manifest parameters",
    "description": "create_dataset_manifest parameters",
    "page": "api/datasets.html",
    "section": "create-dataset-manifest-parameters"
  },
  {
    "type": "section",
    "title": "create_dataset_manifest example",
    "description": "create_dataset_manifest example",
    "page": "api/datasets.html",
    "section": "create-dataset-manifest-example"
  },
  {
    "type": "section",
    "title": "create_instruction_dataloader",
    "description": "Maakt een DataLoader voor instruction tuning. Canonical import: from arclm.datasets import create_instruction_dataloader. Fully qualified name: arclm.datasets.create_instruction_dataloader. Status: Stable.",
    "page": "api/datasets.html",
    "section": "create-instruction-dataloader"
  },
  {
    "type": "section",
    "title": "create_instruction_dataloader parameters",
    "description": "create_instruction_dataloader parameters",
    "page": "api/datasets.html",
    "section": "create-instruction-dataloader-parameters"
  },
  {
    "type": "section",
    "title": "create_instruction_dataloader example",
    "description": "create_instruction_dataloader example",
    "page": "api/datasets.html",
    "section": "create-instruction-dataloader-example"
  },
  {
    "type": "section",
    "title": "deduplicate",
    "description": "Verwijdert exacte duplicaten met `ExactDeduplicator`. Canonical import: from arclm.datasets import deduplicate. Fully qualified name: arclm.datasets.deduplicate. Status: Stable.",
    "page": "api/datasets.html",
    "section": "deduplicate"
  },
  {
    "type": "section",
    "title": "deduplicate parameters",
    "description": "deduplicate parameters",
    "page": "api/datasets.html",
    "section": "deduplicate-parameters"
  },
  {
    "type": "section",
    "title": "deduplicate example",
    "description": "deduplicate example",
    "page": "api/datasets.html",
    "section": "deduplicate-example"
  },
  {
    "type": "section",
    "title": "load_dataset",
    "description": "Laadt een dataset met de standaard DatasetLoader. Canonical import: from arclm.datasets import load_dataset. Fully qualified name: arclm.datasets.load_dataset. Status: Stable.",
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
    "title": "load_tokenizer_from_checkpoint",
    "description": "Haalt een tokenizer uit checkpoint metadata als dat mogelijk is. Canonical import: from arclm.datasets import load_tokenizer_from_checkpoint. Fully qualified name: arclm.datasets.load_tokenizer_from_checkpoint. Status: Stable.",
    "page": "api/datasets.html",
    "section": "load-tokenizer-from-checkpoint"
  },
  {
    "type": "section",
    "title": "load_tokenizer_from_checkpoint parameters",
    "description": "load_tokenizer_from_checkpoint parameters",
    "page": "api/datasets.html",
    "section": "load-tokenizer-from-checkpoint-parameters"
  },
  {
    "type": "section",
    "title": "load_tokenizer_from_checkpoint example",
    "description": "load_tokenizer_from_checkpoint example",
    "page": "api/datasets.html",
    "section": "load-tokenizer-from-checkpoint-example"
  },
  {
    "type": "section",
    "title": "load_tokens",
    "description": "Laadt tokens uit de ingestelde dataset en optioneel uit domeindata. Canonical import: from arclm.datasets import load_tokens. Fully qualified name: arclm.datasets.load_tokens. Status: Stable.",
    "page": "api/datasets.html",
    "section": "load-tokens"
  },
  {
    "type": "section",
    "title": "load_tokens parameters",
    "description": "load_tokens parameters",
    "page": "api/datasets.html",
    "section": "load-tokens-parameters"
  },
  {
    "type": "section",
    "title": "load_tokens example",
    "description": "load_tokens example",
    "page": "api/datasets.html",
    "section": "load-tokens-example"
  },
  {
    "type": "section",
    "title": "prepare_data",
    "description": "Maakt tokens, splits, tokenizer en DataLoaders klaar voor training. Canonical import: from arclm.datasets import prepare_data. Fully qualified name: arclm.datasets.prepare_data. Status: Stable.",
    "page": "api/datasets.html",
    "section": "prepare-data"
  },
  {
    "type": "section",
    "title": "prepare_data parameters",
    "description": "prepare_data parameters",
    "page": "api/datasets.html",
    "section": "prepare-data-parameters"
  },
  {
    "type": "section",
    "title": "prepare_data example",
    "description": "prepare_data example",
    "page": "api/datasets.html",
    "section": "prepare-data-example"
  },
  {
    "type": "section",
    "title": "read_tokens",
    "description": "Leest lowercase whitespace tokens uit een tekstbestand en bewaart newlines. Canonical import: from arclm.datasets import read_tokens. Fully qualified name: arclm.datasets.read_tokens. Status: Stable.",
    "page": "api/datasets.html",
    "section": "read-tokens"
  },
  {
    "type": "section",
    "title": "read_tokens parameters",
    "description": "read_tokens parameters",
    "page": "api/datasets.html",
    "section": "read-tokens-parameters"
  },
  {
    "type": "section",
    "title": "read_tokens example",
    "description": "read_tokens example",
    "page": "api/datasets.html",
    "section": "read-tokens-example"
  },
  {
    "type": "section",
    "title": "split_train_val",
    "description": "Splitst tokens in train en validatie data. Canonical import: from arclm.datasets import split_train_val. Fully qualified name: arclm.datasets.split_train_val. Status: Stable.",
    "page": "api/datasets.html",
    "section": "split-train-val"
  },
  {
    "type": "section",
    "title": "split_train_val parameters",
    "description": "split_train_val parameters",
    "page": "api/datasets.html",
    "section": "split-train-val-parameters"
  },
  {
    "type": "section",
    "title": "split_train_val example",
    "description": "split_train_val example",
    "page": "api/datasets.html",
    "section": "split-train-val-example"
  },
  {
    "type": "section",
    "title": "validate_records",
    "description": "Validate mapping records with a small schema. Canonical import: from arclm.datasets import validate_records. Fully qualified name: arclm.datasets.validate_records. Status: Stable.",
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
    "title": "SentencePieceTokenizer",
    "description": "SentencePiece tokenizer voor subword taalmodeltraining. Canonical import: from arclm.tokenizers import SentencePieceTokenizer. Fully qualified name: arclm.tokenizers.SentencePieceTokenizer. Status: Stable.",
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
    "type": "section",
    "title": "Tokenizer",
    "description": "Zet tekst om naar woord-tokens en token ids. Canonical import: from arclm.tokenizers import Tokenizer. Fully qualified name: arclm.tokenizers.Tokenizer. Status: Stable.",
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
    "title": "TokenizerFactory",
    "description": "Kiest en maakt tokenizer classes op basis van een korte naam. Canonical import: from arclm.tokenizers import TokenizerFactory. Fully qualified name: arclm.tokenizers.TokenizerFactory. Status: Stable.",
    "page": "api/tokenizers.html",
    "section": "tokenizerfactory"
  },
  {
    "type": "section",
    "title": "TokenizerFactory parameters",
    "description": "TokenizerFactory parameters",
    "page": "api/tokenizers.html",
    "section": "tokenizerfactory-parameters"
  },
  {
    "type": "section",
    "title": "TokenizerFactory example",
    "description": "TokenizerFactory example",
    "page": "api/tokenizers.html",
    "section": "tokenizerfactory-example"
  },
  {
    "type": "section",
    "title": "create_tokenizer",
    "description": "Maakt een tokenizer met een korte type-naam. Canonical import: from arclm.tokenizers import create_tokenizer. Fully qualified name: arclm.tokenizers.create_tokenizer. Status: Stable.",
    "page": "api/tokenizers.html",
    "section": "create-tokenizer"
  },
  {
    "type": "section",
    "title": "create_tokenizer parameters",
    "description": "create_tokenizer parameters",
    "page": "api/tokenizers.html",
    "section": "create-tokenizer-parameters"
  },
  {
    "type": "section",
    "title": "create_tokenizer example",
    "description": "create_tokenizer example",
    "page": "api/tokenizers.html",
    "section": "create-tokenizer-example"
  },
  {
    "type": "section",
    "title": "get_tokenizer_from_config",
    "description": "Maakt een tokenizer vanuit een config object. Canonical import: from arclm.tokenizers import get_tokenizer_from_config. Fully qualified name: arclm.tokenizers.get_tokenizer_from_config. Status: Stable.",
    "page": "api/tokenizers.html",
    "section": "get-tokenizer-from-config"
  },
  {
    "type": "section",
    "title": "get_tokenizer_from_config parameters",
    "description": "get_tokenizer_from_config parameters",
    "page": "api/tokenizers.html",
    "section": "get-tokenizer-from-config-parameters"
  },
  {
    "type": "section",
    "title": "get_tokenizer_from_config example",
    "description": "get_tokenizer_from_config example",
    "page": "api/tokenizers.html",
    "section": "get-tokenizer-from-config-example"
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
    "description": "Compact causal language model for next-token prediction. Canonical import: from arclm.models import ArcLM. Fully qualified name: arclm.models.ArcLM. Status: Stable.",
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
    "title": "AutoModel",
    "description": "Factory for ArcLM model classes supported by the current package. Canonical import: from arclm.models import AutoModel. Fully qualified name: arclm.models.AutoModel. Status: Stable.",
    "page": "api/models.html",
    "section": "automodel"
  },
  {
    "type": "section",
    "title": "AutoModel parameters",
    "description": "AutoModel parameters",
    "page": "api/models.html",
    "section": "automodel-parameters"
  },
  {
    "type": "section",
    "title": "AutoModel example",
    "description": "AutoModel example",
    "page": "api/models.html",
    "section": "automodel-example"
  },
  {
    "type": "section",
    "title": "GPTBlock",
    "description": "Transformer blok met self-attention en feed-forward lagen. Canonical import: from arclm.models import GPTBlock. Fully qualified name: arclm.models.GPTBlock. Status: Stable.",
    "page": "api/models.html",
    "section": "gptblock"
  },
  {
    "type": "section",
    "title": "GPTBlock parameters",
    "description": "GPTBlock parameters",
    "page": "api/models.html",
    "section": "gptblock-parameters"
  },
  {
    "type": "section",
    "title": "GPTBlock example",
    "description": "GPTBlock example",
    "page": "api/models.html",
    "section": "gptblock-example"
  },
  {
    "type": "section",
    "title": "MiniGPT",
    "description": "Compact causal language model for next-token prediction. Canonical import: from arclm.models import MiniGPT. Fully qualified name: arclm.models.MiniGPT. Status: Deprecated.",
    "page": "api/models.html",
    "section": "minigpt"
  },
  {
    "type": "section",
    "title": "MiniGPT parameters",
    "description": "MiniGPT parameters",
    "page": "api/models.html",
    "section": "minigpt-parameters"
  },
  {
    "type": "section",
    "title": "MiniGPT example",
    "description": "MiniGPT example",
    "page": "api/models.html",
    "section": "minigpt-example"
  },
  {
    "type": "section",
    "title": "ModelCapabilityReport",
    "description": "Describes supported operations for one exact model path. Canonical import: from arclm.models import ModelCapabilityReport. Fully qualified name: arclm.models.ModelCapabilityReport. Status: Stable.",
    "page": "api/models.html",
    "section": "modelcapabilityreport"
  },
  {
    "type": "section",
    "title": "ModelCapabilityReport parameters",
    "description": "ModelCapabilityReport parameters",
    "page": "api/models.html",
    "section": "modelcapabilityreport-parameters"
  },
  {
    "type": "section",
    "title": "ModelCapabilityReport example",
    "description": "ModelCapabilityReport example",
    "page": "api/models.html",
    "section": "modelcapabilityreport-example"
  },
  {
    "type": "section",
    "title": "SelfAttention",
    "description": "Self-attention laag die tokens naar eerdere tokens laat kijken. Canonical import: from arclm.models import SelfAttention. Fully qualified name: arclm.models.SelfAttention. Status: Stable.",
    "page": "api/models.html",
    "section": "selfattention"
  },
  {
    "type": "section",
    "title": "SelfAttention parameters",
    "description": "SelfAttention parameters",
    "page": "api/models.html",
    "section": "selfattention-parameters"
  },
  {
    "type": "section",
    "title": "SelfAttention example",
    "description": "SelfAttention example",
    "page": "api/models.html",
    "section": "selfattention-example"
  },
  {
    "type": "section",
    "title": "get_model_capability",
    "description": "Return the capability report for a known exact model path. Canonical import: from arclm.models import get_model_capability. Fully qualified name: arclm.models.get_model_capability. Status: Stable.",
    "page": "api/models.html",
    "section": "get-model-capability"
  },
  {
    "type": "section",
    "title": "get_model_capability parameters",
    "description": "get_model_capability parameters",
    "page": "api/models.html",
    "section": "get-model-capability-parameters"
  },
  {
    "type": "section",
    "title": "get_model_capability example",
    "description": "get_model_capability example",
    "page": "api/models.html",
    "section": "get-model-capability-example"
  },
  {
    "type": "section",
    "title": "model_support_matrix",
    "description": "Return the compact support matrix for the official 0.8 model set. Canonical import: from arclm.models import model_support_matrix. Fully qualified name: arclm.models.model_support_matrix. Status: Stable.",
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
    "title": "BaseCallback",
    "description": "Basis class voor eigen training callbacks. Canonical import: from arclm.training import BaseCallback. Fully qualified name: arclm.training.BaseCallback. Status: Stable.",
    "page": "api/training.html",
    "section": "basecallback"
  },
  {
    "type": "section",
    "title": "BaseCallback parameters",
    "description": "BaseCallback parameters",
    "page": "api/training.html",
    "section": "basecallback-parameters"
  },
  {
    "type": "section",
    "title": "BaseCallback example",
    "description": "BaseCallback example",
    "page": "api/training.html",
    "section": "basecallback-example"
  },
  {
    "type": "section",
    "title": "BaseModelAdapter",
    "description": "Basis class voor adapters tussen twee model implementaties. Canonical import: from arclm.training import BaseModelAdapter. Fully qualified name: arclm.training.BaseModelAdapter. Status: Stable.",
    "page": "api/training.html",
    "section": "basemodeladapter"
  },
  {
    "type": "section",
    "title": "BaseModelAdapter parameters",
    "description": "BaseModelAdapter parameters",
    "page": "api/training.html",
    "section": "basemodeladapter-parameters"
  },
  {
    "type": "section",
    "title": "BaseModelAdapter example",
    "description": "BaseModelAdapter example",
    "page": "api/training.html",
    "section": "basemodeladapter-example"
  },
  {
    "type": "section",
    "title": "BaseModelLoader",
    "description": "Basis class voor model loaders die een model en metadata geven. Canonical import: from arclm.training import BaseModelLoader. Fully qualified name: arclm.training.BaseModelLoader. Status: Stable.",
    "page": "api/training.html",
    "section": "basemodelloader"
  },
  {
    "type": "section",
    "title": "BaseModelLoader parameters",
    "description": "BaseModelLoader parameters",
    "page": "api/training.html",
    "section": "basemodelloader-parameters"
  },
  {
    "type": "section",
    "title": "BaseModelLoader example",
    "description": "BaseModelLoader example",
    "page": "api/training.html",
    "section": "basemodelloader-example"
  },
  {
    "type": "section",
    "title": "BaseTrainer",
    "description": "Basis class voor developers die een eigen trainer willen maken. Canonical import: from arclm.training import BaseTrainer. Fully qualified name: arclm.training.BaseTrainer. Status: Stable.",
    "page": "api/training.html",
    "section": "basetrainer"
  },
  {
    "type": "section",
    "title": "BaseTrainer parameters",
    "description": "BaseTrainer parameters",
    "page": "api/training.html",
    "section": "basetrainer-parameters"
  },
  {
    "type": "section",
    "title": "BaseTrainer example",
    "description": "BaseTrainer example",
    "page": "api/training.html",
    "section": "basetrainer-example"
  },
  {
    "type": "section",
    "title": "BaseTrainingPipeline",
    "description": "Basis class voor aanpasbare training pipelines. Canonical import: from arclm.training import BaseTrainingPipeline. Fully qualified name: arclm.training.BaseTrainingPipeline. Status: Stable.",
    "page": "api/training.html",
    "section": "basetrainingpipeline"
  },
  {
    "type": "section",
    "title": "BaseTrainingPipeline parameters",
    "description": "BaseTrainingPipeline parameters",
    "page": "api/training.html",
    "section": "basetrainingpipeline-parameters"
  },
  {
    "type": "section",
    "title": "BaseTrainingPipeline example",
    "description": "BaseTrainingPipeline example",
    "page": "api/training.html",
    "section": "basetrainingpipeline-example"
  },
  {
    "type": "section",
    "title": "EarlyStopping",
    "description": "Early stopping to prevent overfitting Canonical import: from arclm.training import EarlyStopping. Fully qualified name: arclm.training.EarlyStopping. Status: Stable.",
    "page": "api/training.html",
    "section": "earlystopping"
  },
  {
    "type": "section",
    "title": "EarlyStopping parameters",
    "description": "EarlyStopping parameters",
    "page": "api/training.html",
    "section": "earlystopping-parameters"
  },
  {
    "type": "section",
    "title": "EarlyStopping example",
    "description": "EarlyStopping example",
    "page": "api/training.html",
    "section": "earlystopping-example"
  },
  {
    "type": "section",
    "title": "GeneralizationMonitor",
    "description": "Monitor model generalization during training Traceert training vs validation loss om overfitting te detecteren Canonical import: from arclm.training import GeneralizationMonitor. Fully qualified name: arclm.training.GeneralizationMonitor. Status: Stable.",
    "page": "api/training.html",
    "section": "generalizationmonitor"
  },
  {
    "type": "section",
    "title": "GeneralizationMonitor parameters",
    "description": "GeneralizationMonitor parameters",
    "page": "api/training.html",
    "section": "generalizationmonitor-parameters"
  },
  {
    "type": "section",
    "title": "GeneralizationMonitor example",
    "description": "GeneralizationMonitor example",
    "page": "api/training.html",
    "section": "generalizationmonitor-example"
  },
  {
    "type": "section",
    "title": "L1Regularization",
    "description": "L1 Regularization - Sparsity inducing Canonical import: from arclm.training import L1Regularization. Fully qualified name: arclm.training.L1Regularization. Status: Stable.",
    "page": "api/training.html",
    "section": "l1regularization"
  },
  {
    "type": "section",
    "title": "L1Regularization parameters",
    "description": "L1Regularization parameters",
    "page": "api/training.html",
    "section": "l1regularization-parameters"
  },
  {
    "type": "section",
    "title": "L1Regularization example",
    "description": "L1Regularization example",
    "page": "api/training.html",
    "section": "l1regularization-example"
  },
  {
    "type": "section",
    "title": "L2Regularization",
    "description": "L2 Regularization (Weight Decay) - Smoothness inducing Canonical import: from arclm.training import L2Regularization. Fully qualified name: arclm.training.L2Regularization. Status: Stable.",
    "page": "api/training.html",
    "section": "l2regularization"
  },
  {
    "type": "section",
    "title": "L2Regularization parameters",
    "description": "L2Regularization parameters",
    "page": "api/training.html",
    "section": "l2regularization-parameters"
  },
  {
    "type": "section",
    "title": "L2Regularization example",
    "description": "L2Regularization example",
    "page": "api/training.html",
    "section": "l2regularization-example"
  },
  {
    "type": "section",
    "title": "LabelSmoothing",
    "description": "Label smoothing regularization Voorkomt overconfident voorspellingen door targets glad te maken Canonical import: from arclm.training import LabelSmoothing. Fully qualified name: arclm.training.LabelSmoothing. Status: Stable.",
    "page": "api/training.html",
    "section": "labelsmoothing"
  },
  {
    "type": "section",
    "title": "LabelSmoothing parameters",
    "description": "LabelSmoothing parameters",
    "page": "api/training.html",
    "section": "labelsmoothing-parameters"
  },
  {
    "type": "section",
    "title": "LabelSmoothing example",
    "description": "LabelSmoothing example",
    "page": "api/training.html",
    "section": "labelsmoothing-example"
  },
  {
    "type": "section",
    "title": "LearningRateScheduler",
    "description": "Learning rate scheduler for better generalization Reduce learning rate during training for better convergence Canonical import: from arclm.training import LearningRateScheduler. Fully qualified name: arclm.training.LearningRateScheduler. Status: Stable.",
    "page": "api/training.html",
    "section": "learningratescheduler"
  },
  {
    "type": "section",
    "title": "LearningRateScheduler parameters",
    "description": "LearningRateScheduler parameters",
    "page": "api/training.html",
    "section": "learningratescheduler-parameters"
  },
  {
    "type": "section",
    "title": "LearningRateScheduler example",
    "description": "LearningRateScheduler example",
    "page": "api/training.html",
    "section": "learningratescheduler-example"
  },
  {
    "type": "section",
    "title": "MixupAugmentation",
    "description": "Mixup data augmentation for better generalization Combineert twee samples lineair om data augmentation te krijgen Canonical import: from arclm.training import MixupAugmentation. Fully qualified name: arclm.training.MixupAugmentation. Status: Stable.",
    "page": "api/training.html",
    "section": "mixupaugmentation"
  },
  {
    "type": "section",
    "title": "MixupAugmentation parameters",
    "description": "MixupAugmentation parameters",
    "page": "api/training.html",
    "section": "mixupaugmentation-parameters"
  },
  {
    "type": "section",
    "title": "MixupAugmentation example",
    "description": "MixupAugmentation example",
    "page": "api/training.html",
    "section": "mixupaugmentation-example"
  },
  {
    "type": "section",
    "title": "ModelAdapter",
    "description": "Adapt weights from external models to ArcLM architecture. Canonical import: from arclm.training import ModelAdapter. Fully qualified name: arclm.training.ModelAdapter. Status: Stable.",
    "page": "api/training.html",
    "section": "modeladapter"
  },
  {
    "type": "section",
    "title": "ModelAdapter parameters",
    "description": "ModelAdapter parameters",
    "page": "api/training.html",
    "section": "modeladapter-parameters"
  },
  {
    "type": "section",
    "title": "ModelAdapter example",
    "description": "ModelAdapter example",
    "page": "api/training.html",
    "section": "modeladapter-example"
  },
  {
    "type": "section",
    "title": "PreTrainedModelLoader",
    "description": "Load pre-trained models from multiple sources: - HuggingFace transformers - Local checkpoint files - Custom model paths Handles weight alignment and architecture mismatch gracefully. Canonical import: from arclm.training import PreTrainedModelLoader. Fully qualified name: arclm.training.PreTrainedModelLoader. Status: Stable.",
    "page": "api/training.html",
    "section": "pretrainedmodelloader"
  },
  {
    "type": "section",
    "title": "PreTrainedModelLoader parameters",
    "description": "PreTrainedModelLoader parameters",
    "page": "api/training.html",
    "section": "pretrainedmodelloader-parameters"
  },
  {
    "type": "section",
    "title": "PreTrainedModelLoader example",
    "description": "PreTrainedModelLoader example",
    "page": "api/training.html",
    "section": "pretrainedmodelloader-example"
  },
  {
    "type": "section",
    "title": "StoppingCriteria",
    "description": "Base stopping criteria for training loop control. Canonical import: from arclm.training import StoppingCriteria. Fully qualified name: arclm.training.StoppingCriteria. Status: Stable.",
    "page": "api/training.html",
    "section": "stoppingcriteria"
  },
  {
    "type": "section",
    "title": "StoppingCriteria parameters",
    "description": "StoppingCriteria parameters",
    "page": "api/training.html",
    "section": "stoppingcriteria-parameters"
  },
  {
    "type": "section",
    "title": "StoppingCriteria example",
    "description": "StoppingCriteria example",
    "page": "api/training.html",
    "section": "stoppingcriteria-example"
  },
  {
    "type": "section",
    "title": "Trainer",
    "description": "Traint een model op \u00e9\u00e9n apparaat. Canonical import: from arclm.training import Trainer. Fully qualified name: arclm.training.Trainer. Status: Stable.",
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
    "title": "TrainingConfig",
    "description": "Bewaart de belangrijkste instellingen voor een training. Canonical import: from arclm.training import TrainingConfig. Fully qualified name: arclm.training.TrainingConfig. Status: Stable.",
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
    "title": "TrainingResult",
    "description": "Resultaat dat `train_model` teruggeeft na een trainingsrun. Canonical import: from arclm.training import TrainingResult. Fully qualified name: arclm.training.TrainingResult. Status: Stable.",
    "page": "api/training.html",
    "section": "trainingresult"
  },
  {
    "type": "section",
    "title": "TrainingResult parameters",
    "description": "TrainingResult parameters",
    "page": "api/training.html",
    "section": "trainingresult-parameters"
  },
  {
    "type": "section",
    "title": "TrainingResult example",
    "description": "TrainingResult example",
    "page": "api/training.html",
    "section": "trainingresult-example"
  },
  {
    "type": "section",
    "title": "TrainingState",
    "description": "Houdt bij waar de training is. Canonical import: from arclm.training import TrainingState. Fully qualified name: arclm.training.TrainingState. Status: Stable.",
    "page": "api/training.html",
    "section": "trainingstate"
  },
  {
    "type": "section",
    "title": "TrainingState parameters",
    "description": "TrainingState parameters",
    "page": "api/training.html",
    "section": "trainingstate-parameters"
  },
  {
    "type": "section",
    "title": "TrainingState example",
    "description": "TrainingState example",
    "page": "api/training.html",
    "section": "trainingstate-example"
  },
  {
    "type": "section",
    "title": "UnifiedPipeline",
    "description": "Unified training pipeline supporting multiple modes: - PRE_TRAINING: Train from scratch on large corpus - FINE_TUNING: Fine-tune pre-trained model on task data - INSTRUCTION_TUNING: Fine-tune on instruction-response pair Canonical import: from arclm.training import UnifiedPipeline. Fully qualified name: arclm.training.UnifiedPipeline. Status: Stable.",
    "page": "api/training.html",
    "section": "unifiedpipeline"
  },
  {
    "type": "section",
    "title": "UnifiedPipeline parameters",
    "description": "UnifiedPipeline parameters",
    "page": "api/training.html",
    "section": "unifiedpipeline-parameters"
  },
  {
    "type": "section",
    "title": "UnifiedPipeline example",
    "description": "UnifiedPipeline example",
    "page": "api/training.html",
    "section": "unifiedpipeline-example"
  },
  {
    "type": "section",
    "title": "build_model",
    "description": "Maakt een ArcLM model vanuit config en zet het op het gekozen device. Canonical import: from arclm.training import build_model. Fully qualified name: arclm.training.build_model. Status: Stable.",
    "page": "api/training.html",
    "section": "build-model"
  },
  {
    "type": "section",
    "title": "build_model parameters",
    "description": "build_model parameters",
    "page": "api/training.html",
    "section": "build-model-parameters"
  },
  {
    "type": "section",
    "title": "build_model example",
    "description": "build_model example",
    "page": "api/training.html",
    "section": "build-model-example"
  },
  {
    "type": "section",
    "title": "build_optimizer_with_discriminative_lr",
    "description": "Maakt een optimizer met aparte learning rates per laag-groep. Canonical import: from arclm.training import build_optimizer_with_discriminative_lr. Fully qualified name: arclm.training.build_optimizer_with_discriminative_lr. Status: Stable.",
    "page": "api/training.html",
    "section": "build-optimizer-with-discriminative-lr"
  },
  {
    "type": "section",
    "title": "build_optimizer_with_discriminative_lr parameters",
    "description": "build_optimizer_with_discriminative_lr parameters",
    "page": "api/training.html",
    "section": "build-optimizer-with-discriminative-lr-parameters"
  },
  {
    "type": "section",
    "title": "build_optimizer_with_discriminative_lr example",
    "description": "build_optimizer_with_discriminative_lr example",
    "page": "api/training.html",
    "section": "build-optimizer-with-discriminative-lr-example"
  },
  {
    "type": "section",
    "title": "build_trainer",
    "description": "Maakt de optimizer, loss function en Trainer voor een model. Canonical import: from arclm.training import build_trainer. Fully qualified name: arclm.training.build_trainer. Status: Stable.",
    "page": "api/training.html",
    "section": "build-trainer"
  },
  {
    "type": "section",
    "title": "build_trainer parameters",
    "description": "build_trainer parameters",
    "page": "api/training.html",
    "section": "build-trainer-parameters"
  },
  {
    "type": "section",
    "title": "build_trainer example",
    "description": "build_trainer example",
    "page": "api/training.html",
    "section": "build-trainer-example"
  },
  {
    "type": "section",
    "title": "checkpoint_is_compatible_for_continue_training",
    "description": "Controleert of een checkpoint past bij continued training. Canonical import: from arclm.training import checkpoint_is_compatible_for_continue_training. Fully qualified name: arclm.training.checkpoint_is_compatible_for_continue_training. Status: Stable.",
    "page": "api/training.html",
    "section": "checkpoint-is-compatible-for-continue-training"
  },
  {
    "type": "section",
    "title": "checkpoint_is_compatible_for_continue_training parameters",
    "description": "checkpoint_is_compatible_for_continue_training parameters",
    "page": "api/training.html",
    "section": "checkpoint-is-compatible-for-continue-training-parameters"
  },
  {
    "type": "section",
    "title": "checkpoint_is_compatible_for_continue_training example",
    "description": "checkpoint_is_compatible_for_continue_training example",
    "page": "api/training.html",
    "section": "checkpoint-is-compatible-for-continue-training-example"
  },
  {
    "type": "section",
    "title": "checkpoint_is_compatible_for_tuining",
    "description": "Controleert of een checkpoint past bij finetuning. Canonical import: from arclm.training import checkpoint_is_compatible_for_tuining. Fully qualified name: arclm.training.checkpoint_is_compatible_for_tuining. Status: Deprecated.",
    "page": "api/training.html",
    "section": "checkpoint-is-compatible-for-tuining"
  },
  {
    "type": "section",
    "title": "checkpoint_is_compatible_for_tuining parameters",
    "description": "checkpoint_is_compatible_for_tuining parameters",
    "page": "api/training.html",
    "section": "checkpoint-is-compatible-for-tuining-parameters"
  },
  {
    "type": "section",
    "title": "checkpoint_is_compatible_for_tuining example",
    "description": "checkpoint_is_compatible_for_tuining example",
    "page": "api/training.html",
    "section": "checkpoint-is-compatible-for-tuining-example"
  },
  {
    "type": "section",
    "title": "create_checkpoint_callback",
    "description": "Maakt een callback die het laatste hervatbare checkpoint opslaat. Canonical import: from arclm.training import create_checkpoint_callback. Fully qualified name: arclm.training.create_checkpoint_callback. Status: Stable.",
    "page": "api/training.html",
    "section": "create-checkpoint-callback"
  },
  {
    "type": "section",
    "title": "create_checkpoint_callback parameters",
    "description": "create_checkpoint_callback parameters",
    "page": "api/training.html",
    "section": "create-checkpoint-callback-parameters"
  },
  {
    "type": "section",
    "title": "create_checkpoint_callback example",
    "description": "create_checkpoint_callback example",
    "page": "api/training.html",
    "section": "create-checkpoint-callback-example"
  },
  {
    "type": "section",
    "title": "create_epoch_checkpoint_callback",
    "description": "Oude alias voor `create_checkpoint_callback`. Canonical import: from arclm.training import create_epoch_checkpoint_callback. Fully qualified name: arclm.training.create_epoch_checkpoint_callback. Status: Stable.",
    "page": "api/training.html",
    "section": "create-epoch-checkpoint-callback"
  },
  {
    "type": "section",
    "title": "create_epoch_checkpoint_callback parameters",
    "description": "create_epoch_checkpoint_callback parameters",
    "page": "api/training.html",
    "section": "create-epoch-checkpoint-callback-parameters"
  },
  {
    "type": "section",
    "title": "create_epoch_checkpoint_callback example",
    "description": "create_epoch_checkpoint_callback example",
    "page": "api/training.html",
    "section": "create-epoch-checkpoint-callback-example"
  },
  {
    "type": "section",
    "title": "load_compatible_checkpoint",
    "description": "Laadt een bestaand checkpoint als het past bij deze training. Canonical import: from arclm.training import load_compatible_checkpoint. Fully qualified name: arclm.training.load_compatible_checkpoint. Status: Stable.",
    "page": "api/training.html",
    "section": "load-compatible-checkpoint"
  },
  {
    "type": "section",
    "title": "load_compatible_checkpoint parameters",
    "description": "load_compatible_checkpoint parameters",
    "page": "api/training.html",
    "section": "load-compatible-checkpoint-parameters"
  },
  {
    "type": "section",
    "title": "load_compatible_checkpoint example",
    "description": "load_compatible_checkpoint example",
    "page": "api/training.html",
    "section": "load-compatible-checkpoint-example"
  },
  {
    "type": "section",
    "title": "save_training_checkpoint",
    "description": "Slaat een trainer checkpoint op met tokenizer metadata. Canonical import: from arclm.training import save_training_checkpoint. Fully qualified name: arclm.training.save_training_checkpoint. Status: Stable.",
    "page": "api/training.html",
    "section": "save-training-checkpoint"
  },
  {
    "type": "section",
    "title": "save_training_checkpoint parameters",
    "description": "save_training_checkpoint parameters",
    "page": "api/training.html",
    "section": "save-training-checkpoint-parameters"
  },
  {
    "type": "section",
    "title": "save_training_checkpoint example",
    "description": "save_training_checkpoint example",
    "page": "api/training.html",
    "section": "save-training-checkpoint-example"
  },
  {
    "type": "section",
    "title": "tokenizer_from_checkpoint",
    "description": "Haalt een ArcLM tokenizer uit een checkpoint of checkpoint-pad. Canonical import: from arclm.training import tokenizer_from_checkpoint. Fully qualified name: arclm.training.tokenizer_from_checkpoint. Status: Stable.",
    "page": "api/training.html",
    "section": "tokenizer-from-checkpoint"
  },
  {
    "type": "section",
    "title": "tokenizer_from_checkpoint parameters",
    "description": "tokenizer_from_checkpoint parameters",
    "page": "api/training.html",
    "section": "tokenizer-from-checkpoint-parameters"
  },
  {
    "type": "section",
    "title": "tokenizer_from_checkpoint example",
    "description": "tokenizer_from_checkpoint example",
    "page": "api/training.html",
    "section": "tokenizer-from-checkpoint-example"
  },
  {
    "type": "section",
    "title": "train_model",
    "description": "Traint een ArcLM model in pretrain, finetune of continue_training mode. Canonical import: from arclm.training import train_model. Fully qualified name: arclm.training.train_model. Status: Stable.",
    "page": "api/training.html",
    "section": "train-model"
  },
  {
    "type": "section",
    "title": "train_model parameters",
    "description": "train_model parameters",
    "page": "api/training.html",
    "section": "train-model-parameters"
  },
  {
    "type": "section",
    "title": "train_model example",
    "description": "train_model example",
    "page": "api/training.html",
    "section": "train-model-example"
  },
  {
    "type": "page",
    "title": "Fine-Tuning API",
    "description": "Public finetuning APIs.",
    "page": "api/finetuning.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "Overview",
    "description": "Fine-Tuning API documents the public ArcLM APIs in this category.",
    "page": "api/finetuning.html",
    "section": "overview"
  },
  {
    "type": "section",
    "title": "BaseFineTuner",
    "description": "Basis class voor developers die een eigen fine-tuner willen maken. Canonical import: from arclm.finetuning import BaseFineTuner. Fully qualified name: arclm.finetuning.BaseFineTuner. Status: Beta.",
    "page": "api/finetuning.html",
    "section": "basefinetuner"
  },
  {
    "type": "section",
    "title": "BaseFineTuner parameters",
    "description": "BaseFineTuner parameters",
    "page": "api/finetuning.html",
    "section": "basefinetuner-parameters"
  },
  {
    "type": "section",
    "title": "BaseFineTuner example",
    "description": "BaseFineTuner example",
    "page": "api/finetuning.html",
    "section": "basefinetuner-example"
  },
  {
    "type": "section",
    "title": "BaseModelAdapter",
    "description": "Basis class om een extern model met ArcLM te verbinden. Canonical import: from arclm.finetuning import BaseModelAdapter. Fully qualified name: arclm.finetuning.BaseModelAdapter. Status: Beta.",
    "page": "api/finetuning.html",
    "section": "basemodeladapter"
  },
  {
    "type": "section",
    "title": "BaseModelAdapter parameters",
    "description": "BaseModelAdapter parameters",
    "page": "api/finetuning.html",
    "section": "basemodeladapter-parameters"
  },
  {
    "type": "section",
    "title": "BaseModelAdapter example",
    "description": "BaseModelAdapter example",
    "page": "api/finetuning.html",
    "section": "basemodeladapter-example"
  },
  {
    "type": "section",
    "title": "BaseTokenizerAdapter",
    "description": "Basis class om een tokenizer met ArcLM te verbinden. Canonical import: from arclm.finetuning import BaseTokenizerAdapter. Fully qualified name: arclm.finetuning.BaseTokenizerAdapter. Status: Beta.",
    "page": "api/finetuning.html",
    "section": "basetokenizeradapter"
  },
  {
    "type": "section",
    "title": "BaseTokenizerAdapter parameters",
    "description": "BaseTokenizerAdapter parameters",
    "page": "api/finetuning.html",
    "section": "basetokenizeradapter-parameters"
  },
  {
    "type": "section",
    "title": "BaseTokenizerAdapter example",
    "description": "BaseTokenizerAdapter example",
    "page": "api/finetuning.html",
    "section": "basetokenizeradapter-example"
  },
  {
    "type": "section",
    "title": "FineTuningConfig",
    "description": "Configuratie voor data, formatting en labels bij fine-tuning. Canonical import: from arclm.finetuning import FineTuningConfig. Fully qualified name: arclm.finetuning.FineTuningConfig. Status: Beta.",
    "page": "api/finetuning.html",
    "section": "finetuningconfig"
  },
  {
    "type": "section",
    "title": "FineTuningConfig parameters",
    "description": "FineTuningConfig parameters",
    "page": "api/finetuning.html",
    "section": "finetuningconfig-parameters"
  },
  {
    "type": "section",
    "title": "FineTuningConfig example",
    "description": "FineTuningConfig example",
    "page": "api/finetuning.html",
    "section": "finetuningconfig-example"
  },
  {
    "type": "section",
    "title": "FineTuningDatasetReport",
    "description": "Veilige samenvatting van datasetvoorbereiding. Canonical import: from arclm.finetuning import FineTuningDatasetReport. Fully qualified name: arclm.finetuning.FineTuningDatasetReport. Status: Beta.",
    "page": "api/finetuning.html",
    "section": "finetuningdatasetreport"
  },
  {
    "type": "section",
    "title": "FineTuningDatasetReport parameters",
    "description": "FineTuningDatasetReport parameters",
    "page": "api/finetuning.html",
    "section": "finetuningdatasetreport-parameters"
  },
  {
    "type": "section",
    "title": "FineTuningDatasetReport example",
    "description": "FineTuningDatasetReport example",
    "page": "api/finetuning.html",
    "section": "finetuningdatasetreport-example"
  },
  {
    "type": "section",
    "title": "FineTuningMode",
    "description": "Beschrijft welke fine-tuning taak uitgevoerd wordt. Canonical import: from arclm.finetuning import FineTuningMode. Fully qualified name: arclm.finetuning.FineTuningMode. Status: Beta.",
    "page": "api/finetuning.html",
    "section": "finetuningmode"
  },
  {
    "type": "section",
    "title": "FineTuningMode parameters",
    "description": "FineTuningMode parameters",
    "page": "api/finetuning.html",
    "section": "finetuningmode-parameters"
  },
  {
    "type": "section",
    "title": "FineTuningMode example",
    "description": "FineTuningMode example",
    "page": "api/finetuning.html",
    "section": "finetuningmode-example"
  },
  {
    "type": "section",
    "title": "FineTuningResult",
    "description": "Resultaat van een stabiele fine-tuning run. Canonical import: from arclm.finetuning import FineTuningResult. Fully qualified name: arclm.finetuning.FineTuningResult. Status: Beta.",
    "page": "api/finetuning.html",
    "section": "finetuningresult"
  },
  {
    "type": "section",
    "title": "FineTuningResult parameters",
    "description": "FineTuningResult parameters",
    "page": "api/finetuning.html",
    "section": "finetuningresult-parameters"
  },
  {
    "type": "section",
    "title": "FineTuningResult example",
    "description": "FineTuningResult example",
    "page": "api/finetuning.html",
    "section": "finetuningresult-example"
  },
  {
    "type": "section",
    "title": "FullFineTuner",
    "description": "Traint alle trainbare modelparameters met de Training Core. Canonical import: from arclm.finetuning import FullFineTuner. Fully qualified name: arclm.finetuning.FullFineTuner. Status: Beta.",
    "page": "api/finetuning.html",
    "section": "fullfinetuner"
  },
  {
    "type": "section",
    "title": "FullFineTuner parameters",
    "description": "FullFineTuner parameters",
    "page": "api/finetuning.html",
    "section": "fullfinetuner-parameters"
  },
  {
    "type": "section",
    "title": "FullFineTuner example",
    "description": "FullFineTuner example",
    "page": "api/finetuning.html",
    "section": "fullfinetuner-example"
  },
  {
    "type": "section",
    "title": "ModelAdapter",
    "description": "Zet een model om naar het formaat dat ArcLM verwacht. Canonical import: from arclm.finetuning import ModelAdapter. Fully qualified name: arclm.finetuning.ModelAdapter. Status: Beta.",
    "page": "api/finetuning.html",
    "section": "modeladapter"
  },
  {
    "type": "section",
    "title": "ModelAdapter parameters",
    "description": "ModelAdapter parameters",
    "page": "api/finetuning.html",
    "section": "modeladapter-parameters"
  },
  {
    "type": "section",
    "title": "ModelAdapter example",
    "description": "ModelAdapter example",
    "page": "api/finetuning.html",
    "section": "modeladapter-example"
  },
  {
    "type": "section",
    "title": "PreparedFineTuningDataset",
    "description": "Dataset met vooraf getokenizede fine-tuning voorbeelden. Canonical import: from arclm.finetuning import PreparedFineTuningDataset. Fully qualified name: arclm.finetuning.PreparedFineTuningDataset. Status: Beta.",
    "page": "api/finetuning.html",
    "section": "preparedfinetuningdataset"
  },
  {
    "type": "section",
    "title": "PreparedFineTuningDataset parameters",
    "description": "PreparedFineTuningDataset parameters",
    "page": "api/finetuning.html",
    "section": "preparedfinetuningdataset-parameters"
  },
  {
    "type": "section",
    "title": "PreparedFineTuningDataset example",
    "description": "PreparedFineTuningDataset example",
    "page": "api/finetuning.html",
    "section": "preparedfinetuningdataset-example"
  },
  {
    "type": "section",
    "title": "PreparedFineTuningRecord",
    "description": "Canonical prepared representation of one fine-tuning record. Canonical import: from arclm.finetuning import PreparedFineTuningRecord. Fully qualified name: arclm.finetuning.PreparedFineTuningRecord. Status: Beta.",
    "page": "api/finetuning.html",
    "section": "preparedfinetuningrecord"
  },
  {
    "type": "section",
    "title": "PreparedFineTuningRecord parameters",
    "description": "PreparedFineTuningRecord parameters",
    "page": "api/finetuning.html",
    "section": "preparedfinetuningrecord-parameters"
  },
  {
    "type": "section",
    "title": "PreparedFineTuningRecord example",
    "description": "PreparedFineTuningRecord example",
    "page": "api/finetuning.html",
    "section": "preparedfinetuningrecord-example"
  },
  {
    "type": "section",
    "title": "SFTConfig",
    "description": "Bewaart instellingen voor supervised fine-tuning. Canonical import: from arclm.finetuning import SFTConfig. Fully qualified name: arclm.finetuning.SFTConfig. Status: Beta.",
    "page": "api/finetuning.html",
    "section": "sftconfig"
  },
  {
    "type": "section",
    "title": "SFTConfig parameters",
    "description": "SFTConfig parameters",
    "page": "api/finetuning.html",
    "section": "sftconfig-parameters"
  },
  {
    "type": "section",
    "title": "SFTConfig example",
    "description": "SFTConfig example",
    "page": "api/finetuning.html",
    "section": "sftconfig-example"
  },
  {
    "type": "section",
    "title": "SFTDataCollator",
    "description": "Zet SFT voorbeelden om naar tensors voor de trainer. Canonical import: from arclm.finetuning import SFTDataCollator. Fully qualified name: arclm.finetuning.SFTDataCollator. Status: Beta.",
    "page": "api/finetuning.html",
    "section": "sftdatacollator"
  },
  {
    "type": "section",
    "title": "SFTDataCollator parameters",
    "description": "SFTDataCollator parameters",
    "page": "api/finetuning.html",
    "section": "sftdatacollator-parameters"
  },
  {
    "type": "section",
    "title": "SFTDataCollator example",
    "description": "SFTDataCollator example",
    "page": "api/finetuning.html",
    "section": "sftdatacollator-example"
  },
  {
    "type": "section",
    "title": "SFTRecordContract",
    "description": "Public description of accepted SFT record fields. Canonical import: from arclm.finetuning import SFTRecordContract. Fully qualified name: arclm.finetuning.SFTRecordContract. Status: Beta.",
    "page": "api/finetuning.html",
    "section": "sftrecordcontract"
  },
  {
    "type": "section",
    "title": "SFTRecordContract parameters",
    "description": "SFTRecordContract parameters",
    "page": "api/finetuning.html",
    "section": "sftrecordcontract-parameters"
  },
  {
    "type": "section",
    "title": "SFTRecordContract example",
    "description": "SFTRecordContract example",
    "page": "api/finetuning.html",
    "section": "sftrecordcontract-example"
  },
  {
    "type": "section",
    "title": "SFTTrainer",
    "description": "Traint een tekstmodel met instruction-, chat- of tekstdatasets. Canonical import: from arclm.finetuning import SFTTrainer. Fully qualified name: arclm.finetuning.SFTTrainer. Status: Beta.",
    "page": "api/finetuning.html",
    "section": "sfttrainer"
  },
  {
    "type": "section",
    "title": "SFTTrainer parameters",
    "description": "SFTTrainer parameters",
    "page": "api/finetuning.html",
    "section": "sfttrainer-parameters"
  },
  {
    "type": "section",
    "title": "SFTTrainer example",
    "description": "SFTTrainer example",
    "page": "api/finetuning.html",
    "section": "sfttrainer-example"
  },
  {
    "type": "section",
    "title": "SFTTrainingResult",
    "description": "Result returned by ``train_sft``. Canonical import: from arclm.finetuning import SFTTrainingResult. Fully qualified name: arclm.finetuning.SFTTrainingResult. Status: Beta.",
    "page": "api/finetuning.html",
    "section": "sfttrainingresult"
  },
  {
    "type": "section",
    "title": "SFTTrainingResult parameters",
    "description": "SFTTrainingResult parameters",
    "page": "api/finetuning.html",
    "section": "sfttrainingresult-parameters"
  },
  {
    "type": "section",
    "title": "SFTTrainingResult example",
    "description": "SFTTrainingResult example",
    "page": "api/finetuning.html",
    "section": "sfttrainingresult-example"
  },
  {
    "type": "section",
    "title": "TokenizerAdapter",
    "description": "Zet verschillende tokenizers om naar \u00e9\u00e9n eenvoudige interface. Canonical import: from arclm.finetuning import TokenizerAdapter. Fully qualified name: arclm.finetuning.TokenizerAdapter. Status: Beta.",
    "page": "api/finetuning.html",
    "section": "tokenizeradapter"
  },
  {
    "type": "section",
    "title": "TokenizerAdapter parameters",
    "description": "TokenizerAdapter parameters",
    "page": "api/finetuning.html",
    "section": "tokenizeradapter-parameters"
  },
  {
    "type": "section",
    "title": "TokenizerAdapter example",
    "description": "TokenizerAdapter example",
    "page": "api/finetuning.html",
    "section": "tokenizeradapter-example"
  },
  {
    "type": "section",
    "title": "create_labels",
    "description": "Maakt labels en negeert padding tijdens de lossberekening. Canonical import: from arclm.finetuning import create_labels. Fully qualified name: arclm.finetuning.create_labels. Status: Beta.",
    "page": "api/finetuning.html",
    "section": "create-labels"
  },
  {
    "type": "section",
    "title": "create_labels parameters",
    "description": "create_labels parameters",
    "page": "api/finetuning.html",
    "section": "create-labels-parameters"
  },
  {
    "type": "section",
    "title": "create_labels example",
    "description": "create_labels example",
    "page": "api/finetuning.html",
    "section": "create-labels-example"
  },
  {
    "type": "section",
    "title": "fine_tune",
    "description": "Voert full-parameter fine-tuning uit met de bestaande Trainer. Canonical import: from arclm.finetuning import fine_tune. Fully qualified name: arclm.finetuning.fine_tune. Status: Beta.",
    "page": "api/finetuning.html",
    "section": "fine-tune"
  },
  {
    "type": "section",
    "title": "fine_tune parameters",
    "description": "fine_tune parameters",
    "page": "api/finetuning.html",
    "section": "fine-tune-parameters"
  },
  {
    "type": "section",
    "title": "fine_tune example",
    "description": "fine_tune example",
    "page": "api/finetuning.html",
    "section": "fine-tune-example"
  },
  {
    "type": "section",
    "title": "fine_tuning_format_fingerprint",
    "description": "Fingerprint only fields that affect prepared fine-tuning examples. Canonical import: from arclm.finetuning import fine_tuning_format_fingerprint. Fully qualified name: arclm.finetuning.fine_tuning_format_fingerprint. Status: Beta.",
    "page": "api/finetuning.html",
    "section": "fine-tuning-format-fingerprint"
  },
  {
    "type": "section",
    "title": "fine_tuning_format_fingerprint parameters",
    "description": "fine_tuning_format_fingerprint parameters",
    "page": "api/finetuning.html",
    "section": "fine-tuning-format-fingerprint-parameters"
  },
  {
    "type": "section",
    "title": "fine_tuning_format_fingerprint example",
    "description": "fine_tuning_format_fingerprint example",
    "page": "api/finetuning.html",
    "section": "fine-tuning-format-fingerprint-example"
  },
  {
    "type": "section",
    "title": "format_chat_example",
    "description": "Maakt tekst van chat messages. Canonical import: from arclm.finetuning import format_chat_example. Fully qualified name: arclm.finetuning.format_chat_example. Status: Beta.",
    "page": "api/finetuning.html",
    "section": "format-chat-example"
  },
  {
    "type": "section",
    "title": "format_chat_example parameters",
    "description": "format_chat_example parameters",
    "page": "api/finetuning.html",
    "section": "format-chat-example-parameters"
  },
  {
    "type": "section",
    "title": "format_chat_example example",
    "description": "format_chat_example example",
    "page": "api/finetuning.html",
    "section": "format-chat-example-example"
  },
  {
    "type": "section",
    "title": "format_example",
    "description": "Formatteert \u00e9\u00e9n voorbeeld volgens de gekozen datasetvorm. Canonical import: from arclm.finetuning import format_example. Fully qualified name: arclm.finetuning.format_example. Status: Beta.",
    "page": "api/finetuning.html",
    "section": "format-example"
  },
  {
    "type": "section",
    "title": "format_example parameters",
    "description": "format_example parameters",
    "page": "api/finetuning.html",
    "section": "format-example-parameters"
  },
  {
    "type": "section",
    "title": "format_example example",
    "description": "format_example example",
    "page": "api/finetuning.html",
    "section": "format-example-example"
  },
  {
    "type": "section",
    "title": "format_instruction_example",
    "description": "Maakt tekst van een instruction-response voorbeeld. Canonical import: from arclm.finetuning import format_instruction_example. Fully qualified name: arclm.finetuning.format_instruction_example. Status: Beta.",
    "page": "api/finetuning.html",
    "section": "format-instruction-example"
  },
  {
    "type": "section",
    "title": "format_instruction_example parameters",
    "description": "format_instruction_example parameters",
    "page": "api/finetuning.html",
    "section": "format-instruction-example-parameters"
  },
  {
    "type": "section",
    "title": "format_instruction_example example",
    "description": "format_instruction_example example",
    "page": "api/finetuning.html",
    "section": "format-instruction-example-example"
  },
  {
    "type": "section",
    "title": "format_prompt_response_example",
    "description": "Maakt tekst van een prompt-response voorbeeld. Canonical import: from arclm.finetuning import format_prompt_response_example. Fully qualified name: arclm.finetuning.format_prompt_response_example. Status: Beta.",
    "page": "api/finetuning.html",
    "section": "format-prompt-response-example"
  },
  {
    "type": "section",
    "title": "format_prompt_response_example parameters",
    "description": "format_prompt_response_example parameters",
    "page": "api/finetuning.html",
    "section": "format-prompt-response-example-parameters"
  },
  {
    "type": "section",
    "title": "format_prompt_response_example example",
    "description": "format_prompt_response_example example",
    "page": "api/finetuning.html",
    "section": "format-prompt-response-example-example"
  },
  {
    "type": "section",
    "title": "format_text_example",
    "description": "Maakt tekst van een plain-text voorbeeld. Canonical import: from arclm.finetuning import format_text_example. Fully qualified name: arclm.finetuning.format_text_example. Status: Beta.",
    "page": "api/finetuning.html",
    "section": "format-text-example"
  },
  {
    "type": "section",
    "title": "format_text_example parameters",
    "description": "format_text_example parameters",
    "page": "api/finetuning.html",
    "section": "format-text-example-parameters"
  },
  {
    "type": "section",
    "title": "format_text_example example",
    "description": "format_text_example example",
    "page": "api/finetuning.html",
    "section": "format-text-example-example"
  },
  {
    "type": "section",
    "title": "get_sft_record_contract",
    "description": "Describe one supported SFT record format. Canonical import: from arclm.finetuning import get_sft_record_contract. Fully qualified name: arclm.finetuning.get_sft_record_contract. Status: Beta.",
    "page": "api/finetuning.html",
    "section": "get-sft-record-contract"
  },
  {
    "type": "section",
    "title": "get_sft_record_contract parameters",
    "description": "get_sft_record_contract parameters",
    "page": "api/finetuning.html",
    "section": "get-sft-record-contract-parameters"
  },
  {
    "type": "section",
    "title": "get_sft_record_contract example",
    "description": "get_sft_record_contract example",
    "page": "api/finetuning.html",
    "section": "get-sft-record-contract-example"
  },
  {
    "type": "section",
    "title": "mask_labels",
    "description": "Zet labels buiten de actieve mask op `ignore_index`. Canonical import: from arclm.finetuning import mask_labels. Fully qualified name: arclm.finetuning.mask_labels. Status: Beta.",
    "page": "api/finetuning.html",
    "section": "mask-labels"
  },
  {
    "type": "section",
    "title": "mask_labels parameters",
    "description": "mask_labels parameters",
    "page": "api/finetuning.html",
    "section": "mask-labels-parameters"
  },
  {
    "type": "section",
    "title": "mask_labels example",
    "description": "mask_labels example",
    "page": "api/finetuning.html",
    "section": "mask-labels-example"
  },
  {
    "type": "section",
    "title": "normalize_fine_tuning_example",
    "description": "Normaliseert een datasetrecord naar veilige tekstsegmenten. Canonical import: from arclm.finetuning import normalize_fine_tuning_example. Fully qualified name: arclm.finetuning.normalize_fine_tuning_example. Status: Beta.",
    "page": "api/finetuning.html",
    "section": "normalize-fine-tuning-example"
  },
  {
    "type": "section",
    "title": "normalize_fine_tuning_example parameters",
    "description": "normalize_fine_tuning_example parameters",
    "page": "api/finetuning.html",
    "section": "normalize-fine-tuning-example-parameters"
  },
  {
    "type": "section",
    "title": "normalize_fine_tuning_example example",
    "description": "normalize_fine_tuning_example example",
    "page": "api/finetuning.html",
    "section": "normalize-fine-tuning-example-example"
  },
  {
    "type": "section",
    "title": "pack_sequences",
    "description": "Pakt korte voorbeelden samen tot maximaal `max_length` tokens. Canonical import: from arclm.finetuning import pack_sequences. Fully qualified name: arclm.finetuning.pack_sequences. Status: Beta.",
    "page": "api/finetuning.html",
    "section": "pack-sequences"
  },
  {
    "type": "section",
    "title": "pack_sequences parameters",
    "description": "pack_sequences parameters",
    "page": "api/finetuning.html",
    "section": "pack-sequences-parameters"
  },
  {
    "type": "section",
    "title": "pack_sequences example",
    "description": "pack_sequences example",
    "page": "api/finetuning.html",
    "section": "pack-sequences-example"
  },
  {
    "type": "section",
    "title": "prepare_fine_tuning_dataset",
    "description": "Valideert, formatteert en tokenizet fine-tuning records. Canonical import: from arclm.finetuning import prepare_fine_tuning_dataset. Fully qualified name: arclm.finetuning.prepare_fine_tuning_dataset. Status: Beta.",
    "page": "api/finetuning.html",
    "section": "prepare-fine-tuning-dataset"
  },
  {
    "type": "section",
    "title": "prepare_fine_tuning_dataset parameters",
    "description": "prepare_fine_tuning_dataset parameters",
    "page": "api/finetuning.html",
    "section": "prepare-fine-tuning-dataset-parameters"
  },
  {
    "type": "section",
    "title": "prepare_fine_tuning_dataset example",
    "description": "prepare_fine_tuning_dataset example",
    "page": "api/finetuning.html",
    "section": "prepare-fine-tuning-dataset-example"
  },
  {
    "type": "section",
    "title": "prepare_fine_tuning_record",
    "description": "Prepare exactly one record using the canonical dataset-preparation path. Canonical import: from arclm.finetuning import prepare_fine_tuning_record. Fully qualified name: arclm.finetuning.prepare_fine_tuning_record. Status: Beta.",
    "page": "api/finetuning.html",
    "section": "prepare-fine-tuning-record"
  },
  {
    "type": "section",
    "title": "prepare_fine_tuning_record parameters",
    "description": "prepare_fine_tuning_record parameters",
    "page": "api/finetuning.html",
    "section": "prepare-fine-tuning-record-parameters"
  },
  {
    "type": "section",
    "title": "prepare_fine_tuning_record example",
    "description": "prepare_fine_tuning_record example",
    "page": "api/finetuning.html",
    "section": "prepare-fine-tuning-record-example"
  },
  {
    "type": "section",
    "title": "train_sft",
    "description": "Run supervised fine-tuning through an ArcLM backend. Canonical import: from arclm.finetuning import train_sft. Fully qualified name: arclm.finetuning.train_sft. Status: Beta.",
    "page": "api/finetuning.html",
    "section": "train-sft"
  },
  {
    "type": "section",
    "title": "train_sft parameters",
    "description": "train_sft parameters",
    "page": "api/finetuning.html",
    "section": "train-sft-parameters"
  },
  {
    "type": "section",
    "title": "train_sft example",
    "description": "train_sft example",
    "page": "api/finetuning.html",
    "section": "train-sft-example"
  },
  {
    "type": "section",
    "title": "validate_sft_records",
    "description": "Validate SFT records through the canonical fine-tuning normalizer. Canonical import: from arclm.finetuning import validate_sft_records. Fully qualified name: arclm.finetuning.validate_sft_records. Status: Beta.",
    "page": "api/finetuning.html",
    "section": "validate-sft-records"
  },
  {
    "type": "section",
    "title": "validate_sft_records parameters",
    "description": "validate_sft_records parameters",
    "page": "api/finetuning.html",
    "section": "validate-sft-records-parameters"
  },
  {
    "type": "section",
    "title": "validate_sft_records example",
    "description": "validate_sft_records example",
    "page": "api/finetuning.html",
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
    "title": "AdaptedModelBundle",
    "description": "ArcLM model and metadata produced from a normalized checkpoint. Canonical import: from arclm.checkpoints import AdaptedModelBundle. Fully qualified name: arclm.checkpoints.AdaptedModelBundle. Status: Stable.",
    "page": "api/checkpoints.html",
    "section": "adaptedmodelbundle"
  },
  {
    "type": "section",
    "title": "AdaptedModelBundle parameters",
    "description": "AdaptedModelBundle parameters",
    "page": "api/checkpoints.html",
    "section": "adaptedmodelbundle-parameters"
  },
  {
    "type": "section",
    "title": "AdaptedModelBundle example",
    "description": "AdaptedModelBundle example",
    "page": "api/checkpoints.html",
    "section": "adaptedmodelbundle-example"
  },
  {
    "type": "section",
    "title": "CheckpointInfo",
    "description": "Beschrijft een training checkpoint zonder training te starten. Canonical import: from arclm.checkpoints import CheckpointInfo. Fully qualified name: arclm.checkpoints.CheckpointInfo. Status: Stable.",
    "page": "api/checkpoints.html",
    "section": "checkpointinfo"
  },
  {
    "type": "section",
    "title": "CheckpointInfo parameters",
    "description": "CheckpointInfo parameters",
    "page": "api/checkpoints.html",
    "section": "checkpointinfo-parameters"
  },
  {
    "type": "section",
    "title": "CheckpointInfo example",
    "description": "CheckpointInfo example",
    "page": "api/checkpoints.html",
    "section": "checkpointinfo-example"
  },
  {
    "type": "section",
    "title": "CheckpointLoader",
    "description": "Base class for source-specific checkpoint loaders. Canonical import: from arclm.checkpoints import CheckpointLoader. Fully qualified name: arclm.checkpoints.CheckpointLoader. Status: Stable.",
    "page": "api/checkpoints.html",
    "section": "checkpointloader"
  },
  {
    "type": "section",
    "title": "CheckpointLoader parameters",
    "description": "CheckpointLoader parameters",
    "page": "api/checkpoints.html",
    "section": "checkpointloader-parameters"
  },
  {
    "type": "section",
    "title": "CheckpointLoader example",
    "description": "CheckpointLoader example",
    "page": "api/checkpoints.html",
    "section": "checkpointloader-example"
  },
  {
    "type": "section",
    "title": "LoadedCheckpoint",
    "description": "Normalized representation of a model source that ArcLM can inspect. Canonical import: from arclm.checkpoints import LoadedCheckpoint. Fully qualified name: arclm.checkpoints.LoadedCheckpoint. Status: Stable.",
    "page": "api/checkpoints.html",
    "section": "loadedcheckpoint"
  },
  {
    "type": "section",
    "title": "LoadedCheckpoint parameters",
    "description": "LoadedCheckpoint parameters",
    "page": "api/checkpoints.html",
    "section": "loadedcheckpoint-parameters"
  },
  {
    "type": "section",
    "title": "LoadedCheckpoint example",
    "description": "LoadedCheckpoint example",
    "page": "api/checkpoints.html",
    "section": "loadedcheckpoint-example"
  },
  {
    "type": "section",
    "title": "LoaderRegistry",
    "description": "Ordered registry that picks the first loader matching a source. Canonical import: from arclm.checkpoints import LoaderRegistry. Fully qualified name: arclm.checkpoints.LoaderRegistry. Status: Stable.",
    "page": "api/checkpoints.html",
    "section": "loaderregistry"
  },
  {
    "type": "section",
    "title": "LoaderRegistry parameters",
    "description": "LoaderRegistry parameters",
    "page": "api/checkpoints.html",
    "section": "loaderregistry-parameters"
  },
  {
    "type": "section",
    "title": "LoaderRegistry example",
    "description": "LoaderRegistry example",
    "page": "api/checkpoints.html",
    "section": "loaderregistry-example"
  },
  {
    "type": "section",
    "title": "LoadPlan",
    "description": "Detected and user-selected settings for loading a model source. Canonical import: from arclm.checkpoints import LoadPlan. Fully qualified name: arclm.checkpoints.LoadPlan. Status: Stable.",
    "page": "api/checkpoints.html",
    "section": "loadplan"
  },
  {
    "type": "section",
    "title": "LoadPlan parameters",
    "description": "LoadPlan parameters",
    "page": "api/checkpoints.html",
    "section": "loadplan-parameters"
  },
  {
    "type": "section",
    "title": "LoadPlan example",
    "description": "LoadPlan example",
    "page": "api/checkpoints.html",
    "section": "loadplan-example"
  },
  {
    "type": "section",
    "title": "ModelInspector",
    "description": "Base class for source inspectors used by ``SmartLoader``. Canonical import: from arclm.checkpoints import ModelInspector. Fully qualified name: arclm.checkpoints.ModelInspector. Status: Stable.",
    "page": "api/checkpoints.html",
    "section": "modelinspector"
  },
  {
    "type": "section",
    "title": "ModelInspector parameters",
    "description": "ModelInspector parameters",
    "page": "api/checkpoints.html",
    "section": "modelinspector-parameters"
  },
  {
    "type": "section",
    "title": "ModelInspector example",
    "description": "ModelInspector example",
    "page": "api/checkpoints.html",
    "section": "modelinspector-example"
  },
  {
    "type": "section",
    "title": "SmartLoader",
    "description": "High-level loading entry point with inspection and manual overrides. Canonical import: from arclm.checkpoints import SmartLoader. Fully qualified name: arclm.checkpoints.SmartLoader. Status: Stable.",
    "page": "api/checkpoints.html",
    "section": "smartloader"
  },
  {
    "type": "section",
    "title": "SmartLoader parameters",
    "description": "SmartLoader parameters",
    "page": "api/checkpoints.html",
    "section": "smartloader-parameters"
  },
  {
    "type": "section",
    "title": "SmartLoader example",
    "description": "SmartLoader example",
    "page": "api/checkpoints.html",
    "section": "smartloader-example"
  },
  {
    "type": "section",
    "title": "CHECKPOINT_FORMAT",
    "description": "str(object='') -> str str(bytes_or_buffer[, encoding[, errors]]) -> str Create a new string object from the given object. Canonical import: from arclm.checkpoints import CHECKPOINT_FORMAT. Fully qualified name: arclm.checkpoints.CHECKPOINT_FORMAT. Status: Stable.",
    "page": "api/checkpoints.html",
    "section": "checkpoint-format"
  },
  {
    "type": "section",
    "title": "CHECKPOINT_FORMAT parameters",
    "description": "CHECKPOINT_FORMAT parameters",
    "page": "api/checkpoints.html",
    "section": "checkpoint-format-parameters"
  },
  {
    "type": "section",
    "title": "CHECKPOINT_FORMAT example",
    "description": "CHECKPOINT_FORMAT example",
    "page": "api/checkpoints.html",
    "section": "checkpoint-format-example"
  },
  {
    "type": "section",
    "title": "CHECKPOINT_VERSION",
    "description": "int([x]) -> integer int(x, base=10) -> integer Convert a number or string to an integer, or return 0 if no arguments are given. Canonical import: from arclm.checkpoints import CHECKPOINT_VERSION. Fully qualified name: arclm.checkpoints.CHECKPOINT_VERSION. Status: Stable.",
    "page": "api/checkpoints.html",
    "section": "checkpoint-version"
  },
  {
    "type": "section",
    "title": "CHECKPOINT_VERSION parameters",
    "description": "CHECKPOINT_VERSION parameters",
    "page": "api/checkpoints.html",
    "section": "checkpoint-version-parameters"
  },
  {
    "type": "section",
    "title": "CHECKPOINT_VERSION example",
    "description": "CHECKPOINT_VERSION example",
    "page": "api/checkpoints.html",
    "section": "checkpoint-version-example"
  },
  {
    "type": "section",
    "title": "adapt_for_training",
    "description": "Create an ArcLM model from a normalized checkpoint. Canonical import: from arclm.checkpoints import adapt_for_training. Fully qualified name: arclm.checkpoints.adapt_for_training. Status: Stable.",
    "page": "api/checkpoints.html",
    "section": "adapt-for-training"
  },
  {
    "type": "section",
    "title": "adapt_for_training parameters",
    "description": "adapt_for_training parameters",
    "page": "api/checkpoints.html",
    "section": "adapt-for-training-parameters"
  },
  {
    "type": "section",
    "title": "adapt_for_training example",
    "description": "adapt_for_training example",
    "page": "api/checkpoints.html",
    "section": "adapt-for-training-example"
  },
  {
    "type": "section",
    "title": "create_default_registry",
    "description": "Maakt de standaard registry met loaders. Canonical import: from arclm.checkpoints import create_default_registry. Fully qualified name: arclm.checkpoints.create_default_registry. Status: Stable.",
    "page": "api/checkpoints.html",
    "section": "create-default-registry"
  },
  {
    "type": "section",
    "title": "create_default_registry parameters",
    "description": "create_default_registry parameters",
    "page": "api/checkpoints.html",
    "section": "create-default-registry-parameters"
  },
  {
    "type": "section",
    "title": "create_default_registry example",
    "description": "create_default_registry example",
    "page": "api/checkpoints.html",
    "section": "create-default-registry-example"
  },
  {
    "type": "section",
    "title": "inspect_checkpoint",
    "description": "Inspecteert een vertrouwd training checkpoint zonder objects te maken. Canonical import: from arclm.checkpoints import inspect_checkpoint. Fully qualified name: arclm.checkpoints.inspect_checkpoint. Status: Stable.",
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
    "type": "section",
    "title": "inspect_model_source",
    "description": "Inspect a model source and merge explicit user settings over detections. Canonical import: from arclm.checkpoints import inspect_model_source. Fully qualified name: arclm.checkpoints.inspect_model_source. Status: Stable.",
    "page": "api/checkpoints.html",
    "section": "inspect-model-source"
  },
  {
    "type": "section",
    "title": "inspect_model_source parameters",
    "description": "inspect_model_source parameters",
    "page": "api/checkpoints.html",
    "section": "inspect-model-source-parameters"
  },
  {
    "type": "section",
    "title": "inspect_model_source example",
    "description": "inspect_model_source example",
    "page": "api/checkpoints.html",
    "section": "inspect-model-source-example"
  },
  {
    "type": "section",
    "title": "load_external_model",
    "description": "Load any supported external source into a normalized checkpoint bundle. Canonical import: from arclm.checkpoints import load_external_model. Fully qualified name: arclm.checkpoints.load_external_model. Status: Stable.",
    "page": "api/checkpoints.html",
    "section": "load-external-model"
  },
  {
    "type": "section",
    "title": "load_external_model parameters",
    "description": "load_external_model parameters",
    "page": "api/checkpoints.html",
    "section": "load-external-model-parameters"
  },
  {
    "type": "section",
    "title": "load_external_model example",
    "description": "load_external_model example",
    "page": "api/checkpoints.html",
    "section": "load-external-model-example"
  },
  {
    "type": "section",
    "title": "register_model_inspector",
    "description": "Register a custom model-source inspector. Canonical import: from arclm.checkpoints import register_model_inspector. Fully qualified name: arclm.checkpoints.register_model_inspector. Status: Stable.",
    "page": "api/checkpoints.html",
    "section": "register-model-inspector"
  },
  {
    "type": "section",
    "title": "register_model_inspector parameters",
    "description": "register_model_inspector parameters",
    "page": "api/checkpoints.html",
    "section": "register-model-inspector-parameters"
  },
  {
    "type": "section",
    "title": "register_model_inspector example",
    "description": "register_model_inspector example",
    "page": "api/checkpoints.html",
    "section": "register-model-inspector-example"
  },
  {
    "type": "section",
    "title": "validate_checkpoint",
    "description": "Valideert een checkpoint en geeft de veilige inspectie-info terug. Canonical import: from arclm.checkpoints import validate_checkpoint. Fully qualified name: arclm.checkpoints.validate_checkpoint. Status: Stable.",
    "page": "api/checkpoints.html",
    "section": "validate-checkpoint"
  },
  {
    "type": "section",
    "title": "validate_checkpoint parameters",
    "description": "validate_checkpoint parameters",
    "page": "api/checkpoints.html",
    "section": "validate-checkpoint-parameters"
  },
  {
    "type": "section",
    "title": "validate_checkpoint example",
    "description": "validate_checkpoint example",
    "page": "api/checkpoints.html",
    "section": "validate-checkpoint-example"
  },
  {
    "type": "section",
    "title": "validate_tokenizer_compatibility",
    "description": "Raise if a tokenizer cannot safely address the checkpoint vocabulary. Canonical import: from arclm.checkpoints import validate_tokenizer_compatibility. Fully qualified name: arclm.checkpoints.validate_tokenizer_compatibility. Status: Stable.",
    "page": "api/checkpoints.html",
    "section": "validate-tokenizer-compatibility"
  },
  {
    "type": "section",
    "title": "validate_tokenizer_compatibility parameters",
    "description": "validate_tokenizer_compatibility parameters",
    "page": "api/checkpoints.html",
    "section": "validate-tokenizer-compatibility-parameters"
  },
  {
    "type": "section",
    "title": "validate_tokenizer_compatibility example",
    "description": "validate_tokenizer_compatibility example",
    "page": "api/checkpoints.html",
    "section": "validate-tokenizer-compatibility-example"
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
    "title": "Accuracy",
    "description": "Berekent accuracy voor classificatie of token logits. Canonical import: from arclm.evaluation import Accuracy. Fully qualified name: arclm.evaluation.Accuracy. Status: Stable.",
    "page": "api/evaluation.html",
    "section": "accuracy"
  },
  {
    "type": "section",
    "title": "Accuracy parameters",
    "description": "Accuracy parameters",
    "page": "api/evaluation.html",
    "section": "accuracy-parameters"
  },
  {
    "type": "section",
    "title": "Accuracy example",
    "description": "Accuracy example",
    "page": "api/evaluation.html",
    "section": "accuracy-example"
  },
  {
    "type": "section",
    "title": "BaseEvaluationCallback",
    "description": "Basis class voor eigen evaluation callbacks. Canonical import: from arclm.evaluation import BaseEvaluationCallback. Fully qualified name: arclm.evaluation.BaseEvaluationCallback. Status: Stable.",
    "page": "api/evaluation.html",
    "section": "baseevaluationcallback"
  },
  {
    "type": "section",
    "title": "BaseEvaluationCallback parameters",
    "description": "BaseEvaluationCallback parameters",
    "page": "api/evaluation.html",
    "section": "baseevaluationcallback-parameters"
  },
  {
    "type": "section",
    "title": "BaseEvaluationCallback example",
    "description": "BaseEvaluationCallback example",
    "page": "api/evaluation.html",
    "section": "baseevaluationcallback-example"
  },
  {
    "type": "section",
    "title": "BaseEvaluator",
    "description": "Basis class voor eigen evaluators. Canonical import: from arclm.evaluation import BaseEvaluator. Fully qualified name: arclm.evaluation.BaseEvaluator. Status: Stable.",
    "page": "api/evaluation.html",
    "section": "baseevaluator"
  },
  {
    "type": "section",
    "title": "BaseEvaluator parameters",
    "description": "BaseEvaluator parameters",
    "page": "api/evaluation.html",
    "section": "baseevaluator-parameters"
  },
  {
    "type": "section",
    "title": "BaseEvaluator example",
    "description": "BaseEvaluator example",
    "page": "api/evaluation.html",
    "section": "baseevaluator-example"
  },
  {
    "type": "section",
    "title": "BaseMetric",
    "description": "Basis class voor developers die een eigen metric willen maken. Canonical import: from arclm.evaluation import BaseMetric. Fully qualified name: arclm.evaluation.BaseMetric. Status: Stable.",
    "page": "api/evaluation.html",
    "section": "basemetric"
  },
  {
    "type": "section",
    "title": "BaseMetric parameters",
    "description": "BaseMetric parameters",
    "page": "api/evaluation.html",
    "section": "basemetric-parameters"
  },
  {
    "type": "section",
    "title": "BaseMetric example",
    "description": "BaseMetric example",
    "page": "api/evaluation.html",
    "section": "basemetric-example"
  },
  {
    "type": "section",
    "title": "ConceptBenchmarkCase",
    "description": "Expected concept relationships for a prompt. Canonical import: from arclm.evaluation import ConceptBenchmarkCase. Fully qualified name: arclm.evaluation.ConceptBenchmarkCase. Status: Stable.",
    "page": "api/evaluation.html",
    "section": "conceptbenchmarkcase"
  },
  {
    "type": "section",
    "title": "ConceptBenchmarkCase parameters",
    "description": "ConceptBenchmarkCase parameters",
    "page": "api/evaluation.html",
    "section": "conceptbenchmarkcase-parameters"
  },
  {
    "type": "section",
    "title": "ConceptBenchmarkCase example",
    "description": "ConceptBenchmarkCase example",
    "page": "api/evaluation.html",
    "section": "conceptbenchmarkcase-example"
  },
  {
    "type": "section",
    "title": "ConceptBenchmarkResult",
    "description": "Concept benchmark score for one prompt. Canonical import: from arclm.evaluation import ConceptBenchmarkResult. Fully qualified name: arclm.evaluation.ConceptBenchmarkResult. Status: Stable.",
    "page": "api/evaluation.html",
    "section": "conceptbenchmarkresult"
  },
  {
    "type": "section",
    "title": "ConceptBenchmarkResult parameters",
    "description": "ConceptBenchmarkResult parameters",
    "page": "api/evaluation.html",
    "section": "conceptbenchmarkresult-parameters"
  },
  {
    "type": "section",
    "title": "ConceptBenchmarkResult example",
    "description": "ConceptBenchmarkResult example",
    "page": "api/evaluation.html",
    "section": "conceptbenchmarkresult-example"
  },
  {
    "type": "section",
    "title": "EvaluationConfig",
    "description": "Bewaart instellingen voor een evaluatierun. Canonical import: from arclm.evaluation import EvaluationConfig. Fully qualified name: arclm.evaluation.EvaluationConfig. Status: Stable.",
    "page": "api/evaluation.html",
    "section": "evaluationconfig"
  },
  {
    "type": "section",
    "title": "EvaluationConfig parameters",
    "description": "EvaluationConfig parameters",
    "page": "api/evaluation.html",
    "section": "evaluationconfig-parameters"
  },
  {
    "type": "section",
    "title": "EvaluationConfig example",
    "description": "EvaluationConfig example",
    "page": "api/evaluation.html",
    "section": "evaluationconfig-example"
  },
  {
    "type": "section",
    "title": "EvaluationReport",
    "description": "Structured, JSON-safe summary of an evaluation run. Canonical import: from arclm.evaluation import EvaluationReport. Fully qualified name: arclm.evaluation.EvaluationReport. Status: Stable.",
    "page": "api/evaluation.html",
    "section": "evaluationreport"
  },
  {
    "type": "section",
    "title": "EvaluationReport parameters",
    "description": "EvaluationReport parameters",
    "page": "api/evaluation.html",
    "section": "evaluationreport-parameters"
  },
  {
    "type": "section",
    "title": "EvaluationReport example",
    "description": "EvaluationReport example",
    "page": "api/evaluation.html",
    "section": "evaluationreport-example"
  },
  {
    "type": "section",
    "title": "EvaluationResult",
    "description": "Bewaart de uitkomst van een evaluatierun. Canonical import: from arclm.evaluation import EvaluationResult. Fully qualified name: arclm.evaluation.EvaluationResult. Status: Stable.",
    "page": "api/evaluation.html",
    "section": "evaluationresult"
  },
  {
    "type": "section",
    "title": "EvaluationResult parameters",
    "description": "EvaluationResult parameters",
    "page": "api/evaluation.html",
    "section": "evaluationresult-parameters"
  },
  {
    "type": "section",
    "title": "EvaluationResult example",
    "description": "EvaluationResult example",
    "page": "api/evaluation.html",
    "section": "evaluationresult-example"
  },
  {
    "type": "section",
    "title": "Evaluator",
    "description": "Voert evaluatie uit op een model en dataset. Canonical import: from arclm.evaluation import Evaluator. Fully qualified name: arclm.evaluation.Evaluator. Status: Stable.",
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
    "title": "LongContextResult",
    "description": "Summary for one long-context training/evaluation run. Canonical import: from arclm.evaluation import LongContextResult. Fully qualified name: arclm.evaluation.LongContextResult. Status: Stable.",
    "page": "api/evaluation.html",
    "section": "longcontextresult"
  },
  {
    "type": "section",
    "title": "LongContextResult parameters",
    "description": "LongContextResult parameters",
    "page": "api/evaluation.html",
    "section": "longcontextresult-parameters"
  },
  {
    "type": "section",
    "title": "LongContextResult example",
    "description": "LongContextResult example",
    "page": "api/evaluation.html",
    "section": "longcontextresult-example"
  },
  {
    "type": "section",
    "title": "LossMetric",
    "description": "Berekent gemiddelde loss per batch. Canonical import: from arclm.evaluation import LossMetric. Fully qualified name: arclm.evaluation.LossMetric. Status: Stable.",
    "page": "api/evaluation.html",
    "section": "lossmetric"
  },
  {
    "type": "section",
    "title": "LossMetric parameters",
    "description": "LossMetric parameters",
    "page": "api/evaluation.html",
    "section": "lossmetric-parameters"
  },
  {
    "type": "section",
    "title": "LossMetric example",
    "description": "LossMetric example",
    "page": "api/evaluation.html",
    "section": "lossmetric-example"
  },
  {
    "type": "section",
    "title": "MetricsReport",
    "description": "Comprehensive metrics report for model evaluation. Canonical import: from arclm.evaluation import MetricsReport. Fully qualified name: arclm.evaluation.MetricsReport. Status: Stable.",
    "page": "api/evaluation.html",
    "section": "metricsreport"
  },
  {
    "type": "section",
    "title": "MetricsReport parameters",
    "description": "MetricsReport parameters",
    "page": "api/evaluation.html",
    "section": "metricsreport-parameters"
  },
  {
    "type": "section",
    "title": "MetricsReport example",
    "description": "MetricsReport example",
    "page": "api/evaluation.html",
    "section": "metricsreport-example"
  },
  {
    "type": "section",
    "title": "Perplexity",
    "description": "Berekent perplexity uit gemiddelde loss. Canonical import: from arclm.evaluation import Perplexity. Fully qualified name: arclm.evaluation.Perplexity. Status: Stable.",
    "page": "api/evaluation.html",
    "section": "perplexity"
  },
  {
    "type": "section",
    "title": "Perplexity parameters",
    "description": "Perplexity parameters",
    "page": "api/evaluation.html",
    "section": "perplexity-parameters"
  },
  {
    "type": "section",
    "title": "Perplexity example",
    "description": "Perplexity example",
    "page": "api/evaluation.html",
    "section": "perplexity-example"
  },
  {
    "type": "section",
    "title": "TopKPrediction",
    "description": "One next-token prediction. Canonical import: from arclm.evaluation import TopKPrediction. Fully qualified name: arclm.evaluation.TopKPrediction. Status: Stable.",
    "page": "api/evaluation.html",
    "section": "topkprediction"
  },
  {
    "type": "section",
    "title": "TopKPrediction parameters",
    "description": "TopKPrediction parameters",
    "page": "api/evaluation.html",
    "section": "topkprediction-parameters"
  },
  {
    "type": "section",
    "title": "TopKPrediction example",
    "description": "TopKPrediction example",
    "page": "api/evaluation.html",
    "section": "topkprediction-example"
  },
  {
    "type": "section",
    "title": "DEFAULT_CONCEPT_BENCHMARKS",
    "description": "Built-in mutable sequence. Canonical import: from arclm.evaluation import DEFAULT_CONCEPT_BENCHMARKS. Fully qualified name: arclm.evaluation.DEFAULT_CONCEPT_BENCHMARKS. Status: Stable.",
    "page": "api/evaluation.html",
    "section": "default-concept-benchmarks"
  },
  {
    "type": "section",
    "title": "DEFAULT_CONCEPT_BENCHMARKS parameters",
    "description": "DEFAULT_CONCEPT_BENCHMARKS parameters",
    "page": "api/evaluation.html",
    "section": "default-concept-benchmarks-parameters"
  },
  {
    "type": "section",
    "title": "DEFAULT_CONCEPT_BENCHMARKS example",
    "description": "DEFAULT_CONCEPT_BENCHMARKS example",
    "page": "api/evaluation.html",
    "section": "default-concept-benchmarks-example"
  },
  {
    "type": "section",
    "title": "build_evaluation_report",
    "description": "Build a report from canonical evaluator metrics without recalculation. Canonical import: from arclm.evaluation import build_evaluation_report. Fully qualified name: arclm.evaluation.build_evaluation_report. Status: Stable.",
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
    "type": "section",
    "title": "build_training_diagnostics_report",
    "description": "Build tokenizer, top-k, and concept benchmark diagnostics for a run. Canonical import: from arclm.evaluation import build_training_diagnostics_report. Fully qualified name: arclm.evaluation.build_training_diagnostics_report. Status: Stable.",
    "page": "api/evaluation.html",
    "section": "build-training-diagnostics-report"
  },
  {
    "type": "section",
    "title": "build_training_diagnostics_report parameters",
    "description": "build_training_diagnostics_report parameters",
    "page": "api/evaluation.html",
    "section": "build-training-diagnostics-report-parameters"
  },
  {
    "type": "section",
    "title": "build_training_diagnostics_report example",
    "description": "build_training_diagnostics_report example",
    "page": "api/evaluation.html",
    "section": "build-training-diagnostics-report-example"
  },
  {
    "type": "section",
    "title": "calculate_metrics",
    "description": "Calculate comprehensive evaluation metrics. Canonical import: from arclm.evaluation import calculate_metrics. Fully qualified name: arclm.evaluation.calculate_metrics. Status: Stable.",
    "page": "api/evaluation.html",
    "section": "calculate-metrics"
  },
  {
    "type": "section",
    "title": "calculate_metrics parameters",
    "description": "calculate_metrics parameters",
    "page": "api/evaluation.html",
    "section": "calculate-metrics-parameters"
  },
  {
    "type": "section",
    "title": "calculate_metrics example",
    "description": "calculate_metrics example",
    "page": "api/evaluation.html",
    "section": "calculate-metrics-example"
  },
  {
    "type": "section",
    "title": "calculate_perplexity",
    "description": "Return perplexity for a cross-entropy loss value. Canonical import: from arclm.evaluation import calculate_perplexity. Fully qualified name: arclm.evaluation.calculate_perplexity. Status: Stable.",
    "page": "api/evaluation.html",
    "section": "calculate-perplexity"
  },
  {
    "type": "section",
    "title": "calculate_perplexity parameters",
    "description": "calculate_perplexity parameters",
    "page": "api/evaluation.html",
    "section": "calculate-perplexity-parameters"
  },
  {
    "type": "section",
    "title": "calculate_perplexity example",
    "description": "calculate_perplexity example",
    "page": "api/evaluation.html",
    "section": "calculate-perplexity-example"
  },
  {
    "type": "section",
    "title": "evaluate",
    "description": "Voert evaluatie uit met de standaard `Evaluator`. Canonical import: from arclm.evaluation import evaluate. Fully qualified name: arclm.evaluation.evaluate. Status: Stable.",
    "page": "api/evaluation.html",
    "section": "evaluate"
  },
  {
    "type": "section",
    "title": "evaluate parameters",
    "description": "evaluate parameters",
    "page": "api/evaluation.html",
    "section": "evaluate-parameters"
  },
  {
    "type": "section",
    "title": "evaluate example",
    "description": "evaluate example",
    "page": "api/evaluation.html",
    "section": "evaluate-example"
  },
  {
    "type": "section",
    "title": "export_metrics_to_json",
    "description": "Export metrics report to JSON file. Canonical import: from arclm.evaluation import export_metrics_to_json. Fully qualified name: arclm.evaluation.export_metrics_to_json. Status: Stable.",
    "page": "api/evaluation.html",
    "section": "export-metrics-to-json"
  },
  {
    "type": "section",
    "title": "export_metrics_to_json parameters",
    "description": "export_metrics_to_json parameters",
    "page": "api/evaluation.html",
    "section": "export-metrics-to-json-parameters"
  },
  {
    "type": "section",
    "title": "export_metrics_to_json example",
    "description": "export_metrics_to_json example",
    "page": "api/evaluation.html",
    "section": "export-metrics-to-json-example"
  },
  {
    "type": "section",
    "title": "export_metrics_to_markdown",
    "description": "Export metrics report to Markdown file. Canonical import: from arclm.evaluation import export_metrics_to_markdown. Fully qualified name: arclm.evaluation.export_metrics_to_markdown. Status: Stable.",
    "page": "api/evaluation.html",
    "section": "export-metrics-to-markdown"
  },
  {
    "type": "section",
    "title": "export_metrics_to_markdown parameters",
    "description": "export_metrics_to_markdown parameters",
    "page": "api/evaluation.html",
    "section": "export-metrics-to-markdown-parameters"
  },
  {
    "type": "section",
    "title": "export_metrics_to_markdown example",
    "description": "export_metrics_to_markdown example",
    "page": "api/evaluation.html",
    "section": "export-metrics-to-markdown-example"
  },
  {
    "type": "section",
    "title": "format_concept_benchmark_report",
    "description": "Create a readable concept benchmark report. Canonical import: from arclm.evaluation import format_concept_benchmark_report. Fully qualified name: arclm.evaluation.format_concept_benchmark_report. Status: Stable.",
    "page": "api/evaluation.html",
    "section": "format-concept-benchmark-report"
  },
  {
    "type": "section",
    "title": "format_concept_benchmark_report parameters",
    "description": "format_concept_benchmark_report parameters",
    "page": "api/evaluation.html",
    "section": "format-concept-benchmark-report-parameters"
  },
  {
    "type": "section",
    "title": "format_concept_benchmark_report example",
    "description": "format_concept_benchmark_report example",
    "page": "api/evaluation.html",
    "section": "format-concept-benchmark-report-example"
  },
  {
    "type": "section",
    "title": "format_long_context_results",
    "description": "Create a readable long-context comparison report. Canonical import: from arclm.evaluation import format_long_context_results. Fully qualified name: arclm.evaluation.format_long_context_results. Status: Stable.",
    "page": "api/evaluation.html",
    "section": "format-long-context-results"
  },
  {
    "type": "section",
    "title": "format_long_context_results parameters",
    "description": "format_long_context_results parameters",
    "page": "api/evaluation.html",
    "section": "format-long-context-results-parameters"
  },
  {
    "type": "section",
    "title": "format_long_context_results example",
    "description": "format_long_context_results example",
    "page": "api/evaluation.html",
    "section": "format-long-context-results-example"
  },
  {
    "type": "section",
    "title": "format_tokenizer_coverage_report",
    "description": "Create a readable tokenizer coverage report. Canonical import: from arclm.evaluation import format_tokenizer_coverage_report. Fully qualified name: arclm.evaluation.format_tokenizer_coverage_report. Status: Stable.",
    "page": "api/evaluation.html",
    "section": "format-tokenizer-coverage-report"
  },
  {
    "type": "section",
    "title": "format_tokenizer_coverage_report parameters",
    "description": "format_tokenizer_coverage_report parameters",
    "page": "api/evaluation.html",
    "section": "format-tokenizer-coverage-report-parameters"
  },
  {
    "type": "section",
    "title": "format_tokenizer_coverage_report example",
    "description": "format_tokenizer_coverage_report example",
    "page": "api/evaluation.html",
    "section": "format-tokenizer-coverage-report-example"
  },
  {
    "type": "section",
    "title": "format_top_k_predictions",
    "description": "Create a readable diagnostic report for one prompt. Canonical import: from arclm.evaluation import format_top_k_predictions. Fully qualified name: arclm.evaluation.format_top_k_predictions. Status: Stable.",
    "page": "api/evaluation.html",
    "section": "format-top-k-predictions"
  },
  {
    "type": "section",
    "title": "format_top_k_predictions parameters",
    "description": "format_top_k_predictions parameters",
    "page": "api/evaluation.html",
    "section": "format-top-k-predictions-parameters"
  },
  {
    "type": "section",
    "title": "format_top_k_predictions example",
    "description": "format_top_k_predictions example",
    "page": "api/evaluation.html",
    "section": "format-top-k-predictions-example"
  },
  {
    "type": "section",
    "title": "predict_top_k",
    "description": "Return the top-k next-token probabilities for a prompt. Canonical import: from arclm.evaluation import predict_top_k. Fully qualified name: arclm.evaluation.predict_top_k. Status: Stable.",
    "page": "api/evaluation.html",
    "section": "predict-top-k"
  },
  {
    "type": "section",
    "title": "predict_top_k parameters",
    "description": "predict_top_k parameters",
    "page": "api/evaluation.html",
    "section": "predict-top-k-parameters"
  },
  {
    "type": "section",
    "title": "predict_top_k example",
    "description": "predict_top_k example",
    "page": "api/evaluation.html",
    "section": "predict-top-k-example"
  },
  {
    "type": "section",
    "title": "run_long_context_evaluation",
    "description": "Train and compare multiple block sizes by validation loss and concepts. Canonical import: from arclm.evaluation import run_long_context_evaluation. Fully qualified name: arclm.evaluation.run_long_context_evaluation. Status: Stable.",
    "page": "api/evaluation.html",
    "section": "run-long-context-evaluation"
  },
  {
    "type": "section",
    "title": "run_long_context_evaluation parameters",
    "description": "run_long_context_evaluation parameters",
    "page": "api/evaluation.html",
    "section": "run-long-context-evaluation-parameters"
  },
  {
    "type": "section",
    "title": "run_long_context_evaluation example",
    "description": "run_long_context_evaluation example",
    "page": "api/evaluation.html",
    "section": "run-long-context-evaluation-example"
  },
  {
    "type": "section",
    "title": "score_concept_relationships",
    "description": "Score expected concepts against top-k next-token predictions. Canonical import: from arclm.evaluation import score_concept_relationships. Fully qualified name: arclm.evaluation.score_concept_relationships. Status: Stable.",
    "page": "api/evaluation.html",
    "section": "score-concept-relationships"
  },
  {
    "type": "section",
    "title": "score_concept_relationships parameters",
    "description": "score_concept_relationships parameters",
    "page": "api/evaluation.html",
    "section": "score-concept-relationships-parameters"
  },
  {
    "type": "section",
    "title": "score_concept_relationships example",
    "description": "score_concept_relationships example",
    "page": "api/evaluation.html",
    "section": "score-concept-relationships-example"
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
    "title": "CheckpointTokenizer",
    "description": "Fallback tokenizer reconstructed from checkpoint vocabulary data. Canonical import: from arclm.inference import CheckpointTokenizer. Fully qualified name: arclm.inference.CheckpointTokenizer. Status: Beta.",
    "page": "api/inference.html",
    "section": "checkpointtokenizer"
  },
  {
    "type": "section",
    "title": "CheckpointTokenizer parameters",
    "description": "CheckpointTokenizer parameters",
    "page": "api/inference.html",
    "section": "checkpointtokenizer-parameters"
  },
  {
    "type": "section",
    "title": "CheckpointTokenizer example",
    "description": "CheckpointTokenizer example",
    "page": "api/inference.html",
    "section": "checkpointtokenizer-example"
  },
  {
    "type": "section",
    "title": "ExternalLoadedModel",
    "description": "Loaded model wrapper with a unified inference and save API. Canonical import: from arclm.inference import ExternalLoadedModel. Fully qualified name: arclm.inference.ExternalLoadedModel. Status: Beta.",
    "page": "api/inference.html",
    "section": "externalloadedmodel"
  },
  {
    "type": "section",
    "title": "ExternalLoadedModel parameters",
    "description": "ExternalLoadedModel parameters",
    "page": "api/inference.html",
    "section": "externalloadedmodel-parameters"
  },
  {
    "type": "section",
    "title": "ExternalLoadedModel example",
    "description": "ExternalLoadedModel example",
    "page": "api/inference.html",
    "section": "externalloadedmodel-example"
  },
  {
    "type": "section",
    "title": "ExternalModelConfig",
    "description": "Configuration for loading native or external causal language models. Canonical import: from arclm.inference import ExternalModelConfig. Fully qualified name: arclm.inference.ExternalModelConfig. Status: Beta.",
    "page": "api/inference.html",
    "section": "externalmodelconfig"
  },
  {
    "type": "section",
    "title": "ExternalModelConfig parameters",
    "description": "ExternalModelConfig parameters",
    "page": "api/inference.html",
    "section": "externalmodelconfig-parameters"
  },
  {
    "type": "section",
    "title": "ExternalModelConfig example",
    "description": "ExternalModelConfig example",
    "page": "api/inference.html",
    "section": "externalmodelconfig-example"
  },
  {
    "type": "section",
    "title": "GenerationConfig",
    "description": "Text generation defaults used by :class:`ExternalLoadedModel`. Canonical import: from arclm.inference import GenerationConfig. Fully qualified name: arclm.inference.GenerationConfig. Status: Beta.",
    "page": "api/inference.html",
    "section": "generationconfig"
  },
  {
    "type": "section",
    "title": "GenerationConfig parameters",
    "description": "GenerationConfig parameters",
    "page": "api/inference.html",
    "section": "generationconfig-parameters"
  },
  {
    "type": "section",
    "title": "GenerationConfig example",
    "description": "GenerationConfig example",
    "page": "api/inference.html",
    "section": "generationconfig-example"
  },
  {
    "type": "section",
    "title": "Generator",
    "description": "Generate tokens from a trained native causal language model. Canonical import: from arclm.inference import Generator. Fully qualified name: arclm.inference.Generator. Status: Beta.",
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
    "type": "section",
    "title": "LoadedModel",
    "description": "Loaded model bundle with a minimal prediction method. Canonical import: from arclm.inference import LoadedModel. Fully qualified name: arclm.inference.LoadedModel. Status: Beta.",
    "page": "api/inference.html",
    "section": "loadedmodel"
  },
  {
    "type": "section",
    "title": "LoadedModel parameters",
    "description": "LoadedModel parameters",
    "page": "api/inference.html",
    "section": "loadedmodel-parameters"
  },
  {
    "type": "section",
    "title": "LoadedModel example",
    "description": "LoadedModel example",
    "page": "api/inference.html",
    "section": "loadedmodel-example"
  },
  {
    "type": "section",
    "title": "ModelSaveConfig",
    "description": "Developer-controlled settings for saving or exporting loaded models. Canonical import: from arclm.inference import ModelSaveConfig. Fully qualified name: arclm.inference.ModelSaveConfig. Status: Beta.",
    "page": "api/inference.html",
    "section": "modelsaveconfig"
  },
  {
    "type": "section",
    "title": "ModelSaveConfig parameters",
    "description": "ModelSaveConfig parameters",
    "page": "api/inference.html",
    "section": "modelsaveconfig-parameters"
  },
  {
    "type": "section",
    "title": "ModelSaveConfig example",
    "description": "ModelSaveConfig example",
    "page": "api/inference.html",
    "section": "modelsaveconfig-example"
  },
  {
    "type": "section",
    "title": "ModelSourceInfo",
    "description": "Structured inspection result for a model source. Canonical import: from arclm.inference import ModelSourceInfo. Fully qualified name: arclm.inference.ModelSourceInfo. Status: Beta.",
    "page": "api/inference.html",
    "section": "modelsourceinfo"
  },
  {
    "type": "section",
    "title": "ModelSourceInfo parameters",
    "description": "ModelSourceInfo parameters",
    "page": "api/inference.html",
    "section": "modelsourceinfo-parameters"
  },
  {
    "type": "section",
    "title": "ModelSourceInfo example",
    "description": "ModelSourceInfo example",
    "page": "api/inference.html",
    "section": "modelsourceinfo-example"
  },
  {
    "type": "section",
    "title": "TextGenerator",
    "description": "Generate tokens from a trained native causal language model. Canonical import: from arclm.inference import TextGenerator. Fully qualified name: arclm.inference.TextGenerator. Status: Beta.",
    "page": "api/inference.html",
    "section": "textgenerator"
  },
  {
    "type": "section",
    "title": "TextGenerator parameters",
    "description": "TextGenerator parameters",
    "page": "api/inference.html",
    "section": "textgenerator-parameters"
  },
  {
    "type": "section",
    "title": "TextGenerator example",
    "description": "TextGenerator example",
    "page": "api/inference.html",
    "section": "textgenerator-example"
  },
  {
    "type": "section",
    "title": "DEFAULT_MODEL_PATH",
    "description": "Path subclass for Windows systems. Canonical import: from arclm.inference import DEFAULT_MODEL_PATH. Fully qualified name: arclm.inference.DEFAULT_MODEL_PATH. Status: Beta.",
    "page": "api/inference.html",
    "section": "default-model-path"
  },
  {
    "type": "section",
    "title": "DEFAULT_MODEL_PATH parameters",
    "description": "DEFAULT_MODEL_PATH parameters",
    "page": "api/inference.html",
    "section": "default-model-path-parameters"
  },
  {
    "type": "section",
    "title": "DEFAULT_MODEL_PATH example",
    "description": "DEFAULT_MODEL_PATH example",
    "page": "api/inference.html",
    "section": "default-model-path-example"
  },
  {
    "type": "section",
    "title": "continue_native_training",
    "description": "Continue native ArcLM training via ``train_model``. Canonical import: from arclm.inference import continue_native_training. Fully qualified name: arclm.inference.continue_native_training. Status: Beta.",
    "page": "api/inference.html",
    "section": "continue-native-training"
  },
  {
    "type": "section",
    "title": "continue_native_training parameters",
    "description": "continue_native_training parameters",
    "page": "api/inference.html",
    "section": "continue-native-training-parameters"
  },
  {
    "type": "section",
    "title": "continue_native_training example",
    "description": "continue_native_training example",
    "page": "api/inference.html",
    "section": "continue-native-training-example"
  },
  {
    "type": "section",
    "title": "fine_tune_external_model",
    "description": "Fine-tune an external model through supported ArcLM training backends. Canonical import: from arclm.inference import fine_tune_external_model. Fully qualified name: arclm.inference.fine_tune_external_model. Status: Beta.",
    "page": "api/inference.html",
    "section": "fine-tune-external-model"
  },
  {
    "type": "section",
    "title": "fine_tune_external_model parameters",
    "description": "fine_tune_external_model parameters",
    "page": "api/inference.html",
    "section": "fine-tune-external-model-parameters"
  },
  {
    "type": "section",
    "title": "fine_tune_external_model example",
    "description": "fine_tune_external_model example",
    "page": "api/inference.html",
    "section": "fine-tune-external-model-example"
  },
  {
    "type": "section",
    "title": "fine_tune_native_model",
    "description": "Fine-tune a native ArcLM checkpoint via ``train_model``. Canonical import: from arclm.inference import fine_tune_native_model. Fully qualified name: arclm.inference.fine_tune_native_model. Status: Beta.",
    "page": "api/inference.html",
    "section": "fine-tune-native-model"
  },
  {
    "type": "section",
    "title": "fine_tune_native_model parameters",
    "description": "fine_tune_native_model parameters",
    "page": "api/inference.html",
    "section": "fine-tune-native-model-parameters"
  },
  {
    "type": "section",
    "title": "fine_tune_native_model example",
    "description": "fine_tune_native_model example",
    "page": "api/inference.html",
    "section": "fine-tune-native-model-example"
  },
  {
    "type": "section",
    "title": "inspect_model_source",
    "description": "Inspect a local path or Hugging Face model ID before loading. Canonical import: from arclm.inference import inspect_model_source. Fully qualified name: arclm.inference.inspect_model_source. Status: Beta.",
    "page": "api/inference.html",
    "section": "inspect-model-source"
  },
  {
    "type": "section",
    "title": "inspect_model_source parameters",
    "description": "inspect_model_source parameters",
    "page": "api/inference.html",
    "section": "inspect-model-source-parameters"
  },
  {
    "type": "section",
    "title": "inspect_model_source example",
    "description": "inspect_model_source example",
    "page": "api/inference.html",
    "section": "inspect-model-source-example"
  },
  {
    "type": "section",
    "title": "load_any_model",
    "description": "Load any supported ArcLM or Hugging Face causal LM source for inference. Canonical import: from arclm.inference import load_any_model. Fully qualified name: arclm.inference.load_any_model. Status: Beta.",
    "page": "api/inference.html",
    "section": "load-any-model"
  },
  {
    "type": "section",
    "title": "load_any_model parameters",
    "description": "load_any_model parameters",
    "page": "api/inference.html",
    "section": "load-any-model-parameters"
  },
  {
    "type": "section",
    "title": "load_any_model example",
    "description": "load_any_model example",
    "page": "api/inference.html",
    "section": "load-any-model-example"
  },
  {
    "type": "section",
    "title": "load_external_for_inference",
    "description": "Backward-friendly alias for :func:`load_any_model`. Canonical import: from arclm.inference import load_external_for_inference. Fully qualified name: arclm.inference.load_external_for_inference. Status: Beta.",
    "page": "api/inference.html",
    "section": "load-external-for-inference"
  },
  {
    "type": "section",
    "title": "load_external_for_inference parameters",
    "description": "load_external_for_inference parameters",
    "page": "api/inference.html",
    "section": "load-external-for-inference-parameters"
  },
  {
    "type": "section",
    "title": "load_external_for_inference example",
    "description": "load_external_for_inference example",
    "page": "api/inference.html",
    "section": "load-external-for-inference-example"
  },
  {
    "type": "section",
    "title": "load_model",
    "description": "Load a trained ArcLM checkpoint for inference. Canonical import: from arclm.inference import load_model. Fully qualified name: arclm.inference.load_model. Status: Beta.",
    "page": "api/inference.html",
    "section": "load-model"
  },
  {
    "type": "section",
    "title": "load_model parameters",
    "description": "load_model parameters",
    "page": "api/inference.html",
    "section": "load-model-parameters"
  },
  {
    "type": "section",
    "title": "load_model example",
    "description": "load_model example",
    "page": "api/inference.html",
    "section": "load-model-example"
  },
  {
    "type": "section",
    "title": "predict",
    "description": "Predict with a cached model using the same defaults as load_model(). Canonical import: from arclm.inference import predict. Fully qualified name: arclm.inference.predict. Status: Beta.",
    "page": "api/inference.html",
    "section": "predict"
  },
  {
    "type": "section",
    "title": "predict parameters",
    "description": "predict parameters",
    "page": "api/inference.html",
    "section": "predict-parameters"
  },
  {
    "type": "section",
    "title": "predict example",
    "description": "predict example",
    "page": "api/inference.html",
    "section": "predict-example"
  },
  {
    "type": "section",
    "title": "predict_external",
    "description": "Load a source and return a single prediction. Canonical import: from arclm.inference import predict_external. Fully qualified name: arclm.inference.predict_external. Status: Beta.",
    "page": "api/inference.html",
    "section": "predict-external"
  },
  {
    "type": "section",
    "title": "predict_external parameters",
    "description": "predict_external parameters",
    "page": "api/inference.html",
    "section": "predict-external-parameters"
  },
  {
    "type": "section",
    "title": "predict_external example",
    "description": "predict_external example",
    "page": "api/inference.html",
    "section": "predict-external-example"
  },
  {
    "type": "section",
    "title": "save_loaded_model",
    "description": "Save a loaded model according to :class:`ModelSaveConfig`. Canonical import: from arclm.inference import save_loaded_model. Fully qualified name: arclm.inference.save_loaded_model. Status: Beta.",
    "page": "api/inference.html",
    "section": "save-loaded-model"
  },
  {
    "type": "section",
    "title": "save_loaded_model parameters",
    "description": "save_loaded_model parameters",
    "page": "api/inference.html",
    "section": "save-loaded-model-parameters"
  },
  {
    "type": "section",
    "title": "save_loaded_model example",
    "description": "save_loaded_model example",
    "page": "api/inference.html",
    "section": "save-loaded-model-example"
  },
  {
    "type": "section",
    "title": "train_native_model",
    "description": "Train a native ArcLM model by delegating to ``train_model(mode='pretrain')``. Canonical import: from arclm.inference import train_native_model. Fully qualified name: arclm.inference.train_native_model. Status: Beta.",
    "page": "api/inference.html",
    "section": "train-native-model"
  },
  {
    "type": "section",
    "title": "train_native_model parameters",
    "description": "train_native_model parameters",
    "page": "api/inference.html",
    "section": "train-native-model-parameters"
  },
  {
    "type": "section",
    "title": "train_native_model example",
    "description": "train_native_model example",
    "page": "api/inference.html",
    "section": "train-native-model-example"
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
    "title": "PipelineTrace",
    "description": "JSON-safe summary of one inspected native ArcLM generation step. Canonical import: from arclm.inspection import PipelineTrace. Fully qualified name: arclm.inspection.PipelineTrace. Status: Beta.",
    "page": "api/inspection.html",
    "section": "pipelinetrace"
  },
  {
    "type": "section",
    "title": "PipelineTrace parameters",
    "description": "PipelineTrace parameters",
    "page": "api/inspection.html",
    "section": "pipelinetrace-parameters"
  },
  {
    "type": "section",
    "title": "PipelineTrace example",
    "description": "PipelineTrace example",
    "page": "api/inspection.html",
    "section": "pipelinetrace-example"
  },
  {
    "type": "section",
    "title": "inspect_text",
    "description": "Inspect one native ArcLM text-generation step. Canonical import: from arclm.inspection import inspect_text. Fully qualified name: arclm.inspection.inspect_text. Status: Beta.",
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
    "title": "Agent API",
    "description": "Public agents APIs.",
    "page": "api/agents.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "Overview",
    "description": "Agent API documents the public ArcLM APIs in this category.",
    "page": "api/agents.html",
    "section": "overview"
  },
  {
    "type": "section",
    "title": "Agent",
    "description": "Behavior description for a bounded tool-using agent. Canonical import: from arclm.agents import Agent. Fully qualified name: arclm.agents.Agent. Status: Beta.",
    "page": "api/agents.html",
    "section": "agent"
  },
  {
    "type": "section",
    "title": "Agent parameters",
    "description": "Agent parameters",
    "page": "api/agents.html",
    "section": "agent-parameters"
  },
  {
    "type": "section",
    "title": "Agent example",
    "description": "Agent example",
    "page": "api/agents.html",
    "section": "agent-example"
  },
  {
    "type": "section",
    "title": "AgentCapabilityReport",
    "description": "Honest runtime capability report. Canonical import: from arclm.agents import AgentCapabilityReport. Fully qualified name: arclm.agents.AgentCapabilityReport. Status: Beta.",
    "page": "api/agents.html",
    "section": "agentcapabilityreport"
  },
  {
    "type": "section",
    "title": "AgentCapabilityReport parameters",
    "description": "AgentCapabilityReport parameters",
    "page": "api/agents.html",
    "section": "agentcapabilityreport-parameters"
  },
  {
    "type": "section",
    "title": "AgentCapabilityReport example",
    "description": "AgentCapabilityReport example",
    "page": "api/agents.html",
    "section": "agentcapabilityreport-example"
  },
  {
    "type": "section",
    "title": "AgentConfig",
    "description": "Serializable agent configuration without callables or secrets. Canonical import: from arclm.agents import AgentConfig. Fully qualified name: arclm.agents.AgentConfig. Status: Beta.",
    "page": "api/agents.html",
    "section": "agentconfig"
  },
  {
    "type": "section",
    "title": "AgentConfig parameters",
    "description": "AgentConfig parameters",
    "page": "api/agents.html",
    "section": "agentconfig-parameters"
  },
  {
    "type": "section",
    "title": "AgentConfig example",
    "description": "AgentConfig example",
    "page": "api/agents.html",
    "section": "agentconfig-example"
  },
  {
    "type": "section",
    "title": "AgentMessage",
    "description": "Serializable provider-independent message. Canonical import: from arclm.agents import AgentMessage. Fully qualified name: arclm.agents.AgentMessage. Status: Beta.",
    "page": "api/agents.html",
    "section": "agentmessage"
  },
  {
    "type": "section",
    "title": "AgentMessage parameters",
    "description": "AgentMessage parameters",
    "page": "api/agents.html",
    "section": "agentmessage-parameters"
  },
  {
    "type": "section",
    "title": "AgentMessage example",
    "description": "AgentMessage example",
    "page": "api/agents.html",
    "section": "agentmessage-example"
  },
  {
    "type": "section",
    "title": "AgentModel",
    "description": "Protocol implemented by provider-specific model adapters. Canonical import: from arclm.agents import AgentModel. Fully qualified name: arclm.agents.AgentModel. Status: Beta.",
    "page": "api/agents.html",
    "section": "agentmodel"
  },
  {
    "type": "section",
    "title": "AgentModel parameters",
    "description": "AgentModel parameters",
    "page": "api/agents.html",
    "section": "agentmodel-parameters"
  },
  {
    "type": "section",
    "title": "AgentModel example",
    "description": "AgentModel example",
    "page": "api/agents.html",
    "section": "agentmodel-example"
  },
  {
    "type": "section",
    "title": "AgentResource",
    "description": "Read-only content that can be provided as agent context. Canonical import: from arclm.agents import AgentResource. Fully qualified name: arclm.agents.AgentResource. Status: Beta.",
    "page": "api/agents.html",
    "section": "agentresource"
  },
  {
    "type": "section",
    "title": "AgentResource parameters",
    "description": "AgentResource parameters",
    "page": "api/agents.html",
    "section": "agentresource-parameters"
  },
  {
    "type": "section",
    "title": "AgentResource example",
    "description": "AgentResource example",
    "page": "api/agents.html",
    "section": "agentresource-example"
  },
  {
    "type": "section",
    "title": "AgentRunner",
    "description": "Execute agent behavior with bounded model/tool steps. Canonical import: from arclm.agents import AgentRunner. Fully qualified name: arclm.agents.AgentRunner. Status: Beta.",
    "page": "api/agents.html",
    "section": "agentrunner"
  },
  {
    "type": "section",
    "title": "AgentRunner parameters",
    "description": "AgentRunner parameters",
    "page": "api/agents.html",
    "section": "agentrunner-parameters"
  },
  {
    "type": "section",
    "title": "AgentRunner example",
    "description": "AgentRunner example",
    "page": "api/agents.html",
    "section": "agentrunner-example"
  },
  {
    "type": "section",
    "title": "AgentRunnerConfig",
    "description": "Serializable runner configuration. Canonical import: from arclm.agents import AgentRunnerConfig. Fully qualified name: arclm.agents.AgentRunnerConfig. Status: Beta.",
    "page": "api/agents.html",
    "section": "agentrunnerconfig"
  },
  {
    "type": "section",
    "title": "AgentRunnerConfig parameters",
    "description": "AgentRunnerConfig parameters",
    "page": "api/agents.html",
    "section": "agentrunnerconfig-parameters"
  },
  {
    "type": "section",
    "title": "AgentRunnerConfig example",
    "description": "AgentRunnerConfig example",
    "page": "api/agents.html",
    "section": "agentrunnerconfig-example"
  },
  {
    "type": "section",
    "title": "AgentRunResult",
    "description": "Final outcome of a bounded agent run. Canonical import: from arclm.agents import AgentRunResult. Fully qualified name: arclm.agents.AgentRunResult. Status: Beta.",
    "page": "api/agents.html",
    "section": "agentrunresult"
  },
  {
    "type": "section",
    "title": "AgentRunResult parameters",
    "description": "AgentRunResult parameters",
    "page": "api/agents.html",
    "section": "agentrunresult-parameters"
  },
  {
    "type": "section",
    "title": "AgentRunResult example",
    "description": "AgentRunResult example",
    "page": "api/agents.html",
    "section": "agentrunresult-example"
  },
  {
    "type": "section",
    "title": "AgentSession",
    "description": "Bounded in-memory session state. Canonical import: from arclm.agents import AgentSession. Fully qualified name: arclm.agents.AgentSession. Status: Beta.",
    "page": "api/agents.html",
    "section": "agentsession"
  },
  {
    "type": "section",
    "title": "AgentSession parameters",
    "description": "AgentSession parameters",
    "page": "api/agents.html",
    "section": "agentsession-parameters"
  },
  {
    "type": "section",
    "title": "AgentSession example",
    "description": "AgentSession example",
    "page": "api/agents.html",
    "section": "agentsession-example"
  },
  {
    "type": "section",
    "title": "AgentTrace",
    "description": "Trace for one agent run. Canonical import: from arclm.agents import AgentTrace. Fully qualified name: arclm.agents.AgentTrace. Status: Beta.",
    "page": "api/agents.html",
    "section": "agenttrace"
  },
  {
    "type": "section",
    "title": "AgentTrace parameters",
    "description": "AgentTrace parameters",
    "page": "api/agents.html",
    "section": "agenttrace-parameters"
  },
  {
    "type": "section",
    "title": "AgentTrace example",
    "description": "AgentTrace example",
    "page": "api/agents.html",
    "section": "agenttrace-example"
  },
  {
    "type": "section",
    "title": "AgentTraceEvent",
    "description": "One safe trace event. Canonical import: from arclm.agents import AgentTraceEvent. Fully qualified name: arclm.agents.AgentTraceEvent. Status: Beta.",
    "page": "api/agents.html",
    "section": "agenttraceevent"
  },
  {
    "type": "section",
    "title": "AgentTraceEvent parameters",
    "description": "AgentTraceEvent parameters",
    "page": "api/agents.html",
    "section": "agenttraceevent-parameters"
  },
  {
    "type": "section",
    "title": "AgentTraceEvent example",
    "description": "AgentTraceEvent example",
    "page": "api/agents.html",
    "section": "agenttraceevent-example"
  },
  {
    "type": "section",
    "title": "ApprovalDecision",
    "description": "Decision returned by an approval handler. Canonical import: from arclm.agents import ApprovalDecision. Fully qualified name: arclm.agents.ApprovalDecision. Status: Beta.",
    "page": "api/agents.html",
    "section": "approvaldecision"
  },
  {
    "type": "section",
    "title": "ApprovalDecision parameters",
    "description": "ApprovalDecision parameters",
    "page": "api/agents.html",
    "section": "approvaldecision-parameters"
  },
  {
    "type": "section",
    "title": "ApprovalDecision example",
    "description": "ApprovalDecision example",
    "page": "api/agents.html",
    "section": "approvaldecision-example"
  },
  {
    "type": "section",
    "title": "ArcLMJSONToolAdapter",
    "description": "Small adapter for ArcLM-style generation callables using strict JSON. Canonical import: from arclm.agents import ArcLMJSONToolAdapter. Fully qualified name: arclm.agents.ArcLMJSONToolAdapter. Status: Beta.",
    "page": "api/agents.html",
    "section": "arclmjsontooladapter"
  },
  {
    "type": "section",
    "title": "ArcLMJSONToolAdapter parameters",
    "description": "ArcLMJSONToolAdapter parameters",
    "page": "api/agents.html",
    "section": "arclmjsontooladapter-parameters"
  },
  {
    "type": "section",
    "title": "ArcLMJSONToolAdapter example",
    "description": "ArcLMJSONToolAdapter example",
    "page": "api/agents.html",
    "section": "arclmjsontooladapter-example"
  },
  {
    "type": "section",
    "title": "AutoApprovalHandler",
    "description": "Simple handler for tests and trusted local demos. Canonical import: from arclm.agents import AutoApprovalHandler. Fully qualified name: arclm.agents.AutoApprovalHandler. Status: Beta.",
    "page": "api/agents.html",
    "section": "autoapprovalhandler"
  },
  {
    "type": "section",
    "title": "AutoApprovalHandler parameters",
    "description": "AutoApprovalHandler parameters",
    "page": "api/agents.html",
    "section": "autoapprovalhandler-parameters"
  },
  {
    "type": "section",
    "title": "AutoApprovalHandler example",
    "description": "AutoApprovalHandler example",
    "page": "api/agents.html",
    "section": "autoapprovalhandler-example"
  },
  {
    "type": "section",
    "title": "CallableModelAdapter",
    "description": "Adapter around a developer-supplied callable. Canonical import: from arclm.agents import CallableModelAdapter. Fully qualified name: arclm.agents.CallableModelAdapter. Status: Beta.",
    "page": "api/agents.html",
    "section": "callablemodeladapter"
  },
  {
    "type": "section",
    "title": "CallableModelAdapter parameters",
    "description": "CallableModelAdapter parameters",
    "page": "api/agents.html",
    "section": "callablemodeladapter-parameters"
  },
  {
    "type": "section",
    "title": "CallableModelAdapter example",
    "description": "CallableModelAdapter example",
    "page": "api/agents.html",
    "section": "callablemodeladapter-example"
  },
  {
    "type": "section",
    "title": "CapabilityStatus",
    "description": "Agent capability status. Canonical import: from arclm.agents import CapabilityStatus. Fully qualified name: arclm.agents.CapabilityStatus. Status: Beta.",
    "page": "api/agents.html",
    "section": "capabilitystatus"
  },
  {
    "type": "section",
    "title": "CapabilityStatus parameters",
    "description": "CapabilityStatus parameters",
    "page": "api/agents.html",
    "section": "capabilitystatus-parameters"
  },
  {
    "type": "section",
    "title": "CapabilityStatus example",
    "description": "CapabilityStatus example",
    "page": "api/agents.html",
    "section": "capabilitystatus-example"
  },
  {
    "type": "section",
    "title": "DenyApprovalHandler",
    "description": "Default handler that denies requests requiring approval. Canonical import: from arclm.agents import DenyApprovalHandler. Fully qualified name: arclm.agents.DenyApprovalHandler. Status: Beta.",
    "page": "api/agents.html",
    "section": "denyapprovalhandler"
  },
  {
    "type": "section",
    "title": "DenyApprovalHandler parameters",
    "description": "DenyApprovalHandler parameters",
    "page": "api/agents.html",
    "section": "denyapprovalhandler-parameters"
  },
  {
    "type": "section",
    "title": "DenyApprovalHandler example",
    "description": "DenyApprovalHandler example",
    "page": "api/agents.html",
    "section": "denyapprovalhandler-example"
  },
  {
    "type": "section",
    "title": "DocumentToolConfig",
    "description": "Serializable document-tool limits. Canonical import: from arclm.agents import DocumentToolConfig. Fully qualified name: arclm.agents.DocumentToolConfig. Status: Beta.",
    "page": "api/agents.html",
    "section": "documenttoolconfig"
  },
  {
    "type": "section",
    "title": "DocumentToolConfig parameters",
    "description": "DocumentToolConfig parameters",
    "page": "api/agents.html",
    "section": "documenttoolconfig-parameters"
  },
  {
    "type": "section",
    "title": "DocumentToolConfig example",
    "description": "DocumentToolConfig example",
    "page": "api/agents.html",
    "section": "documenttoolconfig-example"
  },
  {
    "type": "section",
    "title": "FakeSpeechToTextBackend",
    "description": "Deterministic backend for tests and examples. Canonical import: from arclm.agents import FakeSpeechToTextBackend. Fully qualified name: arclm.agents.FakeSpeechToTextBackend. Status: Beta.",
    "page": "api/agents.html",
    "section": "fakespeechtotextbackend"
  },
  {
    "type": "section",
    "title": "FakeSpeechToTextBackend parameters",
    "description": "FakeSpeechToTextBackend parameters",
    "page": "api/agents.html",
    "section": "fakespeechtotextbackend-parameters"
  },
  {
    "type": "section",
    "title": "FakeSpeechToTextBackend example",
    "description": "FakeSpeechToTextBackend example",
    "page": "api/agents.html",
    "section": "fakespeechtotextbackend-example"
  },
  {
    "type": "section",
    "title": "FinalResponse",
    "description": "Response returned by an agent model adapter. Canonical import: from arclm.agents import FinalResponse. Fully qualified name: arclm.agents.FinalResponse. Status: Beta.",
    "page": "api/agents.html",
    "section": "finalresponse"
  },
  {
    "type": "section",
    "title": "FinalResponse parameters",
    "description": "FinalResponse parameters",
    "page": "api/agents.html",
    "section": "finalresponse-parameters"
  },
  {
    "type": "section",
    "title": "FinalResponse example",
    "description": "FinalResponse example",
    "page": "api/agents.html",
    "section": "finalresponse-example"
  },
  {
    "type": "section",
    "title": "InMemoryResourceProvider",
    "description": "Minimal in-memory resource provider. Canonical import: from arclm.agents import InMemoryResourceProvider. Fully qualified name: arclm.agents.InMemoryResourceProvider. Status: Beta.",
    "page": "api/agents.html",
    "section": "inmemoryresourceprovider"
  },
  {
    "type": "section",
    "title": "InMemoryResourceProvider parameters",
    "description": "InMemoryResourceProvider parameters",
    "page": "api/agents.html",
    "section": "inmemoryresourceprovider-parameters"
  },
  {
    "type": "section",
    "title": "InMemoryResourceProvider example",
    "description": "InMemoryResourceProvider example",
    "page": "api/agents.html",
    "section": "inmemoryresourceprovider-example"
  },
  {
    "type": "section",
    "title": "JSONToolCallingAdapter",
    "description": "Strict JSON protocol adapter for plain generation callables. Canonical import: from arclm.agents import JSONToolCallingAdapter. Fully qualified name: arclm.agents.JSONToolCallingAdapter. Status: Beta.",
    "page": "api/agents.html",
    "section": "jsontoolcallingadapter"
  },
  {
    "type": "section",
    "title": "JSONToolCallingAdapter parameters",
    "description": "JSONToolCallingAdapter parameters",
    "page": "api/agents.html",
    "section": "jsontoolcallingadapter-parameters"
  },
  {
    "type": "section",
    "title": "JSONToolCallingAdapter example",
    "description": "JSONToolCallingAdapter example",
    "page": "api/agents.html",
    "section": "jsontoolcallingadapter-example"
  },
  {
    "type": "section",
    "title": "ModelResponse",
    "description": "Response returned by an agent model adapter. Canonical import: from arclm.agents import ModelResponse. Fully qualified name: arclm.agents.ModelResponse. Status: Beta.",
    "page": "api/agents.html",
    "section": "modelresponse"
  },
  {
    "type": "section",
    "title": "ModelResponse parameters",
    "description": "ModelResponse parameters",
    "page": "api/agents.html",
    "section": "modelresponse-parameters"
  },
  {
    "type": "section",
    "title": "ModelResponse example",
    "description": "ModelResponse example",
    "page": "api/agents.html",
    "section": "modelresponse-example"
  },
  {
    "type": "section",
    "title": "ResourceProvider",
    "description": "Protocol for read-only resource providers. Canonical import: from arclm.agents import ResourceProvider. Fully qualified name: arclm.agents.ResourceProvider. Status: Beta.",
    "page": "api/agents.html",
    "section": "resourceprovider"
  },
  {
    "type": "section",
    "title": "ResourceProvider parameters",
    "description": "ResourceProvider parameters",
    "page": "api/agents.html",
    "section": "resourceprovider-parameters"
  },
  {
    "type": "section",
    "title": "ResourceProvider example",
    "description": "ResourceProvider example",
    "page": "api/agents.html",
    "section": "resourceprovider-example"
  },
  {
    "type": "section",
    "title": "SessionConfig",
    "description": "Serializable session configuration. Canonical import: from arclm.agents import SessionConfig. Fully qualified name: arclm.agents.SessionConfig. Status: Beta.",
    "page": "api/agents.html",
    "section": "sessionconfig"
  },
  {
    "type": "section",
    "title": "SessionConfig parameters",
    "description": "SessionConfig parameters",
    "page": "api/agents.html",
    "section": "sessionconfig-parameters"
  },
  {
    "type": "section",
    "title": "SessionConfig example",
    "description": "SessionConfig example",
    "page": "api/agents.html",
    "section": "sessionconfig-example"
  },
  {
    "type": "section",
    "title": "SideEffectLevel",
    "description": "Declared side-effect level for a tool. Canonical import: from arclm.agents import SideEffectLevel. Fully qualified name: arclm.agents.SideEffectLevel. Status: Beta.",
    "page": "api/agents.html",
    "section": "sideeffectlevel"
  },
  {
    "type": "section",
    "title": "SideEffectLevel parameters",
    "description": "SideEffectLevel parameters",
    "page": "api/agents.html",
    "section": "sideeffectlevel-parameters"
  },
  {
    "type": "section",
    "title": "SideEffectLevel example",
    "description": "SideEffectLevel example",
    "page": "api/agents.html",
    "section": "sideeffectlevel-example"
  },
  {
    "type": "section",
    "title": "SpeechToTextBackend",
    "description": "Protocol for speech-to-text backends. Canonical import: from arclm.agents import SpeechToTextBackend. Fully qualified name: arclm.agents.SpeechToTextBackend. Status: Beta.",
    "page": "api/agents.html",
    "section": "speechtotextbackend"
  },
  {
    "type": "section",
    "title": "SpeechToTextBackend parameters",
    "description": "SpeechToTextBackend parameters",
    "page": "api/agents.html",
    "section": "speechtotextbackend-parameters"
  },
  {
    "type": "section",
    "title": "SpeechToTextBackend example",
    "description": "SpeechToTextBackend example",
    "page": "api/agents.html",
    "section": "speechtotextbackend-example"
  },
  {
    "type": "section",
    "title": "Tool",
    "description": "Callable tool with strict schema validation and structured results. Canonical import: from arclm.agents import Tool. Fully qualified name: arclm.agents.Tool. Status: Beta.",
    "page": "api/agents.html",
    "section": "tool"
  },
  {
    "type": "section",
    "title": "Tool parameters",
    "description": "Tool parameters",
    "page": "api/agents.html",
    "section": "tool-parameters"
  },
  {
    "type": "section",
    "title": "Tool example",
    "description": "Tool example",
    "page": "api/agents.html",
    "section": "tool-example"
  },
  {
    "type": "section",
    "title": "ToolApprovalHandler",
    "description": "Protocol for human or application approval handlers. Canonical import: from arclm.agents import ToolApprovalHandler. Fully qualified name: arclm.agents.ToolApprovalHandler. Status: Beta.",
    "page": "api/agents.html",
    "section": "toolapprovalhandler"
  },
  {
    "type": "section",
    "title": "ToolApprovalHandler parameters",
    "description": "ToolApprovalHandler parameters",
    "page": "api/agents.html",
    "section": "toolapprovalhandler-parameters"
  },
  {
    "type": "section",
    "title": "ToolApprovalHandler example",
    "description": "ToolApprovalHandler example",
    "page": "api/agents.html",
    "section": "toolapprovalhandler-example"
  },
  {
    "type": "section",
    "title": "ToolApprovalRequest",
    "description": "Safe approval request metadata. Canonical import: from arclm.agents import ToolApprovalRequest. Fully qualified name: arclm.agents.ToolApprovalRequest. Status: Beta.",
    "page": "api/agents.html",
    "section": "toolapprovalrequest"
  },
  {
    "type": "section",
    "title": "ToolApprovalRequest parameters",
    "description": "ToolApprovalRequest parameters",
    "page": "api/agents.html",
    "section": "toolapprovalrequest-parameters"
  },
  {
    "type": "section",
    "title": "ToolApprovalRequest example",
    "description": "ToolApprovalRequest example",
    "page": "api/agents.html",
    "section": "toolapprovalrequest-example"
  },
  {
    "type": "section",
    "title": "ToolCall",
    "description": "Provider-independent request to invoke a tool. Canonical import: from arclm.agents import ToolCall. Fully qualified name: arclm.agents.ToolCall. Status: Beta.",
    "page": "api/agents.html",
    "section": "toolcall"
  },
  {
    "type": "section",
    "title": "ToolCall parameters",
    "description": "ToolCall parameters",
    "page": "api/agents.html",
    "section": "toolcall-parameters"
  },
  {
    "type": "section",
    "title": "ToolCall example",
    "description": "ToolCall example",
    "page": "api/agents.html",
    "section": "toolcall-example"
  },
  {
    "type": "section",
    "title": "ToolCollection",
    "description": "Reusable named group of tools. Canonical import: from arclm.agents import ToolCollection. Fully qualified name: arclm.agents.ToolCollection. Status: Beta.",
    "page": "api/agents.html",
    "section": "toolcollection"
  },
  {
    "type": "section",
    "title": "ToolCollection parameters",
    "description": "ToolCollection parameters",
    "page": "api/agents.html",
    "section": "toolcollection-parameters"
  },
  {
    "type": "section",
    "title": "ToolCollection example",
    "description": "ToolCollection example",
    "page": "api/agents.html",
    "section": "toolcollection-example"
  },
  {
    "type": "section",
    "title": "ToolContext",
    "description": "Bounded context for one tool invocation. Canonical import: from arclm.agents import ToolContext. Fully qualified name: arclm.agents.ToolContext. Status: Beta.",
    "page": "api/agents.html",
    "section": "toolcontext"
  },
  {
    "type": "section",
    "title": "ToolContext parameters",
    "description": "ToolContext parameters",
    "page": "api/agents.html",
    "section": "toolcontext-parameters"
  },
  {
    "type": "section",
    "title": "ToolContext example",
    "description": "ToolContext example",
    "page": "api/agents.html",
    "section": "toolcontext-example"
  },
  {
    "type": "section",
    "title": "ToolPermission",
    "description": "Permission categories a tool may request. Canonical import: from arclm.agents import ToolPermission. Fully qualified name: arclm.agents.ToolPermission. Status: Beta.",
    "page": "api/agents.html",
    "section": "toolpermission"
  },
  {
    "type": "section",
    "title": "ToolPermission parameters",
    "description": "ToolPermission parameters",
    "page": "api/agents.html",
    "section": "toolpermission-parameters"
  },
  {
    "type": "section",
    "title": "ToolPermission example",
    "description": "ToolPermission example",
    "page": "api/agents.html",
    "section": "toolpermission-example"
  },
  {
    "type": "section",
    "title": "ToolPolicy",
    "description": "Runtime policy controlling which tools may run. Canonical import: from arclm.agents import ToolPolicy. Fully qualified name: arclm.agents.ToolPolicy. Status: Beta.",
    "page": "api/agents.html",
    "section": "toolpolicy"
  },
  {
    "type": "section",
    "title": "ToolPolicy parameters",
    "description": "ToolPolicy parameters",
    "page": "api/agents.html",
    "section": "toolpolicy-parameters"
  },
  {
    "type": "section",
    "title": "ToolPolicy example",
    "description": "ToolPolicy example",
    "page": "api/agents.html",
    "section": "toolpolicy-example"
  },
  {
    "type": "section",
    "title": "ToolRegistry",
    "description": "Deterministic registry for agent tools. Canonical import: from arclm.agents import ToolRegistry. Fully qualified name: arclm.agents.ToolRegistry. Status: Beta.",
    "page": "api/agents.html",
    "section": "toolregistry"
  },
  {
    "type": "section",
    "title": "ToolRegistry parameters",
    "description": "ToolRegistry parameters",
    "page": "api/agents.html",
    "section": "toolregistry-parameters"
  },
  {
    "type": "section",
    "title": "ToolRegistry example",
    "description": "ToolRegistry example",
    "page": "api/agents.html",
    "section": "toolregistry-example"
  },
  {
    "type": "section",
    "title": "ToolResult",
    "description": "Structured tool invocation result. Canonical import: from arclm.agents import ToolResult. Fully qualified name: arclm.agents.ToolResult. Status: Beta.",
    "page": "api/agents.html",
    "section": "toolresult"
  },
  {
    "type": "section",
    "title": "ToolResult parameters",
    "description": "ToolResult parameters",
    "page": "api/agents.html",
    "section": "toolresult-parameters"
  },
  {
    "type": "section",
    "title": "ToolResult example",
    "description": "ToolResult example",
    "page": "api/agents.html",
    "section": "toolresult-example"
  },
  {
    "type": "section",
    "title": "ToolSpec",
    "description": "Serializable metadata describing a tool. Canonical import: from arclm.agents import ToolSpec. Fully qualified name: arclm.agents.ToolSpec. Status: Beta.",
    "page": "api/agents.html",
    "section": "toolspec"
  },
  {
    "type": "section",
    "title": "ToolSpec parameters",
    "description": "ToolSpec parameters",
    "page": "api/agents.html",
    "section": "toolspec-parameters"
  },
  {
    "type": "section",
    "title": "ToolSpec example",
    "description": "ToolSpec example",
    "page": "api/agents.html",
    "section": "toolspec-example"
  },
  {
    "type": "section",
    "title": "TraceConfig",
    "description": "Serializable trace configuration. Canonical import: from arclm.agents import TraceConfig. Fully qualified name: arclm.agents.TraceConfig. Status: Beta.",
    "page": "api/agents.html",
    "section": "traceconfig"
  },
  {
    "type": "section",
    "title": "TraceConfig parameters",
    "description": "TraceConfig parameters",
    "page": "api/agents.html",
    "section": "traceconfig-parameters"
  },
  {
    "type": "section",
    "title": "TraceConfig example",
    "description": "TraceConfig example",
    "page": "api/agents.html",
    "section": "traceconfig-example"
  },
  {
    "type": "section",
    "title": "TranscriptionRequest",
    "description": "Speech-to-text request. Canonical import: from arclm.agents import TranscriptionRequest. Fully qualified name: arclm.agents.TranscriptionRequest. Status: Beta.",
    "page": "api/agents.html",
    "section": "transcriptionrequest"
  },
  {
    "type": "section",
    "title": "TranscriptionRequest parameters",
    "description": "TranscriptionRequest parameters",
    "page": "api/agents.html",
    "section": "transcriptionrequest-parameters"
  },
  {
    "type": "section",
    "title": "TranscriptionRequest example",
    "description": "TranscriptionRequest example",
    "page": "api/agents.html",
    "section": "transcriptionrequest-example"
  },
  {
    "type": "section",
    "title": "TranscriptionResult",
    "description": "Structured speech-to-text result. Canonical import: from arclm.agents import TranscriptionResult. Fully qualified name: arclm.agents.TranscriptionResult. Status: Beta.",
    "page": "api/agents.html",
    "section": "transcriptionresult"
  },
  {
    "type": "section",
    "title": "TranscriptionResult parameters",
    "description": "TranscriptionResult parameters",
    "page": "api/agents.html",
    "section": "transcriptionresult-parameters"
  },
  {
    "type": "section",
    "title": "TranscriptionResult example",
    "description": "TranscriptionResult example",
    "page": "api/agents.html",
    "section": "transcriptionresult-example"
  },
  {
    "type": "section",
    "title": "WebToolConfig",
    "description": "Serializable web-tool limits. Canonical import: from arclm.agents import WebToolConfig. Fully qualified name: arclm.agents.WebToolConfig. Status: Beta.",
    "page": "api/agents.html",
    "section": "webtoolconfig"
  },
  {
    "type": "section",
    "title": "WebToolConfig parameters",
    "description": "WebToolConfig parameters",
    "page": "api/agents.html",
    "section": "webtoolconfig-parameters"
  },
  {
    "type": "section",
    "title": "WebToolConfig example",
    "description": "WebToolConfig example",
    "page": "api/agents.html",
    "section": "webtoolconfig-example"
  },
  {
    "type": "section",
    "title": "AgentRuntimeError",
    "description": "Base error for the ArcLM Agent Runtime. Canonical import: from arclm.agents import AgentRuntimeError. Fully qualified name: arclm.agents.AgentRuntimeError. Status: Beta.",
    "page": "api/agents.html",
    "section": "agentruntimeerror"
  },
  {
    "type": "section",
    "title": "AgentRuntimeError parameters",
    "description": "AgentRuntimeError parameters",
    "page": "api/agents.html",
    "section": "agentruntimeerror-parameters"
  },
  {
    "type": "section",
    "title": "AgentRuntimeError example",
    "description": "AgentRuntimeError example",
    "page": "api/agents.html",
    "section": "agentruntimeerror-example"
  },
  {
    "type": "section",
    "title": "OptionalAgentDependencyError",
    "description": "Raised when an optional agent integration dependency is unavailable. Canonical import: from arclm.agents import OptionalAgentDependencyError. Fully qualified name: arclm.agents.OptionalAgentDependencyError. Status: Beta.",
    "page": "api/agents.html",
    "section": "optionalagentdependencyerror"
  },
  {
    "type": "section",
    "title": "OptionalAgentDependencyError parameters",
    "description": "OptionalAgentDependencyError parameters",
    "page": "api/agents.html",
    "section": "optionalagentdependencyerror-parameters"
  },
  {
    "type": "section",
    "title": "OptionalAgentDependencyError example",
    "description": "OptionalAgentDependencyError example",
    "page": "api/agents.html",
    "section": "optionalagentdependencyerror-example"
  },
  {
    "type": "section",
    "title": "ToolError",
    "description": "Raised when a tool cannot be built, validated, or executed. Canonical import: from arclm.agents import ToolError. Fully qualified name: arclm.agents.ToolError. Status: Beta.",
    "page": "api/agents.html",
    "section": "toolerror"
  },
  {
    "type": "section",
    "title": "ToolError parameters",
    "description": "ToolError parameters",
    "page": "api/agents.html",
    "section": "toolerror-parameters"
  },
  {
    "type": "section",
    "title": "ToolError example",
    "description": "ToolError example",
    "page": "api/agents.html",
    "section": "toolerror-example"
  },
  {
    "type": "section",
    "title": "ToolSchemaError",
    "description": "Raised when a callable cannot be represented as a safe tool schema. Canonical import: from arclm.agents import ToolSchemaError. Fully qualified name: arclm.agents.ToolSchemaError. Status: Beta.",
    "page": "api/agents.html",
    "section": "toolschemaerror"
  },
  {
    "type": "section",
    "title": "ToolSchemaError parameters",
    "description": "ToolSchemaError parameters",
    "page": "api/agents.html",
    "section": "toolschemaerror-parameters"
  },
  {
    "type": "section",
    "title": "ToolSchemaError example",
    "description": "ToolSchemaError example",
    "page": "api/agents.html",
    "section": "toolschemaerror-example"
  },
  {
    "type": "section",
    "title": "ToolValidationError",
    "description": "Raised when model-provided tool arguments fail validation. Canonical import: from arclm.agents import ToolValidationError. Fully qualified name: arclm.agents.ToolValidationError. Status: Beta.",
    "page": "api/agents.html",
    "section": "toolvalidationerror"
  },
  {
    "type": "section",
    "title": "ToolValidationError parameters",
    "description": "ToolValidationError parameters",
    "page": "api/agents.html",
    "section": "toolvalidationerror-parameters"
  },
  {
    "type": "section",
    "title": "ToolValidationError example",
    "description": "ToolValidationError example",
    "page": "api/agents.html",
    "section": "toolvalidationerror-example"
  },
  {
    "type": "section",
    "title": "get_agent_capabilities",
    "description": "Return the base Agent Runtime capability report. Canonical import: from arclm.agents import get_agent_capabilities. Fully qualified name: arclm.agents.get_agent_capabilities. Status: Beta.",
    "page": "api/agents.html",
    "section": "get-agent-capabilities"
  },
  {
    "type": "section",
    "title": "get_agent_capabilities parameters",
    "description": "get_agent_capabilities parameters",
    "page": "api/agents.html",
    "section": "get-agent-capabilities-parameters"
  },
  {
    "type": "section",
    "title": "get_agent_capabilities example",
    "description": "get_agent_capabilities example",
    "page": "api/agents.html",
    "section": "get-agent-capabilities-example"
  },
  {
    "type": "section",
    "title": "tool",
    "description": "Decorator that exposes a typed Python function as a Tool. Canonical import: from arclm.agents import tool. Fully qualified name: arclm.agents.tool. Status: Beta.",
    "page": "api/agents.html",
    "section": "tool"
  },
  {
    "type": "section",
    "title": "tool parameters",
    "description": "tool parameters",
    "page": "api/agents.html",
    "section": "tool-parameters"
  },
  {
    "type": "section",
    "title": "tool example",
    "description": "tool example",
    "page": "api/agents.html",
    "section": "tool-example"
  },
  {
    "type": "page",
    "title": "Security API",
    "description": "Public security APIs.",
    "page": "api/security.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "Overview",
    "description": "Security API documents the public ArcLM APIs in this category.",
    "page": "api/security.html",
    "section": "overview"
  },
  {
    "type": "section",
    "title": "EncryptedEnvelope",
    "description": "JSON-safe authenticated encryption envelope. Canonical import: from arclm.security import EncryptedEnvelope. Fully qualified name: arclm.security.EncryptedEnvelope. Status: Beta.",
    "page": "api/security.html",
    "section": "encryptedenvelope"
  },
  {
    "type": "section",
    "title": "EncryptedEnvelope parameters",
    "description": "EncryptedEnvelope parameters",
    "page": "api/security.html",
    "section": "encryptedenvelope-parameters"
  },
  {
    "type": "section",
    "title": "EncryptedEnvelope example",
    "description": "EncryptedEnvelope example",
    "page": "api/security.html",
    "section": "encryptedenvelope-example"
  },
  {
    "type": "section",
    "title": "InMemorySecurityAuditLog",
    "description": "Small local audit sink for tests and local applications. Canonical import: from arclm.security import InMemorySecurityAuditLog. Fully qualified name: arclm.security.InMemorySecurityAuditLog. Status: Beta.",
    "page": "api/security.html",
    "section": "inmemorysecurityauditlog"
  },
  {
    "type": "section",
    "title": "InMemorySecurityAuditLog parameters",
    "description": "InMemorySecurityAuditLog parameters",
    "page": "api/security.html",
    "section": "inmemorysecurityauditlog-parameters"
  },
  {
    "type": "section",
    "title": "InMemorySecurityAuditLog example",
    "description": "InMemorySecurityAuditLog example",
    "page": "api/security.html",
    "section": "inmemorysecurityauditlog-example"
  },
  {
    "type": "section",
    "title": "LegacyArtifactPolicy",
    "description": "Compatibility policy for existing plaintext artifacts. Canonical import: from arclm.security import LegacyArtifactPolicy. Fully qualified name: arclm.security.LegacyArtifactPolicy. Status: Beta.",
    "page": "api/security.html",
    "section": "legacyartifactpolicy"
  },
  {
    "type": "section",
    "title": "LegacyArtifactPolicy parameters",
    "description": "LegacyArtifactPolicy parameters",
    "page": "api/security.html",
    "section": "legacyartifactpolicy-parameters"
  },
  {
    "type": "section",
    "title": "LegacyArtifactPolicy example",
    "description": "LegacyArtifactPolicy example",
    "page": "api/security.html",
    "section": "legacyartifactpolicy-example"
  },
  {
    "type": "section",
    "title": "PasswordKDFConfig",
    "description": "Bounded Argon2id configuration. Canonical import: from arclm.security import PasswordKDFConfig. Fully qualified name: arclm.security.PasswordKDFConfig. Status: Beta.",
    "page": "api/security.html",
    "section": "passwordkdfconfig"
  },
  {
    "type": "section",
    "title": "PasswordKDFConfig parameters",
    "description": "PasswordKDFConfig parameters",
    "page": "api/security.html",
    "section": "passwordkdfconfig-parameters"
  },
  {
    "type": "section",
    "title": "PasswordKDFConfig example",
    "description": "PasswordKDFConfig example",
    "page": "api/security.html",
    "section": "passwordkdfconfig-example"
  },
  {
    "type": "section",
    "title": "SecurityAuditEvent",
    "description": "SecurityAuditEvent(event_type: 'str', timestamp: 'float', event_id: 'str' = <factory>, actor: 'str | None' = None, artifact_type: 'str | None' = None, result: 'str' = 'ok', metadata: 'dict[str, Any]' = <factory>) Canonical import: from arclm.security import SecurityAuditEvent. Fully qualified name: arclm.security.SecurityAuditEvent. Status: Beta.",
    "page": "api/security.html",
    "section": "securityauditevent"
  },
  {
    "type": "section",
    "title": "SecurityAuditEvent parameters",
    "description": "SecurityAuditEvent parameters",
    "page": "api/security.html",
    "section": "securityauditevent-parameters"
  },
  {
    "type": "section",
    "title": "SecurityAuditEvent example",
    "description": "SecurityAuditEvent example",
    "page": "api/security.html",
    "section": "securityauditevent-example"
  },
  {
    "type": "section",
    "title": "SecurityCapabilities",
    "description": "Safe security capability report. Canonical import: from arclm.security import SecurityCapabilities. Fully qualified name: arclm.security.SecurityCapabilities. Status: Beta.",
    "page": "api/security.html",
    "section": "securitycapabilities"
  },
  {
    "type": "section",
    "title": "SecurityCapabilities parameters",
    "description": "SecurityCapabilities parameters",
    "page": "api/security.html",
    "section": "securitycapabilities-parameters"
  },
  {
    "type": "section",
    "title": "SecurityCapabilities example",
    "description": "SecurityCapabilities example",
    "page": "api/security.html",
    "section": "securitycapabilities-example"
  },
  {
    "type": "section",
    "title": "SecurityCapabilityStatus",
    "description": "Security capability status. Canonical import: from arclm.security import SecurityCapabilityStatus. Fully qualified name: arclm.security.SecurityCapabilityStatus. Status: Beta.",
    "page": "api/security.html",
    "section": "securitycapabilitystatus"
  },
  {
    "type": "section",
    "title": "SecurityCapabilityStatus parameters",
    "description": "SecurityCapabilityStatus parameters",
    "page": "api/security.html",
    "section": "securitycapabilitystatus-parameters"
  },
  {
    "type": "section",
    "title": "SecurityCapabilityStatus example",
    "description": "SecurityCapabilityStatus example",
    "page": "api/security.html",
    "section": "securitycapabilitystatus-example"
  },
  {
    "type": "section",
    "title": "SecurityInventoryItem",
    "description": "SecurityInventoryItem(asset: 'str', location: 'str', sensitivity: 'str', current_protection: 'str', threats: 'tuple[str, ...]', required_protection: 'str', owner_subsystem: 'str', migration_requirement: 'str') Canonical import: from arclm.security import SecurityInventoryItem. Fully qualified name: arclm.security.SecurityInventoryItem. Status: Beta.",
    "page": "api/security.html",
    "section": "securityinventoryitem"
  },
  {
    "type": "section",
    "title": "SecurityInventoryItem parameters",
    "description": "SecurityInventoryItem parameters",
    "page": "api/security.html",
    "section": "securityinventoryitem-parameters"
  },
  {
    "type": "section",
    "title": "SecurityInventoryItem example",
    "description": "SecurityInventoryItem example",
    "page": "api/security.html",
    "section": "securityinventoryitem-example"
  },
  {
    "type": "section",
    "title": "SecurityMode",
    "description": "ArcLM security operating mode. Canonical import: from arclm.security import SecurityMode. Fully qualified name: arclm.security.SecurityMode. Status: Beta.",
    "page": "api/security.html",
    "section": "securitymode"
  },
  {
    "type": "section",
    "title": "SecurityMode parameters",
    "description": "SecurityMode parameters",
    "page": "api/security.html",
    "section": "securitymode-parameters"
  },
  {
    "type": "section",
    "title": "SecurityMode example",
    "description": "SecurityMode example",
    "page": "api/security.html",
    "section": "securitymode-example"
  },
  {
    "type": "section",
    "title": "SecurityPolicy",
    "description": "Framework-wide security policy. Canonical import: from arclm.security import SecurityPolicy. Fully qualified name: arclm.security.SecurityPolicy. Status: Beta.",
    "page": "api/security.html",
    "section": "securitypolicy"
  },
  {
    "type": "section",
    "title": "SecurityPolicy parameters",
    "description": "SecurityPolicy parameters",
    "page": "api/security.html",
    "section": "securitypolicy-parameters"
  },
  {
    "type": "section",
    "title": "SecurityPolicy example",
    "description": "SecurityPolicy example",
    "page": "api/security.html",
    "section": "securitypolicy-example"
  },
  {
    "type": "section",
    "title": "ThreatModelItem",
    "description": "ThreatModelItem(threat: 'str', affected_assets: 'tuple[str, ...]', entry_point: 'str', likelihood: 'str', impact: 'str', mitigation: 'str', remaining_risk: 'str', required_tests: 'tuple[str, ...]') Canonical import: from arclm.security import ThreatModelItem. Fully qualified name: arclm.security.ThreatModelItem. Status: Beta.",
    "page": "api/security.html",
    "section": "threatmodelitem"
  },
  {
    "type": "section",
    "title": "ThreatModelItem parameters",
    "description": "ThreatModelItem parameters",
    "page": "api/security.html",
    "section": "threatmodelitem-parameters"
  },
  {
    "type": "section",
    "title": "ThreatModelItem example",
    "description": "ThreatModelItem example",
    "page": "api/security.html",
    "section": "threatmodelitem-example"
  },
  {
    "type": "section",
    "title": "DecryptionError",
    "description": "Raised when decryption or authentication fails. Canonical import: from arclm.security import DecryptionError. Fully qualified name: arclm.security.DecryptionError. Status: Beta.",
    "page": "api/security.html",
    "section": "decryptionerror"
  },
  {
    "type": "section",
    "title": "DecryptionError parameters",
    "description": "DecryptionError parameters",
    "page": "api/security.html",
    "section": "decryptionerror-parameters"
  },
  {
    "type": "section",
    "title": "DecryptionError example",
    "description": "DecryptionError example",
    "page": "api/security.html",
    "section": "decryptionerror-example"
  },
  {
    "type": "section",
    "title": "EncryptionError",
    "description": "Raised when encryption cannot complete safely. Canonical import: from arclm.security import EncryptionError. Fully qualified name: arclm.security.EncryptionError. Status: Beta.",
    "page": "api/security.html",
    "section": "encryptionerror"
  },
  {
    "type": "section",
    "title": "EncryptionError parameters",
    "description": "EncryptionError parameters",
    "page": "api/security.html",
    "section": "encryptionerror-parameters"
  },
  {
    "type": "section",
    "title": "EncryptionError example",
    "description": "EncryptionError example",
    "page": "api/security.html",
    "section": "encryptionerror-example"
  },
  {
    "type": "section",
    "title": "KeyManagementError",
    "description": "Raised by key providers and key lifecycle checks. Canonical import: from arclm.security import KeyManagementError. Fully qualified name: arclm.security.KeyManagementError. Status: Beta.",
    "page": "api/security.html",
    "section": "keymanagementerror"
  },
  {
    "type": "section",
    "title": "KeyManagementError parameters",
    "description": "KeyManagementError parameters",
    "page": "api/security.html",
    "section": "keymanagementerror-parameters"
  },
  {
    "type": "section",
    "title": "KeyManagementError example",
    "description": "KeyManagementError example",
    "page": "api/security.html",
    "section": "keymanagementerror-example"
  },
  {
    "type": "section",
    "title": "ManifestError",
    "description": "Raised for invalid or unsafe security manifests. Canonical import: from arclm.security import ManifestError. Fully qualified name: arclm.security.ManifestError. Status: Beta.",
    "page": "api/security.html",
    "section": "manifesterror"
  },
  {
    "type": "section",
    "title": "ManifestError parameters",
    "description": "ManifestError parameters",
    "page": "api/security.html",
    "section": "manifesterror-parameters"
  },
  {
    "type": "section",
    "title": "ManifestError example",
    "description": "ManifestError example",
    "page": "api/security.html",
    "section": "manifesterror-example"
  },
  {
    "type": "section",
    "title": "SecureLoadError",
    "description": "Raised when secure loading policy blocks an artifact. Canonical import: from arclm.security import SecureLoadError. Fully qualified name: arclm.security.SecureLoadError. Status: Beta.",
    "page": "api/security.html",
    "section": "secureloaderror"
  },
  {
    "type": "section",
    "title": "SecureLoadError parameters",
    "description": "SecureLoadError parameters",
    "page": "api/security.html",
    "section": "secureloaderror-parameters"
  },
  {
    "type": "section",
    "title": "SecureLoadError example",
    "description": "SecureLoadError example",
    "page": "api/security.html",
    "section": "secureloaderror-example"
  },
  {
    "type": "section",
    "title": "SecurityDependencyError",
    "description": "Raised when a required security dependency is unavailable. Canonical import: from arclm.security import SecurityDependencyError. Fully qualified name: arclm.security.SecurityDependencyError. Status: Beta.",
    "page": "api/security.html",
    "section": "securitydependencyerror"
  },
  {
    "type": "section",
    "title": "SecurityDependencyError parameters",
    "description": "SecurityDependencyError parameters",
    "page": "api/security.html",
    "section": "securitydependencyerror-parameters"
  },
  {
    "type": "section",
    "title": "SecurityDependencyError example",
    "description": "SecurityDependencyError example",
    "page": "api/security.html",
    "section": "securitydependencyerror-example"
  },
  {
    "type": "section",
    "title": "SecurityError",
    "description": "Base error for ArcLM Security Core. Canonical import: from arclm.security import SecurityError. Fully qualified name: arclm.security.SecurityError. Status: Beta.",
    "page": "api/security.html",
    "section": "securityerror"
  },
  {
    "type": "section",
    "title": "SecurityError parameters",
    "description": "SecurityError parameters",
    "page": "api/security.html",
    "section": "securityerror-parameters"
  },
  {
    "type": "section",
    "title": "SecurityError example",
    "description": "SecurityError example",
    "page": "api/security.html",
    "section": "securityerror-example"
  },
  {
    "type": "section",
    "title": "SecurityPolicyError",
    "description": "Raised when security policy denies an operation. Canonical import: from arclm.security import SecurityPolicyError. Fully qualified name: arclm.security.SecurityPolicyError. Status: Beta.",
    "page": "api/security.html",
    "section": "securitypolicyerror"
  },
  {
    "type": "section",
    "title": "SecurityPolicyError parameters",
    "description": "SecurityPolicyError parameters",
    "page": "api/security.html",
    "section": "securitypolicyerror-parameters"
  },
  {
    "type": "section",
    "title": "SecurityPolicyError example",
    "description": "SecurityPolicyError example",
    "page": "api/security.html",
    "section": "securitypolicyerror-example"
  },
  {
    "type": "section",
    "title": "SignatureError",
    "description": "Raised when manifest signing or verification fails. Canonical import: from arclm.security import SignatureError. Fully qualified name: arclm.security.SignatureError. Status: Beta.",
    "page": "api/security.html",
    "section": "signatureerror"
  },
  {
    "type": "section",
    "title": "SignatureError parameters",
    "description": "SignatureError parameters",
    "page": "api/security.html",
    "section": "signatureerror-parameters"
  },
  {
    "type": "section",
    "title": "SignatureError example",
    "description": "SignatureError example",
    "page": "api/security.html",
    "section": "signatureerror-example"
  },
  {
    "type": "section",
    "title": "decrypt_bytes",
    "description": "Decrypt an AEAD envelope or raise without returning partial plaintext. Canonical import: from arclm.security import decrypt_bytes. Fully qualified name: arclm.security.decrypt_bytes. Status: Beta.",
    "page": "api/security.html",
    "section": "decrypt-bytes"
  },
  {
    "type": "section",
    "title": "decrypt_bytes parameters",
    "description": "decrypt_bytes parameters",
    "page": "api/security.html",
    "section": "decrypt-bytes-parameters"
  },
  {
    "type": "section",
    "title": "decrypt_bytes example",
    "description": "decrypt_bytes example",
    "page": "api/security.html",
    "section": "decrypt-bytes-example"
  },
  {
    "type": "section",
    "title": "decrypt_json",
    "description": "Decrypt JSON-safe data. Canonical import: from arclm.security import decrypt_json. Fully qualified name: arclm.security.decrypt_json. Status: Beta.",
    "page": "api/security.html",
    "section": "decrypt-json"
  },
  {
    "type": "section",
    "title": "decrypt_json parameters",
    "description": "decrypt_json parameters",
    "page": "api/security.html",
    "section": "decrypt-json-parameters"
  },
  {
    "type": "section",
    "title": "decrypt_json example",
    "description": "decrypt_json example",
    "page": "api/security.html",
    "section": "decrypt-json-example"
  },
  {
    "type": "section",
    "title": "derive_key_argon2id",
    "description": "Derive a key-encryption key from a password using Argon2id. Canonical import: from arclm.security import derive_key_argon2id. Fully qualified name: arclm.security.derive_key_argon2id. Status: Beta.",
    "page": "api/security.html",
    "section": "derive-key-argon2id"
  },
  {
    "type": "section",
    "title": "derive_key_argon2id parameters",
    "description": "derive_key_argon2id parameters",
    "page": "api/security.html",
    "section": "derive-key-argon2id-parameters"
  },
  {
    "type": "section",
    "title": "derive_key_argon2id example",
    "description": "derive_key_argon2id example",
    "page": "api/security.html",
    "section": "derive-key-argon2id-example"
  },
  {
    "type": "section",
    "title": "derive_subkey_hkdf",
    "description": "Derive a purpose-bound subkey from high-entropy key material. Canonical import: from arclm.security import derive_subkey_hkdf. Fully qualified name: arclm.security.derive_subkey_hkdf. Status: Beta.",
    "page": "api/security.html",
    "section": "derive-subkey-hkdf"
  },
  {
    "type": "section",
    "title": "derive_subkey_hkdf parameters",
    "description": "derive_subkey_hkdf parameters",
    "page": "api/security.html",
    "section": "derive-subkey-hkdf-parameters"
  },
  {
    "type": "section",
    "title": "derive_subkey_hkdf example",
    "description": "derive_subkey_hkdf example",
    "page": "api/security.html",
    "section": "derive-subkey-hkdf-example"
  },
  {
    "type": "section",
    "title": "encrypt_bytes",
    "description": "Encrypt bytes with AEAD and return a versioned envelope. Canonical import: from arclm.security import encrypt_bytes. Fully qualified name: arclm.security.encrypt_bytes. Status: Beta.",
    "page": "api/security.html",
    "section": "encrypt-bytes"
  },
  {
    "type": "section",
    "title": "encrypt_bytes parameters",
    "description": "encrypt_bytes parameters",
    "page": "api/security.html",
    "section": "encrypt-bytes-parameters"
  },
  {
    "type": "section",
    "title": "encrypt_bytes example",
    "description": "encrypt_bytes example",
    "page": "api/security.html",
    "section": "encrypt-bytes-example"
  },
  {
    "type": "section",
    "title": "encrypt_json",
    "description": "Encrypt JSON-safe data. Canonical import: from arclm.security import encrypt_json. Fully qualified name: arclm.security.encrypt_json. Status: Beta.",
    "page": "api/security.html",
    "section": "encrypt-json"
  },
  {
    "type": "section",
    "title": "encrypt_json parameters",
    "description": "encrypt_json parameters",
    "page": "api/security.html",
    "section": "encrypt-json-parameters"
  },
  {
    "type": "section",
    "title": "encrypt_json example",
    "description": "encrypt_json example",
    "page": "api/security.html",
    "section": "encrypt-json-example"
  },
  {
    "type": "section",
    "title": "generate_signing_keypair",
    "description": "Generate a local Ed25519 signing key pair. Canonical import: from arclm.security import generate_signing_keypair. Fully qualified name: arclm.security.generate_signing_keypair. Status: Beta.",
    "page": "api/security.html",
    "section": "generate-signing-keypair"
  },
  {
    "type": "section",
    "title": "generate_signing_keypair parameters",
    "description": "generate_signing_keypair parameters",
    "page": "api/security.html",
    "section": "generate-signing-keypair-parameters"
  },
  {
    "type": "section",
    "title": "generate_signing_keypair example",
    "description": "generate_signing_keypair example",
    "page": "api/security.html",
    "section": "generate-signing-keypair-example"
  },
  {
    "type": "section",
    "title": "get_security_capabilities",
    "description": "Return Security Core capability status without leaking local paths. Canonical import: from arclm.security import get_security_capabilities. Fully qualified name: arclm.security.get_security_capabilities. Status: Beta.",
    "page": "api/security.html",
    "section": "get-security-capabilities"
  },
  {
    "type": "section",
    "title": "get_security_capabilities parameters",
    "description": "get_security_capabilities parameters",
    "page": "api/security.html",
    "section": "get-security-capabilities-parameters"
  },
  {
    "type": "section",
    "title": "get_security_capabilities example",
    "description": "get_security_capabilities example",
    "page": "api/security.html",
    "section": "get-security-capabilities-example"
  },
  {
    "type": "section",
    "title": "hash_bytes",
    "description": "Hash bytes with an allowlisted algorithm. Canonical import: from arclm.security import hash_bytes. Fully qualified name: arclm.security.hash_bytes. Status: Beta.",
    "page": "api/security.html",
    "section": "hash-bytes"
  },
  {
    "type": "section",
    "title": "hash_bytes parameters",
    "description": "hash_bytes parameters",
    "page": "api/security.html",
    "section": "hash-bytes-parameters"
  },
  {
    "type": "section",
    "title": "hash_bytes example",
    "description": "hash_bytes example",
    "page": "api/security.html",
    "section": "hash-bytes-example"
  },
  {
    "type": "section",
    "title": "hash_file",
    "description": "Hash a file without loading it all into memory. Canonical import: from arclm.security import hash_file. Fully qualified name: arclm.security.hash_file. Status: Beta.",
    "page": "api/security.html",
    "section": "hash-file"
  },
  {
    "type": "section",
    "title": "hash_file parameters",
    "description": "hash_file parameters",
    "page": "api/security.html",
    "section": "hash-file-parameters"
  },
  {
    "type": "section",
    "title": "hash_file example",
    "description": "hash_file example",
    "page": "api/security.html",
    "section": "hash-file-example"
  },
  {
    "type": "section",
    "title": "redact_mapping",
    "description": "Recursively redact sensitive mapping values. Canonical import: from arclm.security import redact_mapping. Fully qualified name: arclm.security.redact_mapping. Status: Beta.",
    "page": "api/security.html",
    "section": "redact-mapping"
  },
  {
    "type": "section",
    "title": "redact_mapping parameters",
    "description": "redact_mapping parameters",
    "page": "api/security.html",
    "section": "redact-mapping-parameters"
  },
  {
    "type": "section",
    "title": "redact_mapping example",
    "description": "redact_mapping example",
    "page": "api/security.html",
    "section": "redact-mapping-example"
  },
  {
    "type": "section",
    "title": "redact_sensitive_text",
    "description": "Redact common secret patterns from text. Canonical import: from arclm.security import redact_sensitive_text. Fully qualified name: arclm.security.redact_sensitive_text. Status: Beta.",
    "page": "api/security.html",
    "section": "redact-sensitive-text"
  },
  {
    "type": "section",
    "title": "redact_sensitive_text parameters",
    "description": "redact_sensitive_text parameters",
    "page": "api/security.html",
    "section": "redact-sensitive-text-parameters"
  },
  {
    "type": "section",
    "title": "redact_sensitive_text example",
    "description": "redact_sensitive_text example",
    "page": "api/security.html",
    "section": "redact-sensitive-text-example"
  },
  {
    "type": "section",
    "title": "security_inventory",
    "description": "Public function exported by arclm.security. Canonical import: from arclm.security import security_inventory. Fully qualified name: arclm.security.security_inventory. Status: Beta.",
    "page": "api/security.html",
    "section": "security-inventory"
  },
  {
    "type": "section",
    "title": "security_inventory parameters",
    "description": "security_inventory parameters",
    "page": "api/security.html",
    "section": "security-inventory-parameters"
  },
  {
    "type": "section",
    "title": "security_inventory example",
    "description": "security_inventory example",
    "page": "api/security.html",
    "section": "security-inventory-example"
  },
  {
    "type": "section",
    "title": "security_status",
    "description": "Return a safe security status report without paths or secrets. Canonical import: from arclm.security import security_status. Fully qualified name: arclm.security.security_status. Status: Beta.",
    "page": "api/security.html",
    "section": "security-status"
  },
  {
    "type": "section",
    "title": "security_status parameters",
    "description": "security_status parameters",
    "page": "api/security.html",
    "section": "security-status-parameters"
  },
  {
    "type": "section",
    "title": "security_status example",
    "description": "security_status example",
    "page": "api/security.html",
    "section": "security-status-example"
  },
  {
    "type": "section",
    "title": "sign_manifest",
    "description": "Return a signed manifest copy. Canonical import: from arclm.security import sign_manifest. Fully qualified name: arclm.security.sign_manifest. Status: Beta.",
    "page": "api/security.html",
    "section": "sign-manifest"
  },
  {
    "type": "section",
    "title": "sign_manifest parameters",
    "description": "sign_manifest parameters",
    "page": "api/security.html",
    "section": "sign-manifest-parameters"
  },
  {
    "type": "section",
    "title": "sign_manifest example",
    "description": "sign_manifest example",
    "page": "api/security.html",
    "section": "sign-manifest-example"
  },
  {
    "type": "section",
    "title": "threat_model",
    "description": "Public function exported by arclm.security. Canonical import: from arclm.security import threat_model. Fully qualified name: arclm.security.threat_model. Status: Beta.",
    "page": "api/security.html",
    "section": "threat-model"
  },
  {
    "type": "section",
    "title": "threat_model parameters",
    "description": "threat_model parameters",
    "page": "api/security.html",
    "section": "threat-model-parameters"
  },
  {
    "type": "section",
    "title": "threat_model example",
    "description": "threat_model example",
    "page": "api/security.html",
    "section": "threat-model-example"
  },
  {
    "type": "section",
    "title": "verify_file_hash",
    "description": "Verify a trusted expected file hash. Canonical import: from arclm.security import verify_file_hash. Fully qualified name: arclm.security.verify_file_hash. Status: Beta.",
    "page": "api/security.html",
    "section": "verify-file-hash"
  },
  {
    "type": "section",
    "title": "verify_file_hash parameters",
    "description": "verify_file_hash parameters",
    "page": "api/security.html",
    "section": "verify-file-hash-parameters"
  },
  {
    "type": "section",
    "title": "verify_file_hash example",
    "description": "verify_file_hash example",
    "page": "api/security.html",
    "section": "verify-file-hash-example"
  },
  {
    "type": "section",
    "title": "verify_manifest",
    "description": "Verify a signed manifest. Canonical import: from arclm.security import verify_manifest. Fully qualified name: arclm.security.verify_manifest. Status: Beta.",
    "page": "api/security.html",
    "section": "verify-manifest"
  },
  {
    "type": "section",
    "title": "verify_manifest parameters",
    "description": "verify_manifest parameters",
    "page": "api/security.html",
    "section": "verify-manifest-parameters"
  },
  {
    "type": "section",
    "title": "verify_manifest example",
    "description": "verify_manifest example",
    "page": "api/security.html",
    "section": "verify-manifest-example"
  },
  {
    "type": "section",
    "title": "verify_manifest_signature",
    "description": "Verify a signed manifest. Canonical import: from arclm.security import verify_manifest_signature. Fully qualified name: arclm.security.verify_manifest_signature. Status: Beta.",
    "page": "api/security.html",
    "section": "verify-manifest-signature"
  },
  {
    "type": "section",
    "title": "verify_manifest_signature parameters",
    "description": "verify_manifest_signature parameters",
    "page": "api/security.html",
    "section": "verify-manifest-signature-parameters"
  },
  {
    "type": "section",
    "title": "verify_manifest_signature example",
    "description": "verify_manifest_signature example",
    "page": "api/security.html",
    "section": "verify-manifest-signature-example"
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
    "description": "Configuratie voor ArcLM LoRA adapters. Canonical import: from arclm.peft import LoRAConfig. Fully qualified name: arclm.peft.LoRAConfig. Status: Experimental.",
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
    "type": "section",
    "title": "LoRALinear",
    "description": "Lineaire laag met trainbare LoRA matrices bovenop een bevroren basislaag. Canonical import: from arclm.peft import LoRALinear. Fully qualified name: arclm.peft.LoRALinear. Status: Experimental.",
    "page": "api/peft.html",
    "section": "loralinear"
  },
  {
    "type": "section",
    "title": "LoRALinear parameters",
    "description": "LoRALinear parameters",
    "page": "api/peft.html",
    "section": "loralinear-parameters"
  },
  {
    "type": "section",
    "title": "LoRALinear example",
    "description": "LoRALinear example",
    "page": "api/peft.html",
    "section": "loralinear-example"
  },
  {
    "type": "section",
    "title": "PeftAdapterInfo",
    "description": "Inspectie-info zonder adaptergewichten te laden in een model. Canonical import: from arclm.peft import PeftAdapterInfo. Fully qualified name: arclm.peft.PeftAdapterInfo. Status: Experimental.",
    "page": "api/peft.html",
    "section": "peftadapterinfo"
  },
  {
    "type": "section",
    "title": "PeftAdapterInfo parameters",
    "description": "PeftAdapterInfo parameters",
    "page": "api/peft.html",
    "section": "peftadapterinfo-parameters"
  },
  {
    "type": "section",
    "title": "PeftAdapterInfo example",
    "description": "PeftAdapterInfo example",
    "page": "api/peft.html",
    "section": "peftadapterinfo-example"
  },
  {
    "type": "section",
    "title": "PeftAdapterManifest",
    "description": "Manifest voor een ArcLM PEFT adapter. Canonical import: from arclm.peft import PeftAdapterManifest. Fully qualified name: arclm.peft.PeftAdapterManifest. Status: Experimental.",
    "page": "api/peft.html",
    "section": "peftadaptermanifest"
  },
  {
    "type": "section",
    "title": "PeftAdapterManifest parameters",
    "description": "PeftAdapterManifest parameters",
    "page": "api/peft.html",
    "section": "peftadaptermanifest-parameters"
  },
  {
    "type": "section",
    "title": "PeftAdapterManifest example",
    "description": "PeftAdapterManifest example",
    "page": "api/peft.html",
    "section": "peftadaptermanifest-example"
  },
  {
    "type": "section",
    "title": "PeftApplicationResult",
    "description": "Resultaat van een PEFT-injectie. Canonical import: from arclm.peft import PeftApplicationResult. Fully qualified name: arclm.peft.PeftApplicationResult. Status: Experimental.",
    "page": "api/peft.html",
    "section": "peftapplicationresult"
  },
  {
    "type": "section",
    "title": "PeftApplicationResult parameters",
    "description": "PeftApplicationResult parameters",
    "page": "api/peft.html",
    "section": "peftapplicationresult-parameters"
  },
  {
    "type": "section",
    "title": "PeftApplicationResult example",
    "description": "PeftApplicationResult example",
    "page": "api/peft.html",
    "section": "peftapplicationresult-example"
  },
  {
    "type": "section",
    "title": "PeftConfig",
    "description": "Kleine basisconfig voor PEFT. Canonical import: from arclm.peft import PeftConfig. Fully qualified name: arclm.peft.PeftConfig. Status: Experimental.",
    "page": "api/peft.html",
    "section": "peftconfig"
  },
  {
    "type": "section",
    "title": "PeftConfig parameters",
    "description": "PeftConfig parameters",
    "page": "api/peft.html",
    "section": "peftconfig-parameters"
  },
  {
    "type": "section",
    "title": "PeftConfig example",
    "description": "PeftConfig example",
    "page": "api/peft.html",
    "section": "peftconfig-example"
  },
  {
    "type": "section",
    "title": "PeftMethod",
    "description": "Bekende PEFT-methodes. Canonical import: from arclm.peft import PeftMethod. Fully qualified name: arclm.peft.PeftMethod. Status: Experimental.",
    "page": "api/peft.html",
    "section": "peftmethod"
  },
  {
    "type": "section",
    "title": "PeftMethod parameters",
    "description": "PeftMethod parameters",
    "page": "api/peft.html",
    "section": "peftmethod-parameters"
  },
  {
    "type": "section",
    "title": "PeftMethod example",
    "description": "PeftMethod example",
    "page": "api/peft.html",
    "section": "peftmethod-example"
  },
  {
    "type": "section",
    "title": "PeftParameterReport",
    "description": "Samenvatting van trainbare en bevroren parameters. Canonical import: from arclm.peft import PeftParameterReport. Fully qualified name: arclm.peft.PeftParameterReport. Status: Experimental.",
    "page": "api/peft.html",
    "section": "peftparameterreport"
  },
  {
    "type": "section",
    "title": "PeftParameterReport parameters",
    "description": "PeftParameterReport parameters",
    "page": "api/peft.html",
    "section": "peftparameterreport-parameters"
  },
  {
    "type": "section",
    "title": "PeftParameterReport example",
    "description": "PeftParameterReport example",
    "page": "api/peft.html",
    "section": "peftparameterreport-example"
  },
  {
    "type": "section",
    "title": "PeftTarget",
    "description": "Een lineaire laag die LoRA kan krijgen. Canonical import: from arclm.peft import PeftTarget. Fully qualified name: arclm.peft.PeftTarget. Status: Experimental.",
    "page": "api/peft.html",
    "section": "pefttarget"
  },
  {
    "type": "section",
    "title": "PeftTarget parameters",
    "description": "PeftTarget parameters",
    "page": "api/peft.html",
    "section": "pefttarget-parameters"
  },
  {
    "type": "section",
    "title": "PeftTarget example",
    "description": "PeftTarget example",
    "page": "api/peft.html",
    "section": "pefttarget-example"
  },
  {
    "type": "section",
    "title": "QLoRAConfig",
    "description": "Configuratie voor QLoRA: 4-bit basis plus LoRA adapters. Canonical import: from arclm.peft import QLoRAConfig. Fully qualified name: arclm.peft.QLoRAConfig. Status: Experimental.",
    "page": "api/peft.html",
    "section": "qloraconfig"
  },
  {
    "type": "section",
    "title": "QLoRAConfig parameters",
    "description": "QLoRAConfig parameters",
    "page": "api/peft.html",
    "section": "qloraconfig-parameters"
  },
  {
    "type": "section",
    "title": "QLoRAConfig example",
    "description": "QLoRAConfig example",
    "page": "api/peft.html",
    "section": "qloraconfig-example"
  },
  {
    "type": "section",
    "title": "QuantizationBackend",
    "description": "Bekende quantization backends voor fine-tuning. Canonical import: from arclm.peft import QuantizationBackend. Fully qualified name: arclm.peft.QuantizationBackend. Status: Experimental.",
    "page": "api/peft.html",
    "section": "quantizationbackend"
  },
  {
    "type": "section",
    "title": "QuantizationBackend parameters",
    "description": "QuantizationBackend parameters",
    "page": "api/peft.html",
    "section": "quantizationbackend-parameters"
  },
  {
    "type": "section",
    "title": "QuantizationBackend example",
    "description": "QuantizationBackend example",
    "page": "api/peft.html",
    "section": "quantizationbackend-example"
  },
  {
    "type": "section",
    "title": "QuantizationCapabilityReport",
    "description": "Leesbare status van de lokale QLoRA-mogelijkheden. Canonical import: from arclm.peft import QuantizationCapabilityReport. Fully qualified name: arclm.peft.QuantizationCapabilityReport. Status: Experimental.",
    "page": "api/peft.html",
    "section": "quantizationcapabilityreport"
  },
  {
    "type": "section",
    "title": "QuantizationCapabilityReport parameters",
    "description": "QuantizationCapabilityReport parameters",
    "page": "api/peft.html",
    "section": "quantizationcapabilityreport-parameters"
  },
  {
    "type": "section",
    "title": "QuantizationCapabilityReport example",
    "description": "QuantizationCapabilityReport example",
    "page": "api/peft.html",
    "section": "quantizationcapabilityreport-example"
  },
  {
    "type": "section",
    "title": "QuantizationConfig",
    "description": "Kleine JSON-veilige config voor 4-bit quantization. Canonical import: from arclm.peft import QuantizationConfig. Fully qualified name: arclm.peft.QuantizationConfig. Status: Experimental.",
    "page": "api/peft.html",
    "section": "quantizationconfig"
  },
  {
    "type": "section",
    "title": "QuantizationConfig parameters",
    "description": "QuantizationConfig parameters",
    "page": "api/peft.html",
    "section": "quantizationconfig-parameters"
  },
  {
    "type": "section",
    "title": "QuantizationConfig example",
    "description": "QuantizationConfig example",
    "page": "api/peft.html",
    "section": "quantizationconfig-example"
  },
  {
    "type": "section",
    "title": "QuantizationType",
    "description": "4-bit quantization types die ArcLM accepteert. Canonical import: from arclm.peft import QuantizationType. Fully qualified name: arclm.peft.QuantizationType. Status: Experimental.",
    "page": "api/peft.html",
    "section": "quantizationtype"
  },
  {
    "type": "section",
    "title": "QuantizationType parameters",
    "description": "QuantizationType parameters",
    "page": "api/peft.html",
    "section": "quantizationtype-parameters"
  },
  {
    "type": "section",
    "title": "QuantizationType example",
    "description": "QuantizationType example",
    "page": "api/peft.html",
    "section": "quantizationtype-example"
  },
  {
    "type": "section",
    "title": "QuantizedComputeDType",
    "description": "Compute dtype voor quantized training. Canonical import: from arclm.peft import QuantizedComputeDType. Fully qualified name: arclm.peft.QuantizedComputeDType. Status: Experimental.",
    "page": "api/peft.html",
    "section": "quantizedcomputedtype"
  },
  {
    "type": "section",
    "title": "QuantizedComputeDType parameters",
    "description": "QuantizedComputeDType parameters",
    "page": "api/peft.html",
    "section": "quantizedcomputedtype-parameters"
  },
  {
    "type": "section",
    "title": "QuantizedComputeDType example",
    "description": "QuantizedComputeDType example",
    "page": "api/peft.html",
    "section": "quantizedcomputedtype-example"
  },
  {
    "type": "section",
    "title": "QuantizedModelReport",
    "description": "Samenvatting van een quantized QLoRA-runtime model. Canonical import: from arclm.peft import QuantizedModelReport. Fully qualified name: arclm.peft.QuantizedModelReport. Status: Experimental.",
    "page": "api/peft.html",
    "section": "quantizedmodelreport"
  },
  {
    "type": "section",
    "title": "QuantizedModelReport parameters",
    "description": "QuantizedModelReport parameters",
    "page": "api/peft.html",
    "section": "quantizedmodelreport-parameters"
  },
  {
    "type": "section",
    "title": "QuantizedModelReport example",
    "description": "QuantizedModelReport example",
    "page": "api/peft.html",
    "section": "quantizedmodelreport-example"
  },
  {
    "type": "section",
    "title": "ADAPTER_ARTIFACT_FORMAT",
    "description": "str(object='') -> str str(bytes_or_buffer[, encoding[, errors]]) -> str Create a new string object from the given object. Canonical import: from arclm.peft import ADAPTER_ARTIFACT_FORMAT. Fully qualified name: arclm.peft.ADAPTER_ARTIFACT_FORMAT. Status: Experimental.",
    "page": "api/peft.html",
    "section": "adapter-artifact-format"
  },
  {
    "type": "section",
    "title": "ADAPTER_ARTIFACT_FORMAT parameters",
    "description": "ADAPTER_ARTIFACT_FORMAT parameters",
    "page": "api/peft.html",
    "section": "adapter-artifact-format-parameters"
  },
  {
    "type": "section",
    "title": "ADAPTER_ARTIFACT_FORMAT example",
    "description": "ADAPTER_ARTIFACT_FORMAT example",
    "page": "api/peft.html",
    "section": "adapter-artifact-format-example"
  },
  {
    "type": "section",
    "title": "ADAPTER_ARTIFACT_VERSION",
    "description": "int([x]) -> integer int(x, base=10) -> integer Convert a number or string to an integer, or return 0 if no arguments are given. Canonical import: from arclm.peft import ADAPTER_ARTIFACT_VERSION. Fully qualified name: arclm.peft.ADAPTER_ARTIFACT_VERSION. Status: Experimental.",
    "page": "api/peft.html",
    "section": "adapter-artifact-version"
  },
  {
    "type": "section",
    "title": "ADAPTER_ARTIFACT_VERSION parameters",
    "description": "ADAPTER_ARTIFACT_VERSION parameters",
    "page": "api/peft.html",
    "section": "adapter-artifact-version-parameters"
  },
  {
    "type": "section",
    "title": "ADAPTER_ARTIFACT_VERSION example",
    "description": "ADAPTER_ARTIFACT_VERSION example",
    "page": "api/peft.html",
    "section": "adapter-artifact-version-example"
  },
  {
    "type": "section",
    "title": "apply_lora",
    "description": "Vervangt geselecteerde `nn.Linear` lagen door LoRA wrappers. Canonical import: from arclm.peft import apply_lora. Fully qualified name: arclm.peft.apply_lora. Status: Experimental.",
    "page": "api/peft.html",
    "section": "apply-lora"
  },
  {
    "type": "section",
    "title": "apply_lora parameters",
    "description": "apply_lora parameters",
    "page": "api/peft.html",
    "section": "apply-lora-parameters"
  },
  {
    "type": "section",
    "title": "apply_lora example",
    "description": "apply_lora example",
    "page": "api/peft.html",
    "section": "apply-lora-example"
  },
  {
    "type": "section",
    "title": "apply_peft",
    "description": "Past de gevraagde PEFT-methode toe. Canonical import: from arclm.peft import apply_peft. Fully qualified name: arclm.peft.apply_peft. Status: Experimental.",
    "page": "api/peft.html",
    "section": "apply-peft"
  },
  {
    "type": "section",
    "title": "apply_peft parameters",
    "description": "apply_peft parameters",
    "page": "api/peft.html",
    "section": "apply-peft-parameters"
  },
  {
    "type": "section",
    "title": "apply_peft example",
    "description": "apply_peft example",
    "page": "api/peft.html",
    "section": "apply-peft-example"
  },
  {
    "type": "section",
    "title": "create_quantized_load_config",
    "description": "Maakt backend-specifieke laadconfig voor tests en integraties. Canonical import: from arclm.peft import create_quantized_load_config. Fully qualified name: arclm.peft.create_quantized_load_config. Status: Experimental.",
    "page": "api/peft.html",
    "section": "create-quantized-load-config"
  },
  {
    "type": "section",
    "title": "create_quantized_load_config parameters",
    "description": "create_quantized_load_config parameters",
    "page": "api/peft.html",
    "section": "create-quantized-load-config-parameters"
  },
  {
    "type": "section",
    "title": "create_quantized_load_config example",
    "description": "create_quantized_load_config example",
    "page": "api/peft.html",
    "section": "create-quantized-load-config-example"
  },
  {
    "type": "section",
    "title": "fingerprint_base_model",
    "description": "Maakt een structuur-fingerprint zonder adaptergewichten. Canonical import: from arclm.peft import fingerprint_base_model. Fully qualified name: arclm.peft.fingerprint_base_model. Status: Experimental.",
    "page": "api/peft.html",
    "section": "fingerprint-base-model"
  },
  {
    "type": "section",
    "title": "fingerprint_base_model parameters",
    "description": "fingerprint_base_model parameters",
    "page": "api/peft.html",
    "section": "fingerprint-base-model-parameters"
  },
  {
    "type": "section",
    "title": "fingerprint_base_model example",
    "description": "fingerprint_base_model example",
    "page": "api/peft.html",
    "section": "fingerprint-base-model-example"
  },
  {
    "type": "section",
    "title": "get_lora_state_dict",
    "description": "Haalt alleen adaptergewichten uit het model. Canonical import: from arclm.peft import get_lora_state_dict. Fully qualified name: arclm.peft.get_lora_state_dict. Status: Experimental.",
    "page": "api/peft.html",
    "section": "get-lora-state-dict"
  },
  {
    "type": "section",
    "title": "get_lora_state_dict parameters",
    "description": "get_lora_state_dict parameters",
    "page": "api/peft.html",
    "section": "get-lora-state-dict-parameters"
  },
  {
    "type": "section",
    "title": "get_lora_state_dict example",
    "description": "get_lora_state_dict example",
    "page": "api/peft.html",
    "section": "get-lora-state-dict-example"
  },
  {
    "type": "section",
    "title": "get_peft_parameter_report",
    "description": "Telt trainbare parameters na PEFT-injectie. Canonical import: from arclm.peft import get_peft_parameter_report. Fully qualified name: arclm.peft.get_peft_parameter_report. Status: Experimental.",
    "page": "api/peft.html",
    "section": "get-peft-parameter-report"
  },
  {
    "type": "section",
    "title": "get_peft_parameter_report parameters",
    "description": "get_peft_parameter_report parameters",
    "page": "api/peft.html",
    "section": "get-peft-parameter-report-parameters"
  },
  {
    "type": "section",
    "title": "get_peft_parameter_report example",
    "description": "get_peft_parameter_report example",
    "page": "api/peft.html",
    "section": "get-peft-parameter-report-example"
  },
  {
    "type": "section",
    "title": "get_quantization_backend",
    "description": "Geeft de goedgekeurde backendadapter terug. Canonical import: from arclm.peft import get_quantization_backend. Fully qualified name: arclm.peft.get_quantization_backend. Status: Experimental.",
    "page": "api/peft.html",
    "section": "get-quantization-backend"
  },
  {
    "type": "section",
    "title": "get_quantization_backend parameters",
    "description": "get_quantization_backend parameters",
    "page": "api/peft.html",
    "section": "get-quantization-backend-parameters"
  },
  {
    "type": "section",
    "title": "get_quantization_backend example",
    "description": "get_quantization_backend example",
    "page": "api/peft.html",
    "section": "get-quantization-backend-example"
  },
  {
    "type": "section",
    "title": "inspect_adapter_artifact",
    "description": "Inspecteert adaptermetadata zonder een model te bouwen. Canonical import: from arclm.peft import inspect_adapter_artifact. Fully qualified name: arclm.peft.inspect_adapter_artifact. Status: Experimental.",
    "page": "api/peft.html",
    "section": "inspect-adapter-artifact"
  },
  {
    "type": "section",
    "title": "inspect_adapter_artifact parameters",
    "description": "inspect_adapter_artifact parameters",
    "page": "api/peft.html",
    "section": "inspect-adapter-artifact-parameters"
  },
  {
    "type": "section",
    "title": "inspect_adapter_artifact example",
    "description": "inspect_adapter_artifact example",
    "page": "api/peft.html",
    "section": "inspect-adapter-artifact-example"
  },
  {
    "type": "section",
    "title": "inspect_lora_targets",
    "description": "Maakt een droog plan zonder het model te wijzigen. Canonical import: from arclm.peft import inspect_lora_targets. Fully qualified name: arclm.peft.inspect_lora_targets. Status: Experimental.",
    "page": "api/peft.html",
    "section": "inspect-lora-targets"
  },
  {
    "type": "section",
    "title": "inspect_lora_targets parameters",
    "description": "inspect_lora_targets parameters",
    "page": "api/peft.html",
    "section": "inspect-lora-targets-parameters"
  },
  {
    "type": "section",
    "title": "inspect_lora_targets example",
    "description": "inspect_lora_targets example",
    "page": "api/peft.html",
    "section": "inspect-lora-targets-example"
  },
  {
    "type": "section",
    "title": "inspect_quantization_capabilities",
    "description": "Inspecteert QLoRA-mogelijkheden zonder een model te laden. Canonical import: from arclm.peft import inspect_quantization_capabilities. Fully qualified name: arclm.peft.inspect_quantization_capabilities. Status: Experimental.",
    "page": "api/peft.html",
    "section": "inspect-quantization-capabilities"
  },
  {
    "type": "section",
    "title": "inspect_quantization_capabilities parameters",
    "description": "inspect_quantization_capabilities parameters",
    "page": "api/peft.html",
    "section": "inspect-quantization-capabilities-parameters"
  },
  {
    "type": "section",
    "title": "inspect_quantization_capabilities example",
    "description": "inspect_quantization_capabilities example",
    "page": "api/peft.html",
    "section": "inspect-quantization-capabilities-example"
  },
  {
    "type": "section",
    "title": "is_lora_model",
    "description": "Controleert of een model LoRA-wrappers bevat. Canonical import: from arclm.peft import is_lora_model. Fully qualified name: arclm.peft.is_lora_model. Status: Experimental.",
    "page": "api/peft.html",
    "section": "is-lora-model"
  },
  {
    "type": "section",
    "title": "is_lora_model parameters",
    "description": "is_lora_model parameters",
    "page": "api/peft.html",
    "section": "is-lora-model-parameters"
  },
  {
    "type": "section",
    "title": "is_lora_model example",
    "description": "is_lora_model example",
    "page": "api/peft.html",
    "section": "is-lora-model-example"
  },
  {
    "type": "section",
    "title": "is_quantized_runtime_model",
    "description": "Controleert of een model als ArcLM quantized runtime is gemarkeerd. Canonical import: from arclm.peft import is_quantized_runtime_model. Fully qualified name: arclm.peft.is_quantized_runtime_model. Status: Experimental.",
    "page": "api/peft.html",
    "section": "is-quantized-runtime-model"
  },
  {
    "type": "section",
    "title": "is_quantized_runtime_model parameters",
    "description": "is_quantized_runtime_model parameters",
    "page": "api/peft.html",
    "section": "is-quantized-runtime-model-parameters"
  },
  {
    "type": "section",
    "title": "is_quantized_runtime_model example",
    "description": "is_quantized_runtime_model example",
    "page": "api/peft.html",
    "section": "is-quantized-runtime-model-example"
  },
  {
    "type": "section",
    "title": "load_adapter_artifact",
    "description": "Past een LoRA adapterartifact toe op een schoon basismodel. Canonical import: from arclm.peft import load_adapter_artifact. Fully qualified name: arclm.peft.load_adapter_artifact. Status: Experimental.",
    "page": "api/peft.html",
    "section": "load-adapter-artifact"
  },
  {
    "type": "section",
    "title": "load_adapter_artifact parameters",
    "description": "load_adapter_artifact parameters",
    "page": "api/peft.html",
    "section": "load-adapter-artifact-parameters"
  },
  {
    "type": "section",
    "title": "load_adapter_artifact example",
    "description": "load_adapter_artifact example",
    "page": "api/peft.html",
    "section": "load-adapter-artifact-example"
  },
  {
    "type": "section",
    "title": "load_lora_state_dict",
    "description": "Laadt adaptergewichten in een model dat al LoRA-wrappers heeft. Canonical import: from arclm.peft import load_lora_state_dict. Fully qualified name: arclm.peft.load_lora_state_dict. Status: Experimental.",
    "page": "api/peft.html",
    "section": "load-lora-state-dict"
  },
  {
    "type": "section",
    "title": "load_lora_state_dict parameters",
    "description": "load_lora_state_dict parameters",
    "page": "api/peft.html",
    "section": "load-lora-state-dict-parameters"
  },
  {
    "type": "section",
    "title": "load_lora_state_dict example",
    "description": "load_lora_state_dict example",
    "page": "api/peft.html",
    "section": "load-lora-state-dict-example"
  },
  {
    "type": "section",
    "title": "load_quantized_model",
    "description": "Laadt een lokaal 4-bit model voor QLoRA. Canonical import: from arclm.peft import load_quantized_model. Fully qualified name: arclm.peft.load_quantized_model. Status: Experimental.",
    "page": "api/peft.html",
    "section": "load-quantized-model"
  },
  {
    "type": "section",
    "title": "load_quantized_model parameters",
    "description": "load_quantized_model parameters",
    "page": "api/peft.html",
    "section": "load-quantized-model-parameters"
  },
  {
    "type": "section",
    "title": "load_quantized_model example",
    "description": "load_quantized_model example",
    "page": "api/peft.html",
    "section": "load-quantized-model-example"
  },
  {
    "type": "section",
    "title": "merge_lora",
    "description": "Merged alle LoRA-lagen in-place. Canonical import: from arclm.peft import merge_lora. Fully qualified name: arclm.peft.merge_lora. Status: Experimental.",
    "page": "api/peft.html",
    "section": "merge-lora"
  },
  {
    "type": "section",
    "title": "merge_lora parameters",
    "description": "merge_lora parameters",
    "page": "api/peft.html",
    "section": "merge-lora-parameters"
  },
  {
    "type": "section",
    "title": "merge_lora example",
    "description": "merge_lora example",
    "page": "api/peft.html",
    "section": "merge-lora-example"
  },
  {
    "type": "section",
    "title": "merged_lora_model",
    "description": "Geeft een kopie terug waarbij LoRA in gewone Linear lagen is verwerkt. Canonical import: from arclm.peft import merged_lora_model. Fully qualified name: arclm.peft.merged_lora_model. Status: Experimental.",
    "page": "api/peft.html",
    "section": "merged-lora-model"
  },
  {
    "type": "section",
    "title": "merged_lora_model parameters",
    "description": "merged_lora_model parameters",
    "page": "api/peft.html",
    "section": "merged-lora-model-parameters"
  },
  {
    "type": "section",
    "title": "merged_lora_model example",
    "description": "merged_lora_model example",
    "page": "api/peft.html",
    "section": "merged-lora-model-example"
  },
  {
    "type": "section",
    "title": "prepare_model_for_qlora",
    "description": "Bevriest de quantized basis voordat LoRA wordt toegevoegd. Canonical import: from arclm.peft import prepare_model_for_qlora. Fully qualified name: arclm.peft.prepare_model_for_qlora. Status: Experimental.",
    "page": "api/peft.html",
    "section": "prepare-model-for-qlora"
  },
  {
    "type": "section",
    "title": "prepare_model_for_qlora parameters",
    "description": "prepare_model_for_qlora parameters",
    "page": "api/peft.html",
    "section": "prepare-model-for-qlora-parameters"
  },
  {
    "type": "section",
    "title": "prepare_model_for_qlora example",
    "description": "prepare_model_for_qlora example",
    "page": "api/peft.html",
    "section": "prepare-model-for-qlora-example"
  },
  {
    "type": "section",
    "title": "save_adapter_artifact",
    "description": "Bewaart alleen LoRA adaptergewichten. Canonical import: from arclm.peft import save_adapter_artifact. Fully qualified name: arclm.peft.save_adapter_artifact. Status: Experimental.",
    "page": "api/peft.html",
    "section": "save-adapter-artifact"
  },
  {
    "type": "section",
    "title": "save_adapter_artifact parameters",
    "description": "save_adapter_artifact parameters",
    "page": "api/peft.html",
    "section": "save-adapter-artifact-parameters"
  },
  {
    "type": "section",
    "title": "save_adapter_artifact example",
    "description": "save_adapter_artifact example",
    "page": "api/peft.html",
    "section": "save-adapter-artifact-example"
  },
  {
    "type": "section",
    "title": "unmerge_lora",
    "description": "Maakt een eerdere merge ongedaan. Canonical import: from arclm.peft import unmerge_lora. Fully qualified name: arclm.peft.unmerge_lora. Status: Experimental.",
    "page": "api/peft.html",
    "section": "unmerge-lora"
  },
  {
    "type": "section",
    "title": "unmerge_lora parameters",
    "description": "unmerge_lora parameters",
    "page": "api/peft.html",
    "section": "unmerge-lora-parameters"
  },
  {
    "type": "section",
    "title": "unmerge_lora example",
    "description": "unmerge_lora example",
    "page": "api/peft.html",
    "section": "unmerge-lora-example"
  },
  {
    "type": "section",
    "title": "validate_adapter_artifact",
    "description": "Valideert manifest, paden en hashes zonder adapter te laden. Canonical import: from arclm.peft import validate_adapter_artifact. Fully qualified name: arclm.peft.validate_adapter_artifact. Status: Experimental.",
    "page": "api/peft.html",
    "section": "validate-adapter-artifact"
  },
  {
    "type": "section",
    "title": "validate_adapter_artifact parameters",
    "description": "validate_adapter_artifact parameters",
    "page": "api/peft.html",
    "section": "validate-adapter-artifact-parameters"
  },
  {
    "type": "section",
    "title": "validate_adapter_artifact example",
    "description": "validate_adapter_artifact example",
    "page": "api/peft.html",
    "section": "validate-adapter-artifact-example"
  },
  {
    "type": "section",
    "title": "validate_quantized_base_model",
    "description": "Controleert dat QLoRA echt op een quantized basis draait. Canonical import: from arclm.peft import validate_quantized_base_model. Fully qualified name: arclm.peft.validate_quantized_base_model. Status: Experimental.",
    "page": "api/peft.html",
    "section": "validate-quantized-base-model"
  },
  {
    "type": "section",
    "title": "validate_quantized_base_model parameters",
    "description": "validate_quantized_base_model parameters",
    "page": "api/peft.html",
    "section": "validate-quantized-base-model-parameters"
  },
  {
    "type": "section",
    "title": "validate_quantized_base_model example",
    "description": "validate_quantized_base_model example",
    "page": "api/peft.html",
    "section": "validate-quantized-base-model-example"
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
    "title": "DatasetRoot",
    "description": "Een server-side datasetmap die de browser mag laten inspecteren. Canonical import: from arclm.web import DatasetRoot. Fully qualified name: arclm.web.DatasetRoot. Status: Beta.",
    "page": "api/web.html",
    "section": "datasetroot"
  },
  {
    "type": "section",
    "title": "DatasetRoot parameters",
    "description": "DatasetRoot parameters",
    "page": "api/web.html",
    "section": "datasetroot-parameters"
  },
  {
    "type": "section",
    "title": "DatasetRoot example",
    "description": "DatasetRoot example",
    "page": "api/web.html",
    "section": "datasetroot-example"
  },
  {
    "type": "section",
    "title": "WebConfig",
    "description": "Instellingen voor de lokale Web API. Canonical import: from arclm.web import WebConfig. Fully qualified name: arclm.web.WebConfig. Status: Beta.",
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
    "type": "section",
    "title": "create_app",
    "description": "Maakt de lokale ArcLM Web API. Canonical import: from arclm.web import create_app. Fully qualified name: arclm.web.create_app. Status: Beta.",
    "page": "api/web.html",
    "section": "create-app"
  },
  {
    "type": "section",
    "title": "create_app parameters",
    "description": "create_app parameters",
    "page": "api/web.html",
    "section": "create-app-parameters"
  },
  {
    "type": "section",
    "title": "create_app example",
    "description": "create_app example",
    "page": "api/web.html",
    "section": "create-app-example"
  },
  {
    "type": "page",
    "title": "Plugins API",
    "description": "Public plugins APIs.",
    "page": "api/plugins.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "Overview",
    "description": "Plugins API documents the public ArcLM APIs in this category.",
    "page": "api/plugins.html",
    "section": "overview"
  },
  {
    "type": "section",
    "title": "PluginMetadata",
    "description": "Kleine beschrijving van een plugin. Canonical import: from arclm.plugins import PluginMetadata. Fully qualified name: arclm.plugins.PluginMetadata. Status: Experimental.",
    "page": "api/plugins.html",
    "section": "pluginmetadata"
  },
  {
    "type": "section",
    "title": "PluginMetadata parameters",
    "description": "PluginMetadata parameters",
    "page": "api/plugins.html",
    "section": "pluginmetadata-parameters"
  },
  {
    "type": "section",
    "title": "PluginMetadata example",
    "description": "PluginMetadata example",
    "page": "api/plugins.html",
    "section": "pluginmetadata-example"
  },
  {
    "type": "section",
    "title": "PluginProtocol",
    "description": "Contract voor plugins die zelf ArcLM uitbreidingen registreren. Canonical import: from arclm.plugins import PluginProtocol. Fully qualified name: arclm.plugins.PluginProtocol. Status: Experimental.",
    "page": "api/plugins.html",
    "section": "pluginprotocol"
  },
  {
    "type": "section",
    "title": "PluginProtocol parameters",
    "description": "PluginProtocol parameters",
    "page": "api/plugins.html",
    "section": "pluginprotocol-parameters"
  },
  {
    "type": "section",
    "title": "PluginProtocol example",
    "description": "PluginProtocol example",
    "page": "api/plugins.html",
    "section": "pluginprotocol-example"
  },
  {
    "type": "page",
    "title": "Registry API",
    "description": "Public registry APIs.",
    "page": "api/registry.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "Overview",
    "description": "Registry API documents the public ArcLM APIs in this category.",
    "page": "api/registry.html",
    "section": "overview"
  },
  {
    "type": "section",
    "title": "Registry",
    "description": "Koppelt namen aan objecten en controleert dubbele registraties. Canonical import: from arclm.registry import Registry. Fully qualified name: arclm.registry.Registry. Status: Experimental.",
    "page": "api/registry.html",
    "section": "registry"
  },
  {
    "type": "section",
    "title": "Registry parameters",
    "description": "Registry parameters",
    "page": "api/registry.html",
    "section": "registry-parameters"
  },
  {
    "type": "section",
    "title": "Registry example",
    "description": "Registry example",
    "page": "api/registry.html",
    "section": "registry-example"
  },
  {
    "type": "page",
    "title": "Configuration API",
    "description": "Public configuration APIs.",
    "page": "api/configuration.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "Overview",
    "description": "Configuration API documents the public ArcLM APIs in this category.",
    "page": "api/configuration.html",
    "section": "overview"
  },
  {
    "type": "section",
    "title": "Config",
    "description": "Houdt alle belangrijke ArcLM instellingen bij. Canonical import: from arclm.configs import Config. Fully qualified name: arclm.configs.Config. Status: Deprecated.",
    "page": "api/configuration.html",
    "section": "config"
  },
  {
    "type": "section",
    "title": "Config parameters",
    "description": "Config parameters",
    "page": "api/configuration.html",
    "section": "config-parameters"
  },
  {
    "type": "section",
    "title": "Config example",
    "description": "Config example",
    "page": "api/configuration.html",
    "section": "config-example"
  },
  {
    "type": "section",
    "title": "DatasetConfig",
    "description": "Houdt alle belangrijke ArcLM instellingen bij. Canonical import: from arclm.configs import DatasetConfig. Fully qualified name: arclm.configs.DatasetConfig. Status: Deprecated.",
    "page": "api/configuration.html",
    "section": "datasetconfig"
  },
  {
    "type": "section",
    "title": "DatasetConfig parameters",
    "description": "DatasetConfig parameters",
    "page": "api/configuration.html",
    "section": "datasetconfig-parameters"
  },
  {
    "type": "section",
    "title": "DatasetConfig example",
    "description": "DatasetConfig example",
    "page": "api/configuration.html",
    "section": "datasetconfig-example"
  },
  {
    "type": "section",
    "title": "InferenceConfig",
    "description": "Houdt alle belangrijke ArcLM instellingen bij. Canonical import: from arclm.configs import InferenceConfig. Fully qualified name: arclm.configs.InferenceConfig. Status: Deprecated.",
    "page": "api/configuration.html",
    "section": "inferenceconfig"
  },
  {
    "type": "section",
    "title": "InferenceConfig parameters",
    "description": "InferenceConfig parameters",
    "page": "api/configuration.html",
    "section": "inferenceconfig-parameters"
  },
  {
    "type": "section",
    "title": "InferenceConfig example",
    "description": "InferenceConfig example",
    "page": "api/configuration.html",
    "section": "inferenceconfig-example"
  },
  {
    "type": "section",
    "title": "ModelConfig",
    "description": "Houdt alle belangrijke ArcLM instellingen bij. Canonical import: from arclm.configs import ModelConfig. Fully qualified name: arclm.configs.ModelConfig. Status: Deprecated.",
    "page": "api/configuration.html",
    "section": "modelconfig"
  },
  {
    "type": "section",
    "title": "ModelConfig parameters",
    "description": "ModelConfig parameters",
    "page": "api/configuration.html",
    "section": "modelconfig-parameters"
  },
  {
    "type": "section",
    "title": "ModelConfig example",
    "description": "ModelConfig example",
    "page": "api/configuration.html",
    "section": "modelconfig-example"
  },
  {
    "type": "section",
    "title": "TokenizerConfig",
    "description": "Houdt alle belangrijke ArcLM instellingen bij. Canonical import: from arclm.configs import TokenizerConfig. Fully qualified name: arclm.configs.TokenizerConfig. Status: Deprecated.",
    "page": "api/configuration.html",
    "section": "tokenizerconfig"
  },
  {
    "type": "section",
    "title": "TokenizerConfig parameters",
    "description": "TokenizerConfig parameters",
    "page": "api/configuration.html",
    "section": "tokenizerconfig-parameters"
  },
  {
    "type": "section",
    "title": "TokenizerConfig example",
    "description": "TokenizerConfig example",
    "page": "api/configuration.html",
    "section": "tokenizerconfig-example"
  },
  {
    "type": "section",
    "title": "TrainingConfig",
    "description": "Houdt alle belangrijke ArcLM instellingen bij. Canonical import: from arclm.configs import TrainingConfig. Fully qualified name: arclm.configs.TrainingConfig. Status: Deprecated.",
    "page": "api/configuration.html",
    "section": "trainingconfig"
  },
  {
    "type": "section",
    "title": "TrainingConfig parameters",
    "description": "TrainingConfig parameters",
    "page": "api/configuration.html",
    "section": "trainingconfig-parameters"
  },
  {
    "type": "section",
    "title": "TrainingConfig example",
    "description": "TrainingConfig example",
    "page": "api/configuration.html",
    "section": "trainingconfig-example"
  },
  {
    "type": "section",
    "title": "create_config",
    "description": "Maakt een `Config` met praktische defaults. Canonical import: from arclm.configs import create_config. Fully qualified name: arclm.configs.create_config. Status: Deprecated.",
    "page": "api/configuration.html",
    "section": "create-config"
  },
  {
    "type": "section",
    "title": "create_config parameters",
    "description": "create_config parameters",
    "page": "api/configuration.html",
    "section": "create-config-parameters"
  },
  {
    "type": "section",
    "title": "create_config example",
    "description": "create_config example",
    "page": "api/configuration.html",
    "section": "create-config-example"
  },
  {
    "type": "section",
    "title": "create_example_configs",
    "description": "Maakt voorbeeldconfiguraties in de `configs/` map. Canonical import: from arclm.configs import create_example_configs. Fully qualified name: arclm.configs.create_example_configs. Status: Deprecated.",
    "page": "api/configuration.html",
    "section": "create-example-configs"
  },
  {
    "type": "section",
    "title": "create_example_configs parameters",
    "description": "create_example_configs parameters",
    "page": "api/configuration.html",
    "section": "create-example-configs-parameters"
  },
  {
    "type": "section",
    "title": "create_example_configs example",
    "description": "create_example_configs example",
    "page": "api/configuration.html",
    "section": "create-example-configs-example"
  },
  {
    "type": "section",
    "title": "get_finetuning_config",
    "description": "Maakt een config die handig is voor finetuning. Canonical import: from arclm.configs import get_finetuning_config. Fully qualified name: arclm.configs.get_finetuning_config. Status: Deprecated.",
    "page": "api/configuration.html",
    "section": "get-finetuning-config"
  },
  {
    "type": "section",
    "title": "get_finetuning_config parameters",
    "description": "get_finetuning_config parameters",
    "page": "api/configuration.html",
    "section": "get-finetuning-config-parameters"
  },
  {
    "type": "section",
    "title": "get_finetuning_config example",
    "description": "get_finetuning_config example",
    "page": "api/configuration.html",
    "section": "get-finetuning-config-example"
  },
  {
    "type": "section",
    "title": "get_instruction_tuning_config",
    "description": "Maakt een config die handig is voor instruction tuning. Canonical import: from arclm.configs import get_instruction_tuning_config. Fully qualified name: arclm.configs.get_instruction_tuning_config. Status: Deprecated.",
    "page": "api/configuration.html",
    "section": "get-instruction-tuning-config"
  },
  {
    "type": "section",
    "title": "get_instruction_tuning_config parameters",
    "description": "get_instruction_tuning_config parameters",
    "page": "api/configuration.html",
    "section": "get-instruction-tuning-config-parameters"
  },
  {
    "type": "section",
    "title": "get_instruction_tuning_config example",
    "description": "get_instruction_tuning_config example",
    "page": "api/configuration.html",
    "section": "get-instruction-tuning-config-example"
  },
  {
    "type": "section",
    "title": "load_config",
    "description": "Laadt een configbestand en kiest YAML of JSON op basis van extensie. Canonical import: from arclm.configs import load_config. Fully qualified name: arclm.configs.load_config. Status: Deprecated.",
    "page": "api/configuration.html",
    "section": "load-config"
  },
  {
    "type": "section",
    "title": "load_config parameters",
    "description": "load_config parameters",
    "page": "api/configuration.html",
    "section": "load-config-parameters"
  },
  {
    "type": "section",
    "title": "load_config example",
    "description": "load_config example",
    "page": "api/configuration.html",
    "section": "load-config-example"
  },
  {
    "type": "section",
    "title": "load_config_json",
    "description": "Laadt een configuratie uit een JSON-bestand. Canonical import: from arclm.configs import load_config_json. Fully qualified name: arclm.configs.load_config_json. Status: Deprecated.",
    "page": "api/configuration.html",
    "section": "load-config-json"
  },
  {
    "type": "section",
    "title": "load_config_json parameters",
    "description": "load_config_json parameters",
    "page": "api/configuration.html",
    "section": "load-config-json-parameters"
  },
  {
    "type": "section",
    "title": "load_config_json example",
    "description": "load_config_json example",
    "page": "api/configuration.html",
    "section": "load-config-json-example"
  },
  {
    "type": "section",
    "title": "load_config_yaml",
    "description": "Laadt een configuratie uit een YAML-bestand. Canonical import: from arclm.configs import load_config_yaml. Fully qualified name: arclm.configs.load_config_yaml. Status: Deprecated.",
    "page": "api/configuration.html",
    "section": "load-config-yaml"
  },
  {
    "type": "section",
    "title": "load_config_yaml parameters",
    "description": "load_config_yaml parameters",
    "page": "api/configuration.html",
    "section": "load-config-yaml-parameters"
  },
  {
    "type": "section",
    "title": "load_config_yaml example",
    "description": "load_config_yaml example",
    "page": "api/configuration.html",
    "section": "load-config-yaml-example"
  },
  {
    "type": "section",
    "title": "save_config",
    "description": "Slaat een configuratie op en kiest YAML of JSON op basis van extensie. Canonical import: from arclm.configs import save_config. Fully qualified name: arclm.configs.save_config. Status: Deprecated.",
    "page": "api/configuration.html",
    "section": "save-config"
  },
  {
    "type": "section",
    "title": "save_config parameters",
    "description": "save_config parameters",
    "page": "api/configuration.html",
    "section": "save-config-parameters"
  },
  {
    "type": "section",
    "title": "save_config example",
    "description": "save_config example",
    "page": "api/configuration.html",
    "section": "save-config-example"
  },
  {
    "type": "section",
    "title": "save_config_json",
    "description": "Slaat een configuratie op als JSON-bestand. Canonical import: from arclm.configs import save_config_json. Fully qualified name: arclm.configs.save_config_json. Status: Deprecated.",
    "page": "api/configuration.html",
    "section": "save-config-json"
  },
  {
    "type": "section",
    "title": "save_config_json parameters",
    "description": "save_config_json parameters",
    "page": "api/configuration.html",
    "section": "save-config-json-parameters"
  },
  {
    "type": "section",
    "title": "save_config_json example",
    "description": "save_config_json example",
    "page": "api/configuration.html",
    "section": "save-config-json-example"
  },
  {
    "type": "section",
    "title": "save_config_yaml",
    "description": "Slaat een configuratie op als YAML-bestand. Canonical import: from arclm.configs import save_config_yaml. Fully qualified name: arclm.configs.save_config_yaml. Status: Deprecated.",
    "page": "api/configuration.html",
    "section": "save-config-yaml"
  },
  {
    "type": "section",
    "title": "save_config_yaml parameters",
    "description": "save_config_yaml parameters",
    "page": "api/configuration.html",
    "section": "save-config-yaml-parameters"
  },
  {
    "type": "section",
    "title": "save_config_yaml example",
    "description": "save_config_yaml example",
    "page": "api/configuration.html",
    "section": "save-config-yaml-example"
  },
  {
    "type": "page",
    "title": "Errors API",
    "description": "Public errors APIs.",
    "page": "api/errors.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "Overview",
    "description": "Errors API documents the public ArcLM APIs in this category.",
    "page": "api/errors.html",
    "section": "overview"
  },
  {
    "type": "section",
    "title": "ArcLMError",
    "description": "Base exception for ArcLM. Canonical import: from arclm.exceptions import ArcLMError. Fully qualified name: arclm.exceptions.ArcLMError. Status: Stable.",
    "page": "api/errors.html",
    "section": "arclmerror"
  },
  {
    "type": "section",
    "title": "ArcLMError parameters",
    "description": "ArcLMError parameters",
    "page": "api/errors.html",
    "section": "arclmerror-parameters"
  },
  {
    "type": "section",
    "title": "ArcLMError example",
    "description": "ArcLMError example",
    "page": "api/errors.html",
    "section": "arclmerror-example"
  },
  {
    "type": "section",
    "title": "CheckpointError",
    "description": "Raised for checkpoint errors. Canonical import: from arclm.exceptions import CheckpointError. Fully qualified name: arclm.exceptions.CheckpointError. Status: Stable.",
    "page": "api/errors.html",
    "section": "checkpointerror"
  },
  {
    "type": "section",
    "title": "CheckpointError parameters",
    "description": "CheckpointError parameters",
    "page": "api/errors.html",
    "section": "checkpointerror-parameters"
  },
  {
    "type": "section",
    "title": "CheckpointError example",
    "description": "CheckpointError example",
    "page": "api/errors.html",
    "section": "checkpointerror-example"
  },
  {
    "type": "section",
    "title": "CleaningError",
    "description": "Raised when a cleaning step cannot process an example. Canonical import: from arclm.exceptions import CleaningError. Fully qualified name: arclm.exceptions.CleaningError. Status: Stable.",
    "page": "api/errors.html",
    "section": "cleaningerror"
  },
  {
    "type": "section",
    "title": "CleaningError parameters",
    "description": "CleaningError parameters",
    "page": "api/errors.html",
    "section": "cleaningerror-parameters"
  },
  {
    "type": "section",
    "title": "CleaningError example",
    "description": "CleaningError example",
    "page": "api/errors.html",
    "section": "cleaningerror-example"
  },
  {
    "type": "section",
    "title": "ConfigurationError",
    "description": "Raised for invalid configuration. Canonical import: from arclm.exceptions import ConfigurationError. Fully qualified name: arclm.exceptions.ConfigurationError. Status: Stable.",
    "page": "api/errors.html",
    "section": "configurationerror"
  },
  {
    "type": "section",
    "title": "ConfigurationError parameters",
    "description": "ConfigurationError parameters",
    "page": "api/errors.html",
    "section": "configurationerror-parameters"
  },
  {
    "type": "section",
    "title": "ConfigurationError example",
    "description": "ConfigurationError example",
    "page": "api/errors.html",
    "section": "configurationerror-example"
  },
  {
    "type": "section",
    "title": "DataCollatorError",
    "description": "Raised when SFT batches cannot be collated. Canonical import: from arclm.exceptions import DataCollatorError. Fully qualified name: arclm.exceptions.DataCollatorError. Status: Stable.",
    "page": "api/errors.html",
    "section": "datacollatorerror"
  },
  {
    "type": "section",
    "title": "DataCollatorError parameters",
    "description": "DataCollatorError parameters",
    "page": "api/errors.html",
    "section": "datacollatorerror-parameters"
  },
  {
    "type": "section",
    "title": "DataCollatorError example",
    "description": "DataCollatorError example",
    "page": "api/errors.html",
    "section": "datacollatorerror-example"
  },
  {
    "type": "section",
    "title": "DatasetError",
    "description": "Raised for dataset errors. Canonical import: from arclm.exceptions import DatasetError. Fully qualified name: arclm.exceptions.DatasetError. Status: Stable.",
    "page": "api/errors.html",
    "section": "dataseterror"
  },
  {
    "type": "section",
    "title": "DatasetError parameters",
    "description": "DatasetError parameters",
    "page": "api/errors.html",
    "section": "dataseterror-parameters"
  },
  {
    "type": "section",
    "title": "DatasetError example",
    "description": "DatasetError example",
    "page": "api/errors.html",
    "section": "dataseterror-example"
  },
  {
    "type": "section",
    "title": "DatasetLoadError",
    "description": "Raised when a dataset cannot be loaded. Canonical import: from arclm.exceptions import DatasetLoadError. Fully qualified name: arclm.exceptions.DatasetLoadError. Status: Stable.",
    "page": "api/errors.html",
    "section": "datasetloaderror"
  },
  {
    "type": "section",
    "title": "DatasetLoadError parameters",
    "description": "DatasetLoadError parameters",
    "page": "api/errors.html",
    "section": "datasetloaderror-parameters"
  },
  {
    "type": "section",
    "title": "DatasetLoadError example",
    "description": "DatasetLoadError example",
    "page": "api/errors.html",
    "section": "datasetloaderror-example"
  },
  {
    "type": "section",
    "title": "DatasetValidationError",
    "description": "Raised when dataset rows do not match the expected shape. Canonical import: from arclm.exceptions import DatasetValidationError. Fully qualified name: arclm.exceptions.DatasetValidationError. Status: Stable.",
    "page": "api/errors.html",
    "section": "datasetvalidationerror"
  },
  {
    "type": "section",
    "title": "DatasetValidationError parameters",
    "description": "DatasetValidationError parameters",
    "page": "api/errors.html",
    "section": "datasetvalidationerror-parameters"
  },
  {
    "type": "section",
    "title": "DatasetValidationError example",
    "description": "DatasetValidationError example",
    "page": "api/errors.html",
    "section": "datasetvalidationerror-example"
  },
  {
    "type": "section",
    "title": "DatasetVersionError",
    "description": "Raised when local dataset versioning fails. Canonical import: from arclm.exceptions import DatasetVersionError. Fully qualified name: arclm.exceptions.DatasetVersionError. Status: Stable.",
    "page": "api/errors.html",
    "section": "datasetversionerror"
  },
  {
    "type": "section",
    "title": "DatasetVersionError parameters",
    "description": "DatasetVersionError parameters",
    "page": "api/errors.html",
    "section": "datasetversionerror-parameters"
  },
  {
    "type": "section",
    "title": "DatasetVersionError example",
    "description": "DatasetVersionError example",
    "page": "api/errors.html",
    "section": "datasetversionerror-example"
  },
  {
    "type": "section",
    "title": "DeduplicationError",
    "description": "Raised when deduplication fails. Canonical import: from arclm.exceptions import DeduplicationError. Fully qualified name: arclm.exceptions.DeduplicationError. Status: Stable.",
    "page": "api/errors.html",
    "section": "deduplicationerror"
  },
  {
    "type": "section",
    "title": "DeduplicationError parameters",
    "description": "DeduplicationError parameters",
    "page": "api/errors.html",
    "section": "deduplicationerror-parameters"
  },
  {
    "type": "section",
    "title": "DeduplicationError example",
    "description": "DeduplicationError example",
    "page": "api/errors.html",
    "section": "deduplicationerror-example"
  },
  {
    "type": "section",
    "title": "EvaluationConfigError",
    "description": "Raised for invalid evaluation configuration. Canonical import: from arclm.exceptions import EvaluationConfigError. Fully qualified name: arclm.exceptions.EvaluationConfigError. Status: Stable.",
    "page": "api/errors.html",
    "section": "evaluationconfigerror"
  },
  {
    "type": "section",
    "title": "EvaluationConfigError parameters",
    "description": "EvaluationConfigError parameters",
    "page": "api/errors.html",
    "section": "evaluationconfigerror-parameters"
  },
  {
    "type": "section",
    "title": "EvaluationConfigError example",
    "description": "EvaluationConfigError example",
    "page": "api/errors.html",
    "section": "evaluationconfigerror-example"
  },
  {
    "type": "section",
    "title": "EvaluationError",
    "description": "Raised for evaluation errors. Canonical import: from arclm.exceptions import EvaluationError. Fully qualified name: arclm.exceptions.EvaluationError. Status: Stable.",
    "page": "api/errors.html",
    "section": "evaluationerror"
  },
  {
    "type": "section",
    "title": "EvaluationError parameters",
    "description": "EvaluationError parameters",
    "page": "api/errors.html",
    "section": "evaluationerror-parameters"
  },
  {
    "type": "section",
    "title": "EvaluationError example",
    "description": "EvaluationError example",
    "page": "api/errors.html",
    "section": "evaluationerror-example"
  },
  {
    "type": "section",
    "title": "FineTuningError",
    "description": "Raised for fine-tuning errors. Canonical import: from arclm.exceptions import FineTuningError. Fully qualified name: arclm.exceptions.FineTuningError. Status: Stable.",
    "page": "api/errors.html",
    "section": "finetuningerror"
  },
  {
    "type": "section",
    "title": "FineTuningError parameters",
    "description": "FineTuningError parameters",
    "page": "api/errors.html",
    "section": "finetuningerror-parameters"
  },
  {
    "type": "section",
    "title": "FineTuningError example",
    "description": "FineTuningError example",
    "page": "api/errors.html",
    "section": "finetuningerror-example"
  },
  {
    "type": "section",
    "title": "FormattingError",
    "description": "Raised when an SFT example cannot be formatted. Canonical import: from arclm.exceptions import FormattingError. Fully qualified name: arclm.exceptions.FormattingError. Status: Stable.",
    "page": "api/errors.html",
    "section": "formattingerror"
  },
  {
    "type": "section",
    "title": "FormattingError parameters",
    "description": "FormattingError parameters",
    "page": "api/errors.html",
    "section": "formattingerror-parameters"
  },
  {
    "type": "section",
    "title": "FormattingError example",
    "description": "FormattingError example",
    "page": "api/errors.html",
    "section": "formattingerror-example"
  },
  {
    "type": "section",
    "title": "InferenceError",
    "description": "Raised for inference errors. Canonical import: from arclm.exceptions import InferenceError. Fully qualified name: arclm.exceptions.InferenceError. Status: Stable.",
    "page": "api/errors.html",
    "section": "inferenceerror"
  },
  {
    "type": "section",
    "title": "InferenceError parameters",
    "description": "InferenceError parameters",
    "page": "api/errors.html",
    "section": "inferenceerror-parameters"
  },
  {
    "type": "section",
    "title": "InferenceError example",
    "description": "InferenceError example",
    "page": "api/errors.html",
    "section": "inferenceerror-example"
  },
  {
    "type": "section",
    "title": "MetricError",
    "description": "Raised when a metric cannot be computed. Canonical import: from arclm.exceptions import MetricError. Fully qualified name: arclm.exceptions.MetricError. Status: Stable.",
    "page": "api/errors.html",
    "section": "metricerror"
  },
  {
    "type": "section",
    "title": "MetricError parameters",
    "description": "MetricError parameters",
    "page": "api/errors.html",
    "section": "metricerror-parameters"
  },
  {
    "type": "section",
    "title": "MetricError example",
    "description": "MetricError example",
    "page": "api/errors.html",
    "section": "metricerror-example"
  },
  {
    "type": "section",
    "title": "ModelAdapterError",
    "description": "Raised when a model adapter cannot call or read a model. Canonical import: from arclm.exceptions import ModelAdapterError. Fully qualified name: arclm.exceptions.ModelAdapterError. Status: Stable.",
    "page": "api/errors.html",
    "section": "modeladaptererror"
  },
  {
    "type": "section",
    "title": "ModelAdapterError parameters",
    "description": "ModelAdapterError parameters",
    "page": "api/errors.html",
    "section": "modeladaptererror-parameters"
  },
  {
    "type": "section",
    "title": "ModelAdapterError example",
    "description": "ModelAdapterError example",
    "page": "api/errors.html",
    "section": "modeladaptererror-example"
  },
  {
    "type": "section",
    "title": "ModelLoadError",
    "description": "Raised when model loading fails. Canonical import: from arclm.exceptions import ModelLoadError. Fully qualified name: arclm.exceptions.ModelLoadError. Status: Stable.",
    "page": "api/errors.html",
    "section": "modelloaderror"
  },
  {
    "type": "section",
    "title": "ModelLoadError parameters",
    "description": "ModelLoadError parameters",
    "page": "api/errors.html",
    "section": "modelloaderror-parameters"
  },
  {
    "type": "section",
    "title": "ModelLoadError example",
    "description": "ModelLoadError example",
    "page": "api/errors.html",
    "section": "modelloaderror-example"
  },
  {
    "type": "section",
    "title": "OptionalDependencyError",
    "description": "Raised when an optional dependency is required but not installed. Canonical import: from arclm.exceptions import OptionalDependencyError. Fully qualified name: arclm.exceptions.OptionalDependencyError. Status: Stable.",
    "page": "api/errors.html",
    "section": "optionaldependencyerror"
  },
  {
    "type": "section",
    "title": "OptionalDependencyError parameters",
    "description": "OptionalDependencyError parameters",
    "page": "api/errors.html",
    "section": "optionaldependencyerror-parameters"
  },
  {
    "type": "section",
    "title": "OptionalDependencyError example",
    "description": "OptionalDependencyError example",
    "page": "api/errors.html",
    "section": "optionaldependencyerror-example"
  },
  {
    "type": "section",
    "title": "PipelineError",
    "description": "Raised when a data pipeline step fails. Canonical import: from arclm.exceptions import PipelineError. Fully qualified name: arclm.exceptions.PipelineError. Status: Stable.",
    "page": "api/errors.html",
    "section": "pipelineerror"
  },
  {
    "type": "section",
    "title": "PipelineError parameters",
    "description": "PipelineError parameters",
    "page": "api/errors.html",
    "section": "pipelineerror-parameters"
  },
  {
    "type": "section",
    "title": "PipelineError example",
    "description": "PipelineError example",
    "page": "api/errors.html",
    "section": "pipelineerror-example"
  },
  {
    "type": "section",
    "title": "PrecisionError",
    "description": "Raised when requested training precision is not supported. Canonical import: from arclm.exceptions import PrecisionError. Fully qualified name: arclm.exceptions.PrecisionError. Status: Stable.",
    "page": "api/errors.html",
    "section": "precisionerror"
  },
  {
    "type": "section",
    "title": "PrecisionError parameters",
    "description": "PrecisionError parameters",
    "page": "api/errors.html",
    "section": "precisionerror-parameters"
  },
  {
    "type": "section",
    "title": "PrecisionError example",
    "description": "PrecisionError example",
    "page": "api/errors.html",
    "section": "precisionerror-example"
  },
  {
    "type": "section",
    "title": "SFTConfigError",
    "description": "Raised for invalid SFT configuration. Canonical import: from arclm.exceptions import SFTConfigError. Fully qualified name: arclm.exceptions.SFTConfigError. Status: Stable.",
    "page": "api/errors.html",
    "section": "sftconfigerror"
  },
  {
    "type": "section",
    "title": "SFTConfigError parameters",
    "description": "SFTConfigError parameters",
    "page": "api/errors.html",
    "section": "sftconfigerror-parameters"
  },
  {
    "type": "section",
    "title": "SFTConfigError example",
    "description": "SFTConfigError example",
    "page": "api/errors.html",
    "section": "sftconfigerror-example"
  },
  {
    "type": "section",
    "title": "StreamingError",
    "description": "Raised when a streaming dataset cannot be read. Canonical import: from arclm.exceptions import StreamingError. Fully qualified name: arclm.exceptions.StreamingError. Status: Stable.",
    "page": "api/errors.html",
    "section": "streamingerror"
  },
  {
    "type": "section",
    "title": "StreamingError parameters",
    "description": "StreamingError parameters",
    "page": "api/errors.html",
    "section": "streamingerror-parameters"
  },
  {
    "type": "section",
    "title": "StreamingError example",
    "description": "StreamingError example",
    "page": "api/errors.html",
    "section": "streamingerror-example"
  },
  {
    "type": "section",
    "title": "SyntheticDataError",
    "description": "Raised when synthetic data generation fails. Canonical import: from arclm.exceptions import SyntheticDataError. Fully qualified name: arclm.exceptions.SyntheticDataError. Status: Stable.",
    "page": "api/errors.html",
    "section": "syntheticdataerror"
  },
  {
    "type": "section",
    "title": "SyntheticDataError parameters",
    "description": "SyntheticDataError parameters",
    "page": "api/errors.html",
    "section": "syntheticdataerror-parameters"
  },
  {
    "type": "section",
    "title": "SyntheticDataError example",
    "description": "SyntheticDataError example",
    "page": "api/errors.html",
    "section": "syntheticdataerror-example"
  },
  {
    "type": "section",
    "title": "TokenizerAdapterError",
    "description": "Raised when a tokenizer adapter cannot encode data. Canonical import: from arclm.exceptions import TokenizerAdapterError. Fully qualified name: arclm.exceptions.TokenizerAdapterError. Status: Stable.",
    "page": "api/errors.html",
    "section": "tokenizeradaptererror"
  },
  {
    "type": "section",
    "title": "TokenizerAdapterError parameters",
    "description": "TokenizerAdapterError parameters",
    "page": "api/errors.html",
    "section": "tokenizeradaptererror-parameters"
  },
  {
    "type": "section",
    "title": "TokenizerAdapterError example",
    "description": "TokenizerAdapterError example",
    "page": "api/errors.html",
    "section": "tokenizeradaptererror-example"
  },
  {
    "type": "section",
    "title": "TokenizerError",
    "description": "Raised for tokenizer errors. Canonical import: from arclm.exceptions import TokenizerError. Fully qualified name: arclm.exceptions.TokenizerError. Status: Stable.",
    "page": "api/errors.html",
    "section": "tokenizererror"
  },
  {
    "type": "section",
    "title": "TokenizerError parameters",
    "description": "TokenizerError parameters",
    "page": "api/errors.html",
    "section": "tokenizererror-parameters"
  },
  {
    "type": "section",
    "title": "TokenizerError example",
    "description": "TokenizerError example",
    "page": "api/errors.html",
    "section": "tokenizererror-example"
  },
  {
    "type": "section",
    "title": "TrainingConfigError",
    "description": "Raised for invalid training configuration. Canonical import: from arclm.exceptions import TrainingConfigError. Fully qualified name: arclm.exceptions.TrainingConfigError. Status: Stable.",
    "page": "api/errors.html",
    "section": "trainingconfigerror"
  },
  {
    "type": "section",
    "title": "TrainingConfigError parameters",
    "description": "TrainingConfigError parameters",
    "page": "api/errors.html",
    "section": "trainingconfigerror-parameters"
  },
  {
    "type": "section",
    "title": "TrainingConfigError example",
    "description": "TrainingConfigError example",
    "page": "api/errors.html",
    "section": "trainingconfigerror-example"
  },
  {
    "type": "section",
    "title": "TrainingError",
    "description": "Raised for training errors. Canonical import: from arclm.exceptions import TrainingError. Fully qualified name: arclm.exceptions.TrainingError. Status: Stable.",
    "page": "api/errors.html",
    "section": "trainingerror"
  },
  {
    "type": "section",
    "title": "TrainingError parameters",
    "description": "TrainingError parameters",
    "page": "api/errors.html",
    "section": "trainingerror-parameters"
  },
  {
    "type": "section",
    "title": "TrainingError example",
    "description": "TrainingError example",
    "page": "api/errors.html",
    "section": "trainingerror-example"
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
    "title": "Agent Examples",
    "description": "Self-contained examples.",
    "page": "examples/agent-examples.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "How examples work",
    "description": "Each example is embedded in the public site and available as a standalone download inside the site assets.",
    "page": "examples/agent-examples.html",
    "section": "how-examples-work"
  },
  {
    "type": "section",
    "title": "Included examples",
    "description": "Included examples",
    "page": "examples/agent-examples.html",
    "section": "included-examples"
  },
  {
    "type": "page",
    "title": "Security Examples",
    "description": "Self-contained examples.",
    "page": "examples/security-examples.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "How examples work",
    "description": "Each example is embedded in the public site and available as a standalone download inside the site assets.",
    "page": "examples/security-examples.html",
    "section": "how-examples-work"
  },
  {
    "type": "section",
    "title": "Included examples",
    "description": "Included examples",
    "page": "examples/security-examples.html",
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
    "title": "Class Index",
    "description": "Search and filter public classes.",
    "page": "reference/classes.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "Coverage",
    "description": "This page is generated from current public package exports and includes classes and public exceptions. Use the filters to narrow by subsystem or status.",
    "page": "reference/classes.html",
    "section": "coverage"
  },
  {
    "type": "page",
    "title": "Function Index",
    "description": "Search and filter public functions.",
    "page": "reference/functions.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "Coverage",
    "description": "This page is generated from current public package exports and includes synchronous and asynchronous public functions.",
    "page": "reference/functions.html",
    "section": "coverage"
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
    "title": "Optional Dependencies",
    "description": "Extras and optional integration boundaries.",
    "page": "reference/optional-dependencies.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "Extras",
    "description": "Extras",
    "page": "reference/optional-dependencies.html",
    "section": "extras"
  },
  {
    "type": "section",
    "title": "Policy",
    "description": "Policy",
    "page": "reference/optional-dependencies.html",
    "section": "policy"
  },
  {
    "type": "page",
    "title": "Compatibility",
    "description": "Deprecated and compatibility APIs.",
    "page": "reference/compatibility.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "Compatibility policy",
    "description": "Deprecated imports remain documented with replacements while tests and users need them. New examples prefer canonical domain imports.",
    "page": "reference/compatibility.html",
    "section": "compatibility-policy"
  },
  {
    "type": "section",
    "title": "Compatibility surfaces",
    "description": "Compatibility surfaces",
    "page": "reference/compatibility.html",
    "section": "compatibility-surfaces"
  },
  {
    "type": "page",
    "title": "Deprecated APIs",
    "description": "Migration notes for compatibility-only names.",
    "page": "reference/deprecated-apis.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "Migration rule",
    "description": "Prefer canonical domain imports for new code. Deprecated names are compatibility-only and should not appear in new examples.",
    "page": "reference/deprecated-apis.html",
    "section": "migration-rule"
  },
  {
    "type": "section",
    "title": "Known deprecated entries",
    "description": "Known deprecated entries",
    "page": "reference/deprecated-apis.html",
    "section": "known-deprecated-entries"
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
    "type": "page",
    "title": "Contributor Architecture",
    "description": "Repository structure and extension points.",
    "page": "contributing/architecture.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "Ownership model",
    "description": "The Python package is the source of truth for public APIs. The documentation site is generated from repository data plus curated guide copy.",
    "page": "contributing/architecture.html",
    "section": "ownership-model"
  },
  {
    "type": "section",
    "title": "Extension areas",
    "description": "Extension areas",
    "page": "contributing/architecture.html",
    "section": "extension-areas"
  },
  {
    "type": "page",
    "title": "Testing",
    "description": "How to validate documentation and code changes.",
    "page": "contributing/testing.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "Core checks",
    "description": "Core checks",
    "page": "contributing/testing.html",
    "section": "core-checks"
  },
  {
    "type": "page",
    "title": "Docs Build",
    "description": "Build and validate the static documentation website.",
    "page": "contributing/docs-build.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "Docs ownership",
    "description": "The `tools/build_documentation_site.py` generator owns the static site output in `documentation-site/`. Handwritten project notes remain in `docs/`.",
    "page": "contributing/docs-build.html",
    "section": "docs-ownership"
  },
  {
    "type": "section",
    "title": "Build docs",
    "description": "Build docs",
    "page": "contributing/docs-build.html",
    "section": "build-docs"
  },
  {
    "type": "section",
    "title": "Feedback",
    "description": "Each page exposes a local helpful button, copy-page-id action and optional issue link. No tracking service is used.",
    "page": "contributing/docs-build.html",
    "section": "feedback"
  },
  {
    "type": "page",
    "title": "Current Version",
    "description": "Current documentation version and release state.",
    "page": "releases/current.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "Current docs",
    "description": "This documentation describes the installed package version reported by the current repository. It does not change the package version.",
    "page": "releases/current.html",
    "section": "current-docs"
  },
  {
    "type": "section",
    "title": "Version strategy",
    "description": "Version strategy",
    "page": "releases/current.html",
    "section": "version-strategy"
  },
  {
    "type": "page",
    "title": "Version History",
    "description": "Known documentation and package history.",
    "page": "releases/version-history.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "Artifacts",
    "description": "Artifacts",
    "page": "releases/version-history.html",
    "section": "artifacts"
  },
  {
    "type": "page",
    "title": "Migration Guides",
    "description": "Migration notes for current users.",
    "page": "releases/migration.html",
    "section": ""
  },
  {
    "type": "section",
    "title": "Recommended migrations",
    "description": "Recommended migrations",
    "page": "releases/migration.html",
    "section": "recommended-migrations"
  },
  {
    "type": "api",
    "title": "Agent",
    "description": "arclm.agents.Agent from arclm.agents import Agent Behavior description for a bounded tool-using agent.",
    "page": "api/agents.html",
    "section": "agent"
  },
  {
    "type": "api",
    "title": "AgentCapabilityReport",
    "description": "arclm.agents.AgentCapabilityReport from arclm.agents import AgentCapabilityReport Honest runtime capability report.",
    "page": "api/agents.html",
    "section": "agentcapabilityreport"
  },
  {
    "type": "api",
    "title": "AgentConfig",
    "description": "arclm.agents.AgentConfig from arclm.agents import AgentConfig Serializable agent configuration without callables or secrets.",
    "page": "api/agents.html",
    "section": "agentconfig"
  },
  {
    "type": "api",
    "title": "AgentMessage",
    "description": "arclm.agents.AgentMessage from arclm.agents import AgentMessage Serializable provider-independent message.",
    "page": "api/agents.html",
    "section": "agentmessage"
  },
  {
    "type": "api",
    "title": "AgentModel",
    "description": "arclm.agents.AgentModel from arclm.agents import AgentModel Protocol implemented by provider-specific model adapters.",
    "page": "api/agents.html",
    "section": "agentmodel"
  },
  {
    "type": "api",
    "title": "AgentResource",
    "description": "arclm.agents.AgentResource from arclm.agents import AgentResource Read-only content that can be provided as agent context.",
    "page": "api/agents.html",
    "section": "agentresource"
  },
  {
    "type": "api",
    "title": "AgentRunner",
    "description": "arclm.agents.AgentRunner from arclm.agents import AgentRunner Execute agent behavior with bounded model/tool steps.",
    "page": "api/agents.html",
    "section": "agentrunner"
  },
  {
    "type": "api",
    "title": "AgentRunnerConfig",
    "description": "arclm.agents.AgentRunnerConfig from arclm.agents import AgentRunnerConfig Serializable runner configuration.",
    "page": "api/agents.html",
    "section": "agentrunnerconfig"
  },
  {
    "type": "api",
    "title": "AgentRunResult",
    "description": "arclm.agents.AgentRunResult from arclm.agents import AgentRunResult Final outcome of a bounded agent run.",
    "page": "api/agents.html",
    "section": "agentrunresult"
  },
  {
    "type": "api",
    "title": "AgentSession",
    "description": "arclm.agents.AgentSession from arclm.agents import AgentSession Bounded in-memory session state.",
    "page": "api/agents.html",
    "section": "agentsession"
  },
  {
    "type": "api",
    "title": "AgentTrace",
    "description": "arclm.agents.AgentTrace from arclm.agents import AgentTrace Trace for one agent run.",
    "page": "api/agents.html",
    "section": "agenttrace"
  },
  {
    "type": "api",
    "title": "AgentTraceEvent",
    "description": "arclm.agents.AgentTraceEvent from arclm.agents import AgentTraceEvent One safe trace event.",
    "page": "api/agents.html",
    "section": "agenttraceevent"
  },
  {
    "type": "api",
    "title": "ApprovalDecision",
    "description": "arclm.agents.ApprovalDecision from arclm.agents import ApprovalDecision Decision returned by an approval handler.",
    "page": "api/agents.html",
    "section": "approvaldecision"
  },
  {
    "type": "api",
    "title": "ArcLMJSONToolAdapter",
    "description": "arclm.agents.ArcLMJSONToolAdapter from arclm.agents import ArcLMJSONToolAdapter Small adapter for ArcLM-style generation callables using strict JSON.",
    "page": "api/agents.html",
    "section": "arclmjsontooladapter"
  },
  {
    "type": "api",
    "title": "AutoApprovalHandler",
    "description": "arclm.agents.AutoApprovalHandler from arclm.agents import AutoApprovalHandler Simple handler for tests and trusted local demos.",
    "page": "api/agents.html",
    "section": "autoapprovalhandler"
  },
  {
    "type": "api",
    "title": "CallableModelAdapter",
    "description": "arclm.agents.CallableModelAdapter from arclm.agents import CallableModelAdapter Adapter around a developer-supplied callable.",
    "page": "api/agents.html",
    "section": "callablemodeladapter"
  },
  {
    "type": "api",
    "title": "CapabilityStatus",
    "description": "arclm.agents.CapabilityStatus from arclm.agents import CapabilityStatus Agent capability status.",
    "page": "api/agents.html",
    "section": "capabilitystatus"
  },
  {
    "type": "api",
    "title": "DenyApprovalHandler",
    "description": "arclm.agents.DenyApprovalHandler from arclm.agents import DenyApprovalHandler Default handler that denies requests requiring approval.",
    "page": "api/agents.html",
    "section": "denyapprovalhandler"
  },
  {
    "type": "api",
    "title": "DocumentToolConfig",
    "description": "arclm.agents.DocumentToolConfig from arclm.agents import DocumentToolConfig Serializable document-tool limits.",
    "page": "api/agents.html",
    "section": "documenttoolconfig"
  },
  {
    "type": "api",
    "title": "FakeSpeechToTextBackend",
    "description": "arclm.agents.FakeSpeechToTextBackend from arclm.agents import FakeSpeechToTextBackend Deterministic backend for tests and examples.",
    "page": "api/agents.html",
    "section": "fakespeechtotextbackend"
  },
  {
    "type": "api",
    "title": "FinalResponse",
    "description": "arclm.agents.FinalResponse from arclm.agents import FinalResponse Response returned by an agent model adapter.",
    "page": "api/agents.html",
    "section": "finalresponse"
  },
  {
    "type": "api",
    "title": "InMemoryResourceProvider",
    "description": "arclm.agents.InMemoryResourceProvider from arclm.agents import InMemoryResourceProvider Minimal in-memory resource provider.",
    "page": "api/agents.html",
    "section": "inmemoryresourceprovider"
  },
  {
    "type": "api",
    "title": "JSONToolCallingAdapter",
    "description": "arclm.agents.JSONToolCallingAdapter from arclm.agents import JSONToolCallingAdapter Strict JSON protocol adapter for plain generation callables.",
    "page": "api/agents.html",
    "section": "jsontoolcallingadapter"
  },
  {
    "type": "api",
    "title": "ModelResponse",
    "description": "arclm.agents.ModelResponse from arclm.agents import ModelResponse Response returned by an agent model adapter.",
    "page": "api/agents.html",
    "section": "modelresponse"
  },
  {
    "type": "api",
    "title": "ResourceProvider",
    "description": "arclm.agents.ResourceProvider from arclm.agents import ResourceProvider Protocol for read-only resource providers.",
    "page": "api/agents.html",
    "section": "resourceprovider"
  },
  {
    "type": "api",
    "title": "SessionConfig",
    "description": "arclm.agents.SessionConfig from arclm.agents import SessionConfig Serializable session configuration.",
    "page": "api/agents.html",
    "section": "sessionconfig"
  },
  {
    "type": "api",
    "title": "SideEffectLevel",
    "description": "arclm.agents.SideEffectLevel from arclm.agents import SideEffectLevel Declared side-effect level for a tool.",
    "page": "api/agents.html",
    "section": "sideeffectlevel"
  },
  {
    "type": "api",
    "title": "SpeechToTextBackend",
    "description": "arclm.agents.SpeechToTextBackend from arclm.agents import SpeechToTextBackend Protocol for speech-to-text backends.",
    "page": "api/agents.html",
    "section": "speechtotextbackend"
  },
  {
    "type": "api",
    "title": "Tool",
    "description": "arclm.agents.Tool from arclm.agents import Tool Callable tool with strict schema validation and structured results.",
    "page": "api/agents.html",
    "section": "tool"
  },
  {
    "type": "api",
    "title": "ToolApprovalHandler",
    "description": "arclm.agents.ToolApprovalHandler from arclm.agents import ToolApprovalHandler Protocol for human or application approval handlers.",
    "page": "api/agents.html",
    "section": "toolapprovalhandler"
  },
  {
    "type": "api",
    "title": "ToolApprovalRequest",
    "description": "arclm.agents.ToolApprovalRequest from arclm.agents import ToolApprovalRequest Safe approval request metadata.",
    "page": "api/agents.html",
    "section": "toolapprovalrequest"
  },
  {
    "type": "api",
    "title": "ToolCall",
    "description": "arclm.agents.ToolCall from arclm.agents import ToolCall Provider-independent request to invoke a tool.",
    "page": "api/agents.html",
    "section": "toolcall"
  },
  {
    "type": "api",
    "title": "ToolCollection",
    "description": "arclm.agents.ToolCollection from arclm.agents import ToolCollection Reusable named group of tools.",
    "page": "api/agents.html",
    "section": "toolcollection"
  },
  {
    "type": "api",
    "title": "ToolContext",
    "description": "arclm.agents.ToolContext from arclm.agents import ToolContext Bounded context for one tool invocation.",
    "page": "api/agents.html",
    "section": "toolcontext"
  },
  {
    "type": "api",
    "title": "ToolPermission",
    "description": "arclm.agents.ToolPermission from arclm.agents import ToolPermission Permission categories a tool may request.",
    "page": "api/agents.html",
    "section": "toolpermission"
  },
  {
    "type": "api",
    "title": "ToolPolicy",
    "description": "arclm.agents.ToolPolicy from arclm.agents import ToolPolicy Runtime policy controlling which tools may run.",
    "page": "api/agents.html",
    "section": "toolpolicy"
  },
  {
    "type": "api",
    "title": "ToolRegistry",
    "description": "arclm.agents.ToolRegistry from arclm.agents import ToolRegistry Deterministic registry for agent tools.",
    "page": "api/agents.html",
    "section": "toolregistry"
  },
  {
    "type": "api",
    "title": "ToolResult",
    "description": "arclm.agents.ToolResult from arclm.agents import ToolResult Structured tool invocation result.",
    "page": "api/agents.html",
    "section": "toolresult"
  },
  {
    "type": "api",
    "title": "ToolSpec",
    "description": "arclm.agents.ToolSpec from arclm.agents import ToolSpec Serializable metadata describing a tool.",
    "page": "api/agents.html",
    "section": "toolspec"
  },
  {
    "type": "api",
    "title": "TraceConfig",
    "description": "arclm.agents.TraceConfig from arclm.agents import TraceConfig Serializable trace configuration.",
    "page": "api/agents.html",
    "section": "traceconfig"
  },
  {
    "type": "api",
    "title": "TranscriptionRequest",
    "description": "arclm.agents.TranscriptionRequest from arclm.agents import TranscriptionRequest Speech-to-text request.",
    "page": "api/agents.html",
    "section": "transcriptionrequest"
  },
  {
    "type": "api",
    "title": "TranscriptionResult",
    "description": "arclm.agents.TranscriptionResult from arclm.agents import TranscriptionResult Structured speech-to-text result.",
    "page": "api/agents.html",
    "section": "transcriptionresult"
  },
  {
    "type": "api",
    "title": "WebToolConfig",
    "description": "arclm.agents.WebToolConfig from arclm.agents import WebToolConfig Serializable web-tool limits.",
    "page": "api/agents.html",
    "section": "webtoolconfig"
  },
  {
    "type": "api",
    "title": "AgentRuntimeError",
    "description": "arclm.agents.AgentRuntimeError from arclm.agents import AgentRuntimeError Base error for the ArcLM Agent Runtime.",
    "page": "api/agents.html",
    "section": "agentruntimeerror"
  },
  {
    "type": "api",
    "title": "OptionalAgentDependencyError",
    "description": "arclm.agents.OptionalAgentDependencyError from arclm.agents import OptionalAgentDependencyError Raised when an optional agent integration dependency is unavailable.",
    "page": "api/agents.html",
    "section": "optionalagentdependencyerror"
  },
  {
    "type": "api",
    "title": "ToolError",
    "description": "arclm.agents.ToolError from arclm.agents import ToolError Raised when a tool cannot be built, validated, or executed.",
    "page": "api/agents.html",
    "section": "toolerror"
  },
  {
    "type": "api",
    "title": "ToolSchemaError",
    "description": "arclm.agents.ToolSchemaError from arclm.agents import ToolSchemaError Raised when a callable cannot be represented as a safe tool schema.",
    "page": "api/agents.html",
    "section": "toolschemaerror"
  },
  {
    "type": "api",
    "title": "ToolValidationError",
    "description": "arclm.agents.ToolValidationError from arclm.agents import ToolValidationError Raised when model-provided tool arguments fail validation.",
    "page": "api/agents.html",
    "section": "toolvalidationerror"
  },
  {
    "type": "api",
    "title": "get_agent_capabilities",
    "description": "arclm.agents.get_agent_capabilities from arclm.agents import get_agent_capabilities Return the base Agent Runtime capability report.",
    "page": "api/agents.html",
    "section": "get-agent-capabilities"
  },
  {
    "type": "api",
    "title": "tool",
    "description": "arclm.agents.tool from arclm.agents import tool Decorator that exposes a typed Python function as a Tool.",
    "page": "api/agents.html",
    "section": "tool"
  },
  {
    "type": "api",
    "title": "AdaptedModelBundle",
    "description": "arclm.checkpoints.AdaptedModelBundle from arclm.checkpoints import AdaptedModelBundle ArcLM model and metadata produced from a normalized checkpoint.",
    "page": "api/checkpoints.html",
    "section": "adaptedmodelbundle"
  },
  {
    "type": "api",
    "title": "CheckpointInfo",
    "description": "arclm.checkpoints.CheckpointInfo from arclm.checkpoints import CheckpointInfo Beschrijft een training checkpoint zonder training te starten.",
    "page": "api/checkpoints.html",
    "section": "checkpointinfo"
  },
  {
    "type": "api",
    "title": "CheckpointLoader",
    "description": "arclm.checkpoints.CheckpointLoader from arclm.checkpoints import CheckpointLoader Base class for source-specific checkpoint loaders.",
    "page": "api/checkpoints.html",
    "section": "checkpointloader"
  },
  {
    "type": "api",
    "title": "LoadedCheckpoint",
    "description": "arclm.checkpoints.LoadedCheckpoint from arclm.checkpoints import LoadedCheckpoint Normalized representation of a model source that ArcLM can inspect.",
    "page": "api/checkpoints.html",
    "section": "loadedcheckpoint"
  },
  {
    "type": "api",
    "title": "LoaderRegistry",
    "description": "arclm.checkpoints.LoaderRegistry from arclm.checkpoints import LoaderRegistry Ordered registry that picks the first loader matching a source.",
    "page": "api/checkpoints.html",
    "section": "loaderregistry"
  },
  {
    "type": "api",
    "title": "LoadPlan",
    "description": "arclm.checkpoints.LoadPlan from arclm.checkpoints import LoadPlan Detected and user-selected settings for loading a model source.",
    "page": "api/checkpoints.html",
    "section": "loadplan"
  },
  {
    "type": "api",
    "title": "ModelInspector",
    "description": "arclm.checkpoints.ModelInspector from arclm.checkpoints import ModelInspector Base class for source inspectors used by ``SmartLoader``.",
    "page": "api/checkpoints.html",
    "section": "modelinspector"
  },
  {
    "type": "api",
    "title": "SmartLoader",
    "description": "arclm.checkpoints.SmartLoader from arclm.checkpoints import SmartLoader High-level loading entry point with inspection and manual overrides.",
    "page": "api/checkpoints.html",
    "section": "smartloader"
  },
  {
    "type": "api",
    "title": "CHECKPOINT_FORMAT",
    "description": "arclm.checkpoints.CHECKPOINT_FORMAT from arclm.checkpoints import CHECKPOINT_FORMAT str(object='') -> str str(bytes_or_buffer[, encoding[, errors]]) -> str Create a new string object from the given object.",
    "page": "api/checkpoints.html",
    "section": "checkpoint-format"
  },
  {
    "type": "api",
    "title": "CHECKPOINT_VERSION",
    "description": "arclm.checkpoints.CHECKPOINT_VERSION from arclm.checkpoints import CHECKPOINT_VERSION int([x]) -> integer int(x, base=10) -> integer Convert a number or string to an integer, or return 0 if no arguments are given.",
    "page": "api/checkpoints.html",
    "section": "checkpoint-version"
  },
  {
    "type": "api",
    "title": "adapt_for_training",
    "description": "arclm.checkpoints.adapt_for_training from arclm.checkpoints import adapt_for_training Create an ArcLM model from a normalized checkpoint.",
    "page": "api/checkpoints.html",
    "section": "adapt-for-training"
  },
  {
    "type": "api",
    "title": "create_default_registry",
    "description": "arclm.checkpoints.create_default_registry from arclm.checkpoints import create_default_registry Maakt de standaard registry met loaders.",
    "page": "api/checkpoints.html",
    "section": "create-default-registry"
  },
  {
    "type": "api",
    "title": "inspect_checkpoint",
    "description": "arclm.checkpoints.inspect_checkpoint from arclm.checkpoints import inspect_checkpoint Inspecteert een vertrouwd training checkpoint zonder objects te maken.",
    "page": "api/checkpoints.html",
    "section": "inspect-checkpoint"
  },
  {
    "type": "api",
    "title": "inspect_model_source",
    "description": "arclm.checkpoints.inspect_model_source from arclm.checkpoints import inspect_model_source Inspect a model source and merge explicit user settings over detections.",
    "page": "api/checkpoints.html",
    "section": "inspect-model-source"
  },
  {
    "type": "api",
    "title": "load_external_model",
    "description": "arclm.checkpoints.load_external_model from arclm.checkpoints import load_external_model Load any supported external source into a normalized checkpoint bundle.",
    "page": "api/checkpoints.html",
    "section": "load-external-model"
  },
  {
    "type": "api",
    "title": "register_model_inspector",
    "description": "arclm.checkpoints.register_model_inspector from arclm.checkpoints import register_model_inspector Register a custom model-source inspector.",
    "page": "api/checkpoints.html",
    "section": "register-model-inspector"
  },
  {
    "type": "api",
    "title": "validate_checkpoint",
    "description": "arclm.checkpoints.validate_checkpoint from arclm.checkpoints import validate_checkpoint Valideert een checkpoint en geeft de veilige inspectie-info terug.",
    "page": "api/checkpoints.html",
    "section": "validate-checkpoint"
  },
  {
    "type": "api",
    "title": "validate_tokenizer_compatibility",
    "description": "arclm.checkpoints.validate_tokenizer_compatibility from arclm.checkpoints import validate_tokenizer_compatibility Raise if a tokenizer cannot safely address the checkpoint vocabulary.",
    "page": "api/checkpoints.html",
    "section": "validate-tokenizer-compatibility"
  },
  {
    "type": "api",
    "title": "Config",
    "description": "arclm.configs.Config from arclm.configs import Config Houdt alle belangrijke ArcLM instellingen bij.",
    "page": "api/configuration.html",
    "section": "config"
  },
  {
    "type": "api",
    "title": "DatasetConfig",
    "description": "arclm.configs.DatasetConfig from arclm.configs import DatasetConfig Houdt alle belangrijke ArcLM instellingen bij.",
    "page": "api/configuration.html",
    "section": "datasetconfig"
  },
  {
    "type": "api",
    "title": "InferenceConfig",
    "description": "arclm.configs.InferenceConfig from arclm.configs import InferenceConfig Houdt alle belangrijke ArcLM instellingen bij.",
    "page": "api/configuration.html",
    "section": "inferenceconfig"
  },
  {
    "type": "api",
    "title": "ModelConfig",
    "description": "arclm.configs.ModelConfig from arclm.configs import ModelConfig Houdt alle belangrijke ArcLM instellingen bij.",
    "page": "api/configuration.html",
    "section": "modelconfig"
  },
  {
    "type": "api",
    "title": "TokenizerConfig",
    "description": "arclm.configs.TokenizerConfig from arclm.configs import TokenizerConfig Houdt alle belangrijke ArcLM instellingen bij.",
    "page": "api/configuration.html",
    "section": "tokenizerconfig"
  },
  {
    "type": "api",
    "title": "TrainingConfig",
    "description": "arclm.configs.TrainingConfig from arclm.configs import TrainingConfig Houdt alle belangrijke ArcLM instellingen bij.",
    "page": "api/configuration.html",
    "section": "trainingconfig"
  },
  {
    "type": "api",
    "title": "create_config",
    "description": "arclm.configs.create_config from arclm.configs import create_config Maakt een `Config` met praktische defaults.",
    "page": "api/configuration.html",
    "section": "create-config"
  },
  {
    "type": "api",
    "title": "create_example_configs",
    "description": "arclm.configs.create_example_configs from arclm.configs import create_example_configs Maakt voorbeeldconfiguraties in de `configs/` map.",
    "page": "api/configuration.html",
    "section": "create-example-configs"
  },
  {
    "type": "api",
    "title": "get_finetuning_config",
    "description": "arclm.configs.get_finetuning_config from arclm.configs import get_finetuning_config Maakt een config die handig is voor finetuning.",
    "page": "api/configuration.html",
    "section": "get-finetuning-config"
  },
  {
    "type": "api",
    "title": "get_instruction_tuning_config",
    "description": "arclm.configs.get_instruction_tuning_config from arclm.configs import get_instruction_tuning_config Maakt een config die handig is voor instruction tuning.",
    "page": "api/configuration.html",
    "section": "get-instruction-tuning-config"
  },
  {
    "type": "api",
    "title": "load_config",
    "description": "arclm.configs.load_config from arclm.configs import load_config Laadt een configbestand en kiest YAML of JSON op basis van extensie.",
    "page": "api/configuration.html",
    "section": "load-config"
  },
  {
    "type": "api",
    "title": "load_config_json",
    "description": "arclm.configs.load_config_json from arclm.configs import load_config_json Laadt een configuratie uit een JSON-bestand.",
    "page": "api/configuration.html",
    "section": "load-config-json"
  },
  {
    "type": "api",
    "title": "load_config_yaml",
    "description": "arclm.configs.load_config_yaml from arclm.configs import load_config_yaml Laadt een configuratie uit een YAML-bestand.",
    "page": "api/configuration.html",
    "section": "load-config-yaml"
  },
  {
    "type": "api",
    "title": "save_config",
    "description": "arclm.configs.save_config from arclm.configs import save_config Slaat een configuratie op en kiest YAML of JSON op basis van extensie.",
    "page": "api/configuration.html",
    "section": "save-config"
  },
  {
    "type": "api",
    "title": "save_config_json",
    "description": "arclm.configs.save_config_json from arclm.configs import save_config_json Slaat een configuratie op als JSON-bestand.",
    "page": "api/configuration.html",
    "section": "save-config-json"
  },
  {
    "type": "api",
    "title": "save_config_yaml",
    "description": "arclm.configs.save_config_yaml from arclm.configs import save_config_yaml Slaat een configuratie op als YAML-bestand.",
    "page": "api/configuration.html",
    "section": "save-config-yaml"
  },
  {
    "type": "api",
    "title": "BaseAugmenter",
    "description": "arclm.datasets.BaseAugmenter from arclm.datasets import BaseAugmenter Basis class voor eigen data augmenters.",
    "page": "api/datasets.html",
    "section": "baseaugmenter"
  },
  {
    "type": "api",
    "title": "BaseCleaner",
    "description": "arclm.datasets.BaseCleaner from arclm.datasets import BaseCleaner Basis class voor eigen data cleaners.",
    "page": "api/datasets.html",
    "section": "basecleaner"
  },
  {
    "type": "api",
    "title": "BaseDataset",
    "description": "arclm.datasets.BaseDataset from arclm.datasets import BaseDataset Basis class voor datasets met lengte en index-toegang.",
    "page": "api/datasets.html",
    "section": "basedataset"
  },
  {
    "type": "api",
    "title": "BaseDataStep",
    "description": "arclm.datasets.BaseDataStep from arclm.datasets import BaseDataStep Basis class voor een stap die een voorbeeld verwerkt.",
    "page": "api/datasets.html",
    "section": "basedatastep"
  },
  {
    "type": "api",
    "title": "BaseDeduplicator",
    "description": "arclm.datasets.BaseDeduplicator from arclm.datasets import BaseDeduplicator Basis class voor deduplicatie over een hele dataset.",
    "page": "api/datasets.html",
    "section": "basededuplicator"
  },
  {
    "type": "api",
    "title": "BaseStreamingDataset",
    "description": "arclm.datasets.BaseStreamingDataset from arclm.datasets import BaseStreamingDataset Basis class voor datasets die je alleen kunt doorlopen.",
    "page": "api/datasets.html",
    "section": "basestreamingdataset"
  },
  {
    "type": "api",
    "title": "BaseSyntheticDataGenerator",
    "description": "arclm.datasets.BaseSyntheticDataGenerator from arclm.datasets import BaseSyntheticDataGenerator Basis class voor eigen synthetic-data generators.",
    "page": "api/datasets.html",
    "section": "basesyntheticdatagenerator"
  },
  {
    "type": "api",
    "title": "DataAugmenter",
    "description": "arclm.datasets.DataAugmenter from arclm.datasets import DataAugmenter Basis class voor eigen data augmenters.",
    "page": "api/datasets.html",
    "section": "dataaugmenter"
  },
  {
    "type": "api",
    "title": "DataBundle",
    "description": "arclm.datasets.DataBundle from arclm.datasets import DataBundle Bundel met tokens, tokenizer en loaders voor training.",
    "page": "api/datasets.html",
    "section": "databundle"
  },
  {
    "type": "api",
    "title": "DataCleaner",
    "description": "arclm.datasets.DataCleaner from arclm.datasets import DataCleaner Basis class voor eigen data cleaners.",
    "page": "api/datasets.html",
    "section": "datacleaner"
  },
  {
    "type": "api",
    "title": "DataPipeline",
    "description": "arclm.datasets.DataPipeline from arclm.datasets import DataPipeline Voert meerdere data-stappen na elkaar uit.",
    "page": "api/datasets.html",
    "section": "datapipeline"
  },
  {
    "type": "api",
    "title": "DataProcessor",
    "description": "arclm.datasets.DataProcessor from arclm.datasets import DataProcessor Compatibility-friendly entry point for ``ProcessedDataset`` workflows.",
    "page": "api/datasets.html",
    "section": "dataprocessor"
  },
  {
    "type": "api",
    "title": "DatasetConfig",
    "description": "arclm.datasets.DatasetConfig from arclm.datasets import DatasetConfig Configuratie voor `load_dataset` wanneer je opties wilt hergebruiken.",
    "page": "api/datasets.html",
    "section": "datasetconfig"
  },
  {
    "type": "api",
    "title": "DatasetLoader",
    "description": "arclm.datasets.DatasetLoader from arclm.datasets import DatasetLoader Laadt datasets uit simpele lokale bronnen.",
    "page": "api/datasets.html",
    "section": "datasetloader"
  },
  {
    "type": "api",
    "title": "DatasetManifest",
    "description": "arclm.datasets.DatasetManifest from arclm.datasets import DatasetManifest Lightweight provenance metadata for a processed dataset.",
    "page": "api/datasets.html",
    "section": "datasetmanifest"
  },
  {
    "type": "api",
    "title": "DatasetReport",
    "description": "arclm.datasets.DatasetReport from arclm.datasets import DatasetReport A compact processed-dataset and tokenization report.",
    "page": "api/datasets.html",
    "section": "datasetreport"
  },
  {
    "type": "api",
    "title": "DatasetValidationIssue",
    "description": "arclm.datasets.DatasetValidationIssue from arclm.datasets import DatasetValidationIssue One validation problem tied to a record index and field.",
    "page": "api/datasets.html",
    "section": "datasetvalidationissue"
  },
  {
    "type": "api",
    "title": "DatasetValidationResult",
    "description": "arclm.datasets.DatasetValidationResult from arclm.datasets import DatasetValidationResult Result of validating records against a small field schema.",
    "page": "api/datasets.html",
    "section": "datasetvalidationresult"
  },
  {
    "type": "api",
    "title": "DeduplicationResult",
    "description": "arclm.datasets.DeduplicationResult from arclm.datasets import DeduplicationResult Resultaat van een deduplicatie stap.",
    "page": "api/datasets.html",
    "section": "deduplicationresult"
  },
  {
    "type": "api",
    "title": "Deduplicator",
    "description": "arclm.datasets.Deduplicator from arclm.datasets import Deduplicator Basis class voor deduplicatie over een hele dataset.",
    "page": "api/datasets.html",
    "section": "deduplicator"
  },
  {
    "type": "api",
    "title": "ExactDeduplicator",
    "description": "arclm.datasets.ExactDeduplicator from arclm.datasets import ExactDeduplicator Verwijdert voorbeelden met dezelfde waarde in gekozen velden.",
    "page": "api/datasets.html",
    "section": "exactdeduplicator"
  },
  {
    "type": "api",
    "title": "InstructionDataset",
    "description": "arclm.datasets.InstructionDataset from arclm.datasets import InstructionDataset Dataset voor instruction tuning met loss alleen op response tokens.",
    "page": "api/datasets.html",
    "section": "instructiondataset"
  },
  {
    "type": "api",
    "title": "ProcessedDataset",
    "description": "arclm.datasets.ProcessedDataset from arclm.datasets import ProcessedDataset Kleine in-memory dataset voor formatting, cleaning en splits.",
    "page": "api/datasets.html",
    "section": "processeddataset"
  },
  {
    "type": "api",
    "title": "RemoveDuplicates",
    "description": "arclm.datasets.RemoveDuplicates from arclm.datasets import RemoveDuplicates Verwijdert voorbeelden met dezelfde waarde in gekozen velden.",
    "page": "api/datasets.html",
    "section": "removeduplicates"
  },
  {
    "type": "api",
    "title": "StreamingDataset",
    "description": "arclm.datasets.StreamingDataset from arclm.datasets import StreamingDataset Dataset die voorbeelden pas leest tijdens het itereren.",
    "page": "api/datasets.html",
    "section": "streamingdataset"
  },
  {
    "type": "api",
    "title": "TextDataset",
    "description": "arclm.datasets.TextDataset from arclm.datasets import TextDataset Dataset voor taalmodeltraining met een schuivend venster.",
    "page": "api/datasets.html",
    "section": "textdataset"
  },
  {
    "type": "api",
    "title": "build_dataset_report",
    "description": "arclm.datasets.build_dataset_report from arclm.datasets import build_dataset_report Build a processed dataset report with optional token statistics.",
    "page": "api/datasets.html",
    "section": "build-dataset-report"
  },
  {
    "type": "api",
    "title": "create_dataloader",
    "description": "arclm.datasets.create_dataloader from arclm.datasets import create_dataloader Maakt een PyTorch DataLoader van token ids.",
    "page": "api/datasets.html",
    "section": "create-dataloader"
  },
  {
    "type": "api",
    "title": "create_dataset_manifest",
    "description": "arclm.datasets.create_dataset_manifest from arclm.datasets import create_dataset_manifest Create lightweight dataset provenance without storing record values.",
    "page": "api/datasets.html",
    "section": "create-dataset-manifest"
  },
  {
    "type": "api",
    "title": "create_instruction_dataloader",
    "description": "arclm.datasets.create_instruction_dataloader from arclm.datasets import create_instruction_dataloader Maakt een DataLoader voor instruction tuning.",
    "page": "api/datasets.html",
    "section": "create-instruction-dataloader"
  },
  {
    "type": "api",
    "title": "deduplicate",
    "description": "arclm.datasets.deduplicate from arclm.datasets import deduplicate Verwijdert exacte duplicaten met `ExactDeduplicator`.",
    "page": "api/datasets.html",
    "section": "deduplicate"
  },
  {
    "type": "api",
    "title": "load_dataset",
    "description": "arclm.datasets.load_dataset from arclm.datasets import load_dataset Laadt een dataset met de standaard DatasetLoader.",
    "page": "api/datasets.html",
    "section": "load-dataset"
  },
  {
    "type": "api",
    "title": "load_tokenizer_from_checkpoint",
    "description": "arclm.datasets.load_tokenizer_from_checkpoint from arclm.datasets import load_tokenizer_from_checkpoint Haalt een tokenizer uit checkpoint metadata als dat mogelijk is.",
    "page": "api/datasets.html",
    "section": "load-tokenizer-from-checkpoint"
  },
  {
    "type": "api",
    "title": "load_tokens",
    "description": "arclm.datasets.load_tokens from arclm.datasets import load_tokens Laadt tokens uit de ingestelde dataset en optioneel uit domeindata.",
    "page": "api/datasets.html",
    "section": "load-tokens"
  },
  {
    "type": "api",
    "title": "prepare_data",
    "description": "arclm.datasets.prepare_data from arclm.datasets import prepare_data Maakt tokens, splits, tokenizer en DataLoaders klaar voor training.",
    "page": "api/datasets.html",
    "section": "prepare-data"
  },
  {
    "type": "api",
    "title": "read_tokens",
    "description": "arclm.datasets.read_tokens from arclm.datasets import read_tokens Leest lowercase whitespace tokens uit een tekstbestand en bewaart newlines.",
    "page": "api/datasets.html",
    "section": "read-tokens"
  },
  {
    "type": "api",
    "title": "split_train_val",
    "description": "arclm.datasets.split_train_val from arclm.datasets import split_train_val Splitst tokens in train en validatie data.",
    "page": "api/datasets.html",
    "section": "split-train-val"
  },
  {
    "type": "api",
    "title": "validate_records",
    "description": "arclm.datasets.validate_records from arclm.datasets import validate_records Validate mapping records with a small schema.",
    "page": "api/datasets.html",
    "section": "validate-records"
  },
  {
    "type": "api",
    "title": "ArcLMError",
    "description": "arclm.exceptions.ArcLMError from arclm.exceptions import ArcLMError Base exception for ArcLM.",
    "page": "api/errors.html",
    "section": "arclmerror"
  },
  {
    "type": "api",
    "title": "CheckpointError",
    "description": "arclm.exceptions.CheckpointError from arclm.exceptions import CheckpointError Raised for checkpoint errors.",
    "page": "api/errors.html",
    "section": "checkpointerror"
  },
  {
    "type": "api",
    "title": "CleaningError",
    "description": "arclm.exceptions.CleaningError from arclm.exceptions import CleaningError Raised when a cleaning step cannot process an example.",
    "page": "api/errors.html",
    "section": "cleaningerror"
  },
  {
    "type": "api",
    "title": "ConfigurationError",
    "description": "arclm.exceptions.ConfigurationError from arclm.exceptions import ConfigurationError Raised for invalid configuration.",
    "page": "api/errors.html",
    "section": "configurationerror"
  },
  {
    "type": "api",
    "title": "DataCollatorError",
    "description": "arclm.exceptions.DataCollatorError from arclm.exceptions import DataCollatorError Raised when SFT batches cannot be collated.",
    "page": "api/errors.html",
    "section": "datacollatorerror"
  },
  {
    "type": "api",
    "title": "DatasetError",
    "description": "arclm.exceptions.DatasetError from arclm.exceptions import DatasetError Raised for dataset errors.",
    "page": "api/errors.html",
    "section": "dataseterror"
  },
  {
    "type": "api",
    "title": "DatasetLoadError",
    "description": "arclm.exceptions.DatasetLoadError from arclm.exceptions import DatasetLoadError Raised when a dataset cannot be loaded.",
    "page": "api/errors.html",
    "section": "datasetloaderror"
  },
  {
    "type": "api",
    "title": "DatasetValidationError",
    "description": "arclm.exceptions.DatasetValidationError from arclm.exceptions import DatasetValidationError Raised when dataset rows do not match the expected shape.",
    "page": "api/errors.html",
    "section": "datasetvalidationerror"
  },
  {
    "type": "api",
    "title": "DatasetVersionError",
    "description": "arclm.exceptions.DatasetVersionError from arclm.exceptions import DatasetVersionError Raised when local dataset versioning fails.",
    "page": "api/errors.html",
    "section": "datasetversionerror"
  },
  {
    "type": "api",
    "title": "DeduplicationError",
    "description": "arclm.exceptions.DeduplicationError from arclm.exceptions import DeduplicationError Raised when deduplication fails.",
    "page": "api/errors.html",
    "section": "deduplicationerror"
  },
  {
    "type": "api",
    "title": "EvaluationConfigError",
    "description": "arclm.exceptions.EvaluationConfigError from arclm.exceptions import EvaluationConfigError Raised for invalid evaluation configuration.",
    "page": "api/errors.html",
    "section": "evaluationconfigerror"
  },
  {
    "type": "api",
    "title": "EvaluationError",
    "description": "arclm.exceptions.EvaluationError from arclm.exceptions import EvaluationError Raised for evaluation errors.",
    "page": "api/errors.html",
    "section": "evaluationerror"
  },
  {
    "type": "api",
    "title": "FineTuningError",
    "description": "arclm.exceptions.FineTuningError from arclm.exceptions import FineTuningError Raised for fine-tuning errors.",
    "page": "api/errors.html",
    "section": "finetuningerror"
  },
  {
    "type": "api",
    "title": "FormattingError",
    "description": "arclm.exceptions.FormattingError from arclm.exceptions import FormattingError Raised when an SFT example cannot be formatted.",
    "page": "api/errors.html",
    "section": "formattingerror"
  },
  {
    "type": "api",
    "title": "InferenceError",
    "description": "arclm.exceptions.InferenceError from arclm.exceptions import InferenceError Raised for inference errors.",
    "page": "api/errors.html",
    "section": "inferenceerror"
  },
  {
    "type": "api",
    "title": "MetricError",
    "description": "arclm.exceptions.MetricError from arclm.exceptions import MetricError Raised when a metric cannot be computed.",
    "page": "api/errors.html",
    "section": "metricerror"
  },
  {
    "type": "api",
    "title": "ModelAdapterError",
    "description": "arclm.exceptions.ModelAdapterError from arclm.exceptions import ModelAdapterError Raised when a model adapter cannot call or read a model.",
    "page": "api/errors.html",
    "section": "modeladaptererror"
  },
  {
    "type": "api",
    "title": "ModelLoadError",
    "description": "arclm.exceptions.ModelLoadError from arclm.exceptions import ModelLoadError Raised when model loading fails.",
    "page": "api/errors.html",
    "section": "modelloaderror"
  },
  {
    "type": "api",
    "title": "OptionalDependencyError",
    "description": "arclm.exceptions.OptionalDependencyError from arclm.exceptions import OptionalDependencyError Raised when an optional dependency is required but not installed.",
    "page": "api/errors.html",
    "section": "optionaldependencyerror"
  },
  {
    "type": "api",
    "title": "PipelineError",
    "description": "arclm.exceptions.PipelineError from arclm.exceptions import PipelineError Raised when a data pipeline step fails.",
    "page": "api/errors.html",
    "section": "pipelineerror"
  },
  {
    "type": "api",
    "title": "PrecisionError",
    "description": "arclm.exceptions.PrecisionError from arclm.exceptions import PrecisionError Raised when requested training precision is not supported.",
    "page": "api/errors.html",
    "section": "precisionerror"
  },
  {
    "type": "api",
    "title": "SFTConfigError",
    "description": "arclm.exceptions.SFTConfigError from arclm.exceptions import SFTConfigError Raised for invalid SFT configuration.",
    "page": "api/errors.html",
    "section": "sftconfigerror"
  },
  {
    "type": "api",
    "title": "StreamingError",
    "description": "arclm.exceptions.StreamingError from arclm.exceptions import StreamingError Raised when a streaming dataset cannot be read.",
    "page": "api/errors.html",
    "section": "streamingerror"
  },
  {
    "type": "api",
    "title": "SyntheticDataError",
    "description": "arclm.exceptions.SyntheticDataError from arclm.exceptions import SyntheticDataError Raised when synthetic data generation fails.",
    "page": "api/errors.html",
    "section": "syntheticdataerror"
  },
  {
    "type": "api",
    "title": "TokenizerAdapterError",
    "description": "arclm.exceptions.TokenizerAdapterError from arclm.exceptions import TokenizerAdapterError Raised when a tokenizer adapter cannot encode data.",
    "page": "api/errors.html",
    "section": "tokenizeradaptererror"
  },
  {
    "type": "api",
    "title": "TokenizerError",
    "description": "arclm.exceptions.TokenizerError from arclm.exceptions import TokenizerError Raised for tokenizer errors.",
    "page": "api/errors.html",
    "section": "tokenizererror"
  },
  {
    "type": "api",
    "title": "TrainingConfigError",
    "description": "arclm.exceptions.TrainingConfigError from arclm.exceptions import TrainingConfigError Raised for invalid training configuration.",
    "page": "api/errors.html",
    "section": "trainingconfigerror"
  },
  {
    "type": "api",
    "title": "TrainingError",
    "description": "arclm.exceptions.TrainingError from arclm.exceptions import TrainingError Raised for training errors.",
    "page": "api/errors.html",
    "section": "trainingerror"
  },
  {
    "type": "api",
    "title": "Accuracy",
    "description": "arclm.evaluation.Accuracy from arclm.evaluation import Accuracy Berekent accuracy voor classificatie of token logits.",
    "page": "api/evaluation.html",
    "section": "accuracy"
  },
  {
    "type": "api",
    "title": "BaseEvaluationCallback",
    "description": "arclm.evaluation.BaseEvaluationCallback from arclm.evaluation import BaseEvaluationCallback Basis class voor eigen evaluation callbacks.",
    "page": "api/evaluation.html",
    "section": "baseevaluationcallback"
  },
  {
    "type": "api",
    "title": "BaseEvaluator",
    "description": "arclm.evaluation.BaseEvaluator from arclm.evaluation import BaseEvaluator Basis class voor eigen evaluators.",
    "page": "api/evaluation.html",
    "section": "baseevaluator"
  },
  {
    "type": "api",
    "title": "BaseMetric",
    "description": "arclm.evaluation.BaseMetric from arclm.evaluation import BaseMetric Basis class voor developers die een eigen metric willen maken.",
    "page": "api/evaluation.html",
    "section": "basemetric"
  },
  {
    "type": "api",
    "title": "ConceptBenchmarkCase",
    "description": "arclm.evaluation.ConceptBenchmarkCase from arclm.evaluation import ConceptBenchmarkCase Expected concept relationships for a prompt.",
    "page": "api/evaluation.html",
    "section": "conceptbenchmarkcase"
  },
  {
    "type": "api",
    "title": "ConceptBenchmarkResult",
    "description": "arclm.evaluation.ConceptBenchmarkResult from arclm.evaluation import ConceptBenchmarkResult Concept benchmark score for one prompt.",
    "page": "api/evaluation.html",
    "section": "conceptbenchmarkresult"
  },
  {
    "type": "api",
    "title": "EvaluationConfig",
    "description": "arclm.evaluation.EvaluationConfig from arclm.evaluation import EvaluationConfig Bewaart instellingen voor een evaluatierun.",
    "page": "api/evaluation.html",
    "section": "evaluationconfig"
  },
  {
    "type": "api",
    "title": "EvaluationReport",
    "description": "arclm.evaluation.EvaluationReport from arclm.evaluation import EvaluationReport Structured, JSON-safe summary of an evaluation run.",
    "page": "api/evaluation.html",
    "section": "evaluationreport"
  },
  {
    "type": "api",
    "title": "EvaluationResult",
    "description": "arclm.evaluation.EvaluationResult from arclm.evaluation import EvaluationResult Bewaart de uitkomst van een evaluatierun.",
    "page": "api/evaluation.html",
    "section": "evaluationresult"
  },
  {
    "type": "api",
    "title": "Evaluator",
    "description": "arclm.evaluation.Evaluator from arclm.evaluation import Evaluator Voert evaluatie uit op een model en dataset.",
    "page": "api/evaluation.html",
    "section": "evaluator"
  },
  {
    "type": "api",
    "title": "LongContextResult",
    "description": "arclm.evaluation.LongContextResult from arclm.evaluation import LongContextResult Summary for one long-context training/evaluation run.",
    "page": "api/evaluation.html",
    "section": "longcontextresult"
  },
  {
    "type": "api",
    "title": "LossMetric",
    "description": "arclm.evaluation.LossMetric from arclm.evaluation import LossMetric Berekent gemiddelde loss per batch.",
    "page": "api/evaluation.html",
    "section": "lossmetric"
  },
  {
    "type": "api",
    "title": "MetricsReport",
    "description": "arclm.evaluation.MetricsReport from arclm.evaluation import MetricsReport Comprehensive metrics report for model evaluation.",
    "page": "api/evaluation.html",
    "section": "metricsreport"
  },
  {
    "type": "api",
    "title": "Perplexity",
    "description": "arclm.evaluation.Perplexity from arclm.evaluation import Perplexity Berekent perplexity uit gemiddelde loss.",
    "page": "api/evaluation.html",
    "section": "perplexity"
  },
  {
    "type": "api",
    "title": "TopKPrediction",
    "description": "arclm.evaluation.TopKPrediction from arclm.evaluation import TopKPrediction One next-token prediction.",
    "page": "api/evaluation.html",
    "section": "topkprediction"
  },
  {
    "type": "api",
    "title": "DEFAULT_CONCEPT_BENCHMARKS",
    "description": "arclm.evaluation.DEFAULT_CONCEPT_BENCHMARKS from arclm.evaluation import DEFAULT_CONCEPT_BENCHMARKS Built-in mutable sequence.",
    "page": "api/evaluation.html",
    "section": "default-concept-benchmarks"
  },
  {
    "type": "api",
    "title": "build_evaluation_report",
    "description": "arclm.evaluation.build_evaluation_report from arclm.evaluation import build_evaluation_report Build a report from canonical evaluator metrics without recalculation.",
    "page": "api/evaluation.html",
    "section": "build-evaluation-report"
  },
  {
    "type": "api",
    "title": "build_training_diagnostics_report",
    "description": "arclm.evaluation.build_training_diagnostics_report from arclm.evaluation import build_training_diagnostics_report Build tokenizer, top-k, and concept benchmark diagnostics for a run.",
    "page": "api/evaluation.html",
    "section": "build-training-diagnostics-report"
  },
  {
    "type": "api",
    "title": "calculate_metrics",
    "description": "arclm.evaluation.calculate_metrics from arclm.evaluation import calculate_metrics Calculate comprehensive evaluation metrics.",
    "page": "api/evaluation.html",
    "section": "calculate-metrics"
  },
  {
    "type": "api",
    "title": "calculate_perplexity",
    "description": "arclm.evaluation.calculate_perplexity from arclm.evaluation import calculate_perplexity Return perplexity for a cross-entropy loss value.",
    "page": "api/evaluation.html",
    "section": "calculate-perplexity"
  },
  {
    "type": "api",
    "title": "evaluate",
    "description": "arclm.evaluation.evaluate from arclm.evaluation import evaluate Voert evaluatie uit met de standaard `Evaluator`.",
    "page": "api/evaluation.html",
    "section": "evaluate"
  },
  {
    "type": "api",
    "title": "export_metrics_to_json",
    "description": "arclm.evaluation.export_metrics_to_json from arclm.evaluation import export_metrics_to_json Export metrics report to JSON file.",
    "page": "api/evaluation.html",
    "section": "export-metrics-to-json"
  },
  {
    "type": "api",
    "title": "export_metrics_to_markdown",
    "description": "arclm.evaluation.export_metrics_to_markdown from arclm.evaluation import export_metrics_to_markdown Export metrics report to Markdown file.",
    "page": "api/evaluation.html",
    "section": "export-metrics-to-markdown"
  },
  {
    "type": "api",
    "title": "format_concept_benchmark_report",
    "description": "arclm.evaluation.format_concept_benchmark_report from arclm.evaluation import format_concept_benchmark_report Create a readable concept benchmark report.",
    "page": "api/evaluation.html",
    "section": "format-concept-benchmark-report"
  },
  {
    "type": "api",
    "title": "format_long_context_results",
    "description": "arclm.evaluation.format_long_context_results from arclm.evaluation import format_long_context_results Create a readable long-context comparison report.",
    "page": "api/evaluation.html",
    "section": "format-long-context-results"
  },
  {
    "type": "api",
    "title": "format_tokenizer_coverage_report",
    "description": "arclm.evaluation.format_tokenizer_coverage_report from arclm.evaluation import format_tokenizer_coverage_report Create a readable tokenizer coverage report.",
    "page": "api/evaluation.html",
    "section": "format-tokenizer-coverage-report"
  },
  {
    "type": "api",
    "title": "format_top_k_predictions",
    "description": "arclm.evaluation.format_top_k_predictions from arclm.evaluation import format_top_k_predictions Create a readable diagnostic report for one prompt.",
    "page": "api/evaluation.html",
    "section": "format-top-k-predictions"
  },
  {
    "type": "api",
    "title": "predict_top_k",
    "description": "arclm.evaluation.predict_top_k from arclm.evaluation import predict_top_k Return the top-k next-token probabilities for a prompt.",
    "page": "api/evaluation.html",
    "section": "predict-top-k"
  },
  {
    "type": "api",
    "title": "run_long_context_evaluation",
    "description": "arclm.evaluation.run_long_context_evaluation from arclm.evaluation import run_long_context_evaluation Train and compare multiple block sizes by validation loss and concepts.",
    "page": "api/evaluation.html",
    "section": "run-long-context-evaluation"
  },
  {
    "type": "api",
    "title": "score_concept_relationships",
    "description": "arclm.evaluation.score_concept_relationships from arclm.evaluation import score_concept_relationships Score expected concepts against top-k next-token predictions.",
    "page": "api/evaluation.html",
    "section": "score-concept-relationships"
  },
  {
    "type": "api",
    "title": "BaseFineTuner",
    "description": "arclm.finetuning.BaseFineTuner from arclm.finetuning import BaseFineTuner Basis class voor developers die een eigen fine-tuner willen maken.",
    "page": "api/finetuning.html",
    "section": "basefinetuner"
  },
  {
    "type": "api",
    "title": "BaseModelAdapter",
    "description": "arclm.finetuning.BaseModelAdapter from arclm.finetuning import BaseModelAdapter Basis class om een extern model met ArcLM te verbinden.",
    "page": "api/finetuning.html",
    "section": "basemodeladapter"
  },
  {
    "type": "api",
    "title": "BaseTokenizerAdapter",
    "description": "arclm.finetuning.BaseTokenizerAdapter from arclm.finetuning import BaseTokenizerAdapter Basis class om een tokenizer met ArcLM te verbinden.",
    "page": "api/finetuning.html",
    "section": "basetokenizeradapter"
  },
  {
    "type": "api",
    "title": "FineTuningConfig",
    "description": "arclm.finetuning.FineTuningConfig from arclm.finetuning import FineTuningConfig Configuratie voor data, formatting en labels bij fine-tuning.",
    "page": "api/finetuning.html",
    "section": "finetuningconfig"
  },
  {
    "type": "api",
    "title": "FineTuningDatasetReport",
    "description": "arclm.finetuning.FineTuningDatasetReport from arclm.finetuning import FineTuningDatasetReport Veilige samenvatting van datasetvoorbereiding.",
    "page": "api/finetuning.html",
    "section": "finetuningdatasetreport"
  },
  {
    "type": "api",
    "title": "FineTuningMode",
    "description": "arclm.finetuning.FineTuningMode from arclm.finetuning import FineTuningMode Beschrijft welke fine-tuning taak uitgevoerd wordt.",
    "page": "api/finetuning.html",
    "section": "finetuningmode"
  },
  {
    "type": "api",
    "title": "FineTuningResult",
    "description": "arclm.finetuning.FineTuningResult from arclm.finetuning import FineTuningResult Resultaat van een stabiele fine-tuning run.",
    "page": "api/finetuning.html",
    "section": "finetuningresult"
  },
  {
    "type": "api",
    "title": "FullFineTuner",
    "description": "arclm.finetuning.FullFineTuner from arclm.finetuning import FullFineTuner Traint alle trainbare modelparameters met de Training Core.",
    "page": "api/finetuning.html",
    "section": "fullfinetuner"
  },
  {
    "type": "api",
    "title": "ModelAdapter",
    "description": "arclm.finetuning.ModelAdapter from arclm.finetuning import ModelAdapter Zet een model om naar het formaat dat ArcLM verwacht.",
    "page": "api/finetuning.html",
    "section": "modeladapter"
  },
  {
    "type": "api",
    "title": "PreparedFineTuningDataset",
    "description": "arclm.finetuning.PreparedFineTuningDataset from arclm.finetuning import PreparedFineTuningDataset Dataset met vooraf getokenizede fine-tuning voorbeelden.",
    "page": "api/finetuning.html",
    "section": "preparedfinetuningdataset"
  },
  {
    "type": "api",
    "title": "PreparedFineTuningRecord",
    "description": "arclm.finetuning.PreparedFineTuningRecord from arclm.finetuning import PreparedFineTuningRecord Canonical prepared representation of one fine-tuning record.",
    "page": "api/finetuning.html",
    "section": "preparedfinetuningrecord"
  },
  {
    "type": "api",
    "title": "SFTConfig",
    "description": "arclm.finetuning.SFTConfig from arclm.finetuning import SFTConfig Bewaart instellingen voor supervised fine-tuning.",
    "page": "api/finetuning.html",
    "section": "sftconfig"
  },
  {
    "type": "api",
    "title": "SFTDataCollator",
    "description": "arclm.finetuning.SFTDataCollator from arclm.finetuning import SFTDataCollator Zet SFT voorbeelden om naar tensors voor de trainer.",
    "page": "api/finetuning.html",
    "section": "sftdatacollator"
  },
  {
    "type": "api",
    "title": "SFTRecordContract",
    "description": "arclm.finetuning.SFTRecordContract from arclm.finetuning import SFTRecordContract Public description of accepted SFT record fields.",
    "page": "api/finetuning.html",
    "section": "sftrecordcontract"
  },
  {
    "type": "api",
    "title": "SFTTrainer",
    "description": "arclm.finetuning.SFTTrainer from arclm.finetuning import SFTTrainer Traint een tekstmodel met instruction-, chat- of tekstdatasets.",
    "page": "api/finetuning.html",
    "section": "sfttrainer"
  },
  {
    "type": "api",
    "title": "SFTTrainingResult",
    "description": "arclm.finetuning.SFTTrainingResult from arclm.finetuning import SFTTrainingResult Result returned by ``train_sft``.",
    "page": "api/finetuning.html",
    "section": "sfttrainingresult"
  },
  {
    "type": "api",
    "title": "TokenizerAdapter",
    "description": "arclm.finetuning.TokenizerAdapter from arclm.finetuning import TokenizerAdapter Zet verschillende tokenizers om naar \u00e9\u00e9n eenvoudige interface.",
    "page": "api/finetuning.html",
    "section": "tokenizeradapter"
  },
  {
    "type": "api",
    "title": "create_labels",
    "description": "arclm.finetuning.create_labels from arclm.finetuning import create_labels Maakt labels en negeert padding tijdens de lossberekening.",
    "page": "api/finetuning.html",
    "section": "create-labels"
  },
  {
    "type": "api",
    "title": "fine_tune",
    "description": "arclm.finetuning.fine_tune from arclm.finetuning import fine_tune Voert full-parameter fine-tuning uit met de bestaande Trainer.",
    "page": "api/finetuning.html",
    "section": "fine-tune"
  },
  {
    "type": "api",
    "title": "fine_tuning_format_fingerprint",
    "description": "arclm.finetuning.fine_tuning_format_fingerprint from arclm.finetuning import fine_tuning_format_fingerprint Fingerprint only fields that affect prepared fine-tuning examples.",
    "page": "api/finetuning.html",
    "section": "fine-tuning-format-fingerprint"
  },
  {
    "type": "api",
    "title": "format_chat_example",
    "description": "arclm.finetuning.format_chat_example from arclm.finetuning import format_chat_example Maakt tekst van chat messages.",
    "page": "api/finetuning.html",
    "section": "format-chat-example"
  },
  {
    "type": "api",
    "title": "format_example",
    "description": "arclm.finetuning.format_example from arclm.finetuning import format_example Formatteert \u00e9\u00e9n voorbeeld volgens de gekozen datasetvorm.",
    "page": "api/finetuning.html",
    "section": "format-example"
  },
  {
    "type": "api",
    "title": "format_instruction_example",
    "description": "arclm.finetuning.format_instruction_example from arclm.finetuning import format_instruction_example Maakt tekst van een instruction-response voorbeeld.",
    "page": "api/finetuning.html",
    "section": "format-instruction-example"
  },
  {
    "type": "api",
    "title": "format_prompt_response_example",
    "description": "arclm.finetuning.format_prompt_response_example from arclm.finetuning import format_prompt_response_example Maakt tekst van een prompt-response voorbeeld.",
    "page": "api/finetuning.html",
    "section": "format-prompt-response-example"
  },
  {
    "type": "api",
    "title": "format_text_example",
    "description": "arclm.finetuning.format_text_example from arclm.finetuning import format_text_example Maakt tekst van een plain-text voorbeeld.",
    "page": "api/finetuning.html",
    "section": "format-text-example"
  },
  {
    "type": "api",
    "title": "get_sft_record_contract",
    "description": "arclm.finetuning.get_sft_record_contract from arclm.finetuning import get_sft_record_contract Describe one supported SFT record format.",
    "page": "api/finetuning.html",
    "section": "get-sft-record-contract"
  },
  {
    "type": "api",
    "title": "mask_labels",
    "description": "arclm.finetuning.mask_labels from arclm.finetuning import mask_labels Zet labels buiten de actieve mask op `ignore_index`.",
    "page": "api/finetuning.html",
    "section": "mask-labels"
  },
  {
    "type": "api",
    "title": "normalize_fine_tuning_example",
    "description": "arclm.finetuning.normalize_fine_tuning_example from arclm.finetuning import normalize_fine_tuning_example Normaliseert een datasetrecord naar veilige tekstsegmenten.",
    "page": "api/finetuning.html",
    "section": "normalize-fine-tuning-example"
  },
  {
    "type": "api",
    "title": "pack_sequences",
    "description": "arclm.finetuning.pack_sequences from arclm.finetuning import pack_sequences Pakt korte voorbeelden samen tot maximaal `max_length` tokens.",
    "page": "api/finetuning.html",
    "section": "pack-sequences"
  },
  {
    "type": "api",
    "title": "prepare_fine_tuning_dataset",
    "description": "arclm.finetuning.prepare_fine_tuning_dataset from arclm.finetuning import prepare_fine_tuning_dataset Valideert, formatteert en tokenizet fine-tuning records.",
    "page": "api/finetuning.html",
    "section": "prepare-fine-tuning-dataset"
  },
  {
    "type": "api",
    "title": "prepare_fine_tuning_record",
    "description": "arclm.finetuning.prepare_fine_tuning_record from arclm.finetuning import prepare_fine_tuning_record Prepare exactly one record using the canonical dataset-preparation path.",
    "page": "api/finetuning.html",
    "section": "prepare-fine-tuning-record"
  },
  {
    "type": "api",
    "title": "train_sft",
    "description": "arclm.finetuning.train_sft from arclm.finetuning import train_sft Run supervised fine-tuning through an ArcLM backend.",
    "page": "api/finetuning.html",
    "section": "train-sft"
  },
  {
    "type": "api",
    "title": "validate_sft_records",
    "description": "arclm.finetuning.validate_sft_records from arclm.finetuning import validate_sft_records Validate SFT records through the canonical fine-tuning normalizer.",
    "page": "api/finetuning.html",
    "section": "validate-sft-records"
  },
  {
    "type": "api",
    "title": "CheckpointTokenizer",
    "description": "arclm.inference.CheckpointTokenizer from arclm.inference import CheckpointTokenizer Fallback tokenizer reconstructed from checkpoint vocabulary data.",
    "page": "api/inference.html",
    "section": "checkpointtokenizer"
  },
  {
    "type": "api",
    "title": "ExternalLoadedModel",
    "description": "arclm.inference.ExternalLoadedModel from arclm.inference import ExternalLoadedModel Loaded model wrapper with a unified inference and save API.",
    "page": "api/inference.html",
    "section": "externalloadedmodel"
  },
  {
    "type": "api",
    "title": "ExternalModelConfig",
    "description": "arclm.inference.ExternalModelConfig from arclm.inference import ExternalModelConfig Configuration for loading native or external causal language models.",
    "page": "api/inference.html",
    "section": "externalmodelconfig"
  },
  {
    "type": "api",
    "title": "GenerationConfig",
    "description": "arclm.inference.GenerationConfig from arclm.inference import GenerationConfig Text generation defaults used by :class:`ExternalLoadedModel`.",
    "page": "api/inference.html",
    "section": "generationconfig"
  },
  {
    "type": "api",
    "title": "Generator",
    "description": "arclm.inference.Generator from arclm.inference import Generator Generate tokens from a trained native causal language model.",
    "page": "api/inference.html",
    "section": "generator"
  },
  {
    "type": "api",
    "title": "LoadedModel",
    "description": "arclm.inference.LoadedModel from arclm.inference import LoadedModel Loaded model bundle with a minimal prediction method.",
    "page": "api/inference.html",
    "section": "loadedmodel"
  },
  {
    "type": "api",
    "title": "ModelSaveConfig",
    "description": "arclm.inference.ModelSaveConfig from arclm.inference import ModelSaveConfig Developer-controlled settings for saving or exporting loaded models.",
    "page": "api/inference.html",
    "section": "modelsaveconfig"
  },
  {
    "type": "api",
    "title": "ModelSourceInfo",
    "description": "arclm.inference.ModelSourceInfo from arclm.inference import ModelSourceInfo Structured inspection result for a model source.",
    "page": "api/inference.html",
    "section": "modelsourceinfo"
  },
  {
    "type": "api",
    "title": "TextGenerator",
    "description": "arclm.inference.TextGenerator from arclm.inference import TextGenerator Generate tokens from a trained native causal language model.",
    "page": "api/inference.html",
    "section": "textgenerator"
  },
  {
    "type": "api",
    "title": "DEFAULT_MODEL_PATH",
    "description": "arclm.inference.DEFAULT_MODEL_PATH from arclm.inference import DEFAULT_MODEL_PATH Path subclass for Windows systems.",
    "page": "api/inference.html",
    "section": "default-model-path"
  },
  {
    "type": "api",
    "title": "continue_native_training",
    "description": "arclm.inference.continue_native_training from arclm.inference import continue_native_training Continue native ArcLM training via ``train_model``.",
    "page": "api/inference.html",
    "section": "continue-native-training"
  },
  {
    "type": "api",
    "title": "fine_tune_external_model",
    "description": "arclm.inference.fine_tune_external_model from arclm.inference import fine_tune_external_model Fine-tune an external model through supported ArcLM training backends.",
    "page": "api/inference.html",
    "section": "fine-tune-external-model"
  },
  {
    "type": "api",
    "title": "fine_tune_native_model",
    "description": "arclm.inference.fine_tune_native_model from arclm.inference import fine_tune_native_model Fine-tune a native ArcLM checkpoint via ``train_model``.",
    "page": "api/inference.html",
    "section": "fine-tune-native-model"
  },
  {
    "type": "api",
    "title": "inspect_model_source",
    "description": "arclm.inference.inspect_model_source from arclm.inference import inspect_model_source Inspect a local path or Hugging Face model ID before loading.",
    "page": "api/inference.html",
    "section": "inspect-model-source"
  },
  {
    "type": "api",
    "title": "load_any_model",
    "description": "arclm.inference.load_any_model from arclm.inference import load_any_model Load any supported ArcLM or Hugging Face causal LM source for inference.",
    "page": "api/inference.html",
    "section": "load-any-model"
  },
  {
    "type": "api",
    "title": "load_external_for_inference",
    "description": "arclm.inference.load_external_for_inference from arclm.inference import load_external_for_inference Backward-friendly alias for :func:`load_any_model`.",
    "page": "api/inference.html",
    "section": "load-external-for-inference"
  },
  {
    "type": "api",
    "title": "load_model",
    "description": "arclm.inference.load_model from arclm.inference import load_model Load a trained ArcLM checkpoint for inference.",
    "page": "api/inference.html",
    "section": "load-model"
  },
  {
    "type": "api",
    "title": "predict",
    "description": "arclm.inference.predict from arclm.inference import predict Predict with a cached model using the same defaults as load_model().",
    "page": "api/inference.html",
    "section": "predict"
  },
  {
    "type": "api",
    "title": "predict_external",
    "description": "arclm.inference.predict_external from arclm.inference import predict_external Load a source and return a single prediction.",
    "page": "api/inference.html",
    "section": "predict-external"
  },
  {
    "type": "api",
    "title": "save_loaded_model",
    "description": "arclm.inference.save_loaded_model from arclm.inference import save_loaded_model Save a loaded model according to :class:`ModelSaveConfig`.",
    "page": "api/inference.html",
    "section": "save-loaded-model"
  },
  {
    "type": "api",
    "title": "train_native_model",
    "description": "arclm.inference.train_native_model from arclm.inference import train_native_model Train a native ArcLM model by delegating to ``train_model(mode='pretrain')``.",
    "page": "api/inference.html",
    "section": "train-native-model"
  },
  {
    "type": "api",
    "title": "PipelineTrace",
    "description": "arclm.inspection.PipelineTrace from arclm.inspection import PipelineTrace JSON-safe summary of one inspected native ArcLM generation step.",
    "page": "api/inspection.html",
    "section": "pipelinetrace"
  },
  {
    "type": "api",
    "title": "inspect_text",
    "description": "arclm.inspection.inspect_text from arclm.inspection import inspect_text Inspect one native ArcLM text-generation step.",
    "page": "api/inspection.html",
    "section": "inspect-text"
  },
  {
    "type": "api",
    "title": "ArcLM",
    "description": "arclm.models.ArcLM from arclm.models import ArcLM Compact causal language model for next-token prediction.",
    "page": "api/models.html",
    "section": "arclm"
  },
  {
    "type": "api",
    "title": "AutoModel",
    "description": "arclm.models.AutoModel from arclm.models import AutoModel Factory for ArcLM model classes supported by the current package.",
    "page": "api/models.html",
    "section": "automodel"
  },
  {
    "type": "api",
    "title": "GPTBlock",
    "description": "arclm.models.GPTBlock from arclm.models import GPTBlock Transformer blok met self-attention en feed-forward lagen.",
    "page": "api/models.html",
    "section": "gptblock"
  },
  {
    "type": "api",
    "title": "MiniGPT",
    "description": "arclm.models.MiniGPT from arclm.models import MiniGPT Compact causal language model for next-token prediction.",
    "page": "api/models.html",
    "section": "minigpt"
  },
  {
    "type": "api",
    "title": "ModelCapabilityReport",
    "description": "arclm.models.ModelCapabilityReport from arclm.models import ModelCapabilityReport Describes supported operations for one exact model path.",
    "page": "api/models.html",
    "section": "modelcapabilityreport"
  },
  {
    "type": "api",
    "title": "SelfAttention",
    "description": "arclm.models.SelfAttention from arclm.models import SelfAttention Self-attention laag die tokens naar eerdere tokens laat kijken.",
    "page": "api/models.html",
    "section": "selfattention"
  },
  {
    "type": "api",
    "title": "get_model_capability",
    "description": "arclm.models.get_model_capability from arclm.models import get_model_capability Return the capability report for a known exact model path.",
    "page": "api/models.html",
    "section": "get-model-capability"
  },
  {
    "type": "api",
    "title": "model_support_matrix",
    "description": "arclm.models.model_support_matrix from arclm.models import model_support_matrix Return the compact support matrix for the official 0.8 model set.",
    "page": "api/models.html",
    "section": "model-support-matrix"
  },
  {
    "type": "api",
    "title": "LoRAConfig",
    "description": "arclm.peft.LoRAConfig from arclm.peft import LoRAConfig Configuratie voor ArcLM LoRA adapters.",
    "page": "api/peft.html",
    "section": "loraconfig"
  },
  {
    "type": "api",
    "title": "LoRALinear",
    "description": "arclm.peft.LoRALinear from arclm.peft import LoRALinear Lineaire laag met trainbare LoRA matrices bovenop een bevroren basislaag.",
    "page": "api/peft.html",
    "section": "loralinear"
  },
  {
    "type": "api",
    "title": "PeftAdapterInfo",
    "description": "arclm.peft.PeftAdapterInfo from arclm.peft import PeftAdapterInfo Inspectie-info zonder adaptergewichten te laden in een model.",
    "page": "api/peft.html",
    "section": "peftadapterinfo"
  },
  {
    "type": "api",
    "title": "PeftAdapterManifest",
    "description": "arclm.peft.PeftAdapterManifest from arclm.peft import PeftAdapterManifest Manifest voor een ArcLM PEFT adapter.",
    "page": "api/peft.html",
    "section": "peftadaptermanifest"
  },
  {
    "type": "api",
    "title": "PeftApplicationResult",
    "description": "arclm.peft.PeftApplicationResult from arclm.peft import PeftApplicationResult Resultaat van een PEFT-injectie.",
    "page": "api/peft.html",
    "section": "peftapplicationresult"
  },
  {
    "type": "api",
    "title": "PeftConfig",
    "description": "arclm.peft.PeftConfig from arclm.peft import PeftConfig Kleine basisconfig voor PEFT.",
    "page": "api/peft.html",
    "section": "peftconfig"
  },
  {
    "type": "api",
    "title": "PeftMethod",
    "description": "arclm.peft.PeftMethod from arclm.peft import PeftMethod Bekende PEFT-methodes.",
    "page": "api/peft.html",
    "section": "peftmethod"
  },
  {
    "type": "api",
    "title": "PeftParameterReport",
    "description": "arclm.peft.PeftParameterReport from arclm.peft import PeftParameterReport Samenvatting van trainbare en bevroren parameters.",
    "page": "api/peft.html",
    "section": "peftparameterreport"
  },
  {
    "type": "api",
    "title": "PeftTarget",
    "description": "arclm.peft.PeftTarget from arclm.peft import PeftTarget Een lineaire laag die LoRA kan krijgen.",
    "page": "api/peft.html",
    "section": "pefttarget"
  },
  {
    "type": "api",
    "title": "QLoRAConfig",
    "description": "arclm.peft.QLoRAConfig from arclm.peft import QLoRAConfig Configuratie voor QLoRA: 4-bit basis plus LoRA adapters.",
    "page": "api/peft.html",
    "section": "qloraconfig"
  },
  {
    "type": "api",
    "title": "QuantizationBackend",
    "description": "arclm.peft.QuantizationBackend from arclm.peft import QuantizationBackend Bekende quantization backends voor fine-tuning.",
    "page": "api/peft.html",
    "section": "quantizationbackend"
  },
  {
    "type": "api",
    "title": "QuantizationCapabilityReport",
    "description": "arclm.peft.QuantizationCapabilityReport from arclm.peft import QuantizationCapabilityReport Leesbare status van de lokale QLoRA-mogelijkheden.",
    "page": "api/peft.html",
    "section": "quantizationcapabilityreport"
  },
  {
    "type": "api",
    "title": "QuantizationConfig",
    "description": "arclm.peft.QuantizationConfig from arclm.peft import QuantizationConfig Kleine JSON-veilige config voor 4-bit quantization.",
    "page": "api/peft.html",
    "section": "quantizationconfig"
  },
  {
    "type": "api",
    "title": "QuantizationType",
    "description": "arclm.peft.QuantizationType from arclm.peft import QuantizationType 4-bit quantization types die ArcLM accepteert.",
    "page": "api/peft.html",
    "section": "quantizationtype"
  },
  {
    "type": "api",
    "title": "QuantizedComputeDType",
    "description": "arclm.peft.QuantizedComputeDType from arclm.peft import QuantizedComputeDType Compute dtype voor quantized training.",
    "page": "api/peft.html",
    "section": "quantizedcomputedtype"
  },
  {
    "type": "api",
    "title": "QuantizedModelReport",
    "description": "arclm.peft.QuantizedModelReport from arclm.peft import QuantizedModelReport Samenvatting van een quantized QLoRA-runtime model.",
    "page": "api/peft.html",
    "section": "quantizedmodelreport"
  },
  {
    "type": "api",
    "title": "ADAPTER_ARTIFACT_FORMAT",
    "description": "arclm.peft.ADAPTER_ARTIFACT_FORMAT from arclm.peft import ADAPTER_ARTIFACT_FORMAT str(object='') -> str str(bytes_or_buffer[, encoding[, errors]]) -> str Create a new string object from the given object.",
    "page": "api/peft.html",
    "section": "adapter-artifact-format"
  },
  {
    "type": "api",
    "title": "ADAPTER_ARTIFACT_VERSION",
    "description": "arclm.peft.ADAPTER_ARTIFACT_VERSION from arclm.peft import ADAPTER_ARTIFACT_VERSION int([x]) -> integer int(x, base=10) -> integer Convert a number or string to an integer, or return 0 if no arguments are given.",
    "page": "api/peft.html",
    "section": "adapter-artifact-version"
  },
  {
    "type": "api",
    "title": "apply_lora",
    "description": "arclm.peft.apply_lora from arclm.peft import apply_lora Vervangt geselecteerde `nn.Linear` lagen door LoRA wrappers.",
    "page": "api/peft.html",
    "section": "apply-lora"
  },
  {
    "type": "api",
    "title": "apply_peft",
    "description": "arclm.peft.apply_peft from arclm.peft import apply_peft Past de gevraagde PEFT-methode toe.",
    "page": "api/peft.html",
    "section": "apply-peft"
  },
  {
    "type": "api",
    "title": "create_quantized_load_config",
    "description": "arclm.peft.create_quantized_load_config from arclm.peft import create_quantized_load_config Maakt backend-specifieke laadconfig voor tests en integraties.",
    "page": "api/peft.html",
    "section": "create-quantized-load-config"
  },
  {
    "type": "api",
    "title": "fingerprint_base_model",
    "description": "arclm.peft.fingerprint_base_model from arclm.peft import fingerprint_base_model Maakt een structuur-fingerprint zonder adaptergewichten.",
    "page": "api/peft.html",
    "section": "fingerprint-base-model"
  },
  {
    "type": "api",
    "title": "get_lora_state_dict",
    "description": "arclm.peft.get_lora_state_dict from arclm.peft import get_lora_state_dict Haalt alleen adaptergewichten uit het model.",
    "page": "api/peft.html",
    "section": "get-lora-state-dict"
  },
  {
    "type": "api",
    "title": "get_peft_parameter_report",
    "description": "arclm.peft.get_peft_parameter_report from arclm.peft import get_peft_parameter_report Telt trainbare parameters na PEFT-injectie.",
    "page": "api/peft.html",
    "section": "get-peft-parameter-report"
  },
  {
    "type": "api",
    "title": "get_quantization_backend",
    "description": "arclm.peft.get_quantization_backend from arclm.peft import get_quantization_backend Geeft de goedgekeurde backendadapter terug.",
    "page": "api/peft.html",
    "section": "get-quantization-backend"
  },
  {
    "type": "api",
    "title": "inspect_adapter_artifact",
    "description": "arclm.peft.inspect_adapter_artifact from arclm.peft import inspect_adapter_artifact Inspecteert adaptermetadata zonder een model te bouwen.",
    "page": "api/peft.html",
    "section": "inspect-adapter-artifact"
  },
  {
    "type": "api",
    "title": "inspect_lora_targets",
    "description": "arclm.peft.inspect_lora_targets from arclm.peft import inspect_lora_targets Maakt een droog plan zonder het model te wijzigen.",
    "page": "api/peft.html",
    "section": "inspect-lora-targets"
  },
  {
    "type": "api",
    "title": "inspect_quantization_capabilities",
    "description": "arclm.peft.inspect_quantization_capabilities from arclm.peft import inspect_quantization_capabilities Inspecteert QLoRA-mogelijkheden zonder een model te laden.",
    "page": "api/peft.html",
    "section": "inspect-quantization-capabilities"
  },
  {
    "type": "api",
    "title": "is_lora_model",
    "description": "arclm.peft.is_lora_model from arclm.peft import is_lora_model Controleert of een model LoRA-wrappers bevat.",
    "page": "api/peft.html",
    "section": "is-lora-model"
  },
  {
    "type": "api",
    "title": "is_quantized_runtime_model",
    "description": "arclm.peft.is_quantized_runtime_model from arclm.peft import is_quantized_runtime_model Controleert of een model als ArcLM quantized runtime is gemarkeerd.",
    "page": "api/peft.html",
    "section": "is-quantized-runtime-model"
  },
  {
    "type": "api",
    "title": "load_adapter_artifact",
    "description": "arclm.peft.load_adapter_artifact from arclm.peft import load_adapter_artifact Past een LoRA adapterartifact toe op een schoon basismodel.",
    "page": "api/peft.html",
    "section": "load-adapter-artifact"
  },
  {
    "type": "api",
    "title": "load_lora_state_dict",
    "description": "arclm.peft.load_lora_state_dict from arclm.peft import load_lora_state_dict Laadt adaptergewichten in een model dat al LoRA-wrappers heeft.",
    "page": "api/peft.html",
    "section": "load-lora-state-dict"
  },
  {
    "type": "api",
    "title": "load_quantized_model",
    "description": "arclm.peft.load_quantized_model from arclm.peft import load_quantized_model Laadt een lokaal 4-bit model voor QLoRA.",
    "page": "api/peft.html",
    "section": "load-quantized-model"
  },
  {
    "type": "api",
    "title": "merge_lora",
    "description": "arclm.peft.merge_lora from arclm.peft import merge_lora Merged alle LoRA-lagen in-place.",
    "page": "api/peft.html",
    "section": "merge-lora"
  },
  {
    "type": "api",
    "title": "merged_lora_model",
    "description": "arclm.peft.merged_lora_model from arclm.peft import merged_lora_model Geeft een kopie terug waarbij LoRA in gewone Linear lagen is verwerkt.",
    "page": "api/peft.html",
    "section": "merged-lora-model"
  },
  {
    "type": "api",
    "title": "prepare_model_for_qlora",
    "description": "arclm.peft.prepare_model_for_qlora from arclm.peft import prepare_model_for_qlora Bevriest de quantized basis voordat LoRA wordt toegevoegd.",
    "page": "api/peft.html",
    "section": "prepare-model-for-qlora"
  },
  {
    "type": "api",
    "title": "save_adapter_artifact",
    "description": "arclm.peft.save_adapter_artifact from arclm.peft import save_adapter_artifact Bewaart alleen LoRA adaptergewichten.",
    "page": "api/peft.html",
    "section": "save-adapter-artifact"
  },
  {
    "type": "api",
    "title": "unmerge_lora",
    "description": "arclm.peft.unmerge_lora from arclm.peft import unmerge_lora Maakt een eerdere merge ongedaan.",
    "page": "api/peft.html",
    "section": "unmerge-lora"
  },
  {
    "type": "api",
    "title": "validate_adapter_artifact",
    "description": "arclm.peft.validate_adapter_artifact from arclm.peft import validate_adapter_artifact Valideert manifest, paden en hashes zonder adapter te laden.",
    "page": "api/peft.html",
    "section": "validate-adapter-artifact"
  },
  {
    "type": "api",
    "title": "validate_quantized_base_model",
    "description": "arclm.peft.validate_quantized_base_model from arclm.peft import validate_quantized_base_model Controleert dat QLoRA echt op een quantized basis draait.",
    "page": "api/peft.html",
    "section": "validate-quantized-base-model"
  },
  {
    "type": "api",
    "title": "PluginMetadata",
    "description": "arclm.plugins.PluginMetadata from arclm.plugins import PluginMetadata Kleine beschrijving van een plugin.",
    "page": "api/plugins.html",
    "section": "pluginmetadata"
  },
  {
    "type": "api",
    "title": "PluginProtocol",
    "description": "arclm.plugins.PluginProtocol from arclm.plugins import PluginProtocol Contract voor plugins die zelf ArcLM uitbreidingen registreren.",
    "page": "api/plugins.html",
    "section": "pluginprotocol"
  },
  {
    "type": "api",
    "title": "Registry",
    "description": "arclm.registry.Registry from arclm.registry import Registry Koppelt namen aan objecten en controleert dubbele registraties.",
    "page": "api/registry.html",
    "section": "registry"
  },
  {
    "type": "api",
    "title": "Accuracy",
    "description": "arclm.Accuracy from arclm import Accuracy Berekent accuracy voor classificatie of token logits.",
    "page": "api/root.html",
    "section": "accuracy"
  },
  {
    "type": "api",
    "title": "AdaptedModelBundle",
    "description": "arclm.AdaptedModelBundle from arclm import AdaptedModelBundle ArcLM model and metadata produced from a normalized checkpoint.",
    "page": "api/root.html",
    "section": "adaptedmodelbundle"
  },
  {
    "type": "api",
    "title": "And",
    "description": "arclm.And from arclm import And Logische AND met een of meer conjuncties.",
    "page": "api/root.html",
    "section": "and"
  },
  {
    "type": "api",
    "title": "ArcLM",
    "description": "arclm.ArcLM from arclm import ArcLM Compact causal language model for next-token prediction.",
    "page": "api/root.html",
    "section": "arclm"
  },
  {
    "type": "api",
    "title": "AutoModel",
    "description": "arclm.AutoModel from arclm import AutoModel Factory for ArcLM model classes supported by the current package.",
    "page": "api/root.html",
    "section": "automodel"
  },
  {
    "type": "api",
    "title": "AutoTokenizer",
    "description": "arclm.AutoTokenizer from arclm import AutoTokenizer Maakt ondersteunde ArcLM tokenizers vanuit config of type-naam.",
    "page": "api/root.html",
    "section": "autotokenizer"
  },
  {
    "type": "api",
    "title": "BaseAugmenter",
    "description": "arclm.BaseAugmenter from arclm import BaseAugmenter Basis class voor eigen data augmenters.",
    "page": "api/root.html",
    "section": "baseaugmenter"
  },
  {
    "type": "api",
    "title": "BaseCallback",
    "description": "arclm.BaseCallback from arclm import BaseCallback Basis class voor eigen training callbacks.",
    "page": "api/root.html",
    "section": "basecallback"
  },
  {
    "type": "api",
    "title": "BaseCleaner",
    "description": "arclm.BaseCleaner from arclm import BaseCleaner Basis class voor eigen data cleaners.",
    "page": "api/root.html",
    "section": "basecleaner"
  },
  {
    "type": "api",
    "title": "BaseDataset",
    "description": "arclm.BaseDataset from arclm import BaseDataset Basis class voor datasets met lengte en index-toegang.",
    "page": "api/root.html",
    "section": "basedataset"
  },
  {
    "type": "api",
    "title": "BaseDataStep",
    "description": "arclm.BaseDataStep from arclm import BaseDataStep Basis class voor een stap die een voorbeeld verwerkt.",
    "page": "api/root.html",
    "section": "basedatastep"
  },
  {
    "type": "api",
    "title": "BaseDeduplicator",
    "description": "arclm.BaseDeduplicator from arclm import BaseDeduplicator Basis class voor deduplicatie over een hele dataset.",
    "page": "api/root.html",
    "section": "basededuplicator"
  },
  {
    "type": "api",
    "title": "BaseEvaluationCallback",
    "description": "arclm.BaseEvaluationCallback from arclm import BaseEvaluationCallback Basis class voor eigen evaluation callbacks.",
    "page": "api/root.html",
    "section": "baseevaluationcallback"
  },
  {
    "type": "api",
    "title": "BaseEvaluator",
    "description": "arclm.BaseEvaluator from arclm import BaseEvaluator Basis class voor eigen evaluators.",
    "page": "api/root.html",
    "section": "baseevaluator"
  },
  {
    "type": "api",
    "title": "BaseFineTuner",
    "description": "arclm.BaseFineTuner from arclm import BaseFineTuner Basis class voor developers die een eigen fine-tuner willen maken.",
    "page": "api/root.html",
    "section": "basefinetuner"
  },
  {
    "type": "api",
    "title": "BaseMetric",
    "description": "arclm.BaseMetric from arclm import BaseMetric Basis class voor developers die een eigen metric willen maken.",
    "page": "api/root.html",
    "section": "basemetric"
  },
  {
    "type": "api",
    "title": "BaseModelAdapter",
    "description": "arclm.BaseModelAdapter from arclm import BaseModelAdapter Basis class voor adapters tussen twee model implementaties.",
    "page": "api/root.html",
    "section": "basemodeladapter"
  },
  {
    "type": "api",
    "title": "BaseModelLoader",
    "description": "arclm.BaseModelLoader from arclm import BaseModelLoader Basis class voor model loaders die een model en metadata geven.",
    "page": "api/root.html",
    "section": "basemodelloader"
  },
  {
    "type": "api",
    "title": "BaseStreamingDataset",
    "description": "arclm.BaseStreamingDataset from arclm import BaseStreamingDataset Basis class voor datasets die je alleen kunt doorlopen.",
    "page": "api/root.html",
    "section": "basestreamingdataset"
  },
  {
    "type": "api",
    "title": "BaseSyntheticDataGenerator",
    "description": "arclm.BaseSyntheticDataGenerator from arclm import BaseSyntheticDataGenerator Basis class voor eigen synthetic-data generators.",
    "page": "api/root.html",
    "section": "basesyntheticdatagenerator"
  },
  {
    "type": "api",
    "title": "BaseTrainer",
    "description": "arclm.BaseTrainer from arclm import BaseTrainer Basis class voor developers die een eigen trainer willen maken.",
    "page": "api/root.html",
    "section": "basetrainer"
  },
  {
    "type": "api",
    "title": "BaseTrainingPipeline",
    "description": "arclm.BaseTrainingPipeline from arclm import BaseTrainingPipeline Basis class voor aanpasbare training pipelines.",
    "page": "api/root.html",
    "section": "basetrainingpipeline"
  },
  {
    "type": "api",
    "title": "Biconditional",
    "description": "arclm.Biconditional from arclm import Biconditional Logische zin die waar is als beide kanten gelijk zijn.",
    "page": "api/root.html",
    "section": "biconditional"
  },
  {
    "type": "api",
    "title": "ConceptBenchmarkCase",
    "description": "arclm.ConceptBenchmarkCase from arclm import ConceptBenchmarkCase Expected concept relationships for a prompt.",
    "page": "api/root.html",
    "section": "conceptbenchmarkcase"
  },
  {
    "type": "api",
    "title": "ConceptBenchmarkResult",
    "description": "arclm.ConceptBenchmarkResult from arclm import ConceptBenchmarkResult Concept benchmark score for one prompt.",
    "page": "api/root.html",
    "section": "conceptbenchmarkresult"
  },
  {
    "type": "api",
    "title": "Config",
    "description": "arclm.Config from arclm import Config Houdt alle belangrijke ArcLM instellingen bij.",
    "page": "api/root.html",
    "section": "config"
  },
  {
    "type": "api",
    "title": "DataBundle",
    "description": "arclm.DataBundle from arclm import DataBundle Bundel met tokens, tokenizer en loaders voor training.",
    "page": "api/root.html",
    "section": "databundle"
  },
  {
    "type": "api",
    "title": "DataPipeline",
    "description": "arclm.DataPipeline from arclm import DataPipeline Voert meerdere data-stappen na elkaar uit.",
    "page": "api/root.html",
    "section": "datapipeline"
  },
  {
    "type": "api",
    "title": "DataProcessor",
    "description": "arclm.DataProcessor from arclm import DataProcessor Compatibility-friendly entry point for ``ProcessedDataset`` workflows.",
    "page": "api/root.html",
    "section": "dataprocessor"
  },
  {
    "type": "api",
    "title": "DatasetConfig",
    "description": "arclm.DatasetConfig from arclm import DatasetConfig Configuratie voor `load_dataset` wanneer je opties wilt hergebruiken.",
    "page": "api/root.html",
    "section": "datasetconfig"
  },
  {
    "type": "api",
    "title": "DatasetLoader",
    "description": "arclm.DatasetLoader from arclm import DatasetLoader Laadt datasets uit simpele lokale bronnen.",
    "page": "api/root.html",
    "section": "datasetloader"
  },
  {
    "type": "api",
    "title": "DatasetManifest",
    "description": "arclm.DatasetManifest from arclm import DatasetManifest Lightweight provenance metadata for a processed dataset.",
    "page": "api/root.html",
    "section": "datasetmanifest"
  },
  {
    "type": "api",
    "title": "DatasetReport",
    "description": "arclm.DatasetReport from arclm import DatasetReport A compact processed-dataset and tokenization report.",
    "page": "api/root.html",
    "section": "datasetreport"
  },
  {
    "type": "api",
    "title": "DatasetValidationIssue",
    "description": "arclm.DatasetValidationIssue from arclm import DatasetValidationIssue One validation problem tied to a record index and field.",
    "page": "api/root.html",
    "section": "datasetvalidationissue"
  },
  {
    "type": "api",
    "title": "DatasetValidationResult",
    "description": "arclm.DatasetValidationResult from arclm import DatasetValidationResult Result of validating records against a small field schema.",
    "page": "api/root.html",
    "section": "datasetvalidationresult"
  },
  {
    "type": "api",
    "title": "DeduplicationResult",
    "description": "arclm.DeduplicationResult from arclm import DeduplicationResult Resultaat van een deduplicatie stap.",
    "page": "api/root.html",
    "section": "deduplicationresult"
  },
  {
    "type": "api",
    "title": "EarlyStopping",
    "description": "arclm.EarlyStopping from arclm import EarlyStopping Early stopping to prevent overfitting",
    "page": "api/root.html",
    "section": "earlystopping"
  },
  {
    "type": "api",
    "title": "EntailmentResult",
    "description": "arclm.EntailmentResult from arclm import EntailmentResult Resultaat van een vraag aan een knowledge base.",
    "page": "api/root.html",
    "section": "entailmentresult"
  },
  {
    "type": "api",
    "title": "EvaluationConfig",
    "description": "arclm.EvaluationConfig from arclm import EvaluationConfig Bewaart instellingen voor een evaluatierun.",
    "page": "api/root.html",
    "section": "evaluationconfig"
  },
  {
    "type": "api",
    "title": "EvaluationReport",
    "description": "arclm.EvaluationReport from arclm import EvaluationReport Structured, JSON-safe summary of an evaluation run.",
    "page": "api/root.html",
    "section": "evaluationreport"
  },
  {
    "type": "api",
    "title": "EvaluationResult",
    "description": "arclm.EvaluationResult from arclm import EvaluationResult Bewaart de uitkomst van een evaluatierun.",
    "page": "api/root.html",
    "section": "evaluationresult"
  },
  {
    "type": "api",
    "title": "Evaluator",
    "description": "arclm.Evaluator from arclm import Evaluator Voert evaluatie uit op een model en dataset.",
    "page": "api/root.html",
    "section": "evaluator"
  },
  {
    "type": "api",
    "title": "ExactDeduplicator",
    "description": "arclm.ExactDeduplicator from arclm import ExactDeduplicator Verwijdert voorbeelden met dezelfde waarde in gekozen velden.",
    "page": "api/root.html",
    "section": "exactdeduplicator"
  },
  {
    "type": "api",
    "title": "ExternalLoadedModel",
    "description": "arclm.ExternalLoadedModel from arclm import ExternalLoadedModel Loaded model wrapper with a unified inference and save API.",
    "page": "api/root.html",
    "section": "externalloadedmodel"
  },
  {
    "type": "api",
    "title": "ExternalModelConfig",
    "description": "arclm.ExternalModelConfig from arclm import ExternalModelConfig Configuration for loading native or external causal language models.",
    "page": "api/root.html",
    "section": "externalmodelconfig"
  },
  {
    "type": "api",
    "title": "FullFineTuner",
    "description": "arclm.FullFineTuner from arclm import FullFineTuner Traint alle trainbare modelparameters met de Training Core.",
    "page": "api/root.html",
    "section": "fullfinetuner"
  },
  {
    "type": "api",
    "title": "GeneralizationMonitor",
    "description": "arclm.GeneralizationMonitor from arclm import GeneralizationMonitor Monitor model generalization during training Traceert training vs validation loss om overfitting te detecteren",
    "page": "api/root.html",
    "section": "generalizationmonitor"
  },
  {
    "type": "api",
    "title": "GenerationConfig",
    "description": "arclm.GenerationConfig from arclm import GenerationConfig Text generation defaults used by :class:`ExternalLoadedModel`.",
    "page": "api/root.html",
    "section": "generationconfig"
  },
  {
    "type": "api",
    "title": "Generator",
    "description": "arclm.Generator from arclm import Generator Generate tokens from a trained native causal language model.",
    "page": "api/root.html",
    "section": "generator"
  },
  {
    "type": "api",
    "title": "Implication",
    "description": "arclm.Implication from arclm import Implication Logische zin van de vorm als A dan B.",
    "page": "api/root.html",
    "section": "implication"
  },
  {
    "type": "api",
    "title": "InstructionDataset",
    "description": "arclm.InstructionDataset from arclm import InstructionDataset Dataset voor instruction tuning met loss alleen op response tokens.",
    "page": "api/root.html",
    "section": "instructiondataset"
  },
  {
    "type": "api",
    "title": "KnowledgeBase",
    "description": "arclm.KnowledgeBase from arclm import KnowledgeBase Bewaart logische regels en beantwoordt simpele vragen.",
    "page": "api/root.html",
    "section": "knowledgebase"
  },
  {
    "type": "api",
    "title": "L1Regularization",
    "description": "arclm.L1Regularization from arclm import L1Regularization L1 Regularization - Sparsity inducing",
    "page": "api/root.html",
    "section": "l1regularization"
  },
  {
    "type": "api",
    "title": "L2Regularization",
    "description": "arclm.L2Regularization from arclm import L2Regularization L2 Regularization (Weight Decay) - Smoothness inducing",
    "page": "api/root.html",
    "section": "l2regularization"
  },
  {
    "type": "api",
    "title": "LabelSmoothing",
    "description": "arclm.LabelSmoothing from arclm import LabelSmoothing Label smoothing regularization Voorkomt overconfident voorspellingen door targets glad te maken",
    "page": "api/root.html",
    "section": "labelsmoothing"
  },
  {
    "type": "api",
    "title": "LearningRateScheduler",
    "description": "arclm.LearningRateScheduler from arclm import LearningRateScheduler Learning rate scheduler for better generalization Reduce learning rate during training for better convergence",
    "page": "api/root.html",
    "section": "learningratescheduler"
  },
  {
    "type": "api",
    "title": "LoadedCheckpoint",
    "description": "arclm.LoadedCheckpoint from arclm import LoadedCheckpoint Normalized representation of a model source that ArcLM can inspect.",
    "page": "api/root.html",
    "section": "loadedcheckpoint"
  },
  {
    "type": "api",
    "title": "LoadedModel",
    "description": "arclm.LoadedModel from arclm import LoadedModel Loaded model bundle with a minimal prediction method.",
    "page": "api/root.html",
    "section": "loadedmodel"
  },
  {
    "type": "api",
    "title": "LoadPlan",
    "description": "arclm.LoadPlan from arclm import LoadPlan Detected and user-selected settings for loading a model source.",
    "page": "api/root.html",
    "section": "loadplan"
  },
  {
    "type": "api",
    "title": "LongContextResult",
    "description": "arclm.LongContextResult from arclm import LongContextResult Summary for one long-context training/evaluation run.",
    "page": "api/root.html",
    "section": "longcontextresult"
  },
  {
    "type": "api",
    "title": "LossMetric",
    "description": "arclm.LossMetric from arclm import LossMetric Berekent gemiddelde loss per batch.",
    "page": "api/root.html",
    "section": "lossmetric"
  },
  {
    "type": "api",
    "title": "MetricsReport",
    "description": "arclm.MetricsReport from arclm import MetricsReport Comprehensive metrics report for model evaluation.",
    "page": "api/root.html",
    "section": "metricsreport"
  },
  {
    "type": "api",
    "title": "MiniGPT",
    "description": "arclm.MiniGPT from arclm import MiniGPT Compact causal language model for next-token prediction.",
    "page": "api/root.html",
    "section": "minigpt"
  },
  {
    "type": "api",
    "title": "MixupAugmentation",
    "description": "arclm.MixupAugmentation from arclm import MixupAugmentation Mixup data augmentation for better generalization Combineert twee samples lineair om data augmentation te krijgen",
    "page": "api/root.html",
    "section": "mixupaugmentation"
  },
  {
    "type": "api",
    "title": "ModelAdapter",
    "description": "arclm.ModelAdapter from arclm import ModelAdapter Adapt weights from external models to ArcLM architecture.",
    "page": "api/root.html",
    "section": "modeladapter"
  },
  {
    "type": "api",
    "title": "ModelCapabilityReport",
    "description": "arclm.ModelCapabilityReport from arclm import ModelCapabilityReport Describes supported operations for one exact model path.",
    "page": "api/root.html",
    "section": "modelcapabilityreport"
  },
  {
    "type": "api",
    "title": "ModelInspector",
    "description": "arclm.ModelInspector from arclm import ModelInspector Base class for source inspectors used by ``SmartLoader``.",
    "page": "api/root.html",
    "section": "modelinspector"
  },
  {
    "type": "api",
    "title": "ModelSaveConfig",
    "description": "arclm.ModelSaveConfig from arclm import ModelSaveConfig Developer-controlled settings for saving or exporting loaded models.",
    "page": "api/root.html",
    "section": "modelsaveconfig"
  },
  {
    "type": "api",
    "title": "ModelSourceInfo",
    "description": "arclm.ModelSourceInfo from arclm import ModelSourceInfo Structured inspection result for a model source.",
    "page": "api/root.html",
    "section": "modelsourceinfo"
  },
  {
    "type": "api",
    "title": "Not",
    "description": "arclm.Not from arclm import Not Logische NOT rond een operand.",
    "page": "api/root.html",
    "section": "not"
  },
  {
    "type": "api",
    "title": "Or",
    "description": "arclm.Or from arclm import Or Logische OR met een of meer disjuncties.",
    "page": "api/root.html",
    "section": "or"
  },
  {
    "type": "api",
    "title": "Perplexity",
    "description": "arclm.Perplexity from arclm import Perplexity Berekent perplexity uit gemiddelde loss.",
    "page": "api/root.html",
    "section": "perplexity"
  },
  {
    "type": "api",
    "title": "PipelineTrace",
    "description": "arclm.PipelineTrace from arclm import PipelineTrace JSON-safe summary of one inspected native ArcLM generation step.",
    "page": "api/root.html",
    "section": "pipelinetrace"
  },
  {
    "type": "api",
    "title": "PreTrainedModelLoader",
    "description": "arclm.PreTrainedModelLoader from arclm import PreTrainedModelLoader Load pre-trained models from multiple sources: - HuggingFace transformers - Local checkpoint files - Custom model paths Handles weight alignment and architecture mismatch gracefully.",
    "page": "api/root.html",
    "section": "pretrainedmodelloader"
  },
  {
    "type": "api",
    "title": "ProcessedDataset",
    "description": "arclm.ProcessedDataset from arclm import ProcessedDataset Kleine in-memory dataset voor formatting, cleaning en splits.",
    "page": "api/root.html",
    "section": "processeddataset"
  },
  {
    "type": "api",
    "title": "RemoveDuplicates",
    "description": "arclm.RemoveDuplicates from arclm import RemoveDuplicates Verwijdert voorbeelden met dezelfde waarde in gekozen velden.",
    "page": "api/root.html",
    "section": "removeduplicates"
  },
  {
    "type": "api",
    "title": "Sentence",
    "description": "arclm.Sentence from arclm import Sentence Basis class voor logische zinnen.",
    "page": "api/root.html",
    "section": "sentence"
  },
  {
    "type": "api",
    "title": "SentencePieceTokenizer",
    "description": "arclm.SentencePieceTokenizer from arclm import SentencePieceTokenizer SentencePiece tokenizer voor subword taalmodeltraining.",
    "page": "api/root.html",
    "section": "sentencepiecetokenizer"
  },
  {
    "type": "api",
    "title": "SFTConfig",
    "description": "arclm.SFTConfig from arclm import SFTConfig Bewaart instellingen voor supervised fine-tuning.",
    "page": "api/root.html",
    "section": "sftconfig"
  },
  {
    "type": "api",
    "title": "SFTDataCollator",
    "description": "arclm.SFTDataCollator from arclm import SFTDataCollator Zet SFT voorbeelden om naar tensors voor de trainer.",
    "page": "api/root.html",
    "section": "sftdatacollator"
  },
  {
    "type": "api",
    "title": "SFTRecordContract",
    "description": "arclm.SFTRecordContract from arclm import SFTRecordContract Public description of accepted SFT record fields.",
    "page": "api/root.html",
    "section": "sftrecordcontract"
  },
  {
    "type": "api",
    "title": "SFTTrainer",
    "description": "arclm.SFTTrainer from arclm import SFTTrainer Traint een tekstmodel met instruction-, chat- of tekstdatasets.",
    "page": "api/root.html",
    "section": "sfttrainer"
  },
  {
    "type": "api",
    "title": "SFTTrainingResult",
    "description": "arclm.SFTTrainingResult from arclm import SFTTrainingResult Result returned by ``train_sft``.",
    "page": "api/root.html",
    "section": "sfttrainingresult"
  },
  {
    "type": "api",
    "title": "SmartLoader",
    "description": "arclm.SmartLoader from arclm import SmartLoader High-level loading entry point with inspection and manual overrides.",
    "page": "api/root.html",
    "section": "smartloader"
  },
  {
    "type": "api",
    "title": "StoppingCriteria",
    "description": "arclm.StoppingCriteria from arclm import StoppingCriteria Base stopping criteria for training loop control.",
    "page": "api/root.html",
    "section": "stoppingcriteria"
  },
  {
    "type": "api",
    "title": "StreamingDataset",
    "description": "arclm.StreamingDataset from arclm import StreamingDataset Dataset die voorbeelden pas leest tijdens het itereren.",
    "page": "api/root.html",
    "section": "streamingdataset"
  },
  {
    "type": "api",
    "title": "Symbol",
    "description": "arclm.Symbol from arclm import Symbol Een enkel logisch symbool, zoals P of Q.",
    "page": "api/root.html",
    "section": "symbol"
  },
  {
    "type": "api",
    "title": "TextDataset",
    "description": "arclm.TextDataset from arclm import TextDataset Dataset voor taalmodeltraining met een schuivend venster.",
    "page": "api/root.html",
    "section": "textdataset"
  },
  {
    "type": "api",
    "title": "TextGenerator",
    "description": "arclm.TextGenerator from arclm import TextGenerator Generate tokens from a trained native causal language model.",
    "page": "api/root.html",
    "section": "textgenerator"
  },
  {
    "type": "api",
    "title": "Tokenizer",
    "description": "arclm.Tokenizer from arclm import Tokenizer Zet tekst om naar woord-tokens en token ids.",
    "page": "api/root.html",
    "section": "tokenizer"
  },
  {
    "type": "api",
    "title": "TokenizerAdapter",
    "description": "arclm.TokenizerAdapter from arclm import TokenizerAdapter Zet verschillende tokenizers om naar \u00e9\u00e9n eenvoudige interface.",
    "page": "api/root.html",
    "section": "tokenizeradapter"
  },
  {
    "type": "api",
    "title": "TokenizerFactory",
    "description": "arclm.TokenizerFactory from arclm import TokenizerFactory Kiest en maakt tokenizer classes op basis van een korte naam.",
    "page": "api/root.html",
    "section": "tokenizerfactory"
  },
  {
    "type": "api",
    "title": "TopKPrediction",
    "description": "arclm.TopKPrediction from arclm import TopKPrediction One next-token prediction.",
    "page": "api/root.html",
    "section": "topkprediction"
  },
  {
    "type": "api",
    "title": "Trainer",
    "description": "arclm.Trainer from arclm import Trainer Traint een model op \u00e9\u00e9n apparaat.",
    "page": "api/root.html",
    "section": "trainer"
  },
  {
    "type": "api",
    "title": "TrainingConfig",
    "description": "arclm.TrainingConfig from arclm import TrainingConfig Houdt alle belangrijke ArcLM instellingen bij.",
    "page": "api/root.html",
    "section": "trainingconfig"
  },
  {
    "type": "api",
    "title": "TrainingResult",
    "description": "arclm.TrainingResult from arclm import TrainingResult Resultaat dat `train_model` teruggeeft na een trainingsrun.",
    "page": "api/root.html",
    "section": "trainingresult"
  },
  {
    "type": "api",
    "title": "TrainingState",
    "description": "arclm.TrainingState from arclm import TrainingState Houdt bij waar de training is.",
    "page": "api/root.html",
    "section": "trainingstate"
  },
  {
    "type": "api",
    "title": "UnifiedPipeline",
    "description": "arclm.UnifiedPipeline from arclm import UnifiedPipeline Unified training pipeline supporting multiple modes: - PRE_TRAINING: Train from scratch on large corpus - FINE_TUNING: Fine-tune pre-trained model on task data - INSTRUCTION_TUNING: Fine-tune on instruction-response pair",
    "page": "api/root.html",
    "section": "unifiedpipeline"
  },
  {
    "type": "api",
    "title": "__version__",
    "description": "arclm.__version__ from arclm import __version__ str(object='') -> str str(bytes_or_buffer[, encoding[, errors]]) -> str Create a new string object from the given object.",
    "page": "api/root.html",
    "section": "version"
  },
  {
    "type": "api",
    "title": "DEFAULT_CONCEPT_BENCHMARKS",
    "description": "arclm.DEFAULT_CONCEPT_BENCHMARKS from arclm import DEFAULT_CONCEPT_BENCHMARKS Built-in mutable sequence.",
    "page": "api/root.html",
    "section": "default-concept-benchmarks"
  },
  {
    "type": "api",
    "title": "DEFAULT_MODEL_PATH",
    "description": "arclm.DEFAULT_MODEL_PATH from arclm import DEFAULT_MODEL_PATH Path subclass for Windows systems.",
    "page": "api/root.html",
    "section": "default-model-path"
  },
  {
    "type": "api",
    "title": "adapt_for_training",
    "description": "arclm.adapt_for_training from arclm import adapt_for_training Create an ArcLM model from a normalized checkpoint.",
    "page": "api/root.html",
    "section": "adapt-for-training"
  },
  {
    "type": "api",
    "title": "build_dataset_report",
    "description": "arclm.build_dataset_report from arclm import build_dataset_report Build a processed dataset report with optional token statistics.",
    "page": "api/root.html",
    "section": "build-dataset-report"
  },
  {
    "type": "api",
    "title": "build_evaluation_report",
    "description": "arclm.build_evaluation_report from arclm import build_evaluation_report Build a report from canonical evaluator metrics without recalculation.",
    "page": "api/root.html",
    "section": "build-evaluation-report"
  },
  {
    "type": "api",
    "title": "build_model",
    "description": "arclm.build_model from arclm import build_model Maakt een ArcLM model vanuit config en zet het op het gekozen device.",
    "page": "api/root.html",
    "section": "build-model"
  },
  {
    "type": "api",
    "title": "build_trainer",
    "description": "arclm.build_trainer from arclm import build_trainer Maakt de optimizer, loss function en Trainer voor een model.",
    "page": "api/root.html",
    "section": "build-trainer"
  },
  {
    "type": "api",
    "title": "build_training_diagnostics_report",
    "description": "arclm.build_training_diagnostics_report from arclm import build_training_diagnostics_report Build tokenizer, top-k, and concept benchmark diagnostics for a run.",
    "page": "api/root.html",
    "section": "build-training-diagnostics-report"
  },
  {
    "type": "api",
    "title": "calculate_metrics",
    "description": "arclm.calculate_metrics from arclm import calculate_metrics Calculate comprehensive evaluation metrics.",
    "page": "api/root.html",
    "section": "calculate-metrics"
  },
  {
    "type": "api",
    "title": "calculate_perplexity",
    "description": "arclm.calculate_perplexity from arclm import calculate_perplexity Return perplexity for a cross-entropy loss value.",
    "page": "api/root.html",
    "section": "calculate-perplexity"
  },
  {
    "type": "api",
    "title": "checkpoint_is_compatible_for_continue_training",
    "description": "arclm.checkpoint_is_compatible_for_continue_training from arclm import checkpoint_is_compatible_for_continue_training Controleert of een checkpoint past bij continued training.",
    "page": "api/root.html",
    "section": "checkpoint-is-compatible-for-continue-training"
  },
  {
    "type": "api",
    "title": "checkpoint_is_compatible_for_tuining",
    "description": "arclm.checkpoint_is_compatible_for_tuining from arclm import checkpoint_is_compatible_for_tuining Controleert of een checkpoint past bij finetuning.",
    "page": "api/root.html",
    "section": "checkpoint-is-compatible-for-tuining"
  },
  {
    "type": "api",
    "title": "continue_native_training",
    "description": "arclm.continue_native_training from arclm import continue_native_training Continue native ArcLM training via ``train_model``.",
    "page": "api/root.html",
    "section": "continue-native-training"
  },
  {
    "type": "api",
    "title": "create_checkpoint_callback",
    "description": "arclm.create_checkpoint_callback from arclm import create_checkpoint_callback Maakt een callback die het laatste hervatbare checkpoint opslaat.",
    "page": "api/root.html",
    "section": "create-checkpoint-callback"
  },
  {
    "type": "api",
    "title": "create_config",
    "description": "arclm.create_config from arclm import create_config Maakt een `Config` met praktische defaults.",
    "page": "api/root.html",
    "section": "create-config"
  },
  {
    "type": "api",
    "title": "create_dataloader",
    "description": "arclm.create_dataloader from arclm import create_dataloader Maakt een PyTorch DataLoader van token ids.",
    "page": "api/root.html",
    "section": "create-dataloader"
  },
  {
    "type": "api",
    "title": "create_dataset_manifest",
    "description": "arclm.create_dataset_manifest from arclm import create_dataset_manifest Create lightweight dataset provenance without storing record values.",
    "page": "api/root.html",
    "section": "create-dataset-manifest"
  },
  {
    "type": "api",
    "title": "create_epoch_checkpoint_callback",
    "description": "arclm.create_epoch_checkpoint_callback from arclm import create_epoch_checkpoint_callback Oude alias voor `create_checkpoint_callback`.",
    "page": "api/root.html",
    "section": "create-epoch-checkpoint-callback"
  },
  {
    "type": "api",
    "title": "create_instruction_dataloader",
    "description": "arclm.create_instruction_dataloader from arclm import create_instruction_dataloader Maakt een DataLoader voor instruction tuning.",
    "page": "api/root.html",
    "section": "create-instruction-dataloader"
  },
  {
    "type": "api",
    "title": "create_simple_interface_app",
    "description": "arclm.create_simple_interface_app from arclm import create_simple_interface_app Create the optional Flask app for ArcLM's simple web interface.",
    "page": "api/root.html",
    "section": "create-simple-interface-app"
  },
  {
    "type": "api",
    "title": "create_symbols",
    "description": "arclm.create_symbols from arclm import create_symbols Maakt meerdere symbolen en geeft ze terug in een dict.",
    "page": "api/root.html",
    "section": "create-symbols"
  },
  {
    "type": "api",
    "title": "create_tokenizer",
    "description": "arclm.create_tokenizer from arclm import create_tokenizer Maakt een tokenizer met een korte type-naam.",
    "page": "api/root.html",
    "section": "create-tokenizer"
  },
  {
    "type": "api",
    "title": "deduplicate",
    "description": "arclm.deduplicate from arclm import deduplicate Verwijdert exacte duplicaten met `ExactDeduplicator`.",
    "page": "api/root.html",
    "section": "deduplicate"
  },
  {
    "type": "api",
    "title": "evaluate",
    "description": "arclm.evaluate from arclm import evaluate Voert evaluatie uit met de standaard `Evaluator`.",
    "page": "api/root.html",
    "section": "evaluate"
  },
  {
    "type": "api",
    "title": "export_metrics_to_json",
    "description": "arclm.export_metrics_to_json from arclm import export_metrics_to_json Export metrics report to JSON file.",
    "page": "api/root.html",
    "section": "export-metrics-to-json"
  },
  {
    "type": "api",
    "title": "export_metrics_to_markdown",
    "description": "arclm.export_metrics_to_markdown from arclm import export_metrics_to_markdown Export metrics report to Markdown file.",
    "page": "api/root.html",
    "section": "export-metrics-to-markdown"
  },
  {
    "type": "api",
    "title": "fine_tune_external_model",
    "description": "arclm.fine_tune_external_model from arclm import fine_tune_external_model Fine-tune an external model through supported ArcLM training backends.",
    "page": "api/root.html",
    "section": "fine-tune-external-model"
  },
  {
    "type": "api",
    "title": "fine_tune_native_model",
    "description": "arclm.fine_tune_native_model from arclm import fine_tune_native_model Fine-tune a native ArcLM checkpoint via ``train_model``.",
    "page": "api/root.html",
    "section": "fine-tune-native-model"
  },
  {
    "type": "api",
    "title": "format_concept_benchmark_report",
    "description": "arclm.format_concept_benchmark_report from arclm import format_concept_benchmark_report Create a readable concept benchmark report.",
    "page": "api/root.html",
    "section": "format-concept-benchmark-report"
  },
  {
    "type": "api",
    "title": "format_duration",
    "description": "arclm.format_duration from arclm import format_duration Zet seconden om naar uren, minuten en seconden.",
    "page": "api/root.html",
    "section": "format-duration"
  },
  {
    "type": "api",
    "title": "format_long_context_results",
    "description": "arclm.format_long_context_results from arclm import format_long_context_results Create a readable long-context comparison report.",
    "page": "api/root.html",
    "section": "format-long-context-results"
  },
  {
    "type": "api",
    "title": "format_tokenizer_coverage_report",
    "description": "arclm.format_tokenizer_coverage_report from arclm import format_tokenizer_coverage_report Create a readable tokenizer coverage report.",
    "page": "api/root.html",
    "section": "format-tokenizer-coverage-report"
  },
  {
    "type": "api",
    "title": "format_top_k_predictions",
    "description": "arclm.format_top_k_predictions from arclm import format_top_k_predictions Create a readable diagnostic report for one prompt.",
    "page": "api/root.html",
    "section": "format-top-k-predictions"
  },
  {
    "type": "api",
    "title": "get_api_version",
    "description": "arclm.get_api_version from arclm import get_api_version Return the installed ArcLM API version.",
    "page": "api/root.html",
    "section": "get-api-version"
  },
  {
    "type": "api",
    "title": "get_device",
    "description": "arclm.get_device from arclm import get_device Return the preferred local torch device.",
    "page": "api/root.html",
    "section": "get-device"
  },
  {
    "type": "api",
    "title": "get_model_capability",
    "description": "arclm.get_model_capability from arclm import get_model_capability Return the capability report for a known exact model path.",
    "page": "api/root.html",
    "section": "get-model-capability"
  },
  {
    "type": "api",
    "title": "get_sft_record_contract",
    "description": "arclm.get_sft_record_contract from arclm import get_sft_record_contract Describe one supported SFT record format.",
    "page": "api/root.html",
    "section": "get-sft-record-contract"
  },
  {
    "type": "api",
    "title": "get_tokenizer_from_config",
    "description": "arclm.get_tokenizer_from_config from arclm import get_tokenizer_from_config Maakt een tokenizer vanuit een config object.",
    "page": "api/root.html",
    "section": "get-tokenizer-from-config"
  },
  {
    "type": "api",
    "title": "get_version",
    "description": "arclm.get_version from arclm import get_version Return the installed ArcLM version.",
    "page": "api/root.html",
    "section": "get-version"
  },
  {
    "type": "api",
    "title": "inspect_model_source",
    "description": "arclm.inspect_model_source from arclm import inspect_model_source Inspect a local path or Hugging Face model ID before loading.",
    "page": "api/root.html",
    "section": "inspect-model-source"
  },
  {
    "type": "api",
    "title": "inspect_text",
    "description": "arclm.inspect_text from arclm import inspect_text Inspect one native ArcLM text-generation step.",
    "page": "api/root.html",
    "section": "inspect-text"
  },
  {
    "type": "api",
    "title": "list_available_models",
    "description": "arclm.list_available_models from arclm import list_available_models List local ``.pth`` checkpoints in a models directory.",
    "page": "api/root.html",
    "section": "list-available-models"
  },
  {
    "type": "api",
    "title": "load_any_model",
    "description": "arclm.load_any_model from arclm import load_any_model Load any supported ArcLM or Hugging Face causal LM source for inference.",
    "page": "api/root.html",
    "section": "load-any-model"
  },
  {
    "type": "api",
    "title": "load_compatible_checkpoint",
    "description": "arclm.load_compatible_checkpoint from arclm import load_compatible_checkpoint Laadt een bestaand checkpoint als het past bij deze training.",
    "page": "api/root.html",
    "section": "load-compatible-checkpoint"
  },
  {
    "type": "api",
    "title": "load_dataset",
    "description": "arclm.load_dataset from arclm import load_dataset Laadt een dataset met de standaard DatasetLoader.",
    "page": "api/root.html",
    "section": "load-dataset"
  },
  {
    "type": "api",
    "title": "load_external_for_inference",
    "description": "arclm.load_external_for_inference from arclm import load_external_for_inference Backward-friendly alias for :func:`load_any_model`.",
    "page": "api/root.html",
    "section": "load-external-for-inference"
  },
  {
    "type": "api",
    "title": "load_external_model",
    "description": "arclm.load_external_model from arclm import load_external_model Load any supported external source into a normalized checkpoint bundle.",
    "page": "api/root.html",
    "section": "load-external-model"
  },
  {
    "type": "api",
    "title": "load_model",
    "description": "arclm.load_model from arclm import load_model Load a trained ArcLM checkpoint for inference.",
    "page": "api/root.html",
    "section": "load-model"
  },
  {
    "type": "api",
    "title": "load_tokens",
    "description": "arclm.load_tokens from arclm import load_tokens Laadt tokens uit de ingestelde dataset en optioneel uit domeindata.",
    "page": "api/root.html",
    "section": "load-tokens"
  },
  {
    "type": "api",
    "title": "load_training_checkpoint",
    "description": "arclm.load_training_checkpoint from arclm import load_training_checkpoint Load a trusted ArcLM/PyTorch training checkpoint.",
    "page": "api/root.html",
    "section": "load-training-checkpoint"
  },
  {
    "type": "api",
    "title": "model_check",
    "description": "arclm.model_check from arclm import model_check Controleert of kennis altijd de query waar maakt.",
    "page": "api/root.html",
    "section": "model-check"
  },
  {
    "type": "api",
    "title": "model_support_matrix",
    "description": "arclm.model_support_matrix from arclm import model_support_matrix Return the compact support matrix for the official 0.8 model set.",
    "page": "api/root.html",
    "section": "model-support-matrix"
  },
  {
    "type": "api",
    "title": "predict",
    "description": "arclm.predict from arclm import predict Predict with a cached model using the same defaults as load_model().",
    "page": "api/root.html",
    "section": "predict"
  },
  {
    "type": "api",
    "title": "predict_external",
    "description": "arclm.predict_external from arclm import predict_external Load a source and return a single prediction.",
    "page": "api/root.html",
    "section": "predict-external"
  },
  {
    "type": "api",
    "title": "predict_top_k",
    "description": "arclm.predict_top_k from arclm import predict_top_k Return the top-k next-token probabilities for a prompt.",
    "page": "api/root.html",
    "section": "predict-top-k"
  },
  {
    "type": "api",
    "title": "prepare_data",
    "description": "arclm.prepare_data from arclm import prepare_data Maakt tokens, splits, tokenizer en DataLoaders klaar voor training.",
    "page": "api/root.html",
    "section": "prepare-data"
  },
  {
    "type": "api",
    "title": "read_tokens",
    "description": "arclm.read_tokens from arclm import read_tokens Leest lowercase whitespace tokens uit een tekstbestand en bewaart newlines.",
    "page": "api/root.html",
    "section": "read-tokens"
  },
  {
    "type": "api",
    "title": "register_model_inspector",
    "description": "arclm.register_model_inspector from arclm import register_model_inspector Register a custom model-source inspector.",
    "page": "api/root.html",
    "section": "register-model-inspector"
  },
  {
    "type": "api",
    "title": "report_environment",
    "description": "arclm.report_environment from arclm import report_environment Return a short human-readable runtime report.",
    "page": "api/root.html",
    "section": "report-environment"
  },
  {
    "type": "api",
    "title": "run_long_context_evaluation",
    "description": "arclm.run_long_context_evaluation from arclm import run_long_context_evaluation Train and compare multiple block sizes by validation loss and concepts.",
    "page": "api/root.html",
    "section": "run-long-context-evaluation"
  },
  {
    "type": "api",
    "title": "run_simple_interface",
    "description": "arclm.run_simple_interface from arclm import run_simple_interface Run ArcLM's optional simple web interface.",
    "page": "api/root.html",
    "section": "run-simple-interface"
  },
  {
    "type": "api",
    "title": "save_loaded_model",
    "description": "arclm.save_loaded_model from arclm import save_loaded_model Save a loaded model according to :class:`ModelSaveConfig`.",
    "page": "api/root.html",
    "section": "save-loaded-model"
  },
  {
    "type": "api",
    "title": "save_training_checkpoint",
    "description": "arclm.save_training_checkpoint from arclm import save_training_checkpoint Slaat een trainer checkpoint op met tokenizer metadata.",
    "page": "api/root.html",
    "section": "save-training-checkpoint"
  },
  {
    "type": "api",
    "title": "score_concept_relationships",
    "description": "arclm.score_concept_relationships from arclm import score_concept_relationships Score expected concepts against top-k next-token predictions.",
    "page": "api/root.html",
    "section": "score-concept-relationships"
  },
  {
    "type": "api",
    "title": "split_train_val",
    "description": "arclm.split_train_val from arclm import split_train_val Splitst tokens in train en validatie data.",
    "page": "api/root.html",
    "section": "split-train-val"
  },
  {
    "type": "api",
    "title": "tokenizer_from_checkpoint",
    "description": "arclm.tokenizer_from_checkpoint from arclm import tokenizer_from_checkpoint Haalt een ArcLM tokenizer uit een checkpoint of checkpoint-pad.",
    "page": "api/root.html",
    "section": "tokenizer-from-checkpoint"
  },
  {
    "type": "api",
    "title": "train_model",
    "description": "arclm.train_model from arclm import train_model Traint een ArcLM model in pretrain, finetune of continue_training mode.",
    "page": "api/root.html",
    "section": "train-model"
  },
  {
    "type": "api",
    "title": "train_native_model",
    "description": "arclm.train_native_model from arclm import train_native_model Train a native ArcLM model by delegating to ``train_model(mode='pretrain')``.",
    "page": "api/root.html",
    "section": "train-native-model"
  },
  {
    "type": "api",
    "title": "train_sft",
    "description": "arclm.train_sft from arclm import train_sft Run supervised fine-tuning through an ArcLM backend.",
    "page": "api/root.html",
    "section": "train-sft"
  },
  {
    "type": "api",
    "title": "validate_records",
    "description": "arclm.validate_records from arclm import validate_records Validate mapping records with a small schema.",
    "page": "api/root.html",
    "section": "validate-records"
  },
  {
    "type": "api",
    "title": "validate_sft_records",
    "description": "arclm.validate_sft_records from arclm import validate_sft_records Validate SFT records through the canonical fine-tuning normalizer.",
    "page": "api/root.html",
    "section": "validate-sft-records"
  },
  {
    "type": "api",
    "title": "validate_tokenizer_compatibility",
    "description": "arclm.validate_tokenizer_compatibility from arclm import validate_tokenizer_compatibility Raise if a tokenizer cannot safely address the checkpoint vocabulary.",
    "page": "api/root.html",
    "section": "validate-tokenizer-compatibility"
  },
  {
    "type": "api",
    "title": "EncryptedEnvelope",
    "description": "arclm.security.EncryptedEnvelope from arclm.security import EncryptedEnvelope JSON-safe authenticated encryption envelope.",
    "page": "api/security.html",
    "section": "encryptedenvelope"
  },
  {
    "type": "api",
    "title": "InMemorySecurityAuditLog",
    "description": "arclm.security.InMemorySecurityAuditLog from arclm.security import InMemorySecurityAuditLog Small local audit sink for tests and local applications.",
    "page": "api/security.html",
    "section": "inmemorysecurityauditlog"
  },
  {
    "type": "api",
    "title": "LegacyArtifactPolicy",
    "description": "arclm.security.LegacyArtifactPolicy from arclm.security import LegacyArtifactPolicy Compatibility policy for existing plaintext artifacts.",
    "page": "api/security.html",
    "section": "legacyartifactpolicy"
  },
  {
    "type": "api",
    "title": "PasswordKDFConfig",
    "description": "arclm.security.PasswordKDFConfig from arclm.security import PasswordKDFConfig Bounded Argon2id configuration.",
    "page": "api/security.html",
    "section": "passwordkdfconfig"
  },
  {
    "type": "api",
    "title": "SecurityAuditEvent",
    "description": "arclm.security.SecurityAuditEvent from arclm.security import SecurityAuditEvent SecurityAuditEvent(event_type: 'str', timestamp: 'float', event_id: 'str' = <factory>, actor: 'str | None' = None, artifact_type: 'str | None' = None, result: 'str' = 'ok', metadata: 'dict[str, Any]' = <factory>)",
    "page": "api/security.html",
    "section": "securityauditevent"
  },
  {
    "type": "api",
    "title": "SecurityCapabilities",
    "description": "arclm.security.SecurityCapabilities from arclm.security import SecurityCapabilities Safe security capability report.",
    "page": "api/security.html",
    "section": "securitycapabilities"
  },
  {
    "type": "api",
    "title": "SecurityCapabilityStatus",
    "description": "arclm.security.SecurityCapabilityStatus from arclm.security import SecurityCapabilityStatus Security capability status.",
    "page": "api/security.html",
    "section": "securitycapabilitystatus"
  },
  {
    "type": "api",
    "title": "SecurityInventoryItem",
    "description": "arclm.security.SecurityInventoryItem from arclm.security import SecurityInventoryItem SecurityInventoryItem(asset: 'str', location: 'str', sensitivity: 'str', current_protection: 'str', threats: 'tuple[str, ...]', required_protection: 'str', owner_subsystem: 'str', migration_requirement: 'str')",
    "page": "api/security.html",
    "section": "securityinventoryitem"
  },
  {
    "type": "api",
    "title": "SecurityMode",
    "description": "arclm.security.SecurityMode from arclm.security import SecurityMode ArcLM security operating mode.",
    "page": "api/security.html",
    "section": "securitymode"
  },
  {
    "type": "api",
    "title": "SecurityPolicy",
    "description": "arclm.security.SecurityPolicy from arclm.security import SecurityPolicy Framework-wide security policy.",
    "page": "api/security.html",
    "section": "securitypolicy"
  },
  {
    "type": "api",
    "title": "ThreatModelItem",
    "description": "arclm.security.ThreatModelItem from arclm.security import ThreatModelItem ThreatModelItem(threat: 'str', affected_assets: 'tuple[str, ...]', entry_point: 'str', likelihood: 'str', impact: 'str', mitigation: 'str', remaining_risk: 'str', required_tests: 'tuple[str, ...]')",
    "page": "api/security.html",
    "section": "threatmodelitem"
  },
  {
    "type": "api",
    "title": "DecryptionError",
    "description": "arclm.security.DecryptionError from arclm.security import DecryptionError Raised when decryption or authentication fails.",
    "page": "api/security.html",
    "section": "decryptionerror"
  },
  {
    "type": "api",
    "title": "EncryptionError",
    "description": "arclm.security.EncryptionError from arclm.security import EncryptionError Raised when encryption cannot complete safely.",
    "page": "api/security.html",
    "section": "encryptionerror"
  },
  {
    "type": "api",
    "title": "KeyManagementError",
    "description": "arclm.security.KeyManagementError from arclm.security import KeyManagementError Raised by key providers and key lifecycle checks.",
    "page": "api/security.html",
    "section": "keymanagementerror"
  },
  {
    "type": "api",
    "title": "ManifestError",
    "description": "arclm.security.ManifestError from arclm.security import ManifestError Raised for invalid or unsafe security manifests.",
    "page": "api/security.html",
    "section": "manifesterror"
  },
  {
    "type": "api",
    "title": "SecureLoadError",
    "description": "arclm.security.SecureLoadError from arclm.security import SecureLoadError Raised when secure loading policy blocks an artifact.",
    "page": "api/security.html",
    "section": "secureloaderror"
  },
  {
    "type": "api",
    "title": "SecurityDependencyError",
    "description": "arclm.security.SecurityDependencyError from arclm.security import SecurityDependencyError Raised when a required security dependency is unavailable.",
    "page": "api/security.html",
    "section": "securitydependencyerror"
  },
  {
    "type": "api",
    "title": "SecurityError",
    "description": "arclm.security.SecurityError from arclm.security import SecurityError Base error for ArcLM Security Core.",
    "page": "api/security.html",
    "section": "securityerror"
  },
  {
    "type": "api",
    "title": "SecurityPolicyError",
    "description": "arclm.security.SecurityPolicyError from arclm.security import SecurityPolicyError Raised when security policy denies an operation.",
    "page": "api/security.html",
    "section": "securitypolicyerror"
  },
  {
    "type": "api",
    "title": "SignatureError",
    "description": "arclm.security.SignatureError from arclm.security import SignatureError Raised when manifest signing or verification fails.",
    "page": "api/security.html",
    "section": "signatureerror"
  },
  {
    "type": "api",
    "title": "decrypt_bytes",
    "description": "arclm.security.decrypt_bytes from arclm.security import decrypt_bytes Decrypt an AEAD envelope or raise without returning partial plaintext.",
    "page": "api/security.html",
    "section": "decrypt-bytes"
  },
  {
    "type": "api",
    "title": "decrypt_json",
    "description": "arclm.security.decrypt_json from arclm.security import decrypt_json Decrypt JSON-safe data.",
    "page": "api/security.html",
    "section": "decrypt-json"
  },
  {
    "type": "api",
    "title": "derive_key_argon2id",
    "description": "arclm.security.derive_key_argon2id from arclm.security import derive_key_argon2id Derive a key-encryption key from a password using Argon2id.",
    "page": "api/security.html",
    "section": "derive-key-argon2id"
  },
  {
    "type": "api",
    "title": "derive_subkey_hkdf",
    "description": "arclm.security.derive_subkey_hkdf from arclm.security import derive_subkey_hkdf Derive a purpose-bound subkey from high-entropy key material.",
    "page": "api/security.html",
    "section": "derive-subkey-hkdf"
  },
  {
    "type": "api",
    "title": "encrypt_bytes",
    "description": "arclm.security.encrypt_bytes from arclm.security import encrypt_bytes Encrypt bytes with AEAD and return a versioned envelope.",
    "page": "api/security.html",
    "section": "encrypt-bytes"
  },
  {
    "type": "api",
    "title": "encrypt_json",
    "description": "arclm.security.encrypt_json from arclm.security import encrypt_json Encrypt JSON-safe data.",
    "page": "api/security.html",
    "section": "encrypt-json"
  },
  {
    "type": "api",
    "title": "generate_signing_keypair",
    "description": "arclm.security.generate_signing_keypair from arclm.security import generate_signing_keypair Generate a local Ed25519 signing key pair.",
    "page": "api/security.html",
    "section": "generate-signing-keypair"
  },
  {
    "type": "api",
    "title": "get_security_capabilities",
    "description": "arclm.security.get_security_capabilities from arclm.security import get_security_capabilities Return Security Core capability status without leaking local paths.",
    "page": "api/security.html",
    "section": "get-security-capabilities"
  },
  {
    "type": "api",
    "title": "hash_bytes",
    "description": "arclm.security.hash_bytes from arclm.security import hash_bytes Hash bytes with an allowlisted algorithm.",
    "page": "api/security.html",
    "section": "hash-bytes"
  },
  {
    "type": "api",
    "title": "hash_file",
    "description": "arclm.security.hash_file from arclm.security import hash_file Hash a file without loading it all into memory.",
    "page": "api/security.html",
    "section": "hash-file"
  },
  {
    "type": "api",
    "title": "redact_mapping",
    "description": "arclm.security.redact_mapping from arclm.security import redact_mapping Recursively redact sensitive mapping values.",
    "page": "api/security.html",
    "section": "redact-mapping"
  },
  {
    "type": "api",
    "title": "redact_sensitive_text",
    "description": "arclm.security.redact_sensitive_text from arclm.security import redact_sensitive_text Redact common secret patterns from text.",
    "page": "api/security.html",
    "section": "redact-sensitive-text"
  },
  {
    "type": "api",
    "title": "security_inventory",
    "description": "arclm.security.security_inventory from arclm.security import security_inventory Public function exported by arclm.security.",
    "page": "api/security.html",
    "section": "security-inventory"
  },
  {
    "type": "api",
    "title": "security_status",
    "description": "arclm.security.security_status from arclm.security import security_status Return a safe security status report without paths or secrets.",
    "page": "api/security.html",
    "section": "security-status"
  },
  {
    "type": "api",
    "title": "sign_manifest",
    "description": "arclm.security.sign_manifest from arclm.security import sign_manifest Return a signed manifest copy.",
    "page": "api/security.html",
    "section": "sign-manifest"
  },
  {
    "type": "api",
    "title": "threat_model",
    "description": "arclm.security.threat_model from arclm.security import threat_model Public function exported by arclm.security.",
    "page": "api/security.html",
    "section": "threat-model"
  },
  {
    "type": "api",
    "title": "verify_file_hash",
    "description": "arclm.security.verify_file_hash from arclm.security import verify_file_hash Verify a trusted expected file hash.",
    "page": "api/security.html",
    "section": "verify-file-hash"
  },
  {
    "type": "api",
    "title": "verify_manifest",
    "description": "arclm.security.verify_manifest from arclm.security import verify_manifest Verify a signed manifest.",
    "page": "api/security.html",
    "section": "verify-manifest"
  },
  {
    "type": "api",
    "title": "verify_manifest_signature",
    "description": "arclm.security.verify_manifest_signature from arclm.security import verify_manifest_signature Verify a signed manifest.",
    "page": "api/security.html",
    "section": "verify-manifest-signature"
  },
  {
    "type": "api",
    "title": "SentencePieceTokenizer",
    "description": "arclm.tokenizers.SentencePieceTokenizer from arclm.tokenizers import SentencePieceTokenizer SentencePiece tokenizer voor subword taalmodeltraining.",
    "page": "api/tokenizers.html",
    "section": "sentencepiecetokenizer"
  },
  {
    "type": "api",
    "title": "Tokenizer",
    "description": "arclm.tokenizers.Tokenizer from arclm.tokenizers import Tokenizer Zet tekst om naar woord-tokens en token ids.",
    "page": "api/tokenizers.html",
    "section": "tokenizer"
  },
  {
    "type": "api",
    "title": "TokenizerFactory",
    "description": "arclm.tokenizers.TokenizerFactory from arclm.tokenizers import TokenizerFactory Kiest en maakt tokenizer classes op basis van een korte naam.",
    "page": "api/tokenizers.html",
    "section": "tokenizerfactory"
  },
  {
    "type": "api",
    "title": "create_tokenizer",
    "description": "arclm.tokenizers.create_tokenizer from arclm.tokenizers import create_tokenizer Maakt een tokenizer met een korte type-naam.",
    "page": "api/tokenizers.html",
    "section": "create-tokenizer"
  },
  {
    "type": "api",
    "title": "get_tokenizer_from_config",
    "description": "arclm.tokenizers.get_tokenizer_from_config from arclm.tokenizers import get_tokenizer_from_config Maakt een tokenizer vanuit een config object.",
    "page": "api/tokenizers.html",
    "section": "get-tokenizer-from-config"
  },
  {
    "type": "api",
    "title": "BaseCallback",
    "description": "arclm.training.BaseCallback from arclm.training import BaseCallback Basis class voor eigen training callbacks.",
    "page": "api/training.html",
    "section": "basecallback"
  },
  {
    "type": "api",
    "title": "BaseModelAdapter",
    "description": "arclm.training.BaseModelAdapter from arclm.training import BaseModelAdapter Basis class voor adapters tussen twee model implementaties.",
    "page": "api/training.html",
    "section": "basemodeladapter"
  },
  {
    "type": "api",
    "title": "BaseModelLoader",
    "description": "arclm.training.BaseModelLoader from arclm.training import BaseModelLoader Basis class voor model loaders die een model en metadata geven.",
    "page": "api/training.html",
    "section": "basemodelloader"
  },
  {
    "type": "api",
    "title": "BaseTrainer",
    "description": "arclm.training.BaseTrainer from arclm.training import BaseTrainer Basis class voor developers die een eigen trainer willen maken.",
    "page": "api/training.html",
    "section": "basetrainer"
  },
  {
    "type": "api",
    "title": "BaseTrainingPipeline",
    "description": "arclm.training.BaseTrainingPipeline from arclm.training import BaseTrainingPipeline Basis class voor aanpasbare training pipelines.",
    "page": "api/training.html",
    "section": "basetrainingpipeline"
  },
  {
    "type": "api",
    "title": "EarlyStopping",
    "description": "arclm.training.EarlyStopping from arclm.training import EarlyStopping Early stopping to prevent overfitting",
    "page": "api/training.html",
    "section": "earlystopping"
  },
  {
    "type": "api",
    "title": "GeneralizationMonitor",
    "description": "arclm.training.GeneralizationMonitor from arclm.training import GeneralizationMonitor Monitor model generalization during training Traceert training vs validation loss om overfitting te detecteren",
    "page": "api/training.html",
    "section": "generalizationmonitor"
  },
  {
    "type": "api",
    "title": "L1Regularization",
    "description": "arclm.training.L1Regularization from arclm.training import L1Regularization L1 Regularization - Sparsity inducing",
    "page": "api/training.html",
    "section": "l1regularization"
  },
  {
    "type": "api",
    "title": "L2Regularization",
    "description": "arclm.training.L2Regularization from arclm.training import L2Regularization L2 Regularization (Weight Decay) - Smoothness inducing",
    "page": "api/training.html",
    "section": "l2regularization"
  },
  {
    "type": "api",
    "title": "LabelSmoothing",
    "description": "arclm.training.LabelSmoothing from arclm.training import LabelSmoothing Label smoothing regularization Voorkomt overconfident voorspellingen door targets glad te maken",
    "page": "api/training.html",
    "section": "labelsmoothing"
  },
  {
    "type": "api",
    "title": "LearningRateScheduler",
    "description": "arclm.training.LearningRateScheduler from arclm.training import LearningRateScheduler Learning rate scheduler for better generalization Reduce learning rate during training for better convergence",
    "page": "api/training.html",
    "section": "learningratescheduler"
  },
  {
    "type": "api",
    "title": "MixupAugmentation",
    "description": "arclm.training.MixupAugmentation from arclm.training import MixupAugmentation Mixup data augmentation for better generalization Combineert twee samples lineair om data augmentation te krijgen",
    "page": "api/training.html",
    "section": "mixupaugmentation"
  },
  {
    "type": "api",
    "title": "ModelAdapter",
    "description": "arclm.training.ModelAdapter from arclm.training import ModelAdapter Adapt weights from external models to ArcLM architecture.",
    "page": "api/training.html",
    "section": "modeladapter"
  },
  {
    "type": "api",
    "title": "PreTrainedModelLoader",
    "description": "arclm.training.PreTrainedModelLoader from arclm.training import PreTrainedModelLoader Load pre-trained models from multiple sources: - HuggingFace transformers - Local checkpoint files - Custom model paths Handles weight alignment and architecture mismatch gracefully.",
    "page": "api/training.html",
    "section": "pretrainedmodelloader"
  },
  {
    "type": "api",
    "title": "StoppingCriteria",
    "description": "arclm.training.StoppingCriteria from arclm.training import StoppingCriteria Base stopping criteria for training loop control.",
    "page": "api/training.html",
    "section": "stoppingcriteria"
  },
  {
    "type": "api",
    "title": "Trainer",
    "description": "arclm.training.Trainer from arclm.training import Trainer Traint een model op \u00e9\u00e9n apparaat.",
    "page": "api/training.html",
    "section": "trainer"
  },
  {
    "type": "api",
    "title": "TrainingConfig",
    "description": "arclm.training.TrainingConfig from arclm.training import TrainingConfig Bewaart de belangrijkste instellingen voor een training.",
    "page": "api/training.html",
    "section": "trainingconfig"
  },
  {
    "type": "api",
    "title": "TrainingResult",
    "description": "arclm.training.TrainingResult from arclm.training import TrainingResult Resultaat dat `train_model` teruggeeft na een trainingsrun.",
    "page": "api/training.html",
    "section": "trainingresult"
  },
  {
    "type": "api",
    "title": "TrainingState",
    "description": "arclm.training.TrainingState from arclm.training import TrainingState Houdt bij waar de training is.",
    "page": "api/training.html",
    "section": "trainingstate"
  },
  {
    "type": "api",
    "title": "UnifiedPipeline",
    "description": "arclm.training.UnifiedPipeline from arclm.training import UnifiedPipeline Unified training pipeline supporting multiple modes: - PRE_TRAINING: Train from scratch on large corpus - FINE_TUNING: Fine-tune pre-trained model on task data - INSTRUCTION_TUNING: Fine-tune on instruction-response pair",
    "page": "api/training.html",
    "section": "unifiedpipeline"
  },
  {
    "type": "api",
    "title": "build_model",
    "description": "arclm.training.build_model from arclm.training import build_model Maakt een ArcLM model vanuit config en zet het op het gekozen device.",
    "page": "api/training.html",
    "section": "build-model"
  },
  {
    "type": "api",
    "title": "build_optimizer_with_discriminative_lr",
    "description": "arclm.training.build_optimizer_with_discriminative_lr from arclm.training import build_optimizer_with_discriminative_lr Maakt een optimizer met aparte learning rates per laag-groep.",
    "page": "api/training.html",
    "section": "build-optimizer-with-discriminative-lr"
  },
  {
    "type": "api",
    "title": "build_trainer",
    "description": "arclm.training.build_trainer from arclm.training import build_trainer Maakt de optimizer, loss function en Trainer voor een model.",
    "page": "api/training.html",
    "section": "build-trainer"
  },
  {
    "type": "api",
    "title": "checkpoint_is_compatible_for_continue_training",
    "description": "arclm.training.checkpoint_is_compatible_for_continue_training from arclm.training import checkpoint_is_compatible_for_continue_training Controleert of een checkpoint past bij continued training.",
    "page": "api/training.html",
    "section": "checkpoint-is-compatible-for-continue-training"
  },
  {
    "type": "api",
    "title": "checkpoint_is_compatible_for_tuining",
    "description": "arclm.training.checkpoint_is_compatible_for_tuining from arclm.training import checkpoint_is_compatible_for_tuining Controleert of een checkpoint past bij finetuning.",
    "page": "api/training.html",
    "section": "checkpoint-is-compatible-for-tuining"
  },
  {
    "type": "api",
    "title": "create_checkpoint_callback",
    "description": "arclm.training.create_checkpoint_callback from arclm.training import create_checkpoint_callback Maakt een callback die het laatste hervatbare checkpoint opslaat.",
    "page": "api/training.html",
    "section": "create-checkpoint-callback"
  },
  {
    "type": "api",
    "title": "create_epoch_checkpoint_callback",
    "description": "arclm.training.create_epoch_checkpoint_callback from arclm.training import create_epoch_checkpoint_callback Oude alias voor `create_checkpoint_callback`.",
    "page": "api/training.html",
    "section": "create-epoch-checkpoint-callback"
  },
  {
    "type": "api",
    "title": "load_compatible_checkpoint",
    "description": "arclm.training.load_compatible_checkpoint from arclm.training import load_compatible_checkpoint Laadt een bestaand checkpoint als het past bij deze training.",
    "page": "api/training.html",
    "section": "load-compatible-checkpoint"
  },
  {
    "type": "api",
    "title": "save_training_checkpoint",
    "description": "arclm.training.save_training_checkpoint from arclm.training import save_training_checkpoint Slaat een trainer checkpoint op met tokenizer metadata.",
    "page": "api/training.html",
    "section": "save-training-checkpoint"
  },
  {
    "type": "api",
    "title": "tokenizer_from_checkpoint",
    "description": "arclm.training.tokenizer_from_checkpoint from arclm.training import tokenizer_from_checkpoint Haalt een ArcLM tokenizer uit een checkpoint of checkpoint-pad.",
    "page": "api/training.html",
    "section": "tokenizer-from-checkpoint"
  },
  {
    "type": "api",
    "title": "train_model",
    "description": "arclm.training.train_model from arclm.training import train_model Traint een ArcLM model in pretrain, finetune of continue_training mode.",
    "page": "api/training.html",
    "section": "train-model"
  },
  {
    "type": "api",
    "title": "DatasetRoot",
    "description": "arclm.web.DatasetRoot from arclm.web import DatasetRoot Een server-side datasetmap die de browser mag laten inspecteren.",
    "page": "api/web.html",
    "section": "datasetroot"
  },
  {
    "type": "api",
    "title": "WebConfig",
    "description": "arclm.web.WebConfig from arclm.web import WebConfig Instellingen voor de lokale Web API.",
    "page": "api/web.html",
    "section": "webconfig"
  },
  {
    "type": "api",
    "title": "create_app",
    "description": "arclm.web.create_app from arclm.web import create_app Maakt de lokale ArcLM Web API.",
    "page": "api/web.html",
    "section": "create-app"
  },
  {
    "type": "module",
    "title": "arclm",
    "description": "Root lazy public API for common ArcLM names. Accuracy AdaptedModelBundle And ArcLM AutoModel AutoTokenizer BaseAugmenter BaseCallback BaseCleaner BaseDataStep BaseDataset BaseDeduplicator BaseEvaluationCallback BaseEvaluator BaseFineTuner BaseMetric BaseModelAdapter BaseModelLoader BaseStreamingDataset BaseSyntheticDataGenerator BaseTrainer BaseTrainingPipeline Biconditional ConceptBenchmarkCase ConceptBenchmarkResult Config DEFAULT_CONCEPT_BENCHMARKS DEFAULT_MODEL_PATH DataBundle DataPipeline DataProcessor DatasetConfig DatasetLoader DatasetManifest DatasetReport DatasetValidationIssue DatasetValidationResult DeduplicationResult EarlyStopping EntailmentResult EvaluationConfig EvaluationReport EvaluationResult Evaluator ExactDeduplicator ExternalLoadedModel ExternalModelConfig FullFineTuner GeneralizationMonitor GenerationConfig Generator Implication InstructionDataset KnowledgeBase L1Regularization L2Regularization LabelSmoothing LearningRateScheduler LoadPlan LoadedCheckpoint LoadedModel LongContextResult LossMetric MetricsReport MiniGPT MixupAugmentation ModelAdapter ModelCapabilityReport ModelInspector ModelSaveConfig ModelSourceInfo Not Or Perplexity PipelineTrace PreTrainedModelLoader ProcessedDataset RemoveDuplicates SFTConfig SFTDataCollator SFTRecordContract SFTTrainer SFTTrainingResult Sentence SentencePieceTokenizer SmartLoader StoppingCriteria StreamingDataset Symbol TextDataset TextGenerator Tokenizer TokenizerAdapter TokenizerFactory TopKPrediction Trainer TrainingConfig TrainingResult TrainingState UnifiedPipeline __version__ adapt_for_training build_dataset_report build_evaluation_report build_model build_trainer build_training_diagnostics_report calculate_metrics calculate_perplexity checkpoint_is_compatible_for_continue_training checkpoint_is_compatible_for_tuining continue_native_training create_checkpoint_callback create_config create_dataloader create_dataset_manifest create_epoch_checkpoint_callback create_instruction_dataloader create_simple_interface_app create_symbols create_tokenizer deduplicate evaluate export_metrics_to_json export_metrics_to_markdown fine_tune_external_model fine_tune_native_model format_concept_benchmark_report format_duration format_long_context_results format_tokenizer_coverage_report format_top_k_predictions get_api_version get_device get_model_capability get_sft_record_contract get_tokenizer_from_config get_version inspect_model_source inspect_text list_available_models load_any_model load_compatible_checkpoint load_dataset load_external_for_inference load_external_model load_model load_tokens load_training_checkpoint model_check model_support_matrix predict predict_external predict_top_k prepare_data read_tokens register_model_inspector report_environment run_long_context_evaluation run_simple_interface save_loaded_model save_training_checkpoint score_concept_relationships split_train_val tokenizer_from_checkpoint train_model train_native_model train_sft validate_records validate_sft_records validate_tokenizer_compatibility",
    "page": "reference/modules.html",
    "section": "module-list"
  },
  {
    "type": "module",
    "title": "arclm.datasets",
    "description": "Dataset loading, validation, reporting, cleaning and streaming helpers. BaseAugmenter BaseCleaner BaseDataStep BaseDataset BaseDeduplicator BaseStreamingDataset BaseSyntheticDataGenerator DataAugmenter DataBundle DataCleaner DataPipeline DataProcessor DatasetConfig DatasetLoader DatasetManifest DatasetReport DatasetValidationIssue DatasetValidationResult DeduplicationResult Deduplicator ExactDeduplicator InstructionDataset ProcessedDataset RemoveDuplicates StreamingDataset TextDataset build_dataset_report create_dataloader create_dataset_manifest create_instruction_dataloader deduplicate load_dataset load_tokenizer_from_checkpoint load_tokens prepare_data read_tokens split_train_val validate_records",
    "page": "reference/modules.html",
    "section": "module-list"
  },
  {
    "type": "module",
    "title": "arclm.tokenizers",
    "description": "Native word and SentencePiece tokenizer public API. SentencePieceTokenizer Tokenizer TokenizerFactory create_tokenizer get_tokenizer_from_config",
    "page": "reference/modules.html",
    "section": "module-list"
  },
  {
    "type": "module",
    "title": "arclm.models",
    "description": "Native ArcLM model and model capability reporting. ArcLM AutoModel GPTBlock MiniGPT ModelCapabilityReport SelfAttention get_model_capability model_support_matrix",
    "page": "reference/modules.html",
    "section": "module-list"
  },
  {
    "type": "module",
    "title": "arclm.training",
    "description": "Native training configuration, trainer, callbacks and compatibility helpers. BaseCallback BaseModelAdapter BaseModelLoader BaseTrainer BaseTrainingPipeline EarlyStopping GeneralizationMonitor L1Regularization L2Regularization LabelSmoothing LearningRateScheduler MixupAugmentation ModelAdapter PreTrainedModelLoader StoppingCriteria Trainer TrainingConfig TrainingResult TrainingState UnifiedPipeline build_model build_optimizer_with_discriminative_lr build_trainer checkpoint_is_compatible_for_continue_training checkpoint_is_compatible_for_tuining create_checkpoint_callback create_epoch_checkpoint_callback load_compatible_checkpoint save_training_checkpoint tokenizer_from_checkpoint train_model",
    "page": "reference/modules.html",
    "section": "module-list"
  },
  {
    "type": "module",
    "title": "arclm.finetuning",
    "description": "Supervised fine-tuning formatting, validation, labels and trainer helpers. BaseFineTuner BaseModelAdapter BaseTokenizerAdapter FineTuningConfig FineTuningDatasetReport FineTuningMode FineTuningResult FullFineTuner ModelAdapter PreparedFineTuningDataset PreparedFineTuningRecord SFTConfig SFTDataCollator SFTRecordContract SFTTrainer SFTTrainingResult TokenizerAdapter create_labels fine_tune fine_tuning_format_fingerprint format_chat_example format_example format_instruction_example format_prompt_response_example format_text_example get_sft_record_contract mask_labels normalize_fine_tuning_example pack_sequences prepare_fine_tuning_dataset prepare_fine_tuning_record train_sft validate_sft_records",
    "page": "reference/modules.html",
    "section": "module-list"
  },
  {
    "type": "module",
    "title": "arclm.checkpoints",
    "description": "Checkpoint loading, inspection, adaptation and compatibility helpers. AdaptedModelBundle CHECKPOINT_FORMAT CHECKPOINT_VERSION CheckpointInfo CheckpointLoader LoadPlan LoadedCheckpoint LoaderRegistry ModelInspector SmartLoader adapt_for_training create_default_registry inspect_checkpoint inspect_model_source load_external_model register_model_inspector validate_checkpoint validate_tokenizer_compatibility",
    "page": "reference/modules.html",
    "section": "module-list"
  },
  {
    "type": "module",
    "title": "arclm.evaluation",
    "description": "Metrics, evaluation reports, diagnostics and small benchmark helpers. Accuracy BaseEvaluationCallback BaseEvaluator BaseMetric ConceptBenchmarkCase ConceptBenchmarkResult DEFAULT_CONCEPT_BENCHMARKS EvaluationConfig EvaluationReport EvaluationResult Evaluator LongContextResult LossMetric MetricsReport Perplexity TopKPrediction build_evaluation_report build_training_diagnostics_report calculate_metrics calculate_perplexity evaluate export_metrics_to_json export_metrics_to_markdown format_concept_benchmark_report format_long_context_results format_tokenizer_coverage_report format_top_k_predictions predict_top_k run_long_context_evaluation score_concept_relationships",
    "page": "reference/modules.html",
    "section": "module-list"
  },
  {
    "type": "module",
    "title": "arclm.inference",
    "description": "Generation plus native/external model loading boundaries. CheckpointTokenizer DEFAULT_MODEL_PATH ExternalLoadedModel ExternalModelConfig GenerationConfig Generator LoadedModel ModelSaveConfig ModelSourceInfo TextGenerator continue_native_training fine_tune_external_model fine_tune_native_model inspect_model_source load_any_model load_external_for_inference load_model predict predict_external save_loaded_model train_native_model",
    "page": "reference/modules.html",
    "section": "module-list"
  },
  {
    "type": "module",
    "title": "arclm.inspection",
    "description": "Pipeline trace helpers for one native model step. PipelineTrace inspect_text",
    "page": "reference/modules.html",
    "section": "module-list"
  },
  {
    "type": "module",
    "title": "arclm.agents",
    "description": "Provider-independent Agent Runtime with tools, sessions, tracing and permissions. Agent AgentCapabilityReport AgentConfig AgentMessage AgentModel AgentResource AgentRunResult AgentRunner AgentRunnerConfig AgentRuntimeError AgentSession AgentTrace AgentTraceEvent ApprovalDecision ArcLMJSONToolAdapter AutoApprovalHandler CallableModelAdapter CapabilityStatus DenyApprovalHandler DocumentToolConfig FakeSpeechToTextBackend FinalResponse InMemoryResourceProvider JSONToolCallingAdapter ModelResponse OptionalAgentDependencyError ResourceProvider SessionConfig SideEffectLevel SpeechToTextBackend Tool ToolApprovalHandler ToolApprovalRequest ToolCall ToolCollection ToolContext ToolError ToolPermission ToolPolicy ToolRegistry ToolResult ToolSchemaError ToolSpec ToolValidationError TraceConfig TranscriptionRequest TranscriptionResult WebToolConfig get_agent_capabilities tool",
    "page": "reference/modules.html",
    "section": "module-list"
  },
  {
    "type": "module",
    "title": "arclm.security",
    "description": "Security Core policies, hashing, signatures, encryption envelopes and redaction. DecryptionError EncryptedEnvelope EncryptionError InMemorySecurityAuditLog KeyManagementError LegacyArtifactPolicy ManifestError PasswordKDFConfig SecureLoadError SecurityAuditEvent SecurityCapabilities SecurityCapabilityStatus SecurityDependencyError SecurityError SecurityInventoryItem SecurityMode SecurityPolicy SecurityPolicyError SignatureError ThreatModelItem decrypt_bytes decrypt_json derive_key_argon2id derive_subkey_hkdf encrypt_bytes encrypt_json generate_signing_keypair get_security_capabilities hash_bytes hash_file redact_mapping redact_sensitive_text security_inventory security_status sign_manifest threat_model verify_file_hash verify_manifest verify_manifest_signature",
    "page": "reference/modules.html",
    "section": "module-list"
  },
  {
    "type": "module",
    "title": "arclm.web",
    "description": "Local Web Studio backend app and settings. DatasetRoot WebConfig create_app",
    "page": "reference/modules.html",
    "section": "module-list"
  },
  {
    "type": "module",
    "title": "arclm.peft",
    "description": "Native and optional PEFT adapter utilities. ADAPTER_ARTIFACT_FORMAT ADAPTER_ARTIFACT_VERSION LoRAConfig LoRALinear PeftAdapterInfo PeftAdapterManifest PeftApplicationResult PeftConfig PeftMethod PeftParameterReport PeftTarget QLoRAConfig QuantizationBackend QuantizationCapabilityReport QuantizationConfig QuantizationType QuantizedComputeDType QuantizedModelReport apply_lora apply_peft create_quantized_load_config fingerprint_base_model get_lora_state_dict get_peft_parameter_report get_quantization_backend inspect_adapter_artifact inspect_lora_targets inspect_quantization_capabilities is_lora_model is_quantized_runtime_model load_adapter_artifact load_lora_state_dict load_quantized_model merge_lora merged_lora_model prepare_model_for_qlora save_adapter_artifact unmerge_lora validate_adapter_artifact validate_quantized_base_model",
    "page": "reference/modules.html",
    "section": "module-list"
  },
  {
    "type": "module",
    "title": "arclm.plugins",
    "description": "Plugin metadata and extension helpers. PluginMetadata PluginProtocol",
    "page": "reference/modules.html",
    "section": "module-list"
  },
  {
    "type": "module",
    "title": "arclm.registry",
    "description": "Registry helper surfaces. Registry",
    "page": "reference/modules.html",
    "section": "module-list"
  },
  {
    "type": "module",
    "title": "arclm.configs",
    "description": "Compatibility configuration exports. Config DatasetConfig InferenceConfig ModelConfig TokenizerConfig TrainingConfig create_config create_example_configs get_finetuning_config get_instruction_tuning_config load_config load_config_json load_config_yaml save_config save_config_json save_config_yaml",
    "page": "reference/modules.html",
    "section": "module-list"
  },
  {
    "type": "module",
    "title": "arclm.exceptions",
    "description": "Public exception compatibility namespace. ArcLMError CheckpointError CleaningError ConfigurationError DataCollatorError DatasetError DatasetLoadError DatasetValidationError DatasetVersionError DeduplicationError EvaluationConfigError EvaluationError FineTuningError FormattingError InferenceError MetricError ModelAdapterError ModelLoadError OptionalDependencyError PipelineError PrecisionError SFTConfigError StreamingError SyntheticDataError TokenizerAdapterError TokenizerError TrainingConfigError TrainingError",
    "page": "reference/modules.html",
    "section": "module-list"
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
    "title": "First ArcLM workflow",
    "description": "First ArcLM workflow",
    "page": "examples/index.html",
    "section": "example-cards"
  },
  {
    "type": "example",
    "title": "Inspect one native text pass",
    "description": "Inspect one native text pass",
    "page": "examples/index.html",
    "section": "example-cards"
  },
  {
    "type": "example",
    "title": "Load, validate, manifest, and report JSONL records",
    "description": "Load, validate, manifest, and report JSONL records",
    "page": "examples/index.html",
    "section": "example-cards"
  },
  {
    "type": "example",
    "title": "Turn a local HTML fixture into dataset records",
    "description": "Turn a local HTML fixture into dataset records",
    "page": "examples/index.html",
    "section": "example-cards"
  },
  {
    "type": "example",
    "title": "Build and inspect a word tokenizer",
    "description": "Build and inspect a word tokenizer",
    "page": "examples/index.html",
    "section": "example-cards"
  },
  {
    "type": "example",
    "title": "Train a tiny SentencePiece BPE tokenizer",
    "description": "Train a tiny SentencePiece BPE tokenizer",
    "page": "examples/index.html",
    "section": "example-cards"
  },
  {
    "type": "example",
    "title": "Create a tiny native ArcLM model",
    "description": "Create a tiny native ArcLM model",
    "page": "examples/index.html",
    "section": "example-cards"
  },
  {
    "type": "example",
    "title": "Save and reload a native model state dict",
    "description": "Save and reload a native model state dict",
    "page": "examples/index.html",
    "section": "example-cards"
  },
  {
    "type": "example",
    "title": "Run one CPU pretraining optimization step",
    "description": "Run one CPU pretraining optimization step",
    "page": "examples/index.html",
    "section": "example-cards"
  },
  {
    "type": "example",
    "title": "Preview validated SFT records",
    "description": "Preview validated SFT records",
    "page": "examples/index.html",
    "section": "example-cards"
  },
  {
    "type": "example",
    "title": "Run one tiny supervised fine-tuning step",
    "description": "Run one tiny supervised fine-tuning step",
    "page": "examples/index.html",
    "section": "example-cards"
  },
  {
    "type": "example",
    "title": "PEFT and QLoRA real adapter training boundary",
    "description": "PEFT and QLoRA real adapter training boundary",
    "page": "examples/index.html",
    "section": "example-cards"
  },
  {
    "type": "example",
    "title": "Save, load, and inspect a training checkpoint",
    "description": "Save, load, and inspect a training checkpoint",
    "page": "examples/index.html",
    "section": "example-cards"
  },
  {
    "type": "example",
    "title": "Compute perplexity, accuracy, and top-k predictions",
    "description": "Compute perplexity, accuracy, and top-k predictions",
    "page": "examples/index.html",
    "section": "example-cards"
  },
  {
    "type": "example",
    "title": "Generate with greedy and sampled decoding",
    "description": "Generate with greedy and sampled decoding",
    "page": "examples/index.html",
    "section": "example-cards"
  },
  {
    "type": "example",
    "title": "Inspect external local-model loading policy",
    "description": "Inspect external local-model loading policy",
    "page": "examples/index.html",
    "section": "example-cards"
  },
  {
    "type": "example",
    "title": "Load a real external local Hugging Face model",
    "description": "Load a real external local Hugging Face model",
    "page": "examples/index.html",
    "section": "example-cards"
  },
  {
    "type": "example",
    "title": "Compose validation, deduplication, tokenization, and reporting",
    "description": "Compose validation, deduplication, tokenization, and reporting",
    "page": "examples/index.html",
    "section": "example-cards"
  },
  {
    "type": "example",
    "title": "Inspect tensors and generated text from a native pass",
    "description": "Inspect tensors and generated text from a native pass",
    "page": "examples/index.html",
    "section": "example-cards"
  },
  {
    "type": "example",
    "title": "Run a deterministic custom-tool agent",
    "description": "Run a deterministic custom-tool agent",
    "page": "examples/index.html",
    "section": "example-cards"
  },
  {
    "type": "example",
    "title": "Run a secure local document agent",
    "description": "Run a secure local document agent",
    "page": "examples/index.html",
    "section": "example-cards"
  },
  {
    "type": "example",
    "title": "Transcribe a voice note with the fake STT backend",
    "description": "Transcribe a voice note with the fake STT backend",
    "page": "examples/index.html",
    "section": "example-cards"
  },
  {
    "type": "example",
    "title": "Transcribe with a real Whisper backend",
    "description": "Transcribe with a real Whisper backend",
    "page": "examples/index.html",
    "section": "example-cards"
  },
  {
    "type": "example",
    "title": "Inspect ArcLM Security Core status",
    "description": "Inspect ArcLM Security Core status",
    "page": "examples/index.html",
    "section": "example-cards"
  },
  {
    "type": "example",
    "title": "Encrypt, hash, sign, verify, and redact local data",
    "description": "Encrypt, hash, sign, verify, and redact local data",
    "page": "examples/index.html",
    "section": "example-cards"
  },
  {
    "type": "example",
    "title": "Local language model mini project",
    "description": "Local language model mini project",
    "page": "examples/index.html",
    "section": "example-cards"
  },
  {
    "type": "example",
    "title": "Domain SFT assistant mini project",
    "description": "Domain SFT assistant mini project",
    "page": "examples/index.html",
    "section": "example-cards"
  },
  {
    "type": "example",
    "title": "Website knowledge pipeline mini project",
    "description": "Website knowledge pipeline mini project",
    "page": "examples/index.html",
    "section": "example-cards"
  },
  {
    "type": "example",
    "title": "Local document agent mini project",
    "description": "Local document agent mini project",
    "page": "examples/index.html",
    "section": "example-cards"
  },
  {
    "type": "example",
    "title": "Model benchmark lab mini project",
    "description": "Model benchmark lab mini project",
    "page": "examples/index.html",
    "section": "example-cards"
  },
  {
    "type": "example",
    "title": "Secure local AI workspace mini project",
    "description": "Secure local AI workspace mini project",
    "page": "examples/index.html",
    "section": "example-cards"
  },
  {
    "type": "example project",
    "title": "Local language model mini project",
    "description": "Local language model mini project",
    "page": "examples/complete-projects.html",
    "section": "complete-projects"
  },
  {
    "type": "example project",
    "title": "Domain SFT assistant mini project",
    "description": "Domain SFT assistant mini project",
    "page": "examples/complete-projects.html",
    "section": "complete-projects"
  },
  {
    "type": "example project",
    "title": "Website knowledge pipeline mini project",
    "description": "Website knowledge pipeline mini project",
    "page": "examples/complete-projects.html",
    "section": "complete-projects"
  },
  {
    "type": "example project",
    "title": "Local document agent mini project",
    "description": "Local document agent mini project",
    "page": "examples/complete-projects.html",
    "section": "complete-projects"
  },
  {
    "type": "example project",
    "title": "Model benchmark lab mini project",
    "description": "Model benchmark lab mini project",
    "page": "examples/complete-projects.html",
    "section": "complete-projects"
  },
  {
    "type": "example project",
    "title": "Secure local AI workspace mini project",
    "description": "Secure local AI workspace mini project",
    "page": "examples/complete-projects.html",
    "section": "complete-projects"
  },
  {
    "type": "alias",
    "title": "SFT",
    "description": "Supervised Fine-Tuning guide and APIs",
    "page": "guides/fine-tuning.html",
    "section": "sft-contract"
  },
  {
    "type": "alias",
    "title": "checkpoint loading",
    "description": "Checkpoint load, inspect and validate workflows",
    "page": "guides/checkpoints.html",
    "section": "what-checkpoints-store"
  },
  {
    "type": "alias",
    "title": "tool_invalid_arguments",
    "description": "Agent tool argument validation errors",
    "page": "reference/errors.html",
    "section": "error-list"
  },
  {
    "type": "alias",
    "title": "response_only",
    "description": "Response-only SFT label masking",
    "page": "guides/fine-tuning.html",
    "section": "sft-contract"
  }
];
