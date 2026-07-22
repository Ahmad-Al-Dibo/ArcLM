import { ProjectOverviewPage } from "@/features/studio/projects-page";

export default async function Page({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  return <ProjectOverviewPage projectId={projectId} />;
}
