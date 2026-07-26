window.ARCLM_EXAMPLES = {
  "examples": [
    {
      "id": "00-01",
      "title": "First ArcLM workflow",
      "difficulty": "Beginner",
      "status": "verified",
      "category": "quick_start",
      "teaches": "First ArcLM workflow",
      "runtime": "about 10 seconds",
      "device": "CPU",
      "network": "not required",
      "downloadRequired": false,
      "optionalDependencies": [],
      "command": "python examples/run_examples.py run 00-01",
      "tags": [
        "Quick Start"
      ],
      "download": "assets/examples/current/00_quick_start/01_first_arclm_workflow.py",
      "code": "\"\"\"\nArcLM Example: First ArcLM Workflow\n\nThis example demonstrates loading records, building a tokenizer, creating a\ntiny native ArcLM model, and running one forward pass.\n\nRequirements:\n    pip install -e .\n\nRun:\n    python examples/00_quick_start/01_first_arclm_workflow.py\n\nExpected runtime:\n    Under 10 seconds on CPU.\n\"\"\"\n\nfrom __future__ import annotations\n\nimport torch\n\nfrom arclm.datasets import load_dataset\nfrom arclm.models import ArcLM\nfrom arclm.tokenizers import Tokenizer\n\nimport json\n\n\nDATA_RECORDS = [\n    {\"id\": \"doc-1\", \"text\": \"ArcLM loads local records for tiny experiments.\"},\n    {\"id\": \"doc-2\", \"text\": \"Tokenizers convert text into repeatable token ids.\"},\n    {\"id\": \"doc-3\", \"text\": \"Evaluation reports summarize local model behavior.\"},\n]\n\n\ndef print_json(value) -> None:\n    print(json.dumps(value, indent=2, sort_keys=True, default=str))\n\n\ndef main() -> None:\n    records = load_dataset(DATA_RECORDS)\n    text = \" \".join(row[\"text\"] for row in records)\n    tokenizer = Tokenizer(max_vocab=48)\n    tokenizer.build(text)\n    model = ArcLM(vocab_size=tokenizer.get_vocab_size(), embed_dim=16, block_size=8, num_blocks=1)\n    token_ids = tokenizer.encode_text(records[0][\"text\"])[:8]\n    logits = model(torch.tensor([token_ids], dtype=torch.long))\n    print_json(\n        {\n            \"records\": len(records),\n            \"vocab_size\": tokenizer.get_vocab_size(),\n            \"input_tokens\": len(token_ids),\n            \"logits_shape\": list(logits.shape),\n        }\n    )\n\n\nif __name__ == \"__main__\":\n    main()\n",
      "expectedOutput": "JSON or text summary printed by the example runner."
    },
    {
      "id": "00-02",
      "title": "Inspect one native text pass",
      "difficulty": "Beginner",
      "status": "verified",
      "category": "quick_start",
      "teaches": "Inspect one native text pass",
      "runtime": "about 10 seconds",
      "device": "CPU",
      "network": "not required",
      "downloadRequired": false,
      "optionalDependencies": [],
      "command": "python examples/run_examples.py run 00-02",
      "tags": [
        "Quick Start"
      ],
      "download": "assets/examples/current/00_quick_start/02_inspect_text.py",
      "code": "\"\"\"\nArcLM Example: Inspect Text Flow\n\nThis example demonstrates the canonical `inspect_text` pipeline trace for one\nnative generation step.\n\"\"\"\n\nfrom __future__ import annotations\n\nfrom arclm.inspection import inspect_text\nfrom arclm.models import ArcLM\nfrom arclm.tokenizers import Tokenizer\n\nimport json\n\n\nCORPUS = (\n    \"ArcLM trains tiny native language models on local data. \"\n    \"Local examples stay small bounded and inspectable.\"\n)\n\n\ndef print_json(value) -> None:\n    print(json.dumps(value, indent=2, sort_keys=True, default=str))\n\n\ndef main() -> None:\n    tokenizer = Tokenizer(max_vocab=48)\n    tokenizer.build(CORPUS)\n    model = ArcLM(vocab_size=tokenizer.get_vocab_size(), embed_dim=16, block_size=8, num_blocks=1)\n    trace = inspect_text(model=model, tokenizer=tokenizer, text=\"ArcLM trains\", include_values=False)\n    print_json(\n        {\n            \"tokens\": trace.tokens,\n            \"token_ids\": trace.token_ids,\n            \"input_shape\": trace.input_shape,\n            \"logits_shape\": trace.logits_shape,\n            \"attention_available\": trace.attention_available,\n        }\n    )\n\n\nif __name__ == \"__main__\":\n    main()\n",
      "expectedOutput": "JSON or text summary printed by the example runner."
    },
    {
      "id": "01-01",
      "title": "Load, validate, manifest, and report JSONL records",
      "difficulty": "Beginner",
      "status": "verified",
      "category": "data",
      "teaches": "Load, validate, manifest, and report JSONL records",
      "runtime": "about 10 seconds",
      "device": "CPU",
      "network": "not required",
      "downloadRequired": false,
      "optionalDependencies": [],
      "command": "python examples/run_examples.py run 01-01",
      "tags": [
        "Data"
      ],
      "download": "assets/examples/current/01_data/01_load_validate_report.py",
      "code": "\"\"\"\nArcLM Example: Load, Validate, and Report Data\n\nThis example demonstrates local records, schema validation, a dataset manifest,\nand a tokenizer-aware report.\n\"\"\"\n\nfrom __future__ import annotations\n\nimport json\nfrom pathlib import Path\n\nfrom arclm.datasets import build_dataset_report, create_dataset_manifest, validate_records\nfrom arclm.tokenizers import Tokenizer\n\n\ndef asset_path(*parts: str) -> Path:\n    return Path(__file__).resolve().parents[1] / \"assets\" / Path(*parts)\n\n\ndef print_json(value) -> None:\n    print(json.dumps(value, indent=2, sort_keys=True, default=str))\n\n\ndef main() -> None:\n    rows = [\n        json.loads(line)\n        for line in asset_path(\"datasets\", \"tiny_records.jsonl\").read_text(encoding=\"utf-8\").splitlines()\n        if line.strip()\n    ]\n    validation = validate_records(rows, required_fields=(\"id\", \"text\"), strict=False)\n    tokenizer = Tokenizer(max_vocab=64)\n    tokenizer.build(\" \".join(row[\"text\"] for row in validation.valid_records))\n    manifest = create_dataset_manifest(\n        dataset_name=\"tiny_records\",\n        source_type=\"jsonl\",\n        records_before=len(rows),\n        records_after=validation.valid_count,\n        validation_result=validation,\n        text_fields=(\"text\",),\n    )\n    report = build_dataset_report(validation.valid_records, tokenizer=tokenizer, text_fields=(\"text\",), validation_result=validation, manifest=manifest)\n    print_json({\"validation\": validation.to_dict(), \"report\": report.to_dict()})\n\n\nif __name__ == \"__main__\":\n    main()\n",
      "expectedOutput": "JSON or text summary printed by the example runner."
    },
    {
      "id": "01-02",
      "title": "Turn a local HTML fixture into dataset records",
      "difficulty": "Beginner",
      "status": "verified",
      "category": "data",
      "teaches": "Turn a local HTML fixture into dataset records",
      "runtime": "about 10 seconds",
      "device": "CPU",
      "network": "not required",
      "downloadRequired": false,
      "optionalDependencies": [],
      "command": "python examples/run_examples.py run 01-02",
      "tags": [
        "Data",
        "Dataset"
      ],
      "download": "assets/examples/current/01_data/02_local_website_dataset.py",
      "code": "\"\"\"\nArcLM Example: Local Website Content Dataset\n\nThis example extracts text from a local HTML fixture and turns it into dataset\nrecords without using network access.\n\"\"\"\n\nfrom __future__ import annotations\n\nimport json\nfrom html.parser import HTMLParser\nfrom pathlib import Path\n\nfrom arclm.datasets import build_dataset_report, validate_records\nfrom arclm.tokenizers import Tokenizer\n\n\ndef asset_path(*parts: str) -> Path:\n    return Path(__file__).resolve().parents[1] / \"assets\" / Path(*parts)\n\n\ndef print_json(value) -> None:\n    print(json.dumps(value, indent=2, sort_keys=True, default=str))\n\n\nclass TextExtractor(HTMLParser):\n    def __init__(self) -> None:\n        super().__init__()\n        self.skip = False\n        self.parts: list[str] = []\n\n    def handle_starttag(self, tag, attrs):\n        self.skip = tag in {\"nav\", \"footer\", \"script\", \"style\"}\n\n    def handle_endtag(self, tag):\n        if tag in {\"nav\", \"footer\", \"script\", \"style\"}:\n            self.skip = False\n\n    def handle_data(self, data):\n        text = \" \".join(data.split())\n        if text and not self.skip:\n            self.parts.append(text)\n\n\ndef main() -> None:\n    html = asset_path(\"websites\", \"product_page.html\").read_text(encoding=\"utf-8\")\n    parser = TextExtractor()\n    parser.feed(html)\n    records = [{\"id\": f\"web-{index}\", \"text\": text} for index, text in enumerate(parser.parts, start=1)]\n    validation = validate_records(records, required_fields=(\"id\", \"text\"), strict=False)\n    tokenizer = Tokenizer(max_vocab=64)\n    tokenizer.build(\" \".join(row[\"text\"] for row in validation.valid_records))\n    report = build_dataset_report(validation.valid_records, tokenizer=tokenizer, text_fields=(\"text\",), validation_result=validation)\n    print_json({\"records\": validation.valid_count, \"tokens\": report.token_count, \"texts\": [row[\"text\"] for row in validation.valid_records]})\n\n\nif __name__ == \"__main__\":\n    main()\n",
      "expectedOutput": "JSON or text summary printed by the example runner."
    },
    {
      "id": "02-01",
      "title": "Build and inspect a word tokenizer",
      "difficulty": "Beginner",
      "status": "verified",
      "category": "tokenizers",
      "teaches": "Build and inspect a word tokenizer",
      "runtime": "about 10 seconds",
      "device": "CPU",
      "network": "not required",
      "downloadRequired": false,
      "optionalDependencies": [],
      "command": "python examples/run_examples.py run 02-01",
      "tags": [
        "Tokenizer",
        "Tokenizers"
      ],
      "download": "assets/examples/current/02_tokenizers/01_word_tokenizer.py",
      "code": "\"\"\"\nArcLM Example: Word Tokenizer\n\nThis example builds, saves, reloads, and measures coverage for the native word\ntokenizer.\n\"\"\"\n\nfrom __future__ import annotations\n\nimport json\nimport tempfile\n\nfrom arclm.tokenizers import Tokenizer\n\n\nCORPUS = (\n    \"ArcLM trains tiny native language models on local data. \"\n    \"Local examples stay small bounded and inspectable.\"\n)\n\n\ndef print_json(value) -> None:\n    print(json.dumps(value, indent=2, sort_keys=True, default=str))\n\n\ndef main() -> None:\n    tokenizer = Tokenizer(max_vocab=32, user_defined_symbols=[\"<task>\"])\n    tokenizer.build(CORPUS)\n    ids = tokenizer.encode_text(\"ArcLM local unknown-token\")\n    with tempfile.TemporaryDirectory(prefix=\"arclm-tokenizer-\") as tmpdir:\n        from pathlib import Path\n\n        tmp = Path(tmpdir)\n        path = tmp / \"tokenizer.json\"\n        tokenizer.save(path)\n        reloaded = Tokenizer.from_json(json.loads(path.read_text(encoding=\"utf-8\")))\n        print_json(\n            {\n                \"vocab_size\": tokenizer.get_vocab_size(),\n                \"ids\": ids,\n                \"decoded\": reloaded.decode_string(ids),\n                \"unknown_rate\": tokenizer.analyze_coverage(\"ArcLM local unknown-token\".split())[\"unknown_rate\"],\n            }\n        )\n\n\nif __name__ == \"__main__\":\n    main()\n",
      "expectedOutput": "JSON or text summary printed by the example runner."
    },
    {
      "id": "02-02",
      "title": "Train a tiny SentencePiece BPE tokenizer",
      "difficulty": "Beginner",
      "status": "verified",
      "category": "tokenizers",
      "teaches": "Train a tiny SentencePiece BPE tokenizer",
      "runtime": "about 10 seconds",
      "device": "CPU",
      "network": "not required",
      "downloadRequired": false,
      "optionalDependencies": [],
      "command": "python examples/run_examples.py run 02-02",
      "tags": [
        "Tokenizer",
        "Tokenizers"
      ],
      "download": "assets/examples/current/02_tokenizers/02_sentencepiece_bpe.py",
      "code": "\"\"\"\nArcLM Example: SentencePiece BPE\n\nThis example trains a tiny local SentencePiece BPE tokenizer without downloads.\n\"\"\"\n\nfrom __future__ import annotations\n\nimport json\n\nfrom arclm.tokenizers import SentencePieceTokenizer\n\n\nCORPUS = (\n    \"ArcLM trains tiny native language models on local data. \"\n    \"Local examples stay small bounded and inspectable.\"\n)\n\n\ndef print_json(value) -> None:\n    print(json.dumps(value, indent=2, sort_keys=True, default=str))\n\n\ndef main() -> None:\n    tokenizer = SentencePieceTokenizer(max_vocab=32, model_type=\"bpe\")\n    tokenizer.build(CORPUS)\n    ids = tokenizer.encode_text(\"ArcLM local tokenization\")\n    print_json({\"vocab_size\": tokenizer.get_vocab_size(), \"ids\": ids, \"decoded\": tokenizer.decode_string(ids)})\n\n\nif __name__ == \"__main__\":\n    main()\n",
      "expectedOutput": "JSON or text summary printed by the example runner."
    },
    {
      "id": "03-01",
      "title": "Create a tiny native ArcLM model",
      "difficulty": "Beginner",
      "status": "verified",
      "category": "models",
      "teaches": "Create a tiny native ArcLM model",
      "runtime": "about 10 seconds",
      "device": "CPU",
      "network": "not required",
      "downloadRequired": false,
      "optionalDependencies": [],
      "command": "python examples/run_examples.py run 03-01",
      "tags": [
        "Model",
        "Models"
      ],
      "download": "assets/examples/current/03_models/01_create_tiny_model.py",
      "code": "\"\"\"\nArcLM Example: Create a Tiny Native Model\n\nThis example creates a native ArcLM model and runs a shape-checked forward pass.\n\"\"\"\n\nfrom __future__ import annotations\n\nimport json\nimport torch\n\nfrom arclm.models import ArcLM, model_support_matrix\n\n\ndef print_json(value) -> None:\n    print(json.dumps(value, indent=2, sort_keys=True, default=str))\n\n\ndef main() -> None:\n    model = ArcLM(vocab_size=24, embed_dim=16, block_size=8, num_blocks=1)\n    logits = model(torch.randint(0, 24, (2, 8)))\n    parameters = sum(param.numel() for param in model.parameters())\n    print_json({\"model_class\": type(model).__name__, \"parameters\": parameters, \"logits_shape\": list(logits.shape), \"support_rows\": len(model_support_matrix())})\n\n\nif __name__ == \"__main__\":\n    main()\n",
      "expectedOutput": "JSON or text summary printed by the example runner."
    },
    {
      "id": "03-02",
      "title": "Save and reload a native model state dict",
      "difficulty": "Beginner",
      "status": "verified",
      "category": "models",
      "teaches": "Save and reload a native model state dict",
      "runtime": "about 10 seconds",
      "device": "CPU",
      "network": "not required",
      "downloadRequired": false,
      "optionalDependencies": [],
      "command": "python examples/run_examples.py run 03-02",
      "tags": [
        "Model",
        "Models"
      ],
      "download": "assets/examples/current/03_models/02_save_and_load_state.py",
      "code": "\"\"\"\nArcLM Example: Save and Load Local Model State\n\nThis example saves a native ArcLM state dict to a temporary directory and\nreloads it into a model with the same configuration.\n\"\"\"\n\nfrom __future__ import annotations\n\nimport json\nimport tempfile\nfrom pathlib import Path\n\nimport torch\n\nfrom arclm.models import ArcLM\n\n\ndef print_json(value) -> None:\n    print(json.dumps(value, indent=2, sort_keys=True, default=str))\n\n\ndef main() -> None:\n    model = ArcLM(vocab_size=16, embed_dim=8, block_size=4, num_blocks=1)\n    with tempfile.TemporaryDirectory(prefix=\"arclm-model-state-\") as tmpdir:\n        tmp = Path(tmpdir)\n        path = tmp / \"weights.pt\"\n        torch.save(model.state_dict(), path)\n        reloaded = ArcLM(vocab_size=16, embed_dim=8, block_size=4, num_blocks=1)\n        reloaded.load_state_dict(torch.load(path, map_location=\"cpu\", weights_only=True))\n        reloaded.eval()\n        print_json({\"saved_name\": path.name, \"training_mode\": reloaded.training, \"parameters\": sum(p.numel() for p in reloaded.parameters())})\n\n\nif __name__ == \"__main__\":\n    main()\n",
      "expectedOutput": "JSON or text summary printed by the example runner."
    },
    {
      "id": "04-01",
      "title": "Run one CPU pretraining optimization step",
      "difficulty": "Intermediate",
      "status": "verified",
      "category": "training",
      "teaches": "Run one CPU pretraining optimization step",
      "runtime": "about 10 seconds",
      "device": "CPU",
      "network": "not required",
      "downloadRequired": false,
      "optionalDependencies": [],
      "command": "python examples/run_examples.py run 04-01",
      "tags": [
        "Training"
      ],
      "download": "assets/examples/current/04_training/01_tiny_pretraining_step.py",
      "code": "\"\"\"\nArcLM Example: Tiny Pre-Training Step\n\nThis example performs one CPU next-token training step on synthetic local text.\n\"\"\"\n\nfrom __future__ import annotations\n\nimport json\nimport torch\n\nfrom arclm.models import ArcLM\nfrom arclm.tokenizers import Tokenizer\n\n\nCORPUS = (\n    \"ArcLM trains tiny native language models on local data. \"\n    \"Local examples stay small bounded and inspectable. \"\n    \"Tiny models help developers understand tokenization training evaluation generation.\"\n)\n\n\ndef print_json(value) -> None:\n    print(json.dumps(value, indent=2, sort_keys=True, default=str))\n\n\ndef main() -> None:\n    torch.manual_seed(7)\n    tokenizer = Tokenizer(max_vocab=48)\n    tokenizer.build(CORPUS)\n    ids = tokenizer.encode_text(CORPUS)\n    block_size = 8\n    x = torch.tensor([ids[:block_size]], dtype=torch.long)\n    y = torch.tensor([ids[1 : block_size + 1]], dtype=torch.long)\n    model = ArcLM(vocab_size=tokenizer.get_vocab_size(), embed_dim=16, block_size=block_size, num_blocks=1)\n    optimizer = torch.optim.AdamW(model.parameters(), lr=1e-2)\n    logits = model(x)\n    first_loss = torch.nn.functional.cross_entropy(logits.reshape(-1, logits.size(-1)), y.reshape(-1))\n    first_loss.backward()\n    optimizer.step()\n    optimizer.zero_grad()\n    second_logits = model(x)\n    second_loss = torch.nn.functional.cross_entropy(second_logits.reshape(-1, second_logits.size(-1)), y.reshape(-1))\n    print_json({\"initial_loss\": round(float(first_loss.detach()), 4), \"after_one_step_loss\": round(float(second_loss.detach()), 4), \"tokens\": len(ids)})\n\n\nif __name__ == \"__main__\":\n    main()\n",
      "expectedOutput": "JSON or text summary printed by the example runner."
    },
    {
      "id": "05-01",
      "title": "Preview validated SFT records",
      "difficulty": "Intermediate",
      "status": "verified",
      "category": "finetuning",
      "teaches": "Preview validated SFT records",
      "runtime": "about 10 seconds",
      "device": "CPU",
      "network": "not required",
      "downloadRequired": false,
      "optionalDependencies": [],
      "command": "python examples/run_examples.py run 05-01",
      "tags": [
        "Finetuning"
      ],
      "download": "assets/examples/current/05_finetuning/01_preview_sft_data.py",
      "code": "\"\"\"\nArcLM Example: Preview SFT Data\n\nThis example uses the canonical fine-tuning preparation path to preview tokens\nand response-only labels.\n\"\"\"\n\nfrom __future__ import annotations\n\nimport json\n\nfrom arclm.finetuning import FineTuningConfig, prepare_fine_tuning_record, validate_sft_records\nfrom arclm.tokenizers import Tokenizer\n\n\nCORPUS = \"ArcLM is a compact local toolkit. Tiny examples are fast and safe.\"\nSFT_RECORDS = [\n    {\"instruction\": \"What is ArcLM?\", \"response\": \"ArcLM is a compact local language-model toolkit.\"},\n    {\"instruction\": \"Why use tiny examples?\", \"response\": \"Tiny examples are fast, inspectable, and safe.\"},\n]\n\n\ndef print_json(value) -> None:\n    print(json.dumps(value, indent=2, sort_keys=True, default=str))\n\n\ndef main() -> None:\n    tokenizer = Tokenizer(max_vocab=64)\n    tokenizer.build(CORPUS + \" \" + \" \".join(row[\"instruction\"] + \" \" + row[\"response\"] for row in SFT_RECORDS))\n    config = FineTuningConfig(max_sequence_length=32, train_on_prompt=False)\n    validation = validate_sft_records(SFT_RECORDS, config, strict=False)\n    prepared = prepare_fine_tuning_record(SFT_RECORDS[0], tokenizer, config)\n    print_json({\"valid_records\": validation.valid_count, \"formatted_text\": prepared.formatted_text, \"label_mask\": prepared.label_mask, \"sequence_length\": prepared.sequence_length})\n\n\nif __name__ == \"__main__\":\n    main()\n",
      "expectedOutput": "JSON or text summary printed by the example runner."
    },
    {
      "id": "05-02",
      "title": "Run one tiny supervised fine-tuning step",
      "difficulty": "Intermediate",
      "status": "verified",
      "category": "finetuning",
      "teaches": "Run one tiny supervised fine-tuning step",
      "runtime": "about 10 seconds",
      "device": "CPU",
      "network": "not required",
      "downloadRequired": false,
      "optionalDependencies": [],
      "command": "python examples/run_examples.py run 05-02",
      "tags": [
        "Fine-Tuning",
        "Finetuning"
      ],
      "download": "assets/examples/current/05_finetuning/02_tiny_sft_step.py",
      "code": "\"\"\"\nArcLM Example: Tiny SFT Step\n\nThis example prepares instruction records with ArcLM's SFT workflow and runs\none tiny response-label training step.\n\"\"\"\n\nfrom __future__ import annotations\n\nimport json\nimport torch\n\nfrom arclm.finetuning import FineTuningConfig, prepare_fine_tuning_dataset\nfrom arclm.models import ArcLM\nfrom arclm.tokenizers import Tokenizer\n\n\nCORPUS = \"ArcLM is a compact local toolkit. Tiny examples are fast and safe.\"\nSFT_RECORDS = [\n    {\"instruction\": \"What is ArcLM?\", \"response\": \"ArcLM is a compact local language-model toolkit.\"},\n    {\"instruction\": \"Why use tiny examples?\", \"response\": \"Tiny examples are fast, inspectable, and safe.\"},\n]\n\n\ndef print_json(value) -> None:\n    print(json.dumps(value, indent=2, sort_keys=True, default=str))\n\n\ndef main() -> None:\n    torch.manual_seed(11)\n    tokenizer = Tokenizer(max_vocab=64)\n    tokenizer.build(CORPUS + \" \" + \" \".join(row[\"instruction\"] + \" \" + row[\"response\"] for row in SFT_RECORDS))\n    config = FineTuningConfig(max_sequence_length=32, train_on_prompt=False)\n    dataset = prepare_fine_tuning_dataset(SFT_RECORDS, tokenizer, config)\n    feature = dataset[0]\n    x = torch.tensor([feature[\"input_ids\"]], dtype=torch.long)\n    labels = torch.tensor([feature[\"labels\"]], dtype=torch.long)\n    model = ArcLM(vocab_size=tokenizer.get_vocab_size(), embed_dim=16, block_size=max(len(feature[\"input_ids\"]), 4), num_blocks=1)\n    optimizer = torch.optim.AdamW(model.parameters(), lr=1e-2)\n    logits = model(x)\n    loss = torch.nn.functional.cross_entropy(logits.reshape(-1, logits.size(-1)), labels.reshape(-1), ignore_index=config.ignore_index)\n    loss.backward()\n    optimizer.step()\n    print_json({\"records_valid\": dataset.report.records_valid, \"trainable_tokens\": dataset.report.trainable_tokens, \"loss\": round(float(loss.detach()), 4)})\n\n\nif __name__ == \"__main__\":\n    main()\n",
      "expectedOutput": "JSON or text summary printed by the example runner."
    },
    {
      "id": "05-03",
      "title": "PEFT and QLoRA real adapter training boundary",
      "difficulty": "Intermediate",
      "status": "manual_optional",
      "category": "finetuning",
      "teaches": "PEFT and QLoRA real adapter training boundary",
      "runtime": "about None seconds",
      "device": "GPU",
      "network": "not required",
      "downloadRequired": false,
      "optionalDependencies": [
        "peft",
        "qlora",
        "hf"
      ],
      "command": "python examples/run_examples.py run 05-03",
      "tags": [
        "Finetuning",
        "Training"
      ],
      "download": "assets/examples/current/05-03.py",
      "code": "import arclm\n\n# Manual optional example: PEFT and QLoRA real adapter training boundary\nprint(arclm.__version__)",
      "expectedOutput": "JSON or text summary printed by the example runner."
    },
    {
      "id": "06-01",
      "title": "Save, load, and inspect a training checkpoint",
      "difficulty": "Intermediate",
      "status": "verified",
      "category": "checkpoints",
      "teaches": "Save, load, and inspect a training checkpoint",
      "runtime": "about 10 seconds",
      "device": "CPU",
      "network": "not required",
      "downloadRequired": false,
      "optionalDependencies": [],
      "command": "python examples/run_examples.py run 06-01",
      "tags": [
        "Checkpoint",
        "Checkpoints",
        "Training"
      ],
      "download": "assets/examples/current/06_checkpoints/01_checkpoint_lifecycle.py",
      "code": "\"\"\"\nArcLM Example: Checkpoint Lifecycle\n\nThis example creates a minimal trusted training checkpoint, validates it, and\ninspects metadata without exposing absolute paths.\n\"\"\"\n\nfrom __future__ import annotations\n\nimport json\nimport tempfile\nfrom pathlib import Path\n\nimport torch\n\nfrom arclm.checkpoints.training import CHECKPOINT_FORMAT, CHECKPOINT_VERSION, atomic_save_checkpoint, inspect_checkpoint, safe_load_training_checkpoint\nfrom arclm.models import ArcLM\n\n\ndef print_json(value) -> None:\n    print(json.dumps(value, indent=2, sort_keys=True, default=str))\n\n\ndef main() -> None:\n    model = ArcLM(vocab_size=16, embed_dim=8, block_size=4, num_blocks=1)\n    payload = {\n        \"checkpoint_format\": CHECKPOINT_FORMAT,\n        \"checkpoint_version\": CHECKPOINT_VERSION,\n        \"model_state_dict\": model.state_dict(),\n        \"optimizer_state_dict\": {},\n        \"training_state\": {\"epoch\": 0, \"global_step\": 0, \"optimizer_step\": 0},\n        \"config\": {\"vocab_size\": 16, \"embed_dim\": 8, \"block_size\": 4, \"num_blocks\": 1},\n    }\n    with tempfile.TemporaryDirectory(prefix=\"arclm-checkpoint-\") as tmpdir:\n        tmp = Path(tmpdir)\n        path = atomic_save_checkpoint(payload, tmp / \"checkpoint\")\n        loaded = safe_load_training_checkpoint(path, map_location=torch.device(\"cpu\"))\n        info = inspect_checkpoint(path)\n        print_json({\"file\": path.name, \"format\": loaded[\"checkpoint_format\"], \"version\": loaded[\"checkpoint_version\"], \"has_model_state\": info.has_model_state})\n\n\nif __name__ == \"__main__\":\n    main()\n",
      "expectedOutput": "JSON or text summary printed by the example runner."
    },
    {
      "id": "07-01",
      "title": "Compute perplexity, accuracy, and top-k predictions",
      "difficulty": "Intermediate",
      "status": "verified",
      "category": "evaluation_benchmarks",
      "teaches": "Compute perplexity, accuracy, and top-k predictions",
      "runtime": "about 10 seconds",
      "device": "CPU",
      "network": "not required",
      "downloadRequired": false,
      "optionalDependencies": [],
      "command": "python examples/run_examples.py run 07-01",
      "tags": [
        "Evaluation Benchmarks"
      ],
      "download": "assets/examples/current/07_evaluation_benchmarks/01_evaluation_metrics.py",
      "code": "\"\"\"\nArcLM Example: Evaluation Metrics\n\nThis example calculates loss-derived perplexity, token accuracy, and top-k\npredictions from a tiny native model.\n\"\"\"\n\nfrom __future__ import annotations\n\nimport json\nimport torch\n\nfrom arclm.evaluation import Accuracy, calculate_perplexity, predict_top_k\nfrom arclm.models import ArcLM\nfrom arclm.tokenizers import Tokenizer\n\n\nCORPUS = \"ArcLM trains tiny native language models on local data.\"\n\n\ndef print_json(value) -> None:\n    print(json.dumps(value, indent=2, sort_keys=True, default=str))\n\n\ndef main() -> None:\n    tokenizer = Tokenizer(max_vocab=48)\n    tokenizer.build(CORPUS)\n    ids = tokenizer.encode_text(\"ArcLM trains tiny\")\n    model = ArcLM(vocab_size=tokenizer.get_vocab_size(), embed_dim=16, block_size=8, num_blocks=1)\n    logits = model(torch.tensor([ids], dtype=torch.long))\n    labels = torch.tensor([ids], dtype=torch.long)\n    metric = Accuracy()\n    metric.update(predictions=logits, targets=labels)\n    accuracy = metric.compute()\n    predictions = predict_top_k(model, tokenizer.stoi, tokenizer.itos, block_size=8, device=\"cpu\", prompt=\"ArcLM\", k=3, tokenizer=tokenizer)\n    print_json(\n        {\n            \"perplexity_from_loss_2\": round(calculate_perplexity(2.0), 4),\n            \"accuracy\": round(float(accuracy), 4),\n            \"top_k\": [\n                {\"rank\": item.rank, \"token\": item.token, \"probability\": round(float(item.probability), 4)}\n                for item in predictions\n            ],\n        }\n    )\n\n\nif __name__ == \"__main__\":\n    main()\n",
      "expectedOutput": "JSON or text summary printed by the example runner."
    },
    {
      "id": "08-01",
      "title": "Generate with greedy and sampled decoding",
      "difficulty": "Intermediate",
      "status": "verified",
      "category": "inference_local_models",
      "teaches": "Generate with greedy and sampled decoding",
      "runtime": "about 10 seconds",
      "device": "CPU",
      "network": "not required",
      "downloadRequired": false,
      "optionalDependencies": [],
      "command": "python examples/run_examples.py run 08-01",
      "tags": [
        "Inference Local Models"
      ],
      "download": "assets/examples/current/08_inference_local_models/01_generation_sampling.py",
      "code": "\"\"\"\nArcLM Example: Generation Sampling\n\nThis example demonstrates bounded local generation options with a tiny native\nmodel. The model is random, so output quality is not meaningful.\n\"\"\"\n\nfrom __future__ import annotations\n\nimport json\nimport torch\n\nfrom arclm.inference import Generator\nfrom arclm.models import ArcLM\nfrom arclm.tokenizers import Tokenizer\n\n\nCORPUS = \"ArcLM trains tiny native language models on local data.\"\n\n\ndef print_json(value) -> None:\n    print(json.dumps(value, indent=2, sort_keys=True, default=str))\n\n\ndef main() -> None:\n    torch.manual_seed(3)\n    tokenizer = Tokenizer(max_vocab=48)\n    tokenizer.build(CORPUS)\n    model = ArcLM(vocab_size=tokenizer.get_vocab_size(), embed_dim=16, block_size=8, num_blocks=1)\n    generator = Generator(model, tokenizer.stoi, tokenizer.itos, block_size=8, device=\"cpu\", tokenizer=tokenizer)\n    greedy = generator.generate_string(\"ArcLM\", max_new_tokens=3, temperature=1.0, top_k=1)\n    sampled = generator.generate_string(\"ArcLM\", max_new_tokens=3, temperature=0.8, top_k=5, top_p=0.9)\n    print_json({\"greedy\": greedy, \"sampled\": sampled, \"max_new_tokens\": 3})\n\n\nif __name__ == \"__main__\":\n    main()\n",
      "expectedOutput": "JSON or text summary printed by the example runner."
    },
    {
      "id": "08-02",
      "title": "Inspect external local-model loading policy",
      "difficulty": "Intermediate",
      "status": "verified",
      "category": "inference_local_models",
      "teaches": "Inspect external local-model loading policy",
      "runtime": "about 10 seconds",
      "device": "CPU",
      "network": "not required",
      "downloadRequired": false,
      "optionalDependencies": [],
      "command": "python examples/run_examples.py run 08-02",
      "tags": [
        "Inference Local Models",
        "Model"
      ],
      "download": "assets/examples/current/08_inference_local_models/02_external_local_model_status.py",
      "code": "\"\"\"\nArcLM Example: External Local Model Status\n\nThis example inspects a synthetic local model directory. It does not load or\ndownload external model weights.\n\"\"\"\n\nfrom __future__ import annotations\n\nimport json\nimport tempfile\nfrom pathlib import Path\n\nfrom arclm.inference import inspect_model_source\n\n\ndef print_json(value) -> None:\n    print(json.dumps(value, indent=2, sort_keys=True, default=str))\n\n\ndef main() -> None:\n    with tempfile.TemporaryDirectory(prefix=\"arclm-external-model-\") as tmpdir:\n        tmp = Path(tmpdir)\n        model_dir = tmp / \"local-hf-like\"\n        model_dir.mkdir()\n        (model_dir / \"config.json\").write_text('{\"model_type\":\"gpt2\"}', encoding=\"utf-8\")\n        (model_dir / \"model.safetensors\").write_text(\"\", encoding=\"utf-8\")\n        info = inspect_model_source(model_dir)\n        print_json({\"source_type\": info.source_type, \"weight_format\": info.weight_format, \"requires_real_weights_for_loading\": True})\n\n\nif __name__ == \"__main__\":\n    main()\n",
      "expectedOutput": "JSON or text summary printed by the example runner."
    },
    {
      "id": "08-03",
      "title": "Load a real external local Hugging Face model",
      "difficulty": "Intermediate",
      "status": "manual_optional",
      "category": "inference_local_models",
      "teaches": "Load a real external local Hugging Face model",
      "runtime": "about None seconds",
      "device": "CPU",
      "network": "not required",
      "downloadRequired": false,
      "optionalDependencies": [
        "hf"
      ],
      "command": "python examples/run_examples.py run 08-03",
      "tags": [
        "Inference Local Models",
        "Model"
      ],
      "download": "assets/examples/current/08-03.py",
      "code": "import arclm\n\n# Manual optional example: Load a real external local Hugging Face model\nprint(arclm.__version__)",
      "expectedOutput": "JSON or text summary printed by the example runner."
    },
    {
      "id": "09-01",
      "title": "Compose validation, deduplication, tokenization, and reporting",
      "difficulty": "Advanced",
      "status": "verified",
      "category": "pipelines_inspection",
      "teaches": "Compose validation, deduplication, tokenization, and reporting",
      "runtime": "about 10 seconds",
      "device": "CPU",
      "network": "not required",
      "downloadRequired": false,
      "optionalDependencies": [],
      "command": "python examples/run_examples.py run 09-01",
      "tags": [
        "Pipelines Inspection"
      ],
      "download": "assets/examples/current/09_pipelines_inspection/01_data_pipeline.py",
      "code": "\"\"\"\nArcLM Example: Data Pipeline\n\nThis example composes loading, validation, deduplication, tokenization, and a\ndataset report with real ArcLM utilities.\n\"\"\"\n\nfrom __future__ import annotations\n\nimport json\n\nfrom arclm.datasets import build_dataset_report, deduplicate, validate_records\nfrom arclm.tokenizers import Tokenizer\n\n\nDATA_RECORDS = [\n    {\"id\": \"doc-1\", \"text\": \"ArcLM loads local records for tiny experiments.\"},\n    {\"id\": \"doc-2\", \"text\": \"Tokenizers convert text into repeatable token ids.\"},\n    {\"id\": \"doc-3\", \"text\": \"Evaluation reports summarize local model behavior.\"},\n]\n\n\ndef print_json(value) -> None:\n    print(json.dumps(value, indent=2, sort_keys=True, default=str))\n\n\ndef main() -> None:\n    rows = DATA_RECORDS + [dict(DATA_RECORDS[0])]\n    validation = validate_records(rows, required_fields=(\"id\", \"text\"), strict=False)\n    dedupe_result = deduplicate(validation.valid_records, field=\"text\", return_result=True)\n    deduped = dedupe_result.dataset\n    tokenizer = Tokenizer(max_vocab=64)\n    tokenizer.build(\" \".join(row[\"text\"] for row in deduped))\n    report = build_dataset_report(deduped, tokenizer=tokenizer, text_fields=(\"text\",), validation_result=validation, duplicates_removed=len(rows) - len(deduped))\n    print_json(\n        {\n            \"input_records\": len(rows),\n            \"deduped_records\": len(deduped),\n            \"duplicates_removed\": dedupe_result.removed,\n            \"tokens\": report.token_count,\n        }\n    )\n\n\nif __name__ == \"__main__\":\n    main()\n",
      "expectedOutput": "JSON or text summary printed by the example runner."
    },
    {
      "id": "09-02",
      "title": "Inspect tensors and generated text from a native pass",
      "difficulty": "Advanced",
      "status": "verified",
      "category": "pipelines_inspection",
      "teaches": "Inspect tensors and generated text from a native pass",
      "runtime": "about 10 seconds",
      "device": "CPU",
      "network": "not required",
      "downloadRequired": false,
      "optionalDependencies": [],
      "command": "python examples/run_examples.py run 09-02",
      "tags": [
        "Pipelines Inspection"
      ],
      "download": "assets/examples/current/09_pipelines_inspection/02_pipeline_inspection.py",
      "code": "\"\"\"\nArcLM Example: Pipeline Inspection\n\nThis example reports the canonical ArcLM inspection trace for text, token IDs,\ninput shape, embedding shape, logits shape, selected token, and decoded output.\n\"\"\"\n\nfrom __future__ import annotations\n\nimport json\n\nfrom arclm.inspection import inspect_text\nfrom arclm.models import ArcLM\nfrom arclm.tokenizers import Tokenizer\n\n\nCORPUS = \"ArcLM trains tiny native language models on local data.\"\n\n\ndef print_json(value) -> None:\n    print(json.dumps(value, indent=2, sort_keys=True, default=str))\n\n\ndef main() -> None:\n    tokenizer = Tokenizer(max_vocab=48)\n    tokenizer.build(CORPUS)\n    model = ArcLM(vocab_size=tokenizer.get_vocab_size(), embed_dim=16, block_size=8, num_blocks=1)\n    trace = inspect_text(model=model, tokenizer=tokenizer, text=\"local examples\", include_values=True, max_values=4)\n    print_json(trace.to_dict())\n\n\nif __name__ == \"__main__\":\n    main()\n",
      "expectedOutput": "JSON or text summary printed by the example runner."
    },
    {
      "id": "10-01",
      "title": "Run a deterministic custom-tool agent",
      "difficulty": "Advanced",
      "status": "verified",
      "category": "agents_tools",
      "teaches": "Run a deterministic custom-tool agent",
      "runtime": "about 10 seconds",
      "device": "CPU",
      "network": "not required",
      "downloadRequired": false,
      "optionalDependencies": [],
      "command": "python examples/run_examples.py run 10-01",
      "tags": [
        "Agent",
        "Agents Tools"
      ],
      "download": "assets/examples/current/10_agents_tools/01_custom_tool_agent.py",
      "code": "\"\"\"\nArcLM Example: Custom Tool Agent\n\nThis example verifies a deterministic tool loop with a fake Agent model.\n\"\"\"\n\nfrom __future__ import annotations\n\nimport json\n\nfrom arclm.agents import Agent, AgentRunner, ModelResponse, ToolCall, tool\n\n\nclass OneToolThenDoneModel:\n    def __init__(self, tool_name: str, arguments: dict):\n        self.tool_name = tool_name\n        self.arguments = dict(arguments)\n        self.calls = 0\n\n    def generate_response(self, *, messages, tools, instructions, session):\n        self.calls += 1\n        if self.calls == 1:\n            return ModelResponse(tool_calls=[ToolCall(id=\"call_1\", name=self.tool_name, arguments=self.arguments)])\n        return ModelResponse(content=\"Done. The tool result was processed safely.\")\n\n\ndef print_json(value) -> None:\n    print(json.dumps(value, indent=2, sort_keys=True, default=str))\n\n\n@tool\ndef add_numbers(a: int, b: int) -> int:\n    \"\"\"Add two integers.\"\"\"\n    return a + b\n\n\ndef main() -> None:\n    agent = Agent(name=\"calculator\", instructions=\"Use tools when useful.\", model=OneToolThenDoneModel(\"add_numbers\", {\"a\": 2, \"b\": 5}), tools=[add_numbers])\n    result = AgentRunner(max_steps=2).run(agent, \"Add 2 and 5.\")\n    print_json({\"output\": result.output, \"tool_calls\": [call.name for call in result.session.tool_calls]})\n\n\nif __name__ == \"__main__\":\n    main()\n",
      "expectedOutput": "JSON or text summary printed by the example runner."
    },
    {
      "id": "10-02",
      "title": "Run a secure local document agent",
      "difficulty": "Advanced",
      "status": "verified",
      "category": "agents_tools",
      "teaches": "Run a secure local document agent",
      "runtime": "about 10 seconds",
      "device": "CPU",
      "network": "not required",
      "downloadRequired": false,
      "optionalDependencies": [],
      "command": "python examples/run_examples.py run 10-02",
      "tags": [
        "Agent",
        "Agents Tools"
      ],
      "download": "assets/examples/current/10_agents_tools/02_secure_document_agent.py",
      "code": "\"\"\"\nArcLM Example: Secure Document Agent\n\nThis example validates a document path, redacts sensitive text, and stores a\nbounded safe Agent trace.\n\"\"\"\n\nfrom __future__ import annotations\n\nimport json\nfrom pathlib import Path\n\nfrom arclm.agents import Agent, AgentRunner, ModelResponse, ToolCall, tool\nfrom arclm.security.paths import resolve_under_root\nfrom arclm.security.redaction import redact_sensitive_text\n\n\nclass OneToolThenDoneModel:\n    def __init__(self, tool_name: str, arguments: dict):\n        self.tool_name = tool_name\n        self.arguments = dict(arguments)\n        self.calls = 0\n\n    def generate_response(self, *, messages, tools, instructions, session):\n        self.calls += 1\n        if self.calls == 1:\n            return ModelResponse(tool_calls=[ToolCall(id=\"call_1\", name=self.tool_name, arguments=self.arguments)])\n        return ModelResponse(content=\"Done. The tool result was processed safely.\")\n\n\ndef asset_path(*parts: str) -> Path:\n    return Path(__file__).resolve().parents[1] / \"assets\" / Path(*parts)\n\n\ndef print_json(value) -> None:\n    print(json.dumps(value, indent=2, sort_keys=True, default=str))\n\n\n@tool\ndef read_safe_note(relative_path: str) -> str:\n    \"\"\"Read one allowed local note and redact likely secrets.\"\"\"\n    root = asset_path(\"documents\")\n    path = resolve_under_root(root, relative_path)\n    text = path.read_text(encoding=\"utf-8\")[:1000]\n    return redact_sensitive_text(text)\n\n\ndef main() -> None:\n    agent = Agent(name=\"document_agent\", instructions=\"Read only approved documents.\", model=OneToolThenDoneModel(\"read_safe_note\", {\"relative_path\": \"local_note.md\"}), tools=[read_safe_note])\n    result = AgentRunner(max_steps=2).run(agent, \"Summarize the note.\")\n    trace = result.session.to_json()\n    print_json({\"output\": result.output, \"redacted\": \"demo-secret\" not in trace, \"tool_calls\": len(result.session.tool_calls)})\n\n\nif __name__ == \"__main__\":\n    main()\n",
      "expectedOutput": "JSON or text summary printed by the example runner."
    },
    {
      "id": "10-03",
      "title": "Transcribe a voice note with the fake STT backend",
      "difficulty": "Advanced",
      "status": "verified_with_fake_backend",
      "category": "agents_tools",
      "teaches": "Transcribe a voice note with the fake STT backend",
      "runtime": "about 10 seconds",
      "device": "CPU",
      "network": "not required",
      "downloadRequired": false,
      "optionalDependencies": [],
      "command": "python examples/run_examples.py run 10-03",
      "tags": [
        "Agents Tools"
      ],
      "download": "assets/examples/current/10_agents_tools/03_voice_note_agent_fake.py",
      "code": "\"\"\"\nArcLM Example: Voice Note Agent with Fake Backend\n\nThis example uses the fake speech-to-text backend so no audio model or download\nis required.\n\"\"\"\n\nfrom __future__ import annotations\n\nimport json\nfrom tempfile import TemporaryDirectory\nfrom pathlib import Path\n\nfrom arclm.agents import FakeSpeechToTextBackend, TranscriptionRequest\n\n\ndef print_json(value) -> None:\n    print(json.dumps(value, indent=2, sort_keys=True, default=str))\n\n\ndef main() -> None:\n    backend = FakeSpeechToTextBackend(text=\"Review ArcLM examples and write two follow-up tasks.\")\n    with TemporaryDirectory() as temp_dir:\n        audio_path = Path(temp_dir) / \"note.wav\"\n        audio_path.write_bytes(b\"synthetic-audio\")\n        result = backend.transcribe(TranscriptionRequest(audio_path=audio_path))\n    tasks = [item.strip() for item in result.text.replace(\"and\", \",\").split(\",\") if item.strip()]\n    print_json({\"backend\": type(backend).__name__, \"transcript\": result.text, \"tasks\": tasks})\n\n\nif __name__ == \"__main__\":\n    main()\n",
      "expectedOutput": "JSON or text summary printed by the example runner."
    },
    {
      "id": "10-04",
      "title": "Transcribe with a real Whisper backend",
      "difficulty": "Advanced",
      "status": "manual_optional",
      "category": "agents_tools",
      "teaches": "Transcribe with a real Whisper backend",
      "runtime": "about None seconds",
      "device": "CPU",
      "network": "not required",
      "downloadRequired": false,
      "optionalDependencies": [
        "agents-audio"
      ],
      "command": "python examples/run_examples.py run 10-04",
      "tags": [
        "Agents Tools"
      ],
      "download": "assets/examples/current/10-04.py",
      "code": "import arclm\n\n# Manual optional example: Transcribe with a real Whisper backend\nprint(arclm.__version__)",
      "expectedOutput": "JSON or text summary printed by the example runner."
    },
    {
      "id": "11-01",
      "title": "Inspect ArcLM Security Core status",
      "difficulty": "Advanced",
      "status": "verified",
      "category": "security",
      "teaches": "Inspect ArcLM Security Core status",
      "runtime": "about 10 seconds",
      "device": "CPU",
      "network": "not required",
      "downloadRequired": false,
      "optionalDependencies": [
        "security"
      ],
      "command": "python examples/run_examples.py run 11-01",
      "tags": [
        "Security"
      ],
      "download": "assets/examples/current/11_security/01_security_status.py",
      "code": "\"\"\"\nArcLM Example: Security Status\n\nThis example prints the safe Security Core status report.\n\"\"\"\n\nfrom __future__ import annotations\n\nimport json\n\nfrom arclm.security import security_status\n\n\ndef print_json(value) -> None:\n    print(json.dumps(value, indent=2, sort_keys=True, default=str))\n\n\ndef main() -> None:\n    print_json(security_status())\n\n\nif __name__ == \"__main__\":\n    main()\n",
      "expectedOutput": "JSON or text summary printed by the example runner."
    },
    {
      "id": "11-02",
      "title": "Encrypt, hash, sign, verify, and redact local data",
      "difficulty": "Advanced",
      "status": "verified",
      "category": "security",
      "teaches": "Encrypt, hash, sign, verify, and redact local data",
      "runtime": "about 10 seconds",
      "device": "CPU",
      "network": "not required",
      "downloadRequired": false,
      "optionalDependencies": [
        "security"
      ],
      "command": "python examples/run_examples.py run 11-02",
      "tags": [
        "Security"
      ],
      "download": "assets/examples/current/11_security/02_encrypt_hash_sign_redact.py",
      "code": "\"\"\"\nArcLM Example: Encrypt, Hash, Sign, and Redact\n\nThis example uses synthetic data to demonstrate AEAD encryption, tamper\nrejection, file hashing, Ed25519 manifest signatures, and secret redaction.\n\"\"\"\n\nfrom __future__ import annotations\n\nimport json\nimport os\nimport tempfile\nfrom pathlib import Path\n\nfrom arclm.security import DecryptionError, decrypt_json, encrypt_json, generate_signing_keypair, hash_file, redact_sensitive_text, sign_manifest, verify_manifest\nfrom arclm.security.artifacts import create_artifact_manifest\n\n\ndef print_json(value) -> None:\n    print(json.dumps(value, indent=2, sort_keys=True, default=str))\n\n\ndef main() -> None:\n    key = os.urandom(32)\n    envelope = encrypt_json({\"prompt\": \"synthetic\"}, key, associated_data={\"artifact_type\": \"run_metadata\"})\n    tampered = envelope.to_dict()\n    tampered[\"ciphertext\"] = tampered[\"ciphertext\"][:-2] + \"AA\"\n    tamper_rejected = False\n    try:\n        decrypt_json(tampered, key)\n    except DecryptionError:\n        tamper_rejected = True\n    with tempfile.TemporaryDirectory(prefix=\"arclm-security-\") as tmpdir:\n        tmp = Path(tmpdir)\n        artifact = tmp / \"artifact\"\n        artifact.mkdir()\n        data_file = artifact / \"weights.safetensors\"\n        data_file.write_bytes(b\"synthetic weights\")\n        manifest = create_artifact_manifest(artifact, artifact_type=\"model_artifact\")\n        pair = generate_signing_keypair(key_id=\"signing_key_example\")\n        signed = sign_manifest(manifest.to_dict(), pair.private_key, key_id=pair.key_id)\n        verified = verify_manifest(signed, pair.public_key, expected_key_id=pair.key_id)\n        print_json({\"decrypted\": decrypt_json(envelope, key), \"tamper_rejected\": tamper_rejected, \"hash\": hash_file(data_file), \"manifest_verified\": verified, \"redacted\": redact_sensitive_text(\"api_key=synthetic-secret\")})\n\n\nif __name__ == \"__main__\":\n    main()\n",
      "expectedOutput": "JSON or text summary printed by the example runner."
    },
    {
      "id": "12-01",
      "title": "Local language model mini project",
      "difficulty": "Advanced",
      "status": "verified",
      "category": "complete_projects",
      "teaches": "Local language model mini project",
      "runtime": "about 20 seconds",
      "device": "CPU",
      "network": "not required",
      "downloadRequired": false,
      "optionalDependencies": [],
      "command": "python examples/run_examples.py run 12-01",
      "tags": [
        "Complete Projects",
        "Model",
        "Project"
      ],
      "download": "assets/examples/current/12_complete_projects/01_local_language_model/main.py",
      "code": "\"\"\"\nArcLM Complete Project: Local Language Model\n\nRaw text -> tokenizer -> tiny native model -> one pre-training step ->\nlocal state persistence -> evaluation summary -> generation.\n\"\"\"\n\nfrom __future__ import annotations\n\nimport json\nimport tempfile\nfrom pathlib import Path\n\nimport torch\n\nfrom arclm.evaluation import calculate_perplexity\nfrom arclm.inference import Generator\nfrom arclm.models import ArcLM\nfrom arclm.tokenizers import Tokenizer\n\n\nCORPUS = (\n    \"ArcLM trains tiny native language models on local data. \"\n    \"Local examples stay small bounded and inspectable. \"\n    \"Tiny models help developers understand tokenization training evaluation generation.\"\n)\n\n\ndef print_json(value) -> None:\n    print(json.dumps(value, indent=2, sort_keys=True, default=str))\n\n\ndef main() -> None:\n    torch.manual_seed(17)\n    tokenizer = Tokenizer(max_vocab=64)\n    tokenizer.build(CORPUS)\n    ids = tokenizer.encode_text(CORPUS)\n    block_size = 8\n    x = torch.tensor([ids[:block_size]], dtype=torch.long)\n    y = torch.tensor([ids[1 : block_size + 1]], dtype=torch.long)\n    model = ArcLM(vocab_size=tokenizer.get_vocab_size(), embed_dim=16, block_size=block_size, num_blocks=1)\n    optimizer = torch.optim.AdamW(model.parameters(), lr=1e-2)\n    logits = model(x)\n    loss = torch.nn.functional.cross_entropy(logits.reshape(-1, logits.size(-1)), y.reshape(-1))\n    loss.backward()\n    optimizer.step()\n    generator = Generator(model, tokenizer.stoi, tokenizer.itos, block_size=block_size, device=\"cpu\", tokenizer=tokenizer)\n    with tempfile.TemporaryDirectory(prefix=\"arclm-project-local-lm-\") as tmpdir:\n        tmp = Path(tmpdir)\n        state_path = tmp / \"model_state.pt\"\n        torch.save(model.state_dict(), state_path)\n        print_json(\n            {\n                \"records\": 1,\n                \"tokens\": len(ids),\n                \"model_parameters\": sum(p.numel() for p in model.parameters()),\n                \"training_steps\": 1,\n                \"final_loss\": round(float(loss.detach()), 4),\n                \"perplexity\": round(calculate_perplexity(float(loss.detach())), 4),\n                \"checkpoint\": state_path.name,\n                \"generation\": generator.generate_string(\"ArcLM\", max_new_tokens=3, top_k=3),\n            }\n        )\n\n\nif __name__ == \"__main__\":\n    main()\n",
      "expectedOutput": "JSON or text summary printed by the example runner."
    },
    {
      "id": "12-02",
      "title": "Domain SFT assistant mini project",
      "difficulty": "Advanced",
      "status": "verified",
      "category": "complete_projects",
      "teaches": "Domain SFT assistant mini project",
      "runtime": "about 20 seconds",
      "device": "CPU",
      "network": "not required",
      "downloadRequired": false,
      "optionalDependencies": [],
      "command": "python examples/run_examples.py run 12-02",
      "tags": [
        "Complete Projects",
        "Project"
      ],
      "download": "assets/examples/current/12_complete_projects/02_domain_sft_assistant/main.py",
      "code": "\"\"\"\nArcLM Complete Project: Domain SFT Assistant\n\nBase tiny model -> instruction dataset -> canonical SFT preparation ->\none response-label update -> bounded generation report.\n\"\"\"\n\nfrom __future__ import annotations\n\nimport json\n\nimport torch\n\nfrom arclm.finetuning import FineTuningConfig, fine_tuning_format_fingerprint, prepare_fine_tuning_dataset\nfrom arclm.inference import Generator\nfrom arclm.models import ArcLM\nfrom arclm.tokenizers import Tokenizer\n\n\nCORPUS = \"ArcLM is a compact local toolkit. Tiny examples are fast and safe.\"\nSFT_RECORDS = [\n    {\"instruction\": \"What is ArcLM?\", \"response\": \"ArcLM is a compact local language-model toolkit.\"},\n    {\"instruction\": \"Why use tiny examples?\", \"response\": \"Tiny examples are fast, inspectable, and safe.\"},\n]\n\n\ndef print_json(value) -> None:\n    print(json.dumps(value, indent=2, sort_keys=True, default=str))\n\n\ndef main() -> None:\n    torch.manual_seed(23)\n    tokenizer = Tokenizer(max_vocab=80)\n    tokenizer.build(CORPUS + \" \" + \" \".join(row[\"instruction\"] + \" \" + row[\"response\"] for row in SFT_RECORDS))\n    config = FineTuningConfig(max_sequence_length=40, train_on_prompt=False)\n    prepared = prepare_fine_tuning_dataset(SFT_RECORDS, tokenizer, config)\n    feature = prepared[0]\n    model = ArcLM(vocab_size=tokenizer.get_vocab_size(), embed_dim=16, block_size=len(feature[\"input_ids\"]), num_blocks=1)\n    x = torch.tensor([feature[\"input_ids\"]], dtype=torch.long)\n    labels = torch.tensor([feature[\"labels\"]], dtype=torch.long)\n    optimizer = torch.optim.AdamW(model.parameters(), lr=1e-2)\n    logits = model(x)\n    loss = torch.nn.functional.cross_entropy(logits.reshape(-1, logits.size(-1)), labels.reshape(-1), ignore_index=config.ignore_index)\n    loss.backward()\n    optimizer.step()\n    generator = Generator(model, tokenizer.stoi, tokenizer.itos, block_size=len(feature[\"input_ids\"]), device=\"cpu\", tokenizer=tokenizer)\n    print_json(\n        {\n            \"records\": prepared.report.records_valid,\n            \"trainable_tokens\": prepared.report.trainable_tokens,\n            \"fingerprint\": fine_tuning_format_fingerprint(config=config, tokenizer_identity={\"vocab_size\": tokenizer.get_vocab_size()}),\n            \"loss\": round(float(loss.detach()), 4),\n            \"sample\": generator.generate_string(\"Instruction: What is ArcLM?\", max_new_tokens=4, top_k=5),\n        }\n    )\n\n\nif __name__ == \"__main__\":\n    main()\n",
      "expectedOutput": "JSON or text summary printed by the example runner."
    },
    {
      "id": "12-03",
      "title": "Website knowledge pipeline mini project",
      "difficulty": "Advanced",
      "status": "verified",
      "category": "complete_projects",
      "teaches": "Website knowledge pipeline mini project",
      "runtime": "about 10 seconds",
      "device": "CPU",
      "network": "not required",
      "downloadRequired": false,
      "optionalDependencies": [],
      "command": "python examples/run_examples.py run 12-03",
      "tags": [
        "Complete Projects",
        "Project"
      ],
      "download": "assets/examples/current/12_complete_projects/03_website_knowledge_pipeline/main.py",
      "code": "\"\"\"\nArcLM Complete Project: Website Knowledge Pipeline\n\nLocal HTML fixture -> text extraction -> validation -> tokenizer report.\n\"\"\"\n\nfrom __future__ import annotations\n\nimport json\nfrom html.parser import HTMLParser\nfrom pathlib import Path\n\nfrom arclm.datasets import build_dataset_report, validate_records\nfrom arclm.tokenizers import Tokenizer\n\n\nclass TextExtractor(HTMLParser):\n    def __init__(self) -> None:\n        super().__init__()\n        self.skip = False\n        self.parts: list[str] = []\n\n    def handle_starttag(self, tag, attrs):\n        self.skip = tag in {\"nav\", \"footer\", \"script\", \"style\"}\n\n    def handle_endtag(self, tag):\n        if tag in {\"nav\", \"footer\", \"script\", \"style\"}:\n            self.skip = False\n\n    def handle_data(self, data):\n        text = \" \".join(data.split())\n        if text and not self.skip:\n            self.parts.append(text)\n\n\ndef print_json(value) -> None:\n    print(json.dumps(value, indent=2, sort_keys=True, default=str))\n\n\ndef main() -> None:\n    fixture = Path(__file__).resolve().parents[2] / \"assets\" / \"websites\" / \"product_page.html\"\n    parser = TextExtractor()\n    parser.feed(fixture.read_text(encoding=\"utf-8\"))\n    records = [{\"id\": f\"web-{index}\", \"text\": text} for index, text in enumerate(parser.parts, start=1)]\n    validation = validate_records(records, required_fields=(\"id\", \"text\"), strict=False)\n    tokenizer = Tokenizer(max_vocab=64)\n    tokenizer.build(\" \".join(row[\"text\"] for row in validation.valid_records))\n    report = build_dataset_report(validation.valid_records, tokenizer=tokenizer, text_fields=(\"text\",), validation_result=validation)\n    print_json({\"records\": validation.valid_count, \"tokens\": report.token_count})\n\n\nif __name__ == \"__main__\":\n    main()\n",
      "expectedOutput": "JSON or text summary printed by the example runner."
    },
    {
      "id": "12-04",
      "title": "Local document agent mini project",
      "difficulty": "Advanced",
      "status": "verified",
      "category": "complete_projects",
      "teaches": "Local document agent mini project",
      "runtime": "about 10 seconds",
      "device": "CPU",
      "network": "not required",
      "downloadRequired": false,
      "optionalDependencies": [],
      "command": "python examples/run_examples.py run 12-04",
      "tags": [
        "Agent",
        "Complete Projects",
        "Project"
      ],
      "download": "assets/examples/current/12_complete_projects/04_local_document_agent/main.py",
      "code": "\"\"\"ArcLM Complete Project: Local Document Agent.\"\"\"\n\nfrom __future__ import annotations\n\nimport json\nfrom pathlib import Path\n\nfrom arclm.agents import Agent, AgentRunner, ModelResponse, ToolCall, tool\nfrom arclm.security.paths import resolve_under_root\nfrom arclm.security.redaction import redact_sensitive_text\n\n\nclass OneToolThenDoneModel:\n    def __init__(self, tool_name: str, arguments: dict):\n        self.tool_name = tool_name\n        self.arguments = dict(arguments)\n        self.calls = 0\n\n    def generate_response(self, *, messages, tools, instructions, session):\n        self.calls += 1\n        if self.calls == 1:\n            return ModelResponse(tool_calls=[ToolCall(id=\"call_1\", name=self.tool_name, arguments=self.arguments)])\n        return ModelResponse(content=\"Done. The tool result was processed safely.\")\n\n\n@tool\ndef read_safe_note(relative_path: str) -> str:\n    \"\"\"Read one approved local note and redact likely secrets.\"\"\"\n    root = Path(__file__).resolve().parents[2] / \"assets\" / \"documents\"\n    path = resolve_under_root(root, relative_path)\n    return redact_sensitive_text(path.read_text(encoding=\"utf-8\")[:1000])\n\n\ndef print_json(value) -> None:\n    print(json.dumps(value, indent=2, sort_keys=True, default=str))\n\n\ndef main() -> None:\n    agent = Agent(name=\"local_document_agent\", instructions=\"Read approved documents.\", model=OneToolThenDoneModel(\"read_safe_note\", {\"relative_path\": \"local_note.md\"}), tools=[read_safe_note])\n    result = AgentRunner(max_steps=2).run(agent, \"Summarize the local note.\")\n    print_json({\"output\": result.output, \"tool_calls\": len(result.session.tool_calls), \"trace_redacted\": \"demo-secret\" not in result.session.to_json()})\n\n\nif __name__ == \"__main__\":\n    main()\n",
      "expectedOutput": "JSON or text summary printed by the example runner."
    },
    {
      "id": "12-05",
      "title": "Model benchmark lab mini project",
      "difficulty": "Advanced",
      "status": "verified",
      "category": "complete_projects",
      "teaches": "Model benchmark lab mini project",
      "runtime": "about 10 seconds",
      "device": "CPU",
      "network": "not required",
      "downloadRequired": false,
      "optionalDependencies": [],
      "command": "python examples/run_examples.py run 12-05",
      "tags": [
        "Benchmark",
        "Complete Projects",
        "Model",
        "Project"
      ],
      "download": "assets/examples/current/12_complete_projects/05_model_benchmark_lab/main.py",
      "code": "\"\"\"ArcLM Complete Project: Model Benchmark Lab.\"\"\"\n\nfrom __future__ import annotations\n\nimport json\n\nimport torch\n\nfrom arclm.evaluation import Accuracy, calculate_perplexity\nfrom arclm.models import ArcLM\n\n\ndef print_json(value) -> None:\n    print(json.dumps(value, indent=2, sort_keys=True, default=str))\n\n\ndef main() -> None:\n    torch.manual_seed(5)\n    model_a = ArcLM(vocab_size=12, embed_dim=8, block_size=4, num_blocks=1)\n    model_b = ArcLM(vocab_size=12, embed_dim=8, block_size=4, num_blocks=1)\n    x = torch.tensor([[1, 2, 3, 4]], dtype=torch.long)\n    labels = torch.tensor([[2, 3, 4, 5]], dtype=torch.long)\n    rows = []\n    for name, model in [(\"model_a\", model_a), (\"model_b\", model_b)]:\n        logits = model(x)\n        loss = torch.nn.functional.cross_entropy(logits.reshape(-1, logits.size(-1)), labels.reshape(-1))\n        metric = Accuracy()\n        metric.update(predictions=logits, targets=labels)\n        rows.append(\n            {\n                \"name\": name,\n                \"loss\": round(float(loss.detach()), 4),\n                \"perplexity\": round(calculate_perplexity(float(loss.detach())), 4),\n                \"accuracy\": round(float(metric.compute()), 4),\n            }\n        )\n    print_json({\"comparison_valid\": True, \"shared_vocab_size\": 12, \"results\": rows})\n\n\nif __name__ == \"__main__\":\n    main()\n",
      "expectedOutput": "JSON or text summary printed by the example runner."
    },
    {
      "id": "12-06",
      "title": "Secure local AI workspace mini project",
      "difficulty": "Advanced",
      "status": "verified",
      "category": "complete_projects",
      "teaches": "Secure local AI workspace mini project",
      "runtime": "about 10 seconds",
      "device": "CPU",
      "network": "not required",
      "downloadRequired": false,
      "optionalDependencies": [
        "security"
      ],
      "command": "python examples/run_examples.py run 12-06",
      "tags": [
        "Complete Projects",
        "Project"
      ],
      "download": "assets/examples/current/12_complete_projects/06_secure_local_ai_workspace/main.py",
      "code": "\"\"\"ArcLM Complete Project: Secure Local AI Workspace.\"\"\"\n\nfrom __future__ import annotations\n\nimport json\nimport os\nimport tempfile\nfrom pathlib import Path\n\nfrom arclm.security import decrypt_json, encrypt_json, generate_signing_keypair, redact_sensitive_text, sign_manifest, verify_manifest\nfrom arclm.security.artifacts import create_artifact_manifest\nfrom arclm.security.keys import InMemoryKeyProvider\nfrom arclm.security.artifacts import EncryptedArtifactStore\n\n\ndef print_json(value) -> None:\n    print(json.dumps(value, indent=2, sort_keys=True, default=str))\n\n\ndef main() -> None:\n    key = os.urandom(32)\n    with tempfile.TemporaryDirectory(prefix=\"arclm-secure-workspace-\") as tmpdir:\n        root = Path(tmpdir)\n        envelope = encrypt_json({\"run\": \"synthetic\"}, key, associated_data={\"artifact_type\": \"run_metadata\"})\n        provider = InMemoryKeyProvider()\n        provider.create_key(key_id=\"key_1\")\n        store = EncryptedArtifactStore(root=root / \"store\", key_provider=provider)\n        record = store.write_json(relative_path=\"metadata.json.enc\", value={\"prompt\": \"api_key=synthetic-secret\"}, artifact_type=\"run_metadata\")\n        artifact = root / \"artifact\"\n        artifact.mkdir()\n        (artifact / \"weights.safetensors\").write_bytes(b\"synthetic\")\n        manifest = create_artifact_manifest(artifact, artifact_type=\"checkpoint\")\n        pair = generate_signing_keypair(key_id=\"signing_key_workspace\")\n        signed = sign_manifest(manifest.to_dict(), pair.private_key, key_id=pair.key_id)\n        print_json({\"decrypted\": decrypt_json(envelope, key), \"store_record\": record.path, \"manifest_verified\": verify_manifest(signed, pair.public_key, expected_key_id=pair.key_id), \"trace\": redact_sensitive_text(\"api_key=synthetic-secret\")})\n\n\nif __name__ == \"__main__\":\n    main()\n",
      "expectedOutput": "JSON or text summary printed by the example runner."
    }
  ],
  "projects": [
    {
      "id": "12-01",
      "title": "Local language model mini project",
      "difficulty": "Advanced",
      "goal": "Local language model mini project",
      "files": [
        "12_complete_projects/01_local_language_model/main.py"
      ],
      "dataset": "Tiny local fixture or inline synthetic data.",
      "tokenizer": "Native tokenizer unless the example states otherwise.",
      "modelConfiguration": "Tiny native ArcLM configuration for verified projects.",
      "trainingConfiguration": "Bounded CPU/local run when runnable.",
      "expectedOutput": "JSON or text summary printed by the example runner.",
      "download": "assets/examples/current/12_complete_projects/01_local_language_model/main.py"
    },
    {
      "id": "12-02",
      "title": "Domain SFT assistant mini project",
      "difficulty": "Advanced",
      "goal": "Domain SFT assistant mini project",
      "files": [
        "12_complete_projects/02_domain_sft_assistant/main.py"
      ],
      "dataset": "Tiny local fixture or inline synthetic data.",
      "tokenizer": "Native tokenizer unless the example states otherwise.",
      "modelConfiguration": "Tiny native ArcLM configuration for verified projects.",
      "trainingConfiguration": "Bounded CPU/local run when runnable.",
      "expectedOutput": "JSON or text summary printed by the example runner.",
      "download": "assets/examples/current/12_complete_projects/02_domain_sft_assistant/main.py"
    },
    {
      "id": "12-03",
      "title": "Website knowledge pipeline mini project",
      "difficulty": "Advanced",
      "goal": "Website knowledge pipeline mini project",
      "files": [
        "12_complete_projects/03_website_knowledge_pipeline/main.py"
      ],
      "dataset": "Tiny local fixture or inline synthetic data.",
      "tokenizer": "Native tokenizer unless the example states otherwise.",
      "modelConfiguration": "Tiny native ArcLM configuration for verified projects.",
      "trainingConfiguration": "Bounded CPU/local run when runnable.",
      "expectedOutput": "JSON or text summary printed by the example runner.",
      "download": "assets/examples/current/12_complete_projects/03_website_knowledge_pipeline/main.py"
    },
    {
      "id": "12-04",
      "title": "Local document agent mini project",
      "difficulty": "Advanced",
      "goal": "Local document agent mini project",
      "files": [
        "12_complete_projects/04_local_document_agent/main.py"
      ],
      "dataset": "Tiny local fixture or inline synthetic data.",
      "tokenizer": "Native tokenizer unless the example states otherwise.",
      "modelConfiguration": "Tiny native ArcLM configuration for verified projects.",
      "trainingConfiguration": "Bounded CPU/local run when runnable.",
      "expectedOutput": "JSON or text summary printed by the example runner.",
      "download": "assets/examples/current/12_complete_projects/04_local_document_agent/main.py"
    },
    {
      "id": "12-05",
      "title": "Model benchmark lab mini project",
      "difficulty": "Advanced",
      "goal": "Model benchmark lab mini project",
      "files": [
        "12_complete_projects/05_model_benchmark_lab/main.py"
      ],
      "dataset": "Tiny local fixture or inline synthetic data.",
      "tokenizer": "Native tokenizer unless the example states otherwise.",
      "modelConfiguration": "Tiny native ArcLM configuration for verified projects.",
      "trainingConfiguration": "Bounded CPU/local run when runnable.",
      "expectedOutput": "JSON or text summary printed by the example runner.",
      "download": "assets/examples/current/12_complete_projects/05_model_benchmark_lab/main.py"
    },
    {
      "id": "12-06",
      "title": "Secure local AI workspace mini project",
      "difficulty": "Advanced",
      "goal": "Secure local AI workspace mini project",
      "files": [
        "12_complete_projects/06_secure_local_ai_workspace/main.py"
      ],
      "dataset": "Tiny local fixture or inline synthetic data.",
      "tokenizer": "Native tokenizer unless the example states otherwise.",
      "modelConfiguration": "Tiny native ArcLM configuration for verified projects.",
      "trainingConfiguration": "Bounded CPU/local run when runnable.",
      "expectedOutput": "JSON or text summary printed by the example runner.",
      "download": "assets/examples/current/12_complete_projects/06_secure_local_ai_workspace/main.py"
    }
  ]
};
