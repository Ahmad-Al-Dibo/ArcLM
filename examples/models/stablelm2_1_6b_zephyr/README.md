# StableLM 2 Zephyr 1.6B

Dit voorbeeld gebruikt `stabilityai/stablelm-2-zephyr-1_6b`, een chatmodel uit de StableLM2-familie. Het is gekozen als grotere, maar nog compacte, chatfamilie met safetensors.

De workflow bevat veilige entrypoints voor download, laden, generatie, datasetvoorbereiding, SFT, evaluatie, benchmark, opslag, offline herladen, security en chat. Door de CPU-only preflight is SFT waarschijnlijk resource-zwaar en daarom nog niet bewezen.

Gebruik `01_check_requirements.py` en download alleen met `02_download_model.py --allow-download`. Dataset: `data/stablelm2_1_6b_zephyr`. Beperkingen: geen lokale gewichtstest, geen SFT-lifecycle en geen Agent-verificatie uitgevoerd.

