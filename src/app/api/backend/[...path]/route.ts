import { NextResponse, type NextRequest } from "next/server";

import { buildApiUrl, fetchWithTimeout } from "@/shared/api/core";
import { API_BASE_URL } from "@/shared/config/api";
import { getCurrentAccessToken } from "@/shared/auth/server";

const HOP_BY_HOP_HEADERS = new Set([
  "connection",
  "content-length",
  "host",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
]);

function copyRequestHeaders(request: NextRequest, accessToken: string) {
  const headers = new Headers();

  for (const [name, value] of request.headers) {
    const lowerName = name.toLowerCase();

    if (!HOP_BY_HOP_HEADERS.has(lowerName) && lowerName !== "authorization") {
      headers.set(name, value);
    }
  }

  headers.set("authorization", `Bearer ${accessToken}`);

  return headers;
}

async function proxyApiRequest(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const accessToken = await getCurrentAccessToken();

  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { path } = await context.params;
  const targetPath = `/${path.join("/")}${request.nextUrl.search}`;
  const method = request.method.toUpperCase();
  const body = method === "GET" || method === "HEAD" ? undefined : await request.arrayBuffer();
  const upstreamResponse = await fetchWithTimeout(buildApiUrl(API_BASE_URL, targetPath), {
    method,
    headers: copyRequestHeaders(request, accessToken),
    body,
    cache: "no-store",
  });

  const responseHeaders = new Headers(upstreamResponse.headers);
  responseHeaders.delete("content-encoding");
  responseHeaders.delete("content-length");
  responseHeaders.delete("transfer-encoding");

  return new NextResponse(upstreamResponse.body, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers: responseHeaders,
  });
}

export const GET = proxyApiRequest;
export const POST = proxyApiRequest;
export const PUT = proxyApiRequest;
export const PATCH = proxyApiRequest;
export const DELETE = proxyApiRequest;
