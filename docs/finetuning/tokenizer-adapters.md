# Tokenizer Adapters

`TokenizerAdapter` ondersteunt tokenizers met:

- `encode_text`
- `encode`
- callable tokenizer output met `input_ids`
- optioneel `apply_chat_template`

De adapter leest `pad_token_id` en `eos_token_id` wanneer die bestaan. Als er
geen pad token is, gebruikt ArcLM een veilige testvriendelijke fallback van `0`.
