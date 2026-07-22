window.ARCLM_ERRORS = [
  [
    "dataset_tokenizer_required",
    "A tokenizer is required for token statistics or token inspection.",
    "Create or select a tokenizer.",
    "Dataset reports and Studio Data page."
  ],
  [
    "tokenizer_vocab_model_mismatch",
    "Model vocabulary size does not match tokenizer vocabulary size.",
    "Create the model from the selected tokenizer vocabulary.",
    "Model Builder and training."
  ],
  [
    "training_tokenizer_model_mismatch",
    "The training tokenizer does not match the selected model.",
    "Select the tokenizer used by the model.",
    "Training Studio."
  ],
  [
    "training_job_already_running",
    "Another local training job is active.",
    "Wait, cancel or inspect the active run.",
    "Training Studio."
  ],
  [
    "checkpoint_not_found",
    "The selected checkpoint ID is not available in the project.",
    "Refresh checkpoints or train a model.",
    "Checkpoint Manager."
  ],
  [
    "checkpoint_incompatible",
    "Checkpoint metadata or tensor shapes do not match the expected native model.",
    "Use a compatible native checkpoint.",
    "Checkpoint validation."
  ],
  [
    "evaluation_tokenizer_mismatch",
    "Evaluation tokenizer differs from checkpoint tokenizer.",
    "Use the checkpoint tokenizer.",
    "Evaluation Studio."
  ],
  [
    "generation_context_exceeded",
    "Prompt plus requested tokens exceed context length.",
    "Shorten the prompt or reduce new tokens.",
    "Generation Playground."
  ],
  [
    "compute_resource_busy",
    "A local training or evaluation worker is active.",
    "Wait for the worker to finish.",
    "Evaluation and generation."
  ]
];
