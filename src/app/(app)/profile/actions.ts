"use server";

import { redirect } from "next/navigation";

import { ensureProfile, updateProfile, type ProfileUpdate } from "@/features/profile/api";
import { ensureAccount } from "@/shared/api/koyun-api";
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

export async function saveProfile(formData: FormData) {
  const [accessToken, user] = await Promise.all([
    getCurrentAccessToken(),
    getCurrentUser(),
  ]);

  if (!user) {
    redirect("/login");
  }

  const auth = {
    accessToken,
    ownerId: user.ownerId,
  };

  await ensureAccount(auth);
  await ensureProfile(auth);

  const payload: ProfileUpdate = {
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
    onboarding_completed_at: new Date().toISOString(),
  };

  await updateProfile(payload, auth);

  redirect("/profile?saved=1");
}
