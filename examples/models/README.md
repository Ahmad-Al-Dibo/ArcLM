# ArcLM voorbeelden voor ondersteunde modellen

Deze suite demonstreert hoe ArcLM veilig met echte Hugging Face causal language models kan werken. De voorbeelden gebruiken een manifest, expliciete downloads, resource-preflight, lokale opslag, tokenizer/model-laden, begrensde generatie, datasetvoorbereiding, SFT-entrypoints, evaluatie, benchmark, save/reload, Agent-memory en een lokale webstudio.

Belangrijk: geen model wordt hier als runtime-geverifieerd geclaimd zolang de lokale scripts niet echt download, tokenizer-load, model-load, forward, generatie en reload/cache-reload hebben uitgevoerd. In deze sessie zijn metadata en securityregels gecontroleerd; de machine is CPU-only en mist `peft`, `flask` en `pytest` in de project-venv.

## Gebruik

```bash
python examples/models/run_model_examples.py list
python examples/models/run_model_examples.py preflight
python examples/models/run_model_examples.py verify --model qwen3_0_6b --allow-download
python examples/models/run_model_examples.py verify-all --allow-download
python examples/models/run_model_examples.py sft --model smollm2_360m_instruct
python examples/models/run_model_examples.py benchmark --verified-only
python examples/models/run_model_examples.py status
```

Downloads gebeuren alleen met `--allow-download`. Offline herladen gebruikt `--offline` en mag geen netwerkverzoek doen. Remote code staat standaard uit.

## Geselecteerde families

De manifestselectie bevat Qwen3, SmolLM2, TinyLlama, BLOOM/BLOOMZ, XGLM, Pythia, OLMo2, Falcon3 en StableLM2. Gemma 3 270M IT is als gated/manual verworpen voor automatische selectie.

## Statussen

Elke operatie heeft een eigen status: `verified`, `verified_cpu`, `verified_gpu`, `verified_manual`, `experimental`, `dependency_missing`, `gated`, `resource_blocked`, `unsupported`, `failed` of `not_tested`.

## Veiligheid

De voorbeelden pinnen revisies waar metadata beschikbaar was, gebruiken `trust_remote_code=False`, prefereren safetensors en accepteren in de webstudio alleen manifest-ID's. Browserinput mag geen willekeurige lokale paden of repositories selecteren.

