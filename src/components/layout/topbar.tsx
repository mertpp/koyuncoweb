"use client";

import { Separator } from "@/shared/components/ui/separator";
import { SidebarTrigger } from "@/shared/components/ui/sidebar";

export function Topbar() {
  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-3 border-b bg-background px-4">
      <SidebarTrigger />

      <Separator orientation="vertical" className="h-4" />

      <div className="flex min-w-0 flex-1 items-center">
        <h1 className="truncate text-sm font-medium">Koyunco Web</h1>
      </div>
    </header>
  );
}
