import { AppShell } from "@/components/layout/app-shell";

export const instant = false;

export default function ProtectedAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
