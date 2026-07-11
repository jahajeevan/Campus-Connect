import { AppHeader } from "@/components/layout/app-header";
import { RequireAuth } from "@/components/layout/require-auth";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAuth>
      <AppHeader />
      <main className="flex-1">{children}</main>
    </RequireAuth>
  );
}
