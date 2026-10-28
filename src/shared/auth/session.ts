import type { NextRequest } from "next/server";

import { AUTH_COOKIE_NAME, DEMO_USERS } from "@/shared/auth/constants";

export type AuthUser = {
  ownerId: string;
  label: string;
};

export function getUserByOwnerId(
  ownerId: string | undefined | null,
): AuthUser | null {
  if (!ownerId) {
    return null;
  }

  const demoUser = DEMO_USERS.find((user) => user.ownerId === ownerId);

  if (!demoUser) {
    return null;
  }

  return {
    ownerId: demoUser.ownerId,
    label: demoUser.label,
  };
}

export function getUserFromRequest(request: NextRequest): AuthUser | null {
  const ownerId = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  return getUserByOwnerId(ownerId);
}

export function isAuthenticatedRequest(request: NextRequest) {
  return getUserFromRequest(request) !== null;
}
