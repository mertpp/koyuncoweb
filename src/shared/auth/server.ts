import { getServerSession } from "next-auth";
import { cookies } from "next/headers";

import { authOptions } from "@/auth";
import {
  AUTH_COOKIE_NAME,
  DEMO_USERS,
  ENABLE_DEMO_LOGIN,
} from "@/shared/auth/constants";

export async function getCurrentSession() {
  return getServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await getCurrentSession();

  if (session?.user?.ownerId) {
    return {
      ownerId: session.user.ownerId,
      label: session.user.name ?? session.user.email ?? "User",
    };
  }

  if (!ENABLE_DEMO_LOGIN) {
    return null;
  }

  /*
   * Fallback demo/local.
   * Esto se puede eliminar cuando quitemos demo.
   */
  const cookieStore = await cookies();
  const ownerId = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  const demoUser = DEMO_USERS.find((user) => user.ownerId === ownerId);

  if (!demoUser) {
    return null;
  }

  return {
    ownerId: demoUser.ownerId,
    label: demoUser.label,
  };
}

export async function getCurrentAccessToken(): Promise<string | null> {
  const session = await getCurrentSession();

  return session?.azureAccessToken ?? null;
}
