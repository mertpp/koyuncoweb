import Link from "next/link";

import { LoginForm } from "@/shared/components/login-form";
import { GalleryVerticalEndIcon } from "lucide-react";

export const instant = false;

function normalizeNextPath(next: string | string[] | undefined) {
  if (typeof next !== "string") {
    return "/dashboard";
  }

  if (!next.startsWith("/") || next.startsWith("//")) {
    return "/dashboard";
  }

  return next;
}

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const params = await searchParams;
  const nextPath = normalizeNextPath(params.next);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEndIcon className="size-4" />
          </div>
          Koyunco
        </Link>

        <LoginForm nextPath={nextPath} />
      </div>
    </div>
  );
}
