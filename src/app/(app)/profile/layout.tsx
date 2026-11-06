import { AppShell } from "@/components/layout/app-shell";

export const instant = false;

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
