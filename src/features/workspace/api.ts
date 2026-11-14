import type { ApiFetch } from "@/shared/api/core";

import type { WorkspaceRead } from "./types";

export function createWorkspaceApi(apiFetch: ApiFetch) {
  return {
    getWorkspace(workspaceId: string) {
      return apiFetch<WorkspaceRead>(`/v1/workspaces/${workspaceId}`);
    },
  };
}
