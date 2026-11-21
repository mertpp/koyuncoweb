import { getServerSession } from "next-auth";
import { cache } from "react";

import { authOptions } from "@/auth";

export const getCurrentSession = cache(async () => getServerSession(authOptions));

export const getCurrentUser = cache(async () => {
  const session = await getCurrentSession();

  if (session?.user?.ownerId) {
    return {
      ownerId: session.user.ownerId,
      label: session.user.name ?? session.user.email ?? "User",
    };
  }

  return null;
});

export const getCurrentAccessToken = cache(async (): Promise<string | null> => {
  const session = await getCurrentSession();

  return typeof session?.azureAccessToken === "string"
    ? session.azureAccessToken
    : null;
});
