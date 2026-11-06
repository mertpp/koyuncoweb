import Link from "next/link";
import { redirect } from "next/navigation";

import { listWorkspaces } from "@/shared/api/koyun-api";
import { getCurrentAccessToken, getCurrentUser } from "@/shared/auth/server";


export const instant = false;

type WorkspaceDetailPageProps = {
  params: Promise<{
    workspaceId: string;
  }>;
};

export default async function WorkspaceDetailPage({ params }: WorkspaceDetailPageProps) {
  const [{ workspaceId }, accessToken, user] = await Promise.all([
    params,
    getCurrentAccessToken(),
    getCurrentUser(),
  ]);

  if (!user) {
    redirect("/login");
  }

  const workspaces = await listWorkspaces({
    accessToken,
    ownerId: user.ownerId,
  });
  const workspace = workspaces.find((item) => item.id === workspaceId);

  if (!workspace) {
    redirect("/workspaces");
  }

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-1 py-4 pb-24 md:py-8 md:pb-8">
      <header className="space-y-3">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
          Workspace
        </p>
        <h1 className="font-heading text-4xl leading-tight tracking-[-0.03em] md:text-5xl">
          {workspace.name}
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
          Your initial wardrobe workspace is ready. Start by registering your
          first garment.
        </p>
      </header>

      <div className="rounded-[1.75rem] border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-heading text-2xl tracking-[-0.02em]">
              Personal archive
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Workspace ID: {workspace.id}
            </p>
          </div>

          <Link
            href="/garments/new"
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Add first garment
          </Link>
        </div>
      </div>
    </section>
  );
}
