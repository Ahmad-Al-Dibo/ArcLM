import { FineTuningStudioPage } from "@/features/studio2/finetuning-studio";

export default async function Page({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  return <FineTuningStudioPage projectId={projectId} />;
}
