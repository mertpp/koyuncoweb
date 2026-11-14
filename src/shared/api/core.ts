const DEFAULT_API_TIMEOUT_MS =
  typeof window === "undefined"
    ? Number(
        process.env.API_TIMEOUT_MS ??
          process.env.NEXT_PUBLIC_API_TIMEOUT_MS ??
          15_000,
      )
    : Number(process.env.NEXT_PUBLIC_API_TIMEOUT_MS ?? 15_000);

function getApiTimeoutMs(timeoutMs = DEFAULT_API_TIMEOUT_MS) {
  return Number.isFinite(timeoutMs) && timeoutMs > 0 ? timeoutMs : 15_000;
}

export class ApiTimeoutError extends Error {
  timeoutMs: number;

  constructor(timeoutMs: number) {
    super(`API request timed out after ${timeoutMs}ms`);
    this.name = "ApiTimeoutError";
    this.timeoutMs = timeoutMs;
  }
}

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, body: unknown, message?: string) {
    super(message ?? `API request failed with status ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

export type ApiFetch = <T>(path: string, options?: RequestInit) => Promise<T>;

export async function fetchWithTimeout(
  input: RequestInfo | URL,
  init: RequestInit = {},
  timeoutMs = DEFAULT_API_TIMEOUT_MS,
): Promise<Response> {
  const effectiveTimeoutMs = getApiTimeoutMs(timeoutMs);
  const controller = new AbortController();
  let timedOut = false;

  const abortFromCaller = () => controller.abort();

  if (init.signal?.aborted) {
    controller.abort();
  } else {
    init.signal?.addEventListener("abort", abortFromCaller, { once: true });
  }

  const timeoutId = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, effectiveTimeoutMs);

  try {
    return await fetch(input, {
      ...init,
      signal: controller.signal,
    });
  } catch (error) {
    if (timedOut) {
      throw new ApiTimeoutError(effectiveTimeoutMs);
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
    init.signal?.removeEventListener("abort", abortFromCaller);
  }
}

export function buildApiUrl(baseUrl: string, path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (!baseUrl) {
    return normalizedPath;
  }

  return `${baseUrl.replace(/\/$/, "")}${normalizedPath}`;
}

async function readResponseBody(response: Response): Promise<unknown> {
  const text = await response.text().catch(() => "");

  if (!text) {
    return null;
  }

  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    try {
      return JSON.parse(text) as unknown;
    } catch {
      return text;
    }
  }

  return text;
}

export async function parseApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await readResponseBody(response);
    throw new ApiError(response.status, body);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const body = await readResponseBody(response);

  return body as T;
}

export function mergeApiHeaders(
  options: RequestInit,
  accessToken: string,
): HeadersInit {
  const headers = new Headers(options.headers);

  headers.set("authorization", `Bearer ${accessToken}`);

  if (options.body && !(options.body instanceof FormData) && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }

  return headers;
}
