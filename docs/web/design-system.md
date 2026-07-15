# ArcLM Web Design System

Web Milestone 1 / Feature 2 adds the first reusable ArcLM component system.
It is intentionally small and source-owned. No external component suite was
added.

## Principles

- Use semantic CSS tokens instead of hardcoded component colors.
- Keep components compact enough for long dashboard sessions.
- Use semantic HTML before custom interaction code.
- Do not show fake product data in components or the showcase.
- Keep Simple and Advanced experiences on the same shared components.
- Use the same status, card, table, and feedback components for Simple and
  Advanced Dashboard sections so planned, unavailable, and verified states look
  consistent.

## Tokens

Tokens are defined in `web/src/app/globals.css`.

Surface tokens:

- Background
- Surface
- Surface muted
- Surface elevated
- Surface interactive

Text tokens:

- Main text
- Muted text
- Subtle text
- Inverse text

Border tokens:

- Border
- Strong border
- Interactive border

Brand and action tokens:

- Accent
- Accent hover
- Accent active
- Accent foreground

Status tokens:

- Success
- Success surface
- Warning
- Warning surface
- Error
- Error surface
- Info
- Info surface

Interaction and layout tokens:

- Focus
- Disabled
- Selection
- Radius
- Spacing
- Control heights
- Container width
- Shadows
- Typography sizes
- Line heights
- Transition durations

## Typography

The system uses local system font stacks only. No external web fonts are loaded.

| Role | Use |
| ---- | --- |
| Display heading | Product-level intro views |
| Page heading | Top of pages and internal review routes |
| Section heading | Component sections and dashboard groups |
| Card heading | Compact panels |
| Body | Normal text |
| Small body | Dense dashboard text |
| Caption | Helper text and metadata |
| Label | Form labels |
| Monospace | Technical values and code |

## Themes

Themes support:

- Light theme
- Dark theme
- System preference
- Application shell theme control
- Safe local-storage fallback when storage is unavailable

## Component Inventory

Implemented components:

| Group | Components |
| ----- | ---------- |
| Utility | `cn()` class-name helper |
| Button | `Button` |
| Inputs | `TextInput`, `Textarea`, `Select`, `Checkbox`, `Switch` |
| Cards | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`, `SectionContainer`, `Divider` |
| Status | `Badge`, `StatusIndicator`, `Alert`, `InlineMessage` |
| Feedback | `Skeleton`, `EmptyState`, `ErrorState`, `DisconnectedState`, `NotAvailableState` |
| Overlays | `Dialog`, `DropdownMenu`, `Tooltip` |
| Tabs | `Tabs` |
| Table | `Table`, `TableHead`, `TableBody`, `TableRow`, `TableHeaderCell`, `TableCell`, `TableEmpty` |
| Page | `PageHeader`, `SectionHeader`, `Breadcrumb`, `DescriptionBlock`, `KeyValueList`, `Metric` |

## Component Variants

Button variants:

- Primary
- Secondary
- Ghost
- Destructive

Button sizes:

- Small
- Default
- Large
- Icon

Status variants:

- Neutral
- Info
- Success
- Warning
- Error
- Planned
- Experimental

Feedback states:

- Loading skeleton
- Empty
- Error
- Disconnected
- Not available

## Showcase

The internal review route is:

```text
/design-system
```

It shows variants, disabled and loading controls, long technical values,
planned and experimental status labels, empty/error/disconnected states,
overlays, tabs, and table structure. It uses neutral labels only.

## Accessibility Rules

- Visible `:focus-visible` outline remains enabled.
- Form inputs use visible labels, not placeholder-only labels.
- Error text is associated with controls through `aria-describedby`.
- Buttons use the native `button` element.
- Loading buttons become disabled and expose `aria-busy`.
- Icon buttons require an accessible name.
- Dialogs use `role="dialog"` and `aria-modal`.
- Dialog Escape behavior and focus return are tested.
- Dropdowns expose menu roles.
- Tooltips expose `role="tooltip"`.
- Tabs expose tablist/tab/tabpanel roles and keyboard behavior.
- Status components include text, not color alone.
- Reduced-motion preferences are respected in global CSS.

## Responsive Rules

- Tables use safe horizontal overflow.
- Dialogs are constrained to the viewport.
- Showcase grids collapse on narrow screens.
- Long technical values use intentional wrapping.
- Buttons keep stable control heights.

## Usage Example

```tsx
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

export function ExamplePanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Environment information</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Primary action</Button>
      </CardContent>
    </Card>
  );
}
```

## Dependency Decision

No new dependency was added for Feature 2. Native semantic HTML and small
source-owned React components were sufficient. Radix or another primitive
library may be reconsidered later only if a real interaction proves native code
insufficient.

## Remaining Limits

- The shell exists, but the backend connection is still static.
- No backend connection yet.
- No dashboard data or charts.
- No Storybook.
- No full command palette.
- No sorting, filtering, pagination, virtualization, or column resizing for tables.
