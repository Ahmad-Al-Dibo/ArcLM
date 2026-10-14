# BLOOMZ 560M

Dit voorbeeld gebruikt `bigscience/bloomz-560m`, een meertalig instructiemodel uit de BLOOM-familie. Het is gekozen vanwege de meertalige dekking, compacte grootte en safetensors.

De map behandelt download, tokenizer/model laden, generatie, datasetvoorbereiding, SFT-entrypoint, evaluatie, benchmark, opslag en offline herladen. Chat-template en tool-calling worden niet als bewezen ondersteund geclaimd. Runtime-statussen blijven `not_tested` tot lokale uitvoering.

Gebruik `01_check_requirements.py`, daarna `02_download_model.py --allow-download`. Dataset: `data/bloomz_560m`. Beperkingen: geen lokale gewichtstest, geen SFT-lifecycle en geen taal-kwaliteitstest uitgevoerd.

