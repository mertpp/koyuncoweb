import { CollectionsClient } from "@/features/collection/components/collections-client";
import { collectionServerApi } from "@/features/collection/server";
import { workspaceServerApi } from "@/features/workspace/server";

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
  const [workspace, collections] = await Promise.all([
    workspaceServerApi.getWorkspace(workspaceId),
    collectionServerApi.listCollections(workspaceId),
  ]);

  return (
    <CollectionsClient
      initialCollections={collections}
      initialWorkspace={workspace}
      workspaceId={workspaceId}
    />
  );
}
