window.ARCLM_SUPPORTED_MODELS = [
  {
    "id": "native-arclm",
    "name": "Native ArcLM",
    "provider": "ArcLM",
    "modelId": null,
    "family": "ArcLM",
    "status": "native",
    "parameterCount": "Configurable",
    "tasks": [
      "causal-language-modeling",
      "training",
      "fine-tuning",
      "generation",
      "evaluation",
      "inspection"
    ],
    "testedOperations": [
      "create",
      "forward",
      "train",
      "checkpoint",
      "reload",
      "evaluate",
      "generate",
      "inspect"
    ],
    "optionalDependencies": [],
    "external": false,
    "url": null,
    "notes": "Implemented directly by ArcLM as a compact causal language model.",
    "limitations": [
      "Small educational and research model, not a production-scale serving architecture."
    ]
  },
  {
    "id": "gpt2-tiny-reference",
    "name": "Tiny GPT-2 reference",
    "provider": "Hugging Face",
    "modelId": "hf-internal-testing/tiny-random-gpt2",
    "family": "GPT-2",
    "status": "compatible",
    "parameterCount": "Tiny test configuration",
    "tasks": [
      "causal-language-modeling",
      "external-loading",
      "generation"
    ],
    "testedOperations": [
      "source-detection",
      "optional-dependency-boundary",
      "generation-boundary"
    ],
    "optionalDependencies": [
      "transformers"
    ],
    "external": true,
    "url": "https://huggingface.co/hf-internal-testing/tiny-random-gpt2",
    "notes": "Compatibility reference only; not a claim about full GPT-2 family coverage.",
    "limitations": [
      "Runtime depends on optional Transformers assets and local availability."
    ]
  },
  {
    "id": "qwen3-0-6b",
    "name": "Qwen3 0.6B",
    "provider": "Qwen",
    "modelId": "Qwen/Qwen3-0.6B",
    "family": "Qwen3",
    "status": "experimental",
    "parameterCount": "0.6B",
    "tasks": [
      "causal-language-modeling",
      "external-loading"
    ],
    "testedOperations": [
      "source-recognition",
      "configuration-boundary"
    ],
    "optionalDependencies": [
      "transformers"
    ],
    "external": true,
    "url": "https://huggingface.co/Qwen/Qwen3-0.6B",
    "notes": "Exact model path is recognized; complete load, training, SFT, LoRA and CUDA behavior are not guaranteed.",
    "limitations": [
      "Experimental exact-model path; no universal Qwen support claim."
    ]
  },
  {
    "id": "native-bert-t5-diffusion",
    "name": "Native BERT, T5, diffusion and multimodal models",
    "provider": "ArcLM",
    "modelId": null,
    "family": "Unsupported native families",
    "status": "unsupported",
    "parameterCount": "N/A",
    "tasks": [
      "masked-language-modeling",
      "seq2seq",
      "diffusion",
      "multimodal"
    ],
    "testedOperations": [],
    "optionalDependencies": [],
    "external": false,
    "url": null,
    "notes": "ArcLM does not currently provide these native model families.",
    "limitations": [
      "Unsupported by native ArcLM."
    ]
  }
];
