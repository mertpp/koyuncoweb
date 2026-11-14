"use client";

import { getAccessToken } from "@/shared/auth/access-token";

import { buildApiUrl, mergeApiHeaders, parseApiResponse } from "./core";

const CLIENT_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export async function apiFetchClient<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const accessToken = await getAccessToken();
  const response = await fetch(buildApiUrl(CLIENT_API_BASE_URL, path), {
    ...options,
    headers: mergeApiHeaders(options, accessToken),
  });

  return parseApiResponse<T>(response);
}
