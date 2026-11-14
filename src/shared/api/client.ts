"use client";

import { buildApiUrl, fetchWithTimeout, parseApiResponse } from "./core";

// Browser API calls go through Next so Azure tokens stay server-side.
const CLIENT_API_BASE_URL = "/api/backend";

export async function apiFetchClient<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers);

  if (options.body && !(options.body instanceof FormData) && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }

  const response = await fetchWithTimeout(buildApiUrl(CLIENT_API_BASE_URL, path), {
    ...options,
    headers,
  });

  return parseApiResponse<T>(response);
}
