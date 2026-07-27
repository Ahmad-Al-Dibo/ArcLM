# Lokale memory-Agent

Dit project demonstreert een begrensde Agent-architectuur met veilige tools en configureerbare memory. De orchestration kan met een deterministische fake adapter worden getest. Een echte lokale modelrun mag pas als bewezen worden gemarkeerd nadat een model uit het manifest lokaal is geladen en gebruikt.

Memory ondersteunt `disabled`, `in_memory` en `json_persistent`. Er wordt alleen zichtbare conversatie, toegestaan toolresultaat en metadata opgeslagen; geen verborgen redeneringen of secrets.

