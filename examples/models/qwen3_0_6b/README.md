# Qwen3 0.6B

Dit voorbeeld gebruikt `Qwen/Qwen3-0.6B`, een Qwen3-instructmodel met meertalige metadata. Het is gekozen omdat het relatief klein is, safetensors aanbiedt en een moderne chat/instruct-familie vertegenwoordigt.

Geteste ArcLM-mogelijkheden in deze sessie: metadata-inspectie en manifest/security-controle. Download, tokenizer laden, model laden, forward, generatie, SFT, opslaan, offline herladen, evaluatie, benchmark en Agent-integratie staan nog op `not_tested` totdat de lokale runner ze uitvoert.

Hardware: voer eerst `python examples/models/qwen3_0_6b/01_check_requirements.py` uit. Download expliciet met `python examples/models/qwen3_0_6b/02_download_model.py --allow-download`. Offline laden gebruikt `--offline` en de geconfigureerde `--model-root`.

Datasetvoorbereiding leest `data/qwen3_0_6b`, valideert records, past waar mogelijk de chat-template toe, tokeniseert, truncateert en toont alleen een begrensde preview. Fine-tuning start via `06_finetune_sft.py`, maar wordt pas als bewezen gemarkeerd na een echte train-save-reload-cyclus. Beperkingen: geen lokale gewichtstest in deze sessie, geen kwaliteitsclaim per taal, geen verborgen redeneringen in de dataset.

