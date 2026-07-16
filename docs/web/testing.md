# ArcLM Web Testing

The web workspace uses npm scripts inside `web/`.

## Frontend Commands

```bash
cd web
npm run lint
npm run typecheck
npm run test
npm run build
```

## Local Dev Smoke

The local dev server was checked with:

```bash
cd web
npm run dev -- --hostname 127.0.0.1 --port 3107
```

The root route returned the `Web Interface Foundation` page.

## Unit Tests

Current test file:

```text
web/src/components/foundation/foundation-screen.test.tsx
web/src/components/ui/design-system.test.tsx
web/src/components/shell/application-shell.test.tsx
web/src/lib/api/client.test.ts
web/src/features/dashboard/dashboard.test.tsx
web/src/features/datasets/dataset-inspector.test.tsx
```

Coverage for Feature 1:

- Root page renders
- Main heading is present
- Theme foundation initializes
- Fake dashboard data is not rendered

Coverage for Feature 2:

- Utility class-name helper
- Button variants, icon label, and loading state
- Input labels and error associations
- Checkbox and switch behavior
- Card and status rendering
- Empty and error feedback states
- Dialog open, Escape close, and focus return
- Dropdown menu open/select behavior
- Tooltip role
- Tabs keyboard navigation
- Table semantic structure and empty state
- Page helpers and metric fallback

Coverage for Feature 3:

- Interface mode default, switching, persistence, and invalid stored fallback
- Sidebar navigation items, active route, planned labels, and collapsed state
- Mobile navigation open, Escape close, route-selection close, and focus return
- Top bar current page, theme select, and mode controls
- Breadcrumb landmark and root link
- Honest planned route states without fake metrics
- Advanced route details behind Advanced mode
- Preference storage limited to theme, interface mode, and sidebar state

Coverage for Feature 4 frontend client:

- Health success
- Backend error response
- Disconnected backend
- Timeout
- Invalid JSON
- Environment response parsing
- Capability response parsing
- Custom base URL

Coverage for Feature 5 Simple Dashboard:

- Loading, connected, disconnected, invalid-response, and retry states
- ArcLM version and Web milestone display
- CPU and CUDA environment summaries
- rounded VRAM formatting
- missing GPU data
- selected capability statuses and unknown-status fallback
- available route links and non-executable planned actions
- copyable CLI previews and copy failure
- partial endpoint failures
- refresh behavior with last successful data
- Simple mode rendering and Advanced-mode notice

Coverage for Feature 6 Advanced Dashboard:

- Advanced mode reuses the existing dashboard data hook without duplicate
  request cycles.
- Simple mode keeps technical sections hidden.
- Runtime details render CPU and CUDA-safe fields.
- Hardware details render GPU name, VRAM, and compute capability when reported.
- Capability matrix groups capability evidence and handles unknown statuses.
- Validation, optional integration, limitation, and diagnostic sections render
  safe structured data.
- Endpoint failures keep the page usable and show stale refresh information.
- The safe response inspector is hidden by default, opens on request, formats
  already-loaded approved responses, and has no arbitrary endpoint input.

Coverage for Web Milestone 2 / Feature 3 Dataset Inspector UI:

- typed dataset API client success, empty, invalid response, and safe ID
  encoding behavior
- dataset catalogue loading, empty, disconnected, error, and selected states
- safe URL selection, direct load, invalid query cleanup, and popstate handling
- summary, exact versus bounded scope, schema, statistics, and warning display
- bounded preview rendering for primitive, null, empty, Unicode, object, array,
  and long values
- row-detail dialog that uses only already-returned preview data
- refresh behavior with retained selection, removed-dataset clearing, duplicate
  request prevention, and stale data on failure
- Simple mode hides technical fields
- Advanced mode shows safe technical metadata without creating a second data
  lifecycle

Coverage for Web Milestone 2 / Feature 4 Dataset Source Manager:

- typed dataset-root API client success and invalid response handling
- empty, unavailable, disconnected, invalid, and error source-manager states
- add valid local source
- invalid path and duplicate source errors from the backend
- multiple roots, enabled and disabled roots, and session-only CLI roots
- remove confirmation that clearly says files are not deleted
- refresh catalogue behavior
- Simple mode path/name controls
- Advanced mode recursive scanning and technical source metadata
- selected dataset refresh after catalogue changes
- root-management unavailable state for non-local access

## Production Start Smoke

After `npm run build`, the production server was started with:

```bash
cd web
npm run start -- --hostname 127.0.0.1 --port 3108
```

Routes checked after Feature 2:

```text
/
/design-system
```

Both routes returned the expected page content.

Feature 3 production smoke checked:

```text
/
/projects
/data
/training
/evaluation
/models
/inference
/plugins
/settings
/design-system
```

Each route returned HTTP 200 from `npm run start`.

Feature 5 production smoke should start both the backend and production
frontend, then open `/` and verify the connected Simple Dashboard. Stop the
backend, refresh or retry the page, and verify the disconnected state. Restart
the backend and verify the connected state returns.

Feature 6 production smoke should use the same backend and frontend servers,
switch the interface mode to Advanced, and verify that runtime details,
capabilities, validation status, integrations, limitations, diagnostics, and
the response-inspector trigger are present. Simple mode should still hide the
technical sections.

Web Milestone 2 Feature 4 production smoke should start the backend with an
explicit test config directory, open `/data`, add at least two temporary dataset
folders, refresh the catalogue, disable and re-enable one source, remove one
source, restart the backend, and confirm persisted roots return. The source
files must remain unchanged.

## Python Regression Commands

From the repository root:

```bash
python -c "import arclm; print(arclm.__version__)"
python -m pytest
python -m compileall src/arclm
```

Feature 1 must not add frontend dependencies to the Python package install.
Features 1-3 must not add frontend dependencies to the Python package install
or change the legacy Flask interface.

Feature 4 backend commands:

```bash
python -m pytest tests/web -v
python -m compileall src/arclm/web
python -c "from arclm.web import create_app; print(create_app)"
```

Feature 4 runtime smoke starts:

```bash
python -m uvicorn arclm.web.app:create_app --factory --host 127.0.0.1 --port 8765
```

Routes checked:

```text
/api/health
/api/environment
/api/capabilities
/api/project/status
/docs
/openapi.json
```

Current known warning:

- FastAPI `TestClient` emits a dependency-owned `StarletteDeprecationWarning`
  about future `httpx2` usage. It is recorded, not globally suppressed.
- Vitest/jsdom may print `Not implemented: navigation to another Document`
  during link-style tests. The message is non-failing and is not globally
  suppressed.
## Web Milestone 2 Dataset Inspector Tests

Feature 2 adds backend tests under `tests/web/datasets/`. Feature 3 adds the
frontend Dataset Inspector tests listed above and extends the API client tests.

Required validation for the Dataset Inspector Backend and UI:

```bash
cd web
npm run lint
npm run typecheck
npm run test
npm run build
cd ..
.venv-training-core\Scripts\python.exe -m pytest
.venv-training-core\Scripts\python.exe -m compileall src\arclm
.venv-training-core\Scripts\python.exe -m pip wheel . --no-deps
```

Implemented coverage:

- safe dataset source validation
- TXT, JSON, JSONL, and CSV inspection
- bounded preview limits
- parse warnings
- no absolute path leaks
- no upload before upload security is approved
- `/data` route consumes only read-only dataset endpoints
- safe URL dataset selection
- no local path rendering
- disconnected, empty, invalid, and stale states
- Simple and Advanced mode differences
- production frontend route smoke with a real backend and temporary fixtures

Future Data Pipeline Studio implementation features must add focused tests for:

- approved pipeline step registry accuracy
- before/after preview correctness
- manifest save/load behavior
- frontend partial-failure states
