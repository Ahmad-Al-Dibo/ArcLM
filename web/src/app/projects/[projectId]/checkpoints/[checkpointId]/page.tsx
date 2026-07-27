import { CheckpointDetailsPage } from "@/features/checkpoints/checkpoint-details";

export default async function Page({ params }: { params: Promise<{ projectId: string; checkpointId: string }> }) {
  const { projectId, checkpointId } = await params;
  return <CheckpointDetailsPage projectId={projectId} checkpointId={checkpointId} />;
}
