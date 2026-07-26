import Link from "next/link";
import { EmptyState, PageHeader } from "@/components/ui";

export default function DataPage() {
  return (
    <div className="studio-page">
      <PageHeader title="Data" description="Open a project to upload, preview, validate, and report datasets." />
      <EmptyState
        title="Choose a project first"
        description="Data Studio is project-bound so uploaded data stays inside the configured local workspace."
      />
      <Link className="ui-button ui-button-primary" href="/projects">Open projects</Link>
    </div>
  );
}
