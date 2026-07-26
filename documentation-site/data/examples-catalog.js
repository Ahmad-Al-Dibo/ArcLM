window.ARCLM_EXAMPLES = {
  "examples": [
    {
      "id": "load-python-records",
      "title": "Load Python records",
      "difficulty": "Beginner",
      "tags": [
        "Dataset"
      ],
      "runtime": "Instant",
      "device": "CPU",
      "optionalDependencies": [],
      "teaches": "How to start from in-memory data.",
      "download": "assets/examples/load-python-records.py",
      "code": "from arclm.datasets import load_dataset\n\nrecords = load_dataset([{\"text\": \"ArcLM trains locally.\"}])\nprint(records)"
    },
    {
      "id": "word-tokenizer",
      "title": "Create and inspect a Word tokenizer",
      "difficulty": "Beginner",
      "tags": [
        "Tokenizer"
      ],
      "runtime": "Instant",
      "device": "CPU",
      "optionalDependencies": [],
      "teaches": "Vocabulary, token IDs and decoding.",
      "download": "assets/examples/word-tokenizer.py",
      "code": "from arclm.tokenizers import Tokenizer\n\ntokenizer = Tokenizer(max_vocab=32)\ntokenizer.build(\"ArcLM trains locally\")\nids = tokenizer.encode_text(\"ArcLM locally\")\nprint(ids)\nprint(tokenizer.decode(ids))"
    },
    {
      "id": "tiny-native-model",
      "title": "Create a tiny native model",
      "difficulty": "Beginner",
      "tags": [
        "Model"
      ],
      "runtime": "Instant",
      "device": "CPU",
      "optionalDependencies": [],
      "teaches": "Native ArcLM model configuration.",
      "download": "assets/examples/tiny-native-model.py",
      "code": "from arclm.models import ArcLM\n\nmodel = ArcLM(vocab_size=32, embed_dim=16, block_size=8, num_blocks=1)\nprint(model.__class__.__name__)"
    },
    {
      "id": "pipeline-inspection",
      "title": "Inspect a native pipeline step",
      "difficulty": "Beginner",
      "tags": [
        "Inspection",
        "Generation"
      ],
      "runtime": "Instant",
      "device": "CPU",
      "optionalDependencies": [],
      "teaches": "Tokens, tensor shapes, selected token and decoded text.",
      "download": "assets/examples/pipeline-inspection.py",
      "code": "from arclm import inspect_text\nfrom arclm.models import ArcLM\nfrom arclm.tokenizers import Tokenizer\n\ntokenizer = Tokenizer(max_vocab=32)\ntokenizer.build(\"Hello ArcLM\")\nmodel = ArcLM(vocab_size=tokenizer.get_vocab_size(), embed_dim=8, block_size=8, num_blocks=1)\ntrace = inspect_text(model=model, tokenizer=tokenizer, text=\"Hello\")\nprint(trace.summary())"
    },
    {
      "id": "validate-sft",
      "title": "Validate instruction records",
      "difficulty": "Beginner",
      "tags": [
        "Fine-Tuning"
      ],
      "runtime": "Instant",
      "device": "CPU",
      "optionalDependencies": [],
      "teaches": "SFT record contract.",
      "download": "assets/examples/validate-sft.py",
      "code": "from arclm import validate_sft_records\n\nrecords = [{\"instruction\": \"Explain ArcLM.\", \"response\": \"ArcLM is native-first.\"}]\nresult = validate_sft_records(records)\nprint(result.summary())"
    },
    {
      "id": "evaluation-report",
      "title": "Create an evaluation report object",
      "difficulty": "Intermediate",
      "tags": [
        "Evaluation"
      ],
      "runtime": "Instant",
      "device": "CPU",
      "optionalDependencies": [],
      "teaches": "JSON-safe evaluation report shape.",
      "download": "assets/examples/evaluation-report.py",
      "code": "from arclm.evaluation import EvaluationReport\n\nreport = EvaluationReport(metrics={\"loss\": 1.0}, num_examples=1, num_batches=1, num_tokens=None, model_identity=None, checkpoint_identity=None, dataset_identity=None, evaluation_timestamp=0.0, device=\"cpu\", dtype=\"float32\")\nprint(report.to_json())"
    },
    {
      "id": "dataset-report",
      "title": "Build a dataset report",
      "difficulty": "Beginner",
      "tags": [
        "Dataset",
        "Tokenizer"
      ],
      "runtime": "Instant",
      "device": "CPU",
      "optionalDependencies": [],
      "teaches": "Record counts, text lengths and token statistics.",
      "download": "assets/examples/dataset-report.py",
      "code": "from arclm import build_dataset_report\nfrom arclm.tokenizers import Tokenizer\n\nrecords = [{\"text\": \"ArcLM keeps data local.\"}]\ntokenizer = Tokenizer(max_vocab=16)\ntokenizer.build(records[0][\"text\"])\nreport = build_dataset_report(records, tokenizer=tokenizer)\nprint(report.summary())"
    },
    {
      "id": "model-support-matrix",
      "title": "Read the model support matrix",
      "difficulty": "Beginner",
      "tags": [
        "Model"
      ],
      "runtime": "Instant",
      "device": "CPU",
      "optionalDependencies": [],
      "teaches": "Honest native, compatible and experimental model status.",
      "download": "assets/examples/model-support-matrix.py",
      "code": "from arclm import model_support_matrix\n\nfor row in model_support_matrix():\n    print(row[\"Model\"], row[\"Status\"])"
    },
    {
      "id": "verified-examples-runner",
      "title": "Run the verified examples suite",
      "difficulty": "Beginner",
      "tags": [
        "Examples",
        "Verification"
      ],
      "runtime": "CPU",
      "device": "CPU",
      "optionalDependencies": [],
      "teaches": "How to list, run and verify the maintained numbered examples.",
      "download": "../examples/run_examples.py",
      "code": "import arclm\nfrom pathlib import Path\n\nmanifest = Path(\"examples/manifest.json\")\nrunner = Path(\"examples/run_examples.py\")\nprint(arclm.__version__)\nprint(manifest.exists(), runner.exists())"
    },
    {
      "id": "security-core-example",
      "title": "Inspect Security Core status",
      "difficulty": "Beginner",
      "tags": [
        "Security"
      ],
      "runtime": "Instant",
      "device": "CPU",
      "optionalDependencies": [
        "security"
      ],
      "teaches": "Security status, crypto availability and safe defaults.",
      "download": "../examples/11_security/01_security_status.py",
      "code": "from arclm.security import security_status\n\nstatus = security_status()\nprint(status.mode)"
    },
    {
      "id": "agent-tool-example",
      "title": "Run a deterministic custom-tool agent",
      "difficulty": "Beginner",
      "tags": [
        "Agents",
        "Tools"
      ],
      "runtime": "Instant",
      "device": "CPU",
      "optionalDependencies": [],
      "teaches": "Provider-independent agent loop with a typed local tool.",
      "download": "../examples/10_agents_tools/01_custom_tool_agent.py",
      "code": "from arclm.agents import Agent, AgentRunner\n\nprint(Agent.__name__)\nprint(AgentRunner.__name__)"
    }
  ],
  "projects": [
    {
      "id": "tiny-text-model",
      "title": "Tiny text model",
      "difficulty": "Beginner",
      "goal": "Train a tiny local causal LM on synthetic text.",
      "files": [
        "data.jsonl",
        "train.py",
        "evaluate.py",
        "generate.py",
        "configuration.json"
      ],
      "dataset": "Short synthetic causal text records.",
      "tokenizer": "Native word tokenizer.",
      "modelConfiguration": "Small vocabulary, embed_dim 16, block_size 8, one block.",
      "trainingConfiguration": "CPU, one epoch, batch size 1.",
      "expectedOutput": "A checkpoint directory and short generated text.",
      "download": "assets/examples/tiny-text-model/train.py"
    },
    {
      "id": "instruction-finetuning",
      "title": "Instruction fine-tuning project",
      "difficulty": "Intermediate",
      "goal": "Validate instruction/response records and prepare an SFT workflow.",
      "files": [
        "instructions.jsonl",
        "validate.py",
        "configuration.json"
      ],
      "dataset": "Synthetic instruction/response JSONL.",
      "tokenizer": "Native word tokenizer for tiny data.",
      "modelConfiguration": "Native ArcLM tiny causal LM.",
      "trainingConfiguration": "CPU-friendly SFT settings.",
      "expectedOutput": "Validation summary and prepared records.",
      "download": "assets/examples/instruction-finetuning/validate.py"
    },
    {
      "id": "pipeline-inspection-project",
      "title": "Pipeline inspection project",
      "difficulty": "Beginner",
      "goal": "Show token IDs, tensor shapes and selected token from one native step.",
      "files": [
        "inspect.py",
        "configuration.json"
      ],
      "dataset": "Inline text.",
      "tokenizer": "Native word tokenizer.",
      "modelConfiguration": "Tiny ArcLM model.",
      "trainingConfiguration": "No training required.",
      "expectedOutput": "PipelineTrace summary and JSON-safe dictionary.",
      "download": "assets/examples/pipeline-inspection-project/inspect.py"
    },
    {
      "id": "local-language-model-project",
      "title": "Local language model project",
      "difficulty": "Beginner",
      "goal": "Run the maintained complete project that trains, checkpoints, evaluates and generates with a tiny native model.",
      "files": [
        "main.py",
        "README.md"
      ],
      "dataset": "Synthetic local text fixture.",
      "tokenizer": "Native word tokenizer.",
      "modelConfiguration": "Tiny native ArcLM causal LM.",
      "trainingConfiguration": "One CPU optimization step.",
      "expectedOutput": "JSON summary with checkpoint, loss, perplexity and generated text.",
      "download": "../examples/12_complete_projects/01_local_language_model/main.py"
    },
    {
      "id": "secure-local-ai-workspace-project",
      "title": "Secure local AI workspace",
      "difficulty": "Intermediate",
      "goal": "Exercise Security Core encryption, signed manifests and redaction with local artifacts.",
      "files": [
        "main.py",
        "README.md"
      ],
      "dataset": "Synthetic local metadata.",
      "tokenizer": "Not required.",
      "modelConfiguration": "Not required.",
      "trainingConfiguration": "No training required.",
      "expectedOutput": "JSON summary with decrypted payload, manifest verification and redacted trace.",
      "download": "../examples/12_complete_projects/06_secure_local_ai_workspace/main.py"
    }
  ]
};
