# ArcLM Web Simple Mode

Simple mode is the default interface mode for the ArcLM Web UI.

## Purpose

Simple mode keeps pages short and clear. It is meant for users who want to know
what a page does, whether it is available, and what milestone owns the next
step.

## Current Behavior

- Default mode is `Simple`.
- The preference is stored in browser local storage as `arclm-interface-mode`.
- Invalid stored values fall back to `Simple`.
- The same routes, shell, and components are used as Advanced mode.
- The overview route now shows the Simple Dashboard when the local Web API is
  available.

## What Simple Mode Shows

- Page title
- Short description
- Current status
- Milestone note
- Honest unavailable or planned state when a workflow is not built yet
- Backend connection state from `/api/health`
- ArcLM version and current Web milestone from `/api/project/status`
- Simple CPU/CUDA device summary from `/api/environment`
- A small capability summary from `/api/capabilities`
- Route links and copyable CLI previews for existing commands

## Simple Dashboard

The Simple Dashboard answers five beginner questions:

1. Is ArcLM working?
2. What device will it use?
3. What can I do now?
4. What is not available yet?
5. What should I do next?

The dashboard coordinates these read-only endpoints:

```text
GET /api/health
GET /api/environment
GET /api/capabilities
GET /api/project/status
```

It keeps the page usable when one secondary endpoint fails. For example, a
successful health check can still show the backend as connected while the device
card explains that environment details could not be read.

The refresh action reuses the same endpoints and does not poll continuously.
Last successful data can remain visible during a failed refresh.

## What Simple Mode Does Not Show

- Fake backend status
- Fake models, datasets, training runs, GPU data, metrics, or checkpoints
- Internal route metadata
- Raw project-map content
- Raw JSON responses
- Full package versions, compute capability, driver output, or private paths
- Browser training controls or dataset upload controls
- Advanced capability matrices, validation tables, integration details, and API
  response JSON

## Limitation

Simple mode currently controls frontend detail level only. It does not start
training, evaluation, inference, or dataset workflows. The Simple Dashboard is
read-only and uses real backend data only.

Advanced mode adds technical dashboard details on the same `/` route. Simple
mode keeps those sections hidden so beginner users see only the compact status
view.
