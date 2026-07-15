"use client";

import { Alert, Badge, Card, CardContent, CardDescription, CardHeader, CardTitle, KeyValueList, PageHeader } from "@/components/ui";
import { getNavigationItem } from "@/config/navigation";
import { useInterfaceMode } from "@/providers/interface-mode-provider";

export function RoutePage({ href }: { href: string }) {
  const item = getNavigationItem(href);
  const { mode } = useInterfaceMode();
  const statusText = item.status === "available" ? "Available in this build" : "Not available in this build";

  return (
    <div className="app-route-page">
      <PageHeader
        title={item.title}
        description={item.href === "/" ? "ArcLM Web Interface structure for the current milestone." : item.description}
        actions={<Badge variant={item.status === "available" ? "success" : item.status}>{item.status === "available" ? "Available" : "Planned"}</Badge>}
      />

      <Card>
        <CardHeader>
          <CardTitle>{statusText}</CardTitle>
          <CardDescription>{item.simpleNote}</CardDescription>
        </CardHeader>
        <CardContent className="ui-stack">
          <Alert variant={item.status === "available" ? "info" : "planned"} title={item.milestone}>
            {item.backend}
          </Alert>
          {item.href === "/" ? (
            <Alert variant="warning" title="ArcLM Web API">
              Not implemented yet. Backend connection will be added in Feature 4.
            </Alert>
          ) : null}
          {item.status !== "available" ? (
            <p className="ui-section-description">
              This route is present so navigation and layout can be tested without showing fake controls.
            </p>
          ) : null}
        </CardContent>
      </Card>

      {mode === "advanced" ? (
        <Card>
          <CardHeader>
            <CardTitle>Advanced planning details</CardTitle>
            <CardDescription>Technical context for this route without runtime data.</CardDescription>
          </CardHeader>
          <CardContent className="ui-stack">
            <KeyValueList
              items={[
                { label: "Route", value: <code>{item.href}</code> },
                { label: "Domain", value: item.domain },
                { label: "Milestone", value: item.milestone },
                { label: "Backend dependency", value: item.backend }
              ]}
            />
            <div className="ui-stack">
              <strong>Planned capabilities</strong>
              <ul>
                {item.plannedCapabilities.map((capability) => (
                  <li key={capability}>{capability}</li>
                ))}
              </ul>
              <strong>Technical notes</strong>
              <ul>
                {item.advancedNotes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
