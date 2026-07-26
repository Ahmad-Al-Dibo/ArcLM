import { PretrainingStudioPage } from "@/features/studio2/pretraining-studio";

export default async function Page({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  return <PretrainingStudioPage projectId={projectId} />;
}
