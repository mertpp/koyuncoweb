import { Suspense } from "react";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { getCurrentSession, getCurrentUser } from "@/shared/auth/server";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { Topbar } from "@/components/layout/topbar";
import { SidebarInset, SidebarProvider } from "@/shared/components/ui/sidebar";

export async function AppShell({ children }: { children: React.ReactNode }) {
  const [session, currentUser] = await Promise.all([
    getCurrentSession(),
    getCurrentUser(),
  ]);
  const user = {
    name: session?.user?.email ?? currentUser?.label ?? "User",
    email: session?.user?.email ?? "",
    avatar: session?.user?.image ?? "",
  };

  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar user={user} />

      <SidebarInset>
        <Topbar />

        <main className="flex flex-1 flex-col p-4 pb-24 md:p-6">
          <div className="mx-auto flex w-full max-w-none flex-1 flex-col gap-6">
            {children}
          </div>
        </main>
      </SidebarInset>

      <Suspense fallback={null}>
        <MobileBottomNav />
      </Suspense>
    </SidebarProvider>
  );
}
