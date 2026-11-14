import { apiFetchServer } from "@/shared/api/server";

import { createOutfitApi } from "./api";

export const outfitServerApi = createOutfitApi(apiFetchServer);
