"use server";

import { redirect } from "next/navigation";

import { ensureProfile, updateProfile, type ProfileUpdate } from "@/features/profile/api";
import {
  createWorkspace,
  ensureAccount,
  listWorkspaces,
} from "@/shared/api/koyun-api";
import { getCurrentAccessToken, getCurrentUser } from "@/shared/auth/server";

function stringValue(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();
  return value || null;
}

function numberValue(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();

  if (!value) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function listValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function profilePayload(formData: FormData, complete: boolean): ProfileUpdate {
  return {
    display_name: stringValue(formData, "displayName"),
    birth_year: numberValue(formData, "birthYear"),
    gender: stringValue(formData, "gender"),
    country_code: stringValue(formData, "countryCode")?.toUpperCase() ?? null,
    city: stringValue(formData, "city"),
    occupation: stringValue(formData, "occupation"),
    height_cm: numberValue(formData, "heightCm"),
    weight_kg: numberValue(formData, "weightKg"),
    body_shape: stringValue(formData, "bodyShape"),
    body_notes: stringValue(formData, "bodyNotes"),
    work_environment: stringValue(formData, "workEnvironment"),
    travel_frequency: stringValue(formData, "travelFrequency"),
    activity_level: stringValue(formData, "activityLevel"),
    values: listValue(formData, "values"),
    favorite_colors: listValue(formData, "favoriteColors"),
    avoided_colors: listValue(formData, "avoidedColors"),
    favorite_materials: listValue(formData, "favoriteMaterials"),
    avoided_materials: listValue(formData, "avoidedMaterials"),
    personal_statement: stringValue(formData, "personalStatement"),
    ...(complete ? { onboarding_completed_at: new Date().toISOString() } : {}),
  };
}

async function getAuthOrRedirect() {
  const [accessToken, user] = await Promise.all([
    getCurrentAccessToken(),
    getCurrentUser(),
  ]);

  if (!user) {
    redirect("/login");
  }

  return {
    accessToken,
    ownerId: user.ownerId,
  };
}

export async function saveOnboardingDraft(formData: FormData) {
  const auth = await getAuthOrRedirect();

  await ensureAccount(auth);
  await ensureProfile(auth);
  await updateProfile(profilePayload(formData, false), auth);

  redirect("/onboarding/profile?saved=1");
}

export async function completeProfileOnboarding(formData: FormData) {
  const displayName = String(formData.get("displayName") ?? "").trim();

  if (!displayName) {
    throw new Error("Display name is required");
  }

  const auth = await getAuthOrRedirect();

  await ensureAccount(auth);
  await ensureProfile(auth);
  await updateProfile(profilePayload(formData, true), auth);

  const workspaces = await listWorkspaces(auth);
  const existingWorkspace =
    workspaces.find((workspace) => workspace.name === "Personal") ?? workspaces[0];

  if (existingWorkspace) {
    redirect(`/workspaces/${existingWorkspace.id}`);
  }

  const workspace = await createWorkspace(auth, "Personal");

  redirect(`/workspaces/${workspace.id}`);
}
