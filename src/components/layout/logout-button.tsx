"use client";

import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { SidebarMenuButton } from "@/shared/components/ui/sidebar";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    router.push("/login");
    router.refresh();
  }

  return (
    <SidebarMenuButton type="button" onClick={handleLogout}>
      <LogOutIcon />
      <span>Log out</span>
    </SidebarMenuButton>
  );
}
