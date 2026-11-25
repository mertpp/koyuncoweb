import type { ApiFetch } from "@/shared/api/core";

import type { WorkspaceRead } from "./types";

export function createWorkspaceApi(apiFetch: ApiFetch) {
  return {
    /** Workspaces of the current account. POST /v1/me creates the first one ("My Wardrobe"). */
    listWorkspaces() {
      return apiFetch<WorkspaceRead[]>("/v1/workspaces");
    },

    getWorkspace(workspaceId: string) {
      return apiFetch<WorkspaceRead>(`/v1/workspaces/${workspaceId}`);
    },
  };
}
