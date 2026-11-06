import { redirect } from "next/navigation";

import { ensureProfile } from "@/features/profile/api";
import { ensureAccount } from "@/shared/api/koyun-api";
import { getCurrentAccessToken, getCurrentUser } from "@/shared/auth/server";


export const instant = false;

export default async function OnboardingContinuePage() {
  const [user, accessToken] = await Promise.all([
    getCurrentUser(),
    getCurrentAccessToken(),
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

  if (!profile.onboarding_completed_at) {
    redirect("/onboarding/profile");
  }

  redirect("/workspaces");
}
