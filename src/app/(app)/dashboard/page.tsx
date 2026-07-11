"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Store } from "lucide-react";
import { MenuManager } from "@/components/dashboard/menu-manager";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { useAuth } from "@/lib/auth-context";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user?.role === "admin") router.replace("/admin");
  }, [user, router]);

  if (!user || user.role === "admin") return null;

  if (!user.canteenId) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-cream text-ink-subtle">
          <Store className="h-7 w-7" />
        </div>
        <h1 className="mt-6 text-2xl font-medium text-ink">
          No canteen assigned
        </h1>
        <p className="mt-2 text-ink-muted">
          Your account isn&rsquo;t linked to a canteen yet. Please ask a super
          admin to assign one.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <MenuManager canteenId={user.canteenId} />
        <aside className="lg:pt-0">
          <div className="lg:sticky lg:top-24">
            <ActivityFeed canteenId={user.canteenId} />
          </div>
        </aside>
      </div>
    </div>
  );
}
