"use client";

import { apiFetchClient } from "@/shared/api/client";

import { createProfileApi } from "./api";

export const profileClientApi = createProfileApi(apiFetchClient);
