# Expert Lab

Systems architecture: registries, events, dependency injection, distributed planning, FSDP policy, fault tolerance, and design records.

## Challenges

- `expert-01-registry-and-plugins` - Build a safe component registry (registry, from_scratch)
- `expert-02-events-and-dependency-injection` - Design events and dependency injection (events, from_scratch)
- `expert-03-distributed-runtime` - Plan distributed runtime safely (distributed, from_scratch)
- `expert-04-ddp-planning` - Model DDP responsibilities (distributed, from_scratch)
- `expert-05-fsdp-checkpoint-policy` - Design FSDP checkpoint policy (checkpoints, from_scratch)
- `expert-06-fault-tolerance` - Design resumable job coordination (lifecycle, from_scratch)
- `expert-07-architecture-decisions` - Write and review architecture decisions (architecture, from_scratch)
- `expert-08-expert-capstone` - Build a runtime architecture simulator (architecture, from_scratch)

## Run

`python -m lab.runner test-level expert`

## Contributor Notes

Keep new challenges local to `lab/`, add metadata, public tests, manifest entries, examples, and prerequisites before submitting.