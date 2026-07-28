window.ARCLM_DOCS = {
  "version": "1.13.4",
  "versions": [
    {
      "label": "Current (1.13.4)",
      "href": "index.html",
      "current": true
    },
    {
      "label": "API compatibility 0.10.0",
      "href": "releases/version-history.html",
      "current": false
    },
    {
      "label": "Development strategy",
      "href": "contributing/docs-build.html",
      "current": false
    }
  ],
  "statuses": [
    "Stable",
    "Validated",
    "Beta",
    "Experimental",
    "Integration-compatible",
    "Internal",
    "Deprecated",
    "Planned",
    "Unsupported"
  ],
  "summary": {
    "modules": 18,
    "classes": 284,
    "functions": 201,
    "configuration": 41,
    "errors": 42,
    "deprecated": 20
  },
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
          "code": "from arclm.inspection import inspect_text\n\nprint(inspect_text)",
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
          "code": "from arclm.datasets import validate_records\n\nprint(validate_records)",
          "language": "python"
        },
        {
          "title": "Build a token report",
          "body": "",
          "code": "from arclm.datasets import build_dataset_report\n\nprint(build_dataset_report)",
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
          "code": "from arclm import Tokenizer\n\nprint(Tokenizer)",
          "language": "python"
        },
        {
          "title": "SentencePiece configuration",
          "body": "",
          "code": "from arclm import SentencePieceTokenizer\n\nprint(SentencePieceTokenizer)",
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
          "code": "from arclm.models import ArcLM\n\nprint(ArcLM)",
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
          "code": "from arclm.configs import TrainingConfig\n\nprint(TrainingConfig)",
          "language": "python"
        },
        {
          "title": "Create Trainer",
          "body": "",
          "code": "from arclm import Trainer\n\nprint(Trainer)",
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
          "code": "from arclm.peft import LoRAConfig\n\nprint(LoRAConfig)",
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
          "code": "from arclm.checkpoints import inspect_checkpoint\n\nprint(inspect_checkpoint)",
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
          "code": "from arclm.evaluation import build_evaluation_report\n\nprint(build_evaluation_report)",
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
          "code": "from arclm.inference import Generator\n\nprint(Generator)",
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
          "code": "from arclm.inference import Generator\n\nprint(Generator)",
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
          "code": "from arclm.inspection import inspect_text\n\nprint(inspect_text)",
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
      "id": "guide-pipelines",
      "title": "Pipelines",
      "group": "Learn",
      "href": "guides/pipelines.html",
      "summary": "Compose the verified native lifecycle.",
      "sections": [
        {
          "title": "Lifecycle",
          "body": "ArcLM pipelines are the practical sequence that connects records, tokenizer, model, trainer, checkpoint, evaluator, generator and inspection trace."
        },
        {
          "title": "Native flow",
          "body": "",
          "items": [
            "Dataset validation",
            "Tokenizer build",
            "Model creation",
            "Training",
            "Checkpoint save/load",
            "Evaluation",
            "Generation",
            "Inspection"
          ]
        },
        {
          "title": "Inspect the pipeline",
          "body": "",
          "code": "from arclm.inspection import inspect_text\n\nprint(inspect_text)",
          "language": "python"
        },
        {
          "title": "Limits",
          "body": "",
          "items": [
            "Pipeline helpers are local Python flows, not a production orchestration service.",
            "External model flows remain optional integration boundaries."
          ]
        }
      ],
      "status": "Beta"
    },
    {
      "id": "guide-agents",
      "title": "Agent Runtime",
      "group": "Learn",
      "href": "guides/agent-runtime.html",
      "summary": "Run deterministic provider-independent tool loops.",
      "sections": [
        {
          "title": "Runtime shape",
          "body": "Agent Runtime separates model responses, tool schemas, sessions, traces, permissions and runner stop conditions. The core runtime does not require a hosted provider."
        },
        {
          "title": "Create a tool",
          "body": "",
          "code": "from arclm.agents import Agent, AgentRunner, ModelResponse, ToolCall, tool\n\n@tool\ndef add_numbers(a: int, b: int) -> int:\n    \"\"\"Add two integers.\"\"\"\n    return a + b\n\nclass FakeModel:\n    def __init__(self):\n        self.calls = 0\n    def generate_response(self, *, messages, tools, instructions, session):\n        self.calls += 1\n        if self.calls == 1:\n            return ModelResponse(tool_calls=[ToolCall(id=\"call_1\", name=\"add_numbers\", arguments={\"a\": 2, \"b\": 3})])\n        return ModelResponse(content=\"Done.\")\n\nagent = Agent(name=\"calculator\", instructions=\"Use tools when useful.\", model=FakeModel(), tools=[add_numbers])\nresult = AgentRunner(max_steps=2).run(agent, \"Add 2 and 3.\")\nprint(result.output)",
          "language": "python"
        },
        {
          "title": "Boundaries",
          "body": "",
          "items": [
            "No production autonomy claim",
            "No built-in shell execution",
            "No unrestricted filesystem tools",
            "Provider adapters must return ModelResponse objects"
          ]
        }
      ],
      "status": "Beta"
    },
    {
      "id": "guide-agent-tools",
      "title": "Agent Tools",
      "group": "Learn",
      "href": "guides/agent-tools.html",
      "summary": "Define typed local tools with validation and permissions.",
      "sections": [
        {
          "title": "Tool contract",
          "body": "Tools are typed Python callables wrapped with metadata. Arguments are validated before execution and tool calls are recorded in the session trace."
        },
        {
          "title": "Tool schema",
          "body": "",
          "code": "from arclm.agents import tool\n\n@tool\ndef calculate_total(price: float, quantity: int) -> float:\n    \"\"\"Calculate a total price.\"\"\"\n    return price * quantity\n\nprint(calculate_total.spec.name)",
          "language": "python"
        },
        {
          "title": "Security notes",
          "body": "",
          "items": [
            "Use explicit permissions for side effects.",
            "Keep secrets out of tool outputs.",
            "Prefer bounded workspace paths for document tools."
          ]
        }
      ],
      "status": "Beta"
    },
    {
      "id": "guide-security",
      "title": "Security",
      "group": "Learn",
      "href": "guides/security.html",
      "summary": "Use Security Core for local policies, redaction, hashing, signatures and encryption.",
      "sections": [
        {
          "title": "Security Core",
          "body": "Security Core provides typed policy objects, safe status reports, AEAD encryption envelopes, signed manifests, hashing helpers, redaction and Web/Agent boundary helpers."
        },
        {
          "title": "Encrypt and reject tampering",
          "body": "",
          "code": "import os\nfrom arclm.security import DecryptionError, decrypt_json, encrypt_json\n\nkey = os.urandom(32)\nenvelope = encrypt_json({\"prompt\": \"synthetic\"}, key)\ntampered = envelope.to_dict()\ntampered[\"ciphertext\"] = tampered[\"ciphertext\"][:-2] + \"AA\"\ntry:\n    decrypt_json(tampered, key)\nexcept DecryptionError:\n    print(\"tamper rejected\")",
          "language": "python"
        },
        {
          "title": "Boundaries",
          "body": "",
          "items": [
            "No security certification",
            "No production auth layer",
            "Untrusted pickle loading is blocked by policy unless explicitly treated as legacy trusted input"
          ]
        }
      ],
      "status": "Beta"
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
      "id": "guide-distributions",
      "title": "Distributions",
      "group": "Learn",
      "href": "guides/distributions.html",
      "summary": "Generate smaller standalone ArcLM editions from the canonical source.",
      "sections": [
        {
          "title": "Source of truth",
          "body": "The maintained source remains the canonical ArcLM package source tree. Standalone editions are generated from explicit manifests and should not be hand-copied forks."
        },
        {
          "title": "Editions",
          "body": "",
          "table": {
            "columns": [
              "Edition",
              "Purpose"
            ],
            "rows": [
              [
                "core",
                "Native datasets, tokenizers, models, checkpoints, evaluation, inference and inspection."
              ],
              [
                "simple-interface",
                "Local Flask GPT-style chat interface with model loading, prompt queue, terminal events and optional safe agents."
              ],
              [
                "loading-inference",
                "Model loading, checkpoint loading, generation, inspection and lifecycle helpers without training loops."
              ],
              [
                "data-tokenizers",
                "Dataset validation, reporting, preprocessing and tokenizer utilities."
              ],
              [
                "training",
                "Native model training, checkpoints and evaluation."
              ],
              [
                "finetuning",
                "SFT, adapter and PEFT/LoRA-oriented fine-tuning helpers."
              ],
              [
                "evaluation-benchmarks",
                "Evaluation, benchmark suites and inspection helpers."
              ],
              [
                "agents-tools",
                "Agent runtime, typed tools, safe built-ins and required security boundaries."
              ],
              [
                "security",
                "Security Core policy, redaction, hashing, signing, encryption and safe path/network helpers."
              ]
            ]
          }
        },
        {
          "title": "Build and verify",
          "body": "",
          "code": "python tools/build_arclm_distributions.py list\npython tools/build_arclm_distributions.py inspect simple-interface\npython tools/build_arclm_distributions.py build simple-interface\npython tools/build_arclm_distributions.py verify simple-interface\npython tools/build_arclm_distributions.py test-all\npython tools/build_arclm_distributions.py check-drift",
          "language": "bash"
        },
        {
          "title": "Boundary rules",
          "body": "",
          "items": [
            "Required module-load imports cannot cross excluded manifest boundaries.",
            "Function-scope and TYPE_CHECKING imports are reported as optional lazy edges.",
            "Generated editions include pyproject metadata, docs, examples, manifests and source inventories.",
            "Editions keep the arclm namespace and are meant to be installed independently."
          ]
        },
        {
          "title": "Limitations",
          "body": "",
          "items": [
            "Manifests are curated and require review when public imports change.",
            "Optional lazy edges are reported but not complete runtime proof for every optional dependency path.",
            "Wheel size budgets and clean-environment publishing checks are still manual."
          ]
        }
      ],
      "status": "Beta"
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
      "id": "guide-lab",
      "title": "ArcLM Lab",
      "group": "Learn",
      "href": "guides/lab.html",
      "summary": "Learn ArcLM architecture through four progressive levels.",
      "sections": [
        {
          "title": "Purpose",
          "body": "The Lab teaches ArcLM concepts through learner exercises. It is educational scaffolding, not proof that every topic is a production feature."
        },
        {
          "title": "Levels",
          "body": "",
          "table": {
            "columns": [
              "Level",
              "Focus"
            ],
            "rows": [
              [
                "Beginner",
                "Data, cleaning, validation, vocabulary and tokenization"
              ],
              [
                "Intermediate",
                "Manifests, preprocessing, model configuration, forward pass, training loop and checkpoints"
              ],
              [
                "Advanced",
                "Artifacts, SFT formatting, LoRA boundaries, evaluation, generation and inspection"
              ],
              [
                "Expert",
                "Registries, events, dependency injection, distributed planning, fault tolerance and architecture decisions"
              ]
            ]
          }
        },
        {
          "title": "Run the Lab",
          "body": "",
          "code": "python -m lab.runner list\npython -m lab.runner test-all",
          "language": "bash"
        }
      ],
      "status": "Validated"
    },
    {
      "id": "api-root",
      "title": "Root API",
      "group": "Reference",
      "href": "api/root.html",
      "summary": "Public root APIs.",
      "sections": [
        {
          "title": "Overview",
          "body": "Root API documents the public ArcLM APIs in this category."
        },
        {
          "title": "Accuracy",
          "body": "Berekent accuracy voor classificatie of token logits. Canonical import: from arclm import Accuracy. Fully qualified name: arclm.Accuracy. Status: Stable."
        },
        {
          "title": "Accuracy parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "ignore_index",
                "int",
                "-100"
              ]
            ]
          }
        },
        {
          "title": "Accuracy example",
          "body": "",
          "code": "from arclm import Accuracy\n\nprint(Accuracy)",
          "language": "python"
        },
        {
          "title": "AdaptedModelBundle",
          "body": "ArcLM model and metadata produced from a normalized checkpoint. Canonical import: from arclm import AdaptedModelBundle. Fully qualified name: arclm.AdaptedModelBundle. Status: Stable."
        },
        {
          "title": "AdaptedModelBundle parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "model",
                "Module",
                "required"
              ],
              [
                "config",
                "Any",
                "required"
              ],
              [
                "checkpoint",
                "LoadedCheckpoint",
                "required"
              ],
              [
                "missing_keys",
                "list",
                "required"
              ],
              [
                "unexpected_keys",
                "list",
                "required"
              ],
              [
                "tokenizer_metadata",
                "Dict",
                "<factory>"
              ]
            ]
          }
        },
        {
          "title": "AdaptedModelBundle example",
          "body": "",
          "code": "from arclm import AdaptedModelBundle\n\nprint(AdaptedModelBundle)",
          "language": "python"
        },
        {
          "title": "And",
          "body": "Logische AND met een of meer conjuncties. Canonical import: from arclm import And. Fully qualified name: arclm.And. Status: Stable."
        },
        {
          "title": "And parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "conjuncts",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "And example",
          "body": "",
          "code": "from arclm import And\n\nprint(And)",
          "language": "python"
        },
        {
          "title": "ArcLM",
          "body": "Compact causal language model for next-token prediction. Canonical import: from arclm import ArcLM. Fully qualified name: arclm.ArcLM. Status: Stable."
        },
        {
          "title": "ArcLM parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "vocab_size",
                "Any",
                "required"
              ],
              [
                "embed_dim",
                "Any",
                "64"
              ],
              [
                "block_size",
                "Any",
                "8"
              ],
              [
                "num_blocks",
                "Any",
                "2"
              ],
              [
                "dropout",
                "Any",
                "0.0"
              ]
            ]
          }
        },
        {
          "title": "ArcLM example",
          "body": "",
          "code": "from arclm import ArcLM\n\nprint(ArcLM)",
          "language": "python"
        },
        {
          "title": "AutoModel",
          "body": "Factory for ArcLM model classes supported by the current package. Canonical import: from arclm import AutoModel. Fully qualified name: arclm.AutoModel. Status: Stable."
        },
        {
          "title": "AutoModel parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "AutoModel example",
          "body": "",
          "code": "from arclm import AutoModel\n\nprint(AutoModel)",
          "language": "python"
        },
        {
          "title": "AutoTokenizer",
          "body": "Maakt ondersteunde ArcLM tokenizers vanuit config of type-naam. Canonical import: from arclm import AutoTokenizer. Fully qualified name: arclm.AutoTokenizer. Status: Stable."
        },
        {
          "title": "AutoTokenizer parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "AutoTokenizer example",
          "body": "",
          "code": "from arclm import AutoTokenizer\n\nprint(AutoTokenizer)",
          "language": "python"
        },
        {
          "title": "BaseAugmenter",
          "body": "Basis class voor eigen data augmenters. Canonical import: from arclm import BaseAugmenter. Fully qualified name: arclm.BaseAugmenter. Status: Stable."
        },
        {
          "title": "BaseAugmenter parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "BaseAugmenter example",
          "body": "",
          "code": "from arclm import BaseAugmenter\n\nprint(BaseAugmenter)",
          "language": "python"
        },
        {
          "title": "BaseCallback",
          "body": "Basis class voor eigen training callbacks. Canonical import: from arclm import BaseCallback. Fully qualified name: arclm.BaseCallback. Status: Stable."
        },
        {
          "title": "BaseCallback parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "BaseCallback example",
          "body": "",
          "code": "from arclm import BaseCallback\n\nprint(BaseCallback)",
          "language": "python"
        },
        {
          "title": "BaseCleaner",
          "body": "Basis class voor eigen data cleaners. Canonical import: from arclm import BaseCleaner. Fully qualified name: arclm.BaseCleaner. Status: Stable."
        },
        {
          "title": "BaseCleaner parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "BaseCleaner example",
          "body": "",
          "code": "from arclm import BaseCleaner\n\nprint(BaseCleaner)",
          "language": "python"
        },
        {
          "title": "BaseDataset",
          "body": "Basis class voor datasets met lengte en index-toegang. Canonical import: from arclm import BaseDataset. Fully qualified name: arclm.BaseDataset. Status: Stable."
        },
        {
          "title": "BaseDataset parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "BaseDataset example",
          "body": "",
          "code": "from arclm import BaseDataset\n\nprint(BaseDataset)",
          "language": "python"
        },
        {
          "title": "BaseDataStep",
          "body": "Basis class voor een stap die een voorbeeld verwerkt. Canonical import: from arclm import BaseDataStep. Fully qualified name: arclm.BaseDataStep. Status: Stable."
        },
        {
          "title": "BaseDataStep parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "BaseDataStep example",
          "body": "",
          "code": "from arclm import BaseDataStep\n\nprint(BaseDataStep)",
          "language": "python"
        },
        {
          "title": "BaseDeduplicator",
          "body": "Basis class voor deduplicatie over een hele dataset. Canonical import: from arclm import BaseDeduplicator. Fully qualified name: arclm.BaseDeduplicator. Status: Stable."
        },
        {
          "title": "BaseDeduplicator parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "BaseDeduplicator example",
          "body": "",
          "code": "from arclm import BaseDeduplicator\n\nprint(BaseDeduplicator)",
          "language": "python"
        },
        {
          "title": "BaseEvaluationCallback",
          "body": "Basis class voor eigen evaluation callbacks. Canonical import: from arclm import BaseEvaluationCallback. Fully qualified name: arclm.BaseEvaluationCallback. Status: Stable."
        },
        {
          "title": "BaseEvaluationCallback parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "BaseEvaluationCallback example",
          "body": "",
          "code": "from arclm import BaseEvaluationCallback\n\nprint(BaseEvaluationCallback)",
          "language": "python"
        },
        {
          "title": "BaseEvaluator",
          "body": "Basis class voor eigen evaluators. Canonical import: from arclm import BaseEvaluator. Fully qualified name: arclm.BaseEvaluator. Status: Stable."
        },
        {
          "title": "BaseEvaluator parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "BaseEvaluator example",
          "body": "",
          "code": "from arclm import BaseEvaluator\n\nprint(BaseEvaluator)",
          "language": "python"
        },
        {
          "title": "BaseFineTuner",
          "body": "Basis class voor developers die een eigen fine-tuner willen maken. Canonical import: from arclm import BaseFineTuner. Fully qualified name: arclm.BaseFineTuner. Status: Stable."
        },
        {
          "title": "BaseFineTuner parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "BaseFineTuner example",
          "body": "",
          "code": "from arclm import BaseFineTuner\n\nprint(BaseFineTuner)",
          "language": "python"
        },
        {
          "title": "BaseMetric",
          "body": "Basis class voor developers die een eigen metric willen maken. Canonical import: from arclm import BaseMetric. Fully qualified name: arclm.BaseMetric. Status: Stable."
        },
        {
          "title": "BaseMetric parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "BaseMetric example",
          "body": "",
          "code": "from arclm import BaseMetric\n\nprint(BaseMetric)",
          "language": "python"
        },
        {
          "title": "BaseModelAdapter",
          "body": "Basis class voor adapters tussen twee model implementaties. Canonical import: from arclm import BaseModelAdapter. Fully qualified name: arclm.BaseModelAdapter. Status: Stable."
        },
        {
          "title": "BaseModelAdapter parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "BaseModelAdapter example",
          "body": "",
          "code": "from arclm import BaseModelAdapter\n\nprint(BaseModelAdapter)",
          "language": "python"
        },
        {
          "title": "BaseModelLoader",
          "body": "Basis class voor model loaders die een model en metadata geven. Canonical import: from arclm import BaseModelLoader. Fully qualified name: arclm.BaseModelLoader. Status: Stable."
        },
        {
          "title": "BaseModelLoader parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "BaseModelLoader example",
          "body": "",
          "code": "from arclm import BaseModelLoader\n\nprint(BaseModelLoader)",
          "language": "python"
        },
        {
          "title": "BaseStreamingDataset",
          "body": "Basis class voor datasets die je alleen kunt doorlopen. Canonical import: from arclm import BaseStreamingDataset. Fully qualified name: arclm.BaseStreamingDataset. Status: Stable."
        },
        {
          "title": "BaseStreamingDataset parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "BaseStreamingDataset example",
          "body": "",
          "code": "from arclm import BaseStreamingDataset\n\nprint(BaseStreamingDataset)",
          "language": "python"
        },
        {
          "title": "BaseSyntheticDataGenerator",
          "body": "Basis class voor eigen synthetic-data generators. Canonical import: from arclm import BaseSyntheticDataGenerator. Fully qualified name: arclm.BaseSyntheticDataGenerator. Status: Stable."
        },
        {
          "title": "BaseSyntheticDataGenerator parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "BaseSyntheticDataGenerator example",
          "body": "",
          "code": "from arclm import BaseSyntheticDataGenerator\n\nprint(BaseSyntheticDataGenerator)",
          "language": "python"
        },
        {
          "title": "BaseTrainer",
          "body": "Basis class voor developers die een eigen trainer willen maken. Canonical import: from arclm import BaseTrainer. Fully qualified name: arclm.BaseTrainer. Status: Stable."
        },
        {
          "title": "BaseTrainer parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "BaseTrainer example",
          "body": "",
          "code": "from arclm import BaseTrainer\n\nprint(BaseTrainer)",
          "language": "python"
        },
        {
          "title": "BaseTrainingPipeline",
          "body": "Basis class voor aanpasbare training pipelines. Canonical import: from arclm import BaseTrainingPipeline. Fully qualified name: arclm.BaseTrainingPipeline. Status: Stable."
        },
        {
          "title": "BaseTrainingPipeline parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "BaseTrainingPipeline example",
          "body": "",
          "code": "from arclm import BaseTrainingPipeline\n\nprint(BaseTrainingPipeline)",
          "language": "python"
        },
        {
          "title": "Biconditional",
          "body": "Logische zin die waar is als beide kanten gelijk zijn. Canonical import: from arclm import Biconditional. Fully qualified name: arclm.Biconditional. Status: Stable."
        },
        {
          "title": "Biconditional parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "left",
                "Any",
                "required"
              ],
              [
                "right",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "Biconditional example",
          "body": "",
          "code": "from arclm import Biconditional\n\nprint(Biconditional)",
          "language": "python"
        },
        {
          "title": "ConceptBenchmarkCase",
          "body": "Expected concept relationships for a prompt. Canonical import: from arclm import ConceptBenchmarkCase. Fully qualified name: arclm.ConceptBenchmarkCase. Status: Stable."
        },
        {
          "title": "ConceptBenchmarkCase parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "prompt",
                "str",
                "required"
              ],
              [
                "expected_concepts",
                "list",
                "required"
              ]
            ]
          }
        },
        {
          "title": "ConceptBenchmarkCase example",
          "body": "",
          "code": "from arclm import ConceptBenchmarkCase\n\nprint(ConceptBenchmarkCase)",
          "language": "python"
        },
        {
          "title": "ConceptBenchmarkResult",
          "body": "Concept benchmark score for one prompt. Canonical import: from arclm import ConceptBenchmarkResult. Fully qualified name: arclm.ConceptBenchmarkResult. Status: Stable."
        },
        {
          "title": "ConceptBenchmarkResult parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "prompt",
                "str",
                "required"
              ],
              [
                "expected_concepts",
                "list",
                "required"
              ],
              [
                "predicted_tokens",
                "list",
                "required"
              ],
              [
                "matched_concepts",
                "list",
                "required"
              ],
              [
                "score",
                "float",
                "required"
              ]
            ]
          }
        },
        {
          "title": "ConceptBenchmarkResult example",
          "body": "",
          "code": "from arclm import ConceptBenchmarkResult\n\nprint(ConceptBenchmarkResult)",
          "language": "python"
        },
        {
          "title": "Config",
          "body": "Houdt alle belangrijke ArcLM instellingen bij. Canonical import: from arclm import Config. Fully qualified name: arclm.Config. Status: Stable."
        },
        {
          "title": "Config parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "kwargs",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "Config example",
          "body": "",
          "code": "from arclm import Config\n\nprint(Config)",
          "language": "python"
        },
        {
          "title": "DataBundle",
          "body": "Bundel met tokens, tokenizer en loaders voor training. Canonical import: from arclm import DataBundle. Fully qualified name: arclm.DataBundle. Status: Stable."
        },
        {
          "title": "DataBundle parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "tokens",
                "list",
                "required"
              ],
              [
                "train_tokens",
                "list",
                "required"
              ],
              [
                "val_tokens",
                "list",
                "required"
              ],
              [
                "tokenizer",
                "Tokenizer | SentencePieceTokenizer | None",
                "required"
              ],
              [
                "train_loader",
                "object",
                "required"
              ],
              [
                "val_loader",
                "object",
                "required"
              ],
              [
                "train_encoded",
                "list",
                "required"
              ],
              [
                "val_encoded",
                "list",
                "required"
              ]
            ]
          }
        },
        {
          "title": "DataBundle example",
          "body": "",
          "code": "from arclm import DataBundle\n\nprint(DataBundle)",
          "language": "python"
        },
        {
          "title": "DataPipeline",
          "body": "Voert meerdere data-stappen na elkaar uit. Canonical import: from arclm import DataPipeline. Fully qualified name: arclm.DataPipeline. Status: Stable."
        },
        {
          "title": "DataPipeline parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "steps",
                "Iterable[Any] | None",
                "None"
              ],
              [
                "progress_callback",
                "Any",
                "None"
              ]
            ]
          }
        },
        {
          "title": "DataPipeline example",
          "body": "",
          "code": "from arclm import DataPipeline\n\nprint(DataPipeline)",
          "language": "python"
        },
        {
          "title": "DataProcessor",
          "body": "Compatibility-friendly entry point for ``ProcessedDataset`` workflows. Canonical import: from arclm import DataProcessor. Fully qualified name: arclm.DataProcessor. Status: Stable."
        },
        {
          "title": "DataProcessor parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "DataProcessor example",
          "body": "",
          "code": "from arclm import DataProcessor\n\nprint(DataProcessor)",
          "language": "python"
        },
        {
          "title": "DatasetConfig",
          "body": "Configuratie voor `load_dataset` wanneer je opties wilt hergebruiken. Canonical import: from arclm import DatasetConfig. Fully qualified name: arclm.DatasetConfig. Status: Stable."
        },
        {
          "title": "DatasetConfig parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "source",
                "Any",
                "required"
              ],
              [
                "format",
                "str | None",
                "None"
              ],
              [
                "text_field",
                "str",
                "'text'"
              ],
              [
                "required_fields",
                "list[str]",
                "<factory>"
              ],
              [
                "encoding",
                "str",
                "'utf-8'"
              ],
              [
                "streaming",
                "bool",
                "False"
              ]
            ]
          }
        },
        {
          "title": "DatasetConfig example",
          "body": "",
          "code": "from arclm import DatasetConfig\n\nprint(DatasetConfig)",
          "language": "python"
        },
        {
          "title": "DatasetLoader",
          "body": "Laadt datasets uit simpele lokale bronnen. Canonical import: from arclm import DatasetLoader. Fully qualified name: arclm.DatasetLoader. Status: Stable."
        },
        {
          "title": "DatasetLoader parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "config",
                "Any",
                "None"
              ],
              [
                "text_field",
                "str",
                "'text'"
              ],
              [
                "required_fields",
                "Iterable[str] | None",
                "None"
              ],
              [
                "encoding",
                "str",
                "'utf-8'"
              ],
              [
                "format",
                "str | None",
                "None"
              ],
              [
                "streaming",
                "bool",
                "False"
              ]
            ]
          }
        },
        {
          "title": "DatasetLoader example",
          "body": "",
          "code": "from arclm import DatasetLoader\n\nprint(DatasetLoader)",
          "language": "python"
        },
        {
          "title": "DatasetManifest",
          "body": "Lightweight provenance metadata for a processed dataset. Canonical import: from arclm import DatasetManifest. Fully qualified name: arclm.DatasetManifest. Status: Stable."
        },
        {
          "title": "DatasetManifest parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "dataset_name",
                "str",
                "required"
              ],
              [
                "manifest_version",
                "int",
                "required"
              ],
              [
                "source_type",
                "str",
                "required"
              ],
              [
                "source_files",
                "tuple[str, ...]",
                "required"
              ],
              [
                "record_count_before_processing",
                "int",
                "required"
              ],
              [
                "record_count_after_processing",
                "int",
                "required"
              ],
              [
                "invalid_records",
                "int",
                "required"
              ],
              [
                "duplicates_removed",
                "int",
                "required"
              ],
              [
                "text_fields",
                "tuple[str, ...]",
                "required"
              ],
              [
                "transformations_applied",
                "tuple[str, ...]",
                "required"
              ],
              [
                "split_information",
                "dict[str, int]",
                "required"
              ],
              [
                "created_at",
                "float",
                "required"
              ],
              [
                "arclm_version",
                "str",
                "required"
              ]
            ]
          }
        },
        {
          "title": "DatasetManifest example",
          "body": "",
          "code": "from arclm import DatasetManifest\n\nprint(DatasetManifest)",
          "language": "python"
        },
        {
          "title": "DatasetReport",
          "body": "A compact processed-dataset and tokenization report. Canonical import: from arclm import DatasetReport. Fully qualified name: arclm.DatasetReport. Status: Stable."
        },
        {
          "title": "DatasetReport parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "record_count",
                "int",
                "required"
              ],
              [
                "valid_records",
                "int",
                "required"
              ],
              [
                "invalid_records",
                "int",
                "required"
              ],
              [
                "duplicates_removed",
                "int",
                "required"
              ],
              [
                "empty_records_removed",
                "int",
                "required"
              ],
              [
                "train_size",
                "int | None",
                "required"
              ],
              [
                "validation_size",
                "int | None",
                "required"
              ],
              [
                "min_text_length",
                "int",
                "required"
              ],
              [
                "max_text_length",
                "int",
                "required"
              ],
              [
                "average_text_length",
                "float",
                "required"
              ],
              [
                "token_count",
                "int",
                "required"
              ],
              [
                "min_token_length",
                "int",
                "required"
              ],
              [
                "max_token_length",
                "int",
                "required"
              ],
              [
                "average_token_length",
                "float",
                "required"
              ],
              [
                "unknown_token_count",
                "int | None",
                "required"
              ],
              [
                "unknown_token_rate",
                "float | None",
                "required"
              ],
              [
                "truncated_record_count",
                "int",
                "required"
              ],
              [
                "manifest",
                "dict[str, Any] | None",
                "None"
              ]
            ]
          }
        },
        {
          "title": "DatasetReport example",
          "body": "",
          "code": "from arclm import DatasetReport\n\nprint(DatasetReport)",
          "language": "python"
        },
        {
          "title": "DatasetValidationIssue",
          "body": "One validation problem tied to a record index and field. Canonical import: from arclm import DatasetValidationIssue. Fully qualified name: arclm.DatasetValidationIssue. Status: Stable."
        },
        {
          "title": "DatasetValidationIssue parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "index",
                "int",
                "required"
              ],
              [
                "field",
                "str | None",
                "required"
              ],
              [
                "code",
                "str",
                "required"
              ],
              [
                "message",
                "str",
                "required"
              ],
              [
                "record_id",
                "str | None",
                "None"
              ]
            ]
          }
        },
        {
          "title": "DatasetValidationIssue example",
          "body": "",
          "code": "from arclm import DatasetValidationIssue\n\nprint(DatasetValidationIssue)",
          "language": "python"
        },
        {
          "title": "DatasetValidationResult",
          "body": "Result of validating records against a small field schema. Canonical import: from arclm import DatasetValidationResult. Fully qualified name: arclm.DatasetValidationResult. Status: Stable."
        },
        {
          "title": "DatasetValidationResult parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "valid_records",
                "list[dict[str, Any]]",
                "required"
              ],
              [
                "issues",
                "list[DatasetValidationIssue]",
                "required"
              ],
              [
                "total_records",
                "int",
                "required"
              ]
            ]
          }
        },
        {
          "title": "DatasetValidationResult example",
          "body": "",
          "code": "from arclm import DatasetValidationResult\n\nprint(DatasetValidationResult)",
          "language": "python"
        },
        {
          "title": "DeduplicationResult",
          "body": "Resultaat van een deduplicatie stap. Canonical import: from arclm import DeduplicationResult. Fully qualified name: arclm.DeduplicationResult. Status: Stable."
        },
        {
          "title": "DeduplicationResult parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "dataset",
                "list[dict[str, Any]]",
                "required"
              ],
              [
                "kept",
                "int",
                "required"
              ],
              [
                "removed",
                "int",
                "required"
              ],
              [
                "duplicate_keys",
                "list[Any]",
                "<factory>"
              ]
            ]
          }
        },
        {
          "title": "DeduplicationResult example",
          "body": "",
          "code": "from arclm import DeduplicationResult\n\nprint(DeduplicationResult)",
          "language": "python"
        },
        {
          "title": "EarlyStopping",
          "body": "Early stopping to prevent overfitting Canonical import: from arclm import EarlyStopping. Fully qualified name: arclm.EarlyStopping. Status: Stable."
        },
        {
          "title": "EarlyStopping parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "patience",
                "Any",
                "10"
              ],
              [
                "min_delta",
                "Any",
                "0.0001"
              ]
            ]
          }
        },
        {
          "title": "EarlyStopping example",
          "body": "",
          "code": "from arclm import EarlyStopping\n\nprint(EarlyStopping)",
          "language": "python"
        },
        {
          "title": "EntailmentResult",
          "body": "Resultaat van een vraag aan een knowledge base. Canonical import: from arclm import EntailmentResult. Fully qualified name: arclm.EntailmentResult. Status: Stable."
        },
        {
          "title": "EntailmentResult parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "query",
                "str",
                "required"
              ],
              [
                "answer",
                "bool",
                "required"
              ],
              [
                "symbols",
                "list",
                "required"
              ],
              [
                "knowledge",
                "str",
                "required"
              ],
              [
                "consistent",
                "bool",
                "True"
              ]
            ]
          }
        },
        {
          "title": "EntailmentResult example",
          "body": "",
          "code": "from arclm import EntailmentResult\n\nprint(EntailmentResult)",
          "language": "python"
        },
        {
          "title": "EvaluationConfig",
          "body": "Bewaart instellingen voor een evaluatierun. Canonical import: from arclm import EvaluationConfig. Fully qualified name: arclm.EvaluationConfig. Status: Stable."
        },
        {
          "title": "EvaluationConfig parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "batch_size",
                "int",
                "8"
              ],
              [
                "device",
                "str",
                "'cpu'"
              ],
              [
                "max_batches",
                "int | None",
                "None"
              ],
              [
                "ignore_index",
                "int",
                "-100"
              ],
              [
                "return_predictions",
                "bool",
                "False"
              ],
              [
                "prediction_key",
                "str",
                "'logits'"
              ],
              [
                "label_key",
                "str",
                "'labels'"
              ]
            ]
          }
        },
        {
          "title": "EvaluationConfig example",
          "body": "",
          "code": "from arclm import EvaluationConfig\n\nprint(EvaluationConfig)",
          "language": "python"
        },
        {
          "title": "EvaluationReport",
          "body": "Structured, JSON-safe summary of an evaluation run. Canonical import: from arclm import EvaluationReport. Fully qualified name: arclm.EvaluationReport. Status: Stable."
        },
        {
          "title": "EvaluationReport parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "metrics",
                "dict[str, float | int | str | None]",
                "required"
              ],
              [
                "num_examples",
                "int",
                "required"
              ],
              [
                "num_batches",
                "int",
                "required"
              ],
              [
                "num_tokens",
                "int | None",
                "required"
              ],
              [
                "model_identity",
                "str | None",
                "required"
              ],
              [
                "checkpoint_identity",
                "str | None",
                "required"
              ],
              [
                "dataset_identity",
                "str | None",
                "required"
              ],
              [
                "evaluation_timestamp",
                "float",
                "required"
              ],
              [
                "device",
                "str | None",
                "required"
              ],
              [
                "dtype",
                "str | None",
                "required"
              ],
              [
                "warnings",
                "tuple[str, ...]",
                "()"
              ]
            ]
          }
        },
        {
          "title": "EvaluationReport example",
          "body": "",
          "code": "from arclm import EvaluationReport\n\nprint(EvaluationReport)",
          "language": "python"
        },
        {
          "title": "EvaluationResult",
          "body": "Bewaart de uitkomst van een evaluatierun. Canonical import: from arclm import EvaluationResult. Fully qualified name: arclm.EvaluationResult. Status: Stable."
        },
        {
          "title": "EvaluationResult parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "metrics",
                "dict[str, float | None]",
                "required"
              ],
              [
                "num_examples",
                "int",
                "required"
              ],
              [
                "num_batches",
                "int",
                "required"
              ],
              [
                "predictions",
                "list[Any] | None",
                "None"
              ],
              [
                "labels",
                "list[Any] | None",
                "None"
              ],
              [
                "metadata",
                "dict[str, Any]",
                "<factory>"
              ]
            ]
          }
        },
        {
          "title": "EvaluationResult example",
          "body": "",
          "code": "from arclm import EvaluationResult\n\nprint(EvaluationResult)",
          "language": "python"
        },
        {
          "title": "Evaluator",
          "body": "Voert evaluatie uit op een model en dataset. Canonical import: from arclm import Evaluator. Fully qualified name: arclm.Evaluator. Status: Stable."
        },
        {
          "title": "Evaluator parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "model",
                "Any",
                "required"
              ],
              [
                "dataset",
                "Any",
                "None"
              ],
              [
                "metrics",
                "list[BaseMetric] | None",
                "None"
              ],
              [
                "config",
                "EvaluationConfig | None",
                "None"
              ],
              [
                "dataloader",
                "Any",
                "None"
              ],
              [
                "callbacks",
                "list[BaseEvaluationCallback] | None",
                "None"
              ],
              [
                "collate_fn",
                "Any",
                "None"
              ],
              [
                "loss_fn",
                "Any",
                "None"
              ]
            ]
          }
        },
        {
          "title": "Evaluator example",
          "body": "",
          "code": "from arclm import Evaluator\n\nprint(Evaluator)",
          "language": "python"
        },
        {
          "title": "ExactDeduplicator",
          "body": "Verwijdert voorbeelden met dezelfde waarde in gekozen velden. Canonical import: from arclm import ExactDeduplicator. Fully qualified name: arclm.ExactDeduplicator. Status: Stable."
        },
        {
          "title": "ExactDeduplicator parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "field",
                "str | None",
                "None"
              ],
              [
                "fields",
                "list[str] | tuple[str, ...] | None",
                "None"
              ],
              [
                "normalize",
                "bool",
                "False"
              ],
              [
                "keep",
                "str",
                "'first'"
              ],
              [
                "hash_algorithm",
                "str | None",
                "None"
              ],
              [
                "missing",
                "str",
                "'keep'"
              ]
            ]
          }
        },
        {
          "title": "ExactDeduplicator example",
          "body": "",
          "code": "from arclm import ExactDeduplicator\n\nprint(ExactDeduplicator)",
          "language": "python"
        },
        {
          "title": "ExternalLoadedModel",
          "body": "Loaded model wrapper with a unified inference and save API. Canonical import: from arclm import ExternalLoadedModel. Fully qualified name: arclm.ExternalLoadedModel. Status: Stable."
        },
        {
          "title": "ExternalLoadedModel parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "model",
                "Any",
                "required"
              ],
              [
                "tokenizer",
                "Any",
                "required"
              ],
              [
                "config",
                "ExternalModelConfig",
                "required"
              ],
              [
                "source_info",
                "ModelSourceInfo",
                "required"
              ],
              [
                "device",
                "Any",
                "required"
              ],
              [
                "processor",
                "Any",
                "None"
              ],
              [
                "_native_loaded",
                "Optional[LoadedModel]",
                "None"
              ],
              [
                "_generation_error",
                "Optional[str]",
                "None"
              ],
              [
                "_training_method",
                "Optional[str]",
                "None"
              ],
              [
                "_lora_merged",
                "bool",
                "False"
              ]
            ]
          }
        },
        {
          "title": "ExternalLoadedModel example",
          "body": "",
          "code": "from arclm import ExternalLoadedModel\n\nprint(ExternalLoadedModel)",
          "language": "python"
        },
        {
          "title": "ExternalModelConfig",
          "body": "Configuration for loading native or external causal language models. Canonical import: from arclm import ExternalModelConfig. Fully qualified name: arclm.ExternalModelConfig. Status: Stable."
        },
        {
          "title": "ExternalModelConfig parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "source",
                "PathLike",
                "required"
              ],
              [
                "base_model",
                "Optional[str]",
                "None"
              ],
              [
                "device",
                "Optional[str]",
                "None"
              ],
              [
                "device_map",
                "Optional[Any]",
                "None"
              ],
              [
                "dtype",
                "Optional[Union[str, torch.dtype]]",
                "'auto'"
              ],
              [
                "trust_remote_code",
                "bool",
                "False"
              ],
              [
                "tokenizer_path",
                "Optional[PathLike]",
                "None"
              ],
              [
                "max_memory",
                "Optional[Any]",
                "None"
              ],
              [
                "load_in_8bit",
                "bool",
                "False"
              ],
              [
                "load_in_4bit",
                "bool",
                "False"
              ],
              [
                "enable_thinking",
                "Optional[bool]",
                "False"
              ],
              [
                "default_system_prompt",
                "Optional[str]",
                "None"
              ],
              [
                "fallback_to_simple_prompt",
                "bool",
                "True"
              ],
              [
                "fallback_to_cpu",
                "bool",
                "True"
              ],
              [
                "require_tokenizer",
                "bool",
                "True"
              ],
              [
                "prefer_best_native",
                "bool",
                "True"
              ],
              [
                "generation_config",
                "GenerationConfig",
                "<factory>"
              ],
              [
                "save_config",
                "ModelSaveConfig",
                "<factory>"
              ]
            ]
          }
        },
        {
          "title": "ExternalModelConfig example",
          "body": "",
          "code": "from arclm import ExternalModelConfig\n\nprint(ExternalModelConfig)",
          "language": "python"
        },
        {
          "title": "FullFineTuner",
          "body": "Traint alle trainbare modelparameters met de Training Core. Canonical import: from arclm import FullFineTuner. Fully qualified name: arclm.FullFineTuner. Status: Stable."
        },
        {
          "title": "FullFineTuner parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "model",
                "Any",
                "required"
              ],
              [
                "tokenizer",
                "Any",
                "None"
              ],
              [
                "train_dataset",
                "Any",
                "None"
              ],
              [
                "config",
                "SFTConfig | None",
                "None"
              ],
              [
                "validation_dataset",
                "Any",
                "None"
              ],
              [
                "model_adapter",
                "Any",
                "None"
              ],
              [
                "tokenizer_adapter",
                "Any",
                "None"
              ],
              [
                "optimizer",
                "Any",
                "None"
              ],
              [
                "scheduler",
                "Any",
                "None"
              ],
              [
                "callbacks",
                "Any",
                "None"
              ],
              [
                "collate_fn",
                "Any",
                "None"
              ]
            ]
          }
        },
        {
          "title": "FullFineTuner example",
          "body": "",
          "code": "from arclm import FullFineTuner\n\nprint(FullFineTuner)",
          "language": "python"
        },
        {
          "title": "GeneralizationMonitor",
          "body": "Monitor model generalization during training Traceert training vs validation loss om overfitting te detecteren Canonical import: from arclm import GeneralizationMonitor. Fully qualified name: arclm.GeneralizationMonitor. Status: Stable."
        },
        {
          "title": "GeneralizationMonitor parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "GeneralizationMonitor example",
          "body": "",
          "code": "from arclm import GeneralizationMonitor\n\nprint(GeneralizationMonitor)",
          "language": "python"
        },
        {
          "title": "GenerationConfig",
          "body": "Text generation defaults used by :class:`ExternalLoadedModel`. Canonical import: from arclm import GenerationConfig. Fully qualified name: arclm.GenerationConfig. Status: Stable."
        },
        {
          "title": "GenerationConfig parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "max_new_tokens",
                "int",
                "128"
              ],
              [
                "temperature",
                "float",
                "0.7"
              ],
              [
                "top_p",
                "Optional[float]",
                "0.9"
              ],
              [
                "top_k",
                "Optional[int]",
                "None"
              ],
              [
                "do_sample",
                "Optional[bool]",
                "None"
              ],
              [
                "repetition_penalty",
                "float",
                "1.0"
              ],
              [
                "pad_token_id",
                "Optional[int]",
                "None"
              ],
              [
                "eos_token_id",
                "Optional[Union[int, Sequence[int]]]",
                "None"
              ],
              [
                "stop",
                "List[str]",
                "<factory>"
              ],
              [
                "return_full_text",
                "bool",
                "False"
              ]
            ]
          }
        },
        {
          "title": "GenerationConfig example",
          "body": "",
          "code": "from arclm import GenerationConfig\n\nprint(GenerationConfig)",
          "language": "python"
        },
        {
          "title": "Generator",
          "body": "Generate tokens from a trained native causal language model. Canonical import: from arclm import Generator. Fully qualified name: arclm.Generator. Status: Stable."
        },
        {
          "title": "Generator parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "model",
                "Any",
                "required"
              ],
              [
                "stoi",
                "Any",
                "required"
              ],
              [
                "itos",
                "Any",
                "required"
              ],
              [
                "block_size",
                "Any",
                "required"
              ],
              [
                "device",
                "Any",
                "required"
              ],
              [
                "tokenizer",
                "Any",
                "None"
              ]
            ]
          }
        },
        {
          "title": "Generator example",
          "body": "",
          "code": "from arclm import Generator\n\nprint(Generator)",
          "language": "python"
        },
        {
          "title": "Implication",
          "body": "Logische zin van de vorm als A dan B. Canonical import: from arclm import Implication. Fully qualified name: arclm.Implication. Status: Stable."
        },
        {
          "title": "Implication parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "antecedent",
                "Any",
                "required"
              ],
              [
                "consequent",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "Implication example",
          "body": "",
          "code": "from arclm import Implication\n\nprint(Implication)",
          "language": "python"
        },
        {
          "title": "InstructionDataset",
          "body": "Dataset voor instruction tuning met loss alleen op response tokens. Canonical import: from arclm import InstructionDataset. Fully qualified name: arclm.InstructionDataset. Status: Stable."
        },
        {
          "title": "InstructionDataset parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "instructions",
                "Any",
                "required"
              ],
              [
                "responses",
                "Any",
                "required"
              ],
              [
                "tokenizer",
                "Any",
                "required"
              ],
              [
                "block_size",
                "Any",
                "required"
              ],
              [
                "instruction_prefix",
                "Any",
                "'<|instruction|>'"
              ],
              [
                "response_prefix",
                "Any",
                "'<|response|>'"
              ]
            ]
          }
        },
        {
          "title": "InstructionDataset example",
          "body": "",
          "code": "from arclm import InstructionDataset\n\nprint(InstructionDataset)",
          "language": "python"
        },
        {
          "title": "KnowledgeBase",
          "body": "Bewaart logische regels en beantwoordt simpele vragen. Canonical import: from arclm import KnowledgeBase. Fully qualified name: arclm.KnowledgeBase. Status: Stable."
        },
        {
          "title": "KnowledgeBase parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "sentences",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "KnowledgeBase example",
          "body": "",
          "code": "from arclm import KnowledgeBase\n\nprint(KnowledgeBase)",
          "language": "python"
        },
        {
          "title": "L1Regularization",
          "body": "L1 Regularization - Sparsity inducing Canonical import: from arclm import L1Regularization. Fully qualified name: arclm.L1Regularization. Status: Stable."
        },
        {
          "title": "L1Regularization parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "lambda_l1",
                "Any",
                "0.0001"
              ]
            ]
          }
        },
        {
          "title": "L1Regularization example",
          "body": "",
          "code": "from arclm import L1Regularization\n\nprint(L1Regularization)",
          "language": "python"
        },
        {
          "title": "L2Regularization",
          "body": "L2 Regularization (Weight Decay) - Smoothness inducing Canonical import: from arclm import L2Regularization. Fully qualified name: arclm.L2Regularization. Status: Stable."
        },
        {
          "title": "L2Regularization parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "lambda_l2",
                "Any",
                "0.0001"
              ]
            ]
          }
        },
        {
          "title": "L2Regularization example",
          "body": "",
          "code": "from arclm import L2Regularization\n\nprint(L2Regularization)",
          "language": "python"
        },
        {
          "title": "LabelSmoothing",
          "body": "Label smoothing regularization Voorkomt overconfident voorspellingen door targets glad te maken Canonical import: from arclm import LabelSmoothing. Fully qualified name: arclm.LabelSmoothing. Status: Stable."
        },
        {
          "title": "LabelSmoothing parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "num_classes",
                "Any",
                "required"
              ],
              [
                "smoothing",
                "Any",
                "0.1"
              ]
            ]
          }
        },
        {
          "title": "LabelSmoothing example",
          "body": "",
          "code": "from arclm import LabelSmoothing\n\nprint(LabelSmoothing)",
          "language": "python"
        },
        {
          "title": "LearningRateScheduler",
          "body": "Learning rate scheduler for better generalization Reduce learning rate during training for better convergence Canonical import: from arclm import LearningRateScheduler. Fully qualified name: arclm.LearningRateScheduler. Status: Stable."
        },
        {
          "title": "LearningRateScheduler parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "optimizer",
                "Any",
                "required"
              ],
              [
                "strategy",
                "Any",
                "'cosine'"
              ],
              [
                "total_epochs",
                "Any",
                "100"
              ]
            ]
          }
        },
        {
          "title": "LearningRateScheduler example",
          "body": "",
          "code": "from arclm import LearningRateScheduler\n\nprint(LearningRateScheduler)",
          "language": "python"
        },
        {
          "title": "LoadedCheckpoint",
          "body": "Normalized representation of a model source that ArcLM can inspect. Canonical import: from arclm import LoadedCheckpoint. Fully qualified name: arclm.LoadedCheckpoint. Status: Stable."
        },
        {
          "title": "LoadedCheckpoint parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "source",
                "str",
                "required"
              ],
              [
                "source_type",
                "str",
                "required"
              ],
              [
                "state_dict",
                "Dict",
                "required"
              ],
              [
                "config",
                "Dict",
                "<factory>"
              ],
              [
                "vocab_size",
                "Optional",
                "None"
              ],
              [
                "tokenizer_metadata",
                "Dict",
                "<factory>"
              ],
              [
                "vocab",
                "Optional",
                "None"
              ],
              [
                "stoi",
                "Optional",
                "None"
              ],
              [
                "itos",
                "Optional",
                "None"
              ],
              [
                "optimizer_state_dict",
                "Optional",
                "None"
              ],
              [
                "train_history",
                "Dict",
                "<factory>"
              ],
              [
                "metadata",
                "Dict",
                "<factory>"
              ]
            ]
          }
        },
        {
          "title": "LoadedCheckpoint example",
          "body": "",
          "code": "from arclm import LoadedCheckpoint\n\nprint(LoadedCheckpoint)",
          "language": "python"
        },
        {
          "title": "LoadedModel",
          "body": "Loaded model bundle with a minimal prediction method. Canonical import: from arclm import LoadedModel. Fully qualified name: arclm.LoadedModel. Status: Stable."
        },
        {
          "title": "LoadedModel parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "model",
                "Module",
                "required"
              ],
              [
                "generator",
                "Generator",
                "required"
              ],
              [
                "config",
                "Config",
                "required"
              ],
              [
                "model_path",
                "Path",
                "required"
              ],
              [
                "device",
                "device",
                "required"
              ]
            ]
          }
        },
        {
          "title": "LoadedModel example",
          "body": "",
          "code": "from arclm import LoadedModel\n\nprint(LoadedModel)",
          "language": "python"
        },
        {
          "title": "LoadPlan",
          "body": "Detected and user-selected settings for loading a model source. Canonical import: from arclm import LoadPlan. Fully qualified name: arclm.LoadPlan. Status: Stable."
        },
        {
          "title": "LoadPlan parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "source",
                "str",
                "required"
              ],
              [
                "source_type",
                "str",
                "'unknown'"
              ],
              [
                "files",
                "List[str]",
                "<factory>"
              ],
              [
                "metadata",
                "Dict[str, Any]",
                "<factory>"
              ],
              [
                "model_type",
                "Optional[str]",
                "None"
              ],
              [
                "architecture",
                "Optional[str]",
                "None"
              ],
              [
                "tokenizer",
                "Optional[str]",
                "None"
              ],
              [
                "weight_format",
                "Optional[str]",
                "None"
              ],
              [
                "precision",
                "Optional[str]",
                "None"
              ],
              [
                "load_as",
                "Optional[str]",
                "None"
              ],
              [
                "has_optimizer",
                "bool",
                "False"
              ],
              [
                "has_scheduler",
                "bool",
                "False"
              ],
              [
                "has_training_state",
                "bool",
                "False"
              ],
              [
                "can_resume_training",
                "bool",
                "False"
              ],
              [
                "resume_epoch",
                "Optional[int]",
                "None"
              ],
              [
                "resume_step",
                "Optional[int]",
                "None"
              ],
              [
                "load_optimizer",
                "Optional[bool]",
                "None"
              ],
              [
                "load_scheduler",
                "Optional[bool]",
                "None"
              ],
              [
                "resume_training",
                "Optional[bool]",
                "None"
              ]
            ]
          }
        },
        {
          "title": "LoadPlan example",
          "body": "",
          "code": "from arclm import LoadPlan\n\nprint(LoadPlan)",
          "language": "python"
        },
        {
          "title": "LongContextResult",
          "body": "Summary for one long-context training/evaluation run. Canonical import: from arclm import LongContextResult. Fully qualified name: arclm.LongContextResult. Status: Stable."
        },
        {
          "title": "LongContextResult parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "block_size",
                "int",
                "required"
              ],
              [
                "validation_loss",
                "float",
                "required"
              ],
              [
                "concept_score",
                "float",
                "required"
              ],
              [
                "generated_sample",
                "str",
                "required"
              ]
            ]
          }
        },
        {
          "title": "LongContextResult example",
          "body": "",
          "code": "from arclm import LongContextResult\n\nprint(LongContextResult)",
          "language": "python"
        },
        {
          "title": "LossMetric",
          "body": "Berekent gemiddelde loss per batch. Canonical import: from arclm import LossMetric. Fully qualified name: arclm.LossMetric. Status: Stable."
        },
        {
          "title": "LossMetric parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "LossMetric example",
          "body": "",
          "code": "from arclm import LossMetric\n\nprint(LossMetric)",
          "language": "python"
        },
        {
          "title": "MetricsReport",
          "body": "Comprehensive metrics report for model evaluation. Canonical import: from arclm import MetricsReport. Fully qualified name: arclm.MetricsReport. Status: Stable."
        },
        {
          "title": "MetricsReport parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "perplexity",
                "float",
                "required"
              ],
              [
                "avg_loss",
                "float",
                "required"
              ],
              [
                "total_tokens",
                "int",
                "required"
              ],
              [
                "correct_predictions",
                "int",
                "required"
              ],
              [
                "accuracy",
                "float",
                "required"
              ],
              [
                "timestamp",
                "str",
                "''"
              ]
            ]
          }
        },
        {
          "title": "MetricsReport example",
          "body": "",
          "code": "from arclm import MetricsReport\n\nprint(MetricsReport)",
          "language": "python"
        },
        {
          "title": "MiniGPT",
          "body": "Compact causal language model for next-token prediction. Canonical import: from arclm import MiniGPT. Fully qualified name: arclm.MiniGPT. Status: Deprecated."
        },
        {
          "title": "MiniGPT parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "vocab_size",
                "Any",
                "required"
              ],
              [
                "embed_dim",
                "Any",
                "64"
              ],
              [
                "block_size",
                "Any",
                "8"
              ],
              [
                "num_blocks",
                "Any",
                "2"
              ],
              [
                "dropout",
                "Any",
                "0.0"
              ]
            ]
          }
        },
        {
          "title": "MiniGPT example",
          "body": "",
          "code": "from arclm import MiniGPT\n\nprint(MiniGPT)",
          "language": "python"
        },
        {
          "title": "MixupAugmentation",
          "body": "Mixup data augmentation for better generalization Combineert twee samples lineair om data augmentation te krijgen Canonical import: from arclm import MixupAugmentation. Fully qualified name: arclm.MixupAugmentation. Status: Stable."
        },
        {
          "title": "MixupAugmentation parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "alpha",
                "Any",
                "1.0"
              ]
            ]
          }
        },
        {
          "title": "MixupAugmentation example",
          "body": "",
          "code": "from arclm import MixupAugmentation\n\nprint(MixupAugmentation)",
          "language": "python"
        },
        {
          "title": "ModelAdapter",
          "body": "Adapt weights from external models to ArcLM architecture. Canonical import: from arclm import ModelAdapter. Fully qualified name: arclm.ModelAdapter. Status: Stable."
        },
        {
          "title": "ModelAdapter parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "source_model",
                "Module",
                "required"
              ],
              [
                "target_model",
                "ArcLM",
                "required"
              ]
            ]
          }
        },
        {
          "title": "ModelAdapter example",
          "body": "",
          "code": "from arclm import ModelAdapter\n\nprint(ModelAdapter)",
          "language": "python"
        },
        {
          "title": "ModelCapabilityReport",
          "body": "Describes supported operations for one exact model path. Canonical import: from arclm import ModelCapabilityReport. Fully qualified name: arclm.ModelCapabilityReport. Status: Stable."
        },
        {
          "title": "ModelCapabilityReport parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "model_source",
                "str",
                "required"
              ],
              [
                "model_family",
                "str",
                "required"
              ],
              [
                "exact_model",
                "str",
                "required"
              ],
              [
                "task",
                "str",
                "required"
              ],
              [
                "status",
                "CapabilityStatus",
                "required"
              ],
              [
                "can_forward",
                "bool",
                "required"
              ],
              [
                "can_generate",
                "bool",
                "required"
              ],
              [
                "can_train",
                "bool",
                "required"
              ],
              [
                "can_full_finetune",
                "bool",
                "required"
              ],
              [
                "can_sft",
                "bool",
                "required"
              ],
              [
                "can_lora",
                "bool",
                "required"
              ],
              [
                "can_save_reload",
                "bool",
                "required"
              ],
              [
                "supports_cpu",
                "bool",
                "required"
              ],
              [
                "supports_cuda",
                "bool",
                "required"
              ],
              [
                "supports_quantization",
                "bool",
                "required"
              ],
              [
                "supports_structured_output",
                "bool",
                "required"
              ],
              [
                "validated_operations",
                "tuple[str, ...]",
                "<factory>"
              ],
              [
                "unvalidated_operations",
                "tuple[str, ...]",
                "<factory>"
              ],
              [
                "limitations",
                "tuple[str, ...]",
                "<factory>"
              ],
              [
                "operations",
                "dict[str, OperationStatus]",
                "<factory>"
              ]
            ]
          }
        },
        {
          "title": "ModelCapabilityReport example",
          "body": "",
          "code": "from arclm import ModelCapabilityReport\n\nprint(ModelCapabilityReport)",
          "language": "python"
        },
        {
          "title": "ModelInspector",
          "body": "Base class for source inspectors used by ``SmartLoader``. Canonical import: from arclm import ModelInspector. Fully qualified name: arclm.ModelInspector. Status: Stable."
        },
        {
          "title": "ModelInspector parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "ModelInspector example",
          "body": "",
          "code": "from arclm import ModelInspector\n\nprint(ModelInspector)",
          "language": "python"
        },
        {
          "title": "ModelSaveConfig",
          "body": "Developer-controlled settings for saving or exporting loaded models. Canonical import: from arclm import ModelSaveConfig. Fully qualified name: arclm.ModelSaveConfig. Status: Stable."
        },
        {
          "title": "ModelSaveConfig parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "save_enabled",
                "bool",
                "True"
              ],
              [
                "save_mode",
                "str",
                "'auto'"
              ],
              [
                "save_layout",
                "str",
                "'model_id'"
              ],
              [
                "save_tokenizer",
                "bool",
                "True"
              ],
              [
                "save_model_config",
                "bool",
                "True"
              ],
              [
                "save_generation_config",
                "bool",
                "True"
              ],
              [
                "save_training_metadata",
                "bool",
                "True"
              ],
              [
                "save_adapter_config",
                "bool",
                "True"
              ],
              [
                "save_processor",
                "bool",
                "True"
              ],
              [
                "save_readme",
                "bool",
                "True"
              ],
              [
                "save_safetensors",
                "bool",
                "True"
              ],
              [
                "merge_lora",
                "bool",
                "False"
              ],
              [
                "overwrite",
                "bool",
                "False"
              ]
            ]
          }
        },
        {
          "title": "ModelSaveConfig example",
          "body": "",
          "code": "from arclm import ModelSaveConfig\n\nprint(ModelSaveConfig)",
          "language": "python"
        },
        {
          "title": "ModelSourceInfo",
          "body": "Structured inspection result for a model source. Canonical import: from arclm import ModelSourceInfo. Fully qualified name: arclm.ModelSourceInfo. Status: Stable."
        },
        {
          "title": "ModelSourceInfo parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "source",
                "str",
                "required"
              ],
              [
                "source_type",
                "str",
                "'unknown'"
              ],
              [
                "tokenizer_files_exist",
                "bool",
                "False"
              ],
              [
                "adapter_config_exists",
                "bool",
                "False"
              ],
              [
                "config_json_exists",
                "bool",
                "False"
              ],
              [
                "model_weights_exist",
                "bool",
                "False"
              ],
              [
                "detected_checkpoint_folders",
                "List[str]",
                "<factory>"
              ],
              [
                "recommended_loading_strategy",
                "str",
                "'unsupported'"
              ],
              [
                "warnings",
                "List[str]",
                "<factory>"
              ],
              [
                "resolved_source",
                "Optional[str]",
                "None"
              ],
              [
                "model_type",
                "Optional[str]",
                "None"
              ],
              [
                "weight_format",
                "Optional[str]",
                "None"
              ],
              [
                "load_as",
                "Optional[str]",
                "None"
              ],
              [
                "base_model_name_or_path",
                "Optional[str]",
                "None"
              ]
            ]
          }
        },
        {
          "title": "ModelSourceInfo example",
          "body": "",
          "code": "from arclm import ModelSourceInfo\n\nprint(ModelSourceInfo)",
          "language": "python"
        },
        {
          "title": "Not",
          "body": "Logische NOT rond een operand. Canonical import: from arclm import Not. Fully qualified name: arclm.Not. Status: Stable."
        },
        {
          "title": "Not parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "operand",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "Not example",
          "body": "",
          "code": "from arclm import Not\n\nprint(Not)",
          "language": "python"
        },
        {
          "title": "Or",
          "body": "Logische OR met een of meer disjuncties. Canonical import: from arclm import Or. Fully qualified name: arclm.Or. Status: Stable."
        },
        {
          "title": "Or parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "disjuncts",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "Or example",
          "body": "",
          "code": "from arclm import Or\n\nprint(Or)",
          "language": "python"
        },
        {
          "title": "Perplexity",
          "body": "Berekent perplexity uit gemiddelde loss. Canonical import: from arclm import Perplexity. Fully qualified name: arclm.Perplexity. Status: Stable."
        },
        {
          "title": "Perplexity parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "max_loss",
                "float",
                "20.0"
              ]
            ]
          }
        },
        {
          "title": "Perplexity example",
          "body": "",
          "code": "from arclm import Perplexity\n\nprint(Perplexity)",
          "language": "python"
        },
        {
          "title": "PipelineTrace",
          "body": "JSON-safe summary of one inspected native ArcLM generation step. Canonical import: from arclm import PipelineTrace. Fully qualified name: arclm.PipelineTrace. Status: Stable."
        },
        {
          "title": "PipelineTrace parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "input_text",
                "str",
                "required"
              ],
              [
                "tokens",
                "list[str]",
                "required"
              ],
              [
                "token_ids",
                "list[int]",
                "required"
              ],
              [
                "sequence_length",
                "int",
                "required"
              ],
              [
                "input_shape",
                "list[int]",
                "required"
              ],
              [
                "embedding_shape",
                "list[int]",
                "required"
              ],
              [
                "logits_shape",
                "list[int]",
                "required"
              ],
              [
                "selected_token_id",
                "int",
                "required"
              ],
              [
                "selected_token",
                "str",
                "required"
              ],
              [
                "generated_text",
                "str",
                "required"
              ],
              [
                "device",
                "str",
                "required"
              ],
              [
                "dtype",
                "str",
                "required"
              ],
              [
                "model_class",
                "str",
                "required"
              ],
              [
                "tokenizer_class",
                "str",
                "required"
              ],
              [
                "inspected_steps",
                "int",
                "1"
              ],
              [
                "generation_steps",
                "int",
                "1"
              ],
              [
                "attention_available",
                "bool",
                "False"
              ],
              [
                "attention_note",
                "str",
                "'Attention tensor capture is planned for a later inspection version.'"
              ],
              [
                "warnings",
                "list[str]",
                "<factory>"
              ],
              [
                "values",
                "dict[str, list[float | int]] | None",
                "None"
              ]
            ]
          }
        },
        {
          "title": "PipelineTrace example",
          "body": "",
          "code": "from arclm import PipelineTrace\n\nprint(PipelineTrace)",
          "language": "python"
        },
        {
          "title": "PreTrainedModelLoader",
          "body": "Load pre-trained models from multiple sources: - HuggingFace transformers - Local checkpoint files - Custom model paths Handles weight alignment and architecture mismatch gracefully. Canonical import: from arclm import PreTrainedModelLoader. Fully qualified name: arclm.PreTrainedModelLoader. Status: Stable."
        },
        {
          "title": "PreTrainedModelLoader parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "source",
                "Union",
                "required"
              ],
              [
                "target_vocab_size",
                "int",
                "required"
              ],
              [
                "target_config",
                "Config",
                "required"
              ],
              [
                "device",
                "str",
                "'cpu'"
              ],
              [
                "strict_loading",
                "bool",
                "False"
              ]
            ]
          }
        },
        {
          "title": "PreTrainedModelLoader example",
          "body": "",
          "code": "from arclm import PreTrainedModelLoader\n\nprint(PreTrainedModelLoader)",
          "language": "python"
        },
        {
          "title": "ProcessedDataset",
          "body": "Kleine in-memory dataset voor formatting, cleaning en splits. Canonical import: from arclm import ProcessedDataset. Fully qualified name: arclm.ProcessedDataset. Status: Stable."
        },
        {
          "title": "ProcessedDataset parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "samples",
                "List[Dict[str, Any]]",
                "<factory>"
              ],
              [
                "source",
                "Optional[str]",
                "None"
              ]
            ]
          }
        },
        {
          "title": "ProcessedDataset example",
          "body": "",
          "code": "from arclm import ProcessedDataset\n\nprint(ProcessedDataset)",
          "language": "python"
        },
        {
          "title": "RemoveDuplicates",
          "body": "Verwijdert voorbeelden met dezelfde waarde in gekozen velden. Canonical import: from arclm import RemoveDuplicates. Fully qualified name: arclm.RemoveDuplicates. Status: Stable."
        },
        {
          "title": "RemoveDuplicates parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "field",
                "str | None",
                "None"
              ],
              [
                "fields",
                "list[str] | tuple[str, ...] | None",
                "None"
              ],
              [
                "normalize",
                "bool",
                "False"
              ],
              [
                "keep",
                "str",
                "'first'"
              ],
              [
                "hash_algorithm",
                "str | None",
                "None"
              ],
              [
                "missing",
                "str",
                "'keep'"
              ]
            ]
          }
        },
        {
          "title": "RemoveDuplicates example",
          "body": "",
          "code": "from arclm import RemoveDuplicates\n\nprint(RemoveDuplicates)",
          "language": "python"
        },
        {
          "title": "Sentence",
          "body": "Basis class voor logische zinnen. Canonical import: from arclm import Sentence. Fully qualified name: arclm.Sentence. Status: Stable."
        },
        {
          "title": "Sentence parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "Sentence example",
          "body": "",
          "code": "from arclm import Sentence\n\nprint(Sentence)",
          "language": "python"
        },
        {
          "title": "SentencePieceTokenizer",
          "body": "SentencePiece tokenizer voor subword taalmodeltraining. Canonical import: from arclm import SentencePieceTokenizer. Fully qualified name: arclm.SentencePieceTokenizer. Status: Stable."
        },
        {
          "title": "SentencePieceTokenizer parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "max_vocab",
                "Any",
                "50000"
              ],
              [
                "model_type",
                "Any",
                "'bpe'"
              ],
              [
                "character_coverage",
                "Any",
                "1.0"
              ],
              [
                "default_token",
                "Any",
                "'<UNK>'"
              ],
              [
                "model_name",
                "Any",
                "None"
              ],
              [
                "user_defined_symbols",
                "Any",
                "None"
              ]
            ]
          }
        },
        {
          "title": "SentencePieceTokenizer example",
          "body": "",
          "code": "from arclm import SentencePieceTokenizer\n\nprint(SentencePieceTokenizer)",
          "language": "python"
        },
        {
          "title": "SFTConfig",
          "body": "Bewaart instellingen voor supervised fine-tuning. Canonical import: from arclm import SFTConfig. Fully qualified name: arclm.SFTConfig. Status: Stable."
        },
        {
          "title": "SFTConfig parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "epochs",
                "int",
                "3"
              ],
              [
                "batch_size",
                "int",
                "8"
              ],
              [
                "learning_rate",
                "float",
                "2e-05"
              ],
              [
                "weight_decay",
                "float",
                "0.0"
              ],
              [
                "gradient_accumulation_steps",
                "int",
                "1"
              ],
              [
                "precision",
                "str",
                "'fp32'"
              ],
              [
                "max_grad_norm",
                "float | None",
                "1.0"
              ],
              [
                "output_dir",
                "str",
                "'outputs'"
              ],
              [
                "save_every_steps",
                "int",
                "500"
              ],
              [
                "keep_last_checkpoints",
                "int | None",
                "3"
              ],
              [
                "log_every_steps",
                "int",
                "10"
              ],
              [
                "optimizer",
                "str",
                "'adamw'"
              ],
              [
                "scheduler",
                "str",
                "'constant'"
              ],
              [
                "warmup_steps",
                "int",
                "0"
              ],
              [
                "max_steps",
                "int | None",
                "None"
              ],
              [
                "device",
                "str | None",
                "None"
              ],
              [
                "num_workers",
                "int",
                "0"
              ],
              [
                "shuffle",
                "bool",
                "True"
              ],
              [
                "text_field",
                "str | None",
                "'text'"
              ],
              [
                "instruction_field",
                "str | None",
                "None"
              ],
              [
                "input_field",
                "str | None",
                "None"
              ],
              [
                "response_field",
                "str | None",
                "None"
              ],
              [
                "prompt_field",
                "str | None",
                "None"
              ],
              [
                "messages_field",
                "str | None",
                "None"
              ],
              [
                "max_length",
                "int",
                "1024"
              ],
              [
                "padding",
                "str",
                "'longest'"
              ],
              [
                "truncation",
                "bool",
                "True"
              ],
              [
                "packing",
                "bool",
                "False"
              ],
              [
                "assistant_only_loss",
                "bool",
                "False"
              ],
              [
                "add_eos_token",
                "bool",
                "True"
              ],
              [
                "ignore_index",
                "int",
                "-100"
              ],
              [
                "label_shift",
                "bool",
                "True"
              ],
              [
                "chat_template",
                "str | None",
                "None"
              ]
            ]
          }
        },
        {
          "title": "SFTConfig example",
          "body": "",
          "code": "from arclm import SFTConfig\n\nprint(SFTConfig)",
          "language": "python"
        },
        {
          "title": "SFTDataCollator",
          "body": "Zet SFT voorbeelden om naar tensors voor de trainer. Canonical import: from arclm import SFTDataCollator. Fully qualified name: arclm.SFTDataCollator. Status: Stable."
        },
        {
          "title": "SFTDataCollator parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "tokenizer",
                "Any",
                "None"
              ],
              [
                "config",
                "SFTConfig | None",
                "None"
              ],
              [
                "tokenizer_adapter",
                "Any",
                "None"
              ]
            ]
          }
        },
        {
          "title": "SFTDataCollator example",
          "body": "",
          "code": "from arclm import SFTDataCollator\n\nprint(SFTDataCollator)",
          "language": "python"
        },
        {
          "title": "SFTRecordContract",
          "body": "Public description of accepted SFT record fields. Canonical import: from arclm import SFTRecordContract. Fully qualified name: arclm.SFTRecordContract. Status: Stable."
        },
        {
          "title": "SFTRecordContract parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "format",
                "str",
                "required"
              ],
              [
                "required_fields",
                "tuple[str, ...]",
                "required"
              ],
              [
                "optional_fields",
                "tuple[str, ...]",
                "()"
              ],
              [
                "description",
                "str",
                "''"
              ]
            ]
          }
        },
        {
          "title": "SFTRecordContract example",
          "body": "",
          "code": "from arclm import SFTRecordContract\n\nprint(SFTRecordContract)",
          "language": "python"
        },
        {
          "title": "SFTTrainer",
          "body": "Traint een tekstmodel met instruction-, chat- of tekstdatasets. Canonical import: from arclm import SFTTrainer. Fully qualified name: arclm.SFTTrainer. Status: Stable."
        },
        {
          "title": "SFTTrainer parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "model",
                "Any",
                "required"
              ],
              [
                "tokenizer",
                "Any",
                "None"
              ],
              [
                "train_dataset",
                "Any",
                "None"
              ],
              [
                "config",
                "SFTConfig | None",
                "None"
              ],
              [
                "validation_dataset",
                "Any",
                "None"
              ],
              [
                "model_adapter",
                "Any",
                "None"
              ],
              [
                "tokenizer_adapter",
                "Any",
                "None"
              ],
              [
                "optimizer",
                "Any",
                "None"
              ],
              [
                "scheduler",
                "Any",
                "None"
              ],
              [
                "callbacks",
                "Any",
                "None"
              ],
              [
                "collate_fn",
                "Any",
                "None"
              ]
            ]
          }
        },
        {
          "title": "SFTTrainer example",
          "body": "",
          "code": "from arclm import SFTTrainer\n\nprint(SFTTrainer)",
          "language": "python"
        },
        {
          "title": "SFTTrainingResult",
          "body": "Result returned by ``train_sft``. Canonical import: from arclm import SFTTrainingResult. Fully qualified name: arclm.SFTTrainingResult. Status: Stable."
        },
        {
          "title": "SFTTrainingResult parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "model",
                "str",
                "required"
              ],
              [
                "dataset",
                "str",
                "required"
              ],
              [
                "output_dir",
                "str",
                "required"
              ],
              [
                "backend",
                "str",
                "required"
              ],
              [
                "use_lora",
                "bool",
                "required"
              ],
              [
                "assistant_only_loss",
                "bool",
                "required"
              ],
              [
                "train_loss_history",
                "List[float]",
                "required"
              ],
              [
                "steps",
                "int",
                "required"
              ],
              [
                "metadata_path",
                "str",
                "required"
              ],
              [
                "adapter_path",
                "Optional[str]",
                "None"
              ],
              [
                "full_model_path",
                "Optional[str]",
                "None"
              ]
            ]
          }
        },
        {
          "title": "SFTTrainingResult example",
          "body": "",
          "code": "from arclm import SFTTrainingResult\n\nprint(SFTTrainingResult)",
          "language": "python"
        },
        {
          "title": "SmartLoader",
          "body": "High-level loading entry point with inspection and manual overrides. Canonical import: from arclm import SmartLoader. Fully qualified name: arclm.SmartLoader. Status: Stable."
        },
        {
          "title": "SmartLoader parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "SmartLoader example",
          "body": "",
          "code": "from arclm import SmartLoader\n\nprint(SmartLoader)",
          "language": "python"
        },
        {
          "title": "StoppingCriteria",
          "body": "Base stopping criteria for training loop control. Canonical import: from arclm import StoppingCriteria. Fully qualified name: arclm.StoppingCriteria. Status: Stable."
        },
        {
          "title": "StoppingCriteria parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "max_steps",
                "Optional",
                "None"
              ],
              [
                "early_stopping_patience",
                "Optional",
                "None"
              ],
              [
                "early_stopping_min_delta",
                "float",
                "0.0"
              ]
            ]
          }
        },
        {
          "title": "StoppingCriteria example",
          "body": "",
          "code": "from arclm import StoppingCriteria\n\nprint(StoppingCriteria)",
          "language": "python"
        },
        {
          "title": "StreamingDataset",
          "body": "Dataset die voorbeelden pas leest tijdens het itereren. Canonical import: from arclm import StreamingDataset. Fully qualified name: arclm.StreamingDataset. Status: Stable."
        },
        {
          "title": "StreamingDataset parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "factory",
                "Callable[[], Iterator[dict[str, Any]]]",
                "required"
              ]
            ]
          }
        },
        {
          "title": "StreamingDataset example",
          "body": "",
          "code": "from arclm import StreamingDataset\n\nprint(StreamingDataset)",
          "language": "python"
        },
        {
          "title": "Symbol",
          "body": "Een enkel logisch symbool, zoals P of Q. Canonical import: from arclm import Symbol. Fully qualified name: arclm.Symbol. Status: Stable."
        },
        {
          "title": "Symbol parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "name",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "Symbol example",
          "body": "",
          "code": "from arclm import Symbol\n\nprint(Symbol)",
          "language": "python"
        },
        {
          "title": "TextDataset",
          "body": "Dataset voor taalmodeltraining met een schuivend venster. Canonical import: from arclm import TextDataset. Fully qualified name: arclm.TextDataset. Status: Stable."
        },
        {
          "title": "TextDataset parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "data",
                "Any",
                "required"
              ],
              [
                "block_size",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "TextDataset example",
          "body": "",
          "code": "from arclm import TextDataset\n\nprint(TextDataset)",
          "language": "python"
        },
        {
          "title": "TextGenerator",
          "body": "Generate tokens from a trained native causal language model. Canonical import: from arclm import TextGenerator. Fully qualified name: arclm.TextGenerator. Status: Stable."
        },
        {
          "title": "TextGenerator parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "model",
                "Any",
                "required"
              ],
              [
                "stoi",
                "Any",
                "required"
              ],
              [
                "itos",
                "Any",
                "required"
              ],
              [
                "block_size",
                "Any",
                "required"
              ],
              [
                "device",
                "Any",
                "required"
              ],
              [
                "tokenizer",
                "Any",
                "None"
              ]
            ]
          }
        },
        {
          "title": "TextGenerator example",
          "body": "",
          "code": "from arclm import TextGenerator\n\nprint(TextGenerator)",
          "language": "python"
        },
        {
          "title": "Tokenizer",
          "body": "Zet tekst om naar woord-tokens en token ids. Canonical import: from arclm import Tokenizer. Fully qualified name: arclm.Tokenizer. Status: Stable."
        },
        {
          "title": "Tokenizer parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "max_vocab",
                "Any",
                "50000"
              ],
              [
                "default_token",
                "Any",
                "'<UNK>'"
              ],
              [
                "user_defined_symbols",
                "Any",
                "None"
              ]
            ]
          }
        },
        {
          "title": "Tokenizer example",
          "body": "",
          "code": "from arclm import Tokenizer\n\nprint(Tokenizer)",
          "language": "python"
        },
        {
          "title": "TokenizerAdapter",
          "body": "Zet verschillende tokenizers om naar \u00e9\u00e9n eenvoudige interface. Canonical import: from arclm import TokenizerAdapter. Fully qualified name: arclm.TokenizerAdapter. Status: Stable."
        },
        {
          "title": "TokenizerAdapter parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "tokenizer",
                "Any",
                "required"
              ],
              [
                "pad_token_id",
                "int | None",
                "None"
              ],
              [
                "eos_token_id",
                "int | None",
                "None"
              ]
            ]
          }
        },
        {
          "title": "TokenizerAdapter example",
          "body": "",
          "code": "from arclm import TokenizerAdapter\n\nprint(TokenizerAdapter)",
          "language": "python"
        },
        {
          "title": "TokenizerFactory",
          "body": "Kiest en maakt tokenizer classes op basis van een korte naam. Canonical import: from arclm import TokenizerFactory. Fully qualified name: arclm.TokenizerFactory. Status: Stable."
        },
        {
          "title": "TokenizerFactory parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "TokenizerFactory example",
          "body": "",
          "code": "from arclm import TokenizerFactory\n\nprint(TokenizerFactory)",
          "language": "python"
        },
        {
          "title": "TopKPrediction",
          "body": "One next-token prediction. Canonical import: from arclm import TopKPrediction. Fully qualified name: arclm.TopKPrediction. Status: Stable."
        },
        {
          "title": "TopKPrediction parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "rank",
                "int",
                "required"
              ],
              [
                "token",
                "str",
                "required"
              ],
              [
                "probability",
                "float",
                "required"
              ]
            ]
          }
        },
        {
          "title": "TopKPrediction example",
          "body": "",
          "code": "from arclm import TopKPrediction\n\nprint(TopKPrediction)",
          "language": "python"
        },
        {
          "title": "Trainer",
          "body": "Traint een model op \u00e9\u00e9n apparaat. Canonical import: from arclm import Trainer. Fully qualified name: arclm.Trainer. Status: Stable."
        },
        {
          "title": "Trainer parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "model",
                "Any",
                "required"
              ],
              [
                "optimizer",
                "Any",
                "None"
              ],
              [
                "criterion",
                "Any",
                "None"
              ],
              [
                "config",
                "Any",
                "None"
              ],
              [
                "train_dataset",
                "Any",
                "None"
              ],
              [
                "validation_dataset",
                "Any",
                "None"
              ],
              [
                "train_dataloader",
                "Any",
                "None"
              ],
              [
                "validation_dataloader",
                "Any",
                "None"
              ],
              [
                "scheduler",
                "Any",
                "None"
              ],
              [
                "callbacks",
                "Any",
                "None"
              ],
              [
                "event_logger",
                "Any",
                "None"
              ],
              [
                "collate_fn",
                "Any",
                "None"
              ],
              [
                "distributed_config",
                "Any",
                "None"
              ]
            ]
          }
        },
        {
          "title": "Trainer example",
          "body": "",
          "code": "from arclm import Trainer\n\nprint(Trainer)",
          "language": "python"
        },
        {
          "title": "TrainingConfig",
          "body": "Houdt alle belangrijke ArcLM instellingen bij. Canonical import: from arclm import TrainingConfig. Fully qualified name: arclm.TrainingConfig. Status: Stable."
        },
        {
          "title": "TrainingConfig parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "kwargs",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "TrainingConfig example",
          "body": "",
          "code": "from arclm import TrainingConfig\n\nprint(TrainingConfig)",
          "language": "python"
        },
        {
          "title": "TrainingResult",
          "body": "Resultaat dat `train_model` teruggeeft na een trainingsrun. Canonical import: from arclm import TrainingResult. Fully qualified name: arclm.TrainingResult. Status: Stable."
        },
        {
          "title": "TrainingResult parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "mode",
                "str",
                "required"
              ],
              [
                "model_path",
                "str",
                "required"
              ],
              [
                "config",
                "Config",
                "required"
              ],
              [
                "history",
                "Dict",
                "required"
              ],
              [
                "vocab_size",
                "int",
                "required"
              ],
              [
                "tokenizer",
                "Union",
                "None"
              ],
              [
                "checkpoint_source",
                "Optional",
                "None"
              ]
            ]
          }
        },
        {
          "title": "TrainingResult example",
          "body": "",
          "code": "from arclm import TrainingResult\n\nprint(TrainingResult)",
          "language": "python"
        },
        {
          "title": "TrainingState",
          "body": "Houdt bij waar de training is. Canonical import: from arclm import TrainingState. Fully qualified name: arclm.TrainingState. Status: Stable."
        },
        {
          "title": "TrainingState parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "epoch",
                "int",
                "0"
              ],
              [
                "step",
                "int",
                "0"
              ],
              [
                "global_step",
                "int",
                "0"
              ],
              [
                "optimizer_step",
                "int",
                "0"
              ],
              [
                "best_loss",
                "float | None",
                "None"
              ],
              [
                "last_loss",
                "float | None",
                "None"
              ],
              [
                "last_validation_loss",
                "float | None",
                "None"
              ],
              [
                "learning_rate",
                "float | None",
                "None"
              ],
              [
                "elapsed_seconds",
                "float",
                "0.0"
              ]
            ]
          }
        },
        {
          "title": "TrainingState example",
          "body": "",
          "code": "from arclm import TrainingState\n\nprint(TrainingState)",
          "language": "python"
        },
        {
          "title": "UnifiedPipeline",
          "body": "Unified training pipeline supporting multiple modes: - PRE_TRAINING: Train from scratch on large corpus - FINE_TUNING: Fine-tune pre-trained model on task data - INSTRUCTION_TUNING: Fine-tune on instruction-response pair Canonical import: from arclm import UnifiedPipeline. Fully qualified name: arclm.UnifiedPipeline. Status: Stable."
        },
        {
          "title": "UnifiedPipeline parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "config",
                "Config",
                "required"
              ],
              [
                "mode",
                "str",
                "'fine_tuning'"
              ],
              [
                "pretrained_source",
                "Union",
                "None"
              ],
              [
                "stopping_criteria",
                "Optional",
                "None"
              ]
            ]
          }
        },
        {
          "title": "UnifiedPipeline example",
          "body": "",
          "code": "from arclm import UnifiedPipeline\n\nprint(UnifiedPipeline)",
          "language": "python"
        },
        {
          "title": "__version__",
          "body": "str(object='') -> str str(bytes_or_buffer[, encoding[, errors]]) -> str Create a new string object from the given object. Canonical import: from arclm import __version__. Fully qualified name: arclm.__version__. Status: Stable."
        },
        {
          "title": "__version__ parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "__version__ example",
          "body": "",
          "code": "from arclm import __version__\n\nprint(__version__)",
          "language": "python"
        },
        {
          "title": "DEFAULT_CONCEPT_BENCHMARKS",
          "body": "Built-in mutable sequence. Canonical import: from arclm import DEFAULT_CONCEPT_BENCHMARKS. Fully qualified name: arclm.DEFAULT_CONCEPT_BENCHMARKS. Status: Stable."
        },
        {
          "title": "DEFAULT_CONCEPT_BENCHMARKS parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "DEFAULT_CONCEPT_BENCHMARKS example",
          "body": "",
          "code": "from arclm import DEFAULT_CONCEPT_BENCHMARKS\n\nprint(DEFAULT_CONCEPT_BENCHMARKS)",
          "language": "python"
        },
        {
          "title": "DEFAULT_MODEL_PATH",
          "body": "Path subclass for Windows systems. Canonical import: from arclm import DEFAULT_MODEL_PATH. Fully qualified name: arclm.DEFAULT_MODEL_PATH. Status: Stable."
        },
        {
          "title": "DEFAULT_MODEL_PATH parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "DEFAULT_MODEL_PATH example",
          "body": "",
          "code": "from arclm import DEFAULT_MODEL_PATH\n\nprint(DEFAULT_MODEL_PATH)",
          "language": "python"
        },
        {
          "title": "adapt_for_training",
          "body": "Create an ArcLM model from a normalized checkpoint. Canonical import: from arclm import adapt_for_training. Fully qualified name: arclm.adapt_for_training. Status: Stable."
        },
        {
          "title": "adapt_for_training parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "checkpoint",
                "LoadedCheckpoint",
                "required"
              ],
              [
                "target_config",
                "Optional",
                "None"
              ],
              [
                "tokenizer",
                "Optional",
                "None"
              ],
              [
                "strict",
                "bool",
                "False"
              ],
              [
                "require_tokenizer_match",
                "bool",
                "False"
              ],
              [
                "config_overrides",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "adapt_for_training example",
          "body": "",
          "code": "from arclm import adapt_for_training\n\nprint(adapt_for_training)",
          "language": "python"
        },
        {
          "title": "build_dataset_report",
          "body": "Build a processed dataset report with optional token statistics. Canonical import: from arclm import build_dataset_report. Fully qualified name: arclm.build_dataset_report. Status: Stable."
        },
        {
          "title": "build_dataset_report parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "records",
                "Iterable[Mapping[str, Any]]",
                "required"
              ],
              [
                "tokenizer",
                "Any | None",
                "None"
              ],
              [
                "text_fields",
                "Sequence[str]",
                "('text',)"
              ],
              [
                "validation_result",
                "DatasetValidationResult | None",
                "None"
              ],
              [
                "manifest",
                "DatasetManifest | None",
                "None"
              ],
              [
                "split_information",
                "Mapping[str, int] | None",
                "None"
              ],
              [
                "duplicates_removed",
                "int",
                "0"
              ],
              [
                "empty_records_removed",
                "int | None",
                "None"
              ],
              [
                "truncated_record_count",
                "int",
                "0"
              ],
              [
                "max_token_length",
                "int | None",
                "None"
              ]
            ]
          }
        },
        {
          "title": "build_dataset_report example",
          "body": "",
          "code": "from arclm import build_dataset_report\n\nprint(build_dataset_report)",
          "language": "python"
        },
        {
          "title": "build_evaluation_report",
          "body": "Build a report from canonical evaluator metrics without recalculation. Canonical import: from arclm import build_evaluation_report. Fully qualified name: arclm.build_evaluation_report. Status: Stable."
        },
        {
          "title": "build_evaluation_report parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "result",
                "EvaluationResult",
                "required"
              ],
              [
                "model",
                "Any | None",
                "None"
              ],
              [
                "checkpoint_identity",
                "str | None",
                "None"
              ],
              [
                "dataset_identity",
                "str | None",
                "None"
              ],
              [
                "num_tokens",
                "int | None",
                "None"
              ],
              [
                "warnings",
                "list[str] | tuple[str, ...]",
                "()"
              ]
            ]
          }
        },
        {
          "title": "build_evaluation_report example",
          "body": "",
          "code": "from arclm import build_evaluation_report\n\nprint(build_evaluation_report)",
          "language": "python"
        },
        {
          "title": "build_model",
          "body": "Maakt een ArcLM model vanuit config en zet het op het gekozen device. Canonical import: from arclm import build_model. Fully qualified name: arclm.build_model. Status: Stable."
        },
        {
          "title": "build_model parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "config",
                "Any",
                "required"
              ],
              [
                "vocab_size",
                "Any",
                "None"
              ]
            ]
          }
        },
        {
          "title": "build_model example",
          "body": "",
          "code": "from arclm import build_model\n\nprint(build_model)",
          "language": "python"
        },
        {
          "title": "build_trainer",
          "body": "Maakt de optimizer, loss function en Trainer voor een model. Canonical import: from arclm import build_trainer. Fully qualified name: arclm.build_trainer. Status: Stable."
        },
        {
          "title": "build_trainer parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "model",
                "Any",
                "required"
              ],
              [
                "config",
                "Any",
                "required"
              ],
              [
                "event_logger",
                "Any",
                "None"
              ]
            ]
          }
        },
        {
          "title": "build_trainer example",
          "body": "",
          "code": "from arclm import build_trainer\n\nprint(build_trainer)",
          "language": "python"
        },
        {
          "title": "build_training_diagnostics_report",
          "body": "Build tokenizer, top-k, and concept benchmark diagnostics for a run. Canonical import: from arclm import build_training_diagnostics_report. Fully qualified name: arclm.build_training_diagnostics_report. Status: Stable."
        },
        {
          "title": "build_training_diagnostics_report parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "model",
                "Any",
                "required"
              ],
              [
                "data",
                "Any",
                "required"
              ],
              [
                "config",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "build_training_diagnostics_report example",
          "body": "",
          "code": "from arclm import build_training_diagnostics_report\n\nprint(build_training_diagnostics_report)",
          "language": "python"
        },
        {
          "title": "calculate_metrics",
          "body": "Calculate comprehensive evaluation metrics. Canonical import: from arclm import calculate_metrics. Fully qualified name: arclm.calculate_metrics. Status: Stable."
        },
        {
          "title": "calculate_metrics parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "model",
                "Any",
                "required"
              ],
              [
                "val_loader",
                "Any",
                "required"
              ],
              [
                "config",
                "Any",
                "required"
              ],
              [
                "device",
                "Any",
                "'cpu'"
              ]
            ]
          }
        },
        {
          "title": "calculate_metrics example",
          "body": "",
          "code": "from arclm import calculate_metrics\n\nprint(calculate_metrics)",
          "language": "python"
        },
        {
          "title": "calculate_perplexity",
          "body": "Return perplexity for a cross-entropy loss value. Canonical import: from arclm import calculate_perplexity. Fully qualified name: arclm.calculate_perplexity. Status: Stable."
        },
        {
          "title": "calculate_perplexity parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "loss",
                "float",
                "required"
              ]
            ]
          }
        },
        {
          "title": "calculate_perplexity example",
          "body": "",
          "code": "from arclm import calculate_perplexity\n\nprint(calculate_perplexity)",
          "language": "python"
        },
        {
          "title": "checkpoint_is_compatible_for_continue_training",
          "body": "Controleert of een checkpoint past bij continued training. Canonical import: from arclm import checkpoint_is_compatible_for_continue_training. Fully qualified name: arclm.checkpoint_is_compatible_for_continue_training. Status: Stable."
        },
        {
          "title": "checkpoint_is_compatible_for_continue_training parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "checkpoint",
                "Any",
                "required"
              ],
              [
                "config",
                "Any",
                "required"
              ],
              [
                "vocab_size",
                "Any",
                "required"
              ],
              [
                "tokenizer",
                "Any",
                "None"
              ]
            ]
          }
        },
        {
          "title": "checkpoint_is_compatible_for_continue_training example",
          "body": "",
          "code": "from arclm import checkpoint_is_compatible_for_continue_training\n\nprint(checkpoint_is_compatible_for_continue_training)",
          "language": "python"
        },
        {
          "title": "checkpoint_is_compatible_for_tuining",
          "body": "Controleert of een checkpoint past bij finetuning. Canonical import: from arclm import checkpoint_is_compatible_for_tuining. Fully qualified name: arclm.checkpoint_is_compatible_for_tuining. Status: Deprecated."
        },
        {
          "title": "checkpoint_is_compatible_for_tuining parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "checkpoint",
                "Any",
                "required"
              ],
              [
                "config",
                "Any",
                "required"
              ],
              [
                "vocab_size",
                "Any",
                "required"
              ],
              [
                "tokenizer",
                "Any",
                "None"
              ]
            ]
          }
        },
        {
          "title": "checkpoint_is_compatible_for_tuining example",
          "body": "",
          "code": "from arclm import checkpoint_is_compatible_for_tuining\n\nprint(checkpoint_is_compatible_for_tuining)",
          "language": "python"
        },
        {
          "title": "continue_native_training",
          "body": "Continue native ArcLM training via ``train_model``. Canonical import: from arclm import continue_native_training. Fully qualified name: arclm.continue_native_training. Status: Stable."
        },
        {
          "title": "continue_native_training parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "data",
                "str",
                "required"
              ],
              [
                "output",
                "str",
                "required"
              ],
              [
                "checkpoint",
                "str",
                "required"
              ],
              [
                "kwargs",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "continue_native_training example",
          "body": "",
          "code": "from arclm import continue_native_training\n\nprint(continue_native_training)",
          "language": "python"
        },
        {
          "title": "create_checkpoint_callback",
          "body": "Maakt een callback die het laatste hervatbare checkpoint opslaat. Canonical import: from arclm import create_checkpoint_callback. Fully qualified name: arclm.create_checkpoint_callback. Status: Stable."
        },
        {
          "title": "create_checkpoint_callback parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "config",
                "Any",
                "required"
              ],
              [
                "tokenizer",
                "Any",
                "required"
              ],
              [
                "vocab_size",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "create_checkpoint_callback example",
          "body": "",
          "code": "from arclm import create_checkpoint_callback\n\nprint(create_checkpoint_callback)",
          "language": "python"
        },
        {
          "title": "create_config",
          "body": "Maakt een `Config` met praktische defaults. Canonical import: from arclm import create_config. Fully qualified name: arclm.create_config. Status: Stable."
        },
        {
          "title": "create_config parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "kwargs",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "create_config example",
          "body": "",
          "code": "from arclm import create_config\n\nprint(create_config)",
          "language": "python"
        },
        {
          "title": "create_dataloader",
          "body": "Maakt een PyTorch DataLoader van token ids. Canonical import: from arclm import create_dataloader. Fully qualified name: arclm.create_dataloader. Status: Stable."
        },
        {
          "title": "create_dataloader parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "encoded_data",
                "Any",
                "required"
              ],
              [
                "block_size",
                "Any",
                "required"
              ],
              [
                "batch_size",
                "Any",
                "required"
              ],
              [
                "shuffle",
                "Any",
                "True"
              ]
            ]
          }
        },
        {
          "title": "create_dataloader example",
          "body": "",
          "code": "from arclm import create_dataloader\n\nprint(create_dataloader)",
          "language": "python"
        },
        {
          "title": "create_dataset_manifest",
          "body": "Create lightweight dataset provenance without storing record values. Canonical import: from arclm import create_dataset_manifest. Fully qualified name: arclm.create_dataset_manifest. Status: Stable."
        },
        {
          "title": "create_dataset_manifest parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "dataset_name",
                "str",
                "required"
              ],
              [
                "source_type",
                "str",
                "required"
              ],
              [
                "records_before",
                "int",
                "required"
              ],
              [
                "records_after",
                "int",
                "required"
              ],
              [
                "validation_result",
                "DatasetValidationResult | None",
                "None"
              ],
              [
                "source_files",
                "Sequence[str | Path]",
                "()"
              ],
              [
                "duplicates_removed",
                "int",
                "0"
              ],
              [
                "text_fields",
                "Sequence[str]",
                "('text',)"
              ],
              [
                "transformations_applied",
                "Sequence[str]",
                "()"
              ],
              [
                "split_information",
                "Mapping[str, int] | None",
                "None"
              ]
            ]
          }
        },
        {
          "title": "create_dataset_manifest example",
          "body": "",
          "code": "from arclm import create_dataset_manifest\n\nprint(create_dataset_manifest)",
          "language": "python"
        },
        {
          "title": "create_epoch_checkpoint_callback",
          "body": "Oude alias voor `create_checkpoint_callback`. Canonical import: from arclm import create_epoch_checkpoint_callback. Fully qualified name: arclm.create_epoch_checkpoint_callback. Status: Stable."
        },
        {
          "title": "create_epoch_checkpoint_callback parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "config",
                "Any",
                "required"
              ],
              [
                "tokenizer",
                "Any",
                "required"
              ],
              [
                "vocab_size",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "create_epoch_checkpoint_callback example",
          "body": "",
          "code": "from arclm import create_epoch_checkpoint_callback\n\nprint(create_epoch_checkpoint_callback)",
          "language": "python"
        },
        {
          "title": "create_instruction_dataloader",
          "body": "Maakt een DataLoader voor instruction tuning. Canonical import: from arclm import create_instruction_dataloader. Fully qualified name: arclm.create_instruction_dataloader. Status: Stable."
        },
        {
          "title": "create_instruction_dataloader parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "instructions",
                "Any",
                "required"
              ],
              [
                "responses",
                "Any",
                "required"
              ],
              [
                "tokenizer",
                "Any",
                "required"
              ],
              [
                "block_size",
                "Any",
                "required"
              ],
              [
                "batch_size",
                "Any",
                "required"
              ],
              [
                "shuffle",
                "Any",
                "True"
              ]
            ]
          }
        },
        {
          "title": "create_instruction_dataloader example",
          "body": "",
          "code": "from arclm import create_instruction_dataloader\n\nprint(create_instruction_dataloader)",
          "language": "python"
        },
        {
          "title": "create_simple_interface_app",
          "body": "Create the optional Flask app for ArcLM's simple web interface. Canonical import: from arclm import create_simple_interface_app. Fully qualified name: arclm.create_simple_interface_app. Status: Stable."
        },
        {
          "title": "create_simple_interface_app parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "create_simple_interface_app example",
          "body": "",
          "code": "from arclm import create_simple_interface_app\n\nprint(create_simple_interface_app)",
          "language": "python"
        },
        {
          "title": "create_symbols",
          "body": "Maakt meerdere symbolen en geeft ze terug in een dict. Canonical import: from arclm import create_symbols. Fully qualified name: arclm.create_symbols. Status: Stable."
        },
        {
          "title": "create_symbols parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "names",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "create_symbols example",
          "body": "",
          "code": "from arclm import create_symbols\n\nprint(create_symbols)",
          "language": "python"
        },
        {
          "title": "create_tokenizer",
          "body": "Maakt een tokenizer met een korte type-naam. Canonical import: from arclm import create_tokenizer. Fully qualified name: arclm.create_tokenizer. Status: Stable."
        },
        {
          "title": "create_tokenizer parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "tokenizer_type",
                "Any",
                "'word'"
              ],
              [
                "kwargs",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "create_tokenizer example",
          "body": "",
          "code": "from arclm import create_tokenizer\n\nprint(create_tokenizer)",
          "language": "python"
        },
        {
          "title": "deduplicate",
          "body": "Verwijdert exacte duplicaten met `ExactDeduplicator`. Canonical import: from arclm import deduplicate. Fully qualified name: arclm.deduplicate. Status: Stable."
        },
        {
          "title": "deduplicate parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "dataset",
                "Any",
                "required"
              ],
              [
                "return_result",
                "bool",
                "False"
              ],
              [
                "kwargs",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "deduplicate example",
          "body": "",
          "code": "from arclm import deduplicate\n\nprint(deduplicate)",
          "language": "python"
        },
        {
          "title": "evaluate",
          "body": "Voert evaluatie uit met de standaard `Evaluator`. Canonical import: from arclm import evaluate. Fully qualified name: arclm.evaluate. Status: Stable."
        },
        {
          "title": "evaluate parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "model",
                "Any",
                "required"
              ],
              [
                "dataset",
                "Any",
                "None"
              ],
              [
                "metrics",
                "Any",
                "None"
              ],
              [
                "config",
                "Any",
                "None"
              ],
              [
                "kwargs",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "evaluate example",
          "body": "",
          "code": "from arclm import evaluate\n\nprint(evaluate)",
          "language": "python"
        },
        {
          "title": "export_metrics_to_json",
          "body": "Export metrics report to JSON file. Canonical import: from arclm import export_metrics_to_json. Fully qualified name: arclm.export_metrics_to_json. Status: Stable."
        },
        {
          "title": "export_metrics_to_json parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "metrics_report",
                "Any",
                "required"
              ],
              [
                "filepath",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "export_metrics_to_json example",
          "body": "",
          "code": "from arclm import export_metrics_to_json\n\nprint(export_metrics_to_json)",
          "language": "python"
        },
        {
          "title": "export_metrics_to_markdown",
          "body": "Export metrics report to Markdown file. Canonical import: from arclm import export_metrics_to_markdown. Fully qualified name: arclm.export_metrics_to_markdown. Status: Stable."
        },
        {
          "title": "export_metrics_to_markdown parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "metrics_report",
                "Any",
                "required"
              ],
              [
                "filepath",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "export_metrics_to_markdown example",
          "body": "",
          "code": "from arclm import export_metrics_to_markdown\n\nprint(export_metrics_to_markdown)",
          "language": "python"
        },
        {
          "title": "fine_tune_external_model",
          "body": "Fine-tune an external model through supported ArcLM training backends. Canonical import: from arclm import fine_tune_external_model. Fully qualified name: arclm.fine_tune_external_model. Status: Stable."
        },
        {
          "title": "fine_tune_external_model parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "model",
                "str",
                "required"
              ],
              [
                "dataset",
                "str",
                "required"
              ],
              [
                "output_dir",
                "str",
                "required"
              ],
              [
                "method",
                "str",
                "'sft'"
              ],
              [
                "backend",
                "str",
                "'huggingface'"
              ],
              [
                "use_lora",
                "bool",
                "True"
              ],
              [
                "assistant_only_loss",
                "bool",
                "True"
              ],
              [
                "save_config",
                "Optional[ModelSaveConfig]",
                "None"
              ],
              [
                "kwargs",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "fine_tune_external_model example",
          "body": "",
          "code": "from arclm import fine_tune_external_model\n\nprint(fine_tune_external_model)",
          "language": "python"
        },
        {
          "title": "fine_tune_native_model",
          "body": "Fine-tune a native ArcLM checkpoint via ``train_model``. Canonical import: from arclm import fine_tune_native_model. Fully qualified name: arclm.fine_tune_native_model. Status: Stable."
        },
        {
          "title": "fine_tune_native_model parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "data",
                "str",
                "required"
              ],
              [
                "output",
                "str",
                "required"
              ],
              [
                "checkpoint",
                "str",
                "required"
              ],
              [
                "kwargs",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "fine_tune_native_model example",
          "body": "",
          "code": "from arclm import fine_tune_native_model\n\nprint(fine_tune_native_model)",
          "language": "python"
        },
        {
          "title": "format_concept_benchmark_report",
          "body": "Create a readable concept benchmark report. Canonical import: from arclm import format_concept_benchmark_report. Fully qualified name: arclm.format_concept_benchmark_report. Status: Stable."
        },
        {
          "title": "format_concept_benchmark_report parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "report",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "format_concept_benchmark_report example",
          "body": "",
          "code": "from arclm import format_concept_benchmark_report\n\nprint(format_concept_benchmark_report)",
          "language": "python"
        },
        {
          "title": "format_duration",
          "body": "Zet seconden om naar uren, minuten en seconden. Canonical import: from arclm import format_duration. Fully qualified name: arclm.format_duration. Status: Stable."
        },
        {
          "title": "format_duration parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "total_seconds",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "format_duration example",
          "body": "",
          "code": "from arclm import format_duration\n\nprint(format_duration)",
          "language": "python"
        },
        {
          "title": "format_long_context_results",
          "body": "Create a readable long-context comparison report. Canonical import: from arclm import format_long_context_results. Fully qualified name: arclm.format_long_context_results. Status: Stable."
        },
        {
          "title": "format_long_context_results parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "results",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "format_long_context_results example",
          "body": "",
          "code": "from arclm import format_long_context_results\n\nprint(format_long_context_results)",
          "language": "python"
        },
        {
          "title": "format_tokenizer_coverage_report",
          "body": "Create a readable tokenizer coverage report. Canonical import: from arclm import format_tokenizer_coverage_report. Fully qualified name: arclm.format_tokenizer_coverage_report. Status: Stable."
        },
        {
          "title": "format_tokenizer_coverage_report parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "coverage",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "format_tokenizer_coverage_report example",
          "body": "",
          "code": "from arclm import format_tokenizer_coverage_report\n\nprint(format_tokenizer_coverage_report)",
          "language": "python"
        },
        {
          "title": "format_top_k_predictions",
          "body": "Create a readable diagnostic report for one prompt. Canonical import: from arclm import format_top_k_predictions. Fully qualified name: arclm.format_top_k_predictions. Status: Stable."
        },
        {
          "title": "format_top_k_predictions parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "prompt",
                "Any",
                "required"
              ],
              [
                "predictions",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "format_top_k_predictions example",
          "body": "",
          "code": "from arclm import format_top_k_predictions\n\nprint(format_top_k_predictions)",
          "language": "python"
        },
        {
          "title": "get_api_version",
          "body": "Return the installed ArcLM API version. Canonical import: from arclm import get_api_version. Fully qualified name: arclm.get_api_version. Status: Stable."
        },
        {
          "title": "get_api_version parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "get_api_version example",
          "body": "",
          "code": "from arclm import get_api_version\n\nprint(get_api_version)",
          "language": "python"
        },
        {
          "title": "get_device",
          "body": "Return the preferred local torch device. Canonical import: from arclm import get_device. Fully qualified name: arclm.get_device. Status: Stable."
        },
        {
          "title": "get_device parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "get_device example",
          "body": "",
          "code": "from arclm import get_device\n\nprint(get_device)",
          "language": "python"
        },
        {
          "title": "get_model_capability",
          "body": "Return the capability report for a known exact model path. Canonical import: from arclm import get_model_capability. Fully qualified name: arclm.get_model_capability. Status: Stable."
        },
        {
          "title": "get_model_capability parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "model",
                "str",
                "required"
              ]
            ]
          }
        },
        {
          "title": "get_model_capability example",
          "body": "",
          "code": "from arclm import get_model_capability\n\nprint(get_model_capability)",
          "language": "python"
        },
        {
          "title": "get_sft_record_contract",
          "body": "Describe one supported SFT record format. Canonical import: from arclm import get_sft_record_contract. Fully qualified name: arclm.get_sft_record_contract. Status: Stable."
        },
        {
          "title": "get_sft_record_contract parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "formatter",
                "str",
                "'instruction_response'"
              ]
            ]
          }
        },
        {
          "title": "get_sft_record_contract example",
          "body": "",
          "code": "from arclm import get_sft_record_contract\n\nprint(get_sft_record_contract)",
          "language": "python"
        },
        {
          "title": "get_tokenizer_from_config",
          "body": "Maakt een tokenizer vanuit een config object. Canonical import: from arclm import get_tokenizer_from_config. Fully qualified name: arclm.get_tokenizer_from_config. Status: Stable."
        },
        {
          "title": "get_tokenizer_from_config parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "config",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "get_tokenizer_from_config example",
          "body": "",
          "code": "from arclm import get_tokenizer_from_config\n\nprint(get_tokenizer_from_config)",
          "language": "python"
        },
        {
          "title": "get_version",
          "body": "Return the installed ArcLM version. Canonical import: from arclm import get_version. Fully qualified name: arclm.get_version. Status: Stable."
        },
        {
          "title": "get_version parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "get_version example",
          "body": "",
          "code": "from arclm import get_version\n\nprint(get_version)",
          "language": "python"
        },
        {
          "title": "inspect_model_source",
          "body": "Inspect a local path or Hugging Face model ID before loading. Canonical import: from arclm import inspect_model_source. Fully qualified name: arclm.inspect_model_source. Status: Stable."
        },
        {
          "title": "inspect_model_source parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "source",
                "PathLike",
                "required"
              ],
              [
                "kwargs",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "inspect_model_source example",
          "body": "",
          "code": "from arclm import inspect_model_source\n\nprint(inspect_model_source)",
          "language": "python"
        },
        {
          "title": "inspect_text",
          "body": "Inspect one native ArcLM text-generation step. Canonical import: from arclm import inspect_text. Fully qualified name: arclm.inspect_text. Status: Stable."
        },
        {
          "title": "inspect_text parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "model",
                "Any",
                "required"
              ],
              [
                "tokenizer",
                "Any",
                "required"
              ],
              [
                "text",
                "str",
                "required"
              ],
              [
                "max_new_tokens",
                "int",
                "1"
              ],
              [
                "temperature",
                "float",
                "1.0"
              ],
              [
                "repetition_penalty",
                "float",
                "1.0"
              ],
              [
                "top_k",
                "int | None",
                "None"
              ],
              [
                "top_p",
                "float | None",
                "None"
              ],
              [
                "include_values",
                "bool",
                "False"
              ],
              [
                "max_values",
                "int",
                "20"
              ]
            ]
          }
        },
        {
          "title": "inspect_text example",
          "body": "",
          "code": "from arclm import inspect_text\n\nprint(inspect_text)",
          "language": "python"
        },
        {
          "title": "list_available_models",
          "body": "List local ``.pth`` checkpoints in a models directory. Canonical import: from arclm import list_available_models. Fully qualified name: arclm.list_available_models. Status: Stable."
        },
        {
          "title": "list_available_models parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "models_dir",
                "str | Path",
                "'models'"
              ]
            ]
          }
        },
        {
          "title": "list_available_models example",
          "body": "",
          "code": "from arclm import list_available_models\n\nprint(list_available_models)",
          "language": "python"
        },
        {
          "title": "load_any_model",
          "body": "Load any supported ArcLM or Hugging Face causal LM source for inference. Canonical import: from arclm import load_any_model. Fully qualified name: arclm.load_any_model. Status: Stable."
        },
        {
          "title": "load_any_model parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "source",
                "PathLike",
                "required"
              ],
              [
                "kwargs",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "load_any_model example",
          "body": "",
          "code": "from arclm import load_any_model\n\nprint(load_any_model)",
          "language": "python"
        },
        {
          "title": "load_compatible_checkpoint",
          "body": "Laadt een bestaand checkpoint als het past bij deze training. Canonical import: from arclm import load_compatible_checkpoint. Fully qualified name: arclm.load_compatible_checkpoint. Status: Stable."
        },
        {
          "title": "load_compatible_checkpoint parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "trainer",
                "Any",
                "required"
              ],
              [
                "config",
                "Any",
                "required"
              ],
              [
                "vocab_size",
                "Any",
                "required"
              ],
              [
                "tokenizer",
                "Any",
                "None"
              ]
            ]
          }
        },
        {
          "title": "load_compatible_checkpoint example",
          "body": "",
          "code": "from arclm import load_compatible_checkpoint\n\nprint(load_compatible_checkpoint)",
          "language": "python"
        },
        {
          "title": "load_dataset",
          "body": "Laadt een dataset met de standaard DatasetLoader. Canonical import: from arclm import load_dataset. Fully qualified name: arclm.load_dataset. Status: Stable."
        },
        {
          "title": "load_dataset parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "source",
                "Any",
                "required"
              ],
              [
                "kwargs",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "load_dataset example",
          "body": "",
          "code": "from arclm import load_dataset\n\nprint(load_dataset)",
          "language": "python"
        },
        {
          "title": "load_external_for_inference",
          "body": "Backward-friendly alias for :func:`load_any_model`. Canonical import: from arclm import load_external_for_inference. Fully qualified name: arclm.load_external_for_inference. Status: Stable."
        },
        {
          "title": "load_external_for_inference parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "source",
                "PathLike",
                "required"
              ],
              [
                "kwargs",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "load_external_for_inference example",
          "body": "",
          "code": "from arclm import load_external_for_inference\n\nprint(load_external_for_inference)",
          "language": "python"
        },
        {
          "title": "load_external_model",
          "body": "Load any supported external source into a normalized checkpoint bundle. Canonical import: from arclm import load_external_model. Fully qualified name: arclm.load_external_model. Status: Stable."
        },
        {
          "title": "load_external_model parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "source",
                "Any",
                "required"
              ],
              [
                "map_location",
                "str",
                "'cpu'"
              ]
            ]
          }
        },
        {
          "title": "load_external_model example",
          "body": "",
          "code": "from arclm import load_external_model\n\nprint(load_external_model)",
          "language": "python"
        },
        {
          "title": "load_model",
          "body": "Load a trained ArcLM checkpoint for inference. Canonical import: from arclm import load_model. Fully qualified name: arclm.load_model. Status: Stable."
        },
        {
          "title": "load_model parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "model_path",
                "Any",
                "None"
              ],
              [
                "device",
                "Any",
                "None"
              ],
              [
                "prefer_best",
                "Any",
                "True"
              ]
            ]
          }
        },
        {
          "title": "load_model example",
          "body": "",
          "code": "from arclm import load_model\n\nprint(load_model)",
          "language": "python"
        },
        {
          "title": "load_tokens",
          "body": "Laadt tokens uit de ingestelde dataset en optioneel uit domeindata. Canonical import: from arclm import load_tokens. Fully qualified name: arclm.load_tokens. Status: Stable."
        },
        {
          "title": "load_tokens parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "config",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "load_tokens example",
          "body": "",
          "code": "from arclm import load_tokens\n\nprint(load_tokens)",
          "language": "python"
        },
        {
          "title": "load_training_checkpoint",
          "body": "Load a trusted ArcLM/PyTorch training checkpoint. Canonical import: from arclm import load_training_checkpoint. Fully qualified name: arclm.load_training_checkpoint. Status: Stable."
        },
        {
          "title": "load_training_checkpoint parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "path",
                "str | Path",
                "required"
              ],
              [
                "device_type",
                "str",
                "'cpu'"
              ]
            ]
          }
        },
        {
          "title": "load_training_checkpoint example",
          "body": "",
          "code": "from arclm import load_training_checkpoint\n\nprint(load_training_checkpoint)",
          "language": "python"
        },
        {
          "title": "model_check",
          "body": "Controleert of kennis altijd de query waar maakt. Canonical import: from arclm import model_check. Fully qualified name: arclm.model_check. Status: Stable."
        },
        {
          "title": "model_check parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "knowledge",
                "Any",
                "required"
              ],
              [
                "query",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "model_check example",
          "body": "",
          "code": "from arclm import model_check\n\nprint(model_check)",
          "language": "python"
        },
        {
          "title": "model_support_matrix",
          "body": "Return the compact support matrix for the official 0.8 model set. Canonical import: from arclm import model_support_matrix. Fully qualified name: arclm.model_support_matrix. Status: Stable."
        },
        {
          "title": "model_support_matrix parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "model_support_matrix example",
          "body": "",
          "code": "from arclm import model_support_matrix\n\nprint(model_support_matrix)",
          "language": "python"
        },
        {
          "title": "predict",
          "body": "Predict with a cached model using the same defaults as load_model(). Canonical import: from arclm import predict. Fully qualified name: arclm.predict. Status: Stable."
        },
        {
          "title": "predict parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "input_text",
                "Any",
                "required"
              ],
              [
                "model_path",
                "Any",
                "None"
              ],
              [
                "device",
                "Any",
                "None"
              ],
              [
                "reload",
                "Any",
                "False"
              ],
              [
                "generation_options",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "predict example",
          "body": "",
          "code": "from arclm import predict\n\nprint(predict)",
          "language": "python"
        },
        {
          "title": "predict_external",
          "body": "Load a source and return a single prediction. Canonical import: from arclm import predict_external. Fully qualified name: arclm.predict_external. Status: Stable."
        },
        {
          "title": "predict_external parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "source",
                "PathLike",
                "required"
              ],
              [
                "prompt",
                "str",
                "required"
              ],
              [
                "kwargs",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "predict_external example",
          "body": "",
          "code": "from arclm import predict_external\n\nprint(predict_external)",
          "language": "python"
        },
        {
          "title": "predict_top_k",
          "body": "Return the top-k next-token probabilities for a prompt. Canonical import: from arclm import predict_top_k. Fully qualified name: arclm.predict_top_k. Status: Stable."
        },
        {
          "title": "predict_top_k parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "model",
                "Any",
                "required"
              ],
              [
                "stoi",
                "Any",
                "required"
              ],
              [
                "itos",
                "Any",
                "required"
              ],
              [
                "block_size",
                "Any",
                "required"
              ],
              [
                "device",
                "Any",
                "required"
              ],
              [
                "prompt",
                "Any",
                "required"
              ],
              [
                "k",
                "Any",
                "5"
              ],
              [
                "tokenizer",
                "Any",
                "None"
              ]
            ]
          }
        },
        {
          "title": "predict_top_k example",
          "body": "",
          "code": "from arclm import predict_top_k\n\nprint(predict_top_k)",
          "language": "python"
        },
        {
          "title": "prepare_data",
          "body": "Maakt tokens, splits, tokenizer en DataLoaders klaar voor training. Canonical import: from arclm import prepare_data. Fully qualified name: arclm.prepare_data. Status: Stable."
        },
        {
          "title": "prepare_data parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "config",
                "Config",
                "required"
              ],
              [
                "existing_tokenizer",
                "Any",
                "None"
              ]
            ]
          }
        },
        {
          "title": "prepare_data example",
          "body": "",
          "code": "from arclm import prepare_data\n\nprint(prepare_data)",
          "language": "python"
        },
        {
          "title": "read_tokens",
          "body": "Leest lowercase whitespace tokens uit een tekstbestand en bewaart newlines. Canonical import: from arclm import read_tokens. Fully qualified name: arclm.read_tokens. Status: Stable."
        },
        {
          "title": "read_tokens parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "path",
                "Any",
                "required"
              ],
              [
                "limit",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "read_tokens example",
          "body": "",
          "code": "from arclm import read_tokens\n\nprint(read_tokens)",
          "language": "python"
        },
        {
          "title": "register_model_inspector",
          "body": "Register a custom model-source inspector. Canonical import: from arclm import register_model_inspector. Fully qualified name: arclm.register_model_inspector. Status: Stable."
        },
        {
          "title": "register_model_inspector parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "inspector",
                "ModelInspector",
                "required"
              ]
            ]
          }
        },
        {
          "title": "register_model_inspector example",
          "body": "",
          "code": "from arclm import register_model_inspector\n\nprint(register_model_inspector)",
          "language": "python"
        },
        {
          "title": "report_environment",
          "body": "Return a short human-readable runtime report. Canonical import: from arclm import report_environment. Fully qualified name: arclm.report_environment. Status: Stable."
        },
        {
          "title": "report_environment parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "models_dir",
                "str | Path",
                "'models'"
              ]
            ]
          }
        },
        {
          "title": "report_environment example",
          "body": "",
          "code": "from arclm import report_environment\n\nprint(report_environment)",
          "language": "python"
        },
        {
          "title": "run_long_context_evaluation",
          "body": "Train and compare multiple block sizes by validation loss and concepts. Canonical import: from arclm import run_long_context_evaluation. Fully qualified name: arclm.run_long_context_evaluation. Status: Stable."
        },
        {
          "title": "run_long_context_evaluation parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "base_config",
                "Any",
                "required"
              ],
              [
                "block_sizes",
                "Any",
                "(32, 64, 128)"
              ],
              [
                "benchmark_cases",
                "Any",
                "None"
              ],
              [
                "sample_prompt",
                "Any",
                "'Programming is'"
              ]
            ]
          }
        },
        {
          "title": "run_long_context_evaluation example",
          "body": "",
          "code": "from arclm import run_long_context_evaluation\n\nprint(run_long_context_evaluation)",
          "language": "python"
        },
        {
          "title": "run_simple_interface",
          "body": "Run ArcLM's optional simple web interface. Canonical import: from arclm import run_simple_interface. Fully qualified name: arclm.run_simple_interface. Status: Stable."
        },
        {
          "title": "run_simple_interface parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "args",
                "Any",
                "required"
              ],
              [
                "kwargs",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "run_simple_interface example",
          "body": "",
          "code": "from arclm import run_simple_interface\n\nprint(run_simple_interface)",
          "language": "python"
        },
        {
          "title": "save_loaded_model",
          "body": "Save a loaded model according to :class:`ModelSaveConfig`. Canonical import: from arclm import save_loaded_model. Fully qualified name: arclm.save_loaded_model. Status: Stable."
        },
        {
          "title": "save_loaded_model parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "loaded_model",
                "ExternalLoadedModel",
                "required"
              ],
              [
                "output_dir",
                "PathLike",
                "required"
              ],
              [
                "save_config",
                "Optional[ModelSaveConfig]",
                "None"
              ]
            ]
          }
        },
        {
          "title": "save_loaded_model example",
          "body": "",
          "code": "from arclm import save_loaded_model\n\nprint(save_loaded_model)",
          "language": "python"
        },
        {
          "title": "save_training_checkpoint",
          "body": "Slaat een trainer checkpoint op met tokenizer metadata. Canonical import: from arclm import save_training_checkpoint. Fully qualified name: arclm.save_training_checkpoint. Status: Stable."
        },
        {
          "title": "save_training_checkpoint parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "trainer",
                "Any",
                "required"
              ],
              [
                "config",
                "Any",
                "required"
              ],
              [
                "tokenizer",
                "Any",
                "required"
              ],
              [
                "vocab_size",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "save_training_checkpoint example",
          "body": "",
          "code": "from arclm import save_training_checkpoint\n\nprint(save_training_checkpoint)",
          "language": "python"
        },
        {
          "title": "score_concept_relationships",
          "body": "Score expected concepts against top-k next-token predictions. Canonical import: from arclm import score_concept_relationships. Fully qualified name: arclm.score_concept_relationships. Status: Stable."
        },
        {
          "title": "score_concept_relationships parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "model",
                "Any",
                "required"
              ],
              [
                "stoi",
                "Any",
                "required"
              ],
              [
                "itos",
                "Any",
                "required"
              ],
              [
                "block_size",
                "Any",
                "required"
              ],
              [
                "device",
                "Any",
                "required"
              ],
              [
                "benchmark_cases",
                "Any",
                "None"
              ],
              [
                "k",
                "Any",
                "10"
              ],
              [
                "tokenizer",
                "Any",
                "None"
              ]
            ]
          }
        },
        {
          "title": "score_concept_relationships example",
          "body": "",
          "code": "from arclm import score_concept_relationships\n\nprint(score_concept_relationships)",
          "language": "python"
        },
        {
          "title": "split_train_val",
          "body": "Splitst tokens in train en validatie data. Canonical import: from arclm import split_train_val. Fully qualified name: arclm.split_train_val. Status: Stable."
        },
        {
          "title": "split_train_val parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "tokens",
                "Any",
                "required"
              ],
              [
                "validation_split",
                "Any",
                "required"
              ],
              [
                "block_size",
                "Any",
                "required"
              ],
              [
                "seed",
                "Any",
                "42"
              ]
            ]
          }
        },
        {
          "title": "split_train_val example",
          "body": "",
          "code": "from arclm import split_train_val\n\nprint(split_train_val)",
          "language": "python"
        },
        {
          "title": "tokenizer_from_checkpoint",
          "body": "Haalt een ArcLM tokenizer uit een checkpoint of checkpoint-pad. Canonical import: from arclm import tokenizer_from_checkpoint. Fully qualified name: arclm.tokenizer_from_checkpoint. Status: Stable."
        },
        {
          "title": "tokenizer_from_checkpoint parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "checkpoint_or_source",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "tokenizer_from_checkpoint example",
          "body": "",
          "code": "from arclm import tokenizer_from_checkpoint\n\nprint(tokenizer_from_checkpoint)",
          "language": "python"
        },
        {
          "title": "train_model",
          "body": "Traint een ArcLM model in pretrain, finetune of continue_training mode. Canonical import: from arclm import train_model. Fully qualified name: arclm.train_model. Status: Stable."
        },
        {
          "title": "train_model parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "mode",
                "str",
                "required"
              ],
              [
                "data",
                "str",
                "required"
              ],
              [
                "output",
                "str",
                "required"
              ],
              [
                "checkpoint",
                "Optional",
                "None"
              ],
              [
                "config",
                "Optional",
                "None"
              ],
              [
                "tokenizer",
                "Any",
                "None"
              ],
              [
                "config_overrides",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "train_model example",
          "body": "",
          "code": "from arclm import train_model\n\nprint(train_model)",
          "language": "python"
        },
        {
          "title": "train_native_model",
          "body": "Train a native ArcLM model by delegating to ``train_model(mode='pretrain')``. Canonical import: from arclm import train_native_model. Fully qualified name: arclm.train_native_model. Status: Stable."
        },
        {
          "title": "train_native_model parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "data",
                "str",
                "required"
              ],
              [
                "output",
                "str",
                "required"
              ],
              [
                "kwargs",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "train_native_model example",
          "body": "",
          "code": "from arclm import train_native_model\n\nprint(train_native_model)",
          "language": "python"
        },
        {
          "title": "train_sft",
          "body": "Run supervised fine-tuning through an ArcLM backend. Canonical import: from arclm import train_sft. Fully qualified name: arclm.train_sft. Status: Stable."
        },
        {
          "title": "train_sft parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "model",
                "str",
                "required"
              ],
              [
                "dataset",
                "str",
                "required"
              ],
              [
                "output_dir",
                "str",
                "required"
              ],
              [
                "backend",
                "str",
                "'huggingface'"
              ],
              [
                "assistant_only_loss",
                "bool",
                "True"
              ],
              [
                "use_lora",
                "bool",
                "False"
              ],
              [
                "batch_size",
                "int",
                "1"
              ],
              [
                "gradient_accumulation_steps",
                "int",
                "1"
              ],
              [
                "learning_rate",
                "float",
                "0.0002"
              ],
              [
                "num_epochs",
                "int",
                "1"
              ],
              [
                "max_length",
                "int",
                "1024"
              ],
              [
                "dtype",
                "str",
                "'auto'"
              ],
              [
                "device_map",
                "Optional[str]",
                "None"
              ],
              [
                "trust_remote_code",
                "bool",
                "False"
              ],
              [
                "enable_thinking",
                "Optional[bool]",
                "False"
              ],
              [
                "lora_r",
                "int",
                "8"
              ],
              [
                "lora_alpha",
                "int",
                "16"
              ],
              [
                "lora_dropout",
                "float",
                "0.05"
              ],
              [
                "lora_target_modules",
                "Optional[Sequence[str]]",
                "None"
              ],
              [
                "max_steps",
                "Optional[int]",
                "None"
              ],
              [
                "seed",
                "int",
                "42"
              ],
              [
                "save_tokenizer",
                "bool",
                "True"
              ]
            ]
          }
        },
        {
          "title": "train_sft example",
          "body": "",
          "code": "from arclm import train_sft\n\nprint(train_sft)",
          "language": "python"
        },
        {
          "title": "validate_records",
          "body": "Validate mapping records with a small schema. Canonical import: from arclm import validate_records. Fully qualified name: arclm.validate_records. Status: Stable."
        },
        {
          "title": "validate_records parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "records",
                "Iterable[Mapping[str, Any]]",
                "required"
              ],
              [
                "required_fields",
                "Sequence[str]",
                "required"
              ],
              [
                "field_types",
                "Mapping[str, type | tuple[type, ...]] | None",
                "None"
              ],
              [
                "allow_empty",
                "bool",
                "False"
              ],
              [
                "strict",
                "bool",
                "True"
              ],
              [
                "record_id_field",
                "str | None",
                "None"
              ]
            ]
          }
        },
        {
          "title": "validate_records example",
          "body": "",
          "code": "from arclm import validate_records\n\nprint(validate_records)",
          "language": "python"
        },
        {
          "title": "validate_sft_records",
          "body": "Validate SFT records through the canonical fine-tuning normalizer. Canonical import: from arclm import validate_sft_records. Fully qualified name: arclm.validate_sft_records. Status: Stable."
        },
        {
          "title": "validate_sft_records parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "records",
                "Iterable[Mapping[str, Any]]",
                "required"
              ],
              [
                "config",
                "FineTuningConfig | None",
                "None"
              ],
              [
                "strict",
                "bool",
                "True"
              ]
            ]
          }
        },
        {
          "title": "validate_sft_records example",
          "body": "",
          "code": "from arclm import validate_sft_records\n\nprint(validate_sft_records)",
          "language": "python"
        },
        {
          "title": "validate_tokenizer_compatibility",
          "body": "Raise if a tokenizer cannot safely address the checkpoint vocabulary. Canonical import: from arclm import validate_tokenizer_compatibility. Fully qualified name: arclm.validate_tokenizer_compatibility. Status: Stable."
        },
        {
          "title": "validate_tokenizer_compatibility parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "checkpoint",
                "LoadedCheckpoint",
                "required"
              ],
              [
                "tokenizer",
                "Optional",
                "None"
              ],
              [
                "config",
                "Optional",
                "None"
              ]
            ]
          }
        },
        {
          "title": "validate_tokenizer_compatibility example",
          "body": "",
          "code": "from arclm import validate_tokenizer_compatibility\n\nprint(validate_tokenizer_compatibility)",
          "language": "python"
        }
      ],
      "status": "Stable"
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
          "title": "BaseAugmenter",
          "body": "Basis class voor eigen data augmenters. Canonical import: from arclm.datasets import BaseAugmenter. Fully qualified name: arclm.datasets.BaseAugmenter. Status: Stable."
        },
        {
          "title": "BaseAugmenter parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "BaseAugmenter example",
          "body": "",
          "code": "from arclm.datasets import BaseAugmenter\n\nprint(BaseAugmenter)",
          "language": "python"
        },
        {
          "title": "BaseCleaner",
          "body": "Basis class voor eigen data cleaners. Canonical import: from arclm.datasets import BaseCleaner. Fully qualified name: arclm.datasets.BaseCleaner. Status: Stable."
        },
        {
          "title": "BaseCleaner parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "BaseCleaner example",
          "body": "",
          "code": "from arclm.datasets import BaseCleaner\n\nprint(BaseCleaner)",
          "language": "python"
        },
        {
          "title": "BaseDataset",
          "body": "Basis class voor datasets met lengte en index-toegang. Canonical import: from arclm.datasets import BaseDataset. Fully qualified name: arclm.datasets.BaseDataset. Status: Stable."
        },
        {
          "title": "BaseDataset parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "BaseDataset example",
          "body": "",
          "code": "from arclm.datasets import BaseDataset\n\nprint(BaseDataset)",
          "language": "python"
        },
        {
          "title": "BaseDataStep",
          "body": "Basis class voor een stap die een voorbeeld verwerkt. Canonical import: from arclm.datasets import BaseDataStep. Fully qualified name: arclm.datasets.BaseDataStep. Status: Stable."
        },
        {
          "title": "BaseDataStep parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "BaseDataStep example",
          "body": "",
          "code": "from arclm.datasets import BaseDataStep\n\nprint(BaseDataStep)",
          "language": "python"
        },
        {
          "title": "BaseDeduplicator",
          "body": "Basis class voor deduplicatie over een hele dataset. Canonical import: from arclm.datasets import BaseDeduplicator. Fully qualified name: arclm.datasets.BaseDeduplicator. Status: Stable."
        },
        {
          "title": "BaseDeduplicator parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "BaseDeduplicator example",
          "body": "",
          "code": "from arclm.datasets import BaseDeduplicator\n\nprint(BaseDeduplicator)",
          "language": "python"
        },
        {
          "title": "BaseStreamingDataset",
          "body": "Basis class voor datasets die je alleen kunt doorlopen. Canonical import: from arclm.datasets import BaseStreamingDataset. Fully qualified name: arclm.datasets.BaseStreamingDataset. Status: Stable."
        },
        {
          "title": "BaseStreamingDataset parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "BaseStreamingDataset example",
          "body": "",
          "code": "from arclm.datasets import BaseStreamingDataset\n\nprint(BaseStreamingDataset)",
          "language": "python"
        },
        {
          "title": "BaseSyntheticDataGenerator",
          "body": "Basis class voor eigen synthetic-data generators. Canonical import: from arclm.datasets import BaseSyntheticDataGenerator. Fully qualified name: arclm.datasets.BaseSyntheticDataGenerator. Status: Stable."
        },
        {
          "title": "BaseSyntheticDataGenerator parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "BaseSyntheticDataGenerator example",
          "body": "",
          "code": "from arclm.datasets import BaseSyntheticDataGenerator\n\nprint(BaseSyntheticDataGenerator)",
          "language": "python"
        },
        {
          "title": "DataAugmenter",
          "body": "Basis class voor eigen data augmenters. Canonical import: from arclm.datasets import DataAugmenter. Fully qualified name: arclm.datasets.DataAugmenter. Status: Stable."
        },
        {
          "title": "DataAugmenter parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "DataAugmenter example",
          "body": "",
          "code": "from arclm.datasets import DataAugmenter\n\nprint(DataAugmenter)",
          "language": "python"
        },
        {
          "title": "DataBundle",
          "body": "Bundel met tokens, tokenizer en loaders voor training. Canonical import: from arclm.datasets import DataBundle. Fully qualified name: arclm.datasets.DataBundle. Status: Stable."
        },
        {
          "title": "DataBundle parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "tokens",
                "list",
                "required"
              ],
              [
                "train_tokens",
                "list",
                "required"
              ],
              [
                "val_tokens",
                "list",
                "required"
              ],
              [
                "tokenizer",
                "Tokenizer | SentencePieceTokenizer | None",
                "required"
              ],
              [
                "train_loader",
                "object",
                "required"
              ],
              [
                "val_loader",
                "object",
                "required"
              ],
              [
                "train_encoded",
                "list",
                "required"
              ],
              [
                "val_encoded",
                "list",
                "required"
              ]
            ]
          }
        },
        {
          "title": "DataBundle example",
          "body": "",
          "code": "from arclm.datasets import DataBundle\n\nprint(DataBundle)",
          "language": "python"
        },
        {
          "title": "DataCleaner",
          "body": "Basis class voor eigen data cleaners. Canonical import: from arclm.datasets import DataCleaner. Fully qualified name: arclm.datasets.DataCleaner. Status: Stable."
        },
        {
          "title": "DataCleaner parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "DataCleaner example",
          "body": "",
          "code": "from arclm.datasets import DataCleaner\n\nprint(DataCleaner)",
          "language": "python"
        },
        {
          "title": "DataPipeline",
          "body": "Voert meerdere data-stappen na elkaar uit. Canonical import: from arclm.datasets import DataPipeline. Fully qualified name: arclm.datasets.DataPipeline. Status: Stable."
        },
        {
          "title": "DataPipeline parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "steps",
                "Iterable[Any] | None",
                "None"
              ],
              [
                "progress_callback",
                "Any",
                "None"
              ]
            ]
          }
        },
        {
          "title": "DataPipeline example",
          "body": "",
          "code": "from arclm.datasets import DataPipeline\n\nprint(DataPipeline)",
          "language": "python"
        },
        {
          "title": "DataProcessor",
          "body": "Compatibility-friendly entry point for ``ProcessedDataset`` workflows. Canonical import: from arclm.datasets import DataProcessor. Fully qualified name: arclm.datasets.DataProcessor. Status: Stable."
        },
        {
          "title": "DataProcessor parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "DataProcessor example",
          "body": "",
          "code": "from arclm.datasets import DataProcessor\n\nprint(DataProcessor)",
          "language": "python"
        },
        {
          "title": "DatasetConfig",
          "body": "Configuratie voor `load_dataset` wanneer je opties wilt hergebruiken. Canonical import: from arclm.datasets import DatasetConfig. Fully qualified name: arclm.datasets.DatasetConfig. Status: Stable."
        },
        {
          "title": "DatasetConfig parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "source",
                "Any",
                "required"
              ],
              [
                "format",
                "str | None",
                "None"
              ],
              [
                "text_field",
                "str",
                "'text'"
              ],
              [
                "required_fields",
                "list[str]",
                "<factory>"
              ],
              [
                "encoding",
                "str",
                "'utf-8'"
              ],
              [
                "streaming",
                "bool",
                "False"
              ]
            ]
          }
        },
        {
          "title": "DatasetConfig example",
          "body": "",
          "code": "from arclm.datasets import DatasetConfig\n\nprint(DatasetConfig)",
          "language": "python"
        },
        {
          "title": "DatasetLoader",
          "body": "Laadt datasets uit simpele lokale bronnen. Canonical import: from arclm.datasets import DatasetLoader. Fully qualified name: arclm.datasets.DatasetLoader. Status: Stable."
        },
        {
          "title": "DatasetLoader parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "config",
                "Any",
                "None"
              ],
              [
                "text_field",
                "str",
                "'text'"
              ],
              [
                "required_fields",
                "Iterable[str] | None",
                "None"
              ],
              [
                "encoding",
                "str",
                "'utf-8'"
              ],
              [
                "format",
                "str | None",
                "None"
              ],
              [
                "streaming",
                "bool",
                "False"
              ]
            ]
          }
        },
        {
          "title": "DatasetLoader example",
          "body": "",
          "code": "from arclm.datasets import DatasetLoader\n\nprint(DatasetLoader)",
          "language": "python"
        },
        {
          "title": "DatasetManifest",
          "body": "Lightweight provenance metadata for a processed dataset. Canonical import: from arclm.datasets import DatasetManifest. Fully qualified name: arclm.datasets.DatasetManifest. Status: Stable."
        },
        {
          "title": "DatasetManifest parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "dataset_name",
                "str",
                "required"
              ],
              [
                "manifest_version",
                "int",
                "required"
              ],
              [
                "source_type",
                "str",
                "required"
              ],
              [
                "source_files",
                "tuple[str, ...]",
                "required"
              ],
              [
                "record_count_before_processing",
                "int",
                "required"
              ],
              [
                "record_count_after_processing",
                "int",
                "required"
              ],
              [
                "invalid_records",
                "int",
                "required"
              ],
              [
                "duplicates_removed",
                "int",
                "required"
              ],
              [
                "text_fields",
                "tuple[str, ...]",
                "required"
              ],
              [
                "transformations_applied",
                "tuple[str, ...]",
                "required"
              ],
              [
                "split_information",
                "dict[str, int]",
                "required"
              ],
              [
                "created_at",
                "float",
                "required"
              ],
              [
                "arclm_version",
                "str",
                "required"
              ]
            ]
          }
        },
        {
          "title": "DatasetManifest example",
          "body": "",
          "code": "from arclm.datasets import DatasetManifest\n\nprint(DatasetManifest)",
          "language": "python"
        },
        {
          "title": "DatasetReport",
          "body": "A compact processed-dataset and tokenization report. Canonical import: from arclm.datasets import DatasetReport. Fully qualified name: arclm.datasets.DatasetReport. Status: Stable."
        },
        {
          "title": "DatasetReport parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "record_count",
                "int",
                "required"
              ],
              [
                "valid_records",
                "int",
                "required"
              ],
              [
                "invalid_records",
                "int",
                "required"
              ],
              [
                "duplicates_removed",
                "int",
                "required"
              ],
              [
                "empty_records_removed",
                "int",
                "required"
              ],
              [
                "train_size",
                "int | None",
                "required"
              ],
              [
                "validation_size",
                "int | None",
                "required"
              ],
              [
                "min_text_length",
                "int",
                "required"
              ],
              [
                "max_text_length",
                "int",
                "required"
              ],
              [
                "average_text_length",
                "float",
                "required"
              ],
              [
                "token_count",
                "int",
                "required"
              ],
              [
                "min_token_length",
                "int",
                "required"
              ],
              [
                "max_token_length",
                "int",
                "required"
              ],
              [
                "average_token_length",
                "float",
                "required"
              ],
              [
                "unknown_token_count",
                "int | None",
                "required"
              ],
              [
                "unknown_token_rate",
                "float | None",
                "required"
              ],
              [
                "truncated_record_count",
                "int",
                "required"
              ],
              [
                "manifest",
                "dict[str, Any] | None",
                "None"
              ]
            ]
          }
        },
        {
          "title": "DatasetReport example",
          "body": "",
          "code": "from arclm.datasets import DatasetReport\n\nprint(DatasetReport)",
          "language": "python"
        },
        {
          "title": "DatasetValidationIssue",
          "body": "One validation problem tied to a record index and field. Canonical import: from arclm.datasets import DatasetValidationIssue. Fully qualified name: arclm.datasets.DatasetValidationIssue. Status: Stable."
        },
        {
          "title": "DatasetValidationIssue parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "index",
                "int",
                "required"
              ],
              [
                "field",
                "str | None",
                "required"
              ],
              [
                "code",
                "str",
                "required"
              ],
              [
                "message",
                "str",
                "required"
              ],
              [
                "record_id",
                "str | None",
                "None"
              ]
            ]
          }
        },
        {
          "title": "DatasetValidationIssue example",
          "body": "",
          "code": "from arclm.datasets import DatasetValidationIssue\n\nprint(DatasetValidationIssue)",
          "language": "python"
        },
        {
          "title": "DatasetValidationResult",
          "body": "Result of validating records against a small field schema. Canonical import: from arclm.datasets import DatasetValidationResult. Fully qualified name: arclm.datasets.DatasetValidationResult. Status: Stable."
        },
        {
          "title": "DatasetValidationResult parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "valid_records",
                "list[dict[str, Any]]",
                "required"
              ],
              [
                "issues",
                "list[DatasetValidationIssue]",
                "required"
              ],
              [
                "total_records",
                "int",
                "required"
              ]
            ]
          }
        },
        {
          "title": "DatasetValidationResult example",
          "body": "",
          "code": "from arclm.datasets import DatasetValidationResult\n\nprint(DatasetValidationResult)",
          "language": "python"
        },
        {
          "title": "DeduplicationResult",
          "body": "Resultaat van een deduplicatie stap. Canonical import: from arclm.datasets import DeduplicationResult. Fully qualified name: arclm.datasets.DeduplicationResult. Status: Stable."
        },
        {
          "title": "DeduplicationResult parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "dataset",
                "list[dict[str, Any]]",
                "required"
              ],
              [
                "kept",
                "int",
                "required"
              ],
              [
                "removed",
                "int",
                "required"
              ],
              [
                "duplicate_keys",
                "list[Any]",
                "<factory>"
              ]
            ]
          }
        },
        {
          "title": "DeduplicationResult example",
          "body": "",
          "code": "from arclm.datasets import DeduplicationResult\n\nprint(DeduplicationResult)",
          "language": "python"
        },
        {
          "title": "Deduplicator",
          "body": "Basis class voor deduplicatie over een hele dataset. Canonical import: from arclm.datasets import Deduplicator. Fully qualified name: arclm.datasets.Deduplicator. Status: Stable."
        },
        {
          "title": "Deduplicator parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "Deduplicator example",
          "body": "",
          "code": "from arclm.datasets import Deduplicator\n\nprint(Deduplicator)",
          "language": "python"
        },
        {
          "title": "ExactDeduplicator",
          "body": "Verwijdert voorbeelden met dezelfde waarde in gekozen velden. Canonical import: from arclm.datasets import ExactDeduplicator. Fully qualified name: arclm.datasets.ExactDeduplicator. Status: Stable."
        },
        {
          "title": "ExactDeduplicator parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "field",
                "str | None",
                "None"
              ],
              [
                "fields",
                "list[str] | tuple[str, ...] | None",
                "None"
              ],
              [
                "normalize",
                "bool",
                "False"
              ],
              [
                "keep",
                "str",
                "'first'"
              ],
              [
                "hash_algorithm",
                "str | None",
                "None"
              ],
              [
                "missing",
                "str",
                "'keep'"
              ]
            ]
          }
        },
        {
          "title": "ExactDeduplicator example",
          "body": "",
          "code": "from arclm.datasets import ExactDeduplicator\n\nprint(ExactDeduplicator)",
          "language": "python"
        },
        {
          "title": "InstructionDataset",
          "body": "Dataset voor instruction tuning met loss alleen op response tokens. Canonical import: from arclm.datasets import InstructionDataset. Fully qualified name: arclm.datasets.InstructionDataset. Status: Stable."
        },
        {
          "title": "InstructionDataset parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "instructions",
                "Any",
                "required"
              ],
              [
                "responses",
                "Any",
                "required"
              ],
              [
                "tokenizer",
                "Any",
                "required"
              ],
              [
                "block_size",
                "Any",
                "required"
              ],
              [
                "instruction_prefix",
                "Any",
                "'<|instruction|>'"
              ],
              [
                "response_prefix",
                "Any",
                "'<|response|>'"
              ]
            ]
          }
        },
        {
          "title": "InstructionDataset example",
          "body": "",
          "code": "from arclm.datasets import InstructionDataset\n\nprint(InstructionDataset)",
          "language": "python"
        },
        {
          "title": "ProcessedDataset",
          "body": "Kleine in-memory dataset voor formatting, cleaning en splits. Canonical import: from arclm.datasets import ProcessedDataset. Fully qualified name: arclm.datasets.ProcessedDataset. Status: Stable."
        },
        {
          "title": "ProcessedDataset parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "samples",
                "List[Dict[str, Any]]",
                "<factory>"
              ],
              [
                "source",
                "Optional[str]",
                "None"
              ]
            ]
          }
        },
        {
          "title": "ProcessedDataset example",
          "body": "",
          "code": "from arclm.datasets import ProcessedDataset\n\nprint(ProcessedDataset)",
          "language": "python"
        },
        {
          "title": "RemoveDuplicates",
          "body": "Verwijdert voorbeelden met dezelfde waarde in gekozen velden. Canonical import: from arclm.datasets import RemoveDuplicates. Fully qualified name: arclm.datasets.RemoveDuplicates. Status: Stable."
        },
        {
          "title": "RemoveDuplicates parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "field",
                "str | None",
                "None"
              ],
              [
                "fields",
                "list[str] | tuple[str, ...] | None",
                "None"
              ],
              [
                "normalize",
                "bool",
                "False"
              ],
              [
                "keep",
                "str",
                "'first'"
              ],
              [
                "hash_algorithm",
                "str | None",
                "None"
              ],
              [
                "missing",
                "str",
                "'keep'"
              ]
            ]
          }
        },
        {
          "title": "RemoveDuplicates example",
          "body": "",
          "code": "from arclm.datasets import RemoveDuplicates\n\nprint(RemoveDuplicates)",
          "language": "python"
        },
        {
          "title": "StreamingDataset",
          "body": "Dataset die voorbeelden pas leest tijdens het itereren. Canonical import: from arclm.datasets import StreamingDataset. Fully qualified name: arclm.datasets.StreamingDataset. Status: Stable."
        },
        {
          "title": "StreamingDataset parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "factory",
                "Callable[[], Iterator[dict[str, Any]]]",
                "required"
              ]
            ]
          }
        },
        {
          "title": "StreamingDataset example",
          "body": "",
          "code": "from arclm.datasets import StreamingDataset\n\nprint(StreamingDataset)",
          "language": "python"
        },
        {
          "title": "TextDataset",
          "body": "Dataset voor taalmodeltraining met een schuivend venster. Canonical import: from arclm.datasets import TextDataset. Fully qualified name: arclm.datasets.TextDataset. Status: Stable."
        },
        {
          "title": "TextDataset parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "data",
                "Any",
                "required"
              ],
              [
                "block_size",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "TextDataset example",
          "body": "",
          "code": "from arclm.datasets import TextDataset\n\nprint(TextDataset)",
          "language": "python"
        },
        {
          "title": "build_dataset_report",
          "body": "Build a processed dataset report with optional token statistics. Canonical import: from arclm.datasets import build_dataset_report. Fully qualified name: arclm.datasets.build_dataset_report. Status: Stable."
        },
        {
          "title": "build_dataset_report parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "records",
                "Iterable[Mapping[str, Any]]",
                "required"
              ],
              [
                "tokenizer",
                "Any | None",
                "None"
              ],
              [
                "text_fields",
                "Sequence[str]",
                "('text',)"
              ],
              [
                "validation_result",
                "DatasetValidationResult | None",
                "None"
              ],
              [
                "manifest",
                "DatasetManifest | None",
                "None"
              ],
              [
                "split_information",
                "Mapping[str, int] | None",
                "None"
              ],
              [
                "duplicates_removed",
                "int",
                "0"
              ],
              [
                "empty_records_removed",
                "int | None",
                "None"
              ],
              [
                "truncated_record_count",
                "int",
                "0"
              ],
              [
                "max_token_length",
                "int | None",
                "None"
              ]
            ]
          }
        },
        {
          "title": "build_dataset_report example",
          "body": "",
          "code": "from arclm.datasets import build_dataset_report\n\nprint(build_dataset_report)",
          "language": "python"
        },
        {
          "title": "create_dataloader",
          "body": "Maakt een PyTorch DataLoader van token ids. Canonical import: from arclm.datasets import create_dataloader. Fully qualified name: arclm.datasets.create_dataloader. Status: Stable."
        },
        {
          "title": "create_dataloader parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "encoded_data",
                "Any",
                "required"
              ],
              [
                "block_size",
                "Any",
                "required"
              ],
              [
                "batch_size",
                "Any",
                "required"
              ],
              [
                "shuffle",
                "Any",
                "True"
              ]
            ]
          }
        },
        {
          "title": "create_dataloader example",
          "body": "",
          "code": "from arclm.datasets import create_dataloader\n\nprint(create_dataloader)",
          "language": "python"
        },
        {
          "title": "create_dataset_manifest",
          "body": "Create lightweight dataset provenance without storing record values. Canonical import: from arclm.datasets import create_dataset_manifest. Fully qualified name: arclm.datasets.create_dataset_manifest. Status: Stable."
        },
        {
          "title": "create_dataset_manifest parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "dataset_name",
                "str",
                "required"
              ],
              [
                "source_type",
                "str",
                "required"
              ],
              [
                "records_before",
                "int",
                "required"
              ],
              [
                "records_after",
                "int",
                "required"
              ],
              [
                "validation_result",
                "DatasetValidationResult | None",
                "None"
              ],
              [
                "source_files",
                "Sequence[str | Path]",
                "()"
              ],
              [
                "duplicates_removed",
                "int",
                "0"
              ],
              [
                "text_fields",
                "Sequence[str]",
                "('text',)"
              ],
              [
                "transformations_applied",
                "Sequence[str]",
                "()"
              ],
              [
                "split_information",
                "Mapping[str, int] | None",
                "None"
              ]
            ]
          }
        },
        {
          "title": "create_dataset_manifest example",
          "body": "",
          "code": "from arclm.datasets import create_dataset_manifest\n\nprint(create_dataset_manifest)",
          "language": "python"
        },
        {
          "title": "create_instruction_dataloader",
          "body": "Maakt een DataLoader voor instruction tuning. Canonical import: from arclm.datasets import create_instruction_dataloader. Fully qualified name: arclm.datasets.create_instruction_dataloader. Status: Stable."
        },
        {
          "title": "create_instruction_dataloader parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "instructions",
                "Any",
                "required"
              ],
              [
                "responses",
                "Any",
                "required"
              ],
              [
                "tokenizer",
                "Any",
                "required"
              ],
              [
                "block_size",
                "Any",
                "required"
              ],
              [
                "batch_size",
                "Any",
                "required"
              ],
              [
                "shuffle",
                "Any",
                "True"
              ]
            ]
          }
        },
        {
          "title": "create_instruction_dataloader example",
          "body": "",
          "code": "from arclm.datasets import create_instruction_dataloader\n\nprint(create_instruction_dataloader)",
          "language": "python"
        },
        {
          "title": "deduplicate",
          "body": "Verwijdert exacte duplicaten met `ExactDeduplicator`. Canonical import: from arclm.datasets import deduplicate. Fully qualified name: arclm.datasets.deduplicate. Status: Stable."
        },
        {
          "title": "deduplicate parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "dataset",
                "Any",
                "required"
              ],
              [
                "return_result",
                "bool",
                "False"
              ],
              [
                "kwargs",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "deduplicate example",
          "body": "",
          "code": "from arclm.datasets import deduplicate\n\nprint(deduplicate)",
          "language": "python"
        },
        {
          "title": "load_dataset",
          "body": "Laadt een dataset met de standaard DatasetLoader. Canonical import: from arclm.datasets import load_dataset. Fully qualified name: arclm.datasets.load_dataset. Status: Stable."
        },
        {
          "title": "load_dataset parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "source",
                "Any",
                "required"
              ],
              [
                "kwargs",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "load_dataset example",
          "body": "",
          "code": "from arclm.datasets import load_dataset\n\nprint(load_dataset)",
          "language": "python"
        },
        {
          "title": "load_tokenizer_from_checkpoint",
          "body": "Haalt een tokenizer uit checkpoint metadata als dat mogelijk is. Canonical import: from arclm.datasets import load_tokenizer_from_checkpoint. Fully qualified name: arclm.datasets.load_tokenizer_from_checkpoint. Status: Stable."
        },
        {
          "title": "load_tokenizer_from_checkpoint parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "checkpoint",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "load_tokenizer_from_checkpoint example",
          "body": "",
          "code": "from arclm.datasets import load_tokenizer_from_checkpoint\n\nprint(load_tokenizer_from_checkpoint)",
          "language": "python"
        },
        {
          "title": "load_tokens",
          "body": "Laadt tokens uit de ingestelde dataset en optioneel uit domeindata. Canonical import: from arclm.datasets import load_tokens. Fully qualified name: arclm.datasets.load_tokens. Status: Stable."
        },
        {
          "title": "load_tokens parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "config",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "load_tokens example",
          "body": "",
          "code": "from arclm.datasets import load_tokens\n\nprint(load_tokens)",
          "language": "python"
        },
        {
          "title": "prepare_data",
          "body": "Maakt tokens, splits, tokenizer en DataLoaders klaar voor training. Canonical import: from arclm.datasets import prepare_data. Fully qualified name: arclm.datasets.prepare_data. Status: Stable."
        },
        {
          "title": "prepare_data parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "config",
                "Config",
                "required"
              ],
              [
                "existing_tokenizer",
                "Any",
                "None"
              ]
            ]
          }
        },
        {
          "title": "prepare_data example",
          "body": "",
          "code": "from arclm.datasets import prepare_data\n\nprint(prepare_data)",
          "language": "python"
        },
        {
          "title": "read_tokens",
          "body": "Leest lowercase whitespace tokens uit een tekstbestand en bewaart newlines. Canonical import: from arclm.datasets import read_tokens. Fully qualified name: arclm.datasets.read_tokens. Status: Stable."
        },
        {
          "title": "read_tokens parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "path",
                "Any",
                "required"
              ],
              [
                "limit",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "read_tokens example",
          "body": "",
          "code": "from arclm.datasets import read_tokens\n\nprint(read_tokens)",
          "language": "python"
        },
        {
          "title": "split_train_val",
          "body": "Splitst tokens in train en validatie data. Canonical import: from arclm.datasets import split_train_val. Fully qualified name: arclm.datasets.split_train_val. Status: Stable."
        },
        {
          "title": "split_train_val parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "tokens",
                "Any",
                "required"
              ],
              [
                "validation_split",
                "Any",
                "required"
              ],
              [
                "block_size",
                "Any",
                "required"
              ],
              [
                "seed",
                "Any",
                "42"
              ]
            ]
          }
        },
        {
          "title": "split_train_val example",
          "body": "",
          "code": "from arclm.datasets import split_train_val\n\nprint(split_train_val)",
          "language": "python"
        },
        {
          "title": "validate_records",
          "body": "Validate mapping records with a small schema. Canonical import: from arclm.datasets import validate_records. Fully qualified name: arclm.datasets.validate_records. Status: Stable."
        },
        {
          "title": "validate_records parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "records",
                "Iterable[Mapping[str, Any]]",
                "required"
              ],
              [
                "required_fields",
                "Sequence[str]",
                "required"
              ],
              [
                "field_types",
                "Mapping[str, type | tuple[type, ...]] | None",
                "None"
              ],
              [
                "allow_empty",
                "bool",
                "False"
              ],
              [
                "strict",
                "bool",
                "True"
              ],
              [
                "record_id_field",
                "str | None",
                "None"
              ]
            ]
          }
        },
        {
          "title": "validate_records example",
          "body": "",
          "code": "from arclm.datasets import validate_records\n\nprint(validate_records)",
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
          "title": "SentencePieceTokenizer",
          "body": "SentencePiece tokenizer voor subword taalmodeltraining. Canonical import: from arclm.tokenizers import SentencePieceTokenizer. Fully qualified name: arclm.tokenizers.SentencePieceTokenizer. Status: Stable."
        },
        {
          "title": "SentencePieceTokenizer parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "max_vocab",
                "Any",
                "50000"
              ],
              [
                "model_type",
                "Any",
                "'bpe'"
              ],
              [
                "character_coverage",
                "Any",
                "1.0"
              ],
              [
                "default_token",
                "Any",
                "'<UNK>'"
              ],
              [
                "model_name",
                "Any",
                "None"
              ],
              [
                "user_defined_symbols",
                "Any",
                "None"
              ]
            ]
          }
        },
        {
          "title": "SentencePieceTokenizer example",
          "body": "",
          "code": "from arclm.tokenizers import SentencePieceTokenizer\n\nprint(SentencePieceTokenizer)",
          "language": "python"
        },
        {
          "title": "Tokenizer",
          "body": "Zet tekst om naar woord-tokens en token ids. Canonical import: from arclm.tokenizers import Tokenizer. Fully qualified name: arclm.tokenizers.Tokenizer. Status: Stable."
        },
        {
          "title": "Tokenizer parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "max_vocab",
                "Any",
                "50000"
              ],
              [
                "default_token",
                "Any",
                "'<UNK>'"
              ],
              [
                "user_defined_symbols",
                "Any",
                "None"
              ]
            ]
          }
        },
        {
          "title": "Tokenizer example",
          "body": "",
          "code": "from arclm.tokenizers import Tokenizer\n\nprint(Tokenizer)",
          "language": "python"
        },
        {
          "title": "TokenizerFactory",
          "body": "Kiest en maakt tokenizer classes op basis van een korte naam. Canonical import: from arclm.tokenizers import TokenizerFactory. Fully qualified name: arclm.tokenizers.TokenizerFactory. Status: Stable."
        },
        {
          "title": "TokenizerFactory parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "TokenizerFactory example",
          "body": "",
          "code": "from arclm.tokenizers import TokenizerFactory\n\nprint(TokenizerFactory)",
          "language": "python"
        },
        {
          "title": "create_tokenizer",
          "body": "Maakt een tokenizer met een korte type-naam. Canonical import: from arclm.tokenizers import create_tokenizer. Fully qualified name: arclm.tokenizers.create_tokenizer. Status: Stable."
        },
        {
          "title": "create_tokenizer parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "tokenizer_type",
                "Any",
                "'word'"
              ],
              [
                "kwargs",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "create_tokenizer example",
          "body": "",
          "code": "from arclm.tokenizers import create_tokenizer\n\nprint(create_tokenizer)",
          "language": "python"
        },
        {
          "title": "get_tokenizer_from_config",
          "body": "Maakt een tokenizer vanuit een config object. Canonical import: from arclm.tokenizers import get_tokenizer_from_config. Fully qualified name: arclm.tokenizers.get_tokenizer_from_config. Status: Stable."
        },
        {
          "title": "get_tokenizer_from_config parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "config",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "get_tokenizer_from_config example",
          "body": "",
          "code": "from arclm.tokenizers import get_tokenizer_from_config\n\nprint(get_tokenizer_from_config)",
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
          "body": "Compact causal language model for next-token prediction. Canonical import: from arclm.models import ArcLM. Fully qualified name: arclm.models.ArcLM. Status: Stable."
        },
        {
          "title": "ArcLM parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "vocab_size",
                "Any",
                "required"
              ],
              [
                "embed_dim",
                "Any",
                "64"
              ],
              [
                "block_size",
                "Any",
                "8"
              ],
              [
                "num_blocks",
                "Any",
                "2"
              ],
              [
                "dropout",
                "Any",
                "0.0"
              ]
            ]
          }
        },
        {
          "title": "ArcLM example",
          "body": "",
          "code": "from arclm.models import ArcLM\n\nprint(ArcLM)",
          "language": "python"
        },
        {
          "title": "AutoModel",
          "body": "Factory for ArcLM model classes supported by the current package. Canonical import: from arclm.models import AutoModel. Fully qualified name: arclm.models.AutoModel. Status: Stable."
        },
        {
          "title": "AutoModel parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "AutoModel example",
          "body": "",
          "code": "from arclm.models import AutoModel\n\nprint(AutoModel)",
          "language": "python"
        },
        {
          "title": "GPTBlock",
          "body": "Transformer blok met self-attention en feed-forward lagen. Canonical import: from arclm.models import GPTBlock. Fully qualified name: arclm.models.GPTBlock. Status: Stable."
        },
        {
          "title": "GPTBlock parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "embed_dim",
                "Any",
                "required"
              ],
              [
                "dropout",
                "Any",
                "0.0"
              ]
            ]
          }
        },
        {
          "title": "GPTBlock example",
          "body": "",
          "code": "from arclm.models import GPTBlock\n\nprint(GPTBlock)",
          "language": "python"
        },
        {
          "title": "MiniGPT",
          "body": "Compact causal language model for next-token prediction. Canonical import: from arclm.models import MiniGPT. Fully qualified name: arclm.models.MiniGPT. Status: Deprecated."
        },
        {
          "title": "MiniGPT parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "vocab_size",
                "Any",
                "required"
              ],
              [
                "embed_dim",
                "Any",
                "64"
              ],
              [
                "block_size",
                "Any",
                "8"
              ],
              [
                "num_blocks",
                "Any",
                "2"
              ],
              [
                "dropout",
                "Any",
                "0.0"
              ]
            ]
          }
        },
        {
          "title": "MiniGPT example",
          "body": "",
          "code": "from arclm.models import MiniGPT\n\nprint(MiniGPT)",
          "language": "python"
        },
        {
          "title": "ModelCapabilityReport",
          "body": "Describes supported operations for one exact model path. Canonical import: from arclm.models import ModelCapabilityReport. Fully qualified name: arclm.models.ModelCapabilityReport. Status: Stable."
        },
        {
          "title": "ModelCapabilityReport parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "model_source",
                "str",
                "required"
              ],
              [
                "model_family",
                "str",
                "required"
              ],
              [
                "exact_model",
                "str",
                "required"
              ],
              [
                "task",
                "str",
                "required"
              ],
              [
                "status",
                "CapabilityStatus",
                "required"
              ],
              [
                "can_forward",
                "bool",
                "required"
              ],
              [
                "can_generate",
                "bool",
                "required"
              ],
              [
                "can_train",
                "bool",
                "required"
              ],
              [
                "can_full_finetune",
                "bool",
                "required"
              ],
              [
                "can_sft",
                "bool",
                "required"
              ],
              [
                "can_lora",
                "bool",
                "required"
              ],
              [
                "can_save_reload",
                "bool",
                "required"
              ],
              [
                "supports_cpu",
                "bool",
                "required"
              ],
              [
                "supports_cuda",
                "bool",
                "required"
              ],
              [
                "supports_quantization",
                "bool",
                "required"
              ],
              [
                "supports_structured_output",
                "bool",
                "required"
              ],
              [
                "validated_operations",
                "tuple[str, ...]",
                "<factory>"
              ],
              [
                "unvalidated_operations",
                "tuple[str, ...]",
                "<factory>"
              ],
              [
                "limitations",
                "tuple[str, ...]",
                "<factory>"
              ],
              [
                "operations",
                "dict[str, OperationStatus]",
                "<factory>"
              ]
            ]
          }
        },
        {
          "title": "ModelCapabilityReport example",
          "body": "",
          "code": "from arclm.models import ModelCapabilityReport\n\nprint(ModelCapabilityReport)",
          "language": "python"
        },
        {
          "title": "SelfAttention",
          "body": "Self-attention laag die tokens naar eerdere tokens laat kijken. Canonical import: from arclm.models import SelfAttention. Fully qualified name: arclm.models.SelfAttention. Status: Stable."
        },
        {
          "title": "SelfAttention parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "embed_dim",
                "Any",
                "required"
              ],
              [
                "dropout",
                "Any",
                "0.0"
              ]
            ]
          }
        },
        {
          "title": "SelfAttention example",
          "body": "",
          "code": "from arclm.models import SelfAttention\n\nprint(SelfAttention)",
          "language": "python"
        },
        {
          "title": "get_model_capability",
          "body": "Return the capability report for a known exact model path. Canonical import: from arclm.models import get_model_capability. Fully qualified name: arclm.models.get_model_capability. Status: Stable."
        },
        {
          "title": "get_model_capability parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "model",
                "str",
                "required"
              ]
            ]
          }
        },
        {
          "title": "get_model_capability example",
          "body": "",
          "code": "from arclm.models import get_model_capability\n\nprint(get_model_capability)",
          "language": "python"
        },
        {
          "title": "model_support_matrix",
          "body": "Return the compact support matrix for the official 0.8 model set. Canonical import: from arclm.models import model_support_matrix. Fully qualified name: arclm.models.model_support_matrix. Status: Stable."
        },
        {
          "title": "model_support_matrix parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "model_support_matrix example",
          "body": "",
          "code": "from arclm.models import model_support_matrix\n\nprint(model_support_matrix)",
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
          "title": "BaseCallback",
          "body": "Basis class voor eigen training callbacks. Canonical import: from arclm.training import BaseCallback. Fully qualified name: arclm.training.BaseCallback. Status: Stable."
        },
        {
          "title": "BaseCallback parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "BaseCallback example",
          "body": "",
          "code": "from arclm.training import BaseCallback\n\nprint(BaseCallback)",
          "language": "python"
        },
        {
          "title": "BaseModelAdapter",
          "body": "Basis class voor adapters tussen twee model implementaties. Canonical import: from arclm.training import BaseModelAdapter. Fully qualified name: arclm.training.BaseModelAdapter. Status: Stable."
        },
        {
          "title": "BaseModelAdapter parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "BaseModelAdapter example",
          "body": "",
          "code": "from arclm.training import BaseModelAdapter\n\nprint(BaseModelAdapter)",
          "language": "python"
        },
        {
          "title": "BaseModelLoader",
          "body": "Basis class voor model loaders die een model en metadata geven. Canonical import: from arclm.training import BaseModelLoader. Fully qualified name: arclm.training.BaseModelLoader. Status: Stable."
        },
        {
          "title": "BaseModelLoader parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "BaseModelLoader example",
          "body": "",
          "code": "from arclm.training import BaseModelLoader\n\nprint(BaseModelLoader)",
          "language": "python"
        },
        {
          "title": "BaseTrainer",
          "body": "Basis class voor developers die een eigen trainer willen maken. Canonical import: from arclm.training import BaseTrainer. Fully qualified name: arclm.training.BaseTrainer. Status: Stable."
        },
        {
          "title": "BaseTrainer parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "BaseTrainer example",
          "body": "",
          "code": "from arclm.training import BaseTrainer\n\nprint(BaseTrainer)",
          "language": "python"
        },
        {
          "title": "BaseTrainingPipeline",
          "body": "Basis class voor aanpasbare training pipelines. Canonical import: from arclm.training import BaseTrainingPipeline. Fully qualified name: arclm.training.BaseTrainingPipeline. Status: Stable."
        },
        {
          "title": "BaseTrainingPipeline parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "BaseTrainingPipeline example",
          "body": "",
          "code": "from arclm.training import BaseTrainingPipeline\n\nprint(BaseTrainingPipeline)",
          "language": "python"
        },
        {
          "title": "EarlyStopping",
          "body": "Early stopping to prevent overfitting Canonical import: from arclm.training import EarlyStopping. Fully qualified name: arclm.training.EarlyStopping. Status: Stable."
        },
        {
          "title": "EarlyStopping parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "patience",
                "Any",
                "10"
              ],
              [
                "min_delta",
                "Any",
                "0.0001"
              ]
            ]
          }
        },
        {
          "title": "EarlyStopping example",
          "body": "",
          "code": "from arclm.training import EarlyStopping\n\nprint(EarlyStopping)",
          "language": "python"
        },
        {
          "title": "GeneralizationMonitor",
          "body": "Monitor model generalization during training Traceert training vs validation loss om overfitting te detecteren Canonical import: from arclm.training import GeneralizationMonitor. Fully qualified name: arclm.training.GeneralizationMonitor. Status: Stable."
        },
        {
          "title": "GeneralizationMonitor parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "GeneralizationMonitor example",
          "body": "",
          "code": "from arclm.training import GeneralizationMonitor\n\nprint(GeneralizationMonitor)",
          "language": "python"
        },
        {
          "title": "L1Regularization",
          "body": "L1 Regularization - Sparsity inducing Canonical import: from arclm.training import L1Regularization. Fully qualified name: arclm.training.L1Regularization. Status: Stable."
        },
        {
          "title": "L1Regularization parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "lambda_l1",
                "Any",
                "0.0001"
              ]
            ]
          }
        },
        {
          "title": "L1Regularization example",
          "body": "",
          "code": "from arclm.training import L1Regularization\n\nprint(L1Regularization)",
          "language": "python"
        },
        {
          "title": "L2Regularization",
          "body": "L2 Regularization (Weight Decay) - Smoothness inducing Canonical import: from arclm.training import L2Regularization. Fully qualified name: arclm.training.L2Regularization. Status: Stable."
        },
        {
          "title": "L2Regularization parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "lambda_l2",
                "Any",
                "0.0001"
              ]
            ]
          }
        },
        {
          "title": "L2Regularization example",
          "body": "",
          "code": "from arclm.training import L2Regularization\n\nprint(L2Regularization)",
          "language": "python"
        },
        {
          "title": "LabelSmoothing",
          "body": "Label smoothing regularization Voorkomt overconfident voorspellingen door targets glad te maken Canonical import: from arclm.training import LabelSmoothing. Fully qualified name: arclm.training.LabelSmoothing. Status: Stable."
        },
        {
          "title": "LabelSmoothing parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "num_classes",
                "Any",
                "required"
              ],
              [
                "smoothing",
                "Any",
                "0.1"
              ]
            ]
          }
        },
        {
          "title": "LabelSmoothing example",
          "body": "",
          "code": "from arclm.training import LabelSmoothing\n\nprint(LabelSmoothing)",
          "language": "python"
        },
        {
          "title": "LearningRateScheduler",
          "body": "Learning rate scheduler for better generalization Reduce learning rate during training for better convergence Canonical import: from arclm.training import LearningRateScheduler. Fully qualified name: arclm.training.LearningRateScheduler. Status: Stable."
        },
        {
          "title": "LearningRateScheduler parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "optimizer",
                "Any",
                "required"
              ],
              [
                "strategy",
                "Any",
                "'cosine'"
              ],
              [
                "total_epochs",
                "Any",
                "100"
              ]
            ]
          }
        },
        {
          "title": "LearningRateScheduler example",
          "body": "",
          "code": "from arclm.training import LearningRateScheduler\n\nprint(LearningRateScheduler)",
          "language": "python"
        },
        {
          "title": "MixupAugmentation",
          "body": "Mixup data augmentation for better generalization Combineert twee samples lineair om data augmentation te krijgen Canonical import: from arclm.training import MixupAugmentation. Fully qualified name: arclm.training.MixupAugmentation. Status: Stable."
        },
        {
          "title": "MixupAugmentation parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "alpha",
                "Any",
                "1.0"
              ]
            ]
          }
        },
        {
          "title": "MixupAugmentation example",
          "body": "",
          "code": "from arclm.training import MixupAugmentation\n\nprint(MixupAugmentation)",
          "language": "python"
        },
        {
          "title": "ModelAdapter",
          "body": "Adapt weights from external models to ArcLM architecture. Canonical import: from arclm.training import ModelAdapter. Fully qualified name: arclm.training.ModelAdapter. Status: Stable."
        },
        {
          "title": "ModelAdapter parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "source_model",
                "Module",
                "required"
              ],
              [
                "target_model",
                "ArcLM",
                "required"
              ]
            ]
          }
        },
        {
          "title": "ModelAdapter example",
          "body": "",
          "code": "from arclm.training import ModelAdapter\n\nprint(ModelAdapter)",
          "language": "python"
        },
        {
          "title": "PreTrainedModelLoader",
          "body": "Load pre-trained models from multiple sources: - HuggingFace transformers - Local checkpoint files - Custom model paths Handles weight alignment and architecture mismatch gracefully. Canonical import: from arclm.training import PreTrainedModelLoader. Fully qualified name: arclm.training.PreTrainedModelLoader. Status: Stable."
        },
        {
          "title": "PreTrainedModelLoader parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "source",
                "Union",
                "required"
              ],
              [
                "target_vocab_size",
                "int",
                "required"
              ],
              [
                "target_config",
                "Config",
                "required"
              ],
              [
                "device",
                "str",
                "'cpu'"
              ],
              [
                "strict_loading",
                "bool",
                "False"
              ]
            ]
          }
        },
        {
          "title": "PreTrainedModelLoader example",
          "body": "",
          "code": "from arclm.training import PreTrainedModelLoader\n\nprint(PreTrainedModelLoader)",
          "language": "python"
        },
        {
          "title": "StoppingCriteria",
          "body": "Base stopping criteria for training loop control. Canonical import: from arclm.training import StoppingCriteria. Fully qualified name: arclm.training.StoppingCriteria. Status: Stable."
        },
        {
          "title": "StoppingCriteria parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "max_steps",
                "Optional",
                "None"
              ],
              [
                "early_stopping_patience",
                "Optional",
                "None"
              ],
              [
                "early_stopping_min_delta",
                "float",
                "0.0"
              ]
            ]
          }
        },
        {
          "title": "StoppingCriteria example",
          "body": "",
          "code": "from arclm.training import StoppingCriteria\n\nprint(StoppingCriteria)",
          "language": "python"
        },
        {
          "title": "Trainer",
          "body": "Traint een model op \u00e9\u00e9n apparaat. Canonical import: from arclm.training import Trainer. Fully qualified name: arclm.training.Trainer. Status: Stable."
        },
        {
          "title": "Trainer parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "model",
                "Any",
                "required"
              ],
              [
                "optimizer",
                "Any",
                "None"
              ],
              [
                "criterion",
                "Any",
                "None"
              ],
              [
                "config",
                "Any",
                "None"
              ],
              [
                "train_dataset",
                "Any",
                "None"
              ],
              [
                "validation_dataset",
                "Any",
                "None"
              ],
              [
                "train_dataloader",
                "Any",
                "None"
              ],
              [
                "validation_dataloader",
                "Any",
                "None"
              ],
              [
                "scheduler",
                "Any",
                "None"
              ],
              [
                "callbacks",
                "Any",
                "None"
              ],
              [
                "event_logger",
                "Any",
                "None"
              ],
              [
                "collate_fn",
                "Any",
                "None"
              ],
              [
                "distributed_config",
                "Any",
                "None"
              ]
            ]
          }
        },
        {
          "title": "Trainer example",
          "body": "",
          "code": "from arclm.training import Trainer\n\nprint(Trainer)",
          "language": "python"
        },
        {
          "title": "TrainingConfig",
          "body": "Bewaart de belangrijkste instellingen voor een training. Canonical import: from arclm.training import TrainingConfig. Fully qualified name: arclm.training.TrainingConfig. Status: Stable."
        },
        {
          "title": "TrainingConfig parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "epochs",
                "int",
                "3"
              ],
              [
                "batch_size",
                "int",
                "8"
              ],
              [
                "learning_rate",
                "float",
                "2e-05"
              ],
              [
                "weight_decay",
                "float",
                "0.0"
              ],
              [
                "gradient_accumulation_steps",
                "int",
                "1"
              ],
              [
                "precision",
                "str",
                "'fp32'"
              ],
              [
                "max_grad_norm",
                "float | None",
                "1.0"
              ],
              [
                "output_dir",
                "str",
                "'outputs'"
              ],
              [
                "save_every_steps",
                "int",
                "500"
              ],
              [
                "keep_last_checkpoints",
                "int | None",
                "3"
              ],
              [
                "log_every_steps",
                "int",
                "10"
              ],
              [
                "optimizer",
                "str",
                "'adamw'"
              ],
              [
                "scheduler",
                "str",
                "'constant'"
              ],
              [
                "warmup_steps",
                "int",
                "0"
              ],
              [
                "max_steps",
                "int | None",
                "None"
              ],
              [
                "device",
                "str | None",
                "None"
              ],
              [
                "num_workers",
                "int",
                "0"
              ],
              [
                "shuffle",
                "bool",
                "True"
              ]
            ]
          }
        },
        {
          "title": "TrainingConfig example",
          "body": "",
          "code": "from arclm.training import TrainingConfig\n\nprint(TrainingConfig)",
          "language": "python"
        },
        {
          "title": "TrainingResult",
          "body": "Resultaat dat `train_model` teruggeeft na een trainingsrun. Canonical import: from arclm.training import TrainingResult. Fully qualified name: arclm.training.TrainingResult. Status: Stable."
        },
        {
          "title": "TrainingResult parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "mode",
                "str",
                "required"
              ],
              [
                "model_path",
                "str",
                "required"
              ],
              [
                "config",
                "Config",
                "required"
              ],
              [
                "history",
                "Dict",
                "required"
              ],
              [
                "vocab_size",
                "int",
                "required"
              ],
              [
                "tokenizer",
                "Union",
                "None"
              ],
              [
                "checkpoint_source",
                "Optional",
                "None"
              ]
            ]
          }
        },
        {
          "title": "TrainingResult example",
          "body": "",
          "code": "from arclm.training import TrainingResult\n\nprint(TrainingResult)",
          "language": "python"
        },
        {
          "title": "TrainingState",
          "body": "Houdt bij waar de training is. Canonical import: from arclm.training import TrainingState. Fully qualified name: arclm.training.TrainingState. Status: Stable."
        },
        {
          "title": "TrainingState parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "epoch",
                "int",
                "0"
              ],
              [
                "step",
                "int",
                "0"
              ],
              [
                "global_step",
                "int",
                "0"
              ],
              [
                "optimizer_step",
                "int",
                "0"
              ],
              [
                "best_loss",
                "float | None",
                "None"
              ],
              [
                "last_loss",
                "float | None",
                "None"
              ],
              [
                "last_validation_loss",
                "float | None",
                "None"
              ],
              [
                "learning_rate",
                "float | None",
                "None"
              ],
              [
                "elapsed_seconds",
                "float",
                "0.0"
              ]
            ]
          }
        },
        {
          "title": "TrainingState example",
          "body": "",
          "code": "from arclm.training import TrainingState\n\nprint(TrainingState)",
          "language": "python"
        },
        {
          "title": "UnifiedPipeline",
          "body": "Unified training pipeline supporting multiple modes: - PRE_TRAINING: Train from scratch on large corpus - FINE_TUNING: Fine-tune pre-trained model on task data - INSTRUCTION_TUNING: Fine-tune on instruction-response pair Canonical import: from arclm.training import UnifiedPipeline. Fully qualified name: arclm.training.UnifiedPipeline. Status: Stable."
        },
        {
          "title": "UnifiedPipeline parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "config",
                "Config",
                "required"
              ],
              [
                "mode",
                "str",
                "'fine_tuning'"
              ],
              [
                "pretrained_source",
                "Union",
                "None"
              ],
              [
                "stopping_criteria",
                "Optional",
                "None"
              ]
            ]
          }
        },
        {
          "title": "UnifiedPipeline example",
          "body": "",
          "code": "from arclm.training import UnifiedPipeline\n\nprint(UnifiedPipeline)",
          "language": "python"
        },
        {
          "title": "build_model",
          "body": "Maakt een ArcLM model vanuit config en zet het op het gekozen device. Canonical import: from arclm.training import build_model. Fully qualified name: arclm.training.build_model. Status: Stable."
        },
        {
          "title": "build_model parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "config",
                "Any",
                "required"
              ],
              [
                "vocab_size",
                "Any",
                "None"
              ]
            ]
          }
        },
        {
          "title": "build_model example",
          "body": "",
          "code": "from arclm.training import build_model\n\nprint(build_model)",
          "language": "python"
        },
        {
          "title": "build_optimizer_with_discriminative_lr",
          "body": "Maakt een optimizer met aparte learning rates per laag-groep. Canonical import: from arclm.training import build_optimizer_with_discriminative_lr. Fully qualified name: arclm.training.build_optimizer_with_discriminative_lr. Status: Stable."
        },
        {
          "title": "build_optimizer_with_discriminative_lr parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "model",
                "Any",
                "required"
              ],
              [
                "learning_rate",
                "float",
                "required"
              ],
              [
                "weight_decay",
                "float",
                "required"
              ],
              [
                "lr_multiplier",
                "dict",
                "None"
              ]
            ]
          }
        },
        {
          "title": "build_optimizer_with_discriminative_lr example",
          "body": "",
          "code": "from arclm.training import build_optimizer_with_discriminative_lr\n\nprint(build_optimizer_with_discriminative_lr)",
          "language": "python"
        },
        {
          "title": "build_trainer",
          "body": "Maakt de optimizer, loss function en Trainer voor een model. Canonical import: from arclm.training import build_trainer. Fully qualified name: arclm.training.build_trainer. Status: Stable."
        },
        {
          "title": "build_trainer parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "model",
                "Any",
                "required"
              ],
              [
                "config",
                "Any",
                "required"
              ],
              [
                "event_logger",
                "Any",
                "None"
              ]
            ]
          }
        },
        {
          "title": "build_trainer example",
          "body": "",
          "code": "from arclm.training import build_trainer\n\nprint(build_trainer)",
          "language": "python"
        },
        {
          "title": "checkpoint_is_compatible_for_continue_training",
          "body": "Controleert of een checkpoint past bij continued training. Canonical import: from arclm.training import checkpoint_is_compatible_for_continue_training. Fully qualified name: arclm.training.checkpoint_is_compatible_for_continue_training. Status: Stable."
        },
        {
          "title": "checkpoint_is_compatible_for_continue_training parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "checkpoint",
                "Any",
                "required"
              ],
              [
                "config",
                "Any",
                "required"
              ],
              [
                "vocab_size",
                "Any",
                "required"
              ],
              [
                "tokenizer",
                "Any",
                "None"
              ]
            ]
          }
        },
        {
          "title": "checkpoint_is_compatible_for_continue_training example",
          "body": "",
          "code": "from arclm.training import checkpoint_is_compatible_for_continue_training\n\nprint(checkpoint_is_compatible_for_continue_training)",
          "language": "python"
        },
        {
          "title": "checkpoint_is_compatible_for_tuining",
          "body": "Controleert of een checkpoint past bij finetuning. Canonical import: from arclm.training import checkpoint_is_compatible_for_tuining. Fully qualified name: arclm.training.checkpoint_is_compatible_for_tuining. Status: Deprecated."
        },
        {
          "title": "checkpoint_is_compatible_for_tuining parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "checkpoint",
                "Any",
                "required"
              ],
              [
                "config",
                "Any",
                "required"
              ],
              [
                "vocab_size",
                "Any",
                "required"
              ],
              [
                "tokenizer",
                "Any",
                "None"
              ]
            ]
          }
        },
        {
          "title": "checkpoint_is_compatible_for_tuining example",
          "body": "",
          "code": "from arclm.training import checkpoint_is_compatible_for_tuining\n\nprint(checkpoint_is_compatible_for_tuining)",
          "language": "python"
        },
        {
          "title": "create_checkpoint_callback",
          "body": "Maakt een callback die het laatste hervatbare checkpoint opslaat. Canonical import: from arclm.training import create_checkpoint_callback. Fully qualified name: arclm.training.create_checkpoint_callback. Status: Stable."
        },
        {
          "title": "create_checkpoint_callback parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "config",
                "Any",
                "required"
              ],
              [
                "tokenizer",
                "Any",
                "required"
              ],
              [
                "vocab_size",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "create_checkpoint_callback example",
          "body": "",
          "code": "from arclm.training import create_checkpoint_callback\n\nprint(create_checkpoint_callback)",
          "language": "python"
        },
        {
          "title": "create_epoch_checkpoint_callback",
          "body": "Oude alias voor `create_checkpoint_callback`. Canonical import: from arclm.training import create_epoch_checkpoint_callback. Fully qualified name: arclm.training.create_epoch_checkpoint_callback. Status: Stable."
        },
        {
          "title": "create_epoch_checkpoint_callback parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "config",
                "Any",
                "required"
              ],
              [
                "tokenizer",
                "Any",
                "required"
              ],
              [
                "vocab_size",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "create_epoch_checkpoint_callback example",
          "body": "",
          "code": "from arclm.training import create_epoch_checkpoint_callback\n\nprint(create_epoch_checkpoint_callback)",
          "language": "python"
        },
        {
          "title": "load_compatible_checkpoint",
          "body": "Laadt een bestaand checkpoint als het past bij deze training. Canonical import: from arclm.training import load_compatible_checkpoint. Fully qualified name: arclm.training.load_compatible_checkpoint. Status: Stable."
        },
        {
          "title": "load_compatible_checkpoint parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "trainer",
                "Any",
                "required"
              ],
              [
                "config",
                "Any",
                "required"
              ],
              [
                "vocab_size",
                "Any",
                "required"
              ],
              [
                "tokenizer",
                "Any",
                "None"
              ]
            ]
          }
        },
        {
          "title": "load_compatible_checkpoint example",
          "body": "",
          "code": "from arclm.training import load_compatible_checkpoint\n\nprint(load_compatible_checkpoint)",
          "language": "python"
        },
        {
          "title": "save_training_checkpoint",
          "body": "Slaat een trainer checkpoint op met tokenizer metadata. Canonical import: from arclm.training import save_training_checkpoint. Fully qualified name: arclm.training.save_training_checkpoint. Status: Stable."
        },
        {
          "title": "save_training_checkpoint parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "trainer",
                "Any",
                "required"
              ],
              [
                "config",
                "Any",
                "required"
              ],
              [
                "tokenizer",
                "Any",
                "required"
              ],
              [
                "vocab_size",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "save_training_checkpoint example",
          "body": "",
          "code": "from arclm.training import save_training_checkpoint\n\nprint(save_training_checkpoint)",
          "language": "python"
        },
        {
          "title": "tokenizer_from_checkpoint",
          "body": "Haalt een ArcLM tokenizer uit een checkpoint of checkpoint-pad. Canonical import: from arclm.training import tokenizer_from_checkpoint. Fully qualified name: arclm.training.tokenizer_from_checkpoint. Status: Stable."
        },
        {
          "title": "tokenizer_from_checkpoint parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "checkpoint_or_source",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "tokenizer_from_checkpoint example",
          "body": "",
          "code": "from arclm.training import tokenizer_from_checkpoint\n\nprint(tokenizer_from_checkpoint)",
          "language": "python"
        },
        {
          "title": "train_model",
          "body": "Traint een ArcLM model in pretrain, finetune of continue_training mode. Canonical import: from arclm.training import train_model. Fully qualified name: arclm.training.train_model. Status: Stable."
        },
        {
          "title": "train_model parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "mode",
                "str",
                "required"
              ],
              [
                "data",
                "str",
                "required"
              ],
              [
                "output",
                "str",
                "required"
              ],
              [
                "checkpoint",
                "Optional",
                "None"
              ],
              [
                "config",
                "Optional",
                "None"
              ],
              [
                "tokenizer",
                "Any",
                "None"
              ],
              [
                "config_overrides",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "train_model example",
          "body": "",
          "code": "from arclm.training import train_model\n\nprint(train_model)",
          "language": "python"
        }
      ],
      "status": "Stable"
    },
    {
      "id": "api-finetuning",
      "title": "Fine-Tuning API",
      "group": "Reference",
      "href": "api/finetuning.html",
      "summary": "Public finetuning APIs.",
      "sections": [
        {
          "title": "Overview",
          "body": "Fine-Tuning API documents the public ArcLM APIs in this category."
        },
        {
          "title": "BaseFineTuner",
          "body": "Basis class voor developers die een eigen fine-tuner willen maken. Canonical import: from arclm.finetuning import BaseFineTuner. Fully qualified name: arclm.finetuning.BaseFineTuner. Status: Beta."
        },
        {
          "title": "BaseFineTuner parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "BaseFineTuner example",
          "body": "",
          "code": "from arclm.finetuning import BaseFineTuner\n\nprint(BaseFineTuner)",
          "language": "python"
        },
        {
          "title": "BaseModelAdapter",
          "body": "Basis class om een extern model met ArcLM te verbinden. Canonical import: from arclm.finetuning import BaseModelAdapter. Fully qualified name: arclm.finetuning.BaseModelAdapter. Status: Beta."
        },
        {
          "title": "BaseModelAdapter parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "BaseModelAdapter example",
          "body": "",
          "code": "from arclm.finetuning import BaseModelAdapter\n\nprint(BaseModelAdapter)",
          "language": "python"
        },
        {
          "title": "BaseTokenizerAdapter",
          "body": "Basis class om een tokenizer met ArcLM te verbinden. Canonical import: from arclm.finetuning import BaseTokenizerAdapter. Fully qualified name: arclm.finetuning.BaseTokenizerAdapter. Status: Beta."
        },
        {
          "title": "BaseTokenizerAdapter parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "BaseTokenizerAdapter example",
          "body": "",
          "code": "from arclm.finetuning import BaseTokenizerAdapter\n\nprint(BaseTokenizerAdapter)",
          "language": "python"
        },
        {
          "title": "FineTuningConfig",
          "body": "Configuratie voor data, formatting en labels bij fine-tuning. Canonical import: from arclm.finetuning import FineTuningConfig. Fully qualified name: arclm.finetuning.FineTuningConfig. Status: Beta."
        },
        {
          "title": "FineTuningConfig parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "mode",
                "FineTuningMode | str",
                "<FineTuningMode.SFT: 'supervised_fine_tuning'>"
              ],
              [
                "formatter",
                "str",
                "'auto'"
              ],
              [
                "max_sequence_length",
                "int",
                "1024"
              ],
              [
                "train_on_prompt",
                "bool",
                "False"
              ],
              [
                "append_eos_token",
                "bool",
                "True"
              ],
              [
                "end_behavior",
                "str | None",
                "None"
              ],
              [
                "end_tag",
                "str",
                "'<|end|>'"
              ],
              [
                "truncation",
                "bool",
                "True"
              ],
              [
                "padding",
                "str",
                "'longest'"
              ],
              [
                "packing",
                "bool",
                "False"
              ],
              [
                "ignore_index",
                "int",
                "-100"
              ],
              [
                "label_strategy",
                "str | None",
                "None"
              ],
              [
                "text_field",
                "str",
                "'text'"
              ],
              [
                "prompt_field",
                "str",
                "'prompt'"
              ],
              [
                "completion_field",
                "str",
                "'completion'"
              ],
              [
                "instruction_field",
                "str",
                "'instruction'"
              ],
              [
                "input_field",
                "str",
                "'input'"
              ],
              [
                "response_field",
                "str",
                "'output'"
              ],
              [
                "messages_field",
                "str",
                "'messages'"
              ],
              [
                "strict_field_mapping",
                "bool",
                "False"
              ],
              [
                "instruction_tag",
                "str | None",
                "None"
              ],
              [
                "response_tag",
                "str | None",
                "None"
              ],
              [
                "context_tag",
                "str | None",
                "None"
              ],
              [
                "separator",
                "str",
                "'\\n'"
              ],
              [
                "register_tags_as_special_tokens",
                "bool",
                "False"
              ],
              [
                "skip_invalid_records",
                "bool",
                "False"
              ],
              [
                "max_report_errors",
                "int",
                "10"
              ],
              [
                "config_version",
                "int",
                "1"
              ]
            ]
          }
        },
        {
          "title": "FineTuningConfig example",
          "body": "",
          "code": "from arclm.finetuning import FineTuningConfig\n\nprint(FineTuningConfig)",
          "language": "python"
        },
        {
          "title": "FineTuningDatasetReport",
          "body": "Veilige samenvatting van datasetvoorbereiding. Canonical import: from arclm.finetuning import FineTuningDatasetReport. Fully qualified name: arclm.finetuning.FineTuningDatasetReport. Status: Beta."
        },
        {
          "title": "FineTuningDatasetReport parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "mode",
                "str",
                "required"
              ],
              [
                "formatter",
                "str",
                "required"
              ],
              [
                "records_seen",
                "int",
                "required"
              ],
              [
                "records_valid",
                "int",
                "required"
              ],
              [
                "records_rejected",
                "int",
                "required"
              ],
              [
                "records_truncated",
                "int",
                "required"
              ],
              [
                "examples_dropped",
                "int",
                "required"
              ],
              [
                "total_tokens",
                "int",
                "required"
              ],
              [
                "trainable_tokens",
                "int",
                "required"
              ],
              [
                "dataset_fingerprint",
                "str",
                "required"
              ],
              [
                "errors",
                "list[dict[str, Any]]",
                "<factory>"
              ]
            ]
          }
        },
        {
          "title": "FineTuningDatasetReport example",
          "body": "",
          "code": "from arclm.finetuning import FineTuningDatasetReport\n\nprint(FineTuningDatasetReport)",
          "language": "python"
        },
        {
          "title": "FineTuningMode",
          "body": "Beschrijft welke fine-tuning taak uitgevoerd wordt. Canonical import: from arclm.finetuning import FineTuningMode. Fully qualified name: arclm.finetuning.FineTuningMode. Status: Beta."
        },
        {
          "title": "FineTuningMode parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "values",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "FineTuningMode example",
          "body": "",
          "code": "from arclm.finetuning import FineTuningMode\n\nprint(FineTuningMode)",
          "language": "python"
        },
        {
          "title": "FineTuningResult",
          "body": "Resultaat van een stabiele fine-tuning run. Canonical import: from arclm.finetuning import FineTuningResult. Fully qualified name: arclm.finetuning.FineTuningResult. Status: Beta."
        },
        {
          "title": "FineTuningResult parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "training_state",
                "Any",
                "required"
              ],
              [
                "dataset_report",
                "FineTuningDatasetReport",
                "required"
              ],
              [
                "model",
                "torch.nn.Module",
                "required"
              ],
              [
                "tokenizer",
                "Any | None",
                "None"
              ],
              [
                "fine_tuning_config",
                "FineTuningConfig | None",
                "None"
              ],
              [
                "training_config",
                "TrainingConfig | None",
                "None"
              ],
              [
                "evaluation_result",
                "dict[str, Any] | None",
                "None"
              ],
              [
                "trainer",
                "FullFineTuner | None",
                "None"
              ],
              [
                "checkpoint_path",
                "str | None",
                "None"
              ],
              [
                "peft_config",
                "Any | None",
                "None"
              ],
              [
                "peft_result",
                "Any | None",
                "None"
              ],
              [
                "reproducibility_metadata",
                "dict[str, Any] | None",
                "None"
              ]
            ]
          }
        },
        {
          "title": "FineTuningResult example",
          "body": "",
          "code": "from arclm.finetuning import FineTuningResult\n\nprint(FineTuningResult)",
          "language": "python"
        },
        {
          "title": "FullFineTuner",
          "body": "Traint alle trainbare modelparameters met de Training Core. Canonical import: from arclm.finetuning import FullFineTuner. Fully qualified name: arclm.finetuning.FullFineTuner. Status: Beta."
        },
        {
          "title": "FullFineTuner parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "model",
                "Any",
                "required"
              ],
              [
                "tokenizer",
                "Any",
                "None"
              ],
              [
                "train_dataset",
                "Any",
                "None"
              ],
              [
                "config",
                "SFTConfig | None",
                "None"
              ],
              [
                "validation_dataset",
                "Any",
                "None"
              ],
              [
                "model_adapter",
                "Any",
                "None"
              ],
              [
                "tokenizer_adapter",
                "Any",
                "None"
              ],
              [
                "optimizer",
                "Any",
                "None"
              ],
              [
                "scheduler",
                "Any",
                "None"
              ],
              [
                "callbacks",
                "Any",
                "None"
              ],
              [
                "collate_fn",
                "Any",
                "None"
              ]
            ]
          }
        },
        {
          "title": "FullFineTuner example",
          "body": "",
          "code": "from arclm.finetuning import FullFineTuner\n\nprint(FullFineTuner)",
          "language": "python"
        },
        {
          "title": "ModelAdapter",
          "body": "Zet een model om naar het formaat dat ArcLM verwacht. Canonical import: from arclm.finetuning import ModelAdapter. Fully qualified name: arclm.finetuning.ModelAdapter. Status: Beta."
        },
        {
          "title": "ModelAdapter parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "model",
                "Any",
                "required"
              ],
              [
                "input_map",
                "dict[str, str] | None",
                "None"
              ],
              [
                "output_map",
                "dict[str, str] | None",
                "None"
              ],
              [
                "ignore_index",
                "int",
                "-100"
              ],
              [
                "label_shift",
                "bool",
                "True"
              ]
            ]
          }
        },
        {
          "title": "ModelAdapter example",
          "body": "",
          "code": "from arclm.finetuning import ModelAdapter\n\nprint(ModelAdapter)",
          "language": "python"
        },
        {
          "title": "PreparedFineTuningDataset",
          "body": "Dataset met vooraf getokenizede fine-tuning voorbeelden. Canonical import: from arclm.finetuning import PreparedFineTuningDataset. Fully qualified name: arclm.finetuning.PreparedFineTuningDataset. Status: Beta."
        },
        {
          "title": "PreparedFineTuningDataset parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "features",
                "Sequence[dict[str, list[int]]]",
                "required"
              ],
              [
                "report",
                "FineTuningDatasetReport",
                "required"
              ]
            ]
          }
        },
        {
          "title": "PreparedFineTuningDataset example",
          "body": "",
          "code": "from arclm.finetuning import PreparedFineTuningDataset\n\nprint(PreparedFineTuningDataset)",
          "language": "python"
        },
        {
          "title": "PreparedFineTuningRecord",
          "body": "Canonical prepared representation of one fine-tuning record. Canonical import: from arclm.finetuning import PreparedFineTuningRecord. Fully qualified name: arclm.finetuning.PreparedFineTuningRecord. Status: Beta."
        },
        {
          "title": "PreparedFineTuningRecord parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "record_index",
                "int",
                "required"
              ],
              [
                "formatted_text",
                "str",
                "required"
              ],
              [
                "tokens",
                "list[str]",
                "required"
              ],
              [
                "input_ids",
                "list[int]",
                "required"
              ],
              [
                "labels",
                "list[int]",
                "required"
              ],
              [
                "label_mask",
                "list[str]",
                "required"
              ],
              [
                "attention_mask",
                "list[int]",
                "required"
              ],
              [
                "sequence_length",
                "int",
                "required"
              ],
              [
                "original_token_count",
                "int",
                "required"
              ],
              [
                "unknown_token_count",
                "int",
                "required"
              ],
              [
                "truncated",
                "bool",
                "required"
              ],
              [
                "detected_tags",
                "list[str]",
                "<factory>"
              ],
              [
                "tags",
                "dict[str, Any]",
                "<factory>"
              ],
              [
                "warnings",
                "list[str]",
                "<factory>"
              ]
            ]
          }
        },
        {
          "title": "PreparedFineTuningRecord example",
          "body": "",
          "code": "from arclm.finetuning import PreparedFineTuningRecord\n\nprint(PreparedFineTuningRecord)",
          "language": "python"
        },
        {
          "title": "SFTConfig",
          "body": "Bewaart instellingen voor supervised fine-tuning. Canonical import: from arclm.finetuning import SFTConfig. Fully qualified name: arclm.finetuning.SFTConfig. Status: Beta."
        },
        {
          "title": "SFTConfig parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "epochs",
                "int",
                "3"
              ],
              [
                "batch_size",
                "int",
                "8"
              ],
              [
                "learning_rate",
                "float",
                "2e-05"
              ],
              [
                "weight_decay",
                "float",
                "0.0"
              ],
              [
                "gradient_accumulation_steps",
                "int",
                "1"
              ],
              [
                "precision",
                "str",
                "'fp32'"
              ],
              [
                "max_grad_norm",
                "float | None",
                "1.0"
              ],
              [
                "output_dir",
                "str",
                "'outputs'"
              ],
              [
                "save_every_steps",
                "int",
                "500"
              ],
              [
                "keep_last_checkpoints",
                "int | None",
                "3"
              ],
              [
                "log_every_steps",
                "int",
                "10"
              ],
              [
                "optimizer",
                "str",
                "'adamw'"
              ],
              [
                "scheduler",
                "str",
                "'constant'"
              ],
              [
                "warmup_steps",
                "int",
                "0"
              ],
              [
                "max_steps",
                "int | None",
                "None"
              ],
              [
                "device",
                "str | None",
                "None"
              ],
              [
                "num_workers",
                "int",
                "0"
              ],
              [
                "shuffle",
                "bool",
                "True"
              ],
              [
                "text_field",
                "str | None",
                "'text'"
              ],
              [
                "instruction_field",
                "str | None",
                "None"
              ],
              [
                "input_field",
                "str | None",
                "None"
              ],
              [
                "response_field",
                "str | None",
                "None"
              ],
              [
                "prompt_field",
                "str | None",
                "None"
              ],
              [
                "messages_field",
                "str | None",
                "None"
              ],
              [
                "max_length",
                "int",
                "1024"
              ],
              [
                "padding",
                "str",
                "'longest'"
              ],
              [
                "truncation",
                "bool",
                "True"
              ],
              [
                "packing",
                "bool",
                "False"
              ],
              [
                "assistant_only_loss",
                "bool",
                "False"
              ],
              [
                "add_eos_token",
                "bool",
                "True"
              ],
              [
                "ignore_index",
                "int",
                "-100"
              ],
              [
                "label_shift",
                "bool",
                "True"
              ],
              [
                "chat_template",
                "str | None",
                "None"
              ]
            ]
          }
        },
        {
          "title": "SFTConfig example",
          "body": "",
          "code": "from arclm.finetuning import SFTConfig\n\nprint(SFTConfig)",
          "language": "python"
        },
        {
          "title": "SFTDataCollator",
          "body": "Zet SFT voorbeelden om naar tensors voor de trainer. Canonical import: from arclm.finetuning import SFTDataCollator. Fully qualified name: arclm.finetuning.SFTDataCollator. Status: Beta."
        },
        {
          "title": "SFTDataCollator parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "tokenizer",
                "Any",
                "None"
              ],
              [
                "config",
                "SFTConfig | None",
                "None"
              ],
              [
                "tokenizer_adapter",
                "Any",
                "None"
              ]
            ]
          }
        },
        {
          "title": "SFTDataCollator example",
          "body": "",
          "code": "from arclm.finetuning import SFTDataCollator\n\nprint(SFTDataCollator)",
          "language": "python"
        },
        {
          "title": "SFTRecordContract",
          "body": "Public description of accepted SFT record fields. Canonical import: from arclm.finetuning import SFTRecordContract. Fully qualified name: arclm.finetuning.SFTRecordContract. Status: Beta."
        },
        {
          "title": "SFTRecordContract parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "format",
                "str",
                "required"
              ],
              [
                "required_fields",
                "tuple[str, ...]",
                "required"
              ],
              [
                "optional_fields",
                "tuple[str, ...]",
                "()"
              ],
              [
                "description",
                "str",
                "''"
              ]
            ]
          }
        },
        {
          "title": "SFTRecordContract example",
          "body": "",
          "code": "from arclm.finetuning import SFTRecordContract\n\nprint(SFTRecordContract)",
          "language": "python"
        },
        {
          "title": "SFTTrainer",
          "body": "Traint een tekstmodel met instruction-, chat- of tekstdatasets. Canonical import: from arclm.finetuning import SFTTrainer. Fully qualified name: arclm.finetuning.SFTTrainer. Status: Beta."
        },
        {
          "title": "SFTTrainer parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "model",
                "Any",
                "required"
              ],
              [
                "tokenizer",
                "Any",
                "None"
              ],
              [
                "train_dataset",
                "Any",
                "None"
              ],
              [
                "config",
                "SFTConfig | None",
                "None"
              ],
              [
                "validation_dataset",
                "Any",
                "None"
              ],
              [
                "model_adapter",
                "Any",
                "None"
              ],
              [
                "tokenizer_adapter",
                "Any",
                "None"
              ],
              [
                "optimizer",
                "Any",
                "None"
              ],
              [
                "scheduler",
                "Any",
                "None"
              ],
              [
                "callbacks",
                "Any",
                "None"
              ],
              [
                "collate_fn",
                "Any",
                "None"
              ]
            ]
          }
        },
        {
          "title": "SFTTrainer example",
          "body": "",
          "code": "from arclm.finetuning import SFTTrainer\n\nprint(SFTTrainer)",
          "language": "python"
        },
        {
          "title": "SFTTrainingResult",
          "body": "Result returned by ``train_sft``. Canonical import: from arclm.finetuning import SFTTrainingResult. Fully qualified name: arclm.finetuning.SFTTrainingResult. Status: Beta."
        },
        {
          "title": "SFTTrainingResult parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "model",
                "str",
                "required"
              ],
              [
                "dataset",
                "str",
                "required"
              ],
              [
                "output_dir",
                "str",
                "required"
              ],
              [
                "backend",
                "str",
                "required"
              ],
              [
                "use_lora",
                "bool",
                "required"
              ],
              [
                "assistant_only_loss",
                "bool",
                "required"
              ],
              [
                "train_loss_history",
                "List[float]",
                "required"
              ],
              [
                "steps",
                "int",
                "required"
              ],
              [
                "metadata_path",
                "str",
                "required"
              ],
              [
                "adapter_path",
                "Optional[str]",
                "None"
              ],
              [
                "full_model_path",
                "Optional[str]",
                "None"
              ]
            ]
          }
        },
        {
          "title": "SFTTrainingResult example",
          "body": "",
          "code": "from arclm.finetuning import SFTTrainingResult\n\nprint(SFTTrainingResult)",
          "language": "python"
        },
        {
          "title": "TokenizerAdapter",
          "body": "Zet verschillende tokenizers om naar \u00e9\u00e9n eenvoudige interface. Canonical import: from arclm.finetuning import TokenizerAdapter. Fully qualified name: arclm.finetuning.TokenizerAdapter. Status: Beta."
        },
        {
          "title": "TokenizerAdapter parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "tokenizer",
                "Any",
                "required"
              ],
              [
                "pad_token_id",
                "int | None",
                "None"
              ],
              [
                "eos_token_id",
                "int | None",
                "None"
              ]
            ]
          }
        },
        {
          "title": "TokenizerAdapter example",
          "body": "",
          "code": "from arclm.finetuning import TokenizerAdapter\n\nprint(TokenizerAdapter)",
          "language": "python"
        },
        {
          "title": "create_labels",
          "body": "Maakt labels en negeert padding tijdens de lossberekening. Canonical import: from arclm.finetuning import create_labels. Fully qualified name: arclm.finetuning.create_labels. Status: Beta."
        },
        {
          "title": "create_labels parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "input_ids",
                "Sequence[int]",
                "required"
              ],
              [
                "attention_mask",
                "Sequence[int] | None",
                "None"
              ],
              [
                "ignore_index",
                "int",
                "-100"
              ]
            ]
          }
        },
        {
          "title": "create_labels example",
          "body": "",
          "code": "from arclm.finetuning import create_labels\n\nprint(create_labels)",
          "language": "python"
        },
        {
          "title": "fine_tune",
          "body": "Voert full-parameter fine-tuning uit met de bestaande Trainer. Canonical import: from arclm.finetuning import fine_tune. Fully qualified name: arclm.finetuning.fine_tune. Status: Beta."
        },
        {
          "title": "fine_tune parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "model",
                "torch.nn.Module | None",
                "None"
              ],
              [
                "tokenizer",
                "Any | None",
                "None"
              ],
              [
                "loaded_model",
                "Any | None",
                "None"
              ],
              [
                "train_dataset",
                "Iterable[Mapping[str, Any]]",
                "required"
              ],
              [
                "eval_dataset",
                "Iterable[Mapping[str, Any]] | None",
                "None"
              ],
              [
                "training_config",
                "TrainingConfig | None",
                "None"
              ],
              [
                "fine_tuning_config",
                "FineTuningConfig | None",
                "None"
              ],
              [
                "model_adapter",
                "ModelAdapter | None",
                "None"
              ],
              [
                "tokenizer_adapter",
                "TokenizerAdapter | None",
                "None"
              ],
              [
                "peft_config",
                "Any | None",
                "None"
              ],
              [
                "resume_from_checkpoint",
                "Any",
                "None"
              ],
              [
                "save_checkpoint",
                "bool",
                "False"
              ],
              [
                "reproducibility_metadata",
                "Mapping[str, Any] | None",
                "None"
              ]
            ]
          }
        },
        {
          "title": "fine_tune example",
          "body": "",
          "code": "from arclm.finetuning import fine_tune\n\nprint(fine_tune)",
          "language": "python"
        },
        {
          "title": "fine_tuning_format_fingerprint",
          "body": "Fingerprint only fields that affect prepared fine-tuning examples. Canonical import: from arclm.finetuning import fine_tuning_format_fingerprint. Fully qualified name: arclm.finetuning.fine_tuning_format_fingerprint. Status: Beta."
        },
        {
          "title": "fine_tuning_format_fingerprint parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "config",
                "FineTuningConfig",
                "required"
              ],
              [
                "tokenizer_identity",
                "Mapping[str, Any] | None",
                "None"
              ]
            ]
          }
        },
        {
          "title": "fine_tuning_format_fingerprint example",
          "body": "",
          "code": "from arclm.finetuning import fine_tuning_format_fingerprint\n\nprint(fine_tuning_format_fingerprint)",
          "language": "python"
        },
        {
          "title": "format_chat_example",
          "body": "Maakt tekst van chat messages. Canonical import: from arclm.finetuning import format_chat_example. Fully qualified name: arclm.finetuning.format_chat_example. Status: Beta."
        },
        {
          "title": "format_chat_example parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "example",
                "dict[str, Any]",
                "required"
              ],
              [
                "config",
                "SFTConfig",
                "required"
              ],
              [
                "tokenizer_adapter",
                "Any",
                "None"
              ]
            ]
          }
        },
        {
          "title": "format_chat_example example",
          "body": "",
          "code": "from arclm.finetuning import format_chat_example\n\nprint(format_chat_example)",
          "language": "python"
        },
        {
          "title": "format_example",
          "body": "Formatteert \u00e9\u00e9n voorbeeld volgens de gekozen datasetvorm. Canonical import: from arclm.finetuning import format_example. Fully qualified name: arclm.finetuning.format_example. Status: Beta."
        },
        {
          "title": "format_example parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "example",
                "dict[str, Any]",
                "required"
              ],
              [
                "config",
                "SFTConfig",
                "required"
              ],
              [
                "tokenizer_adapter",
                "Any",
                "None"
              ]
            ]
          }
        },
        {
          "title": "format_example example",
          "body": "",
          "code": "from arclm.finetuning import format_example\n\nprint(format_example)",
          "language": "python"
        },
        {
          "title": "format_instruction_example",
          "body": "Maakt tekst van een instruction-response voorbeeld. Canonical import: from arclm.finetuning import format_instruction_example. Fully qualified name: arclm.finetuning.format_instruction_example. Status: Beta."
        },
        {
          "title": "format_instruction_example parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "example",
                "dict[str, Any]",
                "required"
              ],
              [
                "config",
                "SFTConfig",
                "required"
              ]
            ]
          }
        },
        {
          "title": "format_instruction_example example",
          "body": "",
          "code": "from arclm.finetuning import format_instruction_example\n\nprint(format_instruction_example)",
          "language": "python"
        },
        {
          "title": "format_prompt_response_example",
          "body": "Maakt tekst van een prompt-response voorbeeld. Canonical import: from arclm.finetuning import format_prompt_response_example. Fully qualified name: arclm.finetuning.format_prompt_response_example. Status: Beta."
        },
        {
          "title": "format_prompt_response_example parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "example",
                "dict[str, Any]",
                "required"
              ],
              [
                "config",
                "SFTConfig",
                "required"
              ]
            ]
          }
        },
        {
          "title": "format_prompt_response_example example",
          "body": "",
          "code": "from arclm.finetuning import format_prompt_response_example\n\nprint(format_prompt_response_example)",
          "language": "python"
        },
        {
          "title": "format_text_example",
          "body": "Maakt tekst van een plain-text voorbeeld. Canonical import: from arclm.finetuning import format_text_example. Fully qualified name: arclm.finetuning.format_text_example. Status: Beta."
        },
        {
          "title": "format_text_example parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "example",
                "dict[str, Any]",
                "required"
              ],
              [
                "config",
                "SFTConfig",
                "required"
              ]
            ]
          }
        },
        {
          "title": "format_text_example example",
          "body": "",
          "code": "from arclm.finetuning import format_text_example\n\nprint(format_text_example)",
          "language": "python"
        },
        {
          "title": "get_sft_record_contract",
          "body": "Describe one supported SFT record format. Canonical import: from arclm.finetuning import get_sft_record_contract. Fully qualified name: arclm.finetuning.get_sft_record_contract. Status: Beta."
        },
        {
          "title": "get_sft_record_contract parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "formatter",
                "str",
                "'instruction_response'"
              ]
            ]
          }
        },
        {
          "title": "get_sft_record_contract example",
          "body": "",
          "code": "from arclm.finetuning import get_sft_record_contract\n\nprint(get_sft_record_contract)",
          "language": "python"
        },
        {
          "title": "mask_labels",
          "body": "Zet labels buiten de actieve mask op `ignore_index`. Canonical import: from arclm.finetuning import mask_labels. Fully qualified name: arclm.finetuning.mask_labels. Status: Beta."
        },
        {
          "title": "mask_labels parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "input_ids",
                "Sequence[int]",
                "required"
              ],
              [
                "active_mask",
                "Sequence[int | bool]",
                "required"
              ],
              [
                "ignore_index",
                "int",
                "-100"
              ]
            ]
          }
        },
        {
          "title": "mask_labels example",
          "body": "",
          "code": "from arclm.finetuning import mask_labels\n\nprint(mask_labels)",
          "language": "python"
        },
        {
          "title": "normalize_fine_tuning_example",
          "body": "Normaliseert een datasetrecord naar veilige tekstsegmenten. Canonical import: from arclm.finetuning import normalize_fine_tuning_example. Fully qualified name: arclm.finetuning.normalize_fine_tuning_example. Status: Beta."
        },
        {
          "title": "normalize_fine_tuning_example parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "record",
                "Mapping[str, Any]",
                "required"
              ],
              [
                "source_index",
                "int",
                "required"
              ],
              [
                "config",
                "FineTuningConfig",
                "required"
              ]
            ]
          }
        },
        {
          "title": "normalize_fine_tuning_example example",
          "body": "",
          "code": "from arclm.finetuning import normalize_fine_tuning_example\n\nprint(normalize_fine_tuning_example)",
          "language": "python"
        },
        {
          "title": "pack_sequences",
          "body": "Pakt korte voorbeelden samen tot maximaal `max_length` tokens. Canonical import: from arclm.finetuning import pack_sequences. Fully qualified name: arclm.finetuning.pack_sequences. Status: Beta."
        },
        {
          "title": "pack_sequences parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "features",
                "list[dict]",
                "required"
              ],
              [
                "max_length",
                "int",
                "required"
              ],
              [
                "eos_token_id",
                "int | None",
                "None"
              ]
            ]
          }
        },
        {
          "title": "pack_sequences example",
          "body": "",
          "code": "from arclm.finetuning import pack_sequences\n\nprint(pack_sequences)",
          "language": "python"
        },
        {
          "title": "prepare_fine_tuning_dataset",
          "body": "Valideert, formatteert en tokenizet fine-tuning records. Canonical import: from arclm.finetuning import prepare_fine_tuning_dataset. Fully qualified name: arclm.finetuning.prepare_fine_tuning_dataset. Status: Beta."
        },
        {
          "title": "prepare_fine_tuning_dataset parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "records",
                "Iterable[Mapping[str, Any]]",
                "required"
              ],
              [
                "tokenizer",
                "Any",
                "required"
              ],
              [
                "config",
                "FineTuningConfig | None",
                "None"
              ],
              [
                "tokenizer_adapter",
                "TokenizerAdapter | None",
                "None"
              ]
            ]
          }
        },
        {
          "title": "prepare_fine_tuning_dataset example",
          "body": "",
          "code": "from arclm.finetuning import prepare_fine_tuning_dataset\n\nprint(prepare_fine_tuning_dataset)",
          "language": "python"
        },
        {
          "title": "prepare_fine_tuning_record",
          "body": "Prepare exactly one record using the canonical dataset-preparation path. Canonical import: from arclm.finetuning import prepare_fine_tuning_record. Fully qualified name: arclm.finetuning.prepare_fine_tuning_record. Status: Beta."
        },
        {
          "title": "prepare_fine_tuning_record parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "record",
                "Mapping[str, Any]",
                "required"
              ],
              [
                "tokenizer",
                "Any",
                "required"
              ],
              [
                "config",
                "FineTuningConfig | None",
                "None"
              ],
              [
                "tokenizer_adapter",
                "TokenizerAdapter | None",
                "None"
              ],
              [
                "record_index",
                "int",
                "0"
              ]
            ]
          }
        },
        {
          "title": "prepare_fine_tuning_record example",
          "body": "",
          "code": "from arclm.finetuning import prepare_fine_tuning_record\n\nprint(prepare_fine_tuning_record)",
          "language": "python"
        },
        {
          "title": "train_sft",
          "body": "Run supervised fine-tuning through an ArcLM backend. Canonical import: from arclm.finetuning import train_sft. Fully qualified name: arclm.finetuning.train_sft. Status: Beta."
        },
        {
          "title": "train_sft parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "model",
                "str",
                "required"
              ],
              [
                "dataset",
                "str",
                "required"
              ],
              [
                "output_dir",
                "str",
                "required"
              ],
              [
                "backend",
                "str",
                "'huggingface'"
              ],
              [
                "assistant_only_loss",
                "bool",
                "True"
              ],
              [
                "use_lora",
                "bool",
                "False"
              ],
              [
                "batch_size",
                "int",
                "1"
              ],
              [
                "gradient_accumulation_steps",
                "int",
                "1"
              ],
              [
                "learning_rate",
                "float",
                "0.0002"
              ],
              [
                "num_epochs",
                "int",
                "1"
              ],
              [
                "max_length",
                "int",
                "1024"
              ],
              [
                "dtype",
                "str",
                "'auto'"
              ],
              [
                "device_map",
                "Optional[str]",
                "None"
              ],
              [
                "trust_remote_code",
                "bool",
                "False"
              ],
              [
                "enable_thinking",
                "Optional[bool]",
                "False"
              ],
              [
                "lora_r",
                "int",
                "8"
              ],
              [
                "lora_alpha",
                "int",
                "16"
              ],
              [
                "lora_dropout",
                "float",
                "0.05"
              ],
              [
                "lora_target_modules",
                "Optional[Sequence[str]]",
                "None"
              ],
              [
                "max_steps",
                "Optional[int]",
                "None"
              ],
              [
                "seed",
                "int",
                "42"
              ],
              [
                "save_tokenizer",
                "bool",
                "True"
              ]
            ]
          }
        },
        {
          "title": "train_sft example",
          "body": "",
          "code": "from arclm.finetuning import train_sft\n\nprint(train_sft)",
          "language": "python"
        },
        {
          "title": "validate_sft_records",
          "body": "Validate SFT records through the canonical fine-tuning normalizer. Canonical import: from arclm.finetuning import validate_sft_records. Fully qualified name: arclm.finetuning.validate_sft_records. Status: Beta."
        },
        {
          "title": "validate_sft_records parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "records",
                "Iterable[Mapping[str, Any]]",
                "required"
              ],
              [
                "config",
                "FineTuningConfig | None",
                "None"
              ],
              [
                "strict",
                "bool",
                "True"
              ]
            ]
          }
        },
        {
          "title": "validate_sft_records example",
          "body": "",
          "code": "from arclm.finetuning import validate_sft_records\n\nprint(validate_sft_records)",
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
          "title": "AdaptedModelBundle",
          "body": "ArcLM model and metadata produced from a normalized checkpoint. Canonical import: from arclm.checkpoints import AdaptedModelBundle. Fully qualified name: arclm.checkpoints.AdaptedModelBundle. Status: Stable."
        },
        {
          "title": "AdaptedModelBundle parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "model",
                "Module",
                "required"
              ],
              [
                "config",
                "Any",
                "required"
              ],
              [
                "checkpoint",
                "LoadedCheckpoint",
                "required"
              ],
              [
                "missing_keys",
                "list",
                "required"
              ],
              [
                "unexpected_keys",
                "list",
                "required"
              ],
              [
                "tokenizer_metadata",
                "Dict",
                "<factory>"
              ]
            ]
          }
        },
        {
          "title": "AdaptedModelBundle example",
          "body": "",
          "code": "from arclm.checkpoints import AdaptedModelBundle\n\nprint(AdaptedModelBundle)",
          "language": "python"
        },
        {
          "title": "CheckpointInfo",
          "body": "Beschrijft een training checkpoint zonder training te starten. Canonical import: from arclm.checkpoints import CheckpointInfo. Fully qualified name: arclm.checkpoints.CheckpointInfo. Status: Stable."
        },
        {
          "title": "CheckpointInfo parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "path",
                "str",
                "required"
              ],
              [
                "format",
                "str",
                "required"
              ],
              [
                "version",
                "int | None",
                "required"
              ],
              [
                "legacy",
                "bool",
                "required"
              ],
              [
                "epoch",
                "int",
                "required"
              ],
              [
                "global_step",
                "int",
                "required"
              ],
              [
                "optimizer_step",
                "int",
                "required"
              ],
              [
                "precision",
                "str | None",
                "None"
              ],
              [
                "device",
                "str | None",
                "None"
              ],
              [
                "arclm_version",
                "str | None",
                "None"
              ],
              [
                "pytorch_version",
                "str | None",
                "None"
              ],
              [
                "created_at",
                "float | None",
                "None"
              ],
              [
                "has_model_state",
                "bool",
                "False"
              ],
              [
                "has_optimizer_state",
                "bool",
                "False"
              ],
              [
                "has_scheduler_state",
                "bool",
                "False"
              ],
              [
                "has_scaler_state",
                "bool",
                "False"
              ],
              [
                "has_rng_state",
                "bool",
                "False"
              ],
              [
                "has_lifecycle_metadata",
                "bool",
                "False"
              ],
              [
                "training_state",
                "dict[str, Any]",
                "<factory>"
              ],
              [
                "config_snapshot",
                "dict[str, Any]",
                "<factory>"
              ],
              [
                "lifecycle_metadata",
                "dict[str, Any]",
                "<factory>"
              ],
              [
                "metadata",
                "dict[str, Any]",
                "<factory>"
              ]
            ]
          }
        },
        {
          "title": "CheckpointInfo example",
          "body": "",
          "code": "from arclm.checkpoints import CheckpointInfo\n\nprint(CheckpointInfo)",
          "language": "python"
        },
        {
          "title": "CheckpointLoader",
          "body": "Base class for source-specific checkpoint loaders. Canonical import: from arclm.checkpoints import CheckpointLoader. Fully qualified name: arclm.checkpoints.CheckpointLoader. Status: Stable."
        },
        {
          "title": "CheckpointLoader parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "CheckpointLoader example",
          "body": "",
          "code": "from arclm.checkpoints import CheckpointLoader\n\nprint(CheckpointLoader)",
          "language": "python"
        },
        {
          "title": "LoadedCheckpoint",
          "body": "Normalized representation of a model source that ArcLM can inspect. Canonical import: from arclm.checkpoints import LoadedCheckpoint. Fully qualified name: arclm.checkpoints.LoadedCheckpoint. Status: Stable."
        },
        {
          "title": "LoadedCheckpoint parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "source",
                "str",
                "required"
              ],
              [
                "source_type",
                "str",
                "required"
              ],
              [
                "state_dict",
                "Dict",
                "required"
              ],
              [
                "config",
                "Dict",
                "<factory>"
              ],
              [
                "vocab_size",
                "Optional",
                "None"
              ],
              [
                "tokenizer_metadata",
                "Dict",
                "<factory>"
              ],
              [
                "vocab",
                "Optional",
                "None"
              ],
              [
                "stoi",
                "Optional",
                "None"
              ],
              [
                "itos",
                "Optional",
                "None"
              ],
              [
                "optimizer_state_dict",
                "Optional",
                "None"
              ],
              [
                "train_history",
                "Dict",
                "<factory>"
              ],
              [
                "metadata",
                "Dict",
                "<factory>"
              ]
            ]
          }
        },
        {
          "title": "LoadedCheckpoint example",
          "body": "",
          "code": "from arclm.checkpoints import LoadedCheckpoint\n\nprint(LoadedCheckpoint)",
          "language": "python"
        },
        {
          "title": "LoaderRegistry",
          "body": "Ordered registry that picks the first loader matching a source. Canonical import: from arclm.checkpoints import LoaderRegistry. Fully qualified name: arclm.checkpoints.LoaderRegistry. Status: Stable."
        },
        {
          "title": "LoaderRegistry parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "loaders",
                "Optional",
                "None"
              ]
            ]
          }
        },
        {
          "title": "LoaderRegistry example",
          "body": "",
          "code": "from arclm.checkpoints import LoaderRegistry\n\nprint(LoaderRegistry)",
          "language": "python"
        },
        {
          "title": "LoadPlan",
          "body": "Detected and user-selected settings for loading a model source. Canonical import: from arclm.checkpoints import LoadPlan. Fully qualified name: arclm.checkpoints.LoadPlan. Status: Stable."
        },
        {
          "title": "LoadPlan parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "source",
                "str",
                "required"
              ],
              [
                "source_type",
                "str",
                "'unknown'"
              ],
              [
                "files",
                "List[str]",
                "<factory>"
              ],
              [
                "metadata",
                "Dict[str, Any]",
                "<factory>"
              ],
              [
                "model_type",
                "Optional[str]",
                "None"
              ],
              [
                "architecture",
                "Optional[str]",
                "None"
              ],
              [
                "tokenizer",
                "Optional[str]",
                "None"
              ],
              [
                "weight_format",
                "Optional[str]",
                "None"
              ],
              [
                "precision",
                "Optional[str]",
                "None"
              ],
              [
                "load_as",
                "Optional[str]",
                "None"
              ],
              [
                "has_optimizer",
                "bool",
                "False"
              ],
              [
                "has_scheduler",
                "bool",
                "False"
              ],
              [
                "has_training_state",
                "bool",
                "False"
              ],
              [
                "can_resume_training",
                "bool",
                "False"
              ],
              [
                "resume_epoch",
                "Optional[int]",
                "None"
              ],
              [
                "resume_step",
                "Optional[int]",
                "None"
              ],
              [
                "load_optimizer",
                "Optional[bool]",
                "None"
              ],
              [
                "load_scheduler",
                "Optional[bool]",
                "None"
              ],
              [
                "resume_training",
                "Optional[bool]",
                "None"
              ]
            ]
          }
        },
        {
          "title": "LoadPlan example",
          "body": "",
          "code": "from arclm.checkpoints import LoadPlan\n\nprint(LoadPlan)",
          "language": "python"
        },
        {
          "title": "ModelInspector",
          "body": "Base class for source inspectors used by ``SmartLoader``. Canonical import: from arclm.checkpoints import ModelInspector. Fully qualified name: arclm.checkpoints.ModelInspector. Status: Stable."
        },
        {
          "title": "ModelInspector parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "ModelInspector example",
          "body": "",
          "code": "from arclm.checkpoints import ModelInspector\n\nprint(ModelInspector)",
          "language": "python"
        },
        {
          "title": "SmartLoader",
          "body": "High-level loading entry point with inspection and manual overrides. Canonical import: from arclm.checkpoints import SmartLoader. Fully qualified name: arclm.checkpoints.SmartLoader. Status: Stable."
        },
        {
          "title": "SmartLoader parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "SmartLoader example",
          "body": "",
          "code": "from arclm.checkpoints import SmartLoader\n\nprint(SmartLoader)",
          "language": "python"
        },
        {
          "title": "CHECKPOINT_FORMAT",
          "body": "str(object='') -> str str(bytes_or_buffer[, encoding[, errors]]) -> str Create a new string object from the given object. Canonical import: from arclm.checkpoints import CHECKPOINT_FORMAT. Fully qualified name: arclm.checkpoints.CHECKPOINT_FORMAT. Status: Stable."
        },
        {
          "title": "CHECKPOINT_FORMAT parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "CHECKPOINT_FORMAT example",
          "body": "",
          "code": "from arclm.checkpoints import CHECKPOINT_FORMAT\n\nprint(CHECKPOINT_FORMAT)",
          "language": "python"
        },
        {
          "title": "CHECKPOINT_VERSION",
          "body": "int([x]) -> integer int(x, base=10) -> integer Convert a number or string to an integer, or return 0 if no arguments are given. Canonical import: from arclm.checkpoints import CHECKPOINT_VERSION. Fully qualified name: arclm.checkpoints.CHECKPOINT_VERSION. Status: Stable."
        },
        {
          "title": "CHECKPOINT_VERSION parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "CHECKPOINT_VERSION example",
          "body": "",
          "code": "from arclm.checkpoints import CHECKPOINT_VERSION\n\nprint(CHECKPOINT_VERSION)",
          "language": "python"
        },
        {
          "title": "adapt_for_training",
          "body": "Create an ArcLM model from a normalized checkpoint. Canonical import: from arclm.checkpoints import adapt_for_training. Fully qualified name: arclm.checkpoints.adapt_for_training. Status: Stable."
        },
        {
          "title": "adapt_for_training parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "checkpoint",
                "LoadedCheckpoint",
                "required"
              ],
              [
                "target_config",
                "Optional",
                "None"
              ],
              [
                "tokenizer",
                "Optional",
                "None"
              ],
              [
                "strict",
                "bool",
                "False"
              ],
              [
                "require_tokenizer_match",
                "bool",
                "False"
              ],
              [
                "config_overrides",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "adapt_for_training example",
          "body": "",
          "code": "from arclm.checkpoints import adapt_for_training\n\nprint(adapt_for_training)",
          "language": "python"
        },
        {
          "title": "create_default_registry",
          "body": "Maakt de standaard registry met loaders. Canonical import: from arclm.checkpoints import create_default_registry. Fully qualified name: arclm.checkpoints.create_default_registry. Status: Stable."
        },
        {
          "title": "create_default_registry parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "create_default_registry example",
          "body": "",
          "code": "from arclm.checkpoints import create_default_registry\n\nprint(create_default_registry)",
          "language": "python"
        },
        {
          "title": "inspect_checkpoint",
          "body": "Inspecteert een vertrouwd training checkpoint zonder objects te maken. Canonical import: from arclm.checkpoints import inspect_checkpoint. Fully qualified name: arclm.checkpoints.inspect_checkpoint. Status: Stable."
        },
        {
          "title": "inspect_checkpoint parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "path",
                "str | Path",
                "required"
              ],
              [
                "validate",
                "bool",
                "False"
              ]
            ]
          }
        },
        {
          "title": "inspect_checkpoint example",
          "body": "",
          "code": "from arclm.checkpoints import inspect_checkpoint\n\nprint(inspect_checkpoint)",
          "language": "python"
        },
        {
          "title": "inspect_model_source",
          "body": "Inspect a model source and merge explicit user settings over detections. Canonical import: from arclm.checkpoints import inspect_model_source. Fully qualified name: arclm.checkpoints.inspect_model_source. Status: Stable."
        },
        {
          "title": "inspect_model_source parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "source",
                "Any",
                "required"
              ],
              [
                "auto_detect",
                "bool",
                "True"
              ],
              [
                "inspectors",
                "Optional[Iterable[ModelInspector]]",
                "None"
              ],
              [
                "overrides",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "inspect_model_source example",
          "body": "",
          "code": "from arclm.checkpoints import inspect_model_source\n\nprint(inspect_model_source)",
          "language": "python"
        },
        {
          "title": "load_external_model",
          "body": "Load any supported external source into a normalized checkpoint bundle. Canonical import: from arclm.checkpoints import load_external_model. Fully qualified name: arclm.checkpoints.load_external_model. Status: Stable."
        },
        {
          "title": "load_external_model parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "source",
                "Any",
                "required"
              ],
              [
                "map_location",
                "str",
                "'cpu'"
              ]
            ]
          }
        },
        {
          "title": "load_external_model example",
          "body": "",
          "code": "from arclm.checkpoints import load_external_model\n\nprint(load_external_model)",
          "language": "python"
        },
        {
          "title": "register_model_inspector",
          "body": "Register a custom model-source inspector. Canonical import: from arclm.checkpoints import register_model_inspector. Fully qualified name: arclm.checkpoints.register_model_inspector. Status: Stable."
        },
        {
          "title": "register_model_inspector parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "inspector",
                "ModelInspector",
                "required"
              ]
            ]
          }
        },
        {
          "title": "register_model_inspector example",
          "body": "",
          "code": "from arclm.checkpoints import register_model_inspector\n\nprint(register_model_inspector)",
          "language": "python"
        },
        {
          "title": "validate_checkpoint",
          "body": "Valideert een checkpoint en geeft de veilige inspectie-info terug. Canonical import: from arclm.checkpoints import validate_checkpoint. Fully qualified name: arclm.checkpoints.validate_checkpoint. Status: Stable."
        },
        {
          "title": "validate_checkpoint parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "path",
                "str | Path",
                "required"
              ]
            ]
          }
        },
        {
          "title": "validate_checkpoint example",
          "body": "",
          "code": "from arclm.checkpoints import validate_checkpoint\n\nprint(validate_checkpoint)",
          "language": "python"
        },
        {
          "title": "validate_tokenizer_compatibility",
          "body": "Raise if a tokenizer cannot safely address the checkpoint vocabulary. Canonical import: from arclm.checkpoints import validate_tokenizer_compatibility. Fully qualified name: arclm.checkpoints.validate_tokenizer_compatibility. Status: Stable."
        },
        {
          "title": "validate_tokenizer_compatibility parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "checkpoint",
                "LoadedCheckpoint",
                "required"
              ],
              [
                "tokenizer",
                "Optional",
                "None"
              ],
              [
                "config",
                "Optional",
                "None"
              ]
            ]
          }
        },
        {
          "title": "validate_tokenizer_compatibility example",
          "body": "",
          "code": "from arclm.checkpoints import validate_tokenizer_compatibility\n\nprint(validate_tokenizer_compatibility)",
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
          "title": "Accuracy",
          "body": "Berekent accuracy voor classificatie of token logits. Canonical import: from arclm.evaluation import Accuracy. Fully qualified name: arclm.evaluation.Accuracy. Status: Stable."
        },
        {
          "title": "Accuracy parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "ignore_index",
                "int",
                "-100"
              ]
            ]
          }
        },
        {
          "title": "Accuracy example",
          "body": "",
          "code": "from arclm.evaluation import Accuracy\n\nprint(Accuracy)",
          "language": "python"
        },
        {
          "title": "BaseEvaluationCallback",
          "body": "Basis class voor eigen evaluation callbacks. Canonical import: from arclm.evaluation import BaseEvaluationCallback. Fully qualified name: arclm.evaluation.BaseEvaluationCallback. Status: Stable."
        },
        {
          "title": "BaseEvaluationCallback parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "BaseEvaluationCallback example",
          "body": "",
          "code": "from arclm.evaluation import BaseEvaluationCallback\n\nprint(BaseEvaluationCallback)",
          "language": "python"
        },
        {
          "title": "BaseEvaluator",
          "body": "Basis class voor eigen evaluators. Canonical import: from arclm.evaluation import BaseEvaluator. Fully qualified name: arclm.evaluation.BaseEvaluator. Status: Stable."
        },
        {
          "title": "BaseEvaluator parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "BaseEvaluator example",
          "body": "",
          "code": "from arclm.evaluation import BaseEvaluator\n\nprint(BaseEvaluator)",
          "language": "python"
        },
        {
          "title": "BaseMetric",
          "body": "Basis class voor developers die een eigen metric willen maken. Canonical import: from arclm.evaluation import BaseMetric. Fully qualified name: arclm.evaluation.BaseMetric. Status: Stable."
        },
        {
          "title": "BaseMetric parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "BaseMetric example",
          "body": "",
          "code": "from arclm.evaluation import BaseMetric\n\nprint(BaseMetric)",
          "language": "python"
        },
        {
          "title": "ConceptBenchmarkCase",
          "body": "Expected concept relationships for a prompt. Canonical import: from arclm.evaluation import ConceptBenchmarkCase. Fully qualified name: arclm.evaluation.ConceptBenchmarkCase. Status: Stable."
        },
        {
          "title": "ConceptBenchmarkCase parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "prompt",
                "str",
                "required"
              ],
              [
                "expected_concepts",
                "list",
                "required"
              ]
            ]
          }
        },
        {
          "title": "ConceptBenchmarkCase example",
          "body": "",
          "code": "from arclm.evaluation import ConceptBenchmarkCase\n\nprint(ConceptBenchmarkCase)",
          "language": "python"
        },
        {
          "title": "ConceptBenchmarkResult",
          "body": "Concept benchmark score for one prompt. Canonical import: from arclm.evaluation import ConceptBenchmarkResult. Fully qualified name: arclm.evaluation.ConceptBenchmarkResult. Status: Stable."
        },
        {
          "title": "ConceptBenchmarkResult parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "prompt",
                "str",
                "required"
              ],
              [
                "expected_concepts",
                "list",
                "required"
              ],
              [
                "predicted_tokens",
                "list",
                "required"
              ],
              [
                "matched_concepts",
                "list",
                "required"
              ],
              [
                "score",
                "float",
                "required"
              ]
            ]
          }
        },
        {
          "title": "ConceptBenchmarkResult example",
          "body": "",
          "code": "from arclm.evaluation import ConceptBenchmarkResult\n\nprint(ConceptBenchmarkResult)",
          "language": "python"
        },
        {
          "title": "EvaluationConfig",
          "body": "Bewaart instellingen voor een evaluatierun. Canonical import: from arclm.evaluation import EvaluationConfig. Fully qualified name: arclm.evaluation.EvaluationConfig. Status: Stable."
        },
        {
          "title": "EvaluationConfig parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "batch_size",
                "int",
                "8"
              ],
              [
                "device",
                "str",
                "'cpu'"
              ],
              [
                "max_batches",
                "int | None",
                "None"
              ],
              [
                "ignore_index",
                "int",
                "-100"
              ],
              [
                "return_predictions",
                "bool",
                "False"
              ],
              [
                "prediction_key",
                "str",
                "'logits'"
              ],
              [
                "label_key",
                "str",
                "'labels'"
              ]
            ]
          }
        },
        {
          "title": "EvaluationConfig example",
          "body": "",
          "code": "from arclm.evaluation import EvaluationConfig\n\nprint(EvaluationConfig)",
          "language": "python"
        },
        {
          "title": "EvaluationReport",
          "body": "Structured, JSON-safe summary of an evaluation run. Canonical import: from arclm.evaluation import EvaluationReport. Fully qualified name: arclm.evaluation.EvaluationReport. Status: Stable."
        },
        {
          "title": "EvaluationReport parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "metrics",
                "dict[str, float | int | str | None]",
                "required"
              ],
              [
                "num_examples",
                "int",
                "required"
              ],
              [
                "num_batches",
                "int",
                "required"
              ],
              [
                "num_tokens",
                "int | None",
                "required"
              ],
              [
                "model_identity",
                "str | None",
                "required"
              ],
              [
                "checkpoint_identity",
                "str | None",
                "required"
              ],
              [
                "dataset_identity",
                "str | None",
                "required"
              ],
              [
                "evaluation_timestamp",
                "float",
                "required"
              ],
              [
                "device",
                "str | None",
                "required"
              ],
              [
                "dtype",
                "str | None",
                "required"
              ],
              [
                "warnings",
                "tuple[str, ...]",
                "()"
              ]
            ]
          }
        },
        {
          "title": "EvaluationReport example",
          "body": "",
          "code": "from arclm.evaluation import EvaluationReport\n\nprint(EvaluationReport)",
          "language": "python"
        },
        {
          "title": "EvaluationResult",
          "body": "Bewaart de uitkomst van een evaluatierun. Canonical import: from arclm.evaluation import EvaluationResult. Fully qualified name: arclm.evaluation.EvaluationResult. Status: Stable."
        },
        {
          "title": "EvaluationResult parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "metrics",
                "dict[str, float | None]",
                "required"
              ],
              [
                "num_examples",
                "int",
                "required"
              ],
              [
                "num_batches",
                "int",
                "required"
              ],
              [
                "predictions",
                "list[Any] | None",
                "None"
              ],
              [
                "labels",
                "list[Any] | None",
                "None"
              ],
              [
                "metadata",
                "dict[str, Any]",
                "<factory>"
              ]
            ]
          }
        },
        {
          "title": "EvaluationResult example",
          "body": "",
          "code": "from arclm.evaluation import EvaluationResult\n\nprint(EvaluationResult)",
          "language": "python"
        },
        {
          "title": "Evaluator",
          "body": "Voert evaluatie uit op een model en dataset. Canonical import: from arclm.evaluation import Evaluator. Fully qualified name: arclm.evaluation.Evaluator. Status: Stable."
        },
        {
          "title": "Evaluator parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "model",
                "Any",
                "required"
              ],
              [
                "dataset",
                "Any",
                "None"
              ],
              [
                "metrics",
                "list[BaseMetric] | None",
                "None"
              ],
              [
                "config",
                "EvaluationConfig | None",
                "None"
              ],
              [
                "dataloader",
                "Any",
                "None"
              ],
              [
                "callbacks",
                "list[BaseEvaluationCallback] | None",
                "None"
              ],
              [
                "collate_fn",
                "Any",
                "None"
              ],
              [
                "loss_fn",
                "Any",
                "None"
              ]
            ]
          }
        },
        {
          "title": "Evaluator example",
          "body": "",
          "code": "from arclm.evaluation import Evaluator\n\nprint(Evaluator)",
          "language": "python"
        },
        {
          "title": "LongContextResult",
          "body": "Summary for one long-context training/evaluation run. Canonical import: from arclm.evaluation import LongContextResult. Fully qualified name: arclm.evaluation.LongContextResult. Status: Stable."
        },
        {
          "title": "LongContextResult parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "block_size",
                "int",
                "required"
              ],
              [
                "validation_loss",
                "float",
                "required"
              ],
              [
                "concept_score",
                "float",
                "required"
              ],
              [
                "generated_sample",
                "str",
                "required"
              ]
            ]
          }
        },
        {
          "title": "LongContextResult example",
          "body": "",
          "code": "from arclm.evaluation import LongContextResult\n\nprint(LongContextResult)",
          "language": "python"
        },
        {
          "title": "LossMetric",
          "body": "Berekent gemiddelde loss per batch. Canonical import: from arclm.evaluation import LossMetric. Fully qualified name: arclm.evaluation.LossMetric. Status: Stable."
        },
        {
          "title": "LossMetric parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "LossMetric example",
          "body": "",
          "code": "from arclm.evaluation import LossMetric\n\nprint(LossMetric)",
          "language": "python"
        },
        {
          "title": "MetricsReport",
          "body": "Comprehensive metrics report for model evaluation. Canonical import: from arclm.evaluation import MetricsReport. Fully qualified name: arclm.evaluation.MetricsReport. Status: Stable."
        },
        {
          "title": "MetricsReport parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "perplexity",
                "float",
                "required"
              ],
              [
                "avg_loss",
                "float",
                "required"
              ],
              [
                "total_tokens",
                "int",
                "required"
              ],
              [
                "correct_predictions",
                "int",
                "required"
              ],
              [
                "accuracy",
                "float",
                "required"
              ],
              [
                "timestamp",
                "str",
                "''"
              ]
            ]
          }
        },
        {
          "title": "MetricsReport example",
          "body": "",
          "code": "from arclm.evaluation import MetricsReport\n\nprint(MetricsReport)",
          "language": "python"
        },
        {
          "title": "Perplexity",
          "body": "Berekent perplexity uit gemiddelde loss. Canonical import: from arclm.evaluation import Perplexity. Fully qualified name: arclm.evaluation.Perplexity. Status: Stable."
        },
        {
          "title": "Perplexity parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "max_loss",
                "float",
                "20.0"
              ]
            ]
          }
        },
        {
          "title": "Perplexity example",
          "body": "",
          "code": "from arclm.evaluation import Perplexity\n\nprint(Perplexity)",
          "language": "python"
        },
        {
          "title": "TopKPrediction",
          "body": "One next-token prediction. Canonical import: from arclm.evaluation import TopKPrediction. Fully qualified name: arclm.evaluation.TopKPrediction. Status: Stable."
        },
        {
          "title": "TopKPrediction parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "rank",
                "int",
                "required"
              ],
              [
                "token",
                "str",
                "required"
              ],
              [
                "probability",
                "float",
                "required"
              ]
            ]
          }
        },
        {
          "title": "TopKPrediction example",
          "body": "",
          "code": "from arclm.evaluation import TopKPrediction\n\nprint(TopKPrediction)",
          "language": "python"
        },
        {
          "title": "DEFAULT_CONCEPT_BENCHMARKS",
          "body": "Built-in mutable sequence. Canonical import: from arclm.evaluation import DEFAULT_CONCEPT_BENCHMARKS. Fully qualified name: arclm.evaluation.DEFAULT_CONCEPT_BENCHMARKS. Status: Stable."
        },
        {
          "title": "DEFAULT_CONCEPT_BENCHMARKS parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "DEFAULT_CONCEPT_BENCHMARKS example",
          "body": "",
          "code": "from arclm.evaluation import DEFAULT_CONCEPT_BENCHMARKS\n\nprint(DEFAULT_CONCEPT_BENCHMARKS)",
          "language": "python"
        },
        {
          "title": "build_evaluation_report",
          "body": "Build a report from canonical evaluator metrics without recalculation. Canonical import: from arclm.evaluation import build_evaluation_report. Fully qualified name: arclm.evaluation.build_evaluation_report. Status: Stable."
        },
        {
          "title": "build_evaluation_report parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "result",
                "EvaluationResult",
                "required"
              ],
              [
                "model",
                "Any | None",
                "None"
              ],
              [
                "checkpoint_identity",
                "str | None",
                "None"
              ],
              [
                "dataset_identity",
                "str | None",
                "None"
              ],
              [
                "num_tokens",
                "int | None",
                "None"
              ],
              [
                "warnings",
                "list[str] | tuple[str, ...]",
                "()"
              ]
            ]
          }
        },
        {
          "title": "build_evaluation_report example",
          "body": "",
          "code": "from arclm.evaluation import build_evaluation_report\n\nprint(build_evaluation_report)",
          "language": "python"
        },
        {
          "title": "build_training_diagnostics_report",
          "body": "Build tokenizer, top-k, and concept benchmark diagnostics for a run. Canonical import: from arclm.evaluation import build_training_diagnostics_report. Fully qualified name: arclm.evaluation.build_training_diagnostics_report. Status: Stable."
        },
        {
          "title": "build_training_diagnostics_report parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "model",
                "Any",
                "required"
              ],
              [
                "data",
                "Any",
                "required"
              ],
              [
                "config",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "build_training_diagnostics_report example",
          "body": "",
          "code": "from arclm.evaluation import build_training_diagnostics_report\n\nprint(build_training_diagnostics_report)",
          "language": "python"
        },
        {
          "title": "calculate_metrics",
          "body": "Calculate comprehensive evaluation metrics. Canonical import: from arclm.evaluation import calculate_metrics. Fully qualified name: arclm.evaluation.calculate_metrics. Status: Stable."
        },
        {
          "title": "calculate_metrics parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "model",
                "Any",
                "required"
              ],
              [
                "val_loader",
                "Any",
                "required"
              ],
              [
                "config",
                "Any",
                "required"
              ],
              [
                "device",
                "Any",
                "'cpu'"
              ]
            ]
          }
        },
        {
          "title": "calculate_metrics example",
          "body": "",
          "code": "from arclm.evaluation import calculate_metrics\n\nprint(calculate_metrics)",
          "language": "python"
        },
        {
          "title": "calculate_perplexity",
          "body": "Return perplexity for a cross-entropy loss value. Canonical import: from arclm.evaluation import calculate_perplexity. Fully qualified name: arclm.evaluation.calculate_perplexity. Status: Stable."
        },
        {
          "title": "calculate_perplexity parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "loss",
                "float",
                "required"
              ]
            ]
          }
        },
        {
          "title": "calculate_perplexity example",
          "body": "",
          "code": "from arclm.evaluation import calculate_perplexity\n\nprint(calculate_perplexity)",
          "language": "python"
        },
        {
          "title": "evaluate",
          "body": "Voert evaluatie uit met de standaard `Evaluator`. Canonical import: from arclm.evaluation import evaluate. Fully qualified name: arclm.evaluation.evaluate. Status: Stable."
        },
        {
          "title": "evaluate parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "model",
                "Any",
                "required"
              ],
              [
                "dataset",
                "Any",
                "None"
              ],
              [
                "metrics",
                "Any",
                "None"
              ],
              [
                "config",
                "Any",
                "None"
              ],
              [
                "kwargs",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "evaluate example",
          "body": "",
          "code": "from arclm.evaluation import evaluate\n\nprint(evaluate)",
          "language": "python"
        },
        {
          "title": "export_metrics_to_json",
          "body": "Export metrics report to JSON file. Canonical import: from arclm.evaluation import export_metrics_to_json. Fully qualified name: arclm.evaluation.export_metrics_to_json. Status: Stable."
        },
        {
          "title": "export_metrics_to_json parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "metrics_report",
                "Any",
                "required"
              ],
              [
                "filepath",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "export_metrics_to_json example",
          "body": "",
          "code": "from arclm.evaluation import export_metrics_to_json\n\nprint(export_metrics_to_json)",
          "language": "python"
        },
        {
          "title": "export_metrics_to_markdown",
          "body": "Export metrics report to Markdown file. Canonical import: from arclm.evaluation import export_metrics_to_markdown. Fully qualified name: arclm.evaluation.export_metrics_to_markdown. Status: Stable."
        },
        {
          "title": "export_metrics_to_markdown parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "metrics_report",
                "Any",
                "required"
              ],
              [
                "filepath",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "export_metrics_to_markdown example",
          "body": "",
          "code": "from arclm.evaluation import export_metrics_to_markdown\n\nprint(export_metrics_to_markdown)",
          "language": "python"
        },
        {
          "title": "format_concept_benchmark_report",
          "body": "Create a readable concept benchmark report. Canonical import: from arclm.evaluation import format_concept_benchmark_report. Fully qualified name: arclm.evaluation.format_concept_benchmark_report. Status: Stable."
        },
        {
          "title": "format_concept_benchmark_report parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "report",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "format_concept_benchmark_report example",
          "body": "",
          "code": "from arclm.evaluation import format_concept_benchmark_report\n\nprint(format_concept_benchmark_report)",
          "language": "python"
        },
        {
          "title": "format_long_context_results",
          "body": "Create a readable long-context comparison report. Canonical import: from arclm.evaluation import format_long_context_results. Fully qualified name: arclm.evaluation.format_long_context_results. Status: Stable."
        },
        {
          "title": "format_long_context_results parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "results",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "format_long_context_results example",
          "body": "",
          "code": "from arclm.evaluation import format_long_context_results\n\nprint(format_long_context_results)",
          "language": "python"
        },
        {
          "title": "format_tokenizer_coverage_report",
          "body": "Create a readable tokenizer coverage report. Canonical import: from arclm.evaluation import format_tokenizer_coverage_report. Fully qualified name: arclm.evaluation.format_tokenizer_coverage_report. Status: Stable."
        },
        {
          "title": "format_tokenizer_coverage_report parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "coverage",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "format_tokenizer_coverage_report example",
          "body": "",
          "code": "from arclm.evaluation import format_tokenizer_coverage_report\n\nprint(format_tokenizer_coverage_report)",
          "language": "python"
        },
        {
          "title": "format_top_k_predictions",
          "body": "Create a readable diagnostic report for one prompt. Canonical import: from arclm.evaluation import format_top_k_predictions. Fully qualified name: arclm.evaluation.format_top_k_predictions. Status: Stable."
        },
        {
          "title": "format_top_k_predictions parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "prompt",
                "Any",
                "required"
              ],
              [
                "predictions",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "format_top_k_predictions example",
          "body": "",
          "code": "from arclm.evaluation import format_top_k_predictions\n\nprint(format_top_k_predictions)",
          "language": "python"
        },
        {
          "title": "predict_top_k",
          "body": "Return the top-k next-token probabilities for a prompt. Canonical import: from arclm.evaluation import predict_top_k. Fully qualified name: arclm.evaluation.predict_top_k. Status: Stable."
        },
        {
          "title": "predict_top_k parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "model",
                "Any",
                "required"
              ],
              [
                "stoi",
                "Any",
                "required"
              ],
              [
                "itos",
                "Any",
                "required"
              ],
              [
                "block_size",
                "Any",
                "required"
              ],
              [
                "device",
                "Any",
                "required"
              ],
              [
                "prompt",
                "Any",
                "required"
              ],
              [
                "k",
                "Any",
                "5"
              ],
              [
                "tokenizer",
                "Any",
                "None"
              ]
            ]
          }
        },
        {
          "title": "predict_top_k example",
          "body": "",
          "code": "from arclm.evaluation import predict_top_k\n\nprint(predict_top_k)",
          "language": "python"
        },
        {
          "title": "run_long_context_evaluation",
          "body": "Train and compare multiple block sizes by validation loss and concepts. Canonical import: from arclm.evaluation import run_long_context_evaluation. Fully qualified name: arclm.evaluation.run_long_context_evaluation. Status: Stable."
        },
        {
          "title": "run_long_context_evaluation parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "base_config",
                "Any",
                "required"
              ],
              [
                "block_sizes",
                "Any",
                "(32, 64, 128)"
              ],
              [
                "benchmark_cases",
                "Any",
                "None"
              ],
              [
                "sample_prompt",
                "Any",
                "'Programming is'"
              ]
            ]
          }
        },
        {
          "title": "run_long_context_evaluation example",
          "body": "",
          "code": "from arclm.evaluation import run_long_context_evaluation\n\nprint(run_long_context_evaluation)",
          "language": "python"
        },
        {
          "title": "score_concept_relationships",
          "body": "Score expected concepts against top-k next-token predictions. Canonical import: from arclm.evaluation import score_concept_relationships. Fully qualified name: arclm.evaluation.score_concept_relationships. Status: Stable."
        },
        {
          "title": "score_concept_relationships parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "model",
                "Any",
                "required"
              ],
              [
                "stoi",
                "Any",
                "required"
              ],
              [
                "itos",
                "Any",
                "required"
              ],
              [
                "block_size",
                "Any",
                "required"
              ],
              [
                "device",
                "Any",
                "required"
              ],
              [
                "benchmark_cases",
                "Any",
                "None"
              ],
              [
                "k",
                "Any",
                "10"
              ],
              [
                "tokenizer",
                "Any",
                "None"
              ]
            ]
          }
        },
        {
          "title": "score_concept_relationships example",
          "body": "",
          "code": "from arclm.evaluation import score_concept_relationships\n\nprint(score_concept_relationships)",
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
          "title": "CheckpointTokenizer",
          "body": "Fallback tokenizer reconstructed from checkpoint vocabulary data. Canonical import: from arclm.inference import CheckpointTokenizer. Fully qualified name: arclm.inference.CheckpointTokenizer. Status: Beta."
        },
        {
          "title": "CheckpointTokenizer parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "stoi",
                "Any",
                "required"
              ],
              [
                "itos",
                "Any",
                "required"
              ],
              [
                "tokenizer_type",
                "Any",
                "'word'"
              ]
            ]
          }
        },
        {
          "title": "CheckpointTokenizer example",
          "body": "",
          "code": "from arclm.inference import CheckpointTokenizer\n\nprint(CheckpointTokenizer)",
          "language": "python"
        },
        {
          "title": "ExternalLoadedModel",
          "body": "Loaded model wrapper with a unified inference and save API. Canonical import: from arclm.inference import ExternalLoadedModel. Fully qualified name: arclm.inference.ExternalLoadedModel. Status: Beta."
        },
        {
          "title": "ExternalLoadedModel parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "model",
                "Any",
                "required"
              ],
              [
                "tokenizer",
                "Any",
                "required"
              ],
              [
                "config",
                "ExternalModelConfig",
                "required"
              ],
              [
                "source_info",
                "ModelSourceInfo",
                "required"
              ],
              [
                "device",
                "Any",
                "required"
              ],
              [
                "processor",
                "Any",
                "None"
              ],
              [
                "_native_loaded",
                "Optional[LoadedModel]",
                "None"
              ],
              [
                "_generation_error",
                "Optional[str]",
                "None"
              ],
              [
                "_training_method",
                "Optional[str]",
                "None"
              ],
              [
                "_lora_merged",
                "bool",
                "False"
              ]
            ]
          }
        },
        {
          "title": "ExternalLoadedModel example",
          "body": "",
          "code": "from arclm.inference import ExternalLoadedModel\n\nprint(ExternalLoadedModel)",
          "language": "python"
        },
        {
          "title": "ExternalModelConfig",
          "body": "Configuration for loading native or external causal language models. Canonical import: from arclm.inference import ExternalModelConfig. Fully qualified name: arclm.inference.ExternalModelConfig. Status: Beta."
        },
        {
          "title": "ExternalModelConfig parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "source",
                "PathLike",
                "required"
              ],
              [
                "base_model",
                "Optional[str]",
                "None"
              ],
              [
                "device",
                "Optional[str]",
                "None"
              ],
              [
                "device_map",
                "Optional[Any]",
                "None"
              ],
              [
                "dtype",
                "Optional[Union[str, torch.dtype]]",
                "'auto'"
              ],
              [
                "trust_remote_code",
                "bool",
                "False"
              ],
              [
                "tokenizer_path",
                "Optional[PathLike]",
                "None"
              ],
              [
                "max_memory",
                "Optional[Any]",
                "None"
              ],
              [
                "load_in_8bit",
                "bool",
                "False"
              ],
              [
                "load_in_4bit",
                "bool",
                "False"
              ],
              [
                "enable_thinking",
                "Optional[bool]",
                "False"
              ],
              [
                "default_system_prompt",
                "Optional[str]",
                "None"
              ],
              [
                "fallback_to_simple_prompt",
                "bool",
                "True"
              ],
              [
                "fallback_to_cpu",
                "bool",
                "True"
              ],
              [
                "require_tokenizer",
                "bool",
                "True"
              ],
              [
                "prefer_best_native",
                "bool",
                "True"
              ],
              [
                "generation_config",
                "GenerationConfig",
                "<factory>"
              ],
              [
                "save_config",
                "ModelSaveConfig",
                "<factory>"
              ]
            ]
          }
        },
        {
          "title": "ExternalModelConfig example",
          "body": "",
          "code": "from arclm.inference import ExternalModelConfig\n\nprint(ExternalModelConfig)",
          "language": "python"
        },
        {
          "title": "GenerationConfig",
          "body": "Text generation defaults used by :class:`ExternalLoadedModel`. Canonical import: from arclm.inference import GenerationConfig. Fully qualified name: arclm.inference.GenerationConfig. Status: Beta."
        },
        {
          "title": "GenerationConfig parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "max_new_tokens",
                "int",
                "128"
              ],
              [
                "temperature",
                "float",
                "0.7"
              ],
              [
                "top_p",
                "Optional[float]",
                "0.9"
              ],
              [
                "top_k",
                "Optional[int]",
                "None"
              ],
              [
                "do_sample",
                "Optional[bool]",
                "None"
              ],
              [
                "repetition_penalty",
                "float",
                "1.0"
              ],
              [
                "pad_token_id",
                "Optional[int]",
                "None"
              ],
              [
                "eos_token_id",
                "Optional[Union[int, Sequence[int]]]",
                "None"
              ],
              [
                "stop",
                "List[str]",
                "<factory>"
              ],
              [
                "return_full_text",
                "bool",
                "False"
              ]
            ]
          }
        },
        {
          "title": "GenerationConfig example",
          "body": "",
          "code": "from arclm.inference import GenerationConfig\n\nprint(GenerationConfig)",
          "language": "python"
        },
        {
          "title": "Generator",
          "body": "Generate tokens from a trained native causal language model. Canonical import: from arclm.inference import Generator. Fully qualified name: arclm.inference.Generator. Status: Beta."
        },
        {
          "title": "Generator parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "model",
                "Any",
                "required"
              ],
              [
                "stoi",
                "Any",
                "required"
              ],
              [
                "itos",
                "Any",
                "required"
              ],
              [
                "block_size",
                "Any",
                "required"
              ],
              [
                "device",
                "Any",
                "required"
              ],
              [
                "tokenizer",
                "Any",
                "None"
              ]
            ]
          }
        },
        {
          "title": "Generator example",
          "body": "",
          "code": "from arclm.inference import Generator\n\nprint(Generator)",
          "language": "python"
        },
        {
          "title": "LoadedModel",
          "body": "Loaded model bundle with a minimal prediction method. Canonical import: from arclm.inference import LoadedModel. Fully qualified name: arclm.inference.LoadedModel. Status: Beta."
        },
        {
          "title": "LoadedModel parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "model",
                "Module",
                "required"
              ],
              [
                "generator",
                "Generator",
                "required"
              ],
              [
                "config",
                "Config",
                "required"
              ],
              [
                "model_path",
                "Path",
                "required"
              ],
              [
                "device",
                "device",
                "required"
              ]
            ]
          }
        },
        {
          "title": "LoadedModel example",
          "body": "",
          "code": "from arclm.inference import LoadedModel\n\nprint(LoadedModel)",
          "language": "python"
        },
        {
          "title": "ModelSaveConfig",
          "body": "Developer-controlled settings for saving or exporting loaded models. Canonical import: from arclm.inference import ModelSaveConfig. Fully qualified name: arclm.inference.ModelSaveConfig. Status: Beta."
        },
        {
          "title": "ModelSaveConfig parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "save_enabled",
                "bool",
                "True"
              ],
              [
                "save_mode",
                "str",
                "'auto'"
              ],
              [
                "save_layout",
                "str",
                "'model_id'"
              ],
              [
                "save_tokenizer",
                "bool",
                "True"
              ],
              [
                "save_model_config",
                "bool",
                "True"
              ],
              [
                "save_generation_config",
                "bool",
                "True"
              ],
              [
                "save_training_metadata",
                "bool",
                "True"
              ],
              [
                "save_adapter_config",
                "bool",
                "True"
              ],
              [
                "save_processor",
                "bool",
                "True"
              ],
              [
                "save_readme",
                "bool",
                "True"
              ],
              [
                "save_safetensors",
                "bool",
                "True"
              ],
              [
                "merge_lora",
                "bool",
                "False"
              ],
              [
                "overwrite",
                "bool",
                "False"
              ]
            ]
          }
        },
        {
          "title": "ModelSaveConfig example",
          "body": "",
          "code": "from arclm.inference import ModelSaveConfig\n\nprint(ModelSaveConfig)",
          "language": "python"
        },
        {
          "title": "ModelSourceInfo",
          "body": "Structured inspection result for a model source. Canonical import: from arclm.inference import ModelSourceInfo. Fully qualified name: arclm.inference.ModelSourceInfo. Status: Beta."
        },
        {
          "title": "ModelSourceInfo parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "source",
                "str",
                "required"
              ],
              [
                "source_type",
                "str",
                "'unknown'"
              ],
              [
                "tokenizer_files_exist",
                "bool",
                "False"
              ],
              [
                "adapter_config_exists",
                "bool",
                "False"
              ],
              [
                "config_json_exists",
                "bool",
                "False"
              ],
              [
                "model_weights_exist",
                "bool",
                "False"
              ],
              [
                "detected_checkpoint_folders",
                "List[str]",
                "<factory>"
              ],
              [
                "recommended_loading_strategy",
                "str",
                "'unsupported'"
              ],
              [
                "warnings",
                "List[str]",
                "<factory>"
              ],
              [
                "resolved_source",
                "Optional[str]",
                "None"
              ],
              [
                "model_type",
                "Optional[str]",
                "None"
              ],
              [
                "weight_format",
                "Optional[str]",
                "None"
              ],
              [
                "load_as",
                "Optional[str]",
                "None"
              ],
              [
                "base_model_name_or_path",
                "Optional[str]",
                "None"
              ]
            ]
          }
        },
        {
          "title": "ModelSourceInfo example",
          "body": "",
          "code": "from arclm.inference import ModelSourceInfo\n\nprint(ModelSourceInfo)",
          "language": "python"
        },
        {
          "title": "TextGenerator",
          "body": "Generate tokens from a trained native causal language model. Canonical import: from arclm.inference import TextGenerator. Fully qualified name: arclm.inference.TextGenerator. Status: Beta."
        },
        {
          "title": "TextGenerator parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "model",
                "Any",
                "required"
              ],
              [
                "stoi",
                "Any",
                "required"
              ],
              [
                "itos",
                "Any",
                "required"
              ],
              [
                "block_size",
                "Any",
                "required"
              ],
              [
                "device",
                "Any",
                "required"
              ],
              [
                "tokenizer",
                "Any",
                "None"
              ]
            ]
          }
        },
        {
          "title": "TextGenerator example",
          "body": "",
          "code": "from arclm.inference import TextGenerator\n\nprint(TextGenerator)",
          "language": "python"
        },
        {
          "title": "DEFAULT_MODEL_PATH",
          "body": "Path subclass for Windows systems. Canonical import: from arclm.inference import DEFAULT_MODEL_PATH. Fully qualified name: arclm.inference.DEFAULT_MODEL_PATH. Status: Beta."
        },
        {
          "title": "DEFAULT_MODEL_PATH parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "DEFAULT_MODEL_PATH example",
          "body": "",
          "code": "from arclm.inference import DEFAULT_MODEL_PATH\n\nprint(DEFAULT_MODEL_PATH)",
          "language": "python"
        },
        {
          "title": "continue_native_training",
          "body": "Continue native ArcLM training via ``train_model``. Canonical import: from arclm.inference import continue_native_training. Fully qualified name: arclm.inference.continue_native_training. Status: Beta."
        },
        {
          "title": "continue_native_training parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "data",
                "str",
                "required"
              ],
              [
                "output",
                "str",
                "required"
              ],
              [
                "checkpoint",
                "str",
                "required"
              ],
              [
                "kwargs",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "continue_native_training example",
          "body": "",
          "code": "from arclm.inference import continue_native_training\n\nprint(continue_native_training)",
          "language": "python"
        },
        {
          "title": "fine_tune_external_model",
          "body": "Fine-tune an external model through supported ArcLM training backends. Canonical import: from arclm.inference import fine_tune_external_model. Fully qualified name: arclm.inference.fine_tune_external_model. Status: Beta."
        },
        {
          "title": "fine_tune_external_model parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "model",
                "str",
                "required"
              ],
              [
                "dataset",
                "str",
                "required"
              ],
              [
                "output_dir",
                "str",
                "required"
              ],
              [
                "method",
                "str",
                "'sft'"
              ],
              [
                "backend",
                "str",
                "'huggingface'"
              ],
              [
                "use_lora",
                "bool",
                "True"
              ],
              [
                "assistant_only_loss",
                "bool",
                "True"
              ],
              [
                "save_config",
                "Optional[ModelSaveConfig]",
                "None"
              ],
              [
                "kwargs",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "fine_tune_external_model example",
          "body": "",
          "code": "from arclm.inference import fine_tune_external_model\n\nprint(fine_tune_external_model)",
          "language": "python"
        },
        {
          "title": "fine_tune_native_model",
          "body": "Fine-tune a native ArcLM checkpoint via ``train_model``. Canonical import: from arclm.inference import fine_tune_native_model. Fully qualified name: arclm.inference.fine_tune_native_model. Status: Beta."
        },
        {
          "title": "fine_tune_native_model parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "data",
                "str",
                "required"
              ],
              [
                "output",
                "str",
                "required"
              ],
              [
                "checkpoint",
                "str",
                "required"
              ],
              [
                "kwargs",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "fine_tune_native_model example",
          "body": "",
          "code": "from arclm.inference import fine_tune_native_model\n\nprint(fine_tune_native_model)",
          "language": "python"
        },
        {
          "title": "inspect_model_source",
          "body": "Inspect a local path or Hugging Face model ID before loading. Canonical import: from arclm.inference import inspect_model_source. Fully qualified name: arclm.inference.inspect_model_source. Status: Beta."
        },
        {
          "title": "inspect_model_source parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "source",
                "PathLike",
                "required"
              ],
              [
                "kwargs",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "inspect_model_source example",
          "body": "",
          "code": "from arclm.inference import inspect_model_source\n\nprint(inspect_model_source)",
          "language": "python"
        },
        {
          "title": "load_any_model",
          "body": "Load any supported ArcLM or Hugging Face causal LM source for inference. Canonical import: from arclm.inference import load_any_model. Fully qualified name: arclm.inference.load_any_model. Status: Beta."
        },
        {
          "title": "load_any_model parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "source",
                "PathLike",
                "required"
              ],
              [
                "kwargs",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "load_any_model example",
          "body": "",
          "code": "from arclm.inference import load_any_model\n\nprint(load_any_model)",
          "language": "python"
        },
        {
          "title": "load_external_for_inference",
          "body": "Backward-friendly alias for :func:`load_any_model`. Canonical import: from arclm.inference import load_external_for_inference. Fully qualified name: arclm.inference.load_external_for_inference. Status: Beta."
        },
        {
          "title": "load_external_for_inference parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "source",
                "PathLike",
                "required"
              ],
              [
                "kwargs",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "load_external_for_inference example",
          "body": "",
          "code": "from arclm.inference import load_external_for_inference\n\nprint(load_external_for_inference)",
          "language": "python"
        },
        {
          "title": "load_model",
          "body": "Load a trained ArcLM checkpoint for inference. Canonical import: from arclm.inference import load_model. Fully qualified name: arclm.inference.load_model. Status: Beta."
        },
        {
          "title": "load_model parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "model_path",
                "Any",
                "None"
              ],
              [
                "device",
                "Any",
                "None"
              ],
              [
                "prefer_best",
                "Any",
                "True"
              ]
            ]
          }
        },
        {
          "title": "load_model example",
          "body": "",
          "code": "from arclm.inference import load_model\n\nprint(load_model)",
          "language": "python"
        },
        {
          "title": "predict",
          "body": "Predict with a cached model using the same defaults as load_model(). Canonical import: from arclm.inference import predict. Fully qualified name: arclm.inference.predict. Status: Beta."
        },
        {
          "title": "predict parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "input_text",
                "Any",
                "required"
              ],
              [
                "model_path",
                "Any",
                "None"
              ],
              [
                "device",
                "Any",
                "None"
              ],
              [
                "reload",
                "Any",
                "False"
              ],
              [
                "generation_options",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "predict example",
          "body": "",
          "code": "from arclm.inference import predict\n\nprint(predict)",
          "language": "python"
        },
        {
          "title": "predict_external",
          "body": "Load a source and return a single prediction. Canonical import: from arclm.inference import predict_external. Fully qualified name: arclm.inference.predict_external. Status: Beta."
        },
        {
          "title": "predict_external parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "source",
                "PathLike",
                "required"
              ],
              [
                "prompt",
                "str",
                "required"
              ],
              [
                "kwargs",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "predict_external example",
          "body": "",
          "code": "from arclm.inference import predict_external\n\nprint(predict_external)",
          "language": "python"
        },
        {
          "title": "save_loaded_model",
          "body": "Save a loaded model according to :class:`ModelSaveConfig`. Canonical import: from arclm.inference import save_loaded_model. Fully qualified name: arclm.inference.save_loaded_model. Status: Beta."
        },
        {
          "title": "save_loaded_model parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "loaded_model",
                "ExternalLoadedModel",
                "required"
              ],
              [
                "output_dir",
                "PathLike",
                "required"
              ],
              [
                "save_config",
                "Optional[ModelSaveConfig]",
                "None"
              ]
            ]
          }
        },
        {
          "title": "save_loaded_model example",
          "body": "",
          "code": "from arclm.inference import save_loaded_model\n\nprint(save_loaded_model)",
          "language": "python"
        },
        {
          "title": "train_native_model",
          "body": "Train a native ArcLM model by delegating to ``train_model(mode='pretrain')``. Canonical import: from arclm.inference import train_native_model. Fully qualified name: arclm.inference.train_native_model. Status: Beta."
        },
        {
          "title": "train_native_model parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "data",
                "str",
                "required"
              ],
              [
                "output",
                "str",
                "required"
              ],
              [
                "kwargs",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "train_native_model example",
          "body": "",
          "code": "from arclm.inference import train_native_model\n\nprint(train_native_model)",
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
          "title": "PipelineTrace",
          "body": "JSON-safe summary of one inspected native ArcLM generation step. Canonical import: from arclm.inspection import PipelineTrace. Fully qualified name: arclm.inspection.PipelineTrace. Status: Beta."
        },
        {
          "title": "PipelineTrace parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "input_text",
                "str",
                "required"
              ],
              [
                "tokens",
                "list[str]",
                "required"
              ],
              [
                "token_ids",
                "list[int]",
                "required"
              ],
              [
                "sequence_length",
                "int",
                "required"
              ],
              [
                "input_shape",
                "list[int]",
                "required"
              ],
              [
                "embedding_shape",
                "list[int]",
                "required"
              ],
              [
                "logits_shape",
                "list[int]",
                "required"
              ],
              [
                "selected_token_id",
                "int",
                "required"
              ],
              [
                "selected_token",
                "str",
                "required"
              ],
              [
                "generated_text",
                "str",
                "required"
              ],
              [
                "device",
                "str",
                "required"
              ],
              [
                "dtype",
                "str",
                "required"
              ],
              [
                "model_class",
                "str",
                "required"
              ],
              [
                "tokenizer_class",
                "str",
                "required"
              ],
              [
                "inspected_steps",
                "int",
                "1"
              ],
              [
                "generation_steps",
                "int",
                "1"
              ],
              [
                "attention_available",
                "bool",
                "False"
              ],
              [
                "attention_note",
                "str",
                "'Attention tensor capture is planned for a later inspection version.'"
              ],
              [
                "warnings",
                "list[str]",
                "<factory>"
              ],
              [
                "values",
                "dict[str, list[float | int]] | None",
                "None"
              ]
            ]
          }
        },
        {
          "title": "PipelineTrace example",
          "body": "",
          "code": "from arclm.inspection import PipelineTrace\n\nprint(PipelineTrace)",
          "language": "python"
        },
        {
          "title": "inspect_text",
          "body": "Inspect one native ArcLM text-generation step. Canonical import: from arclm.inspection import inspect_text. Fully qualified name: arclm.inspection.inspect_text. Status: Beta."
        },
        {
          "title": "inspect_text parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "model",
                "Any",
                "required"
              ],
              [
                "tokenizer",
                "Any",
                "required"
              ],
              [
                "text",
                "str",
                "required"
              ],
              [
                "max_new_tokens",
                "int",
                "1"
              ],
              [
                "temperature",
                "float",
                "1.0"
              ],
              [
                "repetition_penalty",
                "float",
                "1.0"
              ],
              [
                "top_k",
                "int | None",
                "None"
              ],
              [
                "top_p",
                "float | None",
                "None"
              ],
              [
                "include_values",
                "bool",
                "False"
              ],
              [
                "max_values",
                "int",
                "20"
              ]
            ]
          }
        },
        {
          "title": "inspect_text example",
          "body": "",
          "code": "from arclm.inspection import inspect_text\n\nprint(inspect_text)",
          "language": "python"
        }
      ],
      "status": "Stable"
    },
    {
      "id": "api-agents",
      "title": "Agent API",
      "group": "Reference",
      "href": "api/agents.html",
      "summary": "Public agents APIs.",
      "sections": [
        {
          "title": "Overview",
          "body": "Agent API documents the public ArcLM APIs in this category."
        },
        {
          "title": "Agent",
          "body": "Behavior description for a bounded tool-using agent. Canonical import: from arclm.agents import Agent. Fully qualified name: arclm.agents.Agent. Status: Beta."
        },
        {
          "title": "Agent parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "name",
                "str",
                "required"
              ],
              [
                "instructions",
                "str",
                "required"
              ],
              [
                "model",
                "Any",
                "required"
              ],
              [
                "tools",
                "list[Tool]",
                "<factory>"
              ],
              [
                "description",
                "str",
                "''"
              ],
              [
                "max_steps",
                "int",
                "8"
              ],
              [
                "tool_policy",
                "ToolPolicy",
                "<factory>"
              ],
              [
                "approval_policy",
                "dict[str, Any]",
                "<factory>"
              ],
              [
                "session_policy",
                "dict[str, Any]",
                "<factory>"
              ],
              [
                "output_schema",
                "dict[str, Any] | type | None",
                "None"
              ],
              [
                "security_policy",
                "SecurityPolicy",
                "<factory>"
              ],
              [
                "metadata",
                "dict[str, Any]",
                "<factory>"
              ]
            ]
          }
        },
        {
          "title": "Agent example",
          "body": "",
          "code": "from arclm.agents import Agent\n\nprint(Agent)",
          "language": "python"
        },
        {
          "title": "AgentCapabilityReport",
          "body": "Honest runtime capability report. Canonical import: from arclm.agents import AgentCapabilityReport. Fully qualified name: arclm.agents.AgentCapabilityReport. Status: Beta."
        },
        {
          "title": "AgentCapabilityReport parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "supports_tools",
                "CapabilityStatus",
                "<CapabilityStatus.AVAILABLE: 'available'>"
              ],
              [
                "supports_parallel_tool_calls",
                "CapabilityStatus",
                "<CapabilityStatus.AVAILABLE: 'available'>"
              ],
              [
                "supports_structured_output",
                "CapabilityStatus",
                "<CapabilityStatus.EXPERIMENTAL: 'experimental'>"
              ],
              [
                "supports_sessions",
                "CapabilityStatus",
                "<CapabilityStatus.AVAILABLE: 'available'>"
              ],
              [
                "supports_async",
                "CapabilityStatus",
                "<CapabilityStatus.AVAILABLE: 'available'>"
              ],
              [
                "supports_approvals",
                "CapabilityStatus",
                "<CapabilityStatus.AVAILABLE: 'available'>"
              ],
              [
                "supports_tracing",
                "CapabilityStatus",
                "<CapabilityStatus.AVAILABLE: 'available'>"
              ],
              [
                "supports_resources",
                "CapabilityStatus",
                "<CapabilityStatus.EXPERIMENTAL: 'experimental'>"
              ],
              [
                "supports_speech_to_text",
                "CapabilityStatus",
                "<CapabilityStatus.OPTIONAL: 'optional'>"
              ],
              [
                "supports_web_reading",
                "CapabilityStatus",
                "<CapabilityStatus.AVAILABLE: 'available'>"
              ]
            ]
          }
        },
        {
          "title": "AgentCapabilityReport example",
          "body": "",
          "code": "from arclm.agents import AgentCapabilityReport\n\nprint(AgentCapabilityReport)",
          "language": "python"
        },
        {
          "title": "AgentConfig",
          "body": "Serializable agent configuration without callables or secrets. Canonical import: from arclm.agents import AgentConfig. Fully qualified name: arclm.agents.AgentConfig. Status: Beta."
        },
        {
          "title": "AgentConfig parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "name",
                "str",
                "required"
              ],
              [
                "description",
                "str",
                "''"
              ],
              [
                "instructions",
                "str",
                "''"
              ],
              [
                "max_steps",
                "int",
                "8"
              ],
              [
                "metadata",
                "dict[str, Any]",
                "<factory>"
              ]
            ]
          }
        },
        {
          "title": "AgentConfig example",
          "body": "",
          "code": "from arclm.agents import AgentConfig\n\nprint(AgentConfig)",
          "language": "python"
        },
        {
          "title": "AgentMessage",
          "body": "Serializable provider-independent message. Canonical import: from arclm.agents import AgentMessage. Fully qualified name: arclm.agents.AgentMessage. Status: Beta."
        },
        {
          "title": "AgentMessage parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "role",
                "AgentRole",
                "required"
              ],
              [
                "content",
                "str | None",
                "required"
              ],
              [
                "name",
                "str | None",
                "None"
              ],
              [
                "tool_call_id",
                "str | None",
                "None"
              ],
              [
                "metadata",
                "dict[str, Any]",
                "<factory>"
              ]
            ]
          }
        },
        {
          "title": "AgentMessage example",
          "body": "",
          "code": "from arclm.agents import AgentMessage\n\nprint(AgentMessage)",
          "language": "python"
        },
        {
          "title": "AgentModel",
          "body": "Protocol implemented by provider-specific model adapters. Canonical import: from arclm.agents import AgentModel. Fully qualified name: arclm.agents.AgentModel. Status: Beta."
        },
        {
          "title": "AgentModel parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "args",
                "Any",
                "required"
              ],
              [
                "kwargs",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "AgentModel example",
          "body": "",
          "code": "from arclm.agents import AgentModel\n\nprint(AgentModel)",
          "language": "python"
        },
        {
          "title": "AgentResource",
          "body": "Read-only content that can be provided as agent context. Canonical import: from arclm.agents import AgentResource. Fully qualified name: arclm.agents.AgentResource. Status: Beta."
        },
        {
          "title": "AgentResource parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "uri",
                "str",
                "required"
              ],
              [
                "name",
                "str",
                "required"
              ],
              [
                "content",
                "str",
                "required"
              ],
              [
                "mime_type",
                "str",
                "'text/plain'"
              ],
              [
                "metadata",
                "dict[str, str]",
                "<factory>"
              ]
            ]
          }
        },
        {
          "title": "AgentResource example",
          "body": "",
          "code": "from arclm.agents import AgentResource\n\nprint(AgentResource)",
          "language": "python"
        },
        {
          "title": "AgentRunner",
          "body": "Execute agent behavior with bounded model/tool steps. Canonical import: from arclm.agents import AgentRunner. Fully qualified name: arclm.agents.AgentRunner. Status: Beta."
        },
        {
          "title": "AgentRunner parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "max_steps",
                "int",
                "8"
              ],
              [
                "approval_handler",
                "ToolApprovalHandler | None",
                "None"
              ],
              [
                "timeout_seconds",
                "float | None",
                "None"
              ],
              [
                "trace_handler",
                "Any | None",
                "None"
              ]
            ]
          }
        },
        {
          "title": "AgentRunner example",
          "body": "",
          "code": "from arclm.agents import AgentRunner\n\nprint(AgentRunner)",
          "language": "python"
        },
        {
          "title": "AgentRunnerConfig",
          "body": "Serializable runner configuration. Canonical import: from arclm.agents import AgentRunnerConfig. Fully qualified name: arclm.agents.AgentRunnerConfig. Status: Beta."
        },
        {
          "title": "AgentRunnerConfig parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "max_steps",
                "int",
                "8"
              ],
              [
                "timeout_seconds",
                "float | None",
                "None"
              ]
            ]
          }
        },
        {
          "title": "AgentRunnerConfig example",
          "body": "",
          "code": "from arclm.agents import AgentRunnerConfig\n\nprint(AgentRunnerConfig)",
          "language": "python"
        },
        {
          "title": "AgentRunResult",
          "body": "Final outcome of a bounded agent run. Canonical import: from arclm.agents import AgentRunResult. Fully qualified name: arclm.agents.AgentRunResult. Status: Beta."
        },
        {
          "title": "AgentRunResult parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "success",
                "bool",
                "required"
              ],
              [
                "output",
                "str | None",
                "required"
              ],
              [
                "session",
                "Any",
                "required"
              ],
              [
                "trace",
                "Any",
                "required"
              ],
              [
                "error_code",
                "str | None",
                "None"
              ],
              [
                "error_message",
                "str | None",
                "None"
              ],
              [
                "metadata",
                "dict[str, JSONValue]",
                "<factory>"
              ]
            ]
          }
        },
        {
          "title": "AgentRunResult example",
          "body": "",
          "code": "from arclm.agents import AgentRunResult\n\nprint(AgentRunResult)",
          "language": "python"
        },
        {
          "title": "AgentSession",
          "body": "Bounded in-memory session state. Canonical import: from arclm.agents import AgentSession. Fully qualified name: arclm.agents.AgentSession. Status: Beta."
        },
        {
          "title": "AgentSession parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "session_id",
                "str",
                "<factory>"
              ],
              [
                "messages",
                "list[AgentMessage]",
                "<factory>"
              ],
              [
                "tool_calls",
                "list[ToolCall]",
                "<factory>"
              ],
              [
                "metadata",
                "dict[str, Any]",
                "<factory>"
              ],
              [
                "created_at",
                "float",
                "<factory>"
              ],
              [
                "updated_at",
                "float",
                "<factory>"
              ],
              [
                "max_messages",
                "int",
                "100"
              ]
            ]
          }
        },
        {
          "title": "AgentSession example",
          "body": "",
          "code": "from arclm.agents import AgentSession\n\nprint(AgentSession)",
          "language": "python"
        },
        {
          "title": "AgentTrace",
          "body": "Trace for one agent run. Canonical import: from arclm.agents import AgentTrace. Fully qualified name: arclm.agents.AgentTrace. Status: Beta."
        },
        {
          "title": "AgentTrace parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "run_id",
                "str",
                "<factory>"
              ],
              [
                "events",
                "list[AgentTraceEvent]",
                "<factory>"
              ]
            ]
          }
        },
        {
          "title": "AgentTrace example",
          "body": "",
          "code": "from arclm.agents import AgentTrace\n\nprint(AgentTrace)",
          "language": "python"
        },
        {
          "title": "AgentTraceEvent",
          "body": "One safe trace event. Canonical import: from arclm.agents import AgentTraceEvent. Fully qualified name: arclm.agents.AgentTraceEvent. Status: Beta."
        },
        {
          "title": "AgentTraceEvent parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "event_type",
                "str",
                "required"
              ],
              [
                "timestamp",
                "float",
                "required"
              ],
              [
                "run_id",
                "str",
                "required"
              ],
              [
                "step",
                "int",
                "0"
              ],
              [
                "tool_name",
                "str | None",
                "None"
              ],
              [
                "duration_seconds",
                "float | None",
                "None"
              ],
              [
                "metadata",
                "dict[str, Any]",
                "<factory>"
              ]
            ]
          }
        },
        {
          "title": "AgentTraceEvent example",
          "body": "",
          "code": "from arclm.agents import AgentTraceEvent\n\nprint(AgentTraceEvent)",
          "language": "python"
        },
        {
          "title": "ApprovalDecision",
          "body": "Decision returned by an approval handler. Canonical import: from arclm.agents import ApprovalDecision. Fully qualified name: arclm.agents.ApprovalDecision. Status: Beta."
        },
        {
          "title": "ApprovalDecision parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "values",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "ApprovalDecision example",
          "body": "",
          "code": "from arclm.agents import ApprovalDecision\n\nprint(ApprovalDecision)",
          "language": "python"
        },
        {
          "title": "ArcLMJSONToolAdapter",
          "body": "Small adapter for ArcLM-style generation callables using strict JSON. Canonical import: from arclm.agents import ArcLMJSONToolAdapter. Fully qualified name: arclm.agents.ArcLMJSONToolAdapter. Status: Beta."
        },
        {
          "title": "ArcLMJSONToolAdapter parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "generate_text",
                "Callable[[str], str]",
                "required"
              ],
              [
                "max_output_bytes",
                "int",
                "65536"
              ]
            ]
          }
        },
        {
          "title": "ArcLMJSONToolAdapter example",
          "body": "",
          "code": "from arclm.agents import ArcLMJSONToolAdapter\n\nprint(ArcLMJSONToolAdapter)",
          "language": "python"
        },
        {
          "title": "AutoApprovalHandler",
          "body": "Simple handler for tests and trusted local demos. Canonical import: from arclm.agents import AutoApprovalHandler. Fully qualified name: arclm.agents.AutoApprovalHandler. Status: Beta."
        },
        {
          "title": "AutoApprovalHandler parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "AutoApprovalHandler example",
          "body": "",
          "code": "from arclm.agents import AutoApprovalHandler\n\nprint(AutoApprovalHandler)",
          "language": "python"
        },
        {
          "title": "CallableModelAdapter",
          "body": "Adapter around a developer-supplied callable. Canonical import: from arclm.agents import CallableModelAdapter. Fully qualified name: arclm.agents.CallableModelAdapter. Status: Beta."
        },
        {
          "title": "CallableModelAdapter parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "function",
                "Callable[..., ModelResponse]",
                "required"
              ]
            ]
          }
        },
        {
          "title": "CallableModelAdapter example",
          "body": "",
          "code": "from arclm.agents import CallableModelAdapter\n\nprint(CallableModelAdapter)",
          "language": "python"
        },
        {
          "title": "CapabilityStatus",
          "body": "Agent capability status. Canonical import: from arclm.agents import CapabilityStatus. Fully qualified name: arclm.agents.CapabilityStatus. Status: Beta."
        },
        {
          "title": "CapabilityStatus parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "values",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "CapabilityStatus example",
          "body": "",
          "code": "from arclm.agents import CapabilityStatus\n\nprint(CapabilityStatus)",
          "language": "python"
        },
        {
          "title": "DenyApprovalHandler",
          "body": "Default handler that denies requests requiring approval. Canonical import: from arclm.agents import DenyApprovalHandler. Fully qualified name: arclm.agents.DenyApprovalHandler. Status: Beta."
        },
        {
          "title": "DenyApprovalHandler parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "DenyApprovalHandler example",
          "body": "",
          "code": "from arclm.agents import DenyApprovalHandler\n\nprint(DenyApprovalHandler)",
          "language": "python"
        },
        {
          "title": "DocumentToolConfig",
          "body": "Serializable document-tool limits. Canonical import: from arclm.agents import DocumentToolConfig. Fully qualified name: arclm.agents.DocumentToolConfig. Status: Beta."
        },
        {
          "title": "DocumentToolConfig parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "max_input_bytes",
                "int",
                "1000000"
              ]
            ]
          }
        },
        {
          "title": "DocumentToolConfig example",
          "body": "",
          "code": "from arclm.agents import DocumentToolConfig\n\nprint(DocumentToolConfig)",
          "language": "python"
        },
        {
          "title": "FakeSpeechToTextBackend",
          "body": "Deterministic backend for tests and examples. Canonical import: from arclm.agents import FakeSpeechToTextBackend. Fully qualified name: arclm.agents.FakeSpeechToTextBackend. Status: Beta."
        },
        {
          "title": "FakeSpeechToTextBackend parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "text",
                "str",
                "'Hello ArcLM'"
              ],
              [
                "language",
                "str",
                "'en'"
              ]
            ]
          }
        },
        {
          "title": "FakeSpeechToTextBackend example",
          "body": "",
          "code": "from arclm.agents import FakeSpeechToTextBackend\n\nprint(FakeSpeechToTextBackend)",
          "language": "python"
        },
        {
          "title": "FinalResponse",
          "body": "Response returned by an agent model adapter. Canonical import: from arclm.agents import FinalResponse. Fully qualified name: arclm.agents.FinalResponse. Status: Beta."
        },
        {
          "title": "FinalResponse parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "content",
                "str | None",
                "None"
              ],
              [
                "tool_calls",
                "list[ToolCall]",
                "<factory>"
              ],
              [
                "error_code",
                "str | None",
                "None"
              ],
              [
                "error_message",
                "str | None",
                "None"
              ],
              [
                "metadata",
                "dict[str, Any]",
                "<factory>"
              ]
            ]
          }
        },
        {
          "title": "FinalResponse example",
          "body": "",
          "code": "from arclm.agents import FinalResponse\n\nprint(FinalResponse)",
          "language": "python"
        },
        {
          "title": "InMemoryResourceProvider",
          "body": "Minimal in-memory resource provider. Canonical import: from arclm.agents import InMemoryResourceProvider. Fully qualified name: arclm.agents.InMemoryResourceProvider. Status: Beta."
        },
        {
          "title": "InMemoryResourceProvider parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "resources",
                "list[AgentResource] | None",
                "None"
              ]
            ]
          }
        },
        {
          "title": "InMemoryResourceProvider example",
          "body": "",
          "code": "from arclm.agents import InMemoryResourceProvider\n\nprint(InMemoryResourceProvider)",
          "language": "python"
        },
        {
          "title": "JSONToolCallingAdapter",
          "body": "Strict JSON protocol adapter for plain generation callables. Canonical import: from arclm.agents import JSONToolCallingAdapter. Fully qualified name: arclm.agents.JSONToolCallingAdapter. Status: Beta."
        },
        {
          "title": "JSONToolCallingAdapter parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "generate_text",
                "Callable[[str], str]",
                "required"
              ],
              [
                "max_output_bytes",
                "int",
                "65536"
              ]
            ]
          }
        },
        {
          "title": "JSONToolCallingAdapter example",
          "body": "",
          "code": "from arclm.agents import JSONToolCallingAdapter\n\nprint(JSONToolCallingAdapter)",
          "language": "python"
        },
        {
          "title": "ModelResponse",
          "body": "Response returned by an agent model adapter. Canonical import: from arclm.agents import ModelResponse. Fully qualified name: arclm.agents.ModelResponse. Status: Beta."
        },
        {
          "title": "ModelResponse parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "content",
                "str | None",
                "None"
              ],
              [
                "tool_calls",
                "list[ToolCall]",
                "<factory>"
              ],
              [
                "error_code",
                "str | None",
                "None"
              ],
              [
                "error_message",
                "str | None",
                "None"
              ],
              [
                "metadata",
                "dict[str, Any]",
                "<factory>"
              ]
            ]
          }
        },
        {
          "title": "ModelResponse example",
          "body": "",
          "code": "from arclm.agents import ModelResponse\n\nprint(ModelResponse)",
          "language": "python"
        },
        {
          "title": "ResourceProvider",
          "body": "Protocol for read-only resource providers. Canonical import: from arclm.agents import ResourceProvider. Fully qualified name: arclm.agents.ResourceProvider. Status: Beta."
        },
        {
          "title": "ResourceProvider parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "args",
                "Any",
                "required"
              ],
              [
                "kwargs",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "ResourceProvider example",
          "body": "",
          "code": "from arclm.agents import ResourceProvider\n\nprint(ResourceProvider)",
          "language": "python"
        },
        {
          "title": "SessionConfig",
          "body": "Serializable session configuration. Canonical import: from arclm.agents import SessionConfig. Fully qualified name: arclm.agents.SessionConfig. Status: Beta."
        },
        {
          "title": "SessionConfig parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "max_messages",
                "int",
                "100"
              ]
            ]
          }
        },
        {
          "title": "SessionConfig example",
          "body": "",
          "code": "from arclm.agents import SessionConfig\n\nprint(SessionConfig)",
          "language": "python"
        },
        {
          "title": "SideEffectLevel",
          "body": "Declared side-effect level for a tool. Canonical import: from arclm.agents import SideEffectLevel. Fully qualified name: arclm.agents.SideEffectLevel. Status: Beta."
        },
        {
          "title": "SideEffectLevel parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "values",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "SideEffectLevel example",
          "body": "",
          "code": "from arclm.agents import SideEffectLevel\n\nprint(SideEffectLevel)",
          "language": "python"
        },
        {
          "title": "SpeechToTextBackend",
          "body": "Protocol for speech-to-text backends. Canonical import: from arclm.agents import SpeechToTextBackend. Fully qualified name: arclm.agents.SpeechToTextBackend. Status: Beta."
        },
        {
          "title": "SpeechToTextBackend parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "args",
                "Any",
                "required"
              ],
              [
                "kwargs",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "SpeechToTextBackend example",
          "body": "",
          "code": "from arclm.agents import SpeechToTextBackend\n\nprint(SpeechToTextBackend)",
          "language": "python"
        },
        {
          "title": "Tool",
          "body": "Callable tool with strict schema validation and structured results. Canonical import: from arclm.agents import Tool. Fully qualified name: arclm.agents.Tool. Status: Beta."
        },
        {
          "title": "Tool parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "spec",
                "ToolSpec",
                "required"
              ],
              [
                "function",
                "Callable[..., Any]",
                "required"
              ],
              [
                "inject_context",
                "bool",
                "False"
              ]
            ]
          }
        },
        {
          "title": "Tool example",
          "body": "",
          "code": "from arclm.agents import Tool\n\nprint(Tool)",
          "language": "python"
        },
        {
          "title": "ToolApprovalHandler",
          "body": "Protocol for human or application approval handlers. Canonical import: from arclm.agents import ToolApprovalHandler. Fully qualified name: arclm.agents.ToolApprovalHandler. Status: Beta."
        },
        {
          "title": "ToolApprovalHandler parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "args",
                "Any",
                "required"
              ],
              [
                "kwargs",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "ToolApprovalHandler example",
          "body": "",
          "code": "from arclm.agents import ToolApprovalHandler\n\nprint(ToolApprovalHandler)",
          "language": "python"
        },
        {
          "title": "ToolApprovalRequest",
          "body": "Safe approval request metadata. Canonical import: from arclm.agents import ToolApprovalRequest. Fully qualified name: arclm.agents.ToolApprovalRequest. Status: Beta."
        },
        {
          "title": "ToolApprovalRequest parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "tool_name",
                "str",
                "required"
              ],
              [
                "permission",
                "str",
                "required"
              ],
              [
                "arguments",
                "dict[str, Any]",
                "required"
              ],
              [
                "session_id",
                "str",
                "required"
              ],
              [
                "reason",
                "str | None",
                "None"
              ]
            ]
          }
        },
        {
          "title": "ToolApprovalRequest example",
          "body": "",
          "code": "from arclm.agents import ToolApprovalRequest\n\nprint(ToolApprovalRequest)",
          "language": "python"
        },
        {
          "title": "ToolCall",
          "body": "Provider-independent request to invoke a tool. Canonical import: from arclm.agents import ToolCall. Fully qualified name: arclm.agents.ToolCall. Status: Beta."
        },
        {
          "title": "ToolCall parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "id",
                "str",
                "required"
              ],
              [
                "name",
                "str",
                "required"
              ],
              [
                "arguments",
                "dict[str, Any]",
                "required"
              ]
            ]
          }
        },
        {
          "title": "ToolCall example",
          "body": "",
          "code": "from arclm.agents import ToolCall\n\nprint(ToolCall)",
          "language": "python"
        },
        {
          "title": "ToolCollection",
          "body": "Reusable named group of tools. Canonical import: from arclm.agents import ToolCollection. Fully qualified name: arclm.agents.ToolCollection. Status: Beta."
        },
        {
          "title": "ToolCollection parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "name",
                "str",
                "required"
              ],
              [
                "tools",
                "list[Tool]",
                "required"
              ],
              [
                "description",
                "str",
                "''"
              ],
              [
                "categories",
                "tuple[str, ...]",
                "()"
              ],
              [
                "default_permissions",
                "tuple[ToolPermission, ...]",
                "(<ToolPermission.PURE: 'pure'>,)"
              ],
              [
                "optional_dependencies",
                "tuple[str, ...]",
                "()"
              ],
              [
                "metadata",
                "dict[str, str]",
                "<factory>"
              ]
            ]
          }
        },
        {
          "title": "ToolCollection example",
          "body": "",
          "code": "from arclm.agents import ToolCollection\n\nprint(ToolCollection)",
          "language": "python"
        },
        {
          "title": "ToolContext",
          "body": "Bounded context for one tool invocation. Canonical import: from arclm.agents import ToolContext. Fully qualified name: arclm.agents.ToolContext. Status: Beta."
        },
        {
          "title": "ToolContext parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "session_id",
                "str",
                "required"
              ],
              [
                "agent_name",
                "str",
                "required"
              ],
              [
                "tool_call_id",
                "str",
                "required"
              ],
              [
                "approved_permissions",
                "set[str]",
                "<factory>"
              ],
              [
                "workspace_root",
                "Path | None",
                "None"
              ],
              [
                "metadata",
                "dict[str, Any]",
                "<factory>"
              ],
              [
                "cancelled",
                "bool",
                "False"
              ]
            ]
          }
        },
        {
          "title": "ToolContext example",
          "body": "",
          "code": "from arclm.agents import ToolContext\n\nprint(ToolContext)",
          "language": "python"
        },
        {
          "title": "ToolPermission",
          "body": "Permission categories a tool may request. Canonical import: from arclm.agents import ToolPermission. Fully qualified name: arclm.agents.ToolPermission. Status: Beta."
        },
        {
          "title": "ToolPermission parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "values",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "ToolPermission example",
          "body": "",
          "code": "from arclm.agents import ToolPermission\n\nprint(ToolPermission)",
          "language": "python"
        },
        {
          "title": "ToolPolicy",
          "body": "Runtime policy controlling which tools may run. Canonical import: from arclm.agents import ToolPolicy. Fully qualified name: arclm.agents.ToolPolicy. Status: Beta."
        },
        {
          "title": "ToolPolicy parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "allowed_tools",
                "set[str] | None",
                "None"
              ],
              [
                "disabled_tools",
                "set[str]",
                "<factory>"
              ],
              [
                "require_approval_for",
                "set[ToolPermission]",
                "<factory>"
              ],
              [
                "stop_on_tool_failure",
                "bool",
                "True"
              ],
              [
                "max_result_bytes",
                "int",
                "65536"
              ],
              [
                "max_argument_bytes",
                "int",
                "32768"
              ],
              [
                "max_json_depth",
                "int",
                "20"
              ],
              [
                "max_collection_length",
                "int",
                "1000"
              ]
            ]
          }
        },
        {
          "title": "ToolPolicy example",
          "body": "",
          "code": "from arclm.agents import ToolPolicy\n\nprint(ToolPolicy)",
          "language": "python"
        },
        {
          "title": "ToolRegistry",
          "body": "Deterministic registry for agent tools. Canonical import: from arclm.agents import ToolRegistry. Fully qualified name: arclm.agents.ToolRegistry. Status: Beta."
        },
        {
          "title": "ToolRegistry parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "ToolRegistry example",
          "body": "",
          "code": "from arclm.agents import ToolRegistry\n\nprint(ToolRegistry)",
          "language": "python"
        },
        {
          "title": "ToolResult",
          "body": "Structured tool invocation result. Canonical import: from arclm.agents import ToolResult. Fully qualified name: arclm.agents.ToolResult. Status: Beta."
        },
        {
          "title": "ToolResult parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "success",
                "bool",
                "required"
              ],
              [
                "value",
                "JSONValue",
                "None"
              ],
              [
                "content",
                "str | None",
                "None"
              ],
              [
                "error_code",
                "str | None",
                "None"
              ],
              [
                "error_message",
                "str | None",
                "None"
              ],
              [
                "metadata",
                "dict[str, JSONValue]",
                "<factory>"
              ]
            ]
          }
        },
        {
          "title": "ToolResult example",
          "body": "",
          "code": "from arclm.agents import ToolResult\n\nprint(ToolResult)",
          "language": "python"
        },
        {
          "title": "ToolSpec",
          "body": "Serializable metadata describing a tool. Canonical import: from arclm.agents import ToolSpec. Fully qualified name: arclm.agents.ToolSpec. Status: Beta."
        },
        {
          "title": "ToolSpec parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "name",
                "str",
                "required"
              ],
              [
                "description",
                "str",
                "required"
              ],
              [
                "input_schema",
                "dict[str, Any]",
                "required"
              ],
              [
                "output_schema",
                "dict[str, Any] | None",
                "None"
              ],
              [
                "output_description",
                "str | None",
                "None"
              ],
              [
                "category",
                "str",
                "'utilities'"
              ],
              [
                "tags",
                "tuple[str, ...]",
                "()"
              ],
              [
                "permission",
                "ToolPermission",
                "<ToolPermission.PURE: 'pure'>"
              ],
              [
                "timeout_seconds",
                "float | None",
                "None"
              ],
              [
                "side_effect",
                "SideEffectLevel",
                "<SideEffectLevel.NONE: 'none'>"
              ],
              [
                "enabled",
                "bool",
                "True"
              ],
              [
                "metadata",
                "dict[str, Any]",
                "<factory>"
              ]
            ]
          }
        },
        {
          "title": "ToolSpec example",
          "body": "",
          "code": "from arclm.agents import ToolSpec\n\nprint(ToolSpec)",
          "language": "python"
        },
        {
          "title": "TraceConfig",
          "body": "Serializable trace configuration. Canonical import: from arclm.agents import TraceConfig. Fully qualified name: arclm.agents.TraceConfig. Status: Beta."
        },
        {
          "title": "TraceConfig parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "enabled",
                "bool",
                "True"
              ],
              [
                "include_tool_content",
                "bool",
                "False"
              ]
            ]
          }
        },
        {
          "title": "TraceConfig example",
          "body": "",
          "code": "from arclm.agents import TraceConfig\n\nprint(TraceConfig)",
          "language": "python"
        },
        {
          "title": "TranscriptionRequest",
          "body": "Speech-to-text request. Canonical import: from arclm.agents import TranscriptionRequest. Fully qualified name: arclm.agents.TranscriptionRequest. Status: Beta."
        },
        {
          "title": "TranscriptionRequest parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "audio_path",
                "Path",
                "required"
              ],
              [
                "language",
                "str | None",
                "None"
              ],
              [
                "translate",
                "bool",
                "False"
              ],
              [
                "max_bytes",
                "int",
                "50000000"
              ]
            ]
          }
        },
        {
          "title": "TranscriptionRequest example",
          "body": "",
          "code": "from arclm.agents import TranscriptionRequest\n\nprint(TranscriptionRequest)",
          "language": "python"
        },
        {
          "title": "TranscriptionResult",
          "body": "Structured speech-to-text result. Canonical import: from arclm.agents import TranscriptionResult. Fully qualified name: arclm.agents.TranscriptionResult. Status: Beta."
        },
        {
          "title": "TranscriptionResult parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "text",
                "str",
                "required"
              ],
              [
                "language",
                "str | None",
                "None"
              ],
              [
                "duration_seconds",
                "float | None",
                "None"
              ],
              [
                "segments",
                "list[dict[str, object]]",
                "<factory>"
              ],
              [
                "metadata",
                "dict[str, object]",
                "<factory>"
              ]
            ]
          }
        },
        {
          "title": "TranscriptionResult example",
          "body": "",
          "code": "from arclm.agents import TranscriptionResult\n\nprint(TranscriptionResult)",
          "language": "python"
        },
        {
          "title": "WebToolConfig",
          "body": "Serializable web-tool limits. Canonical import: from arclm.agents import WebToolConfig. Fully qualified name: arclm.agents.WebToolConfig. Status: Beta."
        },
        {
          "title": "WebToolConfig parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "max_response_bytes",
                "int",
                "1000000"
              ],
              [
                "timeout_seconds",
                "float",
                "10.0"
              ],
              [
                "max_redirects",
                "int",
                "5"
              ]
            ]
          }
        },
        {
          "title": "WebToolConfig example",
          "body": "",
          "code": "from arclm.agents import WebToolConfig\n\nprint(WebToolConfig)",
          "language": "python"
        },
        {
          "title": "AgentRuntimeError",
          "body": "Base error for the ArcLM Agent Runtime. Canonical import: from arclm.agents import AgentRuntimeError. Fully qualified name: arclm.agents.AgentRuntimeError. Status: Beta."
        },
        {
          "title": "AgentRuntimeError parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "AgentRuntimeError example",
          "body": "",
          "code": "from arclm.agents import AgentRuntimeError\n\ntry:\n    raise AgentRuntimeError(\"example\")\nexcept AgentRuntimeError as exc:\n    print(type(exc).__name__)",
          "language": "python"
        },
        {
          "title": "OptionalAgentDependencyError",
          "body": "Raised when an optional agent integration dependency is unavailable. Canonical import: from arclm.agents import OptionalAgentDependencyError. Fully qualified name: arclm.agents.OptionalAgentDependencyError. Status: Beta."
        },
        {
          "title": "OptionalAgentDependencyError parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "OptionalAgentDependencyError example",
          "body": "",
          "code": "from arclm.agents import OptionalAgentDependencyError\n\ntry:\n    raise OptionalAgentDependencyError(\"example\")\nexcept OptionalAgentDependencyError as exc:\n    print(type(exc).__name__)",
          "language": "python"
        },
        {
          "title": "ToolError",
          "body": "Raised when a tool cannot be built, validated, or executed. Canonical import: from arclm.agents import ToolError. Fully qualified name: arclm.agents.ToolError. Status: Beta."
        },
        {
          "title": "ToolError parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "ToolError example",
          "body": "",
          "code": "from arclm.agents import ToolError\n\ntry:\n    raise ToolError(\"example\")\nexcept ToolError as exc:\n    print(type(exc).__name__)",
          "language": "python"
        },
        {
          "title": "ToolSchemaError",
          "body": "Raised when a callable cannot be represented as a safe tool schema. Canonical import: from arclm.agents import ToolSchemaError. Fully qualified name: arclm.agents.ToolSchemaError. Status: Beta."
        },
        {
          "title": "ToolSchemaError parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "ToolSchemaError example",
          "body": "",
          "code": "from arclm.agents import ToolSchemaError\n\ntry:\n    raise ToolSchemaError(\"example\")\nexcept ToolSchemaError as exc:\n    print(type(exc).__name__)",
          "language": "python"
        },
        {
          "title": "ToolValidationError",
          "body": "Raised when model-provided tool arguments fail validation. Canonical import: from arclm.agents import ToolValidationError. Fully qualified name: arclm.agents.ToolValidationError. Status: Beta."
        },
        {
          "title": "ToolValidationError parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "ToolValidationError example",
          "body": "",
          "code": "from arclm.agents import ToolValidationError\n\ntry:\n    raise ToolValidationError(\"example\")\nexcept ToolValidationError as exc:\n    print(type(exc).__name__)",
          "language": "python"
        },
        {
          "title": "get_agent_capabilities",
          "body": "Return the base Agent Runtime capability report. Canonical import: from arclm.agents import get_agent_capabilities. Fully qualified name: arclm.agents.get_agent_capabilities. Status: Beta."
        },
        {
          "title": "get_agent_capabilities parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "get_agent_capabilities example",
          "body": "",
          "code": "from arclm.agents import get_agent_capabilities\n\nprint(get_agent_capabilities)",
          "language": "python"
        },
        {
          "title": "tool",
          "body": "Decorator that exposes a typed Python function as a Tool. Canonical import: from arclm.agents import tool. Fully qualified name: arclm.agents.tool. Status: Beta."
        },
        {
          "title": "tool parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "function",
                "Callable[..., Any] | None",
                "None"
              ],
              [
                "options",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "tool example",
          "body": "",
          "code": "from arclm.agents import tool\n\nprint(tool)",
          "language": "python"
        }
      ],
      "status": "Stable"
    },
    {
      "id": "api-security",
      "title": "Security API",
      "group": "Reference",
      "href": "api/security.html",
      "summary": "Public security APIs.",
      "sections": [
        {
          "title": "Overview",
          "body": "Security API documents the public ArcLM APIs in this category."
        },
        {
          "title": "EncryptedEnvelope",
          "body": "JSON-safe authenticated encryption envelope. Canonical import: from arclm.security import EncryptedEnvelope. Fully qualified name: arclm.security.EncryptedEnvelope. Status: Beta."
        },
        {
          "title": "EncryptedEnvelope parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "format",
                "str",
                "required"
              ],
              [
                "version",
                "int",
                "required"
              ],
              [
                "algorithm",
                "str",
                "required"
              ],
              [
                "key_id",
                "str",
                "required"
              ],
              [
                "nonce",
                "str",
                "required"
              ],
              [
                "associated_data",
                "dict[str, Any]",
                "required"
              ],
              [
                "ciphertext",
                "str",
                "required"
              ],
              [
                "created_at",
                "str",
                "required"
              ],
              [
                "metadata",
                "dict[str, Any]",
                "<factory>"
              ],
              [
                "encrypted_data_key",
                "str | None",
                "None"
              ],
              [
                "key_encryption_key_id",
                "str | None",
                "None"
              ],
              [
                "password_kdf",
                "dict[str, Any] | None",
                "None"
              ]
            ]
          }
        },
        {
          "title": "EncryptedEnvelope example",
          "body": "",
          "code": "from arclm.security import EncryptedEnvelope\n\nprint(EncryptedEnvelope)",
          "language": "python"
        },
        {
          "title": "InMemorySecurityAuditLog",
          "body": "Small local audit sink for tests and local applications. Canonical import: from arclm.security import InMemorySecurityAuditLog. Fully qualified name: arclm.security.InMemorySecurityAuditLog. Status: Beta."
        },
        {
          "title": "InMemorySecurityAuditLog parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "InMemorySecurityAuditLog example",
          "body": "",
          "code": "from arclm.security import InMemorySecurityAuditLog\n\nprint(InMemorySecurityAuditLog)",
          "language": "python"
        },
        {
          "title": "LegacyArtifactPolicy",
          "body": "Compatibility policy for existing plaintext artifacts. Canonical import: from arclm.security import LegacyArtifactPolicy. Fully qualified name: arclm.security.LegacyArtifactPolicy. Status: Beta."
        },
        {
          "title": "LegacyArtifactPolicy parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "values",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "LegacyArtifactPolicy example",
          "body": "",
          "code": "from arclm.security import LegacyArtifactPolicy\n\nprint(LegacyArtifactPolicy)",
          "language": "python"
        },
        {
          "title": "PasswordKDFConfig",
          "body": "Bounded Argon2id configuration. Canonical import: from arclm.security import PasswordKDFConfig. Fully qualified name: arclm.security.PasswordKDFConfig. Status: Beta."
        },
        {
          "title": "PasswordKDFConfig parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "algorithm",
                "str",
                "'argon2id'"
              ],
              [
                "memory_cost_kib",
                "int",
                "65536"
              ],
              [
                "iterations",
                "int",
                "3"
              ],
              [
                "lanes",
                "int",
                "4"
              ],
              [
                "salt_length",
                "int",
                "16"
              ],
              [
                "output_length",
                "int",
                "32"
              ]
            ]
          }
        },
        {
          "title": "PasswordKDFConfig example",
          "body": "",
          "code": "from arclm.security import PasswordKDFConfig\n\nprint(PasswordKDFConfig)",
          "language": "python"
        },
        {
          "title": "SecurityAuditEvent",
          "body": "SecurityAuditEvent(event_type: 'str', timestamp: 'float', event_id: 'str' = <factory>, actor: 'str | None' = None, artifact_type: 'str | None' = None, result: 'str' = 'ok', metadata: 'dict[str, Any]' = <factory>) Canonical import: from arclm.security import SecurityAuditEvent. Fully qualified name: arclm.security.SecurityAuditEvent. Status: Beta."
        },
        {
          "title": "SecurityAuditEvent parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "event_type",
                "str",
                "required"
              ],
              [
                "timestamp",
                "float",
                "required"
              ],
              [
                "event_id",
                "str",
                "<factory>"
              ],
              [
                "actor",
                "str | None",
                "None"
              ],
              [
                "artifact_type",
                "str | None",
                "None"
              ],
              [
                "result",
                "str",
                "'ok'"
              ],
              [
                "metadata",
                "dict[str, Any]",
                "<factory>"
              ]
            ]
          }
        },
        {
          "title": "SecurityAuditEvent example",
          "body": "",
          "code": "from arclm.security import SecurityAuditEvent\n\nprint(SecurityAuditEvent)",
          "language": "python"
        },
        {
          "title": "SecurityCapabilities",
          "body": "Safe security capability report. Canonical import: from arclm.security import SecurityCapabilities. Fully qualified name: arclm.security.SecurityCapabilities. Status: Beta."
        },
        {
          "title": "SecurityCapabilities parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "encryption",
                "SecurityCapabilityStatus",
                "required"
              ],
              [
                "signatures",
                "SecurityCapabilityStatus",
                "required"
              ],
              [
                "password_kdf",
                "SecurityCapabilityStatus",
                "required"
              ],
              [
                "hkdf",
                "SecurityCapabilityStatus",
                "required"
              ],
              [
                "keyring",
                "SecurityCapabilityStatus",
                "<SecurityCapabilityStatus.OPTIONAL: 'optional'>"
              ],
              [
                "streaming_encryption",
                "SecurityCapabilityStatus",
                "<SecurityCapabilityStatus.UNSUPPORTED: 'unsupported'>"
              ],
              [
                "filesystem_permissions_supported",
                "bool",
                "True"
              ],
              [
                "tls13_supported",
                "bool",
                "<factory>"
              ]
            ]
          }
        },
        {
          "title": "SecurityCapabilities example",
          "body": "",
          "code": "from arclm.security import SecurityCapabilities\n\nprint(SecurityCapabilities)",
          "language": "python"
        },
        {
          "title": "SecurityCapabilityStatus",
          "body": "Security capability status. Canonical import: from arclm.security import SecurityCapabilityStatus. Fully qualified name: arclm.security.SecurityCapabilityStatus. Status: Beta."
        },
        {
          "title": "SecurityCapabilityStatus parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "values",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "SecurityCapabilityStatus example",
          "body": "",
          "code": "from arclm.security import SecurityCapabilityStatus\n\nprint(SecurityCapabilityStatus)",
          "language": "python"
        },
        {
          "title": "SecurityInventoryItem",
          "body": "SecurityInventoryItem(asset: 'str', location: 'str', sensitivity: 'str', current_protection: 'str', threats: 'tuple[str, ...]', required_protection: 'str', owner_subsystem: 'str', migration_requirement: 'str') Canonical import: from arclm.security import SecurityInventoryItem. Fully qualified name: arclm.security.SecurityInventoryItem. Status: Beta."
        },
        {
          "title": "SecurityInventoryItem parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "asset",
                "str",
                "required"
              ],
              [
                "location",
                "str",
                "required"
              ],
              [
                "sensitivity",
                "str",
                "required"
              ],
              [
                "current_protection",
                "str",
                "required"
              ],
              [
                "threats",
                "tuple[str, ...]",
                "required"
              ],
              [
                "required_protection",
                "str",
                "required"
              ],
              [
                "owner_subsystem",
                "str",
                "required"
              ],
              [
                "migration_requirement",
                "str",
                "required"
              ]
            ]
          }
        },
        {
          "title": "SecurityInventoryItem example",
          "body": "",
          "code": "from arclm.security import SecurityInventoryItem\n\nprint(SecurityInventoryItem)",
          "language": "python"
        },
        {
          "title": "SecurityMode",
          "body": "ArcLM security operating mode. Canonical import: from arclm.security import SecurityMode. Fully qualified name: arclm.security.SecurityMode. Status: Beta."
        },
        {
          "title": "SecurityMode parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "values",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "SecurityMode example",
          "body": "",
          "code": "from arclm.security import SecurityMode\n\nprint(SecurityMode)",
          "language": "python"
        },
        {
          "title": "SecurityPolicy",
          "body": "Framework-wide security policy. Canonical import: from arclm.security import SecurityPolicy. Fully qualified name: arclm.security.SecurityPolicy. Status: Beta."
        },
        {
          "title": "SecurityPolicy parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "mode",
                "SecurityMode",
                "<SecurityMode.LOCAL_SECURE: 'local_secure'>"
              ],
              [
                "legacy_artifacts",
                "LegacyArtifactPolicy",
                "<LegacyArtifactPolicy.LEGACY_READ: 'legacy_read'>"
              ],
              [
                "encryption_required_for",
                "tuple[str, ...]",
                "('agent_session', 'tool_trace', 'run_metadata')"
              ],
              [
                "signature_required_for",
                "tuple[str, ...]",
                "('model_artifact', 'checkpoint')"
              ],
              [
                "allowed_encryption_algorithms",
                "tuple[str, ...]",
                "('AES-256-GCM', 'ChaCha20-Poly1305')"
              ],
              [
                "default_encryption_algorithm",
                "str",
                "'AES-256-GCM'"
              ],
              [
                "allowed_hash_algorithms",
                "tuple[str, ...]",
                "('sha256', 'sha512')"
              ],
              [
                "default_hash_algorithm",
                "str",
                "'sha256'"
              ],
              [
                "allow_untrusted_pickle",
                "bool",
                "False"
              ],
              [
                "allow_remote_model_code",
                "bool",
                "False"
              ],
              [
                "tls_required_for_remote",
                "bool",
                "True"
              ],
              [
                "allow_wildcard_cors_with_credentials",
                "bool",
                "False"
              ],
              [
                "redact_traces",
                "bool",
                "True"
              ],
              [
                "max_encryption_bytes",
                "int",
                "16777216"
              ],
              [
                "max_manifest_files",
                "int",
                "10000"
              ],
              [
                "metadata",
                "dict[str, str]",
                "<factory>"
              ]
            ]
          }
        },
        {
          "title": "SecurityPolicy example",
          "body": "",
          "code": "from arclm.security import SecurityPolicy\n\nprint(SecurityPolicy)",
          "language": "python"
        },
        {
          "title": "ThreatModelItem",
          "body": "ThreatModelItem(threat: 'str', affected_assets: 'tuple[str, ...]', entry_point: 'str', likelihood: 'str', impact: 'str', mitigation: 'str', remaining_risk: 'str', required_tests: 'tuple[str, ...]') Canonical import: from arclm.security import ThreatModelItem. Fully qualified name: arclm.security.ThreatModelItem. Status: Beta."
        },
        {
          "title": "ThreatModelItem parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "threat",
                "str",
                "required"
              ],
              [
                "affected_assets",
                "tuple[str, ...]",
                "required"
              ],
              [
                "entry_point",
                "str",
                "required"
              ],
              [
                "likelihood",
                "str",
                "required"
              ],
              [
                "impact",
                "str",
                "required"
              ],
              [
                "mitigation",
                "str",
                "required"
              ],
              [
                "remaining_risk",
                "str",
                "required"
              ],
              [
                "required_tests",
                "tuple[str, ...]",
                "required"
              ]
            ]
          }
        },
        {
          "title": "ThreatModelItem example",
          "body": "",
          "code": "from arclm.security import ThreatModelItem\n\nprint(ThreatModelItem)",
          "language": "python"
        },
        {
          "title": "DecryptionError",
          "body": "Raised when decryption or authentication fails. Canonical import: from arclm.security import DecryptionError. Fully qualified name: arclm.security.DecryptionError. Status: Beta."
        },
        {
          "title": "DecryptionError parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "DecryptionError example",
          "body": "",
          "code": "from arclm.security import DecryptionError\n\ntry:\n    raise DecryptionError(\"example\")\nexcept DecryptionError as exc:\n    print(type(exc).__name__)",
          "language": "python"
        },
        {
          "title": "EncryptionError",
          "body": "Raised when encryption cannot complete safely. Canonical import: from arclm.security import EncryptionError. Fully qualified name: arclm.security.EncryptionError. Status: Beta."
        },
        {
          "title": "EncryptionError parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "EncryptionError example",
          "body": "",
          "code": "from arclm.security import EncryptionError\n\ntry:\n    raise EncryptionError(\"example\")\nexcept EncryptionError as exc:\n    print(type(exc).__name__)",
          "language": "python"
        },
        {
          "title": "KeyManagementError",
          "body": "Raised by key providers and key lifecycle checks. Canonical import: from arclm.security import KeyManagementError. Fully qualified name: arclm.security.KeyManagementError. Status: Beta."
        },
        {
          "title": "KeyManagementError parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "KeyManagementError example",
          "body": "",
          "code": "from arclm.security import KeyManagementError\n\ntry:\n    raise KeyManagementError(\"example\")\nexcept KeyManagementError as exc:\n    print(type(exc).__name__)",
          "language": "python"
        },
        {
          "title": "ManifestError",
          "body": "Raised for invalid or unsafe security manifests. Canonical import: from arclm.security import ManifestError. Fully qualified name: arclm.security.ManifestError. Status: Beta."
        },
        {
          "title": "ManifestError parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "ManifestError example",
          "body": "",
          "code": "from arclm.security import ManifestError\n\ntry:\n    raise ManifestError(\"example\")\nexcept ManifestError as exc:\n    print(type(exc).__name__)",
          "language": "python"
        },
        {
          "title": "SecureLoadError",
          "body": "Raised when secure loading policy blocks an artifact. Canonical import: from arclm.security import SecureLoadError. Fully qualified name: arclm.security.SecureLoadError. Status: Beta."
        },
        {
          "title": "SecureLoadError parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "SecureLoadError example",
          "body": "",
          "code": "from arclm.security import SecureLoadError\n\ntry:\n    raise SecureLoadError(\"example\")\nexcept SecureLoadError as exc:\n    print(type(exc).__name__)",
          "language": "python"
        },
        {
          "title": "SecurityDependencyError",
          "body": "Raised when a required security dependency is unavailable. Canonical import: from arclm.security import SecurityDependencyError. Fully qualified name: arclm.security.SecurityDependencyError. Status: Beta."
        },
        {
          "title": "SecurityDependencyError parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "SecurityDependencyError example",
          "body": "",
          "code": "from arclm.security import SecurityDependencyError\n\ntry:\n    raise SecurityDependencyError(\"example\")\nexcept SecurityDependencyError as exc:\n    print(type(exc).__name__)",
          "language": "python"
        },
        {
          "title": "SecurityError",
          "body": "Base error for ArcLM Security Core. Canonical import: from arclm.security import SecurityError. Fully qualified name: arclm.security.SecurityError. Status: Beta."
        },
        {
          "title": "SecurityError parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "SecurityError example",
          "body": "",
          "code": "from arclm.security import SecurityError\n\ntry:\n    raise SecurityError(\"example\")\nexcept SecurityError as exc:\n    print(type(exc).__name__)",
          "language": "python"
        },
        {
          "title": "SecurityPolicyError",
          "body": "Raised when security policy denies an operation. Canonical import: from arclm.security import SecurityPolicyError. Fully qualified name: arclm.security.SecurityPolicyError. Status: Beta."
        },
        {
          "title": "SecurityPolicyError parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "SecurityPolicyError example",
          "body": "",
          "code": "from arclm.security import SecurityPolicyError\n\ntry:\n    raise SecurityPolicyError(\"example\")\nexcept SecurityPolicyError as exc:\n    print(type(exc).__name__)",
          "language": "python"
        },
        {
          "title": "SignatureError",
          "body": "Raised when manifest signing or verification fails. Canonical import: from arclm.security import SignatureError. Fully qualified name: arclm.security.SignatureError. Status: Beta."
        },
        {
          "title": "SignatureError parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "SignatureError example",
          "body": "",
          "code": "from arclm.security import SignatureError\n\ntry:\n    raise SignatureError(\"example\")\nexcept SignatureError as exc:\n    print(type(exc).__name__)",
          "language": "python"
        },
        {
          "title": "decrypt_bytes",
          "body": "Decrypt an AEAD envelope or raise without returning partial plaintext. Canonical import: from arclm.security import decrypt_bytes. Fully qualified name: arclm.security.decrypt_bytes. Status: Beta."
        },
        {
          "title": "decrypt_bytes parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "envelope",
                "EncryptedEnvelope | dict[str, Any] | str",
                "required"
              ],
              [
                "key",
                "bytes | SecretValue",
                "required"
              ]
            ]
          }
        },
        {
          "title": "decrypt_bytes example",
          "body": "",
          "code": "from arclm.security import decrypt_bytes\n\nprint(decrypt_bytes)",
          "language": "python"
        },
        {
          "title": "decrypt_json",
          "body": "Decrypt JSON-safe data. Canonical import: from arclm.security import decrypt_json. Fully qualified name: arclm.security.decrypt_json. Status: Beta."
        },
        {
          "title": "decrypt_json parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "envelope",
                "EncryptedEnvelope | dict[str, Any] | str",
                "required"
              ],
              [
                "key",
                "bytes | SecretValue",
                "required"
              ]
            ]
          }
        },
        {
          "title": "decrypt_json example",
          "body": "",
          "code": "from arclm.security import decrypt_json\n\nprint(decrypt_json)",
          "language": "python"
        },
        {
          "title": "derive_key_argon2id",
          "body": "Derive a key-encryption key from a password using Argon2id. Canonical import: from arclm.security import derive_key_argon2id. Fully qualified name: arclm.security.derive_key_argon2id. Status: Beta."
        },
        {
          "title": "derive_key_argon2id parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "password",
                "str | bytes",
                "required"
              ],
              [
                "salt",
                "bytes | None",
                "None"
              ],
              [
                "config",
                "PasswordKDFConfig | None",
                "None"
              ]
            ]
          }
        },
        {
          "title": "derive_key_argon2id example",
          "body": "",
          "code": "from arclm.security import derive_key_argon2id\n\nprint(derive_key_argon2id)",
          "language": "python"
        },
        {
          "title": "derive_subkey_hkdf",
          "body": "Derive a purpose-bound subkey from high-entropy key material. Canonical import: from arclm.security import derive_subkey_hkdf. Fully qualified name: arclm.security.derive_subkey_hkdf. Status: Beta."
        },
        {
          "title": "derive_subkey_hkdf parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "master_key",
                "bytes",
                "required"
              ],
              [
                "purpose",
                "str",
                "required"
              ],
              [
                "context",
                "bytes",
                "b''"
              ],
              [
                "length",
                "int",
                "32"
              ]
            ]
          }
        },
        {
          "title": "derive_subkey_hkdf example",
          "body": "",
          "code": "from arclm.security import derive_subkey_hkdf\n\nprint(derive_subkey_hkdf)",
          "language": "python"
        },
        {
          "title": "encrypt_bytes",
          "body": "Encrypt bytes with AEAD and return a versioned envelope. Canonical import: from arclm.security import encrypt_bytes. Fully qualified name: arclm.security.encrypt_bytes. Status: Beta."
        },
        {
          "title": "encrypt_bytes parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "data",
                "bytes",
                "required"
              ],
              [
                "key",
                "bytes | SecretValue",
                "required"
              ],
              [
                "key_id",
                "str",
                "'direct'"
              ],
              [
                "algorithm",
                "str",
                "'AES-256-GCM'"
              ],
              [
                "associated_data",
                "dict[str, Any] | None",
                "None"
              ],
              [
                "metadata",
                "dict[str, Any] | None",
                "None"
              ],
              [
                "policy",
                "SecurityPolicy | None",
                "None"
              ]
            ]
          }
        },
        {
          "title": "encrypt_bytes example",
          "body": "",
          "code": "from arclm.security import encrypt_bytes\n\nprint(encrypt_bytes)",
          "language": "python"
        },
        {
          "title": "encrypt_json",
          "body": "Encrypt JSON-safe data. Canonical import: from arclm.security import encrypt_json. Fully qualified name: arclm.security.encrypt_json. Status: Beta."
        },
        {
          "title": "encrypt_json parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "value",
                "Any",
                "required"
              ],
              [
                "key",
                "bytes | SecretValue",
                "required"
              ],
              [
                "kwargs",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "encrypt_json example",
          "body": "",
          "code": "from arclm.security import encrypt_json\n\nprint(encrypt_json)",
          "language": "python"
        },
        {
          "title": "generate_signing_keypair",
          "body": "Generate a local Ed25519 signing key pair. Canonical import: from arclm.security import generate_signing_keypair. Fully qualified name: arclm.security.generate_signing_keypair. Status: Beta."
        },
        {
          "title": "generate_signing_keypair parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "key_id",
                "str",
                "'signing_key_local'"
              ]
            ]
          }
        },
        {
          "title": "generate_signing_keypair example",
          "body": "",
          "code": "from arclm.security import generate_signing_keypair\n\nprint(generate_signing_keypair)",
          "language": "python"
        },
        {
          "title": "get_security_capabilities",
          "body": "Return Security Core capability status without leaking local paths. Canonical import: from arclm.security import get_security_capabilities. Fully qualified name: arclm.security.get_security_capabilities. Status: Beta."
        },
        {
          "title": "get_security_capabilities parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "get_security_capabilities example",
          "body": "",
          "code": "from arclm.security import get_security_capabilities\n\nprint(get_security_capabilities)",
          "language": "python"
        },
        {
          "title": "hash_bytes",
          "body": "Hash bytes with an allowlisted algorithm. Canonical import: from arclm.security import hash_bytes. Fully qualified name: arclm.security.hash_bytes. Status: Beta."
        },
        {
          "title": "hash_bytes parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "data",
                "bytes",
                "required"
              ],
              [
                "algorithm",
                "str",
                "'sha256'"
              ]
            ]
          }
        },
        {
          "title": "hash_bytes example",
          "body": "",
          "code": "from arclm.security import hash_bytes\n\nprint(hash_bytes)",
          "language": "python"
        },
        {
          "title": "hash_file",
          "body": "Hash a file without loading it all into memory. Canonical import: from arclm.security import hash_file. Fully qualified name: arclm.security.hash_file. Status: Beta."
        },
        {
          "title": "hash_file parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "path",
                "str | Path",
                "required"
              ],
              [
                "algorithm",
                "str",
                "'sha256'"
              ],
              [
                "chunk_size",
                "int",
                "1048576"
              ]
            ]
          }
        },
        {
          "title": "hash_file example",
          "body": "",
          "code": "from arclm.security import hash_file\n\nprint(hash_file)",
          "language": "python"
        },
        {
          "title": "redact_mapping",
          "body": "Recursively redact sensitive mapping values. Canonical import: from arclm.security import redact_mapping. Fully qualified name: arclm.security.redact_mapping. Status: Beta."
        },
        {
          "title": "redact_mapping parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "value",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "redact_mapping example",
          "body": "",
          "code": "from arclm.security import redact_mapping\n\nprint(redact_mapping)",
          "language": "python"
        },
        {
          "title": "redact_sensitive_text",
          "body": "Redact common secret patterns from text. Canonical import: from arclm.security import redact_sensitive_text. Fully qualified name: arclm.security.redact_sensitive_text. Status: Beta."
        },
        {
          "title": "redact_sensitive_text parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "text",
                "str",
                "required"
              ]
            ]
          }
        },
        {
          "title": "redact_sensitive_text example",
          "body": "",
          "code": "from arclm.security import redact_sensitive_text\n\nprint(redact_sensitive_text)",
          "language": "python"
        },
        {
          "title": "security_inventory",
          "body": "Public function exported by arclm.security. Canonical import: from arclm.security import security_inventory. Fully qualified name: arclm.security.security_inventory. Status: Beta."
        },
        {
          "title": "security_inventory parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "security_inventory example",
          "body": "",
          "code": "from arclm.security import security_inventory\n\nprint(security_inventory)",
          "language": "python"
        },
        {
          "title": "security_status",
          "body": "Return a safe security status report without paths or secrets. Canonical import: from arclm.security import security_status. Fully qualified name: arclm.security.security_status. Status: Beta."
        },
        {
          "title": "security_status parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "policy",
                "SecurityPolicy | None",
                "None"
              ]
            ]
          }
        },
        {
          "title": "security_status example",
          "body": "",
          "code": "from arclm.security import security_status\n\nprint(security_status)",
          "language": "python"
        },
        {
          "title": "sign_manifest",
          "body": "Return a signed manifest copy. Canonical import: from arclm.security import sign_manifest. Fully qualified name: arclm.security.sign_manifest. Status: Beta."
        },
        {
          "title": "sign_manifest parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "manifest",
                "dict[str, Any]",
                "required"
              ],
              [
                "private_key",
                "bytes",
                "required"
              ],
              [
                "key_id",
                "str",
                "required"
              ]
            ]
          }
        },
        {
          "title": "sign_manifest example",
          "body": "",
          "code": "from arclm.security import sign_manifest\n\nprint(sign_manifest)",
          "language": "python"
        },
        {
          "title": "threat_model",
          "body": "Public function exported by arclm.security. Canonical import: from arclm.security import threat_model. Fully qualified name: arclm.security.threat_model. Status: Beta."
        },
        {
          "title": "threat_model parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "threat_model example",
          "body": "",
          "code": "from arclm.security import threat_model\n\nprint(threat_model)",
          "language": "python"
        },
        {
          "title": "verify_file_hash",
          "body": "Verify a trusted expected file hash. Canonical import: from arclm.security import verify_file_hash. Fully qualified name: arclm.security.verify_file_hash. Status: Beta."
        },
        {
          "title": "verify_file_hash parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "path",
                "str | Path",
                "required"
              ],
              [
                "expected",
                "str",
                "required"
              ]
            ]
          }
        },
        {
          "title": "verify_file_hash example",
          "body": "",
          "code": "from arclm.security import verify_file_hash\n\nprint(verify_file_hash)",
          "language": "python"
        },
        {
          "title": "verify_manifest",
          "body": "Verify a signed manifest. Canonical import: from arclm.security import verify_manifest. Fully qualified name: arclm.security.verify_manifest. Status: Beta."
        },
        {
          "title": "verify_manifest parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "manifest",
                "dict[str, Any]",
                "required"
              ],
              [
                "public_key",
                "bytes",
                "required"
              ],
              [
                "expected_key_id",
                "str | None",
                "None"
              ]
            ]
          }
        },
        {
          "title": "verify_manifest example",
          "body": "",
          "code": "from arclm.security import verify_manifest\n\nprint(verify_manifest)",
          "language": "python"
        },
        {
          "title": "verify_manifest_signature",
          "body": "Verify a signed manifest. Canonical import: from arclm.security import verify_manifest_signature. Fully qualified name: arclm.security.verify_manifest_signature. Status: Beta."
        },
        {
          "title": "verify_manifest_signature parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "manifest",
                "dict[str, Any]",
                "required"
              ],
              [
                "public_key",
                "bytes",
                "required"
              ],
              [
                "expected_key_id",
                "str | None",
                "None"
              ]
            ]
          }
        },
        {
          "title": "verify_manifest_signature example",
          "body": "",
          "code": "from arclm.security import verify_manifest_signature\n\nprint(verify_manifest_signature)",
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
          "body": "Configuratie voor ArcLM LoRA adapters. Canonical import: from arclm.peft import LoRAConfig. Fully qualified name: arclm.peft.LoRAConfig. Status: Experimental."
        },
        {
          "title": "LoRAConfig parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "method",
                "PeftMethod",
                "<PeftMethod.LORA: 'lora'>"
              ],
              [
                "enabled",
                "bool",
                "True"
              ],
              [
                "config_version",
                "int",
                "1"
              ],
              [
                "rank",
                "int",
                "4"
              ],
              [
                "alpha",
                "float",
                "8.0"
              ],
              [
                "dropout",
                "float",
                "0.0"
              ],
              [
                "target_modules",
                "tuple[str, ...]",
                "<factory>"
              ],
              [
                "target_match",
                "str",
                "'suffix'"
              ],
              [
                "bias",
                "str",
                "'none'"
              ],
              [
                "init",
                "str",
                "'kaiming_uniform'"
              ],
              [
                "freeze_base_model",
                "bool",
                "True"
              ]
            ]
          }
        },
        {
          "title": "LoRAConfig example",
          "body": "",
          "code": "from arclm.peft import LoRAConfig\n\nprint(LoRAConfig)",
          "language": "python"
        },
        {
          "title": "LoRALinear",
          "body": "Lineaire laag met trainbare LoRA matrices bovenop een bevroren basislaag. Canonical import: from arclm.peft import LoRALinear. Fully qualified name: arclm.peft.LoRALinear. Status: Experimental."
        },
        {
          "title": "LoRALinear parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "base",
                "nn.Linear",
                "required"
              ],
              [
                "config",
                "LoRAConfig",
                "required"
              ]
            ]
          }
        },
        {
          "title": "LoRALinear example",
          "body": "",
          "code": "from arclm.peft import LoRALinear\n\nprint(LoRALinear)",
          "language": "python"
        },
        {
          "title": "PeftAdapterInfo",
          "body": "Inspectie-info zonder adaptergewichten te laden in een model. Canonical import: from arclm.peft import PeftAdapterInfo. Fully qualified name: arclm.peft.PeftAdapterInfo. Status: Experimental."
        },
        {
          "title": "PeftAdapterInfo parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "adapter_id",
                "str",
                "required"
              ],
              [
                "artifact_format",
                "str",
                "required"
              ],
              [
                "artifact_version",
                "int",
                "required"
              ],
              [
                "method",
                "str",
                "required"
              ],
              [
                "target_modules",
                "tuple[str, ...]",
                "required"
              ],
              [
                "adapted_modules",
                "tuple[str, ...]",
                "required"
              ],
              [
                "base_model_fingerprint",
                "str | None",
                "required"
              ],
              [
                "file_count",
                "int",
                "required"
              ],
              [
                "total_size_bytes",
                "int",
                "required"
              ],
              [
                "integrity_verified",
                "bool | None",
                "required"
              ],
              [
                "created_at",
                "str",
                "required"
              ],
              [
                "arclm_version",
                "str | None",
                "required"
              ],
              [
                "pytorch_version",
                "str | None",
                "required"
              ],
              [
                "quantization_backend",
                "str | None",
                "None"
              ]
            ]
          }
        },
        {
          "title": "PeftAdapterInfo example",
          "body": "",
          "code": "from arclm.peft import PeftAdapterInfo\n\nprint(PeftAdapterInfo)",
          "language": "python"
        },
        {
          "title": "PeftAdapterManifest",
          "body": "Manifest voor een ArcLM PEFT adapter. Canonical import: from arclm.peft import PeftAdapterManifest. Fully qualified name: arclm.peft.PeftAdapterManifest. Status: Experimental."
        },
        {
          "title": "PeftAdapterManifest parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "artifact_format",
                "str",
                "required"
              ],
              [
                "artifact_version",
                "int",
                "required"
              ],
              [
                "adapter_id",
                "str",
                "required"
              ],
              [
                "created_at",
                "str",
                "required"
              ],
              [
                "created_with",
                "dict[str, Any]",
                "required"
              ],
              [
                "method",
                "str",
                "required"
              ],
              [
                "config",
                "dict[str, Any]",
                "required"
              ],
              [
                "base_model",
                "dict[str, Any]",
                "required"
              ],
              [
                "adapted_modules",
                "tuple[str, ...]",
                "required"
              ],
              [
                "parameter_report",
                "dict[str, Any]",
                "required"
              ],
              [
                "files",
                "list[AdapterArtifactFile]",
                "<factory>"
              ],
              [
                "metadata",
                "dict[str, Any]",
                "<factory>"
              ]
            ]
          }
        },
        {
          "title": "PeftAdapterManifest example",
          "body": "",
          "code": "from arclm.peft import PeftAdapterManifest\n\nprint(PeftAdapterManifest)",
          "language": "python"
        },
        {
          "title": "PeftApplicationResult",
          "body": "Resultaat van een PEFT-injectie. Canonical import: from arclm.peft import PeftApplicationResult. Fully qualified name: arclm.peft.PeftApplicationResult. Status: Experimental."
        },
        {
          "title": "PeftApplicationResult parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "method",
                "str",
                "required"
              ],
              [
                "adapted_modules",
                "tuple[str, ...]",
                "required"
              ],
              [
                "config",
                "dict[str, Any]",
                "required"
              ],
              [
                "parameter_report",
                "PeftParameterReport",
                "required"
              ],
              [
                "base_model_fingerprint",
                "str",
                "required"
              ],
              [
                "merged",
                "bool",
                "False"
              ]
            ]
          }
        },
        {
          "title": "PeftApplicationResult example",
          "body": "",
          "code": "from arclm.peft import PeftApplicationResult\n\nprint(PeftApplicationResult)",
          "language": "python"
        },
        {
          "title": "PeftConfig",
          "body": "Kleine basisconfig voor PEFT. Canonical import: from arclm.peft import PeftConfig. Fully qualified name: arclm.peft.PeftConfig. Status: Experimental."
        },
        {
          "title": "PeftConfig parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "method",
                "PeftMethod",
                "<PeftMethod.NONE: 'none'>"
              ],
              [
                "enabled",
                "bool",
                "True"
              ],
              [
                "config_version",
                "int",
                "1"
              ]
            ]
          }
        },
        {
          "title": "PeftConfig example",
          "body": "",
          "code": "from arclm.peft import PeftConfig\n\nprint(PeftConfig)",
          "language": "python"
        },
        {
          "title": "PeftMethod",
          "body": "Bekende PEFT-methodes. Canonical import: from arclm.peft import PeftMethod. Fully qualified name: arclm.peft.PeftMethod. Status: Experimental."
        },
        {
          "title": "PeftMethod parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "values",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "PeftMethod example",
          "body": "",
          "code": "from arclm.peft import PeftMethod\n\nprint(PeftMethod)",
          "language": "python"
        },
        {
          "title": "PeftParameterReport",
          "body": "Samenvatting van trainbare en bevroren parameters. Canonical import: from arclm.peft import PeftParameterReport. Fully qualified name: arclm.peft.PeftParameterReport. Status: Experimental."
        },
        {
          "title": "PeftParameterReport parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "total_parameters",
                "int",
                "required"
              ],
              [
                "trainable_parameters",
                "int",
                "required"
              ],
              [
                "frozen_parameters",
                "int",
                "required"
              ],
              [
                "trainable_percentage",
                "float",
                "required"
              ],
              [
                "adapted_module_count",
                "int",
                "required"
              ],
              [
                "trainable_parameter_names",
                "tuple[str, ...]",
                "<factory>"
              ]
            ]
          }
        },
        {
          "title": "PeftParameterReport example",
          "body": "",
          "code": "from arclm.peft import PeftParameterReport\n\nprint(PeftParameterReport)",
          "language": "python"
        },
        {
          "title": "PeftTarget",
          "body": "Een lineaire laag die LoRA kan krijgen. Canonical import: from arclm.peft import PeftTarget. Fully qualified name: arclm.peft.PeftTarget. Status: Experimental."
        },
        {
          "title": "PeftTarget parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "path",
                "str",
                "required"
              ],
              [
                "module_type",
                "str",
                "required"
              ],
              [
                "in_features",
                "int",
                "required"
              ],
              [
                "out_features",
                "int",
                "required"
              ],
              [
                "parameters",
                "int",
                "required"
              ]
            ]
          }
        },
        {
          "title": "PeftTarget example",
          "body": "",
          "code": "from arclm.peft import PeftTarget\n\nprint(PeftTarget)",
          "language": "python"
        },
        {
          "title": "QLoRAConfig",
          "body": "Configuratie voor QLoRA: 4-bit basis plus LoRA adapters. Canonical import: from arclm.peft import QLoRAConfig. Fully qualified name: arclm.peft.QLoRAConfig. Status: Experimental."
        },
        {
          "title": "QLoRAConfig parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "method",
                "PeftMethod",
                "<PeftMethod.QLORA: 'qlora'>"
              ],
              [
                "enabled",
                "bool",
                "True"
              ],
              [
                "config_version",
                "int",
                "1"
              ],
              [
                "quantization",
                "QuantizationConfig",
                "<factory>"
              ],
              [
                "lora",
                "LoRAConfig",
                "<factory>"
              ],
              [
                "adapter_dtype",
                "QuantizedComputeDType",
                "<QuantizedComputeDType.FP32: 'fp32'>"
              ]
            ]
          }
        },
        {
          "title": "QLoRAConfig example",
          "body": "",
          "code": "from arclm.peft import QLoRAConfig\n\nprint(QLoRAConfig)",
          "language": "python"
        },
        {
          "title": "QuantizationBackend",
          "body": "Bekende quantization backends voor fine-tuning. Canonical import: from arclm.peft import QuantizationBackend. Fully qualified name: arclm.peft.QuantizationBackend. Status: Experimental."
        },
        {
          "title": "QuantizationBackend parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "values",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "QuantizationBackend example",
          "body": "",
          "code": "from arclm.peft import QuantizationBackend\n\nprint(QuantizationBackend)",
          "language": "python"
        },
        {
          "title": "QuantizationCapabilityReport",
          "body": "Leesbare status van de lokale QLoRA-mogelijkheden. Canonical import: from arclm.peft import QuantizationCapabilityReport. Fully qualified name: arclm.peft.QuantizationCapabilityReport. Status: Experimental."
        },
        {
          "title": "QuantizationCapabilityReport parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "backend",
                "str",
                "required"
              ],
              [
                "dependency_installed",
                "bool",
                "required"
              ],
              [
                "cuda_available",
                "bool",
                "required"
              ],
              [
                "device_supported",
                "bool",
                "required"
              ],
              [
                "four_bit_loading_supported",
                "bool",
                "required"
              ],
              [
                "qlora_training_supported",
                "bool",
                "required"
              ],
              [
                "evidence_level",
                "str",
                "required"
              ],
              [
                "backend_version",
                "str | None",
                "None"
              ],
              [
                "reasons",
                "tuple[str, ...]",
                "<factory>"
              ]
            ]
          }
        },
        {
          "title": "QuantizationCapabilityReport example",
          "body": "",
          "code": "from arclm.peft import QuantizationCapabilityReport\n\nprint(QuantizationCapabilityReport)",
          "language": "python"
        },
        {
          "title": "QuantizationConfig",
          "body": "Kleine JSON-veilige config voor 4-bit quantization. Canonical import: from arclm.peft import QuantizationConfig. Fully qualified name: arclm.peft.QuantizationConfig. Status: Experimental."
        },
        {
          "title": "QuantizationConfig parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "backend",
                "QuantizationBackend",
                "<QuantizationBackend.BITSANDBYTES_4BIT: 'bitsandbytes_4bit'>"
              ],
              [
                "bits",
                "int",
                "4"
              ],
              [
                "quant_type",
                "QuantizationType",
                "<QuantizationType.NF4: 'nf4'>"
              ],
              [
                "use_double_quant",
                "bool",
                "True"
              ],
              [
                "compute_dtype",
                "QuantizedComputeDType",
                "<QuantizedComputeDType.FP16: 'fp16'>"
              ],
              [
                "config_version",
                "int",
                "1"
              ]
            ]
          }
        },
        {
          "title": "QuantizationConfig example",
          "body": "",
          "code": "from arclm.peft import QuantizationConfig\n\nprint(QuantizationConfig)",
          "language": "python"
        },
        {
          "title": "QuantizationType",
          "body": "4-bit quantization types die ArcLM accepteert. Canonical import: from arclm.peft import QuantizationType. Fully qualified name: arclm.peft.QuantizationType. Status: Experimental."
        },
        {
          "title": "QuantizationType parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "values",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "QuantizationType example",
          "body": "",
          "code": "from arclm.peft import QuantizationType\n\nprint(QuantizationType)",
          "language": "python"
        },
        {
          "title": "QuantizedComputeDType",
          "body": "Compute dtype voor quantized training. Canonical import: from arclm.peft import QuantizedComputeDType. Fully qualified name: arclm.peft.QuantizedComputeDType. Status: Experimental."
        },
        {
          "title": "QuantizedComputeDType parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "values",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "QuantizedComputeDType example",
          "body": "",
          "code": "from arclm.peft import QuantizedComputeDType\n\nprint(QuantizedComputeDType)",
          "language": "python"
        },
        {
          "title": "QuantizedModelReport",
          "body": "Samenvatting van een quantized QLoRA-runtime model. Canonical import: from arclm.peft import QuantizedModelReport. Fully qualified name: arclm.peft.QuantizedModelReport. Status: Experimental."
        },
        {
          "title": "QuantizedModelReport parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "backend",
                "str",
                "required"
              ],
              [
                "quantized_module_count",
                "int",
                "required"
              ],
              [
                "trainable_base_parameter_count",
                "int",
                "required"
              ],
              [
                "trainable_adapter_parameter_count",
                "int",
                "required"
              ],
              [
                "prepared",
                "bool",
                "required"
              ],
              [
                "metadata",
                "dict[str, Any]",
                "<factory>"
              ]
            ]
          }
        },
        {
          "title": "QuantizedModelReport example",
          "body": "",
          "code": "from arclm.peft import QuantizedModelReport\n\nprint(QuantizedModelReport)",
          "language": "python"
        },
        {
          "title": "ADAPTER_ARTIFACT_FORMAT",
          "body": "str(object='') -> str str(bytes_or_buffer[, encoding[, errors]]) -> str Create a new string object from the given object. Canonical import: from arclm.peft import ADAPTER_ARTIFACT_FORMAT. Fully qualified name: arclm.peft.ADAPTER_ARTIFACT_FORMAT. Status: Experimental."
        },
        {
          "title": "ADAPTER_ARTIFACT_FORMAT parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "ADAPTER_ARTIFACT_FORMAT example",
          "body": "",
          "code": "from arclm.peft import ADAPTER_ARTIFACT_FORMAT\n\nprint(ADAPTER_ARTIFACT_FORMAT)",
          "language": "python"
        },
        {
          "title": "ADAPTER_ARTIFACT_VERSION",
          "body": "int([x]) -> integer int(x, base=10) -> integer Convert a number or string to an integer, or return 0 if no arguments are given. Canonical import: from arclm.peft import ADAPTER_ARTIFACT_VERSION. Fully qualified name: arclm.peft.ADAPTER_ARTIFACT_VERSION. Status: Experimental."
        },
        {
          "title": "ADAPTER_ARTIFACT_VERSION parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "ADAPTER_ARTIFACT_VERSION example",
          "body": "",
          "code": "from arclm.peft import ADAPTER_ARTIFACT_VERSION\n\nprint(ADAPTER_ARTIFACT_VERSION)",
          "language": "python"
        },
        {
          "title": "apply_lora",
          "body": "Vervangt geselecteerde `nn.Linear` lagen door LoRA wrappers. Canonical import: from arclm.peft import apply_lora. Fully qualified name: arclm.peft.apply_lora. Status: Experimental."
        },
        {
          "title": "apply_lora parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "model",
                "nn.Module",
                "required"
              ],
              [
                "config",
                "LoRAConfig",
                "required"
              ]
            ]
          }
        },
        {
          "title": "apply_lora example",
          "body": "",
          "code": "from arclm.peft import apply_lora\n\nprint(apply_lora)",
          "language": "python"
        },
        {
          "title": "apply_peft",
          "body": "Past de gevraagde PEFT-methode toe. Canonical import: from arclm.peft import apply_peft. Fully qualified name: arclm.peft.apply_peft. Status: Experimental."
        },
        {
          "title": "apply_peft parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "model",
                "nn.Module",
                "required"
              ],
              [
                "config",
                "PeftConfig | None",
                "required"
              ]
            ]
          }
        },
        {
          "title": "apply_peft example",
          "body": "",
          "code": "from arclm.peft import apply_peft\n\nprint(apply_peft)",
          "language": "python"
        },
        {
          "title": "create_quantized_load_config",
          "body": "Maakt backend-specifieke laadconfig voor tests en integraties. Canonical import: from arclm.peft import create_quantized_load_config. Fully qualified name: arclm.peft.create_quantized_load_config. Status: Experimental."
        },
        {
          "title": "create_quantized_load_config parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "config",
                "QuantizationConfig | QLoRAConfig",
                "required"
              ]
            ]
          }
        },
        {
          "title": "create_quantized_load_config example",
          "body": "",
          "code": "from arclm.peft import create_quantized_load_config\n\nprint(create_quantized_load_config)",
          "language": "python"
        },
        {
          "title": "fingerprint_base_model",
          "body": "Maakt een structuur-fingerprint zonder adaptergewichten. Canonical import: from arclm.peft import fingerprint_base_model. Fully qualified name: arclm.peft.fingerprint_base_model. Status: Experimental."
        },
        {
          "title": "fingerprint_base_model parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "model",
                "nn.Module",
                "required"
              ]
            ]
          }
        },
        {
          "title": "fingerprint_base_model example",
          "body": "",
          "code": "from arclm.peft import fingerprint_base_model\n\nprint(fingerprint_base_model)",
          "language": "python"
        },
        {
          "title": "get_lora_state_dict",
          "body": "Haalt alleen adaptergewichten uit het model. Canonical import: from arclm.peft import get_lora_state_dict. Fully qualified name: arclm.peft.get_lora_state_dict. Status: Experimental."
        },
        {
          "title": "get_lora_state_dict parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "model",
                "nn.Module",
                "required"
              ]
            ]
          }
        },
        {
          "title": "get_lora_state_dict example",
          "body": "",
          "code": "from arclm.peft import get_lora_state_dict\n\nprint(get_lora_state_dict)",
          "language": "python"
        },
        {
          "title": "get_peft_parameter_report",
          "body": "Telt trainbare parameters na PEFT-injectie. Canonical import: from arclm.peft import get_peft_parameter_report. Fully qualified name: arclm.peft.get_peft_parameter_report. Status: Experimental."
        },
        {
          "title": "get_peft_parameter_report parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "model",
                "nn.Module",
                "required"
              ],
              [
                "include_names",
                "bool",
                "False"
              ]
            ]
          }
        },
        {
          "title": "get_peft_parameter_report example",
          "body": "",
          "code": "from arclm.peft import get_peft_parameter_report\n\nprint(get_peft_parameter_report)",
          "language": "python"
        },
        {
          "title": "get_quantization_backend",
          "body": "Geeft de goedgekeurde backendadapter terug. Canonical import: from arclm.peft import get_quantization_backend. Fully qualified name: arclm.peft.get_quantization_backend. Status: Experimental."
        },
        {
          "title": "get_quantization_backend parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "backend",
                "QuantizationBackend | str",
                "required"
              ]
            ]
          }
        },
        {
          "title": "get_quantization_backend example",
          "body": "",
          "code": "from arclm.peft import get_quantization_backend\n\nprint(get_quantization_backend)",
          "language": "python"
        },
        {
          "title": "inspect_adapter_artifact",
          "body": "Inspecteert adaptermetadata zonder een model te bouwen. Canonical import: from arclm.peft import inspect_adapter_artifact. Fully qualified name: arclm.peft.inspect_adapter_artifact. Status: Experimental."
        },
        {
          "title": "inspect_adapter_artifact parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "path",
                "str | Path",
                "required"
              ],
              [
                "verify_integrity",
                "bool",
                "False"
              ]
            ]
          }
        },
        {
          "title": "inspect_adapter_artifact example",
          "body": "",
          "code": "from arclm.peft import inspect_adapter_artifact\n\nprint(inspect_adapter_artifact)",
          "language": "python"
        },
        {
          "title": "inspect_lora_targets",
          "body": "Maakt een droog plan zonder het model te wijzigen. Canonical import: from arclm.peft import inspect_lora_targets. Fully qualified name: arclm.peft.inspect_lora_targets. Status: Experimental."
        },
        {
          "title": "inspect_lora_targets parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "model",
                "nn.Module",
                "required"
              ],
              [
                "config",
                "LoRAConfig",
                "required"
              ]
            ]
          }
        },
        {
          "title": "inspect_lora_targets example",
          "body": "",
          "code": "from arclm.peft import inspect_lora_targets\n\nprint(inspect_lora_targets)",
          "language": "python"
        },
        {
          "title": "inspect_quantization_capabilities",
          "body": "Inspecteert QLoRA-mogelijkheden zonder een model te laden. Canonical import: from arclm.peft import inspect_quantization_capabilities. Fully qualified name: arclm.peft.inspect_quantization_capabilities. Status: Experimental."
        },
        {
          "title": "inspect_quantization_capabilities parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "config",
                "QuantizationConfig | QLoRAConfig | None",
                "None"
              ]
            ]
          }
        },
        {
          "title": "inspect_quantization_capabilities example",
          "body": "",
          "code": "from arclm.peft import inspect_quantization_capabilities\n\nprint(inspect_quantization_capabilities)",
          "language": "python"
        },
        {
          "title": "is_lora_model",
          "body": "Controleert of een model LoRA-wrappers bevat. Canonical import: from arclm.peft import is_lora_model. Fully qualified name: arclm.peft.is_lora_model. Status: Experimental."
        },
        {
          "title": "is_lora_model parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "model",
                "nn.Module",
                "required"
              ]
            ]
          }
        },
        {
          "title": "is_lora_model example",
          "body": "",
          "code": "from arclm.peft import is_lora_model\n\nprint(is_lora_model)",
          "language": "python"
        },
        {
          "title": "is_quantized_runtime_model",
          "body": "Controleert of een model als ArcLM quantized runtime is gemarkeerd. Canonical import: from arclm.peft import is_quantized_runtime_model. Fully qualified name: arclm.peft.is_quantized_runtime_model. Status: Experimental."
        },
        {
          "title": "is_quantized_runtime_model parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "model",
                "nn.Module",
                "required"
              ]
            ]
          }
        },
        {
          "title": "is_quantized_runtime_model example",
          "body": "",
          "code": "from arclm.peft import is_quantized_runtime_model\n\nprint(is_quantized_runtime_model)",
          "language": "python"
        },
        {
          "title": "load_adapter_artifact",
          "body": "Past een LoRA adapterartifact toe op een schoon basismodel. Canonical import: from arclm.peft import load_adapter_artifact. Fully qualified name: arclm.peft.load_adapter_artifact. Status: Experimental."
        },
        {
          "title": "load_adapter_artifact parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "model",
                "nn.Module",
                "required"
              ],
              [
                "path",
                "str | Path",
                "required"
              ],
              [
                "device",
                "str | torch.device",
                "'cpu'"
              ],
              [
                "strict",
                "bool",
                "True"
              ]
            ]
          }
        },
        {
          "title": "load_adapter_artifact example",
          "body": "",
          "code": "from arclm.peft import load_adapter_artifact\n\nprint(load_adapter_artifact)",
          "language": "python"
        },
        {
          "title": "load_lora_state_dict",
          "body": "Laadt adaptergewichten in een model dat al LoRA-wrappers heeft. Canonical import: from arclm.peft import load_lora_state_dict. Fully qualified name: arclm.peft.load_lora_state_dict. Status: Experimental."
        },
        {
          "title": "load_lora_state_dict parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "model",
                "nn.Module",
                "required"
              ],
              [
                "state_dict",
                "Mapping[str, torch.Tensor]",
                "required"
              ],
              [
                "strict",
                "bool",
                "True"
              ]
            ]
          }
        },
        {
          "title": "load_lora_state_dict example",
          "body": "",
          "code": "from arclm.peft import load_lora_state_dict\n\nprint(load_lora_state_dict)",
          "language": "python"
        },
        {
          "title": "load_quantized_model",
          "body": "Laadt een lokaal 4-bit model voor QLoRA. Canonical import: from arclm.peft import load_quantized_model. Fully qualified name: arclm.peft.load_quantized_model. Status: Experimental."
        },
        {
          "title": "load_quantized_model parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "model_path",
                "str | Path",
                "required"
              ],
              [
                "config",
                "QLoRAConfig",
                "required"
              ],
              [
                "device",
                "str",
                "'cuda:0'"
              ],
              [
                "trust_remote_code",
                "bool",
                "False"
              ]
            ]
          }
        },
        {
          "title": "load_quantized_model example",
          "body": "",
          "code": "from arclm.peft import load_quantized_model\n\nprint(load_quantized_model)",
          "language": "python"
        },
        {
          "title": "merge_lora",
          "body": "Merged alle LoRA-lagen in-place. Canonical import: from arclm.peft import merge_lora. Fully qualified name: arclm.peft.merge_lora. Status: Experimental."
        },
        {
          "title": "merge_lora parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "model",
                "nn.Module",
                "required"
              ]
            ]
          }
        },
        {
          "title": "merge_lora example",
          "body": "",
          "code": "from arclm.peft import merge_lora\n\nprint(merge_lora)",
          "language": "python"
        },
        {
          "title": "merged_lora_model",
          "body": "Geeft een kopie terug waarbij LoRA in gewone Linear lagen is verwerkt. Canonical import: from arclm.peft import merged_lora_model. Fully qualified name: arclm.peft.merged_lora_model. Status: Experimental."
        },
        {
          "title": "merged_lora_model parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "model",
                "nn.Module",
                "required"
              ]
            ]
          }
        },
        {
          "title": "merged_lora_model example",
          "body": "",
          "code": "from arclm.peft import merged_lora_model\n\nprint(merged_lora_model)",
          "language": "python"
        },
        {
          "title": "prepare_model_for_qlora",
          "body": "Bevriest de quantized basis voordat LoRA wordt toegevoegd. Canonical import: from arclm.peft import prepare_model_for_qlora. Fully qualified name: arclm.peft.prepare_model_for_qlora. Status: Experimental."
        },
        {
          "title": "prepare_model_for_qlora parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "model",
                "nn.Module",
                "required"
              ],
              [
                "config",
                "QLoRAConfig",
                "required"
              ]
            ]
          }
        },
        {
          "title": "prepare_model_for_qlora example",
          "body": "",
          "code": "from arclm.peft import prepare_model_for_qlora\n\nprint(prepare_model_for_qlora)",
          "language": "python"
        },
        {
          "title": "save_adapter_artifact",
          "body": "Bewaart alleen LoRA adaptergewichten. Canonical import: from arclm.peft import save_adapter_artifact. Fully qualified name: arclm.peft.save_adapter_artifact. Status: Experimental."
        },
        {
          "title": "save_adapter_artifact parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "model",
                "nn.Module",
                "required"
              ],
              [
                "path",
                "str | Path",
                "required"
              ],
              [
                "config",
                "LoRAConfig | QLoRAConfig | Mapping[str, Any] | None",
                "None"
              ],
              [
                "adapted_modules",
                "tuple[str, ...] | None",
                "None"
              ],
              [
                "overwrite",
                "bool",
                "False"
              ]
            ]
          }
        },
        {
          "title": "save_adapter_artifact example",
          "body": "",
          "code": "from arclm.peft import save_adapter_artifact\n\nprint(save_adapter_artifact)",
          "language": "python"
        },
        {
          "title": "unmerge_lora",
          "body": "Maakt een eerdere merge ongedaan. Canonical import: from arclm.peft import unmerge_lora. Fully qualified name: arclm.peft.unmerge_lora. Status: Experimental."
        },
        {
          "title": "unmerge_lora parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "model",
                "nn.Module",
                "required"
              ]
            ]
          }
        },
        {
          "title": "unmerge_lora example",
          "body": "",
          "code": "from arclm.peft import unmerge_lora\n\nprint(unmerge_lora)",
          "language": "python"
        },
        {
          "title": "validate_adapter_artifact",
          "body": "Valideert manifest, paden en hashes zonder adapter te laden. Canonical import: from arclm.peft import validate_adapter_artifact. Fully qualified name: arclm.peft.validate_adapter_artifact. Status: Experimental."
        },
        {
          "title": "validate_adapter_artifact parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "path",
                "str | Path",
                "required"
              ]
            ]
          }
        },
        {
          "title": "validate_adapter_artifact example",
          "body": "",
          "code": "from arclm.peft import validate_adapter_artifact\n\nprint(validate_adapter_artifact)",
          "language": "python"
        },
        {
          "title": "validate_quantized_base_model",
          "body": "Controleert dat QLoRA echt op een quantized basis draait. Canonical import: from arclm.peft import validate_quantized_base_model. Fully qualified name: arclm.peft.validate_quantized_base_model. Status: Experimental."
        },
        {
          "title": "validate_quantized_base_model parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "model",
                "nn.Module",
                "required"
              ],
              [
                "config",
                "QLoRAConfig",
                "required"
              ]
            ]
          }
        },
        {
          "title": "validate_quantized_base_model example",
          "body": "",
          "code": "from arclm.peft import validate_quantized_base_model\n\nprint(validate_quantized_base_model)",
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
          "title": "DatasetRoot",
          "body": "Een server-side datasetmap die de browser mag laten inspecteren. Canonical import: from arclm.web import DatasetRoot. Fully qualified name: arclm.web.DatasetRoot. Status: Beta."
        },
        {
          "title": "DatasetRoot parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "name",
                "str",
                "required"
              ],
              [
                "path",
                "str | Path",
                "required"
              ],
              [
                "root_id",
                "str | None",
                "None"
              ],
              [
                "enabled",
                "bool",
                "True"
              ],
              [
                "recursive",
                "bool",
                "True"
              ],
              [
                "source_origin",
                "Literal['persisted', 'command_line']",
                "'command_line'"
              ]
            ]
          }
        },
        {
          "title": "DatasetRoot example",
          "body": "",
          "code": "from arclm.web import DatasetRoot\n\nprint(DatasetRoot)",
          "language": "python"
        },
        {
          "title": "WebConfig",
          "body": "Instellingen voor de lokale Web API. Canonical import: from arclm.web import WebConfig. Fully qualified name: arclm.web.WebConfig. Status: Beta."
        },
        {
          "title": "WebConfig parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "host",
                "str",
                "'127.0.0.1'"
              ],
              [
                "port",
                "int",
                "8765"
              ],
              [
                "allowed_origins",
                "tuple[str, ...]",
                "('http://127.0.0.1:3000', 'http://localhost:3000')"
              ],
              [
                "expose_docs",
                "bool",
                "True"
              ],
              [
                "dataset_config_path",
                "str | Path | None",
                "None"
              ],
              [
                "dataset_source_management",
                "bool",
                "True"
              ],
              [
                "workspace_root",
                "str | Path",
                "'workspace'"
              ],
              [
                "dataset_roots",
                "tuple[DatasetRoot, ...]",
                "()"
              ],
              [
                "max_dataset_roots",
                "int",
                "20"
              ],
              [
                "max_catalogue_entries",
                "int",
                "500"
              ],
              [
                "max_recursive_depth",
                "int",
                "5"
              ],
              [
                "default_preview_rows",
                "int",
                "20"
              ],
              [
                "max_preview_rows",
                "int",
                "100"
              ],
              [
                "max_scan_rows",
                "int",
                "10000"
              ],
              [
                "max_field_length",
                "int",
                "2000"
              ],
              [
                "max_fields",
                "int",
                "200"
              ],
              [
                "max_inspection_file_size",
                "int",
                "10485760"
              ],
              [
                "max_upload_size",
                "int",
                "26214400"
              ],
              [
                "max_paste_size",
                "int",
                "2097152"
              ],
              [
                "max_tokenizer_text_length",
                "int",
                "20000"
              ],
              [
                "max_dataset_inspection_records",
                "int",
                "20"
              ],
              [
                "max_dataset_inspection_tokens",
                "int",
                "256"
              ],
              [
                "max_active_training_jobs",
                "int",
                "1"
              ],
              [
                "max_evaluation_examples",
                "int",
                "256"
              ],
              [
                "max_generation_prompt_chars",
                "int",
                "8000"
              ],
              [
                "max_generation_new_tokens",
                "int",
                "128"
              ],
              [
                "max_generation_history",
                "int",
                "100"
              ]
            ]
          }
        },
        {
          "title": "WebConfig example",
          "body": "",
          "code": "from arclm.web import WebConfig\n\nprint(WebConfig)",
          "language": "python"
        },
        {
          "title": "create_app",
          "body": "Maakt de lokale ArcLM Web API. Canonical import: from arclm.web import create_app. Fully qualified name: arclm.web.create_app. Status: Beta."
        },
        {
          "title": "create_app parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "config",
                "WebConfig | None",
                "None"
              ],
              [
                "model",
                "Any | None",
                "None"
              ],
              [
                "tokenizer",
                "Any | None",
                "None"
              ]
            ]
          }
        },
        {
          "title": "create_app example",
          "body": "",
          "code": "from arclm.web import create_app\n\nprint(create_app)",
          "language": "python"
        }
      ],
      "status": "Stable"
    },
    {
      "id": "api-plugins",
      "title": "Plugins API",
      "group": "Reference",
      "href": "api/plugins.html",
      "summary": "Public plugins APIs.",
      "sections": [
        {
          "title": "Overview",
          "body": "Plugins API documents the public ArcLM APIs in this category."
        },
        {
          "title": "PluginMetadata",
          "body": "Kleine beschrijving van een plugin. Canonical import: from arclm.plugins import PluginMetadata. Fully qualified name: arclm.plugins.PluginMetadata. Status: Experimental."
        },
        {
          "title": "PluginMetadata parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "name",
                "str",
                "required"
              ],
              [
                "version",
                "str",
                "required"
              ]
            ]
          }
        },
        {
          "title": "PluginMetadata example",
          "body": "",
          "code": "from arclm.plugins import PluginMetadata\n\nprint(PluginMetadata)",
          "language": "python"
        },
        {
          "title": "PluginProtocol",
          "body": "Contract voor plugins die zelf ArcLM uitbreidingen registreren. Canonical import: from arclm.plugins import PluginProtocol. Fully qualified name: arclm.plugins.PluginProtocol. Status: Experimental."
        },
        {
          "title": "PluginProtocol parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "args",
                "Any",
                "required"
              ],
              [
                "kwargs",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "PluginProtocol example",
          "body": "",
          "code": "from arclm.plugins import PluginProtocol\n\nprint(PluginProtocol)",
          "language": "python"
        }
      ],
      "status": "Stable"
    },
    {
      "id": "api-registry",
      "title": "Registry API",
      "group": "Reference",
      "href": "api/registry.html",
      "summary": "Public registry APIs.",
      "sections": [
        {
          "title": "Overview",
          "body": "Registry API documents the public ArcLM APIs in this category."
        },
        {
          "title": "Registry",
          "body": "Koppelt namen aan objecten en controleert dubbele registraties. Canonical import: from arclm.registry import Registry. Fully qualified name: arclm.registry.Registry. Status: Experimental."
        },
        {
          "title": "Registry parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "namespace",
                "str",
                "required"
              ]
            ]
          }
        },
        {
          "title": "Registry example",
          "body": "",
          "code": "from arclm.registry import Registry\n\nprint(Registry)",
          "language": "python"
        }
      ],
      "status": "Stable"
    },
    {
      "id": "api-configuration",
      "title": "Configuration API",
      "group": "Reference",
      "href": "api/configuration.html",
      "summary": "Public configuration APIs.",
      "sections": [
        {
          "title": "Overview",
          "body": "Configuration API documents the public ArcLM APIs in this category."
        },
        {
          "title": "Config",
          "body": "Houdt alle belangrijke ArcLM instellingen bij. Canonical import: from arclm.configs import Config. Fully qualified name: arclm.configs.Config. Status: Deprecated."
        },
        {
          "title": "Config parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "kwargs",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "Config example",
          "body": "",
          "code": "from arclm.configs import Config\n\nprint(Config)",
          "language": "python"
        },
        {
          "title": "DatasetConfig",
          "body": "Houdt alle belangrijke ArcLM instellingen bij. Canonical import: from arclm.configs import DatasetConfig. Fully qualified name: arclm.configs.DatasetConfig. Status: Deprecated."
        },
        {
          "title": "DatasetConfig parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "kwargs",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "DatasetConfig example",
          "body": "",
          "code": "from arclm.configs import DatasetConfig\n\nprint(DatasetConfig)",
          "language": "python"
        },
        {
          "title": "InferenceConfig",
          "body": "Houdt alle belangrijke ArcLM instellingen bij. Canonical import: from arclm.configs import InferenceConfig. Fully qualified name: arclm.configs.InferenceConfig. Status: Deprecated."
        },
        {
          "title": "InferenceConfig parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "kwargs",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "InferenceConfig example",
          "body": "",
          "code": "from arclm.configs import InferenceConfig\n\nprint(InferenceConfig)",
          "language": "python"
        },
        {
          "title": "ModelConfig",
          "body": "Houdt alle belangrijke ArcLM instellingen bij. Canonical import: from arclm.configs import ModelConfig. Fully qualified name: arclm.configs.ModelConfig. Status: Deprecated."
        },
        {
          "title": "ModelConfig parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "kwargs",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "ModelConfig example",
          "body": "",
          "code": "from arclm.configs import ModelConfig\n\nprint(ModelConfig)",
          "language": "python"
        },
        {
          "title": "TokenizerConfig",
          "body": "Houdt alle belangrijke ArcLM instellingen bij. Canonical import: from arclm.configs import TokenizerConfig. Fully qualified name: arclm.configs.TokenizerConfig. Status: Deprecated."
        },
        {
          "title": "TokenizerConfig parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "kwargs",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "TokenizerConfig example",
          "body": "",
          "code": "from arclm.configs import TokenizerConfig\n\nprint(TokenizerConfig)",
          "language": "python"
        },
        {
          "title": "TrainingConfig",
          "body": "Houdt alle belangrijke ArcLM instellingen bij. Canonical import: from arclm.configs import TrainingConfig. Fully qualified name: arclm.configs.TrainingConfig. Status: Deprecated."
        },
        {
          "title": "TrainingConfig parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "kwargs",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "TrainingConfig example",
          "body": "",
          "code": "from arclm.configs import TrainingConfig\n\nprint(TrainingConfig)",
          "language": "python"
        },
        {
          "title": "create_config",
          "body": "Maakt een `Config` met praktische defaults. Canonical import: from arclm.configs import create_config. Fully qualified name: arclm.configs.create_config. Status: Deprecated."
        },
        {
          "title": "create_config parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "kwargs",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "create_config example",
          "body": "",
          "code": "from arclm.configs import create_config\n\nprint(create_config)",
          "language": "python"
        },
        {
          "title": "create_example_configs",
          "body": "Maakt voorbeeldconfiguraties in de `configs/` map. Canonical import: from arclm.configs import create_example_configs. Fully qualified name: arclm.configs.create_example_configs. Status: Deprecated."
        },
        {
          "title": "create_example_configs parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "create_example_configs example",
          "body": "",
          "code": "from arclm.configs import create_example_configs\n\nprint(create_example_configs)",
          "language": "python"
        },
        {
          "title": "get_finetuning_config",
          "body": "Maakt een config die handig is voor finetuning. Canonical import: from arclm.configs import get_finetuning_config. Fully qualified name: arclm.configs.get_finetuning_config. Status: Deprecated."
        },
        {
          "title": "get_finetuning_config parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "num_epochs",
                "int",
                "3"
              ],
              [
                "batch_size",
                "int",
                "32"
              ],
              [
                "learning_rate",
                "float",
                "2e-05"
              ],
              [
                "freeze_backbone",
                "bool",
                "True"
              ],
              [
                "use_discriminative_lr",
                "bool",
                "True"
              ],
              [
                "tokenizer_type",
                "str",
                "'sentencepiece'"
              ],
              [
                "vocab_size",
                "int",
                "None"
              ],
              [
                "user_defined_symbols",
                "Any",
                "['<|qa_start|>', '<|res_start|>', '<|end|>', '<|pad|>']"
              ],
              [
                "kwargs",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "get_finetuning_config example",
          "body": "",
          "code": "from arclm.configs import get_finetuning_config\n\nprint(get_finetuning_config)",
          "language": "python"
        },
        {
          "title": "get_instruction_tuning_config",
          "body": "Maakt een config die handig is voor instruction tuning. Canonical import: from arclm.configs import get_instruction_tuning_config. Fully qualified name: arclm.configs.get_instruction_tuning_config. Status: Deprecated."
        },
        {
          "title": "get_instruction_tuning_config parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "num_epochs",
                "int",
                "5"
              ],
              [
                "batch_size",
                "int",
                "16"
              ],
              [
                "learning_rate",
                "float",
                "5e-05"
              ],
              [
                "vocab_size",
                "int",
                "None"
              ],
              [
                "user_defined_symbols",
                "Any",
                "['<|qa_start|>', '<|res_start|>', '<|end|>', '<|pad|>']"
              ],
              [
                "kwargs",
                "Any",
                "required"
              ]
            ]
          }
        },
        {
          "title": "get_instruction_tuning_config example",
          "body": "",
          "code": "from arclm.configs import get_instruction_tuning_config\n\nprint(get_instruction_tuning_config)",
          "language": "python"
        },
        {
          "title": "load_config",
          "body": "Laadt een configbestand en kiest YAML of JSON op basis van extensie. Canonical import: from arclm.configs import load_config. Fully qualified name: arclm.configs.load_config. Status: Deprecated."
        },
        {
          "title": "load_config parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "filepath",
                "str",
                "required"
              ]
            ]
          }
        },
        {
          "title": "load_config example",
          "body": "",
          "code": "from arclm.configs import load_config\n\nprint(load_config)",
          "language": "python"
        },
        {
          "title": "load_config_json",
          "body": "Laadt een configuratie uit een JSON-bestand. Canonical import: from arclm.configs import load_config_json. Fully qualified name: arclm.configs.load_config_json. Status: Deprecated."
        },
        {
          "title": "load_config_json parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "filepath",
                "str",
                "required"
              ]
            ]
          }
        },
        {
          "title": "load_config_json example",
          "body": "",
          "code": "from arclm.configs import load_config_json\n\nprint(load_config_json)",
          "language": "python"
        },
        {
          "title": "load_config_yaml",
          "body": "Laadt een configuratie uit een YAML-bestand. Canonical import: from arclm.configs import load_config_yaml. Fully qualified name: arclm.configs.load_config_yaml. Status: Deprecated."
        },
        {
          "title": "load_config_yaml parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "filepath",
                "str",
                "required"
              ]
            ]
          }
        },
        {
          "title": "load_config_yaml example",
          "body": "",
          "code": "from arclm.configs import load_config_yaml\n\nprint(load_config_yaml)",
          "language": "python"
        },
        {
          "title": "save_config",
          "body": "Slaat een configuratie op en kiest YAML of JSON op basis van extensie. Canonical import: from arclm.configs import save_config. Fully qualified name: arclm.configs.save_config. Status: Deprecated."
        },
        {
          "title": "save_config parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "config",
                "Config",
                "required"
              ],
              [
                "filepath",
                "str",
                "required"
              ]
            ]
          }
        },
        {
          "title": "save_config example",
          "body": "",
          "code": "from arclm.configs import save_config\n\nprint(save_config)",
          "language": "python"
        },
        {
          "title": "save_config_json",
          "body": "Slaat een configuratie op als JSON-bestand. Canonical import: from arclm.configs import save_config_json. Fully qualified name: arclm.configs.save_config_json. Status: Deprecated."
        },
        {
          "title": "save_config_json parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "config",
                "Config",
                "required"
              ],
              [
                "filepath",
                "str",
                "required"
              ]
            ]
          }
        },
        {
          "title": "save_config_json example",
          "body": "",
          "code": "from arclm.configs import save_config_json\n\nprint(save_config_json)",
          "language": "python"
        },
        {
          "title": "save_config_yaml",
          "body": "Slaat een configuratie op als YAML-bestand. Canonical import: from arclm.configs import save_config_yaml. Fully qualified name: arclm.configs.save_config_yaml. Status: Deprecated."
        },
        {
          "title": "save_config_yaml parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": [
              [
                "config",
                "Config",
                "required"
              ],
              [
                "filepath",
                "str",
                "required"
              ]
            ]
          }
        },
        {
          "title": "save_config_yaml example",
          "body": "",
          "code": "from arclm.configs import save_config_yaml\n\nprint(save_config_yaml)",
          "language": "python"
        }
      ],
      "status": "Stable"
    },
    {
      "id": "api-errors",
      "title": "Errors API",
      "group": "Reference",
      "href": "api/errors.html",
      "summary": "Public errors APIs.",
      "sections": [
        {
          "title": "Overview",
          "body": "Errors API documents the public ArcLM APIs in this category."
        },
        {
          "title": "ArcLMError",
          "body": "Base exception for ArcLM. Canonical import: from arclm.exceptions import ArcLMError. Fully qualified name: arclm.exceptions.ArcLMError. Status: Stable."
        },
        {
          "title": "ArcLMError parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "ArcLMError example",
          "body": "",
          "code": "from arclm.exceptions import ArcLMError\n\ntry:\n    raise ArcLMError(\"example\")\nexcept ArcLMError as exc:\n    print(type(exc).__name__)",
          "language": "python"
        },
        {
          "title": "CheckpointError",
          "body": "Raised for checkpoint errors. Canonical import: from arclm.exceptions import CheckpointError. Fully qualified name: arclm.exceptions.CheckpointError. Status: Stable."
        },
        {
          "title": "CheckpointError parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "CheckpointError example",
          "body": "",
          "code": "from arclm.exceptions import CheckpointError\n\ntry:\n    raise CheckpointError(\"example\")\nexcept CheckpointError as exc:\n    print(type(exc).__name__)",
          "language": "python"
        },
        {
          "title": "CleaningError",
          "body": "Raised when a cleaning step cannot process an example. Canonical import: from arclm.exceptions import CleaningError. Fully qualified name: arclm.exceptions.CleaningError. Status: Stable."
        },
        {
          "title": "CleaningError parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "CleaningError example",
          "body": "",
          "code": "from arclm.exceptions import CleaningError\n\ntry:\n    raise CleaningError(\"example\")\nexcept CleaningError as exc:\n    print(type(exc).__name__)",
          "language": "python"
        },
        {
          "title": "ConfigurationError",
          "body": "Raised for invalid configuration. Canonical import: from arclm.exceptions import ConfigurationError. Fully qualified name: arclm.exceptions.ConfigurationError. Status: Stable."
        },
        {
          "title": "ConfigurationError parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "ConfigurationError example",
          "body": "",
          "code": "from arclm.exceptions import ConfigurationError\n\ntry:\n    raise ConfigurationError(\"example\")\nexcept ConfigurationError as exc:\n    print(type(exc).__name__)",
          "language": "python"
        },
        {
          "title": "DataCollatorError",
          "body": "Raised when SFT batches cannot be collated. Canonical import: from arclm.exceptions import DataCollatorError. Fully qualified name: arclm.exceptions.DataCollatorError. Status: Stable."
        },
        {
          "title": "DataCollatorError parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "DataCollatorError example",
          "body": "",
          "code": "from arclm.exceptions import DataCollatorError\n\ntry:\n    raise DataCollatorError(\"example\")\nexcept DataCollatorError as exc:\n    print(type(exc).__name__)",
          "language": "python"
        },
        {
          "title": "DatasetError",
          "body": "Raised for dataset errors. Canonical import: from arclm.exceptions import DatasetError. Fully qualified name: arclm.exceptions.DatasetError. Status: Stable."
        },
        {
          "title": "DatasetError parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "DatasetError example",
          "body": "",
          "code": "from arclm.exceptions import DatasetError\n\ntry:\n    raise DatasetError(\"example\")\nexcept DatasetError as exc:\n    print(type(exc).__name__)",
          "language": "python"
        },
        {
          "title": "DatasetLoadError",
          "body": "Raised when a dataset cannot be loaded. Canonical import: from arclm.exceptions import DatasetLoadError. Fully qualified name: arclm.exceptions.DatasetLoadError. Status: Stable."
        },
        {
          "title": "DatasetLoadError parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "DatasetLoadError example",
          "body": "",
          "code": "from arclm.exceptions import DatasetLoadError\n\ntry:\n    raise DatasetLoadError(\"example\")\nexcept DatasetLoadError as exc:\n    print(type(exc).__name__)",
          "language": "python"
        },
        {
          "title": "DatasetValidationError",
          "body": "Raised when dataset rows do not match the expected shape. Canonical import: from arclm.exceptions import DatasetValidationError. Fully qualified name: arclm.exceptions.DatasetValidationError. Status: Stable."
        },
        {
          "title": "DatasetValidationError parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "DatasetValidationError example",
          "body": "",
          "code": "from arclm.exceptions import DatasetValidationError\n\ntry:\n    raise DatasetValidationError(\"example\")\nexcept DatasetValidationError as exc:\n    print(type(exc).__name__)",
          "language": "python"
        },
        {
          "title": "DatasetVersionError",
          "body": "Raised when local dataset versioning fails. Canonical import: from arclm.exceptions import DatasetVersionError. Fully qualified name: arclm.exceptions.DatasetVersionError. Status: Stable."
        },
        {
          "title": "DatasetVersionError parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "DatasetVersionError example",
          "body": "",
          "code": "from arclm.exceptions import DatasetVersionError\n\ntry:\n    raise DatasetVersionError(\"example\")\nexcept DatasetVersionError as exc:\n    print(type(exc).__name__)",
          "language": "python"
        },
        {
          "title": "DeduplicationError",
          "body": "Raised when deduplication fails. Canonical import: from arclm.exceptions import DeduplicationError. Fully qualified name: arclm.exceptions.DeduplicationError. Status: Stable."
        },
        {
          "title": "DeduplicationError parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "DeduplicationError example",
          "body": "",
          "code": "from arclm.exceptions import DeduplicationError\n\ntry:\n    raise DeduplicationError(\"example\")\nexcept DeduplicationError as exc:\n    print(type(exc).__name__)",
          "language": "python"
        },
        {
          "title": "EvaluationConfigError",
          "body": "Raised for invalid evaluation configuration. Canonical import: from arclm.exceptions import EvaluationConfigError. Fully qualified name: arclm.exceptions.EvaluationConfigError. Status: Stable."
        },
        {
          "title": "EvaluationConfigError parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "EvaluationConfigError example",
          "body": "",
          "code": "from arclm.exceptions import EvaluationConfigError\n\ntry:\n    raise EvaluationConfigError(\"example\")\nexcept EvaluationConfigError as exc:\n    print(type(exc).__name__)",
          "language": "python"
        },
        {
          "title": "EvaluationError",
          "body": "Raised for evaluation errors. Canonical import: from arclm.exceptions import EvaluationError. Fully qualified name: arclm.exceptions.EvaluationError. Status: Stable."
        },
        {
          "title": "EvaluationError parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "EvaluationError example",
          "body": "",
          "code": "from arclm.exceptions import EvaluationError\n\ntry:\n    raise EvaluationError(\"example\")\nexcept EvaluationError as exc:\n    print(type(exc).__name__)",
          "language": "python"
        },
        {
          "title": "FineTuningError",
          "body": "Raised for fine-tuning errors. Canonical import: from arclm.exceptions import FineTuningError. Fully qualified name: arclm.exceptions.FineTuningError. Status: Stable."
        },
        {
          "title": "FineTuningError parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "FineTuningError example",
          "body": "",
          "code": "from arclm.exceptions import FineTuningError\n\ntry:\n    raise FineTuningError(\"example\")\nexcept FineTuningError as exc:\n    print(type(exc).__name__)",
          "language": "python"
        },
        {
          "title": "FormattingError",
          "body": "Raised when an SFT example cannot be formatted. Canonical import: from arclm.exceptions import FormattingError. Fully qualified name: arclm.exceptions.FormattingError. Status: Stable."
        },
        {
          "title": "FormattingError parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "FormattingError example",
          "body": "",
          "code": "from arclm.exceptions import FormattingError\n\ntry:\n    raise FormattingError(\"example\")\nexcept FormattingError as exc:\n    print(type(exc).__name__)",
          "language": "python"
        },
        {
          "title": "InferenceError",
          "body": "Raised for inference errors. Canonical import: from arclm.exceptions import InferenceError. Fully qualified name: arclm.exceptions.InferenceError. Status: Stable."
        },
        {
          "title": "InferenceError parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "InferenceError example",
          "body": "",
          "code": "from arclm.exceptions import InferenceError\n\ntry:\n    raise InferenceError(\"example\")\nexcept InferenceError as exc:\n    print(type(exc).__name__)",
          "language": "python"
        },
        {
          "title": "MetricError",
          "body": "Raised when a metric cannot be computed. Canonical import: from arclm.exceptions import MetricError. Fully qualified name: arclm.exceptions.MetricError. Status: Stable."
        },
        {
          "title": "MetricError parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "MetricError example",
          "body": "",
          "code": "from arclm.exceptions import MetricError\n\ntry:\n    raise MetricError(\"example\")\nexcept MetricError as exc:\n    print(type(exc).__name__)",
          "language": "python"
        },
        {
          "title": "ModelAdapterError",
          "body": "Raised when a model adapter cannot call or read a model. Canonical import: from arclm.exceptions import ModelAdapterError. Fully qualified name: arclm.exceptions.ModelAdapterError. Status: Stable."
        },
        {
          "title": "ModelAdapterError parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "ModelAdapterError example",
          "body": "",
          "code": "from arclm.exceptions import ModelAdapterError\n\ntry:\n    raise ModelAdapterError(\"example\")\nexcept ModelAdapterError as exc:\n    print(type(exc).__name__)",
          "language": "python"
        },
        {
          "title": "ModelLoadError",
          "body": "Raised when model loading fails. Canonical import: from arclm.exceptions import ModelLoadError. Fully qualified name: arclm.exceptions.ModelLoadError. Status: Stable."
        },
        {
          "title": "ModelLoadError parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "ModelLoadError example",
          "body": "",
          "code": "from arclm.exceptions import ModelLoadError\n\ntry:\n    raise ModelLoadError(\"example\")\nexcept ModelLoadError as exc:\n    print(type(exc).__name__)",
          "language": "python"
        },
        {
          "title": "OptionalDependencyError",
          "body": "Raised when an optional dependency is required but not installed. Canonical import: from arclm.exceptions import OptionalDependencyError. Fully qualified name: arclm.exceptions.OptionalDependencyError. Status: Stable."
        },
        {
          "title": "OptionalDependencyError parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "OptionalDependencyError example",
          "body": "",
          "code": "from arclm.exceptions import OptionalDependencyError\n\ntry:\n    raise OptionalDependencyError(\"example\")\nexcept OptionalDependencyError as exc:\n    print(type(exc).__name__)",
          "language": "python"
        },
        {
          "title": "PipelineError",
          "body": "Raised when a data pipeline step fails. Canonical import: from arclm.exceptions import PipelineError. Fully qualified name: arclm.exceptions.PipelineError. Status: Stable."
        },
        {
          "title": "PipelineError parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "PipelineError example",
          "body": "",
          "code": "from arclm.exceptions import PipelineError\n\ntry:\n    raise PipelineError(\"example\")\nexcept PipelineError as exc:\n    print(type(exc).__name__)",
          "language": "python"
        },
        {
          "title": "PrecisionError",
          "body": "Raised when requested training precision is not supported. Canonical import: from arclm.exceptions import PrecisionError. Fully qualified name: arclm.exceptions.PrecisionError. Status: Stable."
        },
        {
          "title": "PrecisionError parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "PrecisionError example",
          "body": "",
          "code": "from arclm.exceptions import PrecisionError\n\ntry:\n    raise PrecisionError(\"example\")\nexcept PrecisionError as exc:\n    print(type(exc).__name__)",
          "language": "python"
        },
        {
          "title": "SFTConfigError",
          "body": "Raised for invalid SFT configuration. Canonical import: from arclm.exceptions import SFTConfigError. Fully qualified name: arclm.exceptions.SFTConfigError. Status: Stable."
        },
        {
          "title": "SFTConfigError parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "SFTConfigError example",
          "body": "",
          "code": "from arclm.exceptions import SFTConfigError\n\ntry:\n    raise SFTConfigError(\"example\")\nexcept SFTConfigError as exc:\n    print(type(exc).__name__)",
          "language": "python"
        },
        {
          "title": "StreamingError",
          "body": "Raised when a streaming dataset cannot be read. Canonical import: from arclm.exceptions import StreamingError. Fully qualified name: arclm.exceptions.StreamingError. Status: Stable."
        },
        {
          "title": "StreamingError parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "StreamingError example",
          "body": "",
          "code": "from arclm.exceptions import StreamingError\n\ntry:\n    raise StreamingError(\"example\")\nexcept StreamingError as exc:\n    print(type(exc).__name__)",
          "language": "python"
        },
        {
          "title": "SyntheticDataError",
          "body": "Raised when synthetic data generation fails. Canonical import: from arclm.exceptions import SyntheticDataError. Fully qualified name: arclm.exceptions.SyntheticDataError. Status: Stable."
        },
        {
          "title": "SyntheticDataError parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "SyntheticDataError example",
          "body": "",
          "code": "from arclm.exceptions import SyntheticDataError\n\ntry:\n    raise SyntheticDataError(\"example\")\nexcept SyntheticDataError as exc:\n    print(type(exc).__name__)",
          "language": "python"
        },
        {
          "title": "TokenizerAdapterError",
          "body": "Raised when a tokenizer adapter cannot encode data. Canonical import: from arclm.exceptions import TokenizerAdapterError. Fully qualified name: arclm.exceptions.TokenizerAdapterError. Status: Stable."
        },
        {
          "title": "TokenizerAdapterError parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "TokenizerAdapterError example",
          "body": "",
          "code": "from arclm.exceptions import TokenizerAdapterError\n\ntry:\n    raise TokenizerAdapterError(\"example\")\nexcept TokenizerAdapterError as exc:\n    print(type(exc).__name__)",
          "language": "python"
        },
        {
          "title": "TokenizerError",
          "body": "Raised for tokenizer errors. Canonical import: from arclm.exceptions import TokenizerError. Fully qualified name: arclm.exceptions.TokenizerError. Status: Stable."
        },
        {
          "title": "TokenizerError parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "TokenizerError example",
          "body": "",
          "code": "from arclm.exceptions import TokenizerError\n\ntry:\n    raise TokenizerError(\"example\")\nexcept TokenizerError as exc:\n    print(type(exc).__name__)",
          "language": "python"
        },
        {
          "title": "TrainingConfigError",
          "body": "Raised for invalid training configuration. Canonical import: from arclm.exceptions import TrainingConfigError. Fully qualified name: arclm.exceptions.TrainingConfigError. Status: Stable."
        },
        {
          "title": "TrainingConfigError parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "TrainingConfigError example",
          "body": "",
          "code": "from arclm.exceptions import TrainingConfigError\n\ntry:\n    raise TrainingConfigError(\"example\")\nexcept TrainingConfigError as exc:\n    print(type(exc).__name__)",
          "language": "python"
        },
        {
          "title": "TrainingError",
          "body": "Raised for training errors. Canonical import: from arclm.exceptions import TrainingError. Fully qualified name: arclm.exceptions.TrainingError. Status: Stable."
        },
        {
          "title": "TrainingError parameters",
          "body": "",
          "table": {
            "columns": [
              "Name",
              "Type",
              "Default"
            ],
            "rows": []
          }
        },
        {
          "title": "TrainingError example",
          "body": "",
          "code": "from arclm.exceptions import TrainingError\n\ntry:\n    raise TrainingError(\"example\")\nexcept TrainingError as exc:\n    print(type(exc).__name__)",
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
            "Turn a local HTML fixture into dataset records"
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
            "Build and inspect a word tokenizer",
            "Train a tiny SentencePiece BPE tokenizer"
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
            "Create a tiny native ArcLM model",
            "Save and reload a native model state dict",
            "Inspect external local-model loading policy",
            "Load a real external local Hugging Face model",
            "Local language model mini project",
            "Model benchmark lab mini project"
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
          "items": [
            "Run one CPU pretraining optimization step",
            "PEFT and QLoRA real adapter training boundary",
            "Save, load, and inspect a training checkpoint"
          ]
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
          "items": []
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
          "items": []
        }
      ],
      "status": "Stable"
    },
    {
      "id": "examples-agents",
      "title": "Agent Examples",
      "group": "Examples",
      "href": "examples/agent-examples.html",
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
            "Run a deterministic custom-tool agent",
            "Run a secure local document agent",
            "Local document agent mini project"
          ]
        }
      ],
      "status": "Stable"
    },
    {
      "id": "examples-security",
      "title": "Security Examples",
      "group": "Examples",
      "href": "examples/security-examples.html",
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
            "Inspect ArcLM Security Core status",
            "Encrypt, hash, sign, verify, and redact local data"
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
            "Local language model mini project",
            "Domain SFT assistant mini project",
            "Website knowledge pipeline mini project",
            "Local document agent mini project",
            "Model benchmark lab mini project",
            "Secure local AI workspace mini project"
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
      "id": "classes",
      "title": "Class Index",
      "group": "Reference",
      "href": "reference/classes.html",
      "summary": "Search and filter public classes.",
      "sections": [
        {
          "title": "Coverage",
          "body": "This page is generated from current public package exports and includes classes and public exceptions. Use the filters to narrow by subsystem or status."
        }
      ],
      "status": "Stable"
    },
    {
      "id": "functions",
      "title": "Function Index",
      "group": "Reference",
      "href": "reference/functions.html",
      "summary": "Search and filter public functions.",
      "sections": [
        {
          "title": "Coverage",
          "body": "This page is generated from current public package exports and includes synchronous and asynchronous public functions."
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
      "id": "optional-dependencies",
      "title": "Optional Dependencies",
      "group": "Reference",
      "href": "reference/optional-dependencies.html",
      "summary": "Extras and optional integration boundaries.",
      "sections": [
        {
          "title": "Extras",
          "body": "",
          "table": {
            "columns": [
              "Extra",
              "Purpose"
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
          "title": "Policy",
          "body": "",
          "items": [
            "Base imports should stay lightweight.",
            "Hugging Face, PEFT, Web and speech dependencies are optional.",
            "Missing optional dependencies should fail with clear errors."
          ]
        }
      ],
      "status": "Stable"
    },
    {
      "id": "compatibility",
      "title": "Compatibility",
      "group": "Reference",
      "href": "reference/compatibility.html",
      "summary": "Deprecated and compatibility APIs.",
      "sections": [
        {
          "title": "Compatibility policy",
          "body": "Deprecated imports remain documented with replacements while tests and users need them. New examples prefer canonical domain imports."
        },
        {
          "title": "Compatibility surfaces",
          "body": "",
          "items": [
            "Root lazy imports",
            "MiniGPT alias for ArcLM",
            "legacy module aliases",
            "checkpoint compatibility helpers"
          ]
        }
      ],
      "status": "Stable"
    },
    {
      "id": "deprecated-apis",
      "title": "Deprecated APIs",
      "group": "Reference",
      "href": "reference/deprecated-apis.html",
      "summary": "Migration notes for compatibility-only names.",
      "sections": [
        {
          "title": "Migration rule",
          "body": "Prefer canonical domain imports for new code. Deprecated names are compatibility-only and should not appear in new examples."
        },
        {
          "title": "Known deprecated entries",
          "body": "",
          "table": {
            "columns": [
              "Deprecated",
              "Replacement"
            ],
            "rows": [
              [
                "MiniGPT",
                "ArcLM"
              ],
              [
                "arclm.configs compatibility exports",
                "domain configuration objects"
              ],
              [
                "checkpoint_is_compatible_for_tuining",
                "checkpoint_is_compatible_for_continue_training where applicable"
              ]
            ]
          }
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
                "Validated",
                "Executed by maintained tests or examples."
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
                "Integration-compatible",
                "Supported through an optional integration boundary."
              ],
              [
                "Internal",
                "Not stable public API."
              ],
              [
                "Deprecated",
                "Compatibility only."
              ],
              [
                "Planned",
                "Documented future boundary."
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
    },
    {
      "id": "contributing-architecture",
      "title": "Contributor Architecture",
      "group": "Contributing",
      "href": "contributing/architecture.html",
      "summary": "Repository structure and extension points.",
      "sections": [
        {
          "title": "Ownership model",
          "body": "The Python package is the source of truth for public APIs. The documentation site is generated from repository data plus curated guide copy."
        },
        {
          "title": "Extension areas",
          "body": "",
          "items": [
            "Registries",
            "Plugins",
            "Events",
            "Dependency injection",
            "Lab challenges",
            "Examples suite"
          ]
        }
      ],
      "status": "Stable"
    },
    {
      "id": "contributing-testing",
      "title": "Testing",
      "group": "Contributing",
      "href": "contributing/testing.html",
      "summary": "How to validate documentation and code changes.",
      "sections": [
        {
          "title": "Core checks",
          "body": "",
          "code": "python -m compileall -q src tests examples lab\npython -m pytest -q\npython examples/run_examples.py run-verified\npython -m lab.runner test-all",
          "language": "bash"
        }
      ],
      "status": "Stable"
    },
    {
      "id": "contributing-docs",
      "title": "Docs Build",
      "group": "Contributing",
      "href": "contributing/docs-build.html",
      "summary": "Build and validate the static documentation website.",
      "sections": [
        {
          "title": "Docs ownership",
          "body": "The `tools/build_documentation_site.py` generator owns the static site output in `documentation-site/`. Handwritten project notes remain in `docs/`."
        },
        {
          "title": "Build docs",
          "body": "",
          "code": "python tools/build_documentation_site.py\npython -m pytest -q",
          "language": "bash"
        },
        {
          "title": "Feedback",
          "body": "Each page exposes a local helpful button, copy-page-id action and optional issue link. No tracking service is used."
        }
      ],
      "status": "Stable"
    },
    {
      "id": "version-current",
      "title": "Current Version",
      "group": "Releases",
      "href": "releases/current.html",
      "summary": "Current documentation version and release state.",
      "sections": [
        {
          "title": "Current docs",
          "body": "This documentation describes the installed package version reported by the current repository. It does not change the package version."
        },
        {
          "title": "Version strategy",
          "body": "",
          "items": [
            "Current docs are generated in place.",
            "Historical docs are included only when an accurate snapshot exists.",
            "Development docs should be generated from the active branch."
          ]
        }
      ],
      "status": "Stable"
    },
    {
      "id": "version-history",
      "title": "Version History",
      "group": "Releases",
      "href": "releases/version-history.html",
      "summary": "Known documentation and package history.",
      "sections": [
        {
          "title": "Artifacts",
          "body": "",
          "table": {
            "columns": [
              "Version",
              "Status"
            ],
            "rows": [
              [
                "1.0.0",
                "Current framework version from arclm.__version__, package metadata and built artifact"
              ],
              [
                "0.10.0",
                "Current API compatibility version from arclm.__api_version__"
              ],
              [
                "0.9.0",
                "Older built artifact retained in dist for comparison"
              ]
            ]
          }
        }
      ],
      "status": "Stable"
    },
    {
      "id": "migration",
      "title": "Migration Guides",
      "group": "Releases",
      "href": "releases/migration.html",
      "summary": "Migration notes for current users.",
      "sections": [
        {
          "title": "Recommended migrations",
          "body": "",
          "items": [
            "Use domain imports instead of legacy modules.",
            "Use numbered examples as canonical current examples.",
            "Treat external model and QLoRA paths as optional/manual until verified locally."
          ]
        }
      ],
      "status": "Stable"
    }
  ]
};
