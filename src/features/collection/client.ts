"use client";

import { apiFetchClient } from "@/shared/api/client";

import { createCollectionApi } from "./api";

export const collectionClientApi = createCollectionApi(apiFetchClient);
