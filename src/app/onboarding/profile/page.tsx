import { redirect } from "next/navigation";

import { ApiError } from "@/shared/api/core";
import { OnboardingWizard } from "./onboarding-wizard";

import { ensureProfile } from "@/features/profile/server";
import { getCurrentAccessToken, getCurrentUser } from "@/shared/auth/server";

export const instant = false;

type OnboardingProfilePageProps = {
  searchParams: Promise<{
    saved?: string;
  }>;
};

export default async function OnboardingProfilePage({
  searchParams,
}: OnboardingProfilePageProps) {
  const [params, accessToken, user] = await Promise.all([
    searchParams,
    getCurrentAccessToken(),
    getCurrentUser(),
  ]);

  if (!user || !accessToken) {
    redirect("/login");
  }

  const auth = {
    accessToken,
    ownerId: user.ownerId,
  };

  let profile;

  try {
    profile = await ensureProfile(auth);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      redirect("/login");
    }

    throw error;
  }

  return <OnboardingWizard profile={profile} saved={params.saved === "1"} />;
}
