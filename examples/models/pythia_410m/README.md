# Pythia 410M

Dit voorbeeld gebruikt `EleutherAI/pythia-410m`, een Engelstalig base-model met GPT-NeoX-architectuur. Het is gekozen als compacte base-model familie buiten Llama/BLOOM.

De dataset gebruikt prompt/completion-records. Chat-template en structured tool calling zijn `unsupported`. Download, laden, forward, generatie, SFT, save/reload en benchmark worden pas bewezen na lokale uitvoering.

Gebruik `01_check_requirements.py` en daarna `02_download_model.py --allow-download`. Dataset: `data/pythia_410m`. Er is geen lokale gewichtstest of SFT-lifecycle in deze sessie uitgevoerd.

