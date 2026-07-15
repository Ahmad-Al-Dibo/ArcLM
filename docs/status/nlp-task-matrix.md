# NLP Task Matrix

This matrix checks end-to-end task support. A task is not `Implemented` unless architecture, dataset/collator, training objective, evaluation, inference, docs and tests exist together.

| NLP Task | Architecture | Dataset Support | Training | Evaluation | Inference | External Models | Status | Missing Work |
| -------- | ------------ | --------------- | -------- | ---------- | --------- | --------------- | ------ | ------------ |
| Text generation | Native GPT-like causal LM; optional HF causal LM loading | TXT/native token datasets; SFT text/instruction/chat | Causal LM training and SFT | Loss, perplexity, token accuracy | `Generator`, `load_model`, `predict`, external HF generate | Partial HF/external through loaders | Implemented | Greedy mode, streaming, batched generation, more HF runtime tests |
| Text classification | No classifier head | Generic list/CSV/JSON loading only | No classification trainer/objective | Accuracy metric exists | No classification inference API | Custom PyTorch possible manually | Not Implemented | Model head, collator, loss, trainer docs/tests |
| Token classification | No token classification model | Generic datasets only | No token-classification objective | Token accuracy exists but for LM labels | No token classification inference | Custom possible manually | Not Implemented | Architecture/head, labels, metrics, docs |
| Named Entity Recognition | No NER model | No BIO dataset support | No NER training | No NER metrics | No NER inference | No tested external NER flow | Not Implemented | BIO data, token classification, entity metrics |
| Question answering | No QA architecture | Instruction/prompt data can represent QA text | SFT can train responses | Basic LM metrics only | Generation can answer prompts | HF causal LM possible | Partially Implemented | QA-specific datasets, metrics, extraction/generative eval |
| Text summarization | No seq2seq model; causal SFT possible | Prompt-response data can represent summarization | SFT possible | No ROUGE/BLEU | Generation only | HF causal LM possible | Partially Implemented | Summarization dataset helpers, metrics, docs/tests |
| Machine translation | No seq2seq model; causal SFT possible | Instruction/prompt-response can represent translation | SFT possible | No BLEU/chrF | Generation only | HF causal LM possible | Partially Implemented | Translation metrics and examples |
| Text embeddings | No embedding API | Generic datasets only | No embedding training | No embedding metrics | No embedding inference | No tested embedding models | Not Implemented | Encoder/embedding model and API |
| Semantic similarity | No embedding/cross-encoder model | Generic datasets only | No similarity objective | No similarity metrics | No API | No tested flow | Not Implemented | Pair datasets, loss, metrics |
| Text reranking | No reranker model | Generic datasets only | No ranking objective | No ranking metrics | No rerank API | No tested flow | Not Implemented | Ranking data/loss/eval |
| Masked language modeling | No MLM architecture/head | No MLM masking collator | No MLM loss | No MLM metrics | No fill-mask inference | No tested flow | Not Implemented | Encoder/MLM head, masking collator |
| Causal language modeling | Native GPT-like LM | `TextDataset`, token datasets, SFT collator | `Trainer`, `train_model`, SFT | Loss, perplexity, token accuracy | `Generator`, native checkpoint inference | PyTorch/HF-style via adapters in SFT; HF external inference partial | Implemented | More external runtime tests |
| Sequence-to-sequence generation | No encoder-decoder/T5 native model | Generic prompt-response only | Causal SFT only, no seq2seq trainer | No seq2seq metrics | Generation only | No tested seq2seq HF flow | Not Implemented | Encoder-decoder support |
| Text regression | No regression head/objective | Generic datasets only | No regression training | No regression metrics | No API | No tested flow | Not Implemented | Regression model/loss/metrics |
| Information extraction | No IE model | Prompt-response can encode examples | SFT possible | No extraction metrics | Generation only | Custom possible manually | Partially Implemented | Task schema, metrics, examples/tests |
| Relation extraction | No relation model | Generic datasets only | No relation objective | No relation metrics | No API | No tested flow | Not Implemented | Relation datasets/model/eval |
| Keyword extraction | No keyword model | Generic datasets only | No keyword objective | No keyword metrics | Generation could be prompted manually | No tested flow | Not Implemented | Task API and metrics |
| Text clustering | No embedding/clustering API | Generic datasets only | No clustering training | No clustering metrics | No API | No tested flow | Not Implemented | Embeddings and clustering helpers |
| Paraphrase detection | No pair classifier | Generic datasets only | No pairwise objective | No paraphrase metrics | No API | No tested flow | Not Implemented | Pair data/model/eval |

## Summary

End-to-end stable NLP task support is currently strongest for causal language modeling and text generation. Several prompt-based tasks are possible through SFT, but they are not task-specific implementations because they lack dedicated datasets, collators, metrics, inference wrappers, documentation and tests.
