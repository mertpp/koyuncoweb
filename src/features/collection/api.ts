import type { ApiFetch } from "@/shared/api/core";

import type {
  CollectionGarmentDetailRead,
  CollectionGarmentItemRead,
  CollectionGarmentListStatus,
  CollectionGarmentRead,
  CollectionRead,
  CreateCollectionPayload,
  UpsertCollectionGarmentPayload,
} from "./types";

export function createCollectionApi(apiFetch: ApiFetch) {
  return {
    listCollections(workspaceId: string) {
      return apiFetch<CollectionRead[]>(
        `/v1/workspaces/${workspaceId}/collections`,
      );
    },

    createCollection(workspaceId: string, payload: CreateCollectionPayload) {
      return apiFetch<CollectionRead>(
        `/v1/workspaces/${workspaceId}/collections`,
        {
          method: "POST",
          body: JSON.stringify(payload),
        },
      );
    },

    getCollection(workspaceId: string, collectionId: string) {
      return apiFetch<CollectionRead>(
        `/v1/workspaces/${workspaceId}/collections/${collectionId}`,
      );
    },

    listCollectionGarments(
      workspaceId: string,
      collectionId: string,
      status: CollectionGarmentListStatus = "included",
    ) {
      const params = new URLSearchParams({ status });

      return apiFetch<CollectionGarmentItemRead[]>(
        `/v1/workspaces/${workspaceId}/collections/${collectionId}/garments?${params.toString()}`,
      );
    },

    getCollectionGarment(
      workspaceId: string,
      collectionId: string,
      garmentId: string,
    ) {
      return apiFetch<CollectionGarmentDetailRead>(
        `/v1/workspaces/${workspaceId}/collections/${collectionId}/garments/${garmentId}`,
      );
    },

    upsertCollectionGarment(
      workspaceId: string,
      collectionId: string,
      garmentId: string,
      payload: UpsertCollectionGarmentPayload,
    ) {
      return apiFetch<CollectionGarmentRead>(
        `/v1/workspaces/${workspaceId}/collections/${collectionId}/garments/${garmentId}`,
        {
          method: "PUT",
          body: JSON.stringify(payload),
        },
      );
    },

    removeCollectionGarment(
      workspaceId: string,
      collectionId: string,
      garmentId: string,
    ) {
      return apiFetch<void>(
        `/v1/workspaces/${workspaceId}/collections/${collectionId}/garments/${garmentId}`,
        {
          method: "DELETE",
        },
      );
    },
  };
}
