import { apiFetchServer } from "@/shared/api/server";

import { createProfileApi, type ProfileUpdate } from "./api";

const profileServerApi = createProfileApi(apiFetchServer);

export function ensureProfile(auth?: unknown) {
  void auth;

  return profileServerApi.ensureProfile();
}

export function getProfile(auth?: unknown) {
  void auth;

  return profileServerApi.getProfile();
}

export function updateProfile(payload: ProfileUpdate, auth?: unknown) {
  void auth;

  return profileServerApi.updateProfile(payload);
}
