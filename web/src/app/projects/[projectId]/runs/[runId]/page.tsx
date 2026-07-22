import { RunDetailsPage } from "@/features/studio2/run-details";

export default async function Page({ params }: { params: Promise<{ projectId: string; runId: string }> }) {
  const { projectId, runId } = await params;
  return <RunDetailsPage projectId={projectId} runId={runId} />;
}
