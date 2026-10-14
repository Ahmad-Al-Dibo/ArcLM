# ArcLM Security Block

Policy enforcement, encryption, hashing, signing, redaction and safe path/URL helpers. No PyTorch required.

This directory is generated from canonical ArcLM source. Do not edit generated source files directly.

## Contains

- security
- crypto
- redaction
- policy
- signing

## Excludes

- arclm.web
- arclm.training
- arclm.agents

## Install

From a built wheel in this directory:

```bash
pip install .
```

Or directly from the canonical repository (once published):

```bash
pip install "git+https://github.com/ahmad-al-dibo/arclm.git#subdirectory=distributions/security"
```

## Quick Start

```bash
python -c "from arclm.security import security_status; print(security_status())"
```

## Relationship To Full ArcLM

This block is a trimmed, self-contained edition of ArcLM. Install it **instead of** the full package, not alongside it.
