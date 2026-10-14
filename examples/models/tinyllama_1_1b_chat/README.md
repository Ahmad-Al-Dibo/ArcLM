# TinyLlama 1.1B Chat

Dit voorbeeld gebruikt `TinyLlama/TinyLlama-1.1B-Chat-v1.0`, een chatmodel uit de TinyLlama-familie. Het is gekozen als compacte chatkandidaat met safetensors en een bekende Llama-achtige architectuur.

De scripts demonstreren expliciete download, tokenizer/model laden, generatie, datasetvoorbereiding, SFT-entrypoint, evaluatie, benchmark, opslag, offline herladen en chatformattering. Alleen metadata/security is nu gecontroleerd; runtime-statussen blijven `not_tested` tot lokale uitvoering.

Start met `01_check_requirements.py`. Download met `02_download_model.py --allow-download`. Offline laden gebruikt `--offline`. Dataset: `data/tinyllama_1_1b_chat`. Beperkingen: geen lokale SFT of Agent-verificatie uitgevoerd.

