import { apiGet, apiPatch, apiPost, type ApiRequestOptions } from "@/shared/api/http";

export type Profile = {
  id: string;
  account_id: string;
  display_name: string | null;
  birth_year: number | null;
  gender: string | null;
  country_code: string | null;
  city: string | null;
  occupation: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  body_shape: string | null;
  body_notes: string | null;
  work_environment: string | null;
  travel_frequency: string | null;
  activity_level: string | null;
  values: string[];
  favorite_colors: string[];
  avoided_colors: string[];
  favorite_materials: string[];
  avoided_materials: string[];
  personal_statement: string | null;
  onboarding_completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ProfileUpdate = {
  display_name?: string | null;
  birth_year?: number | null;
  gender?: string | null;
  country_code?: string | null;
  city?: string | null;
  occupation?: string | null;
  height_cm?: number | null;
  weight_kg?: number | null;
  body_shape?: string | null;
  body_notes?: string | null;
  work_environment?: string | null;
  travel_frequency?: string | null;
  activity_level?: string | null;
  values?: string[] | null;
  favorite_colors?: string[] | null;
  avoided_colors?: string[] | null;
  favorite_materials?: string[] | null;
  avoided_materials?: string[] | null;
  personal_statement?: string | null;
  onboarding_completed_at?: string | null;
};

export async function ensureProfile(
  options: ApiRequestOptions = {},
): Promise<Profile> {
  return apiPost<Profile, Record<string, never>>("/v1/profile", {}, options);
}

export async function getProfile(
  options: ApiRequestOptions = {},
): Promise<Profile> {
  return apiGet<Profile>("/v1/profile", options);
}

export async function updateProfile(
  payload: ProfileUpdate,
  options: ApiRequestOptions = {},
): Promise<Profile> {
  return apiPatch<Profile, ProfileUpdate>("/v1/profile", payload, options);
}
