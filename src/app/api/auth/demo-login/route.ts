import { NextResponse } from "next/server";

import {
  AUTH_COOKIE_NAME,
  DEFAULT_AUTHENTICATED_PATH,
  DEMO_USERS,
} from "@/shared/auth/constants";

function normalizeNextPath(next: unknown) {
  if (typeof next !== "string") {
    return DEFAULT_AUTHENTICATED_PATH;
  }

  if (!next.startsWith("/") || next.startsWith("//")) {
    return DEFAULT_AUTHENTICATED_PATH;
  }

  return next;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    ownerId?: string;
    next?: string;
  } | null;

  const ownerId = body?.ownerId;
  const nextPath = normalizeNextPath(body?.next);

  const demoUser = DEMO_USERS.find((user) => user.ownerId === ownerId);

  if (!demoUser) {
    return NextResponse.json(
      {
        error: "Invalid demo user",
      },
      {
        status: 401,
      },
    );
  }

  const response = NextResponse.json({
    user: {
      ownerId: demoUser.ownerId,
      label: demoUser.label,
    },
    next: nextPath,
  });

  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: demoUser.ownerId,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  return response;
}
