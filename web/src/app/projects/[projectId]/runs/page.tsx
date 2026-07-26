import { RunsPage } from "@/features/studio2/runs-page";

export default async function Page({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  return <RunsPage projectId={projectId} />;
}
