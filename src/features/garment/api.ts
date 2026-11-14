import type { ApiFetch } from "@/shared/api/core";

import type {
  CreateGarmentPayload,
  GarmentListItemRead,
  GarmentRead,
} from "./types";

export function createGarmentApi(apiFetch: ApiFetch) {
  return {
    listGarments(workspaceId: string) {
      return apiFetch<GarmentListItemRead[]>(
        `/v1/workspaces/${workspaceId}/garments`,
      );
    },

    getGarment(workspaceId: string, garmentId: string) {
      return apiFetch<GarmentRead>(
        `/v1/workspaces/${workspaceId}/garments/${garmentId}`,
      );
    },

    createGarment(workspaceId: string, payload: CreateGarmentPayload) {
      return apiFetch<GarmentRead>(`/v1/workspaces/${workspaceId}/garments`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },
  };
}
