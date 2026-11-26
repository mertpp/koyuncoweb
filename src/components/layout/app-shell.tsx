import { Suspense } from "react";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { Topbar } from "@/components/layout/topbar";
import { getProfile } from "@/features/profile/server";
import { listWorkspaces } from "@/shared/api/koyun-api";
import {
  getCurrentAccessToken,
  getCurrentSession,
  getCurrentUser,
} from "@/shared/auth/server";
import { SidebarInset, SidebarProvider } from "@/shared/components/ui/sidebar";

export async function AppShell({ children }: { children: React.ReactNode }) {
  const [session, currentUser, accessToken, profile] = await Promise.all([
    getCurrentSession(),
    getCurrentUser(),
    getCurrentAccessToken(),
    // The name is cosmetic: if the profile cannot be read, the menu shows the email.
    getProfile().catch(() => null),
  ]);
  const user = {
    name: profile?.display_name?.trim() || session?.user?.email || currentUser?.label || "User",
    email: session?.user?.email ?? "",
    avatar: session?.user?.image ?? "",
  };
  const workspaces = currentUser
    ? await listWorkspaces({
        accessToken,
        ownerId: currentUser.ownerId,
      }).catch(() => [])
    : [];
  const latestWorkspace = [...workspaces].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  )[0];
  const latestWorkspaceCollectionsHref = latestWorkspace
    ? `/workspaces/${latestWorkspace.id}/collections`
    : "/workspaces";

  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar
        collectionHref={latestWorkspaceCollectionsHref}
        user={user}
      />

      <SidebarInset>
        <Topbar />

        <main className="flex flex-1 flex-col pb-10 ">
          <div className="mx-auto flex w-full max-w-none flex-1 flex-col gap-6">
            {children}
          </div>
        </main>
      </SidebarInset>

      <Suspense fallback={null}>
        <MobileBottomNav collectionHref={latestWorkspaceCollectionsHref} />
      </Suspense>
    </SidebarProvider>
  );
}
