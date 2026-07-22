import { CheckpointInspectionPage } from "@/features/checkpoints/checkpoint-inspection";

export default async function Page({ params }: { params: Promise<{ projectId: string; checkpointId: string }> }) {
  const { projectId, checkpointId } = await params;
  return <CheckpointInspectionPage projectId={projectId} checkpointId={checkpointId} />;
}
