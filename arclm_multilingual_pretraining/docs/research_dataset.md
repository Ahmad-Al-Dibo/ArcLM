# Dataset Research

## Data sources

A realistic multilingual pre-training setup should combine public-domain and permissively licensed text from Arabic and Dutch news, education, Wikipedia, books, and technical articles.

## Recommended composition

The corpus should balance the two languages carefully. A practical target is:

- Arabic: 45%
- Dutch: 45%
- Other multilingual material: 10%

This split reflects the need for strong bilingual capability and enough general-domain coverage for a small reference project.

## Quality filters

The pipeline removes HTML, spam, duplicates, OCR noise, and short fragments.
