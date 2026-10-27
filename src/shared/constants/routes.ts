export const routes = {
  home: "/",
  login: "/login",
  workspaces: "/workspaces",
  newWorkspace: "/workspaces/new",
  workspace: (workspaceId: string) => `/workspaces/${workspaceId}`,
  workspaceGarments: (workspaceId: string) =>
    `/workspaces/${workspaceId}/garments`,
  newWorkspaceGarment: (workspaceId: string) =>
    `/workspaces/${workspaceId}/garments/new`,
  workspaceGarment: (workspaceId: string, garmentId: string) =>
    `/workspaces/${workspaceId}/garments/${garmentId}`,
} as const;
