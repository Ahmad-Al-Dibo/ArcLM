window.ARCLM_DOCS = {
  "version": "0.10.0",
  "statuses": [
    "Stable",
    "Beta",
    "Experimental",
    "Deprecated",
    "Internal",
    "Unsupported"
  ],
  "pages": [
    {
      "id": "overview",
      "title": "ArcLM Documentation",
      "group": "Start",
      "href": "index.html",
      "summary": "A native-first library for local language-model learning.",
      "sections": [
        {
          "title": "What ArcLM is",
          "body": "ArcLM is a compact Python library for local language-model workflows. The main path is dataset, tokenizer, native causal model, training, checkpoint, evaluation, generation and pipeline inspection."
        },
        {
          "title": "What you can do",
          "body": "",
          "items": [
            "Load and validate local datasets",
            "Create native tokenizers",
            "Train a tiny native ArcLM model",
            "Save and reload checkpoints",
            "Evaluate and generate text",
            "Inspect the pipeline",
            "Use the optional local Studio"
          ]
        },
        {
          "title": "Smallest import check",
          "body": "",
          "code": "import arclm\nfrom arclm import inspect_text\n\nprint(arclm.__version__)\nprint(inspect_text)",
          "language": "python"
        }
      ],
      "status": "Stable"
    },
    {
      "id": "installation",
      "title": "Installation",
      "group": "Start",
      "href": "installation.html",
      "summary": "Install ArcLM base or optional extras.",
      "sections": [
        {
          "title": "Base install",
          "body": "The base package contains the native ArcLM workflow and does not require web or Hugging Face packages."
        },
        {
          "title": "Install variants",
          "body": "",
          "table": {
            "columns": [
              "Variant",
              "Command",
              "Adds"
            ],
            "rows": [
              [
                "Base native",
                "pip install arclm",
                "Datasets, tokenizers, native model, training, checkpoints, evaluation, generation and inspection."
              ],
              [
                "Web Studio",
                "pip install \"arclm[web]\"",
                "Adds FastAPI, Uvicorn and Flask compatibility for the local web surfaces."
              ],
              [
                "External model integration",
                "pip install \"arclm[hf]\"",
                "Adds optional Hugging Face, Accelerate, Datasets and PEFT packages for external paths."
              ],
              [
                "PEFT only",
                "pip install \"arclm[peft]\"",
                "Adds optional PEFT for external adapter workflows."
              ],
              [
                "Preprocess tools",
                "pip install \"arclm[preprocess]\"",
                "Adds optional HTML/YAML/tqdm preprocessing helpers."
              ],
              [
                "Development",
                "pip install -e \".[dev]\"",
                "Installs local development tools such as pytest, build and twine."
              ]
            ]
          }
        },
        {
          "title": "Verify the install",
          "body": "",
          "code": "import arclm\nfrom arclm.datasets import load_dataset\n\nprint(arclm.__version__)\nprint(load_dataset([{\"text\": \"ArcLM\"}]))",
          "language": "python"
        },
        {
          "title": "Optional boundaries",
          "body": "",
          "items": [
            "Web imports require the web extra.",
            "External model paths require optional integration packages.",
            "Base native imports do not load FastAPI, Uvicorn, Transformers, PEFT or Datasets."
          ]
        }
      ],
      "status": "Stable"
    },
    {
      "id": "getting-started",
      "title": "Getting Started",
      "group": "Start",
      "href": "getting-started.html",
      "summary": "Three quick paths into ArcLM.",
      "sections": [
        {
          "title": "Path 1 - inspect text without training",
          "body": "Create a tokenizer and tiny native model, then call inspect_text to see token IDs and tensor shapes."
        },
        {
          "title": "Inspect text",
          "body": "",
          "code": "from arclm import inspect_text\nfrom arclm.models import ArcLM\nfrom arclm.tokenizers import Tokenizer\n\ntokenizer = Tokenizer(max_vocab=16)\ntokenizer.build(\"Hello ArcLM\")\nmodel = ArcLM(vocab_size=tokenizer.get_vocab_size(), embed_dim=8, block_size=8, num_blocks=1)\ntrace = inspect_text(model=model, tokenizer=tokenizer, text=\"Hello\")\nprint(trace.to_dict())",
          "language": "python"
        },
        {
          "title": "Path 2 - train a tiny native model",
          "body": "Prepare records, create a tokenizer-compatible model, configure Trainer and save checkpoints. See the training guide for the complete flow."
        },
        {
          "title": "Path 3 - use ArcLM Studio",
          "body": "Install the web extra, start the local API and open the existing frontend during development. Studio keeps data and model artifacts local."
        }
      ],
      "status": "Stable"
    },
    {
      "id": "architecture",
      "title": "Architecture",
      "group": "Start",
      "href": "architecture.html",
      "summary": "How ArcLM pieces fit together.",
      "sections": [
        {
          "title": "Native-first core",
          "body": "ArcLM keeps the core workflow in local Python and PyTorch. Optional integrations are separate paths."
        },
        {
          "title": "Core flow",
          "body": "",
          "items": [
            "Dataset records",
            "Tokenizer",
            "Token IDs",
            "Native ArcLM model",
            "Trainer",
            "Checkpoint",
            "Evaluator",
            "Generator",
            "PipelineTrace"
          ]
        },
        {
          "title": "Optional integrations",
          "body": "The Web API and Studio are optional local interfaces. Hugging Face and PEFT integrations are optional and should not be mistaken for universal model support."
        }
      ],
      "status": "Stable"
    },
    {
      "id": "workflows",
      "title": "Workflows",
      "group": "Start",
      "href": "workflows.html",
      "summary": "Common ArcLM workflows.",
      "sections": [
        {
          "title": "Native happy path",
          "body": "",
          "items": [
            "Load or create records",
            "Validate schema",
            "Build tokenizer",
            "Create native model",
            "Train",
            "Save checkpoint",
            "Evaluate",
            "Generate",
            "Inspect"
          ]
        },
        {
          "title": "SFT path",
          "body": "",
          "items": [
            "Instruction records",
            "Validation",
            "Formatting",
            "Tokenization",
            "Labels",
            "Training",
            "Checkpoint"
          ]
        },
        {
          "title": "Studio path",
          "body": "",
          "items": [
            "Project",
            "Dataset",
            "Tokenizer",
            "Model",
            "Training run",
            "Checkpoint",
            "Evaluation",
            "Generation",
            "Inspection"
          ]
        }
      ],
      "status": "Stable"
    },
    {
      "id": "guide-datasets",
      "title": "Datasets",
      "group": "Learn",
      "href": "guides/datasets.html",
      "summary": "Load, validate and report on local data.",
      "sections": [
        {
          "title": "What datasets are",
          "body": "ArcLM datasets are local records used for tokenization, training, fine-tuning, evaluation and reports."
        },
        {
          "title": "Supported inputs",
          "body": "",
          "items": [
            "Python list of dictionaries",
            "JSON",
            "JSONL",
            "CSV",
            "TXT",
            "Instruction/response records",
            "Prompt/completion records"
          ]
        },
        {
          "title": "Validate instruction records",
          "body": "",
          "code": "from arclm.datasets import validate_records\n\nresult = validate_records([{\"instruction\": \"Hi\", \"response\": \"Hello\"}], required_fields=[\"instruction\", \"response\"])\nprint(result.valid_count)",
          "language": "python"
        },
        {
          "title": "Build a token report",
          "body": "",
          "code": "from arclm.datasets import build_dataset_report\nfrom arclm.tokenizers import Tokenizer\n\nrecords = [{\"text\": \"ArcLM trains locally\"}]\ntokenizer = Tokenizer(max_vocab=16)\ntokenizer.build(records[0][\"text\"])\nreport = build_dataset_report(records, tokenizer=tokenizer)\nprint(report.summary())",
          "language": "python"
        }
      ],
      "status": "Stable"
    },
    {
      "id": "guide-tokenizers",
      "title": "Tokenizers",
      "group": "Learn",
      "href": "guides/tokenizers.html",
      "summary": "Convert text to token IDs and back.",
      "sections": [
        {
          "title": "Core concepts",
          "body": "Tokenization splits text into tokens, maps them to numeric IDs and provides decoding back to text. Models consume IDs, not raw strings."
        },
        {
          "title": "Modes",
          "body": "",
          "items": [
            "Word tokenizer for deterministic tiny examples",
            "SentencePiece BPE",
            "SentencePiece unigram",
            "SentencePiece character",
            "SentencePiece word mode"
          ]
        },
        {
          "title": "Create a Word tokenizer",
          "body": "",
          "code": "from arclm.tokenizers import Tokenizer\n\ntokenizer = Tokenizer(max_vocab=32)\ntokenizer.build(\"Hello ArcLM\")\nids = tokenizer.encode_text(\"Hello\")\nprint(ids)",
          "language": "python"
        },
        {
          "title": "SentencePiece configuration",
          "body": "",
          "code": "from arclm.tokenizers import SentencePieceTokenizer\n\ntokenizer = SentencePieceTokenizer(max_vocab=64, model_type=\"bpe\")\nprint(tokenizer.model_type)",
          "language": "python"
        },
        {
          "title": "Common mistakes",
          "body": "",
          "items": [
            "Tokenizer vocabulary does not match model vocabulary",
            "Vocabulary too small",
            "Unknown-token count is high"
          ]
        }
      ],
      "status": "Stable"
    },
    {
      "id": "guide-models",
      "title": "Models",
      "group": "Learn",
      "href": "guides/models.html",
      "summary": "Create native ArcLM causal language models.",
      "sections": [
        {
          "title": "Native model path",
          "body": "ArcLM provides a compact GPT-style causal language model. It is the official native model path."
        },
        {
          "title": "Create a tiny model",
          "body": "",
          "code": "from arclm.models import ArcLM\n\nmodel = ArcLM(vocab_size=32, embed_dim=16, block_size=8, num_blocks=1)\nprint(type(model).__name__)",
          "language": "python"
        },
        {
          "title": "Important fields",
          "body": "",
          "table": {
            "columns": [
              "Field",
              "Meaning"
            ],
            "rows": [
              [
                "vocab_size",
                "Must match tokenizer size"
              ],
              [
                "embed_dim",
                "Embedding width"
              ],
              [
                "block_size",
                "Context length"
              ],
              [
                "num_blocks",
                "Transformer block count"
              ]
            ]
          }
        },
        {
          "title": "Limitations",
          "body": "",
          "items": [
            "No native BERT/T5/diffusion/multimodal models",
            "No streaming generation",
            "No attention-map capture"
          ]
        }
      ],
      "status": "Stable"
    },
    {
      "id": "guide-training",
      "title": "Training",
      "group": "Learn",
      "href": "guides/training.html",
      "summary": "Train native models with Trainer.",
      "sections": [
        {
          "title": "How training works",
          "body": "The native path batches token IDs, runs the model forward pass, computes loss, backpropagates, steps the optimizer and saves checkpoints."
        },
        {
          "title": "Create TrainingConfig",
          "body": "",
          "code": "from arclm.training import TrainingConfig\n\nconfig = TrainingConfig(epochs=1, batch_size=1, learning_rate=1e-3, device=\"cpu\")\nprint(config)",
          "language": "python"
        },
        {
          "title": "Create Trainer",
          "body": "",
          "code": "from arclm.training import Trainer, TrainingConfig\n\nconfig = TrainingConfig(epochs=1, batch_size=1, device=\"cpu\")\n# trainer = Trainer(model=model, config=config, train_dataset=dataset)\n# trainer.train()",
          "language": "python"
        },
        {
          "title": "Supported options",
          "body": "",
          "items": [
            "CPU",
            "CUDA when available",
            "Gradient accumulation",
            "Checkpoint intervals",
            "Adam, AdamW and SGD options"
          ]
        }
      ],
      "status": "Stable"
    },
    {
      "id": "guide-fine-tuning",
      "title": "Fine-Tuning",
      "group": "Learn",
      "href": "guides/fine-tuning.html",
      "summary": "Validate and prepare supervised fine-tuning records.",
      "sections": [
        {
          "title": "SFT contract",
          "body": "SFT accepts instruction/response, prompt/completion and normalized chat-style records. The stable contract validates records before formatting and tokenization."
        },
        {
          "title": "Validate SFT records",
          "body": "",
          "code": "from arclm import validate_sft_records\n\nrecords = [{\"instruction\": \"Explain ArcLM.\", \"response\": \"ArcLM is native-first.\"}]\nresult = validate_sft_records(records)\nprint(result.summary())",
          "language": "python"
        },
        {
          "title": "Limitations",
          "body": "",
          "items": [
            "External Hugging Face SFT needs optional packages",
            "Packing is not the stable default",
            "Native Trainer is not replaced by a separate SFT engine"
          ]
        }
      ],
      "status": "Stable"
    },
    {
      "id": "guide-peft-lora",
      "title": "PEFT and LoRA",
      "group": "Learn",
      "href": "guides/peft-lora.html",
      "summary": "Use lightweight native adapters where validated.",
      "sections": [
        {
          "title": "Native LoRA",
          "body": "ArcLM validates native LoRA on ArcLM linear layers. External PEFT paths remain optional and model-specific."
        },
        {
          "title": "Configure LoRA",
          "body": "",
          "code": "from arclm.peft import LoRAConfig\n\nconfig = LoRAConfig(r=2, alpha=4, dropout=0.0)\nprint(config)",
          "language": "python"
        },
        {
          "title": "Limitations",
          "body": "",
          "items": [
            "Native ArcLM Linear layers only for stable validation",
            "QLoRA runtime depends on CUDA and bitsandbytes",
            "External adapter behavior is not universal"
          ]
        }
      ],
      "status": "Stable"
    },
    {
      "id": "guide-checkpoints",
      "title": "Checkpoints",
      "group": "Learn",
      "href": "guides/checkpoints.html",
      "summary": "Save, inspect and reload native checkpoints.",
      "sections": [
        {
          "title": "What checkpoints store",
          "body": "Native checkpoints store model state and training state needed for reload, resume, evaluation, generation and inspection."
        },
        {
          "title": "Inspect checkpoint metadata",
          "body": "",
          "code": "from arclm.checkpoints import inspect_checkpoint\n\n# info = inspect_checkpoint(\"local-checkpoint-directory\")\n# print(info)",
          "language": "python"
        },
        {
          "title": "Common errors",
          "body": "",
          "items": [
            "Checkpoint not found",
            "Incompatible checkpoint",
            "Missing metadata",
            "Untrusted external file"
          ]
        }
      ],
      "status": "Stable"
    },
    {
      "id": "guide-evaluation",
      "title": "Evaluation",
      "group": "Learn",
      "href": "guides/evaluation.html",
      "summary": "Measure model behavior with structured reports.",
      "sections": [
        {
          "title": "What evaluation returns",
          "body": "Evaluation returns metrics such as loss, perplexity and accuracy when applicable, plus report metadata such as examples and device."
        },
        {
          "title": "Create report object",
          "body": "",
          "code": "from arclm.evaluation import EvaluationReport\n\nreport = EvaluationReport(metrics={\"loss\": 1.0}, num_examples=1, num_batches=1, num_tokens=None, model_identity=None, checkpoint_identity=None, dataset_identity=None, evaluation_timestamp=0.0, device=\"cpu\", dtype=\"float32\")\nprint(report.summary())",
          "language": "python"
        },
        {
          "title": "Limitations",
          "body": "",
          "items": [
            "No large benchmark suite by default",
            "Diagnostics interpret reports, not recalculate metrics"
          ]
        }
      ],
      "status": "Stable"
    },
    {
      "id": "guide-inference",
      "title": "Inference",
      "group": "Learn",
      "href": "guides/inference.html",
      "summary": "Use a trained or reloaded model for bounded local model use.",
      "sections": [
        {
          "title": "What inference means in ArcLM",
          "body": "Inference is the model-use side of ArcLM. The stable native path loads a trusted local native model or checkpoint, prepares token IDs with the matching tokenizer and runs a bounded generation or inspection step."
        },
        {
          "title": "When to use it",
          "body": "",
          "items": [
            "Generate a short continuation",
            "Inspect the native pipeline",
            "Check a checkpoint after training",
            "Run small CPU-friendly experiments"
          ]
        },
        {
          "title": "Native generation entry point",
          "body": "",
          "code": "from arclm.inference import Generator\n\n# generator = Generator(model, tokenizer.stoi, tokenizer.itos, 8, \"cpu\", tokenizer=tokenizer)\n# print(generator.generate_string(\"Hello\", max_new_tokens=4))",
          "language": "python"
        },
        {
          "title": "Limitations",
          "body": "",
          "items": [
            "No streaming generation",
            "No production serving",
            "External causal-LM loading is optional and lower-level"
          ]
        }
      ],
      "status": "Stable"
    },
    {
      "id": "guide-generation",
      "title": "Generation",
      "group": "Learn",
      "href": "guides/generation.html",
      "summary": "Generate bounded text from native checkpoints.",
      "sections": [
        {
          "title": "How generation works",
          "body": "Generation tokenizes a prompt, feeds the model, selects next tokens with supported sampling settings and decodes text."
        },
        {
          "title": "Generator shape",
          "body": "",
          "code": "from arclm.inference import Generator\n\n# generator = Generator(model, tokenizer.stoi, tokenizer.itos, 8, \"cpu\", tokenizer=tokenizer)\n# print(generator.generate_string(\"Hello\", max_new_tokens=4))",
          "language": "python"
        },
        {
          "title": "Options",
          "body": "",
          "table": {
            "columns": [
              "Option",
              "Meaning"
            ],
            "rows": [
              [
                "max_new_tokens",
                "Bound generated length"
              ],
              [
                "temperature",
                "Sampling sharpness"
              ],
              [
                "top_k",
                "Limit candidate tokens"
              ],
              [
                "top_p",
                "Nucleus sampling threshold"
              ]
            ]
          }
        }
      ],
      "status": "Stable"
    },
    {
      "id": "guide-inspection",
      "title": "Pipeline Inspection",
      "group": "Learn",
      "href": "guides/inspection.html",
      "summary": "Explain one native generation step.",
      "sections": [
        {
          "title": "What inspection shows",
          "body": "Inspection exposes input text, tokens, IDs, input shape, embedding shape, logits shape, selected token, decoded text, device and dtype."
        },
        {
          "title": "Inspect text",
          "body": "",
          "code": "from arclm import inspect_text\nfrom arclm.models import ArcLM\nfrom arclm.tokenizers import Tokenizer\n\ntokenizer = Tokenizer(max_vocab=16)\ntokenizer.build(\"Hello ArcLM\")\nmodel = ArcLM(vocab_size=tokenizer.get_vocab_size(), embed_dim=8, block_size=8, num_blocks=1)\ntrace = inspect_text(model=model, tokenizer=tokenizer, text=\"Hello\")\nprint(trace.to_dict())",
          "language": "python"
        },
        {
          "title": "Limitations",
          "body": "",
          "items": [
            "One native generation step",
            "No attention maps",
            "No external-model tracing"
          ]
        }
      ],
      "status": "Stable"
    },
    {
      "id": "guide-external-models",
      "title": "External Models",
      "group": "Learn",
      "href": "guides/external-models.html",
      "summary": "Optional lower-level Hugging Face causal-LM boundaries.",
      "sections": [
        {
          "title": "Honest status",
          "body": "External model loading exists through optional integration paths. It is not a universal loader and may require internet for first model download."
        },
        {
          "title": "Inspect source boundary",
          "body": "",
          "code": "from arclm.inference.external import inspect_model_source\n\nsource = inspect_model_source(\"Qwen/Qwen3-0.6B\")\nprint(source)",
          "language": "python"
        },
        {
          "title": "Limitations",
          "body": "",
          "items": [
            "Requires optional packages",
            "First download may require internet",
            "Only exact verified operations should be trusted"
          ]
        }
      ],
      "status": "Experimental"
    },
    {
      "id": "guide-cli",
      "title": "CLI",
      "group": "Learn",
      "href": "guides/cli.html",
      "summary": "Use ArcLM from the command line.",
      "sections": [
        {
          "title": "Commands",
          "body": "",
          "table": {
            "columns": [
              "Command",
              "Purpose"
            ],
            "rows": [
              [
                "arclm train --help",
                "Show training options"
              ],
              [
                "arclm eval --help",
                "Show evaluation options"
              ],
              [
                "arclm generate --help",
                "Show generation options"
              ],
              [
                "arclm doctor",
                "Print safe local diagnostics"
              ],
              [
                "python -m arclm web-api",
                "Start the local Web API"
              ]
            ]
          }
        },
        {
          "title": "Doctor JSON",
          "body": "",
          "code": "arclm doctor --json",
          "language": "bash"
        }
      ],
      "status": "Stable"
    },
    {
      "id": "guide-web-studio",
      "title": "ArcLM Studio",
      "group": "Learn",
      "href": "guides/web-studio.html",
      "summary": "Optional local visual workflow.",
      "sections": [
        {
          "title": "Local workflow",
          "body": "Studio provides project, dataset, tokenizer, model, training run, checkpoint, evaluation, generation and inspection pages. It remains local and read/write bounded to the configured workspace."
        },
        {
          "title": "Workflow",
          "body": "",
          "items": [
            "Project",
            "Dataset",
            "Validation/report",
            "Tokenizer",
            "Record inspection",
            "Native model",
            "Training",
            "Checkpoint",
            "Evaluation",
            "Generation",
            "Pipeline inspection"
          ]
        },
        {
          "title": "Limitations",
          "body": "",
          "items": [
            "No auth",
            "No cloud",
            "No external model downloads",
            "No streaming",
            "No production serving"
          ]
        }
      ],
      "status": "Beta"
    },
    {
      "id": "api-datasets",
      "title": "Dataset API",
      "group": "Reference",
      "href": "api/datasets.html",
      "summary": "Public datasets APIs.",
      "sections": [
        {
          "title": "Overview",
          "body": "Dataset API documents the public ArcLM APIs in this category."
        },
        {
          "title": "load_dataset",
          "body": "Load in-memory records or supported local dataset files."
        },
        {
          "title": "load_dataset parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Meaning"
            ],
            "rows": [
              [
                "source",
                "Any",
                "Python records, text path, JSON, JSONL, CSV or TXT source."
              ]
            ]
          }
        },
        {
          "title": "load_dataset example",
          "body": "",
          "code": "from arclm.datasets import load_dataset\n\nrecords = load_dataset([{\"text\": \"ArcLM\"}])\nprint(records)",
          "language": "python"
        },
        {
          "title": "validate_records",
          "body": "Validate required dataset fields and return structured issues."
        },
        {
          "title": "validate_records parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Meaning"
            ],
            "rows": [
              [
                "records",
                "Iterable[Mapping]",
                "Input records."
              ],
              [
                "required_fields",
                "Sequence[str]",
                "Fields each valid record must contain."
              ],
              [
                "strict",
                "bool",
                "Raise on invalid records when true."
              ]
            ]
          }
        },
        {
          "title": "validate_records example",
          "body": "",
          "code": "from arclm.datasets import validate_records\n\nresult = validate_records([{\"instruction\": \"Hi\", \"response\": \"Hello\"}], required_fields=[\"instruction\", \"response\"])\nprint(result.valid_count)",
          "language": "python"
        },
        {
          "title": "build_dataset_report",
          "body": "Create JSON-safe dataset and token statistics."
        },
        {
          "title": "build_dataset_report parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Meaning"
            ],
            "rows": [
              [
                "records",
                "Iterable[Mapping]",
                "Input records."
              ],
              [
                "tokenizer",
                "Any",
                "Tokenizer used for token statistics."
              ],
              [
                "text_fields",
                "Sequence[str]",
                "Fields to measure."
              ]
            ]
          }
        },
        {
          "title": "build_dataset_report example",
          "body": "",
          "code": "from arclm.datasets import build_dataset_report\nfrom arclm.tokenizers import Tokenizer\n\nrecords = [{\"text\": \"ArcLM trains locally\"}]\ntokenizer = Tokenizer(max_vocab=16)\ntokenizer.build(records[0][\"text\"])\nreport = build_dataset_report(records, tokenizer=tokenizer)\nprint(report.summary())",
          "language": "python"
        }
      ],
      "status": "Stable"
    },
    {
      "id": "api-tokenizers",
      "title": "Tokenizer API",
      "group": "Reference",
      "href": "api/tokenizers.html",
      "summary": "Public tokenizers APIs.",
      "sections": [
        {
          "title": "Overview",
          "body": "Tokenizer API documents the public ArcLM APIs in this category."
        },
        {
          "title": "Tokenizer",
          "body": "Simple native word tokenizer."
        },
        {
          "title": "Tokenizer parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Meaning"
            ],
            "rows": [
              [
                "max_vocab",
                "int",
                "Maximum vocabulary size."
              ],
              [
                "default_token",
                "str",
                "Token used for unknown words."
              ]
            ]
          }
        },
        {
          "title": "Tokenizer example",
          "body": "",
          "code": "from arclm.tokenizers import Tokenizer\n\ntokenizer = Tokenizer(max_vocab=32)\ntokenizer.build(\"Hello ArcLM\")\nids = tokenizer.encode_text(\"Hello\")\nprint(ids)",
          "language": "python"
        },
        {
          "title": "SentencePieceTokenizer",
          "body": "Native wrapper for SentencePiece BPE, unigram, character and word modes."
        },
        {
          "title": "SentencePieceTokenizer parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Meaning"
            ],
            "rows": [
              [
                "model_type",
                "str",
                "One of bpe, unigram, char or word."
              ],
              [
                "max_vocab",
                "int",
                "Vocabulary size target."
              ]
            ]
          }
        },
        {
          "title": "SentencePieceTokenizer example",
          "body": "",
          "code": "from arclm.tokenizers import SentencePieceTokenizer\n\ntokenizer = SentencePieceTokenizer(max_vocab=64, model_type=\"bpe\")\nprint(tokenizer.model_type)",
          "language": "python"
        }
      ],
      "status": "Stable"
    },
    {
      "id": "api-models",
      "title": "Model API",
      "group": "Reference",
      "href": "api/models.html",
      "summary": "Public models APIs.",
      "sections": [
        {
          "title": "Overview",
          "body": "Model API documents the public ArcLM APIs in this category."
        },
        {
          "title": "ArcLM",
          "body": "Compact native causal language model."
        },
        {
          "title": "ArcLM parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Meaning"
            ],
            "rows": [
              [
                "vocab_size",
                "int",
                "Must match tokenizer vocabulary."
              ],
              [
                "embed_dim",
                "int",
                "Embedding width."
              ],
              [
                "block_size",
                "int",
                "Context length."
              ],
              [
                "num_blocks",
                "int",
                "Transformer block count."
              ]
            ]
          }
        },
        {
          "title": "ArcLM example",
          "body": "",
          "code": "from arclm.models import ArcLM\n\nmodel = ArcLM(vocab_size=32, embed_dim=16, block_size=8, num_blocks=1)\nprint(type(model).__name__)",
          "language": "python"
        },
        {
          "title": "model_support_matrix",
          "body": "Return the public model support table as JSON-safe rows."
        },
        {
          "title": "model_support_matrix parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Meaning"
            ],
            "rows": []
          }
        },
        {
          "title": "model_support_matrix example",
          "body": "",
          "code": "from arclm import model_support_matrix\n\nfor row in model_support_matrix():\n    print(row[\"Model\"], row[\"Status\"])",
          "language": "python"
        }
      ],
      "status": "Stable"
    },
    {
      "id": "api-training",
      "title": "Training API",
      "group": "Reference",
      "href": "api/training.html",
      "summary": "Public training APIs.",
      "sections": [
        {
          "title": "Overview",
          "body": "Training API documents the public ArcLM APIs in this category."
        },
        {
          "title": "TrainingConfig",
          "body": "Configuration for native training."
        },
        {
          "title": "TrainingConfig parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Meaning"
            ],
            "rows": [
              [
                "epochs",
                "int",
                "Epoch count."
              ],
              [
                "batch_size",
                "int",
                "Batch size."
              ],
              [
                "learning_rate",
                "float",
                "Optimizer learning rate."
              ],
              [
                "device",
                "str | None",
                "cpu, cuda or automatic selection."
              ]
            ]
          }
        },
        {
          "title": "TrainingConfig example",
          "body": "",
          "code": "from arclm.training import TrainingConfig\n\nconfig = TrainingConfig(epochs=1, batch_size=1, learning_rate=1e-3, device=\"cpu\")\nprint(config)",
          "language": "python"
        },
        {
          "title": "Trainer",
          "body": "Canonical native training loop."
        },
        {
          "title": "Trainer parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Meaning"
            ],
            "rows": [
              [
                "model",
                "torch.nn.Module",
                "Model to train."
              ],
              [
                "config",
                "TrainingConfig",
                "Training settings."
              ],
              [
                "train_dataset",
                "Dataset",
                "Training examples."
              ]
            ]
          }
        },
        {
          "title": "Trainer example",
          "body": "",
          "code": "from arclm.training import Trainer, TrainingConfig\n\nconfig = TrainingConfig(epochs=1, batch_size=1, device=\"cpu\")\n# trainer = Trainer(model=model, config=config, train_dataset=dataset)\n# trainer.train()",
          "language": "python"
        },
        {
          "title": "validate_sft_records",
          "body": "Validate supervised fine-tuning records before formatting."
        },
        {
          "title": "validate_sft_records parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Meaning"
            ],
            "rows": [
              [
                "records",
                "Iterable[Mapping]",
                "Instruction/response, prompt/completion or chat-style records."
              ],
              [
                "strict",
                "bool",
                "Raise on invalid records when true."
              ]
            ]
          }
        },
        {
          "title": "validate_sft_records example",
          "body": "",
          "code": "from arclm import validate_sft_records\n\nrecords = [{\"instruction\": \"Explain ArcLM.\", \"response\": \"ArcLM is native-first.\"}]\nresult = validate_sft_records(records)\nprint(result.summary())",
          "language": "python"
        }
      ],
      "status": "Stable"
    },
    {
      "id": "api-checkpoints",
      "title": "Checkpoint API",
      "group": "Reference",
      "href": "api/checkpoints.html",
      "summary": "Public checkpoints APIs.",
      "sections": [
        {
          "title": "Overview",
          "body": "Checkpoint API documents the public ArcLM APIs in this category."
        },
        {
          "title": "inspect_checkpoint",
          "body": "Read safe checkpoint metadata and compatibility information."
        },
        {
          "title": "inspect_checkpoint parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Meaning"
            ],
            "rows": [
              [
                "path",
                "str | Path",
                "Trusted local checkpoint path."
              ],
              [
                "validate",
                "bool",
                "Whether to perform additional validation."
              ]
            ]
          }
        },
        {
          "title": "inspect_checkpoint example",
          "body": "",
          "code": "from arclm.checkpoints import inspect_checkpoint\n\n# info = inspect_checkpoint(\"local-checkpoint-directory\")\n# print(info)",
          "language": "python"
        }
      ],
      "status": "Stable"
    },
    {
      "id": "api-evaluation",
      "title": "Evaluation API",
      "group": "Reference",
      "href": "api/evaluation.html",
      "summary": "Public evaluation APIs.",
      "sections": [
        {
          "title": "Overview",
          "body": "Evaluation API documents the public ArcLM APIs in this category."
        },
        {
          "title": "Evaluator",
          "body": "Evaluate a model with canonical metrics."
        },
        {
          "title": "Evaluator parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Meaning"
            ],
            "rows": [
              [
                "model",
                "torch.nn.Module",
                "Model to evaluate."
              ],
              [
                "metrics",
                "list",
                "Metric objects."
              ],
              [
                "dataset",
                "Dataset",
                "Examples to evaluate."
              ]
            ]
          }
        },
        {
          "title": "Evaluator example",
          "body": "",
          "code": "from arclm.evaluation import Evaluator, LossMetric, Perplexity\n\n# evaluator = Evaluator(model, dataset=dataset, metrics=[LossMetric(), Perplexity()])\n# result = evaluator.evaluate()",
          "language": "python"
        },
        {
          "title": "build_evaluation_report",
          "body": "Wrap evaluation metrics in a JSON-safe report."
        },
        {
          "title": "build_evaluation_report parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Meaning"
            ],
            "rows": [
              [
                "result",
                "EvaluationResult",
                "Canonical evaluation result."
              ],
              [
                "checkpoint_identity",
                "str | None",
                "Checkpoint label."
              ],
              [
                "dataset_identity",
                "str | None",
                "Dataset label."
              ]
            ]
          }
        },
        {
          "title": "build_evaluation_report example",
          "body": "",
          "code": "from arclm.evaluation import EvaluationReport\n\nreport = EvaluationReport(metrics={\"loss\": 1.0}, num_examples=1, num_batches=1, num_tokens=None, model_identity=None, checkpoint_identity=None, dataset_identity=None, evaluation_timestamp=0.0, device=\"cpu\", dtype=\"float32\")\nprint(report.summary())",
          "language": "python"
        }
      ],
      "status": "Stable"
    },
    {
      "id": "api-inference",
      "title": "Inference API",
      "group": "Reference",
      "href": "api/inference.html",
      "summary": "Public inference APIs.",
      "sections": [
        {
          "title": "Overview",
          "body": "Inference API documents the public ArcLM APIs in this category."
        },
        {
          "title": "Generator",
          "body": "Generate bounded text from a native model."
        },
        {
          "title": "Generator parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Meaning"
            ],
            "rows": [
              [
                "model",
                "ArcLM",
                "Native model."
              ],
              [
                "stoi",
                "dict",
                "String to ID vocabulary."
              ],
              [
                "itos",
                "dict",
                "ID to string vocabulary."
              ],
              [
                "block_size",
                "int",
                "Context length."
              ]
            ]
          }
        },
        {
          "title": "Generator example",
          "body": "",
          "code": "from arclm.inference import Generator\n\n# generator = Generator(model, tokenizer.stoi, tokenizer.itos, 8, \"cpu\", tokenizer=tokenizer)\n# print(generator.generate_string(\"Hello\", max_new_tokens=4))",
          "language": "python"
        }
      ],
      "status": "Stable"
    },
    {
      "id": "api-inspection",
      "title": "Inspection API",
      "group": "Reference",
      "href": "api/inspection.html",
      "summary": "Public inspection APIs.",
      "sections": [
        {
          "title": "Overview",
          "body": "Inspection API documents the public ArcLM APIs in this category."
        },
        {
          "title": "inspect_text",
          "body": "Return a PipelineTrace for one native generation step."
        },
        {
          "title": "inspect_text parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Meaning"
            ],
            "rows": [
              [
                "model",
                "ArcLM",
                "Native ArcLM model."
              ],
              [
                "tokenizer",
                "Tokenizer",
                "Native tokenizer."
              ],
              [
                "text",
                "str",
                "Input prompt."
              ]
            ]
          }
        },
        {
          "title": "inspect_text example",
          "body": "",
          "code": "from arclm import inspect_text\nfrom arclm.models import ArcLM\nfrom arclm.tokenizers import Tokenizer\n\ntokenizer = Tokenizer(max_vocab=16)\ntokenizer.build(\"Hello ArcLM\")\nmodel = ArcLM(vocab_size=tokenizer.get_vocab_size(), embed_dim=8, block_size=8, num_blocks=1)\ntrace = inspect_text(model=model, tokenizer=tokenizer, text=\"Hello\")\nprint(trace.to_dict())",
          "language": "python"
        }
      ],
      "status": "Stable"
    },
    {
      "id": "api-peft",
      "title": "PEFT API",
      "group": "Reference",
      "href": "api/peft.html",
      "summary": "Public peft APIs.",
      "sections": [
        {
          "title": "Overview",
          "body": "PEFT API documents the public ArcLM APIs in this category."
        },
        {
          "title": "LoRAConfig",
          "body": "Configuration for native LoRA adapter experiments."
        },
        {
          "title": "LoRAConfig parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Meaning"
            ],
            "rows": [
              [
                "r",
                "int",
                "Adapter rank."
              ],
              [
                "alpha",
                "float",
                "Scaling value."
              ],
              [
                "dropout",
                "float",
                "Adapter dropout."
              ]
            ]
          }
        },
        {
          "title": "LoRAConfig example",
          "body": "",
          "code": "from arclm.peft import LoRAConfig\n\nconfig = LoRAConfig(r=2, alpha=4, dropout=0.0)\nprint(config)",
          "language": "python"
        }
      ],
      "status": "Stable"
    },
    {
      "id": "api-web",
      "title": "Web API",
      "group": "Reference",
      "href": "api/web.html",
      "summary": "Public web APIs.",
      "sections": [
        {
          "title": "Overview",
          "body": "Web API documents the public ArcLM APIs in this category."
        },
        {
          "title": "WebConfig",
          "body": "Configuration for the optional local Web API."
        },
        {
          "title": "WebConfig parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Meaning"
            ],
            "rows": [
              [
                "host",
                "str",
                "Bind host."
              ],
              [
                "port",
                "int",
                "Bind port."
              ],
              [
                "workspace_root",
                "str | Path",
                "Local workspace root."
              ]
            ]
          }
        },
        {
          "title": "WebConfig example",
          "body": "",
          "code": "from arclm.web import WebConfig, create_app\n\nconfig = WebConfig(host=\"127.0.0.1\", port=8765)\napp = create_app(config)",
          "language": "python"
        }
      ],
      "status": "Stable"
    },
    {
      "id": "api-index",
      "title": "Public API Index",
      "group": "Reference",
      "href": "api/index.html",
      "summary": "Searchable public API catalog.",
      "sections": [
        {
          "title": "How to use this page",
          "body": "Use the search field to find public classes, functions and import paths. Deprecated imports are not recommended."
        }
      ],
      "status": "Stable"
    },
    {
      "id": "api-plugins",
      "title": "Plugins API",
      "group": "Reference",
      "href": "api/plugins.html",
      "summary": "Experimental plugin interfaces.",
      "sections": [
        {
          "title": "Status",
          "body": "Plugin interfaces exist for advanced extension metadata. They are not required for the native workflow."
        },
        {
          "title": "Limitations",
          "body": "",
          "items": [
            "No public plugin marketplace built into ArcLM",
            "No automatic remote plugin execution"
          ]
        }
      ],
      "status": "Experimental"
    },
    {
      "id": "api-registry",
      "title": "Registry API",
      "group": "Reference",
      "href": "api/registry.html",
      "summary": "Experimental registry surfaces.",
      "sections": [
        {
          "title": "Status",
          "body": "Registry helpers are advanced extension surfaces. Normal users should prefer canonical imports."
        }
      ],
      "status": "Experimental"
    },
    {
      "id": "api-utilities",
      "title": "Utilities API",
      "group": "Reference",
      "href": "api/utilities.html",
      "summary": "Small utility helpers.",
      "sections": [
        {
          "title": "Status",
          "body": "Utility modules are secondary. Prefer documented domain APIs for normal workflows."
        }
      ],
      "status": "Stable"
    },
    {
      "id": "examples-index",
      "title": "Examples Hub",
      "group": "Examples",
      "href": "examples/index.html",
      "summary": "Self-contained examples.",
      "sections": [
        {
          "title": "How examples work",
          "body": "Each example is embedded in the public site and available as a standalone download inside the site assets."
        },
        {
          "title": "Filters",
          "body": "",
          "items": [
            "Beginner",
            "Intermediate",
            "Advanced",
            "Dataset",
            "Tokenizer",
            "Model",
            "Training",
            "Fine-Tuning",
            "LoRA",
            "Checkpoint",
            "Evaluation",
            "Generation",
            "Inspection",
            "CLI",
            "Studio"
          ]
        }
      ],
      "status": "Stable"
    },
    {
      "id": "examples-datasets",
      "title": "Dataset Examples",
      "group": "Examples",
      "href": "examples/dataset-examples.html",
      "summary": "Self-contained examples.",
      "sections": [
        {
          "title": "How examples work",
          "body": "Each example is embedded in the public site and available as a standalone download inside the site assets."
        },
        {
          "title": "Included examples",
          "body": "",
          "items": [
            "Load Python records",
            "Build a dataset report"
          ]
        }
      ],
      "status": "Stable"
    },
    {
      "id": "examples-tokenizers",
      "title": "Tokenizer Examples",
      "group": "Examples",
      "href": "examples/tokenizer-examples.html",
      "summary": "Self-contained examples.",
      "sections": [
        {
          "title": "How examples work",
          "body": "Each example is embedded in the public site and available as a standalone download inside the site assets."
        },
        {
          "title": "Included examples",
          "body": "",
          "items": [
            "Create and inspect a Word tokenizer",
            "Build a dataset report"
          ]
        }
      ],
      "status": "Stable"
    },
    {
      "id": "examples-models",
      "title": "Model Examples",
      "group": "Examples",
      "href": "examples/model-examples.html",
      "summary": "Self-contained examples.",
      "sections": [
        {
          "title": "How examples work",
          "body": "Each example is embedded in the public site and available as a standalone download inside the site assets."
        },
        {
          "title": "Included examples",
          "body": "",
          "items": [
            "Create a tiny native model",
            "Read the model support matrix"
          ]
        }
      ],
      "status": "Stable"
    },
    {
      "id": "examples-training",
      "title": "Training Examples",
      "group": "Examples",
      "href": "examples/training-examples.html",
      "summary": "Self-contained examples.",
      "sections": [
        {
          "title": "How examples work",
          "body": "Each example is embedded in the public site and available as a standalone download inside the site assets."
        },
        {
          "title": "Included examples",
          "body": "",
          "items": []
        }
      ],
      "status": "Stable"
    },
    {
      "id": "examples-evaluation",
      "title": "Evaluation Examples",
      "group": "Examples",
      "href": "examples/evaluation-examples.html",
      "summary": "Self-contained examples.",
      "sections": [
        {
          "title": "How examples work",
          "body": "Each example is embedded in the public site and available as a standalone download inside the site assets."
        },
        {
          "title": "Included examples",
          "body": "",
          "items": [
            "Create an evaluation report object"
          ]
        }
      ],
      "status": "Stable"
    },
    {
      "id": "examples-generation",
      "title": "Generation Examples",
      "group": "Examples",
      "href": "examples/generation-examples.html",
      "summary": "Self-contained examples.",
      "sections": [
        {
          "title": "How examples work",
          "body": "Each example is embedded in the public site and available as a standalone download inside the site assets."
        },
        {
          "title": "Included examples",
          "body": "",
          "items": [
            "Inspect a native pipeline step"
          ]
        }
      ],
      "status": "Stable"
    },
    {
      "id": "examples-complete",
      "title": "Complete Example Projects",
      "group": "Examples",
      "href": "examples/complete-projects.html",
      "summary": "Small downloadable public projects.",
      "sections": [
        {
          "title": "What complete projects include",
          "body": "Each project explains goal, files, dataset, tokenizer, model configuration, training configuration, expected behavior, evaluation and generation notes."
        },
        {
          "title": "Projects",
          "body": "",
          "items": [
            "Tiny text model",
            "Instruction fine-tuning project",
            "Pipeline inspection project"
          ]
        }
      ],
      "status": "Stable"
    },
    {
      "id": "modules",
      "title": "Module Explorer",
      "group": "Reference",
      "href": "reference/modules.html",
      "summary": "Public-facing package organization.",
      "sections": [
        {
          "title": "Use canonical modules",
          "body": "Prefer arclm.datasets, arclm.tokenizers, arclm.models, arclm.training, arclm.checkpoints, arclm.evaluation, arclm.inference and arclm.inspection for new code."
        }
      ],
      "status": "Stable"
    },
    {
      "id": "supported-models",
      "title": "Supported Models",
      "group": "Reference",
      "href": "reference/supported-models.html",
      "summary": "Editable model catalog with honest status labels.",
      "sections": [
        {
          "title": "Status meanings",
          "body": "Native means implemented directly by ArcLM. Compatible means handled through an optional integration boundary. Experimental means incomplete behavior. Unsupported means no current ArcLM path."
        }
      ],
      "status": "Stable"
    },
    {
      "id": "dataset-formats",
      "title": "Dataset Formats",
      "group": "Reference",
      "href": "reference/dataset-formats.html",
      "summary": "Accepted local dataset shapes and examples.",
      "sections": [
        {
          "title": "Choosing a format",
          "body": "Use Python records for scripts, JSONL for instruction data, CSV for tables and TXT for tiny causal text experiments."
        }
      ],
      "status": "Stable"
    },
    {
      "id": "configuration",
      "title": "Configuration Reference",
      "group": "Reference",
      "href": "reference/configuration.html",
      "summary": "Configuration fields users commonly set.",
      "sections": [
        {
          "title": "Scope",
          "body": "This reference covers public configuration fields for model, training, evaluation, generation and web workflows."
        }
      ],
      "status": "Stable"
    },
    {
      "id": "errors",
      "title": "Errors Reference",
      "group": "Reference",
      "href": "reference/errors.html",
      "summary": "Stable user-facing errors and fixes.",
      "sections": [
        {
          "title": "How to read errors",
          "body": "Use the error code to find the meaning, common cause and recovery action."
        }
      ],
      "status": "Stable"
    },
    {
      "id": "status-legend",
      "title": "Status Legend",
      "group": "Reference",
      "href": "reference/status-legend.html",
      "summary": "Meaning of public status labels.",
      "sections": [
        {
          "title": "Statuses",
          "body": "",
          "table": {
            "columns": [
              "Status",
              "Meaning"
            ],
            "rows": [
              [
                "Stable",
                "Current reliable path."
              ],
              [
                "Beta",
                "Useful but still maturing."
              ],
              [
                "Experimental",
                "Incomplete or environment-specific."
              ],
              [
                "Deprecated",
                "Compatibility only."
              ],
              [
                "Internal",
                "Not stable public API."
              ],
              [
                "Unsupported",
                "No current ArcLM path."
              ]
            ]
          }
        }
      ],
      "status": "Stable"
    },
    {
      "id": "limitations",
      "title": "Limitations",
      "group": "Reference",
      "href": "reference/limitations.html",
      "summary": "What ArcLM does not currently claim.",
      "sections": [
        {
          "title": "Current limits",
          "body": "",
          "items": [
            "No universal Hugging Face support",
            "No production serving",
            "No OpenAI-compatible API",
            "No streaming",
            "No attention maps",
            "No native BERT/T5/diffusion/multimodal models",
            "No RLHF, DPO or GRPO"
          ]
        }
      ],
      "status": "Stable"
    }
  ]
};
