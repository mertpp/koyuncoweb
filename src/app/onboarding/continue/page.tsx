import { redirect } from "next/navigation";

import { ApiError } from "@/shared/api/core";
import { getProfile } from "@/features/profile/server";
import { getCurrentAccessToken, getCurrentUser } from "@/shared/auth/server";


export const instant = false;

export default async function OnboardingContinuePage() {
  const [user, accessToken] = await Promise.all([
    getCurrentUser(),
    getCurrentAccessToken(),
  ]);

  if (!user || !accessToken) {
    redirect("/login");
  }

  let profile;

  try {
    profile = await getProfile();
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      redirect("/login");
    }

    throw error;
  }

  if (!profile.onboarding_completed_at) {
    redirect("/onboarding/profile");
  }

  redirect("/workspaces");
}
