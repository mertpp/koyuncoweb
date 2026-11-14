"use client";

import { apiFetchClient } from "@/shared/api/client";

import { createGarmentApi } from "./api";

export const garmentClientApi = createGarmentApi(apiFetchClient);
