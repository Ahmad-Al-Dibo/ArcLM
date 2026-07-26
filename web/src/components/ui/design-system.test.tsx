import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  Alert,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  Dialog,
  DropdownMenu,
  EmptyState,
  ErrorState,
  KeyValueList,
  Metric,
  PageHeader,
  Select,
  Skeleton,
  StatusIndicator,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeaderCell,
  TableRow,
  Tabs,
  TextInput,
  Textarea,
  Tooltip
} from "@/components/ui";
import { cn } from "@/lib/cn";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("utility foundation", () => {
  it("merges class names without adding empty values", () => {
    expect(cn("one", false, null, undefined, "two")).toBe("one two");
  });
});

describe("Button", () => {
  it("uses button as the default type and supports variants", () => {
    render(<Button variant="secondary">Primary action</Button>);

    const button = screen.getByRole("button", { name: "Primary action" });
    expect(button.getAttribute("type")).toBe("button");
    expect(button.className).toContain("ui-button-secondary");
  });

  it("disables duplicate action during loading", () => {
    render(
      <Button loading loadingLabel="Saving">
        Save
      </Button>
    );

    const button = screen.getByRole("button", { name: "Saving" });
    expect((button as HTMLButtonElement).disabled).toBe(true);
    expect(button.getAttribute("aria-busy")).toBe("true");
  });

  it("allows icon-only buttons to expose an accessible name", () => {
    render(
      <Button size="icon" aria-label="Open tool">
        +
      </Button>
    );

    expect(screen.getByRole("button", { name: "Open tool" })).toBeTruthy();
  });
});

describe("input components", () => {
  it("associates text input labels and errors", () => {
    render(<TextInput label="Project name" error="Required field" required />);

    const input = screen.getByLabelText(/Project name/);
    expect((input as HTMLInputElement).required).toBe(true);
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(screen.getByText("Required field")).toBeTruthy();
  });

  it("renders textarea, select, checkbox, and switch with keyboard behavior", () => {
    const onCheckedChange = vi.fn();
    render(
      <>
        <Textarea label="Description" />
        <Select label="Mode" defaultValue="simple">
          <option value="simple">Simple</option>
          <option value="advanced">Advanced</option>
        </Select>
        <Checkbox label="Enable local preview" />
        <Switch label="Advanced controls" onCheckedChange={onCheckedChange} />
      </>
    );

    expect(screen.getByLabelText("Description")).toBeTruthy();
    expect(screen.getByLabelText("Mode")).toBeTruthy();
    expect(screen.getByLabelText("Enable local preview")).toBeTruthy();

    const switchControl = screen.getByRole("switch", { name: "Advanced controls" });
    expect(switchControl.getAttribute("aria-checked")).toBe("false");
    fireEvent.click(switchControl);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(switchControl.getAttribute("aria-checked")).toBe("true");
  });
});

describe("cards, status, and feedback", () => {
  it("renders card structure and status text", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Environment information</CardTitle>
        </CardHeader>
        <CardContent>
          <Badge variant="planned">Feature planned</Badge>
          <StatusIndicator variant="success">Validation passed</StatusIndicator>
          <Alert title="Notice">Useful explanation</Alert>
        </CardContent>
      </Card>
    );

    expect(screen.getByRole("heading", { name: "Environment information" })).toBeTruthy();
    expect(screen.getByText("Feature planned")).toBeTruthy();
    expect(screen.getByText("Validation passed")).toBeTruthy();
    expect(screen.getByText("Useful explanation")).toBeTruthy();
  });

  it("renders non-fake feedback states", () => {
    render(
      <>
        <Skeleton />
        <EmptyState title="No items found" description="Nothing is available yet." />
        <ErrorState title="Could not load" description="Try again later." />
      </>
    );

    expect(screen.getByLabelText("Loading")).toBeTruthy();
    expect(screen.getByText("No items found")).toBeTruthy();
    expect(screen.getByText("Could not load")).toBeTruthy();
  });
});

describe("overlays", () => {
  it("opens and closes a dialog with Escape and returns focus", () => {
    render(
      <Dialog triggerLabel="Open dialog" title="Dialog title">
        Dialog body
      </Dialog>
    );

    const trigger = screen.getByRole("button", { name: "Open dialog" });
    fireEvent.click(trigger);
    expect(screen.getByRole("dialog", { name: "Dialog title" })).toBeTruthy();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog", { name: "Dialog title" })).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it("opens dropdown menu items and closes after selection", () => {
    const onSelect = vi.fn();
    render(<DropdownMenu triggerLabel="Open menu" items={[{ label: "Primary item", onSelect }]} />);

    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Primary item" }));

    expect(onSelect).toHaveBeenCalled();
    expect(screen.queryByRole("menuitem", { name: "Primary item" })).toBeNull();
  });

  it("renders tooltip content with a role", () => {
    render(
      <Tooltip label="Tooltip text">
        <button type="button">Trigger</button>
      </Tooltip>
    );

    expect(screen.getByRole("tooltip", { name: "Tooltip text" })).toBeTruthy();
  });
});

describe("tabs", () => {
  it("supports keyboard navigation", () => {
    render(
      <Tabs
        items={[
          { id: "simple", label: "Simple", content: "Simple content" },
          { id: "advanced", label: "Advanced", content: "Advanced content" }
        ]}
      />
    );

    const tabList = screen.getByRole("tablist");
    expect(screen.getByText("Simple content")).toBeTruthy();

    fireEvent.keyDown(tabList, { key: "ArrowRight" });
    expect(screen.getByRole("tab", { name: "Advanced" }).getAttribute("aria-selected")).toBe("true");
    expect(screen.getByText("Advanced content")).toBeTruthy();
  });
});

describe("table and page components", () => {
  it("renders semantic table structure and empty state", () => {
    render(
      <Table>
        <caption>Component inventory</caption>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Component</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableEmpty columns={1} title="No items found" description="Add real items later." />
      </Table>
    );

    expect(screen.getByRole("table", { name: "Component inventory" })).toBeTruthy();
    expect(screen.getByRole("columnheader", { name: "Component" })).toBeTruthy();
    expect(screen.getByText("No items found")).toBeTruthy();
  });

  it("renders page helpers without fake metrics", () => {
    render(
      <>
        <PageHeader title="ArcLM Design System" description="Internal review route." />
        <KeyValueList items={[{ label: "Package", value: <code>@arclm/web</code> }]} />
        <Metric label="Metric foundation" />
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Neutral value</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </>
    );

    expect(screen.getByRole("heading", { name: "ArcLM Design System" })).toBeTruthy();
    expect(screen.getByText("@arclm/web")).toBeTruthy();
    expect(screen.getByText("Not available")).toBeTruthy();
  });
});
