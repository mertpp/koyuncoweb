"use client";

import { apiFetchClient } from "@/shared/api/client";

import { createTaxonomyApi } from "./api";

export const taxonomyClientApi = createTaxonomyApi(apiFetchClient);
