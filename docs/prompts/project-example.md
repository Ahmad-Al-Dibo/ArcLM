# Task: Build an ArcLM Pre-training Project (Arabic + Dutch)

You are an AI software engineer.

Your task is to create a **complete pre-training project** using **ArcLM only** whenever possible.

## Important Rules

* Use **ArcLM APIs whenever they exist.**
* Do **NOT** replace ArcLM functionality with Hugging Face, Lightning, Accelerate, DeepSpeed, etc., unless ArcLM has absolutely no equivalent.
* Keep the code clean, readable, modular, and production-quality.
* No placeholder code.
* No TODO comments.
* Every file must work.

---

# Goal

Build a decoder-only language model that is pre-trained on a multilingual corpus containing:

* Arabic
* Dutch (Nederlands)

The project must demonstrate a realistic pre-training pipeline.

---

# Required Project Structure

Generate a complete project including:

* configuration
* dataset pipeline
* tokenizer pipeline
* preprocessing
* cleaning
* deduplication
* normalization
* training
* validation
* checkpoints
* evaluation
* inference example
* README
* documentation

Everything should be organized as a professional project.

---

# Use Clean Training Data

The dataset must contain only high-quality text.

Avoid:

* duplicated text
* spam
* HTML
* advertisements
* corrupted text
* OCR garbage
* machine-generated junk
* extremely short samples

Document every cleaning step.

---

# Languages

The model must support:

* Arabic
* Dutch

Explain:

* why these languages were chosen
* how multilingual balancing works
* expected tokenizer behavior

---

# Research

Produce a research document explaining:

## Dataset

Describe:

* data sources
* licenses
* estimated size
* quality
* strengths
* weaknesses

---

## Language Distribution

Estimate an appropriate distribution.

For example:

* Arabic XX%
* Dutch XX%

Explain why.

Do not choose numbers randomly.

Support them using research and reasoning.

---

## Topics

Describe which domains should be included.

Examples:

* news
* science
* education
* programming
* books
* Wikipedia
* government
* law
* medicine
* history
* mathematics
* culture
* technology

Estimate approximately how much of each topic should appear.

---

## Knowledge Coverage

Explain what knowledge the model should learn.

For example:

* grammar
* reasoning
* factual knowledge
* world knowledge
* programming
* mathematics
* dialogue
* writing
* summarization

---

# Model Architecture

Create a document explaining the architecture.

Include:

* embedding layer
* positional embeddings
* transformer blocks
* multi-head attention
* feed-forward network
* normalization
* residual connections
* output layer

Explain every component.

Include diagrams if possible.

---

# Model Configuration Research

Research and recommend values for:

* vocabulary size
* sequence length
* embedding dimension
* hidden size
* number of layers
* number of attention heads
* feed-forward dimension
* dropout
* optimizer
* scheduler
* learning rate
* warmup
* batch size
* gradient accumulation
* weight decay
* epochs
* checkpoint frequency

Explain **why** each value was selected.

---

# Tokenizer

Document:

* tokenizer type
* training process
* normalization
* Unicode handling
* Arabic normalization
* Dutch normalization
* special tokens

Explain why this tokenizer is appropriate.

---

# Documentation

Create detailed documentation.

Include:

* architecture
* data pipeline
* preprocessing
* tokenizer
* training pipeline
* evaluation pipeline
* inference pipeline
* project structure

---

# README

Write a professional README containing:

* overview
* installation
* requirements
* project structure
* quick start
* training
* evaluation
* inference
* configuration
* troubleshooting

---

# Code Quality

The generated code must be:

* modular
* documented
* typed
* production-ready
* easy to extend

---

# Final Deliverables

Produce:

1. Complete ArcLM project
2. Complete documentation
3. Architecture document
4. Dataset research
5. Language balancing research
6. Model configuration research
7. Tokenizer documentation
8. README
9. Fully working training code using ArcLM as much as possible
10. Evaluation and inference examples

Do **not** simplify the task. Generate a complete professional implementation suitable as a reference project.

---

## Best Practices Requirement

Implement **all relevant modern best practices** for building a high-quality language model training pipeline. Do not implement only the minimum required functionality.

Whenever a technique improves model quality, reliability, maintainability, security, reproducibility, or scalability, include it if ArcLM supports it or if it can be implemented around ArcLM without replacing its core functionality.

This includes, but is not limited to:

### Data Engineering

* Data validation
* Data quality scoring
* Dataset profiling
* Dataset versioning
* Data lineage
* Data cleaning
* Text normalization
* Unicode normalization
* Language detection
* Deduplication
* Near-duplicate detection
* Noise filtering
* PII detection and removal where appropriate
* Toxic content filtering
* Spam filtering
* HTML and markup removal
* Corrupted sample detection
* Dataset statistics
* Automatic preprocessing reports

### Training

* Reproducible training
* Random seed management
* Deterministic execution where possible
* Mixed precision
* Gradient accumulation
* Gradient clipping
* Learning rate scheduling
* Warmup
* Checkpointing
* Resume training
* Early stopping (if appropriate)
* Automatic validation
* Periodic evaluation
* Automatic metric logging
* Training reports
* Performance profiling
* Memory usage reporting

### Evaluation

* Validation loss
* Perplexity
* Sample generation
* Benchmark-ready evaluation pipeline
* Evaluation reports
* Error analysis

### Tokenizer

* Vocabulary analysis
* Token frequency analysis
* Coverage statistics
* Unknown token analysis
* Tokenizer quality reports

### Security and Reliability

* Configuration validation
* Input validation
* Safe file handling
* Path sanitization
* Secure checkpoint loading
* Dependency validation
* Exception handling
* Structured logging
* Recovery from interrupted training

### Software Engineering

* Modular architecture
* Type hints
* Unit tests where appropriate
* Configuration management
* Documentation
* Clear code comments
* Professional project structure
* Extensible design
* Maintainable code

### Reporting

Automatically generate reports whenever possible, including:

* Dataset report
* Cleaning report
* Language distribution report
* Tokenizer report
* Training report
* Validation report
* Evaluation report
* Model summary
* Hardware utilization report
* Final experiment summary

The objective is to produce a **production-quality reference implementation** that demonstrates as many recommended engineering, machine learning, and data processing techniques as are appropriate for a modern LLM pre-training pipeline, while relying on **ArcLM as much as possible** for the core implementation.
