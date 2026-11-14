"use client";

export function clearCachedAccessToken() {
  // Access tokens are intentionally server-only.
}

export async function getAccessToken(): Promise<string> {
  throw new Error("Client-side access tokens are disabled");
}
