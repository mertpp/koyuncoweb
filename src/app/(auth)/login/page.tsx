import { redirect } from "next/navigation";

import { DEFAULT_AUTHENTICATED_PATH } from "@/shared/auth/constants";

export const instant = false;

function normalizeNextPath(next: string | string[] | undefined) {
  if (typeof next !== "string") {
    return DEFAULT_AUTHENTICATED_PATH;
  }

  if (!next.startsWith("/") || next.startsWith("//")) {
    return DEFAULT_AUTHENTICATED_PATH;
  }

  return next;
}

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const params = await searchParams;
  const nextPath = normalizeNextPath(params.next);
  const suffix = nextPath === DEFAULT_AUTHENTICATED_PATH ? "" : `?next=${encodeURIComponent(nextPath)}`;

  redirect(`/${suffix}`);
}
