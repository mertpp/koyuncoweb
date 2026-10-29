"use client";

import {
  HomeIcon,
  LayersIcon,
  PlusCircleIcon,
  ShirtIcon,
  SparklesIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  {
    label: "Today",
    href: "/dashboard",
    icon: HomeIcon,
  },
  {
    label: "Collections",
    href: "/collections",
    icon: LayersIcon,
  },
  {
    label: "Add",
    href: "/wardrobe/new",
    icon: PlusCircleIcon,
    primary: true,
  },
  {
    label: "Workspace",
    href: "/wardrobe",
    icon: ShirtIcon,
  },
  {
    label: "Stylist",
    href: "/stylist",
    icon: SparklesIcon,
  },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5 gap-1 rounded-full border border-white/70 bg-white/80 p-1.5 shadow-[0_12px_40px_rgba(28,30,29,0.14)] backdrop-blur-2xl ring-1 ring-black/5">
        {items.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          if (item.primary) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex -translate-y-2 flex-col items-center justify-center gap-1 rounded-full text-[11px] font-semibold text-primary"
              >
                <span className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_8px_20px_rgba(23,40,25,0.24)]">
                  <Icon className="size-5" />
                </span>
                <span className="leading-none">{item.label}</span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center gap-1 rounded-full px-1 py-2 text-[11px] font-medium text-muted-foreground transition-colors data-[active=true]:text-primary"
              data-active={active}
            >
              <Icon className="size-4" />
              <span className="leading-none">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
