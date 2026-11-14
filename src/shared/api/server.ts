import { getCurrentAccessToken } from "@/shared/auth/server";

import { buildApiUrl, fetchWithTimeout, mergeApiHeaders, parseApiResponse } from "./core";

const SERVER_API_BASE_URL = process.env.API_BASE_URL ?? "";

export async function apiFetchServer<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const accessToken = await getCurrentAccessToken();

  if (!accessToken) {
    throw new Error("Missing access token");
  }

  const response = await fetchWithTimeout(buildApiUrl(SERVER_API_BASE_URL, path), {
    ...options,
    cache: options.cache ?? "no-store",
    headers: mergeApiHeaders(options, accessToken),
  });

  return parseApiResponse<T>(response);
}
