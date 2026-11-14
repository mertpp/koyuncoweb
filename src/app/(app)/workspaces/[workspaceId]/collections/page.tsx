import { CollectionsClient } from "@/features/collection/components/collections-client";

export const instant = false;

type CollectionsPageProps = {
  params: Promise<{
    workspaceId: string;
  }>;
};

export default async function WorkspaceCollectionsPage({
  params,
}: CollectionsPageProps) {
  const { workspaceId } = await params;

  return <CollectionsClient workspaceId={workspaceId} />;
}
