import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { cookies } from "next/headers";
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

const getCurrentToken = cache(async () => {
  const cookieStore = await cookies();

  return getToken({
    req: {
      cookies: cookieStore,
      headers: new Headers(),
    } as unknown as Parameters<typeof getToken>[0]["req"],
    secret: process.env.NEXTAUTH_SECRET,
  });
});

export const getCurrentAccessToken = cache(async (): Promise<string | null> => {
  const session = await getCurrentSession();

  return typeof session?.azureAccessToken === "string"
    ? session.azureAccessToken
    : null;
});
