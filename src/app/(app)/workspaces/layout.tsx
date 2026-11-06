import { AppShell } from "@/components/layout/app-shell";

export const instant = false;

export default function WorkspacesLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
