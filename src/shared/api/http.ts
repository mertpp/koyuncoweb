import { API_BASE_URL } from "@/shared/config/api";
import { getCurrentAccessToken, getCurrentUser } from "@/shared/auth/server";

export type ApiRequestOptions = {
  accessToken?: string | null;
  ownerId?: string | null;
};

async function authHeaders(options: ApiRequestOptions = {}): Promise<HeadersInit> {
  const accessToken = options.accessToken ?? (await getCurrentAccessToken());

  if (accessToken) {
    return {
      authorization: `Bearer ${accessToken}`,
    };
  }

  const ownerId = options.ownerId ?? (await getCurrentUser())?.ownerId;

  if (ownerId) {
    return {
      "x-owner-id": ownerId,
    };
  }

  return {};
}

async function readErrorBody(response: Response) {
  return response.text().catch(() => "");
}

export async function apiGet<TResponse>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<TResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    cache: "no-store",
    headers: {
      ...(await authHeaders(options)),
    },
  });

  if (!response.ok) {
    const body = await readErrorBody(response);
    throw new Error(body || `GET ${path} failed: ${response.status}`);
  }

  return (await response.json()) as TResponse;
}

export async function apiPost<TResponse, TBody>(
  path: string,
  body: TBody,
  options: ApiRequestOptions = {},
): Promise<TResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    cache: "no-store",
    headers: {
      "content-type": "application/json",
      ...(await authHeaders(options)),
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const responseBody = await readErrorBody(response);
    throw new Error(responseBody || `POST ${path} failed: ${response.status}`);
  }

  return (await response.json()) as TResponse;
}

export async function apiPatch<TResponse, TBody>(
  path: string,
  body: TBody,
  options: ApiRequestOptions = {},
): Promise<TResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "PATCH",
    cache: "no-store",
    headers: {
      "content-type": "application/json",
      ...(await authHeaders(options)),
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const responseBody = await readErrorBody(response);
    throw new Error(responseBody || `PATCH ${path} failed: ${response.status}`);
  }

  return (await response.json()) as TResponse;
}
