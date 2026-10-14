# ArcLM Security

Security policy, safe paths/URLs, redaction, hashing, signatures, encryption and secure artifact helpers.

This directory is generated from canonical ArcLM source. Do not edit generated source files directly.

## Contains

- security_policy
- redaction
- safe_paths
- safe_urls
- hashing
- signatures
- encryption
- secure_artifacts

## Excludes

- arclm.web
- arclm.simple_interface
- arclm.training
- arclm.agents

## Quick Start

```bash
python -c "from arclm.security import security_status; print(security_status())"
```

## Relationship To Full ArcLM

This edition preserves the `arclm` namespace for independent installation. Do not install multiple partial ArcLM editions together unless composition is explicitly supported.
