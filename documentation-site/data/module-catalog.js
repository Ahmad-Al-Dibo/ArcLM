window.ARCLM_MODULE_CATALOG = [
  {
    "importPath": "arclm.datasets",
    "status": "Stable",
    "purpose": "Dataset loading, validation, manifests, reports and local processing.",
    "whenToUse": "Use at the start of data workflows.",
    "optionalDependencies": "Core dependencies only."
  },
  {
    "importPath": "arclm.tokenizers",
    "status": "Beta",
    "purpose": "Native word and SentencePiece tokenizers.",
    "whenToUse": "Use before model creation and generation.",
    "optionalDependencies": "SentencePiece for subword modes."
  },
  {
    "importPath": "arclm.models",
    "status": "Stable",
    "purpose": "Native ArcLM causal model and capability reports.",
    "whenToUse": "Use for local causal language modeling.",
    "optionalDependencies": "torch."
  },
  {
    "importPath": "arclm.training",
    "status": "Stable",
    "purpose": "Canonical Trainer and TrainingConfig.",
    "whenToUse": "Use for native training and checkpoints.",
    "optionalDependencies": "torch."
  },
  {
    "importPath": "arclm.finetuning",
    "status": "Stable",
    "purpose": "Full fine-tuning and SFT data contracts.",
    "whenToUse": "Use for instruction/response workflows.",
    "optionalDependencies": "External paths may need HF extras."
  },
  {
    "importPath": "arclm.peft",
    "status": "Stable",
    "purpose": "Native LoRA and optional PEFT helpers.",
    "whenToUse": "Use for adapter experiments.",
    "optionalDependencies": "torch; optional peft for external adapters."
  },
  {
    "importPath": "arclm.checkpoints",
    "status": "Stable",
    "purpose": "Checkpoint inspection and loading boundaries.",
    "whenToUse": "Use for trusted local checkpoint workflows.",
    "optionalDependencies": "Optional safetensors."
  },
  {
    "importPath": "arclm.evaluation",
    "status": "Stable",
    "purpose": "Evaluator, metrics and report objects.",
    "whenToUse": "Use after training or reload.",
    "optionalDependencies": "torch."
  },
  {
    "importPath": "arclm.inference",
    "status": "Stable",
    "purpose": "Native generation and optional external causal-LM boundaries.",
    "whenToUse": "Use for bounded text generation.",
    "optionalDependencies": "External paths may need transformers."
  },
  {
    "importPath": "arclm.inspection",
    "status": "Beta",
    "purpose": "Transparent native pipeline traces.",
    "whenToUse": "Use for learning and debugging.",
    "optionalDependencies": "torch."
  },
  {
    "importPath": "arclm.web",
    "status": "Beta",
    "purpose": "Optional local FastAPI backend.",
    "whenToUse": "Use for ArcLM Studio.",
    "optionalDependencies": "web extra."
  },
  {
    "importPath": "arclm.tracking",
    "status": "Beta",
    "purpose": "Local run metadata and reproducibility helpers.",
    "whenToUse": "Use for experiment records.",
    "optionalDependencies": "Core dependencies."
  },
  {
    "importPath": "arclm.registry",
    "status": "Experimental",
    "purpose": "Lightweight extension registry surfaces.",
    "whenToUse": "Use only for advanced extension work.",
    "optionalDependencies": "Core dependencies."
  },
  {
    "importPath": "arclm.plugins",
    "status": "Experimental",
    "purpose": "Plugin interfaces.",
    "whenToUse": "Use only when integrating extension metadata.",
    "optionalDependencies": "Core dependencies."
  },
  {
    "importPath": "Legacy shims",
    "status": "Deprecated",
    "purpose": "Old import paths kept for compatibility.",
    "whenToUse": "Avoid in new code.",
    "optionalDependencies": "Same as replacements."
  }
];
