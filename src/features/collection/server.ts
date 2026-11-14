import { apiFetchServer } from "@/shared/api/server";

import { createCollectionApi } from "./api";

export const collectionServerApi = createCollectionApi(apiFetchServer);
