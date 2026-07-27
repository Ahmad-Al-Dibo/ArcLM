import { ModelBuilderPage } from "@/features/studio2/model-builder";

export default async function Page({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  return <ModelBuilderPage projectId={projectId} />;
}
