# Pipeline Events Plan

Status: planning only. Pipeline events, WebSockets, and Server-Sent Events are
not implemented.

The Data Pipeline Studio will eventually need progress updates for longer
pipeline runs. The first implementation should avoid live events and start with
bounded read-only inspection.

## Future Event Types

| Event | Purpose |
| ----- | ------- |
| `pipeline_started` | A run begins |
| `step_started` | A step begins |
| `step_completed` | A step finishes with counts |
| `step_warning` | A bounded warning is emitted |
| `step_failed` | A step fails safely |
| `pipeline_completed` | The run finishes |
| `pipeline_cancelled` | The user cancels a run |

## Event Payload Draft

```json
{
  "event": "step_completed",
  "pipeline_id": "pipe_...",
  "run_id": "run_...",
  "step_id": "step-1",
  "status": "completed",
  "input_count": 100,
  "output_count": 95,
  "duration_ms": 123
}
```

## Transport Decision

No transport is approved yet.

Recommended order:

1. synchronous bounded preview responses
2. local job status endpoint
3. Server-Sent Events for read-only progress
4. WebSockets only if two-way interaction is truly needed

## Security Rules

Events must not include raw rows, secrets, absolute paths, or stack traces.
