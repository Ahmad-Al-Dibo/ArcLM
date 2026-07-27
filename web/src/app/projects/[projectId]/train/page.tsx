import { TrainingStudioPage } from "@/features/studio2/training-studio";

export default async function Page({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  return <TrainingStudioPage projectId={projectId} />;
}
