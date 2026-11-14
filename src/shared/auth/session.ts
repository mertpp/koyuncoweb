import type { NextRequest } from "next/server";

export type AuthUser = {
  ownerId: string;
  label: string;
};

export function getUserByOwnerId(ownerId: string | undefined | null): AuthUser | null {
  void ownerId;

  return null;
}

export function getUserFromRequest(request: NextRequest): AuthUser | null {
  void request;

  return null;
}

export function isAuthenticatedRequest(request: NextRequest) {
  void request;

  return false;
}
