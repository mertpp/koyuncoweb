import { NextResponse, type NextRequest } from "next/server";

import {
  DEFAULT_AUTHENTICATED_PATH,
  DEFAULT_LOGIN_PATH,
} from "@/shared/auth/constants";
import { isAuthenticatedRequest } from "@/shared/auth/session";

function isPublicPath(pathname: string) {
  return pathname === DEFAULT_LOGIN_PATH;
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const authenticated = isAuthenticatedRequest(request);
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
