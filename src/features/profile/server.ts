import { apiFetchServer } from "@/shared/api/server";

import { createProfileApi, type ProfileUpdate } from "./api";

// The profile is created by POST /v1/me at sign-in (src/auth.ts); here it is only read and
// updated. The access token is read from the session inside apiFetchServer.
const profileServerApi = createProfileApi(apiFetchServer);

export function getProfile() {
  return profileServerApi.getProfile();
}

export function updateProfile(payload: ProfileUpdate) {
  return profileServerApi.updateProfile(payload);
}
