# ArcLM Agents & Tools Block

Provider-independent agent runtime with typed tools, permissions, approvals, tracing and safe builtins. No PyTorch required.

This directory is generated from canonical ArcLM source. Do not edit generated source files directly.

## Contains

- agents
- tools
- permissions
- approvals
- tracing
- sessions

## Excludes

- arclm.web
- arclm.training
- arclm.inference

## Install

From a built wheel in this directory:

```bash
pip install .
```

Or directly from the canonical repository (once published):

```bash
pip install "git+https://github.com/ahmad-al-dibo/arclm.git#subdirectory=distributions/agents-tools"
```

## Quick Start

```bash
python -c "from arclm.agents import Agent, tool, ToolRegistry; print(Agent)"
```

## Relationship To Full ArcLM

This block is a trimmed, self-contained edition of ArcLM. Install it **instead of** the full package, not alongside it.
