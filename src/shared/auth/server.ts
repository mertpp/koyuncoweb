import { cookies } from "next/headers";

import { AUTH_COOKIE_NAME } from "@/shared/auth/constants";
import { getUserByOwnerId } from "@/shared/auth/session";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const ownerId = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  return getUserByOwnerId(ownerId);
}
