import {
  Alert,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  Dialog,
  DisconnectedState,
  DropdownMenu,
  EmptyState,
  ErrorState,
  InlineMessage,
  KeyValueList,
  Metric,
  PageHeader,
  SectionContainer,
  Select,
  Skeleton,
  StatusIndicator,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Tabs,
  TextInput,
  Textarea,
  Tooltip
} from "@/components/ui";

export default function DesignSystemPage() {
  return (
    <main className="ui-showcase">
      <PageHeader
        title="ArcLM Design System"
        description="Internal component showcase for Web Milestone 1 / Feature 2."
      />

      <section className="ui-showcase-grid">
        <Card>
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
            <CardDescription>Actions stay compact and accessible.</CardDescription>
          </CardHeader>
          <CardContent className="ui-row">
            <Button>Primary action</Button>
            <Button variant="secondary">Secondary action</Button>
            <Button variant="ghost">Ghost action</Button>
            <Button variant="destructive">Destructive action</Button>
            <Button size="small">Small</Button>
            <Button size="large">Large</Button>
            <Button size="icon" aria-label="Open tool">+</Button>
            <Button loading loadingLabel="Saving">Save</Button>
            <Button disabled>Disabled</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inputs</CardTitle>
            <CardDescription>Labels are visible; errors are associated.</CardDescription>
          </CardHeader>
          <CardContent className="ui-stack">
            <TextInput label="Project name" description="Used only as an example label." />
            <Textarea label="Description" error="A short explanation is required." />
            <Select label="Mode" defaultValue="simple">
              <option value="simple">Simple</option>
              <option value="advanced">Advanced</option>
            </Select>
            <Checkbox label="Enable local preview" description="No backend action is connected yet." />
            <Switch label="Advanced controls" description="Visual foundation only." />
          </CardContent>
        </Card>

        <SectionContainer className="ui-stack">
          <h2 className="ui-section-title">Status</h2>
          <div className="ui-row">
            <Badge>Neutral</Badge>
            <Badge variant="info">Info</Badge>
            <Badge variant="success">Validation passed</Badge>
            <Badge variant="warning">Needs review</Badge>
            <Badge variant="error">Error</Badge>
            <Badge variant="planned">Feature planned</Badge>
            <Badge variant="experimental">Experimental</Badge>
          </div>
          <StatusIndicator variant="success">Connected visually</StatusIndicator>
          <Alert variant="warning" title="Feature planned">
            This message marks future functionality without pretending it works.
          </Alert>
          <InlineMessage variant="info" title="Note">
            Inline messages fit compact dashboard surfaces.
          </InlineMessage>
        </SectionContainer>

        <SectionContainer className="ui-stack">
          <h2 className="ui-section-title">Feedback states</h2>
          <Skeleton label="Loading preview" />
          <EmptyState title="No items found" description="Add real data later through approved flows." />
          <ErrorState title="Could not load" description="The action failed and needs a clear retry path." />
          <DisconnectedState title="Backend unavailable" description="This is distinct from an empty result." />
        </SectionContainer>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Overlays and tabs</CardTitle>
          <CardDescription>Keyboard behavior is covered by focused tests.</CardDescription>
        </CardHeader>
        <CardContent className="ui-stack">
          <div className="ui-row">
            <Dialog triggerLabel="Open dialog" title="Dialog title" description="Dialog content keeps focus inside the overlay area.">
              <p className="ui-section-description">This is a local component demonstration.</p>
            </Dialog>
            <DropdownMenu
              triggerLabel="Open menu"
              items={[
                { label: "Primary item" },
                { label: "Disabled item", disabled: true }
              ]}
            />
            <Tooltip label="Tooltip text explains the control.">
              <Button variant="secondary">Tooltip trigger</Button>
            </Tooltip>
          </div>
          <Tabs
            items={[
              { id: "simple", label: "Simple", content: <p>Simple mode component foundation.</p> },
              { id: "advanced", label: "Advanced", content: <p>Advanced mode component foundation.</p> }
            ]}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Table and page components</CardTitle>
          <CardDescription>Tables scroll safely and avoid fake product data.</CardDescription>
        </CardHeader>
        <CardContent className="ui-stack">
          <KeyValueList
            items={[
              { label: "Package", value: <code>@arclm/web</code> },
              { label: "Long value", value: "local-development-foundation-with-long-technical-value" }
            ]}
          />
          <div className="ui-row">
            <Metric label="Metric foundation" hint="No fake value is required." />
            <Metric label="Build status" value="Verified" />
          </div>
          <Table>
            <caption>Neutral component inventory</caption>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Component</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Button</TableCell>
                <TableCell>Implemented</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Table</TableCell>
                <TableCell>Foundation</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
