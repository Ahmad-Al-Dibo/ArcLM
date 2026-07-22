import { EvaluationStudioPage } from "@/features/evaluation/evaluation-studio";

export default async function Page({
  params,
  searchParams
}: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ checkpoint?: string }>;
}) {
  const { projectId } = await params;
  const { checkpoint } = await searchParams;
  return <EvaluationStudioPage projectId={projectId} initialCheckpointId={checkpoint} />;
}
