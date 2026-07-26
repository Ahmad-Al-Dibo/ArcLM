import { GenerationPlaygroundPage } from "@/features/generation/generation-playground";

export default async function Page({
  params,
  searchParams
}: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ checkpoint?: string }>;
}) {
  const { projectId } = await params;
  const { checkpoint } = await searchParams;
  return <GenerationPlaygroundPage projectId={projectId} initialCheckpointId={checkpoint} />;
}
