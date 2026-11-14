import { apiFetchServer } from "@/shared/api/server";

import { createGarmentApi } from "./api";

export const garmentServerApi = createGarmentApi(apiFetchServer);
