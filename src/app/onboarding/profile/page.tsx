import { redirect } from "next/navigation";

import { getProfile } from "@/features/profile/server";
import { ApiError } from "@/shared/api/core";
import { getCurrentAccessToken, getCurrentUser } from "@/shared/auth/server";

import { countryOptions } from "./countries";
import { OnboardingWizard } from "./onboarding-wizard";

export const instant = false;

export default async function OnboardingProfilePage() {
  const [accessToken, user] = await Promise.all([getCurrentAccessToken(), getCurrentUser()]);

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

  // The name comes from Entra. Shown, never edited or sent from here: the backend owns
  // copying it into the profile (doc/estado-y-plan.md, backend gap B1).
  const name = profile.display_name?.trim() || user.label;

  return <OnboardingWizard name={name} profile={profile} countries={countryOptions()} />;
}
