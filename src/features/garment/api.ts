import type { ApiFetch } from "@/shared/api/core";

import type {
  GarmentAnalysisRead,
  GarmentCreate,
  GarmentDraftItemRead,
  GarmentListItemRead,
  GarmentPhotoKind,
  GarmentPhotoRead,
  GarmentRead,
  GarmentUpdate,
} from "./types";

// J2 flow (ADR 0036), all decided by the backend:
// createGarment (draft) -> uploadPhoto -> launchAnalysis -> poll getAnalysis
// -> getGarment (prefilled) -> updateGarment({ status: "active" }) to save, or deleteGarment to discard.

const garmentsPath = (workspaceId: string) => `/v1/workspaces/${workspaceId}/garments`;
const garmentPath = (workspaceId: string, garmentId: string) =>
  `${garmentsPath(workspaceId)}/${garmentId}`;

export function createGarmentApi(apiFetch: ApiFetch) {
  return {
    /** The wardrobe: saved garments. */
    listGarments(workspaceId: string) {
      return apiFetch<GarmentListItemRead[]>(`${garmentsPath(workspaceId)}?status=active`);
    },

    /** The caller's unsaved drafts, newest first. */
    listDrafts(workspaceId: string) {
      return apiFetch<GarmentDraftItemRead[]>(`${garmentsPath(workspaceId)}?status=draft`);
    },

    /** Drafts included. */
    getGarment(workspaceId: string, garmentId: string) {
      return apiFetch<GarmentRead>(garmentPath(workspaceId, garmentId));
    },

    /**
     * Always creates a draft. Every field is optional except `source`: it has a default in the
     * backend ("analysis"), but the generated type marks it required, so we send that same value.
     */
    createGarment(workspaceId: string, payload: GarmentCreate = { source: "analysis" }) {
      return apiFetch<GarmentRead>(garmentsPath(workspaceId), {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },

    /** Partial update. `status: "active"` saves a draft; the backend validates it (422). */
    updateGarment(workspaceId: string, garmentId: string, payload: GarmentUpdate) {
      return apiFetch<GarmentRead>(garmentPath(workspaceId, garmentId), {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
    },

    /** Deletes a garment, or discards a draft. */
    deleteGarment(workspaceId: string, garmentId: string) {
      return apiFetch<void>(garmentPath(workspaceId, garmentId), { method: "DELETE" });
    },

    listPhotos(workspaceId: string, garmentId: string) {
      return apiFetch<GarmentPhotoRead[]>(`${garmentPath(workspaceId, garmentId)}/photos`);
    },

    uploadPhoto(
      workspaceId: string,
      garmentId: string,
      file: File,
      kind: GarmentPhotoKind,
      sortOrder: number,
    ) {
      const body = new FormData();
      body.append("file", file);
      body.append("kind", kind);
      body.append("sort_order", String(sortOrder));

      return apiFetch<GarmentPhotoRead>(`${garmentPath(workspaceId, garmentId)}/photos/upload`, {
        method: "POST",
        body,
      });
    },

    deletePhoto(workspaceId: string, garmentId: string, photoId: string) {
      return apiFetch<void>(`${garmentPath(workspaceId, garmentId)}/photos/${photoId}`, {
        method: "DELETE",
      });
    },

    /** Analyse, retry or reanalyse. Returns the pending one if already running. */
    launchAnalysis(workspaceId: string, garmentId: string) {
      return apiFetch<GarmentAnalysisRead>(`${garmentPath(workspaceId, garmentId)}/analysis`, {
        method: "POST",
      });
    },

    /** Latest analysis: pending, completed or failed. The analysing screen polls this. */
    getAnalysis(workspaceId: string, garmentId: string) {
      return apiFetch<GarmentAnalysisRead>(`${garmentPath(workspaceId, garmentId)}/analysis`);
    },
  };
}
