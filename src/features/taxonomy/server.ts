import { apiFetchServer } from "@/shared/api/server";

import { createTaxonomyApi } from "./api";

export const taxonomyServerApi = createTaxonomyApi(apiFetchServer);
