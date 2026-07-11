"use client";

import {
  CircleSlash,
  History,
  Pencil,
  Plus,
  Power,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useActivity } from "@/lib/hooks/queries";
import { timeAgo } from "@/lib/utils";
import type { ActivityAction } from "@/lib/types";

const ACTION_ICON: Record<ActivityAction, LucideIcon> = {
  create: Plus,
  update: Pencil,
  delete: Trash2,
  toggle_availability: CircleSlash,
  toggle_open: Power,
  login: History,
};

export function ActivityFeed({
  canteenId,
  title = "Recent activity",
}: {
  canteenId?: string | null;
  title?: string;
}) {
  const { data: logs, isLoading } = useActivity(canteenId);

  return (
    <div className="rounded-2xl border border-line bg-surface p-6 shadow-soft">
      <div className="mb-4 flex items-center gap-2">
        <History className="h-4 w-4 text-ink-subtle" />
        <h3 className="font-medium text-ink">{title}</h3>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-lg" />
          ))}
        </div>
      ) : !logs || logs.length === 0 ? (
        <p className="py-6 text-center text-sm text-ink-subtle">
          No activity yet. Your changes will appear here.
        </p>
      ) : (
        <ul className="space-y-1">
          {logs.map((log) => {
            const Icon = ACTION_ICON[log.action] ?? Pencil;
            return (
              <li
                key={log.id}
                className="flex items-start gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-cream/60"
              >
                <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-cream text-ink-muted">
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-ink">
                    <span className="font-medium">{log.entityName}</span>
                    {log.detail && (
                      <span className="text-ink-muted"> — {log.detail}</span>
                    )}
                  </p>
                  <p className="text-xs text-ink-subtle">
                    {log.actorName} · {timeAgo(log.createdAt)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
