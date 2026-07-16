# Approve Web Milestone 2 / Feature 3: Dataset Inspector UI

Begin implementation of Web Milestone 2 / Feature 3 only.

Build a modern, read-only Dataset Inspector UI using the existing:

* Application Shell
* Design System
* Simple and Advanced interface modes
* Typed frontend API client
* Dataset Inspector Backend
* `GET /api/datasets`
* `GET /api/datasets/{dataset_id}/inspection`

Do not begin:

* Dataset upload
* Drag-and-drop
* Dataset deletion
* Dataset modification
* Field mapping
* Pipeline step registry
* Pipeline configuration
* Pipeline preview execution
* Before-and-after preprocessing comparison
* Pipeline save or load
* Full preprocessing runs
* Training handoff
* Dataset-to-Model Studio
* Charts requiring a new chart dependency
* WebSockets
* Server-Sent Events
* Background workers

Stop after the Dataset Inspector UI is implemented, tested, documented, and reflected in `PROJECT_MAP.md`.

---

# Source of Truth

Before changing code:

1. Read:

   * `docs/project/PROJECT_MAP.md`
   * `docs/project/MILESTONES.md`
   * `docs/project/FEATURE_MATRIX.md`
   * `docs/project/API_DESIGN.md`
   * `docs/project/TEST_STRATEGY.md`
   * `docs/project/SECURITY_MODEL.md`
   * `docs/web/data-pipeline-studio.md`
   * `docs/web/data-pipeline-api.md`
   * `docs/web/dataset-storage.md`
   * `docs/web/backend-api.md`
   * `docs/web/simple-mode.md`
   * `docs/web/advanced-mode.md`
   * `docs/web/security.md`
   * `docs/web/testing.md`

2. Inspect:

   * `web/src/app/data/`
   * Existing planned `/data` route
   * Existing Design System components
   * Existing dashboard API client patterns
   * Existing loading, error, empty, and disconnected states
   * Backend dataset schemas
   * Backend dataset tests

3. Confirm `[NEXT_APPROVED_ACTION]` points to:

```text
Web Milestone 2 / Feature 3:
Dataset Inspector UI
```

4. Run the current baseline.

Frontend:

```bash
cd web
npm run lint
npm run typecheck
npm run test
npm run build
```

Backend and Python:

```bash
python -m pytest tests/web -v
python -m pytest
python -m compileall src/arclm
python -m pip wheel . --no-deps
```

Record existing failures before implementation.

---

# Main Goal

Turn the `/data` route into a real Dataset Inspector.

The user should be able to:

```text
Open Data
→ see approved local datasets
→ select a dataset
→ inspect its summary
→ inspect detected fields
→ preview bounded rows
→ review basic statistics
→ review warnings and limits
```

The interface is read-only.

It must never allow the browser to submit or display a local file path.

---

# Core Architecture

Use one focused frontend feature layer.

Suggested direction:

```text
web/src/features/datasets/
├── dataset-inspector.tsx
├── dataset-list.tsx
├── dataset-summary.tsx
├── dataset-schema.tsx
├── dataset-preview.tsx
├── dataset-statistics.tsx
├── dataset-warnings.tsx
├── dataset-types.ts
├── dataset-format.ts
└── use-dataset-inspector.ts
```

Adapt this to the existing repository style.

Do not create every file when fewer files remain clearer.

Required flow:

```text
/data route
→ Dataset Inspector feature
→ existing typed API client
→ Dataset Inspector Backend
```

Do not duplicate backend parsing or statistics logic in TypeScript.

---

# Feature 3.1 — Frontend API Client Support

Extend the existing typed API client for:

```text
GET /api/datasets
GET /api/datasets/{dataset_id}/inspection
```

Create strict frontend types for:

* Dataset summary
* Dataset list response
* Dataset field
* Preview row
* Statistics
* Inspection metadata
* Warning
* Inspection response

Requirements:

* Validate required response shapes
* Handle unknown optional fields safely
* Reject invalid required structures
* Encode dataset IDs safely
* Use the existing timeout and error behavior
* No fake fallback data
* No arbitrary endpoint input
* No local path parameter

Do not create a general-purpose HTTP explorer.

---

# Feature 3.2 — Dataset Page Header

Replace the existing planned `/data` page.

Use the shared `PageHeader`.

Simple mode example:

```text
Data

Inspect approved local datasets before preprocessing or training.
```

Advanced mode may add:

```text
Data is read from server-configured dataset roots.
The browser receives safe dataset IDs, not filesystem paths.
```

Do not add:

* Upload button
* New dataset button
* Delete button
* Edit button
* Run pipeline button

A planned upload notice may be shown, but it must not look executable.

---

# Feature 3.3 — Backend and Dataset Loading States

The page must distinguish:

* Loading dataset catalogue
* Backend disconnected
* Catalogue loaded but empty
* Catalogue request failed
* Dataset inspection loading
* Dataset inspection failed
* Invalid inspection response
* Successful inspection

Do not confuse:

```text
No configured datasets
```

with:

```text
Backend disconnected
```

## Backend disconnected

Show a clear message:

```text
ArcLM backend is not connected

Start the local backend with an approved dataset root.
```

Show a copyable example command:

```bash
python -m arclm web-api --dataset-root workspace=./data
```

Do not execute the command.

## Empty catalogue

Show:

```text
No datasets are available

The backend is connected, but no supported dataset files were found
inside the configured dataset roots.
```

List supported formats:

```text
TXT, CSV, JSON, JSONL
```

Do not suggest scanning arbitrary computer folders.

---

# Feature 3.4 — Dataset Catalogue

Create a clear dataset-selection panel.

Each dataset item should show:

* Safe display name
* Format
* Human-readable size
* Selected state
* Dataset ID only in Advanced mode when useful

Do not show:

* Absolute path
* Parent directory
* Dataset-root path
* Username
* File ownership
* Modification path

Requirements:

* Deterministic order from backend
* Keyboard-accessible selection
* Selected item clearly indicated
* Long filenames handled safely
* Empty state supported
* Refresh action supported
* Mobile layout supported

Use buttons or links with correct semantics.

Do not use clickable `div` elements.

---

# Feature 3.5 — Dataset Selection State

Use a safe dataset ID as selection state.

Preferred behavior:

```text
/data?dataset=dataset_7d92e8c1
```

Requirements:

* Only safe dataset ID appears in the URL
* Direct loading with a valid dataset ID works
* Unknown ID shows a controlled state
* Selecting another dataset updates the URL
* Browser back and forward work
* Reload preserves the selected dataset
* No local path enters URL, storage, or logs
* Invalid IDs are not sent repeatedly

Do not persist dataset contents in local storage.

Do not store dataset paths anywhere in the frontend.

If query-state integration creates unnecessary complexity, use the simplest route-safe approach that preserves direct selection and browser navigation.

---

# Feature 3.6 — Dataset Summary

Show a compact summary for the selected dataset.

Simple mode should show:

* Dataset name
* Format
* File size
* Rows scanned
* Number of detected fields
* Preview row count
* Complete or bounded inspection
* Warning count

Example:

```text
instructions.jsonl

Format             JSONL
Size               470.9 KB
Rows inspected     10,000
Detected fields    3
Preview rows       20
Inspection scope   Bounded scan
Warnings           1
```

Advanced mode may additionally show:

* Safe dataset ID
* Scan limit
* Preview limit
* Exact or bounded status
* Detected encoding
* Schema source
* Truncation state

Do not claim total row count when only a bounded scan occurred.

Use wording such as:

```text
Rows scanned
```

rather than:

```text
Total rows
```

unless the backend explicitly reports an exact result.

---

# Feature 3.7 — Inspection Scope Notice

Display whether statistics are:

* Exact
* Based on a bounded scan
* Sample-based
* Unavailable

The scope must be prominent enough to prevent misunderstanding.

Examples:

```text
Complete inspection

All available rows were inspected.
```

```text
Bounded inspection

Statistics are based on the first 10,000 rows.
```

Do not hide this only inside Advanced mode.

Simple mode needs a short plain-language explanation.

Advanced mode may show the exact scan limit and metadata.

---

# Feature 3.8 — Schema View

Display detected dataset fields.

For each field, show:

* Name
* Inferred type
* Nullable state
* Observed row count where provided
* Mixed-type status where applicable

Simple mode may use compact cards or a small table.

Advanced mode may use a denser table.

Supported type labels include:

* String
* Integer
* Number
* Boolean
* Null
* Object
* Array
* Mixed

Requirements:

* Clearly state that inference may be sample-based
* Long field names wrap or truncate intentionally
* Mixed types receive a visible warning
* No raw nested object expansion
* No editable field mapping yet
* Empty schema state supported
* Tables use semantic markup

Do not add schema editing.

Field mapping is a later feature.

---

# Feature 3.9 — Preview Table

Display the bounded preview rows returned by the backend.

Requirements:

* Use only backend-returned preview data
* Never fetch the complete dataset
* Show row number or safe preview index
* Display detected fields as columns
* Safely render primitive values
* Summarize nested objects and arrays
* Display null clearly
* Preserve Unicode
* Long values are truncated visually
* Full returned value may be inspected deliberately when still within backend limits
* Table scrolls inside its container
* No page-wide horizontal scrolling
* Empty preview state supported

Do not render dataset values as:

* HTML
* Trusted Markdown
* Executable code
* Links automatically
* Images automatically

All values are untrusted plain data.

## Value display

Suggested labels:

```text
Null
Empty
Object
Array
Truncated
```

Do not confuse an empty string with a missing value.

## Row details

A safe read-only dialog may show one returned preview row in more detail.

It must:

* Show only data already returned by the bounded API
* Escape all content
* Not request arbitrary rows
* Not request arbitrary paths
* Not execute code
* Remain accessible

Do not add full-dataset row navigation yet.

---

# Feature 3.10 — Basic Statistics

Show the statistics implemented by the backend:

* Rows scanned
* Field count
* Missing values
* Empty strings
* Duplicate count within scanned rows
* Minimum text length
* Maximum text length
* Average text length
* Invalid-row count where available

Simple mode should prioritize:

* Rows scanned
* Missing values
* Empty values
* Duplicates
* Average text length

Advanced mode may show field-level details and exact scope.

Every statistic must communicate its scope.

Example:

```text
Duplicates in inspected rows
18
```

Not:

```text
Dataset duplicates
18
```

when the scan was bounded.

Do not add charts during this feature.

Use cards, key-value lists, or compact tables.

Do not calculate new statistics in the browser.

---

# Feature 3.11 — Field-Level Quality Summary

Where backend statistics provide per-field information, show:

* Missing values per field
* Empty strings per field
* Observed type
* Length values where available

If the backend does not provide field-level statistics, do not invent them.

Do not extend the backend solely for decorative UI.

A small backward-compatible schema extension is allowed only when the audit already identified it as required and the result remains bounded and safe.

Document every backend schema change.

---

# Feature 3.12 — Warning Panel

Display all backend warning objects.

Supported examples:

* Scan limit reached
* Preview truncated
* Field value truncated
* Mixed field types
* Too many fields
* Unsupported nested values

Each warning should show:

* Plain-language title
* Plain-language explanation
* Stable warning code in Advanced mode
* Affected field or row only when safely provided

Do not expose raw parser exceptions.

Do not expose malformed row contents.

Unknown warning codes must render with neutral styling:

```text
Dataset inspection warning
```

Do not discard unknown warnings silently.

---

# Feature 3.13 — Supported Format Guidance

Add a compact informational section or empty-state note.

Show:

```text
Supported in this version

TXT
CSV
JSON
JSONL
```

Explain briefly:

* TXT uses non-empty lines as text records
* CSV uses its header fields
* JSON accepts approved record structures
* JSONL expects one JSON object per line

Do not turn this into complete upload documentation.

Upload is not implemented.

---

# Feature 3.14 — Refresh Behavior

Provide one refresh action.

Refresh should:

1. Reload the dataset catalogue
2. Preserve selected dataset when it still exists
3. Reload its inspection
4. Clear selection when it no longer exists
5. Prevent duplicate overlapping requests
6. Preserve last successful display where appropriate
7. Show stale state when refresh fails
8. Never poll automatically at high frequency

Do not add a global state library.

Use a small feature hook or controller.

---

# Feature 3.15 — Simple Mode

Simple mode should present:

```text
Dataset list
Dataset summary
Inspection scope
Detected fields
Preview
Essential quality statistics
Warnings
```

Use plain-language explanations.

Hide:

* Safe dataset ID
* Raw warning codes
* Full scan-limit metadata
* API response objects
* Technical parser details
* Internal response fields

Keep the interface approachable for users who do not understand dataset engineering.

---

# Feature 3.16 — Advanced Mode

Advanced mode should use the same inspection result and add:

* Safe dataset ID
* Format identifier
* Exact scan and preview limits
* Complete/bounded flags
* Schema source
* Observed row counts
* Raw warning codes
* Detailed statistics scope
* Bounded read-only API-response inspector where useful

Reuse the existing safe inspector patterns from the Advanced Dashboard.

Do not make a new unrestricted API inspector.

Do not create a second data-loading lifecycle.

Do not duplicate the entire page.

---

# Feature 3.17 — Planned Pipeline Studio Notice

At the bottom of the page, add an honest next-stage section:

```text
Next: Data Pipeline Studio

A later feature will allow supported preprocessing steps to be
validated and previewed on a bounded sample.
```

May list planned capabilities:

* Field mapping
* Cleaning steps
* Filtering
* Deduplication
* Preview
* Before/after comparison

Do not add active controls for these features.

Do not show a fake pipeline graph.

---

# Visual Layout

Recommended desktop structure:

```text
Page header and refresh

Two-column workspace
├── Dataset catalogue
└── Selected dataset content
    ├── Summary
    ├── Inspection scope
    ├── Schema
    ├── Preview
    ├── Statistics
    └── Warnings

Planned Pipeline Studio notice
```

At mobile width:

```text
Dataset catalogue
→ selected dataset summary
→ schema
→ preview
→ statistics
→ warnings
```

The selected dataset panel must not become unusable on narrow screens.

Use existing design tokens and components.

Do not introduce a new visual system.

---

# No Dataset Selected State

When datasets exist but none is selected, show:

```text
Select a dataset

Choose an approved local dataset to inspect its fields, preview,
statistics, and warnings.
```

Do not automatically inspect every dataset.

Automatically selecting the first dataset is allowed only if:

* It creates a clearly better user experience
* The URL is updated
* Tests cover the behavior
* It does not trigger unbounded requests

A manual initial selection is also acceptable.

Document the decision.

---

# Backend Changes

Prefer no backend changes.

A small backward-compatible backend change is allowed only when:

* The current response cannot support a required, non-decorative UI behavior
* The change remains bounded
* The change exposes no path or private data
* Backend tests are added
* Existing clients remain compatible

Do not add:

* Upload endpoints
* Delete endpoints
* Dataset path endpoints
* Arbitrary row endpoints
* Pipeline endpoints
* Write endpoints
* Remote URL loading

---

# Security Requirements

Verify:

* No absolute paths rendered
* No root paths rendered
* No usernames rendered
* No environment variables rendered
* No dataset content interpreted as HTML
* No dataset content interpreted as Markdown
* No automatic link creation
* No code execution
* No arbitrary dataset ID construction
* No local path input
* No upload
* No modification action
* No hidden network request
* No full-dataset request
* No unbounded table rendering
* Safe response inspector only
* URL contains only safe dataset IDs

Treat all names, field names, warning messages, and values as untrusted text.

---

# Accessibility Requirements

Test:

* Page heading hierarchy
* Dataset list keyboard navigation
* Selected item announcement
* Loading announcements
* Error announcements
* Empty-state guidance
* Refresh button
* Schema table semantics
* Preview table semantics
* Horizontal table scrolling
* Row-detail dialog
* Warning list semantics
* Status text
* Advanced metadata
* Visible focus
* Reduced-motion behavior

Do not communicate selection or warnings through color alone.

Use real buttons and links.

---

# Responsive Requirements

Test at:

* 320 px
* 375 px
* 768 px
* 1024 px
* 1440 px

Verify:

* Dataset catalogue remains usable
* Long filenames do not break layout
* Schema table scrolls internally
* Preview table scrolls internally
* Long field values remain bounded
* Row-detail dialog fits viewport
* Warning messages wrap
* Statistics cards stack correctly
* No page-wide horizontal overflow
* Simple and Advanced modes remain usable

---

# Frontend Tests

Add focused tests for:

## API client

* Dataset list success
* Empty dataset list
* Dataset list failure
* Inspection success
* Inspection failure
* Invalid response
* Safe dataset-ID encoding
* No arbitrary path request

## Catalogue

* Datasets render
* Format and size render
* Deterministic order retained
* Dataset selection works
* Keyboard selection works
* Empty catalogue
* Backend disconnected
* Unknown selected dataset

## URL selection

* Selected dataset appears in URL
* Direct URL selection works
* Back and forward behavior works where testable
* Invalid ID is handled
* No path enters URL

## Summary

* Exact inspection
* Bounded inspection
* File size formatting
* Missing optional metadata
* Warning count

## Schema

* All supported field types
* Mixed type
* Nullable field
* Sample-based notice
* Empty schema

## Preview

* Primitive values
* Null
* Empty string
* Unicode
* Long value
* Truncated value
* Object
* Array
* Empty preview
* Safe text escaping
* No HTML interpretation

## Statistics

* Rows scanned
* Missing values
* Empty values
* Duplicates
* Text lengths
* Exact scope
* Bounded scope
* Unavailable values

## Warnings

* Every known warning code
* Unknown warning code
* Advanced code display
* Simple plain-language display

## Refresh

* Catalogue refresh
* Inspection refresh
* Selected dataset retained
* Removed dataset clears selection
* Duplicate requests prevented
* Failed refresh marks stale data

## Modes

* Simple mode hides technical fields
* Advanced mode shows technical fields
* Same request data is reused
* No duplicate API lifecycle

---

# Real Runtime Verification

Use the real local backend with a temporary configured dataset root.

Create safe temporary fixtures:

* TXT
* CSV
* JSON
* JSONL
* Empty supported file
* Unicode file
* Dataset with missing values
* Dataset with duplicates
* Dataset that reaches a scan or preview limit
* Dataset with long field values
* Dataset with nested values

Start:

```bash
python -m arclm web-api --dataset-root workspace=./test-data
```

Start the production frontend.

Verify through a real browser:

1. Open `/data`.
2. Confirm dataset catalogue.
3. Select every supported format.
4. Inspect schema.
5. Inspect preview.
6. Inspect statistics.
7. Inspect warnings.
8. Switch Simple to Advanced.
9. Confirm safe technical metadata.
10. Reload a selected-dataset URL.
11. Use browser back and forward.
12. Stop backend and confirm disconnected state.
13. Restart backend and refresh.
14. Verify mobile widths.
15. Confirm no paths appear.
16. Confirm source files remain unchanged.

Do not mark runtime verification passed based only on frontend fixtures.

---

# Existing Warning Handling

Keep documented:

* Known Vitest/jsdom navigation message
* FastAPI/Starlette dependency warning
* Intentional compatibility warnings

Do not globally suppress them.

When tests navigate through dataset selection, use the appropriate Next.js routing test method rather than causing document navigation.

Do not alter production navigation solely to silence jsdom.

---

# Required Validation

Frontend:

```bash
cd web
npm run lint
npm run typecheck
npm run test
npm run build
npm run start
npm audit --json
```

Backend:

```bash
python -m pytest tests/web -v
python -m pytest tests/public_api -v
python -m pytest tests/compatibility -v
python -m pytest
python -m compileall src/arclm
python -m pip wheel . --no-deps
```

Runtime:

* Real backend
* Real production frontend
* Temporary approved datasets
* Desktop and mobile browser verification
* Connected and disconnected states
* Simple and Advanced modes
* Source-file integrity verification

---

# Documentation

Update:

```text
docs/web/data-pipeline-studio.md
docs/web/data-pipeline-api.md
docs/web/simple-mode.md
docs/web/advanced-mode.md
docs/web/architecture.md
docs/web/backend-api.md
docs/web/security.md
docs/web/testing.md
docs/web/local-development.md
docs/web/roadmap.md
docs/project/PROJECT_MAP.md
docs/project/MILESTONES.md
docs/project/FEATURE_MATRIX.md
docs/project/TEST_STRATEGY.md
docs/project/SECURITY_MODEL.md
```

Document:

* Dataset Inspector UI purpose
* Catalogue behavior
* Dataset selection
* Safe URL state
* Summary fields
* Schema display
* Preview behavior
* Value rendering
* Statistics
* Inspection scope
* Warnings
* Refresh behavior
* Simple and Advanced differences
* Connected, disconnected, and empty states
* Security boundaries
* Accessibility
* Responsive behavior
* Test commands
* Known limitations

Avoid copying the complete backend API reference into UI documentation.

---

# Project-State Update

After Feature 3 passes, record:

```text
Web Milestone 1:
Implemented, verified, and closed

Web Milestone 2 / Feature 1:
Planning and API audit complete

Dataset Inspector Backend:
Implemented and verified

Dataset Inspector UI:
Implemented and verified

Dataset Upload:
Not implemented

Pipeline Step Registry:
Not implemented

Pipeline Preview:
Not implemented

Data Pipeline Studio:
In progress
```

Set the next recommended action to:

```text
Web Milestone 2 / Feature 4:
Safe Local Dataset Upload
```

However, compare this with the approved milestone dependency plan.

If the audit concluded that Pipeline Step Registry must come before upload, recommend:

```text
Web Milestone 2 / Feature 4:
Pipeline Step Registry and Validation
```

Choose exactly one based on the canonical roadmap.

Do not approve the next feature automatically.

---

# Source-Code Rules

* Reuse the existing Design System.
* Reuse the Application Shell.
* Reuse the typed API client.
* Keep TypeScript strict.
* Use simple English names.
* Do not use unrestricted `any`.
* Do not duplicate inspection logic.
* Do not calculate authoritative dataset statistics in the browser.
* Do not expose paths.
* Do not add upload.
* Do not modify dataset files.
* Do not add pipeline execution.
* Do not add charts.
* Do not add a data-grid dependency.
* Do not add global state management.
* Do not modify Training Core.
* Do not modify Evaluation behavior.
* Do not modify Inference behavior.
* Do not modify legacy Flask behavior.
* Keep backend changes backward-compatible.

---

# Final Report

Provide:

| Dataset Inspector UI area | Status | Tests | Runtime verified | Accessibility | Responsive | Security |
| ------------------------- | ------ | ----- | ---------------- | ------------- | ---------- | -------- |
| API client                |        |       |                  |               |            |          |
| Page states               |        |       |                  |               |            |          |
| Dataset catalogue         |        |       |                  |               |            |          |
| Dataset selection         |        |       |                  |               |            |          |
| URL state                 |        |       |                  |               |            |          |
| Dataset summary           |        |       |                  |               |            |          |
| Inspection scope          |        |       |                  |               |            |          |
| Schema view               |        |       |                  |               |            |          |
| Preview table             |        |       |                  |               |            |          |
| Statistics                |        |       |                  |               |            |          |
| Warnings                  |        |       |                  |               |            |          |
| Refresh behavior          |        |       |                  |               |            |          |
| Simple mode               |        |       |                  |               |            |          |
| Advanced mode             |        |       |                  |               |            |          |

Also report:

1. Dependencies added
2. Files created
3. Files changed
4. Backend endpoints reused
5. Backend schema changes
6. Frontend types added
7. Catalogue behavior
8. Selection behavior
9. URL-state behavior
10. Empty state
11. Disconnected state
12. Error state
13. Exact versus bounded display
14. Schema rendering
15. Preview rendering
16. Nested-value behavior
17. Statistics rendering
18. Warning behavior
19. Refresh behavior
20. Simple-mode behavior
21. Advanced-mode behavior
22. Sensitive data excluded
23. Accessibility checks
24. Responsive checks
25. Frontend test result
26. Backend regression result
27. Full Python regression result
28. Production-build result
29. npm audit result
30. Real integration smoke result
31. Source-file integrity result
32. Remaining limitations
33. Exact next recommended feature

Stop after Feature 3.

End with:

“Web Milestone 2 / Feature 3 complete. Waiting for approval before starting the next Data Pipeline Studio feature.”
