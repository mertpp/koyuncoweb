import { redirect } from "next/navigation";

import { OnboardingWizard } from "./onboarding-wizard";

import { ensureProfile } from "@/features/profile/api";
import { ensureAccount } from "@/shared/api/koyun-api";
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

  if (!user) {
    redirect("/login");
  }

  const auth = {
    accessToken,
    ownerId: user.ownerId,
  };

  await ensureAccount(auth);
  const profile = await ensureProfile(auth);

  return <OnboardingWizard profile={profile} saved={params.saved === "1"} />;
}
