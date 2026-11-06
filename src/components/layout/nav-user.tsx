"use client";

import {
  BadgeCheckIcon,
  BellIcon,
  ChevronsUpDownIcon,
  CreditCardIcon,
  LogOutIcon,
  SparklesIcon,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import type { Profile } from "@/features/profile/api";
import { API_BASE_URL } from "@/shared/config/api";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/shared/components/ui/sidebar";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const { isMobile } = useSidebar();
  const [profileName, setProfileName] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = session?.azureAccessToken;
    const ownerId = session?.user?.ownerId;

    if (!accessToken && !ownerId) {
      return;
    }

    const controller = new AbortController();

    async function loadProfile() {
      const response = await fetch(`${API_BASE_URL}/v1/profile`, {
        cache: "no-store",
        headers: {
          ...(accessToken ? { authorization: `Bearer ${accessToken}` } : {}),
          ...(!accessToken && ownerId ? { "x-owner-id": ownerId } : {}),
        },
        signal: controller.signal,
      });

      if (!response.ok) {
        return;
      }

      const profile = (await response.json()) as Profile;
      const displayName = profile.display_name?.trim();

      if (displayName) {
        setProfileName(displayName);
      }
    }

    void loadProfile().catch((error: unknown) => {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
    });

    return () => controller.abort();
  }, [session?.azureAccessToken, session?.user?.ownerId]);

  const displayUser = {
    name: (profileName ?? user.name) || session?.user?.email || "User",
    email: session?.user?.email ?? user.email,
    avatar: session?.user?.image ?? user.avatar,
  };

  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    await signOut({ callbackUrl: "/" });
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger className="group/menu-button flex h-12 w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={displayUser.avatar} alt={displayUser.name} />
              <AvatarFallback className="rounded-lg">ME</AvatarFallback>
            </Avatar>

            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{displayUser.name}</span>
              <span className="truncate text-xs text-muted-foreground">
                {displayUser.email}
              </span>
            </div>

            <ChevronsUpDownIcon className="ml-auto size-4" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-56 min-w-56 rounded-xl"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={8}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <button
                  type="button"
                  onClick={() => router.push("/profile")}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm transition hover:bg-accent hover:text-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={displayUser.avatar} alt={displayUser.name} />
                    <AvatarFallback className="rounded-lg">ME</AvatarFallback>
                  </Avatar>

                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{displayUser.name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {displayUser.email}
                    </span>
                  </div>
                </button>
              </DropdownMenuLabel>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem>
                <SparklesIcon />
                <span>Upgrade to Pro</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => router.push("/profile")}>
                <BadgeCheckIcon />
                <span>Profile</span>
              </DropdownMenuItem>

              <DropdownMenuItem>
                <CreditCardIcon />
                <span>Billing</span>
              </DropdownMenuItem>

              <DropdownMenuItem>
                <BellIcon />
                <span>Notifications</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={handleLogout}>
              <LogOutIcon />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
