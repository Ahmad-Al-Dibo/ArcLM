# SmolLM2 360M Instruct

Dit voorbeeld gebruikt `HuggingFaceTB/SmolLM2-360M-Instruct`, een klein Engelstalig instructiemodel uit de SmolLM2-familie. Het is gekozen als compacte instructiekandidaat met safetensors en native Transformers-architectuur.

De map toont download, lokaal laden, generatie, datasetvoorbereiding, SFT-entrypoint, evaluatie, benchmark, veilig opslaan en offline herladen. In deze sessie zijn alleen metadata en securityregels gecontroleerd; runtime-operaties blijven `not_tested` tot de scripts lokaal draaien.

Gebruik `01_check_requirements.py` voor hardwarecontrole, `02_download_model.py --allow-download` voor expliciete download en `09_reload_local_model.py --offline` voor lokale herlaadcontrole. De dataset staat in `data/smollm2_360m_instruct`. Beperkingen: geen lokale gewichtstest of SFT-cyclus uitgevoerd; geen meertalige kwaliteitsclaim.

