"use client";

import { apiFetchClient } from "@/shared/api/client";

import { createWorkspaceApi } from "./api";

export const workspaceClientApi = createWorkspaceApi(apiFetchClient);
