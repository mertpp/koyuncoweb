"use server";

import { redirect } from "next/navigation";

import type { ProfileUpdate } from "@/features/profile/api";
import { updateProfile } from "@/features/profile/server";
import { workspaceServerApi } from "@/features/workspace/server";
import { ApiError } from "@/shared/api/core";
import { getCurrentUser } from "@/shared/auth/server";

// Onboarding (J1, doc/backend-contract.md): one PATCH /v1/profile per step. The profile and
// the first workspace already exist (POST /v1/me at sign-in). display_name is not sent: it
// comes from Entra, not from this form.

/** Fields the onboarding may write. */
export type OnboardingUpdate = Pick<ProfileUpdate, "city" | "country_code" | "personal_statement">;

export type StepResult = { ok: true } | { ok: false; message: string; fieldErrors: Record<string, string> };

async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }
}

function pick(update: OnboardingUpdate): OnboardingUpdate {
  return {
    ...(update.city !== undefined ? { city: update.city } : {}),
    ...(update.country_code !== undefined ? { country_code: update.country_code } : {}),
    ...(update.personal_statement !== undefined
      ? { personal_statement: update.personal_statement }
      : {}),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/** Turns the backend error envelope into a message and, for 422, errors per field. */
function toStepError(error: ApiError): StepResult {
  const envelope = isRecord(error.body) && isRecord(error.body.error) ? error.body.error : null;
  const message =
    envelope && typeof envelope.message === "string" ? envelope.message : "Could not save. Try again.";
  const fieldErrors: Record<string, string> = {};

  if (error.status === 422 && envelope && Array.isArray(envelope.details)) {
    for (const item of envelope.details) {
      if (!isRecord(item) || !Array.isArray(item.loc) || typeof item.msg !== "string") {
        continue;
      }

      const field = item.loc[item.loc.length - 1];

      if (typeof field === "string") {
        fieldErrors[field] = item.msg;
      }
    }
  }

  return { ok: false, message, fieldErrors };
}

async function patch(update: ProfileUpdate): Promise<StepResult> {
  try {
    await updateProfile(update);
    return { ok: true };
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        redirect("/login");
      }

      return toStepError(error);
    }

    throw error;
  }
}

/** "Next" on a step: saves only that step's fields. */
export async function saveOnboardingStep(update: OnboardingUpdate): Promise<StepResult> {
  await requireUser();
  return patch(pick(update));
}

/** "Start": saves the last step, marks the onboarding as done and opens the wardrobe. */
export async function finishOnboarding(update: OnboardingUpdate): Promise<StepResult> {
  await requireUser();

  const result = await patch({ ...pick(update), onboarding_completed_at: new Date().toISOString() });

  if (!result.ok) {
    return result;
  }

  // Until Today exists, the onboarding ends in the wardrobe created by POST /v1/me.
  const [workspace] = await workspaceServerApi.listWorkspaces();

  redirect(workspace ? `/workspaces/${workspace.id}` : "/workspaces");
}
