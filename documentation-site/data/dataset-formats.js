window.ARCLM_DATASET_FORMATS = [
  {
    "id": "python-records",
    "name": "Python list of dictionaries",
    "status": "Stable",
    "structure": "[{\"text\": \"ArcLM trains locally.\"}]",
    "requiredFields": "Depends on workflow; plain causal LM commonly uses text.",
    "whenToUse": "Small scripts, tests and notebooks.",
    "commonMistakes": [
      "Passing a list of strings when records are expected",
      "Missing required text fields"
    ],
    "sample": "assets/datasets/tiny-records.json",
    "usage": "from arclm.datasets import load_dataset\n\nrecords = load_dataset([{\"text\": \"ArcLM trains locally.\"}])"
  },
  {
    "id": "json",
    "name": "JSON",
    "status": "Stable",
    "structure": "A JSON list of objects or a supported object containing records.",
    "requiredFields": "text, instruction/response or prompt/completion depending on workflow.",
    "whenToUse": "Small structured local datasets.",
    "commonMistakes": [
      "Using invalid JSON",
      "Mixing unrelated record shapes"
    ],
    "sample": "assets/datasets/tiny-records.json",
    "usage": "from arclm.datasets import load_dataset\n\nrecords = load_dataset(\"tiny-records.json\")"
  },
  {
    "id": "jsonl",
    "name": "JSONL",
    "status": "Stable",
    "structure": "One JSON object per line.",
    "requiredFields": "instruction and response for SFT, or text for plain causal LM.",
    "whenToUse": "Instruction datasets and append-friendly local data.",
    "commonMistakes": [
      "Trailing commas",
      "Blank malformed lines",
      "Missing response fields"
    ],
    "sample": "assets/datasets/tiny-instructions.jsonl",
    "usage": "from arclm.datasets import load_dataset\n\nrecords = load_dataset(\"tiny-instructions.jsonl\")"
  },
  {
    "id": "csv",
    "name": "CSV",
    "status": "Stable",
    "structure": "Header row followed by records.",
    "requiredFields": "Columns named for selected text fields.",
    "whenToUse": "Tabular text data.",
    "commonMistakes": [
      "Missing header",
      "Wrong delimiter",
      "Empty text cells"
    ],
    "sample": "assets/datasets/tiny-table.csv",
    "usage": "from arclm.datasets import load_dataset\n\nrecords = load_dataset(\"tiny-table.csv\")"
  },
  {
    "id": "txt",
    "name": "TXT",
    "status": "Stable",
    "structure": "Plain UTF-8 text.",
    "requiredFields": "No explicit fields; loader converts text into records.",
    "whenToUse": "Tiny causal language modeling experiments.",
    "commonMistakes": [
      "Very short text",
      "Unexpected encoding"
    ],
    "sample": "assets/datasets/tiny-causal.txt",
    "usage": "from arclm.datasets import load_dataset\n\nrecords = load_dataset(\"tiny-causal.txt\")"
  }
];
