# Dataset Research

## Data strategy

A 50M-parameter multilingual model should be trained on a curated mixture of high-quality Arabic and Dutch text rather than raw web noise alone. The most practical approach is to combine public-domain and permissively licensed sources with a strong quality filter.

## Arabic sources

Recommended sources for Arabic include:

- Arabic Wikipedia and Wikisource
- Arabic news archives with compatible licenses
- public-domain books and historical texts
- educational and university materials
- government and public-sector publications
- scientific articles and technical documentation
- filtered Common Crawl and OSCAR samples

A practical target mix is:

- Wikipedia and educational material: 25%
- news and government text: 20%
- books and long-form literature: 20%
- scientific and technical content: 20%
- filtered web crawl: 15%

## Dutch sources

Recommended sources for Dutch include:

- Dutch Wikipedia
- government publications and policy documents
- educational resources and textbooks
- public-domain books
- technical documentation and programming resources
- scientific publications
- filtered Common Crawl and OSCAR samples

A practical target mix is:

- Wikipedia and educational material: 30%
- government and public documents: 20%
- books and long-form writing: 20%
- scientific and technical content: 15%
- filtered web crawl: 15%

## Language balance

For a small bilingual model, an approximate split of 55% Arabic and 45% Dutch is a strong starting point. Arabic benefits from a slightly larger share because the model should be robust to Arabic-specific morphology and script complexity, while Dutch still needs enough data to preserve strong quality in the second language.

## Domain distribution

A balanced domain mix improves generalization. A practical target is:

- general knowledge: 25%
- science and technology: 20%
- education and documentation: 15%
- government and law: 10%
- history and culture: 10%
- literature and conversation: 10%
- news and current events: 10%

## Quality requirements

The preprocessing pipeline should remove:

- HTML and boilerplate
- duplicated and near-duplicated text
- spam and advertising noise
- low-information fragments
- OCR artifacts and broken encoding
- extremely short documents
- PII-heavy text where possible
- toxic or clearly low-quality content

## Expected outcome

A carefully filtered mix of Arabic and Dutch text should allow the model to learn useful multilingual representations and produce better cross-lingual behavior than a uniformly sampled or noisy corpus.
