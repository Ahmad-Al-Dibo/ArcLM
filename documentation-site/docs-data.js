window.ARCLM_DOCS = {
  version: "0.10.0",
  statuses: ["Stable", "Beta", "Experimental", "Deprecated", "Internal", "Unsupported"],
  features: [
    {
      id: "datasets",
      title: "Datasets and validation",
      status: "Stable",
      summary: "Load local records, validate required fields and build JSON-safe dataset reports.",
      explanation: "Dataset tools keep ArcLM workflows local and explicit. They accept in-memory records and common local text formats, then report missing fields, empty values, duplicate counts and token statistics without storing full data inside manifests.",
      importPath: "from arclm import validate_records, build_dataset_report",
      whenToUse: "Use this before training or SFT so bad records are found early.",
      returns: "Validation and report objects with to_dict(), to_json() and summary() helpers where applicable.",
      commonErrors: ["Missing required fields", "Non-string values for text fields", "Empty records", "Unsupported local file format"],
      limitations: ["No remote dataset registry", "No external dataset service integration", "Manifests do not contain full dataset contents"],
      usage: "from arclm import validate_records, build_dataset_report\nfrom arclm.tokenizers import Tokenizer\n\nrecords = [\n    {\"instruction\": \"Explain tokenization.\", \"response\": \"It converts text into tokens.\"}\n]\nvalidation = validate_records(records, required_fields=[\"instruction\", \"response\"])\nprint(validation.summary())\n\ntokenizer = Tokenizer(max_vocab=64)\ntokenizer.build(\" \".join(record[\"instruction\"] + \" \" + record[\"response\"] for record in records))\nreport = build_dataset_report(records, tokenizer=tokenizer, text_fields=[\"instruction\", \"response\"])\nprint(report.summary())"
    },
    {
      id: "tokenizers",
      title: "Native tokenizers",
      status: "Beta",
      summary: "Create word or SentencePiece tokenizers for local ArcLM experiments.",
      explanation: "Tokenizers convert text into token IDs used by the native model. The simple word tokenizer is deterministic and useful for tiny CPU examples. SentencePiece support is available when its package is installed.",
      importPath: "from arclm.tokenizers import Tokenizer, SentencePieceTokenizer",
      whenToUse: "Use the word tokenizer for small teaching examples and SentencePiece for subword experiments.",
      returns: "Tokenizer objects that encode text, decode IDs and expose vocabulary size.",
      commonErrors: ["Vocabulary too small for the dataset", "Tokenizer/model vocabulary mismatch", "Missing SentencePiece runtime for SentencePiece workflows"],
      limitations: ["Hugging Face tokenizer behavior belongs to optional external paths", "Very small tokenizers may produce unknown tokens"],
      usage: "from arclm.tokenizers import Tokenizer\n\ntokenizer = Tokenizer(max_vocab=32)\ntokenizer.build(\"ArcLM trains small native models locally\")\nids = tokenizer.encode_text(\"ArcLM locally\")\nprint(ids)\nprint(tokenizer.decode(ids))"
    },
    {
      id: "native-model",
      title: "Native ArcLM causal model",
      status: "Stable",
      summary: "Build a compact PyTorch causal language model for local learning workflows.",
      explanation: "The native model is a small GPT-style causal language model. It is designed for understandable CPU-friendly experiments, not production-scale serving.",
      importPath: "from arclm.models import ArcLM",
      whenToUse: "Use it when you want a fully local model you can train, checkpoint, reload, evaluate, generate from and inspect.",
      returns: "A PyTorch module that returns logits and optional loss when labels are provided.",
      commonErrors: ["Vocabulary size does not match tokenizer", "Embedding dimension must work with attention heads", "Input sequence exceeds context length"],
      limitations: ["No native BERT, T5, LLaMA, Mistral or Qwen architecture", "No KV-cache optimization", "No attention-map capture in the public inspection feature"],
      usage: "from arclm.models import ArcLM\n\nmodel = ArcLM(vocab_size=32, embed_dim=16, block_size=8, num_blocks=1)\nprint(type(model).__name__)"
    },
    {
      id: "training",
      title: "Native training",
      status: "Stable",
      summary: "Train a native ArcLM causal language model on local tokenized data.",
      explanation: "Training uses the canonical Trainer and TrainingConfig. It supports small local CPU workflows, checkpoint saving and resume behavior.",
      importPath: "from arclm.training import Trainer, TrainingConfig",
      whenToUse: "Use it after preparing a tokenizer-compatible tensor dataset.",
      returns: "Trainer state, metrics through callbacks and checkpoints when output settings are configured.",
      commonErrors: ["Empty dataset", "Invalid batch size", "CUDA requested but unavailable", "Checkpoint directory not writable"],
      limitations: ["Single-process Studio training", "Real multi-GPU behavior remains environment-specific"],
      usage: "from arclm.training import TrainingConfig\n\nconfig = TrainingConfig(epochs=1, batch_size=1, learning_rate=1e-3, device=\"cpu\")\nprint(config.epochs, config.batch_size)"
    },
    {
      id: "checkpoints",
      title: "Checkpoints and reload",
      status: "Stable",
      summary: "Save, inspect and reload native training checkpoints.",
      explanation: "Checkpoints preserve model and training state for local continuation, evaluation and generation. Studio exposes metadata and compatibility checks without returning tensor binaries through the API.",
      importPath: "from arclm.checkpoints import inspect_checkpoint",
      whenToUse: "Use checkpoints after training when you need reload, evaluation, generation or inspection.",
      returns: "Checkpoint metadata and compatibility information.",
      commonErrors: ["Missing checkpoint payload", "Incompatible model configuration", "Untrusted or unsupported checkpoint format"],
      limitations: ["Trusted local checkpoint boundary", "External checkpoint support is not universal"],
      usage: "from arclm.checkpoints import inspect_checkpoint\n\n# After training, pass a local checkpoint directory or file accepted by ArcLM.\n# info = inspect_checkpoint(checkpoint_path)\n# print(info.summary())"
    },
    {
      id: "evaluation",
      title: "Evaluation reports",
      status: "Stable",
      summary: "Evaluate a model and return structured metrics such as loss, perplexity and accuracy when applicable.",
      explanation: "Evaluation wraps canonical metrics in a JSON-safe report with model, checkpoint, dataset and runtime identity fields when provided.",
      importPath: "from arclm import build_evaluation_report",
      whenToUse: "Use it after training or reloading a checkpoint to compare model behavior on selected data.",
      returns: "EvaluationReport with to_dict(), to_json() and summary().",
      commonErrors: ["No examples to evaluate", "Tokenizer/checkpoint mismatch", "Metric not applicable to provided outputs"],
      limitations: ["Diagnostics interpret reports but do not replace canonical metrics", "Large benchmark suites are not included"],
      usage: "from arclm import build_evaluation_report\n\nreport = build_evaluation_report(metrics={\"loss\": 1.2, \"perplexity\": 3.3}, num_examples=2)\nprint(report.summary())"
    },
    {
      id: "generation",
      title: "Native generation",
      status: "Stable",
      summary: "Generate bounded text from a native ArcLM model or compatible checkpoint.",
      explanation: "Generation uses the canonical native Generator. Studio generation is local, bounded and stores only local history records under the configured workspace.",
      importPath: "from arclm.inference import Generator",
      whenToUse: "Use it after a model is trained or a compatible checkpoint is loaded.",
      returns: "Generated text plus metadata in Studio workflows.",
      commonErrors: ["Empty prompt", "Prompt exceeds context length", "Requested CUDA device unavailable", "Too many new tokens requested"],
      limitations: ["No streaming", "No continuous batching", "No external-model tracing in Studio"],
      usage: "from arclm.inference import Generator\n\n# Construct Generator with a native model, vocabulary maps and tokenizer.\n# text = generator.generate_string(\"Explain ArcLM\", max_new_tokens=8)\n# print(text)"
    },
    {
      id: "inspection",
      title: "Transparent pipeline inspection",
      status: "Beta",
      summary: "Inspect one native generation step as JSON-safe pipeline metadata.",
      explanation: "Inspection shows input text, tokens, token IDs, input tensor shape, embedding shape, logits shape, selected token and decoded output without retaining large tensors by default.",
      importPath: "from arclm import inspect_text",
      whenToUse: "Use it when teaching or debugging how native text generation flows through ArcLM.",
      returns: "PipelineTrace with summary(), to_dict() and to_json().",
      commonErrors: ["Empty input text", "Unsupported tokenizer object", "Model lacks expected native embedding/forward behavior"],
      limitations: ["Inspects one native step", "No attention maps", "No web streaming", "No external Hugging Face tracing"],
      usage: "from arclm import inspect_text\nfrom arclm.models import ArcLM\nfrom arclm.tokenizers import Tokenizer\n\ntokenizer = Tokenizer(max_vocab=32)\ntokenizer.build(\"Hello ArcLM\")\nmodel = ArcLM(vocab_size=tokenizer.get_vocab_size(), embed_dim=8, block_size=8, num_blocks=1)\ntrace = inspect_text(model=model, tokenizer=tokenizer, text=\"Hello ArcLM\")\nprint(trace.summary())"
    },
    {
      id: "sft",
      title: "Supervised fine-tuning",
      status: "Stable",
      summary: "Validate and format instruction, prompt/completion or chat-style records for fine-tuning.",
      explanation: "SFT tools share one data contract: validate records, format prompts, tokenize text, build labels, optionally mask prompts, collate batches and train through the supported native or optional external path.",
      importPath: "from arclm import validate_sft_records",
      whenToUse: "Use it when your dataset contains instructions and desired responses.",
      returns: "Validation results and prepared training records for supported fine-tuning workflows.",
      commonErrors: ["Missing response/completion", "Invalid messages format", "Tokenizer cannot encode usable labels"],
      limitations: ["External Hugging Face SFT requires optional dependencies", "Packing is not the stable default"],
      usage: "from arclm import validate_sft_records\n\nrecords = [{\"instruction\": \"Explain ArcLM.\", \"response\": \"ArcLM is local and native-first.\"}]\nresult = validate_sft_records(records)\nprint(result.summary())"
    },
    {
      id: "lora",
      title: "Native LoRA",
      status: "Stable",
      summary: "Apply lightweight trainable adapters to native ArcLM linear layers.",
      explanation: "Native LoRA lets you train a smaller set of parameters for tiny ArcLM experiments and save adapter artifacts separately.",
      importPath: "from arclm.peft import LoRAConfig, apply_lora",
      whenToUse: "Use it for small adapter experiments on the native ArcLM model.",
      returns: "A model with trainable adapter parameters and adapter artifact helpers.",
      commonErrors: ["No supported linear layers selected", "Adapter artifact does not match model shape", "External PEFT package missing for external adapter paths"],
      limitations: ["Native ArcLM Linear-layer validation only", "QLoRA runtime remains hardware and dependency dependent"],
      usage: "from arclm.peft import LoRAConfig\n\nconfig = LoRAConfig(r=2, alpha=4, dropout=0.0)\nprint(config.to_dict())"
    }
  ],
  modules: [
    {
      name: "Datasets",
      importPath: "arclm.datasets",
      purpose: "Load, validate, clean and report on local datasets.",
      publicApi: ["load_dataset", "DatasetLoader", "validate_records", "create_dataset_manifest", "build_dataset_report"],
      fit: "Starts the native ArcLM workflow before tokenizer creation.",
      whenToUse: "Use for local records and lightweight validation.",
      status: "Stable",
      optionalDependencies: "None for core local records.",
      limitations: "No remote dataset registry."
    },
    {
      name: "Tokenizers",
      importPath: "arclm.tokenizers",
      purpose: "Convert text into token IDs and decode IDs back to text.",
      publicApi: ["Tokenizer", "SentencePieceTokenizer", "AutoTokenizer"],
      fit: "Bridges dataset text and model tensor inputs.",
      whenToUse: "Use before model creation and generation.",
      status: "Beta",
      optionalDependencies: "SentencePiece workflows use sentencepiece.",
      limitations: "External tokenizer behavior is optional-path specific."
    },
    {
      name: "Models",
      importPath: "arclm.models",
      purpose: "Create the native ArcLM causal language model and inspect model capabilities.",
      publicApi: ["ArcLM", "ModelCapabilityReport", "model_support_matrix", "get_model_capability"],
      fit: "Owns the native causal language model path.",
      whenToUse: "Use for native local model experiments.",
      status: "Stable",
      optionalDependencies: "torch",
      limitations: "Only native causal LM architecture is provided."
    },
    {
      name: "Training",
      importPath: "arclm.training",
      purpose: "Train native models with a canonical Trainer and TrainingConfig.",
      publicApi: ["Trainer", "TrainingConfig", "train_model"],
      fit: "Turns tokenized datasets into checkpoints.",
      whenToUse: "Use for local model training and resume workflows.",
      status: "Stable",
      optionalDependencies: "torch",
      limitations: "Distributed and hardware-specific behavior is not the main stable path."
    },
    {
      name: "Checkpoints",
      importPath: "arclm.checkpoints",
      purpose: "Inspect and reload native checkpoints safely.",
      publicApi: ["SmartLoader", "inspect_checkpoint"],
      fit: "Connects training outputs to evaluation, generation and inspection.",
      whenToUse: "Use after training or when resuming a trusted local run.",
      status: "Stable",
      optionalDependencies: "safetensors for optional artifact formats.",
      limitations: "Does not magically load every external format."
    },
    {
      name: "Evaluation",
      importPath: "arclm.evaluation",
      purpose: "Measure model behavior and produce structured evaluation reports.",
      publicApi: ["Evaluator", "EvaluationReport", "build_evaluation_report", "Accuracy", "Perplexity"],
      fit: "Checks trained checkpoints against selected data.",
      whenToUse: "Use after training or reload.",
      status: "Stable",
      optionalDependencies: "torch",
      limitations: "No large benchmark suite integration by default."
    },
    {
      name: "Inference",
      importPath: "arclm.inference",
      purpose: "Generate text with native models and expose optional external causal-LM boundaries.",
      publicApi: ["Generator", "load_model", "predict"],
      fit: "Produces text after model creation or checkpoint reload.",
      whenToUse: "Use for bounded local generation.",
      status: "Stable",
      optionalDependencies: "External paths may use transformers or peft.",
      limitations: "No production serving, streaming or universal external loading."
    },
    {
      name: "Inspection",
      importPath: "arclm.inspection",
      purpose: "Explain one native generation step with JSON-safe trace metadata.",
      publicApi: ["inspect_text", "PipelineTrace"],
      fit: "Makes the model pipeline understandable without reading internals.",
      whenToUse: "Use for learning, teaching and debugging native flow.",
      status: "Beta",
      optionalDependencies: "torch",
      limitations: "No attention-map capture or external-model tracing."
    },
    {
      name: "Web",
      importPath: "arclm.web",
      purpose: "Create the optional local FastAPI backend for ArcLM Studio.",
      publicApi: ["create_app", "WebConfig", "DatasetRoot"],
      fit: "Serves local Studio workflows without changing native package imports.",
      whenToUse: "Use for the local visual workflow.",
      status: "Beta",
      optionalDependencies: "Install the web extra for FastAPI and Uvicorn.",
      limitations: "Local single-machine Studio, not production serving."
    },
    {
      name: "Compatibility modules",
      importPath: "arclm.pipeline_v2 and legacy aliases",
      purpose: "Deprecated import paths kept for older user code.",
      publicApi: ["MiniGPT", "legacy re-export modules"],
      fit: "Compatibility only.",
      whenToUse: "Avoid in new projects.",
      status: "Deprecated",
      optionalDependencies: "Same as the canonical replacement modules.",
      limitations: "Retained through the compatibility window."
    }
  ],
  cli: [
    {
      command: "arclm train --help",
      status: "Stable",
      purpose: "Show native training configuration options.",
      example: "arclm train --help"
    },
    {
      command: "arclm eval --help",
      status: "Stable",
      purpose: "Show evaluation command options for supported local workflows.",
      example: "arclm eval --help"
    },
    {
      command: "arclm generate --help",
      status: "Stable",
      purpose: "Show bounded generation command options.",
      example: "arclm generate --help"
    },
    {
      command: "arclm doctor",
      status: "Beta",
      purpose: "Print safe local diagnostics such as ArcLM version, Python version, PyTorch version, CUDA status and optional dependency availability.",
      example: "arclm doctor\narclm doctor --json"
    },
    {
      command: "python -m arclm web-api",
      status: "Beta",
      purpose: "Start the optional local FastAPI backend for ArcLM Studio.",
      example: "python -m arclm web-api"
    }
  ],
  studio: {
    status: "Beta",
    summary: "ArcLM Studio is an optional local visual workflow for native ArcLM projects.",
    workflow: ["Project", "Dataset", "Validation and report", "Tokenizer", "Record token inspection", "Native model", "Training run", "Metrics and events", "Checkpoint", "Evaluation", "Generation", "Pipeline inspection"],
    explanation: "Studio keeps model and tokenizer ownership on the local backend. The browser sends project IDs, generated object IDs and bounded form fields; it does not load models in the browser or request arbitrary checkpoint paths.",
    start: "Install the web extra and start the local API with python -m arclm web-api. Run the frontend with the existing web package scripts during development.",
    limitations: ["Local single-process backend", "No authentication or cloud workspace", "No external model downloads through Studio", "No streaming or attention maps", "No production serving"]
  },
  limitations: [
    "ArcLM does not claim universal Hugging Face model support.",
    "Native support is limited to ArcLM's compact causal language model.",
    "Production serving, OpenAI-compatible APIs, WebSockets and streaming generation are not implemented.",
    "Attention-map visualization is not implemented.",
    "Native BERT, T5, diffusion, vision, audio and multimodal models are unsupported.",
    "RLHF, DPO, GRPO and real QLoRA runtime validation are outside the current release.",
    "CUDA and multi-GPU behavior depends on local hardware and installed PyTorch builds."
  ]
};
