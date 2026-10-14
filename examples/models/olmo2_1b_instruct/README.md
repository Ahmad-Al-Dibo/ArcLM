# OLMo 2 1B Instruct

Dit voorbeeld gebruikt `allenai/OLMo-2-0425-1B-Instruct`, een Engelstalig instructiemodel uit de OLMo2-familie. Het is gekozen voor familiediversiteit en safetensors.

De scripts tonen de volledige workflow als veilige entrypoints. In deze sessie zijn metadata en security gecontroleerd; echte download, load, forward, generatie, SFT, save/reload, evaluatie, benchmark en Agent-status blijven `not_tested`.

Gebruik `01_check_requirements.py`, `02_download_model.py --allow-download` en daarna de vervolgscriptvolgorde. Dataset: `data/olmo2_1b_instruct`. Beperkingen: geen lokale SFT-lifecycle of tool-callingclaim.

