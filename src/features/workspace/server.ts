import { apiFetchServer } from "@/shared/api/server";

import { createWorkspaceApi } from "./api";

export const workspaceServerApi = createWorkspaceApi(apiFetchServer);

/**
 * Path inside the account's wardrobe, for routes that carry no workspace (sidebar links,
 * old bookmarks). The workspace is the one POST /v1/me created at sign-up; the frontend never
 * creates one. Without any, the user lands on /workspaces.
 */
export async function wardrobePath(suffix = "") {
  const [workspace] = await workspaceServerApi.listWorkspaces();

  return workspace ? `/workspaces/${workspace.id}/garments${suffix}` : "/workspaces";
}
