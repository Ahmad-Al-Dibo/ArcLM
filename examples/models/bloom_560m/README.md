# BLOOM 560M

Dit voorbeeld gebruikt `bigscience/bloom-560m`, een meertalig base-model uit de BLOOM-familie. Het is gekozen als base-tegenhanger voor BLOOMZ en telt niet als derde variant van dezelfde familie.

De workflow gebruikt prompt/completion-data en maakt geen chat-templateclaim. Download, laden, forward, generatie, SFT, save/reload en benchmark zijn nog niet lokaal uitgevoerd; metadata en security zijn wel handmatig gecontroleerd.

Gebruik `01_check_requirements.py` en daarna `02_download_model.py --allow-download`. Dataset: `data/bloom_560m`. Beperkingen: geen lokale gewichtstest en geen kwaliteitsclaim per taal.

