import type { ApiFetch } from "@/shared/api/core";
import type { Schemas } from "@/shared/api/schemas";

export type GarmentType = Schemas["GarmentTypeRead"];

export function createTaxonomyApi(apiFetch: ApiFetch) {
  return {
    /** Canonical garment types ("category" in the UI). */
    listGarmentTypes() {
      return apiFetch<GarmentType[]>("/v1/taxonomy/garment-types");
    },
  };
}

/** Display name from a label key ("garment_type.t_shirt" -> "T Shirt") until i18n exists. */
export function taxonomyLabel(labelKey: string) {
  const raw = labelKey.split(".").at(-1) ?? labelKey;

  return raw.replaceAll("_", " ").replace(/\b\w/g, (character) => character.toUpperCase());
}
