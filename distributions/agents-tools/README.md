# ArcLM Agents and Tools

Provider-independent Agent runtime, safe tools, permissions, approvals, tracing and sessions.

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
- arclm.simple_interface
- arclm.training
- arclm.finetuning

## Quick Start

```bash
python -c "from arclm.agents import Agent, AgentRunner; print(Agent, AgentRunner)"
```

## Relationship To Full ArcLM

This edition preserves the `arclm` namespace for independent installation. Do not install multiple partial ArcLM editions together unless composition is explicitly supported.
