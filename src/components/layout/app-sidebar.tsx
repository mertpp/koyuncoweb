"use client";
import { NavUser } from "@/components/layout/nav-user";
import {
  ChartNoAxesCombinedIcon,
  HomeIcon,
  LayersIcon,
  PackageIcon,
  ShirtIcon,
  SparklesIcon,
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
    title: "Today",
    url: "/dashboard",
    icon: HomeIcon,
    isActive: true,
  },
  {
    title: "Garments",
    url: "/garments",
    icon: ShirtIcon,
    items: [
      {
        title: "Archive Index",
        url: "/garments",
      },
      {
        title: "Add Garment",
        url: "/garments/new",
      },
      {
        title: "Pairing Canvas",
        url: "/pairing",
      },
    ],
  },
  {
    title: "Collections",
    url: "/collections",
    icon: LayersIcon,
    items: [
      {
        title: "Capsules",
        url: "/collections",
      },
      {
        title: "Travel Capsule",
        url: "/collections",
      },
      {
        title: "Seasonal Rotation",
        url: "/collections",
      },
    ],
  },
  {
    title: "Stylist",
    url: "/stylist",
    icon: SparklesIcon,
    items: [
      {
        title: "Ask Stylist",
        url: "/stylist",
      },
      {
        title: "Outfit Ideas",
        url: "/stylist",
      },
      {
        title: "Packing Advice",
        url: "/stylist",
      },
      {
        title: "Shopping Advice",
        url: "/stylist",
      },
    ],
  },
  {
    title: "Insights",
    url: "/insights",
    icon: ChartNoAxesCombinedIcon,
    items: [
      {
        title: "Wardrobe Health",
        url: "/insights",
      },
      {
        title: "Rotation",
        url: "/insights",
      },
      {
        title: "Care",
        url: "/insights",
      },
      {
        title: "Gaps",
        url: "/insights",
      },
    ],
  },
];

const data = {
  user: {
    name: "Mert",
    email: "mert@example.com",
    avatar: "",
  },
};

type AppSidebarProps = {
  user?: {
    name: string;
    email: string;
    avatar: string;
  };
};

export function AppSidebar({ user = data.user }: AppSidebarProps) {
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
        <NavUser user={user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
