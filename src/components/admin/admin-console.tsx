"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Activity,
  CircleCheck,
  ExternalLink,
  LayoutGrid,
  Pencil,
  Plus,
  Settings2,
  Shield,
  Store,
  Trash2,
  UserCog,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Reveal } from "@/components/ui/reveal";
import { StatTile } from "@/components/dashboard/stat-tile";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { CanteenFormDialog } from "@/components/admin/canteen-form-dialog";
import { StaffFormDialog } from "@/components/admin/staff-form-dialog";
import {
  useCanteenSummaries,
  useStaff,
  useStats,
} from "@/lib/hooks/queries";
import {
  useDeleteCanteen,
  useDeleteStaff,
  useSetCanteenOpen,
} from "@/lib/hooks/mutations";
import { formatHours, initials } from "@/lib/utils";
import type { Canteen, CanteenSummary, StaffUser } from "@/lib/types";

export function AdminConsole() {
  const { data: stats, isLoading: loadingStats } = useStats();
  const { data: canteens } = useCanteenSummaries();
  const { data: staff } = useStaff();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <header className="mb-6 flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary-soft text-primary">
          <Shield className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink">
            Admin console
          </h1>
          <p className="text-sm text-ink-muted">
            Oversee every canteen, menu and staff account.
          </p>
        </div>
      </header>

      <Tabs defaultValue="overview">
        <TabsList className="flex-wrap">
          <TabsTrigger value="overview">
            <LayoutGrid className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="canteens">
            <Store className="h-4 w-4" />
            Canteens
          </TabsTrigger>
          <TabsTrigger value="staff">
            <Users className="h-4 w-4" />
            Staff
          </TabsTrigger>
          <TabsTrigger value="activity">
            <Activity className="h-4 w-4" />
            Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab stats={stats} loading={loadingStats} />
        </TabsContent>
        <TabsContent value="canteens">
          <CanteensTab canteens={canteens} />
        </TabsContent>
        <TabsContent value="staff">
          <StaffTab staff={staff} canteens={canteens} />
        </TabsContent>
        <TabsContent value="activity">
          <ActivityFeed canteenId={null} title="Activity across all canteens" />
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* -------------------------------- Overview ------------------------------- */

function OverviewTab({
  stats,
  loading,
}: {
  stats: ReturnType<typeof useStats>["data"];
  loading: boolean;
}) {
  if (loading || !stats) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {[
          <StatTile key="c" tone="primary" icon={<Store className="h-5 w-5" />} label="Canteens" value={stats.totalCanteens} />,
          <StatTile key="o" tone="available" icon={<CircleCheck className="h-5 w-5" />} label="Open now" value={stats.openCanteens} />,
          <StatTile key="t" tone="gold" icon={<UtensilsCrossed className="h-5 w-5" />} label="Total items" value={stats.totalItems} />,
          <StatTile key="a" tone="available" icon={<CircleCheck className="h-5 w-5" />} label="Available" value={stats.availableItems} />,
          <StatTile key="s" tone="sold" icon={<Settings2 className="h-5 w-5" />} label="Sold out" value={stats.soldOutItems} />,
          <StatTile key="st" tone="neutral" icon={<Users className="h-5 w-5" />} label="Staff" value={stats.totalStaff} />,
        ].map((tile, i) => (
          <Reveal key={i} delay={i * 55}>
            {tile}
          </Reveal>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-soft">
        <div className="border-b border-line px-5 py-3.5">
          <h3 className="font-medium text-ink">Per-canteen breakdown</h3>
        </div>
        <div className="divide-y divide-line">
          {stats.perCanteen.map((row) => {
            const pct =
              row.totalCount === 0
                ? 0
                : Math.round((row.availableCount / row.totalCount) * 100);
            return (
              <div
                key={row.canteen.id}
                className="flex items-center gap-4 px-5 py-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-medium text-ink">
                      {row.canteen.name}
                    </p>
                    <Badge tone={row.canteen.isOpen ? "available" : "neutral"} size="sm">
                      {row.canteen.isOpen ? "Open" : "Closed"}
                    </Badge>
                  </div>
                  <p className="text-xs text-ink-subtle">
                    {row.categoryCount} categories · {row.totalCount} items
                  </p>
                </div>
                <div className="hidden w-40 sm:block">
                  <div className="h-2 overflow-hidden rounded-full bg-cream">
                    <div
                      className="h-full rounded-full bg-available transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
                <p className="w-24 text-right text-sm text-ink-muted tabular-nums">
                  {row.availableCount}/{row.totalCount} live
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- Canteens ------------------------------- */

function CanteensTab({ canteens }: { canteens?: CanteenSummary[] }) {
  const setOpen = useSetCanteenOpen();
  const deleteCanteen = useDeleteCanteen();
  const [dialog, setDialog] = useState<{ open: boolean; canteen: Canteen | null }>({
    open: false,
    canteen: null,
  });
  const [confirm, setConfirm] = useState<Canteen | null>(null);

  const handleToggle = async (id: string, next: boolean) => {
    try {
      await setOpen.mutateAsync({ id, isOpen: next });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update.");
    }
  };

  const handleDelete = async () => {
    if (!confirm) return;
    try {
      await deleteCanteen.mutateAsync(confirm.id);
      toast.success(`Deleted ${confirm.name}`);
      setConfirm(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setDialog({ open: true, canteen: null })}>
          <Plus className="h-4 w-4" />
          Create canteen
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {!canteens
          ? Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-44 rounded-2xl" />
            ))
          : canteens.map((canteen) => (
              <div
                key={canteen.id}
                className="rounded-2xl border border-line bg-surface p-5 shadow-soft"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-medium text-ink">
                      {canteen.name}
                    </h3>
                    <p className="mt-0.5 truncate text-sm text-ink-muted">
                      {canteen.location}
                    </p>
                    <p className="mt-0.5 text-xs text-ink-subtle">
                      {formatHours(canteen.opensAt, canteen.closesAt)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Switch
                      checked={canteen.isOpen}
                      onCheckedChange={(v) => handleToggle(canteen.id, v)}
                      aria-label={`Toggle ${canteen.name} open status`}
                    />
                    <span className="text-xs text-ink-subtle">
                      {canteen.isOpen ? "Open" : "Closed"}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-4 text-sm text-ink-muted">
                  <span className="flex items-center gap-1.5">
                    <UtensilsCrossed className="h-4 w-4 text-ink-subtle" />
                    {canteen.availableCount}/{canteen.totalCount} available
                  </span>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
                  <Button asChild variant="secondary" size="sm">
                    <Link href={`/admin/canteen/${canteen.id}`}>
                      <Settings2 className="h-4 w-4" />
                      Manage menu
                    </Link>
                  </Button>
                  <div className="flex items-center gap-1">
                    <Button asChild variant="ghost" size="icon-sm" aria-label="View public menu">
                      <Link href={`/canteen/${canteen.slug}`} target="_blank">
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Edit ${canteen.name}`}
                      onClick={() => setDialog({ open: true, canteen })}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Delete ${canteen.name}`}
                      className="text-ink-subtle hover:text-sold"
                      onClick={() => setConfirm(canteen)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
      </div>

      <CanteenFormDialog
        open={dialog.open}
        onOpenChange={(open) => setDialog((s) => ({ ...s, open }))}
        canteen={dialog.canteen}
      />
      <ConfirmDialog
        open={Boolean(confirm)}
        onOpenChange={(open) => !open && setConfirm(null)}
        title={`Delete ${confirm?.name}?`}
        description="This permanently removes the canteen along with all its categories and menu items."
        confirmLabel="Delete canteen"
        onConfirm={handleDelete}
        loading={deleteCanteen.isPending}
      />
    </div>
  );
}

/* --------------------------------- Staff --------------------------------- */

function StaffTab({
  staff,
  canteens,
}: {
  staff?: StaffUser[];
  canteens?: CanteenSummary[];
}) {
  const deleteStaff = useDeleteStaff();
  const [dialog, setDialog] = useState<{ open: boolean; staff: StaffUser | null }>({
    open: false,
    staff: null,
  });
  const [confirm, setConfirm] = useState<StaffUser | null>(null);

  const canteenName = (id: string | null) =>
    id ? (canteens?.find((c) => c.id === id)?.name ?? "—") : "All canteens";

  const handleDelete = async () => {
    if (!confirm) return;
    try {
      await deleteStaff.mutateAsync(confirm.id);
      toast.success(`Removed ${confirm.name}`);
      setConfirm(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setDialog({ open: true, staff: null })}>
          <UserCog className="h-4 w-4" />
          Add staff
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-soft">
        <div className="divide-y divide-line">
          {!staff
            ? Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="m-4 h-12 rounded-lg" />
              ))
            : staff.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 px-5 py-4"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-cream text-sm font-semibold text-ink-muted">
                    {initials(member.name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-medium text-ink">
                        {member.name}
                      </p>
                      <Badge tone={member.role === "admin" ? "primary" : "gold"} size="sm">
                        {member.role === "admin" ? "Super Admin" : "Staff"}
                      </Badge>
                    </div>
                    <p className="truncate text-sm text-ink-subtle">
                      {member.email} · {canteenName(member.canteenId)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Edit ${member.name}`}
                      onClick={() => setDialog({ open: true, staff: member })}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Remove ${member.name}`}
                      className="text-ink-subtle hover:text-sold"
                      onClick={() => setConfirm(member)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
        </div>
      </div>

      <StaffFormDialog
        open={dialog.open}
        onOpenChange={(open) => setDialog((s) => ({ ...s, open }))}
        canteens={canteens ?? []}
        staff={dialog.staff}
      />
      <ConfirmDialog
        open={Boolean(confirm)}
        onOpenChange={(open) => !open && setConfirm(null)}
        title={`Remove ${confirm?.name}?`}
        description="This staff member will lose access to the dashboard."
        confirmLabel="Remove"
        onConfirm={handleDelete}
        loading={deleteStaff.isPending}
      />
    </div>
  );
}
