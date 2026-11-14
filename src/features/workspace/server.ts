import { apiFetchServer } from "@/shared/api/server";

import { createWorkspaceApi } from "./api";

export const workspaceServerApi = createWorkspaceApi(apiFetchServer);
