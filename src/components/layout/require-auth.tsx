"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

/** Client guard: redirects to /login when there is no session. */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="grid min-h-dvh place-items-center">
        <div className="flex flex-col items-center gap-3 text-ink-muted">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-sm">Loading your workspace…</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
