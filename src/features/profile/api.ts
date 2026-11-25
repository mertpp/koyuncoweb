import type { ApiFetch } from "@/shared/api/core";
import type { Schemas } from "@/shared/api/schemas";

export type Profile = Schemas["ProfileRead"];
export type ProfileUpdate = Schemas["ProfileUpdate"];

export function createProfileApi(apiFetch: ApiFetch) {
  return {
    getProfile() {
      return apiFetch<Profile>("/v1/profile");
    },

    updateProfile(payload: ProfileUpdate) {
      return apiFetch<Profile>("/v1/profile", {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
    },
  };
}
