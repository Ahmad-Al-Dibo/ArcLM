window.ARCLM_API_CATALOG = [
  {
    "name": "load_dataset",
    "importPath": "arclm.datasets.load_dataset",
    "kind": "function",
    "category": "datasets",
    "status": "Stable",
    "signature": "load_dataset(source, **kwargs)",
    "summary": "Load in-memory records or supported local dataset files.",
    "parameters": [
      [
        "source",
        "Any",
        "Python records, text path, JSON, JSONL, CSV or TXT source."
      ]
    ],
    "returns": "A list or iterable of dictionaries depending on configuration.",
    "errors": [
      "Unsupported format",
      "Malformed JSON or CSV",
      "Missing required text fields"
    ],
    "usage": "from arclm.datasets import load_dataset\n\nrecords = load_dataset([{\"text\": \"ArcLM\"}])\nprint(records)"
  },
  {
    "name": "validate_records",
    "importPath": "arclm.datasets.validate_records",
    "kind": "function",
    "category": "datasets",
    "status": "Stable",
    "signature": "validate_records(records, *, required_fields, field_types=None, allow_empty=False, strict=True, record_id_field=None)",
    "summary": "Validate required dataset fields and return structured issues.",
    "parameters": [
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
    ],
    "returns": "DatasetValidationResult.",
    "errors": [
      "Missing field",
      "Wrong field type",
      "Empty field value"
    ],
    "usage": "from arclm.datasets import validate_records\n\nresult = validate_records([{\"instruction\": \"Hi\", \"response\": \"Hello\"}], required_fields=[\"instruction\", \"response\"])\nprint(result.valid_count)"
  },
  {
    "name": "build_dataset_report",
    "importPath": "arclm.datasets.build_dataset_report",
    "kind": "function",
    "category": "datasets",
    "status": "Stable",
    "signature": "build_dataset_report(records, *, tokenizer=None, text_fields=('text',), validation_result=None, manifest=None, split_information=None, duplicates_removed=0, empty_records_removed=None, truncated_record_count=0, max_token_length=None)",
    "summary": "Create JSON-safe dataset and token statistics.",
    "parameters": [
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
    ],
    "returns": "DatasetReport with to_dict, to_json and summary helpers.",
    "errors": [
      "Tokenizer cannot encode selected fields",
      "Selected fields missing"
    ],
    "usage": "from arclm.datasets import build_dataset_report\nfrom arclm.tokenizers import Tokenizer\n\nrecords = [{\"text\": \"ArcLM trains locally\"}]\ntokenizer = Tokenizer(max_vocab=16)\ntokenizer.build(records[0][\"text\"])\nreport = build_dataset_report(records, tokenizer=tokenizer)\nprint(report.summary())"
  },
  {
    "name": "Tokenizer",
    "importPath": "arclm.tokenizers.Tokenizer",
    "kind": "class",
    "category": "tokenizers",
    "status": "Beta",
    "signature": "Tokenizer(max_vocab=50000, default_token='<UNK>', user_defined_symbols=None)",
    "summary": "Simple native word tokenizer.",
    "parameters": [
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
    ],
    "members": [
      [
        "build(texts)",
        "Build vocabulary from text."
      ],
      [
        "encode_text(text)",
        "Return token IDs."
      ],
      [
        "decode(ids)",
        "Return text from token IDs."
      ],
      [
        "get_vocab_size()",
        "Return vocabulary size."
      ]
    ],
    "returns": "Tokenizer instance.",
    "errors": [
      "Vocabulary too small",
      "Unknown token rate high"
    ],
    "usage": "from arclm.tokenizers import Tokenizer\n\ntokenizer = Tokenizer(max_vocab=32)\ntokenizer.build(\"Hello ArcLM\")\nids = tokenizer.encode_text(\"Hello\")\nprint(ids)"
  },
  {
    "name": "SentencePieceTokenizer",
    "importPath": "arclm.tokenizers.SentencePieceTokenizer",
    "kind": "class",
    "category": "tokenizers",
    "status": "Beta",
    "signature": "SentencePieceTokenizer(max_vocab=50000, model_type='bpe', character_coverage=1.0, default_token='<UNK>', model_name=None, user_defined_symbols=None)",
    "summary": "Native wrapper for SentencePiece BPE, unigram, character and word modes.",
    "parameters": [
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
    ],
    "returns": "SentencePieceTokenizer instance.",
    "errors": [
      "SentencePiece unavailable",
      "Invalid model type",
      "Input corpus too small"
    ],
    "usage": "from arclm.tokenizers import SentencePieceTokenizer\n\ntokenizer = SentencePieceTokenizer(max_vocab=64, model_type=\"bpe\")\nprint(tokenizer.model_type)"
  },
  {
    "name": "ArcLM",
    "importPath": "arclm.models.ArcLM",
    "kind": "class",
    "category": "models",
    "status": "Stable",
    "signature": "ArcLM(vocab_size, embed_dim=64, block_size=8, num_blocks=2, dropout=0.0)",
    "summary": "Compact native causal language model.",
    "parameters": [
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
    ],
    "returns": "PyTorch module.",
    "errors": [
      "Invalid dimensions",
      "Context overflow",
      "Vocabulary mismatch"
    ],
    "usage": "from arclm.models import ArcLM\n\nmodel = ArcLM(vocab_size=32, embed_dim=16, block_size=8, num_blocks=1)\nprint(type(model).__name__)"
  },
  {
    "name": "model_support_matrix",
    "importPath": "arclm.model_support_matrix",
    "kind": "function",
    "category": "models",
    "status": "Stable",
    "signature": "model_support_matrix()",
    "summary": "Return the public model support table as JSON-safe rows.",
    "parameters": [],
    "returns": "List of model support rows.",
    "errors": [],
    "usage": "from arclm import model_support_matrix\n\nfor row in model_support_matrix():\n    print(row[\"Model\"], row[\"Status\"])"
  },
  {
    "name": "TrainingConfig",
    "importPath": "arclm.training.TrainingConfig",
    "kind": "class",
    "category": "training",
    "status": "Stable",
    "signature": "TrainingConfig(epochs=3, batch_size=8, learning_rate=2e-5, weight_decay=0.0, gradient_accumulation_steps=1, precision='fp32', output_dir='outputs', device=None, shuffle=True)",
    "summary": "Configuration for native training.",
    "parameters": [
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
    ],
    "returns": "TrainingConfig dataclass instance.",
    "errors": [
      "Invalid optimizer",
      "Invalid precision",
      "Invalid batch size"
    ],
    "usage": "from arclm.training import TrainingConfig\n\nconfig = TrainingConfig(epochs=1, batch_size=1, learning_rate=1e-3, device=\"cpu\")\nprint(config)"
  },
  {
    "name": "Trainer",
    "importPath": "arclm.training.Trainer",
    "kind": "class",
    "category": "training",
    "status": "Stable",
    "signature": "Trainer(model, optimizer=None, criterion=None, config=None, *, train_dataset=None, validation_dataset=None, callbacks=None, collate_fn=None)",
    "summary": "Canonical native training loop.",
    "parameters": [
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
    ],
    "returns": "Trainer object with train and checkpoint helpers.",
    "errors": [
      "Empty dataset",
      "Invalid device",
      "Checkpoint save failure"
    ],
    "usage": "from arclm.training import Trainer, TrainingConfig\n\nconfig = TrainingConfig(epochs=1, batch_size=1, device=\"cpu\")\n# trainer = Trainer(model=model, config=config, train_dataset=dataset)\n# trainer.train()"
  },
  {
    "name": "LoRAConfig",
    "importPath": "arclm.peft.LoRAConfig",
    "kind": "class",
    "category": "peft",
    "status": "Stable",
    "signature": "LoRAConfig(...)",
    "summary": "Configuration for native LoRA adapter experiments.",
    "parameters": [
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
    ],
    "returns": "LoRAConfig instance.",
    "errors": [
      "No matching linear modules",
      "Adapter shape mismatch"
    ],
    "usage": "from arclm.peft import LoRAConfig\n\nconfig = LoRAConfig(r=2, alpha=4, dropout=0.0)\nprint(config)"
  },
  {
    "name": "validate_sft_records",
    "importPath": "arclm.validate_sft_records",
    "kind": "function",
    "category": "training",
    "status": "Beta",
    "signature": "validate_sft_records(records, *, strict=True)",
    "summary": "Validate supervised fine-tuning records before formatting.",
    "parameters": [
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
    ],
    "returns": "SFT validation result with valid records and issues.",
    "errors": [
      "Missing instruction or response",
      "Empty completion",
      "Unsupported message shape"
    ],
    "usage": "from arclm import validate_sft_records\n\nrecords = [{\"instruction\": \"Explain ArcLM.\", \"response\": \"ArcLM is native-first.\"}]\nresult = validate_sft_records(records)\nprint(result.summary())"
  },
  {
    "name": "inspect_checkpoint",
    "importPath": "arclm.checkpoints.inspect_checkpoint",
    "kind": "function",
    "category": "checkpoints",
    "status": "Stable",
    "signature": "inspect_checkpoint(path, *, validate=False)",
    "summary": "Read safe checkpoint metadata and compatibility information.",
    "parameters": [
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
    ],
    "returns": "CheckpointInfo.",
    "errors": [
      "Checkpoint not found",
      "Unsupported checkpoint version",
      "Incompatible checkpoint"
    ],
    "usage": "from arclm.checkpoints import inspect_checkpoint\n\n# info = inspect_checkpoint(\"local-checkpoint-directory\")\n# print(info)"
  },
  {
    "name": "Evaluator",
    "importPath": "arclm.evaluation.Evaluator",
    "kind": "class",
    "category": "evaluation",
    "status": "Stable",
    "signature": "Evaluator(model, dataset=None, metrics=None, config=None, dataloader=None, callbacks=None, collate_fn=None, loss_fn=None)",
    "summary": "Evaluate a model with canonical metrics.",
    "parameters": [
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
    ],
    "returns": "EvaluationResult.",
    "errors": [
      "Empty evaluation data",
      "Metric not applicable",
      "Device mismatch"
    ],
    "usage": "from arclm.evaluation import Evaluator, LossMetric, Perplexity\n\n# evaluator = Evaluator(model, dataset=dataset, metrics=[LossMetric(), Perplexity()])\n# result = evaluator.evaluate()"
  },
  {
    "name": "build_evaluation_report",
    "importPath": "arclm.evaluation.build_evaluation_report",
    "kind": "function",
    "category": "evaluation",
    "status": "Stable",
    "signature": "build_evaluation_report(result, *, model=None, checkpoint_identity=None, dataset_identity=None, num_tokens=None, warnings=())",
    "summary": "Wrap evaluation metrics in a JSON-safe report.",
    "parameters": [
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
    ],
    "returns": "EvaluationReport.",
    "errors": [
      "Invalid result object"
    ],
    "usage": "from arclm.evaluation import EvaluationReport\n\nreport = EvaluationReport(metrics={\"loss\": 1.0}, num_examples=1, num_batches=1, num_tokens=None, model_identity=None, checkpoint_identity=None, dataset_identity=None, evaluation_timestamp=0.0, device=\"cpu\", dtype=\"float32\")\nprint(report.summary())"
  },
  {
    "name": "Generator",
    "importPath": "arclm.inference.Generator",
    "kind": "class",
    "category": "inference",
    "status": "Stable",
    "signature": "Generator(model, stoi, itos, block_size, device, tokenizer=None)",
    "summary": "Generate bounded text from a native model.",
    "parameters": [
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
    ],
    "returns": "Generated text from generate_string.",
    "errors": [
      "Empty prompt",
      "Context too long",
      "Invalid sampling options"
    ],
    "usage": "from arclm.inference import Generator\n\n# generator = Generator(model, tokenizer.stoi, tokenizer.itos, 8, \"cpu\", tokenizer=tokenizer)\n# print(generator.generate_string(\"Hello\", max_new_tokens=4))"
  },
  {
    "name": "inspect_text",
    "importPath": "arclm.inspect_text",
    "kind": "function",
    "category": "inspection",
    "status": "Beta",
    "signature": "inspect_text(*, model, tokenizer, text, max_new_tokens=1, temperature=1.0, repetition_penalty=1.0, top_k=None, top_p=None, include_values=False, max_values=20)",
    "summary": "Return a PipelineTrace for one native generation step.",
    "parameters": [
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
    ],
    "returns": "PipelineTrace.",
    "errors": [
      "Empty text",
      "Unsupported tokenizer",
      "Unsupported model"
    ],
    "usage": "from arclm import inspect_text\nfrom arclm.models import ArcLM\nfrom arclm.tokenizers import Tokenizer\n\ntokenizer = Tokenizer(max_vocab=16)\ntokenizer.build(\"Hello ArcLM\")\nmodel = ArcLM(vocab_size=tokenizer.get_vocab_size(), embed_dim=8, block_size=8, num_blocks=1)\ntrace = inspect_text(model=model, tokenizer=tokenizer, text=\"Hello\")\nprint(trace.to_dict())"
  },
  {
    "name": "WebConfig",
    "importPath": "arclm.web.WebConfig",
    "kind": "class",
    "category": "web",
    "status": "Beta",
    "signature": "WebConfig(host='127.0.0.1', port=8765, workspace_root='workspace', expose_docs=True, ...)",
    "summary": "Configuration for the optional local Web API.",
    "parameters": [
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
    ],
    "returns": "WebConfig instance.",
    "errors": [
      "Unsafe origin",
      "Invalid port",
      "Invalid workspace root"
    ],
    "usage": "from arclm.web import WebConfig, create_app\n\nconfig = WebConfig(host=\"127.0.0.1\", port=8765)\napp = create_app(config)"
  }
];
