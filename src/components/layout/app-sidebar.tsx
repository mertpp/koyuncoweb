"use client";
import { LogoutButton } from "@/components/layout/logout-button";
import {
  HomeIcon,
  LayoutDashboardIcon,
  PackageIcon,
  SettingsIcon,
  ShirtIcon,
  TagsIcon,
} from "lucide-react";

import { NavMain } from "@/components/layout/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/shared/components/ui/sidebar";
import Link from "next/link";

const navItems = [
  {
    title: "Inicio",
    url: "/",
    icon: HomeIcon,
  },
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Workspace",
    url: "/workspaces",
    icon: PackageIcon,
    items: [
      {
        title: "Listado",
        url: "/workspaces",
      },
      {
        title: "Nuevo workspace",
        url: "/workspaces/new",
      },
    ],
  },
  {
    title: "Garments",
    url: "/garments",
    icon: ShirtIcon,
    items: [
      {
        title: "Listado",
        url: "/garments",
      },
      {
        title: "Nuevo garment",
        url: "/garments/new",
      },
    ],
  },
  {
    title: "Taxonomía",
    url: "/taxonomy",
    icon: TagsIcon,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: SettingsIcon,
  },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <PackageIcon className="size-4" />
              </div>

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Koyunco</span>
                <span className="truncate text-xs">Panel</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton render={<Link href="/settings" />}>
              <SettingsIcon />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <LogoutButton />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
