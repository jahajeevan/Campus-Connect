"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Clock, MapPin, UtensilsCrossed } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn, formatHours, timeAgo } from "@/lib/utils";
import type { CanteenAccent, CanteenSummary } from "@/lib/types";

const ACCENT: Record<
  CanteenAccent,
  { bar: string; chip: string; glow: string }
> = {
  maroon: {
    bar: "from-primary/80 to-primary",
    chip: "bg-primary-soft text-primary",
    glow: "group-hover:shadow-glow",
  },
  gold: {
    bar: "from-gold/70 to-gold",
    chip: "bg-gold-soft text-soon",
    glow: "",
  },
  green: {
    bar: "from-available/70 to-available",
    chip: "bg-available-soft text-available",
    glow: "",
  },
};

export function CanteenCard({ canteen }: { canteen: CanteenSummary }) {
  const accent = ACCENT[canteen.accent];

  return (
    <div>
      <Link
        href={`/canteen/${canteen.slug}`}
        className="group block h-full focus-visible:outline-none"
        aria-label={`View the menu for ${canteen.name}`}
      >
        <motion.article
          whileHover={{ y: -6 }}
          transition={{ type: "spring", stiffness: 320, damping: 26 }}
          className={cn(
            "relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-card transition-shadow duration-300",
            "group-hover:border-line-strong group-focus-visible:ring-2 group-focus-visible:ring-primary/50",
            accent.glow,
          )}
        >
          <div className={cn("h-1.5 w-full bg-gradient-to-r", accent.bar)} />

          <div className="flex flex-1 flex-col p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-medium tracking-tight text-ink">
                  {canteen.name}
                </h3>
                <p className="mt-1 text-sm text-ink-muted text-pretty">
                  {canteen.tagline}
                </p>
              </div>
              <StatusPill isOpen={canteen.isOpen} />
            </div>

            <div className="mt-5 space-y-2 text-sm text-ink-muted">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-ink-subtle" aria-hidden />
                <span className="truncate">{canteen.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-ink-subtle" aria-hidden />
                <span>{formatHours(canteen.opensAt, canteen.closesAt)}</span>
              </div>
            </div>

            <div className="mt-6 flex items-end justify-between border-t border-line pt-5">
              <div className="flex items-center gap-2.5">
                <span
                  className={cn(
                    "grid h-10 w-10 place-items-center rounded-xl",
                    accent.chip,
                  )}
                >
                  <UtensilsCrossed className="h-5 w-5" aria-hidden />
                </span>
                <div className="leading-tight">
                  <p className="text-lg font-semibold text-ink">
                    {canteen.availableCount}
                    <span className="text-sm font-normal text-ink-subtle">
                      {" "}
                      / {canteen.totalCount}
                    </span>
                  </p>
                  <p className="text-xs text-ink-subtle">items available</p>
                </div>
              </div>

              <span className="inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                View menu
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>

            <p className="mt-3 text-xs text-ink-subtle">
              Updated {timeAgo(canteen.lastUpdated)}
            </p>
          </div>
        </motion.article>
      </Link>
    </div>
  );
}

function StatusPill({ isOpen }: { isOpen: boolean }) {
  return (
    <Badge
      tone={isOpen ? "available" : "neutral"}
      className={cn("shrink-0", !isOpen && "text-ink-subtle")}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          isOpen ? "bg-available animate-pulse" : "bg-ink-subtle",
        )}
      />
      {isOpen ? "Open" : "Closed"}
    </Badge>
  );
}

export function CanteenCardSkeleton() {
  return (
    <div className="h-full overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
      <div className="h-1.5 w-full bg-cream" />
      <div className="space-y-5 p-6">
        <div className="flex justify-between">
          <div className="space-y-2">
            <div className="skeleton h-6 w-40 rounded-md" />
            <div className="skeleton h-4 w-52 rounded-md" />
          </div>
          <div className="skeleton h-6 w-16 rounded-full" />
        </div>
        <div className="space-y-2">
          <div className="skeleton h-4 w-44 rounded-md" />
          <div className="skeleton h-4 w-36 rounded-md" />
        </div>
        <div className="flex justify-between border-t border-line pt-5">
          <div className="skeleton h-10 w-28 rounded-md" />
          <div className="skeleton h-5 w-20 rounded-md" />
        </div>
      </div>
    </div>
  );
}
