import { AppSidebar } from "@/components/layout/app-sidebar";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { Topbar } from "@/components/layout/topbar";
import { SidebarInset, SidebarProvider } from "@/shared/components/ui/sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <Topbar />

        <main className="flex flex-1 flex-col p-4 pb-24 md:p-6">
          <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6">
            {children}
          </div>
        </main>
      </SidebarInset>
      <MobileBottomNav />
    </SidebarProvider>
  );
}
