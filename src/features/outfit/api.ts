import type { ApiFetch } from "@/shared/api/core";

import type {
  CreateOutfitPayload,
  OutfitRead,
  UpdateOutfitPayload,
} from "./types";

export function createOutfitApi(apiFetch: ApiFetch) {
  return {
    listOutfits(workspaceId: string, collectionId: string) {
      return apiFetch<OutfitRead[]>(
        `/v1/workspaces/${workspaceId}/collections/${collectionId}/outfits`,
      );
    },

    createOutfit(
      workspaceId: string,
      collectionId: string,
      payload: CreateOutfitPayload,
    ) {
      return apiFetch<OutfitRead>(
        `/v1/workspaces/${workspaceId}/collections/${collectionId}/outfits`,
        {
          method: "POST",
          body: JSON.stringify(payload),
        },
      );
    },

    getOutfit(workspaceId: string, collectionId: string, outfitId: string) {
      return apiFetch<OutfitRead>(
        `/v1/workspaces/${workspaceId}/collections/${collectionId}/outfits/${outfitId}`,
      );
    },

    updateOutfit(
      workspaceId: string,
      collectionId: string,
      outfitId: string,
      payload: UpdateOutfitPayload,
    ) {
      return apiFetch<OutfitRead>(
        `/v1/workspaces/${workspaceId}/collections/${collectionId}/outfits/${outfitId}`,
        {
          method: "PATCH",
          body: JSON.stringify(payload),
        },
      );
    },

    deleteOutfit(workspaceId: string, collectionId: string, outfitId: string) {
      return apiFetch<void>(
        `/v1/workspaces/${workspaceId}/collections/${collectionId}/outfits/${outfitId}`,
        {
          method: "DELETE",
        },
      );
    },
  };
}
