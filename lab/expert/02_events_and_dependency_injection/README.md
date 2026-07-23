# Design events and dependency injection

## Level

expert

## Category

events

## Challenge type

from_scratch

## Estimated time

120 minutes

## Difficulty

expert

## Prerequisites

expert-01-registry-and-plugins

## ArcLM areas covered

event order, cancellation, singleton, transient, scoped services

## Learning objectives

Understand the concept, implement the public contract, handle edge cases, and explain how the result fits ArcLM architecture.

## Concept foundations

Relevant background may include Autoregressive Language Modeling, SentencePiece, Byte Pair Encoding, Unigram Language Model Tokenization, Adam, AdamW, LoRA, PyTorch Distributed Data Parallel, Fully Sharded Data Parallel, ZeRO, and Supervised Fine-Tuning. These references explain concepts; they do not imply every technique is implemented in production ArcLM.

## Background

This from scratch challenge isolates events behavior so learners can practice without modifying production code.

## Task

Complete the functions/classes in `challenge.py` according to their docstrings. Keep the implementation small, deterministic, CPU-compatible, and local to this challenge folder.

## Functions/classes to implement

`EventBus`, `ServiceContainer`

## Input contract

Use bounded in-memory values or files under this challenge fixture directory. Validate required fields and reject unsupported combinations explicitly.

## Output contract

Return deterministic Python objects, dataclasses, or JSON-safe dictionaries. Do not include absolute filesystem paths or executable objects.

## Examples

Normal input:
A tiny synthetic record or configuration matching the contract in `challenge.py`.

Expected output:
A deterministic Python object or JSON-safe dictionary described by the output contract.

Edge input:
Empty or minimal valid input.

Expected behavior:
Return an empty but valid result, or raise the documented validation error when the concept cannot be represented.

Invalid input:
A wrong type, unsafe path, malformed record, or invalid configuration value.

Expected behavior:
Raise `ValueError`, `TypeError`, or the documented challenge-specific error with a clear message.

## Edge cases

Handle empty collections, duplicate identifiers, missing fields, invalid numeric ranges, truncation boundaries, and non-mutating behavior when relevant.

## Restrictions

No network, no downloads, no GPU requirement, no arbitrary filesystem paths, no shell execution from input, no eval/exec, no writes outside temporary directories or this challenge fixture area.

## How to run

`python -m lab.runner show expert-02-events-and-dependency-injection` and `python -m lab.runner test expert-02-events-and-dependency-injection`.

## Acceptance criteria

Metadata matches the manifest, public tests pass after implementation, edge cases are covered, and the solution remains isolated from production ArcLM code.

## Hints

Start with the smallest normal example, add validation next, then handle edge cases. Prefer explicit errors over silent reinterpretation.

## Further concepts

After solving, compare the simplified design with the closest ArcLM public API or production boundary named in the root Lab documentation.
