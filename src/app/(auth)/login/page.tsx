import { LoginForm } from "@/shared/components/ui/login-form";

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

  return <LoginForm nextPath={nextPath} />;
}
