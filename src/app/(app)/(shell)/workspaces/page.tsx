import Link from "next/link";
import { redirect } from "next/navigation";

import { listWorkspaces } from "@/shared/api/koyun-api";
import { getCurrentAccessToken, getCurrentUser } from "@/shared/auth/server";
import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

export const instant = false;

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export default async function WorkspacesPage() {
  const [accessToken, user] = await Promise.all([
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

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-1 py-4 pb-24 md:py-8 md:pb-8">
      <header className="rounded-[2rem] border bg-card px-6 py-7 shadow-sm md:px-8 md:py-9">
        <div className="max-w-3xl space-y-4">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-muted-foreground">
            Workspace access
          </p>
          <div className="space-y-3">
            <h1 className="font-heading text-4xl leading-tight tracking-[-0.04em] md:text-6xl">
              Workspaces
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
              Choose the collaboration container you want to open. Collections,
              garments and saved combinations live inside a workspace.
            </p>
          </div>
        </div>
      </header>

      {workspaces.length === 0 ? (
        <Card className="border-dashed bg-card/80 py-14 text-center">
          <CardContent className="mx-auto max-w-xl space-y-4">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
              No workspace available
            </p>
            <h2 className="font-heading text-3xl tracking-[-0.03em]">
              Create a workspace to begin
            </h2>
            <p className="text-sm leading-6 text-muted-foreground">
              No workspace was returned for this account. Once a workspace
              exists, its garments and collections will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {workspaces.map((workspace) => (
            <Card key={workspace.id} className="bg-card/95">
              <CardHeader className="gap-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl tracking-[-0.03em]">
                      {workspace.name}
                    </CardTitle>
                    <CardDescription>
                      Updated {formatDate(workspace.updated_at)}
                    </CardDescription>
                  </div>
                  <Badge variant="outline">Workspace</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <Link
                  href={`/workspaces/${workspace.id}`}
                  className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/80"
                >
                  Open overview
                </Link>
                <Link
                  href={`/workspaces/${workspace.id}/collections`}
                  className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-background px-4 text-sm font-medium transition hover:bg-muted"
                >
                  Open collections
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
