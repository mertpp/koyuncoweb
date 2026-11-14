"use client";

import { apiFetchClient } from "@/shared/api/client";

import { createOutfitApi } from "./api";

export const outfitClientApi = createOutfitApi(apiFetchClient);
