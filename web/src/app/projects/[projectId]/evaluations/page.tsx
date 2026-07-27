import { EvaluationsPage } from "@/features/evaluation/evaluations-page";

export default async function Page({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  return <EvaluationsPage projectId={projectId} />;
}
