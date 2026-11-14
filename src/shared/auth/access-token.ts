"use client";

import { getSession } from "next-auth/react";

export async function getAccessToken(): Promise<string> {
  const session = await getSession();
  const accessToken = session?.azureAccessToken;

  if (!accessToken) {
    throw new Error("Missing access token");
  }

  return accessToken;
}
