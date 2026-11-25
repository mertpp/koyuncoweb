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
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { profileClientApi } from "@/features/profile/client";
import { fetchWithTimeout } from "@/shared/api/core";

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
  const { data: session, status } = useSession();
  const { isMobile } = useSidebar();
  const [profileName, setProfileName] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading" || !session?.user) {
      return;
    }

    // Ignore a response that arrives after the component is gone or the session changed.
    let active = true;

    profileClientApi
      .getProfile()
      .then((profile) => {
        const displayName = profile.display_name?.trim();

        if (active && displayName) {
          setProfileName(displayName);
        }
      })
      .catch(() => {
        // The name is cosmetic: on failure the menu keeps the session name.
      });

    return () => {
      active = false;
    };
  }, [session?.user, status]);

  const displayUser = {
    name: (profileName ?? user.name) || session?.user?.email || "User",
    email: session?.user?.email ?? user.email,
    avatar: session?.user?.image ?? user.avatar,
  };

  async function handleLogout() {
    await fetchWithTimeout("/api/auth/logout", {
      method: "POST",
    });

    await signOut({ callbackUrl: "/" });
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger className="group/menu-button flex h-12 w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:p-1!">
            <Avatar className="size-8 shrink-0 rounded-lg group-data-[collapsible=icon]:size-6 group-data-[collapsible=icon]:rounded-md">
              <AvatarImage src={displayUser.avatar} alt={displayUser.name} />
              <AvatarFallback className="rounded-lg text-[10px] font-medium group-data-[collapsible=icon]:rounded-md group-data-[collapsible=icon]:text-[9px]">ME</AvatarFallback>
            </Avatar>

            <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
              <span className="truncate font-medium">{displayUser.name}</span>
              <span className="truncate text-xs text-muted-foreground">
                {displayUser.email}
              </span>
            </div>

            <ChevronsUpDownIcon className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-56 min-w-56 rounded-xl"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
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
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => router.push("/profile")}>
                <BadgeCheckIcon />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCardIcon />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BellIcon />
                Notifications
              </DropdownMenuItem>
              <DropdownMenuItem>
                <SparklesIcon />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => void handleLogout()}>
              <LogOutIcon />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
