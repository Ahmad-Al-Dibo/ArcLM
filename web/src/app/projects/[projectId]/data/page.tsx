import { DataStudioPage } from "@/features/studio/studio";

export default async function Page({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  return <DataStudioPage projectId={projectId} />;
}
