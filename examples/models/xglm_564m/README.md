# XGLM 564M

Dit voorbeeld gebruikt `facebook/xglm-564M`, een meertalig base-model uit de XGLM-familie. Het is gekozen om een niet-instruct meertalig model te tonen.

De workflow gebruikt prompt/completion-data in plaats van chatdata. Chat-template en structured tool calling staan op `unsupported`. Omdat de Hub-metadata geen safetensors liet zien, krijgt security extra waarschuwing en moet download handmatig worden beoordeeld.

Gebruik `01_check_requirements.py`, daarna alleen bewust `02_download_model.py --allow-download`. Dataset: `data/xglm_564m`. Runtime laden, generatie, SFT, save/reload en benchmark zijn nog niet lokaal geverifieerd.

