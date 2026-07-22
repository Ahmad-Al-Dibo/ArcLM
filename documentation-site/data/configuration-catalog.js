window.ARCLM_CONFIGURATION_CATALOG = [
  [
    "Model",
    "vocab_size",
    "int",
    "Required",
    "Must match tokenizer vocabulary size."
  ],
  [
    "Model",
    "embed_dim",
    "int",
    "64",
    "Embedding width for the native model."
  ],
  [
    "Model",
    "block_size",
    "int",
    "8",
    "Maximum context length."
  ],
  [
    "Model",
    "num_blocks",
    "int",
    "2",
    "Transformer block count."
  ],
  [
    "Training",
    "epochs",
    "int",
    "3",
    "Training epochs."
  ],
  [
    "Training",
    "batch_size",
    "int",
    "8",
    "Examples per batch."
  ],
  [
    "Training",
    "learning_rate",
    "float",
    "2e-5",
    "Optimizer learning rate."
  ],
  [
    "Training",
    "gradient_accumulation_steps",
    "int",
    "1",
    "Accumulate gradients before optimizer step."
  ],
  [
    "Training",
    "precision",
    "str",
    "fp32",
    "fp32, fp16 or bf16 when available."
  ],
  [
    "Evaluation",
    "maximum_examples",
    "int",
    "64 in Studio",
    "Bounded evaluation size for local Studio jobs."
  ],
  [
    "Generation",
    "max_new_tokens",
    "int",
    "32 in request examples",
    "Maximum generated tokens."
  ],
  [
    "Generation",
    "temperature",
    "float",
    "1.0",
    "Sampling temperature."
  ],
  [
    "Web",
    "workspace_root",
    "str | Path",
    "workspace",
    "Local Studio workspace root."
  ],
  [
    "Web",
    "max_generation_history",
    "int",
    "100",
    "Bounded stored generation history."
  ]
];
