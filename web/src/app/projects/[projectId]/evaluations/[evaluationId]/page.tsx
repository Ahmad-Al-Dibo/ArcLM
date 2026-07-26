import { EvaluationDetailsPage } from "@/features/evaluation/evaluation-details";

export default async function Page({ params }: { params: Promise<{ projectId: string; evaluationId: string }> }) {
  const { projectId, evaluationId } = await params;
  return <EvaluationDetailsPage projectId={projectId} evaluationId={evaluationId} />;
}
