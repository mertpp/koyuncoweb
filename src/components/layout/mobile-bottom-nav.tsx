"use client";

import { ArchiveIcon, HomeIcon, ShirtIcon, SparklesIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  {
    label: "Today",
    href: "/dashboard",
    icon: HomeIcon,
  },
  {
    label: "Wardrobe",
    href: "/wardrobe",
    icon: ShirtIcon,
  },
  {
    label: "Archive",
    href: "/archive",
    icon: ArchiveIcon,
  },
  {
    label: "Curator",
    href: "/curator",
    icon: SparklesIcon,
  },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/90 px-3 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-4 gap-1 rounded-full border bg-card p-1 shadow-[0_2px_8px_-2px_rgba(28,30,29,0.04),0_12px_24px_-4px_rgba(28,30,29,0.06)]">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center gap-1 rounded-full px-2 py-2 text-[11px] font-medium text-muted-foreground transition-colors data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
              data-active={active}
            >
              <Icon className="size-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
