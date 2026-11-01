import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

import {
  AUTH_COOKIE_NAME,
  DEFAULT_AUTHENTICATED_PATH,
  DEFAULT_LOGIN_PATH,
  DEMO_USERS,
  ENABLE_DEMO_LOGIN,
} from "@/shared/auth/constants";

function isPublicPath(pathname: string) {
  return pathname === DEFAULT_LOGIN_PATH;
}

async function getNextAuthToken(request: NextRequest) {
  try {
    return await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
  } catch {
    return null;
  }
}

function hasDemoSession(request: NextRequest) {
  if (!ENABLE_DEMO_LOGIN) {
    return false;
  }

  const ownerId = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  return DEMO_USERS.some((user) => user.ownerId === ownerId);
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const token = await getNextAuthToken(request);
  const authenticated = Boolean(token?.ownerId) || hasDemoSession(request);
  const publicPath = isPublicPath(pathname);

  if (!authenticated && !publicPath) {
    const loginUrl = request.nextUrl.clone();

    loginUrl.pathname = DEFAULT_LOGIN_PATH;
    loginUrl.searchParams.set("next", `${pathname}${search}`);

    return NextResponse.redirect(loginUrl);
  }

  if (authenticated && pathname === DEFAULT_LOGIN_PATH) {
    const dashboardUrl = request.nextUrl.clone();

    dashboardUrl.pathname = DEFAULT_AUTHENTICATED_PATH;
    dashboardUrl.search = "";

    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
